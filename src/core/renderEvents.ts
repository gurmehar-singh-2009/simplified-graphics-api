// reminder of what this is:
// this is the "event" object we get on like engine.onRender
//
// i also dont know if this is worth it: returning true/false if the operation failed/succeeded
//
// essentially, this is what they get as the callback param to do stuff with

import type { Vector2 } from "../math/vector2";
import type { Camera } from "./camera";
import { CanvasBackend } from "./backends/canvas";
import { WebGLBackend } from "./backends/webgl";
import { WebGPUBackend } from "./backends/webgpu";
import { type Backend, Backends, type RenderConfigs } from "./renderer";

export class RenderEvent {
	private configs: RenderConfigs;

	private backend: Backend;

	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
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
	}

	public clear(r: number, g: number, b: number, a: number): void {
		if (!this.backend.clear) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'clear()'.",
			);
		}
		this.backend.clear(r, g, b, a);
	}

	public setColor(r: number, g: number, b: number, a: number): void {
		if (!this.backend.setColor) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'setColor()'.",
			);
		}
		this.backend.setColor(r, g, b, a);
	}

	public drawLine(a: Vector2, b: Vector2, thickness: number): void {
		if (!this.backend.drawLine) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawLine()'.",
			);
		}
		this.backend.drawLine(a.x, a.y, b.x, b.y, thickness);
	}

	public drawCircle(x: number, y: number, radius: number): void {
		if (!this.backend.drawCircle) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawCircle()'.",
			);
		}
		this.backend.drawCircle(x, y, radius);
	}

	public drawRect(x: number, y: number, w: number, h: number): void {
		if (!this.backend.drawRect) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawRect()'.",
			);
		}
		this.backend.drawRect(x, y, w, h);
	}

	public drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void {
		if (!this.backend.drawTriangle) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawTriangle()'.",
			);
		}
		this.backend.drawTriangle(x1, y1, x2, y2, x3, y3);
	}

	public drawRegularPolygon(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void {
		if (!this.backend.drawRegularPolygon) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawRegularPolygon()'.",
			);
		}
		this.backend.drawRegularPolygon(x, y, size, sides, rot);
	}

	public drawPolygon(vertices: Array<Vector2>): void {
		if (!this.backend.drawPolygon) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawPolygon()'.",
			);
		}
		this.backend.drawPolygon(vertices);
	}

	// Extra commands handled here so backends dont get cluttered.
	public drawPentagon(x: number, y: number, size: number, rot?: number): void {
		if (!this.backend.drawRegularPolygon) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawRegularPolygon()'.",
			);
		}
		this.backend.drawRegularPolygon(x, y, size, 5, rot);
	}

	public drawHexagon(x: number, y: number, size: number, rot?: number): void {
		if (!this.backend.drawRegularPolygon) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawRegularPolygon()'.",
			);
		}
		this.backend.drawRegularPolygon(x, y, size, 6, rot);
	}

	public drawSeptagon(x: number, y: number, size: number, rot?: number): void {
		if (!this.backend.drawRegularPolygon) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawRegularPolygon()'.",
			);
		}
		this.backend.drawRegularPolygon(x, y, size, 7, rot);
	}

	public drawOctogon(x: number, y: number, size: number, rot?: number): void {
		if (!this.backend.drawRegularPolygon) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawRegularPolygon()'.",
			);
		}
		this.backend.drawRegularPolygon(x, y, size, 8, rot);
	}

	public drawText(x: number, y: number, text: string, size: number, alignment: number): void {
		if (!this.backend.drawText) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'drawText()'.",
			);
		}
		this.backend.drawText(x, y, text, size, alignment);
	}

	public updateView(camera: Camera) {
		if (!this.backend.updateView) {
			throw new Error(
				this.backend.constructor.name + " does not implement 'updateView()'.",
			);
		}
		this.backend.updateView(camera);
	}

	public processFrame(fps: number) {
		// Render the debug panel.
		if (this.configs.debug) {
			this.setColor(0, 0, 0, 1);
			this.drawRect(10, 10, 400, 200);

			this.setColor(255, 255, 255, 1);
			this.drawText(200, 35, "DEBUG PANEL", 18, 1);

			this.drawText(20, 85, `FPS: ${fps.toFixed(2)}`, 16, 0);
			this.drawText(
				20,
				105,
				`Memory: ${"memory" in performance && (performance as any).memory ? ((performance as any).memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + "MB / " + ((performance as any).memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + "MB" : "N/A"}`,
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

		if (this.backend.flush) {
			this.backend.flush();
		} else {
			throw new Error(
				this.backend.constructor.name.constructor.name + " does not implement 'flush()'.",
			);
		}
	}
}
