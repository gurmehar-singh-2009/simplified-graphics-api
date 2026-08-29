// rewrote this i didnt like what i had before

export class CameraUniform {
  static readonly SIZE_BYTES = 96; // IMPORTANT! update the size whenever you change what ur sending

  private readonly buffer: ArrayBuffer;
  private readonly view: Float32Array;

  constructor() {
    this.buffer = new ArrayBuffer(CameraUniform.SIZE_BYTES);
    this.view = new Float32Array(this.buffer);
  }

  set viewProj(m: Float32Array | number[]) {
    this.view.set(m, 0);
  }
  get viewProj(): Float32Array {
    return this.view.subarray(0, 16);
  }

  set cameraPos([x, y, z]: [number, number, number]) {
    this.view[16] = x;
    this.view[17] = y;
    this.view[18] = z;
  }
  get cameraPos(): [number, number, number] {
    return [this.view[16]!, this.view[17]!, this.view[18]!];
  }

  set zoom(v: number) {
    this.view[19] = v;
  }
  get zoom(): number {
    return this.view[19]!;
  }

  set aspectRatio(v: number) {
    this.view[20] = v;
  }
  get aspectRatio(): number {
    return this.view[20]!;
  }

  get bytes(): Float32Array {
    return this.view;
  }
}
