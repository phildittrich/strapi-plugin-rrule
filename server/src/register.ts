export const register = ({ strapi }: any) => {
  strapi.customFields.register({
    name: 'rrule',
    plugin: 'rrule',
    type: 'json',
  });
};
