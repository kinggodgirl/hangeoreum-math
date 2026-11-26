# 한 걸음 수학 — 공용 작업 보드 & 인계장 (COLLAB.md)

이 문서는 **Antigravity**와 **Claude Code(클라우드 앱)**가 같은 저장소에서 충돌 없이 협업하기 위한 공용 작업 보드입니다.
세션 시작 시 `AGENTS.md`와 함께 이 파일을 읽고, 맡은 작업의 **허용 파일(`Scope`)** 안에서만 수정한 뒤 `AGENTS.md` 3절 절차대로 `node tests/verify.mjs` 통과 후 반영하세요.

---

## 1. 현재 작업 보드 (Task Board)

| ID | 작업 내용 | 담당 AI | 허용 파일 (`Scope`) | 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **T00** | 자율 머지 협업 규칙·공용 작업 보드 세팅 | Antigravity | `AGENTS.md`, `CLAUDE.md`, `COLLAB.md` | **완료** (`main` 반영) |
| **T01** | Supabase DB 위생 패치 (FK 인덱스 4개 + `hg_bb_valid`/`hg_bb_score` `search_path` 고정 + SQL 동기화 + 어드바이저 재검증) | Antigravity | `supabase/schema.sql`, `supabase/game.sql`, `supabase/group.sql`, `supabase/report.sql` (+ 운영 DB 적용) | **완료** (`main`·DB 반영) |
| **T02** | 테스트·문서·저장소 정비 (`tests/verify.mjs` 입체도형/정수 생성기 검증 추가, `README.md` 최신화, `toast` 안전화, 병합 완료된 구 브랜치 정리) | Antigravity | `tests/verify.mjs`, `README.md`, `js/01-core.js` | **완료** (`main` 반영) |
| **T03** | 시험 범위 차시 확장 A: 3차시 `회전체` · 4차시 `회전체의 성질` (교과서 217~219쪽) | Antigravity *(조율 가능)* | `js/02r-solid-rot.js`(신규), `docs/specs/T03-solid-rot.md`, `index.html`, `js/02-unit-solid.js`(최소 훅), `tests/verify.mjs` | **준비 완료** (`docs/specs/T03-solid-rot.md`) |
| **T04** | 시험 범위 차시 확장 B: 6차시 `기둥의 부피` · 7차시 `뿔의 겉넓이` · 8차시 `뿔의 부피` (교과서 223~231쪽) | Claude Code | `js/02v-solid-vol.js`(신규), `docs/specs/T04-solid-vol.md`, `index.html`, `js/02-unit-solid.js`(최소 훅), `tests/verify.mjs` | **준비 완료** (`docs/specs/T04-solid-vol.md` — 착수 가능) |
| **T05** | 보스전 미니 게임 개편: 혼자 하는 `오늘의 보스 도전`(폭탄 방어전 · 입장권 · 운명의 주사위 · 타이밍 게이지 · 긴급 막기 · 3택1 보물상자 · 놓친 문제 복기). 선생님 기획서(Boss Battle Design Handoff) 기준 | Claude Code | `js/04-games.js`, `js/boss-bank.js`(신규), `boss-raid.css`(신규), `index.html`(로드 2줄), `AGENTS.md`·`COLLAB.md`(문서 한 줄씩) | **완료** |
| **T06** | 열린 6차시 개념 학습 보완 (`poly`·`regular`·`area`·`arc`·`cent`·`sector` 그림 미리 보기 카드·카드 진도·슬라이드 모달·음성 듣기·핵심 낱말 칩·선생님 원 공식·개념 확인 퀴즈 3문항) | Antigravity | `concept-plus.css`(신규), `js/02c-concept-plus.js`(신규), `index.html`(2줄), `js/02-unit-solid.js`(1줄), `tests/verify.mjs`, `COLLAB.md` | **완료** (`main` 반영) |
| **T07** | 열린 차시 개념 학습 교육학적 보완 시범 적용 (`area`·`sector`: 공식 통일·전개도/부채꼴 인터랙티브 발견 활동·인지 부하 축소·전략 선택 가이드) | Antigravity | `concept-plus.css`, `js/02c-concept-plus.js`, `tests/verify.mjs`, `COLLAB.md` | **완료** (`main` 반영) |
| **T08** | 『교과서 한 걸음』 3탭 × 3트랙 시범 전면 개편 (`cent` 중심각과 호: 첫걸음·한걸음·두걸음 루프, 대표 예제, 복합 유형, 적응형 마무리, 기초 연산 연계) | Antigravity | `tracks-cent.css`(신규), `js/02t-tracks-cent.js`(신규), `index.html`, `tests/verify.mjs`, `COLLAB.md` | **완료** (`main` 반영) |
| **T09** | 교사 화면 편의 기능: 📅 이번 주 한눈에(지난 7일 공부한 날·챙길 점·수업 메모 복사) · 🎫 쿠폰 확인/사용함 · 학습 현황 표 머리줄 단원 묶음·점 범례 · 🎮 게임 탭을 학생별 보스 도전 기록으로 | Claude Code | `js/03-teacher.js`, `teacher-plus.css`(신규), `index.html`(1줄), `AGENTS.md`·`COLLAB.md`(문서) | **완료** |
| **T10** | 숫자야구 4단계 난이도(하·중·중상·상, 선생님 숫자야구 앱과 같은 규칙) + 하 단계 판돈 최대 10포인트 · 보드게임 후보 제안 | Claude Code | `js/04-games.js`(숫자야구 부분), `boss-raid.css`(끝에 몇 줄), `js/07-print-omr-boot.js`(라우터 1줄), `supabase/game.sql`(숫자야구 함수) + 운영 DB 적용, `COLLAB.md` | **완료** (`main`·DB 반영) |
| **T11** | 새 미니게임 `⚓ 좌표 해전`: 좌표평면에 배 3척을 숨기고 (x, y)로 찾는 2인 대결(하·중·상, 판돈은 숫자야구와 같은 장부, 하 최대 10P) + 컴퓨터와 연습 | Claude Code | `js/04s-sea.js`(신규), `sea.css`(신규), `supabase/sea.sql`(신규) + 운영 DB 적용, `index.html`(2줄), `js/07-print-omr-boot.js`(라우터 2줄), `tests/verify.mjs`(1줄), `COLLAB.md` | **코드 완료 · DB 적용 대기** |
| **T12** | 교과서 시험 범위 문제 꼬리표 은행(Ⅳ 전체 · Ⅵ-04·05 · Ⅶ-01~04, 192문항). **저장소 밖** 선생님 컴퓨터 `ai` 폴더에 보관 | Claude Code | (저장소 파일 없음) `COLLAB.md` 경로 안내만 | **완료** |
| **T13** | 『교과서 한 걸음』 세 걸음 목표(🌱 사례·비사례 + 교사 지시 따라 하기 · 🌿 기본 유형 숙달 + 자주 나오는 복합 4가지 · 🌳 모든 시험형 문제)와 이틀 연속 숙달 확인 `[복습 추천]` 설계 | Claude Code | `docs/specs/T13-track-goals-review.md`(신규), `COLLAB.md` | **스펙 완료** (구현은 새 번호로) |

