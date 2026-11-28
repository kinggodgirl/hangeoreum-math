/* [T18] 교과서 한 걸음 — Ⅳ. 좌표평면과 그래프 전 4차시 3×3 트랙 · 부엉 쌤 · 두걸음 복합 */
(()=>{
'use strict';

const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',RD='#b83a3a',OK='#2b7a4b',GY='#94a3b8';
const MF="'Times New Roman',Times,serif",SF="'IBM Plex Sans KR',sans-serif";
const f1=n=>Math.round(n*10)/10,neg=n=>n<0?'−'+(-n):String(n);
const gB=(w,h,s,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="ct-svg" role="img" aria-label="${lab||'좌표 그래프'}" style="font-family:${MF}">${s}</svg>`;

function owlPlane(opt={}){
  const W=250,H=220,rng=4,cx=W/2,cy=H/2,step=22;
  const X=v=>f1(cx+v*step),Y=v=>f1(cy-v*step);
  let s='';
  for(let i=-rng;i<=rng;i++){
    s+=`<line x1="${X(-rng)}" y1="${Y(i)}" x2="${X(rng)}" y2="${Y(i)}" stroke="${i===0?INK:'#dce3ef'}" stroke-width="${i===0?1.8:0.8}"/>`;
    s+=`<line x1="${X(i)}" y1="${Y(-rng)}" x2="${X(i)}" y2="${Y(rng)}" stroke="${i===0?INK:'#dce3ef'}" stroke-width="${i===0?1.8:0.8}"/>`;
  }
  s+=`<text x="${X(rng)+8}" y="${cy+4}" font-size="13" font-style="italic" fill="${INK}">x</text><text x="${cx+6}" y="${Y(rng)-4}" font-size="13" font-style="italic" fill="${INK}">y</text>`;
  if(opt.qHL){const q={1:[cx,cy-rng*step,rng*step,rng*step],2:[cx-rng*step,cy-rng*step,rng*step,rng*step],3:[cx-rng*step,cy,rng*step,rng*step],4:[cx,cy,rng*step,rng*step]}[opt.qHL];if(q)s=`<rect x="${q[0]}" y="${q[1]}" width="${q[2]}" height="${q[3]}" fill="${HLs}" fill-opacity=".6"/>`+s}
  if(opt.a!=null){s+=`<line x1="${X(-3)}" y1="${Y(-3*opt.a)}" x2="${X(3)}" y2="${Y(3*opt.a)}" stroke="${BL}" stroke-width="2.6"/>`}
  if(opt.inv!=null){[-1,1].forEach(sg=>{const pts=[];for(let k=1;k<=24;k++){const x=sg*(0.4+k*3.6/24),y=opt.inv/x;if(Math.abs(y)<=rng)pts.push(`${X(x)},${Y(y)}`)}s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="${BL}" stroke-width="2.5"/>`})}
  (opt.pts||[]).forEach(p=>{s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="${RD}"/><text x="${X(p.x)+8}" y="${Y(p.y)-8}" font-size="12" font-weight="700" fill="${RD}">${p.lab||''}</text>`});
  return gB(W,H,s);
}

function owlWalkGraph(){
  return gB(260,175,
    `<line x1="36" y1="140" x2="236" y2="140" stroke="${INK}" stroke-width="2"/><line x1="36" y1="24" x2="36" y2="140" stroke="${INK}" stroke-width="2"/>`+
    `<polyline points="36,140 96,60 156,60 220,140" fill="none" stroke="${BL}" stroke-width="3"/>`+
    `<text x="126" y="48" text-anchor="middle" font-size="12" font-family="${SF}" font-weight="700" fill="${HL}">수평 = 멈춤(휴식)</text>`+
    `<text x="236" y="158" text-anchor="end" font-size="11" font-family="${SF}" fill="${INK}">시간(분)</text><text x="36" y="16" font-size="11" font-family="${SF}" fill="${INK}">거리(m)</text>`);
}

if(typeof HG_TRACKS!=='object')return;

/* ── 1차시 coord ── */
HG_TRACKS.register('coord',{
  kind:'proc',
  owlScenes:[
    {lv:1,cap:'장면 ① 영화관 자리처럼 (가로 x, 세로 y)',say:'순서쌍 <span class="kw">(x, y)</span>는 <b>가로 x축을 먼저</b> 찾고, <b>세로 y축을 나중에</b> 찾아요. (2, 3)과 (3, 2)는 완전히 다른 점이에요!',svg:()=>owlPlane({pts:[{x:2,y:3,lab:'(2,3)'},{x:3,y:2,lab:'(3,2)'}]})},
    {lv:1,cap:'장면 ② 네 개의 방 = 사분면',say:'원점 O를 중심으로 반시계 방향으로 <span class="num">제1(+,+) → 제2(−,+) → 제3(−,−) → 제4(+,−)</span> 사분면! 부호만 봐도 몇 사분면인지 알아요.',svg:()=>owlPlane({qHL:2,pts:[{x:-2,y:2,lab:'제2 (−,+)'}]})},
    {lv:1,cap:'장면 ③ 좌표축 위는 어느 사분면도 아님!',exp:'warn',say:'x축 위(y=0)나 y축 위(x=0) 점은 경계선 위에 서 있어서 <span class="warn">어느 사분면에도 속하지 않아요</span>!',svg:()=>owlPlane({pts:[{x:3,y:0,lab:'(3,0) 축 위!'}]}),
      ask:{q:'점 (0, −4)는 어느 사분면에 속할까요?',choices:['어느 사분면에도 속하지 않아요','제3사분면','제4사분면'],ans:'어느 사분면에도 속하지 않아요',hint:'x좌표가 0이면 y축 위에 놓여 있어요!',ok:'맞아요! 0이 들어간 축 위의 점은 어느 사분면에도 속하지 않아요.'}}
  ],
  owlSummary:['수직선 위 점: 오른쪽 +, 왼쪽 −','좌표평면 순서쌍 (x, y): 가로(x) 먼저, 세로(y) 나중','사분면: 1(+,+), 2(−,+), 3(−,−), 4(+,−) · 축 위의 점(0 포함)은 사분면 아님!'],
  schemaQs:[
    {id:'cdq1',q:'점 <b>(2, 3)</b>과 점 <b>(3, 2)</b>는 좌표평면에서 같은 위치일까요?',fig:()=>owlPlane({pts:[{x:2,y:3,lab:'(2,3)'},{x:3,y:2,lab:'(3,2)'}]}),choices:['다른 위치예요','같은 위치예요'],ans:'다른 위치예요',hint:'순서쌍은 순서(앞=x, 뒤=y)가 중요해요.',why:'아니에요! 앞이 가로(x), 뒤가 세로(y)이므로 순서가 바뀌면 다른 점이에요.'},
    {id:'cdq2',q:'점 <b>(4, 0)</b>은 제1사분면에 속할까요?',fig:()=>owlPlane({pts:[{x:4,y:0,lab:'(4,0)'}]}),choices:['아니요, x축 위라 어느 사분면도 아니에요','제1사분면에 속해요'],ans:'아니요, x축 위라 어느 사분면도 아니에요',hint:'좌표축은 네 사분면을 가르는 경계선이에요.',why:'아니에요! 좌표 중 하나라도 0이면 축 위의 점이에요.'},
    {id:'cdq3',q:'점 <b>(−2, 3)</b>은 몇 사분면 위의 점인가요?',fig:()=>owlPlane({qHL:2,pts:[{x:-2,y:3,lab:'(−2,3)'}]}),choices:['제2사분면','제1사분면','제4사분면'],ans:'제2사분면',hint:'x는 음수(왼쪽), y는 양수(위)예요.',why:'맞아요! 왼쪽 위 칸은 제2사분면(−, +)이에요.'}
  ],
  firstGuide:[
    {id:'cdfg1',tyNo:2,title:'유형 2 · 좌표평면 점 읽기',problem:'원점 O에서 <b>왼쪽으로 3칸, 위로 2칸</b> 이동한 점 P의 x좌표를 구하시오.',fig:()=>owlPlane({pts:[{x:-3,y:2,lab:'P'}]}),
      wantChips:['점 P의 x좌표','점 P의 y좌표','사분면'],wantAns:'점 P의 x좌표',wantHl:[],
      givenChips:[{k:'a',t:'왼쪽 3칸 → x = −3',ok:true},{k:'b',t:'위로 2칸 → y = +2',ok:true},{k:'t',t:'오른쪽 3칸',ok:false}],
      teacherEq:'왼쪽(−) 3칸, 위(+) 2칸 → P(−3, 2)',pairQ:'왼쪽으로 3칸은 양수와 음수 중 무엇인가요?',pairChoices:['음수 (−3)','양수 (+3)'],pairAns:'음수 (−3)',
      calcPrompt:'점 P(−3, 2)의 x좌표는?',calcAns:-3,calcTopic:'signed',calcExplain:'왼쪽이므로 x좌표는 <b>−3</b>이에요.'},
    {id:'cdfg2',tyNo:3,title:'유형 3 · 사분면과 부호',problem:'x좌표가 <b>음수(−)</b>이고 y좌표가 <b>음수(−)</b>인 점은 제 몇 사분면인가요?',fig:()=>owlPlane({qHL:3,pts:[{x:-2,y:-2,lab:'(−,−)'}]}),
      wantChips:['몇 사분면 (숫자)','원점 거리','기울기'],wantAns:'몇 사분면 (숫자)',wantHl:[],
      givenChips:[{k:'a',t:'x < 0 (왼쪽)',ok:true},{k:'b',t:'y < 0 (아래)',ok:true},{k:'t',t:'제1사분면 (+,+)',ok:false}],
      teacherEq:'(−, −) = 왼쪽 아래 = 제3사분면',pairQ:'1사분면(+,+)에서 반시계 방향으로 2→3사분면은 어디인가요?',pairChoices:['왼쪽 아래 (−, −)','오른쪽 아래 (+, −)'],pairAns:'왼쪽 아래 (−, −)',
      calcPrompt:'제 몇 사분면인가요? (숫자만)',calcAns:3,calcTopic:'signed',calcExplain:'왼쪽 아래는 <b>제3사분면</b>이에요.'},
    {id:'cdfg3',tyNo:4,title:'유형 4 · x축 위의 점 조건',problem:'점 (5, a − 4)가 <b>x축 위</b>의 점일 때 a의 값을 구하시오.',fig:()=>owlPlane({pts:[{x:3,y:0,lab:'x축 위 (y=0)'}]}),
      wantChips:['a의 값','b의 값','x좌표'],wantAns:'a의 값',wantHl:[],
      givenChips:[{k:'a',t:'x축 위 → y좌표 = 0',ok:true},{k:'b',t:'y좌표 = a − 4',ok:true},{k:'t',t:'x좌표 = 0',ok:false}],
      teacherEq:'a − 4 = 0 → a = 4',pairQ:'점 (5, a−4)가 x축 위에 있으려면 어느 좌표가 0이어야 하나요?',pairChoices:['y좌표 (a−4)','x좌표 (5)'],pairAns:'y좌표 (a−4)',
      calcPrompt:'a − 4 = 0 → a = ?',calcAns:4,calcTopic:'eq',calcExplain:'a − 4 = 0 → <b>a = 4</b>예요.'}
  ],
  stratRows:[
    ['수직선 좌표','0 기준 거리','오른쪽 +, 왼쪽 − (분수는 간격 확인)'],
    ['순서쌍 (x, y)','가로 먼저 세로 나중','앞이 x축, 뒤가 y축'],
    ['사분면 판별','부호 확인 + 0 주의','1(+,+) 2(−,+) 3(−,−) 4(+,−) · 0 있으면 축 위!']
  ],
  worked:{
    1:{no:1,nm:'수직선 위 점의 좌표',prob:'수직선 위 점의 좌표 읽기',fig:()=>owlPlane({pts:[{x:-2,y:0,lab:'A(-2)'}]}),steps:[{t:'① 기준 0 찾기',hl:[],body:'원점 O(0)에서 출발해요.'},{t:'② 방향 확인',hl:[],body:'오른쪽은 +, 왼쪽은 −'},{t:'③ A(좌표) 쓰기',hl:[],body:'원래 점 이름 괄호 안에 써요.'}],pitfall:'⚠️ 음수는 0에서 왼쪽으로 갈수록 절댓값이 커져요(−1, −2, −3…)!'},
    2:{no:2,nm:'좌표평면 점 (x, y) 읽기',prob:'점 P의 순서쌍과 x, y좌표 구하기',fig:()=>owlPlane({pts:[{x:2,y:3,lab:'P(2,3)'}]}),steps:[{t:'① x좌표 (가로)',hl:[],body:'P에서 x축으로 똑바로 내려다본 숫자'},{t:'② y좌표 (세로)',hl:[],body:'P에서 y축으로 똑바로 옆을 본 숫자'},{t:'③ (x, y) 순서 확인',hl:[],body:'가로 먼저, 세로 나중!'}],pitfall:'⚠️ y좌표를 앞에 쓰면 전혀 다른 위치가 돼요!'},
    3:{no:3,nm:'사분면과 축 위의 점',prob:'점이 어느 사분면에 있는지 구하기',fig:()=>owlPlane({qHL:4,pts:[{x:3,y:-2,lab:'제4 (+,−)'}]}),steps:[{t:'① 0이 있는지 먼저 보기',hl:[],body:'x=0 또는 y=0이면 축 위(사분면 아님!)'},{t:'② 부호 짝 확인',hl:[],body:'1(+,+), 2(−,+), 3(−,−), 4(+,−)'},{t:'③ 사분면 답하기',hl:[],body:'기호를 떠올려 결정'}],pitfall:'⚠️ (0, 3), (−5, 0) 같은 축 위 점을 사분면으로 고르지 마세요!'},
    4:{no:4,nm:'축 위의 점 조건',prob:'x축·y축 위의 점으로 미지수 구하기',fig:()=>owlPlane({pts:[{x:3,y:0,lab:'y=0'}]}),steps:[{t:'① 어떤 축 위인가?',hl:[],body:'x축 위 → y=0 / y축 위 → x=0'},{t:'② 방정식 세우기',hl:[],body:'그 좌표 식 = 0'},{t:'③ 값 구하기',hl:[],body:'일차방정식으로 미지수 구하기'}],pitfall:'⚠️ "x축 위면 y=0, y축 위면 x=0" — 문자 반대로 기억하지 않기!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 점 P(a, b) 사분면 → 바뀐 점의 사분면 찾기',sub:'부호 +, −를 결정해 (b, a), (a−b, ab)의 사분면 찾기'},
    {id:'C2',nm:'복합 ② · 세 점으로 만든 삼각형 넓이 구하기',sub:'축 위 또는 평행한 두 점 거리를 밑변으로 삼각형 넓이 구하기'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,qd=[1,2,3,4][r%4];
      const sa=(qd===1||qd===4)?1:-1,sb=qd<=2?1:-1;
      const qName=sa>0?(sb>0?'제1사분면':'제4사분면'):(sb>0?'제2사분면':'제3사분면');
      const newQ=(sb>0&&(-sa)>0)?'제1사분면':(sb<0&&(-sa)>0)?'제2사분면':(sb<0&&(-sa)<0)?'제3사분면':'제4사분면';
      return{id:'C1',combo:[3,2],comboWhy:'① 주어진 사분면에서 a, b의 부호를 찾고(유형 3) → ② 새 순서쌍의 부호 확인(유형 2)',ptype:'coord:c1',
        title:`점 P(a, b)가 <b>${qName}</b> 위의 점일 때, 점 <b>Q(b, −a)</b>는 몇 사분면 위의 점인지 구하시오.`,
        fig:{svg:()=>owlPlane({qHL:qd,pts:[{x:sa*2,y:sb*2,lab:'P(a,b)'}]})},finalQ:'점 Q(b, −a)가 속하는 사분면은?',
        steps:[
          {tag:'1단계 · a, b 부호 확인',q:`${qName} 위의 점 P(a, b)에서 b의 부호는?`,type:'choice',choices:['양수 (+)','음수 (−)'],ans:sb>0?'양수 (+)':'음수 (−)',hint:'y좌표의 부호(위쪽 +, 아래쪽 −)를 봐요.'},
          {tag:'2단계 · −a의 부호 확인',q:`−a의 부호는? (a가 ${sa>0?'양수':'음수'}이므로 부호가 반대!)`,type:'choice',choices:['양수 (+)','음수 (−)'],ans:(-sa)>0?'양수 (+)':'음수 (−)',hint:'음수 기호 −가 붙으면 부호가 반대로 바뀌어요.'},
          {tag:'3단계 · Q(b, −a)의 사분면',q:`따라서 점 Q(b, −a)는 몇 사분면인가요?`,type:'choice',choices:['제1사분면','제2사분면','제3사분면','제4사분면'],ans:newQ,hint:`부호 (${sb>0?'+':'−'}, ${-sa>0?'+':'−'})`,ok:`Q(b, −a)는 ${newQ}에 있어요!`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,a=[2,4,6][r%3],b=2+(r>>>3)%5,area=a*b/2;
      return{id:'C2',combo:[2,4],comboWhy:'① 좌표평면 위 축 위의 점 위치를 찾고(유형 2) → ② 축 위 거리로 삼각형 넓이(유형 4)',ptype:'coord:c2',
        title:`세 점 O(0, 0), A(${a}, 0), B(0, ${b})를 꼭짓점으로 하는 삼각형 OAB의 <b>넓이</b>를 구하시오.`,
        fig:{svg:()=>owlPlane({pts:[{x:0,y:0,lab:'O'},{x:a>4?4:a,y:0,lab:`A(${a},0)`},{x:0,y:b>4?4:b,lab:`B(0,${b})`}]})},finalQ:'삼각형 OAB의 넓이는?',
        steps:[
          {tag:'1단계 · 밑변과 높이',q:`밑변 OA의 길이 = ${a}, 높이 OB의 길이 = ?`,type:'num',ans:b,hint:'y축 위의 점 B(0, '+b+')까지 원점에서의 거리예요.'},
          {tag:'2단계 · 삼각형 넓이 (÷ 2)',q:`넓이 = (${a} × ${b}) ÷ 2 = ?`,type:'num',ans:area,hint:`${a*b} ÷ 2`,ok:`삼각형 넓이 = ${area}`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── 2차시 graph ── */
HG_TRACKS.register('graph',{
  kind:'proc',
  owlScenes:[
    {lv:1,cap:'장면 ① 그래프의 방향이 말해 주는 것',say:'오른쪽 위로 올라가면 <span class="kw">증가</span>, <span class="kw">가로로 평평(수평)</span>하면 <b>멈춤(변화 없음)</b>, 오른쪽 아래로 내려가면 <span class="warn">감소</span>예요!',svg:owlWalkGraph},
    {lv:2,cap:'장면 ② 용기 모양과 물 높이',say:'물을 일정하게 넣을 때, 병 폭이 <span class="kw">좁은 곳</span>은 높이가 쑥쑥 빠르게 올라가고, <span class="kw">넓은 곳</span>은 천천히 올라가요!',svg:owlWalkGraph,
      ask:{q:'두 사람의 시간-거리 그래프가 한 점에서 만났을 때 그 점(교점)의 뜻은?',choices:['같은 시각에 같은 위치에 있음','둘 다 정지해 있음','속력이 0이 됨'],ans:'같은 시각에 같은 위치에 있음',hint:'만난 점에서는 시각(x)과 거리(y)가 둘 다 똑같아요!',ok:'맞아요! 두 그래프가 만나는 점은 추월하거나 마주친 순간이에요.'}}
  ],
  owlSummary:['오른쪽 위(증가) · 수평(변화 없음/휴식) · 오른쪽 아래(감소)','병 폭이 좁을수록 물 높이는 가파르게(빠르게) 올라감','두 그래프 교점 = 같은 시각에 위치·높이가 같은 순간'],
  schemaQs:[
    {id:'gq1',q:'시간-거리 그래프에서 <b>가로로 평평한(수평)</b> 구간은 어떤 상태인가요?',fig:owlWalkGraph,choices:['멈춰서 쉬는 상태','가장 빠르게 달리는 상태'],ans:'멈춰서 쉬는 상태',hint:'시간은 흐르는데 거리가 늘거나 줄지 않았어요.',why:'맞아요! 거리가 변하지 않으면 정지해 있는 상태예요.'},
    {id:'gq2',q:'원기둥 모양 물병에 일정한 속도로 물을 넣으면 높이 그래프는 <b>곡선</b>일까요?',fig:owlWalkGraph,choices:['아니요, 곧은 직선이에요','위로 휘어진 곡선이에요'],ans:'아니요, 곧은 직선이에요',hint:'원기둥은 아래부터 위까지 폭이 똑같아요.',why:'아니에요! 폭이 변하지 않으므로 일정한 기울기의 직선이에요.'},
    {id:'gq3',q:'아래가 넓고 위로 갈수록 <b>좁아지는</b> 병은 물 높이가 점점 어떻게 변하나요?',fig:owlWalkGraph,choices:['점점 빠르게(가파르게) 올라가요','점점 느리게 올라가요'],ans:'점점 빠르게(가파르게) 올라가요',hint:'좁아질수록 같은 물 양으로도 높이가 많이 올라가요.',why:'맞아요! 갈수록 가파른 곡선이 그려져요.'}
  ],
  firstGuide:[
    {id:'gfg1',tyNo:2,title:'유형 2 · 정지한 시간 읽기',problem:'출발 후 <b>3분부터 7분까지</b> 거리 200 m 그대로 수평이었어요. 몇 분 동안 멈춰 있었나요?',fig:owlWalkGraph,
      wantChips:['멈춰 있던 시간 (분)','총 이동 거리','최고 속력'],wantAns:'멈춰 있던 시간 (분)',wantHl:[],
      givenChips:[{k:'a',t:'멈추기 시작 3분',ok:true},{k:'b',t:'다시 움직임 7분',ok:true},{k:'t',t:'거리 200 m',ok:false}],
      teacherEq:'7 − 3 = 4 (분)',pairQ:'왜 7에서 3을 뺐나요?',pairChoices:['시작 시각(3)부터 끝 시각(7)까지의 간격을 구하려고','거리 200을 나누려고'],pairAns:'시작 시각(3)부터 끝 시각(7)까지의 간격을 구하려고',
      calcPrompt:'7 − 3 = ? (분)',calcAns:4,calcTopic:'sub',calcExplain:'7 − 3 = <b>4분</b> 동안 쉬었어요.'},
    {id:'gfg2',tyNo:1,title:'유형 1 · 표로 변화 값 예측하기',problem:'1분마다 온도가 <b>4°C</b>씩 내려갈 때 <b>5분</b> 동안 총 몇 °C 내려가나요?',fig:owlWalkGraph,
      wantChips:['총 내려간 온도 (°C)','처음 온도','최고 시각'],wantAns:'총 내려간 온도 (°C)',wantHl:[],
      givenChips:[{k:'a',t:'1분당 4°C 변화',ok:true},{k:'b',t:'5분 동안',ok:true},{k:'t',t:'현재 20°C',ok:false}],
      teacherEq:'4 × 5 = 20 (°C)',pairQ:'왜 곱셈(4 × 5)을 했나요?',pairChoices:['매분 같은 양 4°C가 5번 쌓이니까','4분과 5분을 더해서'],pairAns:'매분 같은 양 4°C가 5번 쌓이니까',
      calcPrompt:'4 × 5 = ? (°C)',calcAns:20,calcTopic:'mul',calcExplain:'4 × 5 = <b>20°C</b>만큼 변해요.'},
    {id:'gfg3',tyNo:4,title:'유형 4 · 두 사람 추월 시각 구하기',problem:'30 m 앞선 동생(초속 3 m)을 형(초속 5 m)이 따라갈 때 몇 초 뒤에 따라잡나요?',fig:owlWalkGraph,
      wantChips:['따라잡는 시각 (초)','형 속력','동생 처음 위치'],wantAns:'따라잡는 시각 (초)',wantHl:[],
      givenChips:[{k:'a',t:'처음 거리 차 30 m',ok:true},{k:'b',t:'1초당 5−3 = 2 m 좁혀짐',ok:true},{k:'t',t:'5+3 = 8',ok:false}],
      teacherEq:'30 ÷ (5 − 3) = 30 ÷ 2',pairQ:'왜 속력 차이 <b>(5 − 3)</b>으로 나누었나요?',pairChoices:['매초 2 m씩 거리가 줄어드니까','둘의 거리를 더하려고'],pairAns:'매초 2 m씩 거리가 줄어드니까',
      calcPrompt:'30 ÷ 2 = ? (초)',calcAns:15,calcTopic:'div',calcExplain:'30 ÷ 2 = <b>15초</b> 뒤에 만나요.'}
  ],
  stratRows:[
    ['구간 읽기','기울기(방향)','↗ 증가 / → 수평(변화 0) / ↘ 감소'],
    ['용기와 물 높이','폭 넓이 보기','넓으면 완만, 좁으면 가파름, 일정하면 직선'],
    ['두 그래프 비교','교점 · 간격','만난 점 = 같은 시각에 위치 같음']
  ],
  worked:{
    1:{no:1,nm:'변화 읽고 값 구하기',prob:'표나 문장에서 일정한 변화량 계산하기',fig:owlWalkGraph,steps:[{t:'① 1단위당 변화량',hl:[],body:'1분(또는 1시간)당 얼마나 변하는지 확인'},{t:'② 시간 곱하기',hl:[],body:'변화량 × 경과 시간'},{t:'③ 처음 값과 합치기',hl:[],body:'출발 값이 0이 아니면 더하거나 빼기'}],pitfall:'⚠️ 0이 아닌 값에서 시작할 때 처음 값을 잊지 마세요!'},
    2:{no:2,nm:'그래프 구간 읽기',prob:'그래프에서 정지·감소·최댓값 읽기',fig:owlWalkGraph,steps:[{t:'① 가로선(수평) 찾기',hl:[],body:'끝 시각 − 시작 시각 = 멈춘 시간'},{t:'② 가장 높은 점 읽기',hl:[],body:'y축 눈금과 그때 x축 시각 읽기'},{t:'③ 내려가는 구간 확인',hl:[],body:'감소한 총 시간 계산'}],pitfall:'⚠️ 끝 시각만 읽고 시작 시각을 안 빼는 실수 조심!'},
    3:{no:3,nm:'용기와 그래프 짝짓기',prob:'병의 단면 모양 보고 물 높이 그래프 고르기',fig:owlWalkGraph,steps:[{t:'① 아래쪽 폭 보기',hl:[],body:'넓은 곳은 천천히(완만)'},{t:'② 위쪽 폭 보기',hl:[],body:'좁은 곳은 빠르게(가파름)'},{t:'③ 2단 모양 체크',hl:[],body:'폭이 갑자기 바뀌면 꺾이는 직선'}],pitfall:'⚠️ 넓음=완만, 좁음=가파름! 반대로 짝짓지 마세요.'},
    4:{no:4,nm:'두 그래프 교점·추월',prob:'두 사람의 그래프에서 만나는 시각 찾기',fig:owlWalkGraph,steps:[{t:'① 1초당 거리 차 계산',hl:[],body:'빠른 속력 − 느린 속력'},{t:'② 처음 거리 ÷ 속력 차',hl:[],body:'만나는 데 걸리는 시간 구하기'},{t:'③ 만나는 위치 확인',hl:[],body:'빠른 속력 × 시간'}],pitfall:'⚠️ 두 속력을 더하는 게 아니라 "추격"이므로 빼야 해요!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 2단 폭이 다른 용기 높이 그래프',sub:'아래 넓은 직선 + 위 좁은 직선 꺾이는 변화율 비교'},
    {id:'C2',nm:'복합 ② · 주기 운동 · 두 그래프 비교',sub:'관람차 최댓값과 감소 구간 또는 두 이동 그래프 교점'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,v1=2+(r%3),v2=v1*2,t1=3+(r>>>3)%3,t2=2+(r>>>6)%3,ans=v1*t1+v2*t2;
      return{id:'C1',combo:[3,1],comboWhy:'① 2단 용기의 위·아래 폭 차이를 파악(유형 3) → ② 각 구간의 높이 합 계산(유형 1)',ptype:'graph:c1',
        title:`아래쪽 넓은 칸은 1분에 <b>${v1} cm</b>씩 ${t1}분 동안 차고, 위쪽 좁은 칸은 1분에 <b>${v2} cm</b>씩 ${t2}분 동안 차는 2단 물통이 있어요. ${t1+t2}분 후 물의 전체 높이는?`,
        fig:{svg:owlWalkGraph},finalQ:`${t1+t2}분 후 물의 총 높이는 몇 cm인가요?`,
        steps:[
          {tag:'1단계 · 아래쪽 넓은 구간 높이',q:`처음 ${t1}분 동안 올라간 높이는? (${v1} × ${t1})`,type:'num',ans:v1*t1,suffix:'cm',hint:`${v1} × ${t1}`},
          {tag:'2단계 · 위쪽 좁은 구간 더해 전체 높이',q:`뒤의 ${t2}분(${v2}×${t2}=${v2*t2} cm)을 더한 총 높이는?`,type:'num',ans,suffix:'cm',hint:`${v1*t1} + ${v2*t2}`,ok:`${v1*t1} + ${v2*t2} = ${ans} cm`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,gap=20+10*(r%3),vSlow=3+(r>>>3)%3,vFast=vSlow+pick_(r>>>6,[2,5]);
      const tMeet=gap/(vFast-vSlow);if(!Number.isInteger(tMeet))return HG_TRACKS.specs.graph.genCompound.C2(seed+1);
      const dMeet=vFast*tMeet;
      return{id:'C2',combo:[2,4],comboWhy:'① 두 그래프의 출발 조건·구간을 읽고(유형 2) → ② 교점(추월 시각과 위치) 계산(유형 4)',ptype:'graph:c2',
        title:`집 앞에서 ${gap} m 떨어진 지점부터 걸어가는 형(초속 ${vSlow} m)을 동생(초속 ${vFast} m)이 집에서 뒤따라갈 때, 만나는 지점은 집에서 <b>몇 m</b> 떨어진 곳인가요?`,
        fig:{svg:owlWalkGraph},finalQ:'만나는 지점은 집에서 몇 m 떨어져 있나요?',
        steps:[
          {tag:'1단계 · 만나는 시각 구하기',q:`1초마다 ${vFast-vSlow} m씩 좁혀져요. ${gap} m 차이를 따라잡는 시각은 몇 초 후?`,type:'num',ans:tMeet,suffix:'초',hint:`${gap} ÷ ${vFast-vSlow}`},
          {tag:'2단계 · 만나는 거리 구하기',q:`집에서 출발한 동생이 ${tMeet}초 동안 간 거리는? (${vFast} × ${tMeet})`,type:'num',ans:dMeet,suffix:'m',hint:`${vFast} × ${tMeet}`,ok:`${tMeet}초 후 ${dMeet} m에서 만나요!`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── [T39] 정비례·반비례 '생김새 구별' 빠른 구별 (설계 총정리 2-1 아 ③) ──
   식·표·그래프 그림만 보고 고르게 해요(문제 글에 판단 근거를 쓰지 않음). 판단할 것 = 주황.
   보기는 실제로 헷갈리는 생각 수만큼, 늘 같은 순서. 🌱 숫자: 정비례 a = −3~4(0 빼고, 음수 꼭 포함). */
const rRnd=seed=>typeof mulberry==='function'?mulberry(seed):(()=>{let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)})();
const rPick=(r,arr)=>arr[Math.floor(r()*arr.length)%arr.length];
const itx=s=>String(s).replace(/([xy])/g,'<tspan font-style="italic">$1</tspan>');
/* 식 카드: parts = 문자열 또는 {fr:[분자, 분모]} */
function rEqSVG(parts){
  let x=0,body='';const fs=34,cy=82;
  const w=t=>String(t).replace(/<[^>]+>/g,'').length*fs*0.5;
  parts.forEach(p=>{
    if(typeof p==='string'){body+=`<text x="${x}" y="${cy+12}" font-size="${fs}" fill="${HL}">${itx(p)}</text>`;x+=w(p)}
    else{const [n,d]=p.fr,ww=Math.max(w(n),w(d))+10;
      body+=`<text x="${x+ww/2}" y="${cy-8}" text-anchor="middle" font-size="${fs-4}" fill="${HL}">${itx(n)}</text>`+
        `<line x1="${x}" y1="${cy+1}" x2="${x+ww}" y2="${cy+1}" stroke="${HL}" stroke-width="2.4"/>`+
        `<text x="${x+ww/2}" y="${cy+34}" text-anchor="middle" font-size="${fs-4}" fill="${HL}">${itx(d)}</text>`;x+=ww+6}
  });
  const W=280,ox=(W-x)/2;
  if(parts.length===1&&typeof parts[0]==='string')body=`<text x="${W/2}" y="${cy+12}" text-anchor="middle" font-size="${fs}" fill="${HL}">${itx(parts[0])}</text>`;
  return gB(W,160,`<rect x="8" y="8" width="${W-16}" height="144" rx="16" fill="${HLs}" fill-opacity=".45" stroke="${HL}" stroke-width="2.4"/><g transform="translate(${parts.length===1&&typeof parts[0]==='string'?0:f1(ox)},0)">${body}</g>`,'관계식 카드');
}
/* 표 카드: xs, ys (4칸) */
function rTabSVG(xs,ys){
  const W=290,c0=56,cw=54,y0=40,rh=44;
  let s=`<rect x="${c0-46}" y="${y0}" width="${46+cw*xs.length}" height="${rh*2}" fill="#fff" stroke="${HL}" stroke-width="2.4"/>`+
    `<line x1="${c0-46}" y1="${y0+rh}" x2="${c0+cw*xs.length}" y2="${y0+rh}" stroke="${HL}" stroke-width="1.6"/>`;
  for(let i=0;i<=xs.length;i++)s+=`<line x1="${c0+cw*i}" y1="${y0}" x2="${c0+cw*i}" y2="${y0+rh*2}" stroke="${HL}" stroke-width="${i?1.2:2}"/>`;
  s+=`<text x="${c0-23}" y="${y0+29}" text-anchor="middle" font-size="22" font-style="italic" fill="${INK}">x</text><text x="${c0-23}" y="${y0+rh+29}" text-anchor="middle" font-size="22" font-style="italic" fill="${INK}">y</text>`;
  xs.forEach((v,i)=>{s+=`<text x="${c0+cw*i+cw/2}" y="${y0+29}" text-anchor="middle" font-size="21" fill="${INK}">${neg(v)}</text><text x="${c0+cw*i+cw/2}" y="${y0+rh+29}" text-anchor="middle" font-size="21" font-weight="700" fill="${HL}">${neg(ys[i])}</text>`});
  if(xs.length>1)s+=`<text x="${c0+cw*xs.length+8}" y="${y0+rh+29}" font-size="18" fill="${GY}">…</text>`;
  return gB(W,140,s,'x와 y의 표');
}
/* 그래프 카드: g = {line:[a,b]} | {inv:a} | {para:k} — 판단할 그래프를 주황으로 */
function rPlaneSVG(g){
  const W=240,H=220,rng=4,cx=W/2,cy=H/2,st=24,X=v=>f1(cx+v*st),Y=v=>f1(cy-v*st);
  let s='';
  for(let i=-rng;i<=rng;i++){s+=`<line x1="${X(-rng)}" y1="${Y(i)}" x2="${X(rng)}" y2="${Y(i)}" stroke="${i===0?INK:'#e3e8f1'}" stroke-width="${i===0?1.8:0.8}"/><line x1="${X(i)}" y1="${Y(-rng)}" x2="${X(i)}" y2="${Y(rng)}" stroke="${i===0?INK:'#e3e8f1'}" stroke-width="${i===0?1.8:0.8}"/>`}
  s+=`<text x="${X(rng)+6}" y="${cy+5}" font-size="14" font-style="italic" fill="${INK}">x</text><text x="${cx+6}" y="${Y(rng)-4}" font-size="14" font-style="italic" fill="${INK}">y</text><text x="${cx-14}" y="${cy+16}" font-size="13" font-style="italic" fill="${INK}">O</text>`;
  const pl=pts=>`<polyline points="${pts.join(' ')}" fill="none" stroke="${HL}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  const clip=(fn,x0,x1)=>{const pts=[];for(let k=0;k<=60;k++){const x=x0+(x1-x0)*k/60,y=fn(x);if(Math.abs(y)<=rng+0.05&&Math.abs(x)<=rng)pts.push(`${X(x)},${Y(y)}`)}return pts};
  if(g.line){const[a,b]=g.line;s+=pl(clip(x=>a*x+b,-rng,rng))}
  if(g.inv!=null){s+=pl(clip(x=>g.inv/x,0.2,rng))+pl(clip(x=>g.inv/x,-rng,-0.2))}
  if(g.para!=null){s+=pl(clip(x=>g.para*x*x,-rng,rng))}
  return gB(W,H,s,'좌표평면 위의 그래프');
}
const PROP_A=[-3,-2,-1,2,3,4],PROP_AP=[2,3,4],PROP_AN=[-3,-2,-1];
const INV_A=[4,6,8,12],ax_=a=>a===1?'x':a===-1?'−x':neg(a)+'x';
const R_EQ=['정비례예요','정비례가 아니에요'],R_PI=['정비례','반비례','둘 다 아니에요'];
/* prop: 식·표가 정비례인지 (사례 6 : 비사례 4) */
const propRapid={n:10,kinds:10,title:'정비례일까요? 생김새로 구별해요',q:'주황색 관계에서 y는 x에 정비례할까요?',choices:R_EQ,check:[2,5,7],
  make(k,seed){const r=rRnd(seed),xs=[1,2,3,4];
    if(k===0){const a=rPick(r,PROP_AP);return{fig:rEqSVG([`y = ${ax_(a)}`]),ans:R_EQ[0],why:`y = (수) × x 꼴이에요. a = ${a}인 정비례예요.`}}
    if(k===1){const a=rPick(r,PROP_AN);return{fig:rEqSVG([`y = ${ax_(a)}`]),ans:R_EQ[0],why:`a가 음수(${neg(a)})여도 y = ax 꼴이면 정비례예요.`}}
    if(k===2){const d=rPick(r,[2,3,4]);return{fig:rEqSVG(['y = ',{fr:['x',String(d)]}]),ans:R_EQ[0],why:`x가 위(분자)에 있어요. y = ${'1/'+d} × x 라서 정비례예요. x가 아래(분모)에 있을 때만 반비례예요.`}}
    if(k===3){const a=rPick(r,PROP_AP);return{fig:rTabSVG(xs,xs.map(x=>a*x)),ans:R_EQ[0],why:`x가 1일 때 y가 ${a}, x가 2배·3배가 되면 y도 2배·3배예요. y = ${a}x예요.`}}
    if(k===4){const a=rPick(r,PROP_AN);return{fig:rTabSVG(xs,xs.map(x=>a*x)),ans:R_EQ[0],why:`y가 줄어들어도 x가 2배일 때 y도 2배(${neg(a)} → ${neg(2*a)})예요. y = ${ax_(a)}인 정비례예요.`}}
    if(k===5){const a=rPick(r,[1,2,3]),b=rPick(r,[1,2,3,5]);return{fig:rEqSVG([`y = ${ax_(a)} + ${b}`]),ans:R_EQ[1],why:`+ ${b}가 붙어 있어요. x = 1을 넣으면 ${a+b}, x = 2를 넣으면 ${2*a+b}라서 2배가 안 돼요.`}}
    if(k===6){const a=rPick(r,INV_A);return{fig:rEqSVG(['y = ',{fr:[String(a),'x']}]),ans:R_EQ[1],why:`x가 아래(분모)에 있어요. x가 커지면 y가 작아지는 반비례예요.`}}
    if(k===7){const b=rPick(r,[1,2,3]);return{fig:rTabSVG(xs,xs.map(x=>x+b)),ans:R_EQ[1],why:`x가 1에서 2로 2배가 될 때 y는 ${1+b}에서 ${2+b}로, 2배가 아니에요. 늘어난다고 다 정비례는 아니에요.`}}
    if(k===8){const a=rPick(r,[-1,1]);return{fig:rEqSVG([`y = ${ax_(a)}`]),ans:R_EQ[0],why:`y = ${a===1?'1':'−1'} × x 예요. 수 1은 쓰지 않을 뿐, y = ax 꼴이라 정비례예요.`}}
    const a=12;return{fig:rTabSVG(xs,[12,6,4,3]),ans:R_EQ[1],why:`x가 2배가 될 때 y는 ½배가 돼요(12 → 6). 곱 x × y = ${a}로 같은 반비례예요.`}}};
/* propg: 그래프가 정비례 그래프인지 → a의 부호 */
const R_GQ='주황색 그래프는 정비례 y = ax의 그래프일까요?',R_GC=['정비례 그래프예요','정비례 그래프가 아니에요'],R_SQ='주황색 정비례 그래프에서 a는 양수일까요, 음수일까요?',R_SC=['a > 0','a < 0'];
const propgRapid={n:9,kinds:9,title:'정비례 그래프일까요? 모양으로 구별해요',q:R_GQ,choices:R_GC,check:[2,3,8],
  order(r){const g=[0,1,2,3,4,5,6];for(let i=g.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[g[i],g[j]]=[g[j],g[i]]}return g.concat(r()<0.5?[7,8]:[8,7])},
  make(k,seed){const r=rRnd(seed);
    if(k===0){const a=rPick(r,[1,2]);return{fig:rPlaneSVG({line:[a,0]}),ans:R_GC[0],why:'원점 O를 지나는 곧은 직선이에요. 정비례 그래프예요.'}}
    if(k===1){const a=rPick(r,[-1,-2]);return{fig:rPlaneSVG({line:[a,0]}),ans:R_GC[0],why:'오른쪽 아래로 내려가도 원점을 지나는 직선이면 정비례 그래프예요(a가 음수).'}}
    if(k===2){const a=rPick(r,[1,2,-1]),b=rPick(r,[1,2,-2]);return{fig:rPlaneSVG({line:[a,b]}),ans:R_GC[1],why:'곧은 직선이지만 원점 O를 지나지 않아요. 정비례 그래프는 꼭 원점을 지나요.'}}
    if(k===3){const a=rPick(r,[2,3,-2,-3]);return{fig:rPlaneSVG({inv:a}),ans:R_GC[1],why:'곡선 두 개이고 원점을 지나지 않아요. 반비례 그래프예요.'}}
    if(k===4){const a=rPick(r,[0.5,-0.5,1]);return{fig:rPlaneSVG({para:a}),ans:R_GC[1],why:'원점을 지나지만 휘어진 곡선이에요. 정비례 그래프는 곧은 직선이에요.'}}
    if(k===5){const a=rPick(r,[3,4]);return{fig:rPlaneSVG({line:[a,0]}),ans:R_GC[0],why:'가파르지만 원점을 지나는 곧은 직선이에요. 정비례 그래프예요.'}}
    if(k===6){const a=rPick(r,[-3,-0.5]);return{fig:rPlaneSVG({line:[a,0]}),ans:R_GC[0],why:'기울기와 상관없이 원점을 지나는 직선이면 정비례 그래프예요.'}}
    if(k===7){const a=rPick(r,PROP_AP);return{q:R_SQ,choices:R_SC,fig:rPlaneSVG({line:[a,0]}),ans:R_SC[0],why:'오른쪽 위로 올라가요(제1·3사분면). a > 0이에요.'}}
    const a=rPick(r,PROP_AN);return{q:R_SQ,choices:R_SC,fig:rPlaneSVG({line:[a,0]}),ans:R_SC[1],why:'오른쪽 아래로 내려가요(제2·4사분면). a < 0이에요.'}}};
/* inv: 정비례 / 반비례 / 둘 다 아님 */
const invRapid={n:10,kinds:10,title:'정비례? 반비례? 생김새로 구별해요',q:'주황색 관계는 무엇일까요?',choices:R_PI,check:[2,7,8],
  make(k,seed){const r=rRnd(seed),a=rPick(r,INV_A),xs=[1,2,3,4];
    if(k===0)return{fig:rEqSVG(['y = ',{fr:[String(a),'x']}]),ans:R_PI[1],why:`x가 아래(분모)에 있는 y = a/x 꼴이에요. 반비례예요.`};
    if(k===1)return{fig:rEqSVG(['y = −',{fr:[String(a),'x']}]),ans:R_PI[1],why:`a가 음수(−${a})여도 y = a/x 꼴이면 반비례예요.`};
    if(k===2)return{fig:rEqSVG([`xy = ${a}`]),ans:R_PI[1],why:`두 수의 곱 x × y가 ${a}로 늘 같아요. y = ${a}/x 인 반비례예요.`};
    if(k===3){const b=12,xx=[1,2,3,4];return{fig:rTabSVG(xx,xx.map(x=>b/x)),ans:R_PI[1],why:`위아래를 곱하면 1 × 12 = 2 × 6 = 3 × 4 = 4 × 3 = 12로 늘 같아요. 반비례예요.`}}
    if(k===4){const p=rPick(r,PROP_A);return{fig:rEqSVG([`y = ${ax_(p)}`]),ans:R_PI[0],why:'y = (수) × x 꼴이에요. 정비례예요.'}}
    if(k===5){const p=rPick(r,[2,3,4]);return{fig:rTabSVG(xs,xs.map(x=>p*x)),ans:R_PI[0],why:`x가 2배·3배가 되면 y도 2배·3배예요. y = ${p}x인 정비례예요.`}}
    if(k===6){const b=rPick(r,[2,3,5]);return{fig:rEqSVG([`y = x + ${b}`]),ans:R_PI[2],why:`+ ${b}가 붙어 있어요. 곱도 일정하지 않고 2배도 아니라서 둘 다 아니에요.`}}
    if(k===7){const s=rPick(r,[10,12]);return{fig:rEqSVG([`x + y = ${s}`]),ans:R_PI[2],why:`두 수의 '합'이 ${s}로 같아요. 반비례는 '곱'이 같아야 해요. 둘 다 아니에요.`}}
    if(k===8){const s=rPick(r,[8,10]);return{fig:rTabSVG(xs,xs.map(x=>s-x)),ans:R_PI[2],why:`y가 줄어들지만 곱이 같지 않아요(1 × ${s-1}, 2 × ${s-2}). 합 x + y = ${s}가 같아요. 둘 다 아니에요.`}}
    const d=rPick(r,[2,3]);return{fig:rEqSVG(['y = ',{fr:['x',String(d)]}]),ans:R_PI[0],why:`분수 모양이지만 x가 위(분자)에 있어요. y = 1/${d} × x 라서 정비례예요.`}}};
/* invg: 그래프 모양 → 사분면 */
const R_IGC=['정비례 그래프','반비례 그래프','둘 다 아니에요'],R_IQ='주황색 반비례 그래프는 어느 사분면에 있을까요?',R_IQC=['제1·3사분면','제2·4사분면'];
const invgRapid={n:8,kinds:8,title:'반비례 그래프일까요? 모양으로 구별해요',q:'주황색 그래프는 무엇일까요?',choices:R_IGC,check:[3,4,7],
  order(r){const g=[0,1,2,3,4,5];for(let i=g.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[g[i],g[j]]=[g[j],g[i]]}return g.concat(r()<0.5?[6,7]:[7,6])},
  make(k,seed){const r=rRnd(seed);
    if(k===0){const a=rPick(r,[2,3,4]);return{fig:rPlaneSVG({inv:a}),ans:R_IGC[1],why:'축에 닿지 않는 매끄러운 곡선 한 쌍이에요. 반비례 그래프예요.'}}
    if(k===1){const a=rPick(r,[-2,-3,-4]);return{fig:rPlaneSVG({inv:a}),ans:R_IGC[1],why:'제2·4사분면에 있어도 곡선 한 쌍이면 반비례 그래프예요(a가 음수).'}}
    if(k===2){const a=rPick(r,[1,2,-1,-2]);return{fig:rPlaneSVG({line:[a,0]}),ans:R_IGC[0],why:'원점을 지나는 곧은 직선이에요. 정비례 그래프예요.'}}
    if(k===3){const a=rPick(r,[1,-1]),b=rPick(r,[2,-2]);return{fig:rPlaneSVG({line:[a,b]}),ans:R_IGC[2],why:'직선이지만 원점을 지나지 않아요. 곡선도 아니라서 둘 다 아니에요.'}}
    if(k===4){const a=rPick(r,[0.5,-0.5]);return{fig:rPlaneSVG({para:a}),ans:R_IGC[2],why:'곡선이지만 원점을 지나요. 반비례 그래프는 원점과 축을 절대 지나지 않아요.'}}
    if(k===5){const a=rPick(r,[-3,3]);return{fig:rPlaneSVG({line:[a,0]}),ans:R_IGC[0],why:'가파르지만 원점을 지나는 직선이에요. 정비례 그래프예요.'}}
    if(k===6){const a=rPick(r,[2,3,4]);return{q:R_IQ,choices:R_IQC,fig:rPlaneSVG({inv:a}),ans:R_IQC[0],why:'오른쪽 위 칸(제1사분면)과 왼쪽 아래 칸(제3사분면)에 있어요. a > 0이에요.'}}
    const a=rPick(r,[-2,-3,-4]);return{q:R_IQ,choices:R_IQC,fig:rPlaneSVG({inv:a}),ans:R_IQC[1],why:'왼쪽 위 칸(제2사분면)과 오른쪽 아래 칸(제4사분면)에 있어요. a < 0이에요.'}}};
/* 🌱 마무리: 구별 문제 + 교과서 크기 숫자 1문제(대입, 계산은 쉽게) */
const t1FromSchema=qs=>qs.map(q=>({id:'t1'+q.id,kind:q.id,q:q.q,fig:q.fig,choices:q.choices,ans:q.ans,hint:q.hint,why:q.why}));

/* ── 3차시 prop · 정비례의 뜻과 식 (개념형, T35) ── */
HG_TRACKS.register('prop',{
  kind:'concept',
  owlScenes:[
    {lv:1,cap:'장면 ① x가 2배, 3배 → y도 2배, 3배 (y = ax)',say:'사과 1개 200원, 2개 400원, 3개 600원처럼 <span class="kw">x가 k배 될 때 y도 k배</span> 되는 관계가 <b>정비례 y = ax</b>예요!',svg:()=>owlPlane({a:2,pts:[{x:1,y:2,lab:'(1,2)'},{x:2,y:4,lab:'(2,4)'}]}),
      ask:{q:'다음 중 y가 x에 정비례하지 <b>않는</b> 식은?',choices:['y = x + 3','y = 3x','y = −2x','y = 5x'],ans:'y = x + 3',hint:'x가 2배가 될 때 y도 2배가 되는지 x = 1, 2를 넣어 확인해 봐요.',ok:'정확해요! y = x + 3은 x가 2배가 되어도 y가 2배가 되지 않아 정비례가 아니에요.'}},
    {lv:1,cap:'장면 ② a는 x가 1일 때의 y',say:'y = ax에서 <span class="kw">a</span>는 x가 1일 때 y의 값이에요. 사과 1개에 200원이면 a = 200, 그래서 <b>y = 200x</b>예요.',svg:()=>owlPlane({a:2,pts:[{x:1,y:2,lab:'(1, a)'}]})}
  ],
  owlSummary:['정비례 식: y = ax (a ≠ 0) · x가 2배면 y도 2배','x = 1일 때의 y 값이 바로 a (1당 변화량)'],
  schemaQs:[
    {id:'prq1',q:'관계식 <b>y = x + 5</b>에서 y는 x에 정비례할까요?',fig:()=>owlPlane({a:1}),choices:['아니요, +5 때문에 비례가 아니에요','네, 정비례예요'],ans:'아니요, +5 때문에 비례가 아니에요',hint:'x=1이면 y=6, x=2이면 y=7로 2배가 안 돼요.',why:'아니에요! y = ax처럼 상수항 없이 x에 수를 곱한 꼴이어야 해요.'},
    {id:'prq4',q:'관계식 <b>y = 4x</b>에서 y는 x에 정비례할까요?',fig:()=>owlPlane({a:2}),choices:['네, 정비례예요','아니요, 정비례가 아니에요'],ans:'네, 정비례예요',hint:'x = 1, 2, 3을 넣으면 y = 4, 8, 12예요.',why:'맞아요! y = ax 꼴(a = 4)이라 x가 2배면 y도 2배예요.'},
    {id:'prq5',q:'관계식 <b>y = 3/x</b>에서 y는 x에 정비례할까요?',fig:()=>owlPlane({inv:3}),choices:['아니요, 정비례가 아니에요','네, 정비례예요'],ans:'아니요, 정비례가 아니에요',hint:'x가 1에서 3으로 3배가 되면 y는 3에서 1로 줄어들어요.',why:'아니에요! x로 나눈 꼴은 x가 커질수록 y가 작아져요. 정비례는 y = ax 꼴이에요.'}
  ],
  firstGuide:[
    {id:'prfg1',tyNo:1,title:'유형 1 · 정비례 표 채우기',problem:'y가 x에 정비례하고, x = 2일 때 y = 10이에요. x = 6일 때 y의 값은?',fig:()=>owlPlane({a:2}),
      wantChips:['x=6일 때 y 값','a의 부호','x절편'],wantAns:'x=6일 때 y 값',wantHl:[],
      givenChips:[{k:'a',t:'x = 2일 때 y = 10',ok:true},{k:'b',t:'새 x = 6',ok:true},{k:'t',t:'합 2 + 10',ok:false}],
      teacherEq:'y = ax에 x, y를 넣어요 → 10 = a × 2 → a = 5 → y = 5 × 6',pairQ:'10 = a × 2 에서 a는 어떻게 구하나요?',pairChoices:['10 ÷ 2 = 5','10 × 2 = 20'],pairAns:'10 ÷ 2 = 5',
      calcPrompt:'y = 5 × 6 = ?',calcAns:30,calcTopic:'mul',calcExplain:'y = 5x에 6을 넣으면 <b>30</b>이에요.'},
    {id:'prfg2',tyNo:2,title:'유형 2 · 정비례 식 y=ax 값 구하기',problem:'1시간에 <b>8 km</b> 가는 자전거가 x시간 간 거리를 y km라 할 때, <b>7시간</b> 간 거리는?',fig:()=>owlPlane({a:2}),
      wantChips:['7시간 이동 거리 y','분속','원점'],wantAns:'7시간 이동 거리 y',wantHl:[],
      givenChips:[{k:'a',t:'식 y = 8x (1시간당 8 km)',ok:true},{k:'b',t:'x = 7',ok:true},{k:'t',t:'반비례 y=8/x',ok:false}],
      teacherEq:'y = 8 × 7',pairQ:'관계식 y = 8x에서 숫자 <b>8</b>의 뜻은 무엇인가요?',pairChoices:['1시간당 이동하는 거리','전체 시간'],pairAns:'1시간당 이동하는 거리',
      calcPrompt:'8 × 7 = ? (km)',calcAns:56,calcTopic:'sub',calcExplain:'y = 8 × 7 = <b>56 km</b>예요.'},
  ],
  stratRows:[
    ['정비례 식 판별','y = ax (상수항 0)','y=x+2(✕), y=3/x(✕), y=ax(○)'],
    ['실생활 식 세우기','1당 변화량 = a','단위(km→m, 시간→분) 먼저 통일하기!']
  ],
  worked:{
    1:{no:1,nm:'정비례 표 빈칸',prob:'정비례 표의 빈칸 구하기',fig:()=>owlPlane({a:2}),steps:[{t:'① 몇 배인지 보기',hl:[],body:'x가 k배면 y도 k배!'},{t:'② 또는 a = y÷x 찾기',hl:[],body:'x=1일 때 y의 값이 바로 a예요.'},{t:'③ 빈칸 채우기',hl:[],body:'음수면 부호 규칙 확인'}],pitfall:'⚠️ 표에서 x=1일 때 y 값이 안 보이면 아무 짝이나 y÷x로 a를 찾아요!'},
    2:{no:2,nm:'정비례 식 활용',prob:'y = ax 식 세우고 값 구하기',fig:()=>owlPlane({a:1.5}),steps:[{t:'① y = ax 틀 잡기',hl:[],body:'1개·1분·1시간당 늘어나는 양이 a예요.'},{t:'② 단위 확인',hl:[],body:'km를 m로 바꾸라는 조건 체크!'},{t:'③ 대입해 답 찾기',hl:[],body:'x를 넣으면 y, y를 넣으면 방정식으로 x'}],pitfall:'⚠️ 문제의 단위(km vs m)가 다르면 반드시 맞춘 뒤 대입해요!'}
  },
  compoundList:[
    {id:'C4',nm:'복합 ② · 표의 한 쌍으로 식 세우고 다른 값 구하기',sub:'x, y 한 쌍으로 a를 구한 뒤 y = ax에 새 x 넣기'},
    {id:'C1',nm:'복합 ① · 단위 변환 포함 정비례 식·값 구하기',sub:'분속 m와 총 거리 km의 단위를 맞춘 뒤 시간 계산'}
  ],
  genCompound:{
    C4:seed=>{
      const r=(seed*2654435761+7)>>>0,a=pick_(r,[2,3,4,5,6]),x1=pick_(r>>>4,[2,3,4]),x2=pick_(r>>>8,[5,6,7]),y1=a*x1,y2=a*x2;
      return{id:'C4',combo:[1,2],comboWhy:'① 표의 한 쌍으로 a를 구하고(유형 1) → ② 식 y = ax에 새 x를 넣어 값 구하기(유형 2)',ptype:'prop:c4',
        title:`y가 x에 정비례하고 x = <b>${x1}</b>일 때 y = <b>${y1}</b>이에요. x = <b>${x2}</b>일 때 y의 값을 구하시오.`,
        fig:{svg:()=>owlPlane({a:2,pts:[{x:1,y:2,lab:`(${x1}, ${y1})`}]})},finalQ:`x = ${x2}일 때 y의 값은?`,
        steps:[
          {tag:'1단계 · y = ax에 넣어 a 구하기',q:`${y1} = a × ${x1} → a = ?`,type:'num',ans:a,hint:`${y1} ÷ ${x1}`},
          {tag:'2단계 · 새 x 넣기',q:`y = ${a} × ${x2} = ?`,type:'num',ans:y2,hint:`${a} × ${x2}`,ok:`y = ${y2}`}
        ]};
    },
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,v=pick_(r,[200,300,400,500]),mins=pick_(r,[10,12,15,20]),distM=v*mins,distKm=distM/1000;
      return{id:'C1',combo:[2,1],comboWhy:'① km를 m로 바꾸어 비례 식 y=vx를 세우고(유형 2) → ② 정비례 표·값 계산(유형 1)',ptype:'prop:c1',
        title:`분속 <b>${v} m</b>로 달리는 자전거가 x분 동안 달린 거리를 y m라 할 때, 총 <b>${distKm} km</b> 도로를 완주하는 데 몇 분이 걸리나요?`,
        fig:{svg:()=>owlPlane({a:2})},finalQ:'완주하는 데 걸리는 시간은 몇 분인가요?',
        steps:[
          {tag:'1단계 · 단위 변환 (km → m)',q:`${distKm} km는 몇 m인가요? (× 1000)`,type:'num',ans:distM,suffix:'m',hint:`1 km = 1000 m → ${distKm} × 1000`},
          {tag:'2단계 · 식 y='+v+'x에 넣어 시간 구하기',q:`${v}x = ${distM} → x는 몇 분인가요?`,type:'num',ans:mins,suffix:'분',hint:`${distM} ÷ ${v}`,ok:`${mins}분 걸려요!`}
        ]};
    }
  },
  t3PracticeCids:['C1','C4']
});

