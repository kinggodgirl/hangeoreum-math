"use strict";
/* ───────── 공통 도구 ───────── */
const TAU=Math.PI*2;
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
function el(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild}
function mulberry(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const ri=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const newSeed=()=>Math.floor(Math.random()*2**31);
const KD=['','일','이','삼','사','오','육','칠','팔','구'];
function kn(n){if(n<10)return KD[n];const t=Math.floor(n/10),o=n%10;return(t>1?KD[t]:'')+'십'+KD[o]}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(msg){let box=$('#toasts');if(!box){box=el('<div id="toasts" aria-live="polite"></div>');document.body.appendChild(box)}const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=String(msg);box.appendChild(t);while(box.children.length>3)box.firstElementChild.remove();setTimeout(()=>t.remove(),2600)}
const CHECK='<svg width="14" height="14" viewBox="0 0 14 14" aria-label="완료"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const sgnTxt=n=>{const r=Math.round(n*1000)/1000;return r>0?'+'+r:r<0?'−'+(-r):'0'};
const T=(key,label)=>`<button type="button" class="term" data-t="${key}">${label||key}</button>`;

/* ───────── 단원 · 사이트 설정 (config.js) ─────────
   unit: 이 사이트에서 여는 단원(solid 입체도형, int 정수와 유리수) · standalone: 로그인 없이 이 기기에만 저장 */
const SITE=window.HG_CONFIG||{},UNIT_ID=SITE.unit||'solid',STANDALONE=!!SITE.standalone;
const UNIT_INFO={solid:{name:'입체도형의 성질',ch:'입체도형의 성질',sub:'1학년 2학기 · 시범 단원',start:'입체도형 단원 시작하기'},int:{name:'정수와 유리수',ch:'정수와 유리수',sub:'1학년 1학기 · II단원',start:'정수와 유리수 단원 시작하기'},circle:{name:'원과 부채꼴',ch:'평면도형의 성질',sub:'1학년 2학기 · 평면도형의 성질',start:'원과 부채꼴 시작하기'}};
const UI_=UNIT_INFO[UNIT_ID]||UNIT_INFO.solid,UNIT_HASH='#unit-'+UNIT_ID;
/* 한 사이트에서 함께 여는 단원 (config.js units: ['solid','circle'] 처럼 바꿀 수 있어요). 첫 단원이 대표 단원(UNIT_ID) */
const OPEN_UNITS=Array.isArray(SITE.units)&&SITE.units.length?SITE.units.filter(u=>UNIT_INFO[u]):UNIT_ID==='solid'?['solid','circle']:[UNIT_ID];
const unitOf=u=>UNIT_INFO[u]||UI_;
/* ───────── 저장(이 기기 전용) ───────── */
const STORE_KEY=SITE.storeKey||'hangeoreum-math-v1',AUTH_KEY='hangeoreum-auth-v1',TKEY='hangeoreum-teacher-v1';
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let AUTH=STANDALONE?null:lsGet(AUTH_KEY,null);if(!AUTH||AUTH.role!=='student'||!AUTH.token)AUTH=null;
const isStudent=()=>!!(AUTH&&AUTH.role==='student');
const storeKey=()=>isStudent()?STORE_KEY+':'+AUTH.sid:STORE_KEY;
let DB={};
function loadDB(){DB=lsGet(storeKey(),{})||{};if(typeof DB!=='object'||Array.isArray(DB))DB={}}
loadDB();
const SYNC={timer:null,busy:false,pulling:false,last:null,err:null,contact:0};
/* 기록이 끝없이 커지지 않게 정리 (서버 저장 한도 300KB) */
function tidyDB(){const M=DB._me;if(M&&M.once&&typeof M.once==='object'){const d=new Date();d.setDate(d.getDate()-60);const cut=d.toISOString().slice(0,10);for(const k in M.once){const m=/^(?:drill|mis|misall|boss):(\d{4}-\d\d-\d\d)/.exec(k);if(m&&m[1]<cut)delete M.once[k]}}
  if(Array.isArray(DB._rev)&&DB._rev.length>50)DB._rev=DB._rev.slice(-50);
  if(DB._calcErrs&&typeof DB._calcErrs==='object'){const ks=Object.keys(DB._calcErrs);if(ks.length>25){ks.sort((a,b)=>(NUM(DB._calcErrs[b].n)-NUM(DB._calcErrs[a].n))||String(DB._calcErrs[b].d||'').localeCompare(String(DB._calcErrs[a].d||''))).slice(25).forEach(k=>delete DB._calcErrs[k])}}
  for(const k in DB){const v=DB[k];if(v&&v.prac&&Array.isArray(v.prac.retry)&&v.prac.retry.length>20)v.prac.retry=v.prac.retry.slice(-20)}}
function markActive(){try{localStorage.setItem('hangeoreum-active',String(Date.now()))}catch(e){}}
function save(){tidyDB();DB._ts=Date.now();lsSet(storeKey(),DB);markActive();if(isStudent()){clearTimeout(SYNC.timer);SYNC.timer=setTimeout(()=>pushDB(),1500)}}
function prog(id){DB[id]=DB[id]||{concept:false,explore:false,steps:0,prac:{solved:0,streak:0,level:1,fails:0,retry:[]}};return DB[id]}


/* ───────── 내 기록: 포인트·배지·복습 (이 기기 전용) ───────── */
function today(d=new Date()){const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())}
function addDays(ds,n){const[y,m,d]=ds.split('-').map(Number);return today(new Date(y,m-1,d+n))}
function me(){DB._me=DB._me||{pts:0,last:null,streak:0,once:{},cnt:{},badges:{}};const M=DB._me;M.once=M.once||{};M.cnt=M.cnt||{};M.badges=M.badges||{};return M}
/* 이번 주(월요일부터) 공부한 날 수. 연속이 끊겨도 주간 기록은 남아요 */
function weekDays(M=me()){const t=today(),[y,m,d]=t.split('-').map(Number),mon=addDays(t,-((new Date(y,m-1,d).getDay()+6)%7));return(Array.isArray(M.days)?M.days:[]).filter(x=>x>=mon&&x<=t).length}
function liveStreak(){const M=me(),t=today();return(M.last===t||M.last===addDays(t,-1))?M.streak:0}
/* why: 포인트가 뜰 때 같이 보여 줄 이유(학생이 무엇을 하면 포인트를 받는지 알게) */
function award(n,onceKey,why){if(onceKey&&/^(face:|floor:|dup:|rule:|net:|reduce|cls|cut|i:)/.test(onceKey))dayBump('explore');const M=me();if(onceKey){if(M.once[onceKey])return false;M.once[onceKey]=1}
  const t=today();if(M.last!==t){M.streak=(M.last===addDays(t,-1))?M.streak+1:1;M.last=t}
  if(!Array.isArray(M.days))M.days=[];if(M.days[M.days.length-1]!==t){M.days.push(t);if(M.days.length>14)M.days=M.days.slice(-14)}
  M.pts+=n;save();updatePill();popPts(n,why);checkBadges();queuePts(n);return true}
function bump(k,n=1){const M=me();M.cnt[k]=(M.cnt[k]||0)+n;save();checkBadges()}
const onceCount=(M,pre)=>Object.keys(M.once).filter(k=>k.startsWith(pre)).length;
const BADGES=[
  {k:'first',nm:'첫걸음',d:'처음으로 포인트 받기',ok:M=>M.pts>0},
  {k:'face5',unit:'solid',nm:'면 모양 탐정',d:'면 목록 5개 완성하기',ok:M=>onceCount(M,'face:')>=5},
  {k:'floor9',unit:'solid',nm:'층 세기 달인',d:'층 세기 9개 도형 모두 끝내기',ok:M=>onceCount(M,'floor:')>=9},
  {k:'regular',unit:'solid',nm:'정다면체 도전자',d:'정이십면체나 정십이면체 끝까지 세기',ok:M=>!!(M.once['floor:ico']||M.once['floor:dod']||M.once['face:ico']||M.once['face:dod'])},
  {k:'nets',unit:'solid',nm:'전개도 박사',d:'전개도 4가지 끝까지 펼치기',ok:M=>onceCount(M,'net:')>=4},
  {k:'solo',nm:'혼자서도 척척',d:'연습에서 ‘단계 없이 도전’까지 오르기',ok:()=>LESSONS.some(l=>DB[l.id]&&DB[l.id].prac&&DB[l.id].prac.level>=2)},
  {k:'review5',nm:'다시 보면 내 것',d:'복습 문제 5개 맞히기',ok:M=>(M.cnt.review||0)>=5},
  {k:'streak3',nm:'꾸준함',d:'3일 연속 공부하기',ok:M=>M.streak>=3},
  {k:'drill5',nm:'계산 근육',d:'오늘의 계산 5번 끝내기',ok:M=>(M.cnt.drill||0)>=5},
  {k:'mission5',nm:'미션 수집가',d:'오늘의 미션 3개를 모두 해낸 날 5일',ok:M=>(M.cnt.misall||0)>=5},
  {k:'boss3',server:true,nm:'보스 사냥꾼',d:'우리 반과 함께 보스 3마리 물리치기',ok:M=>(M.cnt.boss||0)>=3},
  {k:'calc12',nm:'계산 장인',d:'기초 연산 별 12개 모으기',ok:()=>calcStars()>=12},
  {k:'facts36',nm:'구구단 달인',d:'구구단 표 36칸을 모두 익힘으로 만들기',ok:()=>factsKnown()>=36}];
function badgeOn(b){return(!b.unit||OPEN_UNITS.includes(b.unit))&&!(b.server&&STANDALONE)}
function checkBadges(){const M=me();BADGES.forEach(b=>{if(!M.badges[b.k]&&b.ok(M)){M.badges[b.k]=today();save();setTimeout(()=>toast(`배지를 받았어요 · ${b.nm}`),400)}})}
function badgeIcon(i,on){const n=3+(i%4),R=17,c=22;const pts=regPoly(n,R,-Math.PI/2).map(p=>`${(c+p[0]).toFixed(1)},${(c+p[1]).toFixed(1)}`).join(' ');
  return`<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><polygon points="${pts}" fill="${on?FC[i%5]:'#eef0f4'}" stroke="${on?'#1d2640':'#c3c8d2'}" stroke-width="2" stroke-linejoin="round"/>${on?`<text x="22" y="27" text-anchor="middle" font-size="13" font-weight="700" fill="#1d2640" font-family="IBM Plex Sans KR,sans-serif">${n}</text>`:''}</svg>`}
function updatePill(){applyTheme();const P=$('#mePts'),S=$('#meStreak');if(P)P.textContent=me().pts;if(S){const k=liveStreak();S.textContent=k>=2?`${k}일 연속`:`이번 주 ${weekDays()}일`}}
function popPts(n,why){const pill=$('#mePill');if(!pill||n<=0)return;const r=pill.getBoundingClientRect(),k=$$('.ptpop').length;const f=el(`<div class="ptpop${why?' why':''}">+${n}${why?` <small>${why}</small>`:''}</div>`);
  if(why)f.style.right=Math.max(8,innerWidth-r.right)+'px';else f.style.left=(r.left+r.width/2)+'px';f.style.top=(r.bottom+4+k*34)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),why?2400:1100)}
/* 복습 노트: 틀리거나 헤맨 문제를 1·3·7일 뒤에 다시 */
function addReview(g,seed,lid){DB._rev=DB._rev||[];if(DB._rev.some(x=>x.g===g&&x.seed===seed))return;DB._rev.push({g,seed,lid,due:addDays(today(),1),stage:0,added:today()});save()}
function dueReviews(){return(DB._rev||[]).filter(x=>x.due<=today())}
function reviewResult(item,ok){if(ok){item.stage++;if(item.stage>=3){DB._rev=DB._rev.filter(x=>x!==item);bump('mastered')}else item.due=addDays(today(),[1,3,7][item.stage])}else{item.stage=0;item.due=addDays(today(),1)}save()}

/* ───────── 3D 메시 ───────── */
function faceNormal(V,f,c){let nx=0,ny=0,nz=0;for(let i=0;i<f.length;i++){const p=V[f[i]],q=V[f[(i+1)%f.length]];nx+=(p[1]-q[1])*(p[2]+q[2]);ny+=(p[2]-q[2])*(p[0]+q[0]);nz+=(p[0]-q[0])*(p[1]+q[1])}
  const L=Math.hypot(nx,ny,nz)||1;nx/=L;ny/=L;nz/=L;let fx=0,fy=0,fz=0;f.forEach(i=>{fx+=V[i][0];fy+=V[i][1];fz+=V[i][2]});fx/=f.length;fy/=f.length;fz/=f.length;
  if(c&&(fx-c[0])*nx+(fy-c[1])*ny+(fz-c[2])*nz<0){nx=-nx;ny=-ny;nz=-nz}return[nx,ny,nz]}
