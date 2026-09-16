import { render, screen } from '@testing-library/react';
import CountdownBanner from './CountdownBanner';

vi.mock('../api', () => ({
  getUpcomingEvents: () => Promise.reject(new Error('offline')),
}));

describe('CountdownBanner', () => {
  it('renders the fallback event as a dark block with a ghost button', async () => {
    const { container } = render(<CountdownBanner />);
    expect(await screen.findByRole('heading', { level: 2, name: 'Davao Weekend Bazaar' })).toBeInTheDocument();
    expect(container.querySelector('.countdown-banner')).toHaveClass('on-dark');
    expect(screen.getByRole('button', { name: /shop now/i })).toHaveClass('btn', 'btn-ghost');
    expect(screen.getAllByText(/^(Days|Hours|Minutes|Seconds)$/)).toHaveLength(4);
  });
});
