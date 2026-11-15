import initial from './initialData.json' with { type: 'json' };
export const acceptanceItems = initial.acceptanceItems;
export const cabinetStates = { full: '使用中', shared: '使用中', empty: '空闲', reserved: '待上架', pending: '止租', head: '列头柜' };
export const businessStates = ['签约中', '已签约', '履约中', '待终止', '已终止'];
export const demandStages = ['待补信息', '待资源核实', '待正式核实', '待方案整理', '待客户确认', '待调整需求', '待客户反馈', '待转业务', '已转业务', '已落地', '未落地'];
export const createInitialState = () => ({ ...structuredClone(initial), resourceEvents: [] });
export const stamp = () => new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' });
const dateNow = () => stamp().slice(0, 10);
const normalized = value => value.replace(/\s/g, '');
const nextId = (items, prefix) => prefix + String(Math.max(0, ...items.map(item => Number(item.id.slice(2)))) + 1).padStart(3, '0');
function requireThat(condition, message) { if (!condition) throw new Error(message); }
export function missing(r) {
  const fields = [];
  if (!r.quantity?.trim()) fields.push('机柜／U 数');
  if (r.powerMode === '待确认' || !r.power) fields.push('功率');
  if (!r.term?.trim()) fields.push('租期');
  if (r.bandwidth === '待确认') fields.push('带宽意向');
  if (r.bandwidth === '需要' && !r.bandwidthSpec?.trim()) fields.push('带宽规格');
  if (r.ip === '待确认') fields.push('IP 意向');
  if (r.ip === '需要' && !r.ipSpec?.trim()) fields.push('IP 数量');
  if (r.kind !== '整柜' && r.placement === '待确认') fields.push('同柜／分柜意愿');
  return fields;
}
export function eligibleCabinet(s, c, r) {
  return c && ['empty', 'shared'].includes(c.state) && !s.stopTasks.some(t => t.cabinetId === c.id && t.status !== '已更新台账') && (r.kind !== '整柜' || c.state === 'empty');
}
export function planAllocation(s, r, ids) {
  const amount = Math.ceil(Math.max(0, ...(r.quantity.match(/\d+(?:\.\d+)?/g) || []).map(Number))), power = Number(r.power);
  requireThat(amount > 0 && power > 0, '请先补齐资源数量和功率。');
  requireThat(ids.length && new Set(ids).size === ids.length, '请选择候选柜位。');
  const cs = ids.map(id => s.cabinets.find(c => c.id === id));
  requireThat(cs.every(c => eligibleCabinet(s, c, r)), '柜位状态已变化，请重新选择。');
  if (r.kind === '整柜') {
    requireThat(ids.length === amount, `需选择 ${amount} 个空闲柜位。`);
    requireThat(power / ids.length <= 4, '单柜功率超过4 kW，请调整需求。');
    return cs.map(c => ({ id: c.id, units: null, power: power / ids.length, revision: c.revision }));
  }
  let remaining = amount;
  const allocations = [];
  for (const c of cs) {
    const capacity = Math.min(42 - (c.occupied || 0), Math.floor((4 - c.power) * amount / power + 1e-6));
    const units = Math.min(remaining, Math.max(0, capacity));
    if (units) { allocations.push({ id: c.id, units, power: Number((power * units / amount).toFixed(3)), revision: c.revision }); remaining -= units; }
  }
  requireThat(!remaining, '当前选择无法同时满足空间与功率，请增加柜位或调整需求。');
  requireThat(allocations.length <= 1 || r.placement === '可接受分柜', '该方案需要分柜，请先确认客户接受分柜。');
  return allocations;
}
export function allocationsValid(s, r) {
  if (!r.allocations?.length) return false;
  return r.allocations.every(a => {
    const c = s.cabinets.find(c => c.id === a.id);
    return eligibleCabinet(s, c, r) && c.revision === a.revision && (a.units === null ? c.state === 'empty' : 42 - (c.occupied || 0) >= a.units) && c.power + a.power <= 4 + 1e-6;
  });
}
export function demandReady(s, r) {
  return !missing(r).length && r.check?.type === '正式资源核实' && r.check.state === '已反馈' && r.check.result !== '当前无法承接' && r.candidates?.length > 0 && allocationsValid(s, r);
}
export function stage(s, r) {
  if (r.businessId) return '已转业务';
  if (r.fulfilled) return '已落地';
  if (r.feedback === '客户未接受') return '未落地';
  if (r.feedback === '客户接受') return '待转业务';
  if (r.feedback === '已报价') return '待客户反馈';
  if (missing(r).length) return '待补信息';
  if (r.check?.type === '正式资源核实' && r.check.state === '已反馈' && r.check.result !== '当前无法承接' && !allocationsValid(s, r)) return '待资源核实';
  if (!r.check || r.check.state !== '已反馈') return '待资源核实';
  if (r.check.type === '初步资源咨询') return '待正式核实';
  if (r.check.result === '当前无法承接') return '待调整需求';
  if (r.check.result === '需分柜承接' && r.placement !== '可接受分柜') return '待客户确认';
  return '待方案整理';
}
export function nextTask(s, r) {
  if (r.businessId) return `查看业务 ${r.businessId} 的签约与交付进度`;
  if (r.fulfilled) return '已完成上架登记，可查看关联柜位';
  if (r.feedback === '客户未接受') return r.feedbackNote || '客户未接受，需求已归档';
  if (r.feedback === '客户接受') return '确认最终方案并转入业务台账';
  if (r.feedback === '已报价') return '跟进客户反馈';
  const m = missing(r);
  if (m.length) return (r.request?.pending ? '待商务回复，缺少' : '需补充') + ' ' + m.join('、');
  if (!r.check) return '发起正式资源核实';
  if (r.check.state !== '已反馈') return '等待网络部核实反馈';
  if (r.check.type === '初步资源咨询') return '根据完整条件发起正式核实';
  if (r.check.result === '当前无法承接') return '沟通其他资源或调整需求';
  if (!allocationsValid(s, r)) return '柜位状态已变化，请重新关联并核实';
  if (r.check.result === '需分柜承接' && r.placement !== '可接受分柜') return '确认客户是否接受分柜';
  return r.candidates.length ? '整理报价条件与商务沟通摘要' : '选择候选产品';
}
export function leaseEnd(start, term) {
  const m = String(term).match(/^(\d+)\s*(?:个月|月)$/);
  if (!m || !/^\d{4}-\d{2}-\d{2}$/.test(start) || !Number(m[1])) return '—';
  const [y, mo, d] = start.split('-').map(Number);
  const original = new Date(Date.UTC(y, mo - 1, d));
  if (original.toISOString().slice(0, 10) !== start) return '—';
  const end = new Date(Date.UTC(y, mo - 1 + Number(m[1]), 1));
  end.setUTCDate(Math.min(d, new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate()));
  end.setUTCDate(end.getUTCDate() - 1);
  return end.toISOString().slice(0, 10);
}
export const businessAllocations = b => b.r?.allocations || b.allocations || [];
export const businessContent = b => b.r?.quantity || b.quantity;
export const businessTerm = b => b.r?.term || b.term;
export function businessReady(b) {
  return b.contract.status === '已签约' && !!b.contract.number.trim() && !!b.contract.signedDate && Number(b.contract.amount) > 0 && Number(b.pricing.amount) > 0 && !!b.pricing.scope.trim() && !!b.contract.reference.trim();
}
export function acceptanceSnapshot(b) {
  const r = b.r;
  return JSON.stringify([r.kind, r.quantity, r.power, r.powerMode, r.term, r.bandwidth, r.bandwidthSpec, r.ip, r.ipSpec, r.placement, r.candidates, r.allocations, r.check, r.feedback, r.feedbackNote, b.contract, b.pricing, b.state]);
}
export function acceptanceReady(b) {
  const a = b.r?.acceptance;
  return !!(a && a.snapshot === acceptanceSnapshot(b) && leaseEnd(a.startDate, b.r.term) !== '—' && acceptanceItems.every(i => a.items?.[i.id]?.status === 'pass' && a.items[i.id].note.trim()));
}
export function acceptanceStatus(b) {
  if (b.r?.fulfilled) return '已完成';
  const a = b.r?.acceptance;
  if (a && a.snapshot !== acceptanceSnapshot(b)) return '需重新核验';
  if (a && Object.values(a.items).some(i => i.status === 'blocked')) return '待处理异常';
  return a ? '验收中' : '待验收';
}
export function deliveryStatus(s, b) {
  if (['待终止', '已终止'].includes(b.state)) {
    const tasks = s.stopTasks.filter(t => t.businessId === b.id);
    return tasks.length && tasks.every(t => t.status === '已更新台账') ? '已完成' : tasks.some(t => ['已确认可释放', '已更新台账'].includes(t.status)) ? '处理中' : '待下架';
  }
  return b.r?.fulfilled ? '已完成' : b.r?.acceptance ? '处理中' : '待上架';
}
export function matchesStopUsage(u, t) {
  return normalized(u.name) === normalized(t.customer) && (!u.businessId || u.businessId === t.businessId) && u.units === t.units && Math.abs(u.power - t.power) < 0.001;
}
export function resourceDiscrepancies(s) {
  const rows = s.stopTasks.filter(t => t.status !== '已更新台账' && s.cabinets.some(c => c.id === t.cabinetId && c.usage.some(u => matchesStopUsage(u, t)))).map(t => ({ id: t.id, type: 'stop', label: '业务止租，资源占用未同步', businessId: t.businessId, customer: t.customer, cabinets: t.cabinetId, status: t.status, task: t.id }));
  for (const b of s.businesses.filter(b => b.state === '履约中')) {
    const absent = businessAllocations(b).filter(a => !s.cabinets.find(c => c.id === a.id)?.usage.some(u => normalized(u.name) === normalized(b.customer) && (!u.businessId || u.businessId === b.id) && u.units === a.units && Math.abs(u.power - a.power) < 0.001));
    if (absent.length) rows.push({ id: 'R-' + b.id, type: 'allocation', label: '业务在用，资源占用不一致', businessId: b.id, customer: b.customer, cabinets: absent.map(a => a.id).join('、'), status: '待核实' });
  }
  return rows;
}
function log(s, r, text, stopId) {
  if (r) { r.logs.unshift(stamp() + ' · ' + text); r.updated = stamp(); }
  s.activities.unshift({ id: r?.id || null, stopId, text, time: stamp().slice(11, 16) });
}
function news(s, c, type, text) { s.weeklyMessages.unshift({ id: c.id, type, text, day: dateNow() }); }
export function execute(state, action) {
  if (action.type === 'reset') return { state: createInitialState(), message: '已恢复全部初始数据' };
  const s = structuredClone(state);
  const b = s.businesses.find(b => b.id === action.businessId);
  const r = b?.r || s.records.find(r => r.id === action.id);
  const t = s.stopTasks.find(t => t.id === action.taskId);
  let result = null, message = '已保存';
  try {
    switch (action.type) {
      case 'editDemand': {
        requireThat(r && !r.businessId && !r.fulfilled, '已转业务的方案请在业务台账维护。');
        const v = { ...action.values };
        if (v.powerMode === '设备估算') { requireThat(Number(v.servers) > 0 && Number(v.watts) > 0, '设备估算需要填写服务器数量和单台功率。'); v.power = String(Math.round(Number(v.servers) * Number(v.watts)) / 1000); }
        if (v.powerMode === '客户提供') requireThat(Number(v.power) > 0, '请填入客户提供的总功率，或将功率状态设为待确认。');
        if (v.powerMode === '待确认') v.power = '';
        const changed = ['kind', 'quantity', 'placement', 'powerMode', 'power'].some(k => String(v[k]) !== String(r[k]));
        Object.assign(r, v);
        if (r.request && (v.source === '商务录入' || v.source === '商务回复后由运营录入' || !missing(r).length)) r.request.pending = false;
        if (changed) { r.allocations = []; r.feedback = null; r.check = null; r.logs.unshift('需求部署条件变化，原核实结果需重新确认。'); }
        log(s, r, '需求信息已更新 · ' + v.source); break;
      }
      case 'request':
        requireThat(r && !r.businessId, '已转业务的需求不可修改。');
        requireThat(action.fields.length && action.recipient.trim(), '请选择需要确认的字段并填写接收人。');
        r.request = { fields: action.fields, recipient: action.recipient.trim(), message: action.message.trim(), pending: true };
        log(s, r, '记录补充请求，接收人 ' + r.request.recipient); break;
      case 'candidates':
        requireThat(r && !r.businessId && !r.fulfilled, '当前方案不可修改。');
        r.candidates = action.products; r.feedback = null; log(s, r, '候选产品更新：' + (action.products.join('、') || '已清空')); break;
      case 'allocate':
        requireThat(r && !r.fulfilled && !r.businessId, '当前方案不可修改。');
        r.allocations = planAllocation(s, r, action.ids); if (!b) r.feedback = null;
        r.check = { type: '正式资源核实', state: '待反馈', question: '请核实 ' + action.ids.join('、') + '柜的空间、功率及部署条件。' };
        log(s, r, '已关联柜位并发起资源核实：' + action.ids.join('、')); break;
      case 'consult':
        requireThat(r && !r.businessId && !r.fulfilled, '当前方案不可修改。');
        if (action.checkType === '正式资源核实') requireThat(Number(r.power) > 0 && r.quantity.trim() && r.allocations.length, '正式核实需补齐数量与功率，并关联实际柜位。');
        r.check = { type: action.checkType, state: '待反馈', question: action.question, result: '', detail: '' }; log(s, r, '已发起' + action.checkType + '，等待网络部反馈'); break;
      case 'feedback': {
        requireThat(r && !r.businessId && !r.fulfilled, '当前方案不可修改。');
        if (!r.check || r.check.state === '已反馈') break;
        const c = r.check;
        if (c.type === '初步资源咨询') { c.result = '需补齐功率并关联柜位'; c.detail = '初步咨询已反馈，补齐条件后选择实际柜位开展正式核实。'; }
        else {
          requireThat(r.allocations.length, '请先关联候选柜位。');
          const outcome = action.outcome || '同柜可承接';
          requireThat(outcome !== '需分柜承接' || r.allocations.length > 1, '请先确认客户接受分柜，并重新关联多个柜位。');
          requireThat(outcome === '当前无法承接' || allocationsValid(s, r), '柜位状态已变化，请重新选择并核实。');
          c.result = outcome === '当前无法承接' ? outcome : r.allocations.length > 1 ? '需分柜承接' : '同柜可承接';
          c.detail = c.result === '当前无法承接' ? '机房反馈当前部署条件无法满足，请调整方案。' : '机房确认 ' + r.allocations.map(a => a.id + '柜').join('、') + ' 可覆盖本次空间和功率需求。';
        }
        c.state = '已反馈'; c.stamp = stamp(); log(s, r, '收到资源核实反馈：' + c.result); break;
      }
      case 'customerFeedback':
        requireThat(r && !r.businessId && !r.fulfilled, '当前方案不可修改。');
        requireThat(action.value === '客户未接受' || demandReady(s, r), '请先补齐需求、确认柜位资源并选择候选产品。');
        r.feedback = action.value; r.feedbackNote = action.note.trim(); log(s, r, '客户反馈：' + action.value + (r.feedbackNote ? ' · ' + r.feedbackNote : '')); break;
      case 'transfer': {
        requireThat(r, '需求不存在。');
        if (r.businessId) { result = r.businessId; break; }
        const p = s.products.find(p => p.id === '001' && p.status === '已发布');
        requireThat(p, 'IDC托管产品当前未发布，请先检查产品目录。');
        requireThat(r.type !== '扩容' || s.cabinets.some(c => c.usage.some(u => normalized(u.name) === normalized(r.customer))), '扩容仅适用于存量客户，请核对客户与业务类型。');
        requireThat(r.feedback === '客户接受' && demandReady(s, r), '请先确认需求、资源、候选方案及客户接受反馈。');
        const id = nextId(s.businesses, 'B-');
        s.businesses.push({ id, requestId: r.id, customer: r.customer, type: r.type, productId: p.id, product: p.name, owner: r.owner, r: { ...structuredClone(r), id, sourceDemandId: r.id, businessId: null, acceptance: null }, state: '签约中', contract: { status: '待签约', number: '', signedDate: '', amount: '', tax: '含税', reference: '' }, pricing: { amount: '', unit: r.kind === '整柜' ? '元/柜/月' : '元/U/月', cycle: '按月', scope: '机柜与电费；带宽和IP另计' }, updated: stamp(), logs: [stamp() + ' · 由' + r.id + '转为业务，保留确认时的方案快照'] });
        r.businessId = id; log(s, r, '已转为业务 ' + id); result = id; message = '已转为业务 ' + id; break;
      }
      case 'saveBusiness': {
        requireThat(b && ['签约中', '已签约'].includes(b.state), '当前业务成交信息不可修改。');
        const { contract, pricing } = action;
        requireThat((!pricing.amount || Number(pricing.amount) > 0) && (!contract.amount || Number(contract.amount) > 0), '已填写的金额必须大于0。');
        requireThat(contract.status !== '已签约' || (contract.number.trim() && leaseEnd(contract.signedDate, '1个月') !== '—' && Number(contract.amount) > 0 && contract.reference.trim()), '已签约需补齐合同编号、签约日期、合同总额及确认依据。');
        b.contract = contract; b.pricing = pricing; b.state = contract.status === '已签约' ? '已签约' : '签约中'; log(s, b, '成交与合同信息已更新，交付核验按最新条件检查'); break;
      }
      case 'saveAcceptance': {
        requireThat(b && b.state === '已签约' && r && !r.fulfilled, '业务签约后才能进行交付核验。');
        requireThat(action.snapshot === acceptanceSnapshot(b), '需求或成交条件已变化，请重新逐项核验。');
        for (const item of acceptanceItems) { const v = action.items[item.id]; requireThat(v && (v.status === 'pending' || v.note.trim()), '请补充「' + item.title + '」的核验依据或异常原因。'); }
        r.acceptance = { items: action.items, startDate: action.startDate, snapshot: acceptanceSnapshot(b), updatedAt: stamp() };
        if (!action.finalize) { log(s, b, '已保存交付核验进度'); break; }
        requireThat(businessReady(b), '请先补齐已签约合同及成交资费。');
        requireThat(acceptanceReady(b), '请确保全部核验通过并填写依据，确认起租时间及有效租期。');
        requireThat(r.feedback === '客户接受' && demandReady(s, r), '资源或需求状态已变化，请重新关联柜位并核实。');
        const name = normalized(b.customer), oldTerm = new Map(s.terms).get(name);
        requireThat(!oldTerm || oldTerm === r.term, '该客户已有统一租期，请先核对需求租期。');
        for (const a of r.allocations) {
          const c = s.cabinets.find(c => c.id === a.id), wasUsed = c.usage.length > 0;
          c.usage.push({ name, businessId: b.id, units: a.units, power: a.power, startDate: action.startDate, stopDate: leaseEnd(action.startDate, r.term) });
          c.state = a.units === null ? 'full' : 'shared'; c.mode = a.units === null ? '整柜' : 'U位'; c.occupied = a.units === null ? null : c.usage.reduce((n, u) => n + (u.units || 0), 0); c.power = Number(c.usage.reduce((n, u) => n + u.power, 0).toFixed(3)); c.term = r.term;
          if (c.usage.length === 1) c.startDate = action.startDate;
          c.stopDate = leaseEnd(action.startDate, r.term); c.revision++;
          s.resourceEvents.push({ type: '新增', id: b.id, cabinetId: c.id, customer: b.customer, units: a.units, deltaCab: wasUsed ? 0 : 1, power: a.power, date: dateNow() });
          news(s, c, '使用中', name + '已登记上架，占用' + (a.units === null ? '整柜' : a.units + 'U') + '。');
        }
        s.terms = [...new Map([...s.terms, [name, r.term]])]; r.fulfilled = true; r.acceptance.completedAt = stamp(); b.state = '履约中'; log(s, b, '交付核验通过，已登记上架并更新机柜台账'); message = '上架登记完成，台账和平面图已同步'; break;
      }
      case 'requestStop': {
        requireThat(b && b.state === '履约中', '仅履约中业务可登记止租。');
        requireThat(action.date && action.reason.trim(), '请填写止租日期和原因。');
        requireThat(leaseEnd(action.date, '1个月') !== '—' && action.date >= (r?.acceptance?.startDate || ''), '止租日期不能早于起租日期。');
        const id = nextId(s.records, 'D-');
        s.records.push({ ...structuredClone(r || {}), id, customer: b.customer, type: '止租', owner: b.owner, quantity: businessContent(b), kind: businessAllocations(b)[0]?.units === null ? '整柜' : 'U位', power: String(businessAllocations(b).reduce((n, a) => n + a.power, 0)), businessId: b.id, fulfilled: false, updated: stamp(), logs: [stamp() + ' · 存量业务' + b.id + '申请止租：' + action.reason] });
        b.stopRequestId = id; b.state = '待终止'; b.stopDate = action.date; b.stopReason = action.reason.trim();
        for (const a of businessAllocations(b)) s.stopTasks.push({ id: nextId(s.stopTasks, 'T-'), businessId: b.id, customer: b.customer, cabinetId: a.id, mode: a.units === null ? '整柜' : 'U位', units: a.units, power: a.power, status: '待核实', date: action.date, logs: [stamp() + ' · 业务登记止租，机柜台账待核实'] });
        log(s, b, '已登记止租并生成下架核实事项'); message = '止租已登记，机柜占用待核实后释放'; break;
      }
      case 'verifyStop': {
        requireThat(t && t.status !== '已更新台账', '事项已处理或不存在。');
        const c = s.cabinets.find(c => c.id === t.cabinetId);
        requireThat(c?.usage.some(u => matchesStopUsage(u, t)), '客户占用的数量或功率已变化，请核对业务与台账后再处理。');
        t.status = '已确认可释放'; t.verifiedRevision = c.revision; t.logs.push(stamp() + ' · 网络部已确认设备下架，本次资源可释放；台账尚待更新。'); log(s, null, t.id + ' 已确认可释放', t.id); break;
      }
      case 'release': {
        requireThat(t && t.status === '已确认可释放', '请先收到机房核实反馈。');
        const c = s.cabinets.find(c => c.id === t.cabinetId);
        requireThat(c && c.revision === t.verifiedRevision, '核实后的资源发生变化，请重新核实。');
        const index = c.usage.findIndex(u => matchesStopUsage(u, t));
        requireThat(index >= 0, '客户占用的数量、功率或业务归属已变化，请重新核实。');
        t.before = c.usage.map(u => u.name + '：' + (u.units === null ? '整柜' : u.units + 'U')).join('、'); c.usage.splice(index, 1);
        c.state = c.usage.length ? 'shared' : 'empty'; c.mode = c.usage.length ? 'U位' : '—'; c.occupied = c.usage.reduce((n, u) => n + (u.units || 0), 0); c.power = Number(c.usage.reduce((n, u) => n + u.power, 0).toFixed(3));
        if (!c.usage.length) { c.term = '—'; c.startDate = '—'; }
        c.stopDate = t.date; c.revision++; t.after = c.usage.length ? c.usage.map(u => u.name + '：' + u.units + 'U').join('、') : '空闲'; t.status = '已更新台账';
        const owner = s.businesses.find(b => b.id === t.businessId);
        if (s.stopTasks.filter(x => x.businessId === t.businessId).every(x => x.status === '已更新台账')) { owner.state = '已终止'; log(s, owner, '全部止租资源已核实释放，交付已完成'); }
        s.resourceEvents.push({ type: '止租', id: t.id, cabinetId: c.id, customer: t.customer, units: t.units, deltaCab: c.usage.length ? 0 : -1, power: t.power, date: dateNow() });
        t.logs.push(stamp() + ' · 已释放' + (t.mode === '整柜' ? '整柜' : t.units + 'U') + '；' + (c.usage.length ? '同柜其他客户保持使用。' : '柜位已更新为空闲。'));
        news(s, c, '止租', t.customer + '已完成止租，释放' + (t.units === null ? '整柜' : t.units + 'U') + '。'); log(s, null, t.id + ' 已更新台账', t.id); message = '止租释放完成，台账与动态已同步'; break;
      }
      case 'editProduct': {
        const p = s.products.find(p => p.id === action.id);
        requireThat(p && action.values.name.trim() && action.values.owner.trim() && action.values.billingUnit.trim() && action.values.spec.trim() && action.values.conditions.trim(), '请补齐产品名称、负责人、租用单位、规格和交付前提。');
        Object.assign(p, action.values, { updated: dateNow() }); break;
      }
      case 'deleteProduct': s.products = s.products.filter(p => p.id !== action.id); message = '产品条目已删除，历史业务快照保留'; break;
      default: throw new Error('不支持的操作。');
    }
    return { state: s, result, message };
  } catch (error) { return { state, error: error.message }; }
}

