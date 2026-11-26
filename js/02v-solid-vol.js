/* [T04] Ⅶ. 입체도형의 성질 — 5차시 area 유형 등록 + 6차시 volume · 7차시 conearea · 8차시 cone */
(()=>{
'use strict';
if(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS)){
  LESSONS.forEach(l=>{if(l.id==='volume'||l.id==='conearea'||l.id==='cone')l.ready=true});
}

const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',OK='#2b7a4b',RD='#b83a3a';
const MF="'Times New Roman',Times,serif";
const f1=n=>Math.round(n*10)/10;

const figSVG=(w,h,inner,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="cfig" role="img" aria-label="${lab||'입체도형'}" style="max-width:${w}px;width:100%;font-family:${MF}">${inner}</svg>`;

function pyrSVG(a,sH,hLab,opt={}){
  const cx=135,topY=30,bl=[62,168],br=[182,168],tr=[214,132],tl=[94,132];
  let g=`<polygon points="${bl} ${br} ${tr} ${tl}" fill="${BLs}" stroke="${INK}" stroke-width="2"/>`+
    `<polygon points="${bl} ${br} ${cx},${topY}" fill="${HLs}" fill-opacity="0.7" stroke="${INK}" stroke-width="2.2"/>`+
    `<polygon points="${br} ${tr} ${cx},${topY}" fill="#f7cf9c" fill-opacity="0.75" stroke="${INK}" stroke-width="2.2"/>`+
    `<line x1="${tl[0]}" y1="${tl[1]}" x2="${cx}" y2="${topY}" stroke="${INK}" stroke-width="1.4" stroke-dasharray="4 4"/>`+
    `<text x="${(bl[0]+br[0])/2}" y="188" text-anchor="middle" font-size="16" fill="${INK}">${a} cm</text>`+
    `<text x="${br[0]+22}" y="156" font-size="15" fill="${INK}">${a} cm</text>`;
  if(sH){
    const mx=(bl[0]+br[0])/2,my=bl[1];
    g+=`<line x1="${cx}" y1="${topY}" x2="${mx}" y2="${my}" stroke="${RD}" stroke-width="2.2" stroke-dasharray="5 3"/>`+
      `<text x="${mx-8}" y="${(topY+my)/2+6}" text-anchor="end" font-size="15" fill="${RD}">옆면 높이 ${sH} cm</text>`;
  }
  if(hLab){
    const ox=(bl[0]+tr[0])/2,oy=(bl[1]+tl[1])/2;
    g+=`<line x1="${cx}" y1="${topY}" x2="${ox}" y2="${oy}" stroke="${BL}" stroke-width="2.2" stroke-dasharray="5 3"/>`+
      `<text x="${ox+8}" y="${(topY+oy)/2}" font-size="15" fill="${BL}">높이 ${hLab} cm</text>`;
  }
  return figSVG(275,204,g,'정사각뿔');
}

function coneSVG(rad,h,l,opt={}){
  const cx=135,top=30,bot=168,rx=64,ry=16;
  let g=`<path d="M ${cx} ${top} L ${cx-rx} ${bot} A ${rx} ${ry} 0 0 0 ${cx+rx} ${bot} Z" fill="#eef3fb" stroke="${INK}" stroke-width="2.3"/>`+
    `<path d="M ${cx-rx} ${bot} A ${rx} ${ry} 0 0 1 ${cx+rx} ${bot}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="5 4"/>`+
    `<line x1="${cx}" y1="${bot}" x2="${cx+rx}" y2="${bot}" stroke="${BL}" stroke-width="2.2"/>`+
    `<text x="${cx+rx/2}" y="${bot-8}" text-anchor="middle" font-size="15" fill="${BL}">${rad} cm</text>`;
  if(l)g+=`<text x="${cx+rx*0.62}" y="${(top+bot)/2-6}" font-size="16" fill="${HL}">모선 ${l} cm</text>`;
  if(h)g+=`<line x1="${cx}" y1="${top}" x2="${cx}" y2="${bot}" stroke="${INK}" stroke-width="1.8" stroke-dasharray="5 3"/>`+
    `<text x="${cx-8}" y="${(top+bot)/2+4}" text-anchor="end" font-size="15" fill="${INK}">높이 ${h} cm</text>`;
  return figSVG(275,200,g,'원뿔');
}

function lShapePrismSVG(W,D,wCut,dCut,h){
  const g=`<polygon points="40,152 170,152 170,104 118,104 118,52 40,52" fill="${BLs}" stroke="${INK}" stroke-width="2.3"/>`+
    `<polygon points="118,52 148,30 70,30 40,52" fill="#dce7fb" stroke="${INK}" stroke-width="2"/>`+
    `<polygon points="118,52 148,30 148,82 118,104" fill="${HLs}" stroke="${INK}" stroke-width="2"/>`+
    `<polygon points="118,104 148,82 200,82 170,104" fill="#dce7fb" stroke="${INK}" stroke-width="2"/>`+
    `<polygon points="170,104 200,82 200,130 170,152" fill="#f7cf9c" stroke="${INK}" stroke-width="2"/>`+
    `<text x="105" y="172" text-anchor="middle" font-size="14" fill="${INK}">전체 ${W}×${D} (잘린 ${wCut}×${dCut}) cm · 높이 ${h} cm</text>`;
  return figSVG(255,188,g,'잘라 낸 L자 각기둥');
}

function hollowCylSVG(R,rr,h){
  const cx=135,top=44,bot=168,rx=68,ri=32;
  const g=`<path d="M ${cx-rx} ${top} L ${cx-rx} ${bot} A ${rx} 17 0 0 0 ${cx+rx} ${bot} L ${cx+rx} ${top} Z" fill="#eef3fb" stroke="${INK}" stroke-width="2.3"/>`+
    `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="17" fill="#dce7fb" stroke="${INK}" stroke-width="2"/>`+
    `<ellipse cx="${cx}" cy="${top}" rx="${ri}" ry="8" fill="#fff" stroke="${RD}" stroke-width="2"/>`+
    `<path d="M ${cx-ri} ${top} L ${cx-ri} ${bot-8} M ${cx+ri} ${top} L ${cx+ri} ${bot-8}" stroke="${RD}" stroke-width="1.4" stroke-dasharray="4 4"/>`+
    `<text x="${cx+rx+8}" y="${(top+bot)/2}" font-size="15" fill="${INK}">${h} cm</text>`+
    `<text x="${cx}" y="196" text-anchor="middle" font-size="14" fill="${BL}">바깥 반지름 ${R} cm · 안쪽 반지름 ${rr} cm</text>`;
  return figSVG(275,208,g,'구멍 뚫린 원기둥');
}

function frustConeSVG(R,rr,Hbig,Hcut){
  const cx=135,bot=176,mid=104,top=36,r1=64,r2=32;
  const g=`<polygon points="${cx},${top} ${cx-r2},${mid} ${cx+r2},${mid}" fill="none" stroke="${GY_()}" stroke-width="1.5" stroke-dasharray="4 4"/>`+
    `<path d="M ${cx-r2} ${mid} L ${cx-r1} ${bot} A ${r1} 16 0 0 0 ${cx+r1} ${bot} L ${cx+r2} ${mid} Z" fill="#eef3fb" stroke="${INK}" stroke-width="2.3"/>`+
    `<ellipse cx="${cx}" cy="${mid}" rx="${r2}" ry="9" fill="#f8fbff" stroke="${INK}" stroke-width="2"/>`+
    `<text x="${cx+r1+8}" y="${(top+bot)/2}" font-size="13" fill="${INK}">큰 높이 ${Hbig}</text>`+
    `<text x="${cx-r2-6}" y="${(top+mid)/2+4}" text-anchor="end" font-size="13" fill="${RD}">위 ${Hcut}</text>`+
    `<text x="${cx}" y="198" text-anchor="middle" font-size="14" fill="${BL}">아래 r=${R} cm · 위 r=${rr} cm</text>`;
  return figSVG(275,208,g,'원뿔대');
}
function GY_(){return'#94a3b8'}

/* ── 5차시 area 보강: PTYPES.area + 잘라 낸 기둥(area:comp) ── */
GEN.areaComp=seed=>{
  const r=mulberry(seed);
  const W=ri(r,6,9),D=ri(r,5,8),wCut=ri(r,2,W-3),dCut=ri(r,2,D-2),h=ri(r,3,6);
  const base=W*D-wCut*dCut,pm=2*(W+D),lat=pm*h,ans=2*base+lat;
  return{
    ptype:'area:comp',
    title:`큰 직육면체(${W}×${D} cm)의 한쪽 모서리에서 ${wCut}×${dCut} cm 부분을 잘라 낸 L자 기둥(높이 ${h} cm)의 <b>겉넓이</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${lShapePrismSVG(W,D,wCut,dCut,h)}</div>`},
    finalQ:'L자 기둥의 겉넓이는 몇 cm²인가요?',
    steps:[
      {tag:'밑넓이 (큰 직사각형 − 잘린 부분)',q:`밑면 L자 한 개의 넓이는? (${W}×${D} − ${wCut}×${dCut})`,type:'num',ans:base,suffix:'cm²',hint:`${W*D} − ${wCut*dCut}`},
      {tag:'옆면 둘레 (핵심 함정!)',q:`안쪽 꺾인 두 변을 바깥쪽으로 밀어 보면, 밑면의 <b>둘레</b>는 원래 직사각형과 같아요! 둘레는 몇 cm인가요?`,type:'num',ans:pm,suffix:'cm',hint:`2 × (${W} + ${D})`,ok:`모서리를 직각으로 잘라 내도 밑면의 둘레는 ${pm} cm로 그대로예요!`},
      {tag:'겉넓이 구하기',q:`밑넓이×2 + 옆넓이 = ${base}×2 + ${pm}×${h} = ?`,type:'num',ans:ans,suffix:'cm²',hint:`${2*base} + ${lat}`,ok:`${2*base} + ${lat} = ${ans} cm²`}
    ]
  };
};

