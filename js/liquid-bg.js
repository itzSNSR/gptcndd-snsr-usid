import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js';

let appInstance = null;
let currentTheme = 'light';

// Generate a gradient data URI for the background
function generateGradientTexture(theme) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Create gradient
    // Diagonal gradient for dynamic flow
    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);

    if (theme === 'dark') {
        // Dark Mode: Deep Navy to Black
        // Using USDI CSS vars reference: --grey-900 (#0f172a) to --primary-dark (#1e3a8a)
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e3a8a');
        gradient.addColorStop(1, '#0f172a');
    } else {
        // Light Mode: White to Soft Blue
        // Using USDI CSS vars: --grey-50 to --primary-light
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(0.5, '#bfdbfe'); // very light blue
        gradient.addColorStop(1, '#ffffff');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Add some noise/texture to make the liquid effect more visible
    // The liquid effect relies on contrast to create "waves"
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 50000; i++) {
        ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
        ctx.beginPath();
        ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
    }

    return canvas.toDataURL('image/png');
}

function updateLiquidTheme(theme) {
    if (!appInstance) return;

    currentTheme = theme;
    const textureUrl = generateGradientTexture(theme);
    appInstance.loadImage(textureUrl);
}

// Initialization function
function initLiquidBackground() {
    let canvas = document.getElementById('liquid-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'liquid-canvas';
        document.body.prepend(canvas);
    }

    try {
        // Optimize for mobile: Cap DPR at 1.0 for absolute max performance (Lag Free)
        const dpr = window.innerWidth < 768 ? 1.0 : Math.min(window.devicePixelRatio, 1.5);


        const app = LiquidBackground(canvas, {
            dpr: dpr
        });

        // Ensure canvas fits viewport - Fix "incorrect size"
        // Ensure canvas fits viewport - Fix "incorrect size"
        let lastWidth = window.innerWidth;

        function resizeCanvas() {
            // Mobile Optimization: Ignore resize if width hasn't changed (address bar scroll)
            // This prevents lag on scrolling index pages
            if (window.innerWidth === lastWidth && Math.abs(window.innerHeight - canvas.height / dpr) < 100) {
                return;
            }
            lastWidth = window.innerWidth;

            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            if (app.resize) app.resize();
        }

        // Debounce resize to prevent thrashing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 100);
        });

        // Initial set
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';

        appInstance = app;

        // Initial load based on current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const textureUrl = generateGradientTexture(currentTheme);

        app.loadImage(textureUrl);

        app.liquidPlane.material.metalness = 0.8;
        app.liquidPlane.material.roughness = 0.2;
        app.liquidPlane.uniforms.displacementScale.value = 4;
        app.setRain(false);

        setTimeout(() => {
            canvas.classList.add('loaded');
        }, 300);

        // Setup MutationObserver to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    updateLiquidTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

    } catch (e) {
        console.error('Failed to initialize Liquid Background:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidBackground);
} else {
    initLiquidBackground();
}
