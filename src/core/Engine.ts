import { CanvasDriver } from "./backends/drivers/canvas_driver";
import type { BackendDriver } from "./backends/drivers/driver";
import {
  ClearCommand,
  type Command,
  DrawCustomSidePolygonCommand,
  DrawHexagonCommand,
  DrawLineCommand,
  DrawOctogonCommand,
  DrawPentagonCommand,
  DrawPolygonCommand,
  DrawSeptagonCommand,
  DrawSquareCommand,
  DrawTriangleCommand,
  SetClearCommand,
  SetColorCommand,
} from "./Commands";
import type { RenderEvent } from "./RenderEvent";
import { Backends, type RenderConfigs, type Texture } from "./Renderer";

export class Engine {
  private configs: RenderConfigs;
  private backendDriver!: BackendDriver;
  private textures: Map<string, Texture> = new Map();
  private active = false;
  private canvas: HTMLCanvasElement;

  public onRender: (event: RenderEvent) => void = () => {};

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.canvas = canvas;
    this.configs = configs;

    switch (this.configs.backend) {
      case Backends.CANVAS:
        this.backendDriver = new CanvasDriver();
        break;
      case Backends.WEBGL:
        break;
      case Backends.WEBGPU:
        throw new Error("buddy no webgpu yet!");
    }
  }

  public start(): void {
    if (this.active) return;
    this.active = true;

    this.backendDriver.init(this.canvas, this.configs);

    const loop = () => {
      if (!this.active) return;

      const frame_event = this.createRenderEvent();

      this.onRender(frame_event);

      // this.backendDriver.processFrame(frame_event);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  public loadTexture(texture: Texture): void {
    this.textures.set(texture.id, texture);
    this.backendDriver.loadTexture(texture);
  }

  public loadTextures(textures: Texture[]): void {
    for (const texture of textures) {
      this.loadTexture(texture);
    }
  }

  private createRenderEvent(): RenderEvent {
    const command_buffer: Array<Command> = [];

    return {
      clear: () => command_buffer.push(new ClearCommand()),
      set2DColor: (r, g, b, a) =>
        command_buffer.push(new SetColorCommand(r, g, b, a)),
      set3DColor: (r, g, b, a) =>
        command_buffer.push(new SetColorCommand(r, g, b, a)),
      setClearColor: (r, g, b, a) =>
        command_buffer.push(new SetClearCommand(r, g, b, a)),
      drawLine: (a, b) => command_buffer.push(new DrawLineCommand(a, b)),

      drawTriangle: (x, y, size, rot) =>
        command_buffer.push(new DrawTriangleCommand(x, y, size, rot)),
      drawSquare: (x, y, w, h) =>
        command_buffer.push(new DrawSquareCommand(x, y, w, h)),
      drawPentagon: (x, y, size, rot) =>
        command_buffer.push(new DrawPentagonCommand(x, y, size, rot)),
      drawHexagon: (x, y, size, rot) =>
        command_buffer.push(new DrawHexagonCommand(x, y, size, rot)),
      drawSeptagon: (x, y, size, rot) =>
        command_buffer.push(new DrawSeptagonCommand(x, y, size, rot)),
      drawOctogon: (x, y, size, rot) =>
        command_buffer.push(new DrawOctogonCommand(x, y, size, rot)),
      drawCustomSides: (x, y, size, sides, rot) =>
        command_buffer.push(
          new DrawCustomSidePolygonCommand(x, y, size, sides, rot),
        ),

      drawPolygon: ([...entities]) =>
        command_buffer.push(new DrawPolygonCommand(entities)),

      draw: () => this.backendDriver.processFrame(command_buffer),
    };
  }
}
