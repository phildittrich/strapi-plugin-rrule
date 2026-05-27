import * as React from 'react';

import { Box, Checkbox, Field, Flex, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import type { RRuleValue } from '../types';
import { WEEKDAY_OPTIONS } from '../types';
import { getTrad } from '../utils/getTrad';
import { toggleWeekday } from '../utils/rruleActions';

interface WeekdayPickerProps {
  value: RRuleValue;
  onChange: (value: RRuleValue) => void;
  disabled?: boolean;
}

const longKey = (label: string) => `weekday.${label.toLowerCase()}`;

export const WeekdayPicker = ({ value, onChange, disabled }: WeekdayPickerProps) => {
  const { formatMessage } = useIntl();
  const selectedDays = value.byweekday ?? [];
  const groupLabelId = React.useId();

  const handleToggle = (weekday: number) => {
    onChange(toggleWeekday(value, weekday));
  };

  const groupLabel = formatMessage({
    id: getTrad('weekdays.label'),
    defaultMessage: 'Repeat on',
  });

  return (
    <Box role="group" aria-labelledby={groupLabelId}>
      <Typography id={groupLabelId} variant="pi" fontWeight="bold">
        {groupLabel}
      </Typography>
      <Flex gap={3} wrap="wrap" paddingTop={2}>
        {WEEKDAY_OPTIONS.map(({ value: day, label, short }) => {
          const fullName = formatMessage({
            id: getTrad(longKey(label)),
            defaultMessage: label,
          });
          const shortName = formatMessage({
            id: getTrad(`weekday.short.${short}`),
            defaultMessage: short,
          });
          const fieldId = `${groupLabelId}-${day}`;
          return (
            <Field.Root key={day} name={`weekday-${day}`} id={fieldId}>
              <Flex alignItems="center" gap={1}>
                <Checkbox
                  id={fieldId}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => handleToggle(day)}
                  disabled={disabled}
                  aria-label={fullName}
                />
                <Field.Label>{shortName}</Field.Label>
              </Flex>
            </Field.Root>
          );
        })}
      </Flex>
    </Box>
  );
};
