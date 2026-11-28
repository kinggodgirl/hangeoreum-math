/* [T15] 교과서 한 걸음 — 전 차시 공통 3탭 × 3트랙 엔진 · 🦉 부엉 쌤 개념 영상 · [복습 추천] */
(()=>{
'use strict';

const SPECS={};

/* ── 1. 공통 진행률 · 트랙 완료 · 지표 · 타이머 ── */
function studentDefaultTrack(dbObj){
  const g=dbObj?(dbObj._goal&&typeof dbObj._goal==='object'?dbObj._goal:null):(typeof myGoal==='function'?myGoal():null);
  if(!g)return 2;
  return g.k==='calc'?1:g.k==='up'?3:2;
}
function trackGoalDefault(){
  return studentDefaultTrack();
}
function unitActiveTrack(unitId,dbObj){
  const d=dbObj||(typeof DB==='object'&&DB?DB:{});
  const ut=d._unitTrack&&typeof d._unitTrack==='object'?d._unitTrack[unitId||'solid']:0;
  return(ut===1||ut===2||ut===3)?ut:studentDefaultTrack(d);
}
window.unitActiveTrack=unitActiveTrack;

window.lessonProgressInfo=function(id,dbObj,refTrack){
  const d=dbObj||(typeof DB==='object'&&DB?DB:{});
  const p=(d&&d[id]&&typeof d[id]==='object')?d[id]:{};
  const L=(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS))?LESSONS.find(x=>x.id===id):null;
  const unitId=(L&&L.unit)||'solid';
  const defTrack=unitActiveTrack(unitId,d);
  const track=(refTrack===1||refTrack===2||refTrack===3)?refTrack:((p.track===1||p.track===2||p.track===3)?p.track:defTrack);
  const tdNum=Number(p.trackDone)||0;
  const trackDone=(tdNum>=1&&tdNum<=3)?tdNum:(((p.prac&&Number(p.prac.solved)>=5)||(Number(p.steps)>0&&p.concept))?2:0);
  const spec=SPECS[id];
  const guideList=(spec&&Array.isArray(spec.firstGuide))?spec.firstGuide:[];
  const t1SoloCount=guideList.filter(g=>p.t1Solo&&p.t1Solo[g.tyNo]).length;
  const t1GuideAll=!guideList.length||t1SoloCount>=guideList.length;
  const practiceDone=trackDone>=track;
  const rawSteps=track===1?(!!p.t1SchemaDone&&t1GuideAll):track===2?Number(p.steps)>0:Number(p.t3Steps)>0;
  const stepsDone=practiceDone||rawSteps;
  const conceptDone=track>=2?(stepsDone||!!p.concept):(practiceDone||!!p.concept);
  const tabs={concept:conceptDone,steps:stepsDone,practice:practiceDone};
  const isDone=practiceDone;
  const doneSteps=tabs.practice?3:[tabs.concept,tabs.steps,tabs.practice].filter(Boolean).length;
  const t1StepsPartial=track===1&&!tabs.steps&&(!!p.t1SchemaDone||t1SoloCount>0);
  const started=track===1?(doneSteps>0||trackDone>=1||!!p.t1SchemaDone||t1SoloCount>0):(doneSteps>0||trackDone>=track);
  const bonusTrack=trackDone>track?trackDone:0;
  const TL=(typeof PTYPES==='object'&&PTYPES[id])||[];
  const revOf=t=>{const r=p.rev&&p.rev['ty'+t.no];return r&&typeof r==='object'?r:null};
  const mastered=TL.filter(t=>{const r=revOf(t);return r&&r.ok&&!r.re}).length;
  const recheck=TL.filter(t=>{const r=revOf(t);return r&&r.ok&&r.re}).length;
  return{id,track,trackDone,tabs,doneSteps,started,isDone,bonusTrack,t1StepsPartial,t1SchemaDone:!!p.t1SchemaDone,t1SoloCount,t1GuideTotal:guideList.length,mastered,recheck,totalTypes:TL.length};
};

window.lessonTrackDone=function(id,dbObj){
  return window.lessonProgressInfo(id,dbObj).trackDone;
};

function lesProg(lid){
  return typeof prog==='function'?prog(lid):(DB[lid]=DB[lid]||{concept:false,explore:false,steps:0,prac:{solved:0,streak:0,level:1,fails:0,retry:[]}});
}
function curTrack(lid){
  const p=lesProg(lid);
  if(p.track===1||p.track===2||p.track===3)return p.track;
  const L=(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS))?LESSONS.find(x=>x.id===lid):null;
  return unitActiveTrack((L&&L.unit)||'solid');
}
function setTrack(lid,tr){
  const p=lesProg(lid);
  p.track=tr;
  if(typeof save==='function')save();
}
if(typeof goalChoose==='function'){
  const prevGC=goalChoose;
  goalChoose=function(k){
    prevGC.apply(this,arguments);
    if(typeof DB==='object'&&DB){
      const tr=k==='calc'?1:k==='up'?3:2;
      /* [T38] 총정리 2-6 가: 갈림길로 올린 단원은 지켜요. 새 길보다 높은 단원 걸음만 남기고, 그 단원 차시는 높은 걸음 그대로 */
      const keep={},old=DB._unitTrack&&typeof DB._unitTrack==='object'?DB._unitTrack:{};
      Object.keys(old).forEach(u=>{const v=Number(old[u]);if((v===2||v===3)&&v>tr)keep[u]=v});
      DB._unitTrack=keep;
      if(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS)){
        LESSONS.forEach(l=>{if(DB[l.id]&&typeof DB[l.id]==='object')DB[l.id].track=keep[l.unit||'solid']||tr});
      }
      if(typeof save==='function')save();
    }
  };
}
function recordMetric(elapsedMs,errTag){
  if(typeof DB!=='object'||!DB)return;
  DB._metrics=DB._metrics||{fastClicks:0,totalClicks:0,errTags:{}};
  DB._metrics.totalClicks++;
  if(elapsedMs>=0&&elapsedMs<3000)DB._metrics.fastClicks++;
  if(errTag)DB._metrics.errTags[errTag]=(DB._metrics.errTags[errTag]||0)+1;
  if(typeof save==='function')save();
}


/* ── 2. [복습 추천] — 다음 날 한 번 · 유형 도장판 (T37: 설계 총정리 2-2) ──
   - 유형을 익히면 다음 날 [복습 추천]에 한 번 나와요(예전 3·7·14일 간격은 뺐어요).
   - 하루 최대 5문제, 유형마다 1문제. 어제 익힌 유형 먼저.
   - 다음 날 한 번에 맞히면 숙달 ✓(rec.ok=날짜). 틀리면 다음 날 다시.
   - 숙달한 유형을 [복습 추천]·보스전에서 놓치면 '다시 확인'(rec.re=1)을 붙이고, 다시 맞히면 떼요.
   기록 모양: DB[lid].rev['ty'+n] = {due:'YYYY-MM-DD'|'', ok:'YYYY-MM-DD'|'', err:0|1, d:'익힌 날', re?:1} (옛 box 칸은 읽지 않아요) */
const REV_MAX=5;
function revRec(lid,tyNo){
  const p=lesProg(lid);
  p.rev=p.rev||{};
  return p.rev['ty'+tyNo]||null;
}
/* 학생 DB 한 차시(p)의 유형 도장 판정 — 교사 화면도 이 함수를 같이 써요(HG_TRACKS.stampOf) */
function stampOf(p,tyNo){
  const rv=p&&p.rev&&typeof p.rev==='object'?p.rev['ty'+tyNo]:null;
  if(rv&&rv.ok&&rv.re)return{cls:'re',tag:'다시 확인',title:'숙달했던 유형인데 최근에 놓쳤어요. 다시 맞히면 떼어져요'};
  if(rv&&rv.ok)return{cls:'ok',tag:'숙달 ✓',title:'익힌 다음 날 한 번에 맞혀 숙달했어요'};
  if(rv&&rv.due)return{cls:'due',tag:'복습 대기',title:'다음 날 [복습 추천]에서 한 번 더 확인해요'};
  if(p&&((p.t1Solo&&p.t1Solo[tyNo])||(p.tyS&&p.tyS[tyNo])))return{cls:'t1',tag:'익힘',title:'유형 연습을 해 보았어요'};
  return{cls:'',tag:'',title:'아직 풀지 않았어요'};
}
function typeStampState(lid,tyNo){return stampOf(lesProg(lid),tyNo)}
/* 차시 하나의 숙달·다시 확인 유형 수 */
function stampCount(p,lid){
  const TL=(typeof PTYPES==='object'&&PTYPES[lid])||[];let ok=0,re=0;
  TL.forEach(t=>{const c=stampOf(p,t.no).cls;if(c==='ok')ok++;else if(c==='re'){re++}});
  return{ok,re,total:TL.length};
}

/* fromFinal: 차시 마무리에서 부를 때 true — 숙달 ✓ 유형을 마무리에서 틀리면 '다시 확인'(2-2 다) */
function scheduleTypeRev(lid,tyNo,hadWrongs,fromFinal){
  const p=lesProg(lid);
  p.rev=p.rev||{};
  const key='ty'+tyNo;
  const cur=p.rev[key]&&typeof p.rev[key]==='object'?p.rev[key]:null;
  if(cur&&cur.ok&&!cur.re){                  /* 이미 숙달한 유형은 다시 올리지 않아요 */
    if(hadWrongs&&fromFinal)markRecheck(lid,tyNo);
    return;
  }
  const t=typeof today==='function'?today():'';
  const d=typeof addDays==='function'&&t?addDays(t,1):'';
  const r=cur||{due:'',ok:'',err:0};
  delete r.box;
  r.due=(r.due&&r.due<d)?r.due:d;            /* 이미 밀린 복습이 있으면 그날 그대로 */
  r.d=t;
  if(hadWrongs)r.err=1;else if(!r.err)r.err=0;
  p.rev[key]=r;
  if(typeof save==='function')save();
}

function dueTypeList(targetDate){
  const t=targetDate||(typeof today==='function'?today():'');
  const yd=t&&typeof addDays==='function'?addDays(t,-1):'';
  const list=[];
  const RL=(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS))?LESSONS.filter(l=>l.ready&&SPECS[l.id]):[];
  RL.forEach((L,li)=>{
    const p=typeof DB==='object'&&DB&&DB[L.id];
    const rv=p&&p.rev;
    if(!rv||typeof rv!=='object')return;
    const TL=(typeof PTYPES==='object'&&PTYPES[L.id])||[];
    TL.forEach(T=>{
      const rec=rv['ty'+T.no];
      if(!rec||typeof rec!=='object'||!rec.due||(t&&rec.due>t))return;
      if(rec.ok&&!rec.re)return;                /* 숙달 ✓ 유형은 '다시 확인'이 붙었을 때만 */
      list.push({lid:L.id,tyNo:T.no,L,T,rec,li});
    });
  });
  const rank=x=>(x.rec.d===yd?0:1);
  list.sort((a,b)=>rank(a)-rank(b)||((b.rec.re?1:0)-(a.rec.re?1:0))||((b.rec.err?1:0)-(a.rec.err?1:0))||String(a.rec.due).localeCompare(String(b.rec.due))||(a.li-b.li)||(a.tyNo-b.tyNo));
  return list;
}

