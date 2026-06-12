# DESIGN.md — Silver Jubilee Magic Show

> A single brand contract for the experience, inspired by the `DESIGN.md`
> discipline of [Open Design](https://github.com/nexu-io/open-design): every
> screen and animation should obey the rules below. Motion is treated **as
> data** — timings live in one place (`MOTION` in `js/app.js`,
> palette in `PALETTE_STOPS` in `js/data.js`) so the whole show stays coherent.

## 1. Concept
A magic show that is secretly a film screening of a 25-year love story. The
audience are guests at a theatre. A host speaks **in front of the closed
curtain** to build curiosity; tapping the wand travels back in time and the
curtain finally rises on the story. Suspense is sacred — the anniversary is
never revealed until the finale.

## 2. Voice & tone
- **The showman / magician.** Warm, theatrical, a little mischievous.
- Headlines are *act announcements*: "A Star Is Born", "For Our Next Trick…",
  "Two Stars Collide". Captions are intimate and human.
- English throughout, with Kannada accents at the emotional beats
  (opening question, finale).

## 3. Colour
- Journey: **B&W prologue → sepia → pastel → full gold** across 25 years,
  interpolated from `PALETTE_STOPS`. Never hard-code a chapter colour — add a
  stop and let it bloom.
- Core tokens: ink `#f4e9d4`, gold `#c9963f`, crimson `#7a0d0d`, paper `#f3e7cd`.
- Each year's accent also drives the wand sparkle and the time-counter glow.

## 4. Typography
- **Cinzel** — title cards, act labels, UI micro-text (engraved, theatrical).
- **Cormorant Garamond** — headlines, captions, body (warm, literary).
- **Caveat** — handwritten captions on film frames and wishes notes (personal).
- No generic system fonts.

## 5. Layout & space
- Mobile-first at 390px; full-screen scenes (100vh/vw), never scroll inside a
  chapter. Generous negative space; one focal object at a time.

## 6. Motion (as data — see `MOTION`)
- `travel` 1.5s · `travelBig` 2.6s · `titleHold` 1.7s · `trick` 3.2s · `photo` 3.1s.
- **The signature transition**: a film reel rolls while the **year ticks** from
  one value to the next — it must feel like the reel is carrying you across
  time. Unhurried, cinematic, eased (cubic ease-out).
- Photos enter as Polaroid-drop / Ken Burns / pop / zoom / collage — variety on
  purpose. Special years add a **trick** set-piece before the photos.
- Respect `prefers-reduced-motion`.

## 7. Interaction
- **The two wands are the only navigation.** No nav bar, no menu, no plain
  arrows. A tap casts a sparkle and fires the time-travel.
- Minimal by design — the guest watches; they do not operate.

## 8. The surprises (deliberate beats)
1. Curtain-closed pre-show → the question → "travel back in time".
2. The wand whisks you to 1974 as the curtain rises.
3. Per-year magic tricks (star born, twin stars, the union, bunny-from-hat).
4. The gift box → family video reveal.
5. The live wishes wall filling with love.
6. The confetti finale where the anniversary is *finally* named.

## 9. Anti-patterns (do NOT)
- ❌ A PowerPoint/slideshow feel, or a typical anniversary template.
- ❌ Next/previous buttons, hamburger menus, navigation chrome.
- ❌ Revealing the anniversary at the start.
- ❌ Auto-advancing chapters — the guest taps the wand.
- ❌ Rushed transitions or generic stock fonts.
- ❌ Hard-coded per-chapter colours instead of the palette engine.
