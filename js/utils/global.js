// Inject fallback HTML into elements if they are empty
function checkAndInjectLoader(className, fallback) {
  const mainDivs = document.querySelectorAll(className);
  mainDivs.forEach((div) => {
    if (!div.hasChildNodes() || div.innerHTML.trim() === "") {
      div.innerHTML = fallback;
    }
  });
}

checkAndInjectLoader(".main", loadingHTML);

// Initialize all Bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

// Setup copy buttons to copy content from specific selectors
function setupCopyFields() {
  document.querySelectorAll("button[data-copy-selector]").forEach((button) => {
    button.addEventListener("click", (e) => {
      const content = document.querySelector(e.target.dataset.copySelector).textContent;
      navigator.clipboard.writeText(content.trim());
    });
  });
}

setupCopyFields();

// Setup buttons that open URLs in a new browser tab based on a target element's text content
function setupOpenURL() {
  document.querySelectorAll("button[data-open-url]").forEach((button) => {
    button.addEventListener("click", () => {
      const selector = button.getAttribute("data-open-url");
      const targetElement = document.querySelector(selector);
      if (!targetElement) {
        console.warn(`Element with selector '${selector}' not found.`);
        return;
      }
      const url = targetElement.textContent.trim();
      chrome.tabs.create({ url });
    });
  });
}

setupOpenURL();

// Send data to all open tabs
function sendToAllTabs(data) {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      try {
        if (tab && tab.status === "complete") {
          sendMessage(tab.id, data);
        }
      } catch (error) {}
    });
  });
}

// Send a message to a specific tab
function sendMessage(tabId, data) {
  chrome?.tabs?.sendMessage(tabId, data, function () {
    if (chrome?.runtime?.lastError) {
      return;
    }
  });
}

// Get the currently active tab
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
