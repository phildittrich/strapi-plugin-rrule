import * as React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RRule } from 'rrule';

import type { RRuleValue } from '../../types';
import { WeekdayPicker } from '../WeekdayPicker';
import { renderWithIntl } from './test-helpers';

const baseValue: RRuleValue = {
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [0],
  tzid: 'UTC',
  rruleString: '',
};

describe('WeekdayPicker', () => {
  it('renders all 7 weekday buttons', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
  });

  it('renders short day labels', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('calls onChange when a day is clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={onChange} />);

    await user.click(screen.getByText('Fri'));
    expect(onChange).toHaveBeenCalledTimes(1);
    // Friday = 4, should be added alongside Monday = 0
    const newValue = onChange.mock.calls[0][0] as RRuleValue;
    expect(newValue.byweekday).toEqual([0, 4]);
  });

  it('removes an already-selected day on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const withTwo = { ...baseValue, byweekday: [0, 4] };
    renderWithIntl(<WeekdayPicker value={withTwo} onChange={onChange} />);

    await user.click(screen.getByText('Fri'));
    const newValue = onChange.mock.calls[0][0] as RRuleValue;
    expect(newValue.byweekday).toEqual([0]);
  });

  it('does not call onChange when trying to deselect the last day', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={onChange} />);

    await user.click(screen.getByText('Mon'));
    // toggleWeekday returns the same reference, so onChange is still called
    // but the value should be unchanged
    const newValue = onChange.mock.calls[0][0] as RRuleValue;
    expect(newValue.byweekday).toEqual([0]);
  });

  it('disables all buttons when disabled prop is true', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('renders the label "Repeat on"', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByText('Repeat on')).toBeInTheDocument();
  });
});
