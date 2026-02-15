import {
  Box,
  Flex,
  SingleSelect,
  SingleSelectOption,
  NumberInput,
  DatePicker,
  Typography,
} from '@strapi/design-system';
import { RRule } from 'rrule';
import * as React from 'react';
import { useIntl } from 'react-intl';

import type { RRuleValue } from '../types';
import { FREQUENCY_OPTIONS, COMMON_TIMEZONES } from '../types';
import {
  updateFrequency,
  updateInterval,
  updateTimezone,
  updateDtstart,
} from '../utils/rruleActions';
import { getTrad } from '../utils/getTrad';
import { WeekdayPicker } from './WeekdayPicker';
import { MonthlyOptions } from './MonthlyOptions';
import { EndConditionSection } from './EndConditionSection';

interface RuleConfigSectionProps {
  value: RRuleValue;
  onChange: (value: RRuleValue) => void;
  disabled?: boolean;
}

export const RuleConfigSection = ({ value, onChange, disabled }: RuleConfigSectionProps) => {
  const { formatMessage } = useIntl();

  const handleFreqChange = (freq: string | number) => {
    onChange(updateFrequency(value, Number(freq)));
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
    onChange(updateDtstart(value, date ? date.toISOString().split('T')[0] : undefined));
  };

  const freqOption = FREQUENCY_OPTIONS.find((o) => o.value === value.freq);
  const intervalUnit = freqOption?.plural ?? 'days';

  return (
    <Flex direction="column" alignItems="stretch" gap={4}>
      {/* Frequency */}
      <Box>
        <Typography variant="pi" fontWeight="bold" tag="label">
          {formatMessage({ id: getTrad('frequency.label'), defaultMessage: 'Frequency' })}
        </Typography>
        <SingleSelect
          aria-label={formatMessage({ id: getTrad('frequency.label'), defaultMessage: 'Frequency' })}
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
      </Box>

      {/* Interval */}
      <Box>
        <Typography variant="pi" fontWeight="bold" tag="label">
          {formatMessage(
            { id: getTrad('interval.label'), defaultMessage: 'Repeat every' },
          )}
        </Typography>
        <NumberInput
          aria-label={formatMessage(
            { id: getTrad('interval.label'), defaultMessage: 'Repeat every' },
          )}
          value={value.interval}
          onValueChange={handleIntervalChange}
          disabled={disabled}
          min={1}
        />
        <Typography variant="pi" textColor="neutral600">
          {formatMessage(
            { id: getTrad('interval.hint'), defaultMessage: 'Every {count} {unit}' },
            { count: value.interval, unit: intervalUnit }
          )}
        </Typography>
      </Box>

      {/* Weekday picker (WEEKLY only) */}
      {value.freq === RRule.WEEKLY && (
        <WeekdayPicker value={value} onChange={onChange} disabled={disabled} />
      )}

      {/* Monthly options (MONTHLY only) */}
      {value.freq === RRule.MONTHLY && (
        <MonthlyOptions value={value} onChange={onChange} disabled={disabled} />
      )}

      {/* Start date */}
      <Box>
        <Typography variant="pi" fontWeight="bold" tag="label">
          {formatMessage({ id: getTrad('dtstart.label'), defaultMessage: 'Start date' })}
        </Typography>
        <DatePicker
          aria-label={formatMessage({ id: getTrad('dtstart.label'), defaultMessage: 'Start date' })}
          value={value.dtstart ? new Date(value.dtstart) : undefined}
          onChange={handleDtstartChange}
          disabled={disabled}
        />
      </Box>

      {/* Timezone */}
      <Box>
        <Typography variant="pi" fontWeight="bold" tag="label">
          {formatMessage({ id: getTrad('timezone.label'), defaultMessage: 'Timezone' })}
        </Typography>
        <SingleSelect
          aria-label={formatMessage({ id: getTrad('timezone.label'), defaultMessage: 'Timezone' })}
          value={value.tzid}
          onChange={handleTimezoneChange}
          disabled={disabled}
        >
          {COMMON_TIMEZONES.map((tz) => (
            <SingleSelectOption key={tz} value={tz}>
              {tz}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </Box>

      {/* End condition */}
      <EndConditionSection value={value} onChange={onChange} disabled={disabled} />
    </Flex>
  );
};
