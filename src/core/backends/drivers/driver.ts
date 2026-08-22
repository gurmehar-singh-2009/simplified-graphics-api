import type { Command } from "../../Commands";
import type { RenderConfigs, Texture } from "../../Renderer";

export interface BackendDriver {
  init(canvas: HTMLCanvasElement, configs: RenderConfigs): void;
	processFrame(commands: Array<Command>): void;
	loadTexture(texture: Texture): void;
}
