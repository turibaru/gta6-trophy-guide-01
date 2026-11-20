# STATUS — gta6-trophy-guide-01 (Leonida Trophy Guide)

Entri: `~/workspace/makefun/entries/gta6-trophy-guide-01/` — **siap-submit kecuali
langkah submit itu sendiri** (repo GitHub publik + sealed recordings + submit).
Dibangun 20 Nov 2026, sebelum deadline 21 Nov 2026 18:00 WIB.

## Yang sudah dibangun

- `app/` — web app statis offline: `index.html`, `style.css`, `app.js`,
  `data/trophies.json` (+ `data/trophies.js`, salinan data yang sama agar halaman
  juga bisa dibuka langsung dari `file://` di desktop browser).
- `main.ts` (Node 22, stdlib saja, pola kit) + `serve.ts` + `LICENSE` (MIT) +
  `README.md` + `shots.json`.
- `vendor/makefun-frontend.ts` — disalin dari kit **tanpa diubah**
  (md5 `03e7480e58e7871d1fd6da689eaee438`, sama dengan kit).
- `screenshots/` — 4 render ASLI aplikasi di Chromium headless lokal
  (1280×800, JPEG, masing-masing < 256 KiB):
  1-checklist (61.338 B), 2-roadmap (135.004 B), 3-silver (61.829 B),
  4-missable (93.690 B). Filter Silver terverifikasi menampilkan 6 kartu.

## Daftar trophy — status verifikasi

- **55/55 trophy terverifikasi** (nama, deskripsi resmi, grade): 1 Platinum,
  2 Gold, 6 Silver, 46 Bronze. Daftar ini sama persis dengan daftar referensi
  kit (`starter/app/data/trophies.json`, "the official 55 trophies, 2026-11-18")
  — dicek otomatis, tidak ada perbedaan nama/deskripsi/grade.
- **Cross-check publik** (20 Nov 2026, via pencarian web): daftar yang sama
  muncul di Push Square, KeenGamer, Sixshore, eGamers, FullSweep, GTASpotter —
  semuanya mengutip daftar PS5 yang terbit 18 Nov 2026 (PSNProfiles /
  TrueTrophies). Satu "daftar bocor" di Instant Gaming (10 Nov) isinya berbeda
  dan TIDAK dipakai.
- **Panduan per trophy: 46/55 metodenya terverifikasi** dari sumber yang dikutip
  (angka-angka kunci: 42 Shooting Range, 14 lokasi drone, 18 spot meditasi,
  9 jenis aktivitas, 8 garasi, 397 stunt tersedia/250 dibutuhkan, 80 challenge/
  50 dibutuhkan, 14 stranger strand/8 dibutuhkan, 18 set kartu/3 dibutuhkan).
- **9/55 metode BELUM terverifikasi** dan ditandai jujur `verified: false` +
  label "Method unconfirmed" di UI (id 38, 44, 45, 46, 47, 48, 49, 50, 51 —
  trophy hidden dengan deskripsi samar; panduan lain juga menyatakan metodenya
  masih dikonfirmasi, mis. KeenGamer). Tidak ada panduan yang dikarang.
- **Missable: 1** — Positive Mental Attitude (id 28), sesuai PowerPyx/GTABase:
  spot meditasi pertama hanya bisa dipakai di Chapter 1. Sisanya aman dalam
  satu playthrough (free roam lanjut setelah cerita, Push Square).

## Fitur (semua teruji di Chromium lokal)

- Checklist 55 trophy, tersimpan di localStorage; progress bar + hitungan per grade.
- Export/import JSON (dengan validasi), tombol reset.
- Filter: grade, jenis (8 kategori), status, pencarian teks, missable-only,
  unconfirmed-only; deep link via query (`?grade=silver&spoiler=off`).
- Mode spoiler (default ON): 20 trophy cerita/hidden disembunyikan sampai didapat.
- Roadmap platinum 6 fase dengan hitungan live per fase + banner missable.
- Panduan tiap trophy dengan kutipan sumber; footer sumber lengkap; disclaimer
  non-afiliasi; tanpa logo/artwork Rockstar; tanpa CDN (grep: tidak ada referensi
  eksternal di `app/` kecuali nama sumber di teks).
- Offline terverifikasi dua cara: via `node serve.ts` (HTTP lokal, 200 semua file)
  dan via `file://` langsung (55 kartu ter-render).

## Verifikasi build

- `MAKEFUN_OUTPUT_DIR=/tmp/gta6out node main.ts` → sukses; `dossier.json`
  tertulis (schema `makefun/dossier/v1`, cover 0, 4 images, teks 72.784 byte
  < batas 163.840).

## YANG MASIH KURANG untuk submit (bukan tugas build ini)

1. **Repo GitHub publik** berisi entri ini (satu commit) — belum dibuat.
2. **GitHub PAT / akun make.fun @turibaru** — submit memakai API key/CLI kit;
   tidak dilakukan di sini (tugas ini melarang submit dan melarang pakai API key).
3. **Sealed recordings** via kit `record` saat submit nanti — bukan tugas ini.
4. (Opsional) Perbarui 9 panduan UNCONFIRMED begitu panduan publik
   mengonfirmasi metodenya — game baru rilis 19 Nov 2026, panduan komunitas
   masih dilengkapi.
