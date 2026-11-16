import React, { useState } from 'react';
import { Tag, KV } from './ui';

const rates = {
  柜: { unit: '元/年/机柜', values: ['12000', '24000', '36000', '48000'] },
  U位: { unit: '元/年/U', values: ['1000', '2000', '3000', '4000'] },
};

export default function ProductDetail({ product: p }) {
  const [billingUnit, setBillingUnit] = useState('柜');
  const rate = rates[billingUnit];
  return <><div className="product-meta"><Tag>{p.category}</Tag><Tag>{p.status}</Tag><small>{p.id} · {p.owner}维护 · {p.updated}更新</small></div>
    <section className="product-detail-section"><h3>产品定义</h3><KV items={[["产品名称", p.name], ['适用场景', p.audience], ['产品规格', p.spec], ['租用权益', p.rights]]} /></section>
    <section className="product-detail-section pricing-section"><h3>价格与计费</h3><div className="pricing-unit-switch" role="tablist" aria-label="计费单位">{Object.keys(rates).map(unit => <button type="button" role="tab" aria-selected={billingUnit === unit} className={billingUnit === unit ? 'active' : ''} key={unit} onClick={() => setBillingUnit(unit)}>{unit}</button>)}</div><div className="rate-table-wrap"><table className="rate-table"><tbody><tr><th>机柜功率（kW）</th>{['2.2', '2.5', '3', '4'].map(power => <td key={power}>{power}</td>)}</tr><tr><th>销售基准价格（{rate.unit}）</th>{rate.values.map(value => <td key={value}>{value}</td>)}</tr></tbody></table></div><KV items={[
      ['优惠条件', '根据业务情况另行发起审批'], ['报价准备', '在客户需求中完成单笔方案比较与报价，采用已确认的产品资费口径。'],
    ]} /></section>
    <section className="product-detail-section"><h3>服务与交付</h3><KV items={[
      ['包含服务', '含机柜空间托管及相应额定电量'], ['另计服务', '客户设备上架安装、配电，每台设备300元；IDC带宽10000元/年/100M，含标准可用2个IPV4地址（超出IP 50元/个/月）'], ['交付前提', p.conditions], ['受理限制', '单机柜额定功率为4KW，上架设备功率不得超过'], ['功率未知时', '客户经理向客户收集服务器数量及单台功率，运营保留估算标记，交网络部核实。'], ['协作角色', '运营匹配产品与资费；客户经理确认客户条件；网络部核实部署可行性。'],
    ]} /></section></>;
}
