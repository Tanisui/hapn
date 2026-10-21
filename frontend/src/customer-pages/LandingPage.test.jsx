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

  it('links each header nav item to a section on the page, and Contact to its own page', () => {
    const { container } = render(<LandingPage />);
    const links = within(screen.getByRole('navigation', { name: 'Page sections' })).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#how', '#sellers', '#categories', '#vision', '#faq', '/contact']);
    expect(links.map((link) => link.textContent)).toEqual([
      'How It Works',
      'Sellers & Shoppers',
      'Categories',
      'Vision & Mission',
      'FAQ',
      'Contact',
    ]);
    links
      .filter((link) => link.getAttribute('href').startsWith('#'))
      .forEach((link) => {
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
      'Contact',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#how', '#sellers', '#categories', '#vision', '#faq', '/contact']);
    expect(menu.getByRole('link', { name: 'Shop now' })).toHaveAttribute('href', 'https://shop.hapnapponline.com/');
    expect(menu.getByRole('link', { name: 'Sell on Hap’n' })).toHaveAttribute('href', 'https://seller.hapnapponline.com/');
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

  it('sends the main calls to action to the live shop and the seller portal in a new tab', () => {
    render(<LandingPage />);
    const shop = screen.getAllByRole('link', { name: 'shop on hap’n' })[0];
    const sell = screen.getAllByRole('link', { name: 'sell on hap’n' })[0];
    expect(shop).toHaveAttribute('href', 'https://shop.hapnapponline.com/');
    expect(sell).toHaveAttribute('href', 'https://seller.hapnapponline.com/');
    [shop, sell].forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    });
  });

  it('links the Android app download, with no "coming soon" app-store badges', () => {
    render(<LandingPage />);
    expect(screen.getByRole('link', { name: 'Download the Hap’n app for Android' })).toHaveAttribute(
      'href',
      'https://api.hapnapponline.com/download/customer'
    );
    expect(screen.queryByText('App Store')).toBeNull();
    expect(document.body.textContent).not.toMatch(/coming soon|something big|not long now|launch day/i);
  });

  it('names the registered company in the footer, with its SEC and BIR numbers, address, email and policies', () => {
    render(<LandingPage />);
    const company = screen.getByLabelText('About the company');
    expect(company).toHaveTextContent('Hap’n Corporation · SEC Reg. No. 2026070259749-00 · TIN 817-119-272-00000');
    expect(company).toHaveTextContent('F106 Finster Bldg., E. Jacinto St., Barangay 32-D, Poblacion District, Davao City 8000');
    expect(within(company).getByRole('link', { name: 'admin@hapnapponline.com' })).toHaveAttribute('href', 'mailto:admin@hapnapponline.com');
    expect(within(company).getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', 'https://shop.hapnapponline.com/legal/terms');
    expect(within(company).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', 'https://shop.hapnapponline.com/legal/privacy');
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
