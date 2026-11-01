#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

function execRg(pattern, targets) {
  try {
    const out = execSync(`rg -l ${JSON.stringify(pattern)} ${targets.join(' ')}`, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return out.trim().split('\n').filter(Boolean);
  } catch (err) {
    if (err && err.status === 1) return [];
    throw err;
  }
}

const layout = read('app/layout.tsx');
assert(/title:\s*\{[\s\S]*template:/.test(layout) || /template:\s*['`]%s/.test(layout), 'layout missing title template');
assert(!/title:\s*['"]LAMT 2026['"]/.test(layout), 'layout still hardcodes title LAMT 2026');
assert(!/EmailPopup/.test(layout), 'EmailPopup still mounted in root layout');
assert(/lamt-theme'\)==='dark'/.test(layout) || /getItem\('lamt-theme'\)==='dark'/.test(layout), 'layout still follows OS dark by default');
assert(!/prefers-color-scheme: dark\)\.matches/.test(layout), 'layout still auto-darks from OS preference');

const nav = read('app/components/NavbarClient.tsx');
assert(/\/sponsorships/.test(nav) && /SPONSORSHIPS/.test(nav), 'Sponsorships missing from navbar as ALL CAPS');
assert(/aria-current/.test(nav), 'navbar missing aria-current');
assert(/tracking-wide/.test(nav) && /uppercase/.test(nav) && /text-2xl/.test(nav), 'navbar missing ALL-CAPS text-2xl gravitas');
assert(/label:\s*'HOME'/.test(nav) && /label:\s*'ARCHIVE'/.test(nav), 'navbar labels not ALL CAPS');
assert(!/dark:bg-black/.test(nav), 'navbar still flips to pure black in dark mode');
assert(/min-\[901px\]:flex/.test(nav), 'navbar desktop shell not gated at 901px');
assert(/max-\[900px\]:flex/.test(nav) || /min-\[901px\]:hidden/.test(nav), 'navbar mobile shell not gated at 900px');
assert(!/\bmd:flex\b/.test(nav) && !/\bmd:hidden\b/.test(nav), 'navbar still uses Tailwind md (768) instead of 900px');
assert(!/View Homepage/.test(read('app/admin/page.tsx')), 'admin still has View Homepage yeet');
assert(/Contact inbox/.test(read('app/admin/page.tsx')) && /Live help desk/.test(read('app/admin/page.tsx')), 'admin tabs not clarifying contact vs live help');

const home = read('app/components/HomeClient.tsx');
assert(!/SubscribeForm/.test(home), 'hero still embeds SubscribeForm');
assert(/getSettings|tournament_date|countdown/i.test(home), 'home missing admin-driven countdown wiring');
assert(/site_mode/.test(home), 'home missing site_mode gating for countdown');
assert(/hero-animate-words/.test(home), 'home brand H1 missing original word entrance');
assert(/LAMTBear\.png/.test(home) && !/photos\/hero-hall/.test(home), 'home hero should be bear-on-blue, not photo wash');
assert(/Student Discord/.test(home) && /homeButtonClass|border-2 border-white/.test(home), 'home Discord missing outlined button box');
assert(!/Email is for parents/.test(home), 'hero still has Discord/email helper verbosity');
assert(/A free UCLA-hosted math tournament/.test(home), 'hero missing one true supporting sentence');
assert(/whitespace-nowrap/.test(home), 'hero supporting sentence not locked to one line');
assert(!/Coming near the end of February/.test(home), 'hero still pitches Blue/Gold dates on the fold');
assert(!/dark:bg-black/.test(home), 'home hero still flips to pure black in dark mode');
assert(execRg('pending UCLA approval', ['app']).length === 0, 'pending UCLA approval still in app');

const page = read('app/page.tsx');
assert(/photos\/venue-mosaic/.test(page) && /photos\/hero-hall/.test(page) && /photos\/desk/.test(page), 'proof band missing album photos');

for (const photo of ['public/photos/hero-hall.jpg', 'public/photos/venue-mosaic.jpg', 'public/photos/checkin.jpg', 'public/photos/desk.jpg']) {
  assert(fs.existsSync(path.join(root, photo)), `missing photo asset: ${photo}`);
}

const emailTargets = ['app'];
if (fs.existsSync(path.join(root, 'out'))) emailTargets.push('out');
const emailHits = execRg('uclamathtournament@gmail\\.com', emailTargets);
assert(emailHits.length === 0, `old gmail still present: ${emailHits.join(', ')}`);
const gmailHits = execRg('@gmail\\.com', ['app', 'out'].filter((t) => fs.existsSync(path.join(root, t))));
assert(gmailHits.length === 0, `gmail leftover in app/out: ${gmailHits.join(', ')}`);
assert(execRg('info@lamt\\.net', ['app']).length > 0, 'info@lamt.net missing from app');
if (fs.existsSync(path.join(root, 'out/about.html'))) {
  const aboutOut = read('out/about.html');
  assert(aboutOut.includes('info@lamt.net'), 'out/about.html missing info@lamt.net');
  assert(!aboutOut.includes('uclamathtournament@gmail.com'), 'out/about.html still has old gmail');
}

const dark = read('app/components/DarkModeToggle.tsx');
assert(/stored === 'dark'/.test(dark), 'dark mode toggle not opt-in via localStorage');
assert(!/prefers-color-scheme/.test(dark), 'dark mode still follows OS preference by default');
assert(!/getHours\(/.test(dark), 'dark mode still uses clock hour');

const footer = read('app/components/FooterClient.tsx');
assert(/grid-cols-1[\s\S]*md:grid-cols-3/.test(footer), 'footer missing equal 3-col grid for true centering');
assert(!/md:justify-between/.test(footer), 'footer still uses space-between skew');
assert(/justify-self-center|items-center/.test(footer), 'footer social cluster not centered');
assert(!/dark:bg-black/.test(footer), 'footer still flips to pure black in dark mode');

const archive = read('app/archive/page.tsx');
assert(/hero-animate-words/.test(archive), 'archive title missing hero-animate-words');
assert(!/page-kicker|gold-rule|proof of the program/i.test(archive), 'archive still has kicker/gold-rule/fluff dek');
assert(/See our past tournament exams/.test(archive), 'archive missing original summary');
assert(/stagger-parent/.test(archive), 'archive categories missing stagger-parent');
assert(/'Shopping Round'/.test(archive), 'archive still labels Shopping without Round');

const publicPages = [
  'app/archive/page.tsx',
  'app/faq/page.tsx',
  'app/rules/page.tsx',
  'app/about/page.tsx',
  'app/sponsorships/page.tsx',
  'app/tournament/page.tsx',
  'app/live/page.tsx',
  'app/components/SponsorsSection.tsx',
];
for (const file of publicPages) {
  const src = read(file);
  assert(!/page-kicker/.test(src), `${file} still has page-kicker`);
  assert(!/gold-rule/.test(src), `${file} still has gold-rule`);
}

const sponsorships = read('app/sponsorships/page.tsx');
assert(/SponsorsSection/.test(sponsorships) && /getSponsorsByTier/.test(sponsorships), 'sponsorships page missing sponsor logos');

const rules = read('app/rules/page.tsx');
assert(/hero-animate-words/.test(rules), 'rules title missing hero-animate-words');

const engine = read('app/components/AnimationEngine.tsx');
assert(/js-motion/.test(engine), 'AnimationEngine missing js-motion gate for scroll reveals');
assert(/initNavMorph/.test(engine) && /initScrollReveals/.test(engine), 'AnimationEngine missing nav morph / scroll reveals');
assert(/initRipple/.test(engine), 'AnimationEngine missing button ripple');

const css = read('app/globals.css');
assert(/lamt-title-in/.test(css) && /lamt-rule-draw/.test(css), 'globals missing visible hero keyframes');
assert(/hero-animate-words\.hero-run \.word/.test(css), 'globals missing CSS title entrance');
assert(/program-rule\.rule-run/.test(css), 'globals missing CSS gold rule draw');
assert(/js-motion .*\.reveal:not\(\.is-visible\)/.test(css) || /js-motion \.reveal:not/.test(css), 'globals missing gated scroll reveal from-state');

assert(/program-rule/.test(read('app/components/HomeClient.tsx')), 'home missing program-rule for gold draw');
assert(/hero-run/.test(read('app/components/HomeClient.tsx')), 'home title missing hero-run class');

const live = read('app/live/page.tsx');
assert(!/TOURNAMENT_OVER/.test(live), 'live page still hardcodes TOURNAMENT_OVER');
assert(/site_mode/.test(live), 'live page not reading site_mode from settings');
assert(/Offseason/.test(live), 'live page missing Offseason label');
assert(/Between events|Tournament day is over|Reference schedule/.test(live), 'live status missing honest offseason copy');

const backend = read('backend/src/index.js');
assert(/'site_mode'/.test(backend), 'settings API missing site_mode allowlist');
const admin = read('app/admin/page.tsx');
assert(/site_mode|siteMode/.test(admin) && /Offseason/.test(admin) && /Tournament \/ countdown/.test(admin), 'admin Settings missing site mode toggle');
assert(/site_mode|siteMode/.test(home), 'home countdown not gated by site_mode');

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
