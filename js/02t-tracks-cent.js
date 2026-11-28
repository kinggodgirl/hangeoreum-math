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
const svgTx=(P,s,o={})=>`<text x="${f1(P[0])}" y="${f1(P[1])}" font-size="${o.size||18}" text-anchor="${o.anchor||'middle'}" dominant-baseline="central" fill="${o.col||INK}" ${o.sans?`font-family="'IBM Plex Sans KR',sans-serif" font-weight="700"`:''} ${o.it?'font-style="italic"':''} stroke="#fff" stroke-width="3.2" paint-order="stroke">${String(s).replace(/(^|[^A-Za-z])x(?![A-Za-z])/g,'$1<tspan font-style="italic" font-family="Times New Roman,serif">x</tspan>')}</text>`;
const svgAng=(C,a0,a1,lab,o={})=>{
  const r=o.r||24,mid=(a0+a1)/2,sp=Math.abs(a1-a0),lr=o.lr||(sp>=150?42:Math.min(72,Math.max(40,48/Math.max(0.35,Math.sin(sp*Math.PI/360)))));
  return`<path d="${arcD(C,r,a0,a1)}" fill="none" stroke="${o.col||INK}" stroke-width="${o.w||2}"/>`+(lab?svgTx(pol(C,lr,mid),lab,{size:o.size||17,col:o.col||INK}):'');
};

