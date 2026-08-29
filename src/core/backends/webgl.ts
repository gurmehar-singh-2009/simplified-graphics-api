import type { RenderConfigs, Backend } from "../renderer";
import { vertexShaderSource } from "../../graphics/shaders/webgl/vertex.ts";
import { fragmentShaderSource } from "../../graphics/shaders/webgl/fragment.ts";
import type { Camera } from "../camera.ts";

interface ShaderLocations {
	program: WebGLProgram;
	attributes: {
		position: GLint;
		texCoord: GLint;
		colour: GLint;
		type: GLint;
	};
	uniforms: {
		viewProjection: WebGLUniformLocation;
	};
}

export class WebGLBackend implements Backend {
	configs: RenderConfigs;
	private ctx: WebGL2RenderingContext;
	private shaderLocations: ShaderLocations;
	private vao: WebGLVertexArrayObject;
	private vertexBuffer: WebGLBuffer;

	private floatsPerVertex: number = 10;
	private trianglesPerBatch: number = 10000;

	private batchData: Float32Array;
	private batchOffset: number;

	private currentColor: [number, number, number, number] = [1, 0, 0, 1];
	private viewProjectionMatrix: Float32Array = new Float32Array(16);

	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
		this.configs = configs;

		this.ctx = canvas.getContext("webgl2")!;

		this.shaderLocations = this.initShaderProgram(
			vertexShaderSource,
			fragmentShaderSource,
		);

