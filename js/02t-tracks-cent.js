/* [T08/T16] 교과서 한 걸음 — 2차시 「중심각과 호」(cent) 업그레이드 (🦉 부엉 쌤 + 한걸음 cent:ratio + 두걸음 C1~C5) */
(()=>{
'use strict';

const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',RD='#b83a3a';
const MF="'Times New Roman',Times,serif";
const rad=a=>a*Math.PI/180,pol=(C,R,a)=>[C[0]+R*Math.cos(rad(a)),C[1]-R*Math.sin(rad(a))];
const f1=n=>Math.round(n*10)/10,pt=P=>`${f1(P[0])} ${f1(P[1])}`;
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
    return svgBox(380,265,f({c:c1,r:r1,deg:a,fill:HLs,arcCol:HL,angCol:HL,cap:'작은 원'})+f({c:c2,r:r2,deg:b,fill:BLs,arcCol:BL,angCol:BL,cap:'큰 원'}),'크기가 다른 두 원');
  }
  const C=[190,145],R=90,gap=semi?0:24,A0=semi?180-a:90-(a+gap+b)/2,A1=A0+a,B0=A1+gap,B1=B0+b;
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#b5bece" stroke-width="1.8"/>`;
  if(semi)s+=svgLn(pol(C,R,180),pol(C,R,0),INK,2.6);
  const fill1=mode==='area'?(/x|\?/.test(String(l1||''))?HLs:BLs):'none',fill2=mode==='area'?(/x|\?/.test(String(l2||''))?HLs:BLs):'none';
  s+=`<path d="${secD(C,R,A0,A1)}" fill="${fill1}" stroke="${INK}" stroke-width="2.4"/>`;
  s+=`<path d="${secD(C,R,B0,B1)}" fill="${fill2}" stroke="${INK}" stroke-width="2.4"/>`;
  /* [T20] 주황 = 구할 것(x, ?), 파랑 = 주어진 것 */
  const askC=l=>/x|\?/.test(String(l||''))?HL:BL;
  if(mode==='arc'){
    s+=`<path d="${arcD(C,R,A0,A1)}" fill="none" stroke="${has('val1')?askC(l1):INK}" stroke-width="${has('val1')?6:3}" stroke-linecap="round"/>`;
    s+=`<path d="${arcD(C,R,B0,B1)}" fill="none" stroke="${has('val2')?askC(l2):INK}" stroke-width="${has('val2')?6:3}" stroke-linecap="round"/>`;
  }
  if(showChord){
    const P0=pol(C,R,A0),P1=pol(C,R,A1),P2=pol(C,R,A0+a/2);
    s+=svgLn(P0,P2,HL,3.2)+svgLn(P2,P1,HL,3.2)+svgLn(P0,P1,RD,3.5,'6 4');
    if(a>=60)s+=svgLn(C,P2,'#9aa3b5',1.3,'4 4');
  }
  s+=svgAng(C,A0,A1,a+'°',{col:has('ang1')?BL:INK,w:has('ang1')?3.2:2,size:16});
  s+=svgAng(C,B0,B1,b==null?'?°':b+'°',{col:has('ang2')?(b==null?HL:BL):INK,w:has('ang2')?3.2:2,size:16});
  if(l1)s+=svgTx(pol(C,R+24,(A0+A1)/2),l1,{size:16,sans:true,col:has('val1')?askC(l1):INK});
  if(l2)s+=svgTx(pol(C,R+24,(B0+B1)/2),l2,{size:16,sans:true,col:has('val2')?askC(l2):INK});
  s+=svgDot(C,4)+svgTx([C[0],C[1]+16],'O',{size:16});
  return svgBox(380,285,s,'한 원 안의 두 부채꼴');
}

function ctThreeArcs(a,b,c,opt={}){
  const{want='AB',hl=[]}=opt;
  const C=[165,142],R=90,t=a+b+c,aA=115,aB=aA+360*a/t,aC=aB+360*b/t;
  const segs=[['AB',aA,aB],['BC',aB,aC],['CA',aC,aA+360]];
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`;
  segs.forEach(([nm,p0,p1])=>{
    const on=hl.includes(nm)||(hl.includes('want')&&nm===want);
    if(on){
      s+=`<path d="${secD(C,R,p0,p1)}" fill="${HLs}" stroke="${INK}" stroke-width="2.2"/>`;
      s+=`<path d="${arcD(C,R,p0,p1)}" fill="none" stroke="${HL}" stroke-width="5.5" stroke-linecap="round"/>`;
    }
    s+=svgLn(C,pol(C,R,p0),INK,1.6,'4 4');
  });
  if(hl.includes('ang')){const tg=segs.find(x=>x[0]===want);if(tg)s+=svgAng(C,tg[1],tg[2],'?°',{col:HL,w:3})}
  s+=svgDot(pol(C,R,aA),4.5)+svgDot(pol(C,R,aB),4.5)+svgDot(pol(C,R,aC),4.5)+svgDot(C,4);
  s+=svgTx(pol(C,R+20,aA),'A',{it:true})+svgTx(pol(C,R+20,aB),'B',{it:true})+svgTx(pol(C,R+20,aC),'C',{it:true})+svgTx([C[0]+14,C[1]+10],'O',{size:16});
  return svgBox(330,276,s,'원 위의 세 점');
}

function ctSliceStack(baseDeg,count,unitArc,opt={}){
  const C=[155,140],R=88,showChord=!!opt.showChord;
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#b5bece" stroke-width="1.6"/>`;
  for(let i=0;i<count;i++){
    const a0=20+i*baseDeg,a1=a0+baseDeg;
    s+=`<path d="${secD(C,R,a0,a1)}" fill="${i%2?BLs:HLs}" stroke="${INK}" stroke-width="2"/>`;
    s+=`<path d="${arcD(C,R,a0,a1)}" fill="none" stroke="${i%2?BL:HL}" stroke-width="4.5"/>`;
    if(showChord)s+=svgLn(pol(C,R,a0),pol(C,R,a1),HL,2.6);
    s+=svgTx(pol(C,R+20,(a0+a1)/2),`${unitArc}`,{size:13,sans:true,col:i%2?BL:HL});
  }
  if(showChord&&count>=2)s+=svgLn(pol(C,R,20),pol(C,R,20+count*baseDeg),RD,3.5,'6 4');
  s+=svgAng(C,20,20+count*baseDeg,`${baseDeg*count}°`,{col:INK,size:15})+svgDot(C,4);
  return svgBox(310,272,s,'부채꼴 조각 쌓기');
}

