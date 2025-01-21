chrome.tabs.onActivated.addListener(
    activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => 
        {console.log("URL da aba ativa:", tab.url);});
});

