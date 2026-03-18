// Send data to all open tabs
export function sendToAllTabs(data) {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      try {
        if (tab && tab.status === "complete") {
          sendMessage(tab.id, data);
        }
      } catch (error) { }
    });
  });
}

// Send a message to a specific tab
export function sendMessage(tabId, data) {
  chrome?.tabs?.sendMessage(tabId, data, function () {
    if (chrome?.runtime?.lastError) {
      return;
    }
  });
}

// Get the currently active tab
export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Get the domain from the currently active tab
export async function getTabObject() {
  const tab = await getCurrentTab();
  if (tab && tab.url) {
    const url = new URL(tab.url);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }
    return url;
  }
  return null;
}

/**
 * Extracts the base URL of a WordPress installation.
 * If the current URL is within /wp-admin/, it returns everything up to that point.
 * Otherwise, it returns the origin.
 * @param {URL} url 
 * @returns {string}
 */
export function getWordPressBaseUrl(url) {
  if (!url) return '';
  const wpAdminIndex = url.pathname.indexOf('/wp-admin/');
  if (wpAdminIndex !== -1) {
    return url.origin + url.pathname.substring(0, wpAdminIndex + 1);
  }
  return url.origin + '/';
}


export function createNewTab(url) {
  if (url) {
    chrome.tabs.create({ url: url, active: false });
  }
}
