export function constrainImageView(view, { imageWidth, imageHeight, viewportWidth, viewportHeight }) {
  const zoom = Math.max(0.5, Math.min(3, view.zoom));
  const limitX = Math.max(0, (imageWidth * zoom - viewportWidth) / 2);
  const limitY = Math.max(0, (imageHeight * zoom - viewportHeight) / 2);
  return {
    zoom,
    x: limitX > 0 ? Math.max(-limitX, Math.min(limitX, view.x)) : 0,
    y: limitY > 0 ? Math.max(-limitY, Math.min(limitY, view.y)) : 0,
  };
}
