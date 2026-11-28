/* ───────── [T29] 학생용 '⚑ 이 문제 이상해요' 팝업 ─────────
   - 모든 학생: 문제 아래 작은 링크를 누르면 팝업이 떠요. 이유를 고르거나(선택) 무엇이 이상한지 적어서 보내요.
   - 보내는 곳: 기존 신고 함수 hg_report (supabase/report.sql, 서버 변경 없음).
     ctx 칸(400자)에 📍 위치·코드 보고(HG_LOC.format({compact:true}))를 담아요 → 교사 화면 '⚑ 학생 문제 신고'에서 보고 양식 그대로 보이고 복사돼요.
   - 01-core.js의 repMount를 이 파일이 바꿔 끼워요(renderProblem이 부르는 이름 그대로).
   - renderProblem을 쓰지 않는 화면(빠른 구별·구별 체크·첫걸음 마무리)은 HG_REPORT.mount(host, {lesson})로 붙여요.
   전역: window.HG_REPORT, repMount(덮어쓰기) */
(()=>{
'use strict';

const WHY=(typeof REP_WHY!=='undefined'&&Array.isArray(REP_WHY))?REP_WHY:['정답이 이상해요','그림이 이상해요','문제가 이해 안 돼요','기타'];
const CTX_MAX=400,NOTE_MAX=200;
const escH=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* 위치·코드 보고(짧은 판). 400자를 넘으면 문제 글부터 줄여요. */
function buildCtx(prob,rep,cur){
  let lines=[];
  try{
    if(typeof HG_LOC!=='undefined'&&HG_LOC.format){
      if(rep&&(rep.gen||rep.seed!=null)&&HG_LOC.setProb){
        const steps=prob&&Array.isArray(prob.steps)?prob.steps:[];const i=Math.max(0,Math.min(Number(cur)||0,Math.max(0,steps.length-1)));const st=steps[i];
        const old=HG_LOC.get().prob,same=old&&old.gen===rep.gen&&old.seed===rep.seed;
        if(!same)HG_LOC.setProb({lesson:rep.lesson,gen:rep.gen,seed:rep.seed,ptype:prob&&prob.ptype,mode:steps.length>1?'steps':'final',step:i,totalSteps:steps.length||1,stepTag:st&&st.tag,title:prob&&prob.title});
      }
      lines=HG_LOC.format({compact:true}).split('\n');
    }
  }catch(e){lines=[]}
  if(!lines.length)return null;
  const w=typeof innerWidth==='number'?innerWidth:0;
  if(w)lines.push(`• 화면: 폭 ${w}px${w<=760?'(휴대폰)':''}`);
  let out=lines.join('\n');
  if(out.length>CTX_MAX){const qi=lines.findIndex(x=>x.startsWith('• 문제 글:'));if(qi>=0){const over=out.length-CTX_MAX;lines[qi]=lines[qi].slice(0,Math.max(12,lines[qi].length-over-1))+'…';out=lines.join('\n')}}
  if(out.length>CTX_MAX)out=lines.filter(x=>!x.startsWith('• 화면:')).join('\n');
  return out.slice(0,CTX_MAX);
}

function ensureStyle(){
  if(typeof document!=='object'||!document||!document.getElementById||document.getElementById('hgRepStyle'))return;
  const st=document.createElement('style');st.id='hgRepStyle';
  st.textContent=`.hgrep-back{position:fixed;inset:0;z-index:80;background:rgba(29,38,64,.45);display:flex;align-items:center;justify-content:center;padding:16px}
.hgrep-pop{background:var(--paper,#fff);color:var(--ink,#1d2640);border-radius:16px;max-width:420px;width:100%;padding:18px 18px 14px;box-shadow:0 12px 36px rgba(29,38,64,.3);max-height:calc(100vh - 32px);overflow:auto}
.hgrep-pop h3{margin:0 0 4px;font-size:18px}.hgrep-pop .muted{font-size:13px}
.hgrep-pop .chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 8px}
.hgrep-pop textarea{width:100%;box-sizing:border-box;min-height:84px;font:inherit;font-size:15px;padding:10px;border:1.5px solid var(--line,#d5dbe8);border-radius:10px;resize:vertical}
.hgrep-pop .hgrep-cnt{text-align:right;font-size:12px;color:var(--muted,#888);margin-top:2px}
.hgrep-pop .hgrep-act{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}
.hgrep-ok{text-align:center;padding:8px 0}.hgrep-ok .big{font-size:34px}`;
  (document.head||document.body).appendChild(st);
}

/* 팝업 열기. send(reason, note) → Promise. */
function openPopup(send){
  ensureStyle();
  const back=el(`<div class="hgrep-back" role="dialog" aria-modal="true" aria-label="문제 신고"><div class="hgrep-pop">
    <h3>⚑ 이 문제, 어디가 이상한가요?</h3>
    <div class="muted">적어 준 내용은 지금 보고 있는 화면 위치와 함께 선생님께 전달돼요.</div>
    <div class="chips">${WHY.map(w=>`<button type="button" class="chip hgrep-w">${escH(w)}</button>`).join('')}</div>
    <textarea class="hgrep-note" maxlength="${NOTE_MAX}" placeholder="무엇이 이상한지 적어 주세요. 예) 정답을 골랐는데 틀렸다고 나와요."></textarea>
    <div class="hgrep-cnt"><span class="hgrep-n">0</span> / ${NOTE_MAX}</div>
    <div class="hgrep-act"><button type="button" class="btn ghost t-mini hgrep-x">취소</button><button type="button" class="btn primary t-mini hgrep-send" disabled>선생님께 보내기</button></div>
  </div></div>`);
  document.body.appendChild(back);
  const pop=$('.hgrep-pop',back),ta=$('.hgrep-note',back),sendB=$('.hgrep-send',back);let why=null;
  const close=()=>{back.remove();document.removeEventListener('keydown',onKey);removeEventListener('hashchange',close)};
  const onKey=e=>{if(e.key==='Escape')close()};
  document.addEventListener('keydown',onKey);addEventListener('hashchange',close);
  const upd=()=>{const n=ta.value.trim().length;$('.hgrep-n',back).textContent=ta.value.length;sendB.disabled=!(why||n>=2)};
  $$('.hgrep-w',back).forEach(b=>b.onclick=()=>{why=why===b.textContent?null:b.textContent;$$('.hgrep-w',back).forEach(x=>x.classList.toggle('on',x.textContent===why));upd();ta.focus()});
  ta.oninput=upd;
  $('.hgrep-x',back).onclick=close;
  back.onclick=e=>{if(e.target===back)close()};
  sendB.onclick=async()=>{
    sendB.disabled=true;sendB.textContent='보내는 중…';
    const note=ta.value.trim().slice(0,NOTE_MAX);
    const reason=(why||(note?'직접 적었어요':'기타')).slice(0,30);
    let msg;
    try{await send(reason,note||null);msg='<div class="big">💌</div><b>고마워요! 선생님께 전달했어요.</b><div class="muted" style="margin-top:4px">이 문제는 넘어가도 괜찮아요.</div>'}
    catch(e){if(typeof isAuthErr==='function'&&isAuthErr(e)&&typeof authExpired==='function')authExpired();
      msg=(typeof isMissingFn==='function'&&isMissingFn(e))?'아직 신고를 받을 준비가 안 됐어요. 선생님께 말로 알려 주세요.':'보내지 못했어요. 잠시 뒤에 다시 해 주세요.'}
    pop.innerHTML=`<div class="hgrep-ok">${msg}</div><div class="hgrep-act" style="justify-content:center"><button type="button" class="btn primary t-mini hgrep-x">닫기</button></div>`;
    $('.hgrep-x',pop).onclick=close;
  };
  setTimeout(()=>{try{ta.focus()}catch(e){}},30);
  return back;
}

/* ctx는 팝업을 여는 순간 찍어 둬요(빠른 구별은 맞히면 저절로 다음 그림으로 넘어가서). */
function sendReport(prob,rep,cur,reason,note,root,ctx){
  const fallback=()=>{try{return typeof repCtx==='function'&&root?repCtx(root,cur):null}catch(e){return null}};
  return API.call('hg_report',{p_token:typeof isStudent==='function'&&isStudent()?AUTH.token:null,p_lesson:String(rep&&rep.lesson||'etc').slice(0,20),
    p_gen:rep&&rep.gen||null,p_seed:rep&&rep.seed!=null?rep.seed:null,p_ptype:prob&&prob.ptype||null,p_step:Number(cur)||0,
    p_reason:reason,p_note:note,p_ctx:ctx||fallback()});
}

const btnRow=()=>el(`<div class="rep-row"><button type="button" class="rep-btn">⚑ 이 문제 이상해요</button></div>`);

/* renderProblem 안의 신고 버튼(01-core.js repMount를 바꿔 끼워요) */
function repMountPopup(root,prob,rep,getCur){
  const row=btnRow();root.appendChild(row);
  $('.rep-btn',row).onclick=()=>{const cur=typeof getCur==='function'?getCur():0,ctx=buildCtx(prob,rep,cur);openPopup((r,n)=>sendReport(prob,rep,cur,r,n,root,ctx))};
}

/* renderProblem을 쓰지 않는 화면: 빠른 구별 · 구별 체크 · 첫걸음 마무리 */
function mount(host,rep){
  if(!host||!host.appendChild)return;
  const old=host.querySelector&&host.querySelector(':scope > .rep-row.hgrep-free');if(old)old.remove();
  const row=btnRow();row.classList.add('hgrep-free');host.appendChild(row);
  $('.rep-btn',row).onclick=()=>{const ctx=buildCtx(null,rep||{},0);openPopup((r,n)=>sendReport(null,rep||{},0,r,n,null,ctx))};
}

if(typeof repMount==='function'){window.repMount=repMountPopup;repMount=repMountPopup}
window.HG_REPORT={mount,open:openPopup,buildCtx};
})();
