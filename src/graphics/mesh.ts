import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { Vector4 } from "../math/vector4";

export interface MeshData {
	positions: Float32Array;
	normals?: Float32Array;
	uvs?: Float32Array;
	tangents?: Float32Array;
	indices: Uint32Array | Uint16Array;
}

export interface Face {
	vertices: Vector3[];
	normal: Vector3;
	tangent: Vector4;
	uvs: Vector2[];
}

export class MeshBuilder {
	public static fromFaces(
		faces: Face[],
		includeNormals = true,
		includeUVs = true,
		includeTangents = false,
	) {
		const positions: number[] = [];
		const normals: number[] = [];
		const uvs: number[] = [];
		const tangents: number[] = [];
		const indices: number[] = [];

		for (const face of faces) {
			const baseIndex = positions.length / 3;
			const numVertices = face.vertices.length;

			if (numVertices < 3) {
				continue;
			}

			for (let i = 0; i < numVertices; i++) {
				const corner = face.vertices[i]!;
				positions.push(corner.x, corner.y, corner.z);

				if (includeNormals) {
					normals.push(face.normal.x, face.normal.y, face.normal.z);
				}

				if (includeUVs) {
					const uv = face.uvs[i];
					if (uv) {
						uvs.push(uv.x, uv.y);
					} else {
						uvs.push(0, 0);
					}
				}

				if (includeTangents) {
					tangents.push(
						face.tangent.x,
						face.tangent.y,
						face.tangent.z,
						face.tangent.w,
					);
				}
			}

			// Fan triangulation of the polygon for now. We can implement better triangulations here.
			for (let i = 1; i < numVertices - 1; i++) {
				indices.push(baseIndex, baseIndex + i, baseIndex + i + 1);
			}
		}

		const totalVertices = positions.length / 3;
		const IndexArray = totalVertices > 65535 ? Uint32Array : Uint16Array;

		return {
			positions: new Float32Array(positions),
			normals: includeNormals ? new Float32Array(normals) : undefined,
			uvs: includeUVs ? new Float32Array(uvs) : undefined,
			tangents: includeTangents ? new Float32Array(tangents) : undefined,
			indices: new IndexArray(indices),
		};
	}

	public static Quad(
		width = 1,
		height = 1,
		includeNormals = false,
		includeUVs = false,
		includeTangents = false,
	): MeshData {
		const hx = width / 2;
		const hy = height / 2;

		const faces: Face[] = [
			{
				vertices: [
					new Vector3(-hx, -hy, 0),
					new Vector3(hx, -hy, 0),
					new Vector3(hx, hy, 0),
					new Vector3(-hx, hy, 0),
				],
				normal: new Vector3(0, 0, 1),
				tangent: new Vector4(1, 0, 0, 1),
				uvs: [
					new Vector2(0, 0),
					new Vector2(1, 0),
					new Vector2(1, 1),
					new Vector2(0, 1),
				],
			},
		];

		return MeshBuilder.fromFaces(
			faces,
			includeNormals,
			includeUVs,
			includeTangents,
		);
	}

	public static UnitTriangle(includeNormals = false, includeUVs = false, includeTangents = false) {
		const faces: Face[] = [
			{
				vertices: [
					new Vector3(0, 0, 0),
					new Vector3(0, 1, 0),
					new Vector3(1, 0, 0)
				],
				normal: new Vector3(0, 0, 1),
				tangent: new Vector4(1, 0, 0, 1),
				uvs: [
					new Vector2(0, 0),
					new Vector2(0, 1),
					new Vector2(1, 0)
				],
			},
		];

		return MeshBuilder.fromFaces(
			faces,
			includeNormals,
			includeUVs,
			includeTangents,
		);
	}

