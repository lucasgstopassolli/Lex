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
    name: "Yoast SEO – Advanced SEO with real-time guidance and built-in AI",
    searchName: "Yoast SEO",
    description:
      "Melhore o SEO do seu site em WordPress: Escreva conteúdo melhor e tenha um site WordPress completamente otimizado usando o plugin Yoast SEO.",
    image: "https://ps.w.org/wordpress-seo/assets/icon-256x256.gif?rev=3112542",
    wordpressSelector: ".plugin-card-wordpress-seo",
  },
  {
    name: "Editor clássico",
    description:
      "Ativar o editor 'clássico' anterior e o estilo antigo da tela Editar Post com TinyMCE, Meta Boxes, etc. Suporta todos os plugins que estendem esta tela.",
    image: "https://ps.w.org/classic-editor/assets/icon-256x256.png?rev=1998671",
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
    image: "https://ps.w.org/all-in-one-wp-migration/assets/icon-256x256.png?rev=2458334",
    wordpressSelector: ".plugin-card-all-in-one-wp-migration",
  },
  {
    name: "LiteSpeed Cache",
    description:
      "Tudo em um: aceleração imbatível, melhoria no PageSpeed, armazenamento em cache, otimização de imagem/CSS/JS e muito mais...",
    image: "https://ps.w.org/litespeed-cache/assets/icon-256x256.png?rev=2554181",
    wordpressSelector: ".plugin-card-litespeed-cache",
  },
  {
    name: "Duplicar página",
    description:
      "Duplique posts, páginas e posts customizados facilmente com um simples click.",
    image: "https://ps.w.org/duplicate-page/assets/icon-128x128.jpg?rev=1412874",
    wordpressSelector: ".plugin-card-duplicate-page",
  },
  {
    name: "Enable Media Replace",
    description:
      "Substitua facilmente qualquer imagem/arquivo anexado apenas enviando um novo arquivo na visualização de edição da Biblioteca de Mídia — um verdadeiro salva-tempo!",
    image: "https://ps.w.org/enable-media-replace/assets/icon-256x256.png?rev=1940728",
    wordpressSelector: ".plugin-card-enable-media-replace",
  },
  {
    name: "Better Search Replace",
    description:
      "Um plugin simples para atualizar URLs ou outro texto em um banco de dados.",
    image: "https://ps.w.org/better-search-replace/assets/icon-256x256.png?rev=2706527",
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
