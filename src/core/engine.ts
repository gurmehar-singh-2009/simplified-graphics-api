import { RenderEvent } from "./renderEvents";
import type { RenderConfigs } from "./renderer";
import type { Camera } from "./camera";
import type { Mesh, MeshData } from "../graphics/mesh";

export class Engine {
	private canvas: HTMLCanvasElement;

	private activeCamera: Camera | undefined;
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
		this.renderEvent = new RenderEvent(canvas, configs);
	}

	public start(): void {
		if (this.active) return;
		this.active = true;
		this.lastFrameTimestamp = performance.now();

		const loop = (timestamp: DOMHighResTimeStamp) => {
			if (!this.active) return;

			// FIX: clamp huge deltas (tab was backgrounded, debugger pause, etc.)
			const delta = Math.min(timestamp - this.lastFrameTimestamp, 100);
			this.lastFrameTimestamp = timestamp;

			if (delta > 0) {
				const currentFps = 1000 / delta;
				this.fps = this.fps * 0.9 + currentFps * 0.1;
			}

			this.onFrame(this.renderEvent, timestamp, delta);

			if (this.activeCamera) {
				this.renderEvent.updateView(this.activeCamera);
			}

			this.renderEvent.processFrame();

			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	}

	public stop(): void {
		this.active = false;
	}

	public setCamera(cam: Camera): void {
		this.activeCamera = cam;
		this.activeCamera.resize(this.canvas.width, this.canvas.height);

		this.activeCamera.onUpdateView = () => {
			this.renderEvent.updateView(this.activeCamera!);
		};
	}

	public resize(width: number, height: number): void {
		this.canvas.width = width;
		this.canvas.height = height;

		this.renderEvent.resize(width, height);

		if (this.activeCamera) {
			this.activeCamera.resize(width, height);

			this.activeCamera.onUpdateView = () => {
				this.renderEvent.updateView(this.activeCamera!);
			};
		}
	}

	public createMesh(data: MeshData): Mesh {
		return this.renderEvent.backend.createMesh(data);
	}
}
