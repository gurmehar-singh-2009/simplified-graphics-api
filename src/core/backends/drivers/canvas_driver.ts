import type * as Cmds from "../../Commands";
import type { Command } from "../../Commands";
import type { RenderConfigs, Texture } from "../../Renderer";
import { CanvasBackend } from "../canvas";
import type { BackendDriver } from "./driver";

type CommandClassKey = Exclude<keyof typeof Cmds, "Command">;
type EngineCommand = InstanceType<(typeof Cmds)[CommandClassKey]>;

export class CanvasDriver implements BackendDriver {
  private ctx: CanvasRenderingContext2D | null = null;

  private backend: CanvasBackend | null = null;

  private clearColor: Array<number> = [255, 0, 0, 1];

  init(canvas: HTMLCanvasElement, configs: RenderConfigs): void {
    this.ctx = canvas.getContext("2d");

    this.backend = new CanvasBackend(canvas, configs);
  }

  processFrame(commands: Array<Command>): void {
    console.error("processing frame", commands);
    if (!this.ctx) return;

    for (const c of commands) {
      const cmd = c as EngineCommand;

      console.warn(cmd);

      switch (cmd.type) {
        case "clear": {
          const [r, g, b, a] = this.clearColor;
          this.backend!.clear(r!, g!, b!, a!);

          break;
        }

        case "set_clear":
          this.backend!.setColor(cmd.r, cmd.g, cmd.b, cmd.a);
          break;
      }
    }
  }

  loadTexture(_texture: Texture): void {}
}