function makeMesh(V,F,o={}){
  const m={V,F,smooth:o.smooth||F.map(()=>false),hard:new Set(o.hard||[]),curved:!!o.curved};
  const em=new Map();
  F.forEach((f,fi)=>{for(let i=0;i<f.length;i++){const a=f[i],b=f[(i+1)%f.length];const k=Math.min(a,b)+'-'+Math.max(a,b);if(!em.has(k))em.set(k,{a:Math.min(a,b),b:Math.max(a,b),k,f:[]});em.get(k).f.push(fi)}});
  m.E=[...em.values()];
  const c=[0,0,0];V.forEach(p=>{c[0]+=p[0];c[1]+=p[1];c[2]+=p[2]});m.c=c.map(x=>x/V.length);
  m.N=F.map(f=>faceNormal(V,f,m.c));
  m.R=Math.max(...V.map(p=>Math.hypot(p[0]-m.c[0],p[1]-m.c[1],p[2]-m.c[2])));
  return m;
}
function regPoly(n,R,rot){rot=rot??(-Math.PI/2+Math.PI/n);const p=[];for(let k=0;k<n;k++){const t=rot+TAU*k/n;p.push([R*Math.cos(t),R*Math.sin(t)])}return p}
const range=n=>[...Array(n).keys()];
function prism(P,h,smooth){const n=P.length,V=[...P.map(p=>[p[0],p[1],0]),...P.map(p=>[p[0],p[1],h])];const F=[range(n).reverse(),range(n).map(i=>i+n)];const sm=[false,false];
  for(let i=0;i<n;i++){const j=(i+1)%n;F.push([i,j,j+n,i+n]);sm.push(!!smooth)}const m=makeMesh(V,F,{smooth:sm,curved:smooth});m.base=[0,1];return m}
function pyramid(P,h,smooth){const n=P.length;let cx=0,cy=0;P.forEach(p=>{cx+=p[0];cy+=p[1]});const V=[...P.map(p=>[p[0],p[1],0]),[cx/n,cy/n,h]];const F=[range(n).reverse()];const sm=[false];
  for(let i=0;i<n;i++){F.push([i,(i+1)%n,n]);sm.push(!!smooth)}const m=makeMesh(V,F,{smooth:sm,curved:smooth});m.base=[0];return m}
function frustum(P,k,h){const n=P.length;let cx=0,cy=0;P.forEach(p=>{cx+=p[0];cy+=p[1]});cx/=n;cy/=n;
  const V=[...P.map(p=>[p[0],p[1],0]),...P.map(p=>[cx+k*(p[0]-cx),cy+k*(p[1]-cy),h])];const F=[range(n).reverse(),range(n).map(i=>i+n)];
  for(let i=0;i<n;i++){const j=(i+1)%n;F.push([i,j,j+n,i+n])}const m=makeMesh(V,F);m.base=[0,1];return m}
function octahedron(R){const V=[[R,0,0],[-R,0,0],[0,R,0],[0,-R,0],[0,0,R],[0,0,-R]];const F=[];
  [0,1].forEach(x=>[2,3].forEach(y=>[4,5].forEach(z=>F.push([x,y,z]))));return makeMesh(V,F)}
function sphere(R,nu=30,nv=16){const V=[[0,0,R]];for(let i=1;i<nv;i++){const ph=Math.PI*i/nv;for(let j=0;j<nu;j++){const th=TAU*j/nu;V.push([R*Math.sin(ph)*Math.cos(th),R*Math.sin(ph)*Math.sin(th),R*Math.cos(ph)])}}V.push([0,0,-R]);
  const S=V.length-1,id=(i,j)=>1+(i-1)*nu+(j%nu),F=[];
  for(let j=0;j<nu;j++)F.push([0,id(1,j),id(1,j+1)]);
  for(let i=1;i<nv-1;i++)for(let j=0;j<nu;j++)F.push([id(i,j),id(i+1,j),id(i+1,j+1),id(i,j+1)]);
  for(let j=0;j<nu;j++)F.push([S,id(nv-1,j+1),id(nv-1,j)]);
  const eq=nv/2,hard=[];for(let j=0;j<nu;j++){const a=id(eq,j),b=id(eq,j+1);hard.push(Math.min(a,b)+'-'+Math.max(a,b))}
  return makeMesh(V,F,{smooth:F.map(()=>true),hard,curved:true})}

function icosahedron(e=1.1){const r=e/(2*Math.sin(Math.PI/5)),dz=Math.sqrt(e*e-(2*r*Math.sin(Math.PI/10))**2),dz2=Math.sqrt(e*e-r*r);
  const V=[[0,0,dz/2+dz2]];for(let k=0;k<5;k++){const t=TAU*k/5;V.push([r*Math.cos(t),r*Math.sin(t),dz/2])}for(let k=0;k<5;k++){const t=TAU*k/5+Math.PI/5;V.push([r*Math.cos(t),r*Math.sin(t),-dz/2])}V.push([0,0,-dz/2-dz2]);
  const U=k=>1+(k%5),D=k=>6+(k%5),F=[];for(let k=0;k<5;k++){F.push([0,U(k),U(k+1)]);F.push([U(k),D(k),U(k+1)]);F.push([D(k),D(k+1),U(k+1)]);F.push([11,D(k+1),D(k)])}return makeMesh(V,F)}
function dodecahedron(){const I=icosahedron(1.65);const C=I.F.map(f=>{const c=[0,0,0];f.forEach(i=>{for(let q=0;q<3;q++)c[q]+=I.V[i][q]/3});return c});
  const F=I.V.map((v,vi)=>{const L=Math.hypot(...v),n=v.map(x=>x/L);let u=Math.abs(n[0])<0.9?[1,0,0]:[0,1,0];const d=u[0]*n[0]+u[1]*n[1]+u[2]*n[2];u=u.map((x,q)=>x-d*n[q]);const ul=Math.hypot(...u);u=u.map(x=>x/ul);
    const w=[n[1]*u[2]-n[2]*u[1],n[2]*u[0]-n[0]*u[2],n[0]*u[1]-n[1]*u[0]];
    const fs=I.F.map((f,fi)=>f.includes(vi)?fi:-1).filter(x=>x>=0);
    return fs.sort((a,b)=>{const A=C[a].map((x,q)=>x-v[q]),B=C[b].map((x,q)=>x-v[q]);return Math.atan2(A[0]*w[0]+A[1]*w[1]+A[2]*w[2],A[0]*u[0]+A[1]*u[1]+A[2]*u[2])-Math.atan2(B[0]*w[0]+B[1]*w[1]+B[2]*w[2],B[0]*u[0]+B[1]*u[1]+B[2]*u[2])})});
  return makeMesh(C,F)}

/* 입체도형 목록 */
const SOLIDS={
  cube:{name:'정육면체',poly:true,mk:()=>prism(regPoly(4,1.6/Math.SQRT2,Math.PI/4),1.6)},
  p3:{name:'삼각기둥',poly:true,mk:()=>prism(regPoly(3,1.0),2.3)},
  y4:{name:'사각뿔',poly:true,mk:()=>pyramid(regPoly(4,1.2,Math.PI/4),1.7)},
  p5:{name:'오각기둥',poly:true,mk:()=>prism(regPoly(5,1.05),1.7)},
  f4:{name:'사각뿔대',poly:true,mk:()=>frustum(regPoly(4,1.25,Math.PI/4),.55,1.3)},
  tet:{name:'정사면체',poly:true,mk:()=>pyramid(regPoly(3,1.25),1.25*Math.SQRT2)},
  oct:{name:'정팔면체',poly:true,mk:()=>octahedron(1.3)},
  y6:{name:'육각뿔',poly:true,mk:()=>pyramid(regPoly(6,1.15),1.7)},
  p6:{name:'육각기둥',poly:true,mk:()=>prism(regPoly(6,1),1.7)},
  f5:{name:'오각뿔대',poly:true,mk:()=>frustum(regPoly(5,1.2),.55,1.3)},
  cyl:{name:'원기둥',poly:false,why:'옆면이 굽은 면(곡면)이라서 다면체가 아니에요.',mk:()=>prism(regPoly(48,1),1.8,true)},
  cone:{name:'원뿔',poly:false,why:'밑면이 원이고 옆면이 곡면이라서 다면체가 아니에요.',mk:()=>pyramid(regPoly(48,1.1),1.8,true)},
  ico:{name:'정이십면체',poly:true,mk:()=>icosahedron(1.1)},
  dod:{name:'정십이면체',poly:true,mk:()=>dodecahedron()},
  sph:{name:'구',poly:false,why:'전체가 곡면이라서 다면체가 아니에요.',mk:()=>sphere(1.2)},
};
const TYPE={prism:{nm:'각기둥',F:n=>n+2,E:n=>3*n,V:n=>2*n,fF:'n+2',fE:'3n',fV:'2n',side:'직사각형',mk:n=>prism(regPoly(n,1.05),Math.max(1.7,2*1.05*Math.sin(Math.PI/n)*1.4))},
  pyramid:{nm:'각뿔',F:n=>n+1,E:n=>2*n,V:n=>n+1,fF:'n+1',fE:'2n',fV:'n+1',side:'삼각형',mk:n=>pyramid(regPoly(n,1.15),1.75)},
  frustum:{nm:'각뿔대',F:n=>n+2,E:n=>3*n,V:n=>2*n,fF:'n+2',fE:'3n',fV:'2n',side:'사다리꼴',mk:n=>frustum(regPoly(n,1.2),.55,1.3)}};
const PART={F:'면',E:'모서리',V:'꼭짓점'};