function buildDailyRevQueue(targetDate){
  const due=dueTypeList(targetDate);
  if(!due.length)return[];
  const base=typeof newSeed==='function'?newSeed():301;
  return due.slice(0,REV_MAX).map((d,k)=>({
    lid:d.lid,tyNo:d.tyNo,L:d.L,T:d.T,rec:d.rec,
    genKey:typeof tyKey==='function'?tyKey(d.lid,d.tyNo):d.lid,
    seed:(base+k*37+d.tyNo*13)%99999+1
  }));
}

function submitDailyRevType(lid,tyNo,passedFirstTry,reviewDate){
  const p=lesProg(lid);
  p.rev=p.rev||{};
  const key='ty'+tyNo;
  const r=p.rev[key]&&typeof p.rev[key]==='object'?p.rev[key]:{due:'',ok:'',err:0};
  const d=reviewDate||(typeof today==='function'?today():'');
  delete r.box;
  if(passedFirstTry){
    r.due='';r.err=0;
    if(!r.ok)r.ok=d;
    delete r.re;
  }else{
    r.due=typeof addDays==='function'?addDays(d,1):d;
    r.err=1;
    if(r.ok)r.re=1;
  }
  p.rev[key]=r;
  if(typeof save==='function')save();
  return r;
}

/* 보스전 등에서 숙달 유형을 놓쳤을 때 '다시 확인' 붙이기(다음 날 [복습 추천]에 나와요) */
function markRecheck(lid,tyNo){
  if(typeof DB!=='object'||!DB||!DB[lid]||typeof DB[lid]!=='object')return false;
  const r=DB[lid].rev&&DB[lid].rev['ty'+tyNo];
  if(!r||!r.ok)return false;
  r.re=1;
  const t=typeof today==='function'?today():'';
  const d=t&&typeof addDays==='function'?addDays(t,1):'';
  if(!r.due||r.due>d)r.due=d;
  if(typeof save==='function')save();
  return true;
}

/* ── 2.5 공용 그림(SVG + 3D Viewer) 마운트 ── */
function applyTrackHl(v,m,hl,interactive){
  const h=Array.isArray(hl)?hl[0]:hl;
  if(!h)return;
  if(typeof h==='function'){h(v,m,!!interactive);return}
  if(h==='baseAsk'){const b=m.base||[],c=typeof HL_SIDE!=='undefined'?HL_SIDE:'#f7c97f';v.fcol=i=>b.includes(i)?c:null;return}
  if(h==='one'){const b=m.base||[0],t=b.length>1?b[1]:b[0],c=typeof HL_SIDE!=='undefined'?HL_SIDE:'#f7c97f';v.fcol=i=>i===t?c:null;return}
  if(h==='allV'){v.mode='v';v.vcol=()=>'#e08a1e';return}
  if(h==='cut'&&typeof m.cutFace==='number'){const c=typeof HL_SIDE!=='undefined'?HL_SIDE:'#f7c97f';v.fcol=i=>i===m.cutFace?c:null;return}
  if(typeof applyHl==='function')applyHl(v,m,h);
}
function mountTrackFig(host,figRes,opt={}){
  if(!host)return;
  if(!figRes){host.innerHTML='';return}
  if(typeof figRes==='string'){
    host.innerHTML=figRes+(opt.cap?`<div class="ct-fig-cap">${opt.cap}</div>`:'');
    return;
  }
  if(typeof figRes==='object'){
    const items=Array.isArray(figRes.items)?figRes.items:(figRes.mesh?[figRes]:[]);
    if(!items.length&&typeof figRes.svg==='function'){mountTrackFig(host,figRes.svg(!!opt.interactive,0),opt);return}
    if(!items.length){host.innerHTML='';return}
    host._f3=[];
    const inter=opt.interactive!==false;
    host.innerHTML=`<div class="ct-3d-grid${items.length>1?' duo':''}${opt.compact?' sm':''}${inter?'':' static'}">
      ${items.map((it,i)=>`<figure class="ct-3d-item">
        <div class="ct-3d-stage"><canvas data-f3="${i}" aria-label="${it.aria||it.cap||'입체도형 그림'}"></canvas></div>
        ${it.cap?`<figcaption class="ct-3d-cap">${it.cap}</figcaption>`:''}
      </figure>`).join('')}
    </div>${inter?'<div class="ct-3d-hint">끌어서 돌려 볼 수 있어요</div>':''}${opt.cap?`<div class="ct-fig-cap">${opt.cap}</div>`:''}`;
    $$('canvas[data-f3]',host).forEach(cv=>{
      const it=items[+cv.dataset.f3];
      if(!it||!it.mesh||typeof figure!=='function')return;
      const v=figure(cv,Object.assign({},it,{visual:inter,yaw:it.yaw??-0.5,pitch:it.pitch??0.36,pad:it.pad??0.38}));
      applyTrackHl(v,it.mesh,it.hl,inter);
      v.dirty=true;
      (host._f3=host._f3||[])[+cv.dataset.f3]={v,mesh:it.mesh}; /* [T31] 부엉 쌤 박자마다 표시만 바꿀 때 씀 */
    });
  }
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
/* 호 기호: <span class="arc-sym">AB</span>를 글자 위 굽은 선(SVG)으로 바꿔요. 글꼴·브라우저와 상관없이 같은 모양이에요 */
function arcSymHTML(html){return String(html||'').replace(/<span class="arc-sym">([^<]+)<\/span>/g,(m,t)=>`<span class="arc-sym" role="img" aria-label="호 ${t}"><svg class="arc-sym-c" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true"><path d="M6 21 Q50 -5 94 21"/></svg>${t}</span>`)}
function owlBeats(sc){
  if(Array.isArray(sc.beats)&&sc.beats.length)return sc.beats.map(b=>typeof b==='string'?{say:b}:b);
  const s=String(sc.say||''),parts=s.split(/(?<=[.!?])\s+/).filter(x=>x.trim());
  const bal=x=>(x.match(/<span\b/g)||[]).length===(x.match(/<\/span>/g)||[]).length&&(x.match(/<b>/g)||[]).length===(x.match(/<\/b>/g)||[]).length;
  return(parts.length>1&&parts.length<=4&&parts.every(bal)?parts:[s]).map(say=>({say}));
}
/* [T32] 3D 그림의 강조(주황·파랑 칠) 깜빡이기. hl 함수가 스스로 깜빡이면(v._selfPulse) 건너뛰어요. */
function owlPulseStop(v){if(v&&v._owlP){v._owlP.t.forEach(clearTimeout);const o=v._owlP.o;v.fcol=o[0];v.ecol=o[1];v.vcol=o[2];v._owlP=null;v.dirty=true}}
function owlPulse(v){
  if(!v||v._selfPulse||owlReduce())return;owlPulseStop(v);
  const o=[v.fcol,v.ecol,v.vcol];if(!o.some(Boolean))return;
  const P={o,t:[]};v._owlP=P;
  for(let t=1;t<=6;t++)P.t.push(setTimeout(()=>{const off=t%2===1&&t<6;v.fcol=off?null:o[0];v.ecol=off?null:o[1];v.vcol=off?null:o[2];v.dirty=true;if(t===6)v._owlP=null},240*t));
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
  const ALL=typeof spec.owlScenes==='function'?spec.owlScenes():(spec.owlScenes||[]);
  if(!ALL.length){host.innerHTML='';return}
  /* [T38] 총정리 2-1 다 8: 장면마다 걸음 표시 lv(1 🌱 · 2 🌿 · 3 🌳, 없으면 🌱). 내 걸음까지의 장면만 보여 주고,
     끝나면 '🌿 더 알아보기'(그다음 걸음 장면)로 이어 봐요. 🌿·🌳 학생은 장면 점으로 건너뛸 수 있어요. */
  const LV_IC=['','🌱','🌿','🌳'],LV_NM=['','🌱 첫걸음','🌿 한걸음','🌳 두걸음'];
  const lvOf=sc=>(sc&&(sc.lv===2||sc.lv===3))?sc.lv:1;
  const tr=(opt.track===1||opt.track===2||opt.track===3)?opt.track:curTrack(lid);
  let maxLv=tr;if(!ALL.some(sc=>lvOf(sc)<=maxLv))maxLv=3;
  let scenes=[],B=[];
  const pick=()=>{scenes=ALL.filter(sc=>lvOf(sc)<=maxLv);B=scenes.map(owlBeats)};
  pick();
  const moreLv=()=>{const l=ALL.map(lvOf).filter(v=>v>maxLv);return l.length?Math.min(...l):0};
  let idx=0,beat=0,finished=false,doneOnce=false,extra=false;const askedDone=new Set(),seenS=new Set();
  const canJump=i=>tr>=2||seenS.has(scenes[i]);
  const plain=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

  const paint=anim=>{
    const sc=scenes[idx],bs=B[idx],bt=bs[beat]||bs[0],atEnd=beat>=bs.length-1,showAsk=!!sc.ask&&atEnd,needAsk=showAsk&&!askedDone.has(scenes[idx]),isLast=idx>=scenes.length-1;
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
    /* [T31] 3D 장면: 박자에 hl이 있으면 돌려 놓은 그대로 표시만 바꿔요(그림이 하나면 값 하나, 여럿이면 [그림별 값]).
       [T32] 부엉 쌤 기본 원리(선생님): 말이 가리키는 대상은 반드시 움직임으로 강조해요.
       → 박자가 바뀔 때마다(박자 hl이 없으면 장면 첫 박자에) 표시된 부분을 3번 깜빡여요(owlPulse). */
    {const slot=$('.owl-fig-slot',host),views=((slot&&slot._f3)||[]).filter(Boolean);
      if(bt.hl!==undefined)views.forEach((o,i)=>{const h=Array.isArray(bt.hl)?bt.hl[i]:bt.hl;const v=o.v;owlPulseStop(v);v._selfPulse=false;v.fcol=v.ecol=v.vcol=null;v.mode=null;applyTrackHl(v,o.mesh,h,true);v.dirty=true});
      if(anim&&(bt.hl!==undefined||beat===0))views.forEach(o=>owlPulse(o.v));}
    const av=$('.owl-av',host);if(av)av.innerHTML=owlAvatarSVG(bt.exp||sc.exp||'normal');
    const bub=$('#owlBub',host);
    if(bub)bub.innerHTML=bs.slice(0,beat+1).map((x,i)=>`<p class="owl-line${i===beat?' now':''}">${arcSymHTML(x.say)}</p>`).join('');
    const ak=$('#owlAskHost',host);
    if(ak){
      ak.innerHTML=showAsk?`<div class="owl-ask">
        <div class="owl-ask-q">✋ 잠깐 확인! ${sc.ask.q}</div>
        <div class="ct-hit-row" id="owlAskBtns">${sc.ask.choices.map(c=>`<button type="button" class="ct-hit${askedDone.has(scenes[idx])&&c===sc.ask.ans?' ok':''}" data-oa="${c}"${askedDone.has(scenes[idx])?' disabled':''}>${c}</button>`).join('')}</div>
        <div id="owlAskMsg">${askedDone.has(scenes[idx])?`<div class="feedback ok" style="margin-top:6px">${sc.ask.ok}</div>`:''}</div></div>`:'';
      $$('[data-oa]',ak).forEach(b=>b.onclick=()=>{
        const msg=$('#owlAskMsg',ak);
        if(b.dataset.oa===sc.ask.ans){askedDone.add(scenes[idx]);b.classList.add('ok');$$('[data-oa]',ak).forEach(x=>x.disabled=true);if(msg)msg.innerHTML=`<div class="feedback ok" style="margin-top:6px">${sc.ask.ok}</div>`;paintHint()}
        else{b.classList.add('bad');b.disabled=true;if(msg)msg.innerHTML=`<div class="ct-cool" style="margin-top:6px">💡 ${sc.ask.hint}</div>`}
      });
    }
    const sum=$('#owlSumHost',host);
    if(sum){const ml=finished?moreLv():0,mk=ml?ALL.filter(x=>lvOf(x)===ml).length:0;
      sum.innerHTML=(finished&&Array.isArray(spec.owlSummary)&&spec.owlSummary.length?`<div class="owl-sum"><b>📌 부엉 쌤 핵심 정리</b><ul>${spec.owlSummary.map(x=>`<li>${arcSymHTML(x)}</li>`).join('')}</ul></div>`:'')
        +(ml?`<div class="owl-more"><button type="button" class="btn primary" id="owlMore">${LV_IC[ml]} 더 알아보기 · 장면 ${mk}개</button><small>${LV_NM[ml]}에서 쓰는 내용이에요. 하고 싶을 때 봐요.</small></div>`:'');
      const mb=$('#owlMore',sum);if(mb)mb.onclick=()=>{const first=ALL.find(x=>lvOf(x)===ml);maxLv=ml;pick();idx=Math.max(0,scenes.indexOf(first));beat=0;finished=false;extra=true;enter()}}
    const pg=$('.owl-pg',host);if(pg)pg.innerHTML=`장면 ${idx+1} / ${scenes.length}${bs.length>1?` <span class="owl-bdots">${bs.map((_,i)=>`<i class="${i<=beat?'on':''}"></i>`).join('')}</span>`:''}`;
    const pv=$('#owlPrev',host);if(pv)pv.disabled=idx===0&&beat===0;
    $$('.owl-dot',host).forEach((d,i)=>{d.className='owl-dot lv'+lvOf(scenes[i])+(i<idx||(finished&&i===idx)?' done':i===idx?' on':'');d.disabled=!canJump(i)});
    paintHint();
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,file:'js/02t-track-engine.js',fn:'mountOwlShow',section:'부엉 쌤 개념 극장',owlScene:idx+1,owlTotal:scenes.length,owlBeat:beat+1,owlBeatTotal:bs.length,owlCap:sc.cap||''});
    void needAsk;void isLast;
  };
  const paintHint=()=>{
    const h=$('.owl-hint',host);if(!h)return;
    const sc=scenes[idx],atEnd=beat>=B[idx].length-1,needAsk=!!sc.ask&&atEnd&&!askedDone.has(scenes[idx]),isLast=idx>=scenes.length-1;
    h.className='owl-hint'+(finished?' fin':needAsk?' ask':'');
    h.innerHTML=finished?'✓ 개념을 끝까지 봤어요. 장면 점을 누르면 다시 볼 수 있어요.'
      :needAsk?'✋ 질문에 답하면 다음으로 넘어가요.'
      :isLast&&atEnd?'👆 화면을 누르면 핵심 정리가 나와요.'
      :'👆 화면 빈 곳을 누르면 다음으로 넘어가요.';
  };
  const enter=()=>{
    const sc=scenes[idx],hadFocus=typeof host.contains==='function'&&typeof document==='object'&&host.contains(document.activeElement);
    seenS.add(sc);
    host.innerHTML=`<div class="owl-wrap owl-tap" tabindex="0" role="group" aria-label="부엉 쌤 개념 그림극. 화면을 누르면 다음으로 넘어가요.">
      <div class="owl-top">
        <span class="owl-title">🦉 부엉 쌤의 개념 그림극 <span class="owl-lv l${lvOf(sc)}" title="이 장면은 ${LV_NM[lvOf(sc)]} 내용이에요">${LV_NM[lvOf(sc)]}</span></span>
        <div class="owl-dots">${scenes.map((x,i)=>`<button type="button" class="owl-dot lv${lvOf(x)}" data-oi="${i}" aria-label="${i+1}장면 · ${LV_NM[lvOf(x)]}"></button>`).join('')}</div>
      </div>
      <div class="owl-panel">
        <div class="owl-stage owl-new"><div class="owl-fig-slot"></div>${sc.cap?`<div class="owl-cap">${sc.cap}</div>`:''}</div>
        <div class="owl-row"><div class="owl-av"></div><div class="owl-bub" id="owlBub" aria-live="polite"></div></div>
      </div>
      <div id="owlAskHost"></div><div id="owlSumHost"></div>
      <div class="owl-ctrl">
        <div><button type="button" class="btn ghost mini" id="owlPrev">◀ 이전</button> <button type="button" class="btn ghost mini" id="owlReplay">↺ 처음부터</button>${typeof canSpeak!=='undefined'&&canSpeak&&typeof speak==='function'?' <button type="button" class="btn ghost mini say" id="owlSay" aria-label="자막 읽어 주기">🔊 듣기</button>':''}</div>
        <span class="owl-pg muted"></span>
      </div>
      <div class="owl-hint"></div>
    </div>`;
    mountTrackFig($('.owl-fig-slot',host),sc.svg?sc.svg(true):null,{interactive:true});
    const wrap=$('.owl-wrap',host);
    wrap.onclick=e=>{if(e.target.closest&&e.target.closest('button,a,input,select,label,.owl-ask,.owl-sum,canvas,.ct-3d-stage'))return;next()};
    wrap.onkeydown=e=>{if(e.target!==wrap)return;if(e.key===' '||e.key==='Enter'||e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key==='ArrowLeft'){e.preventDefault();prev()}};
    $$('[data-oi]',host).forEach(b=>b.onclick=()=>{const t=+b.dataset.oi;if(canJump(t)){idx=t;beat=0;finished=false;extra=false;enter()}});
    $('#owlPrev',host).onclick=prev;
    $('#owlReplay',host).onclick=()=>{idx=0;beat=0;finished=false;extra=false;enter()};
    const sy=$('#owlSay',host);if(sy)sy.onclick=()=>{const bt=B[idx][beat];speak(plain(bt&&bt.say),sy)};
    if(hadFocus&&wrap.focus)try{wrap.focus({preventScroll:true})}catch(e){}
    paint(true);
  };
  const next=()=>{
    if(finished)return;
    const sc=scenes[idx];
    if(beat<B[idx].length-1){beat++;paint(true);return}
    if(sc.ask&&!askedDone.has(scenes[idx])){const a=$('.owl-ask',host);if(a){a.classList.remove('owl-shake');void a.offsetWidth;a.classList.add('owl-shake')}return}
    {let n=idx+1;if(extra)while(n<scenes.length&&seenS.has(scenes[n]))n++;
      if(n<scenes.length){idx=n;beat=0;enter();return}}
    finished=true;
    /* 처음부터·장면 점으로 다시 볼 때는 finished를 풀어요. 기록·포인트·onFinish는 처음 한 번만 */
    if(doneOnce){paint(false);return}
    doneOnce=true;
    const p=lesProg(lid);p.concept=true;p.tday=today();
    if(typeof save==='function')save();
    if(typeof award==='function')award(5,lid+':owl','부엉 쌤 개념 그림극을 끝까지 봤어요');
    if(opt.onFinish)opt.onFinish();
    paint(false);
    const s=$('#owlSumHost',host);if(s&&s.scrollIntoView)try{s.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}
  };
  const prev=()=>{
    if(finished){finished=false;paint(false);return}
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
    const soloDoneCnt=guideList.filter(g=>p.t1Solo&&p.t1Solo[g.tyNo]).length;
    const bStat=soloDoneCnt>=guideList.length?'완료 ✓':soloDoneCnt?`${soloDoneCnt}/${guideList.length}유형`:`${guideList.length}유형`;
    body.innerHTML=`<div class="ct-subtabs">
      <button type="button" class="ct-subtab${sub==='schema'?' on':''}" data-s="schema">A. 맞는지 · 아닌지 구별하기 (${p.t1SchemaDone?'완료 ✓':(spec.schemaRapid?spec.schemaRapid.n:schemaList.length)+'문항'})</button>
      ${guideList.length?`<button type="button" class="ct-subtab${sub==='guide'?' on':''}" data-s="guide">B. 선생님과 같이 따라 풀기 (${t1GuideLocked(lid,spec)?'🔒 개념 보기 먼저':bStat})</button>`:''}
    </div><div id="t1SubHost"></div>`;
    $$('.ct-subtab',body).forEach(b=>b.onclick=()=>{sub=b.dataset.s;drawSub()});
    const host=$('#t1SubHost',body);
    if(sub==='schema')renderT1Schema(host,lid,spec,()=>{if(guideList.length){sub='guide';drawSub()}else if(typeof location==='object')location.hash='#'+lid+'-'+(spec.kind==='concept'?'concept':'practice')});
    else if(t1GuideLocked(lid,spec))host.innerHTML=`<div class="ct-card ct-t1-lock"><div class="ct-lock-ic" aria-hidden="true">🦉</div>
      <p><b>🦉 개념 보기를 먼저 봐요.</b><br>부엉 쌤 그림극에서 이름과 뜻을 확인하면 B. 따라 풀기가 열려요.</p>
      <div class="next-row" style="justify-content:center"><a class="btn primary" href="#${lid}-concept">② 부엉 쌤 개념 보기 →</a></div></div>`;
    else renderT1Guide(host,lid,spec);
  };
  drawSub();
}
/* [T38] 총정리 2-1 라 B5: 개념형 🌱에서는 부엉 쌤을 본 뒤에 B 따라 풀기가 열려요(p.concept = 그림극 끝까지 봄) */
function t1GuideLocked(lid,spec){
  if(spec.kind!=='concept'||!(spec.firstGuide||[]).length||curTrack(lid)!==1)return false;
  const sc=typeof spec.owlScenes==='function'?spec.owlScenes():(spec.owlScenes||[]);
  return sc.length>0&&!lesProg(lid).concept;
}

