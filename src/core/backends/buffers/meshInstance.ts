export interface MeshDrawInstance {
  meshId: number;
  position: [number, number, number];
  rotation: [number, number, number, number]; // quaternion xyzw
  scale: [number, number, number];
  color: [number, number, number, number];
}

export interface UploadedMesh {
  vertexBuffer: GPUBuffer;
  indexBuffer?: GPUBuffer;
  vertexCount: number;
  indexCount: number;
}
