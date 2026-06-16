import { rrulestr } from "rrule";
const CUSTOM_FIELD_UID = "plugin::rrule.rrule";
const VALIDATED_ACTIONS = /* @__PURE__ */ new Set(["create", "update"]);
const isRecord = (value) => !!value && typeof value === "object" && !Array.isArray(value);
const findRRuleAttributeNames = (contentType) => {
  const attrs = contentType.attributes ?? {};
  const names = [];
  for (const [name, attribute] of Object.entries(attrs)) {
    if (attribute && typeof attribute === "object" && "customField" in attribute && attribute.customField === CUSTOM_FIELD_UID) {
      names.push(name);
    }
  }
  return names;
};
const validateRRuleValue = (value, attributeName, contentTypeUid) => {
  if (value === null || value === void 0) return;
  if (!isRecord(value)) {
    throw new Error(
      `[rrule] ${contentTypeUid}.${attributeName}: value must be an object with an rruleString`
    );
  }
  const rruleString = value.rruleString;
  if (rruleString === void 0 || rruleString === null || rruleString === "") {
    return;
  }
  if (typeof rruleString !== "string") {
    throw new Error(
      `[rrule] ${contentTypeUid}.${attributeName}.rruleString must be a string`
    );
  }
  try {
    rrulestr(rruleString);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "invalid RRULE";
    throw new Error(
      `[rrule] ${contentTypeUid}.${attributeName}.rruleString is not a valid RFC 5545 rule: ${detail}`
    );
  }
};
const registerValidateRRuleMiddleware = (strapi) => {
  strapi.documents.use(async (ctx, next) => {
    if (!VALIDATED_ACTIONS.has(ctx.action)) {
      return next();
    }
    const params = ctx.params;
    if (!isRecord(params?.data)) {
      return next();
    }
    const rruleAttributes = findRRuleAttributeNames(ctx.contentType);
    if (rruleAttributes.length === 0) {
      return next();
    }
    for (const attributeName of rruleAttributes) {
      validateRRuleValue(params.data[attributeName], attributeName, ctx.uid);
    }
    return next();
  });
};
const bootstrap = ({ strapi }) => {
  registerValidateRRuleMiddleware(strapi);
};
const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "rrule",
    plugin: "rrule",
    type: "json"
  });
};
const index = {
  register,
  bootstrap
};
export {
  index as default
};
