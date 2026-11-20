# Leonida Platinum — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/turibaru/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/turibaru/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze) — built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01). No network needed: open it in a desktop browser and it works with the network off.

## What it does

- **Checklist tracker** — tick off trophies as you earn them; progress is saved in the browser (localStorage) with a live progress bar and per-grade counts.
- **Export / import** — save your progress as a JSON file and import it back (with validation).
- **Filters** — by grade, by kind (story, stranger, collectible, activity, combat, crime, exploration, economy), by earned status, by text search, missable-only, and method-unconfirmed-only.
- **Spoiler mode (on by default)** — hides the names and descriptions of the 20 story / hidden trophies until you earn them.
- **Roadmap to the platinum** — 6 phases in play order, with live earned counts per phase.
- **Missable flag** — exactly 1 missable trophy: *Positive Mental Attitude* (#28), whose first meditation spot is only open in Chapter 1. Everything else can be earned after the story.
- **A cited guide for every trophy** — each card names its source (Exophase for the official list, PSNProfiles for the counts, PowerPyx / PlayStationTrophies.org for methods). Guides are written in our own words; sources are cited, never copied.
- **Honest gaps** — 9 trophies carry the label **Method unconfirmed** (#38, #44–#51): no checked method has been published yet, so the guide says only what the official description suggests instead of inventing steps.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or open `app/index.html` directly from disk — the data is also bundled as `app/data/trophies.js`, so the guide renders from `file://` too.

## Hand in (make.fun)

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide (static, no build step, no CDN)
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, kind, guide and source
- `app/data/trophies.js` — the same data as a classic script, so `file://` works
- `main.ts` — entry program (Node 22 stdlib only), writes `dossier.json` via `vendor/makefun-frontend.ts`
- `serve.ts` — tiny local static server
- `screenshots/` — real Chromium renders of the running app

## Disclaimer

Unofficial fan guide. Not affiliated with, endorsed by or connected to Rockstar Games, Take-Two Interactive or PlayStation. Grand Theft Auto and GTA are trademarks of Take-Two Interactive. No Rockstar logo, artwork or game screenshot is used; the look is our own.