---

## 2. 충돌 방지 규칙 요약

1. **상세 스펙 분리**: 각 작업의 교과서 문제 유형·설계 요구사항은 `docs/specs/Txx-*.md`에 따로 둡니다. `COLLAB.md` 충돌을 줄이기 위해 이 표의 상태 갱신은 작업 완료 시 한 줄 수정으로 최소화합니다.
2. **신규 차시 독립 파일 원칙**: `js/02-unit-solid.js`(214KB)에 직접 코드를 덧붙이지 말고, `js/06c-unit-circle.js`처럼 IIFE로 감싼 별도 모듈(`js/02r-solid-rot.js`, `js/02v-solid-vol.js`)로 작성합니다.
3. **공용 파일 최소 수정**: `index.html`, `js/02-unit-solid.js`, `tests/verify.mjs`를 건드릴 때는 필요한 1~3줄만 수정하고, 동일 공용 파일을 두 작업이 동시에 바꾸지 않도록 이 보드의 상태를 먼저 확인합니다.
4. **커밋·PR 식별자**: 모든 커밋 메시지와 PR 제목에 `[Txx]`를 넣어(`예: feat(solid): [T04] 기둥의 부피·뿔의 겉넓이·뿔의 부피 차시 구현`), 문제 시 해당 작업만 즉시 되돌릴 수 있게 합니다.
5. **자율 머지 규칙**:
   - `main`에 직접 푸시 가능하고 `node tests/verify.mjs`를 통과했으면 각 AI가 자율적으로 `main`에 반영합니다.
   - Claude Code 클라우드 앱이 `claude/*` 브랜치 PR만 생성할 수 있는 환경이라면 `[Txx]` 제목으로 PR을 올리면 되고, **Antigravity가 검증·CI 확인 후 대신 머지**합니다.

