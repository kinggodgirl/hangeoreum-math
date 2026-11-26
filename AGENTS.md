# 한 걸음 수학 — 멀티-AI 협업 가이드 (AGENTS.md)

이 저장소는 **빌드 도구 없이 GitHub Pages에서 바로 동작하는 순수 HTML/CSS/JS** 중1 수학 기초학력 웹앱입니다.
여러 AI(**Antigravity**, **Claude Code 클라우드 앱** 등)가 동시에 작업할 때 충돌을 방지하고 안정성을 유지하기 위해 아래 규칙을 반드시 따르세요.

## 1. 파일 구조 및 담당 영역

| 파일 | 역할 | 수정 시 주의사항 |
| :--- | :--- | :--- |
| `index.html` | 화면 뼈대 및 CSS/JS 로드 순서 정의 | `<script>` 로드 순서(`01` → `07` → `08`)를 바꾸지 마세요. 새 차시 스크립트 추가는 최소 1줄만 반영합니다. |
| `styles.css` | 전체 스타일시트 | 기존 CSS 변수(`--paper`, `--ink`, `--accent`, `--hi`) 유지 |
| `deco.css` | Fluent Emoji 3D 아이콘·축하 연출 보조 스타일 | `styles.css`와 충돌 없도록 분리 유지 |
| `shop-3d.css` | 꾸미기 상점 3D 아바타·캡슐 뽑기 스타일 | `styles.css`, `deco.css`와 분리 유지 |
| `js/01-core.js` | 공통 유틸, `DB` 저장/정리(`save`, `tidyDB`), 3D 뷰어, 용어 사전, 키패드(`answerUI`, `check`), 문제 신고(`repMount`), 단계 문제 렌더러 | `localStorage` 키 이름(`STORE_KEY`)과 `DB` 기존 필드 호환성 유지 |
| `js/02-unit-solid.js` | 입체도형 차시·홈·개념·탐구, 로그인 및 Supabase API 호출(`API.call`), 교과서 유형 | 서버 RPC 이름(`hg_*`) 임의 변경 금지. **새 차시 개발은 아래 분리 파일(`02r`, `02v` 등)에 작성하고 이 파일은 최소 훅만 연결하세요.** |
| `js/03-teacher.js` | 교사 대시보드(`viewTeacher`, `openStu`, `dataSummary`, `loadReports`, `renderOmr`) | 기초 연산 오개념(`_calcErrs`), 취약 구구단(`_facts`), 문제 신고, OMR 집계 유지 |
| `teacher-plus.css` | 교사 화면 편의 기능(📅 이번 주 · 쿠폰 · 표 머리줄 단원 묶음) 보조 스타일 | `styles.css`와 분리 유지 · 교사 화면 로직은 `js/03-teacher.js` |
| `js/04-games.js` | 오늘의 미션, 꾸미기 상점(3D 아바타·모자·캡슐 뽑기), 우리 반 보스전, 숫자야구 | `DB._me` 포인트·배지·`DB._shop` 구조 유지 |
| `js/04s-sea.js` · `sea.css` · `supabase/sea.sql` | ⚓ 좌표 해전(T11): 좌표평면 배 찾기 2인 대결(`hg_sea_*`)·컴퓨터 연습. 전역은 `viewSea`·`viewSeaGame`·`viewSeaCpu`만 | 포인트는 숫자야구 장부(`hg_bb_ledger.sea_id`)를 같이 써요 |
| `js/05-calc.js` | 기초 연산 28개 주제(`CALC`, 5갈래 사다리 `CALC_PATHS`), `EXAM_FOCUS`, `KEYS`, `LINKS`, `DIAG`, 5/10문제 미니 모드, 오늘의 계산(`viewDrill`), 오늘의 길잡이 | 시험 범위 변경 시 `EXAM_FOCUS`와 `EXAM_TAG`만 우선 수정 |
| `js/06-unit-int.js` | 정수와 유리수 단원(`unit: 'int'`) | `LESSONS`, `STEPGEN`, `CALC_FOR`, `TERMS`, `BADGES` 확장 블록 |
| `js/06c-unit-circle.js` | 원과 부채꼴 단원(`unit: 'circle'`, 차시 `arc` · `cent` · `sector`). 입체도형 사이트에서 함께 열림(`OPEN_UNITS`) | 함수 안에 넣어 전역 이름을 만들지 않음 · 그림은 SVG(`fig.svg`) |
| `js/06g-goal.js` | 나의 길: 학생이 고르는 목표 3갈래(`GOALS`: 🌱 `calc` · 🌿 `base` · 🌳 `up`), 기록 추천(`goalRec`), 홈 카드·길잡이·기초 연산 화면 연결. 교사 화면은 `goalOf`·`goalBadge`로 표시 | `viewHome`·`viewCalc`·`guideSteps`를 감싸서 덧붙여요. 추천 규칙을 바꿀 땐 `goalRec`만 고쳐요 |
| `js/boss-bank.js` · `boss-raid.css` | 오늘의 보스 도전(T05) 문제 은행(`window.BOSS_BANK={normal,hard}`)과 전투 화면 스타일. 게임 로직은 `js/04-games.js` 끝(`raidOpen`) | 문제는 배열 끝에 한 칸씩 덧붙이기 · 규격은 파일 맨 위 주석 |
| `js/07-print-omr-boot.js` | 단원 필터링, 점검 학습지 인쇄, OMR 사진 채점, 라우터(`route`) 및 초기 실행 | 마지막(`08-deco.js` 직전, 부트 담당)에 로드되어야 함 |
| `js/08-deco.js` | 화면에 Fluent Emoji 3D 아이콘과 색종이 축하 효과 덧붙이기 | 화면 로직은 건드리지 않고 DOM 후처리만 담당 |
| `COLLAB.md` | **공용 작업 보드 및 인계장** | 현재 진행 중인 작업 ID(`Txx`), 담당 AI, 허용 파일(`Scope`), 인계 메모 기록 |
| `docs/specs/` | 작업별 교과서 스펙·설계 문서(`Txx-*.md`) | 저작권 원문 대신 요약 스펙·유형·완료 조건을 공유하는 폴더 |
| `tests/verify.mjs` | 문법 검사 및 전체 연산·연결맵·원과 부채꼴·나의 길 자동 검증 스크립트 | `main` 반영/PR 전 반드시 `node tests/verify.mjs` 실행 |

