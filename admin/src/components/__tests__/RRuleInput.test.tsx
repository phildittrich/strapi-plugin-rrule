import * as React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders Configure and Preview tabs', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" />
    );
    expect(screen.getByRole('tab', { name: /configure/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /preview/i })).toBeInTheDocument();
  });

  it('shows configuration content by default', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" />
    );
    // Config tab should be active and show "Frequency" label
    expect(screen.getByText('Frequency')).toBeInTheDocument();
  });

  it('switches to preview tab on click', async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" />
    );

    await user.click(screen.getByRole('tab', { name: /preview/i }));
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Next occurrences')).toBeInTheDocument();
  });

  it('shows hint when provided', () => {
    renderWithIntl(
      <RRuleInput name="rrule" label="Recurrence" type="json" hint="Set up recurrence" />
    );
    expect(screen.getByText('Set up recurrence')).toBeInTheDocument();
  });
});
