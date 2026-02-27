import { getTabObject, sendMessage, getCurrentTab } from "./utils/chrome-api.js";
import { plugins } from "./utils/objects.js";

// --- UI Rendering ---

export function renderPluginCards() {
    const container = document.getElementById("card-container");
    if (!container) return;

    container.innerHTML = plugins.map((plugin, index) => {
        return `
        <div class="card w-100 rounded-4">
          <div class="d-flex flex-row">
            <div class="d-flex align-items-center p-3">
              <img src="${plugin.image}" class="rounded-3" width="106px!important">
            </div>
            <div class="d-flex align-items-center">
              <div class="card-body d-flex flex-column text-start p-2">
                <h5 class="fw-bold fs-6">${plugin.name}</h5>
                <p class="mb-0 truncate-3-lines" style="font-size: 0.8rem;">
                  ${plugin.description}
                </p>
              </div>
              <div class="card-body d-flex flex-column text-start gap-2 p-3">
                <button class="btn btn-primary btn-install"
                  data-index="${index}"
                  data-selector="#the-list > div.plugin-card${plugin.wordpressSelector} > div.plugin-card-top > div.action-links > ul > li:nth-child(1) > a"
                  data-link="/wp-admin/plugin-install.php?s=${encodeURIComponent(plugin.searchName || plugin.name)}&tab=search&type=term"
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="Download the plugin">
                  <img src="https://api.iconify.design/pajamas:download.svg?color=%23ffffff" style="width: 1.1rem" alt="Download">
                </button>
                <button class="btn btn-outline-primary btn-view"
                  data-selector="${plugin.wordpressSelector}"
                  data-link="/wp-admin/plugin-install.php?s=${encodeURIComponent(plugin.searchName || plugin.name)}&tab=search&type=term"
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="View the plugin">
                  <img src="https://api.iconify.design/mdi:eye.svg?color=%23a9b5ff" style="width: 1.2rem" alt="View">
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
}


// --- Event Handlers ---

export async function handleViewPluginClick(event) {
    const button = event.currentTarget;
    try {
        const tabInfo = await getTabObject();
        const domain = tabInfo.hostname;
        if (!domain) {
            alert("Could not get the domain from the current tab.");
            return;
        }

        const pluginViewURL = domain + button.dataset.link;
        const selector = button.dataset.selector;
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.id) {
            alert("No active tab found.");
            return;
        }

        await chrome.tabs.update(tab.id, { url: pluginViewURL });

        await new Promise((resolve) => {
            const listener = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (sel) => {
                const observer = new MutationObserver((_, obs) => {
                    const pluginCard = document.querySelector(sel);
                    if (pluginCard) {
                        pluginCard.classList.add("pulse-animation");
                        obs.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            },
            args: [selector],
        });
    } catch (error) {
        console.error("Error viewing plugin:", error);
        alert("An error occurred. Please try again.");
    }
}

export async function handleInstallPluginClick(event) {
    const button = event.currentTarget;
    try {
        const tabInfo = await getTabObject();
        const domain = tabInfo.hostname;
        if (!domain) {
            alert("Could not get the domain from the current tab.");
            return;
        }

        const pluginViewURL = domain + button.dataset.link;
        const selector = button.dataset.selector;
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.id) {
            alert("No active tab found.");
            return;
        }

        await chrome.tabs.update(tab.id, { url: pluginViewURL });

        await new Promise((resolve) => {
            const listener = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });

        const [result] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (sel) => {
                const el = document.querySelector(sel);
                return el ? { href: el.getAttribute("href") } : { error: `Element or href not found for selector: ${sel}` };
            },
            args: [selector],
        });

        if (result?.result?.error) {
            console.error(result.result.error);
            alert("Failed to find the download link on the page.");
            return;
        }

        const pluginInstallURL = result?.result?.href;
        if (!pluginInstallURL || !pluginInstallURL.startsWith("http")) {
            alert("Invalid URL detected.");
            return;
        }

        await chrome.tabs.update(tab.id, { url: pluginInstallURL });
    } catch (error) {
        console.error("Error installing plugin:", error);
        alert("An error occurred. Please try again.");
    }
}

export function handleLikeVerseClick() {
    const likeBtn = document.querySelector("#likeVerse");
    if (!likeBtn) return;

    const unlikePath = "img/svg/unlike.svg";
    const likePath = "img/svg/like.svg";

    let liked = likeBtn.querySelector("img").src.endsWith(likePath);
    liked = !liked;

    likeBtn.querySelector("img").src = liked ? likePath : unlikePath;
    chrome.storage.local.set({ likedVerse: liked });
}


export async function handleDesignModeClick() {
    const tab = await getCurrentTab();
    const selector = "#designModeTool";
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add("activeBut");
    }
    sendMessage(tab.id, { action: "enableDesignMode" });
}


// --- Initialization ---

export function initializeLikeButtonState() {
    const likeBtn = document.querySelector("#likeVerse");
    if (!likeBtn) return;

    const unlikePath = "img/svg/unlike.svg";
    const likePath = "img/svg/like.svg";

    chrome.storage.local.get("likedVerse", (result) => {
        let liked = result.likedVerse || false;
        likeBtn.querySelector("img").src = liked ? likePath : unlikePath;
    });
}