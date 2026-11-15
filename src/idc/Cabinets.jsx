import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useWorkbench, TextButton, Filter, Search, allOption } from './ui';
import { cabinetStates, cabinetLedgerRows } from './domain';
export default function Cabinets() {
  const { state: s, cabinetTarget, setCabinetTarget } = useWorkbench();
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('all'), [page, setPage] = useState(1), [message, setMessage] = useState(0), [tip, setTip] = useState(null);
  const map = useRef(null), drag = useRef(null), dragged = useRef(false);
  const rows = cabinetLedgerRows(s, query, filter), pages = Math.max(1, Math.ceil(rows.length / 4)), current = Math.min(page, pages);
  const locate = (id, sync = true) => {
    setCabinetTarget(id); setTip(null);
    if (sync) { const all = cabinetLedgerRows(s); setQuery(''); setFilter('all'); setPage(Math.floor(Math.max(0, all.findIndex(r => r.cabinetIds.includes(id))) / 4) + 1); }
  };
  useLayoutEffect(() => {
    const cell = map.current?.querySelector(`[data-cab="${cabinetTarget}"]`);
    if (cell) map.current.scrollTo({ left: Math.max(0, cell.offsetLeft - map.current.clientWidth / 2 + 62), behavior: 'instant' });
  }, [cabinetTarget]);
  useEffect(() => { const all = cabinetLedgerRows(s); setPage(Math.floor(Math.max(0, all.findIndex(r => r.cabinetIds.includes(cabinetTarget))) / 4) + 1); }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => { if (!document.hidden) setMessage(m => (m + 1) % s.weeklyMessages.length); }, 5500);
    return () => clearInterval(timer);
  }, [s.weeklyMessages.length]);
  useEffect(() => { setMessage(0); }, [s.weeklyMessages]);
  const showTip = (e, c) => { if (drag.current || dragged.current) return; const bounds = e.currentTarget.getBoundingClientRect(); setTip({ c, left: Math.max(16, Math.min(window.innerWidth - 270, bounds.left)), top: bounds.top + 32 }); };
  const finish = e => { drag.current = null; if (map.current?.hasPointerCapture(e.pointerId)) map.current.releasePointerCapture(e.pointerId); map.current?.classList.remove('dragging'); };
  const news = s.weeklyMessages[message % s.weeklyMessages.length];
  return <><section className="panel floor-panel" aria-label="机房平面图"><div ref={map} className="floor-map" aria-label="可横向拖动的机柜平面图" tabIndex={0}
    onPointerDown={e => { if (e.button !== 0) return; drag.current = { x: e.clientX, left: map.current.scrollLeft }; dragged.current = false; }}
    onPointerMove={e => { if (!drag.current) return; const delta = e.clientX - drag.current.x; if (Math.abs(delta) > 4) { dragged.current = true; setTip(null); map.current.setPointerCapture(e.pointerId); map.current.classList.add('dragging'); map.current.scrollLeft = drag.current.left - delta; } }}
    onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={() => { drag.current = null; }} onScroll={() => setTip(null)} onKeyDown={e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); map.current.scrollBy({ left: e.key === 'ArrowRight' ? 180 : -180, behavior: 'smooth' }); } if (e.key === 'Escape') setTip(null); }}>
    <div className="floor-canvas"><div className="floor-banks">{Array.from({ length: 5 }, (_, bank) => <div key={bank} className="cab-bank"><div className="bank-cabinets">{[bank * 2 + 1, bank * 2 + 2].map(col => <div className="cab-column" key={col} aria-label={'第' + col + '列'}>{Array.from({ length: 10 }, (_, row) => {
      const c = s.cabinets.find(c => c.col === col && c.row === row + 1);
      if (!c) return <span key={row} className="cab-gap" aria-hidden="true" />;
      const label = c.id + '柜：' + (c.usage.map(u => u.name).join('、') || (c.state === 'head' ? '列头柜' : c.state === 'reserved' ? '待上架' : '空闲'));
      return <button key={c.id} type="button" data-cab={c.id} className={'cab-cell ' + c.state + (c.id === cabinetTarget ? ' selected' : '')} aria-label={label + '，' + cabinetStates[c.state]} aria-pressed={c.id === cabinetTarget} onClick={e => { if (!dragged.current) { locate(c.id); showTip(e, c); } }} onPointerEnter={e => showTip(e, c)} onPointerLeave={() => setTip(null)} onFocus={e => showTip(e, c)} onBlur={() => setTip(null)}><span>{label}</span></button>;
    })}</div>)}</div></div>)}</div></div></div>
    <div className="map-bottom"><section className="weekly-box" aria-label="本周业务动态"><b className="weekly-label">本周业务动态</b><div className="weekly-items"><button type="button" onClick={() => locate(news.id)}><span className="news-type">{news.type}</span><b>{news.id}柜</b><span className="news-text">{news.text}</span><time>{news.day}</time></button></div></section><div className="floor-legend">{[['full', '使用中'], ['empty', '空闲'], ['reserved', '待上架'], ['pending', '止租']].map(([state, text]) => <span key={state}><i className={state} />{text}</span>)}</div></div></section>
    <section className="panel cabinet-ledger"><div className="ledger-heading"><h3>机柜台账</h3><div className="ledger-filters"><Search value={query} placeholder="搜索柜号 / 客户" onChange={v => { setQuery(v); setPage(1); }} /><Filter label="机柜业务状态" value={filter} onChange={v => { setFilter(v); setPage(1); }} options={[allOption('全部状态'), '待上架', '使用中', '空闲', '止租']} /></div></div><div className="cabinet-table-region"><table className="cabinet-table"><thead><tr>{['客户名称', '柜号', '业务状态', '租用方式', '占用明细', '上架功率', '租用期限', '起租时间', '止租时间'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{rows.slice((current - 1) * 4, current * 4).map(r => <tr key={r.id + r.customer} className={r.cabinetIds.includes(cabinetTarget) ? 'selected' : ''} onClick={() => locate(r.id, false)}><td>{r.customer}</td><td className="cabinet-ids">{r.ranges.map(range => <TextButton key={range.first} onClick={e => { e.stopPropagation(); locate(range.first, false); }}>{range.text}</TextButton>)}</td><td><span className={'cab-status ' + r.state}>{r.states.join('、')}</span></td><td>{r.mode}</td><td>{r.detail}</td><td>{r.powerLabel}</td><td>{r.term}</td><td>{r.startDate}</td><td>{r.stopDate}</td></tr>)}</tbody></table>{!rows.length && <div className="cabinet-empty">无符合条件的柜位</div>}</div><div className="ledger-footer"><div><button type="button" disabled={current <= 1} onClick={() => setPage(current - 1)}>上一页</button><span>{current} / {pages}</span><button type="button" disabled={current >= pages} onClick={() => setPage(current + 1)}>下一页</button></div></div></section>
    {tip && <div className="cab-tooltip" role="tooltip" style={{ left: tip.left, top: tip.top }}><b>{tip.c.id}柜 <span>{cabinetStates[tip.c.state]}</span></b>{tip.c.usage.length ? tip.c.usage.map((u, i) => <p key={i}>{u.name}：<strong>{u.units === null ? '整柜' : u.units + 'U'}</strong></p>) : <p>{tip.c.state === 'head' ? '列头配电设施' : tip.c.state === 'reserved' ? '已预留资源，等待设备上架' : '暂无客户占用'}</p>}<small>功率 {tip.c.power.toFixed(1)} / 4.0 kW</small></div>}
  </>;
}
