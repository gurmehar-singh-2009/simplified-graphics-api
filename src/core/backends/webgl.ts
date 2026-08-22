import type { RenderConfigs, Backend } from "../Renderer";

export class WebGLBackend implements Backend {
  configs: RenderConfigs;
  private ctx: WebGL2RenderingContext;

  private clearColor: string = "";

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.configs = configs;

    this.ctx = canvas.getContext("webgl2")!;
  }

  clear(): void {
    
  }

  setColor(r: number, g: number, b: number, a: number): void {
    
  }

  setClearColor(r: number, g: number, b: number, a: number): void {
    
  }

  drawTriangle(x: number, y: number, size: number, rot?: number): void {
    
  }

  drawSquare(x: number, y: number, w: number, h: number): void {
    
  }

  drawRegularPolygon(x: number, y: number, size: number, sides: number, rot?: number): void {
    
  }

  drawPolygon(vertices: Array<[number, number]>): void {
    
  }
}
