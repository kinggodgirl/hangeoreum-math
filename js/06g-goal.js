/* ───────── 나의 길: 학생이 고르는 목표 3갈래 ─────────
   기록(시작점 찾기 · 별)으로 하나를 추천하고, 결정은 학생이 해요. 언제든 바꿀 수 있고, 2주가 지나면 다시 고르자고 권해요.
   학생 화면에는 점수 구간을 보여 주지 않아요. 선생님 화면(03-teacher.js)은 고른 길과 추천을 나란히 보여 줘요.
   [T38] 나의 길 = 걸음(총정리 2-6 가): 이름·그림을 🌱 첫걸음 · 🌿 한걸음 · 🌳 두걸음과 묶어 보여 줘요.
   저장: DB._goal = {k:'calc'|'base'|'up', d:'YYYY-MM-DD', rec:추천 k 또는 null, h:[[k,d],…최근 6번]} */
const GOALS=[
 {k:'calc',ic:'🌱',nm:'첫걸음 · 계산부터 탄탄히',aim:'계산 힘을 되찾고, 시험의 쉬운 계산 문제를 맞혀요.',
  how:['수 감각 사다리와 구구단부터 해요','오늘의 계산은 5문제씩 짧게 해요','차시는 🌱 첫걸음으로 개념 구별과 따라 풀기부터 해요']},
 {k:'base',ic:'🌿',nm:'한걸음 · 시험 기본 문제 잡기',aim:'교과서 기본 문제를 확실히 맞혀요.',
  how:['시작점 찾기에서 흔들린 계산부터, 그다음 시험 범위 계산을 해요','차시는 🌿 한걸음으로 기본 유형과 차시 마무리를 익혀요','다음 날 [복습 추천]으로 익힌 유형을 다시 확인해요']},
 {k:'up',ic:'🌳',nm:'두걸음 · 시험 점수 더 올리기',aim:'교과서 유형까지 풀고 실수를 줄여요.',
  how:['시험 범위 계산을 별 3개까지 채워요','오늘의 계산은 10문제로 해요','차시는 🌳 두걸음 복합 문제와 실전 마무리까지 도전해요']}];
/* 받침에 맞는 조사: 마지막 한글 글자를 보고 골라요. jo('잡기','을','를') → '잡기를', jo('길','으로','로') → '길로' */
const jo=(w,a,b)=>{const m=String(w).match(/[가-힣](?=[^가-힣]*$)/),c=m?m[0].charCodeAt(0)-0xAC00:-1,f=c>=0?c%28:0;return w+(f&&!(a==='으로'&&f===8)?a:b)};
const GOAL_RANK={calc:0,base:1,up:2};
const GOAL_AGAIN_DAYS=14;
const goalBy=k=>GOALS.find(g=>g.k===k)||null;
/* 기록으로 추천하기. d는 학생 DB(교사 화면에서도 같은 함수를 써요). 시작점 찾기 전이면 null */
function goalRec(d){d=OBJ(d);const dg=OBJ(d._calcDiag),dr=OBJ(dg.res),cs=OBJ(d._calc),st=id=>NUM(OBJ(cs[id]).stars),nm=id=>(CALC.find(t=>t.id===id)||{}).nm||id;
  if(!dg.d)return null;
  const numWeak=['add','add2','facts','div'].filter(id=>dr[id]===false&&st(id)<1);
  if(numWeak.length)return{k:'calc',why:`시작점 찾기에서 ${jo(numWeak.map(nm).join(', '),'이','가')} 흔들렸어요.`};
  const midWeak=['order','fracbase'].filter(id=>dr[id]===false&&st(id)<1);
  if(midWeak.length)return{k:'base',why:`기초 계산은 괜찮고, ${midWeak.map(nm).join(', ')}부터 다지면 좋아요.`};
  const ex=EXAM_FOCUS.filter(id=>CALC.some(t=>t.id===id)),all=ex.reduce((a,id)=>a+calcLvN(id),0),got=ex.reduce((a,id)=>a+Math.min(calcLvN(id),st(id)),0),r=all?got/all:0;
  if(r>=0.5)return{k:'up',why:`기초가 튼튼하고, 시험 범위 계산 별을 ${Math.round(r*100)}% 모았어요.`};
  return{k:'base',why:'기초 계산이 튼튼해요. 이제 시험 범위 계산을 채워요.'}}
