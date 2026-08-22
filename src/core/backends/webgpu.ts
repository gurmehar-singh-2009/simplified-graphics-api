// NOTE BEFORE READING!!!
//
// i have NEVER used webgpu in js/ts, only rust
// so excuse any potential shitty code and such

import type { Backend, RenderConfigs } from "../Renderer";

export class WebGPUBackend implements Backend {
	configs: RenderConfigs;

	private ctx: GPUCanvasContext;

	// webgpu boilerplate ._.
	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
		this.ctx = canvas.getContext("webgpu")!;
		this.configs = configs;

		(async () => {
			await this.initializeWebGPU();
		})();
	}

	async initializeWebGPU(): Promise<GPUDevice | null> {
		// check if webgpu is supported (kinda not widely supported)
		if (!navigator.gpu) {
			alert(
				"WEBGPU IS NOT SUPPORTED ON YOUR DEVICE. YOU CAN UPGRADE YOUR BROWSER OR RESORT TO WEBGL.",
			);
			return null;
		}

		const adapter = await navigator.gpu.requestAdapter();
		const device = await adapter?.requestDevice();
		const queue = device?.queue;

		this.ctx.configure({
			device: device!,
			format: navigator.gpu.getPreferredCanvasFormat(),
			alphaMode: "opaque",
		});

		const command_encoder = device?.createCommandEncoder();
		const render_pass = command_encoder?.beginRenderPass({
			colorAttachments: [
				{
					view: this.ctx.getCurrentTexture().createView(),
					clearValue: [1, 0, 0, 1],
					loadOp: "clear",
					storeOp: "store",
				},
			],
		});

		render_pass?.end();
		queue?.submit([command_encoder!.finish()]);

		const _pipeline_layout = device?.createPipelineLayout({
			label: "Render pipeline layout",
			bindGroupLayouts: [],
		});

		return device!;
	}

	clear(_r: number, _g: number, _b: number, _a: number): void {}

	setColor(_r: number, _g: number, _b: number, _a: number): void {}

	drawTriangle(
		_x1: number,
		_y1: number,
		_x2: number,
		_y2: number,
		_x3: number,
		_y3: number,
	): void {}

	drawSquare(
		_x: number,
		_y: number,
		_w: number,
		_h: number,
		_rot?: number,
	): void {}

	drawPentagon(_x: number, _y: number, _size: number, _rot?: number): void {}

	drawHexagon(_x: number, _y: number, _size: number, _rot?: number): void {}

	drawSeptagon(_x: number, _y: number, _size: number, _rot?: number): void {}

	drawOctogon(_x: number, _y: number, _size: number, _rot?: number): void {}

	drawCustomSides(
		_x: number,
		_y: number,
		_size: number,
		_sides: number,
		_rot?: number,
	): void {}

	drawPolygon(_vertices: Array<[number, number]>): void {}

	drawRegularPolygon(
		_x: number,
		_y: number,
		_size: number,
		_sides: number,
		_rot?: number,
	): void {}

	present(): void {}
}
