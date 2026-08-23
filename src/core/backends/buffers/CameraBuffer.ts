/**
 * Camera uniform buffer payload structure.
 */
export class CameraUniform {
  /** Total payload size in bytes (space for 20 Float32 values). */
  static readonly SIZE_BYTES = 80;

  /** Internal backing ArrayBuffer holding the raw uniform data. */
  private readonly buffer: ArrayBuffer;
  /** Typed Float32Array view spanning the entire buffer payload. */
  private readonly view: Float32Array;

  constructor() {
    this.buffer = new ArrayBuffer(CameraUniform.SIZE_BYTES);

    // TODO: Update layout if matrix representation changes
    this.view = new Float32Array(this.buffer);
  }

  /** Sets the 4x4 view-projection matrix (first 16 floats). */
  set viewProj(m: Float32Array | number[]) {
    this.view.set(m, 0);
  }
  /** Gets the 4x4 view-projection matrix slice. */
  get viewProj(): Float32Array {
    return this.view.subarray(0, 16);
  }

  /** Sets the camera [x, y] position. */
  set cameraPos([x, y]: [number, number]) {
    this.view[16] = x;
    this.view[17] = y;
  }
  /** Gets the camera [x, y] position. */
  get cameraPos(): [number, number] {
    return [this.view[16]!, this.view[17]!];
  }

  /** Sets the camera zoom factor. */
  set zoom(v: number) {
    this.view[18] = v;
  }
  /** Gets the camera zoom factor. */
  get zoom(): number {
    return this.view[18]!;
  }

  /** Sets the viewport aspect ratio. */
  set aspectRatio(v: number) {
    this.view[19] = v;
  }
  /** Gets the viewport aspect ratio. */
  get aspectRatio(): number {
    return this.view[19]!;
  }

  /** Gets the Float32Array view containing the full uniform payload. */
  get bytes(): Float32Array {
    return this.view;
  }
}
