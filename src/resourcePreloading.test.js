import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoPreloader, createImagePreloader, demoResources, stagesToPreload } from './resourcePreloading.js';

function mockFrames() {
  const frames = [];
  return {
    frames,
    createFrame: () => ({
      style: {}, attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      remove() { this.removed = true; },
    }),
    attachFrame: (frame) => frames.push(frame),
  };
}

test('demo preloads warm each URL once, remain noninteractive and clean up on load', async () => {
  const mocks = mockFrames();
  const preloader = createDemoPreloader(mocks);
  const first = preloader.preload(demoResources.ai);
  assert.equal(preloader.preload(demoResources.ai), first);
  const second = preloader.preload(demoResources.poster);
  assert.equal(mocks.frames.length, 2);
  for (const frame of mocks.frames) {
    assert.equal(frame.loading, 'eager');
    assert.equal(frame.attributes['aria-hidden'], 'true');
    assert.equal(frame.inert, true);
    assert.equal(frame.tabIndex, -1);
    frame.onload();
    assert.equal(frame.removed, true);
    assert.equal(frame.onload, null);
  }
  assert.deepEqual(await Promise.all([first, second]), [true, true]);
  await preloader.preload(demoResources.ai);
  assert.equal(mocks.frames.length, 2);
});

test('demo preload errors and timeouts release hidden frames without blocking entry', async () => {
  const mocks = mockFrames();
  const preloader = createDemoPreloader({ ...mocks, timeout: 15 });
  const failed = preloader.preload(demoResources.ai);
  mocks.frames[0].onerror();
  const stalled = preloader.preload(demoResources.poster);
  assert.deepEqual(await Promise.all([failed, stalled]), [false, false]);
  assert.ok(mocks.frames.every((frame) => frame.removed));
});

function mockImages({ cached = false, decodeFails = false } = {}) {
  const images = [];
  const decoded = [];
  const createImage = () => {
    const image = {
      complete: cached,
      naturalWidth: cached ? 100 : 0,
      decode() {
        decoded.push(this.src);
        return decodeFails ? Promise.reject(new Error('decode failed')) : Promise.resolve();
      },
      load() { this.naturalWidth = 100; this.complete = true; this.onload?.(); },
      fail() { this.onerror?.(); },
    };
    images.push(image);
    return image;
  };
  return { createImage, images, decoded };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

test('no request before activation; downloads are bounded and decoded before publication', async () => {
  const mock = mockImages();
  const pool = createImagePreloader({ ...mock, concurrency: 2 });
  assert.equal(mock.images.length, 0);
  const result = pool.preload(['a', 'b', 'c']);
  assert.deepEqual(mock.images.map((image) => image.src), ['a', 'b']);
  assert.equal(pool.isSettled('a'), false);
  mock.images[0].load();
  assert.equal(pool.isSettled('a'), false);
  await flush();
  assert.equal(pool.isSettled('a'), true);
  assert.deepEqual(mock.images.map((image) => image.src), ['a', 'b', 'c']);
  mock.images[1].load();
  mock.images[2].load();
  assert.deepEqual(await result, [true, true, true]);
  assert.deepEqual(mock.decoded, ['a', 'b', 'c']);
});

test('repeated activation, shared URLs and cached images do not create duplicate preload requests', async () => {
  const mock = mockImages({ cached: true });
  const pool = createImagePreloader(mock);
  await Promise.all([pool.preload(['shared', 'shared', 'next']), pool.preload(['shared'])]);
  await pool.preload(['next', 'shared']);
  assert.deepEqual(mock.images.map((image) => image.src), ['shared', 'next']);
  assert.equal(pool.isSettled('unrequested'), false);
});

test('navigation and project intent promote queued target images ahead of background work', async () => {
  const mock = mockImages();
  const pool = createImagePreloader({ ...mock, concurrency: 1 });
  const background = pool.preload(['active', 'background', 'target']);
  const target = pool.preload(['target'], { priority: true });
  mock.images[0].load();
  await flush();
  assert.equal(mock.images[1].src, 'target');
  assert.equal(mock.images[1].fetchPriority, 'high');
  mock.images[1].load();
  await target;
  mock.images[2].load();
  await background;
});

test('resource subscriptions stop notifying detached images', async () => {
  const mock = mockImages();
  const pool = createImagePreloader(mock);
  let calls = 0;
  const unsubscribe = pool.subscribe('asset', () => { calls += 1; });
  const result = pool.preload(['asset']);
  unsubscribe();
  mock.images[0].load();
  await result;
  assert.equal(calls, 0);
});

test('failed or undecodable images release their slots and allow normal image fallback', async () => {
  const mock = mockImages({ decodeFails: true });
  const pool = createImagePreloader({ ...mock, concurrency: 1 });
  const result = pool.preload(['missing', 'invalid']);
  mock.images[0].fail();
  mock.images[1].load();
  assert.deepEqual(await result, [false, false]);
  assert.equal(pool.isSettled('missing'), true);
  assert.equal(pool.isSettled('invalid'), true);
});

test('stalled requests time out rather than blocking later stages indefinitely', async () => {
  const mock = mockImages();
  const pool = createImagePreloader({ ...mock, concurrency: 1, timeout: 15 });
  assert.deepEqual(await pool.preload(['slow', 'next']), [false, false]);
  assert.equal(mock.images.length, 2);
  assert.equal(pool.isSettled('next'), true);
});

test('stages load ahead of reveals; direct jumps prioritize the destination, reverse scrolling reuses earlier groups', () => {
  const names = (distance) => stagesToPreload(distance).map((stage) => stage.name);
  assert.deepEqual(names(0), ['about']);
  assert.deepEqual(names(599), ['about']);
  assert.deepEqual(names(600), ['ai', 'about']);
  assert.deepEqual(names(2600), ['ux', 'ai', 'about']);
  assert.deepEqual(names(4700), ['contact', 'ux', 'ai', 'about']);
  assert.deepEqual(names(6700), names(4700));
  assert.deepEqual(names(300), ['about']);
});
