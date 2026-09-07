import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './KineticType.css';

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const characters = text => Array.from(segmenter.segment(text), part => part.segment);

/** A finite entrance, replayable by changing replayKey. Text remains readable without motion. */
export function KineticType({ text = 'MAKE SOME\nNOISE.', as: Tag = 'span', effect = 'scatter', duration = 1.4, replayKey = 0, paused = false, className = '', style, ...props }) {
  const root = useRef(null);
  const animation = useRef(null);
  const isPaused = useRef(paused);
  isPaused.current = paused;
  const lines = String(text).split('\n');
  const longest = Math.max(1, ...lines.map(line => characters(line).length));

  useEffect(() => {
    const element = root.current;
    const letters = element.querySelectorAll('.kinetic-type__letter');
    const media = gsap.matchMedia();
    let observer;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const seconds = Number.isFinite(duration) ? Math.min(4, Math.max(.4, duration)) : 1.4;
      const from = effect === 'wave'
        ? { yPercent: 125, rotation: -12, scale: .65 }
        : effect === 'flip'
          ? { rotationX: -100, yPercent: 65, transformOrigin: '50% 100%' }
          : { xPercent: i => Math.sin(i * 2.4 + 1) * 230, yPercent: i => Math.cos(i * 1.7) * 260, rotation: i => Math.sin(i * 3.1 + 2) * 100, scale: .2 };
      const tween = gsap.fromTo(letters, { ...from, opacity: 0 }, {
        xPercent: 0, yPercent: 0, rotation: 0, rotationX: 0, scale: 1, opacity: 1,
        duration: seconds * .7, stagger: { amount: seconds * .3, from: effect === 'scatter' ? 'center' : 'start' },
        ease: effect === 'scatter' ? 'back.out(1.5)' : 'power3.out', paused: true, immediateRender: false,
      });
      animation.current = tween;
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!isPaused.current) tween.play();
        } else tween.pause();
      }, { threshold: .15 });
      observer.observe(element);
      return () => { observer.disconnect(); tween.kill(); animation.current = null; };
    });
    return () => { observer?.disconnect(); media.revert(); };
  }, [text, effect, duration, replayKey]);

  useEffect(() => {
    if (paused) animation.current?.pause();
    else {
      const bounds = root.current.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) animation.current?.play();
    }
  }, [paused]);

  return <Tag {...props} ref={root} className={`kinetic-type ${className}`} style={{ '--kinetic-size': `${Math.min(19, 100 / longest)}cqi`, ...style }}>
    <span className="kinetic-type__accessible">{text}</span>
    <span aria-hidden="true" className="kinetic-type__visual">{lines.map((line, lineIndex) => <span className="kinetic-type__line" key={lineIndex}>{line ? characters(line).map((letter, index) => <span className="kinetic-type__letter" key={index}>{letter === ' ' ? '\u00a0' : letter}</span>) : <br />}</span>)}</span>
  </Tag>;
}

