import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RecipeGroup } from './recipeGroups';
import { DraggableIngredient } from './DraggableIngredient';
import { DrinkResult } from './DrinkResult';
import { DropContainer } from './DropContainer';

type Stage = 'ingredients' | 'absorbing' | 'completed';

type IngredientMixStageProps = {
  recipeGroup: RecipeGroup;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onRestart: () => void;
};

type StageSize = {
  width: number;
  height: number;
};

const positions4 = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];

const positions3 = [
  { x: -1, y: -1 },
  { x: 1, y: -0.72 },
  { x: 0, y: 1 },
];

export function IngredientMixStage({ recipeGroup, contentRef, onRestart }: IngredientMixStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>('ingredients');
  const [absorbingIds, setAbsorbingIds] = useState<string[]>([]);
  const [droppedIds, setDroppedIds] = useState<string[]>([]);
  const [stageSize, setStageSize] = useState<StageSize>({ width: 650, height: 452 });

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateSize = () => {
      setStageSize({ width: node.clientWidth, height: node.clientHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, [contentRef]);

  useEffect(() => {
    if (droppedIds.length === recipeGroup.ingredients.length) {
      const completionTimer = window.setTimeout(() => {
        setStage('completed');
      }, 500);
      return () => window.clearTimeout(completionTimer);
    }
  }, [droppedIds, recipeGroup.ingredients.length]);

  const ingredientPositions = useMemo(() => {
    const layout = recipeGroup.ingredients.length === 3 ? positions3 : positions4;
    const xOffset = Math.min(stageSize.width * 0.28, 182);
    const yOffset = Math.min(stageSize.height * 0.29, 132);

    return recipeGroup.ingredients.map((_, index) => {
      const point = layout[index] ?? positions4[index % positions4.length];
      return {
        x: point.x * xOffset,
        y: point.y * yOffset,
      };
    });
  }, [recipeGroup.ingredients, stageSize]);

  function isInsideDropZone(point: { x: number; y: number }) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return false;

    const expanded = {
      left: rect.left - 30,
      right: rect.right + 30,
      top: rect.top - 30,
      bottom: rect.bottom + 30,
    };

    return (
      point.x >= expanded.left &&
      point.x <= expanded.right &&
      point.y >= expanded.top &&
      point.y <= expanded.bottom
    );
  }

  function handleDropAttempt(id: string, point: { x: number; y: number }) {
    if (!isInsideDropZone(point) || absorbingIds.includes(id) || droppedIds.includes(id)) return false;

    setStage('absorbing');
    setAbsorbingIds((current) => [...current, id]);
    return true;
  }

  function handleAbsorbComplete(id: string) {
    setDroppedIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  return (
    <div className="mix-stage">
      <DropContainer
        image={recipeGroup.containerImage}
        name={`${recipeGroup.title} container`}
        completed={stage === 'completed'}
        containerRef={containerRef}
      />

      {recipeGroup.ingredients.map((ingredient, index) => (
        <DraggableIngredient
          key={ingredient.id}
          ingredient={ingredient}
          position={ingredientPositions[index]}
          dropped={droppedIds.includes(ingredient.id)}
          absorbing={absorbingIds.includes(ingredient.id)}
          contentRef={contentRef}
          onDropAttempt={handleDropAttempt}
          onAbsorbComplete={handleAbsorbComplete}
        />
      ))}

      <AnimatePresence>
        {stage === 'completed' && <DrinkResult key="drink-result" recipe={recipeGroup} onRestart={onRestart} />}
      </AnimatePresence>
    </div>
  );
}
