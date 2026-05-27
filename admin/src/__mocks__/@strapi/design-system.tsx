import * as React from 'react';

// Simple pass-through components that render children with accessible roles/attributes

export const Box = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
  <div ref={ref} {...filterDomProps(props)}>{children}</div>
));

export const Flex = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
  <div ref={ref} data-mock="flex" {...filterDomProps(props)}>{children}</div>
));

export const Typography = ({ children, tag: Tag = 'span', ...props }: any) => (
  <Tag {...filterDomProps(props)}>{children}</Tag>
);

export const Badge = ({ children, ...props }: any) => (
  <span {...filterDomProps(props)}>{children}</span>
);

export const SingleSelect = ({ children, value, onChange, disabled, 'aria-label': ariaLabel }: any) => {
  const fieldCtx = React.useContext(FieldContext);
  return (
    <select
      role="combobox"
      id={fieldCtx.id}
      aria-label={ariaLabel}
      aria-labelledby={fieldCtx.labelId}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  );
};

export const SingleSelectOption = ({ children, value }: any) => (
  <option value={value}>{children}</option>
);

export const NumberInput = ({ value, onValueChange, disabled, min, max, 'aria-label': ariaLabel }: any) => {
  const fieldCtx = React.useContext(FieldContext);
  return (
    <input
      role="textbox"
      type="number"
      id={fieldCtx.id}
      aria-label={ariaLabel}
      aria-labelledby={fieldCtx.labelId}
      value={value ?? ''}
      onChange={(e) => {
        const num = Number(e.target.value);
        if (!isNaN(num)) onValueChange?.(num);
      }}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
};

export const DatePicker = ({ value, onChange, disabled, 'aria-label': ariaLabel }: any) => {
  const fieldCtx = React.useContext(FieldContext);
  return (
    <input
      role="combobox"
      type="date"
      id={fieldCtx.id}
      aria-label={ariaLabel}
      aria-labelledby={fieldCtx.labelId}
      value={value instanceof Date ? value.toISOString().split('T')[0] : value ?? ''}
      onChange={(e) => onChange?.(e.target.value ? new Date(e.target.value) : undefined)}
      disabled={disabled}
    />
  );
};

// Tabs compound component
const TabsRoot = ({ children, defaultValue }: any) => {
  const [active, setActive] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsContext = React.createContext<{ active: string; setActive: (v: string) => void }>({
  active: '',
  setActive: () => {},
});

const TabsList = ({ children }: any) => <div role="tablist">{children}</div>;

const TabsTrigger = ({ children, value }: any) => {
  const { active, setActive } = React.useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={active === value}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value }: any) => {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div role="tabpanel">{children}</div>;
};

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};

// Field compound component
type FieldContextValue = {
  hint?: string;
  error?: string;
  id?: string;
  labelId?: string;
};
const FieldContext = React.createContext<FieldContextValue>({});

const FieldRoot = React.forwardRef<HTMLDivElement, any>(
  ({ children, hint, error, id, name, ...props }, ref) => {
    const fallbackId = React.useId();
    const fieldId = id ?? name ?? fallbackId;
    const labelId = `${fieldId}-label`;
    return (
      <FieldContext.Provider value={{ hint, error, id: fieldId, labelId }}>
        <div ref={ref} {...filterDomProps({ ...props, id: fieldId, name })}>
          {children}
        </div>
      </FieldContext.Provider>
    );
  }
);

const FieldLabel = ({ children, action }: any) => {
  const { id, labelId } = React.useContext(FieldContext);
  return (
    <label id={labelId} htmlFor={id}>
      {children}
      {action}
    </label>
  );
};

const FieldHint = () => {
  const { hint } = React.useContext(FieldContext);
  return hint ? <p>{hint}</p> : null;
};

const FieldError = () => {
  const { error } = React.useContext(FieldContext);
  return error ? <p role="alert">{error}</p> : null;
};

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Hint: FieldHint,
  Error: FieldError,
};

// Grid compound component
const GridRoot = ({ children, ...props }: any) => (
  <div {...filterDomProps(props)}>{children}</div>
);
const GridItem = ({ children, ...props }: any) => (
  <div {...filterDomProps(props)}>{children}</div>
);
export const Grid = {
  Root: GridRoot,
  Item: GridItem,
};

// Checkbox (radix-style: controlled by `checked` and `onCheckedChange`)
export const Checkbox = React.forwardRef<HTMLInputElement, any>(
  ({ checked, onCheckedChange, disabled, 'aria-label': ariaLabel, ...props }, ref) => (
    <input
      ref={ref}
      role="checkbox"
      type="checkbox"
      aria-label={ariaLabel}
      checked={!!checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...filterDomProps(props)}
    />
  )
);

// Filter out non-DOM props to avoid React warnings
function filterDomProps(props: Record<string, any>) {
  const filtered: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
      'padding', 'background', 'borderColor', 'hasRadius',
      'direction', 'alignItems', 'justifyContent', 'gap', 'wrap',
      'textColor', 'variant', 'fontWeight', 'tag',
    ].includes(key)) continue;
    filtered[key] = val;
  }
  return filtered;
}