if(typeof PTYPES==='object'&&!PTYPES.area){
  PTYPES.area=[
    {no:1,nm:'각기둥의 겉넓이',tb:'221~222쪽',key:'<b>밑넓이 × 2 + 옆넓이</b> · 옆넓이 = (밑면의 둘레) × (높이)',pt:['area:tri','area:box'],src:['areaStep']},
    {no:2,nm:'원기둥의 겉넓이',tb:'222쪽 2번',key:'밑면은 원(<b>반둘레 × 반지름</b>), 옆면 직사각형의 가로는 <b>지름 × π</b>!',pt:['area:cyl'],src:['areaStep']},
    {no:3,nm:'잘라 낸 L자 기둥의 겉넓이',tb:'226쪽 5번 · 자주 나오는 복합',key:'밑넓이는 빼고, 모서리를 직각으로 잘랐을 때 <b>옆면 둘레는 원래와 같다</b>는 점을 확인해요.',pt:['area:comp'],src:['areaComp']}
  ];
  PTYPES.area.forEach(T_=>{
    const g=tyKey('area',T_.no);
    GEN[g]=seed=>{
      const src=T_.src[seed%T_.src.length];
      for(let t=0;t<400;t++){const P=GEN[src](seed*31+t*7919);if(T_.pt.includes(P.ptype))return P}
      return GEN[T_.src[0]](seed);
    };
    LESSON_OF[g]='area';
  });
  GEN.mix_area=seed=>{const L=PTYPES.area;return GEN[tyKey('area',L[seed%L.length].no)](Math.floor(seed/L.length)+1)};
  LESSON_OF.mix_area='area';
  LESSON_OF.areaComp='area';
  Object.assign(PTYPE_NM,{'area:comp':'5차시 · 잘라 낸 기둥 겉넓이'});
}

/* ── 미리 보기 · 개념 카드 · 개념 · 퀴즈 (6·7·8차시) ── */
if(typeof PREVIEW==='object'){
  PREVIEW.volume={tb:'223~225쪽',
    core:[
      {h:'기둥의 부피',b:'각기둥과 원기둥 모두 <b>(밑넓이) × (높이)</b>!'},
      {h:'원기둥의 부피',b:'밑넓이(반둘레 × 반지름 = <span class="rm">r²π</span>) × 높이'},
      {h:'겉넓이와 구별',b:'겉넓이는 껍데기 넓이(cm²), 부피는 속 채우기(cm³)'}
    ],
    words:['기둥의 부피','밑넓이','높이','cm³'],
    ex:'밑넓이 12 cm², 높이 5 cm인 삼각기둥의 부피 → 12 × 5 = <b>60 cm³</b>'};
  PREVIEW.conearea={tb:'227~228쪽',
    core:[
      {h:'뿔은 밑면이 1개!',b:'<b>(밑넓이) + (옆넓이)</b> · 기둥처럼 밑넓이에 ×2 하지 않아요.'},
      {h:'원뿔의 옆넓이',b:'옆면 부채꼴의 호 = 밑면 둘레(<b>지름 × π</b>)<br>옆넓이 = <b>(호의 반) × (모선)</b> = <span class="rm">r l π</span>'},
      {h:'모선 vs 높이',b:'겉넓이에는 기울어진 옆면 길이인 <b>모선</b>을 써요!'}
    ],
    words:['뿔의 겉넓이','모선','전개도','원뿔의 전개도'],
    ex:'밑면 반지름 3 cm, 모선 5 cm 원뿔 → 밑넓이 9π + 옆넓이 (3π×5) = <b>24π cm²</b>'};
  PREVIEW.cone={tb:'229~231쪽',
    core:[
      {h:'기둥의 ⅓!',b:'밑면과 높이가 같은 기둥 그릇에 뿔로 물 <b>3번</b> 부으면 가득 차요.'},
      {h:'공식',b:'<b>(뿔의 부피) = (밑넓이) × (높이) ÷ 3</b>'},
      {h:'뿔대의 부피',b:'<b>(큰 뿔의 부피) − (잘라 낸 작은 뿔의 부피)</b>'}
    ],
    words:['뿔의 부피','원뿔대의 부피','⅓'],
    ex:'밑넓이 15 cm², 높이 4 cm인 사각뿔 → 15 × 4 ÷ 3 = <b>20 cm³</b>'};
}

