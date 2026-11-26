/* ───────── 게임: 오늘의 미션 · 꾸미기 상점 · 우리 반 보스전 ───────── */
const hashStr=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0};
function celebrate(msg){if(msg)toast(msg);if(reduced)return;const box=el('<div class="confetti" aria-hidden="true"></div>');
  const cols=['#ffe266','#8ec5ff','#ff8f8f','#7fdcb8','#c7a7ff','#ffb59b'];
  for(let i=0;i<36;i++){const p=document.createElement('i');p.style.left=(Math.random()*100)+'%';p.style.background=cols[i%cols.length];p.style.animationDelay=(Math.random()*0.35)+'s';p.style.setProperty('--dx',(Math.random()*160-80)+'px');p.style.setProperty('--r',(Math.random()*720-360)+'deg');box.appendChild(p)}
  document.body.appendChild(box);setTimeout(()=>box.remove(),2600)}

/* 오늘의 미션: 하루 3개. 하나에 +3, 셋 다 하면 +10 */
function dayState(){const t=today();let D=DB._day;if(!D||typeof D!=='object'||D.d!==t)D=DB._day={d:t,c:{},t:{},m:null};D.c=OBJ(D.c);D.t=OBJ(D.t);return D}
const MISSIONS={
  term3:{nm:'용어 카드 3개 열어 보기',k:'term',n:3},
  drill:{nm:'오늘의 계산 끝내기',k:'drill',n:1},
  steps1:{nm:'단계 문제 1개 끝까지 풀기',k:'steps',n:1},
  prac3:{nm:'연습 문제 3개 풀기',k:'prac',n:3},
  prac5:{nm:'연습 문제 5개 풀기',k:'prac',n:5},
  explore1:{nm:'탐구 활동 1개 끝내기',k:'explore',n:1},
  clean2:{nm:'연습 문제를 한 번도 안 틀리고 2개 맞히기',k:'clean',n:2},
  drill8:{nm:'오늘의 계산에서 8문제 이상 첫 시도에 맞히기',k:'drill8',n:1},
  review1:{nm:'복습 노트 문제 1개 풀기',k:'review',n:1},
  calc1:{nm:'기초 연산 한 세트 끝내기',k:'calc',n:1}};
function todayMissions(){const D=dayState();if(Array.isArray(D.m)&&D.m.length===3&&D.m.every(x=>MISSIONS[x]))return D.m;
  const r=mulberry(hashStr('mission:'+D.d));const A=pick(r,['term3','drill','calc1']),B=pick(r,['steps1','prac3']);
  let C=['clean2','drill8','prac5'];if(B==='prac3')C=C.filter(x=>x!=='prac5');if(A==='drill')C=C.filter(x=>x!=='drill8');if(dueReviews().length)C=C.concat(['review1','review1']);
  D.m=[A,B,pick(r,C)];save();return D.m}
const missionProg=id=>Math.min(MISSIONS[id].n,NUM(dayState().c[MISSIONS[id].k]));
function dayBump(k,n=1){const D=dayState();D.c[k]=NUM(D.c[k])+n;checkMissions()}
function dayTerm(key){const D=dayState();if(D.t[key])return;D.t[key]=1;D.c.term=Object.keys(D.t).length;checkMissions()}
function missionStreak(){const S=OBJ(DB._mis),t=today();return(S.last===t||S.last===addDays(t,-1))?NUM(S.streak):0}
function checkMissions(){const D=dayState(),ms=todayMissions();
  ms.forEach(id=>{if(missionProg(id)>=MISSIONS[id].n&&award(3,'mis:'+D.d+':'+id))toast(`오늘의 미션 완료 · ${MISSIONS[id].nm} (+3)`)});
  if(ms.every(id=>missionProg(id)>=MISSIONS[id].n)&&award(10,'misall:'+D.d)){const S=DB._mis=OBJ(DB._mis);S.streak=(S.last===addDays(D.d,-1))?NUM(S.streak)+1:1;S.last=D.d;bump('misall');setTimeout(()=>celebrate('오늘의 미션 3개를 모두 해냈어요! 보너스 +10'),700)}
  save();refreshMissionCard()}
function missionHref(id){const last=(DB._last&&LESSONS.find(l=>l.id===DB._last.id&&l.ready))||LESSONS.find(l=>l.ready);const L=last?last.id:'poly';
  return{term3:'#'+L,drill:'#drill',drill8:'#drill',steps1:'#'+L+'-steps',prac3:'#'+L+'-practice',prac5:'#'+L+'-practice',clean2:'#'+L+'-practice',explore1:'#'+L+'-explore',review1:'#review',calc1:'#calc'}[id]||'#home'}
function missionCardHTML(){const ms=todayMissions(),done=ms.filter(id=>missionProg(id)>=MISSIONS[id].n).length,sk=missionStreak();
  return`<div class="g-head"><b class="t">오늘의 미션</b><span class="k">${done}/3${done===3?' · 다 했어요!':' · 셋 다 하면 보너스 +10'}${sk?` · 미션 연속 ${sk}일`:''}</span></div>
  <ol class="mis">${ms.map(id=>{const M=MISSIONS[id],p=missionProg(id),ok=p>=M.n;return`<li class="${ok?'ok':''}"><span class="mchk">${ok?CHECK:''}</span><span class="mnm">${M.nm}${M.n>1?` <small class="rm">${p}/${M.n}</small>`:''}</span>${ok?'<span class="mpt rm">+3</span>':`<a class="mgo" href="${missionHref(id)}">하러 가기</a>`}</li>`}).join('')}</ol>`}
function refreshMissionCard(){const c=$('#misCard');if(c)c.innerHTML=missionCardHTML()}

/* 다면체 그리기 (SVG): 볼록 다면체라 앞을 보는 면만 그리면 겹치지 않아요 */
function shadeHex(hex,f){const n=parseInt(hex.slice(1),16);let c=[n>>16&255,n>>8&255,n&255];const to=f>=1?[255,255,255]:[29,38,64],t=f>=1?Math.min(1,f-1):Math.min(1,1-f);c=c.map((v,i)=>Math.round(v+(to[i]-v)*t));return`rgb(${c[0]},${c[1]},${c[2]})`}
function solidSVG(m,{yaw=0.6,pitch=0.36,cx=60,cy=60,r=40,color='#8ec5ff',sw=2.2,stroke='#1d2640'}={}){
  const c=m.c,cY=Math.cos(yaw),sY=Math.sin(yaw),cP=Math.cos(pitch),sP=Math.sin(pitch),s=r/m.R,L=[-0.45,-0.55,0.7],ll=Math.hypot(...L);
  const tr=(x,y,z)=>{const x1=x*cY-y*sY,y1=x*sY+y*cY;return[x1,-(y1*sP+z*cP),-y1*cP+z*sP]};
  const P=m.V.map(p=>tr(p[0]-c[0],p[1]-c[1],p[2]-c[2])),N=m.N.map(n=>tr(n[0],n[1],n[2]));let out='',top=Infinity;
  P.forEach(p=>{const y=cy+p[1]*s;if(y<top)top=y});
  m.F.forEach((f,i)=>{const n=N[i];if(n[2]<=1e-4)return;const d=Math.max(0,(n[0]*L[0]+n[1]*L[1]+n[2]*L[2])/ll);
    out+=`<polygon points="${f.map(k=>(cx+P[k][0]*s).toFixed(1)+','+(cy+P[k][1]*s).toFixed(1)).join(' ')}" fill="${shadeHex(color,0.74+0.46*d)}" stroke="${stroke}" stroke-width="${sw.toFixed(2)}" stroke-linejoin="round"/>`});
  return{svg:out,top}}
