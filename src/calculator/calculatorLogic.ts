export type Operator = '+' | '-' | '*' | '/';

export type CalculatorState = {
  display: string;
  previousValue: number | null;
  operator: Operator | null;
  overwrite: boolean;
  error: boolean;
};

export type CalculatorAction =
  | { type: 'digit'; digit: string }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'clear' }
  | { type: 'allClear' };

export const initialCalculatorState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  overwrite: true,
  error: false,
};

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  return a / b;
}

export function formatExpression(state: CalculatorState): string {
  if (state.operator === null) {
    return state.display;
  }
  if (state.overwrite) {
    return `${state.previousValue} ${state.operator}`;
  }
  return `${state.previousValue} ${state.operator} ${state.display}`;
}

function applyOperator(operator: Operator, a: number, b: number): number {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
  }
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'allClear':
      return initialCalculatorState;

    case 'clear': {
      if (state.error) {
        return initialCalculatorState;
      }
      return { ...state, display: '0', overwrite: true };
    }

    case 'digit': {
      const base = state.error ? initialCalculatorState : state;
      const nextDisplay = base.overwrite
        ? action.digit
        : base.display + action.digit;
      return { ...base, display: nextDisplay, overwrite: false, error: false };
    }

    case 'decimal': {
      const base = state.error ? initialCalculatorState : state;
      if (base.overwrite) {
        return { ...base, display: '0.', overwrite: false, error: false };
      }
      if (base.display.includes('.')) {
        return base;
      }
      return { ...base, display: base.display + '.', error: false };
    }

    case 'operator': {
      if (state.error) {
        return state;
      }
      const current = Number(state.display);
      if (state.operator !== null && !state.overwrite) {
        const previous = state.previousValue ?? 0;
        const result = applyOperator(state.operator, previous, current);
        if (!Number.isFinite(result)) {
          return { ...initialCalculatorState, display: 'Error', error: true };
        }
        return {
          display: String(result),
          previousValue: result,
          operator: action.operator,
          overwrite: true,
          error: false,
        };
      }
      return {
        ...state,
        previousValue: current,
        operator: action.operator,
        overwrite: true,
      };
    }

    case 'equals': {
      if (state.error) {
        return state;
      }
      if (state.operator === null || state.previousValue === null) {
        return state;
      }
      const current = Number(state.display);
      const result = applyOperator(
        state.operator,
        state.previousValue,
        current
      );
      if (!Number.isFinite(result)) {
        return { ...initialCalculatorState, display: 'Error', error: true };
      }
      return {
        display: String(result),
        previousValue: null,
        operator: null,
        overwrite: true,
        error: false,
      };
    }
  }
}
