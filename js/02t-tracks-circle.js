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
  else if(kind==='non_sec'){const Q=[150,175];s+=`<path d="M ${pt(Q)} L ${pt(A)} A ${R} ${R} 0 0 0 ${pt(B)} Z" fill="${HLs}" ${TH}/>`+dot(Q,4)}
  else if(kind==='semi')s+=`<path d="${secD(C,R,0,180)}" fill="${HLs}" ${TH}/>`;
  s+=dot(C,4)+tx([C[0],C[1]+(kind==='semi'?18:16)],'O',{size:16});
  return svgB(300,232,s,'원 O');
}
/* [T20] 빠른 구별 추가 종류: 10 반원(부채꼴이면서 활꼴), 11 중심각이 180°보다 큰 부채꼴 */
function arcExtraRapid(k,seed){
  const C=[150,140],R=100,a0=(seed*37)%360,TH=`stroke="${HL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
  const span=k===10?180:200+(seed*13)%50,a1=a0+span;
  let s=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="${INK}" stroke-width="2.4"/>`+`<path d="${secD(C,R,a0,a1)}" fill="${HLs}" ${TH}/>`;
  s+=dot(pol(C,R,a0),4.5)+dot(pol(C,R,a1),4.5)+dot(C)+tx(pol(C,22,a0+span/2+180),'O',{size:20});
  const fig=svgB(300,280,s,'원 O');
  return k===10?{fig,ans:'부채꼴',why:'두 반지름과 호로 둘러싸였으니 <b>부채꼴</b>이에요. 지름도 현이라서 <b>활꼴</b>이기도 해요.',also:{'활꼴':'맞아요, 반원은 <b>활꼴</b>이기도 해요. 두 반지름과 호로도 둘러싸여 있어요. 다른 이름도 하나 더 골라 보세요.'}}
    :{fig,ans:'부채꼴',why:'중심각이 180°보다 커도 두 반지름과 호로 둘러싸이면 <b>부채꼴</b>이에요.',also:null};
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
  else if(kind==='non_sec'){const Q=[150,175];s+=`<path d="M ${pt(Q)} L ${pt(A)} A ${R} ${R} 0 0 0 ${pt(B)} Z" fill="#fbe9e9" stroke="${RD}" stroke-width="2.6"/>`+dot(Q,4.5,RD)+tx([150,192],'중심 O가 아님!',{sans:true,col:RD,size:13})}
  else if(kind==='semi'){s+=`<path d="${secD(C,R,0,180)}" fill="#e5f4ea" stroke="${INK}" stroke-width="2.5"/>`+tx([150,86],'반원 (180°)',{sans:true,col:'#2b7a4b',size:15})}
  s+=dot(C,4)+tx([C[0],C[1]+16],'O',{size:15});
  return svgB(300,246,s,'원과 부채꼴 그림');
}

/* ── 3차시 sector 그림 도우미 ── */
function secFigS(R,rIn,th,opt={}){
  const C=[155,140],radR=86,a0=90-th/2,a1=90+th/2;
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
    case 6:return P(`지름의 길이가 ${d} cm인 원의 넓이를 구하시오.`,secFigS(r,null,360,{noAng:true}),S1_CH[1],'원 안쪽 전체의 <b>넓이</b>라서 단위는 <b>cm²</b>예요.');
    case 7:return P(`반지름의 길이가 ${r} cm인 원의 둘레의 길이를 구하시오.`,secFigS(r,null,360,{noAng:true,rLab:`${r} cm`}),S1_CH[2],'원 테두리 한 바퀴의 <b>길이</b>라서 단위는 <b>cm</b>예요.');
    case 8:return P(`그림과 같이 중심이 같은 두 부채꼴로 만든 색칠한 부분의 둘레의 길이를 구하시오.`,secFigS(2*r,r,90,{}),S1_CH[2],'색칠한 부분의 테두리 <b>둘레의 길이</b>라서 단위는 <b>cm</b>예요.');
    default:return P(`한 변의 길이가 ${d} cm인 정사각형에서 사분원을 뺀 색칠한 부분의 넓이를 구하시오.`,squareCornerSVG(d),S1_CH[1],'색칠한 부분의 <b>넓이</b>라서 단위는 <b>cm²</b>예요.');
  }
}

