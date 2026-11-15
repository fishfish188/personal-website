export const IDC_NAVIGATION = [
  { id: 'overview', label: '工作总览', icon: 'home', pages: [{ id: 'overview', label: '工作总览' }] },
  { id: 'demands', label: '需求管理', icon: 'doc', pages: [{ id: 'demands', label: '需求台账' }, { id: 'business', label: '业务台账' }] },
  { id: 'products', label: '产品管理', icon: 'layers', pages: [{ id: 'products', label: '产品目录' }, { id: 'acceptance', label: '产品交付' }] },
  { id: 'resources', label: '资源管理', icon: 'server', pages: [{ id: 'cabinets', label: '机柜台账' }, { id: 'changes', label: '资源核实与变更' }] },
  { id: 'analysis', label: '经营分析', icon: 'analysis', pages: [{ id: 'resourceAnalysis', label: '资源经营' }] },
];
const aliases = { today: 'overview', 'demand-ledger': 'demands', 'product-catalog': 'products', 'launch-review': 'acceptance', 'cabinet-ledger': 'cabinets', 'resource-verification': 'changes' };
const pages = IDC_NAVIGATION.flatMap(group => group.pages.map(page => ({ pageId: page.id, title: page.label, groupId: group.id, groupLabel: group.label })));
export function resolveWorkbenchTarget(target) {
  const id = aliases[target?.pageId] || target?.pageId;
  const page = pages.find(item => item.pageId === id);
  return { ...(page || pages[0]), recordId: page && typeof target?.recordId === 'string' && target.recordId.trim() ? target.recordId.trim() : null };
}
