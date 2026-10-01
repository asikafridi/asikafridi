// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    initPageTransitions();
    initThemeSwitcher();
    initCinemaIntro();
    initSplitText();
    initializeNavigation();
    initDesktopMenu();
    initializeTheme();
    initializeTypewriter();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
    initializeMobileNavigation();
    initializePhotoCompanion();
    initializeRevealObserver();
    relocateThemeToggleForMobile();
    initMagneticButtons();
    initTiltCards();
    initBentoCounters();
    initScrolly();
    initLanguageRings();
    initLanguagePassport();
    initProjectsScroller();
    initProjectsShowcase();
    initContactLiquidGlass();
    updateCurrentYear();
});

// ==================== OPENING TITLE CARD ====================
// Shows "dhushor.dev presents / Asikur Rahman" for about a second on the
// first visit of a session, then iris-wipes away to reveal the site. The
// overlay is invisible unless this function opts it in, and a safety timer
// guarantees it always comes down, so a stalled animation or thrown error
// can never leave a visitor stuck behind a black screen.
function initCinemaIntro() {
    const intro = document.getElementById('cinemaIntro');
    if (!intro) return;

    if (window.__pt) { sessionStorage.setItem('cinemaIntroShown', '1'); return; } // arrived via page transition
    if (sessionStorage.getItem('cinemaIntroShown')) return; // stays display:none
    sessionStorage.setItem('cinemaIntroShown', '1');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const titleEl = document.getElementById('cinemaTitle');

    function finish() {
        document.body.style.overflow = '';
        intro.classList.remove('is-active');
        intro.classList.add('is-hidden');
    }

    try {
        intro.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        const safety = setTimeout(finish, 3500);

        // Fade the name in right away, hold it ~1s, then wipe.
        requestAnimationFrame(() => titleEl && titleEl.classList.add('is-visible'));
        setTimeout(() => {
            intro.classList.add('is-wiping');
            document.body.style.overflow = '';
            setTimeout(() => { clearTimeout(safety); finish(); }, reduceMotion ? 450 : 1250);
        }, reduceMotion ? 700 : 1100);
    } catch (err) {
        finish();
    }
}

// ==================== SPLIT-TEXT HEADINGS ====================
function initSplitText() {
    document.querySelectorAll('h2.split-text').forEach(h => {
        const text = h.textContent.trim();
        h.setAttribute('aria-label', text);
        h.innerHTML = text.split(' ').map((word, i) =>
            `<span class="split-word" style="transition-delay:${i * 0.06}s"><span>${word}</span></span>`
        ).join(' ');
    });
}

// ==================== MOBILE THEME TOGGLE PLACEMENT ====================
function relocateThemeToggleForMobile() {
    const toggle = document.querySelector('.theme-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (!toggle || !hamburgerMenu) return;

    function place() {
        if (window.innerWidth < 900) {
            if (toggle.parentElement !== hamburgerMenu) {
                hamburgerMenu.insertBefore(toggle, hamburgerMenu.firstChild);
                toggle.classList.add('theme-toggle--inline');
            }
        } else if (toggle.classList.contains('theme-toggle--inline')) {
            document.body.insertBefore(toggle, document.body.firstChild);
            toggle.classList.remove('theme-toggle--inline');
        }
    }
    place();
    window.addEventListener('resize', place);
}

// ==================== MAGNETIC BUTTONS ====================
function initMagneticButtons() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.btn, .projects-arrow').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// ==================== 3D TILT CARDS ====================
function initTiltCards() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // project cards get a stronger cursor-follow glow too
    document.querySelectorAll('.project-card-v2').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--px', ((e.clientX - rect.left) / rect.width) * 100 + '%');
            card.style.setProperty('--py', ((e.clientY - rect.top) / rect.height) * 100 + '%');
        });
    });

    // achievement cards: cursor-follow glow + a playful wobbling trophy icon
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            card.style.setProperty('--px', px * 100 + '%');
            card.style.setProperty('--py', py * 100 + '%');
            card.style.setProperty('--iconx', ((px - 0.5) * 14).toFixed(1));
            card.style.setProperty('--icony', ((py - 0.5) * 14).toFixed(1));
            card.style.setProperty('--iconr', ((px - 0.5) * 24).toFixed(1) + 'deg');
            card.style.setProperty('--icons', '1.15');
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--iconx', 0);
            card.style.setProperty('--icony', 0);
            card.style.setProperty('--iconr', '0deg');
            card.style.setProperty('--icons', '1');
        });
    });

    // experience rows: cursor-follow glow across the whole item + a
    // playful tilt-and-glare on the photo itself, like light catching
    // glossy card stock as the cursor moves across it.
    document.querySelectorAll('.experience-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            item.style.setProperty('--px', ((e.clientX - rect.left) / rect.width) * 100 + '%');
            item.style.setProperty('--py', ((e.clientY - rect.top) / rect.height) * 100 + '%');
        });
        const media = item.querySelector('.experience-media');
        if (media) {
            media.addEventListener('mousemove', (e) => {
                const r = media.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                media.classList.add('is-tilting');
                media.style.transition = 'transform 0.12s ease-out';
                media.style.transform = `perspective(600px) rotateY(${px * 18}deg) rotateX(${-py * 18}deg) scale(1.07)`;
                media.style.setProperty('--gx', ((e.clientX - r.left) / r.width) * 100 + '%');
                media.style.setProperty('--gy', ((e.clientY - r.top) / r.height) * 100 + '%');
            });
            media.addEventListener('mouseleave', () => {
                media.classList.remove('is-tilting');
                // A springy overshoot ease for the return, so the photo
                // settles back into place rather than just snapping flat.
                media.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
                media.style.transform = '';
            });
        }
        item.querySelectorAll('.experience-tags span').forEach((tag, i) => {
            tag.style.transitionDelay = `${i * 40}ms`;
        });
    });
}

// ==================== ANIMATED COUNTERS (hero stats + about) ====================
function initBentoCounters() {
    const nums = document.querySelectorAll('.scrolly-stat-num [data-count]');
    if (!nums.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10) || 0;
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target);
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.4 });
    nums.forEach(el => observer.observe(el));
}

