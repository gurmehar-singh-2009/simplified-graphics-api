// design idea:
// do the below thing for all 3 render backends
// because they all vary so much (canvas2d can just be a bunch of arrays, while webgpu needs actual buffer allocation and resizing)

import type { RenderConfigs, Backend } from "../Renderer";

export class CanvasBackend implements Backend {
  configs: RenderConfigs;
  private ctx: CanvasRenderingContext2D;

  private clearColor: string = "";

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.configs = configs;

    this.ctx = canvas.getContext("2d")!;
  }

  clear(): void {
    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  setColor(r: number, g: number, b: number, a: number): void {
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  setClearColor(r: number, g: number, b: number, a: number): void {
    this.clearColor = `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  drawCircle(x: number, y: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawTriangle(x: number, y: number, size: number, rot?: number): void {
    rot = rot || 0.

    this.ctx.beginPath();
    for (let i = rot; i < Math.PI * 2 + rot; i += Math.PI * 2 / 3) {
      const coordinate = {
        x: x + size * Math.cos(i),
        y: y + size * Math.sin(i),
      };

      this.ctx[i === rot ? "moveTo" : "lineTo"](coordinate.x, coordinate.y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawSquare(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect(x, y, w, h);
  }

  drawPentagon(x: number, y: number, size: number, rot?: number): void {
    rot = rot || 0.

    this.ctx.beginPath();
    for (let i = rot; i < Math.PI * 2 + rot; i += Math.PI * 2 / 5) {
      const coordinate = {
        x: x + size * Math.cos(i),
        y: y + size * Math.sin(i),
      };

      this.ctx[i === rot ? "moveTo" : "lineTo"](coordinate.x, coordinate.y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawHexagon(x: number, y: number, size: number, rot?: number): void {
    rot = rot || 0.

    this.ctx.beginPath();
    for (let i = rot; i < Math.PI * 2 + rot; i += Math.PI * 2 / 6) {
      const coordinate = {
        x: x + size * Math.cos(i),
        y: y + size * Math.sin(i),
      };

      this.ctx[i === rot ? "moveTo" : "lineTo"](coordinate.x, coordinate.y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawSeptagon(x: number, y: number, size: number, rot?: number): void {
    rot = rot || 0.

    this.ctx.beginPath();
    for (let i = rot; i < Math.PI * 2 + rot; i += Math.PI * 2 / 7) {
      const coordinate = {
        x: x + size * Math.cos(i),
        y: y + size * Math.sin(i),
      };

      this.ctx[i === rot ? "moveTo" : "lineTo"](coordinate.x, coordinate.y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawOctogon(x: number, y: number, size: number, rot?: number): void {
    rot = rot || 0.

    this.ctx.beginPath();
    for (let i = rot; i < Math.PI * 2 + rot; i += Math.PI * 2 / 8) {
      const coordinate = {
        x: x + size * Math.cos(i),
        y: y + size * Math.sin(i),
      };

      this.ctx[i === rot ? "moveTo" : "lineTo"](coordinate.x, coordinate.y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawCustomSides(x: number, y: number, size: number, sides: number, rot?: number): void {
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
}
