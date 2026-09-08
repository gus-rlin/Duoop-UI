import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover';
import { Button } from '../Button/Button';
import { Field, Input } from '../Forms/Input';
import { Checkbox } from '../Checkbox/Checkbox';
import '../Essentials/EssentialsDemos.css';

export const popoverExamples = [
  ['Quick edit', 'Composition'],
  ['Filter records', 'Composition'],
  ['Aligned to the end', 'Positioning'],
];
export function PopoverDemo({ example = 'Quick edit' }) {
  const [name, setName] = useState('Studio notes');
  const [draft, setDraft] = useState(name);
  const [open, setOpen] = useState(false);
  const [archived, setArchived] = useState(false);
  const [saved, setSaved] = useState(false);
  const filter = example === 'Filter records';
  return (
    <div className="essential-demo essential-demo--center">
      <div>
        <span className="essential-demo__eyebrow">CLOSE AT HAND</span>
        <h3>{filter ? 'Less noise. More focus.' : name}</h3>
        <p>
          {filter
            ? archived
              ? 'Showing active and archived records.'
              : 'Showing active records.'
            : 'Small changes, right where you need them.'}
        </p>
      </div>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setDraft(name);
            setSaved(false);
          }
        }}
      >
        <PopoverTrigger>
          <Button variant="outline">
            {filter ? 'Filter records' : 'Edit details'}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          label={filter ? 'Record filters' : 'Edit collection'}
          align={example === 'Aligned to the end' ? 'end' : 'start'}
        >
          <div className="essential-demo__stack">
            <div>
              <h3>{filter ? 'Record filters' : 'Collection details'}</h3>
              <p>
                {filter
                  ? 'Changes apply immediately.'
                  : 'Give this collection a recognizable name.'}
              </p>
            </div>
            {filter ? (
              <>
                <Checkbox
                  label="Include archived"
                  checked={archived}
                  onChange={(e) => setArchived(e.target.checked)}
                />
                <PopoverClose>
                  <Button>Done</Button>
                </PopoverClose>
              </>
            ) : (
              <form
                className="essential-demo__stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  setName(draft.trim());
                  setSaved(true);
                  setOpen(false);
                }}
              >
                <Field label="Collection name">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    required
                    pattern=".*\S.*"
                  />
                </Field>
                <Button type="submit">Save changes</Button>
              </form>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <span className="essential-demo__result" role="status">
        {saved
          ? 'Collection name updated.'
          : 'Escape closes and returns focus to the trigger.'}
      </span>
    </div>
  );
}
