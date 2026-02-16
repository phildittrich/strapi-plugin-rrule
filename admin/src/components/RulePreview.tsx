import { Box, Flex, Typography, Badge } from '@strapi/design-system';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import type { RRuleValue } from '../types';
import { getTrad } from '../utils/getTrad';
import { formatRRuleToHuman, getNextOccurrences } from '../utils/rruleFormatters';

interface RulePreviewProps {
  value: RRuleValue;
}

const CodeBlock = styled(Box)`
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 11px;
  background-color: ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaces[2]};
  overflow-x: auto;
  word-break: break-all;
`;

const OccurrenceItem = styled(Flex)`
  padding: ${({ theme }) => `${theme.spaces[1]} ${theme.spaces[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius};

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.neutral0};
  }
`;

const SummaryBox = styled(Box)`
  background: ${({ theme }) => theme.colors.primary100};
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaces[3]};
`;

const SectionLabel = styled(Typography)`
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const RulePreview = ({ value }: RulePreviewProps) => {
  const { formatMessage, formatDate } = useIntl();

  const humanReadable = React.useMemo(() => formatRRuleToHuman(value), [value]);
  const occurrences = React.useMemo(() => getNextOccurrences(value, 5), [value]);

  return (
    <Flex direction="column" gap={3}>
      {/* Human-readable summary — prominent */}
      <SummaryBox>
        <Typography variant="omega" fontWeight="semiBold" textColor="primary700">
          {humanReadable}
        </Typography>
      </SummaryBox>

      {/* Timezone */}
      <Box>
        <SectionLabel variant="sigma" textColor="neutral600">
          {formatMessage({ id: getTrad('preview.timezone'), defaultMessage: 'Timezone' })}
        </SectionLabel>
        <Box paddingTop={1}>
          <Typography variant="pi" textColor="neutral500">
            {value.tzid}
          </Typography>
        </Box>
      </Box>

      {/* Upcoming occurrences — compact list */}
      <Box>
        <SectionLabel variant="sigma" textColor="neutral600">
          {formatMessage({
            id: getTrad('preview.occurrences'),
            defaultMessage: 'Next occurrences',
          })}
        </SectionLabel>
        <Box paddingTop={1}>
          {occurrences.length === 0 ? (
            <Typography variant="pi" textColor="neutral400">
              {formatMessage({
                id: getTrad('preview.noOccurrences'),
                defaultMessage: 'No upcoming occurrences',
              })}
            </Typography>
          ) : (
            <Flex direction="column" gap={1}>
              {occurrences.map((date, index) => (
                <OccurrenceItem
                  key={index}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="pi">
                    {formatDate(date, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </Typography>
                  <Badge size="S">#{index + 1}</Badge>
                </OccurrenceItem>
              ))}
            </Flex>
          )}
        </Box>
      </Box>

      {/* RRule string — compact */}
      <Box>
        <SectionLabel variant="sigma" textColor="neutral600">
          {formatMessage({
            id: getTrad('preview.rruleString'),
            defaultMessage: 'RFC 5545',
          })}
        </SectionLabel>
        <Box paddingTop={1}>
          <CodeBlock>
            <Typography variant="pi" textColor="neutral800">
              {value.rruleString || '(empty)'}
            </Typography>
          </CodeBlock>
        </Box>
      </Box>
    </Flex>
  );
};
