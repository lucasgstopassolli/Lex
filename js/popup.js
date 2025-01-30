document.addEventListener("DOMContentLoaded", function () {
    // Define o estado inicial
    document.getElementById("initial-tab").classList.add("active");
    document.getElementById("initialButton").classList.add("active");
    document.addEventListener("click", function (event) {
        let idTab = event.target.id;
        // Lista de botões válidos
        const buttons = [...document.querySelectorAll(".tab-button")].map(btn => btn.id);
        // Se clicou fora dos botões, não faz nada (mantém o ativo)
        if (!buttons.includes(idTab)) return;
        // Remove 'active' de todos os botões
        document.querySelectorAll(".tab-button").forEach((tabButton) => {
            tabButton.classList.remove("active");
        });
        // Ativa o botão clicado
        document.getElementById(idTab).classList.add("active");
        // Mapeia qual aba deve abrir
        const tabOpen = {
            'initialButton': () => { document.getElementById("initial-tab").classList.add("active"); },
            'redirectionButton': () => { document.getElementById("redirection-tab").classList.add("active"); }
        };
        // Remove 'active' das abas e ativa a correta
        if (tabOpen[idTab]) {
            document.querySelectorAll(".tab").forEach((tab) => { tab.classList.remove("active"); });
            tabOpen[idTab]();
        }
    });
});

let domain, slug, url, nonce;

// Verificação se tem barra final
function ensureSlash(termUrl) {
    return termUrl.endsWith('/') ? termUrl : termUrl + '/';
}

// Função para pegar o domínio, slug e url
function getDomainAndSlug() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const urlObj = new URL(tabs[0].url); // Obtemos a URL da aba ativa
        domain = urlObj.origin;  // Atribui o domínio globalmente
        slug = urlObj.pathname;  // Atribui o slug globalmente
        url = urlObj.href;  // Atribui a URL completa globalmente
        
        // Atualiza os campos no popup com as variáveis globais
        document.getElementById('url_domain').value = domain;
        document.getElementById('inputUrl').value = slug;
        document.getElementById('url_').value = ensureSlash(url);
        if (document.getElementById('outputUrl').value == ''){
            document.getElementById('outputUrl').value = '/';
        }
    });
}
// Pegar o nonce da página
async function getNonce() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0].id;
    const result = await chrome.scripting.executeScript({
        target: { tabId },
        func: function () {
            return Redirectioni10n.api.WP_API_nonce;
        },
        world: 'MAIN', // Executa no contexto principal para acessar variáveis da página
    });
    return result[0]?.result || '';
}

// Atualiza o valor do campo nonceValue após o carregamento da página
document.addEventListener('DOMContentLoaded', async function () {
    getDomainAndSlug();  
    const nonceInput = document.getElementById('nonceValue');

    if (nonceInput && !nonceInput.value) { // Só altera se o campo estiver vazio
        const nonce = await getNonce();
        if (nonce) {
            nonceInput.value = nonce;
            nonceInput.dispatchEvent(new Event('change'));
        }
    }
});



// Função para criar o redirecionamento 
async function createRedirect(inputUrl, outputUrl) {
    if (!domain) {
        alert('Domínio não disponível');
        return;
    }

    let redirectionUrl = ensureSlash(domain) + "wp-admin/tools.php?page=redirection.php";
    chrome.tabs.update({ url: redirectionUrl });

    try {
        // Aguarde o nonce antes de enviar a requisição
        const nonce = document.getElementById('nonceValue').value; // Aguarda o nonce ser recuperado
        fetch(ensureSlash(domain) + "wp-json/redirection/v1/redirect/", {
            headers: {
                "accept": "application/json, */*;q=0.1",
                "content-type": "application/json; charset=utf-8",
                "x-wp-nonce": nonce,
            },
            body: JSON.stringify({
                "id": 0,
                "url": inputUrl,
                "title": "",
                "match_data": {
                    "source": {
                        "flag_regex": false,
                        "flag_trailing": true,
                        "flag_case": true,
                        "flag_query": "exact"
                    },
                    "options": {}
                },
                "match_type": "url",
                "action_type": "url",
                "position": 0,
                "group_id": 1,
                "action_code": 301,
                "action_data": { "url": outputUrl }
            }),
            method: "POST",
            mode: "cors",
            credentials: "include"
        }).then(() => window.location.reload())
        .catch(error => console.error("Erro na requisição:", error));
    } catch (error) {
        console.error("Erro ao obter nonce:", error);
    }
}