/* [T31] 첫걸음 A를 마친 뒤 다음 할 일(선생님 의견: B 따라 풀기도 분명히 추천).
   개념형 차시: 개념을 아직 안 봤으면 ② 개념 보기 → B 따라 풀기 순서를 보여 주고, 이미 봤으면 B가 먼저예요.
   (feedback 상자를 닫고 버튼 줄을 붙여요. 버튼 id toGuideBtn은 그대로) */
function t1AfterSchemaHTML(lid,spec,p){
  const hasG=(spec.firstGuide||[]).length>0,isC=spec.kind==='concept',seen=!!(p&&p.concept);
  const gBtn=cls=>`<button type="button" class="btn ${cls}" id="toGuideBtn">B. 선생님과 같이 따라 풀기 →</button>`;
  const cBtn=cls=>`<a class="btn ${cls}" href="#${lid}-concept">② 부엉 쌤 개념 보기 →</a>`;
  const pBtn=`<a class="btn primary" href="#${lid}-practice">첫걸음 차시 마무리 →</a>`;
  let msg,btns;
  if(isC&&hasG&&!seen){msg='다음 순서: <b>② 개념 보기</b>에서 이름을 확인한 뒤 → <b>B. 선생님과 같이 따라 풀기</b>로 넘어가요. B는 개념 보기를 본 뒤에 열려요.';btns=cBtn('primary')}
  else if(hasG){msg='이제 <b>B. 선생님과 같이 따라 풀기</b>로 넘어가요.';btns=gBtn('primary')+(isC?cBtn('ghost'):'')}
  else if(isC&&!seen){msg='방금 본 모양의 이름을 <b>② 개념 보기</b>에서 확인해 봐요.';btns=cBtn('primary')}
  else{msg='이제 <b>차시 마무리</b>로 넘어가요.';btns=pBtn+(isC?cBtn('ghost'):'')}
  return `${msg}</div>
    <div class="next-row" style="justify-content:flex-start">${btns}`;
}

