// design idea:
// do the below thing for all 3 render backends
// because they all vary so much (canvas2d can just be a bunch of arrays, while webgpu needs actual buffer allocation and resizing)

import type { Backend, RenderConfigs } from "../Renderer";

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

	drawCircle(x: number, y: number, radius: number): void {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		this.ctx.fill();
	}

	drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void {
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

	drawRegularPolygon(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void {
		rot = rot || 0;

		this.ctx.beginPath();
		for (let i = rot; i < Math.PI * 2 + rot; i += (Math.PI * 2) / sides) {
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

	drawPentagon(x: number, y: number, size: number, rot?: number): void {
		this.drawRegularPolygon(x, y, size, 5, rot);
	}

	drawHexagon(x: number, y: number, size: number, rot?: number): void {
		this.drawRegularPolygon(x, y, size, 6, rot);
	}

	drawSeptagon(x: number, y: number, size: number, rot?: number): void {
		this.drawRegularPolygon(x, y, size, 7, rot);
	}

	drawOctogon(x: number, y: number, size: number, rot?: number): void {
		this.drawRegularPolygon(x, y, size, 8, rot);
	}

	drawCustomSides(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void {
		this.drawRegularPolygon(x, y, size, sides, rot);
	}

	present(): void {}
}
