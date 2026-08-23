// NOTE BEFORE READING!!!
//
// i have NEVER used webgpu in js/ts, only rust
// so excuse any potential shitty code and such

import type { RenderConfigs, Backend } from "../Renderer";
import { Commands } from "../Commands";

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

    drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {

    }

    drawSquare(x: number, y: number, w: number, h: number): void {

    }

    drawRegularPolygon(x: number, y: number, size: number, sides: number, rot?: number): void {

    }

    drawPolygon(vertices: Array<[number, number]>): void {

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
                        throw new Error("Active backend does not implement 'clear()'.");
                    }
                    driver.clear(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
                    break;
                }

                case Commands.Set2DColor:
                case Commands.Set3DColor: {
                    if (!driver.setColor) {
                        throw new Error("Active backend does not implement 'setColor()'.");
                    }
                    driver.setColor(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
                    break;
                }

                case Commands.DrawLine: {
                    if (!driver.drawLine) {
                        throw new Error("Active backend does not implement 'drawLine()'.");
                    }
                    driver.drawLine(data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!);
                    break;
                }

                case Commands.DrawCircle: {
                    if (!driver.drawCircle) {
                        throw new Error("Active backend does not implement 'drawCircle()'.");
                    }
                    driver.drawCircle(data[i++]!, data[i++]!, data[i++]!);
                    break;
                }

                case Commands.DrawSquare: {
                    if (!driver.drawSquare) {
                        throw new Error("Active backend does not implement 'drawSquare()'.");
                    }
                    driver.drawSquare(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
                    break;
                }

                case Commands.DrawTriangle: {
                    if (!driver.drawTriangle) {
                        throw new Error("Active backend does not implement 'drawTriangle()'.");
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
                        throw new Error("Active backend does not implement 'drawRegularPolygon()'.");
                    }
                    driver.drawRegularPolygon(
                        data[i++]!, data[i++]!, data[i++]!, data[i++]!, data[i++]!
                    );
                    break;
                }

                case Commands.DrawPolygon: {
                    if (!driver.drawPolygon) {
                        throw new Error("Active backend does not implement 'drawPolygon()'.");
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