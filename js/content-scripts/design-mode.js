// Execute the script in page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableDesignMode") {
    document.designMode = "on";
  } else if (request.action === "disableDesignMode") {
    document.designMode = "off";
    
    // Remove contentEditable de elementos específicos que possam ter herdado
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.setAttribute('contenteditable', 'false');
    });

    // Remove o foco do elemento atual para parar a edição imediatamente
    if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
    }
  }
  sendResponse({ status: "success" });
});