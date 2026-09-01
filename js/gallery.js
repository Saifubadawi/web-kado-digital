/* ============================================
   BIRTHDAY GIFT - GALLERY MODULE
   ============================================ */

window.BD = window.BD || {};

BD.Gallery = (function () {
    'use strict';

    let appState = null;
    let currentIndex = 0;

    const PLACEHOLDER_COLORS = [
        'linear-gradient(150deg, #4B1F2B, #2B111B)',
        'linear-gradient(150deg, #6B2D3F, #3A1722)',
        'linear-gradient(150deg, #5A2237, #2B111B)',
        'linear-gradient(150deg, #B76E79, #4B1F2B)',
        'linear-gradient(150deg, #C98F91, #6B2D3F)',
        'linear-gradient(150deg, #D9AE68, #4B1F2B)'
    ];
    const els = {};

    function init(state) {
        appState = state;
        els.subtitle = document.getElementById('gallery-subtitle');
        els.title = document.getElementById('gallery-title');
        els.desc = document.getElementById('gallery-desc');
        els.grid = document.getElementById('heart-gallery');
        els.modal = document.getElementById('photo-modal');
        els.modalBackdrop = document.getElementById('photo-modal-backdrop');
        els.modalClose = document.getElementById('modal-close-btn');
        els.modalFrame = document.getElementById('modal-photo-frame');
        els.modalCaption = document.getElementById('modal-caption');
        els.btnNext = document.getElementById('btn-gallery-next');

        const content = BD.CONTENT.gallery;
        els.subtitle.textContent = content.subtitle;
        els.title.textContent = content.title;
        els.desc.textContent = content.description;

        bindCloseEvents();
    }

    function build() {
        const photos = BD.CONTENT.gallery.photos;
        els.grid.innerHTML = '';

        photos.forEach((photo, idx) => {
            const cell = document.createElement('div');
            cell.className = 'gallery-photo';
            cell.dataset.index = idx;
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-label', 'Lihat foto kenangan ' + (idx + 1));

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.alt = photo.caption || 'Foto kenangan ' + (idx + 1);
            img.src = photo.image;
            img.onerror = function () {
                this.replaceWith(createPlaceholder(idx));
            };

            cell.appendChild(img);
            cell.addEventListener('click', () => open(idx));
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(idx);
                }
            });

            els.grid.appendChild(cell);
        });

        setTimeout(() => {
            els.btnNext.style.opacity = '1';
            els.btnNext.style.pointerEvents = 'auto';
        }, 600);
    }

    function createPlaceholder(idx) {
        const ph = document.createElement('div');
        ph.className = 'photo-placeholder';
        ph.style.background = PLACEHOLDER_COLORS[idx % PLACEHOLDER_COLORS.length];
        ph.textContent = getIcon(idx);
        return ph;
    }

    function getIcon(idx) {
        return ['🌷', '💛', '✨', '🌻', '💌', '🌹', '🎀', '☀️', '🕊️', '🍀', '🌙', '💫'][idx] || '💛';
    }

    function open(index) {
        currentIndex = index;
        const photo = BD.CONTENT.gallery.photos[index];

        // Rebuild frame each time to avoid stale content
        const img = new Image();
        img.alt = photo.caption;
        img.onload = function () {
            els.modalFrame.innerHTML = '';
            els.modalFrame.appendChild(img);
        };
        img.onerror = function () {
            els.modalFrame.innerHTML = '';
            els.modalFrame.appendChild(createPlaceholder(index));
        };
        img.src = photo.image;

        els.modalCaption.textContent = '“' + photo.caption + '”';
        els.modal.classList.add('open');

        if (appState.pauseMusic) appState.pauseMusic();
    }

    function close() {
        els.modal.classList.remove('open');
        if (appState.resumeMusic) appState.resumeMusic();
    }

    function bindCloseEvents() {
        els.modalClose.addEventListener('click', close);
        els.modalBackdrop.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && els.modal.classList.contains('open')) {
                close();
            }
        });
    }

    function reset() {
        close();
        els.btnNext.style.opacity = '0';
        els.btnNext.style.pointerEvents = 'none';
    }

    return {
        init: init,
        build: build,
        reset: reset
    };
})();
