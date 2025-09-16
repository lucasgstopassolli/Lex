// editor.js

// Função genérica para aplicar comandos de formatação
const applyStyle = (command, value = null) => {
  document.execCommand(command, false, value);
  document.getElementById("noteContent").focus();
};

// Lógica específica para criar um Link
const createLink = () => {
  const url = prompt("Entre com a URL para o link:");
  if (url) {
    applyStyle("createLink", url);
  }
};

// Função principal que inicializa todos os botões do editor
export function initEditor() {
  document.getElementById("formatBlock").addEventListener("change", (e) => applyStyle("formatBlock", e.target.value));
  document.getElementById("boldBtn").addEventListener("click", () => applyStyle("bold"));
  document.getElementById("italicBtn").addEventListener("click", () => applyStyle("italic"));
  document.getElementById("underlineBtn").addEventListener("click", () => applyStyle("underline"));
  document.getElementById("unorderedListBtn").addEventListener("click", () => applyStyle("insertUnorderedList"));
  document.getElementById("orderedListBtn").addEventListener("click", () => applyStyle("insertOrderedList"));
  document.getElementById("blockquoteBtn").addEventListener("click", () => applyStyle("formatBlock", "blockquote"));
  document.getElementById("alignLeftBtn").addEventListener("click", () => applyStyle("justifyLeft"));
  document.getElementById("alignCenterBtn").addEventListener("click", () => applyStyle("justifyCenter"));
  document.getElementById("alignRightBtn").addEventListener("click", () => applyStyle("justifyRight"));
  document.getElementById("alignJustifyBtn").addEventListener("click", () => applyStyle("justifyFull"));
  document.getElementById("linkBtn").addEventListener("click", createLink);
  document.getElementById("removeFormatBtn").addEventListener("click", () => applyStyle("removeFormat"));
}