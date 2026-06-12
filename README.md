# 🎭 Silver Jubilee — Magic Show: From Retro to Now (v2)

A surprise 25th-anniversary website for **Preethi & Sathi**, built as a *magic
show that is secretly a film screening*. The curtains rise, a magic wand is
tapped, and the viewer is pulled back through time — from a black-and-white
"before marriage" prologue through 25 colour chapters (one per year, colour
slowly blooming from sepia to full gold) — to a gift-box video reveal, a live
wishes wall, and a confetti finale.

## What's new in v2 (vs `../silver-jubilee`)

- **A sealed invitation opens the show** — a wax-sealed envelope with their
  names is the very first thing a guest sees; breaking the seal starts the
  pre-show.
- **The wands leave the stage while photos play.** They return — with a
  sparkle and a soft bell — only when a chapter finishes. Tapping anywhere on
  the stage "peeks" them back for a moment, like a film player's controls.
- **Photos cross-fade**: the next memory enters while the last one is still
  leaving, so the stage is never empty. Small film-frame dots show where you
  are within a year.
- **The stage breathes**: golden dust motes drift through the spotlight,
  tinted live by each year's palette.
- **The Duet** — a split-screen interlude after both stars are introduced and
  before the wedding: each half quickly cycles photos of their younger selves
  (drop up to 4 photos each into `media/before-him/` and `media/before-her/`).
- **A 2026 teaser card** after the 25th year — only tapping the wand there
  brings up the gift box and the family video.
- **Memories on photos** — every photo carries a quiet ✎ badge; tapping it
  holds the show and slides up a sheet where guests read pinned memories or
  add their own. A count chip shows when a photo already has memories.
  (Prototype storage: localStorage; production uses the same Supabase pattern
  as the wishes wall.)
- The progress pill shows just the year (`2004`), and the finale wish is
  addressed to Appa & Amma.

> This is the **working prototype**. The theme, the usage/flow, and the
> transitions are all built and tunable. Real photos, video, narration and music
> drop in later (see below) — no code changes needed.

---

## ▶ Run it

It's pure HTML/CSS/JS — no build step.

```bash
# from this folder
python3 -m http.server 8080
# then open http://localhost:8080
```

(Opening `index.html` directly works too, but a tiny server avoids browser
file-loading quirks for audio/video.)

**Controls**
- Tap the **wand** to begin · tap the **◀ ▶ side wands** (or ← → arrow keys) to move between chapters.
- **🔊** top-right toggles sound · **✦** opens the *Director's Panel* — a prototype-only jump menu to preview any scene. (It is not part of the real experience and is trivially removed.)

---

## ✨ What's built (the three things you asked to focus on)

| Focus | What's in the prototype |
|---|---|
| **Theme (the magic act)** | The show is the through-line everywhere. A **pre-show** is spoken in front of the *closed* curtain to build curiosity; tapping the wand travels back in time and the curtain finally rises. Special years are staged as **magic tricks** — "A Star Is Born", twin stars, the wedding's "Two Stars Collide", and the signature **bunny-from-a-hat** as each child arrives — each with a showman's headline. Vintage Bollywood/Polaroid treatment throughout: film grain, sepia title cards, Polaroid colour frames, sprocket-hole B&W film strips. |
| **Usage / flow** | Pre-show → time-travel → Prologue (1974, 1982) → 25 colour chapters → Gift Box reveal → Wishes Wall → Finale. Full-screen, no scrolling inside chapters, "Year X of 25" progress, milestone glow. **Two wands are the only navigation** (no arrows/menus). |
| **Transitions** | The signature **time-travel transition**: a film reel rolls while the **year ticks** across time (2026→1974 on the opening sweep), so it feels like the reel carries you between years. Deliberately slowed/cinematic; timings centralised in `MOTION` (see `DESIGN.md`). Photos enter via Polaroid-drop / Ken Burns / pop-up / zoom / collage. Colour blooms B&W→gold across 25 years via one interpolation function. |

See **`DESIGN.md`** for the full brand contract (palette, type, motion, voice, anti-patterns) — the discipline borrowed from the Open Design `DESIGN.md` approach.

---

## 🖼 Adding the photos (no code editing)

**See [`PHOTOS.md`](PHOTOS.md) for the full guide.** In short — **drop, caption, run:**

1. Drop each photo into its year folder (`media/2001/01.jpg`, `02.jpg`, …). The
   folder is the year; the number is the on-screen order.
2. Run `npm run media` — resizes big photos to web size and rebuilds the show
   (`media/manifest.json`), and lists every photo in `media/captions.csv`.
3. Fill the **Caption** column in `media/captions.csv`, then `npm run manifest`.

Years you haven't filled yet keep their vintage "undeveloped film" placeholders,
so the show is always complete while you work through 25 years at your own pace.
A photo's entrance animation (Polaroid drop / Ken Burns / pop / zoom / collage)
is assigned automatically; ask if you want a specific one pinned.

### The gift-box video
Drop your compiled family video at **`media/finale/family.mp4`**. Until then a
labelled placeholder shows in the frame.

### Narration & music (production)
The prototype uses synthesised sound effects (Web Audio) so the magic is audible.
For the real thing, load files with **Howler.js** — one narration track and one
era song per chapter, played from `renderScene()`. Narration louder, music under.

### Colours
The B&W → gold journey is controlled by `PALETTE_STOPS` in `data.js`. Nudge a
stop's `sepia` / `sat` / `accent` and every in-between year re-interpolates
automatically.

---

## 🌐 Going live (free, per the brief)

- **Hosting:** Cloudflare Pages — unlimited bandwidth on the free tier (ideal for
  50+ people loading media at once). Drag this folder in, or connect the repo.
- **Wishes Wall (real-time):** Supabase. The prototype stores wishes in
  `localStorage`; swap `onWish()` / `seedWishes()` in `app.js` for a Supabase
  table + realtime subscription:

  ```js
  // insert
  await supabase.from('wishes').insert({ name, msg });
  // live for all 50+ users
  supabase.channel('wishes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' },
        ({ new: w }) => pinWish(w, 0, true))
    .subscribe();
  ```

  ⚠️ Supabase free projects pause after 7 days idle — send one test wish 1–2 days
  before the event (or set a GitHub Actions cron ping) so it's awake on the day.
- **Video:** Cloudflare Stream (free 1,000 min) is mobile-optimised for the reveal.

---

## 📁 Structure

```
silver-jubilee/
├── index.html         # stage shell
├── css/styles.css     # the entire vintage / magic-show look
├── js/
│   ├── data.js        # ← THE STORY. edit this to add content
│   ├── audio.js       # synthesised SFX (placeholder for narration/music)
│   └── app.js         # engine: stage machine, photo player, transitions
└── media/
    ├── <year>/        # drop photos here (01.jpg, 02.jpg, …)
    └── finale/        # family.mp4
```

---

## 🔜 Suggested next steps
1. Replace sample captions with Preru & Sammu's real words in `data.js`.
2. Drop the first batch of real photos into `media/<year>/`.
3. Decide the wedding colour-burst style and gift-box style (the brief lists options).
4. Wire Supabase for the live wishes wall.
5. Record narration; add Howler.js playback.
6. Deploy to Cloudflare Pages.

*Made with love for Preethi & Sathi — 25 years and counting.*
