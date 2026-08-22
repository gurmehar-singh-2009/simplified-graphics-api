import { CanvasBackend } from "./backends/canvas";
import { WebGPUBackend } from "./backends/webgpu";
import {
	ClearCommand,
	type Command,
	DrawCircleCommand,
	DrawCustomSidePolygonCommand,
	DrawHexagonCommand,
	DrawLineCommand,
	DrawOctogonCommand,
	DrawPentagonCommand,
	DrawPolygonCommand,
	DrawSeptagonCommand,
	DrawSquareCommand,
	DrawTriangleCommand,
	SetClearCommand,
	SetColorCommand,
} from "./Commands";
import { Driver } from "./Driver";
import type { RenderEvent } from "./RenderEvent";
import {
	type Backend,
	Backends,
	type RenderConfigs,
	type Texture,
} from "./Renderer";

export class Engine {
	private configs: RenderConfigs;
	private backendDriver!: Driver;
	private textures: Map<string, Texture> = new Map();
  private active = false;
  private canvas: HTMLCanvasElement;

	public onRender: (event: RenderEvent) => void = () => {};

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
				throw new Error("WebGL backend not implemented yet");
			default:
				throw new Error(`Unsupported backend: ${this.configs.backend}`);
		}
		this.backendDriver = new Driver(backend);

		// handle anti aliasing
		canvas.width =
			document.documentElement.clientWidth * (configs.antialias ? 4 : 1);
		canvas.height =
			document.documentElement.clientHeight * (configs.antialias ? 4 : 1);

		canvas.style.width = `${document.documentElement.clientWidth}px`;
		canvas.style.height = `${document.documentElement.clientHeight}px`;

		if (configs.antialias) canvas.getContext("2d")?.scale(4, 4);
	}

	public start(): void {
		if (this.active) return;
		this.active = true;

		// this.backendDriver.init(this.canvas, this.configs, Backends.WEBGPU);

		const loop = () => {
			if (!this.active) return;

			const frame_event = this.createRenderEvent();

			this.onRender(frame_event);

			// this.backendDriver.processFrame(frame_event);

			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	}

	public loadTexture(texture: Texture): void {
		this.textures.set(texture.id, texture);
		this.backendDriver.loadTexture(texture);
	}

	public loadTextures(textures: Texture[]): void {
		for (const texture of textures) {
			this.loadTexture(texture);
		}
	}

	private createRenderEvent(): RenderEvent {
		const command_buffer: Array<Command> = [];

		return {
			clear: () => command_buffer.push(new ClearCommand()),
			set2DColor: (r, g, b, a) =>
				command_buffer.push(new SetColorCommand(r, g, b, a)),
			set3DColor: (r, g, b, a) =>
				command_buffer.push(new SetColorCommand(r, g, b, a)),
			setClearColor: (r, g, b, a) =>
				command_buffer.push(new SetClearCommand(r, g, b, a)),
			drawLine: (a, b) => command_buffer.push(new DrawLineCommand(a, b)),

			drawCircle: (x, y, radius) =>
				command_buffer.push(new DrawCircleCommand(x, y, radius)),
			drawTriangle: (x1, y1, x2, y2, x3, y3) =>
				command_buffer.push(new DrawTriangleCommand(x1, y1, x2, y2, x3, y3)),
			drawSquare: (x, y, w, h) =>
				command_buffer.push(new DrawSquareCommand(x, y, w, h)),
			drawPentagon: (x, y, size, rot) =>
				command_buffer.push(new DrawPentagonCommand(x, y, size, rot)),
			drawHexagon: (x, y, size, rot) =>
				command_buffer.push(new DrawHexagonCommand(x, y, size, rot)),
			drawSeptagon: (x, y, size, rot) =>
				command_buffer.push(new DrawSeptagonCommand(x, y, size, rot)),
			drawOctogon: (x, y, size, rot) =>
				command_buffer.push(new DrawOctogonCommand(x, y, size, rot)),
			drawCustomSides: (x, y, size, sides, rot) =>
				command_buffer.push(
					new DrawCustomSidePolygonCommand(x, y, size, sides, rot),
				),

			drawPolygon: ([...entities]) =>
				command_buffer.push(new DrawPolygonCommand(entities)),

			draw: () => this.backendDriver.processFrame(command_buffer),
		};
	}
}
