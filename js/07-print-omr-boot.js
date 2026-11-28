/* ───────── 단원 맞추기: 이 사이트에서 여는 단원의 차시·배지만 남김 ───────── */
{const keep=LESSONS.filter(l=>OPEN_UNITS.includes(l.unit||'solid'));LESSONS.splice(0,LESSONS.length,...keep);const kb=BADGES.filter(badgeOn);BADGES.splice(0,BADGES.length,...kb);
  if(UNIT_ID!=='solid')document.title=`${UI_.name} · 한 걸음 수학`;
  if(STANDALONE){const f=$('#foot');if(f)f.innerHTML=`${UI_.name} · 기록은 이 기기에만 저장돼요. 다른 기기에서는 처음부터 시작해요.`}}
/* ───────── 길찾기 ───────── */
/* ───────── 점검 학습지 (인쇄용 섞어 풀기) ─────────
   열린 차시의 유형을 골고루 섞어 시험지처럼 만들어요. 단계 없이 최종 질문만, 선택지는 ①②③, 답 칸은 빈칸.
   같은 '문제지 번호'면 같은 문제가 나와요(다시 인쇄용). 정답지는 다음 쪽에 단계 흐름과 함께. */
let PW_GO=null;   /* 점검 채점에서 '이 유형 다시 풀기'로 왔을 때 고를 유형 */
const PW_CIRC=['①','②','③','④','⑤','⑥','⑦','⑧'];
const PW_LESSONS=()=>LESSONS.filter(l=>l.ready&&(PTYPES[l.id]||GEN[l.id]));
function pwFinal(P){if(P.final)return P.final;const L=P.steps[P.steps.length-1],F=Object.assign({},L,{q:P.finalQ||L.q});
  /* 보기에 이미 ①②가 붙어 있으면 떼어 내요 (인쇄할 때 번호가 두 번 붙지 않게) */
  const cut=c=>String(c).replace(/^[①②③④⑤]\s*/,'');if(F.type==='choice'&&F.choices.every(c=>/^[①②③④⑤]\s/.test(c))){F.choices=F.choices.map(cut);F.ans=cut(F.ans)}return F}
/* [T35] 19차시로 나누기 전(15차시) 답안지: 옛 차시의 유형 순서를 새 차시 유형으로 풀어서 같은 문제를 다시 만들어요. */
const PW_OLD_TYPES={prop:[['prop',1],['prop',2],['propg',1],['propg',2]],inv:[['inv',1],['inv',2],['invg',1],['invg',2]],
  area:[['area',1],['area2',1],['area',2]],conearea:[['conearea',1],['conearea2',1],['conearea2',2],['conearea2',3]]};
function pwMake(lids,n,seed,legacy){const r=mulberry(seed),slots=[];
  lids.forEach(lid=>{const O=legacy&&PW_OLD_TYPES[lid];
    if(O){O.forEach(([l,no])=>{const t=(PTYPES[l]||[]).find(x=>x.no===no);if(t)slots.push({lid,real:l,key:tyKey(l,no),nm:`${t.nm}`,no})});return}
    const T=PTYPES[lid];if(T)T.forEach(t=>slots.push({lid,key:tyKey(lid,t.no),nm:`${t.nm}`,no:t.no}));else slots.push({lid,key:lid,nm:'',no:null})});
  const order=[];while(order.length<n){shuffle(r,slots.slice()).forEach(s=>{if(order.length<n)order.push(s)})}
  const seen=new Set(),out=[];
  order.forEach((s,i)=>{let P=null;for(let t=0;t<30;t++){const q=GEN[s.key](ri(r,1,1e6));const sig=q.title+JSON.stringify(q.steps.map(x=>x.ans));if(!seen.has(sig)){seen.add(sig);P=q;break}}
    if(P)out.push({P,lid:s.lid,real:s.real,nm:s.nm,no:s.no})});
  /* 쉬운 것부터: 차시 순서 → 같은 차시는 섞인 그대로 (옛 답안지는 옛 차시 순서 그대로) */
  const no=lid=>LESSONS.findIndex(l=>l.id===lid);out.sort((a,b)=>no(a.lid)-no(b.lid));
  out.forEach(it=>{if(it.real){it.lid=it.real;delete it.real}});return out}
const pwAll3=P=>{const f=re=>P.steps.find(s=>re.test(s.tag||''));return[['몇 면체',f(/면체/)],['모서리',f(/모서리/)],['꼭짓점',f(/꼭짓점/)]].filter(x=>x[1])};
function pwQHTML(it,i){const P=it.P,F=pwFinal(P),circOnly=F.type==='choice'&&F.choices.every(c=>PW_CIRC.includes(c));
  let ans;if(P.ptype==='poly:name2'){const a=P.steps.find(s=>/\(1\)/.test(s.tag||''));ans=`<div class="pw-ans">(1) <span class="pw-line"></span>${a&&a.suffix||''}&emsp;(2) <span class="pw-line"></span></div>`}
  else if(P.ptype==='poly:all3')ans=`<div class="pw-ans">${pwAll3(P).map(([l,s])=>`${l}: <span class="pw-line" style="width:70px"></span>${s.suffix||''}`).join('&emsp;')}</div>`;
  else if(F.type==='choice')ans=circOnly?`<div class="pw-ch pw-ch1">${F.choices.map(c=>`<span>${c}</span>`).join('')}</div>`:`<div class="pw-ch">${F.choices.map((c,k)=>`<span>${PW_CIRC[k]} ${c}</span>`).join('')}</div>`;
  else ans=`<div class="pw-ans">답: <span class="pw-line"></span> ${F.suffix||''}</div>`;
  return`<div class="pw-q"><div class="pw-h"><b class="pw-n">${i+1}</b><div class="pw-t">${P.title}</div></div>${P.fig?(P.fig.svg?`<div class="pw-figw pw-svg">${P.fig.svg(false,0)}</div>`:`<div class="pw-figw"><canvas class="pw-fig" data-i="${i}"></canvas></div>`):''}
    ${/poly:(all3|name2)/.test(P.ptype)?'':`<div class="pw-fq">${F.q}</div>`}${ans}<div class="pw-work">풀이</div></div>`}
const pwFmt=s=>s.suffix==='면체'?kn(s.ans)+'면체':fmtAns(s);
function pwKeyHTML(it,i){const P=it.P,F=pwFinal(P);let a;
  if(P.ptype==='poly:name2'){const s1=P.steps.find(s=>/\(1\)/.test(s.tag||''));a=`(1) ${pwFmt(s1)} (2) ${fmtAns(F)}`}
  else if(P.ptype==='poly:all3'){a=pwAll3(P).map(([l,s])=>`${l} ${pwFmt(s)}`).join(' · ')}
  else if(F.type==='choice'){const k=F.choices.indexOf(F.ans);a=PW_CIRC.includes(F.ans)?F.ans:`${PW_CIRC[k]} ${F.ans}`}else a=fmtAns(F);
  const flow=P.steps.filter(s=>s!==F).map(s=>`${s.tag?s.tag+' ':''}<b>${pwFmt(s)}</b>`).join(' → ');
  return`<div class="pw-k"><b class="pw-n">${i+1}</b><div><b>${a}</b>${it.nm?` <span class="pw-ty">${it.nm}</span>`:''}${flow&&P.steps.length>1?`<div class="pw-flow">${flow}</div>`:''}</div></div>`}
