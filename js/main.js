import { Calculator } from './calculator.js';
import { MatrixView } from './matrix_view.js';

const matrixAView = new MatrixView('matrixA');
const matrixBView = new MatrixView('matrixB');
const MatrixCalculator = new Calculator(matrixAView, matrixBView);
