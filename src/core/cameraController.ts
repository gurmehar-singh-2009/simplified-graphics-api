import { PerspectiveCamera } from "./camera";
import { Vector3 } from "../math/vector3";
import { Quaternion } from "../math/quaternion";

const x_axis = new Vector3(1, 0, 0);
const y_axis = new Vector3(0, 1, 0);

// TODO:
// IMPORTANT !!!!!
// check all the math. did it from the best understanding i could pull out of websites and chatgpt

function rotateVector(
	q: Quaternion,
	x: number,
	y: number,
	z: number,
): [number, number, number] {
	const tx = 2 * (q.y * z - q.z * y);
	const ty = 2 * (q.z * x - q.x * z);
	const tz = 2 * (q.x * y - q.y * x);
	return [
		x + q.w * tx + (q.y * tz - q.z * ty),
		y + q.w * ty + (q.z * tx - q.x * tz),
		z + q.w * tz + (q.x * ty - q.y * tx),
	];
}

export interface OrbitCameraControllerOptions {
	target?: Vector3;
	distance?: number;
	yaw?: number;
	pitch?: number;
	minDistance?: number;
	maxDistance?: number;
	minPitch?: number;
	maxPitch?: number;
	rotateSpeed?: number;
	panSpeed?: number;
	zoomSpeed?: number;
}

export class OrbitCameraController {
	public camera: PerspectiveCamera;
	public enabled = true;

	public target: Vector3;
	public distance: number;
	public yaw: number;
	public pitch: number;

	public minDistance: number;
	public maxDistance: number;
	public minPitch: number;
	public maxPitch: number;
	public rotateSpeed: number;
	public panSpeed: number;
	public zoomSpeed: number;

	private dragMode: 0 | 1 | 2 = 0; // 0 = none, 1 = orbit, 2 = pan
	private lastX = 0;
	private lastY = 0;

	constructor(
		camera: PerspectiveCamera,
		options: OrbitCameraControllerOptions = {},
	) {
		this.camera = camera;
		this.target = options.target ?? new Vector3(0, 0, 0);
		this.distance = options.distance ?? 10;
		this.yaw = options.yaw ?? 0;
		this.pitch = options.pitch ?? Math.PI / 6;
		this.minDistance = options.minDistance ?? 0.1;
		this.maxDistance = options.maxDistance ?? 2000;
		this.minPitch = options.minPitch ?? -Math.PI / 2 + 0.01;
		this.maxPitch = options.maxPitch ?? Math.PI / 2 - 0.01;
		this.rotateSpeed = options.rotateSpeed ?? 0.005;
		this.panSpeed = options.panSpeed ?? 0.002;
		this.zoomSpeed = options.zoomSpeed ?? 0.001;
	}

	public attach(element: HTMLElement): this {
		const onPointerDown = (e: PointerEvent) => {
			if (!this.enabled) return;

			// left = orbit, right / middle / shift+left = pan.
			//
			this.dragMode = e.button === 0 && !e.shiftKey ? 1 : 2;
			this.lastX = e.clientX;
			this.lastY = e.clientY;
			element.setPointerCapture(e.pointerId);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!this.enabled || this.dragMode === 0) return;
			const dx = e.clientX - this.lastX;
			const dy = e.clientY - this.lastY;
			this.lastX = e.clientX;
			this.lastY = e.clientY;

			if (this.dragMode === 1) {
				this.yaw -= dx * this.rotateSpeed;
				this.pitch = Math.min(
					this.maxPitch,
					Math.max(this.minPitch, this.pitch + dy * this.rotateSpeed),
				);
			} else {
				this.pan(dx, dy);
			}
		};

		const onPointerUp = () => {
			this.dragMode = 0;
		};

		const onWheel = (e: WheelEvent) => {
			if (!this.enabled) return;
			e.preventDefault();
			this.distance = Math.min(
				this.maxDistance,
				Math.max(
					this.minDistance,
					this.distance * Math.exp(e.deltaY * this.zoomSpeed),
				),
			);
		};

		const onContextMenu = (e: Event) => e.preventDefault();

		element.addEventListener("pointerdown", onPointerDown);
		element.addEventListener("pointermove", onPointerMove);
		element.addEventListener("pointerup", onPointerUp);
		element.addEventListener("wheel", onWheel, { passive: false });
		element.addEventListener("contextmenu", onContextMenu);

