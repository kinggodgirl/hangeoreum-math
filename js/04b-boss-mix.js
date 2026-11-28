/* ───────── [T30] 보스전 문제 섞기 · 모르게 복습 ─────────
   선생님 목표: 보스전은 '보상'이고, 아이들이 모르는 사이에 복습이 되게 해요.
   - 폭탄 문제를 차시 문제 장치(GEN 유형·두걸음 복합)의 '차시 마무리' 문제로 섞어 내요 → 공부할 때 본 그림이 그대로 나와요.
     짧은 계산은 지금처럼 보스 문제 은행(js/boss-bank.js)에서 나와요.
   - 보스 고르기(선생님 결정): 약화 = 🌱 첫걸음(단계가 짧은 문제·보기 고르기), 일반 = 🌿 한걸음(기본 유형 전체),
     광폭 = 🌳 두걸음(복합 문제도 섞어요). 학생이 고른 길(걸음)은 바꾸지 않아요.
   - 약화·일반 보스에서는 가끔(UP_RATE 15%) 한 단계 위 문제가 '⭐ 한 단계 위 도전!' 표시와 함께 나와요.
   - [T37] 차시 문제의 1/3쯤은 7일 넘게 안 본 차시에서 내요(STALE_SHARE).
   - [T37] 출제 무게: '다시 확인' 유형 + 놓친 유형(보스전에서 놓친 것 · [복습 추천]에서 틀린 것). 예전 3·7·14일 일정은 쓰지 않아요.
   - [T37] 보스전에서 숙달 ✓ 유형을 놓치면 '다시 확인'을 붙여요(HG_TRACKS.markRecheck → 다음 날 [복습 추천]).
   - 전투 중에는 '복습'이라는 말을 쓰지 않고, 끝난 뒤 결과 화면에서만 "오늘 n개 차시를 복습했어요"라고 알려 줘요.
   - 📍 위치 보고(HG_LOC)와 ⚑ 이 문제 이상해요(HG_REPORT)를 보스전 화면에도 붙여요.
   js/04-games.js의 오늘의 보스 도전(raidOpen)이 부르는 이름: window.BOSS_MIX.{pick, bankSrc, show, miss, summary, reset} */
