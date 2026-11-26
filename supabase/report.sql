-- 한 걸음 수학 · 문제 신고
-- 학생이 문제를 풀다가 '정답이 이상해요', '그림이 이상해요' 같은 것을 신고하면 교사 화면에 모여요.
-- 같은 문제는 (gen, seed)로 다시 만들 수 있어서, 교사 화면에서 그 문제를 그대로 열어 볼 수 있어요.
-- 이미 schema.sql을 실행한 서버라면 이 파일만 SQL Editor에 붙여 넣고 Run 하세요. 여러 번 실행해도 괜찮아요.

create table if not exists public.hg_reports (
  id         bigint generated always as identity primary key,
  sid        text references public.hg_students(sid) on delete set null,
  lesson     text not null,
  gen        text,
  seed       bigint,
  ptype      text,
  step       smallint,
  reason     text not null,
  note       text,
  ctx        text,
  done       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists hg_reports_open on public.hg_reports (done, created_at desc);
create index if not exists hg_reports_sid on public.hg_reports (sid);
alter table public.hg_reports enable row level security;
revoke all on public.hg_reports from anon, authenticated;

-- 학생: 신고하기 (로그인하지 않아도 되지만, 하루 신고 수를 막아 둬요)
create or replace function public.hg_report(
  p_token text, p_lesson text, p_gen text, p_seed bigint, p_ptype text, p_step int,
  p_reason text, p_note text default null, p_ctx text default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text := null;
begin
  if p_token is not null then v_sid := public.hg_sid_of(p_token); end if;
  if length(coalesce(p_lesson, '')) not between 1 and 20 or length(coalesce(p_reason, '')) not between 1 and 30 then
    raise exception '신고 내용의 모양이 올바르지 않아요.';
  end if;
  if v_sid is not null and (select count(*) from public.hg_reports where sid = v_sid and created_at > now() - interval '1 day') >= 20 then
    raise exception '오늘은 신고를 너무 많이 했어요. 내일 다시 해 주세요.';
  end if;
  if v_sid is null and (select count(*) from public.hg_reports where sid is null and created_at > now() - interval '1 day') >= 100 then
    raise exception '오늘은 신고가 너무 많아요. 로그인하고 다시 해 주세요.';
  end if;
  insert into public.hg_reports (sid, lesson, gen, seed, ptype, step, reason, note, ctx)
  values (v_sid, left(p_lesson, 20), left(p_gen, 30), p_seed, left(p_ptype, 40), least(greatest(coalesce(p_step, 0), 0), 99),
          left(p_reason, 30), nullif(left(btrim(coalesce(p_note, '')), 200), ''), left(p_ctx, 400));
  return json_build_object('ok', true);
end $$;

-- 교사: 신고 목록 (p_all false면 아직 확인하지 않은 것만)
create or replace function public.hg_t_reports(p_token text, p_all boolean default false) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  return coalesce((select json_agg(row_to_json(x)) from (
    select r.id, r.sid, s.grade, s.klass, s.num, r.lesson, r.gen, r.seed, r.ptype, r.step, r.reason, r.note, r.ctx, r.done, r.created_at
      from public.hg_reports r left join public.hg_students s on s.sid = r.sid
     where coalesce(p_all, false) or not r.done
     order by r.created_at desc limit 100) x), '[]'::json);
end $$;

-- 교사: 확인 표시 (p_done false면 되돌리기)
create or replace function public.hg_t_report_done(p_token text, p_id bigint, p_done boolean default true) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.hg_require_teacher(p_token);
  update public.hg_reports set done = coalesce(p_done, true) where id = p_id;
  return json_build_object('ok', true);
end $$;

revoke execute on function public.hg_report(text, text, text, bigint, text, int, text, text, text),
  public.hg_t_reports(text, boolean), public.hg_t_report_done(text, bigint, boolean) from public;
grant execute on function public.hg_report(text, text, text, bigint, text, int, text, text, text),
  public.hg_t_reports(text, boolean), public.hg_t_report_done(text, bigint, boolean) to anon, authenticated;