/* ───────── 뷰어(캔버스 3D) ───────── */
const VIEWERS=new Set();
const HI='#ffe266';
class Viewer{
  constructor(canvas,o={}){
    this.cv=canvas;this.ctx=canvas.getContext('2d');this.o=o;
    this.yaw=o.yaw??-0.55;this.pitch=o.pitch??0.42;this.auto=!!o.auto&&!reduced;this.style=o.style||'shade';this.pad=o.pad??0.40;
    this.scene=[];this.marks={f:new Set(),e:new Set(),v:new Set()};this.mode=null;this.dirty=true;this.userMoved=false;
    if(o.interactive!==false)this._bind();
    this._resize();VIEWERS.add(this);
    if('ResizeObserver' in window){this.ro=new ResizeObserver(()=>this._resize());this.ro.observe(canvas)}
    this.visible=true;if('IntersectionObserver' in window){this.io=new IntersectionObserver(es=>{es.forEach(en=>{this.visible=en.isIntersecting;if(this.visible)this.dirty=true})});this.io.observe(canvas)}
  }
  flyTo(yaw,pitch,ms=450){let d=yaw-this.yaw;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;this.anim={y0:this.yaw,p0:this.pitch,dy:d,dp:pitch-this.pitch,t0:performance.now(),ms:reduced?1:ms};this.userMoved=true}
  stepAnim(){const A=this.anim;if(!A)return;let t=Math.min(1,(performance.now()-A.t0)/A.ms);const e=t*t*(3-2*t);this.yaw=A.y0+A.dy*e;this.pitch=A.p0+A.dp*e;this.dirty=true;if(t>=1)this.anim=null}
  _resize(){const d=window.devicePixelRatio||1;const w=this.cv.clientWidth||300,h=this.cv.clientHeight||300;if(w===this.w&&h===this.h)return;this.w=w;this.h=h;this.cv.width=Math.round(w*d);this.cv.height=Math.round(h*d);this.ctx.setTransform(d,0,0,d,0,0);this.dirty=true;this.draw()}
  setScene(sc,o={}){this.scene=sc;this.cen=o.center||sc[0].mesh.c;this.R=o.R||Math.max(...sc.map(s=>s.mesh.R));this.dirty=true}
  setMesh(m){this.marks={f:new Set(),e:new Set(),v:new Set()};this.setScene([{mesh:m}])}
  get scale(){return Math.min(this.w,this.h)*this.pad/(this.R||1)}
  proj(p){const a=this.yaw,b=this.pitch,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);const c=this.cen||[0,0,0];
    const x=p[0]-c[0],y=p[1]-c[1],z=p[2]-c[2];const x1=x*ca-y*sa,y1=x*sa+y*ca;const s=this.scale;
    return[this.w/2+(this.o.dx||0)+s*x1,this.h/2+(this.o.dy||0)-s*(y1*sb+z*cb),-y1*cb+z*sb]}
  facing(n){const y1=n[0]*Math.sin(this.yaw)+n[1]*Math.cos(this.yaw);return -y1*Math.cos(this.pitch)+n[2]*Math.sin(this.pitch)}
  _bind(){
    const cv=this.cv;let st=null;cv.style.touchAction='none';  /* 폰: 그림 위에서는 스크롤 대신 회전 */
    cv.addEventListener('pointerdown',e=>{this.touch=e.pointerType==='touch';st={x:e.clientX,y:e.clientY,yaw:this.yaw,pitch:this.pitch,moved:false};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
    cv.addEventListener('pointermove',e=>{if(!st)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(!st.moved&&Math.hypot(dx,dy)>6){st.moved=true;this.dragging=true}
      if(st.moved){this.yaw=st.yaw+dx*0.011;this.pitch=Math.max(-1.57,Math.min(1.57,st.pitch+dy*0.011));this.anim=null;this.userMoved=true;this.dirty=true}});
    const end=e=>{if(!st)return;if(!st.moved&&this.mode){const r=cv.getBoundingClientRect();this.tap(e.clientX-r.left,e.clientY-r.top)}st=null;this.dragging=false};
    cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',()=>{st=null;this.dragging=false});
  }
  tap(x,y){
    const m=this.scene[0].mesh,P=m.V.map(v=>this.proj(v));let hit=null;
    if(this.mode==='f'){m.F.forEach((f,i)=>{if(this.facing(m.N[i])<=1e-6)return;if(inPoly(x,y,f.map(k=>P[k])))hit=i});
      }
    else if(this.mode==='v'){let best=1e9;P.forEach((p,i)=>{const d=Math.hypot(p[0]-x,p[1]-y)-p[2]*2;if(Math.hypot(p[0]-x,p[1]-y)<(this.touch?32:24)&&d<best){best=d;hit=i}})}
    else if(this.mode==='e'){let best=1e9;m.E.forEach(e=>{const A=P[e.a],B=P[e.b];const d=segDist(x,y,A,B);if(d<(this.touch?22:16)){const sc=d-(A[2]+B[2]);if(sc<best){best=sc;hit=e.k}}})}
    if(this.onHit){if(hit!=null)this.onHit(this.mode,hit);this.dirty=true;return}
    if(hit!=null)toggle(this.marks[this.mode],hit);
    this.dirty=true;if(hit!=null&&this.onMark)this.onMark();
  }
  draw(){
    if(!this.w)return;if(!this.scene.length&&!this.o.draw)return;const ctx=this.ctx;ctx.clearRect(0,0,this.w,this.h);
    if(this.o.draw){this.o.draw(ctx,this);}
    else{this.scene.forEach((s,i)=>{this.drawMesh(s.mesh,s.off,s.st||{});if(this.o.between)this.o.between(ctx,this,i)})}
    if(this.o.after)this.o.after(ctx,this);
  }
  drawMesh(m,off=[0,0,0],st={}){
    const ctx=this.ctx,tb=this.style==='textbook';
    const P=m.V.map(v=>this.proj([v[0]+off[0],v[1]+off[1],v[2]+off[2]]));
    const fr=m.N.map(n=>this.facing(n)>1e-6);
    const L=[-0.45,-0.55,0.7];
    m.F.forEach((f,i)=>{if(!fr[i])return;ctx.beginPath();f.forEach((k,j)=>{const p=P[k];j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.closePath();
      let col;
      const hc=this.fcol&&this.fcol(i);
      if(hc)col=hc;
      else if(this.marks.f.has(i)&&this.mode)col=HI;
      else if(tb)col='#ffffff';
      else{const n=m.N[i];const lam=Math.max(0,n[0]*L[0]+n[1]*L[1]+n[2]*L[2]);const base=st.tint||[232,237,247];const k=0.86+0.14*lam;col=`rgb(${base.map(c=>Math.round(c*k+ (255-c)*0.0)).join(',')})`;
        col=`rgb(${base.map(c=>Math.min(255,Math.round(c*k+40*lam))).join(',')})`}
      ctx.fillStyle=col;ctx.fill();if(m.smooth[i]&&!tb){ctx.strokeStyle=col;ctx.lineWidth=.8;ctx.stroke()}});
    const vis=[],hid=[];
    m.E.forEach(e=>{const sm=e.f.every(fi=>m.smooth[fi]);const hard=!sm||m.hard.has(e.k);const any=e.f.some(fi=>fr[fi]);
      if(hard)(any?vis:hid).push(e);else if(e.f.length===2&&fr[e.f[0]]!==fr[e.f[1]])vis.push(e)});
    const lw=tb?2.2:2.4;
    if(this.ecol){ctx.lineCap='round';ctx.lineWidth=11;m.E.forEach(e=>{const c=this.ecol(e.k);if(c){ctx.strokeStyle=c;line(ctx,P[e.a],P[e.b])}})}
    else if(this.mode==='e'){ctx.lineCap='round';ctx.strokeStyle='rgba(255,210,40,.95)';ctx.lineWidth=11;m.E.forEach(e=>{if(this.marks.e.has(e.k))line(ctx,P[e.a],P[e.b])})}
    if(st.noHidden!==true){ctx.setLineDash([5,5]);ctx.strokeStyle=tb?'#222':'#3b4256';ctx.lineWidth=tb?1.5:1.5;hid.forEach(e=>line(ctx,P[e.a],P[e.b]));ctx.setLineDash([])}
    ctx.strokeStyle=st.stroke||'#151a28';ctx.lineWidth=lw;ctx.lineJoin='round';ctx.lineCap='round';vis.forEach(e=>line(ctx,P[e.a],P[e.b]));
    if(this.mode==='v'){P.forEach((p,i)=>{const front=m.F.some((f,fi)=>fr[fi]&&f.includes(i));ctx.beginPath();const vc=this.vcol&&this.vcol(i);ctx.arc(p[0],p[1],(vc||this.marks.v.has(i))?8.5:5.5,0,TAU);
      ctx.fillStyle=vc||(this.marks.v.has(i)?HI:(front?'#151a28':'#fff'));ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle='#151a28';ctx.stroke()})}
    return P;
  }
}
function toggle(s,k){s.has(k)?s.delete(k):s.add(k)}
function line(ctx,A,B){ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke()}
function inPoly(x,y,pts){let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))c=!c}return c}
function segDist(x,y,A,B){const dx=B[0]-A[0],dy=B[1]-A[1];const L=dx*dx+dy*dy||1;let t=((x-A[0])*dx+(y-A[1])*dy)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(A[0]+t*dx-x,A[1]+t*dy-y)}
(function loop(){for(const v of VIEWERS){if(!v.cv.isConnected){VIEWERS.delete(v);v.ro&&v.ro.disconnect();v.io&&v.io.disconnect();continue}
  if(v.tick)v.tick();v.stepAnim();if(!v.visible)continue;if(v.auto&&!v.dragging&&!v.userMoved){v.yaw+=0.006;v.dirty=true}if(v.dirty){v.dirty=false;v.draw()}}requestAnimationFrame(loop)})();

/* 교과서 글씨 */
function cssW(ctx){return ctx.canvas.clientWidth||ctx.canvas.width}
function mtext(ctx,text,x,y,o={}){ctx.save();const size=o.size||21;ctx.font=`${o.italic?'italic ':''}${size}px "Times New Roman",Times,serif`;ctx.textAlign=o.align||'center';ctx.textBaseline='middle';
  if(!o.align||o.align==='center'){const hw=ctx.measureText(text).width/2+4,W=cssW(ctx);x=Math.min(Math.max(x,hw),W-hw)}
  ctx.lineWidth=6;ctx.strokeStyle='#fff';ctx.lineJoin='round';ctx.strokeText(text,x,y);ctx.fillStyle=o.color||'#111';ctx.fillText(text,x,y);ctx.restore()}
function ktext(ctx,text,x,y,o={}){ctx.save();const size=o.size||16;ctx.font=`${o.bold?'700 ':''}${size}px "IBM Plex Sans KR","Apple SD Gothic Neo",sans-serif`;ctx.textAlign=o.align||'center';ctx.textBaseline='middle';
  if(o.halo!==false){ctx.lineWidth=5;ctx.strokeStyle='#fff';ctx.lineJoin='round';ctx.strokeText(text,x,y)}ctx.fillStyle=o.color||'#1d2640';ctx.fillText(text,x,y);ctx.restore()}
