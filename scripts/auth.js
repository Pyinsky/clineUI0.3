// Google Authentication System for StockArt
class GoogleAuth {
    constructor() {
        this.user = null;
        this.isSignedIn = false;
        this.clientId = '1091453999094-1el2tk61eafigsjetho5hmhgm87qs9lr.apps.googleusercontent.com';
        this.init();
    }

    async init() {
        try {
            await this.loadGoogleAPI();
            await this.initializeGoogleAuth();
            this.setupUI();
            this.checkExistingSession();
        } catch (error) {
            console.error('Failed to initialize Google Auth:', error);
            this.showFallbackSignIn();
        }
    }

    // Load Google Identity Services API
    async loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.google && window.google.accounts) {
                resolve();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                // Wait a bit for Google API to be ready
                setTimeout(() => {
                    if (window.google && window.google.accounts) {
                        resolve();
                    } else {
                        reject(new Error('Google API not ready'));
                    }
                }, 100);
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google API'));
            };

            document.head.appendChild(script);
        });
    }

    // Initialize Google Authentication
    async initializeGoogleAuth() {
        if (!window.google || !window.google.accounts) {
            throw new Error('Google API not available');
        }

        // Initialize Google ID
        google.accounts.id.initialize({
            client_id: this.clientId,
            callback: (response) => this.handleCredentialResponse(response),
            auto_select: false,
            cancel_on_tap_outside: true,
        });
    }

    // Handle Google credential response
    handleCredentialResponse(response) {
        try {
            // Decode JWT token
            const userInfo = this.parseJWT(response.credential);
            this.setUser(userInfo);
            this.updateUI();
            this.announceSignIn(userInfo.name);
            
            // Store session
            this.storeSession(response.credential);
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('userSignedIn', { 
                detail: { user: userInfo }
            }));
            
        } catch (error) {
            console.error('Failed to handle credential response:', error);
            this.showError('Sign-in failed. Please try again.');
        }
    }

    // Parse JWT token
    parseJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid token format');
        }
    }

    // Set user data
    setUser(userInfo) {
        this.user = {
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            given_name: userInfo.given_name,
            family_name: userInfo.family_name
        };
        this.isSignedIn = true;
    }

    // Setup UI elements
    setupUI() {
        this.updateSignInButtons();
        this.createUserProfile();
    }

    // Update sign-in buttons
    updateSignInButtons() {
        const signInBtns = document.querySelectorAll('.sign-in-btn, .cta-button');
        
        signInBtns.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('sign')) {
                this.convertToGoogleSignIn(btn);
            }
        });
    }

    // Convert regular button to Google Sign-In
    convertToGoogleSignIn(button) {
        // Store original content for fallback
        const originalContent = button.innerHTML;
        
        // Update button for Google Sign-In
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" style="margin-right: 8px;">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
        `;
        
        button.setAttribute('aria-label', 'Sign in with Google');
        button.classList.add('google-signin-btn');
        
        // Add click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.signIn();
        });
    }

    // Create user profile UI
    createUserProfile() {
        // Remove existing profile if any
        const existingProfile = document.querySelector('.user-profile-container');
        if (existingProfile) {
            existingProfile.remove();
        }

        // Create profile container
        const profileContainer = document.createElement('div');
        profileContainer.className = 'user-profile-container';
        profileContainer.style.display = 'none'; // Hidden initially
        
        profileContainer.innerHTML = `
            <div class="user-profile-dropdown">
                <button class="user-profile-btn" aria-label="User menu" aria-expanded="false">
                    <img class="user-avatar" src="" alt="User avatar">
                    <span class="user-name"></span>
                    <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </button>
                <div class="user-dropdown-menu" aria-hidden="true">
                    <div class="user-info">
                        <img class="user-avatar-large" src="" alt="User avatar">
                        <div class="user-details">
                            <div class="user-name-large"></div>
                            <div class="user-email"></div>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" id="signOutBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        `;

        // Insert after user section in sidebar
        const userSection = document.querySelector('.user-section');
        if (userSection) {
            userSection.appendChild(profileContainer);
        }

        this.setupProfileEvents();
    }

    // Setup profile dropdown events
    setupProfileEvents() {
        const profileBtn = document.querySelector('.user-profile-btn');
        const dropdownMenu = document.querySelector('.user-dropdown-menu');
        const signOutBtn = document.getElementById('signOutBtn');

        if (profileBtn && dropdownMenu) {
            // Toggle dropdown
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
                this.toggleProfileDropdown(!isExpanded);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    this.toggleProfileDropdown(false);
                }
            });

            // Keyboard navigation
            profileBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
                    this.toggleProfileDropdown(!isExpanded);
                }
            });
        }

        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                this.signOut();
            });
        }
    }

    // Toggle profile dropdown
    toggleProfileDropdown(show) {
        const profileBtn = document.querySelector('.user-profile-btn');
        const dropdownMenu = document.querySelector('.user-dropdown-menu');

        if (profileBtn && dropdownMenu) {
            profileBtn.setAttribute('aria-expanded', show.toString());
            dropdownMenu.setAttribute('aria-hidden', (!show).toString());
            dropdownMenu.style.display = show ? 'block' : 'none';
            
            if (show) {
                dropdownMenu.style.animation = 'fadeIn 0.2s ease';
            }
        }
    }

    // Sign in with Google
    signIn() {
        try {
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Fallback to renderButton if prompt fails
                    this.renderSignInButton();
                }
            });
        } catch (error) {
            console.error('Sign-in failed:', error);
            this.showError('Sign-in is currently unavailable.');
        }
    }

    // Render Google Sign-In button
    renderSignInButton() {
        const container = document.createElement('div');
        container.className = 'google-signin-container';
        document.body.appendChild(container);

        google.accounts.id.renderButton(container, {
            theme: window.themeManager?.getActualTheme() === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
        });

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 30000);
    }

    // Sign out
    async signOut() {
        try {
            // Clear local session
            this.clearSession();
            
            // Reset user state
            this.user = null;
            this.isSignedIn = false;
            
            // Update UI
            this.updateUI();
            
            // Announce sign out
            this.announceSignOut();
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('userSignedOut'));
            
        } catch (error) {
            console.error('Sign-out failed:', error);
            this.showError('Sign-out failed. Please try again.');
        }
    }

    // Update UI based on authentication state
    updateUI() {
        if (this.isSignedIn && this.user) {
            this.showUserProfile();
            this.hideSignInButtons();
        } else {
            this.hideUserProfile();
            this.showSignInButtons();
        }
    }

    // Show user profile
    showUserProfile() {
        const profileContainer = document.querySelector('.user-profile-container');
        const userAvatar = document.querySelector('.user-avatar');
        const userAvatarLarge = document.querySelector('.user-avatar-large');
        const userName = document.querySelector('.user-name');
        const userNameLarge = document.querySelector('.user-name-large');
        const userEmail = document.querySelector('.user-email');

        if (profileContainer) {
            profileContainer.style.display = 'block';
        }

        if (userAvatar) {
            userAvatar.src = this.user.picture;
            userAvatar.alt = `${this.user.name}'s avatar`;
        }

        if (userAvatarLarge) {
            userAvatarLarge.src = this.user.picture;
            userAvatarLarge.alt = `${this.user.name}'s avatar`;
        }

        if (userName) {
            userName.textContent = this.user.given_name || this.user.name;
        }

        if (userNameLarge) {
            userNameLarge.textContent = this.user.name;
        }

        if (userEmail) {
            userEmail.textContent = this.user.email;
        }
    }

    // Hide user profile
    hideUserProfile() {
        const profileContainer = document.querySelector('.user-profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
    }

    // Show sign-in buttons
    showSignInButtons() {
        const signInBtns = document.querySelectorAll('.google-signin-btn');
        signInBtns.forEach(btn => {
            btn.style.display = 'flex';
        });
    }

    // Hide sign-in buttons
    hideSignInButtons() {
        const signInBtns = document.querySelectorAll('.google-signin-btn');
        signInBtns.forEach(btn => {
            btn.style.display = 'none';
        });
    }

    // Store session
    storeSession(credential) {
        try {
            const sessionData = {
                credential,
                user: this.user,
                timestamp: Date.now()
            };
            localStorage.setItem('stockart-session', JSON.stringify(sessionData));
        } catch (error) {
            console.error('Failed to store session:', error);
        }
    }

    // Clear session
    clearSession() {
        localStorage.removeItem('stockart-session');
    }

    // Check existing session
    checkExistingSession() {
        try {
            const sessionData = localStorage.getItem('stockart-session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                
                // Check if session is still valid (24 hours)
                const isValid = Date.now() - session.timestamp < 24 * 60 * 60 * 1000;
                
                if (isValid && session.user) {
                    this.user = session.user;
                    this.isSignedIn = true;
                    this.updateUI();
                } else {
                    this.clearSession();
                }
            }
        } catch (error) {
            console.error('Failed to check existing session:', error);
            this.clearSession();
        }
    }

    // Show fallback sign-in
    showFallbackSignIn() {
        console.warn('Google Auth not available, showing fallback');
        const signInBtns = document.querySelectorAll('.sign-in-btn, .cta-button');
        
        signInBtns.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('sign')) {
                btn.addEventListener('click', () => {
                    this.showError('Google Sign-In is currently unavailable. Please try again later.');
                });
            }
        });
    }

    // Show error message
    showError(message) {
        if (window.announce) {
            window.announce(message);
        } else {
            alert(message);
        }
    }

    // Announce sign in
    announceSignIn(userName) {
        const message = `Welcome, ${userName}! You are now signed in.`;
        if (window.announce) {
            window.announce(message);
        }
    }

    // Announce sign out
    announceSignOut() {
        const message = 'You have been signed out.';
        if (window.announce) {
            window.announce(message);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Check if user is signed in
    isUserSignedIn() {
        return this.isSignedIn;
    }

    // Get user's preferred name
    getUserDisplayName() {
        if (!this.user) return null;
        return this.user.given_name || this.user.name;
    }
}

// Auto-initialize Google Auth when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already done
    if (!window.googleAuth) {
        window.googleAuth = new GoogleAuth();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleAuth;
}
