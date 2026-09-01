import type { Mesh, MeshData } from "../graphics/mesh";
import type { Quaternion } from "../math/quaternion";
import type { Transform } from "../math/transform";
import type { Vector2 } from "../math/vector2";
import type { Vector3 } from "../math/vector3";
import type { Camera } from "./camera";

// didnt use this i guess
// remove later
export type Dimension = "2D" | "3D";

/** Backends. */
export enum Backends {
	/** Canvas backend. Uses the Canvas2D API. See: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API */
	CANVAS,
	/** WebGL backend. Uses the WebGL API. See: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API */
	WEBGL,
	/** WebGPU backend (experimental - very new). Uses the WebGPU API. See: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API */
	WEBGPU,
}

/** Render Configurations. */
export interface RenderConfigs {
	/** Backend type. */
	backend: Backends;
	/** Anti Alias (iirc this just means higher quality) */
	antialias?: boolean;
	/** Debug mode. */
	debug?: boolean;
	// todo
	onError?: (error: Error) => void;
	// default(): RenderConfigs;
}

export interface Texture {
	id: string; // or number, maybe number better but decide later
	source: HTMLImageElement | ImageBitmap;
}

export interface Backend {
	clear?(r: number, g: number, b: number, a: number): void;

	createMesh(data: MeshData): Mesh;
	drawMesh(mesh: Mesh, transform: Transform): void;

	resize?(width: number, height: number): void;
	updateView?(camera: Camera): void;
}