export function resourceStats(list){const pool=list.filter(c=>c.state!=='head');const used=pool.filter(c=>c.usage.length>0),whole=used.filter(c=>c.mode==='整柜'),shared=used.filter(c=>c.mode==='U位');const empty=pool.filter(c=>c.state==='empty'&&!c.usage.length),reserved=pool.filter(c=>c.state==='reserved'&&!c.usage.length);return {total:pool.length,used:used.length,whole:whole.length,shared:shared.length,empty:empty.length,reserved:reserved.length,rate:pool.length?100*used.length/pool.length:0}}
export function resourceAnalysisData(s){const {cabinets, stopTasks, resourceEvents, records}=s;const now=resourceStats(cabinets),base=resourceStats(initial.cabinets);const pending=stopTasks.filter(t=>t.status!=='已更新台账');const shared=cabinets.filter(c=>c.state==='shared'&&c.usage.length&&!pending.some(t=>t.cabinetId===c.id));const opportunities=shared.filter(c=>(42-(c.occupied||0))>0&&c.power<4);const additions=resourceEvents.filter(e=>e.type==='新增'),releases=resourceEvents.filter(e=>e.type==='止租');return {now,base,pending,opportunities,additions,releases,addedCab:additions.reduce((n,e)=>n+e.deltaCab,0),releasedCab:-releases.reduce((n,e)=>n+e.deltaCab,0),addedU:additions.reduce((n,e)=>n+(e.units||0),0),releasedU:releases.reduce((n,e)=>n+(e.units||0),0),unlanded:records.filter(r=>r.feedback==='客户未接受'),following:records.filter(r=>!r.businessId&&!r.fulfilled&&r.feedback!=='客户未接受')}}
export function resourceReport(d){const change=(d.now.rate-d.base.rate).toFixed(1),net=d.now.used-d.base.used;return [
 {title:'数据出现了什么变化',state:'已确认',text:`当前出租 ${d.now.used}/${d.now.total} 柜，利用率 ${d.now.rate.toFixed(1)}%；相较基准快照${Number(change)>=0?'增加':'减少'} ${Math.abs(Number(change)).toFixed(1)} 个百分点，已出租机柜净变动 ${net>0?'+':''}${net} 柜。本周期新增出租 ${d.addedCab} 柜，止租至空闲 ${d.releasedCab} 柜；U位新增 ${d.addedU}U、止租 ${d.releasedU}U。`},
 {title:'哪些解释有依据',state:'已确认',text:(d.additions.length+d.releases.length)?`本周期有 ${d.additions.length} 条上架资源记录、${d.releases.length} 条已执行释放记录，均可追溯至需求或止租事项。共享柜内增加或释放U位，只有出租/空闲状态发生变化时才影响机柜利用率。`:'当前尚无已执行的新增上架或止租释放记录，基准与当前一致；待核实事项未计入已释放资源。'},
 {title:'哪些仍需核实',state:'待核实',text:`${d.opportunities.length} 个共享柜同时存在账面U位与功率余量，仍需机房确认可部署性。${d.following.length} 条需求仍在跟进，不能视为已成交；未落地原因需结合沟通记录归类。当前缺少连续月度快照，暂不推断月度趋势。`},
 {title:'识别出的机会与问题',state:'初步判断',text:`可优先检查 ${d.pending.length} 条止租事项并核对实际占用，避免可用资源信息滞后；将共享柜余量与在跟需求匹配。剩余U位分散、功率限制及同柜偏好可能影响承接，不能将全部物理余量直接视为可销售资源。`},
 {title:'建议采取什么动作',state:'建议',text:'运营跟进止租核实并及时更新台账；与网络部逐柜确认空间、功率及分柜条件；将已确认资源匹配在跟需求。后续检查释放资源是否被使用、需求是否落地，以及对应出租柜数是否变化。'}
]}

