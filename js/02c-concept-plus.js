/* T06 개념 학습 보완: 카드 진도·슬라이드 모달·음성 듣기·핵심 낱말·열린 6차시 그림 카드·개념 확인 퀴즈 */
(function(){
'use strict';

/* ── 1. 용어 사전(TERMS) 보강: 선생님 방식(지름×π · 반둘레×반지름) + 빠진 기본 낱말 ── */
if(typeof TERMS==='object'&&TERMS){
  TERMS['원의 둘레']={
    k:'6학년 · 원',
    b:`<p class="formula">(지름) × π</p><p><b>둘레 보면 π!</b> π는 지름을 둘레로 바꾸는 마법이에요. 반지름이 <span class="rm">3 cm</span>이면 지름은 <span class="rm">6 cm</span> → 둘레는 <span class="rm">6π cm</span>예요.</p>`,
    fig:'circle'
  };
  TERMS['원의 넓이']={
    k:'6학년 · 원',
    b:`<p class="formula">(반둘레) × (반지름) = (반지름 × π) × (반지름)</p><p>원을 잘게 잘라 지그재그로 붙인 직사각형의 넓이예요. 가로는 <b>반둘레(<span class="math">r</span>π)</b>, 세로는 <b>반지름(<span class="math">r</span>)</b>이에요.</p>`,
    fig:'circle'
  };
  const extraTerms={
    '면':{k:'입체도형',b:`<p>입체도형을 둘러싸고 있는 평평하거나 굽은 부분이에요. 다면체의 면은 모두 ${T('다각형')}이에요.</p>`},
    '모서리':{k:'입체도형',b:`<p>다면체에서 면과 면이 만나서 이루는 선분이에요. 다각형을 둘러싼 변이 곧 모서리예요.</p>`},
    '꼭짓점':{k:'입체도형',b:`<p>모서리와 모서리가 만나서 이루는 점이에요. 다면체에서는 여러 개의 면이 한 꼭짓점에 모여요.</p>`},
    '다면체':{k:'1학년 · 입체도형',b:`<p>${T('다각형')}인 면으로만 둘러싸인 입체도형이에요. 원기둥·원뿔·구처럼 ${T('곡면')}이 있으면 다면체가 아니에요.</p>`},
    '각뿔대':{k:'1학년 · 입체도형',b:`<p>각뿔을 밑면에 ${T('평행')}한 평면으로 잘라서 생긴 두 입체도형 중 각뿔이 아닌 쪽이에요. 두 밑면은 평행하지만 크기가 달라요.</p>`},
    '한 꼭짓점에 모인 면':{k:'1학년 · 정다면체',b:`<p>${T('정다면체')}가 되려면 한 꼭짓점에 최소 3개 이상의 정다각형이 모이고, 모인 각의 합이 360°보다 작아야 해요.</p>`},
    '호':{k:'1학년 · 원과 부채꼴',b:`<p>원 위의 두 점 A, B를 잡았을 때 나누어지는 원의 일부분이에요. 기호로 <span class="arcs">AB</span>처럼 곡선으로 나타내요.</p>`},
    '현':{k:'1학년 · 원과 부채꼴',b:`<p>원 위의 두 점을 곧게 이은 <b>선분</b>이에요. 원의 중심을 지나는 현이 <b>지름</b>이고, 지름은 한 원에서 가장 긴 현이에요.</p>`},
    '할선':{k:'1학년 · 원과 부채꼴',b:`<p>원과 두 점에서 만나는 <b>직선</b>이에요. 원 밖으로 끝없이 이어진 선은 선분인 ${T('현')}과 달라요.</p>`},
    '부채꼴':{k:'1학년 · 원과 부채꼴',b:`<p>두 반지름 OA, OB와 호 AB로 둘러싸인 도형이에요. 피자 조각 모양을 떠올리면 쉬워요.</p>`},
    '중심각':{k:'1학년 · 원과 부채꼴',b:`<p>두 반지름 OA, OB가 원의 중심 O에서 이루는 각 ∠AOB예요. 부채꼴의 호에 대한 중심각이라고 해요.</p>`},
    '활꼴':{k:'1학년 · 원과 부채꼴',b:`<p>${T('현')} AB와 ${T('호')} AB로 둘러싸인 도형이에요. 활처럼 생겼다고 해서 활꼴이라고 해요.</p>`},
    '정비례':{k:'1학년 · 비례',b:`<p>한 양이 2배, 3배, 4배로 커질 때 다른 양도 똑같이 2배, 3배, 4배로 커지는 관계예요. 한 원에서 호의 길이와 부채꼴의 넓이는 ${T('중심각')}의 크기에 정비례해요.</p>`},
    '반둘레':{k:'6학년 · 원',b:`<p>원 둘레의 절반이에요. 지름의 절반이 반지름이므로, 반둘레는 <b>반지름 × π</b>예요.</p>`}
  };
  for(const k of Object.keys(extraTerms)){
    if(!TERMS[k])TERMS[k]=extraTerms[k];
  }
}

/* ── 2. 독립 2D SVG 도우미 (06c-unit-circle.js IIFE와 충돌 없음, Node vm 안전) ── */
const INK='#1d2433',BL='#2a4d9e',BLs='#cfdcf5',HL='#b45309',HLs='#fde3c8',OK='#1b7a4a',OKs='#d8f3e5',GY='#94a3b8';
const f1=x=>Math.round(x*10)/10;
const pt=p=>`${f1(p[0])},${f1(p[1])}`;
const rad=d=>d*Math.PI/180;
const pol=(c,r,d)=>[c[0]+r*Math.cos(rad(d)),c[1]-r*Math.sin(rad(d))];
const svgBox=(body,w=170,h=130)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-hidden="true">${body}</svg>`;
const svgC=(c,r,fill='none',stroke=INK,sw=2)=>`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const svgL=(a,b,col=INK,sw=2.2,dash='')=>`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const svgArc=(c,r,a1,a2,col=BL,sw=4)=>{
  const A=pol(c,r,a1),B=pol(c,r,a2),lg=Math.abs(a2-a1)>180?1:0,swp=a2>a1?0:1;
  return `<path d="M ${pt(A)} A ${r} ${r} 0 ${lg} ${swp} ${pt(B)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
};
const svgSec=(c,r,a1,a2,fill=BLs,stroke=INK,sw=2)=>{
  const A=pol(c,r,a1),B=pol(c,r,a2),lg=Math.abs(a2-a1)>180?1:0,swp=a2>a1?0:1;
  return `<path d="M ${pt(c)} L ${pt(A)} A ${r} ${r} 0 ${lg} ${swp} ${pt(B)} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
};
const svgTx=(p,s,col=INK,sz=12)=>`<text x="${f1(p[0])}" y="${f1(p[1])}" fill="${col}" font-size="${sz}" font-weight="700" text-anchor="middle" dominant-baseline="central">${s}</text>`;
const svgDot=(p,col=INK,r=3)=>`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${r}" fill="${col}"/>`;

/* ── 3. PREVIEW.area 및 열린 4차시(area·arc·cent·sector) PV_CARDS 추가 ── */
if(typeof PREVIEW==='object'&&PREVIEW&&!PREVIEW.area){
  PREVIEW.area={
    tb:'220~222쪽',
    core:[
      {h:'겉넓이 = 전개도',b:'입체도형의 모든 면의 넓이를 더한 거예요. 기둥은 <b>밑넓이 × 2 + 옆넓이</b>!'},
      {h:'옆넓이 = 둘레 × 높이',b:'기둥의 옆면을 펼치면 커다란 <b>직사각형</b> 하나가 돼요.'}
    ],
    words:['전개도','겉넓이','밑넓이','옆넓이','원의 둘레','원의 넓이'],
    ex:'밑면이 <b>3, 4, 5 cm</b> 직각삼각형이고 높이가 <b>5 cm</b>인 삼각기둥 → 밑넓이 <code>6</code>×2 + 옆넓이 <code>(3+4+5)×5</code> = <b>72 cm²</b>'
  };
}

if(typeof PV_CARDS==='object'&&PV_CARDS){
  if(!PV_CARDS.area){
    PV_CARDS.area=[
      {
        h:'겉넓이 = 밑면 2개 + 옆면',
        t:'<span class="sw b"></span>밑면 2개 <span class="sw o"></span>옆면 — 기둥은 위아래 <b>밑넓이를 2번</b> 더해요',
        figs:()=>{
          const figNet=svgBox(
            `<rect x="18" y="48" width="134" height="40" fill="${HLs}" stroke="${HL}" stroke-width="2" rx="3"/>`+
            `<rect x="52" y="16" width="38" height="32" fill="${BLs}" stroke="${BL}" stroke-width="2"/>`+
            `<rect x="52" y="88" width="38" height="32" fill="${BLs}" stroke="${BL}" stroke-width="2"/>`+
            svgTx([71,32],'밑넓이',BL,11)+svgTx([71,104],'밑넓이',BL,11)+svgTx([85,68],'옆넓이(큰 직사각형)',HL,11)
          );
          return[
            [TYPE.prism.mk(4),'all','사각기둥<br><small>밑면 2개 + 옆면 4개</small>'],
            [TYPE.prism.mk(3),'all','삼각기둥<br><small>밑면 2개 + 옆면 3개</small>'],
            [figNet,null,'펼친 전개도<br><small>밑넓이×2 + 옆넓이</small>']
          ];
        }
      },
      {
        h:'옆넓이 = 밑면의 둘레 × 높이',
        t:'옆면을 펼치면 가로가 <b>밑면의 둘레</b>, 세로가 <b>높이</b>인 직사각형 하나!',
        figs:()=>[
          [svgBox(
            `<polygon points="24,96 66,96 24,42" fill="${BLs}" stroke="${BL}" stroke-width="2"/>`+
            svgTx([36,79],'밑면',BL,11)+svgTx([45,108],'3',INK,11)+svgTx([14,69],'4',INK,11)+svgTx([53,62],'5',INK,11)+
            `<path d="M 74 68 L 92 68" stroke="${INK}" stroke-width="2" marker-end="none"/>`+svgTx([83,56],'펼치면',GY,10)+
            `<rect x="98" y="42" width="58" height="54" fill="${HLs}" stroke="${HL}" stroke-width="2"/>`+
            svgTx([127,108],'3+4+5=12',HL,11)+svgTx([127,69],'옆넓이',HL,11)
          ),null,'세 변 모두 더해요<br><small>빗변 5도 둘레에 포함!</small>'],
          [svgBox(
            svgC([42,66],24,BLs,BL,2)+svgTx([42,66],'원',BL,11)+svgTx([42,102],'지름 d',BL,11)+
            svgTx([78,66],'→',INK,15)+
            `<rect x="92" y="42" width="66" height="48" fill="${HLs}" stroke="${HL}" stroke-width="2"/>`+
            svgTx([125,102],'가로 = d×π',HL,11)+svgTx([125,66],'높이 h',HL,11)
          ),null,'원기둥 옆넓이<br><small>가로 = 지름 × π</small>']
        ]
      },
      {
        h:'원기둥 밑넓이 · 지그재그 생각',
        t:'원을 잘게 잘라 붙이면 <b>가로 = 반둘레(rπ)</b>, <b>세로 = 반지름(r)</b>인 직사각형!',
        figs:()=>{
          const z=typeof svgZig==='function'?svgZig('가로 = 반둘레 (r×π)','= r'):svgBox(
            `<rect x="20" y="34" width="130" height="52" fill="${BLs}" stroke="${BL}" stroke-width="2"/>`+
            svgTx([85,60],'가로(rπ) × 세로(r)',BL,12)
          );
          return[
            [SOLIDS.cyl.mk(),'all','원기둥<br><small>원 2개 + 옆면</small>'],
            [z,null,'원의 넓이 = 반둘레 × 반지름<br><small>예: r=3 → 3π × 3 = 9π</small>']
          ];
        }
      },
      {
        h:'삼각기둥 주의할 점',
        t:'삼각형 넓이는 <b>÷ 2</b>! 둘레는 직각을 낀 두 변뿐 아니라 <b>세 변 모두</b> 더해요.',
        figs:()=>[
          [svgBox(
            `<polygon points="45,96 125,96 45,34" fill="${BLs}" stroke="${BL}" stroke-width="2.2"/>`+
            `<rect x="45" y="84" width="12" height="12" fill="none" stroke="${BL}" stroke-width="1.5"/>`+
            svgTx([85,109],'밑변 4',INK,12)+svgTx([26,66],'높이 3',INK,12)+svgTx([95,58],'5',HL,12)+
            svgTx([75,78],'넓이 = 4×3÷2',BL,11)
          ),null,'밑넓이 하나 = 6 cm²<br><small>÷ 2를 잊지 마세요</small>'],
          [svgBox(
            svgSec([85,95],54,180,360,OKs,OK,0).replace(/Z$/,'')+''+
            `<rect x="25" y="28" width="120" height="72" rx="10" fill="${HLs}" stroke="${HL}" stroke-width="2"/>`+
            svgTx([85,50],'밑면 2개 → × 2',HL,13)+
            svgTx([85,76],'세 변 다 더하기!',INK,12)
          ),null,'둘레 = 3 + 4 + 5<br><small>겉넓이 = 6×2 + 12×h</small>']
        ]
      }
    ];
  }

  if(!PV_CARDS.arc){
    PV_CARDS.arc=[
      {
        h:'호와 현',
        t:'원 위의 두 점을 잇는 <b>굽은 선이 호</b>, <b>곧은 선분이 현</b>이에요.',
        figs:()=>{
          const C=[85,68],R=44,A=pol(C,R,145),B=pol(C,R,35);
          return[
            [svgBox(svgC(C,R,'none',GY,1.8)+svgArc(C,R,35,145,BL,4.5)+svgDot(A,BL)+svgDot(B,BL)+svgTx([A[0]-10,A[1]-4],'A',INK)+svgTx([B[0]+10,B[1]-4],'B',INK)+svgTx([85,14],'호 AB',BL,13)),null,'호 (굽은 선)<br><small>기호: 곡선 표기</small>'],
            [svgBox(svgC(C,R,'none',GY,1.8)+svgL(A,B,HL,4)+svgDot(A,HL)+svgDot(B,HL)+svgTx([A[0]-10,A[1]-4],'A',INK)+svgTx([B[0]+10,B[1]-4],'B',INK)+svgTx([85,58],'현 AB',HL,13)),null,'현 (곧은 선분)<br><small>원 안을 곧게 잇는 선</small>']
          ];
        }
      },
      {
        h:'지름도 현이에요!',
        t:'원의 중심을 지나는 현이 <b>지름</b>! 한 원에서 <b>가장 긴 현</b>이 지름이에요.',
        figs:()=>{
          const C=[85,68],R=44,L=pol(C,R,180),P=pol(C,R,0),A=pol(C,R,130),B=pol(C,R,50);
          return[
            [svgBox(svgC(C,R,'none',GY,1.8)+svgL(A,B,GY,2)+svgL(L,P,OK,4)+svgDot(C,INK,3.5)+svgTx([85,56],'지름 (가장 긴 현)',OK,11)+svgTx([85,84],'중심 O',INK,11)),null,'중심을 지나는 현<br><small>다른 현보다 항상 길어요</small>']
          ];
        }
      },
      {
        h:'부채꼴과 중심각',
        t:'<b>두 반지름 + 호</b>로 둘러싸인 도형이 부채꼴, 중심에 생긴 각이 <b>중심각</b>이에요.',
        figs:()=>{
          const C=[85,78],R=48,A=pol(C,R,135),B=pol(C,R,35);
          return[
            [svgBox(svgC(C,R,'none',GY,1.5)+svgSec(C,R,35,135,BLs,BL,2.4)+svgArc(C,16,35,135,HL,2.5)+svgDot(C,INK)+svgTx([85,56],'중심각',HL,11)+svgTx([C[0]-10,C[1]+11],'O',INK)+svgTx([A[0]-9,A[1]-4],'A',INK)+svgTx([B[0]+9,B[1]-4],'B',INK)),null,'피자 조각 = 부채꼴<br><small>꼭짓점은 원의 중심 O</small>']
          ];
        }
      },
      {
        h:'부채꼴 vs 활꼴 · 반원',
        t:'<b>반지름 2개</b>면 부채꼴, <b>현 1개</b>면 활꼴! <b>반원</b>은 둘 다 돼요.',
        figs:()=>{
          const C=[85,68],R=42,A=pol(C,R,150),B=pol(C,R,30);
          const L=pol(C,R,180),P=pol(C,R,0);
          const segPath=`M ${pt(B)} A ${R} ${R} 0 0 0 ${pt(A)} Z`;
          return[
            [svgBox(svgC(C,R,'none',GY,1.5)+`<path d="${segPath}" fill="${HLs}" stroke="${HL}" stroke-width="2.4"/>`+svgTx([85,36],'활꼴',HL,12)),null,'현 + 호 = 활꼴<br><small>활 모양 도형</small>'],
            [svgBox(svgC(C,R,'none',GY,1.5)+svgSec(C,R,0,180,OKs,OK,2.4)+svgDot(C,OK)+svgTx([85,46],'반원 (180°)',OK,12)),null,'반원은 부채꼴 ○ 활꼴 ○<br><small>지름 = 반지름 2개 = 현</small>']
          ];
        }
      }
    ];
  }

  if(!PV_CARDS.cent){
    PV_CARDS.cent=[
      {
        h:'중심각이 같으면 길이·넓이도 같다',
        t:'한 원(또는 합동인 두 원)에서 <b>중심각의 크기</b>가 같으면 호의 길이, 부채꼴의 넓이, 현의 길이가 모두 같아요.',
        figs:()=>{
          const C=[85,68],R=44;
          return[
            [svgBox(svgC(C,R,'none',GY,1.6)+svgSec(C,R,20,80,BLs,BL,2)+svgSec(C,R,190,250,BLs,BL,2)+svgTx([112,42],'50°',BL,11)+svgTx([58,92],'50°',BL,11)),null,'각이 같으면<br><small>호 · 넓이 · 현 모두 같아요</small>']
          ];
        }
      },
      {
        h:'호와 넓이는 중심각에 정비례',
        t:'중심각이 <b>2배, 3배</b>가 되면 호의 길이와 부채꼴의 넓이도 <b>2배, 3배</b>가 돼요!',
        figs:()=>{
          const C=[85,68],R=44;
          return[
            [svgBox(svgC(C,R,'none',GY,1.5)+svgSec(C,R,10,50,BLs,BL,2)+svgArc(C,R,10,50,BL,3.8)+svgTx([116,52],'40°',BL,11)),null,'40° → 호 4 cm<br><small>기준 조각</small>'],
            [svgBox(svgC(C,R,'none',GY,1.5)+svgSec(C,R,10,90,OKs,OK,2)+svgL(C,pol(C,R,50),OK,1.3,'3 3')+svgArc(C,R,10,90,OK,3.8)+svgTx([104,42],'80°',OK,12)),null,'80°(2배) → 호 8 cm(2배)<br><small>넓이도 똑같이 2배!</small>']
          ];
        }
      },
      {
        h:'조심! 현의 길이는 정비례 ✕',
        t:'중심각이 2배가 되어도 <b>현의 길이는 2배보다 짧아요</b>. 두 변의 합보다 한 변이 짧기 때문이에요.',
        figs:()=>{
          const C=[85,78],R=48,A=pol(C,R,145),M=pol(C,R,90),B=pol(C,R,35);
          return[
            [svgBox(svgC(C,R,'none',GY,1.4)+svgL(C,A,GY,1.5)+svgL(C,M,GY,1.5)+svgL(C,B,GY,1.5)+svgL(A,M,BL,2.4)+svgL(M,B,BL,2.4)+svgL(A,B,HL,3)+svgTx([85,61],'현 AB < 2배',HL,12)+svgTx([56,30],'꺾인 2개',BL,10)),null,'삼각형이 만들어져요<br><small>직선 AB &lt; AM + MB</small>']
          ];
        }
      }
    ];
  }

  if(!PV_CARDS.sector){
    PV_CARDS.sector=[
      {
        h:'원 둘레 = 지름 × π',
        t:'<b>둘레 보면 π!</b> 지름 뒤에 π를 붙이면 원의 둘레예요. 반지름이 나오면 먼저 2배 해서 지름을 찾아요.',
        figs:()=>{
          const C=[85,66],R=42;
          return[
            [svgBox(svgC(C,R,BLs,BL,2)+svgL(pol(C,R,180),pol(C,R,0),HL,3)+svgDot(C,INK)+svgTx([85,54],'지름 d',HL,13)+svgTx([85,118],'둘레 = d × π',BL,12)),null,'지름 6 cm → 6π cm<br><small>반지름 3 cm → 지름 6 cm</small>']
          ];
        }
      },
      {
        h:'원 넓이 = 반둘레 × 반지름',
        t:'원을 잘게 잘라 지그재그로 붙이면 직사각형! <b>가로 = 반둘레(rπ)</b>, <b>세로 = 반지름(r)</b>이에요.',
        figs:()=>{
          const z=typeof svgZig==='function'?svgZig('가로 = 반둘레 (r×π)','= r'):svgBox(
            `<rect x="20" y="34" width="130" height="52" fill="${HLs}" stroke="${HL}" stroke-width="2"/>`+
            svgTx([85,60],'rπ × r',HL,13)
          );
          return[
            [z,null,'가로(rπ) × 세로(r)<br><small>반지름 3 → 3π × 3 = 9π</small>']
          ];
        }
      },
      {
        h:'부채꼴 = 원 × (중심각 ÷ 360)',
        t:'부채꼴은 원의 <b>몇 분의 몇 조각</b>! 먼저 원의 둘레나 넓이를 구하고 <code>중심각/360</code>을 곱해요.',
        figs:()=>{
          const C=[85,68],R=42;
          return[
            [svgBox(svgC(C,R,'none',GY,1.5)+svgSec(C,R,0,90,BLs,BL,2.4)+svgTx([106,46],'90°',BL,12)+svgTx([85,118],'원의 1/4',INK,12)),null,'90° → 1/4조각<br><small>180°=1/2, 60°=1/6</small>'],
            [svgBox(svgC(C,R,'none',GY,1.5)+svgSec(C,R,0,120,OKs,OK,2.4)+svgTx([98,42],'120°',OK,12)+svgTx([85,118],'원의 1/3',INK,12)),null,'120° → 1/3조각<br><small>약분부터 하면 빨라요</small>']
          ];
        }
      },
      {
        h:'중심각 모를 때 넓이 = ½rl',
        t:'부채꼴도 잘게 잘라 붙이면 직사각형! <b>가로 = 호의 반(½l)</b>, <b>세로 = 반지름(r)</b>으로 바로 구해요.',
        figs:()=>{
          const C=[85,78],R=48;
          return[
            [svgBox(svgSec(C,R,30,130,HLs,HL,2.4)+svgArc(C,R,30,130,BL,4)+svgTx([85,20],'호 l',BL,12)+svgTx([112,68],'r',HL,12)),null,'호 l과 반지름 r<br><small>넓이 = (호의 반) × 반지름</small>'],
            [svgBox(`<rect x="26" y="42" width="118" height="44" fill="${OKs}" stroke="${OK}" stroke-width="2"/>`+svgTx([85,64],'(호 ÷ 2) × r',OK,13)+svgTx([85,98],'가로 = 호의 반',OK,11)),null,'예: r=4, l=6π<br><small>3π × 4 = 12π cm²</small>']
          ];
        }
      }
    ];
  }
}

/* ── 4. CONCEPT.area 보강 (선생님 원 공식 + 삼각기둥 자주 하는 실수 접기 추가) ── */
if(typeof CONCEPT==='object'&&CONCEPT&&typeof CONCEPT.area==='function'){
  const origArea=CONCEPT.area;
  CONCEPT.area=function(body){
    origArea(body);
    const f2=body.querySelector('details.fold[data-i="2"] .fb');
    if(f2&&!f2.querySelector('.cp-area-box')){
      const zig=typeof svgZig==='function'?`<div class="cp-zig">${svgZig('가로 = 반둘레 (반지름 × π)','= 반지름')}</div>`:'';
      f2.insertAdjacentHTML('beforeend',
        `<div class="cp-area-box">`+
        `<b>👩‍🏫 선생님 방식 · 6학년 원 공식 한 번에 떠올리기</b>`+
        `<div class="cp-area-cols">`+
        `<div><b>둘레 = 지름 × π</b><br><small>반지름이 주어지면 먼저 2배 해서 지름을 만들고, 뒤에 π만 붙여요.</small></div>`+
        `<div><b>넓이 = 반둘레 × 반지름</b><br><small>원을 지그재그 직사각형으로 만들면 가로 <span class="math">r</span>π × 세로 <span class="math">r</span>!</small></div>`+
        `</div>${zig}</div>`
      );
    }
    const folds=body.querySelector('.folds');
    if(folds&&!body.querySelector('details.fold[data-i="3"]')&&typeof fold==='function'){
      const html=fold(3,'삼각기둥에서 자주 하는 실수','밑넓이 ÷ 2와 밑면 둘레 3변 모두 더하기',
        `<div class="cp-pitfall">`+
        `<p><b>1. 삼각형 밑넓이에서 ÷ 2 빼먹기</b></p>`+
        `<p>직각을 낀 두 변이 3 cm, 4 cm이면 밑면 하나 넓이는 <code>3 × 4 ÷ 2 = 6</code> cm²예요. 겉넓이를 구할 때 밑면이 2개라 다시 × 2를 하지만, 밑넓이 하나를 물을 땐 꼭 <b>÷ 2</b>를 해야 해요.</p>`+
        `<p style="margin-top:10px"><b>2. 옆넓이 구할 때 빗변 빼먹기</b></p>`+
        `<p>옆넓이 가로 = <b>밑면의 둘레</b>예요. 직각삼각형 세 변이 3, 4, 5 cm이면 <code>3 + 4 + 5 = 12</code> cm처럼 <b>세 변을 모두</b> 더해야 해요.</p>`+
        `<p style="margin-top:10px"><b>3. 밑면 2개를 1개만 더하기</b></p>`+
        `<p>기둥은 위아래 밑면이 2개! <code>(밑넓이) × 2 + (옆넓이)</code>에서 <b>× 2</b>를 마지막에 꼭 확인해요.</p>`+
        `</div>`,false);
      folds.insertAdjacentHTML('beforeend',html);
      const d3=folds.querySelector('details.fold[data-i="3"]');
      if(d3){
        d3.open=false;
        const sm=d3.querySelector('summary');
        if(sm&&!sm.querySelector('.fold-x'))sm.insertAdjacentHTML('beforeend','<span class="fold-x" aria-hidden="true">✕ 닫기</span>');
        d3.addEventListener('toggle',()=>{
          const all=Array.from(body.querySelectorAll('details.fold'));
          if(d3.open){
            all.forEach(o=>{if(o!==d3)o.open=false});
            if(!document.querySelector('.zoom-bg.fz')){
              const bg=document.createElement('div');
              bg.className='zoom-bg fz';
              bg.onclick=()=>all.forEach(o=>o.open=false);
              document.body.appendChild(bg);
            }
          }else if(!all.some(o=>o.open)){
            document.querySelectorAll('.zoom-bg.fz').forEach(b=>b.remove());
          }
        });
      }
    }
  };
}

/* ── 5. 열린 6차시 개념 확인 퀴즈 (CONCEPT_QUIZ) ── */
window.CONCEPT_QUIZ={
  poly:[
    {
      q:'다음 중 다면체가 <b>아닌</b> 것은 어느 것인가요?',
      choices:['삼각기둥','사각뿔대','원기둥','육각뿔'],
      ans:'원기둥',
      hint:'다면체는 모든 면이 평평한 다각형이어야 해요. 굽은 면이 있는 것을 찾아요.',
      ok:'맞아요! 원기둥에는 굽은 옆면(곡면)이 있어서 다면체가 아니에요.'
    },
    {
      q:'각뿔대의 두 밑면에 대한 설명으로 옳은 것은?',
      choices:['평행하고 합동이다','평행하지만 크기가 다르다','한 점에서 만난다','옆면이 직사각형이다'],
      ans:'평행하지만 크기가 다르다',
      hint:'각뿔을 밑면에 평행하게 잘랐을 때 위·아래 면의 크기를 떠올려 봐요.',
      ok:'정확해요! 각뿔대의 두 밑면은 평행하지만, 윗면이 아랫면보다 작아요. 옆면은 사다리꼴이에요.'
    },
    {
      q:'면의 개수가 7개인 각뿔대는 밑면이 무슨 모양일까요?',
      choices:['오각형','육각형','칠각형','사각형'],
      ans:'오각형',
      hint:'각뿔대는 위·아래 밑면 2개와 옆면이 있어요. 7개에서 밑면 2개를 먼저 빼 봐요.',
      ok:'잘했어요! 면 7개 중 밑면 2개를 빼면 옆면이 5개 → 밑면은 오각형(오각뿔대)이에요.'
    }
  ],
  regular:[
    {
      q:'정다면체가 되기 위한 두 조건에 <b>들어가지 않는</b> 것은?',
      choices:['모든 면이 합동인 정다각형이다','각 꼭짓점에 모인 면의 개수가 같다','면의 개수가 항상 짝수이다'],
      ans:'면의 개수가 항상 짝수이다',
      hint:'정다면체는 면의 모양이 모두 같고, 꼭짓점마다 모인 면의 개수가 같아야 해요.',
      ok:'맞아요! 두 가지 조건(① 합동인 정다각형 ② 꼭짓점마다 모인 면의 개수 같음)만 만족하면 돼요.'
    },
    {
      q:'직육면체는 왜 정다면체가 아닐까요?',
      choices:['면의 개수가 6개라서','면이 정다각형(정사각형)이 아니라서','꼭짓점에 모인 면이 3개라서'],
      ans:'면이 정다각형(정사각형)이 아니라서',
      hint:'정육면체와 직육면체의 면 모양을 비교해 봐요.',
      ok:'정확해요! 직육면체는 면이 직사각형(네 변의 길이가 다름)이라서 정다면체가 아니에요.'
    },
    {
      q:'정다면체의 면으로 쓰일 수 <b>없는</b> 정다각형은?',
      choices:['정삼각형','정사각형','정오각형','정육각형'],
      ans:'정육각형',
      hint:'한 꼭짓점에 최소 3개가 모여야 하는데, 정육각형 한 내각은 120°예요. 120° × 3 = ?',
      ok:'맞아요! 120° × 3 = 360°가 되어 평면처럼 납작하게 펴지므로 입체를 만들 수 없어요.'
    }
  ],
  area:[
    {
      q:'기둥의 옆면을 펼치면 직사각형이 됩니다. 이 직사각형의 가로는 무엇과 같나요?',
      choices:['밑면 하나의 넓이','밑면의 둘레','기둥의 높이','밑면의 지름'],
      ans:'밑면의 둘레',
      hint:'옆면이 밑면의 테두리를 한 바퀴 빙 둘러싸고 있어요.',
      ok:'정확해요! 옆넓이 = (밑면의 둘레) × (높이)예요.'
    },
    {
      q:'밑면이 3 cm, 4 cm, 5 cm인 직각삼각형이고 높이가 10 cm인 삼각기둥의 옆넓이는?',
      choices:['70 cm²','120 cm²','60 cm²','12 cm²'],
      ans:'120 cm²',
      hint:'직각을 낀 두 변만 더하지 말고, 빗변 5 cm까지 세 변을 모두 더해 보세요.',
      ok:'잘했어요! 밑면의 둘레 = 3 + 4 + 5 = 12 cm, 옆넓이 = 12 × 10 = 120 cm²예요.'
    },
    {
      q:'반지름이 4 cm인 원의 둘레와 넓이를 선생님 방식으로 바르게 짝지은 것은?',
      choices:['둘레 4π cm, 넓이 16π cm²','둘레 8π cm, 넓이 8π cm²','둘레 8π cm, 넓이 16π cm²'],
      ans:'둘레 8π cm, 넓이 16π cm²',
      hint:'둘레는 지름(4×2) × π, 넓이는 반둘레(4π) × 반지름(4)이에요.',
      ok:'완벽해요! 지름 8 → 둘레 8π cm, 반둘레 4π × 반지름 4 → 넓이 16π cm²!'
    }
  ],
  arc:[
    {
      q:'원 위의 두 점을 이은 <b>곧은 선분</b>을 무엇이라고 하나요?',
      choices:['호','현','할선','활꼴'],
      ans:'현',
      hint:'굽은 선은 호, 직선으로 원 밖까지 뻗으면 할선이에요.',
      ok:'맞아요! 원 위의 두 점을 곧게 이은 선분이 현이에요.'
    },
    {
      q:'한 원에서 길이가 가장 긴 현은 무엇인가요?',
      choices:['반지름','지름','중심각','활꼴'],
      ans:'지름',
      hint:'원의 중심을 지나는 현을 떠올려 봐요.',
      ok:'정확해요! 지름은 원의 중심을 지나는 현이자 한 원에서 가장 긴 현이에요.'
    },
    {
      q:'두 반지름과 호로 둘러싸인 도형과, 현과 호로 둘러싸인 도형을 차례로 고르면?',
      choices:['활꼴, 부채꼴','부채꼴, 활꼴','반원, 현'],
      ans:'부채꼴, 활꼴',
      hint:'피자 조각처럼 반지름 2개가 모인 쪽이 부채꼴, 활처럼 생긴 쪽이 활꼴이에요.',
      ok:'잘했어요! 반지름 2개 + 호 = 부채꼴, 현 + 호 = 활꼴이에요. 참고로 반원은 둘 다 해당해요!'
    }
  ],
  cent:[
    {
      q:'한 원에서 중심각의 크기가 2배가 될 때, <b>2배가 되지 않는</b> 것은?',
      choices:['호의 길이','부채꼴의 넓이','현의 길이'],
      ans:'현의 길이',
      hint:'굽은 선(호)과 넓이는 정비례하지만, 곧은 선은 꺾인 두 선의 합보다 짧아져요.',
      ok:'핵심을 정확히 잡았어요! 호의 길이와 부채꼴의 넓이만 중심각에 정비례하고, 현의 길이는 정비례하지 않아요.'
    },
    {
      q:'한 원에서 중심각이 30°인 부채꼴의 넓이가 5 cm²일 때, 중심각이 90°인 부채꼴의 넓이는?',
      choices:['10 cm²','15 cm²','45 cm²'],
      ans:'15 cm²',
      hint:'90°는 30°의 몇 배인가요? 넓이도 똑같은 배수가 돼요.',
      ok:'정확해요! 중심각이 3배가 되었으므로 넓이도 5 × 3 = 15 cm²예요.'
    },
    {
      q:'원 둘레를 호 AB : 호 BC : 호 CA = 1 : 2 : 3으로 나눌 때, 호 AB에 대한 중심각은?',
      choices:['30°','60°','120°','180°'],
      ans:'60°',
      hint:'원 한 바퀴는 360°! 비를 모두 더하면 1 + 2 + 3 = 6칸이에요.',
      ok:'멋져요! 전체 6칸이 360°이므로 1칸(호 AB)은 360° ÷ 6 = 60°예요.'
    }
  ],
  sector:[
    {
      q:'중심각이 120°인 부채꼴의 넓이는 같은 반지름을 가진 원 전체 넓이의 몇 분의 몇인가요?',
      choices:['1/2','1/3','1/4','1/6'],
      ans:'1/3',
      hint:'원 한 바퀴는 360°예요. 120 ÷ 360을 약분해 보세요.',
      ok:'맞아요! 120/360 = 1/3이므로 원의 넓이에 1/3을 곱하면 돼요.'
    },
    {
      q:'반지름이 6 cm, 호의 길이가 4π cm인 부채꼴의 넓이를 (호의 반) × 반지름으로 구하면?',
      choices:['12π cm²','24π cm²','36π cm²'],
      ans:'12π cm²',
      hint:'호 4π의 절반(가로)에 반지름 6(세로)을 곱해 봐요.',
      ok:'정확해요! (호의 반 2π) × (반지름 6) = 12π cm²예요.'
    },
    {
      q:'반지름이 5 cm이고 중심각이 180°(반원)인 부채꼴의 <b>호의 길이</b>는?',
      choices:['5π cm','10π cm','25π cm'],
      ans:'5π cm',
      hint:'지름 10 cm에 π를 붙인 원의 둘레 10π의 절반(180/360 = 1/2)이에요.',
      ok:'잘했어요! 원 둘레 10π cm × 1/2 = 5π cm예요.'
    }
  ]
};

/* ── 6. 개념 화면 통합 마운트: 진도·슬라이드 모달·듣기·낱말 칩·개념 확인 퀴즈 ── */
function speakTextClean(s){
  if(typeof sayText==='function')return sayText(s);
  return String(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
}
function stopAudio(){
  if(typeof stopSpeak==='function')stopSpeak();
  else if(typeof window!=='undefined'&&window.speechSynthesis){try{window.speechSynthesis.cancel()}catch(_){}}
}

window.mountConceptPlus=function(body,id){
  if(!body||!id)return;
  const p=typeof prog==='function'?prog(id):{};
  if(!Array.isArray(p.seenCards))p.seenCards=[];
  if(!Array.isArray(p.conceptQuiz))p.conceptQuiz=[];

  const C=(typeof PV_CARDS!=='undefined'&&PV_CARDS[id])||[];
  const pvCards=Array.from(body.querySelectorAll('.pvcard'));
  const folds=Array.from(body.querySelectorAll('details.fold'));
  const total=pvCards.length+folds.length;

  const pvEl=body.querySelector('.pv');
  let seenBadge=null;
  const syncSeenUI=()=>{
    const cnt=new Set(p.seenCards).size;
    if(seenBadge){
      seenBadge.textContent=`본 카드 ${cnt} / ${total}`;
      seenBadge.classList.toggle('all',total>0&&cnt>=total);
    }
  };
  const markSeen=(key,node)=>{
    if(node)node.classList.add('seen');
    if(!p.seenCards.includes(key)){
      p.seenCards.push(key);
      if(typeof save==='function')save();
    }
    syncSeenUI();
  };

  /* 6-1. 진도 바 & 핵심 낱말 칩 */
  if(pvEl&&total>0){
    const bar=document.createElement('div');
    bar.className='cp-bar';
    bar.innerHTML=`<span class="cp-seen">본 카드 0 / ${total}</span><span class="cp-tip">그림 카드를 눌러 넘겨 보고, 아래 개념 접기 카드도 열어 보세요.</span>`;
    seenBadge=bar.querySelector('.cp-seen');
    const pvH=pvEl.querySelector('.pv-h');
    if(pvH)pvH.insertAdjacentElement('afterend',bar);
    else pvEl.prepend(bar);

    const P=typeof PREVIEW!=='undefined'?PREVIEW[id]:null;
    if(P&&Array.isArray(P.words)&&P.words.length&&!pvEl.querySelector('.cp-words')){
      const hasTerm=w=>typeof TERMS==='object'&&TERMS&&TERMS[w]&&typeof T==='function';
      const chips=P.words.map(w=>hasTerm(w)?T(w):`<span class="pv-w">${w}</span>`).join('');
      const hasAnyClick=P.words.some(hasTerm);
      const row=document.createElement('div');
      row.className='pv-row cp-words';
      row.innerHTML=`<span class="pv-l">핵심 낱말${hasAnyClick?' <small>(누르면 뜻 보기)</small>':''}</span>${chips}`;
      const cardsGrid=pvEl.querySelector('.pv-cards2');
      if(cardsGrid)cardsGrid.insertAdjacentElement('afterend',row);
      else pvEl.appendChild(row);
    }
  }

  /* 6-2. 기존 본 카드 상태 복원 + 슬라이드 확대 모달(이전/다음/듣기/키보드) */
  pvCards.forEach((b,idx)=>{
    if(p.seenCards.includes('c'+idx))b.classList.add('seen');
    b.onclick=()=>openSlideModal(idx);
  });

  function openSlideModal(startIdx){
    if(!C.length)return;
    let cur=startIdx;
    const bg=document.createElement('div');
    bg.className='zoom-bg';
    const cd=document.createElement('div');
    cd.className='zoom-card pvz';
    cd.setAttribute('role','dialog');
    cd.setAttribute('aria-modal','true');
    const canS=typeof canSpeak!=='undefined'&&canSpeak;

    const render=()=>{
      stopAudio();
      const c=C[cur];
      markSeen('c'+cur,pvCards[cur]);
      const cardHtml=typeof pvCardHTML==='function'?pvCardHTML(c,cur):`<b>${c.h}</b><div>${c.t}</div>`;
      cd.innerHTML=`<button type="button" class="zoom-x" aria-label="닫기">✕</button>${cardHtml}`+
        `<p class="muted cp-mhint" style="margin:8px 0 0;font-size:14px"></p>`+
        `<div class="cp-znav">`+
        `${canS?'<button type="button" class="cp-say" aria-label="카드 내용 읽어 주기">🔊 듣기</button>':'<span></span>'}`+
        `<div class="cp-znav-mid">`+
        `<button type="button" class="cp-prev" ${cur<=0?'disabled':''}>◀ 이전</button>`+
        `<span class="cp-zpos">${cur+1} / ${C.length}</span>`+
        `<button type="button" class="cp-next" ${cur>=C.length-1?'disabled':''}>다음 ▶</button>`+
        `</div></div>`;
      if(typeof pvMount==='function')pvMount(cd,c);
      const mh=cd.querySelector('.cp-mhint');
      if(mh)mh.textContent=cd.querySelector('canvas')?'그림을 끌어서 돌려 볼 수 있어요. 키보드 ← → 로 카드를 넘길 수 있어요.':'키보드 ← → 화살표로 카드를 넘길 수 있어요.';
      cd.querySelector('.zoom-x').onclick=close;
      const pvBtn=cd.querySelector('.cp-prev');
      const nxBtn=cd.querySelector('.cp-next');
      if(pvBtn)pvBtn.onclick=()=>{if(cur>0){cur--;render()}};
      if(nxBtn)nxBtn.onclick=()=>{if(cur<C.length-1){cur++;render()}};
      const sayBtnEl=cd.querySelector('.cp-say');
      if(sayBtnEl&&typeof speak==='function'){
        sayBtnEl.onclick=()=>{
          const caps=Array.from(cd.querySelectorAll('figcaption')).map(x=>x.textContent).join('. ');
          speak(speakTextClean(c.h+'. '+c.t+(caps?'. '+caps:'')),sayBtnEl);
        };
      }
    };
    const close=()=>{
      stopAudio();
      bg.remove();cd.remove();
      document.removeEventListener('keydown',onKey);
    };
    const onKey=e=>{
      if(e.key==='Escape')close();
      else if(e.key==='ArrowLeft'&&cur>0){cur--;render()}
      else if(e.key==='ArrowRight'&&cur<C.length-1){cur++;render()}
    };
    bg.onclick=close;
    document.addEventListener('keydown',onKey);
    document.body.append(bg,cd);
    render();
  }

  /* 6-3. 접기 카드(.fold) 진도 기록 + 열린 카드 안 이전/다음/음성 듣기 바 */
  const canS=typeof canSpeak!=='undefined'&&canSpeak;
  folds.forEach((d,fIdx)=>{
    const fKey='f'+(d.dataset.i||(fIdx+1));
    if(p.seenCards.includes(fKey))d.classList.add('seen');
    const fb=d.querySelector('.fb');
    if(fb&&!fb.querySelector('.cp-fnav')){
      const nav=document.createElement('div');
      nav.className='cp-fnav';
      nav.innerHTML=`${canS?'<button type="button" class="cp-say">🔊 개념 듣기</button>':'<span></span>'}`+
        `<div class="cp-fnav-r">`+
        `<button type="button" class="cp-fprev" ${fIdx<=0?'disabled':''}>◀ 이전</button>`+
        `<span class="cp-fpos">${fIdx+1} / ${folds.length}</span>`+
        `<button type="button" class="cp-fnext" ${fIdx>=folds.length-1?'disabled':''}>다음 ▶</button>`+
        `</div>`;
      fb.prepend(nav);
      const sb=nav.querySelector('.cp-say');
      if(sb&&typeof speak==='function'){
        sb.onclick=()=>{
          const title=(d.querySelector('.ft b')||{}).textContent||'';
          const clone=fb.cloneNode(true);
          clone.querySelectorAll('.cp-fnav,script,canvas').forEach(x=>x.remove());
          speak(speakTextClean(title+'. '+clone.innerHTML),sb);
        };
      }
      const fp=nav.querySelector('.cp-fprev');
      const fn=nav.querySelector('.cp-fnext');
      if(fp)fp.onclick=()=>{if(fIdx>0){stopAudio();folds[fIdx-1].open=true}};
      if(fn)fn.onclick=()=>{if(fIdx<folds.length-1){stopAudio();folds[fIdx+1].open=true}};
    }
    d.addEventListener('toggle',()=>{
      stopAudio();
      if(d.open)markSeen(fKey,d);
    });
  });

  syncSeenUI();

  /* 6-4. 차시 말미 개념 확인 퀴즈(3문항) & 완료 시 p.concept = true + 5점 */
  const Q=window.CONCEPT_QUIZ&&window.CONCEPT_QUIZ[id];
  if(Q&&Q.length&&!body.querySelector('.cp-quiz')){
    const wasDone=!!p.concept;
    const quizCard=document.createElement('div');
    quizCard.className='card panel cp-quiz';
    const doneSet=new Set(p.conceptQuiz);
    const allSolved=()=>Q.every((_,i)=>doneSet.has(i));

    const header=document.createElement('div');
    header.className='cp-qh';
    header.innerHTML=`<h2>개념 확인 퀴즈</h2><span class="cp-seen ${allSolved()?'all':''}">${doneSet.size} / ${Q.length} 완료</span>`;
    quizCard.appendChild(header);

    const banner=document.createElement('div');
    banner.className='cp-qdone';
    if(allSolved()){
      banner.textContent='✓ 개념 확인 퀴즈 3문제를 모두 맞혔어요!';
    }else if(wasDone){
      banner.textContent='✓ 이전에 개념 보기를 마쳤어요. 아래 3문제로 핵심을 한 번 더 확인해 볼까요?';
    }else{
      banner.hidden=true;
    }
    quizCard.appendChild(banner);

    const lead=document.createElement('p');
    lead.className='muted';
    lead.style.margin='0 0 12px';
    lead.textContent=wasDone?'틀려도 힌트를 보고 다시 고를 수 있어요.':'세 문제를 모두 맞히면 개념 보기가 완료되고 5포인트(★)를 받아요.';
    quizCard.appendChild(lead);

    const list=document.createElement('div');
    list.className='cp-qlist';
    quizCard.appendChild(list);

    const badge=header.querySelector('.cp-seen');
    const markQuizConceptDone=()=>{
      p.concept=true;
      if(typeof save==='function')save();
      const tabBtn=document.querySelector('button.tab[data-tab="concept"]');
      if(tabBtn)tabBtn.classList.add('done');
      if(typeof award==='function')award(5,'concept:'+id,'개념 확인 퀴즈를 끝냈어요');
      banner.hidden=false;
      banner.textContent=wasDone
        ?'✓ 개념 확인 퀴즈 3문제를 모두 맞혔어요!'
        :'✓ 개념 확인 퀴즈 3문제를 모두 맞혀 개념 보기를 완료했어요! (+5★)';
    };

    Q.forEach((item,qi)=>{
      const box=document.createElement('div');
      box.className='cp-qitem'+(doneSet.has(qi)?' ok':'');
      box.innerHTML=`<div class="cp-qq"><span class="cp-qn">${doneSet.has(qi)?'✓':qi+1}</span><span>${item.q}</span></div>`+
        `<div class="cp-qopts">${item.choices.map(ch=>`<button type="button" class="cp-opt${doneSet.has(qi)&&ch===item.ans?' right':''}" ${doneSet.has(qi)?'disabled':''}>${ch}</button>`).join('')}</div>`+
        `<div class="cp-qmsg ${doneSet.has(qi)?'ok':''}" aria-live="polite">${doneSet.has(qi)?item.ok:''}</div>`;
      const msg=box.querySelector('.cp-qmsg');
      const opts=Array.from(box.querySelectorAll('.cp-opt'));
      opts.forEach((btn,ci)=>{
        const ch=item.choices[ci];
        btn.onclick=()=>{
          if(doneSet.has(qi))return;
          if(ch===item.ans){
            doneSet.add(qi);
            p.conceptQuiz=Array.from(doneSet);
            if(typeof save==='function')save();
            box.classList.add('ok');
            box.querySelector('.cp-qn').textContent='✓';
            opts.forEach((o,oi)=>{
              o.disabled=true;
              o.classList.remove('wrong');
              if(oi===ci)o.classList.add('right');
            });
            msg.className='cp-qmsg ok';
            msg.textContent=item.ok;
            badge.textContent=`${doneSet.size} / ${Q.length} 완료`;
            badge.classList.toggle('all',allSolved());
            if(allSolved())markQuizConceptDone();
          }else{
            btn.classList.add('wrong');
            msg.className='cp-qmsg hint';
            msg.textContent='💡 힌트: '+item.hint;
          }
        };
      });
      list.appendChild(box);
    });

    const nextRow=body.querySelector('.next-row');
    if(nextRow)body.insertBefore(quizCard,nextRow);
    else body.appendChild(quizCard);
  }
};

})();
