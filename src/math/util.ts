import type { MeshData } from "../graphics/mesh";
import { Vector2 } from "./vector2";
import type { Vector3 } from "./vector3";

/**
 * Converts normalized [-1, 1] coordinates into screen coordinates.
 * @param coord The coordinate pair.
 * @param width The width of the screen.
 * @param height The height of the screen.
 * @returns The converted coordinate pair.
 */
export function normalizedToScreenCoords(
	coord: Vector2,
	width: number,
	height: number,
): Vector2 {
	return new Vector2(
		((coord.x + 1) / 2) * width,
		(1 - (coord.y + 1) / 2) * height,
	);
}

export function project(coord: Vector3): Vector2 {
	return new Vector2(coord.x / coord.z, coord.y / coord.z);
}

// export function computeViewProjMatrix(): Float32Array {
//   return new Float32Array([
//     1.0, 0.0, 0.0, 0.0,
//     0.0, 1.0, 0.0, 0.0,
//     0.0, 0.0, 1.0, 0.0,
//     0.0, 0.0, 0.0, 1.0,
//   ]);
// }

export function computeViewProjMatrix(
	width: number,
	height: number,
	cameraPos: [number, number],
	zoom: number,
): Float32Array {
	const left = cameraPos[0];
	const right = left + width / zoom;
	const top = cameraPos[1];
	const bottom = top + height / zoom;

	return new Float32Array([
		2 / (right - left),
		0,
		0,
		0,
		0,
		-2 / (bottom - top),
		0,
		0,
		0,
		0,
		1,
		0,
		-(right + left) / (right - left),
		(bottom + top) / (bottom - top),
		0,
		1,
	]);
}

// stole this
// add credit later
export function computeFlatNormals(mesh: MeshData): Float32Array {
	const positions = mesh.positions;
	const normals = new Float32Array(positions.length);
	const index = mesh.indices;
	const triCount = index ? index.length / 3 : positions.length / 9;

	for (let t = 0; t < triCount; t++) {
		const i0 = (index ? index[t * 3]! : t * 3) * 3;
		const i1 = (index ? index[t * 3 + 1]! : t * 3 + 1) * 3;
		const i2 = (index ? index[t * 3 + 2]! : t * 3 + 2) * 3;

		const e1x = positions[i1]! - positions[i0]!;
		const e1y = positions[i1 + 1]! - positions[i0 + 1]!;
		const e1z = positions[i1 + 2]! - positions[i0 + 2]!;
		const e2x = positions[i2]! - positions[i0]!;
		const e2y = positions[i2 + 1]! - positions[i0 + 1]!;
		const e2z = positions[i2 + 2]! - positions[i0 + 2]!;

		let nx = e1y * e2z - e1z * e2y;
		let ny = e1z * e2x - e1x * e2z;
		let nz = e1x * e2y - e1y * e2x;
		const len = Math.hypot(nx, ny, nz) || 1;
		nx /= len;
		ny /= len;
		nz /= len;

		for (const i of [i0, i1, i2]) {
			normals[i] = nx;
			normals[i + 1] = ny;
			normals[i + 2] = nz;
		}
	}

	return normals;
}
