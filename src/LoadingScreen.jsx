import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { loadHomeResources } from './homeLoading';
import './loading.css';

const phrases = ['收到', '好的', '马上安排', '没问题', '在赶了', '我跟进下', '已同步', '稍等', '已更新', '辛苦啦'];
const random = (min, max) => min + Math.random() * (max - min);

export default function LoadingScreen({ images, onReady, onComplete, preview = false }) {
  const overlayRef = useRef(null);
  const peopleRef = useRef(null);
  const peopleReadyRef = useRef(false);
  const lettersRef = useRef(null);
  const boostUntilRef = useRef(0);
  const stoppedRef = useRef(false);
  const pressRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const resize = () => setScale(Math.min(1, (window.innerWidth - 24) / 320, (window.innerHeight - 32) / 300));
    resize();
    media.addEventListener('change', updateMotion);
    window.addEventListener('resize', resize);
    return () => {
      media.removeEventListener('change', updateMotion);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let fade;
    stoppedRef.current = false;
    loadHomeResources(images, { onProgress: setProgress, signal: controller.signal }).then(({ reason }) => {
      if (reason === 'aborted' || preview) return;
      stoppedRef.current = true;
      onReady(true);
      fade = gsap.to(overlayRef.current, {
        opacity: 0,
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.15 : 0.4,
        ease: 'power1.out',
        onComplete: () => onComplete(true),
      });
    });
    return () => {
      controller.abort();
      fade?.kill();
      pressRef.current?.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [images, onReady, onComplete, preview]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const container = lettersRef.current;
    const particles = [];
    let clock = 0;
    let nextPhrase = 0.08;
    let previousPhrase = -1;
    let side = -1;
    let speed = 1.2;

    const tick = (_, deltaMs) => {
      if (document.hidden) return;
      const delta = Math.min(deltaMs / 1000, 0.05);
      const targetSpeed = performance.now() < boostUntilRef.current ? 1.8 : 1.2;
      speed += (targetSpeed - speed) * (1 - Math.exp(-delta * 10));
      clock += delta * speed;
      const narrow = window.innerWidth < 600;
      const limit = narrow ? 10 : 16;

      if (!stoppedRef.current && peopleReadyRef.current && clock >= nextPhrase) {
        const choices = phrases.map((_, index) => index)
          .filter((index) => index !== previousPhrase && particles.length + phrases[index].length <= limit);
        if (choices.length) {
          const phraseIndex = choices[Math.floor(Math.random() * choices.length)];
          const phrase = phrases[phraseIndex];
          previousPhrase = phraseIndex;
          const duration = random(1.6, 2.2);
          const stagger = random(0.05, 0.07);
          const reach = (narrow ? 0.8 : 1) * random(0.9, 1);
          const height = random(0, 5);
          [...phrase].forEach((character, index) => {
            const node = document.createElement('span');
            node.className = 'loading-letter';
            node.textContent = character;
            node.style.color = Math.random() < 0.16 ? '#FA7C29' : '#284051';
            container.appendChild(node);
            particles.push({ node, start: clock + index * stagger, duration, side, reach, height, spread: (phrase.length - 1 - index) * 11.5, flip: Math.random() < 0.2 });
          });
          side *= -1;
          nextPhrase = clock + random(0.3, 0.45);
        } else {
          nextPhrase = clock + 0.1;
        }
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        const t = (clock - particle.start) / particle.duration;
        if (t < 0) continue;
        if (t >= 1) {
          particle.node.remove();
          particles.splice(index, 1);
          continue;
        }
        // Figma guides: left x 501..595, right x 685..779, y 348..405.
        const startX = 640 + particle.side * 53;
        const controlX = startX + particle.side * 40 * particle.reach;
        const endX = startX + particle.side * 61 * particle.reach;
        const x = (1 - t) ** 2 * startX + 2 * (1 - t) * t * controlX + t ** 2 * endX
          + particle.side * particle.spread * particle.reach * Math.sin(Math.PI * t);
        const y = (1 - t) ** 2 * 400 + 2 * (1 - t) * t * (332 + particle.height) + t ** 2 * 379;
        const alpha = Math.min(1, t / 0.14, (1 - t) / 0.28);
        particle.node.style.opacity = String(Math.max(0, alpha));
        particle.node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotateY(${particle.flip ? 150 * t : 0}deg)`;
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      particles.forEach(({ node }) => node.remove());
    };
  }, [reducedMotion]);

  const press = () => {
    if (stoppedRef.current || reducedMotion || !peopleReadyRef.current) return;
    boostUntilRef.current = performance.now() + 1000;
    pressRef.current?.kill();
    pressRef.current = gsap.timeline()
      .to(peopleRef.current, { y: 2, scaleY: 0.97, duration: 0.08, ease: 'power2.out' })
      .to(peopleRef.current, { y: 0, scaleY: 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <div ref={overlayRef} className="site-loading" aria-busy="true">
      <div className="loading-stage" style={{ transform: `translate(-50%, -50%) scale(${scale}) translateY(-60px)` }}>
        <div className="loading-ring" role="progressbar" aria-label="首页关键资源加载进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          {Array.from({ length: 10 }, (_, index) => {
            const angle = index * Math.PI / 5 - Math.PI / 2;
            return <span key={index} className={`loading-dot ${index < Math.floor(progress * 10) ? 'is-ready' : ''}`} style={{ left: 39 + Math.cos(angle) * 24, top: 40 + Math.sin(angle) * 24, '--dot-delay': `${index * 0.14}s` }} />;
          })}
        </div>
        <div ref={lettersRef} className="loading-letters" aria-hidden="true" />
        <button ref={peopleRef} className="loading-people" type="button" onClick={press} aria-label="轻触人物，加快打字" tabIndex={0}>
          <img src="https://hardhardfish.dpdns.org/loading-people.webp" alt="" width="142" height="142" fetchPriority="high" draggable="false" onLoad={() => { peopleReadyRef.current = true; }} onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
        </button>
        <p className="loading-caption" role="status" aria-label="Loading...">
          Loading<span className="loading-ellipsis" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
        </p>
      </div>
    </div>
  );
}