function ctIsosExtSVG(a,lDeg){
  /* [T20] 실제 비율: CO = 2R·cos a, 직선 C→D→E, ∠AOE = 3a. 주어진 호 BD = 파랑, 구할 호 AE = 주황 */
  const O=[232,170],R=84,B=pol(O,R,180),A=pol(O,R,0),D=pol(O,R,180-a),E=pol(O,R,3*a),Cx=[O[0]-2*R*Math.cos(rad(a)),O[1]];
  let s=`<path d="M ${pt(B)} A ${R} ${R} 0 1 1 ${pt(A)}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`+
    svgLn(Cx,A,INK,2.2)+svgLn(Cx,E,INK,2.2)+svgLn(O,D,INK,1.8)+svgLn(O,E,INK,1.8)+
    `<path d="${arcD(O,R,180-a,180)}" fill="none" stroke="${BL}" stroke-width="5" stroke-linecap="round"/>`+
    `<path d="${arcD(O,R,0,3*a)}" fill="none" stroke="${HL}" stroke-width="6" stroke-linecap="round"/>`;
  s+=[O,D,E,B,A,Cx].map(P=>svgDot(P,3.6)).join('');
  s+=svgTx([O[0],O[1]+16],'O',{size:16})+svgTx(pol(O,R-16,180-a-8),'D',{it:true})+svgTx(pol(O,R+16,3*a),'E',{it:true})+svgTx([Cx[0]-6,Cx[1]+16],'C',{it:true})+svgTx([A[0]+6,A[1]+16],'A',{it:true})+svgTx([B[0]+2,B[1]+16],'B',{it:true});
  s+=svgAng(O,180-a,180,a+'°',{col:BL,size:14,r:20,lr:34});
  s+=svgTx(pol(O,R-24,180-a/2+2),`${lDeg} cm`,{size:14,sans:true,col:BL})+svgTx(pol(O,R+12,1.5*a),'? cm',{size:14,sans:true,col:HL,anchor:'start'});
  return svgBox(360,210,s,'반지름 이등변삼각형과 외각');
}
/* [T20] 반원에서 AC ∥ OD: D는 ∠BOD = b, C는 ∠BOC = 2b 자리 */
function ctParallelSVG(b,L){
  const O=[170,175],R=120,A=pol(O,R,180),B=pol(O,R,0),D=pol(O,R,b),Cc=pol(O,R,2*b);
  let s=`<path d="M ${pt(B)} A ${R} ${R} 0 0 0 ${pt(A)}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`+svgLn(A,B,INK,2.4)+svgLn(O,D,INK,2.2)+svgLn(A,Cc,INK,2.2)+
    `<path d="${arcD(O,R,0,b)}" fill="none" stroke="${BL}" stroke-width="5" stroke-linecap="round"/>`+
    `<path d="${arcD(O,R,2*b,180)}" fill="none" stroke="${HL}" stroke-width="6" stroke-linecap="round"/>`;
  s+=[O,A,B,D,Cc].map(P=>svgDot(P,3.6)).join('');
  s+=svgTx([O[0],O[1]+16],'O',{size:16})+svgTx([A[0]-4,A[1]+16],'A',{it:true})+svgTx([B[0]+4,B[1]+16],'B',{it:true})+svgTx(pol(O,R+16,b),'D',{it:true})+svgTx(pol(O,R+16,2*b),'C',{it:true});
  s+=svgAng(O,0,b,b+'°',{col:BL,size:14,r:22,lr:38})+svgTx(pol(O,R+30,b/2),`${L} cm`,{size:14,sans:true,col:BL})+svgTx(pol(O,R+26,90+b),'? cm',{size:14,sans:true,col:HL});
  return svgBox(340,215,s,'반원에서 평행한 현과 반지름');
}

