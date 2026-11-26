/* ───────── 꾸미기: 무료 에셋 (08-deco.js) ─────────
   - 아이콘: Microsoft Fluent Emoji 3D (MIT) → assets/emoji/*.webp (96px)
   - 축하 효과: canvas-confetti (ISC) → assets/vendor/confetti.browser.js
   화면을 그리는 코드는 건드리지 않고, 그려진 화면에 아이콘만 덧붙여요(다른 모듈과 충돌 없게).
   프로필(내 기록 · 꾸미기 상점 · 위쪽 포인트 알약)은 다른 작업에서 꾸미니까 여기서는 손대지 않아요. */
const DECO={dir:'assets/emoji/',skip:/^(me|shop|teacher|bossview|print)/,reduce:false};
try{DECO.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
const dxImg=(k,cls='')=>{const i=document.createElement('img');i.src=DECO.dir+k+'.webp';i.alt='';i.className='dx '+cls;i.setAttribute('aria-hidden','true');i.decoding='async';i.loading='lazy';i.draggable=false;return i};
function dxAdd(elm,k,cls,where='afterbegin'){if(!elm||elm.querySelector(':scope > .dx'))return;elm.insertAdjacentElement(where,dxImg(k,cls))}
const DX_LESSON={poly:'gem',regular:'die',area:'gift'};
const DX_TAB={concept:'eyes',steps:'handshake',practice:'pencil',explore:'magnifier'};
const dxHref=h=>{h=(h||'').replace(/^.*#/,'');if(/-concept$/.test(h))return'eyes';if(/-steps$/.test(h))return'handshake';if(/-practice$/.test(h))return'pencil';if(/-explore$/.test(h))return'magnifier';
  if(/^calc/.test(h))return'abacus';if(h==='drill')return'calendar';if(h==='review')return'notebook';if(h==='scan')return'camera';if(/^print/.test(h))return'printer';if(/^(boss|baseball|bb-)/.test(h))return'trophy';const L=/^([a-z]+)$/.exec(h);if(L&&DX_LESSON[L[1]])return DX_LESSON[L[1]];return'sparkles'};
function decorate(){const h=(location.hash||'').replace('#','')||'home';if(DECO.skip.test(h))return;const A=$('#app');if(!A)return;
  /* 처음 화면 */
  $$('.card.guide .g-head .t',A).forEach(t=>dxAdd(t,'map','dx-h'));
  $$('.gsteps > li',A).forEach(li=>{if(li.querySelector('.dx'))return;const a=li.querySelector('a[href]'),gn=li.querySelector('.gn');if(gn)gn.insertAdjacentElement('afterend',dxImg(dxHref(a&&a.getAttribute('href')),'dx-g'))});
  $$('.sec-title > h2',A).forEach(t=>{const s=t.textContent;dxAdd(t,/포인트|게임/.test(s)?'trophy':/기초 연산/.test(s)?'abacus':/단원/.test(s)?'books':/차시/.test(s)?'books':'sparkles','dx-h')});
  $$('.mis-card .g-head .t',A).forEach(t=>dxAdd(t,'target','dx-h'));
  $$('.boss-card .g-head .t',A).forEach(t=>dxAdd(t,'dragon','dx-h'));
  $$('.bb-strip > svg:first-child',A).forEach(sv=>sv.replaceWith(dxImg('baseball','dx-s')));
  $$('.calc-chip.start',A).forEach(t=>dxAdd(t,'compass','dx-c','beforeend'));
  $$('.card.unit.ready',A).forEach(t=>dxAdd(t,'die','dx-corner dx-top','beforeend'));
  /* 차시 목록 · 탭 */
  $$('.card.lesson.ready',A).forEach(c=>{const m=/#([a-z]+)/.exec(c.getAttribute('href')||''),t=c.querySelector('b');if(t)dxAdd(t,(m&&DX_LESSON[m[1]])||'cube','dx-l')});
  $$('.tabs .tab[data-tab]',A).forEach(b=>{const tl=b.querySelector('.tl');if(tl&&DX_TAB[b.dataset.tab])dxAdd(tl,DX_TAB[b.dataset.tab],'dx-t')});
  /* 혼자 풀기 진행도 */
  $$('.typrog .tyrun',A).forEach(s=>{if(s.querySelector('.dx'))return;s.firstChild&&s.firstChild.nodeType===3&&(s.firstChild.nodeValue=s.firstChild.nodeValue.replace('🔥',''));dxAdd(s,'fire','dx-i')});
  $$('.tyswitch',A).forEach(s=>{if(s.querySelector('.dx'))return;if(s.firstChild&&s.firstChild.nodeType===3)s.firstChild.nodeValue=s.firstChild.nodeValue.replace('🎉','');dxAdd(s,'party','dx-p')});
  /* 맞혔을 때 축하 (한 문제에 한 번) */
  $$('.result.ok',A).forEach(r=>{if(r.dataset.dxc)return;r.dataset.dxc=1;confettiAt(r,false)});
  /* 사용법 페이지 · 도움말 */
  $$('.hw-top h1',A).forEach(t=>{if(!t.querySelector('.dx')){t.textContent=t.textContent.replace('📖','').trim();dxAdd(t,'books','dx-h')}})}
function confettiAt(elm,big){if(DECO.reduce||typeof confetti!=='function')return;try{const r=elm.getBoundingClientRect(),x=(r.left+r.width/2)/innerWidth,y=Math.min(.95,Math.max(.05,(r.top+r.height/2)/innerHeight));
  confetti({particleCount:big?120:45,spread:big?90:60,startVelocity:big?42:28,ticks:big?220:140,scalar:big?1:.8,origin:{x,y},colors:['#ffe266','#2a4d9e','#3f9e6e','#e08a1e','#c0504d'],disableForReducedMotion:true})}catch(e){}}
/* 별을 받거나 유형을 완성하면 크게 */
function decoToasts(){const box=$('#toasts');if(!box||box.dataset.dxo)return;box.dataset.dxo=1;
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&/별 \d개|완성|배지/.test(n.textContent))confettiAt(n,/완성|별 3개/.test(n.textContent))}))).observe(box,{childList:true})}
(function decoInit(){const A=$('#app');if(!A)return;let t=null;
  const run=()=>{t=null;try{decorate();decoToasts()}catch(e){}};
  new MutationObserver(()=>{if(!t)t=requestAnimationFrame(run)}).observe(A,{childList:true,subtree:true});
  new MutationObserver(()=>{try{decoToasts()}catch(e){}}).observe(document.body,{childList:true});
  run()})();
