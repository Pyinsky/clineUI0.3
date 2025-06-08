// Sign-In Modal System for StockArt
class SignInModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        // Create modal overlay
        this.modal = document.createElement('div');
        this.modal.className = 'signin-modal-overlay';
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-labelledby', 'signin-modal-title');
        
        this.modal.innerHTML = `
            <div class="signin-modal-backdrop"></div>
            <div class="signin-modal-container">
                <div class="signin-modal-content">
                    <button class="signin-modal-close" aria-label="Close sign-in modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                    
                    <div class="signin-modal-header">
                        <div class="signin-logo">
                            <svg class="logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 32L16 20L24 26L32 8" stroke="url(#signinGradient1)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="8" cy="32" r="2" fill="url(#signinGradient1)"/>
                                <circle cx="16" cy="20" r="2" fill="url(#signinGradient1)"/>
                                <circle cx="24" cy="26" r="2" fill="url(#signinGradient1)"/>
                                <circle cx="32" cy="8" r="2" fill="url(#signinGradient1)"/>
                                <rect x="4" y="4" width="32" height="32" rx="6" stroke="url(#signinGradient2)" stroke-width="1.5" fill="none"/>
                                <defs>
                                    <linearGradient id="signinGradient1" x1="8" y1="32" x2="32" y2="8" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#4a9eff"/>
                                        <stop offset="100%" stop-color="#00d4aa"/>
                                    </linearGradient>
                                    <linearGradient id="signinGradient2" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#4a9eff" stop-opacity="0.3"/>
                                        <stop offset="100%" stop-color="#00d4aa" stop-opacity="0.3"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h2 id="signin-modal-title" class="signin-title">Welcome to StockArt</h2>
                        <p class="signin-subtitle">Sign in to access AI-powered stock analysis</p>
                    </div>

                    <div class="signin-options">
                        <button class="signin-option apple-signin" aria-label="Continue with Apple">
                            <svg class="signin-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            <span>Continue with Apple</span>
                        </button>

                        <button class="signin-option google-signin" aria-label="Continue with Google">
                            <svg class="signin-icon" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <button class="signin-option email-signin" aria-label="Continue with email">
                            <svg class="signin-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span>Continue with email</span>
                        </button>
                    </div>

                    <div class="signin-footer">
                        <p class="signin-terms">
                            By continuing, you agree to our 
                            <a href="#" class="signin-link">Terms of Service</a> and 
                            <a href="#" class="signin-link">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.setupModalEvents();
    }

    setupEventListeners() {
        // Listen for sign-in button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sign-in-btn, .cta-button')) {
                const button = e.target.closest('.sign-in-btn, .cta-button');
                if (button.textContent.toLowerCase().includes('sign')) {
                    e.preventDefault();
                    this.open();
                }
            }
        });

        // Listen for escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Listen for auth state changes
        window.addEventListener('userSignedIn', () => {
            this.close();
        });
    }

    setupModalEvents() {
        if (!this.modal) return;

        const closeBtn = this.modal.querySelector('.signin-modal-close');
        const backdrop = this.modal.querySelector('.signin-modal-backdrop');
        const appleBtn = this.modal.querySelector('.apple-signin');
        const googleBtn = this.modal.querySelector('.google-signin');
        const emailBtn = this.modal.querySelector('.email-signin');

        // Close modal events
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => this.close());
        }

        // Sign-in option events
        if (appleBtn) {
            appleBtn.addEventListener('click', () => this.handleAppleSignIn());
        }

        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }

        if (emailBtn) {
            emailBtn.addEventListener('click', () => this.handleEmailSignIn());
        }

        // Prevent modal content clicks from closing modal
        const modalContent = this.modal.querySelector('.signin-modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    open() {
        if (!this.modal || this.isOpen) return;

        this.isOpen = true;
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';

        // Focus management
        setTimeout(() => {
            const firstFocusable = this.modal.querySelector('.signin-modal-close');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);

        // Announce to screen readers
        this.announce('Sign-in modal opened');
    }

    close() {
        if (!this.modal || !this.isOpen) return;

        this.isOpen = false;
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Return focus to trigger element
        const signInBtn = document.querySelector('.sign-in-btn');
        if (signInBtn) {
            signInBtn.focus();
        }

        // Announce to screen readers
        this.announce('Sign-in modal closed');
    }

    handleAppleSignIn() {
        // Apple Sign-In is not implemented yet
        this.showComingSoon('Apple Sign-In');
    }

    handleGoogleSignIn() {
        // Use existing Google Auth
        if (window.googleAuth) {
            this.close();
            setTimeout(() => {
                window.googleAuth.signIn();
            }, 300);
        } else {
            this.showError('Google Sign-In is not available');
        }
    }

    handleEmailSignIn() {
        // Email sign-in is not implemented yet
        this.showComingSoon('Email Sign-In');
    }

    showComingSoon(feature) {
        const message = `${feature} coming soon! For now, please use Google Sign-In.`;
        this.showNotification(message, 'info');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `signin-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;

        // Add to modal
        const modalContent = this.modal.querySelector('.signin-modal-content');
        if (modalContent) {
            modalContent.appendChild(notification);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);

            // Close button event
            const closeBtn = notification.querySelector('.notification-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    notification.remove();
                });
            }
        }
    }

    getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }

    announce(message) {
        if (window.announce) {
            window.announce(message);
        } else {
            // Create temporary announcer
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.textContent = message;
            document.body.appendChild(announcer);
            
            setTimeout(() => {
                if (announcer.parentNode) {
                    document.body.removeChild(announcer);
                }
            }, 1000);
        }
    }

    // Public methods
    isModalOpen() {
        return this.isOpen;
    }

    destroy() {
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        this.modal = null;
        this.isOpen = false;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (!window.signInModal) {
        window.signInModal = new SignInModal();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignInModal;
}
