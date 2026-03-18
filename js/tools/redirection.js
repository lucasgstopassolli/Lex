import { getCurrentTab, getTabObject, getWordPressBaseUrl } from '../utils/chrome-api.js';
import { alertTrigger, getAlertConfig } from '../utils/dom.js';
import { detectWordPress } from '../utils/wordpress.js';

function ensureSlash(termUrl) {
    if (!termUrl) return '';
    return termUrl.endsWith('/') ? termUrl : termUrl + '/';
}

async function checkRedirectionPlugin(wpBase) {
    const loader = document.getElementById('redirect-loader');
    const errorMsg = document.getElementById('redirect-error-msg');
    const notWpMsg = document.getElementById('redirect-not-wp-msg');
    const content = document.getElementById('redirect-content');
    const placeholder = document.getElementById('redirect-placeholder');

    errorMsg?.classList.add('d-none');
    notWpMsg?.classList.add('d-none');

    if (!wpBase) {
        loader?.classList.add('d-none');
        notWpMsg?.classList.remove('d-none');
        return false;
    }

    try {
        const checkUrl = ensureSlash(wpBase) + "wp-admin/tools.php?page=redirection.php";
        const response = await fetch(checkUrl, { method: 'GET', credentials: 'include' });

        if (response.ok && response.status === 200) {
            placeholder?.classList.add('d-none');
            content?.classList.remove('d-none');
            content?.classList.add('d-flex');
            return true;
        } else {
            loader?.classList.add('d-none');
            errorMsg?.classList.remove('d-none');
            return false;
        }
    } catch (error) {
        loader?.classList.add('d-none');
        errorMsg?.classList.remove('d-none');
        return false;
    }
}

async function createRedirect(inputUrl, outputUrl) {
    const tabInfo = await getTabObject();
    const wpBase = getWordPressBaseUrl(tabInfo);
    if (!wpBase) {
        alertTrigger(getAlertConfig("domainNotAvailable"));
        return;
    }

    const redirectionUrl = ensureSlash(wpBase) + "wp-admin/tools.php?page=redirection.php";
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.tabs.update(tab.id, { url: redirectionUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            injectAndCreate(tab.id, inputUrl, outputUrl);
        }
    });
}

async function injectAndCreate(tabId, inputUrl, outputUrl) {
    const tabInfo = await getTabObject();
    const wpBase = getWordPressBaseUrl(tabInfo);
    try {
        const [{ result: nonce }] = await chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: () => window.Redirectioni10n?.api?.WP_API_nonce || '',
        });

        if (!nonce) return;

        await chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: (wpBase, inputUrl, outputUrl, nonce) => {
                fetch(wpBase + "wp-json/redirection/v1/redirect/", {
                    headers: {
                        "accept": "application/json, */*;q=0.1",
                        "content-type": "application/json; charset=utf-8",
                        "x-wp-nonce": nonce,
                    },
                    body: JSON.stringify({
                        id: 0,
                        url: inputUrl,
                        title: "",
                        match_data: {
                            source: {
                                flag_regex: false,
                                flag_trailing: true,
                                flag_case: true,
                                flag_query: "exact"
                            },
                            options: {}
                        },
                        match_type: "url",
                        action_type: "url",
                        position: 0,
                        group_id: 1,
                        action_code: 301,
                        action_data: { url: outputUrl }
                    }),
                    method: "POST",
                    mode: "cors",
                    credentials: "include"
                }).then(() => window.location.reload())
                .catch(error => console.error("Request error:", error));
            },
            args: [ensureSlash(wpBase), inputUrl, outputUrl, nonce]
        });
    } catch (error) {
        console.error("Error retrieving nonce or sending redirect:", error);
    }
}

export function handleRedirectEvent(event) {
    event.preventDefault();
    const inputUrl = document.getElementById('inputUrl').value;
    const outputUrl = document.getElementById('outputUrl').value;

    if (inputUrl && outputUrl) {
        alertTrigger(getAlertConfig("waitRedirect"));
        createRedirect(inputUrl, outputUrl);
    } else {
        alertTrigger(getAlertConfig("fillBothRedirectFields"));
    }
}

export async function initializeRedirectionTool() {
    const tabUrl = await getTabObject();
    const loader = document.getElementById('redirect-loader');
    const errorMsg = document.getElementById('redirect-error-msg');
    const notWpMsg = document.getElementById('redirect-not-wp-msg');
    const content = document.getElementById('redirect-content');
    const placeholder = document.getElementById('redirect-placeholder');

    // Hide all states first
    errorMsg?.classList.add('d-none');
    notWpMsg?.classList.add('d-none');
    content?.classList.add('d-none');
    placeholder?.classList.remove('d-none');
    loader?.classList.remove('d-none');

    if (tabUrl && tabUrl.hostname) {
        try {
            const wpDetection = await detectWordPress();
            const isWP = wpDetection && (wpDetection.meta || wpDetection.api || wpDetection.dir);

            if (!isWP) {
                loader?.classList.add('d-none');
                notWpMsg?.classList.remove('d-none');
                return;
            }

            const wpBase = getWordPressBaseUrl(tabUrl);
            const slug = tabUrl.pathname;
            const url = tabUrl.href;

            document.getElementById('url_domain').value = wpBase;
            document.getElementById('inputUrl').value = slug;
            document.getElementById('url_').value = ensureSlash(url);
            if (document.getElementById('outputUrl').value === '') {
                document.getElementById('outputUrl').value = '/';
            }

            // Verify if the plugin is actually there
            await checkRedirectionPlugin(wpBase);
        } catch (e) {
            await checkRedirectionPlugin(null);
        }
    } else {
        loader?.classList.add('d-none');
        notWpMsg?.classList.remove('d-none');
    }
}

