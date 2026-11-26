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
  'js/05-calc.js',
  'js/06-unit-int.js',
  'js/06c-unit-circle.js',
  'js/06g-goal.js',
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
  'window.__T={GEN,PTYPES,LESSONS,tyKey,CALC,DIAG,KEYS,LINKS,EXAM_FOCUS,CALC_PRE,mulberry,check,diagnose,sgnTxt,drillPlan,recordCalcErr,dataSummary,DB,repMount,viewTeacher};',
  sandbox
);

const { GEN, PTYPES, LESSONS, tyKey, CALC, DIAG, KEYS, LINKS, EXAM_FOCUS, CALC_PRE, mulberry, check, diagnose, sgnTxt, drillPlan, recordCalcErr, dataSummary, DB, repMount, viewTeacher } = sandbox.__T;
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

// 입체도형: 열린 차시(poly · regular · area) 문제 생성과 단계 정답 검증
let solidProbs = 0;
for (const lid of ['poly', 'regular']) {
  if (!LESSONS.some(l => l.id === lid && l.ready)) errors.push(`Missing ready solid lesson ${lid}`);
  for (const T of PTYPES[lid] || []) {
    for (let sd = 1; sd <= 40; sd++) {
      solidProbs++;
      const P = GEN[tyKey(lid, T.no)](sd);
      if (!P || !P.steps || !P.steps.length || !T.pt.includes(P.ptype)) { errors.push(`Bad solid gen: ${lid} 유형 ${T.no}`); break; }
      const bad = P.steps.find(st => !checkStep(st)) || (P.final && !checkStep(P.final) ? P.final : null);
      if (bad) { errors.push(`Solid step answer fails: ${lid} 유형 ${T.no} seed ${sd}: ${bad.q}`); break; }
    }
  }
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

if (errors.length) {
  console.error('✗ Verification failed:', errors);
  process.exit(1);
}
console.log(`✓ Runtime check passed: ${CALC.length} topics, ${totalProbs} problems, DIAG(${DIAG.length}), EXAM_FOCUS(${EXAM_FOCUS.length}), map(${Object.values(CALC_PRE).flat().length} links), repMount & teacher report OK, goals OK, circle ${circleProbs} problems, solid ${solidProbs} problems, int ${intProbs} problems`);