/* 교과서식 호의 길이 치수선: 연장선 2개 + 동심 실선 호 + 양끝 안쪽 화살표 + 가운데 글자 자리 (06c·02t 공용) */
function arcDim(C,R,a0,a1,label,opt={}){
  const col=opt.col||INK,sz=opt.size||16,rd=opt.rd||(R+24),ext=opt.ext||(R+32),span=a1-a0,mid=(a0+a1)/2;
  let s=svgLn(pol(C,R,a0),pol(C,ext,a0),col,1.5)+svgLn(pol(C,R,a1),pol(C,ext,a1),col,1.5);
  const arrow=(ang,dir)=>{
    const t=pol(C,rd,ang),ra=rad(ang),bx=dir*Math.sin(ra),by=dir*Math.cos(ra),nx=Math.cos(ra),ny=-Math.sin(ra);
    const L=9.2,W=3.1,N=7.0;
    const p1=[t[0]+bx*L+nx*W,t[1]+by*L+ny*W],p2=[t[0]+bx*N,t[1]+by*N],p3=[t[0]+bx*L-nx*W,t[1]+by*L-ny*W];
    return`<path d="M ${pt(t)} L ${pt(p1)} L ${pt(p2)} L ${pt(p3)} Z" fill="${col}"/>`;
  };
  s+=arrow(a0,-1)+arrow(a1,1);
  const tipDeg=(5.2/rd)*180/Math.PI;
  const plainLen=String(label||'').replace(/<[^>]+>/g,'').length;
  const tw=plainLen*sz*0.56+14,gapDeg=(tw/2/rd)*180/Math.PI;
  if(span/2>gapDeg+tipDeg+2.5){
    s+=`<path d="${arcD(C,rd,a0+tipDeg,mid-gapDeg)}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`;
    s+=`<path d="${arcD(C,rd,mid+gapDeg,a1-tipDeg)}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`;
    if(label)s+=svgTx(pol(C,rd,mid),label,{size:sz,sans:true,col});
  }else{
    if(span>2*tipDeg)s+=`<path d="${arcD(C,rd,a0+tipDeg,a1-tipDeg)}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`;
    if(label)s+=svgTx(pol(C,rd+18,mid),label,{size:sz,sans:true,col});
  }
  return s;
}
function ctTwoSec(opt){
  const{a,b,l1,l2,mode='arc',hl=[],showChord=false,diffRadius=false,semi=false,lenMark=false}=opt;
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
  /* [cent 다듬기] lenMark: 교과서처럼 연장선 + 동심 실선 호 + 양끝 화살표 + 가운데 숫자로 '호의 길이'를 보여 줘요 */
  if(lenMark&&mode==='arc'){
    if(l1)s+=arcDim(C,R,A0,A1,l1,{col:has('val1')?askC(l1):INK,size:16});
    if(l2)s+=arcDim(C,R,B0,B1,l2,{col:has('val2')?askC(l2):INK,size:16});
  }else{
    if(l1)s+=svgTx(pol(C,R+24,(A0+A1)/2),l1,{size:16,sans:true,col:has('val1')?askC(l1):INK});
    if(l2)s+=svgTx(pol(C,R+24,(B0+B1)/2),l2,{size:16,sans:true,col:has('val2')?askC(l2):INK});
  }
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
  const tg=segs.find(x=>x[0]===want);
  if(hl.includes('ang')&&tg)s+=svgAng(C,tg[1],tg[2],'?°',{col:HL,w:3});
  const others=segs.filter(x=>x!==tg).sort((u,v)=>(v[2]-v[1])-(u[2]-u[1]));
  const oAng=(others[0][1]+others[0][2])/2;
  s+=svgDot(pol(C,R,aA),4.5)+svgDot(pol(C,R,aB),4.5)+svgDot(pol(C,R,aC),4.5)+svgDot(C,4);
  s+=svgTx(pol(C,R+20,aA),'A',{it:true})+svgTx(pol(C,R+20,aB),'B',{it:true})+svgTx(pol(C,R+20,aC),'C',{it:true})+svgTx(pol(C,19,oAng),'O',{size:16});
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
    fig:hl=>ctTwoSec({a:40,b:120,l1:'3 cm',l2:'x cm',mode:'arc',hl,lenMark:true}),
    wantChips:['120° 부채꼴의 호의 길이 (x cm)','40° 부채꼴의 넓이','원의 반지름'],wantAns:'120° 부채꼴의 호의 길이 (x cm)',wantHl:['val2'],
    givenChips:[{k:'a',t:'중심각 40°',ok:true,hl:'ang1'},{k:'l1',t:'40°의 호 3 cm',ok:true,hl:'val1'},{k:'b',t:'중심각 120°',ok:true,hl:'ang2'},{k:'trap',t:'반지름 5 cm',ok:false}],
    teacherEq:'40 × 3 = 120 이므로, 3 × 3 = <i>x</i>',pairQ:'식 앞쪽 <b>40 × 3 = 120</b>에서 40과 120은 문제의 어떤 숫자인가요?',
    pairChoices:['작은 중심각과 큰 중심각','호의 길이와 중심각'],pairAns:'작은 중심각과 큰 중심각',
    calcPrompt:'3 × 3 = ? (cm)',calcAns:9,calcTopic:'mul',calcExplain:'중심각이 <b>3배</b>이므로 호의 길이도 3 × 3 = <b>9 cm</b>예요.'},
  {id:'fg2',tyNo:2,title:'유형 2 · 중심각의 비로 호의 길이 구하기',
    problem:'한 원에서 중심각이 <b>50°</b>인 부채꼴의 호의 길이가 <b>10 cm</b>일 때, 중심각이 <b>70°</b>인 부채꼴의 호의 길이 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'x cm',mode:'arc',hl,lenMark:true}),
    wantChips:['70° 부채꼴의 호의 길이 (x cm)','50° 부채꼴의 중심각','원의 지름'],wantAns:'70° 부채꼴의 호의 길이 (x cm)',wantHl:['val2'],
    givenChips:[{k:'a',t:'중심각 50°',ok:true,hl:'ang1'},{k:'l1',t:'50°의 호 10 cm',ok:true,hl:'val1'},{k:'b',t:'중심각 70°',ok:true,hl:'ang2'},{k:'trap',t:'둘레 36 cm',ok:false}],
    teacherEq:'50 : 70 = 10 : <i>x</i> → 5 : 7 = 10 : <i>x</i><br>앞앞: 5 × 2 = 10 이므로, 뒤뒤: 7 × 2 = <i>x</i>',pairQ:'비례식에서 <b>10</b>은 두 중심각 중 어느 쪽의 짝인가요?',
    pairChoices:['50° 부채꼴의 호의 길이','70° 부채꼴의 호의 길이'],pairAns:'50° 부채꼴의 호의 길이',
    calcPrompt:'앞앞 5 × 2 = 10 이므로, 뒤뒤 7 × 2 = ? (cm)',calcAns:14,calcTopic:'ratio',calcExplain:'앞끼리 2배니까 뒤끼리도 2배, x = 7 × 2 = <b>14 cm</b>예요.'},
  {id:'fg3',tyNo:3,title:'유형 3 · 세 호의 비로 중심각 구하기',
    problem:'원 O에서 <span class="arcs">AB</span> : <span class="arcs">BC</span> : <span class="arcs">CA</span> = <b>2 : 3 : 4</b>일 때, <span class="arcs">BC</span>에 대한 중심각의 크기를 구하시오.',
    fig:hl=>ctThreeArcs(2,3,4,{want:'BC',hl}),
    wantChips:['호 BC에 대한 중심각 (°)','호 AB의 길이 (cm)','원 전체의 넓이'],wantAns:'호 BC에 대한 중심각 (°)',wantHl:['want','ang'],
    givenChips:[{k:'r',t:'세 호의 비 2 : 3 : 4',ok:true,hl:'BC'},{k:'full',t:'원 한 바퀴 = 360°',ok:true,hl:'ang'},{k:'trap',t:'반지름 6 cm',ok:false}],
    teacherEq:'전체 2 + 3 + 4 = 9칸 → 360° ÷ 9 = 40° → 40° × 3',pairQ:'식에서 <b>360°</b>를 왜 <b>9</b>로 나누었을까요?',
    pairChoices:['한 바퀴 360°가 전체 9칸에 나눠져 있어서','호 BC의 비가 9라서'],pairAns:'한 바퀴 360°가 전체 9칸에 나눠져 있어서',
    calcPrompt:'1칸 40° × 호 BC 3칸 = ? (°)',calcAns:120,calcTopic:'mul',calcExplain:'1칸 = 40°, 호 BC는 3칸 = <b>120°</b>예요.'}
];

