import * as React from 'react';

import {
  DatePicker,
  Field,
  Flex,
  NumberInput,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';

import type { EndConditionType, RRuleValue } from '../types';
import { getTrad } from '../utils/getTrad';
import { updateEndCondition } from '../utils/rruleActions';

interface EndConditionSectionProps {
  value: RRuleValue;
  onChange: (value: RRuleValue) => void;
  disabled?: boolean;
}

export const EndConditionSection = ({
  value,
  onChange,
  disabled,
}: EndConditionSectionProps) => {
  const { formatMessage } = useIntl();

  const endType: EndConditionType = value.count
    ? 'count'
    : value.until
      ? 'until'
      : 'never';

  const handleTypeChange = (type: string | number) => {
    const t = String(type) as EndConditionType;
    if (t === 'never') {
      onChange(updateEndCondition(value, 'never'));
    } else if (t === 'count') {
      onChange(updateEndCondition(value, 'count', 10));
    } else if (t === 'until') {
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      onChange(
        updateEndCondition(value, 'until', threeMonthsFromNow.toISOString().split('T')[0])
      );
    }
  };

  const handleCountChange = (count: number | undefined) => {
    if (count !== undefined && count > 0) {
      onChange(updateEndCondition(value, 'count', count));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    const isoDate = date.toISOString().split('T')[0];
    onChange(updateEndCondition(value, 'until', isoDate));
  };

  return (
    <Flex direction="column" alignItems="stretch" gap={2}>
      <Field.Root name="end-type" id="rrule-end-type">
        <Field.Label>
          {formatMessage({ id: getTrad('end.label'), defaultMessage: 'Ends' })}
        </Field.Label>
        <SingleSelect value={endType} onChange={handleTypeChange} disabled={disabled}>
          <SingleSelectOption value="never">
            {formatMessage({ id: getTrad('end.never'), defaultMessage: 'Never' })}
          </SingleSelectOption>
          <SingleSelectOption value="count">
            {formatMessage({
              id: getTrad('end.count'),
              defaultMessage: 'After occurrences',
            })}
          </SingleSelectOption>
          <SingleSelectOption value="until">
            {formatMessage({ id: getTrad('end.until'), defaultMessage: 'On date' })}
          </SingleSelectOption>
        </SingleSelect>
      </Field.Root>

      {endType === 'count' && (
        <Field.Root name="end-count" id="rrule-end-count">
          <Field.Label>
            {formatMessage({
              id: getTrad('end.count.value'),
              defaultMessage: 'Number of occurrences',
            })}
          </Field.Label>
          <NumberInput
            value={value.count ?? 10}
            onValueChange={handleCountChange}
            disabled={disabled}
            min={1}
          />
        </Field.Root>
      )}

      {endType === 'until' && (
        <Field.Root name="end-until" id="rrule-end-until">
          <Field.Label>
            {formatMessage({
              id: getTrad('end.until.value'),
              defaultMessage: 'End date',
            })}
          </Field.Label>
          <DatePicker
            value={value.until ? new Date(value.until) : undefined}
            onChange={handleDateChange}
            disabled={disabled}
          />
        </Field.Root>
      )}
    </Flex>
  );
};
