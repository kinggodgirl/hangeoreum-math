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
  'js/09-debug-loc.js',
  'js/09r-report.js',
  'js/04b-boss-mix.js',
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
  'window.__T={GEN,PTYPES,LESSONS,tyKey,CALC,CALC_FOR,DIAG,KEYS,LINKS,EXAM_FOCUS,CALC_PRE,mulberry,check,diagnose,sgnTxt,drillPlan,recordCalcErr,dataSummary,DB,repMount,viewTeacher,PV_CARDS,PREVIEW,TERMS,CONCEPT,CONCEPT_QUIZ:window.CONCEPT_QUIZ,CONCEPT_PILOT:window.CONCEPT_PILOT,_cpSectorCalc:window._cpSectorCalc,CENT_T08:window.CENT_T08,HG_TRACKS:window.HG_TRACKS,HG_LOC:window.HG_LOC,lessonTrackDone:window.lessonTrackDone,lessonProgressInfo:window.lessonProgressInfo,unitCardHTML,pipsOf,viewLesson,viewDailyRev:window.viewDailyRev,omrBits,omrUnbits,today,addDays};',
  sandbox
);

const { GEN, PTYPES, LESSONS, tyKey, CALC, CALC_FOR, DIAG, KEYS, LINKS, EXAM_FOCUS, CALC_PRE, mulberry, check, diagnose, sgnTxt, drillPlan, recordCalcErr, dataSummary, DB, repMount, viewTeacher, PV_CARDS, PREVIEW, TERMS, CONCEPT, CONCEPT_QUIZ, CONCEPT_PILOT, _cpSectorCalc, CENT_T08, HG_TRACKS, HG_LOC, lessonTrackDone, lessonProgressInfo, unitCardHTML, pipsOf, viewLesson, viewDailyRev, omrBits, omrUnbits, today, addDays } = sandbox.__T;
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
for (const d of [d5, d10]) { if (d.Q.some(q => q.ea || q.kw)) errors.push('drillPlan: 틀린 풀이 찾기·낱말 퀴즈는 빼기로 함(T33)'); }
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
    const isValidMesh = m => !!(m && Array.isArray(m.V) && m.V.length >= 4 && Array.isArray(m.F) && m.F.length >= 4);
    const isValidFig = res => {
      if (typeof res === 'string') return /<svg/.test(res);
      if (res && typeof res === 'object') {
        if (Array.isArray(res.items)) return res.items.length > 0 && res.items.every(it => it && isValidMesh(it.mesh));
        if (res.mesh) return isValidMesh(res.mesh);
        if (typeof res.svg === 'function') return isValidFig(res.svg(true, 0));
      }
      return false;
    };
    const calcIdSet = new Set(CALC.map(c => c.id));
    for (const lid of ALL_EXAM_LESSONS) {
      const sp = HG_TRACKS.specs[lid];
      if (!sp) { errors.push(`Missing HG_TRACKS spec: ${lid}`); continue; }
      if (!['concept', 'proc'].includes(sp.kind)) errors.push(`Bad spec.kind: ${lid}`);
      const scenes = typeof sp.owlScenes === 'function' ? sp.owlScenes() : sp.owlScenes;
      if (!Array.isArray(scenes) || scenes.length < 2 || !scenes.some(sc => sc.ask && sc.ask.choices.includes(sc.ask.ans))) {
        errors.push(`Invalid owlScenes for ${lid}`);
      }
      if (!Array.isArray(sp.schemaQs) || sp.schemaQs.length < 3 || sp.schemaQs.some(q => !q.choices.includes(q.ans) || !isValidFig(q.fig()))) {
        errors.push(`Invalid schemaQs for ${lid}`);
      }
      const R = sp.schemaRapid; if (R) for (let k = 0; k < R.kinds; k++) for (let s = 1; s <= 30; s++) { const it = R.make(k, k + R.kinds * s); if (!(it.choices || R.choices).includes(it.ans) || !isValidFig(it.fig) || !it.why) { errors.push(`[T19] Invalid schemaRapid for ${lid} kind ${k}`); break; } }
      if (['arc', 'cent', 'sector'].includes(lid)) { if (R && (R.check || []).some(k => k >= R.kinds)) errors.push(`[T20] bad schemaRapid.check ${lid}`); for (const q of (sp.t1Check || [])) if (q.choices.length < 4 || !q.choices.includes(q.ans)) errors.push(`[T20] t1Check needs 4+ choices ${lid}.${q.id}`); for (const cid of Object.keys(sp.genCompound || {})) for (let sd = 1; sd <= 20; sd++) for (const st of sp.genCompound[cid](sd).steps) if (st.type === 'choice' && st.choices.length < 4) { errors.push(`[T20] compound choice needs 4+ ${lid}.${cid}: ${st.q}`); sd = 99; break; } }
      if (!(sp.kind === 'concept' && Array.isArray(sp.firstGuide) && !sp.firstGuide.length) && (!Array.isArray(sp.firstGuide) || sp.firstGuide.length < 3 || sp.firstGuide.some(g => !calcIdSet.has(g.calcTopic) || !Number.isFinite(g.calcAns) || !isValidFig(g.fig([]))))) {
        errors.push(`Invalid firstGuide for ${lid}`);
      }
      for (const T of PTYPES[lid] || []) {
        const w = sp.worked && sp.worked[T.no];
        if (!w || !Array.isArray(w.steps) || w.steps.length < 3 || !w.pitfall || !isValidFig(w.fig(w.steps[0].hl))) {
          errors.push(`Invalid worked[${T.no}] for ${lid}`);
        }
      }
      const cids = Object.keys(sp.genCompound || {});
      if (cids.length < 2) errors.push(`Need >=2 compounds for ${lid}`);
      for (const cid of cids) {
        for (const sd of [...Array.from({ length: 30 }, (_, i) => i + 1), 0x80000001, 0x7fffffff]) {
          const P = sp.genCompound[cid](sd);
          if (!P || !Array.isArray(P.combo) || P.combo.length !== 2 || !P.fig || !isValidFig(P.fig)) {
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
    // [T25] 입체도형 8차시 3D/교과서 SVG 전환 및 문제 스포일러 제거 검증
    if (typeof HG_TRACKS.mountTrackFig !== 'function') errors.push('[T25] Missing HG_TRACKS.mountTrackFig');
    const SPOILERS = ['옆면=사다리꼴', '다면체 (', '회전체 (', '입체 ✕', '항상 원'];
    for (const lid of ['poly', 'regular', 'rotation', 'rotprop', 'area', 'volume', 'conearea', 'cone']) {
      const sp = HG_TRACKS.specs[lid];
      (sp.owlScenes || []).forEach((sc, idx) => {
        if (!sc.svg || !isValidFig(sc.svg(true))) errors.push(`[T25] Bad owlScene fig ${lid}[${idx}]`);
      });
      (sp.schemaQs || []).forEach(q => {
        const res = q.fig(true);
        if (!isValidFig(res)) errors.push(`[T25] Bad schemaQ fig ${lid}.${q.id}`);
        if (typeof res === 'string' && SPOILERS.some(s => res.includes(s))) errors.push(`[T25] Spoiler text in schemaQ ${lid}.${q.id}`);
      });
      (sp.firstGuide || []).forEach(g => {
        if (!isValidFig(g.fig([], true))) errors.push(`[T25] Bad firstGuide fig ${lid}.${g.id}`);
      });
      Object.values(sp.worked || {}).forEach(w => {
        if (!isValidFig(w.fig((w.steps[0] && w.steps[0].hl) || [], true))) errors.push(`[T25] Bad worked fig ${lid}.${w.no}`);
      });
      Object.keys(sp.genCompound || {}).forEach(cid => {
        const P = sp.genCompound[cid](7);
        if (!isValidFig(P.fig)) errors.push(`[T25] Bad compound fig ${lid}.${cid}`);
      });
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

// cent 유형 3 혼자 풀기 그림(세 반지름·주황 호/부채꼴·?°) & 1-20-50 위치 복사(HG_LOC) 검증
{
  for (let sd = 1; sd <= 30; sd++) {
    const svg = GEN.centThree(sd).fig.svg(true, 0);
    const dashes = (svg.match(/stroke-dasharray="5 4"/g) || []).length;
    if (dashes !== 3 || !svg.includes('#e08a1e') || !svg.includes('?°')) {
      errors.push(`centThree seed ${sd} missing 3 radii or orange target arc/?° (dashes=${dashes})`);
      break;
    }
  }
  if (!HG_LOC || typeof HG_LOC.isTestAccount !== 'function' || typeof HG_LOC.format !== 'function') {
    errors.push('Missing HG_LOC helper');
  } else {
    if (HG_LOC.isTestAccount()) errors.push('HG_LOC.isTestAccount should be false when logged out');
    vm.runInContext('AUTH={role:"student",token:"t1",sid:"1-1-1",grade:1,klass:1,num:1};', sandbox);
    if (HG_LOC.isTestAccount()) errors.push('HG_LOC.isTestAccount should be false for 1-1-1');
    vm.runInContext('AUTH={role:"student",token:"t2",sid:"1-20-50",grade:1,klass:20,num:50};', sandbox);
    if (!HG_LOC.isTestAccount()) errors.push('HG_LOC.isTestAccount should be true for 1-20-50');
    HG_LOC.onRoute('cent-steps');
    HG_LOC.set({ lesson: 'cent', track: 1, tab: 'steps', fn: 'renderT1Guide → mountSoloTwin', guideId: 'fg3', tyNo: 3, inSolo: true });
    HG_LOC.setProb({ lesson: 'cent', gen: 'ty_cent_3', seed: 42, ptype: 'cent:three', mode: 'final', step: 0, totalSteps: 1, title: 'test' });
    const txt = HG_LOC.format();
    if (!txt.includes('1-20-50') || !txt.includes('GEN.centThree') || !txt.includes('mountSoloTwin')) {
      errors.push('HG_LOC.format missing expected details: ' + txt);
    }
    vm.runInContext('HG_LOC.setProb(null);renderProblem(document.createElement("div"),GEN.centThree(7),{mode:"final",rep:{lesson:"cent",gen:"ty_cent_3",seed:7}});', sandbox);
    const pr = HG_LOC.get().prob;
    if (!pr || pr.gen !== 'ty_cent_3' || pr.seed !== 7 || pr.ptype !== 'cent:three') {
      errors.push('HG_LOC renderProblem wrapper failed: ' + JSON.stringify(pr));
    }
    vm.runInContext('AUTH=null;', sandbox);
  }
}

// [T24/T26] 통일 진도 모델(lessonProgressInfo) · 나선형 단일 걸음 홈 진도표 · 상위 단계 자동 체크 · 갈림길 검증
{
  if (typeof lessonProgressInfo !== 'function') {
    errors.push('Missing lessonProgressInfo');
  } else {
    const centGuide = HG_TRACKS.specs.cent.firstGuide || [];
    const allSolo = Object.fromEntries(centGuide.map(g => [g.tyNo, true]));
    const i0 = lessonProgressInfo('cent', {});
    if (i0.trackDone !== 0 || i0.doneSteps !== 0 || i0.isDone || i0.started) {
      errors.push('T24 empty cent progress mismatch: ' + JSON.stringify(i0));
    }
    const i1Schema = lessonProgressInfo('cent', { cent: { track: 1, t1SchemaDone: true, t1Solo: { 1: true } } });
    if (i1Schema.tabs.steps || !i1Schema.started || !i1Schema.t1StepsPartial || i1Schema.trackDone !== 0) {
      errors.push('T26 partial t1 should be started/partial without steps completion: ' + JSON.stringify(i1Schema));
    }
    // 🌱 첫걸음: 유형(구별+따라 풀기) 완료 시 steps=true, concept는 자동 체크 안 됨
    const i1B = lessonProgressInfo('cent', { cent: { track: 1, t1SchemaDone: true, t1Solo: allSolo } });
    if (!i1B.tabs.steps || i1B.tabs.concept || i1B.tabs.practice || i1B.trackDone !== 0) {
      errors.push('T26 t1 guide should complete steps without auto-checking concept: ' + JSON.stringify(i1B));
    }
    // 🌱 첫걸음: 마무리 통과 시 3단계 전체 완료
    const i1Done = lessonProgressInfo('cent', { cent: { track: 1, trackDone: 1, concept: false } });
    if (!i1Done.isDone || i1Done.doneSteps !== 3 || !i1Done.tabs.concept || !i1Done.tabs.steps || !i1Done.tabs.practice) {
      errors.push('T26 trackDone=1 failed: ' + JSON.stringify(i1Done));
    }
    // 🌿 한걸음: 유형(steps=1)만 끝내도 개념 자동 체크, 마무리(trackDone=2)만 끝내도 3단계 전부 체크
    const i2Step = lessonProgressInfo('cent', { cent: { track: 2, steps: 1 } });
    if (!i2Step.tabs.concept || !i2Step.tabs.steps || i2Step.tabs.practice || i2Step.doneSteps !== 2) {
      errors.push('T26 track=2 steps=1 should auto-check concept: ' + JSON.stringify(i2Step));
    }
    const i2Done = lessonProgressInfo('cent', { cent: { track: 2, trackDone: 2 } });
    if (!i2Done.isDone || !i2Done.tabs.concept || !i2Done.tabs.steps || !i2Done.tabs.practice || i2Done.doneSteps !== 3) {
      errors.push('T26 track=2 trackDone=2 should auto-check concept & steps: ' + JSON.stringify(i2Done));
    }
    // 🌳 두걸음: 유형(t3Steps=1)만 끝내도 개념 자동 체크
    const i3Step = lessonProgressInfo('cent', { cent: { track: 3, t3Steps: 1 } });
    if (!i3Step.tabs.concept || !i3Step.tabs.steps || i3Step.tabs.practice || !i3Step.started) {
      errors.push('T26 track=3 t3Steps=1 should auto-check concept & steps: ' + JSON.stringify(i3Step));
    }
    // 홈 진도표 1층 표시 + 보너스 + 갈림길 + 승급 검증
    const prevGoal = DB._goal, prevUnitTrack = DB._unitTrack;
    const prevCircle = { arc: DB.arc, cent: DB.cent, sector: DB.sector };
    DB._goal = { k: 'calc', d: new Date().toISOString().slice(0, 10), h: [] };
    DB._unitTrack = {};
    DB.arc = { track: 1, trackDone: 2, concept: true };
    DB.cent = { track: 1, t1SchemaDone: true };
    delete DB.sector;
    const ucPart = unitCardHTML('circle');
    if (!ucPart.includes('✓ 완료') || !ucPart.includes('🌿+') || !ucPart.includes('진행 중') || !ucPart.includes('시작 전') || ucPart.includes('ct-tb-mini')) {
      errors.push('T26 unitCardHTML single-layer layout mismatch');
    }
    const crLesson = HG_TRACKS.lessonCompleteCrossroadsHTML('arc', 1);
    if (!crLesson.includes('2차시') || !crLesson.includes('쉬웠나요') || !crLesson.includes('🌿 한걸음')) {
      errors.push('T26 lesson crossroads mismatch: ' + crLesson);
    }
    DB.cent = { track: 1, trackDone: 1, concept: true };
    DB.sector = { track: 1, trackDone: 1, concept: true };
    const ucFull = unitCardHTML('circle');
    if (!ucFull.includes('uc-crossroads') || !ucFull.includes('쉬웠나요') || !ucFull.includes('🌿 한걸음')) {
      errors.push('T26 unit completion crossroads missing in unitCardHTML');
    }
    const crUnit = HG_TRACKS.lessonCompleteCrossroadsHTML('sector', 1);
    if (!crUnit.includes('crUpUnit') || !crUnit.includes('완주!')) {
      errors.push('T26 lessonCompleteCrossroadsHTML unit-done mismatch: ' + crUnit);
    }
    HG_TRACKS.promoteUnitTrack('circle', 2);
    if (DB._unitTrack.circle !== 2 || HG_TRACKS.unitActiveTrack('circle') !== 2) {
      errors.push('T26 promoteUnitTrack failed');
    }
    vm.runInContext('viewUnit("circle")', sandbox);
    const unitHtml = vm.runInContext('app.innerHTML', sandbox);
    if (!unitHtml.includes('ct-my-track') || !unitHtml.includes('진행 걸음')) {
      errors.push('T26 viewUnit header track badge missing');
    }
    vm.runInContext('viewHome()', sandbox);
    const homeHtml = vm.runInContext('app.innerHTML', sandbox);
    if (!homeHtml.includes('완료 1/3차시') || !homeHtml.includes('🌿 한걸음') || homeHtml.includes('ctProgLegend') || homeHtml.includes('ct-tr-tab')) {
      errors.push('T26 viewHome post-promotion check failed');
    }
    DB._goal = prevGoal; DB._unitTrack = prevUnitTrack;
    for (const k of ['arc', 'cent', 'sector']) {
      if (prevCircle[k] !== undefined) DB[k] = prevCircle[k]; else delete DB[k];
    }
    const pipHtml = pipsOf('cent');
    if ((pipHtml.match(/class="pip/g) || []).length !== 3) errors.push('T24 pipsOf should have 3 pips');
    const ds24 = dataSummary({ cent: { track: 1, trackDone: 1, concept: true } });
    const centIdx = LESSONS.filter(l => l.ready).findIndex(l => l.id === 'cent');
    if (centIdx < 0 || !Array.isArray(ds24.les[centIdx]) || ds24.les[centIdx].length !== 3 || ds24.lesTr[centIdx] !== 1) {
      errors.push('T24 dataSummary unified 3-pip/trackDone mismatch');
    }
  }
}

// [T30] 보스전 차시 그림 문제: 해결한 차시에서 나오고, 정답을 넣으면 맞다고 채점돼요
{ const bm = vm.runInContext('(()=>{const keep=JSON.stringify(DB);["cent","sector","cone","coord","poly"].forEach(id=>{DB[id]={trackDone:2,track:(id.length%3)+1}});let n=0,ok=0,bad=[];for(let i=0;i<120;i++){const q=BOSS_MIX.pick(i%2?"hard":"normal",{units:[""],qi:0,used:new Set()});if(!q)continue;n++;const v=q.type==="choice"?q.ans:q.type==="pi"?(q.ans===1?"":q.ans)+"π":(q.type==="sn"&&q.ans>0?"+":"")+q.ans;if(check(q,String(v))===true&&q.mix&&q.mix.lid&&LESSONS.find(l=>l.id===q.mix.lid))ok++;else bad.push(q.mix&&q.mix.gen)}Object.keys(DB).forEach(k=>delete DB[k]);Object.assign(DB,JSON.parse(keep));return[n,ok,bad.slice(0,3).join()]})()', sandbox);
  if (!(bm[0] > 20 && bm[0] === bm[1])) errors.push('T30 BOSS_MIX pick/check mismatch ' + bm.join('/')); }

if (errors.length) {
  console.error('✗ Verification failed:', errors);
  process.exit(1);
}
console.log(`✓ Runtime check passed: ${CALC.length} topics, ${totalProbs} problems, DIAG(${DIAG.length}), EXAM_FOCUS(${EXAM_FOCUS.length}), map(${Object.values(CALC_PRE).flat().length} links), repMount & teacher report OK, goals OK, circle ${circleProbs} problems, solid ${solidProbs} problems, int ${intProbs} problems`);