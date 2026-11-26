/* ───────── 좌표 해전 (T11): 좌표평면에 배를 숨기고 (x, y)를 불러 맞히는 2인 대결 ─────────
   서버 함수는 supabase/sea.sql(hg_sea_*). 포인트는 숫자야구와 같은 장부(쓸 수 있는 포인트)를 써요.
   단계: 하 −3~3 · 판을 눌러 쏘기 · 판돈 최대 10 / 중 −3~3 · x, y를 골라 쏘기 / 상 −4~4 · 고른 점의 위치(사분면·축)까지 맞혀야 쏘기
   전역 이름은 viewSea · viewSeaGame · viewSeaCpu 세 개만 만들어요(라우터: js/07-print-omr-boot.js). */
(() => {
  const LV={easy:{k:'easy',nm:'하',n:3,lens:[3,2,2],tap:true,where:false,rounds:25,cap:10,d:'−3~3 · 판을 눌러 쏘기'},
    mid:{k:'mid',nm:'중',n:3,lens:[3,2,2],tap:false,where:false,rounds:25,d:'−3~3 · x, y를 골라 쏘기'},
    hard:{k:'hard',nm:'상',n:4,lens:[4,3,2],tap:false,where:true,rounds:30,d:'−4~4 · 좌표 + 위치 맞히기'}};
  const EASY_MAX=10;
  const WHERE={q1:'제1사분면',q2:'제2사분면',q3:'제3사분면',q4:'제4사분면',x:'x축 위',y:'y축 위',o:'원점'};
  const whereOf=(x,y)=>x===0&&y===0?'o':y===0?'x':x===0?'y':x>0&&y>0?'q1':x<0&&y>0?'q2':x<0?'q3':'q4';
  const sn=v=>v<0?'−'+(-v):String(v);
  const pt=(x,y)=>`(${sn(x)}, ${sn(y)})`;
  const key=(x,y)=>x+','+y;
  const lvOf=st=>LV[st&&st.lv]||LV.easy;

  function randomShips(lv){for(let t=0;t<500;t++){const used=new Set(),out=[];let ok=true;
      for(const L of lv.lens){let placed=false;for(let k=0;k<80&&!placed;k++){const hor=Math.random()<.5,
          x0=-lv.n+Math.floor(Math.random()*(2*lv.n+2-(hor?L:1))),y0=-lv.n+Math.floor(Math.random()*(2*lv.n+2-(hor?1:L)));
          const cells=[];for(let i=0;i<L;i++)cells.push(hor?[x0+i,y0]:[x0,y0+i]);
          if(cells.every(([x,y])=>Math.abs(x)<=lv.n&&Math.abs(y)<=lv.n&&!used.has(key(x,y)))){cells.forEach(([x,y])=>used.add(key(x,y)));out.push(cells);placed=true}}
        if(!placed){ok=false;break}}
      if(ok)return out}return null}

  /* 좌표평면 판 그리기. marks: {'x,y':'miss'|'hit'|'sunk'}, ships: 보여 줄 배, sel: 고른 점, pick: 누를 수 있는지 */
  function boardSVG(lv,{marks={},ships=[],sel=null,pick=false,small=false}={}){
    const n=lv.n,S=small?26:42,pad=S*0.9,W=2*n*S+2*pad,c=v=>pad+(v+n)*S,r=v=>pad+(n-v)*S;let g='';
    for(let v=-n;v<=n;v++){g+=`<line x1="${c(v)}" y1="${r(n)}" x2="${c(v)}" y2="${r(-n)}" class="sg"/><line x1="${c(-n)}" y1="${r(v)}" x2="${c(n)}" y2="${r(v)}" class="sg"/>`}
    g+=`<line x1="${c(-n)-pad*.6}" y1="${r(0)}" x2="${c(n)+pad*.6}" y2="${r(0)}" class="sax" marker-end="url(#sar)"/><line x1="${c(0)}" y1="${r(-n)+pad*.6}" x2="${c(0)}" y2="${r(n)-pad*.6}" class="sax" marker-end="url(#sar)"/>`;
    g+=`<text x="${c(n)+pad*.55}" y="${r(0)-6}" class="sal">x</text><text x="${c(0)+7}" y="${r(n)-pad*.45}" class="sal">y</text>`;
    if(!small)for(let v=-n;v<=n;v++){if(v){g+=`<text x="${c(v)}" y="${r(0)+17}" class="stk" text-anchor="middle">${sn(v)}</text><text x="${c(0)-7}" y="${r(v)+5}" class="stk" text-anchor="end">${sn(v)}</text>`}}
    if(!small)g+=`<text x="${c(0)-6}" y="${r(0)+17}" class="stk" text-anchor="end">O</text>`;
    ships.forEach(sh=>{const xs=sh.map(p=>p[0]),ys=sh.map(p=>p[1]),x1=c(Math.min(...xs)),x2=c(Math.max(...xs)),y1=r(Math.max(...ys)),y2=r(Math.min(...ys)),h=S*.56;
      g+=`<rect x="${x1-h/2}" y="${y1-h/2}" width="${x2-x1+h}" height="${y2-y1+h}" rx="${h/2}" class="sship${sh.sunk?' sunk':''}"/>`});
    for(let x=-n;x<=n;x++)for(let y=-n;y<=n;y++){const m=marks[key(x,y)],cx=c(x),cy=r(y),on=sel&&sel[0]===x&&sel[1]===y;
      g+=`<g class="spt${pick&&!m?' can':''}${on?' on':''}" data-x="${x}" data-y="${y}"><circle cx="${cx}" cy="${cy}" r="${S*.42}" class="shit-area"/>`;
      if(m==='miss')g+=`<circle cx="${cx}" cy="${cy}" r="${S*.2}" class="smiss"/>`;
      else if(m==='hit'||m==='sunk')g+=`<path d="M${cx-S*.2} ${cy-S*.2}l${S*.4} ${S*.4}M${cx+S*.2} ${cy-S*.2}l${-S*.4} ${S*.4}" class="shitx"/>`;
      else g+=`<circle cx="${cx}" cy="${cy}" r="${small?2:3}" class="sdot"/>`;
      if(on)g+=`<circle cx="${cx}" cy="${cy}" r="${S*.36}" class="ssel"/>`;g+='</g>'}
    return`<svg class="sea-svg${small?' small':''}" viewBox="0 0 ${W} ${W}" role="img" aria-label="좌표평면 바다"><defs><marker id="sar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>${g}</svg>`}

  const RULES=`<ul class="bb-rule">
    <li>좌표평면 바다에 내 배 3척이 숨어 있어요. 번갈아 가며 <b>(x, y)</b>를 불러 상대 배를 찾아요.</li>
    <li>배가 있으면 <b>맞음!</b>, 없으면 <b>빗나감</b>. 배의 칸을 모두 맞히면 <b>가라앉아요</b>. 상대 배를 먼저 모두 가라앉히면 이겨요.</li>
    <li><b>하</b> −3~3, 판을 눌러 쏘기 · <b>중</b> −3~3, x와 y를 골라 쏘기 · <b>상</b> −4~4, 고른 점이 <b>어느 사분면(또는 축)</b>인지까지 맞혀야 쏠 수 있어요(틀리면 그 차례는 넘어가요).</li>
    <li>방장이 먼저 쏴요. 방장이 먼저 끝내도 상대에게 같은 횟수만큼 기회가 있어서, 둘 다 끝내면 비겨요. 정한 횟수(하·중 25번, 상 30번)가 끝나면 더 많이 맞힌 사람이 이겨요.</li>
    <li>한 번에 60초 안에 쏴야 해요. 두 번 연속 시간을 넘기면 져요.</li>
    <li>이기면 건 포인트의 2배를 받고, 지면 건 포인트를 잃어요. 비기면 돌려받아요. <b>하</b> 단계는 <b>10포인트까지만</b> 걸 수 있어요. 숫자야구와 같은 '쓸 수 있는 포인트'를 쓰고, 모은 포인트 기록과 보스 데미지는 바뀌지 않아요.</li>
    <li>하루 10판까지 할 수 있어요.</li></ul>`;
  const practiceHTML=()=>`<div class="card panel"><h2>컴퓨터와 연습</h2><p class="muted" style="margin-top:0">포인트 없이 혼자 연습해요. 인터넷이 없어도 돼요.</p><div class="next-row" style="justify-content:flex-start;margin:0">${Object.values(LV).map(l=>`<a class="btn" href="#sea-cpu-${l.k}">${l.nm} <small class="muted">${l.d}</small></a>`).join('')}</div></div>`;
  const offHTML=()=>`<div class="card panel"><p style="margin:0">친구와 대결은 선생님이 서버에 좌표 해전 설정을 추가하면 열려요. 그동안 컴퓨터와 연습할 수 있어요.</p></div>`;
  const head=t=>{crumbs.innerHTML=`<span class="sep">›</span>${t?`<a href="#sea">좌표 해전</a><span class="sep">›</span><span>${t}</span>`:'<span>좌표 해전</span>'}`};
  const SEA={id:null,timer:null,tick:null,st:null,sig:'',busy:false,cpu:null,sel:null,wh:null,ships:null,deadline:0,lobT:null,off:false,msg:''};
  const stop=()=>{clearInterval(SEA.timer);clearInterval(SEA.tick);SEA.timer=SEA.tick=null};

  /* 로비 */
  window.viewSea=function(){head('');stop();pinKeyHandler=null;
    app.innerHTML=`<div class="unit-head"><div><h1>⚓ 좌표 해전</h1><p>좌표평면 바다에 숨은 상대 배를 <b>(x, y)</b>로 찾아요. 친구와 <b>쓸 수 있는 포인트</b>를 걸고 대결해요.</p></div></div>
      <details class="card panel bb-rules"><summary><b>규칙 보기</b></summary>${RULES}</details><div id="seaLobby"></div>`;
    const host=$('#seaLobby',app);
    if(!isStudent()){host.innerHTML=`<div class="card panel"><p style="margin-top:0">친구와 대결하려면 로그인해 주세요.</p><a class="btn primary" href="#login">로그인하기</a></div>`+practiceHTML();return}
    if(SEA.off){host.innerHTML=offHTML()+practiceHTML();return}
    host.innerHTML='<div class="card panel"><p class="muted" style="margin:0">불러오는 중…</p></div>';
    let stake=null,lvk='easy';
    const load=async()=>{try{const L=await API.call('hg_sea_lobby',{p_token:AUTH.token});if(!host.isConnected)return;setBBLedger(L.ledger);render(L)}
      catch(e){if(!host.isConnected)return;if(isMissingFn(e)){SEA.off=true;host.innerHTML=offHTML()+practiceHTML()}else if(isAuthErr(e))authExpired();else host.innerHTML=`<div class="card panel"><p style="margin:0">${esc(e.message)}</p></div>`}};
    function render(L){const stakes=[0,5,10,20,50].filter(v=>v<=NUM(L.max)&&!(lvk==='easy'&&v>EASY_MAX));if(stake==null||!stakes.includes(stake)||stake>NUM(L.available))stake=0;
      const rec=L.record||{},R=Array.isArray(L.recent)?L.recent:[],O=Array.isArray(L.open)?L.open:[],me={grade:L.grade,klass:L.klass},left=Math.max(0,NUM(L.limit)-NUM(L.today));
      host.innerHTML=`${L.mine?`<div class="card panel bb-mine"><b>진행 중인 경기</b> · 방 ${esc(L.mine.code)} · ${({waiting:'친구를 기다리는 중',setup:'배를 숨기는 중',playing:'경기 중'})[L.mine.status]||''} <a class="btn primary" href="#sea-${NUM(L.mine.id)}">돌아가기</a></div>`:''}
       <div class="card panel bb-wallet"><div class="stat"><small>쓸 수 있는 포인트</small><b class="rm">${Math.max(0,NUM(L.available))}</b></div><div class="stat"><small>오늘 남은 경기</small><b>${left}판</b></div><div class="stat"><small>내 전적</small><b>${NUM(rec.w)}승 ${NUM(rec.l)}패 ${NUM(rec.d)}무</b></div></div>
       ${!L.on?`<div class="card panel"><p style="margin:0"><b>선생님이 지금은 대결 게임을 꺼 두었어요.</b> 나중에 다시 와 주세요.</p></div>`:`
       <div class="bb-grid">
        <div class="card panel"><h2>방 만들기</h2><div class="cap">난이도</div><div class="seg seaLv">${Object.values(LV).map(l=>`<button type="button" data-v="${l.k}" class="${lvk===l.k?'on':''}">${l.nm}</button>`).join('')}</div>
          <p class="muted" style="margin:6px 0 0;font-size:14px">${LV[lvk].d}${lvk==='easy'?` · 판돈 최대 ${EASY_MAX}포인트`:''}</p>
          <div class="cap" style="margin-top:12px">판돈 <span class="muted" style="font-weight:400">(포인트)</span></div><div class="seg seaStake">${stakes.map(v=>`<button type="button" data-v="${v}" class="${v===stake?'on':''}" ${v>NUM(L.available)?'disabled':''}>${v?v:'친선'}</button>`).join('')}</div>
          <p style="margin:14px 0 0"><button type="button" class="btn primary seaMake" ${left?'':'disabled'}>방 만들기</button></p><div class="flmsg seaMakeMsg" role="status"></div></div>
        <div class="card panel"><h2>방 번호로 들어가기</h2><p class="muted" style="margin-top:0">친구가 알려 준 방 번호 4자리를 누르세요.</p><div class="seaCodePad"></div><div class="flmsg seaJoinMsg" role="status"></div></div>
       </div>
       <div class="card panel"><h2>우리 반 열린 방</h2>${O.length?`<ul class="bb-open">${O.map(o=>`<li><span><b>${NUM(o.num)}번</b>의 방 · ${NUM(o.stake)?`판돈 <b class="rm">${NUM(o.stake)}</b>`:'친선'} · 난이도 ${esc((LV[o.lv]||LV.easy).nm)}</span><button type="button" class="btn seaJoin" data-code="${esc(o.code)}" ${NUM(o.stake)>NUM(L.available)||!left?'disabled':''}>들어가기</button></li>`).join('')}</ul>`:'<p class="muted" style="margin:0">지금 열린 방이 없어요. 방을 만들어 친구에게 번호를 알려 주세요.</p>'}</div>`}
       ${R.length?`<div class="card panel"><h2>최근 경기</h2><ul class="bb-recent">${R.map(g=>{const res=g.winner==='draw'?'무':g.winner===g.me?'승':'패';return`<li><span class="bb-res ${res==='승'?'w':res==='패'?'l':'d'}">${res}</span><span>${josa(bbWho(g.opp,me),'과','와')} ${esc((LV[g.lv]||LV.easy).nm)} 단계${NUM(g.stake)?` · 판돈 ${NUM(g.stake)}`:' · 친선'}</span><span class="rm ${Number(g.delta)>0?'up':Number(g.delta)<0?'down':''}">${Number(g.delta)>0?'+':''}${Number(g.delta)||0}</span></li>`}).join('')}</ul></div>`:''}
       ${practiceHTML()}`;
      if(!L.on)return;
      $$('.seaLv button',host).forEach(b=>b.onclick=()=>{lvk=b.dataset.v;if(lvk==='easy'&&stake>EASY_MAX)stake=EASY_MAX;render(L)});
      $$('.seaStake button',host).forEach(b=>b.onclick=()=>{stake=+b.dataset.v;$$('.seaStake button',host).forEach(x=>x.classList.toggle('on',x===b))});
      $('.seaMake',host).onclick=async e=>{const m=$('.seaMakeMsg',host),bt=e.currentTarget;bt.disabled=true;m.textContent='방을 만드는 중…';
        try{await settleSync();const r=await API.call('hg_sea_create',{p_token:AUTH.token,p_stake:stake,p_lv:lvk});if(r&&r.ok)location.hash='#sea-'+r.game;else{m.textContent=(r&&r.msg)||'방을 만들지 못했어요.';if(r&&r.game)m.innerHTML+=` <a href="#sea-${NUM(r.game)}">경기로 가기</a>`;bt.disabled=false}}
        catch(er){m.textContent=er.message;bt.disabled=false}};
      const join=async(code,reset)=>{const m=$('.seaJoinMsg',host);m.textContent='들어가는 중…';
        try{await settleSync();const r=await API.call('hg_sea_join',{p_token:AUTH.token,p_code:code});if(r&&r.ok){location.hash='#sea-'+r.game;return}
          m.textContent=(r&&r.msg)||'들어가지 못했어요.';if(r&&r.game)m.innerHTML+=` <a href="#sea-${NUM(r.game)}">경기로 가기</a>`;if(reset)reset()}catch(er){m.textContent=er.message;if(reset)reset()}};
      const pad=digitPad({len:4,zero:true,auto:true,onSubmit:(v,reset)=>join(v,reset)});$('.seaCodePad',host).appendChild(pad);bbKeys(pad);
      $$('.seaJoin',host).forEach(b=>b.onclick=()=>{b.disabled=true;join(b.dataset.code,()=>{b.disabled=false})})}
    load();clearInterval(SEA.lobT);SEA.lobT=setInterval(()=>{if(!host.isConnected){clearInterval(SEA.lobT);return}if(document.visibilityState!=='visible')return;
      if($('.dslot.on',host))return;load()},9000)};

  /* 경기 (서버) */
  window.viewSeaGame=function(id){head('경기');stop();pinKeyHandler=null;
    if(!isStudent()){location.hash='#sea';return}
    Object.assign(SEA,{id,cpu:null,st:null,sig:'',sel:null,wh:null,ships:null,msg:''});
    app.innerHTML='<div id="seaHost"><div class="card panel"><p class="muted" style="margin:0">불러오는 중…</p></div></div>';
    SEA.act={ships:v=>API.call('hg_sea_ships',{p_token:AUTH.token,p_game:id,p_ships:v}),fire:(x,y,w)=>API.call('hg_sea_fire',{p_token:AUTH.token,p_game:id,p_x:x,p_y:y,p_where:w}),leave:()=>API.call('hg_sea_leave',{p_token:AUTH.token,p_game:id})};
    let n=0;poll();SEA.timer=setInterval(()=>{n++;if(!$('#seaHost')){stop();return}if(document.visibilityState!=='visible')return;const st=SEA.st;if(st&&st.my_turn&&n%3)return;poll()},1500)};
  async function poll(){if(SEA.busy||SEA.cpu)return;SEA.busy=true;const id=SEA.id;
    try{const st=await API.call('hg_sea_state',{p_token:AUTH.token,p_game:id});if(SEA.id!==id||!$('#seaHost'))return;setBBLedger(st.ledger);show(st)}
    catch(e){if(isMissingFn(e)){SEA.off=true;location.hash='#sea'}else if(isAuthErr(e))authExpired();else if(/찾을 수 없어요/.test(e.message)){stop();const h=$('#seaHost');if(h)h.innerHTML=`<div class="card panel"><p>경기를 찾을 수 없어요.</p><a class="btn" href="#sea">좌표 해전 처음으로</a></div>`}}
    finally{SEA.busy=false}}

  const REASON={expired:'15분 동안 아무도 들어오지 않아 방이 닫혔어요.',setup_timeout:'3분 안에 배를 숨기지 않아 경기가 취소됐어요.',replaced:'새 경기를 시작해서 이 방은 닫혔어요.',points:'포인트가 모자란 사람이 있어서 경기가 취소됐어요.',left:'방이 닫혔어요.'};
  const RES={miss:'빗나감',hit:'맞음!',sunk:'가라앉힘!',wrong:'위치 틀림',timeout:'시간 초과'};
  function marksFor(st,who){const M={};(st.shots||[]).filter(s=>s.who===who&&s.x!=null&&s.res!=='wrong').forEach(s=>{M[key(s.x,s.y)]=s.res==='miss'?'miss':'hit'});return M}
  function sunkShips(st,who){return(st.shots||[]).filter(s=>s.who===who&&s.res==='sunk'&&Array.isArray(s.sunk)).map(s=>Object.assign(s.sunk.slice(),{sunk:true}))}
  const hitsOf=(st,who)=>Object.values(marksFor(st,who)).filter(v=>v==='hit').length;
  const totalOf=lv=>lv.lens.reduce((a,b)=>a+b,0);
  function vsHead(st){const lv=lvOf(st),meP=st.me==='host'?st.host:st.guest,opP=st.me==='host'?st.guest:st.host;
    return`<div class="bb-top"><div class="bb-p"><span class="bb-av">${avatarThumb(myEq(),54)}</span><span><b>나</b><small>${st.cpu?'':esc(bbWho(meP,meP))}</small></span></div>
     <div class="bb-vs"><b>VS</b><small>${st.cpu?'연습 · 포인트 없음':NUM(st.stake)?`판돈 ${NUM(st.stake)}포인트`:'친선 경기'} · 난이도 ${lv.nm}</small></div>
     <div class="bb-p opp"><span><b>${st.cpu?'컴퓨터':esc(bbWho(opP,meP))}</b><small>${st.cpu?'연습 상대':'상대'}</small></span><span class="bb-av">${st.cpu?bossSVG(BOSSES[0],54,0.5):'⚓'}</span></div></div>`}
  function logHTML(st,who){const L=(st.shots||[]).filter(s=>s.who===who);if(!L.length)return'<li class="empty muted">아직 없어요</li>';
    return L.slice().reverse().map(s=>`<li class="r-${s.res}"><span class="rn">${NUM(s.rnd)}</span><span class="rm">${s.x!=null?pt(s.x,s.y):''}</span><b>${RES[s.res]||''}</b>${s.res==='wrong'&&s.x!=null?`<small class="muted">정답: ${WHERE[whereOf(s.x,s.y)]}</small>`:''}</li>`).join('')}

  function show(st){const host=$('#seaHost');if(!host)return;const sig=JSON.stringify(st,(k,v)=>k==='turn_left'?undefined:v);
    SEA.deadline=Date.now()+(NUM(st.turn_left)||0)*1000;const prev=SEA.st;SEA.st=st;if(sig===SEA.sig)return;SEA.sig=sig;draw(host,st,prev)}
  function draw(host,st,prev){clearInterval(SEA.tick);const lv=lvOf(st),leave=t=>`<button type="button" class="btn ghost seaLeave">${t}</button>`;
    if(st.status==='waiting'){host.innerHTML=`<div class="card panel bb-wait"><div class="muted">방 번호</div><div class="bb-code rm">${bbSpaced(st.code)}</div>
      <p>친구에게 방 번호를 알려 주세요. 친구가 「방 번호로 들어가기」에서 이 번호를 누르면 시작해요.</p><p class="muted">${NUM(st.stake)?`판돈 ${NUM(st.stake)}포인트`:'친선 경기'} · 난이도 ${lv.nm}(${lv.d}) · 15분 동안 아무도 안 들어오면 방이 닫혀요</p>${leave('방 닫기')}</div>`;wireLeave(host,false);return}
    if(st.status==='setup'){if(!st.my_ships&&!SEA.ships)SEA.ships=randomShips(lv);const ships=st.my_ships||SEA.ships;
      host.innerHTML=`<div class="card panel">${vsHead(st)}<h2 style="margin-top:14px">내 배 숨기기</h2>
        <p style="margin-top:0">배 ${lv.lens.length}척(${lv.lens.map(l=>l+'칸').join(' · ')})이 바다에 놓였어요. 마음에 들 때까지 섞고 <b>이대로 숨기기</b>를 눌러요. 상대에게는 보이지 않아요.</p>
        <div class="sea-one">${boardSVG(lv,{ships})}</div>
        ${st.my_ships?`<p class="bb-secret">숨기기 끝 ${CHECK}</p><p class="muted">${st.opp_ready?'상대도 숨겼어요. 곧 시작해요!':'상대가 배를 숨기는 중이에요…'}</p>`
          :`<p class="next-row" style="justify-content:flex-start"><button type="button" class="btn seaShuffle">🔀 다시 섞기</button><button type="button" class="btn primary seaHide">이대로 숨기기</button></p><div class="flmsg seaSetMsg" role="status"></div>`}
        <p style="margin-bottom:0">${leave('나가기')}</p></div>`;
      const sh=$('.seaShuffle',host);if(sh)sh.onclick=()=>{SEA.ships=randomShips(lv);SEA.sig='';show(st)};
      const hd=$('.seaHide',host);if(hd)hd.onclick=async()=>{hd.disabled=true;const m=$('.seaSetMsg',host);try{const r=await SEA.act.ships(SEA.ships);if(r&&r.ok===false){m.textContent=r.msg;hd.disabled=false;return}SEA.sig='';if(SEA.cpu)show(SEA.cpu.state());else poll()}catch(e){m.textContent=e.message;hd.disabled=false}};
      wireLeave(host,false);return}
    if(st.status==='playing'){const opp=st.me==='host'?'guest':'host',mine=marksFor(st,st.me),oppSunk=sunkShips(st,st.me);
      Object.keys(mine).forEach(k=>{if(oppSunk.some(s=>s.some(p=>key(p[0],p[1])===k)))mine[k]='sunk'});
      const myShips=(st.my_ships||[]).map(s=>Object.assign(s.slice(),{sunk:s.every(p=>marksFor(st,opp)[key(p[0],p[1])])}));
      const turn=st.paused?'선생님이 잠시 멈췄어요. 기다려 주세요.':st.my_turn?`내 차례예요! 쏠 곳을 골라요. ${st.cpu?'':'<span class="bb-timer"></span>'}`:`${st.cpu?'컴퓨터':'상대'}가 생각 중… ${st.cpu?'':'<span class="bb-timer"></span>'}`;
      const can=st.my_turn&&!st.paused,sel=SEA.sel;
      const picker=lv.tap?`<p class="sea-hint">${sel?`<b class="rm">${pt(sel[0],sel[1])}</b>에 쏠까요?`:'상대 바다에서 쏠 점을 눌러요.'}</p>`
        :`<div class="sea-pick"><div class="cap">x 좌표</div><div class="seg sea-x">${range(lv).map(v=>`<button type="button" data-v="${v}" class="${sel&&sel[0]===v?'on':''}" ${can?'':'disabled'}>${sn(v)}</button>`).join('')}</div>
          <div class="cap">y 좌표</div><div class="seg sea-y">${range(lv).map(v=>`<button type="button" data-v="${v}" class="${sel&&sel[1]===v?'on':''}" ${can?'':'disabled'}>${sn(v)}</button>`).join('')}</div>
          ${lv.where?`<div class="cap">이 점은 어디에 있나요?</div><div class="seg sea-w">${Object.keys(WHERE).map(k=>`<button type="button" data-v="${k}" class="${SEA.wh===k?'on':''}" ${can?'':'disabled'}>${WHERE[k]}</button>`).join('')}</div>`:''}
          <p class="sea-hint">${sel&&sel[0]!=null&&sel[1]!=null?`<b class="rm">${pt(sel[0],sel[1])}</b>`:'x와 y를 하나씩 골라요.'}</p></div>`;
      const ready=can&&sel&&sel[0]!=null&&sel[1]!=null&&(!lv.where||SEA.wh);
      host.innerHTML=`<div class="card panel sea-board">${vsHead(st)}<div class="bb-turn ${st.paused?'paused':st.my_turn?'mine':'theirs'}" aria-live="polite">${turn}</div>
        <p class="muted sea-score">${NUM(st.round)}/${NUM(st.rounds)||lv.rounds}번째 · 내가 맞힌 칸 <b>${hitsOf(st,st.me)}</b>/${totalOf(lv)} · 상대가 맞힌 칸 <b>${hitsOf(st,opp)}</b>/${totalOf(lv)}</p>
        <div class="sea-cols"><div><h3>상대 바다 <small>여기에 쏴요</small></h3><div class="sea-enemy">${boardSVG(lv,{marks:mine,ships:oppSunk,sel:sel&&sel[0]!=null&&sel[1]!=null?sel:null,pick:can&&lv.tap})}</div>
            ${picker}<p><button type="button" class="btn primary seaFire" ${ready?'':'disabled'}>🎯 쏘기</button></p><div class="flmsg seaMsg" role="status">${esc(SEA.msg||'')}</div></div>
          <div><h3>내 바다 <small>상대가 쏜 곳</small></h3>${boardSVG(lv,{marks:marksFor(st,opp),ships:myShips,small:true})}
            <h3 style="margin-top:12px">내가 쏜 기록</h3><ol class="sea-log">${logHTML(st,st.me)}</ol></div></div>
        <p style="margin:12px 0 0">${leave(st.cpu?'연습 그만하기':'기권하기')}</p></div>`;
      if(can&&lv.tap)$$('.sea-enemy .spt.can',host).forEach(g=>g.onclick=()=>{SEA.sel=[+g.dataset.x,+g.dataset.y];SEA.msg='';SEA.sig='';show(st)});
      $$('.sea-x button',host).forEach(b=>b.onclick=()=>{SEA.sel=[+b.dataset.v,SEA.sel?SEA.sel[1]:null];SEA.msg='';SEA.sig='';show(st)});
      $$('.sea-y button',host).forEach(b=>b.onclick=()=>{SEA.sel=[SEA.sel?SEA.sel[0]:null,+b.dataset.v];SEA.msg='';SEA.sig='';show(st)});
      $$('.sea-w button',host).forEach(b=>b.onclick=()=>{SEA.wh=b.dataset.v;SEA.sig='';show(st)});
      const f=$('.seaFire',host);if(f)f.onclick=async()=>{f.disabled=true;const[x,y]=SEA.sel;
        if(mine[key(x,y)]){SEA.msg='이미 쏜 곳이에요. 다른 점을 골라요.';SEA.sig='';show(st);return}
        try{const r=await SEA.act.fire(x,y,lv.where?SEA.wh:null);if(r&&r.ok===false){SEA.msg=r.msg;SEA.sig='';show(st);return}
          SEA.msg=r.res==='wrong'?`앗, ${pt(x,y)}은(는) ${WHERE[r.where]}에 있어요. 이번 차례는 넘어가요.`:r.res==='sunk'?`${pt(x,y)} 가라앉혔어요! 🎉`:r.res==='hit'?`${pt(x,y)} 맞음!`:`${pt(x,y)} 빗나감`;
          SEA.sel=null;SEA.wh=null;if(r.res==='sunk')celebrate('');SEA.sig='';if(SEA.cpu)show(SEA.cpu.state());else poll()}catch(e){SEA.msg=e.message;SEA.sig='';show(st)}};
      wireLeave(host,true);SEA.tick=setInterval(()=>timer(host),1000);timer(host);return}
    stop();pinKeyHandler=null;
    if(st.status==='done'){const win=st.winner===st.me,drw=st.winner==='draw',d=Number(st.delta)||0,opp=st.me==='host'?'guest':'host';
      const why={solved:win?'상대 배를 모두 가라앉혔어요.':drw?'둘 다 같은 횟수에 모두 가라앉혔어요.':'상대가 먼저 내 배를 모두 가라앉혔어요.',rounds:`정한 횟수가 끝났어요. 맞힌 칸 나 ${hitsOf(st,st.me)} : 상대 ${hitsOf(st,opp)}`,timeout:win?'상대가 두 번 연속 시간을 넘겼어요.':'두 번 연속 시간을 넘겨서 졌어요.',forfeit:win?'상대가 기권했어요.':'기권했어요.'}[st.reason]||'';
      host.innerHTML=`<div class="card panel bb-done ${win?'win':drw?'draw':'lose'}">${vsHead(st)}<h2>${win?'이겼어요!':drw?'비겼어요':'아쉽게 졌어요'}</h2><p style="margin:0">${why}</p>
        ${!st.cpu&&NUM(st.stake)?`<p class="bb-delta rm">${d>0?'+':''}${d} 포인트</p>`:''}
        <div class="sea-cols"><div><h3>상대 바다</h3>${boardSVG(lv,{marks:marksFor(st,st.me),ships:st.opp_ships||[]})}</div><div><h3>내 바다</h3>${boardSVG(lv,{marks:marksFor(st,opp),ships:st.my_ships||[],small:true})}<h3 style="margin-top:12px">내가 쏜 기록</h3><ol class="sea-log">${logHTML(st,st.me)}</ol></div></div>
        <div class="next-row" style="justify-content:flex-start">${st.cpu?`<a class="btn primary" href="#sea-cpu-${esc(st.lv)}" onclick="setTimeout(()=>route(),0)">한 판 더</a>`:''}<a class="btn ${st.cpu?'':'primary'}" href="#sea">좌표 해전 처음으로</a></div></div>`;
      if(win&&prev&&prev.status==='playing')celebrate(st.cpu?'':NUM(st.stake)?`이겼어요! +${d} 포인트`:'이겼어요!');updatePill();return}
    host.innerHTML=`<div class="card panel"><h2>경기가 취소됐어요</h2><p>${REASON[st.reason]||'방이 닫혔어요.'}</p><a class="btn primary" href="#sea">좌표 해전 처음으로</a></div>`}
  const range=lv=>{const a=[];for(let v=-lv.n;v<=lv.n;v++)a.push(v);return a};
  function timer(host){const t=$('.bb-timer',host);if(!t)return;const s=Math.max(0,Math.ceil((SEA.deadline-Date.now())/1000));t.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;t.classList.toggle('low',s<=15)}
  function wireLeave(host,playing){const b=$('.seaLeave',host);if(!b)return;b.onclick=()=>{
    if(playing&&!SEA.cpu){const p=b.parentElement,keep=p.innerHTML;p.innerHTML=`<span class="t-confirm" style="font-size:15px">${NUM(SEA.st&&SEA.st.stake)?'기권하면 건 포인트를 잃어요. ':''}기권할까요? <button type="button" class="btn seaYes">기권하기</button> <button type="button" class="btn ghost seaNo">계속하기</button></span>`;
      $('.seaYes',p).onclick=async()=>{try{await SEA.act.leave()}catch(e){}SEA.sig='';poll()};$('.seaNo',p).onclick=()=>{p.innerHTML=keep;wireLeave(host,true)};return}
    (async()=>{try{await SEA.act.leave()}catch(e){}stop();location.hash='#sea'})()}}

  /* 컴퓨터와 연습 (이 기기에서만, 포인트 없음) */
  window.viewSeaCpu=function(k){head('컴퓨터와 연습');stop();pinKeyHandler=null;const lv=LV[k]||LV.easy;
    const S={status:'setup',me:'host',cpu:true,lv:lv.k,stake:0,round:1,rounds:lv.rounds,turn:null,my_ships:null,bot:randomShips(lv),shots:[],winner:null,reason:null,host:null,guest:null,paused:false,delta:0,opp_ready:true,hostSolved:null};
    const state=()=>Object.assign({},S,{my_turn:S.status==='playing'&&S.turn==='host',opp_ships:S.status==='done'?S.bot:null,shots:S.shots.slice(),turn_left:0});
    const hits=who=>new Set(S.shots.filter(s=>s.who===who&&(s.res==='hit'||s.res==='sunk')).map(s=>key(s.x,s.y))).size;
    const finish=(w,why)=>{S.status='done';S.winner=w;S.reason=why;S.turn=null};
    const shoot=(who,x,y)=>{const ships=who==='host'?S.bot:S.my_ships,sh=ships.find(s=>s.some(p=>p[0]===x&&p[1]===y));let res='miss',sunk=null;
      if(sh){res='hit';const done=new Set(S.shots.filter(s=>s.who===who&&s.res!=='miss'&&s.res!=='wrong').map(s=>key(s.x,s.y)));done.add(key(x,y));if(sh.every(p=>done.has(key(p[0],p[1])))){res='sunk';sunk=sh}}
      S.shots.push({who,rnd:S.round,x,y,res,sunk});return{res,sunk}};
    const step=(who,solved)=>{if(who==='host'){if(solved)S.hostSolved=S.round;S.turn='guest';setTimeout(botMove,800+Math.random()*700)}
      else if(solved)finish(S.hostSolved===S.round?'draw':'guest','solved');else if(S.hostSolved===S.round)finish('host','solved');
      else if(S.round>=lv.rounds){const a=hits('host'),b=hits('guest');finish(a>b?'host':b>a?'guest':'draw','rounds')}else{S.round++;S.turn='host'}};
    const botMove=()=>{if(S.status!=='playing'||S.turn!=='guest'||SEA.cpu!==C)return;
      const shot=new Set(S.shots.filter(s=>s.who==='guest').map(s=>key(s.x,s.y))),open=[];for(let x=-lv.n;x<=lv.n;x++)for(let y=-lv.n;y<=lv.n;y++)if(!shot.has(key(x,y)))open.push([x,y]);
      const sunkCells=new Set(S.shots.filter(s=>s.who==='guest'&&s.sunk).flatMap(s=>s.sunk.map(p=>key(p[0],p[1])))),live=S.shots.filter(s=>s.who==='guest'&&s.res==='hit'&&!sunkCells.has(key(s.x,s.y)));
      let pick=null;if(live.length&&Math.random()<(lv.k==='easy'?0.55:0.9)){const near=[];live.forEach(s=>[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const q=[s.x+dx,s.y+dy];if(Math.abs(q[0])<=lv.n&&Math.abs(q[1])<=lv.n&&!shot.has(key(q[0],q[1])))near.push(q)}));if(near.length)pick=near[Math.floor(Math.random()*near.length)]}
      if(!pick)pick=open[Math.floor(Math.random()*open.length)];const r=shoot('guest',pick[0],pick[1]);step('guest',hits('guest')>=totalOf(lv));if($('#seaHost'))show(state())};
    const C={state,act:{ships:async v=>{S.my_ships=v;S.status='playing';S.turn='host';return{ok:true}},
      fire:async(x,y,w)=>{if(S.status!=='playing'||S.turn!=='host')return{ok:false,msg:'컴퓨터 차례예요.'};
        if(S.shots.some(s=>s.who==='host'&&s.x===x&&s.y===y&&s.res!=='wrong'))return{ok:false,msg:'이미 쏜 곳이에요. 다른 점을 골라요.'};
        if(lv.where&&w!==whereOf(x,y)){S.shots.push({who:'host',rnd:S.round,x,y,res:'wrong',sunk:null});step('host',false);return{ok:true,res:'wrong',where:whereOf(x,y)}}
        const r=shoot('host',x,y);step('host',hits('host')>=totalOf(lv));return{ok:true,res:r.res,sunk:r.sunk}},
      leave:async()=>({ok:true})}};
    Object.assign(SEA,{id:null,cpu:C,act:C.act,st:null,sig:'',sel:null,wh:null,ships:null,msg:''});
    app.innerHTML='<div id="seaHost"></div>';show(state())};

  /* 처음 화면: 숫자야구 띠 아래에 좌표 해전 띠 */
  if(typeof viewHome==='function'){const _h=viewHome;viewHome=function(){_h.apply(this,arguments);const b=$('.bb-strip',app);
    if(b&&!$('.sea-strip',app))b.insertAdjacentElement('afterend',el(`<a class="card bb-strip sea-strip" href="#sea"><span style="font-size:26px">⚓</span><span><b>좌표 해전</b> · 좌표평면에 숨은 배를 (x, y)로 찾아요</span><span class="go">하러 가기 →</span></a>`))}}
})();
