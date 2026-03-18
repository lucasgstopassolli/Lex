import { getTabObject } from './chrome-api.js';

/**
 * Executes a WordPress detection script on the active tab.
 * @returns {Promise<Object>} Object with the status of each check.
 */
export async function detectWordPress() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id || !tab.url || !tab.url.startsWith('http')) {
        return null;
    }

    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const checkMeta = !!document.querySelector('meta[name="generator"][content*="WordPress"]');
                const checkAPI = !!document.querySelector('link[rel="https://api.w.org/"]');
                const checkDir = !!document.querySelector('link[href*="/wp-content/"], link[href*="/wp-includes/"], script[src*="/wp-content/"], script[src*="/wp-includes/"]');
                
                return {
                    meta: checkMeta,
                    api: checkAPI,
                    dir: checkDir
                };
            }
        });

        return results[0].result;
    } catch (error) {
        console.error("WordPress detection failed:", error);
        return null;
    }
}

/**
 * Updates the detection UI based on the results.
 * @param {Object} results 
 */
export function updateDetectionUI(results) {
    const overallStatus = document.getElementById('wp-overall-status');
    const iconStatus = document.getElementById('wordpress-icon-state')
    const statusMeta = document.getElementById('status-meta');
    const statusApi = document.getElementById('status-api');
    const statusDir = document.getElementById('status-dir');

    const wpsuccess = "https://api.iconify.design/fe:wordpress-alt.svg?color=%23c3ffc2"
    const wperror = "https://api.iconify.design/fe:wordpress-alt.svg?color=%23ffc2c2"
    const wppending = "https://api.iconify.design/fe:wordpress-alt.svg?color=%236d6e73"

    const successIcon = "https://api.iconify.design/material-symbols:check-circle-rounded.svg?color=%2323df20";
    const errorIcon = "https://api.iconify.design/ic:round-help.svg?color=%238f8f8f";
    const pendingIcon = "https://api.iconify.design/material-symbols:pending-outline.svg?color=%23ffffff";

    if (!results) {
        if (overallStatus) {
            overallStatus.textContent = "Não detectado";
            overallStatus.className = "badge bg-danger";
        }
        [statusMeta, statusApi, statusDir].forEach(el => {
            if (el) el.src = errorIcon;
        });
        return;
    }

    

    // Update individual indicators
    if (statusMeta) statusMeta.src = results.meta ? successIcon : errorIcon;
    if (statusApi) statusApi.src = results.api ? successIcon : errorIcon;
    if (statusDir) statusDir.src = results.dir ? successIcon : errorIcon;


    // Update overall status
    const isWP = results.meta || results.api || results.dir;
    
    if (overallStatus) {
        overallStatus.innerHTML = isWP ? `WordPress Detectado` : "Não é WordPress";
        overallStatus.className = isWP ? "badge bg-success" : "badge bg-danger";
    }

    if (iconStatus) {
        iconStatus.src = isWP ? wpsuccess : wperror;
        iconStatus.className = isWP ? 'idle-state-success' : 'idle-state-error';
    }
}
