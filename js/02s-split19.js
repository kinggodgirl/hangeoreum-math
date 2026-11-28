/* [T35] 15차시 → 19차시 나누기: 옛 학생 기록을 새 차시로 옮겨요 (한 번만, 원본은 DB._split19.bak에 보관).
   - prop·inv: 유형 3·4(그래프) → propg·invg 유형 1·2
   - area: 유형 2(원기둥) → area2 유형 1, 유형 3(L자 기둥) → area 유형 2
   - conearea: 유형 2·3·4(원뿔·전개도·뿔대) → conearea2 유형 1·2·3
   앞 차시(옛 id)에는 남는 유형만 번호를 다시 매겨 두고, 새 차시에는 옮긴 유형 + 차시 진도(개념·유형·마무리·걸음)를 그대로 복사해요.
   학생 기기(불러올 때), 서버에서 받은 기록(학생 동기화·교사 화면) 모두 같은 함수를 거쳐요.
   빈 기록에도 표시(_split19)를 달아, 새 19차시 기록이 다시 옮겨지지 않게 해요. */
(()=>{
'use strict';
const SPLIT={
  prop:{to:'propg',keep:{1:1,2:2},move:{3:1,4:2},cids:['C2','C3']},
  inv:{to:'invg',keep:{1:1,2:2},move:{3:1,4:2},cids:['C2','C3']},
  area:{to:'area2',keep:{1:1,3:2},move:{2:1},cids:['C1']},
  conearea:{to:'conearea2',keep:{1:1},move:{2:1,3:2,4:3},cids:['C1','C3']}
};
const TYPE_MAPS=['t1Solo','tyS'];          /* 키가 유형 번호(1, 2, …)인 기록 */
const LESSON_ONLY=['metaLog'];              /* 새 차시로 복사하지 않는 큰 기록 */
const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const clone=v=>JSON.parse(JSON.stringify(v));
const tk=(lid,no)=>`ty_${lid}_${no}`;

function splitLesson(o,S){
  const keep={},moved={};
  for(const k in o){
    if(LESSON_ONLY.includes(k)){keep[k]=o[k];continue}
    if(k==='rev'&&isObj(o.rev)){
      const a={},b={};
      for(const rk in o.rev){const n=+String(rk).replace(/^ty/,'');
        if(S.move[n])b['ty'+S.move[n]]=o.rev[rk];else if(S.keep[n])a['ty'+S.keep[n]]=o.rev[rk];else a[rk]=o.rev[rk]}
      keep.rev=a;moved.rev=b;continue}
    if(TYPE_MAPS.includes(k)&&isObj(o[k])){
      const a={},b={};
      for(const n in o[k]){if(S.move[n])b[S.move[n]]=o[k][n];else if(S.keep[n])a[S.keep[n]]=o[k][n];else a[n]=o[k][n]}
      keep[k]=a;moved[k]=b;continue}
    keep[k]=o[k];moved[k]=clone(o[k]);
  }
  return{keep,moved};
}

function remapKey(lid,g){   /* 생성기 키(ty_prop_3 등) → [새 차시, 새 키] */
  const S=SPLIT[lid];if(!S)return null;
  const m=/^ty_([a-z0-9]+)_(\d+)$/.exec(String(g||''));
  if(m&&m[1]===lid){const n=+m[2];if(S.move[n])return[S.to,tk(S.to,S.move[n])];if(S.keep[n])return[lid,tk(lid,S.keep[n])]}
  if(typeof LESSON_OF==='object'&&LESSON_OF&&LESSON_OF[g]&&LESSON_OF[g]!==lid)return[LESSON_OF[g],g];
  return null;
}

function migrate(d){
  if(!isObj(d)||d._split19)return false;
  let touched=false;const bak={};
  for(const lid in SPLIT){
    const S=SPLIT[lid],o=d[lid];
    if(!isObj(o))continue;
    bak[lid]=clone(o);
    const{keep,moved}=splitLesson(o,S);
    d[lid]=keep;
    if(!isObj(d[S.to]))d[S.to]=moved;
    touched=true;
  }
  if(Array.isArray(d._rev))d._rev.forEach(x=>{
    if(!isObj(x)||!SPLIT[x.lid])return;
    const r=remapKey(x.lid,x.g);if(r){x.lid=r[0];x.g=r[1];touched=true}
  });
  const M=isObj(d._raid)&&isObj(d._raid.miss)?d._raid.miss:null;
  if(M)for(const k of Object.keys(M)){
    const i=k.indexOf(':'),lid=k.slice(0,i),key=k.slice(i+1),S=SPLIT[lid];if(!S)continue;
    let nk=null;const n=+key.replace(/^ty/,'');
    if(/^ty\d+$/.test(key))nk=S.move[n]?`${S.to}:ty${S.move[n]}`:S.keep[n]?`${lid}:ty${S.keep[n]}`:null;
    else if(S.cids.includes(key))nk=`${S.to}:${key}`;
    if(nk&&nk!==k){M[nk]=(+M[nk]||0)+(+M[k]||0);delete M[k];touched=true}
  }
  const t=typeof today==='function'?today():'';
  d._split19={v:1,d:t,bak:touched?bak:{}};
  return true;
}
window.HG_SPLIT19={migrate,SPLIT};

/* ① 이 기기 기록 */
if(typeof DB==='object'&&DB){const had=Object.keys(DB).some(k=>SPLIT[k]||k==='_rev');if(migrate(DB)&&had&&typeof save==='function')save()}
/* ② 로그인 등으로 기록을 다시 불러올 때 */
if(typeof loadDB==='function'){
  const prevLoad=loadDB;
  loadDB=function(){const r=prevLoad.apply(this,arguments);if(typeof DB==='object'&&DB)migrate(DB);return r};
}
/* ③ 서버에서 받은 기록(학생 동기화 hg_get_progress, 교사 화면 학생 목록) */
if(typeof API==='object'&&API&&typeof API.call==='function'){
  const prevCall=API.call.bind(API);
  API.call=async function(){
    const r=await prevCall(...arguments);
    try{
      if(isObj(r)){
        if(isObj(r.data))migrate(r.data);
        if(Array.isArray(r.students))r.students.forEach(s=>{if(isObj(s)&&isObj(s.data))migrate(s.data)});
      }else if(Array.isArray(r))r.forEach(s=>{if(isObj(s)&&isObj(s.data))migrate(s.data)});
    }catch(e){}
    return r;
  };
}
})();