// ==================== ABOUT — SCROLLYTELLING ====================
function initScrolly() {
    const steps = Array.from(document.querySelectorAll('.scrolly-step'));
    const idxEl = document.getElementById('scrollyIndex');
    const capEl = document.getElementById('scrollyCaption');
    const railEl = document.getElementById('scrollyRail');
    const spineFillEl = document.getElementById('scrollySpineFill');
    const nodes = Array.from(document.querySelectorAll('.scrolly-node'));
    if (!steps.length) return;

    let current = -1;
    function activate(i) {
        if (i === current || i < 0) return;
        current = i;
        steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
        nodes.forEach((n, idx) => n.classList.toggle('is-lit', idx <= i));
        const step = steps[i];
        if (idxEl) idxEl.textContent = step.dataset.index || String(i + 1).padStart(2, '0');
        if (capEl && step.dataset.caption) {
            capEl.style.opacity = '0';
            setTimeout(() => { capEl.textContent = step.dataset.caption; capEl.style.opacity = '1'; }, 180);
        }
        if (railEl) railEl.style.height = (((i + 1) / steps.length) * 100) + '%';
        if (spineFillEl) spineFillEl.style.height = (((i + 1) / steps.length) * 100) + '%';
    }

    // Activate whichever beat's vertical centre sits closest to the
    // viewport's vertical centre. This is computed directly from live
    // geometry (getBoundingClientRect) on every scroll event, instead of
    // relying on IntersectionObserver ratio/threshold notifications. The
    // observer-based approach turned out to still be direction-sensitive:
    // it depends on the browser batching "leaving" and "entering"
    // notifications together, and under fast or long scrolls a step's last
    // known ratio can go stale before a new notification arrives, letting a
    // taller step (like the last "collaborator" beat, which carries extra
    // stats + tech-stack content) win out with an outdated value. Measuring
    // distance-to-centre fresh on every event has no batching or threshold
    // to fall out of sync with, so it's correct regardless of scroll speed
    // or direction. With only four steps, running this on every scroll
    // event is cheap, but it's throttled to once per animation frame so it
    // lines up with the browser's paint cycle instead of firing once per
    // raw scroll event (which can dispatch several times within a single
    // frame during a fast flick).
    let stepTicking = false;
    function updateActiveStep() {
        stepTicking = false;
        const viewportCenter = window.innerHeight / 2;
        let bestIndex = 0, bestDist = Infinity;
        steps.forEach((s, n) => {
            const r = s.getBoundingClientRect();
            const dist = Math.abs((r.top + r.height / 2) - viewportCenter) + Math.abs((r.left + r.width / 2) - window.innerWidth / 2);
            if (dist < bestDist) { bestDist = dist; bestIndex = n; }
        });
        activate(bestIndex);
    }
    function onStepScroll() {
        if (!stepTicking) {
            stepTicking = true;
            requestAnimationFrame(updateActiveStep);
        }
    }
    window.addEventListener('scroll', onStepScroll, { passive: true });
    // capture: also fires when the mobile swipe carousel scrolls horizontally
    document.addEventListener('scroll', onStepScroll, { passive: true, capture: true });
    window.addEventListener('resize', updateActiveStep);

    activate(0);
    updateActiveStep();
}

// ==================== LANGUAGE PROFICIENCY RINGS ====================
function initLanguageRings() {
    const cards = document.querySelectorAll('.lang-card[data-percent]');
    if (!cards.length) return;
    const CIRCUMFERENCE = 2 * Math.PI * 52;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            const percent = parseInt(card.dataset.percent, 10) || 0;
            const fill = card.querySelector('.ring-fill');
            const label = card.querySelector('.lang-ring-pct');
            if (fill) {
                const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percent / 100);
                requestAnimationFrame(() => { fill.style.strokeDashoffset = offset; });
            }
            if (label) {
                const duration = 1500;
                const start = performance.now();
                function tick(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    label.textContent = Math.round(eased * percent);
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            }
            observer.unobserve(card);
        });
    }, { threshold: 0.35 });
    cards.forEach(card => observer.observe(card));
}

// ==================== LANGUAGES — STICKY "PASSPORT" PANEL ====================
// Mirrors the about section's sticky-narrator pattern (rail fills, caption
// swaps as you scroll) but drives a rotating greeting stamp instead of a
// chapter blurb, and pops the nearest card into focus on the track.
function initLanguagePassport() {
    const cards = Array.from(document.querySelectorAll('.lang-card[data-greeting]'));
    const railFill = document.getElementById('langRailFill');
    const indexEl = document.getElementById('langIndex');
    const captionEl = document.getElementById('langCaptionText');
    const greetingEl = document.getElementById('langGreeting');
    const photoFrame = document.querySelector('.lang-photo');
    const flagEl = document.getElementById('langFlag');
    if (!cards.length || !greetingEl) return;

    // Real national flag emoji per language — accurate per-country flags
    // rather than an abstracted colour swatch.
    const FLAGS = { bn: '🇧🇩', en: '🇬🇧', hi: '🇮🇳', ur: '🇵🇰', ru: '🇷🇺' };

    let current = -1;
    function activate(i) {
        if (i === current || i < 0) return;
        current = i;
        const card = cards[i];
        const langCode = card.dataset.greetingLang || '';

        cards.forEach((c, n) => c.classList.toggle('is-focused', n === i));

        if (railFill) railFill.style.width = (((i + 1) / cards.length) * 100) + '%';
        if (indexEl) indexEl.textContent = String(i + 1).padStart(2, '0');

        // Swap the flag badge to match the country tied to whichever
        // language is currently focused.
        if (photoFrame) photoFrame.dataset.flag = langCode;
        if (flagEl && FLAGS[langCode]) {
            flagEl.classList.add('is-swapping');
            setTimeout(() => {
                flagEl.querySelector('.lang-photo-flag-emoji').textContent = FLAGS[langCode];
                flagEl.classList.remove('is-swapping');
            }, 200);
        }

        greetingEl.classList.add('is-swapping');
        if (captionEl) captionEl.style.opacity = '0';
        setTimeout(() => {
            greetingEl.textContent = card.dataset.greeting || '';
            greetingEl.setAttribute('lang', langCode);
            greetingEl.classList.remove('is-swapping');
            if (captionEl) {
                captionEl.textContent = card.dataset.caption || '';
                captionEl.style.opacity = '1';
            }
        }, 220);
    }

    // Activate whichever card's vertical centre sits closest to the
    // viewport's vertical centre — computed directly from live geometry
    // rather than IntersectionObserver ratios, which batch "leaving" and
    // "entering" notifications separately and can leave the wrong card
    // active depending on scroll speed/direction (see the identical fix
    // applied to the About section's scrollytelling). Throttled to once
    // per animation frame, matching the same pattern.
    let cardTicking = false;
    function updateActiveCard() {
        cardTicking = false;
        const viewportCenter = window.innerHeight / 2;
        let bestIndex = 0, bestDist = Infinity;
        cards.forEach((c, n) => {
            const r = c.getBoundingClientRect();
            // + horizontal distance: on mobile the cards sit side by side in a swipe row
            const dist = Math.abs((r.top + r.height / 2) - viewportCenter) + Math.abs((r.left + r.width / 2) - window.innerWidth / 2);
            if (dist < bestDist) { bestDist = dist; bestIndex = n; }
        });
        activate(bestIndex);
    }
    function onCardScroll() {
        if (!cardTicking) {
            cardTicking = true;
            requestAnimationFrame(updateActiveCard);
        }
    }
    window.addEventListener('scroll', onCardScroll, { passive: true });
    // capture: also fires when the mobile swipe row scrolls horizontally
    document.addEventListener('scroll', onCardScroll, { passive: true, capture: true });
    window.addEventListener('resize', updateActiveCard);

    activate(0);
    updateActiveCard();
}

