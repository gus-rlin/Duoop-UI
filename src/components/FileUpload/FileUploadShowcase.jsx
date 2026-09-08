import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { FileUploadDemo, fileUploadExamples } from './FileUploadDemos';
import component from './FileUpload.jsx?raw';
import css from './FileUpload.css?raw';
import demos from './FileUploadDemos.jsx?raw';

export function FileUploadShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-file-upload',
        name: 'File Upload',
        category: 'Forms',
        notes: 'A place for your files. Drop, preview, retry and keep moving.',
      }}
      number="42"
      section="FORMS"
      examples={fileUploadExamples}
      Demo={FileUploadDemo}
      wide={fileUploadExamples.map(([title]) => title)}
      accessibility="Files stay local until your application supplies the transport."
      usage="React Dropzone supplies file selection, drag handling and accept/size validation. FileUpload adds a bounded queue, raster image previews, remove/cancel, errors and real transport progress. Supply upload(file, {signal, onProgress}) returning a Promise; call onProgress with 0–100 and resolve only on confirmed completion. AbortSignal must be respected by your transport. Object URLs and pending requests are cleaned up on removal/unmount. Validate files again on the server."
      api={[
        [
          'accept / multiple / maxFiles / maxSize',
          'MIME-to-extension map; multiple files; maximum queue count; bytes per file. Defaults: 5 files, 10 MB.',
        ],
        [
          'upload / actionLabel',
          'Optional async transport and its action label. Without transport, selection only.',
        ],
        ['onFilesChange', 'Receives the current array of File objects.'],
        [
          'label / description / disabled',
          'Accessible heading, instructions and disabled state.',
        ],
        [
          'Dropzone',
          'Alias for FileUpload. Previews support PNG, JPEG, WebP and GIF.',
        ],
        [
          'Open-source reference',
          <a
            href="https://github.com/react-dropzone/react-dropzone"
            target="_blank"
            rel="noreferrer"
          >
            Official documentation and source (MIT)
          </a>,
        ],
      ]}
      sources={[
        ['FileUpload.jsx', component],
        ['FileUpload.css', css],
        ['FileUploadDemos.jsx', demos],
      ]}
    />
  );
}
