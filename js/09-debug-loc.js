/* ───────── 테스트 계정(1-20-50) 전용: 현재 화면 · 코드 위치 복사 ───────── */
(()=>{
'use strict';

const SPEC_FILE={cent:'js/02t-tracks-cent.js',arc:'js/02t-tracks-circle.js',sector:'js/02t-tracks-circle.js',poly:'js/02t-tracks-solid.js',regular:'js/02t-tracks-solid.js',rotation:'js/02t-tracks-solid.js',rotprop:'js/02t-tracks-solid.js',area:'js/02t-tracks-solid.js',area2:'js/02t-tracks-solid.js',volume:'js/02t-tracks-solid.js',conearea:'js/02t-tracks-solid.js',conearea2:'js/02t-tracks-solid.js',cone:'js/02t-tracks-solid.js',coord:'js/02t-tracks-graph.js',graph:'js/02t-tracks-graph.js',prop:'js/02t-tracks-graph.js',propg:'js/02t-tracks-graph.js',inv:'js/02t-tracks-graph.js',invg:'js/02t-tracks-graph.js'};
const UNIT_FILE={arc:'js/06c-unit-circle.js',cent:'js/06c-unit-circle.js',sector:'js/06c-unit-circle.js',poly:'js/02-unit-solid.js',regular:'js/02-unit-solid.js',area:'js/02v-solid-vol.js',area2:'js/02v-solid-vol.js',volume:'js/02v-solid-vol.js',rotation:'js/02r-solid-rot.js',rotprop:'js/02r-solid-rot.js',conearea:'js/02v-solid-vol.js',conearea2:'js/02v-solid-vol.js',cone:'js/02v-solid-vol.js',coord:'js/06d-unit-graph.js',graph:'js/06d-unit-graph.js',prop:'js/06d-unit-graph.js',propg:'js/06d-unit-graph.js',inv:'js/06d-unit-graph.js',invg:'js/06d-unit-graph.js',sign:'js/06-unit-int.js',numline:'js/06-unit-int.js',abs:'js/06-unit-int.js',iadd:'js/06-unit-int.js',isub:'js/06-unit-int.js'};
const TR_NM={1:'🌱 첫걸음',2:'🌿 한걸음',3:'🌳 두걸음'};
const TAB_NM={concept:'개념 보기',steps:'유형 익히기',practice:'차시 마무리',explore:'더 알아보기'};

const strip=s=>String(s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const resolveGen=(gen,lid)=>{
  const m=/^ty_([a-z]+)_(\d+)$/.exec(gen||'');
  if(m&&typeof PTYPES==='object'&&PTYPES[m[1]]){const T=PTYPES[m[1]].find(x=>x.no===+m[2]);if(T&&T.src&&T.src[0])return`${gen} → GEN.${T.src[0]}`}
  if(gen&&/^compound_/.test(gen)&&lid)return`${SPEC_FILE[lid]||'js/02t-tracks-*.js'} → genCompound.${gen.slice(9)}`;
  return gen?`GEN.${gen}`:'';
};

let S={hash:'home',file:'js/07-print-omr-boot.js',fn:'route',prob:null};

const isTestAccount=()=>!!(typeof isStudent==='function'&&isStudent()&&((+AUTH.grade===1&&+AUTH.klass===20&&+AUTH.num===50)||AUTH.sid==='1-20-50'));

const onRoute=h=>{
  h=String(h||'').replace(/^#/,'');
  let file='js/02-unit-solid.js',fn='viewHome';
  if(!h||h==='home'){file='js/02-unit-solid.js';fn='viewHome'}
  else if(/^unit-/.test(h)){file='js/02-unit-solid.js';fn='viewUnit'}
  else if(h==='me'){file='js/02-unit-solid.js';fn='viewMe'}
  else if(h==='login'){file='js/02-unit-solid.js';fn='viewLogin'}
  else if(h==='shop'){file='js/08-deco.js';fn='viewShop'}
  else if(h==='dailyrev'){file='js/02t-track-engine.js';fn='viewDailyRev'}
  else if(h==='review'){file='js/02-unit-solid.js';fn='viewReview'}
  else if(h==='calc'||/^calc-/.test(h)){file='js/05-calc.js';fn=h==='calc'?'viewCalc':'viewCalcTopic'}
  else if(h==='drill'){file='js/05-calc.js';fn='viewDrill'}
  else if(/^(baseball|bb-)/.test(h)){file='js/04-games.js';fn='baseball'}
  else if(/^(sea|sea-)/.test(h)){file='js/04s-sea.js';fn='sea'}
  else if(/^(boss|bossview-)/.test(h)){file='js/04-games.js';fn='boss'}
  else if(h==='teacher'){file='js/03-teacher.js';fn='viewTeacher'}
  else if(/^(print|scan|howto)/.test(h)){file='js/07-print-omr-boot.js';fn=h.startsWith('print')?'viewPrint':h==='scan'?'viewScan':'viewHowto'}
  else{file='js/02t-track-engine.js';fn='viewLesson'}
  S={hash:h||'home',file,fn,prob:null};
};

const set=p=>{if(p&&typeof p==='object')Object.assign(S,p)};
const setProb=p=>{S.prob=p||null};

/* [T29] 화면에 보이는 문제 글 · 학생이 고른 답 (빠른 구별·구별 체크처럼 renderProblem을 쓰지 않는 화면용) */
const domTxt=sel=>{try{const r=typeof document==='object'&&document.querySelector?document.querySelector('#app')||document:null;const n=r&&r.querySelector?r.querySelector(sel):null;const t=n&&(n.innerText||n.textContent);return typeof t==='string'?strip(t):''}catch(e){return''}};
const domPick=()=>{try{const r=typeof document==='object'&&document.querySelector?document.querySelector('#app'):null;if(!r||!r.querySelectorAll)return'';const nm=sel=>Array.from(r.querySelectorAll(sel)||[]).map(b=>strip(b.dataset&&b.dataset.v||b.textContent)).filter(Boolean);const bad=nm('.ct-hit.bad'),ok=nm('.ct-hit.ok');if(!bad.length&&!ok.length)return'';return bad.length?`${bad.join(', ')} (틀림)${ok.length?` · 정답 표시: ${ok.join(', ')}`:''}`:`${ok.join(', ')} (맞힘)`}catch(e){return''}};
const pad2=n=>String(n).padStart(2,'0');
const nowTxt=()=>{const d=new Date();return`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`};

/* opt.compact: 학생 신고용(머리줄·계정 줄 없이 400자 안쪽) · opt.blank: 선생님이 채울 '본 것/바꿀 점' 빈 줄 */
const format=(opt)=>{
  opt=opt||{};
  const lines=opt.compact?[]:['[한 걸음 수학 위치·코드 보고]'];
  const h=(typeof location==='object'&&location.hash)?location.hash:'#'+(S.hash||'home');
  const crRaw=(typeof crumbs!=='undefined'&&crumbs)?strip(crumbs.textContent):'';
  const acct=typeof isStudent==='function'&&isStudent()?`${AUTH.grade}-${AUTH.klass}-${AUTH.num}`:'비로그인';
  lines.push(opt.compact?`• 주소: ${h}`:`• 계정/주소: ${acct} · ${h}`);
  const L=S.lesson&&typeof LESSONS!=='undefined'?LESSONS.find(x=>x.id===S.lesson):null;
  /* [T29] 화면 경로: 차시 제목 앞에 'N차시'를 붙이고, 같은 이름이 연달아 나오면 한 번만 */
  let pathParts=crRaw.split('›').map(x=>x.trim()).filter(Boolean);
  if(L){const i=pathParts.lastIndexOf(L.title);if(i>=0)pathParts[i]=`${L.no}차시 ${L.title}`;else if(!pathParts.length)pathParts.push(`${L.no}차시 ${L.title}`)}
  if(S.track)pathParts.push(TR_NM[S.track]||`트랙 ${S.track}`);
  if(S.tab)pathParts.push(TAB_NM[S.tab]||S.tab);
  if(S.section)pathParts.push(S.section);
  if(S.subtab)pathParts.push(S.subtab);
  pathParts=pathParts.filter((x,i,a)=>i===0||x!==a[i-1]);
  if(pathParts.length)lines.push(`• 화면 경로: ${pathParts.join(' › ')}`);
  const specFile=S.lesson&&SPEC_FILE[S.lesson];
  const codeRefs=[`${S.file||'js/02t-track-engine.js'} → ${S.fn||'-'}()`];
  if(specFile&&specFile!==S.file)codeRefs.push(`규격: ${specFile}`);
  lines.push(`• 실행 코드: ${codeRefs.join(' | ')}`);
  const det=[];
  if(S.owlScene)det.push(`부엉 쌤 극장 장면 ${S.owlScene}/${S.owlTotal||'?'} (박자 ${S.owlBeat||1}/${S.owlBeatTotal||1})${S.owlCap?` · "${S.owlCap}"`:''}`);
  if(S.rapidIdx)det.push(`빠른 구별 ${S.rapidIdx}/${S.rapidTotal||'?'} (kind=${S.rapidKind}, seed=${S.rapidSeed})`);
  if(S.schemaId&&!S.owlScene&&!S.rapidIdx){const rm=/^r(\d+)_(\d+)$/.exec(S.schemaId);det.push(`구별/체크 ${S.schemaIdx||1}/${S.schemaTotal||'?'} (id=${S.schemaId}${rm?` → 빠른 구별 kind=${rm[1]}`:''}${S.rapidSeed?', seed='+S.rapidSeed:''})`)}
  if(S.guideId)det.push(`따라 풀기 id=${S.guideId} (유형 ${S.tyNo}) · ${S.inSolo?'혼자 확인 문제':`단계 ${Number(S.guideStep)+1}/4`}`);
  else if(S.tyNo&&S.tab==='steps'&&S.track===2)det.push(`한걸음 유형 ${S.tyNo}${S.workedOpen?` (대표 예제 펼침 · 단계 ${Number(S.workedStep)+1})`:' (대표 예제 접힘)'}`);
  if(S.cid)det.push(`두걸음 복합 ${S.cid} (${S.unlocked?'단계 풀이 열림':'유형 2개 고르기 전'}, seed=${S.rapidSeed||'-'})`);
  if(S.calcTopic)det.push(`기초 연산 주제: ${S.calcTopic}`);
  if(det.length)lines.push(`• 세부 위치: ${det.join(' · ')}`);
  let qTxt='';
  if(S.prob){
    const pr=S.prob,uf=UNIT_FILE[pr.lesson||S.lesson]||'';
    const gTxt=resolveGen(pr.gen,pr.lesson||S.lesson);
    const stepTxt=pr.totalSteps?`${pr.step+1}/${pr.totalSteps}${pr.stepTag?` (${pr.stepTag})`:''}`:`${pr.step+1}`;
    lines.push(`• 문제 코드: ${uf?uf+' → ':''}${gTxt||'-'} | ptype=${pr.ptype||'-'} | seed=${pr.seed??'-'} | mode=${pr.mode||'-'} | 단계=${stepTxt}`);
    if(pr.title)qTxt=strip(pr.title);
  }
  if(!qTxt&&(S.schemaId||S.rapidIdx))qTxt=domTxt('.ct-schema-q');
  if(qTxt)lines.push(`• 문제 글: ${qTxt.slice(0,85)}`);
  const pick=(S.schemaId||S.rapidIdx)?domPick():'';
  if(pick)lines.push(`• 고른 답: ${pick}`);
  if(!opt.compact){
    const w=typeof innerWidth==='number'?innerWidth:0;
    lines.push(`• 화면·시각: ${w?`폭 ${w}px${w<=760?'(휴대폰)':''} · `:''}${nowTxt()}`);
  }
  if(opt.blank)lines.push('• 본 것: ','• 바꿀 점: ');
  return lines.join('\n');
};

const HG_LOC={isTestAccount,onRoute,set,setProb,format,get:()=>Object.assign({},S)};
window.HG_LOC=HG_LOC;

function ensureStyle(){
  if(typeof document!=='object'||!document||document.getElementById('dbgLocStyle'))return;
  const st=document.createElement('style');
  st.id='dbgLocStyle';
  st.textContent=`.dbgloc-btn{position:fixed;left:16px;bottom:16px;z-index:56;background:#1d2640;color:#fff;border:2px solid #93b4f5;border-radius:999px;padding:8px 14px;font:inherit;font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(29,38,64,.25);cursor:pointer;transition:background .15s,border-color .15s,transform .1s}.dbgloc-btn:hover{background:#283457;transform:translateY(-1px)}.dbgloc-btn.copied{background:#2b7a4b;border-color:#86efac}.dbgloc-btn[hidden],body.pw-mode #dbgLocBtn{display:none!important}@media (max-width:760px){.dbgloc-btn{left:12px;bottom:12px;font-size:13px;padding:7px 12px}}@media print{#dbgLocBtn{display:none!important}}`;
  const parent=document.head||document.body||document.documentElement;
  if(parent&&parent.appendChild)parent.appendChild(st);
}

function dbgLocBtn(){
  const h=typeof location==='object'?(location.hash||'').replace('#',''):'';
  const show=isTestAccount()&&!/^(teacher|bossview|print)/.test(h);
  let b=$('#dbgLocBtn');
  if(!show){if(b){b.hidden=true;if(b.parentNode&&b.remove)b.remove()}return}
  ensureStyle();
  if(!b){
    b=el('<button type="button" id="dbgLocBtn" class="dbgloc-btn" aria-label="현재 화면 코드 위치 복사"><span class="di">📍</span><span class="dt">위치 복사</span></button>');
    document.body.appendChild(b);
    b.onclick=async()=>{
      const txt=HG_LOC.format({blank:true});
      let ok=false;
      try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(txt);ok=true}}catch(e){}
      if(!ok){
        try{const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove()}catch(e){}
      }
      if(ok){
        b.classList.add('copied');const dt=$('.dt',b);if(dt)dt.textContent='복사됨 ✓';
        toast('현재 위치·코드를 복사했어요! 그대로 붙여넣어 알려 주세요.');
        setTimeout(()=>{b.classList.remove('copied');if(dt)dt.textContent='위치 복사'},1500);
      }else toast('복사에 실패했어요. 콘솔(HG_LOC.format())을 확인해 주세요.');
    };
  }
  b.hidden=false;
}
window.dbgLocBtn=dbgLocBtn;

if(typeof renderProblem==='function'){
  const prevRP=renderProblem;
  window.renderProblem=function(host,prob,opt){
    const o=opt?Object.assign({},opt):{};
    if(!o.worked&&prob&&Array.isArray(prob.steps)){
      const mode=(o.mode==='final'&&prob.steps.length>1)?'final':'steps';
      const steps=mode==='final'?[prob.final||Object.assign({},prob.steps[prob.steps.length-1],{q:prob.finalQ||(prob.steps[prob.steps.length-1]&&prob.steps[prob.steps.length-1].q)})]:prob.steps;
      const prevOnStep=o.onStep;
      o.onStep=cur=>{
        const idx=Math.min(cur,Math.max(0,steps.length-1));
        const st=steps[idx];
        HG_LOC.setProb({lesson:o.rep&&o.rep.lesson,gen:o.rep&&o.rep.gen,seed:o.rep&&o.rep.seed,ptype:prob.ptype,mode,step:idx,totalSteps:steps.length,stepTag:st&&st.tag,title:prob.title});
        if(typeof prevOnStep==='function')prevOnStep(cur);
      };
    }
    return prevRP.call(this,host,prob,o);
  };
  renderProblem=window.renderProblem;
}

if(typeof updateWho==='function'){
  const prevUW=updateWho;
  window.updateWho=function(){
    const h=typeof location==='object'?(location.hash||'').replace('#','')||'home':'home';
    if(h!==S.hash)HG_LOC.onRoute(h);
    const out=prevUW.apply(this,arguments);
    dbgLocBtn();
    return out;
  };
  updateWho=window.updateWho;
}

if(typeof viewCalcTopic==='function'){
  const prevCT=viewCalcTopic;
  window.viewCalcTopic=function(id){
    HG_LOC.set({file:'js/05-calc.js',fn:'viewCalcTopic',calcTopic:id});
    return prevCT.apply(this,arguments);
  };
  viewCalcTopic=window.viewCalcTopic;
}

if(typeof addEventListener==='function'){
  addEventListener('hashchange',()=>{const h=typeof location==='object'?(location.hash||'').replace('#',''):'';HG_LOC.onRoute(h)});
}
HG_LOC.onRoute(typeof location==='object'?(location.hash||'').replace('#',''):'home');
})();