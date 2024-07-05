
// Base class of all Matrix class exceptions.
class MatrixException extends Error {
  constructor(cause) {
    super(cause);
    this.cause = cause;
  }
}

// An exception that is thrown when invert is called on a non-invertable matrix.
class MatrixNoInverseException extends MatrixException {
  constructor(cause = "No inverse for this matrix") {
    super(cause);
  }
}

// An exception that is thrown if the dimensions are invalid for the operation.
class MatrixInvalidDimensions extends MatrixException {
  constructor(cause = "Invalid dimensions") {
    super(cause);
  }
}

// An exception that is thrown if the operations is not supported on the type passed.
class MatrixUnsupportedOperation extends MatrixException {
  constructor(cause = "Unsupported operation") {
    super(cause);
  }
}

export class Matrix {
  #values;
  // Constructs a matrix from a 2D array value.
  // Example:
  // let a = new Matrix([[1.0,2.0],[3.0,4.0],[5.0,6.0]])
  constructor(values) {
    this.#values = values || [];
  }

  toArray() {
    return this.#values;
  }

  order() {
    return `(${this.#values.length} x ${this.#values[0].length})`;
  }

  isEmpty() {
    return Boolean(this.#values);
  }

  fill(m, n, fill = 0.0) {
    this.#values = this.#createStore(m, n, fill);
    return this;
  }

  eye(size) {
    this.#values = this.#createStore(size, size, 0.0);
    for (let i = 0; i < size; i++) {
      this.#values[i][i] = 1.0;
    }
  }

  // Returns the number of rows
  get m() {
    return this.#values.length;
  }

  // Returns the number of columns
  get n() {
    return this.#values[0].length;
  }

  get(index) {
    return this.#values[index];
  }

  // Multiply a Matrix with a Matrix or a scalar
  // Example:
  // let a = new Matrix().eye(2);
  // let b = new Matrix().fill(2, 2, 10);
  // console.log(a.multiply(b));
  // Throws a MatrixUnsupportedOperation error if the
  // requested multiplication is not valid. For example
  // if matrices with the wrong dimensions are passed in.
  multiply(other) {
    let cutDot = (other, thisRow, otherColumn) => {
      let sum = 0.0;
      for (let i = 0; i < this.n; i++) {
        sum += this.get(thisRow)[i] * other.get(i)[otherColumn];
      }
      return sum;
    }

    if (other instanceof Matrix) {
      if (this.n === other.m) {
        let toReturn = new Matrix().fill(this.m, other.n);
        for (let r = 0; r < toReturn.m; r++) {
          for (let c = 0; c < toReturn.n; c++) {
            toReturn.get(r)[c] = cutDot(other, r, c);
          }
        }
        return toReturn;
      } else {
        throw new MatrixInvalidDimensions();
      }
    } else if (typeof other === 'number') {
      // scalar
      return this.map((x) => x * other);
    } else {
      throw new MatrixUnsupportedOperation();
    }
  }

  // Add two matrices of same dimensions.
  // Throws MatrixInvalidDimensions if dimensions do not match.
  add(other) {
    if (this.m != other.m || this.n != other.n) {
      throw new MatrixInvalidDimensions();
    }
    let toReturn = new Matrix().fill(this.m, this.n);
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        toReturn.get(i)[j] = this.get(i)[j] + other.get(i)[j];
      }
    }
    return toReturn;
  }

  // Subtract two matrices of same dimensions.
  // Throws MatrixInvalidDimensions if dimensions do not match.
  substract(other) {
    if (this.m != other.m || this.n != other.n) {
      throw new MatrixInvalidDimensions();
    }
    let toReturn = new Matrix().fill(this.m, this.n);
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        toReturn.get(i)[j] = this.get(i)[j] - other.get(i)[j];
      }
    }
    return toReturn;
  }

  // Applies bitwise division for two matrices of same dimensions.
  // Throws MatrixInvalidDimensions if dimensions do not match.
  divide(other) {
    if (this.m != other.m || this.n != other.n) {
      throw new MatrixInvalidDimensions();
    }
    let toReturn = new Matrix().fill(this.m, this.n);
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        toReturn.get(i)[j] = this.get(i)[j] / other.get(i)[j];
      }
    }
    return toReturn;
  }

  negate() {
    return this.map((x) => -x);
  }

  #isClose(a, b, relTol = 1e-9, absTol = 0.0) {
    return Math.abs(a - b) <= Math.max(relTol * Math.max(Math.abs(a), Math.abs(b)), absTol);
  }

  // Equality check for each element in the matrix.
  equals(other) {
    if (other instanceof Matrix) {
      if (this.m == other.m && this.n == other.n) {
        for (let i = 0; i < this.m; i++) {
          for (let j = 0; j < this.n; j++) {
            if (!this.#isClose(this.get(i)[j], other.get(i)[j])) {
              return false;
            }
          }
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Transposes the matrix
  transpose() {
    let toReturn = new Matrix().fill(this.n, this.m);
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        toReturn.get(j)[i] = this.get(i)[j];
      }
    }
    return toReturn;
  }

  // Cuts the given column m and row n from the matrix and returns the remainder.
  cut(m, n) {
    let cm = new Matrix().fill(this.m - 1, this.n - 1, 0.0);

    let dr = 0;
    for (let r = 0; r < this.m; r++) {
      let dc = 0;
      if (r == m) {
        continue;
      }
      for (let c = 0; c < this.n; c++) {
        if (c == n) {
          continue;
        }
        cm.get(dr)[dc] = this.get(r)[c];
        dc++;
      }
      dr++;
    }

    return cm;
  }

  // Calculates the determinant of the matrix.
  det() {
    if (this.m != this.n) {
      throw new Error("MatrixInvalidDimensions");
    }

    if (this.m < 1) {
      throw new Error("MatrixInvalidDimensions");
    }

    if (this.m == 1) {
      return this.get(0)[0];
    }

    if (this.m == 2) {
      return this.get(0)[0] * this.get(1)[1] - this.get(1)[0] * this.get(0)[1];
    }

    // should really pick a row or column with a lot of zeros.
    let bestColumnCount = 0;
    let bestColumn = -1;
    for (let c = 0; c < this.n; c++) {
      let count = 0;
      for (let r = 0; r < this.m; r++) {
        if (this.get(r)[c] == 0.0) {
          count++;
        }
      }
      if (count >= bestColumnCount) {
        bestColumnCount = count;
        bestColumn = c;
      }
    }

    let bestRowCount = 0;
    let bestRow = -1;
    for (let r = 0; r < this.m; r++) {
      let count = 0;
      for (let c = 0; c < this.n; c++) {
        if (this.get(r)[c] == 0.0) {
          count++;
        }
      }
      if (count >= bestRowCount) {
        bestRowCount = count;
        bestRow = r;
      }
    }

    if (bestColumnCount > bestRowCount) {
      let det = 0.0;
      let c = bestColumn;
      for (let r = 0; r < this.m; r++) {
        let v = this.get(r)[c];
        if (v != 0.0) {
          let sub = this.cut(r, c);
          let coFactor = Math.pow(-1, r + c) * sub.det();
          det += v * coFactor;
        }
      }
      return det;
    } else {
      let det = 0.0;
      let r = bestRow;
      for (let c = 0; c < this.n; c++) {
        let v = this.get(r)[c];
        if (v != 0.0) {
          let sub = this.cut(r, c);
          let coFactor = Math.pow(-1, r + c) * sub.det();
          det += v * coFactor;
        }
      }
      return det;
    }
  }

  // Calculates the cofactors of the matrix.
  coFactors() {
    if (this.m != this.n) {
      throw new Error("MatrixInvalidDimensions");
    }

    if (this.m == 1) {
      return new Matrix().fill(1, 1, 1);
    }

    if (this.m == 2) {
      return new Matrix().fill(2, 2, [[this.get(1)[1], -this.get(0)[1]], [-this.get(1)[0], this.get(0)[0]]]);
    }

    let cf = new Matrix().fill(this.m, this.n, 0.0);

    for (let r = 0; r < this.m; r++) {
      for (let c = 0; c < this.n; c++) {
        let sub = this.cut(r, c);
        let v = Math.pow(-1, r + c) * sub.det();
        cf.get(r)[c] = v;
      }
    }

    return cf;
  }

  // Checks if the matrix is invertible.
  isInversable() {
    return Math.abs(this.det()) > Number.EPSILON;
  }

  // Calculates the inverse of the matrix.
  inverse() {
    let d = this.det();
    if (!this.isInversable()) {
      throw new Error("MatrixNoInverseException");
    }

    if (this.m == 2) {
      let i = new Matrix().fill(this.m, this.n);
      i.get(0)[0] = this.get(1)[1];
      i.get(1)[1] = this.get(0)[0];
      i.get(0)[1] = -1.0 * this.get(0)[1];
      i.get(1)[0] = -1.0 * this.get(1)[0];
      return i.multiply(1 / d);
    } else {
      let i = this.coFactors();
      i = i.transpose();
      return i.multiply(1 / d);
    }
  }

  // Calculates the trace of the matrix.
  trace() {
    if (this.m != this.n) {
      throw new Error("MatrixInvalidDimensions");
    }
    let tr = 0.0;
    for (let i = 0; i < this.m; i++) {
      tr += this.get(i)[i];
    }
    return tr;
  }

  // Converts the matrix to a string.
  toString() {
    return JSON.stringify(this.#values);
  }

  // Creates a deep copy of the matrix.
  copy() {
    let storage = [];
    for (let i = 0; i < this.m; i++) {
      storage.push(this.get(i).slice());
    }
    return new Matrix(storage);
  }

  map(f) {
    let toReturn = new Matrix().fill(this.m, this.n);
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        toReturn.get(i)[j] = f(this.get(i)[j]);
      }
    }
    return toReturn;
  }


  #createStore(m, n, fill) {
    let arr = [];
    for(let i = 0; i < m; i++) {
      let row = [];
      for(let j = 0; j < n; j++) {
        row.push(fill);
      }
      arr.push(row);
    }
    return arr;
  }
}