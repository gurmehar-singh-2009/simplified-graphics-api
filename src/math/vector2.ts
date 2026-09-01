/**
 * 2th Dimension vector class.
 */
export class Vector2 {
	/** x position */
	public x: number;
	/** y position */
	public y: number;

	/**
	 * @param x The x coordinate.
	 * @param y The y coordinate.
	 */
	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	public set(x: number, y: number, z: number): this {
		this.x = x;
		this.y = y;
		return this;
	}

	public copy(v: Vector2): this {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	// So these are the methods the user usually uses but they internally use the optimized methods
	public add(v: Vector2): this {
		return Vector2.add(this, v, this) as this;
	}

	public subtract(v: Vector2): this {
		return Vector2.subtract(this, v, this) as this;
	}

	public multiply(scalar: number): this {
		return Vector2.multiply(this, scalar, this) as this;
	}

	public divide(scalar: number): this {
		return Vector2.divide(this, scalar, this) as this;
	}

	public negate(): this {
		return Vector2.negate(this, this) as this;
	}

	public normalize(): this {
		return Vector2.normalize(this, this) as this;
	}

	public lerp(target: Vector2, t: number): this {
		return Vector2.lerp(this, target, t, this) as this;
	}

	public dot(other: Vector2): number {
		return Vector2.dot(this, other);
	}

	public distanceTo(other: Vector2): number {
		return Vector2.distance(this, other);
	}

	public squaredDistanceTo(other: Vector2): number {
		return Vector2.squaredDistance(this, other);
	}

	public equals(other: Vector2, epsilon: number = 0): boolean {
		return Vector2.equals(this, other, epsilon);
	}

	public angleTo(other: Vector2): number {
		return Vector2.angleBetween(this, other);
	}

	// These are the optimized methods. They only allocate new Vector2 if an existing is not given.
	public static add(
		a: Vector2,
		b: Vector2,
		out: Vector2 = new Vector2(),
	): Vector2 {
		out.x = a.x + b.x;
		out.y = a.y + b.y;
		return out;
	}

	public static subtract(
		a: Vector2,
		b: Vector2,
		out: Vector2 = new Vector2(),
	): Vector2 {
		out.x = a.x - b.x;
		out.y = a.y - b.y;
		return out;
	}

	public static multiply(
		a: Vector2,
		scalar: number,
		out: Vector2 = new Vector2(),
	): Vector2 {
		out.x = a.x * scalar;
		out.y = a.y * scalar;
		return out;
	}

	public static divide(
		a: Vector2,
		scalar: number,
		out: Vector2 = new Vector2(),
	): Vector2 {
		if (scalar === 0) {
			out.x = 0;
			out.y = 0;
		} else {
			out.x = a.x / scalar;
			out.y = a.y / scalar;
		}
		return out;
	}

	public static negate(a: Vector2, out: Vector2 = new Vector2()): Vector2 {
		out.x = -a.x;
		out.y = -a.y;
		return out;
	}

	public static normalize(a: Vector2, out: Vector2 = new Vector2()): Vector2 {
		const magnitudeSq = a.magnitudeSquared();
		if (magnitudeSq > 0) {
			const magnitude = Math.sqrt(magnitudeSq);
			out.x = a.x / magnitude;
			out.y = a.y / magnitude;
		} else {
			out.x = 0;
			out.y = 0;
		}
		return out;
	}

	public static lerp(
		a: Vector2,
		b: Vector2,
		t: number,
		out: Vector2 = new Vector2(),
	): Vector2 {
		const ax = a.x;
		const ay = a.y;
		const bx = b.x;
		const by = b.y;

		out.x = ax + t * (bx - ax);
		out.y = ay + t * (by - ay);
		return out;
	}

	public magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	public magnitudeSquared(): number {
		return this.x * this.x + this.y * this.y;
	}

	public static dot(a: Vector2, b: Vector2): number {
		return a.x * b.x + a.y * b.y;
	}

	public static distance(a: Vector2, b: Vector2): number {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	public static squaredDistance(a: Vector2, b: Vector2): number {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		return dx * dx + dy * dy;
	}

	public static angleBetween(a: Vector2, b: Vector2): number {
		const denominator = Math.sqrt(a.magnitudeSquared() * b.magnitudeSquared());

		if (denominator === 0) return 0;

		const theta = Vector2.dot(a, b) / denominator;
		return Math.acos(Math.max(-1, Math.min(1, theta)));
	}

	public static equals(a: Vector2, b: Vector2, epsilon: number = 0): boolean {
		if (epsilon === 0) {
			return a.x === b.x && a.y === b.y;
		}
		return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
	}
}
