import { Quaternion } from "./quaternion";
import type { Vector3 } from "./vector3";

/**
 * A generic N x M matrix implementation which i hope REALLY works.
 */
export class Matrix<N extends number, M extends number> {
  /** Internal array of elements. */
  public elements: number[];
  /** The number of rows. */
  public readonly rows: N;
  /** The number of columns. */
  public readonly cols: M;

  constructor(rows: N, cols: M, elements?: number[]) {
    this.rows = rows;
    this.cols = cols;
    const totalSize = rows * cols;

    if (elements) {
      if (elements.length !== totalSize) {
        throw new Error(
          `Expected ${totalSize} elements for a ${rows}x${cols} matrix, but got ${elements.length}.`,
        );
      }
      this.elements = [...elements];
    } else {
      this.elements = new Array(totalSize).fill(0);
    }
  }

  /**
   * Retrieves the element at the specified row and col.
   * @param row The row to retrieve from.
   * @param col The col to retrieve from.
   * @returns The element at that position.
   */
  public get(row: number, col: number): number {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error(
        `Index (${row}, ${col}) out of bounds for a ${this.rows}x${this.cols} matrix.`,
      );
    }

    return this.elements[row * this.cols + col]!;
  }

  /**
   * Sets the element at the specified row and col.
   * @param row The specified row.
   * @param col The specified column.
   * @param value The value to set.
   * @returns This matrix.
   */
  public set(row: number, col: number, value: number): this {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error(
        `Index (${row}, ${col}) out of bounds for a ${this.rows}x${this.cols} matrix.`,
      );
    }

    this.elements[row * this.cols + col] = value;

    return this;
  }

  /**
   * Creates an identity matrix (must be square NxN dimensions), basically just full of 1s.
   * @param n The rows/columns.
   * @returns The identity matrix.
   */
  public static identity<N extends number>(n: N): Matrix<N, N> {
    const mat = new Matrix(n, n);
    for (let i = 0; i < n; i++) {
      mat.elements[i * n + i] = 1;
    }

    return mat;
  }

  /**
   * Creates a zero'd matrix (just full of zeroes).
   * @param rows The number of rows.
   * @param cols The number of columns.
   * @returns The matrix.
   */
  public static zeros<N extends number, M extends number>(
    rows: N,
    cols: M,
  ): Matrix<N, M> {
    return new Matrix(rows, cols);
  }

  /**
   * Clones this matrix.
   * @returns The new cloned matrix.
   */
  public clone(): Matrix<N, M> {
    return new Matrix(this.rows, this.cols, this.elements);
  }

  /**
   * Transposes the matrix (swaps rows and columns, NxM -> MxN).
   * @returns The transposed matrix.
   */
  // TODO: fix.
  public transpose(): Matrix<M, N> {
    const result = new Matrix(
      this.cols as unknown as M,
      this.rows as unknown as N,
    );

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        result.set(c as number, r as number, this.get(r, c));
      }
    }

    return result;
  }

  /**
   * Multiplies this matrix with another.
   * @param other The other matrix.
   * @returns The product of the matrices.
   */
  public multiply<P extends number>(other: Matrix<M, P>): Matrix<N, P> {
    const resultRows = this.rows;
    const resultCols = other.cols;
    const sharedDim = this.cols; // which is also other.rows

    const resultElements = new Array(resultRows * resultCols).fill(0);

    for (let r = 0; r < resultRows; r++) {
      for (let c = 0; c < resultCols; c++) {
        let sum = 0;
        for (let k = 0; k < sharedDim; k++) {
          sum += this.get(r, k) * other.get(k, c);
        }
        resultElements[r * resultCols + c] = sum;
      }
    }

    return new Matrix<N, P>(resultRows, resultCols, resultElements);
  }

  /**
   * Adds another matrix of the exact same dimensions to this one element-wise.
   * @param other The other matrix.
   * @returns The result of the addition operation.
   */
  public add(other: Matrix<N, M>): Matrix<N, M> {
    const resultElements = this.elements.map(
      (val, idx) => val + other.elements[idx]!, // probably isnt undefined? might be a source of error later.
    );

    return new Matrix(this.rows, this.cols, resultElements);
  }

  /**
   * Subtracts another matrix of the exact same dimensions from this one element-wise.
   * @param other The other matrix.
   * @returns The result of the subtraction operation.
   */
  public sub(other: Matrix<N, M>): Matrix<N, M> {
    const resultElements = this.elements.map(
      (val, idx) => val - other.elements[idx]!, // probably isnt undefined? might be a source of error later.
    );

    return new Matrix(this.rows, this.cols, resultElements);
  }

  /**
   * Scales all elements of the matrix by a scalar value.
   * @param scalar The scalar value.
   * @returns The scaled matrix.
   */
  public scale(scalar: number): Matrix<N, M> {
    const resultElements = this.elements.map((val) => val * scalar);

    return new Matrix(this.rows, this.cols, resultElements);
  }

  /**
   * Checks if this matrix has identical values and dimensions to another matrix.
   * @param other The other matrix.
   * @returns Whether they are identical.
   */
  public equals(other: Matrix<number, number>): boolean {
    if (this.rows !== other.rows || this.cols !== other.cols) return false;
    return this.elements.every((val, idx) => val === other.elements[idx]);
  }
}

