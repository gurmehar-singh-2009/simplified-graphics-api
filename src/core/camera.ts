import { Vector3 } from "../math/vector3";
import { Quaternion } from "../math/quaternion";
import { Matrix4 } from "../math/matrix";

export interface Camera {
	position: Vector3;
	rotation: Quaternion;
	projectionMatrix: Matrix4;
	viewMatrix: Matrix4;
	viewProjectionMatrix: Matrix4;

	// setPosition(position: Vector3): void;
	// setRotation(rotation: Quaternion): void;
	// translate(offset: Vector3): void;
	// rotate(rotationDelta: Quaternion): void;
	// lookAt(target: Vector3, up?: Vector3): void;

	// getForward(): Vector3;
	// getRight(): Vector3;
	// getUp(): Vector3;

	resize(width: number, height: number): void;

	onUpdateView(): void;
}

export class PerspectiveCamera implements Camera {
	public position: Vector3;
	public rotation: Quaternion;

	public fov: number;
	public aspectRatio: number;

	public near: number;
	public far: number;

	public projectionMatrix = new Matrix4();
	public viewMatrix = new Matrix4();
	public viewProjectionMatrix = new Matrix4();

	public onUpdateView = () => {};

	constructor(
		fov: number = 60,
		aspectRatio: number = 16 / 9,
		near: number = 0.1,
		far: number = 10000,
		position: Vector3 = new Vector3(0, 0, 0),
		rotation: Quaternion = Quaternion.identity(),
	) {
		this.fov = fov;
		this.aspectRatio = aspectRatio;
		this.near = near;
		this.far = far;

		this.position = position;
		this.rotation = rotation;

		this.updateProjectionMatrix();
		this.updateViewMatrix();
		this.updateViewProjectionMatrix();

		this.onUpdateView();
	}

	public resize(width: number, height: number): void {
		this.aspectRatio = width / height;

		this.updateProjectionMatrix();
		this.updateViewProjectionMatrix();

		this.onUpdateView();
	}

	public updateProjectionMatrix(): void {
		Matrix4.getPerspectiveMatrix(
			this.fov,
			this.aspectRatio,
			this.near,
			this.far,
			this.projectionMatrix,
		);
	}

	private updateViewMatrix(): void {
		const conjugateRotation = this.rotation.conjugate();
		const rotationMatrix = Matrix4.fromQuaternion(conjugateRotation);

		const translationMatrix = new Matrix4();
		translationMatrix.data[12] = -this.position.x;
		translationMatrix.data[13] = -this.position.y;
		translationMatrix.data[14] = -this.position.z;

		Matrix4.multiply(rotationMatrix, translationMatrix, this.viewMatrix);
	}

	private updateViewProjectionMatrix(): void {
		Matrix4.multiply(
			this.projectionMatrix,
			this.viewMatrix,
			this.viewProjectionMatrix,
		);
	}
}

export class OrthographicCamera implements Camera {
	public position: Vector3;
	public rotation: Quaternion;

	public viewHeight: number;

	public left: number;
	public right: number;
	public top: number;
	public bottom: number;
	public near: number;
	public far: number;

	public projectionMatrix = new Matrix4();
	public viewMatrix = new Matrix4();
	public viewProjectionMatrix = new Matrix4();

	public onUpdateView = () => {};

	constructor(
		viewHeight: number = 10,
		aspectRatio: number = 16 / 9,
		near: number = -10000,
		far: number = 10000,
		position: Vector3 = new Vector3(0, 0, 0),
		rotation: Quaternion = Quaternion.identity(),
	) {
		this.viewHeight = viewHeight;

		this.left = (-this.viewHeight * aspectRatio) / 2;
		this.right = (this.viewHeight * aspectRatio) / 2;
		this.top = this.viewHeight / 2;
		this.bottom = -this.viewHeight / 2;
		this.near = near;
		this.far = far;

		this.position = position;
		this.rotation = rotation;

		this.updateProjectionMatrix();
		this.updateViewMatrix();
		this.updateViewProjectionMatrix();
	}

	resize(width: number, height: number): void {
		const aspectRatio = width / height;
		this.left = (-this.viewHeight * aspectRatio) / 2;
		this.right = (this.viewHeight * aspectRatio) / 2;
		this.top = this.viewHeight / 2;
		this.bottom = -this.viewHeight / 2;

		this.updateProjectionMatrix();
		this.updateViewProjectionMatrix();

		this.onUpdateView();
	}

	private updateProjectionMatrix(): void {
		Matrix4.getOrthographicMatrix(
			this.left,
			this.right,
			this.bottom,
			this.top,
			this.near,
			this.far,
			this.projectionMatrix,
		);
	}

	private updateViewMatrix(): void {
		const conjugateRotation = this.rotation.conjugate();
		const rotationMatrix = Matrix4.fromQuaternion(conjugateRotation);

		const translationMatrix = new Matrix4();
		translationMatrix.data[12] = -this.position.x;
		translationMatrix.data[13] = -this.position.y;
		translationMatrix.data[14] = -this.position.z;

		Matrix4.multiply(rotationMatrix, translationMatrix, this.viewMatrix);
	}

	public updateViewProjectionMatrix(): void {
		Matrix4.multiply(
			this.projectionMatrix,
			this.viewMatrix,
			this.viewProjectionMatrix,
		);
	}
}