if(typeof PV_CARDS==='object'){
  PV_CARDS.volume=[
    {h:'기둥의 부피 = 밑넓이 × 높이',t:'직육면체·삼각기둥·원기둥 모두 바닥(<b>밑넓이</b>)을 높이만큼 층층이 쌓아요.',
      figs:()=>[[TYPE.prism.mk(4),'base1','사각기둥'],[TYPE.prism.mk(3),'base1','삼각기둥'],[SOLIDS.cyl.mk(),'base1','원기둥']]},
    {h:'구멍 뚫린 기둥의 부피',t:'가운데가 비어 있으면 <b>(바깥 밑넓이 − 안쪽 밑넓이) × 높이</b>로 구해요.',
      figs:()=>[[hollowCylSVG(5,2,6),null,'구멍 뚫린 원기둥'],[lShapePrismSVG(7,6,3,2,4),null,'잘라 낸 기둥']]},
    {h:'부피와 겉넓이 구별하기',t:'부피는 <b>세제곱센티미터(cm³)</b>, 겉넓이는 <b>제곱센티미터(cm²)</b>예요.',
      figs:()=>[[TYPE.prism.mk(4),'all','겉넓이 = 모든 면의 합'],[TYPE.prism.mk(4),'base1','부피 = 밑넓이 × 높이']]}
  ];
  PV_CARDS.conearea=[
    {h:'뿔의 겉넓이 = 밑넓이 + 옆넓이',t:'뿔은 밑면이 <b>딱 1개</b>! 각뿔의 옆면은 모두 <b>삼각형(÷ 2)</b>이에요.',
      figs:()=>[[pyrSVG(6,5,null),null,'정사각뿔: 밑면 1 + 삼각형 4'],[TYPE.pyramid.mk(4),'all','사각뿔']]},
    {h:'원뿔 전개도와 옆넓이',t:'옆면 부채꼴의 호의 길이는 <b>밑면의 둘레(지름×π)</b>! 옆넓이 = <b>(호의 반) × (모선)</b>.',
      figs:()=>[[coneSVG(3,null,5),null,'밑면 r=3, 모선 l=5'],[coneSVG(4,3,5),null,'높이 3 말고 모선 5 쓰기!']]},
    {h:'뿔대의 겉넓이',t:'뿔대는 위아래 밑면이 <b>2개</b>(크기 다름) + 옆면은 <b>사다리꼴</b> 또는 큰 부채꼴 − 작은 부채꼴.',
      figs:()=>[[frustConeSVG(6,3,8,4),null,'원뿔대'],[TYPE.frustum.mk(4),'all','사각뿔대']]}
  ];
  PV_CARDS.cone=[
    {h:'뿔의 부피 = 기둥 부피 ÷ 3',t:'밑면과 높이가 같은 기둥 그릇에 뿔로 물을 <b>3번</b> 부어야 가득 차요.',
      figs:()=>[[pyrSVG(6,null,5),null,'사각뿔: 밑넓이 × 높이 ÷ 3'],[coneSVG(3,4,null),null,'원뿔: r²π × 높이 ÷ 3']]},
    {h:'뿔의 부피는 모선 말고 높이!',t:'부피를 구할 때는 꼭대기에서 밑면에 <b>수직으로 내린 높이</b>를 써요.',
      figs:()=>[[coneSVG(3,4,5),null,'높이 4 사용 (모선 5 ✕)'],[TYPE.pyramid.mk(4),'base','밑면 × 높이 ÷ 3']]},
    {h:'뿔대의 부피 = 큰 뿔 − 작은 뿔',t:'잘리기 전 <b>전체 큰 뿔</b>에서 잘라 낸 <b>위쪽 작은 뿔</b>의 부피를 빼요.',
      figs:()=>[[frustConeSVG(6,3,8,4),null,'큰 원뿔 − 작은 원뿔'],[TYPE.frustum.mk(4),'all','사각뿔대 부피']]}
  ];
}

if(typeof CONCEPT==='object'){
  CONCEPT.volume=body=>{
    body.innerHTML=foldPanel('기둥의 부피',`<p class="lead">각기둥이든 원기둥이든 부피는 똑같이 <b>(밑넓이) × (높이)</b>예요.</p>`,
      fold(1,'기둥의 부피 공식','밑넓이 × 높이',`<div class="figbox">${lShapePrismSVG(7,6,3,2,4)}</div><p>1층에 1 cm³ 블록이 (밑넓이)개 놓이고, 그것을 (높이)층 쌓았으니 <b>부피 = 밑넓이 × 높이</b>예요.<br>원기둥의 밑넓이는 직사각형 생각(<b>반둘레 × 반지름 = r²π</b>)으로 구한 뒤 높이를 곱해요.</p>`,true)+
      fold(2,'구멍이 뚫리거나 잘린 기둥','밑넓이 먼저 빼고 × 높이',`<div class="figbox">${hollowCylSVG(5,2,6)}</div><p>기둥 전체가 똑같이 뚫렸거나 잘렸다면 <b>(남은 밑넓이) × (높이)</b>로 한 번에 구하거나, <b>큰 기둥 부피 − 작은 기둥 부피</b>로 구해요.</p>`));
    wireFolds(body,'volume');
  };
  CONCEPT.conearea=body=>{
    body.innerHTML=foldPanel('뿔의 겉넓이',`<p class="lead">뿔은 밑면이 <b>1개뿐</b>이에요! <b>(겉넓이) = (밑넓이) + (옆넓이)</b></p>`,
      fold(1,'각뿔의 겉넓이','밑면 1개 + 삼각형 옆면',`<div class="figbox">${pyrSVG(6,5,null)}</div><p>정사각뿔은 밑면 정사각형 1개와 합동인 이등변삼각형 4개로 이루어져 있어요. 삼각형 넓이 구할 때 <b>÷ 2</b>를 잊지 마세요.</p>`,true)+
      fold(2,'원뿔의 겉넓이','호의 길이 = 지름 × π · 옆넓이 = 호의 반 × 모선',`<div class="figbox">${coneSVG(3,4,5)}</div><p>원뿔 전개도를 펼치면 밑면은 원, 옆면은 반지름이 <b>모선</b>인 부채꼴이에요.<br>옆면 부채꼴의 호의 길이 = 밑면의 둘레 = <b>지름 × π</b>.<br>따라서 <b>옆넓이 = (호의 반) × (모선)</b> = (반지름 × π) × 모선이에요.</p>`));
    wireFolds(body,'conearea');
  };
  CONCEPT.cone=body=>{
    body.innerHTML=foldPanel('뿔의 부피',`<p class="lead">밑면과 높이가 같은 기둥의 딱 <b>⅓</b>! <b>(뿔의 부피) = (밑넓이) × (높이) ÷ 3</b></p>`,
      fold(1,'왜 ÷ 3 일까?','물 3번 붓기',`<div class="figbox">${coneSVG(3,4,5)}</div><p>같은 밑면, 같은 높이를 가진 뿔 모양 그릇으로 기둥 그릇에 물을 부으면 꼭 <b>3번</b> 만에 가득 차요.<br>그래서 각뿔·원뿔 모두 <b>기둥 부피를 구한 뒤 ÷ 3</b>을 해요.</p>`,true)+
      fold(2,'뿔대의 부피','큰 뿔 − 작은 뿔',`<div class="figbox">${frustConeSVG(6,3,8,4)}</div><p>각뿔대나 원뿔대의 부피는 잘려 나간 위쪽 작은 뿔을 되살려서 <b>(큰 뿔의 부피) − (작은 뿔의 부피)</b>로 구해요.</p>`));
    wireFolds(body,'cone');
  };
}

