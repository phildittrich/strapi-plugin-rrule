import { RRule } from 'rrule';
import type { RRuleValue } from '../../types';
import {
  generateRRuleString,
  updateFrequency,
  updateInterval,
  toggleWeekday,
  updateEndCondition,
  updateTimezone,
  updateMonthDay,
  updateMonthPosition,
  updateDtstart,
} from '../rruleActions';

const baseValue: RRuleValue = {
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [0],
  tzid: 'UTC',
  rruleString: '',
};

describe('generateRRuleString', () => {
  it('generates a weekly rule string', () => {
    const result = generateRRuleString({ freq: RRule.WEEKLY, interval: 1 });
    expect(result).toContain('FREQ=WEEKLY');
    expect(result).toContain('INTERVAL=1');
  });

  it('includes byweekday when provided', () => {
    const result = generateRRuleString({
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: [0, 2],
    });
    expect(result).toContain('BYDAY=MO,WE');
  });

  it('includes bymonthday when provided', () => {
    const result = generateRRuleString({
      freq: RRule.MONTHLY,
      interval: 1,
      bymonthday: [15],
    });
    expect(result).toContain('BYMONTHDAY=15');
  });

  it('includes count when provided', () => {
    const result = generateRRuleString({
      freq: RRule.DAILY,
      interval: 1,
      count: 5,
    });
    expect(result).toContain('COUNT=5');
  });

  it('includes until when provided', () => {
    const result = generateRRuleString({
      freq: RRule.DAILY,
      interval: 1,
      until: '2026-12-31T00:00:00Z',
    });
    expect(result).toContain('UNTIL=');
  });

  it('includes dtstart when provided', () => {
    const result = generateRRuleString({
      freq: RRule.DAILY,
      interval: 1,
      dtstart: '2026-01-01T00:00:00Z',
    });
    expect(result).toContain('DTSTART');
  });

  it('includes bysetpos when provided', () => {
    const result = generateRRuleString({
      freq: RRule.MONTHLY,
      interval: 1,
      bysetpos: [1],
      byweekday: [0],
    });
    expect(result).toContain('BYSETPOS=1');
  });

  it('defaults to WEEKLY with interval 1 when no values provided', () => {
    const result = generateRRuleString({});
    expect(result).toContain('FREQ=WEEKLY');
  });

  it('returns empty string on invalid input', () => {
    const result = generateRRuleString({ freq: -999 });
    expect(result).toBe('');
  });

  it('strips the RRULE: prefix', () => {
    const result = generateRRuleString({ freq: RRule.DAILY, interval: 1 });
    expect(result).not.toMatch(/^RRULE:/);
  });
});

describe('updateFrequency', () => {
  it('sets freq and regenerates rruleString', () => {
    const result = updateFrequency(baseValue, RRule.DAILY);
    expect(result.freq).toBe(RRule.DAILY);
    expect(result.rruleString).toContain('FREQ=DAILY');
  });

  it('adds default byweekday [0] for weekly', () => {
    const noWeekday = { ...baseValue, byweekday: undefined };
    const result = updateFrequency(noWeekday, RRule.WEEKLY);
    expect(result.byweekday).toEqual([0]);
  });

  it('preserves existing byweekday for weekly', () => {
    const result = updateFrequency({ ...baseValue, byweekday: [0, 4] }, RRule.WEEKLY);
    expect(result.byweekday).toEqual([0, 4]);
  });

  it('adds default bymonthday [1] for monthly', () => {
    const result = updateFrequency(baseValue, RRule.MONTHLY);
    expect(result.bymonthday).toEqual([1]);
    expect(result.byweekday).toBeUndefined();
  });

  it('adds default bymonth [1] for yearly', () => {
    const result = updateFrequency(baseValue, RRule.YEARLY);
    expect(result.bymonth).toEqual([1]);
  });

  it('clears bysetpos on frequency change', () => {
    const withPos = { ...baseValue, bysetpos: [1] };
    const result = updateFrequency(withPos, RRule.DAILY);
    expect(result.bysetpos).toBeUndefined();
  });
});

