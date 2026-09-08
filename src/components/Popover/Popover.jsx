import React from 'react';
import * as Primitive from '@radix-ui/react-popover';
import './Popover.css';

// Radix Popover composition (MIT), styled for Duoop. Non-modal by design.
export function Popover({ children, ...props }) {
  return (
    <Primitive.Root {...props} modal={false}>
      {children}
    </Primitive.Root>
  );
}
export function PopoverTrigger({ children }) {
  return <Primitive.Trigger asChild>{children}</Primitive.Trigger>;
}
export function PopoverContent({
  children,
  label,
  side = 'bottom',
  align = 'start',
  className = '',
  container,
  ...props
}) {
  return (
    <Primitive.Portal container={container}>
      <Primitive.Content
        side={side}
        align={align}
        sideOffset={10}
        collisionPadding={12}
        hideWhenDetached
        {...props}
        aria-label={label}
        className={`duoop-popover ${className}`}
      >
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  );
}
export function PopoverClose({ children }) {
  return <Primitive.Close asChild>{children}</Primitive.Close>;
}
