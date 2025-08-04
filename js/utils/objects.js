// Nav tabs
const navTabs = {
  mainTab: {
    selector: "#pills-tab.mainTab button",
    storageKey: "lastMainTab",
  },
  wordpressTab: {
    selector: "#pills-tab.wordpressTab button",
    storageKey: "lastWordpressTab",
  },
  designTab: {
    selector: "#pills-tab.designTab button",
    storageKey: "lastDesignTab",
  },
  settingsTab: {
    selector: "#pills-tab.settingsTab button",
    storageKey: "lastSettingsTab",
  },
};

// Plugin cards
const plugins = [
  {
    name: "Elementor Website Builder – Mais do que apenas um construtor de páginas",
    searchName: "Elementor Website Builder",
    description:
      "O construtor de sites Elementor tem tudo: construtor de páginas do tipo arrastar e soltar, design perfeito em pixels, edição responsiva para dispositivos móveis e muito mais. Comece agora mesmo!",
    image: "https://ps.w.org/elementor/assets/icon-256x256.gif?rev=3111597",
    wordpressSelector: ".plugin-card-elementor",
  },
  {
    name: "SEOPress – On-site SEO",
    searchName: "SEOPress – On-site SEO",
    description:
      "SEOPress, um plugin de SEO tudo-em-um para WordPress, simples, rápido e poderoso. Alcance posições mais altas nos mecanismos de busca, totalmente white label. Agora com IA.",
    image: "https://ps.w.org/wp-seopress/assets/icon-128x128.gif?rev=3158903",
    wordpressSelector: ".plugin-card-wp-seopress",
  },
  {
    name: "Editor clássico",
    description:
      "Ativar o editor 'clássico' anterior e o estilo antigo da tela Editar Post com TinyMCE, Meta Boxes, etc. Suporta todos os plugins que estendem esta tela.",
    image:
      "https://ps.w.org/classic-editor/assets/icon-256x256.png?rev=1998671",
    wordpressSelector: ".plugin-card-classic-editor",
  },
  {
    name: "Redirection",
    description:
      "Gerencie redirecionamentos 301, monitore erros 404 e melhore seu site, sem precisar entender de Apache ou Nginx.",
    image: "https://ps.w.org/redirection/assets/icon-256x256.jpg?rev=983639",
    wordpressSelector: ".plugin-card-redirection",
  },
  {
    name: "All-in-One WP Migração e Backup",
    description:
      "Mais de 60 milhões de sites confiam: o padrão-ouro para migrações, backups e transferências de sites WordPress desde 2013.",
    image:
      "https://ps.w.org/all-in-one-wp-migration/assets/icon-256x256.png?rev=2458334",
    wordpressSelector: ".plugin-card-all-in-one-wp-migration",
  },
  {
    name: "LiteSpeed Cache",
    description:
      "Tudo em um: aceleração imbatível, melhoria no PageSpeed, armazenamento em cache, otimização de imagem/CSS/JS e muito mais...",
    image:
      "https://ps.w.org/litespeed-cache/assets/icon-256x256.png?rev=2554181",
    wordpressSelector: ".plugin-card-litespeed-cache",
  },
  {
    name: "Duplicar página",
    description:
      "Duplique posts, páginas e posts customizados facilmente com um simples click.",
    image:
      "https://ps.w.org/duplicate-page/assets/icon-128x128.jpg?rev=1412874",
    wordpressSelector: ".plugin-card-duplicate-page",
  },
  {
    name: "Enable Media Replace",
    description:
      "Substitua facilmente qualquer imagem/arquivo anexado apenas enviando um novo arquivo na visualização de edição da Biblioteca de Mídia — um verdadeiro salva-tempo!",
    image:
      "https://ps.w.org/enable-media-replace/assets/icon-256x256.png?rev=1940728",
    wordpressSelector: ".plugin-card-enable-media-replace",
  },
  {
    name: "Better Search Replace",
    description:
      "Um plugin simples para atualizar URLs ou outro texto em um banco de dados.",
    image:
      "https://ps.w.org/better-search-replace/assets/icon-256x256.png?rev=2706527",
    wordpressSelector: ".plugin-card-better-search-replace",
  },
  {
    name: "Wordfence Security – Firewall, Malware Scan, and Login Security",
    description:
      "Firewall, verificador de malware, autenticação em dois fatores e recursos de segurança completos, com o suporte da nossa equipe 24 horas. Priorize a segurança com o Wordfence.",
    image: "https://ps.w.org/wordfence/assets/icon.svg?rev=2070865",
    wordpressSelector: ".plugin-card-wordfence",
  },
  {
    name: "Safe SVG",
    description:
      "Permita o envio de arquivos SVG e sanitize-os para impedir vulnerabilidades XML/SVG no seu site WordPress.",
    image: "https://ps.w.org/safe-svg/assets/icon.svg?rev=2779013",
    wordpressSelector: ".plugin-card-safe-svg",
  },
];

const validation = [
  {
    idInput: "emailField",
    btnSelector: "copyEmailValidation",
    selector: `const EMAIL_FIELD_SELECTOR = 'input[name="\${fieldSelectorToReplace}"]';\n`,
    originalCode: `//Corporate E-mail Validatio\ndocument.addEventListener("DOMContentLoaded",()=>{const PERSONAL_EMAIL_DOMAINS=new Set(["gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com","live.com","bol.com.br","uol.com.br","terra.com.br","aol.com","protonmail.com"]);const isValidEmailFormat=(email)=>{const emailRegex=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;return emailRegex.test(email)};const isCorporateEmail=(email)=>{const normalizedEmail=email.trim().toLowerCase();const domain=normalizedEmail.split('@')[1];return domain?!PERSONAL_EMAIL_DOMAINS.has(domain):false};const handleValidation=(field)=>{const emailValue=field.value.trim();field.setCustomValidity("");if(emailValue.length>0){if(!isValidEmailFormat(emailValue)){field.setCustomValidity("Insira um e-mail válido.")}else if(!isCorporateEmail(emailValue)){field.setCustomValidity("Insira um e-mail corporativo.")}}field.reportValidity()};const formatInputValue=(field)=>{field.value=field.value.trim()};const initializeEmailField=(emailField)=>{emailField.setAttribute("pattern","[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}");emailField.setAttribute("title","Please enter a valid corporate email.");emailField.setAttribute("autocomplete","email");emailField.addEventListener("input",()=>formatInputValue(emailField));emailField.addEventListener("blur",()=>handleValidation(emailField))};const emailFields=document.querySelectorAll(EMAIL_FIELD_SELECTOR);emailFields.forEach(initializeEmailField)});\n//END Corporate E-mail Validatio`,
  },
  {
    idInput: "phoneField",
    btnSelector: "copyPhoneMask",
    scriptCDN: `<script src="https://unpkg.com/imask"></t>`,
    selector: `const PHONE_FIELD_SELECTOR = 'input[name="\${fieldSelectorToReplace}"]';`,
    originalCode: `//Phone mask\ndocument.addEventListener("DOMContentLoaded", ()=>{IMask(document.querySelectorAll(PHONE_FIELD_SELECTOR),{mask:'(00)00000-0000'})})\n//END Phone mask`,
  },
];

