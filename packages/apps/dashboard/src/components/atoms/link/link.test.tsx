import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { theme } from '@src/components/theme';

import { Link } from './link.component';

describe('<Link />', () => {
  it('Should render with text and default styling', () => {
    const { container } = render(<Link>Hello World</Link>);

    expect(container.firstChild).toHaveTextContent('Hello World');

    expect(container.firstChild).toHaveStyleRule(
      'color',
      theme.textColors.blue
    );
  });

  it('Should render with text and blue styling', () => {
    const { container } = render(<Link linkStyle="blue">Hello World</Link>);

    expect(container.firstChild).toHaveTextContent('Hello World');

    expect(container.firstChild).toHaveStyleRule(
      'color',
      theme.textColors.blue
    );
  });

  it('Should render with text and red styling', () => {
    const { container } = render(<Link linkStyle="red">Hello World</Link>);

    expect(container.firstChild).toHaveTextContent('Hello World');

    expect(container.firstChild).toHaveStyleRule('color', theme.textColors.red);
  });

  it('Should render with text and black styling', () => {
    const { container } = render(<Link linkStyle="black">Hello World</Link>);

    expect(container.firstChild).toHaveTextContent('Hello World');

    expect(container.firstChild).toHaveStyleRule(
      'color',
      theme.textColors.gray
    );
  });

  it('Should register click event', () => {
    const onClick = jest.fn();

    render(<Link onClick={onClick}>Hello World</Link>);

    fireEvent.click(screen.getByRole('link'));
    expect(onClick).toBeCalledTimes(1);
  });

  it('Should disable onClick', () => {
    const onClick = jest.fn();

    render(
      <Link onClick={onClick} disableOnClick>
        Hello World
      </Link>
    );

    expect(screen.getByRole('link')).toHaveTextContent('Hello World');
    fireEvent.click(screen.getByRole('link'));
    expect(onClick).toBeCalledTimes(0);
  });
});
