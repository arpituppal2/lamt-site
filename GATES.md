# Gates: home hero + scroll motion sequencing

OWNS: app/components/HomeClient.tsx, app/components/AnimationEngine.tsx, app/components/EmailSection.tsx, app/globals.css, scripts/verify-lamt-fixes.mjs, GATES.md

Scope: Hero animates title → rule → sub → CTAs in order (not all-at-once). Scroll reveals stagger top→down.

- [x] G1: Ordered home hero sequence is wired
  CHECK: node scripts/verify-lamt-fixes.mjs
  EXPECT: lamt fixes verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/arpituppal/Downloads/lamt-site; path=8f3eb10a912e/37 entries; EXPECT=matched; output-sha256=1e5d87725109de068db3e65875d52ae7531ba0a46a6d50c1433f86d2bdd3261a; output-bytes=31

- [x] G2: Production build succeeds
  CHECK: npm run build
  EXPECT: ○ /
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/arpituppal/Downloads/lamt-site; path=8f3eb10a912e/37 entries; EXPECT=matched; output-sha256=87da51b2c1ed01c2e50f7a29ce3fb6e3dc3e674b6ed35a5a1c270e3475ff9e20; output-bytes=1651
