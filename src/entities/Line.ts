import type { Vector2 } from "../math/vector2";
import { Entity } from "./Entity";

export class LineEntity extends Entity {
	public override init(): void {
		console.log("a line was created!!");
	}

	public start: Vector2;
	public end: Vector2;

	constructor(a: Vector2, b: Vector2) {
		super();

		this.start = a;
		this.end = b;
	}
}
