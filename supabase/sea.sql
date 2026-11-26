-- 한 걸음 수학 · 좌표 해전 (T11)
-- 좌표평면에 배 3척을 숨기고, 번갈아 (x, y)를 불러 상대 배를 모두 맞히면 이겨요.
-- game.sql(숫자야구)을 먼저 실행한 서버에서 이 파일을 SQL Editor에 붙여 넣고 Run 하세요. 여러 번 실행해도 괜찮아요.
--
-- 단계: 하 −3~3 · 판을 눌러 쏘기 · 판돈 최대 10 / 중 −3~3 · 좌표를 골라 쏘기 / 상 −4~4 · 좌표를 고르고 위치(사분면·축)까지 맞혀야 쏘기
-- 포인트: 숫자야구와 같은 장부(hg_bb_ledger)를 써요. 건 만큼만 주고받고, 모은 포인트 기록·보스 데미지는 바뀌지 않아요.
-- 선생님 설정: 숫자야구 켜기/끄기·최대 판돈(hg_class_settings.bb_on, bb_max)을 같이 따라가요.

create table if not exists public.hg_sea_games (
  id          bigint generated always as identity primary key,
  code        text not null,
  host_sid    text not null references public.hg_students(sid) on delete cascade,
  guest_sid   text references public.hg_students(sid) on delete cascade,
  lv          text not null default 'easy' check (lv in ('easy', 'mid', 'hard')),
  stake       int  not null default 0 check (stake between 0 and 100),
  host_ships  jsonb, guest_ships jsonb,  -- [[[x,y],[x,y],...], ...] 배마다 칸 목록
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
create index if not exists hg_sea_games_code  on public.hg_sea_games (code) where status in ('waiting', 'setup', 'playing');
create index if not exists hg_sea_games_host  on public.hg_sea_games (host_sid, created_at desc);
create index if not exists hg_sea_games_guest on public.hg_sea_games (guest_sid, created_at desc);

create table if not exists public.hg_sea_shots (
  id         bigint generated always as identity primary key,
  game_id    bigint not null references public.hg_sea_games(id) on delete cascade,
  who        text not null check (who in ('host', 'guest')),
  rnd        int not null,
  x          smallint, y smallint,        -- 비어 있으면 시간 초과
  res        text not null check (res in ('miss', 'hit', 'sunk', 'wrong', 'timeout')),
  sunk       jsonb,                       -- 가라앉힌 배의 칸들(그때만)
  created_at timestamptz not null default now()
);
create index if not exists hg_sea_shots_game on public.hg_sea_shots (game_id, id);

alter table public.hg_sea_games enable row level security;
alter table public.hg_sea_shots enable row level security;
revoke all on public.hg_sea_games, public.hg_sea_shots from anon, authenticated;
alter table public.hg_bb_ledger add column if not exists sea_id bigint references public.hg_sea_games(id) on delete set null;
create index if not exists hg_bb_ledger_sea on public.hg_bb_ledger (sea_id);

-- 판 크기(−n~n)와 배 길이
create or replace function public.hg_sea_n(p_lv text) returns int
language sql immutable set search_path = public, extensions as $$ select case when p_lv = 'hard' then 4 else 3 end $$;
create or replace function public.hg_sea_lens(p_lv text) returns int[]
language sql immutable set search_path = public, extensions as $$ select case when p_lv = 'hard' then array[4, 3, 2] else array[3, 2, 2] end $$;
create or replace function public.hg_sea_rounds(p_lv text) returns int
language sql immutable set search_path = public, extensions as $$ select case when p_lv = 'hard' then 30 else 25 end $$;

-- 점의 위치: q1~q4 사분면, x x축 위, y y축 위, o 원점
create or replace function public.hg_sea_where(p_x int, p_y int) returns text
language sql immutable set search_path = public, extensions as $$
  select case when p_x = 0 and p_y = 0 then 'o' when p_y = 0 then 'x' when p_x = 0 then 'y'
              when p_x > 0 and p_y > 0 then 'q1' when p_x < 0 and p_y > 0 then 'q2'
              when p_x < 0 and p_y < 0 then 'q3' else 'q4' end
$$;

-- 배 배치 검사: 개수·길이, 판 안, 가로나 세로로 붙은 칸, 겹치지 않기
create or replace function public.hg_sea_valid(p jsonb, p_lv text) returns boolean
language plpgsql immutable set search_path = public, extensions as $$
declare n int := public.hg_sea_n(p_lv); want int[] := public.hg_sea_lens(p_lv); got int[] := '{}'; sh jsonb; c jsonb;
        xs int[]; ys int[]; v_x int; v_y int; seen text[] := '{}'; k text;
begin
  if p is null or jsonb_typeof(p) <> 'array' or jsonb_array_length(p) <> array_length(want, 1) then return false; end if;
  for sh in select value from jsonb_array_elements(p) loop
    if jsonb_typeof(sh) <> 'array' or jsonb_array_length(sh) < 1 then return false; end if;
    xs := '{}'; ys := '{}';
    for c in select value from jsonb_array_elements(sh) loop
      if jsonb_typeof(c) <> 'array' or jsonb_array_length(c) <> 2
         or jsonb_typeof(c -> 0) <> 'number' or jsonb_typeof(c -> 1) <> 'number' then return false; end if;
      v_x := (c ->> 0)::numeric; v_y := (c ->> 1)::numeric;
      if (c ->> 0)::numeric <> v_x or (c ->> 1)::numeric <> v_y or abs(v_x) > n or abs(v_y) > n then return false; end if;
      k := v_x || ',' || v_y;
      if k = any(seen) then return false; end if;
      seen := seen || k; xs := xs || v_x; ys := ys || v_y;
    end loop;
    got := got || jsonb_array_length(sh);
    -- 한 줄로 이어져 있어야 해요
    if (select count(distinct v) from unnest(xs) v) = 1 then
      if (select max(v) - min(v) from unnest(ys) v) <> array_length(ys, 1) - 1 then return false; end if;
    elsif (select count(distinct v) from unnest(ys) v) = 1 then
      if (select max(v) - min(v) from unnest(xs) v) <> array_length(xs, 1) - 1 then return false; end if;
    else return false; end if;
  end loop;
  return (select array_agg(v order by v) from unnest(got) v) = (select array_agg(v order by v) from unnest(want) v);
end $$;

create or replace function public.hg_sea_today(p_sid text) returns int
language sql stable security definer set search_path = public, extensions as $$
  select count(*)::int from public.hg_sea_games
   where (host_sid = p_sid or guest_sid = p_sid) and status <> 'cancelled'
     and (created_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date
$$;

-- 맞힌 칸 수(같은 칸은 한 번만)
create or replace function public.hg_sea_hits(p_id bigint, p_who text) returns int
language sql stable security definer set search_path = public, extensions as $$
  select count(distinct (x, y))::int from public.hg_sea_shots where game_id = p_id and who = p_who and res in ('hit', 'sunk')
$$;
create or replace function public.hg_sea_total(p_ships jsonb) returns int
language sql immutable set search_path = public, extensions as $$
  select coalesce(sum(jsonb_array_length(s)), 0)::int from jsonb_array_elements(coalesce(p_ships, '[]'::jsonb)) s
$$;

create or replace function public.hg_sea_finish(p_id bigint, p_winner text, p_reason text) returns void
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_sea_games;
begin
  select * into g from public.hg_sea_games where id = p_id;
  if g.status <> 'playing' then return; end if;
  update public.hg_sea_games set status = 'done', winner = p_winner, reason = p_reason, turn = null, updated_at = now() where id = p_id;
  if g.stake > 0 then
    if p_winner = 'draw' then
      insert into public.hg_bb_ledger (sid, sea_id, delta, reason) values (g.host_sid, p_id, g.stake, '좌표 해전 무승부'), (g.guest_sid, p_id, g.stake, '좌표 해전 무승부');
    else
      insert into public.hg_bb_ledger (sid, sea_id, delta, reason)
      values (case when p_winner = 'host' then g.host_sid else g.guest_sid end, p_id, 2 * g.stake, '좌표 해전 승리');
    end if;
  end if;
end $$;

-- 차례 넘기기: 방장이 먼저 쏘고, 방장이 다 맞혀도 상대에게 같은 횟수까지 기회가 있어요. 정한 판 수가 끝나면 더 많이 맞힌 쪽이 이겨요.
create or replace function public.hg_sea_step(p_id bigint, p_who text, p_solved boolean) returns void
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_sea_games; v_h int; v_g int;
begin
  select * into g from public.hg_sea_games where id = p_id;
  if p_who = 'host' then
    update public.hg_sea_games set host_solved = case when p_solved then g.round else host_solved end,
           turn = 'guest', turn_at = now(), updated_at = now() where id = p_id;
  elsif p_solved then
    perform public.hg_sea_finish(p_id, case when g.host_solved = g.round then 'draw' else 'guest' end, 'solved');
  elsif g.host_solved = g.round then
    perform public.hg_sea_finish(p_id, 'host', 'solved');
  elsif g.round >= public.hg_sea_rounds(g.lv) then
    v_h := public.hg_sea_hits(p_id, 'host'); v_g := public.hg_sea_hits(p_id, 'guest');
    perform public.hg_sea_finish(p_id, case when v_h > v_g then 'host' when v_g > v_h then 'guest' else 'draw' end, 'rounds');
  else
    update public.hg_sea_games set round = g.round + 1, turn = 'host', turn_at = now(), updated_at = now() where id = p_id;
  end if;
end $$;

create or replace function public.hg_sea_tick(p_id bigint) returns void
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_sea_games; v_to int;
begin
  select * into g from public.hg_sea_games where id = p_id for update;
  if not found then return; end if;
  if g.status = 'waiting' and g.created_at < now() - interval '15 minutes' then
    update public.hg_sea_games set status = 'cancelled', reason = 'expired', updated_at = now() where id = p_id; return;
  end if;
  if g.status = 'setup' and g.updated_at < now() - interval '3 minutes' then
    update public.hg_sea_games set status = 'cancelled', reason = 'setup_timeout', updated_at = now() where id = p_id; return;
  end if;
  if g.status = 'playing' then
    if public.hg_bb_paused(g.host_sid, g.guest_sid) then
      update public.hg_sea_games set turn_at = now() where id = p_id; return;
    end if;
    if g.turn_at < now() - interval '60 seconds' then
      insert into public.hg_sea_shots (game_id, who, rnd, res) values (p_id, g.turn, g.round, 'timeout');
      if g.turn = 'host' then
        update public.hg_sea_games set host_to = host_to + 1 where id = p_id returning host_to into v_to;
      else
        update public.hg_sea_games set guest_to = guest_to + 1 where id = p_id returning guest_to into v_to;
      end if;
      if v_to >= 2 then
        perform public.hg_sea_finish(p_id, case when g.turn = 'host' then 'guest' else 'host' end, 'timeout');
      else
        perform public.hg_sea_step(p_id, g.turn, false);
      end if;
    end if;
  end if;
end $$;

create or replace function public.hg_sea_mine(p_sid text, p_id bigint) returns public.hg_sea_games
language plpgsql volatile security definer set search_path = public, extensions as $$
declare g public.hg_sea_games;
begin
  select * into g from public.hg_sea_games where id = p_id and (host_sid = p_sid or guest_sid = p_sid) for update;
  if not found then raise exception '경기를 찾을 수 없어요.'; end if;
  perform public.hg_sea_tick(p_id);
  select * into g from public.hg_sea_games where id = p_id;
  return g;
end $$;

-- 학생: 로비
create or replace function public.hg_sea_lobby(p_token text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; s public.hg_students; c record; v_mine json; v_open json; v_recent json; v_rec json; r record;
begin
  v_sid := public.hg_sid_of(p_token);
  select * into s from public.hg_students where sid = v_sid;
  select * into c from public.hg_bb_conf(v_sid);
  for r in select id from public.hg_sea_games where status in ('waiting', 'setup', 'playing') and (host_sid = v_sid or guest_sid = v_sid) loop
    perform public.hg_sea_tick(r.id);
  end loop;
  update public.hg_sea_games set status = 'cancelled', reason = 'expired', updated_at = now()
   where status = 'waiting' and created_at < now() - interval '15 minutes';
  select json_build_object('id', g.id, 'code', g.code, 'status', g.status) into v_mine
    from public.hg_sea_games g where g.status in ('waiting', 'setup', 'playing') and (g.host_sid = v_sid or g.guest_sid = v_sid)
   order by g.id desc limit 1;
  select coalesce(json_agg(json_build_object('code', g.code, 'num', hs.num, 'stake', g.stake, 'lv', g.lv) order by g.id desc), '[]'::json) into v_open
    from (select * from public.hg_sea_games g where g.status = 'waiting' and g.host_sid <> v_sid order by g.id desc limit 40) g
    join public.hg_students hs on hs.sid = g.host_sid
   where hs.grade = s.grade and hs.klass = s.klass;
  select json_build_object(
           'w', count(*) filter (where (winner = 'host' and host_sid = v_sid) or (winner = 'guest' and guest_sid = v_sid)),
           'l', count(*) filter (where (winner = 'guest' and host_sid = v_sid) or (winner = 'host' and guest_sid = v_sid)),
           'd', count(*) filter (where winner = 'draw')) into v_rec
    from public.hg_sea_games where status = 'done' and (host_sid = v_sid or guest_sid = v_sid);
  select coalesce(json_agg(x order by x.id desc), '[]'::json) into v_recent from (
    select g.id, g.stake, g.lv, g.winner, case when g.host_sid = v_sid then 'host' else 'guest' end as me,
           (select json_build_object('grade', o.grade, 'klass', o.klass, 'num', o.num) from public.hg_students o
             where o.sid = case when g.host_sid = v_sid then g.guest_sid else g.host_sid end) as opp,
           (select coalesce(sum(l.delta), 0) from public.hg_bb_ledger l where l.sea_id = g.id and l.sid = v_sid) as delta
      from public.hg_sea_games g where g.status = 'done' and (g.host_sid = v_sid or g.guest_sid = v_sid)
     order by g.id desc limit 6) x;
  return json_build_object('available', public.hg_bb_avail(v_sid), 'ledger', public.hg_bb_ledger_sum(v_sid),
    'on', c.bb_on, 'max', c.bb_max, 'easy_max', 10, 'today', public.hg_sea_today(v_sid), 'limit', 10,
    'grade', s.grade, 'klass', s.klass, 'num', s.num, 'mine', v_mine, 'open', v_open, 'record', v_rec, 'recent', v_recent);
end $$;

-- 학생: 방 만들기
create or replace function public.hg_sea_create(p_token text, p_stake int, p_lv text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; c record; v_avail int; v_code text; v_id bigint; v_play bigint; i int;
begin
  v_sid := public.hg_sid_of(p_token);
  select * into c from public.hg_bb_conf(v_sid);
  if not c.bb_on then return json_build_object('ok', false, 'msg', '선생님이 지금은 대결 게임을 꺼 두었어요.'); end if;
  if p_lv is null or p_lv not in ('easy', 'mid', 'hard') then return json_build_object('ok', false, 'msg', '난이도를 다시 골라 주세요.'); end if;
  if p_stake is null or p_stake not in (0, 5, 10, 20, 50) then return json_build_object('ok', false, 'msg', '판돈은 0, 5, 10, 20, 50 중에서 골라 주세요.'); end if;
  if p_stake > c.bb_max then return json_build_object('ok', false, 'msg', format('지금은 판돈을 %s포인트까지만 걸 수 있어요.', c.bb_max)); end if;
  if p_lv = 'easy' and p_stake > 10 then return json_build_object('ok', false, 'msg', '하 단계는 10포인트까지만 걸 수 있어요.'); end if;
  if public.hg_sea_today(v_sid) >= 10 then return json_build_object('ok', false, 'msg', '오늘은 좌표 해전을 10판 다 했어요. 내일 또 해요!'); end if;
  v_avail := public.hg_bb_avail(v_sid);
  if p_stake > v_avail then return json_build_object('ok', false, 'msg', format('쓸 수 있는 포인트가 %s점이라 %s점을 걸 수 없어요.', greatest(v_avail, 0), p_stake)); end if;
  select id into v_play from public.hg_sea_games where status = 'playing' and (host_sid = v_sid or guest_sid = v_sid) limit 1;
  if v_play is not null then return json_build_object('ok', false, 'msg', '진행 중인 경기가 있어요.', 'game', v_play); end if;
  update public.hg_sea_games set status = 'cancelled', reason = 'replaced', updated_at = now()
   where status in ('waiting', 'setup') and (host_sid = v_sid or guest_sid = v_sid);
  for i in 1 .. 30 loop
    v_code := (1000 + floor(random() * 9000))::int::text;
    exit when not exists (select 1 from public.hg_sea_games where code = v_code and status in ('waiting', 'setup', 'playing'));
  end loop;
  insert into public.hg_sea_games (code, host_sid, stake, lv) values (v_code, v_sid, p_stake, p_lv) returning id into v_id;
  return json_build_object('ok', true, 'game', v_id, 'code', v_code);
end $$;

-- 학생: 방 번호로 들어가기
create or replace function public.hg_sea_join(p_token text, p_code text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; c record; g public.hg_sea_games; v_avail int; v_play bigint;
begin
  v_sid := public.hg_sid_of(p_token);
  select * into g from public.hg_sea_games where code = p_code and status = 'waiting' order by id desc limit 1 for update;
  if found then perform public.hg_sea_tick(g.id); select * into g from public.hg_sea_games where id = g.id; end if;
  if g.id is null or g.status <> 'waiting' then return json_build_object('ok', false, 'msg', '그 번호의 방이 없어요. 방 번호를 다시 확인해 주세요.'); end if;
  if g.host_sid = v_sid then return json_build_object('ok', false, 'msg', '내가 만든 방이에요. 친구가 들어오기를 기다려요.', 'game', g.id); end if;
  select * into c from public.hg_bb_conf(v_sid);
  if not c.bb_on then return json_build_object('ok', false, 'msg', '선생님이 지금은 대결 게임을 꺼 두었어요.'); end if;
  if public.hg_sea_today(v_sid) >= 10 then return json_build_object('ok', false, 'msg', '오늘은 좌표 해전을 10판 다 했어요. 내일 또 해요!'); end if;
  v_avail := public.hg_bb_avail(v_sid);
  if g.stake > v_avail then return json_build_object('ok', false, 'msg', format('이 방의 판돈은 %s포인트인데, 쓸 수 있는 포인트가 %s점이에요.', g.stake, greatest(v_avail, 0))); end if;
  select id into v_play from public.hg_sea_games where status = 'playing' and (host_sid = v_sid or guest_sid = v_sid) limit 1;
  if v_play is not null then return json_build_object('ok', false, 'msg', '진행 중인 경기가 있어요.', 'game', v_play); end if;
  update public.hg_sea_games set status = 'cancelled', reason = 'replaced', updated_at = now()
   where status in ('waiting', 'setup') and (host_sid = v_sid or guest_sid = v_sid);
  update public.hg_sea_games set guest_sid = v_sid, status = 'setup', updated_at = now() where id = g.id;
  return json_build_object('ok', true, 'game', g.id);
end $$;

-- 학생: 내 배 숨기기 (둘 다 숨기면 판돈을 걸고 시작)
create or replace function public.hg_sea_ships(p_token text, p_game bigint, p_ships jsonb) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_sea_games;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_sea_mine(v_sid, p_game);
  if g.status <> 'setup' then return json_build_object('ok', false, 'msg', '지금은 배를 숨길 수 없어요.'); end if;
  if not public.hg_sea_valid(p_ships, g.lv) then return json_build_object('ok', false, 'msg', '배 위치가 맞지 않아요. 다시 섞어 주세요.'); end if;
  if g.host_sid = v_sid then update public.hg_sea_games set host_ships = p_ships, updated_at = now() where id = g.id;
  else update public.hg_sea_games set guest_ships = p_ships, updated_at = now() where id = g.id; end if;
  select * into g from public.hg_sea_games where id = g.id;
  if g.host_ships is not null and g.guest_ships is not null then
    if g.stake > 0 and (public.hg_bb_avail(g.host_sid) < g.stake or public.hg_bb_avail(g.guest_sid) < g.stake) then
      update public.hg_sea_games set status = 'cancelled', reason = 'points', updated_at = now() where id = g.id;
      return json_build_object('ok', false, 'msg', '포인트가 모자란 사람이 있어서 경기가 취소됐어요.');
    end if;
    if g.stake > 0 then
      insert into public.hg_bb_ledger (sid, sea_id, delta, reason) values (g.host_sid, g.id, -g.stake, '좌표 해전 판돈'), (g.guest_sid, g.id, -g.stake, '좌표 해전 판돈');
    end if;
    update public.hg_sea_games set status = 'playing', turn = 'host', round = 1, turn_at = now(), updated_at = now() where id = g.id;
  end if;
  return json_build_object('ok', true);
end $$;

-- 학생: 쏘기. 상 단계는 그 점의 위치(사분면·축·원점)를 맞혀야 쏠 수 있어요(틀리면 이번 차례는 넘어가요).
create or replace function public.hg_sea_fire(p_token text, p_game bigint, p_x int, p_y int, p_where text default null) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_sea_games; v_me text; v_opp jsonb; v_res text := 'miss'; v_ship jsonb; sh jsonb; v_sunk jsonb; v_solved boolean := false;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_sea_mine(v_sid, p_game);
  v_me := case when g.host_sid = v_sid then 'host' else 'guest' end;
  if g.status <> 'playing' then return json_build_object('ok', false, 'msg', '경기가 끝났어요.'); end if;
  if public.hg_bb_paused(g.host_sid, g.guest_sid) then return json_build_object('ok', false, 'msg', '선생님이 잠시 멈췄어요.'); end if;
  if g.turn <> v_me then return json_build_object('ok', false, 'msg', '상대 차례예요.'); end if;
  if p_x is null or p_y is null or abs(p_x) > public.hg_sea_n(g.lv) or abs(p_y) > public.hg_sea_n(g.lv) then
    return json_build_object('ok', false, 'msg', format('x, y는 −%s부터 %s까지예요.', public.hg_sea_n(g.lv), public.hg_sea_n(g.lv)));
  end if;
  if exists (select 1 from public.hg_sea_shots where game_id = g.id and who = v_me and x = p_x and y = p_y and res <> 'wrong') then
    return json_build_object('ok', false, 'msg', '이미 쏜 곳이에요. 다른 점을 골라요.');
  end if;
  if g.lv = 'hard' and (p_where is null or p_where <> public.hg_sea_where(p_x, p_y)) then
    v_res := 'wrong';
  else
    v_opp := case when v_me = 'host' then g.guest_ships else g.host_ships end;
    for sh in select value from jsonb_array_elements(v_opp) loop
      if sh @> jsonb_build_array(jsonb_build_array(p_x, p_y)) then v_ship := sh; end if;
    end loop;
    if v_ship is not null then
      v_res := 'hit';
      -- 이 배의 다른 칸을 모두 맞혔으면 가라앉아요
      if not exists (select 1 from jsonb_array_elements(v_ship) c
                      where not ((c -> 0)::int = p_x and (c -> 1)::int = p_y)
                        and not exists (select 1 from public.hg_sea_shots s where s.game_id = g.id and s.who = v_me and s.res in ('hit', 'sunk')
                                         and s.x = (c -> 0)::int and s.y = (c -> 1)::int)) then
        v_res := 'sunk'; v_sunk := v_ship;
      end if;
    end if;
  end if;
  insert into public.hg_sea_shots (game_id, who, rnd, x, y, res, sunk) values (g.id, v_me, g.round, p_x, p_y, v_res, v_sunk);
  if v_me = 'host' then update public.hg_sea_games set host_to = 0 where id = g.id; else update public.hg_sea_games set guest_to = 0 where id = g.id; end if;
  v_solved := public.hg_sea_hits(g.id, v_me) >= public.hg_sea_total(v_opp);
  perform public.hg_sea_step(g.id, v_me, v_res <> 'wrong' and v_solved);
  return json_build_object('ok', true, 'res', v_res, 'where', case when v_res = 'wrong' then public.hg_sea_where(p_x, p_y) end, 'sunk', v_sunk);
end $$;

-- 학생: 경기 화면 (내 배와 상대가 쏜 곳, 내가 쏜 곳. 상대 배는 가라앉은 것만 보이고, 끝나면 모두 보여요)
create or replace function public.hg_sea_state(p_token text, p_game bigint) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_sea_games; v_me text; v_host json; v_guest json; v_shots json;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_sea_mine(v_sid, p_game);
  v_me := case when g.host_sid = v_sid then 'host' else 'guest' end;
  select json_build_object('grade', grade, 'klass', klass, 'num', num) into v_host from public.hg_students where sid = g.host_sid;
  select json_build_object('grade', grade, 'klass', klass, 'num', num) into v_guest from public.hg_students where sid = g.guest_sid;
  select coalesce(json_agg(json_build_object('who', who, 'rnd', rnd, 'x', x, 'y', y, 'res', res, 'sunk', sunk) order by id), '[]'::json) into v_shots
    from public.hg_sea_shots where game_id = g.id;
  return json_build_object('id', g.id, 'code', g.code, 'status', g.status, 'me', v_me, 'stake', g.stake, 'lv', g.lv,
    'round', g.round, 'rounds', public.hg_sea_rounds(g.lv), 'turn', g.turn, 'my_turn', g.status = 'playing' and g.turn = v_me,
    'turn_left', case when g.status = 'playing' then greatest(0, 60 - floor(extract(epoch from (now() - g.turn_at)))::int) end,
    'my_ships', case when v_me = 'host' then g.host_ships else g.guest_ships end,
    'opp_ships', case when g.status = 'done' then (case when v_me = 'host' then g.guest_ships else g.host_ships end) end,
    'opp_ready', case when v_me = 'host' then g.guest_ships is not null else g.host_ships is not null end,
    'winner', g.winner, 'reason', g.reason, 'host', v_host, 'guest', v_guest, 'shots', v_shots,
    'paused', public.hg_bb_paused(g.host_sid, g.guest_sid),
    'delta', (select coalesce(sum(delta), 0) from public.hg_bb_ledger where sea_id = g.id and sid = v_sid),
    'ledger', public.hg_bb_ledger_sum(v_sid));
end $$;

-- 학생: 나가기 (시작 전이면 취소, 경기 중이면 기권)
create or replace function public.hg_sea_leave(p_token text, p_game bigint) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_sid text; g public.hg_sea_games;
begin
  v_sid := public.hg_sid_of(p_token);
  g := public.hg_sea_mine(v_sid, p_game);
  if g.status in ('waiting', 'setup') then
    update public.hg_sea_games set status = 'cancelled', reason = 'left', updated_at = now() where id = g.id;
  elsif g.status = 'playing' then
    perform public.hg_sea_finish(g.id, case when g.host_sid = v_sid then 'guest' else 'host' end, 'forfeit');
  end if;
  return json_build_object('ok', true);
end $$;

revoke execute on function public.hg_sea_n(text), public.hg_sea_lens(text), public.hg_sea_rounds(text), public.hg_sea_where(int, int),
  public.hg_sea_valid(jsonb, text), public.hg_sea_today(text), public.hg_sea_hits(bigint, text), public.hg_sea_total(jsonb),
  public.hg_sea_finish(bigint, text, text), public.hg_sea_step(bigint, text, boolean), public.hg_sea_tick(bigint),
  public.hg_sea_mine(text, bigint) from public, anon, authenticated;
revoke execute on function public.hg_sea_lobby(text), public.hg_sea_create(text, int, text), public.hg_sea_join(text, text),
  public.hg_sea_ships(text, bigint, jsonb), public.hg_sea_fire(text, bigint, int, int, text), public.hg_sea_state(text, bigint),
  public.hg_sea_leave(text, bigint) from public;
grant execute on function public.hg_sea_lobby(text), public.hg_sea_create(text, int, text), public.hg_sea_join(text, text),
  public.hg_sea_ships(text, bigint, jsonb), public.hg_sea_fire(text, bigint, int, int, text), public.hg_sea_state(text, bigint),
  public.hg_sea_leave(text, bigint) to anon, authenticated;

notify pgrst, 'reload schema';
