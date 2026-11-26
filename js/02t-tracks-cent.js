/* T08: 교과서 한 걸음 — 2차시(cent: 중심각과 호) 3탭 × 3트랙 시범 모듈 */
(function(){
'use strict';

const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',OK='#2b7a4b',OKs='#e5f4ea',GY='#94a3b8',RD='#b83a3a';
const MF="'Times New Roman',Times,serif";
const rad=a=>a*Math.PI/180,pol=(C,R,a)=>[C[0]+R*Math.cos(rad(a)),C[1]-R*Math.sin(rad(a))];
const f1=n=>Math.round(n*10)/10,pt=P=>`${f1(P[0])} ${f1(P[1])}`;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);

/* ── 1. 공통 트랙 완료 규약 & 지표 기록 ── */
function trackGoalDefault(){
  const g=typeof myGoal==='function'?myGoal():null;
  if(!g)return 2;
  return g.k==='calc'?1:g.k==='up'?3:2;
}

window.lessonTrackDone=function(id){
  const p=(typeof DB==='object'&&DB&&DB[id])?DB[id]:null;
  if(!p)return 0;
  const td=Number(p.trackDone)||0;
  if(td>=1&&td<=3)return td;
  if((p.prac&&Number(p.prac.solved)>=5)||(Number(p.steps)>0&&p.concept))return 2;
  return 0;
};

function centProg(){
  return typeof prog==='function'?prog('cent'):(DB.cent=DB.cent||{concept:false,explore:false,steps:0,prac:{solved:0,streak:0,level:1,fails:0,retry:[]}});
}
function curTrack(){
  const p=centProg();
  return(p.track===1||p.track===2||p.track===3)?p.track:trackGoalDefault();
}
function setTrack(tr){
  const p=centProg();
  p.track=tr;
  if(typeof save==='function')save();
}
function recordMetric(elapsedMs,errTag){
  if(typeof DB!=='object'||!DB)return;
  DB._metrics=DB._metrics||{fastClicks:0,totalClicks:0,errTags:{}};
  DB._metrics.totalClicks++;
  if(elapsedMs>=0&&elapsedMs<3000)DB._metrics.fastClicks++;
  if(errTag)DB._metrics.errTags[errTag]=(DB._metrics.errTags[errTag]||0)+1;
  if(typeof save==='function')save();
}

let autoNavTimer=null,autoNavTick=null;
function clearAutoNav(){
  if(autoNavTimer){clearTimeout(autoNavTimer);autoNavTimer=null}
  if(autoNavTick){clearInterval(autoNavTick);autoNavTick=null}
}
if(typeof addEventListener==='function')addEventListener('hashchange',clearAutoNav);

/* ── 2. 독립 SVG 도우미 (Node VM 안전 · Canvas 미사용) ── */
const svgBox=(w,h,inner,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="ct-svg" role="img" aria-label="${lab||'원 도형'}" style="font-family:${MF}">${inner}</svg>`;
const arcD=(C,R,a0,a1)=>`M ${pt(pol(C,R,a0))} A ${R} ${R} 0 ${Math.abs(a1-a0)>180?1:0} 0 ${pt(pol(C,R,a1))}`;
const secD=(C,R,a0,a1)=>`M ${pt(C)} L ${pt(pol(C,R,a0))} A ${R} ${R} 0 ${Math.abs(a1-a0)>180?1:0} 0 ${pt(pol(C,R,a1))} Z`;
const svgLn=(P,Q,col=INK,w=2.4,dash='')=>`<line x1="${f1(P[0])}" y1="${f1(P[1])}" x2="${f1(Q[0])}" y2="${f1(Q[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const svgDot=(P,r=4,col=INK)=>`<circle cx="${f1(P[0])}" cy="${f1(P[1])}" r="${r}" fill="${col}"/>`;
const svgTx=(P,s,o={})=>`<text x="${f1(P[0])}" y="${f1(P[1])}" font-size="${o.size||18}" text-anchor="${o.anchor||'middle'}" dominant-baseline="central" fill="${o.col||INK}" ${o.sans?`font-family="'IBM Plex Sans KR',sans-serif" font-weight="700"`:''} ${o.it?'font-style="italic"':''} stroke="#fff" stroke-width="3.2" paint-order="stroke">${s}</text>`;
const svgAng=(C,a0,a1,lab,o={})=>{
  const r=o.r||24,mid=(a0+a1)/2,sp=Math.abs(a1-a0),lr=o.lr||(sp>=150?42:Math.min(72,Math.max(40,48/Math.max(0.35,Math.sin(sp*Math.PI/360)))));
  return`<path d="${arcD(C,r,a0,a1)}" fill="none" stroke="${o.col||INK}" stroke-width="${o.w||2}"/>`+(lab?svgTx(pol(C,lr,mid),lab,{size:o.size||17,col:o.col||INK}):'');
};

function ctTwoSec(opt){
  const{a,b,l1,l2,mode='arc',hl=[],showChord=false,diffRadius=false,semi=false}=opt;
  const has=k=>hl.includes(k);
  if(diffRadius){
    const c1=[100,145],r1=64,c2=[265,145],r2=88;
    const f=s=>`<circle cx="${s.c[0]}" cy="${s.c[1]}" r="${s.r}" fill="none" stroke="#9aa3b5" stroke-width="1.6"/>`+
      `<path d="${secD(s.c,s.r,20,20+s.deg)}" fill="${s.fill}" stroke="${INK}" stroke-width="2.2"/>`+
      `<path d="${arcD(s.c,s.r,20,20+s.deg)}" fill="none" stroke="${s.arcCol}" stroke-width="5" stroke-linecap="round"/>`+
      svgAng(s.c,20,20+s.deg,s.deg+'°',{col:s.angCol,size:15})+svgDot(s.c,3.5)+
      svgTx([s.c[0],s.c[1]+s.r+22],s.cap,{sans:true,size:13,col:INK});
    return svgBox(380,265,
      f({c:c1,r:r1,deg:a,fill:HLs,arcCol:HL,angCol:HL,cap:'작은 원'})+
      f({c:c2,r:r2,deg:b,fill:BLs,arcCol:BL,angCol:BL,cap:'큰 원'}),
      '크기가 다른 두 원의 부채꼴');
  }
  const C=[190,145],R=90,gap=semi?0:24;
  const A0=semi?180-a:90-(a+gap+b)/2,A1=A0+a,B0=A1+gap,B1=B0+b;
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#b5bece" stroke-width="1.8"/>`;
  if(semi)s+=svgLn(pol(C,R,180),pol(C,R,0),INK,2.6);
  const fill1=mode==='area'?(has('val1')?'#f9c88c':HLs):'none';
  const fill2=mode==='area'?(has('val2')?'#b7cdf7':BLs):'none';
  s+=`<path d="${secD(C,R,A0,A1)}" fill="${fill1}" stroke="${INK}" stroke-width="2.4"/>`;
  s+=`<path d="${secD(C,R,B0,B1)}" fill="${fill2}" stroke="${INK}" stroke-width="2.4"/>`;
  if(mode==='arc'){
    s+=`<path d="${arcD(C,R,A0,A1)}" fill="none" stroke="${has('val1')?HL:INK}" stroke-width="${has('val1')?6:3}" stroke-linecap="round"/>`;
    s+=`<path d="${arcD(C,R,B0,B1)}" fill="none" stroke="${has('val2')?BL:INK}" stroke-width="${has('val2')?6:3}" stroke-linecap="round"/>`;
  }
  if(showChord){
    const P0=pol(C,R,A0),P1=pol(C,R,A1),P2=pol(C,R,A0+a/2);
    s+=svgLn(P0,P2,HL,3.2)+svgLn(P2,P1,HL,3.2)+svgLn(P0,P1,RD,3.5,'6 4');
    if(a>=60)s+=svgLn(C,P2,'#9aa3b5',1.3,'4 4');
  }
  s+=svgAng(C,A0,A1,a+'°',{col:has('ang1')?HL:INK,w:has('ang1')?3.2:2,size:16});
  s+=svgAng(C,B0,B1,b==null?'?°':b+'°',{col:has('ang2')?BL:INK,w:has('ang2')?3.2:2,size:16});
  if(l1)s+=svgTx(pol(C,R+24,(A0+A1)/2),l1,{size:16,sans:true,col:has('val1')?HL:INK});
  if(l2)s+=svgTx(pol(C,R+24,(B0+B1)/2),l2,{size:16,sans:true,col:has('val2')?BL:INK});
  s+=svgDot(C,4)+svgTx([C[0],C[1]+16],'O',{size:16});
  return svgBox(380,285,s,'한 원 안의 두 부채꼴');
}

function ctThreeArcs(a,b,c,opt={}){
  const{want='AB',hl=[]}=opt;
  const C=[165,142],R=90,t=a+b+c,aA=115,aB=aA+360*a/t,aC=aB+360*b/t;
  const segs=[['AB',aA,aB],['BC',aB,aC],['CA',aC,aA+360]];
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`;
  segs.forEach(([nm,p0,p1])=>{
    const on=hl.includes(nm)||hl.includes('want')&&nm===want;
    if(on){
      s+=`<path d="${secD(C,R,p0,p1)}" fill="${HLs}" stroke="${INK}" stroke-width="2.2"/>`;
      s+=`<path d="${arcD(C,R,p0,p1)}" fill="none" stroke="${HL}" stroke-width="5.5" stroke-linecap="round"/>`;
    }
    s+=svgLn(C,pol(C,R,p0),INK,1.6,'4 4');
  });
  if(hl.includes('ang')){
    const tg=segs.find(x=>x[0]===want);
    if(tg)s+=svgAng(C,tg[1],tg[2],'?°',{col:BL,w:3});
  }
  s+=svgDot(pol(C,R,aA),4.5)+svgDot(pol(C,R,aB),4.5)+svgDot(pol(C,R,aC),4.5)+svgDot(C,4);
  s+=svgTx(pol(C,R+20,aA),'A',{it:true})+svgTx(pol(C,R+20,aB),'B',{it:true})+svgTx(pol(C,R+20,aC),'C',{it:true})+svgTx([C[0]+14,C[1]+10],'O',{size:16});
  return svgBox(330,276,s,'원 위의 세 점');
}

function ctSliceStack(baseDeg,count,unitArc,unitArea,opt={}){
  const C=[155,140],R=88,showChord=!!opt.showChord;
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#b5bece" stroke-width="1.6"/>`;
  for(let i=0;i<count;i++){
    const a0=20+i*baseDeg,a1=a0+baseDeg;
    s+=`<path d="${secD(C,R,a0,a1)}" fill="${i%2?BLs:HLs}" stroke="${INK}" stroke-width="2"/>`;
    s+=`<path d="${arcD(C,R,a0,a1)}" fill="none" stroke="${i%2?BL:HL}" stroke-width="4.5"/>`;
    if(showChord)s+=svgLn(pol(C,R,a0),pol(C,R,a1),HL,2.6);
    s+=svgTx(pol(C,R+20,(a0+a1)/2),`${unitArc}`,{size:13,sans:true,col:i%2?BL:HL});
  }
  if(showChord&&count>=2){
    s+=svgLn(pol(C,R,20),pol(C,R,20+count*baseDeg),RD,3.5,'6 4');
  }
  s+=svgAng(C,20,20+count*baseDeg,`${baseDeg*count}°`,{col:INK,size:15})+svgDot(C,4);
  return svgBox(310,272,s,'부채꼴 조각 쌓기');
}

/* ── 3. 트랙별 콘텐츠 데이터 (cent) ── */
const SCHEMA_QS=[
  {
    id:'sq1',
    q:'같은 원에서 중심각이 <b>40° → 80° (2배)</b>가 됐어요. 둥근 테두리(호)의 길이는 어떻게 될까요?',
    fig:()=>ctTwoSec({a:40,b:80,l1:'3 cm',l2:'? cm',mode:'arc',hl:['ang1','ang2','val1','val2']}),
    choices:['정확히 2배 (6 cm)','2배보다 짧아요','크기를 알 수 없어요'],
    ans:'정확히 2배 (6 cm)',
    hint:'같은 원에서 둥근 테두리는 40° 조각을 2개 이어 붙인 것과 똑같아요.',
    why:'예시 ○! 한 원에서 중심각이 2배가 되면 둥근 테두리(호의 길이)도 정확히 2배가 돼요.'
  },
  {
    id:'sq2',
    q:'같은 원에서 중심각이 <b>60° → 120° (2배)</b>예요. 두 점을 곧게 이은 <b>빨간 점선</b>의 길이는 2배가 될까요?',
    fig:()=>ctTwoSec({a:120,b:60,l1:'꺾인 2개 vs 곧은 선',l2:'60°',mode:'arc',showChord:true,hl:['chord']}),
    choices:['2배보다 짧아요','정확히 2배예요','2배보다 길어요'],
    ans:'2배보다 짧아요',
    hint:'주황색 꺾인 두 선분보다 곧게 지름길로 가는 빨간 점선이 더 짧은지 길이를 눈으로 비교해 보세요.',
    why:'비예시 ✕! 곧게 가는 빨간 선(현)은 꺾인 두 선을 더한 것보다 항상 짧아서 중심각이 2배여도 2배가 아니에요.'
  },
  {
    id:'sq3',
    q:'두 부채꼴의 중심각이 둘 다 <b>60°</b>예요. 원의 크기가 다를 때도 둥근 테두리의 길이가 같을까요?',
    fig:()=>ctTwoSec({a:60,b:60,diffRadius:true}),
    choices:['원 크기가 달라서 길이가 달라요','60°로 같으니 길이도 같아요'],
    ans:'원 크기가 달라서 길이가 달라요',
    hint:'작은 피자의 1조각 테두리와 큰 피자의 1조각 테두리 길이를 떠올려 보세요.',
    why:'비예시 ✕! 반드시 "한 원(또는 크기가 같은 두 원)"일 때만 중심각과 호의 길이가 정비례해요.'
  },
  {
    id:'sq4',
    q:'같은 원에서 중심각이 <b>30° → 90° (3배)</b>가 됐어요. 색칠한 조각의 넓이는 어떻게 될까요?',
    fig:()=>ctTwoSec({a:30,b:90,l1:'4 cm²',l2:'? cm²',mode:'area',hl:['val1','val2']}),
    choices:['정확히 3배 (12 cm²)','3배보다 작아요','변하지 않아요'],
    ans:'정확히 3배 (12 cm²)',
    hint:'90° 피자 조각 안에는 30° 피자 조각이 딱 3개 들어가요.',
    why:'예시 ○! 한 원에서 중심각이 3배가 되면 부채꼴의 넓이도 똑같이 3배가 돼요.'
  }
];

const FIRST_GUIDE=[
  {
    id:'fg1',tyNo:1,title:'유형 1 · 몇 배로 호의 길이 구하기',
    problem:'한 원에서 중심각이 <b>40°</b>인 부채꼴의 호의 길이가 <b>3 cm</b>일 때, 중심각이 <b>120°</b>인 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:40,b:120,l1:'3 cm',l2:'x cm',mode:'arc',hl}),
    wantChips:['120° 부채꼴의 호의 길이 (x cm)','40° 부채꼴의 넓이','원의 반지름'],
    wantAns:'120° 부채꼴의 호의 길이 (x cm)',
    wantHl:['val2'],
    givenChips:[
      {k:'a',t:'중심각 40°',ok:true,hl:'ang1'},
      {k:'l1',t:'40°의 호 3 cm',ok:true,hl:'val1'},
      {k:'b',t:'중심각 120°',ok:true,hl:'ang2'},
      {k:'trap',t:'반지름 5 cm',ok:false}
    ],
    teacherEq:'120 ÷ 40 = 3 (배) → x = 3 × 3',
    pairQ:'식 앞쪽 <b>120 ÷ 40</b>은 문제의 어떤 숫자를 나눈 것인가요?',
    pairChoices:['큰 중심각 ÷ 작은 중심각','호의 길이 ÷ 중심각'],
    pairAns:'큰 중심각 ÷ 작은 중심각',
    calcPrompt:'3 × 3 = ? (cm)',
    calcAns:9,
    calcTopic:'mul',
    calcExplain:'중심각이 120 ÷ 40 = <b>3배</b>이므로, 호의 길이도 3 × 3 = <b>9 cm</b>예요.'
  },
  {
    id:'fg2',tyNo:2,title:'유형 2 · 중심각의 비로 호의 길이 구하기',
    problem:'한 원에서 중심각이 <b>50°</b>인 부채꼴의 호의 길이가 <b>10 cm</b>일 때, 중심각이 <b>70°</b>인 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'x cm',mode:'arc',hl}),
    wantChips:['70° 부채꼴의 호의 길이 (x cm)','50° 부채꼴의 중심각','원의 지름'],
    wantAns:'70° 부채꼴의 호의 길이 (x cm)',
    wantHl:['val2'],
    givenChips:[
      {k:'a',t:'중심각 50°',ok:true,hl:'ang1'},
      {k:'l1',t:'50°의 호 10 cm',ok:true,hl:'val1'},
      {k:'b',t:'중심각 70°',ok:true,hl:'ang2'},
      {k:'trap',t:'둘레 36 cm',ok:false}
    ],
    teacherEq:'50 : 70 = 10 : x → 5 : 7 = 10 : x',
    pairQ:'비례식에서 <b>10</b>은 두 중심각(50°, 70°) 중 어느 쪽의 짝인가요?',
    pairChoices:['50° 부채꼴의 호의 길이','70° 부채꼴의 호의 길이'],
    pairAns:'50° 부채꼴의 호의 길이',
    calcPrompt:'5칸이 10 cm → 1칸 2 cm → 7칸 = ? (cm)',
    calcAns:14,
    calcTopic:'ratio',
    calcExplain:'50 : 70 = <b>5 : 7</b>이고 5칸 = 10 cm이므로 1칸 = 2 cm, 7칸 = 2 × 7 = <b>14 cm</b>예요.'
  },
  {
    id:'fg3',tyNo:3,title:'유형 3 · 세 호의 비로 중심각 구하기',
    problem:'원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = <b>2 : 3 : 4</b>일 때, <span class="arcs">BC</span>에 대한 중심각의 크기를 구하시오.',
    fig:hl=>ctThreeArcs(2,3,4,{want:'BC',hl}),
    wantChips:['호 BC에 대한 중심각 (°)','호 AB의 길이 (cm)','원 전체의 넓이'],
    wantAns:'호 BC에 대한 중심각 (°)',
    wantHl:['want','ang'],
    givenChips:[
      {k:'r',t:'세 호의 비 2 : 3 : 4',ok:true,hl:'BC'},
      {k:'full',t:'원 한 바퀴 = 360°',ok:true,hl:'ang'},
      {k:'trap',t:'반지름 6 cm',ok:false}
    ],
    teacherEq:'전체 2 + 3 + 4 = 9칸 → 360° ÷ 9 = 40° (1칸) → 40° × 3',
    pairQ:'식에서 <b>360°</b>를 왜 <b>9(2+3+4)</b>로 나누었을까요?',
    pairChoices:['한 바퀴 360°가 전체 9칸에 나눠져 있어서','호 BC의 비가 9라서'],
    pairAns:'한 바퀴 360°가 전체 9칸에 나눠져 있어서',
    calcPrompt:'1칸 40° × 호 BC 3칸 = ? (°)',
    calcAns:120,
    calcTopic:'div',
    calcExplain:'전체 9칸이 360°이므로 1칸 = 360 ÷ 9 = 40°, 호 BC는 3칸 = 40 × 3 = <b>120°</b>예요.'
  }
];

const WORKED=[
  null,
  {
    no:1,nm:'중심각 비교 ① 몇 배',
    prob:'한 원에서 중심각이 <b>40°</b>인 부채꼴의 호의 길이가 <b>3 cm</b>일 때, 중심각이 <b>120°</b>인 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:40,b:120,l1:'3 cm',l2:'x cm',mode:'arc',hl}),
    steps:[
      {t:'① 어디를 먼저 볼까?',hl:['ang1','ang2'],body:'두 중심각 <b>40°</b>와 <b>120°</b>가 딱 나누어떨어지는지 먼저 확인해요.'},
      {t:'② 중심각이 몇 배인지 구하기',hl:['ang1','ang2'],body:'120 ÷ 40 = <b>3</b> → 중심각이 <b>3배</b>로 커졌어요.'},
      {t:'③ 호의 길이도 같은 배 곱하기',hl:['val1','val2'],body:'호의 길이는 중심각에 정비례하므로 3 × 3 = <b>9 cm</b>예요.'}
    ],
    pitfall:'⚠️ 자주 하는 실수: 120° → 40°처럼 <b>작아지는 방향</b> 문제에서는 곱하지 말고 <b>나누어야(÷ 3)</b> 해요!'
  },
  {
    no:2,nm:'중심각 비교 ② 비',
    prob:'한 원에서 중심각이 <b>50°</b>인 부채꼴의 호의 길이가 <b>10 cm</b>일 때, 중심각이 <b>70°</b>인 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'x cm',mode:'arc',hl}),
    steps:[
      {t:'① 중심각의 비 간단히 하기',hl:['ang1','ang2'],body:'50 : 70을 10으로 나누면 <b>5 : 7</b>이에요. (몇 배로 딱 안 떨어질 때 비를 써요!)'},
      {t:'② 1칸의 크기 구하기',hl:['val1'],body:'50° 쪽이 <b>5칸</b>이고 호가 10 cm → <b>1칸 = 10 ÷ 5 = 2 cm</b>'},
      {t:'③ 구하는 칸 수만큼 곱하기',hl:['val2'],body:'70° 쪽은 <b>7칸</b> → x = 2 × 7 = <b>14 cm</b>예요.'}
    ],
    pitfall:'⚠️ 자주 하는 실수: 50 : 70 = x : 10처럼 <b>각과 길이의 짝(순서)</b>을 뒤집어 적으면 답이 틀려요.'
  },
  {
    no:3,nm:'호의 비로 중심각 구하기',
    prob:'원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = <b>2 : 3 : 4</b>일 때, <span class="arcs">BC</span>에 대한 중심각의 크기를 구하시오.',
    fig:hl=>ctThreeArcs(2,3,4,{want:'BC',hl}),
    steps:[
      {t:'① 전체 칸 수 더하기',hl:['AB','BC','CA'],body:'호의 비를 모두 더하면 <b>2 + 3 + 4 = 9칸</b>이에요.'},
      {t:'② 1칸의 중심각 구하기',hl:['ang'],body:'원 한 바퀴 <b>360°</b>를 전체 9칸으로 나누면 <b>1칸 = 360° ÷ 9 = 40°</b>'},
      {t:'③ 구하는 호의 칸 수 곱하기',hl:['BC','ang'],body:'호 BC는 <b>3칸</b> → 40° × 3 = <b>120°</b>예요.'}
    ],
    pitfall:'⚠️ 자주 하는 실수: 360°를 전체 합(9)이 아니라 3(한 호의 비)으로 바로 나누면 안 돼요!'
  },
  {
    no:4,nm:'정비례 ○× (현은 예외)',
    prob:'한 원에서 중심각의 크기에 대한 설명 중 옳지 않은 것을 찾는 전략',
    fig:hl=>ctTwoSec({a:120,b:60,l1:'현 비교',l2:'60°',mode:'arc',showChord:true,hl}),
    steps:[
      {t:'① 호의 길이 · 넓이 체크',hl:['val1'],body:'중심각이 2배, 3배 → <b>호의 길이 ○ · 넓이 ○</b> (정비례해요)'},
      {t:'② 현의 길이 함정 체크',hl:['chord'],body:'중심각이 2배면 현은 <b>2배보다 짧아요</b> → <b>현 ✕</b> (정비례 안 해요)'},
      {t:'③ "같은 각"과 "2배 각" 구별',hl:['ang1','ang2'],body:'중심각이 <b>똑같이 같으면</b> 현의 길이도 같아요 ○! (2배가 될 때만 예외)'}
    ],
    pitfall:'⚠️ 자주 하는 실수: "중심각이 같으면 현이 같다 ○"를 "중심각에 정비례 ○"와 헷갈리지 마세요!'
  }
];

/* ── 4. 두걸음 복합 유형 3종 (C1 · C2 · C3, 모든 시드 정수 해 보장) ── */
const TY_LABELS=['유형 1 · 몇 배','유형 2 · 비로 구하기','유형 3 · 세 호의 비(360°)','유형 4 · 도형·정비례 성질(반원 180°)'];

function makeC1(seed){
  const r=(seed*1664525+1013904223)>>>0;
  const sets=[[1,2,3],[1,3,2],[2,3,4],[2,2,5],[1,4,5],[2,3,5],[3,4,5],[3,3,6]];
  const[a,b,c]=sets[r%sets.length],t=a+b+c,one=360/t;
  const targets=[['AB',a],['BC',b],['CA',c]];
  const[wn,wv]=targets[(r>>>3)%3];
  const wantAng=one*wv;
  const k=(one%3===0&&wantAng/3>=15&&(r>>>5)%2)?3:2;
  const d=Math.round(wantAng/k),L=2+((r>>>7)%6),ans=L*k;
  return{
    id:'C1',combo:[3,1],comboWhy:'① 세 호의 비로 목표 중심각을 먼저 구하고(유형 3) → ② 기준 부채꼴의 몇 배인지 적용(유형 1)',
    ptype:'cent:c1',
    title:`원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = ${a} : ${b} : ${c}이고, 같은 원에서 중심각이 ${d}°인 부채꼴의 호의 길이가 ${L} cm일 때, <span class="arcs">${wn}</span>의 길이를 구하시오.`,
    fig:{svg:()=>ctThreeArcs(a,b,c,{want:wn,hl:['want']})},
    finalQ:`<span class="arcs">${wn}</span>의 길이는 몇 cm인가요?`,
    steps:[
      {tag:'1단계 · 목표 중심각 구하기',q:`전체 ${t}칸이 360°예요. <span class="arcs">${wn}</span>(${wv}칸)의 중심각은 몇 도인가요?`,type:'num',ans:wantAng,suffix:'°',hint:`360 ÷ ${t} = ${one}°, ${one} × ${wv}`},
      {tag:'2단계 · 몇 배인지 적용하기',q:`중심각 ${wantAng}°는 ${d}°의 ${k}배예요. <span class="arcs">${wn}</span>의 길이는 몇 cm인가요?`,type:'num',ans,suffix:'cm',hint:`${L} × ${k}`,ok:`${wantAng}° = ${d}° × ${k} → ${L} × ${k} = ${ans} cm`}
    ]
  };
}

function makeC2(seed){
  const r=(seed*22695477+1)>>>0;
  const specs=[
    {abc:[2,3,4],want:'AB',wv:2,refAng:60,p:3,q:4},   // t=9, one=40, want=80°, 60:80=3:4
    {abc:[1,3,5],want:'BC',wv:3,refAng:80,p:2,q:3},   // t=9, one=40, want=120°, 80:120=2:3
    {abc:[3,4,5],want:'BC',wv:4,refAng:90,p:3,q:4},   // t=12, one=30, want=120°, 90:120=3:4
    {abc:[2,3,5],want:'CA',wv:5,refAng:120,p:2,q:3},  // t=10, one=36, want=180°, 120:180=2:3
    {abc:[3,4,8],want:'BC',wv:4,refAng:72,p:3,q:4}    // t=15, one=24, want=96°, 72:96=3:4
  ];
  const sp=specs[r%specs.length],[a,b,c]=sp.abc,t=a+b+c,one=360/t,wantAng=one*sp.wv;
  const m=2+((r>>>4)%4),refVal=sp.p*m,ans=sp.q*m;
  return{
    id:'C2',combo:[3,2],comboWhy:'① 세 호의 비로 목표 중심각을 찾고(유형 3) → ② 기준 중심각과 간단한 비로 넓이 구하기(유형 2)',
    ptype:'cent:c2',
    title:`원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = ${a} : ${b} : ${c}이고, 같은 원에서 중심각이 ${sp.refAng}°인 부채꼴의 넓이가 ${refVal} cm²일 때, <span class="arcs">${sp.want}</span>에 대한 부채꼴의 넓이를 구하시오.`,
    fig:{svg:()=>ctThreeArcs(a,b,c,{want:sp.want,hl:['want','ang']})},
    finalQ:`<span class="arcs">${sp.want}</span>에 대한 부채꼴의 넓이는 몇 cm²인가요?`,
    steps:[
      {tag:'1단계 · 중심각 구하기',q:`전체 ${t}칸이 360°예요. <span class="arcs">${sp.want}</span>(${sp.wv}칸)의 중심각은?`,type:'num',ans:wantAng,suffix:'°',hint:`(360 ÷ ${t}) × ${sp.wv} = ${one} × ${sp.wv}`},
      {tag:'2단계 · 중심각의 비로 넓이 구하기',q:`중심각의 비 ${sp.refAng} : ${wantAng} = ${sp.p} : ${sp.q}예요. ${sp.p}칸이 ${refVal} cm²일 때 ${sp.q}칸은?`,type:'num',ans,suffix:'cm²',hint:`1칸 = ${refVal} ÷ ${sp.p} = ${m} cm², ${m} × ${sp.q}`,ok:`1칸 = ${m} cm² → ${sp.q}칸 = ${ans} cm²`}
    ]
  };
}

function makeC3(seed){
  const r=(seed*1103515245+12345)>>>0;
  const specs=[
    {a:72,b:108,p:2,q:3},
    {a:80,b:100,p:4,q:5},
    {a:54,b:126,p:3,q:7},
    {a:75,b:105,p:5,q:7},
    {a:108,b:72,p:3,q:2}
  ];
  const sp=specs[r%specs.length],m=2+((r>>>4)%4),L=sp.p*m,ans=sp.q*m;
  return{
    id:'C3',combo:[4,2],comboWhy:'① 반원의 성질(평각 180°)로 빈 중심각을 먼저 구하고(유형 4) → ② 중심각의 비로 호 구하기(유형 2)',
    ptype:'cent:c3',
    title:`그림과 같이 지름으로 만든 반원(180°)을 두 부채꼴로 나누었어요. 중심각이 ${sp.a}°인 부채꼴의 호의 길이가 ${L} cm일 때, 나머지 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.`,
    fig:{svg:()=>ctTwoSec({a:sp.a,b:sp.b,l1:`${L} cm`,l2:'x cm',mode:'arc',semi:true,hl:['ang1','val1']})},
    finalQ:'나머지 부채꼴의 호의 길이 <i>x</i>는 몇 cm인가요?',
    steps:[
      {tag:'1단계 · 반원 성질로 나머지 각 찾기',q:'반원의 중심각 180°에서 한쪽이 ' + sp.a + '°예요. 나머지 부채꼴의 중심각은?',type:'num',ans:sp.b,suffix:'°',hint:`180 − ${sp.a}`},
      {tag:'2단계 · 중심각의 비로 호 구하기',q:`${sp.a} : ${sp.b} = ${sp.p} : ${sp.q}예요. ${sp.p}칸이 ${L} cm일 때 ${sp.q}칸은?`,type:'num',ans,suffix:'cm',hint:`1칸 = ${L} ÷ ${sp.p} = ${m} cm, ${m} × ${sp.q}`,ok:`나머지 중심각 ${sp.b}° → 비 ${sp.p} : ${sp.q} → ${ans} cm`}
    ]
  };
}

const GEN_COMPOUND={C1:makeC1,C2:makeC2,C3:makeC3};

/* ── 5. 첫걸음 차시 마무리 문항 ── */
const T1_CHECK_POOL=[
  {
    id:'t1c1',kind:'schema',
    q:'다음 중 <b>중심각의 크기에 정비례하는 것</b>을 바르게 고른 것은?',
    fig:()=>ctTwoSec({a:100,b:50,l1:'호 · 넓이 vs 현',l2:'50°',mode:'arc',showChord:true}),
    choices:['호의 길이와 부채꼴의 넓이','현의 길이와 호의 길이','원의 중심과 반지름'],
    ans:'호의 길이와 부채꼴의 넓이',
    hint:'둥근 테두리(호)와 피자 조각 면적(넓이)은 정비례하고, 곧은 선분(현)은 예외예요.'
  },
  {
    id:'t1c2',kind:'given',
    q:'"중심각 60°인 부채꼴의 호가 8 cm일 때, 180°인 호의 길이 <i>x</i>를 구하시오."에서 <b>우리가 구해야 할 것</b>은?',
    fig:()=>ctTwoSec({a:60,b:180,l1:'8 cm',l2:'x cm',mode:'arc',hl:['val2']}),
    choices:['180° 부채꼴의 호의 길이 x','60° 부채꼴의 넓이','원 전체의 둘레'],
    ans:'180° 부채꼴의 호의 길이 x',
    hint:'문장 마지막에 "~을 구하시오"라고 묻고 그림에 x cm로 적힌 값을 찾아요.'
  },
  {
    id:'t1c3',kind:'ratio_pair',
    q:'중심각이 <b>40°</b>일 때 넓이가 <b>6 cm²</b>이고, <b>100°</b>일 때 넓이가 <b><i>x</i> cm²</b>예요. 알맞은 비례식은?',
    fig:()=>ctTwoSec({a:40,b:100,l1:'6 cm²',l2:'x cm²',mode:'area'}),
    choices:['40 : 100 = 6 : x','40 : 100 = x : 6','40 : 6 = 100 : 180'],
    ans:'40 : 100 = 6 : x',
    hint:'앞쪽에 작은 각(40°)과 큰 각(100°)을 썼다면, 뒤쪽도 40°의 넓이(6) : 100°의 넓이(x) 순서를 맞춰요.'
  },
  {
    id:'t1c4',kind:'three',
    q:'원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = <b>1 : 2 : 3</b>일 때, <b>원 한 바퀴 360°는 모두 몇 칸</b>으로 나뉘었나요?',
    fig:()=>ctThreeArcs(1,2,3,{want:'BC',hl:['AB','BC','CA']}),
    choices:['6칸 (1+2+3)','3칸','180칸'],
    ans:'6칸 (1+2+3)',
    hint:'세 호가 원 한 바퀴를 이루므로 세 비의 숫자 1, 2, 3을 모두 더해요.'
  }
];

/* ── 6. 2차시 cent 본체 렌더러 (3탭 × 3트랙) ── */
function bonusExploreHTML(){
  return`<div class="ct-bonus-explore"><div><b>🔬 더 알아보기 (선택 탐구)</b><small>조각 직접 붙여 보기 · 현은 정말 2배가 안 될까? 실험으로 확인하고 배지도 모아요.</small></div><a class="btn ghost" href="#cent-explore">탐구 활동 해 보기 →</a></div>`;
}

function viewCentLesson(id,tab){
  clearAutoNav();
  const L=(typeof LESSONS!=='undefined'&&LESSONS.find(l=>l.id==='cent'))||{id:'cent',no:2,title:'중심각과 호',tb:'04 원과 부채꼴 · 195~197쪽',unit:'circle'};
  const p=centProg();
  if(typeof crumbs!=='undefined'&&crumbs){
    crumbs.innerHTML=`<span class="sep">›</span><a href="#unit-${L.unit||'circle'}">${typeof unitOf==='function'?unitOf(L.unit||'circle').name:'원과 부채꼴'}</a><span class="sep">›</span><span>${L.title}</span>`;
  }

  if(tab==='explore'&&typeof EXPLORE==='object'&&EXPLORE.cent){
    app.innerHTML=`<div class="ct-head"><div class="ct-head-top"><span class="ct-brand-tag">📘 교과서 한 걸음 · 2차시</span><a class="btn ghost" href="#cent">← 2차시로 돌아가기</a></div><div class="ct-title-row"><h1>${L.title} · 더 알아보기</h1></div></div><div id="tabBody"></div>`;
    EXPLORE.cent($('#tabBody',app));
    p.explore=true;if(typeof save==='function')save();
    return;
  }

  const tr=curTrack();
  const explicitTab=typeof location==='object'&&/^#cent-(concept|steps|practice)$/.test(location.hash||'');
  let activeTab=(tab==='concept'||tab==='steps'||tab==='practice')?tab:'concept';
  if(!explicitTab&&tr===1&&!p.t1SchemaDone)activeTab='steps';

  const trackInfos=[
    {k:1,ic:'🌱',nm:'첫걸음',sub:'모양·조건 분해 먼저 · 계산 도움'},
    {k:2,ic:'🌿',nm:'한걸음',sub:'대표 예제 + 기본 유형 정복'},
    {k:3,ic:'🌳',nm:'두걸음',sub:'복합 유형 조합 분석 · 실전'}
  ];
  const tabDefs=tr===1
    ?[
      {id:'steps',t:'유형 익히기',s:'① 먼저 추천 · 모양·지시 클릭',rec:'추천 ①'},
      {id:'concept',t:'개념 보기',s:'② 모양에 이름표 붙이기',rec:'②'},
      {id:'practice',t:'차시 마무리',s:'③ 계산 없이 구조 확인',rec:'③'}
    ]
    :[
      {id:'concept',t:'개념 보기',s:tr===3?'선택 · 함정/전략 요약':'선택 · 패스 가능'},
      {id:'steps',t:'유형 익히기',s:tr===3?'복합 유형 조합 분해':'대표 예제 + 변형 연습'},
      {id:'practice',t:'차시 마무리',s:tr===3?'6문제 실전 마무리':'4유형 섞어 풀기'}
    ];

  const doneMap={
    concept:!!p.concept,
    steps:tr===1?!!p.t1SchemaDone:(Number(p.steps)>0),
    practice:window.lessonTrackDone('cent')>=tr
  };

  app.innerHTML=`
    <div class="ct-head">
      <div class="ct-head-top">
        <span class="ct-brand-tag">📘 교과서 한 걸음 · 2차시</span>
        <span class="ct-tb">교과서 ${L.tb}</span>
      </div>
      <div class="ct-title-row"><h1>${L.title}</h1></div>
      <div class="ct-tracks" role="group" aria-label="학습 트랙 선택">
        ${trackInfos.map(t=>`<button type="button" class="ct-tr${t.k===tr?' on':''}" data-track="${t.k}"><strong>${t.ic} ${t.nm}</strong><small>${t.sub}</small></button>`).join('')}
      </div>
      <p class="ct-tr-note">${tr===1?'<b>첫걸음 순서:</b> ① 유형 익히기에서 예시·비예시 모양과 문제 쪼개기를 먼저 해 본 뒤 → ② 개념 보기에서 이름표를 확인해요.':tr===2?'<b>한걸음:</b> 개념은 이미 알면 바로 차시 마무리로 건너뛰어도 돼요. 막히면 선생님 대표 예제로 돌아와요.':'<b>두걸음:</b> 기존 유형 두 개가 합쳐진 복합 유형을 쪼개어 풀어요.'}</p>
    </div>
    <div class="ct-tabs" role="tablist">
      ${tabDefs.map((t,i)=>`<button type="button" role="tab" class="ct-tab${t.id===activeTab?' on':''}${doneMap[t.id]?' done':''}" data-tab="${t.id}" aria-selected="${t.id===activeTab}"><span class="ct-tab-num">${doneMap[t.id]&&t.id!==activeTab?'✓':i+1}</span><span class="ct-tab-lbl"><b>${t.t}</b><small>${t.s}</small></span>${t.rec?`<span class="ct-rec-badge">${t.rec}</span>`:''}</button>`).join('')}
    </div>
    <div id="ctBody"></div>`;

  $$('.ct-tr',app).forEach(b=>b.onclick=()=>{
    setTrack(+b.dataset.track);
    viewCentLesson('cent',activeTab);
  });
  $$('.ct-tab',app).forEach(b=>b.onclick=()=>{
    const nxt=b.dataset.tab;
    if(typeof location==='object')location.hash='cent-'+(nxt==='concept'?'concept':nxt);
    else viewCentLesson('cent',nxt);
  });

  if(typeof DB==='object'&&DB){DB._last={id:'cent',tab:activeTab};if(typeof save==='function')save()}
  const body=$('#ctBody',app);
  if(tr===1){
    if(activeTab==='steps')renderT1Steps(body);
    else if(activeTab==='concept')renderT1Concept(body);
    else renderT1Practice(body);
  }else if(tr===2){
    if(activeTab==='concept')renderT2Concept(body);
    else if(activeTab==='steps')renderT2Steps(body);
    else renderT2Practice(body);
  }else{
    if(activeTab==='concept')renderT3Concept(body);
    else if(activeTab==='steps')renderT3Steps(body);
    else renderT3Practice(body);
  }
}

/* ── 6-A. 🌱 첫걸음 렌더러 ── */
function renderT1Steps(body){
  const p=centProg();
  let sub=p.t1SchemaDone?'guide':'schema';
  const drawSub=()=>{
    clearAutoNav();
    body.innerHTML=`<div class="ct-subtabs">
      <button type="button" class="ct-subtab${sub==='schema'?' on':''}" data-s="schema">A. 예시·비예시 모양 구별 (${p.t1SchemaDone?'완료 ✓':'4문항'})</button>
      <button type="button" class="ct-subtab${sub==='guide'?' on':''}" data-s="guide">B. 교사 풀이 지시 따라하기 (3유형)</button>
    </div><div id="t1SubHost"></div>`;
    $$('.ct-subtab',body).forEach(b=>b.onclick=()=>{sub=b.dataset.s;drawSub()});
    const host=$('#t1SubHost',body);
    if(sub==='schema')renderT1Schema(host,()=>{sub='guide';drawSub()});
    else renderT1Guide(host);
  };
  drawSub();
}

function renderT1Schema(host,onNextPart){
  const p=centProg();
  let idx=0,coolTimer=null,shownAt=Date.now();
  const draw=()=>{
    if(coolTimer){clearTimeout(coolTimer);coolTimer=null}
    if(idx>=SCHEMA_QS.length){
      p.t1SchemaDone=true;if(typeof save==='function')save();
      if(typeof award==='function')award(5,'cent:t1schema','예시·비예시 모양을 모두 구별했어요');
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>모양 스키마 구별 4문항 완료!</b> 방금 본 모양들에 어떤 이름이 붙는지 <b>개념 보기</b>에서 바로 확인해 봐요.</div>
        <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#cent-concept">이제 개념 보기에서 이름표 붙이기 →</a><button type="button" class="btn ghost" id="toGuideBtn">교사 풀이 따라하기 해 보기</button></div></div>`;
      const gb=$('#toGuideBtn',host);if(gb)gb.onclick=onNextPart;
      return;
    }
    const q=SCHEMA_QS[idx];shownAt=Date.now();
    host.innerHTML=`<div class="ct-card ct-schema">
      <div class="ct-card-h"><h2>예시 · 비예시 모양 찾기</h2><div class="ct-schema-prog">${SCHEMA_QS.map((_,i)=>`<span class="ct-dot-step${i<idx?' done':i===idx?' on':''}">${i<idx?'✓':i+1}</span>`).join('')}<span>${idx+1} / ${SCHEMA_QS.length}</span></div></div>
      <div class="ct-stage">
        <div class="ct-fig" id="sqFig">${q.fig()}<div class="ct-fig-cap">그림의 굵은 표시를 눈으로 먼저 확인해요</div></div>
        <div>
          <p class="ct-schema-q">${q.q}</p>
          <div class="ct-hit-row" id="sqOpts">${q.choices.map(c=>`<button type="button" class="ct-hit" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="sqMsg"></div>
        </div>
      </div></div>`;
    $$('#sqOpts .ct-hit',host).forEach(btn=>{
      btn.onclick=()=>{
        const v=btn.dataset.v,ms=Date.now()-shownAt;
        if(v===q.ans){
          recordMetric(ms,null);
          $$('#sqOpts .ct-hit',host).forEach(b=>b.disabled=true);
          btn.classList.add('ok');
          $('#sqMsg',host).innerHTML=`<div class="feedback ok" style="margin-top:10px">${q.why}</div><div class="next-row" style="justify-content:flex-start"><button type="button" class="btn primary" id="sqNext">${idx+1<SCHEMA_QS.length?'다음 모양 보기 →':'완료!'}</button></div>`;
          const nb=$('#sqNext',host);if(nb)nb.onclick=()=>{idx++;draw()};
        }else{
          recordMetric(ms,'schema_wrong');
          $$('#sqOpts .ct-hit',host).forEach(b=>b.disabled=true);
          btn.classList.add('bad');
          $('#sqMsg',host).innerHTML=`<div class="ct-cool">💡 ${q.hint}<br><small>그림을 1.5초 동안 천천히 다시 보고 골라 보세요…</small></div>`;
          coolTimer=setTimeout(()=>{
            $$('#sqOpts .ct-hit',host).forEach(b=>{if(b!==btn)b.disabled=false});
          },1500);
        }
      };
    });
  };
  draw();
}

function renderT1Guide(host){
  let gIdx=0,step=0,foundGiven=new Set(),helped=false,stepShown=Date.now();
  const draw=()=>{
    clearAutoNav();
    const g=FIRST_GUIDE[gIdx];
    const hl=step===0?[]:step===1?(foundGiven.size?g.givenChips.filter(c=>foundGiven.has(c.k)).map(c=>c.hl):[g.wantHl[0]]):['ang1','ang2','val1','val2','BC','ang'];
    stepShown=Date.now();

    const s0Done=step>0,s1Done=step>1,s2Done=step>2,s3Done=step>3;
    const calcNm=(typeof CALC!=='undefined'&&CALC.find(c=>c.id===g.calcTopic)||{}).nm||g.calcTopic;

    host.innerHTML=`<div class="ct-card">
      <div class="ct-card-h">
        <h2>${g.title}</h2>
        <div class="ct-hit-row" style="margin:0">${FIRST_GUIDE.map((x,i)=>`<button type="button" class="chip${i===gIdx?' on':''}" data-gi="${i}">${x.tyNo}번 유형</button>`).join('')}</div>
      </div>
      <div class="box plain" style="margin-top:0">${g.problem}</div>
      <div class="ct-stage">
        <div class="ct-fig">${g.fig(hl)}<div class="ct-fig-cap">지시에 따라 클릭하면 그림이 함께 바뀌어요</div></div>
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
            <div class="ct-gstep-h"><span class="ct-gnum">${s2Done?'✓':'3'}</span>교사 풀이 식의 숫자가 어디서 왔는지 맞춰 봐요</div>
            ${step<2?'<small class="muted">2단계를 마치면 열려요</small>':`<div class="ct-eq-box">${g.teacherEq}</div>`+(s2Done?`<small style="color:var(--ok)">✓ ${g.pairAns}</small>`
              :`<p style="margin:6px 0">${g.pairQ}</p><div class="ct-hit-row">${g.pairChoices.map(c=>`<button type="button" class="ct-hit" data-p="${c}">${c}</button>`).join('')}</div><div id="fgM2"></div>`)}
          </div>

          <div class="ct-gstep ${s3Done?'done':step===3?'cur':'lock'}">
            <div class="ct-gstep-h"><span class="ct-gnum">${s3Done?'✓':'4'}</span>계산해서 답을 넣어 보세요</div>
            ${step<3?'<small class="muted">3단계를 마치면 열려요</small>':s3Done?`<div class="feedback ok">${g.calcExplain}</div>`
              :`<p style="margin:4px 0">${g.calcPrompt}</p>
                <div class="ct-input-row"><input type="number" class="ct-inp" id="fgInp" placeholder="?" inputmode="numeric"><button type="button" class="btn primary" id="fgChk">확인</button></div>
                <div id="fgM3"></div>
                <div class="ct-calchelp">
                  <button type="button" class="ct-calchelp-toggle" id="fgHelpBtn">🤔 계산이 어렵나요? (선생님이 대신 계산 + 기초 연산 연결)</button>
                  <div id="fgHelpBox"${helped?'':' hidden'}></div>
                </div>`}
          </div>
        </div>
      </div>
      ${s3Done?`<div class="next-row"><button type="button" class="btn ghost" id="fgNext">${gIdx+1<FIRST_GUIDE.length?'다음 유형 연습하기 →':'차시 마무리 하러 가기 →'}</button></div>`:''}
    </div>`;

    $$('[data-gi]',host).forEach(b=>b.onclick=()=>{gIdx=+b.dataset.gi;step=0;foundGiven=new Set();helped=false;draw()});
    $$('[data-w]',host).forEach(b=>b.onclick=()=>{
      const ms=Date.now()-stepShown;
      if(b.dataset.w===g.wantAns){recordMetric(ms,null);step=1;draw()}
      else{recordMetric(ms,'want_wrong');b.classList.add('bad');$('#fgM0',host).innerHTML='<small style="color:var(--bad)">문장 끝에서 무엇을 구하라고 했는지 다시 봐요.</small>'}
    });
    const needCnt=g.givenChips.filter(c=>c.ok).length;
    $$('[data-gk]',host).forEach(b=>b.onclick=()=>{
      const ch=g.givenChips.find(x=>x.k===b.dataset.gk),ms=Date.now()-stepShown;
      if(ch&&ch.ok){recordMetric(ms,null);foundGiven.add(ch.k);if(foundGiven.size>=needCnt)step=2;draw()}
      else{recordMetric(ms,'given_trap');b.classList.add('bad');$('#fgM1',host).innerHTML='<small style="color:var(--bad)">그 정보는 이 문제에 적혀 있지 않은 함정이에요.</small>'}
    });
    $$('[data-p]',host).forEach(b=>b.onclick=()=>{
      const ms=Date.now()-stepShown;
      if(b.dataset.p===g.pairAns){recordMetric(ms,null);step=3;draw()}
      else{recordMetric(ms,'pair_wrong');b.classList.add('bad');$('#fgM2',host).innerHTML='<small style="color:var(--bad)">그림에 짝지어진 각과 길이를 다시 봐요.</small>'}
    });

    const chk=$('#fgChk',host),inp=$('#fgInp',host);
    if(chk&&inp)chk.onclick=()=>{
      const v=parseFloat(inp.value),ms=Date.now()-stepShown;
      if(Number.isFinite(v)&&Math.abs(v-g.calcAns)<1e-6){
        recordMetric(ms,null);step=4;if(typeof award==='function')award(3,'cent:fg:'+g.id,'교사 풀이를 따라 풀었어요');draw();
      }else{
        recordMetric(ms,'calc_err');
        $('#fgM3',host).innerHTML='<small style="color:var(--bad)">식 숫자를 다시 확인해 보거나, 아래 "계산이 어렵나요?"를 눌러도 돼요.</small>';
      }
    };

    const hb=$('#fgHelpBtn',host),hbox=$('#fgHelpBox',host);
    if(hb&&hbox)hb.onclick=()=>{
      clearAutoNav();
      helped=true;
      if(typeof DB==='object'&&DB){DB._needCalc={id:g.calcTopic,from:'cent',at:Date.now()};if(typeof save==='function')save()}
      step=4;
      draw();
      const boxAfter=$('#fgHelpBox',host)||hbox;
      let left=3;
      const paintBox=()=>{
        boxAfter.hidden=false;
        boxAfter.className='ct-calchelp-box';
        boxAfter.innerHTML=`<div><b>선생님이 대신 계산했어요:</b> ${g.calcExplain}</div>
          <div style="margin-top:6px">이 계산이 막혔으니 <b>기초 연산 · ${calcNm}</b>으로 <b id="fgSec">${left}</b>초 뒤 자동 이동해요.</div>
          <div class="ct-timer-bar"><i id="fgBar" style="width:${Math.round((3-left)/3*100)}%"></i></div>
          <div class="ct-calchelp-act">
            <a class="btn primary" href="#calc-${g.calcTopic}">지금 바로 기초 연산 가기 →</a>
            <button type="button" class="btn ghost" id="fgCancelNav">여기 머무르기</button>
          </div>`;
        const cBtn=$('#fgCancelNav',boxAfter);
        if(cBtn)cBtn.onclick=()=>{clearAutoNav();const sec=$('#fgSec',boxAfter);if(sec&&sec.parentNode)sec.parentNode.innerHTML='자동 이동을 멈췄어요. 위 버튼으로 언제든 갈 수 있어요.'};
      };
      paintBox();
      autoNavTick=setInterval(()=>{left=Math.max(0,left-1);const s=$('#fgSec',boxAfter),br=$('#fgBar',boxAfter);if(s)s.textContent=left;if(br)br.style.width=`${Math.round((3-left)/3*100)}%`},1000);
      autoNavTimer=setTimeout(()=>{clearAutoNav();if(typeof location==='object')location.hash='#calc-'+g.calcTopic},3100);
    };

    const nb=$('#fgNext',host);
    if(nb)nb.onclick=()=>{if(gIdx+1<FIRST_GUIDE.length){gIdx++;step=0;foundGiven=new Set();helped=false;draw()}else if(typeof location==='object')location.hash='#cent-practice'};
  };
  draw();
}

function renderT1Concept(body){
  let slices=1,showChord=false,diffCircle=false;
  const draw=()=>{
    body.innerHTML=`
      <div class="ct-card ct-click-concept">
        <div class="ct-card-h"><h2>1. 조각을 늘리며 눈으로 보기</h2><span class="ct-kicker">먼저 클릭해 보세요</span></div>
        <div class="ct-stage">
          <div class="ct-fig">${ctSliceStack(30,slices,'2 cm','4 cm²',{showChord})}</div>
          <div>
            <p style="margin-top:0">30° 부채꼴 조각을 하나씩 늘려 보세요.</p>
            <div class="ct-hit-row">
              ${[1,2,3,4].map(k=>`<button type="button" class="ct-hit${slices===k?' sel':''}" data-sl="${k}">${k}조각 (${k*30}°)</button>`).join('')}
            </div>
            <div class="ct-nameplate">
              <b>지금 조각 ${slices}개 (${slices*30}°):</b> 둥근 테두리(<b>호</b>) = <b>${slices*2} cm</b> · 색칠(<b>넓이</b>) = <b>${slices*4} cm²</b><br>
              <small>📌 <b>사후 이름표:</b> 중심각이 ${slices}배가 되니 호와 넓이도 <b>${slices}배</b> → 이런 관계를 <b>정비례</b>라고 해요.</small>
            </div>
          </div>
        </div>
      </div>

      <div class="ct-card ct-click-concept">
        <div class="ct-card-h"><h2>2. 곧은 선(현)과 다른 원 비교하기</h2><span class="ct-kicker">전환 클릭</span></div>
        <div class="ct-stage">
          <div class="ct-fig">${diffCircle?ctTwoSec({a:60,b:60,diffRadius:true}):ctTwoSec({a:120,b:60,l1:'꺾인 호 vs 곧은 선',l2:'60°',mode:'arc',showChord})}</div>
          <div>
            <div class="ct-hit-row">
              <button type="button" class="ct-hit${!diffCircle&&!showChord?' sel':''}" data-mode="arc">호(둥근 테두리) 보기</button>
              <button type="button" class="ct-hit${!diffCircle&&showChord?' sel':''}" data-mode="chord">현(곧은 점선) 비교</button>
              <button type="button" class="ct-hit${diffCircle?' sel':''}" data-mode="diff">크기 다른 원 비교</button>
            </div>
            <div class="ct-nameplate">
              ${diffCircle?'<b>📌 한 원 조건:</b> 원의 크기가 다르면 중심각이 60°로 같아도 호의 길이가 달라요. 반드시 <b>한 원(또는 합동인 원)</b>에서 비교해요.'
                :showChord?'<b>📌 현은 예외:</b> 두 점을 곧게 이은 선분을 <b>현</b>이라고 해요. 현은 꺾인 두 선보다 항상 짧아서 중심각이 2배여도 2배가 되지 않아요.'
                :'<b>📌 호와 부채꼴:</b> 둥근 테두리가 <b>호</b>, 피자 조각 전체가 <b>부채꼴</b>이에요. "현 비교"를 눌러 차이점을 확인해 보세요.'}
            </div>
          </div>
        </div>
      </div>
      <div class="next-row"><a class="btn primary" href="#cent-practice">3단계 차시 마무리 하러 가기 →</a></div>
      ${bonusExploreHTML()}`;

    $$('[data-sl]',body).forEach(b=>b.onclick=()=>{slices=+b.dataset.sl;draw()});
    $$('[data-mode]',body).forEach(b=>b.onclick=()=>{
      const m=b.dataset.mode;
      diffCircle=m==='diff';
      showChord=m==='chord';
      draw();
    });
  };
  draw();
}

function renderT1Practice(body){
  const p=centProg();
  let qQueue=T1_CHECK_POOL.slice(),idx=0,recheckKind=null,consecKind=null,rescued=false,doneSet=new Set();
  const draw=()=>{
    if(rescued){
      body.innerHTML=`<div class="ct-rescue"><h3>잠깐! 방금 유형을 한 번 더 정리하고 올까요?</h3><p>같은 종류의 판단을 두 번 연속 헷갈렸어요. <b>유형 익히기</b>에서 그림과 지시를 따라 다시 확인하고 돌아오면 훨씬 쉬워요.</p>
        <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#cent-steps">유형 익히기로 돌아가기 →</a><button type="button" class="btn ghost" id="t1RetryAll">차시 마무리 다시 풀기</button></div></div>`;
      const rb=$('#t1RetryAll',body);if(rb)rb.onclick=()=>{qQueue=T1_CHECK_POOL.slice();idx=0;recheckKind=null;consecKind=null;rescued=false;doneSet=new Set();draw()};
      return;
    }
    if(idx>=qQueue.length){
      p.trackDone=Math.max(Number(p.trackDone)||0,1);
      p.concept=true;
      if(typeof save==='function')save();
      if(typeof award==='function')award(10,'cent:t1','첫걸음 차시 마무리를 통과했어요');
      body.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌱 첫걸음 차시 마무리 통과!</b><br>모양 구별·주어진 정보 찾기·비례식 구조 4가지를 모두 해냈어요.</div>
        <div class="next-row" style="justify-content:flex-start">
          <button type="button" class="btn primary" id="upToT2">🌿 한걸음(식 채우기) 1문제 맛보기 →</button>
          <a class="btn ghost" href="#home">처음 화면으로</a>
        </div></div>${bonusExploreHTML()}`;
      const u2=$('#upToT2',body);if(u2)u2.onclick=()=>{setTrack(2);viewCentLesson('cent','steps')};
      return;
    }
    const item=qQueue[idx],shownAt=Date.now();
    body.innerHTML=`<div class="ct-chk-bar"><b>🌱 첫걸음 차시 마무리</b><span>진행 ${Math.min(doneSet.size,4)} / 4</span></div>
      ${recheckKind===item.kind?'<div class="ct-recheck">💡 실수일 수 있어요! 같은 종류 문제를 한 번 더 확인해 볼게요.</div>':''}
      <div class="ct-card"><div class="ct-stage">
        <div class="ct-fig">${item.fig()}</div>
        <div><p class="ct-schema-q">${item.q}</p>
          <div class="ct-hit-row" id="t1Ch">${item.choices.map(c=>`<button type="button" class="ct-hit" data-v="${c}">${c}</button>`).join('')}</div>
          <div id="t1Msg"></div>
        </div>
      </div></div>`;
    $$('#t1Ch .ct-hit',body).forEach(b=>b.onclick=()=>{
      const ms=Date.now()-shownAt;
      if(b.dataset.v===item.ans){
        recordMetric(ms,null);
        doneSet.add(item.kind);consecKind=null;recheckKind=null;
        b.classList.add('ok');$$('#t1Ch .ct-hit',body).forEach(x=>x.disabled=true);
        $('#t1Msg',body).innerHTML=`<div class="feedback ok" style="margin-top:8px">정답이에요!</div><div class="next-row" style="justify-content:flex-start"><button type="button" class="btn primary" id="t1Nxt">${idx+1<qQueue.length?'다음 문제 →':'결과 보기 →'}</button></div>`;
        const nb=$('#t1Nxt',body);if(nb)nb.onclick=()=>{idx++;draw()};
      }else{
        recordMetric(ms,'t1_check_wrong');
        if(consecKind===item.kind){rescued=true;draw();return}
        consecKind=item.kind;recheckKind=item.kind;
        const alt=T1_CHECK_POOL.find(x=>x.kind===item.kind)||item;
        qQueue.splice(idx+1,0,alt);
        b.classList.add('bad');$$('#t1Ch .ct-hit',body).forEach(x=>x.disabled=true);
        $('#t1Msg',body).innerHTML=`<div class="ct-cool">💡 ${item.hint}</div><div class="next-row" style="justify-content:flex-start"><button type="button" class="btn primary" id="t1Nxt">확인 문제 하나 더 →</button></div>`;
        const nb=$('#t1Nxt',body);if(nb)nb.onclick=()=>{idx++;draw()};
      }
    });
  };
  draw();
}

/* ── 6-B. 🌿 한걸음 렌더러 ── */
function renderT2Concept(body){
  let slices=1;
  const draw=()=>{
    body.innerHTML=`
      <div class="ct-pass-bar">
        <span>이미 정규 수업에서 배웠나요? 개념은 건너뛰어도 완료로 인정돼요.</span>
        <a class="btn primary" href="#cent-practice">바로 차시 마무리 도전 →</a>
      </div>
      <div class="ct-card">
        <div class="ct-card-h"><h2>1. 원리 확인 · 몇 배와 비로 구하기</h2><span class="ct-kicker">클릭으로 확인</span></div>
        <div class="ct-stage">
          <div class="ct-fig">${ctSliceStack(40,slices,'3 cm','5 cm²')}</div>
          <div>
            <div class="ct-hit-row">${[1,2,3].map(k=>`<button type="button" class="ct-hit${slices===k?' sel':''}" data-sl="${k}">40° × ${k} (${k*40}°)</button>`).join('')}</div>
            <div class="box" style="margin:8px 0"><b>지금:</b> 중심각 <b>${slices*40}°</b> → 호 <b>${slices*3} cm</b> · 넓이 <b>${slices*5} cm²</b><br><small>딱 나누어떨어지면 <b>몇 배</b>, 안 나눠지면 <b>가장 간단한 비 → 1칸 크기</b>를 구해요.</small></div>
          </div>
        </div>
      </div>
      <div class="cp-strat" style="margin-top:0">
        <h2>문제 조건별 풀이 전략 고르기</h2>
        <table class="cp-strat-table">
          <thead><tr><th>문제 모습</th><th>확인할 열쇠</th><th>풀이 순서</th></tr></thead>
          <tbody>
            <tr><td><b>딱 나누어떨어지는 두 각</b><br><small>예: 40°와 120°</small></td><td>몇 배인지 확인</td><td>120 ÷ 40 = <b>3배</b> → 호·넓이 × 3 (작아지면 ÷)</td></tr>
            <tr><td><b>안 나누어떨어지는 두 각</b><br><small>예: 50°와 70°</small></td><td>간단한 비 · 1칸</td><td>50 : 70 = <b>5 : 7</b> → 1칸 구하고 7칸 곱하기</td></tr>
            <tr><td><b>원 위의 세 점 (호의 비)</b><br><small>예: 2 : 3 : 4</small></td><td>원 한 바퀴 = <b>360°</b></td><td>전체 9칸 → 360° ÷ 9 = 40°(1칸) → 원하는 칸</td></tr>
            <tr><td><b>현의 길이 비교</b></td><td>예외 조심!</td><td>중심각이 같으면 현도 같지만, 2배일 때는 <b>2배보다 짧음</b></td></tr>
          </tbody>
        </table>
      </div>
      <div class="next-row"><a class="btn primary" href="#cent-steps">2단계 유형 익히기 (대표 예제) →</a></div>
      ${bonusExploreHTML()}`;
    $$('[data-sl]',body).forEach(b=>b.onclick=()=>{slices=+b.dataset.sl;draw()});
  };
  draw();
}

function renderT2Steps(body,initialTypeNo){
  const p=centProg(),TL=(typeof PTYPES!=='undefined'&&PTYPES.cent)||[];
  p.tyS=p.tyS||{};
  let curNo=initialTypeNo||null,wxStep=0,probSeed=typeof newSeed==='function'?newSeed():1;

  const draw=()=>{
    if(!curNo){
      body.innerHTML=`<div class="ct-card">
        <div class="ct-card-h"><h2>유형 고르기</h2><span class="muted">각 유형마다 <b>고정 선생님 대표 예제</b>를 보고 변형 문제를 연습해요</span></div>
        <div class="tpick">${TL.map(t=>`<button type="button" class="tpc" data-no="${t.no}"><span class="tpn">유형 ${t.no}</span><b>${t.nm}</b><div class="d">${t.key}</div><div class="s"><span>${t.tb}</span><span>${p.tyS[t.no]?`✓ ${p.tyS[t.no]}번 풀었어요`:'아직 안 풀었어요'}</span></div></button>`).join('')}</div>
      </div>`;
      $$('.tpc',body).forEach(b=>b.onclick=()=>{curNo=+b.dataset.no;wxStep=0;probSeed=typeof newSeed==='function'?newSeed():1;draw()});
      return;
    }
    const W=WORKED[curNo],T_=TL.find(t=>t.no===curNo)||{no:curNo,nm:''};
    const stObj=W.steps[Math.min(wxStep,W.steps.length-1)];
    body.innerHTML=`
      <div class="tybar"><span class="tyn">유형 ${T_.no}</span><b>${T_.nm}</b><button type="button" class="btn tyback" id="t2Back">🔀 다른 유형 고르기</button></div>
      <div class="ct-wx">
        <div class="ct-wx-head"><span class="ct-wx-tag">👩‍🏫 정교화 선생님 대표 예제</span><span class="muted">단계를 누르면 왼쪽 그림의 핵심 부위가 함께 강조돼요</span></div>
        <p style="margin:0 0 10px">${W.prob}</p>
        <div class="ct-stage">
          <div class="ct-fig">${W.fig(stObj.hl)}</div>
          <div>
            <div class="ct-wx-steps">
              ${W.steps.map((s,i)=>`<button type="button" class="ct-wx-step${i===wxStep?' on':''}" data-ws="${i}"><div class="ct-wx-step-top">${s.t}</div>${i<=wxStep?`<div class="ct-wx-step-body">${s.body}</div>`:'<small class="muted">눌러서 설명 보기</small>'}</button>`).join('')}
            </div>
            <div class="ct-pitfall">${W.pitfall}</div>
          </div>
        </div>
      </div>
      <div class="ct-card"><div class="ct-card-h"><h2>이제 숫자만 바뀐 변형 문제 풀기</h2><button type="button" class="btn ghost" id="t2New">🔄 새 숫자 문제</button></div><div id="t2ProbHost"></div></div>`;

    const back=$('#t2Back',body);if(back)back.onclick=()=>{curNo=null;draw()};
    $$('[data-ws]',body).forEach(b=>b.onclick=()=>{wxStep=+b.dataset.ws;draw()});
    const mountVar=()=>{
      const prob=typeof GEN==='object'&&GEN[tyKey('cent',curNo)]?GEN[tyKey('cent',curNo)](probSeed):null;
      if(!prob||typeof renderProblem!=='function')return;
      renderProblem($('#t2ProbHost',body),prob,{mode:'steps',visual:true,rep:{lesson:'cent',gen:tyKey('cent',curNo),seed:probSeed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
        if(typeof logAttempt==='function')logAttempt({lesson:'cent',kind:'steps',good,wrongs,mode,gen:tyKey('cent',curNo),seed:probSeed,ptype:prob.ptype,stepWrongs,revealed});
        if(good){p.steps=(Number(p.steps)||0)+1;p.tyS[curNo]=(p.tyS[curNo]||0)+1;if(typeof save==='function')save();if(typeof award==='function')award(10,null,'유형 변형 문제를 풀었어요')}
        else if(typeof addReview==='function')addReview(tyKey('cent',curNo),probSeed,'cent');
        const nx=TL.find(t=>t.no>curNo);
        const row=document.createElement('div');
        row.className='next-row';row.style.justifyContent='flex-start';
        row.innerHTML=`<button type="button" class="btn" id="t2More">같은 유형 하나 더</button>${nx?`<button type="button" class="btn primary" id="t2Next">유형 ${nx.no} →</button>`:'<a class="btn primary" href="#cent-practice">차시 마무리 하러 가기 →</a>'}`;
        box.appendChild(row);
        const mBtn=$('#t2More',row);if(mBtn)mBtn.onclick=()=>{probSeed=(probSeed+7)%99999+1;mountVar()};
        const nBtn=$('#t2Next',row);if(nBtn)nBtn.onclick=()=>{curNo=nx.no;wxStep=0;probSeed=(probSeed+13)%99999+1;draw()};
      }});
    };
    const nw=$('#t2New',body);if(nw)nw.onclick=()=>{probSeed=(probSeed+17)%99999+1;mountVar()};
    mountVar();
  };
  draw();
}

function renderAdaptivePractice(body,cfg){
  const p=centProg();
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

    if(idx>=queue.length){
      cfg.onPass(body,results);
      return;
    }

    const cur=queue[idx],prob=cur.makeProb(cur.seed),shownAt=Date.now();
    body.innerHTML=`<div class="ct-chk-bar"><b>${cfg.title}</b><span>남은 문항 · ${idx+1} / ${queue.length}</span></div>
      ${cur.recheck?'<div class="ct-recheck">💡 단순 계산 실수일 수 있어요! 같은 유형의 숫자만 바꾼 문제를 한 번 더 확인해요.</div>':''}
      <div class="ct-card" id="chkHost"></div>`;

    if(typeof renderProblem!=='function')return;
    renderProblem($('#chkHost',body),prob,{mode:'final',visual:true,rep:{lesson:'cent',gen:cur.genKey,seed:cur.seed},onDone:({good,wrongs,mode,stepWrongs,revealed,box})=>{
      const ok=good&&wrongs===0;
      recordMetric(Date.now()-shownAt,ok?null:'prac_'+cur.key);
      if(typeof logAttempt==='function')logAttempt({lesson:'cent',kind:'practice',good,wrongs,mode,gen:cur.genKey,seed:cur.seed,ptype:prob.ptype,stepWrongs,revealed,mixed:true});
      if(ok){
        consecWrongKey=null;
        results.push({key:cur.key,label:cur.label,status:cur.recheck?'recovered':'first'});
        const nb=document.createElement('button');nb.type='button';nb.className='btn primary';
        nb.textContent=idx+1<queue.length?'다음 문제 →':'마무리 결과 보기 →';
        nb.onclick=()=>{idx++;draw()};
        box.appendChild(nb);
      }else{
        if(typeof addReview==='function')addReview(cur.genKey,cur.seed,'cent');
        if(consecWrongKey===cur.key){
          rescuedItem=cur;draw();return;
        }
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

function renderT2Practice(body){
  const p=centProg(),TL=(typeof PTYPES!=='undefined'&&PTYPES.cent)||[];
  const r=typeof mulberry==='function'?mulberry((typeof newSeed==='function'?newSeed():101)):Math.random;
  const order=[1,2,3,4];
  if(typeof shuffle==='function')order.splice(0,4,...shuffle(r,order));
  const items=order.map((no,k)=>{
    const t=TL.find(x=>x.no===no)||{nm:'유형 '+no};
    return{
      key:'ty'+no,tyNo:no,label:`유형 ${no} · ${t.nm}`,
      genKey:typeof tyKey==='function'?tyKey('cent',no):'cent',
      seed:Math.floor((typeof newSeed==='function'?newSeed():100)+k*19)%99999+1,
      makeProb:sd=>GEN[tyKey('cent',no)](sd),
      rescueDesc:`<b>유형 ${no} (${t.nm})</b>이 아직 헷갈리는 것 같아요. 선생님 대표 예제를 단계별로 다시 보고 오면 다음엔 맞힐 수 있어요.`,
      rescueBtn:`유형 ${no} 선생님 대표 예제 보러 가기 →`
    };
  });

  renderAdaptivePractice(body,{
    title:'🌿 한걸음 차시 마무리 (4유형 각 1문)',
    items,
    onRescue:it=>{renderT2Steps(body,it.tyNo)},
    onPass:(host,results)=>{
      p.trackDone=Math.max(Number(p.trackDone)||0,2);
      p.concept=true;p.steps=Math.max(Number(p.steps)||0,1);
      p.prac=p.prac||{solved:0,streak:0,level:1,fails:0,retry:[]};
      p.prac.solved=Math.max(Number(p.prac.solved)||0,5);
      if(typeof save==='function')save();
      if(typeof award==='function')award(15,'cent:t2','한걸음 차시 마무리를 통과했어요');
      const rows=results.map(x=>`<li>${x.status==='first'?'⭐ <b>한 번에 통과</b>':'✓ <b>실수 확인 후 통과</b>'} · ${x.label}</li>`).join('');
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌿 한걸음 차시 마무리 통과!</b><br>2차시 『중심각과 호』를 완료했어요!</div>
        <ul style="margin:12px 0;padding-left:20px;line-height:1.8">${rows}</ul>
        <div class="next-row" style="justify-content:flex-start">
          <button type="button" class="btn primary" id="upToT3">🌳 두걸음(복합 유형) 도전하기 →</button>
          <a class="btn ghost" href="#home">처음 화면으로</a>
        </div></div>${bonusExploreHTML()}`;
      const u3=$('#upToT3',host);if(u3)u3.onclick=()=>{setTrack(3);viewCentLesson('cent','steps')};
    }
  });
}

