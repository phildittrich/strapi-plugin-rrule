import * as React from 'react';
import type { RRuleValue } from '../types';
interface WeekdayPickerProps {
    value: RRuleValue;
    onChange: (value: RRuleValue) => void;
    disabled?: boolean;
}
export declare const WeekdayPicker: ({ value, onChange, disabled }: WeekdayPickerProps) => React.JSX.Element;
export {};
