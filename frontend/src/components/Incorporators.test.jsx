import { render, screen } from '@testing-library/react';
import Incorporators, { getInitials } from './Incorporators';

describe('getInitials', () => {
  it('uses the first letters of the first and last words', () => {
    expect(getInitials('TRISTAN JAMES CABILETE SINTOS')).toBe('TS');
  });

  it('uses one letter for a single-word name', () => {
    expect(getInitials('Cher')).toBe('C');
  });

  it('ignores extra whitespace and uppercases', () => {
    expect(getInitials('  ana   de  cruz ')).toBe('AC');
  });
});

describe('Incorporators', () => {
  it('shows a coming-soon card when the list is empty', () => {
    render(<Incorporators people={[]} />);
    expect(screen.getByText('meet the team soon')).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('renders people in the given order', () => {
    render(<Incorporators people={[{ name: 'B PERSON' }, { name: 'A PERSON' }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('B PERSON');
    expect(items[1]).toHaveTextContent('A PERSON');
  });

  it('shows a photo with the name as alt text when photo is set', () => {
    render(<Incorporators people={[{ name: 'JANE DOE', photo: '/team/jane.jpg' }]} />);
    expect(screen.getByRole('img', { name: 'JANE DOE' })).toHaveAttribute('src', '/team/jane.jpg');
    expect(screen.queryByText('JD')).toBeNull();
  });

  it('shows initials when there is no photo', () => {
    render(<Incorporators people={[{ name: 'TRISTAN JAMES CABILETE SINTOS' }]} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('TS')).toBeInTheDocument();
  });

  it('shows the role only when present', () => {
    render(<Incorporators people={[{ name: 'WITH ROLE', role: 'Treasurer' }, { name: 'NO ROLE' }]} />);
    expect(screen.getByText('Treasurer')).toBeInTheDocument();
    const [, second] = screen.getAllByRole('listitem');
    expect(second.querySelector('.incorporator-role')).toBeNull();
  });
});
