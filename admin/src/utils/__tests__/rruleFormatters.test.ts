import { RRule } from 'rrule';
import type { RRuleValue } from '../../types';
import { formatRRuleToHuman, getNextOccurrences } from '../rruleFormatters';

const baseValue: RRuleValue = {
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [0],
  tzid: 'UTC',
  rruleString: '',
};

describe('formatRRuleToHuman', () => {
  it('returns human-readable text for weekly rule', () => {
    const result = formatRRuleToHuman(baseValue);
    expect(result.toLowerCase()).toContain('week');
  });

  it('describes daily recurrence', () => {
    const daily = { ...baseValue, freq: RRule.DAILY, byweekday: undefined };
    const result = formatRRuleToHuman(daily);
    expect(result.toLowerCase()).toContain('day');
  });

  it('includes interval in description', () => {
    const biweekly = { ...baseValue, interval: 2 };
    const result = formatRRuleToHuman(biweekly);
    expect(result.toLowerCase()).toContain('2');
  });

  it('includes count in description', () => {
    const withCount = { ...baseValue, count: 5, byweekday: undefined, freq: RRule.DAILY };
    const result = formatRRuleToHuman(withCount);
    expect(result.toLowerCase()).toContain('5');
  });

  it('returns fallback message on invalid input', () => {
    const invalid = { ...baseValue, freq: -999 };
    const result = formatRRuleToHuman(invalid);
    expect(result).toBe('Invalid recurrence rule');
  });
});

describe('getNextOccurrences', () => {
  it('returns up to maxCount occurrences', () => {
    const value: RRuleValue = {
      ...baseValue,
      freq: RRule.DAILY,
      byweekday: undefined,
      dtstart: '2026-01-01T00:00:00Z',
    };
    const dates = getNextOccurrences(value, 5);
    expect(dates).toHaveLength(5);
  });

  it('returns Date objects', () => {
    const value: RRuleValue = {
      ...baseValue,
      freq: RRule.DAILY,
      byweekday: undefined,
      dtstart: '2026-01-01T00:00:00Z',
    };
    const dates = getNextOccurrences(value);
    dates.forEach((d) => expect(d).toBeInstanceOf(Date));
  });

  it('defaults to 10 occurrences', () => {
    const value: RRuleValue = {
      ...baseValue,
      freq: RRule.DAILY,
      byweekday: undefined,
      dtstart: '2026-01-01T00:00:00Z',
    };
    const dates = getNextOccurrences(value);
    expect(dates).toHaveLength(10);
  });

  it('respects count limit when less than maxCount', () => {
    const value: RRuleValue = {
      ...baseValue,
      freq: RRule.DAILY,
      byweekday: undefined,
      dtstart: '2026-01-01T00:00:00Z',
      count: 3,
    };
    const dates = getNextOccurrences(value, 10);
    expect(dates).toHaveLength(3);
  });

  it('returns occurrences in chronological order', () => {
    const value: RRuleValue = {
      ...baseValue,
      freq: RRule.DAILY,
      byweekday: undefined,
      dtstart: '2026-01-01T00:00:00Z',
    };
    const dates = getNextOccurrences(value, 5);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].getTime()).toBeGreaterThan(dates[i - 1].getTime());
    }
  });

  it('returns empty array on invalid input', () => {
    const invalid = { ...baseValue, freq: -999 };
    const result = getNextOccurrences(invalid);
    expect(result).toEqual([]);
  });

  it('uses current date when no dtstart provided', () => {
    const value: RRuleValue = {
      ...baseValue,
      freq: RRule.DAILY,
      byweekday: undefined,
    };
    const dates = getNextOccurrences(value, 1);
    expect(dates).toHaveLength(1);
    // The first occurrence should be today or later
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(dates[0].getTime()).toBeGreaterThanOrEqual(today.getTime());
  });
});
