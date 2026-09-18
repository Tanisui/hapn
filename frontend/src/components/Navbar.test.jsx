import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  it('links the wordmark to the store home', () => {
    renderAt('/about');
    expect(screen.getByRole('link', { name: "hap'n! home" })).toHaveAttribute('href', '/shop');
  });

  it('has Home and About links', () => {
    renderAt('/shop');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/shop');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('marks only the current page link as active', () => {
    renderAt('/about');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('does not render the lightning emoji', () => {
    const { container } = renderAt('/shop');
    expect(container.textContent).not.toContain('⚡');
  });
});
