import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import Categories from './Categories';
import PromoBanners from './PromoBanners';

vi.mock('../api', () => ({
  getCategories: () => Promise.reject(new Error('offline')),
}));

describe('Hero', () => {
  it('uses a lowercase display heading with MSMEs highlighted', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveClass('display');
    expect(h1).toHaveTextContent('discover local gems from MSMEs in Davao City');
    expect(screen.getByText('MSMEs')).toHaveClass('highlight');
  });

  it('renders a primary button', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: 'Shop Now' })).toHaveClass('btn', 'btn-primary');
  });
});

describe('Categories', () => {
  it('uses a lowercase heading and renders fallback categories as interactive cards', async () => {
    render(<Categories />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('display');
    expect(h2).toHaveTextContent('featured categories');
    const apparel = await screen.findByText('Apparel');
    expect(apparel.closest('.category-card')).toHaveClass('card', 'card-interactive');
  });
});

describe('PromoBanners', () => {
  it('uses pill badges, lowercase headings, and shared buttons', () => {
    render(<PromoBanners />);
    expect(screen.getByText('Up to 20% Off')).toHaveClass('pill');
    expect(screen.getByText('Bazaar Specials')).toHaveClass('pill');
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('support localMSME products');
    expect(headings[1]).toHaveTextContent('fresh finds,pure quality');
    const buttons = screen.getAllByRole('button', { name: /shop now/i });
    expect(buttons[0]).toHaveClass('btn', 'btn-ghost');
    expect(buttons[1]).toHaveClass('btn', 'btn-primary');
  });
});
