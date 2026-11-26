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
const GACHA_COST=400,GACHA_MAX_DAY=2;
const SHOP=[
 {cat:'mini',nm:'3D 캐릭터',items:[
   {id:'fa',nm:'민지',f:'character-female-a',r:'common',p:0},
   {id:'ma',nm:'준호',f:'character-male-a',r:'common',p:0},
   {id:'fb',nm:'서연',f:'character-female-b',r:'common',p:500},
   {id:'mb',nm:'도윤',f:'character-male-b',r:'common',p:500},
   {id:'fc',nm:'하은',f:'character-female-c',r:'common',p:500},
   {id:'mc',nm:'시우',f:'character-male-c',r:'common',p:500},
   {id:'fd',nm:'지우',f:'character-female-d',r:'rare',p:800},
   {id:'md',nm:'예준',f:'character-male-d',r:'rare',p:800},
   {id:'fe',nm:'수아',f:'character-female-e',r:'rare',p:800},
   {id:'me',nm:'건우',f:'character-male-e',r:'rare',p:800},
   {id:'ff',nm:'별빛 소녀',f:'character-female-f',r:'legend',p:1400},
   {id:'mf',nm:'은하 소년',f:'character-male-f',r:'legend',p:1400}]},
 {cat:'frame',nm:'프로필 프레임',items:[
   {id:'none',nm:'기본',p:0,cls:'f-none'},
   {id:'sky',nm:'하늘 원',p:25,cls:'f-sky'},
   {id:'mint',nm:'민트 모눈',p:25,cls:'f-mint'},
   {id:'sakura',nm:'벚꽃 링',p:35,cls:'f-sakura'},
   {id:'night',nm:'밤하늘 별',p:55,cls:'f-night'},
   {id:'gold',nm:'반짝 골드',p:80,cls:'f-gold'},
   {id:'aura',nm:'무지개 오라',p:110,cls:'f-aura'},
   /* 보스 한정(bossOnly): 포인트로 못 사고, 보스 도전 보물상자에서만 나와요 */
   {id:'b-golem',nm:'골렘 강철 링',p:999,cls:'f-b-golem',bossOnly:'golem'},
   {id:'b-sphinx',nm:'스핑크스 황금 링',p:999,cls:'f-b-sphinx',bossOnly:'sphinx'},
   {id:'b-turtle',nm:'에메랄드 등껍질',p:999,cls:'f-b-turtle',bossOnly:'turtle'},
   {id:'b-witch',nm:'마녀의 마법진',p:999,cls:'f-b-witch',bossOnly:'witch'},
   {id:'b-drake',nm:'드래곤 불꽃 오라',p:999,cls:'f-b-drake',bossOnly:'drake'},
   {id:'b-king',nm:'대왕 로열 오라',p:999,cls:'f-b-king',bossOnly:'king'}]},
 {cat:'title',nm:'칭호',items:[
   {id:'none',nm:'칭호 없음',p:0},
   {id:'golem',nm:'골렘 분쇄자',p:999,bossOnly:'golem'},
   {id:'witch',nm:'마녀의 라이벌',p:999,bossOnly:'witch'},
   {id:'drake',nm:'드래곤 슬레이어',p:999,bossOnly:'drake'},
   {id:'king',nm:'이십면체 정복자',p:999,bossOnly:'king'}]},
 {cat:'hat',nm:'모자',items:[
   {id:'none',nm:'안 쓰기',p:0,ic:'🙂'},
   {id:'party',nm:'파티 고깔',p:300,ic:'🎉'},
   {id:'beanie',nm:'털모자',p:450,ic:'🧶'},
   {id:'cap',nm:'야구 모자',p:600,ic:'🧢'},
   {id:'grad',nm:'학사모',p:900,ic:'🎓'},
   {id:'wizard',nm:'마법사 모자',p:1200,ic:'🧙'},
   {id:'crown',nm:'왕관',p:1600,ic:'👑'}]},
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
  if(it.bossOnly){toast('보스 도전 보물상자에서만 얻을 수 있어요.');return false}
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
/* 3D 모자: 캐릭터 GLB를 받아 head 뼈 아래에 모자 메시를 붙인 새 GLB(blob)를 만들어요 · 애니메이션 때 머리와 같이 움직여요 */
const HAT_CACHE={};
function hatParts(id,r){const P=[],C={red:[.93,.3,.36],pink:[1,.5,.7],yel:[1,.83,.25],blue:[.25,.45,.85],navy:[.13,.17,.32],ink:[.12,.12,.16],pur:[.45,.3,.75],gold:[1,.78,.2],wht:[.97,.97,.97],grn:[.3,.75,.55]};
  const lathe=(prof,col,o={})=>P.push({k:'lathe',prof,col:C[col],...o}),box=(sz,at,col,o={})=>P.push({k:'box',sz,at,col:C[col],...o});
  const ball=(rr,y,col,x=0,z=0)=>lathe([...Array(9)].map((_,i)=>{const t=-Math.PI/2+Math.PI*i/8;return[rr*Math.cos(t),y+rr*Math.sin(t)]}),col,{x,z});
  const dome=(R,H,col,n=8)=>lathe([...Array(n+1)].map((_,i)=>{const t=Math.PI/2*i/n;return[R*Math.cos(t),H*Math.sin(t)]}),col);
  if(id==='party'){const R=r*.55;lathe([[R,0],[0.012,0.4]],'pink');lathe([[R*1.02,0],[R*1.02,0.02],[R*.92,0.06]],'yel');ball(0.045,0.41,'yel')}
  if(id==='beanie'){dome(r*1.02,r*.8,'red');lathe([[r*1.07,-0.01],[r*1.07,0.07],[r*1.03,0.075]],'wht');ball(0.06,r*.8+0.04,'wht')}
  if(id==='cap'){dome(r*1.12,r*.7,'blue');box([r*1.5,0.018,0.2],[0,0.01,r*0.95+0.07],'blue');ball(0.025,r*.7,'blue')}
  if(id==='grad'){lathe([[r*.98,0],[r*.98,0.11],[0,0.11]],'ink');box([r*2.3,0.025,r*2.3],[0,0.12,0],'ink',{ry:Math.PI/4});box([0.02,0.14,0.02],[r*1.05,0.06,0],'yel');ball(0.022,0.135,'yel')}
  if(id==='wizard'){lathe([[r*1.75,0],[r*1.75,0.018],[r*.96,0.018]],'pur');lathe([[r*.96,0.018],[r*.6,0.3],[r*.3,0.48],[0.012,0.62]],'pur',{tilt:-0.18});lathe([[r*.98,0.02],[r*.9,0.1]],'yel')}
  if(id==='crown'){const R=r*.72;lathe([[R,0],[R,0.11]],'gold',{metal:.5});for(let k=0;k<5;k++){const t=2*Math.PI*k/5;lathe([[0.055,0.1],[0,0.2]],'gold',{x:R*.92*Math.sin(t),z:R*.92*Math.cos(t),metal:.5});ball(0.022,0.21,'red',R*.92*Math.sin(t),R*.92*Math.cos(t))}}
  return P}
function hatGeom(pt){const pos=[],nor=[],idx=[];const seg=28,tl=pt.tilt||0,ry=pt.ry||0;
  const put=(x,y,z,nx,ny,nz)=>{if(tl)z+=tl*y*y*3;if(ry){const c=Math.cos(ry),s_=Math.sin(ry);[x,z]=[x*c+z*s_,-x*s_+z*c];[nx,nz]=[nx*c+nz*s_,-nx*s_+nz*c]}
    pos.push(x+(pt.x||0),y,z+(pt.z||0));nor.push(nx,ny,nz);return pos.length/3-1};
  if(pt.k==='lathe'){const pr=pt.prof;for(let i=0;i<pr.length-1;i++){const[r0,y0]=pr[i],[r1,y1]=pr[i+1];let nr=y1-y0,ny=-(r1-r0);const L=Math.hypot(nr,ny)||1;nr/=L;ny/=L;const base=pos.length/3;
      for(let j=0;j<=seg;j++){const t=2*Math.PI*j/seg,c=Math.cos(t),s_=Math.sin(t);put(r0*s_,y0,r0*c,nr*s_,ny,nr*c);put(r1*s_,y1,r1*c,nr*s_,ny,nr*c)}
      for(let j=0;j<seg;j++){const a=base+2*j;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}}
  else{const[w,h,d]=pt.sz.map(v=>v/2),[cx,cy,cz]=pt.at;const F=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,1,0],[0,0,-1]],[[0,1,0],[0,0,1],[1,0,0]],[[0,-1,0],[0,0,-1],[1,0,0]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[-1,0,0],[0,1,0]]];
    for(const[n,u,v]of F){const b0=pos.length/3;for(const[su,sv]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const q=k=>n[k]*[w,h,d][k]+u[k]*su*[w,h,d][k]+v[k]*sv*[w,h,d][k];put(cx+q(0),cy+q(1),cz+q(2),n[0],n[1],n[2])}idx.push(b0,b0+1,b0+2,b0,b0+2,b0+3)}}
  return{pos,nor,idx}}
