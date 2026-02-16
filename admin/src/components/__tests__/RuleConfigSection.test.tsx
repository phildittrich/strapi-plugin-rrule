import * as React from 'react';
import { screen } from '@testing-library/react';
import { RRule } from 'rrule';

import type { RRuleValue } from '../../types';
import { RuleConfigSection } from '../RuleConfigSection';
import { renderWithIntl } from './test-helpers';

const weeklyValue: RRuleValue = {
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [0],
  tzid: 'UTC',
  rruleString: '',
};

const monthlyValue: RRuleValue = {
  ...weeklyValue,
  freq: RRule.MONTHLY,
  byweekday: undefined,
  bymonthday: [1],
};

const dailyValue: RRuleValue = {
  ...weeklyValue,
  freq: RRule.DAILY,
  byweekday: undefined,
};

describe('RuleConfigSection', () => {
  it('renders frequency, interval, start date, timezone, and end condition fields', () => {
    renderWithIntl(<RuleConfigSection value={weeklyValue} onChange={jest.fn()} />);
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('Repeat every')).toBeInTheDocument();
    expect(screen.getByText('Start date')).toBeInTheDocument();
    expect(screen.getByText('Timezone')).toBeInTheDocument();
    expect(screen.getByText('Ends')).toBeInTheDocument();
  });

  it('shows WeekdayPicker for weekly frequency', () => {
    renderWithIntl(<RuleConfigSection value={weeklyValue} onChange={jest.fn()} />);
    expect(screen.getByText('Repeat on')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('hides WeekdayPicker for daily frequency', () => {
    renderWithIntl(<RuleConfigSection value={dailyValue} onChange={jest.fn()} />);
    expect(screen.queryByText('Repeat on')).not.toBeInTheDocument();
  });

  it('shows MonthlyOptions for monthly frequency', () => {
    renderWithIntl(<RuleConfigSection value={monthlyValue} onChange={jest.fn()} />);
    expect(screen.getByText('Repeat by')).toBeInTheDocument();
  });

  it('hides MonthlyOptions for weekly frequency', () => {
    renderWithIntl(<RuleConfigSection value={weeklyValue} onChange={jest.fn()} />);
    expect(screen.queryByText('Repeat by')).not.toBeInTheDocument();
  });

  it('displays interval hint with unit', () => {
    renderWithIntl(<RuleConfigSection value={weeklyValue} onChange={jest.fn()} />);
    expect(screen.getByText(/every.*1.*weeks/i)).toBeInTheDocument();
  });

  it('shows daily unit for daily frequency', () => {
    renderWithIntl(<RuleConfigSection value={dailyValue} onChange={jest.fn()} />);
    expect(screen.getByText(/every.*1.*days/i)).toBeInTheDocument();
  });
});
