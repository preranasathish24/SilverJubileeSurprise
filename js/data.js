/* =============================================================================
   SILVER JUBILEE — Data & Colour Engine
   -----------------------------------------------------------------------------
   This is the SINGLE SOURCE OF TRUTH for the story.
   To add real content later you only touch THIS file:
     - point `photos[].src` at your image  (e.g. "media/2001/01.jpg")
     - write the `caption`
     - drop your file into  media/<year>/  and it appears automatically
   Everything else (animations, transitions, colour) is derived from here.
   ========================================================================== */

/* ---- helper: interpolate between two hex colours --------------------------- */
function hexLerp(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}
function lerp(a, b, t) { return a + (b - a) * t; }

/* ---- colour journey keyframes (by colour-chapter index 0..24) --------------
   Each stop: background gradient (bg1->bg2), sparkle/accent colour,
   and film-look filters (sepia amount + saturation). The engine interpolates
   smoothly between stops, so colour "blooms" gradually across all 25 years. */
const PALETTE_STOPS = [
  { at: 0,  bg1: '#1f140c', bg2: '#3d2817', accent: '#c9963f', sepia: 0.85, sat: 0.35 }, // 2001 wedding
  { at: 4,  bg1: '#2a1d12', bg2: '#4a3320', accent: '#cf9b6a', sepia: 0.70, sat: 0.50 }, // muted warm
  { at: 6,  bg1: '#2e2125', bg2: '#574049', accent: '#e3a9b6', sepia: 0.45, sat: 0.68 }, // pastel pink (Sammu)
  { at: 9,  bg1: '#2c2017', bg2: '#574028', accent: '#d79a55', sepia: 0.35, sat: 0.82 }, // earthy
  { at: 12, bg1: '#2c1c10', bg2: '#5c3818', accent: '#e0922f', sepia: 0.22, sat: 0.95 }, // warm amber
  { at: 15, bg1: '#311a10', bg2: '#6a3a18', accent: '#e58a3c', sepia: 0.12, sat: 1.05 }, // vibrant warm
  { at: 18, bg1: '#311414', bg2: '#6e2f2c', accent: '#d8534a', sepia: 0.06, sat: 1.15 }, // warm crimson
  { at: 21, bg1: '#2c1808', bg2: '#6e4012', accent: '#ecb23f', sepia: 0.02, sat: 1.20 }, // gold emerging
  { at: 24, bg1: '#241405', bg2: '#6b3e12', accent: '#ffd24a', sepia: 0.00, sat: 1.30 }, // full gold (Silver Jubilee)
];

function paletteForColourChapter(i) {
  let lo = PALETTE_STOPS[0], hi = PALETTE_STOPS[PALETTE_STOPS.length - 1];
  for (let s = 0; s < PALETTE_STOPS.length - 1; s++) {
    if (i >= PALETTE_STOPS[s].at && i <= PALETTE_STOPS[s + 1].at) {
      lo = PALETTE_STOPS[s]; hi = PALETTE_STOPS[s + 1]; break;
    }
  }
  const span = hi.at - lo.at || 1;
  const t = (i - lo.at) / span;
  return {
    bg1: hexLerp(lo.bg1, hi.bg1, t),
    bg2: hexLerp(lo.bg2, hi.bg2, t),
    accent: hexLerp(lo.accent, hi.accent, t),
    sepia: lerp(lo.sepia, hi.sepia, t),
    sat: lerp(lo.sat, hi.sat, t),
    grayscale: 0,
  };
}

/* B&W prologue palette — silver sparkles, full grain, no colour */
const PROLOGUE_PALETTE = {
  bg1: '#0c0c0d', bg2: '#2a2a2c', accent: '#c8c8cc',
  sepia: 0, sat: 0, grayscale: 1,
};

/* ---- photo slot helper ----------------------------------------------------
   `anim` ∈ popup | polaroid | kenburns | collage | zoom                       */
function photo(year, n, caption, anim) {
  return { src: `media/${year}/${String(n).padStart(2, '0')}.jpg`, caption, anim };
}

/* =============================================================================
   THE STORY  (prologue + 25 chapters)
   Captions below are sample/placeholder lines in the intended tone —
   Preru & Sammu replace them with the real words later.
   ========================================================================== */

