import { Box, Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import { useIntl } from 'react-intl';

import type { RRuleValue } from '../types';
import { getTrad } from '../utils/getTrad';
import { formatRRuleToHuman, getNextOccurrences } from '../utils/rruleFormatters';

interface RulePreviewProps {
  value: RRuleValue;
}

export const RulePreview = ({ value }: RulePreviewProps) => {
  const { formatMessage, formatDate } = useIntl();

  const humanReadable = React.useMemo(() => formatRRuleToHuman(value), [value]);
  const occurrences = React.useMemo(() => getNextOccurrences(value, 5), [value]);

  return (
    <Flex direction="column" alignItems="stretch" gap={3}>
      {/* Human-readable summary — prominent */}
      <Box
        background="primary100"
        borderColor="primary200"
        hasRadius
        padding={3}
      >
        <Typography variant="omega" fontWeight="semiBold" textColor="primary700">
          {humanReadable}
        </Typography>
      </Box>

      {/* Timezone */}
      <Box>
        <Typography variant="sigma" textColor="neutral600">
          {formatMessage({ id: getTrad('preview.timezone'), defaultMessage: 'Timezone' })}
        </Typography>
        <Box paddingTop={1}>
          <Typography variant="pi" textColor="neutral500">
            {value.tzid}
          </Typography>
        </Box>
      </Box>

      {/* Upcoming occurrences — compact list */}
      <Box>
        <Typography variant="sigma" textColor="neutral600">
          {formatMessage({
            id: getTrad('preview.occurrences'),
            defaultMessage: 'Next occurrences',
          })}
        </Typography>
        <Box paddingTop={1}>
          {occurrences.length === 0 ? (
            <Typography variant="pi" textColor="neutral400">
              {formatMessage({
                id: getTrad('preview.noOccurrences'),
                defaultMessage: 'No upcoming occurrences',
              })}
            </Typography>
          ) : (
            <Flex direction="column" alignItems="stretch" gap={1}>
              {occurrences.map((date, index) => (
                <Flex
                  key={index}
                  justifyContent="space-between"
                  alignItems="center"
                  paddingTop={1}
                  paddingBottom={1}
                  paddingLeft={2}
                  paddingRight={2}
                  hasRadius
                  background={index % 2 === 0 ? 'neutral0' : 'transparent'}
                >
                  <Typography variant="pi">
                    {formatDate(date, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </Typography>
                  <Typography variant="pi" textColor="neutral500">
                    #{index + 1}
                  </Typography>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>
      </Box>

      {/* RRule string — compact */}
      <Box>
        <Typography variant="sigma" textColor="neutral600">
          {formatMessage({
            id: getTrad('preview.rruleString'),
            defaultMessage: 'RFC 5545',
          })}
        </Typography>
        <Box paddingTop={1} background="neutral200" hasRadius padding={2}>
          <Typography tag="code" variant="pi" textColor="neutral800">
            {value.rruleString ||
              formatMessage({ id: getTrad('preview.emptyRrule'), defaultMessage: '(empty)' })}
          </Typography>
        </Box>
      </Box>
    </Flex>
  );
};
