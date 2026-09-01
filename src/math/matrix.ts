import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class Matrix4 {
	public data: Float32Array = new Float32Array(16);

	private static readonly identityData = new Float32Array([
		1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
	]);

	private static readonly tempVector1 = new Vector3();
	private static readonly tempVector2 = new Vector3();
	private static readonly tempVector3 = new Vector3();

	constructor(elements?: Float32Array | number[]) {
		if (elements) {
			this.data.set(elements);
		} else {
			this.identity();
		}
	}

	public identity(): this {
		this.data.set(Matrix4.identityData);
		return this;
	}

	public copy(m: Matrix4): this {
		this.data.set(m.data);
		return this;
	}

	public clone(): Matrix4 {
		return new Matrix4(this.data);
	}

	public static identity(out = new Matrix4()): Matrix4 {
		out.identity();
		return out;
	}

	public set(
		m00: number,
		m01: number,
		m02: number,
		m03: number,
		m10: number,
		m11: number,
		m12: number,
		m13: number,
		m20: number,
		m21: number,
		m22: number,
		m23: number,
		m30: number,
		m31: number,
		m32: number,
		m33: number,
	): this {
		const outData = this.data;
		outData[0] = m00;
		outData[1] = m01;
		outData[2] = m02;
		outData[3] = m03;
		outData[4] = m10;
		outData[5] = m11;
		outData[6] = m12;
		outData[7] = m13;
		outData[8] = m20;
		outData[9] = m21;
		outData[10] = m22;
		outData[11] = m23;
		outData[12] = m30;
		outData[13] = m31;
		outData[14] = m32;
		outData[15] = m33;
		return this;
	}

	public multiply(m: Matrix4): this {
		return Matrix4.multiply(this, m, this) as this;
	}

	public premultiply(m: Matrix4): this {
		return Matrix4.multiply(m, this, this) as this;
	}

	public static multiply(
		a: Matrix4,
		b: Matrix4,
		out: Matrix4 = new Matrix4(),
	): Matrix4 {
		let outData = out.data;

		const aData = a.data;
		const bData = b.data;

		const a00 = aData[0]!;
		const a01 = aData[1]!;
		const a02 = aData[2]!;
		const a03 = aData[3]!;
		const a10 = aData[4]!;
		const a11 = aData[5]!;
		const a12 = aData[6]!;
		const a13 = aData[7]!;
		const a20 = aData[8]!;
		const a21 = aData[9]!;
		const a22 = aData[10]!;
		const a23 = aData[11]!;
		const a30 = aData[12]!;
		const a31 = aData[13]!;
		const a32 = aData[14]!;
		const a33 = aData[15]!;

		const b00 = bData[0]!;
		const b01 = bData[1]!;
		const b02 = bData[2]!;
		const b03 = bData[3]!;
		const b10 = bData[4]!;
		const b11 = bData[5]!;
		const b12 = bData[6]!;
		const b13 = bData[7]!;
		const b20 = bData[8]!;
		const b21 = bData[9]!;
		const b22 = bData[10]!;
		const b23 = bData[11]!;
		const b30 = bData[12]!;
		const b31 = bData[13]!;
		const b32 = bData[14]!;
		const b33 = bData[15]!;

		// Column 0
		outData[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
		outData[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
		outData[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
		outData[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;

		// Column 1
		outData[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
		outData[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
		outData[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
		outData[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;

		// Column 2
		outData[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
		outData[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
		outData[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
		outData[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;

		// Column 3
		outData[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
		outData[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
		outData[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
		outData[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

		return out;
	}

	public static transformDirection(
		m: Matrix4,
		v: Vector3,
		out: Vector3 = new Vector3(),
	): Vector3 {
		const x = v.x;
		const y = v.y;
		const z = v.z;
		const e = m.data;

		out.x = e[0]! * x + e[4]! * y + e[8]! * z;
		out.y = e[1]! * x + e[5]! * y + e[9]! * z;
		out.z = e[2]! * x + e[6]! * y + e[10]! * z;

		return out.normalize();
	}

	public static fromQuaternion(
		q: Quaternion,
		out: Matrix4 = new Matrix4(),
	): Matrix4 {
		q.normalize();

		const x = q.x;
		const y = q.y;
		const z = q.z;
		const w = q.w;

		const twoX = x + x;
		const twoY = y + y;
		const twoZ = z + z;

		const twoWX = w * twoX;
		const twoWY = w * twoY;
		const twoWZ = w * twoZ;
		const twoXX = x * twoX;
		const twoXY = x * twoY;
		const twoXZ = x * twoZ;
		const twoYY = y * twoY;
		const twoYZ = y * twoZ;
		const twoZZ = z * twoZ;

		let outData = out.data;

		// Column 0
		outData[0] = 1 - twoYY - twoZZ;
		outData[1] = twoXY + twoWZ;
		outData[2] = twoXZ - twoWY;
		outData[3] = 0;

		// Column 1
		outData[4] = twoXY - twoWZ;
		outData[5] = 1 - twoXX - twoZZ;
		outData[6] = twoYZ + twoWX;
		outData[7] = 0;

		// Column 2
		outData[8] = twoXZ + twoWY;
		outData[9] = twoYZ - twoWX;
		outData[10] = 1 - twoXX - twoYY;
		outData[11] = 0;

		// Column 3
		outData[12] = 0;
		outData[13] = 0;
		outData[14] = 0;
		outData[15] = 1;

		return out;
	}

	public static fromVector3(v: Vector3, out: Matrix4 = new Matrix4()): Matrix4 {
		const x = v.x;
		const y = v.y;
		const z = v.z;

		let outData = out.data;

		// Column 0
		outData[0] = 1;
		outData[1] = 0;
		outData[2] = 0;
		outData[3] = 0;

		// Column 1
		outData[4] = 0;
		outData[5] = 1;
		outData[6] = 0;
		outData[7] = 0;

		// Column 2
		outData[8] = 0;
		outData[9] = 0;
		outData[10] = 1;
		outData[11] = 0;

		// Column 3
		outData[12] = x;
		outData[13] = y;
		outData[14] = z;
		outData[15] = 1;

		return out;
	}

	public static getPerspectiveMatrix(
		fov: number,
		aspectRatio: number,
		near: number,
		far: number,
		out: Matrix4 = new Matrix4(),
	): Matrix4 {
		if (near <= 0 || near === far) {
			console.warn("Invalid near/far values.");
			return out;
		}

		let outData = out.data;

		const f = 1.0 / Math.tan((fov * Math.PI) / 360);
		const rangeInverse = 1.0 / (near - far);

		// Column 0
		outData[0] = f / aspectRatio;
		outData[1] = 0;
		outData[2] = 0;
		outData[3] = 0;

		// Column 1
		outData[4] = 0;
		outData[5] = f;
		outData[6] = 0;
		outData[7] = 0;

		// Column 2
		outData[8] = 0;
		outData[9] = 0;
		outData[10] = (far + near) * rangeInverse;
		outData[11] = -1;

		// Column 3
		outData[12] = 0;
		outData[13] = 0;
		outData[14] = 2 * far * near * rangeInverse;
		outData[15] = 0;

		return out;
	}

	public static getOrthographicMatrix(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number = -1,
		far: number = 1,
		out: Matrix4 = new Matrix4(),
	): Matrix4 {
		if (left === right) {
			console.warn("Invalid left/right values.");
			return out;
		}
		if (bottom === top) {
			console.warn("Invalid bottom/top values.");
			return out;
		}
		if (near === far) {
			console.warn("Invalid near/far values.");
			return out;
		}

		const inverseLeftRight = 1 / (left - right);
		const inverseBottomTop = 1 / (bottom - top);
		const inverseNearFar = 1 / (near - far);
		let outData = out.data;

		// Column 0
		outData[0] = -2 * inverseLeftRight;
		outData[1] = 0;
		outData[2] = 0;
		outData[3] = 0;

		// Column 1
		outData[4] = 0;
		outData[5] = -2 * inverseBottomTop;
		outData[6] = 0;
		outData[7] = 0;

		// Column 2
		outData[8] = 0;
		outData[9] = 0;
		outData[10] = 2 * inverseNearFar;
		outData[11] = 0;

		// Column 3
		outData[12] = (left + right) * inverseLeftRight;
		outData[13] = (top + bottom) * inverseBottomTop;
		outData[14] = (far + near) * inverseNearFar;
		outData[15] = 1;

		return out;
	}

	public static equals(a: Matrix4, b: Matrix4, epsilon: number = 0): boolean {
		const ae = a.data;
		const be = b.data;

		if (epsilon === 0) {
			for (let i = 0; i < 16; i++) {
				if (ae[i]! !== be[i]!) return false;
			}
			return true;
		}

		for (let i = 0; i < 16; i++) {
			if (Math.abs(ae[i]! - be[i]!) > epsilon) return false;
		}
		return true;
	}
}
