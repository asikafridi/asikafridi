/* ==========================================================================
   MOBILE APP SHELL — dhushor.dev
   Builds the liquid-glass top bar, bottom tab bar and menu sheet, and wires
   up scroll-spy, theme sync and in-page navigation. Include it with
   <script src="mobile.js"></script> AFTER script.js on every page.

   The shell is always built, but mobile.css only displays it at <= 899px,
   so desktop layouts are unaffected. Nothing here depends on script.js
   except the theme toggle button, which we drive (click) so the existing
   theme logic and localStorage key stay the single source of truth.
   ========================================================================== */
(function () {
    'use strict';

    var PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (PAGE === '') PAGE = 'index.html';
    var IS_HOME = PAGE === 'index.html';
    var root = document.documentElement;

    // ---------------------------------------------------------------- data
    // Bottom tabs (5). `spy` lists the home-page section ids each tab owns.
    var TABS = [
        { id: 'home', label: 'Home', icon: 'fa-house', href: 'index.html', page: 'index.html' },
        { id: 'projects', label: 'Projects', icon: 'fa-folder-open', href: 'index.html#projects', page: 'index.html', section: 'projects' },
        { id: 'certs', label: 'Certs', icon: 'fa-certificate', href: 'certificates.html', page: 'certificates.html' },
        { id: 'videos', label: 'Videos', icon: 'fa-video', href: 'video.html', page: 'video.html' },
        { id: 'contact', label: 'Contact', icon: 'fa-envelope', href: 'index.html#contact', page: 'index.html', section: 'contact' }
    ];

    // Menu sheet tiles (app-icon grid)
    var TILES = [
        { label: 'Home', icon: 'fa-house', href: 'index.html', c: ['#f0b25a', '#dd7a3b'] },
        { label: 'About', icon: 'fa-user', href: 'index.html#about', section: 'about', c: ['#9d8cff', '#6d5bd0'] },
        { label: 'Experience', icon: 'fa-briefcase', href: 'index.html#experience', section: 'experience', c: ['#5fb3a3', '#2f8272'] },
        { label: 'Achievements', icon: 'fa-trophy', href: 'index.html#achievements', section: 'achievements', c: ['#f0b25a', '#b9741e'] },
        { label: 'Skills', icon: 'fa-code', href: 'index.html#skills', section: 'skills', c: ['#6f8cf0', '#4a5fd0'] },
        { label: 'Languages', icon: 'fa-language', href: 'index.html#languages', section: 'languages', c: ['#c97b84', '#b5566b'] },
        { label: 'Projects', icon: 'fa-folder-open', href: 'index.html#projects', section: 'projects', c: ['#5fb3a3', '#3a9a88'] },
        { label: 'Certificates', icon: 'fa-certificate', href: 'certificates.html', page: 'certificates.html', c: ['#dd9a3b', '#c97b84'] },
        { label: 'Videos', icon: 'fa-video', href: 'video.html', page: 'video.html', c: ['#9d8cff', '#c97b84'] },
        { label: 'Contact', icon: 'fa-envelope', href: 'index.html#contact', section: 'contact', c: ['#7fb87f', '#2f8272'] }
    ];

    var SOCIAL = [
        { icon: 'fab fa-github', href: 'https://github.com/asikafridi', label: 'GitHub' },
        { icon: 'fab fa-linkedin', href: 'https://linkedin.com/in/asikafridi', label: 'LinkedIn' },
        { icon: 'fas fa-envelope', href: 'mailto:asikurrahman.contact@gmail.com', label: 'Email' },
        { icon: 'fas fa-code', href: 'https://codeforces.com/profile/asikafridi', label: 'Codeforces' }
    ];

    // ------------------------------------------------------------- helpers
    function el(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html != null) n.innerHTML = html;
        return n;
    }
    function isLight() { return root.classList.contains('light-mode'); }
    function buzz() { if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) { } } }
    function topOffset() {
        var bar = document.querySelector('.m-topbar');
        return (bar ? bar.getBoundingClientRect().bottom : 70) + 8;
    }

    function scrollToSection(id) {
        var t = document.getElementById(id);
        if (!t) return false;
        var y = t.getBoundingClientRect().top + window.pageYOffset - topOffset();
        window.smoothScrollTo(Math.max(y, 0));
        return true;
    }

    // ------------------------------------------------------------- build UI
    var topbar = el('header', 'm-topbar');
    var tabbar = el('div', 'm-tabbar m-glass');
    var backdrop = el('div', 'm-backdrop');
    var sheet = el('aside', 'm-sheet m-glass');

    tabbar.setAttribute('role', 'navigation');
    tabbar.setAttribute('aria-label', 'Primary');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Menu');

    // Top bar
    var brand = el('a', 'm-brand m-glass', '<span class="m-brand-dot"></span>dhushor.dev');
    brand.href = 'index.html';
    brand.setAttribute('aria-label', 'dhushor.dev — home');

    var themeBtn = el('button', 'm-glass-btn m-glass m-theme', '<i class="fas fa-moon"></i>');
    themeBtn.type = 'button';
    themeBtn.setAttribute('aria-label', 'Toggle theme');

    var menuBtn = el('button', 'm-glass-btn m-glass m-menu-btn', '<span class="m-burger"><i></i><i></i><i></i></span>');
    menuBtn.type = 'button';
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.setAttribute('aria-expanded', 'false');

    var actions = el('div', 'm-top-actions');
    actions.appendChild(themeBtn);
    actions.appendChild(menuBtn);
    topbar.appendChild(brand);
    topbar.appendChild(actions);

    // Bottom tab bar
    var tabsWrap = el('div', 'm-tabs');
    var lens = el('span', 'm-lens');
    lens.setAttribute('aria-hidden', 'true');
    tabsWrap.appendChild(lens);
    var tabEls = TABS.map(function (t) {
        var a = el('a', 'm-tab', '<i class="fas ' + t.icon + '"></i><span>' + t.label + '</span>');
        a.href = t.href;
        a.dataset.tab = t.id;
        if (t.section) a.dataset.section = t.section;
        a.dataset.page = t.page;
        tabsWrap.appendChild(a);
        return a;
    });
    tabbar.appendChild(tabsWrap);

    // Menu sheet
    var head = el('div', 'm-sheet-head');
    var sheetBrand = el('span', 'm-brand', '<span class="m-brand-dot"></span>dhushor.dev');
    var closeBtn = el('button', 'm-glass-btn m-glass m-menu-btn', '<span class="m-burger"><i></i><i></i><i></i></span>');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.setAttribute('aria-expanded', 'true');
    head.appendChild(sheetBrand);
    head.appendChild(closeBtn);

    var label = el('div', 'm-sheet-label', 'navigate');
    var grid = el('div', 'm-grid');
    var tileEls = TILES.map(function (t, i) {
        var a = el('a', 'm-tile',
            '<span class="m-tile-icon"><i class="fas ' + t.icon + '"></i></span><span>' + t.label + '</span>');
        a.href = t.href;
        a.style.setProperty('--c1', t.c[0]);
        a.style.setProperty('--c2', t.c[1]);
        a.style.setProperty('--d', i);
        if (t.section) a.dataset.section = t.section;
        a.dataset.page = t.page || 'index.html';
        if (!t.section && t.page === PAGE) a.classList.add('is-current');
        grid.appendChild(a);
        return a;
    });

    var foot = el('div', 'm-sheet-foot');
    var social = el('div', 'm-social');
    SOCIAL.forEach(function (s) {
        var a = el('a', '', '<i class="' + s.icon + '"></i>');
        a.href = s.href;
        a.setAttribute('aria-label', s.label);
        if (s.href.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
        social.appendChild(a);
    });
    var seg = el('div', 'm-seg');
    seg.setAttribute('role', 'group');
    seg.setAttribute('aria-label', 'Appearance');
    var segDark = el('button', '', '<i class="fas fa-moon"></i> Dark');
    var segLight = el('button', '', '<i class="fas fa-sun"></i> Light');
    segDark.type = segLight.type = 'button';
    seg.appendChild(segDark);
    seg.appendChild(segLight);
    foot.appendChild(social);
    foot.appendChild(seg);

    sheet.appendChild(head);
    sheet.appendChild(label);
    sheet.appendChild(grid);
    sheet.appendChild(foot);

    document.body.appendChild(topbar);
    document.body.appendChild(tabbar);
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    // --------------------------------------------------------------- theme
    // Drive the original (now hidden) toggle so script.js stays in charge of
    // the class + localStorage. Fall back to doing it ourselves if absent.
    function toggleTheme(x, y) {
        var orig = document.querySelector('.theme-toggle');
        if (window.switchTheme) { window.switchTheme(x, y); }
        else if (orig) { orig.click(); }
        else {
            root.classList.toggle('light-mode');
            try { localStorage.setItem('theme', isLight() ? 'light' : 'dark'); } catch (e) { }
        }
    }
    function centerOf(n) { var r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
    function setTheme(wantLight, btn) { if (wantLight !== isLight()) { var c = centerOf(btn); toggleTheme(c[0], c[1]); } }

    var metaTheme = document.querySelector('meta[name="theme-color"]');
    function syncTheme() {
        var light = isLight();
        themeBtn.firstChild.className = light ? 'fas fa-sun' : 'fas fa-moon';
        segDark.classList.toggle('is-on', !light);
        segLight.classList.toggle('is-on', light);
        if (metaTheme) metaTheme.setAttribute('content', light ? '#eeecf6' : '#0b0b0d');
    }
    themeBtn.addEventListener('click', function () { buzz(); var c = centerOf(themeBtn); toggleTheme(c[0], c[1]); });
    segDark.addEventListener('click', function () { setTheme(false, segDark); });
    segLight.addEventListener('click', function () { setTheme(true, segLight); });
    new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ['class'] });
    syncTheme();

    // ---------------------------------------------------------- menu sheet
    var lastFocus = null;
    function openMenu() {
        lastFocus = document.activeElement;
        sheet.classList.add('is-open');
        backdrop.classList.add('is-open');
        root.classList.add('m-lock');
        menuBtn.setAttribute('aria-expanded', 'true');
        buzz();
        setTimeout(function () { closeBtn.focus({ preventScroll: true }); }, 60);
    }
    function closeMenu(restoreFocus) {
        if (!sheet.classList.contains('is-open')) return;
        sheet.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        root.classList.remove('m-lock');
        menuBtn.setAttribute('aria-expanded', 'false');
        if (restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', function () { closeMenu(); });
    backdrop.addEventListener('click', function () { closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    // swipe the sheet up to dismiss
    var sy = null;
    sheet.addEventListener('touchstart', function (e) { sy = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener('touchend', function (e) {
        if (sy == null) return;
        var dy = e.changedTouches[0].clientY - sy;
        if (dy < -70 && sheet.scrollTop <= 0) closeMenu();
        sy = null;
    }, { passive: true });

    // close automatically if the viewport grows to desktop size
    window.matchMedia('(min-width: 900px)').addEventListener
        ? window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) closeMenu(false); })
        : null;

    // ---------------------------------------------------------- navigation
    // On the same page we smooth-scroll; across pages the browser navigates
    // (home sections use real `index.html#id` URLs, handled on load below).
    // stopPropagation keeps script.js's global anchor handler out of the way
    // so the floating top bar offset is the only one applied.
    function onNavClick(e) {
        var a = e.currentTarget;
        var sectionId = a.dataset.section;
        var targetPage = a.dataset.page;

        if (IS_HOME && targetPage === 'index.html') {
            e.preventDefault();
            e.stopPropagation();
            buzz();
            closeMenu(false);
            var delay = sheet.classList.contains('is-open') ? 120 : 0;
            setTimeout(function () {
                if (sectionId) {
                    scrollToSection(sectionId);
                    try { history.replaceState(null, '', '#' + sectionId); } catch (err) { }
                } else {
                    window.smoothScrollTo(0);
                    try { history.replaceState(null, '', location.pathname); } catch (err) { }
                }
            }, delay);
            return;
        }
        if (targetPage === PAGE && !sectionId) {
            // already on this page (certificates / videos) — scroll to top
            e.preventDefault();
            e.stopPropagation();
            buzz();
            closeMenu(false);
            window.smoothScrollTo(0);
            return;
        }
        // cross-page: stop script.js intercepting, let the browser navigate
        e.stopPropagation();
        buzz();
    }
    tabEls.concat(tileEls).forEach(function (a) { a.addEventListener('click', onNavClick); });
    brand.addEventListener('click', function (e) {
        e.stopPropagation();
        if (IS_HOME) { e.preventDefault(); window.smoothScrollTo(0); }
    });
    sheetBrand.addEventListener('click', function () { closeMenu(); });

    // Arriving at index.html#section from another page: land with the right offset
    if (IS_HOME && location.hash.length > 1) {
        var hashId = decodeURIComponent(location.hash.slice(1));
        window.addEventListener('load', function () {
            setTimeout(function () { scrollToSection(hashId); }, 450);
        });
    }

    // -------------------------------------------------------- active state
    function setActiveTab(id) {
        var idx = -1;
        tabEls.forEach(function (t, i) {
            var on = t.dataset.tab === id;
            t.classList.toggle('is-active', on);
            if (on) { idx = i; t.setAttribute('aria-current', 'page'); } else t.removeAttribute('aria-current');
        });
        tabbar.dataset.active = String(idx);
        tabbar.style.setProperty('--i', idx < 0 ? 0 : idx);
        lens.style.setProperty('--i', idx < 0 ? 0 : idx);
        tileEls.forEach(function (t) {
            if (IS_HOME && t.dataset.section) t.classList.toggle('is-current', t.dataset.section === currentSection);
        });
    }

    var currentSection = null;
    if (IS_HOME) {
        // Sections in page order; the last one whose top has crossed ~45% of
        // the viewport is "current".
        var ids = ['about', 'experience', 'achievements', 'skills', 'languages', 'projects', 'showcase', 'contact'];
        var secs = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
        var ticking = false;
        var spy = function () {
            ticking = false;
            var line = window.innerHeight * 0.45;
            var cur = null;
            secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) cur = s.id; });
            // at the very bottom, force the last section (contact)
            if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) cur = 'contact';
            currentSection = cur;
            var tab = 'home';
            if (cur === 'contact') tab = 'contact';
            else if (cur === 'projects' || cur === 'showcase') tab = 'projects';
            setActiveTab(tab);
        };
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(spy); }
        }, { passive: true });
        window.addEventListener('resize', spy);
        spy();
    } else {
        setActiveTab(PAGE === 'certificates.html' ? 'certs' : PAGE === 'video.html' ? 'videos' : 'home');
    }


    // ------------------------------------------------- swipe carousels
    // Turns a stack of cards into a horizontal scroll-snap row with a dots
    // bar. The CSS only takes effect at <= 899px; on desktop these classes
    // are inert and the original layouts are untouched.
    function makeSwipe(selector) {
        var row = document.querySelector(selector);
        if (!row || row.classList.contains('m-swipe')) return;
        var slides = [].slice.call(row.children).filter(function (c) {
            return !c.classList.contains('scrolly-spine');
        });
        if (slides.length < 2) return;
        row.classList.add('m-swipe');
        slides.forEach(function (s) { s.classList.add('m-slide'); });

        var wrap = el('div', 'm-dots-wrap');
        var hint = el('span', 'm-swipe-hint', '<i class="fas fa-arrow-left-long"></i> swipe');
        var dots = el('div', 'm-dots');
        var dotEls = slides.map(function (s, i) {
            var b = el('button');
            b.type = 'button';
            b.setAttribute('aria-label', 'Go to card ' + (i + 1));
            b.addEventListener('click', function () {
                row.scrollTo({ left: s.offsetLeft - (row.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' });
            });
            dots.appendChild(b);
            return b;
        });
        wrap.appendChild(hint);
        wrap.appendChild(dots);
        row.parentNode.insertBefore(wrap, row.nextSibling);

        var ticking = false, used = false;
        function update() {
            ticking = false;
            var r = row.getBoundingClientRect();
            var cx = r.left + r.width / 2, best = 0, bestD = Infinity;
            slides.forEach(function (s, i) {
                var sr = s.getBoundingClientRect();
                var d = Math.abs(sr.left + sr.width / 2 - cx);
                if (d < bestD) { bestD = d; best = i; }
            });
            slides.forEach(function (s, i) { s.classList.toggle('is-snap', i === best); });
            dotEls.forEach(function (d, i) { d.classList.toggle('is-on', i === best); });
            if (!used && row.scrollLeft > 24) { used = true; wrap.classList.add('is-used'); }
        }
        row.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    }
    // ---------------------------------------------------- card stacks
    // Achievements / Languages / More-to-explore become a deck of stacked
    // cards on phones: the top card can be flicked away (either direction)
    // and goes to the back of the pile, revealing the next one. Dots jump to
    // a specific card. At > 899px nothing is changed (original layouts).
    var stacks = [];
    function makeStack(selector) {
        var row = document.querySelector(selector);
        if (!row || row.classList.contains('m-stack')) return;
        var slides = [].slice.call(row.children).filter(function (c) {
            return !c.classList.contains('scrolly-spine');
        });
        var n = slides.length;
        if (n < 2) return;

        var STEP = 12, SX = 14, active = 0, H = 0;   // STEP = vertical peek, SX = sideways peek (shows the swipe direction)
        row.classList.add('m-stack');
        slides.forEach(function (s) { s.classList.add('m-card'); });

        var wrap = el('div', 'm-dots-wrap');
        var dots = el('div', 'm-dots');
        var dotEls = slides.map(function (s, i) {
            var b = el('button');
            b.type = 'button';
            b.setAttribute('aria-label', 'Show card ' + (i + 1));
            b.addEventListener('click', function () { active = i; place(true); });
            dots.appendChild(b);
            return b;
        });
        wrap.appendChild(dots);
        row.parentNode.insertBefore(wrap, row.nextSibling);

        function measure() {
            slides.forEach(function (s) { s.style.height = 'auto'; });
            H = 0;
            slides.forEach(function (s) { H = Math.max(H, s.offsetHeight); });
            slides.forEach(function (s) { s.style.height = H + 'px'; });
            row.style.height = (H + STEP * 2) + 'px';
        }

        function pose(s, d) {
            var k = Math.min(d, 2);
            s.style.transform = 'translate3d(' + (k * SX) + 'px,' + (k * STEP) + 'px,0) rotate(' + (k * 1.6) + 'deg) scale(' + (1 - k * 0.045) + ')';
            s.style.opacity = d < 3 ? '1' : '0';
            s.style.boxShadow = d === 0 ? '' : 'inset 0 0 0 100vmax rgba(0,0,0,' + (0.14 * k) + '), 0 18px 40px rgba(0,0,0,.38)';
            s.style.zIndex = String(n - d);
            s.style.pointerEvents = d === 0 ? 'auto' : 'none';
            s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        }

        function place(animate, jumpEl, hold) {
            slides.forEach(function (s, i) {
                if (hold && s === jumpEl) return;      // card still flying away: don't touch it
                var d = (i - active + n) % n;
                s.style.transition = (animate && s !== jumpEl)
                    ? 'transform .55s cubic-bezier(.22,1,.36,1), opacity .4s ease'
                    : 'none';
                pose(s, d);
            });
            dotEls.forEach(function (d, i) { d.classList.toggle('is-on', i === active); });
            row.dispatchEvent(new CustomEvent('stackchange', { bubbles: true, detail: { index: active } }));
        }

        // ---- drag / flick the top card
        var drag = null, suppressClick = false, flying = null;

        function sendToBack(c) {
            var i = slides.indexOf(c), d = (i - active + n) % n;
            c.style.transition = 'none';
            pose(c, d);
            c.style.opacity = '0';
            void c.offsetWidth;                          // commit the hidden state before fading in
            c.style.transition = 'opacity .45s ease';
            c.style.opacity = d < 3 ? '1' : '0';
        }
        function top() { return slides[active]; }

        row.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            if (!top().contains(e.target) || top() === flying) return;
            drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now(), dx: 0, on: false };
        });
        row.addEventListener('pointermove', function (e) {
            if (!drag || e.pointerId !== drag.id) return;
            var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
            if (!drag.on) {
                if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; } // vertical = page scroll
                if (Math.abs(dx) < 8) return;
                drag.on = true;
                try { row.setPointerCapture(e.pointerId); } catch (err) { }
            }
            drag.dx = dx;
            var c = top();
            c.style.transition = 'none';
            c.style.transform = 'translate3d(' + dx + 'px,0,0) rotate(' + (dx / 18) + 'deg)';
            c.style.opacity = String(Math.max(0.35, 1 - Math.abs(dx) / 420));
            // the card behind creeps forward as you pull
            var nxt = slides[(active + 1) % n], p = Math.min(Math.abs(dx) / 160, 1);
            nxt.style.transition = 'none';
            nxt.style.transform = 'translate3d(' + (SX * (1 - p)) + 'px,' + (STEP * (1 - p)) + 'px,0) rotate(' + (1.6 * (1 - p)) + 'deg) scale(' + (0.955 + 0.045 * p) + ')';
        });
        function end(e) {
            if (!drag || e.pointerId !== drag.id) return;
            var d = drag; drag = null;
            if (!d.on) return;
            suppressClick = true;
            setTimeout(function () { suppressClick = false; }, 60);
            var v = Math.abs(d.dx) / Math.max(Date.now() - d.t, 1);
            if (Math.abs(d.dx) > 90 || v > 0.5) {
                var c = top(), dir = d.dx < 0 ? -1 : 1;
                c.style.transition = 'transform .38s cubic-bezier(.4,0,.8,.4), opacity .38s ease';
                c.style.transform = 'translate3d(' + (dir * window.innerWidth * 0.85) + 'px,0,0) rotate(' + (dir * 16) + 'deg)';
                c.style.opacity = '0';
                active = (active + 1) % n;
                place(true, c, true);           // the rest slide forward right away (no waiting, no jump)
                flying = c;
                setTimeout(function () {
                    sendToBack(c);              // flown card re-enters at the back, fading in
                    if (flying === c) flying = null;
                }, 420);
            } else {
                place(true);                    // spring back
            }
        }
        row.addEventListener('pointerup', end);
        row.addEventListener('pointercancel', end);
        row.addEventListener('click', function (e) {
            if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        // nudge: every time the deck scrolls back into view, the top card slides
        // toward the pile and springs back, so people see it can be pulled away
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            var nudgeT1, nudgeT2, visible = false;
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.intersectionRatio === 0) {           // fully left the screen: re-arm
                        clearTimeout(nudgeT1); clearTimeout(nudgeT2);
                        visible = false;
                        return;
                    }
                    if (visible || en.intersectionRatio < 0.6) return;
                    visible = true;
                    nudgeT1 = setTimeout(function () {
                        if (drag || flying) return;
                        var c = top();
                        c.style.transition = 'transform .45s cubic-bezier(.3,.7,.4,1)';
                        c.style.transform = 'translate3d(-46px,0,0) rotate(-4deg)';
                        nudgeT2 = setTimeout(function () { if (!drag && !flying) place(true); }, 480);
                    }, 450);
                });
            }, { threshold: [0, 0.6] });
            io.observe(row);
        }

        measure();
        place(false);
        window.addEventListener('load', function () { measure(); place(false); });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); place(false); });

        stacks.push({
            row: row,
            relayout: function () { measure(); place(false); },
            destroy: function () {
                row.classList.remove('m-stack');
                row.style.height = '';
                slides.forEach(function (s) {
                    s.classList.remove('m-card');
                    ['transform', 'opacity', 'filter', 'boxShadow', 'zIndex', 'pointerEvents', 'transition', 'height'].forEach(function (p) { s.style[p] = ''; });
                    s.removeAttribute('aria-hidden');
                });
                if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
            }
        });
    }

    var STACKS = ['.achievements-grid', '.languages-track', '.teaser-grid'];
    var phoneMQ = window.matchMedia('(max-width: 899px)');
    function syncStacks() {
        if (phoneMQ.matches) {
            if (!stacks.length) STACKS.forEach(makeStack);
            else stacks.forEach(function (s) { s.relayout(); });
        } else if (stacks.length) {
            stacks.forEach(function (s) { s.destroy(); });
            stacks = [];
        }
    }
    syncStacks();
    if (phoneMQ.addEventListener) phoneMQ.addEventListener('change', syncStacks);
    window.addEventListener('resize', function () { if (phoneMQ.matches) stacks.forEach(function (s) { s.relayout(); }); });

    // ---------------------------------------- hide tab bar while typing
    function isTextField(n) {
        return n && /^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) && n.type !== 'checkbox' && n.type !== 'radio';
    }
    document.addEventListener('focusin', function (e) { if (isTextField(e.target)) document.body.classList.add('m-kb'); });
    document.addEventListener('focusout', function () {
        setTimeout(function () { if (!isTextField(document.activeElement)) document.body.classList.remove('m-kb'); }, 50);
    });

    // make sure the menu never lingers across bfcache restores
    window.addEventListener('pageshow', function () { closeMenu(false); });
})();
