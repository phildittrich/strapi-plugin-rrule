export interface RRuleValue {
    freq: number;
    interval: number;
    byweekday?: number[];
    bymonthday?: number[];
    bymonth?: number[];
    bysetpos?: number[];
    dtstart?: string;
    until?: string;
    count?: number;
    tzid: string;
    wkst?: number;
    rruleString: string;
}
export type EndConditionType = 'never' | 'count' | 'until';
export declare const WEEKDAY_OPTIONS: readonly [{
    readonly value: 0;
    readonly label: "Monday";
    readonly short: "Mon";
}, {
    readonly value: 1;
    readonly label: "Tuesday";
    readonly short: "Tue";
}, {
    readonly value: 2;
    readonly label: "Wednesday";
    readonly short: "Wed";
}, {
    readonly value: 3;
    readonly label: "Thursday";
    readonly short: "Thu";
}, {
    readonly value: 4;
    readonly label: "Friday";
    readonly short: "Fri";
}, {
    readonly value: 5;
    readonly label: "Saturday";
    readonly short: "Sat";
}, {
    readonly value: 6;
    readonly label: "Sunday";
    readonly short: "Sun";
}];
export declare const FREQUENCY_OPTIONS: readonly [{
    readonly value: 3;
    readonly label: "Daily";
    readonly plural: "days";
}, {
    readonly value: 2;
    readonly label: "Weekly";
    readonly plural: "weeks";
}, {
    readonly value: 1;
    readonly label: "Monthly";
    readonly plural: "months";
}, {
    readonly value: 0;
    readonly label: "Yearly";
    readonly plural: "years";
}];
export declare const POSITION_OPTIONS: readonly [{
    readonly value: 1;
    readonly label: "First";
}, {
    readonly value: 2;
    readonly label: "Second";
}, {
    readonly value: 3;
    readonly label: "Third";
}, {
    readonly value: 4;
    readonly label: "Fourth";
}, {
    readonly value: -1;
    readonly label: "Last";
}];
export declare const COMMON_TIMEZONES: readonly ["UTC", "Africa/Tunis", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney"];
