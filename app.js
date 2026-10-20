/* Desi Sawad — shared site script (all pages) */
(function () {
'use strict';
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var root = document.documentElement, body = document.body;
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
var PAGE = body.getAttribute('data-page') || 'home';
var C = DS.CONTACT;
function isMobile() { return innerWidth < 1024; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function wa(text) { return 'https://wa.me/' + C.wa + '?text=' + encodeURIComponent(text); }
var ICON = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.2 1.4Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 8h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>'
};

/* ─────────────── theme ─────────────── */
function setTheme(t, silent) {
  root.setAttribute('data-theme', t);
  try { localStorage.setItem('ds-theme', t); } catch (e) {}
  var m = $('meta[name="theme-color"]'); if (m) m.content = t === 'light' ? '#f3ede2' : '#0b0a08';
  $$('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme'); });
  if (!silent) { window.dispatchEvent(new CustomEvent('ds:theme', { detail: t })); sfx.toggle(); }
}
$$('[data-theme-toggle]').forEach(function (b) {
  b.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); });
});

/* ─────────────── sound (Web Audio, no files) ─────────────── */
var S = { on: false, ctx: null, last: 0, master: null };
try { S.on = localStorage.getItem('ds-snd') === '1'; } catch (e) {}
function ac() {
  if (!S.ctx) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; S.ctx = new A(); S.master = S.ctx.createGain(); S.master.gain.value = .9; var comp = S.ctx.createDynamicsCompressor(); S.master.connect(comp).connect(S.ctx.destination); }
  if (S.ctx.state === 'suspended') S.ctx.resume();
  return S.ctx;
}
function tone(f, d, type, vol, to, delay) {
  if (!S.on) return; var c = ac(); if (!c) return;
  var t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || .05, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g).connect(S.master); o.start(t); o.stop(t + d + .03);
}
function noise(d, f, q, vol, f2, type) {
  if (!S.on) return; var c = ac(); if (!c) return;
  var n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), x = b.getChannelData(0);
  for (var i = 0; i < n; i++) x[i] = Math.random() * 2 - 1;
  var s = c.createBufferSource(); s.buffer = b;
  var bp = c.createBiquadFilter(); bp.type = type || 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
  var t = c.currentTime; if (f2) bp.frequency.exponentialRampToValueAtTime(f2, t + d);
  var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  s.connect(bp).connect(g).connect(S.master); s.start(t);
}
var sfx = {
  tick: function () { var n = performance.now(); if (n - S.last < 60) return; S.last = n; tone(2400, .03, 'sine', .012); },
  click: function () { tone(420, .07, 'triangle', .045, 760); },
  toggle: function () { tone(660, .08, 'sine', .05, 990); tone(990, .12, 'sine', .035, 1320, .07); },
  whoosh: function () { noise(.8, 260, .8, .12, 2600); },
  open: function () { noise(.45, 600, .9, .06, 1800); tone(520, .14, 'sine', .03, 780, .05); },
  close: function () { noise(.35, 1600, .9, .05, 500); },
  sizzle: function () { noise(1.0, 4200, .5, .07, 3000, 'highpass'); noise(.35, 900, 1.4, .04); },
  pop: function () { tone(360, .1, 'sine', .06, 720); },
  send: function () { tone(740, .06, 'triangle', .04, 1100); },
  chime: function () { tone(784, .35, 'sine', .045); tone(1175, .5, 'sine', .04, null, .09); tone(1568, .6, 'sine', .025, null, .18); }
};
function paintSnd() {
  $$('[data-sound-toggle]').forEach(function (b) { b.classList.toggle('on', S.on); b.setAttribute('aria-pressed', S.on); b.setAttribute('aria-label', S.on ? 'Sound effects on, tap to mute' : 'Sound effects off, tap to turn on'); });
}
paintSnd();
$$('[data-sound-toggle]').forEach(function (b) {
  b.addEventListener('click', function () { S.on = !S.on; try { localStorage.setItem('ds-snd', S.on ? '1' : '0'); } catch (e) {} paintSnd(); if (S.on) { ac(); sfx.chime(); } toast(S.on ? 'Sound effects on' : 'Sound effects off'); });
});
document.addEventListener('pointerover', function (e) { if (FINE && e.target.closest && e.target.closest('.btn,.cat,.flav,.nav-links a,.icon-btn,.add-btn,.qa button,.chips button,.mitem,.dock a')) sfx.tick(); });
document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.btn,.cat,.flav,.dock a,.chips button,.qa button,.msheet a')) sfx.click(); });

/* ─────────────── smooth scroll ─────────────── */
var lenis = null;
if (!RM && window.Lenis) { try { lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4 }); (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(); } catch (e) { lenis = null; } }
var locks = 0;
function lock(on) { locks = Math.max(0, locks + (on ? 1 : -1)); var l = locks > 0; if (lenis) { l ? lenis.stop() : lenis.start(); } body.style.overflow = l ? 'hidden' : ''; }
function goTo(hash) { var el = $(hash); if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.3 }); else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }
DS.goTo = goTo;