/* ── 4차시 propg · 정비례의 그래프 (개념형, T35) ── */
HG_TRACKS.register('propg',{
  kind:'concept',
  owlScenes:[
    {lv:1,cap:'장면 ① 표의 점을 찍으면 한 직선',say:'y = 2x의 표 (1, 2), (2, 4), (3, 6)을 좌표평면에 찍어 이으면 <span class="kw">원점을 지나는 한 직선</span>이 돼요.',svg:()=>owlPlane({a:2,pts:[{x:1,y:2,lab:'(1,2)'},{x:2,y:4,lab:'(2,4)'}]})},
    {lv:1,cap:'장면 ② 원점 (0, 0) 지나는 직선 & a의 부호',say:'y = ax 그래프는 항상 <span class="kw">원점 (0, 0)</span>을 지나는 직선! a > 0이면 ↗(1·3사분면), a < 0이면 ↘(2·4사분면)이에요.',svg:()=>owlPlane({a:-2,pts:[{x:-1,y:2,lab:'(-1,2)'}]}),
      ask:{q:'정비례 관계 <b>y = −2x</b>의 그래프는 어느 사분면을 지나나요?',choices:['제2사분면, 제4사분면','제1사분면, 제3사분면','제1사분면, 제2사분면','제3사분면, 제4사분면'],ans:'제2사분면, 제4사분면',hint:'a = −2 < 0이면 원점을 지나 오른쪽 아래로 내려가요.',ok:'정확해요! a가 음수이면 오른쪽 아래로 내려가는 직선이라 제2·4사분면을 지나요.'}},
    {lv:1,cap:'장면 ③ 지나는 점으로 a 구하기',say:'그래프가 점 (2, 6)을 지나면 <span class="kw">y = ax에 x, y를 넣어요</span>. 6 = a × 2, 그래서 <b>a = 3</b>이에요.',svg:()=>owlPlane({a:3,pts:[{x:1,y:3,lab:'(2, 6)'}]})}
  ],
  owlSummary:['그래프: 원점 (0, 0)을 지나는 직선 (a>0 제1·3, a<0 제2·4)','지나는 점 (p, q)를 y = ax에 넣기 → q = a × p → a 구하기'],
  schemaQs:[
    {id:'prq2',q:'정비례 그래프 <b>y = −3x</b>는 몇 사분면을 지나나요?',fig:()=>owlPlane({a:-1.5}),choices:['제2사분면, 제4사분면','제1사분면, 제3사분면'],ans:'제2사분면, 제4사분면',hint:'a = −3 < 0이므로 오른쪽 아래로 내려가요.',why:'맞아요! 음수 기울기는 제2·4사분면을 지나요.'},
    {id:'prq3',q:'정비례 그래프가 원점 (0, 0)을 지나지 않을 수도 있을까요?',fig:()=>owlPlane({a:2}),choices:['항상 원점을 지나요','안 지날 수도 있어요'],ans:'항상 원점을 지나요',hint:'y = ax에 x=0을 대입하면 항상 y=0이에요.',why:'아니에요! 모든 정비례 그래프는 반드시 원점 (0, 0)을 지나요.'},
    {id:'prq6',q:'정비례 그래프 <b>y = 2x</b>는 x가 커질 때 어느 쪽으로 가나요?',fig:()=>owlPlane({a:2}),choices:['오른쪽 위로 올라가요','오른쪽 아래로 내려가요'],ans:'오른쪽 위로 올라가요',hint:'a = 2 > 0이에요.',why:'맞아요! a가 양수이면 오른쪽 위로 올라가는 직선이에요.'}
  ],
  firstGuide:[
    {id:'prfg3',tyNo:2,title:'유형 2 · 지나는 점으로 a 구하기',problem:'y = ax의 그래프가 점 <b>(3, −9)</b>를 지날 때 a의 값을 구하시오.',fig:()=>owlPlane({a:-2,pts:[{x:2,y:-4,lab:'점 대입'}]}),
      wantChips:['상수 a의 값','x좌표','넓이'],wantAns:'상수 a의 값',wantHl:[],
      givenChips:[{k:'a',t:'x = 3, y = −9 넣기',ok:true},{k:'b',t:'−9 = a × 3',ok:true},{k:'t',t:'a = x × y',ok:false}],
      teacherEq:'y = ax에 x, y를 넣어요 → −9 = a × 3 → a = (−9) ÷ 3',pairQ:'a를 구하려면 y를 x로 나누는 이유는?',pairChoices:['y = ax에서 양변을 x로 나누면 a = y/x니까','반비례라서'],pairAns:'y = ax에서 양변을 x로 나누면 a = y/x니까',
      calcPrompt:'(−9) ÷ 3 = ?',calcAns:-3,calcTopic:'signmul',calcExplain:'a = (−9) ÷ 3 = <b>−3</b>예요.'}
  ],
  stratRows:[
    ['그래프 모양','원점 지나는 직선','a > 0 ↗ 제1·3사분면 / a < 0 ↘ 제2·4사분면'],
    ['지나는 점 (p, q)','대입 → a = q ÷ p','다른 점 구할 땐 구한 식 y=ax에 다시 대입']
  ],
  worked:{
    1:{no:1,nm:'정비례 그래프 성질',prob:'y = ax 그래프 사분면과 기울기',fig:()=>owlPlane({a:-1.5}),steps:[{t:'① 원점 지나는 직선',hl:[],body:'항상 (0, 0)을 지나요.'},{t:'② a 부호 확인',hl:[],body:'a>0 제1·3사분면 / a<0 제2·4사분면'},{t:'③ |a| 크기 비교',hl:[],body:'|a|가 클수록 y축에 가까워요.'}],pitfall:'⚠️ a가 음수일 때 |a|가 크면 -3x처럼 y축에 더 가파르게 붙어요!'},
    2:{no:2,nm:'지나는 점으로 a 구하기',prob:'점 (p, q)로 a 구하기',fig:()=>owlPlane({a:-2,pts:[{x:-1,y:2,lab:'(-1,2)'}]}),steps:[{t:'① 대입하기',hl:[],body:'q = a × p'},{t:'② a = q ÷ p 계산',hl:[],body:'부호 규칙 적용'},{t:'③ 검산',hl:[],body:'원래 점을 다시 넣어 맞는지 확인'}],pitfall:'⚠️ 반비례(a = xy)와 헷갈려 x랑 y를 곱하지 마세요!'}
  },
  compoundList:[
    {id:'C2',nm:'복합 ② · 한 점으로 식 구해 다른 두 점 미지수 구하기',sub:'(p,q)→a 구한 뒤 (m, b), (c, n) 대입해 b+c·bc 계산'},
    {id:'C3',nm:'복합 ③ · 삼각형 OAB 넓이 이등분하는 y=ax 구하기',sub:'삼각형 넓이의 1/2 교점을 구해 y=ax의 a 찾기'}
  ],
  genCompound:{
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,a=pick_(r,[-3,-2,2,3]),px=pick_(r,[-2,2]),py=a*px,qx=pick_(r,[3,-3,4]),b=a*qx,ans=a+b;
      return{id:'C2',combo:[2,1],comboWhy:'① 지나는 점으로 먼저 a를 구하고(유형 2) → ② 완성된 식에 새 점을 넣어 b 구하기(유형 2)',ptype:'propg:c2',
        title:`정비례 관계 <b>y = ax</b>의 그래프가 두 점 <b>(${neg(px)}, ${neg(py)})</b>와 <b>(${neg(qx)}, b)</b>를 지날 때, <b>a + b</b>의 값을 구하시오.`,
        fig:{svg:()=>owlPlane({a:a>0?1.5:-1.5,pts:[{x:px,y:py>4?3:py<-4?-3:py,lab:'주어진 점'}]})},finalQ:'a + b의 값은?',
        steps:[
          {tag:'1단계 · a 구하기',q:`점 (${neg(px)}, ${neg(py)})를 y=ax에 넣으면 a = ?`,type:'sn',ans:a,ansText:neg(a),hint:`(${neg(py)}) ÷ (${neg(px)})`},
          {tag:'2단계 · b 구하고 a+b 계산',q:`y = ${neg(a)}x에 x=${neg(qx)}을 넣으면 b = ${neg(b)}예요. a + b = ?`,type:'sn',ans,ansText:neg(ans),hint:`(${neg(a)}) + (${neg(b)})`,ok:`a+b = ${neg(ans)}`}
        ]};
    },
    C3:seed=>{
      const r=(seed*1103515245+12345)>>>0,A=pick_(r,[4,6,8]),B=pick_(r,[4,6,8]),midX=A/2,midY=B/2,a=midY/midX;
      if(!Number.isInteger(a))return HG_TRACKS.specs.propg.genCompound.C3(seed+1);
      return{id:'C3',combo:[1,2],comboWhy:'① 직선 y=ax와 삼각형 교점(중점)을 파악하고(유형 1) → ② 교점 좌표로 a 구하기(유형 2)',ptype:'propg:c3',
        title:`세 점 O(0,0), A(${A},0), B(0,${B})를 꼭짓점으로 하는 삼각형 OAB의 넓이를 직선 <b>y = ax</b>가 선분 AB의 중점을 지나며 <b>이등분</b>할 때, 상수 <b>a</b>의 값을 구하시오.`,
        fig:{svg:()=>owlPlane({a:1,pts:[{x:3,y:0,lab:`A(${A},0)`},{x:0,y:3,lab:`B(0,${B})`}]})},finalQ:'a의 값은?',
        steps:[
          {tag:'1단계 · 선분 AB 중점의 좌표',q:`A(${A},0)과 B(0,${B})의 가운데 점 M의 좌표는 (${midX}, ?)예요. y좌표는 얼마인가요?`,type:'num',ans:midY,hint:`높이 ${B}의 절반`},
          {tag:'2단계 · 중점 대입해 a 구하기',q:`y = ax가 (${midX}, ${midY})를 지나므로 a = ${midY} ÷ ${midX} = ?`,type:'num',ans:a,hint:`${midY} ÷ ${midX}`,ok:`a = ${a}`}
        ]};
    }
  },
  t3PracticeCids:['C2','C3']
});

