import React, { useState } from 'react';
import { useWorkbench, TextButton, Tag, Table, Panel, Filter, Search, allOption, Actions, Logs } from './ui';
import { stage, nextTask, missing, demandStages, businessStates, businessContent, businessTerm, deliveryStatus, resourceDiscrepancies } from './domain';
import Icon from './Icon';
import Cabinets from './Cabinets';
import ResourceAnalysis from './ResourceAnalysis';

function Overview() {
  const { state: s, navigate, openRecord } = useWorkbench();
  return <><section className="workbench-welcome"><div className="welcome-copy"><h3>让每一笔需求，都有清晰的下一步</h3><span className="banner-line" /><p>需求跟踪 · 产品选型 · 资源协同</p></div></section>
    <div className="metrics">{['待补信息', '待资源核实', '待方案整理'].map((label, i) => <button type="button" className="metric" key={label} onClick={() => navigate('demands', label)}><span className="metric-icon"><Icon name={['doc', 'server', 'layers'][i]} /></span><span className="metric-value"><span>{label}</span><span><b>{s.records.filter(r => stage(s, r) === label).length}</b> 条</span></span><span className="metric-link">查看需求 <Icon name="arrow" /></span></button>)}</div>
    <div className="overview-grid"><Panel title="当前待处理" className="todo-panel" action={<TextButton onClick={() => navigate('demands')}>全部需求 <Icon name="arrow" /></TextButton>}><div className="todo-scroll"><table className="todo-table"><thead><tr>{['需求', '当前待办', '负责人', '操作'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{s.records.map(r => <tr key={r.id}><td><b>{r.id} {r.customer}</b><small>{r.quantity}</small></td><td><span className="todo-status">{stage(s, r) === '待补信息' ? '补充' + missing(r).join('与') : stage(s, r) === '待资源核实' ? '等待机房资源核实' : stage(s, r) === '待方案整理' ? '整理方案与报价条件' : nextTask(s, r)}</span></td><td>{stage(s, r) === '待补信息' ? r.owner : '运营'}</td><td><TextButton onClick={() => openRecord(r.id)}>查看</TextButton></td></tr>)}</tbody></table></div><p className="table-hint"><Icon name="info" />点击需求，查看完整信息与处理记录</p></Panel>
      <div className="overview-right"><Panel title="快捷入口" className="shortcuts"><div className="shortcut-grid">{[['doc', '需求台账', 'demands'], ['layers', '产品目录', 'products'], ['server', '机柜台账', 'cabinets'], ['shield', '资源核实', 'changes']].map(([icon, title, page]) => <button type="button" key={page} onClick={() => navigate(page)}><Icon name={icon} />{title}</button>)}</div></Panel><Panel title="最近动态" className="activity-panel"><ol className="activity-list">{s.activities.slice(0, 3).map((a, i) => <li key={i}><button type="button" className="activity-link" onClick={() => openRecord(a.stopId || a.id)}>{a.text}</button><time>{a.time}</time></li>)}</ol></Panel></div></div><div className="data-note"><Icon name="info" />当前为预置模拟数据</div></>;
}
function Demands() {
  const { state: s, demandFilter, setDemandFilter, openRecord } = useWorkbench();
  const [query, setQuery] = useState('');
  const rows = s.records.filter(r => (r.customer + r.id).toLowerCase().includes(query.toLowerCase()) && (demandFilter === 'all' || stage(s, r) === demandFilter));
  return <><div className="toolbar"><Search value={query} onChange={setQuery} placeholder="搜索客户、需求编号" /><Filter label="需求阶段" value={demandFilter} onChange={setDemandFilter} options={[allOption('全部阶段'), ...demandStages]} /><span className="count">共 {rows.length} 条需求</span></div><Table headers={['需求编号／客户', '业务类型', '资源需求', '当前阶段', '当前待办', '对接商务', '更新时间', '操作']} className="demand-ledger" empty={!rows.length && '暂无符合条件的需求'}>{rows.map(r => <tr key={r.id}><td><b>{r.id}</b><br />{r.customer}</td><td>{r.type}</td><td>{r.quantity} · {r.kind}<br /><small>{r.power ? r.power + ' kW' : '功率待确认'}</small></td><td><Tag>{stage(s, r)}</Tag></td><td>{nextTask(s, r)}</td><td>{r.owner}</td><td>{r.updated}</td><td><TextButton onClick={() => openRecord(r.id)}>查看</TextButton></td></tr>)}</Table></>;
}
function Businesses() {
  const { state: s, openRecord } = useWorkbench();
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('all');
  const rows = s.businesses.filter(b => (b.id + b.customer + b.contract.number).toLowerCase().includes(query.toLowerCase()) && (filter === 'all' || b.state === filter));
  return <><div className="toolbar"><Search value={query} onChange={setQuery} placeholder="搜索业务编号 / 客户 / 合同编号" /><Filter value={filter} onChange={setFilter} label="业务状态" options={[allOption('全部业务状态'), ...businessStates]} /><span className="count">{rows.length} 条业务</span></div><Table headers={['业务编号', '客户名称', '产品名称', '业务类型', '业务内容', '对接商务', '合同金额（元）', '业务状态', '租用期限', '操作']} className="business-ledger" empty={!rows.length && '暂无符合条件的业务'}>{rows.map(b => <tr key={b.id}><td>{b.id}</td><td>{b.customer}</td><td>{b.product}</td><td>{b.type}</td><td>{businessContent(b)}</td><td>{b.owner}</td><td>{b.contract.amount ? Number(b.contract.amount).toFixed(2) : '待补'}</td><td><Tag>{b.state}</Tag></td><td>{b.ledgerTerm || businessTerm(b)}</td><td><TextButton onClick={() => openRecord(b.id)}>查看</TextButton></td></tr>)}</Table></>;
}
function Products() {
  const { state: s, open } = useWorkbench();
  const [query, setQuery] = useState(''), [category, setCategory] = useState('all'), [status, setStatus] = useState('all');
  const rows = s.products.filter(p => (p.id + p.name).toLowerCase().includes(query.toLowerCase()) && (category === 'all' || p.category === category) && (status === 'all' || p.status === status));
  return <><div className="toolbar"><Search value={query} onChange={setQuery} placeholder="搜索产品名称 / 编号" /><Filter label="产品分类" value={category} onChange={setCategory} options={[allOption('全部分类'), 'IDC托管']} /><Filter label="产品状态" value={status} onChange={setStatus} options={[allOption('全部状态'), '待发布', '审核中', '已发布']} /><span className="count">{rows.length} 项产品</span><button type="button" className="primary add-product-placeholder" disabled title="新增产品功能待细化">新增产品</button></div><Table className="product-ledger" headers={['产品编号', '产品名称', '租用单位', '产品状态', '维护负责人', '操作']} empty={!rows.length && '暂无符合条件的产品'}>{rows.map(p => <tr key={p.id} className="product-ledger-row" tabIndex={0} onClick={() => open('product', p.id)} onKeyDown={e => { if (e.target === e.currentTarget && ['Enter', ' '].includes(e.key)) { e.preventDefault(); open('product', p.id); } }}><td>{p.id}</td><td>{p.name}</td><td>{p.billingUnit}</td><td><Tag>{p.status}</Tag></td><td>{p.owner}</td><td><div className="catalog-actions" onClick={e => e.stopPropagation()}><TextButton onClick={() => open('product', p.id)}>查看</TextButton><TextButton onClick={() => open('editProduct', p.id)}>编辑</TextButton><TextButton onClick={() => open('deleteProduct', p.id)}>删除</TextButton></div></td></tr>)}</Table></>;
}
function Delivery() {
  const { state: s, open } = useWorkbench();
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('all'), [product, setProduct] = useState('all');
  const all = s.businesses.filter(b => b.state !== '签约中');
  const rows = all.filter(b => (b.id + b.customer).toLowerCase().includes(query.toLowerCase()) && (filter === 'all' || deliveryStatus(s, b) === filter) && (product === 'all' || b.product === product));
  return <><div className="acceptance-summary">{['待上架', '待下架', '处理中', '已完成'].map(v => <span key={v}>{v}<b>{all.filter(b => deliveryStatus(s, b) === v).length}</b></span>)}</div><div className="toolbar delivery-toolbar"><Search value={query} onChange={setQuery} placeholder="搜索业务编号 / 客户" /><Filter label="交付状态" value={filter} onChange={setFilter} options={[allOption('全部状态'), '待上架', '待下架', '处理中', '已完成']} /><Filter label="产品名称" value={product} onChange={setProduct} options={[allOption('全部产品'), ...new Set(all.map(b => b.product))]} /></div><Table headers={['业务编号', '客户名称', '产品名称', '业务内容', '租用期限', '交付状态', '操作']} className="acceptance-ledger" empty={!rows.length && '暂无符合条件的交付事项'}>{rows.map(b => <tr key={b.id}><td>{b.id}</td><td>{b.customer}</td><td>{b.product}</td><td>{['待终止', '已终止'].includes(b.state) ? '止租 ' : ''}{businessContent(b)}</td><td>{businessTerm(b)}</td><td><Tag>{deliveryStatus(s, b)}</Tag></td><td><TextButton onClick={() => open(['待终止', '已终止'].includes(b.state) ? 'business' : 'acceptance', b.id)}>{deliveryStatus(s, b) === '已完成' ? '查看' : '核验'}</TextButton></td></tr>)}</Table></>;
}
export function StopDetail({ task }) {
  const { run, open, locate } = useWorkbench();
  const [error, setError] = useState('');
  return <><div className="panel-title"><h3>{task.id} · 止租处理</h3><Tag>{task.status}</Tag></div><p><b>{task.customer}</b> · {task.cabinetId}柜 · {task.mode === '整柜' ? '整柜' : task.units + 'U'} · 上架功率 {task.power} kW</p><Actions><button type="button" onClick={() => locate(task.cabinetId)}>查看机柜位置</button>{task.status !== '已更新台账' && <button type="button" className={task.status === '待核实' ? 'primary' : ''} onClick={() => { const o = run({ type: 'verifyStop', taskId: task.id }); setError(o.error || ''); }}>{task.status === '待核实' ? '收到机房核实反馈' : '重新核实当前占用'}</button>}{task.status === '已确认可释放' && <button type="button" className="primary" onClick={() => open('release', task.id)}>更新台账并释放</button>}</Actions>{error && <p className="acceptance-error" role="alert">{error}</p>}<div className="feedback"><b>核实与变更记录</b><Logs items={task.logs} />{task.before && <><p>变更前：{task.before}</p><p>变更后：{task.after}</p></>}</div></>;
}
function Changes() {
  const { state: s, stopTarget, setStopTarget, openRecord } = useWorkbench();
  const [filter, setFilter] = useState('all');
  const rows = resourceDiscrepancies(s).filter(x => filter === 'all' || x.type === filter);
  const chosen = rows.find(x => x.task === stopTarget)?.task || rows.find(x => x.task)?.task;
  const task = s.stopTasks.find(t => t.id === chosen);
  return <><div className="toolbar"><Filter label="差异类型" value={filter} onChange={setFilter} options={[allOption('全部差异'), { value: 'stop', label: '止租未同步' }, { value: 'allocation', label: '占用不一致' }]} /><span className="muted">对照业务台账与机柜占用，核实并处理差异</span></div><Table headers={['事项编号', '事项类型', '客户', '关联柜位', '处理状态', '操作']} empty={!rows.length && '业务与资源占用暂无待处理差异'}>{rows.map(x => <tr key={x.id}><td>{x.id}</td><td>{x.label}</td><td>{x.customer}</td><td>{x.cabinets}</td><td><Tag>{x.status}</Tag></td><td><TextButton onClick={() => x.task ? setStopTarget(x.task) : openRecord(x.businessId)}>查看处理</TextButton></td></tr>)}</Table>{task && <Panel className="stop-detail"><StopDetail key={task.id} task={task} /></Panel>}</>;
}
export default function Pages({ page }) {
  return <React.Fragment key={page}>{page === 'overview' ? <Overview /> : page === 'demands' ? <Demands /> : page === 'business' ? <Businesses /> : page === 'products' ? <Products /> : page === 'acceptance' ? <Delivery /> : page === 'cabinets' ? <Cabinets /> : page === 'changes' ? <Changes /> : <ResourceAnalysis />}</React.Fragment>;
}