/* ─────────────── nav ─────────────── */
var nav = $('.nav'), dock = $('.dock'), sp = $('.sprog'), lastY = scrollY;
function onScroll() {
  var y = scrollY, h = document.documentElement.scrollHeight - innerHeight, down = y > lastY + 4, up = y < lastY - 4;
  if (sp) sp.style.setProperty('--sp', h > 0 ? (y / h).toFixed(4) : 0);
  if (isMobile() && !body.classList.contains('menu-open')) {
    if (down && y > 160) { nav.classList.add('hide'); body.classList.add('nav-hidden'); }
    else if (up || y < 80) { nav.classList.remove('hide'); body.classList.remove('nav-hidden'); }
  } else { nav.classList.remove('hide'); body.classList.remove('nav-hidden'); }
  if (dock) dock.classList.toggle('hide', y > h - 80 && h > 400);
  if (down || up) lastY = y;
  footFill();
}
var sq = 0; addEventListener('scroll', function () { if (!sq) sq = requestAnimationFrame(function () { sq = 0; onScroll(); }); }, { passive: true });
var burger = $('.burger');
function closeMenu() { if (!body.classList.contains('menu-open')) return; body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); $('.msheet').setAttribute('aria-hidden', 'true'); lock(false); sfx.close(); }
if (burger) burger.addEventListener('click', function () {
  var o = !body.classList.contains('menu-open');
  if (!o) { closeMenu(); return; }
  closeChat(); closeCart();
  body.classList.add('menu-open'); burger.setAttribute('aria-expanded', 'true'); $('.msheet').setAttribute('aria-hidden', 'false'); lock(true); sfx.open(); nav.classList.remove('hide');
});
$$('.msheet nav a').forEach(function (a, i) { a.style.setProperty('--i', i); });
/* in-page anchors */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]'); if (!a) return; var h = a.getAttribute('href'); if (h.length < 2) return;
  if (!$(h)) return; e.preventDefault(); closeMenu(); closeChat(); closeCart(); goTo(h);
});

/* ─────────────── split text + reveals ─────────────── */
function split(el) {
  if (el.dataset.splitDone) return; el.dataset.splitDone = '1'; var i = 0;
  (function walk(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
      if (ch.nodeType === 3) {
        if (!ch.textContent.trim()) return; var f = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return; if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span'); s.className = 'sw';
          var k = document.createElement('span'); k.className = 'c'; k.textContent = w; k.style.setProperty('--i', i++); s.appendChild(k); f.appendChild(s);
        });
        ch.replaceWith(f);
      } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
    });
  })(el);
}
$$('[data-split]').forEach(split);
var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -10% 0px' }) : null;
function observe(scope) { $$('[data-split],[data-rv]', scope).forEach(function (el) { if (el.hasAttribute('data-hero')) return; if (io) io.observe(el); else el.classList.add('in'); }); }
function revealHero() { $$('[data-hero]').forEach(function (el, k) { setTimeout(function () { el.classList.add('in'); }, k * 70); }); }

/* ─────────────── page curtain ─────────────── */
var PAGES = { 'index.html': 'Home', '': 'Home', 'menu.html': 'Menu', 'gallery.html': 'Gallery', 'about.html': 'Our story', 'reserve.html': 'Reserve', 'contact.html': 'Visit us' };
function ptWord(label) { var pt = $('.pt'); if (!pt) return; $('.pt-f', pt).textContent = 'Desi Sawad · Riyadh'; var w = $('.pt-w', pt); w.textContent = label; delete w.dataset.splitDone; split(w); }
function curtain() {
  var pt = $('.pt'); if (!pt) return Promise.resolve();
  var arriving = null; try { arriving = sessionStorage.getItem('ds-pt'); sessionStorage.removeItem('ds-pt'); } catch (e) {}
  var p = Promise.resolve();
  if (root.classList.contains('pt-on')) {
    ptWord(arriving || 'Desi Sawad');
    p = new Promise(function (res) {
      setTimeout(function () { pt.classList.add('lift'); setTimeout(res, 380); setTimeout(function () { root.classList.remove('pt-on'); pt.classList.remove('lift'); }, 1100); }, 280);
    });
  }
  if (RM) return p;
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.href, location.href); } catch (er) { return; }
    if (u.origin !== location.origin && location.protocol !== 'file:') return;
    if (u.protocol !== location.protocol) return;
    var file = (u.pathname.split('/').pop() || 'index.html');
    if (!(file in PAGES)) return;
    var here = location.pathname.split('/').pop() || 'index.html';
    if (file === here && u.hash) return;
    if (file === here && !u.hash) { e.preventDefault(); closeMenu(); if (lenis) lenis.scrollTo(0); else scrollTo(0, 0); return; }
    e.preventDefault();
    try { sessionStorage.setItem('ds-pt', PAGES[file]); } catch (er) {}
    closeMenu(); ptWord(PAGES[file]); pt.classList.add('go'); void pt.offsetWidth; pt.classList.add('cover'); sfx.whoosh();
    if (lenis) lenis.stop();
    setTimeout(function () { location.href = u.href; }, 700);
  });
  addEventListener('pageshow', function (e) { if (e.persisted) { pt.classList.remove('go', 'cover', 'lift'); root.classList.remove('pt-on'); if (lenis) lenis.start(); } });
  return p;
}

