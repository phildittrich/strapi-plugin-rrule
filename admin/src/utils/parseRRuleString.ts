import { rrulestr } from 'rrule';

import type { RRuleValue } from '../types';

const arrayOrUndefined = (
  values: number[] | null | undefined
): number[] | undefined => {
  if (!values || values.length === 0) return undefined;
  return [...values];
};

const dateOrUndefined = (date: Date | null | undefined): string | undefined =>
  date ? date.toISOString() : undefined;

export const parseRRuleString = (input: string): RRuleValue | null => {
  if (!input || !input.trim()) return null;

  try {
    const rule = rrulestr(input);
    const options = rule.options;
    const stripped = input.replace(/^RRULE:/, '');

    return {
      freq: options.freq,
      interval: options.interval ?? 1,
      byweekday: arrayOrUndefined(options.byweekday),
      bymonthday: arrayOrUndefined(options.bymonthday),
      bymonth: arrayOrUndefined(options.bymonth),
      bysetpos: arrayOrUndefined(options.bysetpos),
      dtstart: dateOrUndefined(options.dtstart),
      until: dateOrUndefined(options.until),
      count: options.count ?? undefined,
      wkst: options.wkst ?? undefined,
      tzid: options.tzid ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      rruleString: stripped,
    };
  } catch {
    return null;
  }
};
