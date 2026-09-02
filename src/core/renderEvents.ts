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
	private quadMesh: Mesh | undefined;
	private triangleMesh: Mesh | undefined;
	private regularPolygonCache: Map<number, Mesh> = new Map();

	private static readonly tempTransform = new Transform();
	private static readonly tempVector1 = new Vector3();
	private static readonly tempVector2 = new Vector3();
	private static readonly tempVector3 = new Vector3();

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
	}

	public clear(r: number, g: number, b: number, a: number): void {
		if (this.backend.clear) {
			this.backend.clear(r, g, b, a);
		}
	}

	public drawLine(x1: number, y1: number, x2: number, y2: number, thickness: number = 0.1, z: number = 0): void {
        const lineCenterX = (x1 + x2) / 2;
        const lineCenterY = (y1 + y2) / 2;

        this.drawRect(lineCenterX, lineCenterY, Math.hypot(x2 - x1, y2 - y1), thickness, Math.atan2(y2 - y1, x2 - x1), z);
	}

	public drawCircle(x: number, y: number, radius: number, z: number = 0): void {
		// For now. Can add SDFs to material later.
		this.drawRegularPolygon(x, y, radius*2, 32, 0, z);
	}

	public drawRect(
		x: number,
		y: number,
		w: number,
		h: number,
		rot: number = 0,
		z: number = 0,
	): void {
		if (!this.quadMesh) {
			this.quadMesh = this.backend.createMesh(MeshBuilder.Quad(1, 1));
		}
		RenderEvent.tempTransform.setPosition(x, y, z);
		RenderEvent.tempTransform.setRotationEuler(0, 0, rot);
		RenderEvent.tempTransform.setScale(w, h, 1);
		this.drawMesh(this.quadMesh, RenderEvent.tempTransform);
	}

	public drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		z: number = 0,
	): void {
		if (!this.triangleMesh) {
			this.triangleMesh = this.backend.createMesh(MeshBuilder.UnitTriangle());
		}
		RenderEvent.tempVector1.set(x1, y1, z);
		RenderEvent.tempVector2.set(x2, y2, z);
		RenderEvent.tempVector3.set(x3, y3, z);

		RenderEvent.tempTransform.setTriangleTransform(RenderEvent.tempVector1, RenderEvent.tempVector2, RenderEvent.tempVector3);

		this.drawMesh(this.triangleMesh, RenderEvent.tempTransform);
	}

	public drawRegularPolygon(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot: number = 0,
		z: number = 0,
	): void {
		if (sides < 3) {
			sides = 3;
		}

		let mesh = this.regularPolygonCache.get(sides);

		if (!mesh) {
			mesh = this.backend.createMesh(MeshBuilder.RegularPolygon(1, sides));
			this.regularPolygonCache.set(sides, mesh);
		}

		RenderEvent.tempTransform.setPosition(x, y, z);
		RenderEvent.tempTransform.setRotationEuler(0, 0, rot || 0);
		RenderEvent.tempTransform.setScale(size, size, 1);
		this.drawMesh(mesh, RenderEvent.tempTransform);
	}

	public drawPolygon(vertices: Array<Vector2>): void { }

	public drawText(
		x: number,
		y: number,
		text: string,
		size: number,
		alignment: number,
	): void {
		// TODO
	}

	public drawPentagon(
		x: number,
		y: number,
		size: number,
		rot: number = 0,
		z: number = 0,
	): void {
		this.drawRegularPolygon(x, y, size, 5, rot);
	}

	public drawHexagon(
		x: number,
		y: number,
		size: number,
		rot: number = 0,
		z: number = 0,
	): void {
		this.drawRegularPolygon(x, y, size, 6, rot, z);
	}

	public drawSeptagon(
		x: number,
		y: number,
		size: number,
		rot: number = 0,
		z: number = 0,
	): void {
		this.drawRegularPolygon(x, y, size, 7, rot, z);
	}

	public drawOctagon(
		x: number,
		y: number,
		size: number,
		rot: number = 0,
		z: number = 0,
	): void {
		this.drawRegularPolygon(x, y, size, 8, rot, z);
	}

	public drawMesh(mesh: Mesh, transform: Transform): void {
		this.backend.drawMesh(mesh, transform.matrix4);
	}

	public updateView(camera: Camera): void {
		if (this.backend.updateView) {
			this.backend.updateView(camera);
		}
	}

	public resize(width: number, height: number): void {
		this.backend.resize?.(width, height);
	}

	//public processFrame(): void { }

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
