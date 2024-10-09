import { vevet } from 'vevet';
import { Color } from 'three';
import { WebglManager } from './webgl/Manager';
import { Sphere } from './Sphere';
import { Light } from './Light';

const managerContainer = document.getElementById('scene') as HTMLElement;

const manager = new WebglManager(managerContainer, {
  rendererProps: {
    dpr: vevet.viewport.lowerDpr,
    antialias: false,
  },
  cameraProps: {
    fov: 75,
  },
});

manager.play();

manager.scene.background = new Color(0x000000);

// eslint-disable-next-line no-new
new Sphere({
  manager,
  size: 400,
});

// eslint-disable-next-line no-new
new Light({ manager, size: 400 });
