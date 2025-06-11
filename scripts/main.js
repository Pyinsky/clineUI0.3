// StockArt Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeSidebar();
    initializeSearch();
    initializeAnimations();
    initializeKeyboardShortcuts();
    initializeTheme();
    initializeAccessibility();
});

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const signInBtn = document.querySelector('.sign-in-btn');
    
    // Load sidebar state from localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }
    
    // Toggle sidebar functionality
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            // Save state to localStorage
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            
            // Announce state change
            window.announce && window.announce(
                isCollapsed ? 'Sidebar collapsed' : 'Sidebar expanded'
            );
        });
    }
    
    // Add tooltips for collapsed sidebar
    function createTooltips() {
        navItems.forEach(item => {
            const tooltip = document.createElement('div');
            tooltip.className = 'nav-tooltip';
            tooltip.textContent = item.querySelector('span').textContent;
            item.appendChild(tooltip);
        });
        
        if (signInBtn) {
            const tooltip = document.createElement('div');
            tooltip.className = 'nav-tooltip';
            tooltip.textContent = signInBtn.querySelector('span').textContent;
            signInBtn.appendChild(tooltip);
        }
    }
    
    createTooltips();
    
    // Handle mobile responsive behavior
    function handleMobileResize() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('collapsed');
        }
    }
    
    window.addEventListener('resize', handleMobileResize);
    handleMobileResize();
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Add hover sound effect simulation
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // New Analysis button functionality
    const newAnalysisBtn = document.querySelector('.new-thread-btn');
    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', function() {
            simulateNewAnalysis();
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('mainSearchInput');
    const searchOptions = document.querySelectorAll('.search-option');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const voiceBtn = document.querySelector('.voice-btn');

    if (searchInput) {
        // Search input focus effects
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            document.body.classList.add('search-active');
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            document.body.classList.remove('search-active');
        });

        // Real-time search suggestions
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });

        // Search submission
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }

    // Search options functionality
    searchOptions.forEach(option => {
        option.addEventListener('click', function() {
            toggleSearchOption(this);
        });
    });

    // Tool buttons functionality
    toolBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleToolAction(this);
        });
    });

    // Voice search functionality
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function() {
            toggleVoiceSearch();
        });
    }
}

// Animation and visual effects
function initializeAnimations() {
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.main-content::before');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Logo hover effect enhancement
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 10px rgba(74, 158, 255, 0.5))';
        });

        logoContainer.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    }

    // Brand logo click effect
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        brandLogo.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    }

    // Floating particles effect
    createFloatingParticles();
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Cmd/Ctrl + K for new analysis
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('mainSearchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('mainSearchInput');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.blur();
                searchInput.value = '';
                hideSearchSuggestions();
            }
        }

        // Arrow navigation for nav items
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            navigateWithKeyboard(e.key);
        }
    });
}

// Theme and appearance
function initializeTheme() {
    // Auto-detect system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for theme changes
    prefersDark.addEventListener('change', function(e) {
        updateTheme(e.matches ? 'dark' : 'light');
    });

    // Apply initial theme
    updateTheme(prefersDark.matches ? 'dark' : 'light');
}

// Accessibility features
function initializeAccessibility() {
    // Enhanced focus management
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Screen reader announcements
    const announcements = document.createElement('div');
    announcements.setAttribute('aria-live', 'polite');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.className = 'sr-only';
    document.body.appendChild(announcements);

    window.announce = function(message) {
        announcements.textContent = message;
        setTimeout(() => {
            announcements.textContent = '';
        }, 1000);
    };
}

// Helper functions
function simulateNewAnalysis() {
    const btn = document.querySelector('.new-thread-btn');
    btn.classList.add('loading');
    
    // Simulate loading
    setTimeout(() => {
        btn.classList.remove('loading');
        const searchInput = document.getElementById('mainSearchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.placeholder = 'What company would you like to analyze?';
        }
        window.announce('New analysis session started');
    }, 1500);
}

function showSearchSuggestions(query) {
    // Create suggestions based on query
    const suggestions = generateSearchSuggestions(query);
    displaySuggestions(suggestions);
}

