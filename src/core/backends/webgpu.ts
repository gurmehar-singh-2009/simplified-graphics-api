// NOTE BEFORE READING!!!
//
// i have NEVER used webgpu in js/ts, only rust
// so excuse any potential shitty code and such

import type { RenderConfigs, Backend } from "../Renderer";

export class WebGPUBackend implements Backend {
    configs: RenderConfigs;
    private ctx: GPUCanvasContext;

    private clearColor: string = "";

    constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
        this.configs = configs;

        this.ctx = canvas.getContext("webgpu")!;
    }

    clear(): void {

    }

    setColor(r: number, g: number, b: number, a: number): void {

    }

    setClearColor(r: number, g: number, b: number, a: number): void {

    }

    drawCircle(x: number, y: number, radius: number): void {

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