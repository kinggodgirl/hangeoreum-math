# 교과서 시험 범위 문제 꼬리표 은행 (`data/textbook-bank.json`) — [T12]

지학사 2022 개정 중학교 수학 1에서 **이번 시험 범위 문제를 모두 모아 꼬리표를 단 자료**예요.
Claude Code와 Antigravity가 차시 문제·보스전(`js/boss-bank.js`)·미니게임 문제를 만들 때 **같은 기준**으로 씁니다.

- 범위: **Ⅳ 좌표평면과 그래프 전체(108~136쪽)** · **Ⅵ-04 원과 부채꼴 · Ⅵ-05 부채꼴의 호의 길이와 넓이(194~206쪽)** · **Ⅶ-01~04 다면체·회전체·기둥·뿔(210~242쪽)**
- 빠진 것: Ⅶ-05 구(233~237쪽)와 Ⅶ 마무리 9·10·11번(구 포함), Ⅵ 마무리 중 다각형 문제(1~3·6·7·10·11·14번)
- 모은 곳: 생각 펼치기 · 확인하기 · 함께 해 보기 · 문제 · 생각 더 나아가기 · 스스로 점검하기 · 수학으로 세상보기/탐험하기 · 스스로 마무리하기 · 이것만은 알고 가기 → **192문항**
- 정답은 교과서 `정답과 해설`(293~312쪽)과 맞춰 봤어요. 그림 속 수치는 PDF 쪽 그림을 보고 옮겼어요.

## 저작권 원칙 (중요)

이 저장소는 GitHub Pages로 공개될 수 있어서 **교과서 문장·그림은 넣지 않아요.**
- `sum`: 문제를 **우리말로 짧게 요약**(90자 이하, 원문 문장 복사 금지 — `tests/textbook-bank.mjs`가 길이를 검사해요)
- `given`·`ans`: 수치와 정답(사실 정보)만
- 원문이 필요하면 프로젝트 폴더 `/mnt/project-files/textbook/`의 본문 텍스트·PDF에서 그 쪽만 봐요(`id`의 쪽 번호로 바로 찾을 수 있어요).
- 학생 화면에 낼 때는 **수치나 상황을 바꾼 쌍둥이 문제**로 만들어요(교과서 문제를 그대로 옮기지 않기).

## 꼬리표 형식 (한 문항 = 한 줄 JSON)

```json
{"id":"p199-2-1","unit":"VI","sec":"05","secNm":"부채꼴의 호의 길이와 넓이","page":199,"kind":"prob","no":"2(1)",
 "lesson":"sector","type":"sector:arcS","level":1,"calc":["pi","frac"],"form":"pi",
 "sum":"반지름 8, 중심각 45° 부채꼴의 호·넓이","given":{"r":8,"a":45},"ans":"2π cm, 8π cm²","boss":true}
```