---

## 3. 선생님용 빠른 지시 템플릿

### Claude Code 클라우드 앱에 작업 맡길 때
```text
AGENTS.md, COLLAB.md와 docs/specs/T04-solid-vol.md를 읽고 T04 작업을 진행해 줘.
허용 파일(Scope)만 수정하고, node tests/verify.mjs 통과 후 규칙대로 반영(또는 [T04] PR 생성)해 줘.
```

### Claude Code가 올린 PR을 Antigravity가 대신 검증·머지할 때
```text
클로드가 올린 PR 확인하고 문제없으면 머지해 줘.
```

### 문제 발생 시 특정 작업만 되돌릴 때
```text
방금 반영한 [Txx] 작업에 문제가 있어서 되돌려 줘.
```

---

## 4. 인계 로그 (Handoff Log)

* **2026-11-26 (`T13` 스펙, Claude Code)**: 선생님과 논의한 세 걸음 목표·한걸음 복합 4가지(`sector:shade`·뿔대·`cent:ratio`·잘라 낸 입체)·`[복습 추천]`(다음 날 쌍둥이 3문제, 다 맞히면 숙달 ✓, 3일·7일 뒤 1문제, 하루 최대 3문제·+2P)을 `docs/specs/T13-track-goals-review.md`에 정리. **Antigravity 꼬리표 작업이 끝나면 시범 차시 `cent`부터 이 기준으로 구현**해 주세요(새 `Txx`로 등록).
* **2026-11-26 (`T12` 완료, Claude Code)**: 시험 범위 교과서 문제 192문항 꼬리표 은행(차시 `lesson`·유형 `type`·난이도 `level` 1~3·기초 연산 칸 `calc`·답 모양 `form`·보스용 `boss`)은 선생님 요청으로 **저장소에 두지 않고** `C:\Users\minge\OneDrive - 대청중학교\ai\교과서 문제 꼬리표\`에 있어요(`textbook-bank.json` · 형식 설명 `textbook-bank.md` · 검사 `node check-bank.mjs <저장소 폴더>`). 새 차시·보스전·미니게임 문제를 만들 때 이 파일을 기준으로 쓰고, 저장소에는 복사하지 마세요. Ⅳ단원 차시 id 제안: `coord`·`graph`·`prop`·`inv`.
* **2026-11-26 (`T11` 완료, Claude Code)**
  * 새 미니게임 **⚓ 좌표 해전**(`#sea`, 처음 화면 숫자야구 띠 아래 `sea-strip`). 단계: **하** −3~3·판을 눌러 쏘기·판돈 최대 10 / **중** −3~3·x, y 버튼으로 골라 쏘기 / **상** −4~4·좌표 + 그 점의 위치(제1~4사분면·x축·y축·원점)까지 맞혀야 쏘기(틀리면 차례 넘김). 배는 하·중 3·2·2칸, 상 4·3·2칸. 방장 먼저, 같은 횟수 보장, 하·중 25번·상 30번 뒤엔 맞힌 칸 수로 승부, 60초 시간 제한.
  * 서버: `supabase/sea.sql`(신규) — `hg_sea_games`·`hg_sea_shots`, 학생 RPC `hg_sea_lobby/create/join/ships/fire/state/leave`. 배 위치는 서버만 알고(가라앉은 배·끝난 뒤만 공개), 맞힘 판정도 서버. 포인트는 숫자야구 장부 `hg_bb_ledger`에 `sea_id` 칸을 더해 같이 써요(쓸 수 있는 포인트 공유, 이유 '좌표 해전 판돈/승리/무승부'). 켜기/끄기·최대 판돈은 숫자야구 설정(`bb_on`, `bb_max`)을 따라가요. 하루 10판.
  * **운영 DB에 `supabase/sea.sql` 적용 필요**(Antigravity). 적용 전에는 친구 대결 대신 안내 문구와 컴퓨터 연습만 보여요. 로컬 Postgres 16에서 두 번 실행·한 판 끝까지·판돈 정산·기권 확인함.
  * 교사 화면(`03-teacher.js`)에는 아직 좌표 해전 기록이 없어요(학생 순 손익은 장부 합계라 숫자야구 칸에 같이 잡혀요).

