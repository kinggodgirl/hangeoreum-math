/* ───────── 화면별 따라 보기 사용법 (T40) ─────────
   '? 어떻게 하나요?'를 누르면 지금 화면에 있는 버튼을 하나씩 비추며 설명해요.
   · 👆 하나씩 보기: 학생이 [다음]을 누르며 버튼마다 설명을 읽어요.
   · ▶ 시연 보기: 손가락이 버튼으로 움직여 누르는 모습을 보여 주며 저절로 넘어가요.
   화면에 없는 버튼(로그인 전 손들기 등)은 건너뛰어요. 이 화면의 안내가 없으면 예전 팝업(howFor)을 써요.
   전역: window.HG_TOUR = { start(hash) → true(안내 시작) | false, stepsFor(hash), screenOf(hash) } */
(() => {
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' };
  /* 단계 하나: {sel:'css' | ['css',…], txt:'버튼 글자(포함)', t:'제목', s:'설명'}  sel이 여러 개면 화면에 보이는 첫 번째 */
  function findEl(st) {
    const sels = Array.isArray(st.sel) ? st.sel : [st.sel || '*'];
    for (const s of sels) { const c = qa(s).filter(vis); const hit = st.txt ? c.find(e => (e.innerText || '').includes(st.txt)) : c[0]; if (hit) return hit }
    return null;
  }
  const S = (sel, t, s, txt) => ({ sel, t, s, txt });
  const TOP = [
    S('#mePill', '포인트 · 내 기록', '지금 내 포인트예요. 누르면 내 기록, 배지, 진도표를 볼 수 있어요.'),
    S('#helpBtn', '✋ 손들기', '수업 중에 도움이 필요하면 눌러요. 선생님 화면에 알림이 가요.'),
    S('#howBtn', '어떻게 하나요?', '막히면 언제든 이 버튼을 눌러요. 지금 보는 화면의 사용법을 다시 볼 수 있어요.')
  ];
  const NAV = [
    S('header .brand', '처음 화면으로', '맨 위 <b>한 걸음 수학</b>을 누르면 언제든 처음 화면으로 가요.'),
    S('#crumbs a', '한 칸 위로', '이 글자를 누르면 한 칸 위 목록으로 가요. 휴대폰 뒤로 가기를 눌러도 앱이 꺼지지 않아요.')
  ];
  const PROB = [
    S('.answer .field', '답 칸', '여기에 답이 들어가요. 아래 키패드로 숫자를 넣어요.'),
    S('.keys', '화면 키패드', '숫자를 누르고 <b>확인</b>을 눌러요. 고르는 문제는 보기 버튼을 눌러요.'),
    S('.choices', '보기 고르기', '알맞은 답을 눌러요.'),
    S('button', '단계로 나누어 풀기', '어려우면 눌러요. 문제를 작은 단계로 나눠서 하나씩 풀어요.', '단계로 나누어 풀기'),
    S('.rep-btn', '⚑ 이 문제 이상해요', '문제나 그림이 이상하면 눌러서 이유를 골라 선생님께 알려요.')
  ];
  const WRONG = S('.ct-card, .prob', '틀렸을 때', '틀리면 <b>힌트</b>가 나와요. 힌트를 보고 다시 해 봐요. 세 번 틀리면 정답을 보고 넘어갈 수 있고, 그 문제는 <b>복습 노트</b>에 모여요.');

  const SCREENS = {
    home: () => [
      S('.hero-go', '단원 바로 시작', '단원 이름 버튼을 누르면 그 단원 첫 차시로 바로 가요.'),
      S('#goalCard', '나의 길 고르기', '🌱 첫걸음 · 🌿 한걸음 · 🌳 두걸음 중 나에게 맞는 길을 골라요. 고른 걸음에 맞춰 문제가 나와요. 나중에 내 기록에서 바꿀 수 있어요.'),
      S('#dailyRevBanner', '📅 [복습 추천]', '어제 익힌 유형을 숫자만 바꿔 다시 풀어요. 한 번에 맞히면 그 유형에 <b>숙달 ✓ 도장</b>이 찍혀요.'),
      S('#guide', '오늘의 길잡이', '오늘 할 일이 순서대로 있어요. <b>위에서부터 하나씩</b> 해요.'),
      S(['#guide li.cur .btn', '#guide .btn'], '시작 버튼', '지금 할 줄의 버튼이에요. 누르면 바로 그 화면으로 가요.'),
      S('#guide .g-pts', '길잡이 포인트', '한 줄 끝낼 때마다 <b>+3</b>, 다 하면 보너스 <b>+10</b>이에요.'),
      S('.ct-my-track', '내 걸음', '지금 공부하는 걸음이에요. 🌱 첫걸음은 뜻과 쉬운 문제, 🌿 한걸음은 기본 문제, 🌳 두걸음은 시험에 나오는 복합 문제까지예요.'),
      S('.ucard .ct-pl-row', '차시 줄', '차시를 누르면 들어가요. 오른쪽에 어디까지 했는지(개념 · 유형 · 마무리) 보여요.'),
      S('.uc-go', '이어서 하기', '이 단원에서 다음에 할 차시로 바로 가요.'),
      S('#bossCard', '오늘의 보스 도전', '차시 3개를 해결하면 열려요. 배운 차시 문제 폭탄을 풀어 보스를 물리치고 보물상자를 열어요.'),
      S('.bb-strip:not(.sea-strip)', '숫자야구', '친구와 포인트를 걸고 숨은 숫자를 맞혀요. 컴퓨터와 연습할 수도 있어요.'),
      S('.sea-strip', '⚓ 좌표 해전', '좌표평면에 숨은 배를 (x, y)로 찾아요. 좌표 연습이 돼요.'),
      S('.calc-strip', '기초 연산', '시험에 필요한 계산 연습이에요. <b>먼저 해요</b> 칸부터 하면 좋아요.'),
      S('#whoChip', '로그인', '로그인하면 기록이 학교 서버에 저장돼서 다른 기기에서도 이어서 하고, 선생님이 내 진도를 볼 수 있어요.'),
      ...TOP
    ],
    unit: () => [
      S('.ct-pl-row, .card.lesson', '차시 고르기', '차시를 누르면 들어가요. 어디까지 했는지 함께 보여요.'),
      ...NAV, ...TOP
    ],
    lessonHead: () => [
      S('.ct-tr-pills', '걸음 바꾸기', '칠해진 것이 지금 걸음이에요. 어려우면 🌱, 쉬우면 🌿·🌳을 눌러 바꿔요. 걸음마다 문제 수준이 달라요.'),
      S('.ct-stamps', '유형 도장판', '이 차시의 유형들이에요. 유형을 익히고 다음 날 [복습 추천]에서 한 번에 맞히면 <b>✓ 도장</b>이 찍혀요.'),
      S('.ct-tabs', '세 단계', '<b>① 개념 보기 → ② 유형 익히기 → ③ 차시 마무리</b> 순서로 해요. 마무리를 통과하면 이 차시를 마친 거예요(+15).')
    ],
    concept: () => [
      S('.ct-pass-bar', '건너뛰기', '정규 수업에서 이미 배웠다면 개념은 건너뛰고 바로 차시 마무리에 도전해도 돼요.'),
      S(['.owl-wrap', 'details.ct-wx', '.owl-panel'], '🦉 부엉 쌤 그림극', '그림을 <b>누를 때마다 한 줄씩</b> 넘어가요. 부엉 쌤이 말하는 곳이 주황색으로 깜빡여요. 끝까지 보면 +5.'),
      S('.owl-dot', '장면 점', '점을 누르면 그 장면으로 가요. 점 색은 그 장면이 어느 걸음(🌱🌿🌳) 내용인지 알려 줘요.'),
      S('#owlReplay', '처음부터', '그림극을 처음부터 다시 봐요.'),
      S('#owlSay', '🔊 듣기', '부엉 쌤 말을 소리로 들어요.'),
      S('.cp-strat', '풀이 전략 표', '문제 모습별로 무엇을 확인하고 어떤 순서로 푸는지 정리한 표예요.'),
      S(['.next-row .btn.primary', '#ctBody .btn.primary'], '다음 단계로', '다 보면 이 버튼을 눌러 다음 단계로 가요.')
    ],
    steps: () => [
      S('.ct-subtabs', 'A · B 순서', '🌱 첫걸음은 <b>A 빠른 구별 → B 선생님과 같이 따라 풀기</b> 순서로 해요.'),
      S('.ct-schema-prog', '몇 번째 문제', '지금 몇 번째 문제인지 보여 줘요.'),
      S(['.ct-rapid .ct-stage', '.ct-schema .ct-stage'], '빠른 구별', '그림에서 <b>주황색</b>이 무엇인지 보고 골라요. 맞히면 저절로 다음, 틀리면 이유를 보고 비슷한 문제를 한 번 더 해요.'),
      S('.ct-hit-row', '보기 버튼', '알맞은 이름을 눌러요. 너무 빨리 찍으면 "천천히 살펴봐요"가 나와요.'),
      S('.ct-guide', '선생님과 같이 따라 풀기', '선생님이 말하는 순서대로 한 단계씩 따라 풀어요. 다 하면 숫자만 바뀐 문제를 혼자 풀어 봐요.'),
      S('.tpc', '유형 카드', '먼저 유형 하나를 골라요. <b>유형 1부터</b> 하면 좋아요. 그 유형 문제만 계속 나와요.'),
      S('#t2Back', '🔀 다른 유형 고르기', '다른 유형으로 바꿀 때 눌러요. 휴대폰 뒤로 가기를 눌러도 유형 고르기로 돌아와요.'),
      S('#t2WxToggle', '👩‍🏫 선생님 대표 예제', '펼치면 선생님 풀이가 한 단계씩 나와요. 막히면 여기를 보고 따라 해요.'),
      S('#t2New', '🔄 새 숫자 문제', '같은 유형을 숫자만 바꿔 다시 풀어요.'),
      ...PROB
    ],
    practice: () => [
      S('.ct-chk-bar', '진행 막대', '몇 문제를 풀었는지 보여 줘요. 끝까지 통과하면 이 걸음의 차시를 마쳐요.'),
      S('.ct-keyty', '📌 핵심 유형', '이 차시의 핵심 유형과 풀이 순서예요. 복합 문제가 막히면 펼쳐 봐요.'),
      S('.ct-hit-row', '보기 버튼', '알맞은 답을 눌러요.'),
      WRONG, ...PROB
    ],
    explore: () => [S('#app .card', '더 알아보기', '하고 싶을 때만 하는 <b>선택</b> 활동이에요. 도형을 돌려 보고, 잘라 보고, 펼쳐 봐요.'), ...NAV, ...TOP],
    calc: () => [
      S('.start-card', '시작점 찾기', '처음이라면 여기부터 해요. 11문제로 나에게 맞는 칸을 찾아 줘요.'),
      S('.calc-sum', '모은 별', '지금까지 모은 별과 구구단 익힘이에요.'),
      S('.calc-sum a.btn', '오늘의 계산', '여러 칸을 섞어 짧게 풀어요. 매일 하면 좋아요.'),
      S('button', '🎯 시험 모드', '시험 범위에 필요한 계산만 보여 줘요. <b>전체 사다리</b>를 누르면 모든 칸이 보여요.', '시험 모드'),
      S('.ladder', '계산 사다리', '아래 칸이 위 칸의 바탕이에요. <b>지금 여기</b> 표시가 있는 칸부터 해요.'),
      S('.ladder a', '계산 칸', '누르면 <b>생각하는 법 → 연습</b> 순서로 해요. 별을 다 모으면 그 칸을 익힌 거예요. 아래 작은 글씨는 이 계산이 쓰이는 차시예요.'),
      S('.map-link', '🗺 연결맵', '어떤 계산이 어떤 계산의 바탕인지 한눈에 봐요.'),
      ...NAV, ...TOP
    ],
    calcTopic: () => [
      S('.kpanel', '핵심 낱말', '이 계산을 보면 떠올릴 낱말을 먼저 이어 봐요.'),
      S('.wayHead', '생각하는 법', '눌러서 펼치면 <b>보기 → 같이 → 혼자</b> 순서로 푸는 법을 익혀요.'),
      S('.calcGo', '연습 시작', '단계와 문제 수를 고르고 눌러요. 다 맞히면 별을 받아요.'),
      S('a.chip', '앞 칸 · 다음 칸', '바탕이 되는 앞 칸, 이어지는 다음 칸으로 가요.'),
      ...PROB, ...NAV, ...TOP
    ],
    drill: () => [
      S('.drill-way', '처음 보는 칸', '처음 보는 칸이면 생각하는 법을 짧게 먼저 익혀요. <b>건너뛰고 바로 풀기</b>도 돼요.'),
      S('.say', '🔊 듣기', '문제를 소리로 들어요.'),
      S('button', '문제 수', '5문제나 10문제를 골라요. 길잡이에서 들어오면 6문제예요.', '문제'),
      S('.chip', '집중할 칸', '오늘 집중해서 연습하는 계산 칸이에요.'),
      ...PROB, ...NAV, ...TOP
    ],
    review: () => [
      S('#app .card', '복습 노트', '틀렸거나 헤맨 문제가 <b>차시별로</b> 모여 있어요. 시험 전에 훑어보고, 숫자 그대로 다시 풀어 볼 수 있어요. 처음 맞히면 +5.'),
      ...PROB, ...NAV, ...TOP
    ],
    dailyrev: () => [
      S('#app .card', '📅 복습 추천', '어제 익힌 유형을 숫자만 바꿔 풀어요. <b>한 번에 맞히면</b> 숙달 ✓ 도장, 틀리면 내일 다시 나와요.'),
      ...PROB, ...NAV, ...TOP
    ],
    me: () => [
      S('.acct', '내 계정', '로그인 상태예요. 로그인하지 않으면 기록이 이 기기에만 남아요.'),
      S('#goalCard', '나의 길', '여기서 🌱 · 🌿 · 🌳 길을 고르거나 바꿔요.'),
      S('.me-av', '내 캐릭터', '끌어서 돌려 볼 수 있어요. <b>꾸미기 상점</b>에서 포인트로 꾸며요.'),
      S('#app .card.panel', '포인트 · 배지', '포인트, 연속 공부 일수, 배지, 숙달 ✓ 유형 수를 봐요.', '연속 공부'),
      S('.me-prog-row', '진도표', '차시마다 개념 · 유형 · 마무리 중 어디까지 했는지, 숙달한 유형 수와 🌱🌿🌳 걸음을 보여 줘요. 누르면 그 차시로 가요.'),
      S('#app .card.panel', '포인트 받는 방법', '무엇을 하면 포인트를 몇 점 받는지 정리한 표예요. 맞힌 것보다 <b>끝까지 해 본 것</b>에 더 많이 줘요.', '포인트 받는 방법'),
      ...NAV, ...TOP
    ],
    boss: () => [
      S('.raid-lobby', '이번 주 보스', '보스가 던지는 문제 폭탄을 성벽에 닿기 전에 풀어서 터뜨려요. 배운 차시 문제가 나와요.'),
      S('.raid-lobby .btn.primary', '시작 버튼', '차시 3개를 해결하면 열려요. 보스 세기(약화 · 일반 · 광폭)를 골라 시작해요.'),
      S('.raid-lobby a', '모은 보상', '보스를 물리치고 받은 뽑기권, 프레임, 칭호예요.', '뽑기권'),
      ...NAV, ...TOP
    ],
    login: () => [
      S('.logtab', '학생 · 선생님', '학생이면 <b>학생</b>을 골라요.'),
      S('.login-card', '학년 · 반 · 번호', '학년, 반, 번호를 고르고 선생님께 받은 <b>비밀번호 4자리</b>를 넣어요.'),
      S('.login-card a', '둘러보기', '로그인 없이도 쓸 수 있지만, 기록이 이 기기에만 남아요.', '둘러보기'),
      ...TOP
    ],
    scan: () => [
      S('#app .card', '점검 학습지 채점', 'OMR 답안지를 평평한 곳에 놓고 <b>📷 답안지 찍기</b>를 눌러요. 네 모서리의 검은 네모가 모두 보이게 위에서 찍어요. 처음 찍은 점수가 선생님께 가요.'),
      ...NAV, ...TOP
    ]
  };
  const NAMES = { home: '처음 화면', unit: '단원', concept: '개념 보기', steps: '유형 익히기', practice: '차시 마무리', explore: '더 알아보기', calc: '기초 연산', calcTopic: '기초 연산 칸', drill: '오늘의 계산', review: '복습 노트', dailyrev: '복습 추천', me: '내 기록', boss: '오늘의 보스 도전', login: '로그인', scan: '점검 학습지 채점' };

  function screenOf(h) {
    h = String(h || '').replace('#', '');
    if (!h || h === 'home') return 'home';
    if (/^unit-/.test(h)) return 'unit';
    if (/^calc-[a-z]+$/.test(h)) return 'calcTopic';
    if (SCREENS[h]) return h;
    const [id, tab] = h.split('-'), L = typeof LESSONS !== 'undefined' && LESSONS.find(l => l.id === id);
    if (L) return ['steps', 'practice', 'explore'].includes(tab) ? tab : 'concept';
    return null;
  }
  function stepsFor(h) {
    const k = screenOf(h); if (!k) return [];
    const lesson = ['concept', 'steps', 'practice'].includes(k);
    const list = lesson ? [...SCREENS.lessonHead(), ...SCREENS[k](), ...NAV, ...TOP] : SCREENS[k]();
    const seen = new Set(), out = [];
    for (const st of list) { const e = findEl(st); if (e && !seen.has(e)) { seen.add(e); out.push({ ...st, el: e }) } }
    return out;
  }

  /* ── 화면 그리기 ── */
  let T = null; // {steps,i,auto,timer,els}
  const LS = 'hg-tour-voice';
  const voiceOn = () => { try { return localStorage.getItem(LS) === '1' } catch (e) { return false } };
  const setVoice = v => { try { localStorage.setItem(LS, v ? '1' : '0') } catch (e) { } };
  const plain = s => String(s).replace(/<[^>]+>/g, '');
  function say(st) { if (!voiceOn() || typeof speak !== 'function') return; try { speechSynthesis.cancel() } catch (e) { } speak(plain(st.t + '. ' + st.s)) }
  function quiet() { try { if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel() } catch (e) { } }

  function close() {
    if (!T) return; clearTimeout(T.timer); quiet();
    Object.values(T.els).forEach(e => e && e.remove());
    removeEventListener('resize', place); removeEventListener('scroll', place, true); removeEventListener('keydown', onKey, true);
    T = null;
  }
  function onKey(e) {
    if (!T) return;
    if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); go(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }
  function intro(h, steps) {
    const k = screenOf(h), nm = NAMES[k] || '이 화면';
    const ov = document.createElement('div'); ov.className = 'ht-intro'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', '사용법');
    ov.innerHTML = `<div class="ht-card"><div class="ht-h"><b>❓ ${nm} · 이렇게 해요</b><button type="button" class="ht-x" aria-label="닫기">✕</button></div>
      <p class="ht-lead">이 화면에 있는 버튼 <b>${steps.length}개</b>를 하나씩 비추며 알려 줄게요.</p>
      <div class="ht-pick">
        <button type="button" class="ht-opt ht-man"><span class="ht-oi">👆</span><span><b>버튼 하나씩 알아보기</b><small>내가 [다음]을 누르며 천천히 봐요</small></span></button>
        <button type="button" class="ht-opt ht-auto"><span class="ht-oi">▶</span><span><b>시연 보기</b><small>손가락이 버튼을 누르며 저절로 넘어가요</small></span></button>
      </div>
      <ol class="ht-list">${steps.map(s => `<li>${s.t}</li>`).join('')}</ol>
      <div class="ht-foot"><label class="ht-voice"><input type="checkbox" ${voiceOn() ? 'checked' : ''}> 🔊 소리로도 듣기</label><a href="#howto" class="ht-more">📖 전체 사용법</a></div></div>`;
    document.body.appendChild(ov);
    const done = () => ov.remove();
    q('.ht-x', ov).onclick = done; ov.onclick = e => { if (e.target === ov) done() };
    q('.ht-more', ov).onclick = done;
    q('.ht-voice input', ov).onchange = e => setVoice(e.target.checked);
    q('.ht-man', ov).onclick = () => { done(); run(steps, false) };
    q('.ht-auto', ov).onclick = () => { done(); run(steps, true) };
    q('.ht-list', ov).onclick = e => { const li = e.target.closest('li'); if (!li) return; done(); run(steps, false, [...li.parentNode.children].indexOf(li)) };
    q('.ht-man', ov).focus();
    const esc = e => { if (e.key === 'Escape' && ov.isConnected) { done(); removeEventListener('keydown', esc) } }; addEventListener('keydown', esc);
  }
  function run(steps, auto, at = 0) {
    close();
    const mk = (c, html = '') => { const d = document.createElement('div'); d.className = c; d.innerHTML = html; document.body.appendChild(d); return d };
    const els = { block: mk('ht-block'), spot: mk('ht-spot'), hand: mk('ht-hand', '<span>👆</span><i></i>'), tip: mk('ht-tip') };
    els.tip.setAttribute('role', 'dialog'); els.tip.setAttribute('aria-live', 'polite');
    els.block.onclick = () => { if (!T.auto) go(1) };
    els.hand.hidden = !auto;
    T = { steps, i: at, auto, timer: 0, els };
    addEventListener('resize', place); addEventListener('scroll', place, true); addEventListener('keydown', onKey, true);
    show();
  }
  function go(d) { if (!T) return; const n = T.i + d; if (n < 0) return; if (n >= T.steps.length) { close(); return } T.i = n; show() }
  function show() {
    if (!T) return; clearTimeout(T.timer);
    const st = T.steps[T.i], { tip, hand } = T.els, last = T.i === T.steps.length - 1;
    if (!st.el.isConnected) { const e = findEl(st); if (e) st.el = e }
    const r0 = st.el.getBoundingClientRect(), fixed = isFixed(st.el);
    if (!fixed && (r0.top < 70 || r0.bottom > innerHeight - 200)) st.el.scrollIntoView({ block: r0.height > innerHeight * .5 ? 'start' : 'center' });
    tip.innerHTML = `<div class="ht-tn">${T.i + 1} / ${T.steps.length}${T.auto ? ' · ▶ 시연' : ''}</div><b class="ht-tt">${st.t}</b><p class="ht-ts">${st.s}</p>
      <div class="ht-tb"><button type="button" class="ht-prev btn ghost mini" ${T.i ? '' : 'disabled'}>◀ 이전</button>
      ${T.auto ? '<button type="button" class="ht-pause btn ghost mini">⏸ 멈추기</button>' : ''}
      <button type="button" class="ht-next btn primary mini">${last ? '다 봤어요 ✓' : '다음 ▶'}</button>
      <button type="button" class="ht-stop" aria-label="그만 보기">✕</button></div>`;
    q('.ht-prev', tip).onclick = () => go(-1);
    q('.ht-next', tip).onclick = () => go(1);
    q('.ht-stop', tip).onclick = close;
    const pz = q('.ht-pause', tip);
    if (pz) pz.onclick = () => { T.auto = !T.auto; hand.hidden = !T.auto; if (T.auto) { go(1) } else { clearTimeout(T.timer); pz.textContent = '▶ 계속'; pz.onclick = () => { T.auto = true; hand.hidden = false; go(1) } } };
    place();
    say(st);
    if (T.auto) {
      hand.classList.remove('tap'); void hand.offsetWidth;
      setTimeout(() => { if (T && T.auto) hand.classList.add('tap') }, 900);
      T.timer = setTimeout(() => go(1), Math.max(3800, 1400 + plain(st.s).length * 75));
    } else q('.ht-next', tip).focus({ preventScroll: true });
  }
  function isFixed(e) { for (let n = e; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true } return false }
  function place() {
    if (!T) return;
    const st = T.steps[T.i], { spot, tip, hand } = T.els, r = st.el.getBoundingClientRect(), pad = 6, vw = innerWidth, vh = innerHeight;
    const top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad), w = Math.min(vw - 8, r.width + pad * 2), h = Math.min(vh - 8, r.bottom + pad - top);
    Object.assign(spot.style, { top: top + 'px', left: left + 'px', width: Math.min(w, vw - left - 4) + 'px', height: Math.max(h, 20) + 'px' });
    const tw = Math.min(360, vw - 24), th = tip.offsetHeight || 160;
    let ty = top + h + 12; if (ty + th > vh - 8) ty = top - th - 12; if (ty < 8) ty = Math.max(8, vh - th - 12);
    const tx = Math.min(Math.max(12, r.left + r.width / 2 - tw / 2), vw - tw - 12);
    Object.assign(tip.style, { width: tw + 'px', top: ty + 'px', left: tx + 'px' });
    const hx = Math.min(Math.max(8, r.left + Math.min(r.width / 2, 120)), vw - 40), hy = Math.min(Math.max(8, r.top + Math.min(r.height / 2, 60)), vh - 40);
    Object.assign(hand.style, { left: hx + 'px', top: hy + 'px' });
  }

  function start(h) {
    h = String(h == null ? (location.hash || '') : h).replace('#', '');
    const steps = stepsFor(h);
    if (steps.length < 2) return false;
    intro(h, steps);
    return true;
  }
  addEventListener('hashchange', () => { close(); const o = q('.ht-intro'); if (o) o.remove() });
  window.HG_TOUR = { start, stepsFor, screenOf, close, _screens: SCREENS };
})();
