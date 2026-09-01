/* ============================================
   BIRTHDAY GIFT - LETTER TYPING MODULE
   ============================================ */

window.BD = window.BD || {};

BD.Letter = (function () {
    'use strict';

    let appState = null;
    let typingTimer = null;
    let cancelled = false;

    const els = {};

    const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function init(state) {
        appState = state;
        els.body = document.getElementById('letter-body');
        els.cursor = document.getElementById('typewriter-cursor');
        els.signature = document.getElementById('letter-signature');
        els.btnNext = document.getElementById('btn-letter-next');
    }

    function start() {
        const content = BD.CONTENT.letter;
        const text = content.body;

        cancelled = false;
        clearInterval(typingTimer);

        els.body.textContent = '';
        els.body.appendChild(els.cursor);
        els.signature.textContent = '';
        els.signature.classList.remove('visible');
        els.btnNext.style.opacity = '0';
        els.btnNext.style.pointerEvents = 'none';

        let i = 0;

        if (PREFERS_REDUCED) {
            els.body.insertBefore(document.createTextNode(text), els.cursor);
            finish();
            return;
        }

        typingTimer = setInterval(() => {
            if (cancelled) return;
            if (i < text.length) {
                els.body.insertBefore(
                    document.createTextNode(text[i]),
                    els.cursor
                );
                i++;
            } else {
                clearInterval(typingTimer);
                finish();
            }
        }, 60);
    }

    function finish() {
        els.cursor.style.display = 'none';
        els.signature.textContent = BD.CONTENT.letter.signature;
        els.signature.style.display = 'block';

        setTimeout(() => {
            els.signature.classList.add('visible');
        }, 300);

        setTimeout(() => {
            els.btnNext.style.opacity = '1';
            els.btnNext.style.pointerEvents = 'auto';
            els.btnNext.textContent = BD.CONTENT.letter.buttonText;
        }, 1200);
    }

    function reset() {
        clearInterval(typingTimer);
        cancelled = true;
        els.body.textContent = '';
        els.body.appendChild(els.cursor);
        els.cursor.style.display = '';
        els.signature.textContent = '';
        els.signature.classList.remove('visible');
        els.btnNext.style.opacity = '0';
        els.btnNext.style.pointerEvents = 'none';
    }

    return {
        init: init,
        start: start,
        reset: reset
    };
})();