async function hatGLB(file,hatId){const key=file+'|'+hatId;if(HAT_CACHE[key])return HAT_CACHE[key];
  const buf=await(await fetch(`${MINI_BASE}/glb/${file}.glb`)).arrayBuffer(),dv=new DataView(buf),jl=dv.getUint32(12,true);
  const J=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,20,jl))),binOff=20+jl+8,binLen=dv.getUint32(20+jl,true);
  (J.images||[]).forEach(im=>{if(im.uri&&!/^(data|blob|https?):/.test(im.uri))im.uri=new URL(`${MINI_BASE}/glb/${im.uri}`,location.href).href});
  const N=J.nodes,hi=N.findIndex(n=>n.name==='head'),hm=N.find(n=>n.name==='head-mesh');if(hi<0||!hm)throw new Error('no head');
  const pa=J.accessors[J.meshes[hm.mesh].primitives[0].attributes.POSITION];
  let hy=0,hz=0;const walk=(i,y,z)=>{const t=N[i].translation||[0,0,0];y+=t[1];z+=t[2];if(i===hi){hy=y;hz=z;return true}return(N[i].children||[]).some(c=>walk(c,y,z))};J.scenes[J.scene||0].nodes.forEach(i=>walk(i,0,0));
  const r=Math.min(pa.max[0],0.25)*1.06,top=pa.max[1]-hy,cz=(Math.max(pa.min[2],-0.2)+pa.max[2])/2-hz,sink=hatId==='crown'||hatId==='party'?0.03:0.13;
  const parts=hatParts(hatId,r),chunks=[];let off=binLen+((4-binLen%4)%4);const prims=[];
  const addView=(arr,T,target)=>{const b=new Uint8Array(new T(arr).buffer);const v={buffer:0,byteOffset:off,byteLength:b.length};if(target)v.target=target;chunks.push([off,b]);off+=b.length;off+=(4-off%4)%4;J.bufferViews.push(v);return J.bufferViews.length-1};
  for(const pt of parts){const g=hatGeom(pt),mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<g.pos.length;i++){const k=i%3;mn[k]=Math.min(mn[k],g.pos[i]);mx[k]=Math.max(mx[k],g.pos[i])}
    const ap=J.accessors.push({bufferView:addView(g.pos,Float32Array,34962),componentType:5126,count:g.pos.length/3,type:'VEC3',min:mn,max:mx})-1;
    const an=J.accessors.push({bufferView:addView(g.nor,Float32Array,34962),componentType:5126,count:g.nor.length/3,type:'VEC3'})-1;
    const ai=J.accessors.push({bufferView:addView(g.idx,Uint16Array,34963),componentType:5123,count:g.idx.length,type:'SCALAR'})-1;
    const mi=J.materials.push({name:'hat',doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[...pt.col,1],metallicFactor:pt.metal||0,roughnessFactor:pt.metal?0.35:0.8}})-1;
    prims.push({attributes:{POSITION:ap,NORMAL:an},indices:ai,material:mi})}
  const mesh=J.meshes.push({name:'hat',primitives:prims})-1,node=N.push({name:'hat',mesh,translation:[0,top-sink,cz]})-1;(N[hi].children=N[hi].children||[]).push(node);
  const bin=new Uint8Array(off);bin.set(new Uint8Array(buf,binOff,binLen),0);chunks.forEach(([o,b])=>bin.set(b,o));J.buffers[0].byteLength=off;
  let js=new TextEncoder().encode(JSON.stringify(J));const jp=(4-js.length%4)%4;if(jp){const t=new Uint8Array(js.length+jp).fill(32);t.set(js);js=t}
  const out=new Uint8Array(12+8+js.length+8+bin.length),o=new DataView(out.buffer);o.setUint32(0,0x46546C67,true);o.setUint32(4,2,true);o.setUint32(8,out.length,true);
  o.setUint32(12,js.length,true);o.setUint32(16,0x4E4F534A,true);out.set(js,20);o.setUint32(20+js.length,bin.length,true);o.setUint32(24+js.length,0x004E4942,true);out.set(bin,28+js.length);
  return HAT_CACHE[key]=URL.createObjectURL(new Blob([out],{type:'model/gltf-binary'}))}
function mountSpin(host,render,{speed=0.6}={}){
  if(host&&host.id==='avMe'){mountAvatar(host,()=>myEq(),160);return}
  let yaw=0.6,last=0;host.innerHTML=render(yaw);if(reduced)return;
  const tick=ts=>{if(!host.isConnected)return;if(ts-last>45){yaw+=Math.min(0.2,(ts-last)/1000*speed);last=ts;host.innerHTML=render(yaw)}requestAnimationFrame(tick)};
  requestAnimationFrame(ts=>{last=ts;requestAnimationFrame(tick)})}
function mountAvatar(host,getEq,size=210){let curKey='',token=0;
  function sync(){if(!host||!host.isConnected)return;const eq=getEq(),it=shopItem('mini',eq.mini),fr=shopItem('frame',eq.frame);
    const hat=eq.hat&&eq.hat!=='none'?eq.hat:'';const key=it.id+':'+fr.id+':'+hat+':'+eq.title;if(key===curKey)return;
    curKey=key;const myTok=++token;
    host.innerHTML=mini3DHTML(it,size,fr.cls)+titleChip(eq.title);const mv=$('model-viewer',host);
    if(mv)mv.addEventListener('error',()=>{if(token===myTok)host.innerHTML=avatarThumb(eq,size)});
    if(mv&&hat)hatGLB(it.f,hat).then(u=>{if(token===myTok&&mv.isConnected)mv.src=u}).catch(()=>{})}
  sync();return sync}

/* 캡슐 뽑기: 포인트 뽑기는 중복 없음 · 오늘의 계산 완료 시 무료 1회(무료는 이미 가진 캐릭터도 나올 수 있음) · 하루 최대 2회 */
function gachaInfo(){const S=shopState(),t=today(),pool=shopCat('mini').items.filter(it=>it.p>0&&!owns('mini',it.id));
  const used=S.gachaDay===t?NUM(S.gachaCnt):0,drillDone=NUM(dayState().c.drill)>0||OBJ(DB._drill).last===t;
  const free=drillDone&&S.freeGachaDay!==t&&pool.length>0&&used<GACHA_MAX_DAY;
  return{pool,used,left:Math.max(0,GACHA_MAX_DAY-used),free,tix:bonusLeft(),total:shopCat('mini').items.filter(it=>it.p>0).length}}
