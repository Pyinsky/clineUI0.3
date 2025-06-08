// Mobile-Specific Functionality for StockArt (iPhone Optimized)
class MobileManager {
    constructor() {
        this.isMobile = window.innerWidth <= 430;
        this.isIPhone = /iPhone|iPad|iPod/.test(navigator.userAgent);
        this.sidebarOpen = false;
        this.init();
    }

    init() {
        if (this.isMobile) {
            this.createMobileHeader();
            this.createMobileOverlay();
            this.setupMobileNavigation();
            this.setupTouchHandlers();
            this.setupViewportFixes();
            this.setupResizeHandler();
            this.optimizeForIPhone();
        }
    }

    // Create mobile header with hamburger menu
    createMobileHeader() {
        // Check if already exists
        if (document.querySelector('.mobile-header')) {
            return;
        }

        const header = document.createElement('header');
        header.className = 'mobile-header';
        header.innerHTML = `
            <button class="mobile-menu-btn" aria-label="Open menu" aria-expanded="false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
            <div class="mobile-logo">
                <svg class="logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 32L16 20L24 26L32 8" stroke="url(#mobileGradient1)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="8" cy="32" r="2" fill="url(#mobileGradient1)"/>
                    <circle cx="16" cy="20" r="2" fill="url(#mobileGradient1)"/>
                    <circle cx="24" cy="26" r="2" fill="url(#mobileGradient1)"/>
                    <circle cx="32" cy="8" r="2" fill="url(#mobileGradient1)"/>
                    <rect x="4" y="4" width="32" height="32" rx="6" stroke="url(#mobileGradient2)" stroke-width="1.5" fill="none"/>
                    <defs>
                        <linearGradient id="mobileGradient1" x1="8" y1="32" x2="32" y2="8" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stop-color="#4a9eff"/>
                            <stop offset="100%" stop-color="#00d4aa"/>
                        </linearGradient>
                        <linearGradient id="mobileGradient2" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stop-color="#4a9eff" stop-opacity="0.3"/>
                            <stop offset="100%" stop-color="#00d4aa" stop-opacity="0.3"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span class="logo-text">StockArt</span>
            </div>
        `;

        document.body.insertBefore(header, document.body.firstChild);
        this.setupMobileHeaderEvents();
    }

    // Create mobile overlay for sidebar
    createMobileOverlay() {
        // Check if already exists
        if (document.querySelector('.mobile-overlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);

        // Add click handler to close sidebar
        overlay.addEventListener('click', () => {
            this.closeSidebar();
        });
    }

    // Setup mobile header events
    setupMobileHeaderEvents() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });

