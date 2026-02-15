import { RRule } from 'rrule';
import type { RRuleValue, EndConditionType } from '../types';

export const generateRRuleString = (value: Partial<RRuleValue>): string => {
  try {
    const options: Partial<ConstructorParameters<typeof RRule>[0]> = {
      freq: value.freq ?? RRule.WEEKLY,
      interval: value.interval ?? 1,
    };

    if (value.byweekday?.length) {
      options.byweekday = value.byweekday;
    }
    if (value.bymonthday?.length) {
      options.bymonthday = value.bymonthday;
    }
    if (value.bymonth?.length) {
      options.bymonth = value.bymonth;
    }
    if (value.bysetpos?.length) {
      options.bysetpos = value.bysetpos;
    }
    if (value.dtstart) {
      options.dtstart = new Date(value.dtstart);
    }
    if (value.until) {
      options.until = new Date(value.until);
    }
    if (value.count) {
      options.count = value.count;
    }
    if (value.wkst !== undefined) {
      options.wkst = value.wkst;
    }

    const rule = new RRule(options);
    return rule.toString().replace('RRULE:', '');
  } catch {
    return '';
  }
};

const withRRuleString = (value: RRuleValue): RRuleValue => ({
  ...value,
  rruleString: generateRRuleString(value),
});

export const updateFrequency = (
  value: RRuleValue,
  freq: number
): RRuleValue => {
  return withRRuleString({
    ...value,
    freq,
    byweekday: freq === RRule.WEEKLY ? (value.byweekday ?? [0]) : undefined,
    bymonthday: freq === RRule.MONTHLY ? (value.bymonthday ?? [1]) : undefined,
    bymonth: freq === RRule.YEARLY ? (value.bymonth ?? [1]) : undefined,
    bysetpos: undefined,
  });
};

export const updateInterval = (
  value: RRuleValue,
  interval: number
): RRuleValue => {
  return withRRuleString({ ...value, interval: Math.max(1, interval) });
};

export const toggleWeekday = (
  value: RRuleValue,
  weekday: number
): RRuleValue => {
  const current = value.byweekday ?? [];
  const updated = current.includes(weekday)
    ? current.filter((d) => d !== weekday)
    : [...current, weekday].sort();

  // Prevent deselecting all days
  if (updated.length === 0) return value;

  return withRRuleString({ ...value, byweekday: updated });
};

export const updateEndCondition = (
  value: RRuleValue,
  type: EndConditionType,
  endValue?: string | number
): RRuleValue => {
  return withRRuleString({
    ...value,
    until: type === 'until' && typeof endValue === 'string' ? endValue : undefined,
    count: type === 'count' && typeof endValue === 'number' ? endValue : undefined,
  });
};

export const updateTimezone = (
  value: RRuleValue,
  tzid: string
): RRuleValue => {
  return withRRuleString({ ...value, tzid });
};

export const updateMonthDay = (
  value: RRuleValue,
  day: number
): RRuleValue => {
  return withRRuleString({
    ...value,
    bymonthday: [day],
    bysetpos: undefined,
    byweekday: undefined,
  });
};

export const updateMonthPosition = (
  value: RRuleValue,
  position: number,
  weekday: number
): RRuleValue => {
  return withRRuleString({
    ...value,
    bysetpos: [position],
    byweekday: [weekday],
    bymonthday: undefined,
  });
};

export const updateDtstart = (
  value: RRuleValue,
  dtstart: string | undefined
): RRuleValue => {
  return withRRuleString({ ...value, dtstart });
};
