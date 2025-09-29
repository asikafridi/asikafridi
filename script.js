// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeTheme();
    initializeTypewriter();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
    initializeMobileNavigation();
    updateCurrentYear();
});

// ==================== NAVIGATION SYSTEM ====================
function initializeNavigation() {
    setupNavigationToggle();
    setupNavigationLinks();
    updateMobileNavigation();
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

        // Handle links to sections on the same page
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            scrollToSection(targetId);
        }
        // Handle links from other pages to index.html sections
        else if (href.includes('index.html#')) {
            e.preventDefault();
            const targetSection = href.split('#')[1];

            // If we're already on index.html, scroll to section
            if (window.location.pathname.endsWith('index.html') ||
                window.location.pathname.endsWith('/')) {
                scrollToSection(targetSection);
            }
            // If we're on another page, navigate to index.html first
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
    sectionElement.style.boxShadow = '0 0 0 2px #4CAF50';
    setTimeout(() => {
        sectionElement.style.boxShadow = 'none';
    }, 2000);
}

function setupNavigationToggle() {
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const dropdownLinks = document.querySelector('.dropdown-links');

    if (!hamburgerToggle || !dropdownLinks) return;

    function toggleNavigation() {
        dropdownLinks.classList.toggle('active');
        const isExpanded = dropdownLinks.classList.contains('active');
        hamburgerToggle.setAttribute('aria-expanded', isExpanded);

        const icon = hamburgerToggle.querySelector('i');
        if (icon) {
            icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
        }
    }

    function closeNavigation() {
        dropdownLinks.classList.remove('active');
        hamburgerToggle.setAttribute('aria-expanded', 'false');
        const icon = hamburgerToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }

    hamburgerToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNavigation();
    });

    // Handle navigation link clicks in dropdown
    dropdownLinks.addEventListener('click', function (e) {
        const link = e.target.closest('a[href*="#"]');
        if (link) {
            closeNavigation();

            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        }
    });

    document.addEventListener('click', function (e) {
        if (!dropdownLinks.contains(e.target) && !hamburgerToggle.contains(e.target)) {
            closeNavigation();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeNavigation();
        }
    });
}

function updateMobileNavigation() {
    const mobileNavLinks = document.querySelector('.mobile-nav-links');
    if (mobileNavLinks) {
        mobileNavLinks.addEventListener('click', function (e) {
            const link = e.target.closest('a[href*="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href && href.includes('#') && !href.includes('index.html')) {
                e.preventDefault();
                const targetSection = href.replace('#', '');
                sessionStorage.setItem('targetSection', targetSection);
                sessionStorage.setItem('smoothScroll', 'true');
                window.location.href = 'index.html';
            }
        });
    }
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
    mobileNavTitle.textContent = 'Navigation';

    const mobileCloseBtn = document.createElement('button');
    mobileCloseBtn.className = 'mobile-close-btn';
    mobileCloseBtn.innerHTML = '<i class="fas fa-times"></i>';
    mobileCloseBtn.setAttribute('aria-label', 'Close navigation');

    mobileNavHeader.appendChild(mobileNavTitle);
    mobileNavHeader.appendChild(mobileCloseBtn);

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
                        // Same page section
                        const targetId = href.substring(1);
                        setTimeout(() => scrollToSection(targetId), 300);
                    } else if (href.includes('index.html#')) {
                        // Cross-page navigation
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

    mobileNavSidebar.appendChild(mobileNavHeader);
    mobileNavSidebar.appendChild(mobileNavLinks);

    document.body.appendChild(mobileNavOverlay);
    document.body.appendChild(mobileNavSidebar);

    function openMobileMenu() {
        mobileNavOverlay.classList.add('active');
        mobileNavSidebar.classList.add('active');
        document.body.classList.add('menu-open');
        document.documentElement.style.overflow = 'hidden';

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
        "Passionate Computer Science & Engineering Student...",
        "A Research Enthusiast...",
        "Eager to Learn and Contribute...",
        "Interested in Competitive Programming & Software Development...",
        "A Creative Developer..."
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

        let typeSpeed = 120;

        if (isDeleting) {
            typeSpeed /= 3;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isEnd = true;
            typeSpeed = 2500;
        } else if (isDeleting && charIndex === 0) {
            isEnd = true;
            typeSpeed = 500;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        if (isEnd) {
            isDeleting = !isDeleting;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

// ==================== SCROLL EFFECTS ====================
function initializeScrollEffects() {
    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.scroll-progress').style.width = scrolled + '%';
    });

    // Scroll to Section
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            const navHeight = document.querySelector('nav').offsetHeight;
            window.scrollTo({
                top: aboutSection.offsetTop - navHeight + 20,
                behavior: 'smooth'
            });
        });
    }

    // Background Effects
    let mouseX = 0, mouseY = 0;
    const strength = 15;
    let scrollY = 0;
    const scrollStrength = 0.3;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / -strength;
        mouseY = (e.clientY - window.innerHeight / 2) / -strength;
        updateBackground();
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY * scrollStrength;
        updateBackground();
    });

    function updateBackground() {
        const bg = document.querySelector('.interactive-bg');
    }

    function animate() {
        requestAnimationFrame(animate);
        updateBackground();
    }
    animate();

    createParticles();
}

function createParticles() {
    const particles = document.querySelector('.particles');
    if (!particles) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            --x: ${Math.random() * 100 - 50}vw;
            --y: ${Math.random() * 100 - 50}vh;
            animation-delay: ${Math.random() * 5}s;
        `;
        particles.appendChild(particle);
    }
}

// ==================== ANIMATIONS ====================
function initializeAnimations() {
    // Timeline Animation
    const items = document.querySelectorAll(".timeline-item");
    function revealTimelineItems() {
        items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                item.classList.add("visible");
                item.style.opacity = "1";
                item.style.transform = "translateX(0)";
            }
        });
    }
    window.addEventListener("scroll", revealTimelineItems);
    revealTimelineItems();

    // Lazy Loading
    const lazyLoad = targets => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        targets.forEach(target => observer.observe(target));
    };
    lazyLoad(document.querySelectorAll('[data-src]'));

    // Skills Animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const initialSkillsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.width;
                }
            });
        },
        { threshold: 0.5 }
    );

    skillBars.forEach(bar => {
        bar.dataset.width = bar.style.width;
        bar.style.width = '30px';
        initialSkillsObserver.observe(bar);
    });

    // Smooth scrolling for navigation
    const nav = document.querySelector('nav');
    const navHeight = nav.offsetHeight;
    document.querySelectorAll('section').forEach(section => {
        section.style.scrollMarginTop = `${navHeight}px`;
    });
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

        const dismissTime = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            statusPopup.classList.remove('active');
        }, dismissTime);
    }
}

// ==================== UTILITY FUNCTIONS ====================
function updateCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}
