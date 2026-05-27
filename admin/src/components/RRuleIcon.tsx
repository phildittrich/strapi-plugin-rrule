import { Flex } from '@strapi/design-system';
import { Calendar } from '@strapi/icons';

export const RRuleIcon = () => (
  <Flex
    justifyContent="center"
    alignItems="center"
    width={7}
    height={6}
    hasRadius
    background="primary100"
    borderColor="primary200"
    aria-hidden
  >
    <Calendar fill="primary600" />
  </Flex>
);
