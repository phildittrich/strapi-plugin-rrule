import * as React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RRule } from 'rrule';

import type { RRuleValue } from '../../types';
import { EndConditionSection } from '../EndConditionSection';
import { renderWithIntl } from './test-helpers';

const baseValue: RRuleValue = {
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [0],
  tzid: 'UTC',
  rruleString: '',
};

describe('EndConditionSection', () => {
  it('renders the "Ends" label', () => {
    renderWithIntl(<EndConditionSection value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByText('Ends')).toBeInTheDocument();
  });

  it('defaults to "Never" when no count or until is set', () => {
    renderWithIntl(<EndConditionSection value={baseValue} onChange={jest.fn()} />);
    // The select should show "Never" as the current value
    expect(screen.getByRole('combobox', { name: /ends/i })).toHaveTextContent('Never');
  });

  it('shows "After occurrences" when count is set', () => {
    const withCount = { ...baseValue, count: 5 };
    renderWithIntl(<EndConditionSection value={withCount} onChange={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: /ends/i })).toHaveTextContent('After occurrences');
  });

  it('shows count input when count is set', () => {
    const withCount = { ...baseValue, count: 5 };
    renderWithIntl(<EndConditionSection value={withCount} onChange={jest.fn()} />);
    expect(screen.getByRole('textbox', { name: /number of occurrences/i })).toBeInTheDocument();
  });

  it('shows "On date" when until is set', () => {
    const withUntil = { ...baseValue, until: '2026-12-31' };
    renderWithIntl(<EndConditionSection value={withUntil} onChange={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: /ends/i })).toHaveTextContent('On date');
  });

  it('shows date picker when until is set', () => {
    const withUntil = { ...baseValue, until: '2026-12-31' };
    renderWithIntl(<EndConditionSection value={withUntil} onChange={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: /end date/i })).toBeInTheDocument();
  });

  it('does not show count or date inputs in "never" mode', () => {
    renderWithIntl(<EndConditionSection value={baseValue} onChange={jest.fn()} />);
    expect(screen.queryByRole('textbox', { name: /number of occurrences/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /end date/i })).not.toBeInTheDocument();
  });
});
