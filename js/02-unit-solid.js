/* ───────── 차시 정보 ───────── */
const LESSONS=[
  {id:'poly',no:1,title:'다면체 · 각뿔대',sub:'다각형으로만 둘러싸인 입체도형, 각기둥 · 각뿔 · 각뿔대',tb:'01 다면체 · 211~212쪽',ready:true,unit:'solid'},
  {id:'types',no:1,title:'각기둥 · 각뿔 · 각뿔대',sub:'1차시 「다면체 · 각뿔대」로 합쳤어요',tb:'01 다면체 · 211~212쪽',ready:false,hidden:true,unit:'solid'},
  {id:'regular',no:2,title:'정다면체',sub:'모든 면이 합동인 정다각형',tb:'01 다면체 · 213~214쪽',ready:true,unit:'solid'},
  {id:'rotation',no:3,title:'회전체',sub:'평면도형을 한 바퀴 돌리면',tb:'02 회전체 · 217~218쪽',ready:false,unit:'solid'},
  {id:'rotprop',no:4,title:'회전체의 성질',sub:'회전체를 자른 단면',tb:'02 회전체 · 219쪽',ready:false,unit:'solid'},
  {id:'area',no:5,title:'기둥의 겉넓이',sub:'전개도를 펼쳐서 넓이 구하기',tb:'03 기둥의 겉넓이와 부피 · 221~222쪽',ready:true,unit:'solid'},
  {id:'volume',no:6,title:'기둥의 부피',sub:'밑넓이 × 높이',tb:'03 기둥의 겉넓이와 부피 · 223~225쪽',ready:false,unit:'solid'},
  {id:'conearea',no:7,title:'뿔의 겉넓이',sub:'뿔의 전개도로 넓이 구하기',tb:'04 뿔의 겉넓이와 부피 · 227~228쪽',ready:false,unit:'solid'},
  {id:'cone',no:8,title:'뿔의 부피',sub:'기둥의 1/3',tb:'04 뿔의 겉넓이와 부피 · 229~231쪽',ready:false,unit:'solid'},
  {id:'spherearea',no:9,title:'구의 겉넓이',sub:'반지름이 같은 원의 넓이 4개',tb:'05 구의 겉넓이와 부피 · 233쪽',ready:false,unit:'solid'},
  {id:'sphere',no:10,title:'구의 부피',sub:'원기둥과 비교하기',tb:'05 구의 겉넓이와 부피 · 234~235쪽',ready:false,unit:'solid'},
];
// 차시 흐름: 정규 수업 전에 '미리 보기' → 정규 수업 뒤에 '같이 풀기 · 혼자 풀기'로 다지기 → '더 알아보기'(탐구)는 수업 뒤에
// id는 예전 그대로(concept · steps · practice · explore)라서 학생 기록은 그대로 이어져요.
const TABS=[{id:'concept',t:'미리 보기',s:'정규 수업 전에'},{id:'steps',t:'같이 풀기',s:'한 단계씩'},{id:'practice',t:'혼자 풀기',s:'섞어서 반복'},{id:'explore',t:'더 알아보기',s:'선택 · 하고 싶을 때'}];
const DATA_TABS=['concept','explore','steps','practice'];   // 저장된 진도 배열의 순서 (교사 화면 · 엑셀)
const TAB_NM=Object.fromEntries(TABS.map(t=>[t.id,t.t]));
const UNITS=[['소인수분해',false],['정수와 유리수',false],['문자의 사용과 식',false],['일차방정식',false],['좌표평면과 그래프',false],['기본 도형',false],['평면도형의 성질',false],['입체도형의 성질',false],['자료의 정리와 해석',false]].map(([u])=>[u,u===UI_.name]);

