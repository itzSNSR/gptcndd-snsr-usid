// USDI Language Manager

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('usdi_lang') || 'en';
        this.init();
    }

    init() {
        // Apply saved language on load
        this.setLanguage(this.currentLang);

        // Initialize Custom Dropdown logic
        const initDropdown = () => {
            // Select all dropdowns (desktop + potentially mobile duplicates)
            const dropdowns = document.querySelectorAll('.custom-dropdown');

            dropdowns.forEach(dropdown => {
                const trigger = dropdown.querySelector('.dropdown-trigger');
                const options = dropdown.querySelector('.dropdown-options');
                const items = dropdown.querySelectorAll('.dropdown-option');

                if (!trigger || !options) return;

                // Toggle Dropdown (use onclick to prevent duplicates)
                trigger.onclick = (e) => {
                    e.stopPropagation();

                    // Close other dropdowns first
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.querySelector('.dropdown-options')?.classList.remove('show');
                            d.querySelector('.dropdown-trigger')?.classList.remove('active');
                        }
                    });

                    options.classList.toggle('show');
                    trigger.classList.toggle('active');
                };

                // Handle Option Click
                items.forEach(item => {
                    item.onclick = (e) => {
                        e.stopPropagation();
                        const lang = item.getAttribute('data-value');
                        this.setLanguage(lang);

                        // Update UI
                        items.forEach(i => i.classList.remove('selected'));
                        item.classList.add('selected');

                        // Update Trigger Text
                        const selectedLangSpan = item.querySelector('span');
                        const triggerSpan = trigger.querySelector('span');
                        if (selectedLangSpan && triggerSpan) {
                            triggerSpan.textContent = selectedLangSpan.textContent;
                        }

                        // Close Dropdown
                        options.classList.remove('show');
                        trigger.classList.remove('active');
                    };

                    // Set initial selection UI
                    if (item.getAttribute('data-value') === this.currentLang) {
                        item.classList.add('selected');
                        const selectedLangSpan = item.querySelector('span');
                        const triggerSpan = trigger.querySelector('span');
                        if (selectedLangSpan && triggerSpan) {
                            triggerSpan.textContent = selectedLangSpan.textContent;
                        }
                    }
                });
            });

            // Close on Outside Click
            document.onclick = (e) => {
                dropdowns.forEach(dropdown => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.querySelector('.dropdown-options')?.classList.remove('show');
                        dropdown.querySelector('.dropdown-trigger')?.classList.remove('active');
                    }
                });
            };
        };

        // Run Init safely regardless of load state
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDropdown);
        } else {
            initDropdown();
        }
    }

    setLanguage(lang) {
        if (!translations[lang]) return;

        this.currentLang = lang;
        localStorage.setItem('usdi_lang', lang);
        document.documentElement.lang = lang;

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // If it's an input/textarea with placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else if (el.hasAttribute('data-hover')) {
                    // Update dynamic button internal text if present
                    const span = el.querySelector('span');
                    if (!span) {
                        el.textContent = translations[lang][key];
                    }
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Special handling for the portal buttons with hover effects
        this.updatePortalButtons(lang);

        // Prompt Chatbot to update if active
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    updatePortalButtons(lang) {
        // Helper to update our specific fancy buttons
        const btnMap = {
            'student_portal_btn': { default: 'student_portal_btn', hover: 'student_portal_hover' },
            'institution_portal_btn': { default: 'institution_portal_btn', hover: 'institution_portal_hover' },
            'verifier_portal_btn': { default: 'verifier_portal_btn', hover: 'verifier_portal_hover' }
        };

        Object.keys(btnMap).forEach(idKey => {
            const btn = document.querySelector(`[data-i18n-btn="${idKey}"]`);
            if (btn) {
                const t = translations[lang];
                const defText = t[btnMap[idKey].default];
                const hovText = t[btnMap[idKey].hover];

                // Update attributes used by inline JS
                btn.setAttribute('data-default', defText);
                btn.setAttribute('data-hover', hovText);

                // Update current visible text (in span)
                const span = btn.querySelector('span');
                if (span) span.textContent = defText;
            }
        });
    }

    translate(key) {
        return translations[this.currentLang][key] || key;
    }

    formatStatus(status) {
        const statusMap = {
            'active': { en: 'Active', ml: 'സജീവ', hi: 'सक्रिय' },
            'graduated': { en: 'Graduated', ml: 'പൂർത്തിയായി', hi: 'उत्तीर्ण' },
            'transferred': { en: 'Transferred', ml: 'മാറ്റം', hi: 'स्थानांतरित' },
            'discontinued': { en: 'Discontinued', ml: 'നിർത്തി', hi: 'बंद' }
        };

        const sLower = status.toLowerCase();
        if (this.currentLang === 'en' || !statusMap[sLower]) {
            return status; // Default English behavior
        }

        // Format: English (Local)
        return `${statusMap[sLower].en} (${statusMap[sLower][this.currentLang]})`;
    }
}

window.langManager = new LanguageManager();