Object.assign(window.CONCEPT_QUIZ=window.CONCEPT_QUIZ||{},{
  volume:[
    {q:'밑넓이가 14 cm²이고 높이가 5 cm인 각기둥의 부피는?',choices:['70 cm³','19 cm³','38 cm³','35 cm³'],ans:'70 cm³',hint:'기둥의 부피 = 밑넓이 × 높이예요.',ok:'14 × 5 = 70 cm³예요.'},
    {q:'밑면의 반지름이 4 cm, 높이가 5 cm인 원기둥의 부피는?',choices:['80π cm³','40π cm³','20π cm³','16π cm³'],ans:'80π cm³',hint:'원 넓이(16π) × 높이(5)를 계산해요.',ok:'16π × 5 = 80π cm³예요.'},
    {q:'부피가 120 cm³이고 밑넓이가 15 cm²인 사각기둥의 높이는?',choices:['8 cm','6 cm','10 cm','15 cm'],ans:'8 cm',hint:'부피 ÷ 밑넓이 = 높이예요.',ok:'120 ÷ 15 = 8 cm예요.'}
  ],
  conearea:[
    {q:'뿔의 겉넓이를 구할 때 밑넓이는 몇 번 더하나요?',choices:['1번','2번','3번','4번'],ans:'1번',hint:'기둥과 달리 뿔은 아래에만 밑면이 있어요.',ok:'뿔은 밑면이 1개이므로 밑넓이도 1번만 더해요.'},
    {q:'원뿔 전개도에서 옆면 부채꼴의 호의 길이는 무엇과 같나요?',choices:['밑면의 둘레','모선의 길이','원뿔의 높이','밑면의 넓이'],ans:'밑면의 둘레',hint:'접었을 때 밑면 원을 감싸는 테두리예요.',ok:'부채꼴의 호 = 밑면 원의 둘레(지름 × π)예요.'},
    {q:'밑면 반지름 3 cm, 모선 6 cm인 원뿔의 옆넓이는?',choices:['18π cm²','36π cm²','9π cm²','12π cm²'],ans:'18π cm²',hint:'호 6π의 반(= 3π) × 모선(6)을 계산해요.',ok:'호의 반(3π) × 모선(6) = 18π cm²예요.'}
  ],
  cone:[
    {q:'밑넓이와 높이가 같은 원뿔의 부피는 원기둥 부피의 몇 분의 몇인가요?',choices:['1/3','1/2','1/4','2/3'],ans:'1/3',hint:'원뿔 그릇으로 물을 몇 번 부으면 원기둥이 가득 차는지 떠올려 보세요.',ok:'뿔의 부피는 같은 기둥의 1/3이에요.'},
    {q:'밑넓이가 18 cm², 높이가 5 cm인 사각뿔의 부피는?',choices:['30 cm³','90 cm³','45 cm³','15 cm³'],ans:'30 cm³',hint:'18 × 5를 계산한 뒤 ÷ 3을 꼭 해요.',ok:'18 × 5 ÷ 3 = 30 cm³예요.'},
    {q:'원뿔대의 부피를 구하는 바른 방법은?',choices:['큰 원뿔 부피 − 작은 원뿔 부피','큰 원뿔 부피 + 작은 원뿔 부피','밑넓이 × 높이','작은 원뿔 부피 ÷ 3'],ans:'큰 원뿔 부피 − 작은 원뿔 부피',hint:'원뿔에서 위쪽 작은 원뿔을 잘라 내고 남은 도형이에요.',ok:'전체 큰 뿔에서 잘린 작은 뿔을 빼요.'}
  ]
});

/* ── 탐구 활동 ── */
if(typeof EXPLORE==='object'){
  EXPLORE.volume=body=>{
    let rad=3,h=5;
    const draw=()=>{
      body.innerHTML=`<div class="card panel"><h2 style="margin-top:0">원기둥 부피 쌓아 보기</h2>
        <div class="explore"><div class="stage" style="padding:12px">${coneSVG(rad,h,null).replace('원뿔','원기둥')}</div>
        <div class="ctrl"><label class="cap">밑면 반지름: ${rad} cm (밑넓이 ${rad*rad}π cm²)</label>
          <input type="range" min="2" max="6" value="${rad}" id="vRad">
          <label class="cap">높이: ${h} cm</label><input type="range" min="2" max="10" value="${h}" id="vH">
          <div class="feedback ok">부피 = <b>${rad*rad}π × ${h} = ${rad*rad*h}π cm³</b></div>
        </div></div></div>`;
      $('#vRad',body).oninput=e=>{rad=+e.target.value;if(typeof award==='function')award(2,'vol:exp','부피 변화를 탐구했어요');draw()};
      $('#vH',body).oninput=e=>{h=+e.target.value;draw()};
    };draw();
  };
  EXPLORE.conearea=body=>{
    const pairs=[[2,6],[3,6],[3,9],[4,8],[5,10]];let idx=0;
    const draw=()=>{
      const [rr,l]=pairs[idx],ang=360*rr/l;
      body.innerHTML=`<div class="card panel"><h2 style="margin-top:0">원뿔 전개도 · 밑면 둘레와 옆면 호</h2>
        <div class="explore"><div class="stage" style="padding:12px">${coneSVG(rr,null,l)}</div>
        <div class="ctrl"><div class="chips">${pairs.map((x,i)=>`<button type="button" class="chip${i===idx?' on':''}" data-i="${i}">r=${x[0]}, 모선=${x[1]}</button>`).join('')}</div>
          <div class="box">밑면 둘레 = <b>${2*rr}π cm</b> · 모선 큰 원 둘레 = <b>${2*l}π cm</b><br>부채꼴 중심각 = 360° × (${rr}/${l}) = <b>${ang}°</b><br>옆넓이 = (호의 반 ${rr}π) × (모선 ${l}) = <b>${rr*l}π cm²</b></div>
        </div></div></div>`;
      $$('[data-i]',body).forEach(b=>b.onclick=()=>{idx=+b.dataset.i;if(typeof award==='function')award(2,'ca:exp','원뿔 전개도를 탐구했어요');draw()});
    };draw();
  };
  EXPLORE.cone=body=>{
    let cnt=1;
    const draw=()=>{
      body.innerHTML=`<div class="card panel"><h2 style="margin-top:0">기둥 그릇에 뿔로 물 채우기</h2>
        <div class="ctrl"><p>밑면과 높이가 같은 원기둥에 원뿔 그릇으로 물을 부어 보세요.</p>
          <div class="ct-hit-row">${[1,2,3].map(k=>`<button type="button" class="ct-hit${cnt===k?' sel':''}" data-k="${k}">${k}번 붓기 (${k}/3)</button>`).join('')}</div>
          <div class="feedback ${cnt===3?'ok':'info'}">${cnt===3?'딱 <b>3번</b> 만에 원기둥이 가득 찼어요! 그래서 뿔의 부피 = <b>기둥 ÷ 3</b>이에요.':`지금 원기둥의 ${cnt}/3만큼 찼어요. 더 부어 보세요!`}</div>
        </div></div>`;
      $$('[data-k]',body).forEach(b=>b.onclick=()=>{cnt=+b.dataset.k;if(cnt===3&&typeof award==='function')award(3,'cone:pour','뿔 부피 1/3 실험을 마쳤어요');draw()});
    };draw();
  };
}

