import test from 'node:test';
import assert from 'node:assert/strict';
import { constrainImageView } from './imagePreviewGeometry.js';

const bounds = { imageWidth: 844, imageHeight: 562, viewportWidth: 1183, viewportHeight: 633 };

test('images that fit the viewport stay centered', () => {
  assert.deepEqual(constrainImageView({ zoom: 1, x: 100, y: -100 }, bounds), { zoom: 1, x: 0, y: 0 });
});

test('all enlarged image edges can be reached without dragging past them', () => {
  assert.deepEqual(constrainImageView({ zoom: 3, x: 9999, y: 9999 }, bounds), { zoom: 3, x: 674.5, y: 526.5 });
  assert.deepEqual(constrainImageView({ zoom: 3, x: -9999, y: -9999 }, bounds), { zoom: 3, x: -674.5, y: -526.5 });
});

test('panning inside the image bounds is unchanged', () => {
  assert.deepEqual(constrainImageView({ zoom: 2, x: 150, y: -90 }, bounds), { zoom: 2, x: 150, y: -90 });
});

test('a wide short image can pan horizontally while staying centered vertically', () => {
  assert.deepEqual(constrainImageView({ zoom: 3, x: 500, y: 500 }, { ...bounds, imageHeight: 176 }), { zoom: 3, x: 500, y: 0 });
});

test('zooming out recenters the image and retains the existing zoom limits', () => {
  assert.deepEqual(constrainImageView({ zoom: 0.2, x: 674.5, y: 526.5 }, bounds), { zoom: 0.5, x: 0, y: 0 });
  assert.deepEqual(constrainImageView({ zoom: 4, x: 9999, y: 9999 }, bounds), { zoom: 3, x: 674.5, y: 526.5 });
});

test('resizing the viewport clamps the current pan to the new visible bounds', () => {
  assert.deepEqual(constrainImageView({ zoom: 2, x: 250, y: 240 }, { ...bounds, viewportWidth: 1500, viewportHeight: 1000 }), { zoom: 2, x: 94, y: 62 });
});
