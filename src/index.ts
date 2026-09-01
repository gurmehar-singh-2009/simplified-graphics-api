// export * from "./core/engine";
// export * from "./core/renderer";
// export * from "./core/renderEvents";
// export * from "./core/camera";
// export * from "./core/cameraController";
// export * from "./math/vector2";
// export * from "./math/vector3";
// export * from "./math/quaternion";
// export * from "./math/matrix";
// export * from "./math/util";
// export * from "./graphics/mesh";

import { MeshBuilder } from "./graphics/mesh";
import { OrthographicCamera, PerspectiveCamera } from "./core/camera";
import { Engine } from "./core/engine";
import { Backends } from "./core/renderer";
import { Transform } from "./math/transform";
import { Vector3 } from "./math/vector3";
import { Quaternion } from "./math/quaternion";

let canvas = document.createElement("canvas");
document.body.appendChild(canvas);

let engine = new Engine(canvas, { backend: Backends.WEBGL });

let myMesh = engine.createMesh(MeshBuilder.Box(1, 1, 1));
let myTransform = new Transform();

engine.start();

window.addEventListener("resize", () => {
	engine.resize(window.innerWidth, window.innerHeight);
});

engine.resize(window.innerWidth, window.innerHeight);

let cam = new PerspectiveCamera();

engine.setCamera(cam);

engine.onFrame = (renderer, timestamp, delta) => {
	renderer.clear(0, 0, 0, 1);

	myTransform.setPosition(Math.sin(timestamp / 200) * 3, 0, -5);
	myTransform.setScale(new Vector3(1, 1, 1));

	renderer.drawMesh(myMesh, myTransform);
};
