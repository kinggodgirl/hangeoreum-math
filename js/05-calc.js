/* ───────── 기초 연산: 기초 다지기 + 입체도형에서 쓰는 계산 ─────────
   학습부진 학생을 위한 설계 (학습과학·수학 학습부진 지원 연구에 근거)
   · 명시적 지도와 단계적 철회: 보기(예시) → 생각 질문(자기 설명) → 같이(빈칸 채우기) → 혼자
   · 구체물-그림-식: 10칸 틀, 십 막대, 수직선, 점 배열, 묶음, 막대, 넓이 모형 (혼자 단계에서는 그림을 뺌)
   · 인출 연습 + 간격 반복: 주제마다 복습 상자(1·2·4·7·14일), 오늘의 계산이 복습할 주제를 섞어서 냄(섞어 풀기)
   · 오류별 피드백(오개념 진단), 언제든 '쪼개서 풀기', 연속으로 틀리면 도움 제안, 도움 뒤에는 비슷한 문제로 다시
   · 곱셈구구: 아는 것 사이에 모르는 것을 끼워 반복, 빠르고 정확하게 맞힌 날로 '익힘' 판단(시간은 보이지 않음)
   · 처음에 시작점 찾기, 읽어 주기, 시간 재기는 기본으로 끔(수학 불안 줄이기) */
const M_=v=>`<span class="rm">${v}</span>`,N_=`<span class="math">n</span>`;
const J=(n,a,b)=>josa(String(n),a,b),IY=n=>J(n,'이에요','예요'),IYs=n=>IY(n).slice(String(n).length);
const S_=(t,q,ans,type,choices)=>({t,q,ans,type:type||'num',choices});
const E_=(a,m,pi)=>({a,m,pi});
/* 원의 둘레·넓이 (π 계산 2~5단계) — 선생님 방식
   둘레: "둘레 보면 π! π는 지름을 둘레로 바꾸는 마법" → 지름 구하기 → 지름에 π
   넓이: "원을 직사각형으로 바꿔요. 가로는 반둘레, 세로는 반지름" → 반둘레(반지름에 π) × 반지름
   hk: 이 문제의 💡 힌트(KEYS보다 먼저 써요) */
