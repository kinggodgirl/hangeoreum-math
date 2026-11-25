-- 한 걸음 수학 · 수업 중 실시간 현황 (도움 요청 · 학생 현황)
-- 이미 schema.sql을 실행한 서버라면 이 파일만 SQL Editor에 붙여 넣고 Run 하세요.
-- 여러 번 실행해도 괜찮아요. (학생 기록은 지워지지 않아요)
--
-- 학생 화면이 1분마다, 그리고 화면을 옮기거나 답을 낼 때 "지금 어디에 있는지"를 알려 줘요.
-- 학생이 [✋ 선생님 도와주세요]를 누르면 손든 시각이 남고, 선생님이 [✓ 도왔어요]를 누르면 내려가요.

create table if not exists public.hg_live (
  sid      text primary key references public.hg_students(sid) on delete cascade,
  loc      text,                 -- 예: '1차시 다면체 · 각뿔대 · 같이 풀기 · 유형 3'
  loc_at   timestamptz,          -- 마지막으로 화면이 살아 있던 시각
  prog_at  timestamptz,          -- 마지막으로 답을 낸 시각
  help_at  timestamptz,          -- 손든 시각 (내리면 null)
  help_loc text,                 -- 손들 때 있던 곳
  ack_at   timestamptz           -- 선생님이 [도왔어요]를 누른 시각 (이전 알림은 숨김)
);
alter table public.hg_live enable row level security;
revoke all on public.hg_live from anon, authenticated;

-- 학생: 지금 있는 곳 알리기 (p_prog = 답을 냈으면 true)
create or replace function public.hg_ping(p_token text, p_loc text, p_prog boolean default false) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; r public.hg_live;
begin
  v_sid := public.hg_sid_of(p_token);
  insert into public.hg_live (sid, loc, loc_at, prog_at) values (v_sid, left(p_loc, 80), now(), case when p_prog then now() end)
  on conflict (sid) do update set loc = coalesce(left(excluded.loc, 80), hg_live.loc), loc_at = now(),
    prog_at = case when p_prog then now() else hg_live.prog_at end
  returning * into r;
  update public.hg_students set last_seen = now() where sid = v_sid and (last_seen is null or last_seen < now() - interval '1 minute');
  return json_build_object('ok', true, 'help', r.help_at is not null);
end $$;

-- 학생: 손들기 / 내리기
create or replace function public.hg_help(p_token text, p_on boolean, p_loc text default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text;
begin
  v_sid := public.hg_sid_of(p_token);
  insert into public.hg_live (sid, loc, loc_at, help_at, help_loc) values (v_sid, left(p_loc, 80), now(), case when p_on then now() end, case when p_on then left(p_loc, 80) end)
  on conflict (sid) do update set loc = coalesce(left(excluded.loc, 80), hg_live.loc), loc_at = now(),
    help_at = case when p_on then coalesce(hg_live.help_at, now()) else null end,
    help_loc = case when p_on then coalesce(left(p_loc, 80), hg_live.help_loc) else null end;
  return json_build_object('ok', true, 'help', p_on);
end $$;

-- 교사: 한 반의 지금 상태 + 오늘 풀이 기록
create or replace function public.hg_t_live(p_token text, p_grade int, p_klass int) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare v_day timestamptz := date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
begin
  perform public.hg_require_teacher(p_token);
  return json_build_object('now', now(), 'students', coalesce((
    select json_agg(json_build_object(
      'sid', s.sid, 'num', s.num, 'last_seen', s.last_seen,
      'loc', l.loc, 'loc_at', l.loc_at, 'prog_at', l.prog_at, 'help_at', l.help_at, 'help_loc', l.help_loc, 'ack_at', l.ack_at,
      'att', coalesce((select json_agg(x order by x.created_at) from (
          select a.lesson, a.kind, a.mode, a.gen, a.seed, a.ptype, a.good, a.wrongs, a.step_wrongs, a.revealed, a.created_at
          from public.hg_attempts a where a.sid = s.sid and a.created_at >= v_day
          order by a.created_at desc limit 60) x), '[]'::json))
      order by s.num)
    from public.hg_students s left join public.hg_live l on l.sid = s.sid
    where s.grade = p_grade and s.klass = p_klass), '[]'::json));
end $$;

-- 교사: [✓ 도왔어요] — 손 내리고, 지금까지의 알림을 숨김 (새로 막히면 다시 나타나요)
create or replace function public.hg_t_ack(p_token text, p_sid text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  insert into public.hg_live (sid, ack_at) values (p_sid, now())
  on conflict (sid) do update set ack_at = now(), help_at = null, help_loc = null;
  return json_build_object('ok', true);
end $$;

revoke execute on function public.hg_ping(text, text, boolean), public.hg_help(text, boolean, text),
  public.hg_t_live(text, int, int), public.hg_t_ack(text, text) from public;
grant execute on function public.hg_ping(text, text, boolean), public.hg_help(text, boolean, text),
  public.hg_t_live(text, int, int), public.hg_t_ack(text, text) to anon, authenticated;