	public static RegularPolygon(
		size: number,
		sides: number,
		includeNormals = false,
		includeUVs = false,
		includeTangents = false,
	): MeshData {
		if (sides < 3) {
			sides = 3;
		}

		// Get radius
		size /= 2;

		let polygon: Face = {
			vertices: [],
			normal: new Vector3(0, 0, 1),
			tangent: new Vector4(1, 0, 0, 1),
			uvs: [],
		};

		const step = (Math.PI * 2) / sides;

		for (let i = 0; i < sides; i++) {
			const angle = i * step;
			const cosVal = Math.cos(angle);
			const sinVal = Math.sin(angle);

			polygon.vertices.push(new Vector3(size * cosVal, size * sinVal, 0));
			polygon.uvs.push(new Vector2((cosVal + 1) / 2, (sinVal + 1) / 2));
		}

		return MeshBuilder.fromFaces(
			[polygon],
			includeNormals,
			includeUVs,
			includeTangents,
		);
	}

	public static Box(
		width = 1,
		height = 1,
		depth = 1,
		includeNormals = true,
		includeUVs = true,
		includeTangents = false,
	): MeshData {
		const hx = width / 2;
		const hy = height / 2;
		const hz = depth / 2;

		const faces: Face[] = [
			// Front
			{
				vertices: [
					new Vector3(-hx, -hy, hz),
					new Vector3(hx, -hy, hz),
					new Vector3(hx, hy, hz),
					new Vector3(-hx, hy, hz),
				],
				normal: new Vector3(0, 0, 1),
				tangent: new Vector4(1, 0, 0, 1),
				uvs: [
					new Vector2(0, 0),
					new Vector2(1, 0),
					new Vector2(1, 1),
					new Vector2(0, 1),
				],
			},
			// Back
			{
				vertices: [
					new Vector3(hx, -hy, -hz),
					new Vector3(-hx, -hy, -hz),
					new Vector3(-hx, hy, -hz),
					new Vector3(hx, hy, -hz),
				],
				normal: new Vector3(0, 0, -1),
				tangent: new Vector4(-1, 0, 0, 1),
				uvs: [
					new Vector2(1, 0),
					new Vector2(0, 0),
					new Vector2(0, 1),
					new Vector2(1, 1),
				],
			},
			// Right
			{
				vertices: [
					new Vector3(hx, -hy, hz),
					new Vector3(hx, -hy, -hz),
					new Vector3(hx, hy, -hz),
					new Vector3(hx, hy, hz),
				],
				normal: new Vector3(1, 0, 0),
				tangent: new Vector4(0, 0, -1, 1),
				uvs: [
					new Vector2(0, 0),
					new Vector2(1, 0),
					new Vector2(1, 1),
					new Vector2(0, 1),
				],
			},
			// Left
			{
				vertices: [
					new Vector3(-hx, -hy, -hz),
					new Vector3(-hx, -hy, hz),
					new Vector3(-hx, hy, hz),
					new Vector3(-hx, hy, -hz),
				],
				normal: new Vector3(-1, 0, 0),
				tangent: new Vector4(0, 0, 1, 1),
				uvs: [
					new Vector2(0, 0),
					new Vector2(1, 0),
					new Vector2(1, 1),
					new Vector2(0, 1),
				],
			},
			// Top
			{
				vertices: [
					new Vector3(-hx, hy, hz),
					new Vector3(hx, hy, hz),
					new Vector3(hx, hy, -hz),
					new Vector3(-hx, hy, -hz),
				],
				normal: new Vector3(0, 1, 0),
				tangent: new Vector4(1, 0, 0, 1),
				uvs: [
					new Vector2(0, 0),
					new Vector2(1, 0),
					new Vector2(1, 1),
					new Vector2(0, 1),
				],
			},
			// Bottom
			{
				vertices: [
					new Vector3(-hx, -hy, -hz),
					new Vector3(hx, -hy, -hz),
					new Vector3(hx, -hy, hz),
					new Vector3(-hx, -hy, hz),
				],
				normal: new Vector3(0, -1, 0),
				tangent: new Vector4(1, 0, 0, 1),
				uvs: [
					new Vector2(0, 0),
					new Vector2(1, 0),
					new Vector2(1, 1),
					new Vector2(0, 1),
				],
			},
		];

		return MeshBuilder.fromFaces(
			faces,
			includeNormals,
			includeUVs,
			includeTangents,
		);
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