/* ───────── 화면: 홈 ───────── */
const app=$('#app'),crumbs=$('#crumbs');
/* 더 알아보기(explore)는 선택이라 진행에 넣지 않아요: 미리 보기 · 같이 풀기 · 혼자 풀기 3가지 */
const LESSON_REQ=3;function lessonDone(id){const p=DB[id];return p?[p.concept,p.steps>0,p.prac&&p.prac.solved>=5].filter(Boolean).length:0}
function viewHome(){
  crumbs.innerHTML='';
  const done=LESSONS.filter(l=>l.ready).reduce((a,l)=>a+lessonDone(l.id),0);
  const D=DB._drill||{},drillToday=D.last===today(),due=dueReviews().length,wait=(DB._rev||[]).length-due,dueN=dueList().length;
  const last=DB._last&&LESSONS.find(l=>l.id===DB._last.id&&l.ready);const lastTab=last?TABS.find(t=>t.id===DB._last.tab)||TABS[0]:null;
  const M=me(),nb=Object.keys(M.badges).length,back=M.pts>0||LESSONS.some(l=>lessonDone(l.id));
  app.innerHTML=`
  <section class="hero ${back?'compact':''}">
    <div>
      <h1>다음 수업은 <span class="mark">한 걸음 먼저</span>,<br>배운 것은 한 걸음씩 다시.</h1>
      <p>정규 수업 전에 <b>미리 보기</b>로 낱말과 그림을 익히고, 수업이 끝나면 <b>같이 풀기 → 혼자 풀기</b>로 다져요. 어려운 문제는 단계로 나누어 풀어요.</p>
      <p style="margin-top:18px"><a class="btn primary" href="${UNIT_HASH}">${UI_.start}</a></p>
    </div>
    <div>${UNIT_ID==="solid"?'<div class="hero-fig"><canvas id="heroCv" aria-label="돌아가는 육각기둥"></canvas></div><div class="hero-note">끌어서 돌려 보세요</div>':`<div class="hero-fig svgfig">${typeof heroArt==="function"?heroArt():""}</div>`}</div>
  </section>
  <div class="card guide" id="guide">${guideHTML()}</div>
  <div class="sec-title"><h2>포인트와 게임</h2><span>포인트 <b class="rm">${M.pts}</b> · ${liveStreak()}일 연속 · 배지 ${nb}/${BADGES.length} · <a href="#me">내 기록 보기</a></span></div>
  <div class="game-row${STANDALONE?' solo':''}"><div class="card mis-card" id="misCard">${missionCardHTML()}</div>${STANDALONE?'':`<div class="card boss-card" id="bossCard">${bossCardHTML()}</div>`}</div>
  ${STANDALONE?'':`<a class="card bb-strip" href="#baseball">${BB_ICON}<span><b>숫자야구</b> · 친구와 포인트를 걸고 대결해요</span><span class="go">하러 가기 →</span></a>`}
  <div class="sec-title"><h2>기초 연산</h2><span>${dueN?`오늘 복습 <b class="rm">${dueN}</b> · `:''}별 <b class="rm">${calcStars()}</b>/${CALC.filter(calcVisible).length*3} · 구구단 ${factsKnown()}/36 · <a href="#calc">전체 보기</a></span></div>
  <div class="calc-strip">${homeCalcChips()}</div>
  <div class="sec-title"><h2>1학년 단원</h2><span>지금은 ${UI_.name} 단원을 열어 두었어요 · 진행 ${done}/${LESSONS.filter(l=>l.ready).length*LESSON_REQ}</span></div>
  <div class="units">${UNITS.map(([u,r],i)=>r?`<a class="card unit ready" href="${UNIT_HASH}"><span class="no">${String(i+1).padStart(2,'0')}</span><b>${u}</b><span class="st">열려 있음 · ${LESSONS.filter(l=>l.ready).length}개 차시 →</span></a>`:'').join('')}</div>
  <p class="units-soon">준비 중인 단원: ${UNITS.filter(x=>!x[1]).map(x=>x[0]).join(' · ')}</p>`;
  if(UNIT_ID==='solid'){const v=new Viewer($('#heroCv'),{auto:true,yaw:-0.4,pitch:0.4,pad:0.38});v.setMesh(SOLIDS.p6.mk())}
  if(isStudent())loadClass();
}
function viewMe(){
  crumbs.innerHTML=`<span class="sep">›</span><span>내 기록</span>`;const M=me();setTimeout(()=>{const b=$('.meOut');if(b)b.onclick=async()=>{await studentLogout();toast('로그아웃했어요.');viewMe()}},0);
  app.innerHTML=`<div class="unit-head"><div><h1>내 기록</h1><p>포인트는 정답보다 <b>끝까지 해 본 것</b>에 더 많이 줘요.</p></div></div>
  <div class="card panel acct">${isStudent()?`<div><b>${whoLabel(AUTH)}</b>으로 로그인했어요. 기록은 서버에 저장돼요.<br><span class="muted syncNow">${syncText()}</span></div><button type="button" class="btn meOut">로그아웃</button>`:`<div><b>로그인하지 않았어요.</b> 지금 기록은 이 기기에만 저장돼요.<br><span class="muted">로그인하면 다른 기기에서도 이어서 하고, 선생님이 진도를 볼 수 있어요.</span></div><a class="btn primary" href="#login">로그인</a>`}</div>
  <div class="card panel me-av"><div class="av-stage" id="avMe"></div><div><h2 style="margin:0 0 4px">내 캐릭터</h2><p class="muted" style="margin:0 0 12px">쓸 수 있는 포인트 <b class="rm meBal">${balance()}</b> · 모은 포인트 <b class="rm">${M.pts}</b></p><a class="btn primary" href="#shop">꾸미기 상점 →</a></div></div>
  <div class="card panel"><div class="bigstats"><div class="stat"><small>포인트</small><b>${M.pts}</b></div><div class="stat"><small>연속 공부</small><b>${liveStreak()}일</b></div><div class="stat"><small>배지</small><b>${Object.keys(M.badges).length}/${BADGES.length}</b></div><div class="stat"><small>졸업한 복습 문제</small><b>${M.cnt.mastered||0}</b></div></div>
   <h2>배지</h2><div class="badges">${BADGES.map((b,i)=>{const on=!!M.badges[b.k];return`<div class="badge ${on?'':'off'}">${badgeIcon(i,on)}<span><b>${b.nm}</b><small>${on?M.badges[b.k]+' 받음':b.d}</small></span></div>`}).join('')}</div></div>
  <div class="card panel"><h2>차시별 진행</h2><div class="lessons">${LESSONS.filter(l=>l.ready).map(l=>`<a class="card lesson ready" href="#${l.id}"><span class="n">${l.no}</span><span><b>${l.title}</b><small>${(DB[l.id]&&DB[l.id].prac?`연습 ${DB[l.id].prac.solved}문제 · `:'')}단계 문제 ${(DB[l.id]&&DB[l.id].steps)||0}번</small></span><span class="pips">${pipsOf(l.id)}</span></a>`).join('')}</div></div>
  <div class="card panel"><h2>포인트 받는 방법</h2><table class="t"><tbody>
   <tr><td class="l">단계 문제 끝까지 풀기</td><td class="rm">+10</td></tr><tr><td class="l">연습 문제 맞히기 (단계 없이 맞히면 +5)</td><td class="rm">+3</td></tr><tr><td class="l">연습 문제 끝까지 풀기 (틀려도)</td><td class="rm">+1</td></tr>
   <tr><td class="l">복습 문제 한 번에 맞히기</td><td class="rm">+5</td></tr><tr><td class="l">탐구 활동 끝내기 (도형마다 한 번)</td><td class="rm">+2 ~ +5</td></tr><tr><td class="l">개념 처음 읽기</td><td class="rm">+5</td></tr><tr><td class="l">오늘의 계산 끝내기 (하루 한 번) + 첫 시도 정답마다 1</td><td class="rm">+5</td></tr>
   <tr><td class="l">오늘의 미션 하나 (셋 다 하면 보너스 +10)</td><td class="rm">+3</td></tr><tr><td class="l">우리 반이 보스를 물리쳤을 때 (이번 주에 데미지를 줬다면)</td><td class="rm">+10 ~</td></tr></tbody></table>
   <p class="muted" style="margin-bottom:0">로그인하면 받은 포인트만큼 우리 반 보스에게 데미지가 들어가요.</p></div>`;
  mountSpin($('#avMe',app),y=>avatarSVG(myEq(),150,y));refreshLedger().then(L=>{const b=$('.meBal');if(L&&b)b.textContent=balance()});
}
function viewReview(){
  crumbs.innerHTML=`<span class="sep">›</span><span>복습 노트</span>`;
  app.innerHTML=`<div class="unit-head"><div><h1>복습 노트</h1><p>틀렸거나 헤맸던 문제를 1일, 3일, 7일 뒤에 다시 풀어요. 세 번 연속 한 번에 맞히면 졸업이에요. 시험처럼 교과서 형식으로 나와요.</p></div></div>
   <div class="card panel"><div class="statbar"><div class="stat"><small>오늘 남은 문제</small><b class="rvLeft">0</b></div><div class="stat"><small>졸업한 문제</small><b class="rvDone">${me().cnt.mastered||0}</b></div><div class="stat"><small>나중에 나올 문제</small><b class="rvWait">0</b></div></div><div class="rvHost"></div></div>`;
  const host=$('.rvHost',app);
  const stats=()=>{const L=dueReviews();$('.rvLeft',app).textContent=L.length;$('.rvWait',app).textContent=(DB._rev||[]).length-L.length;$('.rvDone',app).textContent=me().cnt.mastered||0;return L};
  function next(){const L=stats();
    if(!L.length){host.innerHTML=`<div class="feedback ok">오늘 복습할 문제를 모두 풀었어요! ${(DB._rev||[]).length?`나머지 ${(DB._rev||[]).length}문제는 정해진 날에 다시 나와요.`:''}</div><div class="next-row" style="justify-content:flex-start"><a class="btn" href="#home">처음 화면으로</a></div>`;return}
    const item=L[0],prob=GEN[item.g](item.seed),L0=LESSONS.find(l=>l.id===item.lid);
    prob.title=`<span class="rv-from">${L0?L0.no+'차시 '+L0.title+' · ':''}${item.stage+1}번째 복습</span><br>`+prob.title;
    renderProblem(host,prob,{mode:'final',rep:{lesson:item.lid||LESSON_OF[item.g]||'review',gen:item.g,seed:item.seed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{const ok=good&&wrongs===0;reviewResult(item,ok);dayBump('review');logAttempt({lesson:item.lid||LESSON_OF[item.g]||'review',kind:'review',good,wrongs,mode,gen:item.g,seed:item.seed,ptype:prob.ptype,stepWrongs,revealed});
      if(ok){bump('review');award(5)}else award(1);
      box.insertAdjacentHTML('afterbegin',`<span style="flex-basis:100%">${ok?(item.stage>=3?'졸업! 이 문제는 이제 나오지 않아요.':`한 번에 맞혔어요. ${[1,3,7][item.stage]}일 뒤에 한 번 더 나와요.`):'헷갈렸던 문제예요. 내일 다시 나와요.'}</span>`);
      const nb=el('<button type="button" class="btn primary">다음 →</button>');nb.onclick=next;box.appendChild(nb);stats()}})}
  next();
}
/* 화면: 단원 */
function pipsOf(id){const p=DB[id];const v=p?{concept:p.concept,explore:p.explore,steps:p.steps>0,practice:p.prac&&p.prac.solved>=5}:{};return TABS.map(t=>`<span class="pip ${v[t.id]?'on':''}" title="${t.t}"></span>`).join('')}
function homeCalcChips(){const due=dueList(),dg=OBJ(DB._calcDiag),exam=EXAM_FOCUS.map(id=>CALC.find(t=>t.id===id)).filter(t=>t&&calcVisible(t)&&NUM(calcPeek(t.id).stars)<3),plan=calcPlan().map(id=>CALC.find(t=>t.id===id)),rest=CALC.filter(calcVisible).sort((a,b)=>examRank(a.id)-examRank(b.id)||NUM(calcPeek(a.id).stars)-NUM(calcPeek(b.id).stars));
  const list=[...due,...exam,...plan,...rest].filter((t,i,a)=>t&&a.indexOf(t)===i).slice(0,dg.d?4:3);
  return(dg.d?'':`<a class="calc-chip start" href="#calc-start"><b>시작점 찾기</b><small>처음이면 여기부터</small></a>`)+list.map(t=>`<a class="calc-chip" href="#calc-${t.id}"><b>${t.nm}</b>${calcDue(t.id)?'<small class="due">복습할 때</small>':starRow(Math.min(3,NUM(calcPeek(t.id).stars)))}</a>`).join('')}
function viewUnit(){
  crumbs.innerHTML=`<span class="sep">›</span><span>${UI_.name}</span>`;
  app.innerHTML=`<div class="unit-head"><div><h1>${UI_.name}</h1><p>${UI_.sub}</p></div>
    <div class="legend"><span><i class="on"></i>미리 보기(수업 전) → 같이 풀기 → 혼자 풀기 5문제 · 더 알아보기는 선택</span></div></div>
  <div class="lessons">${LESSONS.filter(l=>!l.hidden).map(l=>l.ready?`<a class="card lesson ready" href="#${l.id}"><span class="n">${l.no}</span><span><b>${l.title}</b><small>${l.sub}</small><small class="tbref">교과서 ${l.tb}</small></span><span class="pips" aria-label="진행 상황">${pipsOf(l.id)}</span></a>`
    :`<div class="card lesson soon"><span class="n">${l.no}</span><span><b>${l.title}</b><small>${l.sub}</small><small class="tbref">교과서 ${l.tb}</small></span><span class="soon-tag">준비 중</span></div>`).join('')}</div>`;
}
/* 미리 보기 상자: 정규 수업 전에 「오늘의 핵심」만 크게 (교과서: 지학사 중학교 수학 1) */
const n_='<span class="math">n</span>';
const PREVIEW={
  poly:{tb:'211~212쪽',core:[
      {h:'다면체와 ○면체',b:`<b>다면체</b>는 <u>다각형인 면으로만</u> 둘러싸인 입체도형이에요. 면이 <b>○개</b>이면 <b>○면체</b>.<small>굽은 면이 있으면 다면체가 아니에요. (원기둥 ✗, 원뿔 ✗, 구 ✗)</small>`},
      {h:'각뿔대',b:`각뿔을 <u>밑면에 평행한 평면</u>으로 잘라 생긴 것 중 각뿔이 아닌 쪽이 <b>각뿔대</b>예요.<small>옆면은 모두 사다리꼴 · 두 밑면은 평행하지만 크기가 달라요(합동 ✗).</small>`},
      {h:'개수 세기',b:`밑면이 ${n_}각형이면
       <table class="pv-t"><tr><th></th><th>꼭짓점</th><th>모서리</th><th>면</th></tr>
       <tr><th>${n_}각기둥</th><td>2${n_}</td><td>3${n_}</td><td>${n_} + 2</td></tr>
       <tr><th>${n_}각뿔</th><td>${n_} + 1</td><td>2${n_}</td><td>${n_} + 1</td></tr>
       <tr><th>${n_}각뿔대</th><td>2${n_}</td><td>3${n_}</td><td>${n_} + 2</td></tr></table><small>외우지 않아도 1층 · 2층 · 층 사이로 세면 나와요.</small>`}],
    words:['다면체','면','모서리','꼭짓점','○면체','각뿔대','밑면','옆면','사다리꼴'],
    ex:'<b>오각뿔</b> (211쪽 1번) → 면 1 + 5 = <b>6개 → 육면체</b> · 모서리 5 + 5 = <b>10개</b> · 꼭짓점 5 + 1 = <b>6개</b><br><b>삼각뿔대</b> (212쪽 2번) → 꼭짓점 <b>3 × 2 = 6</b> · 모서리 <b>3 × 3 = 9</b> · 면 <b>3 + 2 = 5</b>'},
  regular:{tb:'213~214쪽',core:[
      {h:'다섯 가지',b:`정다면체는 <b>다섯 가지</b>뿐이에요. <small>정사면체 · 정육면체 · 정팔면체 · 정십이면체 · 정이십면체</small>`},
      {h:'구별하는 방법',b:`<b>면의 모양</b>과 <b>한 꼭짓점에 모인 면의 개수</b>로 구별해요.
       <table class="pv-t"><tr><th>면의 모양</th><th>모인 면 3개</th><th>4개</th><th>5개</th></tr>
       <tr><th>정삼각형</th><td>정사면체</td><td>정팔면체</td><td>정이십면체</td></tr>
       <tr><th>정사각형</th><td>정육면체</td><td>—</td><td>—</td></tr>
       <tr><th>정오각형</th><td>정십이면체</td><td>—</td><td>—</td></tr></table>`}],
    words:['정다각형','합동','한 꼭짓점에 모인 면','정다면체'],
    ex:'<b>정육면체</b> → 면은 모두 <b>정사각형</b>, 어느 꼭짓점에서나 모인 면은 <b>3개</b>'}};
const PV_FIG={
  ok:(m,hl,cap,o={})=>({m,hl,cap,o}),
};
const PV_CARDS={poly:[
  {h:'다면체일까?',t:'면이 모두 <b>다각형</b>이면 다면체 ○<br><b>굽은 면</b>이 있으면 ✕',figs:()=>[[TYPE.prism.mk(3),null,'삼각기둥 ○'],[TYPE.frustum.mk(4),null,'사각뿔대 ○'],[SOLIDS.cyl.mk(),null,'원기둥 ✕'],[SOLIDS.cone.mk(),null,'원뿔 ✕']]},
  {h:'면 · 모서리 · 꼭짓점',t:'<b>면</b>: 둘러싼 다각형 · <b>모서리</b>: 다각형의 변 · <b>꼭짓점</b>: 다각형의 꼭짓점',figs:()=>{const c=()=>SOLIDS.cube.mk();return[[c(),'one','면'],[c(),'E','모서리'],[c(),'allV','꼭짓점']]}},
  {h:'각기둥 · 각뿔대 · 각뿔',t:'<span class="sw b"></span>밑면 <span class="sw o"></span>옆면 — <b>밑면 개수 · 크기</b>와 <b>옆면 모양</b>으로 구별',figs:()=>[[TYPE.prism.mk(5),'all','각기둥<br><small>밑면 2개 같음 · 직사각형</small>'],[TYPE.frustum.mk(5),'all','각뿔대<br><small>밑면 2개 크기 다름 · 사다리꼴</small>'],[TYPE.pyramid.mk(5),'all','각뿔<br><small>밑면 1개 · 삼각형</small>']]},
  {h:'이름은 두 가지',t:'면의 개수로 <b>칠면체</b> · 모양으로 <b>오각뿔대</b><br><small>이름의 앞부분이 밑면의 모양</small>',figs:()=>[[TYPE.frustum.mk(5),'all','면 7개 → 칠면체<br>밑면 오각형 → 오각뿔대']]},
  {h:'층으로 보기',t:'같은 높이의 꼭짓점끼리 한 층 — <b>1층 · 2층 · 층 사이</b>',figs:()=>[[TYPE.prism.mk(5),'Fv','오각기둥<br><small>1층 5 · 2층 5</small>'],[TYPE.pyramid.mk(5),'Fv','오각뿔<br><small>1층 5 · 2층 1(꼭대기)</small>']]}]};
const pgSVG=(pts,ok)=>`<svg viewBox="0 0 100 100" width="96" height="96" role="img"><polygon points="${pts}" fill="${ok?'#c9d6f2':'#efe3c4'}" stroke="#1d2640" stroke-width="3" stroke-linejoin="round"/></svg>`;
PV_CARDS.regular=[
  {h:'정다각형',t:'<b>변의 길이</b>와 <b>각의 크기</b>가 모두 같은 다각형<br><small>직사각형은 변이, 마름모는 각이 달라서 정다각형이 아니에요.</small>',figs:()=>[[pgSVG('50,12 92,84 8,84',1),null,'정삼각형 ○'],[pgSVG('15,15 85,15 85,85 15,85',1),null,'정사각형 ○'],[pgSVG('5,28 95,28 95,72 5,72',0),null,'직사각형 ✕'],[pgSVG('50,8 80,50 50,92 20,50',0),null,'마름모 ✕']]},
  {h:'정다면체의 두 조건',t:'① 모든 면이 <b>합동인 정다각형</b> ② <b>꼭짓점마다</b> 모인 면의 개수가 같다<br><small>둘 중 하나라도 아니면 정다면체가 아니에요.</small>',figs:()=>[[SOLIDS.cube.mk(),'A','정육면체 ○<br><small>정사각형 · 모두 3개</small>'],[cuboid(),'A','직육면체 ✕<br><small>면이 직사각형</small>'],[bipyramid(),'V:3','삼각쌍뿔 ✕<br><small>3개인 곳, 4개인 곳</small>']]},
  {h:'정다면체는 다섯 가지',t:'면의 모양은 <b>정삼각형 · 정사각형 · 정오각형</b> 세 가지뿐<br><small>정삼각형으로 된 것이 세 가지예요.</small>',figs:()=>REG.map(R=>[SOLIDS[R.k].mk(),null,`${R.nm}<br><small>${R.face.slice(1)} · ${R.deg}개</small>`])},
  {h:'이름은 면의 개수로',t:'면이 <b>8개</b>면 정<b>팔</b>면체, <b>12개</b>면 정<b>십이</b>면체<br><small>이름만 보면 면의 개수를 알 수 있어요.</small>',figs:()=>[[SOLIDS.oct.mk(),'A','정팔면체<br><small>면 8개</small>'],[SOLIDS.dod.mk(),'A','정십이면체<br><small>면 12개</small>']]},
  {h:'층으로 세기',t:'같은 높이의 꼭짓점끼리 한 층 — <b>층마다 세어 더해요</b>',figs:()=>[[SOLIDS.oct.mk(),'Fv','정팔면체<br><small>1 + 4 + 1 = 6</small>'],[SOLIDS.ico.mk(),'Fv','정이십면체<br><small>1 + 5 + 5 + 1 = 12</small>']]}];
function pvCardHTML(c,i){return`<div class="pvh2"><span class="pvn">${i+1}</span><b>${c.h}</b></div><div class="pvfigs">${c.figs().map((f,k)=>`<figure>${typeof f[0]==='string'?`<div class="pvsvg">${f[0]}</div>`:`<canvas data-k="${k}"></canvas>`}<figcaption>${f[2]}</figcaption></figure>`).join('')}</div><div class="pvt">${c.t}</div>`}
function pvMount(host,c){const F=c.figs();$$('canvas',host).forEach(cv=>{const f=F[+cv.dataset.k],v=figure(cv,Object.assign(solidFig(f[0]),{visual:true}));
  if(f[1]==='one'){const b=f[0].base||[0],t=b.length>1?b[1]:b[0];v.fcol=i=>i===t?HL_SIDE:null;v.dirty=true}else if(f[1]==='allV'){v.mode='v';v.vcol=()=>'#e08a1e';v.dirty=true}else if(f[1])applyHl(v,f[0],f[1])})}
function pvWire(body,id){const C=PV_CARDS[id];if(!C)return;$$('.pvcard',body).forEach(b=>{const c=C[+b.dataset.i];pvMount(b,c);
  b.onclick=()=>{const bg=el('<div class="zoom-bg"></div>'),cd=el(`<div class="zoom-card pvz" role="dialog" aria-modal="true"><button type="button" class="zoom-x" aria-label="닫기">✕</button>${pvCardHTML(c,+b.dataset.i)}<p class="muted" style="margin:8px 0 0;font-size:15px">그림을 끌어서 돌려 볼 수 있어요.</p></div>`);
    const close=()=>{bg.remove();cd.remove();document.removeEventListener('keydown',esc)},esc=e=>{if(e.key==='Escape')close()};bg.onclick=close;$('.zoom-x',cd).onclick=close;document.addEventListener('keydown',esc);document.body.append(bg,cd);pvMount(cd,c)}})}
function previewBox(id){const P=PREVIEW[id];if(!P)return'';
  if(PV_CARDS[id]){const TL=PTYPES[id]||[];return`<div class="card panel pv"><div class="pv-h"><b>미리 보기</b><span>정규 수업 전에 · 그림으로 먼저 만나요 · 카드를 누르면 크게 보여요</span></div>
    <div class="pv-cards2">${PV_CARDS[id].map((c,i)=>`<button type="button" class="pvcard" data-i="${i}">${pvCardHTML(c,i)}</button>`).join('')}</div>
    ${TL.length?`<div class="pv-row"><span class="pv-l">수업 뒤 연습할 유형</span>${TL.map(t=>`<span class="pv-ty">유형 ${t.no} · ${t.nm}</span>`).join('')}</div>`:''}</div>`}const TL=PTYPES[id]||[];return`<div class="card panel pv"><div class="pv-h"><b>미리 보기</b><span>정규 수업 전에 · 교과서 ${P.tb} · 카드를 누르면 크게 보여요</span></div>
  <div class="pv-ct">오늘의 핵심 <small>이것만은 꼭!</small></div>
  <div class="pv-cards">${P.core.map((c,i)=>`<button type="button" class="pvc zc"><span class="pvn">${i+1}</span><b class="pvh">${c.h}</b><div class="pvb">${c.b}</div></button>`).join('')}
   <button type="button" class="pvc ex zc"><span class="pvn">예</span><b class="pvh">예시로 확인</b><div class="pvb">${P.ex}</div></button></div>
  <div class="pv-row"><span class="pv-l">낱말</span>${P.words.map(w=>`<span class="pv-w">${w}</span>`).join('')}</div>
  ${TL.length?`<div class="pv-row"><span class="pv-l">수업 뒤 연습할 유형</span>${TL.map(t=>`<span class="pv-ty">유형 ${t.no} · ${t.nm}</span>`).join('')}</div>`:''}
  </div>`}
/* 카드 확대: .zc 카드를 누르면 화면 가운데 크게 */
function zoomOpen(node){const bg=el('<div class="zoom-bg"></div>'),cd=el(`<div class="zoom-card" role="dialog" aria-modal="true"><button type="button" class="zoom-x" aria-label="닫기">✕</button><div class="zoom-in">${node.innerHTML}</div></div>`);
  const close=()=>{bg.remove();cd.remove();document.removeEventListener('keydown',esc)},esc=e=>{if(e.key==='Escape')close()};
  bg.onclick=close;$('.zoom-x',cd).onclick=close;document.addEventListener('keydown',esc);document.body.append(bg,cd)}
document.addEventListener('click',e=>{const c=e.target.closest('.zc');if(c&&!e.target.closest('.term'))zoomOpen(c)});
/* 화면: 차시 */
function viewLesson(id,tab){
  const L=LESSONS.find(l=>l.id===id);const p=prog(id);
  crumbs.innerHTML=`<span class="sep">›</span><a href="${UNIT_HASH}">${UI_.name}</a><span class="sep">›</span><span>${L.title}</span>`;
  const doneOf={concept:p.concept,explore:p.explore,steps:p.steps>0,practice:p.prac.solved>=5};
  app.innerHTML=`<div class="lesson-head"><div class="kicker">${L.no}차시${L.tb?` · <span class="tbref">교과서 ${L.tb}</span>`:''}</div><h1>${L.title}</h1></div>
   <div class="tabs" role="tablist">${TABS.map((t,i)=>`<button type="button" role="tab" class="tab ${t.id===tab?'on':''} ${doneOf[t.id]?'done':''}" data-tab="${t.id}" aria-selected="${t.id===tab}"><span class="num">${doneOf[t.id]&&t.id!==tab?CHECK:i+1}</span><span class="tl">${t.t}<small>${t.s}</small></span></button>`).join('')}</div>
   <div id="tabBody"></div>`;
  $$('.tab',app).forEach(b=>b.onclick=()=>{location.hash=id+(b.dataset.tab==='concept'?'':'-'+b.dataset.tab)});
  const body=$('#tabBody');
  const nextBtn=(label,to)=>`<div class="next-row"><a class="btn primary" href="#${id}-${to}">${label} →</a></div>`;
  if(tab==='concept'){CONCEPT[id](body);body.insertAdjacentHTML('afterbegin',previewBox(id));pvWire(body,id);body.insertAdjacentHTML('beforeend',nextBtn('같이 풀기 (정규 수업 뒤에)','steps'));p.concept=true;save();award(5,'concept:'+id)}
  if(tab==='explore'){EXPLORE[id](body);body.insertAdjacentHTML('beforeend',nextBtn('혼자 풀기','practice'));p.explore=true;save()}
  DB._last={id,tab};save();
  if(tab==='steps')viewSteps(body,id);
  if(tab==='practice'){viewPractice(body,id);body.insertAdjacentHTML('beforeend',`<div class="card panel pw-cta"><b>🖨 마지막 점검</b> · 배운 유형을 섞은 <b>인쇄용 학습지</b>로 시험처럼 풀어 봐요. <a class="btn ghost" href="#print-${id}">점검 학습지 만들기 →</a></div>`)}
}
const STEPGEN={poly:GEN.polyStep,types:GEN.typesStep,area:GEN.areaStep};
/* 유형 고르기 화면 (대청 수학 「기초 연습」처럼 카드에서 유형을 골라 들어가요) */
function tyPicker(host,{TL,head,mix,stat,rec,onPick}){
  host.innerHTML=`<div class="tp-h">${head}</div><div class="tpick">${mix?`<button type="button" class="tpc mix" data-no="0"><span class="tpn">섞어서</span><b>유형 섞어 풀기</b><div class="d">${mix}</div></button>`:''}${TL.map(t=>`<button type="button" class="tpc${rec(t)?' rec':''}" data-no="${t.no}"><span class="tpn">유형 ${t.no}</span>${rec(t)?'<span class="tprec">추천</span>':''}<b>${t.nm}</b><div class="d">${t.key}</div><div class="s"><span>${/쪽/.test(t.tb)?'교과서 ':''}${t.tb}</span><span>${stat(t)}</span></div></button>`).join('')}</div>`;
  $$('.tpc',host).forEach(b=>b.onclick=()=>onPick(+b.dataset.no));
}
const tyBar=(T_,label)=>`<div class="tybar"><span class="tyn">${T_?'유형 '+T_.no:'섞어서'}</span><b>${T_?T_.nm:'유형 섞어 풀기'}</b>${T_?`<span class="tytb">${/쪽/.test(T_.tb)?'교과서 ':''}${T_.tb}</span>`:''}<button type="button" class="btn ghost tyback">← ${label}</button></div>`;
function viewSteps(body,id){
  const p=prog(id),TL=PTYPES[id];p.tyS=p.tyS||{};
  const wrap=el(`<div><div class="card panel"><div class="statbar stS"><div class="stat"><small>단계 문제를 끝까지 푼 횟수</small><b>${p.steps}</b></div>
    <span class="muted" style="font-size:15px">왼쪽은 선생님 풀이, 오른쪽은 내가 푸는 같은 유형 문제예요. 막히면 왼쪽의 같은 단계를 보세요.</span></div><div id="tyHost"></div><div id="probHost"></div></div></div>`);
  body.appendChild(wrap);
  const SG0=GEN[id+'Step2']?id+'Step2':({poly:'polyStep',types:'typesStep',area:'areaStep',regular:'regularStep'}[id]||(GEN[id+'Step']?id+'Step':id));
  const nextUndone=()=>TL.find(t=>!p.tyS[t.no]);
  const pickScreen=()=>{$('#probHost',wrap).innerHTML='';tyPicker($('#tyHost',wrap),{TL,head:'<b>유형 고르기</b><span>왼쪽에서 선생님이 풀어 주는 <b>풀이 예시</b>를 보고, 오른쪽에서 같은 유형 문제를 직접 풀어요. 유형 1부터 차례로 하면 좋아요.</span>',
    stat:t=>p.tyS[t.no]?`✓ ${p.tyS[t.no]}번 풀었어요`:'아직 안 풀었어요',rec:t=>t===nextUndone(),onPick:no=>pair(no)})};
  const ansOf=P=>P.title+JSON.stringify(P.steps.map(st=>st.ans)),sigOf=P=>P.ptype+'|'+(P.sig||'')+'|'+P.steps.map(st=>(st.tag||'')+st.type).join(',');
  /* 한 쌍: 왼쪽 풀이 예시(교사) + 오른쪽 같은 모양의 문제(학생) */
  const pair=(cur,exSeed)=>{const T_=TL.find(t=>t.no===cur),key=tyKey(id,cur);exSeed=exSeed||newSeed();
    const ex=GEN[key](exSeed);let seed,prob;for(let t=0;t<300;t++){seed=newSeed();prob=GEN[key](seed);if(sigOf(prob)===sigOf(ex)&&ansOf(prob)!==ansOf(ex))break}
    $('#tyHost',wrap).innerHTML=tyBar(T_,'유형 고르기');$('.tyback',wrap).onclick=pickScreen;liveSub(`유형 ${T_.no} · ${T_.nm}`);
    const host=$('#probHost',wrap);host.innerHTML=`<div class="tykey"><span>핵심</span>${T_.key}</div><div class="pair">
      <section class="pl"><div class="ph"><span class="wktag">선생님 풀이</span><span>「풀이 보기 ▶」로 한 단계씩</span><button type="button" class="btn ghost mini exAll">모두 펼치기</button></div><div class="exHost"></div></section>
      <section class="pr"><div class="ph"><span class="trytag">내가 풀기</span><span>같은 유형 · 숫자만 달라요</span><button type="button" class="btn ghost mini exShow">선생님 풀이 전체 보기</button></div><div class="tryHost"></div></section></div>`;
    ex.title=stripTB(ex.title);prob.title=stripTB(prob.title);
    let rc=0;renderProblem($('.exHost',host),ex,{mode:'steps',visual:true,worked:true,onStep:()=>setTimeout(()=>sync(rc))});
    $('.exShow',host).onclick=e=>{const pr=$('.pair',host),on=pr.classList.toggle('showex');e.target.textContent=on?'선생님 풀이 접기':'선생님 풀이 전체 보기';if(on){let g=0;while($('.exHost .wkbtn',host)&&g++<20)$('.exHost .wkbtn',host).click();$('.pl',host).scrollIntoView({behavior:'smooth',block:'start'})}};
    $('.exAll',host).onclick=()=>{let g=0;while($('.exHost .wkbtn',host)&&g++<20)$('.exHost .wkbtn',host).click()};
    const sync=i=>{rc=i;$$('.exHost .step',host).forEach((li,k)=>li.classList.toggle('sync',k===i));
      const cl=$('.tryHost .step.cur',host),es=ex.steps[i];if(!cl||!es||$('.mstep',cl))return;
      cl.insertBefore(el(`<details class="mstep"><summary>선생님 풀이 · 같은 단계 보기</summary><div class="mq">${es.q}</div><div class="wk"><span class="wka">${fmtAns(es)}</span>${(es.why||es.hint||es.ok)?`<span class="wkw">${es.why||es.hint||es.ok}</span>`:''}</div></details>`),cl.firstChild)};
    renderProblem($('.tryHost',host),prob,{mode:'steps',visual:true,rep:{lesson:id,gen:key,seed},onStep:i=>setTimeout(()=>sync(i)),onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{sync(-1);logAttempt({lesson:id,kind:'steps',good,wrongs,mode,gen:key,seed,ptype:prob.ptype,stepWrongs,revealed});dayBump('steps');
      if(good){p.steps++;p.tyS[cur]=(p.tyS[cur]||0)+1;save();$('.stat b',wrap).textContent=p.steps;award(10)}else{award(4);addReview(key,seed,id);box.insertAdjacentHTML('afterbegin','<span style="flex-basis:100%;font-size:15px">이 문제는 복습 노트에 넣었어요.</span>')}
      const nx=TL.find(t=>t.no>cur);
      const nb=el(`<span style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn" data-k="same">같은 유형 하나 더</button><button type="button" class="btn ghost" data-k="ex">새 풀이 예시로</button>${nx?`<button type="button" class="btn primary" data-k="next">유형 ${nx.no} · ${nx.nm} →</button>`:`<a class="btn primary" href="#${id}-practice">혼자 풀러 가기 →</a>`}</span>`);
      $('[data-k=same]',nb).onclick=()=>pair(cur,exSeed);$('[data-k=ex]',nb).onclick=()=>pair(cur);if(nx)$('[data-k=next]',nb).onclick=()=>pair(nx.no);box.appendChild(nb)}})};
  const go=()=>{const seed=newSeed(),prob=GEN[SG0](seed);
    renderProblem($('#probHost',wrap),prob,{mode:'steps',visual:true,rep:{lesson:id,gen:SG0,seed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{logAttempt({lesson:id,kind:'steps',good,wrongs,mode,gen:SG0,seed,ptype:prob.ptype,stepWrongs,revealed});dayBump('steps');
      if(good){p.steps++;save();$('.stat b',wrap).textContent=p.steps;award(10)}else{award(4);addReview(SG0,seed,id)}
      const nb=el(`<span style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn">하나 더</button><a class="btn primary" href="#${id}-practice">혼자 풀러 가기 →</a></span>`);$('button',nb).onclick=go;box.appendChild(nb)}})};
  if(TL)pickScreen();else go();
}
function viewPractice(body,id){
  const p=prog(id),P=p.prac,curL=LESSONS.find(l=>l.id===id)||{};
  const wrap=el(`<div class="card panel"><div class="statbar">
     <div class="stat"><small>푼 문제</small><b id="sSolved">${P.solved}</b></div>
     <div class="stat"><small>연속 정답</small><b id="sStreak">${P.streak}</b></div>
     <span class="lvl" id="sLvl"></span>${(DB._rev||[]).length?`<a class="lvl" style="margin-left:0;background:#fff" href="#review">복습 노트 ${dueReviews().length?'· 오늘 '+dueReviews().length+'문제':'· '+(DB._rev||[]).length+'문제 대기'}</a>`:''}</div><div id="tyHost"></div><div id="practHost"></div></div>`);
  body.appendChild(wrap);
  const TL=PTYPES[id];P.ty=P.ty||{};
  const acc=t=>{const x=P.ty[t.no];return x?`${x.ok} / ${x.n} 맞힘`:'아직 안 풀었어요'};
  const weak=t=>{const x=P.ty[t.no];return x&&x.n>=2&&x.ok/x.n<0.6};
  const pickScreen=()=>{$('#practHost',wrap).innerHTML='';tyPicker($('#tyHost',wrap),{TL,head:'<b>유형 고르기</b><span>한 유형씩 연습하거나, 섞어서 풀며 어떤 유형인지 스스로 알아봐요. 많이 틀린 유형에는 <b>추천</b>이 붙어요.</span>',
    mix:'모든 유형이 섞여 나와요. 풀고 나면 어떤 유형이었는지 알려 줘요.',stat:acc,rec:weak,onPick:no=>{P.mode=no;save();next()}})};
  const upd=()=>{$('#sSolved',wrap).textContent=P.solved;$('#sStreak',wrap).textContent=P.streak;$('#sLvl',wrap).textContent=P.level>=2?'단계 없이 도전 중':'단계 따라 풀기';save()};
  function next(){
    let seed,isRetry=false;
    P.retry.forEach(x=>x.due--);const ri_=P.retry.findIndex(x=>x.due<=0);
    let rg=null;if(ri_>=0){seed=P.retry[ri_].seed;rg=P.retry[ri_].g||null;P.retry.splice(ri_,1);isRetry=true}else seed=newSeed();
    const TM=TL&&P.mode?TL.find(t=>t.no===P.mode):null;
    if(TL){$('#tyHost',wrap).innerHTML=tyBar(TM,'유형 고르기');$('.tyback',wrap).onclick=pickScreen;liveSub(TM?`유형 ${TM.no} · ${TM.nm}`:'섞어서')}
    // 섞어 풀기: 지난 차시(이미 공부를 시작한 차시) 문제를 열에 셋쯤 섞어요. 다시 도전 문제는 섞지 않아요.
    const mk=x=>GEN['mix_'+x]?'mix_'+x:GEN[x+'2']?x+'2':x;
    const prevL=LESSONS.filter(l=>l.ready&&l.unit===curL.unit&&l.no<curL.no&&GEN[l.id]&&OBJ(DB[l.id]).concept);
    const mixL=!isRetry&&!TM&&prevL.length&&Math.random()<0.3?prevL[Math.floor(Math.random()*prevL.length)]:null,gid=rg||(TM?tyKey(id,TM.no):mk(mixL?mixL.id:id));
    const prob=GEN[gid](seed),TY=typeOf(prob.ptype);
    if(TM)prob.title=`<details class="tykey"><summary>핵심 보기</summary>${TM.key}</details>`+stripTB(prob.title);
    if(isRetry)prob.title+='<span class="retry-tag">다시 도전</span>';
    if(mixL)prob.title='<span class="rv-from">섞어 풀기 · '+mixL.no+'차시 '+mixL.title+'</span><br>'+prob.title;
    renderProblem($('#practHost',wrap),prob,{mode:P.level>=2?'final':'steps',rep:{lesson:id,gen:gid,seed},onDone:({good,usedSteps,mode,wrongs,stepWrongs,revealed,box})=>{
      const lid=LESSON_OF[gid]||id;
      logAttempt({lesson:lid,kind:'practice',good,wrongs,mode,gen:gid,seed,ptype:prob.ptype,stepWrongs,revealed,mixed:!!mixL});
      if(TY&&TY.lid===id){const x=P.ty[TY.T.no]=P.ty[TY.T.no]||{n:0,ok:0};x.n++;if(good&&wrongs===0)x.ok++}
      if(TY&&!TM)box.insertAdjacentHTML('afterbegin',`<div class="tyafter">이 문제는 <b>${TY.lid===id?'':(LESSONS.find(l=>l.id===TY.lid)||{}).title+' · '}유형 ${TY.T.no} · ${TY.T.nm}</b><span>${TY.T.key}</span></div>`);dayBump('prac');if(good&&wrongs===0)dayBump('clean');
      P.solved++;award(good?(mode==='final'&&!usedSteps&&prob.steps.length>1?5:3):1);if(!good||wrongs>=2){addReview(gid,seed,lid);box.insertAdjacentHTML('afterbegin','<span style="flex-basis:100%;font-size:15px">헷갈린 문제라 복습 노트에 넣었어요.</span>')}
      if(good){P.fails=0;if(prob.steps.length>1&&P.level<2){P.streak++;if(P.streak>=3){P.level=2;toast('3번 연속 성공! 이제 단계 없이 도전해요.')}}else P.streak++}
      else{P.streak=0;P.fails++;if(!mixL)P.retry.push({seed,due:2,g:gid});if(P.level>=2&&P.fails>=2){P.level=1;P.fails=0;toast('다시 단계를 따라 풀어 봐요.')}}
      upd();const nb=el('<button type="button" class="btn primary">다음 문제 →</button>');nb.onclick=next;box.appendChild(nb);nb.focus()}});
  }
  upd();if(TL&&PW_GO&&PW_GO.lid===id&&TL.some(t=>t.no===PW_GO.no)){P.mode=PW_GO.no;PW_GO=null;save();next()}else if(TL)pickScreen();else next();
}

/* ───────── 개념 카드 ───────── */
const CONCEPT={};
const GC=['#2a4d9e','#e08a1e','#3f9e6e','#c0504d','#7b5ea7'];
const FC=['#c9d6f2','#f6d9b0','#c5e6d4','#efc6c4','#dccff0'];
function drawPlates(ctx,vw,base,I,labels){
  I.lv.forEach((z,f)=>{const ids=I.G.v.find(q=>q.key==='v'+f).ids;let cx=0,cy=0;ids.forEach(i=>{cx+=base.V[i][0];cy+=base.V[i][1]});cx/=ids.length;cy/=ids.length;
    const r=Math.max(0.28,...ids.map(i=>Math.hypot(base.V[i][0]-cx,base.V[i][1]-cy)))*1.18+0.18;
    const pts=range(40).map(q=>vw.proj([cx+r*Math.cos(TAU*q/40),cy+r*Math.sin(TAU*q/40),z]));
    if(!labels){ctx.beginPath();pts.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle='rgba(42,77,158,.07)';ctx.fill();ctx.setLineDash([5,4]);ctx.strokeStyle='rgba(42,77,158,.4)';ctx.lineWidth=1.3;ctx.stroke();ctx.setLineDash([])}
    else{const L=pts.reduce((a,p)=>p[0]<a[0]?p:a,pts[0]);ktext(ctx,`${f+1}층`,L[0]-6,L[1],{align:'right',bold:true,size:15,color:'#2a4d9e'})}})}
function floorFig(canvas,mesh,kind,o={}){
  const I=floorInfo(mesh);const gi=(k,id)=>I.G[k].findIndex(g=>g.ids.includes(id));
  const v=new Viewer(canvas,{interactive:false,yaw:o.yaw??-0.5,pitch:o.pitch??0.3,pad:o.pad??0.40,draw:(ctx,vw)=>{drawPlates(ctx,vw,mesh,I,false);vw.drawMesh(mesh);drawPlates(ctx,vw,mesh,I,true)}});
  if(kind==='v'){v.mode='v';v.vcol=i=>GC[gi('v',i)%5]}
  if(kind==='e')v.ecol=k=>GC[gi('e',k)%5]+'cc';
  if(kind==='f')v.fcol=i=>FC[gi('f',i)%5];
  v.setScene([{mesh}],{R:mesh.R*1.12});return I}
function floorCap(I,kind){const parts=I.G[kind].map((g,i)=>`<span style="color:${GC[i%5]};font-weight:700">${g.ids.length}</span>`);
  return `${KIND_NM[kind]} = <span class="rm">${parts.join(' + ')} = ${I.G[kind].reduce((a,g)=>a+g.ids.length,0)}</span>`}
function floorLegend(I,kind){return I.G[kind].map((g,i)=>`<span class="lg"><i style="background:${kind==='f'?FC[i%5]:GC[i%5]}"></i>${g.label}</span>`).join('')}
const fold=(i,title,tease,inner,open)=>`<details class="fold" data-i="${i}"${open?' open':''}><summary><span class="fn">${i}</span><span class="ft"><b>${title}</b><small>${tease}</small></span><span class="chev" aria-hidden="true"></span></summary><div class="fb">${inner}</div></details>`;
const foldPanel=(title,lead,folds)=>`<div class="card panel"><div class="fold-head"><h2>${title}</h2><div class="fold-tools"><button type="button" data-all="1">모두 펼치기</button><button type="button" data-all="0">모두 접기</button></div></div>${lead}<div class="folds">${folds}</div></div>`;
function wireFolds(body,id){
  const D=$$('details.fold',body);$$('.folds',body).forEach(f=>f.classList.add('cardmode'));$$('.fold-tools',body).forEach(t=>t.remove());
  D.forEach(d=>{d.open=false;$('summary',d).insertAdjacentHTML('beforeend','<span class="fold-x" aria-hidden="true">✕ 닫기</span>');
    d.addEventListener('toggle',()=>{if(d.open){D.forEach(o=>{if(o!==d)o.open=false});if(!$('.zoom-bg.fz'))document.body.appendChild(Object.assign(el('<div class="zoom-bg fz"></div>'),{onclick:()=>D.forEach(o=>o.open=false)}))}
      else if(!D.some(o=>o.open))$$('.zoom-bg.fz').forEach(b=>b.remove())})});
  if(!wireFolds.k){wireFolds.k=1;document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('details.fold[open]').forEach(d=>d.open=false)});window.addEventListener('hashchange',()=>$$('.zoom-bg').forEach(b=>b.remove()))}
}
CONCEPT.poly=body=>{
  body.innerHTML=foldPanel('다면체',`<p class="lead">${T('다각형')}인 면으로만 둘러싸인 ${T('입체도형')}을 <b class="mark">다면체</b>라고 해요.</p>`,
   fold(1,'면 · 모서리 · 꼭짓점','다면체를 이루는 세 가지',`<div class="concept-grid">
     <div class="figbox"><canvas id="cCube" style="height:300px"></canvas></div>
     <ul class="defs">
       <li><b>면</b><span>다면체를 둘러싸고 있는 다각형</span></li>
       <li><b>모서리</b><span>다각형의 변. 면과 면이 만나는 선분</span></li>
       <li><b>꼭짓점</b><span>다각형의 꼭짓점. 모서리와 모서리가 만나는 점</span></li></ul></div>`,true)+
   fold(2,'면의 모양 살펴보기','어떤 다각형으로 이루어졌는지 먼저 봐요',`<p style="margin-top:0">다면체를 보면 먼저 <b>어떤 다각형으로 이루어졌는지</b> 살펴봐요. 그림에서는 비스듬히 보이기 때문에 실제 모양과 다르게 보일 수 있어요.</p>
     <div class="trio"><div class="figbox"><canvas id="cFace1" style="height:200px"></canvas><div class="figcap">비스듬히 보면<br>평행사변형처럼 보여요</div></div>
       <div class="figbox"><canvas id="cFace2" style="height:200px"></canvas><div class="figcap">정면에서 보면<br><b>직사각형</b>이에요</div></div>
       <div class="figbox"><div class="falist" id="cFaceList" style="padding:6px 4px"></div><div class="figcap">오각기둥의 <b>면 목록</b><br>면 7개 → 칠면체</div></div></div>
     <p class="muted" style="font-size:15px;margin-bottom:0">면 목록을 만들면 이름도 보여요. 옆면이 직사각형이면 각기둥, 삼각형이면 각뿔이에요. 탐구의 '면의 모양 찾기'에서 직접 해 볼 수 있어요.</p>`)+
   fold(3,'이름 짓기','면의 개수로 ○면체라고 불러요',`<p style="margin-top:0">면이 4개, 5개, 6개, …인 다면체를 각각 <b>사면체, 오면체, 육면체, …</b>라고 해요.</p>
     <div class="quad">${[['y3','삼각뿔',4],['y4','사각뿔',5],['cube','정육면체',6],['p5','오각기둥',7]].map(([k,n,f])=>`<div class="figbox"><canvas data-nm="${k}" style="height:170px"></canvas><div class="figcap">${n}<br>면 <b class="rm">${f}</b>개 → <b>${kn(f)}면체</b></div></div>`).join('')}</div>`)+
   fold(4,'세는 방법: 몇 층 건물?','같은 높이에 있는 꼭짓점끼리 한 층',`<p style="margin-top:0">입체도형을 건물이라고 생각하고, 먼저 <b>몇 층 건물</b>인지 찾아요. 그다음 층마다 세어 더해요.</p>
     <div class="trio">${['v','e','f'].map(k=>`<div class="figbox"><canvas data-fl="${k}" style="height:210px"></canvas><div class="figcap" data-cap="${k}"></div><div class="lgs" data-lg="${k}"></div></div>`).join('')}</div>
     <p class="muted" style="font-size:15px;margin-bottom:0">탐구에서 직접 눌러 세어 볼 수 있어요. 정십이면체 같은 4층 건물도 같은 방법으로 셀 수 있어요.</p>`)+
   fold(5,'다면체가 아닌 것','곡면이 있으면 다면체가 아니에요',`<p style="margin-top:0">${T('곡면')}이 있으면 다각형으로만 둘러싸인 게 아니니 다면체가 아니에요.</p>
     <div class="trio">${['cyl','cone','sph'].map(k=>`<div class="figbox"><canvas data-s="${k}" style="height:170px"></canvas><div class="figcap">${SOLIDS[k].name}</div></div>`).join('')}</div>`)+
   fold(6,'생각해 보기','면이 3개인 다면체도 있을까요?',`<p style="margin-top:0">면을 하나씩 줄여 가면 어디까지 줄일 수 있을까요? 면이 3개인 다면체도 있을까요? <span class="muted">(탐구에서 확인해 보세요)</span></p>
     <div class="quad">${[['cube','정육면체',6],['p3','삼각기둥',5]].map(([k,n,f])=>`<div class="figbox"><canvas data-nm="${k}" style="height:170px"></canvas><div class="figcap">${n} · 면 <b class="rm">${f}</b>개</div></div>`).join('')}
       <div class="qbox">?<span style="font-size:15px;font-family:var(--body)">면 4개?</span></div><div class="qbox">?<span style="font-size:15px;font-family:var(--body)">면 3개?</span></div></div>`));
  wireFolds(body,'poly');
  const cube=SOLIDS.cube.mk();
  figure($('#cCube'),{visual:true,mesh:cube,yaw:-0.5,pitch:0.42,pad:0.33,after:(ctx,v)=>{
    const top=cube.F[1];const P=top.map(i=>v.proj(cube.V[i]));ctx.beginPath();P.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle='rgba(255,226,102,.75)';ctx.fill();ctx.strokeStyle='#151a28';ctx.lineWidth=2.2;ctx.stroke();
    const fc=P.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4],[0,0]);ktext(ctx,'면',fc[0],fc[1],{bold:true,size:18});
    const fr=cube.N.map(n=>v.facing(n)>0);const Vs=cube.V.map(p=>v.proj(p));
    const vi=Vs.reduce((b,p,i)=>p[0]>Vs[b][0]?i:b,0);const VP=Vs[vi];ctx.beginPath();ctx.arc(VP[0],VP[1],7,0,TAU);ctx.fillStyle='#151a28';ctx.fill();ktext(ctx,'꼭짓점',VP[0]+14,VP[1]+2,{bold:true,size:17,align:'left'});
    const lo=Vs.reduce((b,p,i)=>p[1]>Vs[b][1]?i:b,0);const e=cube.E.find(e=>(e.a===lo||e.b===lo)&&Math.abs(cube.V[e.a][2]-cube.V[e.b][2])<1e-6&&e.f.some(fi=>fr[fi])&&(Vs[e.a===lo?e.b:e.a][0]<Vs[lo][0]));
    if(e){const A=Vs[e.a],B=Vs[e.b];ctx.strokeStyle='#e0a800';ctx.lineWidth=7;line(ctx,A,B);ctx.strokeStyle='#151a28';ctx.lineWidth=2.2;line(ctx,A,B);ktext(ctx,'모서리',(A[0]+B[0])/2-6,(A[1]+B[1])/2+24,{bold:true,size:17})}}});
  $$('canvas[data-s]',body).forEach(cv=>figure(cv,{visual:true,mesh:SOLIDS[cv.dataset.s].mk(),pitch:0.32,pad:0.38}));
  $$('canvas[data-nm]',body).forEach(cv=>{const k=cv.dataset.nm;figure(cv,{visual:true,mesh:k==='y3'?pyramid(regPoly(3,1.15),1.6):SOLIDS[k].mk(),pitch:0.32,pad:0.38})});
  {const m=SOLIDS.p5.mk();const f1=figure($('#cFace1',body),{visual:true,mesh:m,yaw:-0.5,pitch:0.35,pad:0.36});
   let fi=2,bd=9;for(let i=2;i<m.F.length;i++){const d=Math.abs(f1.facing(m.N[i])-0.5);if(f1.facing(m.N[i])>0.15&&d<bd){bd=d;fi=i}}f1.fcol=i=>i===fi?HL_SIDE:null;f1.dirty=true;
   const n=m.N[fi],a=faceOnAngles(n,0);const f2=figure($('#cFace2',body),{visual:true,mesh:m,yaw:a.yaw,pitch:a.pitch,pad:0.36});f2.fcol=i=>i===fi?HL_SIDE:null;
   const L=$('#cFaceList',body);L.innerHTML='<ul>'+[['정오각형',0,2],['직사각형',fi,5]].map(([nm,f,k],j)=>`<li><span class="ico" data-j="${j}"></span><b>${nm}</b><span class="rm cnt">${k}개</span></li>`).join('')+'</ul>';
   $$('.ico',L).forEach(sp=>{const j=+sp.dataset.j,f=j?fi:0;sp.appendChild(shapeIcon(face2D(m,f),40,j?HL_SIDE:HL_BASE))})}
  const cm=SOLIDS.cube.mk();$$('canvas[data-fl]',body).forEach(cv=>{const k=cv.dataset.fl,I=floorFig(cv,cm,k);$(`[data-cap="${k}"]`,body).innerHTML=floorCap(I,k);$(`[data-lg="${k}"]`,body).innerHTML=floorLegend(I,k)});
};
CONCEPT.types=body=>{
  body.innerHTML=foldPanel('각기둥, 각뿔, 각뿔대',`<p class="lead">${T('밑면')}이 ${T('n각형','<span class="math">n</span>각형')}일 때, <b class="mark">${T('옆면')}의 모양</b>으로 세 가지를 구별해요.</p>`,
   fold(1,'세 가지 입체도형','옆면이 직사각형 · 삼각형 · 사다리꼴',`<div class="trio">
     <div class="figbox"><canvas data-k="prism" style="height:200px"></canvas><div class="figcap"><b>오각기둥</b></div></div>
     <div class="figbox"><canvas data-k="pyramid" style="height:200px"></canvas><div class="figcap"><b>오각뿔</b></div></div>
     <div class="figbox"><canvas data-k="frustum" style="height:200px"></canvas><div class="figcap"><b>오각뿔대</b></div></div></div>
     <div class="trio" style="margin-top:12px">
     <p style="margin:0"><b>각기둥</b>: 두 밑면이 서로 ${T('평행')}하고 ${T('합동')}인 다각형이고, 옆면은 모두 직사각형</p>
     <p style="margin:0"><b>각뿔</b>: 밑면이 다각형 1개이고, 옆면은 모두 한 꼭짓점에서 만나는 삼각형</p>
     <p style="margin:0"><b>각뿔대</b>: 두 밑면이 평행하지만 합동이 아니고, 옆면은 모두 ${T('사다리꼴')}</p></div>`,true)+
   fold(2,'각뿔대는 어떻게 생길까?','각뿔을 밑면에 평행하게 자르면',`<p style="margin-top:0">각뿔을 밑면에 평행한 평면으로 자르면 두 입체도형이 생겨요. 그중 <b>각뿔이 아닌 쪽</b>이 각뿔대예요. 위쪽은 작은 각뿔이 돼요. <span class="muted">(탐구에서 직접 잘라 볼 수 있어요)</span></p>
     <div class="trio"><div class="figbox"><canvas id="cCut1" style="height:220px"></canvas><div class="figcap">① 밑면에 평행하게 자르기</div></div>
       <div class="figbox"><canvas id="cCut2" style="height:220px"></canvas><div class="figcap">② 떼어 내기</div></div>
       <div class="figbox"><canvas id="cCut3" style="height:220px"></canvas><div class="figcap">③ 남은 아래쪽 = <b>사각뿔대</b></div></div></div>`)+
   fold(3,'몇 층 건물로 생각하기','공식을 외우지 않아도 셀 수 있어요',`<p style="margin-top:0">셋 다 <b>2층 건물</b>이에요. 층마다 세어 더하면 개수가 나와요. 그림은 오각기둥, 오각뿔, 오각뿔대의 꼭짓점을 층별로 칠한 거예요.</p>
     <div class="trio" style="margin-bottom:14px">${['prism','pyramid','frustum'].map(k=>`<div class="figbox"><canvas data-tf="${k}" style="height:210px"></canvas><div class="figcap"><b>오${TYPE[k].nm}</b><br><span data-tcap="${k}"></span></div></div>`).join('')}</div>
     <div class="tablewrap"><table class="t"><thead><tr><th></th><th><span class="math">n</span>각기둥</th><th><span class="math">n</span>각뿔</th><th><span class="math">n</span>각뿔대</th></tr></thead><tbody>
       <tr><th>층별 꼭짓점</th><td class="rm"><i>n</i> + <i>n</i></td><td class="rm">1 + <i>n</i> <small class="muted">(꼭대기 층이 점 하나)</small></td><td class="rm"><i>n</i> + <i>n</i></td></tr>
       <tr><th>모서리<br><small class="muted">위층 · 사이 · 아래층</small></th><td class="rm"><i>n</i> + <i>n</i> + <i>n</i></td><td class="rm"><i>n</i> + <i>n</i> <small class="muted">(사이 · 아래층)</small></td><td class="rm"><i>n</i> + <i>n</i> + <i>n</i></td></tr>
       <tr><th>면<br><small class="muted">지붕 · 벽 · 바닥</small></th><td class="rm">1 + <i>n</i> + 1</td><td class="rm"><i>n</i> + 1 <small class="muted">(벽 · 바닥)</small></td><td class="rm">1 + <i>n</i> + 1</td></tr></tbody></table></div>`)+
   fold(4,'개수 정리 표','면 · 모서리 · 꼭짓점의 개수',`<div class="tablewrap"><table class="t"><thead><tr><th></th><th><span class="math">n</span>각기둥</th><th><span class="math">n</span>각뿔</th><th><span class="math">n</span>각뿔대</th></tr></thead><tbody>
     <tr><th>밑면</th><td>2개 (합동)</td><td>1개</td><td>2개 (합동 아님)</td></tr>
     <tr><th>옆면 모양</th><td>직사각형</td><td>삼각형</td><td>사다리꼴</td></tr>
     <tr><th>면의 개수</th><td class="rm"><i>n</i> + 2</td><td class="rm"><i>n</i> + 1</td><td class="rm"><i>n</i> + 2</td></tr>
     <tr><th>모서리의 개수</th><td class="rm">3<i>n</i></td><td class="rm">2<i>n</i></td><td class="rm">3<i>n</i></td></tr>
     <tr><th>꼭짓점의 개수</th><td class="rm">2<i>n</i></td><td class="rm"><i>n</i> + 1</td><td class="rm">2<i>n</i></td></tr></tbody></table></div>
     <p style="margin-bottom:8px">3번의 층별 식을 정리하면 이 표가 돼요. 예) <span class="rm"><i>n</i> + <i>n</i> + <i>n</i> = 3<i>n</i></span></p>
     <p class="muted" style="font-size:15px;margin:0 0 8px">밑면의 변이 하나 늘 때마다 모서리는 층마다 하나씩, 모두 3개 늘어요.</p>
     <div class="trio">${[3,4,5].map(n=>`<div class="figbox"><canvas data-pe="${n}" style="height:190px"></canvas><div class="figcap">${kn(n)}각기둥 · 모서리 <span class="rm" data-pcap="${n}"></span></div></div>`).join('')}</div>`));
  wireFolds(body,'types');
  $$('canvas[data-k]',body).forEach(cv=>figure(cv,{visual:true,mesh:TYPE[cv.dataset.k].mk(5),pitch:0.34,pad:0.40}));
  $$('canvas[data-tf]',body).forEach(cv=>{const k=cv.dataset.tf,I=floorFig(cv,TYPE[k].mk(5),'v');$(`[data-tcap="${k}"]`,body).innerHTML=floorCap(I,'v')});
  $$('canvas[data-pe]',body).forEach(cv=>{const n=+cv.dataset.pe,I=floorFig(cv,TYPE.prism.mk(n),'e');$(`[data-pcap="${n}"]`,body).innerHTML=I.G.e.map((g,i)=>`<span style="color:${GC[i]};font-weight:700">${g.ids.length}</span>`).join(' + ')+' = '+3*n});
  // 각뿔대 만들기 3단계 그림
  const P4=regPoly(4,1.25,Math.PI/4),H=1.9,k=0.5;
  const pyr=pyramid(P4,H),fr=frustum(P4,1-k,H*k),top=pyramid(P4.map(p=>[p[0]*(1-k),p[1]*(1-k)]),H*(1-k));
  const plane=(ctx,vw)=>{const R0=1.25*(1-k)*1.6,z=H*k;const Q=[[-R0,-R0,z],[R0,-R0,z],[R0,R0,z],[-R0,R0,z]].map(p=>vw.proj(p));ctx.beginPath();Q.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle='rgba(42,77,158,.15)';ctx.fill();ctx.strokeStyle='rgba(42,77,158,.7)';ctx.lineWidth=1.6;ctx.stroke()};
  const c1=new Viewer($('#cCut1',body),{interactive:false,yaw:-0.5,pitch:0.3,pad:0.34,after:plane});c1.setScene([{mesh:pyr}],{center:[0,0,H*0.55],R:1.75});
  const c2=new Viewer($('#cCut2',body),{interactive:false,yaw:-0.5,pitch:0.3,pad:0.34,after:(ctx,vw)=>{ktext(ctx,'작은 각뿔',vw.w*0.78,vw.h*0.16,{bold:true,size:15,color:'#8a6300'});ktext(ctx,'각뿔대',vw.w*0.8,vw.h*0.72,{bold:true,size:15,color:'#2a4d9e'})}});
  c2.setScene([{mesh:fr},{mesh:top,off:[0,0,H*k+0.75],st:{tint:[255,240,190]}}],{center:[0,0,H*0.7],R:2.0});
  const c3=new Viewer($('#cCut3',body),{interactive:false,yaw:-0.5,pitch:0.3,pad:0.34,after:(ctx,vw)=>{ktext(ctx,'두 밑면은 평행, 크기는 달라요',vw.w/2,vw.h-14,{size:13,color:'#5a6377'})}});
  c3.setScene([{mesh:fr}],{center:[0,0,H*0.35],R:1.6});
};
CONCEPT.area=body=>{
  body.innerHTML=foldPanel('기둥의 겉넓이',`<p class="lead">입체도형의 겉면 전체의 넓이를 <b class="mark">겉넓이</b>라고 해요. ${T('전개도')}의 넓이와 같아요.</p>
   <div class="box"><p class="formula">(기둥의 겉넓이) = (${T('밑넓이')}) × 2 + (${T('옆넓이')})</p></div>`,
   fold(1,'옆면을 펼치면 직사각형','가로는 밑면의 둘레, 세로는 높이',`<div class="concept-grid">
     <div class="figbox"><canvas id="cNet" style="height:300px"></canvas><div class="figcap">직육면체의 전개도</div></div>
     <div><ul class="defs"><li><b>가로</b><span>밑면의 ${T('둘레')}</span></li><li><b>세로</b><span>기둥의 높이</span></li></ul>
      <p class="formula" style="margin-top:12px">(옆넓이) = (밑면의 둘레) × (높이)</p></div></div>`,true)+
   fold(2,'원기둥이라면','밑면이 원일 때 쓰는 식',`<div class="concept-grid" style="margin-bottom:14px"><div class="figbox"><canvas id="cCyl" style="height:240px"></canvas><div class="figcap">반지름 <span class="math">r</span>, 높이 <span class="math">h</span>인 원기둥</div></div>
       <div class="figbox"><canvas id="cCylNet" style="height:240px"></canvas><div class="figcap">원기둥의 전개도 · 옆면은 직사각형</div></div></div><ul class="defs"><li><b>밑넓이</b><span>${T('원의 넓이')}: <span class="rm">π</span><span class="math">r</span><sup class="rm">2</sup></span></li>
       <li><b>밑면 둘레</b><span>${T('원의 둘레')}: <span class="rm">2π</span><span class="math">r</span></span></li></ul>
      <p style="margin-bottom:0">반지름이 <span class="math">r</span>, 높이가 <span class="math">h</span>이면 겉넓이는 <span class="rm">2π</span><span class="math">r</span><sup class="rm">2</sup> + <span class="rm">2π</span><i class="math">rh</i></p>`));
  wireFolds(body,'area');
  unfoldViewer($('#cNet'),{shape:UNF.box,t:1,labels:true});
  figure($('#cCyl',body),{visual:true,mesh:prism(regPoly(64,1.4),2.2,true),yaw:0,pitch:0.34,pad:0.33,after:(ctx,v)=>cylLabels(ctx,v,1.4,2.2,'r','h')});
  unfoldViewer($('#cCylNet',body),{shape:Object.assign({},UNF.cyl,{perimLabel:'가로 = 밑면의 둘레 = 2πr',hLabel:'h',inside:true,hItalic:true}),t:1,labels:true,pad:0.56});
};

