/* Leonida Platinum — GTA 6 trophy guide & tracker.
   Plain classic script, no libraries, no network at run time.
   Data comes from data/trophies.js (window.GTA6_TROPHIES) when present,
   otherwise from data/trophies.json over HTTP. Progress lives in
   localStorage under STORE_KEY and can be exported / imported as JSON. */
(function () {
  'use strict';

  var STORE_KEY = 'leonida-platinum-v1';
  var PHASES = [
    { n: 1, title: 'Phase 1 — First steps (Chapters 1–2)', blurb: 'Story opening plus the early free-roam trophies. Do the Chapter 1 meditation spot NOW — it is the only missable trophy.', ids: [2, 3, 4, 8, 16, 21, 28, 35] },
    { n: 2, title: 'Phase 2 — Finish the story (Chapters 3–4)', blurb: 'Play the remaining story missions to the finale, then check the 100% completion counter.', ids: [5, 6, 7, 9, 10, 11, 12, 13, 14] },
    { n: 3, title: 'Phase 3 — Strangers across Leonida', blurb: 'Work the stranger strands to their final missions; the six named stranger trophies count toward Strangers & Freaks.', ids: [22, 23, 24, 25, 26, 27, 29] },
    { n: 4, title: 'Phase 4 — Collectibles & exploration', blurb: 'Cards, WAiNK spots, full map coverage and the Ocean Beach secrets. Slow, relaxing cleanup.', ids: [30, 31, 42, 44, 50, 55] },
    { n: 5, title: 'Phase 5 — Activities & skill', blurb: 'Stunts, shooting range golds, drone races, challenges and the combat trophies. The biggest grind lives here.', ids: [15, 17, 18, 19, 20, 32, 36, 37, 38, 46, 51] },
    { n: 6, title: 'Phase 6 — Crime, economy & platinum', blurb: 'Heists, robberies, laundering, garages and the last story-choice trophies. The platinum pops with the final trophy.', ids: [1, 33, 34, 39, 40, 41, 43, 45, 47, 48, 49, 52, 53, 54] }
  ];
  var KIND_LABELS = { story: 'Story', stranger: 'Stranger', collectible: 'Collectible', activity: 'Activity', combat: 'Combat', crime: 'Crime', exploration: 'Exploration', economy: 'Economy' };

  var trophies = [];
  var earned = new Set();
  var spoilerOn = true;
  var openId = null;
  var currentView = 'checklist';

  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(window.location.search);

  function byId(id) {
    for (var i = 0; i < trophies.length; i++) if (trophies[i].id === id) return trophies[i];
    return null;
  }

  function loadSaved() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      var list = Array.isArray(data) ? data : data.earned;
      if (!Array.isArray(list)) return false;
      earned = new Set(list.filter(function (n) { return Number.isInteger(n) && n >= 1 && n <= 55; }));
      return true;
    } catch (e) { return false; }
  }

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ earned: Array.from(earned).sort(function (a, b) { return a - b; }), savedAt: new Date().toISOString() }));
    } catch (e) { /* private mode: progress just lives in memory */ }
  }

  function applyDeepLink() {
    var hadSaved = loadSaved();
    var q = params.get('earned');
    if (q && !hadSaved) {
      q.split(',').forEach(function (part) {
        var n = parseInt(part, 10);
        if (n >= 1 && n <= 55) earned.add(n);
      });
      save();
    }
    if (params.get('spoiler') === 'off') spoilerOn = false;
    if (params.get('view')) currentView = params.get('view');
    var open = parseInt(params.get('open') || '', 10);
    if (open >= 1 && open <= 55) openId = open;
  }

  function applyFilterParams() {
    var map = [['grade', 'gradeFilter'], ['kind', 'kindFilter'], ['status', 'statusFilter'], ['q', 'searchBox']];
    map.forEach(function (pair) {
      var v = params.get(pair[0]);
      if (v !== null) $(pair[1]).value = v;
    });
    if (params.get('missable') === '1') $('missableOnly').checked = true;
    if (params.get('unconfirmed') === '1') $('unconfirmedOnly').checked = true;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function gradeBadge(t) {
    return '<span class="grade ' + esc(t.grade) + '">' + esc(t.grade) + '</span>';
  }

  function targetLine(t) {
    if (!t.target) return '';
    var need = t.target.need;
    var total = t.target.total;
    var text = total ? ('Target: ' + need + ' / ' + total) : ('Target: ' + need);
    return '<p class="target">' + esc(text) + '</p>';
  }

  function cardHtml(t) {
    var isEarned = earned.has(t.id);
    var hiddenBySpoiler = spoilerOn && t.spoiler && !isEarned;
    var cls = 'card' + (isEarned ? ' earned' : '');
    var head = '<div class="card-head"><input type="checkbox" data-trophy="' + t.id + '"' +
      (isEarned ? ' checked' : '') + ' aria-label="Earned: ' + esc(t.name) + '">' +
      '<div><span class="num">#' + t.id + ' &middot; ' + esc(KIND_LABELS[t.kind] || t.kind) + '</span>' +
      '<h3>' + (hiddenBySpoiler ? 'Hidden trophy' : esc(t.name)) + '</h3></div></div>';
    var badges = '<div class="badges">' + gradeBadge(t) +
      (t.hidden ? '<span class="tag hidden-tag">Hidden on PSN</span>' : '') +
      (t.missable ? '<span class="tag miss">Missable</span>' : '') +
      (t.verified ? '' : '<span class="tag unconf">Method unconfirmed</span>') + '</div>';
    if (hiddenBySpoiler) {
      return '<article class="' + cls + '" data-id="' + t.id + '">' + head + badges +
        '<div class="spoiler-hidden"><span class="lock">&#128274;</span>Spoiler mode hides this story trophy until you earn it. Tick the box when you have it to reveal its name and guide.</div></article>';
    }
    var detail = (openId === t.id) ?
      '<p class="guide">' + esc(t.guide) + '</p>' + targetLine(t) +
      '<p class="src">Source: <a href="' + esc(t.sourceUrl) + '" target="_blank" rel="noopener">' + esc(t.source) + '</a></p>' : '';
    return '<article class="' + cls + '" data-id="' + t.id + '">' + head + badges +
      '<p class="desc">&ldquo;' + esc(t.description) + '&rdquo;</p>' +
      '<button type="button" class="detail-btn" data-open="' + t.id + '">' +
      (openId === t.id ? 'Hide guide' : 'Read guide &amp; sources') + '</button>' + detail + '</article>';
  }

  function filtered() {
    var grade = $('gradeFilter').value;
    var kind = $('kindFilter').value;
    var status = $('statusFilter').value;
    var q = $('searchBox').value.trim().toLowerCase();
    var missOnly = $('missableOnly').checked;
    var unconfOnly = $('unconfirmedOnly').checked;
    return trophies.filter(function (t) {
      if (grade && t.grade !== grade) return false;
      if (kind && t.kind !== kind) return false;
      if (status === 'earned' && !earned.has(t.id)) return false;
      if (status === 'unearned' && earned.has(t.id)) return false;
      if (missOnly && !t.missable) return false;
      if (unconfOnly && t.verified) return false;
      if (q && (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  function renderProgress() {
    var total = trophies.length || 55;
    var n = earned.size;
    $('earnedCount').textContent = n + ' / ' + total + ' trophies';
    $('earnedPct').textContent = Math.round((n / total) * 100) + '%';
    $('progressFill').style.width = ((n / total) * 100) + '%';
    var counts = ['platinum', 'gold', 'silver', 'bronze'].map(function (g) {
      var all = trophies.filter(function (t) { return t.grade === g; }).length;
      var got = trophies.filter(function (t) { return t.grade === g && earned.has(t.id); }).length;
      return g + ' ' + got + '/' + all;
    });
    $('gradeCounts').textContent = counts.join('  ·  ') + '  ·  ' +
      trophies.filter(function (t) { return t.verified; }).length + ' guides verified, ' +
      trophies.filter(function (t) { return !t.verified; }).length + ' methods unconfirmed';
  }

  function renderCards() {
    var list = filtered();
    $('cards').innerHTML = list.map(cardHtml).join('');
    $('emptyMsg').hidden = list.length > 0;
    $('resultCount').textContent = 'Showing ' + list.length + ' of ' + trophies.length + ' trophies';
    var miss = trophies.filter(function (t) { return t.missable; });
    $('missableList').innerHTML = miss.map(cardHtml).join('');
  }

  function renderRoadmap() {
    $('roadmap').innerHTML = PHASES.map(function (ph) {
      var got = ph.ids.filter(function (id) { return earned.has(id); }).length;
      var items = ph.ids.map(function (id) {
        var t = byId(id);
        if (!t) return '';
        var label = (spoilerOn && t.spoiler && !earned.has(id)) ? 'Hidden trophy' : t.name;
        return '<li class="' + (earned.has(id) ? 'done' : '') + '">#' + id + ' — ' + esc(label) + '</li>';
      }).join('');
      return '<div class="phase"><h3>' + esc(ph.title) + '</h3>' +
        '<p class="count">' + got + ' / ' + ph.ids.length + ' earned</p>' +
        '<p>' + esc(ph.blurb) + '</p><ul>' + items + '</ul></div>';
    }).join('');
  }

  function renderAll() {
    renderProgress();
    renderCards();
    renderRoadmap();
  }

  function showView(view) {
    currentView = view;
    ['checklist', 'roadmap', 'missable', 'sources'].forEach(function (v) {
      $('view-' + v).hidden = (v !== view);
      $('tab-' + v).classList.toggle('active', v === view);
    });
  }

  function exportProgress() {
    var payload = { app: 'leonida-platinum', game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: Array.from(earned).sort(function (a, b) { return a - b; }) };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gta6-trophies-progress.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    $('importStatus').textContent = 'Exported ' + earned.size + ' earned trophies to gta6-trophies-progress.json.';
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        var list = Array.isArray(data) ? data : data.earned;
        if (!Array.isArray(list)) throw new Error('no earned array');
        var valid = [];
        var bad = 0;
        list.forEach(function (n) {
          if (Number.isInteger(n) && n >= 1 && n <= 55) valid.push(n); else bad++;
        });
        if (!valid.length && bad) throw new Error('no valid trophy ids');
        earned = new Set(valid);
        save();
        renderAll();
        $('importStatus').textContent = 'Imported ' + valid.length + ' earned trophies' + (bad ? (' (' + bad + ' invalid entries skipped)') : '') + '.';
      } catch (e) {
        $('importStatus').textContent = 'Import failed: that file is not a valid progress export (' + e.message + '). Nothing was changed.';
      }
    };
    reader.readAsText(file);
  }

  function bind() {
    $('cards').addEventListener('change', function (ev) {
      var box = ev.target.closest('input[data-trophy]');
      if (!box) return;
      var id = parseInt(box.getAttribute('data-trophy'), 10);
      if (box.checked) earned.add(id); else earned.delete(id);
      save();
      renderAll();
    });
    $('missableList').addEventListener('change', function (ev) {
      var box = ev.target.closest('input[data-trophy]');
      if (!box) return;
      var id = parseInt(box.getAttribute('data-trophy'), 10);
      if (box.checked) earned.add(id); else earned.delete(id);
      save();
      renderAll();
    });
    document.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-open]');
      if (btn) {
        var id = parseInt(btn.getAttribute('data-open'), 10);
        openId = (openId === id) ? null : id;
        renderCards();
        // User-initiated only: bring the just-opened guide into view.
        // Never scroll on page load — headless screenshots capture a blank
        // viewport when the page is scrolled before the shot.
        if (openId) {
          var card = document.querySelector('[data-id="' + openId + '"]');
          if (card) card.scrollIntoView({ block: 'nearest' });
        }
        return;
      }
      var tab = ev.target.closest('button[data-view]');
      if (tab) showView(tab.getAttribute('data-view'));
    });
    ['searchBox', 'gradeFilter', 'kindFilter', 'statusFilter', 'missableOnly', 'unconfirmedOnly'].forEach(function (id) {
      $(id).addEventListener('input', renderCards);
      $(id).addEventListener('change', renderCards);
    });
    $('spoilerToggle').addEventListener('change', function () {
      spoilerOn = $('spoilerToggle').checked;
      renderAll();
    });
    $('exportBtn').addEventListener('click', exportProgress);
    $('importBtn').addEventListener('click', function () { $('importFile').click(); });
    $('importFile').addEventListener('change', function () {
      if ($('importFile').files[0]) importProgress($('importFile').files[0]);
      $('importFile').value = '';
    });
    $('resetBtn').addEventListener('click', function () {
      if (window.confirm('Reset all progress? This clears every ticked trophy.')) {
        earned = new Set();
        save();
        renderAll();
        $('importStatus').textContent = 'Progress reset — 0 of ' + trophies.length + ' earned.';
      }
    });
  }

  function start(data) {
    trophies = (data && data.trophies) || [];
    trophies.sort(function (a, b) { return a.id - b.id; });
    applyDeepLink();
    applyFilterParams();
    $('spoilerToggle').checked = spoilerOn;
    bind();
    showView(currentView);
    renderAll();
  }

  function boot() {
    if (window.GTA6_TROPHIES) { start(window.GTA6_TROPHIES); return; }
    fetch('data/trophies.json').then(function (r) { return r.json(); }).then(start).catch(function () {
      $('cards').innerHTML = '<p class="empty">Could not load the trophy data. Open this guide over HTTP (node serve.ts) or make sure app/data/trophies.js is present.</p>';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