function generateSearchSuggestions(query) {
    const stockSuggestions = [
        'Apple Inc. (AAPL)', 'Microsoft Corporation (MSFT)', 'Amazon.com Inc. (AMZN)',
        'Alphabet Inc. (GOOGL)', 'Tesla Inc. (TSLA)', 'Meta Platforms Inc. (META)',
        'NVIDIA Corporation (NVDA)', 'Berkshire Hathaway Inc. (BRK.A)',
        'JPMorgan Chase & Co. (JPM)', 'Johnson & Johnson (JNJ)'
    ];

    return stockSuggestions
        .filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
}

function displaySuggestions(suggestions) {
    let suggestionBox = document.querySelector('.search-suggestions');
    
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.className = 'search-suggestions';
        document.querySelector('.search-input-wrapper').appendChild(suggestionBox);
    }

    suggestionBox.innerHTML = suggestions
        .map(suggestion => `
            <div class="suggestion-item" tabindex="0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span>${suggestion}</span>
            </div>
        `)
        .join('');

    // Add click handlers for suggestions
    suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const searchInput = document.getElementById('mainSearchInput');
            searchInput.value = this.textContent.trim();
            hideSearchSuggestions();
            performSearch(searchInput.value);
        });
    });

    suggestionBox.style.display = 'block';
}

function hideSearchSuggestions() {
    const suggestionBox = document.querySelector('.search-suggestions');
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
    }
}

async function performSearch(query) {
    if (!query.trim()) return;

    const searchInput = document.getElementById('mainSearchInput');
    searchInput.classList.add('loading');
    
    // Hide any existing search suggestions
    hideSearchSuggestions();
    
    try {
        window.announce(`Analyzing ${query}`);
        
        // Call our backend API that forwards to n8n webhook
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query.trim()
            })
        });

        const result = await response.json();
        
        if (result.success) {
            // Display the actual response from n8n
            showAnalysisResults(result.data, query);
            window.announce(`Analysis complete for ${query}`);
        } else {
            // Handle error response
            showErrorResults(result.error, query);
            window.announce(`Analysis failed: ${result.error}`);
        }
        
    } catch (error) {
        console.error('Search request failed:', error);
        showErrorResults('Network error - please try again', query);
        window.announce('Analysis failed due to network error');
    } finally {
        searchInput.classList.remove('loading');
    }
}