/* ───────── 연동: 입체도형 탐구 ───────── */
const LAB_SRC='labs/polyhedron-lab.html';
const LAB_ACTS={1:{t:'활동 1 · 다면체일까?',d:'예시와 비예시 살펴보기 → 맞혀 보기 → 다면체의 뜻 만들기 → 도형 20개 분류'},
  2:{t:'활동 2 · 기둥·뿔·뿔대',d:'각뿔을 평행하게/비스듬히 자르기 → 윗면 크기 바꾸기 → 네 칸 분류(18개)'},
  3:{t:'활동 3 · 세어 보기',d:'도형 6개의 이름 짓기 → 면·모서리·꼭짓점 세기 → 결과 표'}};
function labCards(acts){
  const sec=el(`<div class="lab-acts">${acts.map(n=>`<button type="button" class="lab-act" data-act="${n}"><em>${LAB_ACTS[n].t.split(' · ')[0]}</em><b>${LAB_ACTS[n].t.split(' · ')[1]}</b><span>${LAB_ACTS[n].d}</span></button>`).join('')}</div>`);
  $$('.lab-act',sec).forEach(b=>b.onclick=()=>openLab(+b.dataset.act));return sec}
function openLab(n){const ov=$('#labov'),fr=$('#labFrame');fr.src=LAB_SRC+'#act'+n;ov.hidden=false;document.body.classList.add('locked');$('#labClose').focus()}
function closeLab(){$('#labov').hidden=true;document.body.classList.remove('locked')}
$('#labClose').onclick=closeLab;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#labov').hidden)closeLab()});

/* ───────── 몇 층 건물? 층으로 나누어 세기 ───────── */
function floorInfo(m){
  const zs=m.V.map(v=>v[2]).sort((a,b)=>a-b),lv=[];zs.forEach(z=>{if(!lv.length||z-lv[lv.length-1]>1e-4)lv.push(z)});
  const fi=m.V.map(v=>lv.findIndex(l=>Math.abs(l-v[2])<=1e-4));const top=lv.length-1;
  const G={v:[],e:[],f:[]};
  const add=(kind,key,label,z,id,floors)=>{let g=G[kind].find(g=>g.key===key);if(!g){g={key,label,z,floors,ids:[]};G[kind].push(g)}g.ids.push(id)};
  m.V.forEach((v,i)=>add('v','v'+fi[i],`${fi[i]+1}층`,lv[fi[i]],i,[fi[i]]));
  m.E.forEach(e=>{const a=fi[e.a],b=fi[e.b];if(a===b)add('e','in'+a,`${a+1}층 안`,lv[a],e.k,[a]);
    else{const lo=Math.min(a,b),hi=Math.max(a,b);add('e','bt'+lo+'-'+hi,`${lo+1}층과 ${hi+1}층 사이`,(lv[lo]+lv[hi])/2,e.k,[lo,hi])}});
  m.F.forEach((f,i)=>{const fs=f.map(k=>fi[k]),lo=Math.min(...fs),hi=Math.max(...fs);
    if(lo===hi)add('f','fl'+lo,lo===top?'지붕':lo===0?'바닥':`${lo+1}층 바닥`,lv[lo]+(lo===top?1e-3:-1e-3),i,[lo]);
    else add('f','w'+lo+'-'+hi,'벽',(lv[lo]+lv[hi])/2,i,range(hi-lo+1).map(q=>lo+q))});
  const walls=G.f.filter(g=>g.key[0]==='w');if(walls.length>1)walls.forEach(g=>{g.label=`벽 (${g.floors[0]+1}~${g.floors[g.floors.length-1]+1}층)`});
  ['v','e','f'].forEach(k=>G[k].sort((a,b)=>b.z-a.z));
  return{lv,fi,G,n:lv.length}}
const KIND_NM={v:'꼭짓점',e:'모서리',f:'면'};
const DIGIT_JONG={'0':21,'1':8,'2':0,'3':16,'4':0,'5':0,'6':1,'7':8,'8':8,'9':0};
function jong(w){const ch=String(w).slice(-1);if(ch in DIGIT_JONG)return DIGIT_JONG[ch];const c=ch.charCodeAt(0)-0xAC00;return(c>=0&&c<11172)?c%28:0}
function josa(w,a,b){return w+(jong(w)?a:b)}
function josaRo(w){const j=jong(w);return w+((j&&j!==8)?'으로':'로')}
const KIND_TIP={v:'같은 높이에 있는 꼭짓점끼리 한 층이에요.',e:'층 안 모서리는 바닥 둘레, 층 사이 모서리는 층과 층을 잇는 기둥이나 계단이에요.',f:'지붕과 바닥, 그리고 옆을 둘러싼 벽으로 나누어 세요.'};
const DONE_COL={v:'#7d9fe0',e:'rgba(125,159,224,.75)',f:'#d7e3fb'};
function floorActivity(host,keys,opt={}){
  host.innerHTML=`<div class="explore"><div class="stage"><canvas id="flCv" aria-label="층으로 나누어 셀 입체도형"></canvas><span class="hint">끌어서 돌리고, 눌러서 표시해요</span></div>
    <div class="ctrl">
      <div><span class="cap">입체도형</span><div class="chips" id="flShapes">${keys.map((k,i)=>`<button type="button" class="chip ${i===0?'on':''}" data-k="${k}">${SOLIDS[k].name}${['oct','ico','dod'].includes(k)?' <small>도전</small>':''}</button>`).join('')}</div></div>
      <ol class="flsteps" id="flSteps"></ol>
      <div class="fltask" id="flTask"></div>
      <div id="flBody"></div>
      <div class="fleq" id="flEq"></div>
      <div class="flSpread"><button type="button" class="btn ghost" id="flGap" aria-pressed="false">층별로 떼어 보기</button><small id="flGapNote"></small></div>
    </div></div>`;
  const PH=['floors','v','e','f','done'];
  const S={key:keys[0],base:null,info:null,ph:'floors',gi:0,found:{v:new Set(),e:new Set(),f:new Set()},doneG:{v:[],e:[],f:[]},gap:0,showFloors:false,msg:''};
  const v=new Viewer($('#flCv',host),{pad:0.34,yaw:-0.5,pitch:0.32,draw:(ctx,vw)=>drawAll(ctx,vw)});
  /* 층별로 떼어 보기: 층 사이를 같은 간격으로 크게 벌림 (gap 0→1 애니메이션) */
  const spD=()=>{const I=S.info,R=S.base.R;return I.n<2?0:Math.min(1.5*R,Math.max(1.2*R,2.6*R/(I.n-1)))};
  const lvZ=f=>{const I=S.info;return(1-S.gap)*I.lv[f]+S.gap*(I.lv[0]+f*spD())};
  const disp=()=>{const I=S.info;const V=S.base.V.map((p,i)=>[p[0],p[1],p[2]-I.lv[I.fi[i]]+lvZ(I.fi[i])]);return Object.assign({},S.base,{V})};
  const setScene=()=>{const m=disp(),I=S.info;const zmin=I.lv[0],zmax=Math.max(I.lv[I.n-1],I.lv[0]+(I.n-1)*spD());v.setScene([{mesh:m}],{center:[0,0,(zmax+zmin)/2],R:Math.max(S.base.R,(zmax-zmin)/2+0.2)*1.08});v.marks={f:new Set(),e:new Set(),v:new Set()};v.dirty=true};
  let spAnim=null;function spreadTo(t){const t0=S.gap,st=performance.now(),ms=reduced?1:480;cancelAnimationFrame(spAnim);
    const step=now=>{const k=Math.min(1,(now-st)/ms),e=k*k*(3-2*k);S.gap=t0+(t-t0)*e;setScene();if(k<1)spAnim=requestAnimationFrame(step)};spAnim=requestAnimationFrame(step);
    if(t>0&&v.pitch<0.45)v.flyTo(v.yaw,0.5,480);syncSpread()}
  function syncSpread(){const b=$('#flGap',host),on=S.spread;b.setAttribute('aria-pressed',on);b.classList.toggle('on',on);b.textContent=on?'원래 모양으로':'층별로 떼어 보기';
    b.disabled=S.ph==='f';$('#flGapNote',host).textContent=S.ph==='f'?'면은 원래 모양에서 세요.':on?'층 사이를 같은 간격으로 벌렸어요. 점선은 층과 층을 잇는 모서리예요.':''}
  const groupOfId=(kind,id)=>S.info.G[kind].findIndex(g=>g.ids.includes(id));
  v.vcol=i=>{if(S.ph==='floors')return null;if(S.found.v.has(i))return S.ph==='v'&&groupOfId('v',i)===S.gi?HI:DONE_COL.v;return null};
  v.ecol=k=>{if(S.found.e.has(k))return S.ph==='e'&&groupOfId('e',k)===S.gi?'rgba(255,210,40,.95)':DONE_COL.e;return null};
  v.fcol=i=>{if(S.found.f.has(i))return S.ph==='f'&&groupOfId('f',i)===S.gi?HI:DONE_COL.f;return null};
  v.onHit=(kind,id)=>{if(kind!==S.ph)return;const G=S.info.G[kind],g=G[S.gi];const gi=groupOfId(kind,id);
    if(gi===S.gi){toggle(S.found[kind],id);S.msg='';const n=g.ids.filter(x=>S.found[kind].has(x)).length;
      if(n===g.ids.length){S.doneG[kind].push(g.ids.length);S.msg=`<span class="ok">${g.label} ${KIND_NM[kind]} ${g.ids.length}개!</span>`;S.gi++;
        if(S.gi>=G.length){S.msg=`<span class="ok">${josa(KIND_NM[kind],'을','를')} 모두 셌어요.</span>`}render()}else render()}
    else if(S.doneG[kind].length>gi)S.msg='이미 센 층이에요.';
    else S.msg=`그건 <b>${G[gi].label}</b>의 ${KIND_NM[kind]}이에요. 지금은 <b>${g.label}</b>의 ${josa(KIND_NM[kind],'을','를')} 세요.`;
    if(gi!==S.gi)renderMsg()};
  function drawAll(ctx,vw){
    if(!S.info||!vw.scene.length)return;const m=vw.scene[0].mesh;const g=S.gap*0.45;const I=S.info;
    const act=S.ph!=='floors'&&S.ph!=='done'&&I.G[S.ph][S.gi]?I.G[S.ph][S.gi].floors:[];
    const plates=I.lv.map((z,f)=>{const ids=I.G.v.find(q=>q.key==='v'+f).ids;let cx=0,cy=0;ids.forEach(i=>{cx+=S.base.V[i][0];cy+=S.base.V[i][1]});cx/=ids.length;cy/=ids.length;
      const r=Math.max(0.28,...ids.map(i=>Math.hypot(S.base.V[i][0]-cx,S.base.V[i][1]-cy)))*1.18+0.18;
      const pts=range(40).map(q=>vw.proj([cx+r*Math.cos(TAU*q/40),cy+r*Math.sin(TAU*q/40),lvZ(f)]));return{f,pts}});
    const exploded=S.gap>0.02;
    if(S.showFloors||exploded)plates.forEach(({f,pts})=>{const on=act.includes(f);ctx.beginPath();pts.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
      ctx.fillStyle=on?'rgba(255,226,102,.45)':'rgba(42,77,158,.07)';ctx.fill();ctx.setLineDash([5,4]);ctx.strokeStyle=on?'rgba(200,150,0,.8)':'rgba(42,77,158,.35)';ctx.lineWidth=1.4;ctx.stroke();ctx.setLineDash([])});
    if(exploded)drawExploded(ctx,vw,m,S.gap);else vw.drawMesh(m);
    if(S.showFloors||exploded)plates.forEach(({f,pts})=>{const L=pts.reduce((a,p)=>p[0]<a[0]?p:a,pts[0]);ktext(ctx,`${f+1}층`,L[0]-8,L[1],{align:'right',bold:true,size:16,color:act.includes(f)?'#8a6300':'#2a4d9e'})});
  }
  /* 떼어 본 모양: 면은 옅게, 층 안 모서리는 굵게, 층 사이 모서리는 점선, 꼭짓점은 모두 보이게 */
  function drawExploded(ctx,vw,m,t){const I=S.info,P=m.V.map(p=>vw.proj(p)),fa=Math.max(0,0.55*(1-t*1.6));
    if(fa>0){ctx.globalAlpha=fa;vw.drawMesh(m);ctx.globalAlpha=1}
    const same=e=>I.fi[e.a]===I.fi[e.b];
    m.E.forEach(e=>{if(same(e))return;const A=P[e.a],B=P[e.b],c=v.ecol(e.k);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);
      if(c){ctx.strokeStyle=c;ctx.lineWidth=5;ctx.setLineDash([])}else{ctx.strokeStyle='rgba(29,38,64,.45)';ctx.lineWidth=1.6;ctx.setLineDash([6,5])}ctx.stroke();ctx.setLineDash([])});
    m.E.forEach(e=>{if(!same(e))return;const A=P[e.a],B=P[e.b],c=v.ecol(e.k);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.strokeStyle=c||'#1d2640';ctx.lineWidth=c?5:2.4;ctx.stroke()});
    P.forEach((p,i)=>{const c=v.vcol(i);ctx.beginPath();ctx.arc(p[0],p[1],c?8.5:6,0,TAU);ctx.fillStyle=c||'#1d2640';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke()})}
  function eqLine(kind){const G=S.info.G[kind];const parts=G.map((g,i)=>i<S.doneG[kind].length?S.doneG[kind][i]:'?');const done=S.doneG[kind].length===G.length;
    return `<div class="${kind===S.ph?'cur':''}"><b>${KIND_NM[kind]}</b> = <span class="rm">${parts.join(' + ')}${done?' = '+parts.reduce((a,b)=>a+b,0):''}</span></div>`}
  function renderMsg(){const mb=$('#flMsg',host);if(mb)mb.innerHTML=S.msg}
  function render(){
    v.mode=S.ph==='floors'?'v':S.ph==='done'?null:S.ph;v.dirty=true;
    if(S.ph==='f'&&S.spread){S.spread=false;spreadTo(0)}syncSpread();
    const idx=PH.indexOf(S.ph);
    $('#flSteps',host).innerHTML=['몇 층?','꼭짓점','모서리','면'].map((t,i)=>`<li class="${i<idx?'done':i===idx?'on':''}">${t}</li>`).join('');
    const I=S.info,body=$('#flBody',host),task=$('#flTask',host);
    if(S.ph==='floors'){task.innerHTML='이 입체도형은 <b>몇 층 건물</b>인가요?<small>같은 높이에 있는 꼭짓점끼리 한 층이에요. 돌려서 옆에서 보면 잘 보여요.</small>';
      body.innerHTML=`<div class="choices">${[2,3,4,5].map(n=>`<button type="button" data-n="${n}">${n}층</button>`).join('')}</div><div id="flMsg" class="flmsg">${S.msg}</div>`;
      $$('button',body).forEach(b=>b.onclick=()=>{if(+b.dataset.n===I.n){S.showFloors=true;S.ph='v';S.gi=0;S.msg=`<span class="ok">맞아요! ${I.n}층 건물이에요. 아래부터 1층, 2층…</span>`;render()}else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);S.msg='옆에서 보이게 돌려 보세요. 꼭짓점이 몇 가지 높이에 있나요?';renderMsg()}})}
    else if(S.ph==='done'){task.innerHTML=`<b>${SOLIDS[S.key].name}</b>의 꼭짓점, 모서리, 면을 모두 셌어요!`;if(opt.onDone&&!S.reported){S.reported=true;opt.onDone(S.key)}
      const F=I.G.f.reduce((a,g)=>a+g.ids.length,0);let name='';
      if(I.n===2){const c=I.G.v.map(g=>g.ids.length);const rad=f=>{const ids=I.G.v.find(q=>q.key==='v'+f).ids;return Math.max(...ids.map(i=>Math.hypot(S.base.V[i][0],S.base.V[i][1])))};
        name=c[0]===1?'2층 건물인데 꼭대기 층이 점 하나 → <b>뿔</b>':Math.abs(rad(0)-rad(1))<1e-3?'2층 건물이고 두 층의 크기가 같아요 → <b>기둥</b>':'2층 건물이고 위층이 더 작아요 → <b>뿔대</b>'}
      body.innerHTML=`<div class="feedback ok">면이 ${F}개이니 <b>${kn(F)}면체</b>예요.${name?'<br>'+name:''}</div><div class="next-row" style="justify-content:flex-start"><button type="button" class="btn" id="flAgain">다시 세기</button><button type="button" class="btn primary" id="flNext">다른 도형 세기 →</button></div>`;
      $('#flAgain',host).onclick=()=>load(S.key);
      $('#flNext',host).onclick=()=>{const i=keys.indexOf(S.key);pickShape(keys[(i+1)%keys.length])}}
    else{const G=I.G[S.ph];
      if(S.gi>=G.length){task.innerHTML=`<b>${josa(KIND_NM[S.ph],'을','를')}</b> 모두 셌어요.`;const nx=PH[idx+1];
        body.innerHTML=`<div id="flMsg" class="flmsg">${S.msg}</div><button type="button" class="btn primary" id="flGo">${nx==='done'?'결과 보기':KIND_NM[nx]+' 세러 가기'} →</button>`;
        $('#flGo',host).onclick=()=>{S.ph=nx;S.gi=0;S.msg='';render()}}
      else{const g=G[S.gi];const n=g.ids.filter(x=>S.found[S.ph].has(x)).length;
        task.innerHTML=`<b class="hl">${g.label}</b>의 ${josa(KIND_NM[S.ph],'을','를')} 모두 눌러 보세요.<small>${KIND_TIP[S.ph]}</small>`;
        body.innerHTML=`<div class="counter">찾은 개수: <b>${n}</b>개</div><div id="flMsg" class="flmsg">${S.msg}</div>`}}
    $('#flEq',host).innerHTML=['v','e','f'].filter(k=>PH.indexOf(k)<=idx).map(eqLine).join('');
  }
  function load(k){S.key=k;S.reported=false;S.base=SOLIDS[k].mk();S.info=floorInfo(S.base);S.ph='floors';S.gi=0;S.found={v:new Set(),e:new Set(),f:new Set()};S.doneG={v:[],e:[],f:[]};S.showFloors=false;S.msg='';S.spread=false;S.gap=0;
    v.userMoved=false;v.yaw=-0.5;v.pitch=k==='dod'||k==='ico'?0.22:0.3;setScene();render()}
  function pickShape(k){$$('#flShapes .chip',host).forEach(x=>x.classList.toggle('on',x.dataset.k===k));load(k)}
  $$('#flShapes .chip',host).forEach(b=>b.onclick=()=>pickShape(b.dataset.k));
  $('#flGap',host).onclick=()=>{S.spread=!S.spread;spreadTo(S.spread?1:0)};
  load(keys[0]);
}


/* ───────── 면의 모양 찾기 (1단계: 어떤 다각형으로 이루어졌나) ───────── */
const v3={sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],len:a=>Math.hypot(a[0],a[1],a[2])};
function face2D(m,fi){const P=m.F[fi].map(i=>m.V[i]),n=m.N[fi];const u0=v3.sub(P[1],P[0]),ul=v3.len(u0),u=u0.map(x=>x/ul),w=v3.cross(n,u);
  return P.map(p=>{const d=v3.sub(p,P[0]);return[v3.dot(d,u),v3.dot(d,w)]})}
function polyInfo(pts){const n=pts.length,L=[],A=[],D=[];
  for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];L.push(Math.hypot(b[0]-a[0],b[1]-a[1]));D.push([b[0]-a[0],b[1]-a[1]])}
  for(let i=0;i<n;i++){const p=D[(i+n-1)%n],q=D[i];const ang=Math.PI-Math.acos(Math.max(-1,Math.min(1,(p[0]*q[0]+p[1]*q[1])/(Math.hypot(...p)*Math.hypot(...q)))));A.push(ang)}
  const mx=Math.max(...L),tol=1e-3*mx,eq=(x,y)=>Math.abs(x-y)<tol,eqL=L.every(x=>eq(x,L[0])),eqA=A.every(a=>Math.abs(a-A[0])<1e-3);
  const par=(i,j)=>{const a=D[i],b=D[j];return Math.abs(a[0]*b[1]-a[1]*b[0])<1e-3*Math.hypot(...a)*Math.hypot(...b)};
  const right=A.some(a=>Math.abs(a-Math.PI/2)<1e-3),allRight=A.every(a=>Math.abs(a-Math.PI/2)<1e-3);
  return{n,L,A,eqL,eqA,right,allRight,iso:n===3&&(eq(L[0],L[1])||eq(L[1],L[2])||eq(L[0],L[2])),p02:n===4&&par(0,2),p13:n===4&&par(1,3)}}
const SHAPE_NAMES=['정삼각형','이등변삼각형','직각삼각형','정사각형','직사각형','평행사변형','사다리꼴','정오각형','오각형','정육각형','육각형'];
function shapeTrue(name,I){switch(name){
  case'정삼각형':return I.n===3&&I.eqL;case'이등변삼각형':return I.n===3&&I.iso;case'직각삼각형':return I.n===3&&I.right;
  case'정사각형':return I.n===4&&I.allRight&&I.eqL;case'직사각형':return I.n===4&&I.allRight;case'평행사변형':return I.n===4&&I.p02&&I.p13;
  case'사다리꼴':return I.n===4&&(I.p02||I.p13);case'정오각형':return I.n===5&&I.eqL&&I.eqA;case'오각형':return I.n===5;
  case'정육각형':return I.n===6&&I.eqL&&I.eqA;case'육각형':return I.n===6}return false}
function shapeName(I){const order={3:['정삼각형','직각삼각형','이등변삼각형'],4:['정사각형','직사각형','평행사변형','사다리꼴'],5:['정오각형','오각형'],6:['정육각형','육각형']}[I.n]||[];
  return order.find(nm=>shapeTrue(nm,I))||({3:'삼각형',4:'사각형'}[I.n]||kn(I.n)+'각형')}
function shapeChoices(ans,I,r){const fam={3:['정삼각형','이등변삼각형','직각삼각형'],4:['정사각형','직사각형','평행사변형','사다리꼴'],5:['정오각형','오각형'],6:['정육각형','육각형']};
  const same=shuffle(r,(fam[I.n]||[]).filter(nm=>nm!==ans&&!shapeTrue(nm,I)));
  const other=shuffle(r,SHAPE_NAMES.filter(nm=>!shapeTrue(nm,I)&&!(fam[I.n]||[]).includes(nm)&&(nm.startsWith('정')||nm==='사다리꼴'||nm==='직사각형')));
  const pick3=[...same.slice(0,2),...other].slice(0,3);return shuffle(r,[ans,...pick3])}
const SHAPE_HINT={3:'변이 3개예요. 세 변의 길이를 비교해 보세요. 모두 같으면 정삼각형, 두 변만 같으면 이등변삼각형이에요.',
  4:'변이 4개예요. 네 각이 모두 직각인지, 마주 보는 변이 평행한지 살펴보세요.',5:'변이 5개예요. 변의 길이가 모두 같은지 보세요.',6:'변이 6개예요. 변의 길이가 모두 같은지 보세요.'};
const SOLID_KIND={cube:'cube',p3:'prism',p5:'prism',p6:'prism',y4:'pyramid',y6:'pyramid',f4:'frustum',f5:'frustum',oct:'regular',ico:'regular',dod:'regular'};
function shapeIcon(pts,size=46,col='#fff6c7'){const cv=document.createElement('canvas');const d=window.devicePixelRatio||1;cv.width=size*d;cv.height=size*d;cv.style.width=size+'px';cv.style.height=size+'px';
  const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;pts.forEach(([x,y])=>{mnx=Math.min(mnx,x);mny=Math.min(mny,y);mxx=Math.max(mxx,x);mxy=Math.max(mxy,y)});
  const sc=(size-8)/Math.max(mxx-mnx,mxy-mny),ox=(size-(mxx-mnx)*sc)/2,oy=(size-(mxy-mny)*sc)/2;c.beginPath();pts.forEach(([x,y],i)=>{const X=ox+(x-mnx)*sc,Y=size-(oy+(y-mny)*sc);i?c.lineTo(X,Y):c.moveTo(X,Y)});c.closePath();
  c.fillStyle=col;c.fill();c.lineWidth=2;c.lineJoin='round';c.strokeStyle='#151a28';c.stroke();return cv}
function faceOnAngles(n,curYaw){const r=Math.hypot(n[0],n[1]);return{yaw:r<1e-6?curYaw:Math.atan2(-n[0],-n[1]),pitch:Math.atan2(n[2],r)}}
function faceActivity(host,keys,opt={}){
  host.innerHTML=`<div class="explore"><div class="stage"><canvas class="faCv" aria-label="면의 모양을 찾을 입체도형"></canvas><span class="hint">끌어서 돌리고, 면을 눌러요</span></div>
    <div class="ctrl">
      <div><span class="cap">입체도형</span><div class="chips faShapes">${keys.map((k,i)=>`<button type="button" class="chip ${i===0?'on':''}" data-k="${k}">${SOLIDS[k].name}${['oct','ico','dod'].includes(k)?' <small>도전</small>':''}</button>`).join('')}</div></div>
      <div class="fltask faTask"></div>
      <div class="faBody"></div>
      <div class="falist" aria-label="면 목록"></div>
    </div></div>`;
  const S={key:keys[0],m:null,info:[],groups:{},order:[],found:new Set(),cur:null,sel:null,ph:'pick',msg:'',tries:0};
  const v=new Viewer($('.faCv',host),{pad:0.36,yaw:-0.5,pitch:0.32,draw:(ctx,vw)=>{if(!S.m)return;vw.drawMesh(S.m);
    if(S.ph==='ask'&&S.sel!=null&&S.tries>0){const P=S.m.F[S.sel].map(i=>vw.proj(S.m.V[i]));P.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],11,0,TAU);ctx.fillStyle='#1d2640';ctx.fill();ktext(ctx,String(i+1),p[0],p[1]+1,{size:12,bold:true,color:'#fff',halo:false})})}}});
  v.mode='f';
  const colorOf=nm=>FC[S.order.indexOf(nm)%5];
  v.fcol=i=>{if(i===S.sel&&S.ph==='ask')return HI;if(!S.found.has(i))return null;const nm=S.info[i].name;return nm===S.cur&&S.ph==='collect'?HI:colorOf(nm)};
  v.onHit=(kind,fi)=>{if(kind!=='f')return;
    if(S.ph==='pick'){if(S.found.has(fi)){S.msg='이미 면 목록에 넣은 면이에요. 아직 칠해지지 않은 면을 골라 보세요.';renderMsg();return}
      S.sel=fi;S.ph='ask';S.tries=0;S.msg='';const a=faceOnAngles(S.m.N[fi],v.yaw);v.flyTo(a.yaw,a.pitch);render()}
    else if(S.ph==='collect'){const nm=S.info[fi].name;
      if(S.found.has(fi)){S.msg=nm===S.cur?'이미 센 면이에요.':'이미 면 목록에 넣은 면이에요.';renderMsg();return}
      if(nm!==S.cur){S.msg=`그 면은 ${josa(S.cur,'이','가')} 아니에요. 돌려서 다른 면을 찾아보세요.`;renderMsg();return}
      S.found.add(fi);S.msg='';const g=S.groups[S.cur];const k=g.filter(x=>S.found.has(x)).length;
      if(k===g.length)finishGroup();else render()}};
  function finishGroup(){const g=S.groups[S.cur];S.msg=`<span class="ok">${S.cur} ${g.length}개를 면 목록에 넣었어요.</span>`;S.cur=null;
    if(S.found.size===S.m.F.length){S.ph='done';if(opt.onDone)opt.onDone(S.key)}else{S.ph='pick';v.flyTo(-0.5,0.32)}render()}
  function renderMsg(){const mb=$('.faMsg',host);if(mb)mb.innerHTML=S.msg}
  function listHTML(){const items=S.order.map(nm=>{const g=S.groups[nm],k=g.filter(x=>S.found.has(x)).length,done=k===g.length;
      return`<li class="${nm===S.cur?'cur':''}"><span class="ico" data-nm="${nm}"></span><b>${nm}</b><span class="rm cnt">${done?k+'개':k+'개 …'}</span></li>`}).join('');
    const total=S.found.size;return S.order.length?`<div class="cap">면 목록</div><ul>${items}</ul>`:`<div class="cap">면 목록</div><p class="muted" style="margin:0;font-size:15px">아직 비어 있어요. 면을 눌러 모양을 찾으면 여기에 쌓여요.</p>`}
  function render(){v.dirty=true;const task=$('.faTask',host),body=$('.faBody',host);
    if(S.ph==='pick'){task.innerHTML=`아직 칠해지지 않은 <b class="hl">면을 하나</b> 눌러 보세요.<small>${S.found.size?'뒤쪽이나 아래쪽에 숨은 면도 있어요. 돌려서 찾아보세요.':'누르면 그 면이 정면으로 돌아와서 실제 모양을 보여 줘요.'}</small>`;body.innerHTML=`<div class="flmsg faMsg">${S.msg}</div>`}
    else if(S.ph==='ask'){const I=S.info[S.sel],r=mulberry(S.sel*31+S.key.length*7);
      task.innerHTML=`노랗게 칠한 면이 <b>정면</b>으로 돌아왔어요. 이 면의 <b class="hl">실제 모양</b>은?<small>비스듬히 볼 때와 정면에서 볼 때 모양이 어떻게 다른지도 살펴보세요.</small>`;
      body.innerHTML=`<div class="choices faCh">${shapeChoices(I.name,I.poly,r).map(c=>`<button type="button">${c}</button>`).join('')}</div><div class="flmsg faMsg">${S.msg}</div>`;
      $$('.faCh button',body).forEach(b=>b.onclick=()=>{if(b.textContent===I.name){S.cur=I.name;if(!S.order.includes(I.name))S.order.push(I.name);S.found.add(S.sel);S.sel=null;S.ph='collect';S.msg=`<span class="ok">맞아요, ${I.name}!</span>`;
          const g=S.groups[S.cur];if(g.filter(x=>S.found.has(x)).length===g.length)finishGroup();else{v.flyTo(-0.5,0.32);render()}}
        else{S.tries++;b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);S.msg=`꼭짓점에 번호를 붙였어요. ${SHAPE_HINT[I.poly.n]||''}<br>${({3:[T('정삼각형'),T('이등변삼각형')],4:[T('정사각형'),T('직사각형'),T('사다리꼴')]}[I.poly.n]||[T('정다각형')]).join(' · ')}`;renderMsg();v.dirty=true}})}
    else if(S.ph==='collect'){const g=S.groups[S.cur],k=g.filter(x=>S.found.has(x)).length;
      task.innerHTML=`<b class="hl">${S.cur}</b>인 면을 모두 찾아 눌러 보세요.<small>같은 모양이면 크기가 달라도 같은 이름이에요. 찾은 개수: ${k}개</small>`;body.innerHTML=`<div class="flmsg faMsg">${S.msg}</div>`}
    else{const parts=S.order.map(nm=>`${nm} ${S.groups[nm].length}개`);const F=S.m.F.length;const kind=SOLID_KIND[S.key];
      const side=S.order.find(nm=>S.m.base&&S.groups[nm].some(fi=>!S.m.base.includes(fi)));
      const insight={prism:`옆면이 모두 ${side} → <b>각기둥</b>`,pyramid:`옆면이 모두 ${side} → <b>각뿔</b>`,frustum:`옆면이 모두 ${side} → <b>각뿔대</b>`,
        cube:'모든 면이 합동인 정사각형 → <b>정육면체</b> (사각기둥이기도 해요)',regular:`모든 면이 합동인 ${S.order[0]} → <b>정다면체</b>로 이어져요`}[kind]||'';
      task.innerHTML=`<b>${SOLIDS[S.key].name}</b>의 면 목록을 완성했어요!`;
      body.innerHTML=`<div class="feedback ok"><span class="rm">${parts.join(' + ')}</span><br>= 면 <b>${F}</b>개 → <b>${kn(F)}면체</b>${insight?'<br>'+insight:''}</div>
        <div class="next-row" style="justify-content:flex-start"><button type="button" class="btn faAgain">다시 하기</button><button type="button" class="btn primary faNext">다른 도형 →</button></div>
        <div class="dupbox"><button type="button" class="btn ghost faDup">응용 도전 · 면 목록으로 모서리 세기</button><div class="dupHost"></div></div>`;
      $('.faAgain',host).onclick=()=>load(S.key);$('.faNext',host).onclick=()=>{const i=keys.indexOf(S.key);pickShape(keys[(i+1)%keys.length])};
      $('.faDup',host).onclick=e=>{e.target.remove();dupChallenge($('.dupHost',host),S.m,S.order.map(nm=>({nm,k:S.groups[nm].length,n:S.info[S.groups[nm][0]].poly.n})),S.key)}}
    const L=$('.falist',host);L.innerHTML=listHTML();$$('.ico',L).forEach(sp=>{const nm=sp.dataset.nm,fi=S.groups[nm][0];sp.appendChild(shapeIcon(face2D(S.m,fi),40,colorOf(nm)))})}
  function load(k){S.key=k;S.m=SOLIDS[k].mk();S.info=S.m.F.map((f,i)=>{const pts=face2D(S.m,i),I=polyInfo(pts);return{pts,poly:I,name:shapeName(I)}});
    S.groups={};S.info.forEach((x,i)=>{(S.groups[x.name]=S.groups[x.name]||[]).push(i)});S.order=[];S.found=new Set();S.cur=null;S.sel=null;S.ph='pick';S.msg='';S.tries=0;
    v.anim=null;v.userMoved=false;v.yaw=-0.5;v.pitch=0.32;v.setScene([{mesh:S.m,st:{tint:[226,234,248]}}]);render()}
  function pickShape(k){$$('.faShapes .chip',host).forEach(x=>x.classList.toggle('on',x.dataset.k===k));load(k)}
  $$('.faShapes .chip',host).forEach(b=>b.onclick=()=>pickShape(b.dataset.k));
  load(keys[0]);
}