/* ── 6-C. 🌳 두걸음 렌더러 ── */
function renderT3Concept(body){
  body.innerHTML=`
    <div class="ct-pass-bar">
      <span>개념을 이미 안다면 바로 복합 유형이나 차시 마무리로 넘어가세요.</span>
      <a class="btn primary" href="#cent-steps">복합 유형 분해 연습 →</a>
    </div>
    <div class="cp-strat" style="margin-top:0">
      <h2>🌳 두걸음 핵심 전략 · 복합 문제 쪼개기</h2>
      <div class="cp-strat-cards">
        <div class="cp-scard"><span class="cp-sbadge">조합 ①</span><b>세 호의 비 + 몇 배</b><small>원 한 바퀴 360°로 목표 각을 먼저 찾은 뒤(유형 3), 기준 각의 몇 배인지 계산(유형 1)</small></div>
        <div class="cp-scard"><span class="cp-sbadge">조합 ②</span><b>세 호의 비 + 비로 구하기</b><small>360°로 목표 각을 구한 뒤(유형 3), 기준 각과 간단한 자연수의 비로 1칸 구하기(유형 2)</small></div>
        <div class="cp-scard"><span class="cp-sbadge">조합 ③</span><b>반원(180°) + 비로 구하기</b><small>지름이 만드는 평각 180°에서 빈 중심각을 먼저 구한 뒤(유형 4), 중심각의 비 적용(유형 2)</small></div>
      </div>
    </div>
    <div class="next-row"><a class="btn primary" href="#cent-practice">3단계 실전 차시 마무리 (6문) →</a></div>
    ${bonusExploreHTML()}`;
}