function showAnalysisResults(data, query) {
    // Remove any existing results
    const existingResults = document.querySelector('.analysis-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Create results container for n8n response
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'analysis-results fade-in';
    
    // Handle different response formats from n8n
    let content = '';
    if (typeof data === 'string') {
        content = data;
    } else if (data && typeof data === 'object') {
        if (data.analysis) {
            content = data.analysis;
        } else if (data.result) {
            content = data.result;
        } else if (data.response) {
            content = data.response;
        } else {
            content = JSON.stringify(data, null, 2);
        }
    } else {
        content = 'Analysis completed successfully.';
    }

    resultsContainer.innerHTML = `
<div class="results-header">
    <h2>AI Analysis for "${query}"</h2>
    <div class="header-controls">
        <p>Generated ${new Date().toLocaleString()}</p>
        <div class="model-menu">
            <button class="menu-toggle-btn" title="Change Model">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>
            <div class="menu-dropdown">
                <a href="#" class="menu-item active">System Default</a>
                <a href="#" class="menu-item">GPT-4 Turbo</a>
                <a href="#" class="menu-item">Claude 3 Opus</a>
            </div>
        </div>
        <button class="clear-results-btn" title="Clear results">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>
</div>
        <div class="results-content">
            <div class="result-card main-result">
                <div class="result-content">
                    ${formatAnalysisContent(content)}
                </div>
            </div>
        </div>
    `;

    // Insert results into main content
    const mainContent = document.querySelector('.center-content');
    mainContent.appendChild(resultsContainer);

    // Add clear results functionality
    const clearBtn = resultsContainer.querySelector('.clear-results-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            resultsContainer.classList.add('fade-out');
            setTimeout(() => {
                if (resultsContainer.parentNode) {
                    resultsContainer.parentNode.removeChild(resultsContainer);
                }
            }, 300);
        });
    }

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showErrorResults(error, query) {
    // Remove any existing results
    const existingResults = document.querySelector('.analysis-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Create error results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'analysis-results error-results fade-in';
    
    resultsContainer.innerHTML = `
        <div class="results-header">
            <h2>Analysis Error</h2>
            <p>Query: "${query}"</p>
            <button class="clear-results-btn" title="Clear results">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="results-content">
            <div class="result-card error-card">
                <div class="error-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                </div>
                <h3>Analysis Failed</h3>
                <p>${error}</p>
                <button class="retry-btn" onclick="performSearch('${query.replace(/'/g, "\\'")}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="23 4 23 10 17 10"/>
                        <polyline points="1 20 1 14 7 14"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                    </svg>
                    Try Again
                </button>
            </div>
        </div>
    `;

    // Insert results into main content
    const mainContent = document.querySelector('.center-content');
    mainContent.appendChild(resultsContainer);

    // Add clear results functionality
    const clearBtn = resultsContainer.querySelector('.clear-results-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            resultsContainer.classList.add('fade-out');
            setTimeout(() => {
                if (resultsContainer.parentNode) {
                    resultsContainer.parentNode.removeChild(resultsContainer);
                }
            }, 300);
        });
    }

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatAnalysisContent(content) {
    // Clean up the initial string, remove the "output:" wrapper if it exists
    content = content.replace(/"output":\s*"/, '').replace(/\\n/g, '\n').replace(/"$/, '');

    const mainSummaryMatch = content.match(/##\s*News Sentiment Summary for .*\n([\s\S]*?)\n\nKey Articles:/);
    const mainSummary = mainSummaryMatch ? mainSummaryMatch[1].trim() : 'Summary not available.';

    const articlesText = content.split('Key Articles:')[1];
    if (!articlesText) {
        return `<p>${mainSummary}</p><p>No articles found in the response.</p>`;
    }

    const articles = articlesText.trim().split(/\n\s*\n/);
    
    let articlesHtml = articles.map(article => {
        const titleMatch = article.match(/^(.*?)\s-\s(.*?)\s\(/);
        const sentimentMatch = article.match(/Sentiment: (Bullish|Bearish|Neutral)/i);
        const reasoningMatch = article.match(/Reasoning: (.*?)(?=\nLink:|$)/);
        const linkMatch = article.match(/Link: (https?:\/\/[^\s]+)/);

        if (!titleMatch || !sentimentMatch || !reasoningMatch || !linkMatch) {
            return ''; // Skip malformed article entries
        }

        const title = titleMatch[1].replace(/^\W+/, ''); // Remove leading characters like '*'
        const source = titleMatch[2];
        const sentiment = sentimentMatch[1].toLowerCase();
        const reasoning = reasoningMatch[1];
        const link = linkMatch[1];

        // Placeholder for a logo - you could map source names to image URLs here
        const logoPlaceholder = `<div class="source-logo">${source.charAt(0)}</div>`;

        return `
            <div class="news-article-card">
                <div class="article-header">
                    <div class="source-info">
                        ${logoPlaceholder}
                        <span class="source-name">${source}</span>
                    </div>
                    <span class="sentiment-tag ${sentiment}">${sentiment}</span>
                </div>
                <h3 class="article-title"><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
                <p class="article-reasoning">${reasoning}</p>
            </div>
        `;
    }).join('');

    // Final combined output
    return `
        <div class="analysis-summary">
             <h3>Summary</h3>
             <p>${mainSummary}</p>
        </div>
        <div class="articles-container">
            ${articlesHtml}
        </div>
    `;
}

function showSearchResults(query) {
    // Legacy function - keeping for backward compatibility
    showAnalysisResults('Mock analysis results', query);
}

function toggleSearchOption(option) {
    option.classList.toggle('active');
    
    if (option.classList.contains('pro-option')) {
        // Handle PRO option
        window.announce('PRO features activated');
    } else if (option.classList.contains('deep-research-option')) {
        // Handle Deep Research option
        window.announce('Deep research mode enabled');
    }
}

function handleToolAction(toolBtn) {
    const title = toolBtn.getAttribute('title');
    
    // Add click effect
    toolBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        toolBtn.style.transform = '';
    }, 150);

    // Handle different tool actions
    switch (title) {
        case 'Attach file':
            simulateFileUpload();
            break;
        case 'Focus mode':
            toggleFocusMode();
            break;
        case 'Collections':
            showCollections();
            break;
    }

    window.announce(`${title} activated`);
}

