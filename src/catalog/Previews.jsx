import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/Card/Card';
import { Badge } from '../components/Badge/Badge';
import { Tabs } from '../components/Tabs/Tabs';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { Switch, RadioGroup } from '../components/Selection/Selection';
import { Input, Field } from '../components/Forms/Input';
import { Icon } from './Icon';

const PrimitivePreview = lazy(() =>
  import('./PrimitivePreviews').then((module) => ({ default: module.PrimitivePreview })),
);
const primitiveIds = new Set([
  'textarea',
  'number-field',
  'otp-field',
  'input-group',
  'select',
  'autocomplete',
  'progress',
  'toast',
  'reaction-button',
  'achievement',
  'stepper',
  'accordion',
  'menu',
]);

const previewModules = {
  'kinetic-type': ['KineticType/KineticTypeDemos', 'KineticPreview'],
  'shuffle-deck': ['ShuffleDeck/ShuffleDeckDemos', 'ShufflePreview'],
  'reset-limit': ['ResetLimit/ResetLimit', 'ResetLimitPreview'],
  'text-loop': ['TextLoop/TextLoopDemos', 'TextLoopPreview'],
  'depth-carousel': ['DepthCarousel/DepthCarouselDemos', 'DepthPreview'],
  'cards-carousel': ['CardsCarousel/CardsCarouselDemos', 'CardsCarouselPreview'],
  'card-spread': ['CardSpread/CardSpreadDemos', 'SpreadPreview'],
  avatar: ['Avatar/AvatarDemos', 'AvatarPreview'],
  testimonials: ['Testimonials/TestimonialsDemos', 'TestimonialsPreview'],
  'bento-grid': ['BentoGrid/BentoGridDemos', 'BentoPreview'],
  map: ['Map/MapDemos', 'MapPreview'],
};
const modules = import.meta.glob([
  '../components/**/*Demos.jsx',
  '../components/ResetLimit/ResetLimit.jsx',
]);
const previews = Object.fromEntries(
  Object.entries(previewModules).map(([key, [path, name]]) => [
    key,
    lazy(() =>
      modules[`../components/${path}.jsx`]().then((module) => ({ default: module[name] })),
    ),
  ]),
);

export function CatalogPreview({ entry }) {
  const root = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([event]) => {
        if (event.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const id = entry.id.slice(8);
  const Preview = previews[id];
  let content;
  if (primitiveIds.has(id))
    content = (
      <Suspense fallback={<span className="preview-placeholder">{entry.name}</span>}>
        <PrimitivePreview id={id} />
      </Suspense>
    );
  else if (Preview)
    content = (
      <Suspense fallback={<span className="preview-placeholder">{entry.name}</span>}>
        <Preview />
      </Suspense>
    );
  else if (id === 'relief-button')
    content = (
      <div className="preview-buttons">
        <Button icon={<Icon name="arrow" />} iconPosition="right">
          Continue
        </Button>
        <Button
          variant="outline"
          icon={<Icon name="layers" />}
          iconPosition="only"
          aria-label="Layers"
        />
      </div>
    );
  else if (id === 'checkbox')
    content = (
      <div className="preview-stack">
        <Checkbox label="Make something good" defaultChecked />
        <Checkbox label="Share it with the world" />
      </div>
    );
  else if (id === 'switch')
    content = (
      <div className="preview-stack">
        <Switch label="A little more focus" defaultChecked />
        <Switch label="Do not disturb" />
      </div>
    );
  else if (id === 'radio-group')
    content = (
      <RadioGroup
        legend="Your next direction"
        defaultValue="studio"
        options={[
          { value: 'studio', label: 'For the studio' },
          { value: 'personal', label: 'For yourself' },
        ]}
      />
    );
  else if (['input', 'field'].includes(id))
    content = (
      <div className="preview-field">
        <Field
          label={id === 'autocomplete' ? 'Find your next idea' : 'A place for your ideas'}
        >
          <Input
            placeholder={id === 'select' ? 'Choose a direction…' : 'Something worth making…'}
          />
        </Field>
      </div>
    );
  else if (id === 'card')
    content = (
      <Card size="sm" className="preview-card">
        <CardHeader>
          <Badge size="sm">A FRESH START</Badge>
          <CardTitle>A space for good ideas.</CardTitle>
          <CardDescription>Considered from the first detail.</CardDescription>
        </CardHeader>
      </Card>
    );
  else if (id === 'badge')
    content = (
      <div className="preview-badges">
        <Badge>In progress</Badge>
        <Badge tone="success">Complete</Badge>
        <Badge appearance="outline">Under review</Badge>
      </div>
    );
  else if (id === 'tabs')
    content = (
      <Tabs
        label="Project views"
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity' },
          { value: 'files', label: 'Files' },
        ]}
      />
    );
  else if (id === 'dialog')
    content = (
      <Card size="sm" className="preview-card">
        <CardHeader>
          <CardTitle>A moment of focus.</CardTitle>
          <CardDescription>Make room for the next step.</CardDescription>
          <Button size="sm">Sounds good</Button>
        </CardHeader>
      </Card>
    );
  else
    content = (
      <div className="preview-achievement">
        <Icon name="check" size={36} />
        <Badge>FIRST MILESTONE</Badge>
      </div>
    );
  return (
    <div
      ref={root}
      className={`catalog-preview catalog-preview--${id}`}
      inert
      aria-hidden="true"
    >
      {visible ? content : <span className="preview-placeholder">{entry.name}</span>}
    </div>
  );
}
