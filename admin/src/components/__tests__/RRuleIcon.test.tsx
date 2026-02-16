import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RRuleIcon } from '../RRuleIcon';

jest.mock('@strapi/icons', () => ({
  Calendar: () => <svg data-testid="calendar-icon" />,
}));

describe('RRuleIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<RRuleIcon />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders the Calendar icon', () => {
    render(<RRuleIcon />);
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('is marked as aria-hidden', () => {
    const { container } = render(<RRuleIcon />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