function viewPrint(pre){
  const RL=PW_LESSONS();let lids=pre&&RL.some(l=>l.id===pre)?[pre]:RL.map(l=>l.id),n=10,seed=pwNewSeed(),key=true,omr=true;
  crumbs.innerHTML=`<span class="sep">›</span><span>점검 학습지</span>`;document.body.classList.add('pw-mode');
  app.innerHTML=`<div class="card panel pw-ctrl"><h1 style="margin:0 0 6px">🖨 점검 학습지 만들기</h1>
    <p class="muted" style="margin:0 0 12px">배운 유형을 섞어 시험지처럼 만들어요. 단계 안내 없이 교과서 · 시험 문제처럼 풀어 보는 마지막 점검이에요. 인쇄하거나 PDF로 저장하세요.</p>
    <div class="pw-row"><span class="pw-l">차시</span>${RL.map(l=>`<label class="t-sel"><input type="checkbox" class="pwL" value="${l.id}" ${lids.includes(l.id)?'checked':''}> ${l.no}차시 ${l.title}</label>`).join('')}</div>
    <div class="pw-row"><span class="pw-l">문제 수</span><div class="seg pwN">${[6,8,10,12,16].map(k=>`<button type="button" data-n="${k}" class="${k===n?'on':''}">${k}</button>`).join('')}</div>
      <label class="t-sel"><input type="checkbox" class="pwO" checked> OMR 답안지 붙이기</label><label class="t-sel"><input type="checkbox" class="pwK" checked> 정답지 붙이기 (다음 쪽)</label></div>
    <div class="pw-row"><button type="button" class="btn ghost pwNew">🔄 다른 문제로</button><button type="button" class="btn primary pwPrint">🖨 인쇄하기</button><a class="btn ghost" href="#scan">📷 사진으로 채점</a><span class="muted pwNo"></span></div></div>
    <div class="pw-sheet"></div>`;
  const draw=()=>{const sheet=$('.pw-sheet',app);if(!lids.length){sheet.innerHTML='<p class="muted">차시를 하나 이상 골라 주세요.</p>';return}
    const items=pwMake(lids,n,seed),names=RL.filter(l=>lids.includes(l.id)).map(l=>`${l.no}차시 ${l.title}`).join(' · ');
    $('.pwNo',app).textContent=`문제지 번호 ${seed}`;
    sheet.innerHTML=`<section class="pw-page"><div class="pw-top"><div><b class="pw-ttl">한 걸음 수학 · 점검 학습지</b><div class="pw-sub">${[...new Set(RL.filter(l=>lids.includes(l.id)).map(l=>unitOf(l.unit||'solid').name))].join(' · ')} · ${names} · ${items.length}문제 · 문제지 ${seed}</div></div>
        <div class="pw-name">학년 <span></span> 반 <span></span> 번호 <span></span> 이름 <span class="w"></span></div></div>
      <div class="pw-tip">단계 안내 없이 풀어요. 그림에 직접 표시하고, 식과 과정을 '풀이' 칸에 적어 보세요.</div>
      <div class="pw-grid">${items.map(pwQHTML).join('')}</div></section>
      ${omr?`<section class="pw-page pw-omrp">${omrCardSVG(items,lids,n,seed)}</section>`:''}
      ${key?`<section class="pw-page pw-keyp"><div class="pw-top"><b class="pw-ttl">정답과 풀이 흐름</b><div class="pw-sub">문제지 ${seed}</div></div><div class="pw-keys">${items.map(pwKeyHTML).join('')}</div></section>`:''}`;
    $$('canvas.pw-fig',sheet).forEach(cv=>{const P=items[+cv.dataset.i].P;const v=figure(cv,Object.assign({},P.fig,{visual:false}));  /* 교과서처럼 흑백 */
      setTimeout(()=>{try{const img=new Image();img.className='pw-fig';img.alt='문제 그림';img.src=cv.toDataURL('image/png');if(v&&v.destroy)v.destroy();cv.replaceWith(img)}catch(e){}},400)})};
  $$('.pwL',app).forEach(c=>c.onchange=()=>{lids=$$('.pwL',app).filter(x=>x.checked).map(x=>x.value);draw()});
  $$('.pwN button',app).forEach(b=>b.onclick=()=>{n=+b.dataset.n;$$('.pwN button',app).forEach(x=>x.classList.toggle('on',x===b));draw()});
  $('.pwK',app).onchange=e=>{key=e.target.checked;draw()};$('.pwO',app).onchange=e=>{omr=e.target.checked;draw()};
  $('.pwNew',app).onclick=()=>{seed=pwNewSeed();draw()};
  $('.pwPrint',app).onclick=()=>window.print();
  draw()}
/* ───────── OMR 답안지 · 사진 채점 ─────────
   점검 학습지 뒤에 OMR 답안지를 붙여요. 네 모서리 검은 네모로 종이 위치를 잡고,
   아래 줄무늬(데이터 줄)에 문제지 번호 · 차시 · 문제 수가 들어 있어서 사진만 찍으면 정답을 다시 만들어 채점해요.
   좌표는 모두 mm(답안지 180×250). */
const OMR={W:180,H:250,MS:8,M:[[5,5],[175,5],[175,245],[5,245]],SX:24,SY:245,SW:3.3,SH:4,VER:2,SP:5.8};
const OMR_D=P=>/^(area2?|volume|conearea2?|cone):/.test(P.ptype)?3:2;   /* 자리 수: 겉넓이·부피는 세 자리 */
function omrParts(P){const F=pwFinal(P),num=(s,lab)=>({k:'num',s,lab,d:Math.max(OMR_D(P),String(Math.abs(s.ans)).length),sg:s.type==='sn',pi:s.type==='pi'});
  if(P.ptype==='poly:name2'){const a=P.steps.find(s=>/\(1\)/.test(s.tag||''));return[num(a,'(1)'),{k:'ch',s:F,lab:'(2)'}]}
  if(P.ptype==='poly:all3')return pwAll3(P).map(([l,s])=>num(s,l==='몇 면체'?'면체':l==='모서리'?'모서리':'꼭짓점'));
  if(F.type==='choice')return[{k:'ch',s:F,lab:''}];
  return[num(F,'')]}
function omrLayout(items){
  const blocks=items.map((it,i)=>{const parts=omrParts(it.P),rows=[];parts.forEach((pt,pi)=>{
    if(pt.k==='ch')rows.push({pi,t:'ch',n:pt.s.choices.length,lab:pt.lab});
    else{if(pt.sg)rows.push({pi,t:'sg',n:2,lab:(pt.lab?pt.lab+' ':'')+'부호'});
      for(let d=pt.d-1;d>=0;d--)rows.push({pi,t:'dg',n:10,place:d,lab:(d===pt.d-1&&pt.lab?pt.lab+' ':'')+['일','십','백'][d]+(pt.pi&&d===0?'(π앞)':'')})}});
    return{i,parts,rows}});
  const top=63,bot=238,gap=2.4;
  for(const pitch of[5.8,5.4,5,4.6,4.3,4]){let col=0,y=top,ok=true;const half=blocks.reduce((a,b)=>a+b.rows.length*pitch+gap,0)/2;   /* 두 줄을 비슷한 높이로 */
    for(const b of blocks){const h=b.rows.length*pitch;if(y+h>bot||(col===0&&y>top&&y-top+h/2>half)){col++;y=top;if(col>1){ok=false;break}}
      const x0=col?92:8;b.x0=x0;b.y=y;b.h=h;b.rows.forEach((r,k)=>{r.y=y+pitch*(k+.5);r.bx=[...Array(r.n)].map((_,j)=>x0+25+j*OMR.SP)});y+=h+gap}
    if(ok)return{blocks,pitch,r:Math.min(2.1,pitch*.38)}}
  return null}
const OMR_NO={rows:[{lab:'십',y:41},{lab:'일',y:48}],x:52};   /* 번호 두 자리 */
/* [T35] 4판(데이터 줄 ver 칸 = 0): 19차시 칸(19비트) · 문제 수 칸(6·8·10·12·16 중 몇 번째, 3비트) · 문제지 번호 1000~3047(11비트) · 확인 2비트.
   1~3판은 15차시 때 답안지라 그때 차시 순서(OMR_OLD_SLOTS)로 읽고 옛 유형 순서로 문제를 다시 만들어요. */
const OMR_NS=[6,8,10,12,16],OMR_OLD_SLOTS=['poly','regular','rotation','rotprop','area','volume','conearea','cone','arc','cent','sector','coord','graph','prop','inv'];
const pwNewSeed=()=>Math.floor(Math.random()*2048)+1000;
function omrBits(lids,n,seed){const b=[1,0],put=(v,k)=>{for(let i=k-1;i>=0;i--)b.push(v>>i&1)};
  const SL=omrSlots(4);let m=0;lids.forEach(l=>{const i=SL.findIndex(x=>x.id===l);if(i>=0&&i<19)m|=1<<i});
  put(0,2);put(m,19);put(Math.max(0,OMR_NS.indexOf(n)),3);put((seed-1000)&2047,11);
  let cs=0;for(let i=2;i<b.length;i++)cs=(cs*3+b[i]+i)%4;put(cs,2);b.push(1);return b}
/* 15차시 때 답안지 만들기(검증용으로만 남겨 둠) */
function omrBitsOld(lids,n,seed){const b=[1,0],put=(v,k)=>{for(let i=k-1;i>=0;i--)b.push(v>>i&1)};
  const SL3=omrSlots(3).map(id=>({id})),useV3=lids.some(l=>SL3.findIndex(x=>x.id===l)>=12);
  if(useV3){put(3,2);let m=0;lids.forEach(l=>{const i=SL3.findIndex(x=>x.id===l);if(i>=0&&i<15)m|=1<<i});put(m,15);put(n-1,4);put(seed-1000,14);
    let cs=0;for(let i=2;i<b.length;i++)cs=(cs*3+b[i]+i)%4;put(cs,2);b.push(1);return b}
  put(OMR.VER,2);let m=0;const SL=omrSlots(OMR.VER).map(id=>({id}));lids.forEach(l=>{const i=SL.findIndex(x=>x.id===l);if(i>=0&&i<12)m|=1<<i});put(m,12);put(n,5);put(seed,14);
  let cs=0;for(let i=2;i<b.length;i++)cs=(cs*3+b[i]+i)%16;put(cs,4);b.push(1);return b}
