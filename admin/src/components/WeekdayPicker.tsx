import { Box, Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import type { RRuleValue } from '../types';
import { WEEKDAY_OPTIONS } from '../types';
import { toggleWeekday } from '../utils/rruleActions';
import { getTrad } from '../utils/getTrad';

interface WeekdayPickerProps {
  value: RRuleValue;
  onChange: (value: RRuleValue) => void;
  disabled?: boolean;
}

const DayChip = styled.button<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 32px;
  padding: 0 ${({ theme }) => theme.spaces[2]};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary600 : theme.colors.neutral200};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary100 : theme.colors.neutral0};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary600 : theme.colors.neutral600};
  font-size: ${({ theme }) => theme.fontSizes[1]};
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary600};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const WeekdayPicker = ({ value, onChange, disabled }: WeekdayPickerProps) => {
  const { formatMessage } = useIntl();
  const selectedDays = value.byweekday ?? [];

  const handleToggle = (weekday: number) => {
    onChange(toggleWeekday(value, weekday));
  };

  return (
    <Box>
      <Typography variant="pi" fontWeight="bold" tag="label">
        {formatMessage({ id: getTrad('weekdays.label'), defaultMessage: 'Repeat on' })}
      </Typography>
      <Flex gap={2} wrap="wrap" paddingTop={1}>
        {WEEKDAY_OPTIONS.map(({ value: day, short }) => (
          <DayChip
            key={day}
            type="button"
            $selected={selectedDays.includes(day)}
            onClick={() => handleToggle(day)}
            disabled={disabled}
          >
            {formatMessage({
              id: getTrad(`weekday.short.${short}`),
              defaultMessage: short,
            })}
          </DayChip>
        ))}
      </Flex>
    </Box>
  );
};
