/* ==========================================================================
   SMOOTH SCROLL ENGINE
   Same method as the reference portfolio: Lenis drives the scroll (lazy,
   inertial glide) and is clocked by GSAP's ticker so ScrollTrigger reveals
   stay perfectly in sync with it.

   Loaded on every page, AFTER gsap + ScrollTrigger + lenis (CDN) and BEFORE
   script.js. If the CDN scripts fail to load, the site silently falls back
   to normal native scrolling.
   ========================================================================== */
(function () {
    'use strict';

    var html = document.documentElement;

    /* Helper used by nav links / menus for "glide to this Y position" */
    window.smoothScrollTo = function (top) {
        if (window.lenis) window.lenis.scrollTo(top);
        else window.scrollTo({ top: top, behavior: 'smooth' });
    };


    if (typeof window.Lenis === 'undefined' || typeof window.gsap === 'undefined') {
        window.lenis = null;
        return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.lenis = null;
        return;
    }

    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    /* Exactly the reference site's configuration (hooks/useLenis.js) */
    var lenis = new Lenis({
        duration: 1.4,
        easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.8,
        infinite: false
    });
    window.lenis = lenis;

    /* Keep ScrollTrigger in sync, and let GSAP's ticker drive Lenis */
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    /* ---- Pause Lenis whenever the page deliberately locks scrolling ----
       (hero intro lock, mobile menu sheet, lightbox / modal overlays)       */
    function locked() {
        return html.classList.contains('hero-lock') ||
            html.classList.contains('m-lock') ||
            html.classList.contains('vx-lock') ||
            html.style.overflow === 'hidden' ||
            (document.body && (document.body.classList.contains('menu-open') ||
                document.body.style.overflow === 'hidden'));
    }
    function syncLock() { if (locked()) lenis.stop(); else lenis.start(); }

    var mo = new MutationObserver(syncLock);
    mo.observe(html, { attributes: true, attributeFilter: ['class', 'style'] });
    function watchBody() {
        mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
        syncLock();
    }
    if (document.body) watchBody();
    else document.addEventListener('DOMContentLoaded', watchBody);

    /* ---- Inner scrollers (menu sheet, drawers, modals) keep native scroll ---- */
    function protectInnerScrollers() {
        document.querySelectorAll(
            '.m-sheet, .mobile-nav-links, .dm-panel, [class*="lightbox"], [class*="modal"], [data-scroll-inner]'
        ).forEach(function (el) { el.setAttribute('data-lenis-prevent', ''); });
    }
    document.addEventListener('DOMContentLoaded', protectInnerScrollers);

    /* ---- Layout can change after lazy images load: re-measure triggers ---- */
    window.addEventListener('load', function () {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        lenis.resize();
    });
})();
