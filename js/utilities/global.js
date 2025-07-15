//Fallback content for empty divs
const loadingHTML = `
    <div class="d-flex flex-column p-5 align-items-center justify-content-center w-100">
        <svg version="1.1" id="L7" style="width: 4rem;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><path fill="currentColor" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
        c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="2s" from="0 50 50" to="360 50 50" repeatCount="indefinite"/></path><path fill="currentColor" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
        c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="-360 50 50" repeatCount="indefinite"/></path><path fill="currentColor" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
        L82,35.7z"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="2s" from="0 50 50" to="360 50 50" repeatCount="indefinite"/></path></svg>
        <p class="fs-5 text-uppercase fw-bold">Recurso em Construção</p>
    </div>
`;


function checkAndInjectLoader(className, fallback) {
  const mainDivs = document.querySelectorAll(className);
  mainDivs.forEach((div) => {
    if (!div.hasChildNodes() || div.innerHTML.trim() === "") {
      div.innerHTML = fallback;
    }
  });
}
checkAndInjectLoader(".main", loadingHTML);

// Initialize Bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (el) => new bootstrap.Tooltip(el)
);

//Defines the relationship betwenn the button and the field
function setupCopyFields() {
  document.querySelectorAll("button[data-copy-selector]").forEach((button) => {
    button.addEventListener("click", (e) => {
      const content = document.querySelector(
        e.target.dataset.copySelector
      ).textContent;
      navigator.clipboard.writeText(content.trim());
    });
  });
}

setupCopyFields();

//Send a command to all tabs
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

//Send a message
function sendMessage(tabId, data) {
  chrome?.tabs?.sendMessage(tabId, data, function () {
    if (chrome?.runtime?.lastError) {
      return;
    }
  });
}

//Get the current tab
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
