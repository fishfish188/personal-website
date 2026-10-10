import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, motionValue, useReducedMotion } from 'motion/react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const SIDE_REACH = 518 * 0.65;
const tether = (value, reach) => Math.sign(value) * (Math.abs(value) <= reach
  ? Math.abs(value)
  : reach + (Math.abs(value) - reach) * 0.18);
const SPRINGS = {
  place: { type: 'spring', stiffness: 260, damping: 24 },
  settle: { type: 'spring', stiffness: 320, damping: 34 },
  face: { type: 'spring', stiffness: 240, damping: 30 },
  lean: { type: 'spring', stiffness: 240, damping: 28 },
  press: { type: 'spring', stiffness: 420, damping: 34 },
};

function releaseVelocity(samples, time) {
  const recent = samples.filter(sample => time - sample.time <= 100);
  if (recent.length < 2) return { x: 0, y: 0 };
  const first = recent[0];
  const last = recent[recent.length - 1];
  const elapsed = Math.max((last.time - first.time) / 1000, 0.008);
  return { x: (last.x - first.x) / elapsed, y: (last.y - first.y) / elapsed };
}

export default function PaperStack({ children }) {
  const papers = React.Children.toArray(children).reverse();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [switching, setSwitching] = useState(false);
  const rootRef = useRef(null);
  const activeRef = useRef(0);
  const valuesRef = useRef(new Map());
  const dragRef = useRef(null);
  const flightRef = useRef(new Map());
  const aliveRef = useRef(true);
  const reduceMotion = useReducedMotion();

  const valuesFor = index => {
    if (!valuesRef.current.has(index)) {
      const position = Math.min(index, 2);
      valuesRef.current.set(index, {
        x: motionValue(0), y: motionValue(0), rotate: motionValue(position * 4),
        scale: motionValue(1 - position * 0.06), opacity: motionValue(index < 3 ? 1 : 0),
        z: motionValue(papers.length - index), tiltX: motionValue(0), tiltY: motionValue(0),
        spin: motionValue(0), lift: motionValue(1), originX: motionValue(0.5), originY: motionValue(0.5),
      });
    }
    return valuesRef.current.get(index);
  };

  const spring = kind => reduceMotion ? { duration: 0.15 } : SPRINGS[kind];

  const settleFace = values => {
    for (const key of ['tiltX', 'tiltY', 'spin']) animate(values[key], 0, spring('face'));
    animate(values.lift, 1, spring('press'));
  };

  const placeAll = (lift = 0) => {
    papers.forEach((_, index) => {
      if (flightRef.current.has(index) || dragRef.current?.index === index) return;
      const values = valuesFor(index);
      const position = index - activeRef.current;
      const shown = position < 0 ? 2 : Math.min(position, 2);
      const depth = Math.max(0, shown - (shown > 0 ? lift : 0));
      values.z.set(papers.length - (position < 0 ? 3 : shown));
      animate(values.x, 0, spring('settle'));
      animate(values.y, 0, spring('settle'));
      animate(values.rotate, depth * 4, spring('place'));
      animate(values.scale, 1 - depth * 0.06, spring('place'));
      animate(values.opacity, position >= 0 && position < 3 ? 1 : 0, { duration: reduceMotion ? 0.15 : 0.25 });
      settleFace(values);
    });
  };

  const tuckCard = async (index, side, depth, flight) => {
    const values = valuesFor(index);
    animate(values.y, 0, spring('settle'));
    await animate(values.x, side * SIDE_REACH, { duration: 0.18, ease: 'easeOut' });
    if (!aliveRef.current || flightRef.current.get(index) !== flight) return;
    values.z.set(papers.length - (index < activeRef.current ? 3 : depth));
    animate(values.rotate, depth * 4, spring('place'));
    animate(values.scale, 1 - depth * 0.06, spring('place'));
    await animate(values.x, 0, spring('place'));
    if (!aliveRef.current || flightRef.current.get(index) !== flight) return;
    flightRef.current.delete(index);
    setSwitching(flightRef.current.size > 0);
    placeAll();
  };

  // Left advances through the fixed order; right restores the previous card.
  const changeCard = async direction => {
    const current = activeRef.current;
    const next = current + direction;
    if (next < 0 || next >= papers.length) return;
    const flyingIndex = direction > 0 ? current : next;
    const values = valuesFor(flyingIndex);
    const flight = {};
    flightRef.current.set(flyingIndex, flight);
    Object.values(values).forEach(value => value.stop());
    setSwitching(true);
    values.z.set(papers.length + 1);
    if (direction < 0) {
      values.x.jump(0);
      values.y.jump(0);
      values.rotate.jump(0);
      values.scale.jump(1);
      values.opacity.set(1);
      values.tiltX.jump(0);
      values.tiltY.jump(0);
      values.spin.jump(0);
      values.lift.jump(1);
    } else {
      settleFace(values);
    }
    activeRef.current = next;
    setActiveIndex(next);
    if (direction > 0 && !reduceMotion) {
      await tuckCard(current, -1, 2, flight);
      return;
    } else {
      if (direction < 0 && !reduceMotion) {
        const departing = valuesFor(current);
        const departingFlight = {};
        flightRef.current.set(current, departingFlight);
        Object.values(departing).forEach(value => value.stop());
        departing.z.set(papers.length + 1);
        settleFace(departing);
        tuckCard(current, 1, 1, departingFlight);
      }
      animate(values.y, 0, spring('settle'));
      await animate(values.x, 0, spring('place'));
      if (!aliveRef.current || flightRef.current.get(flyingIndex) !== flight) return;
    }
    flightRef.current.delete(flyingIndex);
    setSwitching(flightRef.current.size > 0);
    placeAll();
  };

  const handleDown = (event, index) => {
    if (event.button !== 0 || index !== activeRef.current || dragRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const canvasScale = rootRef.current.getBoundingClientRect().width / 518;
    const values = valuesFor(index);
    if (flightRef.current.has(index)) {
      flightRef.current.delete(index);
      Object.values(values).forEach(value => value.stop());
      setSwitching(flightRef.current.size > 0);
    }
    for (const key of ['x', 'y']) values[key].stop();
    values.originX.set(clamp((event.clientX - bounds.left) / bounds.width, 0, 1));
    values.originY.set(clamp((event.clientY - bounds.top) / bounds.height, 0, 1));
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      index, id: event.pointerId, startX: event.clientX, startY: event.clientY,
      scale: canvasScale, homeX: values.x.get(), homeY: values.y.get(),
      samples: [{ x: 0, y: 0, time: event.timeStamp }], idle: null, progress: 0,
    };
    animate(values.lift, reduceMotion ? 1 : 1.035, spring('press'));
    setDragging(true);
    event.preventDefault();
  };

  const handleMove = event => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.id) return;
    const x = (event.clientX - drag.startX) / drag.scale;
    const y = (event.clientY - drag.startY) / drag.scale;
    const values = valuesFor(drag.index);
    values.x.set(drag.homeX + tether(x, SIDE_REACH));
    values.y.set(drag.homeY + tether(y, 60));
    drag.samples.push({ x, y, time: event.timeStamp });
    if (drag.samples.length > 12) drag.samples.shift();
    const velocity = releaseVelocity(drag.samples, event.timeStamp);
    const lean = (vx, vy) => {
      if (reduceMotion) return;
      animate(values.tiltY, (clamp(vx / 1300, -1, 1) * 0.7 + clamp(x / 260, -1, 1) * 0.3) * 30, spring('lean'));
      animate(values.tiltX, (clamp(-vy / 1300, -1, 1) * 0.7 + clamp(-y / 260, -1, 1) * 0.3) * 30, spring('lean'));
      animate(values.spin, clamp(x / 260, -1, 1) * 6, spring('lean'));
    };
    lean(velocity.x, velocity.y);
    clearTimeout(drag.idle);
    drag.idle = setTimeout(() => lean(0, 0), 70);
    const progress = clamp(Math.abs(x) / 90, 0, 1);
    if (Math.abs(progress - drag.progress) > 0.02) {
      drag.progress = progress;
      placeAll(progress * 0.4);
    }
  };

  const handleUp = event => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.id) return;
    const x = (event.clientX - drag.startX) / drag.scale;
    const velocity = releaseVelocity(drag.samples, event.timeStamp);
    const flick = Math.abs(velocity.x) > 650 && Math.abs(x) > 16 && velocity.x * x > 0;
    clearTimeout(drag.idle);
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    const direction = x < 0 ? 1 : -1;
    const next = activeRef.current + direction;
    if (event.type === 'pointerup' && (Math.abs(x) > 90 || flick) && next >= 0 && next < papers.length) {
      changeCard(direction);
    } else {
      placeAll();
    }
  };

  useLayoutEffect(() => {
    placeAll();
  }, [activeIndex, reduceMotion]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      clearTimeout(dragRef.current?.idle);
      valuesRef.current.forEach(values => Object.values(values).forEach(value => value.stop()));
    };
  }, []);

  return (
    <div ref={rootRef} className="draggable-paper-stack" data-layer="project-paper-stack" tabIndex={0} role="group" aria-label="项目过程卡片" aria-busy={switching}
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        if (!dragRef.current) changeCard(event.key === 'ArrowLeft' ? 1 : -1);
      }}>
      {papers.map((paper, index) => {
        const values = valuesFor(index);
        const isTop = index === activeIndex;
        return (
          <motion.div key={paper.key || index} className="paper-stack-card" data-top={isTop ? '' : undefined} data-paper={paper.props['data-layer'] || paper.props.name || '用户痛点2'} aria-hidden={!isTop}
            onPointerDown={event => handleDown(event, index)} onPointerMove={handleMove} onPointerUp={handleUp} onPointerCancel={handleUp}
            style={{ x: values.x, y: values.y, rotate: values.rotate, scale: values.scale, opacity: values.opacity, zIndex: values.z,
              originX: 0.9, originY: 0.9, pointerEvents: isTop ? 'auto' : 'none', cursor: isTop && dragging ? 'grabbing' : 'grab' }}>
            <motion.div className="paper-stack-face" style={{ rotateX: values.tiltX, rotateY: values.tiltY, rotate: values.spin,
              scale: values.lift, originX: values.originX, originY: values.originY, transformPerspective: 800 }}>
              {paper}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
