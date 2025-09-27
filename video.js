// Video Player Functionality
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.querySelector('.play-pause');
    const progressBar = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeLevel = document.querySelector('.volume-level');
    const volumeContainer = document.querySelector('.volume-bar');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const videoPlayer = document.querySelector('.video-player');
    const videoControls = document.querySelector('.video-controls');
    const speedBtn = document.querySelector('.speed-btn');
    const speedDisplay = document.querySelector('.speed-display');
    const speedMenu = document.querySelector('.speed-menu');
    const speedOptions = document.querySelectorAll('.speed-option');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const videoDuration = document.getElementById('video-duration');
    const videoDate = document.getElementById('video-date');

    // Initialize video with 20% volume
    video.volume = 0.2;
    volumeLevel.style.width = '20%';
    updateVolumeIcon(0.2);

    // Video data with additional information and orientation
    const videoData = {
        'videos/(242-15-164)_ASIKUR_RAHMAN\'s_4k_Video_Resume.mp4': {
            title: 'Video Resume',
            description: 'A creative presentation of my skills, experience, and personality',
            date: 'September 2025',
            orientation: 'landscape' // landscape or vertical
        },
        'videos/(242-15-164)_ASIKUR_RAHMAN\'s_4k_Video_Resume.mp4': {
            title: 'Video Resume',
            description: 'A creative presentation of my skills, experience, and personality',
            date: 'September 2025',
            orientation: 'landscape'
        },
        'videos/project2.mp4': {
            title: 'Editing Sample',
            description: 'Demonstration of video editing skills and techniques',
            date: 'February 2025',
            orientation: 'landscape'
        },
        'videos/Creative_Work.mp4': {
            title: 'Creative Work',
            description: 'Creative video projects showcasing storytelling abilities',
            date: 'March 2025',
            orientation: 'landscape' // Example vertical video
        }
    };

    // Remove native controls completely
    video.removeAttribute('controls');

    // Format time in minutes:seconds
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Format duration in a more readable way (e.g., "2 minutes 30 seconds")
    function formatDuration(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return 'Unknown';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        if (mins === 0) {
            return `${secs} second${secs !== 1 ? 's' : ''}`;
        } else if (secs === 0) {
            return `${mins} minute${mins !== 1 ? 's' : ''}`;
        } else {
            return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
        }
    }

    // Update volume icon based on volume level
    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    // Detect video orientation and apply appropriate styling
    function detectVideoOrientation(videoElement, videoSrc) {
        // Remove existing orientation classes
        videoPlayer.classList.remove('vertical', 'landscape');

        // Check if we have orientation data for this video
        const videoInfo = videoData[videoSrc];
        if (videoInfo && videoInfo.orientation === 'vertical') {
            videoPlayer.classList.add('vertical');
            return 'vertical';
        }

        // Auto-detect orientation from video dimensions
        if (videoElement.videoWidth && videoElement.videoHeight) {
            const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
            if (aspectRatio < 1) {
                // Vertical video (height > width)
                videoPlayer.classList.add('vertical');
                return 'vertical';
            }
        }

        // Default to landscape
        videoPlayer.classList.add('landscape');
        return 'landscape';
    }

    // Detect thumbnail orientation and apply appropriate styling
    function detectThumbnailOrientation(thumbnail, imgSrc) {
        const img = new Image();
        img.src = thumbnail.querySelector('img').src;

        img.onload = function () {
            const aspectRatio = img.width / img.height;
            if (aspectRatio < 0.8) { // Threshold for vertical detection
                thumbnail.classList.add('vertical');
            } else {
                thumbnail.classList.add('landscape');
            }
        };
    }

    // Get video duration and update display
    function updateVideoDuration(videoElement, displayElement, thumbnailElement = null) {
        // Reset duration display while loading
        if (displayElement) {
            displayElement.textContent = 'Loading...';
        }

        // Check if duration is already available
        if (videoElement.duration && videoElement.duration !== Infinity) {
            if (displayElement) {
                displayElement.textContent = formatDuration(videoElement.duration);
            }
            if (thumbnailElement) {
                thumbnailElement.textContent = formatTime(videoElement.duration);
            }
            return;
        }

        // If duration is not available, try to load it
        videoElement.addEventListener('loadedmetadata', function () {
            if (videoElement.duration && videoElement.duration !== Infinity) {
                if (displayElement) {
                    displayElement.textContent = formatDuration(videoElement.duration);
                }
                if (thumbnailElement) {
                    thumbnailElement.textContent = formatTime(videoElement.duration);
                }
            }
        }, { once: true });

        // If metadata doesn't load properly, try to get duration on canplay event
        videoElement.addEventListener('canplay', function () {
            if (videoElement.duration && videoElement.duration !== Infinity) {
                if (displayElement) {
                    displayElement.textContent = formatDuration(videoElement.duration);
                }
                if (thumbnailElement) {
                    thumbnailElement.textContent = formatTime(videoElement.duration);
                }
            }
        }, { once: true });

        // Last resort: try after a delay
        setTimeout(() => {
            if (videoElement.duration && videoElement.duration !== Infinity) {
                if (displayElement) {
                    displayElement.textContent = formatDuration(videoElement.duration);
                }
                if (thumbnailElement) {
                    thumbnailElement.textContent = formatTime(videoElement.duration);
                }
            } else {
                if (displayElement) {
                    displayElement.textContent = 'Unknown';
                }
                if (thumbnailElement) {
                    thumbnailElement.textContent = 'Unknown';
                }
            }
        }, 2000);
    }

    // Preload thumbnails and get their durations
    function preloadThumbnailDurations() {
        const thumbnails = document.querySelectorAll('.video-thumbnail');

        thumbnails.forEach(thumbnail => {
            const videoSrc = thumbnail.getAttribute('data-video');
            const durationElement = thumbnail.querySelector('.thumbnail-duration');

            // Create a temporary video element to get the duration
            const tempVideo = document.createElement('video');
            tempVideo.src = videoSrc;

            // Detect and set thumbnail orientation
            detectThumbnailOrientation(thumbnail, thumbnail.querySelector('img').src);

            // Update the duration once it's available
            updateVideoDuration(tempVideo, null, durationElement);
        });
    }

    // Update video duration display
    function updateDuration() {
        durationEl.textContent = formatTime(video.duration);
        updateVideoDuration(video, videoDuration);
    }

    // Update video duration when metadata is loaded
    video.addEventListener('loadedmetadata', function () {
        updateDuration();
        // Detect orientation after metadata is loaded
        detectVideoOrientation(video, video.src);
    });

    // Also try to update duration when the video can play
    video.addEventListener('canplay', updateDuration);

    // Show/hide controls on mouse move
    let controlsTimeout;
    function showControls() {
        videoControls.classList.add('visible');
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (!video.paused) {
                videoControls.classList.remove('visible');
            }
        }, 3000);
    }

    videoPlayer.addEventListener('mousemove', showControls);
    videoPlayer.addEventListener('mouseenter', showControls);
    videoPlayer.addEventListener('mouseleave', () => {
        if (!video.paused) {
            controlsTimeout = setTimeout(() => {
                videoControls.classList.remove('visible');
            }, 1000);
        }
    });

    // Play/Pause functionality
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        showControls();
    }

    playPauseBtn.addEventListener('click', togglePlayPause);

    // Also play/pause when clicking on the video
    video.addEventListener('click', togglePlayPause);

    // Update progress bar
    video.addEventListener('timeupdate', function () {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(video.currentTime);
    });

    // Seek functionality
    progressContainer.addEventListener('click', function (e) {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
        showControls();
    });

    // Volume control - toggle mute/unmute
    volumeBtn.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event from bubbling to document
        if (video.volume > 0) {
            video.volume = 0;
            volumeLevel.style.width = '0%';
            updateVolumeIcon(0);
        } else {
            video.volume = 0.2; // Restore to 20% when unmuting
            volumeLevel.style.width = '20%';
            updateVolumeIcon(0.2);
        }
        showControls();
    });

    // Volume slider
    volumeContainer.addEventListener('click', function (e) {
        const rect = volumeContainer.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;

        // Ensure percentage is between 0 and 1
        percent = Math.max(0, Math.min(1, percent));

        video.volume = percent;
        volumeLevel.style.width = `${percent * 100}%`;
        updateVolumeIcon(percent);
        showControls();
    });

    // Make volume container always visible when hovering over volume controls
    volumeBtn.addEventListener('mouseenter', function () {
        volumeContainer.style.opacity = '1';
    });

    volumeContainer.addEventListener('mouseenter', function () {
        volumeContainer.style.opacity = '1';
    });

    volumeContainer.addEventListener('mouseleave', function () {
        volumeContainer.style.opacity = '0';
    });

    // Playback speed control
    speedBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        speedMenu.classList.toggle('active');
        showControls();
    });

    // Set playback speed
    speedOptions.forEach(option => {
        option.addEventListener('click', function () {
            const speed = parseFloat(this.getAttribute('data-speed'));
            video.playbackRate = speed;
            speedDisplay.textContent = `${speed}x`;

            // Update active state
            speedOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            // Close menu
            speedMenu.classList.remove('active');
            showControls();
        });
    });

    // Close speed menu when clicking elsewhere
    document.addEventListener('click', function () {
        speedMenu.classList.remove('active');
    });

    // Fullscreen functionality with orientation support
    fullscreenBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
        showControls();
    });

    // Handle fullscreen changes to maintain aspect ratio
    document.addEventListener('fullscreenchange', function () {
        if (document.fullscreenElement) {
            // In fullscreen, adjust based on orientation
            if (videoPlayer.classList.contains('vertical')) {
                videoPlayer.style.maxWidth = '100vh';
                videoPlayer.style.margin = '0 auto';
            }
        } else {
            // Exit fullscreen, reset styles
            videoPlayer.style.maxWidth = '';
            videoPlayer.style.margin = '';
        }
    });

    // Video thumbnail functionality
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const videoSrc = this.getAttribute('data-video');
            const posterSrc = this.getAttribute('data-poster'); // Get poster source
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const date = this.getAttribute('data-date');

            // Store current time to resume playback
            const currentTime = video.currentTime;
            const wasPlaying = !video.paused;

            // Add loading effect
            video.classList.add('loading');

            // Change video source AND poster
            video.src = videoSrc;
            video.poster = posterSrc; // Update the poster

            // Update video info
            videoTitle.textContent = title;
            videoDescription.textContent = description;
            videoDate.textContent = date;

            // Load and play the new video
            video.load();
            video.addEventListener('loadeddata', function () {
                video.classList.remove('loading');

                // Detect and apply orientation
                detectVideoOrientation(video, videoSrc);

                if (wasPlaying) {
                    video.play().catch(e => console.log('Auto-play prevented:', e));
                }
                // Reset playback speed to default when changing video
                video.playbackRate = 1.0;
                speedDisplay.textContent = '1.0x';
                speedOptions.forEach(opt => opt.classList.remove('active'));
                document.querySelector('.speed-option[data-speed="1.0"]').classList.add('active');

                // Update duration for the new video
                updateDuration();
            }, { once: true });

            showControls();
        });
    });

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
        if (document.activeElement.tagName === 'INPUT') return;

        switch (e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'f':
                e.preventDefault();
                if (!document.fullscreenElement) {
                    videoPlayer.requestFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                } else {
                    document.exitFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                }
                break;
            case 'm':
                e.preventDefault();
                if (video.volume > 0) {
                    video.volume = 0;
                    volumeLevel.style.width = '0%';
                    updateVolumeIcon(0);
                } else {
                    video.volume = 0.2;
                    volumeLevel.style.width = '20%';
                    updateVolumeIcon(0.2);
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime -= 5;
                showControls();
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime += 5;
                showControls();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const newVolumeUp = Math.min(video.volume + 0.1, 1);
                video.volume = newVolumeUp;
                volumeLevel.style.width = `${newVolumeUp * 100}%`;
                updateVolumeIcon(newVolumeUp);
                showControls();
                break;
            case 'ArrowDown':
                e.preventDefault();
                const newVolumeDown = Math.max(video.volume - 0.1, 0);
                video.volume = newVolumeDown;
                volumeLevel.style.width = `${newVolumeDown * 100}%`;
                updateVolumeIcon(newVolumeDown);
                showControls();
                break;
            case '>':
            case '.':
                e.preventDefault();
                // Increase playback speed
                const currentSpeed = video.playbackRate;
                const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
                const currentIndex = speeds.indexOf(currentSpeed);
                if (currentIndex < speeds.length - 1) {
                    video.playbackRate = speeds[currentIndex + 1];
                    speedDisplay.textContent = `${speeds[currentIndex + 1]}x`;
                    speedOptions.forEach(opt => opt.classList.remove('active'));
                    document.querySelector(`.speed-option[data-speed="${speeds[currentIndex + 1]}"]`).classList.add('active');
                }
                break;
            case '<':
            case ',':
                e.preventDefault();
                // Decrease playback speed
                const currentSpeed2 = video.playbackRate;
                const speeds2 = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
                const currentIndex2 = speeds2.indexOf(currentSpeed2);
                if (currentIndex2 > 0) {
                    video.playbackRate = speeds2[currentIndex2 - 1];
                    speedDisplay.textContent = `${speeds2[currentIndex2 - 1]}x`;
                    speedOptions.forEach(opt => opt.classList.remove('active'));
                    document.querySelector(`.speed-option[data-speed="${speeds2[currentIndex2 - 1]}"]`).classList.add('active');
                }
                break;
        }

        // Number keys 1-3 to select videos
        if (e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            if (thumbnails[index]) {
                thumbnails[index].click();
            }
        }
    });

    // Reset controls when video ends
    video.addEventListener('ended', function () {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        videoControls.classList.add('visible');
    });

    // Ensure smooth scrolling in light mode
    function ensureSmoothScrolling() {
        const html = document.documentElement;
        if (!html.style.scrollBehavior) {
            html.style.scrollBehavior = 'smooth';
        }
    }

    // Call on load and when theme changes
    ensureSmoothScrolling();
    document.querySelector('.theme-toggle').addEventListener('click', ensureSmoothScrolling);

    // Preload thumbnail durations when page loads
    window.addEventListener('load', function () {
        // Update duration for the main video
        updateDuration();

        // Detect initial video orientation
        detectVideoOrientation(video, video.src);

        // Preload durations for thumbnails
        preloadThumbnailDurations();
    });

    // Handle window resize for responsive behavior
    window.addEventListener('resize', function () {
        // Re-apply orientation detection on resize
        detectVideoOrientation(video, video.src);
    });
});