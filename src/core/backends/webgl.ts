import type { RenderConfigs, Backend } from "../renderer";
import { Commands } from "../commands";
import vertexShaderSource from '../../graphics/shaders/webgl/vertex.glsl' with {
  type: "text",
};
import fragmentShaderSource from '../../graphics/shaders/webgl/fragment.glsl' with {
  type: "text",
};

export class WebGLBackend implements Backend {
  configs: RenderConfigs;
  private ctx: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement, configs: RenderConfigs) {
    this.configs = configs;

    this.ctx = canvas.getContext("webgl2")!;

    this.initShaderProgram(vertexShaderSource, fragmentShaderSource);
  }

  private initShaderProgram(vertexShaderSource: string, fragmentShaderSource: string): void {
    let program = this.ctx.createProgram();

    this.ctx.attachShader(program, this.loadShader(this.ctx.VERTEX_SHADER, vertexShaderSource));
    this.ctx.attachShader(program, this.loadShader(this.ctx.FRAGMENT_SHADER, fragmentShaderSource));

    this.ctx.linkProgram(program);

    // this.shaderLocations = {
    //     program: program,

    //     attributes: {
    //         position: this.ctx.getAttribLocation(program, "a_position"),
    //         rotation: this.ctx.getAttribLocation(program, "a_rotation"),
    //         pivot: this.ctx.getAttribLocation(program, "a_pivot"),
    //         depth: this.ctx.getAttribLocation(program, "a_depth"),
    //         texCoord: this.ctx.getAttribLocation(program, "a_texCoord"),
    //         colour: this.ctx.getAttribLocation(program, "a_colour"),
    //         type: this.ctx.getAttribLocation(program, "a_type")
    //     },

    //     uniforms: {
    //         resolution: this.ctx.getUniformLocation(program, "u_resolution"),
    //         cameraPos: this.ctx.getUniformLocation(program, "u_cameraPos"),
    //         viewRotation: this.ctx.getUniformLocation(program, "u_viewRotation"),
    //         viewZoom: this.ctx.getUniformLocation(program, "u_viewZoom"),
    //         textures: this.ctx.getUniformLocation(program, "u_textures")
    //     }
    // };
  }

  private loadShader(type: GLenum, source: string) {
    let shader = this.ctx.createShader(type) as WebGLShader;

    this.ctx.shaderSource(shader, source);

    this.ctx.compileShader(shader);

    if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
      console.error("Shader Error: " + this.ctx.getShaderInfoLog(shader));
    }

    return shader;
  }

  clear(r: number, g: number, b: number, a: number): void {
    this.ctx.clearColor(r / 255, g / 255, b / 255, a);
  }

  // setColor(r: number, g: number, b: number, a: number): void {


  // }

  // }

  // drawSquare(x: number, y: number, w: number, h: number): void {

  // }

  // drawRegularPolygon(x: number, y: number, size: number, sides: number, rot?: number): void {

  // }

  // drawPolygon(vertices: Array<[number, number]>): void {

  // }

  // Put this method here and not a base Backend class since we might want to process the command buffer differently in each backend.
  // Having the command buffer here provides lots of flexibility but for now it is the same code in all three backends.
  public processFrame(data: Float32Array, length: number): void {
    const driver = this as Backend;
    let i = 0;

    while (i < length) {
      const opcode = data[i++] as Commands;

      switch (opcode) {
        case Commands.Clear: {
          if (!driver.clear) {
            throw new Error("WebGL backend does not implement 'clear()'.");
          }
          driver.clear(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.SetColor: {
          if (!driver.setColor) {
            throw new Error("WebGL backend does not implement 'setColor()'.");
          }
          driver.setColor(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.DrawLine: {
          if (!driver.drawLine) {
            throw new Error("WebGL backend does not implement 'drawLine()'.");
          }
          driver.drawLine(
            data[i++]!,
            data[i++]!,
            data[i++]!,
            data[i++]!,
            data[i++]!,
          );
          break;
        }

        case Commands.DrawCircle: {
          if (!driver.drawCircle) {
            throw new Error("WebGL backend does not implement 'drawCircle()'.");
          }
          driver.drawCircle(data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.DrawSquare: {
          if (!driver.drawSquare) {
            throw new Error("WebGL backend does not implement 'drawSquare()'.");
          }
          driver.drawSquare(data[i++]!, data[i++]!, data[i++]!, data[i++]!);
          break;
        }

        case Commands.DrawTriangle: {
          if (!driver.drawTriangle) {
            throw new Error(
              "WebGL backend does not implement 'drawTriangle()'.",
            );
          }
          driver.drawTriangle(
            data[i++]!,
            data[i++]!,
            data[i++]!,
            data[i++]!,
            data[i++]!,
            data[i++]!,
          );
          break;
        }

        case Commands.DrawRegularPolygon: {
          if (!driver.drawRegularPolygon) {
            throw new Error(
              "WebGL backend does not implement 'drawRegularPolygon()'.",
            );
          }
          driver.drawRegularPolygon(
            data[i++]!,
            data[i++]!,
            data[i++]!,
            data[i++]!,
            data[i++]!,
          );
          break;
        }

        case Commands.DrawPolygon: {
          if (!driver.drawPolygon) {
            throw new Error(
              "WebGL backend does not implement 'drawPolygon()'.",
            );
          }
          const vertCount = data[i++]!;
          const vertices: Array<[number, number]> = [];
          for (let v = 0; v < vertCount; v++) {
            vertices.push([data[i++]!, data[i++]!]);
          }
          driver.drawPolygon(vertices);
          break;
        }
      }
    }
  }
}
