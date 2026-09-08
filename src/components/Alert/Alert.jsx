import React, { useId } from 'react';
import { FeedbackIcon } from '../Feedback/FeedbackIcon';
import { Button } from '../Button/Button';
import './Alert.css';

/** Persistent content. Use role="alert" only for newly occurring urgent errors. */
export function Alert({
  title,
  children,
  tone = 'info',
  action,
  onDismiss,
  role = 'region',
  className = '',
  ...props
}) {
  const id = useId();
  return (
    <section
      {...props}
      className={`duoop-alert ${className}`}
      data-tone={tone}
      role={role}
      aria-labelledby={id}
    >
      <span className="duoop-alert__icon">
        <FeedbackIcon status={tone} />
      </span>
      <div className="duoop-alert__body">
        <h3 id={id}>{title}</h3>
        {children && <div className="duoop-alert__description">{children}</div>}
        {action && <div className="duoop-alert__action">{action}</div>}
      </div>
      {onDismiss && (
        <Button
          className="duoop-alert__dismiss"
          variant="ghost"
          size="sm"
          aria-label={`Dismiss ${title}`}
          iconPosition="only"
          icon={<FeedbackIcon status="cancelled" />}
          onClick={onDismiss}
        />
      )}
    </section>
  );
}
export const Callout = Alert;
