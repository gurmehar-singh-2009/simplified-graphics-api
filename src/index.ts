// export stuff so the user can actually use it.
// todo: remove stuff they shouldnt have access to.

export { CanvasBackend } from "./core/backends/canvas";
export { WebGLBackend } from "./core/backends/webgl";
export { WebGPUBackend } from "./core/backends/webgpu";
export * as Commands from "./core/commands";
export { Engine } from "./core/engine";
export type { RenderEvent } from "./core/renderEvents";
export type { Backend, RenderConfigs, Texture } from "./core/renderer";
export { Backends } from "./core/renderer";
export type { Vector2 } from "./math/vector2";