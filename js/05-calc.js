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
function calcState(id){const C=DB._calc=OBJ(DB._calc);const s=C[id]=OBJ(C[id]);s.stars=Math.min(3,NUM(s.stars));s.unlock=Math.min(3,Math.max(1,NUM(s.unlock)||1));s.best=OBJ(s.best);s.n=NUM(s.n);s.ways=OBJ(s.ways);s.box=Math.min(5,NUM(s.box));if(typeof s.due!=='string')s.due='';return s}
const calcMaxLv=id=>{const s=calcPeek(id);return Math.min(3,Math.max(NUM(s.stars)+1,NUM(s.unlock)||1))};
const calcPeek=id=>OBJ(OBJ(DB._calc)[id]);
const calcStars=()=>CALC.reduce((a,t)=>a+Math.min(3,NUM(calcPeek(t.id).stars)),0);
const calcStarted=id=>{const s=calcPeek(id);return NUM(s.stars)>0||NUM(s.n)>0||NUM(s.box)>0||Object.keys(OBJ(s.ways)).length>0};
const calcDue=id=>{if(id==='facts'||!calcStarted(id))return false;const d=calcPeek(id).due;return!d||d<=today()};
const dueList=()=>CALC.filter(t=>calcDue(t.id)).sort((a,b)=>String(calcPeek(a.id).due||'').localeCompare(String(calcPeek(b.id).due||'')));
function calcSchedule(id,score){const s=calcState(id);if(score>=8){s.box=Math.min(5,s.box+1);s.due=addDays(today(),BOX_DAYS[s.box])}else{s.box=score>=5?Math.max(1,s.box):1;s.due=addDays(today(),1)}}
const starRow=n=>`<span class="stars" aria-label="별 ${n}개">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}">★</i>`).join('')}</span>`;
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
 {id:'add',grp:'base',nm:'덧셈·뺄셈',use:'여러 넓이를 모두 더하는 겉넓이 계산',lv:['1단계 · 10을 넘는 한 자리 덧셈·뺄셈','2단계 · 두 자리와 한 자리','3단계 · 두 자리끼리'],
  ways:[{t:'10 만들어 더하기',idea:`${M_('8 + 5')}는 8에 2를 먼저 더해 <b>10을 만들고</b>, 남은 3을 더해요.`,
     ex(r){const a=ri(r,6,9),b=ri(r,11-a,9),need=10-a,rest=b-need;return{q:M_(`${a} + ${b}`),fig:svgTenFrame(a,b),ans:a+b,
       steps:[S_(`${J(a,'이','가')} 10이 되려면?`,M_(`10 − ${a}`),need),S_(`${b}에서 ${J(need,'을','를')} 쓰고 남은 수`,M_(`${b} − ${need}`),rest),S_('10과 남은 수',M_(`10 + ${rest}`),a+b)]}},
     why:{q:'왜 먼저 10을 만들까요?',choices:['10에 더하는 건 바로 할 수 있어서','10이 가장 큰 수라서','8이 짝수라서'],ans:0,ok:'10 + 3은 바로 13이에요. 10 묶음이 계산을 쉽게 해 줘요.'}},
   {t:'자리끼리 더하기',idea:`${M_('47 + 38')}은 <b>십의 자리끼리</b>(40 + 30), <b>일의 자리끼리</b>(7 + 8) 더한 다음 합쳐요.`,
     ex(r){const a=ri(r,2,6)*10+ri(r,3,9),b=ri(r,1,3)*10+ri(r,2,9),aT=a-a%10,bT=b-b%10,o=a%10+b%10;return{q:M_(`${a} + ${b}`),fig:svgBlocks(a,b),ans:a+b,
       steps:[S_('십의 자리끼리',M_(`${aT} + ${bT}`),aT+bT),S_('일의 자리끼리',M_(`${a%10} + ${b%10}`),o),S_('합쳐요',M_(`${aT+bT} + ${o}`),a+b)]}},
     why:{q:`${M_('47')}의 4는 실제로 얼마일까요?`,choices:['40','4','47'],ans:0,ok:'십의 자리 4는 10이 4개, 40이에요.'}},
   {t:'빼기는 수직선에서 뛰어 내려가기',idea:`${M_('52 − 27')}은 52에서 <b>20을 먼저</b> 뛰어 내려가고(32), 다시 <b>7을</b> 뛰어 내려가요(25).`,
     ex(r){const aT=ri(r,4,9)*10,a1=ri(r,0,5),a=aT+a1,bT=ri(r,1,aT/10-1)*10,b1=ri(r,a1+1,9),b=bT+b1;return{q:M_(`${a} − ${b}`),fig:svgJumps(a,[bT,b1]),ans:a-b,
       steps:[S_(`먼저 ${bT}만큼`,M_(`${a} − ${bT}`),a-bT),S_(`다시 ${b1}만큼`,M_(`${a-bT} − ${b1}`),a-b)]}},
     why:{q:`${M_('27')}을 왜 20과 7로 나눠서 뺄까요?`,choices:['몇십을 빼는 건 쉬워서','7이 더 커서','27은 그냥 뺄 수 없어서'],ans:0,ok:'52 − 20처럼 몇십을 빼면 십의 자리만 바뀌어요.'}}],
   gen(L,r){const noCarry=r()<0.25;
    if(L===1){if(r()<0.5){
       if(noCarry){const a=ri(r,2,7),b=ri(r,1,9-a);return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_('10을 넘지 않아요 · 바로 더해요',M_(`${a} + ${b}`),a+b)],errs:[E_(a+b+10,'합이 10을 넘지 않아서 받아올림이 없어요.')]}}
       const a=ri(r,4,9),b=ri(r,11-a,9),need=10-a,rest=b-need;
       return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_(`${J(a,'이','가')} 10이 되려면?`,M_(`10 − ${a}`),need),S_(`${b}에서 ${J(need,'을','를')} 쓰고 남은 수`,M_(`${b} − ${need}`),rest),S_('10과 남은 수',M_(`10 + ${rest}`),a+b)],
         errs:[E_(a+b-10,'10을 빠뜨렸어요. 10을 만들고 남은 수를 더해요.'),E_(a+b+1,'하나 차이예요. 10을 만들어서 다시 세어 봐요.'),E_(a+b-1,'하나 차이예요. 10을 만들어서 다시 세어 봐요.')]}}
     if(noCarry){const a1=ri(r,3,9),a=10+a1,b=ri(r,1,a1-1);return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_('일의 자리끼리 바로 빼요',M_(`${a1} − ${b}`),a1-b),S_('10과 합쳐요',M_(`10 + ${a1-b}`),a-b)],errs:[E_(a-b-10,'받아내림이 필요 없어요. 일의 자리에서 바로 뺄 수 있어요.')]}}
     const a1=ri(r,1,8),a=10+a1,b=ri(r,a1+1,9),rest=b-a1;
     return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_(`${a}에서 ${J(a1,'을','를')} 빼면`,M_(`${a} − ${a1}`),10),S_(`${b}에서 ${J(a1,'을','를')} 썼으니 남은 수`,M_(`${b} − ${a1}`),rest),S_('10에서 남은 수를 빼요',M_(`10 − ${rest}`),a-b)],
       errs:[E_(b-a1,`일의 자리에서 거꾸로 뺐어요(${b} − ${a1}). ${J(a,'에서','에서')} ${J(b,'을','를')} 빼야 해요. 10을 이용해요.`),E_(a-b+1,'하나 차이예요. 10을 이용해서 다시 해 봐요.'),E_(a-b-1,'하나 차이예요. 10을 이용해서 다시 해 봐요.')]}}
    if(L===2){if(r()<0.5){
       if(noCarry){const aT=ri(r,2,8)*10,a1=ri(r,1,6),b=ri(r,1,9-a1),a=aT+a1;return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_('일의 자리끼리 더해요',M_(`${a1} + ${b}`),a1+b),S_('십의 자리와 합쳐요',M_(`${aT} + ${a1+b}`),a+b)],errs:[E_(a+b+10,'받아올림이 없는 계산이에요. 일의 자리 합이 10보다 작아요.')]}}
       const a=ri(r,2,8)*10+ri(r,3,9),b=ri(r,11-a%10,9),up=a-a%10+10,need=up-a,rest=b-need;
       return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_(`${J(a,'이','가')} ${J(up,'이','가')} 되려면?`,M_(`${up} − ${a}`),need),S_(`${b}에서 ${J(need,'을','를')} 쓰고 남은 수`,M_(`${b} − ${need}`),rest),S_('더해요',M_(`${up} + ${rest}`),a+b)],
         errs:[E_(a-a%10+(a%10+b)%10,'받아올림을 빠뜨렸어요. 일의 자리 합이 10을 넘으면 십의 자리가 1 커져요.')]}}
     if(noCarry){const aT=ri(r,2,9)*10,a1=ri(r,4,9),b=ri(r,1,a1-1),a=aT+a1;return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_('일의 자리끼리 바로 빼요',M_(`${a1} − ${b}`),a1-b),S_('십의 자리와 합쳐요',M_(`${aT} + ${a1-b}`),a-b)],errs:[E_(a-b-10,'받아내림이 필요 없어요. 일의 자리끼리 바로 빼요.')]}}
     const a=ri(r,2,9)*10+ri(r,1,5),o=a%10,b=ri(r,o+1,9),dn=a-o,rest=b-o;
     return{q:M_(`${a} − ${b}`),ans:a-b,steps:[S_(`${a}에서 ${J(o,'을','를')} 빼면`,M_(`${a} − ${o}`),dn),S_(`${b}에서 ${J(o,'을','를')} 썼으니 남은 수`,M_(`${b} − ${o}`),rest),S_('남은 수를 더 빼요',M_(`${dn} − ${rest}`),a-b)],
       errs:[E_(dn+rest,'일의 자리에서 거꾸로 뺐어요. 몇십에서 빌려 와야 해요.')]}}
    if(r()<0.5){
      if(noCarry){const aT=ri(r,2,6)*10,a1=ri(r,1,6),bT=ri(r,1,3)*10,b1=ri(r,1,9-a1),a=aT+a1,b=bT+b1;return{q:M_(`${a} + ${b}`),ans:a+b,steps:[S_('십의 자리끼리',M_(`${aT} + ${bT}`),aT+bT),S_('일의 자리끼리',M_(`${a1} + ${b1}`),a1+b1),S_('합쳐요',M_(`${aT+bT} + ${a1+b1}`),a+b)],errs:[E_(a+b+10,'받아올림이 없는 계산이에요. 일의 자리 합이 10을 넘지 않아요.')]}}
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
 {id:'est',grp:'base',nm:'어림하기',use:'계산한 답이 맞는지 확인할 때',lv:['1단계 · 가까운 몇십','2단계 · 곱을 어림하기','3단계 · 맞는 계산 고르기'],
  ways:[{t:'가까운 몇십으로 바꿔 어림하기',idea:`${M_('29 × 4')}는 29를 <b>가까운 30</b>으로 바꾸면 ${M_('30 × 4 = 120')}쯤이에요.`,
     ex(r){const R=ri(r,2,9)*10,a=R+pick(r,[-2,-1,1,2]),b=ri(r,3,9);return{q:`${M_(`${a} × ${b}`)}${J(b,'은','는').slice(String(b).length)} 약 얼마?`,fig:svgRound(a,R),ans:R*b,steps:[S_(`${a}에 가장 가까운 몇십은?`,'',R),S_('어림한 곱',M_(`${R} × ${b}`),R*b)]}},
     why:{q:'어림하기는 언제 쓰면 좋을까요?',choices:['계산한 답이 맞는지 빨리 확인할 때','정확한 답이 꼭 필요할 때','답을 외울 때'],ans:0,ok:'어림한 값과 많이 다르면 계산을 다시 확인해요.'}},
   {t:'답이 말이 되는지 확인하기',idea:`${M_('48 × 5')}를 계산했더니 2400이 나왔다면? 어림하면 ${M_('50 × 5 = 250')}쯤이니까 <b>잘못 계산했어요</b>.`,
     ex(r){const R=ri(r,3,9)*10,a=R+pick(r,[-2,-1,1,2]),b=ri(r,3,8),w=a*b*10,ch=['맞아요','틀렸어요'];return{q:`${M_(`${a} × ${b} = ${w}`)}${J(w,'이라고','라고').slice(String(w).length)} 계산했어요. 맞을까요?`,ans:'틀렸어요',type:'choice',choices:ch,
       steps:[S_(`${a}에 가장 가까운 몇십은?`,'',R),S_('어림한 곱',M_(`${R} × ${b}`),R*b),S_(`${w}과 ${R*b}을 비교하면 계산은?`,'','틀렸어요','choice',ch)]}},
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
   const errs=['F','E','V'].filter(x=>x!==pp&&Ty[x](n)!==Ty[pp](n)).map(x=>E_(Ty[x](n),`${PART[x]}의 개수를 구했어요. ${PART[pp]}는 ${M_(f)}개예요.`));
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
   if(L===2){const a=ri(r,2,3),b=ri(r,1,4),c=a*n+b,errs=[E_(c-b,'빼기만 했어요. 그다음 나누기도 해요.')];if((c+b)%a===0)errs.push(E_((c+b)/a,`+ ${b}를 되돌릴 때는 빼요.`));if(c%a===0)errs.push(E_(c/a-b,`나누기를 먼저 했어요. 나중에 한 + ${b}부터 되돌려요.`));
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
 {id:'pi',grp:'solid',nm:'π가 있는 계산',use:'원과 부채꼴(호·넓이), 원기둥·원뿔·구',lv:['1단계 · π끼리 더하고 빼기','2단계 · 원의 둘레와 넓이','3단계 · 원기둥의 부피와 옆넓이'],
  ways:[{t:'π는 단위처럼',idea:`${M_('12π + 8π')}는 "사과 12개 + 사과 8개"처럼 생각해요. <b>π 앞의 수끼리</b> 계산하고 π는 그대로 붙여요.`,
     ex(r){const a=ri(r,3,15),b=ri(r,2,9);return{q:M_(`${a}π + ${b}π`),ans:a+b,type:'pi',steps:[S_('π 앞의 수끼리 더해요',M_(`${a} + ${b}`),a+b),S_('π를 붙여서 답해요 (π 단추)',M_(`${a+b} × π`),a+b,'pi')]}},
     why:{q:`${M_('12π + 8π')}를 사과로 바꿔 말하면?`,choices:['사과 12개 + 사과 8개','사과 12개 × 사과 8개','사과 20개 × 2'],ans:0,ok:'π를 하나의 물건처럼 세면 20π예요.'}},
   {t:'제곱 먼저, π는 마지막에',idea:`${M_('π × 3²')}는 <b>3² = 9를 먼저</b> 하고 π를 붙여 ${M_('9π')}. ${M_('3 × 2 = 6')}으로 하면 틀려요.`,
     ex(r){const a=ri(r,2,7);return{q:`반지름 ${M_(a+' cm')}인 원의 넓이 ${M_(`π × ${a}²`)}`,ans:a*a,type:'pi',suffix:'cm²',steps:[S_('제곱 먼저',M_(`${a} × ${a}`),a*a),S_('π를 붙여요',M_(`${a*a} × π`),a*a,'pi')]}},
     why:{q:`${M_('π × 3²')}에서 먼저 할 것은?`,choices:['3² = 9','π × 3','3 × 2'],ans:0,ok:'제곱 먼저 하고 π는 마지막에 붙여요.'}}],
  gen(L,r){if(L===1){const k=ri(r,0,2);if(k===0){const a=ri(r,2,15),b=ri(r,2,10);return{q:M_(`${a}π + ${b}π`),ans:a+b,type:'pi',steps:[S_('수끼리 더해요',M_(`${a} + ${b}`),a+b),S_('π를 붙여요',M_(`${a+b} × π`),a+b,'pi')],errs:[E_(a*b,'곱했어요. π 앞의 수끼리 더해요.',true)]}}
     if(k===1){const a=ri(r,10,20),b=ri(r,2,9);return{q:M_(`${a}π − ${b}π`),ans:a-b,type:'pi',steps:[S_('수끼리 빼요',M_(`${a} − ${b}`),a-b),S_('π를 붙여요',M_(`${a-b} × π`),a-b,'pi')],errs:[E_(a+b,'더했어요. 빼기예요.',true)]}}
     const a=ri(r,2,5),b=ri(r,2,9);return{q:M_(`${a} × ${b}π`),ans:a*b,type:'pi',steps:[S_('수끼리 곱해요',M_(`${a} × ${b}`),a*b),S_('π를 붙여요',M_(`${a*b} × π`),a*b,'pi')],errs:[E_(a+b,'더했어요. 곱해요.',true)]}}
   if(L===2){const rr=ri(r,2,8);if(r()<0.5)return{q:`반지름 ${M_(rr+' cm')}인 원의 둘레<br>${M_('2 × π × '+rr)}`,ans:2*rr,type:'pi',suffix:'cm',steps:[S_('수끼리 곱해요',M_(`2 × ${rr}`),2*rr),S_('π를 붙여요',M_(`${2*rr} × π`),2*rr,'pi')],errs:[E_(rr,'2를 곱하지 않았어요.',true),E_(rr*rr,'넓이 공식을 썼어요. 둘레는 2 × π × 반지름이에요.',true)]};
     return{q:`반지름 ${M_(rr+' cm')}인 원의 넓이<br>${M_(`π × ${rr}²`)}`,ans:rr*rr,type:'pi',suffix:'cm²',steps:[S_('제곱 먼저',M_(`${rr} × ${rr}`),rr*rr),S_('π를 붙여요',M_(`${rr*rr} × π`),rr*rr,'pi')],errs:[E_(2*rr,`${M_(`${rr} × 2`)}를 했어요. ${M_(`${rr}²`)}${J(rr,'은','는').slice(String(rr).length)} ${M_(`${rr} × ${rr}`)}${IYs(rr)}.`,true)]}}
   const rr=ri(r,2,5),h=ri(r,2,6);if(r()<0.5)return{q:`원기둥의 부피<br>${M_(`π × ${rr}² × ${h}`)}`,ans:rr*rr*h,type:'pi',suffix:'cm³',steps:[S_('제곱 먼저',M_(`${rr} × ${rr}`),rr*rr),S_('높이를 곱해요',M_(`${rr*rr} × ${h}`),rr*rr*h),S_('π를 붙여요',M_(`${rr*rr*h} × π`),rr*rr*h,'pi')],errs:[E_(2*rr*h,'제곱을 × 2로 했어요.',true),E_(rr*h,'제곱을 빠뜨렸어요.',true)]};
   return{q:`원기둥의 옆넓이<br>${M_(`2 × π × ${rr} × ${h}`)}`,ans:2*rr*h,type:'pi',suffix:'cm²',steps:[S_('수끼리 곱해요',M_(`2 × ${rr} × ${h}`),2*rr*h),S_('π를 붙여요',M_(`${2*rr*h} × π`),2*rr*h,'pi')],errs:[E_(rr*h,'2를 빠뜨렸어요.',true)]}}},
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
 {id:'fracop',grp:'mid',nm:'분수 더하기·빼기·나누기',use:'유리수의 사칙연산과 일차방정식',lv:['1단계 · 분모가 같은 분수','2단계 · 통분해서 더하고 빼기','3단계 · 분수 나누기(역수)'],
  ways:[{t:'통분해서 분모 맞추기',idea:`${FR(1,2)} + ${FR(1,4)}는 조각 크기가 달라요. <b>분모를 같게(통분)</b> 만든 뒤 분자끼리 더해요.`,
     ex(r){const[d1,d2]=pick(r,[[2,4],[2,6],[3,6],[4,8]]),m=d2/d1,n1=1,n2=1,nn=n1*m+n2,g=gcd_(nn,d2),p=nn/g,q=d2/g;
       return{q:`${FR(n1,d1)} + ${FR(n2,d2)}`,fig:svgBars(n1*m,d2,n1,d1),ans:p/q,type:'sn',ansText:q===1?String(p):`${p}/${q}`,
         steps:[S_(`분모를 ${d2}로 통분 · ${FR(n1,d1)}의 새 분자`,M_(`${n1} × ${m}`),n1*m),S_('분자끼리 더해요',M_(`${n1*m} + ${n2}`),nn),S_('분수로 답해요 ( / 단추 사용 )','',p/q,'sn')]}},
     why:{q:`${FR(1,2)} + ${FR(1,4)}에서 왜 통분을 할까요?`,choices:['조각 크기를 같게 맞춰야 더할 수 있어서','분모끼리 더하기 위해서','숫자를 크게 만들려고'],ans:0,ok:'조각 크기(분모)가 같아야 몇 조각인지 바로 더할 수 있어요.'}},
   {t:'분수 나누기는 뒤집어 곱하기',idea:`${FR(1,2)} ÷ ${FR(1,4)}는 ÷ 뒤의 분수를 <b>뒤집어서(역수) 곱해요</b>. ${FR(1,2)} × ${FR(4,1)} = 2.`,
     ex(r){const a=ri(r,1,3),b=pick(r,[2,3,4]),c=pick(r,[1,2]),d=b*ri(r,1,2),num=a*d,den=b*c,g=gcd_(num,den),p=num/g,q=den/g;
       return{q:`${FR(a,b)} ÷ ${FR(c,d)}`,ans:p/q,type:'sn',ansText:q===1?String(p):`${p}/${q}`,
         steps:[S_(`뒤 분수 ${FR(c,d)}를 뒤집으면 분자는?`,'',d),S_('분자끼리 곱해요',M_(`${a} × ${d}`),num),S_('분모끼리 곱해요',M_(`${b} × ${c}`),den),S_('약분한 답은?','',p/q,'sn')]}},
     why:{q:`${FR(2,3)} ÷ ${FR(4,5)}를 곱셈으로 바꾸면?`,choices:[`${2}/${3} × ${5}/${4}`,`${3}/${2} × ${4}/${5}`,`${2}/${3} × ${4}/${5}`],ans:0,ok:'나누는 수(뒤의 분수)만 위아래를 뒤집어 곱해요.'}}],
  gen(L,r){
   if(L===1){const d=pick(r,[4,5,6,8,9]);
     if(r()<0.5){const a=ri(r,1,d-2),b=ri(r,1,d-a),s=a+b,g=gcd_(s,d),p=s/g,q=d/g,at=q===1?String(p):`${p}/${q}`;
       return{q:`${FR(a,d)} + ${FR(b,d)}`,ans:p/q,type:'sn',ansText:at,steps:[S_('분모는 그대로, 분자끼리 더해요',M_(`${a} + ${b}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
         errs:[E_((a+b)/(2*d),'분모끼리 더했어요. 분모는 그대로 두고 분자만 더해요.')]}}
     const a=ri(r,2,d-1),b=ri(r,1,a-1),s=a-b,g=gcd_(s,d),p=s/g,q=d/g,at=q===1?String(p):`${p}/${q}`;
     return{q:`${FR(a,d)} − ${FR(b,d)}`,ans:p/q,type:'sn',ansText:at,steps:[S_('분모는 그대로, 분자끼리 빼요',M_(`${a} − ${b}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
       errs:[E_((a+b)/d,'더했어요. 빼기예요.')]}}
   if(L===2){const[d1,d2]=pick(r,[[2,4],[2,6],[3,6],[2,3],[3,4],[4,6]]),cm=lcm_(d1,d2),m1=cm/d1,m2=cm/d2;
     if(r()<0.5){const n1=ri(r,1,d1-1),n2=ri(r,1,d2-1),s=n1*m1+n2*m2,g=gcd_(s,cm),p=s/g,q=cm/g,at=q===1?String(p):`${p}/${q}`;
       return{q:`${FR(n1,d1)} + ${FR(n2,d2)}`,ans:p/q,type:'sn',ansText:at,
         steps:[S_(`공통분모는? (${d1}와 ${d2}의 최소공배수)`,'',cm),S_(`통분한 분자의 합 (${n1*m1} + ${n2*m2})`,M_(`${n1*m1} + ${n2*m2}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
         errs:[E_((n1+n2)/(d1+d2),'분모끼리, 분자끼리 그냥 더했어요. 통분해서 분모를 맞춰요.')]}}
     let n1=ri(r,1,d1-1),n2=ri(r,1,d2-1);if(n1*m1<=n2*m2){[n1,n2]=[n2,n1];const t=d1;return{q:`${FR(n1,d2)} − ${FR(n2,t)}`,ans:(n1*m2-n2*m1)/cm,type:'sn',ansText:(()=>{const s=n1*m2-n2*m1,g=gcd_(s,cm),p=s/g,q=cm/g;return q===1?String(p):`${p}/${q}`})(),
       steps:[S_('공통분모는?','',cm),S_('통분한 분자의 차',M_(`${n1*m2} − ${n2*m1}`),n1*m2-n2*m1),S_('분수로 답해요 ( / 단추 )','',(n1*m2-n2*m1)/cm,'sn')],errs:[E_((n1*m2+n2*m1)/cm,'더했어요. 빼기예요.')]}}
     const s=n1*m1-n2*m2,g=gcd_(s,cm),p=s/g,q=cm/g,at=q===1?String(p):`${p}/${q}`;
     return{q:`${FR(n1,d1)} − ${FR(n2,d2)}`,ans:p/q,type:'sn',ansText:at,steps:[S_('공통분모는?','',cm),S_('통분한 분자의 차',M_(`${n1*m1} − ${n2*m2}`),s),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
       errs:[E_((n1*m1+n2*m2)/cm,'더했어요. 빼기예요.')]}}
   const a=ri(r,1,4),b=pick(r,[2,3,4,5]),c=ri(r,1,3),d=pick(r,[2,3,4,5]),num=a*d,den=b*c,g=gcd_(num,den),p=num/g,q=den/g,at=q===1?String(p):`${p}/${q}`;
   return{q:`${FR(a,b)} ÷ ${FR(c,d)}`,ans:p/q,type:'sn',ansText:at,
     steps:[S_('뒤 분수를 뒤집어 분자끼리 곱해요',M_(`${a} × ${d}`),num),S_('분모끼리 곱해요',M_(`${b} × ${c}`),den),S_('분수로 답해요 ( / 단추 )','',p/q,'sn')],
     errs:[E_((a*c)/(b*d),'뒤 분수를 뒤집지 않고 그대로 곱했어요. 나누기는 역수를 곱해요.'),E_((b*c)/(a*d),'앞 분수를 뒤집었어요. ÷ 뒤의 분수만 뒤집어요.')]}}},
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
     ex(r){const g=pick(r,[3,4,6]),a=g*2,b=g*3;return{q:`${M_(a)}와 ${M_(b)}의 최대공약수`,ans:g,steps:[S_(`${a}와 ${b}를 둘 다 나누는 가장 큰 수는?`,'',g)]}},
     why:{q:'분수를 한 번에 약분할 때 쓰면 좋은 것은?',choices:['최대공약수','최소공배수','두 수의 합'],ans:0,ok:'분자와 분모의 최대공약수로 나누면 한 번에 기약분수가 돼요.'}}],
  gen(L,r){
   if(L===1){const n=pick(r,[12,15,16,18,20,24,28,30]),divs=[];for(let i=2;i<n;i++)if(n%i===0)divs.push(i);
     const ok=pick(r,divs),bads=[3,4,5,6,7,8,9,11].filter(x=>n%x!==0);const ch=shuffle(r,[String(ok),...shuffle(r,bads).slice(0,3).map(String)]);
     return{q:`다음 중 ${M_(n)}의 약수는?`,type:'choice',choices:ch,mathChoices:true,ans:String(ok),
       steps:[S_(`${n}을 나머지 없이 나누는 수를 골라요`,'',String(ok),'choice',ch)]}}
   if(L===2){const g=pick(r,[2,3,4,5,6,8]),[p,q]=pick(r,[[2,3],[3,4],[3,5],[2,5],[4,5]]),a=g*p,b=g*q;
     return{q:`${M_(a)}와 ${M_(b)}의 최대공약수`,ans:g,steps:[S_(`${a}와 ${b}를 둘 다 나누는 가장 큰 수`,'',g)],
       errs:[E_(lcm_(a,b),'최소공배수를 구했어요. 최대공약수는 둘 다 나누는 가장 큰 수예요.'),E_(1,'1보다 큰 공통 약수가 있어요.')]}}
   const g=pick(r,[2,3,4,5,6]),[p,q]=pick(r,[[2,3],[3,4],[2,5],[3,5]]),a=g*p,b=g*q,lm=lcm_(a,b);
   return{q:`${M_(a)}와 ${M_(b)}의 최소공배수`,ans:lm,steps:[S_('먼저 최대공약수를 찾아요','',g),S_('최소공배수',M_(`${g} × ${p} × ${q}`),lm)],
     errs:[E_(g,'최대공약수를 구했어요. 최소공배수는 공통 배수 중 가장 작은 수예요.'),E_(a*b,'두 수를 그냥 곱했어요. 최대공약수로 한 번 나눠야 최소공배수가 돼요.')]}}},
 {id:'signed',grp:'mid',nm:'부호가 있는 계산',use:'정수와 유리수의 사칙연산',lv:['1단계 · 같은 부호 더하기','2단계 · 다른 부호 더하기','3단계 · 뺄셈과 부호 곱셈'],
  ways:[{t:'같은 부호는 합치고, 다른 부호는 차이',idea:`${M_('(−3) + (−5)')}는 같은 음수끼리라 합쳐서 ${M_('−8')}. ${M_('(+7) + (−4)')}는 부호가 다르니 큰 쪽(+) 부호에 차이 ${M_('7 − 4 = 3')}을 붙여 ${M_('+3')}이에요.`,
     ex(r){const a=ri(r,3,9),b=ri(r,2,8);return{q:M_(`(−${a}) + (−${b})`),ans:-(a+b),type:'sn',steps:[S_('같은 − 부호끼리 · 숫자를 더해요',M_(`${a} + ${b}`),a+b),S_('공통 부호 −를 붙여요','',-(a+b),'sn')]}},
     why:{q:`${M_('(+4) + (−9)')}의 부호는 무엇일까요?`,choices:['− (9가 4보다 커서)','+ (앞의 수가 +라서)','부호가 없어요'],ans:0,ok:'부호가 다를 때는 절댓값이 큰 수의 부호를 따라가요.'}},
   {t:'빼기는 부호 바꿔 더하기',idea:`${M_('(+3) − (−5)')}는 빼기를 더하기로, 뒤의 부호를 반대로 바꿔 ${M_('(+3) + (+5) = +8')}로 계산해요.`,
     ex(r){const a=ri(r,2,8),b=ri(r,2,7);return{q:M_(`(+${a}) − (−${b})`),ans:a+b,type:'sn',steps:[S_('− (−)는 + (+)로 바뀌어요 · 계산하면',M_(`${a} + ${b}`),a+b),S_('부호까지 쓰면','',a+b,'sn')]}},
     why:{q:`${M_('(+2) − (−6)')}을 덧셈으로 바르게 바꾼 것은?`,choices:['(+2) + (+6)','(+2) + (−6)','(−2) + (+6)'],ans:0,ok:'빼는 수(−6)의 부호만 반대로(+6) 바꿔서 더해요.'}}],
  gen(L,r){
   if(L===1){const a=ri(r,2,9),b=ri(r,2,9),neg=r()<0.65;
     if(neg)return{q:M_(`(−${a}) + (−${b})`),ans:-(a+b),type:'sn',steps:[S_('같은 − 부호 · 숫자를 더해요',M_(`${a} + ${b}`),a+b),S_('− 부호를 붙여요','',-(a+b),'sn')],
       errs:[E_(a+b,'부호가 빠졌어요. 음수끼리 더하면 음수(−)예요.'),E_(-Math.abs(a-b),'빼기를 했어요. 같은 부호끼리는 숫자를 더해요.')]}
     return{q:M_(`(+${a}) + (+${b})`),ans:a+b,type:'sn',steps:[S_('같은 + 부호 · 숫자를 더해요',M_(`${a} + ${b}`),a+b),S_('부호까지 쓰면','',a+b,'sn')],errs:[E_(-(a+b),'양수끼리 더하면 양수예요.')]}}
   if(L===2){let a=ri(r,2,10),b=ri(r,2,10);if(a===b)b++;const flip=r()<0.5,A=flip?-a:a,B=flip?b:-b,ans=A+B,big=Math.max(a,b),sm=Math.min(a,b);
     return{q:M_(`(${sgnTxt(A)}) + (${sgnTxt(B)})`),ans,type:'sn',steps:[S_('부호가 다르니 두 수의 차이',M_(`${big} − ${sm}`),big-sm),S_(`큰 수 쪽 부호(${ans>0?'+':'−'})를 붙여요`,'',ans,'sn')],
       errs:[E_(-ans,'부호가 반대예요. 절댓값이 더 큰 수의 부호를 따라가요.'),E_(ans>0?(a+b):-(a+b),'부호가 다를 때는 더하지 않고 차이를 구해요.')]}}
   if(r()<0.6){const a=ri(r,1,8),b=ri(r,1,8),s1=r()<0.5?1:-1,s2=r()<0.5?1:-1,A=s1*a,B=s2*b,ans=A-B;
     return{q:M_(`(${sgnTxt(A)}) − (${sgnTxt(B)})`),ans,type:'sn',steps:[S_(`덧셈으로 바꾸면 (${sgnTxt(A)}) + (${sgnTxt(-B)}) · 답은?`,'',ans,'sn')],
       errs:[E_(A+B,'빼는 수의 부호를 바꾸지 않고 바로 더했어요.'),E_(-ans,'부호가 반대예요. 덧셈으로 바꾼 뒤 큰 수의 부호를 확인해요.')]}}
   const a=ri(r,2,7),b=ri(r,2,7),s1=r()<0.5?-1:1,s2=s1===1?-1:(r()<0.5?-1:1),A=s1*a,B=s2*b,ans=A*B;
   return{q:M_(`(${sgnTxt(A)}) × (${sgnTxt(B)})`),ans,type:'sn',steps:[S_('숫자끼리 곱해요',M_(`${a} × ${b}`),a*b),S_(`${s1===s2?'같은 부호라 +':'다른 부호라 −'}를 붙여요`,'',ans,'sn')],
     errs:[E_(-ans,s1===s2?'같은 부호끼리 곱하면 +(양수)예요.':'다른 부호끼리 곱하면 −(음수)예요.'),E_(A+B,'더했어요. 곱하기예요.')]}}}];
