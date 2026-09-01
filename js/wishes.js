/* ============================================
   BIRTHDAY GIFT - WISH MODULE
   ============================================ */

window.BD = window.BD || {};

BD.Wishes = (function () {
    'use strict';

    let appState = null;
    let selectedWish = null;

    const els = {};

    function init(state) {
        appState = state;
        els.grid = document.getElementById('wish-grid');
        els.subtitle = document.getElementById('wish-subtitle');
        els.title = document.getElementById('wish-title');
        els.selectedText = document.getElementById('wish-selected-text');
        els.btnNext = document.getElementById('btn-wish-next');

        els.title.setAttribute('style', 'white-space:pre-line');
        els.title.textContent = BD.CONTENT.wish.title;

        buildCards();
    }

    function buildCards() {
        const cards = BD.CONTENT.wish.cards;
        els.grid.innerHTML = '';

        cards.forEach((card, idx) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'wish-card';
            cardEl.dataset.wish = card.text;
            cardEl.dataset.id = card.id;
            cardEl.setAttribute('role', 'button');
            cardEl.setAttribute('tabindex', '0');
            cardEl.setAttribute('aria-label', 'Pilih wish: ' + card.text);
            cardEl.style.animation = `fadeInUp 0.7s var(--ease-elegant) ${0.15 * idx + 0.2}s backwards`;

            const icon = document.createElement('div');
            icon.className = 'wish-icon';
            icon.textContent = card.icon;

            const title = document.createElement('h3');
            title.textContent = card.text;

            cardEl.appendChild(icon);
            cardEl.appendChild(title);

            cardEl.addEventListener('click', () => select(cardEl));
            cardEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select(cardEl);
                }
            });

            els.grid.appendChild(cardEl);
        });

        // Restore from state/localStorage
        if (appState.selectedWish) {
            const cached = els.grid.querySelector(`[data-wish="${appState.selectedWish}"]`);
            if (cached) markSelected(cached);
        }
    }

    function select(cardEl) {
        if (cardEl.classList.contains('selected')) return;

        // Dim all others
        const allCards = els.grid.querySelectorAll('.wish-card');
        allCards.forEach((c) => {
            c.classList.remove('selected', 'dimmed');
            if (c !== cardEl) c.classList.add('dimmed');
        });

        markSelected(cardEl);

        selectedWish = cardEl.dataset.wish;
        appState.selectedWish = selectedWish;

        // Save to localStorage (safe)
        try {
            localStorage.setItem('selectedWish', selectedWish);
        } catch (err) {
            // fallback to state only
        }

        if (appState.playSound) appState.playSound('select');

        setTimeout(() => {
            els.selectedText.textContent = BD.CONTENT.wish.selectedText;
            els.selectedText.style.display = 'block';
            els.selectedText.style.animation = 'none';
            els.selectedText.offsetHeight;
            els.selectedText.style.animation = 'fadeInUp 0.8s var(--ease-elegant) forwards';

            els.btnNext.style.opacity = '1';
            els.btnNext.style.pointerEvents = 'auto';
        }, 400);
    }

    function markSelected(cardEl) {
        cardEl.classList.remove('dimmed');
        cardEl.classList.add('selected');
        els.btnNext.style.opacity = '1';
        els.btnNext.style.pointerEvents = 'auto';
    }

    function getSelected() {
        return selectedWish || appState.selectedWish;
    }

    function reset() {
        selectedWish = null;
        if (els.grid) {
            els.grid.innerHTML = '';
            buildCards();
        }
        els.selectedText.style.display = 'none';
        els.btnNext.style.opacity = '0';
        els.btnNext.style.pointerEvents = 'none';
    }

    return {
        init: init,
        buildCards: buildCards,
        getSelected: getSelected,
        reset: reset
    };
})();
