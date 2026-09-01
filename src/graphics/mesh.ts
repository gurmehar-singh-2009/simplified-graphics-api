import type { Vector3 } from "../math/vector3";

export interface MeshData {
	positions: Float32Array;
	normals?: Float32Array;
	uvs?: Float32Array;
	tangents?: Float32Array;
	indices: Uint32Array | Uint16Array;
}

export interface FaceDefinition {
	normal: Vector3;
	tangent: [number, number, number, number]; // x, y, z, sign
	corners: [
		[number, number, number],
		[number, number, number],
		[number, number, number],
		[number, number, number],
	];
	uvs: [[number, number], [number, number], [number, number], [number, number]];
}

export class MeshBuilder {
	public static Box(
		width = 1,
		height = 1,
		depth = 1,
		includeNormals = false,
		includeUVs = false,
		includeTangents = false,
	): MeshData {
		const hx = width / 2,
			hy = height / 2,
			hz = depth / 2;
		const positions: number[] = [];
		const normals: number[] = [];
		const uvs: number[] = [];
		const tangents: number[] = [];
		const indices: number[] = [];

		// [normal, tangent, corners, uvs]
		const faces: Array<[number[], number[], number[][], number[][]]> = [
			// Front
			[
				[0, 0, 1],
				[1, 0, 0, 1],
				[
					[-hx, -hy, hz],
					[hx, -hy, hz],
					[hx, hy, hz],
					[-hx, hy, hz],
				],
				[
					[0, 0],
					[1, 0],
					[1, 1],
					[0, 1],
				],
			],
			// Back
			[
				[0, 0, -1],
				[-1, 0, 0, 1],
				[
					[hx, -hy, -hz],
					[-hx, -hy, -hz],
					[-hx, hy, -hz],
					[hx, hy, -hz],
				],
				[
					[1, 0],
					[0, 0],
					[0, 1],
					[1, 1],
				],
			],
			// Right
			[
				[1, 0, 0],
				[0, 0, -1, 1],
				[
					[hx, -hy, hz],
					[hx, -hy, -hz],
					[hx, hy, -hz],
					[hx, hy, hz],
				],
				[
					[0, 0],
					[1, 0],
					[1, 1],
					[0, 1],
				],
			],
			// Left
			[
				[-1, 0, 0],
				[0, 0, 1, 1],
				[
					[-hx, -hy, -hz],
					[-hx, -hy, hz],
					[-hx, hy, hz],
					[-hx, hy, -hz],
				],
				[
					[0, 0],
					[1, 0],
					[1, 1],
					[0, 1],
				],
			],
			// Top
			[
				[0, 1, 0],
				[1, 0, 0, 1],
				[
					[-hx, hy, hz],
					[hx, hy, hz],
					[hx, hy, -hz],
					[-hx, hy, -hz],
				],
				[
					[0, 0],
					[1, 0],
					[1, 1],
					[0, 1],
				],
			],
			// Bottom
			[
				[0, -1, 0],
				[1, 0, 0, 1],
				[
					[-hx, -hy, -hz],
					[hx, -hy, -hz],
					[hx, -hy, hz],
					[-hx, -hy, hz],
				],
				[
					[0, 0],
					[1, 0],
					[1, 1],
					[0, 1],
				],
			],
		];

		for (const [n, t, corners, faceUVs] of faces) {
			const base = positions.length / 3;

			for (let i = 0; i < 4; i++) {
				const c = corners[i]!;
				positions.push(c[0]!, c[1]!, c[2]!);

				if (includeNormals) {
					normals.push(n[0]!, n[1]!, n[2]!);
				}
				if (includeUVs) {
					const uv = faceUVs[i]!;
					uvs.push(uv[0]!, uv[1]!);
				}
				if (includeTangents) {
					// Tangents in glTF/WebGL standard are 4D (x, y, z, sign)
					tangents.push(t[0]!, t[1]!, t[2]!, t[3]!);
				}
			}

			indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
		}

		return {
			positions: new Float32Array(positions),
			normals: includeNormals ? new Float32Array(normals) : undefined,
			uvs: includeUVs ? new Float32Array(uvs) : undefined,
			tangents: includeTangents ? new Float32Array(tangents) : undefined,
			indices: new Uint16Array(indices),
		};
	}

	public static Quad(
		width = 1,
		height = 1,
		includeNormals = false,
		includeUVs = false,
		includeTangents = false,
	): MeshData {
		const hx = width / 2,
			hy = height / 2;
		const positions: number[] = [];
		const normals: number[] = [];
		const uvs: number[] = [];
		const tangents: number[] = [];
		const indices: number[] = [];

		// [normal, tangent, corners, uvs]
		const faces: Array<[number[], number[], number[][], number[][]]> = [
			// Front
			[
				[0, 0, 1],
				[1, 0, 0, 1],
				[
					[-hx, -hy, 0],
					[hx, -hy, 0],
					[hx, hy, 0],
					[-hx, hy, 0],
				],
				[
					[0, 0],
					[1, 0],
					[1, 1],
					[0, 1],
				],
			],
		];

		for (const [n, t, corners, faceUVs] of faces) {
			const base = positions.length / 3;

			for (let i = 0; i < 4; i++) {
				const c = corners[i]!;
				positions.push(c[0]!, c[1]!, c[2]!);

				if (includeNormals) {
					normals.push(n[0]!, n[1]!, n[2]!);
				}
				if (includeUVs) {
					const uv = faceUVs[i]!;
					uvs.push(uv[0]!, uv[1]!);
				}
				if (includeTangents) {
					tangents.push(t[0]!, t[1]!, t[2]!, t[3]!);
				}
			}

			indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
		}

		return {
			positions: new Float32Array(positions),
			normals: includeNormals ? new Float32Array(normals) : undefined,
			uvs: includeUVs ? new Float32Array(uvs) : undefined,
			tangents: includeTangents ? new Float32Array(tangents) : undefined,
			indices: new Uint16Array(indices),
		};
	}