const PROLOGUE = [
  {
    kind: 'prologue', year: 1974, label: '1974', title: 'Sathish Born',
    mood: 'Pure B&W · film grain', milestone: true,
    headline: 'A Star Is Born',
    subhead: 'Not just the star of our show. A real one, born to do wonders.',
    trick: 'starbirth',
    narration: 'Our story begins long before you knew us…',
    photos: [
      photo(1974, 1, 'Before anyone called him Appa.', 'kenburns'),
      photo(1974, 2, 'A whole life waiting to happen.', 'polaroid'),
    ],
  },
  {
    kind: 'prologue', year: 1982, label: '1982', title: 'Preethi Born',
    mood: 'B&W · softer grain', milestone: true,
    headline: 'Enter Another Star',
    subhead: 'Somewhere across the sky, the perfect match was lit.',
    trick: 'twinstars',
    narration: 'And somewhere, not far away, she arrived too.',
    photos: [
      photo(1982, 1, 'The other half of the story.', 'kenburns'),
      photo(1982, 2, 'Eight years apart, one destiny.', 'polaroid'),
    ],
  },
];

/* =============================================================================
   THE DUET — a split-screen interlude after both stars are introduced and
   right before the wedding: two halves of the stage, each quickly cycling
   photos of their younger selves, two lives drifting toward each other.
   Drop photos into media/before-him/ and media/before-her/ (up to 4 each).
   ========================================================================== */
const duetSlot = (side, n, caption) =>
  ({ src: `media/before-${side}/${String(n).padStart(2, '0')}.jpg`, caption, anim: 'duet' });

const DUET = {
  kind: 'duet', year: 2000, label: 'Before they met', title: 'Two Stars, Two Worlds',
  milestone: true, tag: 'The Years Before',
  narration: 'Two lives, growing up worlds apart… drifting toward each other.',
  palette: { bg1: '#1c1216', bg2: '#43282e', accent: '#e0b08a', sepia: 0.55, sat: 0.55, grayscale: 0 },
  him: {
    name: 'Sathish',
    photos: [
      duetSlot('him', 1, 'Little Sathish'),
      duetSlot('him', 2, 'Growing up'),
      duetSlot('him', 3, 'Almost there'),
      duetSlot('him', 4, 'On his way'),
    ],
  },
  her: {
    name: 'Preethi',
    photos: [
      duetSlot('her', 1, 'Little Preethi'),
      duetSlot('her', 2, 'Growing up'),
      duetSlot('her', 3, 'Almost there'),
      duetSlot('her', 4, 'On her way'),
    ],
  },
  photos: [],            // the standard player is bypassed for this scene
};

/* The magic act — special years get a showman's headline + a visual trick.
   trick ∈ starbirth | twinstars | union | hat | sparkleburst                  */
const ACTS = {
  2001: { h: 'Two Stars Collide',           s: 'And the real magic begins.',                 trick: 'union' },
  2002: { h: 'For Our Next Trick…',         s: 'From an empty hat, a brand new wonder appears.', trick: 'hat' },
  2007: { h: 'Abracadabra… Once More!',     s: 'The greatest trick of all: one more.',        trick: 'hat' },
  2011: { h: 'Ten Years of Magic',          s: 'A whole decade, and the spell holds strong.', trick: 'sparkleburst' },
  2014: { h: 'A Home, Conjured from Dreams', s: 'Four walls, built entirely of love.',         trick: 'sparkleburst' },
  2021: { h: 'Two Decades, Still Spellbound', s: 'Twenty years, and the trick never gets old.', trick: 'sparkleburst' },
  2025: { h: 'The Grand Finale Nears…',     s: 'One last sunrise before the reveal.',          trick: 'sparkleburst' },
};