function omrUnbits(b){if(b.length!==40||b[0]!==1||b[1]!==0||b[39]!==1)return null;const get=(i,k)=>{let v=0;for(let j=0;j<k;j++)v=v*2+b[i+j];return v};
  const ver=get(2,2);
  if(ver===0){let cs=0;for(let i=2;i<37;i++)cs=(cs*3+b[i]+i)%4;if(cs!==get(37,2))return null;
    const m=get(4,19),ni=get(23,3),seed=get(26,11)+1000;if(!m||ni>=OMR_NS.length)return null;
    const lids=omrSlots(4).filter((l,i)=>m>>i&1).map(l=>l.id);return{lids,n:OMR_NS[ni],seed}}
  if(ver===3){let cs=0;for(let i=2;i<37;i++)cs=(cs*3+b[i]+i)%4;if(cs!==get(37,2))return null;
    const m=get(4,15),n=get(19,4)+1,seed=get(23,14)+1000;if(!m||n<1||n>16||seed<1000||seed>9999)return null;
    const lids=omrSlots(3).filter((l,i)=>m>>i&1);return{lids,n,seed,legacy:true}}
  let cs=0;for(let i=2;i<35;i++)cs=(cs*3+b[i]+i)%16;if(cs!==get(35,4))return null;
  const m=get(4,12),n=get(16,5),seed=get(21,14);if((ver!==1&&ver!==2)||!m||n<1||n>16||seed<1000||seed>9999)return null;
  const lids=omrSlots(ver).filter((l,i)=>m>>i&1);return{lids,n,seed,legacy:true}}
/* 답안지의 차시 칸: 4판은 학습지에 쓸 수 있는 차시 순서(19차시). 옛 판은 차시 id 목록을 돌려줘요 —
   1판은 대표 단원 차시 순서(새로 나눈 차시 빼고), 2·3판은 15차시 때 학습지 차시 순서(최대 12/15개) */
const OMR_NEW_IDS=['propg','invg','area2','conearea2'];
function omrSlots(ver){if(ver===4)return PW_LESSONS();
  if(ver===1)return LESSONS.filter(l=>(l.unit||'solid')===UNIT_ID&&!OMR_NEW_IDS.includes(l.id)).map(l=>l.id);
  const ok=new Set(LESSONS.map(l=>l.id));return OMR_OLD_SLOTS.filter(id=>ok.has(id))}
function omrCardSVG(items,lids,n,seed){const L=omrLayout(items);
  if(!L)return`<p class="muted">문제가 많아 OMR 답안지에 다 들어가지 않아요. 문제 수를 줄여 주세요.</p>`;
  const r=L.r,o=[],T=(x,y,s,t,a='start',w=400,c='#111')=>o.push(`<text x="${x}" y="${y}" font-size="${s}" text-anchor="${a}" font-weight="${w}" fill="${c}">${t}</text>`),
    B=(x,y,t,rr=r)=>o.push(`<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff" stroke="#444" stroke-width=".28"/><text x="${x}" y="${y+rr*.42}" font-size="${rr*1.15}" text-anchor="middle" fill="#9a9a9a">${t}</text>`);
  OMR.M.forEach(([x,y])=>o.push(`<rect x="${x-OMR.MS/2}" y="${y-OMR.MS/2}" width="${OMR.MS}" height="${OMR.MS}" fill="#000"/>`));
  omrBits(lids,n,seed).forEach((v,i)=>{if(v)o.push(`<rect x="${OMR.SX+i*OMR.SW}" y="${OMR.SY-OMR.SH/2}" width="${OMR.SW}" height="${OMR.SH}" fill="#000"/>`)});
  T(90,15.5,5.2,'한 걸음 수학 · OMR 답안지','middle',700);
  T(90,21.5,3,`문제지 ${seed} · ${items.length}문제 · 컴퓨터용 사인펜이나 진한 연필로 동그라미를 꽉 채워요`,'middle',400,'#333');
  o.push(`<rect x="12" y="27" width="156" height="27" rx="2" fill="none" stroke="#999" stroke-width=".3"/>`);
  T(16,36,3.4,'이름',700);o.push(`<line x1="26" y1="37" x2="45" y2="37" stroke="#111" stroke-width=".3"/>`);
  T(16,46,3.4,'번호',700);
  OMR_NO.rows.forEach(rw=>{T(OMR_NO.x-3.5,rw.y+1.1,2.8,rw.lab,'end',400,'#444');for(let d=0;d<10;d++)B(OMR_NO.x+d*OMR.SP,rw.y,d,2.1)});
  T(118,36,2.7,'번호는 십의 자리 · 일의 자리에',400,'#444');T(118,40,2.7,'하나씩 칠해요 (7번 → 십 0, 일 7)',400,'#444');
  T(118,46,2.7,'답이 한 자리 수면 십의 자리는',400,'#444');T(118,50,2.7,'비워 둬도 돼요. 고칠 땐 깨끗이 지워요.',400,'#444');
  L.blocks.forEach(b=>{if(b.y>63.5)o.push(`<line x1="${b.x0}" y1="${b.y-1.2}" x2="${b.x0+82}" y2="${b.y-1.2}" stroke="#bbb" stroke-width=".25"/>`);
    const r0=b.rows[0];o.push(`<circle cx="${b.x0+3.2}" cy="${r0.y}" r="2.8" fill="none" stroke="#111" stroke-width=".4"/>`);T(b.x0+3.2,r0.y+1.15,3.2,b.i+1,'middle',700);
    b.rows.forEach(rw=>{if(rw.lab)T(b.x0+22,rw.y+1,2.5,rw.lab,'end',400,'#333');
      rw.bx.forEach((x,j)=>B(x,rw.y,rw.t==='ch'?j+1:rw.t==='sg'?['+','−'][j]:j))})});
  T(90,238.8,2.4,'네 모서리의 검은 네모와 아래 줄무늬는 채점에 쓰여요. 접거나 낙서하지 마세요.','middle',400,'#666');
  return`<svg class="omr-card" viewBox="0 0 ${OMR.W} ${OMR.H}" xmlns="http://www.w3.org/2000/svg" font-family="'Noto Sans KR','Malgun Gothic',sans-serif">${o.join('')}</svg>`}

/* ── 사진 읽기 ── */
function omrHomog(src,dst){const A=[],bb=[];src.forEach(([X,Y],i)=>{const[x,y]=dst[i];A.push([X,Y,1,0,0,0,-x*X,-x*Y]);bb.push(x);A.push([0,0,0,X,Y,1,-y*X,-y*Y]);bb.push(y)});
  const n=8,M=A.map((r,i)=>r.concat(bb[i]));for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];
    if(Math.abs(M[c][c])<1e-12)return null;for(let r=0;r<n;r++)if(r!==c){const f=M[r][c]/M[c][c];for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k]}}
  const h=M.map((r,i)=>r[n]/r[i]);return(X,Y)=>{const d=h[6]*X+h[7]*Y+1;return[(h[0]*X+h[1]*Y+h[2])/d,(h[3]*X+h[4]*Y+h[5])/d]}}
function omrPrep(cv){const w=cv.width,h=cv.height,px=cv.getContext('2d').getImageData(0,0,w,h).data,g=new Float32Array(w*h);
  for(let i=0;i<w*h;i++)g[i]=.299*px[i*4]+.587*px[i*4+1]+.114*px[i*4+2];
  const W=w+1,I=new Float64Array(W*(h+1));for(let y=0;y<h;y++){let s=0;for(let x=0;x<w;x++){s+=g[y*w+x];I[(y+1)*W+x+1]=I[y*W+x+1]+s}}
  const R=Math.max(8,Math.round(Math.min(w,h)/16)),mean=(x,y)=>{const x0=Math.max(0,x-R),y0=Math.max(0,y-R),x1=Math.min(w,x+R+1),y1=Math.min(h,y+R+1);return(I[y1*W+x1]-I[y0*W+x1]-I[y1*W+x0]+I[y0*W+x0])/((x1-x0)*(y1-y0))};
  /* 밝기 비율(그림자에 강하게): 1 ≈ 종이, 작을수록 진함 */
  const rat=new Float32Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)rat[y*w+x]=g[y*w+x]/(mean(x,y)+1);
  return{w,h,g,rat}}
