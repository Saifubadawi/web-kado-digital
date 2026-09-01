/* ============================================
   BIRTHDAY GIFT - CANDLE MODULE
   ============================================ */

window.BD = window.BD || {};

BD.Candle = (function () {
    'use strict';

    let appState = null;
    const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const els = {};

    function init(state) {
        appState = state;

        els.candleAssembly = document.getElementById('candle-assembly');
        els.flameWrap = document.getElementById('flame-wrap');
        els.flame = document.getElementById('flame');
        els.flameGlow = document.getElementById('flame-glow');
        els.smokeLayer = document.getElementById('smoke-layer');
        els.btnNyalakan = document.getElementById('btn-nyalakan');
        els.candleInstruction = document.getElementById('candle-instruction');
        els.candleText1 = document.getElementById('candle-text-1');
        els.candleText2 = document.getElementById('candle-text-2');
        els.scene = document.getElementById('scene-candle');
        els.blowRing = document.getElementById('blow-ring');
        els.blowRingFill = document.getElementById('blow-ring-fill');
        els.blowRingText = document.getElementById('blow-ring-text');
        els.btnMulai = document.getElementById('btn-mulai');

        const content = BD.CONTENT.candle;
        els.candleText1.textContent = content.instruction1;
        els.candleText2.textContent = content.instruction2;

        showCandleTexts();
    }

    function showCandleTexts() {
        els.candleText1.style.animation = 'fadeInUp 1.2s var(--ease-elegant) forwards';
        setTimeout(() => {
            els.candleText2.style.display = 'block';
            els.candleText2.style.animation = 'fadeInUp 1.2s var(--ease-elegant) forwards';
        }, 1400);

        setTimeout(() => {
            els.btnNyalakan.style.opacity = '1';
            els.btnNyalakan.style.pointerEvents = 'auto';
        }, 2800);
    }

    function lightCandle() {
        appState.candleLit = true;

        els.flameWrap.classList.add('lit');
        els.btnNyalakan.style.display = 'none';
        els.candleText1.style.animation = 'fadeOut 1s ease forwards';
        els.candleText2.style.animation = 'fadeOut 1s ease forwards';
        els.scene.classList.add('flame-lit');

        // Fire sounds
        if (appState.playSound) appState.playSound('candle');

        setTimeout(() => {
            els.candleInstruction.textContent = BD.CONTENT.candle.holdInstruction;
            els.candleInstruction.style.animation = 'fadeInUp 0.8s var(--ease-elegant) forwards';
            els.blowRing.style.display = 'flex';
            els.blowRing.style.animation = 'scaleIn 0.6s var(--ease-bounce) forwards';
            enableBlowInteraction();
        }, 1600);
    }

    // ---- Blow (hold) interaction ----
    const CIRCUMFERENCE = 2 * Math.PI * 52;

    let blowing = false;
    let blowProgress = 0;
    let blowTimer = null;
    let releaseTimer = null;

    function enableBlowInteraction() {
        els.candleAssembly.classList.add('interactive');
        const duration = BD.CONTENT.candle.blowDuration || 3000;

        els.candleAssembly.addEventListener('pointerdown', (e) => {
            if (typeof els.candleAssembly.setPointerCapture === 'function') {
                try { els.candleAssembly.setPointerCapture(e.pointerId); } catch (err) {}
            }
            onPointerDown(e);
        });
        els.candleAssembly.addEventListener('pointerup', onPointerUp);
        els.candleAssembly.addEventListener('pointercancel', onPointerUp);
        els.candleAssembly.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    function onPointerDown(e) {
        if (appState.candleBlown || !appState.candleLit) return;
        e.preventDefault();
        startBlowing();
    }

    function onPointerUp(e) {
        if (!blowing) return;
        e.preventDefault();
        stopBlowing();
    }

    function startBlowing() {
        blowing = true;
        clearInterval(releaseTimer);
        els.flameWrap.classList.add('blowing');
        els.candleInstruction.textContent = '';

        blowTimer = setInterval(() => {
            blowProgress = Math.min(100, blowProgress + (100 / (BD.CONTENT.candle.blowDuration / 100)));

            updateProgressUI(blowProgress);

            if (blowProgress >= 100) {
                blowOut();
            }
        }, 100);
    }

    function stopBlowing() {
        clearInterval(blowTimer);
        els.flameWrap.classList.remove('blowing');

        if (appState.candleBlown) return;

        // If released before completion, show fail message and reset progress
        if (blowProgress > 0 && blowProgress < 100 && !appState.candleBlown) {
            els.candleInstruction.textContent = BD.CONTENT.candle.failMessage;
            els.candleInstruction.style.animation = 'none';
            els.candleInstruction.offsetHeight;
            els.candleInstruction.style.animation = 'fadeInUp 0.6s var(--ease-elegant) forwards';
        }

        releaseTimer = setInterval(() => {
            blowProgress = Math.max(0, blowProgress - 4);
            updateProgressUI(blowProgress);
            if (blowProgress <= 0) {
                clearInterval(releaseTimer);
                blowing = false;
                setTimeout(() => {
                    if (!appState.candleBlown) {
                        els.candleInstruction.textContent = BD.CONTENT.candle.holdInstruction;
                        els.candleInstruction.style.animation = 'none';
                        els.candleInstruction.offsetHeight;
                        els.candleInstruction.style.animation = 'fadeInUp 0.8s var(--ease-elegant) forwards';
                    }
                }, 300);
            }
        }, 50);
    }

    function updateProgressUI(progress) {
        const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
        els.blowRingFill.style.strokeDashoffset = offset;
        els.blowRingText.textContent = Math.round(progress) + '%';
    }

    function blowOut() {
        clearInterval(blowTimer);
        blowing = false;
        appState.candleBlown = true;

        els.flameWrap.classList.remove('blowing');
        els.flameWrap.classList.add('extinguished');
        els.scene.classList.remove('flame-lit');
        els.blowRing.style.display = 'none';
        els.candleInstruction.textContent = '';

        createSmoke();
        if (appState.playSound) appState.playSound('blow');
        if (appState.fadeMusic) appState.fadeMusic(0.25, 1800);

        // After a beat, go to dark message
        setTimeout(() => {
            if (appState.transitionTo) appState.transitionTo('dark-message');
        }, 1400);
    }

    function createSmoke() {
        const smokeCount = PREFERS_REDUCED ? 3 : 8;
        for (let i = 0; i < smokeCount; i++) {
            setTimeout(() => {
                const smoke = document.createElement('div');
                smoke.className = 'smoke-particle';
                smoke.style.left = (Math.random() * 40 - 20) + 'px';
                smoke.style.setProperty('--sway', (Math.random() * 30 - 15) + 'px');
                smoke.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
                els.smokeLayer.appendChild(smoke);
                setTimeout(() => {
                    if (smoke.parentNode) smoke.remove();
                }, 2500);
            }, i * 130);
        }
    }

    function reset() {
        blowing = false;
        blowProgress = 0;
        clearInterval(blowTimer);
        clearInterval(releaseTimer);

        appState.candleLit = false;
        appState.candleBlown = false;

        els.flameWrap.classList.remove('lit', 'blowing', 'extinguished');
        els.scene.classList.remove('flame-lit');
        els.btnNyalakan.style.display = '';
        els.candleText1.textContent = BD.CONTENT.candle.instruction1;
        els.candleText2.textContent = BD.CONTENT.candle.instruction2;
        els.candleText1.style.animation = '';
        els.candleText2.style.display = 'none';
        els.candleText2.style.animation = '';
        els.candleInstruction.textContent = '';
        els.candleInstruction.style.animation = '';
        els.blowRing.style.display = 'none';
        els.blowRingFill.style.strokeDashoffset = CIRCUMFERENCE;
        els.blowRingText.textContent = '0%';
        els.smokeLayer.innerHTML = '';
        els.btnNyalakan.style.opacity = '0';
        els.btnNyalakan.style.pointerEvents = 'none';

        showCandleTexts();
    }

    return {
        init: init,
        lightCandle: lightCandle,
        reset: reset
    };
})();
