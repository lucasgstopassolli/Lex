import { getTabObject, sendMessage, getCurrentTab } from "./utils/chrome-api.js";
import { plugins } from "./utils/objects.js";
import { alertTrigger, getAlertConfig } from "./utils/dom.js";

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
        if (!tabInfo?.origin) {
            alertTrigger(getAlertConfig("domainNotAvailable"));
            return;
        }

        const pluginViewURL = new URL(button.dataset.link, tabInfo.origin).href;
        const selector = button.dataset.selector;
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.id) {
            alertTrigger(getAlertConfig("noActiveTab"));
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
        alertTrigger(getAlertConfig("unexpectedError"));
    }
}

export async function handleInstallPluginClick(event) {
    const button = event.currentTarget;
    try {
        const tabInfo = await getTabObject();
        if (!tabInfo?.origin) {
            alertTrigger(getAlertConfig("domainNotAvailable"));
            return;
        }

        const pluginViewURL = new URL(button.dataset.link, tabInfo.origin).href;
        const selector = button.dataset.selector;
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.id) {
            alertTrigger(getAlertConfig("noActiveTab"));
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
            alertTrigger(getAlertConfig("downloadLinkNotFound"));
            return;
        }

        const pluginInstallURL = result?.result?.href;
        if (!pluginInstallURL || !pluginInstallURL.startsWith("http")) {
            alertTrigger(getAlertConfig("invalidUrl"));
            return;
        }

        await chrome.tabs.update(tab.id, { url: pluginInstallURL });
    } catch (error) {
        console.error("Error installing plugin:", error);
        alertTrigger(getAlertConfig("unexpectedError"));
    }
}

export function handleLikeVerseClick() {
    const likeBtn = document.querySelector("#likeVerse");
    const verseContainer = document.querySelector('.verse-container');
    if (!likeBtn || !verseContainer || !verseContainer.dataset.bookId) return;

    const unlikePath = "img/svg/unlike.svg";
    const likePath = "img/svg/like.svg";

    const verseData = {
        book: verseContainer.dataset.book,
        verse: verseContainer.dataset.verse,
        content: verseContainer.dataset.content,
        bookId: verseContainer.dataset.bookId,
        chapter: verseContainer.dataset.chapter,
        id: `${verseContainer.dataset.bookId}-${verseContainer.dataset.chapter}-${verseContainer.dataset.verse}`
    };

    chrome.storage.local.get("favoriteVerses", (result) => {
        let favorites = result.favoriteVerses || [];
        const index = favorites.findIndex(v => v.id === verseData.id);
        let liked;

        if (index === -1) {
            favorites.push(verseData);
            liked = true;
        } else {
            favorites.splice(index, 1);
            liked = false;
        }

        chrome.storage.local.set({ favoriteVerses: favorites }, () => {
            likeBtn.querySelector("img").src = liked ? likePath : unlikePath;
            renderFavoriteVerses();
        });
    });
}


export async function handleDesignModeClick() {
    const tab = await getCurrentTab();
    const switchEl = document.querySelector("#designModeTool");
    const statusText = document.querySelector("#designModeStatus");
    const container = document.querySelector("#designModeContainer");
    
    if (!switchEl) return;

    const isEnabled = switchEl.checked;
    chrome.storage.local.set({ designModeEnabled: isEnabled });

    // Update Visual UI
    if (statusText) {
        statusText.textContent = isEnabled ? "Edição de página ATIVADA" : "Edição de página desativada";
        statusText.style.opacity = isEnabled ? "1" : "0.4";
        statusText.style.color = isEnabled ? "var(--primary-300)" : "white";
    }

    if (container) {
        container.style.borderColor = isEnabled ? "var(--primary-500)" : "var(--transparency-20)";
        container.style.backgroundColor = isEnabled ? "var(--transparency-20)" : "var(--transparency-10)";
    }
    
    if (tab?.id) {
        const action = isEnabled ? "enableDesignMode" : "disableDesignMode";
        chrome.tabs.sendMessage(tab.id, { action: action });
    }
}

export function initializeDesignModeState() {
    const switchEl = document.querySelector("#designModeTool");
    if (!switchEl) return;

    chrome.storage.local.get("designModeEnabled", async (result) => {
        const isEnabled = result.designModeEnabled || false;
        switchEl.checked = isEnabled;
        
        // Sync initial visual state
        handleDesignModeClick();
    });
}

export function renderFavoriteVerses() {
    const container = document.getElementById("favorites-container");
    if (!container) return;

    chrome.storage.local.get("favoriteVerses", (result) => {
        const favorites = result.favoriteVerses || [];
        if (favorites.length === 0) {
            container.innerHTML = '<p class="text-center opacity-50 mt-4">Nenhum versículo favorito ainda.</p>';
            return;
        }

        container.innerHTML = favorites.map((verse) => `
            <div class="favorite-item p-3 mb-2 rounded-3 border border-primary-900" style="background: var(--transparency-10)">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0 text-primary-300">${verse.book} ${verse.verse}</h6>
                    <button class="btn btn-sm p-0 remove-favorite" data-id="${verse.id}" style="border:none; background:transparent">
                        <img src="https://api.iconify.design/material-symbols:close-rounded.svg?color=%23ff4d4d" width="16">
                    </button>
                </div>
                <p class="mb-0 small opacity-75" style="font-size: 0.85rem">${verse.content}</p>
            </div>
        `).join('');

        container.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                removeFavoriteVerse(id);
            });
        });
    });
}

function removeFavoriteVerse(id) {
    chrome.storage.local.get("favoriteVerses", (result) => {
        let favorites = result.favoriteVerses || [];
        favorites = favorites.filter(v => v.id !== id);
        chrome.storage.local.set({ favoriteVerses: favorites }, () => {
            renderFavoriteVerses();
            const verseContainer = document.querySelector('.verse-container');
            if (verseContainer) {
                const currentId = `${verseContainer.dataset.bookId}-${verseContainer.dataset.chapter}-${verseContainer.dataset.verse}`;
                if (currentId === id) {
                    const likeBtn = document.querySelector("#likeVerse");
                    if (likeBtn) {
                        likeBtn.querySelector("img").src = "img/svg/unlike.svg";
                    }
                }
            }
        });
    });
}

// --- Initialization ---

export function initializeLikeButtonState() {
    const likeBtn = document.querySelector("#likeVerse");
    const verseContainer = document.querySelector('.verse-container');
    if (!likeBtn) return;

    const checkState = () => {
        if (!verseContainer || !verseContainer.dataset.bookId) {
            setTimeout(checkState, 100);
            return;
        }

        const verseId = `${verseContainer.dataset.bookId}-${verseContainer.dataset.chapter}-${verseContainer.dataset.verse}`;
        const unlikePath = "img/svg/unlike.svg";
        const likePath = "img/svg/like.svg";

        chrome.storage.local.get("favoriteVerses", (result) => {
            const favorites = result.favoriteVerses || [];
            const liked = favorites.some(v => v.id === verseId);
            likeBtn.querySelector("img").src = liked ? likePath : unlikePath;
        });
    };

    checkState();
    renderFavoriteVerses();
    initializeDesignModeState();
}