(()=>{
'use strict';

const RATE={1:0.5,2:0.6,3:0.65};   /* 걸음별로 차시 문제(그림)가 나올 비율. 나머지는 보스 문제 은행 */
const FIG_SEC=15;                    /* 그림 있는 차시 문제는 읽을 시간을 조금 더 */
const COMPOUND_RATE=0.35;            /* 🌳 걸음에서 복합 문제가 나올 비율 */
const UP_RATE=0.15;                  /* 약화·일반 보스에서 가끔(15%) 한 단계 위 도전 문제 */
const TYPES_OK={choice:1,num:1,pi:1,sn:1};
const STALE_DAYS=7,STALE_SHARE=1/3;  /* [T37] 한 판의 차시 문제 중 1/3은 7일 넘게 안 본 차시에서 */

const lesOf=id=>(typeof LESSONS!=='undefined'?LESSONS.find(l=>l.id===id):null);
const specOf=id=>(typeof HG_TRACKS==='object'&&HG_TRACKS&&HG_TRACKS.specs)?HG_TRACKS.specs[id]:null;
const unitNm=L=>(L&&typeof unitOf==='function')?unitOf(L.unit||'solid').name:'';
const newSd=()=>1+Math.floor(Math.random()*99998);

/* 이 학생이 이 차시에서 고른 걸음 */
function trackOf(lid){const p=DB[lid]&&typeof DB[lid]==='object'?DB[lid]:{};if(p.track===1||p.track===2||p.track===3)return p.track;
  const L=lesOf(lid);return typeof unitActiveTrack==='function'?unitActiveTrack((L&&L.unit)||'solid'):2}

/* 보스전에서 놓친 유형 기록: { 'cent:2': 횟수 } · 맞히면 하나씩 줄어요 */
function missMap(){const R=DB._raid=OBJ(DB._raid);R.miss=OBJ(R.miss);return R.miss}
function bump(key,d){if(!key)return;const M=missMap(),n=Math.max(0,Math.min(5,NUM(M[key])+d));if(n)M[key]=n;else delete M[key];
  const ks=Object.keys(M);if(ks.length>40)ks.slice(0,ks.length-40).forEach(k=>delete M[k])}

/* [T37] 무게 = '다시 확인' 유형 + 놓친 유형(아직 숙달 전에 틀린 것 · 보스전에서 놓친 것) */
function isStale(lid){const p=DB[lid]&&typeof DB[lid]==='object'?DB[lid]:{};return!p.tday||p.tday<addDays(today(),-STALE_DAYS)}
function lessonWeight(lid){const p=DB[lid]&&typeof DB[lid]==='object'?DB[lid]:{},rev=OBJ(p.rev),M=missMap();let w=1;
  Object.values(rev).forEach(r=>{if(!r||typeof r!=='object')return;if(r.ok&&r.re)w+=2;else if(!r.ok&&r.err)w+=1});
  Object.keys(M).forEach(k=>{if(k.split(':')[0]===lid)w+=Math.min(3,NUM(M[k]))});
  return w}
function typeWeight(lid,key,no){const p=DB[lid]&&typeof DB[lid]==='object'?DB[lid]:{},r=no?OBJ(p.rev)['ty'+no]:null;
  return 1+(r&&r.ok&&r.re?3:0)+(r&&r.err&&!r.ok?2:0)+Math.min(3,NUM(missMap()[lid+':'+key]))}
function wPick(list,wf){const ws=list.map(wf),sum=ws.reduce((a,b)=>a+b,0);let x=Math.random()*sum;for(let i=0;i<list.length;i++){x-=ws[i];if(x<=0)return list[i]}return list[list.length-1]}

/* 차시 문제 하나를 보스 폭탄 문제 모양으로 */
function fromProb(P,lid,info){if(!P||!Array.isArray(P.steps)||!P.steps.length)return null;
  const last=P.steps[P.steps.length-1],fin=P.final||Object.assign({},last,{q:P.finalQ||last.q});
  if(!fin||fin.ans===undefined||fin.ans===null||!TYPES_OK[fin.type||'num'])return null;
  if(fin.type==='choice'&&!(Array.isArray(fin.choices)&&fin.choices.length))return null;
  const L=lesOf(lid),ask=String(fin.q||''),title=String(P.title||'');
  const plain=t=>String(t).replace(/<[^>]+>/g,'').replace(/[\s?.。]/g,''),same=ask&&plain(title).includes(plain(ask));
  const tip=P.steps.map(s=>s.ok||s.why||'').filter(Boolean).slice(-2).join('<br>');
  const q=Object.assign({},fin,{type:fin.type||'num',unit:unitNm(L),les:lid,
    q:`<div class="bx-title">${title}</div>${same||!ask?'':`<div class="bx-ask">${ask}</div>`}`,tip,keepOrder:true,
    extraSec:P.fig?FIG_SEC:0,
    mix:{kind:'gen',lid,gen:info.gen,seed:info.seed,key:info.key,tyNo:info.tyNo||0,cid:info.cid||'',prob:P}});
  delete q.gate;delete q.also;
  return q}

function genFor(lid,eff){const TL=(typeof PTYPES==='object'&&PTYPES[lid])||[],spec=specOf(lid);if(!TL.length)return null;
  const comps=eff>=3&&spec&&spec.genCompound?Object.keys(spec.genCompound):[];
  for(let k=0;k<10;k++){let P=null,info;
    try{
      if(comps.length&&Math.random()<COMPOUND_RATE){const cid=wPick(comps,c=>typeWeight(lid,c,0)),seed=newSd();P=spec.genCompound[cid](seed);info={gen:'compound_'+cid,seed,key:cid,cid}}
      else{const T=wPick(TL,t=>typeWeight(lid,'ty'+t.no,t.no)),seed=newSd(),gen=tyKey(lid,T.no);P=GEN[gen](seed);info={gen,seed,key:'ty'+T.no,tyNo:T.no}}
    }catch(e){continue}
    /* 🌱: 단계가 짧은 문제(2단계 이하)나 보기 고르기 */
    if(eff<=1&&k<8&&P&&Array.isArray(P.steps)){const last=P.steps[P.steps.length-1]||{};if(P.steps.length>2&&last.type!=='choice')continue}
    /* 그림 있는 문제를 먼저 */
    if(k<5&&P&&!P.fig)continue;
    const q=fromProb(P,lid,info);if(q)return q}
  return null}

/* 보스전 문제 하나 고르기. null이면 04-games.js가 보스 문제 은행에서 골라요 */
function pick(tier,G){
  try{
    if(typeof raidSolved!=='function'||typeof GEN!=='object')return null;
    const solved=raidSolved().map(l=>l.id).filter(id=>typeof PTYPES==='object'&&PTYPES[id]);if(!solved.length)return null;
    const want=G&&G.units?G.units[G.qi%G.units.length]:'';
    const pool=solved.filter(id=>!want||unitNm(lesOf(id))===want);
    let list=pool.length?pool:solved;
    /* [T37] 지금까지 낸 차시 문제 중 오래 안 본 차시가 1/3보다 적으면 이번엔 오래 안 본 차시에서 */
    const stale=list.filter(isStale),cnt=G?(G._mix=G._mix||{n:0,s:0}):{n:0,s:0};
    const wantStale=stale.length&&stale.length<list.length&&cnt.s<(cnt.n+1)*STALE_SHARE;
    if(wantStale)list=stale;else if(stale.length&&stale.length<list.length)list=list.filter(id=>!isStale(id));
    const lid=wPick(list,lessonWeight),tr=trackOf(lid),base=(G&&G.bm&&G.bm.lv)||tr;  /* 보스가 정한 걸음(약화 1 · 일반 2 · 광폭 3), 없으면 내 걸음 */
    const up=base<3&&Math.random()<UP_RATE,eff=up?base+1:base;  /* 가끔 한 단계 위 도전 문제 */
    if(Math.random()>=(RATE[eff]||0.6))return null;
    const q=genFor(lid,eff);if(!q)return null;
    if(G&&G.used){if(G.used.has(q.q))return null;G.used.add(q.q)}
    q.mix.track=tr;q.mix.eff=eff;q.mix.up=up;q.mix.stale=isStale(lid);
    cnt.n++;if(q.mix.stale)cnt.s++;
    return q}catch(e){return null}}

/* 보스 문제 은행에서 고른 문제에도 출처를 붙여요(같은 seed면 같은 문제) */
function bankSrc(q,tier,idx,seed){if(q)q.mix={kind:'bank',tier,idx,seed,lid:q.les||'',key:'bank'};return q}

/* 문제를 화면에 놓은 뒤: 그림 · 위치 보고 · 신고 버튼 */
function show(stage,q,G){if(!stage||!q)return;const box=$('.rb-q',stage),m=q.mix||{};
  if(box&&m.kind==='gen'&&m.prob&&m.prob.fig){const F=m.prob.fig,fb=el('<div class="bx-fig"></div>');box.prepend(fb);
    try{if(F.svg)fb.innerHTML=F.svg(false,0);else{const cv=el('<canvas aria-label="문제 그림"></canvas>');fb.appendChild(cv);figure(cv,Object.assign({},F))}}catch(e){fb.remove()}}
  if(m.up){const meta=$('.rb-meta',stage);if(meta&&meta.firstElementChild)meta.firstElementChild.insertAdjacentHTML('afterend','<span class="bx-up">⭐ 한 단계 위 도전!</span>')}
  const L=lesOf(m.lid||q.les),n=G?G.shots:0;
  try{if(typeof HG_LOC==='object'&&HG_LOC){
    HG_LOC.set({file:m.kind==='bank'?'js/boss-bank.js':'js/04-games.js',fn:m.kind==='bank'?`BOSS_BANK.${m.tier}[${m.idx}]`:'raidOpen',lesson:L?L.id:null,track:null,tab:null,subtab:null,
      section:`오늘의 보스 도전${G&&G.bm?` (${G.bm.nm})`:''} › ${L?`${L.no}차시 ${L.title} · `:''}폭탄 ${n}번째${m.kind==='bank'?` (보스 문제 은행 ${m.tier} ${m.idx}번)`:m.cid?` (차시 복합 ${m.cid})`:m.tyNo?` (차시 유형 ${m.tyNo})`:''}${m.eff?` · 걸음 ${m.eff}`:''}`});
    HG_LOC.setProb({lesson:L?L.id:null,gen:m.kind==='gen'?m.gen:null,seed:m.seed,ptype:m.kind==='gen'?m.prob.ptype:'boss-bank',mode:'final',step:0,totalSteps:1,title:m.kind==='gen'?m.prob.title+' '+(q.ask||''):q.q})}}catch(e){}
  const card=$('.rb-card',stage);
  if(card&&typeof HG_REPORT==='object'&&HG_REPORT&&HG_REPORT.mount)HG_REPORT.mount(card,{lesson:L?L.id:'boss',gen:m.kind==='gen'?m.gen:`bank_${m.tier==='hard'?'h':'n'}${m.idx}`,seed:m.seed})}

/* 맞힘/놓침 기록(다음 판 출제 무게) */
function miss(q,ok){const m=q&&q.mix;if(!m||!m.lid)return;if(m.kind==='gen'){bump(m.lid+':'+m.key,ok?-1:1);
  /* [T37] 숙달 ✓ 유형을 놓치면 '다시 확인' */
  if(!ok&&m.tyNo&&typeof HG_TRACKS==='object'&&HG_TRACKS&&HG_TRACKS.markRecheck)HG_TRACKS.markRecheck(m.lid,m.tyNo);
  if(typeof save==='function')save()}}

/* 결과 화면: 복습한 차시 · 놓친 문제를 같은 그림으로 단계 풀이 · 차시 다시 보기 */
function summary(stage,G){if(!stage||!G)return;const wrap=$('.rs-wrap',stage);if(!wrap)return;
  const seen=[];(G.asked||[]).forEach(q=>{const id=q&&(q.les||(q.mix&&q.mix.lid));if(id&&!seen.includes(id)&&lesOf(id))seen.push(id)});
  if(seen.length){const st=$('.rs-stats',wrap),blk=el(`<div class="bx-rev"><b>📚 오늘 보스전에서 <span class="rm">${seen.length}</span>개 차시를 복습했어요!</b>
    <div class="bx-rev-l">${seen.map(id=>{const L=lesOf(id);return`<a class="bx-chip" href="#${id}-concept">${L.no}차시 ${esc(L.title)}</a>`}).join('')}</div>
    <small class="muted">문제를 풀면서 이 차시들을 한 번씩 다시 꺼내 썼어요. 누르면 그 차시로 가요.</small></div>`);
    if(st)st.after(blk);else wrap.prepend(blk)}
  let retry=0;
  $$('.rs-miss li',wrap).forEach(li=>{const m0=G.missed[+li.dataset.i],q=m0&&m0.q,m=q&&q.mix;if(!q)return;const L=lesOf(q.les||(m&&m.lid));
    const act=el('<div class="bx-act"></div>');
    if(m&&m.kind==='gen'&&m.prob){
      if(m.prob.fig){const fb=el('<div class="bx-fig sm"></div>');const qd=$('.rs-q',li);if(qd)qd.prepend(fb);
        try{if(m.prob.fig.svg)fb.innerHTML=m.prob.fig.svg(false,0);else{const cv=el('<canvas aria-label="문제 그림"></canvas>');fb.appendChild(cv);figure(cv,Object.assign({},m.prob.fig))}}catch(e){fb.remove()}}
      const old=$('.rs-retry',li);
      if(old&&m.prob.steps.length>1){const nb=el('<button type="button" class="btn t-mini primary">그림 보며 단계로 풀어 보기</button>');old.replaceWith(nb);
        nb.onclick=()=>{nb.remove();const tip=$('.rs-tip',li);if(tip)tip.classList.add('hide');const qd0=$('.rs-q',li);if(qd0)qd0.hidden=true;const bx=$('.rs-box',li);
          renderProblem(bx,m.prob,{mode:'steps',rep:{lesson:m.lid,gen:m.gen,seed:m.seed},onDone:r=>{if(tip)tip.classList.remove('hide');activeBox=null;
            if(r&&r.good&&retry<2){retry++;award(2,null,'놓친 문제를 단계로 다시 풀었어요')}miss(q,true)}})}}}
    if(L)act.appendChild(el(`<a class="btn ghost t-mini" href="#${L.id}-steps">${L.no}차시 ${esc(L.title)} 다시 보기 →</a>`));
    if(act.childNodes.length)li.appendChild(act)})}

function reset(){try{if(typeof HG_LOC==='object'&&HG_LOC&&HG_LOC.onRoute)HG_LOC.onRoute(location.hash||'')}catch(e){}}

window.BOSS_MIX={pick,bankSrc,show,miss,summary,reset,trackOf,isStale,lessonWeight,typeWeight};
})();