function piSvg(area,useD,rr){const C=80,R=58,lab=useD?`${2*rr} cm`:`${rr} cm`;
  return`<svg class="pifig" viewBox="0 0 160 160" width="150" height="150" role="img" aria-label="${useD?'지름':'반지름'} ${lab}인 원"><circle cx="${C}" cy="${C}" r="${R}" fill="${area?'#e8eefb':'none'}" stroke="#1d2433" stroke-width="2.4"/><circle cx="${C}" cy="${C}" r="3" fill="#1d2433"/>`+
    (useD?`<line x1="${C-R}" y1="${C}" x2="${C+R}" y2="${C}" stroke="#2a4d9e" stroke-width="3"/>`:`<line x1="${C}" y1="${C}" x2="${C+R}" y2="${C}" stroke="#2a4d9e" stroke-width="3"/>`)+
    `<text x="${useD?C:C+R/2}" y="${C-9}" text-anchor="middle" font-size="17" font-family="Times New Roman,serif" fill="#1d2433">${lab}</text>${area?'':`<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#e0832a" stroke-width="4" stroke-dasharray="7 5"/>`}</svg>`}
/* 원을 잘라 지그재그로 붙인 직사각형: 가로 = 반둘레, 세로 = 반지름 */
function svgZig(lb='가로 = 반둘레 (반지름 × π)',ls='= 반지름'){const n=8,W=220,H=70,x0=20,y0=16,w=W/n;let g='';
  for(let k=0;k<n;k++){const x=x0+k*w,up=k%2===0;
    g+=up?`<path d="M ${x} ${y0+H} Q ${x+w} ${y0+H+7} ${x+2*w} ${y0+H} L ${x+w} ${y0} Z" fill="${k%4===0?'#cfdcf5':'#e8eefb'}" stroke="#1d2433" stroke-width="1.3"/>`
        :`<path d="M ${x} ${y0} Q ${x+w} ${y0-7} ${x+2*w} ${y0} L ${x+w} ${y0+H} Z" fill="${k%4===1?'#fde3c8':'#fff1e2'}" stroke="#1d2433" stroke-width="1.3"/>`}
  return`<svg class="zigfig" viewBox="0 0 ${W+110} ${H+58}" width="${W+110}" role="img" aria-label="원을 잘라 붙인 직사각형"><clipPath id="zc"><rect x="${x0+w/2}" y="${y0-8}" width="${W}" height="${H+16}"/></clipPath><g clip-path="url(#zc)">${g}</g>`+
    `<line x1="${x0+w/2}" y1="${y0+H+22}" x2="${x0+w/2+W}" y2="${y0+H+22}" stroke="#e0832a" stroke-width="2.5"/><text x="${x0+w/2+W/2}" y="${y0+H+42}" text-anchor="middle" font-size="15" fill="#b35f12">${lb}</text>`+
    `<line x1="${x0+w/2+W+12}" y1="${y0}" x2="${x0+w/2+W+12}" y2="${y0+H}" stroke="#2a4d9e" stroke-width="2.5"/><text x="${x0+w/2+W+20}" y="${y0+H/2+5}" font-size="15" fill="#2a4d9e">세로</text><text x="${x0+w/2+W+20}" y="${y0+H/2+23}" font-size="13" fill="#2a4d9e">${ls}</text></svg>`}
const HK_CIRC={w:'둘레 보면 π',say:'π는 <b>지름</b>을 둘레로 바꾸는 마법이에요. 반지름이면 × 2 해서 지름을 만들고, 지름에 π를 붙이면 둘레!',eq:'반지름 5 → 지름 10 → 둘레 10π'};
const HK_AREA={w:'원을 직사각형으로',say:'원을 잘게 잘라 지그재그로 붙이면 <b>직사각형</b>이 돼요. 가로는 <b>반둘레</b>(반지름에 π), 세로는 <b>반지름</b>. 넓이 = 가로 × 세로!',eq:'반지름 5 → 가로 5π, 세로 5 → 넓이 25π',fig:svgZig};
const uniqErr=(errs,ans)=>errs.filter((e,i)=>e.a!==ans&&errs.findIndex(x=>x.a===e.a)===i);
function piCirc(r,fig){const useD=fig&&r()<0.4,rr=ri(r,2,8),d=2*rr;
  const q=fig?`<div class="pifigw">${piSvg(false,useD,rr)}</div>그림의 원의 <b>둘레의 길이</b>`:`반지름 ${M_(rr+' cm')}인 원의 둘레<br>${M_('2 × π × '+rr)}`;
  const st=[useD?S_('지름 찾기 (그림에 지름이 있어요)',M_('지름'),d):S_('지름 구하기 (반지름 × 2)',M_(`${rr} × 2`),d),S_('지름에 π를 붙이면 둘레',M_(`${d} × π`),d,'pi')];
  const errs=[E_(rr,'π는 <b>지름</b>을 둘레로 바꿔요. 반지름을 지름으로 먼저 바꿔 볼까요?',true),E_(rr*rr,'넓이를 구했어요. 둘레는 지름에 π를 붙여요.',true)];
  if(useD)errs.push(E_(2*d,'지름에 바로 π를 붙여요. 지름을 또 2배 하지 않아요.',true));
  return{q,ans:d,type:'pi',suffix:'cm',steps:st,errs:uniqErr(errs,d),hk:Object.assign({},HK_CIRC,fig?{say:'그림에서 <b>지름</b>을 찾아요. 반지름만 있으면 × 2. 지름에 π를 붙이면 둘레!'}:{})}}
function piArea(r,fig){const useD=fig&&r()<0.4,rr=ri(r,2,8),d=2*rr,ans=rr*rr;
  const q=fig?`<div class="pifigw">${piSvg(true,useD,rr)}</div>그림의 원의 <b>넓이</b>`:`반지름 ${M_(rr+' cm')}인 원의 넓이<br>${M_(`π × ${rr}²`)}`;
  const st=[];if(useD)st.push(S_('반지름 찾기 (지름 ÷ 2)',M_(`${d} ÷ 2`),rr));
  st.push(S_('가로 = 반둘레 (반지름에 π)',M_(`${rr} × π`),rr,'pi'),S_('세로 = 반지름',M_('세로'),rr),S_('넓이 = 가로 × 세로',M_(`${rr}π × ${rr}`),ans,'pi'));
  const errs=[E_(2*rr*rr,'가로는 둘레의 <b>반</b>이에요. 반둘레 × 반지름으로 해 봐요.',true),E_(2*rr,'둘레를 구했어요. 넓이는 원을 직사각형으로 바꿔서 가로 × 세로예요.',true)];
  if(useD)errs.push(E_(d*d,'지름을 그대로 썼어요. 세로는 반지름(지름 ÷ 2)이에요.',true));
  return{q,ans,type:'pi',suffix:'cm²',steps:st,errs:uniqErr(errs,ans),hk:HK_AREA}}
const BOX='<span class="cbox">?</span>';
const FR=(n,d)=>`<span class="frs"><span>${n}</span><span>${d}</span></span>`;
let SVGID=0;
/* ── 그림 (구체물 → 그림 → 식) ── */
function svgSplit(a,b){const t=Math.floor(a/10)*10,u=a-t;const W=260,H=96,x0=34,y0=22,w1=Math.round((W-x0-10)*t/a),w2=W-x0-10-w1;
  return`<svg class="cfig" viewBox="0 0 ${W} ${H+34}" width="${W}" role="img" aria-label="${a} 곱하기 ${b}를 ${t} 곱하기 ${b}와 ${u} 곱하기 ${b}로 나눈 그림">
   <rect x="${x0}" y="${y0}" width="${w1}" height="${H-y0}" fill="#cfe0fb" stroke="#1d2640" stroke-width="2"/><rect x="${x0+w1}" y="${y0}" width="${w2}" height="${H-y0}" fill="#fde2b8" stroke="#1d2640" stroke-width="2"/>
   <text x="${x0+w1/2}" y="15" text-anchor="middle" class="ct">${t}</text><text x="${x0+w1+w2/2}" y="15" text-anchor="middle" class="ct">${u}</text><text x="${x0-8}" y="${(y0+H)/2+6}" text-anchor="end" class="ct">${b}</text>
   <text x="${x0+w1/2}" y="${(y0+H)/2+6}" text-anchor="middle" class="ct">${t*b}</text><text x="${x0+w1+w2/2}" y="${(y0+H)/2+6}" text-anchor="middle" class="ct">${u*b}</text>
   <text x="${W/2}" y="${H+26}" text-anchor="middle" class="ct sm">${t} × ${b} + ${u} × ${b}</text></svg>`}
function svgGrid(n){const c=Math.min(16,Math.floor(150/n)),W=n*c+60;let g='';for(let i=0;i<n;i++)for(let j=0;j<n;j++)g+=`<rect x="${30+j*c}" y="${8+i*c}" width="${c-2}" height="${c-2}" rx="2" fill="#cfe0fb"/>`;
  return`<svg class="cfig" viewBox="0 0 ${W} ${n*c+40}" width="${W}" role="img" aria-label="한 변에 ${n}칸인 정사각형">${g}<text x="${30+n*c/2}" y="${n*c+32}" text-anchor="middle" class="ct sm">${n} × ${n}</text><text x="22" y="${8+n*c/2+5}" text-anchor="end" class="ct sm">${n}</text></svg>`}
function svgHalf(a,h){return`<svg class="cfig" viewBox="0 0 230 130" width="230" role="img" aria-label="밑변 ${a}, 높이 ${h}인 삼각형은 직사각형의 절반"><rect x="30" y="14" width="170" height="90" fill="none" stroke="#1d2640" stroke-width="1.6" stroke-dasharray="6 4"/>
  <polygon points="30,104 200,104 120,14" fill="#cfe0fb" stroke="#1d2640" stroke-width="2"/><line x1="120" y1="14" x2="120" y2="104" stroke="#c0504d" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="115" y="124" text-anchor="middle" class="ct sm">밑변 ${a}</text><text x="126" y="66" class="ct sm" fill="#b02a2a">높이 ${h}</text></svg>`}
function svgTenFrame(a,b){const need=10-a,rest=b-need,c=26,W=10*c+40,H=2*c+46;let g='';
  const frame=(x0,fill)=>{for(let i=0;i<10;i++){const x=x0+(i%5)*c,y=8+Math.floor(i/5)*c;g+=`<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="#1d2640" stroke-width="1.5"/>`;const f=fill(i);if(f)g+=`<circle cx="${x+c/2}" cy="${y+c/2}" r="${c*0.33}" fill="${f}"/>`}};
  frame(10,i=>i<a?'#2a64c8':'#e08a1e');frame(30+5*c,i=>i<rest?'#e08a1e':null);
  g+=`<text x="${10+2.5*c}" y="${2*c+32}" text-anchor="middle" class="ct sm">${a} + ${need} = 10</text><text x="${30+7.5*c}" y="${2*c+32}" text-anchor="middle" class="ct sm">남은 ${rest}</text>`;
  return`<svg class="cfig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="10칸 틀: ${a}에 ${need}를 채워 10을 만들고 ${rest}가 남아요">${g}</svg>`}
function svgBlocks(a,b){const u=7,rw=u*1.6;let g='',y=8;[a,b].forEach(n=>{const T=Math.floor(n/10),O=n%10;let x=50;g+=`<text x="40" y="${y+u*5+6}" text-anchor="end" class="ct">${n}</text>`;
    for(let i=0;i<T;i++){g+=`<rect x="${x}" y="${y}" width="${rw}" height="${u*10}" rx="2" fill="#cfe0fb" stroke="#1d2640" stroke-width="1.3"/>`;for(let k=1;k<10;k++)g+=`<line x1="${x}" y1="${y+k*u}" x2="${x+rw}" y2="${y+k*u}" stroke="#1d2640" stroke-width=".5"/>`;x+=rw+5}
    x+=10;for(let i=0;i<O;i++){const cx=x+(i%5)*(u+5),cy=y+u*10-(Math.floor(i/5)+1)*(u+5);g+=`<rect x="${cx}" y="${cy}" width="${u+1}" height="${u+1}" rx="1.5" fill="#fde2b8" stroke="#1d2640" stroke-width="1.2"/>`}
    y+=u*10+16});
  return`<svg class="cfig" viewBox="0 0 300 ${y}" width="300" role="img" aria-label="${a}와 ${b}를 십 막대와 낱개로 나타낸 그림">${g}</svg>`}
function svgJumps(s,Js){const id=++SVGID,pts=[s];Js.forEach(j=>pts.push(pts[pts.length-1]-j));const lo=pts[pts.length-1]-3,hi=s+3,W=320,X=v=>20+(v-lo)/(hi-lo)*(W-40),col=['#2a64c8','#e08a1e'];
  let g=`<defs>${Js.map((_,i)=>`<marker id="ah${id}_${i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${col[i%2]}"/></marker>`).join('')}</defs><line x1="14" y1="84" x2="${W-10}" y2="84" stroke="#1d2640" stroke-width="2"/>`;
  pts.forEach(p=>{g+=`<line x1="${X(p)}" y1="76" x2="${X(p)}" y2="92" stroke="#1d2640" stroke-width="2"/><text x="${X(p)}" y="110" text-anchor="middle" class="ct sm">${p}</text>`});
  for(let i=0;i<Js.length;i++){const x1=X(pts[i]),x2=X(pts[i+1]),mx=(x1+x2)/2,h=Math.min(46,Math.abs(x1-x2)*0.45+12);
    g+=`<path d="M${x1} 76 Q${mx} ${76-h*1.6} ${x2+3} 76" fill="none" stroke="${col[i%2]}" stroke-width="2.2" marker-end="url(#ah${id}_${i})"/><text x="${mx}" y="${76-h*0.8-6}" text-anchor="middle" class="ct sm" fill="${i%2?'#b0600e':'#1f4fa0'}">−${Js[i]}</text>`}
  return`<svg class="cfig" viewBox="0 0 ${W} 118" width="${W}" role="img" aria-label="수직선: ${s}에서 ${Js.join(', ')}만큼 차례로 뛰어 내려가요">${g}</svg>`}
function svgArray(R,C,o={}){const c=Math.min(20,Math.floor(230/C)),r=c*0.32,x0=36,y0=24,W=x0+C*c+20,H=y0+R*c+(o.split||o.cross?40:12);let g='';
  for(let i=0;i<R;i++)for(let j=0;j<C;j++){const cx=x0+j*c+c/2,cy=y0+i*c+c/2,last=o.cross&&j===C-1,p2=o.split&&j>=o.split;g+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${last?'#d9dde6':p2?'#e08a1e':'#2a64c8'}"/>`;
    if(last)g+=`<path d="M${cx-r} ${cy-r}L${cx+r} ${cy+r}M${cx+r} ${cy-r}L${cx-r} ${cy+r}" stroke="#c0504d" stroke-width="1.6"/>`}
  g+=`<text x="${x0-8}" y="${y0+R*c/2+5}" text-anchor="end" class="ct sm">${R}</text><text x="${x0+C*c/2}" y="${y0-8}" text-anchor="middle" class="ct sm">${C}</text>`;
  if(o.split){const xs=x0+o.split*c;g+=`<line x1="${xs}" y1="${y0-4}" x2="${xs}" y2="${y0+R*c+4}" stroke="#1d2640" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${x0+o.split*c/2}" y="${y0+R*c+24}" text-anchor="middle" class="ct sm">${R} × ${o.split}</text><text x="${xs+(C-o.split)*c/2}" y="${y0+R*c+24}" text-anchor="middle" class="ct sm">${R} × ${C-o.split}</text>`}
  if(o.cross)g+=`<text x="${x0+C*c/2}" y="${y0+R*c+24}" text-anchor="middle" class="ct sm">${R} × 10 − ${R}</text>`;
  return`<svg class="cfig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="한 줄에 ${C}개씩 ${R}줄인 점 배열">${g}</svg>`}
const svgArray2=(a,b)=>`<div class="figrow">${svgArray(a,b)}<b class="rm">=</b>${svgArray(b,a)}</div>`;
function svgGroups(T,d,n,cap){const k=T/d,gc=Math.ceil(Math.sqrt(k)),gr=Math.ceil(k/gc),c=14,gw=gc*c+12,gh=gr*c+12,W=d*(gw+8)+12,H=gh+42;let g='';
  for(let i=0;i<d;i++){const x=10+i*(gw+8),on=i<n;g+=`<rect x="${x}" y="8" width="${gw}" height="${gh}" rx="8" fill="${on?'#fde2b8':'#fff'}" stroke="${on?'#e08a1e':'#1d2640'}" stroke-width="1.6"/>`;
    for(let j=0;j<k;j++)g+=`<circle cx="${x+6+(j%gc)*c+c/2}" cy="${14+Math.floor(j/gc)*c+c/2}" r="4.5" fill="#2a64c8"/>`}
  g+=`<text x="${W/2}" y="${gh+34}" text-anchor="middle" class="ct sm">${cap||`${d}묶음 중 ${n}묶음`}</text>`;
  return`<svg class="cfig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${T}개를 ${d}묶음으로 똑같이 나눈 것 중 ${n}묶음">${g}</svg>`}
function svgBars(A,B,p,q){const W=280,x0=60,w=W-x0-10,h=26;let g='';const bar=(y,n,d,lab)=>{for(let i=0;i<d;i++)g+=`<rect x="${x0+i*w/d}" y="${y}" width="${w/d}" height="${h}" fill="${i<n?'#fde2b8':'#fff'}" stroke="#1d2640" stroke-width="1.4"/>`;g+=`<text x="${x0-10}" y="${y+h/2+6}" text-anchor="end" class="ct">${lab}</text>`};
  bar(10,A,B,`${A}/${B}`);bar(10+h+18,p,q,`${p}/${q}`);g+=`<line x1="${x0+w*p/q}" y1="4" x2="${x0+w*p/q}" y2="${10+2*h+24}" stroke="#c0504d" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  return`<svg class="cfig" viewBox="0 0 ${W} ${2*h+40}" width="${W}" role="img" aria-label="${B}칸 중 ${A}칸과 ${q}칸 중 ${p}칸은 길이가 같아요">${g}</svg>`}
function svgRound(a,R){const lo=R-10,hi=R+10,W=300,X=v=>20+(v-lo)/(hi-lo)*(W-40);let g=`<line x1="14" y1="54" x2="${W-14}" y2="54" stroke="#1d2640" stroke-width="2"/>`;
  for(let v=lo;v<=hi;v++){const big=v%10===0;g+=`<line x1="${X(v)}" y1="${big?44:49}" x2="${X(v)}" y2="${big?64:59}" stroke="#1d2640" stroke-width="${big?2:1}"/>`;if(big)g+=`<text x="${X(v)}" y="82" text-anchor="middle" class="ct sm">${v}</text>`}
  g+=`<circle cx="${X(a)}" cy="54" r="6" fill="#e08a1e"/><text x="${X(a)}" y="34" text-anchor="middle" class="ct sm" fill="#b0600e">${a}</text>`;
  return`<svg class="cfig" viewBox="0 0 ${W} 90" width="${W}" role="img" aria-label="수직선에서 ${a}는 ${R}에 가장 가까워요">${g}</svg>`}
function svgMeter(){let g=`<rect x="20" y="16" width="260" height="34" fill="#fff6dc" stroke="#1d2640" stroke-width="1.6"/>`;for(let i=0;i<=100;i+=5){const x=20+i*2.6,big=i%10===0;g+=`<line x1="${x}" y1="16" x2="${x}" y2="${big?32:26}" stroke="#1d2640" stroke-width="${big?1.4:.8}"/>`;if(i%50===0)g+=`<text x="${x}" y="68" text-anchor="${i===0?'start':i===100?'end':'middle'}" class="ct sm">${i} cm</text>`}
  return`<svg class="cfig" viewBox="0 0 300 96" width="300" role="img" aria-label="1 m 자는 100 cm">${g}<text x="150" y="90" text-anchor="middle" class="ct sm">1 m = 100 cm</text></svg>`}
function svgSqm(){let g=`<rect x="70" y="10" width="120" height="120" fill="#cfe0fb" stroke="#1d2640" stroke-width="2"/>`;for(let i=1;i<10;i++)g+=`<line x1="${70+i*12}" y1="10" x2="${70+i*12}" y2="130" stroke="#1d2640" stroke-width=".4"/><line x1="70" y1="${10+i*12}" x2="190" y2="${10+i*12}" stroke="#1d2640" stroke-width=".4"/>`;
  g+=`<text x="130" y="150" text-anchor="middle" class="ct sm">100 cm</text><text x="62" y="75" text-anchor="end" class="ct sm">100 cm</text><text x="130" y="172" text-anchor="middle" class="ct sm">1 m² = 100 × 100 cm²</text>`;
  return`<svg class="cfig" viewBox="0 0 260 180" width="260" role="img" aria-label="한 변이 100 cm인 정사각형">${g}</svg>`}
function svgLiter(){const s=90,d=36,x=60,y=40;
  return`<svg class="cfig" viewBox="0 0 270 ${y+s+54}" width="270" role="img" aria-label="한 모서리가 10 cm인 정육면체 그릇은 1 L"><polygon points="${x},${y} ${x+s},${y} ${x+s+d},${y-d*0.7} ${x+d},${y-d*0.7}" fill="#dbe8fb" stroke="#1d2640" stroke-width="1.8"/><polygon points="${x+s},${y} ${x+s+d},${y-d*0.7} ${x+s+d},${y+s-d*0.7} ${x+s},${y+s}" fill="#b9d0f3" stroke="#1d2640" stroke-width="1.8"/><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#cfe0fb" stroke="#1d2640" stroke-width="1.8"/>
   <text x="${x+s/2}" y="${y+s+20}" text-anchor="middle" class="ct sm">10 cm</text><text x="${x-8}" y="${y+s/2+5}" text-anchor="end" class="ct sm">10 cm</text><text x="${x+s+d/2+6}" y="${y+s-d*0.35+18}" class="ct sm">10 cm</text>
   <text x="${x+s/2+20}" y="${y+s+46}" text-anchor="middle" class="ct sm">1 L = 1000 cm³ = 1000 mL</text></svg>`}
function svgGridRect(a,b){const c=Math.min(30,Math.floor(220/a)),x0=46,y0=12,W=x0+a*c+16,H=y0+b*c+32;let g='';
  for(let i=0;i<b;i++)for(let j=0;j<a;j++)g+=`<rect x="${x0+j*c}" y="${y0+i*c}" width="${c}" height="${c}" fill="${i===0?'#fde2b8':'#cfe0fb'}" stroke="#1d2640" stroke-width="1.2"/>`;
  g+=`<text x="${x0+a*c/2}" y="${y0+b*c+22}" text-anchor="middle" class="ct sm">한 줄에 ${a}칸</text><text x="${x0-8}" y="${y0+b*c/2+5}" text-anchor="end" class="ct sm">${b}줄</text>`;
  return`<svg class="cfig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="한 줄에 ${a}칸씩 ${b}줄인 직사각형">${g}</svg>`}
const ordFig=parts=>`<div class="ordfig">${parts.map(p=>Array.isArray(p)?`<span class="grp">${M_(p[0])}<small>먼저</small></span>`:M_(p)).join('')}</div>`;
/* ── 읽어 주기 (그림 + 소리: 글을 읽는 부담 덜기) ── */
const canSpeak=typeof window!=='undefined'&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';
function sayText(h){let s=String(h).replace(/<span class="frs"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g,' $2분의 $1 ').replace(/<sup>(\d+)<\/sup>⁄<sub>(\d+)<\/sub>/g,' $2분의 $1 ').replace(/\{\?\}/g,' 얼마 ');
  s=stripTags(s);[[/cm²/g,'제곱센티미터'],[/cm³/g,'세제곱센티미터'],[/m²/g,'제곱미터'],[/m³/g,'세제곱미터'],[/mm/g,'밀리미터'],[/cm/g,'센티미터'],[/mL/g,'밀리리터'],[/(\d)\s*m\b/g,'$1 미터'],[/(\d)\s*L\b/g,'$1 리터'],
   [/²/g,'의 제곱'],[/³/g,'의 세제곱'],[/×/g,' 곱하기 '],[/÷/g,' 나누기 '],[/−/g,' 빼기 '],[/\+/g,' 더하기 '],[/=/g,' 는 '],[/π/g,'파이'],[/⅓/g,'3분의 1'],[/½/g,'2분의 1'],[/¾/g,'4분의 3'],[/\?/g,' 얼마 '],[/→/g,', ']].forEach(([a,b])=>{s=s.replace(a,b)});
  return s.replace(/\s+/g,' ').trim()}
function speak(text,btn){if(!canSpeak)return;const ss=speechSynthesis;if(ss.speaking||ss.pending){ss.cancel();$$('.say.on').forEach(b=>b.classList.remove('on'));if(btn&&btn.dataset.sp==='1'){btn.dataset.sp='';return}}
  const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=0.92;const v=ss.getVoices().find(x=>/^ko/i.test(x.lang));if(v)u.voice=v;
  if(btn){btn.classList.add('on');btn.dataset.sp='1';u.onend=u.onerror=()=>{btn.classList.remove('on');btn.dataset.sp=''}}ss.speak(u)}
const sayBtn=()=>canSpeak?`<button type="button" class="say" aria-label="읽어 주기">🔊 듣기</button>`:'';
const stopSpeak=()=>{try{if(canSpeak)speechSynthesis.cancel()}catch(e){}};
/* ── 주제 상태 · 복습 상자(간격 반복) ── */
const gcd_=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
const lcm_=(a,b)=>Math.abs(a*b)/gcd_(a,b);
const r3_=v=>Math.round(v*1000)/1000;
const calcLenPref=()=>lsGet('hangeoreum-calc-len',5)===10?10:5;
function recordCalcErr(tid,msg){if(!tid||!msg)return;const E=DB._calcErrs=OBJ(DB._calcErrs),plain=stripTags(msg).slice(0,90),k=tid+':'+plain.slice(0,36);const cur=OBJ(E[k]);E[k]={tid,m:plain,n:NUM(cur.n)+1,d:today()};save()}
const BOX_DAYS=[0,1,2,4,7,14];
function calcState(id){const C=DB._calc=OBJ(DB._calc);const s=C[id]=OBJ(C[id]);const N=calcLvN(id);s.stars=Math.min(N,NUM(s.stars));s.unlock=Math.min(N,Math.max(1,NUM(s.unlock)||1));s.best=OBJ(s.best);s.n=NUM(s.n);s.ways=OBJ(s.ways);s.box=Math.min(5,NUM(s.box));if(typeof s.due!=='string')s.due='';return s}
/* 주제마다 단계 수가 달라요(기본 3, π 계산은 5) */
const calcLvN=id=>((typeof CALC!=='undefined'&&CALC.find(t=>t.id===id))||{}).lv?.length||3;
const calcDone=id=>NUM(calcPeek(id).stars)>=calcLvN(id);
const calcMaxLv=id=>{const s=calcPeek(id);return Math.min(calcLvN(id),Math.max(NUM(s.stars)+1,NUM(s.unlock)||1))};
const calcPeek=id=>OBJ(OBJ(DB._calc)[id]);
const calcStars=()=>CALC.reduce((a,t)=>a+Math.min(calcLvN(t.id),NUM(calcPeek(t.id).stars)),0);
const calcStarted=id=>{const s=calcPeek(id);return NUM(s.stars)>0||NUM(s.n)>0||NUM(s.box)>0||Object.keys(OBJ(s.ways)).length>0};
const calcDue=id=>{if(id==='facts'||!calcStarted(id))return false;const d=calcPeek(id).due;return!d||d<=today()};
const dueList=()=>CALC.filter(t=>calcDue(t.id)).sort((a,b)=>String(calcPeek(a.id).due||'').localeCompare(String(calcPeek(b.id).due||'')));
function calcSchedule(id,score){const s=calcState(id);if(score>=8){s.box=Math.min(5,s.box+1);s.due=addDays(today(),BOX_DAYS[s.box])}else{s.box=score>=5?Math.max(1,s.box):1;s.due=addDays(today(),1)}}
const starRow=(n,N=3)=>`<span class="stars" aria-label="별 ${n}개">${range(N).map(i=>i+1).map(i=>`<i class="${i<=n?'on':''}">★</i>`).join('')}</span>`;
const CALC_LV=['1단계 · 쉬운 수','2단계 · 조금 큰 수','3단계 · 입체도형 문제처럼'];
/* ── 곱셈구구: 36칸(순서를 바꿔도 같으니까), 칸마다 익힘 정도 ──
   0 아직 · 1 연습 중 · 2 빠르게 맞힘 · 3 익힘(다른 날 두 번 빠르게) · 4 오래 기억(일주일 뒤에도) */
const FACTS=[];for(let a=2;a<=9;a++)for(let b=a;b<=9;b++)FACTS.push([a,b]);
const fk=(a,b)=>a<b?a+'x'+b:b+'x'+a;
const FACT_LV=([a,b])=>(a<=3||a===5||b===5)?1:(a===4||b===9)?2:3;
const FAST_MS=4000;
const fs0=k=>{const s=OBJ(OBJ(DB._facts)[k]);return{lv:Math.min(4,NUM(s.lv)),d:typeof s.d==='string'?s.d:''}};
function factRecord(k,ok,ms){const F=DB._facts=OBJ(DB._facts),s=F[k]=OBJ(F[k]),t=today();s.lv=Math.min(4,NUM(s.lv));s.n=NUM(s.n)+1;
  if(!ok){s.lv=s.lv>=3?2:1;s.w=NUM(s.w)+1;return}
  if(!(ms<=FAST_MS)){if(s.lv<1)s.lv=1;return}
  if(s.lv<=1){s.lv=2;s.d=t}else if(s.lv===2&&s.d!==t){s.lv=3;s.d=t}else if(s.lv===3&&s.d&&Math.round((Date.parse(t)-Date.parse(s.d))/864e5)>=7){s.lv=4;s.d=t}}
const factsKnown=()=>FACTS.filter(([a,b])=>fs0(fk(a,b)).lv>=3).length;
function pickFact(r,pool,uniform){if(uniform)return pick(r,pool);const W=[3,4,3,1,0.5],ws=pool.map(([a,b])=>W[fs0(fk(a,b)).lv]);let t=r()*ws.reduce((x,y)=>x+y,0);for(let i=0;i<pool.length;i++){t-=ws[i];if(t<=0)return pool[i]}return pool[pool.length-1]}
function factSteps(a,b){if(a>b)[a,b]=[b,a];
  if(a===2)return[S_(`${J(b,'을','를')} 두 번 더해요`,M_(`${b} + ${b}`),2*b)];
  if(a===5||b===5){const o=a===5?b:a;return[S_('10을 곱해요',M_(`${o} × 10`),10*o),S_('반으로 나눠요',M_(`${10*o} ÷ 2`),5*o)]}
  if(b===9)return[S_('10을 곱해요',M_(`${a} × 10`),10*a),S_(`${J(a,'을','를')} 한 번 빼요`,M_(`${10*a} − ${a}`),9*a)];
  if(a===3)return[S_('두 배',M_(`${b} + ${b}`),2*b),S_('한 번 더 더해요',M_(`${2*b} + ${b}`),3*b)];
  if(a===4)return[S_('두 배',M_(`${b} + ${b}`),2*b),S_('한 번 더 두 배',M_(`${2*b} + ${2*b}`),4*b)];
  const c=b-5;return[S_('아는 곱: 5묶음',M_(`${a} × 5`),5*a),S_(`남은 ${c}묶음`,M_(`${a} × ${c}`),a*c),S_('더해요',M_(`${5*a} + ${a*c}`),a*b)]}
function factErrs(a,b){const e=[E_(a+b,'더했어요. ×는 같은 수를 여러 번 더하는 곱하기예요.')];[[a,b-1],[a,b+1],[a-1,b],[a+1,b]].forEach(([x,y])=>{if(x>=1&&y>=1&&x*y!==a*b)e.push(E_(x*y,`한 묶음 차이가 나요. ${M_(`${x} × ${y} = ${x*y}`)}${IYs(x*y)}. 아는 곱에서 더하거나 빼서 확인해요.`))});return e}
function factItem(f,r){const[a,b]=f,[x,y]=r()<0.5?[a,b]:[b,a];return{q:M_(`${x} × ${y}`),ans:a*b,fact:fk(a,b),steps:factSteps(a,b),errs:factErrs(a,b),tid:'facts'}}
function factSet(L,r,count=10){const own=shuffle(r,FACTS.filter(f=>FACT_LV(f)===L)).sort((p,q)=>fs0(fk(...p)).lv-fs0(fk(...q)).lv),lower=shuffle(r,FACTS.filter(f=>FACT_LV(f)<L));
  const base=own.slice(0,count);let i=0;while(base.length<count&&i<lower.length)base.push(lower[i++]);
  const items=shuffle(r,base).map(f=>Object.assign(factItem(f,r),{lv:L}));
  const maxT=count<=5?1:3,gaps=count<=5?[2]:[2,4];
  const targets=items.filter(q=>fs0(q.fact).lv<=1).slice(0,maxT),out=items.slice();   /* 점진적 반복: 모르는 칸은 간격을 늘려 다시 */
  targets.forEach(t=>{let p=out.indexOf(t);gaps.forEach(g=>{p=Math.min(out.length,p+g);out.splice(p,0,Object.assign({},t,{extra:true}))})});
  return out}
/* ── 한 단계씩 풀기 ── */
const stepFill=s=>M_(s.type==='pi'?(s.ans===1?'':s.ans)+'π':s.type==='sn'?(s.ansText||sgnTxt(s.ans)):s.ans);
function stepQ(s,filled){const box=`<b class="swa">${filled?stepFill(s):BOX}</b>`;return s.q&&s.q.includes('{?}')?s.q.replace('{?}',box):s.q?`${s.q} = ${box}`:box}
function stepWalk(host,steps,{onDone,lead,prefill=0}={}){let i=prefill,shown=0;
  host.innerHTML=`<div class="swalk">${lead?`<p class="swlead">${lead}</p>`:''}<ol class="swlist">${steps.map((s,k)=>`<li data-k="${k}" class="${k<prefill?'given':''}"><span class="swt">${s.t}${k<prefill?' <em class="swgiven">같이 했어요</em>':''}</span><span class="swq">${stepQ(s,k<prefill)}</span></li>`).join('')}</ol><div class="swin"></div><div class="swmsg flmsg" aria-live="polite"></div></div>`;
  const show=()=>{$$('.swlist li',host).forEach((li,k)=>{li.classList.toggle('done',k<i&&k>=prefill);li.classList.toggle('on',k===i);li.classList.toggle('later',k>i)});
    const s=steps[i],box=$('.swin',host);box.innerHTML='';let miss=0;window.__cs=s;
    if(!s){onDone&&onDone(shown);return}
    box.appendChild(answerUI({type:s.type,choices:s.choices},v=>{const c=check({type:s.type,ans:s.ans},v),m=$('.swmsg',host),li=$(`.swlist li[data-k="${i}"]`,host);
      if(c===true){$('.swa',li).innerHTML=stepFill(s);m.textContent='';i++;show();return true}
      if(c==='nopi'){m.textContent='π 단추를 눌러 π를 붙여요.';return false}
      if(c==='nosign'){m.textContent='+ 또는 − 부호를 붙여 답해요.';return false}
      miss++;if(miss>=2){$('.swa',li).innerHTML=stepFill(s);li.classList.add('shown');shown++;m.innerHTML=`이 단계의 답: ${stepFill(s)} · 다음 단계로 가요.`;const k=i;setTimeout(()=>{if(i===k){i++;show()}},reduced?0:1400);return true}
      m.textContent='한 번 더 계산해 봐요. 앞 단계의 답을 이용해요.';return false}))};
  show()}
/* ── 주제: 생각하는 법(보기·생각 질문·같이·혼자) + 3단계 연습(오류별 피드백, 쪼개기 단계) ── */
const CALC=[
 /* ═══ 기초 다지기 ═══ */
 {id:'place',grp:'base',nm:'자릿값',use:'큰 수 읽기, × 10 · ÷ 10, 소수점 옮기기의 바탕',lv:['1단계 · 숫자가 나타내는 값','2단계 · × 10, × 100, ÷ 10, ÷ 100','3단계 · 100, 10, 1 모으기'],
  ways:[{t:'자리마다 값이 달라요',idea:`${M_('347')}에서 3은 <b>300</b>, 4는 <b>40</b>, 7은 <b>7</b>이에요. 같은 숫자라도 어느 자리에 있느냐에 따라 값이 달라요.`,
     ex(r){const h=ri(r,1,9),t=ri(r,1,9),o=ri(r,1,9),n=h*100+t*10+o;return{q:`${M_(n)}에서 십의 자리 숫자 ${M_(t)}${J(t,'이','가').slice(String(t).length)} 나타내는 값`,ans:t*10,
       steps:[S_('십의 자리 1칸의 값은?','',10),S_('숫자 × 자리의 값',M_(`${t} × 10`),t*10)]}},
     why:{q:`${M_('520')}에서 끝의 0은 왜 써요?`,choices:['일의 자리가 비어 있다고 알려 줘서','아무 뜻이 없어서','수를 크게 보이려고'],ans:0,ok:'0이 없으면 52가 돼요. 0은 빈자리를 지켜 주는 숫자예요.'}},
   {t:'× 10은 한 자리씩 올라가요',idea:`${M_('34 × 10 = 340')}. 10을 곱하면 숫자들이 <b>한 자리씩 왼쪽으로</b> 올라가고, 빈 일의 자리에 0이 들어가요. ÷ 10은 그 반대예요.`,
     ex(r){const a=ri(r,12,98);return{q:M_(`${a} × 10`),ans:a*10,steps:[S_('한 자리씩 올라가고 끝에 0',M_(`${a} × 10`),a*10)]}},
     why:{q:`${M_('25 × 100')}은 끝에 0이 몇 개 붙을까요?`,choices:['2개 (2500)','1개 (250)','3개 (25000)'],ans:0,ok:'100에는 0이 2개라서 두 자리 올라가요.'}}],
  gen(L,r){
   if(L===1){let d;do{d=[ri(r,1,9),ri(r,0,9),ri(r,1,9)]}while(new Set(d).size<3);const n=d[0]*100+d[1]*10+d[2];let k=ri(r,0,2);if(d[k]===0)k=0;const pv=[100,10,1][k],x=d[k],ans=x*pv,nm=['백','십','일'][k];
     return{q:`${M_(n)}에서 숫자 ${M_(x)}${J(x,'이','가').slice(String(x).length)} 나타내는 값은?`,ans,steps:[S_(`${x}${J(x,'은','는').slice(String(x).length)} 어느 자리? 그 자리 1칸의 값 (1, 10, 100)`,'',pv),S_('숫자 × 자리의 값',M_(`${x} × ${pv}`),ans)],
       errs:[E_(x*pv*10,'한 자리 높게 읽었어요. 오른쪽 끝이 일의 자리예요.'),...(pv>1?[E_(x*pv/10,'한 자리 낮게 읽었어요. 오른쪽 끝부터 일, 십, 백이에요.'),E_(x,`숫자만 썼어요. ${nm}의 자리라서 ${pv}${J(pv,'을','를').slice(String(pv).length)} 곱해요.`)]:[])]}}
   if(L===2){const k=ri(r,0,3),a=ri(r,2,98);
     if(k===0)return{q:M_(`${a} × 10`),ans:a*10,steps:[S_('한 자리씩 올라가고 끝에 0 하나',M_(`${a} × 10`),a*10)],errs:[E_(a*100,'0을 두 개 붙였어요. × 10은 0 하나예요.'),E_(a,'0을 붙이지 않았어요.')]};
     if(k===1)return{q:M_(`${a} × 100`),ans:a*100,steps:[S_('두 자리 올라가고 끝에 0 두 개',M_(`${a} × 100`),a*100)],errs:[E_(a*10,'0을 하나만 붙였어요. × 100은 0이 두 개예요.'),E_(a*1000,'0을 세 개 붙였어요. × 100은 0이 두 개예요.')]};
     if(k===2)return{q:M_(`${a*10} ÷ 10`),ans:a,steps:[S_('한 자리씩 내려가요 · 끝의 0 하나를 지워요',M_(`${a*10} ÷ 10`),a)],errs:[E_(a*100,'곱했어요. ÷ 10은 수가 작아져요.')]};
     return{q:M_(`${a*100} ÷ 100`),ans:a,steps:[S_('두 자리 내려가요 · 끝의 0 두 개를 지워요',M_(`${a*100} ÷ 100`),a)],errs:[E_(a*10,'0을 하나만 지웠어요. ÷ 100은 0 두 개예요.'),E_(a*10000,'곱했어요. ÷ 100은 수가 작아져요.')]}}
   const h=ri(r,1,9),t=r()<0.35?0:ri(r,1,9),o=ri(r,1,9),n=h*100+t*10+o;
   return{q:`${M_(100)}이 ${M_(h)}개, ${t?`${M_(10)}이 ${M_(t)}개, `:`${M_(10)}은 없고, `}${M_(1)}이 ${M_(o)}개인 수`,ans:n,
     steps:[S_(`100이 ${h}개`,M_(`100 × ${h}`),h*100),S_(`10이 ${t}개`,M_(`10 × ${t}`),t*10),S_('모두 더해요',M_(`${h*100} + ${t*10} + ${o}`),n)],
     errs:[...(t===0?[E_(h*10+o,'빈 십의 자리에 0을 써야 해요.')]:[]),E_(h+t+o,'개수만 더했어요. 자리의 값을 곱해서 더해요.')]}}},
 {id:'add',grp:'base',nm:'덧셈·뺄셈 (10 만들기)',use:'모든 계산의 바탕 · 받아올림과 받아내림',lv:['1단계 · 10을 넘는 덧셈 (8 + 5)','2단계 · 10 아래로 빼기 (13 − 6)','3단계 · 덧셈·뺄셈 섞어서'],
  ways:[{t:'10 만들어 더하기',idea:`${M_('8 + 5')}는 8에 2를 먼저 더해 <b>10을 만들고</b>, 남은 3을 더해요.`,
     ex(r){const a=ri(r,6,9),b=ri(r,11-a,9),need=10-a,rest=b-need;return{q:M_(`${a} + ${b}`),fig:svgTenFrame(a,b),ans:a+b,
       steps:[S_(`${J(a,'이','가')} 10이 되려면?`,M_(`10 − ${a}`),need),S_(`${b}에서 ${J(need,'을','를')} 쓰고 남은 수`,M_(`${b} − ${need}`),rest),S_('10과 남은 수',M_(`10 + ${rest}`),a+b)]}},
     why:{q:'왜 먼저 10을 만들까요?',choices:['10에 더하는 건 바로 할 수 있어서','10이 가장 큰 수라서','8이 짝수라서'],ans:0,ok:'10 + 3은 바로 13이에요. 10 묶음이 계산을 쉽게 해 줘요.'}},,
   {t:'빼기도 10을 거쳐서',idea:`${M_('13 − 6')}은 13에서 <b>3을 먼저 빼서 10</b>을 만들고, 남은 3을 더 빼요.`,
     ex(r){const a1=ri(r,1,8),a=10+a1,b=ri(r,a1+1,9),rest=b-a1;return{q:M_(`${a} − ${b}`),fig:svgJumps(a,[a1,rest]),ans:a-b,
       steps:[S_(`${a}에서 ${J(a1,'을','를')} 빼면`,M_(`${a} − ${a1}`),10),S_(`${b}에서 ${J(a1,'을','를')} 썼으니 남은 수`,M_(`${b} − ${a1}`),rest),S_('10에서 남은 수를 빼요',M_(`10 − ${rest}`),a-b)]}},
     why:{q:`${M_('13 − 6')}에서 왜 3을 먼저 뺄까요?`,choices:['10이 되면 남은 수를 빼기 쉬워서','3이 가장 작은 수라서','6이 짝수라서'],ans:0,ok:'13 − 3 = 10, 10 − 3 = 7. 10을 거치면 쉬워요.'}}],
  gen(L,r){const noCarry=r()<0.25,A=()=>{       if(noCarry){const a=ri(r,2,7),b=ri(r,1,9-a);return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_('10을 넘지 않아요 · 바로 더해요',M_(`${a} + ${b}`),a+b)],errs:[E_(a+b+10,'합이 10을 넘지 않아서 받아올림이 없어요.')]}}
       const a=ri(r,4,9),b=ri(r,11-a,9),need=10-a,rest=b-need;
       return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_(`${J(a,'이','가')} 10이 되려면?`,M_(`10 − ${a}`),need),S_(`${b}에서 ${J(need,'을','를')} 쓰고 남은 수`,M_(`${b} − ${need}`),rest),S_('10과 남은 수',M_(`10 + ${rest}`),a+b)],
         errs:[E_(a+b-10,'10을 빠뜨렸어요. 10을 만들고 남은 수를 더해요.'),E_(a+b+1,'하나 차이예요. 10을 만들어서 다시 세어 봐요.'),E_(a+b-1,'하나 차이예요. 10을 만들어서 다시 세어 봐요.')]}},S=()=>{     if(noCarry){const a1=ri(r,3,9),a=10+a1,b=ri(r,1,a1-1);return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_('일의 자리끼리 바로 빼요',M_(`${a1} − ${b}`),a1-b),S_('10과 합쳐요',M_(`10 + ${a1-b}`),a-b)],errs:[E_(a-b-10,'받아내림이 필요 없어요. 일의 자리에서 바로 뺄 수 있어요.')]}}
     const a1=ri(r,1,8),a=10+a1,b=ri(r,a1+1,9),rest=b-a1;
     return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_(`${a}에서 ${J(a1,'을','를')} 빼면`,M_(`${a} − ${a1}`),10),S_(`${b}에서 ${J(a1,'을','를')} 썼으니 남은 수`,M_(`${b} − ${a1}`),rest),S_('10에서 남은 수를 빼요',M_(`10 − ${rest}`),a-b)],
       errs:[E_(b-a1,`일의 자리에서 거꾸로 뺐어요(${b} − ${a1}). ${J(a,'에서','에서')} ${J(b,'을','를')} 빼야 해요. 10을 이용해요.`),E_(a-b+1,'하나 차이예요. 10을 이용해서 다시 해 봐요.'),E_(a-b-1,'하나 차이예요. 10을 이용해서 다시 해 봐요.')]}};
    return L===1?A():L===2?S():(r()<0.5?A():S())}},
 {id:'add2',grp:'base',nm:'두 자리 덧셈·뺄셈',use:'여러 넓이를 모두 더하는 겉넓이 계산',lv:['1단계 · 두 자리와 한 자리','2단계 · 두 자리끼리 더하기','3단계 · 두 자리끼리 빼기'],
  ways:[{t:'자리끼리 더하기',idea:`${M_('47 + 38')}은 <b>십의 자리끼리</b>(40 + 30), <b>일의 자리끼리</b>(7 + 8) 더한 다음 합쳐요.`,
     ex(r){const a=ri(r,2,6)*10+ri(r,3,9),b=ri(r,1,3)*10+ri(r,2,9),aT=a-a%10,bT=b-b%10,o=a%10+b%10;return{q:M_(`${a} + ${b}`),fig:svgBlocks(a,b),ans:a+b,
       steps:[S_('십의 자리끼리',M_(`${aT} + ${bT}`),aT+bT),S_('일의 자리끼리',M_(`${a%10} + ${b%10}`),o),S_('합쳐요',M_(`${aT+bT} + ${o}`),a+b)]}},
     why:{q:`${M_('47')}의 4는 실제로 얼마일까요?`,choices:['40','4','47'],ans:0,ok:'십의 자리 4는 10이 4개, 40이에요.'}},
   {t:'빼기는 수직선에서 뛰어 내려가기',idea:`${M_('52 − 27')}은 52에서 <b>20을 먼저</b> 뛰어 내려가고(32), 다시 <b>7을</b> 뛰어 내려가요(25).`,
     ex(r){const aT=ri(r,4,9)*10,a1=ri(r,0,5),a=aT+a1,bT=ri(r,1,aT/10-1)*10,b1=ri(r,a1+1,9),b=bT+b1;return{q:M_(`${a} − ${b}`),fig:svgJumps(a,[bT,b1]),ans:a-b,
       steps:[S_(`먼저 ${bT}만큼`,M_(`${a} − ${bT}`),a-bT),S_(`다시 ${b1}만큼`,M_(`${a-bT} − ${b1}`),a-b)]}},
     why:{q:`${M_('27')}을 왜 20과 7로 나눠서 뺄까요?`,choices:['몇십을 빼는 건 쉬워서','7이 더 커서','27은 그냥 뺄 수 없어서'],ans:0,ok:'52 − 20처럼 몇십을 빼면 십의 자리만 바뀌어요.'}}],
  gen(L,r){const noCarry=r()<0.25;
    if(L===1){if(r()<0.5){       if(noCarry){const aT=ri(r,2,8)*10,a1=ri(r,1,6),b=ri(r,1,9-a1),a=aT+a1;return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_('일의 자리끼리 더해요',M_(`${a1} + ${b}`),a1+b),S_('십의 자리와 합쳐요',M_(`${aT} + ${a1+b}`),a+b)],errs:[E_(a+b+10,'받아올림이 없는 계산이에요. 일의 자리 합이 10보다 작아요.')]}}
       const a=ri(r,2,8)*10+ri(r,3,9),b=ri(r,11-a%10,9),up=a-a%10+10,need=up-a,rest=b-need;
       return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_(`${J(a,'이','가')} ${J(up,'이','가')} 되려면?`,M_(`${up} − ${a}`),need),S_(`${b}에서 ${J(need,'을','를')} 쓰고 남은 수`,M_(`${b} − ${need}`),rest),S_('더해요',M_(`${up} + ${rest}`),a+b)],
         errs:[E_(a-a%10+(a%10+b)%10,'받아올림을 빠뜨렸어요. 일의 자리 합이 10을 넘으면 십의 자리가 1 커져요.')]}}
     if(noCarry){const aT=ri(r,2,9)*10,a1=ri(r,4,9),b=ri(r,1,a1-1),a=aT+a1;return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_('일의 자리끼리 바로 빼요',M_(`${a1} − ${b}`),a1-b),S_('십의 자리와 합쳐요',M_(`${aT} + ${a1-b}`),a-b)],errs:[E_(a-b-10,'받아내림이 필요 없어요. 일의 자리끼리 바로 빼요.')]}}
     const a=ri(r,2,9)*10+ri(r,1,5),o=a%10,b=ri(r,o+1,9),dn=a-o,rest=b-o;
     return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_(`${a}에서 ${J(o,'을','를')} 빼면`,M_(`${a} − ${o}`),dn),S_(`${b}에서 ${J(o,'을','를')} 썼으니 남은 수`,M_(`${b} − ${o}`),rest),S_('남은 수를 더 빼요',M_(`${dn} − ${rest}`),a-b)],
       errs:[E_(dn+rest,'일의 자리에서 거꾸로 뺐어요. 몇십에서 빌려 와야 해요.')]}}
    if(L===2){      if(noCarry){const aT=ri(r,2,6)*10,a1=ri(r,1,6),bT=ri(r,1,3)*10,b1=ri(r,1,9-a1),a=aT+a1,b=bT+b1;return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_('십의 자리끼리',M_(`${aT} + ${bT}`),aT+bT),S_('일의 자리끼리',M_(`${a1} + ${b1}`),a1+b1),S_('합쳐요',M_(`${aT+bT} + ${a1+b1}`),a+b)],errs:[E_(a+b+10,'받아올림이 없는 계산이에요. 일의 자리 합이 10을 넘지 않아요.')]}}
      const a=ri(r,2,6)*10+ri(r,3,9),b=ri(r,1,3)*10+ri(r,11-a%10,9),aT=a-a%10,bT=b-b%10,o=a%10+b%10;
      return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_('십의 자리끼리',M_(`${aT} + ${bT}`),aT+bT),S_('일의 자리끼리',M_(`${a%10} + ${b%10}`),o),S_('합쳐요',M_(`${aT+bT} + ${o}`),a+b)],
        errs:[E_(aT+bT+o-10,'받아올린 10을 빠뜨렸어요. 일의 자리끼리 더한 수를 전부 더해요.')]}}
    if(noCarry){const aT=ri(r,4,9)*10,a1=ri(r,4,9),bT=ri(r,1,aT/10-1)*10,b1=ri(r,1,a1-1),a=aT+a1,b=bT+b1;return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_('십의 자리끼리',M_(`${aT} − ${bT}`),aT-bT),S_('일의 자리끼리',M_(`${a1} − ${b1}`),a1-b1),S_('합쳐요',M_(`${aT-bT} + ${a1-b1}`),a-b)],errs:[E_(a-b-10,'받아내림이 필요 없어요. 십의 자리와 일의 자리를 각각 빼요.')]}}
    const aT=ri(r,4,9)*10,a1=ri(r,0,5),a=aT+a1,bT=ri(r,1,aT/10-1)*10,b1=ri(r,a1+1,9),b=bT+b1;
    return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_(`먼저 ${bT}만큼 빼요`,M_(`${a} − ${bT}`),a-bT),S_(`다시 ${b1}만큼 빼요`,M_(`${a-bT} − ${b1}`),a-b)],
      errs:[E_(aT-bT+(b1-a1),'일의 자리에서 거꾸로 뺐어요. 몇십을 먼저 빼고, 나머지를 빼요.')]}}},
 {id:'facts',grp:'base',nm:'곱셈구구',use:'모든 곱셈과 나눗셈의 바탕',lv:['1단계 · 2단 · 3단 · 5단','2단계 · 4단 · 9단','3단계 · 6단 · 7단 · 8단'],
  ways:[{t:'순서를 바꿔도 같아요',idea:`${M_('3 × 7')}과 ${M_('7 × 3')}은 같아요. 점 배열을 옆으로 돌려 보면 알 수 있어요. 그래서 <b>외울 구구단이 절반</b>으로 줄어요.`,
     ex(r){const a=ri(r,2,4),b=ri(r,6,9);return{q:M_(`${b} × ${a}`),fig:svgArray2(a,b),ans:a*b,steps:[S_(`${a}단으로 바꿔요`,M_(`${a} × ${b}`),a*b)]}},
     why:{q:'점 배열을 옆으로 돌리면 점의 개수는?',choices:['그대로예요','많아져요','적어져요'],ans:0,ok:'돌려도 점은 그대로라서 3 × 7 = 7 × 3이에요.'}},
   {t:'× 4는 두 배의 두 배',idea:`${M_('4 × 7')}은 7을 <b>두 배</b> 하고(14), <b>한 번 더 두 배</b>(28) 해요. × 2는 같은 수를 두 번 더하기예요.`,
     ex(r){const b=ri(r,3,9);return{q:M_(`4 × ${b}`),ans:4*b,steps:[S_('두 배',M_(`${b} + ${b}`),2*b),S_('한 번 더 두 배',M_(`${2*b} + ${2*b}`),4*b)]}},
     why:{q:'4는 2의 몇 배일까요?',choices:['2배','4배','절반'],ans:0,ok:'4 = 2 × 2라서 두 배를 두 번 하면 돼요.'}},
   {t:'× 9는 × 10에서 한 번 빼기',idea:`${M_('9 × 7')}은 ${M_('10 × 7 = 70')}에서 7을 <b>한 번 빼요</b>. 9묶음은 10묶음보다 한 묶음 적으니까요.`,
     ex(r){const b=ri(r,3,9);return{q:M_(`9 × ${b}`),fig:svgArray(b,10,{cross:true}),ans:9*b,steps:[S_('10을 곱해요',M_(`10 × ${b}`),10*b),S_(`${J(b,'을','를')} 한 번 빼요`,M_(`${10*b} − ${b}`),9*b)]}},
     why:{q:`${M_('9 × 7')}에서 왜 7을 빼요?`,choices:['9묶음은 10묶음보다 한 묶음(7) 적어서','7이 홀수라서','70이 너무 커서'],ans:0,ok:'7이 10묶음이면 70, 9묶음이면 한 묶음 적은 63이에요.'}},
   {t:'모르는 곱은 아는 곱에서',idea:`${M_('6 × 7')}이 생각나지 않으면 <b>아는 곱</b> ${M_('6 × 5 = 30')}에서 시작해 남은 2묶음(12)을 더해요.`,
     ex(r){const a=ri(r,6,8),b=ri(r,6,8),c=b-5;return{q:M_(`${a} × ${b}`),fig:svgArray(a,b,{split:5}),ans:a*b,steps:[S_('아는 곱: 5묶음',M_(`${a} × 5`),5*a),S_(`남은 ${c}묶음`,M_(`${a} × ${c}`),a*c),S_('더해요',M_(`${5*a} + ${a*c}`),a*b)]}},
     why:{q:`${M_('6 × 7')}을 ${M_('6 × 5')}와 ${M_('6 × 2')}로 나눌 수 있는 까닭은?`,choices:['7 = 5 + 2라서','6이 짝수라서','5가 홀수라서'],ans:0,ok:'7묶음은 5묶음과 2묶음을 합친 거예요.'}}],
  gen(L,r,uni){return Object.assign(factItem(pickFact(r,FACTS.filter(f=>FACT_LV(f)===L),uni),r),{lv:L})}},
 {id:'div',grp:'base',nm:'나눗셈',use:'삼각형 넓이 ÷ 2, 뿔의 부피 ÷ 3, 겹쳐 세기',lv:['1단계 · 2·3·4·5로 나누기','2단계 · 6·7·8·9로 나누기','3단계 · 두 자리 수 나누기'],
  ways:[{t:'나눗셈은 곱셈 거꾸로',idea:`${M_('42 ÷ 6')}은 "6에 무엇을 곱하면 42?"예요. <b>6단</b>에서 42를 찾아요.`,
     ex(r){const d=ri(r,3,9),q=ri(r,3,9),n=d*q;return{q:M_(`${n} ÷ ${d}`),fig:svgArray(d,q),ans:q,steps:[S_(`${d}단에서 ${J(n,'을','를')} 찾아요`,M_(`${d} × `)+'{?}'+M_(` = ${n}`),q),S_('그래서',M_(`${n} ÷ ${d}`),q)]}},
     why:{q:`${M_('42 ÷ 6 = 7')}이 맞는지 확인하려면?`,choices:['6 × 7을 해 봐요','42 + 6을 해 봐요','42 − 6을 해 봐요'],ans:0,ok:'나눗셈의 답은 곱셈으로 확인할 수 있어요.'}},
   {t:'큰 수는 쪼개서 나누기',idea:`${M_('84 ÷ 4')}는 84를 <b>80과 4</b>로 쪼개서 각각 4로 나눈 뒤 더해요. ${M_('20 + 1 = 21')}.`,
     ex(r){const d=ri(r,2,4);let q=ri(r,11,29);if(q%10===0)q++;const n=d*q,T=d*10*Math.floor(q/10),R=n-T;return{q:M_(`${n} ÷ ${d}`),ans:q,
       steps:[S_(`${J(n,'을','를')} ${J(T,'과','와')} 나머지로`,M_(`${n} − ${T}`),R),S_('몇십 부분 나누기',M_(`${T} ÷ ${d}`),T/d),S_('나머지 부분 나누기',M_(`${R} ÷ ${d}`),R/d),S_('더해요',M_(`${T/d} + ${R/d}`),q)]}},
     why:{q:'왜 84를 80과 4로 쪼갤까요?',choices:['80 ÷ 4와 4 ÷ 4는 구구단으로 쉬워서','84는 4로 나눌 수 없어서','4를 빼고 싶어서'],ans:0,ok:'나누기 쉬운 수로 쪼개면 구구단으로 풀 수 있어요.'}}],
  gen(L,r){if(L<=2){const d=L===1?ri(r,2,5):ri(r,6,9),q=ri(r,2,9),n=d*q;
     return{q:M_(`${n} ÷ ${d}`),ans:q,steps:[S_(`${d}단에서 ${J(n,'을','를')} 찾아요`,M_(`${d} × `)+'{?}'+M_(` = ${n}`),q),S_('그래서',M_(`${n} ÷ ${d}`),q)],
       errs:[E_(n-d,'뺐어요. ÷는 똑같이 나누기예요. 곱셈을 거꾸로 생각해요.'),E_(n*d,'곱했어요. ÷는 나누기예요.'),E_(q+1,`한 묶음 차이예요. ${M_(`${d} × ${q+1} = ${d*(q+1)}`)}${IYs(d*(q+1))}.`),E_(q-1,`한 묶음 차이예요. ${M_(`${d} × ${q-1} = ${d*(q-1)}`)}${IYs(d*(q-1))}.`)]}}
    const d=ri(r,2,5);let q=ri(r,11,29);if(q%10===0)q++;const n=d*q,T=d*10*Math.floor(q/10),R=n-T;
    return{q:M_(`${n} ÷ ${d}`),ans:q,steps:[S_(`${J(n,'을','를')} ${J(T,'과','와')} 나머지로`,M_(`${n} − ${T}`),R),S_('몇십 부분 나누기',M_(`${T} ÷ ${d}`),T/d),S_('나머지 부분 나누기',M_(`${R} ÷ ${d}`),R/d),S_('더해요',M_(`${T/d} + ${R/d}`),q)],
      errs:[E_(T/d,'몇십 부분만 나눴어요. 나머지 부분도 나눠서 더해요.'),E_(R/d,'나머지 부분만 나눴어요. 몇십 부분도 나눠요.')]}}},
 {id:'divr',grp:'base',nm:'나머지가 있는 나눗셈',use:'약수·배수, 소인수분해, 가분수를 대분수로',lv:['1단계 · 몫 구하기','2단계 · 나머지 구하기','3단계 · 나누기 전의 수'],
  ways:[{t:'넘지 않는 가장 큰 곱',idea:`${M_('23 ÷ 4')}는 4단에서 <b>23을 넘지 않는 가장 큰 곱</b> ${M_('4 × 5 = 20')}을 찾아요. 몫은 5, 남은 3이 나머지예요.`,
     ex(r){const d=ri(r,3,9),q=ri(r,2,9),m=ri(r,1,d-1),n=d*q+m;return{q:`${M_(`${n} ÷ ${d}`)}의 나머지`,ans:m,
       steps:[S_(`${d}단에서 ${J(n,'을','를')} 넘지 않는 가장 큰 곱`,'',d*q),S_('몫은?',M_(`${d*q} ÷ ${d}`),q),S_('남은 수가 나머지',M_(`${n} − ${d*q}`),m)]}},
     why:{q:`${M_('23 ÷ 4')}에서 나머지가 4보다 크면?`,choices:['한 묶음 더 만들 수 있으니 몫을 1 키워요','그대로 답이에요','나누는 수를 바꿔요'],ans:0,ok:'나머지는 언제나 나누는 수보다 작아요.'}}],
  gen(L,r){const d=ri(r,2,9),q=ri(r,2,9),m=ri(r,1,d-1),n=d*q+m;
   if(L===1)return{q:`${M_(`${n} ÷ ${d}`)}의 몫`,ans:q,steps:[S_(`${d}단에서 ${J(n,'을','를')} 넘지 않는 가장 큰 곱`,'',d*q),S_('그 곱은 몇 묶음?',M_(`${d} × `)+'{?}'+M_(` = ${d*q}`),q)],
     errs:[E_(q+1,`${M_(`${d} × ${q+1} = ${d*(q+1)}`)}${IYs(d*(q+1))}. ${n}보다 커서 안 돼요.`),E_(m,'나머지를 썼어요. 몫은 몇 묶음인지예요.')]};
   if(L===2)return{q:`${M_(`${n} ÷ ${d}`)}의 나머지`,ans:m,steps:[S_(`${d}단에서 ${J(n,'을','를')} 넘지 않는 가장 큰 곱`,'',d*q),S_('남은 수',M_(`${n} − ${d*q}`),m)],
     errs:[E_(m+d,`나머지가 ${d}보다 커요. 한 묶음 더 만들 수 있어요.`),E_(q,'몫을 썼어요. 나머지는 묶고 남은 수예요.')]};
   return{q:`${M_(`□ ÷ ${d} = ${q} … ${m}`)}<br><small>□에 알맞은 수는?</small>`,ans:n,steps:[S_('나누는 수 × 몫',M_(`${d} × ${q}`),d*q),S_('나머지를 더해요',M_(`${d*q} + ${m}`),n)],
     errs:[E_(d*q,'나머지를 더하는 걸 빠뜨렸어요.'),E_(d*q-m,'나머지는 빼지 않고 더해요.')]}}},
 {id:'order',grp:'base',nm:'계산 순서',use:'겉넓이·부피 식을 계산할 때',lv:['1단계 · 곱셈 먼저','2단계 · 괄호 먼저','3단계 · 셋 이상 섞인 식'],
  ways:[{t:'곱셈·나눗셈 먼저',idea:`${M_('3 + 4 × 2')}는 곱셈 ${M_('4 × 2')}를 <b>먼저</b> 해요. 곱셈 부분을 한 묶음으로 보세요.`,
     ex(r){const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,2,9);return{q:M_(`${a} + ${b} × ${c}`),fig:ordFig([`${a} + `,[`${b} × ${c}`]]),ans:a+b*c,steps:[S_('곱셈 먼저',M_(`${b} × ${c}`),b*c),S_('그다음 더하기',M_(`${a} + ${b*c}`),a+b*c)]}},
     why:{q:`${M_('3 + 4 × 2')}에서 3 + 4를 먼저 하면 안 되는 까닭은?`,choices:['곱셈을 먼저 하기로 모두가 약속했어요','3이 작은 수라서','더하기가 더 어려워서'],ans:0,ok:'모두가 같은 답을 얻도록 정한 약속이에요.'}},
   {t:'괄호가 있으면 괄호 먼저',idea:`${M_('(3 + 4) × 2')}는 괄호 안 ${M_('3 + 4')}를 <b>먼저</b> 해요. 괄호는 "이것부터!" 표시예요.`,
     ex(r){const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,2,6);return{q:M_(`(${a} + ${b}) × ${c}`),fig:ordFig([[`(${a} + ${b})`],` × ${c}`]),ans:(a+b)*c,steps:[S_('괄호 먼저',M_(`${a} + ${b}`),a+b),S_('곱해요',M_(`${a+b} × ${c}`),(a+b)*c)]}},
     why:{q:`${M_('3 + 4 × 2')}와 ${M_('(3 + 4) × 2')}의 답은?`,choices:['달라요 (11과 14)','같아요','둘 다 11'],ans:0,ok:'괄호 하나로 계산 순서와 답이 바뀌어요.'}},
   {t:'같은 순서끼리는 왼쪽부터',idea:`${M_('24 ÷ 4 × 2')}처럼 ×와 ÷만 있으면 <b>왼쪽부터</b> 차례로 해요. ${M_('24 ÷ 4 = 6')}, ${M_('6 × 2 = 12')}.`,
     ex(r){const d=ri(r,2,5),q=ri(r,2,6),m=ri(r,2,5),n=d*q;return{q:M_(`${n} ÷ ${d} × ${m}`),fig:ordFig([[`${n} ÷ ${d}`],` × ${m}`]),ans:q*m,steps:[S_('왼쪽 먼저',M_(`${n} ÷ ${d}`),q),S_('그다음',M_(`${q} × ${m}`),q*m)]}},
     why:{q:'×와 ÷가 함께 있으면?',choices:['왼쪽부터 차례로 해요','언제나 ×를 먼저 해요','÷는 맨 나중에 해요'],ans:0,ok:'×와 ÷는 같은 순서라서 왼쪽부터예요. +와 −도 마찬가지예요.'}}],
  gen(L,r){const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,2,6),bad='앞에서부터 차례로 계산했어요. 곱셈을 먼저 해요.';
   if(L===1){const k=ri(r,0,2);
     if(k===0)return{q:M_(`${a} + ${b} × ${c}`),ans:a+b*c,steps:[S_('곱셈 먼저',M_(`${b} × ${c}`),b*c),S_('그다음 더하기',M_(`${a} + ${b*c}`),a+b*c)],errs:[E_((a+b)*c,bad)]};
     if(k===1){const A=b*c+ri(r,1,20);return{q:M_(`${A} − ${b} × ${c}`),ans:A-b*c,steps:[S_('곱셈 먼저',M_(`${b} × ${c}`),b*c),S_('그다음 빼기',M_(`${A} − ${b*c}`),A-b*c)],errs:[E_((A-b)*c,bad)]}}
     return{q:M_(`${b} × ${c} + ${a}`),ans:b*c+a,steps:[S_('곱셈 먼저',M_(`${b} × ${c}`),b*c),S_('그다음 더하기',M_(`${b*c} + ${a}`),b*c+a)],errs:[E_(b*(c+a),'더하기를 먼저 했어요. 곱셈이 먼저예요.')]}}
   if(L===2){const k=ri(r,0,2),np='괄호를 먼저 계산하지 않았어요. 괄호는 "이것부터!"예요.';
     if(k===0)return{q:M_(`(${a} + ${b}) × ${c}`),ans:(a+b)*c,steps:[S_('괄호 먼저',M_(`${a} + ${b}`),a+b),S_('곱해요',M_(`${a+b} × ${c}`),(a+b)*c)],errs:[E_(a+b*c,np)]};
     if(k===1)return{q:M_(`${c} × (${a} + ${b})`),ans:c*(a+b),steps:[S_('괄호 먼저',M_(`${a} + ${b}`),a+b),S_('곱해요',M_(`${c} × ${a+b}`),c*(a+b))],errs:[E_(c*a+b,np)]};
     const A=b+ri(r,2,9);return{q:M_(`(${A} − ${b}) × ${c}`),ans:(A-b)*c,steps:[S_('괄호 먼저',M_(`${A} − ${b}`),A-b),S_('곱해요',M_(`${A-b} × ${c}`),(A-b)*c)],errs:[E_(A-b*c,np)]}}
   const k=ri(r,0,2);
   if(k===0){const d=ri(r,2,5);return{q:M_(`${a} × ${b} + ${c} × ${d}`),ans:a*b+c*d,steps:[S_('앞의 곱셈',M_(`${a} × ${b}`),a*b),S_('뒤의 곱셈',M_(`${c} × ${d}`),c*d),S_('더해요',M_(`${a*b} + ${c*d}`),a*b+c*d)],errs:[E_((a*b+c)*d,'앞에서부터 차례로 계산했어요. 곱셈 두 개를 먼저 해요.')]}}
   if(k===1)return{q:M_(`2 × (${a} + ${b}) + ${c}`),ans:2*(a+b)+c,steps:[S_('괄호 먼저',M_(`${a} + ${b}`),a+b),S_('곱해요',M_(`2 × ${a+b}`),2*(a+b)),S_('더해요',M_(`${2*(a+b)} + ${c}`),2*(a+b)+c)],errs:[E_(2*(a+b+c),'마지막 더하기까지 2를 곱했어요. 괄호 안만 2배예요.'),E_(2*a+b+c,'괄호를 먼저 계산하지 않았어요.')]};
   const d=ri(r,2,5),q=ri(r,2,6),m=ri(r,2,5),n=d*q,errs=[];if(n%(d*m)===0)errs.push(E_(n/(d*m),'×를 먼저 했어요. ×와 ÷는 왼쪽부터예요.'));
   return{q:M_(`${n} ÷ ${d} × ${m}`),ans:q*m,steps:[S_('왼쪽 먼저',M_(`${n} ÷ ${d}`),q),S_('그다음',M_(`${q} × ${m}`),q*m)],errs}}},
 {id:'fracbase',grp:'base',nm:'분수의 뜻',use:'뿔의 부피 ⅓, 구의 부피 4/3',lv:['1단계 · 몇의 몇분의 1','2단계 · 몇의 몇분의 몇','3단계 · 분수 × 자연수, 약분'],
  ways:[{t:'분수는 똑같이 나눈 것 중 몇 개',idea:`12의 ${FR(3,4)}은 12를 <b>4묶음으로 똑같이</b> 나누고, 그중 <b>3묶음</b>이에요.`,
     ex(r){const d=ri(r,3,5),n=ri(r,2,d-1),k=ri(r,2,4),tot=d*k;return{q:`${M_(tot)}의 ${FR(n,d)}`,fig:svgGroups(tot,d,n),ans:k*n,steps:[S_(`${d}묶음으로 나누면 한 묶음은`,M_(`${tot} ÷ ${d}`),k),S_(`${n}묶음이면`,M_(`${k} × ${n}`),k*n)]}},
     why:{q:`12의 ${FR(3,4)}에서 아래의 4는 무엇일까요?`,choices:['똑같이 나눈 묶음의 수','가져가는 묶음의 수','12를 4번 더하라는 뜻'],ans:0,ok:'분모(아래)는 나눈 묶음 수, 분자(위)는 가져가는 묶음 수예요.'}},
   {t:'약분: 위아래를 같은 수로 나누기',idea:`${FR(6,8)}은 6과 8을 <b>둘 다 2로</b> 나누면 ${FR(3,4)}이 돼요. 크기는 그대로예요.`,
     ex(r){const[p,q]=pick(r,[[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[3,5]]),m=ri(r,2,3),A=p*m,B=q*m;return{q:`${FR(A,B)}${J(A,'을','를').slice(String(A).length)} 약분하면?`,fig:svgBars(A,B,p,q),ans:`${p}/${q}`,type:'choice',choices:[`${p}/${q}`],
       steps:[S_(`위아래를 모두 ${josaRo(String(m))} 나눠요 · 분자`,M_(`${A} ÷ ${m}`),p),S_('분모',M_(`${B} ÷ ${m}`),q)]}},
     why:{q:`${FR(6,8)}을 ${FR(3,4)}로 바꾸면 크기는?`,choices:['그대로예요','작아져요','커져요'],ans:0,ok:'조각을 크게 묶었을 뿐, 전체에서 차지하는 양은 같아요.'}}],
  gen(L,r){
   if(L===1){const d=ri(r,2,5),k=ri(r,2,9),tot=d*k;return{q:`${M_(tot)}의 ${FR(1,d)}`,ans:k,steps:[S_(`${d}묶음으로 나누면 한 묶음은`,M_(`${tot} ÷ ${d}`),k)],
     errs:[E_(tot*d,`곱했어요. ${FR(1,d)}은 ${d}묶음으로 나눈 것 중 하나예요.`),E_(tot-d,`뺐어요. ${d}묶음으로 똑같이 나눠요.`)]}}
   if(L===2){const d=ri(r,3,6),n=ri(r,2,d-1),k=ri(r,2,6),tot=d*k,errs=[E_(k,`한 묶음만 구했어요. ${n}묶음이니까 ${J(n,'을','를')} 곱해요.`)];if((tot*d)%n===0)errs.push(E_(tot*d/n,'분자와 분모를 바꿨어요. 분모로 나누고 분자를 곱해요.'));
     return{q:`${M_(tot)}의 ${FR(n,d)}`,ans:k*n,steps:[S_(`${d}묶음으로 나누면 한 묶음은`,M_(`${tot} ÷ ${d}`),k),S_(`${n}묶음이면`,M_(`${k} × ${n}`),k*n)],errs}}
   if(r()<0.5){const d=ri(r,3,6),n=ri(r,2,d-1),k=ri(r,2,6),tot=d*k;return{q:`${FR(n,d)} ${M_('× '+tot)}`,ans:k*n,steps:[S_(`${tot}의 ${FR(n,d)}과 같아요 · 한 묶음`,M_(`${tot} ÷ ${d}`),k),S_(`${n}묶음`,M_(`${k} × ${n}`),k*n)],
     errs:[E_(k,`한 묶음만 구했어요. 분자 ${J(n,'을','를')} 곱해요.`),E_(tot*n,`${josaRo(String(d))} 나누는 걸 빠뜨렸어요.`)]}}
   const[p,q]=pick(r,[[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[3,5],[4,5],[5,6]]),m=ri(r,2,4),A=p*m,B=q*m,ok=`${p}/${q}`;
   const W={[`${A-1}/${B-1}`]:'위아래에서 같은 수를 빼면 크기가 달라져요. 같은 수로 나눠야 해요.',[`${p}/${B}`]:'분자만 나눴어요. 분모도 같은 수로 나눠요.',[`${A}/${q}`]:'분모만 나눴어요. 분자도 같은 수로 나눠요.',[`${B}/${A}`]:'위아래가 바뀌었어요.'};
   const ch=shuffle(r,[ok,...shuffle(r,Object.keys(W).filter(x=>x!==ok)).slice(0,3)]);
   return{q:`${FR(A,B)}${J(A,'을','를').slice(String(A).length)} 약분하면?`,type:'choice',choices:ch,mathChoices:true,ans:ok,errc:W,steps:[S_(`위아래를 모두 ${josaRo(String(m))} 나눠요 · 분자`,M_(`${A} ÷ ${m}`),p),S_('분모',M_(`${B} ÷ ${m}`),q)]}}},
 {id:'mixed',grp:'mid',nm:'대분수와 가분수',use:'유리수를 수직선에 나타내기, 분수의 크기 비교',lv:['1단계 · 대분수를 가분수로','2단계 · 가분수를 대분수로','3단계 · 크기 비교'],
  ways:[{t:'통째 하나는 분모만큼 조각',idea:`${M_('2')}${FR(1,3)}은 통째 2개와 ${FR(1,3)}이에요. 통째 하나는 <b>3조각</b>이니까 2개는 6조각, 더하면 <b>7조각</b> → ${FR(7,3)}.`,
     ex(r){const d=ri(r,2,5),w=ri(r,1,3),n=ri(r,1,d-1),N=w*d+n;return{q:`${M_(w)}${FR(n,d)}${J(n,'을','를').slice(String(n).length)} 가분수로`,ans:N/d,type:'sn',ansText:`${N}/${d}`,
       steps:[S_(`통째 ${w}개는 몇 조각?`,M_(`${w} × ${d}`),w*d),S_('남은 조각을 더해요',M_(`${w*d} + ${n}`),N),S_('가분수로 답해요 ( / 단추 )','',N/d,'sn')]}},
     why:{q:`${M_('2')}${FR(1,3)}을 가분수로 바꿀 때 분모는?`,choices:['그대로 3','2 × 3 = 6','1 + 3 = 4'],ans:0,ok:'조각의 크기는 그대로라서 분모는 바뀌지 않아요.'}},
   {t:'가분수는 분모만큼씩 묶어요',idea:`${FR(11,4)}는 4조각씩 묶으면 <b>2묶음과 3조각</b>, 그래서 ${M_('2')}${FR(3,4)}이에요. 나눗셈 ${M_('11 ÷ 4 = 2 … 3')}과 같아요.`,
     ex(r){const d=ri(r,3,6),w=ri(r,1,3),n=ri(r,1,d-1),N=w*d+n;return{q:`${FR(N,d)} = ${M_('□')}${FR('△',d)}<br><small>△에 알맞은 수는?</small>`,ans:n,
       steps:[S_(`${d}조각씩 몇 묶음? (${N} ÷ ${d}의 몫)`,'',w),S_('남은 조각 △',M_(`${N} − ${w*d}`),n)]}},
     why:{q:`${FR(11,4)}를 대분수로 바꿀 때 쓰는 계산은?`,choices:['11 ÷ 4','11 × 4','11 − 4'],ans:0,ok:'4조각씩 몇 묶음인지 나눗셈으로 세요.'}}],
  gen(L,r){let d=ri(r,2,8),n=ri(r,1,d-1);while(gcd_(n,d)>1){d=ri(r,2,8);n=ri(r,1,d-1)}const w=ri(r,1,4),N=w*d+n;
   if(L===1)return{q:`${M_(w)}${FR(n,d)}${J(n,'을','를').slice(String(n).length)} 가분수로 나타내면?`,ans:N/d,type:'sn',ansText:`${N}/${d}`,
     steps:[S_(`통째 ${w}개는 몇 조각?`,M_(`${w} × ${d}`),w*d),S_('남은 조각을 더하면 분자',M_(`${w*d} + ${n}`),N),S_('가분수로 답해요 ( / 단추 )','',N/d,'sn')],
     errs:[E_((w+n)/d,`통째 하나를 1조각으로 셌어요. 통째 하나는 ${d}조각이에요.`),E_(N/(w*d),'분모까지 바꿨어요. 분모는 그대로예요.')]};
   if(L===2){const askW=r()<0.5;
     return askW?{q:`${FR(N,d)} = ${M_('□')}${FR('△',d)}<br><small>□에 알맞은 수는?</small>`,ans:w,steps:[S_(`${d}조각씩 묶으면 몇 묶음? (${N} ÷ ${d}의 몫)`,M_(`${d} × `)+'{?}'+M_(` ≤ ${N}`),w)],
       errs:[E_(w+1,`${M_(`${d} × ${w+1} = ${d*(w+1)}`)}${IYs(d*(w+1))}. ${N}보다 커서 안 돼요.`),E_(n,'△를 구했어요. □는 묶음의 수예요.')]}
     :{q:`${FR(N,d)} = ${M_('□')}${FR('△',d)}<br><small>△에 알맞은 수는?</small>`,ans:n,steps:[S_(`${d}조각씩 묶으면 몇 묶음? (□)`,'',w),S_('남은 조각 △',M_(`${N} − ${d} × ${w}`),n)],
       errs:[E_(N-d,`${d}조각을 한 번만 뺐어요. ${d}조각씩 묶을 수 있는 만큼 모두 묶어요.`),E_(w,'□를 구했어요. △는 남은 조각이에요.')]}}
   const N2=r()<0.2?N:N+pick(r,[-2,-1,1,2]),ok=N>N2?'왼쪽이 커요':N<N2?'오른쪽이 커요':'같아요',ch=['왼쪽이 커요','오른쪽이 커요','같아요'],bad='가분수로 바꿔서 분자끼리 비교해요.';
   return{q:`${M_(w)}${FR(n,d)} ${M_('○')} ${FR(N2,d)}<br><small>어느 쪽이 클까요?</small>`,type:'choice',choices:ch,ans:ok,errc:Object.fromEntries(ch.filter(c=>c!==ok).map(c=>[c,bad])),
     steps:[S_(`${M_(w)}${FR(n,d)}${J(n,'을','를').slice(String(n).length)} 가분수로 바꾸면 분자는?`,M_(`${w} × ${d} + ${n}`),N),S_(`분자 ${J(N,'과','와')} ${N2}${J(N2,'을','를').slice(String(N2).length)} 비교하면`,'',ok,'choice',ch)]}}},
 {id:'est',grp:'base',nm:'어림하기',use:'계산한 답이 맞는지 확인할 때',lv:['1단계 · 가까운 몇십','2단계 · 곱을 어림하기','3단계 · 맞는 계산 고르기'],
  ways:[{t:'가까운 몇십으로 바꿔 어림하기',idea:`${M_('29 × 4')}는 29를 <b>가까운 30</b>으로 바꾸면 ${M_('30 × 4 = 120')}쯤이에요.`,
     ex(r){const R=ri(r,2,9)*10,a=R+pick(r,[-2,-1,1,2]),b=ri(r,3,9);return{q:`${M_(`${a} × ${b}`)}${J(b,'은','는').slice(String(b).length)} 약 얼마?`,fig:svgRound(a,R),ans:R*b,steps:[S_(`${a}에 가장 가까운 몇십은?`,'',R),S_('어림한 곱',M_(`${R} × ${b}`),R*b)]}},
     why:{q:'어림하기는 언제 쓰면 좋을까요?',choices:['계산한 답이 맞는지 빨리 확인할 때','정확한 답이 꼭 필요할 때','답을 외울 때'],ans:0,ok:'어림한 값과 많이 다르면 계산을 다시 확인해요.'}},
   {t:'답이 말이 되는지 확인하기',idea:`${M_('48 × 5')}를 계산했더니 2400이 나왔다면? 어림하면 ${M_('50 × 5 = 250')}쯤이니까 <b>잘못 계산했어요</b>.`,
     ex(r){const R=ri(r,3,9)*10,a=R+pick(r,[-2,-1,1,2]),b=ri(r,3,8),w=a*b*10,ch=['맞아요','틀렸어요'];return{q:`${M_(`${a} × ${b} = ${w}`)}${J(w,'이라고','라고').slice(String(w).length)} 계산했어요. 맞을까요?`,ans:'틀렸어요',type:'choice',choices:ch,
       steps:[S_(`${a}에 가장 가까운 몇십은?`,'',R),S_('어림한 곱',M_(`${R} × ${b}`),R*b),S_(`${J(w,'과','와')} ${J(R*b,'을','를')} 비교하면 계산은?`,'','틀렸어요','choice',ch)]}},
     why:{q:'어림한 값과 계산한 답이 아주 다르면?',choices:['계산을 다시 확인해요','그대로 답을 써요','어림한 값을 답으로 써요'],ans:0,ok:'어림은 실수를 잡아 주는 안전망이에요.'}}],
  gen(L,r){
   if(L===1){const T=ri(r,1,9)*10,o=pick(r,[1,2,3,4,6,7,8,9]),a=T+o,R=o<5?T:T+10;
     return{q:`${M_(a)}에 가장 가까운 몇십은?`,ans:R,steps:[S_(`${a}의 일의 자리 숫자는?`,'',o),S_(o<5?'5보다 작으면 버려요':'5보다 크면 올려요','',R)],errs:[E_(o<5?T+10:T,o<5?'일의 자리가 5보다 작으면 버려요.':'일의 자리가 5보다 크면 올려요.')]}}
   const R=ri(r,2,9)*10,a=R+pick(r,[-2,-1,1,2]),b=ri(r,3,9);
   if(L===2){const ok=String(R*b),ch=shuffle(r,[ok,String(R*b*10),String(R*b/10),String(R+b)]);
     return{q:`${M_(`${a} × ${b}`)}${J(b,'을','를').slice(String(b).length)} 어림하면 약 얼마일까요?`,type:'choice',choices:ch,mathChoices:true,ans:ok,errc:{[R*b*10]:'0이 하나 더 붙었어요.',[R*b/10]:'0을 빠뜨렸어요.',[R+b]:'더했어요. 곱을 어림해요.'},
       steps:[S_(`${a}에 가장 가까운 몇십은?`,'',R),S_('어림한 곱',M_(`${R} × ${b}`),R*b),S_('보기에서 고르면','',ok,'choice',ch)]}}
   const mk=()=>{const R2=ri(r,2,9)*10,a2=R2+pick(r,[-2,-1,1,2]),b2=ri(r,3,9);return[a2,b2,R2]},rows=[[a,b,R],mk(),mk(),mk()];
   const okS=`${a} × ${b} = ${a*b}`,bad=rows.slice(1).map(([x,y],i)=>{const v=[x*y*10,x*y+100*(i+1),Math.round(x*y/10)][i];return[`${x} × ${y} = ${v}`,x,y]}),errc={};
   bad.forEach(([s,x,y])=>{const R2=Math.round(x/10)*10;errc[s]=`어림하면 ${M_(`${R2} × ${y} = ${R2*y}`)}쯤이에요. 차이가 너무 커요.`});
    const ch=shuffle(r,[okS,...bad.map(x=>x[0])]);
    return{q:'다음 중 바르게 계산한 것은?',type:'choice',choices:ch,mathChoices:true,ans:okS,errc,steps:[S_(`${a}에 가장 가까운 몇십은?`,'',R),S_(`어림한 곱 (${M_(`${R} × ${b}`)})`,M_(`${R} × ${b}`),R*b),S_(`어림값 ${R*b}쯤인 올바른 식은?`,'',okS,'choice',ch)]}}},
 /* ═══ 입체도형에서 쓰는 계산 ═══ */
 {id:'mul',grp:'solid',nm:'곱셈 감각',use:'넓이·부피를 구할 때',lv:['1단계 · 몇십 × 한 자리','2단계 · 두 자리 × 한 자리','3단계 · × 5, × 25, 10이 되는 짝'],
  ways:[{t:'10과 나머지로 쪼개기',idea:'두 자리 수는 <b>10짜리와 나머지</b>로 나눠서 곱한 뒤 더해요.',
     ex(r){const a=ri(r,12,19),b=ri(r,3,8),u=a-10;return{q:M_(`${a} × ${b}`),fig:svgSplit(a,b),ans:a*b,steps:[S_(`${J(a,'을','를')} 10과 몇으로 나눠요`,M_(`${a} − 10`),u),S_('10짜리 곱하기',M_(`10 × ${b}`),10*b),S_('나머지 곱하기',M_(`${u} × ${b}`),u*b),S_('두 개 더하기',M_(`${10*b} + ${u*b}`),a*b)]}},
     why:{q:`${M_('17 × 6')}을 ${M_('10 × 6')}과 ${M_('7 × 6')}으로 나눠 계산해도 되는 까닭은?`,choices:['17 = 10 + 7이라서','6이 짝수라서','곱셈은 언제나 10부터 해서'],ans:0,ok:'17묶음을 10묶음과 7묶음으로 나눠 센 것과 같아요.'}},
   {t:'× 5는 × 10 ÷ 2',idea:'5는 10의 절반이에요. <b>10을 곱한 뒤 반으로</b> 나눠요.',
     ex(r){const a=ri(r,6,24)*2;return{q:M_(`${a} × 5`),ans:a*5,steps:[S_('10을 곱해요',M_(`${a} × 10`),a*10),S_('반으로 나눠요',M_(`${a*10} ÷ 2`),a*5)]}},
     why:{q:'5는 10의 얼마일까요?',choices:['절반','두 배','10배'],ans:0,ok:'5 = 10 ÷ 2라서 10을 곱하고 반으로 나눠요.'}},
   {t:'× 25는 × 100 ÷ 4',idea:'25는 100의 4분의 1이에요. <b>100을 곱한 뒤 4로</b> 나눠요.',
     ex(r){const a=ri(r,2,9)*4;return{q:M_(`${a} × 25`),ans:a*25,steps:[S_('100을 곱해요',M_(`${a} × 100`),a*100),S_('4로 나눠요',M_(`${a*100} ÷ 4`),a*25)]}},
     why:{q:'25를 4번 더하면?',choices:['100','50','125'],ans:0,ok:'25 × 4 = 100이라서 100을 곱하고 4로 나눠요.'}},
   {t:'10이 되는 짝 먼저',idea:`${M_('5 × 7 × 2')}는 순서를 바꿔 ${M_('5 × 2 = 10')}을 먼저 해요. 그다음 ${M_('10 × 7 = 70')}. 부피 계산에서 자주 써요.`,
     ex(r){const[x,y]=pick(r,[[5,2],[2,5],[5,4],[4,5],[25,4],[4,25]]),P=x*y,m=ri(r,3,9);return{q:M_(`${x} × ${m} × ${y}`),ans:P*m,steps:[S_('짝 먼저',M_(`${x} × ${y}`),P),S_('남은 수 곱하기',M_(`${P} × ${m}`),P*m)]}},
     why:{q:'곱셈만 있을 때 순서를 바꿔도 될까요?',choices:['돼요. 답이 같아요','안 돼요','덧셈일 때만 돼요'],ans:0,ok:'곱셈끼리는 순서를 바꿔도, 먼저 묶어도 답이 같아요.'}}],
  gen(L,r){
   if(L===1){const t=ri(r,2,9),b=ri(r,2,9);return{q:M_(`${t*10} × ${b}`),ans:t*b*10,steps:[S_('0을 떼고 곱해요',M_(`${t} × ${b}`),t*b),S_('0을 붙여요',M_(`${t*b} × 10`),t*b*10)],errs:[E_(t*b,'0을 붙이는 걸 빠뜨렸어요.'),E_(t*b*100,'0을 하나만 붙여요.')]}}
   if(L===2){const a=ri(r,11,19),b=ri(r,2,7),u=a-10;return{q:M_(`${a} × ${b}`),ans:a*b,steps:[S_('10짜리 곱하기',M_(`10 × ${b}`),10*b),S_('나머지 곱하기',M_(`${u} × ${b}`),u*b),S_('두 개 더하기',M_(`${10*b} + ${u*b}`),a*b)],
     errs:[E_(10*b+u,`${u}에도 ${J(b,'을','를')} 곱해야 해요. 쪼갠 두 부분 모두 곱해요.`),E_(10+u*b,`10에도 ${J(b,'을','를')} 곱해야 해요.`),E_(a+b,'더했어요. 곱해야 해요.')]}}
   const k=ri(r,0,3);
   if(k===0){const a=ri(r,2,9)*4;return{q:M_(`${a} × 25`),ans:a*25,steps:[S_('100을 곱해요',M_(`${a} × 100`),a*100),S_('4로 나눠요',M_(`${a*100} ÷ 4`),a*25)],errs:[E_(a*100,'4로 나누는 걸 빠뜨렸어요.')]}}
   if(k===1){const a=ri(r,6,30)*2;return{q:M_(`${a} × 5`),ans:a*5,steps:[S_('10을 곱해요',M_(`${a} × 10`),a*10),S_('반으로 나눠요',M_(`${a*10} ÷ 2`),a*5)],errs:[E_(a*10,'반으로 나누는 걸 빠뜨렸어요.')]}}
   if(k===2){const[x,y]=pick(r,[[5,2],[2,5],[5,4],[4,5],[25,4],[4,25]]),P=x*y,m=ri(r,3,12);return{q:M_(`${x} × ${m} × ${y}`),ans:P*m,steps:[S_('10이 되는 짝 먼저',M_(`${x} × ${y}`),P),S_('남은 수 곱하기',M_(`${P} × ${m}`),P*m)]}}
   const a=ri(r,21,39),b=ri(r,2,6),t=a-a%10,u=a%10;return{q:M_(`${a} × ${b}`),ans:a*b,steps:[S_(`${t}짜리 곱하기`,M_(`${t} × ${b}`),t*b),S_('나머지 곱하기',M_(`${u} × ${b}`),u*b),S_('두 개 더하기',M_(`${t*b} + ${u*b}`),a*b)],
     errs:[E_(t*b+u,`${u}에도 ${J(b,'을','를')} 곱해야 해요.`),E_(t+u*b,`${t}에도 ${J(b,'을','를')} 곱해야 해요.`)]}}},
 {id:'pow',grp:'solid',nm:'제곱수와 세제곱수',use:'원의 넓이 πr², 정육면체 부피',lv:['1단계 · 한 자리 수의 제곱','2단계 · 세제곱, 10~15의 제곱','3단계 · 큰 세제곱, 제곱이 섞인 곱'],
  ways:[{t:'제곱은 같은 수를 두 번 곱하기',idea:`${M_('7²')}은 ${M_('7 × 7')}이에요. 한 변이 7인 <b>정사각형의 칸 수</b>예요. ${M_('7 × 2')}가 아니에요!`,
     ex(r){const a=ri(r,3,8);return{q:M_(`${a}²`),fig:svgGrid(a),ans:a*a,steps:[S_(`${M_(`${a}²`)}${J(a,'은','는').slice(String(a).length)} ${J(a,'을','를')} 몇 번 곱한 것? <small>(작은 2가 곱하는 횟수)</small>`,'',2),S_('곱해요',M_(`${a} × ${a}`),a*a)]}},
     why:{q:`${M_('7²')}은 얼마일까요?`,choices:['7 × 7 = 49','7 × 2 = 14','7 + 7 = 14'],ans:0,ok:'작은 2는 같은 수를 두 번 곱하라는 표시예요.'}},
   {t:'세제곱은 두 번에 나눠서',idea:`${M_('4³')} = ${M_('4 × 4 × 4')}. <b>앞의 두 개를 먼저</b> 곱하고, 한 번 더 곱해요.`,
     ex(r){const a=ri(r,2,5);return{q:M_(`${a}³`),ans:a**3,steps:[S_('앞의 두 개 먼저',M_(`${a} × ${a}`),a*a),S_('한 번 더 곱해요',M_(`${a*a} × ${a}`),a**3)]}},
     why:{q:`${M_('4³')}은 4를 몇 번 곱한 것일까요?`,choices:['3번','4번','2번'],ans:0,ok:'4 × 4 × 4, 세 번이에요.'}},
   {t:'두 자리 제곱은 쪼개서',idea:`${M_('13²')} = ${M_('13 × 13')} = ${M_('13 × 10 + 13 × 3')}. 곱셈 감각의 쪼개기를 써요.`,
     ex(r){const a=ri(r,11,15),u=a-10;return{q:M_(`${a}²`),ans:a*a,steps:[S_('10을 곱해요',M_(`${a} × 10`),a*10),S_(`${J(u,'을','를')} 곱해요`,M_(`${a} × ${u}`),a*u),S_('더해요',M_(`${a*10} + ${a*u}`),a*a)]}},
     why:{q:`${M_('13²')}을 ${M_('100 + 9')}로 계산하면 될까요?`,choices:['안 돼요. 13 × 13 = 13 × 10 + 13 × 3이에요','돼요. 10²과 3²을 더하면 돼요','돼요. 제곱은 더하기라서'],ans:0,ok:'10² + 3²에는 10 × 3 부분이 빠져 있어요. 쪼갠 두 부분 모두 13을 곱해요.'}}],
  gen(L,r){if(L===1){const a=ri(r,2,9);return{q:M_(`${a}²`),ans:a*a,steps:[S_('같은 수를 두 번 곱해요',M_(`${a} × ${a}`),a*a)],errs:[E_(2*a,`${M_(`${a} × 2`)}를 했어요. ${M_(`${a}²`)}${J(a,'은','는').slice(String(a).length)} ${M_(`${a} × ${a}`)}${IYs(a)}.`)]}}
   if(L===2){if(r()<0.5){const a=ri(r,2,5);return{q:M_(`${a}³`),ans:a**3,steps:[S_('앞의 두 개 먼저',M_(`${a} × ${a}`),a*a),S_('한 번 더',M_(`${a*a} × ${a}`),a**3)],errs:[E_(3*a,'3을 곱했어요. 세제곱은 같은 수를 세 번 곱해요.'),E_(a*a,'두 번만 곱했어요. 세제곱은 세 번이에요.')]}}
     const a=ri(r,11,15),u=a-10;return{q:M_(`${a}²`),ans:a*a,steps:[S_('10을 곱해요',M_(`${a} × 10`),a*10),S_(`${J(u,'을','를')} 곱해요`,M_(`${a} × ${u}`),a*u),S_('더해요',M_(`${a*10} + ${a*u}`),a*a)],
       errs:[E_(2*a,'2를 곱했어요. 제곱은 같은 수를 두 번 곱해요.'),E_(100+u*u,`${M_(`10² + ${u}²`)}만 더했어요. 가운데 부분(${M_(`10 × ${u}`)})이 두 번 빠졌어요. 쪼개서 곱해요.`)]}}
   if(r()<0.5){const a=ri(r,6,10);return{q:M_(`${a}³`),ans:a**3,steps:[S_('앞의 두 개 먼저',M_(`${a} × ${a}`),a*a),S_('한 번 더',M_(`${a*a} × ${a}`),a**3)],errs:[E_(3*a,'3을 곱했어요. 세제곱은 세 번 곱하기예요.'),E_(a*a,'두 번만 곱했어요.')]}}
   const a=ri(r,2,6),b=ri(r,2,5);return{q:M_(`${a}² × ${b}`),ans:a*a*b,steps:[S_('제곱 먼저',M_(`${a} × ${a}`),a*a),S_('그다음 곱해요',M_(`${a*a} × ${b}`),a*a*b)],errs:[E_(2*a*b,'제곱을 × 2로 했어요.'),E_((a*b)**2,'곱한 다음 제곱했어요. 제곱 먼저예요.')]}}},
 {id:'sub',grp:'solid',nm:'식에 수 넣기',use:'정비례(y=ax)·반비례(y=a/x) 대입과 입체도형 개수 식',lv:['1단계 · 2n, 3n','2단계 · 2n + 3','3단계 · 개수 식에 넣기'],
  ways:[{t:'문자 자리에 수를 넣어요',idea:`${M_('2')}${N_}은 ${M_('2 × ')}${N_}이에요. ${N_} 자리에 수를 넣으면 <b>숨어 있던 곱하기</b>가 보여요.`,
     ex(r){const n=ri(r,3,9),a=ri(r,2,3),b=ri(r,1,4);return{q:`${N_} = ${M_(n)}일 때, ${M_(a)}${N_}${M_(` + ${b}`)}`,ans:a*n+b,steps:[S_(`${N_} 자리에 넣으면 ${M_(`${a} × `)}{?}${M_(` + ${b}`)}`.replace('{?}',BOX),'',n),S_('곱하기 먼저',M_(`${a} × ${n}`),a*n),S_('그다음 더하기',M_(`${a*n} + ${b}`),a*n+b)]}},
     why:{q:`${M_('2')}${N_}에서 ${N_} = 5이면 25가 아닌 까닭은?`,choices:['2n은 2 × n이라서','25는 너무 커서','5가 홀수라서'],ans:0,ok:'숫자와 문자 사이에 ×가 숨어 있어요. 2n = 2 × 5 = 10.'}},
   {t:'개수 식에 넣기',idea:`${M_('n')}각기둥의 모서리는 ${M_('3')}${N_}개. 칠각기둥이면 ${N_} = 7을 넣어요.`,
     ex(r){const n=ri(r,5,9);return{q:`${kn(n)}각기둥의 모서리의 개수 (${M_('3')}${N_}개)`,ans:3*n,suffix:'개',steps:[S_(`${kn(n)}각기둥이면 ${N_}은?`,'',n),S_('식에 넣어요',M_(`3 × ${n}`),3*n)]}},
     why:{q:`${M_('n')}각기둥에서 ${N_}은 무엇일까요?`,choices:['밑면의 변의 개수','면의 개수','높이'],ans:0,ok:'칠각기둥은 밑면이 칠각형이라서 n = 7이에요.'}}],
  gen(L,r){const n=ri(r,3,10);
   if(L===1){const a=ri(r,2,3);return{q:`${N_} = ${M_(n)}일 때, ${M_(a)}${N_}의 값`,ans:a*n,steps:[S_('숨어 있는 곱하기',M_(`${a} × ${n}`),a*n)],errs:[E_(Number(`${a}${n}`),`${M_(a)}${N_}은 ${M_(`${a} × ${n}`)}${IYs(n)}. 숫자를 붙여 쓰면 안 돼요.`),E_(a+n,'더했어요. 숫자와 문자 사이에는 ×가 숨어 있어요.')]}}
   if(L===2){const a=ri(r,2,3),b=ri(r,1,4);return{q:`${N_} = ${M_(n)}일 때, ${M_(a)}${N_}${M_(` + ${b}`)}의 값`,ans:a*n+b,steps:[S_('곱하기 먼저',M_(`${a} × ${n}`),a*n),S_('그다음 더하기',M_(`${a*n} + ${b}`),a*n+b)],
     errs:[E_(Number(`${a}${n}`)+b,`${M_(a)}${N_}은 ${M_(`${a} × ${n}`)}${IYs(n)}. 숫자를 붙여 쓰면 안 돼요.`),E_(a*(n+b),'더하기를 먼저 했어요. 곱하기 먼저예요.'),E_(a+n+b,'곱해야 할 곳을 더했어요.')]}}
   const tp=pick(r,['prism','pyramid','frustum']),Ty=TYPE[tp],pp=pick(r,['F','E','V']),f=String(Ty['f'+pp]).replace('+',' + ');const m=f.match(/^(\d*)n(?:\s*\+\s*(\d+))?$/),a=m&&m[1]?+m[1]:1,b=m&&m[2]?+m[2]:0;
   const errs=['F','E','V'].filter(x=>x!==pp&&Ty[x](n)!==Ty[pp](n)).map(x=>E_(Ty[x](n),`${PART[x]}의 개수를 구했어요. ${josa(PART[pp],'은','는')} ${M_(f)}개예요.`));
   return{q:`${kn(n)}${Ty.nm}의 ${PART[pp]}의 개수`,ans:Ty[pp](n),suffix:'개',steps:[S_(`${PART[pp]}의 개수 식 ${M_(f)}에서 ${N_}은?`,'',n),...(a>1?[S_('곱하기 먼저',M_(`${a} × ${n}`),a*n)]:[]),...(b?[S_('더하기',M_(`${a*n} + ${b}`),a*n+b)]:[])],errs}}},
 {id:'eq',grp:'solid',nm:'거꾸로 풀기',use:'정비례·반비례에서 x·a 구하기, 몇 각기둥인지 찾기',lv:['1단계 · 한 번 되돌리기','2단계 · 두 번 되돌리기','3단계 · 개수에서 n 찾기'],
  ways:[{t:'곱했으면 나눠요',idea:`${M_('3')}${N_}${M_(' = 24')}는 "3에 무엇을 곱하면 24?"예요. <b>곱하기를 거꾸로</b> 하면 나누기예요.`,
     ex(r){const a=ri(r,2,5),n=ri(r,3,9);return{q:`${M_(a)}${N_}${M_(` = ${a*n}`)}일 때, ${N_}의 값`,ans:n,steps:[S_('거꾸로 나눠요',M_(`${a*n} ÷ ${a}`),n),S_('맞는지 확인: 넣어 보기',M_(`${a} × ${n}`),a*n)]}},
     why:{q:`${M_('3')}${N_}${M_(' = 24')}에서 ${N_}을 구할 때 왜 나눌까요?`,choices:['3을 곱한 것을 되돌리려고','24가 짝수라서','나눗셈이 쉬워서'],ans:0,ok:'곱하기를 되돌리는 것이 나누기예요.'}},
   {t:'더했으면 먼저 빼요',idea:`${M_('2')}${N_}${M_(' + 2 = 16')}은 <b>나중에 한 것(+ 2)부터</b> 거꾸로 풀어요. 양말 신고 신발 신었으면, 벗을 땐 신발부터!`,
     ex(r){const a=ri(r,2,3),b=ri(r,1,3),n=ri(r,3,9);return{q:`${M_(a)}${N_}${M_(` + ${b} = ${a*n+b}`)}일 때, ${N_}의 값`,ans:n,steps:[S_(`+ ${b}를 거꾸로: 빼요`,M_(`${a*n+b} − ${b}`),a*n),S_(`× ${a}를 거꾸로: 나눠요`,M_(`${a*n} ÷ ${a}`),n)]}},
     why:{q:`${M_('2')}${N_}${M_(' + 2 = 16')}을 풀 때 무엇부터 되돌릴까요?`,choices:['+ 2부터 (빼기)','× 2부터 (나누기)','아무거나'],ans:0,ok:'나중에 한 것부터 거꾸로! 신발부터 벗어요.'}}],
  gen(L,r){const n=ri(r,3,10);
   if(L===1){if(r()<0.4){const b=ri(r,1,5),c=n+b;return{q:`${N_}${M_(` + ${b} = ${c}`)}일 때, ${N_}의 값`,ans:n,steps:[S_('거꾸로 빼요',M_(`${c} − ${b}`),n)],errs:[E_(c+b,'더했어요. 더하기를 거꾸로 하면 빼기예요.')]}}
     const a=ri(r,2,4),c=a*n;return{q:`${M_(a)}${N_}${M_(` = ${c}`)}일 때, ${N_}의 값`,ans:n,steps:[S_('거꾸로 나눠요',M_(`${c} ÷ ${a}`),n)],errs:[E_(c*a,'곱했어요. 거꾸로 하려면 나눠요.'),E_(c-a,'뺐어요. 곱하기를 거꾸로 하면 나누기예요.')]}}
   if(L===2){const a=ri(r,2,3),b=ri(r,1,4),c=a*n+b,errs=[E_(c-b,'빼기만 했어요. 그다음 나누기도 해요.')];if((c+b)%a===0)errs.push(E_((c+b)/a,`+ ${J(b,'을','를')} 되돌릴 때는 빼요.`));if(c%a===0)errs.push(E_(c/a-b,`나누기를 먼저 했어요. 나중에 한 + ${b}부터 되돌려요.`));
     return{q:`${M_(a)}${N_}${M_(` + ${b} = ${c}`)}일 때, ${N_}의 값`,ans:n,steps:[S_('먼저 빼요',M_(`${c} − ${b}`),a*n),S_('그다음 나눠요',M_(`${a*n} ÷ ${a}`),n)],errs}}
   const tp=pick(r,['prism','pyramid']),Ty=TYPE[tp],pp=pick(r,['E','F']),f=String(Ty['f'+pp]).replace('+',' + '),v=Ty[pp](n);const m=f.match(/^(\d*)n(?:\s*\+\s*(\d+))?$/),a=m&&m[1]?+m[1]:1,b=m&&m[2]?+m[2]:0;
   const errs=[];if(a>1&&b)errs.push(E_(v-b,'빼기만 하고 나누지 않았어요.'));if(b&&v%a===0&&a>1)errs.push(E_(v/a,'빼기를 먼저 해야 해요.'));if(b)errs.push(E_(v+b,'더했어요. 더하기를 거꾸로 하면 빼기예요.'));if(a>1)errs.push(E_(v*a,'곱했어요. 거꾸로 하려면 나눠요.'));
   return{q:`${josa(PART[pp],'이','가')} ${M_(v)}개인 ${Ty.nm}은 몇 ${Ty.nm}인가요? <small>(${N_}의 값)</small>`,ans:n,steps:[...(b?[S_(`${M_(f)} = ${v}, 먼저 빼요`,M_(`${v} − ${b}`),v-b)]:[]),...(a>1?[S_('나눠요',M_(`${v-b} ÷ ${a}`),n)]:[])],errs}}},
 {id:'area',grp:'solid',nm:'넓이 공식',use:'겉넓이를 구할 때 면마다',lv:['1단계 · 직사각형, 정사각형','2단계 · 삼각형, 평행사변형','3단계 · 사다리꼴'],
  ways:[{t:'직사각형은 칸 세기',idea:'가로 5 cm, 세로 3 cm인 직사각형에는 1 cm² 칸이 <b>한 줄에 5개씩 3줄</b> 있어요. 그래서 넓이는 가로 × 세로.',
     ex(r){const a=ri(r,3,8),b=ri(r,2,5);return{q:`가로 ${M_(a+' cm')}, 세로 ${M_(b+' cm')}인 직사각형의 넓이`,fig:svgGridRect(a,b),ans:a*b,suffix:'cm²',steps:[S_('한 줄에 몇 칸?','',a),S_('몇 줄?','',b),S_('모두 몇 칸?',M_(`${a} × ${b}`),a*b)]}},
     why:{q:'직사각형의 넓이를 가로 × 세로로 구하는 까닭은?',choices:['1 cm² 칸이 가로 개수만큼씩 세로 줄 수만큼 있어서','둘레를 구하는 방법이라서','가로와 세로를 더하면 길어서'],ans:0,ok:'곱셈은 같은 개수씩 묶어 세는 방법이에요.'}},
   {t:'삼각형은 직사각형의 절반',idea:'삼각형을 둘러싼 직사각형을 그리면 삼각형은 딱 <b>절반</b>이에요. 그래서 밑변 × 높이 <b>÷ 2</b>.',
     ex(r){let a=ri(r,3,10),h=ri(r,2,8);if((a*h)%2)a++;return{q:`밑변 ${M_(a+' cm')}, 높이 ${M_(h+' cm')}인 삼각형의 넓이`,fig:svgHalf(a,h),ans:a*h/2,suffix:'cm²',steps:[S_('둘러싼 직사각형의 넓이',M_(`${a} × ${h}`),a*h),S_('그 절반',M_(`${a*h} ÷ 2`),a*h/2)]}},
     why:{q:'삼각형의 넓이에서 ÷ 2를 하는 까닭은?',choices:['삼각형은 둘러싼 직사각형의 절반이라서','삼각형은 변이 3개라서','2가 짝수라서'],ans:0,ok:'둘러싼 직사각형을 두 부분씩 나눠 보면 삼각형이 꼭 절반이에요.'}},
   {t:'사다리꼴은 두 개 붙이면 평행사변형',idea:'똑같은 사다리꼴 두 개를 거꾸로 붙이면 밑변이 (윗변 + 아랫변)인 평행사변형이 돼요. 그 <b>절반</b>이에요.',
     ex(r){let a=ri(r,2,6),b=ri(r,a+1,10),h=ri(r,2,6);if(((a+b)*h)%2)h++;return{q:`윗변 ${M_(a+' cm')}, 아랫변 ${M_(b+' cm')}, 높이 ${M_(h+' cm')}인 사다리꼴의 넓이`,ans:(a+b)*h/2,suffix:'cm²',steps:[S_('붙인 평행사변형의 밑변',M_(`${a} + ${b}`),a+b),S_('평행사변형의 넓이',M_(`${a+b} × ${h}`),(a+b)*h),S_('그 절반',M_(`${(a+b)*h} ÷ 2`),(a+b)*h/2)]}},
     why:{q:'똑같은 사다리꼴 두 개를 거꾸로 붙이면 어떤 도형이 될까요?',choices:['평행사변형','삼각형','원'],ans:0,ok:'밑변이 (윗변 + 아랫변)인 평행사변형이에요. 그 절반이 사다리꼴이에요.'}}],
  gen(L,r){if(L===1){if(r()<0.5){const a=ri(r,3,9),b=ri(r,2,9);return{q:`가로 ${M_(a+' cm')}, 세로 ${M_(b+' cm')}인<br>직사각형의 넓이`,ans:a*b,suffix:'cm²',steps:[S_('가로 × 세로',M_(`${a} × ${b}`),a*b)],errs:[E_(a+b,'더했어요. 넓이는 가로 × 세로예요.'),E_(2*(a+b),'둘레를 구했어요. 넓이는 칸의 수, 가로 × 세로예요.')]}}
     const a=ri(r,2,9);return{q:`한 변이 ${M_(a+' cm')}인<br>정사각형의 넓이`,ans:a*a,suffix:'cm²',steps:[S_('한 변 × 한 변',M_(`${a} × ${a}`),a*a)],errs:[E_(4*a,'둘레를 구했어요. 넓이는 한 변 × 한 변이에요.'),E_(2*a,'한 변 × 2가 아니라 한 변 × 한 변이에요.')]}}
   if(L===2){if(r()<0.6){let a=ri(r,3,12),b=ri(r,2,9);if((a*b)%2)a++;return{q:`밑변 ${M_(a+' cm')}, 높이 ${M_(b+' cm')}인<br>삼각형의 넓이`,ans:a*b/2,suffix:'cm²',steps:[S_('둘러싼 직사각형',M_(`${a} × ${b}`),a*b),S_('그 절반',M_(`${a*b} ÷ 2`),a*b/2)],errs:[E_(a*b,'÷ 2를 빠뜨렸어요. 삼각형은 직사각형의 절반이에요.')]}}
     const a=ri(r,3,12),b=ri(r,2,9),errs=[E_(a+b,'더했어요. 밑변 × 높이예요.')];if((a*b)%2===0)errs.push(E_(a*b/2,'평행사변형은 ÷ 2를 하지 않아요. 삼각형만 절반이에요.'));
     return{q:`밑변 ${M_(a+' cm')}, 높이 ${M_(b+' cm')}인<br>평행사변형의 넓이`,ans:a*b,suffix:'cm²',steps:[S_('밑변 × 높이',M_(`${a} × ${b}`),a*b)],errs}}
   let a=ri(r,2,8),b=ri(r,a+1,12),h=ri(r,2,8);if(((a+b)*h)%2)h++;return{q:`윗변 ${M_(a+' cm')}, 아랫변 ${M_(b+' cm')}, 높이 ${M_(h+' cm')}인<br>사다리꼴의 넓이`,ans:(a+b)*h/2,suffix:'cm²',steps:[S_('윗변 + 아랫변',M_(`${a} + ${b}`),a+b),S_('× 높이',M_(`${a+b} × ${h}`),(a+b)*h),S_('절반',M_(`${(a+b)*h} ÷ 2`),(a+b)*h/2)],
     errs:[E_((a+b)*h,'÷ 2를 빠뜨렸어요. 사다리꼴 두 개가 평행사변형이니까 절반이에요.'),E_(a*b*h/2,'윗변과 아랫변을 곱했어요. 더해야 해요.')]}}},
 {id:'pi',grp:'solid',nm:'π가 있는 계산',use:'원과 부채꼴(호·넓이), 원기둥·원뿔·구',lv:['1단계 · π끼리 더하고 빼기','2단계 · 원의 둘레 (식 보고)','3단계 · 그림 보고 원의 둘레','4단계 · 원의 넓이 (식 보고)','5단계 · 그림 보고 원의 넓이'],
  ways:[{t:'π는 단위처럼',idea:`${M_('12π + 8π')}는 "사과 12개 + 사과 8개"처럼 생각해요. <b>π 앞의 수끼리</b> 계산하고 π는 그대로 붙여요.`,
     ex(r){const a=ri(r,3,15),b=ri(r,2,9);return{q:M_(`${a}π + ${b}π`),ans:a+b,type:'pi',steps:[S_('π 앞의 수끼리 더해요',M_(`${a} + ${b}`),a+b),S_('π를 붙여서 답해요 (π 단추)',M_(`${a+b} × π`),a+b,'pi')]}},
     why:{q:`${M_('12π + 8π')}를 사과로 바꿔 말하면?`,choices:['사과 12개 + 사과 8개','사과 12개 × 사과 8개','사과 20개 × 2'],ans:0,ok:'π를 하나의 물건처럼 세면 20π예요.'}},
   {t:'제곱 먼저, π는 마지막에',idea:`${M_('π × 3²')}는 <b>3² = 9를 먼저</b> 하고 π를 붙여 ${M_('9π')}. ${M_('3 × 2 = 6')}으로 하면 틀려요.`,
     ex(r){const a=ri(r,2,7);return{q:`반지름 ${M_(a+' cm')}인 원의 넓이 ${M_(`π × ${a}²`)}`,ans:a*a,type:'pi',suffix:'cm²',steps:[S_('제곱 먼저',M_(`${a} × ${a}`),a*a),S_('π를 붙여요',M_(`${a*a} × π`),a*a,'pi')]}},
     why:{q:`${M_('π × 3²')}에서 먼저 할 것은?`,choices:['3² = 9','π × 3','3 × 2'],ans:0,ok:'제곱 먼저 하고 π는 마지막에 붙여요.'}}],
  gen(L,r){if(L===1){const k=ri(r,0,2);if(k===0){const a=ri(r,2,15),b=ri(r,2,10);return{q:M_(`${a}π + ${b}π`),ans:a+b,type:'pi',steps:[S_('수끼리 더해요',M_(`${a} + ${b}`),a+b),S_('π를 붙여요',M_(`${a+b} × π`),a+b,'pi')],errs:[E_(a*b,'곱했어요. π 앞의 수끼리 더해요.',true)]}}
     if(k===1){const a=ri(r,10,20),b=ri(r,2,9);return{q:M_(`${a}π − ${b}π`),ans:a-b,type:'pi',steps:[S_('수끼리 빼요',M_(`${a} − ${b}`),a-b),S_('π를 붙여요',M_(`${a-b} × π`),a-b,'pi')],errs:[E_(a+b,'더했어요. 빼기예요.',true)]}}
     const a=ri(r,2,5),b=ri(r,2,9);return{q:M_(`${a} × ${b}π`),ans:a*b,type:'pi',steps:[S_('수끼리 곱해요',M_(`${a} × ${b}`),a*b),S_('π를 붙여요',M_(`${a*b} × π`),a*b,'pi')],errs:[E_(a+b,'더했어요. 곱해요.',true)]}}
   if(L===2)return piCirc(r,false);
   if(L===3)return piCirc(r,true);
   if(L===4)return piArea(r,false);
   return piArea(r,true)}},
 {id:'frac',grp:'solid',nm:'분수 곱하기',use:'부채꼴(중심각/360°), 뿔의 부피 ⅓, 구의 부피 4/3',lv:['1단계 · ½ ×, ⅓ ×','2단계 · 셋을 곱할 때','3단계 · 뿔과 구의 부피'],
  ways:[{t:'⅓ ×는 ÷ 3',idea:`${M_('⅓ × 12')}는 12를 <b>셋으로 똑같이 나눈 하나</b>예요. 그래서 ${M_('12 ÷ 3')}.`,
     ex(r){const a=ri(r,2,9)*3;return{q:M_(`⅓ × ${a}`),fig:svgGroups(a,3,1),ans:a/3,steps:[S_('3으로 나눠요',M_(`${a} ÷ 3`),a/3)]}},
     why:{q:`${M_('⅓ × 12')}가 36이 아닌 까닭은?`,choices:['⅓은 셋으로 나눈 것 중 하나라서','12가 짝수라서','⅓은 3과 같아서'],ans:0,ok:'⅓ × 12 = 12 ÷ 3 = 4예요.'}},
   {t:'나누어떨어지는 수부터',idea:`${M_('⅓ × 5 × 9')}는 곱하는 순서를 바꿔도 돼요. <b>9를 먼저 3으로</b> 나누면 쉬워요.`,
     ex(r){const a=pick(r,[2,4,5,7,8]),b=ri(r,2,5)*3;return{q:M_(`⅓ × ${a} × ${b}`),ans:a*b/3,steps:[S_('3으로 나누어떨어지는 수는?','',b),S_('그 수를 3으로 나눠요',M_(`${b} ÷ 3`),b/3),S_('남은 수와 곱해요',M_(`${a} × ${b/3}`),a*b/3)]}},
     why:{q:`${M_('⅓ × 5 × 9')}에서 9를 먼저 3으로 나누는 까닭은?`,choices:['나누어떨어져서 계산이 쉬워서','9가 가장 커서','5는 곱할 수 없어서'],ans:0,ok:'곱셈은 순서를 바꿔도 되니까 쉬운 것부터 해요.'}}],
  gen(L,r){if(L===1){if(r()<0.5){const a=ri(r,2,12)*2;return{q:M_(`½ × ${a}`),ans:a/2,steps:[S_('2로 나눠요',M_(`${a} ÷ 2`),a/2)],errs:[E_(2*a,'2를 곱했어요. ½ ×는 2로 나누기예요.')]}}
     const a=ri(r,2,9)*3;return{q:M_(`⅓ × ${a}`),ans:a/3,steps:[S_('3으로 나눠요',M_(`${a} ÷ 3`),a/3)],errs:[E_(3*a,'3을 곱했어요. ⅓ ×는 3으로 나누기예요.'),E_(a-3,'3을 뺐어요. 3으로 나눠요.')]}}
   if(L===2){if(r()<0.4){const a=ri(r,2,9),b=ri(r,2,6)*2;return{q:M_(`½ × ${a} × ${b}`),ans:a*b/2,steps:[S_('짝수를 2로 나눠요',M_(`${b} ÷ 2`),b/2),S_('남은 수와 곱해요',M_(`${a} × ${b/2}`),a*b/2)],errs:[E_(a*b,'½을 빠뜨렸어요. 2로 나눠요.')]}}
     const a=pick(r,[2,4,5,7,8]),b=ri(r,1,4)*3;const[x,y]=r()<0.5?[a,b]:[b,a];return{q:M_(`⅓ × ${x} × ${y}`),ans:a*b/3,steps:[S_('3으로 나누어떨어지는 수를 3으로',M_(`${b} ÷ 3`),b/3),S_('남은 수와 곱해요',M_(`${a} × ${b/3}`),a*b/3)],errs:[E_(a*b,'⅓을 빠뜨렸어요. 3으로 나눠요.')]}}
   if(r()<0.6){const a=ri(r,2,5),b=ri(r,2,5),h=ri(r,1,3)*3;return{q:`각뿔의 부피<br>${M_(`⅓ × ${a} × ${b} × ${h}`)}`,ans:a*b*h/3,suffix:'cm³',steps:[S_('3으로 나누어떨어지는 수를 3으로',M_(`${h} ÷ 3`),h/3),S_('나머지를 곱해요',M_(`${a} × ${b} × ${h/3}`),a*b*h/3)],errs:[E_(a*b*h,'⅓을 빠뜨렸어요. 뿔은 기둥의 ⅓이에요.')]}}
    const rr=pick(r,[3,6]),cu=rr**3,dv=cu/3,ans=dv*4;return{q:`구의 부피<br>${M_(`<span class="fr"><sup>4</sup>⁄<sub>3</sub></span> × π × ${rr}³`)}`,ans,type:'pi',suffix:'cm³',steps:[S_('세제곱 먼저',M_(`${rr} × ${rr} × ${rr}`),cu),S_('3으로 나눠요',M_(`${cu} ÷ 3`),dv),S_('4를 곱해요',M_(`${dv} × 4`),ans),S_('π를 붙여요',M_(`${ans} × π`),ans,'pi')],errs:[E_(cu,'4/3을 곱하지 않았어요.',true),E_(cu*4,'4를 곱하고 3으로 나누지 않았어요.',true),E_(rr*3*4/3,'세제곱 대신 3을 곱했어요.',true)]}}},
 {id:'surf',grp:'solid',nm:'겉넓이 더하기',use:'기둥의 겉넓이 = 밑넓이 × 2 + 옆넓이',lv:['1단계 · 2 × a + b','2단계 · 2 × (a + b + c)','3단계 · 직육면체의 겉넓이'],
  ways:[{t:'곱하기와 괄호 먼저',idea:`${M_('2 × 6 + 9')}는 곱하기 먼저, ${M_('2 × (3 + 4)')}는 괄호 먼저 해요.`,
     ex(r){const a=ri(r,2,8),b=ri(r,2,8),c=ri(r,2,8);return{q:M_(`2 × (${a} + ${b} + ${c})`),ans:2*(a+b+c),steps:[S_('괄호 안 먼저',M_(`${a} + ${b} + ${c}`),a+b+c),S_('2를 곱해요',M_(`2 × ${a+b+c}`),2*(a+b+c))]}},
     why:{q:`${M_('2 × 6 + 9')}에서 먼저 할 것은?`,choices:['2 × 6','6 + 9','아무거나'],ans:0,ok:'곱셈 먼저, 그다음 더하기예요.'}},
   {t:'직육면체는 같은 면이 2개씩',idea:'마주 보는 면은 똑같아요. <b>서로 다른 세 면</b>의 넓이를 더하고 2배 해요.',
     ex(r){const a=ri(r,2,5),b=ri(r,2,5),c=ri(r,2,5);return{q:`가로 ${M_(a)}, 세로 ${M_(b)}, 높이 ${M_(c)}인 직육면체의 겉넓이`,ans:2*(a*b+b*c+c*a),steps:[S_('윗면 (가로 × 세로)',M_(`${a} × ${b}`),a*b),S_('앞면 (가로 × 높이)',M_(`${a} × ${c}`),a*c),S_('옆면 (세로 × 높이)',M_(`${b} × ${c}`),b*c),S_('세 면을 더해요',M_(`${a*b} + ${a*c} + ${b*c}`),a*b+a*c+b*c),S_('2배 해요',M_(`2 × ${a*b+a*c+b*c}`),2*(a*b+b*c+c*a))]}},
     why:{q:'직육면체의 면 6개는 몇 가지 넓이로 되어 있을까요?',choices:['3가지가 2개씩','6가지 모두 달라요','1가지'],ans:0,ok:'마주 보는 면끼리 똑같아요. 그래서 세 면을 더하고 2배 해요.'}}],
  gen(L,r){if(L===1){const a=ri(r,3,12),b=ri(r,2,12);return{q:M_(`2 × ${a} + ${b}`),ans:2*a+b,steps:[S_('곱하기 먼저',M_(`2 × ${a}`),2*a),S_('그다음 더하기',M_(`${2*a} + ${b}`),2*a+b)],errs:[E_(2*(a+b),'더하기를 먼저 했어요. 곱셈이 먼저예요.')]}}
   if(L===2){const a=ri(r,2,12),b=ri(r,2,12),c=ri(r,2,12);return{q:M_(`2 × (${a} + ${b} + ${c})`),ans:2*(a+b+c),steps:[S_('괄호 안 먼저',M_(`${a} + ${b} + ${c}`),a+b+c),S_('2를 곱해요',M_(`2 × ${a+b+c}`),2*(a+b+c))],errs:[E_(2*a+b+c,'괄호를 먼저 계산하지 않았어요.'),E_(a+b+c,'2를 곱하는 걸 빠뜨렸어요.')]}}
   const a=ri(r,2,5),b=ri(r,2,5),c=ri(r,2,6),S=a*b+b*c+c*a;return{q:`가로 ${M_(a+' cm')}, 세로 ${M_(b+' cm')}, 높이 ${M_(c+' cm')}인<br>직육면체의 겉넓이`,ans:2*S,suffix:'cm²',steps:[S_('가로 × 세로',M_(`${a} × ${b}`),a*b),S_('가로 × 높이',M_(`${a} × ${c}`),a*c),S_('세로 × 높이',M_(`${b} × ${c}`),b*c),S_('더해요',M_(`${a*b} + ${a*c} + ${b*c}`),S),S_('2배',M_(`2 × ${S}`),2*S)],
     errs:[E_(S,'2배를 빠뜨렸어요. 같은 면이 2개씩이에요.'),E_(a*b*c,'부피를 구했어요. 겉넓이는 모든 면의 넓이를 더한 거예요.')]}}},
 {id:'unit',grp:'solid',nm:'단위 바꾸기',use:'m와 cm를 맞추거나 부피를 mL로 바꿀 때',lv:['1단계 · m, cm, mm','2단계 · L, mL, cm³','3단계 · m², cm², 그릇의 부피'],
  ways:[{t:'1 m = 100 cm',idea:'1 m는 100 cm예요. m를 cm로 바꾸면 <b>× 100</b>, cm를 m로 바꾸면 <b>÷ 100</b>이에요.',
     ex(r){const a=ri(r,2,9);return{q:`${M_(a+' m')}는 몇 cm?`,fig:svgMeter(),ans:a*100,suffix:'cm',steps:[S_('1 m = 100 cm니까',M_(`${a} × 100`),a*100)]}},
     why:{q:'3 m를 cm로 바꾸면 수는 어떻게 될까요?',choices:['커져요 (300)','작아져요 (0.03)','그대로예요 (3)'],ans:0,ok:'더 작은 단위로 재면 더 많이 세어야 해서 수가 커져요.'}},
   {t:'넓이 단위는 100을 두 번',idea:`1 m²는 가로 100 cm, 세로 100 cm인 정사각형이라서 ${M_('100 × 100 = 10000 cm²')}예요.`,
     ex(r){const a=ri(r,2,6);return{q:`${M_(a+' m²')}는 몇 cm²?`,fig:svgSqm(),ans:a*10000,suffix:'cm²',steps:[S_('1 m²는 몇 cm²?',M_('100 × 100'),10000),S_(`${a} m²는`,M_(`${a} × 10000`),a*10000)]}},
     why:{q:'1 m² = 100 cm²가 틀린 까닭은?',choices:['가로와 세로가 모두 100 cm라서 100 × 100이에요','m²는 넓이가 아니라서','100은 너무 작은 수라서'],ans:0,ok:'넓이는 가로 × 세로라서 100을 두 번 곱해요.'}},
   {t:'1 L = 1000 mL = 1000 cm³',idea:`한 모서리가 10 cm인 정육면체 그릇에 물을 가득 채우면 1 L예요. ${M_('10 × 10 × 10 = 1000 cm³')}. 그리고 <b>1 mL = 1 cm³</b>예요.`,
     ex(r){const a=ri(r,2,9);return{q:`${M_(a+' L')}는 몇 mL?`,fig:svgLiter(),ans:a*1000,suffix:'mL',steps:[S_('1 L = 1000 mL니까',M_(`${a} × 1000`),a*1000)]}},
     why:{q:'1 cm³와 1 mL를 비교하면?',choices:['같아요','1 mL가 더 커요','1 cm³가 더 커요'],ans:0,ok:'그래서 부피를 cm³로 구하면 그 수 그대로 mL예요.'}}],
  gen(L,r){const a=ri(r,2,9);
   if(L===1){const k=ri(r,0,3);
     if(k===0)return{q:`${M_(a+' m')} = ? cm`,ans:a*100,suffix:'cm',steps:[S_('1 m = 100 cm니까',M_(`${a} × 100`),a*100)],errs:[E_(a*10,'1 m는 10 cm가 아니라 100 cm예요.'),E_(a*1000,'0이 하나 더 붙었어요. 1 m = 100 cm예요.')]};
     if(k===1)return{q:`${M_(a*100+' cm')} = ? m`,ans:a,suffix:'m',steps:[S_('100 cm = 1 m니까',M_(`${a*100} ÷ 100`),a)],errs:[E_(a*10,'0을 하나만 지웠어요. 100으로 나누면 0을 두 개 지워요.'),E_(a*10000,'곱했어요. 큰 단위로 바꾸면 수는 작아져요.')]};
     if(k===2)return{q:`${M_(a+' cm')} = ? mm`,ans:a*10,suffix:'mm',steps:[S_('1 cm = 10 mm니까',M_(`${a} × 10`),a*10)],errs:[E_(a*100,'1 cm = 10 mm예요.')]};
     const m=ri(r,1,4),c=r()<0.5?ri(r,1,9):ri(r,11,95),errs=[E_(m*10+c,'1 m = 100 cm예요.')];if(c<10)errs.push(E_(Number(`${m}${c}`),`${M_(`${m} m ${c} cm`)}는 ${M_(m*100+c+' cm')}예요. cm 자리가 두 자리라서 0을 채워요.`));
     return{q:`${M_(`${m} m ${c} cm`)} = ? cm`,ans:m*100+c,suffix:'cm',steps:[S_(`${m} m는 몇 cm?`,M_(`${m} × 100`),m*100),S_('더해요',M_(`${m*100} + ${c}`),m*100+c)],errs}}
   if(L===2){const k=ri(r,0,3);
     if(k===0)return{q:`${M_(a+' L')} = ? mL`,ans:a*1000,suffix:'mL',steps:[S_('1 L = 1000 mL니까',M_(`${a} × 1000`),a*1000)],errs:[E_(a*100,'1 L = 1000 mL예요. 0이 세 개!')]};
     if(k===1)return{q:`${M_(a*1000+' mL')} = ? L`,ans:a,suffix:'L',steps:[S_('1000 mL = 1 L니까',M_(`${a*1000} ÷ 1000`),a)],errs:[E_(a*10,'1000으로 나누면 0을 세 개 지워요.')]};
     if(k===2){const v=a*100;return{q:`${M_(v+' cm³')} = ? mL`,ans:v,suffix:'mL',steps:[S_('1 cm³ = 1 mL이니까 몇 mL?','',v)],errs:[E_(v*1000,'1 cm³ = 1 mL라서 수가 그대로예요.'),E_(v/1000,'1 cm³ = 1 mL라서 수가 그대로예요.')]}}
     return{q:`${M_(a*1000+' cm³')} = ? L`,ans:a,suffix:'L',steps:[S_('cm³는 mL와 같아요. 1000 mL = 1 L',M_(`${a*1000} ÷ 1000`),a)],errs:[E_(a*1000,'1000 cm³ = 1 L예요. 1000으로 나눠요.')]}}
   const k=ri(r,0,2);
   if(k===0){const m=ri(r,2,5);return{q:`${M_(m+' m²')} = ? cm²`,ans:m*10000,suffix:'cm²',steps:[S_('1 m²는 몇 cm²?',M_('100 × 100'),10000),S_(`${m} m²`,M_(`${m} × 10000`),m*10000)],errs:[E_(m*100,'넓이는 100을 두 번 곱해요. 1 m² = 10000 cm²예요.')]}}
   if(k===1){const m=ri(r,2,5);return{q:`${M_(m*10000+' cm²')} = ? m²`,ans:m,suffix:'m²',steps:[S_('10000 cm² = 1 m²니까',M_(`${m*10000} ÷ 10000`),m)],errs:[E_(m*100,'1 m² = 10000 cm²예요. 10000으로 나눠요.')]}}
   const x=pick(r,[5,10,20]),y=pick(r,[10,20,25]),z=pick(r,[4,5,8,10]),V=x*y*z;
   return{q:`가로 ${M_(x+' cm')}, 세로 ${M_(y+' cm')}, 높이 ${M_(z+' cm')}인 그릇에 물을 가득 채우면 몇 mL?`,ans:V,suffix:'mL',steps:[S_('밑넓이',M_(`${x} × ${y}`),x*y),S_('× 높이 (cm³)',M_(`${x*y} × ${z}`),V),S_('1 cm³ = 1 mL이니까 몇 mL?','',V)],errs:[E_(V/1000,'1 cm³ = 1 mL라서 cm³의 수가 그대로 mL예요.'),E_(x*y,'높이를 곱하지 않았어요. 부피는 밑넓이 × 높이예요.')]}}},
 /* ═══ 중1 핵심 연산 ═══ */
 {id:'fracop',grp:'mid',nm:'분수 더하기·빼기',use:'유리수의 덧셈·뺄셈과 일차방정식',lv:['1단계 · 분모가 같은 분수','2단계 · 통분해서 더하기','3단계 · 통분해서 빼기'],
  ways:[{t:'통분해서 분모 맞추기',idea:`${FR(1,2)} + ${FR(1,4)}는 조각 크기가 달라요. <b>분모를 같게(통분)</b> 만든 뒤 분자끼리 더해요.`,
     ex(r){const[d1,d2]=pick(r,[[2,4],[2,6],[3,6],[4,8]]),m=d2/d1,n1=1,n2=1,nn=n1*m+n2,g=gcd_(nn,d2),p=nn/g,q=d2/g;
       return{q:`${FR(n1,d1)} + ${FR(n2,d2)}`,fig:svgBars(n1*m,d2,n1,d1),ans:p/q,type:'sn',ansText:q===1?String(p):`${p}/${q}`,
         steps:[S_(`분모를 ${d2}로 통분 · ${FR(n1,d1)}의 새 분자`,M_(`${n1} × ${m}`),n1*m),S_('분자끼리 더해요',M_(`${n1*m} + ${n2}`),nn),S_('분수로 답해요 ( / 단추 사용 )','',p/q,'sn')]}},
     why:{q:`${FR(1,2)} + ${FR(1,4)}에서 왜 통분을 할까요?`,choices:['조각 크기를 같게 맞춰야 더할 수 있어서','분모끼리 더하기 위해서','숫자를 크게 만들려고'],ans:0,ok:'조각 크기(분모)가 같아야 몇 조각인지 바로 더할 수 있어요.'}}],
  gen(L,r){
   if(L===1){const d=pick(r,[4,5,6,8,9]);
     if(r()<0.5){const a=ri(r,1,d-2),b=ri(r,1,d-a),s=a+b,g=gcd_(s,d),p=s/g,q=d/g,at=q===1?String(p):`${p}/${q}`;
       return{q:`${FR(a,d)} + ${FR(b,d)}`,ans:p/q,type:'sn',ansText:at,steps:[S_('분모는 그대로, 분자끼리 더해요',M_(`${a} + ${b}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
         errs:[E_((a+b)/(2*d),'분모끼리 더했어요. 분모는 그대로 두고 분자만 더해요.')]}}
     const a=ri(r,2,d-1),b=ri(r,1,a-1),s=a-b,g=gcd_(s,d),p=s/g,q=d/g,at=q===1?String(p):`${p}/${q}`;
     return{q:`${FR(a,d)} − ${FR(b,d)}`,ans:p/q,type:'sn',ansText:at,steps:[S_('분모는 그대로, 분자끼리 빼요',M_(`${a} − ${b}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
       errs:[E_((a+b)/d,'더했어요. 빼기예요.')]}}
   if(L>=2){const[d1,d2]=pick(r,[[2,4],[2,6],[3,6],[2,3],[3,4],[4,6]]),cm=lcm_(d1,d2),m1=cm/d1,m2=cm/d2;
     if(L===2){const n1=ri(r,1,d1-1),n2=ri(r,1,d2-1),s=n1*m1+n2*m2,g=gcd_(s,cm),p=s/g,q=cm/g,at=q===1?String(p):`${p}/${q}`;
       return{q:`${FR(n1,d1)} + ${FR(n2,d2)}`,ans:p/q,type:'sn',ansText:at,
         steps:[S_(`공통분모는? (${J(d1,'과','와')} ${d2}의 최소공배수)`,'',cm),S_(`통분한 분자의 합 (${n1*m1} + ${n2*m2})`,M_(`${n1*m1} + ${n2*m2}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
         errs:[E_((n1+n2)/(d1+d2),'분모끼리, 분자끼리 그냥 더했어요. 통분해서 분모를 맞춰요.')]}}
     let n1=ri(r,1,d1-1),n2=ri(r,1,d2-1);if(n1*m1<=n2*m2){[n1,n2]=[n2,n1];const t=d1;return{q:`${FR(n1,d2)} − ${FR(n2,t)}`,ans:(n1*m2-n2*m1)/cm,type:'sn',ansText:(()=>{const s=n1*m2-n2*m1,g=gcd_(s,cm),p=s/g,q=cm/g;return q===1?String(p):`${p}/${q}`})(),
       steps:[S_('공통분모는?','',cm),S_('통분한 분자의 차',M_(`${n1*m2} − ${n2*m1}`),n1*m2-n2*m1),S_('분수로 답해요 ( / 단추 )','',(n1*m2-n2*m1)/cm,'sn')],errs:[E_((n1*m2+n2*m1)/cm,'더했어요. 빼기예요.')]}}
     const s=n1*m1-n2*m2,g=gcd_(s,cm),p=s/g,q=cm/g,at=q===1?String(p):`${p}/${q}`;
     return{q:`${FR(n1,d1)} − ${FR(n2,d2)}`,ans:p/q,type:'sn',ansText:at,steps:[S_('공통분모는?','',cm),S_('통분한 분자의 차',M_(`${n1*m1} − ${n2*m2}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
       errs:[E_((n1*m1+n2*m2)/cm,'더했어요. 빼기예요.')]}}}},
 {id:'fracdiv',grp:'mid',nm:'분수 나누기',use:'유리수의 나눗셈, 반비례 y = a/x, 일차식 ÷ 분수',lv:['1단계 · 역수 찾기','2단계 · 분수 ÷ 자연수','3단계 · 분수 ÷ 분수'],
  ways:[{t:'분수 나누기는 뒤집어 곱하기',idea:`${FR(1,2)} ÷ ${FR(1,4)}는 ÷ 뒤의 분수를 <b>뒤집어서(역수) 곱해요</b>. ${FR(1,2)} × ${FR(4,1)} = 2.`,
     ex(r){const a=ri(r,1,3),b=pick(r,[2,3,4]),c=pick(r,[1,2]),d=b*ri(r,1,2),num=a*d,den=b*c,g=gcd_(num,den),p=num/g,q=den/g;
       return{q:`${FR(a,b)} ÷ ${FR(c,d)}`,ans:p/q,type:'sn',ansText:q===1?String(p):`${p}/${q}`,
         steps:[S_(`뒤 분수 ${FR(c,d)}를 뒤집으면 분자는?`,'',d),S_('분자끼리 곱해요',M_(`${a} × ${d}`),num),S_('분모끼리 곱해요',M_(`${b} × ${c}`),den),S_('약분한 답은?','',p/q,'sn')]}},
     why:{q:`${FR(2,3)} ÷ ${FR(4,5)}를 곱셈으로 바꾸면?`,choices:[`${2}/${3} × ${5}/${4}`,`${3}/${2} × ${4}/${5}`,`${2}/${3} × ${4}/${5}`],ans:0,ok:'나누는 수(뒤의 분수)만 위아래를 뒤집어 곱해요.'}},
   {t:'자연수로 나누면 분모가 커져요',idea:`${FR(2,3)} ÷ 4는 ${FR(2,3)}을 <b>4조각으로 더 나누는</b> 거예요. 분모에 4를 곱해 ${FR(2,12)} = ${FR(1,6)}.`,
     ex(r){const a=ri(r,1,3),b=pick(r,[3,4,5]),c=ri(r,2,4),g=gcd_(a,b*c),p=a/g,q=b*c/g;return{q:`${FR(a,b)} ${M_('÷ '+c)}`,fig:svgBars(a,b,a,b),ans:p/q,type:'sn',ansText:q===1?String(p):`${p}/${q}`,
       steps:[S_(`÷ ${c}는 분모에 ${J(c,'을','를')} 곱해요 · 새 분모`,M_(`${b} × ${c}`),b*c),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')]}},
     why:{q:`${FR(1,2)} ÷ 3은 ${FR(1,2)}보다 클까요, 작을까요?`,choices:['작아요 (더 잘게 나눠서)','커요','같아요'],ans:0,ok:'나누면 한 조각이 더 작아져요. 1/2 ÷ 3 = 1/6이에요.'}}],
  gen(L,r){
   if(L===1){if(r()<0.25){const n=ri(r,2,9),ok=`1/${n}`,ch=shuffle(r,[ok,String(n),`${n}/${n}`,`−${n}`]);return{q:`${M_(n)}의 역수는?`,type:'choice',choices:ch,mathChoices:true,ans:ok,errc:{[String(n)]:'그대로예요. 자연수는 분모가 1인 분수예요. 위아래를 바꿔요.',[`${n}/${n}`]:`${n}/${n}은 1이에요. ${n}/1의 위아래를 바꿔요.`,[`−${n}`]:'역수는 부호를 바꾸는 게 아니라 위아래를 바꾸는 거예요.'},steps:[S_(`${n} = ${n}/1 · 위아래를 바꾸면`,'',ok,'choice',ch)]}}
     let a=ri(r,1,8),b=ri(r,2,9);while(a===b||gcd_(a,b)>1){a=ri(r,1,8);b=ri(r,2,9)}const ok=a===1?String(b):`${b}/${a}`,ch=shuffle(r,[ok,`${a}/${b}`,`−${a}/${b}`,`1/${a*b}`].filter((x,k,A)=>A.indexOf(x)===k));
     return{q:`${FR(a,b)}의 역수는?`,type:'choice',choices:ch,mathChoices:true,ans:ok,errc:{[`${a}/${b}`]:'그대로예요. 분자와 분모의 자리를 바꿔요.',[`−${a}/${b}`]:'역수는 부호를 바꾸는 게 아니라 위아래를 바꾸는 거예요.',[`1/${a*b}`]:'분자와 분모를 곱하지 않아요. 자리만 바꿔요.'},steps:[S_('분자와 분모의 자리를 바꾸면','',ok,'choice',ch)]}}
   if(L===2){let a=ri(r,1,5),b=ri(r,2,7);while(a>=b||gcd_(a,b)>1){a=ri(r,1,5);b=ri(r,2,7)}const c=ri(r,2,5),g=gcd_(a,b*c),p=a/g,q=b*c/g,at=q===1?String(p):`${p}/${q}`;
     return{q:`${FR(a,b)} ${M_('÷ '+c)}`,ans:p/q,type:'sn',ansText:at,steps:[S_(`${M_('÷ '+c)}${J(c,'은','는').slice(String(c).length)} ${M_('×')} ${FR(1,c)} · 분모끼리 곱하면`,M_(`${b} × ${c}`),b*c),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
       errs:[E_(a*c/b,'곱했어요. 자연수로 나누면 분모에 곱해요.'),E_(a/(b+c),'분모에 더했어요. 분모에 곱해요.')]}}
   let a,b,c,d;do{a=ri(r,1,4);b=pick(r,[2,3,4,5]);c=ri(r,1,3);d=pick(r,[2,3,4,5])}while(gcd_(a,b)>1||gcd_(c,d)>1||(a===c&&b===d));const num=a*d,den=b*c,g=gcd_(num,den),p=num/g,q=den/g,at=q===1?String(p):`${p}/${q}`;
   return{q:`${FR(a,b)} ÷ ${FR(c,d)}`,ans:p/q,type:'sn',ansText:at,
     steps:[S_('뒤 분수를 뒤집어 분자끼리 곱해요',M_(`${a} × ${d}`),num),S_('분모끼리 곱해요',M_(`${b} × ${c}`),den),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
     errs:[E_((a*c)/(b*d),'뒤 분수를 뒤집지 않고 그대로 곱했어요. 나누기는 역수를 곱해요.'),E_((b*c)/(a*d),'앞 분수를 뒤집었어요. ÷ 뒤의 분수만 뒤집어요.')]}}},
 {id:'fdconv',grp:'mid',nm:'분수와 소수 바꾸기',use:'유리수의 크기 비교, 상대도수, 계수가 소수인 방정식',lv:['1단계 · 분모가 10, 100인 분수','2단계 · 분모를 10, 100으로 바꾸기','3단계 · 소수를 분수로'],
  ways:[{t:'분모를 10이나 100으로',idea:`${FR(3,5)}는 분모·분자에 2를 곱해 ${FR(6,10)}, 그래서 <b>0.6</b>이에요. 분모를 10이나 100으로 만들면 소수가 바로 보여요.`,
     ex(r){const[d,m]=pick(r,[[2,5],[5,2],[4,25],[20,5],[25,4]]);let n=ri(r,1,d-1);while(gcd_(n,d)>1)n=ri(r,1,d-1);const T=d*m,ans=r3_(n/d);return{q:`${FR(n,d)}${J(n,'을','를').slice(String(n).length)} 소수로`,ans,
       steps:[S_(`분모를 ${josaRo(String(T))} · 분자에도 ${J(m,'을','를')} 곱하면`,M_(`${n} × ${m}`),n*m),S_(`${FR(n*m,T)}${J(n*m,'을','를').slice(String(n*m).length)} 소수로 쓰면`,'',ans)]}},
     why:{q:`${FR(7,10)}을 소수로 쓰면?`,choices:['0.7','7.10','0.07'],ans:0,ok:'10분의 7은 0.1이 7개라서 0.7이에요.'}}],
  gen(L,r){
   if(L===1){const T=r()<0.5?10:100;let n=ri(r,1,T-1);if(T===100)while(n%10===0)n=ri(r,1,99);const ans=r3_(n/T);
     return{q:`${FR(n,T)}${J(n,'을','를').slice(String(n).length)} 소수로 나타내면?`,ans,steps:[S_(`${T===10?'0.1':'0.01'}이 몇 개?`,'',n),S_('소수로 쓰면','',ans)],
       errs:T===10?[E_(r3_(n/100),'10분의 몇은 소수 첫째 자리까지예요.'),E_(n,'소수점을 빠뜨렸어요.')]:[E_(r3_(n/10),'100분의 몇은 소수 둘째 자리까지 써요. 0.01이 몇 개예요.'),E_(n,'소수점을 빠뜨렸어요.')]}}
   if(L===2){const[d,m]=pick(r,[[2,5],[5,2],[4,25],[20,5],[25,4],[50,2]]);let n=ri(r,1,d-1);while(gcd_(n,d)>1)n=ri(r,1,d-1);const T=d*m,ans=r3_(n/d);
     return{q:`${FR(n,d)}${J(n,'을','를').slice(String(n).length)} 소수로 나타내면?`,ans,steps:[S_(`분모 ${d}에 무엇을 곱하면 ${T}?`,'',m),S_('분자에도 똑같이 곱해요',M_(`${n} × ${m}`),n*m),S_('소수로 쓰면','',ans)],
       errs:[E_(r3_(n/10),'분자를 그대로 소수로 썼어요. 분모를 10이나 100으로 먼저 바꿔요.'),E_(n*m,'소수점을 빠뜨렸어요.')]}}
   const T=r()<0.5?10:100,N=T===10?pick(r,[2,4,5,6,8]):pick(r,[4,5,8,12,15,25,35,45,48,75]),g=gcd_(N,T),ok=`${N/g}/${T/g}`,x=r3_(N/T);
   const ch=shuffle(r,[ok,`${N}/${T}`,`${N}/${T*10}`,`${T/g}/${N/g}`].filter((v,k,A)=>A.indexOf(v)===k));
   return{q:`${M_(x)}${J(x,'을','를').slice(String(x).length)} 기약분수로 나타내면?`,type:'choice',choices:ch,mathChoices:true,ans:ok,
     errc:{[`${N}/${T}`]:'크기는 맞아요! 그런데 더 약분할 수 있어요. 최대공약수로 나눠 봐요.',[`${N}/${T*10}`]:`자리를 하나 더 옮겼어요. ${J(x,'은','는')} ${T===10?'0.1':'0.01'}이 ${N}개예요.`,[`${T/g}/${N/g}`]:'분자와 분모가 바뀌었어요.'},
     steps:[S_(`${M_(x)}${J(x,'은','는').slice(String(x).length)} ${T===10?'0.1':'0.01'}이 몇 개?`,'',N),S_(`${FR(N,T)}의 분자와 분모의 최대공약수`,'',g),S_('약분하면','',ok,'choice',ch)]}}},
 {id:'dec',grp:'mid',nm:'소수 계산',use:'유리수 덧셈·뺄셈과 방정식의 소수 계수',lv:['1단계 · × 10, × 100, ÷ 10','2단계 · 소수 더하고 빼기','3단계 · 소수 × 자연수'],
  ways:[{t:'× 10은 소수점을 오른쪽으로',idea:`${M_('2.4 × 10')}은 소수점이 <b>오른쪽으로 한 칸</b> 움직여 ${M_('24')}. ÷ 10은 <b>왼쪽으로 한 칸</b>이에요.`,
     ex(r){const a=ri(r,12,89)/10;return{q:M_(`${a} × 10`),ans:r3_(a*10),steps:[S_('소수점을 오른쪽으로 한 칸 옮겨요',M_(`${a} × 10`),r3_(a*10))]}},
     why:{q:`${M_('3.5 × 10')}에서 소수점은 어느 쪽으로 갈까요?`,choices:['오른쪽으로 한 칸 (35)','왼쪽으로 한 칸 (0.35)','움직이지 않아요'],ans:0,ok:'10을 곱하면 수가 10배 커지므로 소수점이 오른쪽으로 한 칸 가요.'}},
   {t:'소수점 자리 맞추어 더하기·빼기',idea:`${M_('2.4 + 0.35')}는 ${M_('2.40 + 0.35')}처럼 <b>소수점 자리를 맞춘 뒤</b> 계산해요.`,
     ex(r){const a=ri(r,12,48)/10,b=ri(r,11,45)/100,s=r3_(a+b);return{q:M_(`${a} + ${b}`),ans:s,steps:[S_(`${a}을 소수 둘째 자리까지 쓰면 ${a.toFixed(2)} · 100배한 합`,M_(`${Math.round(a*100)} + ${Math.round(b*100)}`),Math.round(s*100)),S_('소수점을 제자리에 찍어요','',s)]}},
     why:{q:`${M_('1.5 + 0.23')}을 ${M_('0.38')}로 쓰면 틀리는 까닭은?`,choices:['소수점 자리를 맞추지 않고 끝자리를 맞췄어요','1.5가 더 커서','소수는 더할 수 없어서'],ans:0,ok:'1.5는 1.50이에요. 소수점끼리 세로로 나란히 맞춰야 해요.'}},
   {t:'자연수처럼 곱하고 소수점 찍기',idea:`${M_('0.4 × 6')}은 먼저 ${M_('4 × 6 = 24')}를 하고, 소수 첫째 자리니까 <b>한 칸</b> 찍어 ${M_('2.4')}예요.`,
     ex(r){const a=ri(r,2,9),b=ri(r,2,8),s=r3_(a*b/10);return{q:M_(`${(a/10).toFixed(1)} × ${b}`),ans:s,steps:[S_('자연수처럼 곱해요',M_(`${a} × ${b}`),a*b),S_('소수점 한 칸 찍어요','',s)]}},
     why:{q:`${M_('0.3 × 4')}의 답은?`,choices:['1.2','12','0.12'],ans:0,ok:'3 × 4 = 12에서 소수점 한 칸을 옮기면 1.2예요.'}}],
  gen(L,r){
   if(L===1){const k=ri(r,0,2);
     if(k===0){const a=r3_(ri(r,11,95)/10);return{q:M_(`${a} × 10`),ans:r3_(a*10),steps:[S_('소수점을 오른쪽으로 한 칸',M_(`${a} × 10`),r3_(a*10))],errs:[E_(r3_(a/10),'왼쪽으로 옮겼어요. × 10은 수가 커지니 오른쪽으로 한 칸이에요.'),E_(r3_(a*100),'두 칸 옮겼어요. × 10은 한 칸이에요.')]}}
     if(k===1){const a=r3_(ri(r,12,95)/100);return{q:M_(`${a} × 100`),ans:r3_(a*100),steps:[S_('소수점을 오른쪽으로 두 칸',M_(`${a} × 100`),r3_(a*100))],errs:[E_(r3_(a*10),'한 칸만 옮겼어요. × 100은 두 칸이에요.')]}}
     const a=ri(r,12,95);return{q:M_(`${a} ÷ 10`),ans:r3_(a/10),steps:[S_('소수점을 왼쪽으로 한 칸',M_(`${a} ÷ 10`),r3_(a/10))],errs:[E_(a*10,'곱했어요. ÷ 10은 수가 작아지니 왼쪽으로 한 칸이에요.')]}}
   if(L===2){if(r()<0.5){const a=r3_(ri(r,11,59)/10),b=r3_(ri(r,11,89)/100),ans=r3_(a+b);
       return{q:M_(`${a} + ${b}`),ans,steps:[S_('소수점 자리를 맞춰 100배로 생각해요',M_(`${Math.round(a*100)} + ${Math.round(b*100)}`),Math.round(ans*100)),S_('소수점을 제자리에 찍어요','',ans)],
         errs:[E_(r3_((Math.round(a*10)+Math.round(b*100))/100),'소수점 자리를 맞추지 않았어요. 소수 첫째 자리 뒤에 0을 붙여 맞춰요.')]}}
     const a=r3_(ri(r,21,85)/10),b=r3_(ri(r,5,Math.min(19,Math.round(a*10)-1))/10),ans=r3_(a-b);
     return{q:M_(`${a} − ${b}`),ans,steps:[S_('10배한 자연수로 빼요',M_(`${Math.round(a*10)} − ${Math.round(b*10)}`),Math.round(ans*10)),S_('소수점 한 칸 찍어요','',ans)],
       errs:[E_(r3_(a+b),'더했어요. 빼기예요.'),E_(Math.round(ans*10),'소수점을 빠뜨렸어요.')]}}
   const a=ri(r,2,9),b=ri(r,2,9),ans=r3_(a*b/10);
   return{q:M_(`${(a/10).toFixed(1)} × ${b}`),ans,steps:[S_('자연수처럼 곱해요',M_(`${a} × ${b}`),a*b),S_('소수점 한 칸 찍어요','',ans)],
     errs:[E_(a*b,'소수점을 찍는 걸 빠뜨렸어요.'),E_(r3_(a*b/100),'소수점을 두 칸 찍었어요. 한 칸만 옮겨요.')]}}},
 {id:'gcd',grp:'mid',nm:'약수·배수 기초',use:'약분·통분과 소인수분해',lv:['1단계 · 약수 찾기','2단계 · 최대공약수','3단계 · 최소공배수'],
  ways:[{t:'약수는 나누어떨어지는 수',idea:`12의 약수는 12를 <b>나머지 없이 나누는 수</b>예요. ${M_('1, 2, 3, 4, 6, 12')}.`,
     ex(r){const n=pick(r,[12,16,18,20,24]),ok=pick(r,[2,3,4,6].filter(x=>n%x===0));const bad=[5,7,9,11].filter(x=>n%x!==0).slice(0,2);const ch=shuffle(r,[String(ok),...bad.map(String)]);
       return{q:`다음 중 ${M_(n)}의 약수는?`,type:'choice',choices:ch,mathChoices:true,ans:String(ok),steps:[S_(`${n}을 나누어떨어지게 하는 수는?`,'',String(ok),'choice',ch)]}},
     why:{q:'4가 12의 약수인 까닭은?',choices:['12 ÷ 4가 나누어떨어져서','4가 12보다 작아서','4가 짝수라서'],ans:0,ok:'12 ÷ 4 = 3으로 나머지가 0이라서 약수예요.'}},
   {t:'최대공약수와 최소공배수',idea:`12와 18을 <b>둘 다 나누는 가장 큰 수</b>는 6(최대공약수), <b>둘의 공통 배수 중 가장 작은 수</b>는 36(최소공배수)이에요.`,
     ex(r){const g=pick(r,[3,4,6]),a=g*2,b=g*3;return{q:`${M_(a)}${J(a,'과','와').slice(String(a).length)} ${M_(b)}의 최대공약수`,ans:g,steps:[S_(`${J(a,'과','와')} ${J(b,'을','를')} 둘 다 나누는 가장 큰 수는?`,'',g)]}},
     why:{q:'분수를 한 번에 약분할 때 쓰면 좋은 것은?',choices:['최대공약수','최소공배수','두 수의 합'],ans:0,ok:'분자와 분모의 최대공약수로 나누면 한 번에 기약분수가 돼요.'}}],
  gen(L,r){
   if(L===1){const n=pick(r,[12,15,16,18,20,24,28,30]),divs=[];for(let i=2;i<n;i++)if(n%i===0)divs.push(i);
     const ok=pick(r,divs),bads=[3,4,5,6,7,8,9,11].filter(x=>n%x!==0);const ch=shuffle(r,[String(ok),...shuffle(r,bads).slice(0,3).map(String)]);
     return{q:`다음 중 ${M_(n)}의 약수는?`,type:'choice',choices:ch,mathChoices:true,ans:String(ok),
       steps:[S_(`${n}을 나머지 없이 나누는 수를 골라요`,'',String(ok),'choice',ch)]}}
   if(L===2){const g=pick(r,[2,3,4,5,6,8]),[p,q]=pick(r,[[2,3],[3,4],[3,5],[2,5],[4,5]]),a=g*p,b=g*q;
     return{q:`${M_(a)}${J(a,'과','와').slice(String(a).length)} ${M_(b)}의 최대공약수`,ans:g,steps:[S_(`${J(a,'과','와')} ${J(b,'을','를')} 둘 다 나누는 가장 큰 수`,'',g)],
       errs:[E_(lcm_(a,b),'최소공배수를 구했어요. 최대공약수는 둘 다 나누는 가장 큰 수예요.'),E_(1,'1보다 큰 공통 약수가 있어요.')]}}
   const g=pick(r,[2,3,4,5,6]),[p,q]=pick(r,[[2,3],[3,4],[2,5],[3,5]]),a=g*p,b=g*q,lm=lcm_(a,b);
   return{q:`${M_(a)}${J(a,'과','와').slice(String(a).length)} ${M_(b)}의 최소공배수`,ans:lm,steps:[S_('먼저 최대공약수를 찾아요','',g),S_('최소공배수',M_(`${g} × ${p} × ${q}`),lm)],
     errs:[E_(g,'최대공약수를 구했어요. 최소공배수는 공통 배수 중 가장 작은 수예요.'),E_(a*b,'두 수를 그냥 곱했어요. 최대공약수로 한 번 나눠야 최소공배수가 돼요.')]}}},
 {id:'ratio',grp:'mid',nm:'비 간단히 하기',use:'비례식, 중심각·호·넓이의 비, 정비례',lv:['1단계 · 자연수의 비','2단계 · 소수의 비','3단계 · 분수의 비'],
  ways:[{t:'앞과 뒤를 같은 수로 나누기',idea:`비의 앞과 뒤를 <b>같은 수로 나누어도</b> 비는 같아요. ${M_('12 : 18')}은 둘 다 6으로 나누면 ${M_('2 : 3')}이에요.`,
     ex(r){const[a,b]=ratioPair(r),g=ratioG(a,b);return{q:M_(`${a} : ${b}`)+'을 가장 간단한 자연수의 비로',ans:`${a/g} : ${b/g}`,type:'choice',choices:[`${a/g} : ${b/g}`],steps:[S_('두 수의 최대공약수',M_(`${J(a,'과','와')} ${b}`),g),S_('앞',M_(`${a} ÷ ${g}`),a/g),S_('뒤',M_(`${b} ÷ ${g}`),b/g)]}},
     why:{q:`${M_('12 : 18')}과 ${M_('2 : 3')}은 같은 비일까요?`,choices:['네, 둘 다 6으로 나눴을 뿐이에요','아니요, 수가 작아졌어요','앞만 같아요'],ans:0,ok:'앞과 뒤를 같은 수로 나누면 비는 그대로예요.'}},
   {t:'소수·분수는 먼저 자연수로',idea:`소수는 <b>× 10</b>, 분수는 <b>분모의 최소공배수</b>를 앞과 뒤에 똑같이 곱해 자연수로 만든 다음 나눠요. 예) ${FR(1,2)} : ${FR(1,3)} → × 6 → ${M_('3 : 2')}`,
     ex(r){const d1=2,d2=3;return{q:`${FR(1,d1)} : ${FR(1,d2)}을 가장 간단한 자연수의 비로`,ans:'3 : 2',type:'choice',choices:['3 : 2'],steps:[S_('분모 2와 3의 최소공배수',M_('2와 3'),6),S_('앞',`${FR(1,2)} ${M_('× 6')}`,3),S_('뒤',`${FR(1,3)} ${M_('× 6')}`,2)]}},
     why:{q:`${M_('0.6 : 0.9')}를 자연수의 비로 바꾸려면?`,choices:['앞과 뒤에 똑같이 10을 곱해요','앞에만 10을 곱해요','0.6에서 0.9를 빼요'],ans:0,ok:'앞과 뒤에 같은 수를 곱해야 비가 그대로예요. 6 : 9 → 2 : 3'}}],
  gen(L,r){
   if(L===1){const[a,b]=ratioPair(r),g=ratioG(a,b);return ratioQ(r,M_(`${a} : ${b}`),a,b,[S_('두 수의 최대공약수',M_(`${J(a,'과','와')} ${b}`),g),S_('앞을 나누면',M_(`${a} ÷ ${g}`),a/g),S_('뒤를 나누면',M_(`${b} ÷ ${g}`),b/g)])}
   if(L===2){let a,b;do{[a,b]=ratioPair(r)}while(a%10===0&&b%10===0);const g=ratioG(a,b),A=a/10,B=b/10;
     return ratioQ(r,M_(`${A} : ${B}`),a,b,[S_('앞과 뒤에 10을 곱하면 · 앞',M_(`${A} × 10`),a),S_('뒤',M_(`${B} × 10`),b),S_('최대공약수로 나누면 · 앞',M_(`${a} ÷ ${g}`),a/g),S_('뒤',M_(`${b} ÷ ${g}`),b/g)],{[`${a} : ${b}`]:'자연수로 바꾼 다음, 최대공약수로 한 번 더 나눠요.'})}
   let d1,d2,n1,n2;do{d1=ri(r,2,6);d2=ri(r,2,6);n1=ri(r,1,d1-1);n2=ri(r,1,d2-1)}while(d1===d2||ratioG(n1,d1)>1||ratioG(n2,d2)>1);
   const Lc=d1*d2/ratioG(d1,d2),a=n1*Lc/d1,b=n2*Lc/d2,g=ratioG(a,b),st=[S_(`분모 ${J(d1,'과','와')} ${d2}의 최소공배수`,M_(`${J(d1,'과','와')} ${d2}`),Lc),S_('앞에 곱하면',`${FR(n1,d1)} ${M_('× '+Lc)}`,a),S_('뒤에 곱하면',`${FR(n2,d2)} ${M_('× '+Lc)}`,b)];
   if(g>1)st.push(S_('최대공약수로 나누면 · 앞',M_(`${a} ÷ ${g}`),a/g),S_('뒤',M_(`${b} ÷ ${g}`),b/g));
   return ratioQ(r,`${FR(n1,d1)} : ${FR(n2,d2)}`,a,b,st,{[`${n1} : ${n2}`]:'분자끼리만 쓰면 안 돼요. 분모의 최소공배수를 앞과 뒤에 똑같이 곱해요.',[`${d2*n1} : ${d1*n2}`]:'곱한 수가 앞과 뒤에서 달라요. 같은 수(분모의 최소공배수)를 곱해요.'})}},
 {id:'signed',grp:'mid',nm:'부호가 있는 덧셈',use:'정수와 유리수의 덧셈, 수직선',lv:['1단계 · 같은 부호 더하기','2단계 · 다른 부호 더하기','3단계 · 섞어서 더하기'],
  ways:[{t:'같은 부호는 합치고, 다른 부호는 차이',idea:`${M_('(−3) + (−5)')}는 같은 음수끼리라 합쳐서 ${M_('−8')}. ${M_('(+7) + (−4)')}는 부호가 다르니 큰 쪽(+) 부호에 차이 ${M_('7 − 4 = 3')}을 붙여 ${M_('+3')}이에요.`,
     ex(r){const a=ri(r,3,9),b=ri(r,2,8);return{q:M_(`(−${a}) + (−${b})`),ans:-(a+b),type:'sn',steps:[S_('같은 − 부호끼리 · 숫자를 더해요',M_(`${a} + ${b}`),a+b),S_('공통 부호 −를 붙여요','',-(a+b),'sn')]}},
     why:{q:`${M_('(+4) + (−9)')}의 부호는 무엇일까요?`,choices:['− (9가 4보다 커서)','+ (앞의 수가 +라서)','부호가 없어요'],ans:0,ok:'부호가 다를 때는 절댓값이 큰 수의 부호를 따라가요.'}}],
  gen(L,r){if(L===3)L=r()<0.4?1:2;
   if(L===1){const a=ri(r,2,9),b=ri(r,2,9),neg=r()<0.65;
     if(neg)return{q:M_(`(−${a}) + (−${b})`),ans:-(a+b),type:'sn',steps:[S_('같은 − 부호 · 숫자를 더해요',M_(`${a} + ${b}`),a+b),S_('− 부호를 붙여요','',-(a+b),'sn')],
       errs:[E_(a+b,'부호가 빠졌어요. 음수끼리 더하면 음수(−)예요.'),E_(-Math.abs(a-b),'빼기를 했어요. 같은 부호끼리는 숫자를 더해요.')]}
     return{q:M_(`(+${a}) + (+${b})`),ans:a+b,type:'sn',steps:[S_('같은 + 부호 · 숫자를 더해요',M_(`${a} + ${b}`),a+b),S_('부호까지 쓰면','',a+b,'sn')],errs:[E_(-(a+b),'양수끼리 더하면 양수예요.')]}}
   if(L===2){let a=ri(r,2,10),b=ri(r,2,10);if(a===b)b++;const flip=r()<0.5,A=flip?-a:a,B=flip?b:-b,ans=A+B,big=Math.max(a,b),sm=Math.min(a,b);
     return{q:M_(`(${sgnTxt(A)}) + (${sgnTxt(B)})`),ans,type:'sn',steps:[S_('부호가 다르니 두 수의 차이',M_(`${big} − ${sm}`),big-sm),S_('절댓값이 큰 수의 부호를 붙이면?','',ans,'sn')],
       errs:[E_(-ans,'부호가 반대예요. 절댓값이 더 큰 수의 부호를 따라가요.'),E_(ans>0?(a+b):-(a+b),'부호가 다를 때는 더하지 않고 차이를 구해요.')]}}}},
 {id:'signsub',grp:'mid',nm:'부호가 있는 뺄셈',use:'정수와 유리수의 뺄셈, 두 점 사이의 거리',lv:['1단계 · 양수 빼기','2단계 · 음수 빼기','3단계 · 섞어서 빼기'],
  ways:[{t:'빼기는 부호 바꿔 더하기',idea:`${M_('(+3) − (−5)')}는 빼기를 더하기로, 뒤의 부호를 반대로 바꿔 ${M_('(+3) + (+5) = +8')}로 계산해요.`,
     ex(r){const a=ri(r,2,8),b=ri(r,2,7);return{q:M_(`(+${a}) − (−${b})`),ans:a+b,type:'sn',steps:[S_('− (−)는 + (+)로 바뀌어요 · 계산하면',M_(`${a} + ${b}`),a+b),S_('부호까지 쓰면','',a+b,'sn')]}},
     why:{q:`${M_('(+2) − (−6)')}을 덧셈으로 바르게 바꾼 것은?`,choices:['(+2) + (+6)','(+2) + (−6)','(−2) + (+6)'],ans:0,ok:'빼는 수(−6)의 부호만 반대로(+6) 바꿔서 더해요.'}}],
  gen(L,r){const a=ri(r,1,9),b=ri(r,1,9),A=(r()<0.5?1:-1)*a,B=(L===1?1:L===2?-1:(r()<0.5?1:-1))*b,ans=A-B;
   return{q:M_(`(${sgnTxt(A)}) − (${sgnTxt(B)})`),ans,type:'sn',steps:[S_(`덧셈으로 바꿔요 · (${sgnTxt(A)}) + ( ? )에서 ?는`,'',-B,'sn'),S_(`(${sgnTxt(A)}) + (${sgnTxt(-B)})를 계산하면`,'',ans,'sn')],
     errs:[E_(A+B,'빼는 수의 부호를 바꾸지 않고 바로 더했어요. 뒤의 수 부호를 바꿔요.'),E_(-ans,'부호가 반대예요. 덧셈으로 바꾼 뒤 절댓값이 큰 수의 부호를 따라가요.')]}}},
 {id:'signmul',grp:'mid',nm:'부호가 있는 곱셈·나눗셈',use:'정수와 유리수의 곱셈·나눗셈, 정비례·반비례에서 a 구하기',lv:['1단계 · 곱셈의 부호','2단계 · 나눗셈의 부호','3단계 · 셋을 곱할 때'],
  ways:[{t:'부호 먼저, 숫자는 나중',idea:`곱셈·나눗셈은 <b>부호부터</b> 정해요. 같은 부호면 +, 다른 부호면 −. 숫자는 그냥 곱하고 나눠요.`,
     ex(r){const a=ri(r,2,6),b=ri(r,2,6);return{q:M_(`(−${a}) × (−${b})`),ans:a*b,type:'sn',steps:[S_('두 수의 부호는?','','같아요','choice',['같아요','달라요']),S_('숫자끼리 곱해요',M_(`${a} × ${b}`),a*b),S_('같은 부호면 +, 다른 부호면 − · 답은?','',a*b,'sn')]}},
     why:{q:`${M_('(−2) × (−5)')}의 부호는?`,choices:['+ (같은 부호라서)','− (음수가 있어서)','부호가 없어요'],ans:0,ok:'음수 × 음수 = 양수예요.'}},
   {t:'음수의 개수 세기',idea:`여러 수를 곱할 때는 <b>음수가 몇 개인지</b> 세요. 짝수 개면 +, 홀수 개면 −예요.`,
     ex(r){const a=ri(r,2,4),b=ri(r,2,3),c=ri(r,2,3);return{q:M_(`(−${a}) × (+${b}) × (−${c})`),ans:a*b*c,type:'sn',steps:[S_('음수는 몇 개?','',2),S_('숫자끼리 곱해요',M_(`${a} × ${b} × ${c}`),a*b*c),S_('짝수 개면 +, 홀수 개면 − · 답은?','',a*b*c,'sn')]}},
     why:{q:`${M_('(−1) × (−1) × (−1)')}의 부호는?`,choices:['− (음수가 3개)','+ (음수끼리 곱해서)','부호가 없어요'],ans:0,ok:'음수 2개는 +, 하나 더 곱하면 다시 −예요.'}}],
  gen(L,r){const sg=()=>r()<0.5?1:-1;
   if(L===1){const a=ri(r,2,9),b=ri(r,2,9),A=sg()*a,B=sg()*b,ans=A*B;
     return{q:M_(`(${sgnTxt(A)}) × (${sgnTxt(B)})`),ans,type:'sn',steps:[S_('숫자끼리 곱해요',M_(`${a} × ${b}`),a*b),S_('같은 부호면 +, 다른 부호면 − · 답은?','',ans,'sn')],
       errs:[E_(-ans,'부호가 반대예요. 같은 부호면 +, 다른 부호면 −예요.'),E_(A+B,'더했어요. 곱하기예요.')]}}
   if(L===2){const a=ri(r,2,9),b=ri(r,2,9),A=sg()*a,B=sg()*b,D=A*B;
     return{q:M_(`(${sgnTxt(D)}) ÷ (${sgnTxt(B)})`),ans:A,type:'sn',steps:[S_('숫자끼리 나눠요',M_(`${a*b} ÷ ${b}`),a),S_('같은 부호면 +, 다른 부호면 − · 답은?','',A,'sn')],
       errs:[E_(-A,'부호가 반대예요. 나눗셈도 곱셈처럼 같은 부호면 +, 다른 부호면 −예요.'),E_(D*B,'곱했어요. 나누기예요.')]}}
   const n=[ri(r,1,4),ri(r,2,3),ri(r,2,3)],sgn=n.map(()=>sg()),V=n.map((x,k)=>x*sgn[k]),neg=sgn.filter(x=>x<0).length,ab=n[0]*n[1]*n[2],ans=V[0]*V[1]*V[2];
   return{q:M_(V.map(v=>`(${sgnTxt(v)})`).join(' × ')),ans,type:'sn',steps:[S_('음수는 몇 개?','',neg),S_('숫자끼리 곱해요',M_(n.join(' × ')),ab),S_('짝수 개면 +, 홀수 개면 − · 답은?','',ans,'sn')],
     errs:[E_(-ans,'부호가 반대예요. 음수가 짝수 개면 +, 홀수 개면 −예요.')]}}}];
/* ── 핵심 낱말: 계산을 보면 떠올릴 낱말 하나 + 신호 + 그림 + 식 (기초학력 학생은 '무엇을 떠올릴지'부터 어려워해요) ── */
const KEYS={
 add:{w:'10 만들기',cue:'더해서 10을 넘거나, 빼서 10 아래로 내려갈 때',say:'더할 때는 모자란 만큼 채워 <b>10을 만들고</b> 남은 수를 더해요. 뺄 때는 <b>먼저 10까지</b> 빼고 남은 수를 더 빼요.',fig:()=>svgTenFrame(8,5),eq:'8 + 5 = 10 + 3 = 13,  13 − 6 = 13 − 3 − 3 = 7'},
 add2:{w:'자리끼리',cue:'두 자리 수를 더하거나 뺄 때',say:'<b>십의 자리는 십의 자리끼리, 일의 자리는 일의 자리끼리</b> 계산하고 합쳐요. 뺄 때는 몇십을 먼저 빼요.',fig:()=>svgBlocks(47,38),eq:'47 + 38 = (40 + 30) + (7 + 8) = 70 + 15 = 85'},
 place:{w:'자리의 값',cue:'0이 붙은 수나 큰 수를 볼 때',say:'숫자는 <b>어느 자리에 있느냐</b>에 따라 값이 달라요. 한 자리 올라갈 때마다 10배예요.',fig:null,eq:'347 = 300 + 40 + 7'},
 divr:{w:'넘지 않는 가장 큰 곱',cue:'나누어떨어지지 않을 때',say:'구구단에서 <b>넘지 않는 가장 큰 곱</b>을 찾으면 그게 몫이에요. 남은 수가 나머지, 나머지는 나누는 수보다 작아요.',fig:null,eq:'23 ÷ 4 = 5 … 3 (4 × 5 + 3 = 23)'},
 mixed:{w:'통째는 분모만큼',cue:'2⅓처럼 자연수가 붙은 분수를 보면',say:'통째 하나는 <b>분모만큼의 조각</b>이에요. 대분수 → 가분수는 통째를 조각으로 바꿔 더하고, 가분수 → 대분수는 분모만큼씩 묶어요.',fig:null,eq:'2와 1/3 = (2 × 3 + 1)/3 = 7/3'},
 fdconv:{w:'분모를 10, 100으로',cue:'분수와 소수를 바꿀 때',say:'분모를 <b>10이나 100으로</b> 만들면 소수가 바로 보여요. 0.1은 10분의 1, 0.01은 100분의 1이에요.',fig:null,eq:'3/5 = 6/10 = 0.6,  0.25 = 25/100 = 1/4'},
 fracdiv:{w:'뒤집어 곱하기',cue:'분수로 나눌 때',say:'나누기는 <b>÷ 뒤의 수를 뒤집어(역수) 곱하기</b>로 바꿔요. 자연수 3의 역수는 1/3이에요.',fig:null,eq:'1/2 ÷ 1/4 = 1/2 × 4 = 2'},
 signsub:{w:'부호 바꿔 더하기',cue:'부호가 있는 수를 뺄 때',say:'빼기는 <b>뒤 수의 부호를 바꿔서 더하기</b>로 바꿔요. 그다음은 덧셈 규칙대로 해요.',fig:null,eq:'(+3) − (−5) = (+3) + (+5) = +8'},
 signmul:{w:'부호 먼저',cue:'부호가 있는 수를 곱하거나 나눌 때',say:'<b>같은 부호면 +, 다른 부호면 −</b>. 여러 개를 곱하면 음수가 짝수 개일 때 +, 홀수 개일 때 −예요.',fig:null,eq:'(−3) × (−4) = +12,  (+12) ÷ (−3) = −4'},
 facts:{w:'같은 묶음 여러 개',cue:'×를 보면',say:'4 × 3은 <b>4개씩 3묶음</b>이에요. 같은 수를 여러 번 더한 거예요.',fig:()=>svgGroups(12,3,3,'4개씩 3묶음'),eq:'4 × 3 = 4 + 4 + 4 = 12'},
 div:{w:'똑같이 묶기',cue:'÷를 보면',say:'12 ÷ 3은 12개를 <b>3묶음으로 똑같이</b> 나눈 한 묶음이에요. 곱셈을 거꾸로 생각해요.',fig:()=>svgGroups(12,3,0,'12개를 3묶음으로 똑같이'),eq:'12 ÷ 3 = 4 (3 × 4 = 12)'},
 order:{w:'곱셈 먼저',cue:'+, −와 ×, ÷가 섞여 있을 때',say:'×, ÷ 부분을 <b>한 묶음</b>으로 보고 먼저 해요. 괄호가 있으면 괄호가 제일 먼저예요.',fig:()=>ordFig(['3 + ',['4 × 2']]),eq:'3 + 4 × 2 = 3 + 8 = 11'},
 fracbase:{w:'묶음',cue:'"몇의 몇분의 몇"을 보면',say:'<b>분모만큼 똑같이 묶고</b>, 분자만큼 가져가요.',fig:()=>svgGroups(12,4,3),eq:'12의 3/4 = 12 ÷ 4 × 3 = 9'},
 est:{w:'가까운 몇십',cue:'"약", "어림"을 보거나 답을 확인할 때',say:'계산하기 쉬운 <b>가까운 몇십</b>으로 바꿔서 대충 얼마인지 봐요.',fig:()=>svgRound(29,30),eq:'29 × 4 → 30 × 4 = 120쯤'},
 mul:{only:[2],w:'쪼개기',cue:'두 자리 수를 곱할 때',say:'<b>10짜리와 나머지로 쪼개서</b> 곱하고 더해요.',fig:()=>svgSplit(17,6),eq:'17 × 6 = 10 × 6 + 7 × 6 = 60 + 42'},
 pow:{w:'같은 수 두 번',cue:'작은 ²를 보면',say:'²는 <b>같은 수를 두 번 곱하라</b>는 표시예요. 정사각형의 칸 수예요.',fig:()=>svgGrid(5),eq:'5² = 5 × 5 = 25'},
 sub:{w:'숨은 ×',cue:'숫자와 문자가 붙어 있으면',say:'2n은 2 × n이에요. 문자 자리에 수를 넣으면 <b>숨어 있던 ×</b>가 보여요.',fig:null,eq:'2n에 n = 5 → 2 × 5 = 10'},
 eq:{w:'거꾸로',cue:'n의 값을 구하라고 할 때',say:'곱했으면 나누고, 더했으면 빼요. <b>나중에 한 것부터 거꾸로</b>.',fig:null,eq:'3n = 24 → 24 ÷ 3 = 8'},
 area:{w:'칸 세기',cue:'넓이를 구할 때',say:'넓이는 <b>1 cm² 칸이 몇 개</b>인지예요. 직사각형은 가로 × 세로, 삼각형은 그 절반.',fig:()=>svgGridRect(5,3),eq:'5 × 3 = 15칸 = 15 cm²'},
 pi:{w:'π는 물건처럼',cue:'π가 보이면',say:'π를 <b>사과 하나</b>처럼 세요. 앞의 수끼리 계산하고 π는 붙여 둬요.',fig:null,eq:'12π + 8π = 20π (사과 12개 + 사과 8개)'},
 frac:{w:'묶음',cue:'⅓ ×, ½ ×처럼 분수가 곱해져 있으면',say:'⅓ × 12는 12를 <b>3묶음으로 똑같이 나눈 것 중 1묶음</b>이에요. 그래서 12 ÷ 3. 분수를 곱하면 한 묶음만 가져가니까 수가 <b>작아져요</b>.',fig:()=>svgGroups(12,3,1),eq:'⅓ × 12 = 12 ÷ 3 = 4'},
 surf:{only:[3],w:'같은 면 2개씩',cue:'직육면체·기둥의 겉넓이를 구할 때',say:'마주 보는 면은 똑같아요. <b>서로 다른 면을 더하고 2배</b> 해요.',fig:null,eq:'2 × (6 + 8 + 12)'},
 unit:{w:'1 m = 100 cm',cue:'단위가 서로 다를 때',say:'작은 단위로 바꾸면 수가 커지고(× 100), 큰 단위로 바꾸면 작아져요(÷ 100).',fig:()=>svgMeter(),eq:'3 m = 300 cm'},
 fracop:{w:'통분',cue:'분모가 다른 분수를 더하거나 뺄 때',say:'조각 크기가 같아야 더할 수 있어요. <b>분모를 같게(통분)</b> 만든 뒤 분자끼리 계산해요.',fig:()=>svgBars(2,4,1,2),eq:'1/2 + 1/4 = 2/4 + 1/4 = 3/4'},
 dec:{w:'소수점 맞추기',cue:'소수를 더하고 빼거나 곱할 때',say:'더하기·빼기는 <b>소수점 자리를 나란히</b>, 곱셈은 자연수처럼 곱하고 소수점을 찍어요.',fig:null,eq:'2.4 + 0.35 = 2.75,  0.4 × 6 = 2.4'},
 ratio:{w:'같은 수로 나누기',cue:'비를 간단히 할 때',say:'비의 앞과 뒤에 <b>같은 수를 곱하거나 나눠도</b> 비는 같아요. 소수는 × 10, 분수는 분모의 최소공배수를 곱해 자연수로 만든 뒤 <b>최대공약수</b>로 나눠요.',fig:null,eq:'12 : 18 = (12 ÷ 6) : (18 ÷ 6) = 2 : 3'},
 gcd:{w:'나누어떨어지는 수',cue:'약수·최대공약수·최소공배수를 구할 때',say:'약수는 <b>나머지 없이 나누는 수</b>예요. 약분은 최대공약수, 통분은 최소공배수를 써요.',fig:null,eq:'12와 18 → 최대공약수 6, 최소공배수 36'},
 signed:{w:'부호부터 정하기',cue:'+, − 부호가 붙은 수를 더할 때',say:'같은 부호는 합치고 그 부호를, 다른 부호는 <b>차이를 구하고 절댓값이 큰 쪽 부호</b>를 붙여요.',fig:null,eq:'(−3) + (−5) = −8,  (+7) + (−4) = +3'}};
const plainQ=h=>stripTags(String(h).replace(/<span class="frs"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g,'$1/$2').replace(/<sup>(\d+)<\/sup>⁄<sub>(\d+)<\/sub>/g,'$1/$2').replace(/<br\s*\/?>/g,' ').replace(/<small>.*?<\/small>/g,''));
const FRC={2:'½',3:'⅓'};
/* 주제마다 '식 ↔ 그림/말' 잇기 문제 */
/* 비 간단히 하기 도우미 */
const ratioG=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
function ratioPair(r){let p,q;do{p=ri(r,1,9);q=ri(r,1,9)}while(p===q||ratioG(p,q)>1);const m=ri(r,2,9);return[p*m,q*m]}
function ratioQ(r,qh,a,b,steps,extra={}){const g=ratioG(a,b),ok=`${a/g} : ${b/g}`,W={[`${b/g} : ${a/g}`]:'앞과 뒤가 바뀌었어요. 순서는 그대로 둬요.',...extra};
  const half=[2,3,5].find(k=>g%k===0&&k<g);if(half)W[`${a/half} : ${b/half}`]='더 나눌 수 있어요. 최대공약수로 나눠야 가장 간단해요.';
  W[`${a} : ${b}`]=W[`${a} : ${b}`]||'아직 공약수로 나누지 않았어요.';delete W[ok];
  const ch=shuffle(r,[ok,...shuffle(r,Object.keys(W)).slice(0,3)]);
  return{q:`${qh}<br><small>가장 간단한 자연수의 비로 나타내면?</small>`,type:'choice',choices:ch,mathChoices:true,ans:ok,errc:W,steps}}
const LINKS={
 add:r=>{const a=ri(r,6,9),b=ri(r,11-a,9);return[{p:`${svgTenFrame(a,b)}<p>${M_(`${a} + ${b}`)}${J(b,'을','를').slice(String(b).length)} 10 만들기로 바꾸면?</p>`,choices:[`10 + ${a+b-10}`,`10 + ${b}`,`${a} + 10`],ans:`10 + ${a+b-10}`,ok:`${a}에 ${J(10-a,'을','를')} 채워 10, ${b}에서 남은 ${J(a+b-10,'을','를')} 더해요.`}]},
 add2:r=>{const a=ri(r,2,6)*10+ri(r,1,9),b=ri(r,1,3)*10+ri(r,1,9),aT=a-a%10,bT=b-b%10,ok=`(${aT} + ${bT}) + (${a%10} + ${b%10})`;return[{p:`${svgBlocks(a,b)}<p>${M_(`${a} + ${b}`)}${J(b,'을','를').slice(String(b).length)} 자리끼리 나누면?</p>`,choices:[ok,`(${aT} + ${b%10}) + (${a%10} + ${bT})`,`${aT} + ${bT}`],ans:ok,ok:'십의 자리는 십의 자리끼리, 일의 자리는 일의 자리끼리 더해요.'}]},
 place:r=>{const h=ri(r,2,9),t=ri(r,1,9),o=ri(r,1,9),n=h*100+t*10+o,ok=`${h*100} + ${t*10} + ${o}`;return[{p:`<p class="kbig">${M_(n)}</p><p>자리마다 나누어 쓰면?</p>`,choices:[ok,`${h} + ${t} + ${o}`,`${h*10} + ${t*10} + ${o}`],ans:ok,ok:`백의 자리 ${J(h,'은','는')} ${h*100}, 십의 자리 ${J(t,'은','는')} ${t*10}이에요.`}]},
 divr:r=>{const d=ri(r,3,6),q=ri(r,3,7),m=ri(r,1,d-1),n=d*q+m,ok=`${q} … ${m}`;return[{p:`<p class="kbig">${M_(`${n} ÷ ${d}`)}</p><p>몫과 나머지를 바르게 쓴 것은?</p>`,choices:[ok,`${q-1} … ${m+d}`,`${q+1} … ${m}`],ans:ok,ok:`${d} × ${q} + ${m} = ${n}. 나머지 ${J(m,'은','는')} ${d}보다 작아요.`}]},
 mixed:r=>{const d=ri(r,3,5),w=ri(r,1,2),n=ri(r,1,d-1),N=w*d+n,ok=`${N}조각`;return[{p:`<p class="kbig">${M_(w)}${FR(n,d)}</p><p>모두 몇 조각일까요? (통째 하나는 ${d}조각)</p>`,choices:[ok,`${w+n}조각`,`${w*n}조각`].filter((x,k,A)=>A.indexOf(x)===k),ans:ok,ok:`통째 ${w}개는 ${w*d}조각, 여기에 ${n}조각을 더해 ${N}조각이에요.`}]},
 fdconv:r=>{const n=ri(r,1,9);return[{p:`<p class="kbig">${FR(n,10)}</p><p>같은 소수는?</p>`,choices:[`0.${n}`,`0.0${n}`,`${n}.10`],ans:`0.${n}`,ok:`10분의 ${J(n,'은','는')} 0.1이 ${n}개라서 0.${n}이에요.`}]},
 facts:r=>{const k=ri(r,3,6);let m=ri(r,2,4);if(m===k)m=2;return[{p:`${svgGroups(k*m,m,m,`${k}개씩 ${m}묶음`)}<p>그림에 맞는 식은?</p>`,choices:[`${k} × ${m}`,`${k} + ${m}`,`${k} + ${k}`],ans:`${k} × ${m}`,ok:`${k}개씩 ${m}묶음은 ${k} × ${m} = ${k*m}${IYs(k*m)}.`}]},
 div:r=>{const d=ri(r,2,4),q=ri(r,2,4),T=d*q;return[{p:`${svgGroups(T,d,0,`${T}개를 ${d}묶음으로 똑같이`)}<p>한 묶음은 몇 개? 맞는 식은?</p>`,choices:[`${T} ÷ ${d}`,`${T} × ${d}`,`${T} − ${d}`],ans:`${T} ÷ ${d}`,ok:`똑같이 묶는 건 ÷예요. ${T} ÷ ${d} = ${q}.`}]},
 order:r=>{const[a,b,c]=shuffle(r,[2,3,4,5,6,7,8,9]).slice(0,3);return[{p:`<p class="kbig">${M_(`${a} + ${b} × ${c}`)}</p><p>먼저 한 묶음으로 볼 부분은?</p>`,choices:[`${b} × ${c}`,`${a} + ${b}`,`${a} + ${c}`],ans:`${b} × ${c}`,ok:`×가 있는 ${b} × ${c}를 먼저 해요.`}]},
 fracbase:r=>{const d=ri(r,3,4),n=ri(r,2,d-1),k=ri(r,2,3),T=d*k;return[{p:`${svgGroups(T,d,n)}<p>색칠한 부분을 분수로 말하면?</p>`,choices:[`${T}의 ${n}/${d}`,`${T}의 ${d}/${n}`,`${T}의 1/${n}`],ans:`${T}의 ${n}/${d}`,ok:`${d}묶음 중 ${n}묶음이니까 ${n}/${d}이에요.`},
   {p:`<p class="kbig">${M_(T)}의 ${FR(n,d)}</p><p>묶음으로 말하면?</p>`,choices:[`${T}개를 ${d}묶음으로 나눈 것 중 ${n}묶음`,`${T}개를 ${n}묶음으로 나눈 것 중 ${d}묶음`,`${T}개가 ${d}묶음`],ans:`${T}개를 ${d}묶음으로 나눈 것 중 ${n}묶음`,ok:'분모는 나눈 묶음의 수, 분자는 가져가는 묶음의 수예요.'}]},
 est:r=>{const R=ri(r,3,8)*10,a=R+pick(r,[-2,-1,1,2]),b=ri(r,3,9);return[{p:`${svgRound(a,R)}<p>${M_(`${a} × ${b}`)}${J(b,'을','를').slice(String(b).length)} 어림할 때 쓰는 식은?</p>`,choices:[`${R} × ${b}`,`${R-10} × ${b}`,`${a} × 10`],ans:`${R} × ${b}`,ok:`${a}에 가장 가까운 몇십은 ${R}이에요.`}]},
 mul:r=>{const a=ri(r,12,19),b=ri(r,3,7),u=a-10;return[{p:`${svgSplit(a,b)}<p>${M_(`${a} × ${b}`)}${J(b,'을','를').slice(String(b).length)} 쪼개면?</p>`,choices:[`10 × ${b} + ${u} × ${b}`,`10 × ${b} + ${u}`,`${a} + ${b}`],ans:`10 × ${b} + ${u} × ${b}`,ok:'쪼갠 두 부분에 모두 곱해요.'}]},
 pow:r=>{const n=ri(r,3,6);return[{p:`${svgGrid(n)}<p>칸의 수를 나타내는 것은?</p>`,choices:[`${n}²`,`${n} × 2`,`${n} + ${n}`],ans:`${n}²`,ok:`한 변이 ${n}칸인 정사각형 = ${n} × ${n} = ${n}²이에요.`}]},
 sub:r=>{const n=ri(r,3,9),a=ri(r,2,4);return[{p:`<p class="kbig">${N_} = ${M_(n)}일 때, ${M_(a)}${N_}</p><p>숨은 ×를 찾아 바꾸면?</p>`,choices:[`${a} × ${n}`,`${a}${n}`,`${a} + ${n}`],ans:`${a} × ${n}`,ok:`${a}n = ${a} × n이에요.`}]},
 eq:r=>{const a=ri(r,2,6),n=ri(r,3,9);return[{p:`<p class="kbig">"${a}에 무엇을 곱하면 ${a*n}?"</p><p>거꾸로 하는 식은?</p>`,choices:[`${a*n} ÷ ${a}`,`${a*n} × ${a}`,`${a*n} − ${a}`],ans:`${a*n} ÷ ${a}`,ok:'곱하기를 거꾸로 하면 나누기예요.'}]},
 area:r=>{const a=ri(r,3,6),b=ri(r,2,4);return[{p:`${svgGridRect(a,b)}<p>칸의 수(넓이)를 구하는 식은?</p>`,choices:[`${a} × ${b}`,`${a} + ${b}`,`2 × (${a} + ${b})`],ans:`${a} × ${b}`,ok:`한 줄에 ${a}칸씩 ${b}줄이에요. 2 × (${a} + ${b})는 둘레예요.`}]},
 pi:r=>{const a=ri(r,5,12),b=ri(r,2,6);return[{p:`<p class="kbig">사과 ${a}개 + 사과 ${b}개</p><p>π를 사과처럼 세면?</p>`,choices:[`${a}π + ${b}π = ${a+b}π`,`${a}π + ${b}π = ${a+b}π²`,`${a}π + ${b}π = ${a*b}π`],ans:`${a}π + ${b}π = ${a+b}π`,ok:`사과 ${a+b}개처럼 ${a+b}π예요.`}]},
 frac:r=>{const d=ri(r,2,3),k=ri(r,2,4),T=d*k,f=FRC[d];return[{p:`${svgGroups(T,d,1)}<p>그림에 맞는 식은?</p>`,choices:[`${f} × ${T}`,`${d} × ${T}`,`${T} − ${d}`],ans:`${f} × ${T}`,ok:`${T}개를 ${d}묶음으로 나눈 것 중 1묶음 = ${f} × ${T} = ${T} ÷ ${d} = ${k}.`},
   {p:`<p class="kbig">${M_(`${f} × ${T}`)}</p><p>묶음으로 말하면?</p>`,choices:[`${T}개를 ${d}묶음으로 나눈 것 중 1묶음`,`${T}개가 ${d}묶음`,`${T}개에서 ${d}개를 뺀 것`],ans:`${T}개를 ${d}묶음으로 나눈 것 중 1묶음`,ok:`그래서 ${f} × ${T} = ${T} ÷ ${d}. 분수를 곱하면 작아져요.`}]},
 surf:r=>{const a=ri(r,2,5),b=ri(r,2,5),c=ri(r,2,5);return[{p:`<p class="kbig">가로 ${a}, 세로 ${b}, 높이 ${c}인 직육면체의 겉넓이</p><p>맞는 식은?</p>`,choices:[`2 × (${a*b} + ${a*c} + ${b*c})`,`${a*b} + ${a*c} + ${b*c}`,`${a} × ${b} × ${c}`],ans:`2 × (${a*b} + ${a*c} + ${b*c})`,ok:`같은 면이 2개씩이라 세 면을 더하고 2배. ${a} × ${b} × ${c}는 부피예요.`}]},
 unit:r=>{const a=ri(r,2,9);return[{p:`${svgMeter()}<p>${M_(a+' m')}는?</p>`,choices:[`${a*100} cm`,`${a*10} cm`,`${a} cm`],ans:`${a*100} cm`,ok:`1 m = 100 cm라서 ${a} m = ${a*100} cm.`}]},
 fracop:r=>[{p:`${svgBars(2,4,1,2)}<p class="kbig">${FR(1,2)} + ${FR(1,4)}</p><p>통분한 식은?</p>`,choices:['2/4 + 1/4','1/4 + 1/4','2/6'],ans:'2/4 + 1/4',ok:'1/2 = 2/4로 조각 크기를 맞춰요.'}],
 fracdiv:r=>[{p:`<p class="kbig">${FR(1,2)} ÷ ${FR(3,4)}</p><p>곱셈으로 바꾸면?</p>`,choices:['1/2 × 4/3','2/1 × 3/4','1/2 × 3/4'],ans:'1/2 × 4/3',ok:'÷ 뒤의 분수만 위아래를 뒤집어 곱해요.'}],
 dec:r=>[{p:`<p class="kbig">${M_('2.4 + 0.35')}</p><p>소수점 자리를 맞춘 식은?</p>`,choices:['2.40 + 0.35','0.24 + 0.35','24 + 35'],ans:'2.40 + 0.35',ok:'2.4 뒤에 0을 붙여 2.40으로 맞추면 자릿값이 정확해요.'}],
 ratio:r=>{const[a,b]=ratioPair(r),g=ratioG(a,b);return[{p:`<p class="kbig">${M_(`${a} : ${b}`)}</p><p>앞과 뒤를 똑같이 나눌 가장 큰 수는?</p>`,choices:shuffle(r,[String(g),String(a*b/g),String(a+b)]).filter((x,i,A)=>A.indexOf(x)===i),ans:String(g),ok:`${J(a,'과','와')} ${b}의 최대공약수 ${josaRo(String(g))} 나누면 ${a/g} : ${b/g}이에요.`}]},
 gcd:r=>[{p:`<p class="kbig">${M_('12')}와 ${M_('18')}</p><p>둘 다 나누어떨어지게 하는 가장 큰 수는?</p>`,choices:['6','3','36'],ans:'6',ok:'6은 12와 18의 최대공약수예요. 36은 최소공배수예요.'}],
 signed:r=>[{p:`<p class="kbig">${M_('(+7) + (−4)')}</p><p>답의 부호는?</p>`,choices:['+ (7이 4보다 커서)','− (−4가 있어서)','부호가 없어요'],ans:'+ (7이 4보다 커서)',ok:'부호가 다르면 절댓값이 큰 수의 부호를 따라가요.'}],
 signmul:r=>[{p:`<p class="kbig">${M_('(−2) × (−6)')}</p><p>답은?</p>`,choices:['+12','−12','−8'],ans:'+12',ok:'같은 부호끼리 곱하면 +예요.'}],
 signsub:r=>[{p:`<p class="kbig">${M_('(+3) − (−5)')}</p><p>덧셈으로 바꾸면?</p>`,choices:['(+3) + (+5)','(+3) + (−5)','(−3) + (+5)'],ans:'(+3) + (+5)',ok:'빼는 수의 부호만 반대로 바꿔 더해요.'}]};
/* 잇기 활동: ① 이 낱말을 떠올릴 계산 고르기 ② 이 계산에 떠올릴 낱말 고르기 ③ 그림·말 ↔ 식 */
const keySample=(id,r)=>{const K=KEYS[id],T=CALC.find(t=>t.id===id);return T.gen(K.only?K.only[0]:1,r)};
const keyFor=q=>{if(q.hk)return q.hk;const K=!q.kw&&q.tid&&KEYS[q.tid];return K&&(!K.only||K.only.includes(q.lv))?K:null};
function keyOthers(id,r,n){const seen=new Set([KEYS[id].w]),out=[];for(const t of shuffle(r,CALC.filter(t=>KEYS[t.id]))){const w=KEYS[t.id].w;if(seen.has(w))continue;seen.add(w);out.push(t);if(out.length>=n)break}return out}
function keyRounds(id,r){const K=KEYS[id],mine=()=>plainQ(keySample(id,r).q);
  const o1=keyOthers(id,r,2),e1=mine(),r1={p:`<p class="kbig">💡 ${K.w}</p><p>이 낱말을 떠올려야 하는 계산은?</p>`,choices:shuffle(r,[e1,...o1.map(t=>plainQ(keySample(t.id,r).q))]),ans:e1,ok:`${K.cue} '${K.w}'${josa(K.w,'을','를').slice(K.w.length)} 떠올려요.`};
  const o2=keyOthers(id,r,2),r2={p:`<p class="kbig">${keySample(id,r).q}</p><p>이 계산에 떠올릴 낱말은?</p>`,choices:shuffle(r,[K.w,...o2.map(t=>KEYS[t.id].w)]),ans:K.w,ok:`${K.cue} → '${K.w}'.`};
  return[...(LINKS[id]?LINKS[id](r):[]),r1,r2]}
function keyCardHTML(id){const K=KEYS[id];return`<div class="kcard"><div class="krow"><span class="klab">신호</span><span>${K.cue}</span></div><div class="krow"><span class="klab">낱말</span><b class="kword">💡 ${K.w}</b></div>${K.fig?`<div class="kfig">${K.fig()}</div>`:''}<div class="krow"><span class="klab">말</span><span>${K.say}</span></div><div class="krow"><span class="klab">식</span>${M_(K.eq)}</div></div>`}
function keyActivity(host,id,onDone){const r=mulberry(newSeed()),R=keyRounds(id,r);let i=0,miss=0;
  const show=()=>{const x=R[i];if(!x){host.innerHTML=`<div class="feedback ok">잇기를 마쳤어요! ${miss?'헷갈린 곳은 위의 낱말 카드를 다시 보세요.':'낱말과 그림과 식이 잘 이어졌어요.'}</div><p style="margin:8px 0 0"><button type="button" class="btn kAgain">다른 문제로 한 번 더</button></p>`;$('.kAgain',host).onclick=()=>keyActivity(host,id,onDone);onDone&&onDone(miss);return}
    host.innerHTML=`<div class="kact"><div class="kno">${i+1} / ${R.length}</div><div class="kp">${x.p}</div><div class="kc"></div><div class="kmsg flmsg" aria-live="polite"></div></div>`;
    $('.kc',host).appendChild(answerUI({type:'choice',choices:x.choices},v=>{const m=$('.kmsg',host);if(v===x.ans){m.innerHTML=`<span class="ok">맞아요! ${x.ok||''}</span>`;$$('.kc button',host).forEach(b=>b.disabled=true);i++;setTimeout(show,reduced?0:1500);return true}miss++;m.textContent=`다시 골라 봐요. 힌트: ${x.ok||''}`;return false}))};
  show()}
/* 오늘의 계산에 끼워 넣는 '낱말 떠올리기' 문제 (점수에는 안 들어가요) */
function keyQuiz(t,r){const K=KEYS[t.id],o=keyOthers(t.id,r,2),q=keySample(t.id,r);const choices=shuffle(r,[K.w,...o.map(x=>KEYS[x.id].w)]),errc={};o.forEach(x=>{errc[KEYS[x.id].w]=`'${KEYS[x.id].w}'${josa(KEYS[x.id].w,'은','는').slice(KEYS[x.id].w.length)} ${KEYS[x.id].cue} 떠올려요. 이 계산은 ${K.cue} → '${K.w}'.`});
  return{q:`${q.q}<div class="kq">이 계산에 떠올릴 낱말은?</div>`,type:'choice',choices,ans:K.w,errc,extra:true,kw:true,tid:t.id}}
/* ── 오류별 피드백 ── */
function diagnose(q,v){if(q.type==='choice')return(q.errc&&q.errc[v])||'';if(!q.errs)return'';const s=String(v),hp=s.includes('π'),c=s.replace('π',''),n=hp?(c===''?1:parseFloat(c)):snVal(s);if(!isFinite(n))return'';
  const e=q.errs.find(x=>Math.abs(x.a-n)<1e-9&&(x.pi==null||x.pi===hp)&&!(Math.abs(x.a-q.ans)<1e-9));return e?e.m:''}
/* ── 생각하는 법: 보기(예시 + 생각 질문) → 같이(앞부분은 채워 둠) → 혼자(그림 없이) ── */
function wayFlow(body,T,w,onDone,opt={}){const r=mulberry(newSeed()),ex=[];let g=0;while(ex.length<3&&g++<40){const e=w.ex(r);if(!ex.some(x=>x.q===e.q))ex.push(e)}while(ex.length<3)ex.push(w.ex(r));
  const multi=ex[0].steps.length>=2&&!opt.short,PH=multi?['보기','같이','혼자']:['보기','혼자'];  /* [T36] opt.short: 오늘의 계산에서 처음 보는 칸은 보기 → 혼자로 짧게 */
  const head=p=>`<div class="wph" aria-label="${p+1}단계 / ${PH.length}단계">${PH.map((t,i)=>`<span class="${i<p?'done':i===p?'on':''}">${i+1} ${t}</span>`).join('<i aria-hidden="true">›</i>')}</div>`;
  const ansTxt=e=>(e.type==='choice'?'답: ':'정답은 ')+M_(fmtAns({type:e.type||'num',ans:e.ans,suffix:e.suffix}));
  function see(){const e=ex[0];
    body.innerHTML=head(0)+`<p class="wayIdea">${w.idea} ${sayBtn()}</p><div class="wayEx"><div class="wayQ">${e.q}</div>${e.fig||''}</div>
      <ol class="swlist seen">${e.steps.map(s=>`<li class="done"><span class="swt">${s.t}</span><span class="swq">${stepQ(s,true)}</span></li>`).join('')}</ol><p class="wayAns">${ansTxt(e)}</p>
      ${w.why?`<div class="wq"><p class="wqQ"><b>생각 질문</b> ${w.why.q}</p><div class="wqC"></div><div class="wqMsg flmsg" aria-live="polite"></div></div>`:''}
      <div class="next-row wnext" style="justify-content:flex-start"${w.why?' hidden':''}><button type="button" class="btn primary wGo">이제 ${PH[1]} 풀어요 →</button></div>`;
    const sb=$('.say',body);if(sb)sb.onclick=()=>speak(sayText(`${w.idea}. 예를 들어, ${e.q}. `+e.steps.map(s=>`${s.t}. ${s.q?(s.q.includes('{?}')?s.q.replace('{?}',stepFill(s)):`${s.q} = ${stepFill(s)}`):stepFill(s)}`).join('. ')),sb);
    if(w.why){const W=w.why,ok=W.choices[W.ans];$('.wqC',body).appendChild(answerUI({type:'choice',choices:shuffle(r,W.choices)},v=>{const m=$('.wqMsg',body);
      if(v===ok){m.innerHTML=`<span class="ok">맞아요! ${W.ok||''}</span>`;$('.wnext',body).hidden=false;$$('.wqC button',body).forEach(b=>b.disabled=true);return true}
      m.textContent='다시 생각해 봐요. 위의 풀이를 한 번 더 보세요.';return false}))}
    $('.wGo',body).onclick=()=>{stopSpeak();multi?together():alone()}}
  function together(){const e=ex[1];body.innerHTML=head(1)+`<div class="wayEx"><div class="wayQ">${e.q}</div>${e.fig||''}</div><div class="wayWalk"></div>`;
    stepWalk($('.wayWalk',body),e.steps,{prefill:Math.max(1,Math.floor(e.steps.length/2)),lead:'앞부분은 같이 했어요. 나머지를 계산해요.',onDone:()=>{
      $('.wayWalk',body).insertAdjacentHTML('beforeend',`<div class="feedback ok" style="margin-top:10px">${ansTxt(e)}. 이제 처음부터 혼자 해 봐요.</div><div class="next-row" style="justify-content:flex-start;margin-top:8px"><button type="button" class="btn primary wGo">혼자 풀기 →</button></div>`);$('.wGo',body).onclick=()=>alone()}})}
  function alone(e){e=e||ex[2];body.innerHTML=head(PH.length-1)+`<div class="wayEx"><div class="wayQ">${e.q}</div></div><div class="wayWalk"></div>`;
    stepWalk($('.wayWalk',body),e.steps,{lead:'처음부터 한 단계씩 계산해요.',onDone:shown=>{onDone(shown);
      $('.wayWalk',body).insertAdjacentHTML('beforeend',`<div class="feedback ok" style="margin-top:10px">${ansTxt(e)}. ${shown?'도움받은 단계가 있었어요. 다른 수로 한 번 더 하면 내 것이 돼요.':'혼자서 해냈어요!'}</div><div class="next-row" style="justify-content:flex-start;margin-top:8px"><button type="button" class="btn${shown?' primary':''} wMore">다른 수로 한 번 더</button></div>`);
      $('.wMore',body).onclick=()=>alone(w.ex(r));if(opt.after)opt.after($('.wayWalk',body))}})}
  see()}
/* ── 문제 묶음 풀기 (연습·오늘의 계산 공통) ──
   틀리면: 오류에 맞는 피드백 → 쪼개서 같이 풀기 → 끝에 비슷한 문제로 다시 / 언제든 '쪼개서 풀기' / 두 번 연속 틀리면 도움 제안 */
const PRAISE=['맞았어요! 차근차근 했어요.','좋아요! 끝까지 생각했어요.','맞았어요! 침착하게 풀었어요.','바로 그거예요! 방법이 몸에 붙고 있어요.'];
/* 포인트는 맞힌 개수가 아니라 행동에 줘요: 끝까지 하기 · 다시 해서 맞히기(+2, 한 세트 3번까지) · 처음 도전하는 단계(+3) · 별(+5).
   이미 별을 받은 단계를 다시 하면 끝까지 포인트가 절반이에요 */
const calcFinishPts=(n,rep)=>Math.ceil((n>=10?6:4)/(rep?2:1));
const FIX_PTS=2,FIX_MAX=3;
const PTS_RULE='포인트는 맞힌 개수가 아니라 <b>끝까지 하기 · 틀린 문제 다시 맞히기 · 새 단계 도전</b>으로 받아요.';
function effortLine(fixed,fresh){return fixed?`틀린 문제 ${fixed}개를 다시 해서 맞혔어요. 실수를 고치는 게 실력이 느는 길이에요.`:fresh?'새 단계에 도전했어요. 조금 어려운 데 도전할 때 가장 많이 배워요.':'끝까지 해냈어요. 꾸준히 하면 계산이 점점 빨라져요.'}
function ptsLine(L){L=L.filter(x=>x[1]>0);return L.length?`<p class="sum-space pts-why"><b>받은 포인트</b> ${L.map(([t,n])=>`${t} +${n}`).join(' · ')}<br><small class="muted">${PTS_RULE}</small></p>`:''}
/* [T36] 문제 하나 = 주제·단계·seed. 같은 seed면 같은 문제라 ⚑ 신고·📍 위치 보고로 다시 만들 수 있어요(CALC 주제.gen(L, mulberry(seed))) */
function calcQ(T,L,r){const seed=1+Math.floor(r()*999983),mk=sd=>Object.assign({type:'num'},T.gen(L,mulberry(sd)),{tid:T.id,lv:L,seed:sd});
  const q=mk(seed);if(T.id!=='facts')q.regen=()=>mk(1+Math.floor(r()*999983));return q}
/* [T36] 계산 문제 아래 ⚑ 이 문제 이상해요 + 📍 위치 보고에 주제·단계·seed (총정리 2-11) */
function calcReportMount(host,q,label){if(!host||!q)return;const T=CALC.find(t=>t.id===q.tid);
  try{if(typeof HG_LOC!=='undefined'){HG_LOC.set({calcTopic:`${q.tid}${T?'('+T.nm+')':''} ${q.lv||1}단계 · ${label} · CALC.gen(${q.lv||1}, mulberry(${q.seed??'-'}))`});
    HG_LOC.setProb({title:plainQ(q.q),seed:q.seed,ptype:'calc',mode:label,step:0,totalSteps:1})}}catch(e){}
  if(typeof HG_REPORT!=='undefined'&&HG_REPORT.mount)HG_REPORT.mount(host,{lesson:'calc',gen:null,seed:null})}
function drillRun(Q,{onFinish,onAnswer,host=app,label='기초 연산'}={}){Q.forEach(q=>{q.state=null;q.type=q.type||'num'});
  const counted=Q.filter(q=>!q.extra),queue=Q.slice(),log=[];let first=0,fixed=0,busy=false,missRun=0,streak=0;
  const bar=()=>{const cur=queue[0];$('.dbar',host).innerHTML=counted.map(q=>`<i class="${q.state||(q===cur?'cur':'')}"></i>`).join('')};
  const flash=(h,c)=>{const f=$('.dflash',host);f.innerHTML=h;f.className='dflash'+(c?' '+c:'')};
  const again=q=>q.regen?Object.assign(q.regen(),{retry:true,state:null}):Object.assign({},q,{retry:true,state:null,tried:false});
  function ask(){busy=false;if(queue[0]&&queue[0].pre&&queue.length>1)queue.push(queue.shift());   /* ⭐ 미리 도전은 다시 풀 문제까지 다 끝난 맨 뒤에 */
    bar();const q=queue[0];window.__cq=q;window.__cs=null;if(!q){finish();return}
    $('.dNo',host).textContent=q.pre?'⭐ 미리 도전 · 점수에 안 들어가요':q.kw?'낱말 떠올리기':q.extra?'한 번 더':q.retry?'다시 한 번':`${counted.indexOf(q)+1} / ${counted.length}${q.ea&&!q.eaDone?' · 틀린 풀이 찾기':''}`;
    $('.dq',host).innerHTML=q.q;flash('');keyCue(q);const io=$('.dIn',host);io.innerHTML='';stopSpeak();calcReportMount($('.drill',host),q,`${label} ${$('.dNo',host).textContent}`);const sb=$('.dSay',host);if(sb)sb.onclick=()=>speak(sayText(q.q+(q.suffix?` (단위 ${q.suffix})`:'')),sb);
    if(q.ea&&!q.eaDone&&!q.retry){errStage(q,io);return}
    if(missRun>=2&&q.steps&&q.steps.length&&!q.extra&&!q.retry){missRun=0;
      io.innerHTML=`<div class="offer"><p>두 문제 연속으로 어려웠어요. 괜찮아요! 이번 문제는 <b>쪼개서</b> 같이 풀까요?</p><div class="next-row" style="justify-content:center;margin:8px 0 0"><button type="button" class="btn primary oYes">쪼개서 풀기</button><button type="button" class="btn oNo">혼자 해 볼게요</button></div></div>`;
      $('.oYes',io).onclick=()=>{busy=true;q.state='hint';onAnswer&&onAnswer(q,{ok:false,ms:null,counted:true,help:true});help(q,io,true)};$('.oNo',io).onclick=()=>stage(q,io);return}
    stage(q,io)}
  function keyCue(q){let c=$('.dcue',host);if(!c){c=el('<div class="dcue"></div>');$('.dq',host).after(c)}const K=keyFor(q);c.innerHTML='';if(!K||(q.ea&&!q.eaDone))return;
    const chip=()=>{c.innerHTML=`<button type="button" class="kchip" aria-expanded="false">💡 떠올릴 낱말: <b>${K.w}</b></button><div class="kpop" hidden>${K.fig?`<div class="kfigw">${K.fig()}</div>`:''}${K.say}<br>${M_(K.eq)}</div>`;const b=$('.kchip',c);b.onclick=()=>{const p=$('.kpop',c);p.hidden=!p.hidden;b.setAttribute('aria-expanded',String(!p.hidden))}};
    if(q.lv===1&&!q.retry&&!q.extra)chip();else{c.innerHTML='<button type="button" class="kchip ask">💡 무엇을 떠올릴까? (눌러서 보기)</button>';$('.kchip',c).onclick=chip}}
  function errStage(q,io){const E=q.ea,t0=performance.now();
    $('.dq',host).innerHTML=`${q.q}<div class="ea-friend">친구는 이렇게 답했어요: <b>${M_(E.w)}</b> <span class="ea-x" aria-label="틀림">✗</span></div><div class="kq">친구는 어디서 잘못했을까요?</div>`;
    const box=el('<div class="answer"><div class="choices ea-ch"></div></div>'),ch=box.firstChild;io.appendChild(box);
    E.choices.forEach(c=>{const b=el('<button type="button"></button>');b.textContent=c;b.onclick=()=>{if(busy)return;if(performance.now()-t0<1200){flash('먼저 친구의 답을 천천히 살펴봐요.');return}
      busy=true;const ok=c===E.ans;q.eaMiss=!ok;$$('button',ch).forEach(x=>{x.disabled=true;if(x===b)x.classList.add('picked')});
      flash(ok?`맞아요! <span class="kline">${E.m}</span>`:`친구의 실수는 이거예요. <span class="kline">${E.m}</span><br><small>끝에 비슷한 문제가 한 번 더 나와요.</small>`,ok?'ok':'bad');
      const go=()=>{q.eaDone=true;busy=false;$('.dNo',host).textContent=`${counted.indexOf(q)+1} / ${counted.length}`;$('.dq',host).innerHTML=`${q.q}<div class="kq">이제 바른 답을 구해 보세요.</div>`;keyCue(q);stage(q,io)};
      const nb=el('<div class="next-row" style="justify-content:center"><button type="button" class="btn primary">바른 답 구하기 →</button></div>');nb.firstChild.onclick=go;io.appendChild(nb)};ch.appendChild(b)})}
  function stage(q,io){io.innerHTML='';const t0=performance.now();
    if(q.pre){preStage(q,io);return}
    io.appendChild(answerUI({type:q.type,suffix:q.suffix,choices:q.choices,mathChoices:q.mathChoices},v=>{if(busy)return true;const ms=performance.now()-t0,res=check({type:q.type,ans:q.ans},v);
      if(res==='nopi'){flash('π를 붙여서 답해요. 예) 12π','bad');return false}
      if(res==='nosign'){flash('+ 또는 − 부호를 붙여 답해요.','bad');return false}
      busy=true;const counts=!q.retry&&!q.extra;onAnswer&&onAnswer(q,{ok:res===true,ms,counted:counts});
      if(res===true){if(counts){q.state='ok';first++}missRun=0;streak++;queue.shift();if(q.eaMiss&&counts)queue.push(again(q));const fix=q.retry&&!q.extra;if(fix){fixed++;if(fixed<=FIX_MAX)award(FIX_PTS,null,'다시 해서 맞혔어요')}flash(fix?'다시 해서 맞혔어요! 틀린 걸 스스로 고쳤어요.':streak>=3&&streak%3===0?`${streak}문제 연속! 집중력이 좋아요.`:pick(Math.random,PRAISE),'ok');setTimeout(ask,reduced?0:450);return true}
      streak=0;if(counts){q.state='hint';missRun++}const why0=diagnose(q,v);if(why0){log.push(why0);if(counts)recordCalcErr(q.tid,why0)}const K=keyFor(q),why=(why0?`<span class="diag">${why0}</span><br>`:'')+(K?`<span class="kline">💡 ${K.w} · ${K.say}</span><br>`:'');
      if(q.steps&&q.steps.length){flash(`${why||'아쉬워요. '}<b>쪼개서</b> 같이 풀어 봐요.`,'bad');help(q,io,false)}
      else{flash(`${why}정답은 ${M_(fmtAns(q))}.${counts?' 끝에 한 번 더 나와요.':''}`,'bad');queue.shift();if(counts)queue.push(again(q));setTimeout(ask,reduced?0:2600)}
      return true}));
    if(q.steps&&q.steps.length){const hb=el('<p class="dhelp"><button type="button" class="t-mini">도움: 쪼개서 풀기</button></p>');hb.firstChild.onclick=()=>{if(busy)return;busy=true;const counts=!q.retry&&!q.extra;if(counts)q.state='hint';onAnswer&&onAnswer(q,{ok:false,ms:null,counted:counts,help:true});missRun=0;streak=0;flash('');help(q,io,true)};io.appendChild(hb)}}
  /* [T36] ⭐ 미리 도전: 점수에 넣지 않고, 틀려도 빨간 표시 없이 '다음에 배울 칸이에요 → 배우러 가기'만 (총정리 2-4 다) */
  function preStage(q,io){const T=CALC.find(t=>t.id===q.tid);
    io.appendChild(answerUI({type:q.type,suffix:q.suffix,choices:q.choices,mathChoices:q.mathChoices},v=>{if(busy)return true;const res=check({type:q.type,ans:q.ans},v);
      if(res==='nopi'){flash('π를 붙여서 답해요. 예) 12π');return false}
      if(res==='nosign'){flash('+ 또는 − 부호를 붙여 답해요.');return false}
      busy=true;const ok=res===true,msg=q.onPre?q.onPre(ok):'';queue.shift();
      flash(ok?`⭐ 맞았어요! 아직 배우지 않은 칸인데 해냈어요.${msg?` <span class="muted">${msg}</span>`:''}`:`다음에 배울 칸이에요. 정답은 ${M_(fmtAns(q))}. <span class="muted">배우고 나면 쉽게 풀 수 있어요.</span>`,ok?'ok':'pre');
      io.innerHTML=`<div class="next-row" style="justify-content:center">${T?`<a class="btn${ok?'':' primary'}" href="#calc-${T.id}">${T.nm} 배우러 가기</a>`:''}<button type="button" class="btn${ok?' primary':''} dNext">끝내기 →</button></div>`;$('.dNext',io).onclick=ask;return true}))}
  function help(q,io,pre){stepWalk(io,q.steps,{lead:pre?'한 단계씩 계산해요.':'',onDone:()=>{const last=q.steps[q.steps.length-1],same=last.ans===q.ans&&(last.type||'num')===q.type,counts=!q.retry&&!q.extra;
      const next=()=>{queue.shift();if(counts)queue.push(again(q));ask()};
      if(same){flash(`잘했어요! 정답은 ${M_(fmtAns(q))}.${counts?' <span class="muted">비슷한 문제가 끝에 한 번 더 나와요.</span>':''}`,'ok');io.insertAdjacentHTML('beforeend','<div class="next-row" style="justify-content:center"><button type="button" class="btn primary dNext">다음 문제 →</button></div>');$('.dNext',io).onclick=next}
      else{flash('이제 처음 문제의 답을 골라 보세요.');io.innerHTML='';io.appendChild(answerUI({type:q.type,suffix:q.suffix,choices:q.choices,mathChoices:q.mathChoices},v2=>{const c=check({type:q.type,ans:q.ans},v2);if(c===true){flash('맞았어요!','ok');setTimeout(next,reduced?0:600);return true}flash(c==='nopi'?'π를 붙여서 답해요.':'다시 생각해 봐요.');return false}))}}})}
  function finish(){bar();$('.dq',host).innerHTML='';{const rr=$('.drill > .rep-row.hgrep-free',host),dc=$('.dcue',host);if(rr)rr.remove();if(dc)dc.innerHTML=''}$('.dNo',host).textContent='끝!';flash('');const cnt={};log.forEach(m=>{cnt[m]=(cnt[m]||0)+1});const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
    onFinish&&onFinish(first,{tip:top&&top[1]>=2?top[0]:'',total:counted.length,fixed})}
  ask()}
/* ── 화면: 기초 연산 목록 ── */
/* 이번 시험 범위: 좌표평면과 그래프 · 원과 부채꼴 · 입체도형 (구의 겉넓이·부피 제외) = 19차시 범위. 범위가 바뀌면 이 세 줄만 고쳐요
   [T36] 총정리 2-3 나: 좌표·정비례·반비례까지 넓혀 부호 계산 3칸 + 분수 나누기를 넣었어요 */
const EXAM_FOCUS=['pi','frac','fracbase','pow','area','surf','unit','ratio','sub','eq','mul','div','signed','signsub','signmul','fracdiv'];
const EXAM_TAG={pi:'부채꼴·원기둥·원뿔',frac:'부채꼴·원뿔의 겉넓이',fracbase:'뿔의 부피 ⅓',pow:'회전체·원의 넓이',area:'겉넓이',surf:'기둥·뿔의 겉넓이',unit:'부피',ratio:'중심각·호·넓이의 비',sub:'정비례·반비례 식에 넣기',eq:'다면체·정비례 a 구하기',mul:'정비례·부피',div:'그래프·반비례·뿔',
 signed:'좌표 읽기',signsub:'좌표 · 두 점 사이',signmul:'정비례·반비례에서 a 구하기',fracdiv:'반비례 그래프'};
const EXAM_NM='좌표평면과 그래프 ~ 입체도형 (구 제외)';
/* 시험 모드: 기본으로 켜져 있어요. 켜면 기초 연산 목록·오늘의 계산·홈에 시험 범위 계산만 보여요(학생마다 이 기기에 기억) */
const calcExamMode=()=>EXAM_FOCUS.length>0&&lsGet('hangeoreum-calc-exam',true)!==false;
/* 막힌 계산: 시작점 찾기에서 틀렸고 아직 별이 없거나, 연습한 단계에서 80%를 못 넘겨 별을 못 받았어요 */
const calcStruggle=id=>{const s=calcPeek(id),st=NUM(s.stars),b=OBJ(s.best),dr=OBJ(OBJ(DB._calcDiag).res);return(dr[id]===false&&st<1)||Object.keys(b).some(L=>NUM(b[L])<80&&st<+L)};
/* 시험 모드의 '바탕 다지기' 칸: 시험 범위 밖이지만, 막힌 계산의 바탕(연결맵의 앞 칸)이라 열어 두는 칸.
   막힌 칸에서 위로 거슬러 올라가며, 아직 별이 없거나 그 칸도 막혔으면 열고, 그 칸도 막혔으면 한 칸 더 올라가요 */
function examBase(){const S=new Set();if(!calcExamMode())return S;const isEx=id=>EXAM_FOCUS.includes(id),dr=OBJ(OBJ(DB._calcDiag).res);
  const Q=CALC.filter(t=>calcVisible(t)&&calcStruggle(t.id)&&(isEx(t.id)||dr[t.id]===false)).map(t=>t.id);
  const anc=new Set(),up=x=>calcPre(x).forEach(p=>{if(!anc.has(p)){anc.add(p);up(p)}});EXAM_FOCUS.forEach(up);
  Q.filter(id=>!isEx(id)).forEach(id=>{if(anc.has(id)&&!calcDone(id))S.add(id)});
  for(let i=0;i<Q.length;i++)calcPre(Q[i]).forEach(p=>{if(isEx(p)||S.has(p)||calcDone(p))return;const st=calcStruggle(p);if(st||(NUM(calcPeek(p).stars)<1&&dr[p]!==true)){S.add(p);if(st&&!Q.includes(p))Q.push(p)}});
  return S}
const inExam=t=>!calcExamMode()||EXAM_FOCUS.includes(t.id)||examBase().has(t.id);
const examRank=id=>{const i=EXAM_FOCUS.indexOf(id);return i<0?(calcExamMode()&&examBase().has(id)?-1:99):i};
const CALC_GRP=[['solid','원·부채꼴 · 입체도형 핵심 계산','이번 시험 범위(원과 부채꼴·입체도형)에 바로 나오는 계산이에요.'],['mid','중1 핵심 연산','부호·분수·소수·약수와 배수. 정비례·반비례와 부채꼴 계산의 바탕이에요.'],['base','기초 다지기','모든 계산의 바탕이에요. 흔들리는 부분부터 챙겨요.']];
const calcVisible=t=>!SITE.calcGroups||SITE.calcGroups.includes(t.grp);
/* ── [T36] 차시 ↔ 바탕 계산 표 (총정리 2-3 다, 19차시 id) ──
   홈 맨 앞 계산 · 오늘의 계산 '집중할 칸'과 '모자랄 때 채우기' · 미리 도전이 이 표를 봐요.
   (CALC_FOR는 옛 단원 파일들이 덧붙여 쓰는 표라 그대로 두고, 새 기준은 이 표 하나로 정해요) */
const LESSON_BASE_CALC={coord:['signed'],graph:['div'],prop:['sub','mul'],propg:['signmul','eq'],inv:['sub','div'],invg:['signmul','fracdiv'],
 arc:[],cent:['ratio','mul'],sector:['pi','frac'],
 poly:['facts','eq'],regular:['facts','div'],rotation:[],rotprop:['area','pow'],area:['area','surf'],area2:['pi','surf'],volume:['mul','pi'],conearea:['area','surf'],conearea2:['pi','frac'],cone:['fracbase','div']};
/* 지금 배우는 차시: 마지막으로 공부한 차시가 아직 안 끝났으면 그 차시, 아니면 교과서 순서(단원 → 차시 번호)로 안 끝난 첫 차시 (길잡이 차시 칸과 같은 기준) */
function calcLessonOrder(){const chi=l=>{const I=typeof unitOf==='function'?unitOf(l.unit||'solid'):null;return typeof UNITS!=='undefined'&&I?UNITS.findIndex(z=>z[0]===I.ch):0};
  return(typeof LESSONS!=='undefined'?LESSONS:[]).filter(l=>l.ready&&!l.hidden).slice().sort((a,b)=>chi(a)-chi(b)||(a.no-b.no))}
function calcLessonDone(l){try{if(typeof window!=='undefined'&&typeof window.lessonProgressInfo==='function'&&typeof unitActiveTrack==='function')return!!window.lessonProgressInfo(l.id,DB,unitActiveTrack(l.unit||'solid')).isDone}catch(e){}
  return typeof lessonDone==='function'&&lessonDone(l.id)>=(typeof LESSON_REQ==='number'?LESSON_REQ:3)}
function calcCurLesson(){const L=calcLessonOrder();if(!L.length)return null;const last=DB._last&&L.find(l=>l.id===DB._last.id);
  return(last&&!calcLessonDone(last))?last:(L.find(l=>!calcLessonDone(l))||L[L.length-1])}
/* 지금 차시의 바탕 계산 칸. 계산이 없는 차시(호·현, 회전체)는 교과서 순서로 다음 차시 → 앞 차시의 바탕 계산을 빌려요 */
function lessonBaseIds(cur){cur=cur===undefined?calcCurLesson():cur;const ok=id=>{const t=CALC.find(c=>c.id===id);return t&&calcVisible(t)};
  const of=l=>(LESSON_BASE_CALC[l.id]||[]).filter(ok);if(!cur)return[];let ids=of(cur);if(ids.length)return ids;
  const L=calcLessonOrder(),i=L.indexOf(cur);for(let k=1;k<L.length;k++){for(const j of[i+k,i-k]){const l=L[j];if(l&&(ids=of(l)).length)return ids}}return[]}
/* 막힌 계산(차시 따라 풀기의 '계산이 어렵나요?'). 아직 다 익히지 않은 칸이면 살아 있어요 */
const needCalcT=()=>{const n=OBJ(DB._needCalc),t=n.id&&CALC.find(c=>c.id===n.id);return t&&calcVisible(t)&&!calcDone(t.id)?t:null};
/* 선생님이 지금 먼저 하게 할 기초 연산 주제(config의 SITE.calcNow). 비워 두면('' 또는 없음) 지금 배우는 차시에 맞춰 자동이에요 */
const CALC_NOW=typeof SITE.calcNow==='string'?SITE.calcNow:'';
/* [T36] 홈·길잡이 맨 앞 계산 = 오늘의 계산 '집중할 칸': ① 막힌 계산 ② 선생님이 정한 칸 ③ 지금 차시 바탕 계산 중 아직 별이 없는 첫 칸 ④ 미리 도전에서 틀린 칸 */
function calcNowT(){const nd=needCalcT();if(nd)return nd;
  const sel=CALC_NOW&&CALC.find(c=>c.id===CALC_NOW);if(sel&&calcVisible(sel)&&!calcDone(sel.id))return sel;
  const b=lessonBaseIds().map(id=>CALC.find(c=>c.id===id)).find(t=>NUM(calcPeek(t.id).stars)<1&&!diagOk(t.id));if(b)return b;
  const pm=OBJ(DB._calcPre),pt=pm.miss&&CALC.find(c=>c.id===pm.id);return pt&&calcVisible(pt)&&NUM(calcPeek(pt.id).stars)<1?pt:null}
const calcNowWhy=t=>{if(!t)return'';const nd=needCalcT(),n=OBJ(DB._needCalc),L=nd===t&&typeof LESSONS!=='undefined'&&LESSONS.find(l=>l.id===n.from);
  if(nd===t)return`${L?`${L.no}차시 ${L.title}`:'차시'}에서 막혔던 계산`;if(CALC_NOW&&t.id===CALC_NOW)return'선생님이 먼저 하자고 한 계산';
  if(OBJ(DB._calcPre).miss&&OBJ(DB._calcPre).id===t.id&&!lessonBaseIds().includes(t.id))return'미리 도전에서 만난 다음 칸';const c=calcCurLesson();return c?`${c.no}차시 ${c.title}의 바탕 계산`:'지금 차시의 바탕 계산'};
const calcPlan=()=>{const d=OBJ(DB._calcDiag);return Array.isArray(d.plan)?d.plan.filter(id=>CALC.some(t=>t.id===id)):[]};
function calcCard(t,dueIds,plan){const s=calcPeek(t.id),wd=t.ways.filter((w,k)=>OBJ(s.ways)[k]).length,isDue=dueIds.includes(t.id),rec=plan.includes(t.id)&&NUM(s.stars)<1,ex=EXAM_TAG[t.id];
  return`<a class="card calc-card" href="#calc-${t.id}"><span class="calc-tags">${ex?`<i class="ctag exam">시험 · ${ex}</i>`:''}${isDue?'<i class="ctag due">복습</i>':''}${rec?'<i class="ctag rec">추천</i>':''}</span><b>${t.nm}</b>${KEYS[t.id]?`<span class="kw">💡 ${KEYS[t.id].w}</span>`:''}<small>${t.use}</small><span class="calc-prog">${starRow(Math.min(calcLvN(t.id),NUM(s.stars)),calcLvN(t.id))}<small>생각하는 법 ${wd}/${t.ways.length}</small></span></a>`}
/* ── 기초 연산 사다리: 4갈래로 쉬운 칸부터 잇기. 앞 칸이 다음 칸의 바탕이에요 ── */
const CALC_PATHS=[
 {k:'num',nm:'수 감각',ic:'🔢',d:'더하고 빼고, 곱하고 나누는 힘이에요. 모든 계산의 바탕이에요.',ids:['place','add','add2','facts','div','divr','mul','est']},
 {k:'expr',nm:'식 다루기',ic:'🧩',d:'계산 순서를 지키고, 식에 수를 넣고, 거꾸로 풀어요.',ids:['order','sub','eq','surf']},
 {k:'frac',nm:'분수 · 소수 · 비',ic:'🍕',d:'분수의 뜻에서 시작해 약분·통분, 소수, 비까지 이어져요.',ids:['fracbase','mixed','gcd','frac','fracop','fracdiv','fdconv','dec','ratio']},
 {k:'fig',nm:'도형 계산',ic:'📐',d:'제곱, 넓이 공식, π, 단위 바꾸기로 원과 입체도형을 계산해요.',ids:['pow','area','pi','unit']},
 {k:'sign',nm:'정수와 부호',ic:'➕',d:'부호가 있는 수를 더하고, 빼고, 곱하고, 나눠요. 중1 정수와 유리수의 바탕이에요.',ids:['signed','signsub','signmul']}];
const calcPath=id=>{const P=CALC_PATHS.find(p=>p.ids.includes(id));if(!P)return null;const ids=P.ids.filter(x=>{const t=CALC.find(c=>c.id===x);return t&&calcVisible(t)}),i=ids.indexOf(id);return i<0?null:{P,ids,i,prev:ids[i-1]||null,next:ids[i+1]||null}};
const calcNm=id=>(CALC.find(t=>t.id===id)||{}).nm||'';
/* 한 갈래에서 지금 할 칸: 별을 하나도 못 받은 첫 칸(없으면 다 익히지 않은 첫 칸). 시작점 찾기에서 맞힌 칸은 건너뛰어요 */
/* [T36] 미리 도전을 이틀 연속 맞힌 칸(DB._calcSkip[id]=날짜)도 시작점 찾기에서 맞힌 칸처럼 건너뛰어요 */
const diagOk=id=>OBJ(OBJ(DB._calcDiag).res)[id]===true||!!OBJ(DB._calcSkip)[id];
const pathNow=ids=>ids.find(id=>NUM(calcPeek(id).stars)<1&&!diagOk(id))||ids.find(id=>!calcDone(id)&&!diagOk(id))||ids.find(id=>!calcDone(id))||null;
function ladderHTML(P,dueIds,plan,base=examBase()){const exam=calcExamMode(),ids=P.ids.filter(x=>{const t=CALC.find(c=>c.id===x);return t&&calcVisible(t)&&(!exam||EXAM_FOCUS.includes(x)||base.has(x))});if(!ids.length)return'';
  const now=pathNow(ids),done=ids.filter(calcDone).length,start=plan.find(id=>ids.includes(id)&&NUM(calcPeek(id).stars)<1);
  return`<section class="card panel ladder" aria-label="${P.nm} 사다리"><div class="lad-h"><span class="lad-ic" aria-hidden="true">${P.ic}</span><div><h2>${P.nm} <small class="muted">${done} / ${ids.length}칸</small></h2><p class="muted">${P.d}</p></div></div>
   <ol class="lad">${ids.map((id,i)=>{const t=CALC.find(c=>c.id===id),st=calcPeek(id),N=calcLvN(id),n=Math.min(N,NUM(st.stars)),fin=n>=N,isNow=id===now,ex=EXAM_TAG[id],K=KEYS[id];
     return`<li class="${fin?'fin':isNow?'now':''}"><a href="#calc-${id}"><span class="lad-no" aria-hidden="true">${fin?CHECK:i+1}</span><span class="lad-b"><b>${t.nm}</b>${K?`<small class="kw">💡 ${K.w}</small>`:''}<span class="calc-tags">${isNow?'<i class="ctag now">지금 여기</i>':''}${id===start&&!isNow?'<i class="ctag rec">추천</i>':''}${dueIds.includes(id)?'<i class="ctag due">복습</i>':''}${ex?`<i class="ctag exam">${exam?'':'시험 · '}${ex}</i>`:''}${base.has(id)?'<i class="ctag base">바탕 다지기</i>':''}</span></span>${starRow(n,N)}</a></li>`}).join('')}</ol></section>`}
/* ── 기초 계산 연결맵: 칸마다 '먼저 알아야 하는 칸(바탕)'. 사다리와 달리 갈래를 넘나드는 연결까지 담아요 ── */
const CALC_PRE={place:[],add:[],add2:['place','add'],facts:['add'],div:['facts'],divr:['div'],mul:['facts','place'],est:['place','mul'],
 order:['add2','facts'],sub:['order'],eq:['sub','div'],surf:['order','area'],
 fracbase:['div'],mixed:['fracbase','divr'],gcd:['divr'],frac:['fracbase'],fracop:['gcd','mixed'],fracdiv:['frac'],fdconv:['fracbase','place'],dec:['fdconv','add2'],ratio:['gcd','fdconv'],
 pow:['facts'],area:['mul','frac'],pi:['pow','mul'],unit:['place','mul'],
 signed:['add2'],signsub:['signed'],signmul:['signed','facts']};
const CALC_SH={place:'자릿값',add:'10 만들기',add2:'두 자리 ±',facts:'구구단',div:'나눗셈',divr:'나머지',mul:'곱셈 감각',est:'어림',order:'계산 순서',sub:'식에 넣기',eq:'거꾸로',surf:'겉넓이',
 fracbase:'분수의 뜻',mixed:'대·가분수',gcd:'약수·배수',frac:'분수 ×',fracop:'분수 ±',fracdiv:'분수 ÷',fdconv:'분수↔소수',dec:'소수 계산',ratio:'비',pow:'제곱',area:'넓이',pi:'π 계산',unit:'단위',signed:'부호 +',signsub:'부호 −',signmul:'부호 ×÷'};
const PATH_COL={num:'#3b6fd8',expr:'#8a4bd1',frac:'#d9822b',fig:'#2b9a6a',sign:'#d1495b'};
const calcPre=id=>(CALC_PRE[id]||[]).filter(x=>{const t=CALC.find(c=>c.id===x);return t&&calcVisible(t)});
const calcNext=id=>CALC.filter(t=>calcVisible(t)&&calcPre(t.id).includes(id)).map(t=>t.id);
/* 아직 별이 없는 바탕 칸 (바로 앞 칸만) */
const weakPre=id=>calcPre(id).filter(x=>NUM(calcPeek(x).stars)<1);
function calcMapLayout(){const ids=CALC.filter(calcVisible).map(t=>t.id),dep={};
  const d=id=>dep[id]!=null?dep[id]:(dep[id]=calcPre(id).length?1+Math.max(...calcPre(id).map(d)):0);ids.forEach(d);
  const pathOf=id=>CALC_PATHS.findIndex(p=>p.ids.includes(id)),rows=[];ids.forEach(id=>{(rows[dep[id]]=rows[dep[id]]||[]).push(id)});
  const W=96,H=86,pos={};rows.forEach((row,ri)=>{if(ri===0)row.sort((a,b)=>pathOf(a)-pathOf(b));
    else row.sort((a,b)=>{const bx=x=>{const p=calcPre(x);return p.reduce((s,q)=>s+pos[q].x,0)/p.length};return bx(a)-bx(b)||pathOf(a)-pathOf(b)});
    row.forEach((id,k)=>{pos[id]={x:k,y:ri}})});
  const n=Math.max(...rows.map(r=>r.length)),vw=n*W+20;
  rows.forEach(row=>{const off=(vw-row.length*W)/2;row.forEach((id,k)=>{pos[id]={x:off+k*W+W/2,y:24+pos[id].y*H+20}})});
  return{ids,pos,vw,vh:24+rows.length*H+10,W,H}}
function viewCalcMap(){stopSpeak();crumbs.innerHTML=`<span class="sep">›</span><a href="#calc">기초 연산</a><span class="sep">›</span><span>연결맵</span>`;
  const{ids,pos,vw,vh}=calcMapLayout(),exam=calcExamMode(),B=examBase(),nw=84,nh=40;let sel=null;
  const col=id=>PATH_COL[(CALC_PATHS.find(p=>p.ids.includes(id))||{}).k]||'#5a6377';
  const edges=[];ids.forEach(id=>calcPre(id).forEach(p=>edges.push([p,id])));
  const edgeSvg=edges.map(([a,b])=>{const A=pos[a],B=pos[b],y1=A.y+nh/2,y2=B.y-nh/2,m=(y1+y2)/2;return`<path class="me" data-a="${a}" data-b="${b}" d="M${A.x} ${y1} C${A.x} ${m} ${B.x} ${m} ${B.x} ${y2}" marker-end="url(#mArr)"/>`}).join('');
  const nodeSvg=ids.map(id=>{const P=pos[id],st=calcPeek(id),N=calcLvN(id),n=Math.min(N,NUM(st.stars)),fin=n>=N,ex=EXAM_FOCUS.includes(id),bs=B.has(id),dim=exam&&!ex&&!bs;
    return`<g class="mn${fin?' fin':n?' part':''}${dim?' dim':''}${exam&&bs?' base':''}" data-id="${id}" tabindex="0" role="button" aria-label="${calcNm(id)}, 별 ${n}/${N}${ex?', 시험 범위':''}" transform="translate(${P.x-nw/2} ${P.y-nh/2})">
      <rect width="${nw}" height="${nh}" rx="10" style="stroke:${col(id)}"/><rect width="${nw}" height="6" rx="3" style="fill:${col(id)}"/>
      <text x="${nw/2}" y="${n?22:26}" text-anchor="middle" class="mt">${CALC_SH[id]||calcNm(id)}</text>${n?`<text x="${nw/2}" y="35" text-anchor="middle" class="ms">${'★'.repeat(n)}${'☆'.repeat(N-n)}</text>`:''}${exam&&ex?`<circle cx="${nw-4}" cy="4" r="7" class="mx"/><text x="${nw-4}" y="7.5" text-anchor="middle" class="mxt">시</text>`:''}</g>`}).join('');
  app.innerHTML=`<div class="unit-head"><div><h1>연결맵</h1><p>위에 있는 칸이 아래 칸의 <b>바탕</b>이에요. 칸을 누르면 무엇을 먼저 알아야 하고, 다음에 어디로 이어지는지 보여요.</p></div></div>
   <div class="card panel map-card"><p class="map-legend">${CALC_PATHS.map(p=>`<span><i style="background:${PATH_COL[p.k]}"></i>${p.nm}</span>`).join('')}${exam?`<span><i class="lg-ex">시</i>시험 범위</span>${B.size?'<span><i class="lg-base"></i>바탕 다지기(열림)</span>':''}`:''}<span><i class="lg-fin"></i>다 익힘</span></p>
    <p class="map-swipe">옆으로 밀면 다른 칸도 보여요.</p><div class="map-scroll"><svg class="cmap" viewBox="0 0 ${vw} ${vh}" width="${vw}" role="group" aria-label="기초 계산 연결맵"><defs><marker id="mArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ma"/></marker></defs>${edgeSvg}${nodeSvg}</svg></div>
    <div class="map-info" aria-live="polite"><p class="muted" style="margin:0">칸을 하나 눌러 보세요.</p></div></div>
   <div class="next-row" style="justify-content:flex-start"><a class="btn ghost" href="#calc">기초 연산 목록</a></div>`;
  const svg=app.querySelector('.cmap'),info=app.querySelector('.map-info');
  const anc=id=>{const s=new Set(),go=x=>calcPre(x).forEach(p=>{if(!s.has(p)){s.add(p);go(p)}});go(id);return s};
  const chips=a=>a.length?a.map(x=>`<a class="chip" href="#calc-${x}">${calcNm(x)}${calcDone(x)?' ✓':NUM(calcPeek(x).stars)<1?' · 아직':''}</a>`).join(' '):'<span class="muted">없어요. 여기서 바로 시작해요.</span>';
  function pick(id){sel=sel===id?null:id;const A=sel?anc(sel):new Set(),Nx=sel?calcNext(sel):[];
    svg.classList.toggle('focus',!!sel);
    svg.querySelectorAll('.mn').forEach(g=>{const x=g.dataset.id;g.classList.toggle('on',x===sel);g.classList.toggle('up',A.has(x));g.classList.toggle('down',Nx.includes(x))});
    svg.querySelectorAll('.me').forEach(e=>{const a=e.dataset.a,b=e.dataset.b;e.classList.toggle('up',!!sel&&(b===sel||A.has(b))&&(A.has(a)));e.classList.toggle('down',a===sel&&Nx.includes(b))});
    if(!sel){info.innerHTML='<p class="muted" style="margin:0">칸을 하나 눌러 보세요.</p>';return}
    const K=KEYS[sel],pre=calcPre(sel),wk=weakPre(sel);
    info.innerHTML=`<h2 style="margin:0 0 4px">${calcNm(sel)} ${K?`<small class="kw">💡 ${K.w}</small>`:''}</h2>
      <p class="mi-row"><b>먼저 알아야 해요</b> ${chips(pre)}</p><p class="mi-row"><b>다음으로 이어져요</b> ${chips(Nx)}</p>
      ${wk.length?`<p class="lad-tip" style="margin:6px 0 0">아직 별이 없는 바탕이 있어요: <b>${wk.map(calcNm).join(', ')}</b>. 어려우면 그 칸부터 해도 좋아요.</p>`:''}
      <p style="margin:10px 0 0"><a class="btn primary" href="#calc-${sel}">${calcNm(sel)} 연습하기</a></p>`}
  svg.querySelectorAll('.mn').forEach(g=>{g.onclick=()=>pick(g.dataset.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(g.dataset.id)}}});
  /* 좁은 화면: 조금 줄이고, 고른 칸(없으면 가운데)이 보이게 옆으로 밀어 둬요 */
  const box=app.querySelector('.map-scroll'),narrow=box.clientWidth<vw;if(narrow)svg.setAttribute('width',Math.round(Math.max(box.clientWidth,vw*.82)));
  const centerOn=id=>{if(!narrow)return;const k=svg.getBoundingClientRect().width/vw,x=id&&pos[id]?pos[id].x*k:box.scrollWidth/2;box.scrollLeft=Math.max(0,x-box.clientWidth/2)};
  svg.querySelectorAll('.mn').forEach(g=>g.addEventListener('click',()=>centerOn(sel)));
  const start=ids.find(id=>EXAM_FOCUS.includes(id)&&weakPre(id).length===0&&NUM(calcPeek(id).stars)<1)||null;if(start&&exam)pick(start);centerOn(sel)}
/* [T36] 차시에서 '계산이 어렵나요?'로 왔으면 기초 연산 화면 위에 '← ○차시로 돌아가기' (총정리 2-3 마). 하루가 지나면 숨겨요 */
function calcFromLesson(){const n=OBJ(DB._needCalc);if(!n.from||!(Date.now()-NUM(n.at)<864e5))return null;return(typeof LESSONS!=='undefined'&&LESSONS.find(l=>l.id===n.from))||null}
function calcBackBar(){const L=calcFromLesson();return L?`<a class="calc-back" href="#${L.id}-steps">← ${L.no}차시 ${L.title}로 돌아가기</a>`:''}
function viewCalc(){crumbs.innerHTML=`<span class="sep">›</span><span>기초 연산</span>`;stopSpeak();
  const dueIds=dueList().map(t=>t.id),dg=OBJ(DB._calcDiag),plan=calcPlan();
  app.innerHTML=`${calcBackBar()}<div class="unit-head"><div><h1>기초 연산</h1><p>짧게, 자주, 정확하게. <b>생각하는 법</b>을 익히고 쉬운 수부터 연습해요.</p></div></div>
   ${!dg.d?`<a class="card start-card" href="#calc-start"><span><b>처음이라면 여기부터 · 시작점 찾기</b><small>${DIAG.length}문제로 어디서부터 하면 좋을지 찾아 줘요. 시험이 아니에요.</small></span><span class="go" aria-hidden="true">→</span></a>`:''}
   <div class="card panel calc-sum"><div class="stat"><small>모은 별</small><b class="rm">${CALC.filter(t=>calcVisible(t)&&inExam(t)).reduce((n,t)=>n+Math.min(calcLvN(t.id),NUM(calcPeek(t.id).stars)),0)} / ${CALC.filter(t=>calcVisible(t)&&inExam(t)).reduce((n,t)=>n+calcLvN(t.id),0)}</b></div><div class="stat"><small>구구단 익힘</small><b class="rm">${factsKnown()} / 36</b></div><div class="stat"><small>오늘 복습</small><b class="rm">${dueIds.length>2?`2 / ${dueIds.length}`:dueIds.length}</b></div>
    <div class="calc-acts"><a class="btn${dg.d?' primary':''}" href="#drill">오늘의 계산${dueIds.length?` · 복습 ${Math.min(2,dueIds.length)}개`:''}</a>${dg.d?'<a class="btn ghost" href="#calc-start">시작점 다시 찾기</a>':''}</div></div>
   ${dueIds.length>2?`<p class="calc-due">밀린 복습이 ${dueIds.length}개 있지만 괜찮아요! 오늘은 부담 없이 <b>2개만</b> 먼저 챙겨도 충분해요.</p>`:''}
   ${EXAM_FOCUS.length?`<div class="seg exam-mode" role="tablist" aria-label="보기 방식"><button type="button" data-m="1" class="${calcExamMode()?'on':''}">🎯 시험 모드 · ${EXAM_NM}</button><button type="button" data-m="0" class="${calcExamMode()?'':'on'}">전체 사다리</button></div>`:''}
   <a class="card map-link" href="#calc-map"><span><b>🗺 연결맵 보기</b><small>어떤 계산이 어떤 계산의 바탕인지 한눈에 봐요.</small></span><span class="go" aria-hidden="true">→</span></a>
   <p class="lad-intro">${calcExamMode()?`이번 시험에 나오는 계산만 모았어요. 갈래마다 <b>지금 여기</b> 칸부터 해요. 어떤 계산에서 막히면 그 계산의 바탕 칸이 <i class="ctag base">바탕 다지기</i>로 함께 열려요.`:`사다리는 <b>위 칸이 아래 칸의 바탕</b>이에요. 갈래마다 <b>지금 여기</b> 칸부터 하면 돼요. <i class="ctag exam">시험</i> 꼬리표는 이번 시험 범위에 바로 쓰이는 계산이에요.`}</p>
   ${dg.d&&plan.filter(id=>inExam(CALC.find(t=>t.id===id))).length?`<div class="card panel calc-plan"><b>내 추천 순서</b> ${plan.filter(id=>inExam(CALC.find(t=>t.id===id))).map((id,i)=>`<a class="chip" href="#calc-${id}">${i+1}. ${CALC.find(x=>x.id===id).nm}</a>`).join(' ')}</div>`:''}
   <div class="ladders">${(()=>{const B=examBase();return CALC_PATHS.map(P=>ladderHTML(P,dueIds,plan,B)).join('')})()}</div>`;
  app.querySelectorAll('.exam-mode button').forEach(b=>b.onclick=()=>{lsSet('hangeoreum-calc-exam',b.dataset.m==='1');viewCalc()})}
/* ── 곱셈구구 표 ── */
const FLV_NM=['아직','연습 중','빠르게 맞힘','익힘','오래 기억'];
function factGridHTML(){let h='<div class="fgrid-wrap"><table class="fgrid" aria-label="내 구구단 표"><thead><tr><th scope="col">×</th>';for(let b=2;b<=9;b++)h+=`<th scope="col">${b}</th>`;h+='</tr></thead><tbody>';
  for(let a=2;a<=9;a++){h+=`<tr><th scope="row">${a}</th>`;for(let b=2;b<=9;b++){const lv=fs0(fk(a,b)).lv;h+=`<td><button type="button" class="fc f${lv}" data-a="${a}" data-b="${b}" aria-label="${a} 곱하기 ${b}, ${FLV_NM[lv]}">${lv>=2?a*b:''}</button></td>`}h+='</tr>'}
  return h+`</tbody></table></div><p class="flegend">${FLV_NM.map((n,i)=>`<span><i class="fc f${i}"></i>${n}</span>`).join('')}</p><p class="muted" style="font-size:14px;margin:4px 0 0">칸을 누르면 그 곱을 쪼개서 익혀요. 연습에서 <b>빠르고 정확하게</b> 맞힌 날이 쌓이면 칸 색이 진해져요.</p>`}
function factLearn(box,a,b){const x=Math.min(a,b),y=Math.max(a,b),fig=x>=6&&y<=8?svgArray(x,y,{split:5}):y===9&&x!==5?svgArray(x,10,{cross:true}):svgArray(x,y);
  box.innerHTML=`<div class="fl-card"><div class="wayEx"><div class="wayQ">${M_(`${a} × ${b}`)}</div>${fig}</div><div class="flWalk"></div></div>`;
  stepWalk($('.flWalk',box),factSteps(x,y),{lead:'쪼개서 계산해요.',onDone:()=>{const F=DB._facts=OBJ(DB._facts),k=fk(x,y),s=F[k]=OBJ(F[k]);if(!NUM(s.lv)){s.lv=1;save();$$(`.fgrid .fc[data-a="${a}"][data-b="${b}"],.fgrid .fc[data-a="${b}"][data-b="${a}"]`).forEach(c=>{c.className='fc f1'})}
    $('.flWalk',box).insertAdjacentHTML('beforeend',`<div class="feedback ok" style="margin-top:10px">${M_(`${a} × ${b} = ${a*b}`)}. 연습에서 만나면 바로 떠올려 봐요.</div>`)}});
  if(box.scrollIntoView)box.scrollIntoView({block:'nearest',behavior:reduced?'auto':'smooth'})}
/* ── 화면: 주제 하나 ── */
function viewCalcTopic(id){if(id==='start'){viewCalcStart();return}if(id==='map'){viewCalcMap();return}const T=CALC.find(t=>t.id===id);if(!T){location.hash='#calc';return}stopSpeak();
  crumbs.innerHTML=`<span class="sep">›</span><a href="#calc">기초 연산</a><span class="sep">›</span><span>${T.nm}</span>`;
  let L=calcMaxLv(id),CNT=calcLenPref();const LV=T.lv||CALC_LV;
  const draw=()=>{const st=calcState(id),wd=T.ways.filter((w,k)=>st.ways[k]).length;
    app.innerHTML=`${calcBackBar()}<div class="unit-head"><div><h1>${T.nm}</h1><p>어디에 쓰여요? <b>${T.use}</b></p></div><div>${starRow(st.stars,LV.length)}</div></div>
     ${(()=>{const W=calcPath(id);if(!W)return'';const pv=W.prev,nx=W.next;return`<nav class="lad-bar" aria-label="사다리에서 이 칸의 자리"><span class="lad-where">${W.P.ic} ${W.P.nm} 사다리 · <b>${W.i+1}</b> / ${W.ids.length}칸</span><span class="lad-nav">${pv?`<a class="chip" href="#calc-${pv}">← 앞 칸 ${calcNm(pv)}</a>`:''}${nx?`<a class="chip" href="#calc-${nx}">다음 칸 ${calcNm(nx)} →</a>`:''}</span>${(()=>{const wk=weakPre(id);return wk.length&&NUM(calcPeek(id).stars)<1?`<p class="lad-tip">${wk.map(x=>`<a href="#calc-${x}"><b>${calcNm(x)}</b></a>`).join(', ')}${josa(calcNm(wk[wk.length-1]),'이','가').slice(calcNm(wk[wk.length-1]).length)} 이 계산의 바탕이에요. 어렵게 느껴지면 그 칸부터 해도 좋아요. <a href="#calc-map">연결맵</a></p>`:''})()}</nav>`})()}
     ${calcDue(id)?'<p class="calc-due">복습할 때예요! 하루 이틀 지나 다시 떠올리면 더 오래 기억해요.</p>':''}
     ${id==='facts'?`<div class="card panel"><h2 style="margin-top:0">내 구구단 표 <small class="muted" style="font-size:15px">익힘 ${factsKnown()}/36</small></h2>${factGridHTML()}<div class="fLearn"></div></div>`:''}
     ${KEYS[id]?`<div class="card panel kpanel"><h2 style="margin-top:0">핵심 낱말 ${st.key?`<small class="kdone">${CHECK} 이었어요</small>`:''}</h2><p class="muted" style="margin-top:-4px">이 계산을 보면 무엇을 떠올릴까요? 신호 → 낱말 → 그림 → 식으로 이어 봐요.</p>${keyCardHTML(id)}
      <p style="margin:12px 0 0">${canSpeak?'<button type="button" class="say kSay">🔊 듣기</button> ':''}<button type="button" class="btn${st.key?'':' primary'} kGo">낱말 잇기 ${keyRounds(id,mulberry(1)).length}문제</button></p><div class="kHost"></div></div>`:''}
     <div class="card panel"><h2 style="margin-top:0">생각하는 법 <small class="muted" style="font-size:15px">${wd}/${T.ways.length}</small></h2><p class="muted" style="margin-top:-4px">${KEYS[id]&&!st.key?'핵심 낱말을 먼저 이어 보고 시작하면 좋아요. ':''}보기 → 같이 → 혼자 순서로 익혀요.</p>
      <div class="ways">${T.ways.map((w,k)=>`<div class="way ${st.ways[k]?'done':''}" data-k="${k}"><button type="button" class="wayHead" aria-expanded="false"><span class="wn">${k+1}</span><b>${w.t}</b><span class="wst">${st.ways[k]?CHECK:'익히기'}</span></button><div class="wayBody" hidden></div></div>`).join('')}</div></div>
     <div class="card panel"><h2 style="margin-top:0">연습</h2><div class="seg calcLv" role="tablist">${range(LV.length).map(i=>i+1).map(k=>`<button type="button" data-l="${k}" class="${k===L?'on':''}" ${k>calcMaxLv(id)?'disabled':''}>${k}단계${k<=st.stars?' ★':''}</button>`).join('')}</div>
      <p class="muted" style="margin:10px 0 0">${LV[L-1]}${st.best[L]!=null?` · 내 최고 ${NUM(st.best[L])}%`:''}</p>
      ${wd===0&&L===1?'<p class="calc-nudge">처음이라면 위의 <b>생각하는 법</b>을 하나 먼저 익혀요.</p>':''}
      <div class="calc-len"><div class="seg calcCnt" role="tablist"><button type="button" data-n="5" class="${CNT===5?'on':''}">5문제 · 가볍게 (3분)</button><button type="button" data-n="10" class="${CNT===10?'on':''}">10문제 · 탄탄하게</button></div></div>
      <p style="margin:14px 0 0"><button type="button" class="btn primary calcGo">${CNT}문제 시작</button></p></div>
     <div class="next-row" style="justify-content:flex-start"><a class="btn ghost" href="#calc">기초 연산 목록</a></div>`;
    $$('.way',app).forEach(wb=>{const k=+wb.dataset.k,w=T.ways[k],head=$('.wayHead',wb),body=$('.wayBody',wb);
      head.onclick=()=>{const open=body.hidden;stopSpeak();$$('.wayBody',app).forEach(b=>{b.hidden=true;b.innerHTML=''});$$('.wayHead',app).forEach(h=>h.setAttribute('aria-expanded','false'));if(!open)return;
        body.hidden=false;head.setAttribute('aria-expanded','true');
        wayFlow(body,T,w,()=>{const S=calcState(id),firstTime=!S.ways[k];S.ways[k]=1;if(!S.due)S.due=addDays(today(),1);save();if(firstTime)award(2,'calcway:'+id+':'+k);wb.classList.add('done');$('.wst',wb).innerHTML=CHECK})}});
    if(id==='facts')$$('.fgrid .fc',app).forEach(c=>c.onclick=()=>factLearn($('.fLearn',app),+c.dataset.a,+c.dataset.b));
    if(KEYS[id]){const kb=$('.kGo',app);kb.onclick=()=>{kb.hidden=true;keyActivity($('.kHost',app),id,()=>{const S=calcState(id),firstTime=!S.key;S.key=1;save();if(firstTime)award(2,'calckey:'+id);const h=$('.kpanel h2',app);if(h&&!$('.kdone',h))h.insertAdjacentHTML('beforeend',` <small class="kdone">${CHECK} 이었어요</small>`)})};
      const ks=$('.kSay',app);if(ks)ks.onclick=()=>{const K=KEYS[id];speak(sayText(`${K.cue}, ${josa(K.w,'을','를')} 떠올려요. ${K.say}. 예를 들어 ${K.eq}`),ks)}}
    $$('.calcLv button',app).forEach(b=>b.onclick=()=>{L=+b.dataset.l;draw()});
    $$('.calcCnt button',app).forEach(b=>b.onclick=()=>{CNT=+b.dataset.n;lsSet('hangeoreum-calc-len',CNT);draw()});
    $('.calcGo',app).onclick=()=>run()};
  function run(){stopSpeak();const r=mulberry(newSeed());let Q;
    if(id==='facts')Q=factSet(L,r,CNT);
    else{Q=[];const seen=new Set(),mk=()=>calcQ(T,L,r);for(let i=0;i<80&&Q.length<CNT;i++){const q=mk(),k=q.q+'|'+q.ans;if(seen.has(k))continue;seen.add(k);Q.push(q)}
      for(let i=0;i<40&&Q.length<CNT;i++){const q=mk();if(Q.slice(-3).some(x=>x.q===q.q))continue;Q.push(q)}Q=Q.slice(0,CNT)}  /* 문제가 적은 단계는 간격을 두고 다시 묻기 */
    app.innerHTML=`<div class="unit-head"><div><h1>${T.nm} <small class="muted" style="font-size:18px">${L}단계</small></h1><p>${LV[L-1]}</p></div></div>
     <div class="card panel"><div class="drill"><div class="dbar"></div><div class="dmeta"><span class="dNo"></span><span class="dmr">${canSpeak?'<button type="button" class="say dSay" aria-label="문제 읽어 주기">🔊</button>':''}<button type="button" class="t-mini calcStop">그만하기</button></span></div><div class="dq"></div><div class="dflash" aria-live="polite"></div><div class="dIn"></div></div></div>`;
    $('.calcStop',app).onclick=()=>{if(id==='facts')save();draw()};
    drillRun(Q,{label:`${T.nm} ${L}단계 연습`,onAnswer:(q,res)=>{if(q.fact)factRecord(q.fact,res.ok,res.ms)},
      onFinish:(first,info)=>{const st=calcState(id),n=info.total,rep=L<=NUM(st.stars),prev=st.best[L]==null?null:NUM(st.best[L]);st.n++;st.last=today();const pct=Math.round(first*100/n);if(st.best[L]==null||pct>NUM(st.best[L]))st.best[L]=pct;
        const need=Math.ceil(n*0.8),star=first>=need&&L>st.stars;if(star)st.stars=L;calcSchedule(id,Math.round(first*10/n));save();dayBump('calc');const fin=calcFinishPts(n,rep),fresh=!rep&&award(3,'calctry:'+id+':'+L,'새 단계 도전');award(fin,null,rep?'익힌 단계 다시 하기':'끝까지 했어요');if(star)award(5,'calc:'+id+':'+L,`${L}단계 별`);
        const fx=Math.min(NUM(info.fixed),FIX_MAX),vsMe=prev==null?'':pct>prev?`<br>내 최고 기록 ${prev}% → 오늘 ${pct}%. 지난번의 나를 넘었어요!`:`<br>내 최고 기록 ${prev}% · 오늘 ${pct}%`;
        $('.dIn',app).innerHTML=`<div class="feedback ${first>=need?'ok':''}" style="text-align:center"><b>${effortLine(NUM(info.fixed),fresh)}</b><br>처음에 맞힌 문제 <b class="rm">${first}</b> / ${n}${vsMe}<br>${star?`${L}단계 별을 받았어요!${L<LV.length?' 다음 단계가 열렸어요.':' 이 계산은 다 익혔어요!'}`:first>=need?'잘했어요! 이미 받은 별이에요.':`${need}문제 이상 맞히면 별을 받아요. 쪼개서 푼 문제를 떠올리며 한 번 더 해 봐요.`}</div>
          ${(()=>{const bs=calcPre(id).filter(x=>!calcDone(x));if(!(first<need&&bs.length))return'';const L=calcNm(bs[bs.length-1]);return`<p class="sum-tip lad-back"><b>바탕 다지기</b> ${bs.map(x=>`<a href="#calc-${x}">${calcNm(x)}</a>`).join(', ')}${josa(L,'을','를').slice(L.length)} 먼저 다지면 이 계산이 훨씬 쉬워져요.</p>`})()}
          ${ptsLine([[rep?'익힌 단계 다시 하기':'끝까지',fin],['다시 맞힘',fx*FIX_PTS],['새 단계 도전',fresh?3:0],['별',star?5:0]])}
          ${info.tip?`<p class="sum-tip"><b>자주 나온 실수</b> ${info.tip}</p>`:''}
          <p class="sum-space">${id==='facts'?`구구단 표: 빠르게 맞힘 <b>${FACTS.filter(([a,b])=>fs0(fk(a,b)).lv>=2).length}</b>칸 · 익힘 <b>${factsKnown()}</b>칸. 다른 날 한 번 더 빠르게 맞히면 익힘이 돼요.<br>`:''}내일 오늘의 계산에서 다시 만나요. 하루 지나 다시 떠올리면 더 오래 기억해요.</p>
          ${(()=>{const FL=OBJ(DB._needCalc).id===id&&calcFromLesson();if(!FL)return'';if(first>=need){delete DB._needCalc;save()}
            return`<div class="calc-ret"><b>${first>=need?'막혔던 계산을 해냈어요!':'잘 연습했어요.'}</b> 이제 하던 차시로 돌아가요.<a class="btn primary" href="#${FL.id}-steps">${FL.no}차시 ${FL.title}로 돌아가기 →</a></div>`})()}
          <div class="next-row" style="justify-content:center"><button type="button" class="btn calcBack">${T.nm}</button><button type="button" class="btn primary calcAgain">${star&&L<LV.length?'다음 단계':'한 번 더'}</button></div>`;
        if(!$('.calc-ret',app))calcNextNudge($('.dIn',app));if(star)celebrate('');$('.calcBack',app).onclick=()=>draw();$('.calcAgain',app).onclick=()=>{if(star&&L<LV.length)L++;run()}}})}
  draw()}
/* [T21] 기초 연산 한 단계를 끝내면 폭죽 + 오늘의 길잡이에서 아직 안 한 다음 할 일로 안내해요 */
function calcNextNudge(box){if(!box)return;const first=NUM(dayState().c.calc)===1,S=typeof guideSteps==='function'?guideSteps():[],nx=S.find(x=>!x.done&&!/^기초 연산 · /.test(x.t));
  box.insertAdjacentHTML('afterbegin',`<div class="calc-nudge"><b>🎉 ${first?'오늘의 할 일 하나를 끝냈어요!':'한 단계 더 해냈어요!'}</b><span>${nx?`다른 것을 하러 가 볼까요? 다음 할 일은 <b>${nx.t}</b>예요.`:'오늘의 길잡이에 있는 할 일을 모두 했어요. 정말 멋져요!'}</span>
    <span class="cn-go">${nx?`<a class="btn primary" href="${nx.href}">${nx.t} →</a>`:''}<a class="btn ghost" href="#home">오늘의 길잡이 보기</a></span></div>`);
  const n=$('.calc-nudge',box);setTimeout(()=>{if(typeof confettiAt==='function')confettiAt(n,true)},60)}
/* ── 시작점 찾기: 맞았는지 하나씩 알려 주지 않고, 끝나고 추천 순서만 ── */
const DIAG=[['add',1],['add2',2],['facts',1],['facts',2],['facts',3],['div',1],['div',2],['order',1],['order',2],['fracbase',1],['fracbase',2]];
const DIAG_ORDER=['add','add2','facts','div','order','fracbase'];
const DIAG_WHY={add:'10 만들기는 모든 계산의 바탕이에요.',add2:'두 자리 계산은 넓이와 겉넓이를 더할 때 꼭 필요해요.',facts:'곱셈구구가 빨라지면 다른 계산이 훨씬 쉬워져요.',div:'나눗셈은 곱셈을 거꾸로 하는 거예요.',order:'계산 순서를 알면 긴 식도 풀 수 있어요.',fracbase:'뿔과 구의 부피에 분수가 나와요.'};
function viewCalcStart(){stopSpeak();crumbs.innerHTML=`<span class="sep">›</span><a href="#calc">기초 연산</a><span class="sep">›</span><span>시작점 찾기</span>`;
  app.innerHTML=`<div class="unit-head"><div><h1>시작점 찾기</h1><p>시험이 아니에요. ${DIAG.length}문제로 <b>어디서부터</b> 하면 좋을지 찾아요.</p></div></div>
   <div class="card panel"><ul class="calm"><li>모르면 <b>모르겠어요</b>를 눌러도 괜찮아요. 찍지 않는 게 더 도움이 돼요.</li><li>맞았는지는 끝나고 한꺼번에 알려 줘요.</li><li>시간은 재지 않아요. 천천히 해요.</li></ul><p style="margin:16px 0 0"><button type="button" class="btn primary dgGo">시작하기</button></p></div>`;
  $('.dgGo',app).onclick=()=>{const r=mulberry(newSeed()),Q=DIAG.map(([id,L])=>{const T=CALC.find(t=>t.id===id);return Object.assign({type:'num'},id==='facts'?T.gen(L,r,true):T.gen(L,r),{tid:id,lv:L})}),res={},lvRes={};let i=0;
    app.innerHTML=`<div class="unit-head"><div><h1>시작점 찾기</h1><p>천천히, 아는 만큼만 풀어요.</p></div></div><div class="card panel"><div class="drill"><div class="dbar"></div><div class="dmeta"><span class="dNo"></span></div><div class="dq"></div><div class="dflash" aria-live="polite"></div><div class="dIn"></div></div></div>`;
    const rec=(q,ok,ms)=>{res[q.tid]=res[q.tid]!==false&&ok;(lvRes[q.tid]=lvRes[q.tid]||{})[q.lv]=ok;if(q.fact)factRecord(q.fact,ok,ms);i++;const f=$('.dflash',app);f.textContent=i<Q.length?'좋아요, 다음 문제예요.':'';f.className='dflash';setTimeout(ask,reduced?0:500)};
    function ask(){$('.dbar',app).innerHTML=Q.map((q,k)=>`<i class="${k<i?'seen':k===i?'cur':''}"></i>`).join('');if(i>=Q.length){done();return}
      const q=Q[i];window.__cq=q;$('.dNo',app).textContent=`${i+1} / ${Q.length}`;$('.dq',app).innerHTML=q.q;const io=$('.dIn',app);io.innerHTML='';const t0=performance.now();let busy=false;
      io.appendChild(answerUI({type:q.type,suffix:q.suffix,choices:q.choices,mathChoices:q.mathChoices},v=>{if(busy)return true;const c=check({type:q.type,ans:q.ans},v);if(c==='nopi'){$('.dflash',app).textContent='π를 붙여서 답해요.';return false}busy=true;rec(q,c===true,performance.now()-t0);return true}));
      const sk=el('<p class="dhelp"><button type="button" class="t-mini">모르겠어요</button></p>');sk.firstChild.onclick=()=>{if(busy)return;busy=true;rec(q,false,null)};io.appendChild(sk)}
    function done(){const plan=DIAG_ORDER.filter(id=>res[id]===false),good=DIAG_ORDER.filter(id=>res[id]),nm=id=>CALC.find(t=>t.id===id).nm;DB._calcDiag={d:today(),res,lvRes,plan};
      DIAG_ORDER.forEach(id=>{const s=calcState(id),lr=lvRes[id]||{};if(res[id]){s.unlock=calcLvN(id);if(!s.due){s.box=Math.max(s.box,1);s.due=addDays(today(),2)}}else if(lr[1]&&!lr[2]&&!lr[3]){s.unlock=Math.max(s.unlock,2)}else if(lr[1]&&lr[2]&&lr[3]===false){s.unlock=calcLvN(id)}});save();dayBump('diag');award(5,'calcdiag');
      app.innerHTML=`<div class="unit-head"><div><h1>시작점을 찾았어요</h1><p>잘하는 것은 지키고, 흔들리는 것부터 다져요.</p></div></div>
       ${good.length?`<div class="card panel"><h2 style="margin-top:0">잘하고 있어요</h2><p>${good.map(id=>`<span class="chip">${nm(id)}</span>`).join(' ')}</p><p class="muted" style="margin-bottom:0">이 주제들은 오늘의 계산에서 가끔 복습해요.</p></div>`:''}
       <div class="card panel"><h2 style="margin-top:0">${plan.length?'여기부터 해요':'기초가 튼튼해요!'}</h2>
        ${plan.length?`<ol class="dg-plan">${plan.map(id=>`<li><a href="#calc-${id}"><b>${nm(id)}</b><span>${DIAG_WHY[id]}</span></a></li>`).join('')}</ol><p class="muted">하루에 한 주제씩, 생각하는 법부터 익혀요.</p><p style="margin:0"><a class="btn primary" href="#calc-${plan[0]}">${nm(plan[0])} 시작하기</a></p>`
          :'<p>이번 시험 핵심 연산(원과 부채꼴, 입체도형)으로 바로 넘어가요.</p><p style="margin:0"><a class="btn primary" href="#calc-pi">π가 있는 계산 시작하기</a></p>'}</div>
       <div class="next-row" style="justify-content:flex-start"><a class="btn ghost" href="#calc">기초 연산 목록</a></div>`}
    ask()}}
/* ── [T27] 틀린 풀이 찾기: 오늘의 계산 중 1~2문제는 '친구의 틀린 답'을 먼저 보여 줘요.
   어디서 잘못했는지 고르고(같은 주제의 다른 실수들이 보기) → 바른 답을 구해요. 이유를 잘못 고르면 끝에 비슷한 문제가 한 번 더.
   친구의 틀린 답은 생성기의 errs(흔한 실수)에서, 학생이 최근 자주 틀린 주제(DB._calcErrs)부터 골라요 ── */
const eaTxt=m=>String(m).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(),eaHead=m=>eaTxt(m).split(/(?<=\.)\s/)[0];
/* 보기에는 '무엇을 했는지'만 짧게(첫 문장, ~었어요/~했어요 꼴). 고른 뒤 전체 설명(바르게 하는 법)을 보여 줘요 */
const eaDx=h=>/[었았렸했썼뺐셌꿨눴봤웠겼졌]어요\.$/.test(h),EA_OPS=['더했어요.','뺐어요.','곱했어요.','나눴어요.'],EA_FAM=[/더했|더하|\+/,/뺐|빼|−/,/곱|×|²/,/나눴|나누|÷/],EA_SIM=[/지름을 그대로|대신 지름/,/먼저|차례로|괄호/,/빠뜨|나누지 않/],EA_MORE={pi:['반지름에 바로 π를 붙였어요.','반지름 대신 지름을 넣었어요.']},eaPool={};
function eaPoolOf(T,L){const k=T.id+':'+L;if(eaPool[k])return eaPool[k];const S=new Set(),r=mulberry(97);
  for(let m=0;m<40;m++){const g=T.gen(L,r);(g.errs||[]).forEach(x=>{const h=x&&x.m&&eaHead(x.m);if(h&&eaDx(h)&&!/\d/.test(h))S.add(h)})}
  return eaPool[k]=[...S]}
function errFind(q,r){if(!q||q.type==='choice'||(q.type==='sn'&&q.ansText)||!q.errs)return null;
  if(q.tid==='pi'&&NUM(q.lv)>1&&!/반지름/.test(eaTxt(q.q)))return null;/* 지름이 그림에 있는 원 문제는 '지름을 반지름처럼'과 '넓이·둘레 바꿈'이 겹쳐서 빼요 */const T=CALC.find(t=>t.id===q.tid);if(!T)return null;
  const es=q.errs.filter(e=>e&&e.m&&isFinite(e.a)&&Math.abs(e.a-q.ans)>1e-9&&eaDx(eaHead(e.m)));if(!es.length)return null;
  const mine=new Set(Object.values(OBJ(DB._calcErrs)).filter(x=>x&&x.tid===q.tid).map(x=>eaHead(x.m)));
  const e=es.find(x=>mine.has(eaHead(x.m)))||es[Math.floor(r()*es.length)],h0=eaHead(e.m),H=new Set([h0]),ds=[];
  const qt=eaTxt(q.q),eaAsked=h=>{const m=h.match(/^(.+?)(의 개수)?[을를] 구했어요\.$/);return!!m&&qt.includes(m[1])},fam=h=>EA_FAM.filter(f=>f.test(h)),sim=h=>EA_SIM.filter(f=>f.test(h)),f0=fam(h0),isOp=f0.length>0,s0=sim(h0),put=h=>{if(ds.length>=3||H.has(h)||fam(h).some(f=>f0.includes(f))||sim(h).some(f=>s0.includes(f))||(!isOp&&EA_OPS.includes(h))||eaAsked(h))return;H.add(h);s0.push(...sim(h));f0.push(...fam(h));ds.push(h)};
  es.filter(x=>Math.abs(x.a-e.a)>1e-9).forEach(x=>put(eaHead(x.m)));shuffle(r,eaPoolOf(T,q.lv||1)).forEach(put);shuffle(r,EA_MORE[T.id]||[]).forEach(put);if(isOp)shuffle(r,EA_OPS).forEach(put);
  for(let L=1;L<=calcLvN(T.id)&&ds.length<3;L++)if(L!==q.lv)shuffle(r,eaPoolOf(T,L)).forEach(put);if(ds.length<2)return null;
  const w=q.type==='pi'&&e.pi===false?String(e.a)+(q.suffix?' '+q.suffix:''):fmtAns({type:q.type,ans:e.a,suffix:q.suffix});
  return{w,m:e.m,ans:h0,choices:shuffle(r,[h0,...ds])}}
function errFindAdd(Q,r,n){const hot=Object.values(OBJ(DB._calcErrs)),score=q=>hot.filter(x=>x&&x.tid===q.tid).reduce((s,x)=>s+NUM(x.n),0),used=new Set();
  const cand=shuffle(r,Q.filter(q=>!q.extra&&q.errs)).sort((a,b)=>score(b)-score(a));
  for(const q of cand){if(n<=0)break;if(used.has(q.tid))continue;const E=errFind(q,r);if(!E)continue;q.ea=E;used.add(q.tid);n--}}
/* ── [T36] 오늘의 계산 (총정리 2-4): ① 집중할 칸 2문제 + ② 섞기(복습 날이 된 칸 → 해 본 칸) · ③ 모자라면 지금 차시 바탕 계산 · 끝에 ⭐ 미리 도전 1문제
   길잡이에서 오면 6문제 고정(집중 2 + 섞기 4), 메뉴에서 오면 5/10문제를 고를 수 있어요. 같은 칸이 연달아 나오지 않게 섞어요. */
const DRILL_FOCUS=2,DRILL_GUIDE_N=6;
const lvOfT=t=>Math.max(1,Math.min(calcLvN(t.id),NUM(calcPeek(t.id).stars)||1));
/* ⭐ 미리 도전 기록 DB._calcPre = {id, n:맞힌 날 수(1), d:맞힌 날, miss:틀린 날, day:마지막으로 미리 도전을 한 날} */
function preCandidate(focus){const P=OBJ(DB._calcPre),t0=today();if(P.day===t0)return null;   /* 하루 1문제 */
  const fresh=t=>t&&calcVisible(t)&&!calcStarted(t.id)&&!diagOk(t.id);
  if(P.id&&!P.miss&&NUM(P.n)===1&&P.d<t0){const t=CALC.find(c=>c.id===P.id);if(fresh(t))return t}   /* 맞힌 다음 날 같은 칸 한 번 더 */
  const ready=t=>fresh(t)&&t!==focus&&!(P.miss&&P.id===t.id)&&calcPre(t.id).length>0&&calcPre(t.id).every(x=>NUM(calcPeek(x).stars)>=1);
  const lad=CALC_PATHS.flatMap(p=>p.ids).map(id=>CALC.find(c=>c.id===id)).filter(Boolean),base=lessonBaseIds();
  return lad.find(t=>base.includes(t.id)&&ready(t))||lad.find(t=>inExam(t)&&ready(t))||lad.find(ready)||null}
function preResult(id,ok){const P=OBJ(DB._calcPre),t0=today();let msg='';
  if(!ok)DB._calcPre={id,miss:t0,day:t0};
  else if(P.id===id&&!P.miss&&NUM(P.n)===1&&P.d===addDays(t0,-1)){DB._calcSkip=OBJ(DB._calcSkip);DB._calcSkip[id]=t0;DB._calcPre={day:t0};msg='이틀 연속 맞혔어요! 사다리에서 이 칸은 건너뛰어도 돼요.'}
  else{DB._calcPre={id,n:1,d:t0,day:t0};msg='내일 미리 도전에서 한 번 더 확인해요.'}
  save();return msg}
function drillPlan(r,count=DRILL_GUIDE_N,opt={}){const out=[],focus=calcNowT(),nf=focus?Math.min(DRILL_FOCUS,count):0;
  const add=(t,L)=>{let q;for(let k=0;k<6;k++){q=calcQ(t,L,r);if(!out.some(x=>x.q===q.q))break}out.push(q)};
  for(let i=0;i<nf;i++)add(focus,lvOfT(focus));
  const allDue=dueList().filter(t=>inExam(t)&&t!==focus),due=allDue.slice(0,Math.max(0,count-nf));
  due.forEach(t=>add(t,lvOfT(t)));
  const base=lessonBaseIds(),started=shuffle(r,CALC.filter(t=>calcVisible(t)&&t!==focus&&!due.includes(t)&&calcStarted(t.id)&&inExam(t))).sort((a,b)=>base.includes(b.id)-base.includes(a.id));
  for(const t of started){if(out.length>=count)break;add(t,lvOfT(t))}
  /* 모자랄 때: 지금 차시 바탕 계산으로(시험 범위 전체에서 아무거나 채우지 않아요). 처음 보는 칸이면 1단계라 💡 핵심 낱말이 바로 보여요 */
  const fill=base.map(id=>CALC.find(c=>c.id===id));let i=0;
  while(out.length<count&&fill.length&&i<60){const t=fill[i%fill.length];add(t,calcStarted(t.id)?lvOfT(t):1);i++}
  const again=[...new Set(out.map(q=>q.tid))].map(id=>CALC.find(c=>c.id===id)).filter(Boolean);i=0;
  while(out.length<count&&again.length&&i<60){const t=again[i%again.length];add(t,lvOfT(t));i++}
  const basics=EXAM_FOCUS.map(id=>CALC.find(t=>t.id===id)).filter(t=>t&&calcVisible(t));i=0;   /* 차시가 하나도 없는 사이트에서만 */
  while(out.length<count&&basics.length&&i<60){const t=basics[i%basics.length];add(t,lvOfT(t));i++}
  const Q=shuffle(r,out.slice(0,count));for(let pass=0;pass<4;pass++)for(let j=1;j<Q.length;j++)if(Q[j].tid===Q[j-1].tid){const k=Q.findIndex((x,m)=>m>j&&x.tid!==Q[j].tid&&Q[m-1].tid!==Q[j].tid&&(m+1>=Q.length||Q[m+1].tid!==Q[j].tid));if(k>0)[Q[j],Q[k]]=[Q[k],Q[j]]}
  /* [T33] '친구의 틀린 풀이 찾기' · [T36] '이 계산에 떠올릴 낱말은?'(keyQuiz)은 넣지 않아요(선생님 결정) */
  const pt=opt.noPre?null:preCandidate(focus);
  if(pt){const q=calcQ(pt,1,r);q.extra=true;q.pre=true;q.onPre=ok=>preResult(pt.id,ok);Q.push(q)}
  return{Q,due,totalDue:allDue.length,focus:nf?focus:null,pre:pt}}
let DRILL_G=false;   /* 길잡이의 '오늘의 계산'으로 들어왔어요 → 6문제 고정 */
if(typeof document==='object'&&document&&document.addEventListener)document.addEventListener('click',e=>{const a=e.target&&e.target.closest&&e.target.closest('a[data-drill6]');if(a)DRILL_G=true},true);
function viewDrill(){crumbs.innerHTML=`<span class="sep">›</span><span>오늘의 계산</span>`;stopSpeak();
  const g6=DRILL_G;DRILL_G=false;
  const D=DB._drill=DB._drill||{},CNT=g6?DRILL_GUIDE_N:calcLenPref(),tm=!!lsGet('hangeoreum-drill-timer',false),{Q,due,totalDue,focus}=drillPlan(mulberry(newSeed()),CNT);
  const nQ=Q.filter(q=>!q.extra).length,hasPre=Q.some(q=>q.pre),firstWay=focus&&!calcStarted(focus.id)&&focus.ways&&focus.ways.length;
  app.innerHTML=`${calcBackBar()}<div class="unit-head"><div><h1>오늘의 계산</h1><p>${g6?`길잡이 ${nQ}문제 · <b>집중할 칸 ${focus?DRILL_FOCUS:0}</b> + 섞기 ${nQ-(focus?DRILL_FOCUS:0)}`:`섞어서 ${nQ}문제`}${hasPre?' + ⭐ 미리 도전 1':''}. 빠르기보다 <b>정확하게</b>가 먼저예요. 막히면 쪼개서 같이 풀어요.</p></div>
    ${g6?'':`<div class="seg drillCnt" role="tablist"><button type="button" data-n="5" class="${CNT===5?'on':''}">5문제 (3분)</button><button type="button" data-n="10" class="${CNT===10?'on':''}">10문제</button></div>`}</div>
   ${focus?`<p class="drill-due drill-focus"><b>집중할 칸</b> <a class="chip" href="#calc-${focus.id}">${focus.nm}</a> <small class="muted">${calcNowWhy(focus)}</small></p>`:''}
   ${due.length?`<p class="drill-due"><b>오늘 복습</b> ${due.map(t=>`<span class="chip">${t.nm}</span>`).join(' ')}${totalDue>due.length?` <small class="muted">(밀린 복습 ${totalDue}개 중 부담 없이 ${due.length}개만 먼저 해요)</small>`:''}</p>`:''}${!OBJ(DB._calcDiag).d&&!CALC.some(t=>calcStarted(t.id))?'<p class="calc-due">처음이라면 <a href="#calc-start">시작점 찾기</a>를 먼저 해 보세요. 나에게 맞는 문제가 나와요.</p>':''}
   <div class="drillHost"></div>
   <p class="drill-opt"><label><input type="checkbox" class="tmT"${tm?' checked':''}> 시간 재기</label> <span class="muted">· 시간은 내 기록과 비교할 때만 써요.</span></p>`;
  const hostBox=$('.drillHost',app);let t0=performance.now(),timer=null;const fmt=ms=>{const s=Math.round(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  $$('.drillCnt button',app).forEach(b=>b.onclick=()=>{lsSet('hangeoreum-calc-len',+b.dataset.n);viewDrill()});
  $('.tmT',app).onchange=e=>{lsSet('hangeoreum-drill-timer',e.target.checked);const tt=$('.dTime',app);if(tt)tt.hidden=!e.target.checked};
  /* 집중할 칸을 처음 보면: 그 칸의 '생각하는 법'을 보기 → 혼자로 짧게 하고 문제로 들어가요(처음 배울 땐 한 가지, 익힐 땐 섞기) */
  if(firstWay){const w=focus.ways[0];
    hostBox.innerHTML=`<div class="card panel drill-way"><h2 style="margin-top:0">처음 보는 칸이에요 · ${focus.nm}</h2><p class="muted" style="margin-top:-4px">생각하는 법을 짧게 익히고 ${nQ}문제로 들어가요. <button type="button" class="t-mini dwSkip">건너뛰고 바로 풀기</button></p><div class="wayBody"></div></div>`;
    $('.dwSkip',hostBox).onclick=start;
    wayFlow($('.wayBody',hostBox),focus,w,()=>{const S=calcState(focus.id),firstTime=!S.ways[0];S.ways[0]=1;if(!S.due)S.due=addDays(today(),1);save();if(firstTime)award(2,'calcway:'+focus.id+':0')},
      {short:true,after:box=>{if(!box||$('.dwGo',box))return;const b=el(`<div class="next-row" style="justify-content:center;margin-top:8px"><button type="button" class="btn primary dwGo">이제 ${nQ}문제 시작 →</button></div>`);box.appendChild(b);$('.dwGo',b).onclick=start}})}
  else start();
  function start(){stopSpeak();
    hostBox.innerHTML=`<div class="card panel"><div class="drill"><div class="dbar"></div><div class="dmeta"><span class="dNo"></span><span class="dmr"><span class="dTime"${$('.tmT',app).checked?'':' hidden'}>0:00</span>${canSpeak?'<button type="button" class="say dSay" aria-label="문제 읽어 주기">🔊</button>':''}</span></div><div class="dq"></div><div class="dflash" aria-live="polite"></div><div class="dIn"></div></div></div>`;
    t0=performance.now();if(timer)clearInterval(timer);
    timer=setInterval(()=>{const tt=$('.dTime',app);if(!tt){clearInterval(timer);return}tt.textContent=fmt(performance.now()-t0)},500);
    const res={};
    drillRun(Q,{host:hostBox,label:'오늘의 계산',onAnswer:(q,a)=>{if(q.fact)factRecord(q.fact,a.ok,a.ms);if(a.counted&&q.tid)res[q.tid]=(res[q.tid]==='bad'||!a.ok)?'bad':'ok'},
      onFinish:(first,info)=>{clearInterval(timer);const ms=performance.now()-t0,timed=$('.tmT',app)&&$('.tmT',app).checked,up=[],again=[];
        Object.keys(res).forEach(tid=>{if(tid==='facts')return;const s=calcState(tid),nm=CALC.find(t=>t.id===tid).nm;
          if(res[tid]==='bad'){s.box=Math.max(1,s.box-1);s.due=addDays(today(),1);again.push(nm)}else if(calcDue(tid)){s.box=Math.min(5,s.box+1);s.due=addDays(today(),BOX_DAYS[s.box]);up.push(nm)}});
        const need8=Math.ceil(info.total*0.8),isBest=timed&&first>=need8&&(!D.best||ms<D.best);if(isBest)D.best=ms;
        D.last=today();D.lastScore=first;D.runs=(D.runs||0)+1;save();bump('drill');dayBump('drill');if(first>=need8)dayBump('drill8');const fin=calcFinishPts(info.total,false),dayFirst=award(5,'drill:'+today(),'오늘의 계산 첫 완료');award(fin,null,'끝까지 했어요');const fx=Math.min(NUM(info.fixed),FIX_MAX);
        $('.dIn',hostBox).innerHTML=`<div class="feedback ok" style="text-align:center"><b>${effortLine(NUM(info.fixed),false)}</b><br>처음에 맞힌 문제 <b class="rm">${first}</b> / ${info.total}${timed?` · 걸린 시간 <b class="rm">${fmt(ms)}</b>`:''}${isBest?'<br>최고 기록이에요!':''}</div>
          ${up.length?`<p class="sum-space"><b>오래 기억 쪽으로 한 칸</b> ${up.join(', ')} · 다음 복습은 며칠 뒤예요.</p>`:''}${again.length?`<p class="sum-space"><b>내일 한 번 더</b> ${again.join(', ')}</p>`:''}
          ${ptsLine([['끝까지',fin],['다시 맞힘',fx*FIX_PTS],['오늘 첫 완료',dayFirst?5:0]])}
          ${info.tip?`<p class="sum-tip"><b>자주 나온 실수</b> ${info.tip}</p>`:''}
          ${(()=>{const FL=calcFromLesson();return FL?`<div class="calc-ret">이제 하던 차시로 돌아가요.<a class="btn primary" href="#${FL.id}-steps">${FL.no}차시 ${FL.title}로 돌아가기 →</a></div>`:''})()}
          <div class="next-row" style="justify-content:center"><a class="btn" href="#calc">기초 연산</a><button type="button" class="btn primary dAgain">한 번 더</button></div>`;
        $('.dAgain',hostBox).onclick=()=>{DRILL_G=g6;viewDrill()}}})}}
/* ───────── 오늘의 길잡이: 집에서 혼자 해도 순서를 잃지 않게 ───────── */
const CALC_FOR={poly:['add','mul','sub'],types:['sub','eq'],regular:['facts','mul','div'],area:['area','pi','surf','frac','unit']};
const TAB_DO={concept:'미리 보기 (정규 수업 전에)',explore:'더 알아보기 · 탐구 활동',steps:'같이 풀기 1문제',practice:'혼자 풀기 5문제'};
/* [T36] 길잡이: 복습 노트 줄은 빼요(총정리 2-5 — 복습은 [복습 추천] 카드 한 곳). 계산은 '오늘의 계산' 한 줄(2-4 가, 길잡이에서는 6문제 고정).
   막힌 계산·지금 차시 바탕 계산은 오늘의 계산의 '집중할 칸'으로 들어가요. 🌱·🌿 길은 계산 → 차시, 🌳 길은 차시 → 계산(2-6 나) */
function guideSteps(){const S=[],D=dayState();
  const lu=DB._last&&(LESSONS.find(l=>l.id===DB._last.id)||{}).unit,L=LESSONS.filter(l=>l.ready).sort((x,y)=>(y.unit===lu)-(x.unit===lu)),cur=L.find(l=>lessonDone(l.id)<LESSON_REQ),moved=NUM(D.c.steps)+NUM(D.c.prac)+NUM(D.c.explore)>0;
  if(cur){const p=OBJ(DB[cur.id]),tab=!p.concept?'concept':!(NUM(p.steps)>0)?'steps':!(NUM(OBJ(p.prac).solved)>=5)?'practice':'explore';
    S.push({who:(tab==='concept'||tab==='steps')?'T':'S',done:moved,more:true,t:`${cur.no}차시 ${cur.title}`,s:TAB_DO[tab]+(tab==='practice'?` (지금 ${NUM(OBJ(p.prac).solved)}개)`:''),href:'#'+cur.id+(tab==='concept'?'':'-'+tab)})}
  else if(L.length)S.push({done:moved,more:true,t:'열린 차시를 모두 마쳤어요',s:'연습 문제로 실력을 다져요',href:'#'+L[L.length-1].id+'-practice'});
  const dd=OBJ(DB._drill).last===today(),F=calcNowT(),nd=F&&F===needCalcT();
  const row={done:dd,more:true,d6:true,t:'오늘의 계산',s:dd?'오늘 끝냈어요 · 더 하고 싶으면 한 번 더':F?`${nd?calcNowWhy(F)+' · ':''}집중할 칸 ${F.nm} 2 + 섞기 4 · 3~4분`:`섞어서 ${DRILL_GUIDE_N}문제 · 3~4분`,href:'#drill'};
  const G=typeof myGoal==='function'?myGoal():null;if(G&&G.k!=='up')S.unshift(row);else S.push(row);
  return S}
/* [T21] '선생님과 함께 / 혼자 하기' 나누기는 뺐어요(선생님 의견: 혼자 하나 같이 하나 비슷해요). 위에서부터 한 줄로 보여요 */
function guideHTML(){const S=guideSteps(),ci=S.findIndex(x=>!x.done),n=S.filter(x=>x.done).length;
  return`<div class="g-head"><b class="t">오늘의 길잡이</b><span class="k">${n===S.length?'오늘 할 일을 다 했어요!':'위에서부터 하나씩 해 봐요'} · ${n}/${S.length}</span></div>
  <ol class="gsteps">${S.map((x,i)=>`<li class="${x.done?'done':i===ci?'cur':''}"><span class="gn">${x.done?CHECK:i+1}</span><span class="gt"><b>${x.t}</b><small>${x.s}</small></span>${x.done&&!x.more?'':`<a class="btn ${i===ci?'primary':'ghost'}" href="${x.href}"${x.d6?' data-drill6="1"':''}>${x.done?'더 하기':i===ci?'시작':'하기'}</a>`}</li>`).join('')}</ol>`}

