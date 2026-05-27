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
  it('renders 7 weekday checkboxes', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(7);
  });

  it('uses full day name as the accessible label', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByRole('checkbox', { name: 'Monday' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Friday' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Sunday' })).toBeInTheDocument();
  });

  it('renders the visible short labels', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('marks the selected days as checked', () => {
    renderWithIntl(
      <WeekdayPicker value={{ ...baseValue, byweekday: [0, 4] }} onChange={jest.fn()} />
    );
    expect(screen.getByRole('checkbox', { name: 'Monday' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Friday' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Tuesday' })).not.toBeChecked();
  });

  it('calls onChange when a day is toggled on', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Friday' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const newValue = onChange.mock.calls[0][0] as RRuleValue;
    expect(newValue.byweekday).toEqual([0, 4]);
  });

  it('removes an already-selected day on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const withTwo = { ...baseValue, byweekday: [0, 4] };
    renderWithIntl(<WeekdayPicker value={withTwo} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Friday' }));
    const newValue = onChange.mock.calls[0][0] as RRuleValue;
    expect(newValue.byweekday).toEqual([0]);
  });

  it('does not deselect the last remaining day', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Monday' }));
    const newValue = onChange.mock.calls[0][0] as RRuleValue;
    expect(newValue.byweekday).toEqual([0]);
  });

  it('disables all checkboxes when disabled', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} disabled />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((cb) => expect(cb).toBeDisabled());
  });

  it('renders the group label "Repeat on"', () => {
    renderWithIntl(<WeekdayPicker value={baseValue} onChange={jest.fn()} />);
    expect(screen.getByText('Repeat on')).toBeInTheDocument();
  });

  it('exposes the checkbox group with role="group" and a label', () => {
    const { container } = renderWithIntl(
      <WeekdayPicker value={baseValue} onChange={jest.fn()} />
    );
    const group = container.querySelector('[role="group"]');
    expect(group).not.toBeNull();
    expect(group!.getAttribute('aria-labelledby')).toBeTruthy();
  });
});
