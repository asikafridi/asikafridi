// Enhanced Video Portfolio Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS — guarded so that if the CDN script is slow/blocked,
    // the rest of this file (gallery, stats, modal) still runs instead of
    // the whole page's interactivity being silently aborted by a single
    // uncaught "AOS is not defined" error.
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // Video data
    const videoData = [
        {
            id: 'idol',
            title: 'My Idol: Hazrat Umar Ibn al-Khattab(RA)',
            description: 'A heartfelt tribute to my idol, Hazrat Umar Ibn al-Khattab (RA), this video reflects the values that inspire me—justice, integrity, courage, and unwavering leadership. Through this showcase, I share how his life and principles continue to shape my character, mindset, and aspirations both personally and professionally.',
            duration: '3:34',
            date: 'December 2025',
            thumbnail: 'images/Idol_Cover.jpg',
            videoId: '17DyGcv52ayyl1Zq5X-TG4W1kR9fnXx16',
            category: 'creative',
            likes: 42,
            views: 128
        },
        {
            id: 'documentary',
            title: 'Environment & Sustainability in Bangladesh',
            description: 'A documentary exploring environmental challenges and sustainability efforts in Bangladesh. This project showcases my skills in video editing, voice over/narration, resource collection, script writing, and video shooting.',
            duration: '7:26',
            date: '28th November, 2025',
            thumbnail: 'images/Documentary Cover.jpg',
            videoId: '19yeXo2GBwot6ybTTARJLGGRylH5qFUZf',
            category: 'documentary',
            likes: 38,
            views: 156
        },
        {
            id: 'sample',
            title: 'Editing Sample',
            description: 'Demonstration of my video editing skills and techniques, showcasing attention to detail and creative approach. This sample highlights various editing techniques including transitions, color grading, and audio mixing.',
            duration: '1:50',
            date: 'February 2024',
            thumbnail: 'images/Metro_Life.jpg',
            videoId: '10G859vHzEXYcJXwu88ENCUKyrAz1Wrom',
            category: 'sample',
            likes: 29,
            views: 89
        },
        {
            id: 'creative',
            title: 'Creative Work',
            description: 'Creative video projects showcasing storytelling abilities and innovative approaches to visual content. This collection demonstrates my ability to create engaging visual narratives through creative editing techniques.',
            duration: '0:18',
            date: 'July 2024',
            thumbnail: 'images/Creative_Work.jpg',
            videoId: '11FndmQwFpI9WNnrXZQPipBHBsOZC3GgZ',
            category: 'creative',
            likes: 31,
            views: 102
        }
    ];

    // DOM Elements
    const galleryGrid = document.getElementById('gallery-grid');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalVideoTitle = document.getElementById('modal-video-title');
    const modalVideoThumb = document.getElementById('modal-video-thumb');
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const modalDuration = document.getElementById('modal-duration');
    const modalDate = document.getElementById('modal-date');
    const modalDescription = document.getElementById('modal-description');
    const videoThumbnailModal = document.getElementById('videoThumbnailModal');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const playOverlayBtn = document.querySelector('.play-button');
    const previewPlayBtn = document.querySelector('.preview-play-btn');
    const previewThumbnail = document.querySelector('.preview-thumbnail');

    // Hero stats elements
    const reelStatsEl = document.getElementById('reelStats');
    const reelStatItems = document.querySelectorAll('.reel-stat');

    // Filter elements
    const filterTags = document.querySelectorAll('.filter-tag');
    const viewBtns = document.querySelectorAll('.view-btn');

    // State variables
    let currentVideo = null;
    let isPlaying = false;
    let currentFilter = 'all';
    let currentView = 'grid';
    let hasStatsAnimated = false;

    // Initialize
    initVideoGallery();
    initParticles();
    initEventListeners();
    initStatsAnimation();
    setFeaturedVideo();

    // Initialize video gallery
    function initVideoGallery() {
        galleryGrid.innerHTML = '';
        const filteredVideos = videoData.filter(video =>
            currentFilter === 'all' || video.category === currentFilter
        );

        filteredVideos.forEach(video => {
            const videoCard = createVideoCard(video);
            galleryGrid.appendChild(videoCard);
        });

        // Update view mode
        galleryGrid.className = `gallery-grid ${currentView}`;

        // Add AOS animation to cards
        document.querySelectorAll('.video-card').forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', `${index * 100}`);
        });

        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') AOS.refresh();

        // Newly-created cards carry the .liquid-glass class, so re-run the
        // cursor-follow refraction binder (defined in script.js) to pick
        // them up — it no-ops on panels it has already bound.
        if (typeof initContactLiquidGlass === 'function') {
            initContactLiquidGlass();
        }
    }

    // Create video card element
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card liquid-glass';
        card.dataset.id = video.id;
        card.dataset.category = video.category;

        card.innerHTML = `
            <div class="video-thumb">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <div class="video-overlay">
                    <div class="play-icon">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <span class="video-duration-badge"><i class="far fa-clock"></i> ${video.duration}</span>
            </div>
            <div class="video-info">
                <div class="video-meta">
                    <span class="video-category">${video.category.charAt(0).toUpperCase() + video.category.slice(1)}</span>
                    <span class="video-date">${video.date}</span>
                </div>
                <h3>${video.title}</h3>
                <p>${video.description.substring(0, 100)}...</p>
                <div class="video-description">${video.description}</div>
                <div class="video-actions">
                    <button class="action-btn watch-btn primary" data-id="${video.id}">
                        <i class="fas fa-play"></i>
                        Watch Now
                    </button>
                    <button class="action-btn details-btn" data-id="${video.id}">
                        <i class="fas fa-info-circle"></i>
                        Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Set featured video
    function setFeaturedVideo() {
        if (previewThumbnail && videoData[0]) {
            previewThumbnail.src = videoData[0].thumbnail;
            previewThumbnail.alt = videoData[0].title;
        }
    }

    // Parse an "M:SS" (or "H:MM:SS") duration string into whole seconds.
    function parseDurationToSeconds(duration) {
        return String(duration)
            .split(':')
            .map(n => parseInt(n, 10) || 0)
            .reduce((acc, n) => acc * 60 + n, 0);
    }

    // Initialize stats animation — fires once the hero stats row is in view.
    function initStatsAnimation() {
        if (!reelStatsEl) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasStatsAnimated) {
                    animateStats();
                    hasStatsAnimated = true;
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });
        observer.observe(reelStatsEl);
    }

    // Animate the hero stats with a count-up effect. Targets are computed
    // live from videoData — not hardcoded — so the numbers always match the
    // actual portfolio content (fixes the counters silently freezing at 0 /
    // never advancing, since the old hardcoded targets referenced a
    // .stat-number list that no longer matched the markup).
    function animateStats() {
        const totalSeconds = videoData.reduce((sum, v) => sum + parseDurationToSeconds(v.duration), 0);
        const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));
        const genreCount = new Set(videoData.map(v => v.category)).size;

        const stats = [
            { id: 'statVideos', target: videoData.length },
            { id: 'statMinutes', target: totalMinutes },
            { id: 'statGenres', target: genreCount }
        ];

        stats.forEach(stat => {
            const el = document.getElementById(stat.id);
            if (!el) return;
            const suffix = el.dataset.suffix || '';
            const duration = 1100;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * stat.target) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });

        // Stagger the stat chips into view.
        reelStatItems.forEach((item, index) => {
            setTimeout(() => item.classList.add('is-visible'), index * 130);
        });
    }

    // Initialize particles
    function initParticles() {
        const particlesContainer = document.getElementById('videoParticles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'video-particle';

            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${posX}%;
                top: ${posY}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            particlesContainer.appendChild(particle);
        }
    }

    // Initialize event listeners
    function initEventListeners() {
        // Filter tags
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                currentFilter = tag.dataset.filter;
                initVideoGallery();
            });
        });

        // View toggle
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentView = btn.dataset.view;
                galleryGrid.className = `gallery-grid ${currentView}`;
            });
        });

        // Video card clicks
        document.addEventListener('click', (e) => {
            // Watch button
            if (e.target.closest('.watch-btn')) {
                const videoId = e.target.closest('.watch-btn').dataset.id;
                openVideoPlayer(videoId);
            }

            // Details button
            if (e.target.closest('.details-btn')) {
                const videoId = e.target.closest('.details-btn').dataset.id;
                openVideoDetails(videoId);
            }

            // Video card click
            if (e.target.closest('.video-card') &&
                !e.target.closest('.action-btn') &&
                !e.target.closest('.video-actions')) {
                const videoId = e.target.closest('.video-card').dataset.id;
                openVideoPlayer(videoId);
            }

            // Play overlay click
            if (e.target.closest('.play-button') || e.target.closest('.play-overlay')) {
                playCurrentVideo();
            }

            // Preview play button
            if (e.target.closest('.preview-play-btn') || e.target.closest('.preview-container')) {
                openVideoPlayer('idol');
            }
        });

        // Modal close
        modalCloseBtn.addEventListener('click', closeVideoPlayer);

        // Play/Pause button
        playPauseBtn.addEventListener('click', togglePlayPause);

        // Fullscreen button
        fullscreenBtn.addEventListener('click', toggleFullscreen);

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeVideoPlayer();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoPlayerModal.classList.contains('active')) {
                closeVideoPlayer();
            }
        });

        // Handle fullscreen change
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    // Handle fullscreen change
    function handleFullscreenChange() {
        if (!document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Open video player
    function openVideoPlayer(videoId) {
        currentVideo = videoData.find(v => v.id === videoId);

        if (!currentVideo) return;

        // Update modal content
        modalVideoTitle.textContent = currentVideo.title;
        modalVideoThumb.src = currentVideo.thumbnail;
        modalVideoThumb.alt = currentVideo.title;
        modalDuration.innerHTML = `<i class="far fa-clock"></i> ${currentVideo.duration}`;
        modalDate.innerHTML = `<i class="far fa-calendar"></i> ${currentVideo.date}`;
        modalDescription.textContent = currentVideo.description;

        // Set video source
        modalVideoPlayer.src = `https://drive.google.com/file/d/${currentVideo.videoId}/preview`;

        // Show modal
        videoPlayerModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset player state
        isPlaying = false;
        videoThumbnailModal.classList.remove('hidden');
        modalVideoPlayer.style.display = 'none';
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';

        // Add animation
        videoPlayerModal.style.animation = 'none';
        setTimeout(() => {
            videoPlayerModal.style.animation = 'fadeIn 0.3s ease';
        }, 10);
    }

    // Open video details
    function openVideoDetails(videoId) {
        currentVideo = videoData.find(v => v.id === videoId);

        if (!currentVideo) return;

        // For now, just open the player
        openVideoPlayer(videoId);
    }

    // Close video player
    function closeVideoPlayer() {
        videoPlayerModal.classList.remove('active');
        document.body.style.overflow = '';

        // Pause video
        if (isPlaying) {
            modalVideoPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            isPlaying = false;
        }

        // Reset video source
        modalVideoPlayer.src = '';
    }

    // Play current video
    function playCurrentVideo() {
        if (!currentVideo) return;

        // Hide thumbnail and show player
        videoThumbnailModal.classList.add('hidden');
        modalVideoPlayer.style.display = 'block';

        // Play video
        modalVideoPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

        // Track view
        trackVideoView(currentVideo.id);
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (!currentVideo) return;

        if (isPlaying) {
            modalVideoPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            modalVideoPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

        isPlaying = !isPlaying;
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        const videoContainer = document.querySelector('.video-container');

        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Track video view
    function trackVideoView(videoId) {
        console.log(`Video ${videoId} viewed`);

        // Update local data for demo
        const video = videoData.find(v => v.id === videoId);
        if (video) {
            video.views++;
        }
    }

    // Add fade-in animation for the video player modal
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});
