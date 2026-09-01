/**
 * 3th Dimension vector class.
 */
export class Vector3 {
	/** x position */
	public x: number;
	/** y position */
	public y: number;
	/** z position */
	public z: number;

	/**
	 * @param x The x coordinate.
	 * @param y The y coordinate.
	 * @param z The z coordinate.
	 */
	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public set(x: number, y: number, z: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	public copy(v: Vector3): this {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	public clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	// So these are the methods the user usually uses but they internally use the optimized methods
	public add(v: Vector3): this {
		return Vector3.add(this, v, this) as this;
	}

	public subtract(v: Vector3): this {
		return Vector3.subtract(this, v, this) as this;
	}

	public multiply(scalar: number): this {
		return Vector3.multiply(this, scalar, this) as this;
	}

	public divide(scalar: number): this {
		return Vector3.divide(this, scalar, this) as this;
	}

	public negate(): this {
		return Vector3.negate(this, this) as this;
	}

	public normalize(): this {
		return Vector3.normalize(this, this) as this;
	}

	public cross(v: Vector3): this {
		return Vector3.cross(this, v, this) as this;
	}

	public lerp(target: Vector3, t: number): this {
		return Vector3.lerp(this, target, t, this) as this;
	}

	public dot(other: Vector3): number {
		return Vector3.dot(this, other);
	}

	public distanceTo(other: Vector3): number {
		return Vector3.distance(this, other);
	}

	public squaredDistanceTo(other: Vector3): number {
		return Vector3.squaredDistance(this, other);
	}

	public equals(other: Vector3, epsilon: number = 0): boolean {
		return Vector3.equals(this, other, epsilon);
	}

	public angleTo(other: Vector3): number {
		return Vector3.angleBetween(this, other);
	}

	// These are the optimized methods. They only allocate new Vector3 if an existing is not given.
	public static add(
		a: Vector3,
		b: Vector3,
		out: Vector3 = new Vector3(),
	): Vector3 {
		out.x = a.x + b.x;
		out.y = a.y + b.y;
		out.z = a.z + b.z;
		return out;
	}

	public static subtract(
		a: Vector3,
		b: Vector3,
		out: Vector3 = new Vector3(),
	): Vector3 {
		out.x = a.x - b.x;
		out.y = a.y - b.y;
		out.z = a.z - b.z;
		return out;
	}

	public static multiply(
		a: Vector3,
		scalar: number,
		out: Vector3 = new Vector3(),
	): Vector3 {
		out.x = a.x * scalar;
		out.y = a.y * scalar;
		out.z = a.z * scalar;
		return out;
	}

	public static divide(
		a: Vector3,
		scalar: number,
		out: Vector3 = new Vector3(),
	): Vector3 {
		if (scalar === 0) {
			out.x = 0;
			out.y = 0;
			out.z = 0;
		} else {
			out.x = a.x / scalar;
			out.y = a.y / scalar;
			out.z = a.z / scalar;
		}
		return out;
	}

	public static negate(a: Vector3, out: Vector3 = new Vector3()): Vector3 {
		out.x = -a.x;
		out.y = -a.y;
		out.z = -a.z;
		return out;
	}

	public static normalize(a: Vector3, out: Vector3 = new Vector3()): Vector3 {
		const magnitudeSq = a.magnitudeSquared();
		if (magnitudeSq > 0) {
			const magnitude = Math.sqrt(magnitudeSq);
			out.x = a.x / magnitude;
			out.y = a.y / magnitude;
			out.z = a.z / magnitude;
		} else {
			out.x = 0;
			out.y = 0;
			out.z = 0;
		}
		return out;
	}

	// There is no 2D or 4D equavilent to cross product. Weird.
	public static cross(
		a: Vector3,
		b: Vector3,
		out: Vector3 = new Vector3(),
	): Vector3 {
		const ax = a.x;
		const ay = a.y;
		const az = a.z;
		const bx = b.x;
		const by = b.y;
		const bz = b.z;

		out.x = ay * bz - az * by;
		out.y = az * bx - ax * bz;
		out.z = ax * by - ay * bx;
		return out;
	}

	public static lerp(
		a: Vector3,
		b: Vector3,
		t: number,
		out: Vector3 = new Vector3(),
	): Vector3 {
		const ax = a.x;
		const ay = a.y;
		const az = a.z;
		const bx = b.x;
		const by = b.y;
		const bz = b.z;

		out.x = ax + t * (bx - ax);
		out.y = ay + t * (by - ay);
		out.z = az + t * (bz - az);
		return out;
	}

	public magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	public magnitudeSquared(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	public static dot(a: Vector3, b: Vector3): number {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	public static distance(a: Vector3, b: Vector3): number {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const dz = a.z - b.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	public static squaredDistance(a: Vector3, b: Vector3): number {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const dz = a.z - b.z;
		return dx * dx + dy * dy + dz * dz;
	}

	public static angleBetween(a: Vector3, b: Vector3): number {
		const denominator = Math.sqrt(a.magnitudeSquared() * b.magnitudeSquared());

		if (denominator === 0) return 0;

		const theta = Vector3.dot(a, b) / denominator;
		return Math.acos(Math.max(-1, Math.min(1, theta)));
	}

	public static equals(a: Vector3, b: Vector3, epsilon: number = 0): boolean {
		if (epsilon === 0) {
			return a.x === b.x && a.y === b.y && a.z === b.z;
		}
		return (
			Math.abs(a.x - b.x) <= epsilon &&
			Math.abs(a.y - b.y) <= epsilon &&
			Math.abs(a.z - b.z) <= epsilon
		);
	}
}
