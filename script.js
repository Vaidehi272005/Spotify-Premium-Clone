document.addEventListener('DOMContentLoaded', function() {
    // Music player functionality
    const songs = [
        {
            id: 1,
            title: "Blinding Lights",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
            duration: "3:20",
            liked: false
        },
        {
            id: 2,
            title: "Save Your Tears",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://i.scdn.co/image/ab67616d00001e029ad3e9959f48d513886b8933",
            duration: "3:35",
            liked: false
        },
        {
            id: 3,
            title: "Levitating",
            artist: "Dua Lipa",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://i.scdn.co/image/ab67616d00001e02c7b9f7e5c04b7b0a1a2e1e9e",
            duration: "3:23",
            liked: false
        },
        {
            id: 4,
            title: "Stay",
            artist: "The Kid LAROI, Justin Bieber",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "https://i.scdn.co/image/ab67616d00001e02a3c4dfe506ff3f0e9f7a0e7a",
            duration: "2:21",
            liked: false
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    const audio = new Audio();

    // Player elements
    const playPauseBtn = document.getElementById('play-pause');
    const prevSongBtn = document.getElementById('prev-song');
    const nextSongBtn = document.getElementById('next-song');
    const progressBar = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    const currentSongImg = document.getElementById('current-song-img');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const likeBtn = document.getElementById('like-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    // Song cards and playlist links
    const songCards = document.querySelectorAll('.song-card');
    const playlistCards = document.querySelectorAll('.playlist-card');
    const playlistLinks = document.querySelectorAll('.playlist-link');
    const songLinks = document.querySelectorAll('.song-link');
    const artistLinks = document.querySelectorAll('.artist-link');

    // Modal elements
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    // Load song
    function loadSong(index) {
        const song = songs[index];
        audio.src = song.src;
        currentSongImg.src = song.cover;
        currentSongTitle.textContent = song.title;
        currentSongArtist.textContent = song.artist;
        durationDisplay.textContent = song.duration;
        
        // Update like button
        likeBtn.className = song.liked ? 'fas fa-heart' : 'far fa-heart';
        likeBtn.style.color = song.liked ? '#1DB954' : '';
        
        if (isPlaying) {
            audio.play();
        }
    }

    // Play/pause song
    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.classList.replace('fa-pause-circle', 'fa-play-circle');
        } else {
            audio.play();
            playPauseBtn.classList.replace('fa-play-circle', 'fa-pause-circle');
        }
        isPlaying = !isPlaying;
    }

    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update current time display
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    // Set progress when clicked on progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Change volume
    function setVolume() {
        audio.volume = this.value / 100;
        
        // Update volume icon
        if (this.value == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (this.value < 50) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
    }

    // Next song
    function nextSong() {
        if (isShuffled) {
            currentSongIndex = Math.floor(Math.random() * songs.length);
        } else {
            currentSongIndex++;
            if (currentSongIndex > songs.length - 1) {
                currentSongIndex = 0;
            }
        }
        loadSong(currentSongIndex);
    }

    // Song ended
    function songEnded() {
        if (isRepeated) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextSong();
        }
    }

    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.style.color = isShuffled ? '#1DB954' : '';
    }

    // Toggle repeat
    function toggleRepeat() {
        isRepeated = !isRepeated;
        repeatBtn.style.color = isRepeated ? '#1DB954' : '';
    }

    // Toggle like
    function toggleLike() {
        songs[currentSongIndex].liked = !songs[currentSongIndex].liked;
        likeBtn.className = songs[currentSongIndex].liked ? 'fas fa-heart' : 'far fa-heart';
        likeBtn.style.color = songs[currentSongIndex].liked ? '#1DB954' : '';
    }

    // Play song from card
    function playSongFromCard(e) {
        e.preventDefault();
        const songId = parseInt(this.getAttribute('data-song'));
        const songIndex = songs.findIndex(song => song.id === songId);
        
        if (songIndex !== -1) {
            currentSongIndex = songIndex;
            loadSong(currentSongIndex);
            if (!isPlaying) {
                togglePlayPause();
            }
        }
    }

    // Navigate to playlist
    function navigateToPlaylist(e) {
        e.preventDefault();
        const playlistId = this.getAttribute('data-id');
        alert(`Navigating to playlist ${playlistId} - would load playlist in a real app`);
    }

    // Navigate to artist
    function navigateToArtist(e) {
        e.preventDefault();
        const artistName = this.textContent;
        alert(`Navigating to artist ${artistName} - would load artist page in a real app`);
    }

    // Modal functions
    function openLoginModal() {
        loginModal.style.display = 'flex';
    }

    function openSignupModal() {
        signupModal.style.display = 'flex';
    }

    function closeModal() {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    }

    function switchToSignupModal(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    }

    function switchToLoginModal(e) {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'flex';
    }

    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevSongBtn.addEventListener('click', prevSong);
    nextSongBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', songEnded);
    document.querySelector('.progress-bar').addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    likeBtn.addEventListener('click', toggleLike);
    
    // Song and playlist links
    songLinks.forEach(link => {
        link.addEventListener('click', playSongFromCard);
    });
    
    playlistLinks.forEach(link => {
        link.addEventListener('click', navigateToPlaylist);
    });
    
    artistLinks.forEach(link => {
        link.addEventListener('click', navigateToArtist);
    });

    // Card click events (play on click)
    songCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only play if click wasn't on a link
            if (!e.target.closest('a')) {
                const songId = parseInt(this.getAttribute('data-song'));
                const songIndex = songs.findIndex(song => song.id === songId);
                
                if (songIndex !== -1) {
                    currentSongIndex = songIndex;
                    loadSong(currentSongIndex);
                    if (!isPlaying) {
                        togglePlayPause();
                    }
                }
            }
        });
    });

    playlistCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only navigate if click wasn't on a link
            if (!e.target.closest('a')) {
                const playlistId = this.getAttribute('data-id');
                alert(`Navigating to playlist ${playlistId} - would load playlist in a real app`);
            }
        });
    });

    // Modal event listeners
    loginBtn.addEventListener('click', openLoginModal);
    signupBtn.addEventListener('click', openSignupModal);
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    switchToSignup.addEventListener('click', switchToSignupModal);
    switchToLogin.addEventListener('click', switchToLoginModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal();
        }
        if (e.target === signupModal) {
            closeModal();
        }
    });

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login functionality would be implemented here');
        closeModal();
    });

    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Signup functionality would be implemented here');
        closeModal();
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        // In a real app, this would filter songs/playlists
        console.log(`Searching for: ${searchTerm}`);
    });

    // Initialize with first song
    loadSong(currentSongIndex);
});