function renderT3Steps(body,initialCid){
  const list=[
    {id:'C1',nm:'복합 ① · 세 호의 비 + 몇 배',sub:'원 위의 세 점에서 목표 각을 찾고 배수로 확장'},
    {id:'C2',nm:'복합 ② · 세 호의 비 + 중심각의 비',sub:'원 위의 세 점으로 각을 찾고 간단한 비로 1칸 구하기'},
    {id:'C3',nm:'복합 ③ · 반원 성질 + 중심각의 비',sub:'지름의 180° 성질로 빈 각을 구해 비 적용'}
  ];
  let cid=initialCid||'C1',seed=typeof newSeed==='function'?newSeed():11,picked=new Set(),unlocked=false,shownAt=Date.now();

  const draw=()=>{
    const prob=GEN_COMPOUND[cid](seed),wantSet=new Set(prob.combo);shownAt=Date.now();
    body.innerHTML=`<div class="ct-card">
      <div class="ct-card-h"><h2>복합 유형 조합 분해하기</h2>
        <div class="ct-hit-row" style="margin:0">${list.map(x=>`<button type="button" class="chip${x.id===cid?' on':''}" data-cid="${x.id}">${x.nm}</button>`).join('')}</div>
      </div>
      <div class="ct-combo">
        <b>Step 1 · 이 문제는 기본 유형 4가지 중 <u>어느 두 가지</u>를 합쳐 놓았나요? (2개 선택)</b>
        <div class="ct-combo-chips">${TY_LABELS.map((lb,i)=>`<button type="button" class="ct-hit${picked.has(i+1)?' sel':''}" data-ty="${i+1}" ${unlocked?'disabled':''}>${lb}</button>`).join('')}</div>
        <div id="cStep1Msg">${unlocked?`<div class="feedback ok">✓ 조합 파악 완료! ${prob.comboWhy}</div>`:''}</div>
      </div>
      <div id="cProbHost"></div>
    </div>`;

    $$('[data-cid]',body).forEach(b=>b.onclick=()=>{cid=b.dataset.cid;seed=(seed+9)%99999+1;picked=new Set();unlocked=false;draw()});
    $$('[data-ty]',body).forEach(b=>b.onclick=()=>{
      const k=+b.dataset.ty;
      if(picked.has(k))picked.delete(k);else{if(picked.size>=2){const first=[...picked][0];picked.delete(first)}picked.add(k)}
      if(picked.size===2){
        const ok=[...picked].every(x=>wantSet.has(x));
        recordMetric(Date.now()-shownAt,ok?null:'combo_pick');
        if(ok){unlocked=true;draw();return}
        $('#cStep1Msg',body).innerHTML='<div class="ct-cool" style="margin-top:6px">문제에서 <b>주어진 조건(반원/세 점)</b>과 <b>마무리 계산 방식(몇 배/비)</b>을 하나씩 짚어 다시 2개를 골라 보세요.</div>';
        $$('[data-ty]',body).forEach(x=>x.classList.toggle('sel',picked.has(+x.dataset.ty)));
      }else{
        $$('[data-ty]',body).forEach(x=>x.classList.toggle('sel',picked.has(+x.dataset.ty)));
      }
    });

    if(!unlocked){
      $('#cProbHost',body).innerHTML=`<div class="ct-stage"><div class="ct-fig">${prob.fig.svg()}</div><div><p style="margin-top:0">${prob.title}</p><p class="muted">먼저 위에서 결합된 2개 유형을 고르면 풀이 입력이 열려요.</p></div></div>`;
    }else if(typeof renderProblem==='function'){
      renderProblem($('#cProbHost',body),prob,{mode:'steps',visual:true,onDone:({good,box})=>{
        if(good&&typeof award==='function')award(8,null,'복합 유형 분해 문제를 풀었어요');
        const row=document.createElement('div');row.className='next-row';row.style.justifyContent='flex-start';
        row.innerHTML=`<button type="button" class="btn primary" id="cMore">새 숫자로 한 번 더</button><a class="btn ghost" href="#cent-practice">6문제 차시 마무리 →</a>`;
        box.appendChild(row);
        const cm=$('#cMore',row);if(cm)cm.onclick=()=>{seed=(seed+23)%99999+1;picked=new Set();unlocked=false;draw()};
      }});
    }
  };
  draw();
}

