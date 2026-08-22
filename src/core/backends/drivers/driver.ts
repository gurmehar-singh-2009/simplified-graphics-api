import type { Command } from "../../Commands";
import type { Texture } from "../../Renderer";

export interface BackendDriver {
	init(canvas: HTMLCanvasElement): void;
	processFrame(commands: Array<Command>): void;
	loadTexture(texture: Texture): void;
}
