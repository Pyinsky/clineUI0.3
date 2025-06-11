// scripts/search.js - Search box specific logic

class SearchController {
    constructor(searchInput, searchContainer, onSubmitCallback) {
        this.searchInput = searchInput;
        this.searchContainer = searchContainer; // The .search-box-container div
        this.onSubmitCallback = onSubmitCallback; // Callback to main.js to handle submission

        this.elements = {
            attachFileBtn: document.getElementById('attachFileBtn'),
            voiceInputBtn: document.getElementById('voiceInputBtn'),
            // Add other search-related buttons if needed
        };
    }

    init() {
        if (!this.searchInput || !this.searchContainer) {
            console.error('Search input or container not found for initialization.');
            return;
        }
        this.addEventListeners();
        console.log('SearchController Initialized');
    }

    addEventListeners() {
        this.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const query = this.searchInput.value.trim();
                if (query && this.onSubmitCallback) {
                    this.onSubmitCallback(query);
                }
            }
        });

        this.searchInput.addEventListener('focus', () => {
            this.searchContainer.classList.add('focused');
        });

        this.searchInput.addEventListener('blur', () => {
            this.searchContainer.classList.remove('focused');
        });

        if (this.elements.attachFileBtn) {
            this.elements.attachFileBtn.addEventListener('click', this.handleAttachFile.bind(this));
        }
        if (this.elements.voiceInputBtn) {
            this.elements.voiceInputBtn.addEventListener('click', this.handleVoiceInput.bind(this));
        }
    }

    handleAttachFile() {
        console.log('Attach file clicked');
        // Implement file attachment logic, e.g., open file dialog
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                // Handle the file (e.g., display name, prepare for upload)
                this.searchInput.value = `File: ${file.name} (analysis of this file will be implemented)`;
            }
        });
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    handleVoiceInput() {
        console.log('Voice input clicked');
        // Implement voice input logic
        // This usually requires browser permissions and SpeechRecognition API
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice recognition is not supported by your browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        this.elements.voiceInputBtn.classList.add('recording'); // Add visual feedback

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.searchInput.value = transcript;
            // Optionally auto-submit after voice input
            // if (transcript && this.onSubmitCallback) {
            //     this.onSubmitCallback(transcript);
            // }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            alert(`Speech recognition error: ${event.error}`);
        };
        
        recognition.onend = () => {
            this.elements.voiceInputBtn.classList.remove('recording'); // Remove visual feedback
        };

        recognition.start();
    }

    moveToBottom() {
        // This function will be called by main.js when search is active
        this.searchContainer.classList.remove('initial-pos');
        this.searchContainer.classList.add('bottom-pos');
        // Add animation class if defined
        this.searchContainer.classList.remove('slide-to-bottom-anim'); // remove if coming from center
        this.searchContainer.classList.add('slide-up-from-bottom-anim'); // Animate appearance at bottom
    }

    moveToCenter() {
        // This function will be called by main.js for initial view
        this.searchContainer.classList.remove('bottom-pos');
        this.searchContainer.classList.add('initial-pos');
        // Add animation class if defined
        this.searchContainer.classList.remove('slide-up-from-bottom-anim');
        // Potentially add an animation for returning to center if needed
    }

    clearInput() {
        this.searchInput.value = '';
    }

    focusInput() {
        this.searchInput.focus();
    }
}

// Make SearchController class available globally or for main.js to instantiate
window.SearchController = SearchController;
