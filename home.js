/* ==========================================================================
   HOME — Hero intro · About scroll-lit text · Skills marquee · Projects parallax
   Plain JS, no dependencies. Loaded by index.html after script.js / mobile.js.
   ========================================================================== */
(function () {
    'use strict';

    var html = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

    /* ---------- tiny count-up used by the hero stats ---------- */
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var start = performance.now(), dur = 1400;
        (function tick(now) {
            var p = Math.min((now - start) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
        })(start);
    }

    /* ======================================================================
       HERO — scramble "HELLO WORLD" into the name, then raise the portrait
       ====================================================================== */
    function initHero() {
        var hero = document.querySelector('.hero');
        var h1 = document.getElementById('heroName');
        var txt = document.getElementById('heroNameText');
        if (!hero || !h1 || !txt) return;

        var START = h1.getAttribute('data-start') || '';
        var END = h1.getAttribute('data-end') || txt.textContent;
        var animate = html.classList.contains('hero-anim');
        var heroCounts = hero.querySelectorAll('[data-count]');

        function finish() {
            hero.classList.add('is-play', 'is-done');
            html.classList.remove('hero-lock');
            txt.textContent = END;
            h1.style.minWidth = '';
        }

        if (!animate) {
            txt.textContent = END;
            hero.classList.add('is-play', 'is-done');
            // stats count when they scroll into view (hero is visible on load)
            heroCounts.forEach(countUp);
            return;
        }

        window.scrollTo(0, 0);
        txt.textContent = START;

        // Lock the name's width to the wider of the two strings so the
        // centred text doesn't jitter while letters swap (desktop only —
        // below 900px the name wraps onto two lines anyway).
        function lockWidth() {
            if (window.innerWidth < 900) return;
            var probe = document.createElement('span');
            probe.setAttribute('aria-hidden', 'true');
            probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0;' +
                'font:inherit;letter-spacing:inherit;text-transform:inherit;';
            h1.appendChild(probe);
            var w = 0;
            [START, END].forEach(function (t) { probe.textContent = t; w = Math.max(w, probe.offsetWidth); });
            h1.removeChild(probe);
            h1.style.minWidth = Math.ceil(w) + 'px';
        }

        // Wait for the portrait + fonts (bounded), then play.
        var img = hero.querySelector('.hero-portrait img');
        var imgReady = new Promise(function (res) {
            if (!img || img.complete) return res();
            img.addEventListener('load', res);
            img.addEventListener('error', res);
        });
        var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
        var minDelay = new Promise(function (res) { setTimeout(res, 900); });
        var cap = new Promise(function (res) { setTimeout(res, 3500); });

        Promise.race([Promise.all([imgReady, fontsReady, minDelay]), cap]).then(function () {
            lockWidth();
            var len = Math.max(START.length, END.length);
            var it = 0;
            var timer = setInterval(function () {
                it += 0.5;
                var cut = Math.floor(it), s = '';
                for (var i = 0; i < len; i++) {
                    s += i < cut ? (END.charAt(i) || '') : (START.charAt(i) || '');
                }
                txt.textContent = s;
                if (cut >= len) {
                    clearInterval(timer);
                    txt.textContent = END;
                    setTimeout(play, 200);
                }
            }, 40);
        });

        function play() {
            hero.classList.add('is-play');
            setTimeout(function () { heroCounts.forEach(countUp); }, 1700);
            // unlock scrolling when the portrait has landed
            setTimeout(finish, 2700);
        }

        // hard failsafe
        setTimeout(function () { if (!hero.classList.contains('is-done')) finish(); }, 8000);
    }

    /* ======================================================================
       ABOUT — words brighten as the paragraph scrolls through the viewport
       ====================================================================== */
    function initAboutScrub() {
        var p = document.getElementById('aboutText');
        if (!p) return;
        var words = Array.prototype.slice.call(p.querySelectorAll('.word'));
        var n = words.length;
        if (!n) return;

        if (reduceMotion) { words.forEach(function (w) { w.style.setProperty('--p', '1'); }); return; }

        var SPREAD = 8; // how many words are mid-fade at once
        var last = -1, ticking = false;

        function update() {
            ticking = false;
            var vh = window.innerHeight;
            var r = p.getBoundingClientRect();
            var startY = vh * 0.85, endY = vh * 0.55;
            var progress = clamp((startY - r.top) / (startY - endY + r.height), 0, 1);
            var key = Math.round(progress * 1000);
            if (key === last) return;
            last = key;
            for (var i = 0; i < n; i++) {
                var v = clamp((progress * (n + SPREAD) - i) / SPREAD, 0, 1);
                words[i].style.setProperty('--p', v.toFixed(3));
            }
        }
        function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    /* ======================================================================
       ABOUT — endless skills marquee (repeat each row to fill any screen)
       ====================================================================== */
    function initAboutMarquee() {
        var marquee = document.querySelector('.about-marquee');
        if (!marquee) return;
        var rows = Array.prototype.slice.call(marquee.querySelectorAll('.am-track'));
        var base = rows.map(function (t) { return t.innerHTML; });
        var SPEED = 55; // px per second

        function build() {
            var vw = window.innerWidth;
            rows.forEach(function (track, i) {
                track.innerHTML = base[i];
                var set = track.scrollWidth || 1;
                var reps = 2 * Math.max(1, Math.ceil(vw / set)) + 2; // even number of sets
                var out = '';
                for (var k = 0; k < reps; k++) out += base[i];
                track.innerHTML = out;
                track.style.setProperty('--dur', ((track.scrollWidth / 2) / SPEED).toFixed(1) + 's');
            });
        }

        build();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
        var t;
        window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
    }

    /* ======================================================================
       PROJECTS — gentle parallax on each screenshot
       ====================================================================== */
    function initProjectsParallax() {
        var items = Array.prototype.slice.call(document.querySelectorAll('.pj-item'));
        if (!items.length || reduceMotion) return;
        var imgs = items.map(function (it) { return it.querySelector('.pj-img'); });
        var ticking = false;

        function update() {
            ticking = false;
            var vh = window.innerHeight;
            var amp = window.innerWidth >= 900 ? 26 : 12;
            items.forEach(function (it, i) {
                var img = imgs[i];
                if (!img) return;
                var r = it.getBoundingClientRect();
                if (r.bottom < -100 || r.top > vh + 100) return;
                var t = clamp((vh - r.top) / (vh + r.height), 0, 1); // 0 → 1 as it scrolls through
                img.style.setProperty('--py', ((0.5 - t) * 2 * amp).toFixed(1));
            });
        }
        function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    function boot() {
        initHero();
        initAboutScrub();
        initAboutMarquee();
        initProjectsParallax();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