/* [T19] 첫걸음 A단계 · 주황 표시 연속 구별하기
   spec.schemaRapid = { n: 문제 수, kinds: 종류 수, q: 묻는 말, choices: [보기], make(kindIdx, seed) → {fig, ans, why, also?} }
   그림이 연달아 뜨고, 맞히면 잠깐 뒤 저절로 다음 그림. 틀리면 이유를 보여 주고 같은 종류를 한 번 더 내요. */
function renderT1Rapid(host,lid,spec,onNextPart){
  const R=spec.schemaRapid,p=lesProg(lid);
  const rnd=typeof mulberry==='function'?mulberry(typeof newSeed==='function'?newSeed():Date.now()%99991):Math.random;
  /* [T31] R.order(rnd) → 종류 순서를 차시가 정해요(예: poly 다면체 O/X → 가족 → 정리). 없으면 무작위. */
  const kinds=typeof R.order==='function'?R.order(rnd):[...Array(R.kinds).keys()];
  if(typeof R.order!=='function')for(let i=kinds.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[kinds[i],kinds[j]]=[kinds[j],kinds[i]]}
  const total=Math.min(R.n||8,kinds.length);
  const newSeedFor=k=>k+R.kinds*(1+Math.floor(rnd()*900));
  const queue=kinds.slice(0,total).map(k=>({k,seed:newSeedFor(k)}));
  let idx=0,good=0,nextT=null;
  const finish=()=>{
    p.t1SchemaDone=true;p.tday=today();if(typeof save==='function')save();
    if(typeof award==='function')award(5,lid+':t1schema','주황색 표시를 모두 구별했어요');
    host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>구별하기 ${queue.length}문제 완료!</b> 한 번에 맞힌 문제 ${good}개예요. ${t1AfterSchemaHTML(lid,spec,p)}</div>`;
    const gb=$('#toGuideBtn',host);if(gb)gb.onclick=onNextPart;
  };
  const draw=()=>{
    if(nextT){clearTimeout(nextT);nextT=null}
    if(!host.isConnected)return;
    if(idx>=queue.length)return finish();
    const cur=queue[idx],it=R.make(cur.k,cur.seed),shownAt=Date.now();
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:1,tab:'steps',subtab:'A. 빠른 구별',section:'',file:'js/02t-track-engine.js',fn:'renderT1Rapid',rapidKind:cur.k,rapidSeed:cur.seed,rapidIdx:idx+1,rapidTotal:queue.length,schemaId:'',guideId:'',inSolo:false,prob:null});
    let missed=false;const bothPick=new Set();
    host.innerHTML=`<div class="ct-card ct-schema ct-rapid">
      <div class="ct-card-h"><h2>${R.title||'주황색은 무엇일까요?'}</h2><div class="ct-schema-prog">${queue.map((_,i)=>`<span class="ct-dot-step${i<idx?' done':i===idx?' on':''}">${i<idx?'✓':i+1}</span>`).join('')}<span>${idx+1} / ${queue.length}</span></div></div>
      <div class="ct-stage">
        <div class="ct-fig ct-rapid-fig"></div>
        <div>
          <p class="ct-schema-q">${it.q||R.q||'주황색으로 표시한 것은?'}</p>
          <div class="ct-hit-row" id="rqOpts">${(it.choices||R.choices).map((c,i)=>`<button type="button" class="ct-hit" style="--i:${i}" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="rqMsg" aria-live="polite"></div>
        </div>
      </div></div>`;
    mountTrackFig($('.ct-rapid-fig',host),it.fig,{interactive:true});
    if(typeof HG_REPORT!=='undefined')HG_REPORT.mount($('.ct-rapid',host),{lesson:lid}); /* [T29] 신고 버튼 */
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
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>구별 연습 ${QS.length}문항 완료!</b> ${t1AfterSchemaHTML(lid,spec,p)}</div>`;
      const gb=$('#toGuideBtn',host);if(gb)gb.onclick=onNextPart;
      return;
    }
    const q=QS[idx];shownAt=Date.now();
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:1,tab:'steps',subtab:'A. 개념 구별',section:'',file:'js/02t-track-engine.js',fn:'renderT1Schema',schemaId:q.id||('q'+(idx+1)),schemaIdx:idx+1,schemaTotal:QS.length,rapidIdx:0,guideId:'',inSolo:false,prob:null});
    host.innerHTML=`<div class="ct-card ct-schema">
      <div class="ct-card-h"><h2>맞을까? 아닐까? 구별하기</h2><div class="ct-schema-prog">${QS.map((_,i)=>`<span class="ct-dot-step${i<idx?' done':i===idx?' on':''}">${i<idx?'✓':i+1}</span>`).join('')}<span>${idx+1} / ${QS.length}</span></div></div>
      <div class="ct-stage">
        <div class="ct-fig" id="sqFig"></div>
        <div>
          <p class="ct-schema-q">${q.q}</p>
          <div class="ct-hit-row" id="sqOpts">${q.choices.map(c=>`<button type="button" class="ct-hit" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="sqMsg"></div>
        </div>
      </div></div>`;
    mountTrackFig($('#sqFig',host),q.fig?q.fig(true):null,{interactive:true,cap:'그림의 핵심 표시를 눈으로 먼저 확인해요'});
    if(typeof HG_REPORT!=='undefined')HG_REPORT.mount($('.ct-schema',host),{lesson:lid}); /* [T29] 신고 버튼 */
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
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:1,tab:'steps',subtab:'B. 선생님과 같이 따라 풀기',file:'js/02t-track-engine.js',fn:'renderT1Guide → mountSoloTwin',guideId:g.id,tyNo:g.tyNo,guideStep:4,inSolo:true});
    const nb=$('#fgTwinNew',soloHost);if(nb)nb.onclick=()=>{twinSeed=(twinSeed+19)%99999+1;mountSoloTwin()};
    renderProblem($('#fgTwinBody',soloHost),prob,{mode:'final',visual:true,rep:{lesson:lid,gen:key,seed:twinSeed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
      if(typeof logAttempt==='function')logAttempt({lesson:lid,kind:'steps',good,wrongs,mode,gen:key,seed:twinSeed,ptype:prob.ptype,stepWrongs,revealed});
      if(good){
        twinDone=true;
        p.t1Solo[g.tyNo]=true;
        p.tday=today();
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
    const g=GUIDE[gIdx];
    if(!g){host.innerHTML='';return}
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:1,tab:'steps',subtab:'B. 선생님과 같이 따라 풀기',section:'',file:'js/02t-track-engine.js',fn:'renderT1Guide',guideId:g.id,tyNo:g.tyNo,guideStep:step,inSolo:false,rapidIdx:0,schemaId:'',prob:null});
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
        <div class="ct-fig" id="fgFig"></div>
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
    mountTrackFig($('#fgFig',host),g.fig?g.fig(hl,true):null,{interactive:true,cap:'안내에 따라 눌러 보면 그림에서 바로 확인돼요'});

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
      helped=true;
      if(typeof DB==='object'&&DB){DB._needCalc={id:g.calcTopic,from:lid,at:Date.now()};if(typeof save==='function')save()}
      step=4;draw();
      const boxAfter=$('#fgHelpBox',host)||hbox;
      /* [T38] 총정리 2-3 마: 3초 자동 이동 없이 버튼 두 개. 고르지 않아도 길잡이에 '막혔던 계산'이 올라가요(DB._needCalc) */
      boxAfter.hidden=false;boxAfter.className='ct-calchelp-box';
      boxAfter.innerHTML=`<div><b>선생님이 대신 계산했어요:</b> ${g.calcExplain}</div>
        <div style="margin-top:6px">이 계산은 <b>기초 연산 · ${calcNm}</b>에서 연습할 수 있어요. 어떻게 할까요?</div>
        <div class="ct-calchelp-act">
          <a class="btn primary" href="#calc-${g.calcTopic}">지금 기초 연산 가기 →</a>
          <button type="button" class="btn ghost" id="fgStayHere">이 차시 먼저 끝내기</button>
        </div>`;
      const sBtn=$('#fgStayHere',boxAfter);
      if(sBtn)sBtn.onclick=()=>{const act=$('.ct-calchelp-act',boxAfter);if(act)act.innerHTML='<small>좋아요! 이 차시를 끝낸 뒤 오늘의 길잡이에서 이 계산을 연습할 수 있어요.</small>'};
    };

    if(s3Done&&!twinDone)mountSoloTwin();
    const nb=$('#fgNext',host);
    if(nb)nb.onclick=()=>{if(gIdx+1<GUIDE.length){gIdx++;step=0;foundGiven=new Set();helped=false;twinDone=false;draw()}else if(typeof location==='object')location.hash='#'+lid+'-practice'};
  };
  draw();
}

const t1GuideAllDone=(lid,spec)=>{const p=lesProg(lid);return(spec.firstGuide||[]).every(g=>p.t1Solo&&p.t1Solo[g.tyNo])};
function renderT1Concept(body,lid,spec){
  body.innerHTML=`<div id="owlConceptHost"></div>
    ${spec.kind==='concept'?((spec.firstGuide||[]).length&&!t1GuideAllDone(lid,spec)?`<div class="next-row"><a class="btn primary" href="#${lid}-steps">B. 선생님과 같이 따라 풀기 →</a><a class="btn ghost" href="#${lid}-practice">3단계 차시 마무리 →</a></div>`:`<div class="next-row"><a class="btn primary" href="#${lid}-practice">3단계 차시 마무리 하러 가기 →</a></div>`)
      :`<div class="next-row"><a class="btn primary" href="#${lid}-steps">2단계 유형 익히기(선생님과 따라 풀기) →</a></div>`}
    ${bonusExploreHTML(lid)}`;
  const host=$('#owlConceptHost',body);
  if(host)mountOwlShow(host,lid,spec);
}

function renderT1Practice(body,lid,spec){
  const p=lesProg(lid);
  /* [T20] schemaRapid.check = 마무리에 섞을 빠른 구별 종류 번호들. 틀리면 같은 종류의 다른 그림(make)으로 다시 확인해요. */
  const R=spec.schemaRapid,rapidItem=k=>{const mk=sd=>{const it=R.make(k,k+R.kinds*(1+sd%900));return{id:'r'+k+'_'+sd,kind:'r'+k,q:it.q||R.q,fig:()=>it.fig,choices:it.choices||R.choices,ans:it.ans,also:it.also,both:it.both,why:it.why,hint:`정답은 <b>${(it.both||[it.ans]).join(', ')}</b>예요. ${it.why}`}};const first=mk(Math.floor(Math.random()*900)+1);first.make=mk;return first};
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
      if(typeof award==='function')award(15,lid+':t1','첫걸음 차시 마무리를 통과했어요');
      /* [T37] 🌱 마무리는 🌱 따라 풀기(firstGuide)에 나온 유형만 [복습 추천]에 올려요 */
      [...new Set((spec.firstGuide||[]).map(g=>g.tyNo).filter(Boolean))].forEach(no=>scheduleTypeRev(lid,no,false));
      body.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌱 첫걸음 차시 마무리 통과!</b><br>핵심 구별과 풀이 따라 하기 ${pool.length}가지를 모두 해냈어요.</div>
        ${lessonCompleteCrossroadsHTML(lid,1)}</div>${bonusExploreHTML(lid)}`;
      bindLessonCrossroads(body,lid,1);
      return;
    }
    const item=qQueue[idx],shownAt=Date.now();
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:1,tab:'practice',subtab:'차시 마무리',section:'',file:'js/02t-track-engine.js',fn:'renderT1Practice',schemaId:item.id||item.kind,schemaIdx:idx+1,schemaTotal:qQueue.length,rapidIdx:0,guideId:'',inSolo:false,prob:null});
    body.innerHTML=`<div class="ct-chk-bar"><b>🌱 첫걸음 차시 마무리</b><span>진행 ${Math.min(doneSet.size,pool.length)} / ${pool.length}</span></div>
      ${recheckKind===item.kind?'<div class="ct-recheck">💡 실수일 수 있어요! 같은 종류 문제를 한 번 더 확인해 볼게요.</div>':''}
      <div class="ct-card"><div class="ct-stage">
        <div class="ct-fig" id="t1Fig"></div>
        <div><p class="ct-schema-q">${item.q}</p>
          <div class="ct-hit-row" id="t1Ch">${item.choices.map(c=>`<button type="button" class="ct-hit" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="t1Msg"></div>
        </div>
      </div></div>`;
    mountTrackFig($('#t1Fig',body),item.fig?item.fig(false):null,{interactive:false});
    if(typeof HG_REPORT!=='undefined')HG_REPORT.mount($('.ct-card',body),{lesson:lid}); /* [T29] 신고 버튼 */
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
      if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:2,tab:'steps',subtab:'유형 고르기',section:'',file:'js/02t-track-engine.js',fn:'renderT2Steps',tyNo:0,workedOpen:false,prob:null});
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
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:2,tab:'steps',subtab:`유형 ${T_.no} · ${T_.nm}`,section:'',file:'js/02t-track-engine.js',fn:'renderT2Steps',tyNo:curNo,workedOpen:wxOpen,workedStep:wxStep});
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
              <div class="ct-fig" id="wxFig"></div>
              <div>
                <div class="ct-wx-steps">
                  ${W.steps.map((s,i)=>`<button type="button" class="ct-wx-step${i===wxStep?' on':''}" data-ws="${i}"><div class="ct-wx-step-top">${s.t}</div>${i<=wxStep?`<div class="ct-wx-step-body">${s.body}</div>`:'<small class="muted">눌러서 설명 보기</small>'}</button>`).join('')}
                </div>
                <div class="ct-pitfall">${W.pitfall}</div>
              </div>
            </div>
          </div>
        </div>`;
        mountTrackFig($('#wxFig',wxHost),W.fig?W.fig(stObj.hl,true):null,{interactive:true});
      }
      const tg=$('#t2WxToggle',wxHost);if(tg)tg.onclick=()=>{wxOpen=!wxOpen;if(typeof HG_LOC!=='undefined')HG_LOC.set({workedOpen:wxOpen,workedStep:wxStep});drawWx()};
      $$('[data-ws]',wxHost).forEach(b=>b.onclick=()=>{wxStep=+b.dataset.ws;if(typeof HG_LOC!=='undefined')HG_LOC.set({workedOpen:wxOpen,workedStep:wxStep});drawWx()});
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
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,tab:'practice',subtab:'차시 마무리',section:'',file:'js/02t-track-engine.js',fn:'renderAdaptivePractice',schemaIdx:idx+1,schemaTotal:queue.length,schemaId:cur.key,tyNo:cur.tyNo||0,cid:cur.cid||''});
    body.innerHTML=`<div class="ct-chk-bar"><b>${cfg.title}</b><span>남은 문항 · ${idx+1} / ${queue.length}</span></div>
      ${cur.recheck?'<div class="ct-recheck">💡 단순 실수일 수 있어요! 같은 유형의 숫자만 바꾼 문제를 한 번 더 확인해요.</div>':''}
      <div class="ct-card" id="chkHost"></div>`;

    if(typeof renderProblem!=='function')return;
    renderProblem($('#chkHost',body),prob,{mode:'final',visual:cfg.visual!==undefined?!!cfg.visual:true,rep:{lesson:lid,gen:cur.genKey,seed:cur.seed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
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
        if(cur.tyNo)scheduleTypeRev(lid,cur.tyNo,true,true);
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
    visual:(L.unit||'solid')!=='solid',
    onRescue:it=>{renderT2Steps(body,lid,spec,it.tyNo,true)},
    onPass:(host,results)=>{
      p.tday=today();p.trackDone=Math.max(Number(p.trackDone)||0,2);
      p.concept=true;p.steps=Math.max(Number(p.steps)||0,1);
      p.prac=p.prac||{solved:0,streak:0,level:1,fails:0,retry:[]};
      p.prac.solved=Math.max(Number(p.prac.solved)||0,5);
      TL.forEach(t=>{
        const res=results.find(x=>x.tyNo===t.no);
        scheduleTypeRev(lid,t.no,res&&res.status!=='first',true);
      });
      if(typeof save==='function')save();
      if(typeof award==='function')award(15,lid+':t2','한걸음 차시 마무리를 통과했어요');
      const rows=results.map(x=>`<li>${x.status==='first'?'⭐ <b>한 번에 통과</b>':'✓ <b>실수 확인 후 통과</b>'} · ${x.label}</li>`).join('');
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌿 한걸음 차시 마무리 통과!</b><br>『${L.title}』을 마쳤어요! 내일 <b>[복습 추천]</b>에서 한 번 더 맞히면 숙달 ✓ 도장을 받아요.</div>
        <ul style="margin:12px 0;padding-left:20px;line-height:1.8">${rows}</ul>
        ${lessonCompleteCrossroadsHTML(lid,2)}</div>${bonusExploreHTML(lid)}`;
      bindLessonCrossroads(host,lid,2);
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
        ${list.map((c,i)=>`<div class="cp-scard"><span class="cp-sbadge">복합 ${i+1}</span><b>${c.nm}</b><small>${c.sub}</small></div>`).join('')}
      </div>
    </div>
    <div class="next-row"><a class="btn primary" href="#${lid}-practice">3단계 실전 차시 마무리 →</a></div>
    ${bonusExploreHTML(lid)}`;
}

function renderT3Steps(body,lid,spec,initialCid){
  const list=spec.compoundList||[],TL=(typeof PTYPES==='object'&&PTYPES[lid])||[];
  const tyLabels=TL.map(t=>`유형 ${t.no} · ${t.nm}`);
  /* [T23] 복합 문제는 푸는 길이 여러 가지라 '어느 두 유형?' 고르기는 모든 차시에서 빼요(선생님 결정).
     다시 켜려면 차시 스펙에 comboPick:true. 대신 위에 접을 수 있는 '핵심 유형' 대표 문제 그림을 보여 줘요 */
  const noPick=spec.comboPick!==true;
  const WK=spec.worked?Object.values(spec.worked).filter(w=>w&&w.nm).sort((a,b)=>a.no-b.no):[];
  const keyTypesHTML=()=>WK.length?`<details class="ct-keyty"><summary>📌 이번 차시의 핵심 유형이에요 <small>(${WK.length}가지 · 눌러서 펼치기)</small></summary>
      <div class="ct-keyty-grid">${WK.map(w=>{
        const how=Array.isArray(w.steps)&&w.steps.length?w.steps.map(st=>String(st.t||'').replace(/^[①-⑳]\s*/,'')).filter(Boolean).join(' → '):'';
        return`<div class="ct-keyty-card"><b>유형 ${w.no} · ${w.nm}</b><div class="ct-keyty-fig" data-kt="${w.no}"></div><p>${w.prob||''}</p>${how?`<div class="ct-keyty-how">💡 ${how}</div>`:''}</div>`}).join('')}</div></details>`:'';
  let cid=initialCid||(list[0]&&list[0].id),seed=typeof newSeed==='function'?newSeed():11,picked=new Set(),unlocked=noPick,shownAt=Date.now();

  const draw=()=>{
    const gen=spec.genCompound&&spec.genCompound[cid];
    if(!gen){body.innerHTML='';return}
    const prob=gen(seed),wantSet=new Set(prob.combo);shownAt=Date.now();
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:lid,track:3,tab:'steps',subtab:'복합 유형 도전',section:'',file:'js/02t-track-engine.js',fn:'renderT3Steps',cid,unlocked,rapidSeed:seed,prob:unlocked?null:{lesson:lid,gen:'compound_'+cid,seed,ptype:prob.ptype,mode:'preview',step:0,totalSteps:prob.steps.length,title:prob.title}});
    body.innerHTML=`<div class="ct-card">
      <div class="ct-card-h"><h2>복합 문제 쪼개서 풀기</h2>
        <div class="ct-hit-row" style="margin:0">${list.map(x=>`<button type="button" class="chip${x.id===cid?' on':''}" data-cid="${x.id}">${x.nm}</button>`).join('')}</div>
      </div>
      ${keyTypesHTML()}
      ${noPick?'':`<div class="ct-combo">
        <b>1단계 · 이 문제는 기본 유형 중 <u>어느 두 가지</u>를 합쳐 놓았나요? (2개 고르기)</b>
        <div class="ct-combo-chips">${tyLabels.map((lb,i)=>`<button type="button" class="ct-hit${picked.has(i+1)?' sel':''}" data-ty="${i+1}" ${unlocked?'disabled':''}>${lb}</button>`).join('')}</div>
        <div id="cStep1Msg">${unlocked?`<div class="feedback ok">✓ 딱 맞혔어요! ${prob.comboWhy}</div>`:''}</div>
      </div>`}
      <div id="cProbHost"></div>
    </div>`;
    WK.forEach(w=>{
      const elKt=$(`.ct-keyty-fig[data-kt="${w.no}"]`,body);
      if(!elKt)return;
      let f=null;try{f=w.fig?w.fig((w.steps&&w.steps[0]&&w.steps[0].hl)||[],false):null}catch(e){}
      mountTrackFig(elKt,f,{interactive:false,compact:true});
    });
    const detKt=$('.ct-keyty',body);
    if(detKt&&detKt.addEventListener)detKt.addEventListener('toggle',()=>{if(detKt.open&&typeof VIEWERS!=='undefined')VIEWERS.forEach(v=>{if(detKt.contains&&detKt.contains(v.cv)){v._resize();v.dirty=true}})});

    $$('[data-cid]',body).forEach(b=>b.onclick=()=>{cid=b.dataset.cid;seed=(seed+9)%99999+1;picked=new Set();unlocked=noPick;draw()});
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
      const figRes=prob.fig&&prob.fig.svg?prob.fig.svg(true,0):prob.fig;
      $('#cProbHost',body).innerHTML=`<div class="${figRes?'ct-stage':''}">${figRes?'<div class="ct-fig" id="cPreFig"></div>':''}<div><p style="margin-top:0">${prob.title}</p><p class="muted">먼저 위에서 결합된 2개 유형을 고르면 풀이 입력이 열려요.</p></div></div>`;
      if(figRes)mountTrackFig($('#cPreFig',body),figRes,{interactive:true});
    }else if(typeof renderProblem==='function'){
      renderProblem($('#cProbHost',body),prob,{mode:'steps',visual:true,rep:{lesson:lid,gen:prob.ptype,seed},onDone:({good,box})=>{
        if(good){const lp=lesProg(lid);lp.t3Steps=(Number(lp.t3Steps)||0)+1;lp.tday=typeof today==='function'?today():'';if(typeof save==='function')save()}
        if(good&&typeof award==='function')award(8,null,'복합 문제를 단계별로 쪼개서 풀었어요');
        const row=document.createElement('div');row.className='next-row';row.style.justifyContent='flex-start';
        row.innerHTML=`<button type="button" class="btn primary" id="cMore">새 숫자로 한 번 더</button><a class="btn ghost" href="#${lid}-practice">실전 차시 마무리 →</a>`;
        box.appendChild(row);
        const cm=$('#cMore',row);if(cm)cm.onclick=()=>{seed=(seed+23)%99999+1;picked=new Set();unlocked=noPick;draw()};
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

  const L=(typeof LESSONS!=='undefined'&&LESSONS.find(x=>x.id===lid))||{title:lid};
  renderAdaptivePractice(body,lid,{
    title:`🌳 두걸음 실전 차시 마무리 (기본 ${baseNos.length} + 복합 ${cids.length})`,
    items,
    visual:(L.unit||'solid')!=='solid',
    onRescue:it=>{if(it.cid)renderT3Steps(body,lid,spec,it.cid);else renderT2Steps(body,lid,spec,it.tyNo,true)},
    onPass:(host,results)=>{
      p.tday=today();p.trackDone=3;p.concept=true;p.steps=Math.max(Number(p.steps)||0,1);
      p.prac=p.prac||{solved:0,streak:0,level:1,fails:0,retry:[]};
      p.prac.solved=Math.max(Number(p.prac.solved)||0,5);
      TL.forEach(t=>{
        const res=results.find(x=>x.tyNo===t.no);
        scheduleTypeRev(lid,t.no,res&&res.status!=='first',true);
      });
      if(typeof save==='function')save();
      if(typeof award==='function')award(15,lid+':t3','두걸음 실전 차시 마무리를 통과했어요');

      const metaOpts=spec.t3MetaOpts||['풀이 순서 잡기','조건 파악·식 세우기','계산 실수','없음'];
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌳 두걸음 실전 차시 마무리 통과!</b><br>기본 유형과 복합 유형 ${cids.length}가지를 모두 해결했어요.</div>
        <ul style="margin:12px 0;padding-left:20px;line-height:1.8">${results.map(x=>`<li>${x.status==='first'?'⭐ <b>한 번에 통과</b>':'✓ <b>재확인 통과</b>'} · ${x.label}</li>`).join('')}</ul>
        <div class="ct-meta"><b>1초 체크 · 오늘 풀면서 가장 헷갈렸던 부분은?</b>
          <div class="ct-meta-row" id="t3Meta">${metaOpts.map(m=>`<button type="button" class="chip" data-m="${m}">${m}</button>`).join('')}</div>
          <small class="muted" id="t3MetaDone">기록해 두면 다음에 꼭 맞는 연습을 고르는 데 도움이 돼요.</small>
        </div>
        ${lessonCompleteCrossroadsHTML(lid,3)}
      </div>${bonusExploreHTML(lid)}`;
      bindLessonCrossroads(host,lid,3);
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

  const doneMap=window.lessonProgressInfo(id).tabs;

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
  if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:id,track:tr,tab:activeTab,subtab:'',section:'',file:'js/02t-track-engine.js',fn:'viewTrackLesson',owlScene:0,rapidIdx:0,schemaId:'',guideId:'',tyNo:0,cid:'',inSolo:false,prob:null});
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
  if(typeof crumbs!=='undefined'&&crumbs)crumbs.innerHTML=`<span class="sep">›</span><span>복습 추천</span>`;
  const queue=buildDailyRevQueue();
  if(!queue.length){
    app.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>오늘의 [복습 추천]을 모두 마쳤어요!</b><br>유형을 익힌 다음 날 한 번 더 맞히면 숙달 ✓ 도장을 받아요. 하루에 많아야 5문제예요.</div><div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#home">처음 화면으로</a></div></div>`;
    return;
  }
  let idx=0;
  const typeOutcomes={};

  const finish=()=>{
    const d=typeof today==='function'?today():'';
    const promoted=[],missed=[];
    Object.values(typeOutcomes).forEach(o=>{
      const before=revRec(o.lid,o.tyNo);o.wasRe=!!(before&&before.re);o.wasOk=!!(before&&before.ok);
      submitDailyRevType(o.lid,o.tyNo,o.allGood,d);
      if(o.allGood)promoted.push(o);
      else missed.push(o);
    });
    if(typeof DB==='object'&&DB){DB._drevDone=d;if(typeof save==='function')save()}
    if(typeof award==='function')award(2,'drev:'+d,'오늘의 복습 추천을 완료했어요');
    app.innerHTML=`<div class="ct-card">
      <div class="feedback ok"><b>📅 오늘의 [복습 추천] 완료!</b> ${promoted.length?`${promoted.length}개 유형에 <b>숙달 ✓</b> 도장이 찍혔어요!`:''}</div>
      <ul style="margin:12px 0;padding-left:20px;line-height:1.8">
        ${promoted.map(o=>`<li>✅ <b>${o.wasRe?'다시 확인 뗐어요':'숙달 ✓'}</b> · ${o.L.no}차시 ${o.L.title} · 유형 ${o.tyNo} (${o.T.nm})</li>`).join('')}
        ${missed.map(o=>`<li>🔁 <b>${o.wasOk?'다시 확인 · 내일 한 번 더':'내일 한 번 더'}</b> · ${o.L.no}차시 ${o.L.title} · 유형 ${o.tyNo} (${o.T.nm})</li>`).join('')}
      </ul>
      ${missed.length?`<div class="ct-wx open" style="margin-top:10px"><div class="ct-wx-body" style="padding-top:12px"><b>👩‍🏫 헷갈린 유형 핵심 요약:</b> ${missed[0].T.key}</div></div>`:''}
      <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#home">처음 화면으로</a></div>
    </div>`;
  };

  const draw=()=>{
    if(idx>=queue.length){finish();return}
    const item=queue[idx],prob=GEN[item.genKey](item.seed);
    if(typeof HG_LOC!=='undefined')HG_LOC.set({lesson:item.lid,file:'js/02t-track-engine.js',fn:'viewDailyRev',section:'복습 추천',tyNo:item.tyNo,schemaIdx:idx+1,schemaTotal:queue.length});
    prob.title=`<span class="rv-from">${item.L.no}차시 ${item.L.title} · 유형 ${item.tyNo} (${item.T.nm})</span><br>`+stripTB(prob.title);
    app.innerHTML=`<div class="ct-chk-bar"><b>📅 [복습 추천] 어제 익힌 유형 다시 보기</b><span>문제 ${idx+1} / ${queue.length}</span></div><div class="ct-card" id="drevHost"></div>`;
    renderProblem($('#drevHost',app),prob,{mode:'final',visual:true,rep:{lesson:item.lid,gen:item.genKey,seed:item.seed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
      const ok=good&&wrongs===0,k=item.lid+'|'+item.tyNo;
      if(!typeOutcomes[k])typeOutcomes[k]={lid:item.lid,tyNo:item.tyNo,L:item.L,T:item.T,allGood:true};
      if(!ok)typeOutcomes[k].allGood=false;
      if(typeof logAttempt==='function')logAttempt({lesson:item.lid,kind:'review',good,wrongs,mode,gen:item.genKey,seed:item.seed,ptype:prob.ptype,stepWrongs,revealed});
      box.insertAdjacentHTML('afterbegin',`<span style="flex-basis:100%">${ok?'⭐ 한 번에 통과!':'💡 내일 같은 유형을 한 번 더 보여 드릴게요.'}</span>`);
      const nb=document.createElement('button');nb.type='button';nb.className='btn primary';
      nb.textContent=idx+1<queue.length?'다음 복습 문제 →':'결과 확인하기 →';
      nb.onclick=()=>{idx++;draw()};
      box.appendChild(nb);
    }});
  };
  draw();
};

