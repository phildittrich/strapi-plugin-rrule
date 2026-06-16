import * as React from 'react';
import type { RRuleValue } from '../types';
interface RuleConfigSectionProps {
    value: RRuleValue;
    onChange: (value: RRuleValue) => void;
    disabled?: boolean;
}
export declare const RuleConfigSection: ({ value, onChange, disabled }: RuleConfigSectionProps) => React.JSX.Element;
export {};
