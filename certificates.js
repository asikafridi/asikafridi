// 3D Certificates Carousel
document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.certificate-item');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const carouselViewBtn = document.getElementById('carouselView');
    const gridViewBtn = document.getElementById('gridView');
    const carouselContainer = document.querySelector('.carousel-container');
    const gridContainer = document.querySelector('.grid-container');
    const modal = document.getElementById('fullViewModal');
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDownload = document.getElementById('modalDownload');

    // Add download modal element
    const downloadModal = document.createElement('div');
    downloadModal.className = 'modal';
    downloadModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close-modal download-close">&times;</span>
            <div class="modal-body">
                <div class="modal-info" style="text-align: center; padding: 3rem 2rem;">
                    <i class="fas fa-envelope" style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;"></i>
                    <h3 style="color: #4CAF50; margin-bottom: 1rem;">Contact for Documents</h3>
                    <p style="color: #ccc; margin-bottom: 2rem; line-height: 1.6;">
                        Please contact me for documents with details. Thank you!
                    </p>
                    <button id="goToContact" class="download-btn" style="margin: 0 auto;">
                        <i class="fas fa-arrow-right"></i> Go to Contact Section
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(downloadModal);

    let currentIndex = 0;
    const totalItems = items.length;
    const angle = 360 / totalItems;

    // Certificate data for full view
    const certificateData = {
        icpc: {
            image: 'images/ICPC certificate(as volunteer).jpg',
            title: 'ICPC Volunteer Certificate',
            description: 'Certificate of Appreciation for serving as a volunteer at the prestigious International Collegiate Programming Contest (ICPC) Asia Dhaka Regional Contest 2024.',
            download: 'documents/ICPC certificate(as volunteer).pdf'
        },
        takeoff: {
            image: 'images/Certificate of Takeoff Programming Contest.jpg',
            title: 'Take-Off Programming Contest',
            description: 'Certificate of Participation for successfully qualifying for and participating in the Main Round of The Take-Off Programming Contest (Fall 2024).',
            download: 'documents/Certificate of Takeoff Programming Contest.pdf'
        },
        uta: {
            image: 'images/UTA certificate.jpg',
            title: 'UTA Programming Contest',
            description: 'Certificate of Participation for successfully qualifying for and participating in the UTA Programming Contest (Summer 2025).',
            download: 'documents/UTA certificate.pdf'
        },
        olympiad: {
            image: 'images/DIU Science Olympiad certificate of ASIKUR RAHMAN.jpg',
            title: 'DIU Science Olympiad',
            description: 'Certificate of Participation for successfully qualifying and competing in the Main Round of the DIU Science Olympiad – Fall 2024.',
            download: 'documents/DIU Science Olympiad certificate of ASIKUR RAHMAN.pdf'
        },
        resume: {
            image: 'images/ASIKUR_RAHMAN_Resume.jpg',
            title: 'Asikur Rahman - Resume',
            description: 'Computer Science Student specializing in competitive programming and web development. Passionate about technology and constantly exploring new challenges.',
            download: 'documents/ASIKUR_RAHMAN_CV.pdf'
        }
    };

    // Initialize carousel
    function initCarousel() {
        items.forEach((item, index) => {
            const rotateY = index * angle;
            item.style.transform = `rotateY(${rotateY}deg) translateZ(300px)`;
        });
    }

    // Rotate carousel
    function rotateCarousel(direction) {
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % totalItems;
        } else {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        }

        const rotateY = -currentIndex * angle;
        carousel.style.transform = `rotateY(${rotateY}deg)`;
    }

    // Switch between carousel and grid view
    function switchView(view) {
        console.log('Switching to view:', view);

        if (view === 'carousel') {
            carouselViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            carouselContainer.classList.remove('hidden');
            gridContainer.classList.add('hidden');
            startAutoRotate();
        } else {
            gridViewBtn.classList.add('active');
            carouselViewBtn.classList.remove('active');
            carouselContainer.classList.add('hidden');
            gridContainer.classList.remove('hidden');
            stopAutoRotate();
        }
    }

    // Show certificate in full view
    function showFullView(certificateId) {
        const data = certificateData[certificateId];
        if (data) {
            modalImage.src = data.image;
            modalImage.alt = data.title;
            modalTitle.textContent = data.title;
            modalDescription.textContent = data.description;

            // Remove direct download link, show contact modal instead
            modalDownload.onclick = function (e) {
                e.preventDefault();
                closeFullView();
                showDownloadModal();
            };

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Show download modal
    function showDownloadModal() {
        downloadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close download modal
    function closeDownloadModal() {
        downloadModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close modal
    function closeFullView() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigate to contact section - FIXED
    function goToContact() {
        closeDownloadModal();

        // If we're already on index.html, scroll to contact
        if (window.location.pathname.endsWith('index.html') ||
            window.location.pathname.endsWith('/')) {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navHeight = document.querySelector('nav').offsetHeight;
                window.scrollTo({
                    top: contactSection.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        } else {
            // Navigate to index.html and scroll to contact
            sessionStorage.setItem('targetSection', 'contact');
            sessionStorage.setItem('smoothScroll', 'true');
            window.location.href = 'index.html';
        }
    }

    // flipping functionality

    // Enhanced touch interactions for mobile
    function initCarouselItems() {
        items.forEach(item => {
            // Click for desktop
            item.addEventListener('click', function (e) {
                if (!e.target.closest('.view-full-btn')) {
                    this.classList.toggle('flipped');
                }
            });

            // Touch events for mobile
            item.addEventListener('touchstart', function (e) {
                // Prevent default to avoid scrolling while trying to flip
                if (!e.target.closest('.view-full-btn')) {
                    e.preventDefault();
                }
            }, { passive: false });

            item.addEventListener('touchend', function (e) {
                if (!e.target.closest('.view-full-btn')) {
                    e.preventDefault();
                    this.classList.toggle('flipped');
                }
            });
        });
    }

    function initGridItems() {
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            // Click for desktop
            item.addEventListener('click', function (e) {
                if (!e.target.closest('.view-full-btn')) {
                    this.classList.toggle('flipped');
                }
            });

            // Touch events for mobile
            item.addEventListener('touchstart', function (e) {
                if (!e.target.closest('.view-full-btn')) {
                    e.preventDefault();
                }
            }, { passive: false });

            item.addEventListener('touchend', function (e) {
                if (!e.target.closest('.view-full-btn')) {
                    e.preventDefault();
                    this.classList.toggle('flipped');
                }
            });
        });
    }

    // Initialize
    initCarousel();
    initCarouselItems();
    initGridItems();

    // Event listeners
    prevBtn.addEventListener('click', () => rotateCarousel('prev'));
    nextBtn.addEventListener('click', () => rotateCarousel('next'));

    carouselViewBtn.addEventListener('click', () => switchView('carousel'));
    gridViewBtn.addEventListener('click', () => switchView('grid'));

    // View Full buttons for both carousel and grid
    document.querySelectorAll('.view-full-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const certificateId = this.getAttribute('data-certificate');
            showFullView(certificateId);
        });
    });

    // Modal controls
    closeModal.addEventListener('click', closeFullView);
    document.querySelector('.download-close').addEventListener('click', closeDownloadModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeFullView();
        }
    });

    downloadModal.addEventListener('click', function (e) {
        if (e.target === downloadModal) {
            closeDownloadModal();
        }
    });

    // Contact button in download modal
    document.getElementById('goToContact').addEventListener('click', goToContact);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (document.activeElement.tagName === 'INPUT') return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (modal.classList.contains('active') || downloadModal.classList.contains('active')) return;
                rotateCarousel('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (modal.classList.contains('active') || downloadModal.classList.contains('active')) return;
                rotateCarousel('next');
                break;
            case '1':
                e.preventDefault();
                if (modal.classList.contains('active') || downloadModal.classList.contains('active')) return;
                switchView('carousel');
                break;
            case '2':
                e.preventDefault();
                if (modal.classList.contains('active') || downloadModal.classList.contains('active')) return;
                switchView('grid');
                break;
            case 'Escape':
                e.preventDefault();
                if (downloadModal.classList.contains('active')) {
                    closeDownloadModal();
                } else if (modal.classList.contains('active')) {
                    closeFullView();
                }
                break;
        }
    });

    // Add this to the existing certificates.js in the touch swipe section
    // Enhanced touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 30;

    carouselContainer.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    carouselContainer.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Only handle horizontal swipes (prevent conflict with vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) {
                rotateCarousel('next');
            } else {
                rotateCarousel('prev');
            }
        }
    }

    // Add click prevention during swipe
    carouselContainer.addEventListener('touchmove', function (e) {
        // Prevent default to avoid scrolling while swiping
        if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    // Auto-rotate carousel (optional)
    let autoRotateInterval;

    function startAutoRotate() {
        stopAutoRotate();
        autoRotateInterval = setInterval(() => {
            rotateCarousel('next');
        }, 5000);
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
    }

    // Start auto-rotate when mouse leaves carousel
    carouselContainer.addEventListener('mouseenter', stopAutoRotate);
    carouselContainer.addEventListener('mouseleave', startAutoRotate);

    // Start with carousel view
    switchView('carousel');
});
