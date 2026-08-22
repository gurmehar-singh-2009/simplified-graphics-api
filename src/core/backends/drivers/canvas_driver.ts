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

  private clearColor: Array<number> = [255, 255, 255, 1];

  init(canvas: HTMLCanvasElement, configs: RenderConfigs): void {
    this.ctx = canvas.getContext("2d");

    this.backend = new CanvasBackend(canvas, configs);
  }

  processFrame(commands: Array<Command>): void {
    if (!this.ctx) return;

    for (const c of commands) {
      const cmd = c as EngineCommand;

      switch (cmd.type) {
        case "clear": {
          const [r, g, b, a] = this.clearColor;
          this.backend?.setClearColor(r!, g!, b!, a!);
          this.backend?.clear();

          break;
        }

        case "set_clear":
          this.backend?.setClearColor(cmd.r, cmd.g, cmd.b, cmd.a);
          break;

        case "set_color":
          this.backend?.setColor(cmd.r, cmd.g, cmd.b, cmd.a);
          break;

        case "draw_triangle":
          this.backend?.drawTriangle(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x3, cmd.y3);
          break;

        case "draw_square":
          this.backend?.drawSquare(cmd.x, cmd.y, cmd.w, cmd.h);
          break;

        case "draw_pentagon":
          this.backend?.drawRegularPolygon(cmd.x, cmd.y, cmd.size, 5, cmd.rot);
          break;

        case "draw_hexagon":
          this.backend?.drawRegularPolygon(cmd.x, cmd.y, cmd.size, 6, cmd.rot);
          break;

        case "draw_septagon":
          this.backend?.drawRegularPolygon(cmd.x, cmd.y, cmd.size, 7, cmd.rot);
          break;

        case "draw_octogon":
          this.backend?.drawRegularPolygon(cmd.x, cmd.y, cmd.size, 8, cmd.rot);
          break;

        case "draw_custom_side_polygon":
          this.backend?.drawRegularPolygon(
            cmd.x,
            cmd.y,
            cmd.size,
            cmd.sides,
            cmd.rot,
          );
          break;
      }
    }
  }

  loadTexture(_texture: Texture): void {}
}
