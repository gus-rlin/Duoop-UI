import React, { useId, useState } from 'react';
import { Input, Field } from './Input';
import { Button, ActionFeedback } from '../Button/Button';

function animateInvalidInput(input) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  input.getAnimations().filter(animation => animation.id === 'invalid-input').forEach(animation => animation.cancel());
  input.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(-2px)' },
    { transform: 'translateX(0)' },
  ], { id: 'invalid-input', duration: 260, easing: 'ease-out' });
}

export function EmailForm() {
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  function submit(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.email;
    if (!input.validity.valid) {
      setError(input.validity.valueMissing ? 'Enter your email address.' : 'Use an email address such as you@example.com.');
      setSent(false);
      input.focus();
      animateInvalidInput(input);
      return;
    }
    setError('');
    setSent(true);
  }
  return <form className="form-demo" noValidate onSubmit={submit}>
    <Field label="Email address" required description="Try submitting an empty or invalid address." error={error}>
      <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" onChange={() => { setError(''); setSent(false); }} />
    </Field>
    <Button type="submit" status={sent ? 'success' : 'idle'} successLabel="Email validated">Validate email</Button>
    <ActionFeedback className="form-notice">{sent ? 'Email validated. This demo sends no data.' : ''}</ActionFeedback>
  </form>;
}

export function AdjacentInput() {
  const [searched, setSearched] = useState('');
  const [error, setError] = useState('');
  const errorId = useId();
  function submit(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.search;
    const value = input.value.trim();
    if (!value) {
      setError('Type a keyword to start your search.');
      setSearched('');
      input.focus();
      animateInvalidInput(input);
      return;
    }
    setError('');
    setSearched(value);
  }
  return <form className="form-demo" noValidate onSubmit={submit}>
    <div className="input-adjacent"><Input type="search" name="search" aria-label="Search the library" placeholder="Search…" required aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} onChange={() => { setError(''); setSearched(''); }} /><Button type="submit" status={searched ? 'success' : 'idle'} successLabel="Search complete">Search</Button></div>
    <div aria-live="polite">{error && <p className="form-validation-error" id={errorId}><span aria-hidden="true">!</span>{error}</p>}</div>
    <ActionFeedback className="form-notice">{searched && `Demo search: “${searched}”`}</ActionFeedback>
  </form>;
}


export function UsernameForm() {
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);
  function submit(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.username;
    const value = input.value.trim();
    const message = !value ? 'Enter a username.' : value.length < 3 || value.length > 20 ? 'Use between 3 and 20 characters.' : !/^[A-Za-z0-9_]+$/.test(value) ? 'Use only letters, numbers, or underscores.' : ['admin', 'support'].includes(value.toLowerCase()) ? 'This username is reserved. Choose another name.' : '';
    setError(message);
    setValid(!message);
    if (message) { input.focus(); animateInvalidInput(input); }
  }
  return <form className="form-demo" noValidate onSubmit={submit}>
    <Field label="Username" required description="Use 3–20 letters, numbers, or underscores. Try admin or support to test a reserved name." error={error} success={valid ? 'This username passes the demo rules.' : undefined}>
      <Input name="username" autoComplete="username" minLength={3} maxLength={20} pattern="[A-Za-z0-9_]+" placeholder="alex_morgan" onChange={() => { setError(''); setValid(false); }} />
    </Field>
    <Button type="submit" status={valid ? 'success' : 'idle'} successLabel="Username validated">Validate username</Button>
  </form>;
}

export function HelpLinkField() {
  return <Field label="Public profile URL" description={<>Use a complete URL. <a href="https://example.com" target="_blank" rel="noreferrer">View an example URL (opens a new tab)</a>.</>}>
    <Input type="url" placeholder="https://example.com" />
  </Field>;
}

export function GroupedFields() {
  return <fieldset className="field-group"><legend>Contact details</legend>
    <Field label="First name" required><Input name="given-name" autoComplete="given-name" placeholder="Alex" /></Field>
    <Field label="Last name" required><Input name="family-name" autoComplete="family-name" placeholder="Morgan" /></Field>
  </fieldset>;
}