const SCHEMA_QS=[
  {id:'sq1',q:'같은 원에서 중심각이 <b>40° → 80° (2배)</b>가 됐어요. 둥근 테두리(호)의 길이는 어떻게 될까요?',
    fig:()=>ctTwoSec({a:40,b:80,l1:'3 cm',l2:'? cm',mode:'arc',hl:['ang1','ang2','val1','val2']}),
    choices:['정확히 2배 (6 cm)','2배보다 짧아요','크기를 알 수 없어요'],ans:'정확히 2배 (6 cm)',
    hint:'같은 원에서 둥근 테두리는 40° 조각을 2개 이어 붙인 것과 똑같아요.',why:'맞아요! 한 원에서 중심각이 2배가 되면 호의 길이도 정확히 2배가 돼요.'},
  {id:'sq2',q:'같은 원에서 중심각이 <b>60° → 120° (2배)</b>예요. 두 점을 곧게 이은 <b>빨간 점선</b>의 길이는 2배가 될까요?',
    fig:()=>ctTwoSec({a:120,b:60,l1:'꺾인 2개 vs 곧은 선',l2:'60°',mode:'arc',showChord:true,hl:['chord']}),
    choices:['2배보다 짧아요','정확히 2배예요','2배보다 길어요'],ans:'2배보다 짧아요',
    hint:'주황색 꺾인 두 선분보다 곧게 지름길로 가는 빨간 점선이 더 짧아요.',why:'아니에요! 현은 꺾인 두 선보다 항상 짧아서 중심각이 2배여도 2배가 아니에요.'},
  {id:'sq3',q:'두 부채꼴의 중심각이 둘 다 <b>60°</b>예요. 원의 크기가 다를 때도 호의 길이가 같을까요?',
    fig:()=>ctTwoSec({a:60,b:60,diffRadius:true}),
    choices:['원 크기가 달라서 길이가 달라요','60°로 같으니 길이도 같아요'],ans:'원 크기가 달라서 길이가 달라요',
    hint:'작은 피자 1조각 테두리와 큰 피자 1조각 테두리를 비교해 보세요.',why:'아니에요! 반드시 "한 원(또는 합동인 원)"일 때만 정비례해요.'},
  {id:'sq4',q:'같은 원에서 중심각이 <b>30° → 90° (3배)</b>가 됐어요. 색칠한 조각의 넓이는 어떻게 될까요?',
    fig:()=>ctTwoSec({a:30,b:90,l1:'4 cm²',l2:'? cm²',mode:'area',hl:['val1','val2']}),
    choices:['정확히 3배 (12 cm²)','3배보다 작아요','변하지 않아요'],ans:'정확히 3배 (12 cm²)',
    hint:'90° 조각 안에 30° 조각이 딱 3개 들어가요.',why:'맞아요! 한 원에서 중심각이 3배가 되면 넓이도 똑같이 3배가 돼요.'}
];

const FIRST_GUIDE=[
  {id:'fg1',tyNo:1,title:'유형 1 · 몇 배로 호의 길이 구하기',
    problem:'한 원에서 중심각이 <b>40°</b>인 부채꼴의 호의 길이가 <b>3 cm</b>일 때, 중심각이 <b>120°</b>인 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:40,b:120,l1:'3 cm',l2:'x cm',mode:'arc',hl}),
    wantChips:['120° 부채꼴의 호의 길이 (x cm)','40° 부채꼴의 넓이','원의 반지름'],wantAns:'120° 부채꼴의 호의 길이 (x cm)',wantHl:['val2'],
    givenChips:[{k:'a',t:'중심각 40°',ok:true,hl:'ang1'},{k:'l1',t:'40°의 호 3 cm',ok:true,hl:'val1'},{k:'b',t:'중심각 120°',ok:true,hl:'ang2'},{k:'trap',t:'반지름 5 cm',ok:false}],
    teacherEq:'120 ÷ 40 = 3 (배) → x = 3 × 3',pairQ:'식 앞쪽 <b>120 ÷ 40</b>은 문제의 어떤 숫자를 나눈 것인가요?',
    pairChoices:['큰 중심각 ÷ 작은 중심각','호의 길이 ÷ 중심각'],pairAns:'큰 중심각 ÷ 작은 중심각',
    calcPrompt:'3 × 3 = ? (cm)',calcAns:9,calcTopic:'mul',calcExplain:'중심각이 <b>3배</b>이므로 호의 길이도 3 × 3 = <b>9 cm</b>예요.'},
  {id:'fg2',tyNo:2,title:'유형 2 · 중심각의 비로 호의 길이 구하기',
    problem:'한 원에서 중심각이 <b>50°</b>인 부채꼴의 호의 길이가 <b>10 cm</b>일 때, 중심각이 <b>70°</b>인 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'x cm',mode:'arc',hl}),
    wantChips:['70° 부채꼴의 호의 길이 (x cm)','50° 부채꼴의 중심각','원의 지름'],wantAns:'70° 부채꼴의 호의 길이 (x cm)',wantHl:['val2'],
    givenChips:[{k:'a',t:'중심각 50°',ok:true,hl:'ang1'},{k:'l1',t:'50°의 호 10 cm',ok:true,hl:'val1'},{k:'b',t:'중심각 70°',ok:true,hl:'ang2'},{k:'trap',t:'둘레 36 cm',ok:false}],
    teacherEq:'50 : 70 = 10 : x → 5 : 7 = 10 : x',pairQ:'비례식에서 <b>10</b>은 두 중심각 중 어느 쪽의 짝인가요?',
    pairChoices:['50° 부채꼴의 호의 길이','70° 부채꼴의 호의 길이'],pairAns:'50° 부채꼴의 호의 길이',
    calcPrompt:'5칸이 10 cm → 1칸 2 cm → 7칸 = ? (cm)',calcAns:14,calcTopic:'ratio',calcExplain:'1칸 = 2 cm, 7칸 = 2 × 7 = <b>14 cm</b>예요.'},
  {id:'fg3',tyNo:3,title:'유형 3 · 세 호의 비로 중심각 구하기',
    problem:'원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = <b>2 : 3 : 4</b>일 때, <span class="arcs">BC</span>에 대한 중심각의 크기를 구하시오.',
    fig:hl=>ctThreeArcs(2,3,4,{want:'BC',hl}),
    wantChips:['호 BC에 대한 중심각 (°)','호 AB의 길이 (cm)','원 전체의 넓이'],wantAns:'호 BC에 대한 중심각 (°)',wantHl:['want','ang'],
    givenChips:[{k:'r',t:'세 호의 비 2 : 3 : 4',ok:true,hl:'BC'},{k:'full',t:'원 한 바퀴 = 360°',ok:true,hl:'ang'},{k:'trap',t:'반지름 6 cm',ok:false}],
    teacherEq:'전체 2 + 3 + 4 = 9칸 → 360° ÷ 9 = 40° → 40° × 3',pairQ:'식에서 <b>360°</b>를 왜 <b>9</b>로 나누었을까요?',
    pairChoices:['한 바퀴 360°가 전체 9칸에 나눠져 있어서','호 BC의 비가 9라서'],pairAns:'한 바퀴 360°가 전체 9칸에 나눠져 있어서',
    calcPrompt:'1칸 40° × 호 BC 3칸 = ? (°)',calcAns:120,calcTopic:'div',calcExplain:'1칸 = 40°, 호 BC는 3칸 = <b>120°</b>예요.'}
];

