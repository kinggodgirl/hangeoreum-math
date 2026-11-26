# 한 걸음 수학 — 공용 작업 보드 & 인계장 (COLLAB.md)

이 문서는 **Antigravity**와 **Claude Code(클라우드 앱)**가 같은 저장소에서 충돌 없이 협업하기 위한 공용 작업 보드입니다.
세션 시작 시 `AGENTS.md`와 함께 이 파일을 읽고, 맡은 작업의 **허용 파일(`Scope`)** 안에서만 수정한 뒤 `AGENTS.md` 3절 절차대로 `node tests/verify.mjs` 통과 후 반영하세요.

---

## 1. 현재 작업 보드 (Task Board)

| ID | 작업 내용 | 담당 AI | 허용 파일 (`Scope`) | 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **T00** | 자율 머지 협업 규칙·공용 작업 보드 세팅 | Antigravity | `AGENTS.md`, `CLAUDE.md`, `COLLAB.md` | **완료** (`main` 반영) |
| **T01** | Supabase DB 위생 패치 (FK 인덱스 4개 + `hg_bb_valid`/`hg_bb_score` `search_path` 고정 + SQL 동기화 + 어드바이저 재검증) | Antigravity | `supabase/schema.sql`, `supabase/game.sql` (+ 운영 DB 적용) | 대기 |
| **T02** | 테스트·문서·저장소 정비 (`tests/verify.mjs` 입체도형/정수 생성기 검증 추가, `README.md` 최신화, `toast`/`esc` 안전화, 병합 완료된 구 `claude/project-thread-*` 및 임시 `agy/t00-collab-rules` 브랜치 정리) | Antigravity | `tests/verify.mjs`, `README.md`, `js/01-core.js`, `js/03-teacher.js` | 대기 (`T01` 직후) |
| **T03** | 시험 범위 차시 확장 A: 3차시 `회전체` · 4차시 `회전체의 성질` (교과서 217~219쪽) | Antigravity *(조율 가능)* | `js/02r-solid-rot.js`(신규), `docs/specs/T03-solid-rot.md`, `index.html`, `js/02-unit-solid.js`(최소 훅) | 스펙 준비 대기 |
| **T04** | 시험 범위 차시 확장 B: 6차시 `기둥의 부피` · 7차시 `뿔의 겉넓이` · 8차시 `뿔의 부피` (교과서 223~231쪽) | Claude Code | `js/02v-solid-vol.js`(신규), `docs/specs/T04-solid-vol.md`, `index.html`, `js/02-unit-solid.js`(최소 훅) | 스펙 준비 대기 (`T03`과 병렬 가능) |
| **T05** | 보스전 미니 게임 개편: 혼자 하는 `오늘의 보스 도전`(폭탄 방어전 · 입장권 · 운명의 주사위 · 타이밍 게이지 · 긴급 막기 · 3택1 보물상자 · 놓친 문제 복기). 선생님 기획서(Boss Battle Design Handoff) 기준 | Claude Code | `js/04-games.js`, `js/boss-bank.js`(신규), `boss-raid.css`(신규), `index.html`(로드 2줄), `AGENTS.md`·`COLLAB.md`(문서 한 줄씩) | **완료** |

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

* **2026-11-26 (`T00` 완료, Antigravity)**
  * 기준 `main` 커밋: `56a63bf` (PR `#45` 행동 기반 포인트 보상 및 이유 표시, PR `#44` 나의 길 🌿 시작점 잇기, PR `#43` 나의 길 3갈래까지 반영 완료).
  * Supabase 운영 현황: 프로젝트 `zlwelfgvfbacmpeqwnkx` (`ap-southeast-1`) 가동 중, 등록 학생 34명.
  * 구 방식 정리: 로컬 `hg-patch_20261126_games_shop-3d-gacha.zip` 내용은 이미 `main`에 머지 및 후속 확장(`#40`) 완료됨. 앞으로는 GitHub 자율 반영/PR + `COLLAB.md`로만 협업.
  * 잔여 브랜치 참고: 기존 `claude/project-thread-*` 4개와 임시 `agy/t00-collab-rules` 브랜치는 `T02` 저장소 정비 시 일괄 정리 예정.
  * 다음 단계: Antigravity가 `T01`(DB 위생 패치) + `T02`(테스트·문서·브랜치 정리) 및 `docs/specs/T03-*.md`, `T04-*.md` 스펙 등록 진행.

* **2026-11-26 (`T05` 완료, Claude Code)**
  * 보스전 화면(`#boss`) 위쪽에 혼자 하는 **오늘의 보스 도전(폭탄 방어전)** 추가. 아래 `우리 반 보스전`(포인트 = 데미지)은 그대로.
  * 문제 은행은 `js/boss-bank.js`(`window.BOSS_BANK={normal,hard}`)로 분리: 다른 AI는 배열 끝에 한 칸씩 덧붙이면 돼요. 규격은 파일 맨 위 주석.
  * 방식은 `RAID_MODES`/`raidModeNow()`로 나눠 두어, 다음에 빙고·성 탈출 같은 방식을 주마다 돌릴 수 있어요.
  * 보상: 포인트는 끝까지 하기 +5(하루 1번), 보스별 첫 승리 +10, 필살기 첫 승리 +10, 놓친 문제 다시 맞히기 +2(판당 2문제), 상자 포인트 주머니(은 8~12 · 황금 15~25)만. 입장권 20P·물약 10P가 더 커서 포인트가 불어나지 않아요.
  * 새 DB 필드: `DB._raid`(`days[YYYY-MM-DD]={f,p}`, `w`, `g`, `beat`), `DB._shop`의 `bonusGot/bonusUsed`(캡슐 뽑기권), `shieldGot/shieldUsed`(연속 보호 방패), `couponPcs`(쿠폰 조각, 3개=1장), 보스 한정 프레임 `own['frame:b-*']`, 칭호 `own['title:*']`·`eq.title`. 기기 병합이 큰 값 우선이라 '남은 개수' 대신 늘어나기만 하는 Got/Used로 저장.
  * `award()`를 04-games.js에서 감싸 연속 보호 방패를 적용(01-core.js는 건드리지 않음). DB/서버 SQL 변경 없음.
  * `T02` 참고: `tests/verify.mjs`에 `js/boss-bank.js` 문법·정답 검사(모든 생성기 → `check()` 통과)를 넣어 주면 좋아요. 이번에는 T02 소유 파일이라 손대지 않고 따로 13,500문항 검사로 확인했어요.
