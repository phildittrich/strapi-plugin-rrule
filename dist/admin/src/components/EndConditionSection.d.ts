import * as React from 'react';
import type { RRuleValue } from '../types';
interface EndConditionSectionProps {
    value: RRuleValue;
    onChange: (value: RRuleValue) => void;
    disabled?: boolean;
}
export declare const EndConditionSection: ({ value, onChange, disabled, }: EndConditionSectionProps) => React.JSX.Element;
export {};