const WORKED=[
  null,
  {no:1,nm:'중심각 비교 ① 몇 배',prob:'한 원에서 중심각이 <b>40°</b>인 호가 <b>3 cm</b>일 때, <b>120°</b>인 호 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:40,b:120,l1:'3 cm',l2:'x cm',mode:'arc',hl}),
    steps:[{t:'① 어디를 먼저 볼까?',hl:['ang1','ang2'],body:'두 중심각 40°와 120°가 딱 나누어떨어지는지 먼저 확인해요.'},{t:'② 중심각이 몇 배인지 구하기',hl:['ang1','ang2'],body:'120 ÷ 40 = <b>3배</b>'},{t:'③ 호의 길이도 같은 배 곱하기',hl:['val1','val2'],body:'3 × 3 = <b>9 cm</b>'}],
    pitfall:'⚠️ 자주 하는 실수: 120° → 40°처럼 작아질 때는 곱하지 말고 나누어야(÷ 3) 해요!'},
  {no:2,nm:'중심각 비교 ② 비',prob:'한 원에서 중심각이 <b>50°</b>인 호가 <b>10 cm</b>일 때, <b>70°</b>인 호 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'x cm',mode:'arc',hl}),
    steps:[{t:'① 중심각의 비 간단히 하기',hl:['ang1','ang2'],body:'50 : 70 = <b>5 : 7</b>'},{t:'② 1칸의 크기 구하기',hl:['val1'],body:'5칸이 10 cm → <b>1칸 = 2 cm</b>'},{t:'③ 구하는 칸 수만큼 곱하기',hl:['val2'],body:'7칸 → 2 × 7 = <b>14 cm</b>'}],
    pitfall:'⚠️ 자주 하는 실수: 50 : 70 = x : 10처럼 각과 길이의 짝 순서를 뒤집지 마세요.'},
  {no:3,nm:'호의 비로 중심각 구하기',prob:'원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = <b>2 : 3 : 4</b>일 때, <span class="arcs">BC</span>의 중심각은?',
    fig:hl=>ctThreeArcs(2,3,4,{want:'BC',hl}),
    steps:[{t:'① 전체 칸 수 더하기',hl:['AB','BC','CA'],body:'2 + 3 + 4 = <b>9칸</b>'},{t:'② 1칸의 중심각 구하기',hl:['ang'],body:'360° ÷ 9 = <b>40°</b>'},{t:'③ 구하는 칸 수 곱하기',hl:['BC','ang'],body:'40° × 3 = <b>120°</b>'}],
    pitfall:'⚠️ 자주 하는 실수: 360°를 전체 합(9)이 아니라 3으로 바로 나누면 안 돼요!'},
  {no:4,nm:'정비례 ○× (현은 예외)',prob:'한 원에서 중심각의 크기에 대한 설명 중 옳지 않은 것을 찾는 전략',
    fig:hl=>ctTwoSec({a:120,b:60,l1:'현 비교',l2:'60°',mode:'arc',showChord:true,hl}),
    steps:[{t:'① 호의 길이 · 넓이 체크',hl:['val1'],body:'중심각이 2배, 3배 → <b>호의 길이 ○ · 넓이 ○</b> (정비례)'},{t:'② 현의 길이 함정 체크',hl:['chord'],body:'중심각 2배면 현은 2배보다 짧음 → <b>정비례 ✕</b>'},{t:'③ "같은 각"과 "2배 각" 구별',hl:['ang1','ang2'],body:'중심각이 <b>같으면</b> 현의 길이도 같아요 ○!'}],
    pitfall:'⚠️ 자주 하는 실수: "중심각이 같으면 현이 같다 ○"와 "정비례 ○"를 헷갈리지 마세요!'}
];

function makeC1(seed){
  const r=(seed*1664525+1013904223)>>>0;
  const sets=[[1,2,3],[1,3,2],[2,3,4],[2,2,5],[1,4,5],[2,3,5],[3,4,5],[3,3,6]];
  const[a,b,c]=sets[r%sets.length],t=a+b+c,one=360/t,targets=[['AB',a],['BC',b],['CA',c]],[wn,wv]=targets[(r>>>3)%3];
  const wantAng=one*wv,k=(one%3===0&&wantAng/3>=15&&(r>>>5)%2)?3:2,d=Math.round(wantAng/k),L=2+((r>>>7)%6),ans=L*k;
  return{id:'C1',combo:[3,1],comboWhy:'① 세 호의 비로 중심각을 먼저 구하고(유형 3) → ② 몇 배인지 적용(유형 1)',ptype:'cent:c1',
    title:`원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = ${a} : ${b} : ${c}이고, 같은 원에서 중심각 ${d}°인 호가 ${L} cm일 때, <span class="arcs">${wn}</span>의 길이를 구하시오.`,
    fig:{svg:()=>ctThreeArcs(a,b,c,{want:wn,hl:['want']})},finalQ:`<span class="arcs">${wn}</span>의 길이는 몇 cm인가요?`,
    steps:[
      {tag:'1단계 · 목표 중심각 구하기',q:`전체 ${t}칸이 360°예요. <span class="arcs">${wn}</span>(${wv}칸)의 중심각은?`,type:'num',ans:wantAng,suffix:'°',hint:`(360 ÷ ${t}) × ${wv}`},
      {tag:'2단계 · 몇 배인지 적용하기',q:`${wantAng}°는 ${d}°의 ${k}배예요. <span class="arcs">${wn}</span>의 길이는?`,type:'num',ans,suffix:'cm',hint:`${L} × ${k}`,ok:`${L} × ${k} = ${ans} cm`}
    ]};
}

