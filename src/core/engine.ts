import { CanvasBackend } from "./backends/canvas";
import { WebGLBackend } from "./backends/webgl";
import { WebGPUBackend } from "./backends/webgpu";
import { RenderEvent } from "./renderEvents";
import { type Backend, Backends, type RenderConfigs } from "./renderer";
import type { MeshData } from "../graphics/mesh";

export class Engine {
	private canvas: HTMLCanvasElement;
	private configs: RenderConfigs;

	private backend: Backend;
	private renderEvent: RenderEvent;
	private active = false;

	private fps: number = 60;
	private lastFrameTimestamp: DOMHighResTimeStamp = performance.now();

	public onFrame: (
		renderer: RenderEvent,
		timestamp: DOMHighResTimeStamp,
		delta: number,
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

			let delta = timestamp - this.lastFrameTimestamp;
			this.lastFrameTimestamp = timestamp;

			if (delta > 0) {
				const currentFps = 1000 / delta;
				this.fps = this.fps * 0.9 + currentFps * 0.1;
			}

			this.renderEvent.resetCommandBuffer();

			this.onFrame(this.renderEvent, timestamp, delta);

			// Render the debug panel.
			// console.log(this.configs)
			if (this.configs.debug) {
				this.renderEvent.setColor(0, 0, 0, 1);
				this.renderEvent.drawRect(10, 10, 400, 200);

				this.renderEvent.setColor(255, 255, 255, 1);
				this.renderEvent.drawText(200, 35, "DEBUG PANEL", 18, 1);

				this.renderEvent.drawText(
					20,
					65,
					`Command Buffer size: ${this.renderEvent.commandBuffer.length}`,
					16,
					0,
				);
				this.renderEvent.drawText(20, 85, `FPS: ${this.fps.toFixed(2)}`, 16, 0);
				this.renderEvent.drawText(
					20,
					105,
					`Memory: ${"memory" in performance && (performance as any).memory ? ((performance as any).memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + "MB / " + ((performance as any).memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + "MB" : "N/A"}`,
					16,
					0,
				);
				this.renderEvent.drawText(
					20,
					125,
					`CPU Cores: ${navigator.hardwareConcurrency || "N/A"}`,
					16,
					0,
				);
				this.renderEvent.drawText(
					20,
					145,
					`Resolution: ${window.innerWidth}x${window.innerHeight}`,
					16,
					0,
				);
				this.renderEvent.drawText(
					20,
					165,
					`Network: ${navigator.onLine ? "Online" : "Offline"} (${(navigator as any).connection?.effectiveType || "unknown"})`,
					16,
					0,
				);
			}

			// Send all commands to backend
			this.backend.processFrame(
				this.renderEvent.commandBuffer.data,
				this.renderEvent.commandBuffer.length,
			);

			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	}

	public resize(width: number, height: number): void {
		this.canvas.width = width;
		this.canvas.height = height;

		if (this.backend.resize) {
			this.backend.resize(width, height);
		} else {
			throw new Error("Current backend does not implement 'resize()'.");
		}
	}

	public createMesh(id: number, mesh: MeshData): void {
		if (!this.backend.createMesh) {
			throw new Error(
				"didnt you read the readme it says canvas backend doesnt support 3d!!!!\n read the readme its really cool (or the documentation site) saves you a lot of trouble!!!",
			);
		}

		this.backend.createMesh(id, mesh);
	}
}
