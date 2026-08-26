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

    static identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1);
    }

    static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
        let halfAngle = angle / 2;
        let sinVal = Math.sin(halfAngle);
        return new Quaternion(axis.x * sinVal, axis.y * sinVal, axis.z * sinVal, Math.cos(halfAngle));
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    normalize(): Quaternion {
        let mag = this.magnitude();
        if (mag === 0) {
            return new Quaternion(0, 0, 0, 0);
        } else {
            return new Quaternion(this.x / mag, this.y / mag, this.z / mag, this.w / mag);
        }
    }

    multiply(q: Quaternion): void {
        const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
        const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
        const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    conjugate(): Quaternion {
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }
}
