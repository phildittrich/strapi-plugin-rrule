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
  font-size: 12px;
  background-color: ${({ theme }) => theme.colors.neutral100};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaces[3]};
  overflow-x: auto;
  word-break: break-all;
`;

const OccurrenceRow = styled(Flex)`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.neutral100};
  }
`;

const SectionLabel = styled(Typography)`
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const RulePreview = ({ value }: RulePreviewProps) => {
  const { formatMessage, formatDate } = useIntl();

  const humanReadable = React.useMemo(() => formatRRuleToHuman(value), [value]);
  const occurrences = React.useMemo(() => getNextOccurrences(value, 10), [value]);

  return (
    <Flex direction="column" gap={4}>
      {/* Human-readable description */}
      <Box>
        <SectionLabel variant="sigma" textColor="neutral600">
          {formatMessage({ id: getTrad('preview.description'), defaultMessage: 'Description' })}
        </SectionLabel>
        <Box paddingTop={2}>
          <Typography variant="omega" fontWeight="semiBold">
            {humanReadable}
          </Typography>
        </Box>
      </Box>

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

      {/* Upcoming occurrences */}
      <Box>
        <SectionLabel variant="sigma" textColor="neutral600">
          {formatMessage({
            id: getTrad('preview.occurrences'),
            defaultMessage: 'Next occurrences',
          })}
        </SectionLabel>
        <Box paddingTop={2}>
          {occurrences.length === 0 ? (
            <Typography variant="pi" textColor="neutral400">
              {formatMessage({
                id: getTrad('preview.noOccurrences'),
                defaultMessage: 'No upcoming occurrences',
              })}
            </Typography>
          ) : (
            occurrences.map((date, index) => (
              <OccurrenceRow
                key={index}
                justifyContent="space-between"
                alignItems="center"
                paddingTop={2}
                paddingBottom={2}
                paddingLeft={3}
                paddingRight={3}
              >
                <Typography variant="omega">
                  {formatDate(date, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })}
                </Typography>
                <Badge size="S">#{index + 1}</Badge>
              </OccurrenceRow>
            ))
          )}
        </Box>
      </Box>

      {/* RRule string */}
      <Box>
        <SectionLabel variant="sigma" textColor="neutral600">
          {formatMessage({
            id: getTrad('preview.rruleString'),
            defaultMessage: 'RRule string (RFC 5545)',
          })}
        </SectionLabel>
        <Box paddingTop={2}>
          <CodeBlock>
            <Typography variant="omega" textColor="neutral800">
              RRULE:{value.rruleString || '(empty)'}
            </Typography>
          </CodeBlock>
        </Box>
      </Box>
    </Flex>
  );
};
