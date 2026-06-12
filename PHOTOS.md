# 📸 Adding the photos (the simple way)

You never edit code. You do three things: **drop, caption, run.**

---

## 1. Drop each photo into its year folder
Inside `media/` there is one folder per year:

```
media/1974/   media/1982/   media/2001/   …   media/2025/   media/finale/
```

Put each photo in the folder for **the year it belongs to**. Name the files so
they play in the order you want — easiest is to number them:

```
media/2001/01.jpg
media/2001/02.jpg
media/2001/03.jpg
```

> The folder decides the **year**. The number decides the **order on screen**.
> However many you drop in is however many that chapter shows. That's it.

Any common format works (JPG, PNG, WEBP, HEIC→export as JPG first).
The family video goes in `media/finale/` as **`family.mp4`**.

## 2. Run one command
From inside the `silver-jubilee` folder:

```bash
npm install        # one time only (installs the photo resizer)
npm run media      # resizes big photos + rebuilds the show
```

`npm run media` does two things:
- **Resizes/compresses** any large photos to web size so the site stays fast
  for 50+ guests (your originals are untouched — only the copies in `media/`).
- **Rebuilds** `media/manifest.json` (what the site reads) and updates
  `media/captions.csv` so **every photo you added now has a row** to caption.

*(No Node installed? You can skip resizing and just run `npm run manifest`, or
ask me to run it.)*

## 3. Write the captions in one place
Open **`media/captions.csv`** (Excel, Google Sheets, or Numbers). After step 2
it lists every photo, one per row:

| Year | Photo  | Caption |
|------|--------|---------|
| 2001 | 01.jpg | Two hearts, one mandap. |
| 2001 | 02.jpg | The day everything changed. |
| 2001 | 03.jpg |  |

Type your tagline in the **Caption** column. Leave any blank — that photo simply
shows with no caption. Preru & Sammu can split the sheet between them.

Then run `npm run manifest` once more to pull the captions in.

---

## That's the whole loop
**drop photos → `npm run media` → fill captions → `npm run manifest` → commit & push.**

- Years you haven't filled yet keep their tasteful vintage placeholders, so the
  show is always complete while you work through 25 years at your own pace.
- Optional: copy `tools/github-action.example.yml` to
  `.github/workflows/` (repo root) so even photos dragged in through the GitHub
  website get the manifest rebuilt automatically.

## Tips
- **Order:** prefix filenames with numbers (`01_`, `02_`…) — or just `01.jpg`.
- **Milestone years** (wedding, the kids arriving, the house, the jubilee) shine
  with a few more photos; quiet years can be just one or two.
- **Keep originals** somewhere safe; `media/` holds the web-sized copies.
- Want a different on-screen animation for a photo? It's automatic, but I can
  pin a specific one (Polaroid drop / Ken Burns / pop / zoom) on request.
