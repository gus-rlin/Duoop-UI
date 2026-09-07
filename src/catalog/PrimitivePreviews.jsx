import React from 'react';
import { Field } from '../components/Forms/Input';
import { Textarea } from '../components/Forms/Textarea';
import { NumberField } from '../components/Forms/NumberField';
import { OtpField } from '../components/Forms/OtpField';
import { InputGroup, InputGroupInput, InputGroupAddon } from '../components/Forms/InputGroup';
import { Select } from '../components/Select/Select';
import { Autocomplete } from '../components/Autocomplete/Autocomplete';
import { Progress } from '../components/Progress/Progress';
import { Toast } from '../components/Toast/Toast';
import { ReactionButton } from '../components/ReactionButton/ReactionButton';
import { Achievement } from '../components/Achievement/Achievement';
import { Stepper } from '../components/Stepper/Stepper';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/Accordion/Accordion';
import { MenuItem } from '../components/Menu/Menu';
import { Icon } from './Icon';

// These are inert thumbnails inside links. The detail page hosts the interactive examples.
export function PrimitivePreview({ id }) {
  if (id === 'textarea')
    return (
      <div className="preview-field">
        <Field label="A little more context">
          <Textarea rows={3} placeholder="Tell us what you have in mind…" />
        </Field>
      </div>
    );
  if (id === 'number-field')
    return <NumberField aria-label="Quantity" defaultValue={24} min={0} size="sm" />;
  if (id === 'otp-field')
    return <OtpField aria-label="Verification code" defaultValue="123" size="sm" />;
  if (id === 'input-group')
    return (
      <InputGroup>
        <InputGroupInput aria-label="Search your projects" placeholder="Your next idea…" />
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
      </InputGroup>
    );
  if (id === 'autocomplete')
    return (
      <Autocomplete
        label="Find your next idea"
        placeholder="Search projects…"
        items={[{ value: 'studio', label: 'A fresh start' }]}
        showTrigger
      />
    );
  if (id === 'select')
    return (
      <Select
        label="Choose a direction"
        defaultValue="studio"
        width="full"
        options={[
          { value: 'studio', label: 'For the studio' },
          { value: 'personal', label: 'For yourself' },
        ]}
      />
    );
  if (id === 'progress') return <Progress label="Your next big thing." value={64} />;
  if (id === 'toast')
    return (
      <Toast
        toast={{
          id: 'preview',
          title: 'Good to go.',
          description: 'Your changes are saved.',
          status: 'success',
        }}
      />
    );
  if (id === 'reaction-button')
    return (
      <div className="preview-buttons">
        <ReactionButton kind="like" defaultValue={{ count: 24 }} size="sm" />
        <ReactionButton kind="favorite" presentation="icon" size="sm" />
      </div>
    );
  if (id === 'achievement')
    return (
      <Achievement
        item={{
          id: 'first',
          title: 'First milestone',
          description: 'A good idea, brought to life.',
          state: 'unlocked',
          icon: 'trophy',
        }}
        presentation="compact"
        size="sm"
      />
    );
  if (id === 'stepper')
    return (
      <Stepper
        label="Project progress"
        value="build"
        size="sm"
        items={[
          { id: 'plan', title: 'Plan' },
          { id: 'build', title: 'Build' },
          { id: 'share', title: 'Share' },
        ]}
      />
    );
  if (id === 'accordion')
    return (
      <Accordion defaultValue="details" size="sm">
        <AccordionItem value="details">
          <AccordionTrigger>What makes a good detail?</AccordionTrigger>
          <AccordionContent>You notice when it feels right.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="next">
          <AccordionTrigger>Where do we go from here?</AccordionTrigger>
          <AccordionContent>Make something your own.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  if (id === 'menu')
    return (
      <div className="duoop-menu__popup preview-menu-surface">
        <MenuItem icon={<Icon name="copy" />} shortcut="⌘D">
          Duplicate
        </MenuItem>
        <MenuItem icon={<Icon name="layers" />}>Move to…</MenuItem>
        <MenuItem icon={<Icon name="settings" />}>Preferences</MenuItem>
      </div>
    );
  return null;
}
