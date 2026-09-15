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
  it('links to the about and home pages', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: "About Hap'n" })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
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
