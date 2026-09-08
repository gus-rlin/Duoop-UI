import React from 'react';
import { ExperienceIcon } from './ExperienceIcon';
import './ExperiencePreviews.css';

/** Static library tiles mirror the real component geometry without nested controls. */
export function ExperiencePreview({ kind }) {
  if (kind === 'builtin-stepper') return <span className="mini-stepper"><span><i><ExperienceIcon name="success" /></i><strong>Profile</strong></span><span><i>2</i><strong>Workspace</strong></span><span><i>3</i><strong>Ready</strong></span></span>;
  if (kind === 'builtin-reaction-button') return <span className="mini-reactions"><span><ExperienceIcon name="heart" filled /><strong>Liked</strong><b>25</b></span><span><ExperienceIcon name="clap" /><b>86</b></span></span>;
  return null;
}
