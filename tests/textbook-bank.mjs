// [T12] 교과서 문제 꼬리표 은행(data/textbook-bank.json) 형식 검사 — tests/verify.mjs가 불러요.
// 형식 설명: docs/textbook-bank.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data/textbook-bank.json'), 'utf8'));
const calcSrc = fs.readFileSync(path.join(root, 'js/05-calc.js'), 'utf8');
const CALC_IDS = new Set([...calcSrc.matchAll(/\{id:'([a-z0-9]+)',grp:/g)].map(m => m[1]));

const LESSON = {
  coord: ['IV', '01'], graph: ['IV', '02'], prop: ['IV', '03'], inv: ['IV', '04'],
  arc: ['VI', '04'], cent: ['VI', '04'], sector: ['VI', '05'],
  poly: ['VII', '01'], regular: ['VII', '01'], rotation: ['VII', '02'], rotprop: ['VII', '02'],
  area: ['VII', '03'], volume: ['VII', '03'], conearea: ['VII', '04'], cone: ['VII', '04'],
};
const KIND = new Set(['ready', 'open', 'chk', 'ex', 'prob', 'more', 'self', 'world', 'explore', 'final']);
const FORM = new Set(['num', 'pi', 'frac', 'choice', 'ox', 'word', 'draw', 'explain']);
const PAGES = { IV: [108, 136], VI: [194, 206], VII: [210, 242] };

const errs = [], ids = new Set();
if (!Array.isArray(bank.items) || bank.items.length < 100) errs.push('items가 너무 적어요');
for (const it of bank.items || []) {
  const at = it.id || '(id 없음)';
  if (!/^p\d{3}-[a-z0-9-]+$/.test(it.id || '')) errs.push(`${at}: id 형식은 p쪽번호-번호`);
  if (ids.has(it.id)) errs.push(`${at}: id 중복`); ids.add(it.id);
  const L = LESSON[it.lesson];
  if (!L) { errs.push(`${at}: 모르는 lesson ${it.lesson}`); continue; }
  if (it.unit !== L[0] || it.sec !== L[1]) errs.push(`${at}: unit/sec가 lesson과 안 맞아요`);
  const [p0, p1] = PAGES[it.unit];
  if (!(it.page >= p0 && it.page <= p1) || it.id.slice(1, 4) !== String(it.page)) errs.push(`${at}: page가 범위 밖이거나 id와 달라요`);
  if (!(it.page < 233 || it.page > 237)) errs.push(`${at}: 구(233~237쪽)는 범위 밖`);
  if (!KIND.has(it.kind)) errs.push(`${at}: kind ${it.kind}`);
  if (!FORM.has(it.form)) errs.push(`${at}: form ${it.form}`);
  if (![1, 2, 3].includes(it.level)) errs.push(`${at}: level은 1~3`);
  if (!String(it.type || '').startsWith(it.lesson + ':')) errs.push(`${at}: type은 lesson:유형`);
  if (!Array.isArray(it.calc)) errs.push(`${at}: calc는 배열`);
  else for (const c of it.calc) if (!CALC_IDS.has(c)) errs.push(`${at}: 기초 연산 칸 ${c}가 CALC에 없어요`);
  if (!it.sum || !it.ans) errs.push(`${at}: sum/ans 비었어요`);
  if (typeof it.boss !== 'boolean') errs.push(`${at}: boss는 true/false`);
  if (it.sum && it.sum.length > 90) errs.push(`${at}: sum은 짧게(원문 복사 금지)`);
}
if (errs.length) {
  console.error('✗ textbook-bank 검사 실패:', errs);
  process.exit(1);
}
console.log(`✓ textbook-bank: ${bank.items.length}문항, 기초 연산 칸 ${CALC_IDS.size}개와 연결 확인`);
