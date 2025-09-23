// Plugin cards
const plugins = [
  {
    name: "Elementor Website Builder – Mais do que apenas um construtor de páginas",
    searchName: "Elementor Website Builder",
    description:
      "O construtor de sites Elementor tem tudo: construtor de páginas do tipo arrastar e soltar, design perfeito em pixels, edição responsiva para dispositivos móveis e muito mais. Comece agora mesmo!",
    image: "https://ps.w.org/elementor/assets/icon-256x256.gif",
    wordpressSelector: ".plugin-card-elementor",
  },
  {
    name: "SEOPress – On-site SEO",
    searchName: "SEOPress – On-site SEO",
    description:
      "SEOPress, um plugin de SEO tudo-em-um para WordPress, simples, rápido e poderoso. Alcance posições mais altas nos mecanismos de busca, totalmente white label. Agora com IA.",
    image: "https://ps.w.org/wp-seopress/assets/icon-128x128.gif",
    wordpressSelector: ".plugin-card-wp-seopress",
  },
  {
    name: "Editor clássico",
    description:
      "Ativar o editor 'clássico' anterior e o estilo antigo da tela Editar Post com TinyMCE, Meta Boxes, etc. Suporta todos os plugins que estendem esta tela.",
    image:
      "https://ps.w.org/classic-editor/assets/icon-256x256.png",
    wordpressSelector: ".plugin-card-classic-editor",
  },
  {
    name: "Redirection",
    description:
      "Gerencie redirecionamentos 301, monitore erros 404 e melhore seu site, sem precisar entender de Apache ou Nginx.",
    image: "https://ps.w.org/redirection/assets/icon-256x256.jpg",
    wordpressSelector: ".plugin-card-redirection",
  },
  {
    name: "All-in-One WP Migração e Backup",
    description:
      "Mais de 60 milhões de sites confiam: o padrão-ouro para migrações, backups e transferências de sites WordPress desde 2013.",
    image:
      "https://ps.w.org/all-in-one-wp-migration/assets/icon-256x256.png",
    wordpressSelector: ".plugin-card-all-in-one-wp-migration",
  },
  {
    name: "LiteSpeed Cache",
    description:
      "Tudo em um: aceleração imbatível, melhoria no PageSpeed, armazenamento em cache, otimização de imagem/CSS/JS e muito mais...",
    image:
      "https://ps.w.org/litespeed-cache/assets/icon-256x256.png",
    wordpressSelector: ".plugin-card-litespeed-cache",
  },
  {
    name: "WPCode – Insert Headers and Footers + snippets de código personalizados",
    description:
      "Adicione facilmente snippets de código no WordPress. Insira scripts de cabeçalho e rodapé, adicione trechos de código PHP com lógica condicional, insira código de pixel de anúncios e muito mais.",
    image:
      "https://ps.w.org/insert-headers-and-footers/assets/icon-256x256.png",
    wordpressSelector: ".plugin-card-insert-headers-and-footers",
  },
  {
    name: "Duplicar página",
    description:
      "Duplique posts, páginas e posts customizados facilmente com um simples click.",
    image:
      "https://ps.w.org/duplicate-page/assets/icon-128x128.jpg",
    wordpressSelector: ".plugin-card-duplicate-page",
  },
  {
    name: "Enable Media Replace",
    description:
      "Substitua facilmente qualquer imagem/arquivo anexado apenas enviando um novo arquivo na visualização de edição da Biblioteca de Mídia — um verdadeiro salva-tempo!",
    image:
      "https://ps.w.org/enable-media-replace/assets/icon-256x256.png",
    wordpressSelector: ".plugin-card-enable-media-replace",
  },
  {
    name: "Better Search Replace",
    description:
      "Um plugin simples para atualizar URLs ou outro texto em um banco de dados.",
    image:
      "https://ps.w.org/better-search-replace/assets/icon-256x256.png",
    wordpressSelector: ".plugin-card-better-search-replace",
  },
  {
    name: "Wordfence Security – Firewall, Malware Scan, and Login Security",
    description:
      "Firewall, verificador de malware, autenticação em dois fatores e recursos de segurança completos, com o suporte da nossa equipe 24 horas. Priorize a segurança com o Wordfence.",
    image: "https://ps.w.org/wordfence/assets/icon.svg",
    wordpressSelector: ".plugin-card-wordfence",
  },
  {
    name: "Export media with selected content",
    description:
      "Exporte seus dados com todos os anexos relevantes incluídos automaticamente.",
    image: "https://ps.w.org/export-media-with-selected-content/assets/icon.svg",
    wordpressSelector: ".plugin-card-export-media-with-selected-content",
  },
  {
    name: "Safe SVG",
    description:
      "Permita o envio de arquivos SVG e sanitize-os para impedir vulnerabilidades XML/SVG no seu site WordPress.",
      image: "https://ps.w.org/safe-img/svg/assets/icon.svg",
      image: "https://ps.w.org/safe-svg/assets/icon.svg?rev=2779013",
      wordpressSelector: ".plugin-card-safe-svg",
  },
  {
    name: "kk Star Ratings – Rate Post & Collect User Feedbacks",
    description:
      "O kk Star Ratings permite que os visitantes do blog se envolvam e interajam de forma mais eficaz com seu site, avaliando as postagens.",
      image: "https://ps.w.org/kk-star-ratings/assets/icon-256x256.jpg",
      wordpressSelector: ".plugin-card-kk-star-ratings",
  },
];

const validation = [
  {
    idInput: "emailField",
    btnSelector: "copyEmailValidation",
    infoComment: `Email Validation`,
    selector: `const EMAIL_FIELD_SELECTOR = 'input[name="\${fieldSelectorToReplace}"]';`,
    originalCode: `document.addEventListener("DOMContentLoaded",()=>{const e=new Set(["gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com","live.com","bol.com.br","uol.com.br","terra.com.br","aol.com","protonmail.com"]),t=t=>/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(t),o=o=>{const l=o.trim().toLowerCase().split("@")[1];return!!l&&!e.has(l)},l=e=>{const l=e.value.trim();if(e.setCustomValidity(""),l.length>0){t(l)?o(l)||e.setCustomValidity("Insira um e-mail corporativo."):e.setCustomValidity("Insira um e-mail válido.")}},n=e=>{e.value=e.value.trim()},r=e=>{e.setAttribute("pattern","[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}"),e.setAttribute("title","Please enter a valid corporate email."),e.setAttribute("autocomplete","email"),e.addEventListener("input",()=>n(e)),e.addEventListener("blur",()=>l(e))};document.querySelectorAll(EMAIL_FIELD_SELECTOR).forEach(r)});`,
  },
  {
    idInput: "phoneField",
    btnSelector: "copyPhoneMask",
    infoComment: `Phone Field Mask`,
    scriptCDN: `<script src="https://unpkg.com/imask@7/dist/imask.min.js"></script>`,
    selector: `const PHONE_FIELD_SELECTOR = 'input[name="\${fieldSelectorToReplace}"]';`,
    originalCode: `document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(PHONE_FIELD_SELECTOR).forEach(e=>{IMask(e,{mask:[{mask:"(00) 0000-0000"},{mask:"(00) 00000-0000"}],dispatch:(e,a)=>{const t=(a.value+e).replace(/\D/g,"");return a.compiledMasks[t.length>10?1:0]}})})});`,
  },
];