	// public static plane(width = 1, depth = 1, segments = 1): MeshData {
	// 	const positions: number[] = [],
	// 		normals: number[] = [],
	// 		indices: number[] = [];
	// 	const hw = width / 2,
	// 		hd = depth / 2;

	// 	for (let j = 0; j <= segments; j++) {
	// 		const z = -hd + (j / segments) * depth;

	// 		for (let i = 0; i <= segments; i++) {
	// 			positions.push(-hw + (i / segments) * width, 0, z);
	// 			normals.push(0, 1, 0);
	// 		}
	// 	}

	// 	const rowLen = segments + 1;
	// 	for (let j = 0; j < segments; j++) {
	// 		for (let i = 0; i < segments; i++) {
	// 			const a = j * rowLen + i;

	// 			indices.push(a, a + rowLen, a + rowLen + 1, a, a + rowLen + 1, a + 1);
	// 		}
	// 	}

	// 	return {
	// 		positions: new Float32Array(positions),
	// 		normals: new Float32Array(normals),
	// 		indices: new Uint32Array(indices),
	// 	};
	// }

	// public static sphere(
	// 	radius = 1,
	// 	widthSegments = 32,
	// 	heightSegments = 16,
	// ): MeshData {
	// 	const positions: number[] = [],
	// 		normals: number[] = [],
	// 		indices: number[] = [];

	// 	for (let iy = 0; iy <= heightSegments; iy++) {
	// 		const phi = (iy / heightSegments) * Math.PI;

	// 		for (let ix = 0; ix <= widthSegments; ix++) {
	// 			const theta = (ix / widthSegments) * Math.PI * 2;
	// 			const nx = -Math.cos(theta) * Math.sin(phi);
	// 			const ny = Math.cos(phi);
	// 			const nz = Math.sin(theta) * Math.sin(phi);

	// 			positions.push(nx * radius, ny * radius, nz * radius);
	// 			normals.push(nx, ny, nz);
	// 		}
	// 	}

	// 	for (let iy = 0; iy < heightSegments; iy++) {
	// 		for (let ix = 0; ix < widthSegments; ix++) {
	// 			const a = iy * (widthSegments + 1) + ix;
	// 			const b = a + widthSegments + 1;

	// 			indices.push(a, b, a + 1, b, b + 1, a + 1);
	// 		}
	// 	}

	// 	return {
	// 		positions: new Float32Array(positions),
	// 		normals: new Float32Array(normals),
	// 		indices: new Uint32Array(indices),
	// 	};
	// }

	// public static cylinder(
	// 	radius = 1,
	// 	height = 1,
	// 	radialSegments = 32,
	// ): MeshData {
	// 	const positions: number[] = [],
	// 		normals: number[] = [],
	// 		indices: number[] = [];
	// 	const half = height / 2;

	// 	for (let i = 0; i <= radialSegments; i++) {
	// 		const theta = (i / radialSegments) * Math.PI * 2;
	// 		const nx = Math.cos(theta),
	// 			nz = Math.sin(theta);
	// 		positions.push(
	// 			nx * radius,
	// 			-half,
	// 			nz * radius,
	// 			nx * radius,
	// 			half,
	// 			nz * radius,
	// 		);
	// 		normals.push(nx, 0, nz, nx, 0, nz);
	// 	}
	// 	for (let i = 0; i < radialSegments; i++) {
	// 		const a = i * 2;
	// 		indices.push(a, a + 1, a + 3, a, a + 3, a + 2);
	// 	}

	// 	for (const dir of [1, -1] as const) {
	// 		const capY = half * dir;
	// 		const centerIndex = positions.length / 3;
	// 		positions.push(0, capY, 0);
	// 		normals.push(0, dir, 0);

	// 		const ringStart = centerIndex + 1;
	// 		for (let i = 0; i <= radialSegments; i++) {
	// 			const theta = (i / radialSegments) * Math.PI * 2;
	// 			positions.push(
	// 				Math.cos(theta) * radius,
	// 				capY,
	// 				Math.sin(theta) * radius,
	// 			);
	// 			normals.push(0, dir, 0);
	// 		}
	// 		for (let i = 0; i < radialSegments; i++) {
	// 			if (dir === 1)
	// 				indices.push(centerIndex, ringStart + i + 1, ringStart + i);
	// 			else indices.push(centerIndex, ringStart + i, ringStart + i + 1);
	// 		}
	// 	}

	// 	return {
	// 		positions: new Float32Array(positions),
	// 		normals: new Float32Array(normals),
	// 		indices: new Uint32Array(indices),
	// 	};
	// }
}

export interface Mesh {
	vao: WebGLVertexArrayObject;
	vbo: WebGLBuffer;
	ebo: WebGLBuffer;
	indexCount: number;
	indexType: GLenum;
}
