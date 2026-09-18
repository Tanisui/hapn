import { render, screen } from '@testing-library/react';
import StatementCards from './StatementCards';
import { mission, vision } from '../content/about';

describe('StatementCards', () => {
  it('shows vision then mission with h3 labels by default', () => {
    render(<StatementCards />);
    [vision, mission].forEach((statement) => {
      expect(screen.getByRole('heading', { level: 3, name: statement.label })).toBeInTheDocument();
      expect(screen.getByText(statement.text)).toBeInTheDocument();
    });
    const cards = screen.getAllByRole('article');
    expect(cards[0]).toHaveClass('statement-card', 'statement-card-vision');
    expect(cards[1]).toHaveClass('statement-card', 'statement-card-mission');
  });

  it('uses the given heading tag for the labels', () => {
    render(<StatementCards labelTag="h2" />);
    expect(screen.getByRole('heading', { level: 2, name: vision.label })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: mission.label })).toBeInTheDocument();
  });
});
