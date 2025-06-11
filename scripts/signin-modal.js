// scripts/signin-modal.js - Logic for the pre-existing #signinModal in index.html

function initializeSignInModal() {
    const signInModalElement = document.getElementById('signinModal');
    if (!signInModalElement) {
        console.error('Sign-in modal element (#signinModal) not found in HTML.');
        return;
    }

    const signInTriggerSidebar = document.getElementById('signInTriggerSidebar');
    // Potentially other triggers could be added here, e.g., a main CTA button
    // const mainSignInTrigger = document.getElementById('mainSignInCTA'); 

    const closeButton = signInModalElement.querySelector('#closeSigninBtn');
    const backdrop = signInModalElement.querySelector('#signinBackdrop');

    const allTriggers = [signInTriggerSidebar /*, mainSignInTrigger */].filter(Boolean);

    allTriggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                showSignInModal();
            });
        }
    });

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            hideSignInModal();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            hideSignInModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && signInModalElement.style.display !== 'none') {
            hideSignInModal();
        }
    });

    // Add event listeners for Google, Apple, Email sign-in buttons within the modal
    const googleBtn = signInModalElement.querySelector('#googleSigninBtn');
    const appleBtn = signInModalElement.querySelector('#appleSigninBtn');
    const emailForm = signInModalElement.querySelector('#emailForm');

    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleSignIn);
    }
    if (appleBtn) {
        appleBtn.addEventListener('click', handleAppleSignIn);
    }
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailFormSubmit);
    }
    console.log('Sign-In Modal Initialized (using existing HTML structure)');
}

function showSignInModal() {
    const signInModalElement = document.getElementById('signinModal');
    if (signInModalElement) {
        signInModalElement.style.display = 'flex'; // Or 'block' depending on CSS
        // Add animation classes if they exist in animations.css
        signInModalElement.classList.remove('fade-out', 'slide-to-right-anim');
        signInModalElement.classList.add('fade-in', 'slide-from-right-anim');
        
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Focus management: focus the first interactive element in the modal
        setTimeout(() => {
            const firstFocusable = signInModalElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100); // Delay to allow display change and animation
        
        // Announce to screen readers (if an announce utility is available)
        // window.announce && window.announce('Sign in modal opened');
    }
}

function hideSignInModal() {
    const signInModalElement = document.getElementById('signinModal');
    if (signInModalElement) {
        signInModalElement.classList.remove('fade-in', 'slide-from-right-anim');
        signInModalElement.classList.add('fade-out', 'slide-to-right-anim');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            signInModalElement.style.display = 'none';
        }, 300); // Match animation duration from CSS

        document.body.style.overflow = ''; // Restore background scroll

        // Return focus to the element that opened the modal if possible
        // This requires tracking the trigger, or a sensible default.
        // For now, let's assume a sidebar trigger.
        const trigger = document.getElementById('signInTriggerSidebar');
        if (trigger) {
            trigger.focus();
        }
        // window.announce && window.announce('Sign in modal closed');
    }
}

function handleGoogleSignIn() {
    console.log('Google Sign-In clicked');
    // Placeholder for Google Sign-In logic
    alert('Google Sign-In (not implemented yet).');
    // Example: window.location.href = '/auth/google';
}

function handleAppleSignIn() {
    console.log('Apple Sign-In clicked');
    // Placeholder for Apple Sign-In logic
    alert('Apple Sign-In (not implemented yet).');
}

function handleEmailFormSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        console.log('Email Sign-In submitted:', emailInput.value);
        // Placeholder for Email Sign-In logic
        alert(`Email Sign-In with ${emailInput.value} (not implemented yet).`);
        emailInput.value = '';
    }
}

// Expose functions to global scope if main.js calls them directly
window.initializeSignInModal = initializeSignInModal;
window.showSignInModal = showSignInModal;
window.hideSignInModal = hideSignInModal;

// Auto-initialize if StockArtApp isn't doing it (fallback, but main.js should call initializeSignInModal)
// document.addEventListener('DOMContentLoaded', () => {
//    if (!document.querySelector('.StockArtAppInstance')) { // Check if main app will init
//        initializeSignInModal();
//    }
// });
