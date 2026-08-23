// SUMMMARY of what this is supposed to do so i dont forget for like 3 hours and have to reread all my code again
//
//
//
//
// read nara.io source code on the workspace in the right, its basically that
// but transpiled to ts
//

export class EntityInstance {
	public position: [number, number];
	public size: [number, number];
	public rotation: number;

	/**
	 * 0 = Circle
	 * 1 = Box
	 * 2 = Grid
	 * 3 = Polygon
	 */
	public shape_type: number;

	/**
	 * 3 = Triangle
	 * 4 = Square
	 * 5 = Pentagon
	 * etc etc
	 */
	public sides: number;

	public fill_style: [number, number, number, number];
	public border_color: [number, number, number, number];
	public border_thickness: number;

	/**
	 * this changes depending on everything you choose (its an extra paramater...).
	 * will document later, for now just ask me in person and i can maybe answer.
	 */
	public extra_param: number;

	constructor(
		position: [number, number],
		size: [number, number],
		rotation: number,
		shape_type: number,
		sides: number,
		fill_style: [number, number, number, number],
		border_color: [number, number, number, number],
		border_thickness: number,
		extra_param: number,
	) {
		this.position = position;
		this.size = size;
		this.rotation = rotation;
		this.shape_type = shape_type;
		this.sides = sides;
		this.fill_style = fill_style;
		this.border_color = border_color;
		this.border_thickness = border_thickness;
		this.extra_param = extra_param;
	}

	static desc(): GPUVertexBufferLayout {
		return {
			// total size of everything if you add it up
			arrayStride: 68,

			stepMode: "instance",

			attributes: [
				{ shaderLocation: 0, format: "float32x2", offset: 0 }, // position
				{ shaderLocation: 1, format: "float32x2", offset: 8 }, // size
				{ shaderLocation: 2, format: "float32", offset: 16 }, // rotation
				{ shaderLocation: 3, format: "uint32", offset: 20 }, // shape_type
				{ shaderLocation: 4, format: "uint32", offset: 24 }, // sides
				{ shaderLocation: 5, format: "float32x4", offset: 28 }, // fill_color
				{ shaderLocation: 6, format: "float32x4", offset: 44 }, // border_color
				{ shaderLocation: 7, format: "float32", offset: 60 }, // border_thickness
				{ shaderLocation: 8, format: "float32", offset: 64 }, // extra_param
			],
		};
	}
}
