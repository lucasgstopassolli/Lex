// funções globais para criação de elementos via js

function newElement(element, identification, elementToAppend = document.body){
    const el = document.createElement(element);
    addElementID(el, identification);
    elementToAppend.appendChild(el);
    return el
}

function addElementID(elem, identify){
    elem.id = identify;
}
