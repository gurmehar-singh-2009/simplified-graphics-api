import type { RenderConfigs, Backend } from "../renderer";
import { vertexShaderSource } from "../../graphics/shaders/webgl/vertex.ts";
import { fragmentShaderSource } from "../../graphics/shaders/webgl/fragment.ts";
import type { Camera } from "../camera.ts";
import type { MeshData, Mesh } from "../../graphics/mesh.ts";
import { Transform } from "../../math/transform.ts";

interface ShaderLocations {
	program: WebGLProgram;
	attributes: {
		position: GLint;
		texCoord: GLint;
	};
	uniforms: {
		viewProjection: WebGLUniformLocation;
		meshTransform: WebGLUniformLocation;
	};
}

export class WebGLBackend implements Backend {
	configs: RenderConfigs;
	private ctx: WebGL2RenderingContext;
	private shaderLocations: ShaderLocations;

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
			},

			uniforms: {
				viewProjection: this.ctx.getUniformLocation(
					program,
					"u_viewProjection",
				)!,
				meshTransform: this.ctx.getUniformLocation(program, "u_meshTransform")!,
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

	clear(r: number, g: number, b: number, a: number): void {
		this.ctx.clearColor(r / 255, g / 255, b / 255, a);
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
	}

	public updateView(camera: Camera): void {
		this.ctx.uniformMatrix4fv(
			this.shaderLocations.uniforms.viewProjection,
			false,
			camera.viewProjectionMatrix.data,
		);
	}

	resize(width: number, height: number): void {
		this.ctx.viewport(0, 0, width, height);
	}

	public createMesh(data: MeshData): Mesh {
		const vao = this.ctx.createVertexArray()!;
		this.ctx.bindVertexArray(vao);

		const vertexCount = data.positions.length / 3;
		const hasNormals = data.normals !== undefined && data.normals.length > 0;
		const hasUVs = data.uvs !== undefined && data.uvs.length > 0;
		const hasTangents = data.tangents !== undefined && data.tangents.length > 0;

		let floatsPerVert = 3;
		if (hasNormals) floatsPerVert += 3;
		if (hasUVs) floatsPerVert += 2;
		if (hasTangents) floatsPerVert += 4;

		let vertexData = new Float32Array(vertexCount * floatsPerVert);

		const positions = data.positions;
		const normals = hasNormals ? data.normals : undefined;
		const uvs = hasUVs ? data.uvs : undefined;
		const tangents = hasTangents ? data.tangents : undefined;

		let offset = 0;
		for (let i = 0; i < vertexCount; i++) {
			vertexData[offset++] = positions[i * 3]!;
			vertexData[offset++] = positions[i * 3 + 1]!;
			vertexData[offset++] = positions[i * 3 + 2]!;

			if (normals) {
				vertexData[offset++] = normals[i * 3]!;
				vertexData[offset++] = normals[i * 3 + 1]!;
				vertexData[offset++] = normals[i * 3 + 2]!;
			}

			if (uvs) {
				vertexData[offset++] = uvs[i * 2]!;
				vertexData[offset++] = uvs[i * 2 + 1]!;
			}

			if (tangents) {
				vertexData[offset++] = tangents[i * 4]!;
				vertexData[offset++] = tangents[i * 4 + 1]!;
				vertexData[offset++] = tangents[i * 4 + 2]!;
				vertexData[offset++] = tangents[i * 4 + 3]!;
			}
		}

		const vbo = this.ctx.createBuffer()!;
		this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vbo);
		this.ctx.bufferData(
			this.ctx.ARRAY_BUFFER,
			vertexData,
			this.ctx.STATIC_DRAW,
		);

		const ebo = this.ctx.createBuffer()!;
		this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, ebo);
		this.ctx.bufferData(
			this.ctx.ELEMENT_ARRAY_BUFFER,
			data.indices,
			this.ctx.STATIC_DRAW,
		);

		const stride = floatsPerVert * 4;
		let byteOffset = 0;

		if (this.shaderLocations.attributes.position !== -1) {
			this.ctx.enableVertexAttribArray(
				this.shaderLocations.attributes.position,
			);
			this.ctx.vertexAttribPointer(
				this.shaderLocations.attributes.position,
				3,
				this.ctx.FLOAT,
				false,
				stride,
				byteOffset,
			);
		}
		byteOffset += 3 * 4;

		if (hasNormals) {
			byteOffset += 3 * 4;
		}

		if (hasUVs && this.shaderLocations.attributes.texCoord !== -1) {
			this.ctx.enableVertexAttribArray(
				this.shaderLocations.attributes.texCoord,
			);
			this.ctx.vertexAttribPointer(
				this.shaderLocations.attributes.texCoord,
				2,
				this.ctx.FLOAT,
				false,
				stride,
				byteOffset,
			);
			byteOffset += 2 * 4;
		}

		this.ctx.bindVertexArray(null);

		const indexType =
			data.indices instanceof Uint16Array
				? this.ctx.UNSIGNED_SHORT
				: this.ctx.UNSIGNED_INT;

		return {
			vao,
			vbo,
			ebo,
			indexCount: data.indices.length,
			indexType,
		};
	}

	public drawMesh(mesh: Mesh, transform: Transform): void {
		this.ctx.bindVertexArray(mesh.vao);

		this.ctx.uniformMatrix4fv(
			this.shaderLocations.uniforms.meshTransform,
			false,
			transform.matrix4.data,
		);

		this.ctx.drawElements(
			this.ctx.TRIANGLES,
			mesh.indexCount,
			mesh.indexType,
			0,
		);

		this.ctx.bindVertexArray(null);
	}
}
