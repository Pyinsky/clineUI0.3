// Theme Management System for StockArt
class ThemeManager {
    constructor() {
        this.currentTheme = 'system';
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
        this.setupKeyboardShortcuts();
    }

    // Load theme from localStorage or default to system
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('stockart-theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = 'system';
            localStorage.setItem('stockart-theme', 'system');
        }
    }

    // Create theme toggle UI
    createThemeToggle() {
        // Check if already exists
        if (document.querySelector('.theme-toggle-container')) {
            return;
        }

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle-container';
        toggleContainer.innerHTML = `
            <div class="theme-toggle" role="radiogroup" aria-label="Theme selection">
                <button class="theme-option" 
                        data-theme="system" 
                        role="radio" 
                        aria-checked="true"
                        aria-label="System theme">
                    <span>System</span>
                </button>
                <button class="theme-option" 
                        data-theme="light" 
                        role="radio" 
                        aria-checked="false"
                        aria-label="Light theme">
                    <span>Light</span>
                </button>
                <button class="theme-option" 
                        data-theme="dark" 
                        role="radio" 
                        aria-checked="false"
                        aria-label="Dark theme">
                    <span>Dark</span>
                </button>
            </div>
        `;

        document.body.appendChild(toggleContainer);
        this.setupThemeToggleEvents();
        this.updateActiveButton();
    }

    // Setup event listeners for theme toggle
    setupThemeToggleEvents() {
        const themeOptions = document.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.setTheme(theme);
            });

            // Keyboard navigation
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const theme = e.currentTarget.dataset.theme;
                    this.setTheme(theme);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateThemeOptions(e.key === 'ArrowRight');
                }
            });
        });
    }

    // Navigate theme options with keyboard
    navigateThemeOptions(forward) {
        const options = Array.from(document.querySelectorAll('.theme-option'));
        const currentIndex = options.findIndex(option => 
            option.dataset.theme === this.currentTheme
        );
        
        let newIndex;
        if (forward) {
            newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else {
            newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }
        
        const newTheme = options[newIndex].dataset.theme;
        this.setTheme(newTheme);
        options[newIndex].focus();
    }

    // Set and apply theme
    setTheme(theme) {
        if (!['light', 'dark', 'system'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        this.currentTheme = theme;
        localStorage.setItem('stockart-theme', theme);
        this.applyTheme(theme);
        this.updateActiveButton();
        this.announceThemeChange(theme);
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme, resolvedTheme: this.getResolvedTheme() }
        }));
    }

    // Apply theme to document
    applyTheme(theme) {
        // Add transition class for smooth switching
        document.documentElement.classList.add('theme-switching');
        
        // Set theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color for browser UI
        this.updateMetaThemeColor(theme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-switching');
        }, 300);
    }

    // Update browser UI theme color
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        const resolvedTheme = this.getResolvedTheme();
        const color = resolvedTheme === 'dark' ? '#2a2a2a' : '#ffffff';
        metaThemeColor.content = color;
    }

    // Get resolved theme (system -> actual theme)
    getResolvedTheme() {
        if (this.currentTheme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    // Update active button state
    updateActiveButton() {
        const themeOptions = document.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            const isActive = option.dataset.theme === this.currentTheme;
            option.classList.toggle('active', isActive);
            option.setAttribute('aria-checked', isActive.toString());
        });
    }

    // Listen for system theme changes
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === 'system') {
                this.updateMetaThemeColor('system');
                this.announceThemeChange('system');
                
                // Trigger custom event
                window.dispatchEvent(new CustomEvent('themeChanged', { 
                    detail: { theme: 'system', resolvedTheme: this.getResolvedTheme() }
                }));
            }
        });
    }

    // Keyboard shortcuts for theme switching
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.cycleTheme();
            }
            
            // Ctrl/Cmd + Shift + L for light theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.setTheme('light');
            }
            
            // Ctrl/Cmd + Shift + D for dark theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.setTheme('dark');
            }
        });
    }

    // Cycle through themes
    cycleTheme() {
        const themes = ['system', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    // Announce theme change for accessibility
    announceThemeChange(theme) {
        const resolvedTheme = this.getResolvedTheme();
        let message;
        
        if (theme === 'system') {
            message = `System theme activated. Currently using ${resolvedTheme} mode.`;
        } else {
            message = `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated.`;
        }

        // Use existing announce function if available, otherwise create one
        if (window.announce) {
            window.announce(message);
        } else {
            this.announce(message);
        }
    }

    // Fallback announce function
    announce(message) {
        let announcer = document.getElementById('theme-announcer');
        
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'theme-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
        }

        announcer.textContent = message;
        
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Get resolved theme (useful for components that need actual theme)
    getActualTheme() {
        return this.getResolvedTheme();
    }

    // Force theme update (useful for components that need to react to theme changes)
    forceUpdate() {
        this.applyTheme(this.currentTheme);
        this.updateActiveButton();
    }

    // Destroy theme manager
    destroy() {
        const toggleContainer = document.querySelector('.theme-toggle-container');
        if (toggleContainer) {
            toggleContainer.remove();
        }
        
        const announcer = document.getElementById('theme-announcer');
        if (announcer) {
            announcer.remove();
        }
    }
}

// Auto-initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already done
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
});

// Early theme application to prevent flash
(function() {
    const savedTheme = localStorage.getItem('stockart-theme') || 'system';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set initial meta theme color
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    
    if (savedTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        metaThemeColor.content = isDark ? '#2a2a2a' : '#ffffff';
    } else {
        metaThemeColor.content = savedTheme === 'dark' ? '#2a2a2a' : '#ffffff';
    }
    
    document.head.appendChild(metaThemeColor);
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
