import * as React from 'react';
import { screen } from '@testing-library/react';
import { RRule } from 'rrule';

import type { RRuleValue } from '../../types';
import { RRuleInput } from '../RRuleInput';
import { renderWithIntl } from './test-helpers';

const mockOnChange = jest.fn();
let mockFieldValue: RRuleValue | { rruleString: string } | null = {
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [0],
  tzid: 'UTC',
  rruleString: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO',
};

jest.mock('@strapi/strapi/admin', () => ({
  useField: () => ({
    value: mockFieldValue,
    onChange: mockOnChange,
    error: undefined,
  }),
}));

describe('RRuleInput', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
    mockFieldValue = {
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: [0],
      tzid: 'UTC',
      rruleString: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO',
    };
  });

  it('renders the label', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" />
    );
    expect(screen.getByText('Recurrence')).toBeInTheDocument();
  });

  it('renders section header', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" />
    );
    expect(screen.getByText('Recurrence Rule')).toBeInTheDocument();
  });

  it('shows both configuration and preview simultaneously', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" />
    );
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('Next occurrences')).toBeInTheDocument();
  });

  it('shows hint when provided', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" hint="Set up recurrence" />
    );
    expect(screen.getByText('Set up recurrence')).toBeInTheDocument();
  });

  it('does not call onChange on mount when field value is null', () => {
    mockFieldValue = null;
    renderWithIntl(<RRuleInput name="rrule" label="Recurrence" type="json" />);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('hydrates structured fields from rruleString when only rruleString is stored', () => {
    mockFieldValue = { rruleString: 'FREQ=MONTHLY;BYMONTHDAY=15' };
    renderWithIntl(<RRuleInput name="rrule" label="Recurrence" type="json" />);
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
