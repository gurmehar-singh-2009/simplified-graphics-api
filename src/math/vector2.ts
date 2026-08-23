/**
 * 2nd Dimension vector class.
 */
export class Vector2 {
	/** x position */
	public x: number;
	/** y position */
	public y: number;

	/**
	 * Constructor. I mean what else is this?
	 * @param x The x coordinate.
	 * @param y The y coordinate.
	 */
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Add this vector with another vector. Returns the result.
	 * @param other The other vector.
	 * @returns The result of the addition operation conducted on the vectors.
	 */
	public add(other: Vector2): Vector2 {
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	/**
	 * Subtract this vector with another vector. Returns the result.
	 * @param other The other vector.
	 * @returns The result of the subtraction operation conducted on the vectors.
	 */
	public sub(other: Vector2): Vector2 {
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	/**
	 * Scale this vector using a scalar.
	 * @param other The scalar value.
	 * @returns The scaled vector.
	 */
	public mul(scalar: number): Vector2 {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	/**
	 * Returns the magnitude of the vector (length).
	 * @returns The magnitude of the vector.
	 */
	public mag(): number {
		return Math.sqrt(this.mag_squared());
	}

	/**
	 * Returns the squared magnitude of the vector. Useful for performance optimization as it avoids the `Math.sqrt` call.
	 * @returns The squared magnitude of the vector.
	 */
	public mag_squared(): number {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * Clones the vector...
	 * @returns The clone of the vector.
	 */
	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	/**
	 * Normalize the vector (makes its length 1, while preserving direction).
	 * @returns The normalized vector.
	 */
	public normalize(): Vector2 {
		const mag = this.mag();

		if (mag === 0) return Vector2.ZERO;

		return this.mul(1 / mag);
	}

	/**
	 * Returns the dot product with another vector.
	 * @param other The other vector.
	 * @returns The dot product result.
	 */
	public dot(other: Vector2): number {
		return this.x * other.x + this.y * other.y;
	}

	/**
	 * Calculate the distance to another vector.
	 * @param other The other vector.
	 * @returns The euclidean distance.
	 */
	public distanceTo(other: Vector2): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;

		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * Calculate the squared distance to another vector. Useful for optimization as it avoids the `Math.sqrt` call.
	 * @param other The other vector.
	 * @returns The squared euclidean distance.
	 */
	public squaredDistanceTo(other: Vector2): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;

		return dx * dx + dy * dy;
	}

	/**
	 * Checks if this vector is equal to another vector.
	 * @param other The other vector.
	 * @returns Whether they are equal or not.
	 */
	public equals(other: Vector2): boolean {
		return this.x === other.x && this.y === other.y;
	}

	/**
	 * Returns the angle of the vector based on (0, 0).
	 * @returns The angle of the vector.
	 */
	public angle(): number {
		return Math.atan2(this.y, this.x);
	}

	/**
	 * Returns the angle, in radians, between this vector and another vector.
	 * @param other The other vector.
	 * @returns The angle, in radians, between this vector and another vector.
	 */
	public angleBetween(other: Vector2): number {
		const denominator = Math.sqrt(this.mag_squared() * other.mag_squared());

		if (denominator === 0) return 0;

		const theta = this.dot(other) / denominator;
		return Math.acos(Math.max(-1, Math.min(1, theta)));
	}

	/**
	 * Rotates a vector.
	 * @param angleRadians The angle to rotate it by CW, in radians.
	 * @returns The new rotated vector.
	 */
	public rotate(angleRadians: number): Vector2 {
		const cos = Math.cos(angleRadians);
		const sin = Math.sin(angleRadians);

		return new Vector2(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos,
		);
	}

	public static get ZERO(): Vector2 {
		return new Vector2(0, 0);
	}
}
