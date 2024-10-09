import { WebglManager } from '../webgl/Manager';

export type TSettings = {
  noiseScale: number;
  noiseBulge: number;
  stripeFactor: number;
  timeFactor: number;
  rotate: number;
};

export type TProps = {
  manager: WebglManager;
  size: number;
};
