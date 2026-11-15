import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { IDC_NAVIGATION, resolveWorkbenchTarget } from './navigation';
import { createInitialState, execute } from './domain';
import { WorkbenchContext } from './ui';
import Icon from './Icon';
import Pages from './pages';
import Details from './Details';
import './reference.css';
import './workbench.css';

export default function IdcWorkbench({ initialPage = 'overview', initialRecordId = null, target, onClose, titleId }) {
  const entry = target || { pageId: initialPage, recordId: initialRecordId };
  const [selection, setSelection] = useState(() => resolveWorkbenchTarget(entry));
  const [state, setState] = useState(createInitialState), stateRef = useRef(state);
  const [panels, setPanels] = useState([]), [toast, setToast] = useState('');
  const [demandFilter, setDemandFilter] = useState('all'), [cabinetTarget, setCabinetTarget] = useState('1-2'), [stopTarget, setStopTarget] = useState('T-001');
  const contentRef = useRef(null), serial = useRef(0), id = useId();
  const open = useCallback((kind, recordId, extra = {}) => setPanels(current => [...current, { kind, id: recordId, ...extra, key: ++serial.current }]), []);
  const close = useCallback(() => setPanels(current => current.slice(0, -1)), []);
  const navigate = useCallback((page, filter = 'all') => { setSelection(resolveWorkbenchTarget({ pageId: page })); setDemandFilter(filter); setPanels([]); }, []);
  const locate = useCallback(id => { setCabinetTarget(id); navigate('cabinets'); }, [navigate]);
  const openStop = useCallback(id => { setStopTarget(id); navigate('changes'); }, [navigate]);
  const openRecord = useCallback(record => {
    if (record?.startsWith('B-') && stateRef.current.businesses.some(b => b.id === record)) open('business', record);
    else if (record?.startsWith('D-') && stateRef.current.records.some(r => r.id === record)) open('demand', record);
    else if (record?.startsWith('T-') && stateRef.current.stopTasks.some(t => t.id === record)) openStop(record);
  }, [open, openStop]);
  const run = useCallback(action => {
    const outcome = execute(stateRef.current, action);
    stateRef.current = outcome.state; setState(outcome.state);
    if (!outcome.error) setToast(outcome.message);
    return outcome;
  }, []);
  useEffect(() => {
    const resolved = resolveWorkbenchTarget(target || { pageId: initialPage, recordId: initialRecordId });
    setSelection(resolved); setPanels([]);
    const record = resolved.recordId;
    if (resolved.pageId === 'demands' && stateRef.current.records.some(r => r.id === record)) open('demand', record);
    if (['business', 'acceptance'].includes(resolved.pageId) && stateRef.current.businesses.some(b => b.id === record)) {
      const b = stateRef.current.businesses.find(b => b.id === record);
      open(resolved.pageId === 'acceptance' && b.state !== '签约中' && b.r && !['待终止', '已终止'].includes(b.state) ? 'acceptance' : 'business', record);
    }
    if (resolved.pageId === 'changes' && stateRef.current.stopTasks.some(t => t.id === record)) setStopTarget(record);
    if (resolved.pageId === 'cabinets' && stateRef.current.cabinets.some(c => c.id === record)) setCabinetTarget(record);
    if (resolved.pageId === 'products' && stateRef.current.products.some(p => p.id === record)) open('product', record);
  }, [target?.pageId, target?.recordId, initialPage, initialRecordId, open]);
  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: 'instant' }); }, [selection.pageId]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast, state]);
  const reset = () => { run({ type: 'reset' }); setPanels([]); setDemandFilter('all'); setCabinetTarget('1-2'); setStopTarget('T-001'); };
  const api = { state, run, open, close, navigate, locate, openStop, openRecord, demandFilter, setDemandFilter, cabinetTarget, setCabinetTarget, stopTarget, setStopTarget };
  return <WorkbenchContext.Provider value={api}><div className={'idc ' + (selection.pageId === 'cabinets' ? 'ledger-page' : '')}>
    <header className="app-header"><div className="brand"><span className="brand-cube" aria-hidden="true">◈</span><h1 id={titleId || id}>IDC 运营工作台</h1></div><div className="top-context"><nav className="top-breadcrumb" aria-label="面包屑">{selection.groupLabel}<span>/</span><b>{selection.title}</b></nav><div className="top-user"><button type="button" className="role-selector" aria-haspopup="listbox" aria-label="选择运营人员"><span className="role">运营人员</span><Icon name="chevron" /></button><span className="avatar">运</span>{onClose && <button type="button" className="workbench-close" onClick={onClose} aria-label="关闭工作台" data-idc-close><Icon name="close" /></button>}</div></div></header>
    <div className="layout"><aside className="app-sidebar"><nav aria-label="工作台模块导航">{IDC_NAVIGATION.map(group => group.id === 'overview' ? <button type="button" key={group.id} className={'nav-home ' + (selection.pageId === 'overview' ? 'active' : '')} aria-current={selection.pageId === 'overview' ? 'page' : undefined} onClick={() => navigate('overview')}><Icon name="home" /><span>工作总览</span></button> : <div key={group.id} className="nav-group"><strong><Icon name={group.icon} /><span>{group.label}</span><Icon name="chevron" /></strong>{group.pages.map(page => <button type="button" key={page.id} className={'subnav ' + (selection.pageId === page.id ? 'active' : '')} aria-current={selection.pageId === page.id ? 'page' : undefined} onClick={() => navigate(page.id)}>{page.label}</button>)}</div>)}</nav>{selection.pageId === 'overview' && <div className="sidebar-foot"><Icon name="monitor" />演示模式</div>}</aside>
      <main ref={contentRef}><div className="page-heading"><h2>{selection.title}</h2>{selection.pageId === 'overview' && <button type="button" className="reset-button" onClick={reset}><Icon name="reset" />重置演示</button>}</div><Pages page={selection.pageId} /></main></div>
    {panels.map(panel => <Details key={panel.key} panel={panel} />)}
    {toast && <div className="idc-toast" role="status" key={toast + state.activities.length}>{toast}</div>}
  </div></WorkbenchContext.Provider>;
}
export { IdcWorkbench as IDCWorkbench };
