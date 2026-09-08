import React from 'react';
import { FileUpload } from './FileUpload';
import '../Essentials/EssentialsDemos.css';

export const fileUploadExamples = [
  ['Project files', 'Dropzone'],
  ['Image previews', 'Media'],
  ['Local processing', 'Progress'],
  ['Disabled', 'States'],
];

// Honest local processing: actual FileReader progress, no network or invented upload delay.
function readLocally(file, { signal, onProgress }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const abort = () => reader.abort();
    signal.addEventListener('abort', abort, { once: true });
    const finish = (callback) => {
      signal.removeEventListener('abort', abort);
      callback();
    };
    reader.onprogress = (event) => {
      if (event.lengthComputable) onProgress((event.loaded / event.total) * 100);
    };
    reader.onload = () => finish(resolve);
    reader.onerror = () =>
      finish(() =>
        reject(
          new Error('This file could not be read. Choose another file or retry.'),
        ),
      );
    reader.onabort = () =>
      finish(() => reject(new DOMException('Cancelled', 'AbortError')));
    if (signal.aborted)
      finish(() => reject(new DOMException('Cancelled', 'AbortError')));
    else reader.readAsArrayBuffer(file);
  });
}
export function FileUploadDemo({ example = 'Project files' }) {
  const images = example === 'Image previews';
  const processing = example === 'Local processing';
  return (
    <div className="essential-demo essential-demo--wide">
      <FileUpload
        label={
          images
            ? 'Collection images'
            : processing
              ? 'Read files locally'
              : 'Project attachments'
        }
        description={
          images
            ? 'PNG, JPEG or WebP. A preview appears for each image.'
            : 'Documents and images, ready for your next project.'
        }
        accept={
          images
            ? {
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/webp': ['.webp'],
              }
            : {
                'application/pdf': ['.pdf'],
                'text/plain': ['.txt'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }
        }
        maxFiles={images ? 3 : 5}
        maxSize={5 * 1024 * 1024}
        upload={processing ? readLocally : undefined}
        actionLabel="Read locally"
        disabled={example === 'Disabled'}
      />
      <p className="essential-demo__note">
        {processing
          ? 'This demo reads real files on your device. Progress may complete immediately for small files. Nothing is uploaded.'
          : 'Files stay on your device. Connect an upload handler to send them to your application.'}
      </p>
    </div>
  );
}