/* ── 핵심 낱말: 계산을 보면 떠올릴 낱말 하나 + 신호 + 그림 + 식 (기초학력 학생은 '무엇을 떠올릴지'부터 어려워해요) ── */
const KEYS={
 add:{w:'10 만들기',cue:'더해서 10을 넘거나, 빼서 10 아래로 내려갈 때',say:'더할 때는 모자란 만큼 채워 <b>10을 만들고</b> 남은 수를 더해요. 뺄 때는 <b>먼저 10까지</b> 빼고 남은 수를 더 빼요.',fig:()=>svgTenFrame(8,5),eq:'8 + 5 = 10 + 3 = 13,  13 − 6 = 13 − 3 − 3 = 7'},
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
 fracop:{w:'통분 · 뒤집어 곱하기',cue:'분수를 더하고 빼거나 나눌 때',say:'더하기·빼기는 <b>분모를 같게(통분)</b>, 나누기는 <b>뒤 분수를 뒤집어 곱해요</b>.',fig:()=>svgBars(2,4,1,2),eq:'1/2 + 1/4 = 3/4,  1/2 ÷ 1/4 = 2'},
 dec:{w:'소수점 맞추기',cue:'소수를 더하고 빼거나 곱할 때',say:'더하기·빼기는 <b>소수점 자리를 나란히</b>, 곱셈은 자연수처럼 곱하고 소수점을 찍어요.',fig:null,eq:'2.4 + 0.35 = 2.75,  0.4 × 6 = 2.4'},
 gcd:{w:'나누어떨어지는 수',cue:'약수·최대공약수·최소공배수를 구할 때',say:'약수는 <b>나머지 없이 나누는 수</b>예요. 약분은 최대공약수, 통분은 최소공배수를 써요.',fig:null,eq:'12와 18 → 최대공약수 6, 최소공배수 36'},
 signed:{w:'부호부터 정하기',cue:'+, − 부호가 붙은 수를 계산할 때',say:'같은 부호는 합치고, 다른 부호는 차이! <b>빼기는 뒤 수의 부호를 바꿔 더해요</b>.',fig:null,eq:'(+3) − (−5) = (+3) + (+5) = +8'}};
