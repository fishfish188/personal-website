import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { constrainImageView } from './imagePreviewGeometry';

export default function ProjectImagePreview({ image, onClose }) {
  const dialogRef = useRef(null);
  const viewportRef = useRef(null);
  const imageRef = useRef(null);
  const dragRef = useRef(null);
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const getBounds = () => ({
    imageWidth: imageRef.current.clientWidth,
    imageHeight: imageRef.current.clientHeight,
    viewportWidth: viewportRef.current.clientWidth,
    viewportHeight: viewportRef.current.clientHeight,
  });

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    const handleWheel = (event) => {
      event.preventDefault();
      if (dragRef.current) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? dialog.clientHeight : 1;
      const bounds = getBounds();
      setView((current) => constrainImageView({ ...current, zoom: current.zoom * Math.exp(-event.deltaY * unit * 0.002) }, bounds));
    };
    const observer = new ResizeObserver(() => {
      const bounds = getBounds();
      setView((current) => constrainImageView(current, bounds));
    });
    observer.observe(viewportRef.current);
    observer.observe(imageRef.current);
    dialog.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      observer.disconnect();
      dialog.removeEventListener('wheel', handleWheel);
      if (dialog.open) dialog.close();
    };
  }, []);

  const startDrag = (event) => {
    if (event.button !== 0 || dragRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: view.x, y: view.y };
    setDragging(true);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const bounds = getBounds();
    setView((current) => constrainImageView({ ...current, x: drag.x + event.clientX - drag.startX, y: drag.y + event.clientY - drag.startY }, bounds));
  };

  const finishDrag = (event) => {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return createPortal(
    <dialog ref={dialogRef} className="project-image-preview" aria-label={`放大图片：${image.title}`}
      onClose={onClose} onCancel={(event) => event.preventDefault()}
      onClick={(event) => { if (event.target === event.currentTarget || event.target === viewportRef.current) dialogRef.current.close(); }}>
      <div className="project-image-preview-viewport" ref={viewportRef}>
        <img ref={imageRef} className="project-image-preview-content" src={image.src} alt={image.title} draggable="false" data-dragging={dragging ? '' : undefined}
          onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
          style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.zoom})` }} />
      </div>
    </dialog>, document.body
  );
}
