(function () {
  'use strict';

  var plugin = new TinteroPlugin();
  var root = document.getElementById('plugin-root');

  var logs = [];
  var activeFilter = 'all'; // 'all' | 'log' | 'warn' | 'error' | 'info'
  var autoScroll = true;
  var searchQuery = '';
  var MAX_DISPLAY = 500;
  var eventsInitialized = false;
  var logListenerRegistered = false;

  var levelIcons = { log: '\u25CB', info: '\u25CF', warn: '\u25B2', error: '\u2716' };

  var s = document.createElement('style');
  s.textContent = [
    '*, *::before, *::after { box-sizing: border-box; }',
    ':root { --console-bg: rgba(0,0,0,0.15); --entry-hover: rgba(255,255,255,0.03); --border: rgba(255,255,255,0.06); }',

    '.dev-console { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-family: "SF Mono", "Fira Code", "Cascadia Code", Monaco, Consolas, monospace; font-size: 12px; }',

    '.toolbar { display: flex; align-items: center; gap: 4px; padding: 6px 8px; background: var(--console-bg); border-bottom: 1px solid var(--border); flex-shrink: 0; flex-wrap: wrap; }',
    '.toolbar-group { display: flex; align-items: center; gap: 2px; }',
    '.toolbar-sep { width: 1px; height: 16px; background: var(--border); margin: 0 4px; }',
    '.filter-btn { padding: 3px 8px; border: 1px solid transparent; background: transparent; color: var(--text-tertiary, #a19591); font-size: 11px; border-radius: 4px; cursor: pointer; font-family: inherit; transition: all 0.12s; }',
    '.filter-btn:hover { border-color: var(--border); color: var(--text-secondary, #a98e6b); }',
    '.filter-btn.active { background: rgba(201,138,72,0.12); border-color: rgba(201,138,72,0.25); color: var(--accent-color, #c98a48); font-weight: 600; }',
    '.filter-btn .count { margin-left: 3px; opacity: 0.6; font-weight: 400; }',
    '.action-btn { padding: 3px 8px; border: 1px solid var(--border); background: transparent; color: var(--text-tertiary, #a19591); font-size: 11px; border-radius: 4px; cursor: pointer; font-family: inherit; transition: all 0.12s; white-space: nowrap; }',
    '.action-btn:hover { border-color: rgba(201,138,72,0.3); color: var(--accent-color, #c98a48); }',
    '.action-btn.active { background: rgba(201,138,72,0.12); color: var(--accent-color, #c98a48); }',
    '.search-input { flex: 1; min-width: 60px; padding: 3px 8px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); color: var(--text-primary, #e6d7c2); font-size: 11px; border-radius: 4px; font-family: inherit; outline: none; transition: border-color 0.15s; }',
    '.search-input::placeholder { color: var(--text-tertiary, #a19591); opacity: 0.6; }',
    '.search-input:focus { border-color: rgba(201,138,72,0.4); }',

    '.log-list { flex: 1; overflow-y: auto; overflow-x: hidden; }',
    '.log-entry { display: flex; align-items: flex-start; padding: 3px 8px; border-bottom: 1px solid rgba(255,255,255,0.02); transition: background 0.1s; word-break: break-all; }',
    '.log-entry:hover { background: var(--entry-hover); }',
    '.log-entry.level-warn { background: rgba(255, 193, 7, 0.04); }',
    '.log-entry.level-warn:hover { background: rgba(255, 193, 7, 0.08); }',
    '.log-entry.level-error { background: rgba(244, 67, 54, 0.04); }',
    '.log-entry.level-error:hover { background: rgba(244, 67, 54, 0.08); }',

    '.entry-time { flex-shrink: 0; width: 65px; color: var(--text-tertiary, #a19591); opacity: 0.5; font-size: 10px; padding-top: 1px; }',
    '.entry-level { flex-shrink: 0; width: 14px; text-align: center; font-size: 10px; padding-top: 2px; margin-right: 6px; }',
    '.entry-level.log { color: var(--text-tertiary, #a19591); }',
    '.entry-level.info { color: #64b5f6; }',
    '.entry-level.warn { color: #ffc107; }',
    '.entry-level.error { color: #f44336; }',
    '.entry-source { flex-shrink: 0; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--accent-color, #c98a48); opacity: 0.6; font-size: 10px; margin-right: 6px; padding-top: 1px; }',
    '.entry-msg { flex: 1; color: var(--text-primary, #e6d7c2); white-space: pre-wrap; line-height: 1.45; }',
    '.entry-msg.warn { color: #ffc107; }',
    '.entry-msg.error { color: #ef9a9a; }',

    '.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-tertiary, #a19591); gap: 8px; }',
    '.empty-icon { font-size: 28px; opacity: 0.3; }',
    '.empty-text { font-size: 12px; }',

    '.status-bar { display: flex; align-items: center; justify-content: space-between; padding: 3px 8px; background: var(--console-bg); border-top: 1px solid var(--border); flex-shrink: 0; font-size: 10px; color: var(--text-tertiary, #a19591); }',
  ].join('\n');
  document.head.appendChild(s);

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatTime(ts) {
    var d = new Date(ts);
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(function (n) { return String(n).padStart(2, '0'); })
      .join(':') + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  function countByLevel(level) {
    if (level === 'all') return logs.length;
    return logs.filter(function (e) { return e.level === level; }).length;
  }

  function getFilteredLogs() {
    var filtered = activeFilter === 'all'
      ? logs
      : logs.filter(function (e) { return e.level === activeFilter; });

    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      filtered = filtered.filter(function (e) {
        return e.args.join(' ').toLowerCase().indexOf(q) !== -1 ||
               e.source.toLowerCase().indexOf(q) !== -1;
      });
    }

    return filtered.length > MAX_DISPLAY ? filtered.slice(filtered.length - MAX_DISPLAY) : filtered;
  }

  function filterBtn(level, label) {
    return '<button class="filter-btn' + (activeFilter === level ? ' active' : '') + '" data-filter="' + level + '">' +
      label + '<span class="count">(' + countByLevel(level) + ')</span></button>';
  }

  function scrollToBottom() {
    var list = document.getElementById('log-list');
    if (list) list.scrollTop = list.scrollHeight;
  }

  function buildConsoleHtml() {
    var filtered = getFilteredLogs();
    var h = '<div class="dev-console">';

    h += '<div class="toolbar">';
    h += '<div class="toolbar-group">';
    h += filterBtn('all', 'All') + filterBtn('error', 'Errors') + filterBtn('warn', 'Warnings') + filterBtn('info', 'Info') + filterBtn('log', 'Log');
    h += '</div>';
    h += '<div class="toolbar-sep"></div>';
    h += '<input class="search-input" id="log-search" type="text" placeholder="Filter..." value="' + esc(searchQuery) + '">';
    h += '<div class="toolbar-sep"></div>';
    h += '<button class="action-btn' + (autoScroll ? ' active' : '') + '" id="btn-autoscroll" title="Auto-scroll">\u2193 Auto</button>';
    h += '<button class="action-btn" id="btn-clear" title="Clear console">\u2718 Clear</button>';
    h += '</div>';

    h += '<div class="log-list" id="log-list">';
    if (filtered.length === 0) {
      h += '<div class="empty-state">';
      h += '<div class="empty-icon">&gt;_</div>';
      h += '<div class="empty-text">' + (logs.length === 0
        ? 'No logs yet. Console output will appear here.'
        : 'No logs match the current filter.') + '</div>';
      h += '</div>';
    } else {
      for (var i = 0; i < filtered.length; i++) {
        var entry = filtered[i];
        h += '<div class="log-entry level-' + entry.level + '">';
        h += '<span class="entry-time">' + formatTime(entry.timestamp) + '</span>';
        h += '<span class="entry-level ' + entry.level + '">' + levelIcons[entry.level] + '</span>';
        h += '<span class="entry-source" title="' + esc(entry.source) + '">' + esc(entry.source) + '</span>';
        h += '<span class="entry-msg ' + entry.level + '">' + esc(entry.args.join(' ')) + '</span>';
        h += '</div>';
      }
    }
    h += '</div>';

    h += '<div class="status-bar">';
    h += '<span>' + filtered.length + ' / ' + logs.length + ' entries</span>';
    h += '<span>' + countByLevel('error') + ' errors, ' + countByLevel('warn') + ' warnings</span>';
    h += '</div>';

    h += '</div>';
    return h;
  }

  function render() {
    tintero.ui.render(buildConsoleHtml());
    if (autoScroll) requestAnimationFrame(scrollToBottom);
  }

  // Bind events once to root via delegation. This survives tintero.ui.render()
  // replacing the inner DOM, as long as root itself is a stable element.
  function initEvents() {
    if (eventsInitialized) return;
    eventsInitialized = true;

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (btn) { activeFilter = btn.getAttribute('data-filter') || 'all'; render(); return; }
      if (e.target.closest('#btn-clear')) { logs = []; tintero.debug.clear(); render(); return; }
      if (e.target.closest('#btn-autoscroll')) { autoScroll = !autoScroll; render(); return; }
    });

    root.addEventListener('input', function (e) {
      if (e.target.matches('#log-search')) { searchQuery = e.target.value; render(); }
    });
  }

  plugin.onActivate = async function () {
    initEvents();

    try {
      var existing = await tintero.debug.getLogs();
      if (existing && existing.length) logs = existing;
    } catch (e) {
      // debug scope may not be granted
    }

    render();

    // Guard against accumulating listeners if onActivate fires more than once
    if (!logListenerRegistered) {
      logListenerRegistered = true;
      tintero.events.on('debug.log', function (entry) {
        if (!entry) return;
        logs.push(entry);
        if (logs.length > MAX_DISPLAY * 2) logs = logs.slice(logs.length - MAX_DISPLAY);
        render();
      });
    }
  };

  plugin.onProjectChange = function () {};

  registerPlugin(plugin);
})();
