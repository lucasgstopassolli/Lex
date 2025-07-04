chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableDesignMode") {
    document.designMode = "on";
  }
});