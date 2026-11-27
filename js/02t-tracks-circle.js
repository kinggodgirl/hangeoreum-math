/* [T16] 교과서 한 걸음 — Ⅵ. 평면도형의 성질 1차시(arc: 원과 부채꼴) · 3차시(sector: 부채꼴 호와 넓이) */
(()=>{
'use strict';

const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',RD='#b83a3a';
const MF="'Times New Roman',Times,serif";
const rad=a=>a*Math.PI/180,pol=(C,R,a)=>[C[0]+R*Math.cos(rad(a)),C[1]-R*Math.sin(rad(a))];
const f1=n=>Math.round(n*10)/10,pt=P=>`${f1(P[0])} ${f1(P[1])}`;
const svgB=(w,h,s,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="ct-svg" role="img" aria-label="${lab||'원'}" style="font-family:${MF}">${s}</svg>`;
const arcD=(C,R,a0,a1)=>`M ${pt(pol(C,R,a0))} A ${R} ${R} 0 ${Math.abs(a1-a0)>180?1:0} 0 ${pt(pol(C,R,a1))}`;
const secD=(C,R,a0,a1)=>`M ${pt(C)} L ${pt(pol(C,R,a0))} A ${R} ${R} 0 ${Math.abs(a1-a0)>180?1:0} 0 ${pt(pol(C,R,a1))} Z`;
const ln=(P,Q,col=INK,w=2.4,d='')=>`<line x1="${f1(P[0])}" y1="${f1(P[1])}" x2="${f1(Q[0])}" y2="${f1(Q[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${d?` stroke-dasharray="${d}"`:''}/>`;
const dot=(P,r=4,col=INK)=>`<circle cx="${f1(P[0])}" cy="${f1(P[1])}" r="${r}" fill="${col}"/>`;
const tx=(P,s,o={})=>`<text x="${f1(P[0])}" y="${f1(P[1])}" font-size="${o.size||17}" text-anchor="${o.anchor||'middle'}" dominant-baseline="central" fill="${o.col||INK}" ${o.sans?`font-family="'IBM Plex Sans KR',sans-serif" font-weight="700"`:''} stroke="#fff" stroke-width="3" paint-order="stroke">${s}</text>`;

/* ── 1차시 arc 그림 도우미 ── */
/* [T20] 문제 그림(quiz): 해설 글자 없이 점·도형·주황 표시만 그려요(규칙 총정리 4절). */
function arcQuiz(kind){
  const C=[150,130],R=86,A=pol(C,R,145),B=pol(C,R,35),TH=`stroke="${HL}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`;
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`;
  if(kind==='chord')s+=`<path d="M ${pt(A)} L ${pt(B)}" ${TH}/>`+dot(A)+dot(B);
  else if(kind==='diam'){const D=pol(C,R,215);s+=`<path d="M ${pt(B)} L ${pt(D)}" ${TH}/>`+dot(B)+dot(D)}
  else if(kind==='non_sec'){const Q=[150,175];s+=`<path d="M ${pt(Q)} L ${pt(A)} A ${R} ${R} 0 0 1 ${pt(B)} Z" fill="${HLs}" ${TH}/>`+dot(Q,4)}
  else if(kind==='semi')s+=`<path d="${secD(C,R,0,180)}" fill="${HLs}" ${TH}/>`;
  s+=dot(C,4)+tx([C[0],C[1]+(kind==='semi'?18:16)],'O',{size:16});
  return svgB(300,232,s,'원 O');
}
/* [T20] 빠른 구별 추가 종류: 10 반원(부채꼴이면서 활꼴), 11 중심각이 180°보다 큰 부채꼴
   [T21] 반원은 두 이름(both)을 모두 골라야 넘어가요. 어느 쪽을 먼저 골라도 똑같이 '하나 더' 안내가 나와요. */
function arcExtraRapid(k,seed){
  const C=[150,140],R=100,a0=(seed*37)%360,TH=`stroke="${HL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
  const span=k===10?180:200+(seed*13)%50,a1=a0+span;
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="${INK}" stroke-width="2.4"/>`+`<path d="${secD(C,R,a0,a1)}" fill="${HLs}" ${TH}/>`;
  s+=dot(pol(C,R,a0),4.5)+dot(pol(C,R,a1),4.5)+dot(C)+tx(pol(C,22,a0+span/2+180),'O',{size:20});
  const fig=svgB(300,280,s,'원 O');
  return k===10?{fig,ans:'부채꼴',both:['부채꼴','활꼴'],why:'반원은 반지름 2개와 호로 둘러싸여서 <b>부채꼴</b>이고, 현(지름)과 호로 둘러싸여서 <b>활꼴</b>이기도 해요.'}
    :{fig,ans:'부채꼴',why:'중심각이 180°보다 커도 두 반지름과 호로 둘러싸이면 <b>부채꼴</b>이에요.',also:null};
}
/* ── [T21] 부엉 쌤 그림극 그림: <g data-b="n">는 n번째 줄에서 나타나고, class="dr" 선은 그려지듯 나타나요 ── */
const OB=(b,inner)=>`<g data-b="${b}">${inner}</g>`;
const drP=(d,col,w,o='')=>`<path class="dr" d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o}/>`;
const drL=(P,Q,col,w,o='')=>drP(`M ${pt(P)} L ${pt(Q)}`,col,w,o);
const popDot=(P,r=4.5,col=INK)=>`<circle class="ob-pop" cx="${f1(P[0])}" cy="${f1(P[1])}" r="${r}" fill="${col}"/>`;
/* 호 기호: 글자 위에 굽은 선 (교과서 기호 ⌒AB) */
const arcSymSVG=(P,s,o={})=>{const sz=o.size||22,w=sz*0.36*s.length+6,y=P[1]-sz*0.62;
  return tx(P,s,{size:sz,col:o.col||INK})+`<path d="M ${f1(P[0]-w/2)} ${f1(y+5)} Q ${f1(P[0])} ${f1(y-6)} ${f1(P[0]+w/2)} ${f1(y+5)}" fill="none" stroke="${o.col||INK}" stroke-width="2.2" stroke-linecap="round"/>`};
const OW_C=[160,124],OW_R=88,OW_A=145,OW_B=35;
function owArcBase(o={}){const C=OW_C,R=OW_R,A=pol(C,R,OW_A),B=pol(C,R,OW_B);
  return`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`+(o.noAB?'':dot(A,4.5)+dot(B,4.5)+tx(pol(C,R+16,OW_A),'A')+tx(pol(C,R+16,OW_B),'B'))+dot(C,4)+tx([C[0],C[1]+17],'O',{size:16})}
function owlArcScene(k){
  const C=OW_C,R=OW_R,A=pol(C,R,OW_A),B=pol(C,R,OW_B),W=320,H=258;
  let s='';
  if(k===1){/* 호 AB와 기호 */
    s+=OB(0,drP(`M ${C[0]+R} ${C[1]} A ${R} ${R} 0 1 0 ${C[0]-R} ${C[1]} A ${R} ${R} 0 1 0 ${C[0]+R} ${C[1]}`,INK,2.2)+dot(C,4)+tx([C[0],C[1]+17],'O',{size:16}));
    s+=OB(1,popDot(A)+popDot(B)+tx(pol(C,R+16,OW_A),'A')+tx(pol(C,R+16,OW_B),'B'));
    s+=OB(2,drP(arcD(C,R,OW_B,OW_A),HL,7)+tx(pol(C,R-22,90),'호 AB',{sans:true,col:HL,size:15}));
    s+=OB(3,`<rect x="200" y="214" width="112" height="38" rx="9" fill="#fff8eb" stroke="${HL}" stroke-width="1.6"/>`+tx([232,234],'기호',{sans:true,size:13,col:'#9a5a12'})+arcSymSVG([278,236],'AB',{size:21,col:HL}));
    const P=pol(C,R,270);
    s+=OB(4,drP(arcD(C,R,OW_A,OW_B+360),BL,4.5,' stroke-dasharray="2 9"')+popDot(P,4.5,BL)+tx(pol(C,R+15,270),'C',{col:BL}));
  }else if(k===2){/* 현과 지름 */
    s+=OB(0,owArcBase()+`<path d="${arcD(C,R,OW_B,OW_A)}" fill="none" stroke="#e7c9a0" stroke-width="5" stroke-linecap="round"/>`);
    s+=OB(1,drL(A,B,HL,6)+tx([C[0],A[1]-14],'현 AB',{sans:true,col:HL,size:15}));
    const Ps=[300,255].map(a=>pol(C,R,a));
    s+=OB(2,Ps.map(P=>drL(B,P,'#7c8aa8',3)+dot(P,4,'#7c8aa8')).join(''));
    const D=pol(C,R,OW_B+180);
    s+=OB(3,drL(B,D,BL,6)+popDot(D,4.5,BL)+tx([D[0]-30,D[1]+2],'지름',{sans:true,col:BL,size:15}));
  }else if(k===3){/* 부채꼴과 중심각 */
    s+=OB(0,owArcBase());
    s+=OB(1,drL(C,A,INK,3.2)+drL(C,B,INK,3.2)+tx([C[0]-58,C[1]-12],'반지름',{sans:true,size:13,col:'#55607a'})+tx([C[0]+58,C[1]-12],'반지름',{sans:true,size:13,col:'#55607a'}));
    s+=OB(2,`<path d="${secD(C,R,OW_B,OW_A)}" fill="${HLs}" stroke="none" opacity=".85"/>`+ln(C,A,INK,3.2)+ln(C,B,INK,3.2)+drP(arcD(C,R,OW_B,OW_A),HL,6)+tx(pol(C,R*0.76,90),'부채꼴 AOB',{sans:true,col:'#9a5a12',size:14}));
    s+=OB(3,drP(arcD(C,26,OW_B,OW_A),BL,3)+tx(pol(C,42,90),'중심각',{sans:true,col:BL,size:13}));
  }else if(k===4){/* 활꼴 */
    s+=owArcBase();
    s+=OB(0,drL(A,B,INK,3.4)+tx([C[0],A[1]+15],'현 AB',{sans:true,size:13,col:'#55607a'}));
    s+=OB(1,`<path d="${arcD(C,R,OW_B,OW_A)} Z" fill="${BLs}" stroke="none"/>`+ln(A,B,INK,3.4)+drP(arcD(C,R,OW_B,OW_A),HL,6)+tx([C[0],C[1]-R+26],'활꼴',{sans:true,col:BL,size:15}));
    s+=OB(2,`<g class="ob-pop">${tx([62,232],'부채꼴 = 반지름 2개 + 호',{sans:true,size:13,col:'#9a5a12',anchor:'start'})}</g>`+`<g class="ob-pop">${tx([62,252],'활꼴 = 현 + 호',{sans:true,size:13,col:BL,anchor:'start'})}</g>`);
  }else if(k===5){/* 부채꼴이 아닌 경우 */
    const Q=[C[0]-6,C[1]+52];
    s+=owArcBase({noAB:false});
    s+=OB(0,`<path d="M ${pt(Q)} L ${pt(A)} A ${R} ${R} 0 0 1 ${pt(B)} Z" fill="${HLs}" stroke="none"/>`+drL(Q,A,HL,5)+drL(Q,B,HL,5)+drP(`M ${pt(B)} A ${R} ${R} 0 0 0 ${pt(A)}`,HL,5)+popDot(Q,4.5,RD)+tx([Q[0]+16,Q[1]+8],'P',{col:RD}));
    s+=OB(1,drL(C,A,RD,2.4,' stroke-dasharray="5 6"')+drL(C,B,RD,2.4,' stroke-dasharray="5 6"')+`<g class="ob-pop">${tx([C[0],C[1]+R+20],'꼭짓점이 O가 아니에요!',{sans:true,col:RD,size:14})}</g>`);
  }else{/* 반원 */
    const L=pol(C,R,180),Rt=pol(C,R,0);
    s+=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`;
    s+=OB(0,`<path d="${secD(C,R,0,180)}" fill="#e5f4ea" stroke="none"/>`+drP(arcD(C,R,0,180),HL,6)+ln(L,Rt,INK,2.6)+dot(L,4.5)+dot(Rt,4.5)+dot(C,4)+tx([L[0]-14,L[1]],'A')+tx([Rt[0]+14,Rt[1]],'B')+tx([C[0],C[1]+17],'O',{size:16})+drP(arcD(C,22,0,180),INK,2)+tx([C[0],C[1]-36],'180°',{size:15}));
    s+=OB(1,drL(C,L,BL,6)+drL(C,Rt,BL,6)+tx([C[0]-44,C[1]+20],'반지름',{sans:true,col:BL,size:13})+tx([C[0]+44,C[1]+20],'반지름',{sans:true,col:BL,size:13})+`<g class="ob-pop">${tx([C[0],C[1]+R+4],'반지름 2개 + 호 → 부채꼴',{sans:true,col:BL,size:14})}</g>`);
    s+=OB(2,drL(L,Rt,'#2b7a4b',7)+`<g class="ob-pop">${tx([C[0],C[1]+R+26],'현(지름) + 호 → 활꼴',{sans:true,col:'#2b7a4b',size:14})}</g>`);
  }
  return svgB(W,H+(k===6?10:0),s,'원과 부채꼴 그림극');
}
/* [T21] 3차시 sector 부엉 쌤 그림극 그림 */
function owlSecScene(k){
  if(k===1){/* 원의 둘레 = 지름 × π, 둘레를 펴 보기 */
    const C=[170,88],R=46,d=2*R,L=Math.PI*d,x0=170-L/2,y=196;
    let s=OB(0,drP(`M ${C[0]+R} ${C[1]} A ${R} ${R} 0 1 0 ${C[0]-R} ${C[1]} A ${R} ${R} 0 1 0 ${C[0]+R} ${C[1]}`,HL,5)+dot(C,3.6)+tx([C[0]+14,C[1]+14],'O',{size:15}));
    s+=OB(1,drL(pol(C,R,180),pol(C,R,0),BL,4)+tx([C[0],C[1]-14],'지름 12 cm',{sans:true,size:13,col:BL}));
    s+=OB(2,drL([x0,y],[x0+L,y],HL,5)+[0,1,2].map(i=>`<g class="ob-pop">${ln([x0+i*d+3,y+18],[x0+(i+1)*d-3,y+18],BL,4)}</g>`).join('')+ln([x0+3*d+3,y+18],[x0+L,y+18],'#9fb3dd',4)+tx([x0+L/2,y-16],'둘레를 쭉 편 길이',{sans:true,size:13,col:HL})+tx([x0+L/2,y+38],'지름 3개와 조금 더 (약 3.14배)',{sans:true,size:13,col:BL}));
    return svgB(340,250,s,'원의 둘레를 펴서 지름과 비교하기');
  }
  if(k===2){/* 원을 잘라 붙여 직사각형 */
    const C=[70,96],R=50,n=8,t=360/n;
    let s=OB(0,[...Array(n)].map((_,i)=>`<path d="${secD(C,R,i*t,(i+1)*t)}" fill="${i%2?BLs:HLs}" stroke="${INK}" stroke-width="1.4"/>`).join('')+dot(C,3));
    const w=Math.PI*R/(n/2),x0=150,y0=66,h=R;let z='';
    for(let i=0;i<n;i++){const up=i%2===0,xl=x0+i*w/2,xr=xl+w,xm=(xl+xr)/2;
      z+=up?`<path d="M ${f1(xm)} ${y0} L ${f1(xr)} ${y0+h} Q ${f1(xm)} ${y0+h+8} ${f1(xl)} ${y0+h} Z" fill="${HLs}" stroke="${INK}" stroke-width="1.4"/>`
        :`<path d="M ${f1(xm)} ${y0+h} L ${f1(xl)} ${y0} Q ${f1(xm)} ${y0-8} ${f1(xr)} ${y0} Z" fill="${BLs}" stroke="${INK}" stroke-width="1.4"/>`}
    s+=OB(1,`<g class="ob-pop">${z}</g>`+tx([134,96],'→',{size:24}));
    const W=w*(n+1)/2;
    s+=OB(2,drL([x0,y0+h+26],[x0+W,y0+h+26],HL,4)+tx([x0+W/2,y0+h+42],'가로 = 반둘레 (반지름 × π)',{sans:true,size:12.5,col:HL})+drL([x0+W+10,y0],[x0+W+10,y0+h],BL,4)+tx([x0+W+14,y0+h/2],'반지름',{sans:true,size:12.5,col:BL,anchor:'start'}));
    s+=OB(3,`<g class="ob-pop">${tx([200,205],'원의 넓이 = 반둘레 × 반지름',{sans:true,size:16,col:INK})}</g>`);
    return svgB(400,230,s,'원을 잘라 붙여 직사각형 만들기');
  }
  if(k===3){/* 360 ÷ 60 = 6조각 중 1조각 */
    const C=[170,118],R=92;
    let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`+dot(C,3.6)+tx([C[0]+12,C[1]+16],'O',{size:15});
    s+=OB(0,ln(C,pol(C,R,60),INK,2.6)+ln(C,pol(C,R,120),INK,2.6)+drP(arcD(C,24,60,120),INK,2)+tx(pol(C,40,90),'60°',{size:14}));
    s+=OB(1,[180,240,300,0].map(a=>drL(C,pol(C,R,a),'#7c8aa8',2,' stroke-dasharray="5 5"')).join('')+[1,2,3,4,5,6].map(i=>`<g class="ob-pop">${tx(pol(C,R*0.78,90+(i-1)*60),i,{size:15,col:'#55607a'})}</g>`).join(''));
    s+=OB(2,drP(arcD(C,R,60,120),HL,6)+tx(pol(C,R+18,90),'호 = 12π × 60/360 = 2π',{sans:true,size:13,col:HL}));
    s+=OB(3,`<path d="${secD(C,R,60,120)}" fill="${HLs}" stroke="none" opacity=".9"/>`+ln(C,pol(C,R,60),INK,2.6)+ln(C,pol(C,R,120),INK,2.6)+`<path d="${arcD(C,R,60,120)}" fill="none" stroke="${HL}" stroke-width="6" stroke-linecap="round"/>`+`<g class="ob-pop">${tx([C[0],C[1]+R+20],'넓이 = 36π × 60/360 = 6π',{sans:true,size:13,col:'#9a5a12'})}</g>`);
    return svgB(340,250,s,'원을 6조각으로 나누기');
  }
  if(k===4){/* 부채꼴도 잘라 붙이면 직사각형 */
    const C=[80,150],R=100,a0=60,a1=120,n=6,t=(a1-a0)/n;
    let s=OB(0,[...Array(n)].map((_,i)=>`<path d="${secD(C,R,a0+i*t,a0+(i+1)*t)}" fill="${i%2?BLs:HLs}" stroke="${INK}" stroke-width="1.3"/>`).join('')+dot(C,3)+tx([C[0],C[1]+15],'O',{size:14})+tx(pol(C,R+14,90),'호 l',{size:14,col:BL})+tx(pol(C,R/2,52),'r',{size:15,col:BL}));
    const arcL=rad(a1-a0)*R,w=arcL/(n/2),x0=168,y0=48,h=R*0.9;let z='';
    for(let i=0;i<n;i++){const up=i%2===0,xl=x0+i*w/2,xr=xl+w,xm=(xl+xr)/2;
      z+=up?`<path d="M ${f1(xm)} ${f1(y0+h)} L ${f1(xl)} ${y0} Q ${f1(xm)} ${y0-5} ${f1(xr)} ${y0} Z" fill="${HLs}" stroke="${INK}" stroke-width="1.3"/>`
        :`<path d="M ${f1(xm)} ${y0} L ${f1(xr)} ${f1(y0+h)} Q ${f1(xm)} ${f1(y0+h+5)} ${f1(xl)} ${f1(y0+h)} Z" fill="${BLs}" stroke="${INK}" stroke-width="1.3"/>`}
    s+=OB(1,`<g class="ob-pop">${z}</g>`+tx([140,100],'→',{size:24}));
    const W=w*(n+1)/2;
    s+=OB(2,drL([x0,y0+h+20],[x0+W,y0+h+20],HL,4)+tx([x0+W/2,y0+h+36],'가로 = 호의 반 (½ l)',{sans:true,size:12.5,col:HL})+drL([x0+W+10,y0],[x0+W+10,y0+h],BL,4)+tx([x0+W+14,y0+h/2],'세로 = r',{sans:true,size:12.5,col:BL,anchor:'start'}));
    return svgB(370,210,s,'부채꼴을 잘라 붙여 직사각형 만들기');
  }
  /* k===5 색칠한 도형의 둘레: 큰 호 → 작은 호 → 곧은 선분 2개 */
  const C=[170,190],R=150,r=75,a0=60,a1=120;
  let s=`<path d="M ${pt(pol(C,r,a0))} L ${pt(pol(C,R,a0))} A ${R} ${R} 0 0 0 ${pt(pol(C,R,a1))} L ${pt(pol(C,r,a1))} A ${r} ${r} 0 0 1 ${pt(pol(C,r,a0))} Z" fill="${HLs}" stroke="${INK}" stroke-width="1.6"/>`+`<path d="${secD(C,r,a0,a1)}" fill="none" stroke="#b5bece" stroke-width="1.4" stroke-dasharray="4 5"/>`+dot(C,3.4)+tx([C[0]+14,C[1]-4],'O',{size:15});
  s+=OB(1,drP(arcD(C,R,a0,a1),BL,6)+tx(pol(C,R+14,90),'① 큰 호',{sans:true,size:13,col:BL}));
  s+=OB(2,drP(arcD(C,r,a0,a1),BL,6)+tx(pol(C,r-16,90),'② 작은 호',{sans:true,size:13,col:BL}));
  s+=OB(3,drL(pol(C,r,a0),pol(C,R,a0),RD,6)+drL(pol(C,r,a1),pol(C,R,a1),RD,6)+tx(pol(C,(R+r)/2+6,a0-9),'③ 4 cm',{sans:true,size:13,col:RD})+tx(pol(C,(R+r)/2+6,a1+9),'④ 4 cm',{sans:true,size:13,col:RD}));
  return svgB(340,215,s,'색칠한 도형의 둘레 차례로 따라가기');
}
function arcFig(kind,o){
  if(o&&o.quiz)return arcQuiz(kind);
  const C=[150,130],R=86,A=pol(C,R,145),B=pol(C,R,35);
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#9aa3b5" stroke-width="2"/>`;
  if(kind==='arc'){s+=`<path d="${arcD(C,R,35,145)}" fill="none" stroke="${HL}" stroke-width="6" stroke-linecap="round"/>`+dot(A)+dot(B)+tx([150,24],'호 AB (굽은 선)',{sans:true,col:HL,size:15})}
  else if(kind==='chord'){s+=ln(A,B,BL,4.5)+dot(A)+dot(B)+tx([150,74],'현 AB (곧은 선분)',{sans:true,col:BL,size:15})}
  else if(kind==='diam'){const D=pol(C,R,215);s+=ln(B,D,BL,4.5)+dot(B)+dot(D)+tx([150,145],'지름 = 중심 지나는 현',{sans:true,col:BL,size:14})}
  else if(kind==='sector'){s+=`<path d="${secD(C,R,35,145)}" fill="${HLs}" stroke="${INK}" stroke-width="2.4"/>`+tx([150,72],'반지름 2개 + 호',{sans:true,col:HL,size:14})}
  else if(kind==='seg'){s+=`<path d="${arcD(C,R,35,145)} Z" fill="${BLs}" stroke="${INK}" stroke-width="2.4"/>`+tx([150,62],'현 + 호 (활꼴)',{sans:true,col:BL,size:14})}
  else if(kind==='non_sec'){const Q=[150,175];s+=`<path d="M ${pt(Q)} L ${pt(A)} A ${R} ${R} 0 0 1 ${pt(B)} Z" fill="#fbe9e9" stroke="${RD}" stroke-width="2.6"/>`+dot(Q,4.5,RD)+tx([150,192],'중심 O가 아님!',{sans:true,col:RD,size:13})}
  else if(kind==='semi'){s+=`<path d="${secD(C,R,0,180)}" fill="#e5f4ea" stroke="${INK}" stroke-width="2.5"/>`+tx([150,86],'반원 (180°)',{sans:true,col:'#2b7a4b',size:15})}
  s+=dot(C,4)+tx([C[0],C[1]+16],'O',{size:15});
  return svgB(300,246,s,'원과 부채꼴 그림');
}

/* ── 3차시 sector 그림 도우미 ── */
function secFigS(R,rIn,th,opt={}){
  const C=[155,140],radR=86,a0=90-th/2,a1=90+th/2;
  /* [T23] 원 전체(360°): 부채꼴 경로는 시작점=끝점이라 그려지지 않아요 → 원으로 그리고 반지름(또는 지름)을 표시해요 */
  if(th>=360){
    let c=`<circle cx="${C[0]}" cy="${C[1]}" r="${radR}" fill="${opt.askPerim?'#fff7ec':HLs}" stroke="${opt.askPerim?HL:INK}" stroke-width="${opt.askPerim?5.5:2.4}"/>`;
    if(opt.dLab)c+=ln(pol(C,radR,180),pol(C,radR,0),BL,2.6)+dot(pol(C,radR,180),3.5)+dot(pol(C,radR,0),3.5)+tx([C[0],C[1]-16],opt.dLab,{sans:true,col:BL,size:15});
    else if(opt.rLab)c+=ln(C,pol(C,radR,0),BL,2.6)+dot(pol(C,radR,0),3.5)+tx([C[0]+radR/2,C[1]-16],opt.rLab,{sans:true,col:BL,size:15});
    c+=dot(C,4)+tx([C[0]-14,C[1]+16],'O',{size:16});
    return svgB(310,235,c,'원 그림');
  }
  /* [T20] askPerim: 둘레를 묻는 문제(테두리 전체 주황) · noAng: 중심각을 묻는 문제라 각도 숫자 숨김 */
  let s=`<path d="${secD(C,radR,a0,a1)}" fill="${opt.askPerim?'#fff7ec':HLs}" stroke="${INK}" stroke-width="2.4"/>`;
  if(rIn){const rr=radR*(rIn/R);s+=`<path d="${secD(C,rr,a0,a1)}" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
    if(opt.perim)s+=`<path d="${arcD(C,radR,a0,a1)}" fill="none" stroke="${BL}" stroke-width="4.5"/><path d="${arcD(C,rr,a0,a1)}" fill="none" stroke="${BL}" stroke-width="4"/>`+ln(pol(C,rr,a0),pol(C,radR,a0),RD,3.5)+ln(pol(C,rr,a1),pol(C,radR,a1),RD,3.5);
    if(opt.askPerim)s+=`<path d="${arcD(C,radR,a0,a1)}" fill="none" stroke="${HL}" stroke-width="5.5" stroke-linecap="round"/><path d="${arcD(C,rr,a0,a1)}" fill="none" stroke="${HL}" stroke-width="5.5" stroke-linecap="round"/>`+ln(pol(C,rr,a0),pol(C,radR,a0),HL,5.5)+ln(pol(C,rr,a1),pol(C,radR,a1),HL,5.5)}
  if(opt.arcLab)s+=tx(pol(C,radR+18,90),opt.arcLab,{sans:true,col:/\?/.test(opt.arcLab)?HL:BL,size:15});
  if(opt.rLab)s+=tx(pol(C,radR*0.55,a0-16),opt.rLab,{sans:true,col:BL,size:14});
  if(th&&!opt.noAng)s+=tx(pol(C,rIn?Math.min(32,radR*(rIn/R)*0.55):32,90),th+'°',{size:15,col:opt.rLab||opt.arcLab?BL:INK});
  return svgB(310,235,s,'부채꼴 그림');
}

function squareCornerSVG(a){
  const g=`<rect x="65" y="30" width="150" height="150" fill="${HLs}" stroke="${INK}" stroke-width="2.4"/>`+
    `<path d="M 65 180 L 65 30 A 150 150 0 0 1 215 180 Z" fill="#fff" stroke="${INK}" stroke-width="2"/>`+
    tx([140,196],`한 변 ${a} cm`,{sans:true,size:15,col:BL});
  return svgB(280,220,g,'정사각형에서 사분원 뺀 도형');
}
/* [T20] 나뭇잎 모양(S9): 정사각형 ABCD에서 B, D를 중심으로 하는 두 사분원이 겹친 부분 */
function leafSVG(a){
  const g=`<rect x="70" y="30" width="150" height="150" fill="#fff" stroke="${INK}" stroke-width="2.4"/>`+
    `<path d="M 70 30 A 150 150 0 0 1 220 180 A 150 150 0 0 1 70 30 Z" fill="${HLs}" stroke="${HL}" stroke-width="3"/>`+
    dot([70,30])+dot([70,180])+dot([220,180])+dot([220,30])+
    tx([58,22],'A',{size:16})+tx([58,190],'B',{size:16})+tx([232,190],'C',{size:16})+tx([232,22],'D',{size:16})+
    tx([145,200],`한 변 ${a} cm`,{sans:true,size:15,col:BL});
  return svgB(290,216,g,'정사각형 안의 나뭇잎 모양');
}
/* [T20] 첫걸음 구별하기(S1): 문제 문장을 읽고 구할 것과 단위를 함께 골라요 */
const S1_CH=['호의 길이 · cm','넓이 · cm²','둘레의 길이 · cm','중심각 · °','넓이 · cm','호의 길이 · cm²'];
function sectorRapid(k,seed){
  const r=[3,4,5,6,8,9][seed%6],th=[60,90,120,150,45][Math.floor(seed/6)%5],d=2*r,r3=[3,6,9][seed%3];
  const P=(t,f,ans,why)=>({fig:`<div style="font-size:17px;line-height:1.55;text-align:left;margin:0 0 8px;padding:10px 12px;border-radius:12px;background:#f6f8fc">${t}</div>${f}`,ans,why});
  const sec=o=>secFigS(r,null,th,o);
  switch(k){
    case 0:return P(`반지름의 길이가 ${r} cm, 중심각의 크기가 ${th}°인 부채꼴의 호의 길이를 구하시오.`,sec({rLab:`${r} cm`}),S1_CH[0],'굽은 선의 <b>길이</b>를 구하니까 단위는 <b>cm</b>예요.');
    case 1:return P(`반지름의 길이가 ${r} cm, 중심각의 크기가 ${th}°인 부채꼴의 넓이를 구하시오.`,sec({rLab:`${r} cm`}),S1_CH[1],'색칠한 만큼의 <b>넓이</b>라서 단위는 <b>cm²</b>예요.');
    case 2:return P(`반지름의 길이가 ${r} cm, 중심각의 크기가 ${th}°인 부채꼴의 둘레의 길이를 구하시오.`,sec({rLab:`${r} cm`}),S1_CH[2],'테두리를 한 바퀴 잰 <b>둘레의 길이</b>라서 단위는 <b>cm</b>예요.');
    case 3:return P(`반지름의 길이가 ${r3} cm이고 호의 길이가 ${2*r3/3}π cm인 부채꼴의 넓이를 구하시오.`,secFigS(r3,null,120,{rLab:`${r3} cm`,arcLab:`${2*r3/3}π cm`,noAng:true}),S1_CH[1],'문제에 cm가 나오지만 구하는 건 <b>넓이</b>라서 단위는 <b>cm²</b>예요.');
    case 4:return P(`반지름의 길이가 ${r} cm이고 넓이가 ${r}π cm²인 부채꼴의 호의 길이를 구하시오.`,secFigS(r,null,360/r,{rLab:`${r} cm`,noAng:true}),S1_CH[0],'문제에 cm²가 나오지만 구하는 건 <b>호의 길이</b>라서 단위는 <b>cm</b>예요.');
    case 5:return P(`반지름의 길이가 ${r3} cm이고 호의 길이가 ${2*r3/3}π cm인 부채꼴의 중심각의 크기를 구하시오.`,secFigS(r3,null,120,{rLab:`${r3} cm`,arcLab:`${2*r3/3}π cm`,noAng:true}),S1_CH[3],'<b>중심각의 크기</b>는 각도라서 단위는 <b>°(도)</b>예요.');
    case 6:return P(`지름의 길이가 ${d} cm인 원의 넓이를 구하시오.`,secFigS(r,null,360,{noAng:true,dLab:`${d} cm`}),S1_CH[1],'원 안쪽 전체의 <b>넓이</b>라서 단위는 <b>cm²</b>예요.');
    case 7:return P(`반지름의 길이가 ${r} cm인 원의 둘레의 길이를 구하시오.`,secFigS(r,null,360,{noAng:true,rLab:`${r} cm`,askPerim:true}),S1_CH[2],'원 테두리 한 바퀴의 <b>길이</b>라서 단위는 <b>cm</b>예요.');
    case 8:return P(`그림과 같이 중심이 같은 두 부채꼴로 만든 색칠한 부분의 둘레의 길이를 구하시오.`,secFigS(2*r,r,90,{}),S1_CH[2],'색칠한 부분의 테두리 <b>둘레의 길이</b>라서 단위는 <b>cm</b>예요.');
    default:return P(`한 변의 길이가 ${d} cm인 정사각형에서 사분원을 뺀 색칠한 부분의 넓이를 구하시오.`,squareCornerSVG(d),S1_CH[1],'색칠한 부분의 <b>넓이</b>라서 단위는 <b>cm²</b>예요.');
  }
}

/* ── 1차시 arc 등록 ── */
if(typeof HG_TRACKS==='object'){
  HG_TRACKS.register('arc',{
    kind:'concept',
    comboPick:false,
    /* [T19][T20] 첫걸음 구별하기(A1·A2): 주황 표시가 연달아 떠요. 0~9 = GEN.arcName 종류, 10 = 반원, 11 = 중심각이 180°보다 큰 부채꼴
       check = 첫걸음 차시 마무리에 섞어 내는 종류(틀리면 같은 종류의 다른 그림으로 다시 확인) */
    schemaRapid:{n:10,kinds:12,q:'원 O에서 <b>주황색으로 표시한 것</b>은 무엇일까요?',
      choices:['반지름','지름','현','호','부채꼴','활꼴','중심각','어느 것도 아니에요'],
      check:[1,2,4,5,7,10],
      make:(k,seed)=>{
        if(k>=10)return arcExtraRapid(k,seed);
        const pr=GEN.arcName(k+10*(Math.floor(seed/12)+1)),st=pr.steps[pr.steps.length-1];
        return{fig:pr.fig.svg(),ans:st.ans,why:st.ok||'',also:st.also||null}}},
    /* [T21] 부엉 쌤 그림극: 화면을 누를 때마다 한 줄씩 나오고, 선이 그려지듯 나타나요. 교과서 194~195쪽 순서(호 → 현 → 부채꼴·중심각 → 활꼴) */
    owlScenes:[
      {cap:'장면 ① 호와 그 기호',svg:()=>owlArcScene(1),beats:[
        '원 O를 그렸어요. 가운데 점 O가 <b>원의 중심</b>이에요.',
        '원 위에 서로 다른 두 점 <b>A</b>, <b>B</b>를 잡아요.',
        'A에서 원을 따라 B까지 가 보세요. 원 위의 두 점 사이에 있는 원의 일부분을 <b>호 AB</b>라고 해요.',
        '호 AB는 기호로 <span class="arc-sym">AB</span>와 같이 나타내요. AB 위에 굽은 선을 그려요.',
        {say:'반대쪽으로 돌아가는 긴 호도 있어요. 보통 <span class="arc-sym">AB</span>는 <span class="kw">짧은 쪽 호</span>이고, 긴 쪽은 그 위에 점 C를 잡아 <span class="arc-sym">ACB</span>로 나타내요.',exp:'happy'}]},
      {cap:'장면 ② 곧게 이으면 현',svg:()=>owlArcScene(2),beats:[
        '이번에는 두 점 A, B를 원을 따라가지 않고 <span class="kw">곧게</span> 이어 볼게요.',
        '원 위의 두 점을 이은 선분을 <b>현</b>이라고 해요. 이 선분은 <b>현 AB</b>예요. 굽은 선은 호, 곧은 선분은 현!',
        '점 B에서 원 위의 여러 점까지 현을 그어 보면 길이가 모두 달라요.',
        {say:'그중에서 <span class="num">원의 중심 O</span>를 지나는 현이 <b>지름</b>이에요. 지름은 가장 긴 현이에요.',exp:'happy'}]},
      {cap:'장면 ③ 부채꼴과 중심각',svg:()=>owlArcScene(3),beats:[
        '이번에는 원의 중심 O에서 시작해 볼게요.',
        'O에서 A, B까지 두 <b>반지름</b> OA, OB를 그어요.',
        '두 반지름 OA, OB와 <span class="arc-sym">AB</span>로 둘러싸인 도형을 <b>부채꼴 AOB</b>라고 해요. 피자 한 조각 모양이에요.',
        {say:'두 반지름이 이루는 ∠AOB를 부채꼴 AOB의 <b>중심각</b>이라고 해요. <span class="arc-sym">AB</span>에 대한 중심각이라고도 해요.',exp:'happy'}]},
      {cap:'장면 ④ 현과 호로 둘러싸이면 활꼴',svg:()=>owlArcScene(4),beats:[
        '두 점 A, B를 곧게 이어 <b>현 AB</b>를 그어요.',
        '현 AB와 <span class="arc-sym">AB</span>로 둘러싸인 도형을 <b>활꼴</b>이라고 해요. 활처럼 생겼죠?',
        {say:'무엇으로 둘러싸였는지 보면 돼요. <span class="kw">반지름 2개 + 호</span>는 부채꼴, <span class="kw">현 + 호</span>는 활꼴이에요.',exp:'happy'}]},
      {cap:'장면 ⑤ 꼭짓점이 중심 O인가요?',exp:'warn',svg:()=>owlArcScene(5),beats:[
        '이 도형도 피자 조각처럼 생겼어요. 그런데 꼭짓점이 중심 O가 아니라 점 P예요.',
        'PA, PB는 중심 O에서 나온 선분이 아니라서 <span class="warn">반지름이 아니에요</span>. 그래서 이 도형은 <span class="warn">부채꼴이 아니에요</span>.'],
        ask:{q:'부채꼴이 되려면 두 선분은 어디에서 시작해야 할까요?',choices:['원의 중심 O','원 위의 아무 점','원 안의 아무 점','원 밖의 점'],ans:'원의 중심 O',hint:'부채꼴은 두 반지름과 호로 둘러싸여요. 반지름은 어디에서 시작하나요?',ok:'맞아요! 두 선분이 중심 O에서 시작하는 반지름이어야 부채꼴이에요.'}},
      {cap:'장면 ⑥ 반원은 이름이 두 개',exp:'happy',svg:()=>owlArcScene(6),beats:[
        '중심각이 <span class="num">180°</span>인 부채꼴을 그려 볼게요. 바로 <b>반원</b>이에요.',
        'OA, OB는 반지름이에요. <span class="kw">반지름 2개 + 호</span>로 둘러싸였으니 <b>부채꼴</b>이에요.',
        '그런데 선분 AB는 지름, 곧 <b>현</b>이기도 해요. <span class="kw">현 + 호</span>로 둘러싸였으니 <b>활꼴</b>이기도 해요.'],
        ask:{q:'반원을 부르는 이름으로 옳은 것은?',choices:['부채꼴이면서 활꼴','부채꼴만','활꼴만','어느 것도 아니에요'],ans:'부채꼴이면서 활꼴',hint:'반지름 2개로도, 현(지름) 하나로도 볼 수 있어요.',ok:'맞아요! 반원은 부채꼴이면서 활꼴이에요. 구별하기에서도 두 이름을 모두 골라요.'}}
    ],
    owlSummary:['원 위의 두 점 사이에 있는 원의 일부분 = <b>호 AB</b>, 기호 <span class="arc-sym">AB</span> (보통 짧은 쪽 호)','원 위의 두 점을 이은 선분 = <b>현 AB</b> · 중심 O를 지나는 현 = <b>지름</b>(가장 긴 현)','두 반지름 + 호 = <b>부채꼴</b> (꼭짓점이 꼭 중심 O) · 두 반지름이 이루는 각 = <b>중심각</b>','현 + 호 = <b>활꼴</b> · 반원은 부채꼴이면서 활꼴'],
    schemaQs:[
      {id:'aq1',q:'원 O에서 <b>주황색으로 표시한 도형</b>의 이름으로 알맞은 것을 고르시오.',fig:()=>arcFig('non_sec',{quiz:true}),choices:['부채꼴','활꼴','반원','어느 것도 아니에요'],ans:'어느 것도 아니에요',hint:'두 변이 원의 중심 O에서 나오는 반지름인지 보세요.',why:'꼭짓점이 중심 O가 아니라서 부채꼴이 아니에요.'},
      {id:'aq2',q:'원 O에서 <b>주황색으로 표시한 선분</b>의 이름을 고르시오.',fig:()=>arcFig('chord',{quiz:true}),choices:['반지름','지름','현','호'],ans:'현',hint:'양 끝이 어디에 있는지 보세요.',why:'원 위의 두 점을 곧게 이은 선분은 현이에요.'},
      {id:'aq3',q:'중심각의 크기가 180°인 부채꼴(반원)을 부르는 이름으로 옳은 것을 고르시오.',fig:()=>arcFig('semi',{quiz:true}),choices:['부채꼴이면서 활꼴','부채꼴만','활꼴만','어느 것도 아니에요'],ans:'부채꼴이면서 활꼴',hint:'지름도 원 위의 두 점을 이은 현이에요.',why:'반원은 부채꼴이면서 활꼴이에요.'}
    ],
    /* [T20] 개념형 차시는 계산 4단계 틀을 쓰지 않아요(규칙 총정리 2절): 구별하기 → 부엉 쌤 이름표 → 차시 마무리 */
    firstGuide:[],
    stratRows:[
      ['선분 vs 굽은 선','양 끝점과 모양','곧게 이음 → 현(중심 지나면 지름) / 굽음 → 호'],
      ['둘러싸인 도형','꼭짓점 위치','두 반지름 + 호(꼭짓점=중심) → 부채꼴 / 현 + 호 → 활꼴'],
      ['특수한 경우 (180°)','반원','반원은 부채꼴이면서 동시에 활꼴이에요 ○!']
    ],
    worked:{
      1:{no:1,nm:'그림 보고 이름 맞추기',prob:'원 O에서 색칠되거나 굵게 표시된 부분의 이름을 찾으시오.',fig:()=>arcFig('arc'),
        steps:[{t:'① 선인지 도형인지 구분',hl:[],body:'원 위의 두 점을 이은 선분이면 <b>현</b>, 굽은 테두리면 <b>호</b>예요.'},{t:'② 중심을 지나는지 확인',hl:[],body:'현이 중심 O를 지나면 가장 정확한 이름인 <b>지름</b>을 골라요.'},{t:'③ 도형이면 변 확인',hl:[],body:'두 반지름 + 호 → <b>부채꼴</b> / 현 + 호 → <b>활꼴</b>'}],
        pitfall:'⚠️ 자주 하는 실수: 중심을 지나는 현에 "현"만 고르지 말고 "지름"을 찾아요!'},
      2:{no:2,nm:'헷갈리는 그림 구별하기',prob:'부채꼴·활꼴처럼 보이지만 조건에 어긋난 그림을 가려내요.',fig:()=>arcFig('non_sec'),
        steps:[{t:'① 꼭짓점이 중심 O인가?',hl:[],body:'꼭짓점이 중심이 아니면 부채꼴이 아니에요.'},{t:'② 양 끝점이 원 위에 있는가?',hl:[],body:'현은 양 끝이 모두 원 위에 있어야 해요.'},{t:'③ 원의 일부인가?',hl:[],body:'원의 둘레를 따라 휜 선만 호예요.'}],
        pitfall:'⚠️ 자주 하는 실수: 모양만 닮았다고 바로 부채꼴로 고르면 함정에 빠져요!'},
      3:{no:3,nm:'옳지 않은 설명 고르기',prob:'원·호·현·부채꼴·활꼴의 성질 ○× 판단',fig:()=>arcFig('semi'),
        steps:[{t:'① 지름은 현인가?',hl:[],body:'지름도 원 위의 두 점을 이은 선분이므로 현이 맞아요 ○.'},{t:'② 반원은 무엇인가?',hl:[],body:'중심각이 180°인 부채꼴이면서 활꼴이에요 ○.'},{t:'③ 활꼴 vs 부채꼴',hl:[],body:'반지름 2개+호 = 부채꼴, 현+호 = 활꼴. 반대로 쓰여 있으면 ✕!'}],
        pitfall:'⚠️ 자주 하는 실수: "반원은 활꼴이 아니다" 또는 "지름은 현이 아니다"를 참으로 착각하기 쉬워요.'}
    },
    compoundList:[
      {id:'C1',nm:'종합 ① · 가장 긴 현으로 반지름 구하기',sub:'가장 긴 현이 지름임을 알고 반지름 구하기'},
      {id:'C2',nm:'종합 ② · 헷갈리는 도형 판단하기',sub:'꼭짓점이 중심인지, 반원은 무엇인지 따지기'}
    ],
    genCompound:{
      C1:seed=>{
        const r=(seed*1664525+1013904223)>>>0,radR=3+(r%6),diam=2*radR;
        return{id:'C1',combo:[1,3],comboWhy:'① 그림에서 가장 긴 현의 이름을 찾고(유형 1) → ② 지름과 반지름의 관계로 계산(유형 3)',ptype:'arc:c1',
          title:`한 원에서 길이가 가장 긴 현의 길이가 <b>${diam} cm</b>일 때, 이 원의 반지름의 길이를 구하시오.`,
          fig:{svg:()=>arcFig('diam',{quiz:true})},finalQ:'이 원의 반지름은 몇 cm인가요?',
          steps:[
            {tag:'1단계 · 가장 긴 현의 이름',q:'한 원에서 길이가 가장 긴 현은 무엇인가요?',type:'choice',choices:['반지름','지름','호','활꼴'],ans:'지름',hint:'원의 중심을 지나는 현을 떠올려 봐요.'},
            {tag:'2단계 · 반지름 구하기',q:`지름이 ${diam} cm일 때 반지름은 몇 cm인가요?`,type:'num',ans:radR,suffix:'cm',hint:'지름은 반지름의 몇 배인지 떠올려요.',ok:`지름 ${diam} cm의 반이니까 반지름은 ${radR} cm예요.`}
          ]};
      },
      C2:seed=>{
        const r=(seed*22695477+1)>>>0,opt=r%2;
        const ch=opt?['부채꼴이에요','활꼴이에요','반원이에요','어느 것도 아니에요']:['부채꼴이면서 활꼴','부채꼴만','활꼴만','어느 것도 아니에요'];
        const ans=opt?'어느 것도 아니에요':'부채꼴이면서 활꼴';
        return{id:'C2',combo:[2,3],comboWhy:'① 꼭짓점이 중심인지 구별하고(유형 2) → ② 부채꼴·활꼴의 뜻으로 판단(유형 3)',ptype:'arc:c2',
          title:opt?'원 O에서 <b>주황색으로 표시한 도형</b>의 이름으로 알맞은 것을 고르시오.':'원 O에서 지름으로 나눈 <b>주황색 반원</b>을 부르는 이름으로 옳은 것을 고르시오.',
          fig:{svg:()=>arcFig(opt?'non_sec':'semi',{quiz:true})},finalQ:opt?'주황색 도형의 이름은?':'반원을 부르는 이름은?',
          steps:[
            {tag:'1단계 · 부채꼴의 조건',q:'부채꼴이 되려면 꼭짓점이 어디에 있어야 하나요?',type:'choice',choices:['원의 중심 O','원 위의 한 점','원 밖의 한 점','현의 가운데 점'],ans:'원의 중심 O',hint:'부채꼴의 두 변은 반지름이에요.'},
            {tag:'2단계 · 이름 정하기',q:opt?'주황색 도형의 이름은?':'반원을 부르는 이름은?',type:'choice',choices:ch,ans,hint:opt?'꼭짓점의 위치를 다시 봐요.':'지름도 원 위의 두 점을 이은 현이에요.',ok:opt?'꼭짓점이 중심 O가 아니라서 부채꼴이 아니에요.':'반원은 두 반지름과 호로 둘러싸여 부채꼴이고, 현(지름)과 호로 둘러싸여 활꼴이기도 해요.'}
          ]};
      }
    },
    t3PracticeCids:['C1','C2']
  });

  /* ── 3차시 sector:shade (자주 나오는 복합) 등록 ── */
  if(typeof GEN==='object'&&typeof PTYPES==='object'&&PTYPES.sector&&!GEN.sectorShade){
    GEN.sectorShade=seed=>{
      const r=(seed*1664525+1013904223)>>>0,rr=[2,4,6][r%3],R=2*rr,th=[60,90,180][(r>>>3)%3];
      const big=R*R*th/360,small=rr*rr*th/360,ans=big-small;
      const arcB=2*R*th/360,arcS=2*rr*th/360;
      return{ptype:'sector:shade',title:`중심각이 ${th}°이고 반지름이 ${R} cm인 큰 부채꼴에서 같은 중심을 가진 반지름 ${rr} cm인 작은 부채꼴을 뺐을 때 색칠한 부분의 <b>넓이</b>를 구하시오.`,
        fig:{svg:()=>`<div class="figbox">${secFigS(R,rr,th,{rLab:`${R} cm`})}</div>`},
        finalQ:'색칠한 부분의 넓이는 몇 cm²인가요?',steps:[
          {tag:'큰 부채꼴의 넓이',q:`반지름 ${R} cm, 중심각 ${th}°인 큰 부채꼴의 넓이는?`,type:'pi',ans:big,suffix:'cm²',hint:`원 넓이 ${R*R}π × (${th}/360)`},
          {tag:'작은 부채꼴의 넓이',q:`반지름 ${rr} cm, 중심각 ${th}°인 작은 부채꼴의 넓이는?`,type:'pi',ans:small,suffix:'cm²',hint:`원 넓이 ${rr*rr}π × (${th}/360)`},
          {tag:'큰 것 − 작은 것',q:`색칠한 넓이 = ${big}π − ${small}π = ?`,type:'pi',ans:ans,suffix:'cm²',hint:`${big} − ${small}에 π를 붙여요. (호의 합은 ${(arcB+arcS)}π + 양쪽 직선 ${2*(R-rr)} cm도 둘레에서 꼭 더해요!)`,ok:`${big}π − ${small}π = ${ans}π cm²`}]};
    };
    PTYPES.sector.push({no:6,nm:'색칠한 부분의 넓이 (큰 것 − 작은 것)',tb:'201쪽 · 자주 나오는 복합',key:'<b>큰 부채꼴 − 작은 부채꼴</b>로 넓이를 구하고, 둘레를 구할 땐 <b>곧은 선분 2개</b>도 빼먹지 마세요!',pt:['sector:shade'],src:['sectorShade']});
    GEN.ty_sector_6=seed=>GEN.sectorShade(seed);
    GEN.mix_sector=seed=>{const L=PTYPES.sector;return GEN[tyKey('sector',L[seed%L.length].no)](Math.floor(seed/L.length)+1)};
    LESSON_OF.ty_sector_6='sector';LESSON_OF.sectorShade='sector';
    PTYPE_NM['sector:shade']='3차시 · 색칠한 부분 넓이';
  }

  /* ── 3차시 sector 등록 ── */
  HG_TRACKS.register('sector',{
    kind:'proc',
    schemaRapid:{n:8,kinds:10,title:'무엇을 구할까요?',q:'이 문제에서 <b>구해야 하는 것</b>과 <b>답의 단위</b>를 고르세요.',
      choices:S1_CH,check:[2,3,4,5,8],make:(k,seed)=>sectorRapid(k,Math.floor(seed/10))},
    compoundBridgeNo:6,
    /* [T21] 부엉 쌤 그림극: 둘레를 펴 보고(π), 잘라 붙이고(넓이), 조각으로 나누고(중심각/360), 둘레를 한 바퀴 따라가요 */
    owlScenes:[
      {cap:'장면 ① 원의 둘레 = 지름 × π',svg:()=>owlSecScene(1),beats:[
        '반지름이 <span class="num">6 cm</span>인 원이에요. 주황색 선이 원의 <b>둘레</b>예요.',
        '중심 O를 지나는 지름은 6 × 2 = <span class="num">12 cm</span>예요.',
        '둘레를 쭉 펴서 지름과 비교해 보면 지름 3개보다 조금 더 길어요. 약 3.14배, 이 수가 <b>π</b>예요.',
        {say:'<b>둘레</b> 하면 <b>π</b>를 떠올려요! π는 <span class="kw">지름을 원의 둘레로 바꾸는 마법의 수</span>예요. 그래서 <b>원의 둘레 = 지름 × π</b>, 이 원의 둘레는 12 × π = <span class="num">12π cm</span>예요.',exp:'happy'}]},
      {cap:'장면 ② 원의 넓이 = 반둘레 × 반지름',svg:()=>owlSecScene(2),beats:[
        '원을 피자처럼 똑같이 8조각으로 잘라요.',
        '조각을 위아래로 엇갈려 붙이면 직사각형에 가까워져요. 많이 자를수록 더 직사각형이 돼요.',
        '가로는 둘레의 반, 곧 <span class="kw">반둘레(반지름 × π)</span>이고 세로는 <span class="kw">반지름</span>이에요.',
        {say:'그래서 <b>원의 넓이 = 반둘레 × 반지름</b>이에요. 반지름이 6이면 6π × 6 = <span class="num">36π cm²</span>예요.',exp:'happy'}]},
      {cap:'장면 ③ 부채꼴은 원의 (중심각/360) 조각',svg:()=>owlSecScene(3),beats:[
        '반지름이 <span class="num">6 cm</span>이고 중심각이 <span class="num">60°</span>인 부채꼴이에요.',
        '360 ÷ 60 = <span class="num">6</span>이니까, 원을 똑같이 6조각으로 나눈 것 중 1조각이에요.',
        '그래서 호의 길이는 원의 둘레 12π의 <span class="num">60/360</span>, 곧 <b>2π cm</b>예요.',
        {say:'넓이도 똑같이 원의 넓이 36π의 60/360, 곧 <b>6π cm²</b>예요. 원 전체에 <span class="kw">중심각/360</span>을 곱하면 돼요.',exp:'happy'}]},
      {cap:'장면 ④ 중심각을 모를 때: 호의 반 × 반지름',svg:()=>owlSecScene(4),beats:[
        '이번에는 중심각을 몰라요. 반지름 r와 호의 길이 l만 알아요.',
        '부채꼴도 잘게 잘라 엇갈려 붙이면 직사각형에 가까워져요.',
        '가로는 <span class="kw">호의 반(½ l)</span>, 세로는 <span class="kw">반지름 r</span>이에요. 그래서 <b>부채꼴의 넓이 = 호의 반 × 반지름</b>이에요.'],
        ask:{q:'반지름이 6 cm, 호의 길이가 4π cm인 부채꼴의 넓이는?',choices:['12π cm²','24π cm²','6π cm²','4π cm²'],ans:'12π cm²',hint:'호의 반(2π)에 반지름(6)을 곱해요.',ok:'맞아요! 호의 반 2π × 반지름 6 = 12π cm²예요.'}},
      {cap:'장면 ⑤ 둘레는 한 바퀴 빙 둘러요',exp:'warn',svg:()=>owlSecScene(5),beats:[
        '색칠한 도형의 <b>둘레</b>를 구해 볼게요. 둘레는 도형을 한 바퀴 빙 둘러싼 선이에요.',
        '먼저 바깥쪽 <span class="kw">① 큰 호</span>를 따라가요.',
        '다음은 안쪽 <span class="kw">② 작은 호</span>예요.',
        {say:'마지막으로 <span class="warn">③, ④ 곧은 선분 2개</span>! 이걸 빼먹기 쉬워요. 둘레 = 큰 호 + 작은 호 + 선분 2개예요.',exp:'warn'}]}
    ],
    owlSummary:['둘레 하면 π! π는 지름을 원의 둘레로 바꾸는 마법의 수 → 원 둘레 = 지름 × π / 원 넓이 = 반둘레(rπ) × 반지름(r)','부채꼴 호·넓이 = 원 전체 × (중심각 / 360)','중심각 모를 때 부채꼴 넓이 = (호의 반) × (반지름)','색칠한 도형 둘레 = 모든 둥근 호 + 곧은 직선 변 모두 더하기!'],
    schemaQs:[
      {id:'ssq1',q:'이 부채꼴 모양 색칠 부분의 <b>둘레</b>를 구할 때 더해야 하는 선은?',fig:()=>secFigS(8,4,60,{askPerim:true}),choices:['큰 호 + 작은 호 + 양쪽 직선 2개','큰 호 − 작은 호','큰 호 + 작은 호만','큰 호 + 양쪽 직선 2개'],ans:'큰 호 + 작은 호 + 양쪽 직선 2개',hint:'둘레는 색칠한 부분을 둘러싼 바깥 경계 선 전체예요.',why:'맞아요! 둥근 호 2개와 양옆의 곧은 선분 2개를 모두 더해야 둘레예요.'},
      {id:'ssq2',q:'중심각을 모르고 <b>반지름 6 cm, 호 4π cm</b>만 알 때 부채꼴 넓이를 구하는 방법은?',fig:()=>secFigS(6,null,120,{arcLab:'호 4π',rLab:'6 cm'}),choices:['(호의 반) × 반지름 = 2π × 6','호 × 반지름 = 4π × 6','지름 × π','(호의 반) × 지름 = 2π × 12'],ans:'(호의 반) × 반지름 = 2π × 6',hint:'직사각형으로 바꾸면 가로가 "호의 반"이에요.',why:'맞아요! S = (호의 반) × 반지름으로 중심각 없이도 바로 구해요.'},
      {id:'ssq3',q:'한 변 6 cm 정사각형에서 사분원을 뺀 색칠 부분의 넓이는 어떻게 구할까요?',fig:()=>squareCornerSVG(6),choices:['정사각형 넓이 − 사분원 넓이','정사각형 넓이 + 사분원 넓이','정사각형 넓이 − 원 전체 넓이','사분원 넓이 − 정사각형 넓이'],ans:'정사각형 넓이 − 사분원 넓이',hint:'전체 네모에서 흰 부채꼴을 오려 내면 남는 부분이에요.',why:'맞아요! 전체 넓이에서 빈 부분을 빼면 돼요.'}
    ],
    firstGuide:[
      {id:'sfg1',tyNo:1,title:'유형 1 · 원의 둘레와 넓이',
        problem:'반지름의 길이가 <b>5 cm</b>인 원의 <b>둘레의 길이</b>를 구하시오.',
        fig:()=>secFigS(5,null,360,{rLab:'5 cm',askPerim:true}),wantChips:['원의 둘레의 길이','원의 넓이','중심각'],wantAns:'원의 둘레의 길이',wantHl:[],
        givenChips:[{k:'r',t:'반지름 5 cm',ok:true},{k:'f',t:'둘레 = 지름 × π',ok:true},{k:'t',t:'중심각 60°',ok:false}],
        teacherEq:'지름 = 5 × 2 = 10 → 둘레 = 지름 × π',pairQ:'둘레를 구할 때 반지름 5를 왜 먼저 2배 했나요?',
        pairChoices:['π는 지름을 둘레로 바꾸니까','넓이 공식을 쓰려고'],pairAns:'π는 지름을 둘레로 바꾸니까',
        calcPrompt:'원의 둘레의 길이는 몇 cm인가요? (π를 붙여 써요. 예: 8π)',calcAns:10,calcTopic:'pi',calcExplain:'지름 10 × π = <b>10π cm</b>예요.'},
      {id:'sfg2',tyNo:2,title:'유형 2 · 부채꼴 호의 길이',
        problem:'반지름이 <b>6 cm</b>, 중심각이 <b>60°</b>인 부채꼴의 <b>호의 길이</b>를 구하시오.',
        fig:()=>secFigS(6,null,60,{arcLab:'? cm',rLab:'6 cm'}),wantChips:['부채꼴의 호의 길이','부채꼴의 넓이','지름'],wantAns:'부채꼴의 호의 길이',wantHl:[],
        givenChips:[{k:'r',t:'반지름 6 cm (지름 12)',ok:true},{k:'a',t:'중심각 60° (1/6 조각)',ok:true},{k:'t',t:'높이 8 cm',ok:false}],
        teacherEq:'원 둘레 12π × 60/360 = 12π × 1/6 = 2π',pairQ:'왜 원 둘레 12π에 <b>60/360</b>을 곱했나요?',
        pairChoices:['부채꼴은 원 전체 360° 중 60°만큼이라서','반지름이 6 cm라서'],pairAns:'부채꼴은 원 전체 360° 중 60°만큼이라서',
        calcPrompt:'호의 길이는 몇 cm인가요? (π를 붙여 써요. 예: 8π)',calcAns:2,calcTopic:'frac',calcExplain:'12π × 60/360 = 12π × 1/6 = <b>2π cm</b>예요.'},
      {id:'sfg3',tyNo:4,title:'유형 4 · 호의 길이로 부채꼴 넓이 구하기',
        problem:'반지름이 <b>5 cm</b>, 호의 길이가 <b>6π cm</b>인 부채꼴의 <b>넓이</b>를 구하시오.',
        fig:()=>secFigS(5,null,120,{arcLab:'6π cm',rLab:'5 cm'}),wantChips:['부채꼴의 넓이','중심각의 크기','원의 둘레'],wantAns:'부채꼴의 넓이',wantHl:[],
        givenChips:[{k:'r',t:'반지름 5 cm',ok:true},{k:'l',t:'호의 길이 6π cm',ok:true},{k:'t',t:'중심각 90°',ok:false}],
        teacherEq:'가로(호의 반 3π) × 세로(반지름 5) = 15π',pairQ:'식에서 <b>3π</b>는 어떻게 나온 수인가요?',
        pairChoices:['호의 길이 6π의 반','반지름 5의 반'],pairAns:'호의 길이 6π의 반',
        calcPrompt:'부채꼴의 넓이는 몇 cm²인가요? (π를 붙여 써요. 예: 8π)',calcAns:15,calcTopic:'mul',calcExplain:'(호의 반 3π) × (반지름 5) = <b>15π cm²</b>예요.'}
    ],
    stratRows:[
      ['반지름 r·중심각 x','원 전체 × x/360','둘레(지름×π) 또는 넓이(반둘레×반지름) × (x/360)'],
      ['중심각 모르고 r·호 l','직사각형 생각','(호의 반) × (반지름)'],
      ['반지름 r·호 l → 중심각','호 ÷ 원 둘레','360° × (호 / 원 둘레)'],
      ['색칠한 부분 둘레·넓이','전체 − 빈 부분','넓이는 빼기/더하기, 둘레는 직선 변까지 모두 더하기!']
    ],
    worked:{
      1:{no:1,nm:'원의 둘레와 넓이',prob:'반지름이 6 cm인 원의 둘레와 넓이를 구하시오.',fig:()=>secFigS(6,null,360,{rLab:'6 cm'}),
        steps:[{t:'① 둘레: 지름 × π',hl:[],body:'반지름 6 → 지름 <b>12 cm</b> → 둘레 <b>12π cm</b>'},{t:'② 넓이: 가로 = 반둘레',hl:[],body:'반둘레 = <b>6π cm</b>'},{t:'③ 가로 × 세로(반지름)',hl:[],body:'6π × 6 = <b>36π cm²</b>'}],
        pitfall:'⚠️ 자주 하는 실수: 넓이와 둘레 공식(12π vs 36π)을 바꾸어 쓰지 마세요!'},
      2:{no:2,nm:'반지름·중심각 → 호의 길이',prob:'반지름 6 cm, 중심각 60°인 부채꼴의 호의 길이는?',fig:()=>secFigS(6,null,60,{arcLab:'? cm',rLab:'6 cm'}),
        steps:[{t:'① 원 전체 둘레',hl:[],body:'지름 12 × π = <b>12π cm</b>'},{t:'② 몇 분의 몇 조각?',hl:[],body:'60/360 = <b>1/6</b>'},{t:'③ 곱하기',hl:[],body:'12π × 1/6 = <b>2π cm</b>'}],
        pitfall:'⚠️ 자주 하는 실수: 답에 π를 빼먹지 않도록 꼭 확인해요!'},
      3:{no:3,nm:'반지름·중심각 → 넓이',prob:'반지름 6 cm, 중심각 60°인 부채꼴의 넓이는?',fig:()=>secFigS(6,null,60,{rLab:'6 cm'}),
        steps:[{t:'① 원 전체 넓이',hl:[],body:'가로 6π × 세로 6 = <b>36π cm²</b>'},{t:'② 몇 분의 몇 조각?',hl:[],body:'60/360 = <b>1/6</b>'},{t:'③ 곱하기',hl:[],body:'36π × 1/6 = <b>6π cm²</b>'}],
        pitfall:'⚠️ 자주 하는 실수: 둘레(12π)를 놓고 × 1/6 하면 호의 길이가 나와요.'},
      4:{no:4,nm:'호의 길이로 넓이 구하기',prob:'반지름 6 cm, 호 4π cm인 부채꼴의 넓이는?',fig:()=>secFigS(6,null,120,{arcLab:'4π cm',rLab:'6 cm'}),
        steps:[{t:'① 가로 = 호의 반',hl:[],body:'4π ÷ 2 = <b>2π cm</b>'},{t:'② 세로 = 반지름',hl:[],body:'<b>6 cm</b>'},{t:'③ 곱하기',hl:[],body:'2π × 6 = <b>12π cm²</b>'}],
        pitfall:'⚠️ 자주 하는 실수: ½(호의 반)을 잊고 4π × 6 = 24π로 쓰기 쉬워요!'},
      5:{no:5,nm:'호의 길이로 중심각 구하기',prob:'반지름 6 cm, 호 4π cm인 부채꼴의 중심각은?',fig:()=>secFigS(6,null,120,{arcLab:'4π cm',rLab:'6 cm'}),
        steps:[{t:'① 원 둘레 구하기',hl:[],body:'지름 12 × π = <b>12π cm</b>'},{t:'② 호 ÷ 원 둘레 약분',hl:[],body:'4π / 12π = <b>1/3</b>'},{t:'③ 360° × 분수',hl:[],body:'360° × 1/3 = <b>120°</b>'}],
        pitfall:'⚠️ 자주 하는 실수: 호의 반으로 나누지 말고 원래 호의 길이(4π)를 그대로 써요.'},
      6:{no:6,nm:'색칠한 부분의 넓이 (큰 것 − 작은 것)',prob:'반지름 8 cm, 4 cm, 중심각 90°인 두 부채꼴 사이 넓이',fig:()=>secFigS(8,4,90,{rLab:'8 cm'}),
        steps:[{t:'① 큰 부채꼴 넓이',hl:[],body:'64π × 90/360 = 64π × 1/4 = <b>16π cm²</b>'},{t:'② 작은 부채꼴 넓이',hl:[],body:'16π × 90/360 = 16π × 1/4 = <b>4π cm²</b>'},{t:'③ 빼기 (둘레는 직선도!)',hl:[],body:'16π − 4π = <b>12π cm²</b>'}],
        pitfall:'⚠️ 자주 하는 실수: 넓이는 빼고, 둘레를 물을 때는 작은 호도 <b>더하기</b> + 직선 2개도 더해요!'}
    },
    compoundList:[
      {id:'C1',nm:'복합 ① · 넓이로 호·중심각 거꾸로 구하기',sub:'반지름과 넓이로 호의 길이를 구하고 중심각까지 거꾸로 구하기'},
      {id:'C2',nm:'복합 ② · 색칠한 부분의 둘레',sub:'큰 호 + 작은 호 + 곧은 선분 2개'},
      {id:'C3',nm:'복합 ③ · 정사각형 − 사분원',sub:'전체에서 빈 부분 빼기'},
      {id:'C4',nm:'복합 ④ · 나뭇잎 모양의 넓이',sub:'사분원 2개 − 정사각형'}
    ],
    genCompound:{
      C1:seed=>{
        const r=(seed*1664525+1013904223)>>>0;
        const rr=[3,4,6][r%3],l=rr===3?pick(r,[2,4]):rr===4?pick(r,[2,4,6]):pick(r,[2,4,6]);
        const S=l*rr/2,ang=Math.round(360*l/(2*rr));
        if(!Number.isInteger(S)||ang>=360)return HG_TRACKS.specs.sector.genCompound.C1(seed+1);
        return{id:'C1',combo:[4,5],comboWhy:'① 호의 반 × 반지름 = 넓이 식으로 호를 찾고(유형 4) → ② 중심각 거꾸로 구하기(유형 5)',ptype:'sector:c1',
          title:`반지름이 <b>${rr} cm</b>이고 넓이가 <b>${S}π cm²</b>인 부채꼴의 호의 길이와 중심각의 크기를 차례로 구하시오.`,
          fig:{svg:()=>secFigS(rr,null,ang,{rLab:`${rr} cm`,noAng:true})},finalQ:'부채꼴의 중심각의 크기는 몇 도인가요?',
          steps:[
            {tag:'1단계 · 호의 반 구하기',q:`(호의 반) × ${rr} = ${S}π → 호의 반은?`,type:'pi',ans:l/2,suffix:'cm',hint:`${S} ÷ ${rr}π`},
            {tag:'2단계 · 호의 길이 구하기',q:'부채꼴의 호의 길이는?',type:'pi',ans:l,suffix:'cm',hint:`(${l/2}π) × 2`},
            {tag:'3단계 · 중심각 거꾸로 구하기',q:`호 ${l}π는 원 둘레 ${2*rr}π의 몇 분의 몇인가요? 중심각은 몇 도?`,type:'num',ans:ang,suffix:'°',hint:`360 × (${l} ÷ ${2*rr})`,ok:`호 ${l}π cm, 중심각 ${ang}°`}
          ]};
      },
      C2:seed=>{
        /* [T20] S7 둘레: 곧은 선분까지 빠짐없이 */
        const r=(seed*22695477+1)>>>0,rr=[2,4,6][r%3],R=2*rr,th=[90,180][(r>>>3)%2];
        const aB=R*th/180,aS=rr*th/180,sum=aB+aS,seg=2*(R-rr),piS=n=>n===1?'π':n+'π';
        const ans=`${piS(sum)} + ${seg}`;
        return{id:'C2',combo:[2,6],comboWhy:'① 큰 호와 작은 호의 길이를 각각 구하고(유형 2) → ② 색칠한 도형의 테두리를 빠짐없이 모으기(유형 6)',ptype:'sector:c2',
          title:`중심각의 크기가 ${th}°이고 반지름의 길이가 각각 ${R} cm, ${rr} cm인 두 부채꼴로 만든 색칠한 부분의 둘레의 길이를 구하시오.`,
          fig:{svg:()=>secFigS(R,rr,th,{askPerim:true})},finalQ:'색칠한 부분의 둘레의 길이는 몇 cm인가요?',
          steps:[
            {tag:'1단계 · 큰 호의 길이',q:`반지름 ${R} cm, 중심각 ${th}°인 큰 호의 길이는?`,type:'pi',ans:aB,suffix:'cm',hint:'원의 둘레(지름 × π)에 중심각/360을 곱해요.'},
            {tag:'2단계 · 작은 호의 길이',q:`반지름 ${rr} cm, 중심각 ${th}°인 작은 호의 길이는?`,type:'pi',ans:aS,suffix:'cm',hint:'큰 호와 같은 방법으로 구해요.'},
            {tag:'3단계 · 곧은 선분',q:'양쪽 곧은 선분 2개의 길이의 합은?',type:'num',ans:seg,suffix:'cm',hint:'곧은 선분 하나는 큰 반지름 − 작은 반지름이에요.'},
            {tag:'4단계 · 둘레 모으기',q:'색칠한 부분의 둘레의 길이는? (단위 cm)',type:'choice',choices:shuf(r,[ans,piS(sum),`${piS(aB-aS)} + ${seg}`,`${piS(sum)} + ${2*R}`]),ans,hint:'테두리를 한 바퀴 따라가며 굽은 선과 곧은 선을 모두 모아요.',ok:`큰 호 ${piS(aB)} + 작은 호 ${piS(aS)} + 곧은 선분 ${seg} cm = (${ans}) cm예요.`}
          ]};
      },
      C3:seed=>{
        /* [T20] S6 정사각형 − 사분원: 마지막 답까지 */
        const r=(seed*1103515245+12345)>>>0,a=[2,4,6,8][r%4],sq=a*a,qtr=sq/4,piS=n=>n===1?'π':n+'π';
        const ans=`${sq} − ${piS(qtr)}`;
        return{id:'C3',combo:[3,6],comboWhy:'① 사분원(90°)의 넓이를 구하고(유형 3) → ② 정사각형에서 빼기(유형 6)',ptype:'sector:c3',
          title:`한 변의 길이가 ${a} cm인 정사각형에서 한 꼭짓점을 중심으로 하고 반지름의 길이가 ${a} cm인 사분원을 뺀 색칠한 부분의 넓이를 구하시오.`,
          fig:{svg:()=>squareCornerSVG(a)},finalQ:'색칠한 부분의 넓이는 몇 cm²인가요?',
          steps:[
            {tag:'1단계 · 정사각형의 넓이',q:'정사각형의 넓이는?',type:'num',ans:sq,suffix:'cm²',hint:'한 변 × 한 변'},
            {tag:'2단계 · 사분원의 넓이',q:`반지름 ${a} cm, 중심각 90°인 사분원의 넓이는?`,type:'pi',ans:qtr,suffix:'cm²',hint:'원의 넓이를 4로 나눠요.'},
            {tag:'3단계 · 빼기',q:'색칠한 부분의 넓이는? (단위 cm²)',type:'choice',choices:shuf(r,[ans,`${sq} − ${piS(sq)}`,`${piS(qtr)} − ${sq}`,`${sq} + ${piS(qtr)}`]),ans,hint:'전체에서 비어 있는 부분을 빼요.',ok:`정사각형 ${sq} cm²에서 사분원 ${piS(qtr)} cm²를 빼서 (${ans}) cm²예요.`}
          ]};
      },
      C4:seed=>{
        /* [T20] S9 나뭇잎 = 사분원 2개 − 정사각형 */
        const r=(seed*1664525+1013904223)>>>0,a=[2,4,6,8][r%4],sq=a*a,q=sq/4,piS=n=>n===1?'π':n+'π';
        const ans=`${piS(2*q)} − ${sq}`;
        return{id:'C4',combo:[3,6],comboWhy:'① 사분원 하나의 넓이를 구하고(유형 3) → ② 겹친 부분 = 사분원 2개 − 정사각형(유형 6)',ptype:'sector:c4',
          title:`한 변의 길이가 ${a} cm인 정사각형 ABCD에서 두 꼭짓점 B, D를 각각 중심으로 하고 반지름의 길이가 ${a} cm인 사분원을 그렸다. 색칠한 부분의 넓이를 구하시오.`,
          fig:{svg:()=>leafSVG(a)},finalQ:'색칠한 부분의 넓이는 몇 cm²인가요?',
          steps:[
            {tag:'1단계 · 사분원 하나의 넓이',q:`반지름 ${a} cm인 사분원 하나의 넓이는?`,type:'pi',ans:q,suffix:'cm²',hint:'원의 넓이를 4로 나눠요.'},
            {tag:'2단계 · 정사각형의 넓이',q:'정사각형 ABCD의 넓이는?',type:'num',ans:sq,suffix:'cm²',hint:'한 변 × 한 변'},
            {tag:'3단계 · 겹친 부분 구하기',q:'두 사분원을 더하면 정사각형보다 색칠한 부분만큼 넘쳐요. 색칠한 부분의 넓이는? (단위 cm²)',type:'choice',choices:shuf(r,[ans,`${piS(4*q)} − ${sq}`,`${sq} − ${piS(q)}`,`${piS(2*q)} + ${sq}`]),ans,hint:'사분원 2개를 겹쳐 놓으면 겹친 부분이 두 번 세어져요.',ok:`사분원 2개(${piS(2*q)}) − 정사각형(${sq}) = (${ans}) cm²예요.`}
          ]};
      }
    },
    t3PracticeCids:['C2','C4']
  });
}
function shuf(r,arr){const a=arr.slice();let x=r>>>0;for(let i=a.length-1;i>0;i--){x=(x*1103515245+12345)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function pick(r,arr){return arr[r%arr.length]}
})();