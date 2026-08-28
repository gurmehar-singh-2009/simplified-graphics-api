import { CanvasBackend } from "./backends/canvas";
import { WebGLBackend } from "./backends/webgl";
import { WebGPUBackend } from "./backends/webgpu";
import { RenderEvent } from "./renderEvents";
import { type Backend, Backends, type RenderConfigs } from "./renderer";
import { type Camera } from "./camera.ts";

export class Engine {
	private canvas: HTMLCanvasElement;

  private activeCamera: Camera | undefined;
  private renderEvent: RenderEvent;
  private active = false;

  private fps: number = 60;
  private lastFrameTimestamp: DOMHighResTimeStamp = performance.now();

  private width = 100;
  private height = 100;

  public onFrame: (
    renderer: RenderEvent,
    timestamp: DOMHighResTimeStamp,
  ) => void = () => { };

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.canvas = canvas;

    this.renderEvent = new RenderEvent(canvas, configs);
  }

  public start(): void {
    if (this.active) return;
    this.active = true;

    const loop = (timestamp: DOMHighResTimeStamp) => {
      if (!this.active) return;

      let delta = timestamp - this.lastFrameTimestamp;
      this.lastFrameTimestamp = timestamp;

      if (delta > 0) {
        const currentFps = 1000 / delta;
        this.fps = this.fps * 0.9 + currentFps * 0.1;
      }

      this.onFrame(this.renderEvent, timestamp);

      this.renderEvent.processFrame(this.fps);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  public setCamera(cam: Camera) {
    this.activeCamera = cam;
    this.activeCamera.resize(this.width, this.height);

    this.renderEvent.updateView(this.activeCamera);
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;

    if (this.activeCamera) {
      this.activeCamera.resize(this.canvas.width, this.canvas.height);

      this.renderEvent.updateView(this.activeCamera);
    }
  }
}
