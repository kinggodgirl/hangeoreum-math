/* [T14] Ⅳ. 좌표평면과 그래프 (unit: 'graph') — 1.coord · 2.graph · 3.prop · 4.propg · 5.inv · 6.invg
   [T35] 정비례·반비례를 '뜻과 식(prop·inv) / 그래프(propg·invg)'로 나눠 19차시가 됐어요. */
(()=>{
'use strict';

/* ── 1. 단원 및 차시 등록 (01-core.js 수정 없이 런타임 추가) ── */
if(typeof UNIT_INFO==='object'&&UNIT_INFO){
  UNIT_INFO.graph={name:'좌표평면과 그래프',ch:'좌표평면과 그래프',sub:'1학년 1학기 · Ⅳ단원',start:'좌표평면과 그래프 시작하기'};
}
if(typeof OPEN_UNITS!=='undefined'&&Array.isArray(OPEN_UNITS)){
  const s=typeof SITE==='object'&&SITE?SITE:{};
  if((!s.units||!s.units.length)&&UNIT_ID==='solid'&&!OPEN_UNITS.includes('graph'))OPEN_UNITS.push('graph');
}
if(typeof UNITS!=='undefined'&&Array.isArray(UNITS)){
  UNITS.forEach(u=>{if(u[0]==='좌표평면과 그래프')u[1]=true});
}

const G_LESSONS=[
  {id:'coord',no:1,title:'순서쌍과 좌표',sub:'수직선·좌표평면 위 점의 위치와 사분면',tb:'01 순서쌍과 좌표 · 108~112쪽',ready:true,unit:'graph'},
  {id:'graph',no:2,title:'그래프와 그 해석',sub:'변화를 그림으로 읽고 그릇 모양 맞추기',tb:'02 그래프 · 113~119쪽',ready:true,unit:'graph'},
  {id:'prop',no:3,title:'정비례의 뜻과 식',sub:'x가 2배, 3배 → y도 2배, 3배 (y = ax)',tb:'03 정비례 · 120~121쪽',ready:true,unit:'graph'},
  {id:'propg',no:4,title:'정비례의 그래프',sub:'원점을 지나는 직선, a의 부호로 방향 보기',tb:'03 정비례 · 122~126쪽',ready:true,unit:'graph'},
  {id:'inv',no:5,title:'반비례의 뜻과 식',sub:'x와 y의 곱이 일정 (y = a/x)',tb:'04 반비례 · 127~128쪽',ready:true,unit:'graph'},
  {id:'invg',no:6,title:'반비례의 그래프',sub:'축에 닿지 않는 한 쌍의 곡선, a의 부호로 사분면 보기',tb:'04 반비례 · 129~131쪽',ready:true,unit:'graph'}
];
if(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS)){
  G_LESSONS.forEach(L=>{if(!LESSONS.some(x=>x.id===L.id))LESSONS.push(L)});
}

/* ── 2. SVG 도우미 (수직선 · 좌표평면 · 꺾은선 그래프 · 물병) ── */
const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',RD='#b83a3a',OK='#2b7a4b',GY='#94a3b8';
const MF="'Times New Roman',Times,serif",SF="'IBM Plex Sans KR',sans-serif";
const f1=n=>Math.round(n*10)/10;
const neg=n=>n<0?'−'+(-n):String(n);
const CIRC5=['①','②','③','④','⑤'];

const gBox=(w,h,inner,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="cfig" role="img" aria-label="${lab||'좌표 그림'}" style="max-width:${w}px;width:100%;font-family:${MF}">${inner}</svg>`;

function coordNLSVG(pts,opt={}){
  const W=330,H=92,pad=24,min=-5,max=5,ux=(W-2*pad)/(max-min),X=v=>pad+(v-min)*ux,y=52;
  let s=`<line x1="12" y1="${y}" x2="${W-12}" y2="${y}" stroke="${INK}" stroke-width="2.2"/>`+
    `<polygon points="${W-8},${y} ${W-16},${y-5} ${W-16},${y+5}" fill="${INK}"/>`;
  for(let v=min;v<=max;v++){
    const x=f1(X(v));
    s+=`<line x1="${x}" y1="${y-6}" x2="${x}" y2="${y+6}" stroke="${INK}" stroke-width="${v===0?2.2:1.3}"/>`+
      `<text x="${x}" y="${y+24}" text-anchor="middle" font-size="14" fill="${v<0?BL:v>0?RD:INK}">${neg(v)}</text>`;
  }
  (pts||[]).forEach(p=>{
    const x=f1(X(p.v));
    s+=`<circle cx="${x}" cy="${y}" r="6" fill="${p.col||HL}" stroke="${INK}" stroke-width="1.6"/>`+
      `<text x="${x}" y="${y-16}" text-anchor="middle" font-size="16" font-weight="700" fill="${p.col||HL}">${p.lab}</text>`;
  });
  return gBox(W,H,s,'수직선 위의 점');
}

function planeGridSVG(opt={}){
  const W=270,H=270,rng=opt.rng||5,cx=W/2,cy=H/2,step=(W-48)/(2*rng);
  const X=v=>f1(cx+v*step),Y=v=>f1(cy-v*step);
  let s='';
  for(let i=-rng;i<=rng;i++){
    const st=i===0?1.8:0.8,cl=i===0?INK:'#d5dce8';
    s+=`<line x1="${X(-rng)}" y1="${Y(i)}" x2="${X(rng)}" y2="${Y(i)}" stroke="${cl}" stroke-width="${st}"/>`;
    s+=`<line x1="${X(i)}" y1="${Y(-rng)}" x2="${X(i)}" y2="${Y(rng)}" stroke="${cl}" stroke-width="${st}"/>`;
    if(i!==0&&i%(rng>6?2:1)===0){
      s+=`<text x="${X(i)}" y="${cy+15}" text-anchor="middle" font-size="11" fill="${GY}">${neg(i)}</text>`;
      s+=`<text x="${cx-8}" y="${Y(i)+4}" text-anchor="end" font-size="11" fill="${GY}">${neg(i)}</text>`;
    }
  }
  s+=`<text x="${X(rng)+10}" y="${cy+4}" font-size="14" font-style="italic" fill="${INK}">x</text>`+
    `<text x="${cx+8}" y="${Y(rng)-4}" font-size="14" font-style="italic" fill="${INK}">y</text>`+
    `<text x="${cx-10}" y="${cy+14}" font-size="13" font-style="italic" fill="${INK}">O</text>`;
  if(opt.quadHL){
    const qm={1:[cx,cy-rng*step,rng*step,rng*step],2:[cx-rng*step,cy-rng*step,rng*step,rng*step],3:[cx-rng*step,cy,rng*step,rng*step],4:[cx,cy,rng*step,rng*step]}[opt.quadHL];
    if(qm)s=`<rect x="${qm[0]}" y="${qm[1]}" width="${qm[2]}" height="${qm[3]}" fill="${HLs}" fill-opacity="0.55"/>`+s;
  }
  if(opt.lineA!=null){
    const a=opt.lineA;
    const pts=[];
    for(let x=-rng;x<=rng;x+=0.5){const y=a*x;if(Math.abs(y)<=rng+0.2)pts.push(`${X(x)},${Y(y)}`)}
    if(pts.length>=2)s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="${BL}" stroke-width="2.6"/>`;
  }
  if(opt.invA!=null){
    const a=opt.invA;
    [-1,1].forEach(sg=>{
      const pts=[];
      for(let k=1;k<=40;k++){const x=sg*(0.25+k*(rng-0.25)/40),y=a/x;if(Math.abs(y)<=rng+0.2)pts.push(`${X(x)},${Y(y)}`)}
      if(pts.length>=2)s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="${BL}" stroke-width="2.6"/>`;
    });
  }
  (opt.pts||[]).forEach(p=>{
    s+=`<line x1="${X(p.x)}" y1="${cy}" x2="${X(p.x)}" y2="${Y(p.y)}" stroke="${HL}" stroke-width="1.3" stroke-dasharray="3 3"/>`+
      `<line x1="${cx}" y1="${Y(p.y)}" x2="${X(p.x)}" y2="${Y(p.y)}" stroke="${HL}" stroke-width="1.3" stroke-dasharray="3 3"/>`+
      `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" fill="${p.col||RD}" stroke="#fff" stroke-width="1.5"/>`+
      `<text x="${X(p.x)+(p.x<0?-10:10)}" y="${Y(p.y)+(p.y<0?14:-10)}" font-size="14" font-weight="700" fill="${p.col||RD}">${p.lab||`(${neg(p.x)},${neg(p.y)})`}</text>`;
  });
  return gBox(W,H,s,opt.lab||'좌표평면');
}

function timeGraphSVG(pts,opt={}){
  const W=300,H=200,x0=46,x1=278,y0=24,y1=166;
  const maxX=opt.maxX||pts[pts.length-1][0],maxY=opt.maxY||Math.max(...pts.map(p=>p[1]),10);
  const X=v=>f1(x0+(v/maxX)*(x1-x0)),Y=v=>f1(y1-(v/maxY)*(y1-y0));
  let s=`<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="${INK}" stroke-width="2"/>`+
    `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="${INK}" stroke-width="2"/>`;
  pts.forEach(([px,py],i)=>{
    s+=`<line x1="${X(px)}" y1="${y0}" x2="${X(px)}" y2="${y1}" stroke="#e2e8f0" stroke-width="1"/>`+
      `<text x="${X(px)}" y="${y1+16}" text-anchor="middle" font-size="12" fill="${INK}">${px}</text>`;
    if(py>0)s+=`<text x="${x0-6}" y="${Y(py)+4}" text-anchor="end" font-size="12" fill="${INK}">${py}</text>`;
  });
  s+=`<polyline points="${pts.map(p=>`${X(p[0])},${Y(p[1])}`).join(' ')}" fill="none" stroke="${BL}" stroke-width="3" stroke-linejoin="round"/>`;
  pts.forEach(p=>{s+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="${HL}" stroke="${INK}" stroke-width="1.3"/>`});
  if(opt.pts2)s+=`<polyline points="${opt.pts2.map(p=>`${X(p[0])},${Y(p[1])}`).join(' ')}" fill="none" stroke="${RD}" stroke-width="2.6" stroke-dasharray="6 4"/>`;
  s+=`<text x="${x1}" y="${y1+28}" text-anchor="end" font-size="12" font-family="${SF}" fill="${INK}">${opt.xLab||'시간(분)'}</text>`+
    `<text x="${x0}" y="${y0-8}" font-size="12" font-family="${SF}" fill="${INK}">${opt.yLab||'거리(m)'}</text>`;
  return gBox(W,H+12,s,'시간과 거리 그래프');
}

function vaseCurveSVG(shape,opt={}){
  const W=270,H=140;
  let bottle='';
  if(shape==='cyl')bottle=`<path d="M 30 30 L 30 110 L 82 110 L 82 30" fill="${BLs}" stroke="${INK}" stroke-width="2.2"/>`;
  else if(shape==='narrow')bottle=`<path d="M 24 110 L 44 30 L 68 30 L 88 110 Z" fill="${BLs}" stroke="${INK}" stroke-width="2.2"/>`;
  else bottle=`<path d="M 40 110 L 22 30 L 90 30 L 72 110 Z" fill="${BLs}" stroke="${INK}" stroke-width="2.2"/>`;
  let curve='';
  if(shape==='cyl')curve=`<line x1="130" y1="110" x2="235" y2="30" stroke="${HL}" stroke-width="3"/>`;
  else if(shape==='narrow')curve=`<path d="M 130 110 Q 190 95 235 30" fill="none" stroke="${HL}" stroke-width="3"/>`;
  else curve=`<path d="M 130 110 Q 170 45 235 30" fill="none" stroke="${HL}" stroke-width="3"/>`;
  const ax=`<line x1="130" y1="24" x2="130" y2="112" stroke="${INK}" stroke-width="1.8"/><line x1="130" y1="112" x2="245" y2="112" stroke="${INK}" stroke-width="1.8"/>`+
    `<text x="188" y="130" text-anchor="middle" font-size="12" font-family="${SF}" fill="${INK}">시간</text>`+
    `<text x="122" y="26" text-anchor="end" font-size="12" font-family="${SF}" fill="${INK}">높이</text>`;
  return gBox(W,H,bottle+(opt.hideCurve?'':ax+curve),'용기와 물 높이 그래프');
}

/* ── 3. 미리 보기 · 그림 카드 · 개념 · 퀴즈 ── */
if(typeof PREVIEW==='object'){
  PREVIEW.coord={tb:'108~112쪽',
    core:[
      {h:'순서쌍 (x, y)',b:'순서를 정해 짝지은 쌍이에요. <b>(x좌표, y좌표)</b> 순서가 바뀌면 다른 점!'},
      {h:'사분면 4곳',b:'제1사분면(+, +) → 제2(−, +) → 제3(−, −) → 제4(+, −) 반시계 방향'},
      {h:'축 위의 점',b:'x축·y축 위(0이 있는 점)는 <b>어느 사분면에도 속하지 않아요!</b>'}
    ],
    words:['수직선','순서쌍','좌표평면','x축','y축','원점','사분면'],
    ex:'(3, −2) → 오른쪽 3, 아래 2 → <b>제4사분면</b> · (0, 4) → y축 위 (사분면 ✕)'};
  PREVIEW.graph={tb:'113~119쪽',
    core:[
      {h:'그래프 방향 읽기',b:'오른쪽 위 ↗ <b>커짐(증가)</b> · 수평 → <b>멈춤(변화 없음)</b> · 오른쪽 아래 ↘ <b>줄어듦(감소)</b>'},
      {h:'용기와 물 높이',b:'통이 <b>좁아지면</b> 물 높이가 점점 빠르게 올라가고, <b>넓어지면</b> 천천히 올라가요.'},
      {h:'두 그래프 비교',b:'두 그래프가 <b>만나는 점(교점)</b>은 같은 시각에 위치·높이가 같아진 때예요.'}
    ],
    words:['그래프','증가','감소','교점'],
    ex:'가로선(수평) 구간 = 쉬거나 멈춘 시간!'};
  PREVIEW.prop={tb:'120~126쪽',
    core:[
      {h:'정비례 뜻과 식',b:'x가 2배, 3배 → y도 2배, 3배! 관계식은 <b>y = ax (a ≠ 0)</b>'},
      {h:'그래프 모양',b:'<b>원점 (0, 0)</b>을 지나는 곧은 직선!'},
      {h:'a의 부호와 사분면',b:'a &gt; 0: 오른쪽 위 ↗ (제1·3사분면) / a &lt; 0: 오른쪽 아래 ↘ (제2·4사분면)'}
    ],
    words:['정비례','원점','직선'],
    ex:'점 (2, −6)을 지나면 a = (−6) ÷ 2 = <b>−3</b> → y = −3x'};
  PREVIEW.inv={tb:'127~131쪽',
    core:[
      {h:'반비례 뜻과 식',b:'x와 y의 <b>곱(x × y = a)</b>이 항상 같아요! 관계식은 <b>y = a/x (a ≠ 0)</b>'},
      {h:'그래프 모양',b:'원점을 지나지 않는 <b>매끄러운 한 쌍의 곡선</b> (좌표축과 만나지 않아요!)'},
      {h:'a의 부호와 사분면',b:'a &gt; 0: 제1·3사분면 / a &lt; 0: 제2·4사분면'}
    ],
    words:['반비례','쌍곡선'],
    ex:'점 (−2, 6)을 지나면 a = (−2) × 6 = <b>−12</b> → y = −12/x'};
}

if(typeof PV_CARDS==='object'){
  PV_CARDS.coord=[
    {h:'수직선 위 점의 좌표',t:'기준점 O(0)에서 오른쪽은 양수(+), 왼쪽은 음수(−)예요.',
      figs:()=>[[coordNLSVG([{v:-3,lab:'A'},{v:2,lab:'B',col:BL}]),null,'A(−3), B(2)']]},
    {h:'순서쌍 (x, y) 읽기',t:'항상 <b>가로(x)를 먼저</b>, <b>세로(y)를 나중</b>에 읽어요. (2, 3)과 (3, 2)는 달라요!',
      figs:()=>[[planeGridSVG({pts:[{x:2,y:3,lab:'A(2,3)'},{x:-3,y:1,lab:'B(-3,1)',col:BL}]}),null,'x 먼저, y 나중']]},
    {h:'사분면과 축 위의 점',t:'반시계 방향으로 제1→2→3→4사분면! <b>x축·y축 위의 점은 어느 사분면도 아니에요.</b>',
      figs:()=>[[planeGridSVG({quadHL:1,pts:[{x:3,y:0,lab:'(3,0) x축'}]}),null,'제1사분면 (+, +) / 축은 제외']]}
  ];
  PV_CARDS.graph=[
    {h:'올라감 · 수평 · 내려감',t:'오른쪽 위(증가), 수평(멈춤), 오른쪽 아래(감소)로 움직임을 읽어요.',
      figs:()=>[[timeGraphSVG([[0,0],[4,200],[7,200],[10,0]]),null,'출발 → 휴식(4~7분) → 복귀']]},
    {h:'용기 모양과 물 높이',t:'입구가 좁아지는 병은 물 높이가 점점 가파르게 올라가요.',
      figs:()=>[[vaseCurveSVG('cyl'),null,'원기둥 → 직선'],[vaseCurveSVG('narrow'),null,'좁아짐 → 위로 휨']]},
    {h:'두 그래프의 교점',t:'두 선이 만나는 점은 두 사람의 거리·높이가 <b>같아진 순간</b>이에요.',
      figs:()=>[[timeGraphSVG([[0,0],[10,400]],{pts2:[[0,100],[10,300]],maxX:10,maxY:400}),null,'교점 = 만난 시각']]}
  ];
  PV_CARDS.prop=[
    {h:'정비례 y = ax',t:'x가 2배, 3배 될 때 y도 2배, 3배 돼요. 식은 <b>y = ax</b> (y + 3 = x ✕!).',
      figs:()=>[[planeGridSVG({lineA:2,pts:[{x:1,y:2,lab:'(1,2)'},{x:2,y:4,lab:'(2,4)'}]}),null,'y = 2x (원점 지나는 직선)']]},
    {h:'a > 0 vs a < 0 그래프',t:'a &gt; 0이면 오른쪽 위(1·3사분면), a &lt; 0이면 오른쪽 아래(2·4사분면)를 지나요.',
      figs:()=>[[planeGridSVG({lineA:1.5}),null,'a > 0 (제1·3사분면)'],[planeGridSVG({lineA:-1.5}),null,'a < 0 (제2·4사분면)']]},
    {h:'지나는 점으로 a 구하기',t:'점 (p, q)를 y = ax에 넣어 <b>a = q ÷ p</b>로 한 번에 구해요.',
      figs:()=>[[planeGridSVG({lineA:-2,pts:[{x:-2,y:4,lab:'(-2,4)'}]}),null,'4 = a×(−2) → a = −2']]}
  ];
  PV_CARDS.inv=[
    {h:'반비례 x × y = a',t:'두 수의 <b>곱 xy가 항상 일정</b>할 때 반비례 <b>y = a/x</b>예요.',
      figs:()=>[[planeGridSVG({invA:4,pts:[{x:1,y:4,lab:'(1,4)'},{x:2,y:2,lab:'(2,2)'}]}),null,'y = 4/x (1×4 = 2×2 = 4)']]},
    {h:'a > 0 vs a < 0 그래프',t:'원점을 지나지 않고 축에 닿지 않는 한 쌍의 곡선! a &gt; 0(1·3), a &lt; 0(2·4).',
      figs:()=>[[planeGridSVG({invA:4}),null,'a > 0 (제1·3사분면)'],[planeGridSVG({invA:-4}),null,'a < 0 (제2·4사분면)']]},
    {h:'지나는 점으로 a 구하기',t:'반비례 곡선 위의 점 (p, q)가 주어지면 <b>a = p × q</b>로 바로 찾아요.',
      figs:()=>[[planeGridSVG({invA:-6,pts:[{x:2,y:-3,lab:'(2,-3)'}]}),null,'a = 2 × (−3) = −6']]}
  ];
}

if(typeof CONCEPT==='object'){
  CONCEPT.coord=body=>{
    body.innerHTML=foldPanel('순서쌍과 좌표',`<p class="lead">좌표평면 위의 점은 <b>(x좌표, y좌표)</b> 순서로 나타내요.</p>`,
      fold(1,'수직선과 순서쌍','가로 x 먼저, 세로 y 나중',`<div class="duo"><div class="figbox">${coordNLSVG([{v:-3,lab:'A'},{v:2,lab:'B',col:BL}])}</div><div class="figbox">${planeGridSVG({pts:[{x:2,y:3,lab:'(2,3)'}]})}</div></div><p>수직선 위의 점 A가 3에 있으면 A(3)으로 써요. 좌표평면에서는 x축 방향 먼저 읽고 y축 방향을 읽어 <b>(x, y)</b>로 써요.</p>`,true)+
      fold(2,'사분면과 축 위의 점','1 → 2 → 3 → 4 반시계 방향',`<div class="figbox">${planeGridSVG({quadHL:1,pts:[{x:2,y:2,lab:'1 (+,+)'},{x:-2,y:2,lab:'2 (-,+)',col:BL},{x:3,y:0,lab:'(3,0)'}]})}</div><p>좌표축(x축, y축)은 경계선이라서 <b>어느 사분면에도 속하지 않아요</b>. x축 위의 점은 y좌표가 0, y축 위의 점은 x좌표가 0이에요.</p>`));
    wireFolds(body,'coord');
  };
  CONCEPT.graph=body=>{
    body.innerHTML=foldPanel('그래프와 그 해석',`<p class="lead">두 양의 변화 모습을 좌표평면 위에 점이나 선으로 나타낸 것이 <b>그래프</b>예요.</p>`,
      fold(1,'오른쪽 위 · 수평 · 오른쪽 아래','구간별로 읽기',`<div class="figbox">${timeGraphSVG([[0,0],[4,200],[7,200],[10,0]])}</div><p>그래프가 오른쪽 위로 향하면 값이 커지고, <b>가로로 평평(수평)</b>하면 값이 변하지 않고 멈춘 거예요. 오른쪽 아래로 내려가면 값이 줄어든 거예요.</p>`,true)+
      fold(2,'그릇 모양과 물 높이','좁으면 빨라지고 넓으면 느려져요',`<div class="duo"><div class="figbox">${vaseCurveSVG('cyl')}</div><div class="figbox">${vaseCurveSVG('narrow')}</div></div><p>시간당 물의 양이 일정할 때 폭이 좁을수록 물 높이가 빨리 올라가요.</p>`));
    wireFolds(body,'graph');
  };
  CONCEPT.prop=body=>{
    body.innerHTML=foldPanel('정비례',`<p class="lead">x가 2배, 3배 될 때 y도 똑같이 2배, 3배가 되면 y는 x에 <b>정비례</b>해요.</p>`,
      fold(1,'정비례 관계식 y = ax','원점 지나는 직선',`<div class="figbox">${planeGridSVG({lineA:2,pts:[{x:1,y:2,lab:'(1,2)'},{x:2,y:4,lab:'(2,4)'}]})}</div><p>관계식은 <b>y = ax (a ≠ 0)</b> 꼴이에요. 그래프를 그리면 항상 <b>원점 (0, 0)을 지나는 직선</b>이 돼요.</p>`,true)+
      fold(2,'a의 부호와 그래프 방향','a > 0 오른쪽 위 · a < 0 오른쪽 아래',`<p>a &gt; 0이면 x가 증가할 때 y도 증가하므로 제1, 제3사분면을 지나고, a &lt; 0이면 x가 증가할 때 y는 감소하므로 제2, 제4사분면을 지나요.</p>`));
    wireFolds(body,'prop');
  };
  CONCEPT.inv=body=>{
    body.innerHTML=foldPanel('반비례',`<p class="lead">x가 2배, 3배 될 때 y가 <b>½배, ⅓배</b>가 되면 y는 x에 <b>반비례</b>해요.</p>`,
      fold(1,'반비례 관계식 y = a/x','x × y = a 곱이 일정!',`<div class="figbox">${planeGridSVG({invA:4,pts:[{x:1,y:4,lab:'(1,4)'},{x:2,y:2,lab:'(2,2)'}]})}</div><p>반비례는 두 수의 <b>곱 xy = a (a ≠ 0)</b>가 항상 같아요. 그래프는 원점을 지나지 않고 축에 닿지 않는 한 쌍의 매끄러운 곡선이에요.</p>`,true)+
      fold(2,'a의 부호와 사분면','a > 0 제1·3 / a < 0 제2·4',`<p>a &gt; 0이면 제1, 제3사분면에, a &lt; 0이면 제2, 제4사분면에 곡선 한 쌍이 그려져요.</p>`));
    wireFolds(body,'inv');
  };
}

Object.assign(window.CONCEPT_QUIZ=window.CONCEPT_QUIZ||{},{
  coord:[
    {q:'점 (−3, 5)는 몇 사분면 위의 점인가요?',choices:['제2사분면','제1사분면','제3사분면','제4사분면'],ans:'제2사분면',hint:'x좌표가 음수(왼쪽), y좌표가 양수(위)예요.',ok:'(−, +)는 제2사분면이에요.'},
    {q:'점 (0, −4)는 어느 곳에 있나요?',choices:['어느 사분면에도 속하지 않아요','제3사분면','제4사분면','제2사분면'],ans:'어느 사분면에도 속하지 않아요',hint:'x좌표가 0이면 y축 위에 놓여요.',ok:'좌표축 위의 점은 어느 사분면에도 속하지 않아요.'},
    {q:'점 P(4, −1)의 x좌표는 무엇인가요?',choices:['4','−1','1','−4'],ans:'4',hint:'순서쌍 (x, y)에서 앞의 수가 x좌표예요.',ok:'순서쌍 (4, −1)의 x좌표는 4예요.'}
  ],
  graph:[
    {q:'시간-거리 그래프에서 선이 <b>가로로 평평(수평)</b>할 때 무슨 뜻인가요?',choices:['거리가 변하지 않고 멈춰 있다','가장 빠르게 이동하고 있다','거꾸로 돌아가고 있다','출발점에 있다'],ans:'거리가 변하지 않고 멈춰 있다',hint:'시간은 흐르는데 세로축(거리) 값이 그대로예요.',ok:'거리가 그대로이므로 정지한 구간이에요.'},
    {q:'위로 갈수록 점점 <b>좁아지는</b> 물병에 물을 일정하게 넣을 때 물 높이 그래프는?',choices:['갈수록 가파르게 올라가는 곡선','일정한 속도로 올라가는 직선','갈수록 완만해지는 곡선','수평선'],ans:'갈수록 가파르게 올라가는 곡선',hint:'통이 좁아지면 같은 물 양에 높이가 더 빨리 차올라요.',ok:'위로 좁아지므로 갈수록 높이가 빠르게 올라가요.'},
    {q:'두 사람의 이동 그래프가 한 점에서 <b>만났을(교점)</b> 때 의미하는 것은?',choices:['같은 시각에 같은 위치에 있다','둘 다 멈춰 있다','한 사람이 포기했다','출발점이 같다'],ans:'같은 시각에 같은 위치에 있다',hint:'x축(시각)과 y축(거리) 값이 두 그래프 모두 같아요.',ok:'같은 시각에 같은 거리(위치)에서 만났어요.'}
  ],
  prop:[
    {q:'다음 중 y가 x에 <b>정비례</b>하는 식은?',choices:['y = −3x','y = x + 3','y = 3/x','y = x²'],ans:'y = −3x',hint:'y = ax (a ≠ 0) 꼴을 찾아요.',ok:'y = −3x가 y = ax 꼴이에요.'},
    {q:'정비례 그래프 y = 4x가 지나는 사분면은?',choices:['제1사분면, 제3사분면','제2사분면, 제4사분면','제1사분면, 제2사분면','제3사분면, 제4사분면'],ans:'제1사분면, 제3사분면',hint:'a = 4 > 0이므로 오른쪽 위로 올라가요.',ok:'a > 0이면 원점을 지나며 제1, 제3사분면을 지나요.'},
    {q:'y = ax 그래프가 점 (2, −6)을 지날 때 a의 값은?',choices:['−3','3','−12','−4'],ans:'−3',hint:'−6 = a × 2에서 a를 구해요.',ok:'a = (−6) ÷ 2 = −3이에요.'}
  ],
  inv:[
    {q:'다음 중 y가 x에 <b>반비례</b>하는 관계는?',choices:['x × y = 12','x + y = 12','y = 12x','y = x − 12'],ans:'x × y = 12',hint:'두 수의 곱(xy)이 일정한 식을 찾아요.',ok:'xy = 12, 즉 y = 12/x가 반비례예요.'},
    {q:'반비례 관계 y = −6/x의 그래프가 지나는 사분면은?',choices:['제2사분면, 제4사분면','제1사분면, 제3사분면','제1사분면, 제2사분면','제3사분면, 제4사분면'],ans:'제2사분면, 제4사분면',hint:'a = −6 < 0이에요.',ok:'a < 0이면 제2, 제4사분면에 쌍곡선이 그려져요.'},
    {q:'y = a/x 그래프가 점 (3, 4)를 지날 때 a의 값은?',choices:['12','7','1','−12'],ans:'12',hint:'a = x × y로 한 번에 구해요.',ok:'a = 3 × 4 = 12예요.'}
  ]
});

/* ── 탐구 활동 ── */
if(typeof EXPLORE==='object'){
  EXPLORE.coord=body=>{
    let q=1;
    const draw=()=>{
      const signs={1:'(+, +) x양수 · y양수',2:'(−, +) x음수 · y양수',3:'(−, −) x음수 · y음수',4:'(+, −) x양수 · y음수'}[q];
      body.innerHTML=`<div class="card panel"><h2 style="margin-top:0">사분면 눌러 보기</h2>
        <div class="explore"><div class="stage" style="padding:12px">${planeGridSVG({quadHL:q,pts:[{x:q===1||q===4?2:-2,y:q<=2?3:-3}]})}</div>
        <div class="ctrl"><div class="chips">${[1,2,3,4].map(k=>`<button type="button" class="chip${q===k?' on':''}" data-q="${k}">제${k}사분면</button>`).join('')}</div>
          <div class="feedback ok"><b>제${q}사분면</b>: 부호는 <b>${signs}</b>예요.</div></div></div></div>`;
      $$('[data-q]',body).forEach(b=>b.onclick=()=>{q=+b.dataset.q;if(typeof award==='function')award(2,'coord:exp','사분면을 확인했어요');draw()});
    };draw();
  };
  EXPLORE.graph=body=>{
    let sh='cyl';
    const draw=()=>{
      body.innerHTML=`<div class="card panel"><h2 style="margin-top:0">그릇 모양과 물 높이 그래프 비교</h2>
        <div class="explore"><div class="stage" style="padding:12px">${vaseCurveSVG(sh)}</div>
        <div class="ctrl"><div class="chips"><button type="button" class="chip${sh==='cyl'?' on':''}" data-s="cyl">원기둥 모양</button><button type="button" class="chip${sh==='narrow'?' on':''}" data-s="narrow">위로 좁아지는 병</button><button type="button" class="chip${sh==='wide'?' on':''}" data-s="wide">위로 넓어지는 병</button></div>
          <div class="feedback ok">${sh==='cyl'?'폭이 일정 → 높이도 일정하게 직선으로 올라가요.':sh==='narrow'?'위로 갈수록 좁아져 높이가 점점 빠르게 올라가요.':'위로 갈수록 넓어져 높이가 점점 느리게 올라가요.'}</div></div></div></div>`;
      $$('[data-s]',body).forEach(b=>b.onclick=()=>{sh=b.dataset.s;if(typeof award==='function')award(2,'graph:exp','용기와 그래프를 탐구했어요');draw()});
    };draw();
  };
  EXPLORE.prop=body=>{
    let a=2;
    const draw=()=>{
      body.innerHTML=`<div class="card panel"><h2 style="margin-top:0">y = ax에서 a 바꾸어 보기</h2>
        <div class="explore"><div class="stage" style="padding:12px">${planeGridSVG({lineA:a,pts:[{x:1,y:a,lab:`(1,${neg(a)})`}]})}</div>
        <div class="ctrl"><div class="chips">${[-3,-2,-1,1,2,3].map(v=>`<button type="button" class="chip${a===v?' on':''}" data-a="${v}">a = ${neg(v)}</button>`).join('')}</div>
          <div class="feedback ok"><b>y = ${a===1?'':a===-1?'−':neg(a)}x</b> · ${a>0?'제1·3사분면을 지나는 오른쪽 위 직선':'제2·4사분면을 지나는 오른쪽 아래 직선'} (|a|가 클수록 y축에 가까워요!)</div></div></div></div>`;
      $$('[data-a]',body).forEach(b=>b.onclick=()=>{a=+b.dataset.a;if(typeof award==='function')award(2,'prop:exp','정비례 그래프를 탐구했어요');draw()});
    };draw();
  };
  EXPLORE.inv=body=>{
    let a=4;
    const draw=()=>{
      body.innerHTML=`<div class="card panel"><h2 style="margin-top:0">y = a/x에서 a 바꾸어 보기</h2>
        <div class="explore"><div class="stage" style="padding:12px">${planeGridSVG({invA:a,pts:[{x:2,y:a/2,lab:`(2,${neg(a/2)})`}]})}</div>
        <div class="ctrl"><div class="chips">${[-6,-4,-2,2,4,6].map(v=>`<button type="button" class="chip${a===v?' on':''}" data-a="${v}">a = ${neg(v)}</button>`).join('')}</div>
          <div class="feedback ok"><b>y = ${neg(a)}/x</b> · ${a>0?'제1·3사분면':'제2·4사분면'} (|a|가 클수록 원점에서 멀어져요!)</div></div></div></div>`;
      $$('[data-a]',body).forEach(b=>b.onclick=()=>{a=+b.dataset.a;if(typeof award==='function')award(2,'inv:exp','반비례 그래프를 탐구했어요');draw()});
    };draw();
  };
}

/* ── 4. 문제 생성기: 1차시 coord ── */
GEN.coordNL=seed=>{
  const r=mulberry(seed),pts=[{v:ri(r,-4,-1),lab:'A'},{v:ri(r,1,4),lab:'B',col:BL}],pickIdx=seed%2,tg=pts[pickIdx];
  return{ptype:'coord:numline',title:`수직선 위의 점 <b>${tg.lab}</b>의 좌표를 구하시오.`,fig:{svg:()=>`<div class="figbox">${coordNLSVG(pts)}</div>`},
    finalQ:`점 ${tg.lab}의 좌표는?`,steps:[{q:`점 ${tg.lab}는 기준 0에서 어느 쪽으로 몇 칸 떨어져 있나요? 좌표를 입력하세요.`,type:'sn',ans:tg.v,ansText:neg(tg.v),hint:'0보다 왼쪽이면 음의 부호(−)를 붙여요.',ok:`${tg.lab}(${neg(tg.v)})`}]};
};
GEN.coordRead=seed=>{
  const r=mulberry(seed),x=pick(r,[-4,-3,-2,-1,1,2,3,4]),y=pick(r,[-4,-3,-2,-1,1,2,3,4]),ask=seed%2===0?'x':'y';
  return{ptype:'coord:read',title:`좌표평면 위의 점 P의 <b>${ask}좌표</b>를 구하시오.`,fig:{svg:()=>`<div class="figbox">${planeGridSVG({pts:[{x,y,lab:'P'}]})}</div>`},
    finalQ:`점 P의 ${ask}좌표는?`,steps:[{tag:`${ask}축 따라 읽기`,q:`점 P의 <b>${ask}좌표</b>는 얼마인가요?`,type:'sn',ans:ask==='x'?x:y,ansText:neg(ask==='x'?x:y),hint:ask==='x'?'P에서 x축(가로선)으로 똑바로 내려다본 눈금을 읽어요.':'P에서 y축(세로선)으로 똑바로 옆으로 본 눈금을 읽어요.',ok:`점 P(${neg(x)}, ${neg(y)})의 ${ask}좌표는 ${neg(ask==='x'?x:y)}예요.`}]};
};
GEN.coordQuad=seed=>{
  const r=mulberry(seed),pool=[[-3,4,'제2사분면'],[4,2,'제1사분면'],[-2,-4,'제3사분면'],[3,-2,'제4사분면'],[0,-3,'어느 사분면에도 속하지 않아요'],[4,0,'어느 사분면에도 속하지 않아요']];
  const [x,y,ans]=pool[seed%pool.length];
  return{ptype:'coord:quad',title:`점 <b>(${neg(x)}, ${neg(y)})</b>는 어느 사분면 위에 있는지 고르시오.`,fig:{svg:()=>`<div class="figbox">${planeGridSVG({pts:[{x,y,lab:'P'}]})}</div>`},
    steps:[{q:'위치를 고르세요.',type:'choice',choices:['제1사분면','제2사분면','제3사분면','제4사분면','어느 사분면에도 속하지 않아요'],ans,hint:'x좌표 또는 y좌표가 0이면 좌표축 위에 있어서 어느 사분면도 아니에요.',ok:x===0||y===0?'좌표축 위의 점은 어느 사분면에도 속하지 않아요.':`x ${x>0?'+':'−'}, y ${y>0?'+':'−'} → ${ans}`}]};
};
GEN.coordTerm=seed=>{
  const r=mulberry(seed),onX=seed%2===0,k=ri(r,2,7);
  return{ptype:'coord:term',title:`점 P(${onX?`${k}, a−${k}`:`b+${k}, ${k}`})가 <b>${onX?'x축':'y축'}</b> 위의 점일 때, ${onX?'a':'b'}의 값을 구하시오.`,
    fig:null,finalQ:`${onX?'a':'b'}의 값은?`,steps:[
      {tag:'축 위의 점 성질',q:`${onX?'x축 위의 점은 <b>y좌표</b>가':'y축 위의 점은 <b>x좌표</b>가'} 얼마여야 하나요?`,type:'num',ans:0,hint:'x축 위의 점은 (a, 0), y축 위의 점은 (0, b) 꼴이에요.'},
      {tag:'값 구하기',q:`${onX?`a − ${k} = 0`:`b + ${k} = 0`} → ${onX?'a':'b'}의 값은?`,type:'sn',ans:onX?k:-k,ansText:neg(onX?k:-k),hint:onX?`a = ${k}`:`b = −${k}`,ok:`${onX?'a':'b'} = ${neg(onX?k:-k)}`}
    ]};
};
GEN.coord=seed=>[GEN.coordNL,GEN.coordRead,GEN.coordQuad,GEN.coordTerm][seed%4](seed);
GEN.coordStep=seed=>GEN.coordRead(seed);

/* ── 4. 문제 생성기: 2차시 graph ── */
GEN.graphDraw=seed=>{
  const r=mulberry(seed),k=ri(r,3,7),x=ri(r,2,5),ans=k*x;
  return{ptype:'graph:draw',title:`1분에 ${k} cm씩 높이가 올라가는 물통에 물을 넣을 때, <b>${x}분 후</b> 물의 높이를 구하시오.`,
    fig:null,steps:[{q:`${x}분 후 물의 높이는 몇 cm인가요?`,type:'num',ans,suffix:'cm',hint:`1분에 ${k} cm씩 ${x}분 동안 넣었으니 ${k} × ${x}`,ok:`${k} × ${x} = ${ans} cm`}]};
};
GEN.graphRead=seed=>{
  const r=mulberry(seed),t1=ri(r,2,5),d1=t1*ri(r,40,80),t2=t1+ri(r,2,4),t3=t2+ri(r,2,4);
  const pts=[[0,0],[t1,d1],[t2,d1],[t3,0]],rest=t2-t1;
  return{ptype:'graph:read',title:`집에서 출발한 사람이 공원까지 걸어갔다 돌아오는 그래프예요. <b>멈춰서 쉰 시간</b>은 모두 몇 분인가요?`,
    fig:{svg:()=>`<div class="figbox">${timeGraphSVG(pts)}</div>`},
    finalQ:'쉬었던 시간은 몇 분인가요?',steps:[
      {tag:'가로선 구간 찾기',q:`거리가 ${d1} m로 그대로 변하지 않은 구간은 ${t1}분부터 몇 분까지인가요?`,type:'num',ans:t2,suffix:'분',hint:'수평선(가로선)이 끝나는 시각을 읽어요.'},
      {tag:'쉰 시간 계산',q:`${t1}분부터 ${t2}분까지 쉬었으니 모두 몇 분 쉬었나요?`,type:'num',ans:rest,suffix:'분',hint:`${t2} − ${t1}`,ok:`${t2} − ${t1} = ${rest}분 동안 쉬었어요.`}
    ]};
};
GEN.graphShape=seed=>{
  const shapes=[['cyl','직선 모양으로 일정하게 올라간다'],['narrow','갈수록 기울기가 가팔라지며 위로 휘어진다'],['wide','갈수록 기울기가 완만해지며 아래로 눕는다']];
  const sp=shapes[seed%3];
  return{ptype:'graph:shape',title:`그림과 같은 용기에 일정한 속도로 물을 넣을 때, 시간에 따른 물의 높이 그래프 모양은?`,
    fig:{svg:()=>`<div class="figbox">${vaseCurveSVG(sp[0],{hideCurve:true})}</div>`},
    steps:[{q:'알맞은 그래프 설명을 고르세요.',type:'choice',choices:shapes.map(x=>x[1]),ans:sp[1],hint:'병이 좁은 구간에서는 높이가 빠르게 올라가고, 넓은 구간에서는 천천히 올라가요.',ok:`이 병은 ${sp[1]} 모양이에요.`}]};
};
GEN.graphComp=seed=>{
  const r=mulberry(seed),head=pick(r,[20,30,40]),v1=pick(r,[4,6]),v2=v1+pick(r,[2,4]);
  const tMeet=head/(v2-v1);if(!Number.isInteger(tMeet))return GEN.graphComp(seed+1);
  const dMeet=v2*tMeet;
  return{ptype:'graph:comp',title:`동생이 ${head} m 앞에서 초속 ${v1} m로 먼저 출발하고, 형이 출발선에서 초속 ${v2} m로 따라가요. 형이 동생을 <b>따라잡는 시각</b>은 몇 초 후인가요?`,
    fig:{svg:()=>`<div class="figbox">${timeGraphSVG([[0,0],[tMeet+4,v2*(tMeet+4)]],{pts2:[[0,head],[tMeet+4,head+v1*(tMeet+4)]],maxX:tMeet+4,maxY:v2*(tMeet+4),xLab:'시간(초)',yLab:'거리(m)'})}</div>`},
    finalQ:'따라잡는 시각은 몇 초 후인가요?',steps:[
      {tag:'1초마다 좁혀지는 거리',q:`형은 1초에 ${v2} m, 동생은 ${v1} m 가요. 1초마다 몇 m씩 따라잡나요?`,type:'num',ans:v2-v1,suffix:'m',hint:`${v2} − ${v1}`},
      {tag:'따라잡는 데 걸리는 시간',q:`처음 차이 ${head} m를 1초당 ${v2-v1} m씩 좁히면 몇 초 뒤에 만나나요?`,type:'num',ans:tMeet,suffix:'초',hint:`${head} ÷ ${v2-v1}`,ok:`${tMeet}초 후 ${dMeet} m 지점에서 만나요!`}
    ]};
};
GEN.graph=seed=>[GEN.graphDraw,GEN.graphRead,GEN.graphShape,GEN.graphComp][seed%4](seed);
GEN.graphStep=seed=>GEN.graphRead(seed);

/* ── 4. 문제 생성기: 3차시 prop ── */
GEN.propTable=seed=>{
  const r=mulberry(seed),a=pick(r,[2,3,4,5,-2,-3]),x1=2,x2=4;
  return{ptype:'prop:table',title:`y가 x에 <b>정비례</b>할 때, x = 1이면 y = ${neg(a)}이에요. x = ${x2}일 때 y의 값을 구하시오.`,
    fig:null,finalQ:`x = ${x2}일 때 y의 값은?`,steps:[
      {tag:'몇 배인지 확인',q:`x가 1에서 ${x2}로 ${x2}배가 됐어요. y도 몇 배가 되나요?`,type:'num',ans:x2,suffix:'배',hint:'정비례는 x가 k배면 y도 k배예요.'},
      {tag:'y 값 구하기',q:`y = ${neg(a)} × ${x2} = ?`,type:'sn',ans:a*x2,ansText:neg(a*x2),hint:`${neg(a)} × ${x2}`,ok:`y = ${neg(a*x2)}`}
    ]};
};
GEN.propFormula=seed=>{
  const r=mulberry(seed),a=ri(r,3,8),x=ri(r,4,9),y=a*x;
  return{ptype:'prop:formula',title:`한 권에 ${a} cm 두께의 책 x권을 쌓은 전체 높이를 y cm라 할 때, ${x}권의 전체 높이를 구하시오.`,
    fig:null,finalQ:`y의 값은 몇 cm인가요?`,steps:[
      {tag:'정비례 식 세우기',q:'관계식은 y = ax 꼴이에요. 여기서 a의 값은?',type:'num',ans:a,hint:`책 1권당 ${a} cm씩 늘어나니 y = ${a}x`},
      {tag:'값 넣기 (대입)',q:`x = ${x}일 때 y = ${a} × ${x} = ?`,type:'num',ans:y,suffix:'cm',hint:`${a} × ${x}`,ok:`y = ${y} cm`}
    ]};
};
GEN.propGraph=seed=>{
  const a=seed%2===0?ri(mulberry(seed),2,5):-ri(mulberry(seed),2,5);
  const ans=a>0?'제1사분면, 제3사분면':'제2사분면, 제4사분면';
  return{ptype:'propg:graph',title:`정비례 관계 <b>y = ${neg(a)}x</b>의 그래프가 지나는 사분면을 모두 고르시오.`,
    fig:{svg:()=>`<div class="figbox">${planeGridSVG({lineA:a})}</div>`},
    steps:[{q:'지나는 사분면은?',type:'choice',choices:['제1사분면, 제3사분면','제2사분면, 제4사분면','제1사분면, 제2사분면','제3사분면, 제4사분면'],ans,hint:`a = ${neg(a)}의 부호(${a>0?'> 0':'< 0'})를 보세요.`,ok:`a ${a>0?'> 0 → 제1·3사분면':'< 0 → 제2·4사분면'}`}]};
};
GEN.propFindA=seed=>{
  const r=mulberry(seed),a=pick(r,[-4,-3,-2,2,3,4]),px=pick(r,[-3,-2,2,3]),py=a*px;
  return{ptype:'propg:findA',title:`원점과 점 <b>(${neg(px)}, ${neg(py)})</b>을 지나는 직선 y = ax에서 <b>a</b>의 값을 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${planeGridSVG({lineA:a,pts:[{x:px,y:py}]})}</div>`},
    finalQ:'a의 값은?',steps:[{tag:'y ÷ x로 a 찾기',q:`y = ax에 x = ${neg(px)}, y = ${neg(py)}를 넣으면 a = (${neg(py)}) ÷ (${neg(px)}) = ?`,type:'sn',ans:a,ansText:neg(a),hint:`부호에 주의해 ${neg(py)} ÷ ${neg(px)}`,ok:`y = ${neg(a)}x`}]};
};
GEN.prop=seed=>[GEN.propTable,GEN.propFormula][seed%2](seed);
GEN.propStep=seed=>GEN.propFormula(seed);
GEN.propg=seed=>[GEN.propGraph,GEN.propFindA][seed%2](seed);
GEN.propgStep=seed=>GEN.propFindA(seed);

/* ── 4. 문제 생성기: 4차시 inv ── */
GEN.invTable=seed=>{
  const r=mulberry(seed),a=pick(r,[12,18,24,36]),x1=2,y1=a/2,x2=pick(r,[3,4,6].filter(v=>a%v===0)),y2=a/x2;
  return{ptype:'inv:table',title:`y가 x에 <b>반비례</b>하고, x = ${x1}일 때 y = ${y1}이에요. x = ${x2}일 때 y의 값을 구하시오.`,
    fig:null,finalQ:`x = ${x2}일 때 y의 값은?`,steps:[
      {tag:'일정한 곱 a = x × y',q:`x × y = ${x1} × ${y1} = ?`,type:'num',ans:a,hint:`${x1} × ${y1}`},
      {tag:'y 값 구하기',q:`${x2} × y = ${a}이므로 y = ${a} ÷ ${x2} = ?`,type:'num',ans:y2,hint:`${a} ÷ ${x2}`,ok:`y = ${y2}`}
    ]};
};
GEN.invFormula=seed=>{
  const r=mulberry(seed),a=pick(r,[24,36,48,60]),x=pick(r,[3,4,6,8,12].filter(v=>a%v===0)),ans=a/x;
  return{ptype:'inv:formula',title:`넓이가 <b>${a} cm²</b>인 직사각형의 가로 길이를 x cm, 세로 길이를 y cm라고 할 때, x = ${x}이면 세로 y는 몇 cm인가요?`,
    fig:null,finalQ:'세로 길이 y는 몇 cm인가요?',steps:[
      {tag:'곱이 일정함 확인',q:'가로(x) × 세로(y)는 항상 얼마인가요?',type:'num',ans:a,suffix:'cm²',hint:`직사각형 넓이는 항상 ${a} cm²예요.`},
      {tag:'y 구하기',q:`y = ${a} ÷ ${x} = ?`,type:'num',ans:ans,suffix:'cm',hint:`${a} ÷ ${x}`,ok:`세로는 ${ans} cm예요.`}
    ]};
};
GEN.invGraph=seed=>{
  const r=mulberry(seed),a=seed%2===0?pick(r,[2,4,6]):pick(r,[-2,-4,-6]);
  const ans=a>0?'제1사분면, 제3사분면':'제2사분면, 제4사분면';
  return{ptype:'invg:graph',title:`반비례 관계 <b>y = ${neg(a)}/x</b>의 그래프가 지나는 사분면을 모두 고르시오.`,
    fig:{svg:()=>`<div class="figbox">${planeGridSVG({invA:a})}</div>`},
    steps:[{q:'지나는 사분면은?',type:'choice',choices:['제1사분면, 제3사분면','제2사분면, 제4사분면','제1사분면, 제2사분면','제3사분면, 제4사분면'],ans,hint:`a = ${neg(a)}의 부호(${a>0?'> 0':'< 0'})를 보세요.`,ok:`a ${a>0?'> 0 → 제1·3사분면':'< 0 → 제2·4사분면'}`}]};
};
GEN.invFindA=seed=>{
  const r=mulberry(seed),px=pick(r,[-3,-2,2,3]),py=pick(r,[-4,-2,2,4]),a=px*py;
  return{ptype:'invg:findA',title:`반비례 관계 y = a/x의 그래프가 점 <b>(${neg(px)}, ${neg(py)})</b>을 지날 때, <b>a</b>의 값을 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${planeGridSVG({invA:a,pts:[{x:px,y:py}]})}</div>`},
    finalQ:'a의 값은?',steps:[{tag:'a = x × y 이용하기',q:`a = x × y = (${neg(px)}) × (${neg(py)}) = ?`,type:'sn',ans:a,ansText:neg(a),hint:`두 좌표의 곱 (${neg(px)}) × (${neg(py)})`,ok:`y = ${neg(a)}/x`}]};
};
GEN.inv=seed=>[GEN.invTable,GEN.invFormula][seed%2](seed);
GEN.invStep=seed=>GEN.invFormula(seed);
GEN.invg=seed=>[GEN.invGraph,GEN.invFindA][seed%2](seed);
GEN.invgStep=seed=>GEN.invFindA(seed);

/* ── 5. PTYPES & 전역 계약 등록 ── */
Object.assign(PTYPES,{
  coord:[
    {no:1,nm:'수직선 위 점의 좌표',tb:'109쪽',key:'0에서 오른쪽은 <b>+</b>, 왼쪽은 <b>−</b>로 P(좌표)를 읽어요.',pt:['coord:numline'],src:['coordNL']},
    {no:2,nm:'좌표평면 점 (x, y) 읽기',tb:'110~111쪽',key:'<b>가로(x) 먼저, 세로(y) 나중</b> 순서로 짝을 지어요.',pt:['coord:read'],src:['coordRead']},
    {no:3,nm:'사분면과 축 위의 점',tb:'111쪽 3번',key:'제1(+,+), 제2(−,+), 제3(−,−), 제4(+,−) · <b>0이 끼면 축 위(사분면 ✕)</b>',pt:['coord:quad'],src:['coordQuad']},
    {no:4,nm:'축 위의 점 조건으로 값 구하기',tb:'112쪽',key:'x축 위 → <b>y좌표 = 0</b> · y축 위 → <b>x좌표 = 0</b>',pt:['coord:term'],src:['coordTerm']}
  ],
  graph:[
    {no:1,nm:'변화를 식·표로 읽기',tb:'113~114쪽',key:'일정하게 변할 때 <b>1분당 변화량 × 시간</b>을 구해요.',pt:['graph:draw'],src:['graphDraw']},
    {no:2,nm:'그래프 구간 해석하기',tb:'115~116쪽',key:'오른쪽 위(<b>증가</b>), 가로선(<b>정지</b>), 오른쪽 아래(<b>감소</b>)',pt:['graph:read'],src:['graphRead']},
    {no:3,nm:'용기 모양과 그래프 짝짓기',tb:'117쪽 4번',key:'폭이 <b>좁을수록</b> 높이가 빠르게 올라가고, <b>넓을수록</b> 완만해요.',pt:['graph:shape'],src:['graphShape']},
    {no:4,nm:'두 그래프 비교 (만나는 시각)',tb:'119쪽 · 135쪽',key:'두 그래프의 <b>교점</b>은 같은 시각에 위치가 같아진 때예요.',pt:['graph:comp'],src:['graphComp']}
  ],
  prop:[
    {no:1,nm:'정비례 표 빈칸 구하기',tb:'120쪽',key:'x가 k배면 y도 k배! 비율이 항상 같아요.',pt:['prop:table'],src:['propTable']},
    {no:2,nm:'정비례 식 y = ax 활용',tb:'121쪽 · 125쪽',key:'기준 양 1당 변화량 <b>a</b>를 찾아 <b>y = ax</b>에 대입해요.',pt:['prop:formula'],src:['propFormula']},
  ],
  propg:[
    {no:1,nm:'정비례 그래프의 사분면',tb:'122~124쪽',key:'a &gt; 0 → <b>제1·3사분면</b> / a &lt; 0 → <b>제2·4사분면</b>',pt:['propg:graph'],src:['propGraph']},
    {no:2,nm:'지나는 점으로 a 구하기',tb:'124쪽 6번',key:'원점이 아닌 점 (p, q)를 <b>y = ax에 넣어</b> a를 구해요.',pt:['propg:findA'],src:['propFindA']}
  ],
  inv:[
    {no:1,nm:'반비례 표 빈칸 구하기',tb:'127쪽',key:'두 수의 곱 <b>x × y = a</b>가 항상 똑같아요!',pt:['inv:table'],src:['invTable']},
    {no:2,nm:'반비례 식 y = a/x 활용',tb:'128쪽',key:'일정한 곱 a를 구하고 <b>y = a ÷ x</b>로 찾아요.',pt:['inv:formula'],src:['invFormula']},
  ],
  invg:[
    {no:1,nm:'반비례 그래프의 사분면',tb:'129~130쪽',key:'원점을 안 지나고 축에 닿지 않는 쌍곡선! a&gt;0(1·3), a&lt;0(2·4)',pt:['invg:graph'],src:['invGraph']},
    {no:2,nm:'지나는 점으로 a 구하기',tb:'131쪽',key:'곡선 위의 점 (p, q)를 <b>y = a/x에 넣어</b> a를 구해요.',pt:['invg:findA'],src:['invFindA']}
  ]
});

['coord','graph','prop','propg','inv','invg'].forEach(lid=>{
  PTYPES[lid].forEach(T_=>{
    const g=tyKey(lid,T_.no);
    GEN[g]=seed=>GEN[T_.src[0]](seed);
    LESSON_OF[g]=lid;
  });
  GEN['mix_'+lid]=seed=>{const L=PTYPES[lid];return GEN[tyKey(lid,L[seed%L.length].no)](Math.floor(seed/L.length)+1)};
  LESSON_OF['mix_'+lid]=lid;
  LESSON_OF[lid]=lid;
});
['coordNL','coordRead','coordQuad','coordTerm','coordStep'].forEach(g=>LESSON_OF[g]='coord');
['graphDraw','graphRead','graphShape','graphComp','graphStep'].forEach(g=>LESSON_OF[g]='graph');
['propTable','propFormula','propStep'].forEach(g=>LESSON_OF[g]='prop');
['propGraph','propFindA','propgStep'].forEach(g=>LESSON_OF[g]='propg');
['invTable','invFormula','invStep'].forEach(g=>LESSON_OF[g]='inv');
['invGraph','invFindA','invgStep'].forEach(g=>LESSON_OF[g]='invg');
Object.assign(STEPGEN,{coord:GEN.coordStep,graph:GEN.graphStep,prop:GEN.propStep,propg:GEN.propgStep,inv:GEN.invStep,invg:GEN.invgStep});
Object.assign(CALC_FOR,{
  coord:['signed','fdconv'],
  graph:['add2','mul'],
  prop:['mul','eq'],
  propg:['signmul','eq'],
  inv:['div','eq'],
  invg:['signmul','fracdiv']
});
Object.assign(PTYPE_NM,{
  'coord:numline':'1차시 · 수직선 좌표','coord:read':'1차시 · 순서쌍 읽기','coord:quad':'1차시 · 사분면 판단','coord:term':'1차시 · 축 위의 점',
  'graph:draw':'2차시 · 변화 값 구하기','graph:read':'2차시 · 그래프 해석','graph:shape':'2차시 · 용기와 그래프','graph:comp':'2차시 · 두 그래프 비교',
  'prop:table':'3차시 · 정비례 표','prop:formula':'3차시 · 정비례 식 활용','propg:graph':'4차시 · 정비례 그래프','propg:findA':'4차시 · 정비례 a 구하기',
  'inv:table':'5차시 · 반비례 표','inv:formula':'5차시 · 반비례 식 활용','invg:graph':'6차시 · 반비례 그래프','invg:findA':'6차시 · 반비례 a 구하기',
  /* [T35] 나누기 전 기록(학생 풀이 기록·신고)에 남은 옛 꼬리표 */
  'prop:graph':'4차시 · 정비례 그래프','prop:findA':'4차시 · 정비례 a 구하기','inv:graph':'6차시 · 반비례 그래프','inv:findA':'6차시 · 반비례 a 구하기'
});

/* [T35] 옛 단원 화면(미리 보기·개념·탐구)은 나누기 전 내용을 그래프 차시에서도 같이 보여 줘요. 차시 학습은 엔진(02t-tracks-graph.js)이 따로 그려요. */
[['propg','prop'],['invg','inv']].forEach(([n,o])=>{
  [typeof PREVIEW==='object'?PREVIEW:null,typeof PV_CARDS==='object'?PV_CARDS:null,typeof CONCEPT==='object'?CONCEPT:null,typeof EXPLORE==='object'?EXPLORE:null,window.CONCEPT_QUIZ].forEach(R=>{if(R&&R[o]&&!R[n])R[n]=R[o]});
});
const addT=(k,o)=>{if(typeof TERMS==='object'&&TERMS&&!TERMS[k])TERMS[k]=o};
addT('순서쌍',{k:'1학년 · 좌표',b:'<p>두 수의 순서를 정하여 (x, y)와 같이 짝지어 나타낸 쌍이에요.</p>'});
addT('좌표평면',{k:'1학년 · 좌표',b:'<p>x축(가로)과 y축(세로)이 원점 O에서 수직으로 만나 이루는 평면이에요.</p>'});
addT('x축',{k:'1학년 · 좌표',b:'<p>좌표평면에서 가로로 놓인 수직선이에요. 이 위의 점은 y좌표가 0이에요.</p>'});
addT('y축',{k:'1학년 · 좌표',b:'<p>좌표평면에서 세로로 놓인 수직선이에요. 이 위의 점은 x좌표가 0이에요.</p>'});
addT('원점',{k:'1학년 · 좌표',b:'<p>x축과 y축이 만나는 점 O(0, 0)이에요.</p>'});
addT('사분면',{k:'1학년 · 좌표',b:'<p>좌표축으로 나뉜 좌표평면의 네 부분이에요. 제1, 2, 3, 4사분면이라 부르며, 축 위의 점은 어느 사분면에도 속하지 않아요.</p>'});
addT('그래프',{k:'1학년 · 그래프',b:'<p>서로 함께 변하는 두 양 사이의 관계를 좌표평면 위에 점이나 선으로 나타낸 그림이에요.</p>'});
addT('반비례',{k:'1학년 · 반비례',b:'<p class="formula">y = a/x (a ≠ 0)</p><p>x가 2배, 3배 변할 때 y가 ½배, ⅓배 변하는 관계예요. 항상 x × y = a로 곱이 일정해요.</p>'});
addT('쌍곡선',{k:'1학년 · 반비례',b:'<p>반비례 관계 y = a/x의 그래프처럼 원점을 지나지 않고 한 쌍으로 그려지는 매끄러운 곡선이에요.</p>'});
})();