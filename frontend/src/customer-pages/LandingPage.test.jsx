import { fireEvent, render, screen, within } from '@testing-library/react';
import LandingPage from './LandingPage';
import { categories, faq, socialLinks, steps } from '../content/landing';
import { mission, vision } from '../content/about';

describe('LandingPage', () => {
  it('leads with the HAP’N! headline', () => {
    render(<LandingPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('HAP’N!');
  });

  it('has a heading for each section', () => {
    render(<LandingPage />);
    const names = [
      'gikan diri, para diri.',
      'Get Started in Three Steps',
      'For Sellers',
      'For Shoppers',
      'What You’ll Find on Hap’n',
      'Our Vision & Mission',
      'Frequently Asked Questions',
    ];
    names.forEach((name) => {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    });
  });

  it('links each header nav item to a section on the page', () => {
    const { container } = render(<LandingPage />);
    const links = within(screen.getByRole('navigation', { name: 'Page sections' })).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#how', '#sellers', '#categories', '#vision', '#faq']);
    expect(links.map((link) => link.textContent)).toEqual([
      'How It Works',
      'Sellers & Shoppers',
      'Categories',
      'Vision & Mission',
      'FAQ',
    ]);
    links.forEach((link) => {
      expect(container.querySelector(link.getAttribute('href'))).not.toBeNull();
    });
  });

  it('shows the vision and mission statements with their labels', () => {
    const { container } = render(<LandingPage />);
    const section = within(container.querySelector('#vision'));
    [vision, mission].forEach((statement) => {
      expect(section.getByRole('heading', { level: 3, name: statement.label })).toBeInTheDocument();
      expect(section.getByText(statement.text)).toBeInTheDocument();
    });
  });

  it('lists the three get-started steps in order', () => {
    const { container } = render(<LandingPage />);
    const items = within(container.querySelector('#how')).getAllByRole('listitem');
    expect(items).toHaveLength(steps.items.length);
    items.forEach((item, i) => {
      expect(within(item).getByRole('heading', { level: 3 })).toHaveTextContent(steps.items[i].title);
    });
  });

  it('shows a sticker for each category', () => {
    render(<LandingPage />);
    const items = within(screen.getByRole('list', { name: 'Categories' })).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual(categories.items.map((c) => c.label));
  });

  it('shows every FAQ question with its answer already visible', () => {
    const { container } = render(<LandingPage />);
    const section = within(container.querySelector('#faq'));
    faq.items.forEach((item) => {
      expect(section.getByRole('heading', { level: 3, name: item.question })).toBeInTheDocument();
      expect(section.getByText(item.answer)).toBeVisible();
    });
  });

  it('opens a menu with every section link', () => {
    render(<LandingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const menu = within(screen.getByRole('dialog'));
    const links = within(menu.getByRole('navigation', { name: 'Menu sections' })).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'How It Works',
      'Sellers & Shoppers',
      'Categories',
      'Vision & Mission',
      'FAQ',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#how', '#sellers', '#categories', '#vision', '#faq']);
    expect(menu.getByRole('link', { name: 'Follow Us' })).toHaveAttribute('href', socialLinks.facebook);
  });

  it('offers Facebook and Instagram contact buttons next to the FAQ', () => {
    const { container } = render(<LandingPage />);
    const section = within(container.querySelector('#faq'));
    const facebook = section.getByRole('link', { name: 'Facebook' });
    const instagram = section.getByRole('link', { name: 'Instagram' });
    expect(facebook).toHaveAttribute('href', socialLinks.facebook);
    expect(instagram).toHaveAttribute('href', socialLinks.instagram);
    [facebook, instagram].forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    });
  });

  it('sends the main calls to action to Facebook and Instagram in a new tab', () => {
    render(<LandingPage />);
    const facebook = screen.getAllByRole('link', { name: 'get launch news on facebook' })[0];
    const instagram = screen.getAllByRole('link', { name: 'follow on instagram' })[0];
    expect(facebook).toHaveAttribute('href', socialLinks.facebook);
    expect(instagram).toHaveAttribute('href', socialLinks.instagram);
    [facebook, instagram].forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    });
  });

  it('shows the app stores as coming soon, not as links', () => {
    render(<LandingPage />);
    expect(screen.getByText('App Store')).toBeInTheDocument();
    expect(screen.getByText('Google Play')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /app store|google play/i })).toBeNull();
  });

  it('hides the decorative phone mockup and ticker from assistive tech', () => {
    const { container } = render(<LandingPage />);
    expect(screen.getByText('register').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(container.querySelector('.landing-ticker')).toHaveAttribute('aria-hidden', 'true');
  });

  it('unmounts cleanly', () => {
    const { unmount } = render(<LandingPage />);
    expect(() => unmount()).not.toThrow();
  });
});
