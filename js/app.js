/* ============================================
   BIRTHDAY GIFT - MAIN APPLICATION
   ============================================ */

(function () {
    'use strict';

    // ---- STATE ----
    const appState = {
        currentScene: 'opening',
        selectedWish: null,
        candleLit: false,
        candleBlown: false,
        musicPlaying: false,
        galleryIndex: 0,
        transitionTo: (name) => BD.Scenes.transitionTo(name),
        playSound: (name) => playSound(name),
        fadeMusic: (target, dur) => fadeMusic(target, dur),
        pauseMusic: () => pauseMusic(),
        resumeMusic: () => resumeMusic()
    };

    // Restore wish from localStorage
    try {
        const saved = localStorage.getItem('selectedWish');
        if (saved) appState.selectedWish = saved;
    } catch (err) {
        // localStorage unavailable
    }

    // ---- DOM ----
    const $ = (sel) => document.querySelector(sel);
    const els = {
        btnMulai: $('#btn-mulai'),
        btnNyalakan: $('#btn-nyalakan'),
        btnDarkNext: $('#btn-dark-next'),
        btnWishNext: $('#btn-wish-next'),
        btnGalleryNext: $('#btn-gallery-next'),
        btnLetterNext: $('#btn-letter-next'),
        btnCardNext: $('#btn-card-next'),
        btnFlowerNext: $('#btn-flower-next'),
        btnOpenGift: $('#btn-open-gift'),
        btnRestart: $('#btn-restart'),
        btnMusicToggle: $('#btn-music-toggle'),
        btnMusic: $('#btn-music'),
        musicController: $('#music-controller'),
        headerBar: $('#header-bar'),
        headerTitle: $('#header-title'),
        btnClose: $('#btn-close'),
        exitModal: $('#exit-modal'),
        btnStay: $('#btn-stay'),
        btnLeave: $('#btn-leave'),
        audio: $('#bg-music'),
        sceneOpening: $('#scene-opening'),
        darkLines: $('#dark-message-lines'),
        giftBox: $('#gift-box'),
        giftBoxArea: $('#gift-box-area'),
        finalIntro: $('#final-intro'),
        finalReveal: $('#final-reveal'),
        finalBigTitle: $('#final-big-title'),
        finalMessageText: $('#final-message-text'),
        finalThanks: $('#final-thanks-text'),
        bouquet: $('#bouquet'),
        bouquetArea: $('#bouquet-area'),
        bouquetHint: $('#bouquet-hint'),
        flowerCard: $('#flower-card'),
        flowerCardTitle: $('#flower-card-title'),
        flowerCardSubtitle: $('#flower-card-subtitle'),
        flowerCardDesc: $('#flower-card-desc'),
        flowerList: $('#flower-list'),
        cardLabel: $('#card-label'),
        cardTitle: $('#card-title'),
        cardFrom: $('#card-from'),
        cardWishPrefix: $('#card-wish-prefix'),
        cardWishHighlight: $('#card-wish-highlight'),
        cardWishSuffix: $('#card-wish-suffix')
    };

    // Header per-scene labels
    const sceneTitles = {
        'scene-candle': 'Tiup Lilinnya',
        'scene-dark-message': '',
        'scene-wish': 'Pilih Wish',
        'scene-gallery': 'Kenangan',
        'scene-letter': 'Surat',
        'scene-card': 'Kartu',
        'scene-flower': 'Bunga',
        'scene-final': ''
    };

    // ---- AUDIO ----
    function playSound(name) {
        // Simple WebAudio fallback sounds if no files
        try {
            const ctx = BD.AudioCtx || (window.AudioContext || window.webkitAudioContext);
            if (!ctx) return;
        } catch (e) {
            return;
        }
    }

    function startMusic() {
        if (els.audio && !appState.musicPlaying) {
            els.audio.volume = 0;
            const p = els.audio.play();
            if (p !== undefined) {
                p.then(() => {
                    appState.musicPlaying = true;
                    fadeMusic(0.4, 2000);
                    updateMusicUI(true);
                }).catch(() => {
                    // Autoplay blocked or file missing
                    appState.musicPlaying = false;
                });
            }
        }
    }

    function fadeMusic(target, duration) {
        if (!els.audio) return;
        const start = els.audio.volume;
        const diff = target - start;
        const steps = 20;
        const stepTime = duration / steps;
        let step = 0;
        clearInterval(els.audio._fadeInterval);
        els.audio._fadeInterval = setInterval(() => {
            step++;
            els.audio.volume = Math.max(0, Math.min(1, start + (diff * step / steps)));
            if (step >= steps) clearInterval(els.audio._fadeInterval);
        }, stepTime);
    }

    function pauseMusic() {
        if (els.audio && appState.musicPlaying) {
            els.audio.pause();
        }
    }

    function resumeMusic() {
        if (els.audio && appState.musicPlaying) {
            const p = els.audio.play();
            if (p) p.catch(() => {});
        }
    }

    function updateMusicUI(playing) {
        if (els.musicController) {
            els.musicController.classList.remove('muted');
            els.musicController.classList.add('music-visible');
        }
    }

    // ---- SCENE CONTENT BUILDERS ----

    function buildOpening() {
        const c = BD.CONTENT.opening;
        $('#opening-line-1').textContent = c.lines[0];
        $('#opening-line-2').textContent = c.lines[1];
        $('#opening-line-3').textContent = c.followUp;
        $('#btn-mulai').textContent = c.buttonText;

        // Sequence: line1, line2, followUp, then button
        setTimeout(() => {
            $('#opening-line-1').style.animation = 'fadeInUp 1.6s var(--ease-elegant) forwards';
        }, 300);
        setTimeout(() => {
            $('#opening-line-2').style.animation = 'fadeInUp 1.6s var(--ease-elegant) forwards';
        }, 1800);
        setTimeout(() => {
            const l3 = $('#opening-line-3');
            l3.style.display = 'block';
            l3.style.animation = 'fadeInUp 1.6s var(--ease-elegant) forwards';
        }, 3400);
        setTimeout(() => {
            els.btnMulai.style.opacity = '1';
            els.btnMulai.style.pointerEvents = 'auto';
            els.btnMulai.style.animation = 'fadeInUp 1s var(--ease-elegant) forwards';
        }, 4800);
    }

    function buildDarkMessage() {
        const lines = BD.CONTENT.darkMessage.lines;
        els.darkLines.innerHTML = '';
        els.btnDarkNext.style.opacity = '0';
        els.btnDarkNext.style.pointerEvents = 'none';

        const lineEls = [];
        lines.forEach((text) => {
            if (text === '') {
                const spacer = document.createElement('div');
                spacer.className = 'dark-message-spacer';
                els.darkLines.appendChild(spacer);
                return;
            }
            const p = document.createElement('p');
            p.className = 'dark-message-line';
            p.textContent = text;
            els.darkLines.appendChild(p);
            lineEls.push(p);
        });

        // Reveal one at a time, holding each briefly
        let delay = 900;
        const step = 2100;

        lineEls.forEach((el) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, delay);
            delay += step;
        });

        // After all lines shown + pause, reveal the "Lanjut" button
        const totalDone = delay;
        setTimeout(() => {
            els.btnDarkNext.style.opacity = '1';
            els.btnDarkNext.style.pointerEvents = 'auto';
            els.btnDarkNext.style.animation = 'fadeInUp 0.9s var(--ease-elegant) forwards';
        }, totalDone + 1200);
    }

    function buildCardScene() {
        const c = BD.CONTENT.card;
        els.cardLabel.textContent = c.label;
        els.cardTitle.textContent = c.title;
        els.cardFrom.textContent = c.from;
        els.cardWishPrefix.textContent = c.wishPrefix;
        els.cardWishHighlight.textContent = '“' + (BD.Wishes.getSelected() || 'Makin Bahagia') + '”';
        els.cardWishSuffix.textContent = c.wishSuffix;
        els.btnCardNext.textContent = c.buttonText;
    }

    function buildFlowerScene() {
        const c = BD.CONTENT.flower;
        els.bouquetHint.textContent = c.instruction;
        els.flowerCardTitle.textContent = c.title;
        els.flowerCardSubtitle.textContent = c.subtitle;
        els.flowerCardDesc.textContent = c.description;

        els.flowerList.innerHTML = '';
        c.flowers.forEach((f) => {
            const item = document.createElement('div');
            item.className = 'flower-list-item';
            const dot = document.createElement('span');
            dot.className = 'flower-list-dot';
            dot.style.background = f.color;
            dot.style.color = f.color;
            const text = document.createElement('span');
            text.textContent = `${f.name} · ${f.meaning}`;
            item.appendChild(dot);
            item.appendChild(text);
            els.flowerList.appendChild(item);
        });
    }

    function buildFinalScene() {
        const c = BD.CONTENT.final;
        els.finalIntro.textContent = c.introText;
        els.btnOpenGift.textContent = c.openButton;
        els.finalBigTitle.textContent = c.title;
        els.finalMessageText.textContent = c.message;
        els.finalThanks.textContent = c.thanks;
        els.btnRestart.textContent = c.restartButton;
        els.btnMusicToggle.textContent = c.musicButton;

        // Reset gift
        els.giftBox.classList.remove('opened');
        els.finalReveal.style.display = 'none';
        els.giftBoxArea.style.display = 'flex';
        els.finalIntro.classList.remove('visible');
        els.finalIntro.style.display = 'block';

        // Show intro
        setTimeout(() => {
            els.finalIntro.style.animation = 'none';
            els.finalIntro.offsetHeight;
            els.finalIntro.classList.add('visible');
        }, 400);
    }

    // ---- SCENE ACTIONS ----

    function openBouquet() {
        els.bouquet.classList.add('opening');
        els.bouquetHint.style.display = 'none';
        els.bouquetArea.style.pointerEvents = 'none';

        BD.FX.burstConfetti('confetti-layer');
        BD.FX.startPetals('petals-layer', 20);
        fadeMusic(0.55, 1500);

        setTimeout(() => {
            els.flowerCard.style.display = 'block';
            els.flowerCard.style.animation = 'none';
            els.flowerCard.offsetHeight;
            els.flowerCard.style.animation = 'fadeInUp 0.9s var(--ease-elegant) forwards';

            els.btnFlowerNext.style.opacity = '1';
            els.btnFlowerNext.style.pointerEvents = 'auto';
            els.btnFlowerNext.style.animation = 'fadeInUp 0.9s var(--ease-elegant) forwards';
        }, 900);
    }

    function openGift() {
        els.giftBox.classList.add('opened');
        els.btnOpenGift.style.display = 'none';

        setTimeout(() => {
            BD.FX.burstConfetti('confetti-layer');

            els.giftBoxArea.style.display = 'none';
            els.finalIntro.style.display = 'none';
            els.finalReveal.style.display = 'flex';
            els.finalReveal.style.animation = 'none';
            els.finalReveal.offsetHeight;
            els.finalReveal.style.animation = 'fadeInUp 1s var(--ease-elegant) forwards';

            fadeMusic(0.5, 1500);
        }, 800);
    }

    // ---- SCENE CHANGE HANDLER ----
    function onSceneEnter(sceneId) {
        appState.currentScene = sceneId;

        // Header
        const title = sceneTitles[sceneId] || '';
        if (title) {
            els.headerTitle.textContent = title;
            els.headerBar.classList.remove('header-hidden');
            els.headerBar.classList.add('header-visible');
        } else {
            els.headerBar.classList.remove('header-visible');
            els.headerBar.classList.add('header-hidden');
        }

        // Build scene content
        switch (sceneId) {
            case 'scene-candle':
                triggerRelight();
                break;
            case 'scene-dark-message':
                buildDarkMessage();
                break;
            case 'scene-wish':
                BD.Wishes.buildCards();
                break;
            case 'scene-gallery':
                BD.Gallery.build();
                break;
            case 'scene-letter':
                BD.Letter.start();
                break;
            case 'scene-card':
                buildCardScene();
                break;
            case 'scene-flower':
                buildFlowerScene();
                resetFlower();
                break;
            case 'scene-final':
                buildFinalScene();
                break;
        }
    }

    function triggerRelight() {
        // Reset candle visuals to unlit state each entry
        const flameWrap = $('#flame-wrap');
        flameWrap.classList.remove('lit', 'blowing', 'extinguished');
        $('#scene-candle').classList.remove('flame-lit');
        $('#btn-nyalakan').style.display = '';
        $('#candle-instruction').textContent = '';
        $('#candle-text-1').textContent = BD.CONTENT.candle.instruction1;
        $('#candle-text-2').textContent = BD.CONTENT.candle.instruction2;
        $('#candle-text-1').style.animation = 'fadeInUp 1.2s var(--ease-elegant) forwards';
        $('#candle-text-2').style.display = 'none';
        $('#blow-ring').style.display = 'none';

        setTimeout(() => {
            $('#candle-text-2').style.display = 'block';
            $('#candle-text-2').style.animation = 'fadeInUp 1.2s var(--ease-elegant) forwards';
        }, 1400);
        setTimeout(() => {
            $('#btn-nyalakan').style.opacity = '1';
            $('#btn-nyalakan').style.pointerEvents = 'auto';
        }, 2800);
    }

    function resetFlower() {
        els.bouquet.classList.remove('opening');
        els.flowerCard.style.display = 'none';
        els.btnFlowerNext.style.opacity = '0';
        els.btnFlowerNext.style.pointerEvents = 'none';
        els.bouquetArea.style.pointerEvents = 'auto';
        els.bouquetArea.style.animation = 'none';
        els.bouquetArea.offsetHeight;
    }

    // ---- RESTART ----
    function restart() {
        try {
            localStorage.removeItem('selectedWish');
        } catch (e) {}
        appState.selectedWish = null;
        appState.candleLit = false;
        appState.candleBlown = false;

        BD.FX.clearLayer('confetti-layer');
        BD.FX.clearLayer('petals-layer');
        BD.Letter.reset();
        BD.Wishes.reset();

        BD.Scenes.transitionTo('opening');
    }

    // ---- EVENT BINDING ----
    function bindEvents() {
        // Opening
        els.btnMulai.addEventListener('click', () => {
            els.sceneOpening.classList.add('warmed');
            startMusic();
            BD.Scenes.transitionTo('candle');
        });

        // Candle
        els.btnNyalakan.addEventListener('click', () => {
            BD.Candle.lightCandle();
        });

        // Dark message
        els.btnDarkNext.addEventListener('click', () => {
            BD.Scenes.transitionTo('wish');
        });

        // Wish
        els.btnWishNext.addEventListener('click', () => {
            BD.Scenes.transitionTo('gallery');
        });

        // Gallery
        els.btnGalleryNext.addEventListener('click', () => {
            BD.Scenes.transitionTo('letter');
        });

        // Letter
        els.btnLetterNext.addEventListener('click', () => {
            BD.Scenes.transitionTo('card');
        });

        // Card
        els.btnCardNext.addEventListener('click', () => {
            BD.Scenes.transitionTo('flower');
        });

        // Flower
        els.bouquetArea.addEventListener('click', () => {
            if (els.bouquetArea.style.pointerEvents === 'none') return;
            openBouquet();
        });
        els.btnFlowerNext.addEventListener('click', () => {
            BD.Scenes.transitionTo('final');
        });

        // Final
        els.btnOpenGift.addEventListener('click', openGift);
        els.btnRestart.addEventListener('click', restart);

        // Music toggle on final
        els.btnMusicToggle.addEventListener('click', () => {
            if (els.audio.paused) {
                startMusic();
            } else {
                pauseMusic();
                appState.musicPlaying = false;
            }
        });

        // Music controller
        els.btnMusic.addEventListener('click', () => {
            if (els.audio.paused) {
                startMusic();
            } else {
                pauseMusic();
                appState.musicPlaying = false;
                els.audio._fadeInterval && clearInterval(els.audio._fadeInterval);
                els.audio.volume = 0;
                els.musicController.classList.add('muted');
            }
        });

        // Exit
        els.btnClose.addEventListener('click', () => {
            els.exitModal.style.display = 'flex';
        });
        els.btnStay.addEventListener('click', () => {
            els.exitModal.style.display = 'none';
        });
        els.btnLeave.addEventListener('click', () => {
            // Show a farewell - just hide the app and stop
            if (els.audio) { els.audio.pause(); els.audio.currentTime = 0; }
            document.getElementById('app').style.display = 'none';
            document.body.style.background = '#090607';
            const msg = document.createElement('div');
            msg.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;color:#F8F0E4;font-family:Playfair Display,serif;font-style:italic;font-size:1.2rem;text-align:center;padding:2rem;';
            msg.textContent = 'Makasih ya sudah membuka hadiah ini sampai selesai. Sampai jumpa lagi. ❤️';
            document.body.appendChild(msg);
        });
    }

    // ---- INIT ----
    function init() {
        BD.FX.createParticleLayer();

        // Init modules
        BD.Scenes.init(onSceneEnter);

        // Set up content for each module
        BD.Candle.init(appState);
        BD.Wishes.init(appState);
        BD.Gallery.init(appState);
        BD.Letter.init(appState);

        buildOpening();
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