// ==================== PROJECTS: HORIZONTAL SCROLLER ====================
function initProjectsScroller() {
    const section = document.querySelector('.projects-scroll-section');
    const sticky = document.querySelector('.projects-sticky');
    const track = document.getElementById('projectsTrack');
    const progressFill = document.getElementById('projectsProgressFill');
    const arrowLeft = document.getElementById('projArrowLeft');
    const arrowRight = document.getElementById('projArrowRight');
    if (!section || !track || !sticky) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = () => false; // desktop now uses initProjectsShowcase()

    function updateDesktop() {
        if (!isDesktop() || prefersReducedMotion) return;
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        if (scrollableHeight <= 0) return;
        const rect = section.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / scrollableHeight, 0), 1);
        const maxTranslate = Math.max(track.scrollWidth - sticky.clientWidth, 0);
        track.style.transform = `translateX(-${progress * maxTranslate}px)`;
        if (progressFill) progressFill.style.width = (progress * 100) + '%';
    }

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => { updateDesktop(); ticking = false; });
            ticking = true;
        }
    }

    function onMobileScroll() {
        if (isDesktop() || !progressFill) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
        progressFill.style.width = (progress * 100) + '%';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('scroll', onMobileScroll, { passive: true });
    window.addEventListener('resize', () => { track.style.transform = ''; updateDesktop(); });
    updateDesktop();

    function nudge(dir) {
        if (isDesktop() && !prefersReducedMotion) {
            const scrollableHeight = section.offsetHeight - window.innerHeight;
            const step = scrollableHeight / 4;
            window.scrollBy({ top: dir * step, behavior: 'smooth' });
        } else {
            const cardWidth = track.querySelector('.project-card-v2')?.offsetWidth || 320;
            track.scrollBy({ left: dir * (cardWidth + 28), behavior: 'smooth' });
        }
    }
    arrowRight?.addEventListener('click', () => nudge(1));
    arrowLeft?.addEventListener('click', () => nudge(-1));
}

// ==================== NAVIGATION SYSTEM ====================
function initializeNavigation() {
    // Note: the mobile hamburger's menu itself is wired up in
    // initializeMobileNavigation() (the slide-in glass sidebar). A second,
    // older dropdown-toggle system used to also listen on the same button,
    // which meant one tap opened two overlapping menus at once — removed
    // in favor of the single sidebar.
    setupNavigationLinks();
    handleCrossPageNavigation();
}

function handleCrossPageNavigation() {
    const targetSection = sessionStorage.getItem('targetSection');
    const smoothScroll = sessionStorage.getItem('smoothScroll');

    if (targetSection && smoothScroll === 'true') {
        sessionStorage.removeItem('targetSection');
        sessionStorage.removeItem('smoothScroll');

        setTimeout(() => {
            const sectionElement = document.getElementById(targetSection);
            if (sectionElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                window.scrollTo({
                    top: sectionElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
                highlightSection(sectionElement);
            }
        }, 300);
    }
}

function setupNavigationLinks() {
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href*="#"]');
        if (!link) return;

        const href = link.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            scrollToSection(targetId);
        }
        else if (href.includes('index.html#')) {
            e.preventDefault();
            const targetSection = href.split('#')[1];

            if (window.location.pathname.endsWith('index.html') ||
                window.location.pathname.endsWith('/')) {
                scrollToSection(targetSection);
            }
            else {
                sessionStorage.setItem('targetSection', targetSection);
                sessionStorage.setItem('smoothScroll', 'true');
                window.location.href = 'index.html';
            }
        }
    });
}

function scrollToSection(sectionId) {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        const navHeight = document.querySelector('nav').offsetHeight;
        window.scrollTo({
            top: sectionElement.offsetTop - navHeight,
            behavior: 'smooth'
        });
        highlightSection(sectionElement);
    }
}

function highlightSection(sectionElement) {
    sectionElement.style.transition = 'all 0.5s ease';
    sectionElement.style.boxShadow = '0 0 0 2px var(--signal)';
    setTimeout(() => {
        sectionElement.style.boxShadow = 'none';
    }, 2000);
}

// ==================== MOBILE NAVIGATION ====================
function initializeMobileNavigation() {
    const mobileNavOverlay = document.createElement('div');
    mobileNavOverlay.className = 'mobile-nav-overlay';

    const mobileNavSidebar = document.createElement('div');
    mobileNavSidebar.className = 'mobile-nav-sidebar';

    const mobileNavHeader = document.createElement('div');
    mobileNavHeader.className = 'mobile-nav-header';

    const mobileNavTitle = document.createElement('div');
    mobileNavTitle.className = 'mobile-nav-title';
    mobileNavTitle.innerHTML = '<span class="eyebrow">navigate.menu</span>';

    const mobileCloseBtn = document.createElement('button');
    mobileCloseBtn.className = 'mobile-close-btn';
    mobileCloseBtn.innerHTML = '<i class="fas fa-times"></i>';
    mobileCloseBtn.setAttribute('aria-label', 'Close navigation');

    mobileNavHeader.appendChild(mobileNavTitle);
    mobileNavHeader.appendChild(mobileCloseBtn);

    // Ambient drifting colour, matching the liquid-glass treatment used
    // elsewhere on the site (contact card, video portfolio panels).
    const blobA = document.createElement('div');
    blobA.className = 'glass-blob blob-a';
    const blobB = document.createElement('div');
    blobB.className = 'glass-blob blob-b';

    const mobileNavLinks = document.createElement('div');
    mobileNavLinks.className = 'mobile-nav-links';

    const existingLinks = document.getElementById('dropdown-nav');
    if (existingLinks) {
        const links = existingLinks.querySelectorAll('a');
        links.forEach(link => {
            const mobileLink = link.cloneNode(true);
            mobileLink.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (href && href.includes('#')) {
                    e.preventDefault();
                    closeMobileMenu();

                    if (href.startsWith('#')) {
                        const targetId = href.substring(1);
                        setTimeout(() => scrollToSection(targetId), 300);
                    } else if (href.includes('index.html#')) {
                        const targetSection = href.split('#')[1];
                        if (window.location.pathname.endsWith('index.html') ||
                            window.location.pathname.endsWith('/')) {
                            setTimeout(() => scrollToSection(targetSection), 300);
                        } else {
                            sessionStorage.setItem('targetSection', targetSection);
                            sessionStorage.setItem('smoothScroll', 'true');
                            window.location.href = 'index.html';
                        }
                    }
                }
            });
            mobileNavLinks.appendChild(mobileLink);
        });
    }

    mobileNavSidebar.appendChild(blobA);
    mobileNavSidebar.appendChild(blobB);
    mobileNavSidebar.appendChild(mobileNavHeader);
    mobileNavSidebar.appendChild(mobileNavLinks);

    document.body.appendChild(mobileNavOverlay);
    document.body.appendChild(mobileNavSidebar);

    function setToggleIcon(isOpen) {
        const icon = hamburgerToggle && hamburgerToggle.querySelector('i');
        if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        if (hamburgerToggle) hamburgerToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function openMobileMenu() {
        mobileNavOverlay.classList.add('active');
        mobileNavSidebar.classList.add('active');
        document.body.classList.add('menu-open');
        document.documentElement.style.overflow = 'hidden';
        setToggleIcon(true);

        setTimeout(() => {
            mobileNavSidebar.style.transition = 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);

        setTimeout(() => {
            mobileCloseBtn.focus();
        }, 100);
    }

    function closeMobileMenu() {
        mobileNavOverlay.classList.remove('active');
        mobileNavSidebar.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.documentElement.style.overflow = '';
        setToggleIcon(false);

        setTimeout(() => {
            mobileNavSidebar.style.transition = '';
        }, 400);
    }

    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    if (hamburgerToggle) {
        hamburgerToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            openMobileMenu();
        });
    }

    mobileCloseBtn.addEventListener('click', closeMobileMenu);
    mobileNavOverlay.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNavSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    document.addEventListener('click', function (e) {
        if (mobileNavSidebar.classList.contains('active') &&
            !mobileNavSidebar.contains(e.target) &&
            !hamburgerToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileNavSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    mobileNavSidebar.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mobileNavSidebar.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance < -swipeThreshold && mobileNavSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    mobileNavLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 300);
        });
    });
}