const plainQ=h=>stripTags(String(h).replace(/<span class="frs"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g,'$1/$2').replace(/<sup>(\d+)<\/sup>⁄<sub>(\d+)<\/sub>/g,'$1/$2').replace(/<br\s*\/?>/g,' ').replace(/<small>.*?<\/small>/g,''));
const FRC={2:'½',3:'⅓'};
/* 주제마다 '식 ↔ 그림/말' 잇기 문제 */
const LINKS={
 add:r=>{const a=ri(r,6,9),b=ri(r,11-a,9);return[{p:`${svgTenFrame(a,b)}<p>${M_(`${a} + ${b}`)}${J(b,'을','를').slice(String(b).length)} 10 만들기로 바꾸면?</p>`,choices:[`10 + ${a+b-10}`,`10 + ${b}`,`${a} + 10`],ans:`10 + ${a+b-10}`,ok:`${a}에 ${J(10-a,'을','를')} 채워 10, ${b}에서 남은 ${J(a+b-10,'을','를')} 더해요.`}]},
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
 fracop:r=>[{p:`<p class="kbig">${FR(1,2)} ÷ ${FR(3,4)}</p><p>곱셈으로 바꾸면?</p>`,choices:['1/2 × 4/3','2/1 × 3/4','1/2 × 3/4'],ans:'1/2 × 4/3',ok:'÷ 뒤의 분수만 위아래를 뒤집어 곱해요.'}],
 dec:r=>[{p:`<p class="kbig">${M_('2.4 + 0.35')}</p><p>소수점 자리를 맞춘 식은?</p>`,choices:['2.40 + 0.35','0.24 + 0.35','24 + 35'],ans:'2.40 + 0.35',ok:'2.4 뒤에 0을 붙여 2.40으로 맞추면 자릿값이 정확해요.'}],
 gcd:r=>[{p:`<p class="kbig">${M_('12')}와 ${M_('18')}</p><p>둘 다 나누어떨어지게 하는 가장 큰 수는?</p>`,choices:['6','3','36'],ans:'6',ok:'6은 12와 18의 최대공약수예요. 36은 최소공배수예요.'}],
 signed:r=>[{p:`<p class="kbig">${M_('(+3) − (−5)')}</p><p>덧셈으로 바꾸면?</p>`,choices:['(+3) + (+5)','(+3) + (−5)','(−3) + (+5)'],ans:'(+3) + (+5)',ok:'빼는 수의 부호만 반대로 바꿔 더해요.'}]};