const WORKED=[
  null,
  {no:1,nm:'중심각 비교 ① 몇 배',prob:'한 원에서 중심각이 <b>40°</b>인 호가 <b>3 cm</b>일 때, <b>120°</b>인 호 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:40,b:120,l1:'3 cm',l2:'x cm',mode:'arc',hl,lenMark:true}),
    steps:[{t:'① 어디를 먼저 볼까?',hl:['ang1','ang2'],body:'두 중심각 40°와 120°가 딱 나누어떨어지는지 먼저 확인해요.'},{t:'② 중심각이 몇 배인지 구하기',hl:['ang1','ang2'],body:'40 × <b>3</b> = 120 (3배)'},{t:'③ 호의 길이도 같은 배 곱하기',hl:['val1','val2'],body:'3 × 3 = <i>x</i>, <i>x</i> = <b>9 cm</b>'}],
    pitfall:'⚠️ 120° → 40°처럼 작아질 때도 곱셈으로 써요: 40 × 3 = 120 이므로, <i>x</i> × 3 = 9 → <i>x</i> = 3'},
  {no:2,nm:'중심각 비교 ② 비',prob:'한 원에서 중심각이 <b>50°</b>인 호가 <b>10 cm</b>일 때, <b>70°</b>인 호 <i>x</i> cm를 구하시오.',
    fig:hl=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'x cm',mode:'arc',hl,lenMark:true}),
    steps:[{t:'① 중심각의 비 간단히 하기',hl:['ang1','ang2'],body:'50 : 70 = <b>5 : 7</b> → 5 : 7 = 10 : <i>x</i>'},{t:'② 앞앞 비교',hl:['ang1','val1'],body:'5 × <b>2</b> = 10 (앞끼리 2배)'},{t:'③ 뒤뒤도 같은 배',hl:['ang2','val2'],body:'7 × 2 = <b>14 cm</b> (<i>x</i>가 앞에 있으면 뒤끼리 먼저 비교해요)'}],
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
      {tag:'2단계 · 앞앞 뒤뒤 비교로 넓이 구하기',q:`${sp.refAng} : ${wantAng} = ${sp.p} : ${sp.q} = ${refVal} : <i>x</i>예요. 앞끼리 ${sp.p} × ${m} = ${refVal}이면 뒤끼리 <i>x</i>는?`,type:'num',ans,suffix:'cm²',hint:`${sp.q} × ${m}`,ok:`${sp.q} × ${m} = ${ans} cm²`}
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
      {tag:'2단계 · 앞앞 뒤뒤 비교로 호 구하기',q:`${sp.a} : ${sp.b} = ${sp.p} : ${sp.q} = ${L} : <i>x</i>예요. 앞끼리 ${sp.p} × ${m} = ${L}이면 뒤끼리 <i>x</i>는?`,type:'num',ans,suffix:'cm',hint:`${sp.q} × ${m}`,ok:`${sp.q} × ${m} = ${ans} cm`}
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