/* ── 6차시 volume 생성기 ── */
GEN.volPrism=seed=>{
  const r=mulberry(seed);
  const tp=pick(r,['box','tri','trap']);
  if(tp==='box'){
    const a=ri(r,3,9),b=ri(r,2,7),h=ri(r,3,10),B=a*b,V=B*h;
    const m=prism([[0,0],[a,0],[a,b],[0,b]],h);
    return{ptype:'volume:prism',title:`가로 ${a} cm, 세로 ${b} cm, 높이 ${h} cm인 직육면체의 <b>부피</b>를 구하시오.`,
      fig:{mesh:m,yaw:-0.5,pitch:0.4,pad:0.36,labels:[[[0,0,0],[a,0,0],a+' cm'],[[a,0,0],[a,b,0],b+' cm'],[[a,0,0],[a,0,h],h+' cm']]},
      finalQ:'직육면체의 부피는 몇 cm³인가요?',steps:[
        {tag:'밑넓이 구하기',hl:'base1',q:'밑넓이는 몇 cm²인가요?',type:'num',ans:B,suffix:'cm²',hint:`${a} × ${b}`},
        {tag:'밑넓이 × 높이',hl:'all',q:`부피 = 밑넓이 ${B} × 높이 ${h} = ?`,type:'num',ans:V,suffix:'cm³',hint:`${B} × ${h}`,ok:`${B} × ${h} = ${V} cm³`}
      ]};
  }
  if(tp==='tri'){
    const a=ri(r,3,8),b=ri(r,3,8);if((a*b)%2)return GEN.volPrism(seed+1);
    const h=ri(r,3,10),B=a*b/2,V=B*h,m=prism([[0,0],[a,0],[0,b]],h);
    return{ptype:'volume:prism',title:`밑면이 두 변 ${a} cm, ${b} cm를 낀 직각삼각형이고 높이가 ${h} cm인 삼각기둥의 <b>부피</b>를 구하시오.`,
      fig:{mesh:m,yaw:0.55,pitch:0.45,pad:0.36,labels:[[[0,0,0],[a,0,0],a+' cm'],[[0,0,0],[0,b,0],b+' cm'],[[a,0,0],[a,0,h],h+' cm']]},
      finalQ:'삼각기둥의 부피는 몇 cm³인가요?',steps:[
        {tag:'삼각형 밑넓이 (÷ 2)',hl:'base1',q:`직각삼각형 밑넓이는? (${a} × ${b} ÷ 2)`,type:'num',ans:B,suffix:'cm²',hint:`${a} × ${b} ÷ 2`},
        {tag:'밑넓이 × 높이',hl:'all',q:`부피 = ${B} × ${h} = ?`,type:'num',ans:V,suffix:'cm³',hint:`${B} × ${h}`,ok:`${B} × ${h} = ${V} cm³`}
      ]};
  }
  const u=ri(r,3,6),d=u+ri(r,2,5),k=ri(r,3,6);
  const trapH=((u+d)*k)%2===0?k:k*2,B=(u+d)*trapH/2,h=ri(r,3,8),V=B*h;
  return{ptype:'volume:prism',title:`밑면이 윗변 ${u} cm, 아랫변 ${d} cm, 높이 ${trapH} cm인 사다리꼴이고, 높이가 ${h} cm인 사각기둥의 <b>부피</b>를 구하시오.`,
    fig:null,finalQ:'부피는 몇 cm³인가요?',steps:[
      {tag:'사다리꼴 밑넓이',q:`밑면 사다리꼴 넓이는? ((${u}+${d}) × ${trapH} ÷ 2)`,type:'num',ans:B,suffix:'cm²',hint:`${u+d} × ${trapH} ÷ 2`},
      {tag:'밑넓이 × 높이',q:`부피 = ${B} × ${h} = ?`,type:'num',ans:V,suffix:'cm³',hint:`${B} × ${h}`,ok:`${B} × ${h} = ${V} cm³`}
    ]};
};

GEN.volCyl=seed=>{
  const r=mulberry(seed),rr=ri(r,2,7),h=ri(r,3,10),B=rr*rr,V=B*h;
  const m=prism(regPoly(64,rr),h,true);
  return{ptype:'volume:cyl',title:`밑면의 반지름이 ${rr} cm이고 높이가 ${h} cm인 원기둥의 <b>부피</b>를 구하시오.`,
    fig:{mesh:m,yaw:0,pitch:0.35,pad:0.35,after:(ctx,v)=>cylLabels(ctx,v,rr,h)},
    finalQ:'원기둥의 부피는 몇 cm³인가요?',steps:[
      {tag:'원 밑넓이 (반둘레 × 반지름)',hl:'base1',q:`반지름 ${rr} cm인 원의 넓이는? (${rr}π × ${rr})`,type:'pi',ans:B,suffix:'cm²',hint:`${rr} × ${rr}에 π를 붙여요.`},
      {tag:'밑넓이 × 높이',hl:'all',q:`부피 = ${B}π × ${h} = ?`,type:'pi',ans:V,suffix:'cm³',hint:`${B} × ${h}에 π를 붙여요.`,ok:`${B}π × ${h} = ${V}π cm³`}
    ]};
};

GEN.volInv=seed=>{
  const r=mulberry(seed);
  if(r()<0.5){
    const rr=ri(r,2,6),h=ri(r,3,12),B=rr*rr,V=B*h;
    return{ptype:'volume:inv',title:`밑면의 반지름이 ${rr} cm인 원기둥의 부피가 <b>${V}π cm³</b>일 때, 이 원기둥의 <b>높이</b>를 구하시오.`,
      fig:{svg:()=>`<div class="figbox">${coneSVG(rr,'? cm',null).replace('원뿔','원기둥')}</div>`},
      finalQ:'원기둥의 높이는 몇 cm인가요?',steps:[
        {tag:'밑넓이 구하기',q:`밑넓이(${rr}π × ${rr})는 몇 cm²인가요?`,type:'pi',ans:B,suffix:'cm²',hint:`${rr} × ${rr}π`},
        {tag:'부피 ÷ 밑넓이 = 높이',q:`높이는? (${V}π ÷ ${B}π)`,type:'num',ans:h,suffix:'cm',hint:`${V} ÷ ${B}`,ok:`높이는 ${h} cm예요.`}
      ]};
  }
  const a=ri(r,3,7),b=ri(r,2,6),h=ri(r,3,10),B=a*b,V=B*h;
  return{ptype:'volume:inv',title:`밑면이 가로 ${a} cm, 세로 ${b} cm인 직사각형이고 부피가 <b>${V} cm³</b>인 사각기둥의 <b>높이</b>를 구하시오.`,
    fig:null,finalQ:'높이는 몇 cm인가요?',steps:[
      {tag:'밑넓이 구하기',q:`밑넓이(${a} × ${b})는 몇 cm²인가요?`,type:'num',ans:B,suffix:'cm²',hint:`${a} × ${b}`},
      {tag:'부피 ÷ 밑넓이',q:`높이는? (${V} ÷ ${B})`,type:'num',ans:h,suffix:'cm',hint:`${V} ÷ ${B}`,ok:`높이는 ${h} cm예요.`}
    ]};
};

