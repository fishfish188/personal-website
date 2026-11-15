import React, { useState } from 'react';
import { useWorkbench, Modal, Field, ErrorText, Actions, Table, formValues } from './ui';
import { missing, eligibleCabinet, cabinetStates } from './domain';
import DemandDetail from './DemandDetail';
import BusinessDetail from './BusinessDetail';
import ProductDetail from './ProductDetail';
import AcceptanceDetail from './AcceptanceDetail';

function Comparison({ r }) {
  const rows = [['空间方案', r.kind === 'U位' ? r.quantity : '需进一步确认实际U数', r.kind === '整柜' ? r.quantity : '同时评估整柜，具体柜数由部署要求确认'], ['功率需求', (r.power ? r.power + ' kW（' + r.powerMode + '）' : '待客户提供或估算') + '，结合柜位功率核实。'], ['部署约束', '确认同柜条件，分柜需客户接受。', '确认可用整柜和扩容空间。'], ['租用期限', (r.term || '待确认') + '。'], ['网络服务', '带宽 ' + r.bandwidth + ' ' + r.bandwidthSpec + '；IP ' + r.ip + ' ' + r.ipSpec + '。一般另计。'], ['计价依据', '核对单U基准、功率和费用范围。', '按所需功率核对整柜报价。'], ['报价金额', '待计价单位及单价确认', '待计价单位及单价确认'], ['适配判断', '运营结合空间、功率、预算、分柜意愿及扩容计划确认推荐方案。']];
  return <><div className="comparison-context"><b>{r.id} · {r.customer}</b><span>{r.quantity} / {r.power ? r.power + ' kW' : '功率待确认'} / {r.term || '租期待确认'}</span></div><Table headers={['比较维度', 'U位托管', '整柜托管']} className="rules-table">{rows.map(([label, u, cabinet]) => <tr key={label}><td>{label}</td><td colSpan={cabinet ? 1 : 2}>{u}</td>{cabinet && <td>{cabinet}</td>}</tr>)}</Table><p className="note">当前先比较需求与方案条件。价格接受度仍需结合客户反馈判断。</p><details className="faq"><summary>价格沟通参考</summary><p>曾有客户预计租用约12–14U、租期一年。运营提出整柜建议并比较两套报价，客户认为单U应按整柜42U均摊，业务最终因价格未落地。具体报价凭证待补充。</p></details></>;
}
function Summary({ r }) {
  const text = `需求编号：${r.id}\n客户：${r.customer}\n需求：${r.kind} / ${r.quantity}\n功率：${r.power ? r.power + ' kW · ' + r.powerMode : '待确认'}\n租期：${r.term || '待确认'}\n带宽：${r.bandwidth} ${r.bandwidthSpec}\nIP：${r.ip} ${r.ipSpec}\n同柜偏好：${r.placement}\n候选产品：${r.candidates.join('、')}\n资源反馈：${r.check?.state === '已反馈' ? r.check.result + '（' + r.check.type + '）' : '待核实'}\n关联柜位：${r.allocations.map(a => a.id + '柜').join('、') || '待关联'}\n价格：待资费规则确认\n待确认事项：${missing(r).join('、') || '核实资费并整理报价'}`;
  return <div className="summarytext">{text}</div>;
}
function EditDemand({ r, reply, error }) {
  const [values, setValues] = useState({ servers: r.servers || '', watts: r.watts || '', power: r.power || '' });
  const updateValue = name => event => {
    const next = { ...values, [name]: event.target.value };
    if (name === 'servers' || name === 'watts') {
      const servers = Number(next.servers), watts = Number(next.watts);
      next.power = servers > 0 && watts > 0 ? String(Number((servers * watts / 1000).toFixed(3))) : '';
    }
    setValues(next);
  };
  return <div className="formgrid">
    <Field name="kind" label="租用意向" value={r.kind} options={['U位', '整柜']} /><Field name="quantity" label="数量或预计范围" value={r.quantity} placeholder="例如 12–14U 或 1柜" maxLength={40} />
    <Field name="powerMode" label="功率状态" value={r.powerMode} options={['待确认', '客户提供', '设备估算']} /><Field name="power" label={<>需求总功率（kW）<br />（机柜额定功率4KW）</>} value={values.power} onChange={updateValue('power')} type="number" min="0.01" step="0.001" placeholder="请输入" />
    {error && <ErrorText>{error}</ErrorText>}
    <Field name="servers" label="服务器数量" value={values.servers} onChange={updateValue('servers')} placeholder="请输入" maxLength={40} /><Field name="watts" label="单台功率（W）" value={values.watts} onChange={updateValue('watts')} placeholder="请输入" maxLength={40} />
    <Field name="term" label="预计租期（月）" value={r.term} type="number" min="1" step="1" placeholder="请输入" /><Field name="placement" label="同柜要求" value={r.placement} options={['待确认', '必须同柜', '可接受分柜']} />
    <Field name="bandwidth" label="带宽需求" value={r.bandwidth} options={['待确认', '需要', '不需要']} /><Field name="bandwidthSpec" label="带宽规格" value={r.bandwidthSpec} placeholder="请输入" maxLength={60} />
    <Field name="ip" label="IP 需求" value={r.ip} options={['待确认', '需要', '不需要']} /><Field name="ipSpec" label="IP 数量／说明" value={r.ipSpec} placeholder="请输入" maxLength={60} />
    <Field name="source" label="信息来源" value={reply ? '商务录入' : '运营代录入'} options={['商务录入', '运营代录入']} full />
  </div>;
}
function ProductUnitFields({ value }) {
  const [units, setUnits] = useState([String(value || '')]);
  return <label className="full product-units-field"><span>租用单位</span><div className="product-unit-list">{units.map((unit, index) => <div className="product-unit-row" key={index}><input name="unit" defaultValue={unit} placeholder="如柜/U位" autoComplete="off" /><button type="button" className="add-field" aria-label="添加规格项" onClick={() => setUnits(current => [...current, ''])}>+</button></div>)}</div></label>;
}
export default function Details({ panel }) {
  const { state: s, run, close, open } = useWorkbench();
  const [error, setError] = useState('');
  const { kind, id } = panel, b = s.businesses.find(b => b.id === (panel.businessId || id));
  const r = panel.businessId ? b?.r : s.records.find(r => r.id === id), p = s.products.find(p => p.id === id), t = s.stopTasks.find(t => t.id === id);
  const submit = action => { const out = run({ ...action, id, businessId: panel.businessId }); setError(out.error || ''); if (!out.error) close(); return out; };
  if (kind === 'demand' && r) return <Modal title={r.customer + (r.businessId ? '' : ' / ' + r.quantity)} subtitle={r.id + ' · ' + r.type + ' · 需求'} drawer onClose={close}><DemandDetail record={r} /></Modal>;
  if (kind === 'business' && b) return <Modal title={b.id + ' · ' + b.customer} drawer onClose={close}><BusinessDetail business={b} /></Modal>;
  if (kind === 'acceptance' && b?.r && b.state !== '签约中') return <Modal title={b.id + ' · 交付核验'} drawer onClose={close}><AcceptanceDetail business={b} /></Modal>;
  if (kind === 'product') return <Modal title={p?.name || '产品信息'} drawer onClose={close}>{p ? <ProductDetail product={p} /> : <p>当前产品条目已删除，历史业务信息仍保留。</p>}</Modal>;
  if (kind === 'comparison' && r) return <Modal title={'方案比较 · ' + id} onClose={close}><Comparison r={r} /></Modal>;
  if (kind === 'summary' && r) return <Modal title="供商务沟通的方案摘要" onClose={close}><Summary r={r} /></Modal>;
  if (kind === 'deleteProduct' && p) return <Modal title="删除产品" onClose={close}><p>确认删除目录中的「{p.name}」？已建立的业务保留产品名称快照及历史记录。</p><ErrorText>{error}</ErrorText><Actions><button type="button" onClick={close}>取消</button><button type="button" className="primary" onClick={() => submit({ type: 'deleteProduct' })}>确认删除</button></Actions></Modal>;
  if (kind === 'release' && t) return <Modal title="确认更新台账" onClose={close}><p>确认释放 <b>{t.customer}</b> 在 <b>{t.cabinetId}柜</b> 的 {t.mode === '整柜' ? '整柜' : t.units + 'U'}占用。</p><p>本次释放功率 {t.power} kW。</p><p className="note">按本次确认的客户占用释放资源，处理结果将同步至机柜台账和业务动态。</p><ErrorText>{error}</ErrorText><Actions><button type="button" onClick={close}>取消</button><button type="button" className="primary" onClick={() => submit({ type: 'release', taskId: t.id })}>确认释放</button></Actions></Modal>;
  if (kind === 'editProduct' && p) return <Modal title={'编辑产品 ' + p.id} onClose={close}><form className="input-modal-form edit-demand-form edit-product-form" onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget), v = Object.fromEntries(data), billingUnit = data.getAll('unit').map(item => item.trim()).filter(Boolean).join(' / '); submit({ type: 'editProduct', values: { name: v.name.trim(), owner: v.owner.trim(), billingUnit, spec: v.spec.trim(), conditions: v.conditions.trim() } }); }}><div className="formgrid"><Field label="产品编号" name="productId" value={p.id} placeholder="按顺序编码，IDC托管默认为001" readOnly /><Field label="产品名称" name="name" value={p.name} required /><Field label="维护负责人" name="owner" value={p.owner} options={['运营A', '运营B']} /><ProductUnitFields value={p.billingUnit} /><Field label="产品规格" name="spec" value={p.spec} type="textarea" full required /><Field label="交付前提" name="conditions" value={p.conditions} type="textarea" full required /></div><ErrorText>{error}</ErrorText><Actions><button type="button" onClick={close}>取消</button><button className="primary">保存</button></Actions></form></Modal>;
  if (!r) return null;
  const titles = { editDemand: panel.reply ? '录入商务回复' : '补录需求信息', request: '请商务补充信息', candidates: '选择候选产品', consult: '发起资源核实', allocate: '关联候选柜位' };
  const saveLabels = { editDemand: '保存信息', request: '推送', candidates: '保存候选产品', consult: '推送', allocate: '关联并发起核实' };
  const handleSubmit = e => {
    e.preventDefault(); const data = new FormData(e.currentTarget), v = Object.fromEntries(data);
    if (kind === 'editDemand') submit({ type: 'editDemand', values: v });
    if (kind === 'request') submit({ type: 'request', recipient: v.recipient, message: v.message, fields: data.getAll('field') });
    if (kind === 'candidates') submit({ type: 'candidates', products: data.getAll('product') });
    if (kind === 'allocate') submit({ type: 'allocate', ids: data.getAll('cabinet') });
    if (kind === 'consult') {
      if (v.type === '正式资源核实' && Number(r.power) > 0 && !r.allocations.length) { close(); open('allocate', r.id); return; }
      submit({ type: 'consult', checkType: v.type, question: v.question.trim() });
    }
  };
  return <Modal title={titles[kind]} onClose={close}><form className={['editDemand', 'request', 'consult'].includes(kind) ? 'input-modal-form edit-demand-form' : ''} onSubmit={handleSubmit}>
    {kind === 'editDemand' && <EditDemand r={r} reply={panel.reply} error={error} />}
    {kind === 'request' && <><Field label="接收人" name="recipient" value={r.owner} required maxLength={50} /><Field label="补充说明" name="message" type="textarea" maxLength={300} placeholder="例如请客户提供服务器数量与单台功率" /></>}
    {kind === 'candidates' && <>{[['U位托管', '按 U 租用，核实空间、功率和同柜／分柜条件。'], ['整柜托管', '独立使用整柜，核实可用柜位和功率。']].map(([name, hint]) => <label className="check" key={name}><input type="checkbox" name="product" value={name} defaultChecked={r.candidates.includes(name)} /><span><b>{name}</b><br /><small>{hint}</small></span></label>)}</>}
    {kind === 'consult' && <><div className="note">{r.id} · {r.quantity} · {r.power ? r.power + ' kW' : '功率待确认'}；缺失项：{missing(r).join('、') || '无'}</div><Field label="核实类型" name="type" value={r.power && r.powerMode !== '待确认' ? '正式资源核实' : '初步资源咨询'} options={['初步资源咨询', '正式资源核实']} /><Field label="负责团队" value="机房团队／网络部" readOnly /><Field label="本次要确认的问题" name="question" type="textarea" required maxLength={300} value={r.power ? '请核实所需空间、功率，以及同柜／分柜部署可行性。' : '功率待补，请先确认是否有可能承接所需空间，后续补齐功率再正式核实。'} /></>}
    {kind === 'allocate' && <><p className="note">{r.id} · {r.kind} {r.quantity} · 总功率 {r.power || '待确认'} kW；柜位匹配以42U和4 kW上限做初筛，最终由机房确认。</p><div className="allocation-options">{s.cabinets.filter(c => eligibleCabinet(s, c, r)).map(c => <label className="check allocation-option" key={c.id}><input type="checkbox" name="cabinet" value={c.id} defaultChecked={r.allocations.some(a => a.id === c.id)} /><span><b>{c.id}柜</b> · {cabinetStates[c.state]}<br /><small>物理空余 {42 - (c.occupied || 0)}U · 剩余功率 {(4 - c.power).toFixed(1)} kW</small></span></label>)}</div></>}
    {kind !== 'editDemand' && <ErrorText>{error}</ErrorText>}<Actions><button type="button" onClick={close}>取消</button><button className="primary">{saveLabels[kind]}</button></Actions></form></Modal>;
}
