import { validation } from '../utils/objects.js';

function handleValidationFieldCopy(item) {
    const { idInput, infoComment, scriptCDN, selector, originalCode } = item;

    const fieldSelectorToReplace = document.getElementById(idInput).value.trim();

    if (!fieldSelectorToReplace) {
        alert("Por favor, preencha o campo do seletor.");
        return;
    }

    const finalSelector = selector.replace("${fieldSelectorToReplace}", fieldSelectorToReplace);

    let finalCode = `<script>${finalSelector}${originalCode}</script>
`;

    if (scriptCDN) {
        finalCode = scriptCDN + "\n" + finalCode;
    }

    finalCode = `<!-- ${infoComment} -->
${finalCode}<!-- END ${infoComment} -->`;

    navigator.clipboard.writeText(finalCode).then(() => {
        // Assuming a general message element exists in the popup
        const messageEl = document.getElementById("global-message") || document.getElementById("mensagem");
        if (messageEl) messageEl.textContent = "Código copiado com sucesso!";
    }).catch(() => {
        const messageEl = document.getElementById("global-message") || document.getElementById("mensagem");
        if (messageEl) messageEl.textContent = "Erro ao copiar código.";
    });
}

export function initializeValidationFields() {
    validation.forEach(item => {
        const button = document.getElementById(item.btnSelector);
        if (button) {
            button.addEventListener("click", () => handleValidationFieldCopy(item));
        }
    });
}
