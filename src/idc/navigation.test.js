import test from 'node:test';
import assert from 'node:assert/strict';
import { IDC_NAVIGATION, resolveWorkbenchTarget } from './navigation.js';
test('eight visible pages resolve to their own groups', () => {
  const pages = IDC_NAVIGATION.flatMap(g => g.pages);
  assert.equal(pages.length, 8); assert.equal(new Set(pages.map(p => p.id)).size, 8);
  IDC_NAVIGATION.forEach(g => g.pages.forEach(p => { const t = resolveWorkbenchTarget({ pageId: p.id }); assert.equal(t.groupId, g.id); assert.equal(t.title, p.label); }));
});
test('invalid targets fall back and legacy chapter targets still resolve', () => {
  for (const target of [undefined, null, {}, { pageId: 'unknown', recordId: 'D-001' }]) assert.deepEqual([resolveWorkbenchTarget(target).pageId, resolveWorkbenchTarget(target).recordId], ['overview', null]);
  assert.equal(resolveWorkbenchTarget({ pageId: 'demand-ledger', recordId: ' D-001 ' }).recordId, 'D-001');
  assert.equal(resolveWorkbenchTarget({ pageId: 'product-catalog' }).pageId, 'products');
  assert.equal(resolveWorkbenchTarget({ pageId: 'business', recordId: {} }).recordId, null);
});
