// reminder of what this is:
// this is the "event" object we get on like engine.onRender
//

import type { Vector2 } from "../math/Vector2";

// i also dont know if this is worth it: returning true/false if the operation failed/succeeded
//
// essentially, this is what they get as the callback param to do stuff with
export interface RenderEvent {
	clear(): void;

	// LATER: use `Color`
	setClearColor(r: number, g: number, b: number, a: number): void;

	set2DColor(r: number, g: number, b: number, a: number): void;
	set3DColor(r: number, g: number, b: number, a: number): void;

	drawLine(a: Vector2, b: Vector2): void;

	// 2d
	drawCircle(x: number, y: number, radius: number): void;
	drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void;
	drawSquare(x: number, y: number, w: number, h: number, rot?: number): void;
	drawPentagon(x: number, y: number, size: number, rot?: number): void;
	drawHexagon(x: number, y: number, size: number, rot?: number): void;
	drawSeptagon(x: number, y: number, size: number, rot?: number): void;
	drawOctogon(x: number, y: number, size: number, rot?: number): void;
	drawCustomSides(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void;
	drawPolygon(vertices: Array<Vector2>): void;

	// 3d

	draw(): void;
}
