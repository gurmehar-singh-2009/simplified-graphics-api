export type Dimension = "2D" | "3D";

// note about enums, worth mentioning:
// enums in typescript ARE ACTUAL GARBAGE!!!
// they generate shitty glue code
// and the alternative is so ugly i will not reference it here.
// just know that i will BE USING ENUMS EVERYWHERE REGARDLESS of how pretty the resulting code may be
export enum Backends {
	CANVAS,
	WEBGL,
	WEBGPU, //! EXPERIMENTAL!!! probably not gonna utilize until the ENTIRE engine is complete.
}

export interface RenderConfigs {
	backend: Backends;
	antialias: boolean;
	// default(): RenderConfigs;
}

export interface Texture {
	id: string; // or number, maybe number better but decide later
	source: HTMLImageElement | ImageBitmap;
}

export interface Backend {
	configs: RenderConfigs;

	clear(): void;
	setColor(r: number, g: number, b: number, a: number): void;
	setClearColor(r: number, g: number, b: number, a: number): void;

	drawCircle(x: number, y: number, radius: number): void;
	drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
	drawSquare(x: number, y: number, w: number, h: number, rot?: number): void;
	drawRegularPolygon(x: number, y: number, size: number, sides: number, rot?: number): void;
	drawPolygon(vertices: Array<[number, number]>): void;
}
