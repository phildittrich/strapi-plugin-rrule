import * as React from 'react';

// Mock styled-components: styled.x`` and styled(Component)`` just return the base element/component
function createStyled(Tag: any) {
  return (..._args: any[]) => {
    const Component = React.forwardRef<any, any>((props, ref) => {
      // Filter out transient props (prefixed with $)
      const filtered: Record<string, any> = {};
      for (const [key, val] of Object.entries(props)) {
        if (key.startsWith('$')) continue;
        filtered[key] = val;
      }
      return React.createElement(Tag, { ...filtered, ref });
    });
    Component.displayName = `styled(${typeof Tag === 'string' ? Tag : Tag.displayName || Tag.name || 'Component'})`;
    return Component;
  };
}

const handler: ProxyHandler<any> = {
  get(_target, prop) {
    if (typeof prop === 'string') {
      return createStyled(prop);
    }
    return undefined;
  },
  apply(_target, _thisArg, args: any[]) {
    return createStyled(args[0]);
  },
};

export const styled = new Proxy(createStyled, handler);
export const css = (...args: any[]) => args;
export const keyframes = (...args: any[]) => '';
export const createGlobalStyle = () => () => null;
export const ThemeProvider = ({ children }: any) => children;
export const useTheme = () => ({});
