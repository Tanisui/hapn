import { render, screen, within } from '@testing-library/react';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
  it('names the registered company with its SEC and BIR numbers and the office address', () => {
    render(<ContactPage />);
    const company = screen.getByRole('region', { name: 'The company' });
    expect(company).toHaveTextContent('Hap’n Corporation');
    expect(company).toHaveTextContent('SEC Reg. No. 2026070259749-00');
    expect(company).toHaveTextContent('TIN 817-119-272-00000');
    expect(company).toHaveTextContent('F106 Finster Bldg., E. Jacinto St., Barangay 32-D, Poblacion District, Davao City 8000');
    expect(document.body.textContent).not.toMatch(/NAFCO|principal office/i);
  });

  it('gives the email and both phones, labelled, as tap-to-call links', () => {
    render(<ContactPage />);
    const reach = screen.getByRole('region', { name: 'Reach us' });
    expect(within(reach).getByRole('link', { name: 'admin@hapnapponline.com' })).toHaveAttribute('href', 'mailto:admin@hapnapponline.com');
    expect(within(reach).getByText('Office line')).toBeInTheDocument();
    expect(within(reach).getByRole('link', { name: '+63 947 445 8409' })).toHaveAttribute('href', 'tel:+639474458409');
    expect(within(reach).getByText('Corporate Secretary')).toBeInTheDocument();
    expect(within(reach).getByRole('link', { name: '+63 949 927 3409' })).toHaveAttribute('href', 'tel:+639499273409');
    expect(reach).toHaveTextContent('We reply to emails within 1 working day.');
  });

  it('links the Terms, Privacy, Refund and Fees pages', () => {
    render(<ContactPage />);
    const policies = screen.getByRole('navigation', { name: 'Policies' });
    expect(within(policies).getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', 'https://shop.hapnapponline.com/legal/terms');
    expect(within(policies).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', 'https://shop.hapnapponline.com/legal/privacy');
    expect(within(policies).getByRole('link', { name: 'Refunds' })).toHaveAttribute('href', 'https://shop.hapnapponline.com/legal/refund');
    expect(within(policies).getByRole('link', { name: 'Fees and Charges' })).toHaveAttribute('href', 'https://shop.hapnapponline.com/legal/fees');
  });
});
