import * as React from 'react';

import { Box, Field, Flex, Grid, Typography } from '@strapi/design-system';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';

import type { RRuleValue } from '../types';
import { createDefaultRRule } from '../utils/defaults';
import { getTrad } from '../utils/getTrad';
import { parseRRuleString } from '../utils/parseRRuleString';
import { RuleConfigSection } from './RuleConfigSection';
import { RulePreview } from './RulePreview';

type RRuleInputProps = InputProps & {
  labelAction?: React.ReactNode;
};

const isFullRRuleValue = (
  value: unknown
): value is RRuleValue =>
  !!value &&
  typeof value === 'object' &&
  'rruleString' in value &&
  'freq' in value &&
  typeof (value as { freq: unknown }).freq === 'number';

const isRRuleStringOnly = (
  value: unknown
): value is { rruleString: string } =>
  !!value &&
  typeof value === 'object' &&
  'rruleString' in value &&
  typeof (value as { rruleString: unknown }).rruleString === 'string' &&
  !('freq' in value);

export const RRuleInput = React.forwardRef<HTMLDivElement, RRuleInputProps>(
  ({ hint, disabled, labelAction, label, name, required }, forwardedRef) => {
    const { formatMessage } = useIntl();
    const field = useField<RRuleValue | { rruleString: string } | null>(name);

    const value: RRuleValue = React.useMemo(() => {
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
      (newValue: RRuleValue) => {
        field.onChange(name, newValue);
      },
      [field, name]
    );

    return (
      <Field.Root
        name={name}
        id={name}
        error={field.error}
        hint={hint}
        required={required}
        ref={forwardedRef}
      >
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label}</Field.Label>

          <Box
            background="neutral0"
            borderColor="neutral200"
            hasRadius
            overflow="hidden"
          >
            <Box
              background="neutral100"
              borderColor="neutral200"
              paddingTop={3}
              paddingBottom={3}
              paddingLeft={4}
              paddingRight={4}
            >
              <Typography variant="sigma" textColor="neutral600">
                {formatMessage({
                  id: getTrad('header.title'),
                  defaultMessage: 'Recurrence Rule',
                })}
              </Typography>
            </Box>

            <Grid.Root gridCols={2} gap={0}>
              <Grid.Item col={2} s={2} m={1} direction="column" alignItems="stretch" padding={4}>
                <RuleConfigSection
                  value={value}
                  onChange={handleChange}
                  disabled={disabled}
                />
              </Grid.Item>

              <Grid.Item
                col={2}
                s={2}
                m={1}
                direction="column"
                alignItems="stretch"
                padding={4}
                background="neutral100"
                borderColor="neutral200"
              >
                <RulePreview value={value} />
              </Grid.Item>
            </Grid.Root>
          </Box>

          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);
