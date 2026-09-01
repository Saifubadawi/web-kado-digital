/* ============================================
   BIRTHDAY GIFT - SCENE TRANSITION MODULE
   ============================================ */

window.BD = window.BD || {};

BD.Scenes = (function () {
    'use strict';

    let onSceneChange = null;
    let transitioning = false;

    const SCENE_MAP = {
        'opening': 'scene-opening',
        'candle': 'scene-candle',
        'dark-message': 'scene-dark-message',
        'wish': 'scene-wish',
        'gallery': 'scene-gallery',
        'letter': 'scene-letter',
        'card': 'scene-card',
        'flower': 'scene-flower',
        'final': 'scene-final'
    };

    function init(callback) {
        onSceneChange = callback;
    }

    function pause(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function transitionTo(sceneName) {
        if (transitioning) return;
        const sceneId = SCENE_MAP[sceneName];
        if (!sceneId) return;

        transitioning = true;

        const current = document.querySelector('.scene.active');
        const next = document.getElementById(sceneId);

        // Fade out current
        if (current && current !== next) {
            current.classList.remove('active');
            current.classList.add('leaving');
            await pause(650);
            current.classList.remove('leaving');
        }

        // Show next
        next.classList.add('active');
        next.classList.remove('leaving');

        if (onSceneChange) onSceneChange(sceneId);

        await pause(50);
        transitioning = false;
    }

    return {
        init: init,
        transitionTo: transitionTo,
        getSceneId: (name) => SCENE_MAP[name]
    };
})();