/* ── [T21] 부엉 쌤 그림극: <g data-b="n">는 n번째 줄에서 나타나요. class="dr" 선은 그려지듯, ob-rot은 돌아가며 나타나요 ── */
const OB=(b,inner)=>`<g data-b="${b}">${inner}</g>`;
const drP=(d,col,w,o='')=>`<path class="dr" d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o}/>`;
const drL=(P,Q,col,w,o='')=>drP(`M ${pt(P)} L ${pt(Q)}`,col,w,o);
const rot=(C,deg,inner)=>`<g class="ob-rot" style="transform-origin:${f1(C[0])}px ${f1(C[1])}px;--r0:${deg}deg">${inner}</g>`;
function owlCentScene(k){
  if(k===1){/* 같은 중심각은 돌려서 포개져요 (교과서 195쪽) */
    const C=[170,128],R=92,t=50,a0=200,b0=30;
    let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#b5bece" stroke-width="1.8"/>`+svgDot(C,3.6)+svgTx([C[0]+4,C[1]+18],'O',{size:16});
    s+=OB(0,`<path d="${secD(C,R,b0,b0+t)}" fill="${BLs}" stroke="${INK}" stroke-width="2.2"/>`+`<path d="${arcD(C,R,b0,b0+t)}" fill="none" stroke="${BL}" stroke-width="5" stroke-linecap="round"/>`+svgAng(C,b0,b0+t,t+'°',{col:BL,size:15,r:22,lr:42}));
    s+=OB(0,`<path d="${secD(C,R,a0,a0+t)}" fill="${HLs}" stroke="${INK}" stroke-width="2.2" opacity=".9"/>`+svgAng(C,a0,a0+t,t+'°',{col:HL,size:15,r:22,lr:42}));
    s+=OB(1,rot(C,-(a0-b0),`<path d="${secD(C,R,b0,b0+t)}" fill="${HLs}" fill-opacity=".45" stroke="${HL}" stroke-width="3"/>`));
    s+=OB(2,`<g class="ob-pop">${svgTx([C[0],C[1]+R+22],'호의 길이 같음 · 넓이 같음 · 현의 길이 같음',{sans:true,size:13,col:INK})}</g>`);
    return svgBox(340,250,s,'중심각이 같은 두 부채꼴을 돌려서 포개기');
  }
  if(k===2){/* 2배, 3배로 붙이기 */
    const C=[170,150],R=100,t=40,a0=70;
    let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#b5bece" stroke-width="1.8"/>`+svgDot(C,3.6)+svgTx([C[0],C[1]+18],'O',{size:16});
    const piece=(i,col)=>`<path d="${secD(C,R,a0+i*t,a0+(i+1)*t)}" fill="${col}" stroke="${INK}" stroke-width="2"/>`+`<path d="${arcD(C,R,a0+i*t,a0+(i+1)*t)}" fill="none" stroke="${BL}" stroke-width="5" stroke-linecap="round"/>`+svgTx(pol(C,R+18,a0+(i+.5)*t),'3 cm',{size:13,col:BL});
    s+=OB(0,piece(0,BLs)+svgAng(C,a0,a0+t,'40°',{col:INK,size:14,r:20,lr:40}));
    s+=OB(1,rot(C,t,piece(1,'#e8eefb')));
    s+=OB(2,rot(C,2*t,piece(2,BLs)));
    s+=OB(3,drP(arcD(C,R+30,a0,a0+3*t),HL,4)+`<g class="ob-pop">${svgTx([C[0],C[1]+R+26],'중심각 120° (3배) → 호 9 cm (3배)',{sans:true,size:14,col:HL})}</g>`);
    return svgBox(340,290,s,'40° 부채꼴을 2개, 3개 붙이기');
  }
  if(k===4){/* 현은 2배가 되지 않아요 */
    const C=[170,130],R=96,A=pol(C,R,205),Bp=pol(C,R,250),D=pol(C,R,295);
    let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#b5bece" stroke-width="1.8"/>`+svgDot(C,3.6)+svgTx([C[0],C[1]-18],'O',{size:16});
    s+=OB(0,svgLn(C,A,INK,2)+svgLn(C,Bp,INK,2)+svgAng(C,205,250,'45°',{size:13,r:20,lr:38})+drL(A,Bp,BL,5)+svgDot(A)+svgDot(Bp)+svgTx(pol(C,R+15,205),'A')+svgTx(pol(C,R+15,250),'B'));
    s+=OB(1,svgLn(C,D,INK,2)+svgAng(C,250,295,'45°',{size:13,r:20,lr:38})+drL(Bp,D,BL,5)+svgDot(D)+svgTx(pol(C,R+15,295),'C'));
    s+=OB(2,drL(A,D,HL,6)+`<g class="ob-pop">${svgTx([C[0],C[1]+R+24],'현 AC < 현 AB + 현 BC',{sans:true,size:15,col:HL})}</g>`);
    return svgBox(340,258,s,'중심각이 2배인 현 비교');
  }
  return'';
}
const OWL_SCENES=[
  {lv:1,cap:'장면 ① 중심각이 같으면 포개져요',svg:()=>owlCentScene(1),beats:[
    '한 원에 중심각이 <span class="num">50°</span>로 같은 부채꼴 두 개가 있어요.',
    '주황 부채꼴을 중심 O를 축으로 빙글 돌려 볼게요. 파란 부채꼴에 꼭 포개져요!',
    {say:'꼭 포개지니까 한 원에서 중심각이 같으면 <b>호의 길이도, 넓이도 같아요</b>. 현의 길이도 같아요.',exp:'happy'}]},
  {lv:1,cap:'장면 ② 2배, 3배로 붙여 보기',svg:()=>owlCentScene(2),beats:[
    '한 원에서 중심각이 <span class="num">40°</span>이고 호의 길이가 <span class="num">3 cm</span>인 부채꼴이에요.',
    '똑같은 부채꼴을 돌려서 옆에 붙이면 중심각은 <span class="num">80°</span>, 2배가 돼요. 호의 길이도 3 + 3 = <span class="num">6 cm</span>, 2배예요.',
    '하나 더 붙이면 중심각 <span class="num">120°</span>, 3배! 호의 길이도 <span class="num">9 cm</span>, 3배가 돼요. 넓이도 똑같이 3배예요.',
    {say:'그래서 한 원에서 호의 길이와 넓이는 중심각의 크기에 <b>정비례</b>해요.',exp:'happy'}]},
  {lv:2,cap:'장면 ③ 딱 떨어지면 몇 배, 아니면 비',svg:()=>ctTwoSec({a:50,b:70,l1:'10 cm',l2:'x cm',mode:'arc',hl:['ang1','ang2'],lenMark:true}),beats:[
    '중심각이 <span class="num">50°</span>일 때 호가 <span class="num">10 cm</span>예요. 중심각이 <span class="num">70°</span>이면 호는 몇 cm일까요?',
    '70 ÷ 50은 나누어떨어지지 않아요. 이럴 때는 <span class="kw">비</span>로 써요. 중심각끼리, 호끼리 같은 순서로 <b>50 : 70 = 10 : x</b>',
    '50 : 70을 간단히 하면 5 : 7이에요. 그래서 <b>5 : 7 = 10 : x</b>예요.',
    '<span class="kw">앞앞</span> 비교: 5 × 2 = 10, 앞끼리 2배예요. <span class="kw">뒤뒤</span>도 2배라서 7 × 2 = <b>x = 14</b>예요.',
    {say:'x가 앞에 있으면 뒤끼리 먼저 비교해요. 5 : 7 = x : 21이면 7 × 3 = 21이니까 x = 5 × 3 = <b>15</b>예요.',exp:'happy'}]},
  {lv:3,cap:'장면 ④ 세 호를 합치면 원 한 바퀴',svg:()=>ctThreeArcs(2,3,4,{want:'BC',hl:['want','ang']}),beats:[
    '원 위의 세 점 A, B, C가 만든 세 호의 길이의 비가 <span class="num">2 : 3 : 4</span>예요.',
    '세 호를 모두 합치면 원 한 바퀴예요. 그래서 중심각도 모두 합치면 <span class="num">360°</span>예요.',
    '2 + 3 + 4 = <span class="num">9칸</span>으로 나누면 1칸은 360 ÷ 9 = <span class="num">40°</span>예요.',
    {say:'호 BC는 3칸이니까 호 BC에 대한 중심각은 40 × 3 = <b>120°</b>예요.',exp:'happy'}]},
  {lv:1,cap:'장면 ⑤ 현은 2배가 되지 않아요',exp:'warn',svg:()=>owlCentScene(4),beats:[
    '중심각이 <span class="num">45°</span>인 현 AB를 그었어요.',
    '옆에 똑같이 45°인 현 BC를 하나 더 그었어요. A에서 C까지 중심각은 <span class="num">90°</span>, 2배예요.',
    {say:'그런데 현 AC는 곧게 질러가서 현 AB + 현 BC보다 <span class="warn">짧아요</span>. 중심각이 2배가 되어도 현의 길이는 <span class="warn">2배가 되지 않아요</span>!',exp:'warn'}],
    ask:{q:'한 원에서 중심각의 크기에 정비례하지 <b>않는</b> 것은?',choices:['현의 길이','호의 길이','부채꼴의 넓이','어느 것도 아니에요'],ans:'현의 길이',hint:'굽은 길(호)과 곧게 질러가는 길(현) 중에서 어느 쪽이 2배보다 짧았는지 떠올려요.',ok:'정확해요! 호의 길이와 넓이는 정비례하지만 현의 길이는 정비례하지 않아요.'}},
  {lv:2,cap:'장면 ⑥ 크기가 다른 원이면 안 돼요',exp:'happy',svg:()=>ctTwoSec({a:60,b:60,diffRadius:true}),beats:[
    '작은 원과 큰 원에 중심각이 똑같이 <span class="num">60°</span>인 부채꼴이 있어요.',
    '중심각은 같아도 큰 원의 호가 더 길어요. 원의 크기가 다르기 때문이에요.',
    '그래서 정비례는 꼭 <span class="kw">한 원</span> 또는 <span class="kw">크기가 같은 원</span>에서만 써요.']}
];

