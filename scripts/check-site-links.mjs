/**
 * Scan all HTML files for local href links and report broken ones.
 * Usage: node scripts/check-site-links.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function findHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || entry === 'node_modules' || entry === 'scripts') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findHtmlFiles(full, files);
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function extractLocalHrefs(html) {
  const hrefs = [];
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1].trim();
    // Skip external, mailto, tel, anchors, javascript
    if (href.startsWith('http://') || href.startsWith('https://') ||
        href.startsWith('mailto:') || href.startsWith('tel:') ||
        href.startsWith('#') || href.startsWith('javascript:') ||
        href.startsWith('data:')) continue;
    hrefs.push(href);
  }
  return hrefs;
}

function resolveHref(htmlFile, href) {
  // Strip anchor and query
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return null; // pure anchor
  const base = dirname(htmlFile);
  return resolve(base, clean);
}

// Main
const htmlFiles = findHtmlFiles(ROOT);
let totalLinks = 0;
let brokenLinks = 0;
const broken = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const hrefs = extractLocalHrefs(html);
  const relFile = file.replace(ROOT, '').replace(/\\/g, '/');

  for (const href of hrefs) {
    const resolved = resolveHref(file, href);
    if (!resolved) continue;
    totalLinks++;

    // Check if target exists (as file or as directory with index.html)
    let exists = existsSync(resolved);
    if (!exists && !resolved.endsWith('.html')) {
      exists = existsSync(resolved + '/index.html') || existsSync(resolved + '.html');
    }
    if (!exists && statSync(dirname(resolved), { throwIfNoEntry: false })) {
      // Maybe it's a directory reference like "./formflow/"
      exists = existsSync(join(resolved, 'index.html'));
    }

    if (!exists) {
      brokenLinks++;
      broken.push({ file: relFile, href, resolved: resolved.replace(ROOT, '').replace(/\\/g, '/') });
    }
  }
}

console.log(`\nScanned ${htmlFiles.length} HTML files, ${totalLinks} local links\n`);

if (broken.length === 0) {
  console.log('✅ No broken links found!\n');
} else {
  console.log(`❌ ${brokenLinks} broken link(s):\n`);
  for (const b of broken) {
    console.log(`  ${b.file}`);
    console.log(`    href="${b.href}" → ${b.resolved}`);
    console.log();
  }
}

// Extra checks
console.log('--- Extra checks ---\n');

// Check for garbled characters
let garbled = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const relFile = file.replace(ROOT, '').replace(/\\/g, '/');
  // Common garbled patterns from encoding issues
  if (/鈥|锟|脙|脗|茅|碌|氓|忙/.test(html)) {
    console.log(`  ⚠️ Garbled chars in ${relFile}`);
    garbled++;
  }
}
if (!garbled) console.log('  ✅ No garbled characters found\n');

// Check title and meta description
let missingMeta = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const relFile = file.replace(ROOT, '').replace(/\\/g, '/');
  if (!/<title>/.test(html)) {
    console.log(`  ⚠️ Missing <title> in ${relFile}`);
    missingMeta++;
  }
  if (!/meta\s+name\s*=\s*["']description["']/.test(html)) {
    console.log(`  ⚠️ Missing meta description in ${relFile}`);
    missingMeta++;
  }
}
if (!missingMeta) console.log('  ✅ All pages have title and meta description\n');

// Check FAQ sections in product pages
const productPages = ['docforge', 'formcopy', 'formmerge', 'formflow', 'formguard', 'formnotifier', 'formranger'];
let faqIssues = 0;
for (const p of productPages) {
  const f = join(ROOT, p, 'index.html');
  if (!existsSync(f)) { console.log(`  ⚠️ Missing ${p}/index.html`); faqIssues++; continue; }
  const html = readFileSync(f, 'utf-8');
  const faqMatch = html.match(/Frequently asked questions/i);
  if (!faqMatch) { console.log(`  ⚠️ No FAQ section in ${p}/index.html`); faqIssues++; continue; }
  // Count FAQ items (feature cards with <strong>)
  const faqSection = html.substring(html.indexOf('Frequently asked questions'));
  const qCount = (faqSection.match(/<strong>/g) || []).length;
  if (qCount < 3) { console.log(`  ⚠️ Only ${qCount} FAQ items in ${p}/index.html (need 3+)`); faqIssues++; }
}
if (!faqIssues) console.log('  ✅ All product pages have 3+ FAQ items\n');

console.log('Done.');
