// Add this to your existing script.js file, preferably near the mobile navigation code

// Enhanced Navigation Toggle
function setupNavigationToggle() {
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const dropdownLinks = document.querySelector('.dropdown-links');
    const dropdownNav = document.getElementById('dropdown-nav');

    if (!hamburgerToggle || !dropdownLinks) return;

    function toggleNavigation() {
        dropdownLinks.classList.toggle('active');
        const isExpanded = dropdownLinks.classList.contains('active');
        hamburgerToggle.setAttribute('aria-expanded', isExpanded);

        // Update icon
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

    // Event listeners
    hamburgerToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNavigation();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!dropdownLinks.contains(e.target) && !hamburgerToggle.contains(e.target)) {
            closeNavigation();
        }
    });

    // Close dropdown when a link is clicked
    dropdownLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            closeNavigation();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeNavigation();
        }
    });

    // Handle navigation links
    dropdownLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href && href.includes('index.html#')) {
                e.preventDefault();
                closeNavigation();

                const section = href.split('#')[1];
                sessionStorage.setItem('targetSection', section);
                sessionStorage.setItem('smoothScroll', 'true');
                window.location.href = 'index.html';
            }
            // Other links will follow their normal behavior
        });
    });
}


// Enhanced Navigation System - Cross-page smooth scrolling
function handleCrossPageNavigation() {
    // Check if we have a target section stored from previous navigation
    const targetSection = sessionStorage.getItem('targetSection');
    const smoothScroll = sessionStorage.getItem('smoothScroll');

    if (targetSection && smoothScroll === 'true') {
        // Clear the storage
        sessionStorage.removeItem('targetSection');
        sessionStorage.removeItem('smoothScroll');

        // Wait for page to load completely
        setTimeout(() => {
            const sectionElement = document.getElementById(targetSection);
            if (sectionElement) {
                const navHeight = document.querySelector('nav').offsetHeight;

                // Smooth scroll to the section
                window.scrollTo({
                    top: sectionElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });

                // Add visual indicator
                highlightSection(sectionElement);
            }
        }, 300);
    }
}

// Function to highlight the target section
function highlightSection(sectionElement) {
    sectionElement.style.transition = 'all 0.5s ease';
    sectionElement.style.boxShadow = '0 0 0 2px #4CAF50';

    setTimeout(() => {
        sectionElement.style.boxShadow = 'none';
    }, 2000);
}

// Enhanced navigation link handler
function setupNavigationLinks() {
    // Handle all navigation links
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href*="#"]');
        if (!link) return;

        const href = link.getAttribute('href');

        // Check if it's a section link (contains #)
        if (href && href.includes('#')) {
            const isCurrentPage = href.includes('index.html') || href.startsWith('#');
            const targetSection = href.split('#')[1];

            if (!isCurrentPage && targetSection) {
                // Cross-page navigation - store target and navigate
                e.preventDefault();
                sessionStorage.setItem('targetSection', targetSection);
                sessionStorage.setItem('smoothScroll', 'true');
                window.location.href = 'index.html';
            }
        }
    });
}

// Update mobile navigation to handle cross-page navigation
function updateMobileNavigation() {
    const mobileNavLinks = document.querySelector('.mobile-nav-links');
    if (mobileNavLinks) {
        mobileNavLinks.addEventListener('click', function (e) {
            const link = e.target.closest('a[href*="#"]');
            if (!link) return;

            const href = link.getAttribute('href');

            if (href && href.includes('#') && !href.includes('index.html')) {
                // This is a relative link on a different page
                e.preventDefault();
                const targetSection = href.replace('#', '');
                sessionStorage.setItem('targetSection', targetSection);
                sessionStorage.setItem('smoothScroll', 'true');
                window.location.href = 'index.html';
            }
        });
    }
}

//timeline animation

document.addEventListener("DOMContentLoaded", function () {
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

    setupNavigationToggle();

    handleCrossPageNavigation();
    setupNavigationLinks();
    updateMobileNavigation();

    window.addEventListener("scroll", revealTimelineItems);
    revealTimelineItems(); // Run on page load
});

