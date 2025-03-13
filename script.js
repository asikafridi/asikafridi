// Smooth scrolling for navigation links
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

// Contact Form Handling with Formspree
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const successMessage = document.getElementById('successMessage');

    try {
        const response = await fetch('https://formspree.io/f/xzzebqrd', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            successMessage.textContent = "Message sent successfully!";
            successMessage.style.color = '#4CAF50';
            successMessage.style.borderColor = '#4CAF50';
            successMessage.style.display = 'block';
            this.reset();

            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown error');
        }
    } catch (error) {
        successMessage.textContent = `Error: ${error.message}`;
        successMessage.style.color = '#ff4444';
        successMessage.style.borderColor = '#ff4444';
        successMessage.style.display = 'block';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});

//bottom for dynamic year
document.getElementById('currentYear').textContent = new Date().getFullYear();