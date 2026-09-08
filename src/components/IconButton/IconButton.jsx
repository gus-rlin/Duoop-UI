import React from 'react';
import { Button } from '../Button/Button';

/** An icon action with a required accessible label. Favorites keep their own treatment. */
export function IconButton({ icon, label, size = 'md', title = label, ...props }) {
  return <Button {...props} size={size} icon={icon} iconPosition="only" aria-label={label} title={title} />;
}
