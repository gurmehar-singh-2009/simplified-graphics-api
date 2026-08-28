import type { Vector2 } from "../../math/vector2";
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
	drawRect(x: number, y: number, w: number, h: number): void {
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
  drawPolygon(vertices: Array<Vector2>): void {
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0]!.x, vertices[0]!.y);
    for (let i = 1; i < vertices.length; i++) {
      this.ctx.lineTo(vertices[i]!.x, vertices[i]!.y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Renders text on canvas using native 2D canvas text routines.
   *
   * @param x - Top-left position X coordinate for string alignment.
   * @param y - Top-left position Y coordinate for string alignment.
   * @param text - Text content to render.
   * @param size - Font size specified in pixels.
   */
  drawText(
    x: number,
    y: number,
    text: string,
    size: number,
    alignment: number,
  ): void {
    this.ctx.font = `${size}px sans-serif`;
    this.ctx.textAlign =
      alignment === 0 ? "left" : alignment === 1 ? "center" : "right";
    this.ctx.fillText(text, x, y);
  }

  public resize(width: number, height: number): void {

  }
}