/* ── 9. 나선형 단일 걸음 진도표 · 갈림길 · 홈 배너 · 오늘의 길잡이 · viewLesson 후킹 ── */
const TRACK_IC=['','🌱','🌿','🌳'];
const TRACK_NM={1:'🌱 첫걸음',2:'🌿 한걸음',3:'🌳 두걸음'};
const PROG_STEP_DEFS=[['concept','개념'],['steps','유형'],['practice','마무리']];
const PROG_STEP_FULL=['개념 보기','유형 익히기','차시 마무리'];
const PROG_LEGEND_HTML='<div class="ct-prog-legend" id="ctProgLegend"><span><b>진도표 보는 법</b></span><span><i class="ct-leg-dot on"></i>완료 <i class="ct-leg-dot"></i>아직 (개념 → 유형 → 마무리)</span><span class="ct-leg-sep">·</span><span>걸음 완료: <b>🌱</b> 첫걸음 · <b>🌿</b> 한걸음 · <b>🌳</b> 두걸음</span></div>';

function unitLessons(u){
  if(typeof LESSONS==='undefined'||!Array.isArray(LESSONS))return[];
  return LESSONS.filter(l=>l.ready&&!l.hidden&&(l.unit||'solid')===u).slice().sort((a,b)=>a.no-b.no);
}
function isUnitCompleteAt(u,tr,dbObj){
  const list=unitLessons(u);
  return list.length>0&&list.every(l=>window.lessonProgressInfo(l.id,dbObj,tr).isDone);
}
function nextLessonInUnit(lid,tr){
  const L=(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS))?LESSONS.find(x=>x.id===lid):null;
  const u=(L&&L.unit)||'solid',list=unitLessons(u),i=list.findIndex(x=>x.id===lid);
  return list.slice(i+1).find(x=>!window.lessonProgressInfo(x.id,DB,tr).isDone)
    ||list.find(x=>x.id!==lid&&!window.lessonProgressInfo(x.id,DB,tr).isDone)
    ||(i>=0&&list[i+1]?list[i+1]:null);
}
function nextOpenUnit(u){
  const us=typeof HOME_UNITS==='function'?HOME_UNITS():[];
  const i=us.indexOf(u);
  return us.slice(i+1).find(x=>!isUnitCompleteAt(x,unitActiveTrack(x)))
    ||us.find(x=>x!==u&&!isUnitCompleteAt(x,unitActiveTrack(x)))
    ||(i>=0&&us[i+1]?us[i+1]:null);
}
function promoteUnitTrack(u,nextTr){
  if(!(nextTr>=1&&nextTr<=3))return;
  if(typeof DB==='object'&&DB){DB._unitTrack=DB._unitTrack||{};DB._unitTrack[u]=nextTr}
  const list=unitLessons(u);
  list.forEach(l=>{const lp=lesProg(l.id);lp.track=nextTr});
  if(typeof save==='function')save();
  const I=typeof unitOf==='function'?unitOf(u):{name:u};
  if(typeof toast==='function')toast(`${TRACK_NM[nextTr]}으로 올렸어요! 『${I.name}』 1차시부터 도전해 봐요.`);
  const nx=list.find(l=>!window.lessonProgressInfo(l.id,DB,nextTr).isDone)||list[0];
  if(!nx)return;
  const tgtTab=nextTr>=2?'steps':'concept';
  if(typeof location==='object'){
    const h='#'+nx.id+'-'+tgtTab;
    if(location.hash===h)viewTrackLesson(nx.id,tgtTab);
    else location.hash=h;
  }else{
    viewTrackLesson(nx.id,tgtTab);
  }
}
function lessonCompleteCrossroadsHTML(lid,finishedTrack){
  const L=(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS)&&LESSONS.find(x=>x.id===lid))||{id:lid,no:1,title:lid,unit:'solid'};
  const u=L.unit||'solid',I=typeof unitOf==='function'?unitOf(u):{name:u},uList=unitLessons(u);
  const unitDone=isUnitCompleteAt(u,finishedTrack);
  const nextTr=finishedTrack<3?finishedTrack+1:0;
  const nxtU=nextOpenUnit(u);
  if(unitDone){
    return`<div class="ct-crossroads unit-done">
      <div class="ct-cr-txt">
        <b>🏆 『${I.name}』 ${TRACK_NM[finishedTrack]} 완주! (${uList.length}/${uList.length}차시 완료)</b>
        <span>${nextTr?'이번 단원 학습 내용이 쉬웠나요? 쉬웠다면 다음 단계에 도전해 봐요!':'가장 높은 단계인 🌳 두걸음까지 모두 마쳤어요! 정말 대단해요.'}</span>
      </div>
      <div class="next-row" style="justify-content:flex-start;margin-top:10px">
        ${nextTr?`<button type="button" class="btn primary" id="crUpUnit">쉬웠어요 · ${TRACK_NM[nextTr]}으로 올라가기 →</button>`:''}
        ${nxtU?`<a class="btn ${nextTr?'ghost':'primary'}" href="#unit-${nxtU}">다음 단원 · ${unitOf(nxtU).name} 가기 →</a>`:''}
        <a class="btn ghost" href="#home">처음 화면으로</a>
      </div>
    </div>`;
  }
  const nxtL=nextLessonInUnit(lid,finishedTrack);
  return`<div class="next-row" style="justify-content:flex-start">
      ${nxtL?`<button type="button" class="btn primary" id="crNextLesson">다음 차시 · ${nxtL.no}차시 ${nxtL.title} (${TRACK_NM[finishedTrack]}) →</button>`:''}
      <a class="btn ghost" href="#home">처음 화면으로</a>
    </div>
    ${nextTr?`<div class="ct-crossroads">
      <div class="ct-cr-txt">
        <b>이번 학습 내용이 쉬웠나요?</b>
        <span>쉬웠다면 다음 단계에 도전해 봐요! (안 해도 ${L.no}차시는 이미 완료예요)</span>
      </div>
      <button type="button" class="btn ct-cr-up t${nextTr}" id="crUpLesson">${TRACK_NM[nextTr]} 도전해 보기 →</button>
    </div>`:''}`;
}
function bindLessonCrossroads(host,lid,finishedTrack){
  if(!host)return;
  const L=(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS)&&LESSONS.find(x=>x.id===lid))||{id:lid,no:1,title:lid,unit:'solid'};
  const u=L.unit||'solid',nextTr=finishedTrack<3?finishedTrack+1:0;
  const uBtn=$('#crUpUnit',host);
  if(uBtn&&nextTr)uBtn.onclick=()=>promoteUnitTrack(u,nextTr);
  const nBtn=$('#crNextLesson',host);
  if(nBtn){
    const nxtL=nextLessonInUnit(lid,finishedTrack);
    if(nxtL)nBtn.onclick=()=>{
      setTrack(nxtL.id,finishedTrack);
      const h='#'+nxtL.id;
      if(typeof location==='object'){if(location.hash===h)viewTrackLesson(nxtL.id);else location.hash=h}
      else viewTrackLesson(nxtL.id);
    };
  }
  const lBtn=$('#crUpLesson',host);
  if(lBtn&&nextTr){
    lBtn.onclick=()=>{
      setTrack(lid,nextTr);
      const h='#'+lid+'-steps';
      if(typeof location==='object'){if(location.hash===h)viewTrackLesson(lid,'steps');else location.hash=h}
      else viewTrackLesson(lid,'steps');
    };
  }
}

