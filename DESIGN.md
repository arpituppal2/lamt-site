---
name: LAMT
description: The Los Angeles Math Tournament's public and tournament-day web system.
colors:
  bruin-blue: "#2774AE"
  bruin-blue-deep: "#003B5C"
  sky-blue: "#DAEBFE"
  victory-gold: "#FFD100"
  victory-gold-deep: "#FFB81C"
  paper: "#F4F8FC"
  surface-white: "#FFFFFF"
  surface-mist: "#EAF3FB"
  ink: "#08233B"
  ink-secondary: "#315B7B"
  ink-muted: "#5C7891"
  rule-blue: "#8BB8E8"
  night-bg: "#031522"
  night-surface: "#071D2D"
  night-raised: "#0B2A42"
  night-ink: "#FFFFFF"
  night-ink-secondary: "#C7E0F6"
  night-rule: "rgba(255, 209, 0, 0.52)"
  night-divider: "rgba(255, 209, 0, 0.26)"
  error-brick: "#B33A2B"
  dispute-rust: "#9F2A18"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2.8rem, 8vw, 7rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, Arial, Helvetica, sans-serif"
    fontSize: "4rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0em"
  title:
    fontFamily: "Plus Jakarta Sans, Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0em"
  body:
    fontFamily: "Plus Jakarta Sans, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  body-large:
    fontFamily: "Plus Jakarta Sans, Arial, Helvetica, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  label:
    fontFamily: "Plus Jakarta Sans, Arial, Helvetica, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.25rem"
  space-6: "1.5rem"
  space-8: "2rem"
  space-10: "2.5rem"
  space-12: "3rem"
  space-16: "4rem"
  space-20: "5rem"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.bruin-blue}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
    height: "2.75rem"
  button-outline-hover:
    backgroundColor: "{colors.victory-gold}"
    textColor: "{colors.bruin-blue-deep}"
  button-filled:
    backgroundColor: "{colors.bruin-blue}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
    height: "2.75rem"
  button-filled-hover:
    backgroundColor: "{colors.victory-gold}"
    textColor: "{colors.bruin-blue-deep}"
  button-gold:
    backgroundColor: "{colors.victory-gold}"
    textColor: "{colors.bruin-blue-deep}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
    height: "3.25rem"
  button-gold-hover:
    backgroundColor: "{colors.bruin-blue}"
    textColor: "{colors.night-ink}"
  button-on-band:
    backgroundColor: "transparent"
    textColor: "{colors.victory-gold}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
    height: "2.75rem"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.6rem 0.1rem"
  input-underline-dark:
    backgroundColor: "transparent"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.none}"
    padding: "0.6rem 0.1rem"
  tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.15rem 0.85rem"
---

# Design System: LAMT

## Overview

**Creative North Star: "The Tournament Program"**

The system behaves like a printed tournament program handed out at a UCLA math event: a blue cover, a bear mark, gold rules separating the sections, and a two-column body where the left column names the section and the right column carries the detail. It is editorial rather than app-like. Pages are composed from full-width bands, thin rules, schedule tables, and dense type — not from cards floating on a canvas.

The campus energy comes from scale and contrast: oversized display type on a saturated Bruin blue field, gold used like a printed marker, and numbers set tabular so times and countdowns line up. The structure stays institutional and calm, so the energy reads as confidence rather than noise. Warmth comes from direct copy, generous white space, and the bear — not from soft shapes or decoration.

The same grammar covers public pages, the tournament-day operations page, and the admin panel. Operate surfaces get denser tables and status blocks; public pages get more air and larger type. Both keep the sharp corners, the left-label column, and the gold marker.

**Key Characteristics:**
- Sharp 90° corners on every control and container; zero decorative rounding.
- UCLA blue fields and gold marker rules, with cool paper neutrals for reading.
- Two-column section grammar: narrow left label, wide right content.
- Flat surfaces; depth comes from tonal steps and 1–4px rules, never from card shadows.
- Tabular numerals and schedule tables for anything time-based.
- A deliberate dark mode that swaps paper for deep navy and keeps gold as the rule color.

