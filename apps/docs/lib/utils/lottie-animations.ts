/* @proprietary license */

import autorenewAnimation from '@/app/assets/lottie/autorenew.json';
import blogAnimation from '@/app/assets/lottie/blog.json';
import boltAnimation from '@/app/assets/lottie/bolt.json';
import calculateAnimation from '@/app/assets/lottie/calculate.json';
import cashAnimation from '@/app/assets/lottie/cash.json';
import codeAnimation from '@/app/assets/lottie/code.json';
import cubeAnimation from '@/app/assets/lottie/cube.json';
import flagAnimation from '@/app/assets/lottie/flag.json';
import pointAnimation from '@/app/assets/lottie/point.json';
import walletAnimation from '@/app/assets/lottie/wallet.json';
import sunAnimation from '@/app/assets/lottie/sun.json';
import luggageAnimation from '@/app/assets/lottie/luggage.json';
import globeAnimation from '@/app/assets/lottie/globe.json';
import highpriorityAnimation from '@/app/assets/lottie/highpriority.json';
import takeoffAnimation from '@/app/assets/lottie/takeoff.json';

// Lottie animation data type
export interface LottieAnimationData {
  v: string; // version
  fr: number; // frame rate
  ip: number; // in point
  op: number; // out point
  w: number; // width
  h: number; // height
  nm: string; // name
  ddd: number; // 3d
  assets: unknown[];
  layers: unknown[];
  markers?: unknown[];
}

// Export animations directly by name
export const animations = {
  autorenew: autorenewAnimation,
  flag: flagAnimation,
  blog: blogAnimation,
  bolt: boltAnimation,
  calculate: calculateAnimation,
  cash: cashAnimation,
  code: codeAnimation,
  cube: cubeAnimation,
  point: pointAnimation,
  wallet: walletAnimation,
  sun: sunAnimation,
  luggage: luggageAnimation,
  globe: globeAnimation,
  highpriority: highpriorityAnimation,
  takeoff: takeoffAnimation,
};

// Also export individual animations for direct import
export {
  autorenewAnimation,
  blogAnimation,
  boltAnimation,
  calculateAnimation,
  cashAnimation,
  codeAnimation,
  cubeAnimation,
  flagAnimation,
  pointAnimation,
  walletAnimation,
  sunAnimation,
  luggageAnimation,
  globeAnimation,
  highpriorityAnimation,
  takeoffAnimation,
};
