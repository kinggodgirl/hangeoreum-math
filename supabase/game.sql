-- 한 걸음 수학 · 게임 설정 (우리 반 보스전 + 숫자야구)
-- 이미 schema.sql을 실행한 서버라면 이 파일만 SQL Editor에 붙여 넣고 Run 하세요.
-- 여러 번 실행해도 괜찮아요. (학생 기록은 지워지지 않아요)
--
-- 학생이 포인트를 받으면 그만큼 날마다 쌓아 두고, 같은 반 친구들의 이번 주 합계가 보스에게 준 데미지가 돼요.
-- 개인 순위는 학생에게 보여 주지 않아요. (선생님 화면에서만 학생별 합계를 볼 수 있어요)

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

-- ── 숫자야구: 포인트(쓸 수 있는 포인트)를 걸고 친구와 대결 ──────────
-- 이긴 사람이 판돈을 가져가요. 모은 포인트(학습 기록)와 보스 데미지는 바뀌지 않아요.
alter table public.hg_class_settings add column if not exists bb_on  boolean not null default true;
alter table public.hg_class_settings add column if not exists bb_max int     not null default 20;

create table if not exists public.hg_bb_games (
  id          bigint generated always as identity primary key,
  code        text not null,
  host_sid    text not null references public.hg_students(sid) on delete cascade,
  guest_sid   text references public.hg_students(sid) on delete cascade,
  stake       int  not null default 0 check (stake between 0 and 100),
  digits      smallint not null default 3 check (digits in (2, 3, 4)),
  lv          text check (lv in ('easy', 'mid', 'mh', 'hard')),   -- [T09] 숫자야구 앱과 같은 4단계(하·중·중상·상). 비어 있으면 예전 방식
  host_secret text, guest_secret text,
  status      text not null default 'waiting' check (status in ('waiting', 'setup', 'playing', 'done', 'cancelled')),
  turn        text check (turn in ('host', 'guest')),
  round       int  not null default 1,
  host_solved int,
  host_to     int  not null default 0,
  guest_to    int  not null default 0,
  winner      text check (winner in ('host', 'guest', 'draw')),
  reason      text,
  turn_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
-- [T09] 이미 만든 표에도 4단계 칸 더하기
alter table public.hg_bb_games add column if not exists lv text check (lv in ('easy', 'mid', 'mh', 'hard'));
alter table public.hg_bb_games drop constraint if exists hg_bb_games_digits_check;
alter table public.hg_bb_games add constraint hg_bb_games_digits_check check (digits in (2, 3, 4));
create index if not exists hg_bb_games_code  on public.hg_bb_games (code) where status in ('waiting', 'setup', 'playing');
create index if not exists hg_bb_games_host  on public.hg_bb_games (host_sid, created_at desc);
create index if not exists hg_bb_games_guest on public.hg_bb_games (guest_sid, created_at desc);

create table if not exists public.hg_bb_guesses (
  id         bigint generated always as identity primary key,
  game_id    bigint not null references public.hg_bb_games(id) on delete cascade,
  who        text not null check (who in ('host', 'guest')),
  rnd        int not null,
  guess      text,                       -- 비어 있으면 시간 초과
  s          smallint not null default 0,
  b          smallint not null default 0,
  h          text,                       -- [T09] 하·중 단계 자리별 힌트(O 맞음 · A 자리 다름 · X 없음)
  created_at timestamptz not null default now()
);
alter table public.hg_bb_guesses add column if not exists h text;
create index if not exists hg_bb_guesses_game on public.hg_bb_guesses (game_id, id);

create table if not exists public.hg_bb_ledger (
  id         bigint generated always as identity primary key,
  sid        text not null references public.hg_students(sid) on delete cascade,
  game_id    bigint references public.hg_bb_games(id) on delete set null,
  delta      int not null,
  reason     text not null,
  created_at timestamptz not null default now()
);
create index if not exists hg_bb_ledger_sid on public.hg_bb_ledger (sid);
create index if not exists hg_bb_ledger_game on public.hg_bb_ledger (game_id);

alter table public.hg_bb_games   enable row level security;
alter table public.hg_bb_guesses enable row level security;
alter table public.hg_bb_ledger  enable row level security;
revoke all on public.hg_bb_games, public.hg_bb_guesses, public.hg_bb_ledger from anon, authenticated;

-- 쓸 수 있는 포인트 = 모은 포인트 − 상점에서 쓴 포인트 + 숫자야구 손익 (서버에 저장된 마지막 기록 기준)
create or replace function public.hg_bb_avail(p_sid text) returns int
language plpgsql stable security definer set search_path = public, extensions as $$
declare d jsonb; v_pts int := 0; v_spent int := 0; v_led int;
begin
  select data into d from public.hg_progress where sid = p_sid;
  if d is not null then
    if jsonb_typeof(d -> '_me' -> 'pts') = 'number' then v_pts := greatest(0, floor((d -> '_me' ->> 'pts')::numeric)::int); end if;
    if jsonb_typeof(d -> '_shop' -> 'spent') = 'number' then v_spent := greatest(0, floor((d -> '_shop' ->> 'spent')::numeric)::int); end if;
  end if;
  select coalesce(sum(delta), 0) into v_led from public.hg_bb_ledger where sid = p_sid;
  return v_pts - v_spent + v_led;
end $$;

create or replace function public.hg_bb_ledger_sum(p_sid text) returns int
language sql stable security definer set search_path = public, extensions as $$
  select coalesce(sum(delta), 0)::int from public.hg_bb_ledger where sid = p_sid
$$;

-- 그 학생 반의 숫자야구 설정 (켜짐, 최대 판돈)
create or replace function public.hg_bb_conf(p_sid text, out bb_on boolean, out bb_max int)
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  select coalesce(cs.bb_on, true), coalesce(cs.bb_max, 20) into bb_on, bb_max
    from public.hg_students s left join public.hg_class_settings cs on cs.grade = s.grade and cs.klass = s.klass
   where s.sid = p_sid;
  bb_on := coalesce(bb_on, true); bb_max := coalesce(bb_max, 20);
end $$;

create or replace function public.hg_bb_today(p_sid text) returns int
language sql stable security definer set search_path = public, extensions as $$
  select count(*)::int from public.hg_bb_games
   where (host_sid = p_sid or guest_sid = p_sid) and status <> 'cancelled'
     and (created_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date
$$;

create or replace function public.hg_bb_valid(p text, d int) returns boolean
language sql immutable set search_path = public, extensions as $$
  select p is not null and p ~ ('^[1-9]{' || d || '}$')
     and (select count(distinct c) from regexp_split_to_table(p, '') c) = d
$$;

create or replace function public.hg_bb_score(p_secret text, p_guess text, out s int, out b int)
language plpgsql immutable set search_path = public, extensions as $$
declare i int;
begin
  s := 0; b := 0;
  for i in 1 .. length(p_guess) loop
    if substr(p_secret, i, 1) = substr(p_guess, i, 1) then s := s + 1;
    elsif strpos(p_secret, substr(p_guess, i, 1)) > 0 then b := b + 1;
    end if;
  end loop;
end $$;

-- [T09] 단계별 숫자 범위: 하 1~6·2자리 / 중 1~9·3자리 / 중상 1~6·3자리 / 상 0~9·3자리 (lv가 비면 예전 1~9)
create or replace function public.hg_bb_ok(p text, p_lv text, d int) returns boolean
language sql immutable set search_path = public, extensions as $$
  select p is not null and length(p) = d
     and p ~ ('^[' || case p_lv when 'easy' then '1-6' when 'mh' then '1-6' when 'hard' then '0-9' else '1-9' end || ']+$')
     and (select count(distinct c) from regexp_split_to_table(p, '') c) = d
$$;

create or replace function public.hg_bb_need(p_lv text, d int) returns text
language sql immutable set search_path = public, extensions as $$
  select (case p_lv when 'easy' then '1~6' when 'mh' then '1~6' when 'hard' then '0~9' else '1~9' end) || ' 중 서로 다른 숫자 ' || d || '개'
$$;

-- [T09] 하·중 단계 자리별 힌트: O(숫자·자리 맞음) A(숫자는 있지만 자리 다름) X(없음)
create or replace function public.hg_bb_hint(p_secret text, p_guess text) returns text
language plpgsql immutable set search_path = public, extensions as $$
declare i int; h text := '';
begin
  for i in 1 .. length(p_guess) loop
    if substr(p_secret, i, 1) = substr(p_guess, i, 1) then h := h || 'O';
    elsif strpos(p_secret, substr(p_guess, i, 1)) > 0 then h := h || 'A';
    else h := h || 'X'; end if;
  end loop;
  return h;
end $$;

create or replace function public.hg_bb_paused(p_host text, p_guest text) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists (select 1 from public.hg_students s join public.hg_class_settings cs on cs.grade = s.grade and cs.klass = s.klass
                  where s.sid in (p_host, p_guest) and cs.bb_on = false)
$$;

-- 경기 끝내기 + 판돈 정리
create or replace function public.hg_bb_finish(p_id bigint, p_winner text, p_reason text) returns void
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_bb_games;
begin
  select * into g from public.hg_bb_games where id = p_id;
  if g.status <> 'playing' then return; end if;
  update public.hg_bb_games set status = 'done', winner = p_winner, reason = p_reason, turn = null, updated_at = now() where id = p_id;
  if g.stake > 0 then
    if p_winner = 'draw' then
      insert into public.hg_bb_ledger (sid, game_id, delta, reason) values (g.host_sid, p_id, g.stake, '숫자야구 무승부'), (g.guest_sid, p_id, g.stake, '숫자야구 무승부');
    elsif p_winner = 'host' then
      insert into public.hg_bb_ledger (sid, game_id, delta, reason) values (g.host_sid, p_id, 2 * g.stake, '숫자야구 승리');
    else
      insert into public.hg_bb_ledger (sid, game_id, delta, reason) values (g.guest_sid, p_id, 2 * g.stake, '숫자야구 승리');
    end if;
  end if;
end $$;

-- 한 수가 끝난 뒤 차례 넘기기. 방장이 먼저 두고, 방장이 맞히면 상대도 같은 횟수까지 기회를 받아요.
create or replace function public.hg_bb_step(p_id bigint, p_who text, p_solved boolean) returns void
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_bb_games;
begin
  select * into g from public.hg_bb_games where id = p_id;
  if p_who = 'host' then
    update public.hg_bb_games set host_solved = case when p_solved then g.round else host_solved end,
           turn = 'guest', turn_at = now(), updated_at = now() where id = p_id;
  elsif p_solved then
    perform public.hg_bb_finish(p_id, case when g.host_solved = g.round then 'draw' else 'guest' end, 'solved');
  elsif g.host_solved = g.round then
    perform public.hg_bb_finish(p_id, 'host', 'solved');
  elsif g.round >= 15 then
    perform public.hg_bb_finish(p_id, 'draw', 'rounds');
  else
    update public.hg_bb_games set round = g.round + 1, turn = 'host', turn_at = now(), updated_at = now() where id = p_id;
  end if;
end $$;

-- 시간 지난 방·차례 정리 (요청이 올 때마다 조금씩)
create or replace function public.hg_bb_tick(p_id bigint) returns void
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_bb_games; v_to int;
begin
  select * into g from public.hg_bb_games where id = p_id for update;
  if not found then return; end if;
  if g.status = 'waiting' and g.created_at < now() - interval '15 minutes' then
    update public.hg_bb_games set status = 'cancelled', reason = 'expired', updated_at = now() where id = p_id; return;
  end if;
  if g.status = 'setup' and g.updated_at < now() - interval '3 minutes' then
    update public.hg_bb_games set status = 'cancelled', reason = 'setup_timeout', updated_at = now() where id = p_id; return;
  end if;
  if g.status = 'playing' then
    if public.hg_bb_paused(g.host_sid, g.guest_sid) then
      update public.hg_bb_games set turn_at = now() where id = p_id; return;     -- 선생님이 멈추면 시계도 멈춰요
    end if;
    if g.turn_at < now() - interval '90 seconds' then
      insert into public.hg_bb_guesses (game_id, who, rnd, guess, s, b) values (p_id, g.turn, g.round, null, 0, 0);
      if g.turn = 'host' then
        update public.hg_bb_games set host_to = host_to + 1 where id = p_id returning host_to into v_to;
      else
        update public.hg_bb_games set guest_to = guest_to + 1 where id = p_id returning guest_to into v_to;
      end if;
      if v_to >= 2 then
        perform public.hg_bb_finish(p_id, case when g.turn = 'host' then 'guest' else 'host' end, 'timeout');
      else
        perform public.hg_bb_step(p_id, g.turn, false);
      end if;
    end if;
  end if;
end $$;

-- 내 경기 하나 잠그고 가져오기
create or replace function public.hg_bb_mine(p_sid text, p_id bigint) returns public.hg_bb_games
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_bb_games;
begin
  select * into g from public.hg_bb_games where id = p_id and (host_sid = p_sid or guest_sid = p_sid) for update;
  if not found then raise exception '경기를 찾을 수 없어요.'; end if;
  perform public.hg_bb_tick(p_id);
  select * into g from public.hg_bb_games where id = p_id;
  return g;
end $$;

-- 학생: 로비 (지갑, 우리 반 열린 방, 진행 중인 내 경기, 전적)
create or replace function public.hg_bb_lobby(p_token text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; s public.hg_students; c record; v_mine json; v_open json; v_recent json; v_rec json; r record;
begin
  v_sid := public.hg_sid_of(p_token);
  select * into s from public.hg_students where sid = v_sid;
  select * into c from public.hg_bb_conf(v_sid);
  for r in select id from public.hg_bb_games where status in ('waiting', 'setup', 'playing') and (host_sid = v_sid or guest_sid = v_sid) loop
    perform public.hg_bb_tick(r.id);
  end loop;
  update public.hg_bb_games set status = 'cancelled', reason = 'expired', updated_at = now()
   where status = 'waiting' and created_at < now() - interval '15 minutes';
  select json_build_object('id', g.id, 'code', g.code, 'status', g.status) into v_mine
    from public.hg_bb_games g where g.status in ('waiting', 'setup', 'playing') and (g.host_sid = v_sid or g.guest_sid = v_sid)
   order by g.id desc limit 1;
  select coalesce(json_agg(json_build_object('code', g.code, 'num', hs.num, 'stake', g.stake, 'digits', g.digits, 'lv', g.lv) order by g.id desc), '[]'::json) into v_open
    from (select * from public.hg_bb_games g where g.status = 'waiting' and g.host_sid <> v_sid order by g.id desc limit 40) g
    join public.hg_students hs on hs.sid = g.host_sid
   where hs.grade = s.grade and hs.klass = s.klass;
  select json_build_object(
           'w', count(*) filter (where (winner = 'host' and host_sid = v_sid) or (winner = 'guest' and guest_sid = v_sid)),
           'l', count(*) filter (where (winner = 'guest' and host_sid = v_sid) or (winner = 'host' and guest_sid = v_sid)),
           'd', count(*) filter (where winner = 'draw')) into v_rec
    from public.hg_bb_games where status = 'done' and (host_sid = v_sid or guest_sid = v_sid);
  select coalesce(json_agg(x order by x.id desc), '[]'::json) into v_recent from (
    select g.id, g.updated_at as at, g.stake, g.digits, g.lv, g.winner, g.reason,
           case when g.host_sid = v_sid then 'host' else 'guest' end as me,
           (select json_build_object('grade', o.grade, 'klass', o.klass, 'num', o.num) from public.hg_students o
             where o.sid = case when g.host_sid = v_sid then g.guest_sid else g.host_sid end) as opp,
           (select coalesce(sum(l.delta), 0) from public.hg_bb_ledger l where l.game_id = g.id and l.sid = v_sid) as delta
      from public.hg_bb_games g where g.status = 'done' and (g.host_sid = v_sid or g.guest_sid = v_sid)
     order by g.id desc limit 8) x;
  return json_build_object('available', public.hg_bb_avail(v_sid), 'ledger', public.hg_bb_ledger_sum(v_sid),
    'on', c.bb_on, 'max', c.bb_max, 'lvs', true, 'easy_max', 10, 'today', public.hg_bb_today(v_sid), 'limit', 10,
    'grade', s.grade, 'klass', s.klass, 'num', s.num,
    'mine', v_mine, 'open', v_open, 'record', v_rec, 'recent', v_recent);
end $$;

-- 학생: 방 만들기
drop function if exists public.hg_bb_create(text, int, int);
create or replace function public.hg_bb_create(p_token text, p_stake int, p_digits int default 3, p_lv text default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; c record; v_avail int; v_code text; v_id bigint; v_play bigint; i int; v_d int;
begin
  v_sid := public.hg_sid_of(p_token);
  select * into c from public.hg_bb_conf(v_sid);
  if not c.bb_on then return json_build_object('ok', false, 'msg', '선생님이 지금은 숫자야구를 꺼 두었어요.'); end if;
  if p_stake is null or p_stake not in (0, 5, 10, 20, 50) then return json_build_object('ok', false, 'msg', '판돈은 0, 5, 10, 20, 50 중에서 골라 주세요.'); end if;
  if p_stake > c.bb_max then return json_build_object('ok', false, 'msg', format('지금은 판돈을 %s포인트까지만 걸 수 있어요.', c.bb_max)); end if;
  if p_lv is not null and p_lv not in ('easy', 'mid', 'mh', 'hard') then return json_build_object('ok', false, 'msg', '난이도를 다시 골라 주세요.'); end if;
  if p_lv = 'easy' and p_stake > 10 then return json_build_object('ok', false, 'msg', '하 단계는 10포인트까지만 걸 수 있어요.'); end if;
  v_d := case when p_lv = 'easy' then 2 when p_lv is not null then 3 when p_digits = 4 then 4 else 3 end;
  if public.hg_bb_today(v_sid) >= 10 then return json_build_object('ok', false, 'msg', '오늘은 숫자야구를 10판 다 했어요. 내일 또 해요!'); end if;
  v_avail := public.hg_bb_avail(v_sid);
  if p_stake > v_avail then return json_build_object('ok', false, 'msg', format('쓸 수 있는 포인트가 %s점이라 %s점을 걸 수 없어요.', greatest(v_avail, 0), p_stake)); end if;
  select id into v_play from public.hg_bb_games where status = 'playing' and (host_sid = v_sid or guest_sid = v_sid) limit 1;
  if v_play is not null then return json_build_object('ok', false, 'msg', '진행 중인 경기가 있어요.', 'game', v_play); end if;
  update public.hg_bb_games set status = 'cancelled', reason = 'replaced', updated_at = now()
   where status in ('waiting', 'setup') and (host_sid = v_sid or guest_sid = v_sid);
  for i in 1 .. 30 loop
    v_code := (1000 + floor(random() * 9000))::int::text;
    exit when not exists (select 1 from public.hg_bb_games where code = v_code and status in ('waiting', 'setup', 'playing'));
  end loop;
  insert into public.hg_bb_games (code, host_sid, stake, digits, lv) values (v_code, v_sid, p_stake, v_d, p_lv)
  returning id into v_id;
  return json_build_object('ok', true, 'game', v_id, 'code', v_code);
end $$;

-- 학생: 방 번호로 들어가기
create or replace function public.hg_bb_join(p_token text, p_code text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; c record; g public.hg_bb_games; v_avail int; v_play bigint;
begin
  v_sid := public.hg_sid_of(p_token);
  select * into g from public.hg_bb_games where code = p_code and status = 'waiting' order by id desc limit 1 for update;
  if found then perform public.hg_bb_tick(g.id); select * into g from public.hg_bb_games where id = g.id; end if;
  if g.id is null or g.status <> 'waiting' then return json_build_object('ok', false, 'msg', '그 번호의 방이 없어요. 방 번호를 다시 확인해 주세요.'); end if;
  if g.host_sid = v_sid then return json_build_object('ok', false, 'msg', '내가 만든 방이에요. 친구가 들어오기를 기다려요.', 'game', g.id); end if;
  select * into c from public.hg_bb_conf(v_sid);
  if not c.bb_on then return json_build_object('ok', false, 'msg', '선생님이 지금은 숫자야구를 꺼 두었어요.'); end if;
  if public.hg_bb_today(v_sid) >= 10 then return json_build_object('ok', false, 'msg', '오늘은 숫자야구를 10판 다 했어요. 내일 또 해요!'); end if;
  v_avail := public.hg_bb_avail(v_sid);
  if g.stake > v_avail then return json_build_object('ok', false, 'msg', format('이 방의 판돈은 %s포인트인데, 쓸 수 있는 포인트가 %s점이에요.', g.stake, greatest(v_avail, 0))); end if;
  select id into v_play from public.hg_bb_games where status = 'playing' and (host_sid = v_sid or guest_sid = v_sid) limit 1;
  if v_play is not null then return json_build_object('ok', false, 'msg', '진행 중인 경기가 있어요.', 'game', v_play); end if;
  update public.hg_bb_games set status = 'cancelled', reason = 'replaced', updated_at = now()
   where status in ('waiting', 'setup') and (host_sid = v_sid or guest_sid = v_sid);
  update public.hg_bb_games set guest_sid = v_sid, status = 'setup', updated_at = now() where id = g.id;
  return json_build_object('ok', true, 'game', g.id);
end $$;

-- 학생: 내 비밀 숫자 정하기 (둘 다 정하면 판돈을 걸고 시작)
create or replace function public.hg_bb_secret(p_token text, p_game bigint, p_secret text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_bb_games;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_bb_mine(v_sid, p_game);
  if g.status <> 'setup' then return json_build_object('ok', false, 'msg', '지금은 숫자를 정할 수 없어요.'); end if;
  if not public.hg_bb_ok(p_secret, g.lv, g.digits) then return json_build_object('ok', false, 'msg', public.hg_bb_need(g.lv, g.digits) || '로 정해 주세요.'); end if;
  if g.host_sid = v_sid then update public.hg_bb_games set host_secret = p_secret, updated_at = now() where id = g.id;
  else update public.hg_bb_games set guest_secret = p_secret, updated_at = now() where id = g.id; end if;
  select * into g from public.hg_bb_games where id = g.id;
  if g.host_secret is not null and g.guest_secret is not null then
    if g.stake > 0 and (public.hg_bb_avail(g.host_sid) < g.stake or public.hg_bb_avail(g.guest_sid) < g.stake) then
      update public.hg_bb_games set status = 'cancelled', reason = 'points', updated_at = now() where id = g.id;
      return json_build_object('ok', false, 'msg', '포인트가 모자란 사람이 있어서 경기가 취소됐어요.');
    end if;
    if g.stake > 0 then
      insert into public.hg_bb_ledger (sid, game_id, delta, reason) values (g.host_sid, g.id, -g.stake, '숫자야구 판돈'), (g.guest_sid, g.id, -g.stake, '숫자야구 판돈');
    end if;
    update public.hg_bb_games set status = 'playing', turn = 'host', round = 1, turn_at = now(), updated_at = now() where id = g.id;
  end if;
  return json_build_object('ok', true);
end $$;

-- 학생: 추리하기 (서버가 스트라이크·볼을 계산해요)
create or replace function public.hg_bb_guess(p_token text, p_game bigint, p_guess text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_bb_games; v_me text; v_opp text; r record; v_h text;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_bb_mine(v_sid, p_game);
  v_me := case when g.host_sid = v_sid then 'host' else 'guest' end;
  if g.status <> 'playing' then return json_build_object('ok', false, 'msg', '경기가 끝났어요.'); end if;
  if public.hg_bb_paused(g.host_sid, g.guest_sid) then return json_build_object('ok', false, 'msg', '선생님이 잠시 멈췄어요.'); end if;
  if g.turn <> v_me then return json_build_object('ok', false, 'msg', '상대 차례예요.'); end if;
  if not public.hg_bb_ok(p_guess, g.lv, g.digits) then return json_build_object('ok', false, 'msg', public.hg_bb_need(g.lv, g.digits) || '를 골라 주세요.'); end if;
  v_opp := case when v_me = 'host' then g.guest_secret else g.host_secret end;
  select * into r from public.hg_bb_score(v_opp, p_guess);
  v_h := case when g.lv in ('easy', 'mid') then public.hg_bb_hint(v_opp, p_guess) end;
  insert into public.hg_bb_guesses (game_id, who, rnd, guess, s, b, h) values (g.id, v_me, g.round, p_guess, r.s, r.b, v_h);
  if v_me = 'host' then update public.hg_bb_games set host_to = 0 where id = g.id; else update public.hg_bb_games set guest_to = 0 where id = g.id; end if;
  perform public.hg_bb_step(g.id, v_me, r.s = g.digits);
  return json_build_object('ok', true, 's', r.s, 'b', r.b, 'h', v_h);
end $$;

-- 학생: 경기 화면 (내 비밀 숫자만 보이고, 상대 숫자는 끝나야 보여요)
create or replace function public.hg_bb_state(p_token text, p_game bigint) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_bb_games; v_me text; v_host json; v_guest json; v_guesses json;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_bb_mine(v_sid, p_game);
  v_me := case when g.host_sid = v_sid then 'host' else 'guest' end;
  select json_build_object('grade', grade, 'klass', klass, 'num', num) into v_host from public.hg_students where sid = g.host_sid;
  select json_build_object('grade', grade, 'klass', klass, 'num', num) into v_guest from public.hg_students where sid = g.guest_sid;
  select coalesce(json_agg(json_build_object('who', who, 'rnd', rnd, 'guess', guess, 's', s, 'b', b, 'h', h) order by id), '[]'::json) into v_guesses
    from public.hg_bb_guesses where game_id = g.id;
  return json_build_object('id', g.id, 'code', g.code, 'status', g.status, 'me', v_me, 'stake', g.stake, 'digits', g.digits, 'lv', g.lv,
    'round', g.round, 'turn', g.turn, 'my_turn', g.status = 'playing' and g.turn = v_me,
    'turn_left', case when g.status = 'playing' then greatest(0, 90 - floor(extract(epoch from (now() - g.turn_at)))::int) end,
    'my_secret', case when v_me = 'host' then g.host_secret else g.guest_secret end,
    'opp_secret', case when g.status = 'done' then (case when v_me = 'host' then g.guest_secret else g.host_secret end) end,
    'opp_ready', case when v_me = 'host' then g.guest_secret is not null else g.host_secret is not null end,
    'winner', g.winner, 'reason', g.reason, 'host', v_host, 'guest', v_guest, 'guesses', v_guesses,
    'paused', public.hg_bb_paused(g.host_sid, g.guest_sid),
    'delta', (select coalesce(sum(delta), 0) from public.hg_bb_ledger where game_id = g.id and sid = v_sid),
    'ledger', public.hg_bb_ledger_sum(v_sid));
end $$;

-- 학생: 나가기 (시작 전이면 취소, 경기 중이면 기권)
create or replace function public.hg_bb_leave(p_token text, p_game bigint) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_bb_games;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_bb_mine(v_sid, p_game);
  if g.status in ('waiting', 'setup') then
    update public.hg_bb_games set status = 'cancelled', reason = 'left', updated_at = now() where id = g.id;
  elsif g.status = 'playing' then
    perform public.hg_bb_finish(g.id, case when g.host_sid = v_sid then 'guest' else 'host' end, 'forfeit');
  end if;
  return json_build_object('ok', true);
end $$;

-- 교사: 반의 숫자야구 기록과 설정
create or replace function public.hg_t_bb(p_token text, p_grade int, p_klass int) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare v_on boolean; v_max int; v_games json; v_students json; v_active int; v_today int;
begin
  perform public.hg_require_teacher(p_token);
  select coalesce(bb_on, true), coalesce(bb_max, 20) into v_on, v_max from public.hg_class_settings where grade = p_grade and klass = p_klass;
  v_on := coalesce(v_on, true); v_max := coalesce(v_max, 20);
  with mem as (select sid from public.hg_students where grade = p_grade and klass = p_klass),
       gs as (select g.* from public.hg_bb_games g where g.host_sid in (select sid from mem) or g.guest_sid in (select sid from mem))
  select (select count(*) from gs where status in ('setup', 'playing')),
         (select count(*) from gs where status <> 'cancelled' and (created_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date),
         (select coalesce(json_agg(x order by x.id desc), '[]'::json) from (
            select gs.id, gs.created_at as at, gs.status, gs.stake, gs.digits, gs.winner, gs.reason, gs.round,
                   (select json_build_object('grade', grade, 'klass', klass, 'num', num) from public.hg_students where sid = gs.host_sid) as host,
                   (select json_build_object('grade', grade, 'klass', klass, 'num', num) from public.hg_students where sid = gs.guest_sid) as guest
              from gs order by gs.id desc limit 40) x)
    into v_active, v_today, v_games;
  select coalesce(json_agg(json_build_object('num', s.num, 'games', t.games, 'w', t.w, 'l', t.l, 'd', t.d,
           'net', (select coalesce(sum(delta), 0) from public.hg_bb_ledger l where l.sid = s.sid)) order by s.num), '[]'::json) into v_students
    from public.hg_students s
    join lateral (select count(*) as games,
                         count(*) filter (where (winner = 'host' and host_sid = s.sid) or (winner = 'guest' and guest_sid = s.sid)) as w,
                         count(*) filter (where (winner = 'guest' and host_sid = s.sid) or (winner = 'host' and guest_sid = s.sid)) as l,
                         count(*) filter (where winner = 'draw') as d
                    from public.hg_bb_games g where g.status = 'done' and (g.host_sid = s.sid or g.guest_sid = s.sid)) t on t.games > 0
   where s.grade = p_grade and s.klass = p_klass;
  return json_build_object('on', v_on, 'max', v_max, 'active', v_active, 'today', v_today, 'games', v_games, 'students', v_students);
end $$;

create or replace function public.hg_t_bb_set(p_token text, p_grade int, p_klass int, p_on boolean, p_max int) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  if p_grade not between 1 and 3 or p_klass not between 1 and 20 or p_max not in (0, 5, 10, 20, 50) then
    raise exception '최대 판돈은 0, 5, 10, 20, 50 중에서 골라 주세요.';
  end if;
  insert into public.hg_class_settings (grade, klass, bb_on, bb_max) values (p_grade, p_klass, coalesce(p_on, true), p_max)
  on conflict (grade, klass) do update set bb_on = excluded.bb_on, bb_max = excluded.bb_max;
  return json_build_object('ok', true);
end $$;

revoke execute on function public.hg_bb_avail(text), public.hg_bb_ledger_sum(text), public.hg_bb_conf(text), public.hg_bb_today(text),
  public.hg_bb_paused(text, text), public.hg_bb_finish(bigint, text, text), public.hg_bb_step(bigint, text, boolean),
  public.hg_bb_tick(bigint), public.hg_bb_mine(text, bigint), public.hg_bb_valid(text, int), public.hg_bb_score(text, text),
  public.hg_bb_ok(text, text, int), public.hg_bb_need(text, int), public.hg_bb_hint(text, text) from public, anon, authenticated;
revoke execute on function public.hg_bb_lobby(text), public.hg_bb_create(text, int, int, text), public.hg_bb_join(text, text),
  public.hg_bb_secret(text, bigint, text), public.hg_bb_guess(text, bigint, text), public.hg_bb_state(text, bigint),
  public.hg_bb_leave(text, bigint), public.hg_t_bb(text, int, int), public.hg_t_bb_set(text, int, int, boolean, int) from public;
grant execute on function public.hg_bb_lobby(text), public.hg_bb_create(text, int, int, text), public.hg_bb_join(text, text),
  public.hg_bb_secret(text, bigint, text), public.hg_bb_guess(text, bigint, text), public.hg_bb_state(text, bigint),
  public.hg_bb_leave(text, bigint), public.hg_t_bb(text, int, int), public.hg_t_bb_set(text, int, int, boolean, int) to anon, authenticated;

notify pgrst, 'reload schema';