/* 응용: 면 목록에서 모서리·꼭짓점 구하기 (두 면이 모서리 하나를 함께 쓴다) */
function dupChallenge(host,m,list,key){
  const sum=list.reduce((a,x)=>a+x.n*x.k,0),E=m.E.length,Vn=m.V.length;
  const deg=m.V.map((_,i)=>m.F.filter(f=>f.includes(i)).length),uni=deg.every(d=>d===deg[0]);
  const parts=list.map(x=>`${x.nm} ${x.k}개 → <span class="rm">${x.n} × ${x.k} = ${x.n*x.k}</span>`).join('<br>');
  const steps=[{q:`면 목록에 있는 다각형의 <b>변</b>을 모두 더하면 몇 개인가요?`,type:'num',ans:sum,suffix:'개',hint:parts,ok:`변을 모두 더하면 ${sum}개`},
    {q:`모서리 하나에는 면 <b>두 개</b>가 붙어 있어요. 그래서 변을 셀 때 모서리마다 두 번씩 셌어요. 모서리는 몇 개인가요?`,type:'num',ans:E,suffix:'개',hint:`(변의 합) ÷ 2 = ${sum} ÷ 2`,ok:`${sum} ÷ 2 = ${E}`}];
  if(uni)steps.push({q:`꼭짓점 하나에는 면이 <b>${deg[0]}개</b>씩 모여요. 다각형의 꼭짓점을 모두 더하면 ${sum}개예요. 꼭짓점은 몇 개인가요?`,type:'num',ans:Vn,suffix:'개',hint:`${sum} ÷ ${deg[0]}`,ok:`${sum} ÷ ${deg[0]} = ${Vn}`});
  renderProblem(host,{title:'면 목록만 보고 모서리'+(uni?'와 꼭짓점':'')+'의 개수를 구해 보세요.',fig:null,steps},{mode:'steps',onDone:({good,box})=>{
    box.insertAdjacentHTML('afterbegin',`<span style="flex-basis:100%">${uni?'층으로 나누어 센 결과와 같은지 확인해 보세요.':'각뿔은 꼭대기 꼭짓점에만 면이 많이 모여서, 꼭짓점은 층으로 세는 편이 쉬워요.'}</span>`);if(good)award(3,'dup:'+key)}});
}

/* ───────── 면은 몇 개까지 줄일 수 있을까? ───────── */
function reduceActivity(host,onDone){
  host.innerHTML=`<div class="explore"><div class="stage"><canvas class="rdCv" aria-label="면의 개수를 줄여 보는 그림"></canvas><span class="hint">끌어서 돌려 보세요</span></div>
    <div class="ctrl"><div><span class="cap">면을 몇 개 이어 붙일까요?</span><div class="seg rdSeg"><button type="button" data-n="2">면 2개</button><button type="button" data-n="3">면 3개</button><button type="button" data-n="4">면 4개</button></div></div>
      <div class="feedback info rdTxt"></div><p class="muted" style="margin:0;font-size:15px">진한 색은 면의 <b>안쪽</b>이에요. 안쪽이 보인다는 건 어딘가 뚫려 있다는 뜻이에요.</p></div></div>`;
  const P=regPoly(3,1.2),H=1.75;const base=pyramid(P,H);const V=base.V,cen=base.c;
  const S={n:3,th:0,target:0,reported:false};
  const TXT={2:'면 2개는 책처럼 펼쳐질 뿐이에요. 안쪽 공간을 둘러싸지 못해요.',3:'면 3개를 이어 붙이면 아래가 뚫린 텐트가 돼요. 아래에서 올려다보면 속(진한 색)이 다 보여요. 아직 다면체가 아니에요.',
    4:'아래 면을 붙이니 빈틈없이 막혔어요! 면이 4개인 <b>사면체(삼각뿔)</b>가 가장 적은 면으로 만들 수 있는 다면체예요. 그래서 면이 3개인 다면체는 없어요.'};
  const rotBase=p=>{const a=V[0],ax=v3.sub(V[1],a),al=v3.len(ax),u=ax.map(x=>x/al);const d=v3.sub(p,a),k=v3.dot(d,u),par=u.map(x=>x*k),perp=v3.sub(d,par),f=Math.PI-S.th,c=Math.cos(f),s=Math.sin(f),cr=v3.cross(u,perp);
    return[a[0]+par[0]+perp[0]*c-cr[0]*s,a[1]+par[1]+perp[1]*c-cr[1]*s,a[2]+par[2]+perp[2]*c-cr[2]*s]};
  const poly=(ctx,P2,fill,stroke,dash)=>{ctx.beginPath();P2.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.setLineDash(dash||[]);ctx.lineJoin='round';ctx.lineWidth=dash?1.6:2.4;ctx.strokeStyle=stroke;ctx.stroke();ctx.setLineDash([])}};
  const v=new Viewer($('.rdCv',host),{pad:0.36,yaw:-0.5,pitch:-0.62,draw:(ctx,vw)=>{
    const sides=[[0,1,3],[1,2,3],[2,0,3]],polys=sides.slice(0,S.n===2?2:3).map(f=>f.map(i=>V[i]));
    if(S.n<4)poly(ctx,[V[0],V[1],V[2]].map(p=>vw.proj(p)),null,'#7a86a3',[6,5]);
    if(S.n===2)poly(ctx,[V[2],V[0],V[3]].map(p=>vw.proj(p)),null,'#7a86a3',[6,5]);
    if(S.n===4)polys.push([V[0],V[1],rotBase(V[2])]);
    const items=polys.map(pts=>{const Pp=pts.map(p=>vw.proj(p));let n=v3.cross(v3.sub(pts[1],pts[0]),v3.sub(pts[2],pts[0]));const c=pts.reduce((q,p)=>[q[0]+p[0]/3,q[1]+p[1]/3,q[2]+p[2]/3],[0,0,0]);
      if(v3.dot(n,v3.sub(c,cen))<0)n=n.map(x=>-x);const L=v3.len(n);n=n.map(x=>x/L);return{Pp,out:vw.facing(n)>0,d:Pp.reduce((a,p)=>a+p[2],0)/3}}).sort((a,b)=>a.d-b.d);
    items.forEach(({Pp,out})=>poly(ctx,Pp,out?'rgba(219,230,250,.97)':'rgba(112,136,190,.97)','#151a28'));
    if(S.n===3){const C=vw.proj([cen[0],cen[1],0]);chip(ctx,'뚫린 곳',C[0],C[1],{bg:'#fff6c7',border:'#b88a00',size:15})}
    if(S.n===4&&S.th>3.1)chip(ctx,'빈틈없이 막혔어요 → 사면체',vw.w/2,26,{bg:'#e5f4ea',border:'#2b7a4b',color:'#2b7a4b',size:15})}});
  v.setScene([{mesh:base}],{R:1.5,center:[cen[0],cen[1],H*0.32]});
  v.tick=()=>{if(S.n===4&&Math.abs(S.th-S.target)>0.002){S.th+=Math.sign(S.target-S.th)*Math.min(Math.abs(S.target-S.th),reduced?9:0.04);v.dirty=true;if(S.th>3.1&&!S.reported){S.reported=true;onDone&&onDone()}}};
  const set=n=>{S.n=n;$$('.rdSeg button',host).forEach(b=>b.classList.toggle('on',+b.dataset.n===n));$('.rdTxt',host).innerHTML=TXT[n];if(n===4){S.th=0;S.target=Math.PI}v.dirty=true};
  $$('.rdSeg button',host).forEach(b=>b.onclick=()=>set(+b.dataset.n));set(3);
}

/* ───────── 탐구 활동 고르기 ───────── */
function actNav(body,id,acts){
  const p=prog(id);p.acts=p.acts||{};let cur=acts.some(a=>a.key===p.lastAct)?p.lastAct:acts[0].key;
  body.innerHTML=`<div class="actnav" role="tablist" aria-label="탐구 활동">${acts.map((a,i)=>`<button type="button" role="tab" data-k="${a.key}"><span class="an">${p.acts[a.key]?CHECK:i+1}</span><span class="at">${a.t}</span></button>`).join('')}</div><div class="card panel actHost"></div>`;
  const mark=k=>{if(!p.acts[k]){p.acts[k]=true;save()}const b=$(`.actnav button[data-k="${k}"] .an`,body);if(b)b.innerHTML=CHECK;$(`.actnav button[data-k="${k}"]`,body)?.classList.add('done')};
  const show=k=>{cur=k;p.lastAct=k;save();$$('.actnav button',body).forEach(b=>{const on=b.dataset.k===k;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);if(p.acts[b.dataset.k])b.classList.add('done')});
    const i=acts.findIndex(a=>a.key===k),a=acts[i],host=$('.actHost',body);host.innerHTML=`<h2>${a.t}</h2>${a.lead?`<p class="muted">${a.lead}</p>`:''}<div class="actIn"></div>`;
    a.mount($('.actIn',host),()=>mark(k));
    if(i<acts.length-1){const nb=el(`<div class="next-row" style="justify-content:flex-start;margin-top:22px"><button type="button" class="btn">다음 활동: ${acts[i+1].t} →</button></div>`);$('button',nb).onclick=()=>{show(acts[i+1].key);body.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'})};host.appendChild(nb)}};
  $$('.actnav button',body).forEach(b=>b.onclick=()=>show(b.dataset.k));show(cur);
}

/* ───────── 탐구 ───────── */
const EXPLORE={};
EXPLORE.poly=body=>{
  actNav(body,'poly',[
    {key:'cls',t:'다면체일까, 아닐까?',lead:'돌아가는 입체도형을 보고 골라 보세요. 다 고르면 다면체가 아닌 것들의 공통점을 찾아봐요.',mount:(h,done)=>clsActivity(h,done)},
    {key:'face',t:'면의 모양 찾기',lead:'면을 하나 누르면 정면으로 돌아와 실제 모양을 보여 줘요. 모양 이름을 고르고 같은 모양의 면을 모두 찾아 <b>면 목록</b>을 완성해요.',mount:(h,done)=>faceActivity(h,['cube','p3','p5','y4','y6','f4','oct','ico','dod'],{onDone:k=>{done();award(3,'face:'+k)}})},
    {key:'floor',t:'몇 층 건물일까?',lead:'먼저 몇 층 건물인지 찾고, 층마다 꼭짓점 → 모서리 → 면을 눌러 세어요. 다 세면 층별로 더한 식이 완성돼요.',mount:(h,done)=>floorActivity(h,['cube','p3','p5','y4','y6','f4','oct','ico','dod'],{onDone:k=>{done();award(3,'floor:'+k)}})},
    {key:'reduce',t:'면은 몇 개까지 줄일 수 있을까?',lead:'면을 2개, 3개, 4개 이어 붙여 보세요. 공간을 빈틈없이 둘러싸려면 면이 몇 개 있어야 할까요?',mount:(h,done)=>reduceActivity(h,()=>{done();award(2,'reduce')})},
    {key:'lab',t:'더 탐구하기',lead:'수업 시간에 했던 「입체도형 탐구」 활동을 다시 해 볼 수 있어요. 끝까지 하면 결과 화면이 나와요.',mount:(h,done)=>{h.appendChild(labCards([1,3]));done()}}]);
};
function clsActivity(host,done){
  const order=shuffle(mulberry(newSeed()),['cube','cyl','p3','y4','sph','p5','cone','f4','oct','y6']);
  host.innerHTML=`<p style="margin-top:0;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center"><b class="clsScore">0 / ${order.length}</b><span class="cls-key"><i class="kp"></i>다면체</span><span class="cls-key"><i class="kn"></i>다면체가 아님</span><span class="cls-key">○ 맞힘 · ✕ 틀림</span></p><div class="cls-grid">${order.map(k=>`<div class="card cls" data-k="${k}"><canvas></canvas><div class="nm">${SOLIDS[k].name}</div><div class="two"><button type="button" data-a="1">다면체</button><button type="button" data-a="0">아니에요</button></div></div>`).join('')}</div><div class="clsEnd"></div>`;
  let score=0,answered=0;
  $$('.cls',host).forEach(c=>{const v=new Viewer($('canvas',c),{auto:true,pad:0.38,yaw:Math.random()*6,pitch:0.4});v.setMesh(SOLIDS[c.dataset.k].mk());
    $$('button',c).forEach(b=>b.onclick=()=>{const S=SOLIDS[c.dataset.k];const ok=(b.dataset.a==='1')===S.poly;c.classList.add(S.poly?'isP':'notP');c.appendChild(el(`<span class="mk" aria-label="${ok?'맞힘':'틀림'}">${ok?'○':'✕'}</span>`));if(ok)score++;answered++;
      v.setScene([{mesh:v.scene[0].mesh,st:{tint:S.poly?[201,216,245]:[247,214,176]}}]);
      $('.two',c).replaceWith(el(`<div class="why"><b>${S.poly?'다면체':'다면체가 아님'}</b> · ${S.poly?'모든 면이 다각형이에요.':S.why}${ok?'':`<br><small>내가 고른 답: ${b.dataset.a==='1'?'다면체':'아니에요'}</small>`}</div>`));$('.clsScore',host).textContent=`${score} / ${order.length}`;if(answered===order.length)ending()})});
  function ending(){const box=$('.clsEnd',host);box.innerHTML=`<div class="box" style="margin-top:18px"><b>생각 정리</b> · 다면체가 아닌 원기둥, 원뿔, 구의 공통점은 무엇일까요?<div class="choices">${shuffle(mulberry(7),['굽은 면(곡면)이 있다','꼭짓점이 많다','크기가 크다']).map(c=>`<button type="button">${c}</button>`).join('')}</div><div class="clsMsg flmsg" style="margin-top:8px"></div></div>`;
    $$('.choices button',box).forEach(b=>b.onclick=()=>{if(b.textContent.startsWith('굽은')){$('.clsMsg',box).innerHTML=`<span class="ok">맞아요! ${T('곡면')}이 하나라도 있으면 다각형으로만 둘러싸인 게 아니니 다면체가 아니에요.</span>`;done();award(5,'cls')}else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);$('.clsMsg',box).textContent='세 도형의 옆면이나 겉면을 다시 살펴보세요. 평평한가요, 굽었나요?'}})}
}
EXPLORE.types=body=>{
  actNav(body,'types',[
    {key:'face',t:'면 모양으로 이름 짓기',lead:'면 목록을 만들어 보면 옆면의 모양이 보여요. 옆면이 직사각형이면 각기둥, 삼각형이면 각뿔, 사다리꼴이면 각뿔대예요.',mount:(h,done)=>faceActivity(h,['p5','y4','f4','p3','y6','f5'],{onDone:k=>{done();award(3,'face:'+k)}})},
    {key:'rule',t:'n을 바꾸며 규칙 찾기',lead:'밑면의 변의 개수를 늘려 보며 표를 채워 보세요. 표에는 층별로 센 식이 들어가요. 어떤 규칙이 보이나요?',mount:(h,done)=>ruleActivity(h,done)},
    {key:'cut',t:'각뿔을 잘라 각뿔대 만들기',lead:'밑면에 평행한 평면으로 각뿔을 잘라 보세요.',mount:(h,done)=>cutActivity(h,done)},
    {key:'lab',t:'더 탐구하기',lead:'비스듬히 자르면 어떻게 될까요? 각기둥·각뿔·각뿔대가 아닌 도형도 섞여 있어요.',mount:(h,done)=>{h.appendChild(labCards([2,3]));done()}}]);
};
function ruleActivity(host,done){
  host.innerHTML=`<div class="explore"><div class="stage"><canvas class="tyCv"></canvas><span class="hint">끌어서 돌려 보세요</span></div>
    <div class="ctrl">
     <div class="seg tyType"><button type="button" class="on" data-t="prism">각기둥</button><button type="button" data-t="pyramid">각뿔</button><button type="button" data-t="frustum">각뿔대</button></div>
     <div><label class="cap" for="tyN">밑면: <span class="tyNm">삼각형</span></label><input type="range" id="tyN" class="tyN" min="3" max="10" value="3"></div>
     <div class="tablewrap"><table class="t ptable"><thead><tr><th>이름</th><th>면<br><small>지붕+벽+바닥</small></th><th>모서리<br><small>위층·사이·아래층</small></th><th>꼭짓점<br><small>층별</small></th></tr></thead><tbody class="tyBody"></tbody></table></div>
     <div class="tyMsg flmsg"></div>
    </div></div>`;
  const v=new Viewer($('.tyCv',host),{pad:0.40,auto:true});let tp='prism',n=3;const seen={prism:new Set(),pyramid:new Set(),frustum:new Set()};
  const draw=()=>{const Ty=TYPE[tp];v.setMesh(Ty.mk(n));seen[tp].add(n);$('.tyNm',host).textContent=kn(n)+'각형';
    $('.tyBody',host).innerHTML=range(8).map(i=>{const k=i+3,s=seen[tp].has(k);let cells;
      if(s){const I=floorInfo(Ty.mk(k));cells=['f','e','v'].map(q=>{const parts=I.G[q].map(g=>g.ids.length);return`<td><span class="rm">${parts.join('+')}</span> = <b class="rm">${parts.reduce((a,b)=>a+b,0)}</b></td>`}).join('')}
      else cells='<td class="q">?</td>'.repeat(3);
      return`<tr class="${k===n?'cur':''}"><td class="l">${kn(k)}${Ty.nm}</td>${cells}</tr>`}).join('');
    if(seen[tp].size>=5){$('.tyMsg',host).innerHTML=`<span class="ok">${josa(Ty.nm,'을','를')} 5개 이상 살펴봤어요. 밑면의 변이 하나 늘면 모서리는 몇 개씩 늘어나나요?</span>`;done();award(3,'rule:'+tp)}};
  $('.tyN',host).oninput=e=>{n=+e.target.value;draw()};
  $$('.tyType button',host).forEach(b=>b.onclick=()=>{$$('.tyType button',host).forEach(x=>x.classList.toggle('on',x===b));tp=b.dataset.t;$('.tyMsg',host).innerHTML='';draw()});
  draw();
}
function cutActivity(host,done){
  host.innerHTML=`<div class="explore"><div class="stage"><canvas class="cutCv"></canvas><span class="hint">끌어서 돌려 보세요</span></div>
    <div class="ctrl">
     <div><span class="cap">각뿔</span><div class="chips cutN">${[3,4,5,6].map(n=>`<button type="button" class="chip ${n===4?'on':''}" data-n="${n}">${kn(n)}각뿔</button>`).join('')}</div></div>
     <div><label class="cap" for="cutH">자르는 높이</label><input type="range" id="cutH" class="cutH" min="25" max="75" value="50"></div>
     <button type="button" class="btn primary cutGo">잘라서 떼어 내기</button>
     <div class="feedback info cutTxt">밑면에 평행한 평면으로 각뿔을 잘라 보세요.</div></div></div>`;
  let cn=4,k=0.5,sep=0,target=0;const H=1.9;
  const cv=new Viewer($('.cutCv',host),{pad:0.36,yaw:-0.5,pitch:0.32,between:(ctx,vw,i)=>{if(i===0&&sep<0.02){const R0=1.25*(1-k)*1.55;const z=H*k;const Q=[[-R0,-R0,z],[R0,-R0,z],[R0,R0,z],[-R0,R0,z]].map(p=>vw.proj(p));
      ctx.beginPath();Q.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle='rgba(42,77,158,.13)';ctx.fill();ctx.strokeStyle='rgba(42,77,158,.6)';ctx.lineWidth=1.5;ctx.stroke()}}});
  const build=()=>{const P=regPoly(cn,1.25,cn===4?Math.PI/4:undefined);const fr=frustum(P,1-k,H*k);const top=pyramid(P.map(p=>[p[0]*(1-k),p[1]*(1-k)]),H*(1-k));
    cv.setScene([{mesh:fr,st:{}},{mesh:top,off:[0,0,H*k+sep*0.9],st:{tint:[255,240,190]}}],{center:[0,0,H*0.55],R:1.75})};
  cv.tick=()=>{if(Math.abs(sep-target)>0.005){sep+=(target-sep)*0.12;build()}};
  $('.cutH',host).oninput=e=>{k=e.target.value/100;build()};
  const txt=()=>{$('.cutTxt',host).innerHTML=`아래쪽이 <b>${kn(cn)}각뿔대</b>, 위쪽은 작은 ${kn(cn)}각뿔이에요. 각뿔대의 두 밑면은 평행하지만 크기가 달라요. 옆면은 모두 사다리꼴이에요.`};
  $$('.cutN .chip',host).forEach(b=>b.onclick=()=>{$$('.cutN .chip',host).forEach(x=>x.classList.toggle('on',x===b));cn=+b.dataset.n;build();if(target>0)txt()});
  $('.cutGo',host).onclick=()=>{target=target>0?0:1;$('.cutGo',host).textContent=target>0?'다시 붙이기':'잘라서 떼어 내기';if(target>0){txt();done();award(2,'cut')}else $('.cutTxt',host).textContent='밑면에 평행한 평면으로 각뿔을 잘라 보세요.'};
  build();
}
EXPLORE.area=body=>{
  body.innerHTML=`<div class="card panel"><h2>전개도 펼치기</h2><p class="muted">파란 선은 밑면의 둘레예요. 펼치면 이 선이 어디로 가는지 따라가 보세요.</p>
   <div class="explore"><div class="stage"><canvas id="unCv"></canvas><span class="hint">끌어서 돌려 보세요</span></div>
    <div class="ctrl">
     <div class="chips" id="unShape">${Object.entries(UNF).map(([k,s],i)=>`<button type="button" class="chip ${i===0?'on':''}" data-k="${k}">${s.name}</button>`).join('')}</div>
     <div><label class="cap" for="unT">접기 ↔ 펼치기</label><input type="range" id="unT" min="0" max="100" value="0"></div>
     <button type="button" class="btn primary" id="unPlay">펼치기</button>
     <div class="box plain" id="unInfo" style="margin:0"></div></div></div></div>`;
  let key='tri';const U=unfoldViewer($('#unCv'),{shape:UNF[key],areas:true});let target=null;
  const info=()=>{const s=UNF[key],open=U.t>0.97;$('#unInfo').innerHTML=`<p style="margin:0 0 6px">${s.info.replace(/π/g,'<span class="rm">π</span>')}</p><p style="margin:0">옆면의 가로 = 밑면의 둘레<br><b class="rm">${s.perim}</b></p><p style="margin:6px 0 0">옆넓이 = 가로 × 세로(높이)<br><b class="rm">${s.lat}</b></p>`+(open?`<p style="margin:10px 0 0;padding-top:10px;border-top:1px dashed var(--line)"><b>전개도의 넓이를 모두 더하면 = 겉넓이</b><br><span class="rm">${s.areas.sum}</span> (cm²)</p>`:`<p class="muted" style="margin:10px 0 0;font-size:15px">끝까지 펼치면 면마다 넓이가 나타나요.</p>`)};
  const setT=t=>{U.t=t;$('#unT').value=Math.round(t*100);U.v.dirty=true;$('#unPlay').textContent=t>0.5?'다시 접기':'펼치기';if(t>=0.999)award(1,'net:'+key);if((t>0.97)!==U.wasOpen){U.wasOpen=t>0.97;info()}};
  $('#unT').oninput=e=>{target=null;setT(e.target.value/100)};
  U.v.tick=()=>{if(target!=null){const d=target-U.t;if(Math.abs(d)<0.004){setT(target);target=null}else setT(U.t+Math.sign(d)*Math.min(Math.abs(d),0.012))}};
  $('#unPlay').onclick=()=>{target=U.t>0.5?0:1;if(reduced){setT(target);target=null}};
  $$('#unShape .chip').forEach(b=>b.onclick=()=>{$$('#unShape .chip').forEach(x=>x.classList.toggle('on',x===b));key=b.dataset.k;U.v.userMoved=false;U.set(UNF[key]);setT(0);target=null;info()});
  info();
};

/* ───────── 3차시: 정다면체 ───────── */
const REG=[{k:'tet',nm:'정사면체',face:'정삼각형',n:3,deg:3,F:4,E:6,V:4},{k:'cube',nm:'정육면체',face:'정사각형',n:4,deg:3,F:6,E:12,V:8},{k:'oct',nm:'정팔면체',face:'정삼각형',n:3,deg:4,F:8,E:12,V:6},
  {k:'dod',nm:'정십이면체',face:'정오각형',n:5,deg:3,F:12,E:30,V:20},{k:'ico',nm:'정이십면체',face:'정삼각형',n:3,deg:5,F:20,E:30,V:12}];
const REG_FLOOR={tet:'1+3',cube:'4+4',oct:'1+4+1',dod:'5+5+5+5',ico:'1+5+5+1'};
const REG_FLOOR_X={cube:['2+4+2','4+4+4'],oct:['2+4','1+3+1','4+4'],dod:['5+10+5','1+5+5+1','5+5+5'],ico:['1+5+1','5+5+5','1+10+1']};
const REG_OF={'3,3':'tet','3,4':'oct','3,5':'ico','4,3':'cube','5,3':'dod'};
const POLY_NM={3:'정삼각형',4:'정사각형',5:'정오각형',6:'정육각형'},inAng=n=>(n-2)*180/n;
function bipyramid(R=1.15){const B=regPoly(3,R),h=R*Math.SQRT2;const V=[...B.map(p=>[p[0],p[1],0]),[0,0,h],[0,0,-h]];
  const F=[];for(let i=0;i<3;i++){const j=(i+1)%3;F.push([i,j,3],[j,i,4])}return makeMesh(V,F)}
