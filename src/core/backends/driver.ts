import { Command } from "../Commands";
import { Backends, type Backend, type RenderConfigs, type Texture } from "../Renderer";
import { CanvasBackend } from "./canvas";
import { WebGLBackend } from "./webgl";
import { WebGPUBackend } from "./webgpu";

export class Driver {
  private backend: Backend | null = null;

  init(canvas: HTMLCanvasElement, configs: RenderConfigs): void {
    switch (configs.backend) {
      case Backends.CANVAS:
        this.backend = new CanvasBackend(canvas, configs);
        break;
      case Backends.WEBGL:
        this.backend = new WebGLBackend(canvas, configs);
        break;
      case Backends.WEBGPU:
        this.backend = new WebGPUBackend(canvas, configs);
        break;
    }
  }

  processFrame(data: Float32Array, length: number): void {
    if (!this.backend) return;

    let i = 0;

    while (i < length) {
      const opcode = data[i++];

      switch (opcode) {
        case Command.Clear: {
          this.backend.clear!()
          break;
        }

        case Command.Set2DColor:
        case Command.Set3DColor:
          this.backend.setColor!(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;

        case Command.SetClearColor: {
          this.backend.setClearColor!(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Command.DrawLine:
          this.backend.drawLine!(data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;

        case Command.DrawCircle:
          this.backend.drawCircle!(data[i++]!, data[i++]!, data[i++]!);
          break;

        case Command.DrawSquare:
          this.backend.drawSquare!(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;

        case Command.DrawTriangle:
          this.backend.drawTriangle!(data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;

        case Command.DrawRegularPolygon:
          this.backend.drawRegularPolygon!(data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;

        case Command.DrawPolygon: {
          const vertCount = data[i++]!;
          const vertices: Array<[number, number]> = [];
          for (let v = 0; v < vertCount; v++) {
            vertices.push([data[i++]!, data[i++]!]);
          }
          this.backend.drawPolygon!(vertices);
          break;
        }
      }
    }
  }

  loadTexture(_texture: Texture): void { }
}
