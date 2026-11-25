/*<INT>*/
/* ═════════════ 단원: 정수와 유리수 (unit:'int') ═════════════
   양수 = 빨강, 음수 = 파랑 (온도계의 영상·영하와 같은 약속). 색만으로 구별하지 않도록 늘 +, − 기호를 함께 씀.
   맞음/틀림은 ○ · ✕ 표시로만 나타냄. */
const PC='#c0504d',NC='#2a4d9e',PCs='#fbe3e1',NCs='#e1e8f7',ZC='#6b7280';
const MATHF="'Times New Roman',Times,serif";
/* 유리수: {p,q,dec} (q>0) — 소수는 dec로 표시만 바꿈 */
const igcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
function Q(p,q=1,dec=false){if(q<0){p=-p;q=-q}const g=igcd(p,q);return{p:p/g,q:q/g,dec}}
const qv=x=>x.p/x.q;
const qAdd=(a,b)=>Q(a.p*b.q+b.p*a.q,a.q*b.q,a.dec||b.dec);
const qNeg=a=>Q(-a.p,a.q,a.dec);
const qAbs=a=>Q(Math.abs(a.p),a.q,a.dec);
const MI='−';
function qS(x,sign=true){const s=x.p>0?(sign?'+':''):x.p<0?MI:'';const a=Math.abs(x.p);
  if(x.p===0)return'0';if(x.q===1)return s+a;if(x.dec)return s+String(Math.round(a/x.q*1000)/1000);return s+a+'/'+x.q}
function qH(x,sign=true){const s=x.p>0?(sign?'+':''):x.p<0?MI:'';const a=Math.abs(x.p);
  if(x.p===0)return'0';if(x.q===1||x.dec)return qS(x,sign);return s+FR(a,x.q)}
const par=x=>`(${qH(x)})`;
const parS=x=>`(${qS(x)})`;
const I_=n=>Q(n);
const sgnWord=x=>x.p>0?'양수':x.p<0?'음수':'0';

/* ── 수직선 그림 ──
   o: {min,max,sub(한 칸을 몇 칸으로),pts:[{v,l,c}],arrows:[{a,b,lab}],hops:{a,b},span:[{a,b,lab}],tb,hit,W,origin,mark:[v],labs:'int'|'all'|'none' } */
function nlSVG(o){
  const tb=!!o.tb,W=o.W||420,pad=24,sub=o.sub||1,n=o.max-o.min,ux=(W-2*pad)/n,X=v=>pad+(v-o.min)*ux;
  const AR=o.arrows||[],lvH=34,top=14+(AR.length?AR.length*lvH+8:0)+((o.pts||[]).some(p=>p.l)?30:6)+(o.span?30:0);
  const y=top+8,H=y+44+(o.hit?10:0);const fs=tb?26:24,ink=tb?'#111':'#1d2640';
  let s=`<svg viewBox="0 0 ${W} ${H}" class="nlsvg" role="img" aria-label="수직선" style="font-family:${MATHF}">`;
  if(!tb){s+=`<line x1="${X(0)}" y1="${y}" x2="${W-6}" y2="${y}" stroke="${PC}" stroke-width="5" stroke-linecap="round" opacity=".28"/><line x1="6" y1="${y}" x2="${X(0)}" y2="${y}" stroke="${NC}" stroke-width="5" stroke-linecap="round" opacity=".28"/>`}
  s+=`<line x1="6" y1="${y}" x2="${W-6}" y2="${y}" stroke="${ink}" stroke-width="${tb?2.4:2.2}"/>`;
  for(let k=o.min*sub;k<=o.max*sub;k++){const v=k/sub,int=k%sub===0,x=X(v);s+=`<line x1="${x}" y1="${y-(int?9:6)}" x2="${x}" y2="${y+(int?9:6)}" stroke="${ink}" stroke-width="${int?2:1.4}"/>`;
    if(int&&o.labs!=='none'&&(o.labs!=='zero'||v===0)&&(ux>=fs*1.2||v%2===0)){const c=tb||v===0?ink:v>0?PC:NC;s+=`<text x="${x}" y="${y+34}" text-anchor="middle" font-size="${fs}" fill="${c}">${v<0?MI+(-v):v}</text>`}}
  if(o.origin)s+=`<text x="${X(0)}" y="${y-16}" text-anchor="middle" font-size="${fs-2}" fill="${ink}">O</text>`;
  if(o.hops){const{a,b}=o.hops,st=a<b?1/sub:-1/sub;let k=0;for(let v=a;Math.abs(v-b)>1e-9&&k<40;v+=st,k++){const x1=X(v),x2=X(v+st),c=tb?'#444':(b>a?PC:NC);s+=`<path d="M${x1} ${y-4} Q ${(x1+x2)/2} ${y-26} ${x2} ${y-4}" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="${tb?'4 4':'0'}"/>`}}
  if(o.span)o.span.forEach(sp=>{const x1=X(sp.a),x2=X(sp.b),yy=y-22-(AR.length?AR.length*lvH+8:0)-((o.pts||[]).some(p=>p.l)?24:0);
    s+=`<path d="M${x1} ${yy+6} V${yy} H${x2} V${yy+6}" fill="none" stroke="${tb?'#111':'#7b5ea7'}" stroke-width="2"/><text x="${(x1+x2)/2}" y="${yy-6}" text-anchor="middle" font-size="${fs-4}" fill="${tb?'#111':'#7b5ea7'}">${sp.lab||''}</text>`});
  AR.forEach((A,i)=>{const yy=y-26-i*lvH,x1=X(A.a),x2=X(A.b),c=tb?'#111':(A.b>=A.a?PC:NC),d=x2>x1?1:-1;if(Math.abs(x2-x1)<1)return;
    s+=`<line x1="${x1}" y1="${yy}" x2="${x2-d*9}" y2="${yy}" stroke="${c}" stroke-width="3.2"/><path d="M${x2} ${yy} l${-d*13} -7 v14 z" fill="${c}"/><line x1="${x1}" y1="${yy-6}" x2="${x1}" y2="${yy+6}" stroke="${c}" stroke-width="2"/>`;
    if(A.lab)s+=`<text x="${(x1+x2)/2}" y="${yy-8}" text-anchor="middle" font-size="${fs-4}" fill="${c}" font-weight="700">${A.lab}</text>`});
  (o.mark||[]).forEach(v=>{s+=`<circle cx="${X(v)}" cy="${y}" r="13" fill="none" stroke="#e08a1e" stroke-width="3"/>`});
  (o.pts||[]).forEach(P=>{const x=X(P.v),c=tb?'#111':(P.c||(P.v>0?PC:P.v<0?NC:ink));s+=`<circle cx="${x}" cy="${y}" r="${tb?6:7.5}" fill="${P.hollow?'#fff':c}" stroke="${c}" stroke-width="2.5"/>`;
    if(P.l)s+=`<text x="${x}" y="${y-18}" text-anchor="middle" font-size="${fs}" fill="${c}" ${P.it?'font-style="italic"':''}>${P.l}</text>`;
    if(P.x)s+=`<text x="${x}" y="${y-18}" text-anchor="middle" font-size="${fs}" fill="${P.x==='✕'?'#b83a3a':'#2b7a4b'}" font-family="sans-serif" font-weight="700">${P.x}</text>`});
  if(o.robot!=null){const x=X(o.robot);s+=`<g transform="translate(${x} ${y-4})"><rect x="-13" y="-34" width="26" height="22" rx="6" fill="#ffe266" stroke="#1d2640" stroke-width="2"/><circle cx="-5" cy="-23" r="2.6" fill="#1d2640"/><circle cx="5" cy="-23" r="2.6" fill="#1d2640"/><line x1="0" y1="-34" x2="0" y2="-41" stroke="#1d2640" stroke-width="2"/><circle cx="0" cy="-43" r="3" fill="${PC}"/><line x1="-7" y1="-12" x2="-7" y2="-3" stroke="#1d2640" stroke-width="2.5"/><line x1="7" y1="-12" x2="7" y2="-3" stroke="#1d2640" stroke-width="2.5"/></g>`}
  if(o.hit)for(let k=o.min*sub;k<=o.max*sub;k++){const v=k/sub,x=X(v);s+=`<rect class="nlhit" data-v="${v}" x="${x-ux/sub/2}" y="${y-30}" width="${ux/sub}" height="70" fill="transparent" style="cursor:pointer"/>`}
  return s+'</svg>'}
function nlRange(vals,minW=5){let a=Math.floor(Math.min(0,...vals))-1,b=Math.ceil(Math.max(0,...vals))+1;while(b-a<2*minW){if(-a<b)a--;else b++}return[a,b]}

/* ── 칩 그림: 위에 + 칩, 아래에 − 칩, 짝(0 쌍)은 세로로 맞추어 묶음 ── */
function chipsSVG(pos,neg,o={}){
  const r=o.r||17,gap=r*2+9,cols=Math.max(pos,neg,1),W=Math.max(o.W||440,cols*gap+20),pairs=o.pairs||0,H=r*4+50,y1=r+12,y2=y1+gap+4;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="chipsvg" role="img" aria-label="양의 칩 ${pos}개, 음의 칩 ${neg}개" style="font-family:${MATHF}">`;
  const x0=(W-cols*gap)/2+gap/2;
  for(let i=0;i<pairs;i++){const x=x0+i*gap;s+=`<rect x="${x-r-4}" y="${y1-r-4}" width="${2*r+8}" height="${y2-y1+2*r+8}" rx="${r+4}" fill="#f4f4f4" stroke="#8a8f99" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    if(o.zeroLab!==false)s+=`<text x="${x}" y="${y2+r+22}" text-anchor="middle" font-size="18" fill="${ZC}">0</text>`}
  const chip=(x,yy,p,dim,ghost)=>{const c=p?PC:NC;return`<g opacity="${dim?0.32:1}"><circle cx="${x}" cy="${yy}" r="${r}" fill="${ghost?'#fff':p?PCs:NCs}" stroke="${c}" stroke-width="2.4" ${ghost?'stroke-dasharray="4 3"':''}/><text x="${x}" y="${yy+8}" text-anchor="middle" font-size="${r*1.35}" font-weight="700" fill="${c}">${p?'+':MI}</text></g>`};
  for(let i=0;i<pos;i++)s+=chip(x0+i*gap,y1,true,o.cancel&&i<pairs,o.ghostP&&i>=pos-o.ghostP);
  for(let i=0;i<neg;i++)s+=chip(x0+i*gap,y2,false,o.cancel&&i<pairs,o.ghostN&&i>=neg-o.ghostN);
  if(o.cancel)for(let i=0;i<pairs;i++){const x=x0+i*gap;s+=`<line x1="${x-r}" y1="${y1-r}" x2="${x+r}" y2="${y2+r}" stroke="#8a8f99" stroke-width="2"/>`}
  return s+'</svg>'}