/* 잇기 활동: ① 이 낱말을 떠올릴 계산 고르기 ② 이 계산에 떠올릴 낱말 고르기 ③ 그림·말 ↔ 식 */
const keySample=(id,r)=>{const K=KEYS[id],T=CALC.find(t=>t.id===id);return T.gen(K.only?K.only[0]:1,r)};
const keyFor=q=>{const K=!q.kw&&q.tid&&KEYS[q.tid];return K&&(!K.only||K.only.includes(q.lv))?K:null};
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
function wayFlow(body,T,w,onDone){const r=mulberry(newSeed()),ex=[];let g=0;while(ex.length<3&&g++<40){const e=w.ex(r);if(!ex.some(x=>x.q===e.q))ex.push(e)}while(ex.length<3)ex.push(w.ex(r));
  const multi=ex[0].steps.length>=2,PH=multi?['보기','같이','혼자']:['보기','혼자'];
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
      $('.wMore',body).onclick=()=>alone(w.ex(r))}})}
  see()}
/* ── 문제 묶음 풀기 (연습·오늘의 계산 공통) ──
   틀리면: 오류에 맞는 피드백 → 쪼개서 같이 풀기 → 끝에 비슷한 문제로 다시 / 언제든 '쪼개서 풀기' / 두 번 연속 틀리면 도움 제안 */
