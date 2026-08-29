export class EntityInstance {
  public position: [number, number, number];
  public size: [number, number];
  public rotation: number;
  public shape_type: number;
  public sides: number;
  public fill_style: [number, number, number, number];
  public border_color: [number, number, number, number];
  public border_thickness: number;
  public extra_param: number;

  constructor(
    position: [number, number, number],
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
      // 18 floats * 4 bytes
      arrayStride: 72,
      stepMode: "instance",
      attributes: [
        { shaderLocation: 0, format: "float32x3", offset: 0 }, // position (x,y,z)
        { shaderLocation: 1, format: "float32x2", offset: 12 }, // size
        { shaderLocation: 2, format: "float32", offset: 20 }, // rotation
        { shaderLocation: 3, format: "uint32", offset: 24 }, // shape_type
        { shaderLocation: 4, format: "uint32", offset: 28 }, // sides
        { shaderLocation: 5, format: "float32x4", offset: 32 }, // fill_color
        { shaderLocation: 6, format: "float32x4", offset: 48 }, // border_color
        { shaderLocation: 7, format: "float32", offset: 64 }, // border_thickness
        { shaderLocation: 8, format: "float32", offset: 68 }, // extra_param
      ],
    };
  }
}
