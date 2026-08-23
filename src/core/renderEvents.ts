// reminder of what this is:
// this is the "event" object we get on like engine.onRender
//
// i also dont know if this is worth it: returning true/false if the operation failed/succeeded
//
// essentially, this is what they get as the callback param to do stuff with

import type { Vector2 } from "../math/vector2";
import { CommandBuffer } from "./commands";

export class RenderEvent {
	public commandBuffer: CommandBuffer;

	constructor() {
		this.commandBuffer = new CommandBuffer();
	}

	public resetCommandBuffer(): void {
		this.commandBuffer.reset();
	}

	public clear(r: number, g: number, b: number, a: number): void {
		this.commandBuffer.clear(r, g, b, a);
	}

	public setColor(r: number, g: number, b: number, a: number): void {
		this.commandBuffer.set2DColor(r, g, b, a);
	}

	public drawLine(a: Vector2, b: Vector2, thickness: number): void {
		this.commandBuffer.drawLine(a, b, thickness);
	}

	public drawCircle(x: number, y: number, radius: number): void {
		this.commandBuffer.drawCircle(x, y, radius);
	}

	public drawSquare(x: number, y: number, w: number, h: number): void {
		this.commandBuffer.drawSquare(x, y, w, h);
	}

	public drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void {
		this.commandBuffer.drawTriangle(x1, y1, x2, y2, x3, y3);
	}

	public drawRegularPolygon(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void {
		this.commandBuffer.drawRegularPolygon(x, y, size, sides, rot);
	}

	public drawPolygon(vertices: Array<Vector2>): void {
		this.commandBuffer.drawPolygon(vertices);
	}

	// Extra commands handled here so backends dont get cluttered.
	public drawPentagon(x: number, y: number, size: number, rot?: number): void {
		this.commandBuffer.drawRegularPolygon(x, y, size, 5, rot);
	}

	public drawHexagon(x: number, y: number, size: number, rot?: number): void {
		this.commandBuffer.drawRegularPolygon(x, y, size, 6, rot);
	}

	public drawSeptagon(x: number, y: number, size: number, rot?: number): void {
		this.commandBuffer.drawRegularPolygon(x, y, size, 7, rot);
	}

	public drawOctogon(x: number, y: number, size: number, rot?: number): void {
		this.commandBuffer.drawRegularPolygon(x, y, size, 8, rot);
  }

  public drawText(x: number, y: number, text: string, size: number): void {
    this.commandBuffer.drawText(x, y, text, size);
  }
}
