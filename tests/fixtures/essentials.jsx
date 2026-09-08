import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/base.css';
import { FileUpload } from '../../src/components/FileUpload/FileUpload';
import { Tooltip } from '../../src/components/Tooltip/Tooltip';
import { IconButton } from '../../src/components/IconButton/IconButton';
import { Button } from '../../src/components/Button/Button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from '../../src/components/Popover/Popover';
import { RangeSlider } from '../../src/components/Slider/Slider';
import { DatePicker } from '../../src/components/DatePicker/DatePicker';
import { DataTable } from '../../src/components/Table/Table';

window.uploadJobs = [];
function upload(file, { signal, onProgress }) {
  return new Promise((resolve, reject) => {
    const job = {
      name: file.name,
      resolve,
      reject,
      progress: onProgress,
      aborted: false,
    };
    window.uploadJobs.push(job);
    signal.addEventListener(
      'abort',
      () => {
        job.aborted = true;
        reject(new DOMException('Cancelled', 'AbortError'));
      },
      { once: true },
    );
  });
}
function Fixture() {
  const [mounted, setMounted] = useState(true);
  const [activated, setActivated] = useState(0);
  const [rows, setRows] = useState([
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'c', name: 'Gamma', disabled: true },
  ]);
  return (
    <main style={{ padding: 20, maxWidth: 600, display: 'grid', gap: 36 }}>
      <h1>Essential regression fixture</h1>
      <Tooltip content="This action stays immediate on touch.">
        <IconButton
          label="Immediate action"
          icon={<span aria-hidden="true">+</span>}
          onClick={() => setActivated((n) => n + 1)}
        />
      </Tooltip>
      <output aria-label="Action count">{activated}</output>
      <div style={{ position: 'fixed', top: 2, right: 2 }}>
        <Tooltip
          side="top"
          content="A long hint that must flip and stay inside the viewport."
        >
          <Button>Edge hint</Button>
        </Tooltip>
      </div>
      <Popover>
        <PopoverTrigger>
          <Button>Nested tools</Button>
        </PopoverTrigger>
        <PopoverContent label="Parent tools">
          <Tooltip content="Nested hint">
            <Button>Hint inside</Button>
          </Tooltip>
          <Popover>
            <PopoverTrigger>
              <Button>Child tools</Button>
            </PopoverTrigger>
            <PopoverContent label="Child tools">
              <PopoverClose>
                <Button>Finish child</Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <PopoverClose>
            <Button>Finish parent</Button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
      <form>
        <RangeSlider
          name="price"
          label="Budget"
          defaultValue={[20, 80]}
          minStepsBetweenThumbs={1}
        />
        <DatePicker
          label="Dates"
          mode="range"
          name="dates"
          calendarProps={{ defaultMonth: new Date(2026, 8) }}
        />
      </form>
      <DataTable
        rows={rows}
        columns={[{ key: 'name', header: 'Name' }]}
        caption="Mutable rows"
        pageSize={2}
        isRowDisabled={(row) => row.disabled}
      />
      <Button onClick={() => setRows(rows.slice(0, 1))}>Shrink data</Button>
      {mounted && (
        <FileUpload
          label="Test uploads"
          upload={upload}
          maxFiles={2}
          maxSize={1024}
          accept={{ 'text/plain': ['.txt'] }}
        />
      )}
      <Button onClick={() => setMounted(!mounted)}>Toggle uploader</Button>
    </main>
  );
}
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Fixture />
  </React.StrictMode>,
);