## 2. 공유 데이터 계약 (`DB` JSON)

`DB`는 학생 기기 `localStorage`와 Supabase에 JSON으로 동기화됩니다(서버 저장 한도 300KB).
- `DB._me`: 포인트(`pts`), 연속 일수(`streak`), 최근 학습일 목록(`days`), 1회 보상(`once`), 배지(`badges`)
- `DB._shop`: 꾸미기 상점 보유·착용 상태(`own`, `eq`, `spent`, `gachaDay`, `gachaCnt`, `freeGachaDay`)
- `DB._calc[topicId]`: `stars`(0~주제의 단계 수), `unlock`(1~단계 수) · 단계 수는 `lv` 배열 길이(기본 3, `pi`는 5), `calcLvN(id)`로 구해요, `best`, `ways`, `box`(0~5), `due`(YYYY-MM-DD)
- `DB._calcDiag`: 시작점 찾기 결과(`d`, `res`, `lvRes`, `plan`)
- `DB._calcErrs`: 기초 연산 오개념 누적(`{tid, m, n, d}`, `tidyDB()`에서 상위 25건 유지)
- `DB._facts[key]`: 곱셈구구 36칸 익힘 상태(`lv`, `d`, `n`, `w`)
- `DB._goal`: 나의 길(`k`: `calc`|`base`|`up`, 고른 날 `d`, 그때 추천 `rec`, 최근 6번 기록 `h`)
- `DB._raid`: 오늘의 보스 도전(`days[날짜]={f 무료 사용, p 유료 횟수}`, `w` 승, `g` 판, `beat` 물리친 보스) · 상자 보상은 `DB._shop`의 `bonusGot/bonusUsed`, `shieldGot/shieldUsed`, `couponPcs`, `own['frame:b-*']`, `own['title:*']`(늘어나기만 하는 값으로 저장)
- `DB._rev`, `DB._omr`: 복습 노트, 학생 OMR 자가 채점 기록

## 3. Antigravity ↔ Claude Code 클라우드 협업 프로토콜

두 AI가 GitHub 저장소(`kinggodgirl/hangeoreum-math`)를 중심으로 사용자(비전공자 선생님)의 코드 리뷰 부담 없이 **자동 검증 후 자율적으로 반영·머지**하기 위한 규칙입니다.

1. **작업 시작 전 필독**: 작업을 시작하기 전에 반드시 `AGENTS.md`, `COLLAB.md`, 그리고 해당 작업의 스펙 문서(`docs/specs/Txx-*.md`, 있는 경우)를 `main` 최신 기준으로 먼저 읽고, 내 담당 작업과 허용 파일(`Scope`)을 확인하세요.
2. **자동 검증 후 AI 자율 반영 (사용자 코드 리뷰 생략)**:
   - 코드 수정 시 반드시 `node tests/verify.mjs` 통과를 먼저 확인한 뒤 `main`에 반영하세요(문서 전용 수정은 즉시 반영 가능).
   - **Antigravity**: 검증 통과 후 `main`에 직접 반영하고 `COLLAB.md` 상태를 갱신합니다.
   - **Claude Code 클라우드 앱**: `verify.mjs` 통과 후 `main` 직접 반영 또는 머지가 가능하면 바로 반영합니다. 클라우드 환경 제약으로 `claude/*` 브랜치 PR만 생성할 수 있는 경우, PR 제목 맨 앞에 `[Txx]`를 붙여 올리면 **Antigravity가 교차 검토와 GitHub Actions(`Verify Hangeoreum Math`) 통과를 확인한 뒤 대신 머지**합니다(선생님이 직접 코드를 보고 머지할 필요 없음).
