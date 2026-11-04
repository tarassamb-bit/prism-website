// Vercel Web Analytics and Speed Insights setup, loaded on every page before their scripts.
// Only the live site is measured: not localhost, not preview deployments, not a browser opted out with ?notrack
// (visit any page once with ?notrack to stop counting your own visits; ?track turns it back on).
// Project addresses carry the project's title, so they're grouped by page type before they're sent.
(() => {
  const LIVE = ['prismclips.vercel.app', 'prismclips.app', 'www.prismclips.app'];
  const flags = location.search + location.hash;
  try {
    if (/[?&#]notrack\b/.test(flags)) localStorage.setItem('prism-no-analytics', '1');
    if (/[?&#]track\b/.test(flags)) localStorage.removeItem('prism-no-analytics');
  } catch { /* private window: the choice can't be kept */ }
  let optedOut = false;
  try { optedOut = localStorage.getItem('prism-no-analytics') === '1'; } catch { /* counted */ }
  const measured = LIVE.includes(location.hostname) && !optedOut;

  const queue = (name) => { window[name] = window[name] || function () { (window[`${name}q`] = window[`${name}q`] || []).push(arguments); }; };
  queue('va');
  queue('si');

  const grouped = (url) => url
    .replace(/\/app\/project\/[^/?#]+\/short-\d+/, '/app/project/[project]/short/[n]')
    .replace(/\/app\/project\/[^/?#]+/, '/app/project/[project]');
  const beforeSend = (event) => (measured ? { ...event, url: grouped(event.url) } : null);
  window.va('beforeSend', beforeSend);
  window.si('beforeSend', beforeSend);

  /** A custom event. `data` holds only counts and buckets, never titles or anything a person wrote. */
  window.prismTrack = (name, data) => { if (measured) window.va('event', { name, ...(data ? { data } : {}) }); };
})();
