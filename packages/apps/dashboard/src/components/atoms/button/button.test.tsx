import { act, fireEvent, render, screen } from '@testing-library/react';
import { theme } from '@src/components/theme';
import React from 'react';
import { Button } from './button.component';

describe('<Button />', () => {
  it('should render with text and primary styling', () => {
    const { container } = render(
      <Button buttonStyle="primary">Hello World</Button>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Hello World');

    expect(container.firstChild).toHaveStyleRule(
      'background',
      theme.colors.blue
    );
  });

  it('should render with text and secondary styling', () => {
    const { container } = render(
      <Button buttonStyle="secondary">Hello World</Button>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Hello World');
    expect(container.firstChild).toHaveStyleRule(
      'background',
      theme.colors.white
    );
  });

  it('should render with text and teriary styling', () => {
    const { container } = render(
      <Button buttonStyle="tertiary">Hello World</Button>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Hello World');
    expect(container.firstChild).toHaveStyleRule(
      'background',
      theme.colors.white
    );
  });

  it('should render with text and delete styling', () => {
    const { container } = render(
      <Button buttonStyle="delete">Hello World</Button>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Hello World');
    expect(container.firstChild).toHaveStyleRule(
      'background',
      theme.colors.red
    );
  });

  it('should register click event', () => {
    const onClick = jest.fn();

    render(
      <Button buttonStyle="primary" onClick={onClick}>
        Hello World
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toBeCalledTimes(1);
  });

  it('should prevent double click', async () => {
    jest.useFakeTimers();

    const onClick = jest.fn();

    render(
      <Button buttonStyle="primary" onClick={onClick} preventDoubleClick>
        Hello World
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onClick).toBeCalledTimes(1);

    onClick.mockClear();

    fireEvent.click(screen.getByRole('button'));
    act(() => {
      jest.advanceTimersByTime(500);
      fireEvent.click(screen.getByRole('button'));
      jest.advanceTimersByTime(500);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toBeCalledTimes(2);
      jest.advanceTimersByTime(1000);
    });
  });

  it('should disable click event', () => {
    const onClick = jest.fn();

    render(
      <Button buttonStyle="primary" onClick={onClick} disabled>
        Hello World
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toBeCalledTimes(0);
  });
});