function renderT3Practice(body){
  const p=centProg(),TL=(typeof PTYPES!=='undefined'&&PTYPES.cent)||[];
  const baseSd=typeof newSeed==='function'?newSeed():201;
  const items=[1,2,3,4].map((no,k)=>{
    const t=TL.find(x=>x.no===no)||{nm:'유형 '+no};
    return{key:'ty'+no,tyNo:no,label:`기본 · 유형 ${no} (${t.nm})`,genKey:typeof tyKey==='function'?tyKey('cent',no):'cent',seed:baseSd+k*13,makeProb:sd=>GEN[tyKey('cent',no)](sd),
      rescueDesc:`기본 <b>유형 ${no} (${t.nm})</b>을 두 번 연속 틀렸어요. 대표 예제를 보고 기본 틀을 다시 잡고 가요.`,rescueBtn:`유형 ${no} 대표 예제 보기 →`};
  }).concat([
    {key:'C1',cid:'C1',label:'복합 ① · 세 호의 비 + 몇 배',genKey:'cent:c1',seed:baseSd+51,makeProb:sd=>GEN_COMPOUND.C1(sd),
      rescueDesc:'<b>복합 ①</b>을 두 번 연속 틀렸어요. 복합 유형 조합 분해에서 단계를 먼저 쪼개 보아요.',rescueBtn:'복합 ① 분해 연습으로 →'},
    {key:'C3',cid:'C3',label:'복합 ③ · 반원 성질 + 비로 구하기',genKey:'cent:c3',seed:baseSd+73,makeProb:sd=>GEN_COMPOUND.C3(sd),
      rescueDesc:'<b>복합 ③</b>을 두 번 연속 틀렸어요. 반원 180°에서 시작하는 조합을 다시 익혀 봐요.',rescueBtn:'복합 ③ 분해 연습으로 →'}
  ]);

  renderAdaptivePractice(body,{
    title:'🌳 두걸음 실전 차시 마무리 (기본 4 + 복합 2)',
    items,
    onRescue:it=>{if(it.cid)renderT3Steps(body,it.cid);else renderT2Steps(body,it.tyNo)},
    onPass:(host,results)=>{
      p.trackDone=3;p.concept=true;p.steps=Math.max(Number(p.steps)||0,1);
      p.prac=p.prac||{solved:0,streak:0,level:1,fails:0,retry:[]};
      p.prac.solved=Math.max(Number(p.prac.solved)||0,5);
      if(typeof save==='function')save();
      if(typeof award==='function')award(20,'cent:t3','두걸음 실전 차시 마무리를 통과했어요');

      const metaOpts=['유형 조합 찾기','비·1칸 세우기','계산 실수','없음'];
      host.innerHTML=`<div class="ct-card"><div class="feedback ok"><b>🌳 두걸음 실전 차시 마무리 통과!</b><br>기본 4유형과 복합 유형 2가지를 모두 해결했어요.</div>
        <ul style="margin:12px 0;padding-left:20px;line-height:1.8">${results.map(x=>`<li>${x.status==='first'?'⭐ <b>한 번에 통과</b>':'✓ <b>재확인 통과</b>'} · ${x.label}</li>`).join('')}</ul>
        <div class="ct-meta"><b>1초 체크 · 오늘 풀면서 가장 헷갈렸던 부분은?</b>
          <div class="ct-meta-row" id="t3Meta">${metaOpts.map(m=>`<button type="button" class="chip" data-m="${m}">${m}</button>`).join('')}</div>
          <small class="muted" id="t3MetaDone">선택하면 선생님 화면에 기록돼요.</small>
        </div>
        <div class="next-row" style="justify-content:flex-start"><a class="btn primary" href="#home">처음 화면으로</a></div>
      </div>${bonusExploreHTML()}`;
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

/* ── 7. 홈 명칭 통일, 오늘의 길잡이 기초 연산 우선 추천, viewLesson 후킹 ── */
if(typeof viewHome==='function'){
  const prevHome=viewHome;
  viewHome=function(){
    prevHome.apply(this,arguments);
    if(typeof app!=='undefined'&&app&&typeof app.querySelectorAll==='function'){
      app.querySelectorAll('.sec-title h2').forEach(h=>{if(h.textContent==='열린 단원')h.textContent='교과서 한 걸음'});
    }
  };
}

if(typeof guideSteps==='function'){
  const prevGS=guideSteps;
  guideSteps=function(){
    const S=prevGS.apply(this,arguments);
    const need=typeof DB==='object'&&DB&&DB._needCalc;
    if(!need||!need.id||!Array.isArray(S))return S;
    const t=typeof CALC!=='undefined'&&CALC.find(c=>c.id===need.id);
    const ci=S.findIndex(x=>/^기초 연산 · /.test(x.t));
    if(t&&ci>=0&&!S[ci].done){
      S[ci]=Object.assign({},S[ci],{t:`기초 연산 · ${t.nm}`,s:'중심각과 호에서 막혔던 계산을 먼저 연습해요',href:'#calc-'+t.id});
    }
    return S;
  };
}

if(typeof viewLesson==='function'){
  const prevVL=viewLesson;
  viewLesson=function(id,tab){
    if(id==='cent')return viewCentLesson(id,tab);
    return prevVL.apply(this,arguments);
  };
}

window.CENT_T08={SCHEMA_QS,FIRST_GUIDE,WORKED,GEN_COMPOUND,mountCent:viewCentLesson};
})();