		this.ctx.enable(this.ctx.BLEND);
		this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);

		this.ctx.useProgram(this.shaderLocations.program);

		// Create VAO
		this.vao = this.ctx.createVertexArray();
		this.ctx.bindVertexArray(this.vao);

		this.vertexBuffer = this.ctx.createBuffer();
		this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);

		this.ctx.bufferData(
			this.ctx.ARRAY_BUFFER,
			this.floatsPerVertex * this.trianglesPerBatch * 3 * 4,
			this.ctx.DYNAMIC_DRAW,
		);

		let STRIDE = this.floatsPerVertex * 4;

		this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.position);
		this.ctx.vertexAttribPointer(
			this.shaderLocations.attributes.position,
			3,
			this.ctx.FLOAT,
			false,
			STRIDE,
			0,
		);

		this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.texCoord);
		this.ctx.vertexAttribPointer(
			this.shaderLocations.attributes.texCoord,
			2,
			this.ctx.FLOAT,
			false,
			STRIDE,
			12,
		);

		this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.colour);
		this.ctx.vertexAttribPointer(
			this.shaderLocations.attributes.colour,
			4,
			this.ctx.FLOAT,
			false,
			STRIDE,
			20,
		);

		this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.type);
		this.ctx.vertexAttribPointer(
			this.shaderLocations.attributes.type,
			1,
			this.ctx.FLOAT,
			false,
			STRIDE,
			36,
		);

		this.ctx.bindVertexArray(null);

		this.batchData = new Float32Array(
			this.trianglesPerBatch * 3 * this.floatsPerVertex,
		);
		this.batchOffset = 0;

		this.resize(500, 500);
	}

	private initShaderProgram(
		vertexShaderSource: string,
		fragmentShaderSource: string,
	): ShaderLocations {
		let program = this.ctx.createProgram();

		this.ctx.attachShader(
			program,
			this.loadShader(this.ctx.VERTEX_SHADER, vertexShaderSource),
		);
		this.ctx.attachShader(
			program,
			this.loadShader(this.ctx.FRAGMENT_SHADER, fragmentShaderSource),
		);

		this.ctx.linkProgram(program);

		return {
			program: program,

			attributes: {
				position: this.ctx.getAttribLocation(program, "a_position"),
				texCoord: this.ctx.getAttribLocation(program, "a_texCoord"),
				colour: this.ctx.getAttribLocation(program, "a_colour"),
				type: this.ctx.getAttribLocation(program, "a_type"),
			},

			uniforms: {
				viewProjection: this.ctx.getUniformLocation(
					program,
					"u_viewProjection",
				)!,
			},
		};
	}

	private loadShader(type: GLenum, source: string): WebGLShader {
		let shader = this.ctx.createShader(type) as WebGLShader;

		this.ctx.shaderSource(shader, source);
		this.ctx.compileShader(shader);

		if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
			throw new Error("Shader Error: " + this.ctx.getShaderInfoLog(shader));
		}

		return shader;
	}

	public flush() {
		if (this.batchOffset === 0) return;

		this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);

		this.ctx.bufferSubData(
			this.ctx.ARRAY_BUFFER,
			0,
			this.batchData,
			0,
			this.batchOffset,
		);
		this.ctx.bindVertexArray(this.vao);
		this.ctx.drawArrays(
			this.ctx.TRIANGLES,
			0,
			this.batchOffset / this.floatsPerVertex,
		);

		this.ctx.bindVertexArray(null);

		this.batchOffset = 0;
	}

	private addVertex(
		x: number,
		y: number,
		z: number = 0,
		u: number,
		v: number,
		r: number,
		g: number,
		b: number,
		a: number,
		type: number,
	) {
		if (this.batchOffset + this.floatsPerVertex > this.batchData.length) {
			this.flush();
		}

		this.batchData[this.batchOffset++] = x;
		this.batchData[this.batchOffset++] = y;
		this.batchData[this.batchOffset++] = z;

		this.batchData[this.batchOffset++] = u;
		this.batchData[this.batchOffset++] = v;

		this.batchData[this.batchOffset++] = r;
		this.batchData[this.batchOffset++] = g;
		this.batchData[this.batchOffset++] = b;
		this.batchData[this.batchOffset++] = a;

		this.batchData[this.batchOffset++] = type;
	}

	clear(r: number, g: number, b: number, a: number): void {
		this.ctx.clearColor(r / 255, g / 255, b / 255, a);
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
	}

	setColor(r: number, g: number, b: number, a: number): void {
		this.currentColor = [r / 255, g / 255, b / 255, a];
	}

	drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		thickness: number,
	): void {
		let dx: number = x2 - x1;
		let dy: number = y2 - y1;

		let length = Math.hypot(dx, dy);
		if (length === 0) return;

		let perpX = (-dy / length) * (thickness / 2);
		let perpY = (dx / length) * (thickness / 2);

		this.drawTriangle(
			x1 + perpX,
			y1 + perpY,
			x1 - perpX,
			y1 - perpY,
			x2 + perpX,
			y2 + perpY,
		);
		this.drawTriangle(
			x2 + perpX,
			y2 + perpY,
			x2 - perpX,
			y2 - perpY,
			x1 - perpX,
			y1 - perpY,
		);
	}

	drawCircle(x: number, y: number, radius: number): void {
		const [r, g, b, a] = this.currentColor;

		this.addVertex(x - radius, y - radius, 0, 0, 0, r, g, b, a, 2);
		this.addVertex(x + radius, y - radius, 0, 1, 0, r, g, b, a, 2);
		this.addVertex(x + radius, y + radius, 0, 1, 1, r, g, b, a, 2);
		this.addVertex(x - radius, y - radius, 0, 0, 0, r, g, b, a, 2);
		this.addVertex(x - radius, y + radius, 0, 0, 1, r, g, b, a, 2);
		this.addVertex(x + radius, y + radius, 0, 1, 1, r, g, b, a, 2);
	}

	drawRect(x: number, y: number, w: number, h: number): void {
		const [r, g, b, a] = this.currentColor;

		this.addVertex(x, y, 0, 0, 0, r, g, b, a, 1);
		this.addVertex(x + w, y, 0, 1, 0, r, g, b, a, 1);
		this.addVertex(x + w, y + h, 0, 1, 1, r, g, b, a, 1);
		this.addVertex(x, y, 0, 0, 0, r, g, b, a, 1);
		this.addVertex(x, y + h, 0, 0, 1, r, g, b, a, 1);
		this.addVertex(x + w, y + h, 0, 1, 1, r, g, b, a, 1);
	}

	drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void {
		const [r, g, b, a] = this.currentColor;

		this.addVertex(x1, y1, 0, 0, 0, r, g, b, a, 1);
		this.addVertex(x2, y2, 0, 0, 0, r, g, b, a, 1);
		this.addVertex(x3, y3, 0, 0, 0, r, g, b, a, 1);
	}

	drawRegularPolygon(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot: number = 0,
	): void {
		if (sides < 3) return;

		let angleStep = (Math.PI * 2) / sides;

		let prevX = x + size * Math.cos(rot);
		let prevY = y + size * Math.sin(rot);

		for (let i = 1; i <= sides; i++) {
			let angle = rot + i * angleStep;
			let currentX = x + size * Math.cos(angle);
			let currentY = y + size * Math.sin(angle);

			this.drawTriangle(x, y, prevX, prevY, currentX, currentY);

			prevX = currentX;
			prevY = currentY;
		}
	}

	// drawPolygon(vertices: Array<[number, number]>): void {

	// }

	public updateView(camera: Camera): void {
		this.flush();
    this.ctx.uniformMatrix4fv(this.shaderLocations.uniforms.viewProjection, false, camera.viewProjectionMatrix.data);
  }

	resize(width: number, height: number): void {
		this.ctx.viewport(0, 0, width, height);
	}
}
