import React from 'react';
import { motion } from 'motion/react';
import type { RecipeGroup } from './recipeGroups';

type DrinkResultProps = {
  recipe: RecipeGroup;
  onRestart?: () => void;
};

export function DrinkResult({ recipe, onRestart }: DrinkResultProps) {
  return (
    <motion.div
      className="drink-result"
      role="button"
      tabIndex={0}
      aria-label="Restart drink creation"
      onClick={onRestart}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onRestart?.();
        }
      }}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={recipe.resultDrink.image} alt={recipe.resultDrink.name} draggable={false} />
    </motion.div>
  );
}