const PRAISE=['정답!','맞았어요!','좋아요!','바로 그거예요!'];
function drillRun(Q,{onFinish,onAnswer,host=app}={}){Q.forEach(q=>{q.state=null;q.type=q.type||'num'});
  const counted=Q.filter(q=>!q.extra),queue=Q.slice(),log=[];let first=0,busy=false,missRun=0,streak=0;
  const bar=()=>{const cur=queue[0];$('.dbar',host).innerHTML=counted.map(q=>`<i class="${q.state||(q===cur?'cur':'')}"></i>`).join('')};
  const flash=(h,c)=>{const f=$('.dflash',host);f.innerHTML=h;f.className='dflash'+(c?' '+c:'')};
  const again=q=>q.regen?Object.assign(q.regen(),{retry:true,state:null}):Object.assign({},q,{retry:true,state:null,tried:false});
  function ask(){busy=false;bar();const q=queue[0];window.__cq=q;window.__cs=null;if(!q){finish();return}
    $('.dNo',host).textContent=q.kw?'낱말 떠올리기':q.extra?'한 번 더':q.retry?'다시 한 번':`${counted.indexOf(q)+1} / ${counted.length}`;
    $('.dq',host).innerHTML=q.q;flash('');keyCue(q);const io=$('.dIn',host);io.innerHTML='';stopSpeak();const sb=$('.dSay',host);if(sb)sb.onclick=()=>speak(sayText(q.q+(q.suffix?` (단위 ${q.suffix})`:'')),sb);
    if(missRun>=2&&q.steps&&q.steps.length&&!q.extra&&!q.retry){missRun=0;
      io.innerHTML=`<div class="offer"><p>두 문제 연속으로 어려웠어요. 괜찮아요! 이번 문제는 <b>쪼개서</b> 같이 풀까요?</p><div class="next-row" style="justify-content:center;margin:8px 0 0"><button type="button" class="btn primary oYes">쪼개서 풀기</button><button type="button" class="btn oNo">혼자 해 볼게요</button></div></div>`;
      $('.oYes',io).onclick=()=>{busy=true;q.state='hint';onAnswer&&onAnswer(q,{ok:false,ms:null,counted:true,help:true});help(q,io,true)};$('.oNo',io).onclick=()=>stage(q,io);return}
    stage(q,io)}
  function keyCue(q){let c=$('.dcue',host);if(!c){c=el('<div class="dcue"></div>');$('.dq',host).after(c)}const K=keyFor(q);c.innerHTML='';if(!K)return;
    const chip=()=>{c.innerHTML=`<button type="button" class="kchip" aria-expanded="false">💡 떠올릴 낱말: <b>${K.w}</b></button><div class="kpop" hidden>${K.say}<br>${M_(K.eq)}</div>`;const b=$('.kchip',c);b.onclick=()=>{const p=$('.kpop',c);p.hidden=!p.hidden;b.setAttribute('aria-expanded',String(!p.hidden))}};
    if(q.lv===1&&!q.retry&&!q.extra)chip();else{c.innerHTML='<button type="button" class="kchip ask">💡 무엇을 떠올릴까? (눌러서 보기)</button>';$('.kchip',c).onclick=chip}}
  function stage(q,io){io.innerHTML='';const t0=performance.now();
    io.appendChild(answerUI({type:q.type,suffix:q.suffix,choices:q.choices,mathChoices:q.mathChoices},v=>{if(busy)return true;const ms=performance.now()-t0,res=check({type:q.type,ans:q.ans},v);
      if(res==='nopi'){flash('π를 붙여서 답해요. 예) 12π','bad');return false}
      if(res==='nosign'){flash('+ 또는 − 부호를 붙여 답해요.','bad');return false}
      busy=true;const counts=!q.retry&&!q.extra;onAnswer&&onAnswer(q,{ok:res===true,ms,counted:counts});
      if(res===true){if(counts){q.state='ok';first++}missRun=0;streak++;queue.shift();flash(streak>=3&&streak%3===0?`${streak}문제 연속! 집중력이 좋아요.`:pick(Math.random,PRAISE),'ok');setTimeout(ask,reduced?0:450);return true}
      streak=0;if(counts){q.state='hint';missRun++}const why0=diagnose(q,v);if(why0){log.push(why0);if(counts)recordCalcErr(q.tid,why0)}const K=keyFor(q),why=(why0?`<span class="diag">${why0}</span><br>`:'')+(K?`<span class="kline">💡 ${K.w} · ${K.say}</span><br>`:'');
      if(q.steps&&q.steps.length){flash(`${why||'아쉬워요. '}<b>쪼개서</b> 같이 풀어 봐요.`,'bad');help(q,io,false)}
      else{flash(`${why}정답은 ${M_(fmtAns(q))}.${counts?' 끝에 한 번 더 나와요.':''}`,'bad');queue.shift();if(counts)queue.push(again(q));setTimeout(ask,reduced?0:2600)}
      return true}));
    if(q.steps&&q.steps.length){const hb=el('<p class="dhelp"><button type="button" class="t-mini">도움: 쪼개서 풀기</button></p>');hb.firstChild.onclick=()=>{if(busy)return;busy=true;const counts=!q.retry&&!q.extra;if(counts)q.state='hint';onAnswer&&onAnswer(q,{ok:false,ms:null,counted:counts,help:true});missRun=0;streak=0;flash('');help(q,io,true)};io.appendChild(hb)}}
  function help(q,io,pre){stepWalk(io,q.steps,{lead:pre?'한 단계씩 계산해요.':'',onDone:()=>{const last=q.steps[q.steps.length-1],same=last.ans===q.ans&&(last.type||'num')===q.type,counts=!q.retry&&!q.extra;
      const next=()=>{queue.shift();if(counts)queue.push(again(q));ask()};
      if(same){flash(`잘했어요! 정답은 ${M_(fmtAns(q))}.${counts?' <span class="muted">비슷한 문제가 끝에 한 번 더 나와요.</span>':''}`,'ok');io.insertAdjacentHTML('beforeend','<div class="next-row" style="justify-content:center"><button type="button" class="btn primary dNext">다음 문제 →</button></div>');$('.dNext',io).onclick=next}
      else{flash('이제 처음 문제의 답을 골라 보세요.');io.innerHTML='';io.appendChild(answerUI({type:q.type,suffix:q.suffix,choices:q.choices,mathChoices:q.mathChoices},v2=>{const c=check({type:q.type,ans:q.ans},v2);if(c===true){flash('맞았어요!','ok');setTimeout(next,reduced?0:600);return true}flash(c==='nopi'?'π를 붙여서 답해요.':'다시 생각해 봐요.');return false}))}}})}
  function finish(){bar();$('.dq',host).innerHTML='';$('.dNo',host).textContent='끝!';flash('');const cnt={};log.forEach(m=>{cnt[m]=(cnt[m]||0)+1});const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
    onFinish&&onFinish(first,{tip:top&&top[1]>=2?top[0]:'',total:counted.length})}
  ask()}
