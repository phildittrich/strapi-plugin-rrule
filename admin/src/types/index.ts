export interface RRuleValue {
  freq: number;
  interval: number;
  byweekday?: number[];
  bymonthday?: number[];
  bymonth?: number[];
  bysetpos?: number[];
  dtstart?: string;
  until?: string;
  count?: number;
  tzid: string;
  wkst?: number;
  rruleString: string;
}

export type EndConditionType = 'never' | 'count' | 'until';

export const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Monday', short: 'Mon' },
  { value: 1, label: 'Tuesday', short: 'Tue' },
  { value: 2, label: 'Wednesday', short: 'Wed' },
  { value: 3, label: 'Thursday', short: 'Thu' },
  { value: 4, label: 'Friday', short: 'Fri' },
  { value: 5, label: 'Saturday', short: 'Sat' },
  { value: 6, label: 'Sunday', short: 'Sun' },
] as const;

export const FREQUENCY_OPTIONS = [
  { value: 3, label: 'Daily', plural: 'days' },
  { value: 2, label: 'Weekly', plural: 'weeks' },
  { value: 1, label: 'Monthly', plural: 'months' },
  { value: 0, label: 'Yearly', plural: 'years' },
] as const;

export const POSITION_OPTIONS = [
  { value: 1, label: 'First' },
  { value: 2, label: 'Second' },
  { value: 3, label: 'Third' },
  { value: 4, label: 'Fourth' },
  { value: -1, label: 'Last' },
] as const;

export const COMMON_TIMEZONES = [
  'UTC',
  'Africa/Tunis',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
] as const;
