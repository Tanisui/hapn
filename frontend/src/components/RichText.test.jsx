import { render } from '@testing-library/react';
import RichText from './RichText';

describe('RichText', () => {
  it('renders **wrapped** segments as <strong>', () => {
    const { container } = render(<RichText text="go on, **make it hap’n!**" />);
    expect(container.querySelector('strong').textContent).toBe('make it hap’n!');
    expect(container.firstChild.textContent).toBe('go on, make it hap’n!');
  });

  it('renders a <p> by default and honors the as prop', () => {
    const { container, rerender } = render(<RichText text="plain" />);
    expect(container.firstChild.tagName).toBe('P');
    rerender(<RichText as="span" text="plain" />);
    expect(container.firstChild.tagName).toBe('SPAN');
  });

  it('passes className through', () => {
    const { container } = render(<RichText className="lead" text="x" />);
    expect(container.firstChild).toHaveClass('lead');
  });

  it('renders HTML-looking text literally', () => {
    const { container } = render(<RichText text="<script>alert(1)</script> **<b>x</b>**" />);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    expect(container.firstChild.textContent).toBe('<script>alert(1)</script> <b>x</b>');
  });

  it('renders an unmatched ** literally', () => {
    const { container } = render(<RichText text="a **b** c **d" />);
    expect(container.querySelectorAll('strong')).toHaveLength(1);
    expect(container.firstChild.textContent).toBe('a b c **d');
  });
});
