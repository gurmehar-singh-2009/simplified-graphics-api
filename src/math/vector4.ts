/**
 * 4th Dimension vector class.
 */
export class Vector4 {
	/** x position */
	public x: number;
	/** y position */
	public y: number;
	/** z position */
	public z: number;
	/** w position */
	public w: number;

	/**
	 * @param x The x coordinate.
	 * @param y The y coordinate.
	 * @param z The z coordinate.
	 * @param w The w coordinate.
	 */
	constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
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

	public copy(v: Vector4): this {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
		return this;
	}

	public clone(): Vector4 {
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	// So these are the methods the user usually uses but they internally use the optimized methods
	public add(v: Vector4): this {
		return Vector4.add(this, v, this) as this;
	}

	public subtract(v: Vector4): this {
		return Vector4.subtract(this, v, this) as this;
	}

	public multiply(scalar: number): this {
		return Vector4.multiply(this, scalar, this) as this;
	}

	public divide(scalar: number): this {
		return Vector4.divide(this, scalar, this) as this;
	}

	public negate(): this {
		return Vector4.negate(this, this) as this;
	}

	public normalize(): this {
		return Vector4.normalize(this, this) as this;
	}

	public lerp(target: Vector4, t: number): this {
		return Vector4.lerp(this, target, t, this) as this;
	}

	public dot(other: Vector4): number {
		return Vector4.dot(this, other);
	}

	public distanceTo(other: Vector4): number {
		return Vector4.distance(this, other);
	}

	public squaredDistanceTo(other: Vector4): number {
		return Vector4.squaredDistance(this, other);
	}

	public equals(other: Vector4, epsilon: number = 0): boolean {
		return Vector4.equals(this, other, epsilon);
	}

	public angleTo(other: Vector4): number {
		return Vector4.angleBetween(this, other);
	}

	// These are the optimized methods. They only allocate new Vector4 if an existing is not given.
	public static add(
		a: Vector4,
		b: Vector4,
		out: Vector4 = new Vector4(),
	): Vector4 {
		out.x = a.x + b.x;
		out.y = a.y + b.y;
		out.z = a.z + b.z;
		out.w = a.w + b.w;
		return out;
	}

	public static subtract(
		a: Vector4,
		b: Vector4,
		out: Vector4 = new Vector4(),
	): Vector4 {
		out.x = a.x - b.x;
		out.y = a.y - b.y;
		out.z = a.z - b.z;
		out.w = a.w - b.w;
		return out;
	}

	public static multiply(
		a: Vector4,
		scalar: number,
		out: Vector4 = new Vector4(),
	): Vector4 {
		out.x = a.x * scalar;
		out.y = a.y * scalar;
		out.z = a.z * scalar;
		out.w = a.w * scalar;
		return out;
	}

	public static divide(
		a: Vector4,
		scalar: number,
		out: Vector4 = new Vector4(),
	): Vector4 {
		if (scalar === 0) {
			out.x = 0;
			out.y = 0;
			out.z = 0;
			out.w = 0;
		} else {
			out.x = a.x / scalar;
			out.y = a.y / scalar;
			out.z = a.z / scalar;
			out.w = a.w / scalar;
		}
		return out;
	}

	public static negate(a: Vector4, out: Vector4 = new Vector4()): Vector4 {
		out.x = -a.x;
		out.y = -a.y;
		out.z = -a.z;
		out.w = -a.w;
		return out;
	}

	public static normalize(a: Vector4, out: Vector4 = new Vector4()): Vector4 {
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

	public static lerp(
		a: Vector4,
		b: Vector4,
		t: number,
		out: Vector4 = new Vector4(),
	): Vector4 {
		const ax = a.x;
		const ay = a.y;
		const az = a.z;
		const aw = a.w;
		const bx = b.x;
		const by = b.y;
		const bz = b.z;
		const bw = b.w;

		out.x = ax + t * (bx - ax);
		out.y = ay + t * (by - ay);
		out.z = az + t * (bz - az);
		out.w = aw + t * (bw - aw);
		return out;
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

	public static dot(a: Vector4, b: Vector4): number {
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
	}

	public static distance(a: Vector4, b: Vector4): number {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const dz = a.z - b.z;
		const dw = a.w - b.w;
		return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
	}

	public static squaredDistance(a: Vector4, b: Vector4): number {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const dz = a.z - b.z;
		const dw = a.w - b.w;
		return dx * dx + dy * dy + dz * dz + dw * dw;
	}

	public static angleBetween(a: Vector4, b: Vector4): number {
		const denominator = Math.sqrt(a.magnitudeSquared() * b.magnitudeSquared());

		if (denominator === 0) return 0;

		const theta = Vector4.dot(a, b) / denominator;
		return Math.acos(Math.max(-1, Math.min(1, theta)));
	}

	public static equals(a: Vector4, b: Vector4, epsilon: number = 0): boolean {
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
