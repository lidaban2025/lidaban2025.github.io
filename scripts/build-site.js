const fs = require('fs');
const path = require('path');

const root = process.cwd();
const out = path.join(root, '_site');
const includeDirs = [
  'assets',
  'docforge',
  'formcopy',
  'formflow',
  'formguard',
  'formmerge',
  'formnotifier',
  'formranger',
  'resources',
  'sheetformula'
];
const includeFiles = [
  '404.html',
  'apple-touch-icon.png',
  'choose-google-workspace-addon.html',
  'favicon.ico',
  'favicon.svg',
  'formsuite-tracking.js',
  'index.html',
  'install.html',
  'privacy.html',
  'product-inner.css',
  'product-landing.css',
  'review-after-first-success.html',
  'robots.txt',
  'setup-help.html',
  'site.webmanifest',
  'sitemap.xml',
  'social-card.svg',
  'support.html',
  'terms.html'
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyRecursive(source, destination) {
  if (!fs.existsSync(source)) return;
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

for (const dir of includeDirs) {
  copyRecursive(path.join(root, dir), path.join(out, dir));
}

for (const file of includeFiles) {
  copyRecursive(path.join(root, file), path.join(out, file));
}

console.log(`Built static assets in ${out}`);
