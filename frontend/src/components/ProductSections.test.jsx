import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import FeaturedProducts from './FeaturedProducts';
import DealsOfDay from './DealsOfDay';

vi.mock('../api', () => ({
  getFeaturedProducts: () => Promise.reject(new Error('offline')),
  getDeals: () => Promise.reject(new Error('offline')),
}));

const product = {
  id: 1,
  name: 'Dried Mango Pack',
  price: 180,
  original_price: 220,
  merchant_name: 'Tropik Bites',
  category: { name: 'Food & Snacks' },
};

describe('ProductCard', () => {
  it('shows name, merchant, price, and discount', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Dried Mango Pack')).toBeInTheDocument();
    expect(screen.getByText('Tropik Bites')).toBeInTheDocument();
    expect(screen.getByText('₱180.00')).toBeInTheDocument();
    expect(screen.getByText('-18%')).toBeInTheDocument();
  });

  it('is an interactive card with shared buttons', () => {
    const { container } = render(<ProductCard product={product} />);
    expect(container.firstChild).toHaveClass('card', 'card-interactive', 'product-card');
    expect(screen.getByRole('button', { name: /add to cart/i })).toHaveClass('btn', 'btn-primary', 'btn-sm');
    expect(screen.getByRole('button', { name: 'Add to Wishlist' })).toHaveClass('btn', 'btn-ghost', 'btn-sm');
  });

  it('hides the badge when there is no discount', () => {
    render(<ProductCard product={{ ...product, original_price: null }} />);
    expect(screen.queryByText(/%$/)).toBeNull();
  });
});

describe('FeaturedProducts', () => {
  it('uses a lowercase heading and a ghost see-more button', async () => {
    render(<FeaturedProducts />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('display');
    expect(h2).toHaveTextContent('featured products');
    expect(screen.getByRole('button', { name: /see more/i })).toHaveClass('btn', 'btn-ghost');
    expect(await screen.findByText('Dried Mango Pack')).toBeInTheDocument();
  });
});

describe('DealsOfDay', () => {
  it('uses a lowercase heading', async () => {
    render(<DealsOfDay />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('display');
    expect(h2).toHaveTextContent('deals of the day');
    expect(await screen.findByText('Rattan Earrings')).toBeInTheDocument();
  });
});
