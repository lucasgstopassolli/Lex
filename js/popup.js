//Plugin search
async function installRedirection() {
    const redirectionInstallUrl = ensureSlash(domain) + 'wp-admin/plugin-install.php?s=redirection&tab=search&type=term';
    chrome.tabs.update({ url: redirectionInstallUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
                target: { tabId },
                func: () => {
                    const observer = new MutationObserver((mutations, observer) => {
                        const pluginCard = document.querySelector('.plugin-card.plugin-card-redirection');
                        if (pluginCard) {
                            pluginCard.classList.add('pulse-animation');
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        }
    });
}

async function installBackup() {
    const redirectionInstallUrl = ensureSlash(domain) + 'wp-admin/plugin-install.php?s=all%2520in%2520one%2520wp&tab=search&type=term';
    chrome.tabs.update({ url: redirectionInstallUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
                target: { tabId },
                func: () => {
                    const observer = new MutationObserver((mutations, observer) => {
                        const pluginCard = document.querySelector('.plugin-card.plugin-card-all-in-one-wp-migration');
                        if (pluginCard) {
                            pluginCard.classList.add('pulse-animation');
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        }
    });
}

async function installreplaceImage() {
    const redirectionInstallUrl = ensureSlash(domain) + 'wp-admin/plugin-install.php?s=replace%2520image&tab=search&type=term';
    chrome.tabs.update({ url: redirectionInstallUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
                target: { tabId },
                func: () => {
                    const observer = new MutationObserver((mutations, observer) => {
                        const pluginCard = document.querySelector('.plugin-card.plugin-card-enable-media-replace');
                        if (pluginCard) {
                            pluginCard.classList.add('pulse-animation');
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        }
    });
}
