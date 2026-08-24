export type Dimension = "2D" | "3D";

export enum Backends {
	CANVAS,
	WEBGL,
	WEBGPU,
}

export interface RenderConfigs {
	backend: Backends;
	antialias: boolean;
	debug?: boolean;
	// default(): RenderConfigs;
}

export interface Texture {
	id: string; // or number, maybe number better but decide later
	source: HTMLImageElement | ImageBitmap;
}

export interface Backend {
	clear?(r: number, g: number, b: number, a: number): void;
	setColor?(r: number, g: number, b: number, a: number): void;
	drawLine?(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		thickness: number,
	): void;
	drawTriangle?(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void;
	drawCircle?(x: number, y: number, radius: number): void;
	drawRect?(x: number, y: number, w: number, h: number, rot?: number): void;
	drawRegularPolygon?(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void;
	drawPolygon?(vertices: Array<[number, number]>): void;
	resize?(width: number, height: number): void;
	drawText?(x: number, y: number, text: string, size: number, alignment: number): void;

	processFrame(data: Float32Array, length: number): void;
}