// Adiciona evento de clique no botão "Criar redirect"
function handleRedirectEvent(event) {
    debugger;
    event.preventDefault();

    const inputUrl = document.getElementById('inputUrl').value;
    const outputUrl = document.getElementById('outputUrl').value;

    if (inputUrl && outputUrl) {
        createRedirect(inputUrl, outputUrl);
    } else {
        alert('Preencha os campos');
    }
}

// Adiciona evento de clique no botão "Criar redirect"
document.getElementById('redirectBtn').addEventListener('click', function (event) {
    event.preventDefault();

    const inputUrl = document.getElementById('inputUrl').value;
    const outputUrl = document.getElementById('outputUrl').value;

    if (inputUrl && outputUrl) {
        createRedirect(inputUrl, outputUrl);
    } else {
        alert('Preencha os campos');
    }
});

// Função para instalar o plugin Redirection
// async function installRedirection() {
//     // Instalação do plugin
//     let redirectionInstallUrl = ensureSlash(domain) + "wp-admin/plugin-install.php?s=redirection&tab=search&type=term";
//     chrome.tabs.update({ url: redirectionInstallUrl });

//     const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//     const tabId = tabs[0].id;

//     await chrome.scripting.executeScript({
//         target: { tabId },

//         func: function() {
//             const buttonInstall = "#the-list > div.plugin-card.plugin-card-redirection > div.plugin-card-top > div.action-links > ul > li:nth-child(1) > a";
//             const buttonActivate = "#the-list > div.plugin-card.plugin-card-redirection > div.plugin-card-top > div.action-links > ul > li:nth-child(1) > .button.activate-now.button-primary";

//             // Função para esperar um elemento aparecer no DOM
//             function waitForElement(selector, callback) {
//                 const observer = new MutationObserver((_, me) => {
//                     if (document.querySelector(selector)) {
//                         callback();
//                         me.disconnect();
//                         return;
//                     }
//                 });

//                 observer.observe(document, {
//                     childList: true,
//                     subtree: true
//                 });
//             }

//             // Clica no primeiro elemento para instalar
//             document.querySelector(buttonInstall).click();

//             // Espera o próximo elemento aparecer e clica nele
//             waitForElement(buttonActivate, () => {
//                 document.querySelector(buttonActivate).click();
//             });
//         },
//         world: 'MAIN', // to run in the window context and to be able to access variables from the page
//     });
// }

// // Função para esperar um elemento aparecer no DOM
// function waitForElement(selector, callback) {
//     const observer = new MutationObserver((mutations, me) => {
//         if (document.querySelector(selector)) {
//             callback();
//             me.disconnect();
//             return;
//         }
//     });

//     observer.observe(document, {
//         childList: true,
//         subtree: true
//     });
// }

// document.addEventListener('DOMContentLoaded', async function () {
//     const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//     const tabId = tabs[0].id;

//     await chrome.scripting.executeScript({
//         target: { tabId },
//     });

//     document.querySelector(".plugin-card.plugin-card-redirection").classList.add("pulse-animation");
// });

//Pesquisa o plugin
async function installRedirection() {
    const redirectionInstallUrl = ensureSlash(domain) + 'wp-admin/plugin-install.php?s=redirection&tab=search&type=term';
    chrome.tabs.update({ url: redirectionInstallUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
                target: { tabId },
                func: () => {
                    const observer = new MutationObserver((mutations, observer) => {
                        const pluginCard = document.querySelector('.plugin-card.plugin-card-redirection');
                        if (pluginCard) {
                            pluginCard.classList.add('pulse-animation');
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        }
    });
}

async function installBackup() {
    const redirectionInstallUrl = ensureSlash(domain) + 'wp-admin/plugin-install.php?s=all%2520in%2520one%2520wp&tab=search&type=term';
    chrome.tabs.update({ url: redirectionInstallUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
                target: { tabId },
                func: () => {
                    const observer = new MutationObserver((mutations, observer) => {
                        const pluginCard = document.querySelector('.plugin-card.plugin-card-all-in-one-wp-migration');
                        if (pluginCard) {
                            pluginCard.classList.add('pulse-animation');
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        }
    });
}

// Adiciona evento de clique no botão
document.getElementById('redirectInstallBtn').addEventListener('click', function(event) {
    installRedirection();
});

document.getElementById('backupInstallBtn').addEventListener('click', function(event) {
    installBackup();
});