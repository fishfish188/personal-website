import React, { useState } from 'react';
import { useWorkbench, Tag, TextButton, Field, ErrorText } from './ui';
import { acceptanceItems, acceptanceSnapshot, acceptanceStatus, demandReady, leaseEnd } from './domain';
export default function AcceptanceDetail({ business: b }) {
  const { state: s, run, openRecord, locate } = useWorkbench();
  const [error, setError] = useState('');
  const r = b.r, a = r.acceptance || {}, done = r.fulfilled, snapshot = acceptanceSnapshot(b), stale = !done && a.snapshot && a.snapshot !== snapshot;
  const [startDate, setStartDate] = useState(a.startDate || '');
  const submit = (form, finalize) => {
    const data = new FormData(form), items = {};
    setStartDate(data.get('startDate'));
    acceptanceItems.forEach(i => { items[i.id] = { status: data.get(i.id + 'Status'), note: data.get(i.id + 'Note').trim() }; });
    const out = run({ type: 'saveAcceptance', businessId: b.id, snapshot, items, startDate: data.get('startDate'), finalize }); setError(out.error || '');
  };
  return <><div className="current"><h3>{r.customer} <Tag>{acceptanceStatus(b)}</Tag></h3><p>{r.kind} / {r.quantity} / {r.power} kW / {r.term}</p><p>关联柜位：{r.allocations.map(a => a.id + '柜').join('、')}</p><TextButton onClick={() => openRecord(b.id)}>查看业务与成交信息 →</TextButton></div>{stale && <ErrorText>需求、方案或资源条件已变化，原核验结果已失效，请重新逐项确认。</ErrorText>}{!done && !demandReady(s, r) && <ErrorText>当前需求或资源条件不满足上线要求，请先返回业务重新核实。</ErrorText>}
    <form className="input-modal-form acceptance-form" key={snapshot} onSubmit={e => { e.preventDefault(); submit(e.currentTarget, true); }}><fieldset disabled={done}>{acceptanceItems.map(i => { const v = stale ? {} : a.items?.[i.id] || {}; return <section className="acceptance-item" key={i.id}><h3>{i.title}</h3><p>{i.hint}</p><Field label="核验结果" name={i.id + 'Status'} value={v.status || 'pending'} options={[{ value: 'pending', label: '待核验' }, { value: 'pass', label: '通过' }, { value: 'blocked', label: '未通过，需处理' }]} /><Field label="核验依据 / 待处理事项" name={i.id + 'Note'} value={v.note || ''} type="textarea" placeholder="填写核验依据、反馈来源或异常原因" /></section>; })}<section className="acceptance-item"><label><span>起租时间</span><input name="startDate" type="date" value={done ? a.startDate : startDate} onInput={e => setStartDate(e.currentTarget.value)} onChange={e => setStartDate(e.target.value)} /></label><p>按需求中统一租期计算止租时间；保存后展示结果。</p></section></fieldset><p>止租时间：{(done ? a.startDate : startDate) ? leaseEnd(done ? a.startDate : startDate, r.term) : '待确认'}</p><ErrorText>{error}</ErrorText>{done ? <p className="note">验收完成：{a.completedAt} · 运营<br />机柜台账与业务动态已同步。<button type="button" onClick={() => locate(r.allocations[0].id)}>查看关联机柜</button></p> : <div className="acceptance-actions"><button type="button" onClick={e => submit(e.currentTarget.form, false)}>保存核验进度</button><button className="primary">确认验收并登记上架</button></div>}</form>
  </>;
}