function homeStepRowHTML(info){
  return`<span class="ct-pl-steps">${PROG_STEP_DEFS.map(([k,lb],i)=>{
    const on=info.tabs[k];
    const part=!on&&k==='steps'&&info.t1StepsPartial;
    return`<span class="ct-ps${on?' on':part?' part':''}" title="${PROG_STEP_FULL[i]} ${on?'체크 완료':part?'진행 중':'아직'}"><b>${on?'✓':part?'·':'○'}</b>${lb}${part?' 진행':''}</span>`;
  }).join('')}${info.mastered>0?`<span class="ct-ps-stamp" title="익힌 다음 날 [복습 추천]에서 맞힌 숙달 도장">숙달 ${info.mastered}/${info.totalTypes}</span>`:''}</span>`;
}
function homeLessonStateBadgeHTML(info){
  if(info.isDone){
    return`<span class="ct-pl-right"><span class="ct-pl-badge st-done">✓ 완료</span>${info.bonusTrack?`<span class="ct-pl-bonus t${info.bonusTrack}" title="${TRACK_NM[info.bonusTrack]} 보너스 완료">${TRACK_IC[info.bonusTrack]}+</span>`:''}</span>`;
  }
  if(info.started){
    return`<span class="ct-pl-right"><span class="ct-pl-badge st-prog">진행 중</span></span>`;
  }
  return`<span class="ct-pl-right"><span class="ct-pl-badge st-todo">시작 전</span></span>`;
}
function unitCrossroadsHTML(u,uTr,d,len,isBanner){
  if(!(len>0&&d===len))return'';
  const nextTr=uTr<3?uTr+1:0;
  const nxtU=nextOpenUnit(u);
  const nxtUInfo=nxtU&&typeof unitOf==='function'?unitOf(nxtU):null;
  return`<div class="uc-crossroads${isBanner?' unit-banner':''}">
    <div class="uc-cr-h">${nextTr?`🏆 ${TRACK_NM[uTr]} 완주! 이번 단원이 쉬웠나요?`:'🏆 🌳 두걸음까지 모두 완주했어요!'}</div>
    ${nextTr?`<p class="uc-cr-sub">쉬웠다면 다음 단계에 도전해 봐요!</p>`:`<p class="uc-cr-sub">단원의 모든 단계를 끝냈어요. 복습이나 다른 단원으로 이어가도 좋아요.</p>`}
    <div class="uc-cr-acts">
      ${nextTr?`<button type="button" class="btn primary uc-cr-up" data-u="${u}" data-next="${nextTr}">쉬웠어요 · ${TRACK_NM[nextTr]} 도전 →</button>`:''}
      ${nxtUInfo?`<a class="btn ${nextTr?'ghost':'primary'}" href="#unit-${nxtU}">다음 단원 · ${nxtUInfo.name} →</a>`:(!isBanner?`<a class="btn ${nextTr?'ghost':'primary'}" href="#unit-${u}">단원 다시 보기 →</a>`:'')}
    </div>
  </div>`;
}

