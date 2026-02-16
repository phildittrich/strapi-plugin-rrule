import * as React from 'react';
import { screen } from '@testing-library/react';
import { RRule } from 'rrule';

import type { RRuleValue } from '../../types';
import { RulePreview } from '../RulePreview';
import { renderWithIntl } from './test-helpers';

const baseValue: RRuleValue = {
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [0],
  tzid: 'UTC',
  dtstart: '2026-01-05T00:00:00Z',
  rruleString: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO',
};

describe('RulePreview', () => {
  it('renders section labels', () => {
    renderWithIntl(<RulePreview value={baseValue} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Timezone')).toBeInTheDocument();
    expect(screen.getByText('Next occurrences')).toBeInTheDocument();
    expect(screen.getByText('RRule string (RFC 5545)')).toBeInTheDocument();
  });

  it('displays the timezone', () => {
    renderWithIntl(<RulePreview value={baseValue} />);
    expect(screen.getByText('UTC')).toBeInTheDocument();
  });

  it('displays the rrule string with RRULE: prefix', () => {
    renderWithIntl(<RulePreview value={baseValue} />);
    expect(screen.getByText(/RRULE:FREQ=WEEKLY/)).toBeInTheDocument();
  });

  it('shows (empty) when rruleString is empty', () => {
    const empty = { ...baseValue, rruleString: '' };
    renderWithIntl(<RulePreview value={empty} />);
    expect(screen.getByText(/\(empty\)/)).toBeInTheDocument();
  });

  it('displays human-readable description', () => {
    renderWithIntl(<RulePreview value={baseValue} />);
    // rrule.toText() for WEEKLY on Monday returns something like "every week on Monday"
    expect(screen.getByText(/every week/i)).toBeInTheDocument();
  });

  it('displays occurrence badges', () => {
    renderWithIntl(<RulePreview value={baseValue} />);
    // Should show badge #1 at minimum
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('shows "No upcoming occurrences" for invalid rule', () => {
    const invalid: RRuleValue = {
      ...baseValue,
      freq: -999,
      dtstart: undefined,
    };
    renderWithIntl(<RulePreview value={invalid} />);
    expect(screen.getByText('No upcoming occurrences')).toBeInTheDocument();
  });
});
