import React from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import { Button } from '../Button/Button';
import './Sheet.css';

// Radix Dialog (MIT) supplies modal focus containment and restoration.
export const Sheet = Primitive.Root;
export function SheetTrigger({ children }) {
  return <Primitive.Trigger asChild>{children}</Primitive.Trigger>;
}
export function SheetClose({ children }) {
  return <Primitive.Close asChild>{children}</Primitive.Close>;
}
export const SheetTitle = Primitive.Title;
export const SheetDescription = Primitive.Description;
export function SheetContent({
  children,
  side = 'right',
  className = '',
  ...props
}) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="duoop-sheet-overlay" />
      <Primitive.Content
        {...props}
        className={`duoop-sheet ${className}`}
        data-side={side}
      >
        <Primitive.Close asChild>
          <Button
            variant="outline"
            size="sm"
            className="duoop-sheet__close"
            aria-label="Close sheet"
            iconPosition="only"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            }
          />
        </Primitive.Close>
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  );
}