GEN.volComp=seed=>{
  const r=mulberry(seed);
  if(r()<0.5){
    const R=ri(r,4,7),rr=ri(r,1,R-2),h=ri(r,3,8),B=R*R-rr*rr,V=B*h;
    return{ptype:'volume:comp',title:`밑면의 반지름이 ${R} cm인 원기둥 가운데에 반지름이 ${rr} cm인 원기둥 구멍을 뚫었어요. 높이가 ${h} cm일 때 남은 입체의 <b>부피</b>를 구하시오.`,
      fig:{svg:()=>`<div class="figbox">${hollowCylSVG(R,rr,h)}</div>`},
      finalQ:'남은 입체의 부피는 몇 cm³인가요?',steps:[
        {tag:'남은 밑넓이 구하기',q:`도넛 모양 밑넓이 = ${R*R}π − ${rr*rr}π = ?`,type:'pi',ans:B,suffix:'cm²',hint:`${R*R} − ${rr*rr}`},
        {tag:'남은 밑넓이 × 높이',q:`부피 = ${B}π × ${h} = ?`,type:'pi',ans:V,suffix:'cm³',hint:`${B} × ${h}`,ok:`${B}π × ${h} = ${V}π cm³`}
      ]};
  }
  const W=ri(r,6,9),D=ri(r,5,8),wCut=ri(r,2,W-3),dCut=ri(r,2,D-2),h=ri(r,3,6),B=W*D-wCut*dCut,V=B*h;
  return{ptype:'volume:comp',title:`가로 ${W} cm, 세로 ${D} cm, 높이 ${h} cm 직육면체에서 한쪽(${wCut}×${dCut} cm)을 아래까지 잘라 낸 기둥의 <b>부피</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${lShapePrismSVG(W,D,wCut,dCut,h)}</div>`},
    finalQ:'남은 입체의 부피는 몇 cm³인가요?',steps:[
      {tag:'남은 밑넓이 구하기',q:`(${W}×${D}) − (${wCut}×${dCut}) = ?`,type:'num',ans:B,suffix:'cm²',hint:`${W*D} − ${wCut*dCut}`},
      {tag:'부피 = 밑넓이 × 높이',q:`${B} × ${h} = ?`,type:'num',ans:V,suffix:'cm³',hint:`${B} × ${h}`,ok:`${B} × ${h} = ${V} cm³`}
    ]};
};

GEN.volume=seed=>[GEN.volPrism,GEN.volCyl,GEN.volInv,GEN.volComp][seed%4](seed);
GEN.volumeStep=seed=>GEN.volCyl(seed);

/* ── 7차시 conearea 생성기 ── */
GEN.conePyrArea=seed=>{
  const r=mulberry(seed),a=ri(r,4,10),sh=ri(r,3,9);
  const validSh=(a*sh)%2===0?sh:sh+1;
  const B=a*a,tri=a*validSh/2,side=tri*4,S=B+side;
  return{ptype:'conearea:pyr',title:`밑면이 한 변 ${a} cm인 정사각형이고 옆면 삼각형의 높이가 ${validSh} cm인 정사각뿔의 <b>겉넓이</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${pyrSVG(a,validSh,null)}</div>`},
    finalQ:'정사각뿔의 겉넓이는 몇 cm²인가요?',steps:[
      {tag:'밑넓이 (1개만!)',q:`밑면 정사각형 넓이는?`,type:'num',ans:B,suffix:'cm²',hint:`${a} × ${a}`},
      {tag:'삼각형 1개의 넓이 (÷ 2)',q:`옆면 삼각형 1개의 넓이는? (${a} × ${validSh} ÷ 2)`,type:'num',ans:tri,suffix:'cm²',hint:`${a} × ${validSh} ÷ 2`},
      {tag:'옆넓이 (삼각형 × 4)',q:`옆면 4개를 모두 더한 옆넓이는?`,type:'num',ans:side,suffix:'cm²',hint:`${tri} × 4`},
      {tag:'겉넓이 = 밑넓이 + 옆넓이',q:`${B} + ${side} = ?`,type:'num',ans:S,suffix:'cm²',hint:`밑면은 1개뿐이에요! ${B} + ${side}`,ok:`${B} + ${side} = ${S} cm²`}
    ]};
};

GEN.coneSideArea=seed=>{
  const r=mulberry(seed),rr=ri(r,2,8),l=ri(r,rr+2,13),B=rr*rr,lat=rr*l,S=B+lat;
  return{ptype:'conearea:cone',title:`밑면의 반지름이 ${rr} cm이고 모선의 길이가 ${l} cm인 원뿔의 <b>겉넓이</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${coneSVG(rr,null,l)}</div>`},
    finalQ:'원뿔의 겉넓이는 몇 cm²인가요?',steps:[
      {tag:'밑넓이 (원 1개)',q:`밑면 원의 넓이는? (${rr}π × ${rr})`,type:'pi',ans:B,suffix:'cm²',hint:`${rr} × ${rr}π`},
      {tag:'옆넓이 = (호의 반) × 모선',q:`호의 길이가 밑면 둘레 ${2*rr}π cm이므로 호의 반은 ${rr}π cm예요. 옆넓이(${rr}π × ${l})는?`,type:'pi',ans:lat,suffix:'cm²',hint:`${rr} × ${l}에 π를 붙여요.`},
      {tag:'겉넓이 = 밑넓이 + 옆넓이',q:`${B}π + ${lat}π = ?`,type:'pi',ans:S,suffix:'cm²',hint:`${B} + ${lat}에 π를 붙여요.`,ok:`${B}π + ${lat}π = ${S}π cm²`}
    ]};
};

GEN.coneAng=seed=>{
  const r=mulberry(seed);
  const pairs=[[2,6],[2,8],[2,12],[3,6],[3,9],[3,12],[4,8],[4,12],[5,10],[5,15],[6,9],[6,12],[6,15]];
  const [rr,l]=pick(r,pairs),ang=Math.round(360*rr/l);
  return{ptype:'conearea:ang',title:`밑면의 반지름이 ${rr} cm이고 모선의 길이가 ${l} cm인 원뿔의 전개도에서 <b>옆면 부채꼴의 중심각의 크기</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${coneSVG(rr,null,l)}</div>`},
    finalQ:'부채꼴의 중심각은 몇 도인가요?',steps:[
      {tag:'호의 길이 (= 밑면 둘레)',q:`옆면 부채꼴의 호의 길이는? (지름 ${2*rr} × π)`,type:'pi',ans:2*rr,suffix:'cm',hint:`${2*rr}π`},
      {tag:'중심각 구하기',q:`반지름이 모선(${l} cm)인 큰 원 둘레(${2*l}π) 중 호(${2*rr}π)의 비율만큼 360°를 나눠요: 360 × (${rr}/${l}) = ?`,type:'num',ans:ang,suffix:'°',hint:`360 × ${rr} ÷ ${l}`,ok:`360° × (${rr}/${l}) = ${ang}°`}
    ]};
};