function simulateFileUpload() {
    // Create file input simulation
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.csv,.xlsx';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            window.announce(`File ${fileName} uploaded successfully`);
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

function toggleVoiceSearch() {
    const voiceBtn = document.querySelector('.voice-btn');
    voiceBtn.classList.toggle('recording');
    
    if (voiceBtn.classList.contains('recording')) {
        // Start voice recording simulation
        voiceBtn.style.color = '#ff4444';
        window.announce('Voice recording started');
        
        setTimeout(() => {
            voiceBtn.classList.remove('recording');
            voiceBtn.style.color = '';
            window.announce('Voice recording stopped');
        }, 3000);
    }
}

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    
    if (document.body.classList.contains('focus-mode')) {
        // Hide distracting elements
        document.querySelector('.sidebar').style.opacity = '0.3';
        window.announce('Focus mode activated');
    } else {
        document.querySelector('.sidebar').style.opacity = '';
        window.announce('Focus mode deactivated');
    }
}

function showCollections() {
    // Create collections modal simulation
    const modal = document.createElement('div');
    modal.className = 'collections-modal fade-in';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Collections</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="collection-item">
                    <h4>Tech Stocks</h4>
                    <p>5 companies</p>
                </div>
                <div class="collection-item">
                    <h4>Blue Chip</h4>
                    <p>8 companies</p>
                </div>
                <div class="collection-item">
                    <h4>Growth Stocks</h4>
                    <p>12 companies</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    modal.querySelector('.close-btn').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function navigateWithKeyboard(direction) {
    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const activeItem = document.querySelector('.nav-item.active');
    const currentIndex = navItems.indexOf(activeItem);
    
    let newIndex;
    if (direction === 'ArrowDown') {
        newIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0;
    } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
    }

    // Remove active from current and add to new
    navItems.forEach(item => item.classList.remove('active'));
    navItems[newIndex].classList.add('active');
    navItems[newIndex].focus();
}

function updateTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
        // Enhance dark mode effects
        document.documentElement.style.setProperty('--shadow-glow', '0 0 25px rgba(74, 158, 255, 0.4)');
    } else {
        document.documentElement.style.setProperty('--shadow-glow', '0 0 20px rgba(74, 158, 255, 0.3)');
    }
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    document.querySelector('.main-content').appendChild(particleContainer);

    // Create multiple particles
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning and animation
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(74, 158, 255, 0.6), transparent);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: float ${duration}s infinite linear;
        pointer-events: none;
    `;

    container.appendChild(particle);

    // Remove and recreate particle after animation
    setTimeout(() => {
        if (container.contains(particle)) {
            container.removeChild(particle);
            createParticle(container);
        }
    }, duration * 1000);
}

// Performance optimization
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('StockArt Error:', e.error);
});

// Add CSS for dynamic elements
const dynamicStyles = `
<style>
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--secondary-dark);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    margin-top: var(--spacing-sm);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    cursor: pointer;
    transition: background var(--transition-base);
}

.suggestion-item:hover {
    background: var(--hover-bg);
}

.collections-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: var(--secondary-dark);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    min-width: 400px;
    max-width: 500px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 24px;
    cursor: pointer;
}

.collection-item {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-sm);
    transition: background var(--transition-base);
}

.collection-item:hover {
    background: var(--hover-bg);
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.keyboard-navigation button:focus,
.keyboard-navigation input:focus,
.keyboard-navigation .nav-item:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}

.focus-mode .sidebar {
    transition: opacity var(--transition-base);
}

.analysis-results {
    margin-top: var(--spacing-xl);
    background: var(--secondary-dark);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.analysis-results.error-results {
    border-color: #ff4444;
}

.results-header {
    padding: var(--spacing-lg);
    background: var(--primary-dark);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.results-header h2 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.25rem;
}

.results-header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.clear-results-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
}

.clear-results-btn:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

.results-content {
    padding: var(--spacing-lg);
}

.result-card {
    background: var(--primary-dark);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    border: 1px solid var(--border-color);
}

.result-card.main-result {
    background: transparent;
    border: none;
    padding: 0;
}

