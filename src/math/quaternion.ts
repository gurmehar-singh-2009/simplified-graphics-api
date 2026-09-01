import { Vector3 } from "./vector3";

export class Quaternion {
	public x: number;
	public y: number;
	public z: number;
	public w: number;

	constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	public set(x: number, y: number, z: number, w: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	public copy(quaternion: Quaternion): this {
		this.x = quaternion.x;
		this.y = quaternion.y;
		this.z = quaternion.z;
		this.w = quaternion.w;
		return this;
	}

	public clone(): Quaternion {
		return new Quaternion(this.x, this.y, this.z, this.w);
	}

	public identity(): this {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.w = 1;
		return this;
	}

	public multiply(quaternion: Quaternion): this {
		return Quaternion.multiply(this, quaternion, this) as this;
	}

	// Multiplication is not commutative so we also need this.
	public premultiply(quaternion: Quaternion): this {
		return Quaternion.multiply(quaternion, this, this) as this;
	}

	public normalize(): this {
		return Quaternion.normalize(this, this) as this;
	}

	public conjugate(): this {
		return Quaternion.conjugate(this, this) as this;
	}

	public invert(): this {
		return Quaternion.invert(this, this) as this;
	}

	public setFromAxisAngle(axis: Vector3, angleRadians: number): this {
		return Quaternion.fromAxisAngle(axis, angleRadians, this) as this;
	}

	public setFromEuler(x: number, y: number, z: number): this {
		return Quaternion.fromEuler(x, y, z, this) as this;
	}

	public magnitude(): number {
		return Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
		);
	}

	public magnitudeSquared(): number {
		return (
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
		);
	}

	public dot(other: Quaternion): number {
		return Quaternion.dot(this, other);
	}

	public equals(other: Quaternion, epsilon: number = 0): boolean {
		return Quaternion.equals(this, other, epsilon);
	}

	public rotateVector3(vector: Vector3, out: Vector3 = new Vector3()): Vector3 {
		return Quaternion.rotateVector3(this, vector, out);
	}

	public static identity(out: Quaternion = new Quaternion()): Quaternion {
		return out.set(0, 0, 0, 1);
	}

	public static multiply(
		a: Quaternion,
		b: Quaternion,
		out: Quaternion = new Quaternion(),
	): Quaternion {
		const ax = a.x;
		const ay = a.y;
		const az = a.z;
		const aw = a.w;
		const bx = b.x;
		const by = b.y;
		const bz = b.z;
		const bw = b.w;

		out.x = aw * bx + ax * bw + ay * bz - az * by;
		out.y = aw * by - ax * bz + ay * bw + az * bx;
		out.z = aw * bz + ax * by - ay * bx + az * bw;
		out.w = aw * bw - ax * bx - ay * by - az * bz;
		return out;
	}

	public static normalize(
		a: Quaternion,
		out: Quaternion = new Quaternion(),
	): Quaternion {
		const magnitudeSq = a.magnitudeSquared();
		if (magnitudeSq > 0) {
			const magnitude = Math.sqrt(magnitudeSq);
			out.x = a.x / magnitude;
			out.y = a.y / magnitude;
			out.z = a.z / magnitude;
			out.w = a.w / magnitude;
		} else {
			out.x = 0;
			out.y = 0;
			out.z = 0;
			out.w = 0;
		}
		return out;
	}

	public static conjugate(
		quaternion: Quaternion,
		out: Quaternion = new Quaternion(),
	): Quaternion {
		out.x = -quaternion.x;
		out.y = -quaternion.y;
		out.z = -quaternion.z;
		out.w = quaternion.w;
		return out;
	}

	public static invert(
		quaternion: Quaternion,
		out: Quaternion = new Quaternion(),
	): Quaternion {
		const magnitudeSq = quaternion.magnitudeSquared();
		if (magnitudeSq > 0) {
			out.x = -quaternion.x / magnitudeSq;
			out.y = -quaternion.y / magnitudeSq;
			out.z = -quaternion.z / magnitudeSq;
			out.w = quaternion.w / magnitudeSq;
		} else {
			out.x = 0;
			out.y = 0;
			out.z = 0;
			out.w = 1;
		}
		return out;
	}

	public static dot(a: Quaternion, b: Quaternion): number {
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
	}

	public static fromAxisAngle(
		axis: Vector3,
		angleRadians: number,
		out: Quaternion = new Quaternion(),
	): Quaternion {
		const halfAngle = angleRadians * 0.5;
		const sinHalfAngle = Math.sin(halfAngle);
		out.x = axis.x * sinHalfAngle;
		out.y = axis.y * sinHalfAngle;
		out.z = axis.z * sinHalfAngle;
		out.w = Math.cos(halfAngle);
		return out;
	}

	public static fromEuler(
		x: number,
		y: number,
		z: number,
		out: Quaternion = new Quaternion(),
	): Quaternion {
		const cosX = Math.cos(x * 0.5);
		const cosY = Math.cos(y * 0.5);
		const cosZ = Math.cos(z * 0.5);
		const sinX = Math.sin(x * 0.5);
		const sinY = Math.sin(y * 0.5);
		const sinZ = Math.sin(z * 0.5);

		out.x = sinX * cosY * cosZ + cosX * sinY * sinZ;
		out.y = cosX * sinY * cosZ - sinX * cosY * sinZ;
		out.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
		out.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
		return out;
	}

	public static rotateVector3(
		quaternion: Quaternion,
		vector: Vector3,
		out: Vector3 = new Vector3(),
	): Vector3 {
		const vx = vector.x;
		const vy = vector.y;
		const vz = vector.z;
		const qx = quaternion.x;
		const qy = quaternion.y;
		const qz = quaternion.z;
		const qw = quaternion.w;

		const intermediateX = qw * vx + qy * vz - qz * vy;
		const intermediateY = qw * vy + qz * vx - qx * vz;
		const intermediateZ = qw * vz + qx * vy - qy * vx;
		const intermediateW = -qx * vx - qy * vy - qz * vz;

		out.x =
			intermediateX * qw +
			intermediateW * -qx +
			intermediateY * -qz -
			intermediateZ * -qy;
		out.y =
			intermediateY * qw +
			intermediateW * -qy +
			intermediateZ * -qx -
			intermediateX * -qz;
		out.z =
			intermediateZ * qw +
			intermediateW * -qz +
			intermediateX * -qy -
			intermediateY * -qx;
		return out;
	}

	public static equals(
		a: Quaternion,
		b: Quaternion,
		epsilon: number = 0,
	): boolean {
		if (epsilon === 0) {
			return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
		}
		return (
			Math.abs(a.x - b.x) <= epsilon &&
			Math.abs(a.y - b.y) <= epsilon &&
			Math.abs(a.z - b.z) <= epsilon &&
			Math.abs(a.w - b.w) <= epsilon
		);
	}
}