function makeC2(seed){
  const r=(seed*22695477+1)>>>0;
  const specs=[{abc:[2,3,4],want:'AB',wv:2,refAng:60,p:3,q:4},{abc:[1,3,5],want:'BC',wv:3,refAng:80,p:2,q:3},{abc:[3,4,5],want:'BC',wv:4,refAng:90,p:3,q:4},{abc:[2,3,5],want:'CA',wv:5,refAng:120,p:2,q:3},{abc:[3,4,8],want:'BC',wv:4,refAng:72,p:3,q:4}];
  const sp=specs[r%specs.length],[a,b,c]=sp.abc,t=a+b+c,one=360/t,wantAng=one*sp.wv,m=2+((r>>>4)%4),refVal=sp.p*m,ans=sp.q*m;
  return{id:'C2',combo:[3,2],comboWhy:'① 세 호의 비로 목표 중심각을 찾고(유형 3) → ② 중심각의 비로 넓이 구하기(유형 2)',ptype:'cent:c2',
    title:`원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = ${a} : ${b} : ${c}이고, 중심각 ${sp.refAng}°인 부채꼴의 넓이가 ${refVal} cm²일 때, <span class="arcs">${sp.want}</span>에 대한 부채꼴의 넓이를 구하시오.`,
    fig:{svg:()=>ctThreeArcs(a,b,c,{want:sp.want,hl:['want','ang']})},finalQ:`<span class="arcs">${sp.want}</span>에 대한 부채꼴의 넓이는?`,
    steps:[
      {tag:'1단계 · 중심각 구하기',q:`<span class="arcs">${sp.want}</span>(${sp.wv}칸)의 중심각은?`,type:'num',ans:wantAng,suffix:'°',hint:`(360 ÷ ${t}) × ${sp.wv}`},
      {tag:'2단계 · 중심각의 비로 넓이 구하기',q:`${sp.refAng} : ${wantAng} = ${sp.p} : ${sp.q}예요. ${sp.p}칸이 ${refVal} cm²이면 ${sp.q}칸은?`,type:'num',ans,suffix:'cm²',hint:`(${refVal} ÷ ${sp.p}) × ${sp.q}`,ok:`${ans} cm²`}
    ]};
}

function makeC3(seed){
  const r=(seed*1103515245+12345)>>>0;
  const specs=[{a:72,b:108,p:2,q:3},{a:80,b:100,p:4,q:5},{a:54,b:126,p:3,q:7},{a:75,b:105,p:5,q:7},{a:108,b:72,p:3,q:2}];
  const sp=specs[r%specs.length],m=2+((r>>>4)%4),L=sp.p*m,ans=sp.q*m;
  return{id:'C3',combo:[4,2],comboWhy:'① 반원의 평각 180°로 빈 각을 구하고(유형 4) → ② 중심각의 비로 호 구하기(유형 2)',ptype:'cent:c3',
    title:`지름으로 만든 반원(180°)을 두 부채꼴로 나누었어요. 중심각 ${sp.a}°인 호의 길이가 ${L} cm일 때 나머지 호의 길이 <i>x</i>를 구하시오.`,
    fig:{svg:()=>ctTwoSec({a:sp.a,b:sp.b,l1:`${L} cm`,l2:'x cm',mode:'arc',semi:true,hl:['ang1','val1']})},finalQ:'나머지 호의 길이 <i>x</i>는 몇 cm인가요?',
    steps:[
      {tag:'1단계 · 반원 성질(180°)',q:`반원 180° − ${sp.a}° = ?`,type:'num',ans:sp.b,suffix:'°',hint:`180 − ${sp.a}`},
      {tag:'2단계 · 중심각의 비로 호 구하기',q:`${sp.a} : ${sp.b} = ${sp.p} : ${sp.q}. ${sp.p}칸이 ${L} cm일 때 ${sp.q}칸은?`,type:'num',ans,suffix:'cm',hint:`(${L} ÷ ${sp.p}) × ${sp.q}`,ok:`${ans} cm`}
    ]};
}