3. **비전공자 선생님을 위한 3대 안전장치**:
   - **테스트 게이트**: `node tests/verify.mjs` 통과 없이 `main`에 코드를 반영하지 않습니다.
   - **충돌 방지 (파일 소유권 & 신규 차시 분리)**: `COLLAB.md`에 지정된 **허용 파일(`Scope`)** 만 수정합니다. 새 입체도형 차시는 이미 비대한 `js/02-unit-solid.js`(214KB)에 직접 누적하지 말고 `js/06c-unit-circle.js`처럼 **IIFE(`(() => { ... })()`)로 감싼 독립 파일**(`js/02r-solid-rot.js`, `js/02v-solid-vol.js` 등)로 분리하며, 공용 파일(`index.html`, `js/02-unit-solid.js`, `styles.css`, `tests/verify.mjs`) 수정은 1~3줄 최소 훅으로 제한합니다.
   - **즉시 롤백 가능한 커밋 단위**: 모든 커밋 메시지와 PR 제목에 `[Txx]` 작업 ID를 명시해(`예: feat(solid): [T04] 기둥·뿔 차시 구현`), 문제 발생 시 해당 작업 커밋만 즉시 되돌릴 수 있게 유지합니다.
4. **PR/커밋 인계 양식**: PR을 올리거나 커밋을 남길 때 아래 항목을 명확히 적습니다.
   - **작업 ID**: 예) `[T04]`
   - **변경 파일 목록**: 수정/신규 파일 요약
   - **검증 결과**: `node tests/verify.mjs` 통과 여부(문서 전용일 경우 그 사유)
   - **상대 AI 인계 메모**: 다음 작업자나 머지 담당 AI가 주의할 점, DB/HTML 훅 변경 여부 등
5. **역할 강점 분담**:
   - **Antigravity**: Supabase DB 마이그레이션·어드바이저 점검(MCP 직결), `tests/verify.mjs` 확장·문서·저장소 정비, 교과서 PDF 기반 스펙 작성(`docs/specs/`), Claude Code PR 교차 검증·대리 머지, 독립 차시 구현.
   - **Claude Code 클라우드**: 기존 차시·기초 연산의 선생님 풀이 톤에 맞춘 신규 차시 구현, UI/문제 생성기 고도화, 교차 리뷰.
6. **공통 기술·문체 원칙**:
   - **빌드 도구 금지**: Webpack, Vite, TypeScript 컴파일 단계를 추가하지 마세요.
   - **검증 필수**: 코드 수정 후 반드시 `node tests/verify.mjs`를 실행해 모든 JS 문법과 문제 생성기·채점·오개념 진단이 통과하는지 확인하세요.
   - **어조 유지**: 학생에게 보이는 모든 안내 문구는 따뜻하고 쉬운 한국어 해요체를 사용합니다.
7. **작업 종료 시 인계**: 작업 반영이 끝나면 `COLLAB.md`의 작업 상태를 `완료`로 바꾸고 인계 로그에 한 줄 요약을 남깁니다.

## 4. 패치 zip 적용 절차 (오프라인/비상용 구 절차: `hg-patch_*.zip`)

기본 협업 방식은 **3절의 GitHub 자율 반영·머지 + `COLLAB.md`** 입니다. 아래 절차는 오프라인 환경에서 수동 zip 패치를 전달받았을 때만 예외적으로 사용합니다.

- **작업 폴더 위치(2026-11 변경)**: 최상위 폴더는 `C:\Users\<계정>\OneDrive - 대청중학교\ai`이고, 한걸음 수학 자료와 패치 zip은 그 안의 `한걸음 수학` 폴더에서 찾아요. 없으면 `~/Downloads/`도 확인해요.

1. `git pull origin main`으로 최신 상태를 맞춘 뒤, 파일명의 `<작업요약>`으로 새 브랜치(`feat/<작업요약>`)를 만듭니다.
2. 압축 안의 `HANDOFF.md`를 먼저 읽고, 거기 적힌 파일들만 저장소에 반영합니다(`HANDOFF.md`는 커밋하지 않고 삭제).
3. 반영 후 `node tests/verify.mjs`를 실행해 통과하면 `HANDOFF.md`의 추천 메시지로 커밋하고 푸시합니다.
4. 충돌이나 테스트 실패가 나면 강제로 덮어쓰지 말고 원인만 요약해서 알려 줍니다.

## 5. 교과서 참고

교과서(지학사 2022 개정 중학교 수학 1)는 **프로젝트 폴더 `/mnt/project-files/textbook/`**에 있어요. 저작권 자료라서 이 저장소에는 넣지 않아요.
- `INDEX.md`: 단원별 쪽 번호 목차 (PDF 쪽 = 교과서 쪽). 먼저 이걸 보고 필요한 쪽만 읽어요.
- `수학1_본문_텍스트.txt`: 쪽마다 `===== p.194 =====` 표시가 있는 본문 텍스트.
- Antigravity는 로컬 작업 폴더의 교과서 PDF를 참고해 핵심 문항·조건만 요약한 스펙 문서를 `docs/specs/Txx-*.md`에 올립니다(원문 텍스트 복붙·커밋 금지).