/* ─────────────── open status (Riyadh time) ─────────────── */
var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function riyadh() {
  try { var p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Riyadh', hour: 'numeric', minute: 'numeric', weekday: 'long', hour12: false }).formatToParts(new Date()), o = {}; p.forEach(function (x) { o[x.type] = x.value; }); return { h: (+o.hour) % 24, m: +o.minute, d: o.weekday }; }
  catch (e) { var d = new Date(); return { h: d.getHours(), m: d.getMinutes(), d: DAYS[d.getDay()] }; }
}
function isOpen() { var t = riyadh(), m = t.h * 60 + t.m; return m >= C.open && m < C.close; }
function hoursHTML() { var t = riyadh(); return ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(function (d) { return '<div' + (d === t.d ? ' class="today"' : '') + '><b>' + d + '</b><span>6:00 AM – 11:30 PM</span></div>'; }).join(''); }
function status() {
  var t = riyadh(), m = t.h * 60 + t.m, open = isOpen(), soon = open && m >= C.close - 60;
  var txt = open ? (soon ? 'Closing soon · 11:30 PM' : 'Open now · till 11:30 PM') : 'Closed · opens 6 AM';
  $$('[data-open]').forEach(function (el) { el.classList.toggle('is-open', open); var s = $('[data-open-txt]', el) || el; s.textContent = el.hasAttribute('data-short') ? (open ? (soon ? 'Closing soon' : 'Open now') : 'Opens 6 AM') : txt; });
  $$('[data-hours]').forEach(function (el) { el.innerHTML = hoursHTML(); });
  return open;
}
status(); setInterval(status, 60000);

/* ─────────────── cart ─────────────── */
var cart = []; try { cart = JSON.parse(localStorage.getItem('ds-cart') || '[]'); } catch (e) { cart = []; }
function item(id) { for (var i = 0; i < DS.MENU.length; i++) if (DS.MENU[i].id === id) return DS.MENU[i]; return null; }
cart = cart.filter(function (c) { return item(c.id); });
function qtyOf(id) { var c = cart.find(function (x) { return x.id === id; }); return c ? c.q : 0; }
function saveCart() { try { localStorage.setItem('ds-cart', JSON.stringify(cart)); } catch (e) {} }
function setQty(id, q, silent) {
  var c = cart.find(function (x) { return x.id === id; });
  if (q <= 0) cart = cart.filter(function (x) { return x.id !== id; });
  else if (c) c.q = q; else cart.push({ id: id, q: q });
  saveCart(); paintCart(); paintButtons();
  if (!silent && q > 0) { var it = item(id); toast(it.n + ' · ' + q + ' in your order'); sfx.sizzle(); bump(); }
}
function bump() { $$('[data-count]').forEach(function (c) { c.classList.remove('show'); void c.offsetWidth; c.classList.add('show'); }); }
function priceHTML(it) { return it.p ? '<span class="price">SAR ' + it.p + '</span>' : '<span class="price ask">Price on<br>WhatsApp</span>'; }
function ctl(it) {
  var q = qtyOf(it.id);
  return q ? '<span class="stepper" data-ctl="' + it.id + '"><button type="button" data-dec="' + it.id + '" aria-label="One less ' + esc(it.n) + '">−</button><span>' + q + '</span><button type="button" data-inc="' + it.id + '" aria-label="One more ' + esc(it.n) + '">+</button></span>'
    : '<button type="button" class="add-btn" data-ctl="' + it.id + '" data-inc="' + it.id + '" aria-label="Add ' + esc(it.n) + ' to your order">' + ICON.plus + 'Add</button>';
}
function media(it, cls) {
  return it.img ? '<div class="' + cls + '"><img src="' + it.img + '" alt="' + esc(it.n) + '" loading="lazy" decoding="async" style="object-position:' + (it.pos || '50% 50%') + '">' + (it.tag && cls === 'dish-img' ? '<span class="dish-tag">' + it.tag + '</span>' : '') + '</div>'
    : '<div class="' + cls + ' type"><span>' + it.u + '</span>' + (it.tag && cls === 'dish-img' ? '<span class="dish-tag">' + it.tag + '</span>' : '') + '</div>';
}
DS.dishCard = function (it, i) {
  return '<article class="dish glass" data-rv style="--d:' + ((i || 0) % 4 * .06) + 's" data-name="' + esc((it.n + ' ' + it.u + ' ' + it.d).toLowerCase()) + '">' + media(it, 'dish-img') +
    '<div class="dish-body"><h3>' + esc(it.n) + '<small>' + it.u + '</small></h3><p>' + esc(it.d) + '</p><div class="dish-foot">' + priceHTML(it) + ctl(it) + '</div></div></article>';
};
function paintButtons() { $$('[data-ctl]').forEach(function (el) { var it = item(el.getAttribute('data-ctl')); if (!it) return; var t = document.createElement('div'); t.innerHTML = ctl(it); el.replaceWith(t.firstChild); }); }
document.addEventListener('click', function (e) {
  var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
  if (inc) { var id = inc.getAttribute('data-inc'); setQty(id, qtyOf(id) + 1); }
  else if (dec) { var id2 = dec.getAttribute('data-dec'); setQty(id2, qtyOf(id2) - 1, true); sfx.pop(); }
});
function paintCart() {
  var count = cart.reduce(function (s, i) { return s + i.q; }, 0);
  $$('[data-count]').forEach(function (c) { c.textContent = count; c.classList.toggle('show', count > 0); });
  var sub = $('#cartSub'); if (!sub) return;
  sub.textContent = count ? count + (count > 1 ? ' items' : ' item') + ' · total confirmed on WhatsApp' : 'Nothing yet';
  $('#orderForm').hidden = !count; $('#cartFoot').hidden = !count;
  var box = $('#cartItems');
  if (!count) { box.innerHTML = '<div class="empty"><b>بھوک لگی؟</b><p>Your order is empty.<br>Add something from the menu.</p><a class="btn btn-gold btn-sm" href="menu.html">Open the menu</a></div>'; return; }
  box.innerHTML = cart.map(function (c) {
    var it = item(c.id);
    var im = it.img ? '<img src="' + it.img + '" alt="" style="object-position:' + (it.pos || '50% 50%') + '">' : '<span class="ph0">' + it.u + '</span>';
    return '<div class="ci">' + im + '<div><b>' + esc(it.n) + '</b><button type="button" class="rm" data-rm="' + it.id + '">Remove</button></div><div class="qty"><button type="button" data-dec="' + it.id + '" aria-label="One less">−</button><span>' + c.q + '</span><button type="button" data-inc="' + it.id + '" aria-label="One more">+</button></div></div>';
  }).join('');
}
var scrim = $('.scrim'), drawer = $('#cart'), chat = $('#chat');
function openCart() { closeChat(); closeMenu(); if (drawer.classList.contains('on')) return; drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); scrim.classList.add('on'); lock(true); sfx.open(); }
function closeCart() { if (!drawer || !drawer.classList.contains('on')) return; drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); if (!chat.classList.contains('on') || !isMobile()) scrim.classList.remove('on'); lock(false); sfx.close(); }
DS.openCart = openCart;
$$('[data-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
$('[data-close-cart]').addEventListener('click', closeCart);
scrim.addEventListener('click', function () { closeCart(); closeChat(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); closeChat(); closeMenu(); closeLB(); } });
$('#cartItems').addEventListener('click', function (e) { var r = e.target.closest('[data-rm]'); if (r) { setQty(r.getAttribute('data-rm'), 0, true); sfx.pop(); } });
$$('input[name=otype]').forEach(function (r) { r.addEventListener('change', function () { $('#addrF').hidden = $('input[name=otype]:checked').value !== 'Delivery'; }); });
function need(el, ok) { el.classList.toggle('err', !ok); return ok; }
$('#orderForm').addEventListener('submit', function (e) {
  e.preventDefault(); var f = e.target, type = f.otype.value;
  var ok = need(f.name, f.name.value.trim().length > 1) & need(f.phone, f.phone.value.replace(/\D/g, '').length >= 9) & (type !== 'Delivery' || need(f.addr, f.addr.value.trim().length > 4));
  if (!ok) { toast('Please fill in the highlighted fields'); return; }
  var lines = ['Assalam o Alaikum Desi Sawad! New order from the website:', ''].concat(cart.map(function (c) { return '• ' + c.q + ' × ' + item(c.id).n; }), ['', 'Name: ' + f.name.value.trim(), 'Phone: ' + f.phone.value.trim(), 'Type: ' + type]);
  if (type === 'Delivery') lines.push('Address: ' + f.addr.value.trim());
  if (f.note.value.trim()) lines.push('Notes: ' + f.note.value.trim());
  lines.push('', 'Please confirm the total. Shukriya!');
  window.open(wa(lines.join('\n')), '_blank', 'noopener'); sfx.chime(); toast('Opening WhatsApp…');
});