function topVertex(m){let b=0;m.V.forEach((p,i)=>{const s=p[2]-0.001*p[1],t=m.V[b][2]-0.001*m.V[b][1];if(s>t+1e-9)b=i});return b}
/* 한 꼭짓점에 정다각형 k개를 모은 그림 */
function fanSVG(n,k,size=240,opt={}){const O=size/2,a=inAng(n)*Math.PI/180,s=size*(n>=5?0.24:0.29),Rc=s/(2*Math.sin(Math.PI/n)),f=v=>v.toFixed(1),sum=inAng(n)*k;
  let g='';for(let j=0;j<k;j++){const th=-Math.PI/2+j*a,cx=O+Rc*Math.cos(th+a/2),cy=O+Rc*Math.sin(th+a/2),p0=th+a/2+Math.PI;
    const pts=range(n).map(i=>[cx+Rc*Math.cos(p0+2*Math.PI*i/n),cy+Rc*Math.sin(p0+2*Math.PI*i/n)]);
    g+=`<polygon points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" fill="${FC[j%5]}" fill-opacity="${sum>360?0.62:0.9}" stroke="#1d2640" stroke-width="2" stroke-linejoin="round"/>`}
  if(sum<360&&!opt.plain){const r=s*0.75,t0=-Math.PI/2+k*a,t1=1.5*Math.PI,large=(t1-t0)>Math.PI?1:0;
    g+=`<path d="M${O} ${O} L${f(O+r*Math.cos(t0))} ${f(O+r*Math.sin(t0))} A${r} ${r} 0 ${large} 1 ${f(O+r*Math.cos(t1))} ${f(O+r*Math.sin(t1))} Z" fill="rgba(210,59,59,.14)" stroke="#d23b3b" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    const tm=(t0+t1)/2;g+=`<text x="${f(O+r*0.62*Math.cos(tm))}" y="${f(O+r*0.62*Math.sin(tm)+5)}" text-anchor="middle" font-family="Times New Roman,serif" font-size="${size>150?17:13}" font-weight="700" fill="#b02a2a">${360-sum}°</text>`}
  g+=`<circle cx="${O}" cy="${O}" r="${size>150?5:3.5}" fill="#1d2640"/>`;
  return`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${POLY_NM[n]} ${k}개를 한 꼭짓점에 모은 그림, 각의 합 ${sum}도">${g}</svg>`}
function vtxFig(cv,mesh,marks,o={}){const v=new Viewer(cv,{auto:o.auto!==false,pad:0.40,yaw:o.yaw??-0.5,pitch:o.pitch??0.38});v.mode='v';
  v.vcol=i=>{const q=marks.find(x=>x.i===i);return q?q.c:null};if(marks[0]&&marks[0].f)v.fcol=i=>mesh.F[i].includes(marks[0].i)?marks[0].f:null;v.setMesh(mesh);return v}
CONCEPT.regular=body=>{
  body.innerHTML=foldPanel('정다면체',`<p class="lead">${T('정다면체')}가 되려면 무엇이 같아야 할까요? 정규 수업에서 ${T('정다각형')}을 떠올리며 함께 찾아요. <span class="muted">(수업 뒤에 1번을 펼쳐 확인하세요)</span></p>`,
   fold(1,'정다면체의 두 조건 (정규 수업 뒤에 펼쳐 보기)','수업에서 찾은 조건을 예시와 비예시로 확인해요',`<div class="trio">
      <div class="figbox"><canvas id="rgEx" style="height:230px"></canvas><div class="figcap"><b>정팔면체</b> · 정다면체예요<br>면: 모두 합동인 정삼각형<br>꼭짓점마다 면이 <b>4개</b>씩</div></div>
      <div class="figbox"><canvas id="rgNon" style="height:230px"></canvas><div class="figcap"><b>삼각쌍뿔</b> · 정다면체가 <b>아니에요</b><br>면: 모두 합동인 정삼각형<br>꼭짓점에 면이 <b style="color:#c0504d">3개</b>인 곳, <b style="color:#2a4d9e">4개</b>인 곳이 섞여 있어요</div></div>
      <div class="figbox"><canvas id="rgCub" style="height:230px"></canvas><div class="figcap"><b>직육면체</b> · 정다면체가 <b>아니에요</b><br>꼭짓점마다 면이 3개씩이지만<br>면이 <b style="color:#c0504d">직사각형</b> (정다각형 ✕)</div></div></div>
     <div class="box" style="margin-bottom:0"><b>정다면체</b>: ① 모든 면이 <b>합동인 정다각형</b>이고 ② <b>각 꼭짓점에 모인 면의 개수가 같은</b> 다면체<br><small>직육면체는 ①을, 삼각쌍뿔은 ②를 만족하지 않아요. 두 조건을 모두 확인해야 해요.</small></div>`)+
   fold(2,'정다면체는 다섯 가지','이름은 면의 개수로 지어요',`<div class="reg5">${REG.map(R=>`<div class="figbox"><canvas data-rg="${R.k}" style="height:170px"></canvas><div class="figcap"><b>${R.nm}</b><br>${R.face} · 꼭짓점마다 ${R.deg}개</div></div>`).join('')}</div>
     <p style="margin-bottom:0">면의 모양은 ${T('정삼각형')}, ${T('정사각형')}, 정오각형 세 가지뿐이에요. 정삼각형으로 된 것이 세 가지(정사면체, 정팔면체, 정이십면체)예요.</p>`)+
   fold(3,'왜 다섯 가지뿐일까?','한 꼭짓점에 모인 각의 합',`<p style="margin-top:0">입체가 되려면 한 꼭짓점에 면이 <b>3개 이상</b> 모이고, 그 각의 합이 <b>360°보다 작아야</b> 해요. 빨간 틈을 접어 올리면 입체가 돼요. 합이 360°이면 평평하게 깔리고, 넘으면 겹쳐요. 정다각형의 ${T('한 내각')}을 떠올려 보세요.</p>
     <div class="fan-grid">${[[3,3],[3,4],[3,5],[3,6],[4,3],[4,4],[5,3],[5,4],[6,3]].map(([n,k])=>{const s=inAng(n)*k,ok=s<360,R=REG.find(x=>x.k===REG_OF[n+','+k]);
       return`<div class="fan ${ok?'ok':'no'}">${fanSVG(n,k,128)}<b>${POLY_NM[n]} ${k}개</b><span class="rm">${inAng(n)}° × ${k} = ${s}°</span><small>${ok?`→ ${R.nm}`:s===360?'평평해요 ✕':'겹쳐요 ✕'}</small></div>`}).join('')}</div>
     <p style="margin-bottom:0">된다고 표시된 것이 딱 다섯 가지예요. 탐구에서 직접 모아 볼 수 있어요.</p>`)+
   fold(4,'몇 층 건물로 세기','정십이면체도 4층 건물',`<p style="margin-top:0">꼭짓점을 같은 높이끼리 묶어 층마다 세어 더해요. 정십이면체와 정이십면체는 <b>4층 건물</b>이에요.</p>
     <div class="reg5">${REG.map(R=>`<div class="figbox"><canvas data-rf="${R.k}" style="height:180px"></canvas><div class="figcap"><b>${R.nm}</b><br><span data-rfc="${R.k}"></span></div></div>`).join('')}</div>`)+
   fold(5,'개수 정리와 겹쳐 세기','면 × (한 면의 변) ÷ 2',`<div class="tablewrap"><table class="t regt"><thead><tr><th></th><th>모인<br>면</th><th>면</th><th>모서리</th><th>꼭짓점</th></tr></thead><tbody>
     ${REG.map(R=>`<tr><th>${R.nm}<br><small>${R.face}</small></th><td class="rm">${R.deg}</td><td class="rm">${R.F}</td><td class="rm">${R.E}</td><td class="rm">${R.V}</td></tr>`).join('')}</tbody></table></div>
     <p class="muted" style="margin:6px 0 0;font-size:14px">모인 면: 한 꼭짓점에 모인 면의 개수</p><p>표를 외우지 않아도 돼요. 면을 하나씩 떼어 놓고 세면, 모서리는 <b>두 번씩</b>, 꼭짓점은 <b>모인 면의 개수만큼</b> 겹쳐 세게 돼요.</p>
     <div class="box" style="margin-top:0">정십이면체: 면 ${M_('12')}개, 한 면의 변 ${M_('5')}개<br>모서리 = ${M_('12 × 5 ÷ 2 = 30')} · 꼭짓점 = ${M_('12 × 5 ÷ 3 = 20')} <span class="muted">(꼭짓점마다 면 3개)</span></div>`));
  wireFolds(body,'regular');
  const oc=SOLIDS.oct.mk();vtxFig($('#rgEx',body),oc,[{i:4,c:'#e08a1e',f:'#f6d9b0'},{i:0,c:'#e08a1e'}]);
  figure($('#rgCub',body),{visual:true,mesh:cuboid(),pitch:0.36,pad:0.40});const bp=bipyramid();vtxFig($('#rgNon',body),bp,[{i:3,c:'#c0504d',f:'#efc6c4'},{i:0,c:'#2a4d9e'}]);
  $$('canvas[data-rg]',body).forEach(cv=>figure(cv,{visual:true,mesh:SOLIDS[cv.dataset.rg].mk(),pitch:0.36,pad:0.40}));
  $$('canvas[data-rf]',body).forEach(cv=>{const k=cv.dataset.rf,I=floorFig(cv,SOLIDS[k].mk(),'v');$(`[data-rfc="${k}"]`,body).innerHTML=`${I.lv.length}층 · `+floorCap(I,'v')});
};
/* 탐구: 한 꼭짓점에 모인 면 세기 (삼각쌍뿔 함정 포함) */
function vertexActivity(host,done){
  const Q=[{k:'tet',nm:'정사면체'},{k:'cube',nm:'정육면체'},{k:'oct',nm:'정팔면체'},{k:'ico',nm:'정이십면체'},{k:'dod',nm:'정십이면체'},{k:'bip',nm:'삼각쌍뿔',i:3},{k:'bip',nm:'삼각쌍뿔',i:0}];
  let idx=0;const ans=[];
  host.innerHTML=`<div class="explore"><div class="stage"><canvas class="vxCv"></canvas><span class="hint">끌어서 돌려 보세요</span></div><div class="ctrl"><p class="vxQ" style="margin-top:0"></p><div class="choices vxC"></div><div class="flmsg vxMsg"></div><div class="vxLog"></div></div></div>`;
  let v=null;
  function show(){const q=Q[idx];if(!q)return end();const m=q.k==='bip'?bipyramid():SOLIDS[q.k].mk(),t=q.i??topVertex(m);if(v&&v.destroy)v.destroy();
    $('.vxCv',host).replaceWith(el('<canvas class="vxCv"></canvas>'));v=vtxFig($('.vxCv',host),m,[{i:t,c:'#e08a1e',f:'#f6d9b0'}],{auto:false,yaw:-0.6,pitch:q.i===0?0.05:0.45});
    $('.vxQ',host).innerHTML=`<b>${q.nm}</b>${q.k==='bip'?` (${q.i===3?'꼭대기':'가운데'} 꼭짓점)`:''} · 주황색 꼭짓점에 모인 면은 몇 개인가요?`;$('.vxMsg',host).textContent='';
    $('.vxC',host).innerHTML=[3,4,5,6].map(n=>`<button type="button">${n}개</button>`).join('');
    const right=q.k==='bip'?(q.i===3?3:4):REG.find(R=>R.k===q.k).deg;
    $$('.vxC button',host).forEach(b=>b.onclick=()=>{if(parseInt(b.textContent)===right){ans.push({...q,deg:right});$('.vxLog',host).innerHTML=ans.map(a=>`<span class="chip">${a.nm}${a.k==='bip'?(a.i===3?'(꼭대기)':'(가운데)'):''} · ${a.deg}개</span>`).join(' ');idx++;setTimeout(show,450)}
      else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);$('.vxMsg',host).textContent='주황색으로 칠한 면을 하나씩 세어 보세요. 그림을 돌리면 뒤쪽도 보여요.'}})}
  function end(){$('.vxQ',host).innerHTML='<b>생각 정리</b> · 삼각쌍뿔은 모든 면이 합동인 정삼각형이에요. 그런데 정다면체일까요?';
    $('.vxC',host).innerHTML=['정다면체이다','정다면체가 아니다'].map(c=>`<button type="button">${c}</button>`).join('');
    $$('.vxC button',host).forEach(b=>b.onclick=()=>{if(b.textContent.endsWith('아니다')){$('.vxMsg',host).innerHTML=`<span class="ok">맞아요! 꼭짓점에 모인 면이 3개인 곳과 4개인 곳이 섞여 있어서 정다면체가 아니에요. 정다면체는 <b>모든 꼭짓점에 같은 개수</b>의 면이 모여요.</span>`;done();award(3,'vtx')}
      else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);$('.vxMsg',host).textContent='꼭대기 꼭짓점과 가운데 꼭짓점에 모인 면의 개수를 비교해 보세요.'}})}
  show()}
/* 탐구: 한 꼭짓점에 정다각형 모아 보기 → 다섯 가지 발견 */
function angleActivity(host,done){let n=3,k=3;const found=new Set();
  host.innerHTML=`<div class="ang"><div class="angFig"></div><div class="angCtrl">
    <div class="cap">면의 모양</div><div class="seg angPoly">${[3,4,5,6].map(q=>`<button type="button" data-n="${q}" class="${q===3?'on':''}">${POLY_NM[q]}<small> ${inAng(q)}°</small></button>`).join('')}</div>
    <div class="cap" style="margin-top:12px">한 꼭짓점에 모이는 면의 개수</div><div class="angK"><button type="button" data-d="-1" aria-label="하나 빼기">−</button><b class="rm angKv">3</b><span>개</span><button type="button" data-d="1" aria-label="하나 더하기">+</button></div>
    <div class="angMsg" aria-live="polite"></div><div class="angSolid"><canvas class="angCv"></canvas></div>
    <div class="cap" style="margin-top:10px">찾은 정다면체 <span class="angCnt rm">0</span> / 5</div><div class="angFound">${REG.map(R=>`<span class="chip off" data-k="${R.k}">?</span>`).join(' ')}</div></div></div>`;
  let sv=null;
  function draw(){$('.angKv',host).textContent=k;const a=inAng(n),s=a*k;$('.angFig',host).innerHTML=fanSVG(n,k,260);
    const m=$('.angMsg',host),key=REG_OF[n+','+k];
    if(s<360){const R=REG.find(x=>x.k===key);m.className='angMsg ok';m.innerHTML=`<span class="rm">${a}° × ${k} = ${s}°</span> → 360°보다 작아요. 남은 틈 <b class="rm">${360-s}°</b>를 접어 올리면 입체가 돼요!<br>이렇게 모이는 정다면체: <b>${R.nm}</b>`;
      found.add(key);const ch=$(`.angFound [data-k="${key}"]`,host);ch.classList.remove('off');ch.textContent=R.nm;$('.angCnt',host).textContent=found.size;
      $('.angSolid',host).style.display='';$('.angCv',host).replaceWith(el('<canvas class="angCv"></canvas>'));sv=new Viewer($('.angCv',host),{auto:true,pad:0.38,pitch:0.4});sv.setMesh(SOLIDS[key].mk());
      if(found.size===5){m.innerHTML+=`<div class="box" style="margin:10px 0 0"><b>다섯 가지를 모두 찾았어요!</b> 다른 경우는 각의 합이 360° 이상이라 입체가 될 수 없어요. 그래서 정다면체는 다섯 가지뿐이에요.</div>`;done();award(5,'angle')}}
    else{$('.angSolid',host).style.display='none';m.className='angMsg bad';m.innerHTML=s===360?`<span class="rm">${a}° × ${k} = 360°</span> → 딱 360°라서 평평하게 깔려요. 접어 올릴 틈이 없어서 입체가 안 돼요.`:`<span class="rm">${a}° × ${k} = ${s}°</span> → 360°를 넘어서 면끼리 겹쳐요. 한 꼭짓점에 모일 수 없어요.`}
    if(k<=3)$('.angK [data-d="-1"]',host).disabled=true;else $('.angK [data-d="-1"]',host).disabled=false;$('.angK [data-d="1"]',host).disabled=k>=6}
  $$('.angPoly button',host).forEach(b=>b.onclick=()=>{n=+b.dataset.n;$$('.angPoly button',host).forEach(x=>x.classList.toggle('on',x===b));draw()});
  $$('.angK button',host).forEach(b=>b.onclick=()=>{k=Math.min(6,Math.max(3,k+ +b.dataset.d));draw()});
  draw()}
EXPLORE.regular=body=>{
  actNav(body,'regular',[
    {key:'face',t:'면의 모양 찾기',lead:'정다면체의 면을 눌러 실제 모양을 확인하고 면 목록을 만들어요. 모든 면이 같은 정다각형인지 보세요.',mount:(h,done)=>faceActivity(h,['tet','cube','oct','dod','ico'],{onDone:k=>{done();award(3,'face:'+k)}})},
    {key:'vtx',t:'꼭짓점에 모인 면 세기',lead:'주황색 꼭짓점에 모인 면을 세어요. 마지막에 함정이 하나 있어요.',mount:(h,done)=>vertexActivity(h,done)},
    {key:'angle',t:'꼭짓점에 정다각형 모아 보기',lead:'정다각형을 한 꼭짓점에 몇 개씩 모으면 입체가 될까요? 면의 모양과 개수를 바꿔 가며 정다면체를 모두 찾아보세요.',mount:(h,done)=>angleActivity(h,done)},
    {key:'floor',t:'몇 층 건물일까?',lead:'정다면체도 층으로 나누어 셀 수 있어요. 정십이면체와 정이십면체는 몇 층일까요?',mount:(h,done)=>floorActivity(h,['tet','cube','oct','dod','ico'],{onDone:k=>{done();award(3,'floor:'+k)}})}]);
};
/* 단계 문제와 연습 */
GEN.regularStep=seed=>{const r=mulberry(seed);const kind=pick(r,['edge','vertex','floor']);
  if(kind==='floor'){const rk=pick(r,['cube','oct','dod','ico']),R=REG.find(x=>x.k===rk),m=SOLIDS[R.k].mk(),fl=REG_FLOOR[R.k].split('+').length;
    return{ptype:'regular:floor',title:`다음 ${R.nm}의 꼭짓점의 개수를 구하시오.`,fig:solidFig(m),finalQ:'꼭짓점은 모두 몇 개인가요?',steps:[
      {tag:'몇 층 건물인지 찾기',hl:'Fv',q:'꼭짓점을 같은 높이끼리 묶으면 몇 층 건물인가요?',type:'choice',choices:['2층','3층','4층'],ans:fl+'층',hint:'같은 색 꼭짓점이 한 층이에요. 그림을 돌려서 높이를 비교해 보세요.'},
      {tag:'층마다 꼭짓점 세기',hl:'Fv',q:'위층부터 차례로 꼭짓점의 개수를 쓰면?',type:'choice',mathChoices:true,choices:shuffle(r,[REG_FLOOR[R.k],...REG_FLOOR_X[R.k]]),ans:REG_FLOOR[R.k],hint:'한 층씩 같은 색 점을 세어 보세요.'},
      {tag:'층별 개수 더하기',hl:'Fv',q:'꼭짓점은 모두 몇 개인가요?',type:'num',ans:R.V,suffix:'개',hint:`${REG_FLOOR[R.k].replace(/\+/g,' + ')}`,ok:`${R.nm}의 꼭짓점은 ${R.V}개예요.`}]}}
  const rk=pick(r,['cube','oct','dod','ico']),R=REG.find(x=>x.k===rk),m=SOLIDS[R.k].mk(),opts=['정삼각형','정사각형','정오각형'],sides=R.F*R.n;
  const head=[{tag:'면의 모양 찾기',hl:'A',q:`${R.nm}의 면은 어떤 ${T('정다각형')}인가요?`,type:'choice',choices:opts,ans:R.face,hint:'면 하나의 변을 세어 보세요.'},
    {tag:'면의 개수',q:'면은 모두 몇 개인가요?',type:'num',ans:R.F,suffix:'개',hint:`이름에 답이 있어요. ${R.nm} → ${kn(R.F)}면체`},
    {tag:kind==='edge'?'모든 면의 변 세기 (면 × 변)':'모든 면의 꼭짓점 세기 (면 × 꼭짓점)',q:`면을 하나씩 떼어 놓고 ${kind==='edge'?'변':'꼭짓점'}을 모두 세면 몇 개인가요?`,type:'num',ans:sides,suffix:'개',hint:`면 ${R.F}개 × ${R.face}의 ${kind==='edge'?'변':'꼭짓점'} ${R.n}개`}];
  if(kind==='edge')return{ptype:'regular:edge',title:`다음 ${R.nm}의 모서리의 개수를 구하시오.`,fig:solidFig(m),finalQ:'모서리는 모두 몇 개인가요?',steps:[...head,
    {tag:'겹쳐 센 것 나누기 (÷ 2)',hl:'E',q:'모서리 하나에서 면이 2개씩 만나요. 모서리는 몇 개인가요?',type:'num',ans:R.E,suffix:'개',hint:`모서리를 두 번씩 셌어요. ${sides} ÷ 2`,ok:`${sides} ÷ 2 = ${R.E}, 모서리는 ${R.E}개예요.`}]};
  const t=topVertex(m);
  return{ptype:'regular:vertex',title:`다음 ${R.nm}의 꼭짓점의 개수를 구하시오.`,fig:solidFig(m),finalQ:'꼭짓점은 모두 몇 개인가요?',steps:[...head,
    {tag:'한 꼭짓점에 모인 면 세기',hl:'V:'+t,q:'색칠한 꼭짓점에 모인 면은 몇 개인가요?',type:'num',ans:R.deg,suffix:'개',hint:'주황색 점 둘레의 칠한 면을 세어 보세요.'},
    {tag:'겹쳐 센 것 나누기',hl:'Fv',q:'꼭짓점은 모두 몇 개인가요?',type:'num',ans:R.V,suffix:'개',hint:`꼭짓점 하나를 ${R.deg}번씩 셌어요. ${sides} ÷ ${R.deg}`,ok:`${sides} ÷ ${R.deg} = ${R.V}, 꼭짓점은 ${R.V}개예요.`}]}};
const REG_TF={t:['정다면체는 다섯 가지뿐이다.','정육면체의 면은 모두 정사각형이다.','정팔면체의 한 꼭짓점에 모인 면은 4개이다.','정십이면체의 면은 정오각형이다.','정사면체의 모서리는 6개이다.','정이십면체의 꼭짓점은 12개이다.','면의 모양이 정삼각형인 정다면체는 세 가지이다.','정십이면체와 정이십면체는 모서리의 개수가 같다.'],
  f:[['다면체 중에서 각 면이 정다각형이고, 각 꼭짓점에 모인 면의 개수가 같은 다면체를 정다면체라고 한다.','각 면이 모두 "합동인" 정다각형이어야 해요. (교과서 215쪽 1번)'],['정이십면체의 면은 정오각형이다.','정이십면체의 면은 정삼각형이에요.'],['정육면체의 한 꼭짓점에 모인 면은 4개이다.','정육면체는 한 꼭짓점에 면이 3개 모여요.'],['면의 모양이 정육각형인 정다면체도 있다.','정육각형 3개를 모으면 120° × 3 = 360°라서 평평해져요.'],['정팔면체의 꼭짓점은 8개이다.','정팔면체의 꼭짓점은 6개예요. (1 + 4 + 1)'],['정사면체의 면은 정사각형이다.','정사면체의 면은 정삼각형이에요.'],['모든 면이 합동인 정삼각형이면 항상 정다면체이다.','삼각쌍뿔처럼 꼭짓점마다 모인 면의 개수가 다르면 정다면체가 아니에요.']]};
const CIRC=['①','②','③','④','⑤'];
GEN.regular=seed=>{const r=mulberry(seed);const k=pick(r,['step','step','cond','count','sum','tf']);
  if(k==='step')return GEN.regularStep(seed+7);
  if(k==='cond'){const R=pick(r,REG),same=REG.filter(x=>x.face===R.face).length;
    return{ptype:'regular:cond',title:`다음 조건을 모두 만족하는 정다면체를 고르시오.<div class="cond">(가) 모든 면이 합동인 ${R.face}이다.<br>(나) 한 꼭짓점에 모인 면의 개수는 ${R.deg}개이다.</div>`,fig:null,finalQ:'조건을 만족하는 정다면체는?',steps:[
      {tag:'면 모양으로 후보 고르기',q:`면이 ${R.face}인 정다면체는 모두 몇 가지인가요?`,type:'num',ans:same,suffix:'가지',hint:'정삼각형: 정사면체·정팔면체·정이십면체 / 정사각형: 정육면체 / 정오각형: 정십이면체'},
      {tag:'꼭짓점에 모인 면으로 구별하기',q:'조건을 만족하는 정다면체는?',type:'choice',choices:REG.map(x=>x.nm),ans:R.nm,hint:`면이 ${R.face}인 것 중에서 한 꼭짓점에 면이 ${R.deg}개 모이는 것을 찾아요.`,ok:`${R.nm}예요.`}]}}
  if(k==='count'){const R=pick(r,REG),part=pick(r,['F','E','V']),m=SOLIDS[R.k].mk();
    return{ptype:'regular:count',title:`다음 그림의 정다면체의 ${PART[part]}의 개수를 구하시오.`,fig:solidFig(m),finalQ:`${josa(PART[part],'은','는')} 모두 몇 개인가요?`,steps:[
      {tag:'그림 보고 이름 찾기',q:'이 정다면체의 이름은?',type:'choice',choices:REG.map(x=>x.nm),ans:R.nm,hint:'면의 모양과 한 꼭짓점에 모인 면의 개수를 보세요.'},
      {tag:'개수 구하기',q:`${josa(PART[part],'은','는')} 모두 몇 개인가요?`,type:'num',ans:R[part],suffix:'개',hint:part==='F'?`이름에 답이 있어요.`:part==='E'?`면 ${R.F} × 변 ${R.n} ÷ 2`:`면 ${R.F} × 꼭짓점 ${R.n} ÷ ${R.deg}`,ok:`${R.nm}의 ${josa(PART[part],'은','는')} ${R[part]}개예요.`}]}}
  if(k==='sum'){const[A,B]=shuffle(r,REG.slice()).slice(0,2),pa=pick(r,['F','E','V']),pb=pick(r,['F','E','V']);
    return{ptype:'regular:sum',title:`${A.nm}의 ${PART[pa]}의 개수를 <span class="math">a</span>, ${B.nm}의 ${PART[pb]}의 개수를 <span class="math">b</span>라 할 때, <span class="rm"><i>a</i> + <i>b</i></span>의 값을 구하시오.`,fig:null,finalQ:'<span class="rm"><i>a</i> + <i>b</i></span>의 값은?',steps:[
      {tag:'첫째 정다면체의 개수',q:`<span class="math">a</span>: ${A.nm}의 ${josa(PART[pa],'은','는')} 몇 개인가요?`,type:'num',ans:A[pa],suffix:'개',hint:pa==='F'?'이름에 답이 있어요.':`면 ${A.F} × ${A.n} ÷ ${pa==='E'?2:A.deg}`},
      {tag:'둘째 정다면체의 개수',q:`<span class="math">b</span>: ${B.nm}의 ${josa(PART[pb],'은','는')} 몇 개인가요?`,type:'num',ans:B[pb],suffix:'개',hint:pb==='F'?'이름에 답이 있어요.':`면 ${B.F} × ${B.n} ÷ ${pb==='E'?2:B.deg}`},
      {tag:'더하기',q:'<span class="rm"><i>a</i> + <i>b</i></span>의 값은?',type:'num',ans:A[pa]+B[pb],hint:`${A[pa]} + ${B[pb]}`}]}}
  const[fs,why]=pick(r,REG_TF.f),ts=shuffle(r,REG_TF.t.slice()).slice(0,4),all=shuffle(r,[...ts,fs]),lab=all.map((x,i)=>CIRC[i]+' '+x);
  return{ptype:'regular:tf',title:'다음 중 정다면체에 대한 설명으로 <u>옳지 않은</u> 것은?',fig:null,steps:[{q:'옳지 않은 것을 고르세요.',type:'choice',choices:lab,ans:lab[all.indexOf(fs)],hint:'개념 카드의 표와 "왜 다섯 가지뿐일까?"를 떠올려 보세요.',ok:why}]}};

STEPGEN.regular=GEN.regularStep;



/* ───────── 2단계: 로그인 · 서버 연결 ───────── */
const CFG=window.HG_CONFIG||{};
const LIVE=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const API={async call(fn,args={},o={}){
  if(!LIVE)return MOCK.call(fn,args);
  let r;try{r=await fetch(String(CFG.supabaseUrl).replace(/\/+$/,'')+'/rest/v1/rpc/'+fn,{method:'POST',keepalive:!!o.keepalive,
    headers:Object.assign({'apikey':CFG.supabaseAnonKey,'Content-Type':'application/json'},/^eyJ/.test(CFG.supabaseAnonKey)?{'Authorization':'Bearer '+CFG.supabaseAnonKey}:{}),body:JSON.stringify(args)})}
  catch(e){const er=new Error('서버에 연결할 수 없어요. 인터넷 연결을 확인해 주세요.');er.net=true;throw er}
  let j=null;try{j=await r.json()}catch(e){}
  if(!r.ok){const er=new Error((j&&(j.message||j.hint))||('서버 오류가 났어요 ('+r.status+')'));er.status=r.status;throw er}
  return j}};
