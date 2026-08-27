import { Engine } from "./core/engine";
import { Backends } from "./core/renderer";
import { PerspectiveCamera } from "./core/camera";
import { MeshBuilder } from "./graphics/mesh";
import { OrbitCameraController, FPSController } from "./core/cameraController";
import { Vector3 } from "./math/vector3";
import { Quaternion } from "./math/quaternion";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const engine = new Engine(canvas, {
	backend: Backends.WEBGPU,
  antialias: true,
	// debug: true, // DONT USE DEBUG ON WEBGPU ITS RENDERING IN THE 3D WORLD I NEED TO FIX THIS
});

const cam = new PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1,
	2000,
);

const onResize = () => {
	engine.resize(window.innerWidth, window.innerHeight);
	cam.aspectRatio = window.innerWidth / window.innerHeight;
	cam.updateProjectionMatrix();
};

window.addEventListener("resize", onResize);
onResize();

engine.start();

// so like
// meshes are only uploaded once
// and ids are user controlled
engine.createMesh(0, MeshBuilder.plane(400, 400)); // ground
engine.createMesh(1, MeshBuilder.box(2, 2, 2));
engine.createMesh(2, MeshBuilder.sphere(1.25, 32, 16));
engine.createMesh(3, MeshBuilder.cylinder(1, 3, 32));

// camera!!! using orbital for default since its nice and pretty intuitive
const orbit = new OrbitCameraController(cam, {
	distance: 16,
	pitch: 0.5,
	yaw: 0.7,
}).attach(canvas);

// click to lock, wasd to move, space/c = up/down, shift = go vrooom
const fps = new FPSController(cam, { speed: 10 }).attach(canvas);
fps.enabled = false;

// added simple rotating system to demo
let mode: "orbit" | "fps" = "orbit";
window.addEventListener("keydown", (e) => {
	if (e.code !== "Tab" || e.repeat) return;
	e.preventDefault();
	mode = mode === "orbit" ? "fps" : "orbit";
	orbit.enabled = mode === "orbit";
	fps.enabled = mode === "fps";

	if (mode === "fps") {
		fps.yaw = orbit.yaw;
		fps.pitch = -orbit.pitch;
	} else {
		orbit.yaw = fps.yaw;
    orbit.pitch = -fps.pitch;

		const f = fps.forward();
		orbit.target = new Vector3(
			cam.position.x + f[0] * orbit.distance,
			cam.position.y + f[1] * orbit.distance,
			cam.position.z + f[2] * orbit.distance,
    );

		document.exitPointerLock?.();
	}
});

engine.onFrame = (renderer, timestamp, delta) => {
	if (mode === "orbit") orbit.update(delta / 1000);
	else fps.update(delta / 1000);

	renderer.setCamera(cam);
  renderer.clear(20, 20, 25, 1);

	const t = timestamp / 1000;

	// so these are our 3d meshes
	renderer.setColor(90, 105, 90, 1);
	renderer.drawMesh(0, new Vector3(0, 0, 0)); // ground

	renderer.setColor(217, 235, 52, 1);
	renderer.drawMesh(1, new Vector3(-4, 1, 0));

	renderer.setColor(235, 64, 52, 1);
	const spin = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), t);
	renderer.drawMesh(
		1,
		new Vector3(0, 1 + Math.sin(t) * 0.5, 0),
		spin,
		new Vector3(1.5, 1.5, 1.5),
	);

	renderer.setColor(77, 143, 217, 1);
	renderer.drawMesh(2, new Vector3(4, 1.5, 0));

	renderer.setColor(217, 149, 52, 1);
	renderer.drawMesh(3, new Vector3(0, 1.5, -5));

	// but 2d still works!!!
	renderer.setColor(255, 255, 255, 1);
	renderer.setDepth(-3);
	renderer.drawText(-4, 4, "3D meshes + 2D text, one scene", 2, 1);
};