/* ─────────────── toast ─────────────── */
var tt; function toast(m) { var t = $('#toast'); if (!t) return; t.innerHTML = '<i>' + ICON.check + '</i>' + esc(m); t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2300); }
DS.toast = toast;

/* ─────────────── chat concierge ─────────────── */
var chatB = $('#chatB'), chatI = $('#chatI');
function now() { var d = new Date(); return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function scrollChat() { requestAnimationFrame(function () { chatB.scrollTop = chatB.scrollHeight; }); }
function addMsg(html, who) { var m = document.createElement('div'); m.className = 'msg ' + who; m.innerHTML = html + '<time>' + now() + '</time>'; chatB.appendChild(m); scrollChat(); return m; }
function addRich(html) { var m = document.createElement('div'); m.className = 'msg rich'; m.innerHTML = html; chatB.appendChild(m); scrollChat(); return m; }
function rich(e) {
  if (!e.type) return '';
  if (e.type === 'hours') return '<div class="rcard glass"><h5><span class="live" data-open style="height:26px;padding:0 10px"><i class="dot"></i><span data-open-txt></span></span></h5><div class="hours">' + hoursHTML() + '</div></div>';
  if (e.type === 'location') return '<div class="rcard glass"><h5>' + ICON.pin.replace('<svg', '<svg width="18" height="18" style="color:var(--gold)"') + 'Desi Sawad</h5><p>' + C.address + '</p><div class="acts" style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap"><a class="btn btn-gold btn-sm" href="' + C.maps + '" target="_blank" rel="noopener">Directions</a><a class="btn btn-sm" href="tel:' + C.tel + '">Call</a></div></div>';
  if (e.type === 'dishes') return '<div class="dcar">' + e.ids.map(function (id) { var it = item(id); if (!it) return ''; return '<div class="dmini glass">' + (it.img ? '<div class="im"><img src="' + it.img + '" alt="" style="object-position:' + (it.pos || '50% 50%') + '"></div>' : '<div class="im"><span>' + it.u + '</span></div>') + '<div class="t"><b>' + esc(it.n) + '</b><small>' + it.u + '</small>' + ctl(it) + '</div></div>'; }).join('') + '</div>';
  if (e.type === 'book') return '<div class="rcard glass"><h5>' + ICON.cal.replace('<svg', '<svg width="18" height="18" style="color:var(--gold)"') + 'Book a table</h5><p>Tables or majlis seating. Confirmed on WhatsApp.</p><div style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap"><a class="btn btn-gold btn-sm" href="reserve.html">Book now</a><a class="btn btn-sm" href="tel:' + C.tel + '">Call</a></div></div>';
  if (e.type === 'order') return '<div class="rcard glass"><h5>' + ICON.bag.replace('<svg', '<svg width="18" height="18" style="color:var(--gold)"') + 'Build your order</h5><p>' + (cart.length ? 'You have ' + cart.reduce(function (s, i) { return s + i.q; }, 0) + ' item(s) in your order.' : 'Your order is empty right now.') + '</p><div style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap"><a class="btn btn-gold btn-sm" href="menu.html">Open menu</a>' + (cart.length ? '<button class="btn btn-sm" type="button" data-cart-open>View order</button>' : '') + '</div></div>';
  if (e.type === 'wa') return '<div class="rcard glass"><h5>' + ICON.wa.replace('<svg', '<svg width="18" height="18" style="color:#2bb463"') + 'Chat with the team</h5><p>Usually answered within minutes.</p><div style="display:flex;gap:7px;margin-top:12px"><a class="btn btn-wa btn-sm" href="https://wa.me/' + C.wa + '" target="_blank" rel="noopener">WhatsApp us</a></div></div>';
  return '';
}
function norm(s) { return ' ' + s.toLowerCase().replace(/[^\w\s؀-ۿ]/g, ' ').replace(/\s+/g, ' ') + ' '; }
function lev(a, b) { if (Math.abs(a.length - b.length) > 2) return 9; var m = [], i, j; for (i = 0; i <= b.length; i++) m[i] = [i]; for (j = 0; j <= a.length; j++) m[0][j] = j; for (i = 1; i <= b.length; i++) for (j = 1; j <= a.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (b[i - 1] === a[j - 1] ? 0 : 1)); return m[b.length][a.length]; }
function match(q) {
  var s = norm(q), words = s.trim().split(' '), best = null, score = 0;
  DS.KB.forEach(function (e) {
    var sc = 0;
    e.k.forEach(function (k) {
      if (k.indexOf(' ') > -1 || /[؀-ۿ]/.test(k)) { if (s.indexOf(k) > -1) sc += 3; return; }
      words.forEach(function (w) { if (w === k) sc += k.length > 3 ? 3 : 2; else if (k.length > 4 && w.length > 3 && lev(w, k) <= 1) sc += 2; else if (k.length > 4 && w.indexOf(k) === 0) sc += 2; });
    });
    if (sc > score) { score = sc; best = e; }
  });
  return best;
}
function ask(q) {
  q = q.trim(); if (!q) return;
  var w = $('.welcome', chatB); if (w) w.remove();
  addMsg(esc(q), 'u'); sfx.send();
  var ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>'; chatB.appendChild(ty); scrollChat();
  setTimeout(function () {
    ty.remove(); var e = match(q);
    if (e) { addMsg(e.a, 'b'); var r = rich(e); if (r) { addRich(r); status(); } }
    else { addMsg('Good question. Let me pass that to the team so they can answer properly.', 'b'); addRich('<div class="rcard glass"><h5>' + ICON.wa.replace('<svg', '<svg width="18" height="18" style="color:#2bb463"') + 'Ask the team</h5><p>Your question is ready to send.</p><div style="display:flex;gap:7px;margin-top:12px"><a class="btn btn-wa btn-sm" href="' + wa('Assalam o Alaikum! I have a question from the website: ' + q) + '" target="_blank" rel="noopener">Send on WhatsApp</a></div></div>'); }
    sfx.pop();
  }, 520 + Math.random() * 380);
}
function welcome() {
  chatB.innerHTML = '<span class="day">Today</span><div class="welcome"><h3>Salam! <em>kya khayenge?</em></h3><p>I am the Desi Sawad concierge. Order, book a table or ask anything. English, Roman Urdu or Urdu, all fine.</p><div class="qa">' +
    '<button class="glass" type="button" data-q="Show me the menu">' + ICON.bag + '<span>Order food<small>Add dishes, send on WhatsApp</small></span></button>' +
    '<button class="glass" type="button" data-q="Book a table">' + ICON.cal + '<span>Book a table<small>Tables or majlis</small></span></button>' +
    '<button class="glass" type="button" data-q="What are your timings?">' + ICON.clock + '<span>Timings<small>Live open status</small></span></button>' +
    '<button class="glass" type="button" data-q="Where are you located?">' + ICON.pin + '<span>Directions<small>As Sulay, Riyadh</small></span></button></div></div>';
}
function openChat() {
  closeCart(); closeMenu(); if (chat.classList.contains('on')) return;
  chat.classList.add('on'); chat.setAttribute('aria-hidden', 'false'); if (isMobile()) { scrim.classList.add('on'); lock(true); }
  if (!chatB.children.length) welcome(); sfx.open(); setTimeout(function () { if (FINE) chatI.focus(); }, 350);
}
function closeChat() { if (!chat || !chat.classList.contains('on')) return; chat.classList.remove('on'); chat.setAttribute('aria-hidden', 'true'); if (isMobile()) { if (!drawer.classList.contains('on')) scrim.classList.remove('on'); lock(false); } sfx.close(); }
DS.openChat = openChat;
$$('[data-chat]').forEach(function (b) { b.addEventListener('click', openChat); });
$('[data-close-chat]').addEventListener('click', closeChat);
$('[data-reset-chat]').addEventListener('click', function () { welcome(); sfx.pop(); });
$('#chatF').addEventListener('submit', function (e) { e.preventDefault(); ask(chatI.value); chatI.value = ''; });
$('#chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ask(b.textContent); });
chatB.addEventListener('click', function (e) {
  var q = e.target.closest('[data-q]'); if (q) { ask(q.getAttribute('data-q')); return; }
  if (e.target.closest('[data-cart-open]')) { openCart(); return; }
  var a = e.target.closest('a[href]'); if (a && !a.target) closeChat();
});

/* ─────────────── footer wordmark ─────────────── */
var fm = $('.foot-mark');
function fitMark() { if (!fm) return; fm.style.setProperty('--fms', '100px'); var w = $('.fm-o', fm).getBoundingClientRect().width, W = fm.parentNode.clientWidth; if (w && W) fm.style.setProperty('--fms', Math.min(300, 100 * W / w * .995).toFixed(1) + 'px'); }
function footFill() { if (!fm) return; if (RM) { fm.style.setProperty('--fl', 1); return; } var r = fm.getBoundingClientRect(), h = innerHeight, max = document.documentElement.scrollHeight - h, start = Math.min(r.top + scrollY - h, max - 1), p = Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, max - start))); fm.style.setProperty('--fl', (p * p * (3 - 2 * p)).toFixed(3)); }
fitMark(); addEventListener('resize', fitMark); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMark);
$$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });

/* ─────────────── tilt + glare ─────────────── */
if (FINE && !RM) $$('[data-tilt]').forEach(function (t) {
  t.addEventListener('pointermove', function (e) { var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; t.style.setProperty('--ry', ((x - .5) * 8).toFixed(2) + 'deg'); t.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg'); t.style.setProperty('--gx', (x * 100) + '%'); t.style.setProperty('--gy', (y * 100) + '%'); });
  t.addEventListener('pointerleave', function () { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
});
/* page hero parallax */
var phImg = $('.phero .bgimg img');
if (phImg && !RM) addEventListener('scroll', function () { var y = scrollY; if (y < innerHeight) phImg.style.transform = 'scale(1.08) translate3d(0,' + (y * .18).toFixed(1) + 'px,0)'; }, { passive: true });
/* lazy map */
$$('iframe[data-src]').forEach(function (f) { if (!('IntersectionObserver' in window)) { f.src = f.dataset.src; return; } new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { f.src = f.dataset.src; o.disconnect(); } }, { rootMargin: '500px' }).observe(f); });
if (!FINE) $$('.hint-txt').forEach(function (h) { h.textContent = h.textContent.replace('Drag', 'Swipe'); });
$$('[data-maps]').forEach(function (a) { a.href = C.maps; });

/* ─────────────── lightbox (gallery + previews) ─────────────── */
var lb = $('#lb'), lbList = [], lbI = 0;
function lbShow(i, dir) {
  if (!lbList.length) return; lbI = (i + lbList.length) % lbList.length; var g = lbList[lbI], img = $('.lb-stage img', lb);
  img.style.opacity = 0; img.style.transform = 'translateX(' + (dir || 0) * 40 + 'px) scale(.97)';
  setTimeout(function () { img.src = g.f; img.alt = g.t; img.onload = function () { img.style.opacity = 1; img.style.transform = 'none'; }; if (img.complete) { img.style.opacity = 1; img.style.transform = 'none'; } }, 160);
  $('.lb-cap b', lb).textContent = g.t; $('.lb-cap span', lb).textContent = g.s; $('#lbN').textContent = String(lbI + 1).padStart(2, '0') + ' / ' + String(lbList.length).padStart(2, '0');
  $$('.lb-thumbs button', lb).forEach(function (b, k) { b.classList.toggle('on', k === lbI); if (k === lbI) b.scrollIntoView({ block: 'nearest', inline: 'center' }); });
}
function openLB(list, i) {
  if (!lb) return; lbList = list;
  $('.lb-thumbs', lb).innerHTML = list.map(function (g, k) { return '<button type="button" data-k="' + k + '" aria-label="' + esc(g.t) + '"><img src="' + g.f + '" alt="" loading="lazy"></button>'; }).join('');
  lb.classList.add('on'); lb.setAttribute('aria-hidden', 'false'); lock(true); lbShow(i, 0); sfx.open();
}
function closeLB() { if (!lb || !lb.classList.contains('on')) return; lb.classList.remove('on'); lb.setAttribute('aria-hidden', 'true'); lock(false); sfx.close(); }
DS.openLB = openLB;
if (lb) {
  $('.lb-prev', lb).addEventListener('click', function () { lbShow(lbI - 1, -1); sfx.tick(); });
  $('.lb-next', lb).addEventListener('click', function () { lbShow(lbI + 1, 1); sfx.tick(); });
  $('[data-close-lb]', lb).addEventListener('click', closeLB);
  $('.lb-thumbs', lb).addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) lbShow(+b.getAttribute('data-k'), 0); });
  document.addEventListener('keydown', function (e) { if (!lb.classList.contains('on')) return; if (e.key === 'ArrowRight') lbShow(lbI + 1, 1); if (e.key === 'ArrowLeft') lbShow(lbI - 1, -1); });
  var sx = 0, st = $('.lb-stage', lb);
  st.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  st.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) lbShow(lbI + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); else if (Math.abs(dx) < 5 && e.target === st) closeLB(); });
  st.addEventListener('click', function (e) { if (e.target === st) closeLB(); });
}
$$('[data-lb]').forEach(function (a) {
  a.addEventListener('click', function (e) { e.preventDefault(); var f = a.getAttribute('data-lb'); var list = DS.GALLERY; var i = list.findIndex(function (g) { return g.f === f; }); openLB(list, Math.max(0, i)); });
});

