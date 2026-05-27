import { rrulestr } from 'rrule';
import type { Core, UID, Schema } from '@strapi/strapi';

const CUSTOM_FIELD_UID = 'plugin::rrule.rrule';
const VALIDATED_ACTIONS = new Set(['create', 'update']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const findRRuleAttributeNames = (
  contentType: Schema.ContentType<UID.ContentType>
): string[] => {
  const attrs = contentType.attributes ?? {};
  const names: string[] = [];
  for (const [name, attribute] of Object.entries(attrs)) {
    if (
      attribute &&
      typeof attribute === 'object' &&
      'customField' in attribute &&
      (attribute as { customField?: string }).customField === CUSTOM_FIELD_UID
    ) {
      names.push(name);
    }
  }
  return names;
};

const validateRRuleValue = (
  value: unknown,
  attributeName: string,
  contentTypeUid: string
): void => {
  if (value === null || value === undefined) return;

  if (!isRecord(value)) {
    throw new Error(
      `[rrule] ${contentTypeUid}.${attributeName}: value must be an object with an rruleString`
    );
  }

  const rruleString = value.rruleString;

  if (rruleString === undefined || rruleString === null || rruleString === '') {
    return;
  }

  if (typeof rruleString !== 'string') {
    throw new Error(
      `[rrule] ${contentTypeUid}.${attributeName}.rruleString must be a string`
    );
  }

  try {
    rrulestr(rruleString);
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : 'invalid RRULE';
    throw new Error(
      `[rrule] ${contentTypeUid}.${attributeName}.rruleString is not a valid RFC 5545 rule: ${detail}`
    );
  }
};

export const registerValidateRRuleMiddleware = (
  strapi: Core.Strapi
): void => {
  strapi.documents.use(async (ctx, next) => {
    if (!VALIDATED_ACTIONS.has(ctx.action)) {
      return next();
    }

    const params = ctx.params as { data?: unknown };
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
