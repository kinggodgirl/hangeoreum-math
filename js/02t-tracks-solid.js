/* [T17] 교과서 한 걸음 — Ⅶ. 입체도형의 성질 전 8차시 3×3 트랙 · 부엉 쌤 · 두걸음 복합 */
(()=>{
'use strict';

const INK='#1d2640',BL='#2a4d9e',BLs='#dbe5f7',HL='#e08a1e',HLs='#fde3c3',RD='#b83a3a',OK='#2b7a4b';
const MF="'Times New Roman',Times,serif",SF="'IBM Plex Sans KR',sans-serif";
const svgB=(w,h,s,lab)=>`<svg viewBox="0 0 ${w} ${h}" class="ct-svg" role="img" aria-label="${lab||'입체도형'}" style="font-family:${MF}">${s}</svg>`;
const tx=(x,y,t,c=INK,sz=14,sans=false)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${sz}" fill="${c}" ${sans?`font-family="${SF}" font-weight="700"`:''}>${t}</text>`;

/* ── 공용 입체 SVG 도우미 ── */
const figBoxCube=()=>svgB(280,175,
  `<rect x="50" y="55" width="70" height="65" fill="${BLs}" stroke="${INK}" stroke-width="2.2"/>`+
  `<polygon points="50,55 75,34 145,34 120,55" fill="#dce7fb" stroke="${INK}" stroke-width="2"/>`+
  `<polygon points="120,55 145,34 145,99 120,120" fill="${HLs}" stroke="${INK}" stroke-width="2"/>`+
  tx(96,144,'다면체 (다각형 면만)',BL,13,true)+
  `<path d="M 185 45 L 185 112 A 28 9 0 0 0 241 112 L 241 45 Z" fill="#eef3fb" stroke="${INK}" stroke-width="2.2"/>`+
  `<ellipse cx="213" cy="45" rx="28" ry="9" fill="#f8fbff" stroke="${INK}" stroke-width="2"/>`+
  tx(213,144,'회전체 (굽은 면 ✕)',RD,13,true));

const figFrust=()=>svgB(270,175,
  `<polygon points="105,36 165,36 196,126 74,126" fill="${HLs}" stroke="${INK}" stroke-width="2.3"/>`+
  `<line x1="74" y1="126" x2="105" y2="36" stroke="${INK}" stroke-width="2"/>`+
  `<line x1="165" y1="36" x2="196" y2="126" stroke="${INK}" stroke-width="2"/>`+
  `<rect x="82" y="138" width="106" height="22" rx="6" fill="#eef3fb" stroke="#bfd3f7"/>`+
  tx(135,153,'옆면=사다리꼴 · 두 밑면 크기 다름',BL,12,true));

const figRegFan=(n,k,ok)=>svgB(240,170,
  (typeof fanSVG==='function'?fanSVG(n,k,140).replace(/<svg[^>]*>|<\/svg>/g,''):`<circle cx="120" cy="80" r="45" fill="${ok?BLs:'#fbe9e9'}" stroke="${INK}" stroke-width="2"/>`)+
  `<g transform="translate(50,12)"><text x="70" y="148" text-anchor="middle" font-size="13" font-family="${SF}" font-weight="700" fill="${ok?OK:RD}">${n===3?'정삼각형':n===4?'정사각형':'정육각형'} ${k}개 합 = ${(n-2)*180/n*k}° ${ok?'< 360° ○':'(입체 ✕)'}</text></g>`);

const figOctNet=()=>svgB(280,175,
  [0,1,2,3].map(i=>`<polygon points="${48+i*44},70 ${70+i*44},32 ${92+i*44},70" fill="${i===0?HLs:BLs}" stroke="${INK}" stroke-width="2"/>`+
    `<polygon points="${48+i*44},70 ${92+i*44},70 ${70+i*44},108" fill="#eef3fb" stroke="${INK}" stroke-width="2"/>`).join('')+
  [1,2,3,4,5,6,7,8].map((n,i)=>tx(70+Math.floor(i/2)*44,i%2?94:56,String(n),INK,13,true)).join('')+
  tx(140,145,'정삼각형 8개 → 정팔면체 전개도',BL,13,true));

const figRotCross=(kind,r=4,h=6)=>svgB(260,175,
  kind==='cyl'?`<rect x="85" y="34" width="90" height="92" fill="${HLs}" stroke="${INK}" stroke-width="2.2"/><line x1="130" y1="20" x2="130" y2="140" stroke="${RD}" stroke-width="1.8" stroke-dasharray="5 4"/>`+tx(130,158,`지름 ${2*r} × 높이 ${h}`,BL,13,true)
  :kind==='cone'?`<polygon points="130,30 78,128 182,128" fill="${HLs}" stroke="${INK}" stroke-width="2.2"/><line x1="130" y1="20" x2="130" y2="140" stroke="${RD}" stroke-width="1.8" stroke-dasharray="5 4"/>`+tx(130,158,`밑변(지름) ${2*r} × 높이 ${h} ÷ 2`,BL,13,true)
  :`<ellipse cx="130" cy="82" rx="56" ry="20" fill="${HLs}" stroke="${HL}" stroke-width="2.4"/>`+tx(130,158,'회전축에 수직 단면 = 항상 원',BL,13,true));

const figSectorPrism=(r,th,h)=>svgB(260,175,
  `<path d="M 100 120 L 175 120 A 75 75 0 0 0 138 55 Z" fill="${BLs}" stroke="${INK}" stroke-width="2.2"/>`+
  `<path d="M 100 120 L 100 145 L 175 145 L 175 120" fill="${HLs}" stroke="${INK}" stroke-width="2"/>`+
  tx(135,166,`반지름 ${r} cm · 중심각 ${th}° · 높이 ${h} cm`,BL,12,true));

const figConeNet=(r,l)=>svgB(270,175,
  `<path d="M 135 28 L 80 105 A 78 78 0 0 0 190 105 Z" fill="${HLs}" stroke="${INK}" stroke-width="2.2"/>`+
  `<circle cx="135" cy="134" r="22" fill="${BLs}" stroke="${INK}" stroke-width="2"/>`+
  tx(175,68,`모선 ${l}`,HL,13,true)+tx(135,138,`r=${r}`,BL,12,true));

const figFrustComp=(R,rr,Hb,Hc)=>svgB(260,175,
  `<polygon points="130,24 98,74 162,74" fill="none" stroke="${RD}" stroke-width="1.5" stroke-dasharray="4 4"/>`+
  `<polygon points="98,74 162,74 190,132 70,132" fill="${BLs}" stroke="${INK}" stroke-width="2.2"/>`+
  tx(130,156,`큰 뿔(r=${R}, h=${Hb}) − 작은 뿔(r=${rr}, h=${Hc})`,BL,12,true));

if(typeof HG_TRACKS!=='object')return;

/* ── 1차시 poly ── */
HG_TRACKS.register('poly',{
  kind:'concept',
  owlScenes:[
    {cap:'장면 ① 다각형 면으로만 = 다면체',say:'상자처럼 <span class="kw">다각형인 면으로만</span> 둘러싸이면 <b>다면체</b>! 캔이나 공처럼 굽은 면이 하나라도 있으면 다면체가 아니에요.',svg:figBoxCube},
    {cap:'장면 ② 각뿔대 = 밑면에 평행하게 싹둑',say:'각뿔을 <span class="kw">밑면에 평행한 평면</span>으로 자를 때 뾰족하지 않은 쪽이 <b>각뿔대</b>! 옆면은 모두 <span class="num">사다리꼴</span>이에요.',svg:figFrust},
    {cap:'장면 ③ 층 건물로 세기 (1층·2층·층사이)',say:'n각기둥과 n각뿔대는 꼭짓점 <span class="num">2n</span>, 모서리 <span class="num">3n</span>, 면 <span class="num">n+2</span>개! 각뿔은 꼭대기 점 1개라 꼭짓점 <span class="num">n+1</span>, 모서리 <span class="num">2n</span>, 면 <span class="num">n+1</span>개예요.',exp:'happy',svg:figBoxCube,
      ask:{q:'사각뿔대의 옆면 모양은 무엇일까요?',choices:['사다리꼴','직사각형','삼각형'],ans:'사다리꼴',hint:'위아래 변이 평행하지만 길이가 달라요.',ok:'맞아요! 각뿔대의 옆면은 모두 사다리꼴이에요.'}}
  ],
  owlSummary:['다각형 면으로만 둘러싸인 입체 = 다면체 (원기둥·원뿔·구 ✕)','각뿔대: 두 밑면 평행·합동 아님, 옆면=사다리꼴','n각기둥·n각뿔대: V=2n, E=3n, F=n+2 / n각뿔: V=n+1, E=2n, F=n+1'],
  schemaQs:[
    {id:'pq1',q:'원기둥과 직육면체 중 <b>다면체</b>는 어느 것인가요?',fig:figBoxCube,choices:['직육면체','원기둥','둘 다 다면체'],ans:'직육면체',hint:'굽은 면(곡면)이 없는 입체를 골라요.',why:'맞아요! 직육면체는 모든 면이 직사각형(다각형)이므로 다면체예요.'},
    {id:'pq2',q:'<b>각뿔대</b>의 옆면 모양은 모두 무엇인가요?',fig:figFrust,choices:['사다리꼴','삼각형','직사각형'],ans:'사다리꼴',hint:'위 밑면과 아래 밑면의 크기가 달라요.',why:'맞아요! 각뿔대는 위아래 크기가 다르므로 옆면이 사다리꼴이에요.'},
    {id:'pq3',q:'"각뿔대의 두 밑면은 서로 합동이다." 맞나요?',fig:figFrust,choices:['아니요','맞아요'],ans:'아니요',hint:'평행하지만 크기가 달라요!',why:'아니에요! 각기둥만 두 밑면이 합동이고, 각뿔대는 크기가 달라요.'}
  ],
  firstGuide:[
    {id:'pfg1',tyNo:2,title:'유형 2 · 몇 면체인지 구하기',problem:'<b>육각뿔</b>은 몇 면체인지 구하시오.',fig:figBoxCube,
      wantChips:['면의 전체 개수 (○면체)','모서리 개수','밑면 둘레'],wantAns:'면의 전체 개수 (○면체)',wantHl:[],
      givenChips:[{k:'a',t:'밑면 육각형 (1개)',ok:true},{k:'b',t:'옆면 삼각형 6개',ok:true},{k:'t',t:'꼭짓점 12개',ok:false}],
      teacherEq:'(밑면 1개) + (옆면 n개) = 1 + 6',pairQ:'각뿔의 밑면은 몇 개인가요?',pairChoices:['1개 (아래만)','2개 (위아래)'],pairAns:'1개 (아래만)',
      calcPrompt:'1 + 6 = ? (면체)',calcAns:7,calcTopic:'add',calcExplain:'1 + 6 = 7 → <b>칠면체</b>예요.'},
    {id:'pfg2',tyNo:3,title:'유형 3 · 모서리·꼭짓점 세기',problem:'<b>오각기둥</b>의 모서리 개수를 구하시오.',fig:figBoxCube,
      wantChips:['오각기둥 모서리 개수','오각뿔 면 개수','겉넓이'],wantAns:'오각기둥 모서리 개수',wantHl:[],
      givenChips:[{k:'a',t:'밑면 오각형 (5변)',ok:true},{k:'b',t:'1층+2층+층사이 = 3층',ok:true},{k:'t',t:'각뿔대 사다리꼴',ok:false}],
      teacherEq:'5(1층) + 5(2층) + 5(층사이) = 5 × 3',pairQ:'왜 5에 <b>3</b>을 곱했나요?',pairChoices:['1층 둘레, 2층 둘레, 기둥 세로 3곳에 5개씩 있어서','면이 3개라서'],pairAns:'1층 둘레, 2층 둘레, 기둥 세로 3곳에 5개씩 있어서',
      calcPrompt:'5 × 3 = ? (개)',calcAns:15,calcTopic:'facts',calcExplain:'5 × 3 = <b>15개</b>예요.'},
    {id:'pfg3',tyNo:5,title:'유형 5 · 개수로 입체도형 거꾸로 찾기',problem:'모서리가 <b>18개</b>인 <b>각뿔대</b>는 몇 각뿔대인가요?',fig:figFrust,
      wantChips:['밑면 변의 개수 n','면의 개수','옆넓이'],wantAns:'밑면 변의 개수 n',wantHl:[],
      givenChips:[{k:'a',t:'각뿔대 모서리 = 3n',ok:true},{k:'b',t:'모서리 = 18개',ok:true},{k:'t',t:'각뿔 모서리 = 2n',ok:false}],
      teacherEq:'3 × n = 18 → n = 18 ÷ 3',pairQ:'방정식 <b>3n = 18</b>에서 n을 구하려면 어떻게 하나요?',pairChoices:['18을 3으로 나눈다','18에서 3을 뺀다'],pairAns:'18을 3으로 나눈다',
      calcPrompt:'18 ÷ 3 = ? (각형)',calcAns:6,calcTopic:'eq',calcExplain:'n = 6 → <b>육각뿔대</b>예요.'}
  ],
  stratRows:[
    ['다면체 vs 아님','곡면 유무','모든 면이 다각형 ○ / 원기둥·원뿔·구 ✕'],
    ['n각기둥·각뿔·각뿔대 개수','층으로 세기','기둥·뿔대(2n,3n,n+2) / 각뿔(n+1,2n,n+1)'],
    ['면·모서리 개수로 도형 찾기','n 방정식 세우기','식 = 주어진 수 → n 구하기']
  ],
  worked:{
    1:{no:1,nm:'다면체 판단하기',prob:'다음 도형이 다면체인지 고르시오.',fig:figBoxCube,steps:[{t:'① 굽은 면 찾기',hl:[],body:'곡면(둥근 면)이 있으면 다면체가 아니에요.'},{t:'② 모든 면 확인',hl:[],body:'모든 면이 다각형이면 다면체예요.'},{t:'③ 이름 확인',hl:[],body:'정다면체·각기둥·각뿔·각뿔대 모두 다면체예요.'}],pitfall:'⚠️ 원뿔·원기둥·구는 곡면이 있어 다면체가 아니에요!'},
    2:{no:2,nm:'몇 면체인지 구하기',prob:'삼각기둥과 오각뿔은 각각 몇 면체인지 구하시오.',fig:figBoxCube,steps:[{t:'① 밑면 개수',hl:[],body:'기둥·뿔대는 2개, 각뿔은 1개'},{t:'② 옆면 개수',hl:[],body:'밑면 변 개수 n개'},{t:'③ 더해서 ○면체',hl:[],body:'오각뿔: 1+5 = 6면체(육면체)'}],pitfall:'⚠️ 각뿔(n+1)을 기둥(n+2)처럼 2를 더하지 마세요!'},
    3:{no:3,nm:'모서리·꼭짓점 세기',prob:'오각기둥의 모서리·꼭짓점 개수',fig:figBoxCube,steps:[{t:'① 밑면 변 n',hl:[],body:'n = 5'},{t:'② 모서리',hl:[],body:'5×3 = 15개'},{t:'③ 꼭짓점',hl:[],body:'5×2 = 10개'}],pitfall:'⚠️ 오각뿔의 꼭짓점은 5+1=6개(층마다 주의)!'},
    4:{no:4,nm:'각뿔대 표 완성하기',prob:'사각뿔대의 꼭짓점·모서리·면·옆면',fig:figFrust,steps:[{t:'① 옆면 모양',hl:[],body:'사다리꼴'},{t:'② 두 밑면 관계',hl:[],body:'서로 평행 (합동 ✕)'},{t:'③ 개수',hl:[],body:'n=4 → 꼭 8, 모 12, 면 6'}],pitfall:'⚠️ 각뿔대의 두 밑면은 합동이 아니에요!'},
    5:{no:5,nm:'개수를 보고 입체도형 찾기',prob:'면이 8개인 각뿔대 찾기',fig:figFrust,steps:[{t:'① n으로 식 쓰기',hl:[],body:'각뿔대 면 = n + 2'},{t:'② 방정식 풀기',hl:[],body:'n + 2 = 8 → n = 6'},{t:'③ 이름 짓기',hl:[],body:'육각뿔대'}],pitfall:'⚠️ 각뿔대 면 공식 n+2와 각뿔 n+1을 구별해요!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 면 개수로 역산해 차(b−a) 구하기',sub:'면=8인 각뿔대의 모서리 a, 꼭짓점 b 구해 b−a 계산'},
    {id:'C2',nm:'복합 ② · 직육면체 모서리 잘라 낸 상패 개수',sub:'한 꼭짓점을 자르면 면+1, 모서리+3, 꼭짓점+2 변화 세기'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,n=4+(r%5),F=n+2,a=3*n,b=2*n,ans=b-a;
      return{id:'C1',combo:[5,4],comboWhy:'① 면 개수로 n각뿔대를 역산하고(유형 5) → ② 모서리·꼭짓점 식에 대입(유형 4)',ptype:'poly:c1',
        title:`면의 개수가 <b>${F}개</b>인 각뿔대의 모서리 개수를 a, 꼭짓점 개수를 b라고 할 때, <b>b − a</b>의 값을 구하시오.`,
        fig:{svg:figFrust},finalQ:'b − a의 값은?',
        steps:[
          {tag:'1단계 · 밑면 n 구하기',q:`각뿔대의 면은 (n+2)개예요. n + 2 = ${F} → n은?`,type:'num',ans:n,suffix:'각형',hint:`${F} − 2`},
          {tag:'2단계 · a, b 구하고 빼기',q:`a=3×${n}=${a}, b=2×${n}=${b}예요. b − a = ${b} − ${a} = ?`,type:'sn',ans:ans,ansText:'−'+(-ans),hint:`${b} − ${a}`,ok:`${b} − ${a} = −${-ans}`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,ask=['면','모서리','꼭짓점'][r%3],ans={면:7,모서리:15,꼭짓점:10}[ask];
      return{id:'C2',combo:[2,3],comboWhy:'① 원래 직육면체 면+1을 세고(유형 2) → ② 잘려 생긴 모서리·꼭짓점 층 세기(유형 3)',ptype:'poly:c2',
        title:`직육면체의 한 꼭짓점을 평면으로 잘라 낸 상패 모양 입체의 <b>${ask}</b>의 개수를 구하시오.`,
        fig:{svg:figBoxCube},finalQ:`이 입체의 ${ask}의 개수는?`,
        steps:[
          {tag:'1단계 · 자른 단면 확인',q:'한 꼭짓점을 평면으로 자르면 단면(삼각형)이 새로 몇 개 생기나요?',type:'num',ans:1,suffix:'개',hint:'자른 자리에 삼각형 면 1개가 새로 생겨요.'},
          {tag:'2단계 · 전체 개수 세기',q:`직육면체(면6, 모12, 꼭8)에서 한 꼭짓점이 잘려 삼각형 모서리 3개·꼭짓점 3개(기존 1개→3개, 즉 +2)가 됐어요. ${ask}은 모두 몇 개인가요?`,type:'num',ans,suffix:'개',hint:'면 6+1=7, 모서리 12+3=15, 꼭짓점 8−1+3=10',ok:`${ask}은 ${ans}개예요!`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── 2차시 regular ── */
HG_TRACKS.register('regular',{
  kind:'concept',
  owlScenes:[
    {cap:'장면 ① 정다면체의 두 조건!',say:'모든 면이 <span class="kw">합동인 정다각형</span>이고, 각 꼭짓점에 <span class="kw">모인 면의 개수가 모두 같아야</span> 정다면체예요!',svg:()=>figRegFan(3,3,true)},
    {cap:'장면 ② 왜 5가지뿐일까? (각의 합 < 360°)',say:'정육각형 3개를 모으면 <span class="warn">120° × 3 = 360°</span>라 평평하게 깔려요! 틈이 남아 접어 올리려면 각의 합이 <span class="num">360°보다 작아야</span> 해요.',svg:()=>figRegFan(6,3,false),
      ask:{q:'모든 면이 합동인 정삼각형이지만, 꼭짓점마다 모인 면이 3개·4개로 다른 입체(삼각쌍뿔)는 정다면체일까요?',choices:['아니요 (꼭짓점마다 면의 수가 달라요)','네 (정다면체가 맞아요)'],ans:'아니요 (꼭짓점마다 면의 수가 달라요)',hint:'두 번째 조건 "각 꼭짓점에 모인 면의 개수가 같다"를 확인해요!',ok:'맞아요! 두 조건 중 하나라도 어기면 정다면체가 아니에요.'}},
    {cap:'장면 ③ 겹쳐 세기 공식 (÷ 2, ÷ 모인 면)',say:'모서리는 두 면이 만나니까 <span class="num">면 × 변 ÷ 2</span>! 꼭짓점은 모인 면 개수만큼 겹치니까 <span class="num">면 × 변 ÷ (모인 면)</span>이에요.',exp:'happy',svg:figOctNet}
  ],
  owlSummary:['두 조건: ① 모든 면 합동 정다각형 ② 각 꼭짓점에 모인 면의 수 같음','한 꼭짓점 각의 합 < 360° → 5종류(정4, 정6, 정8, 정12, 정20면체)뿐!','모서리 = (면×변)÷2 / 꼭짓점 = (면×변)÷(모인 면 수)'],
  schemaQs:[
    {id:'rq1',q:'직육면체는 모든 꼭짓점에 면이 3개씩 모이지만 정다면체가 아니에요. 왜일까요?',fig:figBoxCube,choices:['모든 면이 정다각형이 아니라서','각의 합이 360°보다 작아서'],ans:'모든 면이 정다각형이 아니라서',hint:'직사각형은 네 변의 길이가 같지 않아요.',why:'아니에요! 조건 ①(모든 면이 합동인 정다각형)을 어겼어요.'},
    {id:'rq2',q:'정육각형 3개를 한 꼭짓점에 모으면 각의 합이 360°예요. 정다면체를 만들 수 있을까요?',fig:()=>figRegFan(6,3,false),choices:['만들 수 없어요','만들 수 있어요'],ans:'만들 수 없어요',hint:'360°면 바닥에 평평하게 깔려 입체로 접어 올릴 수 없어요.',why:'아니에요! 360°보다 작아야 틈을 접어 입체가 돼요.'},
    {id:'rq3',q:'정삼각형 4개를 한 꼭짓점에 모으면 각의 합이 240°(< 360°)예요. 어떤 정다면체가 되나요?',fig:()=>figRegFan(3,4,true),choices:['정팔면체','정사면체','정육면체'],ans:'정팔면체',hint:'정삼각형 3개→정사면체, 4개→정팔면체, 5개→정이십면체!',why:'맞아요! 한 꼭짓점에 정삼각형 4개가 모이면 정팔면체예요.'}
  ],
  firstGuide:[
    {id:'rfg1',tyNo:2,title:'유형 2 · 조건으로 정다면체 이름 찾기',problem:'모든 면이 합동인 <b>정오각형</b>이고, 한 꼭짓점에 모인 면이 <b>3개</b>인 정다면체를 찾으시오.',fig:()=>figRegFan(5,3,true),
      wantChips:['정다면체 이름','모서리 길이','겉넓이'],wantAns:'정다면체 이름',wantHl:[],
      givenChips:[{k:'a',t:'면=정오각형',ok:true},{k:'b',t:'한 꼭짓점에 면 3개',ok:true},{k:'t',t:'각뿔대',ok:false}],
      teacherEq:'정오각형 × 3 → 한 내각 108°×3 = 324° < 360° → 정십이면체',pairQ:'면의 모양이 정오각형인 정다면체는 몇 가지인가요?',pairChoices:['정십이면체 1가지뿐','3가지'],pairAns:'정십이면체 1가지뿐',
      calcPrompt:'정십이면체의 면은 몇 개?',calcAns:12,calcTopic:'facts',calcExplain:'이름이 <b>정십이면체</b>이므로 면은 12개예요.'},
    {id:'rfg2',tyNo:3,title:'유형 3 · 겹쳐 세기로 모서리 구하기',problem:'<b>정십이면체</b>(면 12, 정오각형)의 모서리 개수를 구하시오.',fig:figOctNet,
      wantChips:['모서리 개수','내각의 합','부피'],wantAns:'모서리 개수',wantHl:[],
      givenChips:[{k:'a',t:'면 12개 (오각형 변 5개)',ok:true},{k:'b',t:'모서리마다 면 2개 겹침 (÷2)',ok:true},{k:'t',t:'모인 면 5개',ok:false}],
      teacherEq:'(12 × 5) ÷ 2 = 60 ÷ 2',pairQ:'12×5를 왜 <b>2</b>로 나누나요?',pairChoices:['모서리 하나를 두 면이 공유해서 2번 세었으니까','면이 2종류라서'],pairAns:'모서리 하나를 두 면이 공유해서 2번 세었으니까',
      calcPrompt:'60 ÷ 2 = ? (개)',calcAns:30,calcTopic:'div',calcExplain:'60 ÷ 2 = <b>30개</b>예요.'},
    {id:'rfg3',tyNo:4,title:'유형 4 · 한 꼭짓점에 모을 수 있을까?',problem:'정삼각형 <b>5개</b>를 한 꼭짓점에 모을 때 각의 합을 구하고 입체가 되는지 확인하시오.',fig:()=>figRegFan(3,5,true),
      wantChips:['모인 각의 합 (°)','둘레 길이','면의 수'],wantAns:'모인 각의 합 (°)',wantHl:[],
      givenChips:[{k:'a',t:'정삼각형 한 내각 60°',ok:true},{k:'b',t:'5개 모임',ok:true},{k:'t',t:'정사각형 90°',ok:false}],
      teacherEq:'60° × 5 = 300° < 360° → 정이십면체',pairQ:'각의 합이 얼마보다 작아야 입체가 되나요?',pairChoices:['360°','180°'],pairAns:'360°',
      calcPrompt:'60 × 5 = ? (°)',calcAns:300,calcTopic:'mul',calcExplain:'300° < 360°이므로 <b>정이십면체</b>가 돼요.'}
  ],
  stratRows:[
    ['정다면체 판별','두 조건 모두 ○','① 합동 정다각형 ② 꼭짓점마다 모인 면 개수 같음'],
    ['모서리·꼭짓점 계산','겹쳐 세기','모서리 = (면×변)÷2 / 꼭짓점 = (면×변)÷(모인 면)'],
    ['왜 5가지만?','각의 합 < 360°','삼(3·4·5개), 사(3개), 오(3개) 딱 5개뿐']
  ],
  worked:{
    1:{no:1,nm:'정다면체인지 가려내기',prob:'다면체가 정다면체인지 두 조건으로 확인하기',fig:figBoxCube,steps:[{t:'① 면 모양 확인',hl:[],body:'모든 면이 똑같은(합동인) 정다각형인가?'},{t:'② 꼭짓점 확인',hl:[],body:'모든 꼭짓점에 모인 면의 개수가 같은가?'},{t:'③ 판정',hl:[],body:'둘 다 예일 때만 정다면체!'}],pitfall:'⚠️ 삼각쌍뿔처럼 ①은 맞지만 ②가 틀린 함정 조심!'},
    2:{no:2,nm:'이름 찾기',prob:'면의 모양과 모인 면의 개수로 정다면체 찾기',fig:()=>figRegFan(3,4,true),steps:[{t:'① 면의 모양',hl:[],body:'정삼각형(3가지) / 정사각형(정6) / 정오각형(정12)'},{t:'② 모인 면 개수',hl:[],body:'3→사면체, 4→팔면체, 5→이십면체'},{t:'③ 이름 결정',hl:[],body:'정삼각형 + 4개 = 정팔면체'}],pitfall:'⚠️ 정팔면체(면 8)와 정육면체(모인 면 3) 헷갈리지 않기!'},
    3:{no:3,nm:'개수 구하기',prob:'정십이면체·정이십면체 개수 구하기',fig:figOctNet,steps:[{t:'① 면×변 곱하기',hl:[],body:'정십이면체: 12 × 5 = 60'},{t:'② 모서리는 ÷ 2',hl:[],body:'60 ÷ 2 = 30개'},{t:'③ 꼭짓점은 ÷ 모인 면',hl:[],body:'60 ÷ 3 = 20개'}],pitfall:'⚠️ 정이십면체는 모인 면이 5개 → 60 ÷ 5 = 12개!'},
    4:{no:4,nm:'한 꼭짓점 모으기',prob:'정다각형 k개를 모아 입체 만들기',fig:()=>figRegFan(6,3,false),steps:[{t:'① 한 내각 확인',hl:[],body:'삼60° · 사90° · 오108° · 육120°'},{t:'② 곱해서 합 구하기',hl:[],body:'한 내각 × 개수'},{t:'③ 360°보다 작은지 비교',hl:[],body:'360° 이상이면 ✕'}],pitfall:'⚠️ 정삼각형 6개=360°, 정육각형 3개=360° 모두 불가!'},
    5:{no:5,nm:'성질 ○×',prob:'정다면체 설명 중 옳지 않은 것 고르기',fig:figOctNet,steps:[{t:'① 합동인 정다각형',hl:[],body:'"정다각형"만 쓰고 "합동" 빠뜨리면 ✕'},{t:'② 면·꼭짓점 표 대조',hl:[],body:'정팔면체 꼭짓점 6개, 정이십면체 면 정삼각형'},{t:'③ 옳지 않은 문장 고르기',hl:[],body:'하나씩 ○× 표시'}],pitfall:'⚠️ 정십이면체와 정이십면체는 모서리가 똑같이 30개예요 ○!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 조건으로 정다면체 찾고 모서리·꼭짓점 구하기',sub:'조건(면+모인 면)으로 도형 특정 후 공식 계산'},
    {id:'C2',nm:'복합 ② · 정팔면체 전개도 접어 평행한 면·꼭짓점 찾기',sub:'삼각형 8개 전개도 머릿속에 접어 마주 보는 면 찾기'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0;
      const list=[{face:'정삼각형',deg:4,nm:'정팔면체',F:8,n:3,E:12,V:6},{face:'정오각형',deg:3,nm:'정십이면체',F:12,n:5,E:30,V:20},{face:'정삼각형',deg:5,nm:'정이십면체',F:20,n:3,E:30,V:12}];
      const R=list[r%list.length];
      return{id:'C1',combo:[2,3],comboWhy:'① 조건으로 정다면체 이름을 찾고(유형 2) → ② 겹쳐 세기로 모서리 계산(유형 3)',ptype:'regular:c1',
        title:`모든 면이 합동인 <b>${R.face}</b>이고 한 꼭짓점에 모인 면이 <b>${R.deg}개</b>인 정다면체의 <b>모서리</b> 개수를 구하시오.`,
        fig:{svg:()=>figRegFan(R.n,R.deg,true)},finalQ:'모서리는 모두 몇 개인가요?',
        steps:[
          {tag:'1단계 · 정다면체 이름',q:'조건을 만족하는 정다면체는?',type:'choice',choices:['정사면체','정육면체','정팔면체','정십이면체','정이십면체'],ans:R.nm,hint:`${R.face} + 모인 면 ${R.deg}개`},
          {tag:'2단계 · 모서리 개수 (면×변÷2)',q:`${R.nm}(면 ${R.F}개, 변 ${R.n}개)의 모서리는? (${R.F} × ${R.n} ÷ 2)`,type:'num',ans:R.E,suffix:'개',hint:`${R.F*R.n} ÷ 2`,ok:`${R.nm}의 모서리는 ${R.E}개예요!`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,qType=r%2;
      return{id:'C2',combo:[2,5],comboWhy:'① 정팔면체 모양 파악(유형 2) → ② 전개도를 접었을 때 성질 ○× 판단(유형 5)',ptype:'regular:c2',
        title:'그림의 정팔면체 전개도를 접어 입체를 만들었을 때의 설명으로 옳은 것을 판단하시오.',
        fig:{svg:figOctNet},finalQ:'올바른 답을 고르세요.',
        steps:[
          {tag:'1단계 · 한 꼭짓점에 모인 면',q:'정팔면체는 한 꼭짓점에 정삼각형이 몇 개씩 모이나요?',type:'num',ans:4,suffix:'개',hint:'정팔면체의 한 꼭짓점에는 4개의 면이 모여요.'},
          {tag:'2단계 · 전개도 해석',q:qType?'면 1과 평행하게 마주 보는 면은 1부터 8 중 7번(대칭 위치)인가요, 아니면 이웃한 면인가요?':'정팔면체는 면이 8개이므로 팔면체이고, 모서리는 몇 개인가요?',
            type:qType?'choice':'num',choices:qType?['마주 보는 대칭 위치 (평행)','바로 옆에 붙은 면']:undefined,ans:qType?'마주 보는 대칭 위치 (평행)':12,suffix:qType?undefined:'개',hint:qType?'전개도에서 두 칸 건너 반대편에 놓여요.':'8 × 3 ÷ 2',ok:'전개도 접기 관계를 잘 찾았어요!'}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── 3차시 rotation ── */
HG_TRACKS.register('rotation',{
  kind:'concept',
  owlScenes:[
    {cap:'장면 ① 한 바퀴 빙글! 회전체',say:'직사각형·직각삼각형·사다리꼴·반원을 <span class="kw">회전축 l</span> 둘레로 1회전 시키면 각각 <b>원기둥 · 원뿔 · 원뿔대 · 구</b>가 돼요.',svg:()=>figRotCross('cyl')},
    {cap:'장면 ② 모선과 회전축',say:'회전체의 옆면을 만드는 기울어진 선분을 <span class="kw">모선</span>, 기준 직선을 <span class="kw">회전축</span>이라고 해요. 다면체는 굽은 면이 없어 회전체가 아니에요!',svg:()=>figConeNet(3,5),
      ask:{q:'원뿔을 밑면에 평행한 평면으로 자를 때 생기는 입체 중 원뿔이 아닌 쪽은?',choices:['원뿔대','각뿔대','원기둥'],ans:'원뿔대',hint:'원뿔을 자르면 작은 원뿔과 원뿔대가 남아요.',ok:'정확해요! 위아래 원의 크기가 다른 원뿔대예요.'}}
  ],
  owlSummary:['직사각형→원기둥 / 직각삼각형→원뿔 / 사다리꼴→원뿔대 / 반원→구','회전축에서 떨어져 있으면 가운데 구멍이 뚫려요','원뿔대 두 밑면: 평행 ○, 합동 ✕'],
  schemaQs:[
    {id:'rtq1',q:'다음 중 <b>회전체</b>가 맞는지 고르세요: 원기둥 vs 사각기둥',fig:figBoxCube,choices:['원기둥만 회전체','사각기둥만 회전체','둘 다 회전체'],ans:'원기둥만 회전체',hint:'직사각형을 돌려 만들 수 있는 것은 원기둥이에요.',why:'맞아요! 원기둥·원뿔·원뿔대·구만 회전체예요.'},
    {id:'rtq2',q:'직각이 있는 사다리꼴을 직각이 두 개 붙은 변 둘레로 돌리면 무엇이 되나요?',fig:figFrust,choices:['원뿔대','원뿔','원기둥'],ans:'원뿔대',hint:'윗변과 아랫변 반지름 길이가 달라요.',why:'맞아요! 위아래 원 크기가 다른 원뿔대가 돼요.'},
    {id:'rtq3',q:'"원뿔대의 두 밑면은 서로 합동이다." 맞나요?',fig:()=>figFrustComp(6,3,8,4),choices:['아니요','맞아요'],ans:'아니요',hint:'위쪽 원이 아래쪽 원보다 작아요.',why:'아니에요! 원뿔대의 두 밑면은 크기가 달라 합동이 아니에요.'}
  ],
  firstGuide:[
    {id:'rtfg1',tyNo:2,title:'유형 2 · 평면도형 돌려 회전체 찾기',problem:'가로 4 cm, 세로 6 cm인 <b>직사각형</b>을 세로를 축으로 1회전 시킬 때 밑면의 반지름을 구하시오.',fig:()=>figRotCross('cyl',4,6),
      wantChips:['밑면의 반지름 (cm)','옆면 넓이','회전축 길이'],wantAns:'밑면의 반지름 (cm)',wantHl:[],
      givenChips:[{k:'a',t:'축(세로 6 cm)에 수직인 가로 4 cm',ok:true},{k:'b',t:'1회전 → 원기둥',ok:true},{k:'t',t:'각뿔대',ok:false}],
      teacherEq:'축에서 떨어진 가로 길이 4 cm = 밑면 반지름',pairQ:'회전체의 밑면 <b>지름</b>은 반지름 4 cm의 몇 배인가요?',pairChoices:['2배 (8 cm)','1배 (4 cm)'],pairAns:'2배 (8 cm)',
      calcPrompt:'밑면의 지름 = 4 × 2 = ? (cm)',calcAns:8,calcTopic:'mul',calcExplain:'반지름 4 cm → 지름 <b>8 cm</b>예요.'},
    {id:'rtfg2',tyNo:3,title:'유형 3 · 돌리기 전 평면도형 찾기',problem:'밑면 지름이 <b>10 cm</b>인 원뿔을 만들기 위해 돌릴 직각삼각형의 밑변 길이는?',fig:()=>figRotCross('cone',5,6),
      wantChips:['직각삼각형 밑변(반지름)','모선','높이'],wantAns:'직각삼각형 밑변(반지름)',wantHl:[],
      givenChips:[{k:'a',t:'원뿔 밑면 지름 10 cm',ok:true},{k:'b',t:'지름 ÷ 2 = 반지름',ok:true},{k:'t',t:'정사각형',ok:false}],
      teacherEq:'돌리기 전 밑변 = 원뿔의 반지름 = 10 ÷ 2',pairQ:'원뿔을 축으로 자른 것의 절반이 돌리기 전 도형이죠. 왜 ÷ 2를 하나요?',pairChoices:['지름이 양쪽 반지름 2개를 합친 거라서','높이가 2배라서'],pairAns:'지름이 양쪽 반지름 2개를 합친 거라서',
      calcPrompt:'10 ÷ 2 = ? (cm)',calcAns:5,calcTopic:'div',calcExplain:'지름 10 ÷ 2 = 반지름 <b>5 cm</b>예요.'},
    {id:'rtfg3',tyNo:1,title:'유형 1 · 회전체 구별하기',problem:'회전축에서 2 cm 떨어진 폭 3 cm 직사각형을 1회전 시켰을 때, 바깥쪽 밑면 반지름은?',fig:()=>figRotCross('cyl',5,6),
      wantChips:['바깥쪽 반지름 (cm)','안쪽 구멍 지름','높이'],wantAns:'바깥쪽 반지름 (cm)',wantHl:[],
      givenChips:[{k:'a',t:'빈틈 거리 2 cm',ok:true},{k:'b',t:'도형 폭 3 cm',ok:true},{k:'t',t:'삼각기둥',ok:false}],
      teacherEq:'바깥 반지름 = 축에서의 빈틈 2 + 폭 3',pairQ:'안쪽 구멍이 뚫린 원기둥에서 바깥 반지름은 어떻게 구하나요?',pairChoices:['빈틈 + 도형 폭','도형 폭 − 빈틈'],pairAns:'빈틈 + 도형 폭',
      calcPrompt:'2 + 3 = ? (cm)',calcAns:5,calcTopic:'add',calcExplain:'2 + 3 = <b>5 cm</b>예요.'}
  ],
  stratRows:[
    ['다면체 vs 회전체','굽은 면','직육면체·삼각뿔 ✕ / 원기둥·원뿔·원뿔대·구 ○'],
    ['회전 결과 찾기','돌린 끝점 궤적','축에 닿은 변은 중심, 바깥 꼭짓점은 원 테두리를 그려요'],
    ['돌리기 전 도형','반쪽 보기','원뿔→직각삼각형, 원뿔대→사다리꼴, 구→반원']
  ],
  worked:{
    1:{no:1,nm:'회전체 가려내기',prob:'다면체와 회전체를 구별하시오.',fig:figBoxCube,steps:[{t:'① 다각형 면만 있는지 보기',hl:[],body:'각기둥·각뿔·정다면체는 다면체(회전체 ✕)'},{t:'② 굽은 면 확인',hl:[],body:'원기둥·원뿔·원뿔대·구가 회전체예요.'},{t:'③ 구의 특징',hl:[],body:'구는 회전축이 무수히 많아요.'}],pitfall:'⚠️ 정다면체는 어느 것도 회전체가 아니에요!'},
    2:{no:2,nm:'회전체 만들기',prob:'평면도형을 직선 l 둘레로 1회전 시킨 결과 찾기',fig:()=>figRotCross('cone'),steps:[{t:'① 위아래 끝 모양',hl:[],body:'뾰족하면 원뿔, 똑같으면 원기둥, 다르면 원뿔대'},{t:'② 축과 떨어졌는지',hl:[],body:'떨어져 있으면 가운데 구멍이 뚫려요.'},{t:'③ 이름 결정',hl:[],body:'반원을 돌리면 반구가 아니라 온전한 구!'}],pitfall:'⚠️ 반원을 1회전 시키면 구가 되지, 반구가 아니에요!'},
    3:{no:3,nm:'돌리기 전 도형 찾기',prob:'회전체를 만들기 전 평면도형',fig:figFrust,steps:[{t:'① 회전축 긋기',hl:[],body:'가운데 수직 축을 기준으로 반쪽을 봐요.'},{t:'② 반쪽 모양 읽기',hl:[],body:'원기둥→직사각형, 원뿔대→사다리꼴'},{t:'③ 치수는 지름의 반',hl:[],body:'가로 길이는 반지름이에요.'}],pitfall:'⚠️ 원뿔대의 반쪽은 직각이 두 개 있는 사다리꼴이에요!'},
    4:{no:4,nm:'회전체 성질 ○×',prob:'회전체·원뿔대·모선 설명 확인하기',fig:()=>figConeNet(3,5),steps:[{t:'① 원뿔대 두 밑면',hl:[],body:'평행 ○, 합동 ✕'},{t:'② 구의 회전축',hl:[],body:'지름이 지나는 무수히 많은 직선 ○'},{t:'③ 모선의 뜻',hl:[],body:'옆면을 만드는 기울어진 선분'}],pitfall:'⚠️ 원뿔대의 두 밑면은 합동이 아니에요!'}
  },
  compoundList:[
    {id:'C1',nm:'종합 ① · 복합 평면도형 1회전 입체 해석',sub:'직사각형+삼각형을 돌렸을 때 조합 입체와 치수 찾기'},
    {id:'C2',nm:'종합 ② · 축에서 떨어진 도형 회전 치수 구하기',sub:'빈틈 거리와 도형 폭으로 안·바깥 반지름과 지름 계산'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,rad=3+(r%5),h1=4+(r>>>3)%5,h2=3+(r>>>6)%4;
      return{id:'C1',combo:[2,3],comboWhy:'① 복합 도형 회전 모양을 파악하고(유형 2) → ② 단면 반쪽의 치수 확인(유형 3)',ptype:'rotation:c1',
        title:`세로 ${h1} cm 위쪽에 높이 ${h2} cm 직각삼각형이 이어 붙은 오각형을 축 둘레로 1회전 시켰어요(반지름 ${rad} cm). 아래는 원기둥, 위는 <b>원뿔</b>일 때 전체 높이와 밑면 <b>지름</b>의 합을 구하시오.`,
        fig:{svg:()=>figRotCross('cyl',rad,h1+h2)},finalQ:'(전체 높이) + (밑면 지름)은 몇 cm인가요?',
        steps:[
          {tag:'1단계 · 전체 높이',q:`아래 원기둥 높이(${h1}) + 위 원뿔 높이(${h2}) = ?`,type:'num',ans:h1+h2,suffix:'cm',hint:`${h1} + ${h2}`},
          {tag:'2단계 · 밑면 지름과 더하기',q:`밑면 지름은 ${2*rad} cm예요. 전체 높이와 지름의 합은?`,type:'num',ans:h1+h2+2*rad,suffix:'cm',hint:`${h1+h2} + ${2*rad}`,ok:`${h1+h2+2*rad} cm`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,gap=2+(r%3),w=3+(r>>>3)%4,R=gap+w;
      return{id:'C2',combo:[2,4],comboWhy:'① 떨어진 도형 회전체를 해석하고(유형 2) → ② 원뿔대·구멍 성질 적용(유형 4)',ptype:'rotation:c2',
        title:`회전축 <i>l</i>에서 <b>${gap} cm</b> 떨어져 있는 가로 ${w} cm 직사각형을 1회전 시켰을 때, 가운데 구멍 반지름과 바깥쪽 반지름의 합을 구하시오.`,
        fig:{svg:()=>figRotCross('cyl',R,6)},finalQ:'(구멍 반지름) + (바깥 반지름)은 몇 cm인가요?',
        steps:[
          {tag:'1단계 · 바깥 반지름 구하기',q:`축에서 바깥 끝까지 거리 = ${gap} + ${w} = ?`,type:'num',ans:R,suffix:'cm',hint:`${gap} + ${w}`},
          {tag:'2단계 · 두 반지름 더하기',q:`안쪽 구멍 반지름(${gap}) + 바깥 반지름(${R}) = ?`,type:'num',ans:gap+R,suffix:'cm',hint:`${gap} + ${R}`,ok:`${gap+R} cm`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── 4차시 rotprop ── */
HG_TRACKS.register('rotprop',{
  kind:'concept',
  owlScenes:[
    {cap:'장면 ① 회전축에 수직 = 언제나 원!',say:'원기둥·원뿔·원뿔대·구 모두 회전축에 <span class="kw">수직으로 자르면</span> 단면의 경계는 언제나 <span class="num">원</span>이에요.',svg:()=>figRotCross('sph')},
    {cap:'장면 ② 회전축을 품고 자르면 선대칭 · 합동!',say:'회전축을 품고 자른 단면은 어느 방향에서 잘라도 모두 <span class="kw">합동</span>! 단, 가로 길이는 반지름이 아니라 <span class="warn">지름(2r)</span>이에요.',svg:()=>figRotCross('cone',4,6),
      ask:{q:'밑면 반지름 5 cm, 높이 6 cm인 원뿔을 회전축 포함 평면으로 자른 삼각형의 밑변은?',choices:['10 cm (지름!)','5 cm','6 cm'],ans:'10 cm (지름!)',hint:'돌리기 전 직각삼각형 2개가 좌우 대칭으로 붙어 있어요.',ok:'맞아요! 5 × 2 = 10 cm가 단면의 밑변이에요.'}}
  ],
  owlSummary:['수직 단면: 항상 원 (원뿔·원뿔대는 크기가 다름)','회전축 포함 단면: 모두 합동 · 선대칭도형 · 밑변=지름(2r)','원기둥→직사각형 / 원뿔→이등변삼각형 / 원뿔대→등변사다리꼴 / 구→원'],
  schemaQs:[
    {id:'rpq1',q:'원뿔을 회전축에 <b>수직</b>인 평면으로 자른 단면들은 모두 크기가 같을까요?',fig:()=>figRotCross('cone',4,6),choices:['아니요, 위치마다 원의 크기가 달라요','모두 합동이에요'],ans:'아니요, 위치마다 원의 크기가 달라요',hint:'위쪽을 자를수록 작은 원이 나와요.',why:'아니에요! 회전축을 "포함"해 자를 때만 모두 합동이에요.'},
    {id:'rpq2',q:'원뿔을 <b>회전축을 포함</b>하는 평면으로 자른 단면은 항상 정삼각형일까요?',fig:()=>figRotCross('cone',4,6),choices:['아니요, 이등변삼각형이에요','항상 정삼각형이에요'],ans:'아니요, 이등변삼각형이에요',hint:'양쪽 모선의 길이만 항상 같아요.',why:'아니에요! 두 모선이 같은 이등변삼각형이에요.'},
    {id:'rpq3',q:'원뿔대를 회전축을 포함하는 평면으로 자르면 어떤 사각형이 나오나요?',fig:figFrust,choices:['등변사다리꼴','직사각형','마름모'],ans:'등변사다리꼴',hint:'양쪽 빗변(모선) 길이가 같은 사다리꼴이에요.',why:'맞아요! 원뿔대의 축 포함 단면은 등변사다리꼴이에요.'}
  ],
  firstGuide:[
    {id:'rpfg1',tyNo:3,title:'유형 3 · 축 포함 단면 넓이 (원기둥)',problem:'반지름 <b>4 cm</b>, 높이 <b>7 cm</b>인 원기둥을 회전축 포함 평면으로 자른 단면 넓이는?',fig:()=>figRotCross('cyl',4,7),
      wantChips:['단면(직사각형)의 넓이','원의 둘레','부피'],wantAns:'단면(직사각형)의 넓이',wantHl:[],
      givenChips:[{k:'a',t:'반지름 4 cm → 지름 8 cm',ok:true},{k:'b',t:'높이 7 cm',ok:true},{k:'t',t:'모선 10 cm',ok:false}],
      teacherEq:'(지름 8) × (높이 7) = 56',pairQ:'왜 가로에 반지름 4가 아니라 <b>8</b>을 썼나요?',pairChoices:['축을 품고 자르면 양쪽이 합쳐져 지름이 되니까','원기둥 2개라서'],pairAns:'축을 품고 자르면 양쪽이 합쳐져 지름이 되니까',
      calcPrompt:'8 × 7 = ? (cm²)',calcAns:56,calcTopic:'facts',calcExplain:'지름 8 × 높이 7 = <b>56 cm²</b>예요.'},
    {id:'rpfg2',tyNo:3,title:'유형 3 · 축 포함 단면 넓이 (원뿔)',problem:'반지름 <b>5 cm</b>, 높이 <b>6 cm</b>인 원뿔을 회전축 포함 평면으로 자른 단면 넓이는?',fig:()=>figRotCross('cone',5,6),
      wantChips:['이등변삼각형 단면 넓이','원의 넓이','모선'],wantAns:'이등변삼각형 단면 넓이',wantHl:[],
      givenChips:[{k:'a',t:'밑변 = 지름 10 cm',ok:true},{k:'b',t:'높이 = 6 cm',ok:true},{k:'t',t:'사다리꼴',ok:false}],
      teacherEq:'(지름 10 × 높이 6) ÷ 2 = 30',pairQ:'식 마지막에 왜 <b>÷ 2</b>를 했나요?',pairChoices:['단면이 이등변삼각형이니까','반지름이라서'],pairAns:'단면이 이등변삼각형이니까',
      calcPrompt:'10 × 6 ÷ 2 = ? (cm²)',calcAns:30,calcTopic:'div',calcExplain:'10 × 6 ÷ 2 = <b>30 cm²</b>예요.'},
    {id:'rpfg3',tyNo:1,title:'유형 1 · 수직 단면 넓이 구하기',problem:'반지름 <b>5 cm</b>인 원기둥을 회전축에 수직으로 자른 단면 넓이는? (π 앞 숫자)',fig:()=>figRotCross('sph'),
      wantChips:['원 단면 넓이 (π 앞 숫자)','직사각형 넓이','높이'],wantAns:'원 단면 넓이 (π 앞 숫자)',wantHl:[],
      givenChips:[{k:'a',t:'수직 단면 = 원',ok:true},{k:'b',t:'반지름 5 cm',ok:true},{k:'t',t:'지름 5 cm',ok:false}],
      teacherEq:'반둘레(5π) × 반지름(5) = 25π',pairQ:'원을 직사각형으로 바꿨을 때 가로와 세로는 각각 얼마인가요?',pairChoices:['5π와 5','10π와 5'],pairAns:'5π와 5',
      calcPrompt:'5 × 5 = ? (π 앞 숫자)',calcAns:25,calcTopic:'pow',calcExplain:'5 × 5 = 25 → <b>25π cm²</b>예요.'}
  ],
  stratRows:[
    ['수직으로 자름','언제나 원','반지름을 보고 원의 넓이(r²π) 또는 둘레(2rπ)'],
    ['회전축 포함','선대칭 · 밑변=2r','원기둥 직사각(2rh) · 원뿔 삼각(2rh÷2=rh) · 원뿔대 사다리꼴'],
    ['떨어진 도형 단면','원래 도형 × 2','축 기준 좌우에 똑같이 2개 나타남!']
  ],
  worked:{
    1:{no:1,nm:'수직 단면',prob:'회전축에 수직인 평면으로 자른 단면의 모양과 넓이',fig:()=>figRotCross('sph'),steps:[{t:'① 모양 확인',hl:[],body:'어느 회전체든 수직 단면은 항상 <b>원</b>이에요.'},{t:'② 원기둥 vs 원뿔',hl:[],body:'원기둥은 모두 합동, 원뿔은 높이에 따라 크기 다름.'},{t:'③ 넓이 구하기',hl:[],body:'반둘레 × 반지름 = r²π'}],pitfall:'⚠️ 구를 제외하면 축 방향을 잘 봐야 해요!'},
    2:{no:2,nm:'축 포함 단면 모양',prob:'회전축을 포함하는 단면의 모양 찾기',fig:()=>figRotCross('cone'),steps:[{t:'① 원기둥',hl:[],body:'직사각형'},{t:'② 원뿔',hl:[],body:'이등변삼각형 (정삼각형 ✕)'},{t:'③ 원뿔대 · 구',hl:[],body:'원뿔대=등변사다리꼴, 구=원'}],pitfall:'⚠️ 축을 포함해 자르면 어느 회전체든 선대칭이고 합동이에요!'},
    3:{no:3,nm:'축 포함 단면의 넓이',prob:'원기둥·원뿔·원뿔대의 축 포함 단면 넓이 구하기',fig:()=>figRotCross('cyl',4,6),steps:[{t:'① 지름 구하기 (2r)',hl:[],body:'단면의 가로/밑변은 반지름 × 2!'},{t:'② 도형 공식 적용',hl:[],body:'직사각형(×), 삼각형(÷2), 사다리꼴(윗+아랫 ×h ÷2)'},{t:'③ 단위 확인',hl:[],body:'넓이이므로 cm²'}],pitfall:'⚠️ 반지름을 그대로 밑변에 넣고 2배 안 하는 실수 조심!'},
    4:{no:4,nm:'성질 ○×',prob:'단면 성질 중 옳지 않은 것 고르기',fig:()=>figRotCross('cone'),steps:[{t:'① 수직 vs 축 포함 구분',hl:[],body:'문장에서 "수직"인지 "포함"인지 밑줄!'},{t:'② 합동 여부',hl:[],body:'축 포함만 모두 합동 (원뿔 수직은 합동 ✕)'},{t:'③ 가장 큰 단면',hl:[],body:'구는 중심을 지날 때 단면 원이 가장 커요.'}],pitfall:'⚠️ 원뿔 수직 단면이 모두 합동이라는 오답에 속지 마세요!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 축에서 떨어진 도형 단면 넓이 × 2',sub:'회전축과 떨어진 직각삼각형을 돌린 단면 = 삼각형 넓이 × 2'},
    {id:'C2',nm:'복합 ② · 원기둥+원뿔 복합 회전체 단면 넓이',sub:'지름 2r로 환산해 직사각형 + 삼각형 합산'},
    {id:'C3',nm:'복합 ③ · 사다리꼴−삼각형 파인 회전체 단면',sub:'사다리꼴에서 삼각형 뺀 넓이 × 2배 대칭 합'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,b=ri_(r,3,7),h=ri_(r>>4,4,8);const validH=(b*h)%2===0?h:h+1,tri=b*validH/2,ans=tri*2;
      return{id:'C1',combo:[2,3],comboWhy:'① 축 포함 선대칭 단면을 떠올려 2개임을 파악(유형 2) → ② 삼각형 넓이×2(유형 3)',ptype:'rotprop:c1',
        title:`회전축에서 떨어져 있는 밑변 ${b} cm, 높이 ${validH} cm인 직각삼각형을 1회전 시킨 입체를 <b>회전축을 포함하는 평면</b>으로 자른 단면의 넓이를 구하시오.`,
        fig:{svg:()=>figRotCross('cone',b,validH)},finalQ:'단면 전체의 넓이는 몇 cm²인가요?',
        steps:[
          {tag:'1단계 · 한쪽 직각삼각형 넓이',q:`한쪽 직각삼각형의 넓이는? (${b} × ${validH} ÷ 2)`,type:'num',ans:tri,suffix:'cm²',hint:`${b} × ${validH} ÷ 2`},
          {tag:'2단계 · 좌우 선대칭 → × 2',q:`회전축을 품고 자르면 좌우에 똑같이 2개가 나타나요. 전체 단면 넓이는?`,type:'num',ans,suffix:'cm²',hint:`${tri} × 2`,ok:`${tri} × 2 = ${ans} cm²`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,rad=ri_(r,3,6),hCyl=ri_(r>>4,4,7),hCone=ri_(r>>8,3,6),d=2*rad;
      const validHC=(d*hCone)%2===0?hCone:hCone+1,aRect=d*hCyl,aTri=d*validHC/2,ans=aRect+aTri;
      return{id:'C2',combo:[2,3],comboWhy:'① 아래 직사각형 + 위 이등변삼각형 모양 파악(유형 2) → ② 지름 2r로 넓이 합(유형 3)',ptype:'rotprop:c2',
        title:`밑면 반지름 ${rad} cm, 높이 ${hCyl} cm 원기둥 위에 높이 ${validHC} cm 원뿔을 얹은 입체를 <b>회전축을 포함</b>하는 평면으로 자른 단면의 넓이를 구하시오.`,
        fig:{svg:()=>figRotCross('cyl',rad,hCyl)},finalQ:'단면의 전체 넓이는 몇 cm²인가요?',
        steps:[
          {tag:'1단계 · 아래 직사각형 넓이 (지름 × 높이)',q:`지름은 ${d} cm예요. 아래 직사각형 넓이는? (${d} × ${hCyl})`,type:'num',ans:aRect,suffix:'cm²',hint:`${d} × ${hCyl}`},
          {tag:'2단계 · 위 삼각형 넓이 더하기',q:`위 삼각형 넓이는 ${d} × ${validHC} ÷ 2 = ${aTri} cm²예요. 합계는?`,type:'num',ans,suffix:'cm²',hint:`${aRect} + ${aTri}`,ok:`${aRect} + ${aTri} = ${ans} cm²`}
        ]};
    },
    C3:seed=>{
      const r=(seed*1103515245+12345)>>>0,u=2+(r%3),d=u+3,h=4+(r>>>4)%4;
      const trap=((u+d)*h)%2===0?(u+d)*h/2:((u+d)*(h+1)/2),realH=((u+d)*h)%2===0?h:h+1;
      const cutTri=u*realH/2,half=trap-cutTri,ans=half*2;
      if(!Number.isInteger(cutTri)||ans<=0)return HG_TRACKS.specs.rotprop.genCompound.C3(seed+1);
      return{id:'C3',combo:[2,3],comboWhy:'① 좌우 대칭 단면 2쪽 확인(유형 2) → ② 사다리꼴 − 삼각형 넓이 × 2(유형 3)',ptype:'rotprop:c3',
        title:`윗변 ${u} cm, 아랫변 ${d} cm, 높이 ${realH} cm인 직각사다리꼴에서 윗변이 구멍(삼각형 밑변 ${u}, 높이 ${realH})으로 파인 도형을 돌렸어요. 축 포함 단면 넓이는?`,
        fig:{svg:()=>figFrust()},finalQ:'단면 전체 넓이는 몇 cm²인가요?',
        steps:[
          {tag:'1단계 · 한쪽 도형 넓이',q:`한쪽 넓이 = 사다리꼴(${trap}) − 파인 삼각형(${cutTri}) = ?`,type:'num',ans:half,suffix:'cm²',hint:`${trap} − ${cutTri}`},
          {tag:'2단계 · 축 대칭 2배',q:`양쪽 2배를 한 전체 단면 넓이는?`,type:'num',ans,suffix:'cm²',hint:`${half} × 2`,ok:`${ans} cm²`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── 5차시 area ── */
HG_TRACKS.register('area',{
  kind:'proc',
  compoundBridgeNo:3,
  owlScenes:[
    {cap:'장면 ① 전개도 펼치기: 밑면 2개 + 옆넓이',say:'기둥의 겉넓이는 전개도를 펼쳐 모든 면의 넓이를 더한 거예요! 기둥은 <span class="kw">밑넓이 × 2 + 옆넓이</span>예요.',svg:figBoxCube},
    {cap:'장면 ② 옆면 펼치면 큰 직사각형!',say:'옆면을 펼친 직사각형의 <span class="kw">가로 = 밑면의 둘레</span>, 세로 = 높이에요. 원기둥이면 가로 = <span class="num">지름 × π</span>!',svg:()=>figRotCross('cyl',3,5),
      ask:{q:'밑면 반지름 3 cm, 높이 5 cm인 원기둥 전개도에서 옆면 직사각형의 가로는?',choices:['6π cm','3π cm','9π cm'],ans:'6π cm',hint:'지름 × π = (3 × 2) × π예요!',ok:'정확해요! 가로 = 밑면 원의 둘레 = 6π cm예요.'}},
    {cap:'장면 ③ L자로 잘라 낸 기둥 함정!',exp:'warn',say:'모서리를 직각으로 잘라 내도 안쪽 벽이 바깥쪽을 대신 채워 주므로 <span class="warn">밑면 둘레가 원래 직사각형과 똑같아요</span>!',svg:figBoxCube}
  ],
  owlSummary:['기둥 겉넓이 = (밑넓이) × 2 + (밑면의 둘레) × (높이)','삼각기둥: 삼각형 넓이 ÷ 2, 둘레는 세 변 모두 더하기','원기둥: 밑넓이 = 반둘레 × 반지름(r²π), 옆넓이 가로 = 지름 × π'],
  schemaQs:[
    {id:'arq1',q:'삼각기둥의 겉넓이를 구할 때 <b>밑넓이</b>는 몇 번 더해야 하나요?',fig:figBoxCube,choices:['2번 (위 · 아래)','1번만','3번'],ans:'2번 (위 · 아래)',hint:'기둥은 위와 아래에 합동인 밑면이 2개 있어요.',why:'맞아요! 기둥 겉넓이는 항상 밑넓이 × 2 + 옆넓이예요.'},
    {id:'arq2',q:'원기둥 전개도에서 옆면 직사각형의 가로는 무엇과 같나요?',fig:()=>figRotCross('cyl',3,5),choices:['밑면의 둘레 (지름 × π)','밑면의 반지름','밑면의 넓이'],ans:'밑면의 둘레 (지름 × π)',hint:'밑면 원을 한 바퀴 감싸던 종이를 쫙 펼쳤어요.',why:'맞아요! 원기둥 옆넓이의 가로는 지름 × π예요.'},
    {id:'arq3',q:'직육면체 모서리에서 작은 직육면체를 직각으로 잘라 내면 밑면의 <b>둘레</b>는 어떻게 될까요?',fig:figBoxCube,choices:['원래와 똑같아요 (함정 주의!)','반으로 줄어요','2배가 돼요'],ans:'원래와 똑같아요 (함정 주의!)',hint:'파인 안쪽 가로·세로 변을 바깥으로 밀어 맞춰 보세요.',why:'맞아요! 모서리를 직각으로 파면 둘레가 그대로 유지돼요.'}
  ],
  firstGuide:[
    {id:'afg1',tyNo:1,title:'유형 1 · 직육면체·삼각기둥 겉넓이',problem:'밑면이 가로 <b>4 cm</b>, 세로 <b>3 cm</b>이고 높이가 <b>5 cm</b>인 직육면체의 겉넓이를 구하시오.',fig:figBoxCube,
      wantChips:['직육면체 전체 겉넓이','밑면 둘레만','부피'],wantAns:'직육면체 전체 겉넓이',wantHl:[],
      givenChips:[{k:'a',t:'밑넓이 4×3 = 12',ok:true},{k:'b',t:'둘레 2×(4+3) = 14',ok:true},{k:'c',t:'높이 5 cm',ok:true},{k:'t',t:'반지름 4 cm',ok:false}],
      teacherEq:'12 × 2 + 14 × 5 = 24 + 70',pairQ:'옆넓이 식 <b>14 × 5</b>에서 14는 무엇인가요?',pairChoices:['밑면의 둘레 (4+3+4+3)','밑면의 넓이'],pairAns:'밑면의 둘레 (4+3+4+3)',
      calcPrompt:'24 + 70 = ? (cm²)',calcAns:94,calcTopic:'surf',calcExplain:'24 + 70 = <b>94 cm²</b>예요.'},
    {id:'afg2',tyNo:2,title:'유형 2 · 원기둥 겉넓이',problem:'반지름 <b>3 cm</b>, 높이 <b>5 cm</b>인 원기둥의 겉넓이(kπ cm²)에서 k를 구하시오.',fig:()=>figRotCross('cyl',3,5),
      wantChips:['원기둥 겉넓이 (π 앞 숫자)','원기둥 부피','모선'],wantAns:'원기둥 겉넓이 (π 앞 숫자)',wantHl:[],
      givenChips:[{k:'a',t:'밑넓이 9π × 2 = 18π',ok:true},{k:'b',t:'옆넓이 6π × 5 = 30π',ok:true},{k:'t',t:'삼각형 나누기 2',ok:false}],
      teacherEq:'(9π × 2) + (6π × 5) = 18π + 30π',pairQ:'옆넓이 <b>6π × 5</b>에서 6π는 어떻게 나왔나요?',pairChoices:['지름(3×2) × π = 밑면 둘레','반지름 × 5'],pairAns:'지름(3×2) × π = 밑면 둘레',
      calcPrompt:'18 + 30 = ? (π 앞 숫자)',calcAns:48,calcTopic:'pi',calcExplain:'18π + 30π = <b>48π cm²</b>예요.'},
    {id:'afg3',tyNo:3,title:'유형 3 · L자 기둥 겉넓이',problem:'가로 6, 세로 5 직사각형 모서리에서 2×2를 잘라 낸 높이 4인 기둥 겉넓이는?',fig:figBoxCube,
      wantChips:['잘린 기둥 전체 겉넓이','밑넓이만','부피'],wantAns:'잘린 기둥 전체 겉넓이',wantHl:[],
      givenChips:[{k:'a',t:'남은 밑넓이 30−4 = 26',ok:true},{k:'b',t:'둘레 그대로 22, 높이 4',ok:true},{k:'t',t:'둘레에서 8 빼기',ok:false}],
      teacherEq:'26 × 2 + 22 × 4 = 52 + 88',pairQ:'밑면 둘레가 왜 원래대로 <b>22</b>인가요?',pairChoices:['파인 변을 밖으로 밀면 원래 직사각형 변과 같아져서','잘린 넓이가 4라서'],pairAns:'파인 변을 밖으로 밀면 원래 직사각형 변과 같아져서',
      calcPrompt:'52 + 88 = ? (cm²)',calcAns:140,calcTopic:'add2',calcExplain:'52 + 88 = <b>140 cm²</b>예요.'}
  ],
  stratRows:[
    ['각기둥 겉넓이','밑넓이×2 + 둘레×높이','삼각기둥 밑넓이 ÷ 2 주의, 세 변 모두 더하기'],
    ['원기둥 겉넓이','r²π×2 + (지름×π)×h','반지름 → 지름×2 → 둘레×π → 옆넓이'],
    ['L자 잘린 기둥','둘레 유지 함정','밑넓이는 빼지만, 모서리 직각 절단이면 둘레는 그대로!']
  ],
  worked:{
    1:{no:1,nm:'각기둥의 겉넓이',prob:'삼각기둥·직육면체의 겉넓이 구하기',fig:figBoxCube,steps:[{t:'① 밑넓이 × 2',hl:[],body:'삼각형은 (밑변×높이÷2), 직사각형은 가로×세로'},{t:'② 밑면 둘레 × 높이',hl:[],body:'밑면의 모든 변을 더해 높이를 곱해요.'},{t:'③ 합산',hl:[],body:'두 값을 더하면 끝!'}],pitfall:'⚠️ 밑면 2개를 1개만 더하거나 빗변을 둘레에서 빼먹지 마세요!'},
    2:{no:2,nm:'원기둥의 겉넓이',prob:'반지름 r, 높이 h인 원기둥 겉넓이',fig:()=>figRotCross('cyl',3,5),steps:[{t:'① 밑넓이 = 반둘레 × 반지름',hl:[],body:'rπ × r = r²π (위아래 × 2)'},{t:'② 옆넓이 가로 = 지름 × π',hl:[],body:'2rπ × 높이'},{t:'③ 더하기',hl:[],body:'π끼리 계수를 더해요.'}],pitfall:'⚠️ 2πr²+2πrh 암기보다 전개도(밑 2개+큰 직사각형)로 풀어요!'},
    3:{no:3,nm:'잘라 낸 L자 기둥 겉넓이',prob:'모서리가 직각으로 잘린 기둥의 겉넓이',fig:figBoxCube,steps:[{t:'① 남은 밑넓이 × 2',hl:[],body:'전체 직사각형 − 잘린 작은 직사각형'},{t:'② 밑면 둘레는 원래대로',hl:[],body:'꺾인 안쪽 변을 밀어 원래 둘레 사용'},{t:'③ 더하기',hl:[],body:'남은 밑넓이×2 + 원래 둘레×높이'}],pitfall:'⚠️ 안쪽 벽면 2개가 생겨서 옆넓이가 줄지 않아요!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 같은 부피 두 원기둥 캔 재료(겉넓이) 비교',sub:'지름을 반지름으로 바꿔 두 캔의 겉넓이를 각각 구해 차이 비교'},
    {id:'C2',nm:'복합 ② · 정육면체 연결큐브 겉면만 두른 블록 개수',sub:'전체 큐브에서 속 안의 보이지 않는 정육면체 빼기'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0;
      const specs=[{d1:6,h1:24,d2:12,h2:6},{d1:4,h1:16,d2:8,h2:4},{d1:6,h1:16,d2:12,h2:4}];
      const sp=specs[r%specs.length],r1=sp.d1/2,r2=sp.d2/2,s1=2*r1*r1+sp.d1*sp.h1,s2=2*r2*r2+sp.d2*sp.h2,diff=Math.abs(s1-s2);
      return{id:'C1',combo:[2,1],comboWhy:'① 지름으로 원기둥 두 캔의 겉넓이를 각각 구하고(유형 2) → ② 두 넓이 차이 계산(유형 1)',ptype:'area:c1',
        title:`부피가 같은 두 원기둥 캔 A(지름 ${sp.d1} cm, 높이 ${sp.h1} cm)와 B(지름 ${sp.d2} cm, 높이 ${sp.h2} cm)의 <b>겉넓이의 차</b>를 구하시오.`,
        fig:{svg:()=>figRotCross('cyl',r1,sp.h1)},finalQ:'두 캔의 겉넓이의 차는 몇 cm²인가요?',
        steps:[
          {tag:'1단계 · 캔 A 겉넓이 (반지름 '+r1+')',q:`캔 A 겉넓이 = (${r1*r1}π×2) + (${sp.d1}π×${sp.h1}) = ?`,type:'pi',ans:s1,suffix:'cm²',hint:`${2*r1*r1} + ${sp.d1*sp.h1}π`},
          {tag:'2단계 · 캔 B 겉넓이',q:`캔 B(반지름 ${r2}) 겉넓이 = (${r2*r2}π×2) + (${sp.d2}π×${sp.h2}) = ?`,type:'pi',ans:s2,suffix:'cm²',hint:`${2*r2*r2} + ${sp.d2*sp.h2}π`},
          {tag:'3단계 · 두 겉넓이의 차',q:`|${s1}π − ${s2}π| = ?`,type:'pi',ans:diff,suffix:'cm²',hint:`큰 쪽에서 작은 쪽 빼기`,ok:`넓이 차는 ${diff}π cm²예요 (B가 재료가 적게 들어요!).`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,n=3+(r%3),inN=n-2,tot=n*n*n,inn=inN*inN*inN,ans=tot-inn;
      return{id:'C2',combo:[1,3],comboWhy:'① 큰 정육면체 구조를 파악하고(유형 1) → ② 보이지 않는 안쪽을 빼기(유형 3)',ptype:'area:c2',
        title:`한 모서리에 작은 큐브 <b>${n}개</b>씩 쌓은 정육면체에서 <b>겉면에 드러난 블록만</b> 남기고 속을 비우려 해요. 필요한 겉면 큐브 개수는?`,
        fig:{svg:figBoxCube},finalQ:'겉면을 두르는 데 필요한 큐브는 모두 몇 개인가요?',
        steps:[
          {tag:'1단계 · 전체 큐브 개수',q:`${n} × ${n} × ${n} = ?`,type:'num',ans:tot,suffix:'개',hint:`${n*n} × ${n}`},
          {tag:'2단계 · 속 안의 큐브 빼기',q:`양옆·위아래·앞뒤 1겹씩 빼면 안쪽은 (${inN}×${inN}×${inN} = ${inn})개예요. 전체 − 안쪽 = ?`,type:'num',ans,suffix:'개',hint:`${tot} − ${inn}`,ok:`${tot} − ${inn} = ${ans}개`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── 6차시 volume ── */
HG_TRACKS.register('volume',{
  kind:'proc',
  compoundBridgeNo:4,
  owlScenes:[
    {cap:'장면 ① 바닥(밑넓이) × 층수(높이) = 부피',say:'기둥의 부피는 아주 간단해요! 바닥 넓이(<span class="kw">밑넓이</span>)를 <span class="kw">높이</span>만큼 겹겹이 쌓으면 <span class="num">(밑넓이) × (높이)</span>!',svg:figBoxCube},
    {cap:'장면 ② 원기둥도 r²π × 높이!',say:'원기둥도 기둥이니까 밑면 원의 넓이 <span class="num">(반둘레 × 반지름 = r²π)</span>에 <b>높이</b>를 곱해요.',svg:()=>figRotCross('cyl',3,5),
      ask:{q:'구멍이 뚫린 원기둥 부피를 구할 때 바른 식은?',choices:['(바깥 밑넓이 − 안쪽 밑넓이) × 높이','바깥 밑넓이 × 높이 + 안쪽','겉넓이 × 높이'],ans:'(바깥 밑넓이 − 안쪽 밑넓이) × 높이',hint:'구멍이 뚫렸으므로 바닥 도넛 넓이를 구해 높이를 곱해요!',ok:'정확해요! 도넛 밑넓이에 높이를 곱하면 돼요.'}}
  ],
  owlSummary:['모든 기둥의 부피 = (밑넓이) × (높이)','겉넓이(cm²)와 부피(cm³) 공식 섞지 않기!','구멍 뚫리거나 잘린 기둥: (남은 밑넓이) × (높이)'],
  schemaQs:[
    {id:'vq1',q:'밑넓이가 같고 높이가 <b>2배</b>가 되면 기둥의 부피는 몇 배가 되나요?',fig:figBoxCube,choices:['2배','4배','변함없다'],ans:'2배',hint:'밑넓이 × (높이×2)를 생각해 보세요.',why:'맞아요! 높이가 2배면 부피도 2배예요.'},
    {id:'vq2',q:'원기둥의 부피가 더 크면 겉넓이도 <b>항상</b> 더 클까요?',fig:()=>figRotCross('cyl',3,5),choices:['아니요, 모양에 따라 겉넓이는 작을 수도 있어요','부피가 크면 항상 겉넓이도 커요'],ans:'아니요, 모양에 따라 겉넓이는 작을 수도 있어요',hint:'납작하고 긴 상자 vs 정육면체 가까운 상자를 비교해 보세요.',why:'아니에요! 부피와 겉넓이는 항상 같은 순서로 크지 않아요.'},
    {id:'vq3',q:'부채꼴 기둥(케이크 한 조각)의 부피를 구하려면 밑넓이는 무엇의 넓이일까요?',fig:()=>figSectorPrism(6,120,9),choices:['부채꼴의 넓이','직사각형 넓이','원 전체 둘레'],ans:'부채꼴의 넓이',hint:'바닥에 닿는 면 모양이 부채꼴이에요.',why:'맞아요! 부채꼴 넓이 × 높이로 구해요.'}
  ],
  firstGuide:[
    {id:'vfg1',tyNo:1,title:'유형 1 · 각기둥 부피 구하기',problem:'밑면이 직각을 낀 두 변 <b>4 cm</b>, <b>6 cm</b>인 직각삼각형이고 높이가 <b>5 cm</b>인 삼각기둥 부피는?',fig:figBoxCube,
      wantChips:['삼각기둥 부피 (cm³)','삼각기둥 겉넓이','둘레'],wantAns:'삼각기둥 부피 (cm³)',wantHl:[],
      givenChips:[{k:'a',t:'삼각형 밑넓이 4×6÷2 = 12',ok:true},{k:'b',t:'높이 5 cm',ok:true},{k:'t',t:'4+6 = 10',ok:false}],
      teacherEq:'(4 × 6 ÷ 2) × 5 = 12 × 5',pairQ:'삼각기둥 밑넓이를 구할 때 왜 ÷ 2를 하나요?',pairChoices:['밑면이 삼각형이라서','기둥이라서'],pairAns:'밑면이 삼각형이라서',
      calcPrompt:'12 × 5 = ? (cm³)',calcAns:60,calcTopic:'mul',calcExplain:'12 × 5 = <b>60 cm³</b>예요.'},
    {id:'vfg2',tyNo:2,title:'유형 2 · 원기둥 부피 구하기',problem:'반지름 <b>4 cm</b>, 높이 <b>5 cm</b>인 원기둥 부피(kπ cm³)에서 k를 구하시오.',fig:()=>figRotCross('cyl',4,5),
      wantChips:['원기둥 부피 (π 앞 숫자)','원기둥 겉넓이','지름'],wantAns:'원기둥 부피 (π 앞 숫자)',wantHl:[],
      givenChips:[{k:'a',t:'밑넓이 4π × 4 = 16π',ok:true},{k:'b',t:'높이 5 cm',ok:true},{k:'t',t:'둘레 8π × 2',ok:false}],
      teacherEq:'(4π × 4) × 5 = 16π × 5',pairQ:'식에서 <b>16π</b>는 무엇의 값인가요?',pairChoices:['밑면 원의 넓이','원 둘레'],pairAns:'밑면 원의 넓이',
      calcPrompt:'16 × 5 = ? (π 앞 숫자)',calcAns:80,calcTopic:'pi',calcExplain:'16π × 5 = <b>80π cm³</b>예요.'},
    {id:'vfg3',tyNo:4,title:'유형 4 · 구멍 뚫린 원기둥 부피',problem:'바깥 반지름 5 cm, 안쪽 반지름 3 cm, 높이 4 cm인 구멍 뚫린 원기둥 부피(kπ cm³)는?',fig:()=>figRotCross('cyl',5,4),
      wantChips:['남은 원기둥 부피 (π 앞 숫자)','안쪽 구멍 부피','겉넓이'],wantAns:'남은 원기둥 부피 (π 앞 숫자)',wantHl:[],
      givenChips:[{k:'a',t:'바깥 밑넓이 25π',ok:true},{k:'b',t:'구멍 밑넓이 9π',ok:true},{k:'c',t:'높이 4 cm',ok:true},{k:'t',t:'둘레 10π',ok:false}],
      teacherEq:'(25π − 9π) × 4 = 16π × 4',pairQ:'25π에서 9π를 왜 뺐나요?',pairChoices:['가운데 구멍 크기만큼 밑넓이가 비어 있어서','반지름을 2배 해서'],pairAns:'가운데 구멍 크기만큼 밑넓이가 비어 있어서',
      calcPrompt:'16 × 4 = ? (π 앞 숫자)',calcAns:64,calcTopic:'mul',calcExplain:'16π × 4 = <b>64π cm³</b>예요.'}
  ],
  stratRows:[
    ['각기둥 부피','밑넓이 × 높이','직사각형(×) · 삼각형(÷2) · 사다리꼴((윗+아랫)×h÷2)'],
    ['원기둥 부피','r²π × 높이','반둘레 × 반지름으로 밑넓이 먼저!'],
    ['잘린·구멍 기둥','큰 기둥 − 작은 기둥','남은 밑넓이에 높이를 곱해도 같아요']
  ],
  worked:{
    1:{no:1,nm:'각기둥의 부피',prob:'각기둥의 부피 구하기',fig:figBoxCube,steps:[{t:'① 밑넓이 구하기',hl:[],body:'삼각형은 ÷ 2 꼭 하기!'},{t:'② 높이 곱하기',hl:[],body:'밑넓이 × 높이'},{t:'③ 단위 cm³',hl:[],body:'부피는 세제곱 단위예요.'}],pitfall:'⚠️ 겉넓이처럼 밑넓이에 × 2 하지 마세요!'},
    2:{no:2,nm:'원기둥의 부피',prob:'원기둥의 부피 구하기',fig:()=>figRotCross('cyl',4,5),steps:[{t:'① 원 밑넓이',hl:[],body:'반둘레(rπ) × 반지름(r)'},{t:'② 높이 곱하기',hl:[],body:'r²π × 높이'},{t:'③ π 빼먹지 않기',hl:[],body:'숫자 뒤에 π를 붙여요.'}],pitfall:'⚠️ 지름(2r)이 주어지면 반으로 나눠 반지름부터 구해요!'},
    3:{no:3,nm:'높이 거꾸로 구하기',prob:'부피로 높이 역산하기',fig:()=>figRotCross('cyl',3,5),steps:[{t:'① 밑넓이 구하기',hl:[],body:'알려 준 치수로 밑넓이 먼저 계산'},{t:'② 부피 ÷ 밑넓이',hl:[],body:'부피를 밑넓이로 나누면 높이!'},{t:'③ 검산하기',hl:[],body:'밑넓이 × 높이 = 부피인지 확인'}],pitfall:'⚠️ π로 나눌 때는 양쪽 π가 약분되어 높이에는 π가 없어요!'},
    4:{no:4,nm:'잘라 낸 기둥 부피',prob:'구멍 뚫린/잘린 기둥의 부피',fig:()=>figRotCross('cyl',5,4),steps:[{t:'① 남은 밑넓이 구하기',hl:[],body:'바깥 밑넓이 − 잘린 밑넓이'},{t:'② 높이 곱하기',hl:[],body:'남은 밑넓이 × 높이'},{t:'③ 큰 기둥 − 작은 기둥과 같음',hl:[],body:'둘 중 편한 방법을 써요.'}],pitfall:'⚠️ 뚫린 원기둥에서 반지름끼리 먼저 빼고 제곱하면 ✕! 각각 제곱 후 빼요.'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 부채꼴 기둥(케이크 조각) 부피',sub:'부채꼴 밑넓이 구하고 높이 곱하기'},
    {id:'C2',nm:'복합 ② · 직사각형 두 변 축 회전 부피 차 |V−W|',sub:'가로 축(r=세로, h=가로)과 세로 축(r=가로, h=세로) 부피 비교'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0;
      const specs=[[6,120,5],[6,90,6],[4,90,7],[3,120,8],[6,60,9]];
      const [rad,th,h]=specs[r%specs.length],base=rad*rad*th/360,V=base*h;
      return{id:'C1',combo:[2,1],comboWhy:'① 부채꼴 밑넓이(원의 일부)를 구하고(유형 2) → ② 높이 곱해 부피 계산(유형 1)',ptype:'volume:c1',
        title:`밑면이 반지름 <b>${rad} cm</b>, 중심각 <b>${th}°</b>인 부채꼴이고 높이가 <b>${h} cm</b>인 부채꼴 기둥의 <b>부피</b>를 구하시오.`,
        fig:{svg:()=>figSectorPrism(rad,th,h)},finalQ:'부채꼴 기둥의 부피는 몇 cm³인가요?',
        steps:[
          {tag:'1단계 · 부채꼴 밑넓이',q:`반지름 ${rad} cm, 중심각 ${th}°인 부채꼴 밑넓이는? (${rad*rad}π × ${th}/360)`,type:'pi',ans:base,suffix:'cm²',hint:`${rad*rad} ÷ ${360/th}π`},
          {tag:'2단계 · 부피 = 밑넓이 × 높이',q:`${base}π × ${h} = ?`,type:'pi',ans:V,suffix:'cm³',hint:`${base} × ${h}π`,ok:`${V}π cm³`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,specs=[[4,6],[3,6],[4,8],[5,8],[6,9]];
      const [a,b]=specs[r%specs.length],vHor=b*b*a,vVer=a*a*b,diff=Math.abs(vHor-vVer);
      return{id:'C2',combo:[2,4],comboWhy:'① 두 방향 원기둥 부피를 각각 구하고(유형 2) → ② 두 부피 차이 계산(유형 4)',ptype:'volume:c2',
        title:`가로 <b>${a} cm</b>, 세로 <b>${b} cm</b>인 직사각형을 가로를 축으로 1회전 시킨 부피 V, 세로를 축으로 1회전 시킨 부피 W의 차 <b>V − W</b>를 구하시오.`,
        fig:{svg:()=>figRotCross('cyl',b,a)},finalQ:'V − W의 값은 몇 cm³인가요?',
        steps:[
          {tag:'1단계 · 가로를 축(반지름 '+b+', 높이 '+a+') 부피 V',q:`V = ${b*b}π × ${a} = ?`,type:'pi',ans:vHor,suffix:'cm³',hint:`반지름이 ${b} cm, 높이가 ${a} cm예요.`},
          {tag:'2단계 · 세로를 축(반지름 '+a+', 높이 '+b+') 부피 W',q:`W = ${a*a}π × ${b} = ?`,type:'pi',ans:vVer,suffix:'cm³',hint:`반지름이 ${a} cm, 높이가 ${b} cm예요.`},
          {tag:'3단계 · 두 부피의 차 V − W',q:`${vHor}π − ${vVer}π = ?`,type:'pi',ans:diff,suffix:'cm³',hint:`${vHor} − ${vVer}π`,ok:`두 부피의 차는 ${diff}π cm³예요!`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

/* ── 7차시 conearea ── */
HG_TRACKS.register('conearea',{
  kind:'proc',
  compoundBridgeNo:4,
  owlScenes:[
    {cap:'장면 ① 뿔은 밑면이 딱 1개!',say:'기둥은 밑면이 2개였지만 뿔은 <span class="kw">밑면이 1개뿐</span>이에요! 그래서 <b>(뿔의 겉넓이) = (밑넓이) + (옆넓이)</b>예요.',svg:()=>figConeNet(3,5)},
    {cap:'장면 ② 원뿔 옆넓이 = (호의 반) × 모선!',say:'원뿔을 펼치면 옆면이 부채꼴! 부채꼴의 호 = 밑면 둘레(<span class="num">지름 × π</span>).<br>따라서 옆넓이 = <span class="num">(호의 반) × (모선)</span> = <span class="num">r × l × π</span>!',svg:()=>figConeNet(3,5),
      ask:{q:'밑면 반지름 4 cm, 높이 3 cm, 모선 5 cm인 원뿔의 겉넓이를 구할 때 <b>옆넓이</b>에 쓸 길이는?',choices:['모선 5 cm','높이 3 cm','지름 8 cm'],ans:'모선 5 cm',hint:'전개도를 펼쳤을 때 부채꼴의 반지름이 되는 기울어진 선분이에요!',ok:'정확해요! 겉넓이는 모선 5 cm를 써서 4π × 5 = 20π cm²예요.'}}
  ],
  owlSummary:['뿔 겉넓이 = 밑넓이(1개!) + 옆넓이','정사각뿔 옆넓이 = 삼각형 1개(÷2) × 4','원뿔 옆넓이 = (호의 반) × 모선 = r l π (높이 쓰지 않기!)'],
  schemaQs:[
    {id:'caq1',q:'원뿔의 겉넓이를 구할 때 <b>밑넓이</b>는 몇 번 더할까요?',fig:()=>figConeNet(3,5),choices:['1번만','2번 (위아래)'],ans:'1번만',hint:'원뿔은 아래에만 원이 1개 있어요.',why:'맞아요! 기둥만 2번, 뿔은 1번만 더해요.'},
    {id:'caq2',q:'원뿔에서 높이 8 cm, 모선 10 cm일 때 <b>옆넓이</b>를 구하려면 어느 길이를 쓰나요?',fig:()=>figConeNet(6,10),choices:['모선 10 cm','높이 8 cm'],ans:'모선 10 cm',hint:'펼친 전개도에서 부채꼴의 반지름은 모선이에요.',why:'맞아요! 겉넓이에는 반드시 모선 길이를 써요.'},
    {id:'caq3',q:'"원뿔 전개도에서 옆면은 삼각형이다." 맞나요?',fig:()=>figConeNet(4,8),choices:['아니요, 부채꼴이에요','맞아요, 삼각형이에요'],ans:'아니요, 부채꼴이에요',hint:'밑면 원을 감싸는 테두리가 굽은 호예요.',why:'아니에요! 원뿔의 옆면은 부채꼴, 각뿔의 옆면이 삼각형이에요.'}
  ],
  firstGuide:[
    {id:'cafg1',tyNo:1,title:'유형 1 · 정사각뿔 겉넓이',problem:'밑면이 한 변 <b>4 cm</b>인 정사각형, 옆면 삼각형 높이가 <b>5 cm</b>인 정사각뿔의 겉넓이는?',fig:figBoxCube,
      wantChips:['정사각뿔 겉넓이','밑넓이만','부피'],wantAns:'정사각뿔 겉넓이',wantHl:[],
      givenChips:[{k:'a',t:'밑넓이 4×4 = 16',ok:true},{k:'b',t:'삼각형 1개 4×5÷2 = 10',ok:true},{k:'c',t:'옆면 4개 = 40',ok:true},{k:'t',t:'밑넓이 × 2',ok:false}],
      teacherEq:'16 + (10 × 4) = 16 + 40',pairQ:'삼각형 10에 왜 <b>4</b>를 곱하고, 밑넓이 16은 1번만 더하나요?',pairChoices:['사각뿔은 옆면 4개, 밑면 1개니까','정육면체라서'],pairAns:'사각뿔은 옆면 4개, 밑면 1개니까',
      calcPrompt:'16 + 40 = ? (cm²)',calcAns:56,calcTopic:'surf',calcExplain:'16 + 40 = <b>56 cm²</b>예요.'},
    {id:'cafg2',tyNo:2,title:'유형 2 · 원뿔 겉넓이',problem:'밑면 반지름 <b>4 cm</b>, 모선 <b>6 cm</b>인 원뿔의 겉넓이(kπ cm²)에서 k를 구하시오.',fig:()=>figConeNet(4,6),
      wantChips:['원뿔 겉넓이 (π 앞 숫자)','부채꼴 중심각','원뿔 부피'],wantAns:'원뿔 겉넓이 (π 앞 숫자)',wantHl:[],
      givenChips:[{k:'a',t:'밑넓이 16π',ok:true},{k:'b',t:'옆넓이 4π × 6 = 24π',ok:true},{k:'t',t:'밑넓이 16π × 2',ok:false}],
      teacherEq:'16π + (4π × 6) = 16π + 24π',pairQ:'옆넓이 <b>4π × 6</b>에서 4π는 무엇인가요?',pairChoices:['밑면 둘레(8π)의 반(=호의 반)','지름'],pairAns:'밑면 둘레(8π)의 반(=호의 반)',
      calcPrompt:'16 + 24 = ? (π 앞 숫자)',calcAns:40,calcTopic:'pi',calcExplain:'16π + 24π = <b>40π cm²</b>예요.'},
    {id:'cafg3',tyNo:3,title:'유형 3 · 원뿔 전개도 부채꼴 중심각',problem:'밑면 반지름 <b>3 cm</b>, 모선 <b>9 cm</b>인 원뿔의 옆면 부채꼴 중심각은?',fig:()=>figConeNet(3,9),
      wantChips:['옆면 부채꼴 중심각 (°)','겉넓이','부피'],wantAns:'옆면 부채꼴 중심각 (°)',wantHl:[],
      givenChips:[{k:'a',t:'밑면 둘레 6π cm',ok:true},{k:'b',t:'큰 원 둘레 18π cm',ok:true},{k:'t',t:'삼각형 넓이',ok:false}],
      teacherEq:'360° × (6π / 18π) = 360° × (1/3)',pairQ:'비율 <b>6π / 18π</b>를 약분하면 몇 분의 몇인가요?',pairChoices:['1/3','1/2'],pairAns:'1/3',
      calcPrompt:'360 ÷ 3 = ? (°)',calcAns:120,calcTopic:'frac',calcExplain:'360° × 1/3 = <b>120°</b>예요.'}
  ],
  stratRows:[
    ['정사각뿔 겉넓이','밑 1개 + 삼각형 × 4','삼각형 넓이 ÷ 2 빼먹지 않기'],
    ['원뿔 겉넓이','r²π + (호의 반)×모선','호 = 2rπ → 호의 반 = rπ → rπ×모선'],
    ['전개도 중심각','360° × (r / 모선)','밑면 둘레 / 큰 원 둘레 = r / 모선']
  ],
  worked:{
    1:{no:1,nm:'정사각뿔 겉넓이',prob:'정사각뿔 겉넓이 구하기',fig:figBoxCube,steps:[{t:'① 밑넓이 (1개)',hl:[],body:'한 변 × 한 변'},{t:'② 삼각형 × 4',hl:[],body:'(밑변 × 옆면 높이 ÷ 2) × 4'},{t:'③ 더하기',hl:[],body:'밑넓이 + 옆넓이'}],pitfall:'⚠️ 삼각형 ÷ 2와 밑면 1개를 헷갈리지 마세요!'},
    2:{no:2,nm:'원뿔 겉넓이',prob:'밑면 반지름 r, 모선 l 원뿔 겉넓이',fig:()=>figConeNet(4,6),steps:[{t:'① 밑넓이 = r²π',hl:[],body:'반둘레 × 반지름'},{t:'② 옆넓이 = (호의 반) × 모선',hl:[],body:'rπ × 모선'},{t:'③ 더하기',hl:[],body:'두 값의 π 계수 합산'}],pitfall:'⚠️ 높이가 같이 주어지면 옆넓이엔 반드시 "모선"을 써요!'},
    3:{no:3,nm:'원뿔 전개도 중심각',prob:'밑면 반지름 r, 모선 l → 중심각',fig:()=>figConeNet(3,9),steps:[{t:'① 밑면 둘레',hl:[],body:'2rπ'},{t:'② 모선 원 둘레',hl:[],body:'2lπ'},{t:'③ 360° × 비율',hl:[],body:'360° × (r/l)'}],pitfall:'⚠️ 분모에 반지름이 아니라 "모선"이 들어가야 해요!'},
    4:{no:4,nm:'뿔대의 겉넓이',prob:'원뿔대·사각뿔대의 겉넓이 구하기',fig:()=>figFrustComp(6,3,10,5),steps:[{t:'① 위아래 두 밑넓이',hl:[],body:'크기가 다른 두 밑면 모두 더하기'},{t:'② 옆넓이',hl:[],body:'큰 부채꼴 − 작은 부채꼴 (또는 사다리꼴 4개)'},{t:'③ 합산',hl:[],body:'두 밑넓이 + 옆넓이'}],pitfall:'⚠️ 뿔대는 뿔과 달리 밑면이 2개(위+아래)예요!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 모선과 높이 구별해 원뿔 겉넓이 구하기',sub:'높이와 모선이 함께 나올 때 모선을 골라 겉넓이 계산'},
    {id:'C2',nm:'복합 ② · 정사각뿔 겉넓이로 옆면 높이 역산',sub:'겉넓이에서 밑넓이를 빼고 삼각형 높이 구하기'},
    {id:'C3',nm:'복합 ③ · 원뿔 n바퀴 굴려 제자리 겉넓이',sub:'큰 원 둘레 = 밑면 둘레 × n으로 모선 찾고 겉넓이 구하기'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,specs=[[3,4,5],[6,8,10],[5,12,13]];
      const [rad,h,l]=specs[r%specs.length],B=rad*rad,L=rad*l,S=B+L;
      return{id:'C1',combo:[2,3],comboWhy:'① 높이·모선 중 모선을 골라 옆넓이 계산(유형 2) → ② 전개도 구조 연결(유형 3)',ptype:'conearea:c1',
        title:`밑면 반지름 <b>${rad} cm</b>, 높이 <b>${h} cm</b>, 모선 <b>${l} cm</b>인 원뿔의 <b>겉넓이</b>를 구하시오.`,
        fig:{svg:()=>figConeNet(rad,l)},finalQ:'원뿔의 겉넓이는 몇 cm²인가요?',
        steps:[
          {tag:'1단계 · 옆넓이에 쓸 길이 고르기',q:'옆면 부채꼴의 반지름이 되는 길이는 높이('+h+')와 모선('+l+') 중 무엇인가요?',type:'num',ans:l,suffix:'cm',hint:'전개도를 펼쳤을 때 부채꼴의 반지름은 모선이에요!'},
          {tag:'2단계 · 밑넓이 + 옆넓이',q:`밑넓이(${B}π) + 옆넓이(${rad}π×${l}=${L}π) = ?`,type:'pi',ans:S,suffix:'cm²',hint:`${B} + ${L}π`,ok:`${S}π cm²`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,a=[6,8,10][r%3],sh=4+(r>>>3)%5,validSh=(a*sh)%2===0?sh:sh+1;
      const B=a*a,S=B+4*(a*validSh/2),side=S-B;
      return{id:'C2',combo:[1,4],comboWhy:'① 정사각뿔 전체 겉넓이에서 밑넓이를 빼고(유형 1) → ② 방정식으로 높이 역산(유형 4)',ptype:'conearea:c2',
        title:`밑면 한 변이 <b>${a} cm</b>이고 겉넓이가 <b>${S} cm²</b>인 정사각뿔의 <b>옆면 삼각형 높이 x</b>를 구하시오.`,
        fig:{svg:figBoxCube},finalQ:'옆면 삼각형의 높이 x는 몇 cm인가요?',
        steps:[
          {tag:'1단계 · 옆넓이 구하기',q:`전체 겉넓이(${S}) − 밑넓이(${B}) = ?`,type:'num',ans:side,suffix:'cm²',hint:`${S} − ${B}`},
          {tag:'2단계 · 삼각형 높이 x 구하기',q:`삼각형 1개 넓이는 ${side}÷4 = ${side/4} cm²예요. (${a} × x ÷ 2 = ${side/4}) → x는?`,type:'num',ans:validSh,suffix:'cm',hint:`(${side/4} × 2) ÷ ${a}`,ok:`x = ${validSh} cm`}
        ]};
    },
    C3:seed=>{
      const r=(seed*1103515245+12345)>>>0,rad=2+(r%4),k=2+(r>>>3)%3,l=rad*k,B=rad*rad,L=rad*l,S=B+L;
      return{id:'C3',combo:[3,2],comboWhy:'① 회전 수로 모선의 길이를 먼저 구하고(유형 3) → ② 원뿔 겉넓이 계산(유형 2)',ptype:'conearea:c3',
        title:`밑면 반지름이 <b>${rad} cm</b>인 원뿔을 평면 위에서 꼭짓점을 고정하고 굴렸더니 딱 <b>${k}바퀴</b> 돌았을 때 제자리로 왔어요. 이 원뿔의 <b>겉넓이</b>를 구하시오.`,
        fig:{svg:()=>figConeNet(rad,l)},finalQ:'원뿔의 겉넓이는 몇 cm²인가요?',
        steps:[
          {tag:'1단계 · 모선의 길이 찾기',q:`모선 반지름 큰 원 둘레 = 밑면 둘레 × ${k}이므로 모선 l = ${rad} × ${k} = ?`,type:'num',ans:l,suffix:'cm',hint:`${rad} × ${k}`},
          {tag:'2단계 · 겉넓이 구하기',q:`밑넓이(${B}π) + 옆넓이(${rad}π×${l}=${L}π) = ?`,type:'pi',ans:S,suffix:'cm²',hint:`${B} + ${L}π`,ok:`${S}π cm²`}
        ]};
    }
  },
  t3PracticeCids:['C1','C3']
});

/* ── 8차시 cone ── */
HG_TRACKS.register('cone',{
  kind:'proc',
  compoundBridgeNo:4,
  owlScenes:[
    {cap:'장면 ① 기둥의 딱 ⅓!',say:'밑면과 높이가 같은 기둥 그릇에 뿔로 물을 부으면 정확히 <span class="num">3번</span> 만에 가득 차요! 그래서 <b>(뿔의 부피) = (밑넓이) × (높이) ÷ 3</b>!',svg:()=>figFrustComp(6,3,9,4)},
    {cap:'장면 ② 모선이 아니라 수직 높이! · 뿔대는 큰 뿔 − 작은 뿔',say:'부피에는 <span class="warn">수직 높이</span>를 써요. 뿔대는 <span class="kw">큰 뿔 부피 − 작은 뿔 부피</span>로 구하면 실수가 없어요.',svg:()=>figFrustComp(6,3,8,4),
      ask:{q:'밑면의 반지름 3 cm, 높이 5 cm인 원뿔의 부피는?',choices:['15π cm³','45π cm³','30π cm³'],ans:'15π cm³',hint:'밑넓이(9π) × 높이(5)를 구한 뒤 ÷ 3을 꼭 해요!',ok:'정확해요! 45π ÷ 3 = 15π cm³예요.'}}
  ],
  owlSummary:['뿔의 부피 = (밑넓이) × (높이) ÷ 3 (÷ 3 잊지 마세요!)','원뿔 부피 = r²π × 높이 ÷ 3 (수직 높이 사용)','뿔대 부피 = 큰 뿔 부피 − 작은 뿔 부피'],
  schemaQs:[
    {id:'cq1',q:'밑넓이와 높이가 같은 원기둥 부피가 <b>30π cm³</b>일 때 원뿔 부피는?',fig:()=>figConeNet(3,5),choices:['10π cm³','30π cm³','90π cm³'],ans:'10π cm³',hint:'원뿔은 같은 원기둥의 1/3이에요.',why:'맞아요! 30π ÷ 3 = 10π cm³예요.'},
    {id:'cq2',q:'원뿔대의 부피를 구하려면 어떻게 계산할까요?',fig:()=>figFrustComp(6,3,8,4),choices:['큰 원뿔 부피 − 작은 원뿔 부피','(윗밑넓이+아랫밑넓이)×높이 ÷ 3'],ans:'큰 원뿔 부피 − 작은 원뿔 부피',hint:'자르기 전 큰 뿔에서 위쪽 뾰족한 작은 뿔을 빼요.',why:'맞아요! 큰 뿔 − 작은 뿔로 구해요.'},
    {id:'cq3',q:'뿔의 높이가 반지름 3 cm, 모선 5 cm, 수직 높이 4 cm로 주어졌을 때 부피 식에 넣는 높이는?',fig:()=>figConeNet(3,5),choices:['수직 높이 4 cm','모선 5 cm'],ans:'수직 높이 4 cm',hint:'부피는 바닥에서 꼭대기까지의 똑바른 높이를 써요.',why:'맞아요! 겉넓이는 모선, 부피는 수직 높이예요.'}
  ],
  firstGuide:[
    {id:'cfg1',tyNo:1,title:'유형 1 · 각뿔 부피 구하기',problem:'밑면이 <b>4 cm × 5 cm</b> 직사각형이고 높이가 <b>6 cm</b>인 사각뿔 부피는?',fig:figBoxCube,
      wantChips:['사각뿔 부피 (cm³)','사각뿔 겉넓이','모서리 수'],wantAns:'사각뿔 부피 (cm³)',wantHl:[],
      givenChips:[{k:'a',t:'밑넓이 4×5 = 20',ok:true},{k:'b',t:'높이 6 cm',ok:true},{k:'c',t:'뿔이라 ÷ 3',ok:true},{k:'t',t:'사다리꼴',ok:false}],
      teacherEq:'(4 × 5) × 6 ÷ 3 = 120 ÷ 3',pairQ:'식 마지막에 왜 <b>÷ 3</b>을 붙였나요?',pairChoices:['뿔의 부피는 같은 기둥의 1/3이라서','밑면 변이 3개라서'],pairAns:'뿔의 부피는 같은 기둥의 1/3이라서',
      calcPrompt:'120 ÷ 3 = ? (cm³)',calcAns:40,calcTopic:'div',calcExplain:'120 ÷ 3 = <b>40 cm³</b>예요.'},
    {id:'cfg2',tyNo:2,title:'유형 2 · 원뿔 부피 구하기',problem:'밑면 반지름 <b>3 cm</b>, 높이 <b>7 cm</b>인 원뿔 부피(kπ cm³)에서 k를 구하시오.',fig:()=>figConeNet(3,8),
      wantChips:['원뿔 부피 (π 앞 숫자)','원뿔 겉넓이','전개도 중심각'],wantAns:'원뿔 부피 (π 앞 숫자)',wantHl:[],
      givenChips:[{k:'a',t:'원 밑넓이 9π',ok:true},{k:'b',t:'높이 7 cm',ok:true},{k:'c',t:'÷ 3',ok:true},{k:'t',t:'× 2',ok:false}],
      teacherEq:'9π × 7 ÷ 3 = 3π × 7',pairQ:'계산에서 9를 먼저 3으로 약분하면 어떻게 편해지나요?',pairChoices:['3 × 7만 하면 돼서 쉬워요','답이 커져요'],pairAns:'3 × 7만 하면 돼서 쉬워요',
      calcPrompt:'3 × 7 = ? (π 앞 숫자)',calcAns:21,calcTopic:'fracbase',calcExplain:'9π × 7 ÷ 3 = <b>21π cm³</b>예요.'},
    {id:'cfg3',tyNo:4,title:'유형 4 · 원뿔대 부피 구하기',problem:'큰 원뿔(r=6, h=8)에서 위쪽 작은 원뿔(r=3, h=4)을 잘라 낸 원뿔대 부피(kπ cm³)는?',fig:()=>figFrustComp(6,3,8,4),
      wantChips:['원뿔대 부피 (π 앞 숫자)','작은 원뿔 부피만','겉넓이'],wantAns:'원뿔대 부피 (π 앞 숫자)',wantHl:[],
      givenChips:[{k:'a',t:'큰 원뿔 36π×8÷3 = 96π',ok:true},{k:'b',t:'작은 원뿔 9π×4÷3 = 12π',ok:true},{k:'t',t:'두 부피 더하기',ok:false}],
      teacherEq:'큰 원뿔 96π − 작은 원뿔 12π',pairQ:'왜 큰 원뿔에서 작은 원뿔을 <b>뺐나요</b>?',pairChoices:['위쪽 작은 원뿔을 잘라 내고 남은 입체라서','작은 뿔이 아래에 있어서'],pairAns:'위쪽 작은 원뿔을 잘라 내고 남은 입체라서',
      calcPrompt:'96 − 12 = ? (π 앞 숫자)',calcAns:84,calcTopic:'sub',calcExplain:'96π − 12π = <b>84π cm³</b>예요.'}
  ],
  stratRows:[
    ['각뿔·원뿔 부피','(밑넓이 × 높이) ÷ 3','÷ 3 전 먼저 약분하면 훨씬 쉬워요'],
    ['부피 → 높이 역산','부피 × 3 → ÷ 밑넓이','원기둥 부피로 되돌린 뒤 밑넓이로 나누기'],
    ['뿔대 부피','큰 뿔 − 작은 뿔','각각 (밑넓이×높이÷3) 구해서 빼기']
  ],
  worked:{
    1:{no:1,nm:'각뿔의 부피',prob:'사각뿔·삼각뿔 부피 구하기',fig:figBoxCube,steps:[{t:'① 밑넓이',hl:[],body:'삼각형이면 ÷ 2 먼저!'},{t:'② × 높이',hl:[],body:'기둥 부피 계산'},{t:'③ ÷ 3',hl:[],body:'뿔이므로 반드시 ÷ 3!'}],pitfall:'⚠️ 삼각뿔에서 밑넓이 ÷ 2와 뿔 ÷ 3 둘 다 빠뜨리지 마세요!'},
    2:{no:2,nm:'원뿔의 부피',prob:'원뿔의 부피 구하기',fig:()=>figConeNet(3,5),steps:[{t:'① 원 밑넓이 r²π',hl:[],body:'반둘레 × 반지름'},{t:'② × 높이 ÷ 3',hl:[],body:'먼저 3으로 약분하면 계산이 간단해요.'},{t:'③ π 확인',hl:[],body:'계수 뒤에 π 붙이기'}],pitfall:'⚠️ 반지름 자리에 지름을 그대로 넣는 실수 주의!'},
    3:{no:3,nm:'뿔 높이 거꾸로 구하기',prob:'부피를 알 때 뿔의 높이 구하기',fig:()=>figConeNet(3,5),steps:[{t:'① × 3 해서 기둥으로',hl:[],body:'뿔 부피 × 3 = 같은 밑면 기둥 부피'},{t:'② ÷ 밑넓이',hl:[],body:'기둥 부피 ÷ 밑넓이 = 높이'},{t:'③ 검산',hl:[],body:'밑넓이 × 높이 ÷ 3 확인'}],pitfall:'⚠️ 3을 안 곱하고 바로 밑넓이로 나누면 답이 1/3로 작게 나와요!'},
    4:{no:4,nm:'뿔대의 부피',prob:'원뿔대·사각뿔대의 부피 구하기',fig:()=>figFrustComp(6,3,8,4),steps:[{t:'① 큰 뿔 부피',hl:[],body:'전체 반지름·전체 높이 사용'},{t:'② 작은 뿔 부피',hl:[],body:'잘린 위쪽 작은 뿔 계산'},{t:'③ 큰 뿔 − 작은 뿔',hl:[],body:'두 부피를 빼서 답 구하기'}],pitfall:'⚠️ 큰 뿔 높이는 "원뿔대 높이 + 위쪽 작은 높이" 전체예요!'}
  },
  compoundList:[
    {id:'C1',nm:'복합 ① · 원뿔 잔 vs 원기둥 잔 용량 비교',sub:'같은 높이·다른 지름일 때 부피 차 비교'},
    {id:'C2',nm:'복합 ② · 사다리꼴 회전체의 부피',sub:'원기둥+원뿔 또는 큰 원뿔−작은 원뿔로 부피 계산'},
    {id:'C3',nm:'복합 ③ · 잘라 낸 원뿔 · 정육면체 치즈 무게',sub:'원뿔에서 90° 잘라 남기기 / 정육면체에서 삼각뿔 절단'}
  ],
  genCompound:{
    C1:seed=>{
      const r=(seed*1664525+1013904223)>>>0,dCone=pick_(r,[6,12]),dCyl=dCone===12?8:4,h=pick_(r,[6,9,12]);
      const r1=dCone/2,r2=dCyl/2,vCone=r1*r1*h/3,vCyl=r2*r2*h,diff=Math.abs(vCyl-vCone);
      return{id:'C1',combo:[2,3],comboWhy:'① 지름→반지름으로 원뿔·원기둥 부피를 각각 구하고(유형 2) → ② 두 잔의 차이 비교(유형 3)',ptype:'cone:c1',
        title:`밑면 지름 <b>${dCone} cm</b>, 높이 <b>${h} cm</b>인 원뿔 잔과 밑면 지름 <b>${dCyl} cm</b>, 높이 <b>${h} cm</b>인 원기둥 잔 부피의 <b>차</b>를 구하시오.`,
        fig:{svg:()=>figFrustComp(r1,r2,h,Math.round(h/2))},finalQ:'두 잔 부피의 차는 몇 cm³인가요?',
        steps:[
          {tag:'1단계 · 원뿔 잔 부피 (반지름 '+r1+')',q:`${r1*r1}π × ${h} ÷ 3 = ?`,type:'pi',ans:vCone,suffix:'cm³',hint:`지름 ${dCone}의 반지름은 ${r1} cm`},
          {tag:'2단계 · 원기둥 잔 부피 (반지름 '+r2+')',q:`${r2*r2}π × ${h} = ?`,type:'pi',ans:vCyl,suffix:'cm³',hint:`지름 ${dCyl}의 반지름은 ${r2} cm`},
          {tag:'3단계 · 부피 차 구하기',q:`|${vCyl}π − ${vCone}π| = ?`,type:'pi',ans:diff,suffix:'cm³',hint:`큰 쪽에서 작은 쪽 빼기`,ok:`부피 차는 ${diff}π cm³예요!`}
        ]};
    },
    C2:seed=>{
      const r=(seed*22695477+1)>>>0,specs=[[6,3,8,4],[6,3,6,3],[9,3,6,2]];
      const [R,rr,Hb,Hc]=specs[r%specs.length],vB=R*R*Hb/3,vC=rr*rr*Hc/3,ans=vB-vC;
      return{id:'C2',combo:[2,4],comboWhy:'① 큰 원뿔·작은 원뿔을 각각 구하고(유형 2) → ② 뿔대 부피 빼기(유형 4)',ptype:'cone:c2',
        title:`아랫변 ${R} cm, 윗변 ${rr} cm, 높이 ${Hb-Hc} cm인 직각사다리꼴을 1회전 시킨 원뿔대(전체 높이 ${Hb}, 위 잘린 높이 ${Hc})의 <b>부피</b>를 구하시오.`,
        fig:{svg:()=>figFrustComp(R,rr,Hb,Hc)},finalQ:'회전체의 부피는 몇 cm³인가요?',
        steps:[
          {tag:'1단계 · 큰 원뿔 부피',q:`반지름 ${R}, 전체 높이 ${Hb} 원뿔 부피 = ?`,type:'pi',ans:vB,suffix:'cm³',hint:`${R*R} × ${Hb} ÷ 3π`},
          {tag:'2단계 · 위쪽 작은 원뿔 빼기',q:`${vB}π − (${rr*rr}π×${Hc}÷3 = ${vC}π) = ?`,type:'pi',ans:ans,suffix:'cm³',hint:`${vB} − ${vC}π`,ok:`${ans}π cm³`}
        ]};
    },
    C3:seed=>{
      const r=(seed*1103515245+12345)>>>0,a=[3,6][r%2],vCube=a*a*a,vPyr=vCube/6,rem=vCube-vPyr;
      return{id:'C3',combo:[1,4],comboWhy:'① 삼각뿔 절단 부피를 구하고(유형 1) → ② 전체 정육면체에서 빼기(유형 4)',ptype:'cone:c3',
        title:`한 모서리가 <b>${a} cm</b>인 정육면체 모양의 치즈에서 세 모서리의 중점이 아니라 꼭짓점을 그대로 지나는 삼각뿔 모양(${a}×${a}÷2×${a}÷3)을 잘라 내었어요. <b>남은 치즈의 부피</b>를 구하시오.`,
        fig:{svg:figBoxCube},finalQ:'남은 치즈의 부피는 몇 cm³인가요?',
        steps:[
          {tag:'1단계 · 정육면체 전체 부피',q:`${a} × ${a} × ${a} = ?`,type:'num',ans:vCube,suffix:'cm³',hint:`${a*a} × ${a}`},
          {tag:'2단계 · 잘라 낸 삼각뿔 부피 (전체 ÷ 6)',q:`삼각뿔 부피 = (${a}×${a}÷2) × ${a} ÷ 3 = ?`,type:'num',ans:vPyr,suffix:'cm³',hint:`${vCube} ÷ 6`},
          {tag:'3단계 · 남은 치즈 부피',q:`${vCube} − ${vPyr} = ?`,type:'num',ans:rem,suffix:'cm³',hint:`${vCube} − ${vPyr}`,ok:`${rem} cm³`}
        ]};
    }
  },
  t3PracticeCids:['C1','C2']
});

function ri_(r,a,b){return a+(r%(b-a+1))}
function pick_(r,arr){return arr[r%arr.length]}
})();