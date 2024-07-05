import { Matrix } from './matrix.js';

const Operation = {
  ADD: 0,
  SUBSTRACT: 1,
  MULTIPLY: 2,
  DIVIDE: 3
};
const ShuffelAlgorithm = {
  DIAGONAL: 0,
  IDENTITY: 1,
  SCALAR: 2,
  LOWER_TRIANGULAR: 3,
  UPPER_TRIANGULAR: 4,
  SQUARE: 5
};
const Dimension = {
  ROW: 0,
  COL: 1,
  BOTH: 2
}

export class MatrixView {
  constructor(matrix_id) {
    this.matrixElement = document.getElementById(matrix_id);
    this.dimensions = this.#getMatrixDimensions(
      this.matrixElement.querySelector('.controls')
    );
    this.elements = this.matrixElement.querySelector('.elements');
    this.cols = 3;
    this.rows = 3;
    this.matrixContent = [];
    this.#generateMatrixElements();
    this.other = null;
    this.isB = false;
    this.bindingOperation = {value: Operation.ADD};
    this.#listenToControlButtons();
  }

  #getMatrixDimensions(matrixControls) {
    let dimensions = { 
      cols: matrixControls.querySelector('.cols p'),
      rows: matrixControls.querySelector('.rows p')
    };
  
    return dimensions;
  }

  #generateMatrixElements() {
    this.dimensions.cols.innerText = this.cols;
    this.dimensions.rows.innerText = this.rows;

    let vectorElement;
    let element;
    let vectorContnet = [];
    for(let i = 0; i < this.rows; i++) {
      vectorElement = createVectorElement();
      this.elements.appendChild(vectorElement);
      for(let j = 0; j < this.cols; j++) {
        element = createInputElement(`${i},${j}`);
        vectorElement.appendChild(element);
        vectorContnet.push(element);
      }
      this.matrixContent.push(vectorContnet);
      vectorContnet = [];
    }
  }

  #listenToControlButtons() {
    // Listen to add column
    const addColButton = this.dimensions.cols.nextElementSibling;
    addColButton.addEventListener('click', () => {
      this.addColumn();
      if (this.other) {
        if (this.bindingOperation.current === Operation.MULTIPLY) {
          if (!this.isB) this.other.addRow();
        } else {
          this.other.addColumn();
        }
      }
    });

    // Listen to remove column
    const removeColButton = this.dimensions.cols.previousElementSibling;
    removeColButton.addEventListener('click', () => {
      this.removeColumn();
      if (this.other) {
        if (this.bindingOperation.current === Operation.MULTIPLY) {
          if (!this.isB) this.other.removeRow();
        } else {
          this.other.removeColumn();
        }
      }
    });

    // Listen to add column
    const addRowButton = this.dimensions.rows.nextElementSibling;
    addRowButton.addEventListener('click', () => {
      this.addRow();
      if (this.other) {
        if (this.bindingOperation.current === Operation.MULTIPLY) {
          if (this.isB) this.other.addColumn();
        } else {
          this.other.addRow();
        }
      }
    });

    // Listen to remove column
    const removeRowButton = this.dimensions.rows.previousElementSibling;
    removeRowButton.addEventListener('click', () => {
      this.removeRow();
      if (this.other) {
        if (this.bindingOperation.current === Operation.MULTIPLY) {
          if (this.isB) this.other.removeColumn();
        } else {
          this.other.removeRow();
        }
      }
    });
  }

  addColumn() {
    if(this.cols == 10) return;

    const colIndex = this.cols; // Column to be added index
    this.cols++;

    this.dimensions.cols.innerText = this.cols;

    let vectorElement;
    let element;
    for(let i = 0; i < this.rows; i++) {
      vectorElement = this.matrixContent[i][0].parentElement;
      element = createInputElement(`${i},${colIndex}`);
      vectorElement.appendChild(element);
      this.matrixContent[i].push(element);
    }
  }

  removeColumn() {
    if(this.cols == 1) return;

    this.cols--;

    this.dimensions.cols.innerText = this.cols;

    let vectorElement;
    for(let i = 0; i < this.rows; i++) {
      vectorElement = this.matrixContent[i];
      vectorElement.at(-1).remove();
      vectorElement.pop();
    }
  }

  addRow() {
    if(this.rows == 10) return;

    const rowIndex = this.rows; // this is gonna be new row index
    this.rows++;

    this.dimensions.rows.innerText = this.rows;
    const vectorElement = createVectorElement();
    this.elements.appendChild(vectorElement);

    let element;
    let vectorContnet = [];
    for(let i = 0; i < this.cols; i++) {
      element = createInputElement(`${rowIndex},${i}`);
      vectorElement.appendChild(element);
      vectorContnet.push(element);
    }
    this.matrixContent.push(vectorContnet);
  }

  removeRow() {
    if(this.rows == 1) return;

    this.rows--;

    this.dimensions.rows.innerText = this.rows;

    let lastVector = this.matrixContent.at(-1)[0].parentElement;
    lastVector.remove();
    this.matrixContent.pop();
  }

  shuffle(shuffelAlgorithm) {

    switch (shuffelAlgorithm) {
      // Diagonal Matrix
      case ShuffelAlgorithm.DIAGONAL:
        for(let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.matrixContent[i][j].value = (i === j) ? getRandomInt(41) - 20 : 0;
          }
        }
        break;

      // Identity Matrix
      case ShuffelAlgorithm.IDENTITY:
        for(let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.matrixContent[i][j].value = (i == j) ? 1 : 0;
          }
        }
        break;

      // Scalar Matrix
      case ShuffelAlgorithm.SCALAR:
        const scalarValue = getRandomInt(41) - 20;
        for(let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.matrixContent[i][j].value = (i == j)
                ? scalarValue === 1
                    ? 0
                    : scalarValue
                : 0;
          }
        }
        break;

      // Lower Triangular Matrix
      case ShuffelAlgorithm.LOWER_TRIANGULAR:
        for(let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.matrixContent[i][j].value = (i > j) ? getRandomInt(41) - 20 : '0';
          }
        }
        break;

      // Upper Triangular Matrix
      case ShuffelAlgorithm.UPPER_TRIANGULAR:
        for(let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.matrixContent[i][j].value = (i < j) ? getRandomInt(41) - 20 : '0';
          }
        }
        break;

      //Square Matrix
      case ShuffelAlgorithm.SQUARE:
        for(let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.matrixContent[i][j].value = getRandomInt(41) - 20;
          }
        }
        break;
    }
  }

  getValues() {
    return this.matrixContent.map(vector => vector.map(element => Number(element.value)));
  }

  bindOtherMatrixAsA(other, operation) {
    if (other instanceof MatrixView) {
      this.other = other;
      this.bindingOperation = operation;
      this.isB = true;
    }
  }

  bindOtherMatrix(other, operation) {
    if (other instanceof MatrixView) {
      this.other = other;
      this.bindingOperation = operation;

      other.bindOtherMatrixAsA(this, operation);
    }
  }

  #hasValidDimensions(operation) {
    if (operation === Operation.MULTIPLY) {
      return this.cols === this.other.rows;
    } else {
      return this.cols === this.other.cols && this.rows === this.other.rows;
    }
  }

  getMatrixOrder() {
    return `${this.rows} x ${this.cols}`
  }

  #correctRows(newValue) {
    if (this.rows > newValue) {
      for(let i = this.rows; i > newValue; i--) {
        this.removeRow();
      }
    } else if (this.rows < newValue) {
      for(let i = this.rows; i < newValue; i++) {
        this.addRow();
      }
    }
  }

  #correctColumns(newValue) {
    if (this.cols > newValue) {
      for(let i = this.cols; i > newValue; i--) {
        this.removeColumn();
      }
    } else if (this.cols < newValue) {
      for(let i = this.cols; i < newValue; i++) {
        this.addColumn();
      }
    }
  }

  #handleDimensionErrorOption(option, operation) {
    if (this.isB) {
      matrixA = this.other;
      matrixB = this;
    }
    else {
      matrixA = this;
      matrixB = this.other;
    }

    let newValue;
    if (operation === Operation.MULTIPLY) {
      if (option === 0) {
        newValue = matrixA.cols;
        matrixB.#correctRows(newValue);
      }
      else if (option === 1) {
        newValue = matrixB.rows;
        matrixA.#correctColumns(newValue);
      }
    } else {
      if (option === 0) {
        newValue = {rows: matrixA.rows, cols: matrixA.cols};
        matrixB.#correctRows(newValue.rows);
        matrixB.#correctColumns(newValue.cols);
      }
      else if (option === 1) {
        newValue = {rows: matrixB.rows, cols: matrixB.cols};
        matrixA.#correctRows(newValue.rows);
        matrixA.#correctColumns(newValue.cols);
      }
    }
  }

  #showDimensionsErrorDialog(message, option1, option2, operation) {
    const errorModal = document.getElementById('error-modal');
    errorModal.querySelector('p').innerText = message;

    const btn1 = errorModal.querySelector('#option-a');
    const btn2 = errorModal.querySelector('#option-b');
    const cancelBtn = errorModal.querySelector('#cancel');
    btn1.innerText = option1; btn2.innerText = option2;

    cancelBtn.addEventListener('click', () => {
      errorModal.close();
    });
    btn1.addEventListener('click', () => {
      this.#handleDimensionErrorOption(0, operation);
      errorModal.returnValue = 1;
      errorModal.close();
    });
    btn2.addEventListener('click', () => {
      this.#handleDimensionErrorOption(1, operation);
      errorModal.returnValue = 1;
      errorModal.close();
    });
    
    errorModal.showModal();
  }

  checkDimensionsForOperatoin(operation) {
    let matrixA, matrixB;
    
    if (!this.other) {
      console.log('Not bound with other matrix, no worries');
      return true;
    }

    if (this.isB) {
      matrixA = this.other;
      matrixB = this;
    }
    else {
      matrixA = this;
      matrixB = this.other;
    }
    
    if (matrixA.#hasValidDimensions(operation)) return true;

    let message;
    if(operation === Operation.MULTIPLY) {
      const colsA = matrixA.cols;
      const rowsB = matrixB.rows;

      message = `To continue, you should choose Matrix A columns number: ${colsA}, or Matrix B rows number: ${rowsB}, to apply to both.`;

      this.#showDimensionsErrorDialog(message, colsA, rowsB, operation);
    }
    else {
      const orderA = matrixA.getMatrixOrder();
      const orderB = matrixB.getMatrixOrder();

      message = `To continue, you should choose Matrix A order: ${orderA}, or Matrix B order: ${orderB}, to apply to both.`;

      this.#showDimensionsErrorDialog(message, orderA, orderB, operation);
    }
  }

  #appendElements(elements) {
    this.matrixElement.appendChild(elements);
  }

  #setMatrixOrder() {
    this.dimensions.rows.innerText = this.rows;
    this.dimensions.cols.innerText = this.cols;
  }

  swapWithOtherMatrix() {
    if (this.other) {
      this.isB = !this.isB;
      this.other.isB = !this.other.isB;

      const parent = document.querySelector('.main');
      const matrices = parent.querySelectorAll('.matrix');
      const thisElement = matrices[0];
      const otherElement = matrices[1];

      parent.replaceChild(otherElement, thisElement);
      parent.appendChild(thisElement);
      // parent.replaceChild(thisElement, this.other.matrixElement);
    }
  }

  addWithOther() {
    if (this.other) {
      const matrixA = new Matrix(this.getValues());
      const matrixB = new Matrix(this.other.getValues());

      return matrixA.add(matrixB).toArray();
    }
  }

  substractWithOther() {
    if (this.other) {
      let matrixA, matrixB;
      if (this.isB) {
        matrixA = new Matrix(this.other.getValues());
        matrixB = new Matrix(this.getValues());
      } else {
        matrixA = new Matrix(this.getValues());
        matrixB = new Matrix(this.other.getValues());
      }

      return matrixA.substract(matrixB).toArray();
    }
  }

  multiplyWithOther() {
    if (this.other) {
      let matrixA, matrixB;
      if (this.isB) {
        matrixA = new Matrix(this.other.getValues());
        matrixB = new Matrix(this.getValues());
      } else {
        matrixA = new Matrix(this.getValues());
        matrixB = new Matrix(this.other.getValues());
      }

      return matrixA.multiply(matrixB).toArray();
    }
  }

  divideWithOther() {
    if (this.other) {
      let matrixA, matrixB;
      if (this.isB) {
        matrixA = new Matrix(this.other.getValues());
        matrixB = new Matrix(this.getValues());
      } else {
        matrixA = new Matrix(this.getValues());
        matrixB = new Matrix(this.other.getValues());
      }

      return matrixA.divide(matrixB).toArray();
    }
  }
}

// Function Definition
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createVectorElement() {
  const vectorElement = document.createElement('div');
  vectorElement.classList.add('vector');

  return vectorElement;
}

function createInputElement(placeholder) {
  const newInput = document.createElement('input');
  newInput.type = 'number';
  newInput.placeholder = placeholder;

  return newInput;
}

function createPElement(content) {
  const newP = document.createElement('p');
  newP.innerText = content;

  return newP;
}

function createH2Element(content) {
  const newH2 = document.createElement('h2');
  newH2.innerText = content;

  return newH2;
}

function createDialogButton(dialog, content, className = 'primary') {
  const newButton = document.createElement('button');
  newButton.innerText = content;
  newButton.classList.add('btn');
  newButton.classList.add(className);
  newButton.addEventListener('click', () => {
    dialog.close();
  });

  return newButton;
}