/* ── 1차시 arc 등록 ── */
if(typeof HG_TRACKS==='object'){
  HG_TRACKS.register('arc',{
    kind:'concept',
    /* [T19][T20] 첫걸음 구별하기(A1·A2): 주황 표시가 연달아 떠요. 0~9 = GEN.arcName 종류, 10 = 반원, 11 = 중심각이 180°보다 큰 부채꼴
       check = 첫걸음 차시 마무리에 섞어 내는 종류(틀리면 같은 종류의 다른 그림으로 다시 확인) */
    schemaRapid:{n:10,kinds:12,q:'원 O에서 <b>주황색으로 표시한 것</b>은 무엇일까요?',
      choices:['반지름','지름','현','호','부채꼴','활꼴','중심각','어느 것도 아니에요'],
      check:[1,2,4,5,7,10],
      make:(k,seed)=>{
        if(k>=10)return arcExtraRapid(k,seed);
        const pr=GEN.arcName(k+10*(Math.floor(seed/12)+1)),st=pr.steps[pr.steps.length-1];
        return{fig:pr.fig.svg(),ans:st.ans,why:st.ok||'',also:st.also||null}}},
    owlScenes:[
      {cap:'장면 ① 굽으면 호, 곧으면 현!',say:'원 위의 두 점 A, B를 잡았어요. <span class="kw">원을 따라 굽게</span> 이으면 <b>호 AB</b>, <span class="kw">곧게 선분</span>으로 이으면 <b>현 AB</b>예요.',svg:()=>arcFig('arc')},
      {cap:'장면 ② 가장 긴 현 = 지름',say:'여러 현 중에서 <span class="num">원의 중심 O</span>를 지나가는 현이 바로 <b>지름</b>이에요. 지름도 현의 한 종류예요!',svg:()=>arcFig('diam')},
      {cap:'장면 ③ 부채꼴 vs 활꼴',say:'피자 조각처럼 <span class="kw">두 반지름 + 호</span>로 둘러싸이면 <b>부채꼴</b>! 활처럼 <span class="kw">현 + 호</span>로 둘러싸이면 <b>활꼴</b>이에요.',svg:()=>arcFig('sector')},
      {cap:'장면 ④ 꼭짓점이 중심 O인가요?',exp:'warn',say:'부채꼴처럼 생겨도 <span class="warn">꼭짓점이 중심 O가 아니면</span> 부채꼴이 아니에요!',svg:()=>arcFig('non_sec'),
        ask:{q:'중심각이 180°인 반원은 부채꼴이자 무엇이기도 할까요?',choices:['활꼴','다면체','직선'],ans:'활꼴',hint:'반원의 지름도 원 위의 두 점을 이은 "현"이에요!',ok:'맞아요! 지름(현) + 호로 둘러싸여서 반원은 부채꼴이면서 활꼴이에요.'}},
      {cap:'장면 ⑤ 이름표 총정리!',exp:'happy',say:'이제 헷갈리지 않죠? 반원은 <span class="kw">부채꼴 ○ · 활꼴 ○</span>라는 특별 친구까지 기억해 둬요!',svg:()=>arcFig('semi')}
    ],
    owlSummary:['원을 따라 굽은 선 = 호 / 두 점을 곧게 이은 선분 = 현','지름은 중심을 지나는 가장 긴 현','반지름 2개+호 = 부채꼴(꼭짓점이 꼭 중심 O!) / 현+호 = 활꼴','반원은 부채꼴이면서 활꼴이에요.'],
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
    owlScenes:[
      {cap:'장면 ① 원의 둘레는 지름 × π!',say:'<span class="kw">둘레 보면 π</span>! π는 <b>지름</b>을 원의 둘레로 바꾸는 마법이에요. 반지름이 6이면 지름은 <span class="num">12</span> → 둘레는 <span class="num">12π</span>!',svg:()=>secFigS(6,null,360,{arcLab:'둘레 = 지름 × π',rLab:'r = 6'})},
      {cap:'장면 ② 원의 넓이는 지그재그 직사각형!',say:'원을 잘게 잘라 붙이면 직사각형이 돼요. 가로는 <span class="kw">반둘레(반지름 × π)</span>, 세로는 <span class="kw">반지름</span> → <span class="num">가로 × 세로</span>!',svg:()=>typeof svgZig==='function'?svgZig('가로 = 반둘레 (r × π)','= 반지름'):secFigS(6,null,360,{})},
      {cap:'장면 ③ 부채꼴은 원의 (중심각/360) 조각',say:'반지름 6, 중심각 <span class="num">60°</span> 부채꼴은 360÷60 = <span class="num">6조각 중 1개</span>! 원 둘레·넓이에 <span class="num">중심각/360</span>을 곱해요.',svg:()=>secFigS(6,null,60,{arcLab:'둘레 ÷ 6 = 2π',rLab:'6 cm'})},
      {cap:'장면 ④ 중심각 모를 땐: 호의 반 × 반지름!',say:'부채꼴도 잘게 잘라 붙이면 직사각형! 가로는 <span class="kw">호의 반(½l)</span>, 세로는 <span class="kw">반지름(r)</span> → <span class="num">호의 반 × 반지름</span>!',svg:()=>typeof svgZig==='function'?svgZig('가로 = 호의 반 (½ l)','= 반지름 r'):secFigS(6,null,120,{arcLab:'호 l',rLab:'r'}),
        ask:{q:'반지름 6 cm, 호의 길이 4π cm인 부채꼴의 넓이는?',choices:['12π cm²','24π cm²','6π cm²'],ans:'12π cm²',hint:'호의 반(2π) × 반지름(6)을 곱해요!',ok:'맞아요! 호의 반 2π × 반지름 6 = 12π cm²예요.'}},
      {cap:'장면 ⑤ 색칠한 도형의 둘레 함정!',exp:'warn',say:'색칠한 도형의 <b>둘레</b>를 구할 땐 둥근 호 2개뿐 아니라 <span class="warn">양쪽 곧은 선분 2개</span>도 꼭 더해야 해요!',svg:()=>secFigS(8,4,45,{perim:true,arcLab:'큰 호 + 작은 호 + 선분 2개!'})}
    ],
    owlSummary:['원 둘레 = 지름 × π / 원 넓이 = 반둘레(rπ) × 반지름(r)','부채꼴 호·넓이 = 원 전체 × (중심각 / 360)','중심각 모를 때 부채꼴 넓이 = (호의 반) × (반지름)','색칠한 도형 둘레 = 모든 둥근 호 + 곧은 직선 변 모두 더하기!'],
    schemaQs:[
      {id:'ssq1',q:'이 부채꼴 모양 색칠 부분의 <b>둘레</b>를 구할 때 더해야 하는 선은?',fig:()=>secFigS(8,4,60,{askPerim:true}),choices:['큰 호 + 작은 호 + 양쪽 직선 2개','큰 호 − 작은 호','큰 호 + 작은 호만','큰 호 + 양쪽 직선 2개'],ans:'큰 호 + 작은 호 + 양쪽 직선 2개',hint:'둘레는 색칠한 부분을 둘러싼 바깥 경계 선 전체예요.',why:'맞아요! 둥근 호 2개와 양옆의 곧은 선분 2개를 모두 더해야 둘레예요.'},
      {id:'ssq2',q:'중심각을 모르고 <b>반지름 6 cm, 호 4π cm</b>만 알 때 부채꼴 넓이를 구하는 방법은?',fig:()=>secFigS(6,null,120,{arcLab:'호 4π',rLab:'6 cm'}),choices:['(호의 반) × 반지름 = 2π × 6','호 × 반지름 = 4π × 6','지름 × π','(호의 반) × 지름 = 2π × 12'],ans:'(호의 반) × 반지름 = 2π × 6',hint:'직사각형으로 바꾸면 가로가 "호의 반"이에요.',why:'맞아요! S = (호의 반) × 반지름으로 중심각 없이도 바로 구해요.'},
      {id:'ssq3',q:'한 변 6 cm 정사각형에서 사분원을 뺀 색칠 부분의 넓이는 어떻게 구할까요?',fig:()=>squareCornerSVG(6),choices:['정사각형 넓이 − 사분원 넓이','정사각형 넓이 + 사분원 넓이','정사각형 넓이 − 원 전체 넓이','사분원 넓이 − 정사각형 넓이'],ans:'정사각형 넓이 − 사분원 넓이',hint:'전체 네모에서 흰 부채꼴을 오려 내면 남는 부분이에요.',why:'맞아요! 전체 넓이에서 빈 부분을 빼면 돼요.'}
    ],
    firstGuide:[
      {id:'sfg1',tyNo:1,title:'유형 1 · 원의 둘레와 넓이',
        problem:'반지름의 길이가 <b>5 cm</b>인 원의 둘레(kπ cm)에서 k를 구하시오.',
        fig:()=>secFigS(5,null,360,{rLab:'5 cm'}),wantChips:['원 둘레의 π 앞 숫자 (k)','원의 넓이','중심각'],wantAns:'원 둘레의 π 앞 숫자 (k)',wantHl:[],
        givenChips:[{k:'r',t:'반지름 5 cm',ok:true},{k:'f',t:'둘레 = 지름 × π',ok:true},{k:'t',t:'중심각 60°',ok:false}],
        teacherEq:'지름 = 5 × 2 = 10 → 둘레 = 10π cm',pairQ:'둘레를 구할 때 반지름 5를 왜 먼저 2배 했나요?',
        pairChoices:['π는 지름을 둘레로 바꾸니까','넓이 공식을 쓰려고'],pairAns:'π는 지름을 둘레로 바꾸니까',
        calcPrompt:'지름 = 5 × 2 = ? (cm)',calcAns:10,calcTopic:'pi',calcExplain:'지름 10 cm → 둘레는 <b>10π cm</b>예요.'},
      {id:'sfg2',tyNo:2,title:'유형 2 · 부채꼴 호의 길이',
        problem:'반지름이 <b>6 cm</b>, 중심각이 <b>60°</b>인 부채꼴의 호의 길이(kπ cm)에서 k를 구하시오.',
        fig:()=>secFigS(6,null,60,{arcLab:'?π',rLab:'6 cm'}),wantChips:['부채꼴 호의 길이 (π 앞 숫자)','부채꼴 넓이','지름'],wantAns:'부채꼴 호의 길이 (π 앞 숫자)',wantHl:[],
        givenChips:[{k:'r',t:'반지름 6 cm (지름 12)',ok:true},{k:'a',t:'중심각 60° (1/6 조각)',ok:true},{k:'t',t:'높이 8 cm',ok:false}],
        teacherEq:'원 둘레 12π × (60/360) = 12π ÷ 6 = 2π',pairQ:'왜 원 둘레 12π를 <b>6</b>으로 나누었나요?',
        pairChoices:['360° ÷ 60° = 6조각 중 1개라서','반지름이 6 cm라서'],pairAns:'360° ÷ 60° = 6조각 중 1개라서',
        calcPrompt:'12 ÷ 6 = ? (π 앞 숫자)',calcAns:2,calcTopic:'frac',calcExplain:'12π ÷ 6 = <b>2π cm</b>예요.'},
      {id:'sfg3',tyNo:4,title:'유형 4 · 호의 길이로 부채꼴 넓이 구하기',
        problem:'반지름이 <b>5 cm</b>, 호의 길이가 <b>6π cm</b>인 부채꼴의 넓이(kπ cm²)에서 k를 구하시오.',
        fig:()=>secFigS(5,null,120,{arcLab:'6π cm',rLab:'5 cm'}),wantChips:['부채꼴 넓이 (π 앞 숫자)','중심각 크기','원 둘레'],wantAns:'부채꼴 넓이 (π 앞 숫자)',wantHl:[],
        givenChips:[{k:'r',t:'반지름 5 cm',ok:true},{k:'l',t:'호의 길이 6π cm',ok:true},{k:'t',t:'중심각 90°',ok:false}],
        teacherEq:'가로(호의 반 3π) × 세로(반지름 5) = 15π',pairQ:'식에서 <b>3π</b>는 어떻게 나온 수인가요?',
        pairChoices:['호의 길이 6π의 반','반지름 5의 반'],pairAns:'호의 길이 6π의 반',
        calcPrompt:'3 × 5 = ? (π 앞 숫자)',calcAns:15,calcTopic:'mul',calcExplain:'(호의 반 3π) × (반지름 5) = <b>15π cm²</b>예요.'}
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
        steps:[{t:'① 큰 부채꼴 넓이',hl:[],body:'64π ÷ 4 = <b>16π cm²</b>'},{t:'② 작은 부채꼴 넓이',hl:[],body:'16π ÷ 4 = <b>4π cm²</b>'},{t:'③ 빼기 (둘레는 직선도!)',hl:[],body:'16π − 4π = <b>12π cm²</b>'}],
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