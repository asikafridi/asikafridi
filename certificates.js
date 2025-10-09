// 3D Certificates Carousel - Multiple Sections with Auto-Rotation
document.addEventListener('DOMContentLoaded', function () {
    // Certificate data for full view
    const certificateData = {
        // Section 1: Achievements & Resume
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
        },

        // Section 2: MICROSOFT Certificates
        microsoft1: {
            image: 'images/microsoft/microsoft-1.jpg',
            title: 'Introduction to Microsoft 365 Copilot',
            description: 'Fundamental understanding of Microsoft 365 Copilot capabilities and basic implementation strategies for AI-powered productivity enhancement.',
            download: 'documents/microsoft/microsoft-1.pdf'
        },
        microsoft2: {
            image: 'images/microsoft/microsoft-2.jpg',
            title: 'Optimize and extend Microsoft 365 Copilot',
            description: 'Advanced techniques for optimizing and extending Microsoft 365 Copilot functionality to maximize productivity and workflow efficiency.',
            download: 'documents/microsoft/microsoft-2.pdf'
        },
        microsoft3: {
            image: 'images/microsoft/microsoft-3.jpg',
            title: 'Explore the possibilities with Microsoft 365 Copilot',
            description: 'Discovering innovative applications and creative uses of Microsoft 365 Copilot across various business scenarios and use cases.',
            download: 'documents/microsoft/microsoft-3.pdf'
        },
        microsoft4: {
            image: 'images/microsoft/microsoft-4.jpg',
            title: 'Create and draft with Microsoft 365 Copilot',
            description: 'Mastering content creation and drafting capabilities using Microsoft 365 Copilot for documents, presentations, and communications.',
            download: 'documents/microsoft/microsoft-4.pdf'
        },
        microsoft5: {
            image: 'images/microsoft/microsoft-5.jpg',
            title: 'Ask questions and analyze content with Microsoft 365 Copilot',
            description: 'Advanced content analysis and intelligent question-answering techniques using Microsoft 365 Copilot for data-driven insights.',
            download: 'documents/microsoft/microsoft-5.pdf'
        },
        microsoft6: {
            image: 'images/microsoft/microsoft-6.jpg',
            title: 'Edit and transform content with Microsoft 365 Copilot',
            description: 'Content editing, transformation, and refinement capabilities using Microsoft 365 Copilot tools for professional document preparation.',
            download: 'documents/microsoft/microsoft-6.pdf'
        },
        microsoft7: {
            image: 'images/microsoft/microsoft-7.jpg',
            title: 'Summarize and simplify information with Microsoft 365 Copilot',
            description: 'Information summarization and simplification techniques using Microsoft 365 Copilot for clear and concise communication.',
            download: 'documents/microsoft/microsoft-7.pdf'
        },

        // Section 3: TRAINING CERTIFICATIONS
        training1: {
            image: 'images/training/training-1.jpg',
            title: 'Setting and Achieving Focus, Goals and Targets',
            description: 'Strategic goal setting and achievement methodologies for professional success and personal development.',
            download: 'documents/training/training-1.pdf'
        },
        training2: {
            image: 'images/training/training-2.jpg',
            title: 'Leadership Qualities – Boss VS Leader',
            description: 'Understanding the fundamental differences between being a boss and being a true leader with practical leadership principles.',
            download: 'documents/training/training-2.pdf'
        },
        training3: {
            image: 'images/training/training-3.jpg',
            title: 'Positivity – How To Build Positive Mentality',
            description: 'Techniques and strategies for developing and maintaining a positive mindset in personal and professional life.',
            download: 'documents/training/training-3.pdf'
        },
        training4: {
            image: 'images/training/training-4.jpg',
            title: 'Soft Skill and Hard Skill Development',
            description: 'Comprehensive understanding of both soft and hard skills for professional growth and career advancement.',
            download: 'documents/training/training-4.pdf'
        },
        training5: {
            image: 'images/training/training-5.jpg',
            title: 'Become & Make A Leader: With Examples',
            description: 'Practical leadership development with real-world examples and case studies for effective team management.',
            download: 'documents/training/training-5.pdf'
        },
        training6: {
            image: 'images/training/training-6.jpg',
            title: 'Employability skills [Part 1]: Improve Job Opportunities',
            description: 'Essential employability skills to enhance job market competitiveness and career opportunities.',
            download: 'documents/training/training-6.pdf'
        },
        training7: {
            image: 'images/training/training-7.jpg',
            title: 'Career Planning from News Media: Advanced Technique',
            description: 'Advanced career planning strategies using insights from news media and current market trends.',
            download: 'documents/training/training-7.pdf'
        },
        training8: {
            image: 'images/training/training-8.jpg',
            title: 'Start-up Entrepreneurship: Complete Guideline',
            description: 'Comprehensive guide to start-up entrepreneurship from ideation to execution and business growth.',
            download: 'documents/training/training-8.pdf'
        }
    };

    // Section configurations
    const sections = {
        achievements: {
            totalItems: 5,
            angle: 360 / 5,
            autoRotateInterval: null
        },
        microsoft: {
            totalItems: 7,
            angle: 360 / 7,
            autoRotateInterval: null
        },
        training: {
            totalItems: 8,
            angle: 360 / 8,
            autoRotateInterval: null
        }
    };

    // Initialize all sections
    Object.keys(sections).forEach(sectionId => {
        initializeSection(sectionId);
    });

    function initializeSection(sectionId) {
        const section = sections[sectionId];
        const carousel = document.querySelector(`#${sectionId}-carousel .carousel`);
        const items = document.querySelectorAll(`#${sectionId}-carousel .certificate-item`);
        const prevBtn = document.querySelector(`.carousel-nav.prev[data-section="${sectionId}"]`);
        const nextBtn = document.querySelector(`.carousel-nav.next[data-section="${sectionId}"]`);
        const viewBtns = document.querySelectorAll(`.view-btn[data-section="${sectionId}"]`);
        const carouselContainer = document.getElementById(`${sectionId}-carousel`);
        const gridContainer = document.getElementById(`${sectionId}-grid`);

        let currentIndex = 0;
        let hasFlippedCard = false;

        // Initialize carousel
        function initCarousel() {
            items.forEach((item, index) => {
                const rotateY = index * section.angle;
                item.style.transform = `rotateY(${rotateY}deg) translateZ(400px)`;
            });
        }

        // Rotate carousel
        function rotateCarousel(direction) {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % section.totalItems;
            } else {
                currentIndex = (currentIndex - 1 + section.totalItems) % section.totalItems;
            }

            const rotateY = -currentIndex * section.angle;
            carousel.style.transform = `rotateY(${rotateY}deg)`;
        }

        // Auto-rotate carousel
        function startAutoRotate() {
            if (section.autoRotateInterval) {
                clearInterval(section.autoRotateInterval);
            }
            section.autoRotateInterval = setInterval(() => {
                if (!hasFlippedCard) {
                    rotateCarousel('next');
                }
            }, 5000);
        }

        // Stop auto-rotate
        function stopAutoRotate() {
            if (section.autoRotateInterval) {
                clearInterval(section.autoRotateInterval);
                section.autoRotateInterval = null;
            }
        }

        // Switch between carousel and grid view
        function switchView(view) {
            viewBtns.forEach(btn => {
                btn.classList.remove('active');
            });

            if (view === 'carousel') {
                document.querySelector(`.view-btn[data-section="${sectionId}"][data-view="carousel"]`).classList.add('active');
                carouselContainer.classList.remove('hidden');
                gridContainer.classList.add('hidden');
                startAutoRotate();
            } else {
                document.querySelector(`.view-btn[data-section="${sectionId}"][data-view="grid"]`).classList.add('active');
                carouselContainer.classList.add('hidden');
                gridContainer.classList.remove('hidden');
                stopAutoRotate();
            }
        }

        // Initialize carousel items with improved touch handling
        function initCarouselItems() {
            items.forEach(item => {
                let touchStartY = 0;
                let touchStartX = 0;
                let touchEndY = 0;
                let touchEndX = 0;
                let isTouchMove = false;

                // Desktop click
                item.addEventListener('click', function (e) {
                    if (!e.target.closest('.view-full-btn')) {
                        this.classList.toggle('flipped');
                        hasFlippedCard = this.classList.contains('flipped');

                        if (hasFlippedCard) {
                            stopAutoRotate();
                        } else {
                            const anyFlipped = Array.from(items).some(i => i.classList.contains('flipped'));
                            if (!anyFlipped) {
                                startAutoRotate();
                            }
                        }
                    }
                });

                // Touch start
                item.addEventListener('touchstart', function (e) {
                    if (e.target.closest('.view-full-btn')) {
                        return;
                    }
                    touchStartY = e.touches[0].clientY;
                    touchStartX = e.touches[0].clientX;
                    isTouchMove = false;
                }, { passive: true });

                // Touch move
                item.addEventListener('touchmove', function (e) {
                    if (e.target.closest('.view-full-btn')) {
                        return;
                    }
                    touchEndY = e.touches[0].clientY;
                    touchEndX = e.touches[0].clientX;

                    const deltaY = Math.abs(touchEndY - touchStartY);
                    const deltaX = Math.abs(touchEndX - touchStartX);

                    if (deltaY > 10 || deltaX > 10) {
                        isTouchMove = true;
                    }
                }, { passive: true });

                // Touch end
                item.addEventListener('touchend', function (e) {
                    if (e.target.closest('.view-full-btn')) {
                        return;
                    }

                    if (!isTouchMove) {
                        e.preventDefault();
                        this.classList.toggle('flipped');
                        hasFlippedCard = this.classList.contains('flipped');

                        if (hasFlippedCard) {
                            stopAutoRotate();
                        } else {
                            const anyFlipped = Array.from(items).some(i => i.classList.contains('flipped'));
                            if (!anyFlipped) {
                                startAutoRotate();
                            }
                        }
                    }

                    isTouchMove = false;
                });
            });
        }

        // Initialize grid items with IMMEDIATE flip on click/tap
        function initGridItems() {
            const gridItems = document.querySelectorAll(`#${sectionId}-grid .grid-item`);
            gridItems.forEach(item => {
                // Desktop click - immediate flip
                item.addEventListener('click', function (e) {
                    if (!e.target.closest('.view-full-btn')) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.classList.toggle('flipped');
                    }
                });

                // Mobile touch handling - immediate flip
                let touchStartTime = 0;
                let touchStartY = 0;
                let touchStartX = 0;

                item.addEventListener('touchstart', function (e) {
                    if (e.target.closest('.view-full-btn')) {
                        return;
                    }
                    touchStartTime = Date.now();
                    touchStartY = e.touches[0].clientY;
                    touchStartX = e.touches[0].clientX;
                }, { passive: true });

                item.addEventListener('touchend', function (e) {
                    if (e.target.closest('.view-full-btn')) {
                        return;
                    }

                    const touchEndTime = Date.now();
                    const touchEndY = e.changedTouches[0].clientY;
                    const touchEndX = e.changedTouches[0].clientX;

                    const deltaY = Math.abs(touchEndY - touchStartY);
                    const deltaX = Math.abs(touchEndX - touchStartX);
                    const touchDuration = touchEndTime - touchStartTime;

                    // If it's a quick tap (< 200ms) with minimal movement (< 10px)
                    if (touchDuration < 200 && deltaY < 10 && deltaX < 10) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.classList.toggle('flipped');
                    }
                });

                // Prevent default click behavior on mobile
                item.addEventListener('touchcancel', function () {
                    touchStartTime = 0;
                });
            });
        }

        // Event listeners
        prevBtn.addEventListener('click', () => {
            rotateCarousel('prev');
            stopAutoRotate();
            hasFlippedCard = false;
            items.forEach(item => item.classList.remove('flipped'));
            setTimeout(() => {
                if (!hasFlippedCard) startAutoRotate();
            }, 100);
        });

        nextBtn.addEventListener('click', () => {
            rotateCarousel('next');
            stopAutoRotate();
            hasFlippedCard = false;
            items.forEach(item => item.classList.remove('flipped'));
            setTimeout(() => {
                if (!hasFlippedCard) startAutoRotate();
            }, 100);
        });

        viewBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const view = this.getAttribute('data-view');
                switchView(view);
            });
        });

        // Initialize
        initCarousel();
        initCarouselItems();
        initGridItems();
        startAutoRotate();

        // Enhanced touch swipe for mobile carousel navigation
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        const swipeThreshold = 30;

        carouselContainer.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
                if (deltaX < 0) {
                    rotateCarousel('next');
                } else {
                    rotateCarousel('prev');
                }
                stopAutoRotate();
                hasFlippedCard = false;
                items.forEach(item => item.classList.remove('flipped'));
                setTimeout(() => {
                    if (!hasFlippedCard) startAutoRotate();
                }, 100);
            }
        }
    }

    // Modal functionality (shared across all sections)
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

    // Show certificate in full view
    function showFullView(certificateId) {
        const data = certificateData[certificateId];
        if (data) {
            modalImage.src = data.image;
            modalImage.alt = data.title;
            modalTitle.textContent = data.title;
            modalDescription.textContent = data.description;

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

    // Navigate to contact section
    function goToContact() {
        closeDownloadModal();

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
            sessionStorage.setItem('targetSection', 'contact');
            sessionStorage.setItem('smoothScroll', 'true');
            window.location.href = 'index.html';
        }
    }

    // View Full buttons for all sections
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

        if (e.key === 'Escape') {
            if (downloadModal.classList.contains('active')) {
                closeDownloadModal();
            } else if (modal.classList.contains('active')) {
                closeFullView();
            }
        }
    });
});
