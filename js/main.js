import { renderPluginCards, initializeLikeButtonState } from './popup.js';
import { 
    setupPopupListeners, 
    setupStorageListeners, 
    restoreUIFromStorage, 
    setupTabMemory, 
    initializeTooltips, 
    setupCopyButtons, 
    setupOpenUrlButtons,
    setupToolListeners
} from './utils/listeners.js';
import { checkAndInjectLoader } from './utils/dom.js';
import { loadingHTML } from './utils/template.js';
import { fetchAndDisplayVerse } from './tools/bible.js';
import { initializeRedirectionTool } from './tools/redirection.js';
import { initializeColorPicker } from './tools/color-picker.js';
import { initializeContrastChecker } from './tools/contrast-checker.js';
import { initializeGradientGenerator } from './tools/gradient-generator.js';

// This is the main entry point for the popup functionality.
function initializePopup() {
    // 1. Render initial UI elements
    checkAndInjectLoader(".main", loadingHTML);
    renderPluginCards();
    
    // 2. Restore saved state from storage
    initializeLikeButtonState();
    restoreUIFromStorage();
    
    // 3. Setup all event listeners
    // Note: It's important to render cards before setting up listeners on them
    setupPopupListeners(); 
    setupToolListeners();
    setupStorageListeners();
    setupTabMemory();
    initializeTooltips();
    setupCopyButtons();
    setupOpenUrlButtons();

    // 4. Initialize tools and dynamic content
    fetchAndDisplayVerse();
    initializeRedirectionTool();
    initializeColorPicker();
    initializeContrastChecker();
    initializeGradientGenerator();
}

document.addEventListener('DOMContentLoaded', initializePopup);