/* ── 5차시 inv · 반비례의 뜻과 식 (개념형, T35) ── */
HG_TRACKS.register('inv',{
  kind:'concept',
  owlScenes:[
    {lv:1,cap:'장면 ① x × y = a (곱이 항상 같아요!)',say:'사탕 24개를 x명에게 똑같이 나누어 주면 한 사람 몫 y = 24/x! <b>x가 2배, 3배 되면 y는 ½배, ⅓배</b>가 되는 것이 <span class="kw">반비례 y = a/x</span>예요.',svg:()=>owlPlane({inv:4,pts:[{x:1,y:4,lab:'1×4=4'},{x:2,y:2,lab:'2×2=4'}]}),
      ask:{q:'다음 중 y가 x에 <b>반비례</b>하는 관계는?',choices:['x × y = 20','x + y = 20','y = 20x','y = x − 20'],ans:'x × y = 20',hint:'두 수의 곱(xy)이 일정한 것을 찾아요!',ok:'정확해요! x × y = 20이면 y = 20/x가 되어 반비례예요.'}},
    {lv:1,cap:'장면 ② a는 x × y',say:'표에서 짝지은 x와 y를 곱해 보면 늘 같아요. <span class="kw">그 곱이 바로 a</span>! 2 × 12 = 3 × 8 = 24이면 <b>y = 24/x</b>예요.',svg:()=>owlPlane({inv:4,pts:[{x:1,y:4,lab:'1×4'},{x:2,y:2,lab:'2×2'}]})}
  ],
  owlSummary:['반비례 식: y = a/x (x × y = a 곱이 일정!)','x가 2배, 3배 → y는 ½배, ⅓배'],
  schemaQs:[
    {id:'iq1',q:'x + y = 12처럼 두 수의 <b>합</b>이 일정하면 반비례일까요?',fig:()=>owlPlane({inv:4}),choices:['아니요, 곱(xy)이 일정해야 반비례예요','네, x가 커지면 y가 작아지니 반비례예요'],ans:'아니요, 곱(xy)이 일정해야 반비례예요',hint:'x가 2배 될 때 y가 ½배가 되는지 확인해 봐요.',why:'아니에요! 반비례는 합이 아니라 x × y = a(곱)이 일정해야 해요.'},
    {id:'iq4',q:'<b>x × y = 18</b>이면 y는 x에 반비례할까요?',fig:()=>owlPlane({inv:4}),choices:['네, 반비례예요','아니요, 반비례가 아니에요'],ans:'네, 반비례예요',hint:'두 수의 곱이 늘 18로 같아요.',why:'맞아요! 곱이 일정하면 y = 18/x로 반비례예요.'},
    {id:'iq5',q:'관계식 <b>y = 5x</b>에서 y는 x에 반비례할까요?',fig:()=>owlPlane({a:2}),choices:['아니요, 정비례예요','네, 반비례예요'],ans:'아니요, 정비례예요',hint:'x가 2배가 되면 y는 어떻게 되나요?',why:'아니에요! x가 2배면 y도 2배라 정비례예요.'}
  ],
  firstGuide:[
    {id:'ifg1',tyNo:1,title:'유형 1 · 반비례 표 빈칸 구하기',problem:'y가 x에 <b>반비례</b>하고 x = 3일 때 y = 8이에요. x = 6일 때 y는?',fig:()=>owlPlane({inv:4}),
      wantChips:['x=6일 때 y 값','두 수의 합','x축 교점'],wantAns:'x=6일 때 y 값',wantHl:[],
      givenChips:[{k:'a',t:'x = 3일 때 y = 8',ok:true},{k:'b',t:'새 x = 6',ok:true},{k:'t',t:'합 3 + 8 = 11',ok:false}],
      teacherEq:'y = a/x에 넣어요 → 8 = a ÷ 3 → a = 24 → y = 24 ÷ 6',pairQ:'8 = a ÷ 3 에서 a는 어떻게 구하나요?',pairChoices:['8 × 3 = 24','8 ÷ 3'],pairAns:'8 × 3 = 24',
      calcPrompt:'24 ÷ 6 = ?',calcAns:4,calcTopic:'div',calcExplain:'24 ÷ 6 = <b>4</b>예요.'},
    {id:'ifg2',tyNo:2,title:'유형 2 · 반비례 활용 문제',problem:'사탕 <b>36개</b>를 x명에게 똑같이 나누어 줄 때 한 사람 몫을 y개라 해요. <b>9명</b>이면 몇 개씩 받나요?',fig:()=>owlPlane({inv:4}),
      wantChips:['9명일 때 한 사람 몫 y','남은 사탕','전체 합'],wantAns:'9명일 때 한 사람 몫 y',wantHl:[],
      givenChips:[{k:'a',t:'총 사탕 x × y = 36',ok:true},{k:'b',t:'사람 수 x = 9',ok:true},{k:'t',t:'y = 36x',ok:false}],
      teacherEq:'y = 36 / x → y = 36 ÷ 9',pairQ:'사람 수(x)가 늘어나면 한 사람 몫(y)은 어떻게 되나요?',pairChoices:['나눠 받는 만큼 줄어든다 (반비례)','똑같이 늘어난다'],pairAns:'나눠 받는 만큼 줄어든다 (반비례)',
      calcPrompt:'36 ÷ 9 = ? (개)',calcAns:4,calcTopic:'div',calcExplain:'36 ÷ 9 = <b>4개</b>씩 받아요.'},
  ],
  stratRows:[
    ['반비례 판별','x × y = a 일정!','x+y=a (✕) · y=a/x (○) · x=0 축 안 만남'],
  ],
  worked:{
    1:{no:1,nm:'반비례 표 빈칸',prob:'반비례 표 완성하기',fig:()=>owlPlane({inv:4}),steps:[{t:'① 곱 xy 구하기',hl:[],body:'짝지어진 x와 y를 곱해 항상 같은 a 찾기'},{t:'② 나눗셈으로 빈칸',hl:[],body:'a ÷ (알고 있는 수) = 나머지 수'},{t:'③ 검산',hl:[],body:'모든 칸의 x×y가 a로 같은지 확인'}],pitfall:'⚠️ x×y가 아니라 y÷x를 하면 정비례와 섞여 틀려요!'},
    2:{no:2,nm:'반비례 식 활용',prob:'넓이·거리·톱니바퀴 반비례 문제',fig:()=>owlPlane({inv:4}),steps:[{t:'① 곱이 일정한 양 찾기',hl:[],body:'가로×세로=넓이, 속력×시간=거리, 톱니수×회전수'},{t:'② y = a/x 식 세우기',hl:[],body:'곱 = a'},{t:'③ 나눗셈 계산',hl:[],body:'a ÷ 주어진 값'}],pitfall:'⚠️ "x가 늘어나면 y가 줄어듦"이어도 덧셈/뺄셈 관계(합 일정)는 반비례가 아니에요!'}
  },
  compoundList:[
    {id:'C4',nm:'복합 ② · 한 쌍으로 a 구하고 거꾸로 x 구하기',sub:'x × y = a로 a를 구한 뒤 y가 주어졌을 때 x 찾기'},
    {id:'C1',nm:'복합 ① · 압력-부피(톱니바퀴) 반비례 그래프 활용',sub:'한 점으로 a=xy 찾고 다른 조건의 값 구하기'}
  ],
  genCompound:{
    C4:seed=>{
      const r=(seed*2654435761+11)>>>0,a=pick_(r,[12,18,24,36]),x1=pick_(r>>>4,[2,3].filter(v=>a%v===0)),y1=a/x1,ys=[2,3,4,6].filter(v=>a%v===0&&v!==y1),y2=ys[(r>>>8)%ys.length],x2=a/y2;
      return{id:'C4',combo:[1,2],comboWhy:'① 한 쌍의 곱으로 a를 구하고(유형 1) → ② 식에 y를 넣어 x 구하기(유형 2)',ptype:'inv:c4',
        title:`y가 x에 반비례하고 x = <b>${x1}</b>일 때 y = <b>${y1}</b>이에요. y = <b>${y2}</b>일 때 x의 값을 구하시오.`,
        fig:{svg:()=>owlPlane({inv:4,pts:[{x:2,y:2,lab:`(${x1}, ${y1})`}]})},finalQ:`y = ${y2}일 때 x의 값은?`,
        steps:[
          {tag:'1단계 · a = x × y',q:`a = ${x1} × ${y1} = ?`,type:'num',ans:a,hint:`${x1} × ${y1}`},
          {tag:'2단계 · x 구하기',q:`x × ${y2} = ${a} → x = ?`,type:'num',ans:x2,hint:`${a} ÷ ${y2}`,ok:`x = ${x2}`}
        ]};
    },
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,a=pick_(r,[60,80,120]),p1=pick_(r,[2,4,5]),v1=a/p1,p2=pick_(r,[3,6,10].filter(x=>a%x===0&&x!==p1)),v2=a/p2;
      return{id:'C1',combo:[1,2],comboWhy:'① 그래프 위의 점으로 일정한 곱 a=xy 구하고(유형 1) → ② 새 조건 대입해 값 계산(유형 2)',ptype:'inv:c1',
        title:`기체 압력 x 기압과 부피 y cm³가 반비례하고, x = ${p1}일 때 y = ${v1}이에요. 압력이 <b>${p2} 기압</b>일 때 부피는 몇 cm³인가요?`,
        fig:{svg:()=>owlPlane({inv:4,pts:[{x:2,y:2,lab:`(${p1},${v1})`}]})},finalQ:`${p2} 기압일 때 부피는 몇 cm³인가요?`,
        steps:[
          {tag:'1단계 · a = x × y 구하기',q:`압력 × 부피 = ${p1} × ${v1} = ?`,type:'num',ans:a,hint:`${p1} × ${v1}`},
          {tag:'2단계 · 새 부피 구하기',q:`y = ${a} ÷ ${p2} = ?`,type:'num',ans:v2,suffix:'cm³',hint:`${a} ÷ ${p2}`,ok:`부피는 ${v2} cm³예요.`}
        ]};
    }
  },
  t3PracticeCids:['C1','C4']
});