// ==================== THEME SYSTEM ====================
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    const themeIndicator = document.createElement('span');
    themeIndicator.className = 'theme-indicator';
    themeToggle.parentNode.insertBefore(themeIndicator, themeToggle.nextSibling);

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('light-mode', currentTheme === 'light');
    updateThemeIndicator();

    themeToggle.addEventListener('click', (e) => {
        const r = themeToggle.getBoundingClientRect();
        let x = e.clientX, y = e.clientY;
        if (!x && !y) { x = r.left + r.width / 2; y = r.top + r.height / 2; }
        if (window.switchTheme) window.switchTheme(x, y);
    });
    document.addEventListener('themechange', updateThemeIndicator);

    function updateThemeIndicator() {
        themeIndicator.textContent = document.documentElement.classList.contains('light-mode')
            ? 'Light'
            : 'Dark';
    }
}

// ==================== TYPEWRITER EFFECT ====================
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const phrases = [
        "Project & Development Lead at StratifyX..",
        "Computer Science & Engineering Student..",
        "Competitive Programmer & Problem Solver..",
        "Building Expensio, RootForge & BisonBank..",
        "Eager to Learn, Lead, and Ship.."
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let currentPhrase = '';
    let isDeleting = false;
    let isEnd = false;

    function type() {
        isEnd = false;
        currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typewriterElement.textContent = currentPhrase.substring(0, charIndex);

        let typeSpeed = 110;

        if (isDeleting) {
            typeSpeed /= 3;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isEnd = true;
            typeSpeed = 2400;
        } else if (isDeleting && charIndex === 0) {
            isEnd = true;
            typeSpeed = 450;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        if (isEnd) {
            isDeleting = !isDeleting;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 900);
}

// ==================== SCROLL EFFECTS ====================
function initializeScrollEffects() {
    // Cache the bar once and drive it with transform (compositor-only)
    // instead of width (which forces a synchronous layout on every scroll
    // event) — plus rAF-throttle so it recalculates at most once per
    // painted frame instead of once per raw scroll event.
    const bar = document.querySelector('.scroll-progress');
    let ticking = false;
    function updateProgress() {
        ticking = false;
        if (!bar) return;
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? Math.min(winScroll / height, 1) : 0;
        bar.style.transform = `scaleX(${scrolled})`;
    }
    const navEl = document.querySelector('nav[aria-label="Main navigation"]');
    const navState = () => navEl && navEl.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', navState, { passive: true });
    navState();
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateProgress);
        }
    }, { passive: true });

    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            const navHeight = document.querySelector('nav').offsetHeight;
            if (aboutSection) {
                window.scrollTo({
                    top: aboutSection.offsetTop - navHeight + 20,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Ambient mouse-follow glow
    const root = document.documentElement;
    let targetX = 20, targetY = 10, curX = 20, curY = 10;
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) * 100;
        targetY = (e.clientY / window.innerHeight) * 100;
    }, { passive: true });

    function animateGlow() {
        curX += (targetX - curX) * 0.05;
        curY += (targetY - curY) * 0.05;
        root.style.setProperty('--mx', curX + '%');
        root.style.setProperty('--my', curY + '%');
        requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);

    createParticles();
}

