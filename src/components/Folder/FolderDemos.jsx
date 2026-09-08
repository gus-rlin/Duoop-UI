import React, { useState } from 'react';
import { Folder } from './Folder';
import './FolderShowcase.css';
export const folderItems = [
  { id: 'brief', title: 'Project brief', type: 'DOC', description: '4 pages' },
  { id: 'identity', title: 'Visual identity', type: 'PDF', description: '12 pages' },
  { id: 'notes', title: 'Studio notes', type: 'TXT', description: 'Updated today' },
];
export const folderExamples = [['Project documents', 'Collections'], ['Single document', 'Collections'], ['Empty folder', 'States'], ['Unavailable document', 'States']];
export function FolderDemo({ example }) {
  return <div className="folder-demo"><Folder label={example === 'Empty folder' ? 'New project' : 'Studio project'} items={example === 'Empty folder' ? [] : example === 'Single document' ? folderItems.slice(0, 1) : example === 'Unavailable document' ? folderItems.map((item, index) => ({ ...item, disabled: index === 1 })) : folderItems} /></div>;
}
export function FolderPlayground() {
  const [document, setDocument] = useState(null);
  return <div className="folder-playground"><div className="folder-playground__intro"><span className="doc-eyebrow">THE STUDIO ARCHIVE</span><h3>Good ideas, filed together.</h3><p>Hover to open the cover.<br />Click or tap to bring out the documents.</p></div><Folder items={folderItems} label="Studio project" onSelect={setDocument} /><p className="folder-playground__status" role="status">{document ? `${document.title} selected · ${document.description}` : 'Three documents. One place to start.'}</p></div>;
}
export function FolderPreview() { return <div className="folder-mini"><Folder items={folderItems} label="Studio project" /></div>; }
