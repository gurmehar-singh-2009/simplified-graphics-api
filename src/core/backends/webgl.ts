import type { Backend, RenderConfigs } from "../Renderer";

export class WebGLBackend implements Backend {
  configs: RenderConfigs;
  private ctx: RenderingContext;

	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
		this.configs = configs;

		this.ctx = canvas.getContext("webgl2")!;
	}

	clear(): void {}

	setColor(_r: number, _g: number, _b: number, _a: number): void {}

	setClearColor(_r: number, _g: number, _b: number, _a: number): void {}

	drawTriangle(_x: number, _y: number, _size: number, _rot?: number): void {}

	drawSquare(_x: number, _y: number, _w: number, _h: number): void {}

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

	drawRegularPolygon(
		_x: number,
		_y: number,
		_size: number,
		_sides: number,
		_rot?: number,
	): void {}

	drawPolygon(_vertices: Array<[number, number]>): void {}

	present(): void {}
}
