import { getCurrentTab, sendMessage } from "./chrome-api.js";
import * as storage from "./storage.js";
import * as popup from "../popup.js";
import * as redirection from "../tools/redirection.js";
import { initializeValidationFields } from "../tools/validation-fields.js";
import { alertTrigger, getAlertConfig, initializeTooltips } from "./dom.js";
import { detectWordPress, updateDetectionUI } from "./wordpress.js";

// Re-export for main.js
export { initializeTooltips };

// --- Generic Listeners ---

// Setup copy buttons to copy content from specific selectors
export function setupCopyButtons() {
  document.querySelectorAll("button[data-copy-selector]").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selector = e.currentTarget.dataset.copySelector;
      const contentElement = document.querySelector(selector);
      if (contentElement) {
        const content = contentElement.textContent;
        navigator.clipboard.writeText(content.trim());
      } else {
        alertTrigger(getAlertConfig("selectorNotFound"));
      }
    });
  });
}

// Setup buttons that open URLs in a new browser tab
export function setupOpenUrlButtons() {
  document.querySelectorAll("button[data-open-url]").forEach((button) => {
    button.addEventListener("click", () => {
      const selector = button.getAttribute("data-open-url");
      const targetElement = document.querySelector(selector);
      if (!targetElement) {
        alertTrigger(getAlertConfig("targetElementNotFound"));
        return;
      }
      const rawUrl = targetElement.textContent.trim();
      const isAbsoluteUrl = /^[a-z][a-z0-9+.-]*:/i.test(rawUrl);
      const url = isAbsoluteUrl
        ? rawUrl
        : chrome.runtime.getURL(rawUrl.replace(/^\/+/, ""));

      if (url) {
        chrome.tabs.create({ url });
      }
    });
  });
}

// Generic listener function
export function addListener(selector, event, callback) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener(event, callback);
    }
}

// --- Tool-specific Listeners ---

export function setupToolListeners() {
    // Redirection tool
    addListener("#redirectBtn", "click", redirection.handleRedirectEvent);
    
    // Validation fields tool
    initializeValidationFields();

    // WordPress Detection Reload
    addListener("#reload-wp-detect", "click", async () => {
        const overallStatus = document.getElementById('wp-overall-status');
        if (overallStatus) {
            overallStatus.textContent = "Verificando...";
            overallStatus.className = "badge bg-secondary";
        }
        const results = await detectWordPress();
        updateDetectionUI(results);
    });
}


// --- Popup-specific Listeners ---
export function setupPopupListeners() {
    // This function needs to be called after the plugin cards are rendered.
    document.querySelectorAll(".btn-view").forEach(btn => btn.addEventListener("click", popup.handleViewPluginClick));
    document.querySelectorAll(".btn-install").forEach(btn => btn.addEventListener("click", popup.handleInstallPluginClick));

    // Like button
    addListener("#likeVerse", "click", popup.handleLikeVerseClick);

    // Favorites sidebar
    addListener("#openFavorites", "click", () => {
        const sidebar = document.getElementById("favoritesSidebar");
        if (sidebar) {
            sidebar.style.right = "0";
            popup.renderFavoriteVerses();
        }
    });
    addListener("#closeFavorites", "click", () => {
        const sidebar = document.getElementById("favoritesSidebar");
        if (sidebar) {
            sidebar.style.right = "-320px";
        }
    });

    // Close favorites sidebar when clicking outside
    document.addEventListener("mousedown", (e) => {
        const sidebar = document.getElementById("favoritesSidebar");
        const openBtn = document.getElementById("openFavorites");
        
        if (sidebar && sidebar.style.right === "0px") {
            if (!sidebar.contains(e.target) && !openBtn.contains(e.target)) {
                sidebar.style.right = "-320px";
            }
        }
    });

    // Design mode button
    addListener("#designModeTool", "change", popup.handleDesignModeClick);

    // Initial WordPress detection when opening the popup if the tab is already active
    const wpTabBtn = document.getElementById('but-wordpress-tab');
    if (wpTabBtn) {
        wpTabBtn.addEventListener('click', async () => {
            const results = await detectWordPress();
            updateDetectionUI(results);
        });
    }
}

// --- Storage-related Listeners and UI Restoration ---

// Setup listeners for saving form inputs to storage
function setupFormSaving(selector, saveFunction) {
    document.querySelectorAll(selector).forEach((input) => {
        input.addEventListener("change", () => {
            const values = {};
            document.querySelectorAll(selector).forEach((i) => {
                if (i.type === "checkbox" || i.type === "radio") {
                    values[i.id] = i.checked;
                } else {
                    values[i.id] = i.value;
                }
            });
            storage[saveFunction](values);
        });
    });
}

// Restore form state from storage
function restoreFormState(storageFunction) {
    storage[storageFunction]().then((data) => {
        if (data) {
            Object.keys(data).forEach((key) => {
                const input = document.querySelector(`#${key}`);
                if (input) {
                    if (input.type === "checkbox" || input.type === "radio") {
                        input.checked = data[key];
                    } else {
                        input.value = data[key];
                    }
                }
            });
        }
    });
}

export function setupStorageListeners() {
    // saving all helpers
    setupFormSaving(".helpers input, .helpers select", "saveHelpers");
    // saving all config
    setupFormSaving(".config input, .config select", "saveConfig");
    // saving resources
    setupFormSaving("#resources input", "saveResources");
    
    // clear storage listener
    // This assumes a button with id="clearStorageBtn" exists.
    // The original code for this was not provided, so this is a guess.
    addListener("#clearStorageBtn", "click", (e) => {
        if (e.ctrlKey) {
            storage.clearAllStorage();
        } else {
            storage.clearHelpers();
        }
    });
}

export function restoreUIFromStorage() {
    restoreFormState("getHelpers");
    restoreFormState("getConfig");
    restoreFormState("getResources");
}

export function setupTabMemory() {
  const tabGroups = document.querySelectorAll('[data-tab-group]');

  tabGroups.forEach(group => {
    const tabButtons = group.querySelectorAll('.nav-link[data-storage-key]');
    if (tabButtons.length === 0) return;

    const storageKey = tabButtons[0].getAttribute('data-storage-key');

    if (storageKey) {
      // Save the last clicked tab in the group
      tabButtons.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
          chrome.storage.local.set({ [storageKey]: tabButton.id });
        });
      });

      // Get and click the last saved tab in the group
      chrome.storage.local.get(storageKey, (result) => {
        const lastTabId = result[storageKey];
        if (lastTabId) {
          const lastTabButton = document.getElementById(lastTabId);
          if (lastTabButton) {
            // Use bootstrap.Tab.getOrCreateInstance to avoid conflicts
            const tabTrigger = new bootstrap.Tab(lastTabButton);
            tabTrigger.show();

            // Trigger WordPress detection if the restored tab is the WordPress tab
            if (lastTabId === 'but-wordpress-tab') {
                detectWordPress().then(updateDetectionUI);
            }
          } else {
            // If the stored ID no longer exists, click the first one
            const tabTrigger = new bootstrap.Tab(tabButtons[0]);
            tabTrigger.show();
          }
        } else {
          // If no tab was ever saved (first time), click the first one
          const tabTrigger = new bootstrap.Tab(tabButtons[0]);
          tabTrigger.show();
        }
      });
    }
  });
}
