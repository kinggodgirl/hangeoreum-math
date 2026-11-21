-- ─────────────────────────────────────────────────────────────
-- 한 걸음 수학 · 2단계 로그인 서버 (Supabase / PostgreSQL)
--
-- 사용법
--   1) Supabase 대시보드 → SQL Editor → New query
--   2) 이 파일 전체를 붙여 넣고 Run (여러 번 실행해도 기존 기록은 지워지지 않아요)
--   3) 맨 아래 hg_setup_teacher 줄의 비밀번호를 바꿔서 한 번 더 실행
--
-- 원칙
--   · 학생 이름은 저장하지 않아요. 학년·반·번호와 학습 기록만 저장해요.
--   · 비밀번호(PIN)는 되돌릴 수 없는 해시로만 저장해요.
--   · 표는 사이트에서 직접 읽고 쓸 수 없고(RLS), 아래 함수로만 접근해요.
-- ─────────────────────────────────────────────────────────────

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ── 표 ──────────────────────────────────────────────────────
create table if not exists public.hg_teacher (
  id           smallint primary key default 1 check (id = 1),
  pw_hash      text not null,
  failed       int  not null default 0,
  locked_until timestamptz
);

create table if not exists public.hg_students (
  sid          text primary key,                       -- 예: '1-3-25' (학년-반-번호)
  grade        smallint not null check (grade between 1 and 3),
  klass        smallint not null check (klass between 1 and 20),
  num          smallint not null check (num between 1 and 50),
  pin_hash     text not null,
  failed       int  not null default 0,
  locked_until timestamptz,
  created_at   timestamptz not null default now(),
  last_seen    timestamptz
);