/* ─────────────── forms: reserve + contact ─────────────── */
var rf = $('#resForm');
if (rf) {
  var t = $('#rTime'), opts = []; for (var m = 7 * 60; m <= 23 * 60; m += 30) { var h = Math.floor(m / 60), mi = m % 60, h12 = ((h + 11) % 12) + 1; opts.push(h12 + ':' + (mi ? '30' : '00') + (h < 12 ? ' AM' : ' PM')); }
  t.innerHTML = opts.map(function (o) { return '<option' + (o === '8:00 PM' ? ' selected' : '') + '>' + o + '</option>'; }).join('');
  var d = $('#rDate'), n0 = new Date(), iso = new Date(n0.getTime() - n0.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); d.min = iso; d.value = iso;
  var g = $('#rGuests'); $$('[data-g]').forEach(function (b) { b.addEventListener('click', function () { g.value = Math.max(1, Math.min(40, (+g.value || 2) + (+b.getAttribute('data-g')))); sfx.tick(); }); });
  rf.addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target;
    var ok = need(f.name, f.name.value.trim().length > 1) & need(f.phone, f.phone.value.replace(/\D/g, '').length >= 9) & need(f.date, !!f.date.value);
    if (!ok) { toast('Please fill in the highlighted fields'); return; }
    var dt = new Date(f.date.value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var lines = ['Assalam o Alaikum Desi Sawad! I would like to book a table.', '', 'Name: ' + f.name.value.trim(), 'Phone: ' + f.phone.value.trim(), 'Date: ' + dt, 'Time: ' + f.time.value, 'Guests: ' + f.guests.value, 'Seating: ' + f.seat.value];
    if (cart.length) lines.push('Pre-order: ' + cart.map(function (c) { return c.q + ' × ' + item(c.id).n; }).join(', '));
    if (f.note.value.trim()) lines.push('Note: ' + f.note.value.trim());
    window.open(wa(lines.join('\n')), '_blank', 'noopener'); sfx.chime(); toast('Opening WhatsApp…');
  });
}
var cf = $('#contactForm');
if (cf) cf.addEventListener('submit', function (e) {
  e.preventDefault(); var f = e.target;
  var ok = need(f.name, f.name.value.trim().length > 1) & need(f.msg, f.msg.value.trim().length > 3);
  if (!ok) { toast('Please fill in the highlighted fields'); return; }
  window.open(wa('Assalam o Alaikum Desi Sawad!\n\n' + f.msg.value.trim() + '\n\n— ' + f.name.value.trim() + (f.phone.value.trim() ? ' (' + f.phone.value.trim() + ')' : '')), '_blank', 'noopener'); sfx.chime(); toast('Opening WhatsApp…');
});

