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
        this.addMessageToChat('Thinking...', 'ai', 'thinking'); 
        
        // Actual API call
        try {
            const aiResponse = await this.fetchAIResponse(this.state.currentQuery);
            this.removeThinkingMessage();
            this.addMessageToChat(aiResponse, 'ai');
        } catch (error) {
            console.error("Error fetching AI response:", error);
            this.removeThinkingMessage();
            this.addMessageToChat(`Sorry, I couldn't process your request. Error: ${error.message}`, 'ai', 'error');
        }
    }

   async fetchAIResponse(query) {
        const webhookUrl = 'https://primary-production-b1c8.up.railway.app/webhook/1d353652-65f1-4784-b7ec-54379d8ab33c';
        const payload = {
            text: query
        };

        console.log('[StockArtApp] Initiating fetchAIResponse for query:', query);
        console.log('[StockArtApp] Webhook URL:', webhookUrl);
        console.log('[StockArtApp] Payload:', JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Still sending JSON payload to n8n
                    'Accept': 'text/html' // Inform n8n (though it might not change n8n's output)
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorDetails = `HTTP error! Status: ${response.status}`;
                try {
                    // Attempt to get text even if response is not OK, but handle potential double-read
                    errorDetails += ` - ${await response.text()}`;
                } catch (e) {
                    console.error('[StockArtApp] Failed to get error text from non-OK response:', e);
                }
                console.error(`[StockArtApp] Webhook HTTP error! ${errorDetails}`);
                throw new Error(`API Error: ${errorDetails}`);
            }

            // *** CRUCIAL CHANGE HERE: Expect text (HTML) not JSON ***
            const htmlContent = await response.text(); // Read the response body as text (HTML) ONCE
            console.log('[StockArtApp] Webhook response HTML:', htmlContent);

            // Directly return the HTML string
            return htmlContent;

        } catch (error) {
            console.error('[StockArtApp] Webhook request failed:', error);
            throw error;
        }
    }

    // You will also need to modify addMessageToChat to accept HTML
    addMessageToChat(content, type, additionalClass = null) {
        if (!this.elements.chatMessagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', type);
        
        if (additionalClass) {
            messageDiv.classList.add(additionalClass);
        }
        
        if (type === 'ai' && additionalClass !== 'thinking') {
            const headerDiv = document.createElement('div');
            headerDiv.classList.add('ai-response-header');
            headerDiv.innerHTML = `
                <svg class="ai-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span class="ai-label">StockArt</span>
            `;
            messageDiv.appendChild(headerDiv);
        }
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        // *** CRUCIAL CHANGE HERE: Use innerHTML for HTML content ***
        if (type === 'ai' && !additionalClass) { // Only for actual AI responses, not thinking/error
             bubbleDiv.innerHTML = content; // Inject HTML directly
        } else {
             bubbleDiv.textContent = content; // Keep textContent for user input, thinking, error messages
        }
        messageDiv.appendChild(bubbleDiv);
        
        if (type === 'ai' && additionalClass !== 'thinking' && additionalClass !== 'error') {
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('response-actions');
            actionsDiv.innerHTML = `
                <button class="response-action-btn" data-action="share">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share
                </button>
                <button class="response-action-btn" data-action="export">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export
                </button>
                <button class="response-action-btn" data-action="rewrite">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Rewrite
                </button>
            `;
            messageDiv.appendChild(actionsDiv);
        }
        
        this.elements.chatMessagesContainer.appendChild(messageDiv);
        // With column-reverse, we need to scroll to top to see new messages
        this.elements.chatMessagesContainer.scrollTop = 0;
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
