import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { BrowserWindow } from './BrowserWindow';
import { IngredientMixStage } from './IngredientMixStage';
import { recipeGroups, rollingPool } from './recipeGroups';
import { machineAssets } from './lotteryAssets';
import './lottery.css';

export { lotteryPreviewImages } from './lotteryAssets';

type GameState = 'idle' | 'leverPulling' | 'rolling' | 'resultFrozen' | 'failed' | 'ingredients' | 'completed';

const leverDuration = 1000;
const stopSchedule = [1200, 1450, 1700, 1950];
const machineSlotWindows = [
  { left: 34, top: 36, width: 69, height: 119 },
  { left: 107, top: 36, width: 69, height: 119 },
  { left: 180, top: 37, width: 69, height: 119 },
  { left: 251, top: 37, width: 69, height: 119 },
];

function pickRecipeGroup() {
  return recipeGroups[Math.floor(Math.random() * recipeGroups.length)];
}

export default function LotteryDrinkPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [activeRecipe, setActiveRecipe] = useState(pickRecipeGroup);
  const [rollingSlots, setRollingSlots] = useState([false, false, false, false]);
  const [displayedIngredients, setDisplayedIngredients] = useState(activeRecipe.ingredients);
  const [attemptCount, setAttemptCount] = useState(0);

  const isMachineDisabled = !['idle', 'failed'].includes(gameState);
  const isCupStage = gameState === 'ingredients' || gameState === 'completed';

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function startLottery() {
    if (isMachineDisabled) return;

    timers.current = [];
    const schedule = (callback: () => void, delay: number) => {
      timers.current.push(window.setTimeout(callback, delay));
    };
    const nextAttempt = attemptCount + 1;
    const shouldMatch = nextAttempt >= 3 || Math.random() < 0.34;
    const nextResult = shouldMatch ? activeRecipe.ingredients : createMissResult();

    setAttemptCount(nextAttempt);
    setGameState('leverPulling');

    schedule(() => {
      setGameState('rolling');
      setRollingSlots([true, true, true, true]);
    }, leverDuration);

    stopSchedule.forEach((delay, index) => {
      schedule(() => {
        setDisplayedIngredients((current) => current.map((item, slotIndex) => (slotIndex === index ? nextResult[index] : item)));
        setRollingSlots((current) => current.map((isRolling, slotIndex) => (slotIndex === index ? false : isRolling)));
      }, leverDuration + delay);
    });

    schedule(() => {
      setGameState('resultFrozen');
    }, leverDuration + 1950);

    // Keep the final four ingredients visible for 1.2s before releasing them into the cup scene.
    schedule(() => {
      setGameState(shouldMatch ? 'ingredients' : 'failed');
    }, leverDuration + 3150);
  }

  function createMissResult() {
    const pool = rollingPool;
    let result = activeRecipe.ingredients.map((_, index) => pool[(index + attemptCount + 1) % pool.length]);
    const matchesRecipe = result.every((item, index) => item.id === activeRecipe.ingredients[index].id);

    if (matchesRecipe) {
      result = [...result];
      result[0] = pool.find((item) => item.id !== activeRecipe.ingredients[0].id) ?? result[0];
    }

    return result;
  }

  function restartLottery() {
    const nextRecipe = pickRecipeGroup();
    setRollingSlots([false, false, false, false]);
    setAttemptCount(0);
    setActiveRecipe(nextRecipe);
    setDisplayedIngredients(nextRecipe.ingredients);
    setGameState('idle');
  }

  return (
    <div className="page-shell">
      <BrowserWindow title="Create your drink">
        <div className="interaction-stage" ref={contentRef}>
          <AnimatePresence>
            {!isCupStage && (
              <motion.div
                key="machine"
                className="machine-stage"
                initial={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="machine-content-scale">
                  <motion.button
                    className="machine-image-button"
                    type="button"
                    onClick={startLottery}
                    disabled={isMachineDisabled}
                    aria-label="Start the drink lottery"
                    whileTap={isMachineDisabled ? undefined : { scale: 0.985 }}
                  >
                    <motion.div
                      className="legacy-slot-lever"
                      aria-hidden="true"
                    >
                      <motion.img
                        className="ganzi-ball-part"
                        src={machineAssets.leverBall}
                        alt=""
                        draggable={false}
                        animate={
                          gameState === 'leverPulling'
                            ? { top: [-2, 103, -2] }
                            : { top: -2 }
                        }
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.img
                        className="ganzi-stick-part"
                        src={machineAssets.leverStick}
                        alt=""
                        draggable={false}
                        animate={
                          gameState === 'leverPulling'
                            ? { top: [11, 116, 11], height: [104, 11, 104] }
                            : { top: 11, height: 104 }
                        }
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <img className="ganzi-base-part" src={machineAssets.leverBase} alt="" draggable={false} />
                    </motion.div>
                    <AnimatePresence>
                      {gameState === 'failed' && (
                        <motion.div
                          className="retry-message"
                          initial={{ opacity: 0, x: '-50%', y: -8 }}
                          animate={{ opacity: 1, x: '-50%', y: 0 }}
                          exit={{ opacity: 0, x: '-50%', y: -8 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          再来一次吧
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="machine-reel-overlay" aria-hidden="true">
                      {displayedIngredients.map((ingredient, index) => (
                        <div
                          className="machine-reel-window"
                          key={`${ingredient.id}-${index}`}
                          style={machineSlotWindows[index]}
                        >
                          {rollingSlots[index] ? (
                            <motion.div
                              className="machine-reel-strip"
                              animate={{ y: ['0%', '-72%'] }}
                              transition={{ duration: 0.42, ease: 'linear', repeat: Infinity }}
                            >
                              {[...rollingPool, ...rollingPool, ...rollingPool].map((item, itemIndex) => (
                                <img key={`${item.id}-${itemIndex}`} src={item.image} alt="" draggable={false} />
                              ))}
                            </motion.div>
                          ) : (
                            <motion.img
                              className="machine-reel-final"
                              src={ingredient.image}
                              alt=""
                              draggable={false}
                              initial={{ y: -20, scale: 0.95, opacity: 0.88 }}
                              animate={{ y: [14, -5, 0], scale: [1, 1.04, 1], opacity: 1 }}
                              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <img
                      className="machine-body-image"
                      src={machineAssets.machine}
                      alt="Drink lottery machine"
                      draggable={false}
                    />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {isCupStage && (
              <motion.div
                key="cup"
                className="cup-stage"
                initial={{ opacity: 0.01, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
              >
                <IngredientMixStage recipeGroup={activeRecipe} contentRef={contentRef} onRestart={restartLottery} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BrowserWindow>
    </div>
  );
}
