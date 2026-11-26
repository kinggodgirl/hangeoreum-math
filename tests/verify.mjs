import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsFiles = [
  'js/01-core.js',
  'js/02-unit-solid.js',
  'js/03-teacher.js',
  'js/04-games.js',
  'js/04s-sea.js',
  'js/05-calc.js',
  'js/06-unit-int.js',
  'js/06c-unit-circle.js',
  'js/02c-concept-plus.js',
  'js/02r-solid-rot.js',
  'js/02v-solid-vol.js',
  'js/06d-unit-graph.js',
  'js/06g-goal.js',
  'js/02t-track-engine.js',
  'js/02t-tracks-cent.js',
  'js/02t-tracks-circle.js',
  'js/02t-tracks-solid.js',
  'js/02t-tracks-graph.js',
  'js/07-print-omr-boot.js',
];

// 1. Syntax check every split JS file individually
for (const rel of jsFiles) {
  execFileSync(process.execPath, ['--check', path.join(root, rel)], { stdio: 'inherit' });
}
// 꾸미기(08-deco.js)는 화면에만 붙는 모듈이라 문법만 검사해요
execFileSync(process.execPath, ['--check', path.join(root, 'js/08-deco.js')], { stdio: 'inherit' });
console.log(`✓ Syntax check passed for all ${jsFiles.length} JS modules`);

// 2. Load all modules in exact index.html order inside a Node VM
const store = {};
const mkEl = (tag = 'div') => {
  let _html = '', _text = '';
  return {
    tagName: tag.toUpperCase(),
    style: { setProperty() {}, removeProperty() {} },
    dataset: {}, children: [],
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return ''; },
    appendChild(c) { this.children.push(c); return c; },
    append(...cs) { cs.forEach(c => this.children.push(c)); },
    prepend(c) { this.children.unshift(c); },
    insertAdjacentHTML() {},
    querySelector() { return mkEl(); },
    querySelectorAll() { return []; },
    addEventListener() {}, removeEventListener() {},
    getContext() { return new Proxy({}, { get: () => () => {} }); },
    focus() {}, remove() {},
    get content() { return { firstElementChild: mkEl() }; },
    get innerHTML() { return _html; },
    set innerHTML(v) { _html = String(v); _text = _html.replace(/<[^>]+>/g, ''); },
    get textContent() { return _text; },
    set textContent(v) { _text = String(v); _html = _text; },
    value: '', hidden: false,
  };
};

