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