/* 학생 DB에서 고른 길 읽기(교사 화면용): {k, d, rec, old(2주 지남), diff(추천과 다름), h} */
function goalOf(d){d=OBJ(d);const G=OBJ(d._goal),k=goalBy(G.k)?G.k:null,R=goalRec(d),days=G.d?Math.floor((Date.parse(today())-Date.parse(G.d))/864e5):0;
  return{k,d:G.d||null,rec:R?R.k:null,why:R?R.why:'',old:!!k&&days>=GOAL_AGAIN_DAYS,days,diff:!!(k&&R&&R.k!==k),h:Array.isArray(G.h)?G.h:[]}}
const myGoal=()=>{const G=OBJ(DB._goal);return goalBy(G.k)?G:null};
/* 길에 맞춰 이 기기의 기초 연산 보기를 맞춰요(학생이 나중에 직접 바꾸면 그걸 따라요) */
function goalApplyPrefs(k,force){const set=(key,v)=>{if(force||lsGet(key,null)==null)lsSet(key,v)};
  set('hangeoreum-calc-exam',k!=='calc');set('hangeoreum-calc-len',k==='up'?10:5)}
function goalChoose(k){const g=goalBy(k);if(!g)return;const old=myGoal(),R=goalRec(DB),t=today(),h=Array.isArray(OBJ(DB._goal).h)?DB._goal.h.slice(-5):[];
  h.push([k,t]);DB._goal={k,d:t,rec:R?R.k:null,h};goalApplyPrefs(k,true);save();if(!old)award(5,'goal');
  toast(old&&old.k===k?`${g.ic} ${g.nm}, 이 길로 계속 가요!`:`${g.ic} ${jo(g.nm,'을','를')} 골랐어요. 내 기록에서 언제든 바꿀 수 있어요.`)}
/* 🌿 길: 시작점 찾기에서 흔들린 계산(별 0개)을 먼저 해요. 다 하면 null → 선생님이 정한 계산(calcNowT)으로 넘어가요.
   홈 계산 칩(02-unit-solid.js)과 길잡이가 같은 칸을 가리키게 이 함수 하나로 정해요 */
function goalCalcFirst(){const G=myGoal();if(!G||G.k!=='base')return null;
  return calcPlan().map(id=>CALC.find(t=>t.id===id)).find(t=>t&&calcVisible(t)&&NUM(calcPeek(t.id).stars)<1)||null}
/* 홈 카드 */
function goalPickHTML(rk,cur){return`<div class="goal-pick" role="list">${GOALS.map(g=>`<button type="button" role="listitem" class="goal-opt ${g.k===(cur||rk)?'on':''}" data-k="${g.k}">
   <span class="gi" aria-hidden="true">${g.ic}</span><span class="gt"><b>${g.nm}${g.k===rk?' <em class="goal-rec">추천</em>':''}${g.k===cur?' <em class="goal-now">지금 길</em>':''}</b><small>${g.aim}</small></span></button>`).join('')}</div>`}
function goalCardHTML(){const G=myGoal(),R=goalRec(DB),rk=R?R.k:null;
  if(!G)return`<div class="g-head"><b class="t">나의 길 고르기</b><span class="k">나에게 맞는 목표를 골라요</span></div>
    ${R?`<p class="goal-why">시작점 찾기 결과로 <b>${goalBy(rk).ic} ${jo(goalBy(rk).nm,'을','를')}</b> 추천해요. ${R.why} 다른 길을 골라도 괜찮아요.</p>`
      :`<p class="goal-why"><a href="#calc-start">시작점 찾기</a>를 먼저 하면 나에게 맞는 길을 추천해 줘요. 지금 바로 골라도 괜찮아요.</p>`}
    ${goalPickHTML(rk,null)}<p class="goal-go"><button type="button" class="btn primary goalOk">이 길로 시작하기</button></p>`;
  const g=goalBy(G.k),days=G.d?Math.floor((Date.parse(today())-Date.parse(G.d))/864e5):0,up=rk&&GOAL_RANK[rk]>GOAL_RANK[G.k],again=days>=GOAL_AGAIN_DAYS;
  const nudge=up?`<p class="goal-nudge">🎉 별을 많이 모았어요! <b>${goalBy(rk).ic} ${jo(goalBy(rk).nm,'으로','로')}</b> 한 걸음 올라가 볼래요? <button type="button" class="t-mini goalUp" data-k="${rk}">올라가기</button></p>`
    :again?`<p class="goal-nudge">이 길을 고른 지 ${days}일이 지났어요. 지금도 나에게 맞는지 다시 골라 볼까요? <button type="button" class="t-mini goalOpen">다시 고르기</button></p>`:'';
  return`<div class="g-head"><b class="t">나의 길 · ${g.ic} ${g.nm}</b><span class="k"><button type="button" class="t-mini goalOpen">길 바꾸기</button></span></div>
    <p class="goal-why">${g.aim}</p><ul class="goal-how">${g.how.map(x=>`<li>${x}</li>`).join('')}</ul>${nudge}
    <div class="goal-more" hidden>${R?`<p class="goal-why">기록으로 보면 <b>${goalBy(rk).ic} ${jo(goalBy(rk).nm,'을','를')}</b> 추천해요. ${R.why}</p>`:''}${goalPickHTML(rk,G.k)}<p class="goal-go"><button type="button" class="btn primary goalOk">이 길로 하기</button></p></div>`}
