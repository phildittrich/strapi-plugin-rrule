import * as React from 'react';

import { Field, Flex, Box, Typography } from '@strapi/design-system';
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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConfigColumn = styled(Box)`
  padding: ${({ theme }) => theme.spaces[4]};
`;

const PreviewColumn = styled(Box)`
  padding: ${({ theme }) => theme.spaces[4]};
  background: ${({ theme }) => theme.colors.neutral100};
  border-left: 1px solid ${({ theme }) => theme.colors.neutral200};

  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  }
`;

const SectionHeader = styled(Box)`
  padding: ${({ theme }) => `${theme.spaces[3]} ${theme.spaces[4]}`};
  background: ${({ theme }) => theme.colors.neutral100};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
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
            <SectionHeader>
              <Typography variant="sigma" textColor="neutral600">
                {formatMessage({
                  id: getTrad('header.title'),
                  defaultMessage: 'Recurrence Rule',
                })}
              </Typography>
            </SectionHeader>

            <TwoColumnGrid>
              <ConfigColumn>
                <RuleConfigSection
                  value={value}
                  onChange={handleChange}
                  disabled={disabled}
                />
              </ConfigColumn>

              <PreviewColumn>
                <RulePreview value={value} />
              </PreviewColumn>
            </TwoColumnGrid>
          </InputContainer>

          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);
