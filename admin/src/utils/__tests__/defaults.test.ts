import { RRule } from 'rrule';
import { createDefaultRRule } from '../defaults';

describe('createDefaultRRule', () => {
  it('returns a valid RRuleValue', () => {
    const result = createDefaultRRule();
    expect(result).toHaveProperty('freq');
    expect(result).toHaveProperty('interval');
    expect(result).toHaveProperty('tzid');
    expect(result).toHaveProperty('rruleString');
  });

  it('defaults to weekly frequency', () => {
    const result = createDefaultRRule();
    expect(result.freq).toBe(RRule.WEEKLY);
  });

  it('defaults to interval of 1', () => {
    const result = createDefaultRRule();
    expect(result.interval).toBe(1);
  });

  it('defaults to Monday (0) as weekday', () => {
    const result = createDefaultRRule();
    expect(result.byweekday).toEqual([0]);
  });

  it('uses the system timezone', () => {
    const result = createDefaultRRule();
    const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(result.tzid).toBe(systemTz);
  });

  it('generates a non-empty rruleString', () => {
    const result = createDefaultRRule();
    expect(result.rruleString).toBeTruthy();
    expect(result.rruleString).toContain('FREQ=WEEKLY');
  });
});