* **2026-11-26 (`T10` 완료, Claude Code)**
  * 숫자야구에 선생님 앱(`kinggodgirl/number-baseball`)과 같은 4단계 추가: **하** 1~6·2자리·○△× / **중** 1~9·3자리·○△× / **중상** 1~6·3자리·S/B / **상** 0~9·3자리·S/B. **하는 판돈 최대 10포인트**(화면과 서버 둘 다 막음). 컴퓨터와 연습도 4단계(`#bb-cpu-easy|mid|mh|hard`).
  * 서버: `hg_bb_games.lv`(비면 예전 3·4자리 방식), `digits`에 2 허용, `hg_bb_guesses.h`(자리별 힌트 O/A/X), 새 함수 `hg_bb_ok`·`hg_bb_need`·`hg_bb_hint`, `hg_bb_create`에 `p_lv` 인자(기본 null이라 옛 화면도 그대로 동작). 운영 DB 마이그레이션 `t10_bb_levels`는 선생님 확인 뒤 적용(적용 전에는 친구 대결이 예전 3·4자리 화면 그대로, 컴퓨터 연습만 4단계).
  * 화면은 로비 응답의 `lvs`가 있을 때만 4단계를 보여 줘서, DB 적용 전·후 어느 쪽에서도 깨지지 않아요. 교사 화면(`03-teacher.js`)은 건드리지 않았어요(경기 목록의 `digits`가 2로 보일 수 있음).
  * **운영 DB 적용·검증 완료 (Antigravity)**: `zlwelfgvfbacmpeqwnkx`에 `supabase/game.sql` 반영 확인(`hg_bb_games.lv`, `digits in (2,3,4)`, `hg_bb_guesses.h`, `hg_bb_ok`/`hg_bb_hint` 정상, 4인자 `hg_bb_create` 단일화, security/performance 어드바이저 신규 경고 없음).