/* ── 온도계 ── */
function thermoSVG(t,o={}){const lo=o.lo??-10,hi=o.hi??10,H=360,W=o.wide||o.marks?250:170,x=70,top=24,bot=300,Y=v=>bot-(v-lo)/(hi-lo)*(bot-top),tb=!!o.tb;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="thermo" role="img" aria-label="온도계" style="font-family:${MATHF}">`;
  s+=`<rect x="${x-11}" y="${top-12}" width="22" height="${bot-top+24}" rx="11" fill="#fff" stroke="#1d2640" stroke-width="2.2"/><circle cx="${x}" cy="${bot+28}" r="20" fill="${tb?'#999':(t>=0?PC:NC)}" stroke="#1d2640" stroke-width="2.2"/>`;
  if(t!=null)s+=`<rect x="${x-6}" y="${Y(t)}" width="12" height="${bot+16-Y(t)}" fill="${tb?'#999':(t>=0?PC:NC)}"/>`;
  for(let v=lo;v<=hi;v++){const yy=Y(v),big=v%5===0;s+=`<line x1="${x+11}" y1="${yy}" x2="${x+11+(big?16:9)}" y2="${yy}" stroke="#1d2640" stroke-width="${big?2:1.2}"/>`;
    if(big)s+=`<text x="${x+33}" y="${yy+7}" font-size="20" fill="${v===0||tb?'#1d2640':v>0?PC:NC}">${v<0?MI+(-v):v}</text>`}
  s+=`<text x="${x+33}" y="${top-14}" font-size="16" fill="#1d2640">(°C)</text>`;
  if(!tb&&!o.noWords){s+=`<text x="8" y="${(Y(hi)+Y(0))/2}" font-size="16" fill="${PC}" font-family="sans-serif" font-weight="700">영상</text><text x="8" y="${(Y(lo)+Y(0))/2}" font-size="16" fill="${NC}" font-family="sans-serif" font-weight="700">영하</text><line x1="${x-30}" y1="${Y(0)}" x2="${x-12}" y2="${Y(0)}" stroke="#1d2640" stroke-width="1.5" stroke-dasharray="3 3"/>`}
  (o.marks||[]).forEach(m=>{s+=`<path d="M${x+52} ${Y(m.v)} l14 -8 v16 z" fill="${m.c||'#e08a1e'}"/><text x="${x+70}" y="${Y(m.v)+6}" font-size="15" font-family="sans-serif" fill="#1d2640">${m.l||''}</text>`});
  return s+'</svg>'}

/* ── 상황 (반대가 되는 두 양) ── */
const SIT=[
  {base:'0 °C',p:'영상',n:'영하',u:'°C',ph:(w,k)=>`${w} ${k} °C`,ks:[1,2,3,4,5,6,7,8,9,12,15]},
  {base:'해수면',p:'해발',n:'해저',u:'m',ph:(w,k)=>`${w} ${k} m`,ks:[100,200,300,500,800,1200]},
  {base:'처음 가진 돈',p:'이익',n:'손해',u:'원',ph:(w,k)=>`${k}원 ${w}`,ks:[500,1000,2000,3000,5000]},
  {base:'지금',p:'후',n:'전',u:'일',ph:(w,k)=>`${k}일 ${w}`,ks:[1,2,3,5,7,10]},
  {base:'지난달 회원 수',p:'증가',n:'감소',u:'명',ph:(w,k)=>`${k}명 ${w}`,ks:[3,5,8,12,20]},
  {base:'출발점',p:'동쪽',n:'서쪽',u:'km',ph:(w,k)=>`${w}으로 ${k} km`,ks:[2,3,4,5,8]},
  {base:'0점',p:'득점',n:'실점',u:'점',ph:(w,k)=>`${k}점 ${w}`,ks:[1,2,3,5,10]},
  {base:'원래 몸무게',p:'늘어남',n:'줄어듦',u:'kg',ph:(w,k)=>`${k} kg ${w}`,ks:[1,2,3,4]},
  {base:'수입과 지출이 없을 때',p:'수입',n:'지출',u:'원',ph:(w,k)=>`${k}원 ${w}`,ks:[1000,3000,5000,8000]}];

/* ── 개념 ── */
CONCEPT.sign=body=>{
  body.innerHTML=foldPanel('양수와 음수',`<p class="lead">서로 <b class="mark">반대가 되는 두 양</b>은 기준을 0으로 정하고, 한쪽은 ${T('양의 부호')} <b class="rm" style="color:${PC}">+</b>, 반대쪽은 ${T('음의 부호')} <b class="rm" style="color:${NC}">${MI}</b>를 붙여 나타내요.</p>`,
   fold(1,'기준과 반대 방향','영상 3 °C와 영하 3 °C',`<div class="duo"><div class="figbox">${thermoSVG(3,{marks:[{v:3,l:'+3 °C',c:PC}]})}<div class="figcap">영상 3 °C → <b class="rm" style="color:${PC}">+3 °C</b></div></div>
      <div class="figbox">${thermoSVG(-3,{marks:[{v:-3,l:MI+'3 °C',c:NC}]})}<div class="figcap">영하 3 °C → <b class="rm" style="color:${NC}">${MI}3 °C</b></div></div></div>
     <p>0 °C가 <b>기준</b>이에요. 기준보다 높으면 +, 낮으면 ${MI}를 붙여요. 숫자 3은 같지만 방향이 반대예요.</p>
     <div class="tablewrap"><table class="t sitt"><thead><tr><th>기준</th><th style="color:${PC}">+ 쪽</th><th style="color:${NC}">${MI} 쪽</th></tr></thead><tbody>
     ${SIT.slice(0,7).map(S=>{const k=S.ks[1];return`<tr><td>${S.base}</td><td>${S.ph(S.p,k)}<br><b class="rm" style="color:${PC}">+${k} ${S.u}</b></td><td>${S.ph(S.n,k)}<br><b class="rm" style="color:${NC}">${MI}${k} ${S.u}</b></td></tr>`}).join('')}</tbody></table></div>
     <div class="box" style="margin-bottom:0"><b>핵심 낱말</b> · 기준에서 <b>어느 쪽</b>인가? 영상·해발·이익·증가·~후처럼 늘어나는 쪽이 +, 그 반대말이 ${MI}예요.</div>`,true)+
   fold(2,'부호 읽기','+3은 ‘양의 3’',`<div class="readrow"><div><span class="big rm" style="color:${PC}">+3</span><small>양의 3<br>(플러스 3)</small></div><div><span class="big rm" style="color:${NC}">${MI}3</span><small>음의 3<br>(마이너스 3)</small></div></div>
     <p style="margin-bottom:0">+를 ${T('양의 부호')}, ${MI}를 ${T('음의 부호')}라고 해요. 덧셈·뺄셈 기호와 모양은 같지만, 숫자 바로 앞에 붙어서 <b>방향</b>을 알려 줘요.</p>`)+
   fold(3,'양수 · 음수 · 0','0은 어느 쪽도 아니에요',`<div class="sort3"><div class="bin p"><b>양수</b><small>0보다 큰 수</small><span class="rm">+5, +0.3, +1/2</span></div><div class="bin n"><b>음수</b><small>0보다 작은 수</small><span class="rm">${MI}2, ${MI}0.8, ${MI}3/4</span></div><div class="bin z"><b>둘 다 아님</b><small>기준</small><span class="rm">0</span></div></div>
     <p>양의 부호 +를 붙인 수를 ${T('양수')}, 음의 부호 ${MI}를 붙인 수를 ${T('음수')}라고 해요.</p>
     <div class="box" style="margin:0">· <b>0은 양수도 음수도 아니에요.</b> 기준이니까요.<br>· 양수에는 +, 음수에는 ${MI}를 꼭 붙여서 나타내요.</div>`));
  wireFolds(body,'sign')};

CONCEPT.numline=body=>{
  body.innerHTML=foldPanel('수직선',`<p class="lead">직선 위에 기준점 ${T('원점')} O를 정하고 <b class="mark">같은 간격</b>으로 눈금을 매겨 수를 나타낸 직선을 ${T('수직선')}이라고 해요.</p>`,
   fold(1,'수직선 만들기','오른쪽은 +, 왼쪽은 −',`<div class="figbox">${nlSVG({min:-5,max:5,origin:true})}</div>
     <p>원점에 0을 두고, <b style="color:${PC}">오른쪽</b>에 양수 <span class="rm">+1, +2, +3, …</span>, <b style="color:${NC}">왼쪽</b>에 음수 <span class="rm">${MI}1, ${MI}2, ${MI}3, …</span>을 차례로 놓아요. 눈금 사이의 간격은 모두 같아요.</p>`,true)+
   fold(2,'점이 나타내는 수 읽기','원점에서 어느 쪽으로 몇 칸?',`<div class="figbox">${nlSVG({min:-5,max:5,pts:[{v:-4,l:'A'},{v:-1,l:'B'},{v:2,l:'C'}],hops:{a:0,b:-4}})}</div>
     <p>점 A는 원점에서 <b style="color:${NC}">왼쪽으로 4칸</b> → <b class="rm" style="color:${NC}">${MI}4</b><br>점 C는 원점에서 <b style="color:${PC}">오른쪽으로 2칸</b> → <b class="rm" style="color:${PC}">+2</b></p>
     <div class="box" style="margin:0"><b>핵심 낱말</b> · 방향이 <b>부호</b>, 칸 수가 <b>숫자</b>예요.</div>`)+
   fold(3,'분수와 소수도 수직선 위에','한 칸을 똑같이 나누기',`<div class="figbox">${nlSVG({min:-3,max:3,sub:2,pts:[{v:-1.5,l:'P'},{v:0.5,l:'Q'}]})}</div>
     <p>한 칸을 둘로 똑같이 나누면 작은 눈금 하나는 <span class="rm">${FR(1,2)}</span>이에요.<br>점 P는 왼쪽으로 작은 눈금 3개 → <b class="rm" style="color:${NC}">${MI}${FR(3,2)}</b> (= ${MI}1.5)<br>점 Q는 오른쪽으로 작은 눈금 1개 → <b class="rm" style="color:${PC}">+${FR(1,2)}</b> (= +0.5)</p>`));
  wireFolds(body,'numline')};

CONCEPT.abs=body=>{
  body.innerHTML=foldPanel('절댓값',`<p class="lead">수직선에서 어떤 수를 나타내는 점과 원점 사이의 <b class="mark">거리</b>를 그 수의 ${T('절댓값')}이라고 해요.</p>`,
   fold(1,'원점에서 떨어진 거리','+4와 −4는 거리가 같아요',`<div class="figbox">${nlSVG({min:-5,max:5,pts:[{v:-4},{v:4}],span:[{a:-4,b:0,lab:'4'},{a:0,b:4,lab:'4'}]})}</div>
     <p>+4와 ${MI}4는 방향은 반대지만 원점에서 똑같이 <b>4칸</b> 떨어져 있어요.</p>
     <div class="box" style="margin:0"><span class="rm">|+4| = 4, &nbsp;|${MI}4| = 4, &nbsp;|0| = 0</span><br>기호 <span class="rm">| |</span> 안의 수의 절댓값을 나타내요. <span class="rm">|${MI}4|</span>는 ‘${MI}4의 절댓값’이라고 읽어요.</div>`,true)+
   fold(2,'부호를 떼면 절댓값','방향은 지우고 거리만',`<p style="margin-top:0">절댓값은 <b>방향(부호)을 지우고 거리(숫자)만</b> 남긴 것이에요. 학교에서 동쪽으로 3 km 간 친구와 서쪽으로 3 km 간 친구는 학교에서 떨어진 거리가 같아요.</p>
     <div class="tablewrap"><table class="t"><tbody><tr><th>수</th><td class="rm">+7</td><td class="rm">${MI}7</td><td class="rm">${MI}${FR(2,3)}</td><td class="rm">+1.5</td><td class="rm">0</td></tr><tr><th>절댓값</th><td class="rm">7</td><td class="rm">7</td><td class="rm">${FR(2,3)}</td><td class="rm">1.5</td><td class="rm">0</td></tr></tbody></table></div>`)+
   fold(3,'꼭 기억할 두 가지','절댓값이 3인 수는 두 개',`<div class="figbox">${nlSVG({min:-5,max:5,pts:[{v:-3,l:MI+'3'},{v:3,l:'+3'}],hops:{a:0,b:3}})}</div>
     <p>· 절댓값이 3인 수는 <b class="rm">+3</b>과 <b class="rm">${MI}3</b>, <b>두 개</b>예요. (절댓값이 0인 수는 0 하나뿐)<br>· 절댓값은 거리라서 <b>항상 0보다 크거나 같아요</b>. 음수가 될 수 없어요.<br>· 원점에서 멀수록 절댓값이 커요.</p>`));
  wireFolds(body,'abs')};

/* 덧셈 그림: 수직선 화살표 + 칩 */
function addNL(a,b,o={}){const s=a+b,[mn,mx]=nlRange([a,s],5);return nlSVG({min:mn,max:mx,arrows:[{a:0,b:a,lab:(a>0?'+':MI)+Math.abs(a)},{a,b:s,lab:(b>0?'+':MI)+Math.abs(b)}],pts:o.ans?[{v:s,l:sgnTxt(s)}]:[],tb:o.tb,W:o.W})}
function addChips(a,b,o={}){const P=(a>0?a:0)+(b>0?b:0),N=(a<0?-a:0)+(b<0?-b:0);return chipsSVG(P,N,{pairs:o.pair?Math.min(P,N):0,cancel:o.pair})}

CONCEPT.iadd=body=>{
  body.innerHTML=foldPanel('정수와 유리수의 덧셈',`<p class="lead">두 가지 모델로 덧셈을 봐요. <b class="mark">수직선</b>에서는 움직이기, <b class="mark">칩</b>에서는 모으고 지우기예요.</p>`,
   fold(1,'수직선: 로봇처럼 움직이기','+는 오른쪽, −는 왼쪽',`<p style="margin-top:0">0에서 출발해 첫째 수만큼 움직이고, 그 자리에서 둘째 수만큼 또 움직여요. 도착한 곳이 답이에요.</p>
     <div class="duo"><div class="figbox">${addNL(3,2,{ans:1})}<div class="figcap"><span class="rm">(+3) + (+2) = +5</span><br>오른쪽 3칸, 또 오른쪽 2칸</div></div>
     <div class="figbox">${addNL(3,-5,{ans:1})}<div class="figcap"><span class="rm">(+3) + (${MI}5) = ${MI}2</span><br>오른쪽 3칸, 다시 왼쪽 5칸</div></div></div>`,true)+
   fold(2,'칩: 0 쌍 지우기','+ 칩과 − 칩이 만나면 0',`<p style="margin-top:0"><span class="chipi p">+</span>는 +1, <span class="chipi n">${MI}</span>는 ${MI}1이에요. <span class="chipi p">+</span>와 <span class="chipi n">${MI}</span> 하나씩은 합이 0이라서 지워도 돼요. 이것을 <b>0 쌍</b>이라고 불러요.</p>
     <div class="duo"><div class="figbox">${addChips(-2,-3)}<div class="figcap"><span class="rm">(${MI}2) + (${MI}3) = ${MI}5</span><br>같은 칩끼리 모으면 ${MI} 칩 5개</div></div>
     <div class="figbox">${addChips(3,-5,{pair:1})}<div class="figcap"><span class="rm">(+3) + (${MI}5) = ${MI}2</span><br>0 쌍 3개를 지우면 ${MI} 칩 2개가 남아요</div></div></div>`)+
   fold(3,'규칙 찾기','같은 부호면 모으기, 다른 부호면 지우기',`<div class="tablewrap"><table class="t"><thead><tr><th></th><th>절댓값</th><th>부호</th><th>예</th></tr></thead><tbody>
     <tr><th>부호가 같을 때</th><td>두 수의 절댓값의 <b>합</b></td><td>두 수의 <b>공통인 부호</b></td><td class="rm">(${MI}2)+(${MI}3)<br>= ${MI}(2+3) = ${MI}5</td></tr>
     <tr><th>부호가 다를 때</th><td>두 수의 절댓값의 <b>차</b><br><small>(큰 것 ${MI} 작은 것)</small></td><td>절댓값이 <b>큰 수의 부호</b></td><td class="rm">(+3)+(${MI}5)<br>= ${MI}(5${MI}3) = ${MI}2</td></tr></tbody></table></div>
     <div class="box" style="margin-bottom:0"><b>핵심 낱말</b> · 부호가 같으면 <b>모으기</b>(같은 칩이 쌓여요), 다르면 <b>짝지어 지우기</b>(남은 칩의 부호가 답의 부호). 절댓값이 같고 부호가 다른 두 수의 합은 0이에요.</div>`)+
   fold(4,'분수와 소수도 똑같이','규칙은 그대로',`<p style="margin-top:0" class="rm">(${MI}1.5) + (+0.5) = ${MI}(1.5 ${MI} 0.5) = ${MI}1</p><p class="rm">(+${FR(1,4)}) + (+${FR(2,4)}) = +(${FR(1,4)} + ${FR(2,4)}) = +${FR(3,4)}</p><p style="margin-bottom:0">분모가 다르면 먼저 ${T('통분')}해요. 부호와 절댓값을 따로 생각하는 방법은 정수와 같아요.</p>`));
  wireFolds(body,'iadd')};

CONCEPT.isub=body=>{
  body.innerHTML=foldPanel('정수와 유리수의 뺄셈',`<p class="lead">뺄셈은 <b class="mark">빼는 수의 부호를 바꾸어 더하는 것</b>과 같아요. 왜 그런지 칩으로 확인해 봐요.</p>`,
   fold(1,'칩으로 빼기: 덜어 내기','모자라면 0 쌍을 넣어요',`<p style="margin-top:0">빼기는 칩을 <b>덜어 내는</b> 거예요. 덜어 낼 칩이 모자라면 <b>0 쌍</b>(<span class="chipi p">+</span><span class="chipi n">${MI}</span>)을 넣어요. 0을 더했으니 값은 그대로예요.</p>
     <div class="figbox">${chipsSVG(5,3,{ghostP:3,ghostN:3,pairs:0})}<div class="figcap"><span class="rm">(+2) ${MI} (${MI}3)</span> · + 칩 2개에 0 쌍 3개(점선)를 넣고 ${MI} 칩 3개를 덜어 내면 <b>+ 칩 5개</b> → <b class="rm">+5</b></div></div>
     <p style="margin-bottom:0">결과를 보면 ${MI}3을 덜어 낸 것은 +3을 더한 것과 같아요. <span class="rm">(+2) ${MI} (${MI}3) = (+2) + (+3) = +5</span></p>`,true)+
   fold(2,'수직선: 반대 방향으로','더하기와 반대로 움직이기',`<p style="margin-top:0">더할 때 +는 오른쪽이었죠? 뺄 때는 <b>반대로</b> 움직여요. ${MI}3을 빼면 오른쪽으로 3칸.</p>
     <div class="figbox">${nlSVG({min:-1,max:7,arrows:[{a:0,b:2,lab:'+2'},{a:2,b:5,lab:MI+'(−3) → +3'}],pts:[{v:5,l:'+5'}]})}</div>`)+
   fold(3,'교과서 규칙','부호를 바꾸어 더하기',`<div class="box" style="margin-top:0;font-size:19px">두 수의 뺄셈은 <b>빼는 수의 부호를 바꾸어</b> 덧셈으로 고쳐서 계산해요.</div>
     <p class="rm" style="font-size:19px">(+2) ${MI} (+5) = (+2) + (${MI}5) = ${MI}3<br>(${MI}4) ${MI} (${MI}6) = (${MI}4) + (+6) = +2</p>
     <p style="margin-bottom:0"><b>앞의 수는 그대로</b>, 빼기 기호는 더하기로, 빼는 수의 부호만 바꿔요. 바꾼 다음은 덧셈 규칙으로 풀어요.</p>`)+
   fold(4,'자주 하는 실수','앞의 수까지 바꾸지 않기',`<p style="margin-top:0">✕ <span class="rm">(${MI}4) ${MI} (+1) = (+4) + (${MI}1)</span> ← 앞의 수까지 바꿨어요.<br>○ <span class="rm">(${MI}4) ${MI} (+1) = (${MI}4) + (${MI}1) = ${MI}5</span></p><p style="margin-bottom:0">기온의 차(일교차)처럼 ‘얼마나 차이 나는지’ 구할 때 뺄셈을 써요. <span class="rm">(+3) ${MI} (${MI}5) = +8</span>, 차이는 8 °C예요.</p>`));
  wireFolds(body,'isub')};

/* ── 탐구 공통: 라운드 진행 ── */
function rounds(host,list,show,done,onceKey){let i=0;const log=[];
  host.innerHTML=`<div class="ix"><div class="ixTop"><span class="ixN rm"></span></div><div class="ixFig"></div><div class="ixQ"></div><div class="ixA"></div><div class="flmsg ixMsg" aria-live="polite"></div><div class="ixLog chips"></div></div>`;
  const api={fig:h=>{$('.ixFig',host).innerHTML=h},q:h=>{$('.ixQ',host).innerHTML=h},a:n=>{const A=$('.ixA',host);A.innerHTML='';if(n)A.appendChild(typeof n==='string'?el(n):n)},
    msg:(h,ok)=>{const m=$('.ixMsg',host);m.className='flmsg ixMsg'+(ok===false?' bad':'');m.innerHTML=h},
    next:(logTxt)=>{if(logTxt)log.push(logTxt);$('.ixLog',host).innerHTML=log.map(t=>`<span class="chip">○ ${t}</span>`).join('');i++;setTimeout(go,700)},host};
  function go(){if(i>=list.length){api.q('');api.a('');api.msg(`<span class="ok">${list.length}개를 모두 해냈어요!</span>`);done();if(onceKey)award(3,onceKey);return}
    $('.ixN',host).textContent=`${i+1} / ${list.length}`;api.msg('');show(list[i],api,i)}
  go();return api}
function snAsk(api,ans,o,onOk){window.__ia={k:'sn',v:ans};const st={type:'sn',ans,suffix:o.suffix||'',needSign:!!o.needSign};let tries=0;
  api.a(answerUI(st,v=>{const c=check(st,v);if(c===true){onOk(v);return true}if(c==='nosign'){api.msg('✕ 양수는 + 를 붙여요. + 를 먼저 누르고 숫자를 눌러요.',false);return false}tries++;api.msg('✕ '+(typeof o.hint==='function'?o.hint(tries):o.hint||'다시 해 볼까요?'),false);
    if(tries>=3)api.msg(`✕ 정답은 <b class="rm">${o.ansText||sgnTxt(ans)}</b>이에요. 확인하고 넘어가요.`,false),setTimeout(()=>onOk(null),1600);return false}))}
function numAsk(api,ans,o,onOk){window.__ia={k:'num',v:ans};const st={type:'num',ans,suffix:o.suffix||''};let tries=0;
  api.a(answerUI(st,v=>{if(check(st,v)){onOk(v);return true}tries++;api.msg('✕ '+(o.hint||'다시 해 볼까요?'),false);if(tries>=3){api.msg(`✕ 정답은 <b class="rm">${ans}</b>이에요.`,false);setTimeout(()=>onOk(null),1600)}return false}))}
function choiceAsk(api,choices,ans,o,onOk){window.__ia={k:'ch',v:ans};const box=el('<div class="choices"></div>');choices.forEach(c=>{const b=el('<button type="button"></button>');b.innerHTML=c;
  b.onclick=()=>{if(c===ans){b.classList.add('picked');onOk(c)}else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);api.msg('✕ '+(o.hint||'다시 생각해 볼까요?'),false)}};box.appendChild(b)});api.a(box)}
const shk=n=>{n.classList.add('shake');setTimeout(()=>n.classList.remove('shake'),400)};

/* 1차시 탐구 */
function thermoAct(host,done){const r=mulberry(newSeed());const L=shuffle(r,[ri(r,2,9),-ri(r,2,9),-ri(r,1,4),ri(r,1,4),-ri(r,5,10)]);
  rounds(host,L,(t,api)=>{api.fig(`<div class="thermobox">${thermoSVG(t,{wide:true})}</div>`);api.q('온도계가 가리키는 기온을 부호 +, −를 사용하여 나타내면?');
    snAsk(api,t,{suffix:'°C',needSign:true,hint:n=>n===1?'0 °C보다 위인가요, 아래인가요? 위면 + 를, 아래면 − 를 먼저 눌러요.':`눈금 한 칸은 1 °C예요. 0에서부터 세어 보세요.`},()=>{api.msg(`<span class="ok">○ ${t>0?'영상':'영하'} ${Math.abs(t)} °C → ${sgnTxt(t)} °C</span>`);api.next(`${t>0?'영상':'영하'} ${Math.abs(t)} °C = ${sgnTxt(t)} °C`)})},done,'i:thermo')}
function oppAct(host,done){const r=mulberry(newSeed());const L=shuffle(r,SIT.slice()).slice(0,6);
  rounds(host,L,(S,api)=>{const k1=pick(r,S.ks),k2=pick(r,S.ks.filter(k=>k!==k1)),flip=r()<0.35;
    const given=flip?S.n:S.p,giv=flip?-k1:k1,ask=flip?S.p:S.n,av=flip?k2:-k2;
    api.fig(`<div class="oppcard"><div><span class="w" style="color:${giv>0?PC:NC}">${S.ph(given,k1)}</span><span class="arr">→</span><b class="rm" style="color:${giv>0?PC:NC}">${sgnTxt(giv)} ${S.u}</b></div><div><span class="w" style="color:${av>0?PC:NC}">${S.ph(ask,k2)}</span><span class="arr">→</span><b class="rm">?</b></div><small>기준: ${S.base}</small></div>`);
    api.q(`‘${given}’${jong(given)?'과':'와'} 반대인 ‘${ask}’${jong(ask)?'은':'는'} 어떻게 나타낼까요?`);
    const ch=shuffle(r,[sgnTxt(k2)+' '+S.u,sgnTxt(-k2)+' '+S.u]);
    choiceAsk(api,ch,sgnTxt(av)+' '+S.u,{hint:`${josa(given,'이','가')} ${sgnTxt(giv)[0]}이면 반대말 ${josa(ask,'은','는')} 반대 부호예요.`},()=>{api.msg(`<span class="ok">○ ${S.ph(ask,k2)} = ${sgnTxt(av)} ${S.u}</span>`);api.next(`${S.ph(ask,k2)} = ${sgnTxt(av)}`)})},done,'i:opp')}
function sortAct(host,done){const r=mulberry(newSeed());
  const pool=[Q(5),Q(-2),Q(0),Q(7),Q(-9),Q(3,10,true),Q(-8,10,true),Q(1,2),Q(-3,4),Q(12),Q(-1)];/* 1차시라 양수도 + 를 붙여 보여 줌 */
  const L=shuffle(r,pool).slice(0,9);if(!L.some(x=>x.p===0))L[ri(r,2,8)]=Q(0);
  const cat=x=>x.p>0?'p':x.p<0?'n':'z';const NM={p:'양수',n:'음수',z:'둘 다 아님'};const placed={p:[],n:[],z:[]};
  host.innerHTML=`<div class="ix"><div class="ixTop"><span class="ixN rm"></span></div><div class="sortcard rm"></div><div class="sortbtns">${['p','n','z'].map(k=>`<button type="button" class="sbtn ${k}" data-k="${k}">${NM[k]}</button>`).join('')}</div><div class="flmsg ixMsg"></div>
    <div class="sort3">${['p','n','z'].map(k=>`<div class="bin ${k}"><b>${NM[k]}</b><div class="binIn" data-b="${k}"></div></div>`).join('')}</div></div>`;
  let i=0,miss=0;const msg=(h,bad)=>{const m=$('.ixMsg',host);m.className='flmsg ixMsg'+(bad?' bad':'');m.innerHTML=h};
  const show=()=>{if(i>=L.length){$('.sortcard',host).innerHTML='끝!';$('.sortbtns',host).hidden=true;msg(`<span class="ok">모두 분류했어요! ${miss?'':'한 번도 틀리지 않았어요. '}0은 기준이라 양수도 음수도 아니에요.</span>`);done();award(3,'i:sort');return}
    $('.ixN',host).textContent=`${i+1} / ${L.length}`;$('.sortcard',host).innerHTML=qH(L[i]);window.__ia={k:'sort',v:cat(L[i])}};
  $$('.sbtn',host).forEach(b=>b.onclick=()=>{const x=L[i];if(!x)return;const c=cat(x);
    if(b.dataset.k===c){$(`.binIn[data-b="${c}"]`,host).insertAdjacentHTML('beforeend',`<span class="tok rm">${qH(x)} <i class="okm">○</i></span>`);msg(`<span class="ok">○ ${qS(x)}은(는) ${NM[c]}</span>`);i++;setTimeout(show,450)}
    else{miss++;shk(b);msg('✕ '+(x.p===0?'0은 기준이에요. 0보다 큰가요, 작은가요?':'0보다 큰 수가 양수, 작은 수가 음수예요.'),true)}});
  show()}
EXPLORE.sign=body=>{actNav(body,'sign',[
  {key:'thermo',t:'온도계 읽기',lead:'영상은 +, 영하는 − 를 붙여요. 키패드의 + 나 − 를 먼저 누르고 숫자를 눌러요.',mount:thermoAct},
  {key:'opp',t:'반대말에 부호 붙이기',lead:'기준을 생각하며, 반대가 되는 말에 반대 부호를 붙여요.',mount:oppAct},
  {key:'sort',t:'양수 · 음수 · 둘 다 아님',lead:'수를 보고 알맞은 상자를 누르세요. 0은 어디에 들어갈까요?',mount:sortAct}])};

/* 2차시 탐구 */
function readAct(host,done){const r=mulberry(newSeed());const L=[ri(r,1,4),-ri(r,2,5),-ri(r,1,5),Q(-ri(r,1,4)*2-1,2),Q(ri(r,0,3)*2+1,2),Q(-ri(r,0,2)*2-1,2)].map(x=>typeof x==='number'?Q(x):x);
  rounds(host,L,(x,api,i)=>{const sub=x.q===2?2:1,v=qv(x);let hint=0;const draw=h=>api.fig(`<div class="figbox">${nlSVG({min:-5,max:5,sub,pts:[{v,l:'P'}],hops:h?{a:0,b:v}:null})}</div>`);draw(false);
    api.q(sub===2?'점 P가 나타내는 수는? <small class="muted">(한 칸을 둘로 나눴어요. 분수로 답할 때는 / 를 써요. 예: −3/2)</small>':'점 P가 나타내는 수는?');
    snAsk(api,v,{ansText:qS(x),hint:n=>{if(n===1){draw(true);return'원점에서 몇 칸 뛰었는지 세어 보세요. 왼쪽이면 − 예요.'}return sub===2?'작은 눈금 하나는 1/2이에요.':'칸 수가 숫자, 방향이 부호예요.'}},()=>api.next(`P = ${qS(x)}`))},done,'i:read')}
function placeAct(host,done){const r=mulberry(newSeed());const L=[Q(-3),Q(4),Q(-1),Q(0),Q(-5,2),Q(3,2)];L.splice(0,4,...shuffle(r,L.slice(0,4)));
  rounds(host,L,(x,api)=>{const sub=x.q===2?2:1,v=qv(x);let tries=0;const draw=(pts)=>{api.fig(`<div class="figbox nlTap">${nlSVG({min:-5,max:5,sub,hit:true,pts})}</div>`);
      $$('.nlhit',api.host).forEach(h=>h.onclick=()=>{const t=+h.dataset.v;if(Math.abs(t-v)<1e-9){draw([{v,l:qS(x),x:''}]);api.msg(`<span class="ok">○ ${qS(x)}의 자리예요.</span>`,true);api.next(qS(x))}
        else{tries++;draw([{v:t,hollow:true,x:'✕'}]);api.msg('✕ '+(tries>=2?`원점에서 ${v>0?'오른쪽':'왼쪽'}으로 ${sub===2?'작은 눈금 '+Math.abs(v*2)+'개':Math.abs(v)+'칸'}이에요.`:v===0?'0은 원점이에요.':`${v>0?'+는 오른쪽':'− 는 왼쪽'}이에요. 몇 칸인지 세어 보세요.`),false)}})};
    draw([]);window.__ia={k:'tap',v};api.q(`수직선에서 <b class="rm">${qH(x)}</b>의 자리를 눌러 보세요.`);api.a('')},done,'i:place')}
function moveAct(host,done){const r=mulberry(newSeed());const L=[[ri(r,-3,1),ri(r,2,4)],[ri(r,0,3),-ri(r,3,5)],[-ri(r,1,3),-ri(r,1,2)],[ri(r,2,4),-ri(r,5,7)]];
  rounds(host,L,([s,k],api)=>{let pos=s,moves=0;const tgt=s+k;const draw=()=>api.fig(`<div class="figbox">${nlSVG({min:-7,max:7,pts:[{v:s,hollow:true,c:'#888'}],robot:pos,arrows:pos!==s?[{a:s,b:pos}]:[]})}</div>`);
    window.__ia={k:'move',v:k};api.q(`로봇이 <b class="rm">${sgnTxt(s)}</b>에 있어요. <b>${k>0?'오른쪽':'왼쪽'}으로 ${Math.abs(k)}칸</b> 움직여 보세요.`);draw();
    const ctl=el(`<div class="mv"><button type="button" class="btn mvL" aria-label="왼쪽으로 한 칸">← 왼쪽</button><button type="button" class="btn mvR" aria-label="오른쪽으로 한 칸">오른쪽 →</button><button type="button" class="btn ghost mvB">처음부터</button></div>`);api.a(ctl);
    const step=d=>{if(pos+d<-7||pos+d>7)return;pos+=d;moves++;draw();if(pos===tgt&&moves===Math.abs(k)){ctl.remove();api.msg('');api.q(`로봇이 도착한 곳의 수는?`);snAsk(api,tgt,{hint:'로봇 발 밑의 눈금을 읽어요.'},()=>{api.msg(`<span class="ok">○ ${sgnTxt(s)}에서 ${k>0?'오른쪽':'왼쪽'}으로 ${Math.abs(k)}칸 → ${sgnTxt(tgt)}</span>`);api.next(`${sgnTxt(s)} → ${sgnTxt(tgt)}`)})}
      else if(moves>=Math.abs(k)||(Math.sign(d)!==Math.sign(k))){api.msg(Math.sign(d)!==Math.sign(k)?`✕ ${k>0?'오른쪽':'왼쪽'}으로 가야 해요. ‘처음부터’를 눌러요.`:'✕ 칸 수를 다시 세어 볼까요? ‘처음부터’를 눌러요.',false)}};
    $('.mvL',ctl).onclick=()=>step(-1);$('.mvR',ctl).onclick=()=>step(1);$('.mvB',ctl).onclick=()=>{pos=s;moves=0;api.msg('');draw()}},done,'i:move')}
EXPLORE.numline=body=>{actNav(body,'numline',[
  {key:'read',t:'점이 나타내는 수 읽기',lead:'원점에서 어느 쪽으로 몇 칸인지 세어요.',mount:readAct},
  {key:'place',t:'수직선에 점 찍기',lead:'수의 자리를 수직선에서 직접 눌러요.',mount:placeAct},
  {key:'move',t:'로봇 움직이기',lead:'로봇을 왼쪽·오른쪽으로 움직여요. 다음에 배울 덧셈의 준비예요.',mount:moveAct}])};

/* 3차시 탐구 */
function hopAct(host,done){const r=mulberry(newSeed());const L=shuffle(r,[-ri(r,3,6),ri(r,2,5),-ri(r,1,2),ri(r,5,7),-7]);
  rounds(host,L,(x,api)=>{let pos=x,hops=0;const draw=()=>api.fig(`<div class="figbox">${nlSVG({min:nlRange([x],4)[0],max:nlRange([x],4)[1],pts:[{v:x,l:sgnTxt(x)}],robot:pos,hops:hops?{a:x,b:pos}:null})}</div>`);draw();
    window.__ia={k:'hop'};api.q(`로봇이 <b class="rm">${sgnTxt(x)}</b>에서 원점 O까지 가요. 버튼을 눌러 한 칸씩 가 보세요.`);
    const b=el(`<div class="mv"><button type="button" class="btn primary">원점 쪽으로 한 칸 <span class="rm hopN">0</span></button></div>`);api.a(b);
    $('button',b).onclick=()=>{pos-=Math.sign(pos);hops++;$('.hopN',b).textContent=hops;draw();if(pos===0){api.q(`원점까지 몇 칸 갔나요? 이 수가 <b class="rm">|${sgnTxt(x).replace('-',MI)}|</b>예요.`);numAsk(api,Math.abs(x),{suffix:'',hint:'뛴 횟수를 세어요.'},()=>{api.msg(`<span class="ok">○ |${sgnTxt(x)}| = ${Math.abs(x)}</span>`);api.next(`|${sgnTxt(x)}| = ${Math.abs(x)}`)})}}},done,'i:hop')}
function pairAct(host,done){const L=[3,5,0,2.5,6];
  rounds(host,L,(a,api)=>{const sub=a%1?2:1,need=a===0?[0]:[a,-a];let got=[];const draw=(bad)=>{api.fig(`<div class="figbox nlTap">${nlSVG({min:-7,max:7,sub,hit:true,pts:[...got.map(v=>({v,l:sgnTxt(v)})),...(bad!=null?[{v:bad,hollow:true,x:'✕'}]:[])],span:got.length===need.length&&a?[{a:-a,b:0,lab:String(a)},{a:0,b:a,lab:String(a)}]:null})}</div>`);
      $$('.nlhit',api.host).forEach(h=>h.onclick=()=>{const t=+h.dataset.v;if(need.includes(t)&&!got.includes(t)){got.push(t);draw();if(got.length<need.length)api.msg('○ 하나 찾았어요. 또 있을까요?',true);}
        else if(!got.includes(t)){draw(t);api.msg(`✕ ${sgnTxt(t)}은(는) 원점에서 ${Math.abs(t)}만큼 떨어져 있어요.`,false)}})};
    draw();window.__ia={k:'taps',v:need};api.q(`절댓값이 <b class="rm">${a}</b>인 수를 <b>모두</b> 찾아 눌러요. 다 찾았으면 아래 버튼을 눌러요.`);
    const b=el('<div class="mv"><button type="button" class="btn primary">다 찾았어요</button></div>');api.a(b);
    $('button',b).onclick=()=>{if(got.length===need.length){api.msg(`<span class="ok">○ 절댓값이 ${a}인 수는 ${need.map(sgnTxt).join(', ')} · ${need.length}개${a===0?' (0은 하나뿐이에요!)':''}</span>`);api.next(`|x| = ${a} → ${need.map(sgnTxt).join(', ')}`)}
      else api.msg('✕ 하나 더 있어요. 원점의 반대쪽도 살펴보세요.',false)}},done,'i:pair')}
function farAct(host,done){const r=mulberry(newSeed());const L=range(5).map(()=>{let a,b;do{a=ri(r,-8,8);b=ri(r,-8,8)}while(a===b||Math.abs(a)===Math.abs(b)||!a||!b||Math.sign(a)===Math.sign(b)&&r()<0.6);return[a,b]});
  rounds(host,L,([a,b],api)=>{const[mn,mx]=nlRange([a,b],4);api.fig(`<div class="figbox">${nlSVG({min:mn,max:mx,pts:[{v:a,l:sgnTxt(a)},{v:b,l:sgnTxt(b)}]})}</div>`);api.q('원점 O에서 <b>더 멀리</b> 있는 수, 곧 절댓값이 더 큰 수는?');
    const big=Math.abs(a)>Math.abs(b)?a:b;choiceAsk(api,[sgnTxt(a),sgnTxt(b)],sgnTxt(big),{hint:'부호는 잊고, 원점에서 몇 칸인지만 비교해요.'},()=>{api.fig(`<div class="figbox">${nlSVG({min:mn,max:mx,pts:[{v:a,l:sgnTxt(a)},{v:b,l:sgnTxt(b)}],span:[{a:Math.min(0,big),b:Math.max(0,big),lab:String(Math.abs(big))}]})}</div>`);
      api.msg(`<span class="ok">○ |${sgnTxt(a)}| = ${Math.abs(a)}, |${sgnTxt(b)}| = ${Math.abs(b)}</span>`);api.next(`${sgnTxt(big)}이 더 멀어요`)})},done,'i:far')}
EXPLORE.abs=body=>{actNav(body,'abs',[
  {key:'hop',t:'원점까지 몇 칸?',lead:'원점까지 뛴 칸 수가 절댓값이에요.',mount:hopAct},
  {key:'pair',t:'절댓값이 같은 수 찾기',lead:'원점에서 같은 거리에 있는 점은 몇 개일까요?',mount:pairAct},
  {key:'far',t:'원점에서 더 먼 수',lead:'절댓값이 크다 = 원점에서 멀다.',mount:farAct}])};

/* 4차시 탐구 */
function robotAct(host,done){const r=mulberry(newSeed());const C=shuffle(r,[[1,1],[-1,-1],[1,-1],[-1,1]]);const L=C.map(([sa,sb])=>{const a=sa*ri(r,1,5),b=sb*ri(r,1,5);return[a,b]});
  rounds(host,L,([a,b],api)=>{let ph=0,pos=0,moves=0;const draw=()=>{const ar=[];if(ph>=1||pos!==0)ar.push({a:0,b:ph>=1?a:pos,lab:ph>=1?sgnTxt(a):''});if(ph>=1&&pos!==a)ar.push({a,b:pos,lab:ph>=2?sgnTxt(b):''});
      const[mn,mx]=nlRange([a,a+b],4);api.fig(`<div class="eqq rm">(${sgnTxt(a)}) + (${sgnTxt(b)}) = ?</div><div class="figbox">${nlSVG({min:mn,max:mx,robot:pos,arrows:ar})}</div>`)};
    const ctl=el(`<div class="mv"><button type="button" class="btn mvL">← 왼쪽</button><button type="button" class="btn mvR">오른쪽 →</button><button type="button" class="btn ghost mvB">다시</button></div>`);
    const say=()=>api.q(ph===0?`먼저 첫째 수 <b class="rm">${sgnTxt(a)}</b>만큼 움직여요. (0에서 출발)`:`이번에는 그 자리에서 둘째 수 <b class="rm">${sgnTxt(b)}</b>만큼 움직여요.`);
    const[mn,mx]=nlRange([a,a+b],4);const step=d=>{const want=ph===0?a:b;if(pos+d<mn||pos+d>mx)return;if(Math.sign(d)!==Math.sign(want)){api.msg(`✕ ${want>0?'+는 오른쪽':'− 는 왼쪽'}이에요.`,false);return}
      if(moves>=Math.abs(want)){api.msg('✕ 칸 수를 넘었어요. ‘다시’를 눌러요.',false);return}pos+=d;moves++;api.msg('');draw();
      if(moves===Math.abs(want)){if(ph===0){ph=1;moves=0;draw();say()}else{ph=2;draw();ctl.remove();api.q('로봇이 도착한 곳은? 이것이 덧셈의 답이에요.');snAsk(api,a+b,{hint:'로봇 발 밑의 눈금을 읽어요.'},()=>{api.msg(`<span class="ok">○ (${sgnTxt(a)}) + (${sgnTxt(b)}) = ${sgnTxt(a+b)}</span>`);api.next(`(${sgnTxt(a)})+(${sgnTxt(b)}) = ${sgnTxt(a+b)}`)})}}};
    $('.mvL',ctl).onclick=()=>step(-1);$('.mvR',ctl).onclick=()=>step(1);$('.mvB',ctl).onclick=()=>{ph=0;pos=0;moves=0;api.msg('');draw();say()};
    draw();say();api.a(ctl);window.__ia={k:'robot',a,b}},done,'i:robot')}
/* 칩 판: 탭해서 짝짓기(덧셈) 또는 덜어 내기(뺄셈) */
function chipBoard(api,P,N,o){let sel=null;const board=el(`<div class="chipbd"><div class="chiparea" data-r="p"></div><div class="chiparea" data-r="n"></div>${o.tools||''}</div>`);
  const mk=(p,isNew)=>{const b=el(`<button type="button" class="chipb ${p?'p':'n'}${isNew?' new':''}" aria-label="${p?'양의':'음의'} 칩">${p?'+':MI}</button>`);b.onclick=()=>o.tap(b,p);return b};
  const add=(p,isNew)=>$(`.chiparea[data-r="${p?'p':'n'}"]`,board).appendChild(mk(p,isNew));
  range(P).forEach(()=>add(true));range(N).forEach(()=>add(false));api.fig('');$('.ixFig',api.host).appendChild(board);
  return{board,add,count:()=>({p:$$('.chipb.p:not(.gone)',board).length,n:$$('.chipb.n:not(.gone)',board).length}),sel:()=>sel,setSel:b=>{if(sel)sel.classList.remove('sel');sel=b;if(b)b.classList.add('sel')},
    remove:b=>{b.classList.add('gone');setTimeout(()=>b.remove(),330)}}}
function chipAct(host,done){const r=mulberry(newSeed());const L=shuffle(r,[[ri(r,2,4),-ri(r,5,7)],[-ri(r,2,4),ri(r,5,7)],[ri(r,4,6),-ri(r,1,3)],[-ri(r,2,3),-ri(r,2,3)]]);
  rounds(host,L,([a,b],api)=>{const P=(a>0?a:0)+(b>0?b:0),N=(a<0?-a:0)+(b<0?-b:0);let pairs=0;
    api.q(`<span class="rm">(${sgnTxt(a)}) + (${sgnTxt(b)})</span> · ${P&&N?'<b>+ 칩 하나와 − 칩 하나</b>를 차례로 눌러 0 쌍을 지워요.':'칩의 부호가 같아요. 지울 0 쌍이 없어요. 모두 몇 개인가요?'}`);
    const finish=()=>{const c=B.count();api.q(`0 쌍 ${pairs}개를 지웠어요. 남은 칩은 <b>${c.p?'+ 칩 '+c.p+'개':c.n?'− 칩 '+c.n+'개':'없어요'}</b>. 계산 결과는?`);snAsk(api,a+b,{hint:'남은 칩의 부호와 개수예요. − 칩이 남으면 − 를 먼저 눌러요.'},()=>{api.msg(`<span class="ok">○ (${sgnTxt(a)}) + (${sgnTxt(b)}) = ${sgnTxt(a+b)}</span>`);api.next(`(${sgnTxt(a)})+(${sgnTxt(b)}) = ${sgnTxt(a+b)}`)})};
    const B=chipBoard(api,P,N,{tap:(btn,p)=>{const s=B.sel();if(!s){B.setSel(btn);return}if(s===btn){B.setSel(null);return}
      if(s.classList.contains('p')===p){B.setSel(btn);api.msg('같은 부호끼리는 0이 안 돼요. 반대 부호 칩을 골라요.',false);return}
      B.remove(s);B.remove(btn);B.setSel(null);pairs++;api.msg(`○ 0 쌍 ${pairs}개 지움`,true);setTimeout(()=>{const c=B.count();if(!c.p||!c.n)finish()},360)}});
    window.__ia={k:'chip'};if(!P||!N)finish()},done,'i:chip')}
function ruleAct(host,done){const r=mulberry(newSeed());const C=[[1,1],[-1,-1],[1,-1],[-1,1]];const L=C.map(([sa,sb])=>{let a,b;do{a=sa*ri(r,1,6);b=sb*ri(r,1,6)}while(Math.abs(a)===Math.abs(b));return[a,b]});const rec=[];
  const api=rounds(host,L,([a,b],api)=>{const same=Math.sign(a)===Math.sign(b);api.fig(`<div class="eqq rm">(${sgnTxt(a)}) + (${sgnTxt(b)})</div><div class="duo"><div class="figbox">${addChips(a,b,{pair:!same})}</div><div class="figbox">${addNL(a,b)}</div></div>`);
    api.q(`두 수의 부호는?`);choiceAsk(api,['같다','다르다'],same?'같다':'다르다',{},()=>{
      api.q(same?`부호가 같아서 같은 칩이 쌓였어요. 칩은 모두 몇 개인가요? <small class="muted">(절댓값 ${Math.abs(a)}와 ${Math.abs(b)}를 …)</small>`:`0 쌍을 지우고 남은 칩은 몇 개인가요? <small class="muted">(절댓값 ${Math.abs(a)}와 ${Math.abs(b)}를 …)</small>`);
      numAsk(api,Math.abs(a+b),{hint:same?'두 절댓값을 더해요.':'큰 절댓값에서 작은 절댓값을 빼요.'},()=>{
        api.q('남은 칩의 부호는?');choiceAsk(api,['+','−'],a+b>0?'+':'−',{hint:same?'두 수의 부호 그대로예요.':'칩이 더 많았던 쪽, 곧 절댓값이 큰 수의 부호예요.'},()=>{rec.push({a,b,same});api.msg(`<span class="ok">○ (${sgnTxt(a)}) + (${sgnTxt(b)}) = ${sgnTxt(a+b)}</span>`);api.next(`(${sgnTxt(a)})+(${sgnTxt(b)}) = ${sgnTxt(a+b)}`)})})})},
    ()=>{const box=el(`<div class="box"><b>찾은 규칙</b><div class="tablewrap" style="margin-top:8px"><table class="t"><tbody>${rec.map(x=>`<tr><td class="rm">(${sgnTxt(x.a)}) + (${sgnTxt(x.b)}) = ${sgnTxt(x.a+x.b)}</td><td>${x.same?'같은 부호 → 절댓값을 <b>더하고</b> 그 부호':'다른 부호 → 절댓값을 <b>빼고</b> 큰 쪽 부호'}</td></tr>`).join('')}</tbody></table></div>
      <p style="margin:8px 0 0">부호가 같으면 <b>모으기</b>, 다르면 <b>짝지어 지우기</b>. 개념 3번의 표와 같아요!</p></div>`);host.querySelector('.ix').appendChild(box);done();award(3,'i:rule')},null)}
EXPLORE.iadd=body=>{actNav(body,'iadd',[
  {key:'robot',t:'로봇 걷기 (수직선)',lead:'첫째 수만큼, 그다음 둘째 수만큼 움직여요. +는 오른쪽, −는 왼쪽.',mount:robotAct},
  {key:'chip',t:'칩 짝짓기',lead:'+ 칩과 − 칩 한 쌍은 0이에요. 0 쌍을 지우고 남은 칩을 세요.',mount:chipAct},
  {key:'rule',t:'두 모델 잇기 → 규칙 찾기',lead:'칩과 수직선을 같이 보며 덧셈의 규칙을 찾아요.',mount:ruleAct}])};

/* 5차시 탐구 */
function takeAct(host,done){const L=[[5,2],[2,5],[-3,-1],[2,-3],[-1,3]];
  rounds(host,L,([a,b],api,idx)=>{const need=Math.abs(b),wantP=b>0;let taken=0,zp=0;
    api.q(`<span class="rm">(${sgnTxt(a)}) ${MI} (${sgnTxt(b)})</span> · 칩 <b class="rm">${sgnTxt(a)}</b>에서 <b>${wantP?'+':'−'} 칩 ${need}개</b>를 덜어 내요. 모자라면 ‘0 쌍 넣기’를 눌러요.`);
    const B=chipBoard(api,a>0?a:0,a<0?-a:0,{tools:`<div class="mv"><button type="button" class="btn zpBtn">0 쌍 넣기 (<span class="chipi p">+</span><span class="chipi n">${MI}</span>)</button><span class="takeN">덜어 낸 칩 <b class="rm">0</b> / ${need}</span></div>`,
      tap:(btn,p)=>{if(taken>=need)return;if(p!==wantP){api.msg(`✕ 덜어 낼 것은 ${wantP?'+':'−'} 칩이에요.`,false);shk(btn);return}B.remove(btn);taken++;$('.takeN b',B.board).textContent=taken;api.msg('');
        if(taken===need){$('.zpBtn',B.board).disabled=true;setTimeout(()=>{const c=B.count();api.q(`${zp?`0 쌍 ${zp}개를 넣고 `:''}${wantP?'+':'−'} 칩 ${need}개를 덜어 냈어요. 남은 칩이 나타내는 수는?`);
          snAsk(api,a-b,{hint:'남은 칩을 세요. + 칩과 − 칩이 섞여 있으면 0 쌍을 빼고 세요.'},()=>{api.msg(`<span class="ok">○ (${sgnTxt(a)}) ${MI} (${sgnTxt(b)}) = ${sgnTxt(a-b)}${zp&&!wantP?` · ${MI} 칩을 덜어 냈더니 + 칩이 늘었어요. (${sgnTxt(a)}) + (${sgnTxt(-b)})와 같아요!`:''}</span>`);api.next(`(${sgnTxt(a)})−(${sgnTxt(b)}) = ${sgnTxt(a-b)}`)})},380)}}});
    window.__ia={k:'take',p:wantP,n:need};$('.zpBtn',B.board).onclick=()=>{const c=B.count(),have=wantP?c.p:c.n;if(have>=need-taken){api.msg('덜어 낼 칩이 이미 충분해요. 0 쌍은 필요 없어요.',false);return}B.add(true,true);B.add(false,true);zp++;api.msg(`0 쌍 ${zp}개를 넣었어요. 0을 더했으니 값은 그대로예요.`,true)}},done,'i:take')}
function rewriteAct(host,done){const r=mulberry(newSeed());const L=range(6).map(()=>{let a,b;do{a=ri(r,-9,9);b=ri(r,-9,9)}while(!a||!b);return[a,b]});
  rounds(host,L,([a,b],api)=>{api.fig(`<div class="eqq rm">(${sgnTxt(a)}) ${MI} (${sgnTxt(b)})</div>`);api.q('빼는 수의 부호를 바꾸어 덧셈으로 나타내면?');
    const P=(x,y)=>`(${sgnTxt(x)}) + (${sgnTxt(y)})`;const ok=P(a,-b),ch=shuffle(r,[...new Set([ok,P(a,b),P(-a,-b),P(-a,b)])]);
    choiceAsk(api,ch,ok,{hint:'앞의 수는 그대로, 빼는 수의 부호만 바꿔요.'},()=>{api.fig(`<div class="eqq rm">(${sgnTxt(a)}) ${MI} (${sgnTxt(b)}) = ${ok}</div>`);api.q('계산 결과는?');
      snAsk(api,a-b,{hint:Math.sign(a)===Math.sign(-b)?'부호가 같으니 절댓값을 더하고 그 부호를 붙여요.':'부호가 다르니 절댓값의 차에 큰 쪽 부호를 붙여요.'},()=>{api.msg(`<span class="ok">○ ${ok} = ${sgnTxt(a-b)}</span>`);api.next(`(${sgnTxt(a)})−(${sgnTxt(b)}) = ${sgnTxt(a-b)}`)})})},done,'i:rewrite')}
function tempAct(host,done){const r=mulberry(newSeed());const CT=['서울','대관령','철원','춘천','파주','평창'];const L=shuffle(r,CT).slice(0,4).map(c=>{const hi=ri(r,-2,8),lo=hi-ri(r,4,12);return{c,hi,lo}});
  rounds(host,L,(x,api)=>{api.fig(`<div class="thermobox">${thermoSVG(null,{wide:true,lo:-10,hi:10,noWords:true,marks:[{v:x.hi,l:'최고 '+sgnTxt(x.hi),c:PC},{v:x.lo,l:'최저 '+sgnTxt(x.lo),c:NC}]})}</div>`);
    api.q(`${x.c}의 어느 날 최고 기온은 <b class="rm">${sgnTxt(x.hi)} °C</b>, 최저 기온은 <b class="rm">${sgnTxt(x.lo)} °C</b>예요. 일교차(최고 ${MI} 최저)는 몇 °C인가요?`);
    snAsk(api,x.hi-x.lo,{suffix:'°C',hint:n=>n===1?`(${sgnTxt(x.hi)}) ${MI} (${sgnTxt(x.lo)})를 덧셈으로 바꿔 보세요.`:'온도계에서 두 표시 사이의 칸을 세어도 돼요.'},()=>{api.msg(`<span class="ok">○ (${sgnTxt(x.hi)}) ${MI} (${sgnTxt(x.lo)}) = (${sgnTxt(x.hi)}) + (${sgnTxt(-x.lo)}) = ${sgnTxt(x.hi-x.lo)}</span>`);api.next(`${x.c} ${x.hi-x.lo} °C`)})},done,'i:temp')}
EXPLORE.isub=body=>{actNav(body,'isub',[
  {key:'take',t:'칩 덜어 내기',lead:'빼기는 덜어 내기예요. 덜어 낼 칩이 모자라면 0 쌍을 넣어요.',mount:takeAct},
  {key:'rewrite',t:'뺄셈을 덧셈으로 바꾸기',lead:'빼는 수의 부호를 바꾸어 더해요.',mount:rewriteAct},
  {key:'temp',t:'일교차 구하기',lead:'최고 기온에서 최저 기온을 빼요.',mount:tempAct}])};

/* ── 단계 문제와 연습 ── */
const nlFig=(o,stepFn)=>({svg:(vis,cur)=>`<div class="figbox nlfig">${nlSVG(Object.assign({},o,stepFn?stepFn(vis,cur):{},{tb:!vis}))}</div>`,step:!!stepFn});
const sitPick=r=>{const S=pick(r,SIT),k=pick(r,S.ks),pos=r()<0.5;return{S,k,pos,w:pos?S.p:S.n,v:pos?k:-k,ph:S.ph(pos?S.p:S.n,k)}};
GEN.signStep=seed=>{const r=mulberry(seed),X=sitPick(r),S=X.S,opp=X.pos?S.n:S.p;
  const others=shuffle(r,SIT.filter(s=>s!==S).map(s=>pick(r,[s.p,s.n]))).slice(0,2);
  return{ptype:'sign:sit',title:`다음을 부호 +, −를 사용하여 나타내시오. <span class="muted" style="font-weight:400">(단, ${josa(S.p,'은','는')} +로 나타낸다.)</span><div class="cond">${X.ph}</div>`,fig:null,finalQ:'부호를 사용하여 나타내면?',steps:[
    {tag:'반대가 되는 말 찾기',q:`‘${X.w}’${jong(X.w)?'과':'와'} 반대가 되는 말은?`,type:'choice',choices:shuffle(r,[opp,...others]),ans:opp,hint:`기준(${S.base})을 사이에 두고 반대쪽을 나타내는 말이에요.`},
    {tag:'부호 정하기',q:`${josa(S.p,'이','가')} +이면, ‘${X.w}’에 붙일 부호는?`,type:'choice',choices:['+ (양의 부호)','− (음의 부호)'],ans:X.pos?'+ (양의 부호)':'− (음의 부호)',hint:`${S.p} ↔ ${josa(S.n,'은','는')} 반대예요. 반대쪽은 반대 부호를 붙여요.`},
    {tag:'부호를 붙여 나타내기',q:'부호를 사용하여 나타내면?',type:'sn',needSign:true,ans:X.v,suffix:S.u,hint:X.pos?'+ 를 먼저 누르고 숫자를 눌러요.':'− 를 먼저 누르고 숫자를 눌러요.',ok:`${X.ph} → ${sgnTxt(X.v)} ${S.u}`}]}};
const SIGN_TF={t:['0은 양수도 음수도 아니다.','+5는 양수이다.',`${MI}0.5는 음수이다.`,`영하 3 °C는 ${MI}3 °C로 나타낸다.`,'0보다 작은 수를 음수라고 한다.',`${MI}2는 ‘음의 2’라고 읽는다.`,'해발 500 m는 +500 m로 나타낸다.'],
  f:[['0은 양수이다.','0은 기준이라 양수도 음수도 아니에요.'],[`${MI}1/2은 양수이다.`,'음의 부호가 붙었으니 음수예요.'],['해저 100 m는 +100 m로 나타낸다.',`해수면보다 아래이므로 ${MI}100 m예요.`],['음수는 0보다 크다.','음수는 0보다 작아요.'],['3일 전은 +3일로 나타낸다.',`‘후’가 +이면 ‘전’은 ${MI}예요.`]]};
GEN.sign=seed=>{const r=mulberry(seed),k=pick(r,['step','step','table','count','tf','sit']);
  if(k==='step')return GEN.signStep(seed+5);
  if(k==='table'){const S=pick(r,SIT),[k1,k2]=shuffle(r,S.ks).slice(0,2),fl=r()<0.5;const gw=fl?S.n:S.p,aw=fl?S.p:S.n,gv=fl?-k1:k1,av=fl?k2:-k2;
    return{ptype:'sign:table',title:`다음 표의 빈칸에 알맞은 수를 쓰시오.<div class="tablewrap"><table class="t" style="max-width:420px;margin-top:8px"><tbody><tr><td>${S.ph(gw,k1)}</td><td class="rm">${sgnTxt(gv)} ${S.u}</td></tr><tr><td>${S.ph(aw,k2)}</td><td>(&nbsp;&nbsp;&nbsp;&nbsp;)</td></tr></tbody></table></div>`,fig:null,steps:[{q:'빈칸에 알맞은 수는?',type:'sn',needSign:true,ans:av,suffix:S.u,hint:`${gw}${jong(gw)?'과':'와'} ${josa(aw,'은','는')} 반대예요. 반대 부호를 붙여요.`,ok:`${S.ph(aw,k2)} → ${sgnTxt(av)} ${S.u}`}]}}
  if(k==='count'){const pool=shuffle(r,[Q(ri(r,1,9)),Q(-ri(r,1,9)),Q(0),Q(ri(r,1,9)),Q(-ri(r,1,9),10,true),Q(ri(r,1,5),ri(r,6,9)),Q(-ri(r,1,3),4),Q(-ri(r,10,20)),Q(ri(r,1,9),10,true)]).slice(0,7);
    const want=pick(r,['음수','양수']),ans=pool.filter(x=>want==='음수'?x.p<0:x.p>0).length;
    return{ptype:'sign:count',title:`다음 수 중에서 ${want}의 개수를 구하시오.<div class="cond rm">${pool.map(x=>qH(x)).join(', &nbsp;')}</div>`,fig:null,steps:[{q:`${want}는 모두 몇 개인가요?`,type:'num',ans,suffix:'개',hint:`0은 양수도 음수도 아니에요. + 가 붙은 수가 양수, ${MI}가 붙은 수가 음수예요.`}]}}
  if(k==='tf'){const[fs,why]=pick(r,SIGN_TF.f),ts=shuffle(r,SIGN_TF.t.slice()).slice(0,4),all=shuffle(r,[...ts,fs]),lab=all.map((x,i)=>CIRC[i]+' '+x);
    return{ptype:'sign:tf',title:'다음 중 옳지 않은 것은?',fig:null,steps:[{q:'옳지 않은 것을 고르세요.',type:'choice',choices:lab,ans:lab[all.indexOf(fs)],hint:'0, 부호, 반대말을 하나씩 확인해 보세요.',ok:why}]}}
  const X=sitPick(r);return{ptype:'sign:sit',title:`다음을 부호 +, −를 사용하여 나타내시오. <span class="muted" style="font-weight:400">(단, ${josa(X.S.p,'은','는')} +로 나타낸다.)</span><div class="cond">${X.ph}</div>`,fig:null,steps:[{q:'부호를 사용하여 나타내면?',type:'sn',needSign:true,ans:X.v,suffix:X.S.u,hint:`기준은 ${X.S.base}. ${josa(X.S.p,'이','가')} +이면 ${josa(X.S.n,'은','는')} ${MI}예요.`}]}};

GEN.numlineStep=seed=>{const r=mulberry(seed),half=r()<0.35;const x=half?Q((ri(r,0,3)*2+1)*(r()<0.6?-1:1),2):Q(ri(r,1,5)*(r()<0.6?-1:1));const v=qv(x),sub=half?2:1,n=Math.abs(v*sub);
  const S=[{tag:'원점의 어느 쪽인지 보기',q:'점 P는 원점 O의 어느 쪽에 있나요?',type:'choice',choices:['오른쪽','왼쪽'],ans:v>0?'오른쪽':'왼쪽',hint:'0이 쓰인 곳이 원점이에요.',ok:v>0?'오른쪽에 있는 수는 양수예요.':'왼쪽에 있는 수는 음수예요.'},
    {tag:'부호 정하기',q:'점 P가 나타내는 수의 부호는?',type:'choice',choices:['+','−'],ans:v>0?'+':'−',hint:'오른쪽은 +, 왼쪽은 −예요.'}];
  if(half)S.push({tag:'눈금 한 칸의 크기',q:'작은 눈금 한 칸은 얼마를 나타내나요?',type:'choice',choices:['1','1/2','1/3','1/4'],ans:'1/2',hint:'0과 1 사이가 몇 칸으로 나누어져 있는지 세어 보세요.'});
  S.push({tag:'원점에서 칸 세기',q:half?'원점에서 작은 눈금 몇 칸 떨어져 있나요?':'원점에서 몇 칸 떨어져 있나요?',type:'num',ans:n,suffix:'칸',hint:'원점부터 하나씩 뛰어 세어 보세요.'},
    {tag:'점이 나타내는 수',q:'점 P가 나타내는 수는?',type:'sn',ans:v,ansText:qS(x),hint:half?`작은 눈금 ${n}칸 = ${n}/2. 왼쪽이면 − 를 붙여요.`:'칸 수에 부호를 붙여요.',ok:`점 P는 ${qS(x)}을 나타내요.`});
  const hopAt=S.length-2;
  return{ptype:half?'numline:half':'numline:int',title:'다음 수직선 위의 점 P가 나타내는 수를 구하시오.',fig:nlFig({min:-5,max:5,sub,pts:[{v,l:'P'}]},(vis,cur)=>vis&&cur>=hopAt?{hops:{a:0,b:v}}:{}),finalQ:'점 P가 나타내는 수는?',steps:S}};
GEN.numline=seed=>{const r=mulberry(seed),k=pick(r,['step','step','pick','read','between']);
  if(k==='step')return GEN.numlineStep(seed+3);
  if(k==='pick'||k==='read'){const vs=shuffle(r,[-4.5,-4,-3,-2.5,-2,-1.5,-1,-0.5,0.5,1,1.5,2,2.5,3,3.5,4]).slice(0,4).sort((a,b)=>a-b);const L=['A','B','C','D'],t=ri(r,0,3),x=Q(vs[t]*2,2);
    const fig=nlFig({min:-5,max:5,sub:2,pts:vs.map((v,i)=>({v,l:L[i]}))});
    if(k==='pick')return{ptype:'numline:pick',title:`다음 수직선 위의 네 점 A, B, C, D 중에서 <span class="rm">${qH(x)}</span>을 나타내는 점을 고르시오.`,fig,steps:[{q:'알맞은 점은?',type:'choice',choices:L,ans:L[t],hint:'원점에서 어느 쪽으로 작은 눈금 몇 칸인지 세어요. 작은 눈금 한 칸은 1/2이에요.'}]};
    return{ptype:'numline:read',title:`다음 수직선 위의 점 ${L[t]}가 나타내는 수를 구하시오.`,fig,steps:[{q:`점 ${L[t]}가 나타내는 수는?`,type:'sn',ans:vs[t],ansText:qS(x),hint:'작은 눈금 한 칸은 1/2이에요. 분수는 / 키로 입력해요.'}]}}
  let a,b;do{a=Q(-ri(r,3,9),2);b=Q(ri(r,1,9),r()<0.5?2:3)}while(qv(b)%1===0||qv(a)%1===0);if(r()<0.5){const t=qNeg(b);b=qNeg(a);a=t}
  const lo=Math.floor(qv(a))+1,hi=Math.ceil(qv(b))-1,ans=hi-lo+1;
  return{ptype:'numline:between',title:`다음 두 수 사이에 있는 정수는 모두 몇 개인지 구하시오.<div class="cond rm">${qH(a)}, &nbsp;&nbsp;${qH(b)}</div>`,fig:null,finalQ:'정수는 모두 몇 개인가요?',steps:[
    {tag:'수직선에 나타내기',q:`<span class="rm">${qH(a)}</span>의 위치로 알맞은 것은?`,type:'choice',choices:shuffle(r,[`${sgnTxt(lo-1)} < □ < ${sgnTxt(lo)}`,`${sgnTxt(lo)} < □ < ${sgnTxt(lo+1)}`,`${sgnTxt(lo-2)} < □ < ${sgnTxt(lo-1)}`]),ans:`${sgnTxt(lo-1)} < □ < ${sgnTxt(lo)}`,hint:'가분수는 대분수로, 또는 소수로 바꿔 보세요.'},
    {tag:'사이의 정수 세기',q:'두 수 사이에 있는 정수는 모두 몇 개인가요?',type:'num',ans,suffix:'개',hint:`${sgnTxt(lo)}부터 ${sgnTxt(hi)}까지 0도 빠뜨리지 말고 세어요.`,ok:`${sgnTxt(lo)}, …, ${sgnTxt(hi)}: ${ans}개`}]}};

GEN.absStep=seed=>{const r=mulberry(seed),kind=pick(r,['val','val','inv']);
  if(kind==='inv'){const a=ri(r,2,7);return{ptype:'abs:inv',title:`절댓값이 ${a}인 수를 모두 구하시오.`,fig:nlFig({min:-a-1,max:a+1},(vis,cur)=>vis?{pts:[...(cur>=1?[{v:a,l:'+'+a}]:[]),...(cur>=2?[{v:-a,l:MI+a}]:[])],span:cur>=1?[{a:0,b:a,lab:String(a)},...(cur>=2?[{a:-a,b:0,lab:String(a)}]:[])]:null}:{}),finalQ:`절댓값이 ${a}인 수의 개수는?`,steps:[
    {tag:'오른쪽으로 거리만큼',q:`원점에서 <b>오른쪽</b>으로 ${a}만큼 떨어진 점이 나타내는 수는?`,type:'sn',ans:a,hint:'오른쪽은 + 예요.'},
    {tag:'왼쪽으로 거리만큼',q:`원점에서 <b>왼쪽</b>으로 ${a}만큼 떨어진 점이 나타내는 수는?`,type:'sn',ans:-a,hint:'왼쪽은 − 예요. − 를 먼저 눌러요.'},
    {tag:'모두 몇 개인지',q:`절댓값이 ${a}인 수는 모두 몇 개인가요?`,type:'num',ans:2,suffix:'개',hint:'원점의 양쪽에 하나씩 있어요.',ok:`+${a}, ${MI}${a} · 2개`}]}}
  const x=ri(r,1,8)*(r()<0.65?-1:1);
  return{ptype:'abs:val',title:`<span class="rm">|${sgnTxt(x)}|</span>의 값을 구하시오.`,fig:nlFig({min:nlRange([x],4)[0],max:nlRange([x],4)[1],pts:[{v:x,l:sgnTxt(x)}]},(vis,cur)=>vis&&cur>=1?{hops:{a:0,b:x}}:{}),finalQ:`|${sgnTxt(x)}|의 값은?`,steps:[
    {tag:'수직선에서 자리 찾기',q:`수직선에서 <span class="rm">${sgnTxt(x)}</span>의 자리는 원점 O의 어느 쪽인가요?`,type:'choice',choices:['오른쪽','왼쪽'],ans:x>0?'오른쪽':'왼쪽',hint:'+는 오른쪽, −는 왼쪽.'},
    {tag:'원점에서의 거리',q:'원점에서 몇 칸 떨어져 있나요?',type:'num',ans:Math.abs(x),suffix:'칸',hint:'원점부터 뛰어 세어요.'},
    {tag:'절댓값 쓰기',q:`<span class="rm">|${sgnTxt(x)}|</span>의 값은?`,type:'num',ans:Math.abs(x),hint:'절댓값은 거리예요. 거리에는 부호가 없어요.',ok:`|${sgnTxt(x)}| = ${Math.abs(x)}`}]}};
const ABS_TF={t:['절댓값은 항상 0보다 크거나 같다.','|0| = 0이다.',`+3과 ${MI}3의 절댓값은 같다.`,'원점에서 멀수록 절댓값이 크다.','절댓값이 5인 수는 2개이다.'],
  f:[[`|${MI}6| = ${MI}6이다.`,'절댓값은 거리라서 음수가 될 수 없어요. |−6| = 6'],['절댓값이 4인 수는 4 하나뿐이다.','+4와 −4, 두 개예요.'],['절댓값이 0인 수는 2개이다.','0 하나뿐이에요.'],[`${MI}7의 절댓값은 +3의 절댓값보다 작다.`,'7 > 3이라서 −7의 절댓값이 더 커요.']]};
GEN.abs=seed=>{const r=mulberry(seed),k=pick(r,['step','step','val','neg','dist','sum','max','tf']);
  if(k==='step')return GEN.absStep(seed+11);
  if(k==='val'){const x=pick(r,[Q(-ri(r,1,9),ri(r,2,7)),Q(-ri(r,11,49),10,true),Q(ri(r,1,5),ri(r,6,9)),Q(-ri(r,10,30))]);const A=qAbs(x);
    return{ptype:'abs:valq',title:`<span class="rm">|${qH(x)}|</span>의 값을 구하시오.`,fig:null,steps:[{q:'값은?',type:'sn',ans:qv(A),ansText:qS(A,false),hint:'부호를 떼어 내고 숫자만 남겨요. 분수는 / 키로 입력해요.'}]}}
  if(k==='neg'){const a=pick(r,[Q(ri(r,2,12)),Q(ri(r,11,39),10,true),Q(ri(r,1,4),5)]);return{ptype:'abs:neg',title:`절댓값이 <span class="rm">${qH(a,false)}</span>인 수 중에서 음수를 구하시오.`,fig:null,steps:[{q:'음수는?',type:'sn',ans:-qv(a),ansText:qS(qNeg(a)),hint:'절댓값이 같은 수는 + 쪽과 − 쪽에 하나씩이에요.'}]}}
  if(k==='dist'){const a=ri(r,2,8);return{ptype:'abs:dist',title:`절댓값이 같고 부호가 반대인 두 수가 있다. 수직선에서 이 두 수를 나타내는 두 점 사이의 거리가 ${2*a}일 때, 두 수 중 큰 수를 구하시오.`,fig:null,finalQ:'두 수 중 큰 수는?',steps:[
    {tag:'원점이 가운데',q:`두 점은 원점에서 같은 거리에 있어요. 원점에서 한 점까지의 거리는?`,type:'num',ans:a,hint:`전체 거리 ${2*a}의 절반이에요.`},
    {tag:'큰 수 찾기',q:'두 수 중 큰 수는?',type:'sn',ans:a,hint:'원점 오른쪽에 있는 수가 커요.',ok:`두 수는 +${a}, ${MI}${a} · 큰 수는 +${a}`}]}}
  if(k==='sum'){const a=ri(r,-9,-1),b=ri(r,1,9);return{ptype:'abs:sum',title:`<span class="rm">|${sgnTxt(a)}| + |${sgnTxt(b)}|</span>의 값을 구하시오.`,fig:null,finalQ:'값은?',steps:[
    {tag:'각각의 절댓값',q:`<span class="rm">|${sgnTxt(a)}|</span>의 값은?`,type:'num',ans:-a,hint:'원점에서의 거리예요.'},{tag:'더하기',q:'두 절댓값의 합은?',type:'num',ans:b-a,hint:`${-a} + ${b}`}]}}
  if(k==='max'){const vs=shuffle(r,[Q(-ri(r,5,9)),Q(ri(r,1,4)),Q(-ri(r,1,3),2),Q(ri(r,11,44),10,true)]);const big=vs.reduce((m,x)=>Math.abs(qv(x))>Math.abs(qv(m))?x:m),want=r()<0.5;const sm=vs.reduce((m,x)=>Math.abs(qv(x))<Math.abs(qv(m))?x:m),t=want?big:sm;
    const lab=vs.map((x,i)=>CIRC[i]+' '+qS(x));return{ptype:'abs:max',title:`다음 중 절댓값이 가장 ${want?'큰':'작은'} 수는?`,fig:null,steps:[{q:'알맞은 수를 고르세요.',type:'choice',choices:lab,ans:lab[vs.indexOf(t)],hint:'부호를 떼고 크기만 비교해요. 원점에서 가장 '+(want?'먼':'가까운')+' 수예요.'}]}}
  const[fs,why]=pick(r,ABS_TF.f),ts=shuffle(r,ABS_TF.t.slice()).slice(0,4),all=shuffle(r,[...ts,fs]),lab=all.map((x,i)=>CIRC[i]+' '+x);
  return{ptype:'abs:tf',title:'다음 중 절댓값에 대한 설명으로 옳지 않은 것은?',fig:null,steps:[{q:'옳지 않은 것을 고르세요.',type:'choice',choices:lab,ans:lab[all.indexOf(fs)],hint:'절댓값은 원점에서의 거리라는 것을 떠올려요.',ok:why}]}};

/* 덧셈 단계 (정수·소수·분수 공통) */
function addSteps(a,b,r,pre=''){const same=Math.sign(qv(a))===Math.sign(qv(b)),A=qAbs(a),B=qAbs(b),s=qAdd(a,b),big=Math.abs(qv(a))>=Math.abs(qv(b))?a:b,mag=qAbs(s);
  return[{tag:'두 수의 부호 비교',q:pre==='sub'?'바꾼 덧셈식에서 두 수의 부호는?':`${pre}<span class="rm">${par(a)} + ${par(b)}</span> · 두 수의 부호는?`,type:'choice',choices:['같다','다르다'],ans:same?'같다':'다르다',hint:'괄호 안의 수 앞에 붙은 부호를 보세요.',ok:same?'같은 부호 → 모으기':'다른 부호 → 0 쌍 지우기'},
    {tag:same?'절댓값의 합':'절댓값의 차',q:'계산 결과의 절댓값은? <small class="muted">(같은 부호 → 절댓값의 합, 다른 부호 → 절댓값의 차)</small>',type:'sn',ans:qv(mag),ansText:qS(mag,false),hint:same?'같은 칩끼리 모으면 개수를 더해요.':`${qS(A,false)}과 ${qS(B,false)} 중 큰 것에서 작은 것을 빼요. 지운 0 쌍만큼 줄어요.`},
    ...(qv(s)===0?[]:[{tag:'부호 정하기',q:'계산 결과의 부호는?',type:'choice',choices:['+','−'],ans:qv(s)>0?'+':'−',hint:same?'두 수의 공통인 부호예요.':`절댓값이 더 큰 수(${qS(big)})의 부호예요.`}]),
    {tag:'계산 결과',q:'계산 결과는?',type:'sn',ans:qv(s),ansText:qS(s),hint:qv(s)===0?'절댓값이 같고 부호가 다르면 합은 0이에요.':'부호를 앞에 붙여 써요. 분수는 / 키로 입력해요.',ok:`<span class="rm">${par(a)} + ${par(b)} = ${qH(s)}</span>`}]}
function addFig(a,b){return{svg:(vis,cur)=>{if(!vis)return'';const same=Math.sign(a)===Math.sign(b),P=(a>0?a:0)+(b>0?b:0),N=(a<0?-a:0)+(b<0?-b:0);
  return`<div class="figbox">${chipsSVG(P,N,{pairs:!same&&cur>=1?Math.min(P,N):0,cancel:!same&&cur>=1})}</div><div class="figbox" style="margin-top:8px">${addNL(a,b,{ans:cur>=3})}</div>`},step:true}}
const intPair=(r,kase)=>{const C=kase||pick(r,['++','--','+-','-+','+-','-+']);let a,b;do{a=ri(r,1,9)*(C[0]==='+'?1:-1);b=ri(r,1,9)*(C[1]==='+'?1:-1)}while(Math.abs(a)===Math.abs(b)&&r()<0.8);return[a,b]};
GEN.iaddStep=seed=>{const r=mulberry(seed),[a,b]=intPair(r);return{ptype:Math.sign(a)===Math.sign(b)?'iadd:same':'iadd:diff',title:`다음을 계산하시오.<div class="eqq rm">(${sgnTxt(a)}) + (${sgnTxt(b)})</div>`,fig:addFig(a,b),finalQ:'계산 결과는?',steps:addSteps(I_(a),I_(b),r)}};
const decQ=(r,lo,hi)=>Q(ri(r,lo,hi)*(r()<0.5?-1:1),10,true);
function fracPair(r){const d=pick(r,[3,4,5,6,7,8]);let x,y;do{x=ri(r,1,d+3);y=ri(r,1,d+3)}while(x===y);return[Q(x*(r()<0.5?-1:1),d),Q(y*(r()<0.5?-1:1),d),d]}
GEN.iadd=seed=>{const r=mulberry(seed),k=pick(r,['step','step','int','int','dec','frac','word','sign']);
  if(k==='step')return GEN.iaddStep(seed+3);
  if(k==='int'){const[a,b]=intPair(r);return{ptype:'iadd:int',title:`다음을 계산하시오.<div class="eqq rm">(${sgnTxt(a)}) + (${sgnTxt(b)})</div>`,fig:null,finalQ:'계산 결과는?',steps:addSteps(I_(a),I_(b),r)}}
  if(k==='dec'){let a,b;do{a=decQ(r,3,49);b=decQ(r,3,49)}while(a.q===1||b.q===1);return{ptype:'iadd:dec',title:`다음을 계산하시오.<div class="eqq rm">${parS(a)} + ${parS(b)}</div>`,fig:null,finalQ:'계산 결과는?',steps:addSteps(a,b,r)}}
  if(k==='frac'){let a,b;do{[a,b]=fracPair(r)}while(a.q===1||b.q===1);return{ptype:'iadd:frac',title:`다음을 계산하시오.<div class="eqq rm">${par(a)} + ${par(b)}</div>`,fig:null,finalQ:'계산 결과는? (분수는 / 키로)',steps:addSteps(a,b,r,'분모가 같으면 분자끼리 계산해요. ')}}
  if(k==='word'){const t=ri(r,-8,-1),u=ri(r,2,12),down=r()<0.35,tt=down?ri(r,1,6):t;const d=down?-u:u;
    const ch=shuffle(r,[`(${sgnTxt(tt)}) + (${sgnTxt(d)})`,`(${sgnTxt(tt)}) + (${sgnTxt(-d)})`,`(${sgnTxt(-tt)}) + (${sgnTxt(d)})`]);
    return{ptype:'iadd:word',title:`어느 날 오전 6시의 기온은 <span class="rm">${sgnTxt(tt)} °C</span>였고, 낮 12시까지 기온이 <span class="rm">${u} °C</span> ${down?'내려갔다':'올라갔다'}. 낮 12시의 기온을 구하시오.`,fig:null,finalQ:'낮 12시의 기온은?',steps:[
      {tag:'식 세우기',q:`${down?'내려간':'올라간'} 것을 부호로 나타내어 덧셈식을 세우면?`,type:'choice',choices:ch,ans:`(${sgnTxt(tt)}) + (${sgnTxt(d)})`,hint:`올라가면 +, 내려가면 ${MI}예요.`},
      {tag:'계산하기',q:'낮 12시의 기온은?',type:'sn',ans:tt+d,suffix:'°C',hint:'덧셈 규칙으로 계산해요.',ok:`${sgnTxt(tt+d)} °C`}]}}
  const[a,b]=intPair(r,pick(r,['+-','-+']));const s=a+b;return{ptype:'iadd:sign',title:`<span class="rm">(${sgnTxt(a)}) + (${sgnTxt(b)})</span>의 계산 결과의 부호를 고르시오.`,fig:null,steps:[{q:'부호는?',type:'choice',choices:['+','−','0 (부호 없음)'],ans:s>0?'+':s<0?'−':'0 (부호 없음)',hint:'절댓값이 큰 수의 부호를 따라가요.'}]}};

function subFig(a,b){return{svg:(vis,cur)=>{if(!vis)return'';if(cur===0){const P=a>0?a:0,N=a<0?-a:0,need=Math.abs(b),have=b>0?P:N,z=Math.max(0,need-have);
    return`<div class="figbox">${chipsSVG(P+z,N+z,{ghostP:z,ghostN:z})}<div class="figcap">칩 ${sgnTxt(a)}에서 ${b>0?'+':MI} 칩 ${need}개를 덜어 내요${z?` · 모자라서 0 쌍 ${z}개(점선)를 넣었어요`:''}</div></div>`}
    return addFig(a,-b).svg(true,cur-1)},step:true}}
const rwOpts=(r,a,b,fmt)=>{const P=(x,y)=>`${fmt(x)} + ${fmt(y)}`,ok=P(a,qNeg(b));return{ok,ch:shuffle(r,[...new Set([ok,P(a,b),P(qNeg(a),qNeg(b)),P(qNeg(a),b)])])}};
function subSteps(a,b,r){const fmt=x=>`(${qS(x)})`,R=rwOpts(r,a,b,fmt);
  return[{tag:'덧셈으로 바꾸기',q:'빼는 수의 부호를 바꾸어 덧셈으로 나타내면?',type:'choice',choices:R.ch,ans:R.ok,hint:'앞의 수는 그대로, 빼는 수의 부호만 바꿔요.',ok:`<span class="rm">${par(a)} ${MI} ${par(b)} = ${par(a)} + ${par(qNeg(b))}</span>`},...addSteps(a,qNeg(b),r,'sub')]}
GEN.isubStep=seed=>{const r=mulberry(seed);let a,b;do{[a,b]=intPair(r,pick(r,['++','--','+-','-+']))}while(Math.abs(a)+Math.abs(b)>11);return{ptype:'isub:int',title:`다음을 계산하시오.<div class="eqq rm">(${sgnTxt(a)}) ${MI} (${sgnTxt(b)})</div>`,fig:subFig(a,b),finalQ:'계산 결과는?',steps:subSteps(I_(a),I_(b),r)}};
GEN.isub=seed=>{const r=mulberry(seed),k=pick(r,['step','step','int','rewrite','dec','frac','temp','sea']);
  if(k==='step')return GEN.isubStep(seed+9);
  if(k==='int'){const[a,b]=intPair(r);return{ptype:'isub:int2',title:`다음을 계산하시오.<div class="eqq rm">(${sgnTxt(a)}) ${MI} (${sgnTxt(b)})</div>`,fig:null,finalQ:'계산 결과는?',steps:subSteps(I_(a),I_(b),r)}}
  if(k==='rewrite'){const[a,b]=intPair(r),R=rwOpts(r,I_(a),I_(b),x=>`(${qS(x)})`);return{ptype:'isub:rewrite',title:`<span class="rm">(${sgnTxt(a)}) ${MI} (${sgnTxt(b)})</span>을 덧셈으로 바르게 나타낸 것은?`,fig:null,steps:[{q:'알맞은 것을 고르세요.',type:'choice',choices:R.ch,ans:R.ok,hint:'앞의 수는 그대로, 빼는 수의 부호만 바꿔요.'}]}}
  if(k==='dec'){let a,b;do{a=decQ(r,3,49);b=decQ(r,3,49)}while(a.q===1||b.q===1);return{ptype:'isub:dec',title:`다음을 계산하시오.<div class="eqq rm">${parS(a)} ${MI} ${parS(b)}</div>`,fig:null,finalQ:'계산 결과는?',steps:subSteps(a,b,r)}}
  if(k==='frac'){let a,b;do{[a,b]=fracPair(r)}while(a.q===1||b.q===1);return{ptype:'isub:frac',title:`다음을 계산하시오.<div class="eqq rm">${par(a)} ${MI} ${par(b)}</div>`,fig:null,finalQ:'계산 결과는? (분수는 / 키로)',steps:subSteps(a,b,r)}}
  if(k==='temp'){const hi=ri(r,-1,9),lo=hi-ri(r,5,14);const ch=shuffle(r,[`(${sgnTxt(hi)}) − (${sgnTxt(lo)})`,`(${sgnTxt(lo)}) − (${sgnTxt(hi)})`,`(${sgnTxt(hi)}) + (${sgnTxt(lo)})`]);
    return{ptype:'isub:temp',title:`어느 날 최고 기온은 <span class="rm">${sgnTxt(hi)} °C</span>, 최저 기온은 <span class="rm">${sgnTxt(lo)} °C</span>였다. 이날의 일교차(최고 기온과 최저 기온의 차)를 구하시오.`,fig:null,finalQ:'일교차는?',steps:[
      {tag:'식 세우기',q:'일교차를 구하는 식은?',type:'choice',choices:ch,ans:`(${sgnTxt(hi)}) − (${sgnTxt(lo)})`,hint:'(최고 기온) − (최저 기온)'},
      {tag:'계산하기',q:'일교차는 몇 °C인가요?',type:'sn',ans:hi-lo,suffix:'°C',hint:`빼는 수의 부호를 바꾸어 더해요. (${sgnTxt(hi)}) + (${sgnTxt(-lo)})`}]}}
  const up=ri(r,2,12)*100,dn=ri(r,1,8)*100;return{ptype:'isub:sea',title:`해발 <span class="rm">${up} m</span>인 산꼭대기와 해저 <span class="rm">${dn} m</span>인 바닷속 지점의 높이의 차를 구하시오.`,fig:null,finalQ:'높이의 차는?',steps:[
    {tag:'부호로 나타내기',q:`해저 ${dn} m를 부호를 사용하여 나타내면?`,type:'sn',ans:-dn,suffix:'m',hint:'해수면보다 아래는 − 예요.'},
    {tag:'뺄셈으로 계산하기',q:'높이의 차는 몇 m인가요?',type:'sn',ans:up+dn,suffix:'m',hint:`(+${up}) ${MI} (${MI}${dn}) = (+${up}) + (+${dn})`}]}};

/* ── 등록 ── */
/* 1차시 「다면체 · 각뿔대」: 예전 1차시(다면체)와 2차시(각기둥·각뿔·각뿔대)를 한 차시로 합쳐요 (교과서 211~212쪽) */
{const C1=CONCEPT.poly,C2=CONCEPT.types;
 CONCEPT.poly=body=>{body.innerHTML='';const a=el('<div></div>'),b=el('<div style="margin-top:14px"></div>');body.append(a,b);C1(a);C2(b)};
 const grab=f=>{let A=[];const o=actNav;actNav=(b,i,acts)=>{A=acts};try{f(document.createElement('div'))}finally{actNav=o}return A};
 const A1=grab(EXPLORE.poly),A2=grab(EXPLORE.types),lab1=A1.find(a=>a.key==='lab'),lab2=A2.find(a=>a.key==='lab');
 const acts=[...A1.filter(a=>a.key!=='lab'),...A2.filter(a=>a.key!=='lab'&&a.key!=='face'),lab1,lab2&&Object.assign({},lab2,{key:'lab2',t:'더 탐구하기 · 각뿔대'})].filter(Boolean);
 EXPLORE.poly=body=>actNav(body,'poly',acts)}
LESSONS.push(
  {id:'sign',no:1,title:'양수와 음수',sub:'반대가 되는 두 양에 부호 붙이기',tb:'01 정수와 유리수의 뜻 · 35쪽',ready:true,unit:'int'},
  {id:'rational',no:2,title:'정수와 유리수',sub:'수를 분류하기',tb:'01 정수와 유리수의 뜻 · 36쪽',ready:false,unit:'int'},
  {id:'numline',no:3,title:'수직선',sub:'원점에서 어느 쪽으로 몇 칸',tb:'01 정수와 유리수의 뜻 · 37쪽',ready:true,unit:'int'},
  {id:'abs',no:4,title:'절댓값',sub:'원점에서 떨어진 거리',tb:'02 대소 관계 · 39쪽',ready:true,unit:'int'},
  {id:'cmp',no:5,title:'수의 대소 관계',sub:'수직선에서 오른쪽에 있을수록 크다',tb:'02 대소 관계 · 40~41쪽',ready:false,unit:'int'},
  {id:'iadd',no:6,title:'덧셈',sub:'수직선으로 움직이고, 칩으로 0 쌍 지우기',tb:'03 덧셈 · 43~44쪽',ready:true,unit:'int'},
  {id:'addlaw',no:7,title:'덧셈의 계산 법칙',sub:'교환법칙과 결합법칙',tb:'03 덧셈 · 45~46쪽',ready:false,unit:'int'},
  {id:'isub',no:8,title:'뺄셈',sub:'빼는 수의 부호를 바꾸어 더하기',tb:'04 뺄셈 · 48쪽',ready:true,unit:'int'},
  {id:'addsub',no:9,title:'덧셈과 뺄셈의 혼합 계산',sub:'부호와 괄호 생략하기',tb:'04 뺄셈 · 49~50쪽',ready:false,unit:'int'},
  {id:'imul',no:10,title:'곱셈',sub:'부호부터 정하기',tb:'05 곱셈 · 53~54쪽',ready:false,unit:'int'},
  {id:'mullaw',no:11,title:'곱셈의 계산 법칙',sub:'교환·결합·분배법칙',tb:'05 곱셈 · 55~57쪽',ready:false,unit:'int'},
  {id:'idiv',no:12,title:'나눗셈과 역수',sub:'나누기는 역수를 곱하기',tb:'06 나눗셈 · 59~60쪽',ready:false,unit:'int'},
  {id:'imix',no:13,title:'사칙계산이 섞인 식',sub:'계산 순서 지키기',tb:'06 나눗셈 · 61쪽',ready:false,unit:'int'});
Object.assign(STEPGEN,{sign:GEN.signStep,numline:GEN.numlineStep,abs:GEN.absStep,iadd:GEN.iaddStep,isub:GEN.isubStep});
Object.assign(LESSON_OF,{signStep:'sign',sign:'sign',numlineStep:'numline',numline:'numline',absStep:'abs',abs:'abs',iaddStep:'iadd',iadd:'iadd',isubStep:'isub',isub:'isub'});
Object.assign(CALC_FOR,{sign:['signed','add','order'],numline:['signed','fracbase','dec'],abs:['signed','fracbase','dec'],iadd:['signed','fracop','dec'],isub:['signed','fracop','dec']});
Object.assign(PTYPE_NM,{'sign:sit':'1차시 · 상황을 부호로','sign:table':'1차시 · 반대말 표 채우기','sign:count':'1차시 · 양수·음수 세기','sign:tf':'1차시 · 옳지 않은 것',
  'numline:int':'3차시 · 점이 나타내는 수(정수)','numline:half':'3차시 · 점이 나타내는 수(분수)','numline:pick':'3차시 · 수에 맞는 점 고르기','numline:read':'3차시 · 네 점 중 하나 읽기','numline:between':'3차시 · 사이에 있는 정수',
  'abs:val':'4차시 · 절댓값 구하기','abs:inv':'4차시 · 절댓값이 a인 수','abs:valq':'4차시 · 분수·소수의 절댓값','abs:neg':'4차시 · 절댓값이 같은 음수','abs:dist':'4차시 · 두 점 사이의 거리','abs:sum':'4차시 · 절댓값의 합','abs:max':'4차시 · 절댓값이 가장 큰 수','abs:tf':'4차시 · 옳지 않은 것',
  'iadd:same':'6차시 · 같은 부호의 덧셈','iadd:diff':'6차시 · 다른 부호의 덧셈','iadd:int':'6차시 · 정수의 덧셈','iadd:dec':'6차시 · 소수의 덧셈','iadd:frac':'6차시 · 분수의 덧셈','iadd:word':'6차시 · 기온 문제','iadd:sign':'6차시 · 결과의 부호',
  'isub:int':'8차시 · 정수의 뺄셈','isub:int2':'8차시 · 정수의 뺄셈(연습)','isub:rewrite':'8차시 · 덧셈으로 바꾸기','isub:dec':'8차시 · 소수의 뺄셈','isub:frac':'8차시 · 분수의 뺄셈','isub:temp':'8차시 · 일교차','isub:sea':'8차시 · 높이의 차'});
Object.assign(TERMS,{
  '양의 부호':{k:'정수와 유리수',b:`<p>수 앞에 붙는 <b class="rm">+</b> 기호예요. 기준(0)보다 크거나 많은 쪽을 나타내요.</p><p>예) 영상 5 °C → <span class="rm">+5 °C</span></p>`},
  '음의 부호':{k:'정수와 유리수',b:`<p>수 앞에 붙는 <b class="rm">${MI}</b> 기호예요. 기준(0)의 반대쪽을 나타내요.</p><p>예) 영하 5 °C → <span class="rm">${MI}5 °C</span></p>`},
  '양수':{k:'정수와 유리수',b:`<p>양의 부호 +를 붙인 수, 곧 <b>0보다 큰 수</b>예요.</p><p>예) <span class="rm">+3, +7, +0.5</span></p>`},
  '음수':{k:'정수와 유리수',b:`<p>음의 부호 ${MI}를 붙인 수, 곧 <b>0보다 작은 수</b>예요.</p><p>예) <span class="rm">${MI}3, ${MI}0.5, ${MI}${FR(1,2)}</span> · 0은 양수도 음수도 아니에요.</p>`},
  '수직선':{k:'정수와 유리수',b:`<p>직선 위에 원점 O를 정하고 같은 간격으로 눈금을 매겨 수를 나타낸 직선이에요. 오른쪽이 +, 왼쪽이 ${MI}예요.</p>`},
  '원점':{k:'수직선',b:`<p>수직선에서 0을 나타내는 기준점이에요. 보통 O로 나타내요.</p>`},
  '절댓값':{k:'정수와 유리수',b:`<p>수직선에서 원점과 그 수를 나타내는 점 사이의 거리예요. 기호 <span class="rm">| |</span>로 나타내요.</p><p class="rm">|${MI}4| = 4, |+4| = 4, |0| = 0</p>`},
  '통분':{k:'초등 · 분수',b:`<p>분모가 다른 분수들의 분모를 같게 만드는 것이에요.</p><p class="rm">${FR(1,2)} = ${FR(2,4)}, ${FR(1,4)} → ${FR(2,4)} + ${FR(1,4)}</p>`}});
BADGES.push({k:'thermo',unit:'int',nm:'온도계 박사',d:'온도계 읽기 5문제 끝내기',ok:M=>!!M.once['i:thermo']},{k:'robot',unit:'int',nm:'로봇 조종사',d:'수직선 로봇 덧셈 끝내기',ok:M=>!!M.once['i:robot']},{k:'zero',unit:'int',nm:'0 쌍 마술사',d:'칩 덜어 내기 끝내기',ok:M=>!!M.once['i:take']});
function heroArt(){return`<div class="heroint">${nlSVG({min:-4,max:4,arrows:[{a:0,b:3,lab:'+3'},{a:3,b:-2,lab:MI+'5'}],pts:[{v:-2,l:MI+'2'}],W:520})}${chipsSVG(3,5,{pairs:3,cancel:true,W:520})}</div>`}
/*</INT>*/
