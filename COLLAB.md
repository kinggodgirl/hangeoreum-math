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