* **2026-11-26 (`T09` 후속, Claude Code)**: 학생 자세히 창에 `👀 이 학생 화면 보기`(보기 전용) 추가. `peekStart`가 교사 화면이 받은 `s.data`를 잠깐 `DB` 자리에 두고 `save`를 빈 함수로 바꿔 학생 화면을 띄워요(서버·교사 기기 기록 모두 안 바뀜). 위쪽 띠의 [교사 화면으로 돌아가기] 또는 `#teacher` 진입 시 `peekEnd`로 원래 `DB`·`save` 복구. 선생님 확인: 학생 비밀번호 한 번만 보이기(암호화 저장)는 보안상 그대로 둬요.
* **2026-11-26 (`T09` 완료, Claude Code)**: 교사 화면에 `📅 이번 주` 탭 추가(학생별 지난 7일 공부한 날 = `_me.days`+`_me.last`, 7일 풀이, 이번 주 포인트, 보스 승/판, 쿠폰, 챙길 점 + `수업 메모로 복사`). 🎫 쿠폰은 `_shop.couponPcs`가 늘어나기만 해서 선생님이 누른 '사용함' 장수는 교사 기기 `localStorage`(`hangeoreum-t-coupons`)에만 저장해요(서버·SQL 변경 없음, 학생 화면 쿠폰 수는 그대로). 학습 현황 표는 단원 머리줄(`UNIT_INFO`)로 묶고 차시 이름·점 뜻을 보여 줘요. 게임 탭은 범위(방과후 반 포함) 학생별 `오늘의 보스 도전` 기록을 보여 주고, `CLASS_BOSS_ON=false`면 반 보스전 카드를 숨겨요. 좁은 화면에서 표가 화면을 밀던 문제는 `teacher-plus.css`의 `.t-cols>*{min-width:0}`로 해결. T08 3트랙(`p.track`·`p.trackDone`)은 아직 교사 화면에 안 보여요(시범 확정 후 연결 추천). 검증: `node tests/verify.mjs` 통과 + 체험 모드 화면 확인.
* **2026-11-26 (`T08` 완료, Antigravity)**
  * `[T08]` 메인 학습 공식 명칭을 **『교과서 한 걸음』**으로 정리하고, 2차시(`cent`: 중심각과 호)에 **3탭(`개념 보기 · 유형 익히기 · 차시 마무리`) × 3트랙(`🌱 첫걸음 · 🌿 한걸음 · 🌳 두걸음`)** 시범 구조를 전면 적용 (`tracks-cent.css`, `js/02t-tracks-cent.js`, `index.html`, `tests/verify.mjs`, `COLLAB.md`만 수정).
  * **🌱 첫걸음**: 유형 익히기(예시·비예시 4문항 + 1.5초 찍기 방지 쿨다운 → 교사 풀이 지시 4단계 클릭 분해 + `계산이 어렵나요?` 토글 시 교사 대행 및 기초 연산(`mul`/`ratio`/`div`) 3초 자동 이동 & `오늘의 길잡이` 우선 추천) → 클릭형 모양 스키마 개념 → 무계산 구조 마무리.
  * **🌿 한걸음**: 개념 보기 패스 가능 + 유형별 고정 정교화 선생님 대표 예제(`WORKED` 1~4, 도형 연동·함정 노트) + 적응형 4유형 차시 마무리(1오답 재확인, 2연속 오답 시 대표 예제 복귀).
  * **🌳 두걸음**: 복합 유형 3종(`C1`: 세 호의 비+몇 배, `C2`: 세 호의 비+중심각의 비, `C3`: 반원 180°+중심각의 비) 2단계 조합 파악 후 실행 + 6문항 적응형 마무리 + 1초 메타인지 체크. `더 알아보기`는 개념 하단/완료 보너스로 이동.
  * **향후 보스전 연동 규약**: `window.lessonTrackDone(id)`가 `0(미완료) / 1(첫걸음) / 2(한걸음) / 3(두걸음)`을 반환하며, 기존 기록(`prac.solved>=5` 또는 `steps>0 && concept`)은 `2`로 호환됩니다(보스전 코드 수정은 추후 별도 작업에서 진행).
* **2026-11-26 (`T07` 완료, Antigravity)**
  * `[T07]` 대표 2차시(`area` 기둥의 겉넓이 · `sector` 부채꼴의 호의 길이와 넓이)에 교육학적 보완 시범 적용 (`concept-plus.css`, `js/02c-concept-plus.js`, `tests/verify.mjs`, `COLLAB.md`만 수정).
  * `CONCEPT.area`: `2πr²+2πrh` 문자식 제거 후 선생님 방식(`둘레 = 지름 × π`, `넓이 = 반둘레 × 반지름`)과 4단계 절차로 단일화, 초등 바탕(`둘레 cm` vs `넓이 cm²`) 리마인드·전개도 3D 펼치기 미니 슬라이더(`삼각기둥`·`직육면체`·`원기둥`)·반지름 탐색·기둥별 전략표 추가.
  * `CONCEPT.sector`: 길이(`cm`) vs 넓이(`cm²`) 이중 색상 비교 카드와 반지름·중심각 조각 발견 슬라이더(`cpSectorCalc`), 호의 길이(`½rl`) 사례 탐색, 조건별 도구 선택 가이드(조건 A/B/C) 추가.
  * 두 시범 차시의 `미리 보기`는 3단계 로드맵 배지와 접이식 그림 요약 서랍(`.cp-pv-drawer`)으로 인지 부하를 줄이고, 확인 후 나머지 4차시(`poly`·`regular`·`arc`·`cent`) 확장 대기.
