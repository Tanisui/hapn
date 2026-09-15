import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BrandBand from './BrandBand';
import { homeBand } from '../content/about';

describe('BrandBand', () => {
  it('shows the tagline and text and links to the about page', () => {
    render(
      <MemoryRouter>
        <BrandBand />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 2, name: homeBand.tagline })).toBeInTheDocument();
    expect(screen.getByText(homeBand.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /our story/ })).toHaveAttribute('href', '/about');
  });
});