| 키 | 뜻 | 값 |
| :--- | :--- | :--- |
| `id` | 문항 이름표 | `p쪽-번호` (예 `p196-3-1` = 196쪽 3번 ⑴, `p199-ex1` 함께 해 보기, `p201-s4` 스스로 점검 4번, `p205-m5` 마무리 5번, `p195-open` 생각 펼치기, `p196-more` 생각 더 나아가기, `p108-r2` 이것만은 알고 가기) |
| `unit` · `sec` · `secNm` | 대단원 · 중단원 번호 · 중단원 이름 | `IV`·`VI`·`VII` / `01`~`05` |
| `page` · `no` | 교과서 쪽 · 교과서에 적힌 번호 | `no`는 `3(1)`, `-`(번호 없음) 등 |
| `kind` | 어디에 나온 문제인지 | `ready` 이것만은 알고 가기 · `open` 생각 펼치기 · `chk` 확인하기 · `ex` 함께 해 보기 · `prob` 본문 문제 · `more` 생각 더 나아가기 · `self` 스스로 점검하기 · `world` 수학으로 세상보기 · `explore` 수학으로 탐험하기 · `final` 스스로 마무리하기 |
| `lesson` | 한 걸음 수학 차시 id (`LESSONS`) | 아래 표 |
| `type` | 문제 유형 `차시:유형` | 아래 표. T03·T04 스펙 유형 이름과 같아요 |
| `level` | 난이도 | `1` 기본(따라 하기) · `2` 중(두 단계 이상·실생활) · `3` 상(서술형·사고력·도형 성질 결합). Ⅶ 마무리는 교과서 ●●○/●●● 표시를 따랐어요 |
| `calc` | 필요한 **기초 연산 사다리 칸** (`js/05-calc.js`의 `CALC` id) | 예 `pi`, `frac`, `ratio`, `signmul`, `eq` … (검사기가 실제 칸인지 확인) |
| `form` | 답 모양 | `num` 수 · `pi` π가 있는 식 · `frac` 분수 · `choice` 고르기 · `ox` ○× · `word` 짧은 말/여러 값 · `draw` 그리기 · `explain` 설명 |
| `sum` | 문제 요약(우리말) | 90자 이하 |
| `given` | 문제 수치 (있으면) | 예 `{"r":6,"a":120,"h":9}` — `r` 반지름, `a` 중심각, `h` 높이, `l` 모선/호, `R·H` 큰 쪽 |
| `ans` | 정답 | 교과서 정답과 해설 기준 |
| `tags` | 덧붙임 (있으면) | `실생활` · `서술형` · `사고력` · `추론` · `공학 도구` · `오개념` · `함정: …` · `초등 복습` 등 |
| `fig` | 그림이 꼭 있어야 풀 수 있음 | `true`면 앱에서는 SVG로 다시 그려야 해요 |
| `boss` | 보스전·미니게임에 바로 쓰기 좋은가 | 답이 수·보기·○×이고 그림 없이도 되는 문제 = `true` |

### 차시(`lesson`)와 유형(`type`)

| 차시 | 쪽 | 문항 | 난이도 1·2·3 | 보스용 | 유형(개수) | 많이 필요한 기초 연산 |
| :--- | :--- | ---: | :--- | ---: | :--- | :--- |
| `coord` 순서쌍과 좌표 *(앱에 아직 없음)* | 108~134 | 17 | 16·0·1 | 5 | `read` 7, `numline` 5, `quad` 3, `term` 2 | `fdconv`, `signed`, `mixed`, `signsub` |
| `graph` 그래프 *(앱에 아직 없음)* | 108~135 | 18 | 9·8·1 | 1 | `read` 10, `draw` 5, `shape` 3 | `mul`, `add2`, `dec`, `sub` |
| `prop` 정비례 *(앱에 아직 없음)* | 108~136 | 24 | 14·9·1 | 16 | `formula` 8, `graph` 8, `findA` 5, `table` 3 | `eq`, `signmul`, `mul`, `dec` |
| `inv` 반비례 *(앱에 아직 없음)* | 127~136 | 17 | 12·2·3 | 9 | `graph` 6, `formula` 5, `findA` 4, `table` 2 | `div`, `signmul`, `eq`, `dec` |
| `arc` 원과 부채꼴 | 194~197 | 4 | 4·0·0 | 1 | `term` 4 | — |
| `cent` 중심각과 호 | 195~206 | 13 | 6·5·2 | 8 | `prop` 8, `ratio` 3, `chord` 2 | `ratio`, `frac`, `div`, `mul` |
| `sector` 부채꼴의 호의 길이와 넓이 | 198~206 | 20 | 11·4·5 | 12 | `arcS` 7, `shade` 7, `halfLR` 3, `circle` 2, `inverse` 1 | `pi`, `frac`, `pow`, `surf` |
| `poly` 다면체 · 각뿔대 | 210~240 | 11 | 9·2·0 | 7 | `count` 5, `face` 2, `name` 1, `is` 1, `tf` 1, `inv` 1 | `facts`, `signsub` |
| `regular` 정다면체 | 213~240 | 8 | 3·3·2 | 3 | `is` 2, `count` 2, `net` 2, `name` 1, `why` 1 | `mul`, `div` |
| `rotation` 회전체 *(T03)* | 210~220 | 6 | 5·1·0 | 3 | `make` 3, `tf` 1, `part` 1, `is` 1 | — |
| `rotprop` 회전체의 성질 *(T03)* | 219~242 | 8 | 3·4·1 | 2 | `axis` 3, `size` 3, `perp` 1, `tf` 1 | `area`, `mul` |
| `area` 기둥의 겉넓이 | 210~238 | 12 | 6·5·1 | 8 | `prism` 6, `cyl` 4, `comp` 2 | `surf`, `mul`, `pi`, `area` |
| `volume` 기둥의 부피 *(T04)* | 223~241 | 10 | 6·2·2 | 7 | `prism` 4, `cyl` 4, `comp` 2 | `mul`, `pi`, `area`, `pow` |
| `conearea` 뿔의 겉넓이 *(T04)* | 227~242 | 11 | 6·4·1 | 9 | `pyr` 5, `cone` 4, `frust` 1, `ang` 1 | `surf`, `area`, `pi`, `frac` |
| `cone` 뿔의 부피 *(T04)* | 229~242 | 13 | 6·4·3 | 10 | `pyr` 5, `cone` 5, `frust` 3 | `frac`, `pi`, `pow`, `mul` |

