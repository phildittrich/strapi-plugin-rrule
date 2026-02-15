import { Box, Flex, SingleSelect, SingleSelectOption, NumberInput, Typography } from '@strapi/design-system';
import * as React from 'react';
import { useIntl } from 'react-intl';

import type { RRuleValue } from '../types';
import { WEEKDAY_OPTIONS, POSITION_OPTIONS } from '../types';
import { updateMonthDay, updateMonthPosition } from '../utils/rruleActions';
import { getTrad } from '../utils/getTrad';

interface MonthlyOptionsProps {
  value: RRuleValue;
  onChange: (value: RRuleValue) => void;
  disabled?: boolean;
}

type MonthlyMode = 'day' | 'position';

export const MonthlyOptions = ({ value, onChange, disabled }: MonthlyOptionsProps) => {
  const { formatMessage } = useIntl();

  const mode: MonthlyMode = value.bysetpos?.length ? 'position' : 'day';
  const dayOfMonth = value.bymonthday?.[0] ?? 1;
  const position = value.bysetpos?.[0] ?? 1;
  const weekday = mode === 'position' ? (value.byweekday?.[0] ?? 0) : 0;

  const handleModeChange = (newMode: string | number) => {
    if (String(newMode) === 'day') {
      onChange(updateMonthDay(value, dayOfMonth));
    } else {
      onChange(updateMonthPosition(value, position, weekday));
    }
  };

  const handleDayChange = (day: number | undefined) => {
    if (day !== undefined) {
      onChange(updateMonthDay(value, Math.min(31, Math.max(1, day))));
    }
  };

  const handlePositionChange = (pos: string | number) => {
    onChange(updateMonthPosition(value, Number(pos), weekday));
  };

  const handleWeekdayChange = (wd: string | number) => {
    onChange(updateMonthPosition(value, position, Number(wd)));
  };

  return (
    <Box>
      <Typography variant="pi" fontWeight="bold" tag="label">
        {formatMessage({ id: getTrad('monthly.mode.label'), defaultMessage: 'Repeat by' })}
      </Typography>
      <SingleSelect
        aria-label={formatMessage({ id: getTrad('monthly.mode.label'), defaultMessage: 'Repeat by' })}
        value={mode}
        onChange={handleModeChange}
        disabled={disabled}
      >
        <SingleSelectOption value="day">
          {formatMessage({ id: getTrad('monthly.bymonthday'), defaultMessage: 'Day of month' })}
        </SingleSelectOption>
        <SingleSelectOption value="position">
          {formatMessage({
            id: getTrad('monthly.bysetpos'),
            defaultMessage: 'Day of week (e.g., 1st Monday)',
          })}
        </SingleSelectOption>
      </SingleSelect>

      {mode === 'day' && (
        <Box paddingTop={2}>
          <Typography variant="pi" fontWeight="bold" tag="label">
            {formatMessage({ id: getTrad('monthly.day.label'), defaultMessage: 'Day' })}
          </Typography>
          <NumberInput
            aria-label={formatMessage({ id: getTrad('monthly.day.label'), defaultMessage: 'Day' })}
            value={dayOfMonth}
            onValueChange={handleDayChange}
            disabled={disabled}
            min={1}
            max={31}
          />
        </Box>
      )}

      {mode === 'position' && (
        <Flex gap={2} paddingTop={2}>
          <Box style={{ flex: 1 }}>
            <Typography variant="pi" fontWeight="bold" tag="label">
              {formatMessage({ id: getTrad('monthly.position.label'), defaultMessage: 'Position' })}
            </Typography>
            <SingleSelect
              aria-label={formatMessage({
                id: getTrad('monthly.position.label'),
                defaultMessage: 'Position',
              })}
              value={String(position)}
              onChange={handlePositionChange}
              disabled={disabled}
            >
              {POSITION_OPTIONS.map((opt) => (
                <SingleSelectOption key={opt.value} value={String(opt.value)}>
                  {formatMessage({
                    id: getTrad(`monthly.position.${opt.label.toLowerCase()}`),
                    defaultMessage: opt.label,
                  })}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </Box>
          <Box style={{ flex: 1 }}>
            <Typography variant="pi" fontWeight="bold" tag="label">
              {formatMessage({ id: getTrad('monthly.weekday.label'), defaultMessage: 'Day of week' })}
            </Typography>
            <SingleSelect
              aria-label={formatMessage({
                id: getTrad('monthly.weekday.label'),
                defaultMessage: 'Day of week',
              })}
              value={String(weekday)}
              onChange={handleWeekdayChange}
              disabled={disabled}
            >
              {WEEKDAY_OPTIONS.map((opt) => (
                <SingleSelectOption key={opt.value} value={String(opt.value)}>
                  {formatMessage({
                    id: getTrad(`weekday.${opt.label.toLowerCase()}`),
                    defaultMessage: opt.label,
                  })}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </Box>
        </Flex>
      )}
    </Box>
  );
};
