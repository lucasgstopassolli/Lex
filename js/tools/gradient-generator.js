import { copyToClipboard, alertTrigger, getAlertConfig } from '../utils/dom.js';

/**
 * Gradient Generator Tool
 * Optimized for real-time CSS generation.
 */

export function updateGradientUI() {
    const color1 = document.getElementById('gradColor1').value;
    const color2 = document.getElementById('gradColor2').value;
    const angle = document.getElementById('gradAngle').value;
    const type = document.getElementById('gradType').value;
    
    // Update Hex Texts
    document.getElementById('gradHex1').value = color1.toUpperCase();
    document.getElementById('gradHex2').value = color2.toUpperCase();

    // Generate CSS
    let cssString = '';
    if (type === 'linear') {
        cssString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    } else {
        cssString = `radial-gradient(circle, ${color1}, ${color2})`;
    }

    // Update Preview
    const preview = document.getElementById('gradientPreview');
    if (preview) {
        preview.style.background = cssString;
    }

    // Update Output
    const output = document.getElementById('gradCssOutput');
    if (output) {
        output.value = cssString;
    }
}

export function initializeGradientGenerator() {
    const elements = {
        color1: document.getElementById('gradColor1'),
        color2: document.getElementById('gradColor2'),
        hex1: document.getElementById('gradHex1'),
        hex2: document.getElementById('gradHex2'),
        angle: document.getElementById('gradAngle'),
        type: document.getElementById('gradType'),
        // copyBtn: document.getElementById('copyGradCss')
    };

    if (!elements.color1) return;

    // Event Listeners
    const inputs = [elements.color1, elements.color2, elements.angle, elements.type];
    inputs.forEach(input => {
        input.addEventListener('input', updateGradientUI);
    });

    // Hex Sync
    const syncHex = (textEl, inputEl) => {
        let val = textEl.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            inputEl.value = val;
            updateGradientUI();
        }
    };

    elements.hex1.addEventListener('input', () => syncHex(elements.hex1, elements.color1));
    elements.hex2.addEventListener('input', () => syncHex(elements.hex2, elements.color2));

    // Initial run
    updateGradientUI();
}
