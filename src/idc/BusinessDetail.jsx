import React, { useState } from 'react';
import { useWorkbench, TextButton, Tag, KV, Field, Logs, ErrorText, Actions, formValues } from './ui';
import { businessAllocations, businessContent, businessTerm, businessReady, demandReady, deliveryStatus, acceptanceStatus, leaseEnd } from './domain';
import { StopDetail } from './pages';
export default function BusinessDetail({ business: b }) {
  const { state: s, run, open, openRecord, locate, openStop } = useWorkbench();
  const [error, setError] = useState('');
  const r = b.r, stopped = ['待终止', '已终止'].includes(b.state);
  const command = action => { const out = run({ ...action, businessId: b.id }); setError(out.error || ''); return out; };
  const tasks = s.stopTasks.filter(t => t.businessId === b.id);
  return <><div className="current"><div className="row"><h3>{b.product} / {businessContent(b)}</h3><Tag>{b.state}</Tag></div><div className="business-steps">{['确认业务', '签约与成交', '交付核验', '更新台账'].map((v, i) => <span key={v} className={(i === 0 || i === 1 && businessReady(b) || i === 2 && r?.acceptance || i === 3 && (r?.fulfilled || b.state === '已终止')) ? 'active' : ''}>{v}</span>)}</div><p>{b.requestId ? '关联需求：' + b.requestId : '存量业务记录'} · 对接商务：{b.owner}</p>{b.requestId && <TextButton onClick={() => openRecord(b.requestId)}>查看来源需求 →</TextButton>}</div>
    <section className="business-block"><h3>业务信息与资源</h3><KV items={[
      ['业务类型', b.type], ['租用方式', r?.kind || (businessAllocations(b)[0]?.units === null ? '整柜' : 'U位')], ['功率', (r ? r.power : businessAllocations(b).map(a => a.power).join(' / ')) + ' kW'], ['统一租期', businessTerm(b)], ['关联柜位', businessAllocations(b).map(a => <TextButton key={a.id} onClick={() => locate(a.id)}>{a.id}柜</TextButton>)], ...(r ? [['带宽 / IP', r.bandwidth + ' ' + r.bandwidthSpec + ' / ' + r.ip + ' ' + r.ipSpec]] : []),
    ]} />{r && !r.fulfilled && !stopped && <><p>{demandReady(s, r) ? '资源反馈可用，交付前仍会检查柜位状态。' : '资源或条件已变化，需要重新关联柜位并核实。'}</p><div className="actions"><TextButton onClick={() => open('allocate', b.id, { businessId: b.id })}>重新关联柜位与核实</TextButton>{r.check?.state === '待反馈' && <TextButton onClick={() => command({ type: 'feedback' })}>收到机房核实反馈</TextButton>}</div></>}</section>
    <section className="business-block"><h3>合同信息</h3><KV items={[
      ['合同状态', b.contract.status], ['合同编号', b.contract.number], ['签约日期', b.contract.signedDate], ['合同总金额（元）', b.contract.amount], ['金额口径', b.contract.tax], ['合同 / 报价确认依据', b.contract.reference],
    ]} /><p className="muted">合同总额单独记录，跨期合同不作为当期收入。实际收入与成本后续关联账单。</p></section>
    <section className="business-block"><h3>业务确认与产品交付</h3>{stopped ? <><p>{b.stopReason} · 止租日期：{b.stopDate}</p>{tasks.map(t => <div className="feedback" key={t.id}><StopDetail task={t} /><TextButton onClick={() => openStop(t.id)}>查看核实与变更 →</TextButton></div>)}</> : <><p>交付状态：{b.state === '签约中' ? '签约后进入交付' : deliveryStatus(s, b)} · 核验结果：{acceptanceStatus(b)}</p><p>业务录入附件：待提供 <button type="button" className="small">催办</button></p>{r?.fulfilled ? <><p>起租时间：{r.acceptance.startDate} · 止租时间：{leaseEnd(r.acceptance.startDate, r.term)}</p><form onSubmit={e => { e.preventDefault(); const v = formValues(e); command({ type: 'requestStop', date: v.stopDate, reason: v.stopReason }); }}><Field label="止租日期" name="stopDate" type="date" required min={r.acceptance.startDate} /><Field label="止租原因" name="stopReason" type="textarea" required maxLength={300} /><Actions><button>登记止租并发起下架核实</button></Actions></form><ErrorText>{error}</ErrorText></> : <><button type="button" className="primary" disabled={b.state === '签约中'} onClick={() => open('acceptance', b.id)}>确认交付核验</button></>}</>}</section><section className="business-block"><h3>处理记录</h3><Logs items={b.logs} /></section>
  </>;
}
