/* ───────── 나의 길: 학생이 고르는 목표 3갈래 ─────────
   기록(시작점 찾기 · 별)으로 하나를 추천하고, 결정은 학생이 해요. 언제든 바꿀 수 있고, 2주가 지나면 다시 고르자고 권해요.
   학생 화면에는 점수 구간을 보여 주지 않아요. 선생님 화면(03-teacher.js)은 고른 길과 추천을 나란히 보여 줘요.
   저장: DB._goal = {k:'calc'|'base'|'up', d:'YYYY-MM-DD', rec:추천 k 또는 null, h:[[k,d],…최근 6번]} */
const GOALS=[
 {k:'calc',ic:'🌱',nm:'계산부터 탄탄히',aim:'계산 힘을 되찾고, 시험의 쉬운 계산 문제를 맞혀요.',
  how:['수 감각 사다리와 구구단부터 해요','오늘의 계산은 5문제씩 짧게 해요','차시는 미리 보기와 같이 풀기까지 하면 충분해요']},
 {k:'base',ic:'🌿',nm:'시험 기본 문제 잡기',aim:'교과서 기본 문제를 확실히 맞혀요.',
  how:['시험 범위 계산부터 해요 (막힌 바탕 칸은 같이 열려요)','차시는 같이 풀기와 혼자 풀기 5문제까지 해요','틀린 문제는 복습 노트로 다시 풀어요']},
 {k:'up',ic:'🌳',nm:'시험 점수 더 올리기',aim:'교과서 유형까지 풀고 실수를 줄여요.',
  how:['시험 범위 계산을 별 3개까지 채워요','오늘의 계산은 10문제로 해요','차시는 더 알아보기까지 도전해요']}];
const GOAL_RANK={calc:0,base:1,up:2};
const GOAL_AGAIN_DAYS=14;
const goalBy=k=>GOALS.find(g=>g.k===k)||null;
/* 기록으로 추천하기. d는 학생 DB(교사 화면에서도 같은 함수를 써요). 시작점 찾기 전이면 null */
function goalRec(d){d=OBJ(d);const dg=OBJ(d._calcDiag),dr=OBJ(dg.res),cs=OBJ(d._calc),st=id=>NUM(OBJ(cs[id]).stars),nm=id=>(CALC.find(t=>t.id===id)||{}).nm||id;
  if(!dg.d)return null;
  const numWeak=['add','add2','facts','div'].filter(id=>dr[id]===false&&st(id)<1);
  if(numWeak.length)return{k:'calc',why:`시작점 찾기에서 ${numWeak.map(nm).join(', ')}이(가) 흔들렸어요.`};
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
  toast(old&&old.k===k?`${g.ic} ${g.nm}, 이 길로 계속 가요!`:`${g.ic} ${g.nm}을(를) 골랐어요. 언제든 바꿀 수 있어요.`)}
/* 홈 카드 */
function goalPickHTML(rk,cur){return`<div class="goal-pick" role="list">${GOALS.map(g=>`<button type="button" role="listitem" class="goal-opt ${g.k===(cur||rk)?'on':''}" data-k="${g.k}">
   <span class="gi" aria-hidden="true">${g.ic}</span><span class="gt"><b>${g.nm}${g.k===rk?' <em class="goal-rec">추천</em>':''}${g.k===cur?' <em class="goal-now">지금 길</em>':''}</b><small>${g.aim}</small></span></button>`).join('')}</div>`}
function goalCardHTML(){const G=myGoal(),R=goalRec(DB),rk=R?R.k:null;
  if(!G)return`<div class="g-head"><b class="t">나의 길 고르기</b><span class="k">나에게 맞는 목표를 골라요</span></div>
    ${R?`<p class="goal-why">시작점 찾기 결과로 <b>${goalBy(rk).ic} ${goalBy(rk).nm}</b>을(를) 추천해요. ${R.why} 다른 길을 골라도 괜찮아요.</p>`
      :`<p class="goal-why"><a href="#calc-start">시작점 찾기</a>를 먼저 하면 나에게 맞는 길을 추천해 줘요. 지금 바로 골라도 괜찮아요.</p>`}
    ${goalPickHTML(rk,null)}<p class="goal-go"><button type="button" class="btn primary goalOk">이 길로 시작하기</button></p>`;
  const g=goalBy(G.k),days=G.d?Math.floor((Date.parse(today())-Date.parse(G.d))/864e5):0,up=rk&&GOAL_RANK[rk]>GOAL_RANK[G.k],again=days>=GOAL_AGAIN_DAYS;
  const nudge=up?`<p class="goal-nudge">🎉 별을 많이 모았어요! <b>${goalBy(rk).ic} ${goalBy(rk).nm}</b>(으)로 한 걸음 올라가 볼래요? <button type="button" class="t-mini goalUp" data-k="${rk}">올라가기</button></p>`
    :again?`<p class="goal-nudge">이 길을 고른 지 ${days}일이 지났어요. 지금도 나에게 맞는지 다시 골라 볼까요? <button type="button" class="t-mini goalOpen">다시 고르기</button></p>`:'';
  return`<div class="g-head"><b class="t">나의 길 · ${g.ic} ${g.nm}</b><span class="k"><button type="button" class="t-mini goalOpen">길 바꾸기</button></span></div>
    <p class="goal-why">${g.aim}</p><ul class="goal-how">${g.how.map(x=>`<li>${x}</li>`).join('')}</ul>${nudge}
    <div class="goal-more" hidden>${R?`<p class="goal-why">기록으로 보면 <b>${goalBy(rk).ic} ${goalBy(rk).nm}</b>을(를) 추천해요. ${R.why}</p>`:''}${goalPickHTML(rk,G.k)}<p class="goal-go"><button type="button" class="btn primary goalOk">이 길로 하기</button></p></div>`}
