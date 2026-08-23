import { Driver } from "./backends/driver";
import { CommandBuffer } from "./Commands";
import type { RenderEvent } from "./RenderEvent";
import { Backends, type RenderConfigs, type Texture } from "./Renderer";

export class Engine {
  private configs: RenderConfigs;
  private backendDriver!: Driver;
  private textures: Map<string, Texture> = new Map();
  private active = false;
  private canvas: HTMLCanvasElement;

  public onRender: (event: RenderEvent) => void = () => { };

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.canvas = canvas;
    this.configs = configs;

    switch (this.configs.backend) {
      case Backends.CANVAS:
        this.backendDriver = new Driver();
        break;
      case Backends.WEBGL:
        break;
      case Backends.WEBGPU:
        throw new Error("buddy no webgpu yet!");
    }

    // handle anti aliasing
    canvas.width =
      document.documentElement.clientWidth * (configs.antialias ? 4 : 1);
    canvas.height =
      document.documentElement.clientHeight * (configs.antialias ? 4 : 1);

    canvas.style.width = `${document.documentElement.clientWidth}px`;
    canvas.style.height = `${document.documentElement.clientHeight}px`;

    if (configs.antialias) canvas.getContext("2d")?.scale(4, 4);
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
    const command_buffer: CommandBuffer = new CommandBuffer();

    return {
      clear: () => command_buffer.clear(),
      set2DColor: (r, g, b, a) => command_buffer.set2DColor(r, g, b, a),
      set3DColor: (r, g, b, a) => command_buffer.set3DColor(r, g, b, a),
      setClearColor: (r, g, b, a) => command_buffer.setClearColor(r, g, b, a),
      drawLine: (a, b, thickness) => command_buffer.drawLine(a, b, thickness),
      drawCircle: (x, y, radius) => command_buffer.drawCircle(x, y, radius),
      drawSquare: (x, y, w, h) => command_buffer.drawSquare(x, y, w, h),
      drawTriangle: (x1, y1, x2, y2, x3, y3) => command_buffer.drawTriangle(x1, y1, x2, y2, x3, y3),
      drawPentagon: (x, y, size, rot) => command_buffer.drawRegularPolygon(x, y, size, 5, rot),
      drawHexagon: (x, y, size, rot) => command_buffer.drawRegularPolygon(x, y, size, 6, rot),
      drawSeptagon: (x, y, size, rot) => command_buffer.drawRegularPolygon(x, y, size, 7, rot),
      drawOctogon: (x, y, size, rot) => command_buffer.drawRegularPolygon(x, y, size, 8, rot),
      drawCustomSides: (x, y, size, sides, rot) => command_buffer.drawRegularPolygon(x, y, size, sides, rot),
      drawPolygon: ([...entities]) => command_buffer.drawPolygon(entities),
      draw: () => this.backendDriver.processFrame(command_buffer.data, command_buffer.length),
    };
  }
}
