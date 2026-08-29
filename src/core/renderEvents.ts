import { Backends } from "./renderer";
import type { MeshData } from "../graphics/mesh";
import { Quaternion } from "../math/quaternion";
import type { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { CanvasBackend } from "./backends/canvas";
import { WebGLBackend } from "./backends/webgl";
import { WebGPUBackend } from "./backends/webgpu";
import type { Camera } from "./camera";
import type { Backend, RenderConfigs } from "./renderer";

export class RenderEvent {
  private configs: RenderConfigs;
  private backend: Backend;
  private warnedNoView = false;

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.configs = configs;
    switch (configs.backend) {
      case Backends.CANVAS:
        this.backend = new CanvasBackend(canvas, configs);
        break;
      case Backends.WEBGPU:
        this.backend = new WebGPUBackend(canvas, configs);
        break;
      case Backends.WEBGL:
        this.backend = new WebGLBackend(canvas, configs);
        break;
      default:
        throw new Error(`Unsupported backend: ${String(configs.backend)}`);
    }
  }

  private fn<K extends keyof Backend>(name: K): NonNullable<Backend[K]> {
    const method = this.backend[name];

    if (typeof method !== "function") {
      throw new Error(
        `${this.backend.constructor.name} does not implement '${String(name)}()'.`,
      );
    }

    return method as NonNullable<Backend[K]>;
  }

  public clear(r: number, g: number, b: number, a: number): void {
    this.fn("clear").call(this.backend, r, g, b, a);
  }

  public setColor(r: number, g: number, b: number, a: number): void {
    this.fn("setColor").call(this.backend, r, g, b, a);
  }

  public drawLine(a: Vector2, b: Vector2, thickness: number): void {
    this.fn("drawLine").call(this.backend, a.x, a.y, b.x, b.y, thickness);
  }

  public drawCircle(x: number, y: number, radius: number): void {
    this.fn("drawCircle").call(this.backend, x, y, radius);
  }

  public drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rot?: number,
  ): void {
    this.fn("drawRect").call(this.backend, x, y, w, h, rot);
  }

  public drawTriangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): void {
    this.fn("drawTriangle").call(this.backend, x1, y1, x2, y2, x3, y3);
  }

  public drawRegularPolygon(
    x: number,
    y: number,
    size: number,
    sides: number,
    rot?: number,
  ): void {
    this.fn("drawRegularPolygon").call(this.backend, x, y, size, sides, rot);
  }

  public drawPolygon(vertices: Array<Vector2>): void {
    this.fn("drawPolygon").call(this.backend, vertices);
  }

  public drawText(
    x: number,
    y: number,
    text: string,
    size: number,
    alignment: number,
  ): void {
    this.fn("drawText").call(this.backend, x, y, text, size, alignment);
  }

  public setDepth(z: number): void {
    this.fn("setDepth").call(this.backend, z);
  }

  public createMesh(id: number, mesh: MeshData): void {
    this.fn("createMesh").call(this.backend, id, mesh);
  }

  public drawMesh(
    meshId: number,
    position: Vector3,
    rotation: Quaternion = Quaternion.identity(),
    scale: Vector3 = new Vector3(1, 1, 1),
  ): void {
    this.fn("drawMesh").call(this.backend, meshId, position, rotation, scale);
  }

  public updateView(camera: Camera): void {
    if (typeof this.backend.updateView !== "function") {
      if (!this.warnedNoView) {
        console.warn(
          `${this.backend.constructor.name} does not implement 'updateView()'.`,
        );
        this.warnedNoView = true;
      }

      return;
    }

    this.backend.updateView(camera);
  }

  public setCamera(camera: Camera): void {
    this.updateView(camera);
  }

  public resize(width: number, height: number): void {
    this.backend.resize?.(width, height);
  }

  public drawPentagon(x: number, y: number, size: number, rot?: number): void {
    this.drawRegularPolygon(x, y, size, 5, rot);
  }
  public drawHexagon(x: number, y: number, size: number, rot?: number): void {
    this.drawRegularPolygon(x, y, size, 6, rot);
  }
  public drawSeptagon(x: number, y: number, size: number, rot?: number): void {
    this.drawRegularPolygon(x, y, size, 7, rot);
  }
  public drawOctagon(x: number, y: number, size: number, rot?: number): void {
    this.drawRegularPolygon(x, y, size, 8, rot);
  }

  public processFrame(fps: number): void {
    if (this.configs.debug) this.drawDebugPanel(fps);
    this.fn("flush").call(this.backend);
  }

  private drawDebugPanel(fps: number): void {
    this.setColor(0, 0, 0, 1);
    this.drawRect(10, 10, 400, 200);

    this.setColor(255, 255, 255, 1);
    this.drawText(200, 35, "DEBUG PANEL", 18, 1);
    this.drawText(20, 85, `FPS: ${fps.toFixed(2)}`, 16, 0);

    const mem = (performance as any).memory;
    this.drawText(
      20,
      105,
      `Memory: ${mem ? `${(mem.usedJSHeapSize / 1048576).toFixed(2)}MB / ${(mem.jsHeapSizeLimit / 1048576).toFixed(2)}MB` : "N/A"}`,
      16,
      0,
    );
    this.drawText(
      20,
      125,
      `CPU Cores: ${navigator.hardwareConcurrency || "N/A"}`,
      16,
      0,
    );
    this.drawText(
      20,
      145,
      `Resolution: ${window.innerWidth}x${window.innerHeight}`,
      16,
      0,
    );
    this.drawText(
      20,
      165,
      `Network: ${navigator.onLine ? "Online" : "Offline"} (${(navigator as any).connection?.effectiveType || "unknown"})`,
      16,
      0,
    );
  }
}
