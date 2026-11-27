/* [T15] 교과서 한 걸음 — 전 차시 공통 3탭 × 3트랙 엔진 · 🦉 부엉 쌤 개념 영상 · [복습 추천] */
(()=>{
'use strict';

const SPECS={};
const BOX_DAYS=[0,1,3,7,14];

/* ── 1. 공통 진행률 · 트랙 완료 · 지표 · 타이머 ── */
function trackGoalDefault(){
  const g=typeof myGoal==='function'?myGoal():null;
  if(!g)return 2;
  return g.k==='calc'?1:g.k==='up'?3:2;
}

window.lessonTrackDone=function(id){
  const p=(typeof DB==='object'&&DB&&DB[id])?DB[id]:null;
  if(!p)return 0;
  const td=Number(p.trackDone)||0;
  if(td>=1&&td<=3)return td;
  if((p.prac&&Number(p.prac.solved)>=5)||(Number(p.steps)>0&&p.concept))return 2;
  return 0;
};

function lesProg(lid){
  return typeof prog==='function'?prog(lid):(DB[lid]=DB[lid]||{concept:false,explore:false,steps:0,prac:{solved:0,streak:0,level:1,fails:0,retry:[]}});
}
function curTrack(lid){
  const p=lesProg(lid);
  return(p.track===1||p.track===2||p.track===3)?p.track:trackGoalDefault();
}
function setTrack(lid,tr){
  const p=lesProg(lid);
  p.track=tr;
  if(typeof save==='function')save();
}
function recordMetric(elapsedMs,errTag){
  if(typeof DB!=='object'||!DB)return;
  DB._metrics=DB._metrics||{fastClicks:0,totalClicks:0,errTags:{}};
  DB._metrics.totalClicks++;
  if(elapsedMs>=0&&elapsedMs<3000)DB._metrics.fastClicks++;
  if(errTag)DB._metrics.errTags[errTag]=(DB._metrics.errTags[errTag]||0)+1;
  if(typeof save==='function')save();
}

let autoNavTimer=null,autoNavTick=null;
function clearAutoNav(){
  if(autoNavTimer){clearTimeout(autoNavTimer);autoNavTimer=null}
  if(autoNavTick){clearInterval(autoNavTick);autoNavTick=null}
}
if(typeof addEventListener==='function')addEventListener('hashchange',clearAutoNav);

/* ── 2. [복습 추천] — 이틀 연속 숙달 & 유형 도장판 (T13 Sec 5) ── */
function revRec(lid,tyNo){
  const p=lesProg(lid);
  p.rev=p.rev||{};
  return p.rev['ty'+tyNo]||null;
}

function scheduleTypeRev(lid,tyNo,hadWrongs){
  const p=lesProg(lid);
  p.rev=p.rev||{};
  const key='ty'+tyNo;
  const cur=p.rev[key];
  const d=typeof addDays==='function'&&typeof today==='function'?addDays(today(),1):'';
  if(!cur||!cur.box){
    p.rev[key]={box:1,due:d,ok:cur&&cur.ok?cur.ok:'',err:hadWrongs?1:0};
  }else if(hadWrongs){
    cur.err=1;
    cur.due=d||cur.due;
    cur.box=1;
  }
  if(typeof save==='function')save();
}

function dueTypeList(targetDate){
  const t=targetDate||(typeof today==='function'?today():'');
  const list=[];
  const RL=(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS))?LESSONS.filter(l=>l.ready&&SPECS[l.id]):[];
  RL.forEach(L=>{
    const p=typeof DB==='object'&&DB&&DB[L.id];
    const rv=p&&p.rev;
    if(!rv||typeof rv!=='object')return;
    const TL=(typeof PTYPES==='object'&&PTYPES[L.id])||[];
    TL.forEach(T=>{
      const rec=rv['ty'+T.no];
      if(rec&&rec.due&&(!t||rec.due<=t)){
        list.push({lid:L.id,tyNo:T.no,L,T,rec});
      }
    });
  });
  list.sort((a,b)=>((b.rec.err?1:0)-(a.rec.err?1:0))||String(a.rec.due).localeCompare(String(b.rec.due))||(a.L.no-b.L.no)||(a.tyNo-b.tyNo));
  return list;
}

function buildDailyRevQueue(targetDate){
  const due=dueTypeList(targetDate);
  if(!due.length)return[];
  const base=typeof newSeed==='function'?newSeed():301;
  const mkItem=(d,k)=>({
    lid:d.lid,tyNo:d.tyNo,L:d.L,T:d.T,rec:d.rec,
    genKey:typeof tyKey==='function'?tyKey(d.lid,d.tyNo):d.lid,
    seed:(base+k*37+d.tyNo*13)%99999+1
  });
  if(due.length>=3)return due.slice(0,3).map((d,k)=>mkItem(d,k));
  if(due.length===2){
    const q=[mkItem(due[0],0),mkItem(due[1],1)];
    if((due[0].rec.box||1)<=1)q.push(mkItem(due[0],2));
    return q;
  }
  const d0=due[0];
  if((d0.rec.box||1)<=1)return[0,1,2].map(k=>mkItem(d0,k));
  return[mkItem(d0,0)];
}

function submitDailyRevType(lid,tyNo,passedFirstTry,reviewDate){
  const p=lesProg(lid);
  p.rev=p.rev||{};
  const key='ty'+tyNo;
  const r=p.rev[key]||{box:1,due:'',ok:'',err:0};
  const d=reviewDate||(typeof today==='function'?today():'');
  if(passedFirstTry){
    const nb=Math.min(4,(Number(r.box)||1)+1);
    const days=BOX_DAYS[nb]||3;
    r.box=nb;
    r.due=typeof addDays==='function'?addDays(d,days):d;
    r.err=0;
    if(!r.ok)r.ok=d;
  }else{
    r.box=1;
    r.due=typeof addDays==='function'?addDays(d,1):d;
    r.err=1;
  }
  p.rev[key]=r;
  if(typeof save==='function')save();
  return r;
}

function typeStampState(lid,tyNo){
  const p=lesProg(lid),rv=p.rev&&p.rev['ty'+tyNo];
  if(rv&&rv.ok)return{cls:'ok',tag:'숙달 ✓',title:'이틀 연속 통과로 숙달했어요'};
  if(rv&&rv.due)return{cls:'due',tag:'복습 대기',title:'내일 [복습 추천]에서 한 번 더 확인해요'};
  if((p.t1Solo&&p.t1Solo[tyNo])||(p.tyS&&p.tyS[tyNo]))return{cls:'t1',tag:'익힘',title:'유형 연습을 해 보았어요'};
  return{cls:'',tag:'',title:'아직 풀지 않았어요'};
}

/* ── 3. 🦉 부엉 쌤 개념 영상 플레이어 ── */
function owlAvatarSVG(exp='normal'){
  const brow=exp==='warn'?`<path d="M 18 22 L 26 25 M 46 22 L 38 25" stroke="#5a3b1e" stroke-width="2.2" stroke-linecap="round"/>`:'';
  const mouth=exp==='happy'?`<path d="M 28 33 Q 32 38 36 33" fill="#f59e0b" stroke="#5a3b1e" stroke-width="1.5"/>`:`<polygon points="29,31 35,31 32,37" fill="#f59e0b" stroke="#5a3b1e" stroke-width="1.2"/>`;
  return`<svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
    <ellipse cx="32" cy="36" rx="21" ry="22" fill="#8b5e3c" stroke="#4a311e" stroke-width="2"/>
    <ellipse cx="32" cy="43" rx="13" ry="13" fill="#f7e8d0"/>
    <path d="M 14 20 L 22 14 L 24 22 Z M 50 20 L 42 14 L 40 22 Z" fill="#6f472b" stroke="#4a311e" stroke-width="1.5"/>
    <circle cx="23" cy="27" r="7" fill="#fff" stroke="#4a311e" stroke-width="1.6"/>
    <circle cx="41" cy="27" r="7" fill="#fff" stroke="#4a311e" stroke-width="1.6"/>
    <circle cx="24" cy="27" r="3" fill="#1d2640"/><circle cx="40" cy="27" r="3" fill="#1d2640"/>
    ${brow}${mouth}
    <rect x="20" y="10" width="24" height="4" rx="1.5" fill="#1d2640"/>
    <polygon points="32,4 48,10 32,14 16,10" fill="#2a4d9e"/>
  </svg>`;
}

/* [T21] 부엉 쌤 그림극 v2: 버튼 대신 화면 빈 곳을 누르면 한 줄씩 넘어가요(Space·Enter·→ 키도 돼요).
   장면 = {cap, exp, svg()→SVG 문자열, beats:['한 줄', {say, exp}, …] (없으면 say), ask}
   그림 안 <g data-b="n">는 n번째 줄에서 나타나요(0이면 장면 시작). 그 안의 class="dr" 선은 펜으로 그리듯 나타나요.
   data-b가 없는 예전 장면은 주황 선이 그려지듯 나타나고, 자막은 문장마다 나눠서 보여 줘요. */
const OWL_HL_RE=/^#e08a1e$/i;
function owlReduce(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
function owlBeats(sc){
  if(Array.isArray(sc.beats)&&sc.beats.length)return sc.beats.map(b=>typeof b==='string'?{say:b}:b);
  const s=String(sc.say||''),parts=s.split(/(?<=[.!?])\s+/).filter(x=>x.trim());
  const bal=x=>(x.match(/<span\b/g)||[]).length===(x.match(/<\/span>/g)||[]).length&&(x.match(/<b>/g)||[]).length===(x.match(/<\/b>/g)||[]).length;
  return(parts.length>1&&parts.length<=4&&parts.every(bal)?parts:[s]).map(say=>({say}));
}
function owlDraw(root){
  if(!root||owlReduce())return;
  $$('.dr',root).forEach((e,i)=>{
    if(typeof e.getTotalLength!=='function')return;
    let L=0;try{L=e.getTotalLength()}catch(x){}
    if(!(L>0))return;
    e.style.transition='none';e.style.strokeDasharray=L+' '+L;e.style.strokeDashoffset=L;
    const go=()=>{e.style.transition=`stroke-dashoffset ${Math.min(1.5,0.55+L/320).toFixed(2)}s ease-in-out ${(i*0.3).toFixed(2)}s`;e.style.strokeDashoffset='0'};
    e.addEventListener('transitionend',()=>{e.style.strokeDasharray='';e.style.strokeDashoffset='';e.style.transition=''},{once:true});
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(go));else go();
  });
}
function mountOwlShow(host,lid,spec,opt={}){
  const scenes=typeof spec.owlScenes==='function'?spec.owlScenes():(spec.owlScenes||[]);
  if(!scenes.length){host.innerHTML='';return}
  const B=scenes.map(owlBeats);
  let idx=0,beat=0,seen=0,finished=false;const askedDone=new Set();
  const plain=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

  const paint=anim=>{
    const sc=scenes[idx],bs=B[idx],bt=bs[beat]||bs[0],atEnd=beat>=bs.length-1,showAsk=!!sc.ask&&atEnd,needAsk=showAsk&&!askedDone.has(idx),isLast=idx>=scenes.length-1;
    const svg=$('.owl-stage svg',host);
    if(svg){
      const gs=$$('[data-b]',svg);
      gs.forEach(g=>{const n=+g.getAttribute('data-b');g.style.display=n<=beat?'':'none'});
      if(anim){
        gs.filter(g=>+g.getAttribute('data-b')===beat).forEach(owlDraw);
        if(!gs.length&&beat===0){
          $$('path,line,polyline,circle',svg).forEach(e=>{const fl=e.getAttribute('fill');if(OWL_HL_RE.test(e.getAttribute('stroke')||'')&&(e.tagName.toLowerCase()==='line'||!fl||fl==='none'))e.classList.add('dr')});
          owlDraw(svg);
        }
      }
    }
    const av=$('.owl-av',host);if(av)av.innerHTML=owlAvatarSVG(bt.exp||sc.exp||'normal');
    const bub=$('#owlBub',host);
    if(bub)bub.innerHTML=bs.slice(0,beat+1).map((x,i)=>`<p class="owl-line${i===beat?' now':''}">${x.say}</p>`).join('');
    const ak=$('#owlAskHost',host);
    if(ak){
      ak.innerHTML=showAsk?`<div class="owl-ask">
        <div class="owl-ask-q">✋ 잠깐 확인! ${sc.ask.q}</div>
        <div class="ct-hit-row" id="owlAskBtns">${sc.ask.choices.map(c=>`<button type="button" class="ct-hit${askedDone.has(idx)&&c===sc.ask.ans?' ok':''}" data-oa="${c}"${askedDone.has(idx)?' disabled':''}>${c}</button>`).join('')}</div>
        <div id="owlAskMsg">${askedDone.has(idx)?`<div class="feedback ok" style="margin-top:6px">${sc.ask.ok}</div>`:''}</div></div>`:'';
      $$('[data-oa]',ak).forEach(b=>b.onclick=()=>{
        const msg=$('#owlAskMsg',ak);
        if(b.dataset.oa===sc.ask.ans){askedDone.add(idx);b.classList.add('ok');$$('[data-oa]',ak).forEach(x=>x.disabled=true);if(msg)msg.innerHTML=`<div class="feedback ok" style="margin-top:6px">${sc.ask.ok}</div>`;paintHint()}
        else{b.classList.add('bad');b.disabled=true;if(msg)msg.innerHTML=`<div class="ct-cool" style="margin-top:6px">💡 ${sc.ask.hint}</div>`}
      });
    }
    const sum=$('#owlSumHost',host);
    if(sum)sum.innerHTML=finished&&Array.isArray(spec.owlSummary)&&spec.owlSummary.length?`<div class="owl-sum"><b>📌 부엉 쌤 핵심 정리</b><ul>${spec.owlSummary.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:'';
    const pg=$('.owl-pg',host);if(pg)pg.innerHTML=`장면 ${idx+1} / ${scenes.length}${bs.length>1?` <span class="owl-bdots">${bs.map((_,i)=>`<i class="${i<=beat?'on':''}"></i>`).join('')}</span>`:''}`;
    const pv=$('#owlPrev',host);if(pv)pv.disabled=idx===0&&beat===0;
    $$('.owl-dot',host).forEach((d,i)=>{d.className='owl-dot'+(i<idx||(finished&&i===idx)?' done':i===idx?' on':'');d.disabled=i>seen});
    paintHint();
    void needAsk;void isLast;
  };
  const paintHint=()=>{
    const h=$('.owl-hint',host);if(!h)return;
    const sc=scenes[idx],atEnd=beat>=B[idx].length-1,needAsk=!!sc.ask&&atEnd&&!askedDone.has(idx),isLast=idx>=scenes.length-1;
    h.className='owl-hint'+(finished?' fin':needAsk?' ask':'');
    h.innerHTML=finished?'✓ 개념을 끝까지 봤어요. 장면 점을 누르면 다시 볼 수 있어요.'
      :needAsk?'✋ 질문에 답하면 다음으로 넘어가요.'
      :isLast&&atEnd?'👆 화면을 누르면 핵심 정리가 나와요.'
      :'👆 화면 빈 곳을 누르면 다음으로 넘어가요.';
  };
  const enter=()=>{
    const sc=scenes[idx],hadFocus=typeof host.contains==='function'&&typeof document==='object'&&host.contains(document.activeElement);
    seen=Math.max(seen,idx);
    host.innerHTML=`<div class="owl-wrap owl-tap" tabindex="0" role="group" aria-label="부엉 쌤 개념 그림극. 화면을 누르면 다음으로 넘어가요.">
      <div class="owl-top">
        <span class="owl-title">🦉 부엉 쌤의 개념 그림극</span>
        <div class="owl-dots">${scenes.map((_,i)=>`<button type="button" class="owl-dot" data-oi="${i}" aria-label="${i+1}장면"></button>`).join('')}</div>
      </div>
      <div class="owl-stage owl-new">${sc.svg?sc.svg():''}${sc.cap?`<div class="owl-cap">${sc.cap}</div>`:''}</div>
      <div class="owl-row"><div class="owl-av"></div><div class="owl-bub" id="owlBub" aria-live="polite"></div></div>
      <div id="owlAskHost"></div><div id="owlSumHost"></div>
      <div class="owl-ctrl">
        <div><button type="button" class="btn ghost mini" id="owlPrev">◀ 이전</button> <button type="button" class="btn ghost mini" id="owlReplay">↺ 처음부터</button>${typeof canSpeak!=='undefined'&&canSpeak&&typeof speak==='function'?' <button type="button" class="btn ghost mini say" id="owlSay" aria-label="자막 읽어 주기">🔊 듣기</button>':''}</div>
        <span class="owl-pg muted"></span>
      </div>
      <div class="owl-hint"></div>
    </div>`;
    const wrap=$('.owl-wrap',host);
    wrap.onclick=e=>{if(e.target.closest&&e.target.closest('button,a,input,select,label,.owl-ask,.owl-sum'))return;next()};
    wrap.onkeydown=e=>{if(e.target!==wrap)return;if(e.key===' '||e.key==='Enter'||e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key==='ArrowLeft'){e.preventDefault();prev()}};
    $$('[data-oi]',host).forEach(b=>b.onclick=()=>{const t=+b.dataset.oi;if(t<=seen){idx=t;beat=0;enter()}});
    $('#owlPrev',host).onclick=prev;
    $('#owlReplay',host).onclick=()=>{idx=0;beat=0;enter()};
    const sy=$('#owlSay',host);if(sy)sy.onclick=()=>{const bt=B[idx][beat];speak(plain(bt&&bt.say),sy)};
    if(hadFocus&&wrap.focus)try{wrap.focus({preventScroll:true})}catch(e){}
    paint(true);
  };
  const next=()=>{
    if(finished)return;
    const sc=scenes[idx];
    if(beat<B[idx].length-1){beat++;paint(true);return}
    if(sc.ask&&!askedDone.has(idx)){const a=$('.owl-ask',host);if(a){a.classList.remove('owl-shake');void a.offsetWidth;a.classList.add('owl-shake')}return}
    if(idx<scenes.length-1){idx++;beat=0;enter();return}
    finished=true;
    const p=lesProg(lid);p.concept=true;p.tday=today();
    if(typeof save==='function')save();
    if(typeof award==='function')award(5,lid+':owl','부엉 쌤 개념 그림극을 끝까지 봤어요');
    if(opt.onFinish)opt.onFinish();
    paint(false);
    const s=$('#owlSumHost',host);if(s&&s.scrollIntoView)try{s.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}
  };
  const prev=()=>{
    if(beat>0){beat--;paint(false);return}
    if(idx>0){idx--;beat=B[idx].length-1;enter()}
  };
  /* 접힌 상자(details) 안에 있으면 펼칠 때 장면을 처음부터 다시 그려요(애니메이션이 숨은 채 끝나지 않게) */
  const det=host.closest&&host.closest('details');
  if(det&&det.addEventListener)det.addEventListener('toggle',()=>{if(det.open&&!finished){beat=0;enter()}});
  enter();
}

/* ── 4. 🌱 첫걸음 렌더러 ── */
/* [T20] 규칙 총정리 3절 6: 3초 안에 틀리면 서두르지 않게 안내해요. */
const FAST_MS=3000,FAST_MSG='🐢 잠깐! 급하게 누르면 함정에 빠지기 쉬워요. 무엇을 묻고 있는지 먼저 확인해 봐요.';
function renderT1Steps(body,lid,spec){
  const p=lesProg(lid);
  const schemaList=spec.schemaQs||[];
  const guideList=spec.firstGuide||[];
  let sub=p.t1SchemaDone&&guideList.length?'guide':'schema';
  const drawSub=()=>{
    clearAutoNav();
    body.innerHTML=`<div class="ct-subtabs">
      <button type="button" class="ct-subtab${sub==='schema'?' on':''}" data-s="schema">A. 맞는지 · 아닌지 구별하기 (${p.t1SchemaDone?'완료 ✓':(spec.schemaRapid?spec.schemaRapid.n:schemaList.length)+'문항'})</button>
      ${guideList.length?`<button type="button" class="ct-subtab${sub==='guide'?' on':''}" data-s="guide">B. 선생님과 같이 따라 풀기 (${guideList.length}유형)</button>`:''}
    </div><div id="t1SubHost"></div>`;
    $$('.ct-subtab',body).forEach(b=>b.onclick=()=>{sub=b.dataset.s;drawSub()});
    const host=$('#t1SubHost',body);
    if(sub==='schema')renderT1Schema(host,lid,spec,()=>{if(guideList.length){sub='guide';drawSub()}else if(typeof location==='object')location.hash='#'+lid+'-'+(spec.kind==='concept'?'concept':'practice')});
    else renderT1Guide(host,lid,spec);
  };
  drawSub();
}

/* [T19] 첫걸음 A단계 · 주황 표시 연속 구별하기
   spec.schemaRapid = { n: 문제 수, kinds: 종류 수, q: 묻는 말, choices: [보기], make(kindIdx, seed) → {fig, ans, why, also?} }
   그림이 연달아 뜨고, 맞히면 잠깐 뒤 저절로 다음 그림. 틀리면 이유를 보여 주고 같은 종류를 한 번 더 내요. */
function renderT1Rapid(host,lid,spec,onNextPart){
  const R=spec.schemaRapid,p=lesProg(lid);
  const rnd=typeof mulberry==='function'?mulberry(typeof newSeed==='function'?newSeed():Date.now()%99991):Math.random;
  const kinds=[...Array(R.kinds).keys()];
  for(let i=kinds.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[kinds[i],kinds[j]]=[kinds[j],kinds[i]]}
  const total=Math.min(R.n||8,kinds.length);
  const newSeedFor=k=>k+R.kinds*(1+Math.floor(rnd()*900));
  const queue=kinds.slice(0,total).map(k=>({k,seed:newSeedFor(k)}));
  let idx=0,good=0,nextT=null;
  const finish=()=>{
    p.t1SchemaDone=true;p.tday=today();if(typeof save==='function')save();
    if(typeof award==='function')award(5,lid+':t1schema','주황색 표시를 모두 구별했어요');
    host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>구별하기 ${queue.length}문제 완료!</b> 한 번에 맞힌 문제 ${good}개예요. ${spec.kind==='concept'?'방금 본 모양의 이름을 <b>개념 보기</b>에서 다시 확인해 봐요.':'이제 <b>선생님과 같이 따라 풀기</b>로 넘어가요.'}</div>
      <div class="next-row" style="justify-content:flex-start">${spec.kind==='concept'?`<a class="btn primary" href="#${lid}-concept">부엉 쌤 개념 보러 가기 →</a>`:''}${(spec.firstGuide||[]).length?`<button type="button" class="btn ${spec.kind==='concept'?'ghost':'primary'}" id="toGuideBtn">선생님과 따라 풀기 →</button>`:spec.kind==='concept'?'':`<a class="btn primary" href="#${lid}-practice">첫걸음 차시 마무리 →</a>`}</div></div>`;
    const gb=$('#toGuideBtn',host);if(gb)gb.onclick=onNextPart;
  };
  const draw=()=>{
    if(nextT){clearTimeout(nextT);nextT=null}
    if(!host.isConnected)return;
    if(idx>=queue.length)return finish();
    const cur=queue[idx],it=R.make(cur.k,cur.seed),shownAt=Date.now();
    let missed=false;const bothPick=new Set();
    host.innerHTML=`<div class="ct-card ct-schema ct-rapid">
      <div class="ct-card-h"><h2>${R.title||'주황색은 무엇일까요?'}</h2><div class="ct-schema-prog">${queue.map((_,i)=>`<span class="ct-dot-step${i<idx?' done':i===idx?' on':''}">${i<idx?'✓':i+1}</span>`).join('')}<span>${idx+1} / ${queue.length}</span></div></div>
      <div class="ct-stage">
        <div class="ct-fig ct-rapid-fig">${it.fig}</div>
        <div>
          <p class="ct-schema-q">${R.q||'주황색으로 표시한 것은?'}</p>
          <div class="ct-hit-row" id="rqOpts">${R.choices.map((c,i)=>`<button type="button" class="ct-hit" style="--i:${i}" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="rqMsg" aria-live="polite"></div>
        </div>
      </div></div>`;
    const btns=$$('#rqOpts .ct-hit',host),msg=$('#rqMsg',host);
    btns.forEach(btn=>btn.onclick=()=>{
      const v=btn.dataset.v,ms=Date.now()-shownAt;
      if(it.also&&it.also[v]){btn.disabled=true;msg.innerHTML=`<div class="ct-cool">💡 ${it.also[v]}</div>`;return}
      /* [T21] 이름이 두 개인 그림(반원 = 부채꼴 + 활꼴): 어느 쪽을 먼저 골라도 '하나 더'를 고르게 해요 */
      if(it.both&&it.both.includes(v)){bothPick.add(v);btn.disabled=true;btn.classList.add('ok');if(it.both.some(x=>!bothPick.has(x))){msg.innerHTML=`<div class="ct-cool">👍 맞아요! 이 도형은 <b>이름이 하나 더</b> 있어요. 나머지 하나도 골라 보세요.</div>`;return}}
      btns.forEach(b=>b.disabled=true);
      if(v===it.ans||(it.both&&it.both.includes(v))){
        recordMetric(ms,null);
        btn.classList.add('ok');
        if(!missed)good++;
        msg.innerHTML=`<div class="feedback ok" style="margin-top:10px">${it.why}</div>`;
        idx++;nextT=setTimeout(draw,missed?1400:900);
      }else{
        missed=true;
        recordMetric(ms,ms<FAST_MS?'schema_fast_wrong':'schema_wrong');
        btn.classList.add('bad');
        const okV=it.both||[it.ans];btns.filter(b=>okV.includes(b.dataset.v)).forEach(b=>b.classList.add('ok'));
        msg.innerHTML=`<div class="ct-cool">${ms<FAST_MS?FAST_MSG+'<br>':''}정답: <b>${okV.join(', ')}</b><br>${it.why}</div>
          <div class="next-row" style="justify-content:flex-start"><button type="button" class="btn primary" id="rqAgain">${queue.length<total+4?'같은 종류 한 번 더 →':'다음 그림 →'}</button></div>`;
        if(queue.length<total+4)queue.splice(idx+1,0,{k:cur.k,seed:newSeedFor(cur.k)});
        const ab=$('#rqAgain',host);if(ab)ab.onclick=()=>{idx++;draw()};
      }
    });
  };
  draw();
}

function renderT1Schema(host,lid,spec,onNextPart){
  if(spec.schemaRapid&&typeof spec.schemaRapid.make==='function')return renderT1Rapid(host,lid,spec,onNextPart);
  const p=lesProg(lid),QS=spec.schemaQs||[];
  let idx=0,coolTimer=null,shownAt=Date.now();
  const draw=()=>{
    if(coolTimer){clearTimeout(coolTimer);coolTimer=null}
    if(idx>=QS.length){
      p.t1SchemaDone=true;p.tday=today();if(typeof save==='function')save();
      if(typeof award==='function')award(5,lid+':t1schema','맞는지 아닌지 모두 구별했어요');
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>구별 연습 ${QS.length}문항 완료!</b> ${spec.kind==='concept'?'방금 본 모양에 어떤 이름이 붙는지 <b>개념 보기</b>에서 확인해 봐요.':'이제 <b>선생님과 같이 따라 풀기</b>로 넘어가요.'}</div>
        <div class="next-row" style="justify-content:flex-start">${spec.kind==='concept'?`<a class="btn primary" href="#${lid}-concept">부엉 쌤 개념 보러 가기 →</a>`:''}<button type="button" class="btn ${spec.kind==='concept'?'ghost':'primary'}" id="toGuideBtn">선생님과 따라 풀기 →</button></div></div>`;
      const gb=$('#toGuideBtn',host);if(gb)gb.onclick=onNextPart;
      return;
    }
    const q=QS[idx];shownAt=Date.now();
    host.innerHTML=`<div class="ct-card ct-schema">
      <div class="ct-card-h"><h2>맞을까? 아닐까? 구별하기</h2><div class="ct-schema-prog">${QS.map((_,i)=>`<span class="ct-dot-step${i<idx?' done':i===idx?' on':''}">${i<idx?'✓':i+1}</span>`).join('')}<span>${idx+1} / ${QS.length}</span></div></div>
      <div class="ct-stage">
        <div class="ct-fig">${q.fig?q.fig():''}<div class="ct-fig-cap">그림의 핵심 표시를 눈으로 먼저 확인해요</div></div>
        <div>
          <p class="ct-schema-q">${q.q}</p>
          <div class="ct-hit-row" id="sqOpts">${q.choices.map(c=>`<button type="button" class="ct-hit" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="sqMsg"></div>
        </div>
      </div></div>`;
    $$('#sqOpts .ct-hit',host).forEach(btn=>{
      btn.onclick=()=>{
        const v=btn.dataset.v,ms=Date.now()-shownAt;
        if(v===q.ans){
          recordMetric(ms,null);
          $$('#sqOpts .ct-hit',host).forEach(b=>b.disabled=true);
          btn.classList.add('ok');
          $('#sqMsg',host).innerHTML=`<div class="feedback ok" style="margin-top:10px">${q.why}</div><div class="next-row" style="justify-content:flex-start"><button type="button" class="btn primary" id="sqNext">${idx+1<QS.length?'다음 모양 보기 →':'완료!'}</button></div>`;
          const nb=$('#sqNext',host);if(nb)nb.onclick=()=>{idx++;draw()};
        }else{
          recordMetric(ms,'schema_wrong');
          $$('#sqOpts .ct-hit',host).forEach(b=>b.disabled=true);
          btn.classList.add('bad');
          $('#sqMsg',host).innerHTML=`<div class="ct-cool">💡 ${q.hint}<br><small>그림을 1.5초 동안 천천히 다시 보고 골라 보세요…</small></div>`;
          coolTimer=setTimeout(()=>{$$('#sqOpts .ct-hit',host).forEach(b=>{if(b!==btn)b.disabled=false})},1500);
        }
      };
    });
  };
  draw();
}

function renderT1Guide(host,lid,spec){
  const p=lesProg(lid),GUIDE=spec.firstGuide||[];
  p.t1Solo=p.t1Solo||{};
  let gIdx=0,step=0,foundGiven=new Set(),helped=false,twinDone=false,twinSeed=typeof newSeed==='function'?newSeed():41,stepShown=Date.now();

  const mountSoloTwin=()=>{
    const g=GUIDE[gIdx],soloHost=$('#fgSoloHost',host);
    if(!soloHost||!g)return;
    const key=typeof tyKey==='function'&&typeof GEN==='object'&&GEN[tyKey(lid,g.tyNo)]?tyKey(lid,g.tyNo):null;
    const prob=key?GEN[key](twinSeed):null;
    if(!prob||typeof renderProblem!=='function'){
      soloHost.innerHTML=`<div class="feedback ok">혼자 확인 문제를 마쳤어요!</div>`;
      p.t1Solo[g.tyNo]=true;if(typeof save==='function')save();
      return;
    }
    soloHost.innerHTML=`<div class="ct-solo"><div class="ct-solo-h"><span>🌟 혼자 확인 · 방금 푼 문제 비슷하게 1문제</span><button type="button" class="btn ghost mini" id="fgTwinNew">🔄 다른 숫자</button></div><div id="fgTwinBody"></div></div>`;
    const nb=$('#fgTwinNew',soloHost);if(nb)nb.onclick=()=>{twinSeed=(twinSeed+19)%99999+1;mountSoloTwin()};
    renderProblem($('#fgTwinBody',soloHost),prob,{mode:'final',visual:true,rep:{lesson:lid,gen:key,seed:twinSeed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
      if(typeof logAttempt==='function')logAttempt({lesson:lid,kind:'steps',good,wrongs,mode,gen:key,seed:twinSeed,ptype:prob.ptype,stepWrongs,revealed});
      if(good){
        twinDone=true;
        p.t1Solo[g.tyNo]=true;
        p.tday=today();p.trackDone=Math.max(Number(p.trackDone)||0,1);
        scheduleTypeRev(lid,g.tyNo,wrongs>0);
        if(typeof save==='function')save();
        if(typeof award==='function')award(5,lid+':solo:'+g.tyNo,'도움 없이 혼자 확인 1문제를 풀었어요');
        const allSolo=GUIDE.every(x=>p.t1Solo[x.tyNo]);
        box.insertAdjacentHTML('beforeend',`<div class="next-row" style="justify-content:flex-start">
          ${gIdx+1<GUIDE.length?`<button type="button" class="btn primary" id="fgSoloNext">다음 유형 따라하기 →</button>`:`<a class="btn primary" href="#${lid}-practice">첫걸음 차시 마무리 →</a>`}
          ${allSolo&&!helped?`<button type="button" class="btn ghost" id="fgGoT2">🌿 한걸음 올라가기 →</button>`:''}
        </div>`);
        const sn=$('#fgSoloNext',box);if(sn)sn.onclick=()=>{gIdx++;step=0;foundGiven=new Set();helped=false;twinDone=false;draw()};
        const g2=$('#fgGoT2',box);if(g2)g2.onclick=()=>{setTrack(lid,2);viewTrackLesson(lid,'steps')};
      }else{
        const rb=document.createElement('button');rb.type='button';rb.className='btn primary';rb.textContent='숫자 바꿔 다시 풀기 →';
        rb.onclick=()=>{twinSeed=(twinSeed+29)%99999+1;mountSoloTwin()};
        box.appendChild(rb);
      }
    }});
  };

  const draw=()=>{
    clearAutoNav();
    const g=GUIDE[gIdx];
    if(!g){host.innerHTML='';return}
    const hl=step===0?[]:step===1?(foundGiven.size?g.givenChips.filter(c=>foundGiven.has(c.k)&&c.hl).map(c=>c.hl):(g.wantHl||[])):(g.wantHl||[]);
    stepShown=Date.now();
    const s0Done=step>0,s1Done=step>1,s2Done=step>2,s3Done=step>3;
    const calcNm=(typeof CALC!=='undefined'&&CALC.find(c=>c.id===g.calcTopic)||{}).nm||g.calcTopic;

    host.innerHTML=`<div class="ct-card">
      <div class="ct-card-h">
        <h2>${g.title}</h2>
        <div class="ct-hit-row" style="margin:0">${GUIDE.map((x,i)=>`<button type="button" class="chip${i===gIdx?' on':''}" data-gi="${i}">${i+1}번${p.t1Solo[x.tyNo]?' ✓':''}</button>`).join('')}</div>
      </div>
      <div class="box plain" style="margin-top:0">${g.problem}</div>
      <div class="ct-stage">
        <div class="ct-fig">${g.fig?g.fig(hl):''}<div class="ct-fig-cap">안내에 따라 눌러 보면 그림에서 바로 확인돼요</div></div>
        <div class="ct-guide">
          <div class="ct-gstep ${s0Done?'done':'cur'}">
            <div class="ct-gstep-h"><span class="ct-gnum">${s0Done?'✓':'1'}</span>이 문제에서 구하려는 것은 무엇인가요?</div>
            ${s0Done?`<small style="color:var(--ok)">✓ ${g.wantAns}</small>`:`<div class="ct-hit-row">${g.wantChips.map(c=>`<button type="button" class="ct-hit" data-w="${c}">${c}</button>`).join('')}</div><div id="fgM0"></div>`}
          </div>
          <div class="ct-gstep ${s1Done?'done':step===1?'cur':'lock'}">
            <div class="ct-gstep-h"><span class="ct-gnum">${s1Done?'✓':'2'}</span>문제에 주어진 정보를 모두 클릭해 보세요</div>
            ${step<1?'<small class="muted">1단계를 마치면 열려요</small>':s1Done?`<small style="color:var(--ok)">✓ 필요한 정보를 모두 찾았어요</small>`
              :`<div class="ct-hit-row">${g.givenChips.map(c=>`<button type="button" class="ct-hit${foundGiven.has(c.k)?' ok':''}" data-gk="${c.k}" ${foundGiven.has(c.k)?'disabled':''}>${c.t}</button>`).join('')}</div><div id="fgM1"></div>`}
          </div>
          <div class="ct-gstep ${s2Done?'done':step===2?'cur':'lock'}">
            <div class="ct-gstep-h"><span class="ct-gnum">${s2Done?'✓':'3'}</span>선생님 풀이 식의 숫자가 어디서 왔는지 맞춰 봐요</div>
            ${step<2?'<small class="muted">2단계를 마치면 열려요</small>':`<div class="ct-eq-box">${g.teacherEq}</div>`+(s2Done?`<small style="color:var(--ok)">✓ ${g.pairAns}</small>`
              :`<p style="margin:6px 0">${g.pairQ}</p><div class="ct-hit-row">${g.pairChoices.map(c=>`<button type="button" class="ct-hit" data-p="${c}">${c}</button>`).join('')}</div><div id="fgM2"></div>`)}
          </div>
          <div class="ct-gstep ${s3Done?'done':step===3?'cur':'lock'}">
            <div class="ct-gstep-h"><span class="ct-gnum">${s3Done?'✓':'4'}</span>계산해서 답을 넣어 보세요</div>
            ${step<3?'<small class="muted">3단계를 마치면 열려요</small>':s3Done?`<div class="feedback ok">${g.calcExplain}</div>`
              :`<p style="margin:4px 0">${g.calcPrompt}</p>
                <div class="ct-input-row"><input type="text" class="ct-inp" id="fgInp" placeholder="?" inputmode="text"><button type="button" class="btn primary" id="fgChk">확인</button></div>
                <div id="fgM3"></div>
                <div class="ct-calchelp">
                  <button type="button" class="ct-calchelp-toggle" id="fgHelpBtn">🤔 계산이 어렵나요? (선생님이 대신 계산 + 기초 연산 연결)</button>
                  <div id="fgHelpBox"${helped?'':' hidden'}></div>
                </div>`}
          </div>
        </div>
      </div>
      <div id="fgSoloHost"></div>
      ${s3Done?`<div class="next-row" style="justify-content:flex-start"><button type="button" class="btn ghost" id="fgNext">${gIdx+1<GUIDE.length?'다음 유형 연습하기 →':'차시 마무리 하러 가기 →'}</button></div>`:''}
    </div>`;

    $$('[data-gi]',host).forEach(b=>b.onclick=()=>{gIdx=+b.dataset.gi;step=0;foundGiven=new Set();helped=false;twinDone=false;draw()});
    $$('[data-w]',host).forEach(b=>b.onclick=()=>{
      const ms=Date.now()-stepShown;
      if(b.dataset.w===g.wantAns){recordMetric(ms,null);step=1;draw()}
      else{recordMetric(ms,'want_wrong');b.classList.add('bad');const m=$('#fgM0',host);if(m)m.innerHTML='<small style="color:var(--bad)">문장 끝에서 무엇을 구하라고 했는지 다시 봐요.</small>'}
    });
    const needCnt=g.givenChips.filter(c=>c.ok).length;
    $$('[data-gk]',host).forEach(b=>b.onclick=()=>{
      const ch=g.givenChips.find(x=>x.k===b.dataset.gk),ms=Date.now()-stepShown;
      if(ch&&ch.ok){recordMetric(ms,null);foundGiven.add(ch.k);if(foundGiven.size>=needCnt)step=2;draw()}
      else{recordMetric(ms,'given_trap');b.classList.add('bad');const m=$('#fgM1',host);if(m)m.innerHTML='<small style="color:var(--bad)">이 문제에서는 쓰지 않는 조건이에요. 다시 골라 봐요.</small>'}
    });
    $$('[data-p]',host).forEach(b=>b.onclick=()=>{
      const ms=Date.now()-stepShown;
      if(b.dataset.p===g.pairAns){recordMetric(ms,null);step=3;draw()}
      else{recordMetric(ms,'pair_wrong');b.classList.add('bad');const m=$('#fgM2',host);if(m)m.innerHTML='<small style="color:var(--bad)">식과 그림의 짝을 한 번 더 확인해 봐요.</small>'}
    });

    const chk=$('#fgChk',host),inp=$('#fgInp',host);
    if(chk&&inp)chk.onclick=()=>{
      const raw=String(inp.value||'').trim().replace('−','-').replace(/π/g,'');
      const v=parseFloat(raw),ms=Date.now()-stepShown;
      if(Number.isFinite(v)&&Math.abs(v-g.calcAns)<1e-6){
        recordMetric(ms,null);step=4;if(typeof award==='function')award(3,lid+':fg:'+g.id,'선생님 풀이를 따라 풀었어요');draw();
      }else{
        recordMetric(ms,'calc_err');
        const m=$('#fgM3',host);if(m)m.innerHTML='<small style="color:var(--bad)">식 숫자를 다시 확인하거나, 아래 "계산이 어렵나요?"를 눌러도 돼요.</small>';
      }
    };

    const hb=$('#fgHelpBtn',host),hbox=$('#fgHelpBox',host);
    if(hb&&hbox)hb.onclick=()=>{
      clearAutoNav();helped=true;
      if(typeof DB==='object'&&DB){DB._needCalc={id:g.calcTopic,from:lid,at:Date.now()};if(typeof save==='function')save()}
      step=4;draw();
      const boxAfter=$('#fgHelpBox',host)||hbox;
      let left=3;
      const paintBox=()=>{
        boxAfter.hidden=false;boxAfter.className='ct-calchelp-box';
        boxAfter.innerHTML=`<div><b>선생님이 대신 계산했어요:</b> ${g.calcExplain}</div>
          <div style="margin-top:6px">이 계산이 막혔으니 <b>기초 연산 · ${calcNm}</b>으로 <b id="fgSec">${left}</b>초 뒤 자동 이동해요.</div>
          <div class="ct-timer-bar"><i id="fgBar" style="width:${Math.round((3-left)/3*100)}%"></i></div>
          <div class="ct-calchelp-act">
            <a class="btn primary" href="#calc-${g.calcTopic}">지금 바로 기초 연산 가기 →</a>
            <button type="button" class="btn ghost" id="fgCancelNav">여기 머무르고 혼자 풀어 보기</button>
          </div>`;
        const cBtn=$('#fgCancelNav',boxAfter);
        if(cBtn)cBtn.onclick=()=>{clearAutoNav();const sec=$('#fgSec',boxAfter);if(sec&&sec.parentNode)sec.parentNode.innerHTML='자동 이동을 멈췄어요. 위 버튼으로 언제든 갈 수 있어요.'};
      };
      paintBox();
      autoNavTick=setInterval(()=>{left=Math.max(0,left-1);const s=$('#fgSec',boxAfter),br=$('#fgBar',boxAfter);if(s)s.textContent=left;if(br)br.style.width=`${Math.round((3-left)/3*100)}%`},1000);
      autoNavTimer=setTimeout(()=>{clearAutoNav();if(typeof location==='object')location.hash='#calc-'+g.calcTopic},3100);
    };

    if(s3Done&&!twinDone)mountSoloTwin();
    const nb=$('#fgNext',host);
    if(nb)nb.onclick=()=>{if(gIdx+1<GUIDE.length){gIdx++;step=0;foundGiven=new Set();helped=false;twinDone=false;draw()}else if(typeof location==='object')location.hash='#'+lid+'-practice'};
  };
  draw();
}

function renderT1Concept(body,lid,spec){
  body.innerHTML=`<div id="owlConceptHost"></div>
    ${spec.kind==='concept'?`<div class="next-row"><a class="btn primary" href="#${lid}-practice">3단계 차시 마무리 하러 가기 →</a></div>`
      :`<div class="next-row"><a class="btn primary" href="#${lid}-steps">2단계 유형 익히기(선생님과 따라 풀기) →</a></div>`}
    ${bonusExploreHTML(lid)}`;
  const host=$('#owlConceptHost',body);
  if(host)mountOwlShow(host,lid,spec);
}

function renderT1Practice(body,lid,spec){
  const p=lesProg(lid);
  /* [T20] schemaRapid.check = 마무리에 섞을 빠른 구별 종류 번호들. 틀리면 같은 종류의 다른 그림(make)으로 다시 확인해요. */
  const R=spec.schemaRapid,rapidItem=k=>{const mk=sd=>{const it=R.make(k,k+R.kinds*(1+sd%900));return{id:'r'+k+'_'+sd,kind:'r'+k,q:R.q,fig:()=>it.fig,choices:R.choices,ans:it.ans,also:it.also,both:it.both,why:it.why,hint:`정답은 <b>${(it.both||[it.ans]).join(', ')}</b>예요. ${it.why}`}};const first=mk(Math.floor(Math.random()*900)+1);first.make=mk;return first};
  const rapidPool=R&&Array.isArray(R.check)?R.check.map(rapidItem):[];
  const basePool=spec.t1Check&&spec.t1Check.length?spec.t1Check:(rapidPool.length?[]:(spec.schemaQs||[]).map((q,i)=>({id:'t1q'+i,kind:'k'+i,q:q.q,fig:q.fig,choices:q.choices,ans:q.ans,hint:q.hint})));
  const pool=rapidPool.concat(basePool);
  if(rapidPool.length)for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  let qQueue=pool.slice(),idx=0,recheckKind=null,consecKind=null,rescued=false,doneSet=new Set();
  let bothPick=new Set();
  const draw=()=>{
    bothPick=new Set();
    if(rescued){
      body.innerHTML=`<div class="ct-rescue"><h3>잠깐! 방금 유형을 한 번 더 정리하고 올까요?</h3><p>같은 종류의 판단을 두 번 연속 헷갈렸어요. <b>유형 익히기</b>에서 그림과 안내를 따라 다시 확인하고 돌아오면 훨씬 쉬워요.</p>
        <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#${lid}-steps">유형 익히기로 돌아가기 →</a><button type="button" class="btn ghost" id="t1RetryAll">차시 마무리 다시 풀기</button></div></div>`;
      const rb=$('#t1RetryAll',body);if(rb)rb.onclick=()=>{qQueue=pool.slice();idx=0;recheckKind=null;consecKind=null;rescued=false;doneSet=new Set();draw()};
      return;
    }
    if(idx>=qQueue.length){
      p.tday=today();p.trackDone=Math.max(Number(p.trackDone)||0,1);
      p.concept=true;
      if(typeof save==='function')save();
      if(typeof award==='function')award(10,lid+':t1','첫걸음 차시 마무리를 통과했어요');
      const TL=(typeof PTYPES==='object'&&PTYPES[lid])||[];
      TL.forEach(t=>scheduleTypeRev(lid,t.no,false));
      body.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌱 첫걸음 차시 마무리 통과!</b><br>핵심 구별과 풀이 따라 하기 ${pool.length}가지를 모두 해냈어요.</div>
        <div class="next-row" style="justify-content:flex-start">
          <button type="button" class="btn primary" id="upToT2">🌿 한걸음 도전하기 →</button>
          <a class="btn ghost" href="#home">처음 화면으로</a>
        </div></div>${bonusExploreHTML(lid)}`;
      const u2=$('#upToT2',body);if(u2)u2.onclick=()=>{setTrack(lid,2);viewTrackLesson(lid,'steps')};
      return;
    }
    const item=qQueue[idx],shownAt=Date.now();
    body.innerHTML=`<div class="ct-chk-bar"><b>🌱 첫걸음 차시 마무리</b><span>진행 ${Math.min(doneSet.size,pool.length)} / ${pool.length}</span></div>
      ${recheckKind===item.kind?'<div class="ct-recheck">💡 실수일 수 있어요! 같은 종류 문제를 한 번 더 확인해 볼게요.</div>':''}
      <div class="ct-card"><div class="ct-stage">
        <div class="ct-fig">${item.fig?item.fig():''}</div>
        <div><p class="ct-schema-q">${item.q}</p>
          <div class="ct-hit-row" id="t1Ch">${item.choices.map(c=>`<button type="button" class="ct-hit" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="t1Msg"></div>
        </div>
      </div></div>`;
    $$('#t1Ch .ct-hit',body).forEach(b=>b.onclick=()=>{
      const ms=Date.now()-shownAt;
      if(item.also&&item.also[b.dataset.v]){b.disabled=true;$('#t1Msg',body).innerHTML=`<div class="ct-cool">💡 ${item.also[b.dataset.v]}</div>`;return}
      if(item.both&&item.both.includes(b.dataset.v)){bothPick.add(b.dataset.v);b.disabled=true;b.classList.add('ok');if(item.both.some(x=>!bothPick.has(x))){$('#t1Msg',body).innerHTML=`<div class="ct-cool">👍 맞아요! 이 도형은 <b>이름이 하나 더</b> 있어요. 나머지 하나도 골라 보세요.</div>`;return}}
      if(b.dataset.v===item.ans||(item.both&&item.both.includes(b.dataset.v))){
        recordMetric(ms,null);
        doneSet.add(item.kind);consecKind=null;recheckKind=null;
        b.classList.add('ok');$$('#t1Ch .ct-hit',body).forEach(x=>x.disabled=true);
        $('#t1Msg',body).innerHTML=`<div class="feedback ok" style="margin-top:8px">${item.why||'정답이에요!'}</div><div class="next-row" style="justify-content:flex-start"><button type="button" class="btn primary" id="t1Nxt">${idx+1<qQueue.length?'다음 문제 →':'결과 보기 →'}</button></div>`;
        const nb=$('#t1Nxt',body);if(nb)nb.onclick=()=>{idx++;draw()};
      }else{
        recordMetric(ms,ms<FAST_MS?'t1_check_fast_wrong':'t1_check_wrong');
        if(consecKind===item.kind){rescued=true;draw();return}
        consecKind=item.kind;recheckKind=item.kind;
        /* [T20] 틀린 직후 같은 문제를 다시 내지 않아요: make가 있으면 숫자·그림을 바꾼 비슷한 문제를 만들어요. */
        const alt=typeof item.make==='function'?Object.assign(item.make(Math.floor(Math.random()*9000)+11),{kind:item.kind,make:item.make}):(pool.find(x=>x.kind===item.kind&&x!==item)||item);
        qQueue.splice(idx+1,0,alt);
        b.classList.add('bad');$$('#t1Ch .ct-hit',body).forEach(x=>x.disabled=true);
        $('#t1Msg',body).innerHTML=`<div class="ct-cool">${ms<FAST_MS?FAST_MSG+'<br>':''}💡 ${item.hint}</div><div class="next-row" style="justify-content:flex-start"><button type="button" class="btn primary" id="t1Nxt">확인 문제 하나 더 →</button></div>`;
        const nb=$('#t1Nxt',body);if(nb)nb.onclick=()=>{idx++;draw()};
      }
    });
  };
  draw();
}

/* ── 5. 🌿 한걸음 렌더러 ── */
function orderedTypes(lid,spec){
  const TL=(typeof PTYPES==='object'&&PTYPES[lid])||[];
  if(!Array.isArray(spec.t2Order))return TL;
  return spec.t2Order.map(no=>TL.find(t=>t.no===no)).filter(Boolean);
}

function renderT2Concept(body,lid,spec){
  const rows=spec.stratRows||[];
  body.innerHTML=`
    <div class="ct-pass-bar">
      <span>이미 정규 수업에서 배웠나요? 개념은 건너뛰어도 완료로 인정돼요.</span>
      <a class="btn primary" href="#${lid}-practice">바로 차시 마무리 도전 →</a>
    </div>
    <details class="ct-wx" style="margin-bottom:14px">
      <summary class="ct-wx-toggle"><span class="ct-wx-tag">🦉 부엉 쌤 개념 그림극</span><span class="ct-wx-sum">화면을 누르며 그림으로 핵심 원리 복습하기</span><span class="ct-wx-chev">펼치기 ▾</span></summary>
      <div class="ct-wx-body" id="t2OwlHost"></div>
    </details>
    ${rows.length?`<div class="cp-strat" style="margin-top:0">
      <h2>문제 조건별 풀이 전략 고르기</h2>
      <table class="cp-strat-table">
        <thead><tr><th>문제 모습</th><th>확인할 열쇠</th><th>풀이 순서</th></tr></thead>
        <tbody>${rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody>
      </table>
    </div>`:''}
    <div class="next-row"><a class="btn primary" href="#${lid}-steps">2단계 유형 익히기 (대표 예제) →</a></div>
    ${bonusExploreHTML(lid)}`;
  const oh=$('#t2OwlHost',body);
  if(oh)mountOwlShow(oh,lid,spec);
}

function renderT2Steps(body,lid,spec,initialTypeNo,openWorked){
  const p=lesProg(lid),TL=orderedTypes(lid,spec);
  p.tyS=p.tyS||{};
  let curNo=initialTypeNo||null,wxOpen=!!openWorked,wxStep=0,probSeed=typeof newSeed==='function'?newSeed():1;

  const draw=()=>{
    if(!curNo){
      body.innerHTML=`<div class="ct-card">
        <div class="ct-card-h"><h2>유형 고르기</h2><span class="muted">각 유형마다 대표 예제를 접어 두고 변형 문제를 연습해요</span></div>
        <div class="tpick">${TL.map(t=>{
          const st=typeStampState(lid,t.no);
          const isBridge=spec.compoundBridgeNo===t.no;
          return`<button type="button" class="tpc" data-no="${t.no}"><span class="tpn">유형 ${t.no}</span>${isBridge?'<span class="ct-comp-badge">🔗 자주 나오는 복합</span>':''}<b>${t.nm}</b><div class="d">${t.key}</div><div class="s"><span>${t.tb}</span><span>${st.tag?st.tag+' · ':''}${p.tyS[t.no]?`✓ ${p.tyS[t.no]}번 풀었어요`:'아직 안 풀었어요'}</span></div></button>`;
        }).join('')}</div>
      </div>`;
      $$('.tpc',body).forEach(b=>b.onclick=()=>{curNo=+b.dataset.no;wxOpen=false;wxStep=0;probSeed=typeof newSeed==='function'?newSeed():1;draw()});
      return;
    }
    const W=spec.worked&&spec.worked[curNo],T_=TL.find(t=>t.no===curNo)||{no:curNo,nm:''};
    body.innerHTML=`
      <div class="tybar"><span class="tyn">유형 ${T_.no}</span><b>${T_.nm}</b><button type="button" class="btn tyback" id="t2Back">🔀 다른 유형 고르기</button></div>
      <div id="t2WxHost"></div>
      <div class="ct-card"><div class="ct-card-h"><h2>유형 ${T_.no} 문제 풀기</h2><button type="button" class="btn ghost" id="t2New">🔄 새 숫자 문제</button></div><div id="t2ProbHost"></div></div>`;

    const drawWx=()=>{
      const wxHost=$('#t2WxHost',body);
      if(!wxHost||!W)return;
      if(!wxOpen){
        wxHost.innerHTML=`<div class="ct-wx collapsed">
          <button type="button" class="ct-wx-toggle" id="t2WxToggle" aria-expanded="false">
            <span class="ct-wx-tag">👩‍🏫 선생님 대표 예제</span>
            <span class="ct-wx-sum">${W.nm} · 풀이 보기</span>
            <span class="ct-wx-chev">펼치기 ▾</span>
          </button>
        </div>`;
      }else{
        const stObj=W.steps[Math.min(wxStep,W.steps.length-1)];
        wxHost.innerHTML=`<div class="ct-wx open">
          <button type="button" class="ct-wx-toggle" id="t2WxToggle" aria-expanded="true">
            <span class="ct-wx-tag">👩‍🏫 선생님 대표 예제</span>
            <span class="ct-wx-sum">${W.nm}</span>
            <span class="ct-wx-chev">접기 ▴</span>
          </button>
          <div class="ct-wx-body">
            <p style="margin:8px 0 10px">${W.prob}</p>
            <div class="ct-stage">
              <div class="ct-fig">${W.fig?W.fig(stObj.hl):''}</div>
              <div>
                <div class="ct-wx-steps">
                  ${W.steps.map((s,i)=>`<button type="button" class="ct-wx-step${i===wxStep?' on':''}" data-ws="${i}"><div class="ct-wx-step-top">${s.t}</div>${i<=wxStep?`<div class="ct-wx-step-body">${s.body}</div>`:'<small class="muted">눌러서 설명 보기</small>'}</button>`).join('')}
                </div>
                <div class="ct-pitfall">${W.pitfall}</div>
              </div>
            </div>
          </div>
        </div>`;
      }
      const tg=$('#t2WxToggle',wxHost);if(tg)tg.onclick=()=>{wxOpen=!wxOpen;drawWx()};
      $$('[data-ws]',wxHost).forEach(b=>b.onclick=()=>{wxStep=+b.dataset.ws;drawWx()});
    };

    const back=$('#t2Back',body);if(back)back.onclick=()=>{curNo=null;draw()};
    drawWx();
    const mountVar=()=>{
      const gKey=typeof tyKey==='function'?tyKey(lid,curNo):lid;
      const prob=typeof GEN==='object'&&GEN[gKey]?GEN[gKey](probSeed):null;
      if(!prob||typeof renderProblem!=='function')return;
      renderProblem($('#t2ProbHost',body),prob,{mode:'steps',visual:true,rep:{lesson:lid,gen:gKey,seed:probSeed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
        if(typeof logAttempt==='function')logAttempt({lesson:lid,kind:'steps',good,wrongs,mode,gen:gKey,seed:probSeed,ptype:prob.ptype,stepWrongs,revealed});
        if(good){
          p.steps=(Number(p.steps)||0)+1;p.tday=today();p.tyS[curNo]=(p.tyS[curNo]||0)+1;
          scheduleTypeRev(lid,curNo,wrongs>0);
          if(typeof save==='function')save();
          if(typeof award==='function')award(10,null,'유형 변형 문제를 풀었어요');
        }else if(typeof addReview==='function')addReview(gKey,probSeed,lid);
        const curPos=TL.findIndex(t=>t.no===curNo),nx=curPos>=0?TL[curPos+1]:null;
        const row=document.createElement('div');row.className='next-row';row.style.justifyContent='flex-start';
        row.innerHTML=`<button type="button" class="btn" id="t2More">같은 유형 하나 더</button>${nx?`<button type="button" class="btn primary" id="t2Next">유형 ${nx.no} →</button>`:`<a class="btn primary" href="#${lid}-practice">차시 마무리 하러 가기 →</a>`}`;
        box.appendChild(row);
        const mBtn=$('#t2More',row);if(mBtn)mBtn.onclick=()=>{probSeed=(probSeed+7)%99999+1;mountVar()};
        const nBtn=$('#t2Next',row);if(nBtn)nBtn.onclick=()=>{curNo=nx.no;wxOpen=false;wxStep=0;probSeed=(probSeed+13)%99999+1;draw()};
      }});
    };
    const nw=$('#t2New',body);if(nw)nw.onclick=()=>{probSeed=(probSeed+17)%99999+1;mountVar()};
    mountVar();
  };
  draw();
}

function renderAdaptivePractice(body,lid,cfg){
  const baseQueue=cfg.items.slice();
  let queue=baseQueue.slice(),idx=0,results=[],consecWrongKey=null,rescuedItem=null;

  const draw=()=>{
    if(rescuedItem){
      body.innerHTML=`<div class="ct-rescue"><h3>같은 유형을 2번 연속 틀렸어요</h3>
        <p>${rescuedItem.rescueDesc}</p>
        <div class="next-row" style="justify-content:flex-start">
          <button type="button" class="btn primary" id="goRescue">${rescuedItem.rescueBtn}</button>
          <button type="button" class="btn ghost" id="retryCheck">마무리 처음부터 다시</button>
        </div></div>`;
      const gb=$('#goRescue',body);if(gb)gb.onclick=()=>cfg.onRescue(rescuedItem);
      const rb=$('#retryCheck',body);if(rb)rb.onclick=()=>{queue=baseQueue.slice();idx=0;results=[];consecWrongKey=null;rescuedItem=null;draw()};
      return;
    }
    if(idx>=queue.length){cfg.onPass(body,results);return}

    const cur=queue[idx],prob=cur.makeProb(cur.seed),shownAt=Date.now();
    body.innerHTML=`<div class="ct-chk-bar"><b>${cfg.title}</b><span>남은 문항 · ${idx+1} / ${queue.length}</span></div>
      ${cur.recheck?'<div class="ct-recheck">💡 단순 실수일 수 있어요! 같은 유형의 숫자만 바꾼 문제를 한 번 더 확인해요.</div>':''}
      <div class="ct-card" id="chkHost"></div>`;

    if(typeof renderProblem!=='function')return;
    renderProblem($('#chkHost',body),prob,{mode:'final',visual:true,rep:{lesson:lid,gen:cur.genKey,seed:cur.seed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
      const ok=good&&wrongs===0;
      recordMetric(Date.now()-shownAt,ok?null:'prac_'+cur.key);
      if(typeof logAttempt==='function')logAttempt({lesson:lid,kind:'practice',good,wrongs,mode,gen:cur.genKey,seed:cur.seed,ptype:prob.ptype,stepWrongs,revealed,mixed:true});
      if(ok){
        consecWrongKey=null;
        results.push({key:cur.key,tyNo:cur.tyNo,label:cur.label,status:cur.recheck?'recovered':'first'});
        const nb=document.createElement('button');nb.type='button';nb.className='btn primary';
        nb.textContent=idx+1<queue.length?'다음 문제 →':'마무리 결과 보기 →';
        nb.onclick=()=>{idx++;draw()};
        box.appendChild(nb);
      }else{
        if(cur.tyNo)scheduleTypeRev(lid,cur.tyNo,true);
        if(typeof addReview==='function')addReview(cur.genKey,cur.seed,lid);
        if(consecWrongKey===cur.key){rescuedItem=cur;draw();return}
        consecWrongKey=cur.key;
        queue.splice(idx+1,0,Object.assign({},cur,{seed:(cur.seed*17+31)%99999+1,recheck:true}));
        box.insertAdjacentHTML('afterbegin','<span style="flex-basis:100%;font-size:15px">아쉽네요! 바로 다음에 같은 유형을 한 번 더 확인해 볼게요.</span>');
        const nb=document.createElement('button');nb.type='button';nb.className='btn primary';
        nb.textContent='확인 문제 풀기 →';
        nb.onclick=()=>{idx++;draw()};
        box.appendChild(nb);
      }
    }});
  };
  draw();
}

function renderT2Practice(body,lid,spec){
  const p=lesProg(lid),TL=orderedTypes(lid,spec);
  const L=(typeof LESSONS!=='undefined'&&LESSONS.find(x=>x.id===lid))||{title:lid};
  const r=typeof mulberry==='function'?mulberry((typeof newSeed==='function'?newSeed():101)):Math.random;
  let order=TL.map(t=>t.no);
  if(typeof shuffle==='function')order=shuffle(r,order);
  const items=order.map((no,k)=>{
    const t=TL.find(x=>x.no===no)||{nm:'유형 '+no};
    const gk=typeof tyKey==='function'?tyKey(lid,no):lid;
    return{
      key:'ty'+no,tyNo:no,label:`유형 ${no} · ${t.nm}`,genKey:gk,
      seed:Math.floor((typeof newSeed==='function'?newSeed():100)+k*19)%99999+1,
      makeProb:sd=>GEN[gk](sd),
      rescueDesc:`<b>유형 ${no} (${t.nm})</b>이 아직 헷갈리는 것 같아요. 선생님 대표 예제를 단계별로 다시 보고 오면 다음엔 맞힐 수 있어요.`,
      rescueBtn:`유형 ${no} 선생님 대표 예제 보러 가기 →`
    };
  });

  renderAdaptivePractice(body,lid,{
    title:`🌿 한걸음 차시 마무리 (${TL.length}유형 섞어 풀기)`,
    items,
    onRescue:it=>{renderT2Steps(body,lid,spec,it.tyNo,true)},
    onPass:(host,results)=>{
      p.tday=today();p.trackDone=Math.max(Number(p.trackDone)||0,2);
      p.concept=true;p.steps=Math.max(Number(p.steps)||0,1);
      p.prac=p.prac||{solved:0,streak:0,level:1,fails:0,retry:[]};
      p.prac.solved=Math.max(Number(p.prac.solved)||0,5);
      TL.forEach(t=>{
        const res=results.find(x=>x.tyNo===t.no);
        scheduleTypeRev(lid,t.no,res&&res.status!=='first');
      });
      if(typeof save==='function')save();
      if(typeof award==='function')award(15,lid+':t2','한걸음 차시 마무리를 통과했어요');
      const rows=results.map(x=>`<li>${x.status==='first'?'⭐ <b>한 번에 통과</b>':'✓ <b>실수 확인 후 통과</b>'} · ${x.label}</li>`).join('');
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌿 한걸음 차시 마무리 통과!</b><br>『${L.title}』을 마쳤어요! 내일 <b>[복습 추천]</b>으로 이틀 연속 숙달 ✓ 도장을 받아 보세요.</div>
        <ul style="margin:12px 0;padding-left:20px;line-height:1.8">${rows}</ul>
        <div class="next-row" style="justify-content:flex-start">
          <button type="button" class="btn primary" id="upToT3">🌳 두걸음(복합 유형) 도전하기 →</button>
          <a class="btn ghost" href="#home">처음 화면으로</a>
        </div></div>${bonusExploreHTML(lid)}`;
      const u3=$('#upToT3',host);if(u3)u3.onclick=()=>{setTrack(lid,3);viewTrackLesson(lid,'steps')};
    }
  });
}

/* ── 6. 🌳 두걸음 렌더러 ── */
function renderT3Concept(body,lid,spec){
  const list=spec.compoundList||[];
  body.innerHTML=`
    <div class="ct-pass-bar">
      <span>개념을 이미 안다면 바로 복합 유형이나 차시 마무리로 넘어가세요.</span>
      <a class="btn primary" href="#${lid}-steps">복합 문제 쪼개서 연습하기 →</a>
    </div>
    <div class="cp-strat" style="margin-top:0">
      <h2>🌳 두걸음 핵심 전략 · 복합 문제 쪼개기</h2>
      <div class="cp-strat-cards">
        ${list.map((c,i)=>`<div class="cp-scard"><span class="cp-sbadge">조합 ${i+1}</span><b>${c.nm}</b><small>${c.sub}</small></div>`).join('')}
      </div>
    </div>
    <div class="next-row"><a class="btn primary" href="#${lid}-practice">3단계 실전 차시 마무리 →</a></div>
    ${bonusExploreHTML(lid)}`;
}

function renderT3Steps(body,lid,spec,initialCid){
  const list=spec.compoundList||[],TL=(typeof PTYPES==='object'&&PTYPES[lid])||[];
  const tyLabels=TL.map(t=>`유형 ${t.no} · ${t.nm}`);
  let cid=initialCid||(list[0]&&list[0].id),seed=typeof newSeed==='function'?newSeed():11,picked=new Set(),unlocked=false,shownAt=Date.now();

  const draw=()=>{
    const gen=spec.genCompound&&spec.genCompound[cid];
    if(!gen){body.innerHTML='';return}
    const prob=gen(seed),wantSet=new Set(prob.combo);shownAt=Date.now();
    body.innerHTML=`<div class="ct-card">
      <div class="ct-card-h"><h2>복합 문제 쪼개서 풀기</h2>
        <div class="ct-hit-row" style="margin:0">${list.map(x=>`<button type="button" class="chip${x.id===cid?' on':''}" data-cid="${x.id}">${x.nm}</button>`).join('')}</div>
      </div>
      <div class="ct-combo">
        <b>1단계 · 이 문제는 기본 유형 중 <u>어느 두 가지</u>를 합쳐 놓았나요? (2개 고르기)</b>
        <div class="ct-combo-chips">${tyLabels.map((lb,i)=>`<button type="button" class="ct-hit${picked.has(i+1)?' sel':''}" data-ty="${i+1}" ${unlocked?'disabled':''}>${lb}</button>`).join('')}</div>
        <div id="cStep1Msg">${unlocked?`<div class="feedback ok">✓ 딱 맞혔어요! ${prob.comboWhy}</div>`:''}</div>
      </div>
      <div id="cProbHost"></div>
    </div>`;

    $$('[data-cid]',body).forEach(b=>b.onclick=()=>{cid=b.dataset.cid;seed=(seed+9)%99999+1;picked=new Set();unlocked=false;draw()});
    $$('[data-ty]',body).forEach(b=>b.onclick=()=>{
      const k=+b.dataset.ty;
      if(picked.has(k))picked.delete(k);else{if(picked.size>=2){const first=[...picked][0];picked.delete(first)}picked.add(k)}
      if(picked.size===2){
        const ok=[...picked].every(x=>wantSet.has(x));
        recordMetric(Date.now()-shownAt,ok?null:'combo_pick');
        if(ok){unlocked=true;draw();return}
        const m=$('#cStep1Msg',body);if(m)m.innerHTML='<div class="ct-cool" style="margin-top:6px">문제에서 <b>주어진 조건</b>과 <b>마무리 계산 방식</b>을 하나씩 짚어 다시 2개를 골라 보세요.</div>';
        $$('[data-ty]',body).forEach(x=>x.classList.toggle('sel',picked.has(+x.dataset.ty)));
      }else{
        $$('[data-ty]',body).forEach(x=>x.classList.toggle('sel',picked.has(+x.dataset.ty)));
      }
    });

    if(!unlocked){
      const figHtml=prob.fig&&prob.fig.svg?prob.fig.svg():'';
      $('#cProbHost',body).innerHTML=`<div class="${figHtml?'ct-stage':''}">${figHtml?`<div class="ct-fig">${figHtml}</div>`:''}<div><p style="margin-top:0">${prob.title}</p><p class="muted">먼저 위에서 결합된 2개 유형을 고르면 풀이 입력이 열려요.</p></div></div>`;
    }else if(typeof renderProblem==='function'){
      renderProblem($('#cProbHost',body),prob,{mode:'steps',visual:true,rep:{lesson:lid,gen:prob.ptype,seed},onDone:({good,box})=>{
        if(good&&typeof award==='function')award(8,null,'복합 문제를 단계별로 쪼개서 풀었어요');
        const row=document.createElement('div');row.className='next-row';row.style.justifyContent='flex-start';
        row.innerHTML=`<button type="button" class="btn primary" id="cMore">새 숫자로 한 번 더</button><a class="btn ghost" href="#${lid}-practice">실전 차시 마무리 →</a>`;
        box.appendChild(row);
        const cm=$('#cMore',row);if(cm)cm.onclick=()=>{seed=(seed+23)%99999+1;picked=new Set();unlocked=false;draw()};
      }});
    }
  };
  draw();
}

function renderT3Practice(body,lid,spec){
  const p=lesProg(lid),TL=(typeof PTYPES==='object'&&PTYPES[lid])||[];
  const baseSd=typeof newSeed==='function'?newSeed():201;
  const baseNos=TL.slice(0,4).map(t=>t.no);
  const cids=(spec.t3PracticeCids||(spec.compoundList||[]).slice(0,2).map(x=>x.id));
  const items=baseNos.map((no,k)=>{
    const t=TL.find(x=>x.no===no)||{nm:'유형 '+no};
    const gk=typeof tyKey==='function'?tyKey(lid,no):lid;
    return{key:'ty'+no,tyNo:no,label:`기본 · 유형 ${no} (${t.nm})`,genKey:gk,seed:baseSd+k*13,makeProb:sd=>GEN[gk](sd),
      rescueDesc:`기본 <b>유형 ${no} (${t.nm})</b>을 두 번 연속 틀렸어요. 대표 예제를 보고 기본 틀을 다시 잡고 가요.`,rescueBtn:`유형 ${no} 대표 예제 보기 →`};
  }).concat(cids.map((cid,k)=>{
    const cInfo=(spec.compoundList||[]).find(x=>x.id===cid)||{nm:cid};
    return{key:cid,cid,label:cInfo.nm,genKey:`${lid}:${cid.toLowerCase()}`,seed:baseSd+51+k*23,makeProb:sd=>spec.genCompound[cid](sd),
      rescueDesc:`<b>${cInfo.nm}</b>을 두 번 연속 틀렸어요. 복합 문제 쪼개서 풀기에서 단계를 먼저 나눠 보아요.`,rescueBtn:`${cInfo.nm} 쪼개서 연습하기 →`};
  }));

  renderAdaptivePractice(body,lid,{
    title:`🌳 두걸음 실전 차시 마무리 (기본 ${baseNos.length} + 복합 ${cids.length})`,
    items,
    onRescue:it=>{if(it.cid)renderT3Steps(body,lid,spec,it.cid);else renderT2Steps(body,lid,spec,it.tyNo,true)},
    onPass:(host,results)=>{
      p.tday=today();p.trackDone=3;p.concept=true;p.steps=Math.max(Number(p.steps)||0,1);
      p.prac=p.prac||{solved:0,streak:0,level:1,fails:0,retry:[]};
      p.prac.solved=Math.max(Number(p.prac.solved)||0,5);
      TL.forEach(t=>{
        const res=results.find(x=>x.tyNo===t.no);
        scheduleTypeRev(lid,t.no,res&&res.status!=='first');
      });
      if(typeof save==='function')save();
      if(typeof award==='function')award(20,lid+':t3','두걸음 실전 차시 마무리를 통과했어요');

      const metaOpts=spec.t3MetaOpts||['유형 조합 찾기','조건 파악·식 세우기','계산 실수','없음'];
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌳 두걸음 실전 차시 마무리 통과!</b><br>기본 유형과 복합 유형 ${cids.length}가지를 모두 해결했어요.</div>
        <ul style="margin:12px 0;padding-left:20px;line-height:1.8">${results.map(x=>`<li>${x.status==='first'?'⭐ <b>한 번에 통과</b>':'✓ <b>재확인 통과</b>'} · ${x.label}</li>`).join('')}</ul>
        <div class="ct-meta"><b>1초 체크 · 오늘 풀면서 가장 헷갈렸던 부분은?</b>
          <div class="ct-meta-row" id="t3Meta">${metaOpts.map(m=>`<button type="button" class="chip" data-m="${m}">${m}</button>`).join('')}</div>
          <small class="muted" id="t3MetaDone">기록해 두면 다음에 꼭 맞는 연습을 고르는 데 도움이 돼요.</small>
        </div>
        <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#home">처음 화면으로</a></div>
      </div>${bonusExploreHTML(lid)}`;
      $$('#t3Meta .chip',host).forEach(b=>b.onclick=()=>{
        p.metaLog=Array.isArray(p.metaLog)?p.metaLog:[];
        p.metaLog.push({tag:b.dataset.m,d:typeof today==='function'?today():''});
        if(p.metaLog.length>20)p.metaLog=p.metaLog.slice(-20);
        if(typeof save==='function')save();
        $$('#t3Meta .chip',host).forEach(x=>x.classList.toggle('on',x===b));
        const md=$('#t3MetaDone',host);if(md)md.textContent=`기록했어요: ${b.dataset.m}`;
      });
    }
  });
}

/* ── 7. 통합 차시 본체 렌더러 ── */
function bonusExploreHTML(lid){
  if(typeof EXPLORE!=='object'||!EXPLORE[lid])return'';
  return`<div class="ct-bonus-explore"><div><b>🔬 더 알아보기 (선택 탐구)</b><small>실험·만들기 활동으로 직관을 키우고 배지도 모아요.</small></div><a class="btn ghost" href="#${lid}-explore">탐구 활동 해 보기 →</a></div>`;
}

function viewTrackLesson(id,tab){
  clearAutoNav();
  const spec=SPECS[id];
  if(!spec)return;
  const L=(typeof LESSONS!=='undefined'&&LESSONS.find(l=>l.id===id))||{id,no:1,title:id,tb:'',unit:'solid'};
  const p=lesProg(id),TL=(typeof PTYPES==='object'&&PTYPES[id])||[];
  if(typeof crumbs!=='undefined'&&crumbs){
    crumbs.innerHTML=`<span class="sep">›</span><a href="#unit-${L.unit||'solid'}">${typeof unitOf==='function'?unitOf(L.unit||'solid').name:'단원'}</a><span class="sep">›</span><span>${L.title}</span>`;
  }

  if(tab==='explore'&&typeof EXPLORE==='object'&&EXPLORE[id]){
    app.innerHTML=`<div class="ct-head"><div class="ct-head-top"><span class="ct-brand-tag">📘 교과서 한 걸음 · ${L.no}차시</span><a class="btn ghost" href="#${id}">← ${L.no}차시로 돌아가기</a></div><div class="ct-title-row"><h1>${L.title} · 더 알아보기</h1></div></div><div id="tabBody"></div>`;
    EXPLORE[id]($('#tabBody',app));
    p.explore=true;if(typeof save==='function')save();
    return;
  }

  const tr=curTrack(id);
  const explicitTab=typeof location==='object'&&new RegExp(`^#${id}-(concept|steps|practice)$`).test(location.hash||'');
  let activeTab=(tab==='concept'||tab==='steps'||tab==='practice')?tab:'concept';
  if(!explicitTab&&tr===1&&spec.kind==='concept'&&!p.t1SchemaDone)activeTab='steps';

  const trackInfos=[{k:1,ic:'🌱',nm:'첫걸음'},{k:2,ic:'🌿',nm:'한걸음'},{k:3,ic:'🌳',nm:'두걸음'}];
  const tabDefs=tr===1
    ?(spec.kind==='concept'
      ?[
        {id:'steps',t:'유형 익히기',s:'① 먼저 추천 · 맞을까 아닐까 구별',rec:'추천 ①'},
        {id:'concept',t:'개념 보기',s:'② 부엉 쌤 이름표 붙이기',rec:'②'},
        {id:'practice',t:'차시 마무리',s:'③ 계산 없이 핵심 확인',rec:'③'}
      ]
      :[
        {id:'concept',t:'개념 보기',s:'① 먼저 추천 · 부엉 쌤 원리 영상',rec:'추천 ①'},
        {id:'steps',t:'유형 익히기',s:'② 구별 연습 + 선생님과 따라 풀기',rec:'②'},
        {id:'practice',t:'차시 마무리',s:'③ 핵심 확인 문제',rec:'③'}
      ])
    :[
      {id:'concept',t:'개념 보기',s:tr===3?'선택 · 함정/전략 요약':'선택 · 부엉 쌤 영상 & 표'},
      {id:'steps',t:'유형 익히기',s:tr===3?'복합 문제 쪼개서 풀기':'대표 예제 + 변형 연습'},
      {id:'practice',t:'차시 마무리',s:tr===3?'실전 기본+복합 마무리':'유형 섞어 풀기'}
    ];

  const doneMap={
    concept:!!p.concept,
    steps:tr===1?!!p.t1SchemaDone:(Number(p.steps)>0),
    practice:window.lessonTrackDone(id)>=tr
  };

  const stampRow=TL.length?`<div class="ct-stamps" aria-label="유형 숙달 도장판"><span class="ct-stamp-lbl">도장판</span>${TL.map(t=>{
    const st=typeStampState(id,t.no);
    return`<span class="ct-stamp ${st.cls}" title="${st.title}">유형 ${t.no}${st.tag?' · '+st.tag:''}</span>`;
  }).join('')}</div>`:'';

  app.innerHTML=`
    <div class="ct-head">
      <div class="ct-head-top">
        <span class="ct-brand-tag">📘 교과서 한 걸음 · ${L.no}차시</span>
        <span class="ct-tb">${L.tb?'교과서 '+L.tb:''}</span>
      </div>
      <div class="ct-title-row">
        <h1>${L.title}</h1>
        <div class="ct-tr-pills" role="group" aria-label="학습 단계 선택">
          ${trackInfos.map(t=>`<button type="button" class="ct-tr-pill${t.k===tr?' on':''}" data-track="${t.k}" title="${t.nm}" aria-label="${t.nm}" aria-pressed="${t.k===tr}">${t.ic}</button>`).join('')}
        </div>
      </div>
      ${stampRow}
    </div>
    <div class="ct-tabs" role="tablist">
      ${tabDefs.map((t,i)=>`<button type="button" role="tab" class="ct-tab${t.id===activeTab?' on':''}${doneMap[t.id]?' done':''}" data-tab="${t.id}" aria-selected="${t.id===activeTab}"><span class="ct-tab-num">${doneMap[t.id]&&t.id!==activeTab?'✓':i+1}</span><span class="ct-tab-lbl"><b>${t.t}</b><small>${t.s}</small></span>${t.rec?`<span class="ct-rec-badge">${t.rec}</span>`:''}</button>`).join('')}
    </div>
    <div id="ctBody"></div>`;

  $$('.ct-tr-pill',app).forEach(b=>b.onclick=()=>{setTrack(id,+b.dataset.track);viewTrackLesson(id,activeTab)});
  $$('.ct-tab',app).forEach(b=>b.onclick=()=>{
    const nxt=b.dataset.tab;
    if(typeof location==='object'&&typeof window!=='undefined'&&window.location)location.hash=`${id}-${nxt}`;
    else viewTrackLesson(id,nxt);
  });

  if(typeof DB==='object'&&DB){DB._last={id,tab:activeTab};if(typeof save==='function')save()}
  const body=$('#ctBody',app);
  if(tr===1){
    if(activeTab==='steps')renderT1Steps(body,id,spec);
    else if(activeTab==='concept')renderT1Concept(body,id,spec);
    else renderT1Practice(body,id,spec);
  }else if(tr===2){
    if(activeTab==='concept')renderT2Concept(body,id,spec);
    else if(activeTab==='steps')renderT2Steps(body,id,spec);
    else renderT2Practice(body,id,spec);
  }else{
    if(activeTab==='concept')renderT3Concept(body,id,spec);
    else if(activeTab==='steps')renderT3Steps(body,id,spec);
    else renderT3Practice(body,id,spec);
  }
}

/* ── 8. [복습 추천] 실행 화면 (#dailyrev) ── */
window.viewDailyRev=function(){
  clearAutoNav();
  if(typeof crumbs!=='undefined'&&crumbs)crumbs.innerHTML=`<span class="sep">›</span><span>복습 추천</span>`;
  const queue=buildDailyRevQueue();
  if(!queue.length){
    app.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>오늘의 [복습 추천]을 모두 마쳤어요!</b><br>유형을 익힌 다음 날 1~3문제로 이틀 연속 숙달 ✓ 도장을 받을 수 있어요.</div><div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#home">처음 화면으로</a></div></div>`;
    return;
  }
  let idx=0;
  const typeOutcomes={};

  const finish=()=>{
    const d=typeof today==='function'?today():'';
    const promoted=[],missed=[];
    Object.values(typeOutcomes).forEach(o=>{
      submitDailyRevType(o.lid,o.tyNo,o.allGood,d);
      if(o.allGood)promoted.push(o);
      else missed.push(o);
    });
    if(typeof DB==='object'&&DB){DB._drevDone=d;if(typeof save==='function')save()}
    if(typeof award==='function')award(2,'drev:'+d,'오늘의 복습 추천을 완료했어요');
    app.innerHTML=`<div class="ct-card">
      <div class="feedback ok"><b>📅 오늘의 [복습 추천] 완료!</b> ${promoted.length?`${promoted.length}개 유형에 <b>숙달 ✓</b> 도장이 찍혔어요!`:''}</div>
      <ul style="margin:12px 0;padding-left:20px;line-height:1.8">
        ${promoted.map(o=>`<li>✅ <b>숙달 ✓</b> · ${o.L.no}차시 ${o.L.title} · 유형 ${o.tyNo} (${o.T.nm})</li>`).join('')}
        ${missed.map(o=>`<li>🔁 <b>내일 다시 확인</b> · ${o.L.no}차시 ${o.L.title} · 유형 ${o.tyNo} (${o.T.nm})</li>`).join('')}
      </ul>
      ${missed.length?`<div class="ct-wx open" style="margin-top:10px"><div class="ct-wx-body" style="padding-top:12px"><b>👩‍🏫 헷갈린 유형 핵심 요약:</b> ${missed[0].T.key}</div></div>`:''}
      <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#home">처음 화면으로</a></div>
    </div>`;
  };

  const draw=()=>{
    if(idx>=queue.length){finish();return}
    const item=queue[idx],prob=GEN[item.genKey](item.seed);
    prob.title=`<span class="rv-from">${item.L.no}차시 ${item.L.title} · 유형 ${item.tyNo} (${item.T.nm})</span><br>`+stripTB(prob.title);
    app.innerHTML=`<div class="ct-chk-bar"><b>📅 [복습 추천] 이틀 연속 숙달 확인</b><span>문제 ${idx+1} / ${queue.length} · 2분</span></div><div class="ct-card" id="drevHost"></div>`;
    renderProblem($('#drevHost',app),prob,{mode:'final',visual:true,rep:{lesson:item.lid,gen:item.genKey,seed:item.seed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
      const ok=good&&wrongs===0,k=item.lid+'|'+item.tyNo;
      if(!typeOutcomes[k])typeOutcomes[k]={lid:item.lid,tyNo:item.tyNo,L:item.L,T:item.T,allGood:true};
      if(!ok)typeOutcomes[k].allGood=false;
      if(typeof logAttempt==='function')logAttempt({lesson:item.lid,kind:'review',good,wrongs,mode,gen:item.genKey,seed:item.seed,ptype:prob.ptype,stepWrongs,revealed});
      box.insertAdjacentHTML('afterbegin',`<span style="flex-basis:100%">${ok?'⭐ 한 번에 통과!':'💡 내일 같은 유형을 한 번 더 추천해 드릴게요.'}</span>`);
      const nb=document.createElement('button');nb.type='button';nb.className='btn primary';
      nb.textContent=idx+1<queue.length?'다음 복습 문제 →':'결과 확인하기 →';
      nb.onclick=()=>{idx++;draw()};
      box.appendChild(nb);
    }});
  };
  draw();
};

/* ── 9. 홈 배너 · 오늘의 길잡이 · viewLesson 후킹 ── */
if(typeof viewHome==='function'){
  const prevHome=viewHome;
  viewHome=function(){
    prevHome.apply(this,arguments);
    if(typeof app!=='undefined'&&app){
      if(typeof app.querySelectorAll==='function'){
        app.querySelectorAll('.sec-title h2').forEach(h=>{if(h.textContent==='열린 단원')h.textContent='교과서 한 걸음'});
      }
      const guide=$('#guide',app);
      const t=typeof today==='function'?today():'';
      const due=dueTypeList(t);
      if(guide&&due.length&&(!DB|| (DB._drevDone!==t&&DB._drevSkip!==t))){
        const q=buildDailyRevQueue(t);
        const card=el(`<div class="ct-drev-card" id="dailyRevBanner">
          <div class="ct-drev-txt"><b>📅 [복습 추천] 어제 익힌 유형 ${q.length}문제 · 2분</b>
            <small>${due.slice(0,2).map(d=>`${d.L.title}(유형 ${d.tyNo})`).join(', ')}${due.length>2?` 외 ${due.length-2}개`:''} · 한 번 더 맞히면 숙달 ✓ 도장!</small></div>
          <div class="ct-drev-act"><a class="btn primary" href="#dailyrev">복습 시작하기 →</a><button type="button" class="btn ghost mini" id="skipDrev">오늘은 닫기</button></div>
        </div>`);
        guide.prepend(card);
        const sb=$('#skipDrev',card);
        if(sb)sb.onclick=()=>{if(typeof DB==='object'&&DB){DB._drevSkip=t;if(typeof save==='function')save()}card.remove()};
      }
    }
  };
}

/* [T21] 오늘의 길잡이의 『교과서 한 걸음』 칸: 순서를 정해 두었어요.
   ① 마지막으로 공부한 차시가 아직 안 끝났으면 그 차시를 이어서 ② 아니면 교과서 순서(단원 → 차시 번호)로 안 끝난 첫 차시.
   끝남 = 고른 걸음(🌱·🌿·🌳)의 차시 마무리 통과. 다음에 할 탭도 걸음에 맞춰 알려 줘요. */
const TRACK_NM={1:'🌱 첫걸음',2:'🌿 한걸음',3:'🌳 두걸음'};
function guideLessonOrder(){
  const chi=l=>{const I=typeof unitOf==='function'?unitOf(l.unit||'solid'):null;return typeof UNITS!=='undefined'&&I?UNITS.findIndex(z=>z[0]===I.ch):0};
  return LESSONS.filter(l=>l.ready&&!l.hidden).slice().sort((a,b)=>chi(a)-chi(b)||(a.no-b.no));
}
function guideLessonDone(l){return SPECS[l.id]?window.lessonTrackDone(l.id)>=curTrack(l.id):(typeof lessonDone==='function'&&lessonDone(l.id)>=(typeof LESSON_REQ==='number'?LESSON_REQ:3))}
function guideLessonStep(){
  const L=guideLessonOrder();if(!L.length)return null;
  const last=DB._last&&L.find(l=>l.id===DB._last.id);
  const cur=(last&&!guideLessonDone(last))?last:L.find(l=>!guideLessonDone(l));
  const t=typeof today==='function'?today():'';
  if(!cur)return{les:true,done:L.some(l=>OBJ(DB[l.id]).tday===t),more:true,t:'열린 차시를 모두 마쳤어요',s:'두걸음이나 복습 추천으로 실력을 다져요',href:'#'+L[L.length-1].id};
  const unitNm=typeof unitOf==='function'?unitOf(cur.unit||'solid').name:'';
  if(!SPECS[cur.id])return null;
  const p=lesProg(cur.id),tr=curTrack(cur.id),spec=SPECS[cur.id],td=window.lessonTrackDone(cur.id);
  const order=tr===1?(spec.kind==='concept'?['steps','concept','practice']:['concept','steps','practice']):['steps','practice'];
  const isDone={concept:!!p.concept,steps:tr===1?!!p.t1SchemaDone:Number(p.steps)>0,practice:td>=tr};
  const tab=order.find(k=>!isDone[k])||'practice';
  const TAB={concept:'개념 보기 · 부엉 쌤 그림극',steps:tr===1?'유형 익히기 · 구별하기':tr===2?'유형 익히기 · 대표 예제':'유형 익히기 · 복합 문제',practice:'차시 마무리'};
  return{les:true,done:p.tday===t,more:true,t:`${cur.no}차시 ${cur.title}`,s:`${unitNm} · ${TRACK_NM[tr]} · ${last===cur&&(p.concept||p.t1SchemaDone||Number(p.steps)>0)?'이어서 ':''}${TAB[tab]}`,href:`#${cur.id}-${tab}`};
}
if(typeof guideSteps==='function'){
  const prevGS=guideSteps;
  guideSteps=function(){
    const S=prevGS.apply(this,arguments);
    if(Array.isArray(S)){const li=S.findIndex(x=>/^\d+차시 |^열린 차시를/.test(x.t)),G=guideLessonStep();if(li>=0&&G)S[li]=G}
    const need=typeof DB==='object'&&DB&&DB._needCalc;
    if(!need||!need.id||!Array.isArray(S))return S;
    const t=typeof CALC!=='undefined'&&CALC.find(c=>c.id===need.id);
    const fromL=typeof LESSONS!=='undefined'&&LESSONS.find(l=>l.id===need.from);
    const ci=S.findIndex(x=>/^기초 연산 · /.test(x.t));
    if(t&&ci>=0&&!S[ci].done){
      S[ci]=Object.assign({},S[ci],{t:`기초 연산 · ${t.nm}`,s:`${fromL?fromL.title:'차시'}에서 막혔던 계산을 먼저 연습해요`,href:'#calc-'+t.id});
    }
    return S;
  };
}

if(typeof viewLesson==='function'){
  const prevVL=viewLesson;
  viewLesson=function(id,tab){
    if(SPECS[id])return viewTrackLesson(id,tab);
    return prevVL.apply(this,arguments);
  };
}

window.HG_TRACKS={
  specs:SPECS,
  register(lid,spec){SPECS[lid]=spec},
  viewTrackLesson,
  mountOwlShow,
  scheduleTypeRev,
  dueTypeList,
  buildDailyRevQueue,
  submitDailyRevType,
  typeStampState
};
})();