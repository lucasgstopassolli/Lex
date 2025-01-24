// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "createRedirect") {
//         const { inputUrl, outputUrl, domain } = request;

        // Função para pegar o nonce da página
        // function getWpNonce(callback) {
        //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //         chrome.scripting.executeScript({
        //             target: { tabId: tabs[0].id },
        //             func: () => Redirectioni10n.api.nonce
        //         }, (results) => {
        //             if (results && results[0] && results[0].result) {
        //                 callback(results[0].result);
        //             } else {
        //                 console.error("Nonce não encontrado");
        //             }
        //         });
        //     });
        // }

        // Função para realizar o redirecionamento
        // function createRedirect(wpNonce) {
        //     fetch(domain + "/wp-json/redirection/v1/redirect/", {
        //         method: "POST",
        //         headers: {
        //             "accept": "application/json, */*;q=0.1",
        //             "content-type": "application/json; charset=utf-8",
        //             "x-wp-nonce": wpNonce
        //         },
        //         body: JSON.stringify({
        //             "id": 0,
        //             "url": inputUrl,
        //             "title": "",
        //             "match_data": {
        //                 "source": {
        //                     "flag_regex": false,
        //                     "flag_trailing": true,
        //                     "flag_case": true,
        //                     "flag_query": "exact"
        //                 },
        //                 "options": {}
        //             },
        //             "match_type": "url",
        //             "action_type": "url",
        //             "position": 0,
        //             "group_id": 1,
        //             "action_code": 301,
        //             "action_data": { "url": outputUrl }
        //         }),
        //         credentials: "include"
        //     }).then(response => {
        //         if (response.ok) {
        //             console.log("Redirecionamento criado com sucesso");
        //         } else {
        //             console.error("Erro ao criar redirecionamento");
        //         }
        //     }).catch(error => console.error("Erro na requisição:", error));
        // }

        // Pega o nonce e cria o redirecionamento
//         getWpNonce(createRedirect);
//     }
// });

chrome.commands.onCommand.addListener((command) => {
    if (command === "open-popup") {
        chrome.action.openPopup();
    }
});