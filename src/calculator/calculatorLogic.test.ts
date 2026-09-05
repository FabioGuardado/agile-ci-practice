import { describe, expect, it } from 'vitest';
import {
  add,
  calculatorReducer,
  divide,
  formatExpression,
  initialCalculatorState,
  multiply,
  subtract,
  type CalculatorState,
} from './calculatorLogic';

describe('arithmetic', () => {
  it('adds numbers, including negatives and decimals', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-2, 3)).toBe(1);
    expect(add(1.5, 2.5)).toBe(4);
  });

  it('subtracts numbers, including negatives and decimals', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(3, 5)).toBe(-2);
    expect(subtract(1.5, 0.5)).toBe(1);
  });

  it('multiplies numbers, including negatives and decimals', () => {
    expect(multiply(4, 3)).toBe(12);
    expect(multiply(-4, 3)).toBe(-12);
    expect(multiply(1.5, 2)).toBe(3);
  });

  it('divides numbers, including negatives and decimals', () => {
    expect(divide(6, 3)).toBe(2);
    expect(divide(-6, 3)).toBe(-2);
    expect(divide(5, 2)).toBe(2.5);
  });
});

describe('calculatorReducer', () => {
  function press(
    state: CalculatorState,
    ...actions: Parameters<typeof calculatorReducer>[1][]
  ): CalculatorState {
    return actions.reduce(calculatorReducer, state);
  }

  it('builds up the display as digits are pressed', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '1' },
      { type: 'digit', digit: '2' },
      { type: 'digit', digit: '3' }
    );
    expect(state.display).toBe('123');
  });

  it('inserts a single decimal point and ignores further presses', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '5' },
      { type: 'decimal' },
      { type: 'digit', digit: '5' },
      { type: 'decimal' }
    );
    expect(state.display).toBe('5.5');
  });

  it('evaluates the pending operation when chaining operators', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'operator', operator: '+' }
    );
    expect(state.display).toBe('8');
    expect(state.previousValue).toBe(8);
    expect(state.operator).toBe('+');
  });

  it('computes the result on equals', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '2' },
      { type: 'equals' }
    );
    expect(state.display).toBe('10');
    expect(state.operator).toBeNull();
    expect(state.previousValue).toBeNull();
  });

  it('treats a repeated equals with no new input as a no-op', () => {
    const afterEquals = press(
      initialCalculatorState,
      { type: 'digit', digit: '7' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'equals' }
    );
    const state = press(afterEquals, { type: 'equals' });
    expect(state).toEqual(afterEquals);
  });

  it('enters an error state on divide by zero', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '0' },
      { type: 'equals' }
    );
    expect(state.error).toBe(true);
    expect(state.display).toBe('Error');
  });

  it('recovers from an error state on the next digit press', () => {
    const errorState = press(
      initialCalculatorState,
      { type: 'digit', digit: '8' },
      { type: 'operator', operator: '/' },
      { type: 'digit', digit: '0' },
      { type: 'equals' }
    );
    const state = calculatorReducer(errorState, { type: 'digit', digit: '4' });
    expect(state.error).toBe(false);
    expect(state.display).toBe('4');
  });

  it('clears only the current entry with clear', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'clear' }
    );
    expect(state.display).toBe('0');
    expect(state.operator).toBe('+');
    expect(state.previousValue).toBe(5);
  });

  it('resets everything with allClear', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'allClear' }
    );
    expect(state).toEqual(initialCalculatorState);
  });
});

describe('formatExpression', () => {
  function press(
    state: CalculatorState,
    ...actions: Parameters<typeof calculatorReducer>[1][]
  ): CalculatorState {
    return actions.reduce(calculatorReducer, state);
  }

  it('shows just the current entry before any operator is pressed', () => {
    const state = press(initialCalculatorState, {
      type: 'digit',
      digit: '7',
    });
    expect(formatExpression(state)).toBe('7');
  });

  it('shows the operand and operator before the second operand is entered', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '7' },
      { type: 'operator', operator: '+' }
    );
    expect(formatExpression(state)).toBe('7 +');
  });

  it('shows the full expression while the second operand is being entered', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '7' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' }
    );
    expect(formatExpression(state)).toBe('7 + 3');
  });

  it('shows only the result once equals is pressed', () => {
    const state = press(
      initialCalculatorState,
      { type: 'digit', digit: '7' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'equals' }
    );
    expect(formatExpression(state)).toBe('10');
  });
});
