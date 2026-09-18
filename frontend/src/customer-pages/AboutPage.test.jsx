import { render, screen } from '@testing-library/react';
import AboutPage from './AboutPage';
import { vision, mission } from '../content/about';

describe('AboutPage', () => {
  it('has a single h1 with the hero heading', () => {
    render(<AboutPage />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('go on, make it hap’n!');
  });

  it('shows the vision and mission statements with their labels', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Vision' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Mission' })).toBeInTheDocument();
    expect(screen.getByText(vision.text)).toBeInTheDocument();
    expect(screen.getByText(mission.text)).toBeInTheDocument();
  });

  it('shows the brand story with the typo fixed and bold highlights', () => {
    const { container } = render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'brand story' })).toBeInTheDocument();
    expect(screen.getByText('gikan diri, para diri.')).toBeInTheDocument();
    expect(screen.getByText(/not only about what is being sold/)).toBeInTheDocument();
    expect(screen.queryByText(/what it is being sold/)).toBeNull();
    const bold = [...container.querySelectorAll('.about-story strong')].map((el) => el.textContent);
    expect(bold).toContain('go on, make it hap’n!');
  });
});
