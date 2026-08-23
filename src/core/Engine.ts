import { RenderEvent } from "./RenderEvent";
import { type Backend, Backends, type RenderConfigs, type Texture } from "./Renderer";
import { CanvasBackend } from "./backends/canvas";
import { WebGLBackend } from "./backends/webgl";
import { WebGPUBackend } from "./backends/webgpu";


export class Engine {
  private configs: RenderConfigs;
  private canvas: HTMLCanvasElement;

	private backend: Backend;
  private renderEvent: RenderEvent;

  private textures: Map<string, Texture> = new Map();
  private active = false;

  public onRender: (event: RenderEvent) => void = () => { };

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.canvas = canvas;
    this.configs = configs;

		let backend: Backend;
		switch (this.configs.backend) {
			case Backends.CANVAS:
				backend = new CanvasBackend(canvas, configs);
				break;
			case Backends.WEBGPU:
				backend = new WebGPUBackend(canvas, configs);
				break;
			case Backends.WEBGL:
				backend = new WebGLBackend(canvas, configs);
				break;
			default:
				throw new Error(`Unsupported backend: ${this.configs.backend}`);
		}
		this.backend = backend;
    this.renderEvent = new RenderEvent();
  }

  public start(): void {
    if (this.active) return;
    this.active = true;

    const loop = () => {
      if (!this.active) return;

      this.renderEvent.resetCommandBuffer();

      this.onRender(this.renderEvent);
      
      this.backend.processFrame(this.renderEvent.commandBuffer.data, this.renderEvent.commandBuffer.length);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