function lessonProgBadgesHTML(id){
  const info=window.lessonProgressInfo(id);
  const trHtml=`<span class="ct-pl-tracks" aria-label="완료한 걸음">${[1,2,3].map(k=>{
    const done=info.trackDone>=k,cur=!done&&info.track===k;
    return`<span class="ct-tb-mini${done?' on t'+k:cur?' cur t'+k:''}" title="${TRACK_NM[k]} ${done?'완료':cur?'진행 중':'아직'}">${TRACK_IC[k]}</span>`;
  }).join('')}</span>`;
  const stHtml=`<span class="ct-pl-steps">${PROG_STEP_DEFS.map(([k,lb],i)=>{
    const on=info.tabs[k];
    return`<span class="ct-ps${on?' on':''}" title="${PROG_STEP_FULL[i]} ${on?'완료':'아직'}"><i></i>${lb}</span>`;
  }).join('')}${info.totalTypes?`<span class="ct-ps-stamp" title="숙달 ✓ 유형 수 / 이 차시 유형 수">숙달 ${info.mastered}/${info.totalTypes}</span>`:''}${info.recheck?`<span class="ct-ps-stamp re" title="숙달했다가 최근에 놓친 유형">다시 확인 ${info.recheck}</span>`:''}</span>`;
  return{info,trHtml,stHtml};
}

if(typeof pipsOf==='function'){
  pipsOf=function(id){
    const info=window.lessonProgressInfo(id);
    return PROG_STEP_DEFS.map(([k],i)=>`<span class="pip ${info.tabs[k]?'on':''}" title="${PROG_STEP_FULL[i]}"></span>`).join('')+(info.trackDone>0?`<span class="ct-pip-tr" title="${TRACK_NM[info.trackDone]} 완료">${TRACK_IC[info.trackDone]}</span>`:'');
  };
}

if(typeof unitCardHTML==='function'){
  unitCardHTML=function(u){
    const I=unitOf(u),L=unitLessons(u),uTr=unitActiveTrack(u),defTr=studentDefaultTrack();
    const infos=L.map(l=>({l,info:window.lessonProgressInfo(l.id,DB,uTr)}));
    const d=infos.filter(x=>x.info.isDone).length;
    const inProg=infos.filter(x=>!x.info.isDone&&x.info.started).length;
    const stepSum=infos.reduce((a,x)=>a+x.info.doneSteps,0),totSteps=L.length*3;
    const pct=totSteps?Math.round(stepSum/totSteps*100):0;
    const nx=(DB._last&&L.find(l=>l.id===DB._last.id&&!window.lessonProgressInfo(l.id,DB,uTr).isDone))||L.find(l=>!window.lessonProgressInfo(l.id,DB,uTr).isDone);
    const anyStart=infos.some(x=>x.info.started);
    const goHref=nx?`#${nx.id}`:`#unit-${u}`;
    const goTxt=!anyStart?`${TRACK_NM[uTr]} 시작하기`:nx?`이어서 · ${nx.no}차시 ${nx.title}`:'모두 마쳤어요 · 다시 보기';
    const unitDone=L.length>0&&d===L.length;
    return`<div class="card unit ready ucard" data-u="${u}">
      <a class="uc-h" href="#unit-${u}"><span class="uc-ch">${ROMAN_OF[I.ch]||''} ${I.ch}</span><b>${I.name}</b>${uTr!==defTr?`<span class="uc-tr t${uTr}" title="갈림길에서 이 단원만 올린 걸음이에요">이 단원 ${TRACK_NM[uTr]}</span>`:''}</a>
      <div class="uc-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
      <div class="uc-stat-row"><small class="uc-n">${unitDone?`${TRACK_NM[uTr]} 모든 차시를 마쳤어요!`:`${inProg?`진행 중 ${inProg}차시 · `:''}전체 ${pct}%`}</small><span class="uc-stat${unitDone?' all':''}">완료 ${d}/${L.length}차시</span></div>
      <ul class="uc-ls ct-prog-ls">${infos.map(({l,info})=>{
        const cls=info.isDone?'is-done':info.started?'is-prog':'';
        const showSteps=!info.isDone&&info.started;
        const doneStamp=info.isDone&&info.mastered>0?`<span class="ct-pl-steps"><span class="ct-ps-stamp">숙달 ${info.mastered}/${info.totalTypes}</span></span>`:'';
        return`<li class="${cls}"><a href="#${l.id}" class="ct-pl-row">
          <div class="ct-pl-top"><span class="n">${info.isDone?'✓':l.no}</span><span class="t">${l.title}</span>${homeLessonStateBadgeHTML(info)}</div>
          ${showSteps?homeStepRowHTML(info):doneStamp}
        </a></li>`;
      }).join('')}</ul>
      ${unitDone?unitCrossroadsHTML(u,uTr,d,L.length,false):`<a class="btn ${nx?'primary':''} uc-go" href="${goHref}">${goTxt} →</a>`}
    </div>`;
  };
}

