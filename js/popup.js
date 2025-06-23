//Plugin search
async function installRedirection() {
  const redirectionInstallUrl =
    ensureSlash(domain) +
    "wp-admin/plugin-install.php?s=redirection&tab=search&type=term";
  chrome.tabs.update({ url: redirectionInstallUrl });

  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    if (changeInfo.status === "complete") {
      chrome.tabs.onUpdated.removeListener(listener);
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const observer = new MutationObserver((mutations, observer) => {
            const pluginCard = document.querySelector(
              ".plugin-card.plugin-card-redirection"
            );
            if (pluginCard) {
              pluginCard.classList.add("pulse-animation");
              observer.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        },
      });
    }
  });
}

async function installBackup() {
  const redirectionInstallUrl =
    ensureSlash(domain) +
    "wp-admin/plugin-install.php?s=all%2520in%2520one%2520wp&tab=search&type=term";
  chrome.tabs.update({ url: redirectionInstallUrl });

  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    if (changeInfo.status === "complete") {
      chrome.tabs.onUpdated.removeListener(listener);
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const observer = new MutationObserver((mutations, observer) => {
            const pluginCard = document.querySelector(
              ".plugin-card.plugin-card-all-in-one-wp-migration"
            );
            if (pluginCard) {
              pluginCard.classList.add("pulse-animation");
              observer.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        },
      });
    }
  });
}

async function installreplaceImage() {
  const redirectionInstallUrl =
    ensureSlash(domain) +
    "wp-admin/plugin-install.php?s=replace%2520image&tab=search&type=term";
  chrome.tabs.update({ url: redirectionInstallUrl });

  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    if (changeInfo.status === "complete") {
      chrome.tabs.onUpdated.removeListener(listener);
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const observer = new MutationObserver((mutations, observer) => {
            const pluginCard = document.querySelector(
              ".plugin-card.plugin-card-enable-media-replace"
            );
            if (pluginCard) {
              pluginCard.classList.add("pulse-animation");
              observer.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        },
      });
    }
  });
}

// //Defines the relationship betwenn the button and the field
// function setupCopyFields(elementToCopy) {
//   if (!elementToCopy.button || !elementToCopy.input) {
//     window.alert("Botão ou campo não encontrado!");
//     return;
//   }

//   elementToCopy.button.addEventListener("click", () =>
//     copyToClipboard(elementToCopy.input)
//   );
// }

// //Copy to the clipboard
// function copyToClipboard(inputElement) {
//   if (!inputElement) {
//     window.alert("Não foi possível copiar!");
//   } else {
//     navigator.clipboard.writeText(inputElement.value);
//   }
// }

// //Initializate the objects (objects.js)
// function initializateCopyFields() {
//   setupCopyFields(copyFieldElements.colorRGB);
// }

// initializateCopyFields();

// Listing plugin cards
const container = document.getElementById("card-container");

plugins.forEach((plugin) => {
  const card = document.createElement("div");
  card.className = "card w-100 rounded-4";

  card.innerHTML = `
  <div class="d-flex flex-row">
      <div class="d-flex align-items-center p-3 bg">
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
              <button class="btn btn-primary">
                  <img src="svg/download.svg" style="width: 1.2rem" alt="Download">
              </button>
              <button class="btn btn-outline-primary btn-view" data-link="/wp-admin/plugin-install.php?s=${encodeURIComponent(
                plugin.searchName || plugin.name
              )}&tab=search&type=term">
                  <img src="svg/view.svg" style="width: 1.2rem" alt="View">
              </button>
          </div>
      </div>
  </div>
`;

  container.appendChild(card);
});

// Attach event listeners to ".btn-view" buttons after all cards are created
document.querySelectorAll(".btn-view").forEach((button) => {
  button.addEventListener("click", () => {
    const pluginInstallURL = domain + button.dataset.link;
    // Abrir nova aba com o link
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { url: pluginInstallURL });
      }
    });
  });
});
