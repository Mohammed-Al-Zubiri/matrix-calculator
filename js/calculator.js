import { Matrix } from './matrix.js';
import { MatrixView } from './matrix_view.js';

const Operation = {
  ADD: 0,
  SUBSTRACT: 1,
  MULTIPLY: 2,
  DIVIDE: 3
};

export class Calculator {
  constructor(matrix1, matrix2) {
    this.matrix1 = matrix1;
    this.matrix2 = matrix2;
    this.operationButtons = document.querySelectorAll('.op-btn');
    this.operation = {current: Operation.ADD, rejected: null};;
    this.solution;
    
    
    // Add Calculator Button Listeners
    this.#addShuffleButtonListener();
    this.#addSolveButtonListener();
    this.#addOperationButtonsListener();
    this.#addSwapButtonListener();
    // Dialog Listeners
    this.#addErrorModalListener();

    matrix1.bindOtherMatrix(matrix2, this.operation);
  }

  #addShuffleButtonListener() {
    // Shuffle Matrices Values when Shuffle button is clicked
    document.querySelector('.shuffle').addEventListener('click', () => {
      this.matrix1.shuffle(getRandomInt(6));
      this.matrix2.shuffle(getRandomInt(6));
    });
  }

  #addSolveButtonListener() {
    document.querySelector('.solve').addEventListener('click', () => {
      
      switch(this.operation.current) {
        case Operation.ADD:
          this.solution = this.matrix1.addWithOther();
          break;
        
        case Operation.SUBSTRACT:
          this.solution = this.matrix1.substractWithOther();
          break;
        
        case Operation.MULTIPLY:
          this.solution = this.matrix1.multiplyWithOther();
          break;
        
        case Operation.DIVIDE:
          this.solution = this.matrix1.divideWithOther();
          break;
      }

      console.log(this.solution);
      // shuffleElementsWithRandomValues(matrixB.elements);

      this.#showSolutionMatrix();
    });

  }

  #showSolutionMatrix() {
    const solutionElement = document.getElementById('solution')
    const solMatrix = solutionElement.querySelector('.sol-matrix');

    // let vector;
    solMatrix.style.gridTemplateColumns = `repeat(${this.solution[0].length}, 1fr)`;
    solMatrix.innerHTML = '';
    for(let i = 0; i < this.solution.length; i++) {
      for(let j = 0; j < this.solution[0].length; j++) {
        solMatrix.appendChild(createPElement(this.solution[i][j].toFixed(2)));
      }
    }

    solutionElement.querySelector('h3').innerText = `Solution: (${this.solution.length} x ${this.solution[0].length})`;
  }

  #addOperationButtonsListener() {
    for(let i = 0; i < this.operationButtons.length; i++) {
      this.operationButtons[i].addEventListener('click', () => {
        if (this.matrix2.checkDimensionsForOperatoin(i)) {
          console.log(this.matrix1, this.matrix2);
          this.#selectOperation(i);
        } else {
          this.operation.rejected = i;
        }
      });
    }
  }

  #selectOperation(op) {
    this.operationButtons[this.operation.current].classList.remove('selected'); // unselect previous operation
    this.operationButtons[op].classList.add('selected'); // select new operation
    this.operation.current = op;
  }

  #addSwapButtonListener() {
    const swapButton = document.querySelector('#swap');
    swapButton.addEventListener('click', () => {
      console.log('hi');
      this.matrix1.swapWithOtherMatrix();
      swapButton.classList.toggle('clicked');
    });
  }

  #addErrorModalListener() {
    const errorModal = document.getElementById('error-modal');
    errorModal.addEventListener('close', () => {
      if (errorModal.returnValue == 1) {
        this.#selectOperation(this.operation.rejected);
      }
    });
  }
}

// Function Definitions
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createPElement(content) {
  const newP = document.createElement('p');
  newP.innerText = content

  return newP;
}