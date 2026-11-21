-- 한 걸음 수학 · 게임 설정 (우리 반 보스전)
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

notify pgrst, 'reload schema';