function goalMount(){const box=$('#goalCard');if(!box)return;box.innerHTML=goalCardHTML();let pick=(myGoal()||{}).k||(goalRec(DB)||{}).k||null;
  const sel=k=>{pick=k;$$('.goal-opt',box).forEach(b=>b.classList.toggle('on',b.dataset.k===k))};
  $$('.goal-opt',box).forEach(b=>b.onclick=()=>sel(b.dataset.k));
  $$('.goalOpen',box).forEach(b=>b.onclick=()=>{const m=$('.goal-more',box);if(m){m.hidden=!m.hidden;if(!m.hidden)m.scrollIntoView({block:'nearest',behavior:'smooth'})}});
  $$('.goalOk',box).forEach(b=>b.onclick=()=>{if(!pick){toast('길을 하나 골라 주세요.');return}goalChoose(pick);viewHome()});
  $$('.goalUp',box).forEach(b=>b.onclick=()=>{goalChoose(b.dataset.k);viewHome()})}
/* 홈: 오늘의 길잡이 위에 '나의 길' 카드 */
{const _home=viewHome;viewHome=function(){_home.apply(this,arguments);
  const gd=$('#guide');if(!gd||$('#goalCard'))return;const c=el('<div class="card guide goal-card" id="goalCard"></div>');gd.parentNode.insertBefore(c,gd);goalMount()}}
/* 기초 연산 화면: 처음 기기에서는 고른 길에 맞춰 시험 모드·문제 수를 정해요 */
{const _calc=viewCalc;viewCalc=function(){const G=myGoal();if(G)goalApplyPrefs(G.k,false);_calc.apply(this,arguments);
  if(!G||!$('.unit-head',app))return;const g=goalBy(G.k);$('.unit-head',app).insertAdjacentHTML('afterend',`<p class="goal-line">${g.ic} <b>${g.nm}</b> · ${g.aim} <a href="#home">길 바꾸기</a></p>`)}}
/* 오늘의 길잡이: 고른 길에 맞춰 할 일을 조금 바꿔요 */
{const _gs=guideSteps;guideSteps=function(){const S=_gs.apply(this,arguments),G=myGoal();if(!G)return S;
  const li=S.findIndex(x=>/^\d+차시 /.test(x.t)),ci=S.findIndex(x=>/^기초 연산 · /.test(x.t)&&x.href!=='#calc-start');
  if(G.k==='calc'){
    if(li>=0&&/-(practice|explore)$/.test(S[li].href))S[li]=Object.assign({},S[li],{who:'S',s:'미리 보기와 같이 풀기를 했어요 · 혼자 풀기는 도전이에요'});
    if(ci>=0){const P=CALC_PATHS.find(p=>p.k==='num'),ids=P?P.ids.filter(id=>{const t=CALC.find(c=>c.id===id);return t&&calcVisible(t)}):[],due=dueList().map(t=>t.id).find(id=>ids.includes(id)),pl=calcPlan().find(id=>ids.includes(id)&&NUM(calcPeek(id).stars)<1),id=due||pl||pathNow(ids);
      if(id){const t=CALC.find(c=>c.id===id),st=calcPeek(id),cd=S[ci].done;S[ci]=Object.assign({},S[ci],{t:`기초 연산 · ${t.nm}`,s:cd?'오늘 한 세트 했어요':due?'복습할 때예요':`수 감각 사다리 · ${Math.min(calcLvN(id),NUM(st.stars)+1)}단계`,href:'#calc-'+id})}}}
  else if(G.k==='up'&&li>=0&&/-explore$/.test(S[li].href))S[li]=Object.assign({},S[li],{s:'더 알아보기 · 탐구 활동까지 도전해요'});
  return S}}
