import type * as Cmds from "./Commands";
import type { Backend } from "./Renderer";

type CommandClassKey = Exclude<keyof typeof Cmds, "Command">;
type EngineCommand = InstanceType<(typeof Cmds)[CommandClassKey]>;

export class Driver {
	private backend: Backend;
	private clearColor: Array<number> = [255, 255, 255, 1];

	constructor(backend: Backend) {
		this.backend = backend;
	}

	processFrame(commands: Array<Cmds.Command>): void {
		for (const c of commands) {
			const cmd = c as EngineCommand;
			switch (cmd.type) {
				case "clear": {
					const [r, g, b, a] = this.clearColor;
					this.backend.clear(r!, g!, b!, a!);
					break;
				}
				case "set_clear":
					this.clearColor = [cmd.r, cmd.g, cmd.b, cmd.a];
					break;
				case "set_color":
					this.backend.setColor(cmd.r, cmd.g, cmd.b, cmd.a);
					break;
				case "draw_triangle":
					this.backend.drawTriangle(
						cmd.x1,
						cmd.y1,
						cmd.x2,
						cmd.y2,
						cmd.x3,
						cmd.y3,
					);
					break;
				case "draw_square":
					this.backend.drawSquare(cmd.x, cmd.y, cmd.w, cmd.h);
					break;
				case "draw_pentagon":
					this.backend.drawPentagon(cmd.x, cmd.y, cmd.size, cmd.rot);
					break;
				case "draw_hexagon":
					this.backend.drawHexagon(cmd.x, cmd.y, cmd.size, cmd.rot);
					break;
				case "draw_septagon":
					this.backend.drawSeptagon(cmd.x, cmd.y, cmd.size, cmd.rot);
					break;
				case "draw_octogon":
					this.backend.drawOctogon(cmd.x, cmd.y, cmd.size, cmd.rot);
					break;
				case "draw_custom_side_polygon":
					this.backend.drawCustomSides(
						cmd.x,
						cmd.y,
						cmd.size,
						cmd.sides,
						cmd.rot,
					);
					break;
			}
		}
		this.backend.present();
	}

	loadTexture(_texture: unknown): void {}
}
