import React, { createContext, useContext } from 'react';
import * as Primitive from '@radix-ui/react-tooltip';
import './Tooltip.css';

// Adapted from Radix Tooltip's composition example (MIT). See THIRD_PARTY_NOTICES.md.
const ProviderContext = createContext(false);
export function TooltipProvider({ children, delay = 400, skipDelay = 250 }) {
  return (
    <ProviderContext.Provider value={true}>
      <Primitive.Provider delayDuration={delay} skipDelayDuration={skipDelay}>
        {children}
      </Primitive.Provider>
    </ProviderContext.Provider>
  );
}

/** Touch activates the underlying action immediately; essential help must also be visible. */
export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delay,
  open,
  defaultOpen,
  onOpenChange,
  collisionPadding = 12,
  container,
}) {
  const hasProvider = useContext(ProviderContext);
  const child = React.Children.only(children);
  const disabled = child.props.disabled;
  const trigger = disabled ? (
    <span
      className="duoop-tooltip-disabled"
      tabIndex={0}
      role="group"
      aria-label={
        child.props['aria-label'] ||
        (typeof child.props.children === 'string'
          ? child.props.children
          : 'Unavailable action')
      }
    >
      {React.cloneElement(child, {
        style: { ...child.props.style, pointerEvents: 'none' },
      })}
    </span>
  ) : (
    React.cloneElement(child, { title: null })
  );
  const tooltip = (
    <Primitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delay}
    >
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal container={container}>
        <Primitive.Content
          className="duoop-tooltip"
          side={side}
          align={align}
          sideOffset={9}
          collisionPadding={collisionPadding}
          hideWhenDetached
        >
          {content}
          <Primitive.Arrow className="duoop-tooltip__arrow" width={12} height={6} />
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
  return hasProvider ? tooltip : <TooltipProvider>{tooltip}</TooltipProvider>;
}