* **2026-11-26 (`T05` 후속 4, Claude Code)**: 선생님 요청으로 보스전은 '주요 학습'에서 해결한 차시(같이 풀기 끝까지 또는 혼자 풀기 3문제)가 3개 이상일 때만 열리고, 해결한 차시 개념의 문제만 나와요. `js/boss-bank.js` 맨 아래 `NL`/`HL`에 문제별 차시 id(`les`)를 적어요. 앱에 아직 없는 차시(`rotation`·`volume`·`conearea`·`cone`·4단원 `coord`·`prop`·`inv`) 문제는 그 차시가 열리면 자동으로 나와요(T03·T04 완료 시 연결됨).
* **2026-11-26 (`T05` 후속 3, Claude Code)**: 선생님이 알려 준 시험 범위(Ⅵ-04·05, Ⅶ-01~04, Ⅳ 전체)에 맞춰 문제 은행 정리. 원뿔 부피·겉넓이·회전체 다시 넣음(구만 범위 밖), 단원 이름 `정비례와 반비례` → `좌표평면과 그래프`로 넓히고 사분면·좌표·넓이 문제 추가(일반 29 · 필살기 23 유형).
* **2026-11-26 (`T05` 후속 2, Claude Code)**: 선생님 확인으로 `js/boss-bank.js`에서 시험 범위 밖 문제 제거(원뿔 부피·겉넓이, 구·반구, 회전체 이름, 원뿔·구·원기둥 비). 대신 삼각기둥 부피, 원기둥 옆넓이, 정육면체 겉넓이, 구멍 뚫린 원기둥 부피, 부피로 높이 구하기, 부피로 겉넓이 구하기 추가. 각뿔 부피 2문항은 남겨 둠.
* **2026-11-26 (`T06` 완료, Antigravity)**
  * `[T06]` 열린 6차시(`poly`·`regular`·`area`·`arc`·`cent`·`sector`) 개념 학습 전반을 `concept-plus.css` + `js/02c-concept-plus.js` 독립 모듈로 보완. (`js/04-games.js`, `styles.css`, `supabase/*` 미수정)
  * `PREVIEW.area` 및 누락 차시 4종(`area` 4장, `arc` 4장, `cent` 3장, `sector` 4장)의 `PV_CARDS`를 추가하고, 카드·접기 본 진도(`DB[id].seenCards`), 슬라이드 확대 모달(`◀ 이전`/`다음 ▶`, `←`/`→`, `🔊 듣기`), 열린 `.fold` 내부 이전·다음·듣기 바, 클릭 가능한 핵심 낱말 칩(`T(w)`), `TERMS` 선생님 방식(`지름 × π`, `반둘레 × 반지름`) 정렬을 구현.
  * `CONCEPT.area`에 선생님 원 공식 비교(`svgZig`)와 접기 3번(`삼각기둥에서 자주 하는 실수`) 추가, 차시 말미에 `CONCEPT_QUIZ`(차시당 3문항)를 배치해 모두 맞히면 `p.concept = true` + 5포인트 지급.
  * 검증: `node tests/verify.mjs` 통과 (`PV_CARDS`, `PREVIEW`, `TERMS`, `CONCEPT_QUIZ` 6차시 18문항 검증 포함).