// Mostly static for projection matrices.
export class Matrix4 {
  // Faster to use Float32Array.
  // TODO Update above implementation to use Float32Array.
  public data = new Float32Array(16);

  constructor(
    elements: Float32Array | number[] = [
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ],
  ) {
    this.data.set(elements);
  }

  public static fromQuaternion(
    q: Quaternion,
    out: Matrix4 = new Matrix4(),
  ): Matrix4 {
    q.normalize();

    const x = q.x;
    const y = q.y;
    const z = q.z;
    const w = q.w;

    const twoX = x + x;
    const twoY = y + y;
    const twoZ = z + z;

    const twoWX = w * twoX;
    const twoWY = w * twoY;
    const twoWZ = w * twoZ;
    const twoXX = x * twoX;
    const twoXY = x * twoY;
    const twoXZ = x * twoZ;
    const twoYY = y * twoY;
    const twoYZ = y * twoZ;
    const twoZZ = z * twoZ;

    let outData = out.data;

    // Column 0
    outData[0] = 1 - twoYY - twoZZ;
    outData[1] = twoXY + twoWZ;
    outData[2] = twoXZ - twoWY;
    outData[3] = 0;

    // Column 1
    outData[4] = twoXY - twoWZ;
    outData[5] = 1 - twoXX - twoZZ;
    outData[6] = twoYZ + twoWX;
    outData[7] = 0;

    // Column 2
    outData[8] = twoXZ + twoWY;
    outData[9] = twoYZ - twoWX;
    outData[10] = 1 - twoXX - twoYY;
    outData[11] = 0;

    // Column 3
    outData[12] = 0;
    outData[13] = 0;
    outData[14] = 0;
    outData[15] = 1;

    return out;
  }

  public static fromVector3(v: Vector3, out: Matrix4 = new Matrix4()): Matrix4 {
    const x = v.x;
    const y = v.y;
    const z = v.z;

    let outData = out.data;

    // Column 0
    outData[0] = 1;
    outData[1] = 0;
    outData[2] = 0;
    outData[3] = 0;

    // Column 1
    outData[4] = 0;
    outData[5] = 1;
    outData[6] = 0;
    outData[7] = 0;

    // Column 2
    outData[8] = 0;
    outData[9] = 0;
    outData[10] = 1;
    outData[11] = 0;

    // Column 3
    outData[12] = x;
    outData[13] = y;
    outData[14] = z;
    outData[15] = 1;

    return out;
  }