## Colors

The palette is UCLA institutional: a saturated Bruin blue field, a single victory gold marker, and a cool paper neutral. There is no decorative third hue; brick and rust appear only for errors and schedule disputes.

### Primary
- **Bruin Blue** (#2774AE): the field color. Header band, hero background, primary buttons, link text, focus-adjacent borders, and the live page's active chat bubbles.
- **Bruin Blue Deep** (#003B5C): the printed-ink blue. Email popup panel, deep slabs, hover text on gold, and the registration band.

### Secondary
- **Victory Gold** (#FFD100): the marker. Four-pixel rules, kickers, active underlines, hover fills, and the registration deadline numbers.
- **Victory Gold Deep** (#FFB81C): the live-status dot and saved confirmations — a warmer gold for status, not for large surfaces.

### Tertiary
- **Sky Blue** (#DAEBFE): secondary text on blue fields, dark-mode muted text, and on-dark placeholders. It is the readable counterpart to white on Bruin blue.

### Neutral
- **Paper** (#F4F8FC): the default page background.
- **Surface White** (#FFFFFF): reading surfaces and sponsor logo boxes.
- **Surface Mist** (#EAF3FB): the email-capture band and quiet secondary sections.
- **Ink** (#08233B): primary body and heading text on paper.
- **Ink Secondary** (#315B7B): long-form copy, table cells, and summaries.
- **Ink Muted** (#5C7891): labels, timestamps, and tertiary metadata.
- **Rule Blue** (#8BB8E8): control borders and strong table rules.
- **Night Background** (#031522): dark-mode page field.
- **Night Surface** (#071D2D): dark-mode reading surface.
- **Night Raised** (#0B2A42): dark-mode secondary surface and progress tracks.
- **Night Ink** (#FFFFFF) and **Night Ink Secondary** (#C7E0F6): dark-mode text pair.
- **Night Rule** (rgba(255, 209, 0, 0.52)) and **Night Divider** (rgba(255, 209, 0, 0.26)): gold-tinted rules on dark.
- **Error Brick** (#B33A2B): form errors and destructive actions.
- **Dispute Rust** (#9F2A18): schedule-change reasons on the live page.

### Named Rules

**The Gold Marker Rule.** Gold is a marker, not a surface. Use it for rules, underlines, kickers, live status, and one decisive CTA. Keep it under roughly 10% of any screen; its rarity is what makes it read as UCLA.

**The Blue Field Rule.** Large areas of Bruin blue or near-black carry identity. Content sits on paper or night surfaces; blue is for bands, headers, footers, and actions, not for every panel.

**The Paper Default Rule.** Reading surfaces default to Paper or Surface White. If a section needs separation, use a tonal step or a rule before reaching for color.

## Typography

**Display Font:** Plus Jakarta Sans (with Arial, Helvetica, sans-serif)
**Body Font:** Plus Jakarta Sans (with Arial, Helvetica, sans-serif)

**Character:** One geometric-humanist family carries the whole system: wide apertures, a high x-height, and enough weight range to go from quiet body copy to a 7rem hero. It reads contemporary and academic without becoming bookish. Display sizes tighten their leading; labels open up with uppercase and tracking.

### Hierarchy
- **Display** (700, clamp(2.8rem, 8vw, 7rem), 1.05, -0.02em): the homepage hero only; white on Bruin blue.
- **Headline** (800, 4rem, 1.1): page titles such as "Rules", "Archive", and "LAMT Admin Panel". Cap at about 15 characters per line.
- **Title** (800, 1.5rem, 1.1): section titles, panel headers, and table-adjacent headings.
- **Body** (400, 1rem, 1.6): default reading size.
- **Body Large** (400, 1.125rem, 1.65): page summaries and long-form section copy; keep lines near 65–72 characters.
- **Label** (800, 0.75rem, 0.08em, uppercase): kickers, form labels, table-adjacent metadata, and status labels.

The responsive scale shrinks the top end rather than reflowing every size: at 900px the 4rem headline becomes 3rem and the hero becomes 3.6rem; at 640px they become 2.35rem and 2.65rem.

### Named Rules

**The One Family Rule.** Plus Jakarta Sans carries display, body, and labels. Do not introduce a serif or a second sans; the academic tone comes from scale, weight, and spacing.

**The Tight Display Rule.** Set display and headline leading at 1–1.1 and keep tracking at zero or slightly negative. Never add letter-spacing to lowercase display type.

## Layout

The page is a fluid editorial grid with 3% side gutters, not a centered card. `page-shell` provides 4rem of top padding and 5rem of bottom padding. The navigation and footer cap at 1600px; long-form content caps around 72 characters per line.

The signature composition is the **two-column row**. `page-hero` splits 26% / 1fr with a 3% gap, aligns to the bottom, and closes with a 4px gold rule. `section-row` splits 24% / 1fr with a 3% gap, adds 2.5rem of vertical padding, and separates rows with a 1px divider. The left column holds the kicker or section title; the right column holds the content. The home page is the exception: a full-viewport blue hero with a max-width 5xl content block, followed by full-width bands.

Vertical rhythm comes from the 4px-based spacing scale, with sections at 2.5rem, page padding at 4–5rem, and dense panels at 0.75–1.5rem. Tables scroll horizontally rather than crushing columns. At 900px every two-column row collapses to one column; at 640px buttons go full width and the type scale tightens again.

### Named Rules

**The Two-Column Rule.** On content pages, put the section label in the narrow left column and the substance in the wide right column. Do not center section headers or body copy.

**The 3% Gutter Rule.** Side breathing room is 3% of the viewport, not a fixed pixel value. The layout should feel printed and edge-aware, not boxed.

## Elevation & Depth

This system is flat by default. There are no card shadows, no floating panels, and no glassmorphism. Depth is tonal: Paper → Surface White → Surface Mist in light mode, Night Background → Night Surface → Night Raised in dark mode, separated by 1px dividers, 2px control borders, and 4px gold rules. Translucent overlays are used only to let the hero bear and grid texture read through the blue field.

The single shadow exception is the footer's social chips: `shadow-md` at rest and `shadow-xl` on hover, paired with `scale-110`. Treat that as a small physical affordance, not as permission to shadow content cards.

### Named Rules

**The No Floating Card Rule.** Content never sits in a rounded, shadowed card. Group with rules, tonal bands, and spacing. If a surface needs to lift, it is probably a control, not a content container.

## Shapes

The form language is square and printed. Buttons, inputs, panels, popups, chat bubbles, tables, and sponsor frames all use a 0 radius. Borders do the work of shape: 2px for controls and strong dividers, 1px for row dividers, 4px for the page-hero rule and the short gold marker. There are no clipped corners, blobs, or diagonal cuts.

The only rounded forms are functional circles: the footer's 40px social chips, the live-status dot, and the short countdown pulse bar. They read as punctuation against the square system.

### Named Rules

**The Square Corner Rule.** If a surface is rectangular, its radius is zero. Rounding a button, input, panel, or card breaks the printed-program metaphor.

## Components

### Buttons

**Character:** precise and restrained; a printed form control rather than a pill.

- **Shape:** 0 radius, 2px border, 2.75rem minimum height, 0.75rem × 1.25rem padding, 0.875rem type at 800 weight, single-line.
- **Primary (`.btn-filled`):** Bruin blue fill, white text. Hover flips to Victory Gold fill with Bruin Blue Deep text. Active scales to 0.97.
- **Outline (`.btn-outline`):** transparent fill, Bruin blue border and text. Hover fills Victory Gold with deep blue text.
- **Gold (`.btn-gold`):** Victory Gold fill, Bruin Blue Deep text, 3.25rem height, 1rem × 1.5rem padding, 1rem type. Hover flips to Bruin blue with white text. This is the email-capture CTA.
- **On band (`.btn-on-band`):** transparent fill, Victory Gold border and text for blue surfaces. Hover fills gold with deep blue text.
- **Home hero:** transparent with a 2px white border and white text; hover fills white with Bruin blue text.
- **Focus:** a 3px Victory Gold outline with a 3px offset, globally.

### Inputs / Fields

- **Style:** underline only — no box, no radius, no fill. A 2px bottom border in Rule Blue, transparent background, 0.6rem × 0.1rem padding, inherited body size.
- **Focus:** the bottom border shifts to Victory Gold. There is no glow or box shadow.
- **On dark:** the border becomes Victory Gold at 55% opacity, text turns white, and the placeholder becomes a translucent Sky Blue.
- **Labels:** 0.75rem, 800 weight, uppercase, 0.08em tracking, Ink Muted.
- **Error:** Error Brick text below the field; the field border may switch to Error Brick.

### Tables

- **Style:** full width, no outer border, 1px row dividers, 2px strong rule under the header.
- **Header:** 0.75rem, 800 weight, Ink Muted, 0.06em tracking.
- **Cells:** 1rem top/right/bottom padding, zero left padding so the first column aligns with the section edge; vertical alignment top.
- **Last row:** divider removed.
- **Data:** times and countdowns use tabular numerals; changed schedule rows show the original time struck through and the reason in Dispute Rust.

### Navigation

- **Shape:** a full-width Bruin blue band (black in dark mode), 7.875rem tall on desktop, with the bear mark at 85px and the wordmark on mobile.
- **Links:** 1.5rem, 800 weight, uppercase, white, spaced with `clamp(1.75rem, 4.5vw, 4.5rem)`. Hover fades to 70% opacity; the active link gets a 3px Victory Gold pill underline that morphs between links.
- **Mobile:** bear and wordmark centered, square hamburger button on the right, dropdown with 1.125rem uppercase links; the menu closes on navigation.

### Containers

- **No cards.** Panels are transparent with a 2px header rule and generous internal spacing.
- **Sponsor frames:** the one framed container — Surface White with a 2px tier-colored border, 1.25rem padding, and logo heights of 220px gold, 168px silver, 132px bronze, and 96px friends.
- **Bands:** full-width tonal sections (Paper, Surface Mist, Bruin Blue, Bruin Blue Deep) separated by 2px or 4px gold rules.

### Signature Components

**Countdown.** A row of large tabular numerals with 0.625rem uppercase labels beneath. The tournament countdown is white on blue; the registration countdown is Victory Gold. Columns are separated by a 1px white/20 rule.

**Live status.** A two-column block: status and current event on the left, the full schedule table on the right. A small Victory Gold dot and the word "Live" sit at the top right; a 1.5px gold progress bar tracks the current event against Surface Raised.

**Email popup.** A fixed 21rem panel in Bruin Blue Deep at the bottom right, square corners, 1.5rem padding, a Sky Blue kicker, white heading, and the gold email CTA. Dismissed with an explicit close button or Escape.

## Do's and Don'ts

### Do:
- **Do** keep every rectangular surface at 0 radius and use 2px borders for controls.
- **Do** use the two-column grammar: label left, substance right.
- **Do** use Victory Gold as a marker on rules, kickers, active states, and one CTA.
- **Do** set times, countdowns, and schedule numbers in tabular numerals.
- **Do** collapse to one column at 900px and make buttons full width at 640px.
- **Do** keep the global focus ring: 3px Victory Gold, 3px offset.
- **Do** use tonal steps and rules for separation before adding any shadow.

### Don't:
- **Don't** round buttons, inputs, panels, popups, or cards; the system is square.
- **Don't** add drop shadows or glassmorphism to content; the footer social chips are the only exception.
- **Don't** introduce a second typeface, a serif, or a decorative display face.
- **Don't** use gradients as decoration; grid textures and tonal bands are the only atmospheric devices.
- **Don't** center body copy or section headers on content pages.
- **Don't** let gold cover more than roughly a tenth of a screen; it loses its marker role.
- **Don't** place body copy in Bruin blue on a blue field; use white or Sky Blue.
- **Don't** invent statistics, testimonials, or future-event claims; the visual system must not imply proof the product does not have.
