export { Engine } from "./core/Engine";
export { Backends } from "./core/Renderer";
export type { RenderConfigs, Backend, Texture } from "./core/Renderer";
export type { RenderEvent } from "./core/RenderEvent";
export type { Vector2 } from "./math/Vector2";

export { CanvasBackend } from "./core/backends/Canvas";
export { WebGPUBackend } from "./core/backends/WebGPU";

export * as Commands from "./core/Commands";

// const canvas = document.createElement("canvas");
// document.body.appendChild(canvas);

// const engine = new Engine(canvas, {
// 	backend: Backends.CANVAS,
// 	antialias: false,
// });

// console.log(engine);

// engine.start();

// engine.onRender = (e) => {
// 	e.clear();

// 	e.set2DColor(255, 0, 0, 1);
// 	e.drawSquare(40, 40, 20, 20);

// 	e.set2DColor(255, 0, 0, 0.3);
// 	e.drawSquare(0, 0, 20, 20);

// 	e.set2DColor(0, 0, 255, 0.2);
// 	e.drawSquare(0, 0, 20, 20);

// 	e.set2DColor(0, 255, 0, 1);
// 	e.drawTriangle(80, 80, 100, 100, 0, 100);

// 	e.set2DColor(0, 0, 255, 1);
// 	e.drawOctogon(180, 60, 25);

// 	e.set2DColor(0, 0, 0, 1);
// 	e.drawPentagon(250, 200, 40);

// 	e.draw();
// };
