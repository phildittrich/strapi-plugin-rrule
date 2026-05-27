import * as React from 'react';

import {
  Field,
  Flex,
  NumberInput,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';

import type { RRuleValue } from '../types';
import { POSITION_OPTIONS, WEEKDAY_OPTIONS } from '../types';
import { getTrad } from '../utils/getTrad';
import { updateMonthDay, updateMonthPosition } from '../utils/rruleActions';

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
    <Flex direction="column" alignItems="stretch" gap={2}>
      <Field.Root name="monthly-mode" id="rrule-monthly-mode">
        <Field.Label>
          {formatMessage({ id: getTrad('monthly.mode.label'), defaultMessage: 'Repeat by' })}
        </Field.Label>
        <SingleSelect value={mode} onChange={handleModeChange} disabled={disabled}>
          <SingleSelectOption value="day">
            {formatMessage({
              id: getTrad('monthly.bymonthday'),
              defaultMessage: 'Day of month',
            })}
          </SingleSelectOption>
          <SingleSelectOption value="position">
            {formatMessage({
              id: getTrad('monthly.bysetpos'),
              defaultMessage: 'Day of week (e.g., 1st Monday)',
            })}
          </SingleSelectOption>
        </SingleSelect>
      </Field.Root>

      {mode === 'day' && (
        <Field.Root name="monthly-day" id="rrule-monthly-day">
          <Field.Label>
            {formatMessage({ id: getTrad('monthly.day.label'), defaultMessage: 'Day' })}
          </Field.Label>
          <NumberInput
            value={dayOfMonth}
            onValueChange={handleDayChange}
            disabled={disabled}
            min={1}
            max={31}
          />
        </Field.Root>
      )}

      {mode === 'position' && (
        <Flex gap={2} alignItems="end">
          <Field.Root name="monthly-position" id="rrule-monthly-position" flex="1">
            <Field.Label>
              {formatMessage({
                id: getTrad('monthly.position.label'),
                defaultMessage: 'Position',
              })}
            </Field.Label>
            <SingleSelect
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
          </Field.Root>

          <Field.Root name="monthly-weekday" id="rrule-monthly-weekday" flex="1">
            <Field.Label>
              {formatMessage({
                id: getTrad('monthly.weekday.label'),
                defaultMessage: 'Day of week',
              })}
            </Field.Label>
            <SingleSelect
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
          </Field.Root>
        </Flex>
      )}
    </Flex>
  );
};