const AVM={};
function avMesh(id){if(AVM[id])return AVM[id];const m=id==='tetra'?pyramid(regPoly(3,1.25),1.25*Math.SQRT2):id==='octa'?octahedron(1.3):id==='dodeca'?dodecahedron():id==='icosa'?icosahedron(1.15):(SOLIDS[id]||SOLIDS.cube).mk();return AVM[id]=m}
function faceSVG(kind,x,y,u,boss){const k='#1d2640',e=10*u,f=v=>v.toFixed(1);
  const dot=cx=>`<ellipse cx="${f(cx)}" cy="${f(y-2*u)}" rx="${f(3.4*u)}" ry="${f(4.4*u)}" fill="${k}"/><circle cx="${f(cx+1.2*u)}" cy="${f(y-3.6*u)}" r="${f(1.2*u)}" fill="#fff"/>`;
  if(boss){const eye=d=>`<circle cx="${f(x+d*10*u)}" cy="${f(y-u)}" r="${f(4.6*u)}" fill="#fff" stroke="${k}" stroke-width="${f(1.6*u)}"/><circle cx="${f(x+d*9*u)}" cy="${f(y-0.4*u)}" r="${f(2.1*u)}" fill="${k}"/>`;
    return[-1,1].map(d=>`<path d="M${f(x+d*18*u)} ${f(y-12*u)} L${f(x+d*5*u)} ${f(y-6.5*u)}" stroke="${k}" stroke-width="${f(3.2*u)}" stroke-linecap="round"/>`).join('')+eye(-1)+eye(1)+
      `<path d="M${f(x-10*u)} ${f(y+13*u)} Q${f(x)} ${f(y+6*u)} ${f(x+10*u)} ${f(y+13*u)}" fill="none" stroke="${k}" stroke-width="${f(2.8*u)}" stroke-linecap="round"/><path d="M${f(x-4*u)} ${f(y+9.6*u)} l${f(1.6*u)} ${f(3*u)} l${f(1.6*u)} ${f(-3.4*u)} M${f(x+1*u)} ${f(y+9.4*u)} l${f(1.6*u)} ${f(3*u)} l${f(1.6*u)} ${f(-3*u)}" fill="#fff" stroke="${k}" stroke-width="${f(1.1*u)}" stroke-linejoin="round"/>`}
  let s;
  if(kind==='sparkle')s=[-1,1].map(d=>`<circle cx="${f(x+d*e)}" cy="${f(y-2*u)}" r="${f(5.2*u)}" fill="${k}"/><circle cx="${f(x+d*e+1.8*u)}" cy="${f(y-4*u)}" r="${f(1.9*u)}" fill="#fff"/><circle cx="${f(x+d*e-1.6*u)}" cy="${f(y)}" r="${f(0.9*u)}" fill="#fff"/>`).join('');
  else if(kind==='sleepy')s=[-1,1].map(d=>`<path d="M${f(x+d*e-4*u)} ${f(y-2*u)} Q${f(x+d*e)} ${f(y+1.6*u)} ${f(x+d*e+4*u)} ${f(y-2*u)}" fill="none" stroke="${k}" stroke-width="${f(2.2*u)}" stroke-linecap="round"/>`).join('');
  else if(kind==='wink')s=dot(x-e)+`<path d="M${f(x+e-4*u)} ${f(y-u)} L${f(x+e)} ${f(y-4.6*u)} L${f(x+e+4*u)} ${f(y-u)}" fill="none" stroke="${k}" stroke-width="${f(2.2*u)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  else if(kind==='glasses')s=dot(x-e)+dot(x+e)+[-1,1].map(d=>`<circle cx="${f(x+d*e)}" cy="${f(y-2*u)}" r="${f(7*u)}" fill="rgba(255,255,255,.28)" stroke="${k}" stroke-width="${f(1.8*u)}"/>`).join('')+`<path d="M${f(x-3*u)} ${f(y-3*u)} Q${f(x)} ${f(y-5*u)} ${f(x+3*u)} ${f(y-3*u)}" fill="none" stroke="${k}" stroke-width="${f(1.8*u)}"/>`;
  else s=dot(x-e)+dot(x+e);
  return s+[-1,1].map(d=>`<ellipse cx="${f(x+d*17*u)}" cy="${f(y+7.5*u)}" rx="${f(4.6*u)}" ry="${f(2.8*u)}" fill="#ff8fa3" opacity=".55"/>`).join('')+
    `<path d="M${f(x-5*u)} ${f(y+7*u)} Q${f(x)} ${f(y+11*u)} ${f(x+5*u)} ${f(y+7*u)}" fill="none" stroke="${k}" stroke-width="${f(2.2*u)}" stroke-linecap="round"/>`}
/* 꾸미기 상점: Kenney 3D 미니 캐릭터 + 프로필 프레임 + 형광펜 · 모은 포인트(누적)는 유지 */
const MINI_BASE='assets/mini-characters';
const RAR_NM={common:'일반',rare:'반짝',legend:'전설'};
const RAR_W={common:60,rare:30,legend:10};
const GACHA_COST=120,GACHA_MAX_DAY=2;
const SHOP=[
 {cat:'mini',nm:'3D 캐릭터',items:[
   {id:'fa',nm:'민지',f:'character-female-a',r:'common',p:0},
   {id:'ma',nm:'준호',f:'character-male-a',r:'common',p:0},
   {id:'fb',nm:'서연',f:'character-female-b',r:'common',p:180},
   {id:'mb',nm:'도윤',f:'character-male-b',r:'common',p:180},
   {id:'fc',nm:'하은',f:'character-female-c',r:'common',p:180},
   {id:'mc',nm:'시우',f:'character-male-c',r:'common',p:180},
   {id:'fd',nm:'지우',f:'character-female-d',r:'rare',p:300},
   {id:'md',nm:'예준',f:'character-male-d',r:'rare',p:300},
   {id:'fe',nm:'수아',f:'character-female-e',r:'rare',p:300},
   {id:'me',nm:'건우',f:'character-male-e',r:'rare',p:300},
   {id:'ff',nm:'별빛 소녀',f:'character-female-f',r:'legend',p:500},
   {id:'mf',nm:'은하 소년',f:'character-male-f',r:'legend',p:500}]},
 {cat:'frame',nm:'프로필 프레임',items:[
   {id:'none',nm:'기본',p:0,cls:'f-none'},
   {id:'sky',nm:'하늘 원',p:25,cls:'f-sky'},
   {id:'mint',nm:'민트 모눈',p:25,cls:'f-mint'},
   {id:'sakura',nm:'벚꽃 링',p:35,cls:'f-sakura'},
   {id:'night',nm:'밤하늘 별',p:55,cls:'f-night'},
   {id:'gold',nm:'반짝 골드',p:80,cls:'f-gold'},
   {id:'aura',nm:'무지개 오라',p:110,cls:'f-aura'}]},
 {cat:'hi',nm:'형광펜 색',items:[
   {id:'yellow',nm:'노랑',p:0,c:'#ffe266',s:'#fff6c7'},
   {id:'pink',nm:'분홍',p:40,c:'#ffb8d6',s:'#ffeaf3'},
   {id:'mint',nm:'민트',p:40,c:'#9ff0d0',s:'#e3fbf2'},
   {id:'sky',nm:'하늘',p:40,c:'#aee0ff',s:'#e6f5ff'},
   {id:'orange',nm:'주황',p:40,c:'#ffcb8e',s:'#fff0dd'}]}];
const shopCat=c=>SHOP.find(x=>x.cat===c);
const shopItem=(c,id)=>{const C=shopCat(c);return C?(C.items.find(x=>x.id===id)||C.items[0]):null};
function shopState(){const S=OBJ(DB._shop);S.spent=NUM(S.spent);S.own=OBJ(S.own);S.eq=OBJ(S.eq);DB._shop=S;return S}
function owns(c,id){const C=shopCat(c),it=C&&C.items.find(x=>x.id===id);return!!it&&(it.p===0||!!shopState().own[c+':'+id])}
function myEq(){const S=shopState(),o={};SHOP.forEach(C=>{const id=S.eq[C.cat];o[C.cat]=(id&&owns(C.cat,id))?id:C.items[0].id});return o}
const balance=()=>Math.max(0,NUM(me().pts)-shopState().spent+bbLedger());
let themePreview=null;
function applyTheme(){const it=themePreview||shopItem('hi',myEq().hi),r=document.documentElement.style;r.setProperty('--hi',it.c);r.setProperty('--hi-soft',it.s)}
function equipItem(c,id){if(!owns(c,id))return false;shopState().eq[c]=id;save();applyTheme();return true}
function buyItem(c,id){const it=shopItem(c,id);if(!it||it.id!==id)return false;if(owns(c,id))return equipItem(c,id);
  if(balance()<it.p){toast(`포인트가 ${it.p-balance()}만큼 모자라요.`);return false}
  const S=shopState();S.spent+=it.p;S.own[c+':'+id]=1;S.eq[c]=id;save();applyTheme();return true}

/* 2D PNG 썸네일(목록·보스전·숫자야구) & 3D <model-viewer>(상점·내 기록) 하이브리드 렌더러 */
function miniThumbHTML(it,size=88){const src=`${MINI_BASE}/previews/${it.f}.png`;
  return`<img class="mini-thumb" src="${src}" alt="${it.nm}" width="${size}" height="${size}" loading="lazy" onerror="this.outerHTML='<span class=\\'mini-fb\\' style=\\'width:${size}px;height:${size}px\\'>${it.nm}<small>3D 캐릭터</small></span>'">`}
function avatarThumb(eq,size=86){const it=shopItem('mini',eq&&eq.mini),fr=shopItem('frame',eq&&eq.frame);
  return`<span class="av-fr ${fr.cls}" style="width:${size+10}px;height:${size+10}px">${miniThumbHTML(it,size)}</span>`}
/* 기존 js/02-unit-solid.js(viewMe 등) 호환 래퍼 */
function avatarSVG(eq,size=120){return avatarThumb(eq,size)}
function mini3DHTML(it,size=210,frCls='f-none'){const glb=`${MINI_BASE}/glb/${it.f}.glb`,png=`${MINI_BASE}/previews/${it.f}.png`;
  return`<div class="av-fr ${frCls}" style="width:${size+14}px;height:${size+14}px;margin:0 auto"><div class="mv-box mv-inner" style="width:${size}px;height:${size}px"><model-viewer src="${glb}" poster="${png}" animation-name="idle" alt="${it.nm} 3D 캐릭터" autoplay auto-rotate camera-controls interaction-prompt="none" shadow-intensity="0.55" style="width:${size}px;height:${size}px"></model-viewer></div></div><div class="mv-hint">끌어서 돌려 볼 수 있어요</div>`}
function mountSpin(host,render,{speed=0.6}={}){
  if(host&&host.id==='avMe'){mountAvatar(host,()=>myEq(),160);return}
  let yaw=0.6,last=0;host.innerHTML=render(yaw);if(reduced)return;
  const tick=ts=>{if(!host.isConnected)return;if(ts-last>45){yaw+=Math.min(0.2,(ts-last)/1000*speed);last=ts;host.innerHTML=render(yaw)}requestAnimationFrame(tick)};
  requestAnimationFrame(ts=>{last=ts;requestAnimationFrame(tick)})}
function mountAvatar(host,getEq,size=210){let curKey='',token=0;
  function sync(){if(!host||!host.isConnected)return;const eq=getEq(),it=shopItem('mini',eq.mini),fr=shopItem('frame',eq.frame);
    const key=it.id+':'+fr.id;if(key===curKey)return;
    curKey=key;const myTok=++token;
    host.innerHTML=mini3DHTML(it,size,fr.cls);const mv=$('model-viewer',host);
    if(mv)mv.addEventListener('error',()=>{if(token===myTok)host.innerHTML=avatarThumb(eq,size)})}
  sync();return sync}

/* 착한 캡슐 뽑기: 100% 꽝 없음 · 중복 없음 · 오늘의 계산 완료 시 무료 1회 · 하루 최대 2회 */
function gachaInfo(){const S=shopState(),t=today(),pool=shopCat('mini').items.filter(it=>it.p>0&&!owns('mini',it.id));
  const used=S.gachaDay===t?NUM(S.gachaCnt):0,drillDone=NUM(dayState().c.drill)>0||OBJ(DB._drill).last===t;
  const free=drillDone&&S.freeGachaDay!==t&&pool.length>0&&used<GACHA_MAX_DAY;
  return{pool,used,left:Math.max(0,GACHA_MAX_DAY-used),free,total:shopCat('mini').items.filter(it=>it.p>0).length}}
function pullGacha(){const g=gachaInfo();if(!g.pool.length)return{err:'all'};if(g.left<=0)return{err:'limit'};
  if(!g.free&&balance()<GACHA_COST)return{err:'pts',need:GACHA_COST-balance()};
  const S=shopState(),t=today();if(S.gachaDay!==t){S.gachaDay=t;S.gachaCnt=0}
  if(g.free)S.freeGachaDay=t;else S.spent+=GACHA_COST;
  S.gachaCnt=NUM(S.gachaCnt)+1;
  const ws=g.pool.map(it=>RAR_W[it.r]||30);let roll=Math.random()*ws.reduce((a,b)=>a+b,0),won=g.pool[g.pool.length-1];
  for(let i=0;i<g.pool.length;i++){roll-=ws[i];if(roll<=0){won=g.pool[i];break}}
  S.own['mini:'+won.id]=1;save();return{won,free:g.free}}

function viewShop(){
  crumbs.innerHTML=`<span class="sep">›</span><a href="#me">내 기록</a><span class="sep">›</span><span>꾸미기 상점</span>`;
  let cat='mini',preview=null,gachaBusy=false;
  app.innerHTML=`<div class="unit-head"><div><h1>꾸미기 상점</h1><p>포인트로 내 3D 캐릭터와 프로필을 꾸며요. 물건을 사도 <b>모은 포인트 기록은 줄지 않고</b>, 쓸 수 있는 포인트만 줄어요.</p></div></div>
   <div class="card panel gacha-card" id="gachaBox"></div>
   <div class="card panel shop"><div class="shop-top"><div class="av-stage" id="avBig"></div><div class="shop-info"><div class="stat"><small>쓸 수 있는 포인트</small><b class="rm" id="bal"></b></div><div class="shop-act" id="shopAct" aria-live="polite"></div></div></div>
   <div class="seg shopTabs" role="tablist">${SHOP.map(C=>`<button type="button" data-c="${C.cat}" role="tab">${C.nm}</button>`).join('')}</div><div class="shop-grid" id="shopGrid"></div></div>`;
  const eqNow=()=>{const e=myEq();if(preview&&preview.cat!=='hi')e[preview.cat]=preview.id;return e};
  const syncAv=mountAvatar($('#avBig',app),eqNow,210);
  function drawGacha(resHTML=''){const g=gachaInfo(),got=g.total-g.pool.length,box=$('#gachaBox',app);
    const btnTxt=!g.pool.length?'모든 3D 캐릭터를 모았어요 🎉':g.left<=0?`오늘 뽑기 완료 (${GACHA_MAX_DAY}/${GACHA_MAX_DAY})`:g.free?'🎁 오늘의 계산 무료 뽑기!':`🎁 캡슐 뽑기 (${GACHA_COST}포인트)`;
    const dis=!g.pool.length||g.left<=0||(!g.free&&balance()<GACHA_COST)||gachaBusy;
    box.innerHTML=`<div class="gacha-head"><h2>🎁 3D 미니 캐릭터 캡슐 뽑기</h2><button type="button" class="btn primary gachaGo" ${dis?'disabled':''}>${btnTxt}</button></div>
      <p class="gacha-meta"><b>100% 꽝 없음 · 중복 없음!</b> 아직 없는 캐릭터만 나와요 · 모은 캐릭터 <b class="rm">${got}/${g.total}</b> · 오늘 남은 횟수 <b class="rm">${g.left}/${GACHA_MAX_DAY}</b>${g.free?' · <b style="color:var(--ok)">오늘의 계산 완료 무료권 사용 가능!</b>':' · 오늘의 계산을 끝내면 하루 1회 무료!'}</p>
      ${resHTML?`<div class="gacha-stage">${resHTML}</div>`:''}`;
    const gb=$('.gachaGo',box);
    if(gb)gb.onclick=()=>{if(gachaBusy)return;gachaBusy=true;drawGacha('<div class="gacha-cap" aria-hidden="true">💊</div><p class="muted" style="margin:6px 0 0">캡슐이 열리고 있어요…</p>');
      setTimeout(()=>{const r=pullGacha();gachaBusy=false;
        if(r.err){drawGacha(`<p class="muted">${r.err==='pts'?`포인트가 ${r.need}만큼 모자라요.`:r.err==='limit'?'오늘 뽑기 횟수를 다 썼어요. 내일 다시 뽑아요!':'이미 모든 캐릭터를 모았어요!'}</p>`);return}
        const w=r.won;celebrate(`${RAR_NM[w.r]} 캐릭터 ‘${w.nm}’를 얻었어요!`);
        drawGacha(`<div class="gacha-res"><span class="rar ${w.r}">${RAR_NM[w.r]}</span><h3 style="margin:4px 0 8px">${w.nm}</h3>${mini3DHTML(w,170,shopItem('frame',myEq().frame).cls)}<p style="margin:10px 0 0"><button type="button" class="btn primary gEquip">바로 장착하기</button></p></div>`);
        const ge=$('.gEquip',box);if(ge)ge.onclick=()=>{equipItem('mini',w.id);setPreview(null);toast(`${w.nm} 캐릭터로 바꿨어요!`);drawGacha('')};
        draw()},reduced?0:650)}}
  function setPreview(p){preview=p;themePreview=p&&p.cat==='hi'?shopItem('hi',p.id):null;applyTheme();syncAv();draw()}
  function draw(){$('#bal',app).textContent=balance();$$('.shopTabs button',app).forEach(b=>{const on=b.dataset.c===cat;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
    const C=shopCat(cat),E=myEq();
    $('#shopGrid',app).innerHTML=C.items.map(it=>{const own=owns(cat,it.id),on=E[cat]===it.id,sel=preview&&preview.cat===cat&&preview.id===it.id;
      const pic=cat==='hi'?`<span class="hi-sw"><span style="background:linear-gradient(transparent 52%,${it.c} 52%)">형광펜</span></span>`:cat==='frame'?`<span class="av-fr ${it.cls} fr-sw"></span>`:miniThumbHTML(it,88);
      const badge=it.r?`<span class="rar ${it.r}">${RAR_NM[it.r]}</span>`:'';
      return`<button type="button" class="shop-item ${on?'on':''} ${sel?'sel':''}" data-id="${it.id}" aria-pressed="${!!sel}">${badge}<span class="pic">${pic}</span><b>${it.nm}</b><small>${on?'쓰는 중':own?'가지고 있음':it.p+' 포인트'}</small></button>`}).join('');
    $$('#shopGrid .shop-item',app).forEach(b=>b.onclick=()=>setPreview({cat,id:b.dataset.id}));act();if(!gachaBusy&&!$('.gacha-res',app))drawGacha()}
  function act(){const A=$('#shopAct',app);if(!preview){A.innerHTML='<span class="muted">아래에서 고르면 위 캐릭터에 먼저 입혀 볼 수 있어요.</span>';return}
    const it=shopItem(preview.cat,preview.id),own=owns(preview.cat,preview.id),on=myEq()[preview.cat]===preview.id;
    if(on){A.innerHTML=`<b>${it.nm}</b> <span class="muted">· 쓰는 중이에요</span>`;return}
    if(own){A.innerHTML=`<b>${it.nm}</b> <button type="button" class="btn primary">이걸로 바꾸기</button>`;$('button',A).onclick=()=>{equipItem(preview.cat,preview.id);setPreview(null);toast('바꿨어요!')};return}
    const lack=it.p-balance();
    A.innerHTML=`<b>${it.nm}</b> · <b class="rm">${it.p}</b> 포인트 ${lack>0?`<span class="muted">· ${lack}포인트 더 모으면 살 수 있어요</span>`:'<button type="button" class="btn primary">사기</button>'}`;
    const bb=$('button',A);if(bb)bb.onclick=()=>{if(buyItem(preview.cat,preview.id)){setPreview(null);celebrate(`${josa(it.nm,'을','를')} 샀어요!`)}}}
  $$('.shopTabs button',app).forEach(b=>b.onclick=()=>{cat=b.dataset.c;setPreview(null)});draw();refreshLedger().then(L=>{if(L&&$('#bal',app))draw()})}

/* 우리 반 보스전: 반 친구들이 이번 주에 받은 포인트의 합 = 보스에게 준 데미지 */
const BOSSES=[{id:'golem',nm:'큐브 골렘',mesh:'cube',c:'#a3adbf'},{id:'sphinx',nm:'피라미드 스핑크스',mesh:'y4',c:'#e9c46a'},{id:'turtle',nm:'육각기둥 거북',mesh:'p6',c:'#7cc6a4'},
  {id:'witch',nm:'정팔면체 마녀',mesh:'oct',c:'#b8a1ff'},{id:'drake',nm:'정십이면체 드래곤',mesh:'dod',c:'#ff8f7a'},{id:'king',nm:'정이십면체 대왕',mesh:'ico',c:'#6fb4ff'}];
const weekNo=ws=>Math.floor(Date.parse(ws+'T00:00:00Z')/864e5/7);
function bossPlan(st){const H=Math.max(50,NUM(st.per_student)*Math.max(NUM(st.members),5)),wi=weekNo(st.week_start)||0,dmg=NUM(st.damage),stages=[];let thr=0;
  for(let k=0;k<6;k++){const hp=Math.round(H*(1+0.5*k)/10)*10;stages.push({k,hp,boss:BOSSES[(wi+k)%BOSSES.length],start:thr,end:thr+hp});thr+=hp}
  return{stages,dmg,cur:stages.find(s=>dmg<s.end)||null,defeated:stages.filter(s=>dmg>=s.end)}}
function bossSVG(b,size,yaw){const cx=size/2,cy=size*0.54,r=size*0.33,u=r/40;const{svg}=solidSVG(avMesh(b.mesh),{yaw,pitch:0.3,cx,cy,r,color:b.c,sw:Math.max(1.3,size/60)});
  return`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><ellipse cx="${cx}" cy="${(cy+r*1.1).toFixed(1)}" rx="${(r*0.9).toFixed(1)}" ry="${(r*0.14).toFixed(1)}" fill="rgba(29,38,64,.14)"/>${svg}${faceSVG(null,cx,cy+r*0.04,u,true)}</svg>`}
const winSVG=()=>`<svg width="220" height="220" viewBox="0 0 220 220" aria-hidden="true"><path d="M70 40h80v40a40 40 0 0 1-80 0z" fill="#ffd23f" stroke="#1d2640" stroke-width="4" stroke-linejoin="round"/><path d="M70 52H48a22 22 0 0 0 22 30M150 52h22a22 22 0 0 1-22 30" fill="none" stroke="#1d2640" stroke-width="4"/><path d="M100 118h20v26h-20z" fill="#ffd23f" stroke="#1d2640" stroke-width="4"/><rect x="76" y="144" width="68" height="18" rx="4" fill="#1d2640"/><path d="M110 56l5 10 11 1.6-8 7.8 2 11-10-5.3-10 5.3 2-11-8-7.8 11-1.6z" fill="#fff"/></svg>`;
const GAME={st:null,off:false,at:0,busy:false,ptsT:null};
const isMissingFn=e=>!!e&&(e.status===404||/Could not find the function|PGRST202|알 수 없는 요청/.test(e.message||''));
const ptsKey=()=>'hangeoreum-pts:'+(AUTH?AUTH.sid:'');
function queuePts(n){if(!isStudent()||!(n>0))return;const P=OBJ(lsGet(ptsKey(),{})),d=today();P[d]=NUM(P[d])+n;lsSet(ptsKey(),P);clearTimeout(GAME.ptsT);GAME.ptsT=setTimeout(flushPts,1200)}
let ptsBusy=false;
async function flushPts(){if(!isStudent()||ptsBusy||GAME.off)return;ptsBusy=true;const key=ptsKey();let sent=false;
  try{let P=OBJ(lsGet(key,{}));const cut=addDays(today(),-3);
    for(const d of Object.keys(P).sort()){if(d<cut){delete P[d];lsSet(key,P);continue}
      while(NUM(P[d])>0){const n=Math.min(NUM(P[d]),200);await API.call('hg_add_points',{p_token:AUTH.token,p_pts:n,p_day:d});sent=true;P=OBJ(lsGet(key,{}));P[d]=Math.max(0,NUM(P[d])-n);if(!P[d])delete P[d];lsSet(key,P)}}}
  catch(e){if(isMissingFn(e)){GAME.off=true;renderBossBits()}else if(isAuthErr(e))authExpired()}
  finally{ptsBusy=false;if(sent&&($('#bossCard')||$('#bossHost')))loadClass(true)}}
async function loadClass(force){if(!isStudent()||GAME.off)return null;if(GAME.busy)return GAME.st;if(!force&&GAME.st&&Date.now()-GAME.at<15000){renderBossBits();return GAME.st}GAME.busy=true;
  try{const st=await API.call('hg_class_status',{p_token:AUTH.token});if(!isStudent())return null;GAME.st=st;GAME.at=Date.now();bossRewards(st);return st}
  catch(e){if(isMissingFn(e))GAME.off=true;else if(isAuthErr(e))authExpired();return null}
  finally{GAME.busy=false;renderBossBits()}}
function bossRewards(st){if(!st||!(NUM(st.my)>0))return;bossPlan(st).defeated.forEach(s=>{const n=10+5*s.k;if(award(n,'boss:'+st.week_start+':'+s.k)){bump('boss');setTimeout(()=>celebrate(`우리 반이 ${josa(s.boss.nm,'을','를')} 물리쳤어요! 보너스 +${n}`),400)}})}
const offHTML=()=>`<div class="g-head"><b class="t">우리 반 보스전</b></div><p class="muted" style="margin:6px 0 0">선생님이 서버에 게임 설정을 추가하면 열려요.</p>`;
function bossCardHTML(){
  if(!isStudent())return`<div class="g-head"><b class="t">우리 반 보스전</b></div><p style="margin:6px 0 12px">로그인하면 반 친구들과 함께 이번 주 보스를 물리쳐요. 내가 받은 포인트만큼 보스에게 데미지가 들어가요.</p><a class="btn" href="#login">로그인하기</a>`;
  if(GAME.off)return offHTML();
  const st=GAME.st;if(!st)return`<div class="g-head"><b class="t">우리 반 보스전</b></div><p class="muted">불러오는 중…</p>`;
  const pl=bossPlan(st),c=pl.cur;
  if(!c)return`<div class="g-head"><b class="t">우리 반 보스전</b><span class="k">${st.grade}학년 ${st.klass}반</span></div><div class="boss-mini"><div class="bm-pic">${winSVG().replace('width="220" height="220"','width="84" height="84"')}</div><div class="bm-info"><b>이번 주 보스를 모두 물리쳤어요!</b><small>참여 ${NUM(st.active)}/${NUM(st.members)}명 · 내 데미지 <span class="rm">${NUM(st.my)}</span></small></div></div><a class="btn primary" href="#boss">보스전 보기 →</a>`;
  const left=c.end-pl.dmg,pct=Math.max(0,Math.min(100,left/c.hp*100));
  return`<div class="g-head"><b class="t">우리 반 보스전</b><span class="k">${st.grade}학년 ${st.klass}반 · 이번 주 ${c.k+1}단계</span></div>
   <div class="boss-mini"><div class="bm-pic">${bossSVG(c.boss,90,0.5)}</div><div class="bm-info"><b>${c.boss.nm}</b><div class="hpbar"><i style="width:${pct.toFixed(1)}%"></i></div><small>체력 <span class="rm">${left}</span> / ${c.hp} · 참여 ${NUM(st.active)}/${NUM(st.members)}명 · 내 데미지 <span class="rm">${NUM(st.my)}</span></small></div></div>
   <a class="btn primary" href="#boss">보스전 보기 →</a>`}
const wkLabel=w=>{const d=new Date(w+'T00:00:00');return`${d.getMonth()+1}월 ${d.getDate()}일부터 한 주`};
function trophyHTML(st){const W=Array.isArray(st.weeks)?st.weeks:[];
  const rows=W.map(w=>({w:w.w,list:bossPlan(Object.assign({},st,{week_start:w.w,damage:w.damage})).defeated})).filter(r=>r.list.length);
  return`<div class="card panel"><h2>우리 반 트로피</h2>${rows.length?`<div class="trophies">${rows.map(r=>`<div class="tro"><small>${wkLabel(r.w)}</small><span>${r.list.map(s=>`<span class="tro-b" title="${s.boss.nm}">${bossSVG(s.boss,44,0.5)}</span>`).join('')}</span></div>`).join('')}</div>`:'<p class="muted" style="margin-bottom:0">지난 8주 동안 물리친 보스가 여기에 모여요.</p>'}</div>`}
function weekBarsHTML(st){const dayN=['월','화','수','목','금','토','일'],days=Array.isArray(st.days)?st.days.map(NUM):[0,0,0,0,0,0,0],mx=Math.max(10,...days),ti=Math.round((Date.parse(st.today+'T00:00:00Z')-Date.parse(st.week_start+'T00:00:00Z'))/864e5);
  return days.map((v,i)=>`<div class="wb ${i===ti?'today':''}"><span class="bar"><i style="height:${Math.round(v/mx*100)}%"></i></span><small>${dayN[i]}</small><small class="rm">${v||''}</small></div>`).join('')}
function renderBossPage(host,st,opt={}){host._st=st;const pl=bossPlan(st),c=pl.cur,big=!!opt.big;const left=c?c.end-pl.dmg:0,pct=c?Math.max(0,Math.min(100,left/c.hp*100)):0;
  host.innerHTML=`<div class="card panel arena-card ${big?'big':''}">
   <div class="arena-top"><span class="stage-tag">${c?`이번 주 ${c.k+1}단계 보스`:'이번 주 완전 승리'}</span><span class="muted">${st.grade}학년 ${st.klass}반 · 보스는 매주 월요일에 새로 나타나요</span></div>
   <div class="arena"><div class="boss-pic"></div><div class="dmg-layer"></div>${opt.teacher?'':`<div class="arena-me" title="내 캐릭터">${avatarThumb(myEq(),big?110:86)}<small>나</small></div>`}</div>
   <h2 class="boss-name">${c?c.boss.nm:'이번 주 보스를 모두 물리쳤어요!'}</h2>
   ${c?`<div class="hpbar big" role="img" aria-label="보스 체력 ${left} / ${c.hp}"><i style="width:${pct.toFixed(1)}%"></i><span class="hpt">체력 <b class="rm hpl">${left}</b> / ${c.hp}</span></div>`:''}
   <div class="arena-stats"><div class="stat"><small>이번 주 우리 반 데미지</small><b class="rm aDmg">${pl.dmg}</b></div><div class="stat"><small>참여한 친구</small><b class="aAct">${NUM(st.active)}/${NUM(st.members)}명</b></div>${opt.teacher?'':`<div class="stat"><small>내가 준 데미지</small><b class="rm aMy">${NUM(st.my)}</b></div>`}</div>
   <div class="roadmap" aria-label="이번 주 보스 순서">${pl.stages.map(s=>`<span class="rd ${pl.dmg>=s.end?'down':c&&s.k===c.k?'cur':''}"><span class="rdp">${bossSVG(s.boss,big?64:46,0.5)}</span><small>${s.k+1}단계</small>${pl.dmg>=s.end?'<i>격파</i>':''}</span>`).join('')}</div>
   <div class="wbars" aria-label="요일별 우리 반 데미지">${weekBarsHTML(st)}</div></div>
  ${opt.teacher?'':`<div class="card panel"><h2>데미지를 주는 방법</h2><p style="margin-top:0">포인트를 받으면 <b>그만큼 보스에게 데미지</b>가 들어가요. 정답보다 <b>끝까지 해 보는 것</b>에 포인트를 더 많이 줘요.</p>
    <div class="dmg-ways"><span>단계 문제 끝까지 <b class="rm">10</b></span><span>연습 문제 <b class="rm">1~5</b></span><span>오늘의 계산 <b class="rm">5+</b></span><span>오늘의 미션 <b class="rm">3</b> · 셋 다 <b class="rm">+10</b></span><span>탐구 활동 <b class="rm">2~5</b></span><span>개념 처음 읽기 <b class="rm">5</b></span></div>
    <p class="muted" style="margin-bottom:0">우리 반이 보스를 물리치면, 이번 주에 한 번이라도 데미지를 준 친구 모두 보너스 포인트를 받아요.</p></div>`}
  ${trophyHTML(st)}`;
  const pic=$('.boss-pic',host);if(c)mountSpin(pic,y=>bossSVG(c.boss,big?330:240,y),{speed:0.5});else pic.innerHTML=winSVG()}
function hitFx(host,n){const pic=$('.boss-pic',host),lay=$('.dmg-layer',host);
  if(pic&&!reduced){pic.classList.remove('hit');void pic.offsetWidth;pic.classList.add('hit');setTimeout(()=>pic.classList.remove('hit'),500)}
  if(lay){const d=el(`<span class="dmg">-${n}</span>`);d.style.left=(28+Math.random()*44)+'%';d.style.top=(20+Math.random()*30)+'%';lay.appendChild(d);setTimeout(()=>d.remove(),1300)}}
function defeatFx(host,cur){const pic=$('.boss-pic',host);if(pic)pic.classList.add('down');const ar=$('.arena',host);if(ar)ar.appendChild(el('<span class="stamp">격파!</span>'));celebrate(cur?`${josa(cur.boss.nm,'을','를')} 물리쳤어요!`:'')}
function updateBossPage(host,st,opt={}){const old=host._st;if(!old||old.week_start!==st.week_start){renderBossPage(host,st,opt);return}
  const a=bossPlan(old),b=bossPlan(st),ka=a.cur?a.cur.k:6,kb=b.cur?b.cur.k:6;host._st=st;
  if(kb!==ka){if(kb>ka){defeatFx(host,a.cur);setTimeout(()=>{if(host.isConnected)renderBossPage(host,host._st,opt)},1800)}else renderBossPage(host,st,opt);return}
  if(b.cur){const left=b.cur.end-b.dmg,i=$('.hpbar i',host),L=$('.hpl',host);if(i)i.style.width=Math.max(0,Math.min(100,left/b.cur.hp*100)).toFixed(1)+'%';if(L)L.textContent=left}
  const set=(s,v)=>{const e=$(s,host);if(e)e.textContent=v};set('.aDmg',b.dmg);set('.aAct',`${NUM(st.active)}/${NUM(st.members)}명`);set('.aMy',NUM(st.my));
  const wb=$('.wbars',host);if(wb)wb.innerHTML=weekBarsHTML(st);
  if(b.dmg>a.dmg)hitFx(host,b.dmg-a.dmg)}
function renderBossBits(){const c=$('#bossCard');if(c)c.innerHTML=bossCardHTML();
  const h=$('#bossHost');if(!h||location.hash!=='#boss')return;
  if(GAME.off){h._st=null;h.innerHTML=`<div class="card panel">${offHTML()}</div>`;return}
  if(GAME.st){if(h._st)updateBossPage(h,GAME.st,{});else renderBossPage(h,GAME.st,{})}}
function viewBoss(){crumbs.innerHTML=`<span class="sep">›</span><span>우리 반 보스전</span>`;
  app.innerHTML=`<div class="unit-head"><div><h1>우리 반 보스전</h1><p>내가 받은 포인트만큼 보스에게 데미지가 들어가요. 반 친구들과 힘을 모아 이번 주 보스를 물리쳐요.</p></div></div><div id="bossHost"></div>`;
  const h=$('#bossHost',app);
  if(!isStudent()){h.innerHTML=`<div class="card panel"><p style="margin-top:0">로그인하면 우리 반 친구들과 함께 보스전에 참여해요.</p><a class="btn primary" href="#login">로그인하기</a></div>`;return}
  if(GAME.off){h.innerHTML=`<div class="card panel">${offHTML()}</div>`;return}
  h.innerHTML='<div class="card panel"><p class="muted" style="margin:0">불러오는 중…</p></div>';
  if(GAME.st)renderBossPage(h,GAME.st,{});loadClass(true);
  const timer=setInterval(()=>{if(!h.isConnected){clearInterval(timer);return}if(document.visibilityState==='visible')loadClass(true)},10000)}
/* 교사: 보스전 크게 띄우기 (수업 화면) */
function viewBossView(g,k){crumbs.innerHTML=`<span class="sep">›</span><a href="#teacher">교사 화면</a><span class="sep">›</span><span>${g}학년 ${k}반 보스전</span>`;
  if(!tTok()){app.innerHTML=`<div class="login-wrap">${demoBanner()}<div class="card panel login-card"><h1 style="font-size:28px">보스전 크게 띄우기</h1><p class="muted">교사 로그인이 필요해요.</p>${teacherForm()}</div></div>`;wireTeacherForm(app,()=>viewBossView(g,k));return}
  app.innerHTML=`<div class="bv-bar"><a class="btn ghost" href="#teacher">← 교사 화면</a><button type="button" class="btn ghost bvFull">전체 화면</button><span class="muted">8초마다 새로 고쳐요 · 학생 이름과 순위는 보이지 않아요</span></div><div id="bvHost"></div>`;
  $('.bvFull',app).onclick=()=>{const d=document.documentElement,f=d.requestFullscreen||d.webkitRequestFullscreen;if(f)f.call(d)};
  const host=$('#bvHost',app);host.innerHTML='<div class="card panel"><p class="muted" style="margin:0">불러오는 중…</p></div>';
  const fetcher=()=>API.call('hg_t_class_status',{p_token:tTok(),p_grade:g,p_klass:k}).catch(e=>{if(isAuthErr(e)){tSet(null);viewBossView(g,k)}else if(isMissingFn(e))host.innerHTML=`<div class="card panel">${gameSqlHelp()}</div>`;else toast(e.message);return null});
  (async()=>{const st=await fetcher();if(!st||!host.isConnected)return;renderBossPage(host,st,{teacher:true,big:true});
    const timer=setInterval(async()=>{if(!host.isConnected){clearInterval(timer);return}if(document.visibilityState!=='visible')return;const s2=await fetcher();if(s2&&host.isConnected)updateBossPage(host,s2,{teacher:true,big:true})},8000)})()}
const liveSqlHelp=()=>`<p style="margin:0">도움 요청과 학생 현황을 쓰려면 Supabase 대시보드의 <b>SQL Editor</b>에서 <code>supabase/live.sql</code> 내용을 붙여 넣고 한 번 실행해 주세요. (학생 기록은 지워지지 않아요)</p>`;
const gameSqlHelp=()=>`<p style="margin:0">보스전을 열려면 Supabase 대시보드의 <b>SQL Editor</b>에서 <code>supabase/game.sql</code> 내용을 붙여 넣고 한 번 실행해 주세요. 학생 기록은 그대로 남아요.</p>`;


/* ───────── 숫자야구: 쓸 수 있는 포인트를 걸고 친구와 대결 ───────── */
const BB_ICON=`<svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12" fill="#fff" stroke="#1d2640" stroke-width="2"/><path d="M7.5 5.2c3.2 4.2 3.2 13.4 0 17.6M20.5 5.2c-3.2 4.2-3.2 13.4 0 17.6" fill="none" stroke="#e05555" stroke-width="1.7" stroke-dasharray="2.2 1.8"/></svg>`;
const bbLedKey=()=>'hangeoreum-bbled:'+(AUTH?AUTH.sid:'');
const bbLedger=()=>isStudent()?(Number(lsGet(bbLedKey(),0))||0):0;
function setBBLedger(v){if(isStudent()&&Number.isFinite(+v))lsSet(bbLedKey(),+v)}
async function refreshLedger(){if(!isStudent()||GAME.off)return null;try{const L=await API.call('hg_bb_lobby',{p_token:AUTH.token});setBBLedger(L.ledger);return L}catch(e){if(isAuthErr(e))authExpired();return null}}
function bbAll(d){const out=[],rec=s=>{if(s.length===d){out.push(s);return}for(let k=1;k<=9;k++){const c=String(k);if(!s.includes(c))rec(s+c)}};rec('');return out}
function bbScore(sec,g){let s=0,b=0;for(let i=0;i<g.length;i++){if(sec[i]===g[i])s++;else if(sec.includes(g[i]))b++}return{s,b}}
function bbBotGuess(d,clues,useLast){const done=new Set(clues.map(q=>q.guess)),use=clues.filter(q=>q.guess).slice(-useLast);
  let C=bbAll(d).filter(c=>!done.has(c)&&use.every(q=>{const r=bbScore(c,q.guess);return r.s===q.s&&r.b===q.b}));if(!C.length)C=bbAll(d).filter(c=>!done.has(c));return C[Math.floor(Math.random()*C.length)]}
const bbSpaced=v=>String(v||'').split('').join(' ');
const bbWho=(p,me)=>!p?'상대':(me&&p.grade===me.grade&&p.klass===me.klass?`${p.num}번`:`${p.grade}학년 ${p.klass}반 ${p.num}번`);
function sbHTML(s,b){if(!s&&!b)return'<span class="sb out">아웃</span>';return`<span class="sb">${'<i class="s"></i>'.repeat(s)}${'<i class="b"></i>'.repeat(b)}<b>${s?s+'S':''}${s&&b?' ':''}${b?b+'B':''}</b></span>`}
/* 숫자 누르개: 비밀 숫자·추리(1~9, 서로 다르게)와 방 번호(0~9) */
function digitPad({len,distinct=false,zero=true,btn='확인',auto=false,onSubmit}){
  const keys=[1,2,3,4,5,6,7,8,9].map(k=>`<button type="button" data-k="${k}">${k}</button>`).join('')+`<button type="button" data-k="⌫" aria-label="지우기">⌫</button>`+(zero?'<button type="button" data-k="0">0</button>':'<span></span>')+(auto?'<span></span>':`<button type="button" class="dgo" data-k="go">${btn}</button>`);
  const w=el(`<div class="dpad"><div class="dslots">${'<span class="dslot"></span>'.repeat(len)}</div><div class="dkeys">${keys}</div></div>`);
  let v='',lock=false;
  const draw=()=>{$$('.dslot',w).forEach((d,i)=>{d.textContent=v[i]||'';d.classList.toggle('on',i<v.length)});
    $$('.dkeys button',w).forEach(b=>{const k=b.dataset.k;if(k==='go')b.disabled=lock||v.length!==len;else if(k==='⌫')b.disabled=lock||!v.length;else b.disabled=lock||v.length>=len||(distinct&&v.includes(k))})};
  const submit=()=>{if(lock||v.length!==len)return;lock=true;draw();const val=v;onSubmit(val,ok=>{lock=false;if(ok!==false)v='';draw()})};
  const press=k=>{if(lock)return;if(k==='go')return submit();if(k==='⌫')v=v.slice(0,-1);else if(v.length<len&&!(distinct&&v.includes(k))&&(zero||k!=='0'))v+=k;draw();if(auto&&v.length===len)setTimeout(submit,120)};
  $$('.dkeys button',w).forEach(b=>b.onclick=()=>press(b.dataset.k));w._press=press;w._lock=on=>{lock=on;draw()};draw();return w}
function bbKeys(pad){pinKeyHandler=e=>{if(!pad.isConnected||e.target.closest('input,select,textarea'))return;if(/^[0-9]$/.test(e.key))pad._press(e.key);else if(e.key==='Backspace'){e.preventDefault();pad._press('⌫')}else if(e.key==='Enter')pad._press('go')}}
const BB_RULES=`<ul class="bb-rule">
  <li>1~9 중 <b>서로 다른 숫자 3개</b>(어려움은 4개)로 내 비밀 숫자를 정해요.</li>
  <li>번갈아 가며 상대의 숫자를 추리해요. 숫자와 자리가 모두 맞으면 <b>스트라이크(S)</b>, 숫자는 있지만 자리가 다르면 <b>볼(B)</b>, 하나도 없으면 <b>아웃</b>이에요.<br><span class="muted">예) 상대 숫자가 3 7 1일 때 3 1 5를 부르면 1S 1B</span></li>
  <li>방장이 먼저 불러요. 방장이 맞혀도 상대에게 같은 횟수만큼 기회가 있어서, 둘 다 맞히면 비겨요.</li>
  <li>한 번에 90초 안에 불러야 해요. 두 번 연속 시간을 넘기면 져요.</li>
  <li>이기면 건 포인트의 2배를 받고, 지면 건 포인트를 잃어요. 비기면 돌려받아요. <b>모은 포인트 기록과 보스 데미지는 바뀌지 않아요.</b></li>
  <li>하루 10판까지 할 수 있어요.</li></ul>`;
const bbOffHTML=()=>`<div class="card panel"><p style="margin:0">친구와 대결은 선생님이 서버에 게임 설정을 추가하면 열려요. 그동안 컴퓨터와 연습할 수 있어요.</p></div>`;
const bbPracticeHTML=()=>`<div class="card panel"><h2>컴퓨터와 연습</h2><p class="muted" style="margin-top:0">포인트 없이 혼자 연습해요. 인터넷이 없어도 돼요.</p><div class="next-row" style="justify-content:flex-start;margin:0"><a class="btn" href="#bb-cpu-easy">쉬움</a><a class="btn" href="#bb-cpu-hard">어려움</a><a class="btn ghost" href="#bb-cpu-easy4">4자리 쉬움</a></div></div>`;
let bbLobbyT=null;
function viewBaseball(){
  crumbs.innerHTML=`<span class="sep">›</span><span>숫자야구</span>`;
  app.innerHTML=`<div class="unit-head"><div><h1>숫자야구</h1><p>상대의 비밀 숫자를 먼저 맞히면 이겨요. 친구와 <b>쓸 수 있는 포인트</b>를 걸고 대결해요.</p></div></div>
   <details class="card panel bb-rules"><summary><b>규칙 보기</b></summary>${BB_RULES}</details><div id="bbLobby"></div>`;
  const host=$('#bbLobby',app);
  if(!isStudent()){host.innerHTML=`<div class="card panel"><p style="margin-top:0">친구와 대결하려면 로그인해 주세요.</p><a class="btn primary" href="#login">로그인하기</a></div>`+bbPracticeHTML();return}
  if(GAME.off){host.innerHTML=bbOffHTML()+bbPracticeHTML();return}
  host.innerHTML='<div class="card panel"><p class="muted" style="margin:0">불러오는 중…</p></div>';
  let stake=null,digits=3;
  const load=async()=>{try{const L=await API.call('hg_bb_lobby',{p_token:AUTH.token});if(!host.isConnected)return;setBBLedger(L.ledger);render(L)}
    catch(e){if(!host.isConnected)return;if(isMissingFn(e)){GAME.off=true;host.innerHTML=bbOffHTML()+bbPracticeHTML()}else if(isAuthErr(e))authExpired();else host.innerHTML=`<div class="card panel"><p style="margin:0">${esc(e.message)}</p></div>`}};
  function render(L){const stakes=[0,5,10,20,50].filter(v=>v<=NUM(L.max));if(stake==null||!stakes.includes(stake)||stake>NUM(L.available))stake=0;
    const rec=L.record||{},R=Array.isArray(L.recent)?L.recent:[],O=Array.isArray(L.open)?L.open:[],me={grade:L.grade,klass:L.klass};
    const left=Math.max(0,NUM(L.limit)-NUM(L.today));
    host.innerHTML=`${L.mine?`<div class="card panel bb-mine"><b>진행 중인 경기</b> · 방 ${esc(L.mine.code)} · ${({waiting:'친구를 기다리는 중',setup:'비밀 숫자 정하는 중',playing:'경기 중'})[L.mine.status]||''} <a class="btn primary" href="#bb-${NUM(L.mine.id)}">돌아가기</a></div>`:''}
     <div class="card panel bb-wallet"><div class="stat"><small>쓸 수 있는 포인트</small><b class="rm">${Math.max(0,Number(L.available)||0)}</b></div><div class="stat"><small>오늘 남은 경기</small><b>${left}판</b></div><div class="stat"><small>내 전적</small><b>${NUM(rec.w)}승 ${NUM(rec.l)}패 ${NUM(rec.d)}무</b></div></div>
     ${!L.on?`<div class="card panel"><p style="margin:0"><b>선생님이 지금은 숫자야구를 꺼 두었어요.</b> 나중에 다시 와 주세요.</p></div>`:`
     <div class="bb-grid">
      <div class="card panel"><h2>방 만들기</h2><div class="cap">판돈 <span class="muted" style="font-weight:400">(포인트)</span></div><div class="seg bbStake">${stakes.map(v=>`<button type="button" data-v="${v}" class="${v===stake?'on':''}" ${v>Number(L.available)?'disabled':''}>${v?v:'친선'}</button>`).join('')}</div>
        <div class="cap" style="margin-top:12px">숫자 개수</div><div class="seg bbDig"><button type="button" data-v="3" class="${digits===3?'on':''}">3자리 · 쉬움</button><button type="button" data-v="4" class="${digits===4?'on':''}">4자리 · 어려움</button></div>
        <p style="margin:14px 0 0"><button type="button" class="btn primary bbMake" ${left?'':'disabled'}>방 만들기</button></p><div class="flmsg bbMakeMsg" role="status"></div></div>
      <div class="card panel"><h2>방 번호로 들어가기</h2><p class="muted" style="margin-top:0">친구가 알려 준 방 번호 4자리를 누르세요.</p><div class="bbCodePad"></div><div class="flmsg bbJoinMsg" role="status"></div></div>
     </div>
     <div class="card panel"><h2>우리 반 열린 방</h2>${O.length?`<ul class="bb-open">${O.map(o=>`<li><span><b>${NUM(o.num)}번</b>의 방 · ${NUM(o.stake)?`판돈 <b class="rm">${NUM(o.stake)}</b>`:'친선'} · ${NUM(o.digits)}자리</span><button type="button" class="btn bbJoin" data-code="${esc(o.code)}" ${NUM(o.stake)>Number(L.available)||!left?'disabled':''}>들어가기</button></li>`).join('')}</ul>`:'<p class="muted" style="margin:0">지금 열린 방이 없어요. 방을 만들어 친구에게 번호를 알려 주세요.</p>'}</div>`}
     ${R.length?`<div class="card panel"><h2>최근 경기</h2><ul class="bb-recent">${R.map(g=>{const res=g.winner==='draw'?'무':g.winner===g.me?'승':'패';return`<li><span class="bb-res ${res==='승'?'w':res==='패'?'l':'d'}">${res}</span><span>${josa(bbWho(g.opp,me),'과','와')} ${NUM(g.digits)}자리${NUM(g.stake)?` · 판돈 ${NUM(g.stake)}`:' · 친선'}</span><span class="rm ${Number(g.delta)>0?'up':Number(g.delta)<0?'down':''}">${Number(g.delta)>0?'+':''}${Number(g.delta)||0}</span></li>`}).join('')}</ul></div>`:''}
     ${L.on?bbPracticeHTML():''}`;
    if(!L.on)return;
    $$('.bbStake button',host).forEach(b=>b.onclick=()=>{stake=+b.dataset.v;$$('.bbStake button',host).forEach(x=>x.classList.toggle('on',x===b))});
    $$('.bbDig button',host).forEach(b=>b.onclick=()=>{digits=+b.dataset.v;$$('.bbDig button',host).forEach(x=>x.classList.toggle('on',x===b))});
    $('.bbMake',host).onclick=async e=>{const m=$('.bbMakeMsg',host);e.currentTarget.disabled=true;m.textContent='방을 만드는 중…';
      try{await settleSync();const r=await API.call('hg_bb_create',{p_token:AUTH.token,p_stake:stake,p_digits:digits});if(r&&r.ok)location.hash='#bb-'+r.game;else{m.textContent=(r&&r.msg)||'방을 만들지 못했어요.';if(r&&r.game)m.innerHTML+=` <a href="#bb-${NUM(r.game)}">경기로 가기</a>`;e.target.disabled=false}}
      catch(er){m.textContent=er.message;e.target.disabled=false}};
    const join=async(code,reset)=>{const m=$('.bbJoinMsg',host);m.textContent='들어가는 중…';
      try{await settleSync();const r=await API.call('hg_bb_join',{p_token:AUTH.token,p_code:code});if(r&&r.ok){location.hash='#bb-'+r.game;return}
        m.textContent=(r&&r.msg)||'들어가지 못했어요.';if(r&&r.game)m.innerHTML+=` <a href="#bb-${NUM(r.game)}">경기로 가기</a>`;if(reset)reset()}catch(er){m.textContent=er.message;if(reset)reset()}};
    const pad=digitPad({len:4,zero:true,auto:true,onSubmit:(v,reset)=>join(v,reset)});$('.bbCodePad',host).appendChild(pad);bbKeys(pad);
    $$('.bbJoin',host).forEach(b=>b.onclick=()=>{b.disabled=true;join(b.dataset.code,()=>{b.disabled=false})})}
  load();clearInterval(bbLobbyT);bbLobbyT=setInterval(()=>{if(!host.isConnected){clearInterval(bbLobbyT);return}if(document.visibilityState!=='visible')return;
    if(host.contains(document.activeElement)&&document.activeElement.closest('.dpad'))return;const s=$('.dslot.on',host);if(s)return;load()},9000)}

/* 경기 화면 */
const BB={id:null,timer:null,tick:null,st:null,busy:false,deadline:0,shown:null,cpu:null,memo:{}};
function bbStop(){clearInterval(BB.timer);clearInterval(BB.tick);BB.timer=BB.tick=null}
function viewBBGame(id){crumbs.innerHTML=`<span class="sep">›</span><a href="#baseball">숫자야구</a><span class="sep">›</span><span>경기</span>`;
  bbStop();BB.id=id;BB.cpu=null;BB.st=null;BB.shown=null;BB.memo=OBJ(lsGet('hangeoreum-bbmemo:'+id,{}));
  if(!isStudent()){location.hash='#baseball';return}
  app.innerHTML='<div id="bbHost"><div class="card panel"><p class="muted" style="margin:0">불러오는 중…</p></div></div>';
  BB.act={secret:v=>API.call('hg_bb_secret',{p_token:AUTH.token,p_game:id,p_secret:v}),guess:v=>API.call('hg_bb_guess',{p_token:AUTH.token,p_game:id,p_guess:v}),leave:()=>API.call('hg_bb_leave',{p_token:AUTH.token,p_game:id})};
  let n=0;bbPoll();BB.timer=setInterval(()=>{n++;if(!$('#bbHost')){bbStop();return}if(document.visibilityState!=='visible')return;const st=BB.st;if(st&&st.my_turn&&n%3)return;bbPoll()},1500)}
async function bbPoll(){if(BB.busy||BB.cpu)return;BB.busy=true;const id=BB.id;
  try{const st=await API.call('hg_bb_state',{p_token:AUTH.token,p_game:id});if(BB.id!==id||!$('#bbHost'))return;setBBLedger(st.ledger);renderBB(st)}
  catch(e){if(isMissingFn(e)){GAME.off=true;location.hash='#baseball'}else if(isAuthErr(e))authExpired();else if(/찾을 수 없어요/.test(e.message)){bbStop();const h=$('#bbHost');if(h)h.innerHTML=`<div class="card panel"><p>경기를 찾을 수 없어요.</p><a class="btn" href="#baseball">숫자야구 처음으로</a></div>`}}
  finally{BB.busy=false}}
const BB_REASON={expired:'15분 동안 아무도 들어오지 않아 방이 닫혔어요.',setup_timeout:'3분 안에 비밀 숫자를 정하지 않아 경기가 취소됐어요.',replaced:'새 경기를 시작해서 이 방은 닫혔어요.',points:'포인트가 모자란 사람이 있어서 경기가 취소됐어요.',left:'방이 닫혔어요.'};
function bbLogHTML(st,who){const L=(st.guesses||[]).filter(g=>g.who===who);if(!L.length)return'<li class="empty muted">아직 없어요</li>';
  return L.map(g=>`<li><span class="rn">${NUM(g.rnd)}</span><span class="gs rm">${g.guess?bbSpaced(g.guess):'<span class="muted">시간 초과</span>'}</span>${g.guess?sbHTML(NUM(g.s),NUM(g.b)):''}</li>`).join('')}
function bbHead(st){const meP=st.me==='host'?st.host:st.guest,opP=st.me==='host'?st.guest:st.host;
  return`<div class="bb-top"><div class="bb-p"><span class="bb-av">${avatarThumb(myEq(),54)}</span><span><b>나</b><small>${st.cpu?'':esc(bbWho(meP,meP))}</small></span></div>
   <div class="bb-vs"><b>VS</b><small>${st.cpu?'연습 · 포인트 없음':NUM(st.stake)?`판돈 ${NUM(st.stake)}포인트`:'친선 경기'} · ${NUM(st.digits)}자리</small></div>
   <div class="bb-p opp"><span><b>${st.cpu?'컴퓨터':esc(bbWho(opP,meP))}</b><small>${st.cpu?(st.cpu==='hard'?'어려움':'쉬움'):'상대'}</small></span><span class="bb-av">${st.cpu?bossSVG(BOSSES[0],54,0.5):BB_ICON}</span></div></div>`}
function renderBB(st){const host=$('#bbHost');if(!host)return;const prev=BB.st;BB.st=st;const key=st.status+'|'+(st.status==='setup'?(st.my_secret?'set':'unset'):'');
  if(key!==BB.shown){BB.shown=key;bbFull(host,st,prev)}else bbUpdate(host,st,prev)}
function bbFull(host,st,prev){pinKeyHandler=null;clearInterval(BB.tick);
  const leaveBtn=t=>`<button type="button" class="btn ghost bbLeave">${t}</button>`;
  if(st.status==='waiting'){host.innerHTML=`<div class="card panel bb-wait"><div class="muted">방 번호</div><div class="bb-code rm">${bbSpaced(st.code)}</div>
    <p>친구에게 방 번호를 알려 주세요. 친구가 「방 번호로 들어가기」에서 이 번호를 누르면 시작해요.</p><p class="muted">${NUM(st.stake)?`판돈 ${NUM(st.stake)}포인트`:'친선 경기'} · ${NUM(st.digits)}자리 · 15분 동안 아무도 안 들어오면 방이 닫혀요</p>${leaveBtn('방 닫기')}</div>`;bbWireLeave(host,false);return}
  if(st.status==='setup'){host.innerHTML=`<div class="card panel">${bbHead(st)}<h2 style="margin-top:14px">내 비밀 숫자 정하기</h2>
    <p style="margin-top:0">1~9 중 <b>서로 다른 숫자 ${NUM(st.digits)}개</b>를 골라요. 상대가 이 숫자를 맞히려고 해요. 경기가 끝날 때까지 상대에게 보이지 않아요.</p>
    ${st.my_secret?`<div class="bb-secret">내 숫자 <b class="rm">${bbSpaced(st.my_secret)}</b> ${CHECK}</div><p class="muted bbOppReady">${st.opp_ready?'상대도 정했어요. 곧 시작해요!':'상대가 숫자를 정하는 중이에요…'}</p>`:'<div class="bbSecretPad"></div><div class="flmsg bbSecMsg" role="status"></div>'}
    <p style="margin-bottom:0">${leaveBtn('나가기')}</p></div>`;
    if(!st.my_secret){const pad=digitPad({len:NUM(st.digits),distinct:true,zero:false,btn:'이 숫자로 정하기',onSubmit:async(v,done)=>{const m=$('.bbSecMsg',host);try{const r=await BB.act.secret(v);if(r&&r.ok===false){m.textContent=r.msg;done(false);return}done();if(BB.cpu)renderBB(BB.cpu.state());else bbPoll()}catch(e){m.textContent=e.message;done(false)}}});$('.bbSecretPad',host).appendChild(pad);bbKeys(pad)}
    bbWireLeave(host,false);return}
  if(st.status==='playing'){const memo=[1,2,3,4,5,6,7,8,9].map(k=>`<button type="button" data-k="${k}" class="m${BB.memo[k]||0}">${k}</button>`).join('');
    host.innerHTML=`<div class="card panel bb-board">${bbHead(st)}<div class="bb-turn" aria-live="polite"></div>
     <div class="bb-cols"><div class="bb-col"><h3>내 추리 <small>상대 숫자 맞히기</small></h3><ol class="bb-log mineLog"></ol></div>
      <div class="bb-col"><h3>상대의 추리 <small>내 숫자 <b class="rm">${bbSpaced(st.my_secret)}</b></small></h3><ol class="bb-log oppLog"></ol></div></div>
     <div class="bb-play"><div class="bb-in"><div class="bbGuessPad"></div><div class="flmsg bbGMsg" role="status"></div></div>
      <div class="bb-memo"><b>추론 메모</b><small>눌러서 표시: ○ 있다 → ✕ 없다 → 빈칸</small><div class="memo-keys">${memo}</div><button type="button" class="t-mini memoClear">메모 지우기</button></div></div>
     <p style="margin:12px 0 0">${leaveBtn(st.cpu?'연습 그만하기':'기권하기')}</p></div>`;
    const pad=digitPad({len:NUM(st.digits),distinct:true,zero:false,btn:'부르기',onSubmit:async(v,done)=>{const m=$('.bbGMsg',host);m.textContent='';
      try{const r=await BB.act.guess(v);if(r&&r.ok===false){m.textContent=r.msg;done(false);return}done();if(r&&NUM(r.s)===NUM(st.digits))celebrate('');if(BB.cpu)renderBB(BB.cpu.state());else bbPoll()}catch(e){m.textContent=e.message;done(false)}}});
    BB.pad=pad;$('.bbGuessPad',host).appendChild(pad);bbKeys(pad);
    $$('.memo-keys button',host).forEach(b=>b.onclick=()=>{const k=b.dataset.k,v=((BB.memo[k]||0)+1)%3;BB.memo[k]=v;b.className='m'+v;if(!BB.cpu)lsSet('hangeoreum-bbmemo:'+BB.id,BB.memo)});
    $('.memoClear',host).onclick=()=>{BB.memo={};$$('.memo-keys button',host).forEach(b=>b.className='m0');if(!BB.cpu)lsSet('hangeoreum-bbmemo:'+BB.id,{})};
    bbWireLeave(host,true);BB.tick=setInterval(()=>bbTimer(host),1000);bbUpdate(host,st,null);return}
  bbStop();pinKeyHandler=null;
  if(st.status==='done'){const win=st.winner===st.me,draw=st.winner==='draw',d=Number(st.delta)||0,n=(st.guesses||[]).filter(g=>g.who===st.me&&g.guess).length;
    const why={solved:win?`${n}번 만에 상대 숫자를 맞혔어요.`:draw?'둘 다 같은 횟수에 맞혔어요.':'상대가 먼저 맞혔어요.',timeout:win?'상대가 두 번 연속 시간을 넘겼어요.':'두 번 연속 시간을 넘겨서 졌어요.',forfeit:win?'상대가 기권했어요.':'기권했어요.',rounds:'15번 안에 아무도 맞히지 못해서 비겼어요.'}[st.reason]||'';
    host.innerHTML=`<div class="card panel bb-done ${win?'win':draw?'draw':'lose'}">${bbHead(st)}<h2>${win?'이겼어요!':draw?'비겼어요':'아쉽게 졌어요'}</h2><p style="margin:0">${why}</p>
     ${!st.cpu&&NUM(st.stake)?`<p class="bb-delta rm">${d>0?'+':''}${d} 포인트</p>`:''}
     <div class="bb-reveal">상대 숫자 <b class="rm">${bbSpaced(st.opp_secret)}</b> · 내 숫자 <b class="rm">${bbSpaced(st.my_secret)}</b></div>
     <div class="bb-cols"><div class="bb-col"><h3>내 추리</h3><ol class="bb-log">${bbLogHTML(st,st.me)}</ol></div><div class="bb-col"><h3>상대의 추리</h3><ol class="bb-log">${bbLogHTML(st,st.me==='host'?'guest':'host')}</ol></div></div>
     <div class="next-row" style="justify-content:flex-start">${st.cpu?`<a class="btn primary" href="#bb-cpu-${esc(st.cpuKey)}" onclick="setTimeout(()=>route(),0)">한 판 더</a>`:''}<a class="btn ${st.cpu?'':'primary'}" href="#baseball">숫자야구 처음으로</a></div></div>`;
    if(win&&prev&&prev.status==='playing')celebrate(st.cpu?'':NUM(st.stake)?`이겼어요! +${d} 포인트`:'이겼어요!');updatePill();return}
  host.innerHTML=`<div class="card panel"><h2>경기가 취소됐어요</h2><p>${BB_REASON[st.reason]||'방이 닫혔어요.'}</p><a class="btn primary" href="#baseball">숫자야구 처음으로</a></div>`}
function bbWireLeave(host,playing){const b=$('.bbLeave',host);if(!b)return;b.onclick=()=>{
  if(playing&&!BB.cpu){const p=b.parentElement,keep=p.innerHTML;p.innerHTML=`<span class="t-confirm" style="font-size:15px">${NUM(BB.st&&BB.st.stake)?'기권하면 건 포인트를 잃어요. ':''}기권할까요? <button type="button" class="btn bbYes">기권하기</button> <button type="button" class="btn ghost bbNo">계속하기</button></span>`;
    $('.bbYes',p).onclick=async()=>{try{await BB.act.leave()}catch(e){}bbPoll()};$('.bbNo',p).onclick=()=>{p.innerHTML=keep;bbWireLeave(host,true)};return}
  (async()=>{try{await BB.act.leave()}catch(e){}bbStop();location.hash='#baseball'})()}}
function bbTimer(host){const t=$('.bb-timer',host);if(!t)return;const s=Math.max(0,Math.ceil((BB.deadline-Date.now())/1000));t.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;t.classList.toggle('low',s<=15)}
function bbUpdate(host,st,prev){if(st.status!=='playing')return;
  const ml=$('.mineLog',host),ol=$('.oppLog',host),opp=st.me==='host'?'guest':'host';
  if(ml)ml.innerHTML=bbLogHTML(st,st.me);if(ol)ol.innerHTML=bbLogHTML(st,opp);
  if(prev&&(prev.guesses||[]).length<(st.guesses||[]).length){const last=st.guesses[st.guesses.length-1];if(last.who===opp&&last.guess){const li=ol&&ol.lastElementChild;if(li){li.classList.add('flash')}}}
  BB.deadline=Date.now()+(NUM(st.turn_left)||0)*1000;
  const tb=$('.bb-turn',host);if(tb){tb.className='bb-turn '+(st.paused?'paused':st.my_turn?'mine':'theirs');
    tb.innerHTML=st.paused?'선생님이 잠시 멈췄어요. 기다려 주세요.':st.my_turn?`내 차례예요! ${st.cpu?'':'<span class="bb-timer"></span>'}`:`${st.cpu?'컴퓨터':'상대'}가 생각 중… ${st.cpu?'':'<span class="bb-timer"></span>'}`;bbTimer(host)}
  if(BB.pad)BB.pad._lock(!st.my_turn||!!st.paused)}

/* 컴퓨터와 연습 (서버 없이 이 기기에서만) */
function viewBBCpu(key){crumbs.innerHTML=`<span class="sep">›</span><a href="#baseball">숫자야구</a><span class="sep">›</span><span>컴퓨터와 연습</span>`;
  bbStop();const level=/hard/.test(key)?'hard':'easy',digits=/4/.test(key)?4:3;
  const S={status:'setup',me:'host',cpu:level,cpuKey:key,digits,stake:0,round:1,turn:null,my_secret:null,opp_secret:null,guesses:[],winner:null,reason:null,host:null,guest:null,paused:false,delta:0,opp_ready:true,hostSolved:null,bot:bbAll(digits)[Math.floor(Math.random()*bbAll(digits).length)]};
  const state=()=>Object.assign({},S,{my_turn:S.status==='playing'&&S.turn==='host',opp_secret:S.status==='done'?S.bot:null,guesses:S.guesses.slice(),turn_left:0});
  const finish=w=>{S.status='done';S.winner=w;S.reason='solved';S.turn=null};
  const step=(who,solved)=>{if(who==='host'){if(solved)S.hostSolved=S.round;S.turn='guest';setTimeout(botMove,900+Math.random()*700)}
    else if(solved)finish(S.hostSolved===S.round?'draw':'guest');else if(S.hostSolved===S.round)finish('host');else if(S.round>=15){S.status='done';S.winner='draw';S.reason='rounds'}else{S.round++;S.turn='host'}};
  const botMove=()=>{if(S.status!=='playing'||S.turn!=='guest'||BB.cpu!==C)return;const mine=S.guesses.filter(g=>g.who==='guest');
    const g=level==='hard'?bbBotGuess(digits,mine,99):(Math.random()<0.25?bbBotGuess(digits,mine,0):bbBotGuess(digits,mine,1));const r=bbScore(S.my_secret,g);
    S.guesses.push({who:'guest',rnd:S.round,guess:g,s:r.s,b:r.b});step('guest',r.s===digits);if($('#bbHost'))renderBB(state())};
  const C={state,act:{secret:async v=>{if(!/^[1-9]+$/.test(v)||new Set(v).size!==digits||v.length!==digits)return{ok:false,msg:`1~9 중 서로 다른 숫자 ${digits}개로 정해 주세요.`};S.my_secret=v;S.status='playing';S.turn='host';return{ok:true}},
    guess:async v=>{if(S.status!=='playing'||S.turn!=='host')return{ok:false,msg:'컴퓨터 차례예요.'};const r=bbScore(S.bot,v);S.guesses.push({who:'host',rnd:S.round,guess:v,s:r.s,b:r.b});step('host',r.s===digits);return{ok:true,s:r.s,b:r.b}},
    leave:async()=>({ok:true})}};
  BB.cpu=C;BB.act=C.act;BB.st=null;BB.shown=null;BB.memo={};
  app.innerHTML='<div id="bbHost"></div>';renderBB(state())}


