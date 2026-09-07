import React from 'react';
import { Input } from './Input';
import { Textarea } from './Textarea';
import './EnrichedForms.css';

export function InputGroup({ size = 'default', className = '', children, ...props }) {
  return <div {...props} className={`duoop-input-group duoop-input-group--${size} ${className}`}>{children}</div>;
}
export function InputGroupAddon({ align = 'inline-start', className = '', ...props }) {
  return <div {...props} className={`input-group-addon input-group-addon--${align} ${className}`} />;
}
export function InputGroupInput(props) { return <Input {...props} />; }
export function InputGroupTextarea(props) { return <Textarea {...props} />; }
export function InputGroupText(props) { return <span {...props} className={`input-group-text ${props.className || ''}`} />; }
