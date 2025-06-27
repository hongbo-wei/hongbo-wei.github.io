class JazzDancer {
    constructor() {
        this.dancer = document.querySelector('.dancer-svg');
        this.playBtn = document.getElementById('playBtn');
        this.danceBtn = document.getElementById('danceBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.container = document.querySelector('.dancer-container');
        this.musicBricks = document.getElementById('musicBricks');
        this.langSwitch = document.getElementById('langSwitch');
        this.currentLang = 'en';
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
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.toggleMusic());
        this.danceBtn.addEventListener('click', () => this.toggleDance());
        this.resetBtn.addEventListener('click', () => this.reset());
        
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
        
        // Add mouse interaction
        this.dancer.addEventListener('mouseenter', () => {
            if (!this.isDancing) {
                this.dancer.style.transform = 'scale(1.05)';
            }
        });
        
        this.dancer.addEventListener('mouseleave', () => {
            if (!this.isDancing) {
                this.dancer.style.transform = 'scale(1)';
            }
        });
        
        this.dancer.addEventListener('click', () => {
            this.performSpecialMove();
        });
    }
    
    toggleMusic() {
        this.isMusicPlaying = !this.isMusicPlaying;
        const t = this.translations[this.currentLang];
        if (this.isMusicPlaying) {
            this.playBtn.textContent = t.pause;
            this.playBtn.classList.add('active');
            this.startBrickEffect();
            this.showMessage(t.musicMsg);
        } else {
            this.playBtn.textContent = t.play;
            this.playBtn.classList.remove('active');
            this.stopBrickEffect();
            this.showMessage(t.musicPaused);
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
        } else {
            this.danceBtn.textContent = t.start;
            this.danceBtn.classList.remove('active');
            this.stopDance();
            this.showMessage(t.danceStopped);
        }
    }
    
    startDanceSequence() {
        const danceMoves = ['dancing', 'spinning', 'leaping'];
        let moveIndex = 0;
        
        this.currentAnimation = setInterval(() => {
            // Remove all dance classes first
            this.dancer.classList.remove('dancing', 'spinning', 'leaping');
            // Add the current dance move class
            this.dancer.classList.add(danceMoves[moveIndex]);
            moveIndex = (moveIndex + 1) % danceMoves.length;
        }, 3000);
    }
    
    stopDance() {
        if (this.currentAnimation) {
            clearInterval(this.currentAnimation);
            this.currentAnimation = null;
        }
        // Remove all dance classes
        this.dancer.classList.remove('dancing', 'spinning', 'leaping');
    }
    
    performSpecialMove() {
        const t = this.translations[this.currentLang];
        if (this.isDancing) {
            // Perform a special twirl animation for SVG
            this.dancer.style.animation = 'svgSpin 0.8s ease-in-out';
            setTimeout(() => {
                this.dancer.style.animation = '';
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
        this.danceBtn.textContent = t.start;
        this.danceBtn.classList.remove('active');
        this.stopDance();
        this.stopBrickEffect();
        this.showMessage(t.resetMsg);
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
        this.brickStartTime = performance.now();
        const animate = (now) => {
            const t = (now - this.brickStartTime) / 500; // speed factor
            this.bricks.forEach((brick, i) => {
                // Classic equalizer: sine wave with phase offset
                const phase = (i / this.brickCount) * Math.PI * 2;
                const height = 16 + Math.abs(Math.sin(t + phase)) * 32;
                brick.style.height = height + 'px';
                if (height > 35) {
                    brick.classList.add('active');
                } else {
                    brick.classList.remove('active');
                }
            });
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
        
        document.getElementById('mainTitle').textContent = t.title;
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
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JazzDancer();
    
    // Add some initial charm with entrance animation
    setTimeout(() => {
        const dancer = document.querySelector('.dancer-svg');
        if (dancer) {
            dancer.style.animation = 'svgEntrance 2s ease-in-out';
            setTimeout(() => {
                dancer.style.animation = '';
            }, 2000);
        }
    }, 1000);
}); 