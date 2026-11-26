/* ───────── 보스전 문제 은행 (T05) ─────────
   window.BOSS_BANK = { normal: [...], hard: [...] }
   한 칸은 고정 문제 객체이거나, 난수 함수 r(0 이상 1 미만)을 받아 문제를 돌려주는 함수 r => ({...}) 예요.
   문제 규격: { unit, q, ans, type, suffix?, choices?, tip }
     unit   : '원과 부채꼴'(Ⅵ-04·05) | '입체도형'(Ⅶ-01~04, 구 제외) | '좌표평면과 그래프'(Ⅳ 전체)
     q      : 문제 HTML
     ans    : 정답 (type 'pi'면 π의 계수, 'choice'면 보기 문자열)
     type   : 'num' | 'pi' | 'sn'(부호 있는 수) | 'choice'
     suffix : 단위 (선택)
     tip    : 끝난 뒤 복기용 핵심 풀이 1~2줄
   다른 AI가 문제를 더할 때는 이 파일의 배열 끝에 한 칸씩만 덧붙여 주세요. */
(() => {
  const R = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const P = (r, a) => a[Math.floor(r() * a.length)];
  const pi = k => (k === 1 ? '' : k) + 'π';
  const neg = n => (n < 0 ? '−' + (-n) : String(n));
  const C = '원과 부채꼴', S = '입체도형', V = '좌표평면과 그래프';
  const POLY = { 3: '삼', 4: '사', 5: '오', 6: '육', 7: '칠', 8: '팔', 9: '구', 10: '십' };

  /* 부채꼴: 반지름 r, 중심각 x에서 호와 넓이가 π의 정수배가 되는 짝 */
  const ARC = [[6, 60], [6, 120], [9, 40], [9, 80], [12, 30], [12, 90], [12, 150], [10, 36], [10, 72], [10, 108], [8, 45], [8, 135], [18, 20], [15, 48], [6, 150], [4, 90], [4, 270], [3, 120], [3, 240], [5, 72], [5, 144]];
  const AREA = [[6, 60], [6, 120], [6, 30], [6, 90], [12, 30], [12, 60], [12, 45], [4, 45], [4, 90], [4, 135], [3, 40], [3, 80], [3, 120], [9, 40], [9, 80], [10, 36], [10, 72], [8, 45], [2, 90], [2, 180]];

  const normal = [
    /* ── 원과 부채꼴 ── */
    r => { const [rad, x] = P(r, ARC); const k = rad * x / 180;
      return { unit: C, q: `반지름이 <b>${rad} cm</b>, 중심각이 <b>${x}°</b>인 부채꼴의 <b>호의 길이</b>는?`, ans: k, type: 'pi', suffix: 'cm',
        tip: `호의 길이 = 2π × ${rad} × ${x}/360 = ${pi(k)} cm` }; },
    r => { const [rad, x] = P(r, AREA); const k = rad * rad * x / 360;
      return { unit: C, q: `반지름이 <b>${rad} cm</b>, 중심각이 <b>${x}°</b>인 부채꼴의 <b>넓이</b>는?`, ans: k, type: 'pi', suffix: 'cm²',
        tip: `넓이 = π × ${rad}² × ${x}/360 = ${pi(k)} cm²` }; },
    r => { const rad = R(r, 2, 12), area = r() < 0.5;
      return area
        ? { unit: C, q: `반지름이 <b>${rad} cm</b>인 원의 <b>넓이</b>는?`, ans: rad * rad, type: 'pi', suffix: 'cm²', tip: `원의 넓이 = πr² = π × ${rad}² = ${pi(rad * rad)} cm²` }
        : { unit: C, q: `반지름이 <b>${rad} cm</b>인 원의 <b>둘레의 길이</b>는?`, ans: 2 * rad, type: 'pi', suffix: 'cm', tip: `원의 둘레 = 2πr = 2π × ${rad} = ${pi(2 * rad)} cm` }; },
    r => { const a = P(r, [20, 30, 40, 45, 60]), m = P(r, [2, 3, 4]), b = R(r, 2, 9);
      return { unit: C, q: `한 원에서 중심각이 <b>${a}°</b>인 부채꼴의 호의 길이가 <b>${b} cm</b>예요. 중심각이 <b>${a * m}°</b>인 부채꼴의 호의 길이는?`, ans: b * m, type: 'num', suffix: 'cm',
        tip: `중심각이 ${m}배 → 호의 길이도 ${m}배: ${b} × ${m} = ${b * m} cm` }; },
    r => { const a = P(r, [30, 40, 60, 90]), m = P(r, [2, 3, 4]), s = R(r, 3, 12);
      return { unit: C, q: `한 원에서 중심각이 <b>${a * m}°</b>인 부채꼴의 넓이가 <b>${s * m} cm²</b>예요. 중심각이 <b>${a}°</b>인 부채꼴의 넓이는?`, ans: s, type: 'num', suffix: 'cm²',
        tip: `중심각이 1/${m} → 넓이도 1/${m}: ${s * m} ÷ ${m} = ${s} cm²` }; },
    r => { const rad = P(r, [4, 6, 8, 10, 12]), l = P(r, [2, 3, 4, 5]);
      return { unit: C, q: `반지름이 <b>${rad} cm</b>, 호의 길이가 <b>${pi(l)} cm</b>인 부채꼴의 넓이는?`, ans: l * rad / 2, type: 'pi', suffix: 'cm²',
        tip: `부채꼴 넓이 = ½ × 반지름 × 호 = ½ × ${rad} × ${pi(l)} = ${pi(l * rad / 2)} cm²` }; },
    r => { const it = P(r, [
        ['원 위의 두 점을 이은 선분', '현', ['현', '호', '할선', '부채꼴']],
        ['원 위의 두 점 사이의 원의 일부분', '호', ['호', '현', '활꼴', '반지름']],
        ['호와 현으로 둘러싸인 도형', '활꼴', ['활꼴', '부채꼴', '반원', '호']],
        ['두 반지름과 호로 둘러싸인 도형', '부채꼴', ['부채꼴', '활꼴', '현', '원']],
        ['원에서 길이가 가장 긴 현', '지름', ['지름', '반지름', '호', '접선']]]);
      return { unit: C, q: `다음을 무엇이라고 할까요? <b>${it[0]}</b>`, ans: it[1], type: 'choice', choices: it[2], tip: `${it[0]} → ${it[1]}` }; },
    { unit: C, q: '한 원에서 중심각의 크기가 2배가 되면, <b>현의 길이</b>도 꼭 2배가 될까요?', ans: '아니요, 2배보다 짧아요', type: 'choice',
      choices: ['아니요, 2배보다 짧아요', '네, 꼭 2배예요', '아니요, 2배보다 길어요'], tip: '호의 길이와 넓이는 중심각에 정비례하지만, 현의 길이는 정비례하지 않아요.' },

    /* ── 입체도형 ── */
    r => { const n = R(r, 3, 10), kind = P(r, ['기둥', '뿔', '뿔대']), what = P(r, ['면', '모서리', '꼭짓점']);
      const T = { 기둥: { 면: n + 2, 모서리: 3 * n, 꼭짓점: 2 * n }, 뿔: { 면: n + 1, 모서리: 2 * n, 꼭짓점: n + 1 }, 뿔대: { 면: n + 2, 모서리: 3 * n, 꼭짓점: 2 * n } }[kind];
      const how = { 기둥: { 면: 'n + 2', 모서리: '3n', 꼭짓점: '2n' }, 뿔: { 면: 'n + 1', 모서리: '2n', 꼭짓점: 'n + 1' }, 뿔대: { 면: 'n + 2', 모서리: '3n', 꼭짓점: '2n' } }[kind][what];
      return { unit: S, q: `<b>${POLY[n]}각${kind}</b>의 <b>${what}</b>의 개수는?`, ans: T[what], type: 'num', suffix: '개',
        tip: `n각${kind}의 ${what} = ${how} → n = ${n}이면 ${T[what]}개` }; },
    r => { const it = P(r, [
        ['면이 정삼각형이고, 한 꼭짓점에 모인 면이 3개', '정사면체'], ['면이 정삼각형이고, 한 꼭짓점에 모인 면이 4개', '정팔면체'],
        ['면이 정삼각형이고, 한 꼭짓점에 모인 면이 5개', '정이십면체'], ['면이 정사각형이고, 한 꼭짓점에 모인 면이 3개', '정육면체'],
        ['면이 정오각형이고, 한 꼭짓점에 모인 면이 3개', '정십이면체']]);
      return { unit: S, q: `<b>${it[0]}</b>인 정다면체는?`, ans: it[1], type: 'choice', choices: ['정사면체', '정육면체', '정팔면체', '정십이면체', '정이십면체'],
        tip: `${it[0]} → ${it[1]}` }; },
    r => { const [a, b] = P(r, [[3, 4], [6, 8], [5, 12], [4, 6], [6, 5]]), h = R(r, 2, 9), base = a * b / 2;
      return { unit: S, q: `밑면이 두 변 <b>${a} cm</b>, <b>${b} cm</b>를 낀 직각삼각형이고 높이가 <b>${h} cm</b>인 삼각기둥의 <b>부피</b>는?`, ans: base * h, type: 'num', suffix: 'cm³',
        tip: `밑넓이 = ${a} × ${b} ÷ 2 = ${base} → 부피 = ${base} × ${h} = ${base * h} cm³` }; },
    r => { const rad = R(r, 2, 6), h = R(r, 3, 10);
      return { unit: S, q: `밑면의 반지름이 <b>${rad} cm</b>, 높이가 <b>${h} cm</b>인 원기둥의 <b>옆넓이</b>는?`, ans: 2 * rad * h, type: 'pi', suffix: 'cm²',
        tip: `옆면을 펼치면 직사각형: 가로(밑면 둘레) ${pi(2 * rad)} × 세로(높이) ${h} = ${pi(2 * rad * h)} cm²` }; },
    r => { const a = R(r, 2, 6);
      return { unit: S, q: `한 모서리가 <b>${a} cm</b>인 정육면체의 <b>겉넓이</b>는?`, ans: 6 * a * a, type: 'num', suffix: 'cm²',
        tip: `면 6개가 모두 넓이 ${a * a}인 정사각형: ${a * a} × 6 = ${6 * a * a} cm²` }; },
    r => { const it = P(r, [['직사각형', '한 변', '원기둥'], ['직각삼각형', '직각을 낀 한 변', '원뿔'], ['반원', '지름', '구'], ['사다리꼴(두 각이 직각)', '직각을 낀 변', '원뿔대']]);
      return { unit: S, q: `<b>${it[0]}</b>을 <b>${it[1]}</b>을 축으로 하여 한 바퀴 돌리면 생기는 회전체는?`, ans: it[2], type: 'choice', choices: ['원기둥', '원뿔', '구', '원뿔대'],
        tip: `${it[0]}을 ${it[1]}을 축으로 돌리면 ${it[2]}가 돼요.` }; },
    r => { const rad = P(r, [3, 6]), h = R(r, 2, 8);
      return { unit: S, q: `밑면의 반지름이 <b>${rad} cm</b>, 높이가 <b>${h} cm</b>인 원뿔의 <b>부피</b>는?`, ans: rad * rad * h / 3, type: 'pi', suffix: 'cm³',
        tip: `뿔의 부피 = ⅓ × 밑넓이 × 높이 = ⅓ × ${pi(rad * rad)} × ${h} = ${pi(rad * rad * h / 3)} cm³` }; },
    r => { const a = R(r, 2, 8), b = R(r, 2, 8), c = R(r, 2, 10);
      return { unit: S, q: `가로 <b>${a} cm</b>, 세로 <b>${b} cm</b>, 높이 <b>${c} cm</b>인 직육면체의 <b>부피</b>는?`, ans: a * b * c, type: 'num', suffix: 'cm³',
        tip: `부피 = 밑넓이 × 높이 = ${a * b} × ${c} = ${a * b * c} cm³` }; },
    r => { const a = R(r, 2, 6), b = R(r, 2, 6), c = R(r, 2, 8), s = 2 * (a * b + b * c + c * a);
      return { unit: S, q: `가로 <b>${a} cm</b>, 세로 <b>${b} cm</b>, 높이 <b>${c} cm</b>인 직육면체의 <b>겉넓이</b>는?`, ans: s, type: 'num', suffix: 'cm²',
        tip: `겉넓이 = 밑넓이 × 2 + 옆넓이 = ${a * b} × 2 + ${2 * (a + b)} × ${c} = ${s} cm²` }; },
    r => { const rad = R(r, 2, 6), h = R(r, 2, 10);
      return { unit: S, q: `밑면의 반지름이 <b>${rad} cm</b>, 높이가 <b>${h} cm</b>인 원기둥의 <b>부피</b>는?`, ans: rad * rad * h, type: 'pi', suffix: 'cm³',
        tip: `부피 = πr² × h = ${pi(rad * rad)} × ${h} = ${pi(rad * rad * h)} cm³` }; },
    r => { const b = P(r, [[3, 4], [4, 6], [6, 5], [5, 6], [6, 6]]), h = P(r, [3, 6, 9]);
      const base = b[0] * b[1];
      return { unit: S, q: `밑면이 가로 <b>${b[0]} cm</b>, 세로 <b>${b[1]} cm</b>인 직사각형이고 높이가 <b>${h} cm</b>인 사각뿔의 <b>부피</b>는?`, ans: base * h / 3, type: 'num', suffix: 'cm³',
        tip: `뿔의 부피 = ⅓ × ${base} × ${h} = ${base * h / 3} cm³ (같은 기둥의 ⅓)` }; },

    /* ── 순서쌍과 좌표 · 그래프 ── */
    r => { const x = P(r, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]), y = P(r, [-5, -4, -3, -2, 0, 1, 2, 3, 4, 5]);
      const q = x === 0 || y === 0 ? '어느 사분면에도 속하지 않아요' : x > 0 ? (y > 0 ? '제1사분면' : '제4사분면') : (y > 0 ? '제2사분면' : '제3사분면');
      return { unit: V, q: `점 <b>(${neg(x)}, ${neg(y)})</b>는 어디에 있을까요?`, ans: q, type: 'choice', choices: ['제1사분면', '제2사분면', '제3사분면', '제4사분면', '어느 사분면에도 속하지 않아요'],
        tip: x === 0 || y === 0 ? '좌표축 위의 점은 어느 사분면에도 속하지 않아요.' : `x ${x > 0 ? '+' : '−'}, y ${y > 0 ? '+' : '−'} → ${q}` }; },
    r => { const a = P(r, [2, 4, 6, 8]), b = R(r, 2, 8);
      return { unit: V, q: `세 점 O(0, 0), A(${a}, 0), B(0, ${b})를 꼭짓점으로 하는 삼각형 OAB의 <b>넓이</b>는?`, ans: a * b / 2, type: 'num',
        tip: `밑변 ${a}, 높이 ${b}인 직각삼각형: ${a} × ${b} ÷ 2 = ${a * b / 2}` }; },
    r => { const x = R(r, -6, 6), y = R(r, -6, 6), ax = P(r, ['x', 'y']);
      return { unit: V, q: `점 (${neg(x)}, ${neg(y)})의 <b>${ax}좌표</b>는?`, ans: ax === 'x' ? x : y, type: 'sn',
        tip: `(x좌표, y좌표) 순서로 써요 → ${ax}좌표는 ${neg(ax === 'x' ? x : y)}` }; },
    /* ── 정비례와 반비례 ── */
    r => { const a = P(r, [-4, -3, -2, 2, 3, 4, 5]), x = P(r, [-3, -2, 2, 3, 4]);
      return { unit: V, q: `y가 x에 정비례하고, x = ${neg(x)}일 때 y = ${neg(a * x)}예요. <b>y = ax</b>에서 <b>a</b>의 값은?`, ans: a, type: 'sn',
        tip: `a = y ÷ x = ${neg(a * x)} ÷ ${neg(x)} = ${neg(a)}` }; },
    r => { const a = P(r, [-3, -2, 2, 3, 4]), x = P(r, [-5, -4, -2, 3, 5, 6]);
      return { unit: V, q: `<b>y = ${a === 1 ? '' : a === -1 ? '−' : neg(a)}x</b>에서 x = ${neg(x)}일 때 y의 값은?`, ans: a * x, type: 'sn',
        tip: `y = ${neg(a)} × (${neg(x)}) = ${neg(a * x)}` }; },
    r => { const x = P(r, [-4, -3, -2, 2, 3, 6]), y = P(r, [-6, -4, -3, 2, 4, 5]);
      return { unit: V, q: `y가 x에 반비례하고, x = ${neg(x)}일 때 y = ${neg(y)}예요. <b>y = a/x</b>에서 <b>a</b>의 값은?`, ans: x * y, type: 'sn',
        tip: `반비례는 xy = a (일정): a = ${neg(x)} × (${neg(y)}) = ${neg(x * y)}` }; },
    r => { const a = P(r, [12, 18, 24, -12, -24, 36]), x = P(r, [2, 3, 4, 6, -2, -3, -6].filter(v => a % v === 0));
      return { unit: V, q: `<b>y = ${neg(a)}/x</b>에서 x = ${neg(x)}일 때 y의 값은?`, ans: a / x, type: 'sn',
        tip: `y = ${neg(a)} ÷ (${neg(x)}) = ${neg(a / x)}` }; },
    r => { const a = P(r, [-3, -2, -1, 1, 2, 3]);
      return { unit: V, q: `<b>y = ${a === 1 ? '' : a === -1 ? '−' : neg(a)}x</b>의 그래프가 지나는 곳은?`, ans: a > 0 ? '원점, 제1사분면, 제3사분면' : '원점, 제2사분면, 제4사분면', type: 'choice',
        choices: ['원점, 제1사분면, 제3사분면', '원점, 제2사분면, 제4사분면', '원점, 제1사분면, 제2사분면', '원점을 지나지 않아요'],
        tip: `y = ax는 원점을 지나는 직선, a ${a > 0 ? '> 0이면 제1·3사분면' : '< 0이면 제2·4사분면'}` }; },
    r => { const v = R(r, 2, 6), t = R(r, 3, 9);
      return { unit: V, q: `물통에 1분에 <b>${v} L</b>씩 물을 넣어요. 물을 <b>${v * t} L</b> 넣는 데 걸리는 시간은? (x분 동안 넣은 물 y L → y = ${v}x)`, ans: t, type: 'num', suffix: '분',
        tip: `${v * t} = ${v}x → x = ${t}분` }; },
    r => { const k = P(r, [24, 36, 48, 60]), x = P(r, [2, 3, 4, 6].filter(d => k % d === 0));
      return { unit: V, q: `넓이가 <b>${k} cm²</b>인 직사각형의 가로를 x cm, 세로를 y cm라 할 때, 가로가 <b>${x} cm</b>이면 세로는?`, ans: k / x, type: 'num', suffix: 'cm',
        tip: `xy = ${k} (반비례) → y = ${k} ÷ ${x} = ${k / x} cm` }; },
  ];

  const hard = [
    /* ── 원과 부채꼴 (고난도) ── */
    r => { const [rad, x] = P(r, AREA); const k = rad * rad * x / 360;
      return { unit: C, q: `반지름이 <b>${rad} cm</b>이고 넓이가 <b>${pi(k)} cm²</b>인 부채꼴의 <b>중심각</b>은?`, ans: x, type: 'num', suffix: '°',
        tip: `π × ${rad}² × x/360 = ${pi(k)} → x = ${x}°` }; },
    r => { const rad = P(r, [4, 6, 8, 10, 12]), l = P(r, [2, 3, 4, 5, 6]);
      return { unit: C, q: `호의 길이가 <b>${pi(l)} cm</b>, 넓이가 <b>${pi(l * rad / 2)} cm²</b>인 부채꼴의 <b>반지름</b>은?`, ans: rad, type: 'num', suffix: 'cm',
        tip: `넓이 = ½ × r × 호 → ${pi(l * rad / 2)} = ½ × r × ${pi(l)} → r = ${rad} cm` }; },
    r => { const big = R(r, 4, 9), sm = R(r, 1, big - 2);
      return { unit: C, q: `중심이 같은 두 원의 반지름이 <b>${big} cm</b>, <b>${sm} cm</b>예요. 두 원 사이 <b>고리 모양의 넓이</b>는?`, ans: big * big - sm * sm, type: 'pi', suffix: 'cm²',
        tip: `큰 원 − 작은 원 = ${pi(big * big)} − ${pi(sm * sm)} = ${pi(big * big - sm * sm)} cm²` }; },
    r => { const rad = P(r, [2, 4, 6, 8, 10]);
      return { unit: C, q: `반지름이 <b>${rad} cm</b>인 반원의 <b>곡선 부분(호)의 길이</b>와, 지름이 <b>${rad} cm</b>인 원의 <b>둘레</b>의 합은?`, ans: rad + rad, type: 'pi', suffix: 'cm',
        tip: `반원의 호 = π × ${rad} = ${pi(rad)}, 지름 ${rad}인 원의 둘레 = ${pi(rad)} → 합 ${pi(2 * rad)} cm` }; },
    r => { const [rad, x] = P(r, ARC.filter(([a, b]) => (a * b) % 180 === 0 && b < 180)); const l = rad * x / 180;
      return { unit: C, q: `반지름이 <b>${rad} cm</b>인 부채꼴의 호의 길이가 <b>${pi(l)} cm</b>예요. 이 부채꼴의 <b>중심각</b>은?`, ans: x, type: 'num', suffix: '°',
        tip: `2π × ${rad} × x/360 = ${pi(l)} → x = ${x}°` }; },
    r => { const a = P(r, [30, 40, 45, 60, 72]), s = R(r, 2, 9) , m = 360 / a;
      return { unit: C, q: `중심각이 <b>${a}°</b>인 부채꼴의 넓이가 <b>${s} cm²</b>예요. 같은 원 전체의 넓이는?`, ans: s * m, type: 'num', suffix: 'cm²',
        tip: `원 전체는 중심각 360° → ${a}°의 ${m}배: ${s} × ${m} = ${s * m} cm²` }; },

    /* ── 입체도형 (고난도) ── */
    r => { const n = R(r, 4, 10), from = P(r, ['꼭짓점', '모서리']), kind = P(r, ['기둥', '뿔']);
      const v = { 기둥: { 꼭짓점: 2 * n, 모서리: 3 * n, 면: n + 2 }, 뿔: { 꼭짓점: n + 1, 모서리: 2 * n, 면: n + 1 } }[kind];
      const to = from === '꼭짓점' ? '모서리' : '면';
      return { unit: S, q: `<b>${from}</b>의 개수가 <b>${v[from]}</b>개인 각${kind}의 <b>${to}</b>의 개수는?`, ans: v[to], type: 'num', suffix: '개',
        tip: `${from} ${v[from]}개 → ${POLY[n]}각${kind}(n = ${n}) → ${to} ${v[to]}개` }; },
    r => { const it = P(r, [['정사면체', '꼭짓점', 4], ['정사면체', '모서리', 6], ['정육면체', '꼭짓점', 8], ['정육면체', '모서리', 12], ['정팔면체', '꼭짓점', 6], ['정팔면체', '모서리', 12],
        ['정십이면체', '꼭짓점', 20], ['정십이면체', '모서리', 30], ['정이십면체', '꼭짓점', 12], ['정이십면체', '모서리', 30]]);
      const F = { 정사면체: [4, 3, 3], 정육면체: [6, 4, 3], 정팔면체: [8, 3, 4], 정십이면체: [12, 5, 3], 정이십면체: [20, 3, 5] }[it[0]];
      return { unit: S, q: `<b>${it[0]}</b>의 <b>${it[1]}</b>의 개수는?`, ans: it[2], type: 'num', suffix: '개',
        tip: it[1] === '모서리' ? `면 ${F[0]}개 × 변 ${F[1]}개 ÷ 2 = ${it[2]}` : `면 ${F[0]}개 × 꼭짓점 ${F[1]}개 ÷ (한 꼭짓점에 모인 면 ${F[2]}) = ${it[2]}` }; },
    r => { const rad = R(r, 2, 5), h = R(r, 3, 8), s = 2 * rad * rad + 2 * rad * h;
      return { unit: S, q: `밑면의 반지름이 <b>${rad} cm</b>, 높이가 <b>${h} cm</b>인 원기둥의 <b>겉넓이</b>는?`, ans: s, type: 'pi', suffix: 'cm²',
        tip: `밑넓이 2개 ${pi(2 * rad * rad)} + 옆넓이 2π×${rad}×${h} = ${pi(2 * rad * h)} → ${pi(s)} cm²` }; },
    r => { const big = R(r, 3, 6), sm = R(r, 1, big - 1), h = R(r, 3, 10);
      return { unit: S, q: `반지름 <b>${big} cm</b>인 원기둥 가운데에 반지름 <b>${sm} cm</b>인 원기둥 모양 구멍을 뚫었어요. 높이가 <b>${h} cm</b>일 때 남은 부분의 <b>부피</b>는?`, ans: (big * big - sm * sm) * h, type: 'pi', suffix: 'cm³',
        tip: `밑넓이 = ${pi(big * big)} − ${pi(sm * sm)} = ${pi(big * big - sm * sm)} → × ${h} = ${pi((big * big - sm * sm) * h)} cm³` }; },
    r => { const rad = R(r, 2, 5), h = R(r, 2, 9);
      return { unit: S, q: `밑면의 반지름이 <b>${rad} cm</b>인 원기둥의 부피가 <b>${pi(rad * rad * h)} cm³</b>예요. 이 원기둥의 <b>높이</b>는?`, ans: h, type: 'num', suffix: 'cm',
        tip: `밑넓이 ${pi(rad * rad)} × 높이 = ${pi(rad * rad * h)} → 높이 = ${h} cm` }; },
    r => { const a = R(r, 2, 6), b = R(r, 2, 6), V = a * b * R(r, 2, 8);
      return { unit: S, q: `밑면이 가로 <b>${a} cm</b>, 세로 <b>${b} cm</b>인 직육면체의 부피가 <b>${V} cm³</b>예요. 이 직육면체의 <b>겉넓이</b>는?`, ans: 2 * (a * b + (a + b) * (V / (a * b))), type: 'num', suffix: 'cm²',
        tip: `높이 = ${V} ÷ ${a * b} = ${V / (a * b)} → 겉넓이 = ${a * b} × 2 + ${2 * (a + b)} × ${V / (a * b)} = ${2 * (a * b + (a + b) * (V / (a * b)))} cm²` }; },
    r => { const [rad, l] = P(r, [[3, 5], [5, 13], [6, 10], [4, 9], [2, 7], [3, 8]]), s = rad * rad + rad * l;
      return { unit: S, q: `밑면의 반지름이 <b>${rad} cm</b>, 모선의 길이가 <b>${l} cm</b>인 원뿔의 <b>겉넓이</b>는?`, ans: s, type: 'pi', suffix: 'cm²',
        tip: `밑넓이 ${pi(rad * rad)} + 옆넓이 π×${rad}×${l} = ${pi(rad * l)} → ${pi(s)} cm²` }; },
    r => { const rad = P(r, [3, 6]), h = P(r, [4, 8, 10]), cyl = rad * rad * h, cone = rad * rad * h / 3;
      return { unit: S, q: `밑면의 반지름이 <b>${rad} cm</b>, 높이가 <b>${h} cm</b>인 원기둥 모양 그릇에서, 밑면과 높이가 같은 <b>원뿔 모양을 파냈어요</b>. 남은 부분의 부피는?`, ans: cyl - cone, type: 'pi', suffix: 'cm³',
        tip: `${pi(cyl)} − ${pi(cone)} = ${pi(cyl - cone)} cm³` }; },
    r => { const a = P(r, [3, 6, 9]), h = P(r, [4, 5, 8]);
      return { unit: S, q: `한 모서리가 <b>${a} cm</b>인 정사각형을 밑면으로 하는 사각기둥과 사각뿔의 높이가 모두 <b>${h} cm</b>예요. 두 부피의 <b>차</b>는?`, ans: a * a * h * 2 / 3, type: 'num', suffix: 'cm³',
        tip: `기둥 ${a * a * h} − 뿔 ${a * a * h / 3} = ${a * a * h * 2 / 3} cm³ (기둥의 ⅔)` }; },

    /* ── 순서쌍과 좌표 (고난도) ── */
    r => { const qd = P(r, [1, 2, 3, 4]), sa = qd === 1 || qd === 4 ? 1 : -1, sb = qd <= 2 ? 1 : -1, f = P(r, [['(b, a)', (x, y) => [y, x]], ['(−a, b)', (x, y) => [-x, y]], ['(ab, b)', (x, y) => [x * y, y]], ['(a − b, ab)', (x, y) => [x - y, x * y]]]);
      const [X, Y] = f[1](sa * 2, sb * 3), name = X > 0 ? (Y > 0 ? '제1사분면' : '제4사분면') : (Y > 0 ? '제2사분면' : '제3사분면');
      return { unit: V, q: `점 P(a, b)가 <b>제${qd}사분면</b> 위의 점일 때, 점 <b>${f[0]}</b>은 어디에 있을까요?`, ans: name, type: 'choice', choices: ['제1사분면', '제2사분면', '제3사분면', '제4사분면'],
        tip: `a ${sa > 0 ? '> 0' : '< 0'}, b ${sb > 0 ? '> 0' : '< 0'} → ${f[0]}의 부호를 따지면 x ${X > 0 ? '+' : '−'}, y ${Y > 0 ? '+' : '−'} → ${name}` }; },
    r => { const a = R(r, 1, 4), c = R(r, 1, 5), b = R(r, 1, 4), d = R(r, 1, 4);
      return { unit: V, q: `네 점 A(−${a}, ${b}), B(${c}, ${b}), C(${c}, −${d}), D(−${a}, −${d})를 꼭짓점으로 하는 사각형의 <b>넓이</b>는?`, ans: (a + c) * (b + d), type: 'num',
        tip: `가로 ${c} − (−${a}) = ${a + c}, 세로 ${b} − (−${d}) = ${b + d} → ${(a + c) * (b + d)}` }; },
    /* ── 정비례와 반비례 (고난도) ── */
    r => { const a = P(r, [-4, -3, -2, 2, 3, 5]), x1 = P(r, [-3, -2, 2, 4]), x2 = P(r, [-5, 3, 5, 6, -6].filter(v => v !== x1));
      return { unit: V, q: `y가 x에 정비례하고, x = ${neg(x1)}일 때 y = ${neg(a * x1)}예요. x = ${neg(x2)}일 때 y의 값은?`, ans: a * x2, type: 'sn',
        tip: `a = ${neg(a * x1)} ÷ ${neg(x1)} = ${neg(a)} → y = ${neg(a)} × (${neg(x2)}) = ${neg(a * x2)}` }; },
    r => { const k = P(r, [12, 24, -12, -24, 36, -36]), ds = [2, 3, 4, 6, -2, -3, -4, -6].filter(d => k % d === 0), x1 = P(r, ds), y2 = P(r, ds.filter(d => d !== k / x1));
      return { unit: V, q: `y가 x에 반비례하고, x = ${neg(x1)}일 때 y = ${neg(k / x1)}예요. y = ${neg(y2)}일 때 x의 값은?`, ans: k / y2, type: 'sn',
        tip: `xy = ${neg(k)} (일정) → x = ${neg(k)} ÷ (${neg(y2)}) = ${neg(k / y2)}` }; },
    r => { const a = P(r, [2, 3, -2, -3]), p = P(r, [2, 3, -2, 4]);
      return { unit: V, q: `<b>y = ${neg(a)}x</b>의 그래프와 <b>y = b/x</b>의 그래프가 x = ${neg(p)}인 점에서 만나요. <b>b</b>의 값은?`, ans: a * p * p, type: 'sn',
        tip: `만나는 점 (${neg(p)}, ${neg(a * p)}) → b = xy = ${neg(p)} × (${neg(a * p)}) = ${neg(a * p * p)}` }; },
    r => { const a = P(r, [-3, -2, 2, 3, 4]), y = P(r, [6, -6, 12, -12, 24].filter(v => v % a === 0));
      return { unit: V, q: `점 (k, ${neg(y)})가 <b>y = ${neg(a)}x</b>의 그래프 위에 있어요. <b>k</b>의 값은?`, ans: y / a, type: 'sn',
        tip: `${neg(y)} = ${neg(a)} × k → k = ${neg(y / a)}` }; },
    r => { const [A, n] = P(r, [[30, 4], [24, 5], [36, 2], [40, 3], [20, 6]]), B = P(r, [10, 12, 15, 20, 24, 30, 40, 60].filter(b => (A * n) % b === 0 && b !== A));
      return { unit: V, q: `서로 맞물려 도는 두 톱니바퀴 A, B가 있어요. 톱니 <b>${A}개</b>인 A가 <b>${n}바퀴</b> 돌 때, 톱니 <b>${B}개</b>인 B는 몇 바퀴 돌까요?`, ans: A * n / B, type: 'num', suffix: '바퀴',
        tip: `맞물린 톱니 수는 같아요: ${A} × ${n} = ${B} × y → y = ${A * n / B} (반비례)` }; },
    r => { const k = P(r, [6, 8, 12]);
      return { unit: V, q: `<b>y = ${k}/x</b>의 그래프 위의 점 중에서 <b>x좌표와 y좌표가 모두 자연수</b>인 점은 몇 개일까요?`, ans: [...Array(k)].filter((_, i) => k % (i + 1) === 0).length, type: 'num', suffix: '개',
        tip: `x는 ${k}의 약수: ${[...Array(k)].map((_, i) => i + 1).filter(d => k % d === 0).join(', ')} → ${[...Array(k)].filter((_, i) => k % (i + 1) === 0).length}개` }; },
  ];

  window.BOSS_BANK = { normal, hard, units: [C, S, V] };
})();
