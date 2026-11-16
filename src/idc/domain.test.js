import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, execute, resourceStats, stage, nextTask, planAllocation, allocationsValid, demandReady, acceptanceItems, acceptanceSnapshot, acceptanceReady, acceptanceStatus, deliveryStatus, leaseEnd, cabinetLedgerRows, resourceAnalysisData, resourceReport, resourceDiscrepancies } from './domain.js';
const apply = (s, action) => { const out = execute(s, action); assert.equal(out.error, undefined, out.error); return out.state; };
const findB = (s, id = 'B-001') => s.businesses.find(b => b.id === id);
function sign(s, id = 'B-001') {
  return apply(s, { type: 'saveBusiness', businessId: id, contract: { status: '已签约', number: 'TEST-001', signedDate: '2026-11-08', amount: '10000', tax: '含税', reference: '仅用于验证的测试合同' }, pricing: { amount: '100', unit: '元/柜/月', cycle: '按月', scope: '机柜与电费；带宽和IP另计' } });
}
function acceptance(s, finalize = false, overrides = {}) {
  return { type: 'saveAcceptance', businessId: 'B-001', snapshot: acceptanceSnapshot(findB(s)), items: Object.fromEntries(acceptanceItems.map(i => [i.id, { status: 'pass', note: '测试核验依据' }])), startDate: '2026-11-08', finalize, ...overrides };
}
test('final HTML seed has exact counts, stages and cabinet assignments', () => {
  const s = createInitialState();
  assert.deepEqual([s.records.length, s.businesses.length, s.products.length, s.cabinets.length], [3, 3, 1, 93]);
  assert.deepEqual(resourceStats(s.cabinets), { total: 90, used: 81, whole: 66, shared: 15, empty: 6, reserved: 3, rate: 90 });
  assert.deepEqual(s.records.map(r => stage(s, r)), ['待补信息', '待资源核实', '待方案整理']);
  assert.equal(s.records[1].power, '2.2'); assert.equal(s.records[1].allocations[0].power, 2.2);
  assert.equal(s.records[2].customer, '客户C'); assert.equal(s.products[0].id, '001');
  assert.equal(cabinetLedgerRows(s).find(r => r.customer === '客户G').detail, '22柜');
  assert.equal(cabinetLedgerRows(s).find(r => r.customer === '客户C').term, '21个月');
});
test('supplement requests, operator replies and estimated power update together', () => {
  let s = apply(createInitialState(), { type: 'request', id: 'D-001', recipient: '客户经理 A', fields: ['功率', '租期'], message: '请补充设备信息' });
  s = apply(s, { type: 'editDemand', id: 'D-001', values: { ...s.records[0], powerMode: '设备估算', servers: '4', watts: '250', term: '12个月', source: '商务回复后由运营录入' } });
  assert.equal(s.records[0].power, '1'); assert.equal(s.records[0].request.pending, false); assert.equal(stage(s, s.records[0]), '待资源核实');
});
test('space and power allocation rejects unknown power, over-capacity and unaccepted split', () => {
  const s = createInitialState(), r = { ...s.records[1] };
  assert.throws(() => planAllocation(s, { ...r, power: '' }, ['2-5']), /补齐/);
  assert.throws(() => planAllocation(s, { ...r, power: '5', quantity: '1柜', kind: '整柜' }, ['2-5']), /超过4/);
  assert.throws(() => planAllocation(s, { ...r, power: '5', quantity: '40U', placement: '必须同柜' }, ['2-5', '2-6']), /分柜/);
  assert.equal(planAllocation(s, { ...r, power: '5', quantity: '40U', placement: '可接受分柜' }, ['2-5', '2-6']).length, 2);
  assert.throws(() => planAllocation(s, r, ['3-5']), /状态/);
  assert.throws(() => planAllocation(s, r, ['2-5', '2-5']), /选择/);
});
test('formal confirmation uses 2.2kW and rejects changed cabinet revisions', () => {
  let s = apply(createInitialState(), { type: 'feedback', id: 'D-002' });
  assert.equal(s.records[1].check.state, '已反馈'); assert.equal(s.records[1].allocations[0].power, 2.2);
  s.cabinets.find(c => c.id === '2-9').revision++;
  assert.equal(allocationsValid(s, s.records[1]), false); assert.equal(stage(s, s.records[1]), '待资源核实');
});
test('D-003 transfers once to B-004 with an independent snapshot and locks source edits', () => {
  let s = apply(createInitialState(), { type: 'customerFeedback', id: 'D-003', value: '客户接受', note: '接受方案' });
  s = apply(s, { type: 'transfer', id: 'D-003' }); assert.equal(s.records[2].businessId, 'B-004'); assert.equal(s.businesses.length, 4);
  const copy = findB(s, 'B-004').r; assert.notEqual(copy, s.records[2]); assert.equal(copy.allocations[0].id, '2-10');
  s = apply(s, { type: 'transfer', id: 'D-003' }); assert.equal(s.businesses.length, 4);
  assert.match(execute(s, { type: 'editDemand', id: 'D-003', values: {} }).error, /业务/);
});
test('unpublished or deleted catalog blocks new conversion but preserves historical products', () => {
  let s = apply(createInitialState(), { type: 'customerFeedback', id: 'D-003', value: '客户接受', note: '' });
  s = apply(s, { type: 'deleteProduct', id: '001' });
  assert.match(execute(s, { type: 'transfer', id: 'D-003' }).error, /未发布/); assert.equal(findB(s).product, 'IDC托管');
  s = apply(s, { type: 'reset' }); assert.equal(s.products.length, 1);
});
test('contract gate rejects incomplete signed contracts and never exposes unsigned delivery', () => {
  const s = createInitialState();
  assert.deepEqual(s.businesses.filter(b => b.state !== '签约中').map(b => b.id), ['B-001', 'B-002', 'B-003']);
  assert.match(execute(s, acceptance(s, true)).error, /签约/);
  assert.match(execute(s, { type: 'saveBusiness', businessId: 'B-001', contract: { ...findB(s).contract, status: '已签约' }, pricing: findB(s).pricing }).error, /补齐/);
  const signed = sign(s); assert.equal(findB(signed).state, '已签约'); assert.equal(deliveryStatus(signed, findB(signed)), '待上架');
});
test('progress can be saved but failed, empty or unsupported verification cannot onboard', () => {
  let s = sign(createInitialState());
  const bad = acceptance(s, true); bad.items.resource = { status: 'pass', note: '' };
  assert.match(execute(s, bad).error, /依据/);
  const blocked = acceptance(s, true); blocked.items.resource.status = 'blocked'; assert.match(execute(s, blocked).error, /全部核验通过/);
  const pending = acceptance(s, false); pending.items.resource = { status: 'pending', note: '' }; s = apply(s, pending);
  assert.equal(deliveryStatus(s, findB(s)), '处理中'); assert.equal(acceptanceReady(findB(s)), false); assert.equal(resourceStats(s.cabinets).used, 81);
});
test('pricing changes invalidate saved verification and stale form submission', () => {
  let s = sign(createInitialState()); const saved = acceptance(s); s = apply(s, saved);
  assert.equal(acceptanceReady(findB(s)), true);
  s = apply(s, { type: 'saveBusiness', businessId: 'B-001', contract: findB(s).contract, pricing: { ...findB(s).pricing, amount: '101' } });
  assert.equal(acceptanceStatus(findB(s)), '需重新核验'); assert.equal(acceptanceReady(findB(s)), false);
  assert.match(execute(s, { ...saved, finalize: true }).error, /变化/);
});
test('onboarding rechecks cabinet revision and commits all ledgers only once', () => {
  let s = sign(createInitialState()); const changed = structuredClone(s); changed.cabinets.find(c => c.id === '2-8').revision++;
  assert.match(execute(changed, acceptance(changed, true)).error, /状态已变化/);
  assert.equal(resourceStats(changed.cabinets).used, 81);
  s = apply(s, acceptance(s, true));
  assert.equal(findB(s).state, '履约中'); assert.equal(deliveryStatus(s, findB(s)), '已完成'); assert.equal(resourceStats(s.cabinets).used, 82);
  const c = s.cabinets.find(c => c.id === '2-8'); assert.equal(c.usage[0].units, null); assert.equal(c.usage[0].businessId, 'B-001'); assert.equal(c.stopDate, '2028-08-07'); assert.equal(s.resourceEvents.length, 1);
  const repeat = execute(s, acceptance(s, true)); assert.ok(repeat.error); assert.equal(repeat.state.resourceEvents.length, 1);
});
test('rechecking a business resource preserves customer agreement and enables new verification', () => {
  let s = sign(createInitialState()); s.cabinets.find(c => c.id === '2-8').revision++;
  s = apply(s, { type: 'allocate', businessId: 'B-001', ids: ['2-8'] }); s = apply(s, { type: 'feedback', businessId: 'B-001' });
  assert.equal(findB(s).r.feedback, '客户接受'); assert.equal(demandReady(s, findB(s).r), true);
});
test('stop feedback never releases; whole cabinet release decrements rented count once', () => {
  let s = apply(createInitialState(), { type: 'verifyStop', taskId: 'T-001' });
  assert.equal(resourceStats(s.cabinets).used, 81); assert.equal(s.resourceEvents.length, 0); assert.equal(deliveryStatus(s, findB(s, 'B-002')), '处理中');
  s = apply(s, { type: 'release', taskId: 'T-001' });
  assert.equal(s.cabinets.find(c => c.id === '3-5').state, 'empty'); assert.equal(s.cabinets.find(c => c.id === '3-7').usage[0].name, '客户F');
  assert.equal(findB(s, 'B-002').state, '已终止'); assert.equal(resourceStats(s.cabinets).used, 80); assert.equal(resourceDiscrepancies(s).length, 1);
  assert.ok(execute(s, { type: 'release', taskId: 'T-001' }).error);
});
test('U release preserves other customer and does not decrement rented cabinet count', () => {
  let s = apply(createInitialState(), { type: 'verifyStop', taskId: 'T-002' }); s = apply(s, { type: 'release', taskId: 'T-002' });
  const c = s.cabinets.find(c => c.id === '2-3'); assert.deepEqual(c.usage.map(u => [u.name, u.units, u.power]), [['客户D', 6, 0.7]]); assert.equal(c.power, 0.7); assert.equal(c.state, 'shared');
  assert.equal(resourceStats(s.cabinets).used, 81); assert.equal(s.resourceEvents[0].deltaCab, 0); assert.equal(resourceAnalysisData(s).releasedU, 4);
});
test('release checks revision, quantity, power and business ownership atomically', () => {
  const verified = apply(createInitialState(), { type: 'verifyStop', taskId: 'T-002' });
  for (const alter of [c => c.revision++, c => c.usage[0].units++, c => c.usage[0].power++, c => c.usage[0].businessId = 'B-other']) {
    const s = structuredClone(verified); alter(s.cabinets.find(c => c.id === '2-3'));
    assert.ok(execute(s, { type: 'release', taskId: 'T-002' }).error); assert.equal(s.resourceEvents.length, 0); assert.equal(s.cabinets.find(c => c.id === '2-3').usage.length, 2);
  }
});
test('new stop creates one demand and one task without immediate resource release', () => {
  let s = sign(createInitialState()); s = apply(s, acceptance(s, true));
  assert.match(execute(s, { type: 'requestStop', businessId: 'B-001', date: '2026-11-07', reason: '测试' }).error, /不能早于/);
  s = apply(s, { type: 'requestStop', businessId: 'B-001', date: '2027-01-01', reason: '测试止租' });
  assert.equal(s.records.length, 4); assert.equal(s.stopTasks.length, 3); assert.equal(findB(s).state, '待终止'); assert.equal(resourceStats(s.cabinets).used, 82);
  assert.ok(execute(s, { type: 'requestStop', businessId: 'B-001', date: '2027-01-01', reason: '测试' }).error);
});
test('date rules clamp end-of-month then subtract one day, including 21 months and year boundaries', () => {
  assert.equal(leaseEnd('2026-01-31', '1个月'), '2026-02-27'); assert.equal(leaseEnd('2027-12-31', '2个月'), '2028-02-28');
  assert.equal(leaseEnd('2026-11-08', '21个月'), '2028-08-07'); assert.equal(leaseEnd('2026-12-01', '1个月'), '2026-12-31');
  assert.equal(leaseEnd('2026-02-31', '1个月'), '—'); assert.equal(leaseEnd('', '12个月'), '—');
});
test('resource event totals reconcile and reset restores every collection', () => {
  let s = sign(createInitialState()); s = apply(s, acceptance(s, true));
  for (const taskId of ['T-001', 'T-002']) { s = apply(s, { type: 'verifyStop', taskId }); s = apply(s, { type: 'release', taskId }); }
  const d = resourceAnalysisData(s); assert.equal(d.now.used - d.base.used, 0); assert.equal(d.addedCab, 1); assert.equal(d.releasedCab, 1); assert.equal(d.releasedU, 4);
  assert.match(resourceReport(d)[0].text, /U位新增 0U、止租 4U/); assert.deepEqual(apply(s, { type: 'reset' }), createInitialState());
});