GEN.coneFrustArea=seed=>{
  const r=mulberry(seed);
  if(r()<0.5){
    const a=ri(r,2,5),b=a+ri(r,2,5),sh=ri(r,3,7);
    const validSh=((a+b)*sh)%2===0?sh:sh+1;
    const B1=a*a,B2=b*b,trap=(a+b)*validSh/2,S=B1+B2+4*trap;
    return{ptype:'conearea:frust',title:`두 밑면이 한 변 ${a} cm, ${b} cm인 정사각형이고 옆면 사다리꼴의 높이가 ${validSh} cm인 <b>정사각뿔대</b>의 <b>겉넓이</b>를 구하시오.`,
      fig:null,finalQ:'정사각뿔대의 겉넓이는 몇 cm²인가요?',steps:[
        {tag:'두 밑넓이의 합',q:`위(${a}×${a}) + 아래(${b}×${b}) = ?`,type:'num',ans:B1+B2,suffix:'cm²',hint:`${B1} + ${B2}`},
        {tag:'사다리꼴 1개의 넓이',q:`옆면 사다리꼴 1개 넓이는? ((${a}+${b}) × ${validSh} ÷ 2)`,type:'num',ans:trap,suffix:'cm²',hint:`${a+b} × ${validSh} ÷ 2`},
        {tag:'겉넓이 = 두 밑넓이 + 옆면 4개',q:`${B1+B2} + ${trap} × 4 = ?`,type:'num',ans:S,suffix:'cm²',hint:`${B1+B2} + ${4*trap}`,ok:`${B1+B2} + ${4*trap} = ${S} cm²`}
      ]};
  }
  const [R,rr,lBig,lCut]=pick(r,[[6,3,10,5],[8,4,12,6],[6,2,9,3],[9,3,12,4],[4,2,10,5]]);
  const B=R*R+rr*rr,L=R*lBig-rr*lCut,S=B+L;
  return{ptype:'conearea:frust',title:`원뿔대의 두 밑면 반지름이 ${R} cm, ${rr} cm이고, 자르기 전 큰 원뿔의 모선 ${lBig} cm에서 작은 원뿔의 모선 ${lCut} cm를 잘라 내었어요. 이 <b>원뿔대의 겉넓이</b>를 구하시오.`,
    fig:null,finalQ:'원뿔대의 겉넓이는 몇 cm²인가요?',steps:[
      {tag:'두 밑넓이 합',q:`큰 밑면(${R*R}π) + 작은 밑면(${rr*rr}π) = ?`,type:'pi',ans:B,suffix:'cm²',hint:`${R*R} + ${rr*rr}π`},
      {tag:'옆넓이 (큰 부채꼴 − 작은 부채꼴)',q:`큰 옆넓이(${R*lBig}π) − 작은 옆넓이(${rr*lCut}π) = ?`,type:'pi',ans:L,suffix:'cm²',hint:`${R*lBig} − ${rr*lCut}π`},
      {tag:'전체 겉넓이',q:`${B}π + ${L}π = ?`,type:'pi',ans:S,suffix:'cm²',hint:`${B} + ${L}π`,ok:`${B}π + ${L}π = ${S}π cm²`}
    ]};
};

GEN.conearea=seed=>[GEN.conePyrArea,GEN.coneSideArea,GEN.coneAng,GEN.coneFrustArea][seed%4](seed);
GEN.coneareaStep=seed=>GEN.coneSideArea(seed);

/* ── 8차시 cone 생성기 ── */
GEN.conePyrVol=seed=>{
  const r=mulberry(seed);
  const a=pick(r,[3,4,6,5,9]),b=ri(r,3,8),h=pick(r,[3,6,9,4,5]);
  const validH=(a*b*h)%3===0?h:3;
  const B=a*b,V=B*validH/3;
  return{ptype:'cone:pyr',title:`밑면이 가로 ${a} cm, 세로 ${b} cm인 직사각형이고 높이가 ${validH} cm인 사각뿔의 <b>부피</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${pyrSVG(a,null,validH)}</div>`},
    finalQ:'사각뿔의 부피는 몇 cm³인가요?',steps:[
      {tag:'밑넓이 구하기',q:`밑면 직사각형의 넓이는? (${a} × ${b})`,type:'num',ans:B,suffix:'cm²',hint:`${a} × ${b}`},
      {tag:'기둥 부피 ÷ 3',q:`뿔의 부피 = ${B} × ${validH} ÷ 3 = ?`,type:'num',ans:V,suffix:'cm³',hint:`${B*validH} ÷ 3 (÷ 3을 꼭 해요!)`,ok:`${B} × ${validH} ÷ 3 = ${V} cm³`}
    ]};
};

GEN.coneVol=seed=>{
  const r=mulberry(seed),rr=pick(r,[3,6,2,4,5]),h0=ri(r,3,9);
  const h=(rr*rr*h0)%3===0?h0:3*(1+(h0%3));
  const B=rr*rr,V=B*h/3;
  return{ptype:'cone:cone',title:`밑면의 반지름이 ${rr} cm이고 높이가 ${h} cm인 원뿔의 <b>부피</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${coneSVG(rr,h,null)}</div>`},
    finalQ:'원뿔의 부피는 몇 cm³인가요?',steps:[
      {tag:'원 밑넓이',q:`밑면 원의 넓이는? (${rr}π × ${rr})`,type:'pi',ans:B,suffix:'cm²',hint:`${rr} × ${rr}π`},
      {tag:'기둥 부피 ÷ 3',q:`원뿔 부피 = ${B}π × ${h} ÷ 3 = ?`,type:'pi',ans:V,suffix:'cm³',hint:`${B*h} ÷ 3에 π를 붙여요.`,ok:`${B*h}π ÷ 3 = ${V}π cm³`}
    ]};
};

GEN.coneFrustVol=seed=>{
  const r=mulberry(seed);
  const specs=[[6,3,8,4],[6,2,9,3],[9,3,6,2],[6,4,9,6],[4,2,6,3]];
  const [R,rr,Hb,Hc]=pick(r,specs),vBig=R*R*Hb/3,vCut=rr*rr*Hc/3,V=vBig-vCut;
  return{ptype:'cone:frust',title:`큰 원뿔(반지름 ${R} cm, 높이 ${Hb} cm)에서 위쪽의 작은 원뿔(반지름 ${rr} cm, 높이 ${Hc} cm)을 잘라 낸 <b>원뿔대의 부피</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${frustConeSVG(R,rr,Hb,Hc)}</div>`},
    finalQ:'원뿔대의 부피는 몇 cm³인가요?',steps:[
      {tag:'큰 원뿔의 부피',q:`큰 원뿔 부피 = ${R*R}π × ${Hb} ÷ 3 = ?`,type:'pi',ans:vBig,suffix:'cm³',hint:`${R*R*Hb} ÷ 3π`},
      {tag:'작은 원뿔의 부피',q:`잘라 낸 작은 원뿔 부피 = ${rr*rr}π × ${Hc} ÷ 3 = ?`,type:'pi',ans:vCut,suffix:'cm³',hint:`${rr*rr*Hc} ÷ 3π`},
      {tag:'큰 원뿔 − 작은 원뿔',q:`${vBig}π − ${vCut}π = ?`,type:'pi',ans:V,suffix:'cm³',hint:`${vBig} − ${vCut}π`,ok:`${vBig}π − ${vCut}π = ${V}π cm³`}
    ]};
};

GEN.coneInv=seed=>{
  const r=mulberry(seed),rr=pick(r,[3,6,4,5]),h=rr%3===0?ri(r,3,9):pick(r,[3,6,9]);
  const B=rr*rr,V=B*h/3;
  return{ptype:'cone:inv',title:`밑면의 반지름이 ${rr} cm이고 부피가 <b>${V}π cm³</b>인 원뿔의 <b>높이</b>를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${coneSVG(rr,'? cm',null)}</div>`},
    finalQ:'원뿔의 높이는 몇 cm인가요?',steps:[
      {tag:'같은 기둥 부피로 되돌리기 (× 3)',q:`뿔은 기둥의 ⅓이므로 같은 밑면·높이 기둥의 부피는 ${V}π × 3 = ?`,type:'pi',ans:V*3,suffix:'cm³',hint:`${V} × 3π`},
      {tag:'높이 구하기',q:`밑넓이(${B}π) × 높이 = ${V*3}π → 높이는?`,type:'num',ans:h,suffix:'cm',hint:`${V*3} ÷ ${B}`,ok:`높이는 ${h} cm예요.`}
    ]};
};

