import type { Core } from '@strapi/strapi';

import { registerValidateRRuleMiddleware } from './middlewares/validateRRule';

export const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  registerValidateRRuleMiddleware(strapi);
};