const isAuthErr=e=>/다시 로그인/.test((e&&e.message)||'');
/* 체험 모드: 서버를 연결하기 전, 이 기기 안에서 똑같이 흉내 내는 가짜 서버 */
const MOCK=(()=>{
  const KEY='hangeoreum-demo-server-v1';let S=null;
  const tok=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
  const newPin=()=>String(crypto.getRandomValues(new Uint16Array(1))[0]%10000).padStart(4,'0');
  const nowISO=()=>new Date().toISOString();
  const fail=m=>{const e=new Error(m);e.status=400;throw e};
  const lockMsg=u=>`비밀번호를 여러 번 틀려서 잠시 잠겼어요. ${Math.ceil((u-Date.now())/60000)}분 뒤에 다시 해 보세요.`;
  function load(){if(S)return S;S=lsGet(KEY,null);if(!S||S.v!==2){S=seedDemo();lsSet(KEY,S)}return S}
  function sidOf(t){const x=S.sessions[t];if(!x||x.teacher||x.exp<Date.now()||!S.students[x.sid])fail('로그인이 끝났어요. 다시 로그인해 주세요.');return x.sid}
  function needT(t){const x=S.sessions[t];if(!x||!x.teacher||x.exp<Date.now())fail('교사 로그인이 필요해요. 다시 로그인해 주세요.')}
  const wkStart=d=>addDays(d,-((new Date(d+'T00:00:00').getDay()+6)%7));
  const psum=(sid,a,b)=>Object.entries(S.points[sid]||{}).reduce((x,[d,v])=>d>=a&&d<=b?x+v:x,0);
  function classJson(g,k,sid,teacher){const t=today(),ws=wkStart(t),mem=Object.values(S.students).filter(s=>s.grade===g&&s.klass===k).sort((a,b)=>a.num-b.num);
    let dmg=0,act=0;mem.forEach(s=>{const v=psum(s.sid,ws,t);dmg+=v;if(v>0)act++});
    const days=range(7).map(i=>{const d=addDays(ws,i);return mem.reduce((x,s)=>x+((S.points[s.sid]||{})[d]||0),0)});
    const weeks=[];for(let w=1;w<=8;w++){const a=addDays(ws,-7*w),v=mem.reduce((x,s)=>x+psum(s.sid,a,addDays(a,6)),0);if(v>0)weeks.push({w:a,damage:v})}
    return{grade:g,klass:k,today:t,week_start:ws,members:mem.length,active:act,damage:dmg,my:sid?psum(sid,ws,t):null,per_student:S.settings[g+'-'+k]||50,days,weeks,
      students:teacher?mem.map(s=>({num:s.num,pts:psum(s.sid,ws,t)})):null}}
  /* 방과후 반 (체험 모드: 다른 반 학생 몇 명과 예시 반 하나) */
  function GR(){if(!S.groups){const r=mulberry(7);[['1-2-4'],['1-3-11'],['1-4-7'],['2-1-3']].forEach(([sid])=>{if(!S.students[sid]){const[g,k,n]=sid.split('-').map(Number);S.students[sid]={sid,grade:g,klass:k,num:n,pin:'1234',failed:0,lock:0,last_seen:new Date(Date.now()-ri(r,0,3)*864e5).toISOString()}}});
    S.groups={seq:2,list:[{id:1,name:'화목 방과후',sids:['1-1-3','1-1-5','1-1-12','1-2-4','1-3-11','1-4-7','2-1-3']}]}}return S.groups}
  const dropSessions=sid=>Object.keys(S.sessions).forEach(k=>{if(S.sessions[k].sid===sid)delete S.sessions[k]});
  const F={
    hg_login({p_sid,p_pin}){const s=S.students[p_sid];if(!s)return{ok:false,msg:'등록되지 않은 번호예요. 학년, 반, 번호를 확인해 주세요.'};
      if(s.lock>Date.now())return{ok:false,msg:lockMsg(s.lock)};
      if(s.pin!==p_pin){s.failed++;if(s.failed>=5){s.failed=0;s.lock=Date.now()+6e5;return{ok:false,msg:'비밀번호를 5번 틀려서 10분 동안 잠겼어요. 모르면 선생님께 물어보세요.'}}return{ok:false,msg:`비밀번호가 맞지 않아요. (${5-s.failed}번 더 틀리면 잠겨요)`}}
      s.failed=0;s.lock=0;s.last_seen=nowISO();const t=tok();S.sessions[t]={sid:s.sid,exp:Date.now()+180*864e5};return{ok:true,token:t,sid:s.sid,grade:s.grade,klass:s.klass,num:s.num}},
    hg_logout({p_token}){delete S.sessions[p_token];return{ok:true}},
    hg_get_progress({p_token}){const sid=sidOf(p_token);S.students[sid].last_seen=nowISO();const p=S.progress[sid];return p?{data:p.data,updated_at:p.updated_at}:{data:{},updated_at:null}},
    hg_save_progress({p_token,p_data}){const sid=sidOf(p_token);if(!p_data||typeof p_data!=='object'||Array.isArray(p_data))fail('저장할 기록의 모양이 올바르지 않아요.');const at=nowISO();S.progress[sid]={data:p_data,updated_at:at};S.students[sid].last_seen=at;return{ok:true,updated_at:at}},
    hg_log_attempt(a){const sid=sidOf(a.p_token);if(!['steps','practice','review'].includes(a.p_kind)||!a.p_lesson)fail('풀이 기록의 모양이 올바르지 않아요.');
      S.attempts.push({sid,lesson:a.p_lesson,kind:a.p_kind,mode:a.p_mode||null,gen:a.p_gen||null,seed:a.p_seed??null,ptype:a.p_ptype||null,good:!!a.p_good,wrongs:a.p_wrongs||0,step_wrongs:a.p_step_wrongs||null,revealed:a.p_revealed||null,created_at:nowISO()});
      if(S.attempts.length>4000)S.attempts.splice(0,S.attempts.length-4000);return{ok:true}},
    hg_teacher_login({p_password}){const T=S.teacher;if(T.lock>Date.now())return{ok:false,msg:lockMsg(T.lock)};
      if(p_password!==T.pw){T.failed++;if(T.failed>=5){T.failed=0;T.lock=Date.now()+6e5;return{ok:false,msg:'비밀번호를 5번 틀려서 10분 동안 잠겼어요.'}}return{ok:false,msg:'교사 비밀번호가 맞지 않아요.'}}
      T.failed=0;const t=tok();S.sessions[t]={teacher:true,exp:Date.now()+12*36e5};return{ok:true,token:t}},
    hg_t_change_password({p_token,p_old,p_new}){needT(p_token);if(p_old!==S.teacher.pw)return{ok:false,msg:'지금 비밀번호가 맞지 않아요.'};if(!p_new||p_new.length<6)return{ok:false,msg:'새 비밀번호는 6자 이상으로 정해 주세요.'};S.teacher.pw=p_new;return{ok:true}},
    hg_t_create_students({p_token,p_grade,p_klass,p_from,p_to}){needT(p_token);if(!(p_grade>=1&&p_grade<=3&&p_klass>=1&&p_klass<=20&&p_from>=1&&p_to<=50&&p_from<=p_to))fail('학년은 1~3, 반은 1~20, 번호는 1~50 사이로 정해 주세요.');
      const out=[];for(let i=p_from;i<=p_to;i++){const sid=`${p_grade}-${p_klass}-${i}`;if(S.students[sid])out.push({sid,num:i,pin:null,existed:true});else{const pn=newPin();S.students[sid]={sid,grade:p_grade,klass:p_klass,num:i,pin:pn,failed:0,lock:0,last_seen:null};out.push({sid,num:i,pin:pn,existed:false})}}return out},
    hg_t_reset_pin({p_token,p_sid}){needT(p_token);const s=S.students[p_sid];if(!s)fail('그 학생을 찾을 수 없어요.');s.pin=newPin();s.failed=0;s.lock=0;dropSessions(p_sid);return{sid:p_sid,pin:s.pin}},
    hg_t_delete_student({p_token,p_sid}){needT(p_token);delete S.students[p_sid];delete S.progress[p_sid];delete S.points[p_sid];S.attempts=S.attempts.filter(a=>a.sid!==p_sid);dropSessions(p_sid);GR().list.forEach(g=>g.sids=g.sids.filter(x=>x!==p_sid));return{ok:true}},
    hg_t_overview({p_token}){needT(p_token);GR();const wk=Date.now()-7*864e5;return Object.values(S.students).sort((a,b)=>a.grade-b.grade||a.klass-b.klass||a.num-b.num).map(s=>({sid:s.sid,grade:s.grade,klass:s.klass,num:s.num,last_seen:s.last_seen,locked:s.lock>Date.now(),
      data:(S.progress[s.sid]||{}).data||{},updated_at:(S.progress[s.sid]||{}).updated_at||null,attempts_7d:S.attempts.filter(a=>a.sid===s.sid&&Date.parse(a.created_at)>wk).length,week_pts:psum(s.sid,wkStart(today()),'9999')}))},
    hg_add_points({p_token,p_pts,p_day}){const sid=sidOf(p_token),t=today();let d=p_day||t;if(d>t||d<addDays(t,-3))d=t;const P=S.points[sid]=S.points[sid]||{};
      const add=Math.min(Math.min(Math.max(+p_pts||0,0),200),Math.max(0,500-(P[d]||0)));if(add>0)P[d]=(P[d]||0)+add;return{ok:true,added:add}},
    hg_class_status({p_token}){const sid=sidOf(p_token),s=S.students[sid];return classJson(s.grade,s.klass,sid,false)},
    hg_t_class_status({p_token,p_grade,p_klass}){needT(p_token);if(!(p_grade>=1&&p_grade<=3&&p_klass>=1&&p_klass<=20))fail('학년은 1~3, 반은 1~20 사이로 정해 주세요.');return classJson(p_grade,p_klass,null,true)},
    hg_t_set_boss({p_token,p_grade,p_klass,p_per_student}){needT(p_token);if(!(p_per_student>=10&&p_per_student<=500))fail('보스 체력은 학생 1명당 10~500 사이로 정해 주세요.');S.settings[p_grade+'-'+p_klass]=p_per_student;return{ok:true}},
    hg_t_step_stats({p_token,p_days}){needT(p_token);const since=Date.now()-(p_days||30)*864e5,g={};
      S.attempts.forEach(a=>{if(a.mode!=='steps'||!a.step_wrongs||Date.parse(a.created_at)<=since)return;a.step_wrongs.forEach((w,i)=>{const k=a.lesson+'|'+a.ptype+'|'+(i+1);
        const x=g[k]=g[k]||{lesson:a.lesson,ptype:a.ptype,gen:a.gen,seed:a.seed,step:i+1,n:0,wrong:0,revealed:0};x.n++;if(w>0)x.wrong++;if(a.revealed&&a.revealed[i]>0)x.revealed++})});
      return Object.values(g).sort((a,b)=>a.lesson.localeCompare(b.lesson)||String(a.ptype).localeCompare(String(b.ptype))||a.step-b.step)},
    hg_t_student_attempts({p_token,p_sid,p_limit}){needT(p_token);return S.attempts.filter(a=>a.sid===p_sid).slice(-(p_limit||40)).reverse()},
    hg_ping({p_token,p_loc,p_prog}){const sid=sidOf(p_token),L=(S.live=S.live||{})[sid]=(S.live||{})[sid]||{};L.loc=String(p_loc||L.loc||'').slice(0,80);L.loc_at=nowISO();if(p_prog)L.prog_at=nowISO();S.students[sid].last_seen=nowISO();return{ok:true,help:!!L.help_at}},
    hg_help({p_token,p_on,p_loc}){const sid=sidOf(p_token),L=(S.live=S.live||{})[sid]=(S.live||{})[sid]||{};L.loc_at=nowISO();if(p_loc)L.loc=String(p_loc).slice(0,80);L.help_at=p_on?(L.help_at||nowISO()):null;L.help_loc=p_on?(p_loc||L.help_loc):null;return{ok:true,help:!!p_on}},
    hg_t_live({p_token,p_grade,p_klass}){needT(p_token);const d0=new Date();d0.setHours(0,0,0,0);const lv=S.live||{};
      return{now:nowISO(),students:Object.values(S.students).filter(s=>s.grade===p_grade&&s.klass===p_klass).sort((a,b)=>a.num-b.num).map(s=>{const L=lv[s.sid]||{};
        return{sid:s.sid,num:s.num,last_seen:s.last_seen,loc:L.loc||null,loc_at:L.loc_at||null,prog_at:L.prog_at||null,help_at:L.help_at||null,help_loc:L.help_loc||null,ack_at:L.ack_at||null,
          att:S.attempts.filter(a=>a.sid===s.sid&&Date.parse(a.created_at)>=d0.getTime()).slice(-60)}})}},
    hg_report(a){const sid=a.p_token?sidOf(a.p_token):null;if(!a.p_lesson||!a.p_reason)fail('신고 내용의 모양이 올바르지 않아요.');const R=S.reports=S.reports||[];
      R.push({id:(R.length?R[R.length-1].id:0)+1,sid,lesson:a.p_lesson,gen:a.p_gen,seed:a.p_seed,ptype:a.p_ptype,step:a.p_step,reason:a.p_reason,note:a.p_note,ctx:a.p_ctx,done:false,created_at:nowISO()});if(R.length>200)R.shift();return{ok:true}},
    hg_t_reports({p_token,p_all}){needT(p_token);return(S.reports||[]).filter(r=>p_all||!r.done).slice().reverse().map(r=>{const s=S.students[r.sid]||{};return Object.assign({},r,{grade:s.grade,klass:s.klass,num:s.num})})},
    hg_t_report_done({p_token,p_id,p_done}){needT(p_token);const r=(S.reports||[]).find(x=>x.id===p_id);if(r)r.done=p_done!==false;return{ok:true}},
    hg_t_groups({p_token}){needT(p_token);return GR().list.map(g=>({id:g.id,name:g.name,sids:g.sids.filter(x=>S.students[x]).sort()}))},
    hg_t_group_save({p_token,p_id,p_name}){needT(p_token);const nm=String(p_name||'').trim();if(nm.length<1||nm.length>30)fail('반 이름은 1~30자로 정해 주세요.');const G=GR();
      if(p_id==null){if(G.list.length>=30)fail('방과후 반은 30개까지 만들 수 있어요.');const g={id:G.seq++,name:nm,sids:[]};G.list.push(g);return{ok:true,id:g.id}}
      const g=G.list.find(x=>x.id===p_id);if(!g)fail('그 방과후 반을 찾을 수 없어요.');g.name=nm;return{ok:true,id:g.id}},
    hg_t_group_del({p_token,p_id}){needT(p_token);const G=GR();G.list=G.list.filter(x=>x.id!==p_id);return{ok:true}},
    hg_t_group_members({p_token,p_id,p_sids,p_on}){needT(p_token);const g=GR().list.find(x=>x.id===p_id);if(!g)fail('그 방과후 반을 찾을 수 없어요.');const before=g.sids.length;
      if(p_on)(p_sids||[]).forEach(x=>{if(S.students[x]&&!g.sids.includes(x))g.sids.push(x)});else g.sids=g.sids.filter(x=>!(p_sids||[]).includes(x));return{ok:true,n:Math.abs(g.sids.length-before)}},
    hg_t_live_sids({p_token,p_sids}){needT(p_token);const d0=new Date();d0.setHours(0,0,0,0);const lv=S.live||{},want=new Set(p_sids||[]);
      return{now:nowISO(),students:Object.values(S.students).filter(s=>want.has(s.sid)).sort((a,b)=>a.grade-b.grade||a.klass-b.klass||a.num-b.num).map(s=>{const L=lv[s.sid]||{};
        return{sid:s.sid,grade:s.grade,klass:s.klass,num:s.num,last_seen:s.last_seen,loc:L.loc||null,loc_at:L.loc_at||null,prog_at:L.prog_at||null,help_at:L.help_at||null,help_loc:L.help_loc||null,ack_at:L.ack_at||null,
          att:S.attempts.filter(a=>a.sid===s.sid&&Date.parse(a.created_at)>=d0.getTime()).slice(-60)}})}},
    hg_t_step_stats_sids({p_token,p_days,p_sids}){const keep=S.attempts,want=new Set(p_sids||[]);S.attempts=keep.filter(a=>want.has(a.sid));try{return F.hg_t_step_stats({p_token,p_days})}finally{S.attempts=keep}},
    hg_t_ack({p_token,p_sid}){needT(p_token);const L=(S.live=S.live||{})[p_sid]=(S.live||{})[p_sid]||{};L.ack_at=nowISO();L.help_at=null;L.help_loc=null;return{ok:true}}};

  /* 숫자야구 (체험 모드: 방을 만들면 3초 뒤 체험용 친구가 들어와 같이 해요) */
  const BBX=()=>{S.bb=S.bb||{games:[],guesses:[],ledger:[],seq:1};S.bbconf=S.bbconf||{};return S.bb};
  const bbconf=sid=>{const s=S.students[sid]||{};const c=(BBX(),S.bbconf)[s.grade+'-'+s.klass]||{};return{on:c.on!==false,max:c.max==null?20:c.max}};
  const bbLed=sid=>BBX().ledger.filter(l=>l.sid===sid).reduce((a,l)=>a+l.delta,0);
  const bbAvail=sid=>{const d=(S.progress[sid]||{}).data||{},m=d._me||{},sh=d._shop||{};return(typeof m.pts==='number'?Math.max(0,Math.floor(m.pts)):0)-(typeof sh.spent==='number'?Math.max(0,Math.floor(sh.spent)):0)+bbLed(sid)};
  const bbTodayN=sid=>BBX().games.filter(g=>(g.host===sid||g.guest===sid)&&g.status!=='cancelled'&&g.day===today()).length;
  const bbPaused=g=>[g.host,g.guest].some(sid=>sid&&S.students[sid]&&!bbconf(sid).on);
  const bbValid=(p,d)=>typeof p==='string'&&new RegExp('^[1-9]{'+d+'}$').test(p)&&new Set(p).size===d;
  const bbP=sid=>{const s=S.students[sid];return s?{grade:s.grade,klass:s.klass,num:s.num}:null};
  const pickOne=a=>a[Math.floor(Math.random()*a.length)];
  function bbFinish(g,w,reason){if(g.status!=='playing')return;g.status='done';g.winner=w;g.reason=reason;g.turn=null;g.updated=Date.now();
    if(g.stake>0){if(w==='draw')BBX().ledger.push({sid:g.host,game:g.id,delta:g.stake},{sid:g.guest,game:g.id,delta:g.stake});else BBX().ledger.push({sid:w==='host'?g.host:g.guest,game:g.id,delta:2*g.stake})}}
  function bbStep(g,who,solved){if(who==='host'){if(solved)g.hostSolved=g.round;g.turn='guest';g.turnAt=Date.now()}
    else if(solved)bbFinish(g,g.hostSolved===g.round?'draw':'guest','solved');else if(g.hostSolved===g.round)bbFinish(g,'host','solved');else if(g.round>=15)bbFinish(g,'draw','rounds');else{g.round++;g.turn='host';g.turnAt=Date.now()}}
  function bbStart(g){if(g.stake>0){if(bbAvail(g.host)<g.stake||bbAvail(g.guest)<g.stake){g.status='cancelled';g.reason='points';return false}BBX().ledger.push({sid:g.host,game:g.id,delta:-g.stake},{sid:g.guest,game:g.id,delta:-g.stake})}
    g.status='playing';g.turn='host';g.round=1;g.turnAt=Date.now();g.updated=Date.now();return true}
  function bbTick(g){const now=Date.now();
    if(g.status==='waiting'){if(now-g.createdAt>15*60e3){g.status='cancelled';g.reason='expired';return}
      if(now-g.createdAt>3000){const h=S.students[g.host],mates=Object.values(S.students).filter(s=>s.sid!==g.host&&s.grade===h.grade&&s.klass===h.klass);const m=pickOne(mates);
        if(m){g.guest=m.sid;g.bot=true;g.status='setup';g.updated=now;g.guestSecret=pickOne(bbAll(g.digits));if(g.stake>0&&bbAvail(m.sid)<g.stake)BBX().ledger.push({sid:m.sid,game:null,delta:g.stake})}}
      return}
    if(g.status==='setup'&&now-g.updated>3*60e3){g.status='cancelled';g.reason='setup_timeout';return}
    if(g.status==='playing'){if(bbPaused(g)){g.turnAt=now;return}
      if(g.bot&&g.turn==='guest'&&now-g.turnAt>1800){const mine=BBX().guesses.filter(x=>x.game===g.id&&x.who==='guest'),q=bbBotGuess(g.digits,mine,2),r=bbScore(g.hostSecret,q);
        BBX().guesses.push({game:g.id,who:'guest',rnd:g.round,guess:q,s:r.s,b:r.b});bbStep(g,'guest',r.s===g.digits);return}
      if(now-g.turnAt>90e3){BBX().guesses.push({game:g.id,who:g.turn,rnd:g.round,guess:null,s:0,b:0});const k=g.turn==='host'?'hostTo':'guestTo';g[k]=(g[k]||0)+1;
        if(g[k]>=2)bbFinish(g,g.turn==='host'?'guest':'host','timeout');else bbStep(g,g.turn,false)}}}
  const bbMine=(sid,id)=>{const g=BBX().games.find(x=>x.id===+id&&(x.host===sid||x.guest===sid));if(!g)fail('경기를 찾을 수 없어요.');bbTick(g);return g};
  const bbActive=g=>['waiting','setup','playing'].includes(g.status);
  Object.assign(F,{
    hg_bb_lobby({p_token}){const sid=sidOf(p_token),s=S.students[sid],c=bbconf(sid);BBX().games.filter(bbActive).forEach(bbTick);
      const mine=BBX().games.filter(g=>bbActive(g)&&(g.host===sid||g.guest===sid)).pop(),meOf=g=>g.host===sid?'host':'guest';
      const open=BBX().games.filter(g=>g.status==='waiting'&&g.host!==sid&&S.students[g.host]&&S.students[g.host].grade===s.grade&&S.students[g.host].klass===s.klass).slice(-10).reverse().map(g=>({code:g.code,num:S.students[g.host].num,stake:g.stake,digits:g.digits}));
      const done=BBX().games.filter(g=>g.status==='done'&&(g.host===sid||g.guest===sid));
      return{available:bbAvail(sid),ledger:bbLed(sid),on:c.on,max:c.max,today:bbTodayN(sid),limit:10,grade:s.grade,klass:s.klass,num:s.num,mine:mine?{id:mine.id,code:mine.code,status:mine.status}:null,open,
        record:{w:done.filter(g=>g.winner===meOf(g)).length,l:done.filter(g=>g.winner&&g.winner!=='draw'&&g.winner!==meOf(g)).length,d:done.filter(g=>g.winner==='draw').length},
        recent:done.slice(-8).reverse().map(g=>({id:g.id,at:new Date(g.updated).toISOString(),stake:g.stake,digits:g.digits,winner:g.winner,reason:g.reason,me:meOf(g),opp:bbP(g.host===sid?g.guest:g.host),delta:BBX().ledger.filter(l=>l.game===g.id&&l.sid===sid).reduce((a,l)=>a+l.delta,0)}))}},
    hg_bb_create({p_token,p_stake,p_digits}){const sid=sidOf(p_token),c=bbconf(sid);if(!c.on)return{ok:false,msg:'선생님이 지금은 숫자야구를 꺼 두었어요.'};
      if(![0,5,10,20,50].includes(p_stake))return{ok:false,msg:'판돈은 0, 5, 10, 20, 50 중에서 골라 주세요.'};if(p_stake>c.max)return{ok:false,msg:`지금은 판돈을 ${c.max}포인트까지만 걸 수 있어요.`};
      if(bbTodayN(sid)>=10)return{ok:false,msg:'오늘은 숫자야구를 10판 다 했어요. 내일 또 해요!'};const av=bbAvail(sid);if(p_stake>av)return{ok:false,msg:`쓸 수 있는 포인트가 ${Math.max(av,0)}점이라 ${p_stake}점을 걸 수 없어요.`};
      const pl=BBX().games.find(g=>g.status==='playing'&&(g.host===sid||g.guest===sid));if(pl)return{ok:false,msg:'진행 중인 경기가 있어요.',game:pl.id};
      BBX().games.forEach(g=>{if(['waiting','setup'].includes(g.status)&&(g.host===sid||g.guest===sid)){g.status='cancelled';g.reason='replaced'}});
      let code;do{code=String(1000+Math.floor(Math.random()*9000))}while(BBX().games.some(g=>g.code===code&&bbActive(g)));
      const g={id:BBX().seq++,code,host:sid,guest:null,stake:p_stake,digits:p_digits===4?4:3,status:'waiting',round:1,createdAt:Date.now(),updated:Date.now(),day:today()};BBX().games.push(g);return{ok:true,game:g.id,code}},
    hg_bb_join({p_token,p_code}){const sid=sidOf(p_token);const g=BBX().games.filter(x=>x.code===p_code&&x.status==='waiting').pop();if(g)bbTick(g);
      if(!g||g.status!=='waiting')return{ok:false,msg:'그 번호의 방이 없어요. 방 번호를 다시 확인해 주세요.'};if(g.host===sid)return{ok:false,msg:'내가 만든 방이에요. 친구가 들어오기를 기다려요.',game:g.id};
      const c=bbconf(sid);if(!c.on)return{ok:false,msg:'선생님이 지금은 숫자야구를 꺼 두었어요.'};if(bbTodayN(sid)>=10)return{ok:false,msg:'오늘은 숫자야구를 10판 다 했어요. 내일 또 해요!'};
      const av=bbAvail(sid);if(g.stake>av)return{ok:false,msg:`이 방의 판돈은 ${g.stake}포인트인데, 쓸 수 있는 포인트가 ${Math.max(av,0)}점이에요.`};
      g.guest=sid;g.status='setup';g.updated=Date.now();return{ok:true,game:g.id}},
    hg_bb_secret({p_token,p_game,p_secret}){const sid=sidOf(p_token),g=bbMine(sid,p_game);if(g.status!=='setup')return{ok:false,msg:'지금은 숫자를 정할 수 없어요.'};
      if(!bbValid(p_secret,g.digits))return{ok:false,msg:`1~9 중 서로 다른 숫자 ${g.digits}개로 정해 주세요.`};if(g.host===sid)g.hostSecret=p_secret;else g.guestSecret=p_secret;g.updated=Date.now();
      if(g.hostSecret&&g.guestSecret&&!bbStart(g))return{ok:false,msg:'포인트가 모자란 사람이 있어서 경기가 취소됐어요.'};return{ok:true}},
    hg_bb_guess({p_token,p_game,p_guess}){const sid=sidOf(p_token),g=bbMine(sid,p_game),me=g.host===sid?'host':'guest';if(g.status!=='playing')return{ok:false,msg:'경기가 끝났어요.'};
      if(bbPaused(g))return{ok:false,msg:'선생님이 잠시 멈췄어요.'};if(g.turn!==me)return{ok:false,msg:'상대 차례예요.'};if(!bbValid(p_guess,g.digits))return{ok:false,msg:`1~9 중 서로 다른 숫자 ${g.digits}개를 골라 주세요.`};
      const r=bbScore(me==='host'?g.guestSecret:g.hostSecret,p_guess);BBX().guesses.push({game:g.id,who:me,rnd:g.round,guess:p_guess,s:r.s,b:r.b});g[me+'To']=0;bbStep(g,me,r.s===g.digits);return{ok:true,s:r.s,b:r.b}},
    hg_bb_state({p_token,p_game}){const sid=sidOf(p_token),g=bbMine(sid,p_game),me=g.host===sid?'host':'guest';
      return{id:g.id,code:g.code,status:g.status,me,stake:g.stake,digits:g.digits,round:g.round,turn:g.turn||null,my_turn:g.status==='playing'&&g.turn===me,
        turn_left:g.status==='playing'?Math.max(0,90-Math.floor((Date.now()-g.turnAt)/1000)):null,my_secret:(me==='host'?g.hostSecret:g.guestSecret)||null,
        opp_secret:g.status==='done'?(me==='host'?g.guestSecret:g.hostSecret):null,opp_ready:!!(me==='host'?g.guestSecret:g.hostSecret),winner:g.winner||null,reason:g.reason||null,
        host:bbP(g.host),guest:bbP(g.guest),guesses:BBX().guesses.filter(x=>x.game===g.id).map(x=>({who:x.who,rnd:x.rnd,guess:x.guess,s:x.s,b:x.b})),paused:bbPaused(g),
        delta:BBX().ledger.filter(l=>l.game===g.id&&l.sid===sid).reduce((a,l)=>a+l.delta,0),ledger:bbLed(sid)}},
    hg_bb_leave({p_token,p_game}){const sid=sidOf(p_token),g=bbMine(sid,p_game);if(['waiting','setup'].includes(g.status)){g.status='cancelled';g.reason='left'}else if(g.status==='playing')bbFinish(g,g.host===sid?'guest':'host','forfeit');return{ok:true}},
    hg_t_bb({p_token,p_grade,p_klass}){needT(p_token);BBX();const c=S.bbconf[p_grade+'-'+p_klass]||{},mem=new Set(Object.values(S.students).filter(s=>s.grade===p_grade&&s.klass===p_klass).map(s=>s.sid));
      const gs=BBX().games.filter(g=>mem.has(g.host)||mem.has(g.guest));
      const stu=[...mem].map(sid=>{const d=gs.filter(g=>g.status==='done'&&(g.host===sid||g.guest===sid)),meOf=g=>g.host===sid?'host':'guest';return{num:S.students[sid].num,games:d.length,w:d.filter(g=>g.winner===meOf(g)).length,l:d.filter(g=>g.winner&&g.winner!=='draw'&&g.winner!==meOf(g)).length,d:d.filter(g=>g.winner==='draw').length,net:bbLed(sid)}}).filter(x=>x.games).sort((a,b)=>a.num-b.num);
      return{on:c.on!==false,max:c.max==null?20:c.max,active:gs.filter(g=>['setup','playing'].includes(g.status)).length,today:gs.filter(g=>g.status!=='cancelled'&&g.day===today()).length,
        games:gs.slice(-40).reverse().map(g=>({id:g.id,at:new Date(g.createdAt).toISOString(),status:g.status,stake:g.stake,digits:g.digits,winner:g.winner||null,reason:g.reason||null,round:g.round,host:bbP(g.host),guest:bbP(g.guest)})),students:stu}},
    hg_t_bb_set({p_token,p_grade,p_klass,p_on,p_max}){needT(p_token);if(![0,5,10,20,50].includes(p_max))fail('최대 판돈은 0, 5, 10, 20, 50 중에서 골라 주세요.');BBX();S.bbconf[p_grade+'-'+p_klass]={on:!!p_on,max:p_max};return{ok:true}}});
  function seedDemo(){const st={v:2,points:{},settings:{},teacher:{pw:'demo1234',failed:0,lock:0},students:{},progress:{},attempts:[],sessions:{}};
    const r=mulberry(20261121),now=Date.now();
    const prof={'area:cyl':[.15,.2,.45,.55,.3],'area:tri':[.25,.1,.35,.2],'area:box':[.1,.15,.3,.15],'types:prism':[.3,.4,.1,.25],'types:pyramid':[.35,.45,.1,.3],'types:frustum':[.4,.45,.12,.35],'poly:prism':[.1,.15,.2,.1],'poly:pyramid':[.15,.2,.25,.1]};
    const seedOf={};for(let sd=1;sd<500&&Object.keys(seedOf).length<8;sd++)['polyStep','typesStep','areaStep'].forEach(g=>{const pt=GEN[g](sd).ptype;if(!seedOf[pt])seedOf[pt]={g,sd}});
    for(let n=1;n<=20;n++){const sid='1-1-'+n,active=r()<0.85;
      st.students[sid]={sid,grade:1,klass:1,num:n,pin:'1234',failed:0,lock:0,last_seen:active?new Date(now-ri(r,0,5)*864e5-ri(r,0,10)*36e5).toISOString():null};
      if(!active)continue;const d={},lv=ri(r,1,3);
      LESSONS.filter(l=>l.ready).forEach((l,i)=>{if(i<lv)d[l.id]={concept:true,explore:r()<.8,steps:ri(r,0,4),prac:{solved:ri(r,0,12),streak:ri(r,0,3),level:r()<.25?2:1,fails:0,retry:[]}}});
      d._me={pts:ri(r,15,280),last:today(),streak:ri(r,0,4),once:{},cnt:{},badges:{first:today()}};
      if(r()<.6)d._rev=range(ri(r,1,4)).map(()=>({g:'areaStep',seed:ri(r,1,999),lid:'area',due:addDays(today(),ri(r,-1,3)),stage:0}));
      d._ts=now-ri(r,1,4)*864e5;st.progress[sid]={data:d,updated_at:new Date(d._ts).toISOString()};
      const cnt=ri(r,4,12);for(let k=0;k<cnt;k++){const pt=pick(r,Object.keys(prof)),S0=seedOf[pt];if(!S0)continue;const P=prof[pt];
        const swa=P.map(q=>r()<q?ri(r,1,3):0),rva=swa.map(w=>w>=3&&r()<.6?1:0);
        st.attempts.push({sid,lesson:pt.split(':')[0],kind:'steps',mode:'steps',gen:S0.g,seed:S0.sd,ptype:pt,good:!rva.some(x=>x),wrongs:swa.reduce((a,b)=>a+b,0),step_wrongs:swa,revealed:rva,created_at:new Date(now-ri(r,0,19)*864e5-ri(r,0,20)*36e5).toISOString()})}}
    st.attempts.sort((a,b)=>a.created_at.localeCompare(b.created_at));
    const t0=today(),ws=wkStart(t0),nd=Math.round((Date.parse(t0)-Date.parse(ws))/864e5);
    Object.values(st.students).forEach(s=>{if(!s.last_seen)return;const P=st.points[s.sid]={};
      for(let i=0;i<=nd;i++)if(r()<0.55)P[addDays(ws,i)]=ri(r,4,32);
      for(let w=1;w<=3;w++)for(let i=0;i<7;i++)if(r()<0.4)P[addDays(ws,i-7*w)]=ri(r,5,40)});
    return st}
  async function call(fn,args){load();await sleep(120);if(!F[fn]){const e=new Error('알 수 없는 요청이에요.');e.status=404;throw e}
    const r=F[fn](JSON.parse(JSON.stringify(args||{})));lsSet(KEY,S);return r}
  function reset(){S=null;try{localStorage.removeItem(KEY)}catch(e){}}
  return{call,reset};
})();

/* 학생 로그인 상태와 기록 동기화 */
const whoLabel=a=>`${a.grade}학년 ${a.klass}반 ${a.num}번`;
const LESSON_OF={polyStep:'poly',poly:'poly',typesStep:'types',types:'types',areaStep:'area',area:'area',regularStep:'regular',regular:'regular'};
/* ───────── 교과서 유형 (지학사 중학교 수학 1, Ⅶ-01 다면체 · 211~216쪽, 240쪽) ─────────
   예전 문제 생성기(GEN.poly 등)는 그대로 두고, 교과서 유형을 섞은 새 생성기(…2)를 따로 둔다.
   복습 노트에 저장된 예전 문제(생성기 이름 + 씨앗)는 예전과 똑같이 다시 나온다. */
const TBP=p=>`<span class="tbtag">교과서 ${p}쪽 유형</span>`;
const GA='ㄱㄴㄷㄹㅁ';
const SHAPE_FACES={   // 면의 모양 (삼각형 / 사각형 묶음으로도 판단)
  '삼각기둥':['삼각형','직사각형'],'사각기둥':['직사각형'],'오각기둥':['오각형','직사각형'],'육각기둥':['육각형','직사각형'],
  '삼각뿔':['삼각형'],'사각뿔':['사각형','삼각형'],'오각뿔':['오각형','삼각형'],'육각뿔':['육각형','삼각형'],
  '삼각뿔대':['삼각형','사다리꼴'],'사각뿔대':['사각형','사다리꼴'],'오각뿔대':['오각형','사다리꼴'],
  '정사면체':['정삼각형'],'정육면체':['정사각형'],'정팔면체':['정삼각형']};
const isTri=f=>f==='삼각형'||f==='정삼각형',isQuad=f=>['사각형','직사각형','정사각형','사다리꼴'].includes(f);
/* 211쪽 1번: 몇 면체인지 말하고, 모서리와 꼭짓점의 개수 구하기 */
GEN.polyAll3=seed=>{const r=mulberry(seed);const tp=pick(r,['prism','pyramid','frustum']),Ty=TYPE[tp],n=ri(r,3,6),m=Ty.mk(n),F=Ty.F(n),E=Ty.E(n),V=Ty.V(n),pyr=tp==='pyramid';
  const nm=kn(n)+'각형';
  return{ptype:'poly:all3',title:`${TBP(211)}다음 다면체는 몇 면체인지 말하고, 모서리와 꼭짓점의 개수를 각각 구하시오.`,fig:solidFig(m),finalQ:'꼭짓점은 모두 몇 개인가요?',steps:[
    {tag:'밑면 찾기',hl:'base',q:`${T('밑면')}의 모양은?`,type:'choice',choices:shuffle(r,[n-1,n,n+1].filter(k=>k>=3).concat(n===3?[6]:[]).map(k=>kn(k)+'각형')),ans:nm,hint:pyr?'뾰족한 꼭짓점과 마주 보는 면이에요.':'위아래로 서로 평행한 두 면이에요.'},
    {tag:'면 세기 → ○면체',hl:'all',q:'면은 모두 몇 개이고, 몇 면체인가요?',type:'num',ans:F,suffix:'면체',hint:`밑면 ${pyr?1:2}개 + 옆면 ${n}개`,ok:`면이 ${F}개이므로 ${kn(F)}면체예요.`},
    {tag:'모서리 층마다 세기',hl:'Fe',q:'모서리는 모두 몇 개인가요?',type:'num',ans:E,suffix:'개',hint:pyr?`1층 둘레 ${n}개 + 층 사이(꼭대기로 가는 모서리) ${n}개`:`1층 둘레 ${n}개 + 2층 둘레 ${n}개 + 층 사이 ${n}개 → ${n} × 3`},
    {tag:'꼭짓점 층마다 세기',hl:'Fv',q:'꼭짓점은 모두 몇 개인가요?',type:'num',ans:V,suffix:'개',hint:pyr?`1층 ${n}개 + 2층(꼭대기) 1개`:`1층 ${n}개 + 2층 ${n}개 → ${n} × 2`,ok:`${kn(F)}면체 · 모서리 ${E}개 · 꼭짓점 ${V}개`}]}};
/* 215쪽 3번 · 240쪽 1번: 보기에서 면의 모양으로 고르기 */
GEN.polyFaces=seed=>{const r=mulberry(seed);
  const Q=pick(r,[
    {q:'삼각형 모양의 면을 포함하는 입체도형',t:fs=>fs.some(isTri),ask:'삼각형 모양의 면이 있나요?',p:215},
    {q:'모든 면이 삼각형인 다면체',t:fs=>fs.every(isTri),ask:'모든 면이 삼각형인가요?',p:240},
    {q:'사다리꼴 모양의 면을 포함하는 입체도형',t:fs=>fs.includes('사다리꼴'),ask:'사다리꼴 모양의 면이 있나요?',p:215},
    {q:'모든 면이 사각형인 다면체',t:fs=>fs.every(isQuad),ask:'모든 면이 사각형인가요?',p:240}]);
  let pool,yes;
  for(let k=0;k<30;k++){pool=shuffle(r,Object.keys(SHAPE_FACES)).slice(0,4);yes=pool.filter(nm=>Q.t(SHAPE_FACES[nm]));if(yes.length>=1&&yes.length<=3)break}
  const lab=pool.map((nm,i)=>GA[i]),ansSet=pool.map((nm,i)=>Q.t(SHAPE_FACES[nm])?lab[i]:null).filter(Boolean),ans=ansSet.join(', ');
  const subsets=[];for(let msk=1;msk<16;msk++){const s=lab.filter((_,i)=>msk&(1<<i));if(s.length<=3)subsets.push(s.join(', '))}
  const choices=shuffle(r,[ans,...shuffle(r,subsets.filter(s=>s!==ans)).slice(0,4)]);
  return{ptype:'poly:faces',title:`${TBP(Q.p)}다음 보기 중에서 ${Q.q}를 모두 고르시오.<div class="cond">${pool.map((nm,i)=>`${lab[i]}. ${nm}`).join('&emsp;&emsp;')}</div>`,fig:null,finalQ:'알맞은 것을 모두 고르면?',steps:[
    ...pool.map((nm,i)=>({tag:'보기 하나씩 확인하기',q:`${lab[i]}. ${josa(nm,'은','는')} ${Q.ask}`,type:'choice',choices:['예','아니요'],ans:Q.t(SHAPE_FACES[nm])?'예':'아니요',hint:`${nm}의 면: ${[...new Set(SHAPE_FACES[nm])].join(', ')}`,ok:`${nm}의 면은 ${[...new Set(SHAPE_FACES[nm])].join(', ')}이에요.`})),
    {tag:'모두 고르기',q:'알맞은 것을 모두 고르면?',type:'choice',choices,ans,hint:'위에서 "예"라고 답한 것만 골라요.'}]}};
