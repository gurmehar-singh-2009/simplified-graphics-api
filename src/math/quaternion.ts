import type { Vector3 } from "./vector3";

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

    public copy(q: Quaternion): this {
        return this.set(q.x, q.y, q.z, q.w);
    }

    public identity(): this {
        return this.set(0, 0, 0, 1);
    }

    public static identity(out: Quaternion = new Quaternion()): Quaternion {
        return out.set(0, 0, 0, 1);
    }

    public static fromAxisAngle(axis: Vector3, angle: number, out: Quaternion = new Quaternion()): Quaternion {
        const halfAngle = angle * 0.5;
        const sinVal = Math.sin(halfAngle);
        return out.set(
            axis.x * sinVal,
            axis.y * sinVal,
            axis.z * sinVal,
            Math.cos(halfAngle)
        );
    }

    public magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    public magnitude(): number {
        return Math.sqrt(this.magnitudeSquared());
    }

    public normalize(out: Quaternion = this): Quaternion {
        const sqrMag = this.magnitudeSquared();
        if (sqrMag === 0) {
            return out.set(0, 0, 0, 1);
        }
        const invMag = 1.0 / Math.sqrt(sqrMag);
        return out.set(this.x * invMag, this.y * invMag, this.z * invMag, this.w * invMag);
    }

    public static multiply(a: Quaternion, b: Quaternion, out: Quaternion = new Quaternion()): Quaternion {
        const ax = a.x, ay = a.y, az = a.z, aw = a.w;
        const bx = b.x, by = b.y, bz = b.z, bw = b.w;

        return out.set(
            aw * bx + ax * bw + ay * bz - az * by,
            aw * by - ax * bz + ay * bw + az * bx,
            aw * bz + ax * by - ay * bx + az * bw,
            aw * bw - ax * bx - ay * by - az * bz
        );
    }

    public multiply(q: Quaternion): this {
        return Quaternion.multiply(this, q, this) as this;
    }

    public conjugate(out: Quaternion = this): Quaternion {
        return out.set(-this.x, -this.y, -this.z, this.w);
    }
}
