import { registerValidateRRuleMiddleware } from '../validateRRule';

type Middleware = (ctx: unknown, next: () => Promise<unknown>) => Promise<unknown>;

const makeStrapiStub = () => {
  let captured: Middleware | null = null;
  return {
    strapi: {
      documents: {
        use: (cb: Middleware) => {
          captured = cb;
          return undefined as unknown;
        },
      },
    } as unknown as Parameters<typeof registerValidateRRuleMiddleware>[0],
    getMiddleware: () => {
      if (!captured) throw new Error('middleware not registered');
      return captured;
    },
  };
};

const buildCtx = (overrides: {
  action?: string;
  contentType?: { attributes: Record<string, unknown> };
  uid?: string;
  data?: unknown;
}) => ({
  action: overrides.action ?? 'create',
  uid: overrides.uid ?? 'api::event.event',
  contentType: overrides.contentType ?? {
    attributes: {
      schedule: {
        type: 'json',
        customField: 'plugin::rrule.rrule',
      },
    },
  },
  params: { data: overrides.data },
});

describe('validateRRule middleware', () => {
  it('passes through when action is not create or update', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    const ctx = buildCtx({ action: 'findMany', data: { schedule: { rruleString: 'garbage' } } });
    await getMiddleware()(ctx, next);

    expect(next).toHaveBeenCalled();
  });

  it('passes through when content-type has no rrule custom field', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    const ctx = buildCtx({
      contentType: { attributes: { title: { type: 'string' } } },
      data: { title: 'hello' },
    });
    await getMiddleware()(ctx, next);

    expect(next).toHaveBeenCalled();
  });

  it('passes through when rrule value is null or undefined', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    await getMiddleware()(buildCtx({ data: { schedule: null } }), next);
    await getMiddleware()(buildCtx({ data: { schedule: undefined } }), next);

    expect(next).toHaveBeenCalledTimes(2);
  });

  it('passes through when rruleString is empty string', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    await getMiddleware()(
      buildCtx({ data: { schedule: { rruleString: '' } } }),
      next
    );

    expect(next).toHaveBeenCalled();
  });

  it('passes valid RFC 5545 rules', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    await getMiddleware()(
      buildCtx({ data: { schedule: { rruleString: 'FREQ=WEEKLY;BYDAY=MO,WE,FR' } } }),
      next
    );

    expect(next).toHaveBeenCalled();
  });

  it('throws when rruleString is malformed', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    const ctx = buildCtx({ data: { schedule: { rruleString: 'not-an-rrule' } } });
    await expect(getMiddleware()(ctx, next)).rejects.toThrow(/not a valid RFC 5545/);
    expect(next).not.toHaveBeenCalled();
  });

  it('throws when value is not an object', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    const ctx = buildCtx({ data: { schedule: 'a string' } });
    await expect(getMiddleware()(ctx, next)).rejects.toThrow(/must be an object/);
  });

  it('throws when rruleString is not a string', async () => {
    const { strapi, getMiddleware } = makeStrapiStub();
    registerValidateRRuleMiddleware(strapi);
    const next = jest.fn().mockResolvedValue('ok');

    const ctx = buildCtx({ data: { schedule: { rruleString: 42 } } });
    await expect(getMiddleware()(ctx, next)).rejects.toThrow(/must be a string/);
  });
});
