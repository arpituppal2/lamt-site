#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

const layout = read('app/layout.tsx');
assert(/title:\s*\{[\s\S]*template:/.test(layout) || /template:\s*['`]%s/.test(layout), 'layout missing title template');
assert(!/title:\s*['"]LAMT 2026['"]/.test(layout), 'layout still hardcodes title LAMT 2026');
assert(!/EmailPopup/.test(layout), 'EmailPopup still mounted in root layout');

const nav = read('app/components/NavbarClient.tsx');
assert(/\/sponsorships/.test(nav) && /SPONSORSHIPS|Sponsorships/i.test(nav), 'Sponsorships missing from navbar');
assert(/aria-current/.test(nav), 'navbar missing aria-current');

const home = read('app/components/HomeClient.tsx');
assert(!/SubscribeForm/.test(home), 'hero still embeds SubscribeForm');
assert(/getSettings|tournament_date|countdown/i.test(home), 'home missing admin-driven countdown wiring');

const dark = read('app/components/DarkModeToggle.tsx');
assert(/prefers-color-scheme|matchMedia/.test(dark), 'dark mode still clock-based');
assert(!/getHours\(/.test(dark), 'dark mode still uses clock hour');

const tournament = read('app/tournament/page.tsx');
assert(!/This page is outdated/i.test(tournament), 'tournament page still says outdated');

const faq = read('app/faq/page.tsx');
assert(!/Click "Register Now" on the home page/i.test(faq), 'FAQ still points at missing Register Now CTA');

const sub = read('app/components/SubscribeForm.tsx');
assert(/htmlFor=/.test(sub) && /id=/.test(sub), 'SubscribeForm missing htmlFor/id');

const pages = [
  'app/about/layout.tsx',
  'app/archive/layout.tsx',
  'app/rules/layout.tsx',
  'app/faq/layout.tsx',
  'app/sponsorships/layout.tsx',
  'app/tournament/layout.tsx',
  'app/live/layout.tsx',
  'app/admin/layout.tsx',
];
for (const p of pages) {
  assert(fs.existsSync(path.join(root, p)), `missing page metadata layout: ${p}`);
}

if (failures.length) {
  console.error(failures.map((f) => `FAIL: ${f}`).join('\n'));
  process.exit(1);
}

console.log('lamt fixes verification passed');