function createParticles() {
    const particles = document.querySelector('.particles');
    if (!particles) return;
    for (let i = 0; i < 36; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            --x: ${Math.random() * 100 - 50}vw;
            --y: ${Math.random() * 100 - 50}vh;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${10 + Math.random() * 8}s;
        `;
        particles.appendChild(particle);
    }
}

// ==================== PHOTO COMPANION (signature scroll animation) ====================
function initializePhotoCompanion() {
    const frame = document.getElementById('editorFrame');
    const hero = document.querySelector('.hero');
    if (!frame || !hero) return;
    const about = document.getElementById('about');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    if (window.innerWidth < 900) return; // pinned companion is desktop-only

    let pinned = false;
    let ticking = false;

    function update() {
        ticking = false;
        const heroRect = hero.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFrac = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;

        if (heroBottom <= 0 && !pinned) {
            frame.classList.add('is-pinned');
            pinned = true;
        } else if (heroBottom > 0 && pinned) {
            frame.classList.remove('is-pinned');
            frame.style.setProperty('--tilt', '-3deg');
            pinned = false;
        }

        if (pinned) {
            // Travel gently between 12% and 78% of viewport height as user scrolls
            const topPct = 12 + scrollFrac * 62;
            frame.style.setProperty('--pin-top', topPct + 'vh');
            const tilt = -3 + Math.sin(scrollFrac * Math.PI * 2) * 4;
            frame.style.setProperty('--tilt', tilt + 'deg');
        } else {
            // Subtle parallax float while still in hero
            const heroProgress = Math.min(Math.max(-heroRect.top / window.innerHeight, 0), 1);
            const tilt = -3 + heroProgress * 6;
            frame.style.setProperty('--tilt', tilt + 'deg');
        }

        // Hide the travelling companion only near the footer. It now stays
        // visible across the About section too (previously hidden there);
        // inside About it tucks into the right gutter a little smaller so
        // it doesn't cover the story text.
        const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 260;
        let overAbout = false;
        if (about) {
            const ar = about.getBoundingClientRect();
            overAbout = ar.top < window.innerHeight * 0.75 && ar.bottom > window.innerHeight * 0.25;
        }
        frame.classList.toggle('is-over-about', pinned && overAbout);
        // also step aside over the Projects showcase, where it would cover the info column
        let overProjects = false;
        const projSec = document.getElementById('projects');
        if (projSec && window.innerWidth >= 900) {
            const pr = projSec.getBoundingClientRect();
            overProjects = pr.top < window.innerHeight * 0.9 && pr.bottom > window.innerHeight * 0.1;
        }
        frame.classList.toggle('is-hidden', pinned && (nearBottom || overProjects));
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (window.innerWidth < 900) {
            frame.classList.remove('is-pinned', 'is-hidden', 'is-over-about');
            pinned = false;
        }
    });
    update();
}

// ==================== SCROLL REVEAL ====================
function initializeRevealObserver() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

// ==================== ANIMATIONS ====================
function initializeAnimations() {
    // Lazy Loading
    const lazyLoad = targets => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        targets.forEach(target => observer.observe(target));
    };
    lazyLoad(document.querySelectorAll('[data-src]'));

    // Smooth scrolling offset for navigation
    const nav = document.querySelector('nav');
    if (nav) {
        const navHeight = nav.offsetHeight;
        document.querySelectorAll('section').forEach(section => {
            section.style.scrollMarginTop = `${navHeight}px`;
        });
    }
}

// ==================== CONTACT FORM ====================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const statusPopup = document.getElementById('statusPopup');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        showPopup('Sending your message...', 'sending');

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://formspree.io/f/xzzebqrd', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showPopup('Message sent successfully! 🎉', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showPopup(`Error: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            setTimeout(() => {
                statusPopup.classList.remove('active', 'success', 'error', 'sending');
            }, statusPopup.classList.contains('error') ? 5000 : 3000);
        }
    });

    function showPopup(message, type) {
        statusPopup.textContent = message;
        statusPopup.className = 'statusPopup';
        statusPopup.classList.add(type, 'active');

        while (statusPopup.firstChild) {
            statusPopup.removeChild(statusPopup.firstChild);
        }

        const icon = document.createElement('i');
        switch (type) {
            case 'success':
                icon.className = 'fas fa-check';
                break;
            case 'error':
                icon.className = 'fas fa-times';
                break;
            case 'sending':
                icon.className = 'fas fa-spinner fa-spin';
                break;
        }

        statusPopup.insertBefore(icon, statusPopup.firstChild);
        statusPopup.appendChild(document.createTextNode(' ' + message));

        const dismissTime = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            statusPopup.classList.remove('active');
        }, dismissTime);
    }
}

// ==================== UTILITY FUNCTIONS ====================
// ==================== LIQUID GLASS — CURSOR-FOLLOW REFRACTION ====================
// Applies the "the pointer moves the light" hover effect to every liquid-glass
// panel on the page (contact card, video hero/gallery/player panels, etc.),
// not just the contact section.
function initContactLiquidGlass() {
    const panels = document.querySelectorAll('.contact-liquid, .liquid-glass');
    if (panels.length && window.matchMedia('(pointer: fine)').matches) {
        panels.forEach(panel => {
            panel.addEventListener('mousemove', (e) => {
                const r = panel.getBoundingClientRect();
                panel.style.setProperty('--cx', ((e.clientX - r.left) / r.width) * 100 + '%');
                panel.style.setProperty('--cy', ((e.clientY - r.top) / r.height) * 100 + '%');
            });
        });
    }

    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            const r = submitBtn.getBoundingClientRect();
            submitBtn.style.setProperty('--rx', (e.clientX - r.left) + 'px');
            submitBtn.style.setProperty('--ry', (e.clientY - r.top) + 'px');
            submitBtn.classList.remove('rippling');
            void submitBtn.offsetWidth; // restart animation
            submitBtn.classList.add('rippling');
        });
    }
}

function updateCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
}

// ==================== THEME SWITCH (animated) ====================
// window.switchTheme(x, y) flips the theme with a circular reveal that
// grows from the pressed button. Uses the View Transitions API where
// available, otherwise a colour-wipe overlay; always adds a glass ripple
// ring and spins the toggle icon. Reduced-motion users get an instant swap.
function initThemeSwitcher() {
    if (window.switchTheme) return;
    const root = document.documentElement;
    let busy = false;

    function apply() {
        root.classList.toggle('light-mode');
        try { localStorage.setItem('theme', root.classList.contains('light-mode') ? 'light' : 'dark'); } catch (e) { }
        document.dispatchEvent(new CustomEvent('themechange'));
    }

    window.switchTheme = function (x, y) {
        if (busy) return;
        const W = window.innerWidth, H = window.innerHeight;
        if (typeof x !== 'number' || (x === 0 && y === 0)) { x = W - 40; y = 40; }
        const radius = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return; }
        busy = true;

        // glass ripple ring
        const ring = document.createElement('div');
        ring.className = 'theme-ripple';
        ring.style.setProperty('--tx', x + 'px');
        ring.style.setProperty('--ty', y + 'px');
        ring.style.setProperty('--s', (radius * 2 / 40).toFixed(2));
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 900);

        root.classList.add('theme-anim');
        const done = () => { busy = false; root.classList.remove('theme-vt'); setTimeout(() => root.classList.remove('theme-anim'), 300); };
        const ease = 'cubic-bezier(0.65, 0, 0.2, 1)';

        if (document.startViewTransition) {
            root.classList.add('theme-vt');
            let vt;
            try { vt = document.startViewTransition(apply); } catch (e) { apply(); done(); return; }
            vt.ready.then(() => {
                root.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                    { duration: 800, easing: ease, pseudoElement: '::view-transition-new(root)' }
                );
            }).catch(() => { });
            vt.finished.then(done, done);
        } else {
            // Fallback: wipe in the incoming theme's base colour, swap underneath, fade out.
            const goingLight = !root.classList.contains('light-mode');
            const wipe = document.createElement('div');
            wipe.className = 'theme-wipe';
            wipe.style.background = goingLight ? '#eeecf6' : '#0b0b0d';
            wipe.style.clipPath = `circle(0px at ${x}px ${y}px)`;
            document.body.appendChild(wipe);
            const a = wipe.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 650, easing: ease, fill: 'forwards' }
            );
            a.onfinish = () => {
                apply();
                wipe.animate({ opacity: [1, 0] }, { duration: 350, fill: 'forwards' }).onfinish = () => { wipe.remove(); done(); };
            };
        }
    };
}

