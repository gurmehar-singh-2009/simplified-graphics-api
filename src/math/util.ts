// couldnt think of a nice name

import { Vector2 } from "./Vector2";
import type { Vector3 } from "./Vector3";

// basically converts regular top-left zero coordinates into [-1, 1] coordinate system
export function transform2DtoNormalizedCoordinates(_coord: Vector2) {}

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
