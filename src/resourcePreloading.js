export const primaryResourceStages = [
  { name: 'about', at: 0, selector: '.about-tail-temporary-content' },
  { name: 'ai', at: 600, selector: '.about-ai-object-layer, .image-button, .arrow2' },
  { name: 'ux', at: 2600, selector: '.ux-explore-project, .click-hint, .browser-window-frame' },
  { name: 'contact', at: 4700, selector: '.contact-card' },
];

export function stagesToPreload(distance) {
  return primaryResourceStages.filter((stage) => distance >= stage.at).reverse();
}

export const demoResources = {
  ai: { src: 'https://interest-tool-demo.pages.dev', width: 430, height: 943 },
  poster: { src: 'https://lottery-h5.netlify.app', width: 662, height: 536 },
};

export function createDemoPreloader({
  timeout = 12000,
  createFrame = () => document.createElement('iframe'),
  attachFrame = (frame) => document.body.appendChild(frame),
} = {}) {
  const requests = new Map();
  return {
    preload({ src, width, height }) {
      if (requests.has(src)) return requests.get(src);
      const frame = createFrame();
      frame.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;height:${height}px;visibility:hidden;pointer-events:none;border:0;`;
      frame.tabIndex = -1;
      frame.inert = true;
      frame.setAttribute('aria-hidden', 'true');
      frame.title = 'Demo resource preload';
      frame.loading = 'eager';
      // Warm document/subresource caches without holding up the home loading gate.
      const request = new Promise((resolve) => {
        let finished = false;
        const finish = (loaded) => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          frame.onload = null;
          frame.onerror = null;
          frame.remove();
          resolve(loaded);
        };
        const timer = setTimeout(() => finish(false), timeout);
        frame.onload = () => finish(true);
        frame.onerror = () => finish(false);
        frame.src = src;
        attachFrame(frame);
      });
      requests.set(src, request);
      return request;
    },
  };
}

export function createImagePreloader({ concurrency = 4, timeout = 8000, createImage = () => new Image() } = {}) {
  const records = new Map();
  const listeners = new Map();
  const queue = [];
  let active = 0;

  const drain = () => {
    while (active < concurrency && queue.length) {
      const record = queue.shift();
      record.status = 'loading';
      active += 1;
      const image = createImage();
      let finished = false;
      let decoding = false;
      const finish = (success) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        image.onload = null;
        image.onerror = null;
        record.status = success ? 'ready' : 'failed';
        active -= 1;
        record.resolve(success);
        [...(listeners.get(record.src) || [])].forEach((listener) => listener());
        drain();
      };
      const loaded = () => {
        if (finished || decoding) return;
        if (!image.naturalWidth) { finish(false); return; }
        decoding = true;
        Promise.resolve().then(() => image.decode?.()).then(() => finish(true), () => finish(false));
      };
      const timer = setTimeout(() => finish(false), timeout);
      image.fetchPriority = record.priority ? 'high' : 'low';
      image.onload = loaded;
      image.onerror = () => finish(false);
      image.src = record.src;
      if (image.complete) loaded();
    }
  };

  return {
    preload(sources, { priority = false } = {}) {
      const urls = [...new Set(sources.filter(Boolean))];
      const promoted = [];
      const promises = urls.map((src) => {
        let record = records.get(src);
        if (!record) {
          record = { src, status: 'queued', priority };
          record.promise = new Promise((resolve) => { record.resolve = resolve; });
          records.set(src, record);
          queue.push(record);
        }
        if (priority && record.status === 'queued') {
          record.priority = true;
          queue.splice(queue.indexOf(record), 1);
          promoted.push(record);
        }
        return record.promise;
      });
      queue.unshift(...promoted);
      drain();
      return Promise.all(promises);
    },
    isSettled(src) {
      return ['ready', 'failed'].includes(records.get(src)?.status);
    },
    subscribe(src, listener) {
      if (!listeners.has(src)) listeners.set(src, new Set());
      const subscribers = listeners.get(src);
      subscribers.add(listener);
      return () => {
        subscribers.delete(listener);
        if (!subscribers.size) listeners.delete(src);
      };
    },
  };
}
