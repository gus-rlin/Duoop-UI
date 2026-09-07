import { categories, componentHref, entries } from './catalog.js';

export const siteOrigin = 'https://duoop-ui.pages.dev';

// Match the content selected by App's route precedence. View and tracking
// parameters do not create separate canonical documents.
export function getPageSeo(route) {
  const selected = entries.find((entry) => entry.id === route.id);
  let path = '/';
  let noindex = false;

  if (route.id) {
    noindex = !selected;
    if (selected) path += componentHref(selected);
  } else if (route.page === 'installation') {
    path += '?page=installation';
  } else if (route.page === 'examples') {
    path += '?page=examples';
    if (route.example === 'landing') path += '&example=landing';
  } else if (route.query) {
    noindex = true;
  } else if (categories.includes(route.category)) {
    path += `?category=${encodeURIComponent(route.category)}`;
  } else if (route.page !== 'home' || route.category !== 'All components') {
    path += '?page=components';
  }

  return { canonical: noindex ? null : new URL(path, siteOrigin).href, noindex };
}

export function updatePageSeo(route) {
  const { canonical, noindex } = getPageSeo(route);
  let link = document.head.querySelector('link[rel="canonical"]');
  if (canonical) {
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
  } else {
    link?.remove();
  }

  let robots = document.head.querySelector('meta[name="robots"][data-duoop-seo]');
  if (noindex) {
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.dataset.duoopSeo = '';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, follow';
  } else {
    robots?.remove();
  }
}