            // Keyboard support
            menuBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleSidebar();
                }
            });
        }
    }

    // Setup mobile navigation
    setupMobileNavigation() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            // Ensure sidebar starts hidden on mobile
            sidebar.classList.remove('mobile-open');
            this.sidebarOpen = false;
        }
    }

    // Toggle sidebar
    toggleSidebar() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    // Open sidebar
    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.mobile-overlay');
        const menuBtn = document.querySelector('.mobile-menu-btn');

        if (sidebar) {
            sidebar.classList.add('mobile-open');
            this.sidebarOpen = true;

            // Update overlay
            if (overlay) {
                overlay.classList.add('active');
                overlay.setAttribute('aria-hidden', 'false');
            }

            // Update menu button
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'true');
                menuBtn.setAttribute('aria-label', 'Close menu');
                
                // Update icon to X
                menuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                `;
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Focus first interactive element in sidebar
            const firstFocusable = sidebar.querySelector('button, a, input, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }

            // Announce to screen readers
            this.announce('Menu opened');
        }
    }

    // Close sidebar
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.mobile-overlay');
        const menuBtn = document.querySelector('.mobile-menu-btn');

        if (sidebar) {
            sidebar.classList.remove('mobile-open');
            this.sidebarOpen = false;

            // Update overlay
            if (overlay) {
                overlay.classList.remove('active');
                overlay.setAttribute('aria-hidden', 'true');
            }

            // Update menu button
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.setAttribute('aria-label', 'Open menu');
                
                // Update icon back to hamburger
                menuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                `;
            }

            // Restore body scroll
            document.body.style.overflow = '';

            // Return focus to menu button
            if (menuBtn) {
                menuBtn.focus();
            }

            // Announce to screen readers
            this.announce('Menu closed');
        }
    }

    // Setup touch handlers
    setupTouchHandlers() {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        // Swipe to open/close sidebar
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', () => {
            const deltaX = currentX - startX;
            const deltaY = Math.abs(currentY - startY);
            
            // Only consider horizontal swipes
            if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 50) {
                // Swipe right from left edge to open
                if (deltaX > 0 && startX < 50 && !this.sidebarOpen) {
                    this.openSidebar();
                }
                // Swipe left to close
                else if (deltaX < -50 && this.sidebarOpen) {
                    this.closeSidebar();
                }
            }
        }, { passive: true });

        // Enhanced touch feedback for buttons
        this.setupTouchFeedback();
    }

    // Setup touch feedback
    setupTouchFeedback() {
        const touchTargets = document.querySelectorAll('button, .nav-item, .search-option, .tool-btn');
        
        touchTargets.forEach(target => {
            target.addEventListener('touchstart', () => {
                target.style.transform = 'scale(0.96)';
                target.style.transition = 'transform 0.1s ease';
            }, { passive: true });

            target.addEventListener('touchend', () => {
                setTimeout(() => {
                    target.style.transform = '';
                    target.style.transition = '';
                }, 150);
            }, { passive: true });

            target.addEventListener('touchcancel', () => {
                target.style.transform = '';
                target.style.transition = '';
            }, { passive: true });
        });
    }

    // Setup viewport fixes for iPhone
    setupViewportFixes() {
        if (this.isIPhone) {
            // Fix for iOS Safari viewport height
            const setVH = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };

            setVH();
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', () => {
                setTimeout(setVH, 100);
            });

            // Prevent zoom on input focus
            const preventZoom = () => {
                const inputs = document.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                        input.style.fontSize = '16px';
                    }
                });
            };

            preventZoom();
            
            // Prevent pinch zoom
            document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });

            // Handle safe area insets
            this.handleSafeAreaInsets();
        }
    }

    // Handle iPhone safe area insets
    handleSafeAreaInsets() {
        // Add CSS custom properties for safe areas
        const updateSafeArea = () => {
            const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)');
            const safeAreaBottom = getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)');
            
            if (safeAreaTop) {
                document.documentElement.style.setProperty('--safe-area-top', safeAreaTop);
            }
            if (safeAreaBottom) {
                document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom);
            }
        };

        updateSafeArea();
        window.addEventListener('orientationchange', () => {
            setTimeout(updateSafeArea, 100);
        });
    }

    // Setup resize handler
    setupResizeHandler() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 430;
                
                // If switching between mobile/desktop
                if (wasMobile !== this.isMobile) {
                    if (this.isMobile) {
                        this.enableMobileMode();
                    } else {
                        this.disableMobileMode();
                    }
                }
            }, 100);
        });
    }

    // Enable mobile mode
    enableMobileMode() {
        this.createMobileHeader();
        this.createMobileOverlay();
        this.setupMobileNavigation();
        this.closeSidebar(); // Ensure sidebar is closed
    }

    // Disable mobile mode
    disableMobileMode() {
        // Remove mobile header
        const mobileHeader = document.querySelector('.mobile-header');
        if (mobileHeader) {
            mobileHeader.remove();
        }

        // Remove mobile overlay
        const mobileOverlay = document.querySelector('.mobile-overlay');
        if (mobileOverlay) {
            mobileOverlay.remove();
        }

        // Reset sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }

        // Restore body scroll
        document.body.style.overflow = '';
        
        this.sidebarOpen = false;
    }

    // iPhone-specific optimizations
    optimizeForIPhone() {
        if (!this.isIPhone) return;

        // Optimize scroll performance
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Optimize animations for iPhone
        const preferredReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (preferredReducedMotion) {
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }

        // Handle iPhone notch/Dynamic Island
        this.handleiPhoneNotch();
        
        // Optimize battery usage
        this.optimizeBatteryUsage();
    }

    // Handle iPhone notch/Dynamic Island
    handleiPhoneNotch() {
        // Check if device has notch/Dynamic Island
        const hasNotch = CSS.supports('padding: max(0px)') && 
                        (window.screen.height >= 812 && window.screen.width >= 375);
        
        if (hasNotch) {
            document.documentElement.classList.add('has-notch');
        }
    }

    // Optimize for battery usage
    optimizeBatteryUsage() {
        // Reduce animations when battery is low
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const updateAnimations = () => {
                    if (battery.level < 0.2) {
                        document.documentElement.classList.add('low-battery');
                    } else {
                        document.documentElement.classList.remove('low-battery');
                    }
                };

                updateAnimations();
                battery.addEventListener('levelchange', updateAnimations);
            });
        }
    }

    // Close sidebar when nav item is clicked
    handleNavItemClick() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (this.isMobile && this.sidebarOpen) {
                    setTimeout(() => this.closeSidebar(), 200);
                }
            });
        });
    }

    // Announce for accessibility
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
                document.body.removeChild(announcer);
            }, 1000);
        }
    }

    // Public methods
    isMobileDevice() {
        return this.isMobile;
    }

    isSidebarOpen() {
        return this.sidebarOpen;
    }

    // Destroy mobile manager
    destroy() {
        this.disableMobileMode();
    }
}

// Auto-initialize mobile manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already done
    if (!window.mobileManager) {
        window.mobileManager = new MobileManager();
    }
});

// Additional CSS for mobile-specific elements
const mobileDynamicStyles = `
<style>
/* User profile dropdown styles */
.user-profile-container {
    margin-top: var(--spacing-lg);
}

.user-profile-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-md);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--transition-base);
}

.user-profile-btn:hover {
    background: var(--hover-bg);
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.user-name {
    flex: 1;
    text-align: left;
    font-weight: 500;
}

.dropdown-arrow {
    transition: transform var(--transition-base);
}

.user-profile-btn[aria-expanded="true"] .dropdown-arrow {
    transform: rotate(180deg);
}

.user-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--tertiary-dark);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    margin-top: var(--spacing-sm);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    display: none;
}

.user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
}

.user-avatar-large {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}

.user-details {
    flex: 1;
}

.user-name-large {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.user-email {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.dropdown-divider {
    height: 1px;
    background: var(--border-color);
    margin: var(--spacing-md) 0;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--transition-base);
}

.dropdown-item:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

/* Low battery mode */
.low-battery * {
    animation: none !important;
    transition: none !important;
}

.low-battery .floating-particles {
    display: none;
}

/* iPhone notch support */
.has-notch .mobile-header {
    padding-top: max(env(safe-area-inset-top), 20px);
}

.has-notch .theme-toggle-container {
    top: max(env(safe-area-inset-top), 15px);
}

/* Fade in animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Custom scrollbar for mobile */
@media (max-width: 430px) {
    ::-webkit-scrollbar {
        width: 3px;
    }
    
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 2px;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', mobileDynamicStyles);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileManager;
}
