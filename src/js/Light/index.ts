import { PointLight } from 'three';
import { lerp, NCallbacks, scoped, vevet } from 'vevet';
import { addEventListener, IAddEventListener } from 'vevet-dom';
import { TProps } from './types';

export class Light {
  private get props() {
    return this._props;
  }

  private _light: PointLight;

  private _callbacks: NCallbacks.IAddedCallback[] = [];

  private _listeners: IAddEventListener[] = [];

  private _x = { target: 0, current: 0 };

  private _y = { target: 0, current: 0 };

  constructor(private _props: TProps) {
    const { manager, size } = _props;

    this._light = new PointLight(0xffffff, Math.PI * 0.2, 0, 0);
    this._light.position.set(0, 0, 2.5 * size);
    manager.scene.add(this._light);

    // mousemove
    this._listeners.push(
      addEventListener(window, 'mousemove', (evt) =>
        this._handleMouseMove(evt),
      ),
    );

    // render
    this._callbacks.push(manager.callbacks.add('render', () => this._render()));
  }

  /** Handle Mousemove Event */
  private _handleMouseMove(evt: MouseEvent) {
    const x = scoped(evt.clientX, [
      vevet.viewport.width / 2,
      vevet.viewport.width,
    ]);

    const y = scoped(evt.clientY, [
      vevet.viewport.height / 2,
      vevet.viewport.height,
    ]);

    this._x.target = x;
    this._y.target = y;
  }

  /** Render the scene */
  private _render() {
    const { fpsMultiplier } = this.props.manager;
    const ease = fpsMultiplier * 0.05;

    this._x.current = lerp(this._x.current, this._x.target, ease);
    this._y.current = lerp(this._y.current, this._y.target, ease);

    this._light.position.x = this._x.current * this.props.size * 2;
    this._light.position.y = this._y.current * this.props.size * -2;
  }

  /** Destroy the scene */
  public destroy() {
    this.props.manager.scene.remove(this._light);

    this._listeners.forEach((event) => event.remove());
    this._callbacks.forEach((event) => event.remove());
  }
}
