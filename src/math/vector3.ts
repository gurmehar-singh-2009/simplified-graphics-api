/**
 * 3rd Dimension vector class.
 */
export class Vector3 {
	/** x position */
	public x: number;
	/** y position */
	public y: number;
	/** z position */
	public z: number;

	/**
	 * Constructor. I mean what else is this?
	 * @param x The x coordinate.
	 * @param y The y coordinate.
	 * @param z The z coordinate.
	 */
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Add this vector with another vector. Returns the result.
	 * @param other The other vector.
	 * @returns The result of the addition operation conducted on the vectors.
	 */
	public add(other: Vector3): Vector3 {
		return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	/**
	 * Subtract this vector with another vector. Returns the result.
	 * @param other The other vector.
	 * @returns The result of the subtraction operation conducted on the vectors.
	 */
	public sub(other: Vector3): Vector3 {
		return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	/**
	 * Scale this vector using a scalar.
	 * @param scalar The scalar value.
	 * @returns The scaled vector.
	 */
	public mul(scalar: number): Vector3 {
		return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
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
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	/**
	 * Clones the vector...
	 * @returns The clone of the vector.
	 */
	public clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	/**
	 * Normalize the vector (makes its length 1, while preserving direction).
	 * @returns The normalized vector.
	 */
	public normalize(): Vector3 {
		const mag = this.mag();

		if (mag === 0) return Vector3.ZERO;

		return this.mul(1 / mag);
	}

	public negative(): Vector3 {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;

		return this;
	}

	/**
	 * Returns the dot product with another vector.
	 * @param other The other vector.
	 * @returns The dot product result.
	 */
	public dot(other: Vector3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	/**
	 * Returns the cross product with another vector.
	 * @param other The other vector.
	 * @returns The cross product result vector.
	 */
	public cross(other: Vector3): Vector3 {
		return new Vector3(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x,
		);
	}

	/**
	 * Calculate the distance to another vector.
	 * @param other The other vector.
	 * @returns The euclidean distance.
	 */
	public distanceTo(other: Vector3): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		const dz = this.z - other.z;

		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	/**
	 * Calculate the squared distance to another vector. Useful for optimization as it avoids the `Math.sqrt` call.
	 * @param other The other vector.
	 * @returns The squared euclidean distance.
	 */
	public squaredDistanceTo(other: Vector3): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		const dz = this.z - other.z;

		return dx * dx + dy * dy + dz * dz;
	}

	/**
	 * Checks if this vector is equal to another vector.
	 * @param other The other vector.
	 * @returns Whether they are equal or not.
	 */
	public equals(other: Vector3): boolean {
		return this.x === other.x && this.y === other.y && this.z === other.z;
	}

	/**
	 * Returns the angle, in radians, between this vector and another vector.
	 * @param other The other vector.
	 * @returns The angle, in radians, between this vector and another vector.
	 */
	public angleBetween(other: Vector3): number {
		const denominator = Math.sqrt(this.mag_squared() * other.mag_squared());

		if (denominator === 0) return 0;

		const theta = this.dot(other) / denominator;
		return Math.acos(Math.max(-1, Math.min(1, theta)));
	}

	public static get ZERO(): Vector3 {
		return new Vector3(0, 0, 0);
	}
}