// ==================== PAGE TRANSITIONS ====================
// Moving between index / certificates / video plays a slat-wipe: panels
// sweep across in the direction of travel (forward = right-to-left) with
// the destination's name, then the new page reveals itself the same way.
// A tiny inline <head> script adds html.pt-cover on arrival so there is
// never a flash of un-covered content between the two pages.
function initPageTransitions() {
    const PAGES = {
        'index.html': { i: 0, name: 'Home', icon: 'fa-house' },
        'certificates.html': { i: 1, name: 'Certificates', icon: 'fa-certificate' },
        'video.html': { i: 2, name: 'Videos', icon: 'fa-video' }
    };
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pageOf = p => {
        const f = (p.split('/').pop() || 'index.html').toLowerCase();
        return PAGES[f] ? f : (f === '' ? 'index.html' : f);
    };
    const cur = pageOf(location.pathname);
    if (!PAGES[cur]) { root.classList.remove('pt-cover'); return; }

    const SLATS = 7;
    const pt = document.createElement('div');
    pt.className = 'pt';
    pt.setAttribute('aria-hidden', 'true');
    pt.innerHTML = '<div class="pt-slats">' +
        Array.from({ length: SLATS }, (_, k) => `<i class="pt-slat" style="--i:${k}"></i>`).join('') +
        '</div><div class="pt-label"><span class="pt-icon"><i class="fas"></i></span><span class="pt-name"></span><span class="pt-line"></span></div>';
    document.body.appendChild(pt);

    function setLabel(file) {
        pt.querySelector('.pt-icon i').className = 'fas ' + PAGES[file].icon;
        pt.querySelector('.pt-name').textContent = PAGES[file].name;
    }
    function reset() {
        pt.className = 'pt';
        pt.style.removeProperty('--dir');
    }

    // ---- arrival: only the first half of the animation plays (the cover on
    // leaving). Here the covered screen simply dissolves quickly.
    const arrival = window.__pt;
    if (arrival && !reduce) {
        pt.style.setProperty('--dir', arrival.d === -1 ? -1 : 1);
        setLabel(cur);
        pt.className = 'pt is-on is-covered';
        root.classList.remove('pt-cover');
        requestAnimationFrame(() => {
            pt.classList.add('is-fade');
            setTimeout(reset, 300);
        });
    } else {
        root.classList.remove('pt-cover');
    }

    // ---- departure
    let leaving = false;
    function go(href, file) {
        if (leaving) return;
        if (reduce) { location.href = href; return; }
        leaving = true;
        const dir = PAGES[file].i >= PAGES[cur].i ? 1 : -1;
        try { sessionStorage.setItem('pt', JSON.stringify({ d: dir, f: file })); } catch (e) { }
        reset();
        pt.style.setProperty('--dir', dir);
        setLabel(file);
        pt.classList.add('is-on');
        void pt.offsetWidth;
        pt.classList.add('is-in');
        setTimeout(() => { location.href = href; }, 420 + SLATS * 30 + 40);
        // safety: if navigation is blocked, don't trap the visitor
        setTimeout(() => { leaving = false; reset(); try { sessionStorage.removeItem('pt'); } catch (e) { } }, 5000);
    }

    document.addEventListener('click', e => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        if (a.target && a.target !== '_self') return;
        if (a.hasAttribute('download')) return;
        let url;
        try { url = new URL(a.href, location.href); } catch (err) { return; }
        if (url.origin !== location.origin) return;
        const file = pageOf(url.pathname);
        if (!PAGES[file] || file === cur) return;   // same page: normal behaviour
        e.preventDefault();
        e.stopImmediatePropagation();
        go(url.href, file);
    }, true);

    // back/forward cache restore: never come back to a covered screen
    window.addEventListener('pageshow', ev => {
        if (ev.persisted) { leaving = false; reset(); root.classList.remove('pt-cover'); }
    });
}

