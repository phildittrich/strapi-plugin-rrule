import * as React from 'react';
import type { RRuleValue } from '../types';
interface MonthlyOptionsProps {
    value: RRuleValue;
    onChange: (value: RRuleValue) => void;
    disabled?: boolean;
}
export declare const MonthlyOptions: ({ value, onChange, disabled }: MonthlyOptionsProps) => React.JSX.Element;
export {};