function makeC4(seed){
  const r=(seed*1664525+1013904223)>>>0;
  const a=[18,20,24,25,30][r%5],L=3+((r>>>4)%5),ans=3*L;
  return{id:'C4',combo:[4,1],comboWhy:'① 반지름이 같아 생긴 이등변삼각형과 외각으로 중심각 3배를 찾고(유형 4) → ② 호의 길이 몇 배 적용(유형 1)',ptype:'cent:c4',
    title:`그림과 같이 원 O의 지름 AB의 연장선과 현 DE의 연장선이 만나는 점을 C라 하자. CD = OD이고 ∠BOD = ${a}°, 호 BD의 길이가 ${L} cm일 때, 호 AE의 길이를 구하시오.`,
    fig:{svg:()=>ctIsosExtSVG(a,L)},finalQ:'호 AE의 길이는 몇 cm인가요?',
    steps:[
      {tag:'1단계 · 이등변삼각형 CDO의 외각',q:`CD = OD이므로 ∠DCO = ∠DOC = ${a}°예요. 삼각형 CDO의 외각 ∠ODE의 크기는?`,type:'num',ans:2*a,suffix:'°',hint:'삼각형의 한 외각은 이웃하지 않는 두 내각의 합이에요.'},
      {tag:'2단계 · 이등변삼각형 ODE와 외각으로 ∠AOE',q:`OD = OE이므로 ∠OED = ∠ODE예요. ∠AOE는 삼각형 OCE의 외각이에요. ∠AOE의 크기는?`,type:'num',ans:3*a,suffix:'°',hint:'외각 = 이웃하지 않는 두 내각(∠OCE + ∠OEC)의 합이에요.'},
      {tag:'3단계 · 몇 배로 호 구하기',q:`∠AOE는 ∠BOD의 몇 배인지 보고, 호 AE의 길이를 구하세요.`,type:'num',ans,suffix:'cm',hint:'중심각이 몇 배면 호의 길이도 몇 배예요.',ok:`∠AOE = ${3*a}°는 ${a}°의 3배라서 호 AE = ${L} × 3 = ${ans} cm예요.`}
    ]};
}

function makeC5(seed){
  /* [T20] (180 − 2b) ÷ b 가 자연수가 되는 b만 써요: 30 → 4배, 36 → 3배, 45 → 2배 */
  const r=(seed*22695477+1)>>>0,bDeg=[30,36,45][(r>>>2)%3],L=2+((r>>>5)%5),aoc=180-2*bDeg,k=aoc/bDeg,ans=k*L;
  return{id:'C5',combo:[4,2],comboWhy:'① 평행선의 동위각과 이등변삼각형으로 중심각을 찾고(유형 4) → ② 중심각이 몇 배인지로 호 계산(유형 1·2)',ptype:'cent:c5',
    title:`선분 AB를 지름으로 하는 반원 O에서 AC ∥ OD이고 ∠BOD = ${bDeg}°, 호 BD의 길이가 ${L} cm일 때, 호 AC의 길이를 구하시오.`,
    fig:{svg:()=>ctParallelSVG(bDeg,L)},
    finalQ:'호 AC의 길이는 몇 cm인가요?',
    steps:[
      {tag:'1단계 · 동위각으로 ∠OAC 찾기',q:`AC ∥ OD이므로 ∠OAC의 크기는?`,type:'num',ans:bDeg,suffix:'°',hint:'평행선에서 동위각의 크기는 같아요.'},
      {tag:'2단계 · 이등변삼각형 OAC의 중심각',q:`OA = OC(반지름)이므로 ∠OCA = ∠OAC예요. ∠AOC의 크기는?`,type:'num',ans:aoc,suffix:'°',hint:'삼각형의 세 각의 합은 180°예요.'},
      {tag:'3단계 · 몇 배인지로 호 구하기',q:`∠AOC는 ∠BOD의 몇 배인지 보고, 호 AC의 길이를 구하세요.`,type:'num',ans,suffix:'cm',hint:'중심각이 몇 배면 호의 길이도 몇 배예요.',ok:`∠AOC = ${aoc}°는 ${bDeg}°의 ${k}배라서 호 AC = ${L} × ${k} = ${ans} cm예요.`}
    ]};
}

const GEN_COMPOUND={C1:makeC1,C2:makeC2,C3:makeC3,C4:makeC4,C5:makeC5};

const OWL_SCENES=[
  {cap:'장면 ① 조각이 2배, 3배 늘어나면?',say:'<span class="kw">한 원</span> 안에서 <span class="num">40°</span> 피자 조각을 2개, 3개 이어 붙여 볼까요? <span class="kw">둥근 테두리(호)</span>와 <span class="kw">넓이</span>가 똑같이 2배, 3배 커져요!',svg:()=>ctSliceStack(40,2,'3 cm')},
  {cap:'장면 ② 딱 떨어지면 몇 배, 안 떨어지면 비!',say:'<span class="num">40° → 120°</span>처럼 딱 떨어지면 <b>× 3배</b>! <span class="num">50° → 70°</span>처럼 안 나누어떨어지면 <span class="kw">5 : 7 비</span>로 1칸부터 찾아요.',svg:()=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'14 cm',mode:'arc',hl:['ang1','ang2']})},
  {cap:'장면 ③ 원 위의 세 점은 모두 360°!',say:'원 위의 세 점이 만든 세 호의 비가 <span class="num">2 : 3 : 4</span>라면? 원 한 바퀴 <span class="num">360°</span>를 전체 <span class="num">9칸</span>으로 나누어 1칸을 구해요!',svg:()=>ctThreeArcs(2,3,4,{want:'BC',hl:['want','ang']})},
  {cap:'장면 ④ 현의 길이 함정 조심!',exp:'warn',say:'곧은 선분 <span class="warn">현</span>은 삼각형 지름길처럼 질러 가기 때문에 중심각이 2배여도 <span class="warn">2배보다 짧아요</span>!',svg:()=>ctTwoSec({a:120,b:60,l1:'꺾인 2개 vs 곧은 현',l2:'60°',mode:'arc',showChord:true,hl:['chord']}),
    ask:{q:'한 원에서 중심각의 크기가 2배가 되어도 2배가 되지 않는 것은?',choices:['현의 길이','호의 길이','부채꼴의 넓이'],ans:'현의 길이',hint:'지름길로 곧장 가는 선분을 골라요.',ok:'정확해요! 호와 넓이는 정비례하지만 현은 2배보다 짧아요.'}},
  {cap:'장면 ⑤ 반지름이 다르면 안 돼요!',say:'작은 원의 60°와 큰 원의 60°는 호의 길이가 달라요. 반드시 <span class="kw">한 원 또는 합동인 원</span>에서만 정비례가 성립해요!',exp:'happy',svg:()=>ctTwoSec({a:60,b:60,diffRadius:true})}
];