/* 212쪽 2번: 각뿔대(각기둥 · 각뿔) 표 완성하기 — 교과서처럼 곱셈 식으로 */
GEN.typesTable=seed=>{const r=mulberry(seed);const tp=pick(r,['frustum','frustum','prism','pyramid']),Ty=TYPE[tp],n=ri(r,3,8),m=Ty.mk(n),pyr=tp==='pyramid',nm=kn(n)+Ty.nm;
  return{ptype:'types:table',title:`${TBP(212)}${nm}에 대하여 밑면과 옆면의 모양, 꼭짓점 · 모서리 · 면의 개수를 구하시오.`,fig:solidFig(m),finalQ:'면의 개수는?',steps:[
    {tag:'밑면의 모양',hl:'base',q:'밑면의 모양은?',type:'choice',choices:shuffle(r,[n-1,n,n+1].filter(k=>k>=3).concat(n===3?[6]:[]).map(k=>kn(k)+'각형')),ans:kn(n)+'각형',hint:'이름의 앞부분이 밑면의 모양이에요.'},
    {tag:'옆면의 모양',hl:'side',q:'옆면의 모양은?',type:'choice',choices:['직사각형','삼각형','사다리꼴'],ans:Ty.side,hint:pyr?'옆면이 모두 한 꼭짓점에서 만나요.':tp==='frustum'?'마주 보는 한 쌍의 변이 평행한 사각형이에요.':'두 밑면이 합동이고 평행해요.'},
    {tag:'꼭짓점의 개수',hl:'Fv',q:'꼭짓점의 개수는?',type:'num',ans:Ty.V(n),suffix:'개',hint:pyr?`밑면의 꼭짓점 ${n}개 + 꼭대기 1개 = ${n} + 1`:`한 밑면의 꼭짓점 ${n}개가 두 층 → ${n} × 2`},
    {tag:'모서리의 개수',hl:'Fe',q:'모서리의 개수는?',type:'num',ans:Ty.E(n),suffix:'개',hint:pyr?`밑면 둘레 ${n}개 + 옆 모서리 ${n}개 → ${n} × 2`:`밑면 둘레 ${n}개가 두 층 + 옆 모서리 ${n}개 → ${n} × 3`},
    {tag:'면의 개수',hl:'all',q:'면의 개수는?',type:'num',ans:Ty.F(n),suffix:'개',hint:pyr?`옆면 ${n}개 + 밑면 1개 = ${n} + 1`:`옆면 ${n}개 + 밑면 2개 = ${n} + 2`,ok:`${nm}: 꼭짓점 ${Ty.V(n)}개, 모서리 ${Ty.E(n)}개, 면 ${Ty.F(n)}개`}]}};
/* 215쪽 5번: 면의 개수가 ○인 각뿔대의 모서리 a, 꼭짓점 b → b − a (또는 a + b) */
GEN.typesDiff=seed=>{const r=mulberry(seed);const tp=pick(r,['frustum','frustum','prism','pyramid']),Ty=TYPE[tp],n=ri(r,3,9),F=Ty.F(n),a=Ty.E(n),b=Ty.V(n),op=pick(r,['b-a','a+b','a-b']);
  const val=op==='b-a'?b-a:op==='a+b'?a+b:a-b,opTx={'b-a':'<i>b</i> − <i>a</i>','a+b':'<i>a</i> + <i>b</i>','a-b':'<i>a</i> − <i>b</i>'}[op],opNum={'b-a':`${b} − ${a}`,'a+b':`${a} + ${b}`,'a-b':`${a} − ${b}`}[op];
  return{ptype:'types:diff',title:`${TBP(215)}면의 개수가 ${F}인 ${Ty.nm}의 모서리의 개수를 <span class="math">a</span>, 꼭짓점의 개수를 <span class="math">b</span>라고 할 때, <span class="rm">${opTx}</span>의 값을 구하시오.`,fig:null,
    figAfter:{at:2,fig:solidFig(Ty.mk(n)),hl:'Fe',cap:`${kn(n)}${Ty.nm} · 모서리를 층별로 칠했어요`},finalQ:`<span class="rm">${opTx}</span>의 값은?`,steps:[
    {tag:'밑면 찾기 (면의 개수로)',q:`면의 개수가 ${F}인 ${Ty.nm}의 밑면은 몇 각형인가요?`,type:'num',ans:n,suffix:'각형',hint:tp==='pyramid'?`각뿔의 면 = 옆면 n개 + 밑면 1개. n + 1 = ${F}`:`면 = 옆면 n개 + 밑면 2개. n + 2 = ${F}`},
    {tag:'모서리 a',q:`<span class="math">a</span>: ${kn(n)}${Ty.nm}의 모서리의 개수는?`,type:'num',ans:a,suffix:'개',hint:tp==='pyramid'?`${n} × 2`:`${n} × 3`},
    {tag:'꼭짓점 b',q:`<span class="math">b</span>: ${kn(n)}${Ty.nm}의 꼭짓점의 개수는?`,type:'num',ans:b,suffix:'개',hint:tp==='pyramid'?`${n} + 1`:`${n} × 2`},
    {tag:'식에 넣어 계산하기',q:`<span class="rm">${opTx}</span>의 값은?`,type:'sn',ans:val,ansText:String(val).replace('-','−'),hint:`${opNum}`+(val<0?' (뺄 수가 더 크면 음수예요)':''),ok:`${opNum} = ${String(val).replace('-','−')}`}]}};
/* 215쪽 1번 · 212쪽: 설명이 맞으면 ○, 틀리면 × */
const TYPES_TF={t:['다각형 모양의 면으로만 둘러싸인 입체도형을 다면체라고 한다.','각뿔을 그 밑면에 평행한 평면으로 잘라서 생기는 두 다면체 중에서 각뿔이 아닌 쪽의 다면체를 각뿔대라고 한다.','각뿔대의 옆면은 모두 사다리꼴이다.','각뿔대의 두 밑면은 서로 평행하다.','각기둥의 옆면은 모두 직사각형이다.','오각뿔대는 칠면체이다.','육각뿔의 꼭짓점은 7개이다.','삼각기둥과 삼각뿔대는 모두 오면체이다.'],
  f:[['각뿔대의 두 밑면은 합동이다.','각뿔대의 두 밑면은 평행하지만 크기가 달라서 합동이 아니에요.'],['각뿔대의 옆면은 직사각형이다.','각뿔대의 옆면은 사다리꼴이에요.'],['원기둥은 다면체이다.','옆면이 곡면이라서 다면체가 아니에요.'],['각뿔을 어떤 평면으로 잘라도 각뿔대가 생긴다.','각뿔의 밑면에 평행한 평면으로 잘라야 각뿔대가 생겨요.'],['육각뿔의 모서리는 18개이다.','육각뿔의 모서리는 6 × 2 = 12개예요. 18개는 육각기둥이나 육각뿔대예요.'],['오각기둥은 오면체이다.','오각기둥의 면은 옆면 5개 + 밑면 2개 = 7개라서 칠면체예요.']]};
GEN.typesTF=seed=>{const r=mulberry(seed);const nf=ri(r,1,2),fs=shuffle(r,TYPES_TF.f).slice(0,nf),ts=shuffle(r,TYPES_TF.t).slice(0,3-nf);
  const items=shuffle(r,[...ts.map(t=>({s:t,ok:true})),...fs.map(([s,w])=>({s,ok:false,w}))]);
  return{ptype:'types:tf',title:`${TBP(215)}다음 설명이 맞으면 ○, 틀리면 × 하시오.<div class="cond">${items.map((x,i)=>`(${i+1}) ${x.s}`).join('<br>')}</div>`,fig:null,finalQ:items[2].s,steps:
    items.map((x,i)=>({tag:'○ × 판단하기',q:x.s,type:'choice',choices:['○','×'],ans:x.ok?'○':'×',hint:x.ok?'교과서의 뜻과 하나하나 비교해 보세요.':'낱말 하나가 틀렸어요. 개념 카드를 다시 보세요.',ok:x.ok?'맞는 설명이에요.':x.w}))}};
/* 214쪽 4번: 정다면체가 아닌 이유 */
GEN.regularWhy=seed=>{const r=mulberry(seed);const k=pick(r,['prism','bip']);
  const R3=1.05,m=k==='bip'?bipyramid():prism(regPoly(3,R3),R3*Math.sqrt(3));
  const reasons=['각 면이 모두 정다각형이지만, 합동이 아니다.','각 면이 모두 합동인 정삼각형이지만, 각 꼭짓점에 모인 면의 개수가 같지 않다.','면이 정다각형이 아니다.'];
  const ans=k==='bip'?reasons[1]:reasons[0];
  const steps=[{tag:'면의 모양 보기',hl:'A',q:'면은 모두 정다각형인가요?',type:'choice',choices:['예','아니요'],ans:'예',hint:k==='bip'?'면은 모두 정삼각형이에요.':'정삼각형 2개와 정사각형 3개로 되어 있어요.'},
    {tag:'면이 모두 합동인지',hl:'all',q:'면이 모두 합동인가요?',type:'choice',choices:['예','아니요'],ans:k==='bip'?'예':'아니요',hint:k==='bip'?'모든 면이 똑같은 정삼각형이에요.':'정삼각형과 정사각형은 모양이 달라요.'}];
  if(k==='bip')steps.push({tag:'꼭짓점에 모인 면 세기',hl:'V:3',q:'꼭대기 꼭짓점에 모인 면은 몇 개인가요?',type:'num',ans:3,suffix:'개',hint:'주황색 점 둘레의 칠한 면을 세어 보세요.'},
    {tag:'다른 꼭짓점과 비교',hl:'V:0',q:'가운데 꼭짓점에 모인 면은 몇 개인가요?',type:'num',ans:4,suffix:'개',hint:'위에 2개, 아래에 2개가 붙어 있어요. 그림을 돌려 보세요.',ok:'3개인 곳과 4개인 곳이 섞여 있어요.'});
  steps.push({tag:'이유 고르기',q:'이 다면체가 정다면체가 아닌 이유는?',type:'choice',choices:shuffle(r,reasons),ans,hint:'정다면체의 두 조건: ① 모든 면이 합동인 정다각형 ② 각 꼭짓점에 모인 면의 개수가 같다',ok:ans});
  return{ptype:'regular:why',title:`${TBP(214)}다음 다면체는 정다면체가 아니다. 그 이유를 고르시오.`,fig:solidFig(m,{pitch:k==='bip'?0.15:0.33}),finalQ:'정다면체가 아닌 이유는?',steps}};
/* 240쪽 2번: 조건을 모두 만족하는 정다면체의 모서리(꼭짓점) 개수 */
GEN.regularCondCount=seed=>{const r=mulberry(seed);const R=pick(r,REG),part=pick(r,['E','E','V']),same=REG.filter(x=>x.face===R.face).length;
  return{ptype:'regular:condcount',title:`${TBP(240)}다음 조건을 모두 만족시키는 정다면체의 ${PART[part]}의 개수를 구하시오.<div class="cond">(가) 각 면이 합동인 ${R.face}이다.<br>(나) 각 꼭짓점에 모인 면의 개수는 ${R.deg}이다.</div>`,fig:null,
    figAfter:{at:2,fig:solidFig(SOLIDS[R.k].mk()),hl:part==='E'?'E':'Fv',cap:R.nm},finalQ:`${josa(PART[part],'은','는')} 모두 몇 개인가요?`,steps:[
    {tag:'면 모양으로 후보 고르기',q:`면이 ${R.face}인 정다면체는 모두 몇 가지인가요?`,type:'num',ans:same,suffix:'가지',hint:'정삼각형: 정사면체 · 정팔면체 · 정이십면체 / 정사각형: 정육면체 / 정오각형: 정십이면체'},
    {tag:'정다면체 이름 찾기',q:'조건을 만족하는 정다면체는?',type:'choice',choices:REG.map(x=>x.nm),ans:R.nm,hint:`면이 ${R.face}이고 한 꼭짓점에 면이 ${R.deg}개 모이는 것`},
    {tag:'개수 구하기',q:`${R.nm}의 ${josa(PART[part],'은','는')} 몇 개인가요?`,type:'num',ans:R[part],suffix:'개',hint:part==='E'?`면 ${R.F}개 × 변 ${R.n}개 ÷ 2`:`면 ${R.F}개 × 꼭짓점 ${R.n}개 ÷ ${R.deg}`,ok:`${R.nm}의 ${josa(PART[part],'은','는')} ${R[part]}개예요.`}]}};
/* 섞은 생성기: 같이 풀기(…Step2) · 혼자 풀기(…2) */
GEN.polyStep2=seed=>{const r=mulberry(seed),k=pick(r,['all3','all3','faces','old']);return k==='all3'?GEN.polyAll3(seed+1):k==='faces'?GEN.polyFaces(seed+2):GEN.polyStep(seed+3)};
GEN.poly2=seed=>{const r=mulberry(seed),k=pick(r,['all3','faces','faces','old','old']);return k==='all3'?GEN.polyAll3(seed+1):k==='faces'?GEN.polyFaces(seed+2):GEN.poly(seed+3)};
GEN.typesStep2=seed=>{const r=mulberry(seed),k=pick(r,['table','table','diff','old']);return k==='table'?GEN.typesTable(seed+1):k==='diff'?GEN.typesDiff(seed+2):GEN.typesStep(seed+3)};
GEN.types2=seed=>{const r=mulberry(seed),k=pick(r,['table','diff','tf','tf','old','old']);return k==='table'?GEN.typesTable(seed+1):k==='diff'?GEN.typesDiff(seed+2):k==='tf'?GEN.typesTF(seed+4):GEN.types(seed+3)};
GEN.regularStep2=seed=>{const r=mulberry(seed),k=pick(r,['why','cc','old','old']);return k==='why'?GEN.regularWhy(seed+1):k==='cc'?GEN.regularCondCount(seed+2):GEN.regularStep(seed+3)};
GEN.regular2=seed=>{const r=mulberry(seed),k=pick(r,['why','cc','old','old','old']);return k==='why'?GEN.regularWhy(seed+1):k==='cc'?GEN.regularCondCount(seed+2):GEN.regular(seed+3)};
Object.assign(LESSON_OF,{polyStep2:'poly',poly2:'poly',typesStep2:'types',types2:'types',regularStep2:'regular',regular2:'regular'});
/* ───────── 문제 유형 (교과서 지학사 중학교 수학 1 · Ⅶ-01) ─────────
   차시마다 유형 4가지. 같이 풀기는 유형 하나씩, 혼자 풀기는 「유형별」 또는 「섞어서」.
   유형 생성기(ty_차시_번호)는 기존 생성기에서 그 유형의 문제만 골라 내요. 같은 씨앗 → 같은 문제. */
const PTYPES={
  poly:[
    {no:1,nm:'다면체인지 판단하기',tb:'211쪽',key:'면이 모두 <b>다각형</b>이면 다면체. <b>굽은 면</b>이 하나라도 있으면 다면체가 아니에요.',pt:['poly:is'],src:['poly']},
    {no:2,nm:'몇 면체인지 구하기',tb:'211쪽 1번',key:'<b>밑면 개수 + 옆면 개수</b> = 면의 개수 → 면이 ○개면 <b>○면체</b>',pt:['poly:prism','poly:pyramid','types:name'],src:['polyStep','types']},
    {no:3,nm:'모서리 · 꼭짓점 세기',tb:'211쪽 1번',key:'<b>1층 · 2층 · 층 사이</b>로 나누어 세고 더해요.',pt:['poly:count','poly:all3','types:direct'],src:['polyAll3','poly','types']},
    {no:4,nm:'각뿔대 표 완성하기',tb:'212쪽 2번',key:'옆면: 각기둥 <b>직사각형</b> · 각뿔 <b>삼각형</b> · 각뿔대 <b>사다리꼴</b> / 밑면이 <span class="math">n</span>각형인 각뿔대: 꼭짓점 <b>2<span class="math">n</span></b> · 모서리 <b>3<span class="math">n</span></b> · 면 <b><span class="math">n</span>+2</b>',pt:['types:table','types:side'],src:['typesTable','types']},
    {no:5,nm:'개수를 보고 입체도형 찾기',tb:'215쪽 5번',key:'개수를 <span class="math">n</span>으로 나타낸 식 = 주어진 수 → <span class="math">n</span>을 구하면 <b>밑면이 <span class="math">n</span>각형</b>',pt:['types:prism','types:pyramid','types:frustum','types:diff'],src:['typesStep','typesDiff']},
    {no:6,nm:'면의 모양으로 고르기',tb:'215쪽 3번 · 240쪽 1번',key:'보기마다 <b>면의 모양을 모두</b> 떠올리고, 조건에 맞는지 하나씩 "예 / 아니요"로 확인해요.',pt:['poly:faces'],src:['polyFaces']},
    {no:7,nm:'뜻 · 성질 ○×',tb:'215쪽 1번',key:'다면체: 다각형인 면으로만 · 각뿔대: 밑면에 <b>평행하게</b> 자른 것, 두 밑면은 평행하지만 <b>합동이 아님</b>, 옆면은 <b>사다리꼴</b>',pt:['types:tf'],src:['typesTF']}],
  types:[
    {no:1,nm:'밑면 · 옆면의 모양',tb:'212쪽',key:'옆면: 각기둥은 <b>직사각형</b>, 각뿔은 <b>삼각형</b>, 각뿔대는 <b>사다리꼴</b>',pt:['types:side'],src:['types']},
    {no:2,nm:'꼭짓점 · 모서리 · 면의 개수',tb:'212쪽 2번',key:'밑면이 <span class="math">n</span>각형이면 — 각기둥·각뿔대: <b>2<span class="math">n</span> · 3<span class="math">n</span> · <span class="math">n</span>+2</b> / 각뿔: <b><span class="math">n</span>+1 · 2<span class="math">n</span> · <span class="math">n</span>+1</b> (꼭짓점 · 모서리 · 면)',pt:['types:table','types:direct','types:name'],src:['typesTable','types']},
    {no:3,nm:'개수를 보고 입체도형 찾기',tb:'215쪽 5번',key:'개수를 <span class="math">n</span>으로 나타낸 식 = 주어진 수 → <span class="math">n</span>을 구하면 <b>밑면이 <span class="math">n</span>각형</b>',pt:['types:prism','types:pyramid','types:frustum','types:diff'],src:['typesStep','typesDiff']},
    {no:4,nm:'뜻 · 성질 ○×',tb:'215쪽 1번',key:'각뿔대: 밑면에 <b>평행하게</b> 자른 것 · 두 밑면은 평행하지만 <b>합동이 아님</b> · 옆면은 <b>사다리꼴</b>',pt:['types:tf'],src:['typesTF']}],
  regular:[
    {no:1,nm:'정다면체가 아닌 이유',tb:'214쪽 4번',key:'두 조건 ① 모든 면이 <b>합동인 정다각형</b> ② 각 꼭짓점에 모인 <b>면의 개수가 같다</b> — 하나라도 어기면 정다면체가 아니에요.',pt:['regular:why'],src:['regularWhy']},
    {no:2,nm:'조건으로 정다면체 찾기',tb:'213쪽 · 240쪽 2번',key:'<b>면의 모양</b>으로 후보를 줄이고, <b>한 꼭짓점에 모인 면의 개수</b>로 하나를 고르기',pt:['regular:cond','regular:condcount'],src:['regularCondCount','regular']},
    {no:3,nm:'꼭짓점 · 모서리 · 면의 개수',tb:'214쪽 3번',key:'모서리 = 면 × 변 ÷ <b>2</b> · 꼭짓점 = 면 × 꼭짓점 ÷ <b>모인 면의 개수</b> (층으로 세어도 돼요)',pt:['regular:count','regular:edge','regular:vertex','regular:floor','regular:sum'],src:['regularStep','regular']},
    {no:4,nm:'성질 ○× · 옳지 않은 것',tb:'215쪽 1번',key:'다섯 가지의 <b>면 모양</b>과 <b>한 꼭짓점에 모인 면의 개수</b>를 표로 떠올려 하나씩 확인해요.',pt:['regular:tf'],src:['regular']}]};
const tyKey=(lid,no)=>`ty_${lid}_${no}`;
const tyBanner=(T_,open)=>`<div class="tyb"><span class="tyn">유형 ${T_.no}</span><b>${T_.nm}</b><span class="tytb">${/쪽/.test(T_.tb)?'교과서 ':''}${T_.tb}</span></div>`+
  (open?`<div class="tykey"><span>핵심</span>${T_.key}</div>`:`<details class="tykey"><summary>핵심 보기</summary>${T_.key}</details>`);
Object.entries(PTYPES).forEach(([lid,list])=>list.forEach(T_=>{const g=tyKey(lid,T_.no);
  GEN[g]=seed=>{const src=T_.src[seed%T_.src.length];for(let t=0;t<400;t++){const P=GEN[src](seed*31+t*7919);if(T_.pt.includes(P.ptype))return P}return GEN[T_.src[0]](seed)};
  LESSON_OF[g]=lid}));
Object.keys(PTYPES).forEach(lid=>{GEN['mix_'+lid]=seed=>{const L=PTYPES[lid];return GEN[tyKey(lid,L[seed%L.length].no)](Math.floor(seed/L.length)+1)};LESSON_OF['mix_'+lid]=lid});
function typeOf(ptype){for(const[lid,list]of Object.entries(PTYPES))for(const T_ of list)if(T_.pt.includes(ptype))return{lid,T:T_};return null}
/* ───────── 1차시 「다면체 · 각뿔대」 유형 5가지 (풀이 절차로 나눔) ─────────
   ① 무엇인지 가려내기 ② 이름 짓기(2가지) ③ 그림 보고 개수 세기 ④ 이름만 보고 개수 구하기 ⑤ 거꾸로 찾기 */
const FAM={prism:{nm:'각기둥',bases:2,cong:true},frustum:{nm:'각뿔대',bases:2,cong:false},pyramid:{nm:'각뿔',bases:1}};
const LAYER={ // 층 구조: [1층, 2층, 층 사이]
  V:(tp,n)=>[n,tp==='pyramid'?1:n,0],E:(tp,n)=>[n,tp==='pyramid'?0:n,n],F:(tp,n)=>[1,tp==='pyramid'?0:1,n]};
const PART_HL={V:'Fv',E:'Fe',F:'Ff'};
/* ① 가려내기: 다면체 O/X → O이면 각기둥 · 각뿔 · 각뿔대 · 셋 다 아닌 다면체 */
const SORT_OX=['O','X'],SORT_FAM=['각기둥','각뿔','각뿔대','셋 다 아닌 다면체'];
GEN.p5family=seed=>{const r=mulberry(seed),u=r();
  const title='다음 입체도형이 다면체인지 O, X로 답하고, 다면체라면 각기둥, 각뿔, 각뿔대, 셋 다 아닌 다면체 중 무엇인지 고르시오.';
  const ox=(isP,why)=>({tag:'다면체 O/X',gate:true,q:'이 입체도형은 다면체인가요?',type:'choice',choices:SORT_OX,ans:isP?'O':'X',
    hint:'굽은 면(곡면)이 있는지 살펴보세요. 모든 면이 다각형이면 다면체예요.',why});
  const fin=ans=>({q:'다면체인가요? 다면체라면 무엇인가요?',type:'choice',choices:['다면체 X',...SORT_FAM],ans});
  if(u<0.25){const S=SOLIDS[pick(r,['cyl','cone','sph'])];
    return{ptype:'poly:is',sig:'ox',title,fig:solidFig(S.mk()),final:fin('다면체 X'),steps:[Object.assign(ox(false,S.why),{ok:`${josa(S.name,'은','는')} 다면체가 아니에요.`})]}}
  if(u<0.4){const S=SOLIDS[pick(r,['oct','ico','dod'])];
    return{ptype:'poly:family',sig:'other',title,fig:solidFig(S.mk()),final:fin('셋 다 아닌 다면체'),steps:[ox(true,'모든 면이 다각형이라서 다면체예요.'),
      {tag:'무엇인지',q:'어떤 다면체인가요?',type:'choice',choices:SORT_FAM,ans:'셋 다 아닌 다면체',
       hint:'밑면이 될 만한 면이 있는지, 옆면이 직사각형 · 삼각형 · 사다리꼴로 둘러싸였는지 보세요.',why:`${josa(S.name,'은','는')} 밑면과 옆면으로 나눌 수 없어서 각기둥 · 각뿔 · 각뿔대가 아니에요.`,ok:`다면체이지만 셋 다 아니에요. (${S.name})`}]}}
  const tp=pick(r,['prism','pyramid','frustum']),n=ri(r,3,6),Ty=TYPE[tp],m=Ty.mk(n),F_=FAM[tp];
  return{ptype:'poly:family',sig:'fam',title,fig:solidFig(m),final:fin(F_.nm),steps:[ox(true,'모든 면이 다각형이라서 다면체예요.'),
    {tag:'무엇인지',hl:'base',q:'어떤 다면체인가요?',type:'choice',choices:SORT_FAM,ans:F_.nm,
     hint:'밑면이 몇 개인지, 두 밑면의 크기가 같은지, 옆면이 어떤 모양인지 보세요.',
     why:F_.bases===1?'밑면 1개 + 옆면 삼각형 → 각뿔':F_.cong?'밑면 2개가 합동 + 옆면 직사각형 → 각기둥':'밑면 2개가 크기가 다름 + 옆면 사다리꼴 → 각뿔대',ok:`다면체이고, ${F_.nm}이에요.`}]}};
/* ② 이름 짓기 2가지: 면의 개수로 · 모양으로 */
GEN.p5name2=seed=>{const r=mulberry(seed);const tp=pick(r,['prism','pyramid','frustum']),n=ri(r,3,7),Ty=TYPE[tp],m=Ty.mk(n),F=Ty.F(n),fam=FAM[tp].nm,nm=kn(n)+fam;
  const famCh=['각기둥','각뿔','각뿔대'];
  return{ptype:'poly:name2',title:'다음 다면체의 이름을 두 가지로 말하시오.<div class="cond">(1) 면의 개수로 짓는 이름&emsp;(2) 모양으로 짓는 이름</div>',fig:solidFig(m),finalQ:'모양으로 짓는 이름은?',steps:[
    {tag:'면 세기',hl:'all',q:'면은 모두 몇 개인가요?',type:'num',ans:F,suffix:'개',why:`밑면 ${FAM[tp].bases}개 + 옆면 ${n}개 = ${F}개`},
    {tag:'(1) 면의 개수로',q:'면의 개수로 짓는 이름은?',type:'num',ans:F,suffix:'면체',why:`면이 ${F}개 → ${kn(F)}면체`},
    {tag:'밑면 모양',hl:'base',q:`${T('밑면')}의 모양은?`,type:'choice',choices:shuffle(r,[n-1,n,n+1].filter(k=>k>=3).concat(n===3?[6]:[]).map(k=>kn(k)+'각형')),ans:kn(n)+'각형',why:`밑면의 변을 세면 ${n}개 → ${kn(n)}각형`},
    {tag:'가족 찾기',hl:'side',q:'각기둥, 각뿔, 각뿔대 중 무엇인가요?',type:'choice',choices:famCh,ans:fam,why:`옆면이 ${Ty.side} → ${fam}`},
    {tag:'(2) 모양으로',q:'모양으로 짓는 이름은?',type:'choice',choices:shuffle(r,[...new Set([nm,kn(n)+famCh.find(x=>x!==fam),kn(F)+fam,kn(n+1)+fam,kn(n)+famCh.filter(x=>x!==fam)[1]])].slice(0,4)),ans:nm,why:`밑면 ${kn(n)}각형 + ${fam} → ${nm}`,ok:`${kn(F)}면체이고, ${nm}${fam==='각뿔대'?'예요':'이에요'}.`}]}};
/* ④ 이름만 보고 개수 구하기 (그림 없이 층을 떠올려요) */
GEN.p5byname=seed=>{const r=mulberry(seed);const tp=pick(r,['prism','pyramid','frustum']),n=ri(r,3,9),Ty=TYPE[tp],part=pick(r,['V','E','E','F']),L=LAYER[part](tp,n),tot=L[0]+L[1]+L[2],nm=kn(n)+FAM[tp].nm,P_=PART[part];
  const unitOf={V:'꼭짓점',E:'모서리',F:'면'}[part];
  const st=[{tag:'밑면 찾기',q:`${nm}의 밑면은 몇 각형인가요?`,type:'num',ans:n,suffix:'각형',why:`이름의 앞부분 "${kn(n)}"이 밑면의 모양이에요.`},
    {tag:'1층 세기',q:`1층(아래 밑면)의 ${josa(unitOf,'은','는')} 몇 개인가요?`,type:'num',ans:L[0],suffix:'개',why:part==='F'?'1층은 밑면 1개예요.':`밑면이 ${kn(n)}각형이라 ${unitOf} ${n}개`},
    {tag:'2층 세기',q:`2층(위)의 ${josa(unitOf,'은','는')} 몇 개인가요?`,type:'num',ans:L[1],suffix:'개',why:tp==='pyramid'?(part==='V'?'각뿔의 2층은 꼭대기 점 1개뿐이에요.':'각뿔의 2층은 점 하나라서 '+unitOf+'이 없어요.'):(part==='F'?'2층도 밑면 1개예요.':`2층도 ${kn(n)}각형이라 ${n}개`)}];
  if(part!=='V')st.push({tag:'층 사이 세기',q:`1층과 2층 사이의 ${josa(unitOf,'은','는')} 몇 개인가요?`,type:'num',ans:L[2],suffix:'개',why:part==='E'?`밑면의 꼭짓점마다 위로 올라가는 모서리가 1개씩 → ${n}개`:`밑면의 변마다 옆면이 1개씩 → ${n}개`});
  st.push({tag:'더하기',q:`${josa(P_,'은','는')} 모두 몇 개인가요?`,type:'num',ans:tot,suffix:'개',why:part==='V'?`${L[0]} + ${L[1]} = ${tot}`:`${L[0]} + ${L[1]} + ${L[2]} = ${tot}`,ok:`${nm}의 ${josa(P_,'은','는')} ${tot}개예요.`});
  return{ptype:'poly:byname',sig:part,title:`${nm}의 ${P_}의 개수를 구하시오.`,fig:null,figAfter:{at:1,fig:solidFig(Ty.mk(n)),hl:PART_HL[part],cap:`${nm} · ${josa(P_,'을','를')} 층별로 칠했어요`},finalQ:`${josa(P_,'은','는')} 모두 몇 개인가요?`,steps:st}};
/* ⑤ 거꾸로: 개수가 ○인 다면체를 모두 찾기 (각기둥·각뿔·각뿔대) */
GEN.p5findAll=seed=>{const r=mulberry(seed);const part=pick(r,['E','E','V','F']);
  const val=part==='E'?pick(r,[12,18,24]):part==='V'?pick(r,[8,10,12]):pick(r,[6,7,8]);
  const f={E:{prism:'3n',frustum:'3n',pyramid:'2n'},V:{prism:'2n',frustum:'2n',pyramid:'n + 1'},F:{prism:'n + 2',frustum:'n + 2',pyramid:'n + 1'}}[part];
  const solve=e=>e==='3n'?val/3:e==='2n'?val/2:e==='n + 1'?val-1:val-2;
  const res=['prism','frustum','pyramid'].map(tp=>({tp,n:solve(f[tp])})),names=res.map(x=>kn(x.n)+FAM[x.tp].nm),ans=names.join(', ');
  const wrong=[[res[0].n+1,'각기둥'],[res[2].n+1,'각뿔']].map(([k,fm])=>kn(k)+fm);
  const choices=shuffle(r,[ans,`${names[0]}, ${names[1]}`,`${names[0]}, ${names[1]}, ${wrong[1]}`,`${wrong[0]}, ${names[1]}, ${names[2]}`]);
  const nI=x=>x.replace('n','<span class="math">n</span>'),P_=PART[part];
  const steps=res.map((x,i)=>({tag:`${FAM[x.tp].nm}이라면`,q:`<span class="math">n</span>${FAM[x.tp].nm}의 ${josa(P_,'은','는')} ${nI(f[x.tp])}개예요. ${nI(f[x.tp])} = ${val}이면 <span class="math">n</span>은?`,type:'num',ans:x.n,why:`${nI(f[x.tp])} = ${val} → <span class="math">n</span> = ${x.n} → ${names[i]}`,ok:`${names[i]}`}));
  steps.push({tag:'모두 고르기',q:`${josa(P_,'이','가')} ${val}개인 다면체를 모두 고르면?`,type:'choice',choices,ans,why:'위에서 찾은 세 가지를 모두 골라요.'});
  return{ptype:'poly:findall',sig:part,title:`${P_}의 개수가 ${val}인 다면체를 각기둥, 각뿔, 각뿔대 중에서 모두 찾으시오.`,fig:null,finalQ:'모두 고르면?',steps}};
PTYPES.poly=[
  {no:1,nm:'무엇인지 가려내기',tb:'다면체 · 각기둥 · 각뿔 · 각뿔대',key:'① <b>굽은 면</b>이 있으면 다면체 X ② 다면체(O)라면 밑면 <b>개수</b> · <b>크기</b>, 옆면 <b>모양</b>으로 각기둥 · 각뿔 · 각뿔대, 어디에도 맞지 않으면 <b>셋 다 아닌 다면체</b>',pt:['poly:is','poly:family'],src:['p5family']},
  {no:2,nm:'이름 짓기 (2가지)',tb:'○면체 · ○각뿔대',key:'① 면을 세어 <b>○면체</b> ② 밑면 모양 + 가족 이름 → <b>○각뿔대</b>',pt:['poly:name2'],src:['p5name2']},
  {no:3,nm:'그림 보고 개수 세기',tb:'꼭짓점 · 모서리 · 면',key:'<b>1층 · 2층 · 층 사이</b>로 나누어 세고 더해요.',pt:['poly:count','poly:all3'],src:['polyAll3','poly']},
  {no:4,nm:'이름만 보고 개수 구하기',tb:'그림 없이',key:'이름에서 <b>밑면</b>과 <b>가족</b>을 찾고, 머릿속에 층을 그려 <b>1층 + 2층 + 층 사이</b>',pt:['poly:byname'],src:['p5byname']},
  {no:5,nm:'거꾸로 찾기',tb:'개수 → 도형',key:'개수를 <span class="math">n</span>으로 나타낸 식 = 주어진 수 → <span class="math">n</span>을 구하면 <b>밑면이 <span class="math">n</span>각형</b>',pt:['types:prism','types:pyramid','types:frustum','types:diff','poly:findall'],src:['typesStep','typesDiff','p5findAll']}];