* **2026-11-26 (`T05` 후속, Claude Code)**: 선생님 요청으로 `우리 반 보스전` 화면을 숨김(`CLASS_BOSS_ON=false`, 포인트 집계·교사 크게 띄우기는 그대로). 난이도 상향: 막기 1.2초→0.65초(버튼도 작게), 게이지 더 빠르게·황금 존 좁게, 보스 체력 일반 650/필살기 600, 문제 시간 40초/60초.
* **2026-11-26 (`T05` 완료, Claude Code)**
  * 보스전 화면(`#boss`) 위쪽에 혼자 하는 **오늘의 보스 도전(폭탄 방어전)** 추가. 아래 `우리 반 보스전`(포인트 = 데미지)은 그대로.
  * 문제 은행은 `js/boss-bank.js`(`window.BOSS_BANK={normal,hard}`)로 분리: 다른 AI는 배열 끝에 한 칸씩 덧붙이면 돼요. 규격은 파일 맨 위 주석.
  * 방식은 `RAID_MODES`/`raidModeNow()`로 나눠 두어, 다음에 빙고·성 탈출 같은 방식을 주마다 돌릴 수 있어요.
  * 보상: 포인트는 끝까지 하기 +5(하루 1번), 보스별 첫 승리 +10, 필살기 첫 승리 +10, 놓친 문제 다시 맞히기 +2(판당 2문제), 상자 포인트 주머니(은 8~12 · 황금 15~25)만. 입장권 20P·물약 10P가 더 커서 포인트가 불어나지 않아요.
  * 새 DB 필드: `DB._raid`(`days[YYYY-MM-DD]={f,p}`, `w`, `g`, `beat`), `DB._shop`의 `bonusGot/bonusUsed`(캡슐 뽑기권), `shieldGot/shieldUsed`(연속 보호 방패), `couponPcs`(쿠폰 조각, 3개=1장), 보스 한정 프레임 `own['frame:b-*']`, 칭호 `own['title:*']`·`eq.title`. 기기 병합이 큰 값 우선이라 '남은 개수' 대신 늘어나기만 하는 Got/Used로 저장.
  * `award()`를 04-games.js에서 감싸 연속 보호 방패를 적용(01-core.js는 건드리지 않음). DB/서버 SQL 변경 없음.
  * 검증: `node tests/verify.mjs` 통과 + 문제 은행 13,500문항(모든 생성기 → `check()` 정답 통과) 따로 확인. `tests/verify.mjs`에 `js/boss-bank.js` 검사를 넣는 건 다음 정비 때 해 주면 좋아요(이번엔 Scope 밖이라 손대지 않음).
* **2026-11-26 (`T01`·`T02`·`T03/T04 스펙` 완료, Antigravity)**
  * `[T01]` Supabase 운영 DB 마이그레이션(`t01_fk_indexes_and_bb_search_path`) 적용 및 `schema.sql`, `game.sql`, `group.sql`, `report.sql` 동기화 완료 (FK 인덱스 누락 4건·`search_path` 미고정 2건 해소).
  * `[T02]` `js/01-core.js` `toast()` 안전화(`textContent`), `tests/verify.mjs` Windows 경로 지원 + 입체도형(`poly`, `regular`, `area`)·정수(`sign`, `numline`, `abs`, `iadd`, `isub`) 생성기 검증 추가, `README.md` 최신화 완료.
  * `[T03][T04]` `docs/specs/T03-solid-rot.md` 및 `docs/specs/T04-solid-vol.md` 등록 완료. Claude Code는 바로 `T04`를 독립 파일 `js/02v-solid-vol.js`로 진행할 수 있습니다.
* **2026-11-26 (`T00` 완료, Antigravity)**
  * 기준 `main` 커밋: `56a63bf` (PR `#45` 행동 기반 포인트 보상 및 이유 표시, PR `#44` 나의 길 🌿 시작점 잇기, PR `#43` 나의 길 3갈래까지 반영 완료).
  * Supabase 운영 현황: 프로젝트 `zlwelfgvfbacmpeqwnkx` (`ap-southeast-1`) 가동 중, 등록 학생 34명.
  * 구 방식 정리: 로컬 `hg-patch_20261126_games_shop-3d-gacha.zip` 내용은 이미 `main`에 머지 및 후속 확장(`#40`) 완료됨. 앞으로는 GitHub 자율 반영/PR + `COLLAB.md`로만 협업.
  * 잔여 브랜치 참고: 기존 `claude/project-thread-*` 4개와 임시 `agy/t00-collab-rules` 브랜치는 `T02` 저장소 정비 시 일괄 정리 예정.
  * 다음 단계: Antigravity가 `T01`(DB 위생 패치) + `T02`(테스트·문서·브랜치 정리) 및 `docs/specs/T03-*.md`, `T04-*.md` 스펙 등록 진행.
