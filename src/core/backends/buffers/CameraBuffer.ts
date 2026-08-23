export class CameraUniform {
	static readonly SIZE_BYTES = 80; // space for 20 floats

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

	set cameraPos([x, y]: [number, number]) {
		this.view[16] = x;
		this.view[17] = y;
	}
	get cameraPos(): [number, number] {
		return [this.view[16]!, this.view[17]!];
	}

	set zoom(v: number) {
		this.view[18] = v;
	}
	get zoom(): number {
		return this.view[18]!;
	}

	set aspectRatio(v: number) {
		this.view[19] = v;
	}
	get aspectRatio(): number {
		return this.view[19]!;
	}

	get bytes(): Float32Array {
		return this.view;
	}
}
