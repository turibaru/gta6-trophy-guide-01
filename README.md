# Leonida Trophy Guide — GTA VI (PS5)

Unofficial, offline guide and tracker for all **55 Grand Theft Auto VI trophies**
on PlayStation 5 (1 Platinum, 2 Gold, 6 Silver, 46 Bronze).

## Open it

No build step, no network, no install:

- Double-click `app/index.html` in a desktop browser, or
- `node serve.ts` and open http://localhost:8080

## What it does

- **Checklist** — tick trophies off as you earn them; progress is saved in the
  browser (localStorage) with a progress bar and per-grade counts.
- **Export / import** — save progress as JSON and restore it on another browser.
- **Filters** — by grade, by kind (story / strangers / activities / collecting /
  crime / money / other / completion), by earned status, by text search,
  missable-only, and unconfirmed-methods-only.
- **Spoiler-safe mode** (on by default) — story trophies stay hidden as
  “Hidden story trophy” until you earn them or switch the mode off.
- **Roadmap to the Platinum** — six phases with live per-phase counts, from the
  story through strangers, activities, collecting, crime/money, and 100% cleanup.
- **Missable warning** — the one possibly missable trophy, Positive Mental
  Attitude (first meditation spot is Chapter 1 only), is flagged in the roadmap,
  in its card, and in the filter.
- **A guide for every trophy** in our own words — what to do, where, how, and
  when it can be missed — each citing its sources. Methods not yet confirmed in
  any published guide are labelled **UNCONFIRMED** rather than invented.

## Sources

Names, descriptions and grades are the PS5 trophy list as published
18 November 2026, cross-checked against Push Square, PowerPyx (via KeenGamer /
Sixshore), PSNProfiles and GTABase. Full source list is in the page footer and
in `app/data/trophies.json`. Guides draw on those published guides and cite
them; no text is copied from them.

## Files

- `main.ts` — Node 22 entrypoint: copies `app/` and `screenshots/` to
  `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `dossier.json` with
  `vendor/makefun-frontend.ts` (vendored, unmodified).
- `app/index.html`, `app/style.css`, `app/app.js` — the guide (static files).
- `app/data/trophies.json` — the 55 trophies with guides and sources.
  `app/data/trophies.js` is the same data as a classic script so the page also
  opens directly from `file://`.
- `screenshots/` — 4 real renders of the guide (see `shots.json`).
- `serve.ts` — tiny static server for local development only.

## Disclaimer

Unofficial fan-made guide. Not affiliated with, endorsed by or connected to
Rockstar Games or Take-Two Interactive. No Rockstar artwork or logos are used.
Grand Theft Auto and GTA are trademarks of Take-Two Interactive.

## License

MIT — see `LICENSE`.
