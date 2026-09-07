import React, { useEffect, useState } from 'react';
import { Button, ActionFeedback } from '../components/Button/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/Card/Card';
import { Badge } from '../components/Badge/Badge';
import { Tabs } from '../components/Tabs/Tabs';
import { Input, Field } from '../components/Forms/Input';
import { Textarea } from '../components/Forms/Textarea';
import { Switch, RadioGroup } from '../components/Selection/Selection';
import { Avatar } from '../components/Avatar/Avatar';
import { Select } from '../components/Select/Select';
import './pages.css';

const storageKey = 'duoop-example-settings-v1';
const defaults = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  bio: 'Designer, maker, and collector of good ideas.',
  newsletter: false,
  mentions: true,
  digest: true,
  density: 'comfortable',
  language: 'en',
};
function readSettings() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey));
    if (
      value &&
      Object.keys(defaults).every((key) => typeof value[key] === typeof defaults[key]) &&
      ['comfortable', 'compact'].includes(value.density) &&
      ['en', 'fr', 'de'].includes(value.language)
    )
      return value;
  } catch {
    /* Storage may be unavailable. Saving reports the error to the visitor. */
  }
  return defaults;
}

export default function SettingsPage({ embedded = false }) {
  const Title = embedded ? 'h2' : 'h1';
  const [saved, setSaved] = useState(readSettings);
  const [values, setValues] = useState(saved);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('profile');
  const dirty = JSON.stringify(saved) !== JSON.stringify(values);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const beforeNavigate = (event) => {
      if (!window.confirm('Leave this example and discard your unsaved changes?'))
        event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    window.addEventListener('duoop:before-navigate', beforeNavigate);
    return () => {
      window.removeEventListener('beforeunload', warn);
      window.removeEventListener('duoop:before-navigate', beforeNavigate);
    };
  }, [dirty]);
  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setStatus('idle');
    setMessage('');
  }
  function save(event) {
    event.preventDefault();
    const invalid = event.currentTarget.querySelector(':invalid');
    if (invalid) {
      setTab('profile');
      setStatus('idle');
      setMessage('Check your name and email address before saving.');
      requestAnimationFrame(() => {
        invalid.focus();
        invalid.reportValidity();
      });
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
      setSaved(values);
      setStatus('success');
      setMessage('Your example settings are saved on this device.');
    } catch {
      setStatus('idle');
      setMessage(
        'Your browser could not save these settings. Allow site storage and try again.',
      );
    }
  }
  function reset() {
    setValues(saved);
    setStatus('idle');
    setMessage('Changes discarded. Your saved settings are restored.');
  }
  const profile = (
    <Card>
      <CardHeader>
        <CardTitle>Make yourself at home.</CardTitle>
        <CardDescription>
          Your profile gives your collaborators a little context.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-avatar">
          <Avatar name={values.name || 'Your name'} size="lg" />
          <div>
            <strong>{values.name || 'Your name'}</strong>
            <p>Your initials update as you type.</p>
          </div>
          <Badge>MEMBER</Badge>
        </div>
        <div className="settings-fields">
          <Field label="Full name" required>
            <Input
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              maxLength={80}
              pattern=".*\S.*"
            />
          </Field>
          <Field
            label="Email address"
            required
            description="A sample address for this local demo."
          >
            <Input
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
            />
          </Field>
          <div className="settings-wide">
            <Field label="A little about you" optional description="What do you enjoy making?">
              <Textarea
                name="bio"
                rows={3}
                maxLength={240}
                value={values.bio}
                onChange={(event) => update('bio', event.target.value)}
              />
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  const notifications = (
    <Card>
      <CardHeader>
        <CardTitle>The right amount of in the loop.</CardTitle>
        <CardDescription>Choose which updates deserve your attention.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-options">
          <Switch
            label="Mentions and replies"
            description="When a teammate needs your perspective."
            position="end"
            checked={values.mentions}
            onChange={(event) => update('mentions', event.target.checked)}
          />
          <Switch
            label="Weekly digest"
            description="One considered summary of your team’s week."
            position="end"
            checked={values.digest}
            onChange={(event) => update('digest', event.target.checked)}
          />
          <Switch
            label="Product letters"
            description="Occasional notes about what is new."
            position="end"
            checked={values.newsletter}
            onChange={(event) => update('newsletter', event.target.checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
  const preferences = (
    <Card>
      <CardHeader>
        <CardTitle>A space that feels like yours.</CardTitle>
        <CardDescription>Fine-tune the way this example works for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-options">
          <RadioGroup
            legend="Content spacing"
            name="density"
            variant="card"
            layout="grid"
            value={values.density}
            onChange={(event) => update('density', event.target.value)}
            options={[
              {
                value: 'comfortable',
                label: 'Comfortable',
                description: 'A little more room to breathe.',
              },
              {
                value: 'compact',
                label: 'Compact',
                description: 'Keep the details closer together.',
              },
            ]}
          />
          <Select
            label="Preferred language"
            description="Stored as a preference; this example is written in English."
            width="full"
            value={values.language}
            onValueChange={(value) => update('language', value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'Français' },
              { value: 'de', label: 'Deutsch' },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="example-page settings-page" data-density={values.density}>
      <header className="settings-header">
        <div>
          <a className="forma-brand" href="#settings-top">
            forma<span>®</span>
          </a>
          <span className="settings-context">YOUR SPACE</span>
        </div>
        <Avatar name={values.name} size="sm" />
      </header>
      <div className="settings-body" id="settings-top">
        <div className="settings-title">
          <div>
            <span className="example-eyebrow">THE DETAILS THAT MAKE IT YOURS</span>
            <Title>Settings</Title>
            <p>A few thoughtful choices for the way you work.</p>
          </div>
          <Badge>LOCAL DEMO</Badge>
        </div>
        <form noValidate onSubmit={save}>
          <Tabs
            label="Settings sections"
            value={tab}
            onValueChange={setTab}
            keepMounted
            variant="underline"
            items={[
              { value: 'profile', label: 'Profile', panel: profile },
              { value: 'notifications', label: 'Notifications', panel: notifications },
              { value: 'preferences', label: 'Preferences', panel: preferences },
            ]}
          />
          <div className="settings-save">
            <p aria-live="polite">
              {dirty ? 'You have unsaved changes.' : 'Everything is up to date.'}
            </p>
            <div className="example-actions">
              <Button variant="ghost" onClick={reset} disabled={!dirty}>
                Discard changes
              </Button>
              <Button
                type="submit"
                status={status}
                successLabel="Saved"
                disabled={!dirty && status !== 'success'}
              >
                Save changes
              </Button>
            </div>
          </div>
          {message && (
            <ActionFeedback
              tone={
                message.startsWith('Your browser') || message.startsWith('Check your')
                  ? 'error'
                  : 'success'
              }
            >
              {message}
            </ActionFeedback>
          )}
        </form>
        <aside className="settings-note">
          <strong>A note about this example</strong>
          <p>
            These settings are stored in this browser under a separate demo key. Use sample
            details. In your application, replace the local save with your authenticated API.
          </p>
        </aside>
      </div>
      <footer className="settings-footer">
        <span>Forma · A little more considered.</span>
        <span>Composed with Duoop.</span>
      </footer>
    </div>
  );
}
