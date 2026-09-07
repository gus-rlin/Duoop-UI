import React, { useState } from 'react';
import { Button } from '../Button';

import '../showcase.css';

function Icon({ name = 'arrow' }) {
  return <svg className={name === 'star' ? 'favorite-star' : undefined} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'plus' ? <path d="M12 5v14M5 12h14" /> : name === 'star' ? <><path className="favorite-star-fill" fill="#facc15" stroke="none" d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></> : name === 'trash' ? <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></> : <path d="M4 12h16m-6-6 6 6-6 6" />}</svg>;
}
export default function Demo() {
  const [selected, setSelected] = useState(false);
  return (
    <Button className="favorite-button" variant="outline" icon={<Icon name="star" />} iconPosition="only" aria-label="Favorite" selected={selected} onClick={() => setSelected(value => !value)} />
  );
}
