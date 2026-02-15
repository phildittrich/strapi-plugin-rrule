import { RRule } from 'rrule';
import type { RRuleValue } from '../types';
import { generateRRuleString } from './rruleActions';

export const createDefaultRRule = (): RRuleValue => {
  const base: Omit<RRuleValue, 'rruleString'> = {
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [0],
    tzid: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  return {
    ...base,
    rruleString: generateRRuleString(base as RRuleValue),
  };
};