/* 보스 도전 보물상자에서 받은 것: 늘어나기만 하는 개수(Got/Used)로 저장해야 기기끼리 합칠 때(큰 값 우선) 되살아나지 않아요 */
const bonusLeft=()=>{const S=shopState();return Math.max(0,NUM(S.bonusGot)-NUM(S.bonusUsed))};
const shieldLeft=()=>{const S=shopState();return Math.max(0,NUM(S.shieldGot)-NUM(S.shieldUsed))};
function pullGacha(useTix){const g=gachaInfo();if(!g.pool.length)return{err:'all'};
  if(useTix){if(g.tix<=0)return{err:'tix'};const S=shopState();S.bonusUsed=NUM(S.bonusUsed)+1;const ws=g.pool.map(it=>RAR_W[it.r]||30);let roll=Math.random()*ws.reduce((a,b)=>a+b,0),won=g.pool[g.pool.length-1];
    for(let i=0;i<g.pool.length;i++){roll-=ws[i];if(roll<=0){won=g.pool[i];break}}S.own['mini:'+won.id]=1;save();return{won,free:true,dup:false,tix:true}}
  if(g.left<=0)return{err:'limit'};
  if(!g.free&&balance()<GACHA_COST)return{err:'pts',need:GACHA_COST-balance()};
  const S=shopState(),t=today();if(S.gachaDay!==t){S.gachaDay=t;S.gachaCnt=0}
  if(g.free)S.freeGachaDay=t;else S.spent+=GACHA_COST;
  S.gachaCnt=NUM(S.gachaCnt)+1;
  const pool=g.free?shopCat('mini').items.filter(it=>it.p>0):g.pool;
  const ws=pool.map(it=>RAR_W[it.r]||30);let roll=Math.random()*ws.reduce((a,b)=>a+b,0),won=pool[pool.length-1];
  for(let i=0;i<pool.length;i++){roll-=ws[i];if(roll<=0){won=pool[i];break}}
  const dup=owns('mini',won.id);S.own['mini:'+won.id]=1;save();return{won,free:g.free,dup}}

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
    box.innerHTML=`<div class="gacha-head"><h2>🎁 3D 미니 캐릭터 캡슐 뽑기</h2><button type="button" class="btn primary gachaGo" ${dis?'disabled':''}>${btnTxt}</button>${g.tix&&g.pool.length?`<button type="button" class="btn gachaTix" ${gachaBusy?'disabled':''}>🎟️ 보스 뽑기권 쓰기 (${g.tix}장)</button>`:''}</div>
      <p class="gacha-meta"><b>포인트 뽑기는 중복 없음!</b> 아직 없는 캐릭터만 나와요 · 무료 뽑기는 가진 캐릭터가 또 나올 수도 있어요 · 모은 캐릭터 <b class="rm">${got}/${g.total}</b> · 오늘 남은 횟수 <b class="rm">${g.left}/${GACHA_MAX_DAY}</b>${g.free?' · <b style="color:var(--ok)">오늘의 계산 완료 무료권 사용 가능!</b>':' · 오늘의 계산을 끝내면 하루 1회 무료!'}</p>
      ${resHTML?`<div class="gacha-stage">${resHTML}</div>`:''}`;
    const gb=$('.gachaGo',box),gt=$('.gachaTix',box);
    const go=useTix=>{if(gachaBusy)return;gachaBusy=true;drawGacha('<div class="gacha-cap" aria-hidden="true">💊</div><p class="muted" style="margin:6px 0 0">캡슐이 열리고 있어요…</p>');
      setTimeout(()=>{const r=pullGacha(useTix);gachaBusy=false;
        if(r.err){drawGacha(`<p class="muted">${r.err==='pts'?`포인트가 ${r.need}만큼 모자라요.`:r.err==='limit'?'오늘 뽑기 횟수를 다 썼어요. 내일 다시 뽑아요!':r.err==='tix'?'보스 뽑기권이 없어요.':'이미 모든 캐릭터를 모았어요!'}</p>`);return}
        const w=r.won;if(r.dup)toast(`앗, 이미 가진 ‘${w.nm}’가 나왔어요. 내일 또 도전해요!`);else celebrate(`${RAR_NM[w.r]} 캐릭터 ‘${w.nm}’를 얻었어요!`);
        drawGacha(`<div class="gacha-res"><span class="rar ${w.r}">${RAR_NM[w.r]}</span><h3 style="margin:4px 0 8px">${w.nm}${r.dup?' <small class="muted">(이미 있어요)</small>':''}</h3>${mini3DHTML(w,170,shopItem('frame',myEq().frame).cls)}<p style="margin:10px 0 0"><button type="button" class="btn primary gEquip">바로 장착하기</button></p></div>`);
        const ge=$('.gEquip',box);if(ge)ge.onclick=()=>{equipItem('mini',w.id);setPreview(null);toast(`${w.nm} 캐릭터로 바꿨어요!`);drawGacha('')};
        draw()},reduced?0:650)};
    if(gb)gb.onclick=()=>go(false);if(gt)gt.onclick=()=>go(true)}
  function setPreview(p){preview=p;themePreview=p&&p.cat==='hi'?shopItem('hi',p.id):null;applyTheme();syncAv();draw()}
  function draw(){$('#bal',app).textContent=balance();$$('.shopTabs button',app).forEach(b=>{const on=b.dataset.c===cat;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
    const C=shopCat(cat),E=myEq();
    $('#shopGrid',app).innerHTML=C.items.map(it=>{const own=owns(cat,it.id),on=E[cat]===it.id,sel=preview&&preview.cat===cat&&preview.id===it.id;
      const pic=cat==='hat'?`<span class="hat-ic">${it.ic}</span>`:cat==='hi'?`<span class="hi-sw"><span style="background:linear-gradient(transparent 52%,${it.c} 52%)">형광펜</span></span>`:cat==='frame'?`<span class="av-fr ${it.cls} fr-sw"></span>`:cat==='title'?`<span class="ti-chip">${it.id==='none'?'—':'🏅 '+it.nm}</span>`:miniThumbHTML(it,88);
      const badge=it.r?`<span class="rar ${it.r}">${RAR_NM[it.r]}</span>`:'';
      return`<button type="button" class="shop-item ${on?'on':''} ${sel?'sel':''}" data-id="${it.id}" aria-pressed="${!!sel}">${badge}<span class="pic">${pic}</span><b>${it.nm}</b><small>${on?'쓰는 중':own?'가지고 있음':it.bossOnly?'🔒 보스 상자 한정':it.p+' 포인트'}</small></button>`}).join('');
    $$('#shopGrid .shop-item',app).forEach(b=>b.onclick=()=>setPreview({cat,id:b.dataset.id}));act();if(!gachaBusy&&!$('.gacha-res',app))drawGacha()}
  function act(){const A=$('#shopAct',app);if(!preview){A.innerHTML='<span class="muted">아래에서 고르면 위 캐릭터에 먼저 입혀 볼 수 있어요.</span>';return}
    const it=shopItem(preview.cat,preview.id),own=owns(preview.cat,preview.id),on=myEq()[preview.cat]===preview.id;
    if(on){A.innerHTML=`<b>${it.nm}</b> <span class="muted">· 쓰는 중이에요</span>`;return}
    if(own){A.innerHTML=`<b>${it.nm}</b> <button type="button" class="btn primary">이걸로 바꾸기</button>`;$('button',A).onclick=()=>{equipItem(preview.cat,preview.id);setPreview(null);toast('바꿨어요!')};return}
    if(it.bossOnly){const b=BOSSES.find(x=>x.id===it.bossOnly);A.innerHTML=`<b>${it.nm}</b> <span class="muted">· 포인트로는 못 사요. <a href="#boss">보스 도전</a>에서 ${b?josa(b.nm,'을','를')+' 물리치고 ':''}보물상자를 열면 나올 수 있어요.</span>`;return}
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
/* 우리 반 보스전은 잠시 숨겨 둬요(나중에 보완해서 다시 열기: true로). 포인트 집계·교사 크게 띄우기는 그대로 동작 */
const CLASS_BOSS_ON=false;
function bossCardHTML(){if(CLASS_BOSS_ON)return bossCardBase()+raidStripHTML();const b=raidBoss();
  return`<div class="g-head"><b class="t">오늘의 보스 도전</b><span class="k">이번 주 보스</span></div><div class="boss-mini"><div class="bm-pic">${bossSVG(b,90,0.5)}</div><div class="bm-info"><b>${esc(b.nm)}</b><small>문제 폭탄을 풀어 터뜨리고 보물상자를 열어요</small></div></div>${raidStripHTML(true)}`}
function bossCardBase(){
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
function viewBoss(){crumbs.innerHTML=`<span class="sep">›</span><span>보스전</span>`;
  app.innerHTML=`<div class="unit-head"><div><h1>보스전</h1><p>보스가 던지는 문제 폭탄을 풀어서 터뜨려요. 빠르고 정확해야 이길 수 있어요!</p></div></div><div id="raidHost"></div>${CLASS_BOSS_ON?'<h2 class="raid-sub">우리 반 보스전</h2><div id="bossHost"></div>':''}`;
  raidLobby($('#raidHost',app));if(!CLASS_BOSS_ON)return;
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
/* [T09] 선생님 숫자야구 앱과 같은 4단계. 하·중은 자리별 힌트(○△×), 중상·상은 진짜 야구처럼 S·B 개수만. 하는 판돈 최대 10포인트 */
const BB_LV={easy:{k:'easy',nm:'하',len:2,min:1,max:6,oxa:true,d:'1~6 · 2자리 · ○△× 힌트',cap:10},
  mid:{k:'mid',nm:'중',len:3,min:1,max:9,oxa:true,d:'1~9 · 3자리 · ○△× 힌트'},
  mh:{k:'mh',nm:'중상',len:3,min:1,max:6,oxa:false,d:'1~6 · 3자리 · S/B'},
  hard:{k:'hard',nm:'상',len:3,min:0,max:9,oxa:false,d:'0~9 · 3자리 · S/B'}};
const BB_EASY_MAX=10;
/* 경기 정보로 단계 찾기: lv가 없으면 예전 방식(1~9, 3·4자리, S/B) */
const bbLv=st=>(st&&BB_LV[st.lv])||{k:'',nm:`${NUM(st&&st.digits)||3}자리`,len:NUM(st&&st.digits)||3,min:1,max:9,oxa:false,d:''};
const bbRange=lv=>{const a=[];for(let k=lv.min;k<=lv.max;k++)a.push(k);return a};
function bbAll(lv){if(typeof lv==='number')lv={len:lv,min:1,max:9};const out=[],R=bbRange(lv).map(String),rec=s=>{if(s.length===lv.len){out.push(s);return}for(const c of R)if(!s.includes(c))rec(s+c)};rec('');return out}
function bbScore(sec,g){let s=0,b=0;for(let i=0;i<g.length;i++){if(sec[i]===g[i])s++;else if(sec.includes(g[i]))b++}return{s,b}}
const bbHint=(sec,g)=>g.split('').map((c,i)=>sec[i]===c?'O':sec.includes(c)?'A':'X').join('');
function bbBotGuess(lv,clues,useLast){const all=bbAll(lv),done=new Set(clues.map(q=>q.guess)),use=useLast?clues.filter(q=>q.guess).slice(-useLast):[];
  let C=all.filter(c=>!done.has(c)&&use.every(q=>q.h?bbHint(c,q.guess)===q.h:(r=>r.s===q.s&&r.b===q.b)(bbScore(c,q.guess))));if(!C.length)C=all.filter(c=>!done.has(c));return C[Math.floor(Math.random()*C.length)]}
const BB_SYM={O:'○',A:'△',X:'✕'};
const oxaHTML=(g,h)=>`<span class="bb-oxa">${String(g).split('').map((c,i)=>`<span class="t ${h[i]}"><b>${esc(c)}</b><i>${BB_SYM[h[i]]||''}</i></span>`).join('')}</span>`;
const bbSpaced=v=>String(v||'').split('').join(' ');
const bbWho=(p,me)=>!p?'상대':(me&&p.grade===me.grade&&p.klass===me.klass?`${p.num}번`:`${p.grade}학년 ${p.klass}반 ${p.num}번`);
function sbHTML(s,b){if(!s&&!b)return'<span class="sb out">아웃</span>';return`<span class="sb">${'<i class="s"></i>'.repeat(s)}${'<i class="b"></i>'.repeat(b)}<b>${s?s+'S':''}${s&&b?' ':''}${b?b+'B':''}</b></span>`}
/* 숫자 누르개: 비밀 숫자·추리(1~9, 서로 다르게)와 방 번호(0~9) */
function digitPad({len,distinct=false,zero=true,btn='확인',auto=false,min=0,max=9,onSubmit}){
  const out=k=>/^[0-9]$/.test(k)&&(+k<min||+k>max);
  const keys=[1,2,3,4,5,6,7,8,9].map(k=>`<button type="button" data-k="${k}">${k}</button>`).join('')+`<button type="button" data-k="⌫" aria-label="지우기">⌫</button>`+(zero?'<button type="button" data-k="0">0</button>':'<span></span>')+(auto?'<span></span>':`<button type="button" class="dgo" data-k="go">${btn}</button>`);
  const w=el(`<div class="dpad"><div class="dslots">${'<span class="dslot"></span>'.repeat(len)}</div><div class="dkeys">${keys}</div></div>`);
  let v='',lock=false;
  const draw=()=>{$$('.dslot',w).forEach((d,i)=>{d.textContent=v[i]||'';d.classList.toggle('on',i<v.length)});
    $$('.dkeys button',w).forEach(b=>{const k=b.dataset.k;if(k==='go')b.disabled=lock||v.length!==len;else if(k==='⌫')b.disabled=lock||!v.length;else b.disabled=lock||out(k)||v.length>=len||(distinct&&v.includes(k))})};
  const submit=()=>{if(lock||v.length!==len)return;lock=true;draw();const val=v;onSubmit(val,ok=>{lock=false;if(ok!==false)v='';draw()})};
  const press=k=>{if(lock)return;if(k==='go')return submit();if(k==='⌫')v=v.slice(0,-1);else if(v.length<len&&!out(k)&&!(distinct&&v.includes(k))&&(zero||k!=='0'))v+=k;draw();if(auto&&v.length===len)setTimeout(submit,120)};
  $$('.dkeys button',w).forEach(b=>b.onclick=()=>press(b.dataset.k));w._press=press;w._lock=on=>{lock=on;draw()};draw();return w}
function bbKeys(pad){pinKeyHandler=e=>{if(!pad.isConnected||e.target.closest('input,select,textarea'))return;if(/^[0-9]$/.test(e.key))pad._press(e.key);else if(e.key==='Backspace'){e.preventDefault();pad._press('⌫')}else if(e.key==='Enter')pad._press('go')}}
const BB_RULES=`<ul class="bb-rule">
  <li>난이도는 4단계예요. <b>하</b> 1~6 · 2자리, <b>중</b> 1~9 · 3자리, <b>중상</b> 1~6 · 3자리, <b>상</b> 0~9 · 3자리. 그 범위에서 <b>서로 다른 숫자</b>로 내 비밀 숫자를 정해요.</li>
  <li><b>하·중</b>은 자리마다 힌트가 나와요. ○ 숫자와 자리 모두 맞음, △ 숫자는 있지만 자리가 다름, ✕ 없는 숫자.<br><span class="muted">예) 상대 숫자가 3 7 1일 때 3 1 5를 부르면 ○ △ ✕</span></li>
  <li><b>중상·상</b>은 진짜 야구 규칙이에요. 자리별 힌트 없이 <b>스트라이크(S)</b>·<b>볼(B)</b> 개수만 알려 줘요. 하나도 없으면 <b>아웃</b>.<br><span class="muted">예) 같은 경우 1S 1B</span></li>
  <li>방장이 먼저 불러요. 방장이 맞혀도 상대에게 같은 횟수만큼 기회가 있어서, 둘 다 맞히면 비겨요.</li>
  <li>한 번에 90초 안에 불러야 해요. 두 번 연속 시간을 넘기면 져요.</li>
  <li>이기면 건 포인트의 2배를 받고, 지면 건 포인트를 잃어요. 비기면 돌려받아요. <b>하</b> 단계는 <b>10포인트까지만</b> 걸 수 있어요. <b>모은 포인트 기록과 보스 데미지는 바뀌지 않아요.</b></li>
  <li>하루 10판까지 할 수 있어요.</li></ul>`;
const bbOffHTML=()=>`<div class="card panel"><p style="margin:0">친구와 대결은 선생님이 서버에 게임 설정을 추가하면 열려요. 그동안 컴퓨터와 연습할 수 있어요.</p></div>`;
const bbPracticeHTML=()=>`<div class="card panel"><h2>컴퓨터와 연습</h2><p class="muted" style="margin-top:0">포인트 없이 혼자 연습해요. 인터넷이 없어도 돼요.</p><div class="next-row" style="justify-content:flex-start;margin:0">${Object.values(BB_LV).map(l=>`<a class="btn" href="#bb-cpu-${l.k}">${l.nm} <small class="muted">${l.d}</small></a>`).join('')}</div></div>`;
let bbLobbyT=null;
function viewBaseball(){
  crumbs.innerHTML=`<span class="sep">›</span><span>숫자야구</span>`;
  app.innerHTML=`<div class="unit-head"><div><h1>숫자야구</h1><p>상대의 비밀 숫자를 먼저 맞히면 이겨요. 친구와 <b>쓸 수 있는 포인트</b>를 걸고 대결해요.</p></div></div>
   <details class="card panel bb-rules"><summary><b>규칙 보기</b></summary>${BB_RULES}</details><div id="bbLobby"></div>`;
  const host=$('#bbLobby',app);
  if(!isStudent()){host.innerHTML=`<div class="card panel"><p style="margin-top:0">친구와 대결하려면 로그인해 주세요.</p><a class="btn primary" href="#login">로그인하기</a></div>`+bbPracticeHTML();return}
  if(GAME.off){host.innerHTML=bbOffHTML()+bbPracticeHTML();return}
  host.innerHTML='<div class="card panel"><p class="muted" style="margin:0">불러오는 중…</p></div>';
  let stake=null,digits=3,lvk='easy';
  const load=async()=>{try{const L=await API.call('hg_bb_lobby',{p_token:AUTH.token});if(!host.isConnected)return;setBBLedger(L.ledger);render(L)}
    catch(e){if(!host.isConnected)return;if(isMissingFn(e)){GAME.off=true;host.innerHTML=bbOffHTML()+bbPracticeHTML()}else if(isAuthErr(e))authExpired();else host.innerHTML=`<div class="card panel"><p style="margin:0">${esc(e.message)}</p></div>`}};
  function render(L){const LVS=!!L.lvs,stakes=[0,5,10,20,50].filter(v=>v<=NUM(L.max)&&!(LVS&&lvk==='easy'&&v>BB_EASY_MAX));if(stake==null||!stakes.includes(stake)||stake>NUM(L.available))stake=0;
    const rec=L.record||{},R=Array.isArray(L.recent)?L.recent:[],O=Array.isArray(L.open)?L.open:[],me={grade:L.grade,klass:L.klass};
    const left=Math.max(0,NUM(L.limit)-NUM(L.today));
    host.innerHTML=`${L.mine?`<div class="card panel bb-mine"><b>진행 중인 경기</b> · 방 ${esc(L.mine.code)} · ${({waiting:'친구를 기다리는 중',setup:'비밀 숫자 정하는 중',playing:'경기 중'})[L.mine.status]||''} <a class="btn primary" href="#bb-${NUM(L.mine.id)}">돌아가기</a></div>`:''}
     <div class="card panel bb-wallet"><div class="stat"><small>쓸 수 있는 포인트</small><b class="rm">${Math.max(0,Number(L.available)||0)}</b></div><div class="stat"><small>오늘 남은 경기</small><b>${left}판</b></div><div class="stat"><small>내 전적</small><b>${NUM(rec.w)}승 ${NUM(rec.l)}패 ${NUM(rec.d)}무</b></div></div>
     ${!L.on?`<div class="card panel"><p style="margin:0"><b>선생님이 지금은 숫자야구를 꺼 두었어요.</b> 나중에 다시 와 주세요.</p></div>`:`
     <div class="bb-grid">
      <div class="card panel"><h2>방 만들기</h2><div class="cap">판돈 <span class="muted" style="font-weight:400">(포인트)</span></div><div class="seg bbStake">${stakes.map(v=>`<button type="button" data-v="${v}" class="${v===stake?'on':''}" ${v>Number(L.available)?'disabled':''}>${v?v:'친선'}</button>`).join('')}</div>
        ${LVS?`<div class="cap" style="margin-top:12px">난이도</div><div class="seg bbLv">${Object.values(BB_LV).map(l=>`<button type="button" data-v="${l.k}" class="${lvk===l.k?'on':''}">${l.nm}</button>`).join('')}</div><p class="muted bbLvD" style="margin:6px 0 0;font-size:14px">${BB_LV[lvk].d}${lvk==='easy'?` · 판돈 최대 ${BB_EASY_MAX}포인트`:''}</p>`
         :`<div class="cap" style="margin-top:12px">숫자 개수</div><div class="seg bbDig"><button type="button" data-v="3" class="${digits===3?'on':''}">3자리 · 쉬움</button><button type="button" data-v="4" class="${digits===4?'on':''}">4자리 · 어려움</button></div>`}
        <p style="margin:14px 0 0"><button type="button" class="btn primary bbMake" ${left?'':'disabled'}>방 만들기</button></p><div class="flmsg bbMakeMsg" role="status"></div></div>
      <div class="card panel"><h2>방 번호로 들어가기</h2><p class="muted" style="margin-top:0">친구가 알려 준 방 번호 4자리를 누르세요.</p><div class="bbCodePad"></div><div class="flmsg bbJoinMsg" role="status"></div></div>
     </div>
     <div class="card panel"><h2>우리 반 열린 방</h2>${O.length?`<ul class="bb-open">${O.map(o=>`<li><span><b>${NUM(o.num)}번</b>의 방 · ${NUM(o.stake)?`판돈 <b class="rm">${NUM(o.stake)}</b>`:'친선'} · ${BB_LV[o.lv]?`난이도 ${BB_LV[o.lv].nm}`:`${NUM(o.digits)}자리`}</span><button type="button" class="btn bbJoin" data-code="${esc(o.code)}" ${NUM(o.stake)>Number(L.available)||!left?'disabled':''}>들어가기</button></li>`).join('')}</ul>`:'<p class="muted" style="margin:0">지금 열린 방이 없어요. 방을 만들어 친구에게 번호를 알려 주세요.</p>'}</div>`}
     ${R.length?`<div class="card panel"><h2>최근 경기</h2><ul class="bb-recent">${R.map(g=>{const res=g.winner==='draw'?'무':g.winner===g.me?'승':'패';return`<li><span class="bb-res ${res==='승'?'w':res==='패'?'l':'d'}">${res}</span><span>${josa(bbWho(g.opp,me),'과','와')} ${bbLv(g).nm}${BB_LV[g.lv]?' 단계':''}${NUM(g.stake)?` · 판돈 ${NUM(g.stake)}`:' · 친선'}</span><span class="rm ${Number(g.delta)>0?'up':Number(g.delta)<0?'down':''}">${Number(g.delta)>0?'+':''}${Number(g.delta)||0}</span></li>`}).join('')}</ul></div>`:''}
     ${L.on?bbPracticeHTML():''}`;
    if(!L.on)return;
    $$('.bbStake button',host).forEach(b=>b.onclick=()=>{stake=+b.dataset.v;$$('.bbStake button',host).forEach(x=>x.classList.toggle('on',x===b))});
    $$('.bbDig button',host).forEach(b=>b.onclick=()=>{digits=+b.dataset.v;$$('.bbDig button',host).forEach(x=>x.classList.toggle('on',x===b))});
    $$('.bbLv button',host).forEach(b=>b.onclick=()=>{lvk=b.dataset.v;if(lvk==='easy'&&stake>BB_EASY_MAX)stake=BB_EASY_MAX;render(L)});
    $('.bbMake',host).onclick=async e=>{const m=$('.bbMakeMsg',host);e.currentTarget.disabled=true;m.textContent='방을 만드는 중…';
      try{await settleSync();const r=await API.call('hg_bb_create',LVS?{p_token:AUTH.token,p_stake:stake,p_digits:BB_LV[lvk].len,p_lv:lvk}:{p_token:AUTH.token,p_stake:stake,p_digits:digits});if(r&&r.ok)location.hash='#bb-'+r.game;else{m.textContent=(r&&r.msg)||'방을 만들지 못했어요.';if(r&&r.game)m.innerHTML+=` <a href="#bb-${NUM(r.game)}">경기로 가기</a>`;e.target.disabled=false}}
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
  return L.map(g=>`<li><span class="rn">${NUM(g.rnd)}</span>${g.guess&&g.h?oxaHTML(g.guess,g.h):`<span class="gs rm">${g.guess?bbSpaced(g.guess):'<span class="muted">시간 초과</span>'}</span>${g.guess?sbHTML(NUM(g.s),NUM(g.b)):''}`}</li>`).join('')}
function bbHead(st){const meP=st.me==='host'?st.host:st.guest,opP=st.me==='host'?st.guest:st.host;
  return`<div class="bb-top"><div class="bb-p"><span class="bb-av">${avatarThumb(myEq(),54)}</span><span><b>나</b><small>${st.cpu?'':esc(bbWho(meP,meP))}</small></span></div>
   <div class="bb-vs"><b>VS</b><small>${st.cpu?'연습 · 포인트 없음':NUM(st.stake)?`판돈 ${NUM(st.stake)}포인트`:'친선 경기'} · ${BB_LV[st.lv]?`난이도 ${BB_LV[st.lv].nm}`:`${NUM(st.digits)}자리`}</small></div>
   <div class="bb-p opp"><span><b>${st.cpu?'컴퓨터':esc(bbWho(opP,meP))}</b><small>${st.cpu?(st.cpu==='hard'?'똑똑한 컴퓨터':'연습 상대'):'상대'}</small></span><span class="bb-av">${st.cpu?bossSVG(BOSSES[0],54,0.5):BB_ICON}</span></div></div>`}
function renderBB(st){const host=$('#bbHost');if(!host)return;const prev=BB.st;BB.st=st;const key=st.status+'|'+(st.status==='setup'?(st.my_secret?'set':'unset'):'');
  if(key!==BB.shown){BB.shown=key;bbFull(host,st,prev)}else bbUpdate(host,st,prev)}
function bbFull(host,st,prev){pinKeyHandler=null;clearInterval(BB.tick);const lv=bbLv(st);
  const leaveBtn=t=>`<button type="button" class="btn ghost bbLeave">${t}</button>`;
  if(st.status==='waiting'){host.innerHTML=`<div class="card panel bb-wait"><div class="muted">방 번호</div><div class="bb-code rm">${bbSpaced(st.code)}</div>
    <p>친구에게 방 번호를 알려 주세요. 친구가 「방 번호로 들어가기」에서 이 번호를 누르면 시작해요.</p><p class="muted">${NUM(st.stake)?`판돈 ${NUM(st.stake)}포인트`:'친선 경기'} · ${BB_LV[st.lv]?`난이도 ${lv.nm}(${lv.d})`:`${NUM(st.digits)}자리`} · 15분 동안 아무도 안 들어오면 방이 닫혀요</p>${leaveBtn('방 닫기')}</div>`;bbWireLeave(host,false);return}
  if(st.status==='setup'){host.innerHTML=`<div class="card panel">${bbHead(st)}<h2 style="margin-top:14px">내 비밀 숫자 정하기</h2>
    <p style="margin-top:0">${lv.min}~${lv.max} 중 <b>서로 다른 숫자 ${lv.len}개</b>를 골라요. 상대가 이 숫자를 맞히려고 해요. 경기가 끝날 때까지 상대에게 보이지 않아요.</p>
    ${st.my_secret?`<div class="bb-secret">내 숫자 <b class="rm">${bbSpaced(st.my_secret)}</b> ${CHECK}</div><p class="muted bbOppReady">${st.opp_ready?'상대도 정했어요. 곧 시작해요!':'상대가 숫자를 정하는 중이에요…'}</p>`:'<div class="bbSecretPad"></div><div class="flmsg bbSecMsg" role="status"></div>'}
    <p style="margin-bottom:0">${leaveBtn('나가기')}</p></div>`;
    if(!st.my_secret){const pad=digitPad({len:lv.len,distinct:true,zero:lv.min===0,min:lv.min,max:lv.max,btn:'이 숫자로 정하기',onSubmit:async(v,done)=>{const m=$('.bbSecMsg',host);try{const r=await BB.act.secret(v);if(r&&r.ok===false){m.textContent=r.msg;done(false);return}done();if(BB.cpu)renderBB(BB.cpu.state());else bbPoll()}catch(e){m.textContent=e.message;done(false)}}});$('.bbSecretPad',host).appendChild(pad);bbKeys(pad)}
    bbWireLeave(host,false);return}
  if(st.status==='playing'){const memo=bbRange(lv).map(k=>`<button type="button" data-k="${k}" class="m${BB.memo[k]||0}">${k}</button>`).join('');
    host.innerHTML=`<div class="card panel bb-board">${bbHead(st)}<div class="bb-turn" aria-live="polite"></div>
     <div class="bb-cols"><div class="bb-col"><h3>내 추리 <small>상대 숫자 맞히기</small></h3><ol class="bb-log mineLog"></ol></div>
      <div class="bb-col"><h3>상대의 추리 <small>내 숫자 <b class="rm">${bbSpaced(st.my_secret)}</b></small></h3><ol class="bb-log oppLog"></ol></div></div>
     <div class="bb-play"><div class="bb-in"><div class="bbGuessPad"></div><div class="flmsg bbGMsg" role="status"></div></div>
      <div class="bb-memo"><b>추론 메모</b><small>${lv.oxa?'○ 맞음 · △ 자리 다름 · ✕ 없음':'S 스트라이크 · B 볼'} | 메모: 눌러서 ○ 있다 → ✕ 없다 → 빈칸</small><div class="memo-keys">${memo}</div><button type="button" class="t-mini memoClear">메모 지우기</button></div></div>
     <p style="margin:12px 0 0">${leaveBtn(st.cpu?'연습 그만하기':'기권하기')}</p></div>`;
    const pad=digitPad({len:lv.len,distinct:true,zero:lv.min===0,min:lv.min,max:lv.max,btn:'부르기',onSubmit:async(v,done)=>{const m=$('.bbGMsg',host);m.textContent='';
      try{const r=await BB.act.guess(v);if(r&&r.ok===false){m.textContent=r.msg;done(false);return}done();if(r&&NUM(r.s)===lv.len)celebrate('');if(BB.cpu)renderBB(BB.cpu.state());else bbPoll()}catch(e){m.textContent=e.message;done(false)}}});
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
  bbStop();const lvk=BB_LV[key]?key:key==='easy4'?'':'easy',lv=lvk?BB_LV[lvk]:bbLv({digits:4}),digits=lv.len,level=lvk==='mh'||lvk==='hard'?'hard':'easy';
  const S={status:'setup',me:'host',cpu:level,cpuKey:key,lv:lvk||null,digits,stake:0,round:1,turn:null,my_secret:null,opp_secret:null,guesses:[],winner:null,reason:null,host:null,guest:null,paused:false,delta:0,opp_ready:true,hostSolved:null,bot:(A=>A[Math.floor(Math.random()*A.length)])(bbAll(lv))};
  const state=()=>Object.assign({},S,{my_turn:S.status==='playing'&&S.turn==='host',opp_secret:S.status==='done'?S.bot:null,guesses:S.guesses.slice(),turn_left:0});
  const finish=w=>{S.status='done';S.winner=w;S.reason='solved';S.turn=null};
  const step=(who,solved)=>{if(who==='host'){if(solved)S.hostSolved=S.round;S.turn='guest';setTimeout(botMove,900+Math.random()*700)}
    else if(solved)finish(S.hostSolved===S.round?'draw':'guest');else if(S.hostSolved===S.round)finish('host');else if(S.round>=15){S.status='done';S.winner='draw';S.reason='rounds'}else{S.round++;S.turn='host'}};
  const botMove=()=>{if(S.status!=='playing'||S.turn!=='guest'||BB.cpu!==C)return;const mine=S.guesses.filter(g=>g.who==='guest');
    const g=level==='hard'?bbBotGuess(lv,mine,99):(Math.random()<0.25?bbBotGuess(lv,mine,0):bbBotGuess(lv,mine,1));const r=bbScore(S.my_secret,g);
    S.guesses.push({who:'guest',rnd:S.round,guess:g,s:r.s,b:r.b,h:lv.oxa?bbHint(S.my_secret,g):null});step('guest',r.s===digits);if($('#bbHost'))renderBB(state())};
  const C={state,act:{secret:async v=>{if(!new RegExp(`^[${lv.min}-${lv.max}]+$`).test(v)||new Set(v).size!==digits||v.length!==digits)return{ok:false,msg:`${lv.min}~${lv.max} 중 서로 다른 숫자 ${digits}개로 정해 주세요.`};S.my_secret=v;S.status='playing';S.turn='host';return{ok:true}},
    guess:async v=>{if(S.status!=='playing'||S.turn!=='host')return{ok:false,msg:'컴퓨터 차례예요.'};const r=bbScore(S.bot,v),h=lv.oxa?bbHint(S.bot,v):null;S.guesses.push({who:'host',rnd:S.round,guess:v,s:r.s,b:r.b,h});step('host',r.s===digits);return{ok:true,s:r.s,b:r.b}},
    leave:async()=>({ok:true})}};
  BB.cpu=C;BB.act=C.act;BB.st=null;BB.shown=null;BB.memo={};
  app.innerHTML='<div id="bbHost"></div>';renderBB(state())}



/* ───────── 오늘의 보스 도전 (T05): 혼자 하는 미니 게임 ─────────
   입장권: 오늘의 계산을 끝내면 하루 1번 무료 · 그다음은 20포인트로 2번 더(하루 최대 3판)
   방식(RAID_MODES)은 주마다 바꿀 수 있게 나눠 두었어요. 지금은 '폭탄 방어전' 하나예요.
   문제는 js/boss-bank.js(window.BOSS_BANK)에서 가져와요.
   포인트는 '끝까지 하기 · 다시 맞히기 · 새 도전'에만 조금 주고, 큰 보상은 보물상자(물건)로 줘요. */
const RAID={COST:20,PAID_MAX:2,POT:10,HP:{normal:650,hard:600},SEC:{normal:40,hard:60},HEARTS:3,GAUGE_MS:1600,GAUGE_PER:650,GOLD:3.5,GOOD:11,PARRY_MS:650,BASE:100,NEED_LES:3};
const RAID_MODES={defense:{nm:'폭탄 방어전',d:'보스가 던지는 문제 폭탄이 성벽에 닿기 전에 풀어서 터뜨려요.'}};
const raidModeNow=()=>'defense';
const DICE=[null,
  {nm:'보스 광폭화',ic:'😡',d:'문제마다 시간 −5초. 대신 이기면 무조건 황금 상자!'},
  {nm:'행운의 방패',ic:'🍀',d:'첫 실수 1번은 자동으로 막아 줘요.'},
  {nm:'시간의 모래시계',ic:'⏳',d:'문제마다 시간 +10초.'},
  {nm:'정밀 조준',ic:'🎯',d:'PERFECT 황금 존이 2배로 넓어져요.'},
  {nm:'강타 버프',ic:'💪',d:'이번 판 데미지 1.5배!'},
  {nm:'잭팟!',ic:'🎰',d:'데미지 2배 + 이기면 보물상자를 2번 열어요!'}];
const DICE_FACE=['','⚀','⚁','⚂','⚃','⚄','⚅'];
function raidBoss(d=today()){const w=Math.floor((Date.parse(d+'T00:00:00Z')/864e5+3)/7);return BOSSES[((w%BOSSES.length)+BOSSES.length)%BOSSES.length]}
function raidDay(){const R=DB._raid=OBJ(DB._raid),t=today();R.days=OBJ(R.days);Object.keys(R.days).forEach(k=>{if(k<addDays(t,-3))delete R.days[k]});
  const D=R.days[t]=OBJ(R.days[t]);D.f=NUM(D.f);D.p=NUM(D.p);R.w=NUM(R.w);R.g=NUM(R.g);return{R,D}}
/* 보스전 문은 '주요 학습'에서 해결한 차시가 RAID.NEED_LES개 이상일 때 열려요. 해결 = 같이 풀기 끝까지 1번 또는 혼자 풀기 3문제 */
const lesSolved=id=>{const p=DB[id];return!!p&&(NUM(p.steps)>0||(!!p.prac&&NUM(p.prac.solved)>=3))};
const raidLessons=()=>LESSONS.filter(l=>l.ready&&!l.hidden&&(typeof OPEN_UNITS==='undefined'||!l.unit||OPEN_UNITS.includes(l.unit)));
const raidSolved=()=>raidLessons().filter(l=>lesSolved(l.id));
function raidPool(tier){const ok=new Set(raidSolved().map(l=>l.id));return((window.BOSS_BANK||{})[tier]||[]).filter(it=>!it.les||ok.has(it.les))}
function raidTix(){const{D}=raidDay(),t=today(),drill=NUM(dayState().c.drill)>0||OBJ(DB._drill).last===t,les=raidSolved().length,open=les>=RAID.NEED_LES;
  return{drill,les,open,free:open&&drill&&!D.f,paidLeft:open&&D.f?Math.max(0,RAID.PAID_MAX-D.p):0,played:D.f+D.p}}
const titleChip=id=>{if(!id||id==='none')return'';const it=shopItem('title',id);return it&&it.id===id?`<div class="ti-chip on-av">🏅 ${it.nm}</div>`:''};
/* 연속 보호 방패: 하루(이상) 빠졌을 때, 가진 방패만큼 연속 일수를 이어 줘요 */
function shieldCheck(){const M=me(),t=today(),y=addDays(t,-1);if(!M.last||M.last>=y||NUM(M.streak)<2)return;
  let gap=0,d=M.last;while(d<y&&gap<8){d=addDays(d,1);gap++}
  if(gap<1||gap>shieldLeft())return;const S=shopState();S.shieldUsed=NUM(S.shieldUsed)+gap;M.last=y;save();
  setTimeout(()=>toast(`🛡️ 연속 보호 방패 ${gap}개를 써서 연속 ${M.streak}일이 그대로 이어졌어요!`),300)}
award=(f=>function(n,k,w){shieldCheck();return f(n,k,w)})(award);

function raidStripHTML(short){const t=raidTix(),n=(t.free?1:0)+t.paidLeft;
  return`<a class="raid-strip" href="#boss"><span>⚔️ <b>${short?'도전하러 가기 →':'오늘의 보스 도전'}</b>${short?'':' · '+esc(raidBoss().nm)}</span><small>${!t.open?`주요 학습 ${t.les}/${RAID.NEED_LES}차시 해결하면 열려요`:t.free?'무료 입장권 있어요!':t.drill?(n?`추가 입장 ${n}번 가능`:'오늘은 다 했어요'):'오늘의 계산을 끝내면 무료 입장'}</small></a>`}
function raidLootCount(){const S=shopState(),fr=shopCat('frame').items.filter(i=>i.bossOnly),ti=shopCat('title').items.filter(i=>i.bossOnly);
  return{tix:bonusLeft(),shield:shieldLeft(),pcs:NUM(S.couponPcs)%3,coupons:Math.floor(NUM(S.couponPcs)/3),fr:fr.filter(i=>owns('frame',i.id)).length,frN:fr.length,ti:ti.filter(i=>owns('title',i.id)).length,tiN:ti.length}}
function raidLobby(host){if(!host)return;const b=raidBoss(),t=raidTix(),{R}=raidDay(),L=raidLootCount(),mode=RAID_MODES[raidModeNow()];
  const btns=!t.open?`<a class="btn primary" href="#unit-${UNIT_ID}">주요 학습 하러 가기 → (해결한 차시 ${t.les}/${RAID.NEED_LES})</a>`:t.free?`<button type="button" class="btn primary raidGo" data-pay="0">🎟️ 무료 입장권으로 도전!</button>`
    :!t.drill?`<a class="btn primary" href="#drill">오늘의 계산 하고 무료 입장권 받기 →</a>`
    :t.paidLeft?`<button type="button" class="btn primary raidGo" data-pay="1">${RAID.COST}포인트로 한 번 더 (오늘 ${t.paidLeft}번 남음)</button>`
    :`<span class="muted">오늘 도전은 다 했어요. 내일 새 입장권이 생겨요!</span>`;
  host.innerHTML=`<div class="card panel raid-lobby">
    <div class="rl-top"><div class="rl-pic"></div><div class="rl-info"><span class="stage-tag">이번 주 보스 · ${mode.nm}</span><h2>${esc(b.nm)}</h2>
      <p>${mode.d} 정답을 맞히면 <b>타이밍 게이지</b>를 눌러 더 세게! 틀리면 번쩍 뜨는 <b>🛡️ 막기</b>를 재빨리 눌러요.</p>
      <div class="rl-act">${btns}</div>
      ${t.open?`<p class="rl-les">📚 내가 해결한 차시 <b>${t.les}개</b>의 개념만 문제로 나와요: ${raidSolved().map(l=>esc(l.title)).join(' · ')}</p>`:`<p class="rl-les">🔒 <b>주요 학습</b>에서 차시를 <b>${RAID.NEED_LES}개 이상</b> 해결하면 열려요. (같이 풀기를 끝까지 하거나, 혼자 풀기 3문제) · 지금 <b>${t.les}/${RAID.NEED_LES}</b></p>`}
      <small class="muted">하루 최대 3판${R.g?` · 내 전적 ${R.w}승 / ${R.g}판`:''}</small></div></div>
    <div class="rl-loot">
      <a href="#shop" title="상점에서 쓸 수 있어요">🎟️ 캡슐 뽑기권 <b class="rm">${L.tix}</b></a>
      <span title="하루 빠져도 연속 일수를 지켜 줘요">🛡️ 연속 보호 방패 <b class="rm">${L.shield}</b></span>
      <span title="조각 3개 = 쿠폰 1장">🎫 대면 수업 쿠폰 조각 <b class="rm">${L.pcs}/3</b>${L.coupons?` · 완성 쿠폰 <b class="rm">${L.coupons}</b>장 (선생님께 보여 주세요)`:''}</span>
      <a href="#shop">🖼️ 보스 한정 프레임 <b class="rm">${L.fr}/${L.frN}</b> · 칭호 <b class="rm">${L.ti}/${L.tiN}</b></a></div></div>`;
  mountSpin($('.rl-pic',host),y=>bossSVG(b,150,y),{speed:0.5});
  $$('.raidGo',host).forEach(x=>x.onclick=()=>raidOpen(x.dataset.pay==='1',()=>raidLobby(host)))}

function raidPick(tier,G){const B=raidPool(tier);if(!B.length)return null;const want=G.units[G.qi%G.units.length];let q=null;
  for(let k=0;k<40;k++){const it=B[Math.floor(Math.random()*B.length)];let c;try{c=typeof it==='function'?it(Math.random):Object.assign({},it)}catch(e){continue}
    if(!c||!c.q)continue;if(it.les&&!c.les)c.les=it.les;if(G.used.has(c.q)&&k<36)continue;q=c;if(k<30&&c.unit!==want)continue;break}
  if(!q)return null;G.used.add(q.q);if(q.type==='choice')q.choices=shuffle(Math.random,q.choices||[]);if(!q.type)q.type='num';return q}

function raidChestSVG(gold,size=96){const c=gold?['#ffd23f','#c98a00','#fff3b0']:['#cfd6e4','#7d889e','#f2f5fa'];
  return`<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="90" rx="36" ry="5" fill="rgba(0,0,0,.18)"/>
   <rect x="14" y="44" width="72" height="42" rx="6" fill="${c[0]}" stroke="#1d2640" stroke-width="3.5"/><path class="lid" d="M14 46 V34 a12 12 0 0 1 12-12 h48 a12 12 0 0 1 12 12 V46 z" fill="${c[2]}" stroke="#1d2640" stroke-width="3.5"/>
   <rect x="14" y="44" width="72" height="8" fill="${c[1]}" stroke="#1d2640" stroke-width="3"/><rect x="42" y="40" width="16" height="20" rx="3" fill="#1d2640"/><circle cx="50" cy="49" r="3" fill="${c[0]}"/>
   ${gold?'<path d="M24 30l3 5 5 1-4 3 1 6-5-3-5 3 1-6-4-3 5-1z" fill="#fff"/>':''}</svg>`}

/* 보물상자 내용: 꽝 없음. 이번 주 보스의 한정 프레임·칭호가 섞여 있어요 */
function raidLoot(gold,boss){const S=shopState(),fr=shopCat('frame').items.find(i=>i.bossOnly===boss.id),ti=shopCat('title').items.find(i=>i.bossOnly===boss.id);
  const W=[['pts',gold?20:35],['tix',gold?22:12],['shield',gold?15:20],['coupon',18]];
  if(fr&&!owns('frame',fr.id))W.push(['frame',gold?15:8]);if(ti&&!owns('title',ti.id))W.push(['title',gold?10:4]);
  if(!gachaInfo().pool.length)W.splice(1,1);
  let roll=Math.random()*W.reduce((a,b)=>a+b[1],0),k=W[0][0];for(const w of W){roll-=w[1];if(roll<=0){k=w[0];break}}
  const n=gold?15+Math.floor(Math.random()*11):8+Math.floor(Math.random()*5);
  return{pts:{k,ic:'💰',nm:`포인트 주머니 +${n}`,d:'바로 쓸 수 있는 포인트예요.',n},tix:{k,ic:'🎟️',nm:'캡슐 뽑기권 1장',d:'상점에서 하루 횟수와 상관없이, 아직 없는 캐릭터만 나와요.'},
    shield:{k,ic:'🛡️',nm:'연속 보호 방패 1개',d:'하루 빠져도 연속 일수를 지켜 줘요.'},coupon:{k,ic:'🎫',nm:'대면 수업 쿠폰 조각 1개',d:'3개 모으면 방과후 수업 보너스 쿠폰 1장!'},
    frame:fr&&{k,ic:'🖼️',nm:`보스 한정 프레임 ‘${fr.nm}’`,d:'상점 프로필 프레임에서 바로 쓸 수 있어요.',id:fr.id,cls:fr.cls},
    title:ti&&{k,ic:'🏅',nm:`보스 한정 칭호 ‘${ti.nm}’`,d:'상점 칭호 탭에서 달 수 있어요.',id:ti.id}}[k]}
function raidApply(x){const S=shopState();
  if(x.k==='pts')award(x.n,null,'보물상자 포인트 주머니');
  else if(x.k==='tix')S.bonusGot=NUM(S.bonusGot)+1;
  else if(x.k==='shield')S.shieldGot=NUM(S.shieldGot)+1;
  else if(x.k==='coupon'){S.couponPcs=NUM(S.couponPcs)+1;if(S.couponPcs%3===0)setTimeout(()=>celebrate('🎫 쿠폰 조각 3개! 대면 수업 보너스 쿠폰 1장이 완성됐어요'),900)}
  else if(x.k==='frame')S.own['frame:'+x.id]=1;
  else if(x.k==='title')S.own['title:'+x.id]=1;
  save()}

function raidOpen(paid,onClose){
  const old=$('.raid-ov');if(old)old.remove();
  const boss=raidBoss(),ov=el(`<div class="raid-ov" role="dialog" aria-modal="true" aria-label="오늘의 보스 도전"><div class="raid-box"><div class="raid-top"></div><div class="raid-stage"></div></div></div>`);
  document.body.appendChild(ov);document.body.classList.add('raid-lock');
  const top=$('.raid-top',ov),stage=$('.raid-stage',ov);let G=null,keyFn=null,timers=[],closed=false;
  const later=(f,ms)=>{const id=setTimeout(()=>{if(!closed)f()},ms);timers.push(id);return id};
  const close=()=>{if(closed)return;closed=true;timers.forEach(clearTimeout);ov.remove();document.body.classList.remove('raid-lock');removeEventListener('keydown',onKey,true);removeEventListener('hashchange',close);activeBox=null;if(onClose)onClose()};
  const onKey=e=>{if(e.key==='Escape'&&(!G||G.over)){close();return}if((e.key===' '||e.code==='Space')&&keyFn){e.preventDefault();e.stopPropagation();keyFn()}};
  addEventListener('keydown',onKey,true);addEventListener('hashchange',close);
  const buzz=ms=>{try{if(navigator.vibrate)navigator.vibrate(ms)}catch(e){}};

  /* 1) 준비: 난이도 · 물약 */
  function prep(){const ptsNeed=()=>(paid?RAID.COST:0)+(opt.time?RAID.POT:0)+(opt.heart?RAID.POT:0);
    top.innerHTML=`<b>⚔️ ${esc(boss.nm)} · 준비</b><button type="button" class="btn ghost raid-x">닫기</button>`;$('.raid-x',top).onclick=close;
    const draw=()=>{const need=ptsNeed(),lack=need>balance();
      stage.innerHTML=`<div class="rp-prep"><div class="rp-boss"></div>
        <h3>난이도를 골라요</h3><div class="rp-modes">
          <button type="button" class="rp-mode ${opt.tier==='normal'?'on':''}" data-t="normal"><b>⚔️ 일반</b><small>문제마다 ${RAID.SEC.normal}초 · 이기면 <b>은 상자</b></small></button>
          <button type="button" class="rp-mode ${opt.tier==='hard'?'on':''}" data-t="hard" ${raidPool('hard').length?'':'disabled'}><b>🔥 필살기</b><small>${raidPool('hard').length?`어려운 문제 · ${RAID.SEC.hard}초 · 이기면 <b>황금 상자</b>`:'해결한 차시에 맞는 어려운 문제가 아직 없어요'}</small></button></div>
        <h3>물약 (선택)</h3><div class="rp-pots">
          <button type="button" class="rp-pot ${opt.time?'on':''}" data-p="time">⏳ 시간 연장 +15초 <small>${RAID.POT}포인트</small></button>
          <button type="button" class="rp-pot ${opt.heart?'on':''}" data-p="heart">❤️ 예비 하트 +1 <small>${RAID.POT}포인트</small></button></div>
        <p class="rp-cost">${need?`이번 판에 쓸 포인트 <b class="rm">${need}</b> · 쓸 수 있는 포인트 <b class="rm">${balance()}</b>`:'🎟️ 무료 입장권을 써요.'}${lack?` <span class="bad">· ${need-balance()}포인트가 모자라요</span>`:''}</p>
        <button type="button" class="btn primary rp-go" ${lack?'disabled':''}>🎲 운명의 주사위 굴리고 시작!</button></div>`;
      mountSpin($('.rp-boss',stage),y=>bossSVG(boss,120,y),{speed:0.6});
      $$('.rp-mode',stage).forEach(b=>b.onclick=()=>{opt.tier=b.dataset.t;draw()});
      $$('.rp-pot',stage).forEach(b=>b.onclick=()=>{opt[b.dataset.p]=!opt[b.dataset.p];draw()});
      $('.rp-go',stage).onclick=()=>{const t=raidTix(),need=ptsNeed();if(paid?!t.paidLeft:!t.free){toast('입장권이 없어요.');close();return}if(!raidPool(opt.tier).length){toast('아직 낼 문제가 없어요. 주요 학습을 먼저 해요.');return}if(need>balance()){draw();return}
        const{R,D}=raidDay();if(paid)D.p+=1;else D.f=1;R.g+=1;if(need)shopState().spent+=need;save();updatePill();dice()}};
    const opt={tier:'normal',time:false,heart:false};draw();
    prep.opt=opt}

  /* 2) 운명의 주사위 */
  function dice(){const opt=prep.opt,face=1+Math.floor(Math.random()*6),D=DICE[face];
    top.innerHTML=`<b>🎲 운명의 주사위</b>`;
    stage.innerHTML=`<div class="rd-wrap"><div class="rd-die" aria-live="polite">⚀</div><div class="rd-res"></div></div>`;
    const die=$('.rd-die',stage);let k=0;const spin=()=>{die.textContent=DICE_FACE[1+(k++%6)];if(k<14)later(spin,50+k*12)};if(!reduced)spin();
    later(()=>{die.textContent=DICE_FACE[face];die.classList.add('land');buzz(30);
      $('.rd-res',stage).innerHTML=`<div class="rd-buff f${face}"><span class="ic">${D.ic}</span><b>${face} · ${D.nm}</b><small>${D.d}</small></div><button type="button" class="btn primary rd-go">전투 시작! (스페이스)</button>`;
      const go=()=>{keyFn=null;start(opt,face)};$('.rd-go',stage).onclick=go;keyFn=go},reduced?200:1150)}

  /* 3) 전투 */
  function start(opt,face){const tier=opt.tier,maxH=RAID.HEARTS+(opt.heart?1:0);
    G={tier,face,hp:RAID.HP[tier],max:RAID.HP[tier],hearts:maxH,maxH,sec:RAID.SEC[tier]+(face===3?10:0)-(face===1?5:0)+(opt.time?15:0),
      luck:face===2,guard:false,combo:0,best:0,allCombo:false,perfect:0,good:0,hits:0,shots:0,missed:[],used:new Set(),units:shuffle(Math.random,raidUnits(tier)),qi:0,over:false,mult:face===6?2:face===5?1.5:1,zone:face===4?2:1};
    stage.innerHTML=`<div class="rb-arena"><div class="rb-boss"><div class="rb-hp"><i></i><span></span></div><div class="rb-pic"></div></div>
      <div class="rb-lane"><div class="rb-bomb"><span class="bi">💣</span><b class="bt"></b></div></div><div class="rb-wall" aria-hidden="true"></div><div class="rb-fx"></div></div>
      <div class="rb-card"><div class="rb-meta"></div><div class="rb-q"></div><div class="rb-ans"></div></div>`;
    mountSpin($('.rb-pic',stage),y=>bossSVG(boss,108,y),{speed:0.7});drawTop();drawHP();next()}
  function drawTop(){if(!G)return;const D=DICE[G.face];
    top.innerHTML=`<span class="rh-hearts" aria-label="하트 ${G.hearts}개">${'❤️'.repeat(G.hearts)}${'🤍'.repeat(Math.max(0,G.maxH-G.hearts))}</span><span class="rh-buff" title="${D.d}">${D.ic} ${D.nm}</span>${G.combo>=2?`<span class="rh-combo">PERFECT ×${G.combo}</span>`:''}${G.allCombo?'<span class="rh-combo gold">황금 상자 승급!</span>':''}<button type="button" class="btn ghost raid-x">그만하기</button>`;
    const x=$('.raid-x',top);x.onclick=()=>{if(G.over){close();return}if(x.dataset.sure){finish(false,true);return}x.dataset.sure=1;x.textContent='정말 그만할까요? 한 번 더 누르면 끝나요'}}
  function drawHP(){const i=$('.rb-hp i',stage),s=$('.rb-hp span',stage);if(i)i.style.width=Math.max(0,G.hp/G.max*100).toFixed(1)+'%';if(s)s.textContent=`체력 ${Math.max(0,G.hp)} / ${G.max}`}
  function fx(html,cls){const lay=$('.rb-fx',stage);if(!lay)return;const d=el(`<span class="rfx ${cls||''}">${html}</span>`);lay.appendChild(d);later(()=>d.remove(),1400)}
  function next(){if(!G||G.over)return;const q=raidPick(G.tier,G);G.qi++;
    if(!q){stage.innerHTML='<p class="muted">문제를 불러오지 못했어요. 새로 고침해 주세요.</p>';return}
    G.q=q;G.shots++;G.state='ans';
    $('.rb-meta',stage).innerHTML=`<span class="rb-unit">${esc(q.unit||'')}</span><span>폭탄 ${G.shots}번째</span>`;$('.rb-q',stage).innerHTML=q.q;
    const bomb=$('.rb-bomb',stage);bomb.className='rb-bomb';bomb.style.top='0%';
    const box=$('.rb-ans',stage);box.innerHTML='';box.appendChild(answerUI(q,v=>{if(G.state!=='ans')return;const ok=check(q,v);
      if(ok==='nopi'){toast('답 끝에 π를 붙여요.');return false}if(ok==='nosign'){toast('부호(+, −)를 붙여요.');return false}
      if(ok===true){hitPhase();return true}wrong(String(v));return true}));
    const t0=performance.now(),lim=G.sec*1000,bt=$('.bt',bomb);
    const tick=now=>{if(closed||G.over||G.state!=='ans'||G.q!==q)return;const p=Math.min(1,(now-t0)/lim),left=Math.ceil((lim-(now-t0))/1000);
      bomb.style.top=(p*100).toFixed(2)+'%';bt.textContent=Math.max(0,left);bomb.classList.toggle('hurry',left<=10);
      if(p>=1){wrong(null);return}requestAnimationFrame(tick)};requestAnimationFrame(tick)}
  /* 정답 → 저스트 타이밍 게이지 */
  function hitPhase(){G.state='gauge';G.hits++;const box=$('.rb-ans',stage),gw=RAID.GOLD*G.zone,ow=RAID.GOOD;
    box.innerHTML=`<div class="rg"><p class="rg-t">정답! 가운데 <b>황금 존</b>에 맞춰 누르면 PERFECT!</p><div class="rg-bar"><i class="rg-good" style="left:${50-ow}%;width:${ow*2}%"></i><i class="rg-gold" style="left:${50-gw}%;width:${gw*2}%"></i><b class="rg-cur"></b></div>
      <button type="button" class="btn primary rg-hit">지금! (스페이스)</button></div>`;
    activeBox=null;const cur=$('.rg-cur',box),t0=performance.now(),per=reduced?1200:RAID.GAUGE_PER;let done=false,p=0;
    const tick=now=>{if(done||closed||!G||G.over)return;const ph=((now-t0)/per)%2;p=ph<1?ph:2-ph;cur.style.left=(p*100).toFixed(2)+'%';if(now-t0>=RAID.GAUGE_MS){hit(null);return}requestAnimationFrame(tick)};
    const hit=pp=>{if(done)return;done=true;keyFn=null;const d=Math.abs((pp==null?-1:pp)*100-50);
      const g=pp==null?'late':d<=gw?'perfect':d<=ow?'good':'miss';strike(g)};
    const tap=e=>{if(e)e.preventDefault();hit(p)};$('.rg-hit',box).onclick=tap;$('.rg-bar',box).onpointerdown=tap;keyFn=tap;requestAnimationFrame(tick)}
  function strike(g){if(!G||G.over)return;const m={perfect:2,good:1.3,miss:1,late:1}[g],dmg=Math.round(RAID.BASE*m*G.mult);
    if(g==='perfect'){G.perfect++;G.combo++;G.best=Math.max(G.best,G.combo);if(G.combo>=3&&!G.allCombo){G.allCombo=true;later(()=>toast('🌟 PERFECT 3연속! 이기면 황금 상자로 승급해요'),500)}}else{G.combo=0;if(g==='good')G.good++}
    G.hp-=dmg;const bomb=$('.rb-bomb',stage);if(bomb)bomb.classList.add('fly');
    fx(`${g==='perfect'?'PERFECT!':g==='good'?'GOOD!':'명중!'} <b>−${dmg}</b>`,g);buzz(g==='perfect'?[20,30,40]:25);
    const pic=$('.rb-pic',stage);if(pic&&!reduced){pic.classList.remove('hit');void pic.offsetWidth;pic.classList.add('hit')}
    $('.rb-ans',stage).innerHTML=`<p class="rg-t">${g==='perfect'?'⚡ 완벽한 타이밍! 데미지 2배':g==='good'?'좋아요! 데미지 1.3배':'정답이라 기본 데미지는 그대로 들어가요.'}</p>`;
    drawTop();drawHP();later(()=>{if(G.hp<=0)finish(true);else next()},1100)}
  /* 오답·시간 초과 → 1.2초 긴급 막기 */
  function wrong(v){if(G.state!=='ans')return;G.state='hurt';G.combo=0;const q=G.q;G.missed.push({q,v});activeBox=null;
    const bomb=$('.rb-bomb',stage);if(bomb){bomb.style.top='100%';bomb.classList.add('boom')}
    $('.rb-ans',stage).innerHTML=`<p class="rg-t">${v==null?'⏰ 시간이 다 됐어요!':'앗, 아쉬워요!'} 정답은 <b>${esc(fmtAns(q))}</b> · 끝나고 다시 볼 수 있어요.</p>`;drawTop();
    if(G.luck){G.luck=false;fx('🍀 행운의 방패가 막았어요!','guard');later(next,1500);return}
    if(G.guard){later(()=>hurt(),500);return}
    later(()=>{const ar=$('.rb-arena',stage);if(!ar)return;const b=el('<button type="button" class="rp-parry">🛡️ 막기!</button>');
      b.style.left=(4+Math.random()*70)+'%';b.style.top=(6+Math.random()*62)+'%';ar.appendChild(b);let done=false;
      const ok=e=>{if(e)e.preventDefault();if(done)return;done=true;keyFn=null;b.remove();G.guard=true;fx('⚡ 저스트 가드!','guard');buzz([15,20,15]);later(next,1300)};
      b.onpointerdown=ok;b.onclick=ok;keyFn=ok;later(()=>{if(done)return;done=true;keyFn=null;b.remove();hurt()},RAID.PARRY_MS)},450)}
  function hurt(){if(!G||G.over)return;G.hearts--;fx('💥 성벽이 흔들려요! 하트 −1','hurt');buzz(120);const a=$('.rb-arena',stage);if(a&&!reduced){a.classList.remove('shake');void a.offsetWidth;a.classList.add('shake')}
    drawTop();later(()=>{if(G.hearts<=0)finish(false);else next()},1300)}

  /* 4) 끝: 이기면 보물상자 → 복기 */
  function finish(win,quit){if(G.over)return;G.over=true;G.state='end';keyFn=null;activeBox=null;const{R}=raidDay();if(win){R.w+=1;R.beat=OBJ(R.beat);R.beat[boss.id]=1}save();
    const gold=win&&(G.tier==='hard'||G.face===1||G.allCombo),picks=win?(G.face===6?2:1):0,got=[];
    const pts=[];const give=(n,k,why)=>{if(award(n,k,why))pts.push(`+${n} ${why}`)};
    if(!quit){give(5,'boss:'+today()+':raidfin','보스전을 끝까지 했어요')}
    if(win){give(10,'rboss:'+boss.id,`${boss.nm} 첫 승리 (새 도전)`);if(G.tier==='hard')give(10,'rhard:first','필살기 첫 승리 (새 도전)')}
    if(win)chest(gold,picks,got,()=>summary(win,gold,got,pts,quit));else summary(win,gold,got,pts,quit)}
  function chest(gold,left,got,done){top.innerHTML=`<b>🎁 ${gold?'황금':'은'} 보물상자</b>`;
    const L=[0,1,2].map(()=>raidLoot(gold,boss));
    stage.innerHTML=`<div class="rc-wrap"><h3>${josa(boss.nm,'을','를')} 물리쳤어요! 상자를 하나 골라요${left>1?` <small>(잭팟! ${left}번 열어요)</small>`:''}</h3>
      <div class="rc-row">${L.map((_,i)=>`<button type="button" class="rc-chest ${gold?'gold':''}" data-i="${i}" aria-label="${i+1}번 상자">${raidChestSVG(gold)}</button>`).join('')}</div><div class="rc-res" aria-live="polite"></div></div>`;
    if(!got.length)celebrate('');
    $$('.rc-chest',stage).forEach(b=>b.onclick=()=>{if(stage.dataset.busy)return;stage.dataset.busy=1;const i=+b.dataset.i,x=L[i];b.classList.add('shake2');
      later(()=>{b.classList.remove('shake2');b.classList.add('open');raidApply(x);got.push(x);celebrate(`${x.ic} ${x.nm}!`);
        $$('.rc-chest',stage).forEach((c,j)=>{c.disabled=true;if(j!==i){c.classList.add('peek');c.insertAdjacentHTML('beforeend',`<span class="rc-peek">${L[j].ic}<small>${esc(L[j].nm)}</small></span>`)}});
        $('.rc-res',stage).innerHTML=`<div class="rc-got"><span class="ic">${x.ic}</span><b>${esc(x.nm)}</b><small>${esc(x.d)}</small></div><button type="button" class="btn primary rc-next">${left>1?'한 번 더 열기!':'결과 보기'}</button>`;
        $('.rc-next',stage).onclick=()=>{delete stage.dataset.busy;if(left>1)chest(gold,left-1,got,done);else done()}},reduced?100:900)})}
  function summary(win,gold,got,pts,quit){let retry=0;
    top.innerHTML=`<b>${win?'🏆 승리!':quit?'도전 끝':'💥 이번엔 아쉬워요'}</b><button type="button" class="btn ghost raid-x">닫기</button>`;$('.raid-x',top).onclick=close;
    const t=raidTix(),more=t.free||t.paidLeft;
    stage.innerHTML=`<div class="rs-wrap"><div class="rs-head ${win?'win':''}"><div class="rs-pic"></div><div><h3>${win?`${josa(boss.nm,'을','를')} 물리쳤어요!`:quit?'여기까지 했어요.':`${boss.nm}에게 이번엔 졌어요.`}</h3>
        <p>${win?(gold?'황금 상자를 열었어요!':'은 상자를 열었어요!'):'괜찮아요. 놓친 문제를 다시 풀면 다음 판이 훨씬 쉬워져요.'}</p></div></div>
      <div class="rs-stats"><span>맞힌 폭탄 <b class="rm">${G.hits}</b>/${G.shots}</span><span>PERFECT <b class="rm">${G.perfect}</b></span><span>최고 연속 <b class="rm">${G.best}</b></span><span>남은 하트 <b class="rm">${Math.max(0,G.hearts)}</b></span></div>
      ${got.length?`<div class="rs-got">${got.map(x=>`<span>${x.ic} ${esc(x.nm)}</span>`).join('')}</div>`:''}
      ${pts.length?`<p class="rs-pts">받은 포인트: ${pts.join(' · ')}</p>`:''}
      ${G.missed.length?`<h3>💡 놓친 문제 핵심 복기</h3><p class="muted" style="margin-top:0">다시 풀어서 맞히면 문제마다 <b>+2</b> (이번 판 최대 2문제)</p><ol class="rs-miss">${G.missed.map((m,i)=>`<li data-i="${i}"><span class="rb-unit">${esc(m.q.unit||'')}</span><div class="rs-q">${m.q.q}</div>
        <div class="rs-tip">정답 <b>${esc(fmtAns(m.q))}</b>${m.v!=null?` <span class="muted">(내 답: ${esc(m.v)})</span>`:' <span class="muted">(시간 초과)</span>'}<br>${m.q.tip||''}</div><button type="button" class="btn t-mini rs-retry">다시 풀어 보기</button><div class="rs-box"></div></li>`).join('')}</ol>`:'<p class="rs-clean">🌟 놓친 문제 없이 끝냈어요!</p>'}
      <div class="rs-act">${more?`<button type="button" class="btn primary rs-again">${t.free?'무료 입장권으로 또 도전':`${RAID.COST}포인트로 한 번 더`}</button>`:''}<button type="button" class="btn rs-close">닫기</button></div></div>`;
    const rp=$('.rs-pic',stage);if(win)rp.innerHTML=raidChestSVG(gold,90);else mountSpin(rp,y=>bossSVG(boss,90,y),{speed:0.5});
    $('.rs-close',stage).onclick=close;const ag=$('.rs-again',stage);if(ag)ag.onclick=()=>{const tt=raidTix();paid=!tt.free;G=null;prep()};
    $$('.rs-miss li',stage).forEach(li=>{const m=G.missed[+li.dataset.i],btn=$('.rs-retry',li),bx=$('.rs-box',li);
      btn.onclick=()=>{btn.remove();$('.rs-tip',li).classList.add('hide');const q=Object.assign({},m.q);bx.appendChild(answerUI(q,v=>{const ok=check(q,v);if(ok==='nopi'){toast('답 끝에 π를 붙여요.');return false}if(ok!==true)return false;
        bx.innerHTML=`<p class="rs-ok">맞혔어요! ${retry<2?'':'(포인트는 이번 판 2문제까지)'}</p>`;$('.rs-tip',li).classList.remove('hide');if(retry<2){retry++;award(2,null,'놓친 문제를 다시 풀어 맞혔어요')}activeBox=null;return true}))}})}
  prep()}
const BOSS_BANK_UNITS=()=>((window.BOSS_BANK||{}).units||['원과 부채꼴','입체도형','좌표평면과 그래프']).slice();
/* 이 학생이 실제로 받을 수 있는 단원만 돌아가며 내요 */
function raidUnits(tier){const u=new Set();raidPool(tier).forEach(it=>{try{const q=typeof it==='function'?it(Math.random):it;if(q&&q.unit)u.add(q.unit)}catch(e){}});return u.size?[...u]:BOSS_BANK_UNITS()}