describe('updateInterval', () => {
  it('sets the interval', () => {
    const result = updateInterval(baseValue, 3);
    expect(result.interval).toBe(3);
    expect(result.rruleString).toContain('INTERVAL=3');
  });

  it('clamps interval to minimum of 1', () => {
    const result = updateInterval(baseValue, 0);
    expect(result.interval).toBe(1);
  });

  it('clamps negative interval to 1', () => {
    const result = updateInterval(baseValue, -5);
    expect(result.interval).toBe(1);
  });
});

describe('toggleWeekday', () => {
  it('adds a weekday', () => {
    const result = toggleWeekday(baseValue, 4);
    expect(result.byweekday).toEqual([0, 4]);
  });

  it('removes a weekday', () => {
    const multi = { ...baseValue, byweekday: [0, 2, 4] };
    const result = toggleWeekday(multi, 2);
    expect(result.byweekday).toEqual([0, 4]);
  });

  it('prevents deselecting the last weekday', () => {
    const result = toggleWeekday(baseValue, 0);
    expect(result.byweekday).toEqual([0]);
    // Should return same reference when no change
    expect(result).toBe(baseValue);
  });

  it('keeps weekdays sorted', () => {
    const result = toggleWeekday({ ...baseValue, byweekday: [0, 4] }, 2);
    expect(result.byweekday).toEqual([0, 2, 4]);
  });

  it('handles undefined byweekday as empty array', () => {
    const noWeekday = { ...baseValue, byweekday: undefined };
    const result = toggleWeekday(noWeekday, 3);
    expect(result.byweekday).toEqual([3]);
  });
});

describe('updateEndCondition', () => {
  it('sets until date for "until" type', () => {
    const result = updateEndCondition(baseValue, 'until', '2026-12-31');
    expect(result.until).toBe('2026-12-31');
    expect(result.count).toBeUndefined();
  });

  it('sets count for "count" type', () => {
    const result = updateEndCondition(baseValue, 'count', 10);
    expect(result.count).toBe(10);
    expect(result.until).toBeUndefined();
  });

  it('clears both for "never" type', () => {
    const withEnd = { ...baseValue, until: '2026-12-31', count: 10 };
    const result = updateEndCondition(withEnd, 'never');
    expect(result.until).toBeUndefined();
    expect(result.count).toBeUndefined();
  });

  it('ignores non-string endValue for "until"', () => {
    const result = updateEndCondition(baseValue, 'until', 123);
    expect(result.until).toBeUndefined();
  });

  it('ignores non-number endValue for "count"', () => {
    const result = updateEndCondition(baseValue, 'count', 'abc');
    expect(result.count).toBeUndefined();
  });
});

describe('updateTimezone', () => {
  it('sets tzid and regenerates rruleString', () => {
    const result = updateTimezone(baseValue, 'Europe/Paris');
    expect(result.tzid).toBe('Europe/Paris');
    expect(result.rruleString).toBeTruthy();
  });
});

describe('updateMonthDay', () => {
  it('sets bymonthday and clears position fields', () => {
    const withPos = { ...baseValue, bysetpos: [1], byweekday: [0] };
    const result = updateMonthDay(withPos, 15);
    expect(result.bymonthday).toEqual([15]);
    expect(result.bysetpos).toBeUndefined();
    expect(result.byweekday).toBeUndefined();
  });
});

describe('updateMonthPosition', () => {
  it('sets bysetpos and byweekday, clears bymonthday', () => {
    const withDay = { ...baseValue, bymonthday: [15] };
    const result = updateMonthPosition(withDay, 2, 4);
    expect(result.bysetpos).toEqual([2]);
    expect(result.byweekday).toEqual([4]);
    expect(result.bymonthday).toBeUndefined();
  });
});

describe('updateDtstart', () => {
  it('sets dtstart', () => {
    const result = updateDtstart(baseValue, '2026-06-01T00:00:00Z');
    expect(result.dtstart).toBe('2026-06-01T00:00:00Z');
    expect(result.rruleString).toContain('DTSTART');
  });

  it('clears dtstart when undefined', () => {
    const withStart = { ...baseValue, dtstart: '2026-06-01T00:00:00Z' };
    const result = updateDtstart(withStart, undefined);
    expect(result.dtstart).toBeUndefined();
  });
});
