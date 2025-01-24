let domain, slug, url;

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

// async function getNonce(){
//     const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//     const tabId = tabs[0].id;
//     const result = await chrome.scripting.executeScript({
//     target: { tabId },
//     func: function(){
//         return Redirectioni10n.api.WP_API_nonce
//     },
//     world: 'MAIN', // to run in the window context and to be able to access variables from the page
//     });
//     return result[0].result || [];
// }

function getNonce(){
    return document.getElementById('nonce').value;
}

// Chama a função para atualizar as variáveis após o carregamento da página
document.addEventListener('DOMContentLoaded', function () {
    getDomainAndSlug();
});

// Função para criar o redirecionamento 
//IDEIA DESCARTADA, FUNÇÃO POUCO FLEXÍVEL
function createRedirect(inputUrl, outputUrl) {
    if (!domain) {
        alert('Domínio não disponível');
        return;
    }

    let redirectionUrl = ensureSlash(domain) + "wp-admin/tools.php?page=redirection.php";
    chrome.tabs.update({ url: redirectionUrl });
    fetch(ensureSlash(domain) + "wp-json/redirection/v1/redirect/", {
        headers: {
            "accept": "application/json, */*;q=0.1",
            "content-type": "application/json; charset=utf-8",
            "x-wp-nonce": getNonce(),
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
}

// Adiciona evento de clique no botão "Criar redirect"
document.getElementById('redirectBtn').addEventListener('click', function (event) {
    event.preventDefault();  // Evita o envio do formulário

    const inputUrl = document.getElementById('inputUrl').value;
    const outputUrl = document.getElementById('outputUrl').value;

    if (inputUrl && outputUrl) {
        createRedirect(inputUrl, outputUrl);
    } else {
        alert('Preencha os campos');
    }
});