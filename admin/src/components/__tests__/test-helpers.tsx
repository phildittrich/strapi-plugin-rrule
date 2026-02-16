import * as React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

/**
 * Wraps components with IntlProvider for tests that use formatMessage / formatDate.
 */
const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

export const renderWithIntl = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });
