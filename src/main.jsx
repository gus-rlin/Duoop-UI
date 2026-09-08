import React, { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './base.css';
import './components/Button/showcase.css';
import './components/new-previews.css';
import './styles.css';
import { Button } from './components/Button/Button';
import { Input } from './components/Forms/Input';
import { Icon } from './catalog/Icon';
import { GitHubStars } from './catalog/GitHubStars';
import {
  entries,
  categories,
  legacyCategories,
  componentHref,
  repository,
} from './catalog/catalog';
import { CatalogPreview } from './catalog/Previews';
import { updatePageSeo } from './catalog/seo';

const ComponentDetail = lazy(() =>
  import('./catalog/ComponentDetail').then((module) => ({ default: module.ComponentDetail })),
);
const Installation = lazy(() =>
  import('./catalog/Installation').then((module) => ({ default: module.Installation })),
);
const Examples = lazy(() =>
  import('./catalog/Examples').then((module) => ({ default: module.Examples })),
);

function readRoute() {
  const params = new URLSearchParams(location.search);
  const requested = params.get('category');
  return {
    page: params.get('page') || 'home',
    id: params.get('component'),
    category: legacyCategories[requested] || requested || 'All components',
    query: params.get('q') || '',
    example: params.get('example'),
    mode: ['code', 'installation'].includes(params.get('tab')) ? params.get('tab') : 'preview',
  };
}

class PageBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error) {
    console.error(error);
  }
  render() {
    return this.state.error ? (
      <div className="empty-state">
        <h1>This page could not load.</h1>
        <p>Reload to try again. Your browser’s saved data has not been changed.</p>
        <Button onClick={() => location.reload()}>Reload page</Button>
      </div>
    ) : (
      this.props.children
    );
  }
}

function CatalogHeading({ as: Tag, children }) {
  return <Tag>{children}</Tag>;
}

function Hero() {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="eyebrow-line" /> THOUGHTFULLY MADE. YOURS TO MAKE.
        </span>
        <h1>
          Small details.
          <br />
          <span>Big difference.</span>
        </h1>
        <p>
          Tactile React components for interfaces that feel right. Explore the interaction,
          take the code, and make it your own.
        </p>
        <div className="hero-actions">
          <Button href="#components" icon={<Icon name="arrow" />} iconPosition="right">
            Explore components
          </Button>
          <Button
            href="?page=installation"
            variant="outline"
            icon={<Icon name="external" size={16} />}
            iconPosition="right"
          >
            Start building
          </Button>
        </div>
        <div className="hero-meta">
          <span>33 components</span>
          <i />
          React + CSS
          <i />
          <span>Copy. Customize. Keep.</span>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);
  const mainRef = useRef(null);
  const menuRef = useRef(null);
  const navigationRef = useRef(null);
  const lastUrl = useRef(location.href);
  const selected = entries.find((entry) => entry.id === route.id);
  const isHome =
    route.page === 'home' && !route.id && !route.query && route.category === 'All components';
  const isCatalog = !route.id && !['installation', 'examples'].includes(route.page);
  useEffect(() => {
    const sync = () => {
      const previous = new URL(lastUrl.current).searchParams;
      const next = readRoute();
      if (
        previous.get('example') === 'settings' &&
        next.example !== 'settings' &&
        !window.dispatchEvent(new CustomEvent('duoop:before-navigate', { cancelable: true }))
      ) {
        history.pushState(null, '', lastUrl.current);
        return;
      }
      lastUrl.current = location.href;
      setRoute(next);
      setMobileOpen(false);
    };
    const shortcut = (event) => {
      if (
        !event.defaultPrevented &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('keydown', shortcut);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('keydown', shortcut);
    };
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    navigationRef.current?.querySelector('a')?.focus();
    const closeOnDesktop = () => {
      if (innerWidth > 760) setMobileOpen(false);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [mobileOpen]);
  function closeNavigation() {
    setMobileOpen(false);
    requestAnimationFrame(() => menuRef.current?.focus());
  }
  function navigationKeys(event) {
    if (!mobileOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeNavigation();
    }
    if (event.key === 'Tab') {
      const controls = [
        ...navigationRef.current.querySelectorAll('a[href],button:not([disabled])'),
      ];
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
  useEffect(() => {
    document.title = `${selected?.name || (route.page === 'installation' ? 'Installation' : route.page === 'examples' ? 'Page examples' : 'Tactile React components')} — Duoop-UI`;
  }, [selected, route.page]);
  useEffect(() => {
    updatePageSeo(route);
  }, [route]);
  function navigate(url, { replace = false, focus = true } = {}) {
    if (
      focus &&
      !window.dispatchEvent(new CustomEvent('duoop:before-navigate', { cancelable: true }))
    )
      return;
    history[replace ? 'replaceState' : 'pushState'](null, '', url);
    lastUrl.current = location.href;
    setRoute(readRoute());
    setMobileOpen(false);
    if (focus) {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
    }
  }
  function link(event) {
    const anchor = event.target.closest('a');
    if (
      !anchor ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.target ||
      anchor.hasAttribute('download')
    )
      return;
    const url = new URL(anchor.href);
    if (
      url.origin !== location.origin ||
      url.pathname !== location.pathname ||
      (url.hash && url.search === location.search)
    )
      return;
    // Example forms own their unsaved-change guard, including document navigation.
    if (route.example === 'settings') return;
    event.preventDefault();
    navigate(url);
  }
  function search(value) {
    if (!window.dispatchEvent(new CustomEvent('duoop:before-navigate', { cancelable: true })))
      return;
    const params = new URLSearchParams({ page: 'components' });
    if (value) params.set('q', value);
    navigate(`?${params}`, { replace: true, focus: false });
  }
  function mode(value) {
    const url = new URL(location.href);
    value === 'preview' ? url.searchParams.delete('tab') : url.searchParams.set('tab', value);
    navigate(url, { focus: false });
  }
  const normalized = route.query
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const filtered = entries.filter(
    (entry) =>
      (route.category === 'All components' ||
        route.category === entry.category ||
        !categories.includes(route.category)) &&
      tokens.every((token) =>
        `${entry.name} ${entry.category} ${entry.summary} ${entry.folder}`
          .toLowerCase()
          .includes(token),
      ),
  );
  const navLink = (href, name, icon, active, extra) => (
    <a
      href={href}
      className={`site-nav-link${active ? ' is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon name={icon} />
      {name}
      {extra && <span>{extra}</span>}
    </a>
  );
  return (
    <div className="catalog-shell" onClick={link}>
      <a className="skip" href="#main-content">
        Skip to content
      </a>
      <header className="site-header" inert={mobileOpen || undefined}>
        <div className="site-brand-wrap">
          <Button
            ref={menuRef}
            className="mobile-menu-toggle"
            variant="ghost"
            icon={<Icon name={mobileOpen ? 'close' : 'menu'} />}
            iconPosition="only"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="catalog-navigation"
            onClick={() => setMobileOpen((value) => !value)}
          />
          <a href="?" className="site-brand">
            <img className="brand-mark" src="/armadillo-logo.png" alt="" width="40" height="40" />
            <span>
              Duoop<span className="brand-ui">–UI</span>
            </span>
          </a>
        </div>
        <nav className="top-navigation" aria-label="Main navigation">
          <a href="?page=components" aria-current={isCatalog || selected ? 'page' : undefined}>
            Components
          </a>
          <a
            href="?page=examples"
            aria-current={route.page === 'examples' ? 'page' : undefined}
          >
            Examples
          </a>
          <a
            href="?page=installation"
            aria-current={route.page === 'installation' ? 'page' : undefined}
          >
            Installation
          </a>
        </nav>
        <div className="header-search">
          <Icon name="search" size={17} />
          <Input
            ref={searchRef}
            type="search"
            aria-label="Search components"
            placeholder="Find a component…"
            value={route.query}
            onChange={(event) => search(event.target.value)}
          />
          <kbd>⌘ K</kbd>
        </div>
        <div className="header-github">
        <GitHubStars />
        <a
          href={repository}
          className="github-link"
          aria-label="Duoop on GitHub"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="github" size={21} />
        </a>
        </div>
      </header>
      {mobileOpen && (
        <div className="navigation-backdrop" aria-hidden="true" onClick={closeNavigation} />
      )}
      <aside
        id="catalog-navigation"
        ref={navigationRef}
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen || undefined}
        aria-label={mobileOpen ? 'Library navigation' : undefined}
        onKeyDown={navigationKeys}
        className={`catalog-sidebar${mobileOpen ? ' is-open' : ''}`}
      >
        <Button
          className="mobile-navigation-close"
          variant="ghost"
          onClick={closeNavigation}
          icon={<Icon name="close" />}
          iconPosition="right"
        >
          Close navigation
        </Button>
        <nav aria-label="Library navigation">
          <span className="sidebar-label">THE LIBRARY</span>
          {navLink(
            '?page=components',
            'All components',
            'grid',
            isCatalog && route.category === 'All components',
            entries.length,
          )}
          {navLink(
            '?page=examples',
            'Page examples',
            'layers',
            route.page === 'examples',
            '01',
          )}
          {navLink(
            '?page=installation',
            'Getting started',
            'book',
            route.page === 'installation',
          )}
          <div className="sidebar-divider" />
          <span className="sidebar-label">COMPONENTS</span>
          {categories.map((category) => (
            <div className="category-group" key={category}>
              <a
                className={`category-link${route.category === category ? ' is-active' : ''}`}
                href={`?category=${encodeURIComponent(category)}`}
              >
                <span>{category}</span>
                <span>
                  {entries
                    .filter((entry) => entry.category === category)
                    .length.toString()
                    .padStart(2, '0')}
                </span>
              </a>
              {(selected?.category === category || route.category === category) && (
                <div className="sidebar-components">
                  {entries
                    .filter((entry) => entry.category === category)
                    .map((entry) => (
                      <a
                        key={entry.id}
                        href={componentHref(entry)}
                        aria-current={selected?.id === entry.id ? 'page' : undefined}
                      >
                        {entry.name}
                      </a>
                    ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-start">
          <Icon name="code" size={21} />
          <strong>
            Your next detail
            <br />
            starts here.
          </strong>
          <p>
            Pick a component.
            <br />
            Make it your own.
          </p>
          <Button href="?page=installation" variant="solid" size="sm" fullWidth icon={<Icon name="arrow" size={16} />} iconPosition="right">
            Start building
          </Button>
        </div>
        <div className="sidebar-foot">
          React + CSS <span>Apache 2.0</span>
        </div>
      </aside>
      <div className="catalog-content" inert={mobileOpen || undefined}>
        <main className="catalog-main" id="main-content" ref={mainRef} tabIndex={-1}>
          <PageBoundary key={`${route.page}:${route.id}:${route.example}`}>
            <Suspense
              fallback={
                <div className="page-loading" role="status">
                  Loading your next detail…
                </div>
              }
            >
              {route.id ? (
                selected ? (
                  <ComponentDetail
                    key={selected.id}
                    entry={selected}
                    mode={route.mode}
                    onMode={mode}
                  />
                ) : (
                  <div className="empty-state">
                    <h1>Component not found.</h1>
                    <p>This link does not match a component in the library.</p>
                    <Button href="?page=components">Explore all components</Button>
                  </div>
                )
              ) : route.page === 'installation' ? (
                <Installation />
              ) : route.page === 'examples' ? (
                <Examples selected={route.example} mode={route.mode} onMode={mode} />
              ) : (
                <>
                  {isHome && <Hero />}
                  <section className="component-catalog" id="components">
                    <div className="catalog-heading">
                      <div>
                        <span className="eyebrow">FIND YOUR NEXT DETAIL</span>
                        <CatalogHeading as={isHome ? 'h2' : 'h1'}>
                          {route.query
                            ? 'Search the library.'
                            : route.category !== 'All components' &&
                                categories.includes(route.category)
                              ? route.category
                              : 'The component collection.'}
                        </CatalogHeading>
                        <p>
                          {route.query
                            ? `Results for “${route.query}”`
                            : 'Thoughtful defaults. Expressive interactions. All the code included.'}
                        </p>
                      </div>
                      <span className="collection-count" role="status">
                        {filtered.length.toString().padStart(2, '0')} <span>components</span>
                      </span>
                    </div>
                    <div
                      className="category-filters"
                      role="group"
                      aria-label="Component categories"
                    >
                      {['All components', ...categories].map((category) => (
                        <Button
                          size="sm"
                          variant={route.category === category ? 'solid' : 'outline'}
                          href={
                            category === 'All components'
                              ? '?page=components'
                              : `?category=${encodeURIComponent(category)}`
                          }
                          aria-current={route.category === category ? 'page' : undefined}
                          key={category}
                        >
                          {category === 'All components' ? 'All' : category}
                        </Button>
                      ))}
                    </div>
                    {filtered.length ? (
                      <div className="catalog-grid">
                        {filtered.map((entry) => (
                          <React.Fragment key={entry.id}>
                          <article className="catalog-card">
                            <a
                              className="catalog-card-preview-link"
                              href={componentHref(entry)}
                              aria-label={`Explore ${entry.name}`}
                            >
                              <CatalogPreview entry={entry} />
                            </a>
                            <div className="catalog-card-copy">
                              <div>
                                <h3>
                                  <a href={componentHref(entry)}>{entry.name}</a>
                                </h3>
                                <Icon name="external" size={15} />
                              </div>
                              <p>{entry.summary}</p>
                              <div className="catalog-card-meta">
                                <span>{entry.category}</span>
                                <a
                                  href={`${componentHref(entry)}&tab=code`}
                                  aria-label={`Get ${entry.name} code`}
                                >
                                  <Icon name="code" size={14} /> Code
                                </a>
                              </div>
                            </div>
                          </article>
                          <div className="catalog-row-rule" aria-hidden="true" />
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <Icon name="search" size={30} />
                        <h2>No matching components.</h2>
                        <p>Try a name like “button”, “tabs” or “card”.</p>
                        <Button variant="outline" onClick={() => search('')}>
                          Clear search
                        </Button>
                      </div>
                    )}
                  </section>
                  {isHome && (
                    <section className="home-next">
                      <div>
                        <span className="eyebrow">A LITTLE INSPIRATION</span>
                        <h2>See the bigger picture.</h2>
                        <p>An outdoor adventure landing page. The same considered components.</p>
                      </div>
                      <Button
                        href="?page=examples"
                        variant="outline"
                        icon={<Icon name="arrow" />}
                        iconPosition="right"
                      >
                        Explore page examples
                      </Button>
                    </section>
                  )}
                </>
              )}
            </Suspense>
          </PageBoundary>
        </main>
        <footer className="catalog-footer">
          <a href="?" className="footer-wordmark">
            Duoop–UI
          </a>
          <span>Considered components. Code you keep.</span>
          <div>
            <a href="?page=installation">Documentation</a>
            <a href={repository} target="_blank" rel="noreferrer">
              GitHub <Icon name="external" size={12} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
