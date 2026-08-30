// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    initCinemaIntro();
    initSplitText();
    initializeNavigation();
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
    initContactLiquidGlass();
    updateCurrentYear();
});

// ==================== CINEMA OPENING ====================
// A projector countdown leader (3-2-1, ring sweep, title card, flash) that
// plays once per browser session on entry, then iris-wipes away to reveal
// the site — like a film starting. The overlay is invisible unless this
// function explicitly opts it in, and every step has a fallback timer, so
// a stalled animation or thrown error can never leave a visitor stuck
// behind a black screen.
function initCinemaIntro() {
    const intro = document.getElementById('cinemaIntro');
    if (!intro) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadyShown = sessionStorage.getItem('cinemaIntroShown');

    if (alreadyShown) {
        return; // stays display:none per its default CSS — nothing to clean up
    }
    sessionStorage.setItem('cinemaIntroShown', '1');

    // Reduced motion: skip straight to a quick, static reveal instead of
    // the full countdown sequence.
    if (reduceMotion) {
        intro.classList.add('is-active');
        requestAnimationFrame(() => {
            intro.style.transition = 'opacity 0.3s ease';
            intro.style.opacity = '0';
            setTimeout(() => intro.classList.add('is-hidden'), 320);
        });
        return;
    }

    try {
        intro.classList.add('is-active');
        document.body.style.overflow = 'hidden';

        const countEl = document.getElementById('cinemaCount');
        const sweepEl = intro.querySelector('.ring-sweep');
        const leaderEl = document.getElementById('cinemaLeader');
        const titleEl = document.getElementById('cinemaTitle');
        const flashEl = document.getElementById('cinemaFlash');

        function finish() {
            document.body.style.overflow = '';
            intro.classList.remove('is-active');
            intro.classList.add('is-hidden');
        }

        // Safety net — whatever else happens, the overlay comes down well
        // before this fires.
        const safety = setTimeout(finish, 6500);

        const beats = ['3', '2', '1'];
        let i = 0;
        function tick() {
            if (i < beats.length) {
                countEl.textContent = beats[i];
                countEl.classList.remove('is-visible');
                sweepEl.classList.remove('is-sweeping');
                void countEl.offsetWidth; // restart the CSS animations
                void sweepEl.getBoundingClientRect();
                countEl.classList.add('is-visible');
                sweepEl.classList.add('is-sweeping');
                i++;
                setTimeout(tick, 680);
            } else {
                leaderEl.classList.add('is-done');
                titleEl.classList.add('is-visible');
                setTimeout(() => {
                    titleEl.classList.remove('is-visible');
                    flashEl.classList.add('is-flashing');
                    setTimeout(() => {
                        intro.classList.add('is-wiping');
                        document.body.style.overflow = '';
                        setTimeout(() => {
                            clearTimeout(safety);
                            finish();
                        }, 1250);
                    }, 260);
                }, 950);
            }
        }
        setTimeout(tick, 350);
    } catch (err) {
        // If anything above throws, never leave the site hidden.
        document.body.style.overflow = '';
        intro.classList.add('is-hidden');
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
            const dist = Math.abs((r.top + r.height / 2) - viewportCenter);
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
            const dist = Math.abs((r.top + r.height / 2) - viewportCenter);
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
    const isDesktop = () => window.innerWidth >= 900;

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

    themeToggle.addEventListener('click', () => {
        const htmlEl = document.documentElement;
        htmlEl.classList.toggle('light-mode');

        const theme = htmlEl.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        updateThemeIndicator();
    });

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

        // Hide the travelling companion where it would clash: near the footer,
        // and across the About section (which now has its own portrait).
        const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 260;
        let overAbout = false;
        if (about) {
            const ar = about.getBoundingClientRect();
            overAbout = ar.top < window.innerHeight * 0.5 && ar.bottom > window.innerHeight * 0.15;
        }
        frame.classList.toggle('is-hidden', pinned && (nearBottom || overAbout));
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
            frame.classList.remove('is-pinned', 'is-hidden');
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
