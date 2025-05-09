//Program initialization
function initializateProgram() {
  setupTabs(extensionElements);
  setupTabs(lateralTabElements);
}

//Remove all the active classes from another tabs
function removeActive(tabElements){
  //Remove from button
  tabElements.elementTabClass.forEach(tab => {
    tab.classList.remove("active");
  });
  //Remove from tab
  tabElements.elementTabID.forEach(tab => {
    tab.classList.remove("active");
  });
}

//Main funtion to manage de tabs
function setupTabs(tabElements) {
  tabElements.elementTabID.forEach(button => {
    button.addEventListener("click", () => {
      const idTab = button.id;
      
      if (tabElements.tabOpen[idTab]) {
        removeActive(tabElements);
        tabElements.tabOpen[idTab]();
        //If the tool tab is active, active the 
        if (idTab === "toolsButton" && tabElements === extensionElements) {
          removeActive(lateralTabElements);
          lateralTabElements.tabOpen.colorPickerLateralButton();
        }
      }
    });
  });
}

//Initialize default ressources
initializateProgram()
