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
	public readonly type = "clear" as const;
}

export class SetColorCommand extends Command {
  public readonly type = "set_color" as const;

  public r: number;
  public g: number;
  public b: number;
  public a: number;

	constructor(
		r: number,
		g: number,
		b: number,
		a: number,
	) {
    super();

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
	}
}

export class SetClearCommand extends Command {
	public readonly type = "set_clear" as const;

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
	public readonly type = "draw_line" as const;

	constructor(
		public a: Vector2,
		public b: Vector2,
	) {
		super();
	}
}

export class DrawSquareCommand extends Command {
	public readonly type = "draw_square" as const;

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
	public readonly type = "draw_polygon" as const;

	constructor([..._entities]) {
		super();
	}
}
