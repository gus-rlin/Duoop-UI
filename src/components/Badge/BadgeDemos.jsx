import React, { useState } from 'react';
import { Badge, RemovableBadge, StatusDot } from './Badge';

const icon = <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m8 1.8 1.8 3.7 4.1.6-3 2.9.7 4.1L8 11.2l-3.6 1.9.7-4.1-3-2.9 4.1-.6L8 1.8Z"/></svg>;
export const badgeExamples = [['Text only','Content'],['Leading icon','Content'],['Trailing icon','Content'],['Status dot','Content'],['Counter','Content'],['Maximum counter','Content'],['Icon only','Content'],['Avatar and text','Content'],['Removable','Interaction'],['Loading','Interaction'],['Long truncated label','States'],['As link','Interaction'],['As button','Interaction'],['Disabled button','States']];

export function BadgeDemo({ example = 'Text only' }) {
  const [visible, setVisible] = useState(true); const [pressed, setPressed] = useState(false);
  if (example === 'Text only') return <Badge>Draft</Badge>;
  if (example === 'Leading icon') return <Badge tone="brand" leading={icon}>Featured</Badge>;
  if (example === 'Trailing icon') return <Badge appearance="outline" trailing={<span aria-hidden="true">↗</span>}>External</Badge>;
  if (example === 'Status dot') return <Badge tone="success" leading={<StatusDot />}>Active</Badge>;
  if (example === 'Counter') return <Badge appearance="solid" shape="circle" aria-label="8 unread items">8</Badge>;
  if (example === 'Maximum counter') return <Badge tone="danger" appearance="solid" shape="pill" aria-label="More than 99 alerts">99+</Badge>;
  if (example === 'Icon only') return <Badge shape="circle" tone="warning" aria-label="Featured">{icon}</Badge>;
  if (example === 'Avatar and text') return <Badge appearance="outline" leading={<span className="badge-avatar" aria-hidden="true">AM</span>}>Amélie</Badge>;
  if (example === 'Removable') return visible ? <RemovableBadge tone="info" onRemove={() => setVisible(false)}>Research</RemovableBadge> : <button className="badge-reset" onClick={() => setVisible(true)}>Restore badge</button>;
  if (example === 'Loading') return <Badge tone="info" loading>Syncing</Badge>;
  if (example === 'Long truncated label') return <Badge className="badge-truncated">A deliberately long category name that cannot take over the layout</Badge>;
  if (example === 'As link') return <Badge href="#badge-usage" appearance="outline" tone="brand" trailing={<span aria-hidden="true">↗</span>}>Release notes</Badge>;
  if (example === 'As button') return <Badge onClick={() => setPressed(value => !value)} appearance={pressed ? 'solid' : 'soft'} tone="brand" aria-pressed={pressed}>{pressed ? 'Following' : 'Follow'}</Badge>;
  return <Badge onClick={() => {}} disabled>Unavailable</Badge>;
}

export function BadgeMatrix() {
  return <><div className="badge-matrix">{['neutral','brand','info','success','warning','danger'].map(tone => <div key={tone}><span>{tone}</span>{['solid','soft','outline'].map(appearance => <Badge key={appearance} tone={tone} appearance={appearance}>{appearance}</Badge>)}</div>)}</div><div className="badge-scale" aria-label="Badge sizes and shapes"><Badge size="sm">Small</Badge><Badge size="md" shape="pill">Medium pill</Badge><Badge size="lg" shape="circle" aria-label="Large counter">8</Badge></div></>;
}