/* [T20] 첫걸음 구별하기(C1): 한 원에서 중심각만 2배로 바꾼 두 부채꼴. 주황 표시가 2배가 되는지 가려요.
   종류 0 호 · 1 넓이 · 2 현 · 3 반지름 · 4 부채꼴의 둘레 · 5 활꼴의 넓이 */
const RAPID_CH=['2배가 돼요','2배보다 작아져요','2배보다 커져요','변하지 않아요'];
const RAPID_ANS=['2배가 돼요','2배가 돼요','2배보다 작아져요','변하지 않아요','2배보다 작아져요','2배보다 커져요'];
const RAPID_WHY=['한 원에서 중심각이 2배가 되면 <b>호의 길이도 2배</b>가 돼요.','한 원에서 중심각이 2배가 되면 <b>부채꼴의 넓이도 2배</b>가 돼요.',
  '현의 길이는 중심각에 정비례하지 않아요. 중심각이 2배가 되어도 현은 <b>2배보다 짧아요</b>.','반지름은 원이 같으면 그대로예요. 중심각과 상관없이 <b>변하지 않아요</b>.',
  '부채꼴의 둘레 = 호 + 반지름 2개예요. 호만 2배가 되고 반지름은 그대로라서 <b>2배보다 작아요</b>.','활꼴 = 부채꼴 − 삼각형이에요. 중심각이 2배가 되면 활꼴의 넓이는 <b>2배보다 더 커져요</b>.'];
