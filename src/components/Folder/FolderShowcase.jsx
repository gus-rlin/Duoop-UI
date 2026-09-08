import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { FolderDemo, FolderPlayground, folderExamples } from './FolderDemos';
import component from './Folder.jsx?raw';
import css from './Folder.css?raw';
import demos from './FolderDemos.jsx?raw';
import showcaseCss from './FolderShowcase.css?raw';
export function FolderShowcase() {
  return <CatalogShowcase entry={{ name: 'Folder', notes: 'Keep related documents together. Open the tabbed folder, unfold the papers and choose what comes next.' }} number="47" section="CARDS" examples={folderExamples} Demo={FolderDemo} playground={<FolderPlayground />}
    accessibility="Folders start closed. Hover opens the cover; click, tap or Enter brings out the documents. Tab reaches each document; Enter or Space selects it. Escape puts everything away."
    usage="Provide items with unique stable IDs, titles, optional type, description and disabled state. Up to three landscape cards form a fan; larger collections use a scrollable grid. Hover only previews the cover: documents become interactive after activation. Moving the pointer away keeps an expanded folder open. Activate the cover again or press Escape to put the cards away. Selection is preserved. onSelect receives the chosen item. Reduced motion removes animated travel."
    api={[[ 'items', 'Array of { id, title, type?, description?, disabled? }. Defaults to an empty collection.' ],[ 'label', 'Folder name. Defaults to Documents.' ],[ 'defaultOpen', 'Initial open state. Defaults to false.' ],[ 'onSelect(item)', 'Called when an available document is selected.' ],[ 'className', 'Optional class on the root.' ]]}
    sources={[[ 'Folder.jsx', component ],[ 'Folder.css', css ],[ 'FolderDemos.jsx', demos ],[ 'FolderShowcase.css', showcaseCss ]]} />;
}