if(typeof viewUnit==='function'){
  viewUnit=function(u=UNIT_ID){
    const I=unitOf(u),uTr=unitActiveTrack(u);
    const L=LESSONS.filter(l=>!l.hidden&&(l.unit||'solid')===u).slice().sort((a,b)=>a.no-b.no);
    const readyL=L.filter(l=>l.ready);
    const doneCnt=readyL.filter(l=>window.lessonProgressInfo(l.id,DB,uTr).isDone).length;
    crumbs.innerHTML=`<span class="sep">›</span><span>${I.name}</span>`;
    app.innerHTML=`<div class="unit-head ct-unit-head"><div><h1>${I.name}</h1><p>${I.sub}</p></div>
      <div class="ct-unit-right"><span class="ct-my-track t${uTr}">진행 걸음 · <b>${TRACK_NM[uTr]}</b></span>
      <div class="legend"><span>${TRACK_NM[uTr]} 기준으로 <b>개념 · 유형 · 마무리</b> 3단계를 체크해요. (유형·마무리를 풀면 앞 단계도 자동 체크!)</span></div></div></div>
    ${unitCrossroadsHTML(u,uTr,doneCnt,readyL.length,true)}
    <div class="lessons">${L.map(l=>{
      if(!l.ready)return`<div class="card lesson soon"><span class="n">${l.no}</span><span><b>${l.title}</b><small>${l.sub}</small><small class="tbref">교과서 ${l.tb}</small></span><span class="soon-tag">준비 중</span></div>`;
      const info=window.lessonProgressInfo(l.id,DB,uTr);
      return`<a class="card lesson ready${info.isDone?' is-done':info.started?' is-prog':''}" href="#${l.id}">
        <span class="n">${info.isDone?'✓':l.no}</span>
        <span><b>${l.title}</b><small>${l.sub}</small><small class="tbref">교과서 ${l.tb}</small></span>
        <span class="ct-unit-prog">${homeLessonStateBadgeHTML(info)}${info.isDone?(info.mastered>0?`<span class="ct-pl-steps"><span class="ct-ps-stamp">숙달 ${info.mastered}/${info.totalTypes}</span></span>`:''):info.started?homeStepRowHTML(info):''}</span>
      </a>`;
    }).join('')}</div>`;
    $$('.uc-cr-up',app).forEach(b=>b.onclick=()=>promoteUnitTrack(b.dataset.u,+b.dataset.next));
  };
}

if(typeof viewMe==='function'){
  const prevMe=viewMe;
  viewMe=function(){
    prevMe.apply(this,arguments);
    if(typeof app==='undefined'||!app)return;
    const h2=Array.from(app.querySelectorAll('.card.panel h2')).find(el=>el.textContent.trim()==='차시별 진행');
    const panel=h2&&h2.closest?h2.closest('.card.panel'):null;
    const listBox=panel&&panel.querySelector('.lessons');
    if(!panel||!listBox)return;
    const ordered=guideLessonOrder();
    const doneCnt=ordered.filter(l=>window.lessonProgressInfo(l.id,DB,unitActiveTrack(l.unit||'solid')).isDone).length;
    h2.innerHTML=`교과서 한 걸음 진도표 <small class="muted" style="font-size:15px;font-weight:500">(완료 ${doneCnt}/${ordered.length}차시)</small>`;
    if(!$('#ctProgLegend',panel))listBox.insertAdjacentHTML('beforebegin',PROG_LEGEND_HTML);
    listBox.innerHTML=ordered.map(l=>{
      const I=typeof unitOf==='function'?unitOf(l.unit||'solid'):{ch:''};
      const b=lessonProgBadgesHTML(l.id);
      return`<a class="card lesson ready me-prog-row${b.info.isDone?' is-done':b.info.started?' is-prog':''}" href="#${l.id}">
        <span class="n">${b.info.isDone?'✓':l.no}</span>
        <span><small class="ct-me-unit">${ROMAN_OF[I.ch]||''} ${I.ch}</small><b>${l.title}</b>${b.stHtml}</span>
        <span class="ct-unit-prog">${b.trHtml}</span>
      </a>`;
    }).join('');
  };
}

if(typeof viewHome==='function'){
  const prevHome=viewHome;
  viewHome=function(){
    prevHome.apply(this,arguments);
    if(typeof app!=='undefined'&&app){
      const RL=typeof LESSONS!=='undefined'?LESSONS.filter(l=>l.ready&&!l.hidden):[];
      const doneCnt=RL.filter(l=>window.lessonProgressInfo(l.id,DB,unitActiveTrack(l.unit||'solid')).isDone).length;
      const defTr=studentDefaultTrack();
      const hasGoal=typeof myGoal==='function'&&!!myGoal();
      if(typeof app.querySelectorAll==='function'){
        app.querySelectorAll('.sec-title').forEach(st=>{
          const h=st.querySelector('h2');
          if(h&&h.textContent==='교과서 한 걸음'){
            st.classList.add('ct-sec-head');
            const uCnt=typeof HOME_UNITS==='function'?HOME_UNITS().length:0;
            st.innerHTML=`<h2>교과서 한 걸음</h2><span class="ct-sec-sub">${uCnt}개 단원 · 완료 <b>${doneCnt}</b>/${RL.length}차시</span><a class="ct-my-track t${defTr}" href="${hasGoal?'#me':'#goalCard'}" title="${hasGoal?'내 기록에서 걸음을 바꿀 수 있어요':'나의 길을 골라 보세요'}">${hasGoal?'내 걸음':'기본 걸음'} · <b>${TRACK_NM[defTr]}</b></a>`;
          }
        });
        $$('.uc-cr-up',app).forEach(b=>b.onclick=()=>promoteUnitTrack(b.dataset.u,+b.dataset.next));
        const mt=$('.ct-my-track[href="#goalCard"]',app);
        if(mt)mt.onclick=e=>{const g=$('#goalCard',app);if(g){e.preventDefault();g.scrollIntoView({behavior:'smooth',block:'center'})}};
      }
      const guide=$('#guide',app);
      const t=typeof today==='function'?today():'';
      const due=dueTypeList(t);
      if(guide&&due.length&&(!DB|| (DB._drevDone!==t&&DB._drevSkip!==t))){
        const q=buildDailyRevQueue(t);
        const card=el(`<div class="ct-drev-card" id="dailyRevBanner">
          <div class="ct-drev-txt"><b>📅 [복습 추천] 어제 익힌 유형 ${q.length}문제 · 2분</b>
            <small>${due.slice(0,2).map(d=>`${d.L.title}(유형 ${d.tyNo})`).join(', ')}${due.length>2?` 외 ${due.length-2}개`:''} · 한 번에 맞히면 숙달 ✓ 도장!</small></div>
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
   끝남 = 해당 단원의 활성 걸음(🌱·🌿·🌳) 차시 마무리 통과. 다음에 할 탭도 걸음에 맞춰 알려 줘요. */
function guideLessonOrder(){
  const chi=l=>{const I=typeof unitOf==='function'?unitOf(l.unit||'solid'):null;return typeof UNITS!=='undefined'&&I?UNITS.findIndex(z=>z[0]===I.ch):0};
  return LESSONS.filter(l=>l.ready&&!l.hidden).slice().sort((a,b)=>chi(a)-chi(b)||(a.no-b.no));
}
function guideLessonDone(l){return SPECS[l.id]?window.lessonProgressInfo(l.id,DB,unitActiveTrack(l.unit||'solid')).isDone:(typeof lessonDone==='function'&&lessonDone(l.id)>=(typeof LESSON_REQ==='number'?LESSON_REQ:3))}
function guideLessonStep(){
  const L=guideLessonOrder();if(!L.length)return null;
  const last=DB._last&&L.find(l=>l.id===DB._last.id);
  const cur=(last&&!guideLessonDone(last))?last:L.find(l=>!guideLessonDone(l));
  const t=typeof today==='function'?today():'';
  if(!cur)return{les:true,done:L.some(l=>OBJ(DB[l.id]).tday===t),more:true,t:'열린 차시를 모두 마쳤어요',s:'두걸음이나 복습 추천으로 실력을 다져요',href:'#'+L[L.length-1].id};
  const unitNm=typeof unitOf==='function'?unitOf(cur.unit||'solid').name:'';
  if(!SPECS[cur.id])return null;
  const uTr=unitActiveTrack(cur.unit||'solid');
  const p=lesProg(cur.id),info=window.lessonProgressInfo(cur.id,DB,uTr),tr=info.track,spec=SPECS[cur.id];
  const order=tr===1?(spec.kind==='concept'?['steps','concept','practice']:['concept','steps','practice']):['steps','practice'];
  let tab=order.find(k=>!info.tabs[k])||'practice';
  /* [T38] 개념형 🌱: A를 마쳤고 B가 잠겨 있으면(부엉 쌤 전) 개념 보기부터 */
  if(tab==='steps'&&info.t1SchemaDone&&t1GuideLocked(cur.id,spec))tab='concept';
  const stepLabel=tr===1?(info.t1SchemaDone&&info.t1GuideTotal>0?'유형 익히기 · 따라 풀기':'유형 익히기 · 구별하기'):tr===2?'유형 익히기 · 대표 예제':'유형 익히기 · 복합 문제';
  const TAB={concept:'개념 보기 · 부엉 쌤 그림극',steps:stepLabel,practice:'차시 마무리'};
  return{les:true,done:p.tday===t,more:true,t:`${cur.no}차시 ${cur.title}`,s:`${unitNm} · ${TRACK_NM[tr]} · ${last===cur&&info.started?'이어서 ':''}${TAB[tab]}`,href:`#${cur.id}-${tab}`};
}
if(typeof guideSteps==='function'){
  const prevGS=guideSteps;
  guideSteps=function(){
    const S=prevGS.apply(this,arguments);
    if(Array.isArray(S)){const li=S.findIndex(x=>/^\d+차시 |^열린 차시를/.test(x.t)),G=guideLessonStep();if(li>=0&&G)S[li]=G}
    /* [T38] 막힌 계산(DB._needCalc)은 05-calc.js 오늘의 계산 줄의 '집중할 칸'으로 들어가요(T36). 예전 '기초 연산 · …' 줄 바꾸기는 뺐어요 */
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

/* [T21] 지금 주소와 같은 탭 링크(예: 차시 마무리에서 '쪼개서 연습하기'로 왔다가 '실전 차시 마무리 →')를 누르면
   주소가 안 바뀌어 아무 일도 안 일어났어요. 같은 주소면 그 탭을 다시 그려요 */
if(typeof document==='object'&&document&&typeof document.addEventListener==='function'){
  document.addEventListener('click',e=>{
    const a=e.target&&e.target.closest?e.target.closest('a[href^="#"]'):null;if(!a)return;
    const h=a.getAttribute('href'),m=/^#([a-z]+)-(concept|steps|practice)$/.exec(h||'');
    if(!m||h!==location.hash||!SPECS[m[1]])return;
    e.preventDefault();viewTrackLesson(m[1],m[2]);if(typeof scrollTo==='function')scrollTo(0,0);
  });
}

window.HG_TRACKS={
  specs:SPECS,
  register(lid,spec){SPECS[lid]=spec},
  viewTrackLesson,
  mountOwlShow,
  mountTrackFig,
  scheduleTypeRev,
  dueTypeList,
  buildDailyRevQueue,
  submitDailyRevType,
  typeStampState,
  stampOf,
  stampCount,
  markRecheck,
  lessonProgressInfo:window.lessonProgressInfo,
  unitActiveTrack,
  promoteUnitTrack,
  lessonCompleteCrossroadsHTML,
  t1GuideLocked
};
})();