const sandbox = {
  console, Math, Date, JSON, Number, String, Array, Object, Set, Map, RegExp, Error, Promise, parseFloat, parseInt, isFinite, isNaN,
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  requestAnimationFrame: () => 0, performance: { now: () => Date.now() },
  localStorage: {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
  },
  location: { hash: '#calc', replace() {}, href: 'https://kinggodgirl.github.io/hangeoreum-math/' },
  history: { replaceState() {} },
  matchMedia: () => ({ matches: false }),
  navigator: { clipboard: { writeText: async () => {} } },
  addEventListener() {}, removeEventListener() {}, scrollTo() {},
  document: {
    body: mkEl('body'), documentElement: mkEl('html'), visibilityState: 'visible',
    addEventListener() {}, removeEventListener() {},
    createElement: tag => mkEl(tag),
    querySelector: () => mkEl(), querySelectorAll: () => [], getElementById: () => mkEl(),
  },
  URL: { createObjectURL: () => '', revokeObjectURL() {} },
  Blob: function () {}, Image: function () {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

for (const rel of jsFiles) {
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  vm.runInContext(code, sandbox, { filename: rel });
}
vm.runInContext(
  'window.__T={GEN,PTYPES,LESSONS,tyKey,CALC,CALC_FOR,DIAG,KEYS,LINKS,EXAM_FOCUS,CALC_PRE,mulberry,check,diagnose,sgnTxt,drillPlan,recordCalcErr,dataSummary,DB,repMount,viewTeacher,PV_CARDS,PREVIEW,TERMS,CONCEPT,CONCEPT_QUIZ:window.CONCEPT_QUIZ,CONCEPT_PILOT:window.CONCEPT_PILOT,_cpSectorCalc:window._cpSectorCalc,CENT_T08:window.CENT_T08,HG_TRACKS:window.HG_TRACKS,lessonTrackDone:window.lessonTrackDone,viewLesson,viewDailyRev:window.viewDailyRev,omrBits,omrUnbits,today,addDays};',
  sandbox
);

const { GEN, PTYPES, LESSONS, tyKey, CALC, CALC_FOR, DIAG, KEYS, LINKS, EXAM_FOCUS, CALC_PRE, mulberry, check, diagnose, sgnTxt, drillPlan, recordCalcErr, dataSummary, DB, repMount, viewTeacher, PV_CARDS, PREVIEW, TERMS, CONCEPT, CONCEPT_QUIZ, CONCEPT_PILOT, _cpSectorCalc, CENT_T08, HG_TRACKS, lessonTrackDone, viewLesson, viewDailyRev, omrBits, omrUnbits, today, addDays } = sandbox.__T;
const errors = [];
const r = mulberry(12345);

if (typeof repMount !== 'function') errors.push('Missing repMount (problem report feature)');
if (typeof viewTeacher !== 'function') errors.push('Missing viewTeacher');

let totalProbs = 0;
for (const T of CALC) {
  if (!KEYS[T.id]) errors.push(`Missing KEYS for ${T.id}`);
  if (!LINKS[T.id]) errors.push(`Missing LINKS for ${T.id}`);
  for (let L = 1; L <= (T.lv || CALC_LV).length; L++) {
    for (let k = 0; k < 30; k++) {
      totalProbs++;
      const q = T.gen(L, r);
      if (!q || !q.q || q.ans === undefined || Number.isNaN(q.ans)) { errors.push(`Bad gen: ${T.id} L${L}`); break; }
      if (!q.steps || !q.steps.length) { errors.push(`Missing steps: ${T.id} L${L}`); break; }
      const ansStr = q.type === 'pi' ? (q.ans === 1 ? 'π' : q.ans + 'π') : q.type === 'sn' ? (q.ansText || sgnTxt(q.ans)) : String(q.ans);
      if (check({ type: q.type || 'num', ans: q.ans }, ansStr) !== true) { errors.push(`check() failed: ${T.id} L${L}`); break; }
      if (q.errs && q.errs.length) {
        const e0 = q.errs[0];
        if (Math.abs(e0.a - q.ans) > 1e-9) {
          const wrongStr = q.type === 'pi' ? (e0.a + 'π') : String(e0.a).replace('-', '−');
          if (!diagnose(q, wrongStr)) { errors.push(`diagnose() missed: ${T.id} L${L}`); break; }
        }
      }
    }
  }
}

const d5 = drillPlan(mulberry(42), 5);
const d10 = drillPlan(mulberry(42), 10);
if (d5.Q.filter(q => !q.extra).length !== 5) errors.push('drillPlan(5) count mismatch');
if (d10.Q.filter(q => !q.extra).length !== 10) errors.push('drillPlan(10) count mismatch');
if (!d5.Q.some(q => EXAM_FOCUS.includes(q.tid))) errors.push('drillPlan(5) missing EXAM_FOCUS topics');
// 연결맵: 모든 칸에 바탕 목록이 있고, 없는 칸을 가리키지 않으며, 순환이 없어야 해요
{ const ids = new Set(CALC.map(t => t.id)), seen = {}, visit = (id, path) => { if (seen[id] === 2) return; if (seen[id] === 1) { errors.push('CALC_PRE cycle: ' + path.join('→')); return; } seen[id] = 1; (CALC_PRE[id] || []).forEach(p => visit(p, [...path, p])); seen[id] = 2; };
  CALC.forEach(t => { if (!CALC_PRE[t.id]) errors.push('CALC_PRE missing ' + t.id); });
  Object.entries(CALC_PRE).forEach(([k, v]) => { if (!ids.has(k)) errors.push('CALC_PRE unknown ' + k); v.forEach(p => { if (!ids.has(p)) errors.push(`CALC_PRE ${k} → unknown ${p}`); }); });
  CALC.forEach(t => visit(t.id, [t.id])); }

recordCalcErr('signed', '부호가 반대예요.');
const ds = dataSummary(DB);
if (!ds.calcErrs.length) errors.push('dataSummary calcErrs failed');

const checkStep = st => {
  if (!st || !st.q) return false;
  if (st.type === 'choice') return Array.isArray(st.choices) && st.choices.includes(st.ans) && new Set(st.choices).size === st.choices.length;
  if (!Number.isFinite(st.ans)) return false;
  const a = st.type === 'pi' ? (st.ans === 1 ? 'π' : st.ans + 'π') : st.type === 'sn' ? (st.ansText || sgnTxt(st.ans)) : String(st.ans);
  return check(st, a) === true;
};

// 원과 부채꼴: 모든 유형 생성기가 문제를 만들고, 단계마다 정답이 check()를 통과하는지
let circleProbs = 0;
for (const lid of ['arc', 'cent', 'sector']) {
  if (!LESSONS.some(l => l.id === lid)) errors.push(`Missing lesson ${lid}`);
  for (const T of PTYPES[lid] || []) {
    for (let sd = 1; sd <= 60; sd++) {
      circleProbs++;
      const P = GEN[tyKey(lid, T.no)](sd);
      if (!P || !P.steps || !P.steps.length || !T.pt.includes(P.ptype)) { errors.push(`Bad circle gen: ${lid} 유형 ${T.no}`); break; }
      if (P.fig && P.fig.svg && !/<svg/.test(P.fig.svg(true, 0) + P.fig.svg(false, 0))) { errors.push(`Bad circle fig: ${lid} 유형 ${T.no}`); break; }
      const bad = P.steps.find(st => !checkStep(st));
      if (bad) { errors.push(`Circle step answer fails: ${lid} 유형 ${T.no} seed ${sd}: ${bad.q}`); break; }
    }
  }
}

// 입체도형 · 좌표평면과 그래프: 시험 범위 15차시 전체 문제 생성과 단계 정답 검증
const ALL_EXAM_LESSONS = ['arc', 'cent', 'sector', 'poly', 'regular', 'rotation', 'rotprop', 'area', 'volume', 'conearea', 'cone', 'coord', 'graph', 'prop', 'inv'];
let solidProbs = 0;
{
  const calcIdSet = new Set(CALC.map(c => c.id));
  for (const lid of ALL_EXAM_LESSONS) {
    if (!LESSONS.some(l => l.id === lid && l.ready)) errors.push(`Missing ready lesson ${lid}`);
    for (const cid of (CALC_FOR[lid] || [])) if (!calcIdSet.has(cid)) errors.push(`Bad CALC_FOR[${lid}]: ${cid}`);
    for (const T of PTYPES[lid] || []) {
      for (const sd of [...Array.from({ length: 40 }, (_, i) => i + 1), 0x80000001, 0x7fffffff]) {
        solidProbs++;
        const P = GEN[tyKey(lid, T.no)](sd);
        if (!P || !P.steps || !P.steps.length || !T.pt.includes(P.ptype)) { errors.push(`Bad gen: ${lid} 유형 ${T.no} (${P && P.ptype})`); break; }
        const bad = P.steps.find(st => !checkStep(st)) || (P.final && !checkStep(P.final) ? P.final : null);
        if (bad) { errors.push(`Step answer fails: ${lid} 유형 ${T.no} seed ${sd}: ${bad.q}`); break; }
        const fin = P.final || P.steps[P.steps.length - 1];
        if (fin.type !== 'choice' && Math.abs(fin.ans) > 999) { errors.push(`Answer > 999: ${lid} 유형 ${T.no} seed ${sd}: ${fin.ans}`); break; }
      }
    }
  }
  const u4 = omrUnbits(omrBits(['coord', 'graph', 'prop', 'inv'], 8, 2468));
  if (!u4 || u4.n !== 8 || u4.seed !== 2468 || u4.lids.join(',') !== 'coord,graph,prop,inv') errors.push(`OMR v3 round-trip failed: ${JSON.stringify(u4)}`);
  const u6 = omrUnbits(omrBits(['arc', 'cent', 'sector'], 6, 1234));
  if (!u6 || u6.n !== 6 || u6.seed !== 1234 || u6.lids.join(',') !== 'arc,cent,sector') errors.push(`OMR v2 round-trip failed: ${JSON.stringify(u6)}`);
}
for (const genName of ['area', 'areaStep']) {
  for (let sd = 1; sd <= 40; sd++) {
    solidProbs++;
    const P = GEN[genName](sd);
    if (!P || !P.steps || !P.steps.length) { errors.push(`Bad solid gen: ${genName}`); break; }
    const bad = P.steps.find(st => !checkStep(st)) || (P.final && !checkStep(P.final) ? P.final : null);
    if (bad) { errors.push(`Solid ${genName} fails seed ${sd}: ${bad.q}`); break; }
  }
}

// 정수와 유리수: 열린 차시(sign · numline · abs · iadd · isub) 문제 생성과 단계 정답 검증
let intProbs = 0;
for (const lid of ['sign', 'numline', 'abs', 'iadd', 'isub']) {
  for (const genName of [lid, lid + 'Step']) {
    if (typeof GEN[genName] !== 'function') { errors.push(`Missing int gen: ${genName}`); continue; }
    for (let sd = 1; sd <= 40; sd++) {
      intProbs++;
      const P = GEN[genName](sd);
      if (!P || !P.steps || !P.steps.length) { errors.push(`Bad int gen: ${genName}`); break; }
      const bad = P.steps.find(st => !checkStep(st)) || (P.final && !checkStep(P.final) ? P.final : null);
      if (bad) { errors.push(`Int ${genName} fails seed ${sd}: ${bad.q}`); break; }
    }
  }
}

// 나의 길(06g-goal.js): 기록으로 추천하는 규칙과 교사 화면 요약
{
  const { goalRec, goalOf, GOALS } = vm.runInContext('({goalRec,goalOf,GOALS})', sandbox);
  const day = new Date().toISOString().slice(0, 10);
  const recK = d => (goalRec(d) || {}).k || null;
  if (GOALS.length !== 3) errors.push('GOALS should have 3 paths');
  if (recK({}) !== null) errors.push('goalRec: no diag should give null');
  if (recK({ _calcDiag: { d: day, res: { add: true, facts: false } } }) !== 'calc') errors.push('goalRec: weak facts → calc');
  if (recK({ _calcDiag: { d: day, res: { facts: false } }, _calc: { facts: { stars: 1 } } }) === 'calc') errors.push('goalRec: recovered facts should not stay calc');
  if (recK({ _calcDiag: { d: day, res: { add: true, facts: true, order: false } } }) !== 'base') errors.push('goalRec: weak order → base');
  const full = Object.fromEntries(EXAM_FOCUS.map(id => [id, { stars: 5 }]));
  if (recK({ _calcDiag: { d: day, res: { add: true } }, _calc: full }) !== 'up') errors.push('goalRec: exam stars → up');
  const G = goalOf({ _goal: { k: 'up', d: '2000-01-01', h: [['up', '2000-01-01']] }, _calcDiag: { d: day, res: { facts: false } } });
  if (!(G.k === 'up' && G.rec === 'calc' && G.diff && G.old)) errors.push('goalOf: mismatch/old flags wrong');
  if (!dataSummary({ _goal: { k: 'calc', d: day } }).goal) errors.push('dataSummary: missing goal');
}

// 개념 학습 보완(02c-concept-plus.js + T03/T04/T14): 15차시 미리 보기·그림 카드·용어·확인 퀴즈 검증
let conceptQuizCnt = 0;
for (const lid of ALL_EXAM_LESSONS) {
  const pv = PREVIEW[lid];
  if (!pv || !Array.isArray(pv.words) || !pv.words.length) errors.push(`Missing PREVIEW words for ${lid}`);
  const cards = PV_CARDS[lid];
  if (!Array.isArray(cards) || cards.length < 3) {
    errors.push(`PV_CARDS missing or <3 for ${lid}`);
  } else {
    cards.forEach((c, idx) => {
      const figs = c.figs();
      if (!Array.isArray(figs) || !figs.length) errors.push(`PV_CARDS.${lid}[${idx}] empty figs`);
    });
  }
  const qz = CONCEPT_QUIZ && CONCEPT_QUIZ[lid];
  if (!Array.isArray(qz) || qz.length < 3) {
    errors.push(`CONCEPT_QUIZ missing or <3 for ${lid}`);
  } else {
    qz.forEach((item, idx) => {
      conceptQuizCnt++;
      if (!item.q || !item.hint || !item.ok) errors.push(`CONCEPT_QUIZ.${lid}[${idx}] missing text`);
      if (!Array.isArray(item.choices) || new Set(item.choices).size !== item.choices.length || !item.choices.includes(item.ans)) {
        errors.push(`CONCEPT_QUIZ.${lid}[${idx}] invalid choices/ans`);
      }
    });
  }
  const cEl = mkEl(); CONCEPT[lid](cEl);
  if (/2πr²|2πrh/.test(cEl.innerHTML)) errors.push(`Forbidden 2πr formula in CONCEPT.${lid}`);
}
for (const w of ['원의 둘레', '원의 넓이', '면', '모서리', '꼭짓점', '부채꼴', '중심각', '활꼴']) {
  if (!TERMS[w] || !TERMS[w].b) errors.push(`Missing TERMS entry: ${w}`);
}

// 교육학적 보완 시범(T07): area·sector 개념 구성, 공식 통일, 계산 도우미 검증
{
  if (!Array.isArray(CONCEPT_PILOT) || !CONCEPT_PILOT.includes('area') || !CONCEPT_PILOT.includes('sector')) {
    errors.push('Missing CONCEPT_PILOT area/sector');
  }
  if (typeof _cpSectorCalc !== 'function') {
    errors.push('Missing _cpSectorCalc');
  } else {
    const s1 = _cpSectorCalc(6, 60);
    if (s1.arcText !== '2π' || s1.areaText !== '6π' || s1.exactDiv !== 6) errors.push(`_cpSectorCalc(6,60) bad: ${JSON.stringify(s1)}`);
    const s2 = _cpSectorCalc(6, 135);
    if (s2.arcText !== '9/2π' || s2.areaText !== '27/2π' || s2.frac !== '3/8') errors.push(`_cpSectorCalc(6,135) bad: ${JSON.stringify(s2)}`);
    const s3 = _cpSectorCalc(12, 90);
    if (s3.arcText !== '6π' || s3.areaText !== '36π' || s3.exactDiv !== 4) errors.push(`_cpSectorCalc(12,90) bad: ${JSON.stringify(s3)}`);
  }
  const elA = mkEl(); CONCEPT.area(elA);
  if (!elA.innerHTML.includes('cp-lab') || !elA.innerHTML.includes('cp-strat')) errors.push('CONCEPT.area missing pilot UI');
  if (/2πr²|2πrh/.test(elA.innerHTML)) errors.push('CONCEPT.area still has conflicting 2πr formula');
  const elS = mkEl(); CONCEPT.sector(elS);
  if (!elS.innerHTML.includes('cp-lab') || !elS.innerHTML.includes('cp-strat') || !/<svg/.test(elS.innerHTML)) {
    errors.push('CONCEPT.sector missing pilot UI or SVG');
  }
}

// T08: 교과서 한 걸음 3탭×3트랙 시범(cent) 검증
{
  if (!CENT_T08 || !Array.isArray(CENT_T08.SCHEMA_QS) || CENT_T08.SCHEMA_QS.length !== 4) {
    errors.push('Missing CENT_T08.SCHEMA_QS (expected 4 items)');
  } else {
    CENT_T08.SCHEMA_QS.forEach((q, idx) => {
      if (!q.q || !q.choices.includes(q.ans) || !/<svg/.test(q.fig())) {
        errors.push(`Invalid SCHEMA_QS[${idx}]`);
      }
    });
  }
  if (!CENT_T08 || !Array.isArray(CENT_T08.FIRST_GUIDE) || CENT_T08.FIRST_GUIDE.length !== 3) {
    errors.push('Missing CENT_T08.FIRST_GUIDE (expected 3 items)');
  } else {
    const calcIds = new Set(CALC.map(c => c.id));
    CENT_T08.FIRST_GUIDE.forEach((g, idx) => {
      if (!calcIds.has(g.calcTopic) || !/<svg/.test(g.fig([])) || !Number.isFinite(g.calcAns)) {
        errors.push(`Invalid FIRST_GUIDE[${idx}]`);
      }
    });
  }
  if (!CENT_T08 || !Array.isArray(CENT_T08.WORKED) || CENT_T08.WORKED.length < 5) {
    errors.push('Missing CENT_T08.WORKED (1..4)');
  } else {
    for (let i = 1; i <= 4; i++) {
      const w = CENT_T08.WORKED[i];
      if (!w || !Array.isArray(w.steps) || w.steps.length < 3 || !w.pitfall || !/<svg/.test(w.fig(w.steps[0].hl))) {
        errors.push(`Invalid WORKED[${i}]`);
      }
    }
  }
  if (!CENT_T08 || !CENT_T08.GEN_COMPOUND) {
    errors.push('Missing CENT_T08.GEN_COMPOUND');
  } else {
    for (const cid of ['C1', 'C2', 'C3']) {
      for (const sd of [...Array.from({ length: 40 }, (_, i) => i + 1), 0x80000001, 0x7fffffff, 1234567891]) {
        const P = CENT_T08.GEN_COMPOUND[cid](sd);
        if (!P || !Array.isArray(P.combo) || P.combo.length !== 2 || !P.fig || !/<svg/.test(P.fig.svg())) {
          errors.push(`Bad compound ${cid} seed ${sd}`); break;
        }
        const bad = P.steps.find(st => !checkStep(st));
        if (bad) {
          errors.push(`Compound ${cid} step fails seed ${sd}: ${bad.q}`); break;
        }
      }
    }
  }
  if (typeof lessonTrackDone !== 'function' || !HG_TRACKS) {
    errors.push('Missing lessonTrackDone or HG_TRACKS');
  } else {
    const prevCent = DB.cent;
    DB.cent = { concept: false, steps: 0, prac: { solved: 0 } };
    if (lessonTrackDone('cent') !== 0) errors.push('lessonTrackDone empty should be 0');
    DB.cent = { concept: true, steps: 1, prac: { solved: 0 } };
    if (lessonTrackDone('cent') !== 2) errors.push('lessonTrackDone legacy compat should be 2');
    DB.cent = { trackDone: 3, concept: true, steps: 1, prac: { solved: 5 } };
    if (lessonTrackDone('cent') !== 3) errors.push('lessonTrackDone explicit 3 failed');
    const calcIdSet = new Set(CALC.map(c => c.id));
    for (const lid of ALL_EXAM_LESSONS) {
      const sp = HG_TRACKS.specs[lid];
      if (!sp) { errors.push(`Missing HG_TRACKS spec: ${lid}`); continue; }
      if (!['concept', 'proc'].includes(sp.kind)) errors.push(`Bad spec.kind: ${lid}`);
      const scenes = typeof sp.owlScenes === 'function' ? sp.owlScenes() : sp.owlScenes;
      if (!Array.isArray(scenes) || scenes.length < 2 || !scenes.some(sc => sc.ask && sc.ask.choices.includes(sc.ask.ans))) {
        errors.push(`Invalid owlScenes for ${lid}`);
      }
      if (!Array.isArray(sp.schemaQs) || sp.schemaQs.length < 3 || sp.schemaQs.some(q => !q.choices.includes(q.ans) || !/<svg/.test(q.fig()))) {
        errors.push(`Invalid schemaQs for ${lid}`);
      }
      const R = sp.schemaRapid; if (R) for (let k = 0; k < R.kinds; k++) for (let s = 1; s <= 30; s++) { const it = R.make(k, k + R.kinds * s); if (!R.choices.includes(it.ans) || !/<svg/.test(it.fig) || !it.why) { errors.push(`[T19] Invalid schemaRapid for ${lid} kind ${k}`); break; } }
      if (['arc', 'cent', 'sector'].includes(lid)) { if (R && (R.check || []).some(k => k >= R.kinds)) errors.push(`[T20] bad schemaRapid.check ${lid}`); for (const q of (sp.t1Check || [])) if (q.choices.length < 4 || !q.choices.includes(q.ans)) errors.push(`[T20] t1Check needs 4+ choices ${lid}.${q.id}`); for (const cid of Object.keys(sp.genCompound || {})) for (let sd = 1; sd <= 20; sd++) for (const st of sp.genCompound[cid](sd).steps) if (st.type === 'choice' && st.choices.length < 4) { errors.push(`[T20] compound choice needs 4+ ${lid}.${cid}: ${st.q}`); sd = 99; break; } }
      if (!(sp.kind === 'concept' && Array.isArray(sp.firstGuide) && !sp.firstGuide.length) && (!Array.isArray(sp.firstGuide) || sp.firstGuide.length < 3 || sp.firstGuide.some(g => !calcIdSet.has(g.calcTopic) || !Number.isFinite(g.calcAns) || !/<svg/.test(g.fig([]))))) {
        errors.push(`Invalid firstGuide for ${lid}`);
      }
      for (const T of PTYPES[lid] || []) {
        const w = sp.worked && sp.worked[T.no];
        if (!w || !Array.isArray(w.steps) || w.steps.length < 3 || !w.pitfall || !/<svg/.test(w.fig(w.steps[0].hl))) {
          errors.push(`Invalid worked[${T.no}] for ${lid}`);
        }
      }
      const cids = Object.keys(sp.genCompound || {});
      if (cids.length < 2) errors.push(`Need >=2 compounds for ${lid}`);
      for (const cid of cids) {
        for (const sd of [...Array.from({ length: 30 }, (_, i) => i + 1), 0x80000001, 0x7fffffff]) {
          const P = sp.genCompound[cid](sd);
          if (!P || !Array.isArray(P.combo) || P.combo.length !== 2 || !P.fig || !/<svg/.test(P.fig.svg())) {
            errors.push(`Bad compound ${lid}.${cid} seed ${sd}`); break;
          }
          const bad = P.steps.find(st => !checkStep(st));
          if (bad) { errors.push(`Compound ${lid}.${cid} step fails seed ${sd}: ${bad.q}`); break; }
        }
      }
      for (const tr of [1, 2, 3]) {
        DB[lid] = { track: tr, concept: false, steps: 0, prac: { solved: 0 } };
        for (const tb of ['concept', 'steps', 'practice']) viewLesson(lid, tb);
      }
    }
    // [복습 추천] 이틀 연속 숙달 로직 검증
    const t0 = today(), t1 = addDays(t0, 1);
    DB.sector = { concept: true, steps: 1, prac: { solved: 5 } };
    HG_TRACKS.scheduleTypeRev('sector', 1, false);
    if (HG_TRACKS.dueTypeList(t0).length !== 0) errors.push('[복습 추천] should not be due same day');
    const dueTom = HG_TRACKS.dueTypeList(t1);
    if (!dueTom.some(x => x.lid === 'sector' && x.tyNo === 1)) errors.push('[복습 추천] should be due next day');
    const q1 = HG_TRACKS.buildDailyRevQueue(t1);
    if (q1.length !== 3) errors.push(`[복습 추천] single box-1 type should give 3 problems, got ${q1.length}`);
    HG_TRACKS.submitDailyRevType('sector', 1, true, t1);
    if (!DB.sector.rev.ty1.ok || DB.sector.rev.ty1.box !== 2) errors.push('[복습 추천] pass did not promote/stamp ok');
    viewDailyRev();
    if (prevCent) DB.cent = prevCent; else delete DB.cent;
  }
}

if (errors.length) {
  console.error('✗ Verification failed:', errors);
  process.exit(1);
}
console.log(`✓ Runtime check passed: ${CALC.length} topics, ${totalProbs} problems, DIAG(${DIAG.length}), EXAM_FOCUS(${EXAM_FOCUS.length}), map(${Object.values(CALC_PRE).flat().length} links), repMount & teacher report OK, goals OK, circle ${circleProbs} problems, solid ${solidProbs} problems, int ${intProbs} problems`);