// ==================== PROJECTS SHOWCASE (desktop) ====================
// Builds an interactive stage from the existing project cards (single
// source of truth): a glass index with a sliding lens + autoplay progress,
// a 3D-tilting media panel with directional wipe transitions, and an info
// column with staggered word-by-word title reveals.
function initProjectsShowcase() {
    const section = document.querySelector('.projects-scroll-section');
    const track = document.getElementById('projectsTrack');
    if (!section || !track || document.getElementById('pjStage')) return;

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const KNOWN = ['live', 'progress', 'planned'];
    const items = Array.from(track.querySelectorAll('.project-card-v2')).map(c => {
        const img = c.querySelector('.project-thumb img');
        const st = c.querySelector('.project-status');
        return {
            end: c.classList.contains('project-card-end'),
            title: ((c.querySelector('h3') || {}).textContent || 'More').trim(),
            desc: ((c.querySelector('p') || {}).textContent || '').trim(),
            img: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : '',
            status: st ? st.textContent.trim() : '',
            sClass: st ? (KNOWN.find(k => st.classList.contains(k)) || '') : '',
            tech: Array.from(c.querySelectorAll('.tech-stack span, .project-tech span, .tech-tag')).map(s => s.textContent.trim()),
            links: Array.from(c.querySelectorAll('.project-links a, .project-end-inner a')).map(a => ({
                href: a.getAttribute('href'),
                html: a.querySelector('i') ? a.innerHTML : '<i class="fab fa-github"></i> ' + esc(a.textContent.trim())
            }))
        };
    }).filter(it => it.title);
    if (!items.length) return;

    const pad = n => String(n + 1).padStart(2, '0');
    const wrap = document.createElement('div');
    wrap.className = 'container pj-wrap';
    wrap.innerHTML = `
      <div class="pj-stage" id="pjStage" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Projects showcase — use arrow keys to switch">
        <span class="pj-blob a"></span><span class="pj-blob b"></span>
        <div class="pj-list" role="tablist" aria-orientation="vertical">
          <span class="pj-lens" aria-hidden="true"></span>
          ${items.map((it, i) => `
            <button class="pj-item" role="tab" type="button" data-i="${i}" aria-selected="false">
              <span class="pj-num">${items[i].end ? '→' : pad(i)}</span>
              <span class="pj-name">${esc(it.end ? 'More on GitHub' : it.title)}</span>
              ${it.status ? `<span class="pj-tag ${it.sClass}">${esc(it.status)}</span>` : '<i class="fas fa-arrow-up-right-from-square" style="color:var(--paper-faint);font-size:.8rem"></i>'}
              <span class="pj-bar"><i></i></span>
            </button>`).join('')}
        </div>
        <div class="pj-view">
          <div class="pj-media" id="pjMedia">
            ${items.map((it, i) => `
              <div class="pj-slide" data-i="${i}">
                <div class="pj-fallback">${it.end ? '<b><i class="fab fa-github" style="font-size:.8em"></i></b>' : `<b>${esc(it.title.charAt(0))}</b>`}<span>${esc(it.end ? 'github.com' : 'preview')}</span></div>
                ${it.img ? `<img src="${esc(it.img)}" alt="${esc(it.alt)}" loading="lazy" onerror="this.style.display='none'">` : ''}
              </div>`).join('')}
            <span class="pj-shade"></span>
            <span class="pj-status" id="pjStatus"></span>
            <span class="pj-corner tr"></span><span class="pj-corner bl"></span><span class="pj-corner br"></span>
          </div>
          <div class="pj-info" id="pjInfo" aria-live="polite">
            <div class="pj-count"><b id="pjCur">01</b> / ${pad(items.filter(x => !x.end).length - 1)}</div>
            <h3 class="pj-title" id="pjTitle"></h3>
            <p class="pj-desc" id="pjDesc"></p>
            <div class="pj-tech" id="pjTech"></div>
            <div class="pj-links" id="pjLinks"></div>
            <div class="pj-nav">
              <button type="button" id="pjPrev" aria-label="Previous project"><i class="fas fa-arrow-left"></i></button>
              <button type="button" id="pjNext" aria-label="Next project"><i class="fas fa-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>`;
    const sticky = section.querySelector('.projects-sticky');
    section.insertBefore(wrap, sticky || null);

    const stage = wrap.querySelector('#pjStage');
    const list = Array.from(stage.querySelectorAll('.pj-item'));
    const slides = Array.from(stage.querySelectorAll('.pj-slide'));
    const lens = stage.querySelector('.pj-lens');
    const media = stage.querySelector('#pjMedia');
    const info = stage.querySelector('#pjInfo');
    const $ = id => stage.querySelector('#' + id);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTO_MS = 7000;
    let cur = -1;
    stage.style.setProperty('--pj-dur', AUTO_MS + 'ms');
    if (reduce) stage.classList.add('no-auto');

    function placeLens() {
        const el = list[Math.max(cur, 0)];
        if (!el) return;
        lens.style.setProperty('--y', el.offsetTop + 'px');
        lens.style.setProperty('--h', el.offsetHeight + 'px');
    }

    function renderInfo(it, k) {
        $('pjCur').textContent = it.end ? '→' : pad(k);
        const words = it.title.split(/\s+/);
        $('pjTitle').innerHTML = words.map((w, wi) => `<span class="w"><span style="--wi:${wi}">${esc(w)}</span></span>`).join('');
        $('pjDesc').textContent = it.desc;
        $('pjTech').innerHTML = it.tech.map(t => `<span>${esc(t)}</span>`).join('');
        $('pjTech').style.display = it.tech.length ? '' : 'none';
        $('pjLinks').innerHTML = it.links.map(l => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${l.html}</a>`).join('');
        const st = $('pjStatus');
        st.className = 'pj-status ' + it.sClass;
        st.textContent = it.status;
        st.style.display = it.status ? '' : 'none';
        Array.from(info.children).forEach((c, n) => c.style.setProperty('--k', n));
        info.classList.remove('is-in');
        void info.offsetWidth;
        info.classList.add('is-in');
    }

    function select(n, dir) {
        n = (n + items.length) % items.length;
        if (n === cur) return;
        const first = cur === -1;
        if (!dir) dir = first || n > cur ? 1 : -1;
        stage.dataset.dir = dir;
        const prev = cur;
        cur = n;

        list.forEach((el, i) => {
            const on = i === n;
            el.classList.toggle('is-active', on);
            el.setAttribute('aria-selected', on ? 'true' : 'false');
            el.tabIndex = on ? 0 : -1;
        });
        // restart the autoplay bar
        const bar = list[n].querySelector('.pj-bar i');
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';

        slides.forEach((s, i) => {
            s.classList.remove('is-prev', 'no-anim');
            if (i === n) { s.classList.remove('is-active'); void s.offsetWidth; s.classList.add('is-active'); if (first || reduce) s.classList.add('no-anim'); }
            else if (i === prev && !reduce) { s.classList.remove('is-active'); s.classList.add('is-prev'); }
            else s.classList.remove('is-active');
        });
        if (prev !== -1) setTimeout(() => slides[prev] && slides[prev].classList.remove('is-prev'), 1000);

        renderInfo(items[n], n);
        placeLens();
    }

    list.forEach((el, i) => el.addEventListener('click', () => select(i, i > cur ? 1 : -1)));
    $('pjNext').addEventListener('click', () => select(cur + 1, 1));
    $('pjPrev').addEventListener('click', () => select(cur - 1, -1));

    // autoplay: when the active bar completes, advance
    stage.addEventListener('animationend', e => {
        if (e.animationName === 'pjFill' && !reduce) select(cur + 1, 1);
    });

    // pause on hover/focus, and whenever the stage is off-screen
    const pause = on => stage.classList.toggle('is-paused', on);
    let hovering = false, visible = true;
    const sync = () => pause(hovering || !visible || document.hidden);
    stage.addEventListener('pointerenter', () => { hovering = true; sync(); });
    stage.addEventListener('pointerleave', () => { hovering = false; sync(); });
    stage.addEventListener('focusin', () => { hovering = true; sync(); });
    stage.addEventListener('focusout', () => { hovering = false; sync(); });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); }, { threshold: 0.25 }).observe(stage);
    }

    // keyboard
    stage.addEventListener('keydown', e => {
        const k = e.key;
        if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); select(cur + 1, 1); }
        else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); select(cur - 1, -1); }
        else if (k === 'Home') { e.preventDefault(); select(0, -1); }
        else if (k === 'End') { e.preventDefault(); select(items.length - 1, 1); }
    });

    // 3D tilt + parallax + cursor glare on the media panel
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
        media.addEventListener('pointermove', e => {
            const r = media.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            media.classList.remove('is-leaving');
            media.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
            media.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
            media.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
            media.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
            media.style.setProperty('--px', ((0.5 - px) * 16).toFixed(1) + 'px');
            media.style.setProperty('--py', ((0.5 - py) * 12).toFixed(1) + 'px');
        });
        media.addEventListener('pointerleave', () => {
            media.classList.add('is-leaving');
            ['--rx', '--ry', '--px', '--py'].forEach(p => media.style.removeProperty(p));
        });
    }

    // swipe (touch laptops / tablets in landscape)
    let sx = null;
    media.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') sx = e.clientX; });
    media.addEventListener('pointerup', e => {
        if (sx == null) return;
        const dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 50) select(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });

    window.addEventListener('resize', placeLens);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeLens);
    select(0, 1);
    requestAnimationFrame(placeLens);
}


// ==================== DESKTOP HAMBURGER MENU ====================
// A glass dropdown that blooms out of the nav pill: burger morphs to an X,
// the panel reveals with a circular clip from the button, and the items
// spring in one after another. Desktop only (mobile uses the app shell).
function initDesktopMenu() {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    const host = nav && nav.querySelector('.hamburger-menu');
    if (!host || document.getElementById('dmPanel')) return;

    const curPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase() || 'index.html';
    const ITEMS = [
        { l: 'Home', d: 'Back to the top', i: 'fa-house', p: 'index.html', c: ['#f0b25a', '#dd7a3b'] },
        { l: 'About', d: 'The story so far', i: 'fa-user', s: 'about', c: ['#9d8cff', '#6d5bd0'] },
        { l: 'Experience', d: 'Roles & work', i: 'fa-briefcase', s: 'experience', c: ['#5fb3a3', '#2f8272'] },
        { l: 'Achievements', d: 'Milestones', i: 'fa-trophy', s: 'achievements', c: ['#f0b25a', '#b9741e'] },
        { l: 'Skills', d: 'Tools & stack', i: 'fa-code', s: 'skills', c: ['#6f8cf0', '#4a5fd0'] },
        { l: 'Languages', d: 'Five and counting', i: 'fa-language', s: 'languages', c: ['#c97b84', '#b5566b'] },
        { l: 'Projects', d: 'Things I build', i: 'fa-folder-open', s: 'projects', c: ['#5fb3a3', '#3a9a88'] },
        { l: 'Certificates', d: 'Proof of learning', i: 'fa-certificate', p: 'certificates.html', c: ['#dd9a3b', '#c97b84'] },
        { l: 'Videos', d: 'Editing portfolio', i: 'fa-video', p: 'video.html', c: ['#9d8cff', '#c97b84'] },
        { l: 'Contact', d: 'Say hello', i: 'fa-envelope', s: 'contact', c: ['#7fb87f', '#2f8272'] }
    ];
    const SOCIAL = [
        ['fab fa-github', 'https://github.com/asikafridi', 'GitHub'],
        ['fab fa-linkedin', 'https://linkedin.com/in/asikafridi', 'LinkedIn'],
        ['fas fa-envelope', 'mailto:asikurrahman.contact@gmail.com', 'Email'],
        ['fas fa-code', 'https://codeforces.com/profile/asikafridi', 'Codeforces']
    ];

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dm-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'dmPanel');
    btn.innerHTML = '<span class="dm-burger"><i></i><i></i><i></i></span>';
    host.appendChild(btn);

    const backdrop = document.createElement('div');
    backdrop.className = 'dm-backdrop';
    const panel = document.createElement('aside');
    panel.className = 'dm-panel';
    panel.id = 'dmPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Site menu');
    panel.innerHTML = `
        <div class="dm-head"><span>// navigate</span><kbd>esc</kbd></div>
        <div class="dm-grid">${ITEMS.map((it, n) => {
        const href = it.s ? 'index.html#' + it.s : it.p;
        const cur = !it.s && it.p === curPage ? ' is-current' : '';
        return `<a class="dm-item${cur}" href="${href}" ${it.s ? `data-section="${it.s}"` : ''} data-page="${it.s ? 'index.html' : it.p}" style="--d:${n};--c1:${it.c[0]};--c2:${it.c[1]}">
                <span class="dm-ic"><i class="fas ${it.i}"></i></span>
                <span class="dm-t"><b>${it.l}</b><small>${it.d}</small></span></a>`;
    }).join('')}</div>
        <div class="dm-foot">
            <div class="dm-social">${SOCIAL.map(s => `<a href="${s[1]}" aria-label="${s[2]}" ${s[1].indexOf('http') === 0 ? 'target="_blank" rel="noopener"' : ''}><i class="${s[0]}"></i></a>`).join('')}</div>
            <div class="dm-seg" role="group" aria-label="Appearance">
                <button type="button" data-t="dark"><i class="fas fa-moon"></i> Dark</button>
                <button type="button" data-t="light"><i class="fas fa-sun"></i> Light</button>
            </div>
        </div>`;
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    const root = document.documentElement;
    const segBtns = Array.from(panel.querySelectorAll('.dm-seg button'));
    const syncSeg = () => {
        const light = root.classList.contains('light-mode');
        segBtns.forEach(b => b.classList.toggle('is-on', (b.dataset.t === 'light') === light));
    };
    syncSeg();
    document.addEventListener('themechange', syncSeg);
    new MutationObserver(syncSeg).observe(root, { attributes: true, attributeFilter: ['class'] });
    segBtns.forEach(b => b.addEventListener('click', () => {
        const wantLight = b.dataset.t === 'light';
        if (wantLight === root.classList.contains('light-mode')) return;
        const r = b.getBoundingClientRect();
        if (window.switchTheme) window.switchTheme(r.left + r.width / 2, r.top + r.height / 2);
    }));

    // keep the panel aligned under the nav pill's right edge
    function place() {
        const scrolled = nav.classList.contains('is-scrolled');
        const w = Math.min(scrolled ? 1000 : 1140, window.innerWidth - 48);
        panel.style.right = ((window.innerWidth - w) / 2) + 'px';
        panel.style.top = ((scrolled ? 10 : 14) + 62 + 12) + 'px';
    }

    let lastFocus = null;
    const isOpen = () => panel.classList.contains('is-open');
    function open() {
        place();
        lastFocus = document.activeElement;
        panel.classList.add('is-open');
        backdrop.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close menu');
    }
    function close(restore) {
        if (!isOpen()) return;
        panel.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
        if (restore !== false) btn.focus({ preventScroll: true });
    }
    btn.addEventListener('click', () => (isOpen() ? close() : open()));
    backdrop.addEventListener('click', () => close(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.addEventListener('scroll', () => { if (isOpen()) place(); }, { passive: true });
    window.addEventListener('resize', () => { if (window.innerWidth < 900) close(false); else if (isOpen()) place(); });

    // same-page jumps scroll smoothly; cross-page links go through the page transition
    panel.querySelectorAll('.dm-item').forEach(a => a.addEventListener('click', e => {
        const onThisPage = a.dataset.page === curPage || (a.dataset.page === 'index.html' && curPage === 'index.html');
        if (!onThisPage) { close(false); return; }
        e.preventDefault();
        close(false);
        setTimeout(() => {
            const sec = a.dataset.section && document.getElementById(a.dataset.section);
            const top = sec ? sec.getBoundingClientRect().top + window.pageYOffset - 92 : 0;
            window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
            try { history.replaceState(null, '', sec ? '#' + a.dataset.section : location.pathname); } catch (err) { }
        }, 120);
    }));
}
