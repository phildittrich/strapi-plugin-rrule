import * as React from 'react';

import {
  DatePicker,
  Field,
  Flex,
  NumberInput,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import { RRule } from 'rrule';
import { useIntl } from 'react-intl';

import type { RRuleValue } from '../types';
import { COMMON_TIMEZONES, FREQUENCY_OPTIONS } from '../types';
import { getTrad } from '../utils/getTrad';
import {
  updateDtstart,
  updateFrequency,
  updateInterval,
  updateTimezone,
} from '../utils/rruleActions';
import { EndConditionSection } from './EndConditionSection';
import { MonthlyOptions } from './MonthlyOptions';
import { WeekdayPicker } from './WeekdayPicker';

interface RuleConfigSectionProps {
  value: RRuleValue;
  onChange: (value: RRuleValue) => void;
  disabled?: boolean;
}

export const RuleConfigSection = ({ value, onChange, disabled }: RuleConfigSectionProps) => {
  const { formatMessage } = useIntl();

  const handleFreqChange = (next: string | number) => {
    onChange(updateFrequency(value, Number(next)));
  };

  const handleIntervalChange = (interval: number | undefined) => {
    if (interval !== undefined) {
      onChange(updateInterval(value, interval));
    }
  };

  const handleTimezoneChange = (tzid: string | number) => {
    onChange(updateTimezone(value, String(tzid)));
  };

  const handleDtstartChange = (date: Date | undefined) => {
    onChange(updateDtstart(value, date ? date.toLocaleString('sv').split(' ')[0] : undefined));
  };

  const freqOption = FREQUENCY_OPTIONS.find((o) => o.value === value.freq);
  const intervalUnit = freqOption?.plural ?? 'days';

  const intervalLabel = formatMessage({
    id: getTrad('interval.label'),
    defaultMessage: 'Repeat every',
  });
  const intervalHint = formatMessage(
    { id: getTrad('interval.hint'), defaultMessage: 'Every {count} {unit}' },
    { count: value.interval, unit: intervalUnit }
  );

  return (
    <Flex direction="column" alignItems="stretch" gap={4}>
      {/* Frequency */}
      <Field.Root name="frequency" id="rrule-frequency">
        <Field.Label>
          {formatMessage({ id: getTrad('frequency.label'), defaultMessage: 'Frequency' })}
        </Field.Label>
        <SingleSelect
          value={String(value.freq)}
          onChange={handleFreqChange}
          disabled={disabled}
        >
          {FREQUENCY_OPTIONS.map((opt) => (
            <SingleSelectOption key={opt.value} value={String(opt.value)}>
              {formatMessage({
                id: getTrad(`frequency.${opt.label.toLowerCase()}`),
                defaultMessage: opt.label,
              })}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </Field.Root>

      {/* Interval */}
      <Field.Root name="interval" id="rrule-interval" hint={intervalHint}>
        <Field.Label>{intervalLabel}</Field.Label>
        <NumberInput
          value={value.interval}
          onValueChange={handleIntervalChange}
          disabled={disabled}
          min={1}
        />
        <Field.Hint />
      </Field.Root>

      {/* Weekday picker (WEEKLY only) */}
      {value.freq === RRule.WEEKLY && (
        <WeekdayPicker value={value} onChange={onChange} disabled={disabled} />
      )}

      {/* Monthly options (MONTHLY only) */}
      {value.freq === RRule.MONTHLY && (
        <MonthlyOptions value={value} onChange={onChange} disabled={disabled} />
      )}

      {/* Start date */}
      <Field.Root name="dtstart" id="rrule-dtstart">
        <Field.Label>
          {formatMessage({ id: getTrad('dtstart.label'), defaultMessage: 'Start date' })}
        </Field.Label>
        <DatePicker
          value={value.dtstart ? new Date(value.dtstart) : undefined}
          onChange={handleDtstartChange}
          disabled={disabled}
        />
      </Field.Root>

      {/* Timezone */}
      <Field.Root name="tzid" id="rrule-tzid">
        <Field.Label>
          {formatMessage({ id: getTrad('timezone.label'), defaultMessage: 'Timezone' })}
        </Field.Label>
        <SingleSelect value={value.tzid} onChange={handleTimezoneChange} disabled={disabled}>
          {COMMON_TIMEZONES.map((tz) => (
            <SingleSelectOption key={tz} value={tz}>
              {tz}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </Field.Root>

      {/* End condition */}
      <EndConditionSection value={value} onChange={onChange} disabled={disabled} />
    </Flex>
  );
};
