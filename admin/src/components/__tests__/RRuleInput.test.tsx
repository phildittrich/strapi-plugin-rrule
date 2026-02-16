import * as React from 'react';
import { screen } from '@testing-library/react';
import { RRule } from 'rrule';

import type { RRuleValue } from '../../types';
import { RRuleInput } from '../RRuleInput';
import { renderWithIntl } from './test-helpers';

const mockOnChange = jest.fn();
const mockFieldValue: RRuleValue = {
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
    // Config side: Frequency label
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    // Preview side: Next occurrences
    expect(screen.getByText('Next occurrences')).toBeInTheDocument();
  });

  it('shows hint when provided', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" hint="Set up recurrence" />
    );
    expect(screen.getByText('Set up recurrence')).toBeInTheDocument();
  });
});
