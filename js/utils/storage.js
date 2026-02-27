// --- Generic Storage Getters ---

function getFromStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

export function getHelpers() {
    return getFromStorage('helpers');
}

export function getConfig() {
    return getFromStorage('config');
}

export function getResources() {
    return getFromStorage('resources');
}

export function getHelper(helper) {
    return getFromStorage(helper);
}

// --- Generic Storage Setters ---

function setInStorage(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve();
        });
    });
}

export function saveHelpers(helpersInput) {
    return setInStorage('helpers', helpersInput);
}

export function saveConfig(configInput) {
    return setInStorage('config', configInput);
}

export function saveResources(resourcesInput) {
    return setInStorage('resources', resourcesInput);
}

// --- Other Storage Functions ---

export function clearAllStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.clear(() => {
            // Assuming Toast is available globally or imported elsewhere
            Toast.show("Storage limpo!", "success", 1000);
            resolve();
        });
    });
}

export function clearHelpers() {
    return new Promise((resolve) => {
        chrome.storage.local.remove("helpers", () => {
            location.reload();
            resolve();
        });
    });
}