//upadte 22-03-2025

const themeToggle = document.querySelector('.theme-toggle');
const themeIndicator = document.createElement('span');
themeIndicator.className = 'theme-indicator';
themeToggle.parentNode.insertBefore(themeIndicator, themeToggle.nextSibling);

// Load saved theme
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

// Animate skill bars on scroll
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


// Typewriter Animation
// Typewriter effect for hero section
function initTypewriter() {
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

        // Set the current phrase
        currentPhrase = phrases[phraseIndex];

        // Determine typing or deleting
        if (isDeleting) {
            // Remove character
            charIndex--;
        } else {
            // Add character
            charIndex++;
        }

        // Update text with current characters
        typewriterElement.textContent = currentPhrase.substring(0, charIndex);

        // Determine typing speed
        let typeSpeed = 120; // Normal typing speed

        if (isDeleting) {
            typeSpeed /= 3; // Faster when deleting
        }

        // Check if we've reached the end of the phrase
        if (!isDeleting && charIndex === currentPhrase.length) {
            isEnd = true;
            typeSpeed = 2500; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isEnd = true;
            typeSpeed = 500; // Pause before typing next phrase
            phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next phrase
        }

        // If we're at the end, toggle deleting
        if (isEnd) {
            isDeleting = !isDeleting;
        }

        // Continue the animation
        setTimeout(type, typeSpeed);
    }

    // Start the typewriter effect after a brief delay
    setTimeout(type, 1000);
}

// Initialize typewriter when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initTypewriter();
});

// Scroll to next section on indicator click
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

// Enhanced Mobile Navigation Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Create mobile navigation elements
    const mobileNavOverlay = document.createElement('div');
    mobileNavOverlay.className = 'mobile-nav-overlay';

    const mobileNavSidebar = document.createElement('div');
    mobileNavSidebar.className = 'mobile-nav-sidebar';

    // Create mobile navigation header
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

    // Create mobile navigation links container
    const mobileNavLinks = document.createElement('div');
    mobileNavLinks.className = 'mobile-nav-links';

    // Build navigation links based on existing dropdown links
    const existingLinks = document.getElementById('dropdown-nav');
    if (existingLinks) {
        const links = existingLinks.querySelectorAll('a');
        links.forEach(link => {
            const mobileLink = link.cloneNode(true);
            mobileLink.addEventListener('click', closeMobileMenu);
            mobileNavLinks.appendChild(mobileLink);
        });
    }

    // Assemble mobile navigation
    mobileNavSidebar.appendChild(mobileNavHeader);
    mobileNavSidebar.appendChild(mobileNavLinks);

    // Add to DOM
    document.body.appendChild(mobileNavOverlay);
    document.body.appendChild(mobileNavSidebar);

    // Mobile navigation functions
    function openMobileMenu() {
        mobileNavOverlay.classList.add('active');
        mobileNavSidebar.classList.add('active');
        document.body.classList.add('menu-open');
        document.documentElement.style.overflow = 'hidden';

        // Add animation class for smooth entrance
        setTimeout(() => {
            mobileNavSidebar.style.transition = 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);

        // Set focus to close button for accessibility
        setTimeout(() => {
            mobileCloseBtn.focus();
        }, 100);
    }

    function closeMobileMenu() {
        mobileNavOverlay.classList.remove('active');
        mobileNavSidebar.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.documentElement.style.overflow = '';

        // Remove transition for next opening
        setTimeout(() => {
            mobileNavSidebar.style.transition = '';
        }, 400);
    }

    // Event listeners
    const hamburgerToggle = document.querySelector('.hamburger-toggle');

    if (hamburgerToggle) {
        hamburgerToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            openMobileMenu();
        });
    }

    mobileCloseBtn.addEventListener('click', closeMobileMenu);
    mobileNavOverlay.addEventListener('click', closeMobileMenu);

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNavSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', function (e) {
        if (mobileNavSidebar.classList.contains('active') &&
            !mobileNavSidebar.contains(e.target) &&
            !hamburgerToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileNavSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Prevent body scroll when menu is open
    mobileNavSidebar.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    mobileNavOverlay.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    // Smooth scrolling for mobile links
    mobileNavLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');

            if (href && href.includes('#')) {
                e.preventDefault();
                closeMobileMenu();

                // Handle internal navigation
                if (href.includes('index.html')) {
                    const section = href.split('#')[1];
                    sessionStorage.setItem('targetSection', section);
                    sessionStorage.setItem('smoothScroll', 'true');
                    window.location.href = 'index.html';
                } else {
                    // Scroll to section on current page
                    setTimeout(() => {
                        const targetSection = document.querySelector(href);
                        if (targetSection) {
                            const navHeight = document.querySelector('nav').offsetHeight;
                            window.scrollTo({
                                top: targetSection.offsetTop - navHeight,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);
                }
            }
        }
    });

    // Enhanced touch interactions
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

    // Add loading animation for links
    mobileNavLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 300);
        });
    });
});

