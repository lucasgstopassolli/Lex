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
    return url
  } else {console.log('Ocorreu um erro inesperado...')}
}


export function createNewTab(url) {
  if (url) {
    chrome.tabs.create({ url: url, active: false });
  } else {console.log('Algo deu errado...')}
}


