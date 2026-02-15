import { Box, Field, SingleSelect, SingleSelectOption, NumberInput, DatePicker, Typography } from '@strapi/design-system';
import * as React from 'react';
import { useIntl } from 'react-intl';

import type { RRuleValue, EndConditionType } from '../types';
import { updateEndCondition } from '../utils/rruleActions';
import { getTrad } from '../utils/getTrad';

interface EndConditionSectionProps {
  value: RRuleValue;
  onChange: (value: RRuleValue) => void;
  disabled?: boolean;
}

export const EndConditionSection = ({ value, onChange, disabled }: EndConditionSectionProps) => {
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
    <Box>
      <Typography variant="pi" fontWeight="bold" tag="label">
        {formatMessage({ id: getTrad('end.label'), defaultMessage: 'Ends' })}
      </Typography>
      <SingleSelect
        aria-label={formatMessage({ id: getTrad('end.label'), defaultMessage: 'Ends' })}
        value={endType}
        onChange={handleTypeChange}
        disabled={disabled}
      >
        <SingleSelectOption value="never">
          {formatMessage({ id: getTrad('end.never'), defaultMessage: 'Never' })}
        </SingleSelectOption>
        <SingleSelectOption value="count">
          {formatMessage({ id: getTrad('end.count'), defaultMessage: 'After occurrences' })}
        </SingleSelectOption>
        <SingleSelectOption value="until">
          {formatMessage({ id: getTrad('end.until'), defaultMessage: 'On date' })}
        </SingleSelectOption>
      </SingleSelect>

      {endType === 'count' && (
        <Box paddingTop={2}>
          <Typography variant="pi" fontWeight="bold" tag="label">
            {formatMessage({
              id: getTrad('end.count.value'),
              defaultMessage: 'Number of occurrences',
            })}
          </Typography>
          <NumberInput
            aria-label={formatMessage({
              id: getTrad('end.count.value'),
              defaultMessage: 'Number of occurrences',
            })}
            value={value.count ?? 10}
            onValueChange={handleCountChange}
            disabled={disabled}
            min={1}
          />
        </Box>
      )}

      {endType === 'until' && (
        <Box paddingTop={2}>
          <Typography variant="pi" fontWeight="bold" tag="label">
            {formatMessage({ id: getTrad('end.until.value'), defaultMessage: 'End date' })}
          </Typography>
          <DatePicker
            aria-label={formatMessage({ id: getTrad('end.until.value'), defaultMessage: 'End date' })}
            value={value.until ? new Date(value.until) : undefined}
            onChange={handleDateChange}
            disabled={disabled}
          />
        </Box>
      )}
    </Box>
  );
};