/* ── 6차시 invg · 반비례의 그래프 (개념형, T35) ── */
HG_TRACKS.register('invg',{
  kind:'concept',
  owlScenes:[
    {lv:1,cap:'장면 ① 표의 점을 찍으면 매끄러운 곡선',say:'y = 4/x의 표 (1, 4), (2, 2), (4, 1)을 찍어 이으면 직선이 아니라 <span class="kw">매끄러운 곡선</span>이 돼요.',svg:()=>owlPlane({inv:4,pts:[{x:1,y:4,lab:'(1,4)'},{x:2,y:2,lab:'(2,2)'}]})},
    {lv:1,cap:'장면 ② 원점 안 지나는 한 쌍의 쌍곡선!',say:'x가 0이 될 수 없기 때문에 반비례 그래프는 <span class="warn">원점 (0, 0)과 x축·y축을 절대 만나지 않고</span> 매끄러운 곡선 한 쌍이 그려져요.',svg:()=>owlPlane({inv:-4}),
      ask:{q:'반비례 관계 <b>y = 6/x</b>의 그래프에 대해 바른 것은?',choices:['원점을 지나지 않아요','원점을 지나는 직선이에요','x축과 만나요','제2·4사분면에 있어요'],ans:'원점을 지나지 않아요',hint:'x에 0을 넣을 수 있는지 생각해 봐요.',ok:'정확해요! x = 0을 넣을 수 없어서 원점과 두 축을 만나지 않는 곡선이에요.'}},
    {lv:1,cap:'장면 ③ 지나는 점으로 a 구하기',say:'그래프가 점 (2, 6)을 지나면 <span class="kw">y = a/x에 x, y를 넣어요</span>. 6 = a ÷ 2, 그래서 <b>a = 12</b>예요.',svg:()=>owlPlane({inv:4,pts:[{x:1,y:4,lab:'(2, 6)'}]})}
  ],
  owlSummary:['그래프: 원점 안 지나고 축에 닿지 않는 한 쌍의 매끄러운 곡선 (a>0 제1·3, a<0 제2·4)','지나는 점 (p, q)를 y = a/x에 넣기 → q = a ÷ p → a 구하기'],
  schemaQs:[
    {id:'iq2',q:'반비례 그래프 y = 6/x는 원점 (0, 0)을 지나갈까요?',fig:()=>owlPlane({inv:4}),choices:['아니요, 원점을 지나지 않아요','네, 원점을 지나요'],ans:'아니요, 원점을 지나지 않아요',hint:'분모 x에 0을 넣을 수 없기 때문에 x축, y축과 만나지 않아요.',why:'아니에요! 정비례만 원점을 지나고 반비례는 지나지 않아요.'},
    {id:'iq3',q:'반비례 그래프 <b>y = −8/x</b>는 몇 사분면에 그려질까요?',fig:()=>owlPlane({inv:-4}),choices:['제2사분면, 제4사분면','제1사분면, 제3사분면'],ans:'제2사분면, 제4사분면',hint:'a = −8 < 0이에요. 둘을 곱해 음수가 되려면 부호가 반대여야 해요.',why:'맞아요! 곱이 음수인 곳은 제2(−,+)와 제4(+,−)사분면이에요.'},
    {id:'iq6',q:'반비례 그래프 <b>y = 4/x</b>는 몇 사분면에 그려질까요?',fig:()=>owlPlane({inv:4}),choices:['제1사분면, 제3사분면','제2사분면, 제4사분면'],ans:'제1사분면, 제3사분면',hint:'a = 4 > 0이에요.',why:'맞아요! a가 양수이면 제1·3사분면에 곡선이 그려져요.'}
  ],
  firstGuide:[
    {id:'ifg3',tyNo:2,title:'유형 2 · 지나는 점으로 a 구하기',problem:'y = a/x 그래프가 점 <b>(−3, 5)</b>를 지날 때 a의 값을 구하시오.',fig:()=>owlPlane({inv:-4,pts:[{x:-2,y:2,lab:'(-3,5)'}]}),
      wantChips:['상수 a의 값','원의 반지름','y절편'],wantAns:'상수 a의 값',wantHl:[],
      givenChips:[{k:'a',t:'x = −3, y = 5 넣기',ok:true},{k:'b',t:'5 = a ÷ (−3)',ok:true},{k:'t',t:'a = y ÷ x',ok:false}],
      teacherEq:'y = a/x에 넣어요 → 5 = a ÷ (−3) → a = 5 × (−3)',pairQ:'5 = a ÷ (−3) 에서 a는 어떻게 구하나요?',pairChoices:['5 × (−3)으로 곱한다','5 ÷ (−3)으로 나눈다'],pairAns:'5 × (−3)으로 곱한다',
      calcPrompt:'(−3) × 5 = ?',calcAns:-15,calcTopic:'signmul',calcExplain:'a = (−3) × 5 = <b>−15</b>예요.'}
  ],
  stratRows:[
    ['그래프 사분면','a의 부호 확인','a>0 제1·3사분면 / a<0 제2·4사분면'],
    ['지나는 점 (p, q)','a = p × q','xy = a에 다른 점의 좌표 대입해 찾기']
  ],
  worked:{
    1:{no:1,nm:'반비례 그래프 성질',prob:'y = a/x 그래프 사분면과 축 관계',fig:()=>owlPlane({inv:-4}),steps:[{t:'① 쌍곡선 모양',hl:[],body:'원점 안 지나고 축에 점점 가까워지지만 만나지 않음'},{t:'② 사분면 확인',hl:[],body:'a>0 (1·3사분면) / a<0 (2·4사분면)'},{t:'③ |a| 크기 비교',hl:[],body:'|a|가 클수록 원점에서 멀어져요!'}],pitfall:'⚠️ 정비례(|a| 클수록 y축 가까움)와 반대로, 반비례는 |a|가 클수록 원점에서 멀어져요!'},
    2:{no:2,nm:'지나는 점으로 a 구하기',prob:'점 (p, q)로 a 구하기',fig:()=>owlPlane({inv:-4,pts:[{x:2,y:-2,lab:'(p,q)'}]}),steps:[{t:'① a = p × q',hl:[],body:'반비례는 두 좌표의 곱이 바로 a!'},{t:'② 다른 점 확인',hl:[],body:'xy = a가 되는 점인지 곱해서 체크'},{t:'③ 부호 확인',hl:[],body:'(−)×(+) = (−), (−)×(−) = (+)'}],pitfall:'⚠️ 음수 좌표 두 개를 곱하면 양수(+)가 돼요!'}
  },
  compoundList:[
    {id:'C2',nm:'복합 ② · 정비례 y=mx와 반비례 y=a/x 교점 연결',sub:'정비례 직선 위 점으로 교점 찾고 반비례 a 구하기'},
    {id:'C3',nm:'복합 ③ · y=a/x 위 직사각형 넓이=|a| 활용',sub:'축에 내린 수선 직사각형 넓이로 a 거꾸로 구하기'}
  ],
  genCompound:{
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,m=pick_(r,[2,3,-2,-3]),px=pick_(r,[2,3,-2]),py=m*px,a=px*py;
      return{id:'C2',combo:[2,1],comboWhy:'① 정비례 직선 위의 교점 y좌표를 찾고(유형 1) → ② 교점을 반비례 y=a/x에 대입해 a 계산(유형 2)',ptype:'invg:c2',
        title:`정비례 그래프 <b>y = ${neg(m)}x</b>와 반비례 그래프 <b>y = a/x</b>가 x좌표가 <b>${neg(px)}</b>인 점 P에서 만날 때, 상수 <b>a</b>의 값을 구하시오.`,
        fig:{svg:()=>owlPlane({a:m>0?1.5:-1.5,inv:a>0?4:-4,pts:[{x:px,y:py>4?3:py<-4?-3:py,lab:'교점 P'}]})},finalQ:'상수 a의 값은?',
        steps:[
          {tag:'1단계 · 교점 P의 y좌표 찾기',q:`점 P는 y = ${neg(m)}x 위의 점이에요. x = ${neg(px)}일 때 y = ?`,type:'sn',ans:py,ansText:neg(py),hint:`${neg(m)} × (${neg(px)})`},
          {tag:'2단계 · 반비례 a = x × y 구하기',q:`점 P(${neg(px)}, ${neg(py)})가 y = a/x 위에도 있으므로 a = (${neg(px)}) × (${neg(py)}) = ?`,type:'sn',ans:a,ansText:neg(a),hint:`두 좌표의 곱`,ok:`a = ${neg(a)}`}
        ]};
    },
    C3:seed=>{
      const r=(seed*1103515245+12345)>>>0,a=pick_(r,[12,18,24,36]),half=a/2,mult=[1,2,4][r%3];
      return{id:'C3',combo:[1,2],comboWhy:'① 그래프 위 점이 만드는 축 직사각형 성질 파악(유형 1) → ② 넓이=|a|로 a 구하기(유형 2)',ptype:'invg:c3',
        title:`제1사분면의 반비례 그래프 <b>y = a/x (a > 0)</b> 위의 한 점 P에서 x축, y축에 각각 수선을 그어 만든 직사각형의 넓이가 <b>${a}</b>일 때, <b>a</b>의 값(p × q = 넓이)을 구하시오.`,
        fig:{svg:()=>owlPlane({inv:4,pts:[{x:2,y:2,lab:'P(p,q)'}]})},finalQ:'양수 a의 값은?',
        steps:[
          {tag:'1단계 · 직사각형의 넓이 식',q:'점 P(p, q)에서 가로가 p, 세로가 q이면 직사각형 넓이는 p × q예요. 반비례 y=a/x에서 p × q는 무엇과 같나요?',type:'choice',choices:['상수 a','p + q','a ÷ 2'],ans:'상수 a',hint:'양변에 x를 곱하면 xy = a로 항상 일정해요!'},
          {tag:'2단계 · a 값 구하기',q:`따라서 양수 a의 값은?`,type:'num',ans:a,hint:`직사각형 넓이가 곧 a예요.`,ok:`어느 점을 잡아도 넓이 = a = ${a}예요!`}
        ]};
    }
  },
  t3PracticeCids:['C2','C3']
});
/* [T39] 정비례·반비례 4차시: 빠른 구별 + 🌱 마무리(구별 문제 + 교과서 크기 숫자 1문제, 대입으로) */
(()=>{
  const S=HG_TRACKS.specs,big=(id,q,fig,choices,ans,hint,why)=>({id,kind:id,q,fig,choices,ans,hint,why});
  S.prop.schemaRapid=propRapid;
  S.prop.t1Check=t1FromSchema(S.prop.schemaQs).concat([big('t1prbig','y가 x에 정비례하고 x = <b>12</b>일 때 y = <b>36</b>이에요. y = ax의 a는?',()=>rTabSVG([12],[36]),['3','24','48','1/3'],'3','y = ax에 x, y를 넣어요 → 36 = a × 12','y = ax에 넣으면 36 = a × 12, 그래서 a = 3이에요. 숫자가 커도 넣는 방법은 똑같아요.')]);
  S.propg.schemaRapid=propgRapid;
  S.propg.t1Check=t1FromSchema(S.propg.schemaQs).concat([big('t1pgbig','y = ax의 그래프가 점 <b>(10, −30)</b>을 지나요. a는?',()=>rPlaneSVG({line:[-3,0]}),['−3','3','−20','−300'],'−3','y = ax에 x = 10, y = −30을 넣어요 → −30 = a × 10','−30 = a × 10, 그래서 a = −3이에요. 오른쪽 아래로 내려가는 그래프와도 맞아요.')]);
  S.inv.schemaRapid=invRapid;
  S.inv.t1Check=t1FromSchema(S.inv.schemaQs).concat([big('t1ivbig','y가 x에 반비례하고 x = <b>12</b>일 때 y = <b>3</b>이에요. y = a/x의 a는?',()=>rTabSVG([12],[3]),['36','4','15','1/4'],'36','y = a/x에 넣어요 → 3 = a ÷ 12','y = a/x에 넣으면 3 = a ÷ 12, 그래서 a = 3 × 12 = 36이에요.')]);
  S.invg.schemaRapid=invgRapid;
  S.invg.t1Check=t1FromSchema(S.invg.schemaQs).concat([big('t1igbig','y = a/x의 그래프가 점 <b>(10, 6)</b>을 지나요. a는?',()=>rPlaneSVG({inv:4}),['60','16','4','0.6'],'60','y = a/x에 x = 10, y = 6을 넣어요 → 6 = a ÷ 10','6 = a ÷ 10, 그래서 a = 6 × 10 = 60이에요.')]);
})();
function pick_(r,arr){return arr[r%arr.length]}
})();