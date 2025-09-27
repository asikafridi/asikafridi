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

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const dropdownLinks = document.getElementById('dropdown-nav');

    if (hamburgerToggle && dropdownLinks) {
        // Toggle dropdown menu
        hamburgerToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownLinks.classList.toggle('active');
            this.setAttribute('aria-expanded', dropdownLinks.classList.contains('active'));
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!dropdownLinks.contains(e.target) && !hamburgerToggle.contains(e.target)) {
                dropdownLinks.classList.remove('active');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close dropdown when a link is clicked (for mobile)
        dropdownLinks.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                dropdownLinks.classList.remove('active');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle keyboard navigation
        hamburgerToggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Enhanced navigation system for cross-page linking
    function setupNavigation() {
        // Handle internal page navigation with smooth scrolling
        document.querySelectorAll('a[href*="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Check if it's an internal link on the same page
                if (href.includes('#') && !href.startsWith('#')) {
                    const [page, section] = href.split('#');

                    // If linking to a different page
                    if (page && !page.includes(window.location.pathname)) {
                        e.preventDefault();

                        // Store the target section for the next page
                        sessionStorage.setItem('targetSection', section);
                        sessionStorage.setItem('smoothScroll', 'true');

                        // Navigate to the page
                        window.location.href = page;
                    }
                }
            });
        });

        // Handle smooth scrolling to target section after page load
        window.addEventListener('load', function () {
            const targetSection = sessionStorage.getItem('targetSection');
            const smoothScroll = sessionStorage.getItem('smoothScroll');

            if (targetSection && smoothScroll) {
                const targetElement = document.getElementById(targetSection);

                if (targetElement) {
                    setTimeout(() => {
                        const navHeight = document.querySelector('nav').offsetHeight;
                        window.scrollTo({
                            top: targetElement.offsetTop - navHeight,
                            behavior: 'smooth'
                        });
                    }, 100);
                }

                // Clear the stored values
                sessionStorage.removeItem('targetSection');
                sessionStorage.removeItem('smoothScroll');
            }
        });
    }

    setupNavigation();
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
