//Default Nav Bar
const extensionElements = {
  elementTabID: document.querySelectorAll(".tab-button"),
  elementTabClass: document.querySelectorAll(".tab"),
  tabOpen: {
    initialButton: () => {
      document.getElementById("initialButton").classList.add("active");
      document.getElementById("initial-tab").classList.add("active");
    },
    pluginsButton: () => {
      document.getElementById("pluginsButton").classList.add("active");
      document.getElementById("plugins-tab").classList.add("active");
    },
    redirectionButton: () => {
      document.getElementById("redirectionButton").classList.add("active");
      document.getElementById("redirection-tab").classList.add("active");
    },
    toolsButton: () => {
      document.getElementById("toolsButton").classList.add("active");
      document.getElementById("tools-tab").classList.add("active");
    },
  },
};

//Tools Bar
const lateralTabElements = {
  elementTabID: document.querySelectorAll(".side-tab-button"),
  elementTabClass: document.querySelectorAll(".side-tab"),
  tabOpen: {
    colorPickerLateralButton: () => {
      document.getElementById("colorPickerLateralButton").classList.add("active");
      document.getElementById("tab-1").classList.add("active");
    },
    test1LateralButton: () => {
      document.getElementById("test1LateralButton").classList.add("active");
      document.getElementById("tab-2").classList.add("active");
    },
    test2LateralButton: () => {
      document.getElementById("test2LateralButton").classList.add("active");
      document.getElementById("tab-3").classList.add("active");
    },
  },
};

//Fields to copy
const copyFieldElements = {
  colorRGB: {
    input: document.getElementById('color'),
    button: document.getElementById('butCopyRGB'),
  },
}