import type { RRuleValue } from '../types';
export declare const formatRRuleToHuman: (value: RRuleValue) => string;
export declare const getNextOccurrences: (value: RRuleValue, maxCount?: number) => Date[];
