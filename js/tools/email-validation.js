document.addEventListener("DOMContentLoaded", function(){
    function configurarValidacaoEmailCorporativo({
      formId,
      inputId,
      dominiosPessoais = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "icloud.com",
        "live.com",
        "bol.com.br",
        "uol.com.br",
        "terra.com.br",
        "aol.com",
        "protonmail.com",
      ],
      mensagemErro = "Por favor, use um e-mail corporativo.",
    }) {
      const form = document.getElementById(formId);
      const emailInput = document.getElementById(inputId);
    
      if (!form || !emailInput) {
        console.error("Formulário ou campo de e-mail não encontrado.");
        return;
      }
    
      form.addEventListener("submit", function (e) {
        const email = emailInput.value.trim().toLowerCase();
        const dominio = email.split("@")[1];
    
        if (!dominio || dominiosPessoais.includes(dominio)) {
          e.preventDefault();
          alert(mensagemErro);
          return false;
        }
      });
    }
    // Exemplo de uso
    configurarValidacaoEmailCorporativo({
      formId: "conversionform",
      inputId: "form-field-email",
    });
})