export function cabinetRanges(ids){
 const columns=new Map();for(const id of ids){const [col,row]=id.split('-').map(Number);if(!columns.has(col))columns.set(col,[]);columns.get(col).push(row)}
 return [...columns.entries()].sort((a,b)=>a[0]-b[0]).map(([col,values])=>{
  const rows=[...new Set(values)].sort((a,b)=>a-b),ranges=[];let from=rows[0],to=from;
  for(const row of rows.slice(1)){if(row===to+1)to=row;else{ranges.push([from,to]);from=to=row}}ranges.push([from,to]);
  return {first:col+'-'+rows[0],text:ranges.map(([from,to])=>from===to?col+'-'+from:col+'-'+from+'—'+col+'-'+to).join('、')};
 });
}
export function cabinetLedgerRows(s, cabinetQuery="", cabinetFilter="all"){const {cabinets}=s;const customerLeaseTerms=new Map(s.terms);
 const groups=new Map();
 for(const c of cabinets){
  if(c.state==='head')continue;
  const occupants=c.usage.length?c.usage:[{name:'—',units:null,power:null}];
  for(const u of occupants){
   const key=u.name==='—'?'empty-'+c.id:u.name;
   if(!groups.has(key))groups.set(key,{customer:u.name,cabinets:[],allocations:[]});
   const group=groups.get(key);group.cabinets.push(c);group.allocations.push(u);
  }
 }
 return [...groups.values()].map(g=>{
  const cs=g.cabinets,ids=cs.map(c=>c.id),full=cs.filter(c=>c.mode==='整柜').length,units=g.allocations.reduce((sum,u)=>sum+(u.units||0),0);
  const modes=[...new Set(cs.filter(c=>c.usage.length||c.state!=='empty').map(c=>c.mode))],states=[...new Set(cs.map(c=>cabinetStates[c.state]))];
  const unique=key=>[...new Set(cs.map(c=>c[key]))].join('、');
  const powers=g.allocations.map(u=>u.power).filter(p=>p!==null&&p!==undefined);
  const minPower=Math.min(...powers),maxPower=Math.max(...powers);
  const powerLabel=!powers.length?'—':(minPower===maxPower?maxPower.toFixed(1):minPower.toFixed(1)+'–'+maxPower.toFixed(1))+' kW/柜';
  return {id:ids[0],cabinetIds:ids,customer:g.customer,ranges:cabinetRanges(ids),mode:modes.join('、')||'—',detail:[full?full+'柜':'',units?units+'U':''].filter(Boolean).join(' + ')||'—',powerLabel,term:customerLeaseTerms.get(g.customer)||'—',startDate:g.allocations.some(u=>u.startDate)?[...new Set(g.allocations.map(u=>u.startDate||'—'))].join('、'):unique('startDate'),stopDate:g.allocations.some(u=>u.stopDate)?[...new Set(g.allocations.map(u=>u.stopDate||'—'))].join('、'):unique('stopDate'),states,state:cs[0].state};
 }).filter(g=>(cabinetFilter==='all'||g.states.includes(cabinetFilter))&&(!cabinetQuery||(g.customer+' '+g.cabinetIds.join(' ')).toLowerCase().includes(cabinetQuery.toLowerCase())));
}
