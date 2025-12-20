// Enhanced Video Player Functionality - Google Drive Only
document.addEventListener('DOMContentLoaded', function () {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const mainVideoThumb = document.getElementById('mainVideoThumb');
    const videoIframe = document.getElementById('mainVideo');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const videoDuration = document.getElementById('video-duration');
    const videoDate = document.getElementById('video-date');
    const galleryGrid = document.getElementById('gallery-grid');


    // Video data with Google Drive IDs
    const videoData = {
        '17DyGcv52ayyl1Zq5X-TG4W1kR9fnXx16': {
            title: 'My Idol: Hazrat Umar Ibn al-Khattab(RA)',
            description: 'A heartfelt tribute to my idol, Hazrat Umar Ibn al-Khattab (RA), this video reflects the values that inspire me—justice, integrity, courage, and unwavering leadership. Through this showcase, I share how his life and principles continue to shape my character, mindset, and aspirations both personally and professionally.',
            date: 'December 2025',
            duration: '3:34',
            thumbnail: 'images/Idol_Cover.jpg'
        },
        '19yeXo2GBwot6ybTTARJLGGRylH5qFUZf': {
            title: 'Environment & Sustainability in Bangladesh',
            description: 'A documentary exploring environmental challenges and sustainability efforts in Bangladesh. This project showcases my skills in video editing, voice over/narration, resource collection, script writing, and video shooting.',
            date: '28th November, 2025',
            duration: '7:26',
            thumbnail: 'images/Documentary Cover.jpg'
        },
        '10G859vHzEXYcJXwu88ENCUKyrAz1Wrom': {
            title: 'Editing Sample',
            description: 'Demonstration of my video editing skills and techniques, showcasing attention to detail and creative approach.',
            date: 'February 2024',
            duration: '1:50',
            thumbnail: 'images/Metro_Life.jpg'
        },
        '11FndmQwFpI9WNnrXZQPipBHBsOZC3GgZ': {
            title: 'Creative Work',
            description: 'Creative video projects showcasing storytelling abilities and innovative approaches to visual content.',
            date: 'July 2024',
            duration: '0:18',
            thumbnail: 'images/Creative_Work.jpg'
        }
    };

    // Track currently playing video
    let currentVideoId = '17DyGcv52ayyl1Zq5X-TG4W1kR9fnXx16';
    let isVideoPlaying = false;

    // Load Google Drive video
    function loadVideo(videoId, autoPlay = false) {
        const videoInfo = videoData[videoId];
        if (!videoInfo || !videoIframe) return;

        // Store the previous video ID to move it to gallery
        const previousVideoId = currentVideoId;
        currentVideoId = videoId;

        // Update video info
        videoTitle.textContent = videoInfo.title;
        videoDescription.textContent = videoInfo.description;
        videoDate.textContent = videoInfo.date;
        videoDuration.textContent = videoInfo.duration;

        // Update thumbnail
        mainVideoThumb.src = videoInfo.thumbnail;
        mainVideoThumb.alt = videoInfo.title;

        // Update iframe source (store in data-src, don't load yet)
        videoIframe.dataset.src = `https://drive.google.com/file/d/${videoId}/preview`;

        // Reset to thumbnail view
        resetToThumbnail();

        // Update gallery to reflect current state
        updateGallery();

        // Show success message
        if (autoPlay) {
            showPopup(`Now playing: ${videoInfo.title}`, 'success');
        } else {
            showPopup(`Loaded: ${videoInfo.title} - Click to play`, 'info');
        }
    }

    // Play video when thumbnail is clicked
    videoThumbnail.addEventListener('click', function () {
        playCurrentVideo();
    });

    // Play the current video
    function playCurrentVideo() {
        if (isVideoPlaying) return;

        const videoSrc = videoIframe.dataset.src;
        if (!videoSrc) return;

        // Hide thumbnail and show iframe
        videoThumbnail.style.display = 'none';
        videoIframe.style.display = 'block';

        // Set iframe source to trigger loading
        videoIframe.src = videoSrc;

        isVideoPlaying = true;

        // Update badge
        const badge = document.querySelector('.video-badge');
        if (badge) {
            badge.textContent = 'Now Playing';
            badge.style.background = 'linear-gradient(45deg, #FF5722, #FF9800)';
        }

        showPopup('Video is now playing', 'success');
    }

    // Reset to thumbnail view
    function resetToThumbnail() {
        videoThumbnail.style.display = 'flex';
        videoIframe.style.display = 'none';
        videoIframe.src = '';
        isVideoPlaying = false;

        // Update badge
        const badge = document.querySelector('.video-badge');
        if (badge) {
            badge.textContent = 'Ready to Play';
            badge.style.background = 'linear-gradient(45deg, #4CAF50, #2196F3)';
        }
    }

    // Update gallery based on current video
    function updateGallery() {
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        // Add all videos except the current one to the gallery
        for (const [videoId, videoInfo] of Object.entries(videoData)) {
            if (videoId === currentVideoId) continue;

            const thumbnailElement = createThumbnail(videoId, videoInfo);
            galleryGrid.appendChild(thumbnailElement);
        }
    }

    // Create thumbnail element
    function createThumbnail(videoId, videoInfo) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        thumbnail.setAttribute('data-video-id', videoId);

        thumbnail.innerHTML = `
            <div class="thumbnail-overlay">
                <i class="fas fa-play"></i>
                <h3>${videoInfo.title}</h3>
                <p class="thumbnail-duration">${videoInfo.duration}</p>
            </div>
            <img src="${videoInfo.thumbnail}" alt="${videoInfo.title}" loading="lazy">
        `;

        // Add click event
        thumbnail.addEventListener('click', function () {
            loadVideo(videoId, true);

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px)';
            }, 150);
        });

        return thumbnail;
    }

    // Enhanced popup function
    function showPopup(message, type) {
        // Remove existing popups
        const existingPopups = document.querySelectorAll('.video-popup');
        existingPopups.forEach(popup => popup.remove());

        const popup = document.createElement('div');
        popup.className = `video-popup ${type}`;
        popup.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;

        popup.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 14px 18px;
            border-radius: 10px;
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(33, 150, 243, 0.95)'};
            color: white;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1rem;
            animation: slideIn 0.3s ease;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            border-left: 4px solid ${type === 'success' ? '#45a049' : '#1e88e5'};
            font-weight: 500;
        `;

        // Add CSS for animation if not already present
        if (!document.querySelector('#popup-styles')) {
            const style = document.createElement('style');
            style.id = 'popup-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .video-popup { animation: slideIn 0.3s ease; }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(popup);

        setTimeout(() => {
            if (popup.parentNode) {
                popup.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => popup.remove(), 300);
            }
        }, 4000);
    }

    // Initialize
    loadVideo(currentVideoId);
    updateGallery();
});
