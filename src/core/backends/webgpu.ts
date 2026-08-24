import fs_source from "../../graphics/shaders/webgpu/fragment.wgsl" with {
	type: "text",
};
import vs_source from "../../graphics/shaders/webgpu/vertex.wgsl" with {
	type: "text",
};
import { computeViewProjMatrix } from "../../math/util";
import { Commands } from "../commands";
import type { Backend, RenderConfigs } from "../renderer";
import { CameraUniform } from "./buffers/cameraBuffer";
import { EntityInstance } from "./buffers/entityInstance";
import { FontAtlas } from "./buffers/fontAtlas";

/**
 * WebGPU graphics backend managing GPU resources, pipelines, and instanced batch rendering.
 */
export class WebGPUBackend implements Backend {
	/** Global engine configuration options. */
	configs: RenderConfigs;

	/** WebGPU canvas context for displaying rendered frames. */
	private ctx: GPUCanvasContext;

	/** Primary GPU logical device handle. */
	private device!: GPUDevice;
	/** Primary GPU command queue handle. */
	private queue!: GPUQueue;

	/** Main instanced render pipeline. */
	private render_pipeline!: GPURenderPipeline;

	/** GPU buffer for instanced render data (shapes & text). */
	private instance_buffer!: GPUBuffer;
	/** GPU uniform buffer containing camera matrices and viewport params. */
	private camera_buffer!: GPUBuffer;

	/** Bind group holding camera uniform bindings. */
	private camera_bind_group!: GPUBindGroup;

	/** Active number of instances queued for the current frame. */
	private num_instances: number = 0;
	/** Viewport width in physical pixels. */
	private width: number = 1;
	/** Viewport height in physical pixels. */
	private height: number = 1;

	/** Background clear color (RGBA normalized 0.0-1.0). */
	private clearColor: [number, number, number, number] = [1, 0, 0, 1];
	/** Current active draw color (RGBA normalized 0.0-1.0). */
	private currentColor: [number, number, number, number] = [1, 1, 1, 1];
	/** Accumulated instances for immediate-mode drawing commands. */
	private frameInstances: EntityInstance[] = [];
	/** World-space camera position [x, y]. */
	private cameraPos: [number, number] = [0, 0];
	/** Camera zoom level. */
	private zoom: number = 1;

	/** CPU font atlas generator. */
	private fontAtlas: FontAtlas;
	/** GPU texture holding baked font atlas glyphs. */
	private atlas_texture!: GPUTexture;
	/** Texture sampler for reading font atlas UVs. */
	private atlas_sampler!: GPUSampler;
	/** Layout definition for font atlas texture/sampler bindings. */
	private atlas_bind_group_layout!: GPUBindGroupLayout;
	/** Bind group referencing the font atlas texture and sampler. */
	private atlas_bind_group!: GPUBindGroup;

	/**
	 * Initializes context and triggers asynchronous WebGPU setup.
	 */
	constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
		this.ctx = canvas.getContext("webgpu")!;
		this.configs = configs;
		this.fontAtlas = new FontAtlas();

