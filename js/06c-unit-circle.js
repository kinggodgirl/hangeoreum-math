/*<CIRCLE>*/
/* ═════════════ 단원: 원과 부채꼴 (unit:'circle') ═════════════
   대청 수학 「원과 부채꼴 단원 마무리」 기초 유형(A1 · A2 · B1 · B2 · C · D)을 한 걸음 수학 차시 구조로 옮겼어요.
   1차시 원과 부채꼴(이름) · 2차시 중심각과 호(비례) · 3차시 부채꼴의 호의 길이와 넓이.
   다른 단원 모듈과 이름이 겹치지 않게 함수 안에 넣고, 공유 객체(GEN · CONCEPT · EXPLORE · PTYPES …)에만 덧붙여요. */
(()=>{
const INK='#1d2640',SH='#d6dcea',HL='#e08a1e',HLs='#fde3c3',BL='#2a4d9e',BLs='#dbe5f7',MF="'Times New Roman',Times,serif";
const rad=a=>a*Math.PI/180,pol=(C,R,a)=>[C[0]+R*Math.cos(rad(a)),C[1]-R*Math.sin(rad(a))];
const f1=n=>Math.round(n*10)/10,pt=P=>`${f1(P[0])} ${f1(P[1])}`;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const frT=(n,d)=>{const g=gcd(n,d);n/=g;d/=g;return d===1?String(n):`${n}/${d}`};
const PI_='<span class="rm">π</span>';
const svgW=(w,h,inner,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="cfig" role="img" aria-label="${lab||'원 그림'}" style="max-width:${w}px;width:100%;font-family:${MF}">${inner}</svg>`;
const tx=(P,s,o={})=>`<text x="${f1(P[0])}" y="${f1(P[1])}" font-size="${o.size||22}" text-anchor="${o.anchor||'middle'}" dominant-baseline="central" fill="${o.col||INK}" ${o.sans?`font-family="'Noto Sans KR',sans-serif" font-weight="700"`:''} ${o.it?'font-style="italic"':''} stroke="#fff" stroke-width="5" paint-order="stroke">${s}</text>`;
const dot=(P,r=4)=>`<circle cx="${f1(P[0])}" cy="${f1(P[1])}" r="${r}" fill="${INK}"/>`;
const ln=(P,Q,o={})=>`<line x1="${f1(P[0])}" y1="${f1(P[1])}" x2="${f1(Q[0])}" y2="${f1(Q[1])}" stroke="${o.col||INK}" stroke-width="${o.w||2.6}" stroke-linecap="round"${o.dash?` stroke-dasharray="${o.dash}"`:''}/>`;
/* 수학 방향(반시계)으로 a0 → a1 */
const arcD=(C,R,a0,a1)=>`M ${pt(pol(C,R,a0))} A ${R} ${R} 0 ${a1-a0>180?1:0} 0 ${pt(pol(C,R,a1))}`;
const secD=(C,R,a0,a1)=>`M ${pt(C)} L ${pt(pol(C,R,a0))} A ${R} ${R} 0 ${a1-a0>180?1:0} 0 ${pt(pol(C,R,a1))} Z`;
const circ=(C,R,o={})=>`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="${o.fill||'none'}" stroke="${o.col||INK}" stroke-width="${o.w||2.4}"/>`;
const angMk=(C,a0,a1,lab,o={})=>{const r=o.r||24,lr=o.lr||(a1-a0<40?58:46);return`<path d="${arcD(C,r,a0,a1)}" fill="none" stroke="${o.col||INK}" stroke-width="2"/>`+(lab?tx(pol(C,lr,(a0+a1)/2),lab,{size:o.size||19,col:o.col}):'')};
const labO=(C,away)=>tx(pol(C,20,away),'O',{size:20,it:false});

/* 부채꼴 하나: th 중심각, mid 가운데 방향 */
function secFig(o){const C=[200,170],R=112,th=o.th,mid=o.mid!=null?o.mid:90,a0=mid-th/2,a1=mid+th/2;
  let s=`<path d="${secD(C,R,a0,a1)}" fill="${o.shade?SH:o.ghost?'#fff4e6':'none'}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if(o.hlArc)s+=`<path d="${arcD(C,R,a0,a1)}" fill="none" stroke="${HL}" stroke-width="6" stroke-linecap="round"/>`;
  if(o.ghost)s=circ(C,R,{col:'#9aa3b5',w:1.6})+s;
  s+=dot(C)+labO(C,mid+180);
  if(o.rLab){const P=pol(C,R,a0),M=[(C[0]+P[0])/2,(C[1]+P[1])/2],n=pol([0,0],26,a0-90);s+=tx([M[0]+n[0],M[1]+n[1]],o.rLab,{size:20})}
  if(o.aLab)s+=angMk(C,a0,a1,o.aLab);
  if(o.arcLab)s+=tx(pol(C,R+30,mid),o.arcLab,{size:21,col:o.hlArc?HL:INK});
  if(o.inLab)s+=tx(pol(C,R*0.62,mid),o.inLab,{size:21});
  const P=[C,pol(C,R,a0),pol(C,R,a1)];for(let a=-720;a<=720;a+=90)if(a>=a0&&a<=a1)P.push(pol(C,R,a));
  if(o.ghost)P.push([C[0]-R,C[1]-R],[C[0]+R,C[1]+R]);
  const m=52,xs=P.map(q=>q[0]),ys=P.map(q=>q[1]),x0=Math.min(...xs)-m,y0=Math.min(...ys)-m,x1=Math.max(...xs)+m,y1=Math.max(...ys)+m;
  return`<svg viewBox="${f1(x0)} ${f1(y0)} ${f1(x1-x0)} ${f1(y1-y0)}" class="cfig" role="img" aria-label="부채꼴" style="max-width:${Math.round(x1-x0)}px;width:100%;max-height:300px;font-family:${MF}">${s}</svg>`}
/* 한 원 안의 두 부채꼴 */
function twoSec(a,b,l1,l2,area,flip){const C=[210,165],R=100,gap=34,tot=a+gap+b,s0=90-tot/2+(flip?180:0),A0=s0,A1=s0+a,B0=A1+gap,B1=B0+b;
  let s=circ(C,R)+`<path d="${secD(C,R,A0,A1)}" fill="${area?SH:'none'}" stroke="${INK}" stroke-width="2.6"/><path d="${secD(C,R,B0,B1)}" fill="${area?BLs:'none'}" stroke="${INK}" stroke-width="2.6"/>`+dot(C);
  s+=angMk(C,A0,A1,a+'°')+angMk(C,B0,B1,b+'°');
  [[A0,A1,l1],[B0,B1,l2]].forEach(([x0,x1,l])=>{const m=(x0+x1)/2,q=pol(C,R+30,m),cs=Math.cos(rad(m));s+=tx(q,l,{size:20,anchor:cs>0.35?'start':cs<-0.35?'end':'middle'})});
  return svgW(420,330,s+labO(C,(A0+B1)/2+180),'한 원 안의 두 부채꼴')}
/* 원 위의 세 점 (호의 비) */
function three(a,b,c){const C=[150,140],R=96,t=a+b+c,aA=110,aB=aA+360*a/t,aC=aB+360*b/t;
  const L=(ang,s)=>tx(pol(C,R+22,ang),s,{size:21,it:true});
  return svgW(300,280,circ(C,R)+dot(pol(C,R,aA))+dot(pol(C,R,aB))+dot(pol(C,R,aC))+dot(C)+ln(C,pol(C,R,aC),{w:1.6,dash:'5 4'})+ln(C,pol(C,R,aA),{w:1.6,dash:'5 4'})+L(aA,'A')+L(aB,'B')+L(aC,'C')+tx([C[0]+18,C[1]+10],'O',{size:20}),'원 위의 세 점')}
/* 이름 맞히기 그림 (대청 수학 idFig) */
const ID_KIND=['반지름','지름','현','호','부채꼴','활꼴','중심각','none-sector','none-chord','none-arc'];
function idFig(kind,r){const C=[150,140],R=100,fA=ri(r,0,359),al=ri(r,75,130),P=a=>pol(C,R,a),A=P(fA),B=P(fA+al);
  const TH=`stroke="${HL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;let hi='',away=fA+al/2+180;
  switch(kind){
    case'반지름':hi=`<path d="M ${pt(C)} L ${pt(A)}" ${TH}/>`;away=fA+180;break;
    case'지름':{const D=P(fA+180);hi=`<path d="M ${pt(A)} L ${pt(D)}" ${TH}/>`;away=fA+90;break}
    case'현':hi=`<path d="M ${pt(A)} L ${pt(B)}" ${TH}/>`;break;
    case'호':hi=`<path d="${arcD(C,R,fA,fA+al)}" fill="none" ${TH}/>`;break;
    case'부채꼴':hi=`<path d="${secD(C,R,fA,fA+al)}" fill="${HLs}" ${TH}/>`;break;
    case'활꼴':hi=`<path d="${arcD(C,R,fA,fA+al)} Z" fill="${HLs}" ${TH}/>`;break;
    case'중심각':hi=ln(C,A)+ln(C,B)+`<path d="${secD(C,32,fA,fA+al)}" fill="${HLs}" stroke="none"/><path d="${arcD(C,32,fA,fA+al)}" fill="none" ${TH}/>`;break;
    case'none-sector':{const Q=pol(C,R*0.45,fA+al/2+180);hi=`<path d="M ${pt(Q)} L ${pt(A)} A ${R} ${R} 0 0 0 ${pt(B)} Z" fill="${HLs}" ${TH}/>`+dot(Q,4);away=fA+al/2;break}
    case'none-chord':{const Q=pol(C,R*0.5,fA+al);hi=`<path d="M ${pt(A)} L ${pt(Q)}" ${TH}/>`+dot(Q,5);break}
    case'none-arc':{const M=pol(C,R*1.3,fA+al/2);hi=`<path d="M ${pt(A)} Q ${pt(M)} ${pt(B)}" fill="none" ${TH}/>`;break}}
  const ends=kind==='반지름'||kind==='중심각'||kind==='none-chord'?[A]:kind==='지름'?[A,P(fA+180)]:[A,B];
  return svgW(300,280,circ(C,R)+hi+ends.map(E=>dot(E,4.5)).join('')+dot(C)+tx(pol(C,20,away),'O',{size:20}),'원 O')}
const NAME_INFO={'반지름':'원의 중심과 원 위의 한 점을 이은 선분 → <b>반지름</b>','지름':'원의 중심을 지나는 현 → <b>지름</b> (가장 긴 현, 반지름의 2배)','현':'원 위의 두 점을 이은 선분 → <b>현</b>','호':'원 위의 두 점 사이의 원의 일부(굽은 선) → <b>호</b>',
  '부채꼴':'두 반지름과 호로 둘러싸인 도형 → <b>부채꼴</b>','활꼴':'현과 호로 둘러싸인 도형 → <b>활꼴</b>','중심각':'부채꼴에서 두 반지름이 이루는 각 → <b>중심각</b>',
  'none-sector':'부채꼴처럼 보이지만 꼭짓점이 원의 <b>중심이 아니에요</b> → 어느 것도 아니에요','none-chord':'한 끝이 원 위에 있지 않아요. 현은 <b>양 끝이 모두 원 위</b>에 있어요 → 어느 것도 아니에요','none-arc':'굽은 선이지만 <b>원의 일부가 아니에요</b> → 어느 것도 아니에요'};
const NAME_CAT={'반지름':'곧은 선분','지름':'곧은 선분','현':'곧은 선분','none-chord':'곧은 선분','호':'굽은 선','none-arc':'굽은 선','부채꼴':'둘러싸인 도형','활꼴':'둘러싸인 도형','none-sector':'둘러싸인 도형','중심각':'각'};
const CAT_NAMES={'곧은 선분':['반지름','지름','현'],'굽은 선':['호'],'둘러싸인 도형':['부채꼴','활꼴','반원'],'각':['중심각','원주각']};
const CAT_HINT={'곧은 선분':'양 끝이 어디에 있는지 보세요. 중심과 원 위의 점 → 반지름, 원 위의 두 점 → 현, 그중 중심을 지나면 지름.','굽은 선':'굽은 선이 원을 그대로 따라가면 호예요.','둘러싸인 도형':'꼭짓점이 중심 O이고 두 변이 반지름이면 부채꼴, 현과 호로만 둘러싸이면 활꼴이에요.','각':'꼭짓점이 원의 중심이고, 두 반지름이 만든 각이에요.'};
const NONE='어느 것도 아니에요';

/* ── 개념 ── */
const CC=[150,135],CR=96;
CONCEPT.arc=body=>{const A=pol(CC,CR,140),B=pol(CC,CR,40);
  body.innerHTML=foldPanel('원과 부채꼴',`<p class="lead">원 위의 두 점을 원을 따라 이으면 <b class="mark">${T('호')}</b>, 곧게 이으면 <b class="mark">${T('현')}</b>이에요. <b>굽으면 호, 곧으면 현!</b></p>`,
   fold(1,'원 · 반지름 · 지름','중심에서 같은 거리',`<div class="figbox">${svgW(300,270,circ(CC,CR)+dot(CC)+ln(CC,pol(CC,CR,-30),{col:BL,w:3.4})+tx(pol(CC,54,-8),'반지름',{size:17,sans:true,col:BL})+ln(pol(CC,CR,200),pol(CC,CR,20),{col:'#3f7d4e',w:3,dash:'8 6'})+tx(pol(CC,CR-24,210),'지름',{size:17,sans:true,col:'#3f7d4e'})+tx([CC[0]+4,CC[1]+20],'O',{size:20}))}</div>
     <p>평면 위의 한 점 O에서 <b>일정한 거리</b>에 있는 모든 점으로 이루어진 도형이 ${T('원')}이에요. 점 O가 원의 중심, 중심에서 원 위의 한 점까지의 선분이 ${T('반지름')}이에요.</p>
     <div class="box" style="margin:0">${T('지름')}은 원의 중심을 지나는 현이에요. 한 원에서 <b>가장 긴 현</b>이고, 길이는 반지름의 2배예요.</div>`,true)+
   fold(2,'호와 현','굽은 선과 곧은 선',`<div class="figbox">${svgW(300,270,circ(CC,CR)+`<path d="${arcD(CC,CR,40,140)}" fill="none" stroke="${HL}" stroke-width="6" stroke-linecap="round"/>`+ln(A,B,{col:BL,w:3.4})+dot(A)+dot(B)+dot(CC)+tx(pol(CC,CR+20,140),'A',{it:true})+tx(pol(CC,CR+20,40),'B',{it:true})+tx(pol(CC,CR+24,90),'호 AB',{size:17,sans:true,col:HL})+tx([CC[0],A[1]+20],'현 AB',{size:17,sans:true,col:BL})+tx([CC[0]+4,CC[1]+20],'O',{size:20}))}</div>
     <p>원 위의 두 점 A, B를 <b style="color:${HL}">원을 따라 이은 굽은 선</b>이 호 AB, <b style="color:${BL}">곧게 이은 선분</b>이 현 AB예요.</p>
     <div class="box" style="margin:0">호 AB는 기호로 <span class="rm">⌒AB</span>(AB 위에 ⌒)처럼 써요. 보통 길이가 짧은 쪽 호를 말해요.</div>`)+
   fold(3,'부채꼴 · 중심각 · 활꼴','반지름 2개 + 호, 현 + 호',`<div class="duo"><div class="figbox">${svgW(300,270,circ(CC,CR)+`<path d="${secD(CC,CR,40,140)}" fill="${HLs}" stroke="${INK}" stroke-width="2.4"/>`+angMk(CC,40,140,'중심각',{col:'#b83a3a',lr:46,size:16})+dot(CC)+tx([CC[0]+4,CC[1]+20],'O',{size:20}))}<div class="figcap"><b>부채꼴</b> = 반지름 2개 + 호</div></div>
     <div class="figbox">${svgW(300,270,circ(CC,CR)+`<path d="${arcD(CC,CR,40,140)} Z" fill="${BLs}" stroke="${INK}" stroke-width="2.4"/>`+dot(CC)+tx([CC[0]+4,CC[1]+20],'O',{size:20}))}<div class="figcap"><b>활꼴</b> = 현 + 호</div></div></div>
     <p>두 반지름과 호로 둘러싸인 도형이 ${T('부채꼴')}, 두 반지름이 이루는 각이 ${T('중심각')}이에요. 현과 호로 둘러싸인 도형은 ${T('활꼴')}이에요.</p>`)+
   fold(4,'헷갈리는 그림','꼭짓점이 중심인가?',`<div class="duo"><div class="figbox">${idFig('none-sector',mulberry(7))}<div class="figcap">꼭짓점이 중심이 아니에요 → 부채꼴 ✕</div></div>
     <div class="figbox">${svgW(300,270,circ(CC,CR)+`<path d="${secD(CC,CR,0,180)}" fill="#dcefe0" stroke="${INK}" stroke-width="2.4"/>`+dot(CC)+tx([CC[0],CC[1]+20],'O',{size:20}))}<div class="figcap">반원 → 부채꼴이면서 활꼴</div></div></div>
     <div class="box" style="margin:0">· 부채꼴은 꼭짓점이 꼭 <b>중심 O</b>, 두 변이 <b>반지름</b>이어야 해요.<br>· <b>반원</b>은 중심각이 180°인 부채꼴이에요. 지름도 현이라서 활꼴이기도 해요.</div>`));
  wireFolds(body,'arc')};
CONCEPT.cent=body=>{
  body.innerHTML=foldPanel('중심각과 호',`<p class="lead">한 원에서 부채꼴의 <b class="mark">호의 길이와 넓이는 중심각의 크기에 정비례</b>해요. 중심각이 2배면 호도 2배, 넓이도 2배.</p>`,
   fold(1,'중심각이 몇 배면, 호도 몇 배','40° 조각을 붙여 보기',`<div class="figbox">${svgW(300,270,circ(CC,CR,{col:'#9aa3b5',w:1.6})+[0,1,2].map(i=>`<path d="${secD(CC,CR,40*i,40*i+40)}" fill="${i?BLs:HLs}" stroke="${INK}" stroke-width="2.2"/>`).join('')+[0,1,2].map(i=>tx(pol(CC,CR+22,40*i+20),'3 cm',{size:17}))+dot(CC))}</div>
     <p>중심각이 40°인 부채꼴의 호가 3 cm이면, 120°는 40° 조각 <b>3개</b>라서 호는 3 × 3 = <b>9 cm</b>예요.</p>
     <div class="box" style="margin:0">① 중심각이 몇 배인지 구해요 (120 ÷ 40 = 3) → ② 호의 길이·넓이에도 똑같이 곱해요. 거꾸로 작아지면 나눠요.</div>`,true)+
   fold(2,'몇 배로 안 나눠지면, 비로','50° : 70° = 5 : 7',`<p style="margin-top:0">중심각 50°의 호가 10 cm일 때 70°의 호는? 70 ÷ 50은 딱 나누어떨어지지 않아요.</p>
     <div class="box">중심각의 비 50 : 70 = <b>5 : 7</b> → 호의 비도 5 : 7<br>5칸이 10 cm → 1칸 = 10 ÷ 5 = 2 cm → 7칸 = 2 × 7 = <b>14 cm</b></div>
     <p style="margin-bottom:0">원 위의 세 점이 원을 <b>2 : 3 : 4</b>로 나누면, 중심각도 2 : 3 : 4예요. 전체 9칸이 360°이므로 1칸 = 40°.</p>`)+
   fold(3,'현은 정비례하지 않아요','중심각 2배 ≠ 현 2배',`<div class="figbox">${(()=>{const P0=pol(CC,CR,20),P1=pol(CC,CR,80),P2=pol(CC,CR,140);return svgW(300,270,circ(CC,CR)+ln(CC,P0,{w:1.6})+ln(CC,P1,{w:1.6})+ln(CC,P2,{w:1.6})+ln(P0,P1,{col:HL,w:3.4})+ln(P1,P2,{col:HL,w:3.4})+ln(P0,P2,{col:BL,w:3.4,dash:'7 5'})+dot(CC)+angMk(CC,20,80,'60°',{size:16})+angMk(CC,80,140,'60°',{size:16,r:30}))})()}</div>
     <p>중심각 60° 두 개의 현(주황)을 이으면 꺾인 길이예요. 중심각 120°의 현(파랑)은 곧게 가니까 <b>더 짧아요</b>.</p>
     <div class="box" style="margin:0">· 중심각이 같으면 → 호의 길이도, 현의 길이도, 넓이도 같아요.<br>· 하지만 <b>현의 길이는 중심각에 정비례하지 않아요.</b> (2배보다 짧아요)</div>`));
  wireFolds(body,'cent')};
CONCEPT.sector=body=>{
  body.innerHTML=foldPanel('부채꼴의 호의 길이와 넓이',`<p class="lead">부채꼴은 <b class="mark">원의 ${FR('중심각','360')} 조각</b>이에요. 원 전체의 둘레와 넓이를 먼저 구하고 그만큼 나눠요.</p>`,
   fold(1,'원의 둘레와 넓이','2πr과 πr²',`<div class="figbox">${svgW(300,270,circ(CC,CR,{fill:'#eef2fa'})+dot(CC)+ln(CC,pol(CC,CR,0),{col:BL,w:3})+tx(pol(CC,48,12),'r',{it:true,col:BL}))}</div>
     <ul class="defs"><li><b>둘레</b><span>${T('원의 둘레')} = <span class="rm">2 × π × </span><i class="math">r</i> = <span class="rm">2π</span><i class="math">r</i></span></li><li><b>넓이</b><span>${T('원의 넓이')} = <span class="rm">π × </span><i class="math">r</i><span class="rm"> × </span><i class="math">r</i> = <span class="rm">π</span><i class="math">r</i><sup class="rm">2</sup></span></li></ul>
     <p style="margin-bottom:0">반지름이 6 cm이면 둘레 <span class="rm">12π cm</span>, 넓이 <span class="rm">36π cm²</span>예요. π는 계산하지 않고 그대로 붙여 써요.</p>`,true)+
   fold(2,'원의 몇 조각인가?','360 ÷ 중심각',`<div class="figbox">${svgW(300,270,circ(CC,CR)+`<path d="${secD(CC,CR,0,60)}" fill="${HLs}" stroke="${INK}" stroke-width="2.4"/>`+[60,120,180,240,300].map(a=>ln(CC,pol(CC,CR,a),{col:'#9aa3b5',w:1.4,dash:'5 5'})).join('')+dot(CC)+angMk(CC,0,60,'60°',{size:16})+tx(pol(CC,CR+24,30),'2π',{col:HL}))}</div>
     <p>반지름 6 cm, 중심각 60°인 부채꼴은 360 ÷ 60 = 6, 원을 <b>6조각</b> 낸 것 중 하나예요.<br>호의 길이 = 12π ÷ 6 = <b class="rm">2π cm</b> · 넓이 = 36π ÷ 6 = <b class="rm">6π cm²</b></p>
     <div class="box" style="margin:0">딱 나누어떨어지지 않으면 <b>× ${FR('중심각','360')}</b>을 해요. 예) 135° → ${FR(135,360)} = ${FR(3,8)}</div>`)+
   fold(3,'호의 길이로 넓이 구하기','½ × 호 × 반지름',`<div class="figbox">${svgW(300,250,`<path d="M 40 210 L 260 210 L 150 60 Z" fill="${HLs}" stroke="${INK}" stroke-width="2.2"/>`+ln([150,60],[150,210],{col:BL,w:2.6,dash:'6 5'})+tx([150,234],'밑변 = 호의 길이',{size:16,sans:true,col:HL})+tx([210,140],'높이 = 반지름',{size:16,sans:true,col:BL}))}</div>
     <p>부채꼴을 아주 잘게 잘라 모으면 <b>밑변이 호의 길이, 높이가 반지름인 삼각형</b>과 넓이가 같아요.</p>
     <div class="box" style="margin:0">(넓이) = ${FR(1,2)} × (호의 길이) × (반지름) → 중심각을 몰라도 돼요!<br>예) 반지름 6 cm, 호 4π cm → ${FR(1,2)} × 4π × 6 = <b class="rm">12π cm²</b></div>`));
  wireFolds(body,'sector')};
PREVIEW.arc={tb:'194~195쪽',core:[{h:'호와 현',b:'원 위의 두 점을 <b>굽게</b> 이으면 호, <b>곧게</b> 이으면 현<small>지름은 중심을 지나는 현 · 가장 긴 현</small>'},{h:'부채꼴과 활꼴',b:'<b>반지름 2개 + 호</b> → 부채꼴<br><b>현 + 호</b> → 활꼴<small>반원은 둘 다예요</small>'},{h:'중심각',b:'부채꼴에서 <b>두 반지름이 이루는 각</b><small>꼭짓점이 원의 중심 O</small>'}],
  words:['원','반지름','지름','호','현','부채꼴','중심각','활꼴'],ex:'꼭짓점이 원의 중심이 <b>아닌</b> 부채꼴 모양 → 부채꼴 ✕ · 반원 → 부채꼴 ○, 활꼴 ○'};
PREVIEW.cent={tb:'195~197쪽',core:[{h:'정비례',b:'중심각이 <b>2배, 3배</b>가 되면 호의 길이와 넓이도 <b>2배, 3배</b>'},{h:'비로 구하기',b:'중심각의 비 = 호의 길이의 비 = 넓이의 비<small>50 : 70 = 5 : 7</small>'},{h:'현은 예외',b:'현의 길이는 중심각에 <b>정비례하지 않아요</b>'}],
  words:['중심각','호의 길이','넓이','정비례','비'],ex:'40° → 3 cm 이면 120°(= 40° × 3) → 3 × 3 = <b>9 cm</b>'};
PREVIEW.sector={tb:'198~201쪽',core:[{h:'원 전체',b:'둘레 <b>2πr</b> · 넓이 <b>πr²</b>'},{h:'몇 조각?',b:'부채꼴 = 원의 <b>(중심각)/360</b> 조각<small>60° → 6조각 중 1조각</small>'},{h:'호로 넓이',b:'넓이 = <b>½ × 호의 길이 × 반지름</b>'}],
  words:['원의 둘레','원의 넓이','π','호의 길이','부채꼴의 넓이'],ex:'반지름 6 cm, 중심각 60° → 호 12π ÷ 6 = <b>2π cm</b> · 넓이 36π ÷ 6 = <b>6π cm²</b>'};

/* ── 문제 생성기 ── */
const DEF=[['원은 평면 위의 한 점 O에서 □에 있는 모든 점으로 이루어진 도형이다.','일정한 거리',['가장 가까운 거리','같은 방향','한 직선 위']],
  ['반지름은 원의 중심과 □을 이은 선분이다.','원 위의 한 점',['원 안의 한 점','원 밖의 한 점','현의 가운데 점']],
  ['지름은 원 위의 두 점을 이은 선분 중 □을 지나는 것이다.','원의 중심',['원 밖의 한 점','반지름의 가운데 점','호의 가운데 점']],
  ['호는 원 위의 두 점을 □을 따라 이은 곡선이다.','원',['직선','지름','반지름']],
  ['현은 원 위의 두 점을 이은 □이다.','선분',['곡선','호','반직선']],
  ['부채꼴은 원의 두 □과 호로 둘러싸인 도형이다.','반지름',['현','지름','중심각']],
  ['활꼴은 원의 호와 □으로 둘러싸인 도형이다.','현',['반지름 두 개','중심각','원의 중심']],
  ['중심각은 부채꼴에서 두 □이 이루는 각이다.','반지름',['현','호','지름']],
  ['반지름의 길이가 r인 원의 넓이는 □이다.','πr²',['2πr','πr','2πr²']],
  ['반지름의 길이가 r인 원의 둘레의 길이는 □이다.','2πr',['πr²','πr','4πr']],
  ['한 원에서 부채꼴의 호의 길이는 중심각의 크기에 □.','정비례한다',['반비례한다','관계없이 같다']],
  ['한 원에서 현의 길이는 중심각의 크기에 □.','정비례하지 않는다',['정비례한다','반비례한다']]];
const BOXH='<span class="cbox">□</span>';
GEN.arcDef=seed=>{const r=mulberry(seed),[s,ok,w]=DEF[seed%DEF.length];
  return{ptype:'arc:def',title:`□에 알맞은 것을 고르시오.<div class="cond">${s.replace('□',BOXH)}</div>`,fig:null,steps:[{q:'□에 알맞은 것은?',type:'choice',choices:shuffle(r,[ok,...w]),ans:ok,hint:'굽으면 호, 곧으면 현 · 반지름 2개 + 호는 부채꼴, 현 + 호는 활꼴이에요.',ok:s.replace('□',`<b>${ok}</b>`)}]}};
GEN.arcName=seed=>{const r=mulberry(seed),k=ID_KIND[seed%ID_KIND.length],ans=k.startsWith('none')?NONE:k,cat=NAME_CAT[k],fig=idFig(k,r);
  return{ptype:'arc:name',title:'원 O에서 <b>주황색으로 표시한 것</b>의 이름을 쓰시오.',fig:{svg:()=>`<div class="figbox">${fig}</div>`},finalQ:'주황색으로 표시한 것의 이름은?',steps:[
    {tag:'모양 보기',q:'주황색으로 표시한 것은 어떤 모양인가요?',type:'choice',choices:['곧은 선분','굽은 선','둘러싸인 도형','각'],ans:cat,hint:'선인지, 도형인지, 각인지 먼저 보세요. 선이면 곧은지 굽었는지 봐요.'},
    {tag:'이름 정하기',q:'이름은 무엇인가요?',type:'choice',choices:[...CAT_NAMES[cat],NONE],ans,hint:CAT_HINT[cat],ok:NAME_INFO[k]}]}};
const TF_T=['지름은 원의 중심을 지나는 현이다.','한 원에서 지름은 가장 긴 현이다.','반원은 중심각의 크기가 180°인 부채꼴이다.','반원은 활꼴이기도 하다.','부채꼴은 두 반지름과 호로 둘러싸인 도형이다.','활꼴은 현과 호로 둘러싸인 도형이다.','지름의 길이는 반지름의 길이의 2배이다.'];
const TF_F=[['현은 원 위의 두 점을 이은 곡선이다.','현은 곧은 선분이에요. 굽은 선은 호예요.'],['부채꼴의 꼭짓점은 원 위에 있다.','부채꼴의 꼭짓점은 원의 중심이에요.'],['활꼴은 두 반지름과 호로 둘러싸인 도형이다.','반지름 2개 + 호는 부채꼴이에요. 활꼴은 현 + 호예요.'],['지름은 현이 아니다.','지름도 원 위의 두 점을 이은 선분이라서 현이에요.'],['반원은 부채꼴이 아니다.','반원은 중심각이 180°인 부채꼴이에요.'],['중심각은 두 현이 이루는 각이다.','중심각은 두 반지름이 이루는 각이에요.']];
const CIRC5=['①','②','③','④','⑤'];
const tfQ=(r,T_,F_,pt_,head)=>{const[fs,why]=pick(r,F_),all=shuffle(r,[...shuffle(r,T_.slice()).slice(0,4),fs]),lab=all.map((x,i)=>CIRC5[i]+' '+x);
  return{ptype:pt_,title:head,fig:null,steps:[{q:'옳지 않은 것을 고르세요.',type:'choice',choices:lab,ans:lab[all.indexOf(fs)],hint:'하나씩 그림을 떠올려 확인해 보세요.',ok:why}]}};
GEN.arcTF=seed=>tfQ(mulberry(seed),TF_T,TF_F,'arc:tf','다음 중 옳지 않은 것은?');
GEN.arc=seed=>[GEN.arcDef,GEN.arcName,GEN.arcName,GEN.arcTF][seed%4](Math.floor(seed/4)+1);

/* 2차시: 중심각과 호 */
const ANG=[20,24,30,36,40,45,60,72,90];
GEN.centMul=seed=>{const r=mulberry(seed),area=r()<0.35;let a,b,L,x,k,up;
  for(;;){a=pick(r,ANG);k=pick(r,[2,3,4]);up=r()<0.6;if(up){b=a*k;if(a+b>300)continue;L=ri(r,2,9);x=L*k}else{if(a%k)continue;b=a/k;if(b<15||a+b>300)continue;const m=ri(r,2,7);L=m*k;x=m}break}
  const u=area?'cm²':'cm',w=area?'넓이':'호의 길이',fig=twoSec(a,b,`${L} ${u}`,`x ${u}`,area,r()<0.5);
  return{ptype:'cent:mul',sig:(up?'up':'down')+(area?'S':'L'),title:`그림과 같이 한 원에서 중심각의 크기가 ${a}°인 부채꼴의 ${w}가 ${L} ${u}일 때, 중심각의 크기가 ${b}°인 부채꼴의 ${w} <i class="math">x</i> ${u}를 구하시오.`,fig:{svg:()=>`<div class="figbox">${fig}</div>`},finalQ:`<i class="math">x</i>의 값은?`,steps:up?[
    {tag:'중심각이 몇 배인지',q:`${b}°는 ${a}°의 몇 배인가요?`,type:'num',ans:k,suffix:'배',hint:`${b} ÷ ${a}`,ok:`${b} = ${a} × ${k}`},
    {tag:`${w}도 같은 배`,q:`${w}도 ${k}배예요. <i class="math">x</i>는?`,type:'num',ans:x,suffix:u,hint:`${L} × ${k}`,ok:`${L} × ${k} = ${x}`}]:[
    {tag:'중심각이 몇 배인지',q:`큰 쪽 ${a}°는 작은 쪽 ${b}°의 몇 배인가요?`,type:'num',ans:k,suffix:'배',hint:`${a} ÷ ${b}`,ok:`${b}° = ${a}° ÷ ${k}`},
    {tag:`${w}도 같은 수로 나누기`,q:`구하는 부채꼴은 중심각이 ${k}로 나눈 크기예요. <i class="math">x</i>는?`,type:'num',ans:x,suffix:u,hint:`${L} ÷ ${k}`,ok:`${L} ÷ ${k} = ${x}`}]}};
GEN.centRatio=seed=>{const r=mulberry(seed),area=r()<0.35;let p,q,a,b;
  for(;;){p=ri(r,2,9);q=ri(r,2,9);if(p===q||gcd(p,q)!==1||p%q===0||q%p===0)continue;const g=pick(r,[5,10,15,20]);a=p*g;b=q*g;if(a+b>300||a<20||b<20)continue;break}
  const m=ri(r,1,4),L=p*m,x=q*m,u=area?'cm²':'cm',w=area?'넓이':'호의 길이',fig=twoSec(a,b,`${L} ${u}`,`x ${u}`,area,r()<0.5);
  const ok=`${p} : ${q}`,wr=[`${q} : ${p}`,`${a/5} : ${b/5}`!==ok?`${a/5} : ${b/5}`:`${p+1} : ${q}`,`${p} : ${q+1}`].filter(s=>s!==ok);
  return{ptype:'cent:ratio',sig:area?'S':'L',title:`그림과 같이 한 원에서 중심각의 크기가 ${a}°인 부채꼴의 ${w}가 ${L} ${u}일 때, 중심각의 크기가 ${b}°인 부채꼴의 ${w} <i class="math">x</i> ${u}를 구하시오.`,fig:{svg:()=>`<div class="figbox">${fig}</div>`},finalQ:`<i class="math">x</i>의 값은?`,steps:[
    {tag:'중심각의 비',q:`${a} : ${b}를 가장 간단한 자연수의 비로 나타내면?`,type:'choice',choices:shuffle(r,[ok,...[...new Set(wr)].slice(0,3)]),ans:ok,hint:`${a}와 ${b}를 같은 수로 나눠요. 두 수 모두 ${gcd(a,b)}로 나누어떨어져요.`,ok:`${w}의 비도 ${ok}예요.`},
    {tag:'한 칸의 크기',q:`${p}칸이 ${L} ${u}예요. 1칸은?`,type:'num',ans:m,suffix:u,hint:`${L} ÷ ${p}`},
    {tag:'구하는 칸 수만큼',q:`<i class="math">x</i>는 ${q}칸이에요. <i class="math">x</i>는?`,type:'num',ans:x,suffix:u,hint:`${m} × ${q}`,ok:`${m} × ${q} = ${x}`}]}};
GEN.centThree=seed=>{const r=mulberry(seed);let a,b,c,t;for(;;){t=pick(r,[6,8,9,10,12,15,18,20]);a=ri(r,1,t-2);b=ri(r,1,t-a-1);c=t-a-b;if(c>=1&&new Set([a,b,c]).size>=2&&Math.min(a,b,c)*6>=t&&Math.max(a,b,c)*2<=t)break}
  const one=360/t,want=pick(r,[['AB',a],['BC',b],['CA',c]]),fig=three(a,b,c),arc=s=>`<span class="rm">⌒</span>${s}`;
  return{ptype:'cent:three',title:`그림의 원 O에서 ${arc('AB')} : ${arc('BC')} : ${arc('CA')} = ${a} : ${b} : ${c}일 때, ${arc(want[0])}에 대한 중심각의 크기를 구하시오.`,fig:{svg:()=>`<div class="figbox">${fig}</div>`},finalQ:`${arc(want[0])}에 대한 중심각은 몇 도인가요?`,steps:[
    {tag:'전체 칸 수',q:'호의 비를 모두 더하면 몇 칸인가요?',type:'num',ans:t,suffix:'칸',hint:`${a} + ${b} + ${c}`,ok:`원 한 바퀴(360°)가 ${t}칸이에요.`},
    {tag:'1칸의 중심각',q:'1칸에 대한 중심각은 몇 도인가요?',type:'num',ans:one,suffix:'°',hint:`360 ÷ ${t}`},
    {tag:'구하는 칸 수만큼',q:`${arc(want[0])}는 ${want[1]}칸이에요. 중심각은?`,type:'num',ans:one*want[1],suffix:'°',hint:`${one} × ${want[1]}`,ok:`${one} × ${want[1]} = ${one*want[1]}°`}]}};
const CT_T=['한 원에서 호의 길이는 중심각의 크기에 정비례한다.','한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례한다.','한 원에서 중심각의 크기가 같은 두 부채꼴의 호의 길이는 같다.','한 원에서 길이가 같은 두 호에 대한 중심각의 크기는 같다.','한 원에서 중심각의 크기가 같은 두 현의 길이는 같다.','한 원에서 중심각이 3배가 되면 호의 길이도 3배가 된다.'];
const CT_F=[['한 원에서 현의 길이는 중심각의 크기에 정비례한다.','현의 길이는 중심각에 정비례하지 않아요.'],['한 원에서 중심각이 2배가 되면 현의 길이도 2배가 된다.','현은 2배보다 짧아요. 꺾인 길이보다 곧은 길이가 짧거든요.'],['한 원에서 중심각이 2배가 되면 부채꼴의 넓이는 4배가 된다.','넓이도 중심각에 정비례해서 2배예요.'],['한 원에서 길이가 같은 두 호에 대한 중심각의 크기는 다를 수 있다.','한 원에서 호의 길이가 같으면 중심각도 같아요.']];
GEN.centTF=seed=>tfQ(mulberry(seed),CT_T,CT_F,'cent:tf','다음 중 옳지 않은 것은?');
GEN.cent=seed=>[GEN.centMul,GEN.centMul,GEN.centRatio,GEN.centThree,GEN.centTF][seed%5](Math.floor(seed/5)+1);

/* 3차시: 호의 길이와 넓이 */
const TH=[30,40,45,60,72,80,90,100,120,135,144,150,160,180,200,210,225,240,270];
const fracCh=(r,th)=>{const ok=frT(th,360),c=[frT(th,180),frT(360-th,360),frT(1,Math.max(2,Math.round(360/th)+1)),'1/2','1/3','1/4','2/3','3/4','1/6','5/6','3/8','5/12','1/5','2/5'].filter(x=>x!==ok);return shuffle(r,[ok,...[...new Set(c)].slice(0,3)])};
GEN.sectorCirc=seed=>{const r=mulberry(seed),area=r()<0.5,useD=r()<0.3,rr=ri(r,2,12),d=rr*2;
  const fig=svgW(300,270,circ(CC,CR,{fill:area?'#eef2fa':'none'})+dot(CC)+(useD?ln(pol(CC,CR,180),pol(CC,CR,0),{col:BL,w:3})+tx([CC[0],CC[1]-18],`${d} cm`,{size:20}):ln(CC,pol(CC,CR,0),{col:BL,w:3})+tx(pol(CC,48,14),`${rr} cm`,{size:20})),'원');
  const S=[];if(useD)S.push({tag:'반지름 구하기',q:'반지름은 몇 cm인가요?',type:'num',ans:rr,suffix:'cm',hint:`반지름 = 지름 ÷ 2 = ${d} ÷ 2`});
  S.push({tag:'공식 고르기',q:`원의 ${area?'넓이':'둘레의 길이'}를 구하는 식은?`,type:'choice',choices:shuffle(r,['2 × π × r','π × r × r','π × r','2 × π × r × r']),ans:area?'π × r × r':'2 × π × r',hint:area?`${T('원의 넓이')} = π × 반지름 × 반지름`:`${T('원의 둘레')} = 2 × π × 반지름`},
    {tag:'계산하기',q:`원의 ${area?'넓이':'둘레의 길이'}는?`,type:'pi',ans:area?rr*rr:2*rr,suffix:area?'cm²':'cm',hint:area?`π × ${rr} × ${rr} → 숫자를 곱하고 π를 붙여요.`:`2 × π × ${rr} → 숫자를 곱하고 π를 붙여요.`,ok:area?`π × ${rr}² = ${rr*rr}π cm²`:`2 × π × ${rr} = ${2*rr}π cm`});
  return{ptype:'sector:circ',sig:(useD?'d':'r')+(area?'S':'L'),title:`${useD?'지름':'반지름'}의 길이가 ${useD?d:rr} cm인 원의 ${area?'넓이':'둘레의 길이'}를 구하시오.`,fig:{svg:()=>`<div class="figbox">${fig}</div>`},finalQ:`원의 ${area?'넓이':'둘레의 길이'}는?`,steps:S}};
function secCore(seed,area){const r=mulberry(seed);let rr,th,co;for(;;){rr=ri(r,2,12);th=pick(r,TH);co=area?rr*rr*th/360:rr*th/180;if(Number.isInteger(co)&&co>0)break}
  const full=area?rr*rr:2*rr,u=area?'cm²':'cm',w=area?'넓이':'호의 길이',cw=area?'넓이':'둘레의 길이',fo=frT(th,360),mid=th>180?270:pick(r,[90,90,60,120]);
  const fig=vis=>secFig({th,mid,rLab:`${rr} cm`,aLab:`${th}°`,shade:area,hlArc:!area&&vis,arcLab:area?null:'? cm',ghost:vis});
  return{ptype:area?'sector:area':'sector:arc',title:`반지름의 길이가 ${rr} cm이고 중심각의 크기가 ${th}°인 부채꼴의 ${w}를 구하시오.`,fig:{svg:vis=>`<div class="figbox">${fig(vis)}</div>`},finalQ:`부채꼴의 ${w}는?`,steps:[
    {tag:`원 전체의 ${cw}`,q:`반지름이 ${rr} cm인 원의 ${cw}는?`,type:'pi',ans:full,suffix:u,hint:area?`π × ${rr} × ${rr}`:`2 × π × ${rr}`},
    {tag:'원의 몇 분의 몇 조각인지',q:`중심각 ${th}°인 부채꼴은 원의 몇 분의 몇인가요? (${th}/360을 약분)`,type:'choice',choices:fracCh(r,th),ans:fo,hint:`${th}/360을 약분해요. 두 수를 같은 수로 계속 나눠 보세요.`},
    {tag:'곱하기',q:`${full}π × ${fo} = ?`,type:'pi',ans:co,suffix:u,hint:`${full} × ${fo}를 먼저 계산하고 π를 붙여요.`,ok:`${full}π × ${fo} = ${co}π ${u}`}]}}
GEN.sectorArc=seed=>secCore(seed,false);
GEN.sectorArea=seed=>secCore(seed,true);
GEN.sectorLA=seed=>{const r=mulberry(seed);let rr,k,th;for(;;){rr=ri(r,3,12);k=ri(r,2,12);th=180*k/rr;if((k*rr)%2===0&&th>=30&&th<=300&&Number.isInteger(th))break}
  const S=k*rr/2,fig=vis=>secFig({th,mid:th>180?270:90,rLab:`${rr} cm`,shade:true,arcLab:`${k}π cm`,hlArc:vis});
  return{ptype:'sector:la',title:`반지름의 길이가 ${rr} cm이고 호의 길이가 ${k}π cm인 부채꼴의 넓이를 구하시오.`,fig:{svg:vis=>`<div class="figbox">${fig(vis)}</div>`},finalQ:'부채꼴의 넓이는?',steps:[
    {tag:'공식 고르기',q:'중심각을 모를 때 부채꼴의 넓이를 구하는 식은?',type:'choice',choices:shuffle(r,['1/2 × (호의 길이) × (반지름)','(호의 길이) × (반지름)','1/2 × (반지름) × (반지름)','2 × (호의 길이) × (반지름)']),ans:'1/2 × (호의 길이) × (반지름)',hint:'삼각형의 넓이(½ × 밑변 × 높이)와 닮았어요. 밑변 = 호, 높이 = 반지름.'},
    {tag:'계산하기',q:`1/2 × ${k}π × ${rr} = ?`,type:'pi',ans:S,suffix:'cm²',hint:`${k} × ${rr} ÷ 2를 계산하고 π를 붙여요.`,ok:`½ × ${k}π × ${rr} = ${S}π cm²`}]}};
GEN.sectorAng=seed=>{const r=mulberry(seed);let rr,k,th;for(;;){rr=ri(r,2,12);k=ri(r,1,2*rr-1);th=180*k/rr;if(Number.isInteger(th)&&th>=20&&th<=300)break}
  const fo=frT(k,2*rr),fig=vis=>secFig({th,mid:th>180?270:90,rLab:`${rr} cm`,aLab:'x°',arcLab:`${k}π cm`,hlArc:vis,ghost:vis});
  const ch=shuffle(r,[fo,...[...new Set([frT(k,rr),frT(2*rr-k,2*rr),frT(k,4*rr),frT(k+1,2*rr)])].filter(x=>x!==fo)].slice(0,4));
  return{ptype:'sector:ang',title:`반지름의 길이가 ${rr} cm이고 호의 길이가 ${k}π cm인 부채꼴의 중심각의 크기를 구하시오.`,fig:{svg:vis=>`<div class="figbox">${fig(vis)}</div>`},finalQ:'중심각은 몇 도인가요?',steps:[
    {tag:'원 전체의 둘레',q:`반지름이 ${rr} cm인 원의 둘레의 길이는?`,type:'pi',ans:2*rr,suffix:'cm',hint:`2 × π × ${rr}`},
    {tag:'원의 몇 분의 몇 조각인지',q:`호 ${k}π cm는 둘레 ${2*rr}π cm의 몇 분의 몇인가요?`,type:'choice',choices:ch,ans:fo,hint:`${k}/${2*rr}을 약분해요.`},
    {tag:'중심각 구하기',q:`중심각은 360° × ${fo}. 몇 도인가요?`,type:'num',ans:th,suffix:'°',hint:`360 × ${fo}`,ok:`360 × ${fo} = ${th}°`}]}};
GEN.sector=seed=>[GEN.sectorCirc,GEN.sectorArc,GEN.sectorArea,GEN.sectorArea,GEN.sectorLA,GEN.sectorAng][seed%6](Math.floor(seed/6)+1);

/* ── 유형 ── */
Object.assign(PTYPES,{
  arc:[{no:1,nm:'뜻 빈칸 채우기',tb:'개념',key:'<b>굽으면 호, 곧으면 현</b> · 반지름 2개 + 호 → <b>부채꼴</b> · 현 + 호 → <b>활꼴</b> · 두 반지름이 이루는 각 → <b>중심각</b>',pt:['arc:def'],src:['arcDef']},
    {no:2,nm:'그림 보고 이름 고르기',tb:'기초',key:'① 선분 · 굽은 선 · 도형 · 각 중 무엇인지 → ② 끝점이 어디 있는지, 꼭짓점이 <b>중심</b>인지 보기',pt:['arc:name'],src:['arcName']},
    {no:3,nm:'옳지 않은 것 고르기',tb:'기초',key:'지름도 <b>현</b> · 반원은 <b>부채꼴이면서 활꼴</b> · 부채꼴의 꼭짓점은 <b>중심</b>',pt:['arc:tf'],src:['arcTF']}],
  cent:[{no:1,nm:'중심각 비교 ① 몇 배',tb:'기초',key:'중심각이 <b>몇 배</b>면 호의 길이·넓이도 <b>몇 배</b> (작아지면 나누기)',pt:['cent:mul'],src:['centMul']},
    {no:2,nm:'중심각 비교 ② 비',tb:'기초',key:'중심각의 비 = 호의 길이의 비 = 넓이의 비 → <b>1칸</b>을 구하고 칸 수만큼 곱하기',pt:['cent:ratio'],src:['centRatio']},
    {no:3,nm:'호의 비로 중심각 구하기',tb:'204쪽 · 스스로 마무리하기',key:'호의 비 = 중심각의 비 · 한 바퀴 <b>360°</b>를 전체 칸 수로 나누기',pt:['cent:three'],src:['centThree']},
    {no:4,nm:'정비례 ○× (현은 예외)',tb:'기초',key:'호의 길이·넓이는 중심각에 <b>정비례</b> · <b>현</b>의 길이는 정비례하지 않아요',pt:['cent:tf'],src:['centTF']}],
  sector:[{no:1,nm:'원의 둘레와 넓이',tb:'기초',key:'둘레 <b>2πr</b> · 넓이 <b>πr²</b> · 지름이 주어지면 먼저 ÷ 2',pt:['sector:circ'],src:['sectorCirc']},
    {no:2,nm:'반지름 · 중심각 → 호의 길이',tb:'기초',key:'원의 둘레 × <b>(중심각)/360</b>',pt:['sector:arc'],src:['sectorArc']},
    {no:3,nm:'반지름 · 중심각 → 넓이',tb:'기초',key:'원의 넓이 × <b>(중심각)/360</b>',pt:['sector:area'],src:['sectorArea']},
    {no:4,nm:'반지름 · 호의 길이 → 넓이',tb:'기초',key:'넓이 = <b>½ × 호의 길이 × 반지름</b> (중심각 몰라도 OK)',pt:['sector:la'],src:['sectorLA']},
    {no:5,nm:'반지름 · 호의 길이 → 중심각',tb:'201쪽 · 스스로 점검하기',key:'호 ÷ 원의 둘레 = 원의 몇 분의 몇 → <b>360° ×</b> 그 분수',pt:['sector:ang'],src:['sectorAng']}]});
['arc','cent','sector'].forEach(lid=>{PTYPES[lid].forEach(T_=>{const g=tyKey(lid,T_.no);GEN[g]=seed=>GEN[T_.src[0]](seed);LESSON_OF[g]=lid});
  GEN['mix_'+lid]=seed=>{const L=PTYPES[lid];return GEN[tyKey(lid,L[seed%L.length].no)](Math.floor(seed/L.length)+1)};LESSON_OF['mix_'+lid]=lid});
Object.assign(STEPGEN,{arc:GEN.arcName,cent:GEN.centMul,sector:GEN.sectorArc});
['arc','cent','sector'].forEach(l=>{LESSON_OF[l]=l});
['arcDef','arcName','arcTF'].forEach(g=>LESSON_OF[g]='arc');['centMul','centRatio','centThree','centTF'].forEach(g=>LESSON_OF[g]='cent');['sectorCirc','sectorArc','sectorArea','sectorLA','sectorAng'].forEach(g=>LESSON_OF[g]='sector');
Object.assign(CALC_FOR,{arc:['pi','frac'],cent:['mul','div','fracbase'],sector:['pi','frac','fracbase']});
Object.assign(PTYPE_NM,{'arc:def':'1차시 · 뜻 빈칸','arc:name':'1차시 · 그림 보고 이름','arc:tf':'1차시 · 옳지 않은 것','cent:mul':'2차시 · 중심각 몇 배','cent:ratio':'2차시 · 중심각의 비','cent:three':'2차시 · 호의 비로 중심각','cent:tf':'2차시 · 정비례 ○×',
  'sector:circ':'3차시 · 원의 둘레와 넓이','sector:arc':'3차시 · 부채꼴의 호의 길이','sector:area':'3차시 · 부채꼴의 넓이','sector:la':'3차시 · 호로 넓이','sector:ang':'3차시 · 중심각 구하기'});
const add=(k,o)=>{if(!TERMS[k])TERMS[k]=o};
add('원',{k:'원과 부채꼴',b:'<p>평면 위의 한 점 O에서 일정한 거리에 있는 모든 점으로 이루어진 도형이에요. 점 O가 원의 중심이에요.</p>'});
add('반지름',{k:'원과 부채꼴',b:'<p>원의 중심과 원 위의 한 점을 이은 선분이에요.</p>'});
add('지름',{k:'원과 부채꼴',b:'<p>원의 중심을 지나는 현이에요. 한 원에서 가장 긴 현이고, 반지름의 2배예요.</p>'});
add('호',{k:'원과 부채꼴',b:'<p>원 위의 두 점 A, B를 원을 따라 이은 굽은 선이에요. 기호 <span class="rm">⌒AB</span>로 나타내요.</p>'});
add('현',{k:'원과 부채꼴',b:'<p>원 위의 두 점을 이은 <b>선분</b>이에요. 중심을 지나는 현이 지름이에요.</p>'});
add('부채꼴',{k:'원과 부채꼴',b:'<p>원의 두 반지름과 호로 둘러싸인 도형이에요. 꼭짓점은 원의 중심이에요.</p>'});
add('중심각',{k:'원과 부채꼴',b:'<p>부채꼴에서 두 반지름이 이루는 각이에요.</p>'});
add('활꼴',{k:'원과 부채꼴',b:'<p>원의 현과 호로 둘러싸인 도형이에요. 반원은 부채꼴이면서 활꼴이에요.</p>'});

/* ── 더 알아보기 ── */
function nameAct(host,done){const r=mulberry(newSeed()),L=shuffle(r,ID_KIND.slice()).slice(0,6);
  rounds(host,L,(k,api)=>{api.fig(`<div class="figbox">${idFig(k,r)}</div>`);api.q('주황색으로 표시한 것의 이름은?');const ans=k.startsWith('none')?NONE:k;
    choiceAsk(api,['반지름','지름','현','호','부채꼴','활꼴','중심각',NONE],ans,{hint:CAT_HINT[NAME_CAT[k]]},()=>{api.msg(`<span class="ok">○ ${NAME_INFO[k]}</span>`);api.next(ans)})},done,'c:name')}
function doubleAct(host,done){const r=mulberry(newSeed()),L=range(4).map(()=>({a:pick(r,[20,30,40,45,60]),L:ri(r,2,6),k:ri(r,2,5)})).filter(x=>x.a*x.k<=300);
  rounds(host,L,(x,api)=>{const C=[160,150],R=104;let s=circ(C,R,{col:'#9aa3b5',w:1.6});for(let i=0;i<x.k;i++)s+=`<path d="${secD(C,R,x.a*i,x.a*i+x.a)}" fill="${i?BLs:HLs}" stroke="${INK}" stroke-width="2"/>`+tx(pol(C,R+24,x.a*i+x.a/2),`${x.L} cm`,{size:16});
    api.fig(`<div class="figbox">${svgW(320,300,s+dot(C))}</div>`);api.q(`중심각 ${x.a}°인 부채꼴의 호가 ${x.L} cm예요. 이 조각 ${x.k}개를 붙인 중심각 ${x.a*x.k}°의 부채꼴의 호는 몇 cm일까요?`);
    numAsk(api,x.L*x.k,{suffix:'cm',hint:`조각마다 ${x.L} cm씩, ${x.k}조각이에요.`},()=>{api.msg(`<span class="ok">○ 중심각 ${x.k}배 → 호도 ${x.k}배, ${x.L} × ${x.k} = ${x.L*x.k} cm</span>`);api.next(`${x.a*x.k}° → ${x.L*x.k} cm`)})},done,'c:double')}
function chordAct(host,done){const L=[30,45,60,80];
  rounds(host,L,(a,api)=>{const C=[160,150],R=104,ch=t=>2*5*Math.sin(rad(t/2)),c1=f1(ch(a)),c2=f1(ch(2*a));
    const P0=pol(C,R,0),P1=pol(C,R,a),P2=pol(C,R,2*a);
    api.fig(`<div class="figbox">${svgW(320,300,circ(C,R)+ln(C,P0,{w:1.4})+ln(C,P1,{w:1.4})+ln(C,P2,{w:1.4})+ln(P0,P1,{col:HL,w:3.4})+ln(P1,P2,{col:HL,w:3.4})+ln(P0,P2,{col:BL,w:3.4,dash:'7 5'})+dot(C)+angMk(C,0,a,a+'°',{size:15})+angMk(C,a,2*a,a+'°',{size:15,r:30}))}</div>`);
    api.q(`반지름 5 cm인 원에서 중심각 ${a}°의 현은 약 ${c1} cm예요. 중심각을 2배(${2*a}°)로 하면 현(파랑)은?`);
    choiceAsk(api,['2배보다 짧아요','정확히 2배예요','2배보다 길어요'],'2배보다 짧아요',{hint:'주황 두 개를 이은 꺾인 길이와 파랑 곧은 길이를 비교해 보세요.'},()=>{api.msg(`<span class="ok">○ 약 ${c2} cm, ${f1(c1*2)} cm보다 짧아요. 현은 중심각에 정비례하지 않아요.</span>`);api.next(`${2*a}° → 약 ${c2} cm`)})},done,'c:chord')}
function pieceAct(host,done){const r=mulberry(newSeed()),L=shuffle(r,[[6,60],[4,90],[3,120],[5,72],[2,180],[8,45]]).slice(0,4).map(([n,th])=>({th,n,rr:(n/gcd(n,2))*pick(r,n>4?[1]:[1,2,3])}));
  rounds(host,L,(x,api)=>{const C=[160,150],R=104;let s=circ(C,R)+`<path d="${secD(C,R,0,x.th)}" fill="${HLs}" stroke="${INK}" stroke-width="2.4"/>`;for(let i=1;i<x.n;i++)s+=ln(C,pol(C,R,x.th*i),{col:'#9aa3b5',w:1.4,dash:'5 5'});
    api.fig(`<div class="figbox">${svgW(320,300,s+dot(C)+angMk(C,0,x.th,x.th+'°',{size:16}))}</div>`);api.q(`중심각 ${x.th}°인 부채꼴은 원을 똑같이 몇 조각 낸 것 중 하나일까요?`);
    numAsk(api,x.n,{suffix:'조각',hint:`360 ÷ ${x.th}`},()=>{api.q(`반지름이 ${x.rr} cm이면 원의 둘레는 ${2*x.rr}π cm예요. 이 부채꼴의 호는 몇 π cm일까요?`);
      const co=2*x.rr/x.n;numAsk(api,co,{suffix:'π cm',hint:`${2*x.rr} ÷ ${x.n}`},()=>{api.msg(`<span class="ok">○ ${2*x.rr}π ÷ ${x.n} = ${co}π cm</span>`);api.next(`${x.th}° → 원의 1/${x.n}`)})})},done,'c:pieces')}
function triAct(host,done){const r=mulberry(newSeed()),L=range(4).map(()=>{let rr,k;do{rr=ri(r,2,10);k=ri(r,2,10)}while((rr*k)%2);return{rr,k}});
  rounds(host,L,(x,api)=>{api.fig(`<div class="figbox">${svgW(320,240,`<path d="M 40 200 L 280 200 L 160 50 Z" fill="${HLs}" stroke="${INK}" stroke-width="2.2"/>`+ln([160,50],[160,200],{col:BL,w:2.4,dash:'6 5'})+tx([160,222],`밑변 = 호 ${x.k}π cm`,{size:16,sans:true,col:HL})+tx([214,130],`높이 = ${x.rr} cm`,{size:16,sans:true,col:BL}))}</div>`);
    api.q(`부채꼴을 잘게 잘라 모으면 이런 삼각형과 넓이가 같아요. 넓이는 몇 π cm²일까요?`);
    numAsk(api,x.rr*x.k/2,{suffix:'π cm²',hint:`½ × ${x.k} × ${x.rr}`},()=>{api.msg(`<span class="ok">○ ½ × ${x.k}π × ${x.rr} = ${x.rr*x.k/2}π cm²</span>`);api.next(`${x.rr*x.k/2}π cm²`)})},done,'c:tri')}
EXPLORE.arc=body=>actNav(body,'arc',[{key:'name',t:'이름 맞히기',lead:'주황색으로 표시한 것이 무엇인지 골라요. 함정 그림도 섞여 있어요.',mount:nameAct}]);
EXPLORE.cent=body=>actNav(body,'cent',[{key:'double',t:'조각 붙이기',lead:'같은 부채꼴 조각을 여러 개 붙이면 호는 어떻게 될까요?',mount:doubleAct},{key:'chord',t:'현도 2배가 될까?',lead:'중심각을 2배로 하면 현의 길이도 2배가 될지 비교해요.',mount:chordAct}]);
EXPLORE.sector=body=>actNav(body,'sector',[{key:'pieces',t:'원의 몇 조각?',lead:'부채꼴이 원의 몇 조각인지 알면 호의 길이를 구할 수 있어요.',mount:pieceAct},{key:'tri',t:'부채꼴을 삼각형으로',lead:'잘게 자른 부채꼴을 모으면 삼각형이 돼요.',mount:triAct}]);

/* ── 등록 ── */
LESSONS.push(
  {id:'arc',no:1,title:'원과 부채꼴',sub:'호 · 현 · 부채꼴 · 중심각 · 활꼴',tb:'04 원과 부채꼴 · 194~195쪽',ready:true,unit:'circle'},
  {id:'cent',no:2,title:'중심각과 호',sub:'중심각이 몇 배면 호도 몇 배',tb:'04 원과 부채꼴 · 195~197쪽',ready:true,unit:'circle'},
  {id:'sector',no:3,title:'부채꼴의 호의 길이와 넓이',sub:'원의 (중심각)/360 조각',tb:'05 부채꼴의 호의 길이와 넓이 · 198~201쪽',ready:true,unit:'circle'});
BADGES.push({k:'cname',unit:'circle',nm:'원 이름 박사',d:'이름 맞히기 6개 끝내기',ok:M=>!!M.once['c:name']},{k:'cpiece',unit:'circle',nm:'조각 탐정',d:'원의 몇 조각 탐구 끝내기',ok:M=>!!M.once['c:pieces']});
window.CIRCLE_GENS=['arcDef','arcName','arcTF','centMul','centRatio','centThree','centTF','sectorCirc','sectorArc','sectorArea','sectorLA','sectorAng'];
})();
/*</CIRCLE>*/
