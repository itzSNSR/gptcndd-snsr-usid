import gsap from 'https://cdn.skypack.dev/gsap@3.13.0';
import Draggable from 'https://cdn.skypack.dev/gsap@3.13.0/Draggable';

gsap.registerPlugin(Draggable);

const toggle = document.querySelector('.liquid-toggle');
const config = {
    theme: 'light',
    complete: 0,
    active: false,
    deviation: 2,
    alpha: 16,
    bounce: true,
    hue: 144,
    delta: true,
    bubble: true,
};

// Sync with existing ThemeManager
const savedTheme = localStorage.getItem('usdi_theme') || 'light';
const isDark = savedTheme === 'dark';

// Initialize state
toggle.setAttribute('aria-pressed', isDark);
document.documentElement.dataset.theme = savedTheme;

// Update SVG Filters
const updateFilters = () => {
    gsap.set('#goo feGaussianBlur', {
        attr: {
            stdDeviation: config.deviation,
        },
    });
    gsap.set('#goo feColorMatrix', {
        attr: {
            values: `
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 ${config.alpha} -10
            `,
        },
    });
};
updateFilters();

const toggleState = async () => {
    toggle.dataset.pressed = true;
    if (config.bubble) toggle.dataset.active = true;

    await Promise.allSettled(
        !config.bounce
            ? toggle.getAnimations({ subtree: true }).map((a) => a.finished)
            : []
    );

    const pressed = toggle.matches('[aria-pressed=true]');
    // Switch logic
    const newPressedState = !pressed;

    gsap.timeline({
        onComplete: () => {
            gsap.delayedCall(0.05, () => {
                toggle.dataset.active = false;
                toggle.dataset.pressed = false;
                toggle.setAttribute('aria-pressed', newPressedState);

                // Trigger global theme change
                const newTheme = newPressedState ? 'dark' : 'light';
                if (window.themeManager) {
                    window.themeManager.setTheme(newTheme);
                } else {
                    document.documentElement.dataset.theme = newTheme;
                    localStorage.setItem('usdi_theme', newTheme);
                }
            });
        },
    })
        .to(toggle, {
            '--complete': pressed ? 0 : 100,
            duration: 0.12,
            delay: config.bounce && config.bubble ? 0.18 : 0,
        });
};

toggle.addEventListener('click', toggleState);

// Draggable Logic
const proxy = document.createElement('div');
Draggable.create(proxy, {
    allowContextMenu: true,
    handle: '.liquid-toggle',
    trigger: '.liquid-toggle',
    onDragStart: function () {
        const toggleBounds = toggle.getBoundingClientRect();
        const pressed = toggle.matches('[aria-pressed=true]');
        const bounds = pressed
            ? toggleBounds.left - this.pointerX
            : toggleBounds.left + toggleBounds.width - this.pointerX;
        this.dragBounds = bounds;
        toggle.dataset.active = true;
    },
    onDrag: function () {
        const pressed = toggle.matches('[aria-pressed=true]');
        const dragged = this.x - this.startX;
        const complete = gsap.utils.clamp(
            0,
            100,
            pressed
                ? gsap.utils.mapRange(this.dragBounds, 0, 0, 100, dragged)
                : gsap.utils.mapRange(0, this.dragBounds, 0, 100, dragged)
        );
        this.complete = complete;
        gsap.set(toggle, { '--complete': complete, '--delta': Math.min(Math.abs(this.deltaX), 12) });
    },
    onDragEnd: function () {
        const willSwitch = this.complete >= 50;
        gsap.fromTo(
            toggle,
            { '--complete': this.complete },
            {
                '--complete': willSwitch ? 100 : 0,
                duration: 0.15,
                onComplete: () => {
                    gsap.delayedCall(0.05, () => {
                        toggle.dataset.active = false;
                        const finalPressed = willSwitch;
                        toggle.setAttribute('aria-pressed', finalPressed);

                        // Sync Theme
                        const newTheme = finalPressed ? 'dark' : 'light';
                        if (window.themeManager) {
                            window.themeManager.setTheme(newTheme);
                        }
                    });
                },
            }
        );
    },
    onPress: function () {
        this.__pressTime = Date.now();
        if ('ontouchstart' in window && navigator.maxTouchPoints > 0)
            toggle.dataset.active = true;
    },
    onRelease: function () {
        this.__releaseTime = Date.now();
        gsap.set(toggle, { '--delta': 0 });

        if (
            'ontouchstart' in window &&
            navigator.maxTouchPoints > 0 &&
            ((this.startX !== undefined &&
                this.endX !== undefined &&
                Math.abs(this.endX - this.startX) < 4) ||
                this.endX === undefined)
        )
            toggle.dataset.active = false;

        // If click-like (short duration), trigger toggle
        if (this.__releaseTime - this.__pressTime <= 150) {
            // Let the click listener handle it or call toggleState directly
            // toggleState(); // Click listener already attached
        }
    },
});

toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleState();
    }
});

// Initial Render Sync
if (isDark) {
    gsap.set(toggle, { '--complete': 100 });
}
