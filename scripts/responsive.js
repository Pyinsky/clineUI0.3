// scripts/responsive.js - Handles dynamic responsive adjustments

class ResponsiveController {
    constructor(sidebarElement) {
        this.sidebar = sidebarElement;
        this.mobileToggle = null; // Will be created
        this.isMobileSidebarOpen = false;
        this.desktopBreakpoint = 768; // Matches CSS
    }

    init() {
        this.createMobileToggle();
        this.addEventListeners();
        this.handleResize(); // Initial check
        console.log('ResponsiveController Initialized');
    }

    createMobileToggle() {
        // Check if a toggle already exists to prevent duplicates if re-initialized
        const existingToggle = document.getElementById('mobileSidebarToggle');
        if (existingToggle) {
            this.mobileToggle = existingToggle;
            return;
        }

        this.mobileToggle = document.createElement('button');
        this.mobileToggle.id = 'mobileSidebarToggle';
        this.mobileToggle.className = 'mobile-sidebar-toggle'; // Style in responsive.css
        this.mobileToggle.setAttribute('aria-label', 'Toggle sidebar');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.mobileToggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        document.body.appendChild(this.mobileToggle);
    }

    addEventListeners() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileSidebar());
        }
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 200));
        
        // Close sidebar if user clicks outside of it on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth <= this.desktopBreakpoint && this.isMobileSidebarOpen) {
                if (this.sidebar && !this.sidebar.contains(event.target) && this.mobileToggle && !this.mobileToggle.contains(event.target)) {
                    this.toggleMobileSidebar(false);
                }
            }
        });
    }

    handleResize() {
        if (window.innerWidth > this.desktopBreakpoint) {
            // Desktop view
            if (this.mobileToggle) this.mobileToggle.style.display = 'none';
            // Ensure sidebar is not in mobile-open state
            if (this.sidebar) {
                this.sidebar.classList.remove('mobile-open');
                // Restore desktop hover behavior if it was managed by Sidebar class
                if (window.StockArtAppInstance && window.StockArtAppInstance.sidebarController) {
                    window.StockArtAppInstance.sidebarController.setHoverExpand(true);
                }
                 // Ensure it's collapsed by default on desktop if not already expanded by hover
                if (!this.sidebar.classList.contains('expanded')) {
                    this.sidebar.classList.add('collapsed');
                }
            }
            this.isMobileSidebarOpen = false;
            this.mobileToggle?.setAttribute('aria-expanded', 'false');

        } else {
            // Mobile view
            if (this.mobileToggle) this.mobileToggle.style.display = 'inline-flex';
            // Disable desktop hover behavior
            if (window.StockArtAppInstance && window.StockArtAppInstance.sidebarController) {
                window.StockArtAppInstance.sidebarController.setHoverExpand(false);
            }
            // If sidebar was open via hover, close it for mobile unless explicitly opened by toggle
            if (this.sidebar && !this.sidebar.classList.contains('mobile-open')) {
                 this.sidebar.classList.add('collapsed'); // Ensure it's hidden
                 this.sidebar.classList.remove('expanded');
            }
        }
    }

    toggleMobileSidebar(forceState) {
        if (!this.sidebar || window.innerWidth > this.desktopBreakpoint) return;

        this.isMobileSidebarOpen = typeof forceState === 'boolean' ? forceState : !this.isMobileSidebarOpen;
        
        if (this.isMobileSidebarOpen) {
            this.sidebar.classList.add('mobile-open');
            this.sidebar.classList.remove('collapsed'); // Ensure it's not collapsed
            this.sidebar.classList.add('expanded'); // Apply expanded styles for content visibility
            this.mobileToggle?.setAttribute('aria-expanded', 'true');
            // Optional: Add a body class to prevent scrolling while mobile menu is open
            document.body.classList.add('no-scroll-mobile-menu');
        } else {
            this.sidebar.classList.remove('mobile-open');
            // No need to add 'collapsed' here if CSS for .sidebar handles transform: translateX(-100%)
            // this.sidebar.classList.add('collapsed'); 
            this.mobileToggle?.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll-mobile-menu');
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Make ResponsiveController class available globally or for main.js to instantiate
window.ResponsiveController = ResponsiveController;
// Also, allow main.js to access the instance if needed for inter-module communication
document.addEventListener('DOMContentLoaded', () => {
    if (window.StockArtAppInstance && window.StockArtAppInstance.elements.sidebar) {
         window.ResponsiveControllerInstance = new ResponsiveController(window.StockArtAppInstance.elements.sidebar);
         // Initialization is now handled by StockArtApp's init method
    }
});
