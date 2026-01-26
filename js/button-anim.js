/**
 * Button Animation Helper
 * Handles the 'Expand' button states: default -> loading -> loaded -> finished
 */

function startLoader(btn) {
    if (!btn) return;
    btn.classList.add('loading');
    btn.disabled = true; // Prevent double clicks
}

function finishLoader(btn, success = true) {
    if (!btn) return;

    if (success) {
        btn.classList.add('loaded');

        // Brief delay to show the checkmark before finishing
        setTimeout(() => {
            btn.classList.add('finished');

            // Optional: Reset after a few seconds if needed, 
            // or leave it as "Done" state depending on flow.
            // For now, we leave it in 'finished' state.
        }, 500); // 500ms delay for checkmark reveal
    } else {
        // On failure, just reset to allow retry
        btn.classList.remove('loading');
        btn.classList.remove('loaded');
        btn.classList.remove('finished');
        btn.disabled = false;
    }
}

/**
 * Convenience wrapper for async functions
 * @param {HTMLElement} btn - The button element
 * @param {Function} asyncAction - Function returning a Promise
 */
async function handleButtonAction(btn, asyncAction) {
    const originalText = btn.innerHTML; // basic backup if needed

    try {
        startLoader(btn);
        await asyncAction();
        finishLoader(btn, true);
    } catch (error) {
        console.error('Action failed:', error);
        finishLoader(btn, false);
        // Optionally trigger a toast error here
        if (window.showError) window.showError(error.message || 'Action failed');
    }
}
