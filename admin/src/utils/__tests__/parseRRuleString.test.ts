import { RRule } from 'rrule';

import { parseRRuleString } from '../parseRRuleString';

describe('parseRRuleString', () => {
  it('returns null for an empty string', () => {
    expect(parseRRuleString('')).toBeNull();
  });

  it('returns null for a malformed RRULE string', () => {
    expect(parseRRuleString('this-is-not-an-rrule')).toBeNull();
    expect(parseRRuleString('FREQ=BOGUS')).toBeNull();
  });

  it('parses a weekly rule with byweekday', () => {
    const parsed = parseRRuleString('FREQ=WEEKLY;BYDAY=MO,WE,FR');

    expect(parsed).not.toBeNull();
    expect(parsed!.freq).toBe(RRule.WEEKLY);
    expect(parsed!.interval).toBe(1);
    expect(parsed!.byweekday).toEqual([0, 2, 4]);
    expect(parsed!.rruleString).toBe('FREQ=WEEKLY;BYDAY=MO,WE,FR');
  });

  it('parses a daily rule with interval', () => {
    const parsed = parseRRuleString('FREQ=DAILY;INTERVAL=3');

    expect(parsed).not.toBeNull();
    expect(parsed!.freq).toBe(RRule.DAILY);
    expect(parsed!.interval).toBe(3);
  });

  it('parses a monthly rule with bymonthday', () => {
    const parsed = parseRRuleString('FREQ=MONTHLY;BYMONTHDAY=15');

    expect(parsed).not.toBeNull();
    expect(parsed!.freq).toBe(RRule.MONTHLY);
    expect(parsed!.bymonthday).toEqual([15]);
  });

  it('parses a monthly rule with bysetpos and byweekday (1st Monday)', () => {
    const parsed = parseRRuleString('FREQ=MONTHLY;BYDAY=MO;BYSETPOS=1');

    expect(parsed).not.toBeNull();
    expect(parsed!.freq).toBe(RRule.MONTHLY);
    expect(parsed!.byweekday).toEqual([0]);
    expect(parsed!.bysetpos).toEqual([1]);
  });

  it('parses a rule with COUNT', () => {
    const parsed = parseRRuleString('FREQ=DAILY;COUNT=10');

    expect(parsed).not.toBeNull();
    expect(parsed!.count).toBe(10);
    expect(parsed!.until).toBeUndefined();
  });

  it('parses a rule with UNTIL', () => {
    const parsed = parseRRuleString('FREQ=DAILY;UNTIL=20261231T000000Z');

    expect(parsed).not.toBeNull();
    expect(parsed!.until).toBeDefined();
    expect(parsed!.count).toBeUndefined();
  });

  it('preserves the original rruleString on the parsed value', () => {
    const input = 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=15';
    const parsed = parseRRuleString(input);

    expect(parsed!.rruleString).toBe(input);
  });

  it('falls back to system timezone when none is encoded in the rule', () => {
    const parsed = parseRRuleString('FREQ=DAILY');

    expect(parsed).not.toBeNull();
    expect(typeof parsed!.tzid).toBe('string');
    expect(parsed!.tzid.length).toBeGreaterThan(0);
  });

  it('accepts strings with the RRULE: prefix', () => {
    const parsed = parseRRuleString('RRULE:FREQ=WEEKLY;BYDAY=TU');

    expect(parsed).not.toBeNull();
    expect(parsed!.freq).toBe(RRule.WEEKLY);
    expect(parsed!.byweekday).toEqual([1]);
  });
});