/* ─────────────── preloader (home, first visit) ─────────────── */
function loader() {
  if (!$('.ldx')) return Promise.resolve();
  var on = root.classList.contains('ld-on'), parts = $$('.ldx-fill,.ldx-ink,.ldx-m');
  function kill() { parts.forEach(function (p) { p.remove(); }); root.classList.remove('ld-on'); }
  try { sessionStorage.setItem('ds-seen', '1'); } catch (e) {}
  if (!on || RM || !window.gsap) { kill(); return Promise.resolve(); }
  lock(true); scrollTo(0, 0);
  var fill = $('.ldx-fill'), ink = $('.ldx-ink'), gold = $('.ldx-gold'), N = $('#ldN');
  var L = $$('.ldx-ink .ldx-w i'), sub = $('.ldx-ink .ldx-s span'), metas = $$('.ldx-m');
  gsap.set(L, { yPercent: 118 }); gsap.set(sub, { yPercent: 120 }); gsap.set(metas, { autoAlpha: 0, y: 10 });
  gsap.set(['.nav', '.dock', '.chat-fab'], { autoAlpha: 0 });
  var st = { lv: 0, ps: 1.34 };
  function paint() { gold.style.setProperty('--lv', st.lv.toFixed(2)); gold.style.setProperty('--ps', st.ps.toFixed(3)); N.textContent = String(Math.round(st.lv)).padStart(3, '0'); }
  var fonts = Promise.race([document.fonts && document.fonts.load ? document.fonts.load('900 100px "Display"') : Promise.resolve(), new Promise(function (r) { setTimeout(r, 1000); })]);
  gsap.ticker.lagSmoothing(400, 33);
  return fonts.then(function () { return new Promise(function (res) {
    var E = 'expo.out';
    gsap.timeline({ onComplete: kill })
      .to(metas, { autoAlpha: 1, y: 0, duration: .8, ease: E, stagger: .06 }, 0)
      .to(L, { yPercent: 0, duration: 1.15, ease: E, stagger: .08 }, .1)
      .to(sub, { yPercent: 0, duration: 1, ease: E }, .7)
      .to(st, { lv: 100, duration: 2.4, ease: 'power2.inOut', onUpdate: paint }, .3)
      .to(st, { ps: 1.05, duration: 3.3, ease: 'power1.inOut', onUpdate: paint }, 0)
      .add(function () { var I = $('.ldx-ink .ldx-i').getBoundingClientRect(); gsap.set([ink, fill], { transformOrigin: (I.left + I.width / 2) + 'px ' + (I.top + I.height * .5) + 'px' }); sfx.whoosh(); }, 2.9)
      .to(metas, { autoAlpha: 0, y: -8, duration: .35, ease: 'power2.in' }, 2.9)
      .to([ink, fill], { scale: 90, duration: 1.35, ease: 'expo.in' }, 2.95)
      .to(fill, { opacity: 0, duration: .5, ease: 'power2.in' }, 3.3)
      .add(function () { lock(false); res(); }, 3.35)
      .to(['.nav', '.dock', '.chat-fab'], { autoAlpha: 1, duration: .9, ease: 'power2.out', clearProps: 'opacity,visibility' }, 3.55)
      .set(ink, { autoAlpha: 0 }, 4.3);
  }); });
}

