import test from 'node:test';
import assert from 'node:assert/strict';
import { loadHomeResources } from './homeLoading.js';

function mockResources({ image = 'ready', fonts = 'ready', decodeFails = false } = {}) {
  const originalImage = globalThis.Image;
  const originalDocument = globalThis.document;
  const decoded = [];
  const requests = [];
  globalThis.Image = class {
    set src(value) {
      requests.push(value);
      this.complete = image !== 'pending';
      this.naturalWidth = image === 'ready' ? 1280 : 0;
    }
    decode() { decoded.push(true); return decodeFails ? Promise.reject(new Error('decode failed')) : Promise.resolve(); }
  };
  globalThis.document = { fonts: { load: () => fonts === 'pending' ? new Promise(() => {}) : Promise.resolve(fonts === 'ready' ? [{}] : []) } };
  return { decoded, requests, restore() { globalThis.Image = originalImage; globalThis.document = originalDocument; } };
}

test('cached home images are decoded; only supplied images and four home font faces are awaited', async () => {
  const mock = mockResources();
  try {
    const progress = [];
    const result = await loadHomeResources(['background', 'computer'], { onProgress: (value) => progress.push(value) });
    assert.equal(result.reason, 'ready');
    assert.equal(mock.decoded.length, 2);
    assert.deepEqual(mock.requests, ['background', 'computer']);
    assert.equal(result.total, 6);
    assert.equal(progress.at(-1), 1);
    assert.ok(progress.every((value, index) => index === 0 || value >= progress[index - 1]));
  } finally { mock.restore(); }
});

test('failed assets do not falsely report 100% and still let the visitor enter', async () => {
  const mock = mockResources({ image: 'failed' });
  try {
    const result = await loadHomeResources(['failed-image'], { onProgress() {} });
    assert.equal(result.reason, 'degraded');
    assert.equal(result.ready, 4);
    assert.equal(result.total, 5);
  } finally { mock.restore(); }
});

test('decode failure and unavailable fonts fall back without a false complete count', async () => {
  const mock = mockResources({ decodeFails: true, fonts: 'failed' });
  try {
    const result = await loadHomeResources(['bad-decode'], { onProgress() {} });
    assert.equal(result.reason, 'degraded');
    assert.equal(result.ready, 0);
  } finally { mock.restore(); }
});

test('stalled resources time out without waiting indefinitely', async () => {
  const mock = mockResources({ image: 'pending', fonts: 'pending' });
  try {
    const result = await loadHomeResources(['slow-image'], { timeout: 15, onProgress() {} });
    assert.equal(result.reason, 'timeout');
    assert.equal(result.ready, 0);
  } finally { mock.restore(); }
});

test('unmount cancels the gate and ignores late progress', async () => {
  const mock = mockResources({ image: 'pending', fonts: 'pending' });
  try {
    const controller = new AbortController();
    const progress = [];
    const promise = loadHomeResources(['pending-image'], { signal: controller.signal, onProgress: (value) => progress.push(value) });
    controller.abort();
    assert.equal((await promise).reason, 'aborted');
    assert.deepEqual(progress, [0]);
  } finally { mock.restore(); }
});