GEN.cone=seed=>[GEN.conePyrVol,GEN.coneVol,GEN.coneInv,GEN.coneFrustVol][seed%4](seed);
GEN.coneStep=seed=>GEN.coneVol(seed);

/* ── PTYPES & 전역 계약 등록 (6·7·8차시) ── */
Object.assign(PTYPES,{
  volume:[
    {no:1,nm:'각기둥의 부피',tb:'223~225쪽',key:'<b>(밑넓이) × (높이)</b> · 직각삼각형이나 사다리꼴 밑면은 ÷ 2를 빼먹지 마세요.',pt:['volume:prism'],src:['volPrism']},
    {no:2,nm:'원기둥의 부피',tb:'225쪽',key:'원 밑넓이(<b>반둘레 × 반지름 = r²π</b>) × 높이',pt:['volume:cyl'],src:['volCyl']},
    {no:3,nm:'부피로 높이 거꾸로 구하기',tb:'225쪽',key:'<b>높이 = 부피 ÷ 밑넓이</b> · 단위(π 유무)를 맞춰요.',pt:['volume:inv'],src:['volInv']},
    {no:4,nm:'구멍 뚫린·잘린 기둥 부피',tb:'241쪽 · 자주 나오는 복합',key:'<b>(큰 밑넓이 − 작은 밑넓이) × 높이</b> · 뚫린 만큼 빼요.',pt:['volume:comp'],src:['volComp']}
  ],
  conearea:[
    {no:1,nm:'정사각뿔의 겉넓이',tb:'227~228쪽',key:'뿔은 밑면이 <b>1개</b>! (밑넓이) + (삼각형 넓이) × 4',pt:['conearea:pyr'],src:['conePyrArea']},
    {no:2,nm:'원뿔의 겉넓이',tb:'228~229쪽',key:'밑넓이(<b>r²π</b>) + 옆넓이(<b>호의 반 × 모선 = r l π</b>)',pt:['conearea:cone'],src:['coneSideArea']},
    {no:3,nm:'원뿔 전개도 중심각 구하기',tb:'228쪽',key:'중심각 = 360° × (밑면 둘레 ÷ 큰 원 둘레) = <b>360° × (r / 모선)</b>',pt:['conearea:ang'],src:['coneAng']},
    {no:4,nm:'뿔대의 겉넓이',tb:'229쪽 2번 · 자주 나오는 복합',key:'위아래 두 밑넓이 합 + (큰 부채꼴 − 작은 부채꼴 또는 사다리꼴 4개)',pt:['conearea:frust'],src:['coneFrustArea']}
  ],
  cone:[
    {no:1,nm:'각뿔의 부피',tb:'229~230쪽',key:'<b>(밑넓이) × (높이) ÷ 3</b> · 마지막에 ÷ 3을 꼭 기억해요!',pt:['cone:pyr'],src:['conePyrVol']},
    {no:2,nm:'원뿔의 부피',tb:'230~231쪽',key:'원 밑넓이(<b>r²π</b>) × 높이 <b>÷ 3</b>',pt:['cone:cone'],src:['coneVol']},
    {no:3,nm:'부피로 높이 거꾸로 구하기',tb:'231쪽',key:'먼저 <b>× 3</b> 해서 같은 기둥 부피로 되돌린 뒤 밑넓이로 나눠요.',pt:['cone:inv'],src:['coneInv']},
    {no:4,nm:'뿔대의 부피',tb:'231쪽 4번 · 자주 나오는 복합',key:'<b>(큰 뿔의 부피) − (잘린 작은 뿔의 부피)</b>',pt:['cone:frust'],src:['coneFrustVol']}
  ]
});

['volume','conearea','cone'].forEach(lid=>{
  PTYPES[lid].forEach(T_=>{
    const g=tyKey(lid,T_.no);
    GEN[g]=seed=>GEN[T_.src[0]](seed);
    LESSON_OF[g]=lid;
  });
  GEN['mix_'+lid]=seed=>{const L=PTYPES[lid];return GEN[tyKey(lid,L[seed%L.length].no)](Math.floor(seed/L.length)+1)};
  LESSON_OF['mix_'+lid]=lid;
  LESSON_OF[lid]=lid;
});
['volPrism','volCyl','volInv','volComp','volumeStep'].forEach(g=>LESSON_OF[g]='volume');
['conePyrArea','coneSideArea','coneAng','coneFrustArea','coneareaStep'].forEach(g=>LESSON_OF[g]='conearea');
['conePyrVol','coneVol','coneInv','coneFrustVol','coneStep'].forEach(g=>LESSON_OF[g]='cone');
Object.assign(STEPGEN,{volume:GEN.volumeStep,conearea:GEN.coneareaStep,cone:GEN.coneStep});
Object.assign(CALC_FOR,{
  volume:['area','pi','mul','eq'],
  conearea:['area','pi','surf','frac'],
  cone:['area','pi','frac','div']
});
Object.assign(PTYPE_NM,{
  'volume:prism':'6차시 · 각기둥 부피','volume:cyl':'6차시 · 원기둥 부피','volume:inv':'6차시 · 높이 역산','volume:comp':'6차시 · 잘린 기둥 부피',
  'conearea:pyr':'7차시 · 사각뿔 겉넓이','conearea:cone':'7차시 · 원뿔 겉넓이','conearea:ang':'7차시 · 전개도 중심각','conearea:frust':'7차시 · 뿔대 겉넓이',
  'cone:pyr':'8차시 · 각뿔 부피','cone:cone':'8차시 · 원뿔 부피','cone:inv':'8차시 · 뿔 높이 역산','cone:frust':'8차시 · 뿔대 부피'
});

const addT=(k,o)=>{if(typeof TERMS==='object'&&TERMS&&!TERMS[k])TERMS[k]=o};
addT('기둥의 부피',{k:'1학년 · 입체도형',b:'<p class="formula">(밑넓이) × (높이)</p><p>각기둥과 원기둥 모두 밑면 넓이에 높이를 곱해요.</p>'});
addT('뿔의 겉넓이',{k:'1학년 · 입체도형',b:'<p class="formula">(밑넓이) + (옆넓이)</p><p>뿔은 밑면이 1개뿐이라 밑넓이를 1번만 더해요.</p>'});
addT('원뿔의 전개도',{k:'1학년 · 입체도형',b:'<p>밑면은 원 1개, 옆면은 반지름이 모선인 부채꼴이에요. 부채꼴의 호의 길이는 밑면의 둘레와 같아요.</p>'});
addT('뿔의 부피',{k:'1학년 · 입체도형',b:'<p class="formula">⅓ × (밑넓이) × (높이)</p><p>밑면과 높이가 같은 기둥 부피의 ⅓이에요.</p>'});
addT('원뿔대의 부피',{k:'1학년 · 입체도형',b:'<p>(큰 원뿔의 부피) − (위쪽 작은 원뿔의 부피)로 구해요.</p>'});
})();