		return this;
	}

	public update(_dt = 0): void {
		const cp = Math.cos(this.pitch);
		const ox = cp * Math.sin(this.yaw);
		const oy = Math.sin(this.pitch);
		const oz = cp * Math.cos(this.yaw);

		this.camera.position.x = this.target.x + ox * this.distance;
		this.camera.position.y = this.target.y + oy * this.distance;
		this.camera.position.z = this.target.z + oz * this.distance;

		const qYaw = Quaternion.fromAxisAngle(y_axis, this.yaw, new Quaternion());
		const qPitch = Quaternion.fromAxisAngle(
			x_axis,
			-this.pitch,
			new Quaternion(),
		);
		Quaternion.multiply(qYaw, qPitch, this.camera.rotation);

		this.camera.update();
	}

	private pan(dx: number, dy: number): void {
		const qYaw = Quaternion.fromAxisAngle(y_axis, this.yaw, new Quaternion());
		const qPitch = Quaternion.fromAxisAngle(
			x_axis,
			-this.pitch,
			new Quaternion(),
		);
		const rot = Quaternion.multiply(qYaw, qPitch, new Quaternion());
		const [rx, ry, rz] = rotateVector(rot, 1, 0, 0); // camera right
		const [ux, uy, uz] = rotateVector(rot, 0, 1, 0); // camera up

		const scale = this.distance * this.panSpeed;
		this.target.x += (-rx * dx + ux * dy) * scale;
		this.target.y += (-ry * dx + uy * dy) * scale;
		this.target.z += (-rz * dx + uz * dy) * scale;
	}
}

export interface FPSControllerOptions {
	yaw?: number;
	pitch?: number;
	speed?: number;
	fastMultiplier?: number;
	sensitivity?: number;
}

export class FPSController {
	public camera: PerspectiveCamera;
	public enabled = true;

	public yaw: number;
	public pitch: number;
	public speed: number;
	public fastMultiplier: number;
	public sensitivity: number;

	private keys = new Set<string>();

	constructor(camera: PerspectiveCamera, options: FPSControllerOptions = {}) {
		this.camera = camera;
		this.yaw = options.yaw ?? 0;
		this.pitch = options.pitch ?? 0;
		this.speed = options.speed ?? 5;
		this.fastMultiplier = options.fastMultiplier ?? 4;
		this.sensitivity = options.sensitivity ?? 0.002;
	}

	public attach(element: HTMLElement): this {
		const onPointerDown = (e: PointerEvent) => {
			if (!this.enabled || e.button !== 0) return;
			element.requestPointerLock?.();
		};
		const onMouseMove = (e: MouseEvent) => {
			if (!this.enabled || document.pointerLockElement !== element) return;
			this.yaw -= e.movementX * this.sensitivity;
			this.pitch = Math.max(
				-Math.PI / 2 + 0.001,
				Math.min(
					Math.PI / 2 - 0.001,
					this.pitch - e.movementY * this.sensitivity,
				),
			);
		};
		const onKeyDown = (e: KeyboardEvent) => this.keys.add(e.code);
		const onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.code);
		const onBlur = () => this.keys.clear();

		element.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("mousemove", onMouseMove);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", onBlur);

		return this;
	}

	public update(dt: number): void {
		const dtc = Math.min(dt, 0.1);
		const speed =
			this.speed *
			(this.keys.has("ShiftLeft") || this.keys.has("ShiftRight")
				? this.fastMultiplier
				: 1) *
			dtc;

		const qYaw = Quaternion.fromAxisAngle(y_axis, this.yaw, new Quaternion());
		const qPitch = Quaternion.fromAxisAngle(
			x_axis,
			this.pitch,
			new Quaternion(),
		);
		Quaternion.multiply(qYaw, qPitch, this.camera.rotation);

		const [fx, fy, fz] = this.forward();
		const [rx, , rz] = rotateVector(this.camera.rotation, 1, 0, 0);

		// TODO: add a keybind system so these can change

		const p = this.camera.position;
		if (this.keys.has("KeyW")) {
			p.x += fx * speed;
			p.y += fy * speed;
			p.z += fz * speed;
		}
		if (this.keys.has("KeyS")) {
			p.x -= fx * speed;
			p.y -= fy * speed;
			p.z -= fz * speed;
		}
		if (this.keys.has("KeyA")) {
			p.x -= rx * speed;
			p.z -= rz * speed;
		}
		if (this.keys.has("KeyD")) {
			p.x += rx * speed;
			p.z += rz * speed;
		}

		if (this.keys.has("Space")) p.y += speed;
		if (this.keys.has("KeyC")) p.y -= speed;

		this.camera.update();
	}

	public forward(): [number, number, number] {
		const cp = Math.cos(this.pitch);
		return [
			-cp * Math.sin(this.yaw),
			Math.sin(this.pitch),
			-cp * Math.cos(this.yaw),
		];
	}
}
