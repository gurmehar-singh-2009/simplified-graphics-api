import { CanvasBackend } from "./backends/canvas";
import { WebGLBackend } from "./backends/webgl";
import { WebGPUBackend } from "./backends/webgpu";
import { RenderEvent } from "./renderEvents";
import { type Backend, Backends, type RenderConfigs } from "./renderer";

export class Engine {
	private configs: RenderConfigs;

	private backend: Backend;
	private renderEvent: RenderEvent;
	private active = false;

	public onFrame: (
		renderer: RenderEvent,
		timestamp: DOMHighResTimeStamp,
	) => void = () => {};

	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
		this.canvas = canvas;
		this.configs = configs;

		// Pick the correct backend.
		switch (this.configs.backend) {
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
				throw new Error(`Unsupported backend: ${this.configs.backend}`);
		}

		// This contaians the command buffer and all user facing methods.
		this.renderEvent = new RenderEvent();
	}

	public start(): void {
		if (this.active) return;
		this.active = true;

		const loop = (timestamp: DOMHighResTimeStamp) => {
			if (!this.active) return;

			this.renderEvent.resetCommandBuffer();

			this.onFrame(this.renderEvent, timestamp);

			// Send all commands to backend
			this.backend.processFrame(
				this.renderEvent.commandBuffer.data,
				this.renderEvent.commandBuffer.length,
			);

			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	}
}
