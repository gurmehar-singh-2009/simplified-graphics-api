import type { Vector2 } from "../math/Vector2";

export enum Command {
	Clear,
	Set2DColor,
	Set3DColor,
	SetClearColor,
	DrawLine,
	DrawCircle,
	DrawSquare,
	DrawTriangle,
	DrawRegularPolygon,
	DrawPolygon
}

export class CommandBuffer {
	public data: Float32Array;
	public length: number;

	constructor(initialCapacity = 100_000) {
		this.data = new Float32Array(initialCapacity);
		this.length = 0;
	}

	public reset(): void {
		this.length = 0;
	}

	private ensureCapacity(neededSlots: number): void {
		if (this.length + neededSlots > this.data.length) {
			const resized = new Float32Array(this.data.length * 2);
			resized.set(this.data);
			this.data = resized;
		}
	}

	public clear(): void {
		this.ensureCapacity(1);
		this.data[this.length++] = Command.Clear;
	}

	public set2DColor(r: number, g: number, b: number, a: number): void {
		this.ensureCapacity(5);
		this.data[this.length++] = Command.Set2DColor;
		this.data[this.length++] = r;
		this.data[this.length++] = g;
		this.data[this.length++] = b;
		this.data[this.length++] = a;
	}

	public set3DColor(r: number, g: number, b: number, a: number): void {
		this.ensureCapacity(5);
		this.data[this.length++] = Command.Set3DColor;
		this.data[this.length++] = r;
		this.data[this.length++] = g;
		this.data[this.length++] = b;
		this.data[this.length++] = a;
	}

	public setClearColor(r: number, g: number, b: number, a: number): void {
		this.ensureCapacity(5);
		this.data[this.length++] = Command.SetClearColor;
		this.data[this.length++] = r;
		this.data[this.length++] = g;
		this.data[this.length++] = b;
		this.data[this.length++] = a;
	}

	public drawLine(p1: Vector2, p2: Vector2, thickness: number): void {
		this.ensureCapacity(5);
		this.data[this.length++] = Command.DrawLine;
		this.data[this.length++] = p1.x;
		this.data[this.length++] = p1.y;
		this.data[this.length++] = p2.x;
		this.data[this.length++] = p2.y;
		this.data[this.length++] = thickness;
	}

	public drawCircle(x: number, y: number, radius: number): void {
		this.ensureCapacity(4);
		this.data[this.length++] = Command.DrawCircle;
		this.data[this.length++] = x;
		this.data[this.length++] = y;
		this.data[this.length++] = radius;
	}

	public drawSquare(x: number, y: number, w: number, h: number): void {
		this.ensureCapacity(5);
		this.data[this.length++] = Command.DrawSquare;
		this.data[this.length++] = x;
		this.data[this.length++] = y;
		this.data[this.length++] = w;
		this.data[this.length++] = h;
	}

	public drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
		this.ensureCapacity(5);
		this.data[this.length++] = Command.DrawTriangle;
		this.data[this.length++] = x1;
		this.data[this.length++] = y1;
		this.data[this.length++] = x2;
		this.data[this.length++] = y2;
		this.data[this.length++] = x3;
		this.data[this.length++] = y3;
	}

	public drawRegularPolygon(x: number, y: number, size: number, sides: number, rot = 0): void {
		this.ensureCapacity(6);
		this.data[this.length++] = Command.DrawRegularPolygon;
		this.data[this.length++] = x;
		this.data[this.length++] = y;
		this.data[this.length++] = size;
		this.data[this.length++] = sides;
		this.data[this.length++] = rot;
	}

	public drawPolygon(vertices: Array<Vector2>): void {
		const vertCount = vertices.length;
		const requiredSlots = 2 + vertCount * 2;
		this.ensureCapacity(requiredSlots);

		this.data[this.length++] = Command.DrawPolygon;
		this.data[this.length++] = vertCount;

		for (let i = 0; i < vertCount; i++) {
			const pt = vertices[i];
			if (pt) {
				this.data[this.length++] = pt.x;
				this.data[this.length++] = pt.y;
			}
		}
	}
}