  public static multiply(
    a: Matrix4,
    b: Matrix4,
    out: Matrix4 = new Matrix4(),
  ): Matrix4 {
    let outData = out.data;

    const aData = a.data;
    const bData = b.data;

    const a00 = aData[0]!,
      a01 = aData[1]!,
      a02 = aData[2]!,
      a03 = aData[3]!;
    const a10 = aData[4]!,
      a11 = aData[5]!,
      a12 = aData[6]!,
      a13 = aData[7]!;
    const a20 = aData[8]!,
      a21 = aData[9]!,
      a22 = aData[10]!,
      a23 = aData[11]!;
    const a30 = aData[12]!,
      a31 = aData[13]!,
      a32 = aData[14]!,
      a33 = aData[15]!;

    const b00 = bData[0]!,
      b01 = bData[1]!,
      b02 = bData[2]!,
      b03 = bData[3]!;
    const b10 = bData[4]!,
      b11 = bData[5]!,
      b12 = bData[6]!,
      b13 = bData[7]!;
    const b20 = bData[8]!,
      b21 = bData[9]!,
      b22 = bData[10]!,
      b23 = bData[11]!;
    const b30 = bData[12]!,
      b31 = bData[13]!,
      b32 = bData[14]!,
      b33 = bData[15]!;

    // Column 0
    outData[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    outData[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    outData[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    outData[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;

    // Column 1
    outData[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    outData[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    outData[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    outData[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;

    // Column 2
    outData[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    outData[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    outData[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    outData[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;

    // Column 3
    outData[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    outData[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    outData[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    outData[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

    return out;
  }

  public static getPerspectiveMatrix(
    fov: number,
    aspectRatio: number,
    near: number,
    far: number,
    out: Matrix4 = new Matrix4(),
  ): Matrix4 {
    if (near <= 0 || near === far) {
      console.warn("Invalid near/far values.");
      return out;
    }

    let outData = out.data;

    const f = 1.0 / Math.tan((fov * Math.PI) / 360);
    const rangeInverse = 1.0 / (near - far);

    // Column 0
    outData[0] = f / aspectRatio;
    outData[1] = 0;
    outData[2] = 0;
    outData[3] = 0;

    // Column 1
    outData[4] = 0;
    outData[5] = f;
    outData[6] = 0;
    outData[7] = 0;

    // Column 2
    outData[8] = 0;
    outData[9] = 0;
    outData[10] = (far + near) * rangeInverse;
    outData[11] = -1;

    // Column 3
    outData[12] = 0;
    outData[13] = 0;
    outData[14] = 2 * far * near * rangeInverse;
    outData[15] = 0;

    return out;
  }

  public static getOrthographicMatrix(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number = -1,
    far: number = 1,
    out: Matrix4 = new Matrix4(),
  ): Matrix4 {
    if (left === right) {
      console.warn("Invalid left/right values.");
      return out;
    }
    if (bottom === top) {
      console.warn("Invalid bottom/top values.");
      return out;
    }
    if (near === far) {
      console.warn("Invalid near/far values.");
      return out;
    }

    const inverseLeftRight = 1 / (left - right);
    const inverseBottomTop = 1 / (bottom - top);
    const inverseNearFar = 1 / (near - far);
    let outData = out.data;

    // Column 0
    outData[0] = -2 * inverseLeftRight;
    outData[1] = 0;
    outData[2] = 0;
    outData[3] = 0;

    // Column 1
    outData[4] = 0;
    outData[5] = -2 * inverseBottomTop;
    outData[6] = 0;
    outData[7] = 0;

    // Column 2
    outData[8] = 0;
    outData[9] = 0;
    outData[10] = 2 * inverseNearFar;
    outData[11] = 0;

    // Column 3
    outData[12] = (left + right) * inverseLeftRight;
    outData[13] = (top + bottom) * inverseBottomTop;
    outData[14] = (far + near) * inverseNearFar;
    outData[15] = 1;

    return out;
  }
}
