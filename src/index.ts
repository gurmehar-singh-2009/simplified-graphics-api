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



// For quick testing
import { Engine } from "./core/engine";
import { Backends } from "./core/renderer";
import { Vector2 } from "./math/vector2";
import { PerspectiveCamera, OrthographicCamera } from "./core/camera";
import { Vector3 } from "./math/vector3";
import { Quaternion } from "./math/quaternion";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const engine = new Engine(canvas, {
    backend: Backends.WEBGL,
    antialias: false,
});

window.addEventListener("resize", () => {
    engine.resize(window.innerWidth, window.innerHeight);
});

engine.resize(window.innerWidth, window.innerHeight);

engine.start();

let cam = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000, new Vector3(0, 0, 100));
engine.setCamera(cam);

let prev = 0;

engine.onFrame = (renderer, timestamp) => {
    renderer.clear(200, 200, 200, 1);

    renderer.setColor(255, 0, 0, 1);
    renderer.drawRect(0, 0, 50, 50);

    renderer.setColor(0, 0, 255, 1);
    renderer.drawRect(-50, -50, 50, 50);

    prev = timestamp;
};