function omrMarkers(im){const{w,h,rat}=im,lab=new Int32Array(w*h),comps=[],st=new Int32Array(w*h);
  const dark=i=>rat[i]<.6;let id=0;
  for(let s=0;s<w*h;s++){if(lab[s]||!dark(s))continue;id++;let sp=0,c=0,sx=0,sy=0,x0=w,y0=h,x1=0,y1=0;st[sp++]=s;lab[s]=id;
    while(sp){const q=st[--sp],x=q%w,y=(q/w)|0;c++;sx+=x;sy+=y;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
      if(x>0&&!lab[q-1]&&dark(q-1)){lab[q-1]=id;st[sp++]=q-1}if(x<w-1&&!lab[q+1]&&dark(q+1)){lab[q+1]=id;st[sp++]=q+1}
      if(y>0&&!lab[q-w]&&dark(q-w)){lab[q-w]=id;st[sp++]=q-w}if(y<h-1&&!lab[q+w]&&dark(q+w)){lab[q+w]=id;st[sp++]=q+w}}
    const bw=x1-x0+1,bh=y1-y0+1,mn=Math.min(w,h);
    if(c<(mn/110)**2||bw>mn/5||bh>mn/5||x0===0||y0===0||x1===w-1||y1===h-1)continue;
    const asp=Math.max(bw,bh)/Math.min(bw,bh),fill=c/(bw*bh);if(asp<1.9&&fill>.5)comps.push({x:sx/c,y:sy/c,c,fill})}
  return comps.sort((a,b)=>b.c-a.c)}
function omrQuads(cs){const out=[],seen=new Set(),big=cs.filter(q=>q.fill>.7).slice(0,14);
  /* 1) 큰 네모들 중 가장 바깥 넷(원근이 심해 크기가 달라도) 2) 크기가 비슷한 네모끼리 */
  const groups=[big].concat(cs.slice(0,10).map(ref=>cs.filter(q=>q.c>ref.c*.45&&q.c<ref.c*2.2&&q.fill>.7)));
  for(const grp of groups){if(grp.length<4)continue;
    const ex=f=>grp.reduce((a,b)=>f(b)>f(a)?b:a);const four=[ex(p=>-p.x-p.y),ex(p=>p.x-p.y),ex(p=>p.x+p.y),ex(p=>-p.x+p.y)];
    if(new Set(four).size<4)continue;const key=four.map(p=>cs.indexOf(p)).join();if(seen.has(key))continue;seen.add(key);out.push(four)}
  return out}
function omrSampler(im,H){const{w,h,rat}=im;return(X,Y,rad)=>{let s=0,n=0;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){if(a*a+b*b>5)continue;
  const[x,y]=H(X+a*rad/2,Y+b*rad/2),xi=Math.round(x),yi=Math.round(y);if(xi<0||yi<0||xi>=w||yi>=h)continue;s+=rat[yi*w+xi];n++}return n?s/n:1}}
function omrRow(S,xs,y,r){const v=xs.map(x=>S(x,y,r*.55)),mids=[];for(let j=0;j+1<xs.length;j++)mids.push(S((xs[j]+xs[j+1])/2,y,.45));mids.push(S(xs[xs.length-1]+OMR.SP*.5,y,.45));
  mids.sort((a,b)=>a-b);const W=mids[mids.length>>1],d=v.map(q=>Math.max(0,(W-q)/W)),mx=Math.max(...d);
  return{d,marked:d.map((q,j)=>q>=Math.max(.2,mx*.55)?j:-1).filter(j=>j>=0)}}
function omrScan(cv){const im=omrPrep(cv),cs=omrMarkers(im),quads=omrQuads(cs);
  if(!quads.length)return{err:'markers',cs};
  for(const four of quads){const cx=four.reduce((a,p)=>a+p.x,0)/4,cy=four.reduce((a,p)=>a+p.y,0)/4;
    const ring=four.slice().sort((a,b)=>Math.atan2(a.y-cy,a.x-cx)-Math.atan2(b.y-cy,b.x-cx));  /* 화면 기준 시계 방향 */
    for(let rot=0;rot<4;rot++){const dst=[0,1,2,3].map(k=>{const p=ring[(k+rot)%4];return[p.x,p.y]}),H=omrHomog(OMR.M,dst);if(!H)continue;
      const S=omrSampler(im,H),cells=[...Array(40)].map((_,i)=>S(OMR.SX+(i+.5)*OMR.SW,OMR.SY,.9)),thr=(cells[0]+cells[1])/2;
      if(cells[1]-cells[0]<.15)continue;const meta=omrUnbits(cells.map(v=>v<thr?1:0));if(!meta)continue;
      return omrGrade(im,H,S,meta,four)}}
  return{err:'strip',cs}}
function omrGrade(im,H,S,meta,four){const items=pwMake(meta.lids,meta.n,meta.seed,meta.legacy),L=omrLayout(items);if(!L)return{err:'layout'};
  const r=L.r,res=[];
  const no=OMR_NO.rows.map(rw=>omrRow(S,[...Array(10)].map((_,d)=>OMR_NO.x+d*OMR.SP),rw.y,2.1).marked);
  const stuNo=no.some(m=>m.length>1)||no.every(m=>!m.length)?null:no.reduce((a,m)=>a*10+(m.length?m[0]:0),0);
  L.blocks.forEach(b=>{const it=items[b.i],parts=b.parts.map((pt,pi)=>{const rows=b.rows.filter(rw=>rw.pi===pi);
      const rd=rows.map(rw=>Object.assign({rw},omrRow(S,rw.bx,rw.y,r)));let val=null,bad=false,want,mark=[];
      if(pt.k==='ch'){const m=rd[0].marked;want=pt.s.choices.indexOf(pt.s.ans)+1;if(m.length>1)bad=true;else if(m.length)val=m[0]+1;
        mark.push({rw:rd[0].rw,j:want-1,ok:val===want});m.forEach(j=>{if(j!==want-1)mark.push({rw:rd[0].rw,j,ok:false,stu:true})})}
      else{want=pt.s.ans;let neg=false,num=0,any=false;rd.forEach(q=>{const m=q.marked;if(m.length>1){bad=true;return}
          if(q.rw.t==='sg'){neg=m[0]===1;return}if(m.length){any=true;num=num*10+m[0]}else num=num*10});
        if(!bad&&any)val=neg?-num:num;
        const wd=String(Math.abs(want)).padStart(pt.d,'0');rd.forEach(q=>{let wj;if(q.rw.t==='sg')wj=want<0?1:-1;else{const dg=+wd[wd.length-1-q.rw.place];wj=(dg===0&&Math.abs(want)<10**q.rw.place)?-1:dg}
          if(wj>=0)mark.push({rw:q.rw,j:wj,ok:q.marked.includes(wj)});q.marked.forEach(j=>{if(j!==wj&&!(wj<0&&j===0))mark.push({rw:q.rw,j,ok:false,stu:true})})})}
      return{pt,val,bad,want,ok:!bad&&val===want,mark}});
    res.push({i:b.i,it,parts,ok:parts.every(p=>p.ok)})});
  return{meta,items,L,res,score:res.filter(x=>x.ok).length,stuNo,H,r,four}}
function omrAnsTxt(p){if(p.bad)return'두 개 이상 칠함';if(p.val===null)return'안 칠함';
  if(p.pt.k==='ch')return PW_CIRC[p.val-1]+(PW_CIRC.includes(p.pt.s.ans)?'':' '+(p.pt.s.choices[p.val-1]||''));
  return p.pt.s.suffix==='면체'?p.val+'(면체)':p.pt.s.type==='pi'?p.val+'π':String(p.val)}
function omrWantTxt(p){if(p.pt.k==='ch'){const k=p.want;return PW_CIRC[k-1]+(PW_CIRC.includes(p.pt.s.ans)?'':' '+p.pt.s.ans)}return p.pt.s.type==='pi'?p.want+'π':String(p.want)}
function omrLoad(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{const s=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight)),cv=document.createElement('canvas');cv.width=Math.round(im.naturalWidth*s);cv.height=Math.round(im.naturalHeight*s);
    cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(u);res(cv)};im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('img'))};im.src=u})}
