/* ───────── 교사 화면 ───────── */
const tTok=()=>{try{return sessionStorage.getItem(TKEY)}catch(e){return null}};
const tSet=t=>{try{t?sessionStorage.setItem(TKEY,t):sessionStorage.removeItem(TKEY)}catch(e){}};
const PTYPE_NM={'poly:prism':'1차시 · 각기둥은 몇 면체?','poly:pyramid':'1차시 · 각뿔은 몇 면체?','poly:is':'1차시 · 다면체인지 고르기','poly:count':'1차시 · 면·모서리·꼭짓점 세기',
  'types:prism':'2차시 · 각기둥 개수 문제','types:pyramid':'2차시 · 각뿔 개수 문제','types:frustum':'2차시 · 각뿔대 개수 문제','types:direct':'2차시 · 개수 바로 구하기','types:side':'2차시 · 옆면 모양 고르기','types:name':'2차시 · 몇 면체인지 구하기',
  'area:tri':'5차시 · 삼각기둥의 겉넓이','area:box':'5차시 · 직육면체의 겉넓이','area:cyl':'5차시 · 원기둥의 겉넓이',
  'regular:is':'3차시 · 정다면체인지 가려내기','regular:why':'3차시 · 정다면체가 아닌 이유','regular:name':'3차시 · 그림 보고 이름 찾기','regular:fan':'3차시 · 한 꼭짓점에 모을 수 있을까','regular:condcount':'3차시 · 조건으로 찾고 개수 구하기','regular:edge':'3차시 · 겹쳐 세기로 모서리 구하기','regular:vertex':'3차시 · 겹쳐 세기로 꼭짓점 구하기','regular:floor':'3차시 · 몇 층 건물로 꼭짓점 세기','regular:cond':'3차시 · 조건으로 정다면체 찾기','regular:count':'3차시 · 그림 보고 개수 구하기','regular:sum':'3차시 · 두 정다면체의 개수 더하기','regular:tf':'3차시 · 옳지 않은 설명 고르기'};
for(const k in PTYPE_NM){const L=LESSONS.find(l=>l.id===k.split(':')[0]);if(L)PTYPE_NM[k]=PTYPE_NM[k].replace(/^\d+차시 · /,L.no+'차시 · ')}
const KIND_KO={steps:'단계 문제',practice:'연습',review:'복습'};
function relTime(iso){if(!iso)return'아직 없음';const d=(Date.now()-Date.parse(iso))/1000;if(d<3600)return Math.max(1,Math.round(d/60))+'분 전';if(d<86400)return Math.round(d/3600)+'시간 전';const days=Math.floor(d/86400);return days===1?'어제':days+'일 전'}
function stripTags(h){const t=document.createElement('div');t.innerHTML=h;return t.textContent.replace(/\s+/g,' ').trim()}
const NUM=v=>{v=Number(v);return Number.isFinite(v)&&v>0?Math.floor(v):0};
const OBJ=v=>(v&&typeof v==='object'&&!Array.isArray(v))?v:{};
const T_TAB_NM=['개념 보기','유형 익히기','차시 마무리'];
const T_TR_IC=['','🌱','🌿','🌳'];
const T_TR_NM=['','첫걸음','한걸음','두걸음'];
function dataSummary(d){d=OBJ(d);const me=OBJ(d._me),t=today(),streak=(me.last===t||me.last===addDays(t,-1))?NUM(me.streak):0;
  const readyL=LESSONS.filter(l=>l.ready);
  const les=readyL.map(l=>{if(typeof lessonProgressInfo==='function'){const info=lessonProgressInfo(l.id,d);return[info.tabs.concept,info.tabs.steps,info.tabs.practice]}const p=OBJ(d[l.id]),pr=OBJ(p.prac);return[!!p.concept,NUM(p.steps)>0,NUM(pr.solved)>=5]});
  const lesTr=readyL.map(l=>typeof lessonProgressInfo==='function'?lessonProgressInfo(l.id,d).trackDone:0);
  const solved=LESSONS.reduce((a,l)=>a+NUM(OBJ(OBJ(d[l.id]).prac).solved),0),rev=Array.isArray(d._rev)?d._rev:[];
  const calc=Object.entries(OBJ(d._calc)).reduce((a,[k,v])=>a+Math.min(calcLvN(k),NUM(OBJ(v).stars)),0),facts=Object.values(OBJ(d._facts)).filter(v=>NUM(v.lv)>=3).length,dg=OBJ(d._calcDiag),plan=Array.isArray(dg.plan)?dg.plan:[];
  const calcErrs=Object.values(OBJ(d._calcErrs)).filter(x=>x&&x.m).sort((a,b)=>NUM(b.n)-NUM(a.n)||String(b.d||'').localeCompare(String(a.d||'')));
  const weakFacts=Object.entries(OBJ(d._facts)).filter(([,v])=>v&&(NUM(v.w)>0||NUM(v.lv)<=1)).sort((a,b)=>NUM(b[1].w)-NUM(a[1].w)||NUM(a[1].lv)-NUM(b[1].lv)).slice(0,6).map(([k,v])=>({k:k.replace('x','×'),w:NUM(v.w),lv:NUM(v.lv)}));
  const goal=typeof goalOf==='function'?goalOf(d):null;
  return{goal,calc,facts,diag:!!dg.d,plan,calcErrs,weakFacts,pts:NUM(me.pts),streak,les,lesTr,solved,rev:rev.length,due:rev.filter(x=>x&&typeof x.due==='string'&&x.due<=t).length,badges:Object.keys(OBJ(me.badges)).length}}
/* ───────── 수업 중 실시간: 지금 위치 알리기 · 손들기 (학생) ─────────
   서버 함수: supabase/live.sql (hg_ping · hg_help · hg_t_live · hg_t_ack) */
const LIVEX={sub:'',help:false,missing:false,last:0,lastProg:0,sent:''};
const LIVE_TAB_NM={concept:'개념 보기',steps:'유형 익히기',practice:'차시 마무리',explore:'더 알아보기'};
const LOC_NM={home:'처음 화면',review:'복습 노트',drill:'기초 연산',calc:'오늘의 계산',boss:'보스전',baseball:'숫자야구',me:'내 기록',shop:'상점',login:'로그인'};
function liveLoc(){const h=(location.hash||'#home').slice(1)||'home';
  if(LOC_NM[h])return LOC_NM[h];if(/^bb-/.test(h))return'숫자야구';if(/^calc-/.test(h))return'오늘의 계산';
  let[id,tab]=h.split('-');if(id==='types')id='poly';const L=LESSONS.find(l=>l.id===id);
  if(L)return`${L.no}차시 ${L.title} · ${LIVE_TAB_NM[LIVE_TAB_NM[tab]?tab:'concept']}${LIVEX.sub?' · '+LIVEX.sub:''}`;
  return h}
function livePing(prog,force){if(!isStudent()||LIVEX.missing)return;const now=Date.now(),loc=liveLoc();
  if(prog){if(now-LIVEX.lastProg<15000&&loc===LIVEX.sent)return;LIVEX.lastProg=now}
  else if(!force&&loc===LIVEX.sent&&now-LIVEX.last<20000)return;
  LIVEX.last=now;LIVEX.sent=loc;
  API.call('hg_ping',{p_token:AUTH.token,p_loc:loc,p_prog:!!prog}).then(r=>{if(r&&LIVEX.help!==!!r.help){LIVEX.help=!!r.help;helpBtn()}}).catch(e=>{if(isMissingFn(e)){LIVEX.missing=true;helpBtn()}})}
function liveSub(t){LIVEX.sub=t||'';livePing(false)}
function helpBtn(){let b=$('#helpBtn');const show=isStudent()&&!LIVEX.missing&&!/^(login|teacher|bossview)/.test((location.hash||'').slice(1));
  if(!show){if(b)b.remove();document.body.classList.remove('has-help');return}
  if(!b){b=el('<button type="button" id="helpBtn" class="helpbtn"></button>');document.body.appendChild(b);
    b.onclick=async()=>{const on=!LIVEX.help;b.disabled=true;try{await API.call('hg_help',{p_token:AUTH.token,p_on:on,p_loc:liveLoc()});LIVEX.help=on;toast(on?'선생님 화면에 손든 것을 알렸어요. 잠깐 기다려 주세요.':'손을 내렸어요.')}catch(e){if(isMissingFn(e)){LIVEX.missing=true}else toast(e.message)}b.disabled=false;helpBtn()}}
  b.classList.toggle('on',LIVEX.help);b.innerHTML=LIVEX.help?'<span class="hi">✋</span><span class="ht">손 들었어요 <small>누르면 내려요</small></span>':'<span class="hi">✋</span><span class="ht">선생님 도와주세요</span>';b.setAttribute('aria-label',LIVEX.help?'손 들었어요, 누르면 내려요':'선생님 도와주세요');document.body.classList.add('has-help')}
