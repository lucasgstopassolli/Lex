import { validation } from '../utils/objects.js';
import { alertTrigger, getAlertConfig, copyToClipboard } from '../utils/dom.js';

function handleValidationFieldCopy(item) {
    const { idInput, infoComment, scriptCDN, selector, originalCode } = item;

    const fieldSelectorToReplace = document.getElementById(idInput).value.trim();

    if (!fieldSelectorToReplace) {
        alertTrigger(getAlertConfig("fillSelectorField"));
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

    copyToClipboard(finalCode).then(() => {
        alertTrigger(getAlertConfig("copyContent"));
    }).catch(() => {
        alertTrigger(getAlertConfig("unexpectedError"));
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