const OMR_KEY='hg_omr_v1';
function omrStore(){try{return JSON.parse(localStorage.getItem(OMR_KEY)||'{}')}catch(e){return{}}}
function omrSave(o){try{localStorage.setItem(OMR_KEY,JSON.stringify(o))}catch(e){}}
function viewScan(){if(!tTok())return viewScanStu();document.body.classList.remove('pw-mode');crumbs.innerHTML=`<span class="sep">›</span><a href="#print">점검 학습지</a><span class="sep">›</span><span>사진 채점</span>`;
  let cur=null,seed=null;
  app.innerHTML=`<div class="card panel"><h1 style="margin:0 0 6px">📷 OMR 사진 채점</h1>
    <p class="muted" style="margin:0 0 10px">점검 학습지의 <b>OMR 답안지</b>를 찍으면 바로 채점해요. 네 모서리의 검은 네모가 모두 보이게, 종이를 평평한 곳에 놓고 위에서 찍어 주세요. 사진은 이 기기 안에서만 읽고 어디에도 올리지 않아요.</p>
    <label class="btn primary omr-shot">📷 답안지 찍기<input type="file" accept="image/*" capture="environment" class="omrFile" hidden></label>
    <label class="btn ghost omr-shot">🖼 사진 고르기<input type="file" accept="image/*" class="omrFile2" hidden></label>
    <div class="omr-out"></div></div><div class="card panel omr-list"></div>`;
  const out=$('.omr-out',app),list=$('.omr-list',app);
  const drawList=()=>{const st=omrStore(),seeds=Object.keys(st).sort((a,b)=>(st[b].at||0)-(st[a].at||0));
    if(!seeds.length){list.innerHTML='<p class="muted" style="margin:0">채점한 답안지가 여기에 모여요.</p>';return}
    if(!seed||!st[seed])seed=seeds[0];const S=st[seed],rows=S.rows.slice().sort((a,b)=>(a.no??999)-(b.no??999));
    const wrongCnt={};rows.forEach(x=>x.wrong.forEach(i=>wrongCnt[i]=(wrongCnt[i]||0)+1));
    const hard=Object.entries(wrongCnt).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([i,c])=>`${+i+1}번(${c}명)`).join(', ');
    list.innerHTML=`<div class="pw-row"><b>채점 모음</b><select class="omrSeed">${seeds.map(s=>`<option value="${s}" ${s===seed?'selected':''}>문제지 ${s} · ${st[s].rows.length}명</option>`).join('')}</select>
      <button type="button" class="btn ghost omrCsv">엑셀(CSV) 받기</button><button type="button" class="btn ghost omrDel">이 문제지 기록 지우기</button></div>
      ${hard?`<p class="muted" style="margin:4px 0">많이 틀린 문제: <b>${hard}</b></p>`:''}
      <table class="omr-tbl"><tr><th>번호</th><th>이름</th><th>점수</th><th>틀린 문제</th></tr>${rows.map(x=>`<tr><td>${x.no??'-'}</td><td>${esc_(x.name||'')}</td><td><b>${x.score}</b>/${x.total}</td><td>${x.wrong.map(i=>i+1).join(', ')||'다 맞음 🎉'}</td></tr>`).join('')}</table>`;
    $('.omrSeed',list).onchange=e=>{seed=e.target.value;drawList()};
    $('.omrCsv',list).onclick=()=>{const csv='﻿번호,이름,점수,문항 수,틀린 문제\n'+rows.map(x=>[x.no??'',`"${(x.name||'').replace(/"/g,'""')}"`,x.score,x.total,`"${x.wrong.map(i=>i+1).join(' ')}"`].join(',')).join('\n');
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`점검학습지_${seed}_채점.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
    $('.omrDel',list).onclick=()=>{if(!confirm(`문제지 ${seed} 채점 기록을 지울까요?`))return;const st2=omrStore();delete st2[seed];omrSave(st2);seed=null;drawList()}};
  const show=(cv,R)=>{cur=R;
    if(R.err){out.innerHTML=`<div class="omr-err"><b>답안지를 읽지 못했어요.</b> ${R.err==='markers'?'네 모서리의 검은 네모가 모두 보이게':'답안지 전체가 화면에 들어오게'} 찍어 주세요. 그림자가 지지 않게, 종이를 평평하게 펴고 위에서 바로 찍으면 잘 돼요.</div>`;return}
    const disp=document.createElement('canvas'),k=Math.min(1,900/cv.width);disp.width=cv.width*k;disp.height=cv.height*k;disp.className='omr-photo';const g=disp.getContext('2d');g.drawImage(cv,0,0,disp.width,disp.height);
    const pr=(X,Y)=>R.H(X,Y).map(v=>v*k),rad=(()=>{const a=pr(90,125),b=pr(90+R.r,125);return Math.hypot(a[0]-b[0],a[1]-b[1])})();
    R.res.forEach(q=>q.parts.forEach(p=>p.mark.forEach(m=>{const[x,y]=pr(m.rw.bx[m.j],m.rw.y);g.lineWidth=Math.max(2,rad*.35);g.strokeStyle=m.ok?'#16a34a':m.stu?'#dc2626':'#f59e0b';g.beginPath();g.arc(x,y,rad*1.35,0,7);g.stroke()})));
    R.res.forEach(q=>{const bl=R.L.blocks[q.i],[x,y]=pr(bl.x0+3.2,bl.rows[0].y);g.font=`bold ${Math.round(rad*3.2)}px sans-serif`;g.fillStyle=q.ok?'#16a34a':'#dc2626';g.fillText(q.ok?'○':'✕',x-rad*4.6,y+rad*1.1)});
    const tot=R.items.length;
    out.innerHTML=`<div class="omr-score"><span class="omr-big">${R.score}<small>/${tot}</small></span><div>문제지 ${R.meta.seed} · ${R.meta.lids.map(l=>LESSONS.find(x=>x.id===l).no+'차시').join(' · ')}<br>
      <label>번호 <input type="number" class="omrNo" value="${R.stuNo??''}" min="1" max="99" style="width:64px"></label> <label>이름 <input type="text" class="omrName" style="width:110px" placeholder="(선택)"></label></div></div>
      <div class="pw-row"><button type="button" class="btn primary omrKeep">저장하고 다음 학생 📷</button><span class="muted">${R.stuNo==null?'번호를 읽지 못했어요. 직접 적어 주세요.':'번호는 칠한 대로 읽었어요. 틀리면 고쳐 주세요.'}</span></div>
      <div class="omr-legend"><span style="color:#16a34a">● 맞게 칠함</span> <span style="color:#dc2626">● 잘못 칠함</span> <span style="color:#f59e0b">● 칠해야 할 곳</span></div>
      <div class="omr-res">${R.res.map(q=>`<div class="omr-q ${q.ok?'ok':'no'}"><b class="pw-n">${q.i+1}</b> <span>${q.ok?'맞음':'틀림'}</span> <span class="pw-ty">${q.it.nm||''}</span>
        ${q.ok?'':`<div class="omr-why">${q.parts.map(p=>`${p.pt.lab?p.pt.lab+' ':''}칠한 답 <b>${omrAnsTxt(p)}</b> · 정답 <b>${omrWantTxt(p)}</b>`).join('<br>')}</div>`}</div>`).join('')}</div>`;
    out.prepend(disp);
    $('.omrKeep',out).onclick=()=>{const st=omrStore(),s=String(R.meta.seed),nv=$('.omrNo',out).value,row={no:nv?+nv:null,name:$('.omrName',out).value.trim(),score:R.score,total:tot,wrong:R.res.filter(q=>!q.ok).map(q=>q.i),at:Date.now()};
      st[s]=st[s]||{rows:[]};st[s].rows=st[s].rows.filter(x=>row.no==null||x.no!==row.no);st[s].rows.push(row);st[s].at=Date.now();omrSave(st);seed=s;drawList();
      toast(`${row.no??''}번 ${row.score}/${tot}점 저장했어요`);out.innerHTML='';$('.omrFile',app).click()}};
  const onFile=async e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;out.innerHTML='<p class="muted">읽는 중…</p>';
    try{const cv=await omrLoad(f);await new Promise(r=>setTimeout(r,30));show(cv,omrScan(cv))}catch(err){out.innerHTML='<div class="omr-err">사진을 열지 못했어요. 다시 찍어 주세요.</div>'}};
  $('.omrFile',app).onchange=onFile;$('.omrFile2',app).onchange=onFile;drawList()}
function omrRecord(R){/* 학생 기록(DB._omr): 처음 점수 f는 그대로 두고, 다시 찍으면 s만 바뀌어요. 진도와 함께 서버로 올라가 선생님 화면에 보여요 */
  const O=OBJ(DB._omr),k=String(R.meta.seed),old=O[k],wrong=R.res.filter(q=>!q.ok);
  O[k]={f:old&&old.f!=null?old.f:R.score,s:R.score,t:R.items.length,w:wrong.map(q=>q.i+1),l:R.meta.lids,n:(old&&old.n||0)+1,at:Date.now()};
  const keep={};Object.keys(O).sort((a,b)=>(O[b].at||0)-(O[a].at||0)).slice(0,20).forEach(x=>keep[x]=O[x]);DB._omr=keep;save();return keep[k]}
function viewScanStu(){document.body.classList.remove('pw-mode');crumbs.innerHTML=`<span class="sep">›</span><span>점검 학습지 채점</span>`;
  const me=isStudent();
  app.innerHTML=`<div class="card panel"><h1 style="margin:0 0 6px">📷 내 점검 학습지 채점</h1>
    <p class="muted" style="margin:0 0 10px">다 푼 <b>OMR 답안지</b>를 찍으면 바로 채점해요. 네 모서리의 검은 네모가 모두 보이게, 평평한 곳에 놓고 위에서 찍어요.
    ${me?'점수는 선생님께도 전달돼요. <b>처음 찍은 점수</b>가 기록되니 다 풀고 찍어요.':'<b>로그인하면</b> 점수가 선생님께 전달돼요.'}</p>
    <label class="btn primary omr-shot">📷 답안지 찍기<input type="file" accept="image/*" capture="environment" class="omrFile" hidden></label>
    <label class="btn ghost omr-shot">🖼 사진 고르기<input type="file" accept="image/*" class="omrFile2" hidden></label>
    <div class="omr-out"></div></div><div class="card panel omr-mine"></div>`;
  const out=$('.omr-out',app),mine=$('.omr-mine',app);
  const drawMine=()=>{const O=OBJ(DB._omr),ks=Object.keys(O).sort((a,b)=>(O[b].at||0)-(O[a].at||0));
    mine.innerHTML=ks.length?`<b>내 점검 기록</b><table class="omr-tbl"><tr><th>문제지</th><th>처음 점수</th><th>다시 찍은 점수</th><th>틀린 문제</th></tr>${ks.map(k=>{const x=O[k];return`<tr><td>${esc_(k)}</td><td><b>${NUM(x.f)}</b>/${NUM(x.t)}</td><td>${x.n>1?`${NUM(x.s)}/${NUM(x.t)}`:'-'}</td><td>${(x.w||[]).map(NUM).join(', ')||'다 맞음 🎉'}</td></tr>`}).join('')}</table>`
      :'<p class="muted" style="margin:0">채점한 점검 학습지가 여기에 모여요.</p>'};
  const show=(cv,R)=>{
    if(R.err){out.innerHTML=`<div class="omr-err"><b>답안지를 읽지 못했어요.</b> ${R.err==='markers'?'네 모서리의 검은 네모가 모두 보이게':'답안지 전체가 화면에 들어오게'} 찍어 주세요. 그림자가 지지 않게, 종이를 평평하게 펴고 위에서 바로 찍으면 잘 돼요.</div>`;return}
    const rec=me?omrRecord(R):null,tot=R.items.length;
    const disp=document.createElement('canvas'),k=Math.min(1,900/cv.width);disp.width=cv.width*k;disp.height=cv.height*k;disp.className='omr-photo';const g=disp.getContext('2d');g.drawImage(cv,0,0,disp.width,disp.height);
    const pr=(X,Y)=>R.H(X,Y).map(v=>v*k),rad=(()=>{const a=pr(90,125),b=pr(90+R.r,125);return Math.hypot(a[0]-b[0],a[1]-b[1])})();
    R.res.forEach(q=>{const bl=R.L.blocks[q.i],[x,y]=pr(bl.x0+3.2,bl.rows[0].y);g.font=`bold ${Math.round(rad*3.2)}px sans-serif`;g.fillStyle=q.ok?'#16a34a':'#dc2626';g.fillText(q.ok?'○':'✕',x-rad*4.6,y+rad*1.1)});
    const wrong=R.res.filter(q=>!q.ok),again=rec&&rec.n>1;
    out.innerHTML=`<div class="omr-score"><span class="omr-big">${R.score}<small>/${tot}</small></span><div>${R.score===tot?'다 맞았어요! 🎉':wrong.length<=2?'거의 다 왔어요. 틀린 것만 다시 봐요.':'틀린 유형을 다시 연습하고 한 번 더 풀어 봐요.'}
      ${again?`<br><span class="muted">처음 점수 ${rec.f}/${tot}는 그대로 두고, 이번 점수도 함께 선생님께 보여요.</span>`:me?'<br><span class="muted">선생님께 점수를 보냈어요.</span>':''}</div></div>
      ${wrong.length?`<p class="muted" style="margin:6px 0">틀린 문제를 학습지에서 <b>먼저 다시 풀어 보고</b>, 그다음에 정답을 확인해요.</p>`:''}
      <div class="omr-res">${R.res.map(q=>`<div class="omr-q ${q.ok?'ok':'no'}"><b class="pw-n">${q.i+1}</b> <span>${q.ok?'맞음':'틀림'}</span> <span class="pw-ty">${q.it.nm||''}</span>
        ${q.ok?'':`<details class="omr-why"><summary>정답 보기</summary>${q.parts.map(p=>`${p.pt.lab?p.pt.lab+' ':''}칠한 답 <b>${omrAnsTxt(p)}</b> · 정답 <b>${omrWantTxt(p)}</b>`).join('<br>')}</details>
        ${q.it.no!=null?`<button type="button" class="btn ghost t-mini omrGo" data-l="${q.it.lid}" data-no="${q.it.no}">이 유형 다시 풀기 →</button>`:`<a class="btn ghost t-mini" href="#${q.it.lid}-practice">혼자 풀기 →</a>`}`}</div>`).join('')}</div>`;
    out.prepend(disp);
    $$('.omrGo',out).forEach(b=>b.onclick=()=>{PW_GO={lid:b.dataset.l,no:+b.dataset.no};location.hash=`#${b.dataset.l}-practice`});
    drawMine()};
  const onFile=async e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;out.innerHTML='<p class="muted">읽는 중…</p>';
    try{const cv=await omrLoad(f);await new Promise(r=>setTimeout(r,30));show(cv,omrScan(cv))}catch(err){out.innerHTML='<div class="omr-err">사진을 열지 못했어요. 다시 찍어 주세요.</div>'}};
  $('.omrFile',app).onchange=onFile;$('.omrFile2',app).onchange=onFile;drawMine()}
