import { Matrix4 } from "./matrix";
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class Transform {
	private position: Vector3;
	private rotation: Quaternion;
	private scale: Vector3;

	private matrix: Matrix4 = new Matrix4();
	private isDirty: boolean = false;

	private static readonly tempMatA = new Matrix4();
	private static readonly tempMatB = new Matrix4();
	private static readonly tempMatC = new Matrix4();

	constructor(
		position: Vector3 = new Vector3(0, 0, 0),
		rotation: Quaternion = new Quaternion(0, 0, 0, 1),
		scale: Vector3 = new Vector3(1, 1, 1),
	) {
		this.position = position;
		this.rotation = rotation;
		this.scale = scale;
		this.updateMatrix();
	}

	public get matrix4(): Matrix4 {
		if (this.isDirty) {
			this.updateMatrix();
		}
		return this.matrix;
	}

	public getPosition(out: Vector3 = new Vector3()): Vector3 {
		return out.copy(this.position);
	}

	public getRotation(out: Quaternion = new Quaternion()): Quaternion {
		return out.copy(this.rotation);
	}

	public getScale(out: Vector3 = new Vector3()): Vector3 {
		return out.copy(this.scale);
	}

	public setPosition(v: Vector3): this;
	public setPosition(x: number, y: number, z?: number): this;

	public setPosition(vOrX: Vector3 | number, y?: number, z: number = 0): this {
		if (typeof vOrX === "number") {
			this.position.set(vOrX, y ?? 0, z);
		} else {
			this.position.copy(vOrX);
		}
		this.isDirty = true;
		return this;
	}

	public translate(v: Vector3): this;
	public translate(dx: number, dy: number, dz?: number): this;

	public translate(
		vOrDx: Vector3 | number,
		dy: number = 0,
		dz: number = 0,
	): this {
		if (typeof vOrDx === "number") {
			this.position.x += vOrDx;
			this.position.y += dy;
			this.position.z += dz;
		} else {
			this.position.add(vOrDx);
		}
		this.isDirty = true;
		return this;
	}

	public setRotation(q: Quaternion): this {
		this.rotation.copy(q);
		this.isDirty = true;
		return this;
	}

	public setRotationEuler(
		xInRadians: number,
		yInRadians: number,
		zInRadians: number,
	): this {
		Quaternion.fromEuler(xInRadians, yInRadians, zInRadians, this.rotation);
		this.isDirty = true;
		return this;
	}

	public rotate(delta: Quaternion): this {
		this.rotation.multiply(delta).normalize();
		this.isDirty = true;
		return this;
	}

	public setScale(v: Vector3): this;
	public setScale(x: number, y?: number, z?: number): this;

	public setScale(vOrX: Vector3 | number, y?: number, z: number = 1): this {
		if (typeof vOrX === "number") {
			this.scale.set(vOrX, y ?? vOrX, z);
		} else {
			this.scale.copy(vOrX);
		}
		this.isDirty = true;
		return this;
	}

	public setTriangleTransform(
		vertex1: Vector3,
		vertex2: Vector3,
		vertex3: Vector3
	): this {
		Matrix4.fromTriangle(vertex1, vertex2, vertex3, this.matrix);

		this.isDirty = false;
		return this;
	}

	public markDirty(): void {
		this.isDirty = true;
	}

	public updateMatrix(): void {
		Matrix4.fromVector3(this.position, Transform.tempMatA);

		Matrix4.fromQuaternion(this.rotation, Transform.tempMatB);

		Matrix4.identity(Transform.tempMatC);
		Transform.tempMatC.data[0] = this.scale.x;
		Transform.tempMatC.data[5] = this.scale.y;
		Transform.tempMatC.data[10] = this.scale.z;

		Matrix4.multiply(Transform.tempMatA, Transform.tempMatB, this.matrix);
		Matrix4.multiply(this.matrix, Transform.tempMatC, this.matrix);

		this.isDirty = false;
	}
}
