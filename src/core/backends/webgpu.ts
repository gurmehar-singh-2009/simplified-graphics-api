import fs_source from "../../graphics/shaders/webgpu/fragment.wgsl" with {
	type: "text",
};
import vs_source from "../../graphics/shaders/webgpu/vertex.wgsl" with {
	type: "text",
};
import { computeFlatNormals, computeViewProjMatrix } from "../../math/util";
import type { Vector2 } from "../../math/vector2";
import type { Backend, RenderConfigs } from "../renderer";
import { CameraUniform } from "./buffers/cameraBuffer";
import { EntityInstance } from "./buffers/entityInstance";
import { FontAtlas } from "./buffers/fontAtlas";

import mesh_vs_source from "../../graphics/shaders/webgpu/mesh_vertex.wgsl" with {
	type: "text",
};
import mesh_fs_source from "../../graphics/shaders/webgpu/mesh_fragment.wgsl" with {
	type: "text",
};
import type { MeshData } from "../../graphics/mesh";
import type { MeshDrawInstance, UploadedMesh } from "./buffers/meshInstance";
import type { Vector3 } from "../../math/vector3";
import type { Quaternion } from "../../math/quaternion";
import type { Camera } from "../camera";

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
	/** 4x4 view-projection matrix. */
	private viewProjectionMatrix: Float32Array = new Float32Array(16);
	/** Current "drawing depth" applied to subsequently pushed instances. */
	private currentZ: number = 0;
	/** Depth-buffer texture. */
	private depth_texture!: GPUTexture;
	/** View onto the depth texture. */
	private depth_texture_view!: GPUTextureView;

	/** Instanced mesh render pipeline. */
	private mesh_pipeline!: GPURenderPipeline;
	/** GPU buffer for per-frame mesh instance transforms (mat4 + color). */
	private mesh_instance_buffer!: GPUBuffer;
	/** Uploaded meshes by id. */
	private meshes = new Map<number, UploadedMesh>();
	/** Meshes registered before the device was ready. */
	private pendingMeshes: Array<[number, MeshData]> = [];
	/** Accumulated mesh draws for the current frame. */
	private frameMeshInstances: MeshDrawInstance[] = [];
	/** Per-frame draw list (one entry per mesh, instances bucketed). */
	private meshDraws: Array<{
		mesh: UploadedMesh;
		byteOffset: number;
		instanceCount: number;
	}> = [];
	/** World-space camera position. */
	private cameraPos3: [number, number, number] = [0, 0, 0];

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
				"WEBGPU IS NOT SUPPORTED ON YOUR DEVICE. YOU CAN UPGRADE YOUR BROWSER OR RESORT TO CANVAS/WEBGL.",
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

		this.depth_texture = device.createTexture({
			label: "depth texture",
			size: [this.width, this.height],
			format: "depth24plus",
			usage: GPUTextureUsage.RENDER_ATTACHMENT,
		});
		this.depth_texture_view = this.depth_texture.createView();

		const camera_uniform = new CameraUniform();
		camera_uniform.viewProj = computeViewProjMatrix(
			this.width,
			this.height,
			this.cameraPos,
			this.zoom,
		);
		camera_uniform.cameraPos = [0, 0, 0];
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
			depthStencil: {
				format: "depth24plus",
				depthWriteEnabled: true,
				depthCompare: "less",
			},
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
			size: 72 * 4096,
			mappedAtCreation: false,
		});

		// 3d mesh stuff
		const mesh_vs_module = device.createShaderModule({
			label: "mesh vertex shader",
			code: mesh_vs_source,
		});
		const mesh_fs_module = device.createShaderModule({
			label: "mesh fragment shader",
			code: mesh_fs_source,
		});

		const mesh_vertex_layout: GPUVertexBufferLayout = {
			arrayStride: 24,
			attributes: [
				{ shaderLocation: 0, format: "float32x3", offset: 0 }, // position
				{ shaderLocation: 1, format: "float32x3", offset: 12 }, // normal
			],
		};

		const mesh_instance_layout: GPUVertexBufferLayout = {
			arrayStride: 80, // mat4 model + vec4 color
			stepMode: "instance",
			attributes: [
				{ shaderLocation: 2, format: "float32x4", offset: 0 }, // model column 0
				{ shaderLocation: 3, format: "float32x4", offset: 16 },
				{ shaderLocation: 4, format: "float32x4", offset: 32 },
				{ shaderLocation: 5, format: "float32x4", offset: 48 },
				{ shaderLocation: 6, format: "float32x4", offset: 64 }, // color
			],
		};

		this.mesh_pipeline = device.createRenderPipeline({
			label: "mesh render pipeline",
			layout: device.createPipelineLayout({
				label: "mesh pipeline layout",
				bindGroupLayouts: [camera_bind_group_layout],
			}),
			vertex: {
				module: mesh_vs_module,
				entryPoint: "vs_main",
				buffers: [mesh_vertex_layout, mesh_instance_layout],
			},
			fragment: {
				module: mesh_fs_module,
				entryPoint: "fs_main",
				targets: [{ format: surface_format }],
			},
			depthStencil: {
				format: "depth24plus",
				depthWriteEnabled: true,
				depthCompare: "less",
			},
			multisample: {
				count: 1,
				mask: 0xffffffff,
				alphaToCoverageEnabled: false,
			},
			primitive: {
				topology: "triangle-list",
				frontFace: "ccw",

				// TODO
				cullMode: "none",
			},
		});

		this.mesh_instance_buffer = device.createBuffer({
			label: "mesh instance buffer",
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
			size: 80 * 1024, // 1024 should be enough... it grows anyways so yeah
		});

		this.device = device;
		this.queue = queue;
		this.render_pipeline = render_pipeline;
		this.instance_buffer = instance_buffer;
		this.camera_buffer = camera_buffer;
		this.camera_bind_group = camera_bind_group;
		this.depth_texture = this.depth_texture;
		this.depth_texture_view = this.depth_texture_view;

		for (const [id, mesh] of this.pendingMeshes) this.uploadMesh(id, mesh);
		this.pendingMeshes.length = 0;
	}

	/**
	 * Resizes viewport canvas and updates camera aspect ratio matrices.
	 */
	public resize(width: number, height: number) {
		if (!this.queue || !this.camera_buffer || !this.device) return;

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

			this.depth_texture?.destroy();
			this.depth_texture = this.device.createTexture({
				label: "depth texture",
				size: [physical_width, physical_height],
				format: "depth24plus",
				usage: GPUTextureUsage.RENDER_ATTACHMENT,
			});
			this.depth_texture_view = this.depth_texture.createView();
		}
	}
	// public resize(width: number, height: number) {
	//   if (!this.queue || !this.camera_buffer) return;

	//   const scale_factor = window.devicePixelRatio;
	//   const physical_width = Math.floor(width * scale_factor);
	//   const physical_height = Math.floor(height * scale_factor);

	//   if (physical_width > 0 && physical_height > 0) {
	//     this.width = physical_width;
	//     this.height = physical_height;

	//     if (this.ctx.canvas instanceof HTMLCanvasElement) {
	//       this.ctx.canvas.width = physical_width;
	//       this.ctx.canvas.height = physical_height;
	//     }

	//     const aspect_ratio = physical_width / physical_height;
	//     const camera_uniform = new CameraUniform();
	//     camera_uniform.viewProj = computeViewProjMatrix(
	//       this.width,
	//       this.height,
	//       this.cameraPos,
	//       this.zoom,
	//     );
	//     camera_uniform.cameraPos = this.cameraPos;
	//     camera_uniform.zoom = this.zoom;
	//     camera_uniform.aspectRatio = aspect_ratio;

	//     this.queue.writeBuffer(
	//       this.camera_buffer,
	//       0,
	//       camera_uniform.bytes.buffer,
	//     );
	//   }
	// }

	/**
	 * Packs entity instance data into binary layout and uploads to GPU instance buffer.
	 */
	public update(instances: EntityInstance[]): void {
		this.num_instances = instances.length;

		if (instances.length === 0) {
			return;
		}

		const floatSlotsPerInstance = 18;
		const rawData = new Float32Array(instances.length * floatSlotsPerInstance);
		const uintData = new Uint32Array(rawData.buffer);

		instances.forEach((instance, index) => {
			const stride = index * floatSlotsPerInstance;

			rawData[stride + 0] = instance.position[0];
			rawData[stride + 1] = instance.position[1];
			rawData[stride + 2] = instance.position[2];
			rawData[stride + 3] = instance.size[0];
			rawData[stride + 4] = instance.size[1];
			rawData[stride + 5] = instance.rotation;
			uintData[stride + 6] = instance.shape_type;
			uintData[stride + 7] = instance.sides;
			rawData[stride + 8] = instance.fill_style[0];
			rawData[stride + 9] = instance.fill_style[1];
			rawData[stride + 10] = instance.fill_style[2];
			rawData[stride + 11] = instance.fill_style[3];
			rawData[stride + 12] = instance.border_color[0];
			rawData[stride + 13] = instance.border_color[1];
			rawData[stride + 14] = instance.border_color[2];
			rawData[stride + 15] = instance.border_color[3];
			rawData[stride + 16] = instance.border_thickness;
			rawData[stride + 17] = instance.extra_param;
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
		camera_uniform.cameraPos = [...camera_pos, 0];
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
			depthStencilAttachment: {
				view: this.depth_texture_view,
				depthClearValue: 1.0,
				depthLoadOp: "clear",
				depthStoreOp: "store",
			},
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
	// public setCamera(pos: [number, number], zoom: number): void {
	// 	this.cameraPos = pos;
	// 	this.zoom = zoom;
	// }

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
			position: [...inst.position, this.currentZ],
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
	 * Pushes a rectangle/square shape instance.
	 */
	drawRect(x: number, y: number, w: number, h: number): void {
		this.pushInstance({
			position: [x + w / 2, y + h / 2],
			size: [w, h],
			rotation: 0,
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
	drawPolygon(vertices: Array<Vector2>): void {
		if (!vertices.length) return;

		const cx =
			vertices.reduce((sum, vertex) => sum + vertex.x, 0) / vertices.length;

		const cy =
			vertices.reduce((sum, vertex) => sum + vertex.y, 0) / vertices.length;

		const radius =
			vertices.reduce((sum, { x, y }) => sum + Math.hypot(x - cx, y - cy), 0) /
			vertices.length;

		const rotation = Math.atan2(vertices[0]!.y - cy, vertices[0]!.x - cx);

		this.pushInstance({
			position: [cx, cy],
			size: [radius * 2, radius * 2],
			rotation,
			shape_type: 3,
			sides: vertices.length,
		});
	}

	drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		thickness: number,
	): void {
		const cx = (x1 + x2) / 2;
		const cy = (y1 + y2) / 2;
		const length = Math.hypot(x2 - x1, y2 - y1);
		const rotation = Math.atan2(y2 - y1, x2 - x1);
		this.pushInstance({
			position: [cx, cy],
			size: [length, thickness],
			rotation,
			shape_type: 1,
		});
	}

	drawCircle(x: number, y: number, radius: number): void {
		this.pushInstance({
			position: [x, y],
			size: [radius * 2, radius * 2],
			rotation: 0,
			shape_type: 3,
			sides: 32,
		});
	}

	/**
	 * Flushes all accumulated frame instances and submits the render pass to the GPU.
	 */
	public flush(): void {
		if (!this.device || !this.queue || !this.render_pipeline) {
			this.frameInstances.length = 0;
			this.frameMeshInstances.length = 0;
			return;
		}

		this.update(this.frameInstances);
		this.updateMeshInstances();

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
			depthStencilAttachment: {
				view: this.depth_texture_view,
				depthClearValue: 1.0,
				depthLoadOp: "clear",
				depthStoreOp: "store",
			},
		});

		// i guess we could change the order here by giving them options for render order but for now:

		// render 3d first
		if (this.meshDraws.length > 0) {
			render_pass.setPipeline(this.mesh_pipeline);
			render_pass.setBindGroup(0, this.camera_bind_group);
			for (const draw of this.meshDraws) {
				render_pass.setVertexBuffer(0, draw.mesh.vertexBuffer);
				render_pass.setVertexBuffer(
					1,
					this.mesh_instance_buffer,
					draw.byteOffset,
				);
				if (draw.mesh.indexBuffer) {
					render_pass.setIndexBuffer(draw.mesh.indexBuffer, "uint32");
					render_pass.drawIndexed(draw.mesh.indexCount, draw.instanceCount);
				} else {
					render_pass.draw(draw.mesh.vertexCount, draw.instanceCount);
				}
			}
		}

		// then 2d (also includes text)
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
		this.frameMeshInstances = [];
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
			position: [...position, this.currentZ],
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
	 * Sets the drawing depth applied to subsequently pushed shapes.
	 */
	setDepth(z: number): void {
		this.currentZ = z;
	}

	/**
	 * Lays out characters from font atlas and pushes glyph quads for rendering.
	 */
	public drawText(
		x: number,
		y: number,
		text: string,
		size: number,
		alignment: number,
	): void {
		if (!this.fontAtlas) return;

		const scale = size / this.fontAtlas.baseSize;

		let totalWidth = 0;
		for (const ch of text) {
			const glyph = this.fontAtlas.glyphs.get(ch);
			totalWidth += glyph
				? glyph.advance * scale
				: this.fontAtlas.spaceAdvance * scale;
		}

		let cursorX = x;
		if (alignment === 1) {
			cursorX -= totalWidth / 2;
		} else if (alignment === 2) {
			cursorX -= totalWidth;
		}

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

	public updateView(camera: Camera): void {
		if (!this.queue || !this.camera_buffer) return;

		this.viewProjectionMatrix.set(camera.viewProjectionMatrix.data);
		this.cameraPos3 = [camera.position.x, camera.position.y, camera.position.z];

		const camera_uniform = new CameraUniform();
		camera_uniform.viewProj = this.viewProjectionMatrix;
		camera_uniform.cameraPos = this.cameraPos3;
		camera_uniform.zoom = this.zoom;
		camera_uniform.aspectRatio = this.width / Math.max(1, this.height);

		this.queue.writeBuffer(this.camera_buffer, 0, camera_uniform.bytes.buffer);
	}

	public createMesh(id: number, mesh: MeshData): void {
		// just incase
		if (!this.device) {
			this.pendingMeshes.push([id, mesh]);
			return;
		}

		this.uploadMesh(id, mesh);
	}

	private uploadMesh(id: number, mesh: MeshData): void {
		if (mesh.positions.length % 3 !== 0) {
			throw new Error("meshdata.positions length must be a multiple of 3");
		}

		const normals = mesh.normals ?? computeFlatNormals(mesh);
		const vertexCount = mesh.positions.length / 3;

		const interleaved = new Float32Array(vertexCount * 6);
		for (let v = 0; v < vertexCount; v++) {
			interleaved[v * 6 + 0] = mesh.positions[v * 3]!;
			interleaved[v * 6 + 1] = mesh.positions[v * 3 + 1]!;
			interleaved[v * 6 + 2] = mesh.positions[v * 3 + 2]!;
			interleaved[v * 6 + 3] = normals[v * 3]!;
			interleaved[v * 6 + 4] = normals[v * 3 + 1]!;
			interleaved[v * 6 + 5] = normals[v * 3 + 2]!;
		}

		const vertexBuffer = this.device.createBuffer({
			label: `mesh ${id} vertices`,
			size: interleaved.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
			mappedAtCreation: true,
		});
		new Float32Array(vertexBuffer.getMappedRange()).set(interleaved);
		vertexBuffer.unmap();

		let indexBuffer: GPUBuffer | undefined;
		let indexCount = 0;
		if (mesh.indices && mesh.indices.length > 0) {
			indexCount = mesh.indices.length;
			indexBuffer = this.device.createBuffer({
				label: `mesh ${id} indices`,
				size: mesh.indices.byteLength,
				usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
				mappedAtCreation: true,
			});

			new Uint32Array(indexBuffer.getMappedRange()).set(mesh.indices);

			indexBuffer.unmap();
		}

		const existing = this.meshes.get(id);
		this.meshes.set(id, { vertexBuffer, indexBuffer, vertexCount, indexCount });

		existing?.vertexBuffer.destroy();
		existing?.indexBuffer?.destroy();
	}

	private updateMeshInstances(): void {
		this.meshDraws = [];
		if (!this.frameMeshInstances.length) return;

		const floats_per_inst = 20; // 16 (model matrix) + 4 (color)

		const buckets = new Map<number, MeshDrawInstance[]>();
		for (const inst of this.frameMeshInstances) {
			const bucket = buckets.get(inst.meshId);
			if (bucket) bucket.push(inst);
			else buckets.set(inst.meshId, [inst]);
		}

		const raw = new Float32Array(
			this.frameMeshInstances.length * floats_per_inst,
		);
		let cursor = 0;

		for (const [id, bucket] of buckets) {
			const mesh = this.meshes.get(id);
			if (!mesh) {
				console.warn(
					`WebGPUBackend: drawMesh referenced unknown mesh id ${id}`,
				);
				continue;
			}

			const startFloat = cursor;
			for (const inst of bucket) {
				this.composeModelMatrix(inst, raw, cursor);
				raw[cursor + 16] = inst.color[0];
				raw[cursor + 17] = inst.color[1];
				raw[cursor + 18] = inst.color[2];
				raw[cursor + 19] = inst.color[3];
				cursor += floats_per_inst;
			}

			this.meshDraws.push({
				mesh,
				byteOffset: startFloat * 4,
				instanceCount: bucket.length,
			});
		}

		if (cursor === 0) return;

		const requiredSize = cursor * 4;
		if (requiredSize > this.mesh_instance_buffer.size) {
			this.mesh_instance_buffer.destroy();
			this.mesh_instance_buffer = this.device.createBuffer({
				label: "dyn mesh instance buffer",
				size: requiredSize,
				usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
				mappedAtCreation: true,
			});

			new Float32Array(this.mesh_instance_buffer.getMappedRange()).set(
				raw.subarray(0, cursor),
			);

			this.mesh_instance_buffer.unmap();
		} else {
			this.queue.writeBuffer(this.mesh_instance_buffer, 0, raw, 0, cursor);
		}
	}

	// TODO: double check this. the source i was using didnt really give this so i had to interpret...
	private composeModelMatrix(
		inst: MeshDrawInstance,
		out: Float32Array,
		offset: number,
	): void {
		const [px, py, pz] = inst.position;
		const [qx, qy, qz, qw] = inst.rotation;
		const [sx, sy, sz] = inst.scale;

		const mag = Math.hypot(qx, qy, qz, qw) || 1;
		const x = qx / mag,
			y = qy / mag,
			z = qz / mag,
			w = qw / mag;

		out[offset + 0] = (1 - 2 * (y * y + z * z)) * sx;
		out[offset + 1] = 2 * (x * y + w * z) * sx;
		out[offset + 2] = 2 * (x * z - w * y) * sx;
		out[offset + 3] = 0;

		out[offset + 4] = 2 * (x * y - w * z) * sy;
		out[offset + 5] = (1 - 2 * (x * x + z * z)) * sy;
		out[offset + 6] = 2 * (y * z + w * x) * sy;
		out[offset + 7] = 0;

		out[offset + 8] = 2 * (x * z + w * y) * sz;
		out[offset + 9] = 2 * (y * z - w * x) * sz;
		out[offset + 10] = (1 - 2 * (x * x + y * y)) * sz;
		out[offset + 11] = 0;

		out[offset + 12] = px;
		out[offset + 13] = py;
		out[offset + 14] = pz;
		out[offset + 15] = 1;
	}

	/**
	 * Queues a 3D mesh draw for the current frame. Color comes from setColor().
	 */
	drawMesh(
		meshId: number,
		position: Vector3,
		rotation: Quaternion,
		scale: Vector3,
	): void {
		const [r, g, b, a] = this.currentColor;

		this.frameMeshInstances.push({
			meshId,
			position: [position.x, position.y, position.z],
			rotation: [rotation.x, rotation.y, rotation.z, rotation.w],
			scale: [scale.x, scale.y, scale.z],
			color: [r, g, b, a],
		});
	}
}
