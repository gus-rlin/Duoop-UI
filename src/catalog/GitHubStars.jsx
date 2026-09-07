import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card/Card';
import { Icon } from './Icon';
import { repository } from './catalog';

export function GitHubStars() {
  const [stars, setStars] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const path = new URL(repository).pathname;
    fetch(`https://api.github.com/repos${path}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Repository unavailable');
        return response.json();
      })
      .then((data) => {
        if (Number.isSafeInteger(data.stargazers_count) && data.stargazers_count >= 0) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const label = stars === null ? 'GitHub stars unavailable' : `${stars.toLocaleString('en-US')} GitHub stars`;
  return (
    <Card href={repository} interactive size="sm" className="github-stars"
      target="_blank" rel="noreferrer" aria-label={label} title={label}>
      <span>{stars === null ? '—' : stars.toLocaleString('en-US')}</span>
      <Icon name="star" size={16} />
    </Card>
  );
}
