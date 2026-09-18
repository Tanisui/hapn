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

  it('renders the store home at /shop', async () => {
    renderAt('/shop');
    expect(screen.getByRole('heading', { level: 1, name: /discover local gems/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /our story/ })).toBeInTheDocument();
    expect(await screen.findByText('Dried Mango Pack')).toBeInTheDocument();
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
