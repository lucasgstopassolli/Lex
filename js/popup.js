// Listing plugin cards
const container = document.getElementById("card-container");
plugins.forEach((plugin, index) => {
  const card = document.createElement("div");
  card.className = "card w-100 rounded-4";

  card.innerHTML = `
  <div class="d-flex flex-row">
      <div class="d-flex align-items-center p-3">
          <img src="${plugin.image}" class="rounded-3" width="106px!important">
      </div>
      <div class="d-flex align-items-center">
          <div class="card-body d-flex flex-column text-start p-2">
              <h5 class="fw-bold fs-6">${plugin.name}</h5>
              <p class="mb-0 truncate-3-lines" style="font-size: 0.8rem;">${
                plugin.description
              }</p>
          </div>
          <div class="card-body d-flex flex-column text-start gap-2 p-3">
              <button class="btn btn-primary btn-install" data-index="${index}" data-selector="#the-list > div.plugin-card${
    plugin.wordpressSelector
  } > div.plugin-card-top > div.action-links > ul > li:nth-child(1) > a" data-link="/wp-admin/plugin-install.php?s=${encodeURIComponent(
    plugin.searchName || plugin.name
  )}&tab=search&type=term" data-bs-toggle="tooltip" data-bs-placement="left" title="Baixar o plugin">
                  <img src="svg/download.svg" style="width: 1.2rem" alt="Download">
              </button>
              <button class="btn btn-outline-primary btn-view" data-selector="${
                plugin.wordpressSelector
              }" data-link="/wp-admin/plugin-install.php?s=${encodeURIComponent(
    plugin.searchName || plugin.name
  )}&tab=search&type=term" data-bs-toggle="tooltip" data-bs-placement="left" title="Ver o plugin">
                  <img src="svg/view.svg" style="width: 1.2rem" alt="View">
              </button>
          </div>
      </div>
  </div>
`;

  container.appendChild(card);
});

// View button functionality
const btnView = document.querySelectorAll(".btn-view");
btnView.forEach((button) => {
  button.addEventListener("click", () => {
    const pluginViewURL = domain + button.dataset.link;
    const selector = button.dataset.selector;

    chrome.storage.local.set({ pluginViewURL, selector });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { url: pluginViewURL });
      }
    });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);

        chrome.storage.local.get(
          ["pluginInstallURL", "selector"],
          function (data) {
            if (data.pluginInstallURL && data.selector) {
              chrome.scripting.executeScript({
                target: { tabId },
                func: (selector) => {
                  const observer = new MutationObserver((_, observer) => {
                    const pluginCard = document.querySelector(selector);
                    if (pluginCard) {
                      pluginCard.classList.add("pulse-animation");
                      observer.disconnect();
                    }
                  });
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                  });
                },
                args: [data.selector],
              });
            }
          }
        );
      }
    });
  });
});

// Install button functionality
const btnInstall = document.querySelectorAll(".btn-install");
btnInstall.forEach((button) => {
  button.addEventListener("click", async () => {
    // Ensure domain is defined
    if (typeof domain === "undefined") {
      alert("Domain is not defined.");
      return;
    }
    // Ensure Chrome APIs are available
    if (!chrome || !chrome.tabs || !chrome.scripting) {
      alert("Chrome extension APIs are not available.");
      return;
    }

    const pluginViewURL = domain + button.dataset.link;
    const selector = button.dataset.selector;

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        alert("No active tab found.");
        return;
      }

      await chrome.tabs.update(tab.id, { url: pluginViewURL });

      // Wait for the tab to finish loading
      await new Promise((resolve) => {
        const listener = (tabId, changeInfo) => {
          if (tabId === tab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });

      // Execute script in tab
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (sel) => {
          const el = document.querySelector(sel);
          if (el && el.getAttribute("href")) {
            return { href: el.getAttribute("href") };
          }
          return { error: `Element or href not found for selector: ${sel}` };
        },
        args: [selector],
      });

      // Handle result
      if (result?.result?.error) {
        console.error(result.result.error);
        alert("Failed to find the download link on the page.");
        return;
      }

      const pluginInstallURL = result?.result?.href;
      if (!pluginInstallURL) {
        throw new Error("No valid URL returned.");
      }

      // Validate URL (basic check)
      if (!pluginInstallURL.startsWith("http")) {
        alert("Invalid URL detected.");
        return;
      }

      // Navigate to URL
      await chrome.tabs.update(tab.id, { url: pluginInstallURL });
    } catch (error) {
      console.error("Error installing plugin:", error);
      alert("An error occurred. Please try again.");
    }
  });
});

//Like button
const likeBtn = document.querySelector("#likeVerse");
const unlikePath = "svg/unlike.svg";
const likePath = "svg/like.svg";
chrome.storage.local.get("likedVerse", (result) => {
  let liked = result.likedVerse || false;

  if (likeBtn) {
    likeBtn.querySelector("img").src = liked ? likePath : unlikePath;
    likeBtn.addEventListener("click", () => {
      liked = !liked;
      likeBtn.querySelector("img").src = liked ? likePath : unlikePath;
      chrome.storage.local.set({ likedVerse: liked });
    });
  }
});

// Design Mode input Popup
function syncCheckedState(selector, callback) {
  const checkInput = document.querySelector(selector);
  if (!checkInput) return;

  chrome.storage.local.get([selector], (result) => {
    const checked = result[selector] !== undefined ? result[selector] : checkInput.checked;
    checkInput.checked = checked;
    if (callback) callback(checked);
  });

  checkInput.addEventListener("change", () => {
    chrome.storage.local.set({ [selector]: checkInput.checked });
    if (callback) callback(checkInput.checked);
  });
}

function toggleDesignMode(enabled) {
  document.designMode = enabled ? "on" : "off";
}

syncCheckedState("#checkDesignMode", toggleDesignMode);

// sendToAllTabs({ 'ativarDesignMode' });

// Design Mode input Page
document.querySelector('#designModeTool').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    document.querySelector('#designModeTool').classList.add('activeBut');
    sendMessage(tab.id, {action: 'enableDesignMode'});
});