/* ── 화면: 기초 연산 목록 ── */
const EXAM_FOCUS=['pi','frac','pow','area','surf','sub','eq','signed','div','fracbase','unit','mul'];
const EXAM_TAG={pi:'원·부채꼴·입체',frac:'부채꼴·뿔·구',pow:'원·입체',area:'입체 겉넓이',surf:'입체 겉넓이',sub:'정비례·입체',eq:'정비례·반비례',signed:'정비례·반비례',div:'반비례·나눗셈',fracbase:'부채꼴 약분',unit:'입체 부피',mul:'반비례 곱'};
const examRank=id=>{const i=EXAM_FOCUS.indexOf(id);return i<0?99:i};
const CALC_GRP=[['solid','원·부채꼴 · 입체도형 핵심 계산','이번 시험 범위(원과 부채꼴·입체도형·정비례/반비례)에 바로 나오는 계산이에요.'],['mid','중1 핵심 연산','부호·분수·소수·약수와 배수. 정비례·반비례와 부채꼴 계산의 바탕이에요.'],['base','기초 다지기','모든 계산의 바탕이에요. 흔들리는 부분부터 챙겨요.']];
const calcVisible=t=>!SITE.calcGroups||SITE.calcGroups.includes(t.grp);
const calcPlan=()=>{const d=OBJ(DB._calcDiag);return Array.isArray(d.plan)?d.plan.filter(id=>CALC.some(t=>t.id===id)):[]};
function calcCard(t,dueIds,plan){const s=calcPeek(t.id),wd=t.ways.filter((w,k)=>OBJ(s.ways)[k]).length,isDue=dueIds.includes(t.id),rec=plan.includes(t.id)&&NUM(s.stars)<1,ex=EXAM_TAG[t.id];
  return`<a class="card calc-card" href="#calc-${t.id}"><span class="calc-tags">${ex?`<i class="ctag exam">시험 · ${ex}</i>`:''}${isDue?'<i class="ctag due">복습</i>':''}${rec?'<i class="ctag rec">추천</i>':''}</span><b>${t.nm}</b>${KEYS[t.id]?`<span class="kw">💡 ${KEYS[t.id].w}</span>`:''}<small>${t.use}</small><span class="calc-prog">${starRow(Math.min(3,NUM(s.stars)))}<small>생각하는 법 ${wd}/${t.ways.length}</small></span></a>`}