/* [T20] 첫걸음 구별하기(C1): 한 원에서 중심각만 2배로 바꾼 두 부채꼴. 주황 표시가 2배가 되는지 가려요.
   종류 0 호 · 1 넓이 · 2 현 · 3 반지름 · 4 부채꼴의 둘레 · 5 활꼴의 넓이 */
/* [cent 다듬기] 첫걸음은 보기 2개로: 2배가 되는지 아닌지만 가려요. 주황 표시가 무엇인지는 문제 글에 이름으로 적어요 */
const RAPID_CH=['2배가 돼요','2배가 되지 않아요'];
const RAPID_ANS=['2배가 돼요','2배가 돼요','2배가 되지 않아요','2배가 되지 않아요','2배가 되지 않아요','2배가 되지 않아요'];
const RAPID_NM=['호의 길이','부채꼴의 넓이','현의 길이','반지름의 길이','부채꼴의 둘레','활꼴의 넓이'];
const rapidQ=k=>`한 원에서 중심각이 2배가 되면, 주황색으로 표시한 <b class="ct-rq-nm">${RAPID_NM[k]}</b>도 2배가 될까요?`;
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
    owlSummary:['한 원에서 중심각이 같으면 호의 길이, 넓이, 현의 길이가 각각 같아요.','한 원에서 호의 길이와 넓이는 중심각의 크기에 <b>정비례</b>해요.','현의 길이는 중심각에 정비례하지 않아요 (2배가 되어도 2배보다 짧아요).','딱 떨어지면 몇 배, 안 떨어지면 비를 간단히 해서 앞앞 뒤뒤 비교 · 세 호의 비는 360°를 전체 칸 수로 나눠요.'],
    schemaRapid:{n:6,kinds:6,title:'중심각이 2배가 되면?',q:'두 부채꼴은 <b>한 원</b>에서 중심각만 2배로 바꾼 거예요. <b>주황색으로 표시한 것</b>은 어떻게 될까요?',
      choices:RAPID_CH,check:[0,2,4,5],
      make:(k,seed)=>({fig:ctRapidFig(k,Math.floor(seed/6)),q:rapidQ(k),ans:RAPID_ANS[k],why:RAPID_WHY[k]})},
    schemaQs:SCHEMA_QS,
    firstGuide:FIRST_GUIDE,
    t1Check:T1_CHECK_POOL,
    stratRows:[
      ['딱 나누어떨어지는 두 각<br><small>예: 40°와 120°</small>','몇 배인지 확인','40 × 3 = 120 이므로, 3 × 3 = x (작아질 때도 x × 3 = 9처럼 곱셈으로)'],
      ['안 나누어떨어지는 두 각<br><small>예: 50°와 70°</small>','간단한 비 · 앞앞 뒤뒤','5 : 7 = 10 : x → 앞끼리 × 2 = 뒤끼리 × 2 (x가 앞이면 뒤끼리 먼저)'],
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