/* ─────────────── hero embers ─────────────── */
function embers() {
  var cv = $('#embers'); if (!cv || RM) return; var g = cv.getContext('2d'), W, H, dpr = Math.min(devicePixelRatio || 1, 2), P = [], vis = true;
  function size() { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);
  var N = isMobile() ? 34 : 70;
  function spawn(p, init) { p.x = W * (isMobile() ? .5 : .74) + (Math.random() - .5) * W * (isMobile() ? .7 : .4); p.y = init ? Math.random() * H : H * (isMobile() ? .78 : .86) + Math.random() * 40; p.vy = .3 + Math.random() * .9; p.vx = (Math.random() - .5) * .3; p.r = .6 + Math.random() * 1.8; p.life = 0; p.max = 200 + Math.random() * 260; p.w = Math.random() * 6.28; return p; }
  for (var i = 0; i < N; i++) P.push(spawn({}, true));
  new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) requestAnimationFrame(tick); }).observe(cv);
  function tick() {
    if (!vis) return; g.clearRect(0, 0, W, H);
    var light = root.getAttribute('data-theme') === 'light';
    g.globalCompositeOperation = light ? 'source-over' : 'lighter';
    P.forEach(function (p) {
      p.life++; p.y -= p.vy; p.w += .03; p.x += p.vx + Math.sin(p.w) * .35;
      var a = Math.sin(Math.PI * Math.min(1, p.life / p.max)); if (p.life > p.max || p.y < -10) spawn(p);
      var gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      gr.addColorStop(0, 'rgba(255,' + (170 + (p.r * 30 | 0)) + ',110,' + (a * (light ? .55 : .9)).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(226,89,47,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, p.r * 5, 0, 6.283); g.fill();
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ─────────────── page modules ─────────────── */
function homePage() {
  var sig = $('#sigGrid'); if (sig) sig.innerHTML = ['seekh', 'karahi', 'biryani', 'malai'].map(function (id, i) { return DS.dishCard(item(id), i); }).join('');
  /* flavour switchers for the 3D dish chapters */
  var COPY = {
    karahi: { chicken: { u: 'دل چاہے پھر سے', c: 'Cooked in the black iron karahi and brought to the table in it. Tomato, ginger and green chilli, reduced until the oil rises to the top.', a: 'chicken-karahi.webp', b: 'white-karahi.webp', ca: 'Chicken karahi', cb: 'White karahi' },
      white: { u: 'ہر چمچ میں سکون', c: 'A spoonful of comfort. Chicken simmered in cream, yoghurt and black pepper, finished with green chilli. Mild on heat, big on flavour.', a: 'white-karahi.webp', b: 'chicken-karahi.webp', ca: 'White karahi', cb: 'Chicken karahi' } },
    glass: { mint: { c: 'Crushed ice, fresh mint and lime, blended green. The one you order before the grill arrives, and again after it does.' },
      melon: { c: 'Fresh watermelon blended over crushed ice. Sweet, bright red and cold enough to put the fire out.' } }
  };
  $$('.flav').forEach(function (b) {
    b.addEventListener('click', function () {
      var dish = b.dataset.dish, fl = b.dataset.flav, c = COPY[dish][fl];
      $$('.flav[data-dish="' + dish + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var u = $('[data-flav-urdu="' + dish + '"]'), cp = $('[data-flav-copy="' + dish + '"]');
      if (u && c.u) u.textContent = c.u; if (cp) cp.textContent = c.c;
      if (c.a) { var A = $('[data-flav-a]'), B = $('[data-flav-b]'); [A, B].forEach(function (i) { i.style.opacity = 0; }); setTimeout(function () { A.src = c.a; B.src = c.b; $('[data-cap-a]').textContent = c.ca; $('[data-cap-b]').textContent = c.cb; [A, B].forEach(function (i) { i.style.opacity = 1; }); }, 260); }
      if (window.DS3D) DS3D.flavor(dish, fl); sfx.sizzle();
    });
  });
  embers();
}
function menuPage() {
  var box = $('#menuBox'), cats = $('#cats');
  cats.innerHTML = DS.CATS.map(function (c, i) { return '<button class="cat" role="tab" type="button" data-cat="' + c.id + '" aria-selected="' + (i === 0) + '">' + c.name + '</button>'; }).join('');
  box.innerHTML = DS.CATS.map(function (c) {
    var items = DS.MENU.filter(function (m) { return m.cat === c.id; });
    return '<section class="mcat" id="cat-' + c.id + '" data-cat-sec="' + c.id + '"><div class="mcat-h"><h2>' + c.name + ' <em>' + c.em + '</em></h2><span>' + c.u + '</span></div><div class="dgrid">' + items.map(DS.dishCard).join('') + '</div></section>';
  }).join('') + '<p class="empty-search" id="noRes" hidden>Nothing matches that. Try “karahi”, “seekh” or ask us in the chat.</p>';
  observe(box);
  cats.addEventListener('click', function (e) { var b = e.target.closest('.cat'); if (!b) return; var s = $('#cat-' + b.dataset.cat); if (lenis) lenis.scrollTo(s, { offset: -(nav.offsetHeight + $('.mbar').offsetHeight + 40), duration: 1.1 }); else s.scrollIntoView({ behavior: 'smooth' }); });
  var secs = $$('[data-cat-sec]');
  function spy() { var y = innerHeight * .35, cur = secs[0]; secs.forEach(function (s) { if (s.getBoundingClientRect().top < y) cur = s; }); $$('.cat', cats).forEach(function (b) { var on = b.dataset.cat === cur.dataset.catSec; if (on && b.getAttribute('aria-selected') !== 'true') b.scrollIntoView({ block: 'nearest', inline: 'center' }); b.setAttribute('aria-selected', on); }); }
  addEventListener('scroll', function () { requestAnimationFrame(spy); }, { passive: true });
  $('#q').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase(), any = false;
    $$('.dish', box).forEach(function (d) { var hit = !q || d.dataset.name.indexOf(q) > -1; d.hidden = !hit; if (hit) { d.classList.add('in'); any = true; } });
    secs.forEach(function (s) { s.hidden = !$$('.dish', s).some(function (d) { return !d.hidden; }); });
    $('#noRes').hidden = any;
  });
}
function galleryPage() {
  var m = $('#masonry'), list = DS.GALLERY;
  m.innerHTML = list.map(function (g, i) { return '<a class="mitem" href="' + g.f + '" data-c="' + g.c + '" data-i="' + i + '" data-rv style="--d:' + (i % 4 * .05) + 's"><img src="' + g.f + '" alt="' + esc(g.t + ' — ' + g.s) + '" loading="lazy" decoding="async"><span class="mcap">' + esc(g.t) + '<small>' + esc(g.s) + '</small></span></a>'; }).join('');
  observe(m);
  var cur = 'all';
  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('.cat'); if (!b) return; cur = b.dataset.f;
    $$('.cat', this).forEach(function (x) { x.setAttribute('aria-selected', x === b); });
    $$('.mitem', m).forEach(function (it) { var show = cur === 'all' || it.dataset.c === cur; it.classList.toggle('out', !show); });
  });
  m.addEventListener('click', function (e) {
    var a = e.target.closest('.mitem'); if (!a) return; e.preventDefault();
    var vis = list.filter(function (g) { return cur === 'all' || g.c === cur; });
    openLB(vis, vis.indexOf(list[+a.dataset.i]));
  });
}

/* ─────────────── boot ─────────────── */
paintCart();
if (PAGE === 'home') homePage();
if (PAGE === 'menu') menuPage();
if (PAGE === 'gallery') galleryPage();
paintButtons(); onScroll();
var hasLoader = !!$('.ldx') && root.classList.contains('ld-on');
Promise.all([loader(), curtain()]).then(function () { revealHero(); observe(document); });
if (!hasLoader && !root.classList.contains('pt-on')) { revealHero(); }
})();
