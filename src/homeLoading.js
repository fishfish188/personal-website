const homeFonts = [
  ['700 95px Baloo2', 'welcome My Channel YUYIMIAO'],
  ['500 16px JiangChengYuanTi', '关于我个人探索联系我 AI/运营 UX/UI'],
  ['600 28px JiangChengYuanTi', '下载简历联系我'],
  ['700 16px JiangChengYuanTi', '首页中 EN'],
];

export function loadHomeResources(images, { onProgress, signal, timeout = 12000 }) {
  return new Promise((resolve) => {
    const cleanups = [];
    let finished = false;
    let ready = 0;
    let settled = 0;
    const total = images.length + homeFonts.length;
    const finish = (reason) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      cleanups.forEach((cleanup) => cleanup());
      resolve({ reason, ready, total });
    };
    const abort = () => finish('aborted');
    const timer = setTimeout(() => finish('timeout'), timeout);
    const record = (success) => {
      if (finished) return;
      settled += 1;
      if (success) ready += 1;
      onProgress(ready / total);
      if (settled === total) finish(ready === total ? 'ready' : 'degraded');
    };

    if (signal?.aborted) { abort(); return; }
    signal?.addEventListener('abort', abort, { once: true });
    onProgress(0);
    images.forEach((src) => {
      const image = new Image();
      let handled = false;
      const complete = (success) => {
        if (handled) return;
        handled = true;
        image.onload = null;
        image.onerror = null;
        if (!success) { record(false); return; }
        // A downloaded image is not ready for a synchronized entrance until decoded.
        Promise.resolve().then(() => image.decode?.()).then(() => record(true), () => record(false));
      };
      image.fetchPriority = 'high';
      image.onload = () => complete(image.naturalWidth > 0);
      image.onerror = () => complete(false);
      cleanups.push(() => { image.onload = null; image.onerror = null; });
      image.src = src;
      if (image.complete) complete(image.naturalWidth > 0);
    });
    homeFonts.forEach(([font, text]) => {
      Promise.resolve().then(() => document.fonts?.load(font, text))
        .then((faces) => record(Boolean(faces?.length)), () => record(false));
    });
  });
}
