let domain, slug, url;

// Verificação se tem barra final
function ensureSlash(termUrl) {
    return termUrl.endsWith('/') ? termUrl : termUrl + '/';
}

// Função para pegar o domínio, slug e url
function getDomainAndSlug() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const urlObj = new URL(tabs[0].url);
        domain = urlObj.origin;
        slug = urlObj.pathname;
        url = urlObj.href;

        // Atualiza os campos no popup com as variáveis globais
        document.getElementById('url_domain').value = domain;
        document.getElementById('inputUrl').value = slug;
        document.getElementById('url_').value = ensureSlash(url);
    });
}


// Chama a função para atualizar as variáveis após o carregamento da página
document.addEventListener('DOMContentLoaded', function () {
    getDomainAndSlug();
});

// Função para enviar mensagem ao background
function sendMessageToBackground(inputUrl, outputUrl) {
    chrome.runtime.sendMessage({
        action: "createRedirect",
        inputUrl: inputUrl,
        outputUrl: outputUrl, 
        domain: domain 
    })
};

document.getElementById('redirectBtn').addEventListener('click', 
    function (event) {
    event.preventDefault();  // Evita o envio do formulário
    
    const inputUrl = document.getElementById('inputUrl').value;
    const outputUrl = document.getElementById('outputUrl').value;

    if (inputUrl && outputUrl) {
        window.open(redirectionUrl);
    } else {
        alert('Preencha os campos');
    }
});