// scripts/sidebar.js - Sidebar specific logic

class Sidebar {
    constructor(sidebarElement) {
        this.sidebar = sidebarElement;
        this.isHoverExpandEnabled = true; // Control hover behavior
        this.hoverTimeout = null;
        this.expandDelay = 200; // ms, from implementation-config
        this.collapseDelay = 100; // ms, slightly quicker to collapse on mouseout
    }

    init() {
        if (!this.sidebar) {
            console.error('Sidebar element not found for initialization.');
            return;
        }
        this.addEventListeners();
        this.checkInitialState(); // For mobile, might not be collapsed by default
        console.log('Sidebar Initialized');
    }

    addEventListeners() {
        // Desktop hover behavior
        if (window.innerWidth > 768) { // Only apply hover on larger screens
            this.sidebar.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            this.sidebar.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        }

        // Handle clicks on nav items (e.g., for SPA navigation or active state)
        const navItems = this.sidebar.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavItemClick(e, navItems));
        });
    }
    
    checkInitialState() {
        // On mobile, the sidebar might start open if .mobile-open is present
        // Or it might be controlled by a hamburger menu elsewhere
        // For now, ensure it's collapsed on desktop unless .expanded is there
        if (window.innerWidth > 768 && !this.sidebar.classList.contains('expanded')) {
            this.sidebar.classList.add('collapsed');
        } else if (window.innerWidth <= 768 && !this.sidebar.classList.contains('mobile-open')) {
            this.sidebar.classList.add('collapsed'); // Ensure it's hidden initially on mobile
        }
    }

    handleMouseEnter() {
        if (!this.isHoverExpandEnabled || window.innerWidth <= 768) return; // No hover on mobile

        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
            this.sidebar.classList.remove('collapsed');
            this.sidebar.classList.add('expanded');
            this.adjustMainContentPadding(true);
        }, this.expandDelay);
    }

    handleMouseLeave() {
        if (!this.isHoverExpandEnabled || window.innerWidth <= 768) return;

        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
            this.sidebar.classList.remove('expanded');
            this.sidebar.classList.add('collapsed');
            this.adjustMainContentPadding(false);
        }, this.collapseDelay);
    }

    handleNavItemClick(event, allNavItems) {
        // Remove 'active' from all items
        allNavItems.forEach(item => item.classList.remove('active'));
        // Add 'active' to the clicked item
        event.currentTarget.classList.add('active');

        // If on mobile and sidebar is an overlay, close it after click
        if (window.innerWidth <= 768 && this.sidebar.classList.contains('mobile-open')) {
             if (window.ResponsiveControllerInstance) { // Assuming ResponsiveController is global
                window.ResponsiveControllerInstance.toggleMobileSidebar(false); // Explicitly close
            }
        }
    }
    
    adjustMainContentPadding(isExpanded) {
        const mainContent = document.getElementById('main-content');
        const searchBoxContainer = document.getElementById('search-box-container');

        if (mainContent) {
            if (isExpanded) {
                mainContent.style.paddingLeft = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-expanded').trim();
                if (searchBoxContainer && searchBoxContainer.classList.contains('bottom-pos')) {
                    searchBoxContainer.style.paddingLeft = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-expanded').trim();
                     searchBoxContainer.style.width = `calc(100% - ${getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-expanded').trim()} - var(--spacing-xl) * 2)`;
                }
            } else {
                mainContent.style.paddingLeft = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-collapsed').trim();
                 if (searchBoxContainer && searchBoxContainer.classList.contains('bottom-pos')) {
                    searchBoxContainer.style.paddingLeft = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-collapsed').trim();
                    searchBoxContainer.style.width = `calc(100% - ${getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-collapsed').trim()} - var(--spacing-xl) * 2)`;
                }
            }
        }
    }

    // Public method to enable/disable hover expansion (e.g., for mobile overlay state)
    setHoverExpand(enabled) {
        this.isHoverExpandEnabled = enabled;
        if (!enabled && this.sidebar.classList.contains('expanded') && window.innerWidth > 768) {
            // If disabling hover and it's expanded on desktop, collapse it
            this.sidebar.classList.remove('expanded');
            this.sidebar.classList.add('collapsed');
            this.adjustMainContentPadding(false);
        }
    }
}

// Make Sidebar class available globally or for main.js to instantiate
window.Sidebar = Sidebar;
