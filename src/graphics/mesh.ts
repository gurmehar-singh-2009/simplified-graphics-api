export interface MeshData {
	positions: Float32Array;
	normals?: Float32Array;
	indices?: Uint32Array;
}

// yeah so here we have to add more mesh types
// current ones are good but heres a list of ones i want to implement later
// pull requests are welcome for this!! add whatever you want the more the better
//
// n sided cylinders (not smooth ones... basically)
//
// donut
// pyramidal shapes
//

export class MeshBuilder {
	public static box(width = 1, height = 1, depth = 1): MeshData {
		const hx = width / 2,
			hy = height / 2,
			hz = depth / 2;
		const positions: number[] = [],
			normals: number[] = [],
			indices: number[] = [];

		// [normal, corners]
		const faces: Array<[number[], number[][]]> = [
			[
				[0, 0, 1],
				[
					[-hx, -hy, hz],
					[hx, -hy, hz],
					[hx, hy, hz],
					[-hx, hy, hz],
				],
			],
			[
				[0, 0, -1],
				[
					[hx, -hy, -hz],
					[-hx, -hy, -hz],
					[-hx, hy, -hz],
					[hx, hy, -hz],
				],
			],
			[
				[1, 0, 0],
				[
					[hx, -hy, hz],
					[hx, -hy, -hz],
					[hx, hy, -hz],
					[hx, hy, hz],
				],
			],
			[
				[-1, 0, 0],
				[
					[-hx, -hy, -hz],
					[-hx, -hy, hz],
					[-hx, hy, hz],
					[-hx, hy, -hz],
				],
			],
			[
				[0, 1, 0],
				[
					[-hx, hy, hz],
					[hx, hy, hz],
					[hx, hy, -hz],
					[-hx, hy, -hz],
				],
			],
			[
				[0, -1, 0],
				[
					[-hx, -hy, -hz],
					[hx, -hy, -hz],
					[hx, -hy, hz],
					[-hx, -hy, hz],
				],
			],
		];

		for (const [n, corners] of faces) {
			const base = positions.length / 3;

			for (const c of corners) {
				positions.push(c[0]!, c[1]!, c[2]!);
				normals.push(n[0]!, n[1]!, n[2]!);
			}

			indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
		}

		return {
			positions: new Float32Array(positions),
			normals: new Float32Array(normals),
			indices: new Uint32Array(indices),
		};
	}

	public static plane(width = 1, depth = 1, segments = 1): MeshData {
		const positions: number[] = [],
			normals: number[] = [],
			indices: number[] = [];
		const hw = width / 2,
			hd = depth / 2;

		for (let j = 0; j <= segments; j++) {
			const z = -hd + (j / segments) * depth;

			for (let i = 0; i <= segments; i++) {
				positions.push(-hw + (i / segments) * width, 0, z);
				normals.push(0, 1, 0);
			}
		}

		const rowLen = segments + 1;
		for (let j = 0; j < segments; j++) {
			for (let i = 0; i < segments; i++) {
				const a = j * rowLen + i;

				indices.push(a, a + rowLen, a + rowLen + 1, a, a + rowLen + 1, a + 1);
			}
		}

		return {
			positions: new Float32Array(positions),
			normals: new Float32Array(normals),
			indices: new Uint32Array(indices),
		};
	}

	public static sphere(
		radius = 1,
		widthSegments = 32,
		heightSegments = 16,
	): MeshData {
		const positions: number[] = [],
			normals: number[] = [],
			indices: number[] = [];

		for (let iy = 0; iy <= heightSegments; iy++) {
			const phi = (iy / heightSegments) * Math.PI;

			for (let ix = 0; ix <= widthSegments; ix++) {
				const theta = (ix / widthSegments) * Math.PI * 2;
				const nx = -Math.cos(theta) * Math.sin(phi);
				const ny = Math.cos(phi);
				const nz = Math.sin(theta) * Math.sin(phi);

				positions.push(nx * radius, ny * radius, nz * radius);
				normals.push(nx, ny, nz);
			}
		}

		for (let iy = 0; iy < heightSegments; iy++) {
			for (let ix = 0; ix < widthSegments; ix++) {
				const a = iy * (widthSegments + 1) + ix;
				const b = a + widthSegments + 1;

				indices.push(a, b, a + 1, b, b + 1, a + 1);
			}
		}

		return {
			positions: new Float32Array(positions),
			normals: new Float32Array(normals),
			indices: new Uint32Array(indices),
		};
	}

	public static cylinder(
		radius = 1,
		height = 1,
		radialSegments = 32,
	): MeshData {
		const positions: number[] = [],
			normals: number[] = [],
			indices: number[] = [];
		const half = height / 2;

		for (let i = 0; i <= radialSegments; i++) {
			const theta = (i / radialSegments) * Math.PI * 2;
			const nx = Math.cos(theta),
				nz = Math.sin(theta);
			positions.push(
				nx * radius,
				-half,
				nz * radius,
				nx * radius,
				half,
				nz * radius,
			);
			normals.push(nx, 0, nz, nx, 0, nz);
		}
		for (let i = 0; i < radialSegments; i++) {
			const a = i * 2;
			indices.push(a, a + 1, a + 3, a, a + 3, a + 2);
		}

		for (const dir of [1, -1] as const) {
			const capY = half * dir;
			const centerIndex = positions.length / 3;
			positions.push(0, capY, 0);
			normals.push(0, dir, 0);

			const ringStart = centerIndex + 1;
			for (let i = 0; i <= radialSegments; i++) {
				const theta = (i / radialSegments) * Math.PI * 2;
				positions.push(
					Math.cos(theta) * radius,
					capY,
					Math.sin(theta) * radius,
				);
				normals.push(0, dir, 0);
			}
			for (let i = 0; i < radialSegments; i++) {
				if (dir === 1)
					indices.push(centerIndex, ringStart + i + 1, ringStart + i);
				else indices.push(centerIndex, ringStart + i, ringStart + i + 1);
			}
		}

		return {
			positions: new Float32Array(positions),
			normals: new Float32Array(normals),
			indices: new Uint32Array(indices),
		};
	}
}
