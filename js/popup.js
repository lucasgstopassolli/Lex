let slug
let domain
let url

chrome.tabs.query({ 
        active: true, currentWindow: true 
    }, 
    function(tabs) {

    url = tabs[0].url;
    let urlObj = new URL(url);
    
    domain = urlObj.origin;
    slug = urlObj.pathname;

    document.getElementById('url_').value = url + '/'
    document.getElementById('url_slug').value = slug
    document.getElementById('url_domain').value = domain + '/'

});

console.log(slug)