// Simplified Video Player Functionality - Google Drive Only
document.addEventListener('DOMContentLoaded', function () {
    const videoIframe = document.getElementById('mainVideo');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const videoDuration = document.getElementById('video-duration');
    const videoDate = document.getElementById('video-date');

    // Video data with Google Drive IDs
    const videoData = {
        '1hjmDxuhcieJCkULx1iQcXwnnj7bMT9Rd': {
            title: 'Video Resume',
            description: 'A creative showcase of my skills, experiences, and personality, this resume has been thoughtfully crafted to highlight my strengths and aspirations as I apply for the Student Associate position at Daffodil International University.',
            date: 'September 2025',
            duration: '2:53'
        },
        '10G859vHzEXYcJXwu88ENCUKyrAz1Wrom': {
            title: 'Editing Sample',
            description: 'Demonstration of my simple video editing skills and techniques..',
            date: 'February 2024',
            duration: '1:50'
        },
        '11FndmQwFpI9WNnrXZQPipBHBsOZC3GgZ': {
            title: 'Creative Work',
            description: 'Creative video projects showcasing storytelling abilities..',
            date: 'July 2024',
            duration: '0:18'
        }
    };

    // Load Google Drive video
    function loadVideo(videoId) {
        const videoInfo = videoData[videoId];
        if (!videoInfo || !videoIframe) return;

        // Update iframe source
        videoIframe.src = `https://drive.google.com/file/d/${videoId}/preview`;

        // Update video info
        videoTitle.textContent = videoInfo.title;
        videoDescription.textContent = videoInfo.description;
        videoDate.textContent = videoInfo.date;
        videoDuration.textContent = videoInfo.duration;

        // Show success message
        showPopup(`Now playing: ${videoInfo.title}`, 'success');
    }

    // Simple popup function
    function showPopup(message, type) {
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
            padding: 12px 16px;
            border-radius: 6px;
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(33, 150, 243, 0.9)'};
            color: white;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            animation: slideIn 0.3s ease;
        `;

        // Add CSS for animation
        if (!document.querySelector('#popup-styles')) {
            const style = document.createElement('style');
            style.id = 'popup-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
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
        }, 3000);
    }

    // Thumbnail click events
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const videoId = this.getAttribute('data-video-id');
            loadVideo(videoId);
        });
    });

    // Load first video by default
    const firstThumbnail = document.querySelector('.video-thumbnail');
    if (firstThumbnail) {
        const firstVideoId = firstThumbnail.getAttribute('data-video-id');
        loadVideo(firstVideoId);
    }

    // Add click animation to thumbnails
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 150);
        });
    });
});
