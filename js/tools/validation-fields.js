function validationField({ idInput, btnSelector, infoComment, scriptCDN, fieldSelectorToCopy, codeToCopy }) {
  const originalCode = codeToCopy;

  document.getElementById(btnSelector).addEventListener("click", function () {
    const fieldSelectorToReplace = document.getElementById(idInput).value.trim();

    if (!fieldSelectorToReplace) {
      console.log("Não está chegando")
      alert("Preenche o campo =/.");
      return;
    }

    const selector = fieldSelectorToCopy.replace("${fieldSelectorToReplace}", fieldSelectorToReplace);
    
    let finalCode = `<script>` + selector + originalCode + `</script>\n`
    
    if (scriptCDN){
      finalCode = scriptCDN + finalCode;
    }
    
    finalCode = `<!-- ` + infoComment + ` -->\n` + finalCode + `<!-- END ` + infoComment + ` -->`

    navigator.clipboard.writeText(finalCode).then(() => {
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
    infoComment: item.infoComment,
    scriptCDN: item.scriptCDN,
    fieldSelectorToCopy: item.selector,
    codeToCopy: item.originalCode
  });
});