function viewCalc(){crumbs.innerHTML=`<span class="sep">›</span><span>기초 연산</span>`;stopSpeak();
  const dueIds=dueList().map(t=>t.id),dg=OBJ(DB._calcDiag),plan=calcPlan();
  app.innerHTML=`<div class="unit-head"><div><h1>기초 연산</h1><p>짧게, 자주, 정확하게. <b>생각하는 법</b>을 익히고 쉬운 수부터 연습해요.</p></div></div>
   ${!dg.d?`<a class="card start-card" href="#calc-start"><span><b>처음이라면 여기부터 · 시작점 찾기</b><small>${DIAG.length}문제로 어디서부터 하면 좋을지 찾아 줘요. 시험이 아니에요.</small></span><span class="go" aria-hidden="true">→</span></a>`:''}
   <div class="card panel calc-sum"><div class="stat"><small>모은 별</small><b class="rm">${calcStars()} / ${CALC.filter(calcVisible).length*3}</b></div><div class="stat"><small>구구단 익힘</small><b class="rm">${factsKnown()} / 36</b></div><div class="stat"><small>오늘 복습</small><b class="rm">${dueIds.length>2?`2 / ${dueIds.length}`:dueIds.length}</b></div>
    <div class="calc-acts"><a class="btn${dg.d?' primary':''}" href="#drill">오늘의 계산${dueIds.length?` · 복습 ${Math.min(2,dueIds.length)}개`:''}</a>${dg.d?'<a class="btn ghost" href="#calc-start">시작점 다시 찾기</a>':''}</div></div>
   ${dueIds.length>2?`<p class="calc-due">밀린 복습이 ${dueIds.length}개 있지만 괜찮아요! 오늘은 부담 없이 <b>2개만</b> 먼저 챙겨도 충분해요.</p>`:''}
   ${(()=>{const ef=EXAM_FOCUS.map(id=>CALC.find(t=>t.id===id)).filter(t=>t&&calcVisible(t));return ef.length?`<div class="card panel exam-box"><h2>🎯 이번 시험 집중 연산</h2><p><b>원과 부채꼴 · 입체도형 · 정비례와 반비례</b>에 바로 쓰이는 기초 연산을 우선 배치했어요.</p><div class="exam-chips">${ef.slice(0,8).map(t=>`<a class="exam-chip" href="#calc-${t.id}"><b>${t.nm}</b><small>${EXAM_TAG[t.id]}</small>${starRow(Math.min(3,NUM(calcPeek(t.id).stars)))}</a>`).join('')}</div></div>`:''})()}
   ${dg.d&&plan.length?`<div class="card panel calc-plan"><b>내 추천 순서</b> ${plan.map((id,i)=>`<a class="chip" href="#calc-${id}">${i+1}. ${CALC.find(x=>x.id===id).nm}</a>`).join(' ')}</div>`:''}
   ${CALC_GRP.filter(([g])=>!SITE.calcGroups||SITE.calcGroups.includes(g)).map(([g,nm,d])=>`<h2 class="calc-gh">${nm}</h2><p class="muted calc-gd">${d}</p><div class="calc-grid">${CALC.filter(t=>t.grp===g).sort((a,b)=>examRank(a.id)-examRank(b.id)).map(t=>calcCard(t,dueIds,plan)).join('')}</div>`).join('')}`}
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
function viewCalcTopic(id){if(id==='start'){viewCalcStart();return}const T=CALC.find(t=>t.id===id);if(!T){location.hash='#calc';return}stopSpeak();
  crumbs.innerHTML=`<span class="sep">›</span><a href="#calc">기초 연산</a><span class="sep">›</span><span>${T.nm}</span>`;
  let L=calcMaxLv(id),CNT=calcLenPref();const LV=T.lv||CALC_LV;
  const draw=()=>{const st=calcState(id),wd=T.ways.filter((w,k)=>st.ways[k]).length;
    app.innerHTML=`<div class="unit-head"><div><h1>${T.nm}</h1><p>어디에 쓰여요? <b>${T.use}</b></p></div><div>${starRow(st.stars)}</div></div>
     ${calcDue(id)?'<p class="calc-due">복습할 때예요! 하루 이틀 지나 다시 떠올리면 더 오래 기억해요.</p>':''}
     ${id==='facts'?`<div class="card panel"><h2 style="margin-top:0">내 구구단 표 <small class="muted" style="font-size:15px">익힘 ${factsKnown()}/36</small></h2>${factGridHTML()}<div class="fLearn"></div></div>`:''}
     ${KEYS[id]?`<div class="card panel kpanel"><h2 style="margin-top:0">핵심 낱말 ${st.key?`<small class="kdone">${CHECK} 이었어요</small>`:''}</h2><p class="muted" style="margin-top:-4px">이 계산을 보면 무엇을 떠올릴까요? 신호 → 낱말 → 그림 → 식으로 이어 봐요.</p>${keyCardHTML(id)}
      <p style="margin:12px 0 0">${canSpeak?'<button type="button" class="say kSay">🔊 듣기</button> ':''}<button type="button" class="btn${st.key?'':' primary'} kGo">낱말 잇기 ${keyRounds(id,mulberry(1)).length}문제</button></p><div class="kHost"></div></div>`:''}
     <div class="card panel"><h2 style="margin-top:0">생각하는 법 <small class="muted" style="font-size:15px">${wd}/${T.ways.length}</small></h2><p class="muted" style="margin-top:-4px">${KEYS[id]&&!st.key?'핵심 낱말을 먼저 이어 보고 시작하면 좋아요. ':''}보기 → 같이 → 혼자 순서로 익혀요.</p>
      <div class="ways">${T.ways.map((w,k)=>`<div class="way ${st.ways[k]?'done':''}" data-k="${k}"><button type="button" class="wayHead" aria-expanded="false"><span class="wn">${k+1}</span><b>${w.t}</b><span class="wst">${st.ways[k]?CHECK:'익히기'}</span></button><div class="wayBody" hidden></div></div>`).join('')}</div></div>
     <div class="card panel"><h2 style="margin-top:0">연습</h2><div class="seg calcLv" role="tablist">${[1,2,3].map(k=>`<button type="button" data-l="${k}" class="${k===L?'on':''}" ${k>calcMaxLv(id)?'disabled':''}>${k}단계${k<=st.stars?' ★':''}</button>`).join('')}</div>
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
    else{Q=[];const seen=new Set(),mk=()=>{const q=Object.assign({type:'num'},T.gen(L,r));q.tid=id;q.lv=L;q.regen=()=>Object.assign({type:'num'},T.gen(L,r),{tid:id,lv:L});return q};for(let i=0;i<80&&Q.length<CNT;i++){const q=mk(),k=q.q+'|'+q.ans;if(seen.has(k))continue;seen.add(k);Q.push(q)}
      for(let i=0;i<40&&Q.length<CNT;i++){const q=mk();if(Q.slice(-3).some(x=>x.q===q.q))continue;Q.push(q)}Q=Q.slice(0,CNT)}  /* 문제가 적은 단계는 간격을 두고 다시 묻기 */
    app.innerHTML=`<div class="unit-head"><div><h1>${T.nm} <small class="muted" style="font-size:18px">${L}단계</small></h1><p>${LV[L-1]}</p></div></div>
     <div class="card panel"><div class="drill"><div class="dbar"></div><div class="dmeta"><span class="dNo"></span><span class="dmr">${canSpeak?'<button type="button" class="say dSay" aria-label="문제 읽어 주기">🔊</button>':''}<button type="button" class="t-mini calcStop">그만하기</button></span></div><div class="dq"></div><div class="dflash" aria-live="polite"></div><div class="dIn"></div></div></div>`;
    $('.calcStop',app).onclick=()=>{if(id==='facts')save();draw()};
    drillRun(Q,{onAnswer:(q,res)=>{if(q.fact)factRecord(q.fact,res.ok,res.ms)},
      onFinish:(first,info)=>{const st=calcState(id),n=info.total;st.n++;st.last=today();const pct=Math.round(first*100/n);if(st.best[L]==null||pct>NUM(st.best[L]))st.best[L]=pct;
        const need=Math.ceil(n*0.8),star=first>=need&&L>st.stars;if(star)st.stars=L;calcSchedule(id,Math.round(first*10/n));save();dayBump('calc');if(first)award(first);if(star)award(5,'calc:'+id+':'+L);
        $('.dIn',app).innerHTML=`<div class="feedback ${first>=need?'ok':''}" style="text-align:center">처음에 맞힌 문제 <b class="rm">${first}</b> / ${n}<br>${star?`${L}단계 별을 받았어요!${L<3?' 다음 단계가 열렸어요.':' 이 계산은 다 익혔어요!'}`:first>=need?'잘했어요! 이미 받은 별이에요.':`${need}문제 이상 맞히면 별을 받아요. 쪼개서 푼 문제를 떠올리며 한 번 더 해 봐요.`}</div>
          ${info.tip?`<p class="sum-tip"><b>자주 나온 실수</b> ${info.tip}</p>`:''}
          <p class="sum-space">${id==='facts'?`구구단 표: 빠르게 맞힘 <b>${FACTS.filter(([a,b])=>fs0(fk(a,b)).lv>=2).length}</b>칸 · 익힘 <b>${factsKnown()}</b>칸. 다른 날 한 번 더 빠르게 맞히면 익힘이 돼요.<br>`:''}내일 오늘의 계산에서 다시 만나요. 하루 지나 다시 떠올리면 더 오래 기억해요.</p>
          <div class="next-row" style="justify-content:center"><button type="button" class="btn calcBack">${T.nm}</button><button type="button" class="btn primary calcAgain">${star&&L<3?'다음 단계':'한 번 더'}</button></div>`;
        if(star)celebrate('');$('.calcBack',app).onclick=()=>draw();$('.calcAgain',app).onclick=()=>{if(star&&L<3)L++;run()}}})}
  draw()}
/* ── 시작점 찾기: 맞았는지 하나씩 알려 주지 않고, 끝나고 추천 순서만 ── */
const DIAG=[['add',1],['add',3],['facts',1],['facts',2],['facts',3],['div',1],['div',2],['order',1],['order',2],['fracbase',1],['fracbase',2]];
const DIAG_ORDER=['add','facts','div','order','fracbase'];
const DIAG_WHY={add:'받아올림·받아내림은 모든 계산의 바탕이에요.',facts:'곱셈구구가 빨라지면 다른 계산이 훨씬 쉬워져요.',div:'나눗셈은 곱셈을 거꾸로 하는 거예요.',order:'계산 순서를 알면 긴 식도 풀 수 있어요.',fracbase:'뿔과 구의 부피에 분수가 나와요.'};
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
      DIAG_ORDER.forEach(id=>{const s=calcState(id),lr=lvRes[id]||{};if(res[id]){s.unlock=3;if(!s.due){s.box=Math.max(s.box,1);s.due=addDays(today(),2)}}else if(lr[1]&&!lr[2]&&!lr[3]){s.unlock=Math.max(s.unlock,2)}else if(lr[1]&&lr[2]&&lr[3]===false){s.unlock=3}});save();dayBump('calc');award(5,'calcdiag');
      app.innerHTML=`<div class="unit-head"><div><h1>시작점을 찾았어요</h1><p>잘하는 것은 지키고, 흔들리는 것부터 다져요.</p></div></div>
       ${good.length?`<div class="card panel"><h2 style="margin-top:0">잘하고 있어요</h2><p>${good.map(id=>`<span class="chip">${nm(id)}</span>`).join(' ')}</p><p class="muted" style="margin-bottom:0">이 주제들은 오늘의 계산에서 가끔 복습해요.</p></div>`:''}
       <div class="card panel"><h2 style="margin-top:0">${plan.length?'여기부터 해요':'기초가 튼튼해요!'}</h2>
        ${plan.length?`<ol class="dg-plan">${plan.map(id=>`<li><a href="#calc-${id}"><b>${nm(id)}</b><span>${DIAG_WHY[id]}</span></a></li>`).join('')}</ol><p class="muted">하루에 한 주제씩, 생각하는 법부터 익혀요.</p><p style="margin:0"><a class="btn primary" href="#calc-${plan[0]}">${nm(plan[0])} 시작하기</a></p>`
          :'<p>이번 시험 핵심 연산(원·부채꼴, 입체도형, 정비례·반비례)으로 바로 넘어가요.</p><p style="margin:0"><a class="btn primary" href="#calc-pi">π가 있는 계산 시작하기</a></p>'}</div>
       <div class="next-row" style="justify-content:flex-start"><a class="btn ghost" href="#calc">기초 연산 목록</a></div>`}
    ask()}}
/* ── 오늘의 계산: 복습할 주제(간격 반복) + 곱셈구구 + 지난 주제를 섞어서 10문제 ── */
function drillPlan(r,count=10){const out=[],allDue=dueList().sort((a,b)=>examRank(a.id)-examRank(b.id)),maxDue=count<=5?2:3,due=allDue.slice(0,maxDue),started=CALC.filter(t=>t.id!=='facts'&&calcStarted(t.id)).sort((a,b)=>examRank(a.id)-examRank(b.id)),lvOf=t=>Math.max(1,Math.min(3,NUM(calcPeek(t.id).stars)||1));
  const add=(t,L)=>{let q;for(let k=0;k<6;k++){q=Object.assign({type:'num'},t.gen(L,r));if(!out.some(x=>x.q===q.q))break}q.tid=t.id;q.lv=L;if(t.id!=='facts')q.regen=()=>Object.assign({type:'num'},t.gen(L,r),{tid:t.id,lv:L});out.push(q)};
  due.forEach(t=>add(t,lvOf(t)));
  const F=CALC.find(t=>t.id==='facts'),fl=lvOf(F),nf=count<=5?1:(started.length<2?2:1);for(let i=0;i<nf&&out.length<count;i++)add(F,ri(r,1,fl));
  for(const t of started.filter(t=>!due.includes(t))){if(out.length>=count)break;add(t,lvOf(t))}
  const basics=EXAM_FOCUS.map(id=>CALC.find(t=>t.id===id)).filter(t=>t&&calcVisible(t));let i=0;while(out.length<count){const t=basics[i%basics.length];add(t,lvOf(t));i++}
  const Q=shuffle(r,out);for(let pass=0;pass<4;pass++)for(let j=1;j<Q.length;j++)if(Q[j].tid===Q[j-1].tid){const k=Q.findIndex((x,m)=>m>j&&x.tid!==Q[j].tid&&Q[m-1].tid!==Q[j].tid&&(m+1>=Q.length||Q[m+1].tid!==Q[j].tid));if(k>0)[Q[j],Q[k]]=[Q[k],Q[j]]}
  const kt=shuffle(r,[...new Set(Q.map(q=>q.tid))].filter(id=>KEYS[id]&&(calcStarted(id)||id==='facts'))).slice(0,count<=5?1:2).map(id=>CALC.find(t=>t.id===id));
  kt.forEach((t,i)=>Q.splice(Math.min(Q.length,i?6:1),0,keyQuiz(t,r)));
  return{Q,due,totalDue:allDue.length}}
function viewDrill(){crumbs.innerHTML=`<span class="sep">›</span><span>오늘의 계산</span>`;stopSpeak();
  const D=DB._drill=DB._drill||{},CNT=calcLenPref(),tm=!!lsGet('hangeoreum-drill-timer',false),{Q,due,totalDue}=drillPlan(mulberry(newSeed()),CNT);
  app.innerHTML=`<div class="unit-head"><div><h1>오늘의 계산</h1><p>섞어서 ${Q.filter(q=>!q.extra).length}문제. 빠르기보다 <b>정확하게</b>가 먼저예요. 막히면 쪼개서 같이 풀어요.</p></div>
    <div class="seg drillCnt" role="tablist"><button type="button" data-n="5" class="${CNT===5?'on':''}">5문제 (3분)</button><button type="button" data-n="10" class="${CNT===10?'on':''}">10문제</button></div></div>
   ${due.length?`<p class="drill-due"><b>오늘 복습</b> ${due.map(t=>`<span class="chip">${t.nm}</span>`).join(' ')}${totalDue>due.length?` <small class="muted">(밀린 복습 ${totalDue}개 중 부담 없이 ${due.length}개만 먼저 해요)</small>`:''}</p>`:''}${!OBJ(DB._calcDiag).d&&!CALC.some(t=>calcStarted(t.id))?'<p class="calc-due">처음이라면 <a href="#calc-start">시작점 찾기</a>를 먼저 해 보세요. 나에게 맞는 문제가 나와요.</p>':''}
   <div class="card panel"><div class="drill"><div class="dbar"></div><div class="dmeta"><span class="dNo"></span><span class="dmr"><span class="dTime"${tm?'':' hidden'}>0:00</span>${canSpeak?'<button type="button" class="say dSay" aria-label="문제 읽어 주기">🔊</button>':''}</span></div><div class="dq"></div><div class="dflash" aria-live="polite"></div><div class="dIn"></div></div></div>
   <p class="drill-opt"><label><input type="checkbox" class="tmT"${tm?' checked':''}> 시간 재기</label> <span class="muted">· 시간은 내 기록과 비교할 때만 써요.</span></p>`;
  let t0=performance.now();const fmt=ms=>{const s=Math.round(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  $$('.drillCnt button',app).forEach(b=>b.onclick=()=>{lsSet('hangeoreum-calc-len',+b.dataset.n);viewDrill()});
  $('.tmT',app).onchange=e=>{lsSet('hangeoreum-drill-timer',e.target.checked);const tt=$('.dTime',app);if(tt)tt.hidden=!e.target.checked};
  const timer=setInterval(()=>{const tt=$('.dTime',app);if(!tt){clearInterval(timer);return}tt.textContent=fmt(performance.now()-t0)},500);
  const res={};
  drillRun(Q,{onAnswer:(q,a)=>{if(q.fact)factRecord(q.fact,a.ok,a.ms);if(a.counted&&q.tid)res[q.tid]=(res[q.tid]==='bad'||!a.ok)?'bad':'ok'},
    onFinish:(first,info)=>{clearInterval(timer);const ms=performance.now()-t0,timed=$('.tmT',app)&&$('.tmT',app).checked,up=[],again=[];
      Object.keys(res).forEach(tid=>{if(tid==='facts')return;const s=calcState(tid),nm=CALC.find(t=>t.id===tid).nm;
        if(res[tid]==='bad'){s.box=Math.max(1,s.box-1);s.due=addDays(today(),1);again.push(nm)}else if(calcDue(tid)){s.box=Math.min(5,s.box+1);s.due=addDays(today(),BOX_DAYS[s.box]);up.push(nm)}});
      const need8=Math.ceil(info.total*0.8),isBest=timed&&first>=need8&&(!D.best||ms<D.best);if(isBest)D.best=ms;
      D.last=today();D.lastScore=first;D.runs=(D.runs||0)+1;save();bump('drill');dayBump('drill');if(first>=need8)dayBump('drill8');if(first)award(first);award(5,'drill:'+today());
      $('.dIn',app).innerHTML=`<div class="feedback ok" style="text-align:center">처음에 맞힌 문제 <b class="rm">${first}</b> / ${info.total}${timed?` · 걸린 시간 <b class="rm">${fmt(ms)}</b>`:''}${isBest?'<br>최고 기록이에요!':''}</div>
        ${up.length?`<p class="sum-space"><b>오래 기억 쪽으로 한 칸</b> ${up.join(', ')} · 다음 복습은 며칠 뒤예요.</p>`:''}${again.length?`<p class="sum-space"><b>내일 한 번 더</b> ${again.join(', ')}</p>`:''}
        ${info.tip?`<p class="sum-tip"><b>자주 나온 실수</b> ${info.tip}</p>`:''}
        <div class="next-row" style="justify-content:center"><a class="btn" href="#calc">기초 연산</a><button type="button" class="btn primary dAgain">한 번 더</button></div>`;
      $('.dAgain',app).onclick=()=>viewDrill()}})}
/* ───────── 오늘의 길잡이: 집에서 혼자 해도 순서를 잃지 않게 ───────── */
const CALC_FOR={poly:['add','mul','sub'],types:['sub','eq'],regular:['facts','mul','div'],area:['area','pi','surf','frac','unit']};
const TAB_DO={concept:'미리 보기 (정규 수업 전에)',explore:'더 알아보기 · 탐구 활동',steps:'같이 풀기 1문제',practice:'혼자 풀기 5문제'};
function guideSteps(){const S=[],D=dayState(),due=dueReviews().length;
  if(due||NUM(D.c.review))S.push({done:!due,t:due?`복습 노트 ${due}문제`:'복습 노트',s:due?'틀렸던 문제를 다시 풀어요':'오늘 복습을 끝냈어요',href:'#review'});
  const lu=DB._last&&(LESSONS.find(l=>l.id===DB._last.id)||{}).unit,L=LESSONS.filter(l=>l.ready).sort((x,y)=>(y.unit===lu)-(x.unit===lu)),cur=L.find(l=>lessonDone(l.id)<LESSON_REQ),moved=NUM(D.c.steps)+NUM(D.c.prac)+NUM(D.c.explore)>0;
  if(cur){const p=OBJ(DB[cur.id]),tab=!p.concept?'concept':!(NUM(p.steps)>0)?'steps':!(NUM(OBJ(p.prac).solved)>=5)?'practice':'explore';
    S.push({who:(tab==='concept'||tab==='steps')?'T':'S',done:moved,more:true,t:`${cur.no}차시 ${cur.title}`,s:TAB_DO[tab]+(tab==='practice'?` (지금 ${NUM(OBJ(p.prac).solved)}개)`:''),href:'#'+cur.id+(tab==='concept'?'':'-'+tab)})}
  else S.push({done:moved,more:true,t:'열린 차시를 모두 마쳤어요',s:'연습 문제로 실력을 다져요',href:'#'+L[L.length-1].id+'-practice'});
  const cdone=NUM(D.c.calc)>0,dg=OBJ(DB._calcDiag);
  if(!dg.d)S.push({done:cdone,more:true,t:'기초 연산 · 시작점 찾기',s:cdone?'오늘 한 세트 했어요 · 시작점 찾기도 해 보세요':`${DIAG.length}문제로 어디서부터 할지 찾아요`,href:'#calc-start'});
  else{const dueT=dueList()[0],planT=calcPlan().map(id=>CALC.find(t=>t.id===id)).find(t=>t&&NUM(calcPeek(t.id).stars)<1),ids=CALC_FOR[cur?cur.id:'area']||[];
    const examT=EXAM_FOCUS.map(id=>CALC.find(c=>c.id===id)).find(t=>t&&calcVisible(t)&&NUM(calcPeek(t.id).stars)<3);
    const tp=dueT||examT||planT||ids.map(id=>CALC.find(c=>c.id===id)).find(t=>t&&NUM(calcPeek(t.id).stars)<3)||CALC.filter(calcVisible).sort((a,b)=>examRank(a.id)-examRank(b.id)||NUM(calcPeek(a.id).stars)-NUM(calcPeek(b.id).stars))[0];
    const st=calcPeek(tp.id),sub=calcDue(tp.id)?'복습할 때예요 · 10문제':Object.keys(OBJ(st.ways)).length?`${Math.min(3,NUM(st.stars)+1)}단계 10문제`:'생각하는 법부터 익혀요';
    S.push({done:cdone,more:true,t:`기초 연산 · ${tp.nm}`,s:cdone?'오늘 한 세트 했어요':sub,href:'#calc-'+tp.id})}
  const dd=OBJ(DB._drill).last===today(),dn=dueList().length,cl=calcLenPref();S.push({done:dd,t:'오늘의 계산',s:dd?'오늘 끝냈어요':dn?`복습할 주제 ${Math.min(cl<=5?2:3,dn)}개를 섞어서 ${cl}문제`:`섞어서 ${cl}문제 · ${cl<=5?'3분쯤':'5분쯤'}`,href:'#drill'});
  return S}
/* 방과후: 선생님과 함께 할 것(T)을 위에, 혼자 할 것(S)을 아래에 나눠 보여요 */
const GUIDE_WHO={T:['👩‍🏫 선생님과 함께','방과후 시간에 선생님과 같이 해요'],S:['🙋 혼자 하기','선생님이 다른 친구를 도와줄 때나 집에서 혼자 해요']};
function guideHTML(){const S0=guideSteps(),S=S0.filter(x=>x.who==='T').concat(S0.filter(x=>x.who!=='T')),ci=S.findIndex(x=>!x.done),n=S.filter(x=>x.done).length;
  return`<div class="g-head"><b class="t">오늘의 길잡이</b><span class="k">${n===S.length?'오늘 할 일을 다 했어요!':'위에서부터 하나씩 해 봐요'} · ${n}/${S.length}</span></div>
  <ol class="gsteps">${S.map((x,i)=>`${(x.who==='T'?'T':'S')!==(i?(S[i-1].who==='T'?'T':'S'):'')?`<li class="g-sub g-${x.who==='T'?'t':'s'}"><b>${GUIDE_WHO[x.who==='T'?'T':'S'][0]}</b><small>${GUIDE_WHO[x.who==='T'?'T':'S'][1]}</small></li>`:''}<li class="${x.done?'done':i===ci?'cur':''}"><span class="gn">${x.done?CHECK:i+1}</span><span class="gt"><b>${x.t}</b><small>${x.s}</small></span>${x.done&&!x.more?'':`<a class="btn ${i===ci?'primary':'ghost'}" href="${x.href}">${x.done?'더 하기':i===ci?'시작':'하기'}</a>`}</li>`).join('')}</ol>`}

