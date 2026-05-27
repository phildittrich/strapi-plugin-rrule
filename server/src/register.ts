import type { Core } from '@strapi/strapi';

export const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'rrule',
    plugin: 'rrule',
    type: 'json',
  });
};