function ctRapidFig(k,seed){
  const TH=`stroke="${HL}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`;
  const angs=k===5?[30,40,45,60,80,90]:[30,40,45,50,60,70,80,90],th=angs[seed%angs.length],R=70;
  const one=(C,t)=>{const a0=90-t/2,a1=90+t/2,P0=pol(C,R,a0),P1=pol(C,R,a1);
    let g=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="1.8"/>`;
    const sec=`<path d="${secD(C,R,a0,a1)}"`;
    if(k===0)g+=`${sec} fill="none" stroke="${INK}" stroke-width="2"/><path d="${arcD(C,R,a0,a1)}" fill="none" ${TH}/>`;
    else if(k===1)g+=`${sec} fill="${HLs}" ${TH}/>`;
    else if(k===2)g+=`${sec} fill="none" stroke="#9aa3b5" stroke-width="1.6"/>`+`<path d="M ${pt(P0)} L ${pt(P1)}" ${TH}/>`;
    else if(k===3)g+=`${sec} fill="none" stroke="${INK}" stroke-width="2"/>`+`<path d="M ${pt(C)} L ${pt(P0)}" ${TH}/>`;
    else if(k===4)g+=`${sec} fill="none" ${TH}/>`;
    else g+=`${sec} fill="none" stroke="${INK}" stroke-width="1.6"/>`+`<path d="${arcD(C,R,a0,a1)} Z" fill="${HLs}" ${TH}/>`;
    g+=svgDot(P0,3.4)+svgDot(P1,3.4)+svgDot(C,3.6)+svgTx([C[0],C[1]+16],'O',{size:15})+svgAng(C,a0,a1,t+'°',{col:BL,size:15,r:18,lr:t>=150?30:Math.max(34,40/Math.sin(rad(t/2))*0.62)});
    return g};
  const g=one([95,112],th)+one([285,112],2*th)+svgTx([190,112],'→',{size:26,col:INK})+svgTx([190,140],'× 2',{size:15,sans:true,col:BL});
  return svgBox(380,205,g,'한 원에서 중심각이 2배인 두 부채꼴');
}
const shufBy=(sd,arr)=>{const a=arr.slice();let x=(sd*2654435761)>>>0;for(let i=a.length-1;i>0;i--){x=(x*1103515245+12345)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
/* [T20] 첫걸음 차시 마무리: 보기 4개, 틀리면 make로 숫자를 바꾼 비슷한 문제 */
function t1Given(sd){
  const pairs=[[30,60],[30,90],[40,80],[40,120],[45,90],[45,135],[60,120],[60,180]],[a,b]=pairs[sd%pairs.length],area=(sd>>>3)%2===1,L=2+(sd%5)*(area?2:1);
  const nm=area?'넓이':'호의 길이',other=area?'호의 길이':'넓이',u=area?'cm²':'cm';
  const ans=`중심각이 ${b}°인 부채꼴의 ${nm}`;
  return{id:'t1g'+sd,kind:'given',make:t1Given,q:`「한 원에서 중심각의 크기가 ${a}°인 부채꼴의 ${nm}가 ${L} ${u}일 때, 중심각의 크기가 ${b}°인 부채꼴의 ${nm}를 구하시오.」에서 <b>구해야 하는 것</b>을 고르세요.`,
    fig:()=>ctTwoSec({a,b,l1:`${L} ${u}`,l2:'',mode:area?'area':'arc',hl:['val1','ang1','ang2']}),
    choices:shufBy(sd,[ans,`중심각이 ${a}°인 부채꼴의 ${nm}`,`중심각이 ${b}°인 부채꼴의 ${other}`,'원 전체의 둘레']),ans,
    hint:'문장 맨 끝 "구하시오" 바로 앞을 봐요.',why:`문장 끝에서 구하라는 것을 찾았어요. 구할 것은 <b>${ans}</b>예요.`};
}
function t1Pair(sd){
  const pairs=[[40,100,6],[50,70,10],[60,80,9],[30,75,4],[45,60,12],[80,120,8],[40,60,8]],[a,b,v]=pairs[sd%pairs.length];
  const ans=`${a} : ${b} = ${v} : x`;
  return{id:'t1p'+sd,kind:'pair',make:t1Pair,q:`한 원에서 중심각의 크기가 <b>${a}°</b>인 부채꼴의 넓이가 <b>${v} cm²</b>이고, 중심각의 크기가 <b>${b}°</b>인 부채꼴의 넓이가 <i>x</i> cm²일 때, <i>x</i>를 구하는 식으로 옳은 것을 고르세요.`,
    fig:()=>ctTwoSec({a,b,l1:`${v} cm²`,l2:'x cm²',mode:'area',hl:['val1','val2','ang1','ang2']}),
    choices:shufBy(sd,[ans,`${a} : ${b} = x : ${v}`,`${a} : x = ${v} : ${b}`,`x = ${v} + (${b} − ${a})`]),ans,
    hint:'중심각끼리, 넓이끼리 같은 순서로 짝을 맞춰요.',why:`중심각 ${a} : ${b}와 넓이 ${v} : x를 같은 순서로 짝 지었어요.`};
}
function t1Three(sd){
  const sets=[[1,2,3],[2,3,4],[1,3,5],[2,3,5],[3,4,5],[1,2,6],[2,5,5],[1,4,7]],[a,b,c]=sets[sd%sets.length],t=a+b+c;
  const opts=[t,3,360];[c,b,a*b*c,t+1,t*2].forEach(x=>{if(opts.length<4&&!opts.includes(x))opts.push(x)});
  const ans=t+'칸';
  return{id:'t1t'+sd,kind:'three',make:t1Three,q:`원 O 위의 세 점 A, B, C에 대하여 호 AB : 호 BC : 호 CA = <b>${a} : ${b} : ${c}</b>일 때, 원 한 바퀴 360°는 모두 몇 칸으로 나누어 생각하는지 고르세요.`,
    fig:()=>ctThreeArcs(a,b,c,{want:'BC',hl:[]}),
    choices:shufBy(sd,opts.map(x=>x+'칸')),ans,
    hint:'세 호를 모두 이으면 원 한 바퀴예요.',why:`세 호를 모두 합치면 원 한 바퀴라서 ${a} + ${b} + ${c} = <b>${t}칸</b>이에요.`};
}
const T1_CHECK_POOL=[t1Given(5),t1Pair(3),t1Three(2)];

if(typeof HG_TRACKS==='object'){
  HG_TRACKS.register('cent',{
    kind:'proc',
    t2Order:[1,3,4,2],
    compoundBridgeNo:2,
    owlScenes:OWL_SCENES,
    owlSummary:['같은 원에서 호의 길이와 넓이는 중심각에 정비례해요.','현의 길이는 중심각에 정비례하지 않아요 (2배보다 짧음!).','딱 떨어지면 몇 배, 안 떨어지면 간단한 비(1칸), 세 호의 비는 360°를 전체 칸 수로 나눠요.'],
    schemaRapid:{n:6,kinds:6,title:'중심각이 2배가 되면?',q:'두 부채꼴은 <b>한 원</b>에서 중심각만 2배로 바꾼 거예요. <b>주황색으로 표시한 것</b>은 어떻게 될까요?',
      choices:RAPID_CH,check:[0,2,4,5],
      make:(k,seed)=>({fig:ctRapidFig(k,Math.floor(seed/6)),ans:RAPID_ANS[k],why:RAPID_WHY[k]})},
    schemaQs:SCHEMA_QS,
    firstGuide:FIRST_GUIDE,
    t1Check:T1_CHECK_POOL,
    stratRows:[
      ['딱 나누어떨어지는 두 각<br><small>예: 40°와 120°</small>','몇 배인지 확인','120 ÷ 40 = 3배 → 호·넓이 × 3 (작아지면 ÷)'],
      ['안 나누어떨어지는 두 각<br><small>예: 50°와 70°</small>','간단한 비 · 1칸','50 : 70 = 5 : 7 → 1칸 구하고 칸 수 곱하기'],
      ['원 위의 세 점 (호의 비)<br><small>예: 2 : 3 : 4</small>','원 한 바퀴 = 360°','전체 9칸 → 360° ÷ 9 = 40°(1칸)'],
      ['현의 길이 비교','예외 조심!','중심각이 같으면 현도 같지만, 2배일 때는 2배보다 짧음']
    ],
    worked:WORKED,
    compoundList:[
      {id:'C1',nm:'복합 ① · 세 호의 비 + 몇 배',sub:'원 위 세 점으로 각 찾고 배수로 확장'},
      {id:'C2',nm:'복합 ② · 세 호의 비 + 비로 구하기',sub:'세 점으로 각 찾고 간단한 비로 넓이 구하기'},
      {id:'C3',nm:'복합 ③ · 반원(180°) + 중심각의 비',sub:'지름의 180° 성질로 빈 각을 구해 비 적용'},
      {id:'C4',nm:'복합 ④ · 이등변삼각형 + 외각',sub:'반지름=반지름 이등변삼각형과 외각으로 3배 각 찾기'},
      {id:'C5',nm:'복합 ⑤ · 평행선 + 반원 호의 길이',sub:'동위각·이등변삼각형으로 중심각을 구해 호 계산'}
    ],
    genCompound:GEN_COMPOUND,
    t3PracticeCids:['C1','C4']
  });
}

window.CENT_T08={SCHEMA_QS,FIRST_GUIDE,WORKED,GEN_COMPOUND,mountCent:tab=>HG_TRACKS.viewTrackLesson('cent',tab)};
})();