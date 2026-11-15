import React from 'react';
import { motion, type PanInfo, useAnimationControls } from 'motion/react';
import { useEffect, useRef, type RefObject } from 'react';
import type { Ingredient } from './recipeGroups';

type DraggableIngredientProps = {
  ingredient: Ingredient;
  position: { x: number; y: number };
  absorbing: boolean;
  dropped: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  onDropAttempt: (id: string, point: { x: number; y: number }) => boolean;
  onAbsorbComplete: (id: string) => void;
};

export function DraggableIngredient({
  ingredient,
  position,
  absorbing,
  dropped,
  contentRef,
  onDropAttempt,
  onAbsorbComplete,
}: DraggableIngredientProps) {
  const hasReportedAbsorb = useRef(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (absorbing || dropped) {
      controls.start({
        x: 0,
        y: 0,
        scale: 0.2,
        opacity: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      });
      return;
    }

    controls.start({
      x: position.x,
      y: position.y,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 24 },
    });
  }, [absorbing, controls, dropped, position.x, position.y]);

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (absorbing || dropped) return;
    const accepted = onDropAttempt(ingredient.id, {
      x: info.point.x - window.scrollX,
      y: info.point.y - window.scrollY,
    });
    if (!accepted) {
      controls.start({
        x: position.x,
        y: position.y,
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 260, damping: 24 },
      });
    }
  }

  return (
    <motion.div
      className="draggable-ingredient ingredient"
      drag={!absorbing && !dropped}
      dragConstraints={contentRef}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.55 }}
      animate={controls}
      whileDrag={{ scale: 1.06, zIndex: 20 }}
      onAnimationComplete={() => {
        if (absorbing && !hasReportedAbsorb.current) {
          hasReportedAbsorb.current = true;
          onAbsorbComplete(ingredient.id);
        }
      }}
      style={{ pointerEvents: dropped ? 'none' : 'auto' }}
    >
      <img src={ingredient.image} alt={ingredient.name} draggable={false} />
      <div className="ingredient-name">{ingredient.name}</div>
    </motion.div>
  );
}
