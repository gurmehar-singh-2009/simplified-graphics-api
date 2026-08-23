import { Commands } from "../commands";
import type { Backend, RenderConfigs } from "../renderer";

// TODO:
// - support stroke style

/**
 * 2D HTML Canvas rendering backend.
 */
export class CanvasBackend implements Backend {
	/** Global rendering engine configuration parameters. */
	configs: RenderConfigs;

	/** The 2D canvas rendering context used for executing draw calls. */
	private ctx: CanvasRenderingContext2D;

	/**
	 * Creates an instance of CanvasBackend and initializes its 2D rendering context.
	 *
	 * @param canvas - Target HTML canvas element.
	 * @param configs - Global render configuration object.
	 */
	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
		this.configs = configs;

		this.ctx = canvas.getContext("2d")!;
	}

	/**
	 * Clears the canvas surface.
	 *
	 * @param r - Red color component (0-255).
	 * @param g - Green color component (0-255).
	 * @param b - Blue color component (0-255).
	 * @param a - Alpha transparency component (0.0-1.0).
	 */
	clear(r: number, g: number, b: number, a: number): void {
		this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	/**
	 * Sets active fill color for subsequent primitive drawing calls.
	 *
	 * @param r - Red color component (0-255).
	 * @param g - Green color component (0-255).
	 * @param b - Blue color component (0-255).
	 * @param a - Alpha transparency component (0.0-1.0).
	 */
	setColor(r: number, g: number, b: number, a: number): void {
		this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	/**
	 * Draws a stroked line segment between two points with a given stroke width.
	 *
	 * @param x1 - Starting point X position.
	 * @param y1 - Starting point Y position.
	 * @param x2 - Ending point X position.
	 * @param y2 - Ending point Y position.
	 * @param thickness - Width of line stroke in pixels.
	 */
	drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		thickness: number,
	): void {
		this.ctx.lineWidth = thickness;
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	/**
	 * Draws a filled circle at specified target position.
	 *
	 * @param x - Center point X coordinate.
	 * @param y - Center point Y coordinate.
	 * @param radius - Circle radius in pixels.
	 */
	drawCircle(x: number, y: number, radius: number): void {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		this.ctx.fill();
	}

	/**
	 * Draws a filled triangle using three absolute point vertices.
	 *
	 * @param x1 - First vertex X position.
	 * @param y1 - First vertex Y position.
	 * @param x2 - Second vertex X position.
	 * @param y2 - Second vertex Y position.
	 * @param x3 - Third vertex X position.
	 * @param y3 - Third vertex Y position.
	 */
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

	/**
	 * Draws a filled rectangle/square given center coordinates and dimensions.
	 *
	 * @param x - Top-left corner X coordinate.
	 * @param y - Top-left corner Y coordinate.
	 * @param w - Rectangle width in pixels.
	 * @param h - Rectangle height in pixels.
	 */
	drawSquare(x: number, y: number, w: number, h: number): void {
		this.ctx.fillRect(x, y, w, h);
	}

	/**
	 * Draws a filled regular polygon centered at specified coordinates with N sides.
	 *
	 * @param x - Center point X coordinate.
	 * @param y - Center point Y coordinate.
	 * @param size - Radius distance from center to each vertex.
	 * @param sides - Total count of regular polygon sides/vertices.
	 * @param rot - Optional initial rotation offset in radians.
	 */
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

	/**
	 * Draws a filled arbitrary polygon defined by an array of 2D vertex positions.
	 *
	 * @param vertices - Ordered list of [x, y] coordinates defining polygon perimeter.
	 */
	drawPolygon(vertices: Array<[number, number]>): void {
		this.ctx.beginPath();
		this.ctx.moveTo(vertices[0]?.[0] ?? 0, vertices[0]?.[1] ?? 0);
		for (let i = 1; i < vertices.length; i++) {
			this.ctx.lineTo(vertices[i]?.[0] ?? 0, vertices[i]?.[1] ?? 0);
		}
		this.ctx.closePath();
		this.ctx.fill();
	}

	// Put this method here and not a base Backend class since we might want to process the command buffer differently in each backend.
	// Having the command buffer here provides lots of flexibility but for now it is the same code in all three backends.
	/**
	 * Decodes and executes primitive drawing commands sequentially from a raw command stream buffer.
	 *
	 * @param data - Encoded binary command stream payload.
	 * @param length - Active size/length boundary within command buffer.
	 */
	public processFrame(data: Float32Array, length: number): void {
		const driver = this as Backend;
		let i = 0;

		while (i < length) {
			const opcode = data[i++] as Commands;

			switch (opcode) {
				case Commands.DrawText: {
					if (!driver.drawText) {
						throw new Error("Canvas backend does not implement 'drawText()'.");
					}
					const x = data[i++]!;
					const y = data[i++]!;
					const size = data[i++]!;
					const charCount = data[i++]!;
					let text = "";
					for (let c = 0; c < charCount; c++) text += String.fromCharCode(data[i++]!);
					driver.drawText(x, y, text, size);
					break;
				}

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
					driver.drawLine(
						data[i++]!,
						data[i++]!,
						data[i++]!,
						data[i++]!,
						data[i++]!,
					);
					break;
				}

				case Commands.DrawCircle: {
					if (!driver.drawCircle) {
						throw new Error(
							"Canvas backend does not implement 'drawCircle()'.",
						);
					}
					driver.drawCircle(data[i++]!, data[i++]!, data[i++]!);
					break;
				}

				case Commands.DrawSquare: {
					if (!driver.drawSquare) {
						throw new Error(
							"Canvas backend does not implement 'drawSquare()'.",
						);
					}
					driver.drawSquare(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
					break;
				}

				case Commands.DrawTriangle: {
					if (!driver.drawTriangle) {
						throw new Error(
							"Canvas backend does not implement 'drawTriangle()'.",
						);
					}
					driver.drawTriangle(
						data[i++]!,
						data[i++]!,
						data[i++]!,
						data[i++]!,
						data[i++]!,
						data[i++]!,
					);
					break;
				}

				case Commands.DrawRegularPolygon: {
					if (!driver.drawRegularPolygon) {
						throw new Error(
							"Canvas backend does not implement 'drawRegularPolygon()'.",
						);
					}
					driver.drawRegularPolygon(
						data[i++]!,
						data[i++]!,
						data[i++]!,
						data[i++]!,
						data[i++]!,
					);
					break;
				}

				case Commands.DrawPolygon: {
					if (!driver.drawPolygon) {
						throw new Error(
							"Canvas backend does not implement 'drawPolygon()'.",
						);
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

	/**
	 * Renders text on canvas using native 2D canvas text routines.
	 *
	 * @param x - Top-left position X coordinate for string alignment.
	 * @param y - Top-left position Y coordinate for string alignment.
	 * @param text - Text content to render.
	 * @param size - Font size specified in pixels.
	 */
	drawText(x: number, y: number, text: string, size: number): void {
		this.ctx.font = `${size}px sans-serif`;
		this.ctx.textBaseline = "top";
		this.ctx.fillText(text, x, y);
	}
}
