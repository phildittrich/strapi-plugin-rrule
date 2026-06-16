import * as React from 'react';
import { type InputProps } from '@strapi/strapi/admin';
type RRuleInputProps = InputProps & {
    labelAction?: React.ReactNode;
};
export declare const RRuleInput: React.ForwardRefExoticComponent<RRuleInputProps & React.RefAttributes<HTMLDivElement>>;
export {};
