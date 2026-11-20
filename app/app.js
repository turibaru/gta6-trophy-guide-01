// Leonida Trophy Guide — offline tracker for the 55 GTA VI PS5 trophies.
// State lives in localStorage only; export/import is a JSON file. No network.
// Classic script (not a module) so the guide also opens directly from file://
// in a desktop browser, where ES modules are blocked. All init runs in an async IIFE.
(async () => {
const KEY = 'leonida-trophy-guide-v1';
const SETTINGS_KEY = 'leonida-trophy-guide-settings-v1';

const $ = (id) => document.getElementById(id);
const listEl = $('list');
const params = new URLSearchParams(location.search);

let doc;
try {
  doc = await (await fetch('data/trophies.json')).json();
} catch {
  // file:// in a desktop browser blocks fetch/ES-module data loading;
  // fall back to the same data embedded as a classic script (data/trophies.js).
  if (window.__TROPHIES__) doc = window.__TROPHIES__;
}
if (!doc) {
  listEl.innerHTML = '<p class="warn">Could not load data/trophies.json. Open this guide from its own folder (app/index.html) or serve it with <code>node serve.ts</code>.</p>';
  throw new Error('trophy data failed to load');
}
const trophies = doc.trophies;

// --- state ---
let earned = new Set();
let settings = { spoilersHidden: true };
try {
  const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
  if (saved && Array.isArray(saved.earned)) earned = new Set(saved.earned.filter((id) => trophies.some((t) => t.id === id)));
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null');
  if (s && typeof s.spoilersHidden === 'boolean') settings = s;
} catch { /* corrupted storage: start fresh */ }

function save() {
  localStorage.setItem(KEY, JSON.stringify({ version: 1, game: doc.game, earned: [...earned].sort((a, b) => a - b), savedAt: new Date().toISOString() }));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// --- controls (URL params act as deep links: ?grade=silver&category=crime&spoiler=off) ---
const gradeSel = $('grade'), catSel = $('category'), statusSel = $('status'),
  searchInput = $('search'), spoilerBox = $('spoiler'),
  missableBox = $('missableOnly'), unconfBox = $('unconfirmedOnly');
if (params.get('grade')) gradeSel.value = params.get('grade');
if (params.get('category')) catSel.value = params.get('category');
if (params.get('status')) statusSel.value = params.get('status');
if (params.get('spoiler') === 'off') settings.spoilersHidden = false;
if (params.get('q')) searchInput.value = params.get('q');
spoilerBox.checked = settings.spoilersHidden;

const CAT_LABEL = { story: 'Story', stranger: 'Strangers', activity: 'Activities', collectible: 'Collecting & exploring', crime: 'Crime', money: 'Money & property', misc: 'Other', completion: 'Completion' };

function isHidden(t) {
  return settings.spoilersHidden && t.spoiler && !earned.has(t.id);
}

function visible() {
  const q = searchInput.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (gradeSel.value !== 'all' && t.grade !== gradeSel.value) return false;
    if (catSel.value !== 'all' && t.category !== catSel.value) return false;
    if (statusSel.value === 'earned' && !earned.has(t.id)) return false;
    if (statusSel.value === 'missing' && earned.has(t.id)) return false;
    if (missableBox.checked && t.missable !== 'possible') return false;
    if (unconfBox.checked && t.verified) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
}

function render() {
  // progress
  const n = earned.size, total = trophies.length;
  $('progressText').textContent = `${n} of ${total} earned`;
  $('progressPct').textContent = `${Math.round((n / total) * 100)}%`;
  $('progressBar').style.width = `${(n / total) * 100}%`;
  $('gradeChips').innerHTML = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    const all = trophies.filter((t) => t.grade === g).length;
    return `<span class="chip">${g[0].toUpperCase() + g.slice(1)} ${got}/${all}</span>`;
  }).join('') + `<span class="chip">Missable: ${trophies.filter((t) => t.missable === 'possible' && earned.has(t.id)).length}/1 flagged</span>`;

  // roadmap phase counts
  for (const li of document.querySelectorAll('.phases li[data-phase]')) {
    const phase = li.dataset.phase;
    const members = trophies.filter((t) => t.category === phase || (phase === 'story' && t.id === 7));
    const got = members.filter((t) => earned.has(t.id)).length;
    li.querySelector('.phase-count').textContent = `${got}/${members.length}`;
  }

  // list
  const rows = visible();
  $('resultCount').textContent = `Showing ${rows.length} of ${total} trophies` +
    (settings.spoilersHidden ? ' · story trophies hidden until earned' : '');
  $('empty').classList.toggle('hidden', rows.length > 0);
  listEl.replaceChildren();
  for (const t of rows) {
    const card = document.createElement('article');
    card.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    card.id = `trophy-${t.id}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); render();
    });
    card.append(box);
    const body = document.createElement('div');
    if (isHidden(t)) {
      body.innerHTML = `<div class="thead"><h3 class="tname">Hidden story trophy</h3>
        <span class="badge ${t.grade}">${t.grade}</span><span class="badge cat">${CAT_LABEL[t.category]}</span></div>
        <p class="hidden-trophy">Hidden while spoiler-safe mode is on. Earn it on your PS5, tick it off — or turn spoiler-safe mode off to reveal it.</p>`;
    } else {
      const head = document.createElement('div');
      head.className = 'thead';
      head.innerHTML = `<h3 class="tname"></h3><span class="badge ${t.grade}">${t.grade}</span>
        <span class="badge cat">${CAT_LABEL[t.category]}</span>` +
        (t.missable === 'possible' ? '<span class="badge miss">⚠ Possibly missable</span>' : '') +
        (!t.verified ? '<span class="badge unconf">Method unconfirmed</span>' : '');
      head.querySelector('.tname').textContent = t.name;
      body.append(head);
      const desc = document.createElement('p');
      desc.className = 'tdesc'; desc.textContent = `“${t.description}”`;
      body.append(desc);
      const det = document.createElement('details');
      const sum = document.createElement('summary');
      sum.textContent = 'How to get it';
      det.append(sum);
      const guide = document.createElement('p');
      guide.className = 'tguide'; guide.textContent = t.guide;
      det.append(guide);
      const src = document.createElement('p');
      src.className = 'tsrc';
      src.textContent = 'Sources: ' + t.sources.map((s) => doc.sources[s] ?? s).join(' · ');
      det.append(src);
      body.append(det);
    }
    card.append(body);
    listEl.append(card);
  }
}

for (const el of [gradeSel, catSel, statusSel, searchInput, missableBox, unconfBox]) {
  el.addEventListener(el.tagName === 'INPUT' && el.type !== 'checkbox' ? 'input' : 'change', render);
}
spoilerBox.addEventListener('change', () => { settings.spoilersHidden = spoilerBox.checked; save(); render(); });
$('clearFilters').addEventListener('click', () => {
  gradeSel.value = 'all'; catSel.value = 'all'; statusSel.value = 'all';
  searchInput.value = ''; missableBox.checked = false; unconfBox.checked = false; render();
});

$('export').addEventListener('click', () => {
  save();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([localStorage.getItem(KEY)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('no earned list');
    const valid = ids.filter((id) => trophies.some((t) => t.id === id));
    if (!valid.length && ids.length) throw new Error('no matching trophy ids');
    earned = new Set(valid);
    save(); render();
    $('resultCount').textContent = `Imported ${valid.length} earned trophies.`;
  } catch {
    $('resultCount').textContent = 'Import failed: that file is not a trophy-progress export from this guide.';
  }
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (!earned.size || confirm('Clear all earned trophies?')) { earned = new Set(); save(); render(); }
});

// sources footer
$('sourceList').innerHTML = Object.entries(doc.sources).map(([k, v]) => {
  const li = document.createElement('li'); li.textContent = `${k}: ${v}`; return li;
}).map((li) => li.outerHTML).join('');

render();

})();
