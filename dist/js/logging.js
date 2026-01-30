/**
 * Secure Website Logger (Cloudflare Native)
 */

(function () {
    async function logVisit() {
        try {
            // We just hit our local Cloudflare Function endpoint.
            // NO URLs, NO Keys, NO IP leakage in the frontend code.
            // The 'p' param helps the backend know which page was visited.
            fetch(`/api/log?p=${encodeURIComponent(window.location.pathname)}`, {
                method: 'POST',
                mode: 'same-origin'
            });
        } catch (e) {
            // Silently fail
        }
    }

    if (document.readyState === 'complete') {
        logVisit();
    } else {
        window.addEventListener('load', logVisit);
    }
})();
