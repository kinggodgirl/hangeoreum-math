# 한 걸음 수학 — 공용 작업 보드 & 인계장 (COLLAB.md)

이 문서는 **Antigravity**와 **Claude Code(클라우드 앱)**가 같은 저장소에서 충돌 없이 협업하기 위한 공용 작업 보드입니다.
세션 시작 시 `AGENTS.md`와 함께 이 파일을 확인하고, 맡은 작업의 **허용 파일(`Scope`)** 안에서만 수정한 뒤 PR을 올리세요.

---

## 1. 현재 작업 보드 (Task Board)

| ID | 작업 내용 | 담당 AI | 허용 파일 (`Scope`) | 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **T00** | 협업 규칙·공용 작업 보드 세팅 | Antigravity | `AGENTS.md`, `CLAUDE.md`, `COLLAB.md` | 진행 중 (`agy/t00-collab-rules`) |
| **T01** | Supabase DB 위생 패치 (FK 인덱스 4개 + `hg_bb_valid`/`hg_bb_score` `search_path` 고정 + SQL 동기화 + 어드바이저 재검증) | Antigravity | `supabase/schema.sql`, `supabase/game.sql` (+ 운영 DB 적용) | 대기 (`T00` 머지 후) |
| **T02** | 테스트·문서·저장소 정비 (`tests/verify.mjs` 입체도형/정수 생성기 검증 추가, `README.md` 최신화, `toast`/`esc` 안전화, 병합 완료된 구 `claude/project-thread-*` 브랜치 정리) | Antigravity | `tests/verify.mjs`, `README.md`, `js/01-core.js`, `js/03-teacher.js` | 대기 (`T01` 직후) |
| **T03** | 시험 범위 차시 확장 A: 3차시 `회전체` · 4차시 `회전체의 성질` (교과서 217~219쪽) | Antigravity *(조율 가능)* | `js/02r-solid-rot.js`(신규), `docs/specs/T03-solid-rot.md`, `index.html`, `js/02-unit-solid.js`(최소 훅) | 스펙 준비 대기 |
| **T04** | 시험 범위 차시 확장 B: 6차시 `기둥의 부피` · 7차시 `뿔의 겉넓이` · 8차시 `뿔의 부피` (교과서 223~231쪽) | Claude Code | `js/02v-solid-vol.js`(신규), `docs/specs/T04-solid-vol.md`, `index.html`, `js/02-unit-solid.js`(최소 훅) | 스펙 준비 대기 (`T03`과 병렬 가능) |

---

## 2. 충돌 방지 규칙 요약

1. **상세 스펙 분리**: 각 작업의 교과서 문제 유형·설계 요구사항은 `docs/specs/Txx-*.md`에 따로 둡니다. `COLLAB.md` 충돌을 줄이기 위해 이 표의 상태 갱신은 PR 머지 시점(한 줄 수정)으로 최소화합니다.
2. **신규 차시 독립 파일 원칙**: `js/02-unit-solid.js`(214KB)에 직접 코드를 덧붙이지 말고, `js/06c-unit-circle.js`처럼 IIFE로 감싼 별도 모듈(`js/02r-solid-rot.js`, `js/02v-solid-vol.js`)로 작성합니다.
3. **공용 파일 최소 수정**: `index.html`, `js/02-unit-solid.js`, `tests/verify.mjs`를 건드릴 때는 필요한 1~3줄만 수정하고, 동일 공용 파일을 두 PR이 동시에 바꾸지 않도록 `COLLAB.md` 상태를 먼저 확인합니다.
4. **PR 제목 규칙**: 모든 PR 제목 앞에 `[Txx]`를 붙이고(`예: [T04] 기둥의 부피·뿔의 겉넓이·뿔의 부피 차시 구현`), 본문에 변경 파일과 `node tests/verify.mjs` 결과를 남깁니다.

---

## 3. 선생님용 빠른 지시 템플릿

### Claude Code 클라우드 앱에 작업 맡길 때
```text
AGENTS.md, COLLAB.md와 docs/specs/T04-solid-vol.md를 읽고 T04 작업을 진행해 줘.
허용 파일(Scope)만 수정하고, node tests/verify.mjs 통과 후 [T04] PR을 올려 줘.
```

### Antigravity에게 교차 PR 리뷰를 맡길 때
```text
GitHub PR #<번호>를 AGENTS.md와 docs/specs/<스펙파일> 기준으로 코드 리뷰해 줘.
```

---

## 4. 인계 로그 (Handoff Log)

* **2026-11-26 (초기 세팅, Antigravity)**
  * 기준 `main` 커밋: `56a63bf` (PR `#45` 행동 기반 포인트 보상 및 이유 표시, PR `#44` 나의 길 🌿 시작점 잇기, PR `#43` 나의 길 3갈래까지 반영 완료).
  * Supabase 운영 현황: 프로젝트 `zlwelfgvfbacmpeqwnkx` (`ap-southeast-1`) 가동 중, 등록 학생 34명.
  * 구 방식 정리: 로컬 `hg-patch_20261126_games_shop-3d-gacha.zip` 내용은 이미 `main`에 머지 및 후속 확장(`#40`) 완료됨. 앞으로는 GitHub PR + `COLLAB.md`로만 협업.
  * 다음 단계: `T00` PR 머지 → Antigravity가 `T01`(DB 위생 패치) + `T02`(테스트·문서·브랜치 정리) 진행 및 `docs/specs/T03-*.md`, `T04-*.md` 스펙 등록.