.result-content {
    color: var(--text-primary);
    line-height: 1.6;
    font-size: 0.95rem;
}

.result-content strong {
    color: var(--accent-blue);
}

.result-content em {
    color: var(--text-secondary);
    font-style: italic;
}

.result-content ul {
    margin: var(--spacing-md) 0;
    padding-left: var(--spacing-lg);
}

.result-content li {
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
}

.error-card {
    text-align: center;
    padding: var(--spacing-xl);
    background: rgba(255, 68, 68, 0.1);
    border-color: rgba(255, 68, 68, 0.3);
}

.error-icon {
    color: #ff4444;
    margin-bottom: var(--spacing-lg);
}

.error-card h3 {
    color: #ff4444;
    margin: 0 0 var(--spacing-md) 0;
}

.error-card p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
}

.retry-btn {
    background: var(--accent-blue);
    color: white;
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.875rem;
    transition: all var(--transition-base);
}

.retry-btn:hover {
    background: var(--accent-blue-dark);
    transform: translateY(-1px);
}

.search-input.loading {
    background-image: linear-gradient(90deg, 
        transparent 0%, 
        rgba(74, 158, 255, 0.2) 50%, 
        transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

.fade-out {
    animation: fadeOut 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { 
        opacity: 0; 
        transform: translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}

@keyframes fadeOut {
    from { 
        opacity: 1; 
        transform: translateY(0); 
    }
    to { 
        opacity: 0; 
        transform: translateY(-20px); 
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);

// Main JavaScript for StockArt AI Chat
// Main JavaScript for StockArt AI Chat
class StockArtMain {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.setupThemeSystem();
        this.setupAccessibility();
        this.setupChatInputHandlers(); // <--- ADD THIS LINE HERE
        this.logStartup();
    }

    setupGlobalEventListeners() {
        // Handle any global click events
        document.addEventListener('click', (e) => {
            // Close any open dropdowns or menus when clicking outside
            this.handleGlobalClick(e);
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });

        // Handle window events
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });
    }

    setupThemeSystem() {
        // Detect system theme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('stockart-theme');
        
        // Apply theme
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.setTheme(theme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('stockart-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('stockart-theme', theme);
    }

    setupAccessibility() {
        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });

        // Skip to main content link
        this.createSkipLink();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transform: translateY(-100%);
            transition: transform 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.transform = 'translateY(0)';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.transform = 'translateY(-100%)';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    handleGlobalClick(e) {
        // Close any open menus or dropdowns
        const openMenus = document.querySelectorAll('.menu-open, .dropdown-open');
        openMenus.forEach(menu => {
            if (!menu.contains(e.target)) {
                menu.classList.remove('menu-open', 'dropdown-open');
            }
        });
    }

    handleGlobalKeydown(e) {
        // Global keyboard shortcuts
        switch (e.key) {
            case 'Escape':
                // Close any modals or overlays
                this.closeAllOverlays();
                break;
        }
    }

    closeAllOverlays() {
        // Close any open overlays, modals, etc.
        const overlays = document.querySelectorAll('.overlay, .modal, .dropdown-open');
        overlays.forEach(overlay => {
            overlay.classList.remove('open', 'show', 'dropdown-open');
        });
    }

    handleBeforeUnload() {
        // Save any necessary state before page unload
        this.saveApplicationState();
    }

    saveApplicationState() {
        // Save current application state to localStorage
        const state = {
            timestamp: Date.now(),
            theme: document.documentElement.getAttribute('data-theme'),
            version: '1.0.0'
        };
        
        localStorage.setItem('stockart-state', JSON.stringify(state));
    }

    logStartup() {
        console.log('🚀 StockArt AI Chat initialized');
        console.log('📱 Environment:', window.STOCKART_CONFIG?.IS_DEVELOPMENT ? 'Development' : 'Production');
        console.log('🎯 API Endpoint:', window.STOCKART_CONFIG?.API?.N8N_WEBHOOK_URL);
    }

    // Setup chat input handlers - this section was correct, but not called
    setupChatInputHandlers() {
        const welcomeChatForm = document.getElementById('chatForm');
        const chatInterfaceForm = document.getElementById('chatInputForm');

        if (welcomeChatForm) {
            welcomeChatForm.addEventListener('submit', this.handleChatSubmit.bind(this));
        }

        if (chatInterfaceForm) {
            chatInterfaceForm.addEventListener('submit', this.handleChatSubmit.bind(this));
        }
    }

    // Handle chat form submission and send webhook
    async handleChatSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const chatInput = event.target.querySelector('.search-input') || event.target.querySelector('.chat-input');
        const userPrompt = chatInput.value.trim();

        if (userPrompt) {
            console.log('User Prompt:', userPrompt);

            // Hide welcome screen and show chat interface
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('chatInterface').style.display = 'flex'; // Use flex for chat layout

            // Display user message in chat interface
            this.displayMessage(userPrompt, 'user');

            // Send webhook call
            await this.sendWebhook(userPrompt);

            // Clear the input box
            chatInput.value = '';
        }
    }

    // Function to send webhook
    async sendWebhook(promptText) {
        const webhookUrl = 'https://primary-production-b1c8.up.railway.app/webhook-test/stockartaipromptboxhandler';
        const payload = {
            text: promptText
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Webhook HTTP error! Status: ${response.status}, Message: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Webhook response:', responseData);

            const aiReply = responseData.reply || 'No direct reply received from AI.';
            this.displayMessage(aiReply, 'ai');

        } catch (error) {
            console.error('Error sending webhook:', error);
            this.displayMessage('Error: Could not get a response from the AI.', 'ai error');
        }
    }

    // Function to display messages in the chat interface
    displayMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.innerHTML = `<div class="message-bubble">${StockArtUtils.escapeHTML(message)}</div>`;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }
}



