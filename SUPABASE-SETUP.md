# ☁️ Making wishes & photo memories LIVE (shared by everyone)

By default, the **Wishes Wall** and the **✎ memories on photos** save only in each
person's own browser. To make them **shared and live** — so every guest sees each
other's wishes and photo notes appear in real time — connect a free **Supabase**
project. You do this **once**, and you only ever paste **two values into one file**.

---

## The one file you edit
**`js/config.js`** — it has exactly two blanks:

```js
window.SJ_CONFIG = {
  SUPABASE_URL: '',        // ← paste your Project URL
  SUPABASE_ANON_KEY: '',   // ← paste your anon public key
};
```

Leave them blank → the site still works (browser-only). Fill them → it goes live.

---

## Step by step (about 5 minutes)

**1. Create a free project**
Go to [supabase.com](https://supabase.com) → sign in → **New project**. Pick any
name and a region near your guests. Wait ~2 min for it to finish setting up.

**2. Create the tables (copy-paste, run once)**
Open **SQL Editor** (left sidebar) → **New query** → paste all of this → **Run**:

```sql
-- Wishes wall
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 60),
  msg  text not null check (char_length(msg)  <= 300),
  created_at timestamptz not null default now()
);
alter table public.wishes enable row level security;
create policy "read wishes" on public.wishes for select using (true);
create policy "add a wish"  on public.wishes for insert with check (true);

-- Memories pinned to individual photos
create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  photo text not null,                 -- e.g. 'media/2001/03.jpg'
  name  text not null check (char_length(name) <= 60),
  msg   text not null check (char_length(msg)  <= 400),
  created_at timestamptz not null default now()
);
alter table public.memos enable row level security;
create policy "read memos" on public.memos for select using (true);
create policy "add a memo" on public.memos for insert with check (true);

-- Make new wishes / memories appear instantly for everyone (realtime)
alter publication supabase_realtime add table public.wishes;
alter publication supabase_realtime add table public.memos;
```

*(If the last two lines say a table is "already a member", that's fine — ignore it.)*

**3. Copy your two values**
Left sidebar → **Project Settings → API**:
- **Project URL** → goes in `SUPABASE_URL`
- **Project API keys → `anon` `public`** (a long `eyJ...` string) → goes in `SUPABASE_ANON_KEY`

**4. Paste them into `js/config.js`** and save/commit. That's it — wishes and photo
memories now save to the cloud and update live for all guests.

---

## Good to know
- ✅ **The anon key is safe to publish.** It's designed for the browser; the SQL above
  only lets people **read** and **add** wishes/memories — nobody can edit or delete
  others' entries, and there's no access to anything else.
- 🚫 **Never** paste the **`service_role`** (secret) key here — only the `anon public` one.
- 💤 **Free projects pause after ~7 days idle.** Send one test wish a day or two before
  the event so it's awake on the day.
- 🔁 Want to go back to browser-only? Just blank out the two values again.

> Tech note: tables are `wishes` (columns `name`, `msg`) and `memos` (columns
> `photo`, `name`, `msg`). The site reads/writes these and subscribes to realtime
> inserts on both.
