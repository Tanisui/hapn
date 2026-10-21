import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./api', () => {
  const offline = () => Promise.reject(new Error('offline'));
  return {
    default: {},
    getCategories: offline,
    getProducts: offline,
    getFeaturedProducts: offline,
    getDeals: offline,
    getUpcomingEvents: offline,
  };
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('App routes', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the landing page at / without the store navbar', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('HAP’N!');
    expect(screen.queryByRole('textbox', { name: 'Search' })).toBeNull();
  });

  it('sends /shop to the real shop, never sample products', () => {
    const replace = vi.fn();
    vi.stubGlobal('location', { ...window.location, replace });
    renderAt('/shop');
    expect(replace).toHaveBeenCalledWith('https://shop.hapnapponline.com/');
    expect(screen.getByRole('link', { name: /shop\.hapnapponline\.com/ })).toHaveAttribute('href', 'https://shop.hapnapponline.com/');
    expect(screen.queryByText('Dried Mango Pack')).toBeNull();
    vi.unstubAllGlobals();
  });

  it('opens the shop\'s policy pages from /terms, /privacy, /refund and /fees', () => {
    const replace = vi.fn();
    vi.stubGlobal('location', { ...window.location, replace });
    renderAt('/terms');
    expect(replace).toHaveBeenCalledWith('https://shop.hapnapponline.com/legal/terms');
    vi.unstubAllGlobals();
  });

  it('renders the Contact page at /contact', () => {
    renderAt('/contact');
    expect(screen.getByRole('heading', { level: 1, name: 'Contact us' })).toBeInTheDocument();
  });

  it('renders the about page at /about', () => {
    renderAt('/about');
    expect(screen.getByRole('heading', { level: 2, name: 'brand story' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: /discover local gems/i })).toBeNull();
  });

  it('redirects unknown paths to the landing page', () => {
    renderAt('/nope');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('HAP’N!');
  });

  it('scrolls to the top when the page renders', () => {
    renderAt('/about');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