PTYPES.poly.forEach(T_=>{const g=tyKey('poly',T_.no);
  GEN[g]=seed=>{const src=T_.src[seed%T_.src.length];for(let t=0;t<400;t++){const P=GEN[src](seed*31+t*7919);if(T_.pt.includes(P.ptype))return P}return GEN[T_.src[0]](seed)};LESSON_OF[g]='poly'});
/* ───────── 2차시 「정다면체」 유형 5가지 (풀이 절차로 나눔) ─────────
   ① 정다면체인지 가려내기 ② 그림 · 조건으로 이름 찾기 ③ 개수 구하기(층 · 겹쳐 세기) ④ 한 꼭짓점에 모을 수 있을까 ⑤ 성질 ○×
   수업 시연(정다면체 2차시)과 같은 흐름: 정다각형 → 두 조건(직육면체 ✕ · 삼각쌍뿔 ✕) → 다섯 가지 → 층으로 세기 → 각의 합 */
const cuboid=()=>prism([[-1.25,-0.7],[1.25,-0.7],[1.25,0.7],[-1.25,0.7]],1.0);
const triPrism=()=>prism(regPoly(3,1.05),1.05*Math.sqrt(3));
const lowVertex=m=>{let b=0;m.V.forEach((p,i)=>{if(p[2]<m.V[b][2]-1e-9)b=i});return b};
const RG_NON={
  cuboid:{nm:'직육면체',mk:cuboid,c1:false,why1:'면이 <b>직사각형</b>이에요. 직사각형은 네 변의 길이가 같지 않아서 정다각형이 아니에요.'},
  tprism:{nm:'삼각기둥',mk:triPrism,c1:false,why1:'정삼각형과 정사각형이 섞여 있어요. 모양이 다르니 면이 모두 <b>합동</b>은 아니에요.'},
  bip:{nm:'삼각쌍뿔',mk:()=>bipyramid(),c1:true,top:3,other:0,pitch:0.3}};
const RG_FACE_WHY={tet:'정삼각형 4개',cube:'정사각형 6개',oct:'정삼각형 8개',dod:'정오각형 12개',ico:'정삼각형 20개'};
/* ① 정다면체인지 가려내기 */
GEN.rgIs=seed=>{const r=mulberry(seed),u=r();
  const isReg=u<0.5,key=isReg?pick(r,['tet','cube','oct','dod','ico']):pick(r,['cuboid','bip','bip','tprism']);
  const N=isReg?null:RG_NON[key],R=isReg?REG.find(x=>x.k===key):null,m=isReg?SOLIDS[key].mk():N.mk(),nm=isReg?R.nm:N.nm;
  const title='다음 다면체가 정다면체인지 O, X로 답하시오.<div class="cond">정다면체의 조건 ① 모든 면이 합동인 정다각형 ② 각 꼭짓점에 모인 면의 개수가 같다</div>';
  const fin=ans=>({q:'이 다면체는 정다면체인가요?',type:'choice',choices:['O','X'],ans});
  const c1=isReg||N.c1;
  const steps=[{tag:'조건 ① 면 보기',gate:true,hl:'A',q:'조건 ① 면이 모두 <b>합동인 정다각형</b>인가요?',type:'choice',choices:['예','아니요'],ans:c1?'예':'아니요',
    hint:'면 하나하나의 모양을 보세요. 변의 길이가 모두 같은 정다각형인지, 모든 면이 똑같은지 확인해요.',why:isReg?`면이 모두 ${RG_FACE_WHY[key]}예요.`:N.c1?'면이 모두 똑같은 정삼각형이에요.':N.why1}];
  if(!c1){steps.push({tag:'판단',q:'이 다면체는 정다면체인가요?',type:'choice',choices:['O','X'],ans:'X',why:'조건 ①을 만족하지 않으면 정다면체가 아니에요.',ok:`${josa(nm,'은','는')} 정다면체가 아니에요.`});
    return{ptype:'regular:is',sig:'c1',title,fig:solidFig(m),final:fin('X'),steps}}
  const t=isReg?topVertex(m):N.top,o=isReg?lowVertex(m):N.other,dt=isReg?R.deg:3,dob=isReg?R.deg:4;
  steps.push({tag:'조건 ② 위 꼭짓점',hl:'V:'+t,q:'주황색 꼭짓점에 모인 면은 몇 개인가요?',type:'num',ans:dt,suffix:'개',hint:'주황색 점 둘레의 칠한 면을 하나씩 세어 보세요. 그림을 돌리면 뒤쪽도 보여요.'},
    {tag:'조건 ② 다른 꼭짓점',hl:'V:'+o,q:`이번에는 ${isReg?'아래쪽':'가운데'} 꼭짓점이에요. 모인 면은 몇 개인가요?`,type:'num',ans:dob,suffix:'개',hint:isReg?'아래쪽 주황색 점 둘레를 세어 보세요.':'위에 2개, 아래에 2개가 붙어 있어요. 그림을 돌려 보세요.',why:dt===dob?`두 꼭짓점 모두 ${dt}개로 같아요.`:`위는 ${dt}개, 가운데는 ${dob}개로 달라요.`},
    {tag:'판단',q:'이 다면체는 정다면체인가요?',type:'choice',choices:['O','X'],ans:isReg?'O':'X',why:isReg?'조건 ①, ②를 모두 만족해요.':'면이 모두 합동인 정삼각형이어도 꼭짓점마다 모인 면의 개수가 다르면 정다면체가 아니에요.',ok:isReg?`${R.nm}, 정다면체예요.`:`${josa(nm,'은','는')} 정다면체가 아니에요.`});
  return{ptype:'regular:is',sig:'c2',title,fig:solidFig(m,{pitch:N&&N.pitch!=null?N.pitch:0.33}),final:fin(isReg?'O':'X'),steps}};
/* ② 그림 보고 이름 찾기 (면의 모양 → 모인 면 → 이름) */
GEN.rgName=seed=>{const r=mulberry(seed),R=pick(r,REG.filter(x=>x.k!=='tet'&&x.k!=='cube').concat(REG)),m=SOLIDS[R.k].mk(),t=topVertex(m);
  return{ptype:'regular:name',title:'다음 정다면체의 이름을 구하시오.',fig:solidFig(m),finalQ:'이 정다면체의 이름은?',steps:[
    {tag:'면의 모양',hl:'A',q:'면은 어떤 정다각형인가요?',type:'choice',choices:['정삼각형','정사각형','정오각형'],ans:R.face,hint:'면 하나의 변을 세어 보세요. 3개면 정삼각형, 4개면 정사각형, 5개면 정오각형이에요.'},
    {tag:'모인 면 세기',hl:'V:'+t,q:'주황색 꼭짓점에 모인 면은 몇 개인가요?',type:'num',ans:R.deg,suffix:'개',hint:'주황색 점 둘레의 칠한 면을 세어 보세요.'},
    {tag:'이름 찾기',q:'이 정다면체의 이름은?',type:'choice',choices:REG.map(x=>x.nm),ans:R.nm,hint:'정삼각형: 3개 → 정사면체, 4개 → 정팔면체, 5개 → 정이십면체 / 정사각형 → 정육면체 / 정오각형 → 정십이면체',why:`${R.face} · 모인 면 ${R.deg}개 → ${R.nm}`,ok:`${R.nm}예요. 면이 ${R.F}개라서 ${kn(R.F)}면체예요.`}]}};
/* ④ 한 꼭짓점에 모을 수 있을까? (각의 합 < 360°) */
const RG_FAN=[[3,3],[3,4],[3,5],[3,6],[4,3],[4,4],[5,3],[5,4],[6,3],[3,3],[3,4],[3,5],[4,3],[5,3]];  /* 만들 수 있는 경우를 두 번씩 */
GEN.rgFan=seed=>{const r=mulberry(seed),[n,k]=pick(r,RG_FAN),a=inAng(n),s=a*k,key=REG_OF[n+','+k],R=key?REG.find(x=>x.k===key):null;
  const cmp=s<360?'360°보다 작다':s===360?'360°와 같다':'360°보다 크다';
  const steps=[{tag:'한 내각',q:`${POLY_NM[n]}의 한 내각은 몇 도인가요?`,type:'choice',choices:['60°','90°','108°','120°'],ans:a+'°',hint:'정삼각형 60° · 정사각형 90° · 정오각형 108° · 정육각형 120°'},
    {tag:'각의 합',q:`${k}개를 한 꼭짓점에 모으면 각의 합은 몇 도인가요?`,type:'num',ans:s,suffix:'°',hint:`${a}° × ${k} = ${Array(k).fill(a+'°').join(' + ')}`},
    {tag:'360°와 비교',gate:true,q:'각의 합을 360°와 비교하면?',type:'choice',choices:['360°보다 작다','360°와 같다','360°보다 크다'],ans:cmp,hint:`${s}°와 360°를 비교해 보세요.`,why:s<360?`틈이 ${360-s}° 남아요. 틈을 접어 올리면 뾰족한 꼭짓점이 돼요.`:s===360?'틈이 없어서 평평하게 깔려요.':'360°를 넘어서 면끼리 겹쳐요.'}];
  if(R)steps.push({tag:'정다면체 찾기',q:'접어 올리면 어떤 정다면체의 꼭짓점이 되나요?',type:'choice',choices:REG.map(x=>x.nm),ans:R.nm,hint:`면이 ${R.face}이고 한 꼭짓점에 ${k}개가 모이는 정다면체`,ok:`${R.nm}예요.`});
  else steps.push({tag:'입체가 될까',q:'한 꼭짓점에 모아 입체를 만들 수 있나요?',type:'choice',choices:['만들 수 있다','만들 수 없다'],ans:'만들 수 없다',why:s===360?'360°이면 평평해서 입체의 꼭짓점이 될 수 없어요.':'360°를 넘으면 겹쳐서 모을 수 없어요.',ok:'입체를 만들 수 없어요.'});
  return{ptype:'regular:fan',title:`${POLY_NM[n]} ${k}개를 한 꼭짓점에 모았어요. 접어 올려 입체를 만들 수 있는지 알아보시오.<div class="cond" style="text-align:center">${fanSVG(n,k,170,{plain:true})}</div>`,fig:null,
    final:{q:'입체를 만들 수 있나요? 있다면 어떤 정다면체인가요?',type:'choice',choices:['만들 수 없다',...REG.map(x=>x.nm)],ans:R?R.nm:'만들 수 없다'},steps}};
/* ⑤ 성질 ○×: 설명을 하나씩 ○ ×로 확인한 뒤 옳지 않은 것 고르기 (215쪽 1번) */
GEN.rgTF=seed=>{const r=mulberry(seed),[fs,why]=pick(r,REG_TF.f),ts=shuffle(r,REG_TF.t.slice()).slice(0,3),all=shuffle(r,[...ts,fs]),bad=all.indexOf(fs);
  const steps=all.map((x,i)=>({tag:`${CIRC[i]} 확인`,q:`${CIRC[i]} ${x}`,type:'choice',choices:['○','×'],ans:x===fs?'×':'○',hint:'면의 모양 · 한 꼭짓점에 모인 면 · 면, 모서리, 꼭짓점의 개수 표를 떠올려 보세요.',why:x===fs?why:'맞는 설명이에요.'}));
  steps.push({tag:'옳지 않은 것',q:'옳지 않은 것은?',type:'choice',choices:CIRC.slice(0,4),ans:CIRC[bad],why:`${CIRC[bad]}만 ×예요.`,ok:why});
  return{ptype:'regular:tf',title:`${TBP(215)}다음 중 정다면체에 대한 설명으로 <u>옳지 않은</u> 것은?<div class="cond">${all.map((x,i)=>CIRC[i]+' '+x).join('<br>')}</div>`,fig:null,finalQ:'옳지 않은 것은?',steps}};
PTYPES.regular=[
  {no:1,nm:'정다면체인지 가려내기',tb:'213쪽 · 214쪽 4번',key:'① 면이 모두 <b>합동인 정다각형</b>인가? ② <b>꼭짓점마다</b> 모인 면의 개수가 같은가? 둘 다 예 → 정다면체 O',pt:['regular:is','regular:why'],src:['rgIs','rgIs','regularWhy']},
  {no:2,nm:'이름 찾기',tb:'213쪽 · 240쪽 2번',key:'<b>면의 모양</b>으로 후보를 줄이고, <b>한 꼭짓점에 모인 면의 개수</b>로 하나를 골라요.',pt:['regular:name','regular:cond'],src:['rgName','rgName','regular']},
  {no:3,nm:'꼭짓점 · 모서리 · 면의 개수',tb:'214쪽 3번',key:'면: 이름에 있어요 · 꼭짓점: <b>층마다</b> 세어 더하기 · 모서리 = 면 × 변 ÷ <b>2</b>',pt:['regular:floor','regular:edge','regular:vertex','regular:count','regular:condcount','regular:sum'],src:['regularStep','regularStep','regularCondCount','regular']},
  {no:4,nm:'한 꼭짓점에 모을 수 있을까?',tb:'왜 다섯 가지뿐일까',key:'한 꼭짓점에 모인 각의 합이 <b>360°보다 작아야</b> 접어 올려 입체가 돼요.',pt:['regular:fan'],src:['rgFan']},
  {no:5,nm:'성질 ○× · 옳지 않은 것',tb:'215쪽 1번',key:'설명을 <b>하나씩 ○ ×</b>로 확인하고, ×인 것을 골라요. 면 모양 · 모인 면 · 개수 표를 떠올려요.',pt:['regular:tf'],src:['rgTF']}];
PTYPES.regular.forEach(T_=>{const g=tyKey('regular',T_.no);
  GEN[g]=seed=>{const src=T_.src[seed%T_.src.length];for(let t=0;t<400;t++){const P=GEN[src](seed*31+t*7919);if(T_.pt.includes(P.ptype))return P}return GEN[T_.src[0]](seed)};LESSON_OF[g]='regular'});

const stripTB=s=>s.replace(/<span class="tbtag">[^<]*<\/span>/g,'');


/* base = 이 기기가 마지막으로 서버와 맞춘 기록의 버전(_ts).
   이 기기의 _ts ≠ base → 아직 올리지 않은 변경이 있음. 서버의 _ts ≠ base → 다른 기기에서 바뀜. 둘 다면 합친다. */
const baseKey=()=>'hangeoreum-base:'+(AUTH?AUTH.sid:'');
const getBase=()=>+lsGet(baseKey(),0)||0;
const setBase=(v,d)=>{lsSet(baseKey(),+v||0);lsSet(baseKey()+':pts',(d&&d._me&&+d._me.pts)||0)};
const getBasePts=()=>+lsGet(baseKey()+':pts',0)||0;
const localDirty=()=>isStudent()&&(+DB._ts||0)!==getBase();
const STALE_MS=2*60*1000;
function mergeVal(x,y){if(x===undefined||x===null)return y;if(y===undefined||y===null)return x;
  if(typeof x==='boolean'&&typeof y==='boolean')return x||y;
  if(typeof x==='number'&&typeof y==='number')return Math.max(x,y);
  if(typeof x==='string'&&typeof y==='string')return x>y?x:y;
  if(Array.isArray(x)||Array.isArray(y))return y;
  if(typeof x==='object'&&typeof y==='object'){const o={};new Set([...Object.keys(x),...Object.keys(y)]).forEach(k=>{o[k]=mergeVal(x[k],y[k])});return o}
  return y}
function mergeDB(L,S){L=L||{};S=S||{};const out={},newer=(+L._ts||0)>(+S._ts||0)?L:S;
  new Set([...Object.keys(L),...Object.keys(S)]).forEach(k=>{const a=L[k],b=S[k];
    if(a===undefined){out[k]=b;return}if(b===undefined){out[k]=a;return}
    if(k==='_ts'||k==='_last'){out[k]=newer[k];return}
    if(k==='_shop'&&a&&b){const o=mergeVal(a,b);o.eq=(newer[k]&&newer[k].eq)||o.eq;out[k]=o;return}
    if(k==='_rev'){const m=new Map();[...(Array.isArray(b)?b:[]),...(Array.isArray(a)?a:[])].forEach(x=>{if(!x||typeof x!=='object')return;const id=x.g+'|'+x.seed,o=m.get(id);
      if(!o||(x.stage||0)>(o.stage||0)||((x.stage||0)===(o.stage||0)&&String(x.due)>String(o.due)))m.set(id,x)});out[k]=[...m.values()];return}
    if(k==='_drill'){const o=mergeVal(a,b);const bs=[a&&a.best,b&&b.best].filter(v=>typeof v==='number');if(bs.length)o.best=Math.min(...bs);out[k]=o;return}
    if(k==='_me'&&a&&b){const o=mergeVal(a,b);const la=a.last||'',lb=b.last||'';o.streak=(la===lb?Math.max(a.streak||0,b.streak||0):(la>lb?a.streak:b.streak))||0;
      if(a.badges&&b.badges){o.badges={};new Set([...Object.keys(a.badges),...Object.keys(b.badges)]).forEach(x=>{o.badges[x]=[a.badges[x],b.badges[x]].filter(Boolean).sort()[0]})}
      out[k]=o;return}
    if(a&&b&&typeof a==='object'&&typeof b==='object'&&(a.prac||b.prac)){const o=mergeVal(Object.assign({},a,{prac:null}),Object.assign({},b,{prac:null}));
      o.prac=!a.prac?b.prac:!b.prac?a.prac:((a.prac.solved||0)>=(b.prac.solved||0)?a.prac:b.prac);out[k]=o;return}
    out[k]=mergeVal(a,b)});
  return out}
function schedulePush(ms){clearTimeout(SYNC.timer);SYNC.timer=setTimeout(()=>pushDB(),ms)}
async function pushDB(keepalive){if(!isStudent()||SYNC.busy||!localDirty())return;SYNC.busy=true;
  try{if(!keepalive&&Date.now()-SYNC.contact>STALE_MS){if(!await pullDB(true))return;if(!localDirty())return}
    const snap=JSON.parse(JSON.stringify(DB));
    await API.call('hg_save_progress',{p_token:AUTH.token,p_data:snap},{keepalive});
    setBase(snap._ts,snap);SYNC.contact=Date.now();SYNC.last=new Date();SYNC.err=null;flushOutbox()}
  catch(e){SYNC.err=e.message;if(isAuthErr(e))authExpired()}
  finally{SYNC.busy=false;updateWho();if(isStudent()&&!SYNC.err&&localDirty())schedulePush(1500)}}
function refreshAfterPull(){updatePill();route(true)}  /* 화면이 예전 기록 객체를 붙잡고 있지 않게 다시 그린다 */
async function pullDB(fromPush){if(!isStudent())return false;if(!fromPush&&(SYNC.busy||SYNC.pulling))return false;SYNC.pulling=true;
  try{const r=await API.call('hg_get_progress',{p_token:AUTH.token});const srv=(r&&r.data&&typeof r.data==='object'&&!Array.isArray(r.data))?r.data:{};
    if(!isStudent())return false;
    const st=+srv._ts||0;SYNC.contact=Date.now();SYNC.err=null;if(!SYNC.last)SYNC.last=new Date();
    if(st!==getBase()){
      if(!localDirty())DB=srv;
      else{const gained=Math.max(0,((DB._me&&+DB._me.pts)||0)-getBasePts());DB=mergeDB(DB,srv);
        if(DB._me)DB._me.pts=((srv._me&&+srv._me.pts)||0)+gained;DB._ts=Date.now()}
      lsSet(storeKey(),DB);setBase(st,srv);refreshAfterPull()}
    if(!fromPush&&localDirty())schedulePush(300);
    flushOutbox();return true}
  catch(e){SYNC.err=e.message;if(isAuthErr(e))authExpired();return false}
  finally{SYNC.pulling=false;updateWho()}}
async function settleSync(){for(let i=0;i<60&&(SYNC.busy||SYNC.pulling);i++)await sleep(100);if(localDirty())await pushDB()}
const obKey=()=>'hangeoreum-outbox:'+(AUTH?AUTH.sid:'');
function logAttempt(o){if(!isStudent())return;const item={p_lesson:o.lesson,p_kind:o.kind,p_good:!!o.good,p_wrongs:o.wrongs||0,p_mode:o.mode||null,p_gen:o.gen||null,p_seed:o.seed??null,p_ptype:o.ptype||null,p_step_wrongs:o.stepWrongs||null,p_revealed:o.revealed||null};
  const ob=lsGet(obKey(),[]);ob.push(item);lsSet(obKey(),ob.slice(-300));flushOutbox()}
let obBusy=false;
async function flushOutbox(){if(!isStudent()||obBusy)return;const key=obKey();let ob=lsGet(key,[]);if(!ob.length)return;obBusy=true;
  try{while(ob.length){try{await API.call('hg_log_attempt',Object.assign({p_token:AUTH.token},ob[0]))}catch(e){if(e.net||isAuthErr(e))throw e}ob.shift();lsSet(key,ob)}}
  catch(e){if(isAuthErr(e))authExpired()}finally{obBusy=false}}
function authExpired(){if(!isStudent())return;clearTimeout(SYNC.timer);AUTH=null;try{localStorage.removeItem(AUTH_KEY)}catch(e){}loadDB();updatePill();updateWho();toast('로그인이 끝났어요. 다시 로그인해 주세요.')}
async function studentLogin(sid,pin){const r=await API.call('hg_login',{p_sid:sid,p_pin:pin});if(!r||!r.ok)return r||{ok:false,msg:'로그인하지 못했어요.'};
  AUTH={role:'student',token:r.token,sid:r.sid,grade:r.grade,klass:r.klass,num:r.num};lsSet(AUTH_KEY,AUTH);loadDB();SYNC.last=null;SYNC.err=null;SYNC.contact=0;GAME.st=null;GAME.off=false;markActive();updatePill();updateWho();await pullDB();return r}
async function studentLogout(){if(!isStudent())return true;clearTimeout(SYNC.timer);clearTimeout(GAME.ptsT);await flushPts();await settleSync();await flushOutbox();
  const ok=!localDirty()&&!lsGet(obKey(),[]).length;if(!Object.keys(OBJ(lsGet(ptsKey(),{}))).length)try{localStorage.removeItem(ptsKey())}catch(e){}API.call('hg_logout',{p_token:AUTH.token}).catch(()=>{});
  if(ok){try{[storeKey(),baseKey(),baseKey()+':pts',obKey(),bbLedKey()].forEach(k=>localStorage.removeItem(k))}catch(e){}}  /* 함께 쓰는 기기에 기록을 남기지 않기 (서버에 다 저장된 경우만) */
  AUTH=null;SYNC.err=null;GAME.st=null;try{localStorage.removeItem(AUTH_KEY)}catch(e){}loadDB();updatePill();updateWho();
  if(!ok)toast('인터넷이 연결되지 않아 아직 못 올린 기록은 이 기기에 남겨 두었어요. 다음에 이 기기로 로그인하면 올라가요.');return ok}
function syncText(){if(!isStudent())return'';const d=localDirty();if(SYNC.err&&d)return'저장하지 못했어요. 인터넷이 연결되면 다시 저장해요.';if(d||SYNC.busy)return'저장하는 중…';
  return SYNC.last?`서버에 저장했어요 · ${SYNC.last.toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'})}`:'서버와 연결하는 중…'}
function updateWho(){const c=$('#whoChip');if(!c)return;if(STANDALONE){c.style.display='none';return}
  if(isStudent()){const d=localDirty(),st=SYNC.err&&d?'bad':(d||SYNC.busy)?'wait':'ok';c.innerHTML=`<i class="dot ${st}"></i><span class="wl">${whoLabel(AUTH)}</span><span class="ws">${AUTH.klass}반 ${AUTH.num}번</span>`;c.href='#me';c.title=syncText()}
  else{c.innerHTML='로그인';c.href='#login';c.title=''}
  const sb=$('.syncNow');if(sb)sb.textContent=syncText()}
document.addEventListener('visibilitychange',()=>{if(!isStudent())return;
  if(document.visibilityState==='hidden'){if(localDirty()&&Date.now()-SYNC.contact<STALE_MS){clearTimeout(SYNC.timer);pushDB(true)}}  /* 오래 연결이 없었으면 다음에 합쳐서 올린다 */
  else{maybeConfirmWho();if(Date.now()-SYNC.contact>30000)pullDB()}});
addEventListener('online',()=>{if(localDirty())pushDB();flushOutbox();flushPts()});
setInterval(()=>{if(isStudent()&&document.visibilityState==='visible'&&localDirty()&&!SYNC.busy)pushDB()},60000);
let actT=0;['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>{const n=Date.now();if(n-actT>20000){actT=n;markActive()}},{passive:true,capture:true}));
/* 함께 쓰는 패드: 한동안 쓰지 않다가 다시 열면 '이 번호가 나 맞나요?' 확인 */
const IDLE_MS=10*60*1000;let whoOpen=false;
function maybeConfirmWho(){if(!isStudent()||whoOpen)return;const la=+lsGet('hangeoreum-active',0)||0;if(!la||Date.now()-la<IDLE_MS){markActive();return}
  whoOpen=true;const ov=el(`<div class="whoov" role="dialog" aria-modal="true" aria-labelledby="whoT"><div class="card panel whocard"><div class="muted">이 기기로 공부하던 사람</div><h2 id="whoT">${whoLabel(AUTH)}</h2>
    <p>나 맞나요? 내 번호가 아니면 로그아웃하고 내 번호로 다시 로그인해 주세요.</p><div class="whobtns"><button type="button" class="btn primary whoYes">네, 저예요</button><button type="button" class="btn whoNo">아니요, 다른 사람이에요</button></div></div></div>`);
  document.body.appendChild(ov);setTimeout(()=>{const y=$('.whoYes',ov);if(y)y.focus()},50);
  $('.whoYes',ov).onclick=()=>{ov.remove();whoOpen=false;markActive()};
  $('.whoNo',ov).onclick=async e=>{e.currentTarget.disabled=true;e.currentTarget.textContent='로그아웃하는 중…';await studentLogout();ov.remove();whoOpen=false;markActive();toast('로그아웃했어요. 내 번호로 로그인해 주세요.');if(location.hash==='#login')route();else location.hash='#login'}}
function demoBanner(){return LIVE?'':`<div class="demo"><b>체험 모드</b> · 아직 서버(Supabase)를 연결하지 않아서, 로그인과 교사 화면이 이 기기 안에서만 흉내 내며 동작해요.<br>체험용 학생: <b>1학년 1반 1~20번</b>, 비밀번호 <b class="rm">1234</b> · 선생님 비밀번호 <b class="rm">demo1234</b></div>`}

/* 로그인 화면 */
function pinPad(onComplete){const w=el(`<div class="pinpad"><div class="pindots" aria-label="입력한 비밀번호 자리 수">${'<i></i>'.repeat(4)}</div><div class="pinkeys">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>k===''?'<span></span>':`<button type="button" data-k="${k}" aria-label="${k==='⌫'?'지우기':k}">${k}</button>`).join('')}</div></div>`);
  let v='',lock=false;const draw=()=>$$('.pindots i',w).forEach((d,i)=>d.classList.toggle('on',i<v.length));
  const press=k=>{if(lock)return;if(k==='⌫')v=v.slice(0,-1);else if(v.length<4)v+=k;draw();if(v.length===4){lock=true;const val=v;setTimeout(()=>onComplete(val,()=>{v='';lock=false;draw()}),120)}};
  $$('button',w).forEach(b=>b.onclick=()=>press(b.dataset.k));w._press=press;return w}
function teacherForm(){return`<form class="tLogin"><label class="cap" for="tPw">교사 비밀번호</label><input id="tPw" type="password" autocomplete="current-password" class="inp" required><button class="btn primary" style="margin-top:12px">교사 화면 열기</button><div class="flmsg tMsg" role="status"></div></form>`}
function wireTeacherForm(root,after){const f=$('.tLogin',root);if(!f)return;f.onsubmit=async e=>{e.preventDefault();const m=$('.tMsg',root);m.textContent='확인하는 중…';
  try{const r=await API.call('hg_teacher_login',{p_password:$('#tPw',root).value});if(r&&r.ok){tSet(r.token);if(after)after();else if(location.hash==='#teacher')viewTeacher();else location.hash='#teacher'}else m.textContent=(r&&r.msg)||'로그인하지 못했어요.'}catch(err){m.textContent=err.message}}}
let pinKeyHandler=null;
function viewLogin(){
  crumbs.innerHTML=`<span class="sep">›</span><span>로그인</span>`;const last=lsGet('hangeoreum-lastclass',{grade:1,klass:1});
  if(isStudent()){app.innerHTML=`<div class="login-wrap">${demoBanner()}<div class="card panel login-card"><h1 style="font-size:28px">${whoLabel(AUTH)}</h1><p>로그인되어 있어요. 기록은 서버에 저장돼요.</p><p class="muted syncNow">${syncText()}</p>
    <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#home">이어서 공부하기</a><button type="button" class="btn lgOut">로그아웃</button></div>
    <p class="muted" style="font-size:15px">학교 패드처럼 여럿이 함께 쓰는 기기라면, 공부를 마친 뒤 꼭 로그아웃해 주세요.</p></div></div>`;
    $('.lgOut',app).onclick=async()=>{await studentLogout();toast('로그아웃했어요.');viewLogin()};return}
  app.innerHTML=`<div class="login-wrap">${demoBanner()}<div class="card panel login-card">
    <div class="seg logtab" role="tablist"><button type="button" class="on" data-t="s" role="tab">학생</button><button type="button" data-t="t" role="tab">선생님</button></div>
    <div class="logS">
      <h1 style="font-size:28px;margin-top:14px">학생 로그인</h1>
      <p class="muted" style="margin-top:4px">로그인하면 다른 기기에서도 이어서 할 수 있고, 선생님이 내 진도를 볼 수 있어요.</p>
      <div class="lg-row"><span class="cap">학년</span><div class="seg lgGrade">${[1,2,3].map(g=>`<button type="button" data-g="${g}" class="${g===last.grade?'on':''}">${g}학년</button>`).join('')}</div></div>
      <div class="lg-row"><label class="cap" for="lgK">반</label><select id="lgK" class="inp sel">${range(20).map(i=>`<option value="${i+1}"${i+1===last.klass?' selected':''}>${i+1}반</option>`).join('')}</select>
        <label class="cap" for="lgN">번호</label><select id="lgN" class="inp sel">${range(50).map(i=>`<option value="${i+1}">${i+1}번</option>`).join('')}</select></div>
      <div class="cap" style="margin-top:14px">비밀번호 4자리 <span class="muted" style="font-weight:400;font-size:14px">· 잊었으면 선생님께 말해 주세요</span></div><div class="lgPin"></div><div class="flmsg lgMsg" role="status"></div>
      <p style="margin:6px 0 0"><a href="#home">로그인 없이 둘러보기</a> <span class="muted" style="font-size:14px">(기록은 이 기기에만 남아요)</span></p>
    </div>
    <div class="logT" hidden><h1 style="font-size:28px;margin-top:14px">선생님 로그인</h1><p class="muted" style="margin-top:4px">교사 화면에서 학생 번호와 비밀번호를 만들고, 진도와 많이 막히는 단계를 볼 수 있어요.</p>${teacherForm()}</div>
  </div></div>`;
  let grade=last.grade||1;
  $$('.lgGrade button',app).forEach(b=>b.onclick=()=>{grade=+b.dataset.g;$$('.lgGrade button',app).forEach(x=>x.classList.toggle('on',x===b))});
  $$('.logtab button',app).forEach(b=>b.onclick=()=>{$$('.logtab button',app).forEach(x=>x.classList.toggle('on',x===b));$('.logS',app).hidden=b.dataset.t!=='s';$('.logT',app).hidden=b.dataset.t!=='t'});
  wireTeacherForm(app);
  const msg=$('.lgMsg',app);
  const pad=pinPad(async(pin,reset)=>{const klass=+$('#lgK',app).value,num=+$('#lgN',app).value,sid=`${grade}-${klass}-${num}`;msg.textContent='확인하는 중…';msg.className='flmsg lgMsg';
    try{const r=await studentLogin(sid,pin);if(r.ok){lsSet('hangeoreum-lastclass',{grade,klass});toast(`${whoLabel(AUTH)}, 반가워요!`);location.hash='#home'}else{msg.textContent=r.msg;msg.className='flmsg lgMsg bad';pad.classList.add('shake');setTimeout(()=>pad.classList.remove('shake'),400);reset()}}
    catch(e){msg.textContent=e.message;msg.className='flmsg lgMsg bad';reset()}});
  $('.lgPin',app).appendChild(pad);
  pinKeyHandler=e=>{if(!pad.isConnected||$('.logS',app).hidden||e.target.closest('input,select,textarea'))return;if(/^[0-9]$/.test(e.key))pad._press(e.key);else if(e.key==='Backspace'){e.preventDefault();pad._press('⌫')}};
}
document.addEventListener('keydown',e=>{if(pinKeyHandler)pinKeyHandler(e)});

