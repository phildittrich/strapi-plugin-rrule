import { RRule } from 'rrule';
import type { RRuleValue } from '../types';

export const formatRRuleToHuman = (value: RRuleValue): string => {
  try {
    const options: Partial<ConstructorParameters<typeof RRule>[0]> = {
      freq: value.freq,
      interval: value.interval,
    };

    if (value.byweekday?.length) options.byweekday = value.byweekday;
    if (value.bymonthday?.length) options.bymonthday = value.bymonthday;
    if (value.bymonth?.length) options.bymonth = value.bymonth;
    if (value.bysetpos?.length) options.bysetpos = value.bysetpos;
    if (value.until) options.until = new Date(value.until);
    if (value.count) options.count = value.count;

    const rule = new RRule(options);
    return rule.toText();
  } catch {
    return 'Invalid recurrence rule';
  }
};

export const getNextOccurrences = (
  value: RRuleValue,
  maxCount: number = 10
): Date[] => {
  try {
    const options: Partial<ConstructorParameters<typeof RRule>[0]> = {
      freq: value.freq,
      interval: value.interval,
      dtstart: value.dtstart ? new Date(value.dtstart) : new Date(),
    };

    if (value.byweekday?.length) options.byweekday = value.byweekday;
    if (value.bymonthday?.length) options.bymonthday = value.bymonthday;
    if (value.bymonth?.length) options.bymonth = value.bymonth;
    if (value.bysetpos?.length) options.bysetpos = value.bysetpos;
    if (value.until) options.until = new Date(value.until);
    if (value.count) options.count = Math.min(value.count, maxCount);

    const rule = new RRule(options);
    return rule.all((_, i) => i < maxCount);
  } catch {
    return [];
  }
};
