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
