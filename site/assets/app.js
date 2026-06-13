/* Agentic SDE Handbook — client app. Vanilla JS, offline-first. */
(function () {
  'use strict';
  var BOOK = window.BOOK || { parts: [], meta: {} };
  var LANG = localStorage.getItem('asde-lang') || 'zh';

  // flatten chapters in order, keep part grouping
  var CH = [];
  BOOK.parts.forEach(function (p) {
    (p.chapters || []).forEach(function (c) { c._part = p; CH.push(c); });
  });
  var byId = {};
  CH.forEach(function (c) { byId[c.id] = c; });

  // ---- nine-段 segment kinds ----
  var SEG = [
    { kind: 'hook',        zh: ['一句话', '钩子', '抓住'], en: ['in one line', 'the hook', 'tl;dr'], lz: '钩子', le: 'HOOK' },
    { kind: 'analogy',     zh: ['生活类比', '类比', '生活锚'], en: ['everyday analogy', 'analogy'], lz: '类比', le: 'ANALOGY' },
    { kind: 'def',         zh: ['工程定义', '定义'], en: ['definition', 'what it is'], lz: '定义', le: 'DEFINITION' },
    { kind: 'why',         zh: ['为什么重要', '为什么', 'ai 时代', '时代变化'], en: ['why it matters', 'what changed', 'why'], lz: '为什么', le: 'WHY IT MATTERS' },
    { kind: 'howto',       zh: ['实践方法', '怎么做', '实践'], en: ['in practice', 'how to', 'practice'], lz: '实践', le: 'IN PRACTICE' },
    { kind: 'case',        zh: ['真实案例', '案例', '工件', 'trace'], en: ['case', 'in the wild', 'walkthrough', 'artifact'], lz: '案例', le: 'CASE / ARTIFACT' },
    { kind: 'antipattern', zh: ['反模式', '常见错误', '坑'], en: ['anti-pattern', 'antipattern', 'pitfalls'], lz: '反模式', le: 'ANTI-PATTERN' },
    { kind: 'checklist',   zh: ['检查清单', '清单'], en: ['checklist'], lz: '清单', le: 'CHECKLIST' },
    { kind: 'quiz',        zh: ['自测', '自测题', '想一想'], en: ['self-test', 'quiz', 'check yourself'], lz: '自测', le: 'SELF-TEST' }
  ];
  function segFor(text) {
    var t = (text || '').toLowerCase();
    for (var i = 0; i < SEG.length; i++) {
      var s = SEG[i], arr = s.zh.concat(s.en);
      for (var j = 0; j < arr.length; j++) { if (t.indexOf(arr[j]) !== -1) return s; }
    }
    return null;
  }

  // ---- DOM helpers ----
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function $(sel, root) { return (root || document).querySelector(sel); }

  // ---- sidebar ----
  function buildSidebar() {
    var nav = $('#sidebar'); nav.innerHTML = '';
    BOOK.parts.forEach(function (p) {
      if (!p.chapters || !p.chapters.length) return;
      var pe = el('div', 'toc-part');
      var pt = el('div', 'pt');
      pt.innerHTML = (LANG === 'zh' ? esc(p.part_zh || '') : esc(p.part_en || p.part_zh || '')) +
        (LANG === 'zh' && p.part_en ? '<span class="pt-en">' + esc(p.part_en) + '</span>' : '');
      pe.appendChild(pt);
      p.chapters.forEach(function (c) {
        var link = el('div', 'toc-link');
        link.dataset.id = c.id;
        var num = c.order != null ? String(c.order) : '·';
        link.innerHTML = '<span class="num">' + esc(num) + '</span><span>' +
          esc(LANG === 'zh' ? c.title_zh : (c.title_en || c.title_zh)) + '</span>';
        link.addEventListener('click', function () { go(c.id); closeSidebar(); });
        pe.appendChild(link);
      });
      nav.appendChild(pe);
    });
  }
  function markActive(id) {
    document.querySelectorAll('.toc-link').forEach(function (l) { l.classList.toggle('active', l.dataset.id === id); });
    var a = document.querySelector('.toc-link.active'); if (a) a.scrollIntoView({ block: 'nearest' });
  }

  // ---- source chip ----
  function chip(token, inline) {
    var m = /^([GOAS])(\d+[a-z]?)$/.exec(token); if (!m) return null;
    var org = m[1];
    var c = el('a', inline ? 'srcref' : 'src');
    c.dataset.org = org; c.href = '#sources';
    if (!inline) c.innerHTML = '<span class="dot"></span>' + esc(token);
    else c.textContent = '[' + token + ']';
    c.title = orgName(org) + ' 来源 ' + token + (org === 'S' ? '（二手分析）' : '（一手）');
    c.addEventListener('click', function (e) { e.preventDefault(); openSource(token); });
    return c;
  }
  function orgName(o) { return { G: 'GitHub', O: 'OpenAI', A: 'Anthropic', S: '二手/Secondary' }[o] || o; }
  function openSource(token) {
    var s = (BOOK.sources || []).find(function (x) { return x.id === token; });
    if (s && s.url) window.open(s.url, '_blank'); else go('sources');
  }

  // ---- markdown post-processing ----
  function tokenizeSources(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) {
      if (n.parentNode && /^(CODE|PRE|A)$/.test(n.parentNode.nodeName)) continue;
      if (/\[[GOAS]\d+[a-z]?\]/.test(n.nodeValue)) nodes.push(n);
    }
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      var parts = node.nodeValue.split(/(\[[GOAS]\d+[a-z]?\])/g);
      parts.forEach(function (pt) {
        var mm = /^\[([GOAS]\d+[a-z]?)\]$/.exec(pt);
        if (mm) { var c = chip(mm[1], true); frag.appendChild(c || document.createTextNode(pt)); }
        else if (pt) frag.appendChild(document.createTextNode(pt));
      });
      node.parentNode.replaceChild(frag, node);
    });
  }
  function wrapSegments(article) {
    var kids = Array.prototype.slice.call(article.childNodes);
    var cur = null;
    kids.forEach(function (node) {
      if (node.nodeName === 'H2') {
        var s = segFor(node.textContent);
        cur = el('section', 'seg');
        if (s) { cur.dataset.kind = s.kind; cur.dataset.label = (LANG === 'zh' ? s.lz : s.le); }
        article.insertBefore(cur, node);
        cur.appendChild(node);
      } else if (cur) {
        cur.appendChild(node);
      }
    });
  }
  function decorateCode(root) {
    root.querySelectorAll('pre code').forEach(function (code) {
      try { if (window.hljs) window.hljs.highlightElement(code); } catch (e) {}
      var pre = code.parentNode;
      if (pre.querySelector('.copy-btn')) return;
      var btn = el('button', 'copy-btn', 'copy');
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(code.textContent).then(function () {
          btn.textContent = 'copied'; btn.classList.add('done');
          setTimeout(function () { btn.textContent = 'copy'; btn.classList.remove('done'); }, 1400);
        });
      });
      pre.appendChild(btn);
    });
  }

  // ---- render a chapter ----
  function renderChapter(c) {
    var main = $('#main');
    var body = LANG === 'zh' ? c.zh : (c.en || c.zh);
    var art = el('article');

    if (c.id === 'home') { art.innerHTML = homeHTML(c, body); main.innerHTML = ''; main.appendChild(art); afterRender(art, c); return; }

    var head = el('div');
    head.innerHTML =
      '<div class="kicker">' + esc(LANG === 'zh' ? (c._part.part_zh || '') : (c._part.part_en || '')) +
      (c.order != null ? ' · ' + (LANG === 'zh' ? '第 ' + c.order + ' 章' : 'Ch. ' + c.order) : '') + '</div>' +
      '<h1 class="chapter-h1">' + esc(LANG === 'zh' ? c.title_zh : (c.title_en || c.title_zh)) +
      (LANG === 'zh' && c.title_en ? '<span class="en">' + esc(c.title_en) + '</span>' : '') + '</h1>';
    art.appendChild(head);

    if (c.sources && c.sources.length) {
      var sb = el('div', 'chapter-sources');
      c.sources.forEach(function (t) { var ch = chip(t, false); if (ch) sb.appendChild(ch); });
      art.appendChild(sb);
    }
    art.appendChild(el('div', 'rule'));

    var content = el('div');
    content.innerHTML = window.marked ? window.marked.parse(body || '') : esc(body || '');
    while (content.firstChild) art.appendChild(content.firstChild);

    wrapSegments(art);
    main.innerHTML = ''; main.appendChild(art);
    afterRender(art, c);
    addChapterNav(art, c);
  }
  function afterRender(art, c) {
    tokenizeSources(art);
    decorateCode(art);
    window.scrollTo(0, 0);
    updateProgress();
  }
  function addChapterNav(art, c) {
    var idx = CH.indexOf(c), prev = CH[idx - 1], next = CH[idx + 1];
    var nav = el('div', 'chapter-nav');
    if (prev) { var a = el('a'); a.href = '#' + prev.id; a.innerHTML = '<div class="lbl">' + (LANG === 'zh' ? '上一章' : 'Prev') + '</div>' + esc(LANG === 'zh' ? prev.title_zh : (prev.title_en || prev.title_zh)); a.addEventListener('click', function (e) { e.preventDefault(); go(prev.id); }); nav.appendChild(a); } else nav.appendChild(el('span'));
    if (next) { var b = el('a', 'nxt'); b.href = '#' + next.id; b.innerHTML = '<div class="lbl">' + (LANG === 'zh' ? '下一章' : 'Next') + '</div>' + esc(LANG === 'zh' ? next.title_zh : (next.title_en || next.title_zh)); b.addEventListener('click', function (e) { e.preventDefault(); go(next.id); }); nav.appendChild(b); }
    art.appendChild(nav);
  }
  function homeHTML(c, body) {
    var m = BOOK.meta || {};
    var rows = (m.metaphor || []).map(function (r) {
      return '<div class="cell"><div class="k">' + esc(r.k) + '</div><div class="v">' + esc(LANG === 'zh' ? r.zh : r.en) + '</div></div>';
    }).join('');
    var hero =
      '<div class="home-hero"><div class="eyebrow">' + esc(m.eyebrow || 'AGENTIC SOFTWARE ENGINEERING') + '</div>' +
      '<h1>' + esc(LANG === 'zh' ? (m.title_zh || '') : (m.title_en || '')) + '</h1>' +
      '<div class="tagline">' + esc(LANG === 'zh' ? (m.tagline_zh || '') : (m.tagline_en || '')) + '</div></div>' +
      (rows ? '<div class="metaphor-card"><div class="mc-head">' + (LANG === 'zh' ? '中心隐喻 · agent = 不懂你家规矩的新外包' : 'Central metaphor · the agent is a new contractor') + '</div><div class="metaphor-grid">' + rows + '</div></div>' : '');
    var content = window.marked ? window.marked.parse(body || '') : '';
    return hero + content;
  }

  // ---- routing ----
  function go(id) { location.hash = '#' + id; }
  function route() {
    var id = (location.hash || '').replace(/^#/, '') || (BOOK.parts[0] && BOOK.parts[0].chapters[0] && BOOK.parts[0].chapters[0].id);
    if (id === 'sources') { renderSources(); markActive('sources'); return; }
    var c = byId[id] || CH[0]; if (!c) return;
    renderChapter(c); markActive(c.id);
  }
  function renderSources() {
    var main = $('#main'), art = el('article');
    var rowsP = (BOOK.sources || []).filter(function (s) { return s.id[0] !== 'S'; });
    var rowsS = (BOOK.sources || []).filter(function (s) { return s.id[0] === 'S'; });
    function table(list) {
      return '<table><thead><tr><th>ID</th><th>' + (LANG === 'zh' ? '来源' : 'Source') + '</th><th>' + (LANG === 'zh' ? '日期' : 'Date') + '</th></tr></thead><tbody>' +
        list.map(function (s) {
          return '<tr><td><span class="src" data-org="' + s.id[0] + '"><span class="dot"></span>' + esc(s.id) + '</span></td>' +
            '<td><a href="' + esc(s.url) + '" target="_blank">' + esc(s.title || s.url) + '</a><div style="color:var(--ink-faint);font-size:12px">' + esc(s.org || '') + '</div></td>' +
            '<td style="font-family:var(--mono);font-size:12px">' + esc(s.date || '—') + '</td></tr>';
        }).join('') + '</tbody></table>';
    }
    art.innerHTML = '<div class="kicker">' + (LANG === 'zh' ? '第十卷 · 来源索引' : 'Part X · Sources') + '</div>' +
      '<h1 class="chapter-h1">' + (LANG === 'zh' ? '来源索引' : 'Source Index') + '</h1>' +
      '<div class="legend"><span><b style="color:var(--src-G)">G</b> GitHub</span><span><b style="color:var(--src-O)">O</b> OpenAI</span><span><b style="color:var(--src-A)">A</b> Anthropic</span><span><b style="color:var(--src-S)">S</b> ' + (LANG === 'zh' ? '二手分析' : 'Secondary') + '</span></div>' +
      '<div class="rule"></div>' +
      '<h2>' + (LANG === 'zh' ? '一手来源（厂商官方）' : 'First-party (vendor) sources') + '</h2>' + (rowsP.length ? table(rowsP) : '<p>—</p>') +
      '<h2>' + (LANG === 'zh' ? '二手分析（非厂商，明确区分）' : 'Secondary analysis (non-vendor)') + '</h2>' + (rowsS.length ? table(rowsS) : '<p>—</p>');
    main.innerHTML = ''; main.appendChild(art); window.scrollTo(0, 0);
  }

  // ---- language ----
  function setLang(l) {
    LANG = l; localStorage.setItem('asde-lang', l);
    document.documentElement.lang = (l === 'zh' ? 'zh-CN' : 'en');
    document.querySelectorAll('.langtoggle button').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === l); });
    buildSidebar(); buildSearchIndex(); route();
  }

  // ---- search ----
  var IDX = [];
  function buildSearchIndex() {
    IDX = CH.map(function (c) {
      var body = (LANG === 'zh' ? c.zh : (c.en || c.zh)) || '';
      return { id: c.id, title: (LANG === 'zh' ? c.title_zh : (c.title_en || c.title_zh)) || '', text: body.replace(/[#*`>\-\|]/g, ' ').replace(/\s+/g, ' ') };
    });
  }
  function search(q) {
    q = q.trim().toLowerCase(); var box = $('#searchResults');
    if (!q) { box.classList.remove('show'); return; }
    var out = [];
    IDX.forEach(function (r) {
      var ti = r.title.toLowerCase().indexOf(q), bi = r.text.toLowerCase().indexOf(q);
      if (ti === -1 && bi === -1) return;
      var snip = '';
      if (bi !== -1) { var s = Math.max(0, bi - 40); snip = (s > 0 ? '…' : '') + r.text.slice(s, bi + q.length + 50) + '…'; }
      out.push({ id: r.id, title: r.title, snip: snip, score: (ti !== -1 ? 0 : 1) });
    });
    out.sort(function (a, b) { return a.score - b.score; });
    if (!out.length) { box.innerHTML = '<div class="sr-empty">' + (LANG === 'zh' ? '没有匹配' : 'No matches') + '</div>'; box.classList.add('show'); return; }
    box.innerHTML = out.slice(0, 12).map(function (o) {
      var snip = esc(o.snip).replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
      return '<div class="sr-item" data-id="' + o.id + '"><div class="sr-t">' + esc(o.title) + '</div>' + (snip ? '<div class="sr-c">' + snip + '</div>' : '') + '</div>';
    }).join('');
    box.querySelectorAll('.sr-item').forEach(function (it) { it.addEventListener('click', function () { go(it.dataset.id); box.classList.remove('show'); $('#searchInput').value = ''; }); });
    box.classList.add('show');
  }

  // ---- progress ----
  function updateProgress() {
    var h = document.documentElement, sc = h.scrollTop || document.body.scrollTop;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    $('#progress').style.width = Math.min(100, (sc / max) * 100) + '%';
  }

  // ---- sidebar mobile ----
  function closeSidebar() { $('#sidebar').classList.remove('open'); }

  // ---- util ----
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---- init ----
  function init() {
    if (window.marked) window.marked.setOptions({ breaks: false, gfm: true });
    buildSidebar(); buildSearchIndex();
    document.querySelectorAll('.langtoggle button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === LANG);
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
    var si = $('#searchInput');
    si.addEventListener('input', function () { search(si.value); });
    si.addEventListener('keydown', function (e) { if (e.key === 'Escape') { si.value = ''; search(''); si.blur(); } });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search') && !e.target.closest('#searchResults')) $('#searchResults').classList.remove('show'); });
    var mb = $('#menuBtn'); if (mb) mb.addEventListener('click', function () { $('#sidebar').classList.toggle('open'); });
    window.addEventListener('hashchange', route);
    window.addEventListener('scroll', updateProgress, { passive: true });
    document.addEventListener('keydown', function (e) { if (e.key === '/' && document.activeElement !== si) { e.preventDefault(); si.focus(); } });
    document.documentElement.lang = (LANG === 'zh' ? 'zh-CN' : 'en');
    route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
