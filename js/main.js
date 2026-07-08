/* =========================================================
   Bremi Maruthaiyan — PMM Portfolio
   Theme toggle · mobile nav · tabs+deeplink · reveal · count-up
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('mobileMenu');
  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
  }
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    if (burger) { burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu'); }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      if (menu.hidden) { openMenu(); } else { closeMenu(); }
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) closeMenu(); });
  }

  /* ---------- Case-study tabs (ARIA + deep-linking) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));

  function activateTab(tab, focus, updateHash) {
    if (!tab) return;
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.classList.toggle('is-active', selected);
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (p) {
      var show = p.id === tab.getAttribute('aria-controls');
      p.hidden = !show;
      p.classList.toggle('is-active', show);
      if (show) countUpWithin(p);
    });
    if (focus) tab.focus();
    if (updateHash) {
      var key = tab.getAttribute('data-key');
      if (key && history.replaceState) history.replaceState(null, '', '#' + key);
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab, false, true); });
    tab.addEventListener('keydown', function (e) {
      var idx = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') idx = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') idx = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') idx = 0;
      else if (e.key === 'End') idx = tabs.length - 1;
      if (idx !== null) { e.preventDefault(); activateTab(tabs[idx], true, true); }
    });
  });

  // Open tab from URL hash on load (e.g. #recruit)
  if (tabs.length) {
    var hash = (location.hash || '').replace('#', '');
    if (hash) {
      var match = tabs.filter(function (t) { return t.getAttribute('data-key') === hash; })[0];
      if (match) activateTab(match, false, false);
    }
  }

  /* ---------- Count-up for metrics ---------- */
  // Parses a value like "$324K", "2,200+", "64%". Skips ranges ("30–40%").
  function parseNum(text) {
    var m = text.match(/^(\D*)([\d,]+)(.*)$/);
    if (!m) return null;
    var prefix = m[1], digits = m[2], suffix = m[3];
    if (/\d/.test(suffix)) return null;      // a second number => range, skip
    var value = parseInt(digits.replace(/,/g, ''), 10);
    if (isNaN(value)) return null;
    var hasComma = digits.indexOf(',') !== -1;
    return { prefix: prefix, value: value, suffix: suffix, comma: hasComma };
  }

  function format(n, comma) {
    return comma ? n.toLocaleString('en-US') : String(n);
  }

  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var parsed = parseNum(el.textContent.trim());
    if (!parsed || prefersReduced) return;   // leave final text untouched
    var final = el.textContent;
    var start = null, dur = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);     // easeOutCubic
      var cur = Math.round(parsed.value * eased);
      el.textContent = parsed.prefix + format(cur, parsed.comma) + parsed.suffix;
      if (p < 1) { requestAnimationFrame(step); } else { el.textContent = final; }
    }
    requestAnimationFrame(step);
  }

  function countUpWithin(container) {
    container.querySelectorAll('.num').forEach(countUp);
  }

  /* ---------- Reveal on scroll + trigger count-up ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var numEls = document.querySelectorAll('.num');

  if ('IntersectionObserver' in window && !prefersReduced) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revObs.observe(el); });

    var numObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); numObs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    // only observe numbers in visible (non-hidden) panels; hidden ones fire on tab open
    numEls.forEach(function (el) {
      if (!el.closest('.panel[hidden]')) numObs.observe(el);
    });
  } else {
    // no IO or reduced motion: show everything, final numbers as-is
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
