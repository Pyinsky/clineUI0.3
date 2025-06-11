// scripts/main.js - Main application logic for StockArt Redesign

document.addEventListener('DOMContentLoaded', () => {
    const app = new StockArtApp();
    app.init();
});

class StockArtApp {
    constructor() {
        this.elements = {
            app: document.getElementById('app'),
            sidebar: document.getElementById('sidebar'),
            mainContent: document.getElementById('main-content'),
            initialView: document.getElementById('initial-view'),
            searchResultsView: document.getElementById('search-results-view'),
            searchBoxContainer: document.getElementById('search-box-container'),
            mainSearchInput: document.getElementById('mainSearchInput'),
            quickActionsContainer: document.getElementById('quick-actions-container'),
            topBar: document.getElementById('top-bar'),
            userQueryDisplay: document.getElementById('user-query-display'),
            chatMessagesContainer: document.getElementById('chat-messages-container'),
            signInModal: document.getElementById('signinModal'),
            // Add other frequently accessed elements here
        };

        this.state = {
            isSearchActive: false, // To track if initial view or search results view is active
            currentQuery: '',
        };

        // Bind methods
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    init() {
        console.log('StockArtApp Initializing...');
        this.initEventListeners();

        // Initialize imported modules/components
        if (window.Sidebar) {
            this.sidebarController = new window.Sidebar(this.elements.sidebar);
            this.sidebarController.init();
        } else {
            console.warn('Sidebar module not found.');
        }

        if (window.SearchController) {
            this.searchController = new window.SearchController(
                this.elements.mainSearchInput,
                this.elements.searchBoxContainer,
                this.handleSearchSubmit // Pass the callback
            );
            this.searchController.init();
        } else {
            console.warn('SearchController module not found.');
        }
        
        if (window.initializeSignInModal) { // From existing signin-modal.js
            window.initializeSignInModal();
        } else {
            console.warn('initializeSignInModal function not found.');
        }

        if (window.ResponsiveController) {
            this.responsiveController = new window.ResponsiveController(this.elements.sidebar);
            this.responsiveController.init();
        } else {
            console.warn('ResponsiveController module not found.');
        }


        this.setupQuickActions();
        this.updateView(); // Set initial view state
        console.log('StockArtApp Initialized.');
    }

    initEventListeners() {
        // Example: Listen for custom event from search.js to trigger view change
        // document.addEventListener('searchSubmitted', (event) => {
        //     this.handleSearchSubmit(event.detail.query);
        // });
        // This is now handled by passing a callback to SearchController

        // Sign-in trigger in sidebar footer (if different from main modal trigger)
        const signInTriggerSidebar = document.getElementById('signInTriggerSidebar');
        if (signInTriggerSidebar && window.showSignInModal) {
            signInTriggerSidebar.addEventListener('click', (e) => {
                e.preventDefault();
                window.showSignInModal();
            });
        }
    }

    setupQuickActions() {
        if (this.elements.quickActionsContainer) {
            this.elements.quickActionsContainer.addEventListener('click', (event) => {
                const quickActionChip = event.target.closest('.quick-action-chip');
                if (quickActionChip && quickActionChip.dataset.query) {
                    const query = quickActionChip.dataset.query;
                    this.elements.mainSearchInput.value = query;
                    this.handleSearchSubmit(query); // Directly call search submit
                }
            });
        }
    }

    async handleSearchSubmit(query) {
        if (!query || query.trim() === '') return;

        this.state.currentQuery = query.trim();
        this.state.isSearchActive = true;
        this.updateView();

        if (this.elements.userQueryDisplay) {
            this.elements.userQueryDisplay.textContent = this.state.currentQuery;
        }
        
        this.addMessageToChat(this.state.currentQuery, 'user');

        // Simulate AI response for now
        this.addMessageToChat('Thinking...', 'ai thinking'); 
        
        // Simulate API call
        try {
            // const aiResponse = await this.fetchAIResponse(this.state.currentQuery);
            // Replace with actual API call in the future
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            const aiResponse = `This is a simulated AI response for your query: "${this.state.currentQuery}". The actual stock analysis would appear here.`;
            
            this.removeThinkingMessage();
            this.addMessageToChat(aiResponse, 'ai');
        } catch (error) {
            console.error("Error fetching AI response:", error);
            this.removeThinkingMessage();
            this.addMessageToChat(`Sorry, I couldn't process that. Error: ${error.message}`, 'ai error');
        }
    }

    // async fetchAIResponse(query) {
    //     // Placeholder for actual API call to backend/n8n
    //     // const response = await fetch('/api/analyze', {
    //     //     method: 'POST',
    //     //     headers: { 'Content-Type': 'application/json' },
    //     //     body: JSON.stringify({ query })
    //     // });
    //     // if (!response.ok) throw new Error(`API Error: ${response.status}`);
    //     // const data = await response.json();
    //     // return data.reply || "No specific reply found.";
    //     return new Promise(resolve => setTimeout(() => resolve(`Mock response for: ${query}`), 1000));
    // }

    addMessageToChat(text, type) {
        if (!this.elements.chatMessagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', type);
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.textContent = text; // Basic text for now, can be enhanced for markdown/HTML
        
        messageDiv.appendChild(bubbleDiv);
        this.elements.chatMessagesContainer.appendChild(messageDiv);
        this.elements.chatMessagesContainer.scrollTop = this.elements.chatMessagesContainer.scrollHeight;
    }
    
    removeThinkingMessage() {
        const thinkingMessage = this.elements.chatMessagesContainer.querySelector('.chat-message.thinking');
        if (thinkingMessage) {
            thinkingMessage.remove();
        }
    }


    updateView() {
        if (this.state.isSearchActive) {
            this.elements.initialView.classList.add('hidden');
            this.elements.searchResultsView.classList.remove('hidden');
            
            // Move search box to bottom fixed position (handled by search.js or here)
            if (this.searchController) {
                this.searchController.moveToBottom();
            }
            // Animate elements
            this.elements.topBar.classList.remove('slide-up-anim');
            this.elements.topBar.classList.add('slide-down-anim');
            this.elements.chatMessagesContainer.classList.add('fade-in');


        } else {
            this.elements.initialView.classList.remove('hidden');
            this.elements.searchResultsView.classList.add('hidden');

            // Move search box to initial centered position (handled by search.js or here)
             if (this.searchController) {
                this.searchController.moveToCenter();
            }
            // Animate elements
            this.elements.topBar.classList.remove('slide-down-anim');
            this.elements.topBar.classList.add('slide-up-anim'); // Ensure it's hidden
        }
    }
}

// Make StockArtApp available if needed by other scripts, or for debugging
// window.StockArtAppInstance = new StockArtApp();