const esc_=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ───────── 사용법: '어떻게 하나요?' 버튼 · 시연용 사용법 페이지 · 뒤로 가기 ─────────
   학생 테스트 의견: "뭐 어떻게 하는 거예요?", "같은 유형만 나와요", "뒤로 가기 했더니 나가져요" */

/* 뒤로 가기 1) 유형 안에서 뒤로 가기 → 유형 고르기 화면으로 (앱을 나가지 않게) */
let SUB_BACK=null;
function subEnter(back){if(SUB_BACK&&SUB_BACK.hash===location.hash){SUB_BACK.fn=back;return}try{history.pushState({hgSub:1},'')}catch(e){}SUB_BACK={hash:location.hash,fn:back}}
function subLeave(){if(SUB_BACK&&SUB_BACK.hash===location.hash){history.back();return true}SUB_BACK=null;return false}
/* 뒤로 가기 2) 처음 들어온 화면에서 뒤로 가기 → 처음 화면으로, 처음 화면에서는 한 번 더 눌러야 나가요 */
function backGuardInit(){try{if(!history.state){history.replaceState({hgRoot:1},'');history.pushState({hg:1},'')}}catch(e){}
  addEventListener('popstate',e=>{
    if(SUB_BACK){const S=SUB_BACK;SUB_BACK=null;if(S.hash===location.hash){S.fn();return}}
    if(e.state&&e.state.hgRoot){const h=(location.hash||'').replace('#','');
      if(h&&h!=='home'){try{history.pushState({hg:1},'','#home')}catch(er){}route()}
      else toast('한 번 더 뒤로 가면 한 걸음 수학을 나가요. 다른 화면은 위쪽 <b>한 걸음 수학</b>이나 경로를 눌러 가요.')}})}

