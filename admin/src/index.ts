import { RRuleIcon } from './components/RRuleIcon';
import { pluginId } from './pluginId';
import { getTrad } from './utils/getTrad';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'rrule',
      pluginId: 'rrule',
      type: 'json',
      icon: RRuleIcon,
      intlLabel: {
        id: getTrad('rrule.label'),
        defaultMessage: 'Recurrence Rule',
      },
      intlDescription: {
        id: getTrad('rrule.description'),
        defaultMessage: 'Define recurring events using the RRule standard (RFC 5545)',
      },
      components: {
        Input: async () =>
          import('./components/RRuleInput').then((module) => ({
            default: module.RRuleInput,
          })),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('rrule.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('rrule.options.advanced.requiredField.description'),
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
