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

        // Listen for radio changes (delegate to handle dynamic insertion)
        document.addEventListener('change', (e) => {
            if (e.target.name === 'theme') {
                this.setTheme(e.target.value);
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
        this.currentTheme = theme;

        // Sync new flat switch checkboxes
        const isDark = theme === 'dark';
        document.querySelectorAll('.switch__input').forEach(input => {
            input.checked = isDark;
        });

        // Keep legacy radio sync just in case
        const radio = document.querySelector(`input[name="theme"][value="${theme}"]`);
        if (radio) radio.checked = true;
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Initialize Theme Manager
window.themeManager = new ThemeManager();

// Helper function for theme toggle buttons
// accepts explicit checked state (boolean) from checkbox
function toggleTheme(isChecked) {
    if (typeof isChecked === 'boolean') {
        window.themeManager.setTheme(isChecked ? 'dark' : 'light');
    } else {
        window.themeManager.toggle();
    }
}
