# [T03] 3차시 「회전체」 · 4차시 「회전체의 성질」 구현 스펙

- **작업 ID**: `T03`
- **교과서 기준**: 지학사 2022 개정 중학교 수학 1 — Ⅶ. 입체도형의 성질 > 02 회전체 (217~219쪽)
- **담당 AI**: Antigravity *(조율 가능)*
- **상태**: 스펙 준비 완료

---

## 1. 허용 파일 (`Scope`)
다른 작업(`T04` 기둥의 부피·뿔)과 충돌하지 않도록 반드시 독립 파일로 구현합니다.
- `js/02r-solid-rot.js` (**신규** — IIFE `(() => { ... })()`로 감싼 독립 모듈)
- `index.html` (`<script src="js/02r-solid-rot.js"></script>` 1줄 추가, `02-unit-solid.js` 뒤·`07-print-omr-boot.js` 앞)
- `js/02-unit-solid.js` (`LESSONS`의 `rotation`, `rotprop` 항목에서 `ready:false` → `ready:true` 2줄만 변경)
- `tests/verify.mjs` (검증 목록 `jsFiles` 및 입체도형 생성기 테스트에 `'rotation'`, `'rotprop'` 추가)

---

## 2. 차시 3: `rotation` — 회전체 (217~218쪽)

### 학습 목표 & 핵심 용어 (`TERMS`)
- **회전체**: 평면도형을 한 직선(회전축)을 축으로 하여 1회전 시킬 때 생기는 입체도형.
- **회전축**: 회전시킬 때 기준이 되는 직선.
- **모선**: 회전축을 품은 옆면을 이루는 선분(원뿔·원기둥·원뿔대의 옆면을 만드는 선분).
- **원뿔대**: 원뿔을 밑면에 평행한 평면으로 잘라서 생기는 두 입체도형 중 원뿔이 아닌 쪽(두 밑면은 평행하고 합동이 아닌 원).

### 미리 보기 (`PV_CARDS.rotation`) & 개념 (`CONCEPT.rotation`) & 탐구 (`EXPLORE.rotation`)
- **미리 보기 카드 4~5장**: 회전체의 뜻과 회전축, 직사각형 → 원기둥, 직각삼각형 → 원뿔, 사다리꼴 → 원뿔대, 반원 → 구.
- **개념(`CONCEPT.rotation`)**: `foldPanel` + 3D `Viewer`(또는 SVG 단면+3D 회전체 비교)로 평면도형 ↔ 회전축 ↔ 입체도형 대응 정리. (원뿔대 뜻 및 밑면·높이·모선 포함)
- **탐구(`EXPLORE.rotation`)**: 평면도형·회전축을 바꿔 가며 1회전 시켰을 때 어떤 회전체가 나오는지 맞히기 / 구멍 뚫린 회전체 또는 반회전 주의 활동.

### 문제 유형 4가지 (`PTYPES.rotation`)
1. **유형 1 (`rotation:is`)**: 회전체인지 가려내기 — 다면체(각기둥·각뿔·정다면체) vs 회전체(원기둥·원뿔·원뿔대·구).
2. **유형 2 (`rotation:make`)**: 평면도형과 회전축 보고 생기는 회전체 고르기 (직사각형·직각삼각형·사다리꼴·반원·깃발형 등).
3. **유형 3 (`rotation:part`)**: 회전체로 만들 때 돌리기 전 평면도형 찾기 (회전축 기준으로 반쪽 찾기).
4. **유형 4 (`rotation:tf`)**: 회전체·원뿔대·모선·회전축의 성질 ○× 및 옳지 않은 것 고르기.

---

## 3. 차시 4: `rotprop` — 회전체의 성질 (219쪽)

### 학습 목표
1. 회전축에 **수직인 평면**으로 자른 단면의 모양은 항상 **원**이다.
2. 회전축을 **포함하는 평면**으로 자른 단면은 모두 **합동**이며, **회전축에 대하여 선대칭도형**이다.
3. 원기둥(직사각형)·원뿔(이등변삼각형)·원뿔대(등변사다리꼴)·구(원)의 단면 모양과 크기를 구별한다.

### 미리 보기 (`PV_CARDS.rotprop`) & 개념 (`CONCEPT.rotprop`) & 탐구 (`EXPLORE.rotprop`)
- **미리 보기 카드**: ① 수직으로 자르면 언제나 원 ② 회전축을 품고 자르면 선대칭·합동 ③ 네 가지 회전체의 두 방향 단면 비교표 ④ 자른 단면의 길이(밑면의 지름, 높이, 모선).
- **탐구(`EXPLORE.rotprop`)**: 회전체(원기둥·원뿔·원뿔대·구)와 자르는 방향(수직 / 회전축 포함)을 선택해 단면 모양과 치수를 확인하는 활동.

### 문제 유형 4가지 (`PTYPES.rotprop`)
1. **유형 1 (`rotprop:perp`)**: 회전축에 수직인 평면으로 자른 단면의 모양 및 반지름/넓이 구하기.
2. **유형 2 (`rotprop:axis`)**: 회전축을 포함하는 평면으로 자른 단면의 모양 찾기 (직사각형·이등변삼각형·등변사다리꼴·원).
3. **유형 3 (`rotprop:size`)**: 단면(직사각형·이등변삼각형·등변사다리꼴)의 밑변·높이 또는 넓이 구하기 (반지름→지름 2배 주의).
4. **유형 4 (`rotprop:tf`)**: 회전체의 단면 성질 ○× (예: "원뿔을 회전축에 수직으로 자른 단면의 크기는 항상 같다" → ✕).

---

## 4. 코드 등록 계약 (`06c-unit-circle.js` 패턴 준수)
모듈 내부 IIFE 안에서 전역 공유 객체에만 등록합니다.
- `GEN`: `rotation`, `rotationStep`, `rotprop`, `rotpropStep` + `ty_rotation_1..4`, `ty_rotprop_1..4`, `mix_rotation`, `mix_rotprop`
- `STEPGEN`: `Object.assign(STEPGEN, { rotation: GEN.rotationStep, rotprop: GEN.rotpropStep })`
- `LESSON_OF`: 각 생성기 이름 → `'rotation'` / `'rotprop'` 매핑
- `PTYPES.rotation`, `PTYPES.rotprop` 등록 + `tyKey` 기반 `GEN`·`LESSON_OF` 자동 바인딩
- `PTYPE_NM`, `CALC_FOR` (`rotation: ['facts', 'mul']`, `rotprop: ['area', 'mul']`), `CONCEPT`, `EXPLORE`, `PV_CARDS`, `TERMS` 확장

---

## 5. 완료 조건 (Definition of Done)
1. `node tests/verify.mjs` 실행 시 문법 및 `rotation`, `rotprop` 모든 유형(seed 1~40+) 100% 통과.
2. 학생 안내 문구는 모두 따뜻하고 쉬운 한국어 해요체 사용.
3. 인쇄(`#print`) 호환을 위해 `fig`에 `svg` 또는 `Viewer`가 정상 동작하도록 구현.
