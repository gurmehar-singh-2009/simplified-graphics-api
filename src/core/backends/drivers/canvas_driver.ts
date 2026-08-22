import type * as Cmds from "../../Commands";
import type { Command } from "../../Commands";
import type { Texture } from "../../Renderer";
import type { BackendDriver } from "./driver";

type EngineCommand = InstanceType<(typeof Cmds)[keyof typeof Cmds]>;

export class CanvasDriver implements BackendDriver {
	private ctx: CanvasRenderingContext2D | null = null;

	init(canvas: HTMLCanvasElement): void {
		this.ctx = canvas.getContext("2d");
	}

	processFrame(commands: Array<Command>): void {
		if (!this.ctx) return;
		for (const c of commands) {
			const cmd = c as EngineCommand;

			switch (cmd.type) {
				case "clear":
					this.ctx.clearRect(
						0,
						0,
						this.ctx.canvas.width,
						this.ctx.canvas.height,
					);
					break;

				case "set_clear":
					break;
			}
		}
	}

	loadTexture(_texture: Texture): void {}
}
