import React, { useEffect, useId, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../Button/Button';
import { FeedbackIcon } from '../Feedback/FeedbackIcon';
import { Progress } from '../Progress/Progress';
import './FileUpload.css';

function FilePreview({ file }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type))
      return;
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url ? <img src={url} alt="" /> : <FeedbackIcon status="file" />;
}

/** The caller supplies real transport: upload(file, {signal, onProgress}) => Promise. */
export function FileUpload({
  label = 'Upload files',
  description = 'Drop files here, or browse your device.',
  accept,
  multiple = true,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  upload,
  onFilesChange,
  actionLabel = 'Upload files',
}) {
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState([]);
  const jobs = useRef(new Map());
  const nextId = useRef(0);
  const mounted = useRef(true);
  const id = useId();
  const limit = multiple ? Math.max(1, maxFiles) : 1;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      jobs.current.forEach((controller) => controller.abort());
      jobs.current.clear();
    };
  }, []);
  const update = (key, patch) => {
    if (mounted.current)
      setItems((previous) =>
        previous.map((item) => (item.id === key ? { ...item, ...patch } : item)),
      );
  };
  const dropzone = useDropzone({
    accept,
    multiple,
    maxSize,
    disabled,
    noClick: true,
    noKeyboard: true,
    onDrop(accepted, rejected) {
      const messages = rejected.map(
        ({ file, errors: reasons }) =>
          `${file.name}: ${reasons.map((error) => error.message).join(' ')}`,
      );
      const available = Math.max(0, limit - items.length);
      if (accepted.length > available)
        messages.push(
          `Choose up to ${limit} file${limit === 1 ? '' : 's'}. Remove a file to make room.`,
        );
      const additions = accepted
        .slice(0, available)
        .filter(
          (file) =>
            !items.some(
              (item) =>
                item.file.name === file.name &&
                item.file.size === file.size &&
                item.file.lastModified === file.lastModified,
            ),
        )
        .map((file) => ({
          id: `${id}-${++nextId.current}`,
          file,
          state: 'waiting',
          progress: null,
        }));
      const next = [...items, ...additions];
      setItems(next);
      setErrors(messages);
      onFilesChange?.(next.map((item) => item.file));
    },
  });
  async function run(item) {
    if (!upload || jobs.current.has(item.id) || disabled) return;
    const controller = new AbortController();
    jobs.current.set(item.id, controller);
    update(item.id, { state: 'running', progress: null, error: null });
    try {
      await upload(item.file, {
        signal: controller.signal,
        onProgress: (progress) => {
          if (
            !controller.signal.aborted &&
            jobs.current.get(item.id) === controller &&
            Number.isFinite(progress)
          )
            update(item.id, { progress: Math.min(100, Math.max(0, progress)) });
        },
      });
      if (!controller.signal.aborted)
        update(item.id, { state: 'success', progress: 100 });
    } catch (error) {
      if (!controller.signal.aborted)
        update(item.id, {
          state: 'error',
          error: error?.message || 'Could not upload this file. Try again.',
        });
    } finally {
      if (jobs.current.get(item.id) === controller) jobs.current.delete(item.id);
    }
  }
  function remove(item) {
    jobs.current.get(item.id)?.abort();
    jobs.current.delete(item.id);
    const next = items.filter((other) => other.id !== item.id);
    setItems(next);
    onFilesChange?.(next.map((other) => other.file));
  }
  const busy = items.some((item) => item.state === 'running');
  return (
    <section className="duoop-file-upload" aria-labelledby={`${id}-label`}>
      <h3 id={`${id}-label`}>{label}</h3>
      <div
        {...dropzone.getRootProps({
          className: 'duoop-dropzone',
          'data-active': dropzone.isDragActive || undefined,
          'data-disabled': disabled || undefined,
        })}
      >
        <input
          {...dropzone.getInputProps({
            'aria-label': label,
            'aria-describedby': `${id}-help`,
          })}
        />
        <span className="duoop-dropzone__icon">
          <FeedbackIcon status="file" />
        </span>
        <strong>
          {dropzone.isDragActive
            ? 'Release to add your files'
            : 'A place for your files'}
        </strong>
        <p id={`${id}-help`}>{description}</p>
        <Button
          variant="outline"
          disabled={disabled || items.length >= limit}
          onClick={dropzone.open}
        >
          Browse files
        </Button>
        <small>
          Up to {limit} {limit === 1 ? 'file' : 'files'} ·{' '}
          {Math.round(maxSize / 1024 / 1024)} MB per file
        </small>
      </div>
      <div aria-live="polite" className="duoop-file-upload__errors">
        {errors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
      {items.length > 0 && (
        <ul className="duoop-file-upload__list">
          {items.map((item) => (
            <li key={item.id} data-state={item.state}>
              <span className="duoop-file-upload__preview">
                <FilePreview file={item.file} />
              </span>
              <div className="duoop-file-upload__info">
                <strong>{item.file.name}</strong>
                <small>
                  {(item.file.size / 1024).toFixed(1)} KB ·{' '}
                  {item.state === 'waiting'
                    ? 'Ready'
                    : item.state === 'success'
                      ? 'Complete'
                      : item.state === 'error'
                        ? 'Failed'
                        : 'In progress'}
                </small>
                {item.state === 'running' && (
                  <Progress
                    value={item.progress}
                    state="running"
                    label={`Uploading ${item.file.name}`}
                    hideLabel
                    display="none"
                  />
                )}
                {item.error && <p role="alert">{item.error}</p>}
              </div>
              {item.state === 'success' && (
                <span className="duoop-file-upload__success">
                  <FeedbackIcon status="success" />
                </span>
              )}
              {item.state === 'error' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => run(item)}
                >
                  Retry
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                disabled={disabled}
                aria-label={`${item.state === 'running' ? 'Cancel' : 'Remove'} ${item.file.name}`}
                iconPosition="only"
                icon={<FeedbackIcon status="cancelled" />}
                onClick={() => remove(item)}
              />
            </li>
          ))}
        </ul>
      )}
      <span className="duoop-sr-only" role="status">
        {items.length} files.{' '}
        {items.filter((item) => item.state === 'success').length} complete.
      </span>
      {upload && items.length > 0 && (
        <Button
          disabled={
            disabled ||
            busy ||
            !items.some((item) => ['waiting', 'error'].includes(item.state))
          }
          onClick={() => {
            items
              .filter((item) => ['waiting', 'error'].includes(item.state))
              .forEach(run);
          }}
        >
          {actionLabel}
        </Button>
      )}
    </section>
  );
}
export const Dropzone = FileUpload;
