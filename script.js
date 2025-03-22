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
// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded',
        navLinks.classList.contains('active'));
});

// Close mobile menu on click outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
    }
});

// Improved theme toggle with localStorage
if (currentTheme === 'light') {
    document.documentElement.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    const htmlEl = document.documentElement;
    htmlEl.classList.toggle('light-mode');

    const theme = htmlEl.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
});

// Add feature detection for requestAnimationFrame
if ('requestAnimationFrame' in window) {
    animate();
} else {
    document.querySelector('.particles').style.display = 'none';
}

//upade 22-03-2025 end

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
    bg.style.transform = `translate(${mouseX}px, ${mouseY + scrollY}px) scale(1.05)`;
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

document.querySelectorAll('.project-card').forEach((card) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(50px)';
    observer.observe(card);
});
// Optimized animations
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const targetWidth = bar.dataset.width;
        bar.style.width = targetWidth;
    });
}

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
const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('button[type="submit"]');
const statusPopup = document.getElementById('statusPopup');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button and show sending state
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send message');
        }
    } catch (error) {
        showPopup(`Error: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;

        // Hide popup after 3 seconds for success, 5 seconds for errors
        const delay = statusPopup.classList.contains('error') ? 5000 : 3000;
        setTimeout(() => {
            statusPopup.classList.remove('active', 'success', 'error', 'sending');
        }, delay);
    }
});

function showPopup(message, type) {
    statusPopup.textContent = message;
    statusPopup.className = 'active'; // Reset classes
    statusPopup.classList.add(type);

    // Force reflow to enable CSS transition
    void statusPopup.offsetWidth;

    statusPopup.classList.add('active');
}

//bottom for dynamic year
document.getElementById('currentYear').textContent = new Date().getFullYear();
