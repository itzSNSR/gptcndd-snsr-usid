// USDI Theme Manager
// Handles Light/Dark theme switching with persistence

class ThemeManager {
    constructor() {
        this.storageKey = 'usdi_theme';
        this.init();
    }

    init() {
        // Check saved preference or system preference
        const savedTheme = localStorage.getItem(this.storageKey);

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
        this.currentTheme = theme;
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize Theme Manager
window.themeManager = new ThemeManager();

// Helper function for theme toggle buttons
function toggleTheme() {
    window.themeManager.toggle();
}
