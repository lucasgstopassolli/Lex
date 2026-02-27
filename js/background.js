import { createNewTab } from "./utils/chrome-api.js";

chrome.commands.onCommand.addListener((command) => {
    if (command === "open-popup") {
        chrome.action.openPopup();
    }

});
chrome.runtime.onMessage.addListener((command) => {
    if (command.message === "create-new-tab") {
        createNewTab(command.url);
    }
});
