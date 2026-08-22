// reminder of what this is:
// this is the "event" object we get on like engine.onRender
//

import type { Vector2 } from "../math/Vector2";

// i also dont know if this is worth it: returning true/false if the operation failed/succeeded
export interface RenderEvent {
	clear(): void;

	// LATER: use `Color`
	setClearColor(r: number, g: number, b: number, a: number): void;

	set2DColor(r: number, g: number, b: number, a: number): void;
	set3DColor(r: number, g: number, b: number, a: number): void;

	drawLine(a: Vector2, b: Vector2): void;
	drawSquare(x: number, y: number, w: number, h: number): void; // use for rectangle
	drawPolygon(vertices: Array<Vector2>): void;

	draw(): void;
}
