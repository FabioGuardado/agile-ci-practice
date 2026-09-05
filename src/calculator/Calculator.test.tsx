import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';

function getDisplay() {
  return screen.getByTestId('calculator-display');
}

describe('Calculator', () => {
  it('shows 0 initially', () => {
    render(<Calculator />);
    expect(getDisplay()).toHaveTextContent('0');
  });

  it('shows digits as they are pressed', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '3' }));

    expect(getDisplay()).toHaveTextContent('123');
  });

  it('computes 7 + 3 = 10', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '7' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(getDisplay()).toHaveTextContent('10');
  });

  it('shows the full expression while entering it, then just the result', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '7' }));
    expect(getDisplay()).toHaveTextContent('7');

    await user.click(screen.getByRole('button', { name: '+' }));
    expect(getDisplay()).toHaveTextContent('7 +');

    await user.click(screen.getByRole('button', { name: '3' }));
    expect(getDisplay()).toHaveTextContent('7 + 3');

    await user.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('10');
  });

  it('handles a decimal point entry', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '.' }));
    await user.click(screen.getByRole('button', { name: '5' }));

    expect(getDisplay()).toHaveTextContent('5.5');
  });

  it('shows an error on divide by zero and recovers on the next digit', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '8' }));
    await user.click(screen.getByRole('button', { name: '/' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(getDisplay()).toHaveTextContent('Error');

    await user.click(screen.getByRole('button', { name: '4' }));

    expect(getDisplay()).toHaveTextContent('4');
  });

  it('resets the display to 0 on clear and all-clear', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '4' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: 'AC' }));

    expect(getDisplay()).toHaveTextContent('0');
  });
});