//upade 22-03-2025 end

// scroll progress bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

//backgroung effect
// Mouse Movement Effect
let mouseX = 0, mouseY = 0;
const strength = 15; // Adjust sensitivity (lower = more subtle)

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / -strength;
    mouseY = (e.clientY - window.innerHeight / 2) / -strength;
    updateBackground();
});

// Scroll Parallax Effect
let scrollY = 0;
const scrollStrength = 0.3; // Adjust scroll sensitivity

window.addEventListener('scroll', () => {
    scrollY = window.scrollY * scrollStrength;
    updateBackground();
});

// Update background position
function updateBackground() {
    const bg = document.querySelector('.interactive-bg');
}

// Smooth animation loop
function animate() {
    requestAnimationFrame(animate);
    updateBackground();
}
animate();

// Generate particles
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
createParticles();


// Smooth scrolling for navigation links
document.querySelectorAll('.dropdown-links a, .visible-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // For internal page links, let the navigation system handle it
        const href = this.getAttribute('href');

        if (href && href.includes('index.html#')) {
            e.preventDefault();

            const section = href.split('#')[1];
            sessionStorage.setItem('targetSection', section);
            sessionStorage.setItem('smoothScroll', 'true');

            window.location.href = 'index.html';
        }
    });
});


// Calculate nav height dynamically
const nav = document.querySelector('nav');
const navHeight = nav.offsetHeight;

// Update scroll-margin-top for all sections
document.querySelectorAll('section').forEach(section => {
    section.style.scrollMarginTop = `${navHeight}px`;
});

//prev
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Scroll animation for project cards

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

// Optimized animations

// Update skills animation
const animateSkillBars = () => {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const targetWidth = bar.dataset.width;
        let width = 0;
        const interval = setInterval(() => {
            if (width >= parseInt(targetWidth)) {
                clearInterval(interval);
                return;
            }
            width++;
            bar.style.width = `${width}%`;
        }, 10);
    });
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skills').forEach(section => {
    skillsObserver.observe(section);
});

// Contact Form Handling with Formspree
// Enhanced form handling
// Contact Form Handling with Formspree
const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('button[type="submit"]');
const statusPopup = document.getElementById('statusPopup'); // Now correctly selected

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // This prevents the default form submission

    // Your existing code remains the same...
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

// Update the showPopup function
function showPopup(message, type) {
    statusPopup.textContent = message;
    statusPopup.className = 'statusPopup'; // Reset classes
    statusPopup.classList.add(type, 'active');

    // Remove existing icons
    while (statusPopup.firstChild) {
        statusPopup.removeChild(statusPopup.firstChild);
    }

    // Add icon based on type
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

    // Auto-dismiss
    const dismissTime = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        statusPopup.classList.remove('active');
    }, dismissTime);
}

//bottom for dynamic year
document.getElementById('currentYear').textContent = new Date().getFullYear();
