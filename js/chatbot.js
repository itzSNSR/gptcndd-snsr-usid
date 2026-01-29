// USDI Help Chatbot Logic (Multi-Language Support)

class Chatbot {
    constructor() {
        this.isOpen = false;
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // No more renderWidget() - we use the static HTML
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

    attachEventListeners() {
        this.container = document.getElementById('chatbot-container');
        this.messagesContainer = document.getElementById('chatbot-body');
        this.toggleBtn = document.querySelector('.generate-button');
        this.closeBtn = document.querySelector('.close-chat');

        // Manual Send Button (if present)
        const sendBtn = document.querySelector('.chatbot-input button');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                const input = document.getElementById('chat-input');
                if (input && input.value.trim()) {
                    const userInput = input.value.trim();

                    // Secret dev portal command
                    if (userInput === 'ds3t49jmzh') {
                        this.addMessage(userInput, 'user');
                        input.value = '';
                        setTimeout(() => {
                            this.addMessage('🔐 Developer access granted. Redirecting...', 'bot');
                        }, 500);
                        setTimeout(() => {
                            window.location.href = '../dev/';
                        }, 1500);
                        return;
                    }

                    this.addMessage(userInput, 'user');
                    input.value = '';
                    // Simulate bot response for custom input
                    setTimeout(() => {
                        this.addMessage("I'm a demo bot! Please use the options above.", 'bot');
                    }, 1000);
                }
            });
        }

        // We expose toggleChatbot globally because the HTML onclick uses it
        window.toggleChatbot = () => this.toggleChat();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('active', this.isOpen);

        // Optional: animate button out/in
        // this.toggleBtn.classList.toggle('hidden', this.isOpen);

        if (this.isOpen && this.messagesContainer.querySelectorAll('.message').length <= 1) {
            // First open (only initial hello message exists), start logic flow
            // Clear the static hello
            this.messagesContainer.innerHTML = '';
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
        // Use new CSS classes: .message .bot or .message .user
        messageDiv.className = `message ${sender}`;

        // Process markdown-like bold syntax
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

        messageDiv.innerHTML = formattedText;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addOptions(options) {
        // Create a container for options, styled as bot message or separate
        // For premium UI, let's make them separate bubbles or a button group
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'message bot options-group';
        optionsDiv.style.background = 'transparent';
        optionsDiv.style.boxShadow = 'none';
        optionsDiv.style.padding = '0';
        optionsDiv.style.display = 'flex';
        optionsDiv.style.flexWrap = 'wrap';
        optionsDiv.style.gap = '8px';

        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-primary'; // Use existing button classes
            btn.textContent = opt.text;
            btn.style.borderRadius = '20px';
            btn.style.fontSize = '0.85rem';

            btn.addEventListener('click', () => {
                this.addMessage(opt.text, 'user');

                if (opt.action === 'navigate') {
                    this.addMessage("Redirecting... 🚀", 'bot');
                    setTimeout(() => window.location.href = "../" + opt.url, 1000); // adjust path relative
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

// Initialize
window.usdiChatbot = new Chatbot();
