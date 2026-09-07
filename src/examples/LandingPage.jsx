import React, { useState } from 'react';
import { Button } from '../components/Button/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/Card/Card';
import { Badge } from '../components/Badge/Badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/Accordion/Accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '../components/Dialog/Dialog';
import { Field, Input } from '../components/Forms/Input';
import { RadioGroup } from '../components/Selection/Selection';
import { TextLoop } from '../components/TextLoop/TextLoop';
import { CardsCarousel } from '../components/CardsCarousel/CardsCarousel';
import { BentoGridDemo } from '../components/BentoGrid/BentoGridDemos';
import './pages.css';

const inspiration = [
  ['forest', 'Into the forest', 'photo-1441974231531-c6227db76b6e',
    'Follow a winding trail beneath the canopy, where sunlight filters through the leaves and the sounds of everyday life fade away. There is room here to slow down, look closer and enjoy the walk.',
    'Share a quiet moment among the trees, notice the textures of bark and moss, and let the path set the pace. A forest escape is an invitation to discover how much there is to see when you take your time.'],
  ['coast', 'Ocean air', 'photo-1518837695005-2083093ee35b',
    'Follow the shoreline with salt in the air and an open horizon ahead. From coastal paths to quiet stretches of sand, every turn offers a different view of the sea.',
    'Take time to watch the waves, share a picnic and enjoy the rhythm of a day outdoors. Whether you come for a long walk or a gentle wander, the coast gives you space to breathe.'],
  ['mountains', 'Above the clouds', 'photo-1464822759023-fed622ff2c3b',
    'Step onto mountain trails where the landscape opens up with every bend. Rocky ridges, alpine meadows and distant peaks turn the journey into an experience of its own.',
    'Choose a route that matches your experience and take it at your own pace. Pause for the view, enjoy the company and leave room for the small discoveries along the way.'],
  ['lake', 'Still waters', 'photo-1470770841072-f978cf4d019e',
    'Find a quieter kind of adventure beside the water. Walk along the shore, watch the reflections shift and settle into the calm of a landscape framed by trees and mountains.',
    'A lakeside escape leaves time for simple pleasures: a scenic stroll, a picnic with friends and a moment to sit without rushing anywhere. Let the view be the occasion.'],
  ['desert', 'Desert light', 'photo-1509316785289-025f5b846b35',
    'Discover wide horizons, sculpted dunes and the subtle colours of an open landscape. As the light changes, familiar shapes become something entirely new.',
    'Plan your outing around the conditions, with a suitable route, plenty of water and time to pause. The desert rewards a thoughtful pace and a curious eye for its quiet details.'],
].map(([id, title, photo, introduction, description]) => ({ id, title, category: 'Outdoor escapes', alt: title, src: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=700&q=85`, content: <><p>{introduction}</p><p>{description}</p></> }));


export default function LandingPage({ embedded = false }) {
  const Title = embedded ? 'h2' : 'h1';
  const [billing, setBilling] = useState('monthly');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [created, setCreated] = useState('');
  function start(event) {
    event.preventDefault();
    setCreated(name.trim());
    setOpen(false);
  }
  return (
    <div className="example-page forma">
      <header className="forma-nav">
        <a href="#forma-home" className="forma-brand">
          Nature Escape
        </a>
        <nav aria-label="Nature Escape navigation">
          <a href="#forma-features">Adventures</a>
          <a href="#forma-pricing">Experiences</a>
          <a href="#forma-questions">Questions</a>
        </nav>
        <Button size="sm" onClick={() => setOpen(true)}>
          Plan your escape
        </Button>
      </header>
      <Card id="forma-home" className="forma-hero" variant="elevated" role="img" aria-label="Mountain lake surrounded by forest, with a lakeside cabin" />
      {created && (
        <div className="forma-created" role="status">
          <Badge tone="success">Idea saved</Badge>
          <p>
            <strong>{created}</strong> is the beginning of your next adventure. This demo does not make a booking.
          </p>
          <Button variant="ghost" onClick={() => setCreated('')}>
            Dismiss
          </Button>
        </div>
      )}
      <section id="forma-features" className="forma-section">
        <div className="forma-feature-heading">
          <div>
            <span className="example-eyebrow">THE GREAT OUTDOORS IS CALLING</span>
            <Title>Take a breath.<br /><em>Find your wild.</em></Title>
          </div>
          <div className="forma-feature-cta">
            <p>From forest trails to mountain lakes, discover outdoor adventures that bring you closer to nature.</p>
            <Button variant="outline" motion="expressive" href="#forma-pricing">Find your adventure <span aria-hidden="true">↗</span></Button>
          </div>
        </div>
        <div className="forma-loop-row">
          <TextLoop className="forma-loop" shape="line" text="Less noise. More nature." fontSize={32} ribbonWidth={56} speed={65} color="#fff" ribbonColor="#373434" />
        </div>
        <CardsCarousel items={inspiration} title="Your next escape" label="Your next escape" className="forma-carousel" />
      </section>
      <div className="forma-section">
        <BentoGridDemo />
      </div>
      <section id="forma-pricing" className="forma-section forma-pricing">
        <div>
          <span className="example-eyebrow">MAKE TIME FOR THE OUTDOORS.</span>
          <h2>
            An escape
            <br />
            at your own pace.
          </h2>
          <p>
            A few hours or a whole day.
            <br />
            Choose your kind of outdoor adventure.
          </p>
          <RadioGroup
            legend="Trip duration"
            name="billing"
            value={billing}
            onChange={(event) => setBilling(event.target.value)}
            layout="horizontal"
            options={[
              { value: 'monthly', label: 'Half day' },
              { value: 'yearly', label: 'Full day' },
            ]}
          />
        </div>
        <Card className="forma-price-card" variant="elevated">
          <CardHeader>
            <div className="example-between">
              <CardTitle>Nature escape</CardTitle>
              <Badge>{billing === 'yearly' ? 'TAKE YOUR TIME' : 'GET OUTSIDE'}</Badge>
            </div>
            <CardDescription>A little more room to explore, breathe and reconnect.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="forma-price" aria-live="polite">
              €{billing === 'monthly' ? '45' : '75'}
              <span>/ person</span>
            </div>
            <p>
              {billing === 'monthly'
                ? 'A half-day escape for a breath of fresh air.'
                : 'A full day to take in the scenery.'}
            </p>
            <ul>
              <li>Scenic trails through nature</li>
              <li>A guided outdoor experience</li>
              <li>Time to pause and enjoy the view</li>
            </ul>
            <Button fullWidth onClick={() => setOpen(true)}>
              Plan your escape
            </Button>
            <small>Example pricing. This demo makes no booking or payment.</small>
          </CardContent>
        </Card>
      </section>
      <section id="forma-questions" className="forma-section forma-faq">
        <div>
          <span className="example-eyebrow">BEFORE YOU SET OFF</span>
          <h2>Good adventures start here.</h2>
        </div>
        <Accordion>
          <AccordionItem value="who">
            <AccordionTrigger>Who are these adventures for?</AccordionTrigger>
            <AccordionContent>
              For curious explorers, couples, families and friends. Choose a trip that suits your interests, fitness and the difficulty of the route.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="demo">
            <AccordionTrigger>What should I bring?</AccordionTrigger>
            <AccordionContent>
              Bring comfortable walking shoes, water, sun protection and a jacket suited to the weather. Your packing list will depend on the adventure you choose.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="reuse">
            <AccordionTrigger>How do I plan my escape?</AccordionTrigger>
            <AccordionContent>
              Explore the landscapes, choose a trip duration and give your adventure idea a name. This demo helps you imagine your next escape; it does not confirm a booking.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <footer className="forma-footer">
        <a href="#forma-home" className="forma-brand">
          Nature Escape
        </a>
        <span>It all starts outside.</span>
        <a href="#forma-home">Back to top ↑</a>
      </footer>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="forma-dialog">
          <DialogHeader>
            <DialogTitle>Your next escape.</DialogTitle>
            <DialogDescription>
              Give your adventure idea a name. This local demo sends no data and makes no booking.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form onSubmit={start}>
              <Field label="Adventure name" required>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  name="escapade"
                  placeholder="A weekend in the wild"
                  maxLength={60}
                  pattern=".*\S.*"
                />
              </Field>
              <div className="example-actions">
                <Button type="submit">Save your idea</Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
