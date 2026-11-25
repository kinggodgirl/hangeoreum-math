-- 한 걸음 수학 · 선생님 도움 알림
-- 학생이 한 단계에서 3번 틀리면 교사 화면 맨 위에 "🙋 도움이 필요해요"가 떠요.
-- 이미 schema.sql을 실행한 서버라면 이 파일만 SQL Editor에 붙여 넣고 Run 하세요.
-- 여러 번 실행해도 괜찮아요. (학생 기록은 지워지지 않아요)

create table if not exists public.hg_help (
  id         bigserial primary key,
  sid        text not null references public.hg_students(sid) on delete cascade,
  lesson     text not null,
  place      text,              -- 예: '6차시 기둥의 겉넓이 · (3)단계'
  question   text,              -- 그 단계의 질문 (앞부분만)
  created_at timestamptz not null default now(),
  done_at    timestamptz        -- 선생님이 '도와줬어요'를 누른 때
);
create index if not exists hg_help_created on public.hg_help (created_at);
alter table public.hg_help enable row level security;
revoke all on public.hg_help from anon, authenticated;
revoke all on sequence public.hg_help_id_seq from anon, authenticated;

-- 학생: 도움 요청 (한 학생당 1분에 1번, 하루 30번까지)
create or replace function public.hg_help_request(p_token text, p_lesson text, p_place text default null, p_q text default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text;
begin
  v_sid := public.hg_sid_of(p_token);
  if exists (select 1 from public.hg_help where sid = v_sid and created_at > now() - interval '1 minute') then
    return json_build_object('ok', true, 'skipped', true);
  end if;
  if (select count(*) from public.hg_help where sid = v_sid and created_at > now() - interval '1 day') >= 30 then
    return json_build_object('ok', true, 'skipped', true);
  end if;
  insert into public.hg_help (sid, lesson, place, question)
  values (v_sid, left(coalesce(p_lesson, ''), 20), left(p_place, 60), left(p_q, 120));
  return json_build_object('ok', true);
end $$;

-- 교사: 아직 돕지 않은 요청 (최근 3시간). 학년·반을 비우면 전체.
create or replace function public.hg_t_help(p_token text, p_grade int default null, p_klass int default null) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  return coalesce((
    select json_agg(x order by x.created_at) from (
      select h.id, h.sid, s.grade, s.klass, s.num, h.lesson, h.place, h.question, h.created_at
      from public.hg_help h join public.hg_students s on s.sid = h.sid
      where h.done_at is null and h.created_at > now() - interval '3 hours'
        and (p_grade is null or s.grade = p_grade) and (p_klass is null or s.klass = p_klass)) x), '[]'::json);
end $$;

-- 교사: '도와줬어요' (p_id를 비우면 지금 보이는 것 모두)
create or replace function public.hg_t_help_done(p_token text, p_id bigint default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  update public.hg_help set done_at = now() where done_at is null and (p_id is null or id = p_id);
  return json_build_object('ok', true);
end $$;

revoke execute on function public.hg_help_request(text, text, text, text), public.hg_t_help(text, int, int), public.hg_t_help_done(text, bigint) from public;
grant execute on function public.hg_help_request(text, text, text, text), public.hg_t_help(text, int, int), public.hg_t_help_done(text, bigint) to anon, authenticated;
