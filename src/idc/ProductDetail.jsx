import React from 'react';
import { Tag, KV } from './ui';
export default function ProductDetail({ product: p }) {
  return <><div className="product-meta"><Tag>{p.category}</Tag><Tag>{p.status}</Tag><small>{p.id} · {p.owner}维护 · {p.updated}更新</small></div>
    <section className="product-detail-section"><h3>产品定义</h3><KV items={[["产品名称", p.name], ['适用场景', p.audience], ['产品规格', p.spec], ['租用权益', p.rights]]} /></section>
    <section className="product-detail-section"><h3>服务与交付</h3><KV items={[
      ['包含服务', '机柜空间托管及对应供电。'], ['另计服务', '带宽、IP一般另行计费，报价前确认需求规格及数量。'], ['交付前提', p.conditions], ['受理限制', p.boundary], ['功率未知时', '客户经理向客户收集服务器数量及单台功率，运营保留估算标记，交网络部核实。'], ['协作角色', '运营匹配产品与资费；客户经理确认客户条件；网络部核实部署可行性。'],
    ]} /></section><section className="product-detail-section"><h3>价格与计费</h3><KV items={[
      ['计费单位', p.billingUnit + '。具体结算周期待确认。'], ['标准资费', '托管报价覆盖机柜与电费。单价、各项计价单位及资费生效时间待补。'], ['功率与报价', '整柜：（机柜价格＋电费价格）×机柜功率；功率取值和单位待确认。U位：单U基准不低于整柜价格的1/12，费用覆盖范围待确认。'], ['优惠条件', '按业务核实优惠资格、审批角色、适用期限及生效范围。'], ['报价准备', '在客户需求中完成单笔方案比较与报价，采用已确认的产品资费口径。'],
    ]} /></section></>;
}
