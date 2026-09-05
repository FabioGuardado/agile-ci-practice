import { useReducer } from 'react';
import {
  calculatorReducer,
  formatExpression,
  initialCalculatorState,
} from './calculatorLogic';
import type { Operator } from './calculatorLogic';
import './Calculator.css';

function Calculator() {
  const [state, dispatch] = useReducer(
    calculatorReducer,
    initialCalculatorState
  );

  const pressDigit = (digit: string) => dispatch({ type: 'digit', digit });
  const pressOperator = (operator: Operator) =>
    dispatch({ type: 'operator', operator });

  return (
    <div className="calculator">
      <div className="calculator-display" data-testid="calculator-display">
        {state.error ? 'Error' : formatExpression(state)}
      </div>
      <div className="calculator-buttons">
        <button type="button" onClick={() => dispatch({ type: 'allClear' })}>
          AC
        </button>
        <button type="button" onClick={() => dispatch({ type: 'clear' })}>
          C
        </button>
        <button type="button" onClick={() => pressOperator('/')}>
          /
        </button>
        <button type="button" onClick={() => pressOperator('*')}>
          *
        </button>

        <button type="button" onClick={() => pressDigit('7')}>
          7
        </button>
        <button type="button" onClick={() => pressDigit('8')}>
          8
        </button>
        <button type="button" onClick={() => pressDigit('9')}>
          9
        </button>
        <button type="button" onClick={() => pressOperator('-')}>
          -
        </button>

        <button type="button" onClick={() => pressDigit('4')}>
          4
        </button>
        <button type="button" onClick={() => pressDigit('5')}>
          5
        </button>
        <button type="button" onClick={() => pressDigit('6')}>
          6
        </button>
        <button type="button" onClick={() => pressOperator('+')}>
          +
        </button>

        <button type="button" onClick={() => pressDigit('1')}>
          1
        </button>
        <button type="button" onClick={() => pressDigit('2')}>
          2
        </button>
        <button type="button" onClick={() => pressDigit('3')}>
          3
        </button>
        <button
          type="button"
          className="calculator-equals"
          onClick={() => dispatch({ type: 'equals' })}
        >
          =
        </button>

        <button type="button" onClick={() => pressDigit('0')}>
          0
        </button>
        <button type="button" onClick={() => dispatch({ type: 'decimal' })}>
          .
        </button>
      </div>
    </div>
  );
}

export default Calculator;
