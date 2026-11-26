/* [T03] Ⅶ. 입체도형의 성질 — 3차시 「회전체」(rotation) · 4차시 「회전체의 성질」(rotprop) */
(()=>{
'use strict';
if(typeof LESSONS!=='undefined'&&Array.isArray(LESSONS)){
  LESSONS.forEach(l=>{if(l.id==='rotation'||l.id==='rotprop')l.ready=true});
}

const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',RD='#b83a3a',OK='#2b7a4b',GY='#94a3b8';
const MF="'Times New Roman',Times,serif";
const f1=n=>Math.round(n*10)/10;
const CIRC5=['①','②','③','④','⑤'];

/* ── SVG 도우미 (평면도형+회전축 · 회전체 · 단면) ── */
const rotBox=(w,h,inner,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="cfig" role="img" aria-label="${lab||'회전체 그림'}" style="max-width:${w}px;width:100%;font-family:${MF}">${inner}</svg>`;
const axLine=(x,y0,y1)=>`<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${RD}" stroke-width="2.2" stroke-dasharray="6 4"/>`+
  `<path d="M ${x-16} ${y0+10} C ${x-16} ${y0+2},${x+16} ${y0+2},${x+16} ${y0+10}" fill="none" stroke="${RD}" stroke-width="1.8"/>`+
  `<polygon points="${x+16},${y0+12} ${x+11},${y0+6} ${x+20},${y0+6}" fill="${RD}"/>`+
  `<text x="${x+9}" y="${y0+2}" font-size="16" font-style="italic" fill="${RD}">l</text>`;

function planeRotSVG(kind,opt={}){
  const ax=120,y0=26,y1=210,sh=opt.gap?48:0;
  let poly='';
  if(kind==='rect'){
    const w=opt.gap?38:56;
    poly=`<rect x="${ax+sh}" y="58" width="${w}" height="114" fill="${BLs}" stroke="${INK}" stroke-width="2.4"/>`;
    if(opt.r)poly+=`<text x="${ax+sh+w/2}" y="188" text-anchor="middle" font-size="16" fill="${INK}">${opt.r} cm</text>`;
    if(opt.h)poly+=`<text x="${ax+sh+w+8}" y="118" font-size="16" fill="${INK}">${opt.h} cm</text>`;
  }else if(kind==='tri'){
    const w=opt.gap?42:60;
    poly=`<polygon points="${ax+sh},62 ${ax+sh},172 ${ax+sh+w},172" fill="${BLs}" stroke="${INK}" stroke-width="2.4"/>`+
      `<rect x="${ax+sh}" y="160" width="11" height="12" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
    if(opt.r)poly+=`<text x="${ax+sh+w/2}" y="190" text-anchor="middle" font-size="16" fill="${INK}">${opt.r} cm</text>`;
    if(opt.h)poly+=`<text x="${ax+sh-8}" y="118" text-anchor="end" font-size="16" fill="${INK}">${opt.h} cm</text>`;
  }else if(kind==='trap'){
    poly=`<polygon points="${ax},62 ${ax+34},62 ${ax+64},172 ${ax},172" fill="${BLs}" stroke="${INK}" stroke-width="2.4"/>`+
      `<rect x="${ax}" y="160" width="11" height="12" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
    if(opt.r1)poly+=`<text x="${ax+17}" y="54" text-anchor="middle" font-size="15" fill="${INK}">${opt.r1} cm</text>`;
    if(opt.r2)poly+=`<text x="${ax+32}" y="190" text-anchor="middle" font-size="16" fill="${INK}">${opt.r2} cm</text>`;
    if(opt.h)poly+=`<text x="${ax-8}" y="118" text-anchor="end" font-size="16" fill="${INK}">${opt.h} cm</text>`;
  }else if(kind==='semi'){
    poly=`<path d="M ${ax} 60 A 56 56 0 0 1 ${ax} 172 Z" fill="${BLs}" stroke="${INK}" stroke-width="2.4"/>`;
    if(opt.r)poly+=`<line x1="${ax}" y1="116" x2="${ax+56}" y2="116" stroke="${BL}" stroke-width="1.8" stroke-dasharray="4 3"/>`+
      `<text x="${ax+28}" y="108" text-anchor="middle" font-size="15" fill="${BL}">${opt.r} cm</text>`;
  }else if(kind==='flag'){
    poly=`<rect x="${ax+26}" y="62" width="44" height="106" fill="${BLs}" stroke="${INK}" stroke-width="2.4"/>`+
      `<text x="${ax+13}" y="170" text-anchor="middle" font-size="13" fill="${HL}">빈틈</text>`;
  }
  return rotBox(260,224,poly+axLine(ax,y0,y1),opt.lab||'회전축과 평면도형');
}

function solidRotSVG(kind,opt={}){
  const cx=135,top=52,bot=180,rx=64,ry=18;
  let g='';
  if(kind==='cyl'){
    g=`<path d="M ${cx-rx} ${top} L ${cx-rx} ${bot} A ${rx} ${ry} 0 0 0 ${cx+rx} ${bot} L ${cx+rx} ${top} Z" fill="#eef3fb" stroke="${INK}" stroke-width="2.3"/>`+
      `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="#f8fbff" stroke="${INK}" stroke-width="2.2"/>`+
      `<path d="M ${cx-rx} ${bot} A ${rx} ${ry} 0 0 1 ${cx+rx} ${bot}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    if(opt.cut==='perp')g+=`<ellipse cx="${cx}" cy="${(top+bot)/2}" rx="${rx}" ry="${ry}" fill="${HLs}" fill-opacity="0.85" stroke="${HL}" stroke-width="2.6"/>`;
    if(opt.cut==='axis')g+=`<rect x="${cx-rx}" y="${top}" width="${2*rx}" height="${bot-top}" fill="${HLs}" fill-opacity="0.78" stroke="${HL}" stroke-width="2.6"/>`;
  }else if(kind==='cone'){
    g=`<path d="M ${cx} ${top-8} L ${cx-rx} ${bot} A ${rx} ${ry} 0 0 0 ${cx+rx} ${bot} Z" fill="#eef3fb" stroke="${INK}" stroke-width="2.3"/>`+
      `<path d="M ${cx-rx} ${bot} A ${rx} ${ry} 0 0 1 ${cx+rx} ${bot}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    if(opt.cut==='perp'){const r2=rx*0.55,y2=(top+bot)/2+10;g+=`<ellipse cx="${cx}" cy="${y2}" rx="${r2}" ry="${f1(ry*0.55)}" fill="${HLs}" fill-opacity="0.85" stroke="${HL}" stroke-width="2.6"/>`}
    if(opt.cut==='axis')g+=`<polygon points="${cx},${top-8} ${cx-rx},${bot} ${cx+rx},${bot}" fill="${HLs}" fill-opacity="0.78" stroke="${HL}" stroke-width="2.6"/>`;
    if(opt.part==='gen')g+=`<line x1="${cx}" y1="${top-8}" x2="${cx+rx}" y2="${bot}" stroke="${HL}" stroke-width="4.5"/>`;
  }else if(kind==='frust'){
    const rt=34;
    g=`<path d="M ${cx-rt} ${top+8} L ${cx-rx} ${bot} A ${rx} ${ry} 0 0 0 ${cx+rx} ${bot} L ${cx+rt} ${top+8} Z" fill="#eef3fb" stroke="${INK}" stroke-width="2.3"/>`+
      `<ellipse cx="${cx}" cy="${top+8}" rx="${rt}" ry="11" fill="#f8fbff" stroke="${INK}" stroke-width="2.2"/>`+
      `<path d="M ${cx-rx} ${bot} A ${rx} ${ry} 0 0 1 ${cx+rx} ${bot}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    if(opt.cut==='perp'){const r2=(rt+rx)/2,y2=(top+8+bot)/2;g+=`<ellipse cx="${cx}" cy="${y2}" rx="${r2}" ry="14" fill="${HLs}" fill-opacity="0.85" stroke="${HL}" stroke-width="2.6"/>`}
    if(opt.cut==='axis')g+=`<polygon points="${cx-rt},${top+8} ${cx+rt},${top+8} ${cx+rx},${bot} ${cx-rx},${bot}" fill="${HLs}" fill-opacity="0.78" stroke="${HL}" stroke-width="2.6"/>`;
  }else if(kind==='sph'){
    const cy=116,R=68;
    g=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#eef3fb" stroke="${INK}" stroke-width="2.3"/>`+
      `<path d="M ${cx-R} ${cy} A ${R} 20 0 0 0 ${cx+R} ${cy}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+
      `<path d="M ${cx-R} ${cy} A ${R} 20 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${INK}" stroke-width="1.3" stroke-dasharray="5 4"/>`;
    if(opt.cut)g+=`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="20" fill="${HLs}" fill-opacity="0.8" stroke="${HL}" stroke-width="2.5"/>`;
  }
  if(opt.axis!==false)g+=`<line x1="${cx}" y1="22" x2="${cx}" y2="206" stroke="${RD}" stroke-width="1.8" stroke-dasharray="5 4"/>`;
  if(opt.rLab)g+=`<line x1="${cx}" y1="${bot}" x2="${cx+rx}" y2="${bot}" stroke="${BL}" stroke-width="2.2"/><text x="${cx+rx/2}" y="${bot-10}" text-anchor="middle" font-size="16" fill="${BL}">${opt.rLab}</text>`;
  if(opt.hLab)g+=`<text x="${cx+rx+10}" y="${(top+bot)/2}" font-size="16" fill="${INK}">${opt.hLab}</text>`;
  if(opt.topLab)g+=`<line x1="${cx}" y1="${top+8}" x2="${cx+34}" y2="${top+8}" stroke="${BL}" stroke-width="2"/><text x="${cx+17}" y="${top}" text-anchor="middle" font-size="15" fill="${BL}">${opt.topLab}</text>`;
  return rotBox(270,220,g,opt.lab||'회전체');
}

/* ── 미리 보기 · 개념 카드 · 퀴즈 · 용어 ── */
if(typeof PREVIEW==='object'&&PREVIEW){
  PREVIEW.rotation={tb:'217~218쪽',
    core:[
      {h:'회전체와 회전축',b:'평면도형을 한 직선(<b>회전축</b>) 둘레로 1회전 시켜 만든 입체도형이에요.'},
      {h:'평면도형 ↔ 회전체',b:'직사각형 → <b>원기둥</b> · 직각삼각형 → <b>원뿔</b><br>사다리꼴 → <b>원뿔대</b> · 반원 → <b>구</b>'},
      {h:'원뿔대와 모선',b:'원뿔을 밑면에 평행하게 잘랐을 때 원뿔이 아닌 쪽이 <b>원뿔대</b>예요.'}
    ],
    words:['회전체','회전축','모선','원뿔대'],
    ex:'직각삼각형을 직각을 낀 변 둘레로 돌리면 <b>원뿔</b>이 돼요.'};
  PREVIEW.rotprop={tb:'219쪽',
    core:[
      {h:'수직으로 자르면?',b:'회전축에 <b>수직</b>인 평면으로 자르면 단면은 언제나 <b>원</b>이에요.'},
      {h:'회전축을 품고 자르면?',b:'단면은 모두 <b>합동</b>이고, 회전축에 대하여 <b>선대칭도형</b>이에요.'},
      {h:'네 가지 단면 모양',b:'원기둥 <b>직사각형</b> · 원뿔 <b>이등변삼각형</b><br>원뿔대 <b>등변사다리꼴</b> · 구 <b>원</b>'}
    ],
    words:['단면','선대칭도형','합동','등변사다리꼴'],
    ex:'원뿔(반지름 4 cm, 높이 6 cm)을 회전축을 품고 자르면 밑변이 <b>8 cm(지름!)</b>인 이등변삼각형'};
}

if(typeof PV_CARDS==='object'&&PV_CARDS){
  PV_CARDS.rotation=[
    {h:'회전체 만들기',t:'직사각형을 한 변 둘레로 돌리면 <b>원기둥</b>, 직각삼각형은 <b>원뿔</b>이 돼요.',
      figs:()=>[[planeRotSVG('rect'),null,'직사각형 → 원기둥'],[solidRotSVG('cyl'),null,'원기둥'],[planeRotSVG('tri'),null,'직각삼각형 → 원뿔']]},
    {h:'사다리꼴과 반원',t:'직각이 있는 사다리꼴을 돌리면 <b>원뿔대</b>, 반원은 <b>구</b>가 돼요.',
      figs:()=>[[planeRotSVG('trap'),null,'사다리꼴 → 원뿔대'],[solidRotSVG('frust'),null,'원뿔대'],[planeRotSVG('semi'),null,'반원 → 구']]},
    {h:'다면체와 구별하기',t:'회전체는 옆면이나 겉면에 <b>굽은 면(원)</b>이 있어요. 각기둥·각뿔·정다면체는 회전체가 아니에요.',
      figs:()=>[[solidRotSVG('cone',{part:'gen'}),null,'원뿔 (모선 강조)'],[planeRotSVG('flag'),null,'축에서 떨어뜨리면 구멍!']]}
  ];
  PV_CARDS.rotprop=[
    {h:'회전축에 수직으로 자른 단면',t:'원기둥·원뿔·원뿔대·구 모두 회전축에 <b>수직</b>으로 자르면 단면은 항상 <b>원</b>이에요.',
      figs:()=>[[solidRotSVG('cyl',{cut:'perp'}),null,'원기둥 수직 단면 = 원'],[solidRotSVG('cone',{cut:'perp'}),null,'원뿔 수직 단면 = 크기 다른 원']]},
    {h:'회전축을 포함해 자른 단면',t:'단면은 모두 <b>합동</b>이고 <b>선대칭도형</b>이에요. 밑변 길이는 반지름의 <b>2배(지름)</b>!',
      figs:()=>[[solidRotSVG('cone',{cut:'axis',rLab:'r',hLab:'h'}),null,'원뿔 → 이등변삼각형 (밑변 2r)'],[solidRotSVG('frust',{cut:'axis'}),null,'원뿔대 → 등변사다리꼴']]},
    {h:'원뿔·원뿔대 단면 주의점',t:'원뿔을 축을 포함해 자르면 정삼각형이 아니라 <b>이등변삼각형</b>이에요.',
      figs:()=>[[solidRotSVG('cyl',{cut:'axis'}),null,'원기둥 → 직사각형'],[solidRotSVG('sph',{cut:'perp'}),null,'구 → 어느 방향이든 원']]}
  ];
}

if(typeof CONCEPT==='object'){
  CONCEPT.rotation=body=>{
    body.innerHTML=foldPanel('회전체',`<p class="lead">평면도형을 한 직선(<b>회전축</b>)을 축으로 하여 1회전 시킬 때 생기는 입체도형이 <b>회전체</b>예요.</p>`,
      fold(1,'네 가지 대표 회전체','돌리는 평면도형과 짝짓기',`<div class="duo"><div class="figbox">${planeRotSVG('rect')}</div><div class="figbox">${solidRotSVG('cyl')}</div></div><p>직사각형 → <b>원기둥</b>, 직각삼각형 → <b>원뿔</b>, 직각이 있는 사다리꼴 → <b>원뿔대</b>, 반원 → <b>구</b>예요.</p>`,true)+
      fold(2,'회전축 · 모선 · 원뿔대','이름 뜻 익히기',`<div class="figbox">${solidRotSVG('cone',{part:'gen'})}</div><p>· <b>회전축</b>: 돌릴 때 기준이 되는 직선<br>· <b>모선</b>: 돌려서 원기둥·원뿔·원뿔대의 옆면을 만드는 선분<br>· <b>원뿔대</b>: 원뿔을 밑면에 평행한 평면으로 잘랐을 때 원뿔이 아닌 쪽</p>`)+
      fold(3,'회전체가 아닌 도형과 구멍 뚫린 회전체','다면체와 구별하기',`<div class="figbox">${planeRotSVG('flag')}</div><p>각기둥·각뿔·정다면체는 모든 면이 다각형이라 회전체가 아니에요. 또 도형이 회전축에서 떨어져 있으면 가운데가 뚫린 회전체가 돼요.</p>`));
    wireFolds(body,'rotation');
  };
  CONCEPT.rotprop=body=>{
    body.innerHTML=foldPanel('회전체의 성질',`<p class="lead">회전체를 <b>어느 방향</b>으로 자르느냐에 따라 단면의 모양이 달라져요.</p>`,
      fold(1,'성질 ① 회전축에 수직인 단면','언제나 원이에요',`<div class="duo"><div class="figbox">${solidRotSVG('cyl',{cut:'perp'})}</div><div class="figbox">${solidRotSVG('cone',{cut:'perp'})}</div></div><p>원기둥·원뿔·원뿔대·구 모두 회전축에 수직으로 자르면 단면의 모양은 항상 <b>원</b>이에요. 단, 원뿔과 원뿔대는 자르는 위치에 따라 원의 크기가 달라져요.</p>`,true)+
      fold(2,'성질 ② 회전축을 포함하는 단면','모두 합동 · 선대칭도형',`<div class="duo"><div class="figbox">${solidRotSVG('cone',{cut:'axis',rLab:'r',hLab:'h'})}</div><div class="figbox">${solidRotSVG('frust',{cut:'axis'})}</div></div><p>원기둥 → <b>직사각형</b>, 원뿔 → <b>이등변삼각형</b>, 원뿔대 → <b>등변사다리꼴</b>, 구 → <b>원</b>.<br>이 단면은 돌리기 전 평면도형을 회전축에 대칭으로 2배 붙인 모양이라 밑변이 <b>지름(2r)</b>이 돼요.</p>`));
    wireFolds(body,'rotprop');
  };
}

Object.assign(window.CONCEPT_QUIZ=window.CONCEPT_QUIZ||{},{
  rotation:[
    {q:'직각삼각형을 직각을 낀 한 변을 축으로 1회전 시키면 어떤 입체도형이 되나요?',choices:['원뿔','원기둥','원뿔대','삼각뿔'],ans:'원뿔',hint:'한쪽 끝이 뾰족하고 밑면이 원이에요.',ok:'직각삼각형을 돌리면 밑면이 원인 원뿔이 돼요.'},
    {q:'다음 중 회전체가 <b>아닌</b> 것은?',choices:['정팔면체','원기둥','원뿔대','구'],ans:'정팔면체',hint:'모든 면이 다각형인 다면체를 찾아요.',ok:'정팔면체는 정삼각형 8개로 이루어진 다면체예요.'},
    {q:'원뿔을 밑면에 평행한 평면으로 잘랐을 때 원뿔이 아닌 쪽을 무엇이라 하나요?',choices:['원뿔대','각뿔대','원기둥','반구'],ans:'원뿔대',hint:'각뿔을 잘라 만든 각뿔대와 이름을 비교해 보세요.',ok:'원뿔을 밑면에 평행하게 자른 나머지 입체를 원뿔대라고 해요.'}
  ],
  rotprop:[
    {q:'모든 회전체를 회전축에 <b>수직</b>인 평면으로 잘랐을 때 생기는 단면의 모양은?',choices:['원','직사각형','이등변삼각형','사다리꼴'],ans:'원',hint:'빙글빙글 돌며 만든 입체라 수직으로 자르면 둥근 테두리가 나와요.',ok:'수직 단면은 언제나 원이에요.'},
    {q:'원뿔을 회전축을 <b>포함</b>하는 평면으로 자른 단면의 모양은?',choices:['이등변삼각형','정삼각형','직사각형','원'],ans:'이등변삼각형',hint:'양쪽 모선의 길이가 같은 삼각형이에요.',ok:'양쪽 모선이 같으므로 이등변삼각형이에요.'},
    {q:'밑면의 반지름이 5 cm, 높이가 8 cm인 원뿔을 회전축을 포함해 자른 삼각형 단면의 밑변 길이는?',choices:['10 cm','5 cm','8 cm','15 cm'],ans:'10 cm',hint:'단면의 밑변은 반지름이 아니라 밑면의 지름이에요.',ok:'지름 = 5 × 2 = 10 cm예요.'}
  ]
});

/* ── 탐구 활동 ── */
if(typeof EXPLORE==='object'){
  EXPLORE.rotation=body=>{
    const items=[
      {k:'rect',nm:'직사각형',res:'원기둥',why:'위아래 크기가 같은 두 원과 둥근 옆면 → 원기둥'},
      {k:'tri',nm:'직각삼각형',res:'원뿔',why:'아래는 원, 위는 뾰족한 꼭짓점 → 원뿔'},
      {k:'trap',nm:'사다리꼴',res:'원뿔대',why:'위아래 크기가 다른 두 원 → 원뿔대'},
      {k:'semi',nm:'반원',res:'구',why:'둥근 공 모양 → 구'}
    ];
    let cur=0,spun=false;
    const draw=()=>{
      const it=items[cur];
      body.innerHTML=`<div class="card panel"><div class="explore">
        <div class="stage" style="padding:12px">${spun?solidRotSVG(it.k==='rect'?'cyl':it.k==='tri'?'cone':it.k==='trap'?'frust':'sph'):planeRotSVG(it.k)}</div>
        <div class="ctrl"><h2 style="margin-top:0">${it.nm}을 1회전 시키면?</h2>
          <div class="chips">${items.map((x,i)=>`<button type="button" class="chip${i===cur?' on':''}" data-i="${i}">${x.nm}</button>`).join('')}</div>
          <button type="button" class="btn primary" id="rotSpin">${spun?'원래 평면도형 보기':'1회전 시켜 보기 ↻'}</button>
          <div class="feedback ${spun?'ok':'info'}">${spun?`<b>${it.res}</b>! ${it.why}`:'평면도형을 고르고 "1회전 시켜 보기"를 눌러 보세요.'}</div>
        </div></div></div>`;
      $$('[data-i]',body).forEach(b=>b.onclick=()=>{cur=+b.dataset.i;spun=false;draw()});
      const sb=$('#rotSpin',body);if(sb)sb.onclick=()=>{spun=!spun;if(spun&&typeof award==='function')award(2,'rot:'+it.k,'회전체를 확인했어요');draw()};
    };
    draw();
  };
  EXPLORE.rotprop=body=>{
    const items=[
      {k:'cyl',nm:'원기둥',perp:'항상 합동인 원',axis:'직사각형'},
      {k:'cone',nm:'원뿔',perp:'크기가 다른 원',axis:'이등변삼각형'},
      {k:'frust',nm:'원뿔대',perp:'크기가 다른 원',axis:'등변사다리꼴'},
      {k:'sph',nm:'구',perp:'원 (중심을 지날 때 가장 큼)',axis:'원'}
    ];
    let cur=0,cut='perp';
    const draw=()=>{
      const it=items[cur];
      body.innerHTML=`<div class="card panel"><div class="explore">
        <div class="stage" style="padding:12px">${solidRotSVG(it.k,{cut})}</div>
        <div class="ctrl"><h2 style="margin-top:0">${it.nm}을 잘라 보기</h2>
          <div class="chips">${items.map((x,i)=>`<button type="button" class="chip${i===cur?' on':''}" data-i="${i}">${x.nm}</button>`).join('')}</div>
          <div class="seg" style="margin:10px 0">
            <button type="button" class="${cut==='perp'?'on':''}" data-c="perp">회전축에 수직으로 자르기</button>
            <button type="button" class="${cut==='axis'?'on':''}" data-c="axis">회전축을 포함해 자르기</button>
          </div>
          <div class="feedback ok">단면 모양: <b>${cut==='perp'?it.perp:it.axis}</b></div>
        </div></div></div>`;
      $$('[data-i]',body).forEach(b=>b.onclick=()=>{cur=+b.dataset.i;draw()});
      $$('[data-c]',body).forEach(b=>b.onclick=()=>{cut=b.dataset.c;if(typeof award==='function')award(2,'rprop:'+it.k+cut,'단면을 확인했어요');draw()});
    };
    draw();
  };
}

/* ── 문제 생성기: 3차시 rotation ── */
GEN.rotIs=seed=>{
  const r=mulberry(seed);
  const pool=[
    {nm:'원기둥',rot:true,why:'직사각형을 1회전 시켜 만든 회전체예요.'},
    {nm:'원뿔',rot:true,why:'직각삼각형을 1회전 시켜 만든 회전체예요.'},
    {nm:'원뿔대',rot:true,why:'직각이 있는 사다리꼴을 1회전 시켜 만든 회전체예요.'},
    {nm:'구',rot:true,why:'반원을 1회전 시켜 만든 회전체예요.'},
    {nm:'삼각기둥',rot:false,why:'모든 면이 다각형(다면체)이라 회전체가 아니에요.'},
    {nm:'사각뿔',rot:false,why:'밑면이 사각형인 다면체라 회전체가 아니에요.'},
    {nm:'정팔면체',rot:false,why:'정삼각형 8개로 이루어진 정다면체예요.'},
    {nm:'육각기둥',rot:false,why:'다각형인 면으로만 이루어진 다면체예요.'}
  ];
  const rots=shuffle(r,pool.filter(x=>x.rot)),nons=shuffle(r,pool.filter(x=>!x.rot));
  const askRot=r()<0.55;
  const pickOne=askRot?rots[0]:nons[0],others=(askRot?nons:rots).slice(0,3);
  const all=shuffle(r,[pickOne,...others]);
  const ch=all.map((x,i)=>`${CIRC5[i]} ${x.nm}`);
  const ans=ch[all.indexOf(pickOne)];
  return{
    ptype:'rotation:is',
    title:`다음 중 <b>${askRot?'회전체인':'회전체가 아닌'}</b> 입체도형은?`,
    fig:null,
    steps:[{q:'알맞은 것을 고르세요.',type:'choice',choices:ch,ans,hint:'회전체는 둥근(굽은) 면을 가진 원기둥·원뿔·원뿔대·구예요.',ok:`${pickOne.nm}: ${pickOne.why}`}]
  };
};

GEN.rotMake=seed=>{
  const r=mulberry(seed);
  const specs=[
    {k:'rect',nm:'직사각형',desc:'한 변을 축으로',ans:'원기둥',why:'위아래 밑면의 크기가 똑같은 원기둥이 돼요.'},
    {k:'tri',nm:'직각삼각형',desc:'직각을 낀 한 변을 축으로',ans:'원뿔',why:'위가 뾰족하고 밑면이 원인 원뿔이 돼요.'},
    {k:'trap',nm:'직각이 있는 사다리꼴',desc:'양 끝이 직각인 변을 축으로',ans:'원뿔대',why:'위아래 반지름이 다른 원뿔대가 돼요.'},
    {k:'semi',nm:'반원',desc:'지름을 축으로',ans:'구',why:'어느 방향에서 보아도 둥근 구가 돼요.'}
  ];
  const sp=specs[seed%specs.length];
  return{
    ptype:'rotation:make',
    title:`다음 평면도형을 직선 <i>l</i>을 회전축으로 하여 1회전 시킬 때 생기는 입체도형은?`,
    fig:{svg:()=>`<div class="figbox">${planeRotSVG(sp.k)}</div>`},
    finalQ:'생기는 회전체는 무엇인가요?',
    steps:[
      {tag:'회전축과 닿은 모양 보기',q:`이 ${sp.nm}을 돌렸을 때 위쪽과 아래쪽 끝 모양은 어떤가요?`,type:'choice',choices:['위아래 모두 같은 크기의 원','아래는 원, 위는 뾰족한 점','위아래가 크기가 다른 두 원','전체가 둥근 공 모양'],
        ans:sp.k==='rect'?'위아래 모두 같은 크기의 원':sp.k==='tri'?'아래는 원, 위는 뾰족한 점':sp.k==='trap'?'위아래가 크기가 다른 두 원':'전체가 둥근 공 모양',
        hint:'회전축과 닿은 위·아래 변의 길이를 비교해 보세요.'},
      {tag:'회전체 이름 고르기',q:'만들어지는 회전체는?',type:'choice',choices:['원기둥','원뿔','원뿔대','구'],ans:sp.ans,hint:'대표 회전체 4가지를 떠올려 보세요.',ok:sp.why}
    ]
  };
};

GEN.rotPart=seed=>{
  const r=mulberry(seed);
  const specs=[
    {s:'cyl',nm:'원기둥',ans:'직사각형',hint:'위아래 반지름의 길이가 같아요.'},
    {s:'cone',nm:'원뿔',ans:'직각삼각형',hint:'꼭짓점이 회전축 위에 있고 직각을 낀 변으로 돌렸어요.'},
    {s:'frust',nm:'원뿔대',ans:'직각이 있는 사다리꼴',hint:'위쪽 반지름과 아래쪽 반지름이 달라요.'},
    {s:'sph',nm:'구',ans:'반원',hint:'지름을 회전축으로 돌려요.'}
  ];
  const sp=specs[seed%specs.length];
  return{
    ptype:'rotation:part',
    title:`그림의 <b>${sp.nm}</b>을 만들기 위해 직선 <i>l</i>을 축으로 1회전 시켜야 하는 평면도형은?`,
    fig:{svg:()=>`<div class="figbox">${solidRotSVG(sp.s,{})}</div>`},
    steps:[{q:'회전시키기 전 평면도형은?',type:'choice',choices:['직사각형','직각삼각형','직각이 있는 사다리꼴','반원'],ans:sp.ans,hint:sp.hint,ok:`${sp.ans}을 1회전 시키면 ${sp.nm}이 돼요.`}]
  };
};

const ROT_T=[
  '원뿔을 밑면에 평행한 평면으로 자를 때 생기는 두 입체도형 중 원뿔이 아닌 쪽이 원뿔대이다.',
  '구는 회전축이 무수히 많다.',
  '원뿔대의 두 밑면은 서로 평행하지만 합동이 아니다.',
  '직각삼각형을 직각을 낀 변을 축으로 1회전 시키면 원뿔이 된다.',
  '원뿔에서 회전축을 품은 옆면을 만드는 선분을 모선이라고 한다.',
  '반원을 지름을 축으로 1회전 시키면 구가 된다.'
];
const ROT_F=[
  ['원뿔대의 두 밑면은 서로 합동이다.','원뿔대의 두 밑면은 크기가 다른 원이므로 합동이 아니에요.'],
  ['사각뿔은 회전체이다.','사각뿔은 다각형 면으로만 이루어진 다면체예요.'],
  ['원기둥의 회전축은 정할 수 없다.','원기둥의 두 밑면의 중심을 지나는 직선이 회전축이에요.'],
  ['반원을 회전축 둘레로 돌리면 반구가 된다.','반원을 1회전 시키면 온전한 구가 돼요.']
];
GEN.rotTF=seed=>{
  const r=mulberry(seed);
  const [fs,why]=pick(r,ROT_F);
  const ts=shuffle(r,ROT_T.slice()).slice(0,3);
  const all=shuffle(r,[...ts,fs]),lab=all.map((x,i)=>`${CIRC5[i]} ${x}`);
  return{
    ptype:'rotation:tf',
    title:'다음 중 회전체에 대한 설명으로 <u>옳지 않은</u> 것은?',
    fig:null,
    steps:[{q:'옳지 않은 것을 고르세요.',type:'choice',choices:lab,ans:lab[all.indexOf(fs)],hint:'원뿔대·구·다면체와의 차이를 하나씩 떠올려 보세요.',ok:why}]
  };
};

GEN.rotation=seed=>[GEN.rotIs,GEN.rotMake,GEN.rotPart,GEN.rotTF][seed%4](seed);
GEN.rotationStep=seed=>GEN.rotMake(seed);

/* ── 문제 생성기: 4차시 rotprop ── */
GEN.rotpPerp=seed=>{
  const r=mulberry(seed);
  const s=pick(r,['cyl','cone','frust','sph']);
  const nm={cyl:'원기둥',cone:'원뿔',frust:'원뿔대',sph:'구'}[s];
  if(r()<0.45){
    const rr=ri(r,2,9);
    return{
      ptype:'rotprop:perp',
      title:`밑면의 반지름이 ${rr} cm인 <b>원기둥</b>을 회전축에 수직인 평면으로 잘랐어요. 단면의 <b>넓이</b>를 구하시오.`,
      fig:{svg:()=>`<div class="figbox">${solidRotSVG('cyl',{cut:'perp',rLab:rr+' cm'})}</div>`},
      finalQ:'단면의 넓이는 몇 cm²인가요?',
      steps:[
        {tag:'단면의 모양',q:'회전축에 수직으로 자른 단면의 모양은?',type:'choice',choices:['원','직사각형','이등변삼각형','등변사다리꼴'],ans:'원',hint:'회전축에 수직으로 자르면 어느 회전체든 원이 나와요.'},
        {tag:'원의 넓이 구하기',q:`반지름이 ${rr} cm인 원의 넓이는? (가로 ${rr}π × 세로 ${rr})`,type:'pi',ans:rr*rr,suffix:'cm²',hint:`반둘레 ${rr}π × 반지름 ${rr}`,ok:`${rr*rr}π cm²`}
      ]
    };
  }
  return{
    ptype:'rotprop:perp',
    title:`<b>${nm}</b>을 회전축에 <b>수직</b>인 평면으로 잘랐을 때 생기는 단면의 모양은?`,
    fig:{svg:()=>`<div class="figbox">${solidRotSVG(s,{cut:'perp'})}</div>`},
    steps:[{q:'단면의 모양을 고르세요.',type:'choice',choices:['원','직사각형','이등변삼각형','등변사다리꼴'],ans:'원',hint:'회전축에 수직인 평면으로 자르면 항상 둥근 모양이 돼요.',ok:`${nm}을 회전축에 수직으로 자르면 항상 원이에요.`}]
  };
};

GEN.rotpAxis=seed=>{
  const r=mulberry(seed);
  const specs=[
    {s:'cyl',nm:'원기둥',ans:'직사각형',hint:'마주 보는 변이 평행하고 네 각이 직각이에요.'},
    {s:'cone',nm:'원뿔',ans:'이등변삼각형',hint:'양쪽 모선의 길이가 같고 밑면은 지름이에요.'},
    {s:'frust',nm:'원뿔대',ans:'등변사다리꼴',hint:'위아래가 평행하고 양쪽 모선의 길이가 같은 사다리꼴이에요.'},
    {s:'sph',nm:'구',ans:'원',hint:'구는 어느 방향으로 잘라도 원이 나와요.'}
  ];
  const sp=specs[seed%specs.length];
  return{
    ptype:'rotprop:axis',
    title:`<b>${sp.nm}</b>을 <b>회전축을 포함</b>하는 평면으로 잘랐을 때 생기는 단면의 모양은?`,
    fig:{svg:()=>`<div class="figbox">${solidRotSVG(sp.s,{cut:'axis'})}</div>`},
    steps:[{q:'단면의 모양은?',type:'choice',choices:['직사각형','이등변삼각형','등변사다리꼴','정삼각형','원'],ans:sp.ans,hint:sp.hint,ok:`${sp.nm}을 회전축을 포함해 자르면 ${sp.ans}이에요.`}]
  };
};

GEN.rotpSize=seed=>{
  const r=mulberry(seed);
  const kind=pick(r,['cyl','cone','frust']);
  if(kind==='cyl'){
    const rad=ri(r,2,7),h=ri(r,4,12),d=2*rad,ans=d*h;
    return{
      ptype:'rotprop:size',
      title:`밑면의 반지름이 ${rad} cm, 높이가 ${h} cm인 <b>원기둥</b>을 회전축을 포함하는 평면으로 잘랐을 때 단면의 넓이를 구하시오.`,
      fig:{svg:()=>`<div class="figbox">${solidRotSVG('cyl',{cut:'axis',rLab:rad+' cm',hLab:h+' cm'})}</div>`},
      finalQ:'단면의 넓이는 몇 cm²인가요?',
      steps:[
        {tag:'단면 모양 확인',q:'단면은 어떤 모양인가요?',type:'choice',choices:['직사각형','이등변삼각형','등변사다리꼴'],ans:'직사각형',hint:'회전축을 품은 원기둥의 단면이에요.'},
        {tag:'가로 = 밑면의 지름',q:`직사각형의 가로 길이는 밑면의 <b>지름</b>이에요. 몇 cm인가요?`,type:'num',ans:d,suffix:'cm',hint:`반지름이 ${rad} cm이므로 지름은 ${rad} × 2`},
        {tag:'단면 넓이 구하기',q:`가로 ${d} cm, 세로 ${h} cm인 직사각형의 넓이는?`,type:'num',ans:ans,suffix:'cm²',hint:`${d} × ${h}`,ok:`지름 ${d} × 높이 ${h} = ${ans} cm²`}
      ]
    };
  }
  if(kind==='cone'){
    const rad=ri(r,2,7),h=ri(r,4,12),d=2*rad,ans=d*h/2;
    return{
      ptype:'rotprop:size',
      title:`밑면의 반지름이 ${rad} cm, 높이가 ${h} cm인 <b>원뿔</b>을 회전축을 포함하는 평면으로 잘랐을 때 단면의 넓이를 구하시오.`,
      fig:{svg:()=>`<div class="figbox">${solidRotSVG('cone',{cut:'axis',rLab:rad+' cm',hLab:h+' cm'})}</div>`},
      finalQ:'단면의 넓이는 몇 cm²인가요?',
      steps:[
        {tag:'단면 모양 확인',q:'단면은 어떤 모양인가요?',type:'choice',choices:['직사각형','이등변삼각형','등변사다리꼴'],ans:'이등변삼각형',hint:'양쪽 모선 길이가 같은 삼각형이에요.'},
        {tag:'밑변 = 밑면의 지름',q:'이등변삼각형의 밑변의 길이는 몇 cm인가요?',type:'num',ans:d,suffix:'cm',hint:`반지름이 ${rad} cm이므로 지름은 ${rad} × 2`},
        {tag:'삼각형 넓이 (÷ 2)',q:`밑변 ${d} cm, 높이 ${h} cm인 삼각형의 넓이는?`,type:'num',ans:ans,suffix:'cm²',hint:`${d} × ${h} ÷ 2`,ok:`${d} × ${h} ÷ 2 = ${ans} cm²`}
      ]
    };
  }
  const r1=ri(r,2,4),r2=r1+ri(r,2,4),h=ri(r,4,10),d1=2*r1,d2=2*r2,ans=(d1+d2)*h/2;
  return{
    ptype:'rotprop:size',
    title:`두 밑면의 반지름이 각각 ${r1} cm, ${r2} cm이고 높이가 ${h} cm인 <b>원뿔대</b>를 회전축을 포함하는 평면으로 잘랐을 때 단면의 넓이를 구하시오.`,
    fig:{svg:()=>`<div class="figbox">${solidRotSVG('frust',{cut:'axis',topLab:r1+' cm',rLab:r2+' cm',hLab:h+' cm'})}</div>`},
    finalQ:'단면의 넓이는 몇 cm²인가요?',
    steps:[
      {tag:'윗변과 아랫변 (각각 지름)',q:`윗변(위 밑면 지름) + 아랫변(아래 밑면 지름) = ${d1} + ${d2} = ?`,type:'num',ans:d1+d2,suffix:'cm',hint:`지름은 반지름의 2배 → ${2*r1} + ${2*r2}`},
      {tag:'사다리꼴 넓이 구하기',q:`(윗변+아랫변) ${d1+d2} cm × 높이 ${h} cm ÷ 2 = ?`,type:'num',ans:ans,suffix:'cm²',hint:`(${d1} + ${d2}) × ${h} ÷ 2`,ok:`등변사다리꼴 넓이 = ${ans} cm²`}
    ]
  };
};

const RP_T=[
  '회전체를 회전축에 수직인 평면으로 자른 단면의 경계는 항상 원이다.',
  '회전체를 회전축을 포함하는 평면으로 자른 단면은 모두 합동이다.',
  '회전체를 회전축을 포함하는 평면으로 자른 단면은 회전축에 대하여 선대칭도형이다.',
  '구는 어느 방향으로 자르든 단면이 항상 원이다.',
  '원기둥을 회전축을 포함하는 평면으로 자른 단면은 직사각형이다.',
  '원뿔을 회전축을 포함하는 평면으로 자른 단면은 이등변삼각형이다.'
];
const RP_F=[
  ['원뿔을 회전축에 수직인 평면으로 자른 단면은 모두 합동이다.','자르는 높이에 따라 원의 크기가 달라져서 합동이 아니에요.'],
  ['원뿔을 회전축을 포함하는 평면으로 자른 단면은 항상 정삼각형이다.','지름과 모선 길이가 같을 필요는 없으므로 보통 이등변삼각형이에요.'],
  ['원뿔대를 회전축을 포함하는 평면으로 자른 단면은 직사각형이다.','원뿔대의 단면은 등변사다리꼴이에요.'],
  ['원기둥을 어느 방향으로 잘라도 단면이 항상 원이다.','원기둥을 회전축을 포함해 자르면 직사각형이 나와요.']
];
GEN.rotpTF=seed=>{
  const r=mulberry(seed);
  const [fs,why]=pick(r,RP_F),ts=shuffle(r,RP_T.slice()).slice(0,3);
  const all=shuffle(r,[...ts,fs]),lab=all.map((x,i)=>`${CIRC5[i]} ${x}`);
  return{
    ptype:'rotprop:tf',
    title:'다음 중 회전체의 단면에 대한 설명으로 <u>옳지 않은</u> 것은?',
    fig:null,
    steps:[{q:'옳지 않은 것을 고르세요.',type:'choice',choices:lab,ans:lab[all.indexOf(fs)],hint:'수직으로 잘랐는지, 회전축을 포함해 잘랐는지 구별해요.',ok:why}]
  };
};

GEN.rotprop=seed=>[GEN.rotpPerp,GEN.rotpAxis,GEN.rotpSize,GEN.rotpTF][seed%4](seed);
GEN.rotpropStep=seed=>GEN.rotpSize(seed);

/* ── PTYPES & 전역 계약 등록 ── */
Object.assign(PTYPES,{
  rotation:[
    {no:1,nm:'회전체인지 가려내기',tb:'217~220쪽',key:'<b>굽은 면</b>으로 둘러싸인 원기둥·원뿔·원뿔대·구가 회전체예요. 각기둥·각뿔·정다면체는 다면체(✕)!',pt:['rotation:is'],src:['rotIs']},
    {no:2,nm:'평면도형 돌려 회전체 만들기',tb:'218쪽 1번',key:'직사각형→<b>원기둥</b> · 직각삼각형→<b>원뿔</b> · 사다리꼴→<b>원뿔대</b> · 반원→<b>구</b>',pt:['rotation:make'],src:['rotMake']},
    {no:3,nm:'돌리기 전 평면도형 찾기',tb:'218쪽 2번',key:'회전체를 회전축으로 <b>딱 반</b> 자른 한쪽 평면도형을 떠올려요.',pt:['rotation:part'],src:['rotPart']},
    {no:4,nm:'회전체 · 원뿔대 성질 ○×',tb:'217~220쪽',key:'원뿔대의 두 밑면은 평행하지만 <b>합동이 아님</b> · 모선은 옆면을 만드는 선분',pt:['rotation:tf'],src:['rotTF']}
  ],
  rotprop:[
    {no:1,nm:'회전축에 수직인 단면',tb:'219쪽',key:'어느 회전체든 회전축에 <b>수직</b>으로 자르면 단면은 항상 <b>원</b>이에요.',pt:['rotprop:perp'],src:['rotpPerp']},
    {no:2,nm:'회전축을 포함한 단면 모양',tb:'219쪽 3번',key:'원기둥 <b>직사각형</b> · 원뿔 <b>이등변삼각형</b> · 원뿔대 <b>등변사다리꼴</b> · 구 <b>원</b>',pt:['rotprop:axis'],src:['rotpAxis']},
    {no:3,nm:'축 포함 단면의 넓이 (지름 주의!)',tb:'219~220쪽',key:'단면의 밑변 길이는 반지름이 아니라 <b>지름(2r)</b>! 합동인 2배 폭을 잊지 마세요.',pt:['rotprop:size'],src:['rotpSize']},
    {no:4,nm:'회전체 단면 성질 ○×',tb:'220쪽 1번',key:'축 포함 단면: 모두 <b>합동</b>이고 <b>선대칭도형</b> · 원뿔 수직 단면은 크기가 다름!',pt:['rotprop:tf'],src:['rotpTF']}
  ]
});

['rotation','rotprop'].forEach(lid=>{
  PTYPES[lid].forEach(T_=>{
    const g=tyKey(lid,T_.no);
    GEN[g]=seed=>GEN[T_.src[0]](seed);
    LESSON_OF[g]=lid;
  });
  GEN['mix_'+lid]=seed=>{
    const L=PTYPES[lid];
    return GEN[tyKey(lid,L[seed%L.length].no)](Math.floor(seed/L.length)+1);
  };
  LESSON_OF['mix_'+lid]=lid;
  LESSON_OF[lid]=lid;
});
['rotIs','rotMake','rotPart','rotTF','rotationStep'].forEach(g=>LESSON_OF[g]='rotation');
['rotpPerp','rotpAxis','rotpSize','rotpTF','rotpropStep'].forEach(g=>LESSON_OF[g]='rotprop');
Object.assign(STEPGEN,{rotation:GEN.rotationStep,rotprop:GEN.rotpropStep});
Object.assign(CALC_FOR,{rotation:['facts','mul'],rotprop:['area','mul','pi']});
Object.assign(PTYPE_NM,{
  'rotation:is':'3차시 · 회전체 가려내기','rotation:make':'3차시 · 회전체 만들기',
  'rotation:part':'3차시 · 돌리기 전 도형','rotation:tf':'3차시 · 회전체 ○×',
  'rotprop:perp':'4차시 · 수직 단면','rotprop:axis':'4차시 · 축 포함 단면 모양',
  'rotprop:size':'4차시 · 축 포함 단면 넓이','rotprop:tf':'4차시 · 단면 성질 ○×'
});

const addT=(k,o)=>{if(typeof TERMS==='object'&&TERMS&&!TERMS[k])TERMS[k]=o};
addT('회전체',{k:'1학년 · 입체도형',b:'<p>평면도형을 한 직선(회전축)을 축으로 하여 1회전 시킬 때 생기는 입체도형이에요. 원기둥·원뿔·원뿔대·구가 있어요.</p>'});
addT('회전축',{k:'1학년 · 회전체',b:'<p>평면도형을 1회전 시킬 때 기준이 되는 직선이에요.</p>'});
addT('모선',{k:'1학년 · 회전체',b:'<p>회전체의 옆면을 이루는 선분이에요. 원뿔이나 원뿔대의 옆면 바깥쪽 기울어진 선분 길이를 모선이라고 해요.</p>'});
addT('원뿔대',{k:'1학년 · 회전체',b:'<p>원뿔을 밑면에 평행한 평면으로 자를 때 생기는 두 입체도형 중 원뿔이 아닌 쪽이에요. 두 밑면은 크기가 다른 원이에요.</p>'});
addT('단면',{k:'1학년 · 입체도형',b:'<p>입체도형을 평면으로 잘랐을 때 생기는 잘린 면이에요.</p>'});
addT('선대칭도형',{k:'초등 · 대칭',b:'<p>한 직선을 따라 접었을 때 완전히 겹쳐지는 평면도형이에요. 회전체를 회전축을 포함해 자른 단면은 모두 회전축에 대해 선대칭도형이에요.</p>'});
})();