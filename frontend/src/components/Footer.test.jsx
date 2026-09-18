import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  it('links to the about page and the store home', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: "About Hap'n" })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/shop');
  });

  it('links to the Instagram account', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/hapn.co/'
    );
  });

  it('does not render the lightning emoji', () => {
    const { container } = renderFooter();
    expect(container.textContent).not.toContain('⚡');
  });
});