/* base data for the 25 colour chapters (from the brief) */
const COLOUR_BASE = [
  { year: 2001, title: 'And So It Begins',        milestone: true,  tag: 'The Wedding' },
  { year: 2002, title: 'A New World',             milestone: true,  tag: 'Preru Arrives' },
  { year: 2003, title: 'Finding Our Feet',        milestone: false },
  { year: 2004, title: 'The Quiet Magic',         milestone: false },
  { year: 2005, title: 'Everyday Beautiful',      milestone: false },
  { year: 2006, title: 'Just the Three of Us',    milestone: false },
  { year: 2007, title: 'Then There Were Four',    milestone: true,  tag: 'Sammu Arrives' },
  { year: 2008, title: 'Full House',              milestone: false },
  { year: 2009, title: 'Wherever We Wandered',    milestone: false },
  { year: 2010, title: 'The Good Chaos',          milestone: false },
  { year: 2011, title: 'A Decade of Us',          milestone: true },
  { year: 2012, title: 'Still Laughing',          milestone: false },
  { year: 2013, title: 'Days Worth Keeping',      milestone: false },
  { year: 2014, title: 'Our Own Four Walls',      milestone: true,  tag: 'The House' },
  { year: 2015, title: 'Room to Grow',            milestone: false },
  { year: 2016, title: 'The Sweet Middle',        milestone: false },
  { year: 2017, title: 'Still Choosing Each Other',milestone: false },
  { year: 2018, title: 'The Warmth of Routine',   milestone: false },
  { year: 2019, title: 'Unshakeable',             milestone: false },
  { year: 2020, title: 'Together Through It All',  milestone: false },
  { year: 2021, title: 'Two Decades Deep',        milestone: true },
  { year: 2022, title: 'The Best Is Yet To Come', milestone: false },
  { year: 2023, title: 'Love, Louder Than Ever',  milestone: false },
  { year: 2024, title: 'A Year Dressed in Joy',   milestone: false },
  { year: 2025, title: 'Laughter & Happy Tears',  milestone: true },
];

/* sample captions per chapter (placeholder tone) + animation variety */
const SAMPLE_CAPTIONS = [
  ['Two hearts, one mandap.', 'The day everything changed.', 'Forever started here.'],
  ['The house got a little louder.', 'First cry, first miracle.'],
  ['Learning each other, slowly.', 'Tea, talks, and tiny feet.'],
  ['No drama. Just us.', 'The quiet years are the sweet ones.'],
  ['Ordinary days, extraordinary love.', 'Nothing fancy. Everything full.'],
  ['Three peas in a pod.', 'Sundays became sacred.'],
  ['And then there were four.', 'The circle complete.'],
  ['Double the noise, double the joy.', 'Chaos, beautifully.'],
  ['Scraped knees and big laughs.', 'Growing, all of us.'],
  ['The good kind of mess.', 'Loud house, full hearts.'],
  ['Ten years strong.', 'Still each other’s favourite.'],
  ['Laughing at the same old jokes.', 'Never running out of stories.'],
  ['Little eyes, watching love.', 'Teaching us as we taught them.'],
  ['Four walls we call ours.', 'Home, finally.'],
  ['Room to dream.', 'Every corner a memory.'],
  ['Right in the sweet middle.', 'Settled and warm.'],
  ['Choosing each other, again.', 'Every single day.'],
  ['The warmth of the everyday.', 'Routine never felt so good.'],
  ['Through anything.', 'Unshakeable, the two of you.'],
  ['Side by side, always.', 'Together through it all.'],
  ['Twenty years deep.', 'And still falling.'],
  ['The best is yet to come.', 'Just getting started.'],
  ['Louder than ever.', 'Love that fills a room.'],
  ['Almost at the silver.', 'So close now.'],
  ['One more sunrise together.', '25 years. And counting.'],
];

const ANIM_CYCLE = ['polaroid', 'kenburns', 'popup', 'zoom', 'collage'];

const CHAPTERS = COLOUR_BASE.map((c, i) => {
  const caps = SAMPLE_CAPTIONS[i] || ['A year to remember.'];
  const count = c.milestone ? 3 : 2;
  const photos = [];
  for (let n = 1; n <= count; n++) {
    photos.push(photo(c.year, n, caps[(n - 1) % caps.length], ANIM_CYCLE[(i + n) % ANIM_CYCLE.length]));
  }
  const act = ACTS[c.year];
  return {
    kind: 'chapter',
    index: i,                       // 0-based colour-chapter index
    chapterNo: i + 1,               // 1..25
    year: c.year,
    label: String(c.year),
    title: c.title,
    tag: c.tag || null,
    milestone: !!c.milestone,
    mood: c.milestone ? 'Milestone · richer & longer' : 'A chapter of the everyday',
    headline: act ? act.h : c.title,   // the showman's line for special years
    subhead: act ? act.s : null,
    trick: act ? act.trick : null,     // visual magic set-piece, if any
    narration: `${c.title}${c.tag ? ': ' + c.tag : ''}`,
    palette: paletteForColourChapter(i),
    photos,
  };
});

/* =============================================================================
   2026 — THE TEASER. After the 25th year, one more card appears: the story
   isn't over. Only tapping the wand here brings up the gift box reveal.
   ========================================================================== */
