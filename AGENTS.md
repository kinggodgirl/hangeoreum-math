# 한 걸음 수학 — 멀티-AI 협업 가이드 (AGENTS.md)

이 저장소는 **빌드 도구 없이 GitHub Pages에서 바로 동작하는 순수 HTML/CSS/JS** 중1 수학 기초학력 웹앱입니다.
여러 AI(Claude, Gemini, Cursor 등)가 동시에 작업할 때 충돌을 방지하고 안정성을 유지하기 위해 아래 규칙을 반드시 따르세요.

## 1. 파일 구조 및 담당 영역

| 파일 | 역할 | 수정 시 주의사항 |
| :--- | :--- | :--- |
| `index.html` | 화면 뼈대 및 CSS/JS 로드 순서 정의 | `<script>` 로드 순서(`01` → `07`)를 바꾸지 마세요. |
| `styles.css` | 전체 스타일시트 | 기존 CSS 변수(`--paper`, `--ink`, `--accent`, `--hi`) 유지 |
| `js/01-core.js` | 공통 유틸, `DB` 저장/정리(`save`, `tidyDB`), 3D 뷰어, 용어 사전, 키패드(`answerUI`, `check`), 문제 신고(`repMount`), 단계 문제 렌더러 | `localStorage` 키 이름(`STORE_KEY`)과 `DB` 기존 필드 호환성 유지 |
| `js/02-unit-solid.js` | 입체도형 차시·홈·개념·탐구, 로그인 및 Supabase API 호출(`API.call`), 교과서 유형 | 서버 RPC 이름(`hg_*`) 임의 변경 금지 |
| `js/03-teacher.js` | 교사 대시보드(`viewTeacher`, `openStu`, `dataSummary`, `loadReports`, `renderOmr`) | 기초 연산 오개념(`_calcErrs`), 취약 구구단(`_facts`), 문제 신고, OMR 집계 유지 |
| `js/04-games.js` | 오늘의 미션, 꾸미기 상점, 우리 반 보스전, 숫자야구 | `DB._me` 포인트·배지 구조 유지 |
| `js/05-calc.js` | 기초 연산 19개 주제(`CALC`), `EXAM_FOCUS`, `KEYS`, `LINKS`, `DIAG`, 5/10문제 미니 모드, 오늘의 계산(`viewDrill`), 오늘의 길잡이 | 시험 범위 변경 시 `EXAM_FOCUS`와 `EXAM_TAG`만 우선 수정 |
| `js/06-unit-int.js` | 정수와 유리수 단원(`unit: 'int'`) | `LESSONS`, `STEPGEN`, `CALC_FOR`, `TERMS`, `BADGES` 확장 블록 |
| `js/06c-unit-circle.js` | 원과 부채꼴 단원(`unit: 'circle'`, 차시 `arc` · `cent` · `sector`). 입체도형 사이트에서 함께 열림(`OPEN_UNITS`) | 함수 안에 넣어 전역 이름을 만들지 않음 · 그림은 SVG(`fig.svg`) |
| `js/07-print-omr-boot.js` | 단원 필터링, 점검 학습지 인쇄, OMR 사진 채점, 라우터(`route`) 및 초기 실행 | 마지막에 로드되어야 함 |
| `tests/verify.mjs` | 문법 검사 및 전체 연산 1,860문항 자동 검증 스크립트 | PR/푸시 전 반드시 `node tests/verify.mjs` 실행 |

## 2. 공유 데이터 계약 (`DB` JSON)

`DB`는 학생 기기 `localStorage`와 Supabase에 JSON으로 동기화됩니다(서버 저장 한도 300KB).
- `DB._me`: 포인트(`pts`), 연속 일수(`streak`), 1회 보상(`once`), 배지(`badges`)
- `DB._calc[topicId]`: `stars`(0~주제의 단계 수), `unlock`(1~단계 수) · 단계 수는 `lv` 배열 길이(기본 3, `pi`는 5), `calcLvN(id)`로 구해요, `best`, `ways`, `box`(0~5), `due`(YYYY-MM-DD)
- `DB._calcDiag`: 시작점 찾기 결과(`d`, `res`, `lvRes`, `plan`)
- `DB._calcErrs`: 기초 연산 오개념 누적(`{tid, m, n, d}`, `tidyDB()`에서 상위 25건 유지)
- `DB._facts[key]`: 곱셈구구 36칸 익힘 상태(`lv`, `d`, `n`, `w`)
- `DB._rev`, `DB._omr`: 복습 노트, 학생 OMR 자가 채점 기록

## 3. 멀티-AI 작업 원칙

1. **작업 범위 한정**: 요청받은 기능의 담당 파일(예: 기초 연산은 `js/05-calc.js`)만 수정하고, 다른 모듈은 건드리지 마세요.
2. **빌드 도구 금지**: Webpack, Vite, TypeScript 컴파일 단계를 추가하지 마세요.
3. **검증 필수**: 코드 수정 후 반드시 `node tests/verify.mjs`를 실행해 모든 JS 문법과 문제 생성기·채점·오개념 진단이 통과하는지 확인하세요.
4. **어조 유지**: 학생에게 보이는 모든 안내 문구는 따뜻하고 쉬운 한국어 해요체를 사용합니다.

## 4. 패치 zip 적용 절차 (`hg-patch_*.zip`)

"`hg-patch_*.zip` 패턴의 가장 최신 파일을 찾아 적용해 줘"라고 하면 다음 순서로 처리합니다.

- **작업 폴더 위치(2026-11 변경)**: 최상위 폴더는 `C:\Users\<계정>\OneDrive - 대청중학교\ai`이고, 한걸음 수학 자료와 패치 zip은 그 안의 `한걸음 수학` 폴더에서 찾아요. 없으면 `~/Downloads/`도 확인해요.


1. `git pull origin main`으로 최신 상태를 맞춘 뒤, 파일명의 `<작업요약>`으로 새 브랜치(`feat/<작업요약>`)를 만듭니다.
2. 압축 안의 `HANDOFF.md`를 먼저 읽고, 거기 적힌 파일들만 저장소에 반영합니다(`HANDOFF.md`는 커밋하지 않고 삭제).
3. 반영 후 `node tests/verify.mjs`를 실행해 통과하면 `HANDOFF.md`의 추천 메시지로 커밋하고 푸시합니다.
4. 충돌이나 테스트 실패가 나면 강제로 덮어쓰지 말고 원인만 요약해서 알려 줍니다.

## 5. 교과서 참고

교과서(지학사 2022 개정 중학교 수학 1)는 **프로젝트 폴더 `/mnt/project-files/textbook/`**에 있어요. 저작권 자료라서 이 저장소에는 넣지 않아요.
- `INDEX.md`: 단원별 쪽 번호 목차 (PDF 쪽 = 교과서 쪽). 먼저 이걸 보고 필요한 쪽만 읽어요.
- `수학1_본문_텍스트.txt`: 쪽마다 `===== p.194 =====` 표시가 있는 본문 텍스트.