		(async () => {
			await this.initializeWebGPU();
		})();
	}

	/**
	 * Requests WebGPU adapter/device, creates pipeline layouts, textures, and buffers.
	 */
	async initializeWebGPU(): Promise<void> {
		if (!navigator.gpu) {
			alert(
				"WEBGPU IS NOT SUPPORTED ON YOUR DEVICE. YOU CAN UPGRADE YOUR BROWSER OR RESORT TO CANVAS2D/WEBGL.",
			);
			return;
		}

		const adapter = await navigator.gpu.requestAdapter();
		const device = await adapter?.requestDevice();
		const queue = device?.queue;
		if (!device || !queue) return;

		const surface_format = navigator.gpu.getPreferredCanvasFormat();

		this.ctx.configure({ device, format: surface_format, alphaMode: "opaque" });

		const canvas = this.ctx.canvas;
		this.width = canvas.width || 1;
		this.height = canvas.height || 1;

		const camera_uniform = new CameraUniform();
		camera_uniform.viewProj = computeViewProjMatrix(
			this.width,
			this.height,
			this.cameraPos,
			this.zoom,
		);
		camera_uniform.cameraPos = [0, 0];
		camera_uniform.zoom = 0.005;
		camera_uniform.aspectRatio = this.ctx.canvas.width / this.ctx.canvas.height;

		const camera_buffer = device.createBuffer({
			label: "camera buffer",
			size: camera_uniform.bytes.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			mappedAtCreation: true,
		});
		new Float32Array(camera_buffer.getMappedRange()).set(camera_uniform.bytes);
		camera_buffer.unmap();

		const camera_bind_group_layout = device.createBindGroupLayout({
			label: "camera bind group layout",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: {
						type: "uniform",
						hasDynamicOffset: false,
						minBindingSize: 0,
					},
				},
			],
		});

		const camera_bind_group = device.createBindGroup({
			label: "camera bind group",
			layout: camera_bind_group_layout,
			entries: [{ binding: 0, resource: { buffer: camera_buffer } }],
		});

		const vs_module = device.createShaderModule({
			label: "vertex shader",
			code: vs_source,
		});
		const fs_module = device.createShaderModule({
			label: "fragment shader",
			code: fs_source,
		});

		this.atlas_texture = device.createTexture({
			label: "font atlas",
			size: [this.fontAtlas.canvas.width, this.fontAtlas.canvas.height],
			format: "rgba8unorm",
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT,
		});
		device.queue.copyExternalImageToTexture(
			{ source: this.fontAtlas.canvas },
			{ texture: this.atlas_texture },
			[this.fontAtlas.canvas.width, this.fontAtlas.canvas.height],
		);

		this.atlas_sampler = device.createSampler({
			magFilter: "linear",
			minFilter: "linear",
		});

		this.atlas_bind_group_layout = device.createBindGroupLayout({
			label: "atlas bind group layout",
			entries: [
				{ binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {} },
				{ binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
			],
		});
		this.atlas_bind_group = device.createBindGroup({
			label: "atlas bind group",
			layout: this.atlas_bind_group_layout,
			entries: [
				{ binding: 0, resource: this.atlas_texture.createView() },
				{ binding: 1, resource: this.atlas_sampler },
			],
		});

		const render_pipeline_layout = device.createPipelineLayout({
			label: "Render pipeline layout",
			bindGroupLayouts: [
				camera_bind_group_layout,
				this.atlas_bind_group_layout,
			],
			immediateSize: 0,
		});

		const render_pipeline = device.createRenderPipeline({
			label: "render pipeline",
			layout: render_pipeline_layout,
			vertex: {
				module: vs_module,
				entryPoint: "vs_main",
				buffers: [EntityInstance.desc()],
			},
			fragment: {
				module: fs_module,
				entryPoint: "fs_main",
				targets: [
					{
						format: surface_format,
						blend: {
							color: {
								srcFactor: "src-alpha",
								dstFactor: "one-minus-src-alpha",
								operation: "add",
							},
							alpha: {
								srcFactor: "one",
								dstFactor: "one-minus-src-alpha",
								operation: "add",
							},
						},
						writeMask: GPUColorWrite.ALL,
					},
				],
			},
			depthStencil: undefined,
			multisample: {
				count: 1,
				mask: 0xffffffff,
				alphaToCoverageEnabled: false,
			},
			primitive: {
				topology: "triangle-list",
				frontFace: "ccw",
				cullMode: "none",
			},
		});

		const instance_buffer = device.createBuffer({
			label: "instance buffer",
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
			size: 68 * 4096,
			mappedAtCreation: false,
		});

		this.device = device;
		this.queue = queue;
		this.render_pipeline = render_pipeline;
		this.instance_buffer = instance_buffer;
		this.camera_buffer = camera_buffer;
		this.camera_bind_group = camera_bind_group;
	}

	/**
	 * Resizes viewport canvas and updates camera aspect ratio matrices.
	 */
	public resize(width: number, height: number) {
		if (!this.queue || !this.camera_buffer) return;

		const scale_factor = window.devicePixelRatio;
		const physical_width = Math.floor(width * scale_factor);
		const physical_height = Math.floor(height * scale_factor);

		if (physical_width > 0 && physical_height > 0) {
			this.width = physical_width;
			this.height = physical_height;

			if (this.ctx.canvas instanceof HTMLCanvasElement) {
				this.ctx.canvas.width = physical_width;
				this.ctx.canvas.height = physical_height;
			}

			const aspect_ratio = physical_width / physical_height;
			const camera_uniform = new CameraUniform();
			camera_uniform.viewProj = computeViewProjMatrix(
				this.width,
				this.height,
				this.cameraPos,
				this.zoom,
			);
			camera_uniform.cameraPos = this.cameraPos;
			camera_uniform.zoom = this.zoom;
			camera_uniform.aspectRatio = aspect_ratio;

			this.queue.writeBuffer(
				this.camera_buffer,
				0,
				camera_uniform.bytes.buffer,
			);
		}
	}

	/**
	 * Packs entity instance data into binary layout and uploads to GPU instance buffer.
	 */
	public update(instances: EntityInstance[]): void {
		this.num_instances = instances.length;

		if (instances.length === 0) {
			return;
		}

		const floatSlotsPerInstance = 17;
		const rawData = new Float32Array(instances.length * floatSlotsPerInstance);
		const uintData = new Uint32Array(rawData.buffer);

		instances.forEach((instance, index) => {
			const stride = index * floatSlotsPerInstance;

			rawData[stride + 0] = instance.position[0]; // pos.x
			rawData[stride + 1] = instance.position[1]; // pos.y
			rawData[stride + 2] = instance.size[0]; // size.x
			rawData[stride + 3] = instance.size[1]; // size.y
			rawData[stride + 4] = instance.rotation; // rotation
			uintData[stride + 5] = instance.shape_type; // shape_type (u32)
			uintData[stride + 6] = instance.sides; // sides (u32)
			rawData[stride + 7] = instance.fill_style[0]; // fill_style.r
			rawData[stride + 8] = instance.fill_style[1]; // fill_style.g
			rawData[stride + 9] = instance.fill_style[2]; // fill_style.b
			rawData[stride + 10] = instance.fill_style[3]; // fill_style.a
			rawData[stride + 11] = instance.border_color[0]; // border_color.r
			rawData[stride + 12] = instance.border_color[1]; // border_color.g
			rawData[stride + 13] = instance.border_color[2]; // border_color.b
			rawData[stride + 14] = instance.border_color[3]; // border_color.a
			rawData[stride + 15] = instance.border_thickness; // border_thickness
			rawData[stride + 16] = instance.extra_param; // extra_param
		});

		const requiredSize = rawData.byteLength;

		// reallocate if capacity exceeded
		if (requiredSize > this.instance_buffer.size) {
			this.instance_buffer.destroy();

			this.instance_buffer = this.device.createBuffer({
				label: "dyn instance buffer",
				size: requiredSize,
				usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
				mappedAtCreation: true,
			});

			new Float32Array(this.instance_buffer.getMappedRange()).set(rawData);
			this.instance_buffer.unmap();
		} else {
			this.queue.writeBuffer(this.instance_buffer, 0, rawData);
		}
	}

	/**
	 * Updates camera uniform state and uploads updated matrix to GPU.
	 */
	public update_camera(camera_pos: [number, number], zoom: number) {
		const aspect_ratio = Math.max(1, this.width / this.height);

		const camera_uniform = new CameraUniform();
		camera_uniform.viewProj = computeViewProjMatrix(
			this.width,
			this.height,
			camera_pos,
			zoom,
		);
		camera_uniform.cameraPos = camera_pos;
		camera_uniform.zoom = zoom;
		camera_uniform.aspectRatio = aspect_ratio;

		this.queue.writeBuffer(this.camera_buffer, 0, camera_uniform.bytes.buffer);
	}

	/**
	 * Renders an explicit array of entity instances in a single pass.
	 */
	public render_entities_with_text(
		entities: Array<EntityInstance>,
		camera_pos: [number, number],
		zoom: number,
	) {
		if (!entities.length) {
			return;
		}

		this.update_camera(camera_pos, zoom);
		this.update(entities);

		const texture = this.ctx.getCurrentTexture();
		const view = texture.createView();

		const encoder = this.device.createCommandEncoder({
			label: "entities render encoder",
		});

		const render_pass = encoder.beginRenderPass({
			label: "entities render pass",
			colorAttachments: [
				{
					view,
					resolveTarget: undefined,
					depthSlice: undefined,
					loadOp: "clear",
					clearValue: {
						r: this.clearColor[0],
						g: this.clearColor[1],
						b: this.clearColor[2],
						a: this.clearColor[3],
					},
					storeOp: "store",
				},
			],
			depthStencilAttachment: undefined,
			occlusionQuerySet: undefined,
			timestampWrites: undefined,
		});

		render_pass.setPipeline(this.render_pipeline);
		render_pass.setBindGroup(0, this.camera_bind_group);
		render_pass.setBindGroup(1, this.atlas_bind_group);
		render_pass.setVertexBuffer(0, this.instance_buffer);
		render_pass.draw(6, this.num_instances);

		render_pass.end();

		this.queue.submit([encoder.finish()]);
	}

	/**
	 * Sets local camera target position and zoom level.
	 */
	public setCamera(pos: [number, number], zoom: number): void {
		this.cameraPos = pos;
		this.zoom = zoom;
	}

	/**
	 * Internal helper to record a new shape instance to the current frame buffer.
	 */
	private pushInstance(inst: {
		position: [number, number];
		size: [number, number];
		rotation: number;
		shape_type: number;
		sides?: number;
		extra_param?: number;
	}): void {
		const [r, g, b, a] = this.currentColor;

		this.frameInstances.push({
			position: inst.position,
			size: inst.size,
			rotation: inst.rotation,
			shape_type: inst.shape_type,
			sides: inst.sides ?? 0,
			fill_style: [r, g, b, a],
			border_color: [0, 0, 0, 0],
			border_thickness: 0,
			extra_param: inst.extra_param ?? 0,
		} as EntityInstance);
	}

	/**
	 * Sets canvas clear color (0-255 RGB, 0-1 Alpha).
	 */
	clear(r: number, g: number, b: number, a: number): void {
		this.clearColor = [r / 255, g / 255, b / 255, a];
	}

	/**
	 * Sets active drawing color for subsequent shape commands (0-255 RGB, 0-1 Alpha).
	 */
	setColor(r: number, g: number, b: number, a: number): void {
		this.currentColor = [r / 255, g / 255, b / 255, a];
	}

	/**
	 * Pushes a 3-sided regular polygon instance.
	 */
	drawTriangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
	): void {
		const cx = (x1 + x2 + x3) / 3;
		const cy = (y1 + y2 + y3) / 3;

		const radius =
			(Math.hypot(x1 - cx, y1 - cy) +
				Math.hypot(x2 - cx, y2 - cy) +
				Math.hypot(x3 - cx, y3 - cy)) /
			3;

		const rotation = Math.atan2(y1 - cy, x1 - cx);

		this.pushInstance({
			position: [cx, cy],
			size: [radius * 2, radius * 2],
			rotation,
			shape_type: 3,
			sides: 3,
		});
	}

	/**
	 * Pushes a rectangle/Rect shape instance.
	 */
	drawRect(
		x: number,
		y: number,
		w: number,
		h: number,
		rot: number = 0,
	): void {
		this.pushInstance({
			position: [x + w / 2, y + h / 2],
			size: [w, h],
			rotation: rot,
			shape_type: 1,
		});
	}

	/**
	 * Helper function pushing a regular polygon shape instance.
	 */
	private drawRegularPolygonImpl(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot = 0,
	): void {
		this.pushInstance({
			position: [x, y],
			size: [size, size],
			rotation: rot,
			shape_type: 3,
			sides,
		});
	}

	/**
	 * Pushes a regular polygon instance with custom side counts.
	 */
	drawCustomSides(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void {
		this.drawRegularPolygonImpl(x, y, size, sides, rot);
	}

	/**
	 * Pushes a regular polygon instance.
	 */
	drawRegularPolygon(
		x: number,
		y: number,
		size: number,
		sides: number,
		rot?: number,
	): void {
		this.drawRegularPolygonImpl(x, y, size, sides, rot);
	}

	/**
	 * Approximates a polygon from vertex points and pushes a polygon instance.
	 */
	drawPolygon(vertices: Array<[number, number]>): void {
		if (!vertices.length) return;

		const cx =
			vertices.reduce((sum, vertex) => sum + vertex[0], 0) / vertices.length;

		const cy =
			vertices.reduce((sum, vertex) => sum + vertex[1], 0) / vertices.length;

		const radius =
			vertices.reduce((sum, [x, y]) => sum + Math.hypot(x - cx, y - cy), 0) /
			vertices.length;

		const rotation = Math.atan2(
			(vertices[0]?.[1] ?? 0) - cy,
			(vertices[0]?.[0] ?? 0) - cx,
		);

		this.pushInstance({
			position: [cx, cy],
			size: [radius * 2, radius * 2],
			rotation,
			shape_type: 3,
			sides: vertices.length,
		});
	}

	/**
	 * Flushes all accumulated frame instances and submits the render pass to the GPU.
	 */
	present(): void {
		if (!this.device || !this.queue || !this.render_pipeline) return;

		this.update_camera(this.cameraPos, this.zoom);
		this.update(this.frameInstances);

		const view = this.ctx.getCurrentTexture().createView();
		const encoder = this.device.createCommandEncoder({
			label: "immediate-mode frame encoder",
		});
		const render_pass = encoder.beginRenderPass({
			label: "immediate-mode frame pass",
			colorAttachments: [
				{
					view,
					loadOp: "clear",
					clearValue: {
						r: this.clearColor[0],
						g: this.clearColor[1],
						b: this.clearColor[2],
						a: this.clearColor[3],
					},
					storeOp: "store",
				},
			],
		});

		if (this.num_instances > 0) {
			render_pass.setPipeline(this.render_pipeline);
			render_pass.setBindGroup(0, this.camera_bind_group);
			render_pass.setBindGroup(1, this.atlas_bind_group);
			render_pass.setVertexBuffer(0, this.instance_buffer);
			render_pass.draw(6, this.num_instances);
		}

		render_pass.end();
		this.queue.submit([encoder.finish()]);

		this.frameInstances = [];
	}

	/**
	 * Decodes a command buffer into drawing calls and presents the frame.
	 */
	public processFrame(data: Float32Array, length: number): void {
		const driver = this as Backend;
		let i = 0;

		while (i < length) {
			const opcode = data[i++] as Commands;

			switch (opcode) {
				case Commands.Clear: {
					if (!driver.clear) {
						throw new Error("WebGPU backend does not implement 'clear()'.");
					}
					driver.clear(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
					break;
				}

				case Commands.SetColor: {
					if (!driver.setColor) {
						throw new Error("WebGPU backend does not implement 'setColor()'.");
					}
					driver.setColor(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
					break;
				}

				case Commands.DrawLine: {
					if (!driver.drawLine) {
						throw new Error("WebGPU backend does not implement 'drawLine()'.");
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
							"WebGPU backend does not implement 'drawCircle()'.",
						);
					}
					driver.drawCircle(data[i++]!, data[i++]!, data[i++]!);
					break;
				}

				case Commands.DrawRect: {
					if (!driver.drawRect) {
						throw new Error(
							"WebGPU backend does not implement 'drawRect()'.",
						);
					}
					driver.drawRect(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
					break;
				}

				case Commands.DrawTriangle: {
					if (!driver.drawTriangle) {
						throw new Error(
							"WebGPU backend does not implement 'drawTriangle()'.",
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
							"WebGPU backend does not implement 'drawRegularPolygon()'.",
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
							"WebGPU backend does not implement 'drawPolygon()'.",
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

				case Commands.DrawText: {
					const x = data[i++]!;
					const y = data[i++]!;
					const size = data[i++]!;
					const charCount = data[i++]!;
					let text = "";
					for (let c = 0; c < charCount; c++)
						text += String.fromCharCode(data[i++]!);

					if (!driver.drawText) {
						throw new Error("WebGPU backend does not implement 'drawText()'.");
					}
					driver.drawText(x, y, text, size);
					break;
				}
			}
		}

		this.present();
	}

	/**
	 * Helper function pushing text glyph quad instances (shape_type = 5).
	 */
	private pushGlyphInstance(
		position: [number, number],
		size: [number, number],
		uvRect: [number, number, number, number], // [u0, v0, uWidth, vHeight]
	): void {
		const [r, g, b, a] = this.currentColor;

		this.frameInstances.push({
			position,
			size,
			rotation: 0,
			shape_type: 5,
			sides: 0,
			fill_style: [r, g, b, a],
			border_color: uvRect,
			border_thickness: 0,
			extra_param: 0,
		} as EntityInstance);
	}

	/**
	 * Lays out characters from font atlas and pushes glyph quads for rendering.
	 */
	public drawText(x: number, y: number, text: string, size: number): void {
		if (!this.fontAtlas) return;

		const scale = size / this.fontAtlas.baseSize;
		let cursorX = x;

		for (const ch of text) {
			const glyph = this.fontAtlas.glyphs.get(ch);

			if (!glyph) {
				cursorX += this.fontAtlas.spaceAdvance * scale;
				continue;
			}

			const w = glyph.width * scale;
			const h = glyph.height * scale;

			this.pushGlyphInstance(
				[cursorX + w / 2, y + h / 2],
				[w, h],
				[glyph.u0, glyph.v0, glyph.u1 - glyph.u0, glyph.v1 - glyph.v0],
			);

			cursorX += glyph.advance * scale;
		}
	}
}