/* 화면마다 '어떻게 하나요?' */
const HOW_NAV='<b>이동하는 법</b> · 맨 위 <b>한 걸음 수학</b>을 누르면 처음 화면이에요. 그 옆의 <b>› 1차시</b> 같은 글자를 누르면 한 칸 위 목록으로 가요. 휴대폰의 뒤로 가기를 눌러도 앱이 꺼지지 않아요.';
function howFor(h){const [id,tab]=h.split('-'),L=LESSONS.find(l=>l.id===id);
  if(!h||h==='home')return{t:'처음 화면',s:['<b>오늘의 길잡이</b>를 위에서부터 하나씩 눌러요. 오늘 할 일이 순서대로 있어요.','배울 <b>차시 카드</b>를 누르면 그 차시로 들어가요.','차시 안에서는 <b>미리 보기 → 같이 풀기 → 혼자 풀기</b> 순서로 해요.','<b>기초 연산</b>과 <b>오늘의 계산</b>은 계산 연습이에요. 짧게 매일 하면 좋아요.']};
  if(L&&tab==='concept')return{t:`${L.no}차시 · 미리 보기`,s:['카드를 한 장씩 넘기며 <b>낱말과 그림</b>을 익혀요.','밑줄 친 낱말을 누르면 뜻이 나와요.','그림은 손가락으로 <b>끌어서 돌려</b> 볼 수 있어요.','다 보면 위쪽 <b>2 같이 풀기</b> 탭을 눌러요.']};
  if(L&&tab==='steps')return{t:`${L.no}차시 · 같이 풀기`,s:['먼저 <b>유형 카드</b>를 하나 골라요. 유형 1부터 하면 좋아요.','<b>왼쪽은 선생님 풀이</b>예요. <b>풀이 보기 ▶</b>를 누르면 한 단계씩 보여요.','<b>오른쪽은 내가 푸는 문제</b>예요. 숫자만 다르고 푸는 방법은 같아요.','막히면 왼쪽의 같은 단계를 보고 따라 해요.','다른 유형으로 바꾸려면 위쪽 <b>🔀 다른 유형 고르기</b>를 눌러요.']};
  if(L&&tab==='practice')return{t:`${L.no}차시 · 혼자 풀기`,s:['<b>유형 카드</b>를 골라요. <b>섞어서</b>를 고르면 여러 유형이 섞여 나와요.','같은 유형만 계속 나오면, 위쪽 <b>🔀 다른 유형 고르기</b>를 눌러 바꿔요.','답이 틀리면 <b>힌트</b>가 나와요. 세 번 틀리면 <b>정답 확인하고 넘어가기</b>가 생겨요.','3번 연속 맞히면 단계 없이 도전해요. 어려우면 <b>단계로 나누어 풀기</b>를 눌러요.','문제가 이상하면 문제 아래 <b>⚑ 문제가 이상해요</b>를 눌러 선생님께 알려요.']};
  if(L&&tab==='explore')return{t:`${L.no}차시 · 더 알아보기`,s:['하고 싶을 때만 하는 <b>선택</b> 활동이에요.','도형을 돌려 보고, 잘라 보고, 펼쳐 보며 탐구해요.']};
  if(h==='calc'||/^calc-/.test(h))return{t:'기초 연산',s:['처음이라면 <b>시작점 찾기</b>를 먼저 해요. 나에게 맞는 주제를 알려 줘요.','주제 카드를 누르면 <b>생각하는 법 → 연습</b> 순서로 해요.','별 3개를 모으면 그 주제를 익힌 거예요.']};
  if(h==='drill')return{t:'오늘의 계산',s:['여러 주제를 섞어 <b>5문제나 10문제</b>를 풀어요.','빠르기보다 <b>정확하게</b>가 먼저예요.','막히면 <b>쪼개서</b> 같이 풀어요.']};
  if(h==='review')return{t:'복습 노트',s:['틀렸거나 헤맨 문제가 모여 있어요.','1일, 3일, 7일 뒤에 다시 나와요. 세 번 연속 맞히면 졸업이에요.']};
  if(h==='me'||h==='shop')return{t:'내 기록',s:['포인트, 연속 일수, 배지를 볼 수 있어요.','포인트로 <b>꾸미기 상점</b>에서 꾸밀 수 있어요.']};
  if(h==='scan')return{t:'점검 학습지 채점',s:['다 푼 <b>OMR 답안지</b>를 평평한 곳에 놓아요.','<b>📷 답안지 찍기</b>를 누르고, 네 모서리의 검은 네모가 모두 보이게 위에서 찍어요.','틀린 문제는 먼저 다시 풀어 보고 <b>정답 보기</b>를 눌러요. <b>이 유형 다시 풀기</b>로 연습해요.']};
  if(h==='login')return{t:'로그인',s:['학년, 반, 번호를 고르고 선생님께 받은 <b>비밀번호 4자리</b>를 넣어요.','로그인하면 다른 기기에서도 이어서 하고, 선생님이 내 진도를 볼 수 있어요.']};
  return{t:'한 걸음 수학',s:['화면에 있는 큰 버튼을 눌러 시작해요.']}}
function howBtn(){let b=$('#howBtn');const h=(location.hash||'').replace('#','');const show=!/^(teacher|bossview|howto|print)/.test(h);
  if(!b){b=el('<button type="button" id="howBtn" class="howbtn" aria-label="어떻게 하나요?"><span class="hi">?</span><span class="ht">어떻게 하나요?</span></button>');const w=$('#whoChip');if(w)w.parentNode.insertBefore(b,w);else document.body.appendChild(b);b.onclick=howOpen}
  b.hidden=!show}
function howOpen(){const h=(location.hash||'').replace('#',''),H=howFor(h);let ov=$('#howPop');if(ov)ov.remove();
  ov=el(`<div id="howPop" class="howpop" role="dialog" aria-modal="true" aria-label="사용법"><div class="howcard"><div class="howh"><b>❓ ${H.t} · 이렇게 해요</b><button type="button" class="howx" aria-label="닫기">✕</button></div>
    <ol class="howol">${H.s.map(x=>`<li>${x}</li>`).join('')}</ol><p class="hownav">${HOW_NAV}</p>
    <div class="howact"><a class="btn ghost" href="#howto">📖 자세한 사용법 보기</a><button type="button" class="btn primary howok">알겠어요</button></div></div></div>`);
  document.body.appendChild(ov);const close=()=>ov.remove();$('.howx',ov).onclick=close;$('.howok',ov).onclick=close;$('a',ov).onclick=close;ov.onclick=e=>{if(e.target===ov)close()};$('.howok',ov).focus()}