setInterval(()=>{if(document.visibilityState==='visible')livePing(false,true)},60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')livePing(false,true)});

/* ───────── 교사: 지금 도울 학생 · 학생 현황 ───────── */
const STALL_MIN=5,ONLINE_SEC=150;
function attName(a){const t=typeOf(a.ptype);if(t){const L=LESSONS.find(l=>l.id===t.lid)||{};return`${L.no||''}차시 유형 ${t.T.no} · ${t.T.nm}`}return PTYPE_NM[a.ptype]||a.ptype||a.lesson}
function attStepQ(a,i){try{const P=GEN[a.gen]&&a.seed!=null?GEN[a.gen](a.seed):null;const st=P&&P.steps[i];return st?String(st.q).replace(/<[^>]+>/g,''):''}catch(e){return''}}
function liveFlags(s,now){const ack=s.ack_at?Date.parse(s.ack_at):0,A=(s.att||[]).filter(a=>Date.parse(a.created_at)>ack),f=[];
  const mins=iso=>Math.max(0,Math.round((now-Date.parse(iso))/60000));
  if(s.help_at)f.push({c:'r',w:4,t:`✋ 손들었어요 · ${mins(s.help_at)}분 전${s.help_loc?' · '+esc(s.help_loc):''}`});
  A.filter(a=>(a.revealed||[]).some(x=>x>0)).slice(-2).forEach(a=>{const i=a.revealed.findIndex(x=>x>0);f.push({c:'r',w:3,t:`${esc(attName(a))} · (${i+1})단계 정답을 보고 넘어감`})});
  let run=0,runN='';for(const a of A){const n=attName(a);if(!a.good&&n===runN)run++;else if(!a.good){run=1;runN=n}else{run=0;runN=''}}
  if(run>=3)f.push({c:'p',w:3,t:`${esc(runN)} · ${run}번 연속 틀림`});
  A.filter(a=>a.good&&a.wrongs>=3).slice(-1).forEach(a=>f.push({c:'y',w:2,t:`${esc(attName(a))} · ${a.wrongs}번 틀린 끝에 맞힘`}));
  const online=s.loc_at&&now-Date.parse(s.loc_at)<ONLINE_SEC*1000,inProb=/같이 풀기|혼자 풀기|유형 익히기|차시 마무리|복습/.test(s.loc||'');
  const lastP=Math.max(s.prog_at?Date.parse(s.prog_at):0,ack);
  if(online&&inProb&&lastP&&now-lastP>STALL_MIN*60000)f.push({c:'g',w:1,t:`${Math.floor((now-lastP)/60000)}분째 답을 내지 않았어요`});
  return f}
function liveCard(s,now,f){const online=s.loc_at&&now-Date.parse(s.loc_at)<ONLINE_SEC*1000,A=s.att||[],ok1=A.filter(a=>a.good&&!a.wrongs).length;
  const dots=A.slice(-12).map(a=>`<i class="${(a.revealed||[]).some(x=>x>0)||!a.good?'x':a.wrongs?'t':'o'}" title="${esc(attName(a))}"></i>`).join('');
  return`<div class="lv ${online?'on':''} ${f&&f.some(x=>x.w>=3)?'hot':''}"><div class="lvh"><span class="dot"></span>${s.labH||`<b>${s.num}번</b>`}<span class="lvt">${online?'접속 중':s.loc_at?relTime(s.loc_at):'오늘 안 들어옴'}</span></div>
    <div class="lvloc">${s.loc?esc(s.loc):'<span class="muted">-</span>'}</div><div class="lvs">오늘 <b>${A.length}</b>문제 · 처음에 맞힘 <b>${ok1}</b>${s.prog_at?` · 마지막 답 ${relTime(s.prog_at)}`:''}</div>${dots?`<div class="lvd">${dots}</div>`:''}</div>`}
function togetherLive(S,now){const on=S.filter(s=>s.loc_at&&now-Date.parse(s.loc_at)<ONLINE_SEC*1000).length,need=Math.max(3,Math.ceil(on*0.3)),m={};
  S.forEach(s=>{const ack=s.ack_at?Date.parse(s.ack_at):0;(s.att||[]).filter(a=>Date.parse(a.created_at)>ack&&now-Date.parse(a.created_at)<40*60000).forEach(a=>{(a.step_wrongs||[]).forEach((w,i)=>{if(w>0||((a.revealed||[])[i]>0)){const k=attName(a)+'|'+i;(m[k]=m[k]||{a,i,ns:new Set()}).ns.add(s.lab||s.num+'번')}})})});
  const seen=new Set(),out=Object.values(m).filter(x=>x.ns.size>=need).sort((x,y)=>y.ns.size-x.ns.size||x.i-y.i).filter(x=>{const k=attName(x.a);if(seen.has(k))return false;seen.add(k);return true}).slice(0,3);
  return out.map(x=>{const q=attStepQ(x.a,x.i);return`<div class="tg"><b>${esc(attName(x.a))} · (${x.i+1})단계</b>${q?` <span class="muted">“${esc(q)}”</span>`:''} — <b>${x.ns.size}명</b>이 같은 곳에서 막혔어요. 함께 볼까요?<div class="muted" style="font-size:13px">${esc([...x.ns].sort((a,b)=>String(a).localeCompare(String(b),'ko',{numeric:true})).join(', '))}</div></div>`}).join('')}

/* 나의 길(06g-goal.js): 학생이 고른 길 표시 · 추천과 다르면 ! */
function goalBadge(d){if(typeof goalOf!=='function')return'';const G=goalOf(d);if(!G.k)return G.rec?`<span class="t-goal none" title="아직 길을 고르지 않았어요 · 추천 ${goalBy(G.rec).nm}">·</span>`:'';const g=goalBy(G.k);
  return`<span class="t-goal${G.diff?' diff':''}" title="${g.nm}${G.diff?` · 기록 추천은 ${goalBy(G.rec).nm}`:''}">${g.ic}${G.diff?'!':''}</span>`}
function goalStuHTML(G){if(!G)return'';const nm=k=>{const g=goalBy(k);return g?`${g.ic} ${g.nm}`:'–'};
  return`<h3>나의 길</h3><div class="t-calc-box"><div><b>고른 길</b> ${G.k?`${nm(G.k)} <span class="muted">· ${G.days?G.days+'일 전':'오늘'} 고름${G.old?' · <b class="t-due">2주 지남</b>':''}</span>`:'<span class="muted">아직 안 골랐어요</span>'}</div>
   <div style="margin-top:6px"><b>기록 추천</b> ${G.rec?`${nm(G.rec)} <span class="muted">· ${esc(G.why)}</span>`:'<span class="muted">시작점 찾기 전이라 아직 몰라요</span>'}</div>
   ${G.diff?`<div class="t-due" style="margin-top:6px">고른 길이 추천보다 ${GOAL_RANK[G.k]>GOAL_RANK[G.rec]?'높아요. 기초가 흔들리지 않는지':'낮아요. 자신감이 부족한 건 아닌지'} 이야기 나눠 보세요.</div>`:''}
   ${G.h.length>1?`<div class="muted" style="margin-top:6px">바꾼 기록 ${G.h.map(([k,d])=>`${(goalBy(k)||{}).ic||''} ${esc(String(d).slice(5))}`).join(' → ')}</div>`:''}</div>`}
/* ───────── 👀 학생 화면 보기 (보기 전용) ─────────
   교사 화면이 받아 온 학생 기록(s.data)을 잠깐 DB 자리에 두고 학생 화면을 그대로 보여 줘요.
   이때 save()는 아무것도 저장하지 않아요. 교사 화면으로 돌아오면 원래 DB로 되돌려요. */
const PEEK={on:false,bak:null,save:null};
function peekStart(data,label){if(PEEK.on)peekEnd();PEEK.bak=DB;PEEK.save=save;PEEK.on=true;
  DB=JSON.parse(JSON.stringify(OBJ(data)));save=function(){};
  document.body.classList.remove('t-wide','t-dopen');document.body.classList.add('peek-mode');
  let b=$('#peekBar');if(!b){b=document.createElement('div');b.id='peekBar';b.className='peek-bar';b.setAttribute('role','status');document.body.prepend(b)}
  b.innerHTML=`<span>👀 <b>${esc(label)}</b> 학생 화면이에요 <small>(보기 전용 · 눌러도 학생 기록은 바뀌지 않아요)</small></span><button type="button" class="btn peekOut">교사 화면으로 돌아가기</button>`;
  $('.peekOut',b).onclick=()=>{peekEnd();location.hash='#teacher'};
  updatePill();if((location.hash||'#home')==='#home')route();else location.hash='#home'}
function peekEnd(){if(!PEEK.on)return;DB=PEEK.bak;save=PEEK.save;PEEK.on=false;PEEK.bak=null;
  document.body.classList.remove('peek-mode');const b=$('#peekBar');if(b)b.remove();updatePill()}
function viewTeacher(){
  if(PEEK.on)peekEnd();
  crumbs.innerHTML=`<span class="sep">›</span><span>교사 화면</span>`;const tok=tTok();document.body.classList.remove('t-wide');
  if(!tok){app.innerHTML=`<div class="login-wrap">${demoBanner()}<div class="card panel login-card"><h1 style="font-size:28px">교사 화면</h1><p class="muted">학생 번호와 비밀번호를 만들고, 진도와 많이 막히는 단계를 볼 수 있어요.</p>${teacherForm()}</div></div>`;wireTeacherForm(app);return}
  document.body.classList.add('t-wide');
  const ready=LESSONS.filter(l=>l.ready);
  const CBOSS=()=>typeof CLASS_BOSS_ON==='undefined'||!!CLASS_BOSS_ON;   // 반 보스전을 숨겼으면 교사 화면에서도 접어 둬요
  /* 표 머리줄: 단원별로 묶어 '1차시 2차시 … 1차시'가 겹쳐 보이지 않게 */
  const unitNm=u=>(typeof UNIT_INFO!=='undefined'&&UNIT_INFO[u]&&UNIT_INFO[u].name)||'단원';
  const unitGroups=()=>{const g=[];ready.forEach(l=>{const u=l.unit||'solid';if(g.length&&g[g.length-1][0]===u)g[g.length-1][1]++;else g.push([u,1])});return g};
  const unitIdx=l=>{const u=l.unit||'solid';return unitGroups().findIndex(x=>x[0]===u)};
  const shortT=t=>{t=String(t||'').split(/\s*·\s*/)[0];return t.length>7?t.slice(0,7)+'…':t};
  const lesTip=l=>`${unitNm(l.unit||'solid')} · ${l.no}차시 ${l.title}`;
  const TABS_T=[['now','🙋 지금 도울 학생'],['week','📅 이번 주'],['stat','📊 학습 현황'],['steps','🧩 막히는 단계 · 신고'],['people','👥 학생 관리'],['game','🎮 게임'],['set','⚙ 설정']];
  app.innerHTML=`<div class="t-top"><div><h1>교사 화면</h1><p class="muted">방과후 반을 만들어 학년·반이 다른 학생들을 한 화면에서 봐요. 이름은 이 기기에만 저장돼요.</p></div>
     <div class="t-topb"><span class="t-at muted tLiveAt"></span><label class="t-sel t-auto"><input type="checkbox" class="tAuto" checked> 10초마다 새로 고침</label><a class="btn ghost" href="#print">🖨 점검 학습지</a><a class="btn ghost" href="#scan">📷 사진 채점</a><button type="button" class="btn ghost tRefresh">새로 고침</button><button type="button" class="btn ghost tOut">로그아웃</button></div></div>${demoBanner()}
   <div class="t-scope" role="tablist" aria-label="볼 학생 고르기"></div>
   <div class="t-cols">
    <aside class="card t-side"><div class="t-side-h"><b class="tSideT">학생</b><span class="muted tSideN"></span></div><ul class="t-stu tStu"></ul>
     <p class="muted t-side-f">● 접속 중 · ✋ 손듦 · 숫자는 오늘 푼 문제<br>이름을 누르면 자세히 볼 수 있어요.</p></aside>
    <section class="t-main">
     <nav class="t-tabs" role="tablist">${TABS_T.map(([k,t])=>`<button type="button" role="tab" data-t="${k}">${t}${k==='now'?' <span class="cntb tHelpN" hidden></span>':k==='steps'?' <span class="cntb tRepN" hidden></span>':''}</button>`).join('')}</nav>
     <div class="t-pane" data-p="now">
      <div class="card panel tLive"><div class="t-head"><h2>🙋 지금 도울 학생</h2></div>
       <p class="muted t-lead">손든 학생, 단계 정답을 보고 넘어간 학생, 같은 유형을 3번 연속 틀린 학생, ${STALL_MIN}분 넘게 답을 내지 않은 학생이 모여요. 도와준 뒤 [✓ 도왔어요]를 누르면 정리돼요.</p><div class="together tTogether"></div><div class="tHelp"></div></div>
      <div class="card panel tNow"><div class="t-head"><h2>오늘 학생 현황</h2><span class="muted tNowSum"></span></div><div class="lvgrid tNowGrid"></div>
       <p class="muted t-lead" style="margin:10px 0 0">점: <i class="lvk o"></i>처음에 맞힘 <i class="lvk t"></i>틀린 뒤 맞힘 <i class="lvk x"></i>틀림·정답 확인 (최근 12문제)</p></div></div>
     <div class="t-pane" data-p="week">
      <div class="card panel"><div class="t-head"><h2>📅 이번 주 한눈에 <span class="muted tScopeNm" style="font-size:17px"></span></h2><button type="button" class="btn ghost tWkCopy">수업 메모로 복사</button></div>
       <p class="muted t-lead">대면 수업 전에 지난 7일 동안 누가 며칠 공부했는지, 무엇을 챙길지 한 번에 봐요. 🎫 쿠폰은 학생이 보여 주면 [사용함]을 눌러 주세요(이 기기에 기록돼요).</p>
       <div class="t-tiles tWkTiles"></div>
       <div class="tablewrap"><table class="t t-week"><thead><tr><th>학생</th><th>지난 7일 공부한 날</th><th>최근 접속</th><th>7일<br><small>풀이</small></th><th>이번 주<br><small>포인트</small></th><th>보스 도전<br><small>승 / 판</small></th><th>🎫 쿠폰<br><small>남은 장수</small></th><th class="l">챙길 점</th></tr></thead><tbody class="tWkRows"></tbody></table></div>
       <p class="muted t-lead" style="margin:10px 0 0">공부한 날은 포인트를 받은 날이에요. 이번 주 포인트는 월요일부터 센 값이에요. 쿠폰 사용 기록은 학생 이름표처럼 이 기기에만 저장돼서, 학생 화면의 쿠폰 수는 그대로 보여요.</p></div></div>
     <div class="t-pane" data-p="stat">
      <div class="card panel"><div class="t-head"><h2>학습 현황 <span class="muted tScopeNm" style="font-size:17px"></span></h2><button type="button" class="btn ghost tCsv">엑셀로 받기</button></div><div class="t-tiles tStTiles"></div><div class="t-watch" aria-label="챙겨 볼 학생"></div><p class="t-pipkey muted">차시 칸 점 3개: <span class="pips"><span class="pip on"></span></span> 개념 보기 · <span class="pips"><span class="pip on"></span></span> 유형 익히기 · <span class="pips"><span class="pip on"></span></span> 차시 마무리 · 🌱🌿🌳 완료 걸음 · <span class="pips"><span class="pip"></span></span> 아직</p>
       <div class="tablewrap"><table class="t t-roster"><thead><tr class="t-unitrow"><th rowspan="2">학생</th><th rowspan="2">최근 접속</th><th rowspan="2">포인트</th><th rowspan="2">연속</th>${unitGroups().map(([u,n],i)=>`<th colspan="${n}" class="t-unit u${i%3}">${esc(unitNm(u))}</th>`).join('')}<th rowspan="2">연습<br><small>푼 문제</small></th><th rowspan="2">기초 연산<br><small>별 · 구구단 익힘</small></th><th rowspan="2">복습<br><small>대기</small></th><th rowspan="2">7일<br><small>풀이</small></th><th rowspan="2">이번 주<br><small>데미지</small></th></tr>
        <tr>${ready.map(l=>`<th class="t-lesh u${unitIdx(l)%3}" title="${esc(lesTip(l))}">${l.no}차시<br><small>${esc(shortT(l.title))}</small></th>`).join('')}</tr></thead><tbody class="tRows"></tbody></table></div><div class="tOmr"></div>
       <p class="muted tEmpty" hidden>이 반에는 아직 학생이 없어요. ‘👥 학생 관리’에서 학생을 넣어 주세요.</p><p class="muted t-lead" style="margin:10px 0 0">이름을 누르면 그 학생의 최근 풀이를 볼 수 있어요. 차시 칸의 점 3개는 차례로 <b>개념 보기 · 유형 익히기 · 차시 마무리</b>이고, 옆 아이콘(🌱·🌿·🌳)은 완료한 걸음이에요.</p></div></div>
     <div class="t-pane" data-p="steps">
      <div class="card panel tRep"></div>
      <div class="card panel"><div class="t-head"><h2>많이 막히는 단계 <span class="muted tScopeNm" style="font-size:17px"></span></h2><div class="seg tDays">${[7,30,90].map(d=>`<button type="button" data-d="${d}" class="${d===30?'on':''}">${d}일</button>`).join('')}</div></div>
       <p class="muted t-lead">단계 문제와 ‘단계 따라 풀기’ 연습에서 단계마다 틀린 비율이에요. 다음 시간에 다시 짚을 곳을 찾을 때 써 보세요.</p><div class="tStatsNote"></div><div class="tStats"></div></div></div>
     <div class="t-pane" data-p="people"><div class="tPeople"></div></div>
     <div class="t-pane" data-p="game">
      <div class="card panel tRaid"><div class="t-head"><h2>⚔️ 오늘의 보스 도전 <span class="muted tScopeNm" style="font-size:17px"></span></h2><span class="muted tRaidBoss"></span></div>
       <p class="muted t-lead">학생 혼자 하는 보스 도전 기록이에요. 교과서 한 걸음에서 해결한 차시가 <b class="tRaidNeed">3</b>개가 되면 문이 열려요. 🎫 쿠폰은 학생이 보여 주면 [사용함]을 눌러 주세요.</p>
       <div class="t-tiles tRaidTiles"></div>
       <div class="tablewrap"><table class="t t-week t-raid"><thead><tr><th>학생</th><th>문 열림<br><small>해결한 차시</small></th><th>오늘<br><small>도전</small></th><th>승 / 판<br><small>지금까지</small></th><th>물리친<br><small>보스</small></th><th>🎫 쿠폰<br><small>남은 장수</small></th></tr></thead><tbody class="tRaidRows"></tbody></table></div></div>
      <div class="card panel t-gsel"><label class="t-sel">${CBOSS()?'숫자야구와 우리 반 보스전은':'숫자야구는'} 정규 반 단위예요. 반 <select class="inp sel tGClass" aria-label="게임을 볼 반"></select></label></div>
      <div class="card panel tBoss" hidden><div class="t-head"><h2>우리 반 보스전</h2><span class="t-tools tBossTools"><label class="t-sel">학생 1명당 보스 체력 <select class="inp sel tPer" aria-label="학생 1명당 보스 체력">${[20,30,50,80,120,200].map(v=>`<option value="${v}">${v}</option>`).join('')}</select></label><a class="btn ghost tBV" href="#teacher">크게 띄우기</a></span></div><div class="tBossBody"></div></div>
      <div class="card panel tBB" hidden><div class="t-head"><h2>숫자야구</h2><span class="t-tools tBBTools"><label class="t-sel"><input type="checkbox" class="tBBon"> 켜기</label><label class="t-sel">최대 판돈 <select class="inp sel tBBmax" aria-label="최대 판돈">${[0,5,10,20,50].map(v=>`<option value="${v}">${v?v+'포인트':'친선만'}</option>`).join('')}</select></label></span></div><div class="tBBbody"></div></div></div>
     <div class="t-pane" data-p="set">
      <div class="card panel"><h2>교사 비밀번호 바꾸기</h2><form class="t-pw"><label>지금 비밀번호 <input class="inp" type="password" name="o" autocomplete="current-password" required></label><label>새 비밀번호 (6자 이상) <input class="inp" type="password" name="n" autocomplete="new-password" minlength="6" required></label><button class="btn">바꾸기</button></form><div class="flmsg tPMsg" role="status"></div></div>
      <div class="card panel"><h2>학생 이름표</h2><p class="muted t-lead">학생 이름은 서버에 저장하지 않고 <b>이 기기(브라우저)</b>에만 저장해요. 다른 컴퓨터에서 보려면 여기서 목록을 복사해, 그 컴퓨터의 같은 칸에 붙여 넣으세요.</p>
       <textarea class="inp tNames" rows="5" style="width:100%" placeholder="1-3-5 김민수&#10;1-4-12 이서연"></textarea>
       <div class="next-row" style="margin:10px 0 0"><button type="button" class="btn ghost tNmCopy">지금 이름표 복사</button><button type="button" class="btn primary tNmLoad">붙여 넣은 이름 불러오기</button></div><div class="flmsg tNmMsg" role="status"></div></div></div>
    </section></div>
   <div class="t-drawer" hidden><div class="t-dback"></div><div class="t-dpanel card" role="dialog" aria-modal="true" aria-label="학생 자세히"><div class="t-dbody"></div></div></div>`;

  /* ── 상태 ── */
  let ROSTER=[],GROUPS=[],groupsOff=false,days=30,LVS={},liveMissing=false,sidsMissing=false,statsSidsMissing=false,lastStats=null;
  let SC=lsGet('hangeoreum-t-scope',null),TAB=lsGet('hangeoreum-t-tab','now'),GK=lsGet('hangeoreum-t-class',null);
  let NAMES=OBJ(lsGet('hangeoreum-t-names',{}));
  const saveNames=()=>lsSet('hangeoreum-t-names',NAMES);
  /* 🎫 대면 수업 쿠폰: 학생 기록(DB._shop.couponPcs)은 늘어나기만 해서, 쓴 장수는 이 기기에 따로 적어요 */
  let CPU=OBJ(lsGet('hangeoreum-t-coupons',{}));
  const cpInfo=s=>{const sh=OBJ(OBJ(s.data)._shop),got=Math.floor(NUM(sh.couponPcs)/3),used=Math.min(got,NUM(CPU[s.sid]));return{got,used,left:got-used,pcs:NUM(sh.couponPcs)%3}};
  const cpUse=(sid,d)=>{const s=bySid(sid);if(!s)return;const c=cpInfo(s),v=Math.max(0,Math.min(c.got,c.used+d));if(v)CPU[sid]=v;else delete CPU[sid];lsSet('hangeoreum-t-coupons',CPU);
    toast(d>0?`${nameT(s)} 쿠폰 1장을 사용했어요.`:'쿠폰 사용을 되돌렸어요.');renderWeek();renderRaid()};
  const raidInfo=s=>{const R=OBJ(OBJ(s.data)._raid);return{w:NUM(R.w),g:NUM(R.g)}};
  const fail=e=>{if(isAuthErr(e)){tSet(null);toast('교사 로그인이 끝났어요. 다시 로그인해 주세요.');viewTeacher();return true}toast(e.message);return false};
  const classes=()=>{const m=new Map();ROSTER.forEach(s=>m.set(`${s.grade}-${s.klass}`,{g:s.grade,k:s.klass,n:(m.get(`${s.grade}-${s.klass}`)||{n:0}).n+1}));return[...m.entries()]};
  const grp=()=>SC&&SC.startsWith('g:')?GROUPS.find(g=>String(g.id)===SC.slice(2)):null;
  const isClass=()=>!!(SC&&SC.startsWith('c:'));
  const sidSet=()=>{const g=grp();if(g)return new Set(g.sids);if(isClass())return new Set(ROSTER.filter(s=>`c:${s.grade}-${s.klass}`===SC).map(s=>s.sid));return new Set(ROSTER.map(s=>s.sid))};
  const curList=()=>{const S=sidSet();return ROSTER.filter(s=>S.has(s.sid))};
  const scopeNm=()=>{const g=grp();if(g)return g.name;if(isClass()){const[a,b]=SC.slice(2).split('-');return`${a}학년 ${b}반`}return'전체 학생'};
  const code=s=>`${s.grade}-${s.klass}-${s.num}`;
  const base=s=>isClass()?`${s.num}번`:code(s);
  const nameT=s=>NAMES[s.sid]?`${NAMES[s.sid]} (${base(s)})`:base(s);
  const nameH=s=>NAMES[s.sid]?`<b>${esc(NAMES[s.sid])}</b> <small class="t-code">${base(s)}</small>`:`<b>${base(s)}</b>`;
  const bySid=sid=>ROSTER.find(s=>s.sid===sid);

  /* ── 범위 고르기: 방과후 반 · 정규 반 · 전체 ── */
  function fixScope(){const C=classes();
    if(SC&&SC.startsWith('g:')&&!grp())SC=null;if(SC&&SC.startsWith('c:')&&!C.some(([k])=>'c:'+k===SC))SC=null;
    if(!SC)SC=GROUPS.length?'g:'+GROUPS[0].id:C.length?'c:'+C[0][0]:'all';
    if(!GK||!C.some(([k])=>k===GK))GK=isClass()?SC.slice(2):C.length?C[0][0]:null}
  function renderScope(){const C=classes(),box=$('.t-scope',app);
    const b=(v,t,n,cls='')=>`<button type="button" role="tab" class="t-sc ${cls} ${SC===v?'on':''}" data-v="${v}" aria-selected="${SC===v}">${t}${n!=null?` <span class="t-scn">${n}</span>`:''}</button>`;
    box.innerHTML=`<div class="t-scg"><span class="t-scl">방과후 반</span>${GROUPS.map(g=>b('g:'+g.id,esc(g.name),g.sids.length,'grp')).join('')}<button type="button" class="t-sc add tScAdd">＋ 방과후 반 만들기</button></div>
      <div class="t-scg"><span class="t-scl">정규 반</span>${C.map(([k,v])=>b('c:'+k,`${v.g}-${v.k}`,v.n)).join('')}${b('all','전체',ROSTER.length)}</div>`;
    $$('.t-sc[data-v]',box).forEach(x=>x.onclick=()=>{SC=x.dataset.v;lsSet('hangeoreum-t-scope',SC);LVS={};render();loadLive();loadStats()});
    $('.tScAdd',box).onclick=()=>{setTab('people');setTimeout(()=>{const i=$('.tGNew input',app);if(i)i.focus()},50)}}
  function setTab(t){TAB=TABS_T.some(x=>x[0]===t)?t:'now';lsSet('hangeoreum-t-tab',TAB);
    $$('.t-tabs button',app).forEach(b=>{const on=b.dataset.t===TAB;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
    $$('.t-pane',app).forEach(p=>p.hidden=p.dataset.p!==TAB);if(TAB==='game')loadGames()}
  $$('.t-tabs button',app).forEach(b=>b.onclick=()=>setTab(b.dataset.t));

  async function loadAll(){try{ROSTER=await API.call('hg_t_overview',{p_token:tTok()})||[]}catch(e){fail(e);return}
    try{GROUPS=(await API.call('hg_t_groups',{p_token:tTok()})||[]).map(g=>({id:g.id,name:g.name,sids:g.sids||[]}));groupsOff=false}
    catch(e){if(isMissingFn(e)){groupsOff=true;GROUPS=[]}else{fail(e);return}}
    render();loadLive();loadStats();loadReports()}
  function render(){fixScope();renderScope();renderSide();renderRoster();renderWeek();renderRaid();renderPeople();$$('.tScopeNm',app).forEach(x=>x.textContent='· '+scopeNm());if(TAB==='game')loadGames()}

  /* ── 왼쪽 학생 목록 ── */
  function renderSide(){const L=curList(),now=Date.now(),ul=$('.tStu',app);
    $('.tSideT',app).textContent=scopeNm();
    const on=L.filter(s=>{const x=LVS[s.sid];return x&&x.loc_at&&now-Date.parse(x.loc_at)<ONLINE_SEC*1000}).length;
    $('.tSideN',app).textContent=`${on?`접속 ${on} · `:''}${L.length}명`;
    ul.innerHTML=L.length?L.map(s=>{const x=LVS[s.sid]||{},online=x.loc_at&&now-Date.parse(x.loc_at)<ONLINE_SEC*1000,n=(x.att||[]).length;
      return`<li class="${online?'on':''} ${x.help_at?'help':''}"><button type="button" data-sid="${esc(s.sid)}"><span class="dot"></span><span class="nm">${nameH(s)}</span>${goalBadge(s.data)}${x.help_at?'<span class="hand" title="손들었어요">✋</span>':''}<span class="t-cnt">${n||''}</span></button></li>`}).join('')
      :`<li class="empty muted">${grp()?'아직 학생이 없어요.<br>‘👥 학생 관리’에서 넣어 주세요.':'학생이 없어요.'}</li>`;
    $$('button[data-sid]',ul).forEach(b=>b.onclick=()=>openStu(b.dataset.sid))}

  /* ── 지금 도울 학생 (10초마다) ── */
  async function fetchLive(L){
    if(isClass()){const[g,k]=SC.slice(2).split('-').map(Number);const R=await API.call('hg_t_live',{p_token:tTok(),p_grade:g,p_klass:k});(R.students||[]).forEach(s=>{s.grade=g;s.klass=k});return R}
    const sids=L.map(s=>s.sid);if(!sids.length)return{now:new Date().toISOString(),students:[]};
    if(!sidsMissing){try{return await API.call('hg_t_live_sids',{p_token:tTok(),p_sids:sids})}catch(e){if(!isMissingFn(e))throw e;sidsMissing=true}}
    /* group.sql 실행 전: 정규 반별로 받아서 골라요 */
    const want=new Set(sids),C=[...new Set(L.map(s=>`${s.grade}-${s.klass}`))];let now=null;const out=[];
    for(const c of C){const[g,k]=c.split('-').map(Number);const R=await API.call('hg_t_live',{p_token:tTok(),p_grade:g,p_klass:k});now=R.now;(R.students||[]).forEach(s=>{if(want.has(s.sid)){s.grade=g;s.klass=k;out.push(s)}})}
    return{now:now||new Date().toISOString(),students:out}}
  async function loadLive(){const hb=$('.tHelp',app),grid=$('.tNowGrid',app);if(!hb)return;
    if(liveMissing){hb.innerHTML=liveSqlHelp();return}
    const L=curList();if(!L.length){hb.innerHTML='<div class="muted t-empty">이 반에는 아직 학생이 없어요.</div>';grid.innerHTML='';$('.tTogether',app).innerHTML='';$('.tNowSum',app).textContent='';renderSide();return}
    const sc=SC;
    try{const R=await fetchLive(L);if(!R||location.hash!=='#teacher'||sc!==SC)return;
      const S=(R.students||[]).map(s=>Object.assign(s,{lab:nameT(s),labH:nameH(s)})),now=Date.parse(R.now)||Date.now();LVS={};S.forEach(s=>LVS[s.sid]=s);
      const rows=S.map(s=>({s,f:liveFlags(s,now)})).filter(x=>x.f.length).sort((a,b)=>b.f.reduce((t,x)=>t+x.w,0)-a.f.reduce((t,x)=>t+x.w,0));
      const hot=rows.filter(x=>x.f.some(y=>y.w>=3)).length,nb=$('.tHelpN',app);nb.hidden=!hot;nb.textContent=hot;
      $('.tTogether',app).innerHTML=togetherLive(S,now);
      hb.innerHTML=rows.length?`<div class="helpl">${rows.map(({s,f})=>`<div class="hc ${f.some(x=>x.w>=3)?'hot':''}"><div class="hn"><button type="button" class="t-nmb" data-sid="${esc(s.sid)}">${s.labH}</button><span class="muted">지금: ${s.loc?esc(s.loc):'-'}</span></div>${f.map(x=>`<span class="chip ${x.c}">${x.t}</span>`).join('')}
        <div style="margin-top:8px"><button type="button" class="btn ghost t-mini tAck" data-sid="${esc(s.sid)}">✓ 도왔어요</button></div></div>`).join('')}</div>`:'<div class="muted t-empty">지금은 도움이 필요한 학생이 없어요 🙂</div>';
      $$('.tAck',hb).forEach(b=>b.onclick=async()=>{b.disabled=true;try{await API.call('hg_t_ack',{p_token:tTok(),p_sid:b.dataset.sid});loadLive()}catch(e){fail(e)}});
      const fl=Object.fromEntries(rows.map(x=>[x.s.sid,x.f]));
      grid.innerHTML=S.map(s=>liveCard(s,now,fl[s.sid]).replace('<div class="lv ',`<div data-sid="${esc(s.sid)}" class="lv `)).join('');
      $$('.lv[data-sid]',grid).forEach(c=>c.onclick=()=>openStu(c.dataset.sid));$$('.t-nmb',hb).forEach(b=>b.onclick=()=>openStu(b.dataset.sid));
      const on=S.filter(s=>s.loc_at&&now-Date.parse(s.loc_at)<ONLINE_SEC*1000).length;$('.tNowSum',app).textContent=`접속 중 ${on}명 / ${S.length}명 · 오늘 푼 문제 ${S.reduce((t,s)=>t+(s.att||[]).length,0)}개`;
      $('.tLiveAt',app).textContent=new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+' 기준';renderSide()}
    catch(e){if(isMissingFn(e)){liveMissing=true;hb.innerHTML=liveSqlHelp();grid.innerHTML=''}else fail(e)}}
  clearInterval(window._liveT);window._liveT=setInterval(()=>{if(location.hash!=='#teacher'){clearInterval(window._liveT);return}if($('.tAuto',app)&&$('.tAuto',app).checked&&document.visibilityState==='visible')loadLive()},10000);

  /* ── 학습 현황 ── */
  function renderRoster(){const L=curList();$('.tEmpty',app).hidden=!!L.length;
    const S=L.map(s=>Object.assign({s},dataSummary(s.data||{})));const wk=Date.now()-7*864e5;
    const act=L.filter(s=>s.last_seen&&Date.parse(s.last_seen)>wk).length,avg=S.length?Math.round(S.reduce((a,x)=>a+x.pts,0)/S.length):0,tries=L.reduce((a,s)=>a+(s.attempts_7d||0),0);
    {const nm=nameT,lst=a=>a.length>15?a.slice(0,15).join(', ')+` 외 ${a.length-15}명`:a.join(', ');
      const away=S.filter(x=>!x.s.last_seen||Date.parse(x.s.last_seen)<wk).map(x=>nm(x.s)),back=S.filter(x=>x.due>=5).map(x=>`${nm(x.s)}(${x.due})`),noc=S.filter(x=>x.s.last_seen&&Date.parse(x.s.last_seen)>=wk&&!x.calc&&!x.diag).map(x=>nm(x.s)),base0=S.filter(x=>x.plan.includes('facts')||x.plan.includes('add')).map(x=>`${nm(x.s)}(${x.plan.slice(0,2).map(id=>({add:'덧뺄',facts:'구구단',div:'나눗',order:'순서',fracbase:'분수'})[id]||id).join('·')})`),gdiff=S.filter(x=>x.goal&&x.goal.diff).map(x=>`${nm(x.s)}(${goalBy(x.goal.k).ic}→추천 ${goalBy(x.goal.rec).ic})`),gold=S.filter(x=>x.goal&&x.goal.old).map(x=>nm(x.s)),cerrs=S.filter(x=>x.calcErrs&&x.calcErrs.length&&NUM(x.calcErrs[0].n)>=2).map(x=>{const e=x.calcErrs[0],tp=CALC.find(c=>c.id===e.tid);return`${nm(x.s)}(${tp?tp.nm:e.tid}·${e.n}회)`});
      $('.t-watch',app).innerHTML=(away.length?`<div><b>7일 넘게 들어오지 않았어요</b> (${away.length}명) · ${esc(lst(away))}</div>`:'')+(back.length?`<div class="mid"><b>복습이 5문제 넘게 밀렸어요</b> · ${esc(lst(back))}</div>`:'')+(noc.length?`<div class="mid"><b>기초 연산을 아직 시작하지 않았어요</b> · ${esc(lst(noc))}</div>`:'')+(base0.length?`<div class="mid"><b>시작점 찾기에서 덧셈·뺄셈이나 곱셈구구부터 다지기로 나왔어요</b> · ${esc(lst(base0))}</div>`:'')+(gdiff.length?`<div class="mid"><b>고른 길과 기록 추천이 달라요</b> · ${esc(lst(gdiff))} <small>(왜 이 길을 골랐는지 1분만 이야기 나눠 보세요)</small></div>`:'')+(gold.length?`<div class="mid"><b>길을 고른 지 2주가 지났어요</b> · ${esc(lst(gold))} <small>(학생 화면에도 다시 고르자고 나와요)</small></div>`:'')+(cerrs.length?`<div class="mid"><b>기초 연산에서 같은 실수가 반복됐어요</b> · ${esc(lst(cerrs))} <small>(이름을 눌러 자세히 보기)</small></div>`:'')}
    $('.tStTiles',app).innerHTML=`<div class="t-tile"><small>학생</small><b>${L.length}</b></div><div class="t-tile"><small>최근 7일에 공부한 학생</small><b>${act}</b></div><div class="t-tile"><small>평균 포인트</small><b>${avg}</b></div><div class="t-tile"><small>최근 7일 풀이 수</small><b>${tries}</b></div>${typeof GOALS==='undefined'?'':`<div class="t-tile t-goals"><small>나의 길</small><b>${GOALS.map(g=>`<span title="${g.nm}">${g.ic} ${S.filter(x=>x.goal&&x.goal.k===g.k).length}</span>`).join(' ')} <span class="muted" title="아직 길을 고르지 않았어요">· 미정 ${S.filter(x=>!x.goal||!x.goal.k).length}</span></b></div>`}`;
    $('.tRows',app).innerHTML=S.map(({s,pts,streak,les,lesTr,solved,rev,due,calc,facts})=>`<tr data-sid="${esc(s.sid)}"><td class="l"><button type="button" class="t-num">${nameH(s)}</button>${goalBadge(s.data)}${s.locked?' <span class="t-lock">잠김</span>':''}</td>
      <td class="${!s.last_seen||Date.parse(s.last_seen)<wk?'t-old':''}">${relTime(s.last_seen)}</td><td class="rm">${pts}</td><td class="rm">${streak}</td>
      ${les.map((a,li)=>{const td=lesTr&&lesTr[li]||0;return`<td title="${esc(lesTip(ready[li]))}"><span class="pips">${a.map((x,i)=>`<span class="pip ${x?'on':''}" title="${esc(ready[li].no+'차시 '+shortT(ready[li].title))} · ${T_TAB_NM[i]} ${x?'했어요':'아직'}"></span>`).join('')}${td?`<span class="t-tr" title="${T_TR_NM[td]} 완료">${T_TR_IC[td]}</span>`:''}</span></td>`}).join('')}
      <td class="rm">${solved}</td><td class="rm">${calc}<small class="t-sub"> · 구구 ${facts}</small></td><td class="rm">${rev?`${rev}${due?` <small class="t-due">오늘 ${due}</small>`:''}`:'–'}</td><td class="rm">${s.attempts_7d||0}</td><td class="rm">${s.week_pts==null?'–':NUM(s.week_pts)}</td></tr>`).join('');
    $$('.tRows .t-num',app).forEach(b=>b.onclick=()=>openStu(b.closest('tr').dataset.sid));renderOmr(L)}
  /* ── 📅 이번 주 한눈에 (주 1회 대면 수업 준비) ── */
  function weekRows(){const L=curList(),t=today(),wk=Date.now()-7*864e5,D=range(7).map(i=>addDays(t,i-6));
    return L.map(s=>{const x=dataSummary(s.data||{}),M=OBJ(OBJ(s.data)._me),days=new Set((Array.isArray(M.days)?M.days:[]).concat(M.last?[M.last]:[])),on=D.map(d=>days.has(d)),n=on.filter(Boolean).length,cp=cpInfo(s),rd=raidInfo(s),f=[];
      if(!s.last_seen||Date.parse(s.last_seen)<wk)f.push(['hi','7일 넘게 안 들어왔어요']);else if(!n)f.push(['mid','들어왔지만 공부한 날이 없어요']);
      if(x.due>=5)f.push(['mid',`복습 ${x.due}문제 밀림`]);
      if(x.goal&&x.goal.diff)f.push(['mid',`고른 길 ${goalBy(x.goal.k).ic} ≠ 추천 ${goalBy(x.goal.rec).ic}`]);
      if(x.calcErrs.length&&NUM(x.calcErrs[0].n)>=2){const e=x.calcErrs[0],tp=CALC.find(c=>c.id===e.tid);f.push(['mid',`같은 실수: ${tp?tp.nm:e.tid} ${e.n}회`])}
      if(s.locked)f.push(['hi','비밀번호 잠김']);
      return{s,x,D,on,n,cp,rd,f}})}
  function renderWeek(){const body=$('.tWkRows',app);if(!body)return;const R=weekRows(),wd=d=>{const[y,m,dd]=d.split('-').map(Number);return'일월화수목금토'[new Date(y,m-1,dd).getDay()]};
    const studied=R.filter(r=>r.n).length,avgD=R.length?(R.reduce((a,r)=>a+r.n,0)/R.length):0,cpLeft=R.reduce((a,r)=>a+r.cp.left,0),care=R.filter(r=>r.f.length).length;
    $('.tWkTiles',app).innerHTML=`<div class="t-tile"><small>지난 7일 공부한 학생</small><b>${studied}<small class="t-of"> / ${R.length}</small></b></div><div class="t-tile"><small>평균 공부한 날</small><b>${avgD.toFixed(1)}<small class="t-of">일</small></b></div><div class="t-tile"><small>챙길 학생</small><b>${care}</b></div><div class="t-tile"><small>🎫 남은 쿠폰 (모두)</small><b>${cpLeft}</b></div>`;
    body.innerHTML=R.length?R.map(({s,D,on,n,cp,rd,f})=>`<tr data-sid="${esc(s.sid)}"><td class="l"><button type="button" class="t-num">${nameH(s)}</button>${goalBadge(s.data)}</td>
      <td><span class="t-wdays" aria-label="지난 7일 중 ${n}일">${D.map((d,i)=>`<span class="t-wd ${on[i]?'on':''} ${i===6?'td':''}" title="${d.slice(5).replace('-','/')} (${wd(d)}) ${on[i]?'공부했어요':'안 했어요'}">${wd(d)}</span>`).join('')}</span> <b class="rm t-wn">${n}일</b></td>
      <td class="${!s.last_seen||Date.parse(s.last_seen)<Date.now()-7*864e5?'t-old':''}">${relTime(s.last_seen)}</td><td class="rm">${s.attempts_7d||0}</td><td class="rm">${s.week_pts==null?'–':NUM(s.week_pts)}</td>
      <td class="rm">${rd.g?`${rd.w} / ${rd.g}`:'–'}</td>
      <td class="t-cpc">${cpCell(s.sid,cp)}</td>
      <td class="l t-care">${f.length?f.map(([k,v])=>`<span class="t-flag ${k}">${esc(v)}</span>`).join(''):'<span class="muted">괜찮아요 🙂</span>'}</td></tr>`).join('')
      :`<tr><td colspan="8" class="muted">이 반에는 아직 학생이 없어요.</td></tr>`;
    wireRows(body)}
  const cpCell=(sid,cp)=>cp.got?`<b class="rm ${cp.left?'t-cpl':''}">${cp.left}장</b>${cp.left?` <button type="button" class="t-mini t-cpu" data-sid="${esc(sid)}">사용함</button>`:''}${cp.used?` <button type="button" class="t-mini t-cpb" data-sid="${esc(sid)}" title="사용 1장을 되돌려요">↶</button>`:''}<br><small class="muted">모은 ${cp.got} · 쓴 ${cp.used}${cp.pcs?` · 조각 ${cp.pcs}/3`:''}</small>`:`<span class="muted">${cp.pcs?`조각 ${cp.pcs}/3`:'–'}</span>`;
  function wireRows(body){$$('.t-num',body).forEach(b=>b.onclick=()=>openStu(b.closest('tr').dataset.sid));
    $$('.t-cpu',body).forEach(b=>b.onclick=()=>cpUse(b.dataset.sid,1));$$('.t-cpb',body).forEach(b=>b.onclick=()=>cpUse(b.dataset.sid,-1))}
  $('.tWkCopy',app).onclick=async()=>{const R=weekRows();if(!R.length){toast('복사할 학생이 없어요.');return}
    const txt=`[${scopeNm()}] ${today()} 이번 주 메모\n`+R.map(({s,n,cp,rd,f})=>`- ${nameT(s)}: ${n}일 공부 · 7일 풀이 ${s.attempts_7d||0} · 이번 주 ${NUM(s.week_pts)}포인트${rd.g?` · 보스 ${rd.w}승/${rd.g}판`:''}${cp.left?` · 쿠폰 ${cp.left}장`:''}${f.length?` · 챙길 점: ${f.map(x=>x[1]).join(', ')}`:''}`).join('\n');
    try{await navigator.clipboard.writeText(txt);toast('수업 메모를 복사했어요. 메모장이나 카톡에 붙여 넣으세요.')}catch(e){const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('수업 메모를 복사했어요.')}catch(_){toast('복사하지 못했어요.')}ta.remove()}};
  /* ── ⚔️ 오늘의 보스 도전: 학생별 기록 (방과후 반에서도 보여요) ── */
  function renderRaid(){const body=$('.tRaidRows',app);if(!body)return;const t=today(),need=typeof RAID!=='undefined'?RAID.NEED_LES:3;
    const lesOK=d=>ready.filter(l=>{const p=OBJ(OBJ(d)[l.id]);return NUM(p.trackDone)>=1||NUM(p.steps)>0||NUM(OBJ(p.prac).solved)>=3}).length;
    const R=curList().map(s=>{const r=OBJ(OBJ(s.data)._raid),td=OBJ(OBJ(r.days)[t]);return{s,les:lesOK(s.data),today:NUM(td.f)+NUM(td.p),w:NUM(r.w),g:NUM(r.g),beat:Object.keys(OBJ(r.beat)).length,cp:cpInfo(s)}});
    $('.tRaidNeed',app).textContent=need;
    {const b=typeof raidBoss==='function'?raidBoss():null;$('.tRaidBoss',app).textContent=b?`이번 주 보스 · ${b.nm}`:''}
    $('.tRaidTiles',app).innerHTML=`<div class="t-tile"><small>문이 열린 학생</small><b>${R.filter(r=>r.les>=need).length}<small class="t-of"> / ${R.length}</small></b></div><div class="t-tile"><small>오늘 도전한 학생</small><b>${R.filter(r=>r.today).length}</b></div><div class="t-tile"><small>한 번이라도 이긴 학생</small><b>${R.filter(r=>r.w).length}</b></div><div class="t-tile"><small>🎫 남은 쿠폰 (모두)</small><b>${R.reduce((a,r)=>a+r.cp.left,0)}</b></div>`;
    body.innerHTML=R.length?R.map(({s,les,today:n,w,g,beat,cp})=>`<tr data-sid="${esc(s.sid)}"><td class="l"><button type="button" class="t-num">${nameH(s)}</button></td>
      <td>${les>=need?`<span class="t-flag ok">열림</span>`:`<span class="muted">${les} / ${need}</span>`}</td><td class="rm">${n||'–'}</td><td class="rm">${g?`${w} / ${g}`:'–'}</td><td class="rm">${beat||'–'}</td>
      <td class="t-cpc">${cpCell(s.sid,cp)}</td></tr>`).join('')
      :`<tr><td colspan="6" class="muted">이 반에는 아직 학생이 없어요.</td></tr>`;
    wireRows(body)}
  /* ── 문제 신고 ── */
  let repAll=false,repMissing=false;
  async function loadReports(){const box=$('.tRep',app),nb=$('.tRepN',app);if(!box)return;
    if(repMissing){box.innerHTML=`<h2>⚑ 학생 문제 신고</h2><p class="muted t-lead">서버에 <b>supabase/report.sql</b>을 실행하면 학생이 보낸 신고가 여기에 모여요.</p>`;return}
    let R;try{R=await API.call('hg_t_reports',{p_token:tTok(),p_all:repAll})||[]}catch(e){if(isMissingFn(e)){repMissing=true;loadReports()}else fail(e);return}
    const open=R.filter(r=>!r.done).length;if(nb){nb.hidden=!open;nb.textContent=open}
    const who=r=>r.sid?(NAMES[r.sid]?esc(NAMES[r.sid]):`${r.grade}-${r.klass}-${r.num}`):'로그인 안 함',ln=l=>{const L=LESSONS.find(x=>x.id===l);return L?`${L.no}차시`:esc(l)};
    box.innerHTML=`<div class="t-head"><h2>⚑ 학생 문제 신고 <span class="muted" style="font-size:15px">${open?`확인 안 한 것 ${open}개`:''}</span></h2><label class="t-sel"><input type="checkbox" class="tRepAll" ${repAll?'checked':''}> 확인한 것도 보기</label></div>
      ${R.length?R.map(r=>`<div class="t-rep ${r.done?'done':''}" data-id="${r.id}"><div><b>${esc(r.reason)}</b> · ${r.ptype&&PTYPE_NM[r.ptype]?esc(PTYPE_NM[r.ptype]):ln(r.lesson)}${r.step!=null?` · ${NUM(r.step)+1}단계`:''} <span class="muted">· ${who(r)} · ${relTime(r.created_at)}</span></div>
        ${r.note?`<div class="t-rnote">“${esc(r.note)}”</div>`:''}${r.ctx?`<div class="muted t-rctx">${esc(r.ctx)}</div>`:''}
        <div class="t-ract">${r.gen&&GEN[r.gen]&&r.seed!=null?`<button type="button" class="btn ghost t-mini tRepOpen">문제 열어 보기</button>`:''}<button type="button" class="btn ghost t-mini tRepDone">${r.done?'다시 열기':'✓ 확인했어요'}</button></div><div class="t-rprob"></div></div>`).join('')
        :'<p class="muted t-empty" style="margin:0">신고된 문제가 없어요 🙂</p>'}`;
    $('.tRepAll',box).onchange=e=>{repAll=e.target.checked;loadReports()};
    $$('.t-rep',box).forEach(d=>{const r=R.find(x=>String(x.id)===d.dataset.id);
      const o=$('.tRepOpen',d);if(o)o.onclick=()=>{const h=$('.t-rprob',d);if(h.innerHTML){h.innerHTML='';return}try{renderProblem(h,GEN[r.gen](+r.seed),{mode:'steps',visual:true})}catch(e){h.textContent='문제를 다시 만들지 못했어요.'}};
      $('.tRepDone',d).onclick=async()=>{try{await API.call('hg_t_report_done',{p_token:tTok(),p_id:r.id,p_done:!r.done});loadReports()}catch(e){fail(e)}}})}
  /* ── 점검 학습지: 학생이 직접 찍어 채점한 점수 ── */
  function renderOmr(L){const box=$('.tOmr',app);if(!box)return;const by={};
    L.forEach(s=>{const O=OBJ(OBJ(s.data)._omr);Object.keys(O).forEach(k=>{if(O[k]&&typeof O[k]==='object')(by[k]=by[k]||[]).push({s,x:O[k]})})});
    const last=k=>Math.max(...by[k].map(r=>+r.x.at||0)),ks=Object.keys(by).sort((a,b)=>last(b)-last(a));
    if(!ks.length){box.innerHTML='';return}
    const one=k=>{const R=by[k].sort((a,b)=>(a.s.num||0)-(b.s.num||0)),t=NUM(R[0].x.t),avg=(R.reduce((a,r)=>a+NUM(r.x.f),0)/R.length).toFixed(1),cnt={};
      R.forEach(r=>(Array.isArray(r.x.w)?r.x.w:[]).forEach(i=>cnt[i]=(cnt[i]||0)+1));const hard=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([i,c])=>`${NUM(i)}번(${c}명)`).join(', ');
      return`<details class="t-omr" ${k===ks[0]?'open':''}><summary><b>문제지 ${esc(k)}</b> · ${R.length}명 · 처음 점수 평균 <b>${avg}</b>/${t}${hard?` · 많이 틀린 문제 ${hard}`:''}</summary>
        <div class="tablewrap"><table class="omr-tbl"><tr><th>학생</th><th>처음 점수</th><th>다시 찍은 점수</th><th>틀린 문제</th><th>찍은 때</th></tr>${R.map(({s,x})=>`<tr><td>${nameH(s)}</td><td><b>${NUM(x.f)}</b>/${NUM(x.t)}</td><td>${NUM(x.n)>1?`${NUM(x.s)}/${NUM(x.t)}`:'-'}</td><td>${(Array.isArray(x.w)?x.w:[]).map(NUM).join(', ')||'다 맞음'}</td><td>${x.at?relTime(new Date(+x.at).toISOString()):''}</td></tr>`).join('')}</table></div></details>`};
    box.innerHTML=`<h3 style="margin:16px 0 6px">📷 점검 학습지 · 학생이 직접 채점한 점수</h3><p class="muted t-lead" style="margin:0 0 6px">학생이 처음 찍은 점수가 남아요. 틀린 문제를 고쳐 다시 찍으면 그 점수도 함께 보여요.</p>${ks.slice(0,6).map(one).join('')}`}

  $('.tCsv',app).onclick=()=>{const L=curList();if(!L.length){toast('내려받을 학생이 없어요.');return}
    const head=['이름(이 기기)','학년','반','번호','최근 접속','포인트','연속 일수',...ready.flatMap(l=>[...T_TAB_NM,'완료 걸음'].map(k=>`${l.no}차시 ${k}`)),'연습 푼 문제','기초 연산 별','구구단 익힘(36칸)','취약 구구단','자주 나온 연산 실수','기초 연산 시작점','복습 대기','오늘 복습','최근 7일 풀이','이번 주 데미지','잠김'];
    const rows=L.map(s=>{const x=dataSummary(s.data);const wf=(x.weakFacts||[]).slice(0,4).map(f=>f.k+(f.w?`(${f.w})`:'')).join(' ');const ce=(x.calcErrs||[]).slice(0,2).map(e=>{const tp=CALC.find(c=>c.id===e.tid);return`[${tp?tp.nm:e.tid}] ${stripTags(e.m)}(${e.n})`}).join(' / ');return[NAMES[s.sid]||'',s.grade,s.klass,s.num,s.last_seen?new Date(s.last_seen).toLocaleString('ko-KR'):'',x.pts,x.streak,...x.les.flatMap((a,i)=>[...a.map(v=>v?'O':''),T_TR_NM[(x.lesTr&&x.lesTr[i])||0]]),x.solved,x.calc,x.facts,wf,ce,x.diag?(x.plan.length?x.plan.map(id=>{const t=CALC.find(c=>c.id===id);return t?t.nm:id}).join(' → '):'기초 튼튼'):'아직',x.rev,x.due,NUM(s.attempts_7d),s.week_pts==null?'':NUM(s.week_pts),s.locked?'잠김':'']});
    const cell=v=>{v=String(v);return/[",\r\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
    const csv='﻿'+[head,...rows].map(r=>r.map(cell).join(',')).join('\r\n');
    const nm=scopeNm().replace(/\s+/g,'_').replace(/[\\/:*?"<>|]/g,'');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=`한걸음수학_${nm}_${today()}.csv`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)};

  /* ── 많이 막히는 단계 ── */
  async function loadStats(){const note=$('.tStatsNote',app);note.innerHTML='';
    try{let rows;const L=curList();
      if(SC==='all'||statsSidsMissing)rows=await API.call('hg_t_step_stats',{p_token:tTok(),p_days:days});
      else{try{rows=await API.call('hg_t_step_stats_sids',{p_token:tTok(),p_days:days,p_sids:L.map(s=>s.sid)})}
        catch(e){if(!isMissingFn(e))throw e;statsSidsMissing=true;rows=await API.call('hg_t_step_stats',{p_token:tTok(),p_days:days})}}
      if(statsSidsMissing&&SC!=='all')note.innerHTML='<p class="muted t-lead">지금은 <b>모든 학생</b> 기준이에요. 반별로 보려면 <code>supabase/group.sql</code>을 한 번 실행해 주세요.</p>';
      renderStats(rows||[])}catch(e){fail(e)}}
  function renderStats(rows){const host=$('.tStats',app);if(!rows.length){host.innerHTML='<p class="muted">아직 모인 기록이 없어요. 학생들이 단계 문제를 풀면 여기에 쌓여요.</p>';return}
    rows=rows.filter(x=>Object.prototype.hasOwnProperty.call(PTYPE_NM,x.ptype));if(!rows.length){host.innerHTML='<p class="muted">아직 모인 기록이 없어요. 학생들이 단계 문제를 풀면 여기에 쌓여요.</p>';return}
    const groups={};rows.forEach(x=>{const k=x.lesson+'|'+x.ptype;(groups[k]=groups[k]||{lesson:x.lesson,ptype:x.ptype,gen:x.gen,seed:x.seed,steps:[]}).steps.push(x)});
    const label=(g,st)=>{try{if(!Object.prototype.hasOwnProperty.call(GEN,g.gen))throw 0;const x=GEN[g.gen](Number(g.seed)).steps[st.step-1];return x.tag||stripTags(x.q)}catch(e){return st.step+'단계'}};
    const G=Object.values(groups).map(g=>{g.n=Math.max(...g.steps.map(x=>x.n));g.max=Math.max(...g.steps.map(x=>x.n?x.wrong/x.n:0));return g}).sort((a,b)=>b.max-a.max);
    const all=[];G.forEach(g=>g.steps.forEach(st=>{if(st.n>=3)all.push({g,st,rate:st.wrong/st.n})}));all.sort((a,b)=>b.rate-a.rate);const top=all[0];
    host.innerHTML=(top?`<div class="box" style="margin-top:0"><b>가장 많이 막힌 단계</b> · ${PTYPE_NM[top.g.ptype]||esc(top.g.ptype)}<br>(${top.st.step}) ${esc(label(top.g,top.st))} — ${top.st.n}번 풀이 중 <b>${top.st.wrong}번</b> 틀렸어요 (${Math.round(top.rate*100)}%)</div>`:'')+
      `<div class="t-stats">${G.map(g=>`<div class="t-stat"><div class="t-stat-h"><b>${PTYPE_NM[g.ptype]||esc(g.ptype)}</b><span class="muted">${g.n}번 풀었어요</span></div><ol>${g.steps.map(st=>{const w=st.n?Math.round(st.wrong/st.n*100):0,rv=st.n?Math.round(st.revealed/st.n*100):0;
        return`<li><span class="sl">(${st.step}) ${esc(label(g,st))}</span><span class="bar" role="img" aria-label="틀림 ${w}%, 정답 확인 ${rv}%"><i class="w" style="width:${w}%"></i><i class="r" style="width:${rv}%"></i></span><span class="pc rm">${w}%</span></li>`}).join('')}</ol></div>`).join('')}</div>
      <p class="muted t-legend"><i class="lw"></i>한 번이라도 틀린 비율 <i class="lr"></i>세 번 틀려서 정답을 확인한 비율</p>`}
  $$('.tDays button',app).forEach(b=>b.onclick=()=>{days=+b.dataset.d;$$('.tDays button',app).forEach(x=>x.classList.toggle('on',x===b));loadStats()});

  /* ── 학생 관리 ── */
  const parseLines=t=>String(t||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(x=>{const m=x.match(/^(\d)\s*(?:학년|[-.\/\s,\t])\s*(\d{1,2})\s*(?:반|[-.\/\s,\t])\s*(\d{1,2})\s*번?\s*[,\t]?\s*(.*)$/);
    if(!m)return{bad:x};const g=+m[1],k=+m[2],n=+m[3];if(!(g>=1&&g<=3&&k>=1&&k<=20&&n>=1&&n<=50))return{bad:x};return{g,k,n,sid:`${g}-${k}-${n}`,name:m[4].replace(/^[-:·\s]+/,'').trim().slice(0,20)}});
  async function setMembers(gid,sids,on){const r=await API.call('hg_t_group_members',{p_token:tTok(),p_id:gid,p_sids:sids,p_on:on});const g=GROUPS.find(x=>x.id===gid);
    if(g){const S=new Set(g.sids);sids.forEach(s=>on?ROSTER.some(x=>x.sid===s)&&S.add(s):S.delete(s));g.sids=[...S].sort()}return r}
  function bulkDel(host){const L=curList(),box=$('.t-bulkbox',host);if(!L.length){toast('지울 학생이 없어요.');return}
    const nm=scopeNm();box.hidden=false;box.innerHTML=`<span class="t-confirm"><b>${esc(nm)}</b> 학생 <b>${L.length}명</b>의 계정과 풀이 기록·포인트를 모두 지울까요? 되돌릴 수 없어요.${grp()?' (반에서 빼기가 아니라 학생 계정 자체를 지워요)':''}<br>계속하려면 <b>삭제</b>라고 적어 주세요. <input class="tBulkIn" style="width:70px" autocomplete="off"> <button type="button" class="t-mini t-yes" disabled>${L.length}명 지우기</button><button type="button" class="t-mini t-no">아니요</button></span>`;
    const inp=$('.tBulkIn',box),yes=$('.t-yes',box);inp.oninput=()=>{yes.disabled=inp.value.trim()!=='삭제'};inp.focus();
    $('.t-no',box).onclick=()=>{box.hidden=true;box.innerHTML=''};
    yes.onclick=async()=>{yes.disabled=true;$('.t-no',box).disabled=true;inp.disabled=true;let n=0;
      try{for(const s of L){await API.call('hg_t_delete_student',{p_token:tTok(),p_sid:s.sid});delete NAMES[s.sid];n++;yes.textContent=`지우는 중 ${n}/${L.length}`}}
      catch(er){saveNames();box.hidden=true;box.innerHTML='';if(!fail(er))toast(`${n}명을 지우고 멈췄어요.`);loadAll();return}
      saveNames();box.hidden=true;box.innerHTML='';toast(`학생 ${n}명을 지웠어요.`);loadAll()}}
  function renderPeople(){const host=$('.tPeople',app),g=grp(),L=curList();
    if(groupsOff){host.innerHTML=`<div class="card panel"><h2>방과후 반 만들기</h2><p style="margin:0">방과후 반을 쓰려면 Supabase 대시보드의 <b>SQL Editor</b>에서 <code>supabase/group.sql</code> 내용을 붙여 넣고 한 번 <b>Run</b> 해 주세요. 실행한 뒤 [새로 고침]을 누르면 나타나요.</p></div>`+createClassCard();wireCreate(host);return}
    const others=GROUPS.filter(x=>!g||x.id!==g.id);
    host.innerHTML=`<div class="card panel"><div class="t-head"><h2>방과후 반</h2></div>
        <div class="t-groups">${GROUPS.map(x=>`<button type="button" class="t-gcard ${g&&g.id===x.id?'on':''}" data-v="g:${x.id}"><b>${esc(x.name)}</b><span>${x.sids.length}명</span></button>`).join('')}
         <form class="t-gcard new tGNew"><input class="inp" maxlength="30" placeholder="새 반 이름 (예: 화목 방과후)" aria-label="새 방과후 반 이름" required><button class="btn primary">만들기</button></form></div></div>
      <div class="card panel"><div class="t-head"><h2>${esc(scopeNm())} 학생 <span class="muted" style="font-size:17px">${L.length}명</span></h2>
         <span class="t-tools">${g?`<button type="button" class="btn ghost tGRen">이름 바꾸기</button><button type="button" class="btn ghost tGDel">반 지우기</button>`:''}${L.length?`<button type="button" class="btn ghost tBulkDel">학생 ${L.length}명 모두 지우기</button>`:''}</span></div><div class="t-bulkbox" hidden></div>
        ${L.length?`<div class="t-mbar"><label class="t-sel"><input type="checkbox" class="tAllChk"> 모두 고르기</label><span class="muted tChkN">0명 골랐어요</span>
          ${g?'<button type="button" class="btn ghost tOut1" disabled>반에서 빼기</button>':''}
          ${others.length?`<span class="t-sel">고른 학생을 <select class="inp sel tToG">${others.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select><button type="button" class="btn ghost tInto" disabled>에 넣기</button></span>`:''}</div>
         <div class="tablewrap"><table class="t t-mem"><thead><tr><th></th><th>이름 <small>(이 기기에만 저장)</small></th><th>학년-반-번호</th><th>최근 접속</th><th>다른 방과후 반</th></tr></thead><tbody>${L.map(s=>`<tr data-sid="${esc(s.sid)}"><td><input type="checkbox" class="tChk" aria-label="${code(s)} 고르기"></td>
           <td class="l"><input class="inp t-nmi" value="${esc(NAMES[s.sid]||'')}" placeholder="이름" maxlength="20" aria-label="${code(s)} 이름"></td><td><button type="button" class="t-num">${code(s)}</button>${s.locked?' <span class="t-lock">잠김</span>':''}</td><td class="${!s.last_seen||Date.parse(s.last_seen)<Date.now()-7*864e5?'t-old':''}">${relTime(s.last_seen)}</td>
           <td class="l t-gtags">${GROUPS.filter(x=>x.sids.includes(s.sid)&&(!g||x.id!==g.id)).map(x=>`<span class="t-tag">${esc(x.name)}</span>`).join('')||'<span class="muted">–</span>'}</td></tr>`).join('')}</tbody></table></div>`
         :`<p class="muted">${g?'아직 이 반에 학생이 없어요. 아래에서 넣어 주세요.':'학생이 없어요.'}</p>`}</div>
      ${g?`<div class="card panel"><h2>학생 넣기</h2><p class="muted t-lead">한 줄에 한 명씩 <b>학년-반-번호 이름</b>을 적어요. 아직 계정이 없는 학생은 바로 만들고 비밀번호를 보여 줘요. 이름은 빼도 돼요.</p>
         <textarea class="inp tAddTxt" rows="5" style="width:100%" placeholder="1-3-5 김민수&#10;1-4-12 이서연&#10;2학년 1반 7번 박지호"></textarea>
         <div class="next-row" style="margin:10px 0 0"><button type="button" class="btn primary tAddGo">${esc(g.name)}에 넣기</button></div><div class="flmsg tAddMsg" role="status"></div><div class="tNew"></div>
         ${classes().length?`<h3>정규 반에서 골라 넣기</h3><div class="t-pick"><label class="t-sel">반 <select class="inp sel tPickC">${classes().map(([k,v])=>`<option value="${k}">${v.g}학년 ${v.k}반</option>`).join('')}</select></label><div class="chips tPickL"></div><button type="button" class="btn ghost tPickGo" disabled>고른 학생 넣기</button></div>`:''}</div>`:''}
      ${createClassCard()}`;
    $$('.t-gcard[data-v]',host).forEach(b=>b.onclick=()=>{SC=b.dataset.v;lsSet('hangeoreum-t-scope',SC);LVS={};render();loadLive();loadStats()});
    $('.tGNew',host).onsubmit=async e=>{e.preventDefault();const i=$('input',e.target),nm=i.value.trim();if(!nm)return;
      try{const r=await API.call('hg_t_group_save',{p_token:tTok(),p_id:null,p_name:nm});GROUPS.push({id:r.id,name:nm,sids:[]});SC='g:'+r.id;lsSet('hangeoreum-t-scope',SC);toast(`‘${nm}’ 반을 만들었어요. 이제 학생을 넣어 주세요.`);render();loadLive();loadStats();setTimeout(()=>{const t=$('.tAddTxt',app);if(t)t.focus()},50)}catch(er){fail(er)}};
    {const bd=$('.tBulkDel',host);if(bd)bd.onclick=()=>bulkDel(host)}
    if(g){$('.tGRen',host).onclick=async()=>{const nm=(window.prompt('새 반 이름',g.name)||'').trim();if(!nm||nm===g.name)return;try{await API.call('hg_t_group_save',{p_token:tTok(),p_id:g.id,p_name:nm});g.name=nm;render()}catch(er){fail(er)}};
      $('.tGDel',host).onclick=e=>{const b=e.currentTarget,keep=b.parentElement.innerHTML,box=b.parentElement;box.innerHTML=`<span class="t-confirm">‘${esc(g.name)}’ 반을 지울까요? 학생 계정과 기록은 그대로예요. <button type="button" class="t-mini t-yes">지우기</button><button type="button" class="t-mini t-no">아니요</button></span>`;
        $('.t-no',box).onclick=()=>{box.innerHTML=keep;renderPeople()};$('.t-yes',box).onclick=async()=>{try{await API.call('hg_t_group_del',{p_token:tTok(),p_id:g.id});GROUPS=GROUPS.filter(x=>x.id!==g.id);SC=null;toast('방과후 반을 지웠어요.');render();loadLive();loadStats()}catch(er){fail(er)}}}}
    /* 이름 칸: 고치면 바로 저장 (이 기기) */
    $$('.t-nmi',host).forEach(i=>i.onchange=()=>{const sid=i.closest('tr').dataset.sid,v=i.value.trim().slice(0,20);if(v)NAMES[sid]=v;else delete NAMES[sid];saveNames();renderSide();renderRoster();toast('이름을 저장했어요 (이 기기).')});
    $$('.t-mem .t-num',host).forEach(b=>b.onclick=()=>openStu(b.closest('tr').dataset.sid));
    const chks=$$('.tChk',host),upd=()=>{const n=chks.filter(c=>c.checked).length;const cn=$('.tChkN',host);if(cn)cn.textContent=`${n}명 골랐어요`;[$('.tOut1',host),$('.tInto',host)].forEach(b=>{if(b)b.disabled=!n})};
    chks.forEach(c=>c.onchange=upd);const all=$('.tAllChk',host);if(all)all.onchange=()=>{chks.forEach(c=>c.checked=all.checked);upd()};
    const picked=()=>chks.filter(c=>c.checked).map(c=>c.closest('tr').dataset.sid);
    if($('.tOut1',host))$('.tOut1',host).onclick=async()=>{const S=picked();try{await setMembers(g.id,S,false);toast(`${S.length}명을 ‘${g.name}’에서 뺐어요. 계정과 기록은 그대로예요.`);render();loadLive();loadStats()}catch(er){fail(er)}};
    if($('.tInto',host))$('.tInto',host).onclick=async()=>{const S=picked(),gid=+$('.tToG',host).value,G=GROUPS.find(x=>x.id===gid);try{await setMembers(gid,S,true);toast(`${S.length}명을 ‘${G.name}’에 넣었어요.`);render()}catch(er){fail(er)}};
    if(g){$('.tAddGo',host).onclick=()=>addLines(g);
      const pc=$('.tPickC',host);if(pc){const draw=()=>{const k=pc.value,L2=ROSTER.filter(s=>`${s.grade}-${s.klass}`===k);
        $('.tPickL',host).innerHTML=L2.map(s=>{const inG=g.sids.includes(s.sid);return`<button type="button" class="chip t-pk ${inG?'off':''}" data-sid="${esc(s.sid)}" ${inG?'disabled title="이미 들어 있어요"':''}>${s.num}${NAMES[s.sid]?` ${esc(NAMES[s.sid])}`:'번'}</button>`}).join('');
        $$('.t-pk:not([disabled])',host).forEach(b=>b.onclick=()=>{b.classList.toggle('on');$('.tPickGo',host).disabled=!$$('.t-pk.on',host).length})};
        pc.onchange=draw;draw();
        $('.tPickGo',host).onclick=async()=>{const S=$$('.t-pk.on',host).map(b=>b.dataset.sid);try{await setMembers(g.id,S,true);toast(`${S.length}명을 넣었어요.`);render();loadLive();loadStats()}catch(er){fail(er)}}}}
    wireCreate(host)}
  async function addLines(g){const P=parseLines($('.tAddTxt',app).value),m=$('.tAddMsg',app),bad=P.filter(x=>x.bad),ok=P.filter(x=>!x.bad);
    if(!ok.length){m.className='flmsg bad';m.textContent=bad.length?`이렇게 적어 주세요: 1-3-5 김민수 (알아보지 못한 줄: ${bad.slice(0,3).map(x=>x.bad).join(' / ')})`:'넣을 학생을 적어 주세요.';return}
    m.className='flmsg';m.textContent='넣는 중…';const made=[];
    try{for(const x of ok){if(!ROSTER.some(s=>s.sid===x.sid)){const R=await API.call('hg_t_create_students',{p_token:tTok(),p_grade:x.g,p_klass:x.k,p_from:x.n,p_to:x.n})||[];R.filter(r=>!r.existed).forEach(r=>made.push({sid:x.sid,g:x.g,k:x.k,num:x.n,pin:r.pin}))}
        if(x.name)NAMES[x.sid]=x.name}
      saveNames();ROSTER=await API.call('hg_t_overview',{p_token:tTok()})||[];
      const sids=[...new Set(ok.map(x=>x.sid))],before=new Set(g.sids);await setMembers(g.id,sids,true);const added=sids.filter(s=>!before.has(s)).length;
      $('.tAddTxt',app).value='';render();loadLive();loadStats();
      const m2=$('.tAddMsg',app);m2.innerHTML=`<span class="ok">${CHECK} ‘${esc(g.name)}’에 ${added}명을 넣었어요.</span>${made.length?` 그중 ${made.length}명은 새 계정이에요. 비밀번호는 지금만 보여요.`:''}${bad.length?` <span class="t-due">알아보지 못한 줄 ${bad.length}개는 건너뛰었어요.</span>`:''}`;
      showNew($('.tNew',app),made)}
    catch(er){m.textContent='';fail(er)}}
  function createClassCard(){return`<details class="card panel t-cc"><summary><b>정규 반 번호 한꺼번에 만들기</b> <span class="muted">· 한 반 전체 계정을 만들 때</span></summary>
     <p class="muted t-lead">번호마다 4자리 비밀번호를 만들어요. 이미 있는 번호는 건너뛰어요. 비밀번호는 <b>한 번만</b> 보여 주니 꼭 복사하거나 인쇄해 두세요.</p>
     <form class="t-create"><label>학년 <select class="inp sel" name="g">${[1,2,3].map(g=>`<option>${g}</option>`).join('')}</select></label><label>반 <select class="inp sel" name="k">${range(20).map(i=>`<option>${i+1}</option>`).join('')}</select></label>
      <label>번호 <input class="inp num" name="a" type="number" min="1" max="50" value="1"> ~ <input class="inp num" name="b" type="number" min="1" max="50" value="30"></label><button class="btn primary">만들기</button></form><div class="flmsg tCMsg" role="status"></div><div class="tNew2"></div></details>`}
  function wireCreate(host){const f0=$('.t-create',host);if(!f0)return;f0.onsubmit=async e=>{e.preventDefault();const f=e.target,m=$('.tCMsg',host);const g=+f.g.value,k=+f.k.value,a=+f.a.value,b=+f.b.value;m.textContent='만드는 중…';
    try{const R=await API.call('hg_t_create_students',{p_token:tTok(),p_grade:g,p_klass:k,p_from:a,p_to:b})||[];const made=R.filter(x=>!x.existed),skip=R.filter(x=>x.existed);
      ROSTER=await API.call('hg_t_overview',{p_token:tTok()})||[];renderScope();renderSide();renderRoster();
      m.textContent=`${g}학년 ${k}반: 새로 ${made.length}명${skip.length?`, 이미 있던 ${skip.length}명은 건너뛰었어요`:''}.`;showNew($('.tNew2',host),made.map(x=>({sid:x.sid||`${g}-${k}-${x.num}`,g,k,num:x.num,pin:x.pin})))}
    catch(er){m.textContent='';fail(er)}}}
  function showNew(host,list){if(!host)return;if(!list.length){host.innerHTML='';return}
    const who=x=>`${x.g}학년 ${x.k}반 ${x.num}번${NAMES[x.sid]?' '+NAMES[x.sid]:''}`,text=list.map(x=>`${who(x)}\t${x.pin}`).join('\n');
    host.innerHTML=`<div class="t-newbox"><div class="t-head"><b>새로 만든 비밀번호 (${list.length}명)</b><span><button type="button" class="btn ghost t-copy">목록 복사</button> <button type="button" class="btn ghost t-cards">카드로 보기</button></span></div>
      <div class="t-pinlist">${list.map(x=>`<span><b>${x.g}-${x.k}-${x.num}${NAMES[x.sid]?' '+esc(NAMES[x.sid]):''}</b> <span class="rm">${x.pin}</span></span>`).join('')}</div><div class="t-cardhost"></div></div>`;
    $('.t-copy',host).onclick=async()=>{try{await navigator.clipboard.writeText(text);toast('복사했어요. 엑셀이나 메모장에 붙여 넣으세요.')}catch(er){const ta=el(`<textarea class="inp" rows="6" style="width:100%;margin-top:8px"></textarea>`);ta.value=text;host.appendChild(ta);ta.select();toast('복사가 막혀 있어요. 아래 칸을 직접 복사해 주세요.')}};
    $('.t-cards',host).onclick=()=>{$('.t-cardhost',host).innerHTML=`<div class="pincards">${list.map(x=>`<div class="pincard"><span class="pc-brand">한 걸음 수학</span><b>${x.g}학년 ${x.k}반 ${x.num}번</b>${NAMES[x.sid]?`<span class="pc-nm">${esc(NAMES[x.sid])}</span>`:''}<span>비밀번호</span><span class="pc-pin rm">${x.pin}</span><small>학년·반·번호를 고르고 비밀번호를 누르세요</small></div>`).join('')}</div><p><button type="button" class="btn t-print">인쇄하기</button> <span class="muted" style="font-size:14px">인쇄가 안 되면 화면을 캡처해서 나눠 주세요.</span></p>`;
      $('.t-print',host).onclick=()=>{document.body.classList.add('printing-cards');try{window.print()}catch(er){}setTimeout(()=>document.body.classList.remove('printing-cards'),500)}}}

  /* ── 학생 자세히 (옆에서 열리는 창) ── */
  const dr=$('.t-drawer',app);
  const closeStu=()=>{dr.hidden=true;document.body.classList.remove('t-dopen')};
  $('.t-dback',dr).onclick=closeStu;document.addEventListener('keydown',function k(e){if(!document.body.contains(dr)){document.removeEventListener('keydown',k);return}if(e.key==='Escape'&&!dr.hidden)closeStu()});
  async function openStu(sid){const s=bySid(sid);if(!s)return;const x=dataSummary(s.data||{}),lv=LVS[sid]||{},body=$('.t-dbody',dr);
    dr.hidden=false;document.body.classList.add('t-dopen');
    body.innerHTML=`<div class="t-dh"><div><div class="t-dcode">${code(s)}</div><input class="inp t-dname" value="${esc(NAMES[sid]||'')}" placeholder="이름 적기 (이 기기에만 저장)" maxlength="20" aria-label="이름"></div><button type="button" class="t-dx" aria-label="닫기">✕</button></div>
      <button type="button" class="btn primary t-peek">👀 이 학생 화면 보기 <small>(보기 전용)</small></button>
      <div class="t-dstat"><div><small>최근 접속</small><b>${relTime(s.last_seen)}</b></div><div><small>포인트</small><b class="rm">${x.pts}</b></div><div><small>연속</small><b class="rm">${x.streak}일</b></div><div><small>7일 풀이</small><b class="rm">${s.attempts_7d||0}</b></div></div>
      ${goalStuHTML(x.goal)}
      ${(()=>{const c=cpInfo(s),r=raidInfo(s);return c.got||c.pcs||r.g?`<p class="t-dcp">⚔️ 보스 도전 <b class="rm">${r.w}승 / ${r.g}판</b> · 🎫 쿠폰 남은 <b class="rm">${c.left}장</b> <small class="muted">(모은 ${c.got} · 쓴 ${c.used}${c.pcs?` · 조각 ${c.pcs}/3`:''})</small>${c.left?` <button type="button" class="t-mini t-dcpu">쿠폰 사용함</button>`:''}</p>`:''})()}
      ${lv.loc?`<p class="t-dloc">지금: ${esc(lv.loc)}${lv.help_at?' · <b class="t-due">✋ 손들었어요</b>':''}</p>`:''}
      <div class="t-dles">${ready.map((l,i)=>{const td=(x.lesTr&&x.lesTr[i])||0;return`<div title="${esc(lesTip(l))}"><span>${l.no}차시 <small class="muted">${esc(shortT(l.title))}</small></span><span class="pips">${x.les[i].map((v,j)=>`<span class="pip ${v?'on':''}" title="${T_TAB_NM[j]}"></span>`).join('')}${td?`<span class="t-tr" title="${T_TR_NM[td]} 완료">${T_TR_IC[td]}</span>`:''}</span></div>`}).join('')}</div>
      ${groupsOff?'':`<h3>방과후 반</h3><div class="chips t-dg">${GROUPS.map(g=>`<button type="button" class="chip ${g.sids.includes(sid)?'on':''}" data-g="${g.id}">${g.sids.includes(sid)?CHECK+' ':''}${esc(g.name)}</button>`).join('')||'<span class="muted">아직 방과후 반이 없어요.</span>'}</div>`}
      <h3>기초 연산 취약점 · 오개념</h3><div class="t-calc-box"><div><b>시작점 찾기</b> ${x.diag?(x.plan.length?x.plan.map(id=>{const t=CALC.find(c=>c.id===id);return t?esc(t.nm):id}).join(' → '):'기초 튼튼'):'<span class="muted">아직 안 함</span>'} · 별 <b class="rm">${x.calc}</b> · 구구단 <b class="rm">${x.facts}/36</b></div>${x.weakFacts.length?`<div style="margin-top:6px"><b>취약 구구단</b> ${x.weakFacts.map(f=>`<span class="t-wchip">${esc(f.k)}${f.w?` · 틀림 ${f.w}`:''}</span>`).join('')}</div>`:''}${x.calcErrs.length?`<div style="margin-top:8px"><b>자주 나온 오개념 TOP 5</b><ul>${x.calcErrs.slice(0,5).map(e=>{const tp=CALC.find(c=>c.id===e.tid);return`<li><b>${esc(tp?tp.nm:e.tid)}</b> (${e.n}회): ${esc(stripTags(e.m))}</li>`}).join('')}</ul></div>`:'<div class="muted" style="margin-top:6px">아직 기록된 기초 연산 오개념이 없어요.</div>'}${(()=>{const cs=OBJ(OBJ(s.data)._calc),done=CALC.filter(t=>NUM(OBJ(cs[t.id]).stars)>0);return done.length?`<div style="margin-top:8px"><b>별 받은 주제</b> ${done.map(t=>`<span class="t-schip">${esc(t.nm)} ★${Math.min(3,NUM(cs[t.id].stars))}</span>`).join('')}</div>`:''})()}</div>
      <h3>최근 풀이</h3><div class="t-datt"><span class="muted">불러오는 중…</span></div>
      <h3>계정</h3><div class="t-dact"><button type="button" class="btn ghost t-reset">비밀번호 새로 만들기</button><button type="button" class="btn ghost t-del">기록 모두 지우기</button></div>${s.locked?'<p class="t-due" style="margin:6px 0 0">비밀번호를 여러 번 틀려 잠겨 있어요. 새 비밀번호를 만들면 풀려요.</p>':''}`;
    {const u=$('.t-dcpu',body);if(u)u.onclick=()=>{cpUse(sid,1);openStu(sid)}}
    $('.t-peek',body).onclick=()=>{closeStu();peekStart(s.data,nameT(s))};
    $('.t-dx',body).onclick=closeStu;$('.t-dx',body).focus({preventScroll:true});
    $('.t-dname',body).onchange=e=>{const v=e.target.value.trim().slice(0,20);if(v)NAMES[sid]=v;else delete NAMES[sid];saveNames();renderSide();renderRoster();renderPeople();toast('이름을 저장했어요 (이 기기).')};
    $$('.t-dg .chip',body).forEach(b=>b.onclick=async()=>{const gid=+b.dataset.g,G=GROUPS.find(g=>g.id===gid),on=!G.sids.includes(sid);b.disabled=true;
      try{await setMembers(gid,[sid],on);toast(on?`‘${G.name}’에 넣었어요.`:`‘${G.name}’에서 뺐어요.`);render();openStu(sid)}catch(er){fail(er);b.disabled=false}});
    const act=$('.t-dact',body),conf=(q,yes)=>{const keep=act.innerHTML;act.innerHTML=`<span class="t-confirm">${q} <button type="button" class="t-mini t-yes">네</button><button type="button" class="t-mini t-no">아니요</button></span>`;
      $('.t-no',act).onclick=()=>openStu(sid);$('.t-yes',act).onclick=()=>{act.innerHTML='<span class="muted">처리하는 중…</span>';yes()}};
    $('.t-reset',act).onclick=()=>conf('새 비밀번호를 만들까요? 지금 로그인된 기기에서는 다시 로그인해야 해요.',async()=>{try{const r=await API.call('hg_t_reset_pin',{p_token:tTok(),p_sid:sid});act.innerHTML=`<div class="t-newpin">새 비밀번호 <b class="rm">${esc(r.pin)}</b> <span class="muted">· 지금만 보여요. 학생에게 알려 주세요.</span></div>`;s.locked=false}catch(er){fail(er)}});
    $('.t-del',act).onclick=()=>conf('이 학생의 계정과 기록을 모두 지울까요? 되돌릴 수 없어요.',async()=>{try{await API.call('hg_t_delete_student',{p_token:tTok(),p_sid:sid});delete NAMES[sid];saveNames();toast('학생을 지웠어요.');closeStu();loadAll()}catch(er){fail(er)}});
    try{const A=await API.call('hg_t_student_attempts',{p_token:tTok(),p_sid:sid,p_limit:30})||[];const box=$('.t-datt',body);if(!box)return;
      box.innerHTML=A.length?`<ul class="t-att">${A.map(a=>`<li><span class="muted">${relTime(a.created_at)}</span> <b>${esc(attName(a))}</b> · ${KIND_KO[a.kind]||a.kind} · ${a.good?'<span class="ok">'+CHECK+' 해냄</span>':'<span class="bad">정답 확인함</span>'}${a.wrongs?` · 틀린 횟수 ${a.wrongs}`:''}${a.step_wrongs&&a.mode==='steps'?` <span class="muted">(단계별 틀림 ${a.step_wrongs.join(' · ')})</span>`:''}</li>`).join('')}</ul>`:'<span class="muted">아직 풀이 기록이 없어요.</span>'}
    catch(e){fail(e)}}

  /* ── 게임 (정규 반 단위) ── */
  function loadGames(){const sel=$('.tGClass',app),C=classes();if(!sel)return;
    sel.innerHTML=C.length?C.map(([k,v])=>`<option value="${k}"${k===GK?' selected':''}>${v.g}학년 ${v.k}반</option>`).join(''):'<option>학생 없음</option>';loadTBoss();loadTBB()}
  $('.tGClass',app).onchange=e=>{GK=e.target.value;lsSet('hangeoreum-t-class',GK);loadTBoss();loadTBB()};
  const gk=()=>GK&&/^\d+-\d+$/.test(GK)?GK.split('-').map(Number):null;
  async function loadTBoss(){const box=$('.tBoss',app);if(!box)return;const G=gk();if(!G||!CBOSS()){box.hidden=true;return}
    const[g,k]=G,body=$('.tBossBody',box);box.hidden=false;$('.tBossTools',box).hidden=false;
    try{const st=await API.call('hg_t_class_status',{p_token:tTok(),p_grade:g,p_klass:k});if(!st)return;const pl=bossPlan(st),c=pl.cur,zero=(st.students||[]).filter(x=>!NUM(x.pts)).map(x=>x.num);
      const sel=$('.tPer',box);if(![...sel.options].some(o=>+o.value===st.per_student))sel.insertAdjacentHTML('beforeend',`<option value="${NUM(st.per_student)}">${NUM(st.per_student)}</option>`);sel.value=String(st.per_student);
      $('.tBV',box).href=`#bossview-${g}-${k}`;
      body.innerHTML=`<div class="boss-mini"><div class="bm-pic">${c?bossSVG(c.boss,90,0.5):winSVG().replace('width="220" height="220"','width="84" height="84"')}</div><div class="bm-info"><b>${c?`${c.k+1}단계 · ${c.boss.nm}`:'이번 주 보스를 모두 물리쳤어요'}</b>${c?`<div class="hpbar"><i style="width:${Math.max(0,Math.min(100,(c.end-pl.dmg)/c.hp*100)).toFixed(1)}%"></i></div><small>체력 ${c.end-pl.dmg} / ${c.hp} · 이번 주 데미지 ${pl.dmg} · 물리친 보스 ${pl.defeated.length}마리</small>`:''}</div></div>
        <p style="margin:0">이번 주 참여 <b>${NUM(st.active)}/${NUM(st.members)}명</b>${st.members?(zero.length?` · 아직 데미지를 주지 않은 번호: ${zero.join(', ')}`:' · 모두 참여했어요!'):''}</p>
        <p class="muted" style="margin:6px 0 0;font-size:14px">1단계 보스 체력 = 학생 1명당 체력 × 학생 수(최소 5명). 단계가 오를수록 1.5배, 2배…로 늘어나요. 주 중간에 바꾸면 이번 주 보스 체력도 바로 바뀌어요. 학생 화면에는 개인 순위가 보이지 않아요.</p>`}
    catch(e){if(isMissingFn(e)){$('.tBossTools',box).hidden=true;body.innerHTML=gameSqlHelp()}else fail(e)}}
  async function loadTBB(){const box=$('.tBB',app);if(!box)return;const G0=gk();if(!G0){box.hidden=true;return}
    const[g,k]=G0,body=$('.tBBbody',box);box.hidden=false;$('.tBBTools',box).hidden=false;
    try{const R=await API.call('hg_t_bb',{p_token:tTok(),p_grade:g,p_klass:k});if(!R)return;
      $('.tBBon',box).checked=!!R.on;$('.tBBmax',box).value=String(NUM(R.max));
      const lab=p=>!p?'–':(p.grade===g&&p.klass===k?`${NUM(p.num)}번`:`${NUM(p.grade)}-${NUM(p.klass)}-${NUM(p.num)}`);
      const res=x=>x.status==='done'?(x.winner==='draw'?'무승부':`${lab(x.winner==='host'?x.host:x.guest)} 승${x.reason==='forfeit'?' (기권)':x.reason==='timeout'?' (시간 초과)':''}`):({waiting:'기다리는 중',setup:'준비 중',playing:'경기 중',cancelled:'취소'})[x.status]||'';
      const G=(R.games||[]).filter(x=>x.status!=='cancelled').slice(0,15),S=R.students||[];
      body.innerHTML=`<p style="margin:0 0 8px">${R.on?'켜져 있어요.':'<b>꺼져 있어요.</b> 학생들은 새 경기를 열 수 없고, 진행 중인 경기는 멈춰요.'} · 지금 경기 중 <b>${NUM(R.active)}</b>판 · 오늘 <b>${NUM(R.today)}</b>판</p>
        ${S.length?`<div class="tablewrap"><table class="t"><thead><tr><th>번호</th><th>경기</th><th>승</th><th>패</th><th>무</th><th>포인트 손익</th></tr></thead><tbody>${S.map(x=>`<tr><td>${NUM(x.num)}번</td><td class="rm">${NUM(x.games)}</td><td class="rm">${NUM(x.w)}</td><td class="rm">${NUM(x.l)}</td><td class="rm">${NUM(x.d)}</td><td class="rm ${Number(x.net)<0?'t-due':''}">${Number(x.net)>0?'+':''}${Number(x.net)||0}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted" style="margin:0">아직 끝난 경기가 없어요.</p>'}
        ${G.length?`<h3 style="margin:14px 0 4px;font-size:16px">최근 경기</h3><div class="tablewrap"><table class="t"><thead><tr><th>시각</th><th>방장</th><th>상대</th><th>판돈</th><th>자리</th><th>결과</th></tr></thead><tbody>${G.map(x=>`<tr><td>${relTime(x.at)}</td><td>${lab(x.host)}</td><td>${lab(x.guest)}</td><td class="rm">${NUM(x.stake)||'친선'}</td><td class="rm">${NUM(x.digits)}</td><td>${res(x)}</td></tr>`).join('')}</tbody></table></div>`:''}
        <p class="muted" style="margin:8px 0 0;font-size:14px">판돈은 학생의 ‘쓸 수 있는 포인트’에서만 오가요. 학습 현황의 포인트(모은 포인트)와 보스 데미지는 바뀌지 않아요. 한 학생당 하루 10판까지.</p>`}
    catch(e){if(isMissingFn(e)){$('.tBBTools',box).hidden=true;body.innerHTML=gameSqlHelp().replace('보스전을 열려면','숫자야구 대결과 보스전을 열려면')}else fail(e)}}
  const setBB=async()=>{const G=gk();if(!G)return;try{await API.call('hg_t_bb_set',{p_token:tTok(),p_grade:G[0],p_klass:G[1],p_on:$('.tBBon',app).checked,p_max:+$('.tBBmax',app).value});toast('숫자야구 설정을 바꿨어요.');loadTBB()}catch(er){fail(er)}};
  $('.tBBon',app).onchange=setBB;$('.tBBmax',app).onchange=setBB;
  $('.tPer',app).onchange=async e=>{const G=gk();if(!G)return;try{await API.call('hg_t_set_boss',{p_token:tTok(),p_grade:G[0],p_klass:G[1],p_per_student:+e.target.value});toast('보스 체력을 바꿨어요.');loadTBoss()}catch(er){fail(er)}};

  /* ── 설정: 비밀번호 · 이름표 ── */
  $('.t-pw',app).onsubmit=async e=>{e.preventDefault();const f=e.target,m=$('.tPMsg',app);try{const r=await API.call('hg_t_change_password',{p_token:tTok(),p_old:f.o.value,p_new:f.n.value});m.textContent=r&&r.ok?'비밀번호를 바꿨어요.':(r&&r.msg)||'바꾸지 못했어요.';if(r&&r.ok)f.reset()}catch(er){fail(er)}};
  $('.tNmCopy',app).onclick=async()=>{const t=Object.entries(NAMES).sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true})).map(([k,v])=>`${k} ${v}`).join('\n');const m=$('.tNmMsg',app);
    if(!t){m.textContent='아직 적어 둔 이름이 없어요.';return}$('.tNames',app).value=t;try{await navigator.clipboard.writeText(t);m.textContent=`이름 ${Object.keys(NAMES).length}개를 복사했어요.`}catch(er){$('.tNames',app).select();m.textContent='위 칸을 직접 복사해 주세요.'}};
  $('.tNmLoad',app).onclick=()=>{const P=parseLines($('.tNames',app).value).filter(x=>!x.bad&&x.name);P.forEach(x=>NAMES[x.sid]=x.name);saveNames();$('.tNmMsg',app).textContent=P.length?`이름 ${P.length}개를 불러왔어요.`:'불러올 이름이 없어요. 1-3-5 김민수처럼 적어 주세요.';render()};

  $('.tRefresh',app).onclick=()=>loadAll();
  $('.tOut',app).onclick=async()=>{const t=tTok();tSet(null);API.call('hg_logout',{p_token:t}).catch(()=>{});toast('교사 화면에서 로그아웃했어요.');viewTeacher()};
  setTab(TAB);loadAll();
}
window.addEventListener('hashchange',()=>{if(location.hash!=='#teacher'){document.body.classList.remove('t-wide','t-dopen')}});