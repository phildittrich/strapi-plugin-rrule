import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { Flex, Field, SingleSelect, SingleSelectOption, NumberInput, DatePicker, Box, Typography, Checkbox, Grid } from "@strapi/design-system";
import { useField } from "@strapi/strapi/admin";
import { useIntl } from "react-intl";
import { RRule, rrulestr } from "rrule";
import { g as getTrad } from "./index-BgBuqBGK.mjs";
const generateRRuleString = (value) => {
  try {
    const options = {
      freq: value.freq ?? RRule.WEEKLY,
      interval: value.interval ?? 1
    };
    if (value.byweekday?.length) {
      options.byweekday = value.byweekday;
    }
    if (value.bymonthday?.length) {
      options.bymonthday = value.bymonthday;
    }
    if (value.bymonth?.length) {
      options.bymonth = value.bymonth;
    }
    if (value.bysetpos?.length) {
      options.bysetpos = value.bysetpos;
    }
    if (value.dtstart) {
      options.dtstart = new Date(value.dtstart);
    }
    if (value.until) {
      options.until = new Date(value.until);
    }
    if (value.count) {
      options.count = value.count;
    }
    if (value.wkst !== void 0) {
      options.wkst = value.wkst;
    }
    const rule = new RRule(options);
    return rule.toString().replace("RRULE:", "");
  } catch {
    return "";
  }
};
const withRRuleString = (value) => ({
  ...value,
  rruleString: generateRRuleString(value)
});
const updateFrequency = (value, freq) => {
  return withRRuleString({
    ...value,
    freq,
    byweekday: freq === RRule.WEEKLY ? value.byweekday ?? [0] : void 0,
    bymonthday: freq === RRule.MONTHLY ? value.bymonthday ?? [1] : void 0,
    bymonth: freq === RRule.YEARLY ? value.bymonth ?? [1] : void 0,
    bysetpos: void 0
  });
};
const updateInterval = (value, interval) => {
  return withRRuleString({ ...value, interval: Math.max(1, interval) });
};
const toggleWeekday = (value, weekday) => {
  const current = value.byweekday ?? [];
  const updated = current.includes(weekday) ? current.filter((d) => d !== weekday) : [...current, weekday].sort();
  if (updated.length === 0) return value;
  return withRRuleString({ ...value, byweekday: updated });
};
const updateEndCondition = (value, type, endValue) => {
  return withRRuleString({
    ...value,
    until: type === "until" && typeof endValue === "string" ? endValue : void 0,
    count: type === "count" && typeof endValue === "number" ? endValue : void 0
  });
};
const updateTimezone = (value, tzid) => {
  return withRRuleString({ ...value, tzid });
};
const updateMonthDay = (value, day) => {
  return withRRuleString({
    ...value,
    bymonthday: [day],
    bysetpos: void 0,
    byweekday: void 0
  });
};
const updateMonthPosition = (value, position, weekday) => {
  return withRRuleString({
    ...value,
    bysetpos: [position],
    byweekday: [weekday],
    bymonthday: void 0
  });
};
const updateDtstart = (value, dtstart) => {
  return withRRuleString({ ...value, dtstart });
};
const createDefaultRRule = () => {
  const base = {
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [0],
    tzid: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  return {
    ...base,
    rruleString: generateRRuleString(base)
  };
};
const arrayOrUndefined = (values) => {
  if (!values || values.length === 0) return void 0;
  return [...values];
};
const dateOrUndefined = (date) => date ? date.toISOString() : void 0;
const parseRRuleString = (input) => {
  if (!input || !input.trim()) return null;
  try {
    const rule = rrulestr(input);
    const options = rule.options;
    const stripped = input.replace(/^RRULE:/, "");
    return {
      freq: options.freq,
      interval: options.interval ?? 1,
      byweekday: arrayOrUndefined(options.byweekday),
      bymonthday: arrayOrUndefined(options.bymonthday),
      bymonth: arrayOrUndefined(options.bymonth),
      bysetpos: arrayOrUndefined(options.bysetpos),
      dtstart: dateOrUndefined(options.dtstart),
      until: dateOrUndefined(options.until),
      count: options.count ?? void 0,
      wkst: options.wkst ?? void 0,
      tzid: options.tzid ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      rruleString: stripped
    };
  } catch {
    return null;
  }
};
const WEEKDAY_OPTIONS = [
  { value: 0, label: "Monday", short: "Mon" },
  { value: 1, label: "Tuesday", short: "Tue" },
  { value: 2, label: "Wednesday", short: "Wed" },
  { value: 3, label: "Thursday", short: "Thu" },
  { value: 4, label: "Friday", short: "Fri" },
  { value: 5, label: "Saturday", short: "Sat" },
  { value: 6, label: "Sunday", short: "Sun" }
];
const FREQUENCY_OPTIONS = [
  { value: 3, label: "Daily", plural: "days" },
  { value: 2, label: "Weekly", plural: "weeks" },
  { value: 1, label: "Monthly", plural: "months" },
  { value: 0, label: "Yearly", plural: "years" }
];
const POSITION_OPTIONS = [
  { value: 1, label: "First" },
  { value: 2, label: "Second" },
  { value: 3, label: "Third" },
  { value: 4, label: "Fourth" },
  { value: -1, label: "Last" }
];
const COMMON_TIMEZONES = [
  "UTC",
  "Africa/Tunis",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney"
];
const EndConditionSection = ({
  value,
  onChange,
  disabled
}) => {
  const { formatMessage } = useIntl();
  const endType = value.count ? "count" : value.until ? "until" : "never";
  const handleTypeChange = (type) => {
    const t = String(type);
    if (t === "never") {
      onChange(updateEndCondition(value, "never"));
    } else if (t === "count") {
      onChange(updateEndCondition(value, "count", 10));
    } else if (t === "until") {
      const threeMonthsFromNow = /* @__PURE__ */ new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      onChange(
        updateEndCondition(value, "until", threeMonthsFromNow.toISOString().split("T")[0])
      );
    }
  };
  const handleCountChange = (count) => {
    if (count !== void 0 && count > 0) {
      onChange(updateEndCondition(value, "count", count));
    }
  };
  const handleDateChange = (date) => {
    if (!date) return;
    const isoDate = date.toLocaleString("sv").split(" ")[0];
    onChange(updateEndCondition(value, "until", isoDate));
  };
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
    /* @__PURE__ */ jsxs(Field.Root, { name: "end-type", id: "rrule-end-type", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTrad("end.label"), defaultMessage: "Ends" }) }),
      /* @__PURE__ */ jsxs(SingleSelect, { value: endType, onChange: handleTypeChange, disabled, children: [
        /* @__PURE__ */ jsx(SingleSelectOption, { value: "never", children: formatMessage({ id: getTrad("end.never"), defaultMessage: "Never" }) }),
        /* @__PURE__ */ jsx(SingleSelectOption, { value: "count", children: formatMessage({
          id: getTrad("end.count"),
          defaultMessage: "After occurrences"
        }) }),
        /* @__PURE__ */ jsx(SingleSelectOption, { value: "until", children: formatMessage({ id: getTrad("end.until"), defaultMessage: "On date" }) })
      ] })
    ] }),
    endType === "count" && /* @__PURE__ */ jsxs(Field.Root, { name: "end-count", id: "rrule-end-count", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
        id: getTrad("end.count.value"),
        defaultMessage: "Number of occurrences"
      }) }),
      /* @__PURE__ */ jsx(
        NumberInput,
        {
          value: value.count ?? 10,
          onValueChange: handleCountChange,
          disabled,
          min: 1
        }
      )
    ] }),
    endType === "until" && /* @__PURE__ */ jsxs(Field.Root, { name: "end-until", id: "rrule-end-until", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
        id: getTrad("end.until.value"),
        defaultMessage: "End date"
      }) }),
      /* @__PURE__ */ jsx(
        DatePicker,
        {
          value: value.until ? new Date(value.until) : void 0,
          onChange: handleDateChange,
          disabled
        }
      )
    ] })
  ] });
};
const MonthlyOptions = ({ value, onChange, disabled }) => {
  const { formatMessage } = useIntl();
  const mode = value.bysetpos?.length ? "position" : "day";
  const dayOfMonth = value.bymonthday?.[0] ?? 1;
  const position = value.bysetpos?.[0] ?? 1;
  const weekday = mode === "position" ? value.byweekday?.[0] ?? 0 : 0;
  const handleModeChange = (newMode) => {
    if (String(newMode) === "day") {
      onChange(updateMonthDay(value, dayOfMonth));
    } else {
      onChange(updateMonthPosition(value, position, weekday));
    }
  };
  const handleDayChange = (day) => {
    if (day !== void 0) {
      onChange(updateMonthDay(value, Math.min(31, Math.max(1, day))));
    }
  };
  const handlePositionChange = (pos) => {
    onChange(updateMonthPosition(value, Number(pos), weekday));
  };
  const handleWeekdayChange = (wd) => {
    onChange(updateMonthPosition(value, position, Number(wd)));
  };
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
    /* @__PURE__ */ jsxs(Field.Root, { name: "monthly-mode", id: "rrule-monthly-mode", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTrad("monthly.mode.label"), defaultMessage: "Repeat by" }) }),
      /* @__PURE__ */ jsxs(SingleSelect, { value: mode, onChange: handleModeChange, disabled, children: [
        /* @__PURE__ */ jsx(SingleSelectOption, { value: "day", children: formatMessage({
          id: getTrad("monthly.bymonthday"),
          defaultMessage: "Day of month"
        }) }),
        /* @__PURE__ */ jsx(SingleSelectOption, { value: "position", children: formatMessage({
          id: getTrad("monthly.bysetpos"),
          defaultMessage: "Day of week (e.g., 1st Monday)"
        }) })
      ] })
    ] }),
    mode === "day" && /* @__PURE__ */ jsxs(Field.Root, { name: "monthly-day", id: "rrule-monthly-day", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTrad("monthly.day.label"), defaultMessage: "Day" }) }),
      /* @__PURE__ */ jsx(
        NumberInput,
        {
          value: dayOfMonth,
          onValueChange: handleDayChange,
          disabled,
          min: 1,
          max: 31
        }
      )
    ] }),
    mode === "position" && /* @__PURE__ */ jsxs(Flex, { gap: 2, alignItems: "end", children: [
      /* @__PURE__ */ jsxs(Field.Root, { name: "monthly-position", id: "rrule-monthly-position", flex: "1", children: [
        /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
          id: getTrad("monthly.position.label"),
          defaultMessage: "Position"
        }) }),
        /* @__PURE__ */ jsx(
          SingleSelect,
          {
            value: String(position),
            onChange: handlePositionChange,
            disabled,
            children: POSITION_OPTIONS.map((opt) => /* @__PURE__ */ jsx(SingleSelectOption, { value: String(opt.value), children: formatMessage({
              id: getTrad(`monthly.position.${opt.label.toLowerCase()}`),
              defaultMessage: opt.label
            }) }, opt.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Field.Root, { name: "monthly-weekday", id: "rrule-monthly-weekday", flex: "1", children: [
        /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
          id: getTrad("monthly.weekday.label"),
          defaultMessage: "Day of week"
        }) }),
        /* @__PURE__ */ jsx(
          SingleSelect,
          {
            value: String(weekday),
            onChange: handleWeekdayChange,
            disabled,
            children: WEEKDAY_OPTIONS.map((opt) => /* @__PURE__ */ jsx(SingleSelectOption, { value: String(opt.value), children: formatMessage({
              id: getTrad(`weekday.${opt.label.toLowerCase()}`),
              defaultMessage: opt.label
            }) }, opt.value))
          }
        )
      ] })
    ] })
  ] });
};
const longKey = (label) => `weekday.${label.toLowerCase()}`;
const WeekdayPicker = ({ value, onChange, disabled }) => {
  const { formatMessage } = useIntl();
  const selectedDays = value.byweekday ?? [];
  const groupLabelId = React.useId();
  const handleToggle = (weekday) => {
    onChange(toggleWeekday(value, weekday));
  };
  const groupLabel = formatMessage({
    id: getTrad("weekdays.label"),
    defaultMessage: "Repeat on"
  });
  return /* @__PURE__ */ jsxs(Box, { role: "group", "aria-labelledby": groupLabelId, children: [
    /* @__PURE__ */ jsx(Typography, { id: groupLabelId, variant: "pi", fontWeight: "bold", children: groupLabel }),
    /* @__PURE__ */ jsx(Flex, { gap: 3, wrap: "wrap", paddingTop: 2, children: WEEKDAY_OPTIONS.map(({ value: day, label, short }) => {
      const fullName = formatMessage({
        id: getTrad(longKey(label)),
        defaultMessage: label
      });
      const shortName = formatMessage({
        id: getTrad(`weekday.short.${short}`),
        defaultMessage: short
      });
      const fieldId = `${groupLabelId}-${day}`;
      return /* @__PURE__ */ jsx(Field.Root, { name: `weekday-${day}`, id: fieldId, children: /* @__PURE__ */ jsxs(Flex, { alignItems: "center", gap: 1, children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            id: fieldId,
            checked: selectedDays.includes(day),
            onCheckedChange: () => handleToggle(day),
            disabled,
            "aria-label": fullName
          }
        ),
        /* @__PURE__ */ jsx(Field.Label, { children: shortName })
      ] }) }, day);
    }) })
  ] });
};
const RuleConfigSection = ({ value, onChange, disabled }) => {
  const { formatMessage } = useIntl();
  const handleFreqChange = (next) => {
    onChange(updateFrequency(value, Number(next)));
  };
  const handleIntervalChange = (interval) => {
    if (interval !== void 0) {
      onChange(updateInterval(value, interval));
    }
  };
  const handleTimezoneChange = (tzid) => {
    onChange(updateTimezone(value, String(tzid)));
  };
  const handleDtstartChange = (date) => {
    onChange(updateDtstart(value, date ? date.toLocaleString("sv").split(" ")[0] : void 0));
  };
  const freqOption = FREQUENCY_OPTIONS.find((o) => o.value === value.freq);
  const intervalUnit = freqOption?.plural ?? "days";
  const intervalLabel = formatMessage({
    id: getTrad("interval.label"),
    defaultMessage: "Repeat every"
  });
  const intervalHint = formatMessage(
    { id: getTrad("interval.hint"), defaultMessage: "Every {count} {unit}" },
    { count: value.interval, unit: intervalUnit }
  );
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 4, children: [
    /* @__PURE__ */ jsxs(Field.Root, { name: "frequency", id: "rrule-frequency", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTrad("frequency.label"), defaultMessage: "Frequency" }) }),
      /* @__PURE__ */ jsx(
        SingleSelect,
        {
          value: String(value.freq),
          onChange: handleFreqChange,
          disabled,
          children: FREQUENCY_OPTIONS.map((opt) => /* @__PURE__ */ jsx(SingleSelectOption, { value: String(opt.value), children: formatMessage({
            id: getTrad(`frequency.${opt.label.toLowerCase()}`),
            defaultMessage: opt.label
          }) }, opt.value))
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Field.Root, { name: "interval", id: "rrule-interval", hint: intervalHint, children: [
      /* @__PURE__ */ jsx(Field.Label, { children: intervalLabel }),
      /* @__PURE__ */ jsx(
        NumberInput,
        {
          value: value.interval,
          onValueChange: handleIntervalChange,
          disabled,
          min: 1
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {})
    ] }),
    value.freq === RRule.WEEKLY && /* @__PURE__ */ jsx(WeekdayPicker, { value, onChange, disabled }),
    value.freq === RRule.MONTHLY && /* @__PURE__ */ jsx(MonthlyOptions, { value, onChange, disabled }),
    /* @__PURE__ */ jsxs(Field.Root, { name: "dtstart", id: "rrule-dtstart", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTrad("dtstart.label"), defaultMessage: "Start date" }) }),
      /* @__PURE__ */ jsx(
        DatePicker,
        {
          value: value.dtstart ? new Date(value.dtstart) : void 0,
          onChange: handleDtstartChange,
          disabled
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Field.Root, { name: "tzid", id: "rrule-tzid", children: [
      /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTrad("timezone.label"), defaultMessage: "Timezone" }) }),
      /* @__PURE__ */ jsx(SingleSelect, { value: value.tzid, onChange: handleTimezoneChange, disabled, children: COMMON_TIMEZONES.map((tz) => /* @__PURE__ */ jsx(SingleSelectOption, { value: tz, children: tz }, tz)) })
    ] }),
    /* @__PURE__ */ jsx(EndConditionSection, { value, onChange, disabled })
  ] });
};
const formatRRuleToHuman = (value) => {
  try {
    const options = {
      freq: value.freq,
      interval: value.interval
    };
    if (value.byweekday?.length) options.byweekday = value.byweekday;
    if (value.bymonthday?.length) options.bymonthday = value.bymonthday;
    if (value.bymonth?.length) options.bymonth = value.bymonth;
    if (value.bysetpos?.length) options.bysetpos = value.bysetpos;
    if (value.until) options.until = new Date(value.until);
    if (value.count) options.count = value.count;
    const rule = new RRule(options);
    return rule.toText();
  } catch {
    return "Invalid recurrence rule";
  }
};
const getNextOccurrences = (value, maxCount = 10) => {
  try {
    const options = {
      freq: value.freq,
      interval: value.interval,
      dtstart: value.dtstart ? new Date(value.dtstart) : /* @__PURE__ */ new Date()
    };
    if (value.byweekday?.length) options.byweekday = value.byweekday;
    if (value.bymonthday?.length) options.bymonthday = value.bymonthday;
    if (value.bymonth?.length) options.bymonth = value.bymonth;
    if (value.bysetpos?.length) options.bysetpos = value.bysetpos;
    if (value.until) options.until = new Date(value.until);
    if (value.count) options.count = Math.min(value.count, maxCount);
    const rule = new RRule(options);
    return rule.all((_, i) => i < maxCount);
  } catch {
    return [];
  }
};
const RulePreview = ({ value }) => {
  const { formatMessage, formatDate } = useIntl();
  const humanReadable = React.useMemo(() => formatRRuleToHuman(value), [value]);
  const occurrences = React.useMemo(() => getNextOccurrences(value, 5), [value]);
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 3, children: [
    /* @__PURE__ */ jsx(
      Box,
      {
        background: "primary100",
        borderColor: "primary200",
        hasRadius: true,
        padding: 3,
        children: /* @__PURE__ */ jsx(Typography, { variant: "omega", fontWeight: "semiBold", textColor: "primary700", children: humanReadable })
      }
    ),
    /* @__PURE__ */ jsxs(Box, { children: [
      /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({ id: getTrad("preview.timezone"), defaultMessage: "Timezone" }) }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 1, children: /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral500", children: value.tzid }) })
    ] }),
    /* @__PURE__ */ jsxs(Box, { children: [
      /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: getTrad("preview.occurrences"),
        defaultMessage: "Next occurrences"
      }) }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 1, children: occurrences.length === 0 ? /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral400", children: formatMessage({
        id: getTrad("preview.noOccurrences"),
        defaultMessage: "No upcoming occurrences"
      }) }) : /* @__PURE__ */ jsx(Flex, { direction: "column", alignItems: "stretch", gap: 1, children: occurrences.map((date, index) => /* @__PURE__ */ jsxs(
        Flex,
        {
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2,
          hasRadius: true,
          background: index % 2 === 0 ? "neutral0" : "transparent",
          children: [
            /* @__PURE__ */ jsx(Typography, { variant: "pi", children: formatDate(date, {
              year: "numeric",
              month: "short",
              day: "numeric",
              weekday: "short"
            }) }),
            /* @__PURE__ */ jsxs(Typography, { variant: "pi", textColor: "neutral500", children: [
              "#",
              index + 1
            ] })
          ]
        },
        index
      )) }) })
    ] }),
    /* @__PURE__ */ jsxs(Box, { children: [
      /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: getTrad("preview.rruleString"),
        defaultMessage: "RFC 5545"
      }) }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 1, background: "neutral200", hasRadius: true, padding: 2, children: /* @__PURE__ */ jsx(Typography, { tag: "code", variant: "pi", textColor: "neutral800", children: value.rruleString || formatMessage({ id: getTrad("preview.emptyRrule"), defaultMessage: "(empty)" }) }) })
    ] })
  ] });
};
const isFullRRuleValue = (value) => !!value && typeof value === "object" && "rruleString" in value && "freq" in value && typeof value.freq === "number";
const isRRuleStringOnly = (value) => !!value && typeof value === "object" && "rruleString" in value && typeof value.rruleString === "string" && !("freq" in value);
const RRuleInput = React.forwardRef(
  ({ hint, disabled, labelAction, label, name, required }, forwardedRef) => {
    const { formatMessage } = useIntl();
    const field = useField(name);
    const value = React.useMemo(() => {
      if (isFullRRuleValue(field.value)) {
        return field.value;
      }
      if (isRRuleStringOnly(field.value)) {
        const parsed = parseRRuleString(field.value.rruleString);
        if (parsed) return parsed;
      }
      return createDefaultRRule();
    }, [field.value]);
    const handleChange = React.useCallback(
      (newValue) => {
        field.onChange(name, newValue);
      },
      [field, name]
    );
    return /* @__PURE__ */ jsx(
      Field.Root,
      {
        name,
        id: name,
        error: field.error,
        hint,
        required,
        ref: forwardedRef,
        children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 1, children: [
          /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
          /* @__PURE__ */ jsxs(
            Box,
            {
              background: "neutral0",
              borderColor: "neutral200",
              hasRadius: true,
              overflow: "hidden",
              children: [
                /* @__PURE__ */ jsx(
                  Box,
                  {
                    background: "neutral100",
                    borderColor: "neutral200",
                    paddingTop: 3,
                    paddingBottom: 3,
                    paddingLeft: 4,
                    paddingRight: 4,
                    children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
                      id: getTrad("header.title"),
                      defaultMessage: "Recurrence Rule"
                    }) })
                  }
                ),
                /* @__PURE__ */ jsxs(Grid.Root, { gridCols: 2, gap: 0, children: [
                  /* @__PURE__ */ jsx(Grid.Item, { col: 2, s: 2, m: 1, direction: "column", alignItems: "stretch", padding: 4, children: /* @__PURE__ */ jsx(
                    RuleConfigSection,
                    {
                      value,
                      onChange: handleChange,
                      disabled
                    }
                  ) }),
                  /* @__PURE__ */ jsx(
                    Grid.Item,
                    {
                      col: 2,
                      s: 2,
                      m: 1,
                      direction: "column",
                      alignItems: "stretch",
                      padding: 4,
                      background: "neutral100",
                      borderColor: "neutral200",
                      children: /* @__PURE__ */ jsx(RulePreview, { value })
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(Field.Hint, {}),
          /* @__PURE__ */ jsx(Field.Error, {})
        ] })
      }
    );
  }
);
export {
  RRuleInput
};