/* 시연용 사용법 페이지 (#howto): 선생님이 화면에 띄워 설명하기 좋게 크게, 자세히 */
function viewHowto(){crumbs.innerHTML=`<span class="sep">›</span><span>사용법</span>`;
  const B=(t,c='')=>`<span class="hw-b ${c}">${t}</span>`,sec=(n,t,body,go)=>`<section class="card panel hw-s" id="hw${n}"><h2><span class="hw-n">${n}</span>${t}</h2>${body}${go?`<p class="hw-go"><a class="btn ghost" href="${go[0]}">${go[1]} →</a></p>`:''}</section>`;
  const S=[
    ['로그인하기',`<ol><li>오른쪽 위 ${B('로그인')}을 눌러요.</li><li><b>학년 · 반 · 번호</b>를 고르고, 선생님께 받은 <b>비밀번호 4자리</b>를 넣어요.</li><li>로그인하면 기록이 학교 서버에 저장돼서 <b>다른 기기에서도 이어서</b> 할 수 있어요. 선생님도 내 진도를 볼 수 있어요.</li></ol>
      <div class="hw-tip">💡 로그인하지 않아도 쓸 수 있지만, 기록이 그 기기에만 남아요.</div>`,['#login','로그인 화면 열어 보기']],
    ['처음 화면 보기',`<div class="hw-mock"><div class="hw-bar">${B('한 걸음 수학','logo')} <span class="hw-c">› 1차시 › 혼자 풀기</span> <span style="margin-left:auto">${B('1반 5번','dark')} ${B('⭐ 120')}</span></div>
        <div class="hw-row"><div class="hw-card on">오늘의 길잡이<br><small>① 미리 보기 ② 같이 풀기 ③ 혼자 풀기</small></div><div class="hw-card">1차시<br><small>다면체 · 각뿔대</small></div><div class="hw-card">2차시<br><small>정다면체</small></div></div></div>
      <ol><li><b>오늘의 길잡이</b>: 오늘 할 일이 순서대로 있어요. 위에서부터 하나씩 누르면 돼요.</li><li><b>차시 카드</b>: 배울 차시를 눌러 들어가요.</li><li>오른쪽 위 ${B('⭐ 포인트')}를 누르면 내 기록과 배지를 볼 수 있어요.</li></ol>`,['#home','처음 화면 열어 보기']],
    ['차시 하나 공부하는 순서',`<div class="hw-mock"><div class="hw-tabs">${B('1 미리 보기','tab on')}${B('2 같이 풀기','tab')}${B('3 혼자 풀기','tab')}${B('4 더 알아보기 (선택)','tab dim')}</div></div>
      <ol><li><b>미리 보기</b> (정규 수업 전): 카드를 넘기며 낱말과 그림을 익혀요. 밑줄 친 낱말을 누르면 뜻이 나와요.</li>
      <li><b>같이 풀기</b> (수업 뒤): 왼쪽 <b>선생님 풀이</b>를 보며 오른쪽의 <b>같은 유형 문제</b>를 한 단계씩 풀어요.</li>
      <li><b>혼자 풀기</b>: 이제 혼자 풀어요. <b>5문제</b>를 풀면 이 차시를 마친 거예요.</li><li><b>더 알아보기</b>는 하고 싶을 때만 해요.</li></ol>
      <div class="hw-tip">💡 탭은 화면 위쪽에 있어요. 순서대로 누르면 돼요.</div>`,['#poly-concept','1차시 미리 보기 열어 보기']],
    ['유형 고르기와 바꾸기',`<div class="hw-mock"><div class="hw-row"><div class="hw-card on"><small>유형 1</small><br>무엇인지 가려내기</div><div class="hw-card"><small>유형 2</small><br>이름 짓기</div><div class="hw-card"><small>섞어서</small><br>유형 섞어 풀기</div></div>
        <div class="hw-bar" style="margin-top:10px"><span class="hw-c">유형 1</span> <b>무엇인지 가려내기</b> <span style="margin-left:auto">${B('🔀 다른 유형 고르기','hot')}</span></div></div>
      <ol><li>같이 풀기와 혼자 풀기는 먼저 <b>유형 카드</b>를 골라요.</li><li>카드를 고르면 <b>그 유형 문제만</b> 계속 나와요.</li>
      <li><b>다른 유형으로 바꾸려면</b> 문제 위쪽의 ${B('🔀 다른 유형 고르기','hot')}를 눌러요. 휴대폰 <b>뒤로 가기</b>를 눌러도 유형 고르기 화면으로 돌아와요.</li>
      <li><b>섞어서</b>를 고르면 여러 유형이 섞여 나와요. 시험처럼 연습할 때 좋아요.</li><li>많이 틀린 유형에는 ${B('추천','rec')}이 붙어요.</li></ol>`,['#poly-practice','혼자 풀기 열어 보기']],
    ['문제 푸는 법',`<div class="hw-mock"><div class="hw-q"><b>(1)</b> 옆면은 몇 개인가요? <div class="hw-row" style="margin-top:8px">${B('1')}${B('2')}${B('3')}${B('⌫')}${B('확인','dark')}</div>
        <div class="hw-hint">💡 힌트: 밑면의 변 하나마다 옆면이 하나씩 붙어 있어요.</div></div></div>
      <ol><li>문제는 <b>단계</b>로 나뉘어 있어요. 단계 하나를 맞히면 다음 단계가 나와요.</li><li>숫자는 <b>화면 키패드</b>로 넣고 ${B('확인','dark')}을 눌러요. 고르는 문제는 답 버튼을 눌러요.</li>
      <li>틀리면 <b>힌트</b>가 나와요. 힌트를 보고 다시 해 봐요.</li><li>세 번 틀리면 ${B('정답 확인하고 넘어가기')}가 생겨요. 정답을 보고 넘어가도 괜찮아요. 그 문제는 <b>복습 노트</b>에 들어가요.</li>
      <li>그림은 손가락으로 <b>끌어서 돌려</b> 볼 수 있어요.</li><li>혼자 풀기에서 3번 연속 맞히면 <b>단계 없이</b> 도전해요. 어려우면 ${B('단계로 나누어 풀기')}를 눌러요.</li></ol>`],
    ['막힐 때',`<ol><li>맨 위 ${B('?','round')} <b>어떻게 하나요?</b> 버튼을 누르면 지금 화면의 사용법이 나와요.</li><li>로그인했다면 오른쪽 아래 ${B('✋','round red')} 손들기를 눌러요. 선생님 화면에 알림이 가요.</li>
      <li>문제가 이상하면 문제 아래 <b>⚑ 문제가 이상해요</b>를 눌러 선생님께 알려요.</li></ol>`],
    ['화면 옮겨 다니기',`<div class="hw-mock"><div class="hw-bar">${B('한 걸음 수학','logo')} <span class="hw-c"><u>› 1차시</u> › 혼자 풀기</span></div></div>
      <ol><li>맨 위 ${B('한 걸음 수학','logo')}을 누르면 언제든 <b>처음 화면</b>으로 가요.</li><li>그 옆 <b>› 1차시</b> 같은 경로 글자를 누르면 <b>한 칸 위 목록</b>으로 가요.</li>
      <li>휴대폰 <b>뒤로 가기</b>도 써도 돼요. 유형 안에서는 유형 고르기로, 처음 들어온 화면에서는 처음 화면으로 가요. 처음 화면에서 한 번 더 누르면 나가요.</li></ol>`],
    ['계산 연습 · 복습 · 포인트',`<ol><li><b>기초 연산</b>: 처음엔 <b>시작점 찾기</b>를 해요. 나에게 맞는 주제부터 연습해요.</li><li><b>오늘의 계산</b>: 섞어서 5문제. 매일 짧게 해요.</li>
      <li><b>복습 노트</b>: 틀린 문제가 1일, 3일, 7일 뒤 다시 나와요. 세 번 연속 맞히면 졸업이에요.</li><li><b>포인트</b>는 맞힌 것보다 <b>끝까지 해 본 것</b>에 더 많이 줘요. 포인트로 꾸미기 상점, 반 보스전에 참여해요.</li></ol>`,['#calc','기초 연산 열어 보기']],
    ['점검 학습지와 사진 채점',`<ol><li>선생님이 나눠 준 <b>점검 학습지</b>를 시험처럼 풀어요.</li><li>뒤쪽 <b>OMR 답안지</b>에 답을 칠해요. 숫자 답은 십의 자리, 일의 자리에 하나씩 칠해요.</li>
      <li><b>📷 채점</b> 화면에서 답안지를 찍으면 바로 채점돼요. 처음 찍은 점수가 선생님께 가요.</li><li>틀린 문제는 다시 풀어 보고, <b>이 유형 다시 풀기</b>로 연습해요.</li></ol>`,['#scan','채점 화면 열어 보기']]];
  app.innerHTML=`<div class="card panel hw-top"><h1>📖 한 걸음 수학 사용법</h1><p class="muted">선생님이 화면에 띄워 함께 보거나, 학생이 혼자 읽어도 되도록 차례대로 정리했어요. 각 칸의 <b>열어 보기</b>를 누르면 실제 화면으로 가요.</p>
    <nav class="hw-toc">${S.map((x,i)=>`<a href="#howto" data-j="hw${i+1}">${i+1}. ${x[0]}</a>`).join('')}</nav></div>
    <div class="hw-list">${S.map((x,i)=>sec(i+1,x[0],x[1],x[2])).join('')}</div>`;
  $$('.hw-toc a',app).forEach(a=>a.onclick=e=>{e.preventDefault();const t=document.getElementById(a.dataset.j);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})})}
function route(soft){SUB_BACK=null;
  document.body.classList.remove('pw-mode');hideTerm();stopSpeak();activeBox=null;pinKeyHandler=null;themePreview=null;applyTheme();if(!$('#labov').hidden)closeLab();
  const h=(location.hash||'').replace('#','');
  if(!h||h==='home')viewHome();
  else if(/^unit-[a-z]+$/.test(h)&&OPEN_UNITS.includes(h.slice(5)))viewUnit(h.slice(5));
  else if(STANDALONE&&/^(login|teacher|boss|baseball|bb-|sea|bossview-)/.test(h)){location.replace('#home');return}
  else if(h==='me')viewMe();
  else if(h==='dailyrev'&&typeof viewDailyRev==='function')viewDailyRev();
  else if(h==='review')viewReview();
  else if(h==='drill')viewDrill();
  else if(h==='login')viewLogin();
  else if(h==='teacher')viewTeacher();
  else if(h==='shop')viewShop();
  else if(h==='scan')viewScan();
  else if(h==='howto')viewHowto();
  else if(h==='print'||/^print-[a-z]+$/.test(h))viewPrint(h.slice(6)||null);
  else if(h==='calc')viewCalc();
  else if(/^calc-[a-z]+$/.test(h))viewCalcTopic(h.slice(5));
  else if(h==='baseball')viewBaseball();
  else if(/^bb-\d+$/.test(h))viewBBGame(+h.slice(3));
  else if(/^bb-cpu-(easy|mid|mh|hard|easy4)$/.test(h))viewBBCpu(h.slice(7));
  else if(h==='sea')viewSea();else if(/^sea-\d+$/.test(h))viewSeaGame(+h.slice(4));else if(/^sea-cpu-(easy|mid|hard)$/.test(h))viewSeaCpu(h.slice(8));
  else if(h==='boss')viewBoss();
  else if(/^bossview-\d+-\d+$/.test(h)){const[,g,k]=h.split('-');viewBossView(+g,+k)}
  else{let[id,tab]=h.split('-');if(id==='types')id='poly';const L=LESSONS.find(l=>l.id===id&&l.ready);if(L)viewLesson(id,TABS.some(t=>t.id===tab)?tab:'concept');else viewHome()}
  if(!soft)window.scrollTo(0,0);updateWho();
}
addEventListener('hashchange',()=>{LIVEX.sub='';route();livePing(false);helpBtn();howBtn()});backGuardInit();route();livePing(false,true);helpBtn();howBtn();updatePill();if(isStudent()){maybeConfirmWho();pullDB();flushPts()}