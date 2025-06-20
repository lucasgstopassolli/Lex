//Fields to copy
const copyFieldElements = {
  colorRGB: {
    input: document.getElementById('color'),
    button: document.getElementById('butCopyRGB'),
  },
}

//Nav Tabs
const navTabs = {
  mainTab: {
    selector: '#pills-tab.mainTab button',
    storageKey: 'lastMainTab'
  },
  wordpressTab: {
    selector: '#pills-tab.wordpressTab button',
    storageKey: 'lastWordpressTab',
  },
  designTab: {
    selector: '#pills-tab.designTab button',
    storageKey: 'lastDesignTab',
  },
}