const TEASER = {
  kind: 'teaser', year: 2026, label: '2026', title: 'The Next Chapter',
  milestone: true, tag: 'To Be Continued',
  narration: 'Every great show saves its finest act for the very end…',
  palette: { bg1: '#241405', bg2: '#6b3e12', accent: '#ffd24a', sepia: 0, sat: 1.3, grayscale: 0 },
  photos: [],
};

/* full ordered scene list the engine plays through */
const SCENES = [...PROLOGUE.map(p => ({ ...p, palette: PROLOGUE_PALETTE })), DUET, ...CHAPTERS, TEASER];

/* opening + finale copy */
const COPY = {
  /* the sealed invitation — the very first thing a guest sees */
  inviteEyebrow: 'by special invitation',
  inviteNames: 'Preethi &amp; Sathi',
  inviteHint: 'break the wax seal',
  /* shown when a chapter's photos finish and the wand returns */
  readyCue: 'tap the wand to travel on',
  /* the pre-show — spoken in front of the CLOSED curtain, building curiosity */
  preshow: [
    { text: 'Ladies and gentlemen… gather close.', sub: '' },
    { text: 'What’s so special about today?', sub: 'ಇಂದು ಏನು ವಿಶೇಷ?' },
    { text: 'To uncover the secret… we must travel back in time.', sub: '' },
  ],
  wandCue: 'tap the wand to begin',
  finaleTitle: '25 Years & Counting…',
  finaleSub: '೨೫ ವರ್ಷಗಳ ಪ್ರೀತಿ',
  finaleWish: 'To Appa & Amma, thank you for showing us what forever looks like.\nHappy Silver Jubilee. With all our love, Preru & Sammu.',
};

/* ---- apply a generated photo manifest -------------------------------------
   media/manifest.json (built by tools/build-manifest.mjs) looks like:
     { "2001": [ { "file": "01.jpg", "caption": "…" }, … ], … }
   For any year that has real photos, replace the placeholder slots with them.
   Years not in the manifest keep their vintage placeholders, so the show is
   always complete while content is still being added.                         */
function applyManifest(manifest) {
  if (!manifest) return;
  SCENES.forEach(scene => {
    if (scene.kind === 'duet') {
      // the duet pulls from media/before-him/ and media/before-her/
      [['him', 'before-him'], ['her', 'before-her']].forEach(([side, key]) => {
        const list = manifest[key];
        if (!Array.isArray(list) || !list.length) return;
        scene[side].photos = list.slice(0, 4).map(p => ({
          src: `media/${key}/${p.file}`,
          caption: p.caption || '',
          anim: 'duet',
        }));
      });
      return;
    }
    const list = manifest[String(scene.year)];
    if (!Array.isArray(list) || !list.length) return;
    scene.photos = list.map((p, i) => ({
      src: `media/${scene.year}/${p.file}`,
      caption: p.caption || '',
      anim: p.anim || ANIM_CYCLE[(scene.year + i) % ANIM_CYCLE.length],
    }));
  });
}

/* ---- live captions from media/captions.csv --------------------------------
   The website reads captions.csv directly at runtime and overrides each photo's
   caption by its Year + Photo. So to change any caption you ONLY edit that CSV
   (column "Caption") — no rebuild, no code. The site picks it up on next load. */
function parseCsvLine(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === ',') { out.push(cur); cur = ''; }
    else if (c === '"') { q = true; }
    else cur += c;
  }
  out.push(cur);
  return out.map(s => s.trim());
}
function applyCaptions(csvText) {
  if (!csvText) return;
  const map = new Map();
  const lines = csvText.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {            // skip the header row
    if (!lines[i].trim()) continue;
    const [year, file, caption = ''] = parseCsvLine(lines[i]);
    if (year && file) map.set(`media/${year}/${file}`, caption);
  }
  const over = (arr) => { if (Array.isArray(arr)) arr.forEach(p => { if (map.has(p.src)) p.caption = map.get(p.src); }); };
  SCENES.forEach(scene => {
    over(scene.photos);
    if (scene.kind === 'duet') { over(scene.him && scene.him.photos); over(scene.her && scene.her.photos); }
  });
}

window.SJ_DATA = { SCENES, COPY, paletteForColourChapter, PROLOGUE_PALETTE, applyManifest, applyCaptions };
