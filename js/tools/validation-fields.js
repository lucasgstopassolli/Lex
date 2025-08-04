function validationField({ idInput, btnSelector, scriptCDN, fieldSelectorToCopy, codeToCopy }) {
  const originalCode = codeToCopy;

  document.getElementById(btnSelector).addEventListener("click", function () {
    const fieldSelectorToReplace = document.getElementById(idInput).value.trim();

    if (!fieldSelectorToReplace) {
      console.log("Não está chegando")
      alert("Preenche o campo =/.");
      return;
    }

    const selector = fieldSelectorToCopy.replace("${fieldSelectorToReplace}", fieldSelectorToReplace);
    
    let finalCode = `<script>\n` + selector + originalCode + `\n</script>`;

    if (scriptCDN){
      finalCode = scriptCDN + finalCode;
    }


    navigator.clipboard
      .writeText(finalCode)
      .then(() => {
        document.getElementById("mensagem").textContent =
          "Código copiado com sucesso!";
      })
      .catch(() => {
        document.getElementById("mensagem").textContent =
          "Erro ao copiar código.";
      });
  });
}

validation.forEach(item => {
  validationField({
    idInput: item.idInput,
    btnSelector: item.btnSelector,
    scriptCDN: item.scriptCDN,
    fieldSelectorToCopy: item.selector,
    codeToCopy: item.originalCode
  });
});