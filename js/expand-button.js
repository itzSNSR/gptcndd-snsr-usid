// Animated Submit Button - Auto-apply to all submit buttons
document.addEventListener('DOMContentLoaded', function () {
    // Find all submit buttons and add expand class + SVG icons
    const submitButtons = document.querySelectorAll('button[type="submit"]');

    submitButtons.forEach(button => {
        // Only process if not already setup
        if (!button.classList.contains('expand-setup-complete')) {
            // Add expand class
            button.classList.add('expand');

            // Store original content
            const originalText = button.textContent.trim();

            // Clear button and rebuild with new structure
            button.innerHTML = `
                ${originalText}
                <span class="expand-icon expand-hover">
                    <svg class="first" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 32 32" version="1.1">
                        <path d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z" />
                    </svg>
                    <span class="loader"></span>
                    <svg class="second" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5L8 15l-5-4" />
                    </svg>
                </span>
            `;

            // Mark as setup
            button.classList.add('expand-setup-complete');

            // Add click animation handler
            button.addEventListener('click', function (e) {
                // Only animate if not already animating
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');
                    this.disabled = true;

                    setTimeout(() => {
                        this.classList.add('loaded');
                        setTimeout(() => {
                            this.classList.add('finished');
                            setTimeout(() => {
                                this.classList.remove('finished');
                                this.classList.remove('loaded');
                                this.classList.remove('loading');
                                this.disabled = false;
                            }, 1500);
                        }, 700);
                    }, 1500);
                }
            });
        }
    });
});
