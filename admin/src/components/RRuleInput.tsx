import * as React from 'react';

import { Field, Flex, Tabs, Box } from '@strapi/design-system';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import type { RRuleValue } from '../types';
import { createDefaultRRule } from '../utils/defaults';
import { getTrad } from '../utils/getTrad';
import { RuleConfigSection } from './RuleConfigSection';
import { RulePreview } from './RulePreview';

type RRuleInputProps = InputProps & {
  labelAction?: React.ReactNode;
};

const InputContainer = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.neutral0};
  overflow: hidden;
`;

export const RRuleInput = React.forwardRef<HTMLDivElement, RRuleInputProps>(
  ({ hint, disabled, labelAction, label, name, required }, forwardedRef) => {
    const { formatMessage } = useIntl();
    const field = useField<RRuleValue | null>(name);

    const value: RRuleValue = React.useMemo(() => {
      if (field.value && typeof field.value === 'object' && 'rruleString' in field.value) {
        return field.value;
      }
      return createDefaultRRule();
    }, [field.value]);

    const hasInitialized = React.useRef(false);
    React.useEffect(() => {
      if (!hasInitialized.current && !field.value) {
        const defaultValue = createDefaultRRule();
        field.onChange(name, defaultValue);
        hasInitialized.current = true;
      }
    }, [field, name]);

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

          <InputContainer>
            <Tabs.Root defaultValue="config">
              <Box
                paddingLeft={3}
                paddingRight={3}
                background="neutral100"
                borderColor="neutral200"
                style={{ borderBottom: '1px solid' }}
              >
                <Tabs.List>
                  <Tabs.Trigger value="config">
                    {formatMessage({
                      id: getTrad('tab.config'),
                      defaultMessage: 'Configure',
                    })}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="preview">
                    {formatMessage({
                      id: getTrad('tab.preview'),
                      defaultMessage: 'Preview',
                    })}
                  </Tabs.Trigger>
                </Tabs.List>
              </Box>

              <Box padding={3}>
                <Tabs.Content value="config">
                  <RuleConfigSection
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </Tabs.Content>

                <Tabs.Content value="preview">
                  <RulePreview value={value} />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </InputContainer>

          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);
