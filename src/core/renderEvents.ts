import { Backends } from "./renderer";
import { MeshBuilder, type Mesh, type MeshData } from "../graphics/mesh";
import { Quaternion } from "../math/quaternion";
import type { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { Transform } from "../math/transform";
import { CanvasBackend } from "./backends/canvas";
import { WebGLBackend } from "./backends/webgl";
import { WebGPUBackend } from "./backends/webgpu";
import type { Camera } from "./camera";
import type { Backend, RenderConfigs } from "./renderer";

export class RenderEvent {
	private configs: RenderConfigs;
	public backend: Backend;
	private quadMesh: Mesh;

	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
		this.configs = configs;
		switch (configs.backend) {
			// case Backends.CANVAS:
			// 	this.backend = new CanvasBackend(canvas, configs);
			// 	break;
			// case Backends.WEBGPU:
			// 	this.backend = new WebGPUBackend(canvas, configs);
			// 	break;
			case Backends.WEBGL:
				this.backend = new WebGLBackend(canvas, configs);
				break;
			default:
				throw new Error(`Unsupported backend: ${String(configs.backend)}`);
		}

		this.quadMesh = this.backend.createMesh(MeshBuilder.Quad(1, 1));
	}

	public clear(r: number, g: number, b: number, a: number): void {
		if (this.backend.clear) {
			this.backend.clear(r, g, b, a);
		}
	}

	// All of these still work in progress. Simply use quad mesh to draw shapes.
	public drawLine(a: Vector2, b: Vector2, thickness: number): void {}

	public drawCircle(x: number, y: number, radius: number): void {}

	public drawRect(
		x: number,
		y: number,
		w: number,
		h: number,
		rot?: number,
	): void {}

	public drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void {}

	public drawRegularPolygon(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void {}

	public drawPolygon(vertices: Array<Vector2>): void {}

	public drawText(
		x: number,
		y: number,
		text: string,
		size: number,
		alignment: number,
	): void {}

	public drawMesh(mesh: Mesh, transform: Transform): void {
		this.backend.drawMesh(mesh, transform);
	}

	public updateView(camera: Camera): void {
		if (this.backend.updateView) {
			this.backend.updateView(camera);
		}
	}

	public resize(width: number, height: number): void {
		this.backend.resize?.(width, height);
	}

	public drawPentagon(x: number, y: number, size: number, rot?: number): void {}
	public drawHexagon(x: number, y: number, size: number, rot?: number): void {}
	public drawSeptagon(x: number, y: number, size: number, rot?: number): void {}
	public drawOctagon(x: number, y: number, size: number, rot?: number): void {}

	public processFrame(): void {}

	// private drawDebugPanel(fps: number): void {
	// 	this.drawRect(10, 10, 400, 200);

	// 	this.drawText(200, 35, "DEBUG PANEL", 18, 1);
	// 	this.drawText(20, 85, `FPS: ${fps.toFixed(2)}`, 16, 0);

	// 	const mem = (performance as any).memory;
	// 	this.drawText(
	// 		20,
	// 		105,
	// 		`Memory: ${mem ? `${(mem.usedJSHeapSize / 1048576).toFixed(2)}MB / ${(mem.jsHeapSizeLimit / 1048576).toFixed(2)}MB` : "N/A"}`,
	// 		16,
	// 		0,
	// 	);
	// 	this.drawText(
	// 		20,
	// 		125,
	// 		`CPU Cores: ${navigator.hardwareConcurrency || "N/A"}`,
	// 		16,
	// 		0,
	// 	);
	// 	this.drawText(
	// 		20,
	// 		145,
	// 		`Resolution: ${window.innerWidth}x${window.innerHeight}`,
	// 		16,
	// 		0,
	// 	);
	// 	this.drawText(
	// 		20,
	// 		165,
	// 		`Network: ${navigator.onLine ? "Online" : "Offline"} (${(navigator as any).connection?.effectiveType || "unknown"})`,
	// 		16,
	// 		0,
	// 	);
	// }
}