function goalMount(){const box=$('#goalCard');if(!box)return;box.innerHTML=goalCardHTML();let pick=(myGoal()||{}).k||(goalRec(DB)||{}).k||null;
  const sel=k=>{pick=k;$$('.goal-opt',box).forEach(b=>b.classList.toggle('on',b.dataset.k===k))};
  $$('.goal-opt',box).forEach(b=>b.onclick=()=>sel(b.dataset.k));
  $$('.goalOpen',box).forEach(b=>b.onclick=()=>{const m=$('.goal-more',box);if(m){m.hidden=!m.hidden;if(!m.hidden)m.scrollIntoView({block:'nearest',behavior:'smooth'})}});
  const redraw=()=>(/^#me/.test(location.hash||'')?viewMe:viewHome)();
  $$('.goalOk',box).forEach(b=>b.onclick=()=>{if(!pick){toast('길을 하나 골라 주세요.');return}goalChoose(pick);redraw()});
  $$('.goalUp',box).forEach(b=>b.onclick=()=>{goalChoose(b.dataset.k);redraw()})}
/* [T21] 홈: 아직 길을 고르지 않았을 때만 오늘의 길잡이 위에 '나의 길 고르기' 카드. 고른 뒤에는 내 기록(#me)에서 바꿔요 */
{const _home=viewHome;viewHome=function(){_home.apply(this,arguments);
  if(myGoal())return;const gd=$('#guide');if(!gd||$('#goalCard'))return;const c=el('<div class="card guide goal-card" id="goalCard"></div>');gd.parentNode.insertBefore(c,gd);goalMount()}}
/* [T21] 내 기록: 로그인 상자 아래에 '나의 길' 카드(바꾸기 · 올라가기 · 2주 뒤 다시 고르기) */
{const _me=viewMe;viewMe=function(){_me.apply(this,arguments);
  const ac=$('.acct',app);if(!ac||$('#goalCard'))return;const c=el('<div class="card panel guide goal-card" id="goalCard"></div>');ac.insertAdjacentElement('afterend',c);goalMount()}}
/* 기초 연산 화면: 처음 기기에서는 고른 길에 맞춰 시험 모드·문제 수를 정해요 */
{const _calc=viewCalc;viewCalc=function(){const G=myGoal();if(G)goalApplyPrefs(G.k,false);_calc.apply(this,arguments);
  if(!G||!$('.unit-head',app))return;const g=goalBy(G.k);$('.unit-head',app).insertAdjacentHTML('afterend',`<p class="goal-line">${g.ic} <b>${g.nm}</b> · ${g.aim} <a href="#me">길 바꾸기</a></p>`)}}
/* [T38] 오늘의 길잡이를 길에 맞춰 바꾸던 부분은 뺐어요. T36부터 길잡이는 '오늘의 계산' 한 줄(05-calc.js, 🌱·🌿 길은 계산이 위)과
   '교과서 한 걸음' 한 줄(엔진 guideLessonStep, 걸음은 unitActiveTrack)이라 여기서 고칠 '기초 연산 · …' 줄이 없어요.
   🌿 길의 '시작점 찾기에서 흔들린 계산'은 홈 계산 칩(goalCalcFirst)에 그대로 남아 있어요. */
