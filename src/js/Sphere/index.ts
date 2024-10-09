import {
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three';
import {
  TCreateDatGuiSettingsReturns,
  createDatGuiSettings,
} from '@anton.bobrov/react-dat-gui';
import { NCallbacks } from 'vevet';
import { TProps, TSettings } from './types';

import simplexNoise from './shaders/utils/simplexNoise.glsl';
import simplexNoiseFBM from './shaders/utils/simplexNoiseFBM.glsl';

import preset from './shaders/preset.glsl';
import beginVertex from './shaders/beginVertex.glsl';
import beginFragment from './shaders/beginFragment.glsl';

export class Sphere {
  private get props() {
    return this._props;
  }

  private _mesh: Mesh;

  private _geometry: SphereGeometry;

  private _material: MeshStandardMaterial;

  private _gui: TCreateDatGuiSettingsReturns<TSettings>;

  private _callbacks: NCallbacks.IAddedCallback[] = [];

  constructor(private _props: TProps) {
    const { manager, size } = _props;

    // create shader material
    this._material = new MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.75,
    });

    // create gui
    this._gui = createDatGuiSettings({
      name: 'Sphere',
      debounceDelay: 0,
      data: {
        noiseScale: 1000,
        noiseBulge: 0.15,
        stripeFactor: 40,
        timeFactor: 1,
        rotate: 0.00515,
      },
      parameters: {
        timeFactor: { type: 'number', min: 0, max: 5, step: 0.005 },
        noiseScale: { type: 'number', min: 550, max: 2000, step: 1 },
        noiseBulge: { type: 'number', min: -0.25, max: 0.25, step: 0.00005 },
        stripeFactor: { type: 'number', min: 10, max: 180, step: 1 },
        rotate: {
          type: 'number',
          min: 0,
          max: Math.PI * 0.005,
          step: 0.00005,
        },
      },
      isOpen: true,
      onChange: (data) => {
        const { userData } = this._material;

        if (userData.u_noiseScale) {
          userData.u_noiseScale.value = data.noiseScale;
        }

        if (userData.u_noiseBulge) {
          userData.u_noiseBulge.value = data.noiseBulge;
        }

        if (userData.u_stripeFactor) {
          userData.u_stripeFactor.value = data.stripeFactor;
        }

        this._material.needsUpdate = true;
      },
    });

    // override material
    this._material.onBeforeCompile = (data) => {
      const shaders = data;

      this._material.userData = shaders.uniforms;

      shaders.uniforms.u_time = {
        value: 0,
      };

      shaders.uniforms.u_noiseScale = {
        value: this._gui.current.noiseScale,
      };

      shaders.uniforms.u_noiseBulge = {
        value: this._gui.current.noiseBulge,
      };

      shaders.uniforms.u_stripeFactor = {
        value: this._gui.current.stripeFactor,
      };

      const include = preset + simplexNoise + simplexNoiseFBM;

      shaders.vertexShader =
        include +
        shaders.vertexShader.replace('#include <begin_vertex>', beginVertex);

      shaders.fragmentShader =
        include +
        shaders.fragmentShader.replace(
          'vec4 diffuseColor = vec4( diffuse, opacity );',
          beginFragment,
        );
    };

    // create geometry
    this._geometry = new SphereGeometry(size, 512, 512);

    // create mesh
    this._mesh = new Mesh(this._geometry, this._material);
    manager.scene.add(this._mesh);

    // render
    this._callbacks.push(manager.callbacks.add('render', () => this._render()));
  }

  /** Render the scene */
  private _render() {
    const { fpsMultiplier } = this.props.manager;
    const { userData } = this._material;
    const { current } = this._gui;

    if (userData.u_time) {
      userData.u_time.value += 1 * fpsMultiplier * current.timeFactor;
    }

    this._mesh.rotation.x += current.rotate;
    this._mesh.rotation.y += current.rotate;
  }

  /** Destroy the scene */
  public destroy() {
    this.props.manager.scene.remove(this._mesh);
    this._material.dispose();
    this._geometry.dispose();

    this._gui.destroy();

    this._callbacks.forEach((event) => event.remove());
  }
}
