// MAYBE im overcomplicating this
// this will contain a bunch of "commands" we send to our drivers
// these commands will be backend-independent, and are handled individually by each backend
//

import type { Vector2 } from "../math/Vector2";

export abstract class Command {
	public abstract readonly type: string;
}

// COMMANDS

export class ClearCommand extends Command {
	public readonly type = "clear";
}

export class SetColorCommand extends Command {
	public readonly type = "set_color";

	constructor(
		public r: number,
		public g: number,
		public b: number,
		public a: number,
	) {
		super();
	}
}

export class SetClearCommand extends Command {
	public readonly type = "set_clear";

	constructor(
		public r: number,
		public g: number,
		public b: number,
		public a: number,
	) {
		super();
	}
}

export class DrawLineCommand extends Command {
	public readonly type = "draw_line";

	constructor(
		public a: Vector2,
		public b: Vector2,
	) {
		super();
	}
}

export class DrawSquareCommand extends Command {
	public readonly type = "draw_square";

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
	) {
		super();
	}
}

export class DrawPolygonCommand extends Command {
	public readonly type = "draw_polygon";

	constructor([..._entities]) {
		super();
	}
}
