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

// Hambuger
// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#mobile-nav');
const menuOverlay = document.querySelector('.menu-overlay');

const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuOverlay.style.visibility = isOpen ? 'visible' : 'hidden';
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
};

// Toggle menu on hamburger click
menuToggle.addEventListener('click', toggleMenu);

// Close menu on these events
menuOverlay.addEventListener('click', toggleMenu);
document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        // Only close the menu on mobile screens
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        toggleMenu();
    }
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
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const navHeight = document.querySelector('nav').offsetHeight;

        window.scrollTo({
            top: targetSection.offsetTop - navHeight,
            behavior: 'smooth'
        });

        // Update URL without default jump
        history.replaceState(null, null, targetId);
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
