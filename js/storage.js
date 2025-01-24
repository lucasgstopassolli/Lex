// // saving the last opened tab
// document.querySelectorAll('#tabs a').forEach(function(tab) {
//     tab.addEventListener('click', function(e) {
//         chrome.storage.local.set({lastTab: tab.id});
//     });
// });
// document.querySelectorAll('#tabsTools a').forEach(function(tab) {
//     tab.addEventListener('click', function(e) {
//         chrome.storage.local.set({lastTab: 'tabTools'});
//         chrome.storage.local.set({lastTabTool: tab.id});
//     });
// });

// getting the last opened tab
// chrome.storage.local.get('lastTab', function(result) {
//     if (result.lastTab) {
//         document.querySelector('#tabs #' + result.lastTab)?.click();

//         // if the last tab is tabTools, then we need to get the last opened tool
//         if (result.lastTab == 'tabTools') {
//             chrome.storage.local.get('lastTabTool', function(result) {
//                 if (result.lastTabTool) {
//                     document.querySelector('#tabsTools #' + result.lastTabTool)?.click();
//                 }
//             });
//         }
//     }
// });

// saving all helpers
document.querySelectorAll('.helpers input, .helpers select').forEach(function(input) {
    input.addEventListener('change', function(e) {
        helpersInput = {};
        document.querySelectorAll('.helpers input, .helpers select').forEach(function(input) {
             if (input?.type == 'checkbox' || input?.type == 'radio') {
                helpersInput[input.id] = input.checked;
            } else {
                helpersInput[input.id] = input.value;
            }
        });
        chrome.storage.local.set({helpers: helpersInput});
    });
});

// saving all config
document.querySelectorAll('.config input, .config select').forEach(function(input) {
    input.addEventListener('change', function(e) {
        configInput = {};
        document.querySelectorAll('.config input, .config select').forEach(function(input) {
            if (input?.type == 'radio') {
                if (input.checked) {
                    configInput[input.name] = input.value;
                }
            } else if (input?.type == 'checkbox' || input?.type == 'radio') {
                configInput[input.id] = input.checked;
            } else {
                configInput[input.id] = input.value;
            }
        });
        chrome.storage.local.set({config: configInput});
    });
});


function getHelpers(){
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get('helpers', function(result) {
            resolve(result.helpers);
        }.bind(this));
    }.bind(this));
}

function getConfig(){
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get('config', function(result) {
            resolve(result.config);
        }.bind(this));
    }.bind(this));
}

// getting helpers
getHelpers().then(function(helpers) {
    if (helpers) {
        Object.keys(helpers).forEach(function(key) {
            if(input = document.querySelector('#' + key)){
                if (input.type == 'checkbox' || input.type == 'radio') {
                    input.checked = helpers[key];
                } else {
                    input.value = helpers[key];
                }
            }
        });
    }
});

// getting configs
getConfig().then(function(config) {
    if (config) {
        Object.keys(config).forEach(function(key) {
            if(document.querySelector('#' + key)){
                if(input = document.querySelector('#' + key)){
                    if (input.type == 'checkbox' || input.type == 'radio') {
                        input.checked = config[key];
                    } else {
                        input.value = config[key];
                    }
                }
            } else if(input = document.querySelector('[name="' + key + '"][value="' + config[key] + '"]')){
                input.checked = true;
            }
        });
    }
});

// clear storage
function clearStorage(e) {
    //detect if control key is pressed
    if (e.ctrlKey) {
        chrome.storage.local.clear();
        Toast.show("Storage limpo!", "success", 1000);
    } else {
        chrome.storage.local.remove('helpers')
        location.reload();
    }
}


// saving resources
document.querySelectorAll('#resources input').forEach(function(input) {
    input.addEventListener('change', function(e) {
        resourcesInput = {};
        document.querySelectorAll('#resources input').forEach(function(input) {
            if (input?.type == 'checkbox' || input?.type == 'radio') {
                resourcesInput[input.id] = input.checked;
            } else {
                resourcesInput[input.id] = input.value;   
            }
        });
        chrome.storage.local.set({resources: resourcesInput});
    });
});

// getting resources
chrome.storage.local.get('resources', function(result) {
    if (result.resources) {
        Object.keys(result.resources).forEach(function(key) {
            if(input = document.querySelector('#' + key)){
                if (input.type == 'checkbox' || input.type == 'radio') {
                    input.checked = result.resources[key];
                } else {
                    input.value = result.resources[key];
                }
            }
        });
    }
});

// get helper
function getHelper(helper) {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(helper, function(result) {
            resolve(result[helper]);
        }.bind(this));
    }.bind(this));
}

