

const observer = new MutationObserver(() => {
    if (window.Redirectioni10n && window.Redirectioni10n.api && window.Redirectioni10n.api.WP_API_nonce) {
        console.log("Nonce detectado:", Redirectioni10n.api.WP_API_nonce);
        observer.disconnect();
    }
});

observer.observe(document, { childList: true, subtree: true });
