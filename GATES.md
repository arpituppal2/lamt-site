# Gates: LAMT perfect-site fix pass

OWNS: app/**, public/**, GATES.md, scripts/**, .impeccable/**

Scope: Ship P0–P2 craft/IA/trust/conversion fixes so LAMT clears peer contest bar.

- [x] G1: Production build succeeds with sponsorships route
  CHECK: npm run build
  EXPECT: ○ /sponsorships
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/arpituppal/Downloads/lamt-site; path=8f3eb10a912e/37 entries; EXPECT=matched; output-sha256=df02c2e3400a5e46133680ecfc05dc945d8b3de2b873c03ed69830d80e6ff1e4; output-bytes=1651

- [x] G2: Root metadata uses title template, not static LAMT 2026 only
  CHECK: node scripts/verify-lamt-fixes.mjs
  EXPECT: lamt fixes verification passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/arpituppal/Downloads/lamt-site; path=8f3eb10a912e/37 entries; EXPECT=matched; output-sha256=1e5d87725109de068db3e65875d52ae7531ba0a46a6d50c1433f86d2bdd3261a; output-bytes=31
