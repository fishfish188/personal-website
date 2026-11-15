import React from 'react';
import { motion } from 'motion/react';
import type { RefObject } from 'react';

type DropContainerProps = {
  image: string;
  name: string;
  completed: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function DropContainer({ image, name, completed, containerRef }: DropContainerProps) {
  return (
    <motion.div
      ref={containerRef}
      className="drop-container"
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{
        opacity: completed ? 0 : 1,
        scale: completed ? 0.92 : 1,
        y: 0,
      }}
      transition={{ duration: completed ? 0.45 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={image} alt={name} draggable={false} />
    </motion.div>
  );
}