// Utility functions
const StockArtUtils = {
    // Format numbers with commas
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    },

    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format percentage
    formatPercentage(value, decimals = 2) {
        return `${(value * 100).toFixed(decimals)}%`;
    },

    // Debounce function
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
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },

    // NEW: Basic HTML escaping for displaying user/AI messages securely
    escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
};

// Make utilities globally available
window.StockArtUtils = StockArtUtils;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.stockArtMain = new StockArtMain();
});

/* --- Add these new styles to your CSS block in main.js --- */

.analysis-summary {
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--primary-dark);
    border-radius: var(--radius-md);
}

.articles-container {
    display: grid;
    gap: var(--spacing-lg);
}

.news-article-card {
    background: var(--primary-dark);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    transition: all var(--transition-base);
}

.news-article-card:hover {
    border-color: var(--accent-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.source-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.source-logo {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--hover-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: var(--text-primary);
}

.sentiment-tag {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    line-height: 1;
}

.sentiment-tag.bullish {
    background-color: #28a745; /* Green */
}

.sentiment-tag.bearish {
    background-color: #dc3545; /* Red */
}

.sentiment-tag.neutral {
    background-color: #6c757d; /* Grey */
    color: #fff;
}

.article-title {
    font-size: 1.1rem;
    margin: 0 0 var(--spacing-sm) 0;
}

.article-title a {
    color: var(--text-primary);
    text-decoration: none;
    transition: color var(--transition-base);
}

.article-title a:hover {
    color: var(--accent-blue);
}

.article-reasoning {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

/* --- Add these menu styles to your CSS block in main.js --- */

.results-header {
    align-items: flex-start;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    text-align: right;
}

.header-controls p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
    white-space: nowrap;
}

.model-menu {
    position: relative;
    display: inline-block;
}

.menu-toggle-btn {
    background: none;
    border: 1px solid transparent;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
}

.menu-toggle-btn:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    border-color: var(--border-color);
}

.menu-dropdown {
    display: none; /* Hidden by default */
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: var(--spacing-sm);
    background-color: var(--primary-dark);
    min-width: 160px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.3);
    z-index: 1;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    padding: var(--spacing-sm) 0;
    overflow: hidden;
}

/* Show the dropdown on hover */
.model-menu:hover .menu-dropdown {
    display: block;
}

.menu-item {
    color: var(--text-primary);
    padding: 10px 16px;
    text-decoration: none;
    display: block;
    font-size: 0.875rem;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
}

.menu-item:hover {
    background-color: var(--hover-bg);
}

.menu-item.active {
    font-weight: bold;
    color: var(--accent-blue);
}
