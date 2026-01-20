// USDI Help Chatbot Logic (Multi-Language Support)

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.renderWidget();
        this.attachEventListeners();

        // Listen for language changes to reset/update chat
        window.addEventListener('languageChanged', (e) => {
            this.resetChat();
        });
    }

    // Dynamic Data Getter based on current language
    getChatData() {
        const t = (key) => window.langManager ? window.langManager.translate(key) : key;

        return {
            start: {
                message: t('chat_welcome'),
                options: [
                    { text: t('chat_student_login'), next: "student_login" },
                    { text: t('chat_institution'), next: "institution_help" },
                    { text: t('chat_verify'), next: "verification_help" },
                    { text: t('chat_edit'), next: "edit_details" }
                ]
            },
            student_login: {
                message: t('chat_ans_student'),
                options: [
                    { text: t('chat_opt_login_go'), action: "navigate", url: "student/login.html" },
                    { text: t('chat_opt_otp_issue'), next: "otp_issue" },
                    { text: t('chat_opt_back'), next: "start" }
                ]
            },
            institution_help: {
                message: t('chat_ans_institution'),
                options: [
                    { text: t('institution_portal_btn'), action: "navigate", url: "institution/login.html" },
                    { text: t('inst_feat_1'), next: "add_student_help" }, // Reusing feature text "Add New Students"
                    { text: t('chat_opt_back'), next: "start" }
                ]
            },
            verification_help: {
                message: t('chat_ans_verify'),
                options: [
                    { text: t('verifier_portal_btn'), action: "navigate", url: "verifier/verify.html" },
                    { text: "USN?", next: "usn_help" },
                    { text: t('chat_opt_back'), next: "start" }
                ]
            },
            edit_details: {
                message: t('chat_ans_edit'),
                options: [
                    { text: t('chat_student_login'), next: "student_login" }, // Redirect to login help
                    { text: t('chat_opt_back'), next: "start" }
                ]
            },
            otp_issue: {
                message: t('chat_ans_otp'),
                options: [
                    { text: t('chat_opt_back'), next: "student_login" },
                    { text: t('chat_toggle'), next: "start" }
                ]
            },
            add_student_help: {
                // We don't have a specific translation for this one yet, fallback or simplified
                message: t('institution_portal_desc'),
                options: [
                    { text: t('chat_opt_back'), next: "institution_help" },
                    { text: t('chat_toggle'), next: "start" }
                ]
            },
            usn_help: {
                message: t('chat_ans_usn'),
                options: [
                    { text: t('chat_opt_back'), next: "verification_help" },
                    { text: t('chat_toggle'), next: "start" }
                ]
            }
        };
    }

    renderWidget() {
        const toggleText = window.langManager ? window.langManager.translate('chat_toggle') : 'Help';

        const widgetHTML = `
            <div id="usdi-chatbot" class="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <span class="bot-avatar">🤖</span>
                        <div>
                            <h4>USDI Assistant</h4>
                            <span class="status-dot"></span> Online
                        </div>
                    </div>
                    <button id="chatbot-close" class="chatbot-close">&times;</button>
                </div>
                <div id="chatbot-messages" class="chatbot-messages">
                    <!-- Messages will appear here -->
                </div>
                <div class="chatbot-input-area" style="display:none;">
                    <input type="text" placeholder="Select an option above..." disabled>
                </div>
            </div>
            <button id="chatbot-toggle" class="chatbot-toggle-btn">
                <span class="toggle-icon">💬</span>
                <span class="toggle-text" data-i18n="chat_toggle">${toggleText}</span>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        this.container = document.getElementById('usdi-chatbot');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.closeBtn = document.getElementById('chatbot-close');

        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('active', this.isOpen);
        this.toggleBtn.classList.toggle('hidden', this.isOpen);

        if (this.isOpen && this.messagesContainer.children.length === 0) {
            // First open, show welcome message
            this.showNode('start');
        }
    }

    resetChat() {
        // Clear messages
        this.messagesContainer.innerHTML = '';
        // If open, restart
        if (this.isOpen) {
            this.showNode('start');
        }
        // Update toggle button text
        const toggleText = document.querySelector('#chatbot-toggle .toggle-text');
        if (toggleText && window.langManager) {
            toggleText.textContent = window.langManager.translate('chat_toggle');
        }
    }

    showNode(nodeId) {
        const data = this.getChatData()[nodeId];
        if (!data) return;

        // Show bot message
        this.addMessage(data.message, 'bot');

        // Show options
        if (data.options) {
            this.addOptions(data.options);
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message animate-fadeInUp`;

        // Process markdown-like bold syntax
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

        messageDiv.innerHTML = formattedText;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chat-options animate-fadeInUp';

        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.textContent = opt.text;
            btn.style.animationDelay = `${index * 0.1}s`;

            btn.addEventListener('click', () => {
                this.addMessage(opt.text, 'user');

                if (opt.action === 'navigate') {
                    this.addMessage("Redirecting... 🚀", 'bot');
                    setTimeout(() => window.location.href = opt.url, 1000);
                } else if (opt.next) {
                    setTimeout(() => this.showNode(opt.next), 500);
                }
            });
            optionsDiv.appendChild(btn);
        });

        this.messagesContainer.appendChild(optionsDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize Chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if chatbot already exists to prevent duplicates (hot reload safety)
    if (!document.getElementById('usdi-chatbot')) {
        window.usdiChatbot = new Chatbot();
    }
});
