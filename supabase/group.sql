-- 한 걸음 수학 · 방과후 반 (학생 묶음)
-- 방과후 학생들은 정규 반이 서로 달라요. 학년·반·번호가 다른 학생들을 '방과후 반'으로 묶어서
-- 교사 화면의 지금 도울 학생 · 학습 현황 · 많이 막히는 단계를 그 반만 볼 수 있게 해요.
--
-- 이미 schema.sql을 실행한 서버라면 이 파일만 SQL Editor에 붙여 넣고 Run 하세요.
-- 여러 번 실행해도 괜찮아요. (학생 기록은 지워지지 않아요)
-- 학생 이름은 여전히 서버에 저장하지 않아요. (이름은 교사 브라우저에만 남아요)

create table if not exists public.hg_groups (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) between 1 and 30),
  created_at timestamptz not null default now()
);
create table if not exists public.hg_group_members (
  gid      bigint not null references public.hg_groups(id) on delete cascade,
  sid      text   not null references public.hg_students(sid) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (gid, sid)
);
alter table public.hg_groups enable row level security;
alter table public.hg_group_members enable row level security;
revoke all on public.hg_groups, public.hg_group_members from anon, authenticated;

-- 교사: 방과후 반 목록 (반마다 학생 sid 목록)
create or replace function public.hg_t_groups(p_token text) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  return coalesce((select json_agg(json_build_object('id', g.id, 'name', g.name,
      'sids', coalesce((select json_agg(m.sid order by m.sid) from public.hg_group_members m where m.gid = g.id), '[]'::json))
    order by g.id) from public.hg_groups g), '[]'::json);
end $$;

-- 교사: 방과후 반 만들기(p_id null) · 이름 바꾸기
create or replace function public.hg_t_group_save(p_token text, p_id bigint, p_name text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_id bigint; v_name text := btrim(coalesce(p_name, ''));
begin
  perform public.hg_require_teacher(p_token);
  if char_length(v_name) < 1 or char_length(v_name) > 30 then raise exception '반 이름은 1~30자로 정해 주세요.'; end if;
  if p_id is null then
    if (select count(*) from public.hg_groups) >= 30 then raise exception '방과후 반은 30개까지 만들 수 있어요.'; end if;
    insert into public.hg_groups (name) values (v_name) returning id into v_id;
  else
    update public.hg_groups set name = v_name where id = p_id returning id into v_id;
    if v_id is null then raise exception '그 방과후 반을 찾을 수 없어요.'; end if;
  end if;
  return json_build_object('ok', true, 'id', v_id);
end $$;

-- 교사: 방과후 반 지우기 (학생 계정과 기록은 그대로)
create or replace function public.hg_t_group_del(p_token text, p_id bigint) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  delete from public.hg_groups where id = p_id;
  return json_build_object('ok', true);
end $$;

-- 교사: 학생 넣기 / 빼기 (p_on = true 넣기, false 빼기). 없는 번호는 건너뛰어요.
create or replace function public.hg_t_group_members(p_token text, p_id bigint, p_sids text[], p_on boolean) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_n int := 0;
begin
  perform public.hg_require_teacher(p_token);
  if not exists (select 1 from public.hg_groups where id = p_id) then raise exception '그 방과후 반을 찾을 수 없어요.'; end if;
  if coalesce(array_length(p_sids, 1), 0) > 300 then raise exception '한 번에 300명까지 넣을 수 있어요.'; end if;
  if p_on then
    insert into public.hg_group_members (gid, sid)
      select p_id, s.sid from public.hg_students s where s.sid = any(p_sids)
      on conflict do nothing;
    get diagnostics v_n = row_count;
  else
    delete from public.hg_group_members where gid = p_id and sid = any(p_sids);
    get diagnostics v_n = row_count;
  end if;
  return json_build_object('ok', true, 'n', v_n);
end $$;

-- 교사: 고른 학생들의 지금 상태 + 오늘 풀이 기록 (hg_t_live와 같은 모양, 학년·반 포함)
create or replace function public.hg_t_live_sids(p_token text, p_sids text[]) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare v_day timestamptz := date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
begin
  perform public.hg_require_teacher(p_token);
  if coalesce(array_length(p_sids, 1), 0) > 300 then raise exception '한 번에 300명까지 볼 수 있어요.'; end if;
  return json_build_object('now', now(), 'students', coalesce((
    select json_agg(json_build_object(
      'sid', s.sid, 'grade', s.grade, 'klass', s.klass, 'num', s.num, 'last_seen', s.last_seen,
      'loc', l.loc, 'loc_at', l.loc_at, 'prog_at', l.prog_at, 'help_at', l.help_at, 'help_loc', l.help_loc, 'ack_at', l.ack_at,
      'att', coalesce((select json_agg(x order by x.created_at) from (
          select a.lesson, a.kind, a.mode, a.gen, a.seed, a.ptype, a.good, a.wrongs, a.step_wrongs, a.revealed, a.created_at
          from public.hg_attempts a where a.sid = s.sid and a.created_at >= v_day
          order by a.created_at desc limit 60) x), '[]'::json))
      order by s.grade, s.klass, s.num)
    from public.hg_students s left join public.hg_live l on l.sid = s.sid
    where s.sid = any(p_sids)), '[]'::json));
end $$;

-- 교사: 고른 학생들만의 '많이 막히는 단계'
create or replace function public.hg_t_step_stats_sids(p_token text, p_days int, p_sids text[]) returns json
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
      where a.mode = 'steps' and a.step_wrongs is not null and a.sid = any(p_sids)
        and a.created_at > now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)))
      group by a.lesson, a.ptype, u.i) x), '[]'::json);
end $$;

revoke execute on function public.hg_t_groups(text), public.hg_t_group_save(text, bigint, text), public.hg_t_group_del(text, bigint),
  public.hg_t_group_members(text, bigint, text[], boolean), public.hg_t_live_sids(text, text[]), public.hg_t_step_stats_sids(text, int, text[]) from public;
grant execute on function public.hg_t_groups(text), public.hg_t_group_save(text, bigint, text), public.hg_t_group_del(text, bigint),
  public.hg_t_group_members(text, bigint, text[], boolean), public.hg_t_live_sids(text, text[]), public.hg_t_step_stats_sids(text, int, text[]) to anon, authenticated;
