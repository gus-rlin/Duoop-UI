// Complete, runnable first examples. Keep their paths consistent with the downloadable bundles.
export const recipes = {
  'relief-button': `import React, { useState } from 'react';
import './base.css';
import { Button } from './components/Button/Button.jsx';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <Button onClick={() => setCount((value) => value + 1)}>
      Pressed {count} times
    </Button>
  );
}
`,
  checkbox: `import React, { useState } from 'react';
import './base.css';
import { Checkbox } from './components/Checkbox/Checkbox.jsx';

export default function App() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Checkbox
      label="Email notifications"
      checked={enabled}
      onChange={(event) => setEnabled(event.target.checked)}
    />
  );
}
`,
  input: `import React from 'react';
import './base.css';
import { Input, Field } from './components/Forms/Input.jsx';

export default function App() {
  return (
    <Field label="Email address">
      <Input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
      />
    </Field>
  );
}
`,
  field: `import React from 'react';
import './base.css';
import { Input, Field } from './components/Forms/Input.jsx';

export default function App() {
  return (
    <Field
      label="Project name"
      required
      description="Give your project a recognizable name."
    >
      <Input name="project" />
    </Field>
  );
}
`,
  'input-group': `import React from 'react';
import './base.css';
import { InputGroup, InputGroupInput } from './components/Forms/InputGroup.jsx';

export default function App() {
  return (
    <InputGroup>
      <InputGroupInput aria-label="Search" placeholder="Search your projects…" />
    </InputGroup>
  );
}
`,
  textarea: `import React from 'react';
import './base.css';
import { Textarea } from './components/Forms/Textarea.jsx';

export default function App() {
  return (
    <Textarea
      aria-label="Your message"
      placeholder="A little more context…"
      rows={4}
    />
  );
}
`,
  'number-field': `import React from 'react';
import './base.css';
import { NumberField } from './components/Forms/NumberField.jsx';

export default function App() {
  return <NumberField aria-label="Quantity" defaultValue={2} min={1} max={10} />;
}
`,
  'otp-field': `import React from 'react';
import './base.css';
import { OtpField } from './components/Forms/OtpField.jsx';

export default function App() {
  return <OtpField aria-label="Verification code" length={6} />;
}
`,
  'radio-group': `import React from 'react';
import './base.css';
import { RadioGroup } from './components/Selection/Selection.jsx';

export default function App() {
  return (
    <RadioGroup
      legend="Delivery"
      name="delivery"
      defaultValue="email"
      options={[
        { value: 'email', label: 'Email' },
        { value: 'push', label: 'Push notification' },
      ]}
    />
  );
}
`,
  switch: `import React, { useState } from 'react';
import './base.css';
import { Switch } from './components/Selection/Selection.jsx';

export default function App() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Switch
      label="Automatic updates"
      checked={enabled}
      onChange={(event) => setEnabled(event.target.checked)}
    />
  );
}
`,
  tabs: `import React from 'react';
import './base.css';
import { Tabs } from './components/Tabs/Tabs.jsx';

export default function App() {
  return (
    <Tabs
      label="Project views"
      items={[
        {
          value: 'overview',
          label: 'Overview',
          panel: <p>Everything in one place.</p>,
        },
        {
          value: 'activity',
          label: 'Activity',
          panel: <p>Your recent activity.</p>,
        },
      ]}
    />
  );
}
`,
  menu: `import React, { useState } from 'react';
import './base.css';
import { Menu, MenuItem } from './components/Menu/Menu.jsx';

export default function App() {
  const [message, setMessage] = useState('');
  return (
    <>
      <Menu trigger="Actions">
        <MenuItem onSelect={() => setMessage('Document duplicated')}>
          Duplicate document
        </MenuItem>
        <MenuItem onSelect={() => setMessage('Document archived')}>
          Archive document
        </MenuItem>
      </Menu>
      <p role="status">{message}</p>
    </>
  );
}
`,
  accordion: `import React from 'react';
import './base.css';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/Accordion/Accordion.jsx';

export default function App() {
  return (
    <Accordion>
      <AccordionItem value="about">
        <AccordionTrigger>What is Duoop?</AccordionTrigger>
        <AccordionContent>
          React components you can copy, customize and make your own.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
`,
  card: `import React from 'react';
import './base.css';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/Card/Card.jsx';

export default function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>A space for good ideas</CardTitle>
        <CardDescription>Start with a considered surface.</CardDescription>
      </CardHeader>
      <CardContent>Compose with your own content.</CardContent>
    </Card>
  );
}
`,
  badge: `import React from 'react';
import './base.css';
import { Badge } from './components/Badge/Badge.jsx';

export default function App() {
  return <Badge tone="success">Ready to use</Badge>;
}
`,
  avatar: `import React from 'react';
import './base.css';
import { Avatar, AvatarGroup } from './components/Avatar/Avatar.jsx';

export default function App() {
  return (
    <AvatarGroup label="Project team">
      <Avatar name="Alex Morgan" />
      <Avatar name="Sam Rivera" />
      <Avatar name="Jamie Lee" />
    </AvatarGroup>
  );
}
`,
  'bento-grid': `import React from 'react';
import './base.css';
import { BentoGrid, BentoItem } from './components/BentoGrid/BentoGrid.jsx';

export default function App() {
  return (
    <BentoGrid>
      <BentoItem span="wide">
        <h2>Room for your big idea.</h2>
        <p>Start with the essentials.</p>
      </BentoItem>
      <BentoItem>
        <h2>Considered details.</h2>
      </BentoItem>
    </BentoGrid>
  );
}
`,
  'kinetic-type': `import React from 'react';
import './base.css';
import { KineticType } from './components/KineticType/KineticType.jsx';

export default function App() {
  return <KineticType as="h1" text="Made to feel different." effect="wave" />;
}
`,
  'text-loop': `import React, { useState } from 'react';
import './base.css';
import { TextLoop } from './components/TextLoop/TextLoop.jsx';
import { Button } from './components/Button/Button.jsx';

export default function App() {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <TextLoop text="Made to move" paused={paused} />
      <Button onClick={() => setPaused((value) => !value)}>
        {paused ? 'Resume' : 'Pause'}
      </Button>
    </>
  );
}
`,
  'reset-limit': `import React from 'react';
import './base.css';
import { ResetLimit } from './components/ResetLimit/ResetLimit.jsx';

export default function App() {
  return <ResetLimit />;
}
`,
  map: `import React from 'react';
import './base.css';
import { Map } from './components/Map/Map.jsx';

export default function App() {
  return <Map center={[40.7128, -74.006]} zoom={12} label="Map of New York" />;
}
`,
  stepper: `import React, { useState } from 'react';
import './base.css';
import { Stepper } from './components/Stepper/Stepper.jsx';

export default function App() {
  const [step, setStep] = useState('profile');
  return (
    <Stepper
      linear={false}
      value={step}
      onValueChange={setStep}
      items={[
        { id: 'profile', title: 'Profile' },
        { id: 'preferences', title: 'Preferences' },
        { id: 'ready', title: 'Ready' },
      ]}
    />
  );
}
`,
  dialog: `import React, { useState } from 'react';
import './base.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from './components/Dialog/Dialog.jsx';
import { Button } from './components/Button/Button.jsx';

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>A little more focus</DialogTitle>
            <DialogDescription>
              A composed surface for your next decision.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
`,
  select: `import React from 'react';
import './base.css';
import { Select } from './components/Select/Select.jsx';

export default function App() {
  return (
    <Select
      label="Direction"
      defaultValue="design"
      options={[
        { value: 'design', label: 'Design' },
        { value: 'research', label: 'Research' },
      ]}
    />
  );
}
`,
  autocomplete: `import React from 'react';
import './base.css';
import { Autocomplete } from './components/Autocomplete/Autocomplete.jsx';

export default function App() {
  return (
    <Autocomplete
      label="Find a project"
      items={[
        { value: 'website', label: 'Website refresh' },
        { value: 'brand', label: 'Brand guidelines' },
      ]}
      showClear
    />
  );
}
`,
  progress: `import React, { useState } from 'react';
import './base.css';
import { Progress } from './components/Progress/Progress.jsx';
import { Button } from './components/Button/Button.jsx';

export default function App() {
  const [value, setValue] = useState(25);
  return (
    <>
      <Progress
        label="Checklist progress"
        value={value}
        state={value === 100 ? 'success' : 'running'}
      />
      <Button
        onClick={() => setValue((current) => (current === 100 ? 0 : current + 25))}
      >
        {value === 100 ? 'Reset' : 'Complete a step'}
      </Button>
    </>
  );
}
`,
  'reaction-button': `import React from 'react';
import './base.css';
import { ReactionButton } from './components/ReactionButton/ReactionButton.jsx';

export default function App() {
  return (
    <ReactionButton kind="like" defaultValue={{ count: 24, selected: false }} />
  );
}
`,
  achievement: `import React from 'react';
import './base.css';
import { Achievement } from './components/Achievement/Achievement.jsx';

export default function App() {
  return (
    <Achievement
      item={{
        id: 'first-project',
        title: 'First project',
        description: 'A good idea, brought to life.',
        state: 'unlocked',
        icon: 'trophy',
      }}
    />
  );
}
`,
  'shuffle-deck': `import React from 'react';
import './base.css';
import { ShuffleDeck } from './components/ShuffleDeck/ShuffleDeck.jsx';

export default function App() {
  return (
    <ShuffleDeck
      items={[
        { id: 'idea', title: 'A good idea' },
        { id: 'detail', title: 'A considered detail' },
        { id: 'story', title: 'A story to share' },
      ]}
      renderItem={(item) => (
        <div style={{ padding: 32 }}>
          <h2>{item.title}</h2>
          <p>Drag a card or use the arrow controls.</p>
        </div>
      )}
    />
  );
}
`,
  'depth-carousel': `import React from 'react';
import './base.css';
import { DepthCarousel } from './components/DepthCarousel/DepthCarousel.jsx';

export default function App() {
  return (
    <DepthCarousel
      items={[
        { id: 'one', title: 'A fresh start' },
        { id: 'two', title: 'A new perspective' },
        { id: 'three', title: 'A considered detail' },
      ]}
      renderItem={(item) => (
        <div style={{ padding: 32, background: '#f0eeee', height: '100%' }}>
          <h2>{item.title}</h2>
        </div>
      )}
    />
  );
}
`,
  'cards-carousel': `import React from 'react';
import './base.css';
import { CardsCarousel } from './components/CardsCarousel/CardsCarousel.jsx';

export default function App() {
  return (
    <CardsCarousel
      title="Stories worth sharing."
      items={[
        {
          id: 'studio',
          title: 'A place to make',
          category: 'Studio',
          description: 'Room for good ideas.',
          src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop',
        },
        {
          id: 'city',
          title: 'A new perspective',
          category: 'Explore',
          description: 'A different point of view.',
          src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop',
        },
      ]}
    />
  );
}
`,
  testimonials: `import React from 'react';
import './base.css';
import { Testimonials } from './components/Testimonials/Testimonials.jsx';

export default function App() {
  return (
    <Testimonials
      eyebrow="Example voices"
      title="Good work, together."
      items={[
        {
          id: 'alex',
          name: 'Alex Morgan',
          role: 'Designer',
          company: 'Example Studio',
          quote: 'A considered starting point for our next project.',
        },
        {
          id: 'sam',
          name: 'Sam Rivera',
          role: 'Developer',
          company: 'Example Studio',
          quote: 'Every detail has a place. The code comes with it.',
        },
      ]}
    />
  );
}
`,
  'card-spread': `import React from 'react';
import './base.css';
import { CardSpread } from './components/CardSpread/CardSpread.jsx';

export default function App() {
  return (
    <CardSpread
      items={[
        {
          id: 'studio',
          title: 'The studio',
          image:
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop',
          alt: 'A bright studio interior',
        },
        {
          id: 'city',
          title: 'The city',
          image:
            'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop',
          alt: 'City buildings',
        },
      ]}
    />
  );
}
`,
  toast: `import React from 'react';
import './base.css';
import { Button } from './components/Button/Button.jsx';
import {
  ToastProvider,
  ToastViewport,
  useToast,
} from './components/Toast/Toast.jsx';

function Confirmation() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({ id: 'saved', title: 'Changes saved', status: 'success' })
      }
    >
      Show confirmation
    </Button>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Confirmation />
      <ToastViewport position="bottom-right" />
    </ToastProvider>
  );
}
`,
};

export const notes = {
  map: 'Map uses Leaflet and remote OpenStreetMap/CARTO tiles. Preserve visible attribution, allow the tile hosts in your CSP, and check provider terms and capacity before deployment. Supply your own tiles for offline use.',
  toast:
    'Wrap callers in ToastProvider and render ToastViewport once. useToast must be called inside the provider. Connect real requests in your application.',
  'text-loop':
    'Continuous motion needs a visible pause control. The recipe includes one; reduced-motion preferences are also respected.',
  'reset-limit':
    'This is a visual reset demonstration. Connect application quotas and permissions in your own application; it does not reset any external service.',
  'otp-field':
    'This component collects a code. Verification, expiry and rate limits belong on your server.',
  achievement:
    'Unlocks and rewards in the gallery are local demonstrations. Your application owns authorization and durable progress.',
};

export function recipeFor(entry) {
  return recipes[entry.id.slice(8)];
}
