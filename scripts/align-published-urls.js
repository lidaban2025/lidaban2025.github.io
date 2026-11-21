const fs = require('node:fs');
const path = require('node:path');

const origin = 'https://formsuite.dev';
const canonicalTag = /(<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["'])([^"']+)/i;

function alignPublishedUrls(directory) {
  const files = fs.readdirSync(directory, { recursive: true })
    .map(file => file.split(path.sep).join('/'))
    .filter(file => file.endsWith('.html') && file !== '404.html');
  const routes = new Map();
  for (const file of files) {
    const address = '/' + file;
    const served = address.endsWith('/index.html') ? address.slice(0, -10) : address.slice(0, -5);
    routes.set(address, served);
    routes.set(served, served);
  }

  const sitemapPages = new Set();
  for (const file of files) {
    const source = path.join(directory, file);
    const base = new URL(routes.get('/' + file), origin);
    let html = fs.readFileSync(source, 'utf8');
    const rewrite = (value) => {
      let resolved;
      try { resolved = new URL(value.replaceAll('&amp;', '&'), base); } catch { return value; }
      if (resolved.origin !== origin) return value;
      const clean = routes.get(resolved.pathname);
      if (!clean || clean === resolved.pathname) return value;
      const suffix = value.match(/[?#][\s\S]*$/)?.[0] || '';
      const absolute = /^(?:https?:)?\/\//i.test(value);
      return (absolute ? origin : '') + clean + suffix;
    };
    html = html.replace(canonicalTag, (_, prefix, value) => prefix + rewrite(value));
    html = html.replace(/(<meta\b[^>]*\bproperty=["']og:url["'][^>]*\bcontent=["'])([^"']+)/gi, (_, prefix, value) => prefix + rewrite(value));
    html = html.replace(/<a\b[^>]*>/gi, tag => {
      if (/\bdownload(?:[\s=>]|$)/i.test(tag)) return tag;
      return tag.replace(/(\shref=["'])([^"']+)/i, (_, prefix, value) => prefix + rewrite(value));
    });
    const canonical = html.match(canonicalTag)?.[2];
    const robots = [...html.matchAll(/<meta\b[^>]*\bname=["'](?:robots|googlebot)["'][^>]*>/gi)];
    if (canonical === base.href && !robots.some(([tag]) => /\bnoindex\b/i.test(tag))) {
      sitemapPages.add(base.pathname);
    }
    fs.writeFileSync(source, html);
  }

  const sitemap = path.join(directory, 'sitemap.xml');
  const included = new Set();
  const output = fs.readFileSync(sitemap, 'utf8').replace(/^\s*<url>[\s\S]*?<\/url>/gm, block => {
    const location = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!location) throw new Error('A sitemap entry is missing its URL.');
    const url = new URL(location);
    const served = routes.get(url.pathname);
    if (url.origin !== origin || !sitemapPages.has(served) || included.has(served)) return '';
    included.add(served);
    return block.replace(location, origin + served);
  });
  if (!included.has('/')) throw new Error('The homepage must remain in the sitemap.');
  fs.writeFileSync(sitemap, output);
  console.log('Published sitemap contains ' + included.size + ' canonical URLs.');
}

module.exports = { alignPublishedUrls };