유형 뜻 (자주 쓰는 것만):
- `coord:numline` 수직선 좌표 · `coord:read` 좌표 읽기/찍기 · `coord:quad` 사분면 · `graph:read` 그래프 해석 · `graph:draw` 그래프 그리기 · `graph:shape` 상황·용기와 그래프 짝짓기
- `prop|inv:table` 표 완성 · `:formula` 식 세우고 활용 · `:graph` 그래프 성질/그리기 · `:findA` 지나는 점으로 a 구하기
- `cent:prop` 중심각과 호·넓이 비례로 x · `cent:ratio` 비로 중심각 나누기 · `cent:chord` 현은 정비례하지 않음
- `sector:arcS` 호·넓이 공식 · `sector:halfLR` S=½lr · `sector:inverse` 거꾸로 · `sector:shade` 색칠한 부분(더하고 빼기)
- `area|volume:prism` 각기둥 · `:cyl` 원기둥 · `:comp` 잘라 내거나 합친 입체 · `conearea|cone:pyr` 각뿔 · `:cone` 원뿔 · `:frust` 뿔대 · `conearea:ang` 원뿔 전개도 중심각

## 쓰는 법 (Claude · Antigravity 공통)

1. **차시를 만들 때**: `lesson`으로 걸러서 `type`별로 묶으면 그 차시 `PTYPES` 유형 목록이 돼요. `level 1 → 2 → 3` 순서로 같이 풀기·혼자 풀기를 짜고, `tags`의 `함정`·`오개념`은 오답 피드백에 씁니다.
2. **보스전·미니게임**: `boss:true`만 골라 `given` 수치를 바꾼 쌍둥이 문제를 `js/boss-bank.js`에 덧붙여요. `les`에는 이 파일의 `lesson`을 그대로 적어요.
3. **기초 연산 연결**: `calc`가 그 문제를 풀 때 막히는 칸이에요. 학생이 틀리면 `calc` 첫 칸을 오늘의 길잡이 추천으로 보내요. Ⅳ단원은 `eq`·`signmul`·`fracdiv`(음수·분수로 나누어 a 구하기) 수요가 커요.
4. **새 문항 추가**: 한 줄을 `items` 끝에 덧붙이고 `node tests/verify.mjs`를 돌리면 형식·쪽 범위·기초 연산 칸 id를 자동으로 검사해요.

```js
// 예: 보스전용 원뿔 부피 문제 고르기 (Node)
const bank = JSON.parse(fs.readFileSync('data/textbook-bank.json', 'utf8'));
bank.items.filter(i => i.lesson === 'cone' && i.boss && i.level <= 2);
```
