import { jsx } from "react/jsx-runtime";
import { Flex } from "@strapi/design-system";
import { Calendar } from "@strapi/icons";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const RRuleIcon = () => /* @__PURE__ */ jsx(
  Flex,
  {
    justifyContent: "center",
    alignItems: "center",
    width: 7,
    height: 6,
    hasRadius: true,
    background: "primary100",
    borderColor: "primary200",
    "aria-hidden": true,
    children: /* @__PURE__ */ jsx(Calendar, { fill: "primary600" })
  }
);
const pluginId = "rrule";
const getTrad = (id) => `${pluginId}.${id}`;
const prefixPluginTranslations = (trad, pluginId2) => {
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId2}.${current}`] = trad[current];
    return acc;
  }, {});
};
const index = {
  register(app) {
    app.customFields.register({
      name: "rrule",
      pluginId,
      type: "json",
      icon: RRuleIcon,
      intlLabel: {
        id: getTrad("rrule.label"),
        defaultMessage: "Recurrence Rule"
      },
      intlDescription: {
        id: getTrad("rrule.description"),
        defaultMessage: "Define recurring events using the RRule standard (RFC 5545)"
      },
      components: {
        Input: async () => import("./RRuleInput-1gOEavjY.mjs").then((module) => ({
          default: module.RRuleInput
        }))
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings"
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: getTrad("rrule.options.advanced.requiredField"),
                  defaultMessage: "Required field"
                },
                description: {
                  id: getTrad("rrule.options.advanced.requiredField.description"),
                  defaultMessage: "You won't be able to create an entry if this field is empty"
                }
              }
            ]
          }
        ]
      }
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-Cyr87s7R.mjs") }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, pluginId),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return importedTrads;
  }
};
export {
  getTrad as g,
  index as i
};
