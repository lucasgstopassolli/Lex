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
getDomainAndSlug();  

async function createRedirect(inputUrl, outputUrl) {
    if (!domain) {
        alert('Domínio não disponível');
        return;
    }

    const redirectionUrl = ensureSlash(domain) + "wp-admin/tools.php?page=redirection.php";
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.update(tab.id, { url: redirectionUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            injectAndCreate(tabId, inputUrl, outputUrl);
        }
    });
}

async function injectAndCreate(tabId, inputUrl, outputUrl) {
    try {
        const [{ result: nonce }] = await chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: () => {
                return window.Redirectioni10n?.api?.WP_API_nonce || '';
            }
        });

        if (!nonce) return;

        await chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: (domain, inputUrl, outputUrl, nonce) => {
                fetch(domain + "wp-json/redirection/v1/redirect/", {
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
            },
            args: [ensureSlash(domain), inputUrl, outputUrl, nonce]
        });

    } catch (error) {
        console.error("Erro ao obter nonce ou enviar redirecionamento:", error);
    }
}


// Adiciona evento de clique no botão "Criar redirect"
function handleRedirectEvent(event) {
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