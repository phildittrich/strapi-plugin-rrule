import * as React from 'react';
import { screen } from '@testing-library/react';
import { RRule } from 'rrule';

import type { RRuleValue } from '../../types';
import { MonthlyOptions } from '../MonthlyOptions';
import { renderWithIntl } from './test-helpers';

const baseValue: RRuleValue = {
  freq: RRule.MONTHLY,
  interval: 1,
  bymonthday: [15],
  tzid: 'UTC',
  rruleString: '',
};

describe('MonthlyOptions', () => {
  it('renders the "Repeat by" label', () => {
    renderWithIntl(<MonthlyOptions value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByText('Repeat by')).toBeInTheDocument();
  });

  it('defaults to "day" mode when bymonthday is set', () => {
    renderWithIntl(<MonthlyOptions value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: /repeat by/i })).toHaveTextContent('Day of month');
  });

  it('shows day number input in "day" mode', () => {
    renderWithIntl(<MonthlyOptions value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByRole('textbox', { name: /^day$/i })).toBeInTheDocument();
  });

  it('switches to "position" mode when bysetpos is set', () => {
    const positional: RRuleValue = {
      ...baseValue,
      bymonthday: undefined,
      bysetpos: [1],
      byweekday: [0],
    };
    renderWithIntl(<MonthlyOptions value={positional} onChange={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: /repeat by/i })).toHaveTextContent(
      'Day of week (e.g., 1st Monday)'
    );
  });

  it('shows position and weekday selects in "position" mode', () => {
    const positional: RRuleValue = {
      ...baseValue,
      bymonthday: undefined,
      bysetpos: [1],
      byweekday: [0],
    };
    renderWithIntl(<MonthlyOptions value={positional} onChange={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: /position/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /day of week/i })).toBeInTheDocument();
  });

  it('does not show position controls in "day" mode', () => {
    renderWithIntl(<MonthlyOptions value={baseValue} onChange={jest.fn()} />);
    expect(screen.queryByRole('combobox', { name: /position/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /day of week/i })).not.toBeInTheDocument();
  });

  it('does not show day input in "position" mode', () => {
    const positional: RRuleValue = {
      ...baseValue,
      bymonthday: undefined,
      bysetpos: [1],
      byweekday: [0],
    };
    renderWithIntl(<MonthlyOptions value={positional} onChange={jest.fn()} />);
    expect(screen.queryByRole('textbox', { name: /^day$/i })).not.toBeInTheDocument();
  });
});