function chip(ctx,text,x,y,o={}){ctx.save();const it=!!o.italic,size=o.size||(it?22:17);
  ctx.font=it?`italic ${size}px "Times New Roman",Times,serif`:`700 ${size}px "IBM Plex Sans KR","Apple SD Gothic Neo",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  const w=ctx.measureText(text).width,pw=w/2+8,ph=size/2+5;{const W=cssW(ctx);x=Math.min(Math.max(x,pw+2),W-pw-2)}ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x-pw,y-ph,pw*2,ph*2,8);else ctx.rect(x-pw,y-ph,pw*2,ph*2);
  ctx.fillStyle=o.bg||'#fff';ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle=o.border||'#2a4d9e';ctx.stroke();ctx.fillStyle=o.color||'#1d2640';ctx.fillText(text,x,y+1);ctx.restore();return pw*2}
const lab=(ctx,text,x,y,o={})=>o.chip?chip(ctx,text,x,y,o):mtext(ctx,text,x,y,o);
function edgeLabel(ctx,v,a,b,text,o={}){const A=v.proj(a),B=v.proj(b);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;let nx=-(B[1]-A[1]),ny=B[0]-A[0];const L=Math.hypot(nx,ny)||1;nx/=L;ny/=L;
  const C=o.from?v.proj(o.from):v.proj(v.cen);if((mx-C[0])*nx+(my-C[1])*ny<0){nx=-nx;ny=-ny}if(o.flip){nx=-nx;ny=-ny}
  ctx.font=o.chip?'700 17px "IBM Plex Sans KR",sans-serif':'21px "Times New Roman",serif';const tw=ctx.measureText(text).width+(o.chip?16:0);const off=(o.off??14)+Math.abs(nx)*tw/2+Math.abs(ny)*(o.chip?14:8);lab(ctx,text,mx+nx*off,my+ny*off,o)}

/* 교과서 형식 정지 그림 */
/* f.visual: 1~3단계용(색·회전·이름표), 아니면 4단계 연습용 교과서 형식 */
function figure(canvas,f){
  const vis=!!f.visual;
  const v=new Viewer(canvas,{style:vis?'shade':'textbook',interactive:vis,chip:vis,yaw:f.yaw??-0.5,pitch:f.pitch??0.36,pad:f.pad??0.36,dy:f.dy||0,
    after:(ctx,vw)=>{(f.labels||[]).forEach(L=>edgeLabel(ctx,vw,L[0],L[1],L[2],Object.assign({chip:vis},L[3]||{})));if(f.after)f.after(ctx,vw)}});
  v.setScene([{mesh:f.mesh,st:f.st||(vis?{tint:[236,239,245]}:{})}],{R:f.R,center:f.center});return v}
const HL_BASE='#9fbcf2',HL_SIDE='#f7c97f';
function applyHl(v,m,hl){v.fcol=null;v.ecol=null;v.vcol=null;v.mode=null;v.dirty=true;if(!hl)return;
  const base=m.base||[],side=m.F.map((f,i)=>i).filter(i=>!base.includes(i)),top=base.length>1?[base[1]]:base.slice(0,1);
  const keysOf=fs=>{const K=new Set();fs.forEach(fi=>{const f=m.F[fi];f.forEach((a,j)=>{const b=f[(j+1)%f.length];K.add(Math.min(a,b)+'-'+Math.max(a,b))})});return K};
  if(hl==='base')v.fcol=i=>base.includes(i)?HL_BASE:null;
  else if(hl==='base1')v.fcol=i=>top.includes(i)?HL_BASE:null;
  else if(hl==='side')v.fcol=i=>side.includes(i)?HL_SIDE:null;
  else if(hl==='all')v.fcol=i=>base.includes(i)?HL_BASE:HL_SIDE;
  else if(hl==='E')v.ecol=()=>'#e08a1e';
  else if(hl==='A')v.fcol=()=>HL_SIDE;
  else if(hl.startsWith('V:')){const t=+hl.slice(2);v.mode='v';v.vcol=i=>i===t?'#e08a1e':null;v.fcol=i=>m.F[i].includes(t)?HL_SIDE:null}
  else if(hl==='baseEdge'){const K=keysOf(top);v.ecol=k=>K.has(k)?'rgba(42,77,158,.8)':null;v.fcol=i=>top.includes(i)?'#e6eefc':null}
  else if(hl[0]==='F'){const kind=hl[1],I=floorInfo(m),gi=(k,id)=>I.G[k].findIndex(g=>g.ids.includes(id));
    if(kind==='v'){v.mode='v';v.vcol=i=>GC[gi('v',i)%5]}if(kind==='e')v.ecol=k=>GC[gi('e',k)%5]+'cc';if(kind==='f')v.fcol=i=>FC[gi('f',i)%5]}}

/* ───────── 전개도 펼치기 ───────── */
function buildUnfold(P,h,t,smooth){
  const n=P.length;const[x0,y0]=P[0];const ang=Math.atan2(P[1][1]-y0,P[1][0]-x0);const c=Math.cos(-ang),s=Math.sin(-ang);
  const Q=P.map(([x,y])=>{x-=x0;y-=y0;return[x*c-y*s,x*s+y*c]});
  const Ls=[],ext=[];for(let i=0;i<n;i++){const a=Q[i],b=Q[(i+1)%n],d=Q[(i+2)%n];Ls.push(Math.hypot(b[0]-a[0],b[1]-a[1]));let e=Math.atan2(d[1]-b[1],d[0]-b[0])-Math.atan2(b[1]-a[1],b[0]-a[0]);while(e>Math.PI)e-=TAU;while(e<=-Math.PI)e+=TAU;ext.push(e)}
  let px=0,py=0,phi=0;const faces=[];
  for(let i=0;i<n;i++){const nx=px+Ls[i]*Math.cos(phi),ny=py+Ls[i]*Math.sin(phi);faces.push({kind:'side',pts:[[px,py,0],[nx,ny,0],[nx,ny,h],[px,py,h]],sl:smooth&&i>0,sr:smooth&&i<n-1});px=nx;py=ny;phi+=ext[i]*(1-t)}
  const th=t*Math.PI/2,ct=Math.cos(th),st=Math.sin(th);
  faces.push({kind:'base',pts:Q.map(([u,w])=>[u,w*ct,-w*st])});
  faces.push({kind:'base',pts:Q.map(([u,w])=>[u,w*ct,h+w*st])});
  return{faces,perim:Ls.reduce((a,b)=>a+b,0),L0:Ls[0],maxW:Math.max(...Q.map(q=>q[1]))}}
function bbox(faces){const mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];faces.forEach(f=>f.pts.forEach(p=>{for(let i=0;i<3;i++){mn[i]=Math.min(mn[i],p[i]);mx[i]=Math.max(mx[i],p[i])}}));return{c:mn.map((v,i)=>(v+mx[i])/2),r:Math.hypot(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/2}}
function unfoldViewer(canvas,o){
  const U={t:o.t??0,shape:o.shape};
  const v=new Viewer(canvas,{yaw:-0.6,pitch:0.42,pad:o.pad||0.6,draw:(ctx,vw)=>drawUnfold(ctx,vw,U,o)});
  U.set=sh=>{U.shape=sh;const a=buildUnfold(sh.P,sh.h,0,sh.smooth),b=buildUnfold(sh.P,sh.h,1,sh.smooth);U.b0=bbox(a.faces);U.b1=bbox(b.faces);v.R=U.b1.r;v.cen=U.b0.c;v.scene=[{mesh:{c:U.b0.c,R:U.b1.r}}];v.dirty=true};
  U.set(o.shape);U.v=v;return U}
function drawUnfold(ctx,vw,U,o){
  if(!U.b0)return;const sh=U.shape,t=U.t;const B=buildUnfold(sh.P,sh.h,t,sh.smooth);
  const e=t*t*(3-2*t);vw.cen=U.b0.c.map((c,i)=>c+(U.b1.c[i]-c)*e);
  if(!vw.userMoved){vw.yaw=-0.6*(1-e);vw.pitch=0.42*(1-e)+0.02*e}
  const items=B.faces.map(f=>{const P=f.pts.map(p=>vw.proj(p));const d=P.reduce((a,p)=>a+p[2],0)/P.length;return{f,P,d}}).sort((a,b)=>a.d-b.d);
  items.forEach(({f,P})=>{ctx.beginPath();P.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    ctx.fillStyle=f.kind==='base'?(o.textbook?'#fff':'#e6eefc'):(o.textbook?'#fff':'#fff4c2');ctx.fill();
    ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.2;ctx.strokeStyle='#151a28';
    if(f.kind==='base'){ctx.stroke()}else{line(ctx,P[2],P[3]);if(!f.sl)line(ctx,P[3],P[0]);if(!f.sr)line(ctx,P[1],P[2]);
      ctx.strokeStyle=o.textbook?'#151a28':'#2a4d9e';ctx.lineWidth=o.textbook?2.2:4;line(ctx,P[0],P[1])}});
  if(!o.textbook){const bb=items.find(i=>i.f===B.faces[B.faces.length-2]);ctx.strokeStyle='#2a4d9e';ctx.lineWidth=4;ctx.beginPath();bb.P.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.stroke()}
  if(t>0.97&&o.areas&&sh.areas){const fmtA=x=>{const r=Math.round(x*100)/100;return String(r)};
    B.faces.forEach((f,fi)=>{const P=f.pts;if(f.kind==='side'){if(sh.smooth)return;const L=Math.hypot(P[1][0]-P[0][0],P[1][1]-P[0][1],P[1][2]-P[0][2]);const c=vw.proj([(P[0][0]+P[1][0])/2,(P[0][1]+P[2][1])/2,sh.h/2]);chip(ctx,fmtA(L*sh.h),c[0],c[1],{size:14,bg:'#fff',border:'#e08a1e'})}
      else{let cx=0,cy=0,cz=0;P.forEach(p=>{cx+=p[0];cy+=p[1];cz+=p[2]});const c=vw.proj([cx/P.length,cy/P.length,cz/P.length]);chip(ctx,sh.areas.base,c[0],c[1],{size:14,bg:'#fff',border:'#2a4d9e'})}});
    if(sh.smooth){const c=vw.proj([B.perim/2,0,sh.h*0.72]);chip(ctx,sh.areas.lateral,c[0],c[1],{size:14,bg:'#fff',border:'#e08a1e'})}}
  if(t>0.97&&o.labels!==false){
    const A=vw.proj([0,0,0]),Bp=vw.proj([B.perim,0,0]),Tp=vw.proj([B.perim,0,sh.h]);
    ctx.strokeStyle='#2a4d9e';ctx.lineWidth=1.6;
    if(sh.inside){const y=A[1]-12;arrow(ctx,[A[0]+4,y],[Bp[0]-4,y]);ktext(ctx,sh.perimLabel,(A[0]+Bp[0])/2,(A[1]+Tp[1])/2,{color:'#2a4d9e',bold:true,size:16})}
    else{const y=A[1]+16;arrow(ctx,[A[0],y],[Bp[0],y]);const lx=(vw.proj([B.L0,0,0])[0]+Bp[0])/2;ktext(ctx,sh.perimLabel||'밑면의 둘레',lx,y+18,{color:'#2a4d9e',bold:true,size:16})}
    const x=Bp[0]+16;arrow(ctx,[x,Bp[1]],[x,Tp[1]]);
    if(sh.hItalic)mtext(ctx,sh.hLabel,x+16,(Bp[1]+Tp[1])/2,{italic:true,size:22});else ktext(ctx,sh.hLabel||'높이',x+10,(Bp[1]+Tp[1])/2,{align:'left',bold:true,size:16});
  }
}
function arrow(ctx,A,B){line(ctx,A,B);const a=Math.atan2(B[1]-A[1],B[0]-A[0]);[[A,a+Math.PI],[B,a]].forEach(([P,an])=>{ctx.beginPath();ctx.moveTo(P[0],P[1]);ctx.lineTo(P[0]-9*Math.cos(an-0.4),P[1]-9*Math.sin(an-0.4));ctx.moveTo(P[0],P[1]);ctx.lineTo(P[0]-9*Math.cos(an+0.4),P[1]-9*Math.sin(an+0.4));ctx.stroke()})}
const UNF={
  tri:{name:'삼각기둥',areas:{base:'6',sum:'6 + 6 + 20 + 25 + 15 = 72'},P:[[0,0],[4,0],[0,3]],h:5,info:'밑면: 세 변이 3 cm, 4 cm, 5 cm인 직각삼각형 · 높이 5 cm',perim:'3+4+5 = 12 (cm)',lat:'12 × 5 = 60 (cm²)'},
  box:{name:'직육면체',areas:{base:'12',sum:'12 + 12 + 20 + 15 + 20 + 15 = 94'},P:[[0,0],[4,0],[4,3],[0,3]],h:5,info:'밑면: 가로 4 cm, 세로 3 cm인 직사각형 · 높이 5 cm',perim:'4+3+4+3 = 14 (cm)',lat:'14 × 5 = 70 (cm²)'},
  pent:{name:'오각기둥',areas:{base:'밑넓이',sum:'(밑넓이) × 2 + 10 × 5'},P:regPoly(5,1.7),h:5,info:'밑면: 한 변이 2 cm인 정오각형 · 높이 5 cm',perim:'2 × 5 = 10 (cm)',lat:'10 × 5 = 50 (cm²)'},
  cyl:{name:'원기둥',areas:{base:'4π',lateral:'20π',sum:'4π + 4π + 20π = 28π'},P:regPoly(64,2),h:5,smooth:true,info:'밑면: 반지름이 2 cm인 원 · 높이 5 cm',perim:'2 × π × 2 = 4π (cm)',lat:'4π × 5 = 20π (cm²)'},
};
UNF.pent.P=(()=>{const s=2,R=s/(2*Math.sin(Math.PI/5));return regPoly(5,R)})();

/* ───────── 용어 사전 ───────── */
const TERMS={
  '다각형':{k:'초등 · 평면도형',b:`<p>선분으로만 둘러싸인 평면도형이에요. 변이 3개면 삼각형, 4개면 사각형, ….</p><p>원은 굽은 선(곡선)이 있으니까 다각형이 <b>아니에요</b>.</p>`,fig:'polys'},
  'n각형':{k:'다각형',b:`<p>변이 <span class="math">n</span>개인 다각형이에요. 변이 <span class="math">n</span>개면 꼭짓점도 <span class="math">n</span>개예요.</p><p>예) 오각형: 변 5개, 꼭짓점 5개</p>`},
  '입체도형':{k:'초등 · 도형',b:`<p>공간을 차지하는 도형이에요. 상자, 주사위, 캔처럼 손으로 쥘 수 있는 모양을 떠올리세요.</p><p>종이 위에 그려지는 ${T('평면도형')}과 비교해 보세요.</p>`,fig:'solid'},
  '평면도형':{k:'초등 · 도형',b:`<p>한 평면 위에 있는 도형이에요. 삼각형, 사각형, 원처럼 종이 위에 납작하게 그려져요. 두께가 없어요.</p><p>상자나 캔 같은 ${T('입체도형')}과 비교해 보세요.</p>`,fig:'flat'},
  '곡면':{k:'입체도형',b:`<p>평평하지 않고 둥글게 굽은 면이에요. 캔의 옆면, 공의 겉면이 곡면이에요.</p><p>곡면이 하나라도 있으면 ${T('다각형')}으로만 둘러싸인 게 아니니 다면체가 아니에요.</p>`},
  '합동':{k:'도형',b:`<p>모양과 크기가 똑같아서 완전히 포개어지는 두 도형을 서로 합동이라고 해요.</p><p>각기둥의 두 밑면은 합동이에요.</p>`},
  '평행':{k:'도형',b:`<p>두 직선(또는 두 평면)을 아무리 늘여도 만나지 않을 때 평행하다고 해요.</p><p>각기둥의 두 밑면은 위아래로 마주 보며 평행해요.</p>`},
  '사다리꼴':{k:'초등 · 사각형',b:`<p>마주 보는 한 쌍의 변이 서로 ${T('평행')}한 사각형이에요.</p>`,fig:'trap'},
  '넓이':{k:'초등 · 측정',b:`<p>평면도형이 차지하는 크기예요. 한 변이 1 cm인 정사각형(1 cm²)이 몇 개 들어가는지로 나타내요.</p><p>가장 기본은 ${T('직사각형의 넓이')}예요.</p>`,fig:'grid'},
  '직사각형의 넓이':{k:'초등 · 넓이',b:`<p class="formula">(가로) × (세로)</p><p>가로 4 cm, 세로 3 cm이면 1 cm² 정사각형이 4개씩 3줄 → 12 cm²</p>`,fig:'grid'},
  '삼각형의 넓이':{k:'초등 · 넓이',b:`<p class="formula">(밑변) × (높이) ÷ 2</p><p>직사각형을 대각선으로 자른 절반이에요. 직각삼각형은 직각을 낀 두 변을 곱해서 2로 나누면 돼요.</p>`,fig:'tri'},
  '원주율':{k:'6학년 · 원',b:`<p>원의 둘레가 지름의 몇 배인지 나타내는 수로, 약 3.14예요. 중학교에서는 기호 <span class="rm">π</span>(파이)로 써요.</p><p>답은 3.14로 계산하지 않고 <span class="rm">12π</span>처럼 π를 붙여 나타내요.</p>`},
  '원의 넓이':{k:'6학년 · 원',b:`<p class="formula">π × (반지름) × (반지름)</p><p>반지름이 3 cm이면 π × 3 × 3 = <span class="rm">9π</span> (cm²)</p><p>${T('원주율')} π가 뭔지 다시 보기</p>`,fig:'circle'},
  '원의 둘레':{k:'6학년 · 원',b:`<p class="formula">2 × π × (반지름)</p><p>지름 × π와 같아요. 반지름이 3 cm이면 2 × π × 3 = <span class="rm">6π</span> (cm)</p>`,fig:'circle'},
  '둘레':{k:'초등 · 측정',b:`<p>도형의 바깥을 한 바퀴 도는 길이예요. 다각형이면 모든 변의 길이를 더해요.</p><p>원이면 ${T('원의 둘레')}를 써요.</p>`},
  '전개도':{k:'입체도형',b:`<p>입체도형의 모서리를 잘라 평면 위에 펼쳐 놓은 그림이에요. 전개도의 넓이가 곧 입체도형의 겉넓이예요.</p>`},
  '밑넓이':{k:'입체도형',b:`<p>밑면 <b>하나</b>의 넓이예요. 기둥은 밑면이 2개라서 겉넓이를 구할 때 밑넓이를 2번 더해요.</p><p>밑면 모양에 따라 ${T('직사각형의 넓이')}, ${T('삼각형의 넓이')}, ${T('원의 넓이')}를 써요.</p>`},
  '옆넓이':{k:'입체도형',b:`<p>옆면 전체의 넓이예요. 기둥의 옆면을 펼치면 하나의 직사각형이 돼요.</p><p class="formula">(밑면의 둘레) × (높이)</p>`},
  '밑면':{k:'입체도형',b:`<p>각기둥과 각뿔대에서는 위아래로 마주 보는 두 면, 각뿔에서는 뾰족한 꼭짓점과 마주 보는 아래 면이에요. 그림에서 파랗게 칠한 면이에요.</p>`,fig3:[{s:'p5',hl:'base'},{s:'y4',hl:'base'}]},
  '옆면':{k:'입체도형',b:`<p>밑면이 아닌 면이에요. 각기둥은 직사각형, 각뿔은 삼각형, 각뿔대는 사다리꼴이에요. 그림에서 주황색으로 칠한 면이에요.</p>`,fig3:[{s:'p5',hl:'side'},{s:'y4',hl:'side'}]},
  '겉넓이':{k:'입체도형',b:`<p>입체도형의 겉면 전체의 넓이예요. 모든 면의 넓이를 더한 것이고, ${T('전개도')}의 넓이와 같아요.</p><p>기둥이면 (밑넓이) × 2 + (옆넓이)</p>`,fig:'net'},
  'cm²':{k:'초등 · 넓이의 단위',b:`<p>한 변이 1 cm인 정사각형의 넓이를 <b>1 cm²</b>(1 제곱센티미터)라고 해요.</p><p>가로 4 cm, 세로 3 cm인 직사각형에는 1 cm²가 12개 → 12 cm²</p>`,fig:'grid'},
  '정다면체':{k:'1학년 · 입체도형',b:`<p>모든 면이 합동인 ${T('정다각형')}이고, 각 꼭짓점에 모인 면의 개수가 같은 다면체예요.</p><p>정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체 다섯 가지뿐이에요.</p>`},
  '한 내각':{k:'초등 · 다각형',b:`<p>다각형 안쪽에 있는 각 하나의 크기예요. 정다각형은 내각이 모두 같아요.</p><p>정삼각형 60°, 정사각형 90°, 정오각형 108°, 정육각형 120°</p>`},
  '정다각형':{k:'초등 · 다각형',b:`<p>변의 길이가 모두 같고, 각의 크기도 모두 같은 다각형이에요. 정삼각형, 정사각형, 정오각형, 정육각형, …</p>`,fig:'regs'},
  '정삼각형':{k:'초등 · 삼각형',b:`<p>세 변의 길이가 모두 같은 삼각형이에요. 세 각의 크기도 모두 같아요.</p><p>정삼각형은 두 변의 길이가 같으니 ${T('이등변삼각형')}이기도 해요.</p>`,fig:'tris'},
  '이등변삼각형':{k:'초등 · 삼각형',b:`<p>두 변의 길이가 같은 삼각형이에요. 각뿔의 옆면은 보통 이등변삼각형이에요.</p>`,fig:'tris'},
  '직사각형':{k:'초등 · 사각형',b:`<p>네 각이 모두 직각인 사각형이에요. 각기둥의 옆면은 직사각형이에요.</p>`,fig:'quads'},
  '정사각형':{k:'초등 · 사각형',b:`<p>네 변의 길이가 모두 같고 네 각이 모두 직각인 사각형이에요. 정사각형도 직사각형의 한 종류예요.</p>`,fig:'quads'},
  '방정식':{k:'1학년 · 일차방정식',b:`<p><span class="rm">3</span><span class="math">n</span><span class="rm"> = 24</span>처럼 모르는 수가 들어간 등식이에요.</p><p>양변을 3으로 나누면 <span class="math">n</span><span class="rm"> = 8</span>.<br><span class="math">n</span><span class="rm"> + 2 = 10</span>이면 양변에서 2를 빼서 <span class="math">n</span><span class="rm"> = 8</span>.</p>`},
};
function termFig(cv,kind){
  const d=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;cv.width=w*d;cv.height=h*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);
  c.strokeStyle='#151a28';c.lineWidth=2;c.lineJoin='round';const poly=(pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke()};
  const slot=k=>w*(k+0.5)/4,R=Math.min(w/8-6,36),cy0=70;
  if(kind==='polys'){
    poly(regPoly(3,R*1.15,-Math.PI/2).map(q=>[slot(0)+q[0],cy0+8+q[1]]));
    poly(regPoly(4,R*1.1,Math.PI/4).map(q=>[slot(1)+q[0],cy0+q[1]]));
    poly(regPoly(5,R*1.05,-Math.PI/2).map(q=>[slot(2)+q[0],cy0+q[1]]));
    c.beginPath();c.arc(slot(3),cy0,R,0,TAU);c.strokeStyle='#b83a3a';c.setLineDash([4,4]);c.stroke();c.setLineDash([]);c.strokeStyle='#151a28';
    ['삼각형','사각형','오각형'].forEach((t,k)=>ktext(c,t,slot(k),cy0+R+26,{size:14}));ktext(c,'원 ✕',slot(3),cy0+R+26,{size:14,color:'#b83a3a',bold:true})}
  if(kind==='flat'){const s3=k=>w*(k+0.5)/3;
    c.fillStyle='#fff6c7';
    [[regPoly(3,R*1.15,-Math.PI/2).map(q=>[s3(0)+q[0],cy0+8+q[1]]),'삼각형'],[regPoly(4,R*1.1,Math.PI/4).map(q=>[s3(1)+q[0],cy0+q[1]]),'사각형']].forEach(([pts,t],k)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();ktext(c,t,s3(k),cy0+R+26,{size:14})});
    c.beginPath();c.arc(s3(2),cy0,R,0,TAU);c.fill();c.stroke();ktext(c,'원',s3(2),cy0+R+26,{size:14});
    ktext(c,'종이 위에 납작하게',w/2,14,{size:12,color:'#5a6377'})}
  if(kind==='solid'){const s3=k=>w*(k+0.5)/3,a=R*0.95,d=R*0.45,yb=cy0+R*0.75;
    // 정육면체
    {const x=s3(0)-a/2-d/2,y=yb;const F=[[x,y],[x+a,y],[x+a,y-a],[x,y-a]],B=F.map(p=>[p[0]+d,p[1]-d]);
     c.fillStyle='#e8eefb';c.beginPath();[F[3],F[2],B[2],B[3]].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();
     c.fillStyle='#d3ddf3';c.beginPath();[F[1],B[1],B[2],F[2]].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();
     c.fillStyle='#f4f7fd';c.beginPath();F.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();
     c.setLineDash([4,4]);c.lineWidth=1.3;line(c,F[0],B[0]);line(c,B[0],B[1]);line(c,B[0],B[3]);c.setLineDash([]);c.lineWidth=2;ktext(c,'정육면체',s3(0),cy0+R+26,{size:14})}
    // 원기둥
    {const x=s3(1),rx=R*0.62,ry=R*0.2,top=yb-a*1.05;c.fillStyle='#e8eefb';c.beginPath();c.moveTo(x-rx,top);c.lineTo(x-rx,yb);c.ellipse(x,yb,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,top);c.closePath();c.fill();
     c.beginPath();c.moveTo(x-rx,top);c.lineTo(x-rx,yb);c.moveTo(x+rx,top);c.lineTo(x+rx,yb);c.stroke();
     c.beginPath();c.ellipse(x,yb,rx,ry,0,0,Math.PI);c.stroke();c.setLineDash([4,4]);c.lineWidth=1.3;c.beginPath();c.ellipse(x,yb,rx,ry,0,Math.PI,TAU);c.stroke();c.setLineDash([]);c.lineWidth=2;
     c.fillStyle='#f4f7fd';c.beginPath();c.ellipse(x,top,rx,ry,0,0,TAU);c.fill();c.stroke();ktext(c,'원기둥',x,cy0+R+26,{size:14})}
    // 원뿔
    {const x=s3(2),rx=R*0.7,ry=R*0.22,ap=yb-a*1.15;c.fillStyle='#e8eefb';c.beginPath();c.moveTo(x,ap);c.lineTo(x-rx,yb);c.ellipse(x,yb,rx,ry,0,Math.PI,0,true);c.closePath();c.fill();
     c.beginPath();c.moveTo(x-rx,yb);c.lineTo(x,ap);c.lineTo(x+rx,yb);c.stroke();c.beginPath();c.ellipse(x,yb,rx,ry,0,0,Math.PI);c.stroke();
     c.setLineDash([4,4]);c.lineWidth=1.3;c.beginPath();c.ellipse(x,yb,rx,ry,0,Math.PI,TAU);c.stroke();c.setLineDash([]);c.lineWidth=2;ktext(c,'원뿔',x,cy0+R+26,{size:14})}
    ktext(c,'공간을 차지해요',w/2,14,{size:12,color:'#5a6377'})}
  if(kind==='grid'){const s=24,x0=(w-4*s)/2,y0=24;c.lineWidth=1;c.strokeStyle='#9aa3b5';for(let i=0;i<=4;i++){c.beginPath();c.moveTo(x0+i*s,y0);c.lineTo(x0+i*s,y0+3*s);c.stroke()}for(let j=0;j<=3;j++){c.beginPath();c.moveTo(x0,y0+j*s);c.lineTo(x0+4*s,y0+j*s);c.stroke()}
    c.lineWidth=2.2;c.strokeStyle='#151a28';c.strokeRect(x0,y0,4*s,3*s);mtext(c,'4 cm',x0+2*s,y0+3*s+16,{size:17});mtext(c,'3 cm',x0-26,y0+1.5*s,{size:17})}
  if(kind==='tri'){const x0=w/2-70,y0=120;c.setLineDash([4,4]);c.strokeRect(x0,y0-80,140,80);c.setLineDash([]);poly([[x0,y0],[x0+140,y0],[x0,y0-80]]);mtext(c,'밑변',x0+70,y0+14,{size:15});mtext(c,'높이',x0-22,y0-40,{size:15})}
  if(kind==='circle'){const cx=w/2,cy=74,r=50;c.beginPath();c.arc(cx,cy,r,0,TAU);c.stroke();c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+r,cy);c.stroke();c.beginPath();c.arc(cx,cy,3,0,TAU);c.fillStyle='#151a28';c.fill();
    mtext(c,'O',cx-12,cy+12,{size:18});mtext(c,'반지름',cx+r/2,cy-12,{size:14})}
  if(kind==='trap'){poly([[w/2-40,40],[w/2+40,40],[w/2+80,115],[w/2-80,115]]);ktext(c,'↔ 평행 ↔',w/2,78,{size:13,color:'#5a6377'})}
  const tick=(A,B,k=1)=>{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2,dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,tx=dx/L,ty=dy/L;for(let i=0;i<k;i++){const o=(i-(k-1)/2)*5;c.beginPath();c.moveTo(mx+tx*o-nx*6,my+ty*o-ny*6);c.lineTo(mx+tx*o+nx*6,my+ty*o+ny*6);c.stroke()}};
  if(kind==='regs'){[3,4,5,6].forEach((n,k)=>{const P=regPoly(n,R*1.05,n===4?Math.PI/4:-Math.PI/2).map(q=>[slot(k)+q[0],cy0+(n===3?6:0)+q[1]]);c.fillStyle=FC[k];c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();c.lineWidth=1.4;P.forEach((p,i)=>tick(p,P[(i+1)%n]));c.lineWidth=2;
    ktext(c,['정삼각형','정사각형','정오각형','정육각형'][k],slot(k),cy0+R+26,{size:13})})}
  if(kind==='tris'){const s3=k=>w*(k+0.5)/2;const E=regPoly(3,R*1.25,-Math.PI/2).map(q=>[s3(0)+q[0],cy0+10+q[1]]);const I=[[s3(1),cy0-R*1.1],[s3(1)-R*0.7,cy0+R*0.75],[s3(1)+R*0.7,cy0+R*0.75]];
    [[E,'정삼각형',[1,1,1]],[I,'이등변삼각형',[1,0,1]]].forEach(([P,t,ks],k)=>{c.fillStyle='#fff6c7';c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();c.lineWidth=1.4;P.forEach((p,i)=>{if(ks[i])tick(p,P[(i+1)%3])});c.lineWidth=2;ktext(c,t,s3(k),cy0+R+26,{size:13})});
    ktext(c,'같은 표시 = 같은 길이',w/2,14,{size:12,color:'#5a6377'})}
  if(kind==='quads'){const s3=k=>w*(k+0.5)/3,a=R*1.3;const Q=[[[s3(0)-a/2,cy0-a/2],[s3(0)+a/2,cy0-a/2],[s3(0)+a/2,cy0+a/2],[s3(0)-a/2,cy0+a/2]],[[s3(1)-a*0.75,cy0-a*0.4],[s3(1)+a*0.75,cy0-a*0.4],[s3(1)+a*0.75,cy0+a*0.4],[s3(1)-a*0.75,cy0+a*0.4]],[[s3(2)-a*0.35,cy0-a*0.45],[s3(2)+a*0.35,cy0-a*0.45],[s3(2)+a*0.7,cy0+a*0.45],[s3(2)-a*0.7,cy0+a*0.45]]];
    Q.forEach((P,k)=>{c.fillStyle=FC[k];c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();if(k<2){c.lineWidth=1.2;const p=P[3];c.strokeRect(p[0],p[1]-8,8,8);c.lineWidth=2}ktext(c,['정사각형','직사각형','사다리꼴'][k],s3(k),cy0+R+26,{size:13})})}
  if(kind==='net'){const q=Math.min(26,(w-40)/4),x0=(w-4*q)/2,y0=cy0-1.5*q+4;const cells=[[1,0,1],[0,1,0],[1,1,0],[2,1,0],[3,1,0],[1,2,1]];cells.forEach(([i,j,b])=>{c.fillStyle=b?'#c9d6f2':'#fff4c2';c.fillRect(x0+i*q,y0+j*q,q,q);c.strokeRect(x0+i*q,y0+j*q,q,q)});
    ktext(c,'정육면체를 펼친 전개도: 면 6개의 넓이를 모두 더하면 겉넓이',w/2,y0+3*q+18,{size:12,color:'#5a6377'})}
}
const pop=$('#pop');let popStack=[],popAnchor=null,popPinned=false,popHideT=null;
function showTerm(key,anchor,push){
  const t=TERMS[key];if(!t)return;dayTerm(key);
  if(push)popStack.push(key);else popStack=[key];
  if(anchor){popAnchor&&popAnchor.classList.remove('open');popAnchor=anchor;anchor.classList.add('open')}
  pop.innerHTML=`<div class="kicker">${t.k} · 미리 알아야 할 것</div><div class="pop-h">${popStack.length>1?'<button type="button" data-back aria-label="이전 용어로">‹</button>':''}<h4>${key}</h4><button type="button" data-close aria-label="닫기">✕</button></div>${t.b}${t.fig?'<canvas></canvas>':''}${t.fig3?`<div class="pfig3">${t.fig3.map(()=>'<canvas></canvas>').join('')}</div>`:''}`;
  pop.hidden=false;
  if(t.fig)termFig($('canvas',pop),t.fig);
  if(t.fig3)$$('.pfig3 canvas',pop).forEach((cv,i)=>{const F=t.fig3[i],m=SOLIDS[F.s].mk();const v=figure(cv,{visual:true,mesh:m,pitch:0.34,pad:0.4});applyHl(v,m,F.hl)});
  if(popAnchor&&innerWidth>640){const r=popAnchor.getBoundingClientRect();const pw=pop.offsetWidth,ph=pop.offsetHeight;let x=Math.min(innerWidth-pw-12,Math.max(12,r.left));let y=r.bottom+8;if(y+ph>innerHeight-8)y=Math.max(8,r.top-ph-8);pop.style.left=x+'px';pop.style.top=y+'px'}
}
function hideTerm(){pop.hidden=true;popStack=[];popPinned=false;popAnchor&&popAnchor.classList.remove('open');popAnchor=null}
document.addEventListener('click',e=>{
  const tb=e.target.closest('.term');
  if(tb){e.preventDefault();const inPop=pop.contains(tb);if(!inPop&&popAnchor===tb&&popPinned&&!pop.hidden){hideTerm();return}showTerm(tb.dataset.t,inPop?null:tb,inPop);popPinned=true;return}
  if(e.target.closest('[data-close]')){hideTerm();return}
  if(e.target.closest('[data-back]')){popStack.pop();const k=popStack.pop();showTerm(k,null,true);return}
  if(!pop.hidden&&!pop.contains(e.target))hideTerm();
});
const canHover=matchMedia('(hover: hover)').matches;
if(canHover){
  document.addEventListener('mouseover',e=>{const tb=e.target.closest('.term');if(tb&&!pop.contains(tb)){clearTimeout(popHideT);if(popAnchor!==tb||pop.hidden){popPinned=false;showTerm(tb.dataset.t,tb,false)}}
    else if(pop.contains(e.target))clearTimeout(popHideT)});
  document.addEventListener('mouseout',e=>{const tb=e.target.closest('.term');if((tb&&!pop.contains(tb))||(pop.contains(e.target)&&!pop.contains(e.relatedTarget))){if(!popPinned){clearTimeout(popHideT);popHideT=setTimeout(()=>{if(!popPinned)hideTerm()},350)}}});
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTerm()});

/* ───────── 답 입력(패드용 키패드) ───────── */
let activeBox=null;
function answerUI(step,onTry){
  const wrap=el('<div class="answer"></div>');
  if(step.type==='choice'){
    const box=el('<div class="choices"></div>');
    step.choices.forEach(c=>{const b=el(`<button type="button" class="${step.mathChoices?'math':''}"></button>`);b.textContent=c;b.onclick=()=>{const t=onTry(c);if(t===false){b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400)}else if(t==='also'){b.classList.add('also');b.disabled=true}};box.appendChild(b)});
    wrap.appendChild(box);return wrap}
  let val='';
  const field=el(`<div class="field" tabindex="0" role="textbox" aria-label="답 입력"><span class="val"></span><span class="caret"></span>${step.suffix?`<span class="suf">${step.suffix}</span>`:''}</div>`);
  const keys=el(`<div class="keys${step.type==='sn'?' sn':''}"></div>`);
  const SN=step.type==='sn',L=SN?['7','8','9','⌫','4','5','6','+','1','2','3','−','0','.','/','확인']:['7','8','9','⌫','4','5','6',step.type==='pi'?'π':'','1','2','3','확인','0','.'];
  const render=()=>{$('.val',field).innerHTML=val?val.replace(/π/g,'<span class="rm">π</span>'):'<span class="ph">?</span>'};
  const press=k=>{if(k==='⌫')val=val.slice(0,-1);else if(k==='확인'){if(!val)return;if(onTry(val)===false){field.classList.add('shake');setTimeout(()=>field.classList.remove('shake'),400)}return}
    else if(k==='−'||k==='+'){const s0=val[0]==='−'||val[0]==='+'?val[0]:'',rest=s0?val.slice(1):val;val=(s0===k?'':k)+rest}else if(k==='/'){if(val&&!val.includes('/')&&!val.includes('.')&&/\d$/.test(val))val+='/'}
    else if(k==='π'){if(!val.includes('π'))val+='π'}else if(k==='.'){const seg=val.split('/').pop();if(!seg.includes('.')&&!val.includes('π'))val+=(/\d$/.test(val)?'':'0')+'.'}else{if(val.includes('π'))return;if(val.length<8)val=(val==='0'?'':val==='−0'?'−':val==='+0'?'+':val)+k}render()};
  L.forEach(k=>{if(k===''){keys.appendChild(el('<span></span>'));return}const b=el(`<button type="button" class="${k==='확인'?'ok':k==='0'&&!SN?'zero':k==='⌫'||k==='/'?'fn':k==='−'||k==='+'?'sg':''}">${k==='π'?'<span class="rm">π</span>':k}</button>`);b.onclick=()=>press(k);keys.appendChild(b)});
  wrap.append(field,keys);render();
  activeBox={press,node:wrap};
  return wrap}
document.addEventListener('keydown',e=>{if(!activeBox||!activeBox.node.isConnected)return;if(e.target.closest&&e.target.closest('input,textarea'))return;
  if(/^[0-9]$/.test(e.key))activeBox.press(e.key);else if(e.key==='-')activeBox.press('−');else if(e.key==='+')activeBox.press('+');else if(e.key==='/')activeBox.press('/');else if(e.key==='Backspace'){e.preventDefault();activeBox.press('⌫')}else if(e.key==='Enter'){e.preventDefault();activeBox.press('확인')}else if(e.key==='p'||e.key==='P')activeBox.press('π');else if(e.key==='.')activeBox.press('.')});
const snVal=v=>{const t=String(v).replace('−','-').replace('+','');if(t.includes('/')){const[a,b]=t.split('/');const x=parseFloat(a),y=parseFloat(b);return y?x/y:NaN}return parseFloat(t)};
function check(step,v){
  if(step.type==='choice')return v===step.ans;
  if(step.type==='sn'){if(step.needSign&&step.ans>0&&!String(v).startsWith('+'))return'nosign';const x=snVal(v);return isFinite(x)&&Math.abs(x-step.ans)<1e-9}
  if(step.type==='pi'){if(!v.includes('π'))return'nopi';const c=v.replace('π','');const k=c===''?1:parseFloat(c);return Math.abs(k-step.ans)<1e-9}
  if(v.includes('π'))return false;return Math.abs(parseFloat(v)-step.ans)<1e-9}
function fmtAns(step){if(step.type==='sn')return(step.ansText||sgnTxt(step.ans))+(step.suffix?' '+step.suffix:'');if(step.suffix&&/^각/.test(step.suffix))return kn(step.ans)+step.suffix;if(step.type==='pi')return(step.ans===1?'':step.ans)+'π'+(step.suffix?' '+step.suffix:'');return step.ans+(step.suffix?' '+step.suffix:'')}

/* ───────── 단계 문제 화면 ───────── */
/* ───────── 문제 신고 (학생) ─────────
   문제 아래 작은 글자 링크 하나만 보여요. 누르면 이유를 고르고 보내요. 서버 함수: supabase/report.sql */
const REP_WHY=['정답이 이상해요','그림이 이상해요','문제가 이해 안 돼요','기타'];
const repCtx=(root,cur)=>{const q=$('.prob-q',root),st=$$('.steps > li',root)[cur];return((q?q.innerText:'')+(st?' ｜ '+st.innerText:'')).replace(/\s+/g,' ').trim().slice(0,400)};
function repMount(root,prob,rep,getCur){
  const row=el(`<div class="rep-row"><button type="button" class="rep-btn">⚑ 문제가 이상해요</button></div>`);root.appendChild(row);
  $('.rep-btn',row).onclick=()=>{let why=null;
    row.innerHTML=`<div class="rep-box"><div class="rep-t">어떤 점이 이상한가요? <span class="muted">선생님께 전달돼요.</span></div>
      <div class="chips">${REP_WHY.map(w=>`<button type="button" class="chip rep-w">${w}</button>`).join('')}</div>
      <input class="inp rep-note" maxlength="200" placeholder="더 알려 줄 것이 있으면 적어요 (선택)">
      <div class="rep-act"><button type="button" class="btn primary t-mini rep-send" disabled>보내기</button><button type="button" class="btn ghost t-mini rep-x">취소</button></div></div>`;
    $$('.rep-w',row).forEach(b=>b.onclick=()=>{why=b.textContent;$$('.rep-w',row).forEach(x=>x.classList.toggle('on',x===b));$('.rep-send',row).disabled=false});
    $('.rep-x',row).onclick=()=>{row.remove();repMount(root,prob,rep,getCur)};
    $('.rep-send',row).onclick=async()=>{const b=$('.rep-send',row);b.disabled=true;const cur=getCur();
      try{await API.call('hg_report',{p_token:isStudent()?AUTH.token:null,p_lesson:String(rep.lesson||'etc').slice(0,20),p_gen:rep.gen||null,p_seed:rep.seed??null,p_ptype:prob.ptype||null,
          p_step:cur,p_reason:why,p_note:$('.rep-note',row).value.trim()||null,p_ctx:repCtx(root,cur)});
        row.innerHTML='<div class="rep-ok">고마워요! 선생님께 전달했어요. 이 문제는 넘어가도 괜찮아요.</div>'}
      catch(e){if(isAuthErr&&isAuthErr(e))authExpired();row.innerHTML=`<div class="rep-ok">${isMissingFn(e)?'아직 신고를 받을 준비가 안 됐어요. 선생님께 말로 알려 주세요.':'보내지 못했어요. 잠시 뒤에 다시 해 주세요.'}</div>`}}}}
function renderProblem(host,prob,opt={}){
  let mode=(opt.mode==='final'&&prob.steps.length>1)?'final':'steps';
  let usedSteps=mode==='steps',revealed=false;
  host.innerHTML='';
  const root=el(`<div class="prob"><div class="prob-q"></div><div class="prob-body"><div class="prob-fig"><canvas aria-label="문제 그림"></canvas></div><div class="side"><ol class="steps"></ol><div class="tail"></div></div></div></div>`);
  $('.prob-q',root).innerHTML=prob.title;host.appendChild(root);
  const vis=!!opt.visual;let fv=null,netU=null;const figBox=$('.prob-fig',root);
  const mkFig=cv=>{fv=figure(cv,Object.assign({},prob.fig,vis?{visual:true}:{}));return fv};
  const svgFig=prob.fig&&prob.fig.svg;
  const h0=svgFig?prob.fig.svg(vis,0):'';
  if(svgFig&&h0){figBox.classList.add('svgfig');figBox.innerHTML=h0}
  else if(prob.fig&&!svgFig){mkFig($('canvas',root));if(vis)figBox.insertAdjacentHTML('beforeend','<div class="fighint">끌어서 돌려 볼 수 있어요</div>')}
  else{figBox.remove();$('.prob-body',root).classList.add('nofig')}
  if(vis&&prob.fig&&prob.fig.net){const nb=el('<button type="button" class="btn ghost netbtn">전개도로 펼쳐 보기</button>');figBox.appendChild(nb);
    nb.onclick=()=>{const old=$('canvas',figBox),cv=el('<canvas aria-label="문제 그림"></canvas>');old.replaceWith(cv);
      if(!netU){const N=prob.fig.net;netU=unfoldViewer(cv,{shape:N,t:0});netU.v.tick=()=>{if(netU.t<1){netU.t=Math.min(1,netU.t+(reduced?1:0.015));netU.v.dirty=true}};nb.textContent='입체도형으로 보기'}
      else{netU=null;mkFig(cv);syncHl();nb.textContent='전개도로 펼쳐 보기'}}}
  const ol=$('.steps',root),tail=$('.tail',root);
  let cur=0,tries=0,wrongs=0,sw=[],rv=[];
  if(opt.rep&&!opt.worked)repMount(root,prob,opt.rep,()=>cur);
  function syncHl(){if(svgFig){if(vis&&prob.fig.step){const box=$('.prob-fig',root);if(box)box.innerHTML=prob.fig.svg(vis,cur)}return}if(!vis||!fv||netU)return;const S=list();const st=S[Math.min(cur,S.length-1)];applyHl(fv,prob.fig.mesh,cur>=S.length?(prob.endHl||st.hl):st.hl)}
  function revealAfter(){if(!vis||!prob.figAfter||cur<prob.figAfter.at||$('.prob-fig',root))return;
    const box=el(`<div class="prob-fig"><canvas aria-label="찾은 입체도형"></canvas><div class="fighint">${prob.figAfter.cap}</div></div>`);$('.prob-body',root).prepend(box);$('.prob-body',root).classList.remove('nofig');
    const v2=figure($('canvas',box),Object.assign({visual:true},prob.figAfter.fig));applyHl(v2,prob.figAfter.fig.mesh,prob.figAfter.hl)}
  const list=()=>mode==='final'?[prob.final||Object.assign({},prob.steps[prob.steps.length-1],{q:prob.finalQ||prob.steps[prob.steps.length-1].q})]:prob.steps;
  function draw(){
    syncHl();revealAfter();if(opt.onStep)opt.onStep(cur);
    ol.innerHTML='';const S=list();
    const gate=!!(S[cur]&&S[cur].gate);  /* gate: 이 단계 답에 따라 다음 단계가 달라져요 → 미리 보여 주지 않아요 */
    S.forEach((s,i)=>{if(i>cur+(gate?0:1))return;const li=el(`<li class="step ${i<cur?(s._shown?'shown':'done'):i===cur?'cur':'lock'}"><div class="sq"><span class="sn">${S.length>1?`(${i+1})`:''}</span><div class="sb"><div>${s.q}</div></div></div></li>`);
      const sb=$('.sb',li);
      if(i<cur){if(opt.worked){const w=s.why||s.hint||s.ok;sb.appendChild(el(`<div class="wk"><span class="wka">${fmtAns(s).replace(/π/g,'<span class="rm">π</span>')}</span>${w?`<span class="wkw">${w}</span>`:''}</div>`))}else{sb.appendChild(el(`<div class="ans">${s._shown?'정답: ':CHECK+' '}${fmtAns(s).replace(/π/g,'<span class="rm">π</span>')}</div>`));if(s.ok)sb.appendChild(el(`<div class="expl">${s.ok}</div>`))}}
      if(i===cur&&opt.worked){const b=el(`<button type="button" class="btn primary wkbtn">풀이 보기 ▶</button>`);b.onclick=()=>{cur++;draw();if(cur>=S.length&&opt.onWorked){tail.innerHTML='';opt.onWorked(tail)}};sb.appendChild(b)}
      else if(i===cur){
        const hm=el('<div class="hintmsg" hidden></div>');
        const ui=answerUI(s,v=>{if(s.also&&s.also[v]){hm.hidden=false;hm.innerHTML=`<span class="ok">○ ${s.also[v]}</span>`;return'also'}  /* also: 틀리진 않았지만 더 정확한 답이 있는 보기(예: 지름 → 현) */
          const r=check(s,v);livePing(true);if(r===true){tries=0;cur++;draw();if(cur>=S.length)finish();return true}
          tries++;wrongs++;sw[i]=(sw[i]||0)+1;hm.hidden=false;hm.innerHTML=r==='nopi'?'π를 붙여서 답해 보세요. 예) 12π':r==='nosign'?'양수는 양의 부호 + 를 붙여서 답해요. + 를 먼저 누르고 숫자를 눌러요.':(tries===1?'다시 생각해 볼까요? ':'')+(s.hint||'');
          if(tries>=3&&!$('.reveal',li)){const rb=el('<button type="button" class="btn ghost reveal" style="margin-top:8px">정답 확인하고 넘어가기</button>');rb.onclick=()=>{s._shown=true;revealed=true;rv[i]=1;tries=0;cur++;draw();if(cur>=S.length)finish()};sb.appendChild(rb)}
          return false});
        sb.append(ui,hm);
        if(mode==='final'){const swb=el('<button type="button" class="btn ghost" style="margin-top:10px">단계로 나누어 풀기</button>');swb.onclick=()=>{mode='steps';usedSteps=true;cur=0;tries=0;sw=[];rv=[];draw()};sb.appendChild(swb)}
      }
      ol.appendChild(li)});
    if(!gate&&S.length>cur+2)ol.appendChild(el(`<li class="step more">남은 단계 ${S.length-cur-2}개 더 있어요</li>`));
  }
  function finish(){const good=!revealed;tail.innerHTML='';const r=el(`<div class="result ${good?'ok':'bad'}"><span>${good?(mode==='final'?'단계 없이 혼자 풀었어요!':'모든 단계를 해냈어요!'):'정답을 확인한 단계가 있어요. 비슷한 문제를 다시 풀어 봐요.'}</span></div>`);tail.appendChild(r);
    const n=list().length,stepWrongs=range(n).map(k=>sw[k]||0),revealedArr=range(n).map(k=>rv[k]||0);
    if(opt.onDone)opt.onDone({good,usedSteps,mode,wrongs,stepWrongs,revealed:revealedArr,box:r})}
  prob.steps.forEach(s=>delete s._shown);
  draw();
}

/* ───────── 문제 만들기 ───────── */
function solidFig(m,o={}){return{mesh:m,yaw:o.yaw??-0.45,pitch:o.pitch??0.33,pad:o.pad??0.40,labels:o.labels}}
const GEN={};
/* 1차시: 다면체 */
GEN.polyStep=seed=>{const r=mulberry(seed);const tp=pick(r,['prism','pyramid']),n=ri(r,3,8),Ty=TYPE[tp];
  const nm=kn(n)+'각형';const opts=shuffle(r,(n===3?[n,n+1,n+2]:[n-1,n,n+1]).map(k=>kn(k)+'각형'));const F=Ty.F(n);
  return{ptype:'poly:'+tp,title:'다음 다면체는 몇 면체인지 구하시오.',fig:solidFig(Ty.mk(n)),finalQ:'이 다면체는 몇 면체인가요?',steps:[
    {hl:'base',q:`${T('밑면')}의 모양은 어떤 ${T('다각형')}인가요?`,type:'choice',choices:opts,ans:nm,hint:tp==='prism'?'위아래로 마주 보는 면의 변을 세어 보세요.':'맨 아래 면의 변을 세어 보세요. 뾰족한 꼭짓점과 마주 보는 면이에요.',ok:`밑면은 ${nm}이에요.`},
    {hl:'base',q:`${T('밑면')}은 몇 개인가요?`,type:'num',ans:tp==='prism'?2:1,suffix:'개',hint:tp==='prism'?'각기둥은 위와 아래에 밑면이 있어요.':'각뿔은 밑면이 아래에만 있어요.'},
    {hl:'side',q:`${T('옆면')}은 몇 개인가요?`,type:'num',ans:n,suffix:'개',hint:`밑면의 변 하나마다 옆면이 하나씩 붙어 있어요. 밑면의 변은 ${n}개예요.`},
    {hl:'all',q:'면의 개수를 모두 더하면, 이 다면체는 몇 면체인가요?',type:'num',ans:F,suffix:'면체',hint:`(밑면의 개수) + (옆면의 개수) = ${tp==='prism'?2:1} + ${n}`,ok:`면이 ${F}개이므로 ${kn(F)}면체예요.`}]}};
GEN.poly=seed=>{const r=mulberry(seed);const k=pick(r,['is','is','count','count','step']);
  if(k==='step')return GEN.polyStep(seed+7);
  if(k==='is'){const id=pick(r,Object.keys(SOLIDS)),S=SOLIDS[id];
    return{ptype:'poly:is',title:'다음 입체도형은 다면체인지 아닌지 고르시오.',fig:solidFig(S.mk()),steps:[{q:'이 입체도형은 다면체인가요?',type:'choice',choices:['다면체이다','다면체가 아니다'],ans:S.poly?'다면체이다':'다면체가 아니다',
      hint:'모든 면이 다각형인지, 굽은 면(곡면)이 있는지 살펴보세요.',ok:S.poly?`${josa(S.name,'은','는')} 다각형인 면으로만 둘러싸여 있어요.`:S.why}]}}
  const ids=['cube','p3','y4','p5','f4','y6','p6','f5'];const id=pick(r,ids),m=SOLIDS[id].mk(),part=pick(r,['F','E','V']);const ans={F:m.F.length,E:m.E.length,V:m.V.length}[part];
  return{ptype:'poly:count',title:`다음 다면체의 ${PART[part]}의 개수를 구하시오.`,fig:solidFig(m),steps:[{q:`${josa(PART[part],'은','는')} 모두 몇 개인가요?`,type:'num',ans,suffix:'개',
    hint:'먼저 몇 층 건물인지 보고, 층마다 세어 더해 보세요. 점선은 보이지 않는 뒤쪽 모서리예요.',ok:`${SOLIDS[id].name}의 ${josa(PART[part],'은','는')} ${ans}개예요.`}]}};
/* 2차시: 각기둥·각뿔·각뿔대 */
GEN.typesStep=seed=>{const r=mulberry(seed);const tp=pick(r,['prism','pyramid','frustum']),Ty=TYPE[tp],n=ri(r,3,10);
  const parts=shuffle(r,['F','E','V']);const g=parts[0],a=parts[1];const gv=Ty[g](n),av=Ty[a](n),gf=Ty['f'+g],af=Ty['f'+a];
  const solveHint=gf.includes('+')?`양변에서 ${josa(gf.split('+')[1],'을','를')} 빼 보세요.`:`양변을 ${josaRo(gf[0])} 나누어 보세요.`;
  return{ptype:'types:'+tp,title:`${PART[g]}의 개수가 ${gv}개인 ${Ty.nm}의 ${PART[a]}의 개수를 구하시오.`,fig:null,figAfter:{at:3,fig:solidFig(Ty.mk(n)),hl:'F'+a.toLowerCase(),cap:`${kn(n)}${Ty.nm} · ${josa(PART[a],'을','를')} 층별로 칠했어요`},finalQ:`${PART[a]}의 개수는 몇 개인가요?`,steps:[
    {tag:'개수를 n을 사용한 식으로 나타내기',q:`<span class="math">n</span>${Ty.nm}의 ${PART[g]}의 개수를 <span class="math">n</span>을 사용하여 나타내면?`,type:'choice',mathChoices:true,choices:['n+1','n+2','2n','3n'],ans:gf,hint:`삼${Ty.nm}, 사${josa(Ty.nm,'을','를')} 떠올려 ${josa(PART[g],'을','를')} 세어 보세요. 개념 카드의 표도 도움이 돼요.`,ok:`<span class="math">n</span>${Ty.nm}의 ${PART[g]}: ${gf.replace('n','<span class="math">n</span>')}개`},
    {tag:'방정식을 풀어 n의 값 구하기',q:`${gf.replace('n','<span class="math">n</span>')} = ${gv} 이므로 <span class="math">n</span>의 값은?`,type:'num',ans:n,hint:`${T('방정식')}을 풀어요. ${solveHint}`},
    {tag:'입체도형의 이름 정하기',q:'이 입체도형의 이름은?',type:'num',ans:n,suffix:Ty.nm,hint:`<span class="math">n</span>의 값이 곧 밑면의 변의 개수예요.`,ok:`${kn(n)}${Ty.nm}${Ty.nm.endsWith('대')?'예요':'이에요'}.`},
    {tag:'n을 넣어 구하는 개수 계산하기',q:`${kn(n)}${Ty.nm}의 ${PART[a]}의 개수는?`,type:'num',ans:av,suffix:'개',hint:`${PART[a]}의 개수는 ${af.replace('n','<span class="math">n</span>')}개예요. <span class="math">n</span> = ${n}을 넣어 보세요.`}]}};
GEN.types=seed=>{const r=mulberry(seed);const k=pick(r,['step','step','direct','direct','side','name']);
  if(k==='step')return GEN.typesStep(seed+3);
  const tp=pick(r,['prism','pyramid','frustum']),Ty=TYPE[tp],n=ri(r,3,9);
  if(k==='direct'){const p=pick(r,['F','E','V']),v=Ty[p](n);return{ptype:'types:direct',title:`${kn(n)}${Ty.nm}의 ${PART[p]}의 개수를 구하시오.`,fig:solidFig(Ty.mk(n)),steps:[{q:`${josa(PART[p],'은','는')} 몇 개인가요?`,type:'num',ans:v,suffix:'개',hint:`밑면이 ${kn(n)}각형이에요. 그림에서 세어도 되고, <span class="math">n</span>${Ty.nm}의 ${PART[p]}: ${Ty['f'+p].replace('n','<span class="math">n</span>')}개를 써도 돼요.`}]}}
  if(k==='side')return{ptype:'types:side',title:`${Ty.nm}의 옆면의 모양을 고르시오.`,fig:solidFig(Ty.mk(n)),steps:[{q:'옆면은 어떤 모양인가요?',type:'choice',choices:['직사각형','삼각형','사다리꼴','오각형'],ans:Ty.side,hint:'밑면이 아닌 면 하나를 골라 변을 세고, 마주 보는 변이 평행한지 보세요.',ok:`${Ty.nm}의 옆면은 모두 ${Ty.side}이에요.`}]};
  const F=Ty.F(n);return{ptype:'types:name',title:`${josa(kn(n)+Ty.nm,'은','는')} 몇 면체인지 구하시오.`,fig:solidFig(Ty.mk(n)),steps:[{q:'몇 면체인가요?',type:'num',ans:F,suffix:'면체',hint:`밑면 ${tp==='pyramid'?1:2}개와 옆면 ${n}개를 더해요.`,ok:`${kn(F)}면체예요.`}]}};
/* 5차시: 기둥의 겉넓이 */
GEN.areaStep=seed=>{const r=mulberry(seed);const k=pick(r,['tri','box','cyl']);
  if(k==='tri'){const[a,b,c]=pick(r,[[3,4,5],[6,8,10],[5,12,13]]),h=ri(r,Math.round(c*0.6),c+1);const B=a*b/2,Pm=a+b+c,Lt=Pm*h,S=2*B+Lt;
    const m=prism([[0,0],[a,0],[0,b]],h);const top=z=>[[0,0,z],[a,0,z],[0,b,z]];const t=top(h),bt=top(0);
    return{ptype:'area:tri',title:'다음 그림과 같은 삼각기둥의 겉넓이를 구하시오.',finalQ:'삼각기둥의 겉넓이는 몇 cm²인가요?',fig:{net:{P:[[0,0],[a,0],[0,b]],h,perimLabel:`밑면의 둘레 = ${Pm} cm`,hLabel:`높이 ${h} cm`},mesh:m,yaw:0.62,pitch:0.5,pad:0.34,labels:[[bt[0],bt[1],a+' cm'],[bt[0],bt[2],b+' cm'],[t[1],t[2],c+' cm',{from:[a/3,b/3,h]}],[bt[1],t[1],h+' cm']]},steps:[
      {hl:'base1',q:`${T('밑넓이')}는 몇 ${T('cm²')}인가요?`,type:'num',ans:B,suffix:'cm²',hint:`밑면은 직각삼각형이에요. ${T('삼각형의 넓이')}: ${a} × ${b} ÷ 2`,ok:`${a} × ${b} ÷ 2 = ${B}`},
      {hl:'baseEdge',q:`밑면의 ${T('둘레')}는 몇 cm인가요?`,type:'num',ans:Pm,suffix:'cm',hint:`세 변의 길이를 모두 더해요: ${a} + ${b} + ${c}`},
      {hl:'side',q:`${T('옆넓이')}는 몇 cm²인가요?`,type:'num',ans:Lt,suffix:'cm²',hint:`옆면을 펼치면 가로가 ${Pm} cm(밑면의 둘레), 세로가 ${h} cm(높이)인 직사각형이에요.`,ok:`${Pm} × ${h} = ${Lt}`},
      {hl:'all',q:`${T('겉넓이')}는 몇 cm²인가요?`,type:'num',ans:S,suffix:'cm²',hint:`(밑넓이) × 2 + (옆넓이) = ${B} × 2 + ${Lt}`,ok:`${B} × 2 + ${Lt} = ${S}`}]}}
  if(k==='box'){const a=ri(r,3,9),b=ri(r,2,7),h=ri(r,3,9);const B=a*b,Pm=2*(a+b),Lt=Pm*h,S=2*B+Lt;const m=prism([[0,0],[a,0],[a,b],[0,b]],h);
    return{ptype:'area:box',title:'다음 그림과 같은 직육면체의 겉넓이를 구하시오.',finalQ:'직육면체의 겉넓이는 몇 cm²인가요?',fig:{net:{P:[[0,0],[a,0],[a,b],[0,b]],h,perimLabel:`밑면의 둘레 = ${Pm} cm`,hLabel:`높이 ${h} cm`},mesh:m,yaw:-0.5,pitch:0.4,pad:0.36,labels:[[[0,0,0],[a,0,0],a+' cm'],[[a,0,0],[a,b,0],b+' cm'],[[a,0,0],[a,0,h],h+' cm']]},steps:[
      {hl:'base1',q:`${T('밑넓이')}는 몇 ${T('cm²')}인가요?`,type:'num',ans:B,suffix:'cm²',hint:`밑면은 직사각형이에요. ${T('직사각형의 넓이')}: ${a} × ${b}`},
      {hl:'baseEdge',q:`밑면의 ${T('둘레')}는 몇 cm인가요?`,type:'num',ans:Pm,suffix:'cm',hint:`네 변을 모두 더해요: ${a} + ${b} + ${a} + ${b}`},
      {hl:'side',q:`${T('옆넓이')}는 몇 cm²인가요?`,type:'num',ans:Lt,suffix:'cm²',hint:`옆면을 펼친 직사각형: 가로 ${Pm} cm × 세로 ${h} cm`,ok:`${Pm} × ${h} = ${Lt}`},
      {hl:'all',q:`${T('겉넓이')}는 몇 cm²인가요?`,type:'num',ans:S,suffix:'cm²',hint:`${B} × 2 + ${Lt}`,ok:`${B} × 2 + ${Lt} = ${S}`}]}}
  const rr=ri(r,2,6),h=ri(r,3,10);const m=prism(regPoly(64,rr),h,true);
  return{ptype:'area:cyl',title:'다음 그림과 같은 원기둥의 겉넓이를 구하시오.',finalQ:'원기둥의 겉넓이는 몇 cm²인가요?',fig:{net:{P:regPoly(64,rr),h,smooth:true,perimLabel:`밑면의 둘레 = ${2*rr}π cm`,hLabel:`높이 ${h} cm`,inside:true},mesh:m,yaw:0,pitch:0.34,pad:0.34,after:(ctx,v)=>cylLabels(ctx,v,rr,h)},steps:[
    {hl:'baseEdge',q:'원기둥의 전개도에서 옆면(직사각형)의 가로의 길이는 무엇과 같나요?',type:'choice',choices:['밑면의 둘레','밑면의 반지름','원기둥의 높이'],ans:'밑면의 둘레',hint:'옆면을 감싼 종이를 펼친다고 생각해 보세요. 밑면의 원을 한 바퀴 둘러요.',ok:'옆면의 가로 = 밑면인 원의 둘레'},
    {hl:'base1',q:`${T('밑넓이')}는 몇 cm²인가요?`,type:'pi',ans:rr*rr,suffix:'cm²',hint:`${T('원의 넓이')}: π × ${rr} × ${rr}`},
    {hl:'baseEdge',q:`밑면의 둘레는 몇 cm인가요?`,type:'pi',ans:2*rr,suffix:'cm',hint:`${T('원의 둘레')}: 2 × π × ${rr}`},
    {hl:'side',q:'옆넓이는 몇 cm²인가요?',type:'pi',ans:2*rr*h,suffix:'cm²',hint:`(밑면의 둘레) × (높이) = ${2*rr}π × ${h}`,ok:`${2*rr}π × ${h} = ${2*rr*h}π`},
    {hl:'all',q:`${T('겉넓이')}는 몇 cm²인가요?`,type:'pi',ans:2*rr*rr+2*rr*h,suffix:'cm²',hint:`(밑넓이) × 2 + (옆넓이) = ${rr*rr}π × 2 + ${2*rr*h}π`,ok:`${2*rr*rr}π + ${2*rr*h}π = ${2*rr*rr+2*rr*h}π`}]}};
GEN.area=seed=>GEN.areaStep(seed);
function cylLabels(ctx,v,r,h,lr,lh){const C=v.proj([0,0,h]);const ang=-0.35;const Rp=v.proj([r*Math.cos(ang),r*Math.sin(ang),h]);
  ctx.strokeStyle='#151a28';ctx.lineWidth=2;line(ctx,C,Rp);ctx.beginPath();ctx.arc(C[0],C[1],3.2,0,TAU);ctx.fillStyle='#151a28';ctx.fill();
  lab(ctx,lr||r+' cm',(C[0]+Rp[0])/2,(C[1]+Rp[1])/2-18,{italic:!!lr,chip:v.o.chip});
  let best=null;for(let k=0;k<64;k++){const th=TAU*k/64;const p=v.proj([r*Math.cos(th),r*Math.sin(th),0]);if(!best||p[0]>best.p[0])best={p,th}}
  const T2=v.proj([r*Math.cos(best.th),r*Math.sin(best.th),h]);ctx.font='21px "Times New Roman",serif';const ht=lh||h+' cm';const tw=ctx.measureText(ht).width+(v.o.chip?16:0);lab(ctx,ht,best.p[0]+12+tw/2,(best.p[1]+T2[1])/2,{italic:!!lh,chip:v.o.chip})}
