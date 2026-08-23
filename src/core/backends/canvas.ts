// design idea:
// do the below thing for all 3 render backends
// because they all vary so much (canvas2d can just be a bunch of arrays, while webgpu needs actual buffer allocation and resizing)

import type { RenderConfigs, Backend } from "../Renderer";
import { Commands } from "../Commands";

export class CanvasBackend implements Backend {
  configs: RenderConfigs;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.configs = configs;

    this.ctx = canvas.getContext("2d")!;
  }

  clear(r: number, g: number, b: number, a: number): void {
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  setColor(r: number, g: number, b: number, a: number): void {
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  
  drawLine(x1: number, y1: number, x2: number, y2: number, thickness: number): void {
    this.ctx.lineWidth = thickness;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawCircle(x: number, y: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.lineTo(x1, y1);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawSquare(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect(x, y, w, h);
  }

  drawRegularPolygon(x: number, y: number, size: number, sides: number, rot?: number): void {
    rot = rot || 0.

    this.ctx.beginPath();
    for (let i = rot; i < Math.PI * 2 + rot; i += Math.PI * 2 / sides) {
      const coordinate = {
        x: x + size * Math.cos(i),
        y: y + size * Math.sin(i),
      };

      this.ctx[i === rot ? "moveTo" : "lineTo"](coordinate.x, coordinate.y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawPolygon(vertices: Array<[number, number]>): void {
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0]![0], vertices[0]![1]);
    for (let i = 1; i < vertices.length; i++) {
      this.ctx.lineTo(vertices[i]![0], vertices[i]![1]);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }


  // Put this method here and not a base Backend class since we might want to process the command buffer differently in each backend.
  // Having the command buffer here provides lots of flexibility but for now it is the same code in all three backends.
  public processFrame(data: Float32Array, length: number): void {
    const driver = this as Backend;
    let i = 0;

    while (i < length) {
      const opcode = data[i++] as Commands;

      switch (opcode) {
        case Commands.Clear: {
          if (!driver.clear) {
            throw new Error("Canvas backend does not implement 'clear()'.");
          }
          driver.clear(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.SetColor: {
          if (!driver.setColor) {
            throw new Error("WebGL backend does not implement 'setColor()'.");
          }
          driver.setColor(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.DrawLine: {
          if (!driver.drawLine) {
            throw new Error("Canvas backend does not implement 'drawLine()'.");
          }
          driver.drawLine(data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.DrawCircle: {
          if (!driver.drawCircle) {
            throw new Error("Canvas backend does not implement 'drawCircle()'.");
          }
          driver.drawCircle(data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.DrawSquare: {
          if (!driver.drawSquare) {
            throw new Error("Canvas backend does not implement 'drawSquare()'.");
          }
          driver.drawSquare(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.DrawTriangle: {
          if (!driver.drawTriangle) {
            throw new Error("Canvas backend does not implement 'drawTriangle()'.");
          }
          driver.drawTriangle(
            data[i++]!, data[i++]!,
            data[i++]!, data[i++]!,
            data[i++]!, data[i++]!
          );
          break;
        }

        case Commands.DrawRegularPolygon: {
          if (!driver.drawRegularPolygon) {
            throw new Error("Canvas backend does not implement 'drawRegularPolygon()'.");
          }
          driver.drawRegularPolygon(
            data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!
          );
          break;
        }

        case Commands.DrawPolygon: {
          if (!driver.drawPolygon) {
            throw new Error("Canvas backend does not implement 'drawPolygon()'.");
          }
          const vertCount = data[i++]!;
          const vertices: Array<[number, number]> = [];
          for (let v = 0; v < vertCount; v++) {
            vertices.push([data[i++]!, data[i++]!]);
          }
          driver.drawPolygon(vertices);
          break;
        }
      }
    }
  }
}
