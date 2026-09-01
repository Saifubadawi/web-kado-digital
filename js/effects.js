/* ============================================
   BIRTHDAY GIFT - FX MODULE (particles, confetti, petals)
   ============================================ */

window.BD = window.BD || {};

BD.FX = (function () {
    'use strict';

    const PARTICLE_GLYPHS = ['♥', '✦', '✧', '✿', '❀', '♡', '☆'];
    const PETAL_COLORS = ['#C98F91', '#D4A0A2', '#E0B4B6', '#B76E79', '#E8CBB0'];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function createParticleLayer() {
        const layer = document.getElementById('particle-layer');
        if (!layer) return;

        const count = prefersReducedMotion ? 6 : 16;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-fx';

            const glyph = PARTICLE_GLYPHS[Math.floor(Math.random() * PARTICLE_GLYPHS.length)];
            const size = 10 + Math.random() * 14;
            const duration = 7 + Math.random() * 8;
            const delay = Math.random() * 8;

            particle.innerHTML = `<span class="fx-inner" style="color:rgba(217,174,104,${0.4 + Math.random() * 0.4})">${glyph}</span>`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.setProperty('--size', size + 'px');
            particle.style.setProperty('--dur', duration + 's');
            particle.style.setProperty('--delay', -delay + 's');
            particle.style.setProperty('--drift', ((Math.random() * 60) - 30) + 'px');

            layer.appendChild(particle);
        }
    }

    function burstConfetti(containerId) {
        const layer = document.getElementById(containerId) || document.getElementById('confetti-layer');
        if (!layer) return;

        const colors = ['#D9AE68', '#C98F91', '#F8F0E4', '#B76E79', '#E8C97A', '#A0674A', '#D4A0A2'];
        const count = prefersReducedMotion ? 20 : 80;

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 6 + Math.random() * 8;
            const isRect = Math.random() > 0.5;

            piece.style.left = Math.random() * 100 + '%';
            piece.style.width = size + 'px';
            piece.style.height = (isRect ? Math.random() * 6 + 8 : size) + 'px';
            piece.style.background = color;
            piece.style.borderRadius = isRect ? '2px' : '50%';
            piece.style.setProperty('--dur', (2.2 + Math.random() * 2.5) + 's');
            piece.style.setProperty('--delay', Math.random() * 0.4 + 's');
            piece.style.setProperty('--spin', (360 + Math.random() * 720) + 'deg');
            piece.style.setProperty('--sway', ((Math.random() * 60) - 30) + 'px');

            layer.appendChild(piece);
            setTimeout(() => {
                if (piece.parentNode) piece.remove();
            }, 5500);
        }
    }

    function startPetals(containerId, count) {
        const layer = document.getElementById(containerId) || document.getElementById('petals-layer');
        if (!layer) return;

        const n = count || (prefersReducedMotion ? 8 : 22);
        for (let i = 0; i < n; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal-piece';

            const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
            const size = 10 + Math.random() * 12;

            petal.style.left = Math.random() * 100 + '%';
            petal.style.width = size + 'px';
            petal.style.height = (size * 1.2) + 'px';
            petal.style.background = color;
            petal.style.setProperty('--dur', (5 + Math.random() * 5) + 's');
            petal.style.setProperty('--delay', -(Math.random() * 6) + 's');
            petal.style.setProperty('--sway', ((Math.random() * 50) - 25) + 'px');

            layer.appendChild(petal);
        }
    }

    function clearLayer(containerId) {
        const layer = document.getElementById(containerId);
        if (layer) layer.innerHTML = '';
    }

    return {
        createParticleLayer: createParticleLayer,
        burstConfetti: burstConfetti,
        startPetals: startPetals,
        clearLayer: clearLayer
    };
})();