create table if not exists public.hg_sessions (
  token      text primary key,
  sid        text references public.hg_students(sid) on delete cascade,  -- 교사 세션이면 null
  is_teacher boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists hg_sessions_expires on public.hg_sessions (expires_at);

create table if not exists public.hg_progress (
  sid        text primary key references public.hg_students(sid) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.hg_attempts (
  id          bigserial primary key,
  sid         text not null references public.hg_students(sid) on delete cascade,
  lesson      text not null,
  kind        text not null,      -- steps(단계 문제) | practice(연습) | review(복습)
  mode        text,               -- steps(단계 따라) | final(단계 없이)
  gen         text,
  seed        bigint,
  ptype       text,               -- 문제 유형 (예: area:cyl)
  good        boolean not null,
  wrongs      int not null default 0,
  step_wrongs smallint[],         -- 단계별로 틀린 횟수
  revealed    smallint[],         -- 단계별로 정답을 확인했으면 1
  created_at  timestamptz not null default now()
);
create index if not exists hg_attempts_created on public.hg_attempts (created_at);
create index if not exists hg_attempts_sid on public.hg_attempts (sid);

-- 사이트(anon 키)에서 표를 직접 읽거나 쓰지 못하게 막기
alter table public.hg_teacher  enable row level security;
alter table public.hg_students enable row level security;
alter table public.hg_sessions enable row level security;
alter table public.hg_progress enable row level security;
alter table public.hg_attempts enable row level security;
revoke all on public.hg_teacher, public.hg_students, public.hg_sessions, public.hg_progress, public.hg_attempts from anon, authenticated;
revoke all on sequence public.hg_attempts_id_seq from anon, authenticated;

-- ── 내부 도우미 (사이트에서 부를 수 없음) ─────────────────────
create or replace function public.hg_new_token() returns text
language sql volatile security definer set search_path = public, extensions as $$
  select encode(gen_random_bytes(24), 'hex')
$$;

create or replace function public.hg_new_pin() returns text
language sql volatile security definer set search_path = public, extensions as $$
  select lpad(((('x' || encode(gen_random_bytes(3), 'hex'))::bit(24)::int) % 10000)::text, 4, '0')
$$;

create or replace function public.hg_sid_of(p_token text) returns text
language plpgsql stable security definer set search_path = public, extensions as $$
declare r public.hg_sessions;
begin
  select * into r from public.hg_sessions where token = p_token and expires_at > now();
  if not found or r.is_teacher or r.sid is null then
    raise exception '로그인이 끝났어요. 다시 로그인해 주세요.';
  end if;
  return r.sid;
end $$;

create or replace function public.hg_require_teacher(p_token text) returns void
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not exists (select 1 from public.hg_sessions where token = p_token and is_teacher and expires_at > now()) then
    raise exception '교사 로그인이 필요해요. 다시 로그인해 주세요.';
  end if;
end $$;

-- 교사 비밀번호 정하기 (SQL Editor에서만 실행)
create or replace function public.hg_setup_teacher(p_password text) returns text
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  if p_password is null or length(p_password) < 6 then
    raise exception '교사 비밀번호는 6자 이상으로 정해 주세요.';
  end if;
  insert into public.hg_teacher (id, pw_hash) values (1, crypt(p_password, gen_salt('bf', 8)))
  on conflict (id) do update set pw_hash = excluded.pw_hash, failed = 0, locked_until = null;
  delete from public.hg_sessions where is_teacher;
  return '교사 비밀번호를 저장했어요.';
end $$;

-- ── 학생용 함수 ──────────────────────────────────────────────
-- 틀린 비밀번호도 기록해야 잠금이 되므로, 오류를 던지지 않고 ok=false로 알려 줘요.
create or replace function public.hg_login(p_sid text, p_pin text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare s public.hg_students; t text; f int;
begin
  select * into s from public.hg_students where sid = p_sid for update;
  if not found then
    return json_build_object('ok', false, 'msg', '등록되지 않은 번호예요. 학년, 반, 번호를 확인해 주세요.');
  end if;
  if s.locked_until is not null and s.locked_until > now() then
    return json_build_object('ok', false, 'msg',
      format('비밀번호를 여러 번 틀려서 잠시 잠겼어요. %s분 뒤에 다시 해 보세요.', ceil(extract(epoch from (s.locked_until - now())) / 60)::int));
  end if;
  if p_pin is null or s.pin_hash <> crypt(p_pin, s.pin_hash) then
    f := s.failed + 1;
    if f >= 5 then
      update public.hg_students set failed = 0, locked_until = now() + interval '10 minutes' where sid = p_sid;
      return json_build_object('ok', false, 'msg', '비밀번호를 5번 틀려서 10분 동안 잠겼어요. 모르면 선생님께 물어보세요.');
    end if;
    update public.hg_students set failed = f where sid = p_sid;
    return json_build_object('ok', false, 'msg', format('비밀번호가 맞지 않아요. (%s번 더 틀리면 잠겨요)', 5 - f));
  end if;
  delete from public.hg_sessions where expires_at < now();
  t := public.hg_new_token();
  insert into public.hg_sessions (token, sid, is_teacher, expires_at) values (t, s.sid, false, now() + interval '180 days');
  update public.hg_students set failed = 0, locked_until = null, last_seen = now() where sid = s.sid;
  return json_build_object('ok', true, 'token', t, 'sid', s.sid, 'grade', s.grade, 'klass', s.klass, 'num', s.num);
end $$;

create or replace function public.hg_logout(p_token text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  delete from public.hg_sessions where token = p_token;
  return json_build_object('ok', true);
end $$;

create or replace function public.hg_get_progress(p_token text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; r public.hg_progress;
begin
  v_sid := public.hg_sid_of(p_token);
  update public.hg_students set last_seen = now() where sid = v_sid;
  select * into r from public.hg_progress where sid = v_sid;
  if not found then
    return json_build_object('data', '{}'::json, 'updated_at', null);
  end if;
  return json_build_object('data', r.data, 'updated_at', r.updated_at);
end $$;

create or replace function public.hg_save_progress(p_token text, p_data json) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; v_at timestamptz := now();
begin
  v_sid := public.hg_sid_of(p_token);
  if p_data is null or json_typeof(p_data) <> 'object' then
    raise exception '저장할 기록의 모양이 올바르지 않아요.';
  end if;
  if octet_length(p_data::text) > 300000 then
    raise exception '저장할 기록이 너무 커요.';
  end if;
  insert into public.hg_progress (sid, data, updated_at) values (v_sid, p_data::jsonb, v_at)
  on conflict (sid) do update set data = excluded.data, updated_at = excluded.updated_at;
  update public.hg_students set last_seen = v_at where sid = v_sid;
  return json_build_object('ok', true, 'updated_at', v_at);
end $$;

drop function if exists public.hg_log_attempt(text, text, text, text, text, bigint, text, boolean, int, json, json);
create or replace function public.hg_log_attempt(
  p_token text, p_lesson text, p_kind text, p_good boolean, p_wrongs int,
  p_mode text default null, p_gen text default null, p_seed bigint default null, p_ptype text default null,
  p_step_wrongs json default null, p_revealed json default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; v_sw smallint[]; v_rv smallint[];
begin
  v_sid := public.hg_sid_of(p_token);
  if length(coalesce(p_lesson, '')) not between 1 and 20 or p_kind not in ('steps', 'practice', 'review') then
    raise exception '풀이 기록의 모양이 올바르지 않아요.';
  end if;
  if p_step_wrongs is not null and json_typeof(p_step_wrongs) = 'array' and json_array_length(p_step_wrongs) <= 12 then
    v_sw := array(select least(greatest(e::int, 0), 99)::smallint from json_array_elements_text(p_step_wrongs) e);
  end if;
  if p_revealed is not null and json_typeof(p_revealed) = 'array' and json_array_length(p_revealed) <= 12 then
    v_rv := array(select least(greatest(e::int, 0), 1)::smallint from json_array_elements_text(p_revealed) e);
  end if;
  insert into public.hg_attempts (sid, lesson, kind, mode, gen, seed, ptype, good, wrongs, step_wrongs, revealed)
  values (v_sid, left(p_lesson, 20), p_kind, left(p_mode, 10), left(p_gen, 20), p_seed, left(p_ptype, 40),
          coalesce(p_good, false), least(greatest(coalesce(p_wrongs, 0), 0), 999), v_sw, v_rv);
  return json_build_object('ok', true);
end $$;

-- ── 교사용 함수 ──────────────────────────────────────────────
create or replace function public.hg_teacher_login(p_password text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare r public.hg_teacher; t text; f int;
begin
  select * into r from public.hg_teacher where id = 1 for update;
  if not found then
    return json_build_object('ok', false, 'msg', '아직 교사 비밀번호가 정해지지 않았어요. 설치 안내의 hg_setup_teacher 단계를 먼저 해 주세요.');
  end if;
  if r.locked_until is not null and r.locked_until > now() then
    return json_build_object('ok', false, 'msg',
      format('비밀번호를 여러 번 틀려서 잠시 잠겼어요. %s분 뒤에 다시 해 보세요.', ceil(extract(epoch from (r.locked_until - now())) / 60)::int));
  end if;
  if p_password is null or r.pw_hash <> crypt(p_password, r.pw_hash) then
    f := r.failed + 1;
    if f >= 5 then
      update public.hg_teacher set failed = 0, locked_until = now() + interval '10 minutes' where id = 1;
      return json_build_object('ok', false, 'msg', '비밀번호를 5번 틀려서 10분 동안 잠겼어요.');
    end if;
    update public.hg_teacher set failed = f where id = 1;
    return json_build_object('ok', false, 'msg', '교사 비밀번호가 맞지 않아요.');
  end if;
  delete from public.hg_sessions where expires_at < now();
  t := public.hg_new_token();
  insert into public.hg_sessions (token, sid, is_teacher, expires_at) values (t, null, true, now() + interval '12 hours');
  update public.hg_teacher set failed = 0, locked_until = null where id = 1;
  return json_build_object('ok', true, 'token', t);
end $$;

create or replace function public.hg_t_change_password(p_token text, p_old text, p_new text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare r public.hg_teacher;
begin
  perform public.hg_require_teacher(p_token);
  select * into r from public.hg_teacher where id = 1;
  if r.pw_hash <> crypt(coalesce(p_old, ''), r.pw_hash) then
    return json_build_object('ok', false, 'msg', '지금 비밀번호가 맞지 않아요.');
  end if;
  if p_new is null or length(p_new) < 6 then
    return json_build_object('ok', false, 'msg', '새 비밀번호는 6자 이상으로 정해 주세요.');
  end if;
  update public.hg_teacher set pw_hash = crypt(p_new, gen_salt('bf', 8)) where id = 1;
  delete from public.hg_sessions where is_teacher and token <> p_token;
  return json_build_object('ok', true);
end $$;

create or replace function public.hg_t_create_students(p_token text, p_grade int, p_klass int, p_from int, p_to int) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare i int; v_sid text; v_pin text; out json[] := '{}';
begin
  perform public.hg_require_teacher(p_token);
  if p_grade not between 1 and 3 or p_klass not between 1 and 20 or p_from not between 1 and 50 or p_to not between p_from and 50 then
    raise exception '학년은 1~3, 반은 1~20, 번호는 1~50 사이로 정해 주세요.';
  end if;
  for i in p_from .. p_to loop
    v_sid := format('%s-%s-%s', p_grade, p_klass, i);
    if exists (select 1 from public.hg_students where sid = v_sid) then
      out := out || json_build_object('sid', v_sid, 'num', i, 'pin', null, 'existed', true);
    else
      v_pin := public.hg_new_pin();
      insert into public.hg_students (sid, grade, klass, num, pin_hash)
      values (v_sid, p_grade, p_klass, i, crypt(v_pin, gen_salt('bf', 8)));
      out := out || json_build_object('sid', v_sid, 'num', i, 'pin', v_pin, 'existed', false);
    end if;
  end loop;
  return array_to_json(out);
end $$;

create or replace function public.hg_t_reset_pin(p_token text, p_sid text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_pin text := public.hg_new_pin();
begin
  perform public.hg_require_teacher(p_token);
  update public.hg_students set pin_hash = crypt(v_pin, gen_salt('bf', 8)), failed = 0, locked_until = null where sid = p_sid;
  if not found then raise exception '그 학생을 찾을 수 없어요.'; end if;
  delete from public.hg_sessions where sid = p_sid;
  return json_build_object('sid', p_sid, 'pin', v_pin);
end $$;

create or replace function public.hg_t_delete_student(p_token text, p_sid text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  delete from public.hg_students where sid = p_sid;   -- 진도·풀이 기록·세션도 함께 지워져요
  return json_build_object('ok', true);
end $$;

create or replace function public.hg_t_step_stats(p_token text, p_days int default 30) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  return coalesce((
    select json_agg(x order by x.lesson, x.ptype, x.step) from (
      select a.lesson, a.ptype, min(a.gen) as gen, min(a.seed) as seed, u.i::int as step,
             count(*) as n,
             sum(case when coalesce(u.w, 0) > 0 then 1 else 0 end) as wrong,
             sum(case when coalesce(u.r, 0) > 0 then 1 else 0 end) as revealed
      from public.hg_attempts a
      cross join lateral unnest(a.step_wrongs, a.revealed) with ordinality as u(w, r, i)
      where a.mode = 'steps' and a.step_wrongs is not null
        and a.created_at > now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)))
      group by a.lesson, a.ptype, u.i) x), '[]'::json);
end $$;

create or replace function public.hg_t_student_attempts(p_token text, p_sid text, p_limit int default 40) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  return coalesce((
    select json_agg(x) from (
      select lesson, kind, mode, gen, seed, ptype, good, wrongs, step_wrongs, revealed, created_at
      from public.hg_attempts where sid = p_sid
      order by created_at desc limit greatest(1, least(coalesce(p_limit, 40), 200))) x), '[]'::json);
end $$;

-- ── 권한: 도우미는 막고, 사이트가 쓰는 함수만 열기 ─────────────
revoke execute on function public.hg_new_token(), public.hg_new_pin(), public.hg_sid_of(text),
  public.hg_require_teacher(text), public.hg_setup_teacher(text) from public, anon, authenticated;

revoke execute on function
  public.hg_login(text, text), public.hg_logout(text), public.hg_get_progress(text), public.hg_save_progress(text, json),
  public.hg_log_attempt(text, text, text, boolean, int, text, text, bigint, text, json, json),
  public.hg_teacher_login(text), public.hg_t_change_password(text, text, text),
  public.hg_t_create_students(text, int, int, int, int), public.hg_t_reset_pin(text, text), public.hg_t_delete_student(text, text),
  public.hg_t_step_stats(text, int), public.hg_t_student_attempts(text, text, int)
from public;

grant execute on function
  public.hg_login(text, text), public.hg_logout(text), public.hg_get_progress(text), public.hg_save_progress(text, json),
  public.hg_log_attempt(text, text, text, boolean, int, text, text, bigint, text, json, json),
  public.hg_teacher_login(text), public.hg_t_change_password(text, text, text),
  public.hg_t_create_students(text, int, int, int, int), public.hg_t_reset_pin(text, text), public.hg_t_delete_student(text, text),
  public.hg_t_step_stats(text, int), public.hg_t_student_attempts(text, text, int)
to anon, authenticated;

-- ── 게임: 우리 반 보스전 (game.sql과 같은 내용) ─────────────
create table if not exists public.hg_points_daily (
  sid  text not null references public.hg_students(sid) on delete cascade,
  day  date not null,
  pts  int  not null default 0 check (pts >= 0),
  primary key (sid, day)
);
create index if not exists hg_points_daily_day on public.hg_points_daily (day);

create table if not exists public.hg_class_settings (
  grade       smallint not null check (grade between 1 and 3),
  klass       smallint not null check (klass between 1 and 20),
  per_student int      not null default 50 check (per_student between 10 and 500),
  primary key (grade, klass)
);

alter table public.hg_points_daily   enable row level security;
alter table public.hg_class_settings enable row level security;
revoke all on public.hg_points_daily, public.hg_class_settings from anon, authenticated;

-- 반 상태 만들기 (안에서만 쓰는 도우미)
create or replace function public.hg_class_json(p_grade int, p_klass int, p_sid text, p_teacher boolean) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare
  v_today date := (now() at time zone 'Asia/Seoul')::date;
  v_ws    date := date_trunc('week', (now() at time zone 'Asia/Seoul')::date)::date;
  v_members int; v_per int; v_damage int; v_active int; v_my int; v_days json; v_weeks json; v_students json;
begin
  select count(*) into v_members from public.hg_students where grade = p_grade and klass = p_klass;
  select coalesce((select per_student from public.hg_class_settings where grade = p_grade and klass = p_klass), 50) into v_per;
  select coalesce(sum(d.pts), 0), count(distinct case when d.pts > 0 then d.sid end)
    into v_damage, v_active
    from public.hg_points_daily d join public.hg_students s on s.sid = d.sid
   where s.grade = p_grade and s.klass = p_klass and d.day between v_ws and v_today;
  if p_sid is not null then
    select coalesce(sum(pts), 0) into v_my from public.hg_points_daily where sid = p_sid and day between v_ws and v_today;
  end if;
  select json_agg(coalesce(x.pts, 0) order by g.d) into v_days
    from generate_series(v_ws, v_ws + 6, interval '1 day') as g(d)
    left join (select d.day, sum(d.pts) as pts
                 from public.hg_points_daily d join public.hg_students s on s.sid = d.sid
                where s.grade = p_grade and s.klass = p_klass and d.day between v_ws and v_ws + 6
                group by d.day) x on x.day = g.d::date;
  select coalesce(json_agg(json_build_object('w', q.w, 'damage', q.dmg) order by q.w desc), '[]'::json) into v_weeks
    from (select date_trunc('week', d.day)::date as w, sum(d.pts) as dmg
            from public.hg_points_daily d join public.hg_students s on s.sid = d.sid
           where s.grade = p_grade and s.klass = p_klass and d.day >= v_ws - 56 and d.day < v_ws
           group by 1) q;
  if p_teacher then
    select coalesce(json_agg(json_build_object('num', s.num,
             'pts', coalesce((select sum(d.pts) from public.hg_points_daily d where d.sid = s.sid and d.day between v_ws and v_today), 0))
             order by s.num), '[]'::json) into v_students
      from public.hg_students s where s.grade = p_grade and s.klass = p_klass;
  end if;
  return json_build_object('grade', p_grade, 'klass', p_klass, 'today', v_today, 'week_start', v_ws,
    'members', v_members, 'active', v_active, 'damage', v_damage, 'my', v_my, 'per_student', v_per,
    'days', v_days, 'weeks', v_weeks, 'students', v_students);
end $$;

-- 학생: 받은 포인트 보내기 (한 번에 200, 하루 500까지만 쌓여요)
create or replace function public.hg_add_points(p_token text, p_pts int, p_day date default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; v_today date := (now() at time zone 'Asia/Seoul')::date; v_day date; v_cur int; v_add int;
begin
  v_sid := public.hg_sid_of(p_token);
  v_day := coalesce(p_day, v_today);
  if v_day > v_today or v_day < v_today - 3 then v_day := v_today; end if;
  v_add := least(greatest(coalesce(p_pts, 0), 0), 200);
  select pts into v_cur from public.hg_points_daily where sid = v_sid and day = v_day for update;
  v_add := least(v_add, greatest(0, 500 - coalesce(v_cur, 0)));
  if v_add > 0 then
    insert into public.hg_points_daily (sid, day, pts) values (v_sid, v_day, v_add)
    on conflict (sid, day) do update set pts = public.hg_points_daily.pts + excluded.pts;
  end if;
  return json_build_object('ok', true, 'added', v_add);
end $$;

-- 학생: 우리 반 보스전 상태
create or replace function public.hg_class_status(p_token text) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare v_sid text; s public.hg_students;
begin
  v_sid := public.hg_sid_of(p_token);
  select * into s from public.hg_students where sid = v_sid;
  return public.hg_class_json(s.grade, s.klass, v_sid, false);
end $$;

-- 교사: 반 하나의 보스전 상태 (학생별 이번 주 합계 포함)
create or replace function public.hg_t_class_status(p_token text, p_grade int, p_klass int) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  if p_grade not between 1 and 3 or p_klass not between 1 and 20 then
    raise exception '학년은 1~3, 반은 1~20 사이로 정해 주세요.';
  end if;
  return public.hg_class_json(p_grade, p_klass, null, true);
end $$;

-- 교사: 학생 1명당 보스 체력 정하기
create or replace function public.hg_t_set_boss(p_token text, p_grade int, p_klass int, p_per_student int) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  if p_grade not between 1 and 3 or p_klass not between 1 and 20 or p_per_student not between 10 and 500 then
    raise exception '보스 체력은 학생 1명당 10~500 사이로 정해 주세요.';
  end if;
  insert into public.hg_class_settings (grade, klass, per_student) values (p_grade, p_klass, p_per_student)
  on conflict (grade, klass) do update set per_student = excluded.per_student;
  return json_build_object('ok', true);
end $$;

-- 교사 화면 학급 현황: 이번 주 데미지(week_pts) 칸 추가
create or replace function public.hg_t_overview(p_token text) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare v_ws date := date_trunc('week', (now() at time zone 'Asia/Seoul')::date)::date;
begin
  perform public.hg_require_teacher(p_token);
  return coalesce((
    select json_agg(json_build_object(
             'sid', s.sid, 'grade', s.grade, 'klass', s.klass, 'num', s.num,
             'last_seen', s.last_seen,
             'locked', (s.locked_until is not null and s.locked_until > now()),
             'data', coalesce(p.data, '{}'::jsonb), 'updated_at', p.updated_at,
             'attempts_7d', (select count(*) from public.hg_attempts a where a.sid = s.sid and a.created_at > now() - interval '7 days'),
             'week_pts', (select coalesce(sum(d.pts), 0) from public.hg_points_daily d where d.sid = s.sid and d.day >= v_ws))
           order by s.grade, s.klass, s.num)
    from public.hg_students s left join public.hg_progress p on p.sid = s.sid), '[]'::json);
end $$;

revoke execute on function public.hg_class_json(int, int, text, boolean) from public, anon, authenticated;
revoke execute on function public.hg_add_points(text, int, date), public.hg_class_status(text),
  public.hg_t_class_status(text, int, int), public.hg_t_set_boss(text, int, int, int), public.hg_t_overview(text) from public;
grant execute on function public.hg_add_points(text, int, date), public.hg_class_status(text),
  public.hg_t_class_status(text, int, int), public.hg_t_set_boss(text, int, int, int), public.hg_t_overview(text) to anon, authenticated;


-- ── 마지막 단계: 교사 비밀번호 정하기 ─────────────────────────
-- 아래 '여기에-교사-비밀번호' 를 6자 이상의 비밀번호로 바꾸고, 이 줄만 골라 한 번 더 실행하세요.
-- (처음 실행할 때는 그대로 두어도 돼요. 이 줄은 주석이라 실행되지 않아요.)
-- select public.hg_setup_teacher('여기에-교사-비밀번호');
