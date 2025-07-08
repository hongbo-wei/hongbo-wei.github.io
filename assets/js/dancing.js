class JazzDancer {
    constructor() {
        this.playBtn = document.getElementById('playBtn');
        this.danceBtn = document.getElementById('danceBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.container = document.querySelector('.dancer-container');
        this.musicBricks = document.getElementById('musicBricks');
        this.langSwitch = document.getElementById('langSwitch');
        this.currentLang = 'en';
        
        // ASCII dancer elements
        this.asciiDisplay = document.getElementById('asciiDisplay');
        this.asciiFrames = [];
        this.asciiCurrentFrame = 0;
        this.asciiAnimationId = null;
        this.isAsciiDancing = false;
        
        // Vinyl player elements
        this.vinylPlayer = document.getElementById('vinylPlayer');
        this.vinylRecord = document.getElementById('vinylRecord');
        this.tonearm = document.getElementById('tonearm');
        this.playerPlayBtn = document.getElementById('playerPlayBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        
        // Initialize audio element with Web Audio API for visualization
        this.audio = new Audio('assets/music/Nick Cave & The Bad Seeds - O Children (Official Audio).mp3');
        this.audio.loop = true;
        this.audio.volume = 0.7;
        this.audio.crossOrigin = "anonymous";
        
        // Web Audio API setup for real-time analysis
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.translations = {
            en: {
                title: 'Jazz Dancer',
                subtitle: 'Alive in Motion',
                play: 'Play Music',
                pause: 'Pause Music',
                start: 'Start Dance',
                stop: 'Stop Dancing',
                reset: 'Reset',
                quote: '"Dance is the hidden language of the soul."',
                author: '- Martha Graham',
                footer: 'Created with love for the dancer who feels alive in motion',
                langBtn: '中文',
                musicMsg: '🎵 Music is playing... Feel the rhythm!',
                musicPaused: 'Music paused',
                danceMsg: '💃 Let the music move you!',
                danceStopped: 'Dance stopped',
                resetMsg: 'Reset complete',
                specialMove: '✨ Special move! ✨',
                quotes: [
                    'Dance is the hidden language of the soul.',
                    'To dance is to be out of yourself. Larger, more beautiful, more powerful.',
                    'Dance is the only art of which we ourselves are the stuff of which it is made.',
                    'Life is the dancer and you are the dance.',
                    'Dance first. Think later. It\'s the natural order.'
                ],
                authors: [
                    '- Martha Graham',
                    '- Agnes de Mille',
                    '- Ted Shawn',
                    '- Eckhart Tolle',
                    '- Samuel Beckett'
                ]
            },
            cn: {
                title: '爵士舞者',
                subtitle: '舞动中绽放生命',
                play: '播放音乐',
                pause: '暂停音乐',
                start: '开始舞蹈',
                stop: '停止舞蹈',
                reset: '重置',
                quote: '“舞蹈是灵魂的隐秘语言。”',
                author: '- 玛莎·格雷厄姆',
                footer: '为那个因舞蹈而感到活着的你倾情制作',
                langBtn: 'EN',
                musicMsg: '🎵 音乐响起... 感受节奏！',
                musicPaused: '音乐已暂停',
                danceMsg: '💃 让音乐带动你！',
                danceStopped: '舞蹈已停止',
                resetMsg: '已重置',
                specialMove: '✨ 特别动作！✨',
                quotes: [
                    '舞蹈是灵魂的隐秘语言。',
                    '跳舞就是超越自我，变得更美、更强大。',
                    '舞蹈是唯一我们自身就是其素材的艺术。',
                    '生命是舞者，你是舞蹈。',
                    '先跳舞，后思考。这是自然的秩序。'
                ],
                authors: [
                    '- 玛莎·格雷厄姆',
                    '- 阿格妮丝·德·米尔',
                    '- 泰德·肖恩',
                    '- 埃克哈特·托利',
                    '- 塞缪尔·贝克特'
                ]
            }
        };
        this.quoteIndex = 0;
        
        this.isDancing = false;
        this.isMusicPlaying = false;
        this.currentAnimation = null;
        this.particleInterval = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createParticles();
        this.initBricks();
        this.initLangSwitch();
        this.cycleQuotes();
        this.setupAudioAnalysis();
        this.initVinylPlayer();
        this.loadAsciiFrames();
    }
    
    setupAudioAnalysis() {
        // Initialize Web Audio API when user first interacts
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 64; // Small FFT size for 32 frequency bins
                this.analyser.smoothingTimeConstant = 0.8;
                
                this.source = this.audioContext.createMediaElementSource(this.audio);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            }
        }, { once: true });
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.toggleMusic());
        this.danceBtn.addEventListener('click', () => this.toggleDance());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Vinyl player events
        this.playerPlayBtn.addEventListener('click', () => this.toggleMusic());
        this.progressBar.addEventListener('click', (e) => this.seekAudio(e));
        
        // Audio events for progress tracking
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.toggleDance();
                    break;
                case 'm':
                    this.toggleMusic();
                    break;
                case 'r':
                    this.reset();
                    break;
            }
        });
        
        // Add mouse interaction for ASCII dancer
        this.asciiDisplay.addEventListener('click', () => {
            this.performSpecialMove();
        });
    }
    
    toggleMusic() {
        this.isMusicPlaying = !this.isMusicPlaying;
        const t = this.translations[this.currentLang];
        if (this.isMusicPlaying) {
            this.playBtn.textContent = t.pause;
            this.playBtn.classList.add('active');
            this.playerPlayBtn.textContent = '⏸';
            this.startBrickEffect();
            this.showVinylPlayer();
            this.showMusicVisualization();
            this.startVinylAnimation();
            this.showMessage(t.musicMsg);
            // Play the audio
            this.audio.play().catch(e => {
                console.log('Audio play failed:', e);
                this.showMessage('Click to enable audio');
            });
        } else {
            this.playBtn.textContent = t.play;
            this.playBtn.classList.remove('active');
            this.playerPlayBtn.textContent = '▶';
            this.stopBrickEffect();
            this.stopVinylAnimation();
            this.hideMusicVisualization();
            this.showMessage(t.musicPaused);
            // Pause the audio
            this.audio.pause();
        }
    }
    
    toggleDance() {
        this.isDancing = !this.isDancing;
        const t = this.translations[this.currentLang];
        if (this.isDancing) {
            this.danceBtn.textContent = t.stop;
            this.danceBtn.classList.add('active');
            this.startDanceSequence();
            this.showMessage(t.danceMsg);
            this.startAsciiDance();
        } else {
            this.danceBtn.textContent = t.start;
            this.danceBtn.classList.remove('active');
            this.stopDance();
            this.showMessage(t.danceStopped);
            this.stopAsciiDance();
        }
    }
    
    startDanceSequence() {
        // For ASCII dancer, the animation is handled in startAsciiDance
        // This method is kept for compatibility but doesn't need to do anything
    }
    
    stopDance() {
        if (this.currentAnimation) {
            clearInterval(this.currentAnimation);
            this.currentAnimation = null;
        }
    }
    
    performSpecialMove() {
        const t = this.translations[this.currentLang];
        if (this.isDancing) {
            // Create special effect for ASCII dancer
            this.asciiDisplay.style.animation = 'ascii-special-glow 0.8s ease-in-out';
            setTimeout(() => {
                this.asciiDisplay.style.animation = '';
            }, 800);
            
            this.createSpecialParticles();
            this.showMessage(t.specialMove);
        }
    }
    
    reset() {
        this.isDancing = false;
        this.isMusicPlaying = false;
        const t = this.translations[this.currentLang];
        this.playBtn.textContent = t.play;
        this.playBtn.classList.remove('active');
        this.playerPlayBtn.textContent = '▶';
        this.danceBtn.textContent = t.start;
        this.danceBtn.classList.remove('active');
        this.stopDance();
        this.stopAsciiDance();
        this.stopBrickEffect();
        this.stopVinylAnimation();
        this.hideVinylPlayer();
        this.hideMusicVisualization();
        this.showMessage(t.resetMsg);
        // Stop and reset audio
        this.audio.pause();
        this.audio.currentTime = 0;
        this.progressFill.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
    }
    
    createParticles() {
        // Create initial ambient particles
        setInterval(() => {
            if (this.isMusicPlaying) {
                this.createParticle();
            }
        }, 2000);
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * this.container.offsetWidth;
        const y = this.container.offsetHeight;
        
        particle.style.left = x + 'px';
        particle.style.bottom = '0px';
        
        this.container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }
    
    createSpecialParticles() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 100);
        }
    }
    
    startBrickEffect() {
        if (this.brickRAF) return;
        
        const animate = () => {
            if (!this.isMusicPlaying) return;
            
            if (this.analyser && this.dataArray) {
                // Get real audio frequency data
                this.analyser.getByteFrequencyData(this.dataArray);
                
                // Map frequency data to bricks
                const step = Math.floor(this.dataArray.length / this.brickCount);
                this.bricks.forEach((brick, i) => {
                    const dataIndex = Math.min(i * step, this.dataArray.length - 1);
                    const amplitude = this.dataArray[dataIndex];
                    
                    // Convert amplitude (0-255) to height (16-48px)
                    const height = 16 + (amplitude / 255) * 32;
                    brick.style.height = height + 'px';
                    
                    // Add active class for higher amplitudes
                    if (amplitude > 100) {
                        brick.classList.add('active');
                        // Add extra glow for very high amplitudes
                        if (amplitude > 180) {
                            brick.style.boxShadow = '0 0 8px #ff4081';
                        } else {
                            brick.style.boxShadow = 'none';
                        }
                    } else {
                        brick.classList.remove('active');
                        brick.style.boxShadow = 'none';
                    }
                });
            } else {
                // Fallback to sine wave animation if audio analysis isn't available
                const t = performance.now() / 500;
                this.bricks.forEach((brick, i) => {
                    const phase = (i / this.brickCount) * Math.PI * 2;
                    const height = 16 + Math.abs(Math.sin(t + phase)) * 32;
                    brick.style.height = height + 'px';
                    if (height > 35) {
                        brick.classList.add('active');
                    } else {
                        brick.classList.remove('active');
                    }
                });
            }
            
            this.brickRAF = requestAnimationFrame(animate);
        };
        
        this.brickRAF = requestAnimationFrame(animate);
    }
    
    stopBrickEffect() {
        if (this.brickRAF) {
            cancelAnimationFrame(this.brickRAF);
            this.brickRAF = null;
        }
        this.bricks.forEach(brick => {
            brick.classList.remove('active');
            brick.style.height = '16px';
            brick.style.boxShadow = 'none';
        });
    }
    
    initBricks() {
        this.brickCount = 12;
        this.musicBricks.innerHTML = '';
        this.bricks = [];
        for (let i = 0; i < this.brickCount; i++) {
            const brick = document.createElement('div');
            brick.className = 'brick';
            this.musicBricks.appendChild(brick);
            this.bricks.push(brick);
        }
    }
    
    initLangSwitch() {
        this.langSwitch.addEventListener('click', () => {
            this.currentLang = this.currentLang === 'en' ? 'cn' : 'en';
            this.applyLanguage();
        });
        this.applyLanguage();
    }
    
    applyLanguage() {
        const t = this.translations[this.currentLang];
        
        // Reset quote index when language changes to avoid array bounds issues
        this.quoteIndex = 0;
        
        document.querySelector('#mainTitle .title-text').textContent = t.title;
        document.getElementById('mainSubtitle').textContent = t.subtitle;
        document.getElementById('playBtn').textContent = this.isMusicPlaying ? t.pause : t.play;
        document.getElementById('danceBtn').textContent = this.isDancing ? t.stop : t.start;
        document.getElementById('resetBtn').textContent = t.reset;
        document.getElementById('langSwitch').textContent = t.langBtn;
        document.querySelector('.quote').textContent = t.quotes[this.quoteIndex];
        document.querySelector('.quote-author').textContent = t.authors[this.quoteIndex];
        document.querySelector('.footer p').textContent = t.footer;
    }
    
    cycleQuotes() {
        setInterval(() => {
            this.quoteIndex = (this.quoteIndex + 1) % this.translations[this.currentLang].quotes.length;
            document.querySelector('.quote').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.quote').textContent = this.translations[this.currentLang].quotes[this.quoteIndex];
                document.querySelector('.quote-author').textContent = this.translations[this.currentLang].authors[this.quoteIndex];
                document.querySelector('.quote').style.opacity = '1';
            }, 500);
        }, 8000);
    }
    
    showMessage(text) {
        // Create a temporary message element
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a1a;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        // Fade in
        setTimeout(() => {
            message.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 2000);
    }
    
    // Vinyl Player Methods
    initVinylPlayer() {
        this.vinylPlayer.style.display = 'block';
    }
    
    showVinylPlayer() {
        this.vinylPlayer.classList.add('active');
    }
    
    hideVinylPlayer() {
        this.vinylPlayer.classList.remove('active');
    }
    
    showMusicVisualization() {
        const musicVisualization = document.querySelector('.music-visualization');
        if (musicVisualization) {
            musicVisualization.classList.add('active');
        }
    }
    
    hideMusicVisualization() {
        const musicVisualization = document.querySelector('.music-visualization');
        if (musicVisualization) {
            musicVisualization.classList.remove('active');
        }
    }
    
    startVinylAnimation() {
        this.vinylRecord.classList.add('spinning');
        this.tonearm.classList.add('playing');
    }
    
    stopVinylAnimation() {
        this.vinylRecord.classList.remove('spinning');
        this.tonearm.classList.remove('playing');
    }
    
    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressFill.style.width = progress + '%';
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateDuration() {
        this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    }
    
    seekAudio(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = pos * this.audio.duration;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // ASCII Dance Methods
    async loadAsciiFrames() {
        // Load ASCII frames from the dancing_ascii directory
        this.asciiFrames = [];
        
        // Show large, visible loading message
        this.showLoadingMessage("Loading ASCII dancer... 🎭");
        
        // Add immediate fallback frames for mobile devices
        const fallbackFrames = this.getFallbackFrames();
        
        try {
            // Load all 600 frames for both mobile and desktop
            const maxFrames = 600; // Same for all devices
            const batchSize = 10; // Same batch size for all devices
            
            console.log(`Loading ${maxFrames} frames for all devices`);
            
            // Load frames in batches
            for (let batch = 0; batch < Math.ceil(maxFrames / batchSize); batch++) {
                const promises = [];
                const start = batch * batchSize + 1;
                const end = Math.min(start + batchSize - 1, maxFrames);
                
                for (let i = start; i <= end; i++) {
                    const frameNumber = i.toString().padStart(4, '0');
                    promises.push(
                        fetch(`assets/img/dancing/dancing_ascii/dancing_${frameNumber}.txt`, {
                            cache: 'force-cache' // Use cache for all devices
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.text().then(content => ({ index: i - 1, content }));
                            }
                            throw new Error(`HTTP ${response.status}`);
                        })
                        .catch(error => {
                            console.warn(`Frame ${frameNumber} failed:`, error.message);
                            return null;
                        })
                    );
                }
                
                const results = await Promise.allSettled(promises);
                const loadedFrames = results
                    .filter(result => result.status === 'fulfilled' && result.value)
                    .map(result => result.value);
                
                // Add loaded frames in order
                loadedFrames.forEach(frame => {
                    this.asciiFrames[frame.index] = frame.content;
                });
                
                // Show progress for all devices with large, visible text
                if (this.asciiFrames.length > 0) {
                    this.showLoadingMessage(`Loading... ${this.asciiFrames.length}/${maxFrames} frames`);
                }
                
                // Small delay between batches for all devices
                if (batch < Math.ceil(maxFrames / batchSize) - 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            
            // Filter out undefined entries and ensure we have frames
            this.asciiFrames = this.asciiFrames.filter(frame => frame);
            
            console.log(`Successfully loaded ${this.asciiFrames.length} ASCII frames`);
            
            // If we couldn't load enough frames, use fallback
            if (this.asciiFrames.length < 10) {
                console.warn('Too few frames loaded, using fallback animation');
                this.asciiFrames = fallbackFrames;
            }
            
            // Show first frame as preview
            if (this.asciiFrames.length > 0) {
                this.clearLoadingMessage();
                this.asciiDisplay.textContent = this.asciiFrames[0];
            }
        } catch (error) {
            console.error('Error loading ASCII frames:', error);
            // Use fallback frames
            this.asciiFrames = fallbackFrames;
            this.clearLoadingMessage();
            this.asciiDisplay.textContent = this.asciiFrames[0];
        }
    }
    
    showLoadingMessage(text) {
        // Clear any existing content
        this.asciiDisplay.textContent = '';
        
        // Create a large, visible loading message
        this.asciiDisplay.style.fontSize = '18px';
        this.asciiDisplay.style.lineHeight = '1.4';
        this.asciiDisplay.style.color = '#ff4081';
        this.asciiDisplay.style.textShadow = '0 0 10px rgba(255, 64, 129, 0.8)';
        this.asciiDisplay.style.fontWeight = 'bold';
        this.asciiDisplay.textContent = text;
    }
    
    clearLoadingMessage() {
        // Reset to normal ASCII display styles - adjusted for better proportions
        this.asciiDisplay.style.fontSize = '7px'; // Adjusted for better width/height ratio
        this.asciiDisplay.style.lineHeight = '1.0'; // Increased for better spacing
        this.asciiDisplay.style.color = '#ff4081';
        this.asciiDisplay.style.textShadow = '0 0 5px rgba(255, 64, 129, 0.5)';
        this.asciiDisplay.style.fontWeight = 'normal';
    }

    getFallbackFrames() {
        // Embedded ASCII frames that work immediately without network requests
        return [
            this.getStaticDancer(),
            `
    ✨ JAZZ DANCER ✨
    
        👤
       /|\\    🎵
       / \\
    
    ~ Step Right ~
            `,
            `
    ✨ JAZZ DANCER ✨
    
        👤
       \\|/    🎶
        |
       / \\
    
    ~ Arms Up ~
            `,
            `
    ✨ JAZZ DANCER ✨
    
        👤
        |\\    🎵
        |
        >\\
    
    ~ Kick Left ~
            `,
            `
    ✨ JAZZ DANCER ✨
    
        👤
       /|     🎶
        |
       /<
    
    ~ Kick Right ~
            `,
            `
    ✨ JAZZ DANCER ✨
    
        👤
       /|\\    🎵
       / \\
    
    ~ Jazz Hands ~
            `,
            `
    ✨ JAZZ DANCER ✨
    
        👤
        |⚡   🎶
        |
       / \\
    
    ~ Spin Move ~
            `,
            `
    ✨ JAZZ DANCER ✨
    
       \\👤/   
        |     🎵
       / \\
    
    ~ Big Finish ~
            `
        ];
    }
    
    getStaticDancer() {
        return `
    ✨ JAZZ DANCER ✨
    
        👤
       /|\\    🎵
       / \\
    
    Ready to Dance!
    
    🎶 Click 'Start Dancing' 🎶
        `;
    }
    
    startAsciiDance() {
        if (this.asciiFrames.length === 0) {
            console.warn('No ASCII frames loaded, using fallback');
            this.asciiFrames = this.getFallbackFrames();
            this.asciiDisplay.textContent = this.asciiFrames[0];
        }
        
        // Clear any loading message and reset to normal display
        this.clearLoadingMessage();
        
        this.isAsciiDancing = true;
        this.asciiDisplay.classList.add('dancing');
        
        // Same animation speed for all devices
        const frameDelay = this.isMusicPlaying ? 20 : 30; // Fast when music plays, medium when no music
        
        console.log(`Starting ASCII dance with ${this.asciiFrames.length} frames, delay: ${frameDelay}ms`);
        
        this.asciiAnimationId = setInterval(() => {
            if (this.asciiCurrentFrame < this.asciiFrames.length) {
                this.asciiDisplay.textContent = this.asciiFrames[this.asciiCurrentFrame];
                this.asciiCurrentFrame = (this.asciiCurrentFrame + 1) % this.asciiFrames.length;
            }
        }, frameDelay);
    }
    
    stopAsciiDance() {
        this.isAsciiDancing = false;
        this.asciiDisplay.classList.remove('dancing');
        
        if (this.asciiAnimationId) {
            clearInterval(this.asciiAnimationId);
            this.asciiAnimationId = null;
        }
        
        // Reset to first frame
        this.asciiCurrentFrame = 0;
        if (this.asciiFrames.length > 0) {
            this.asciiDisplay.textContent = this.asciiFrames[0];
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JazzDancer();
    
    // Add some initial charm with entrance animation for ASCII display
    setTimeout(() => {
        const asciiDisplay = document.getElementById('asciiDisplay');
        if (asciiDisplay) {
            asciiDisplay.style.animation = 'ascii-entrance 2s ease-in-out';
            setTimeout(() => {
                asciiDisplay.style.animation = '';
            }, 2000);
        }
    }, 1000);
});