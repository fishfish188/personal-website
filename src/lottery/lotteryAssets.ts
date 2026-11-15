import background from './assets/bg1.jpg';
import machine from './assets/machine/machine-body-cutout.webp';
import leverBall from './assets/machine/ganzi-ball.svg';
import leverStick from './assets/machine/ganzi-stick.svg';
import leverBase from './assets/machine/ganzi-base.svg';

const recipeAssets = import.meta.glob<string>('./assets/{ingredients,drinks,container}/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
});

export function recipeImage(path: string) {
  return recipeAssets[`./assets/${path}`];
}

export const machineAssets = { machine, leverBall, leverStick, leverBase };
export const lotteryPreviewImages = [background, ...Object.values(machineAssets)];
