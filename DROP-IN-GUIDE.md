# 🎬 Drop-in Guide — adding voiceovers, music & the video (no code)

You never edit any code. You just **add a file with the exact name, in the exact
folder**, and the website picks it up automatically. After you add a file, the
live site refreshes within about a minute.

There are **three** things you can add, plus one you can **edit** — the captions.

---

## ✍️ 0. Change any caption (the words under a photo)

All caption text lives in **one file: `media/captions.csv`**. The website reads it
**directly**, so to change what's written under any photo you just edit that file —
**no rebuild, no code.** Change it, save/commit, and the new caption shows on the
next refresh.

The file has one row per photo:

| Year | Photo  | Caption | Anim |
|------|--------|---------|------|
| 2003 | 01.jpg | Her first birthday, your first of so many. | kenburns |
| 2003 | 02.jpg | Three of us now, out in the world. | popup |

- Only edit the **Caption** column. Leave **Year** and **Photo** alone — that's how
  the site knows which picture the caption belongs to.
- Easiest: open it in **Google Sheets / Excel / Numbers**, edit the Caption cells,
  and export back as CSV (it handles commas/quotes for you).
- If you edit it as plain text and your caption contains a **comma**, wrap the whole
  caption in double quotes, e.g. `2003,01.jpg,"Tea, talks, and tiny feet.",kenburns`.
- Leave a caption blank to show the photo with no words.

---

## 1. 🎙️ Voiceovers (one per year)

A short clip (15–30 sec is perfect) that plays when that year's chapter opens.
While it plays, the background music automatically **dips down** and the voice is
**boosted**, so it's always clear. When you move to the next year, it stops.

**Where it goes — name it exactly `voice.mp3`:**

```
media/2002/voice.mp3
media/2003/voice.mp3
media/2007/voice.mp3
media/2014/voice.mp3
media/2017/voice.mp3
media/2019/voice.mp3
media/2024/voice.mp3
```

- The **folder is the year**, the file is always called **`voice.mp3`**.
- Want a voiceover for a different year? Same rule: `media/<year>/voice.mp3`.
- `.m4a` or `.ogg` also work (e.g. `voice.m4a`) if that's what your recorder gives
  you — but **`.mp3` is the safest** and plays everywhere.

---

## 2. 🎵 Background music (whole site) — *already set; swap if you like*

The site already plays a real, calm **flute** instrumental as its background bed —
gentle and warm, a soft pentatonic flute piece. It loops, automatically
**dips under voiceovers**, and goes **silent on the family-video page**.

The file lives at **`media/music/background.mp3`** — to use a different song
(a specific Rahman instrumental, anything), just **replace that one file** with
your own, same name:

```
media/music/background.mp3
```

- Keep the name `background.mp3` (or `.m4a` / `.ogg`).
- Pick an instrumental (no lyrics) so it never competes with the voiceovers.
- The 🔊 button (top-right) mutes/unmutes everything — music, voiceovers and effects.
- *Behind the scenes:* if this file is ever missing, the site falls back to an
  original generative score that evolves with the story — so there's always music.

> **Music credit:** the default track is *"Healing"* by **Kevin MacLeod**
> (incompetech.com), licensed CC-BY 4.0. If you swap in your own track, this no
> longer applies.

---

## 3. 🎁 The family video (the gift-box reveal)

Your compiled video that plays inside the gift box near the end. It keeps its own
sound; the background music steps aside while it plays.

**Where it goes — name it exactly `family.mp4`:**

```
media/finale/family.mp4
```

- Keep it **`.mp4`** (H.264) so phones play it smoothly.

---

## How to actually add the files

You're hosting on GitHub, so the easiest way on a phone or laptop:

1. Go to the repo on GitHub, branch **`claude/gifted-ride-oc8ngw`**, open the
   `silver-jubilee-v2/media/…` folder for where the file belongs.
2. **Add file → Upload files**, drag your clip in, and make sure its name matches
   exactly (e.g. `voice.mp3`). Commit.
3. Wait ~1 minute and refresh the live link — it'll be there.

That's it: **drop the file with the right name → commit → refresh.**

---

## Quick reference

| What | Exact path | Plays when |
|------|------------|-----------|
| **Edit a caption** | `media/captions.csv` (Caption column) | shows on next refresh |
| Voiceover for a year | `media/<year>/voice.mp3` | that chapter opens (music dips) |
| Background music | `media/music/background.mp3` | the whole site, looping softly |
| Family video | `media/finale/family.mp4` | the gift-box reveal (music pauses) |

**Tips**
- Voiceovers: aim for 15–30 sec, recorded somewhere quiet.
- Keep files reasonably small (a few MB each) so they load fast for 50+ guests.
- Names are case-sensitive on the web — use lowercase `voice.mp3`, `background.mp3`,
  `family.mp4` exactly as shown.
