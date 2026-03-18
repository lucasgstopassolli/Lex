/**
 * Contrast Checker Tool
 * Logic for WCAG 2.1 Contrast Ratio calculations.
 */

const WCAG = {
    NORMAL_AA: 4.5,
    NORMAL_AAA: 7,
    LARGE_AA: 3,
    LARGE_AAA: 4.5
};

/**
 * Converts Hex to RGB
 */
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Calculates Relative Luminance
 */
function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates Contrast Ratio
 */
function calculateRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 1;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

function updateStatus(el, pass, level) {
    el.textContent = pass ? level : 'FAIL';
    el.className = `contrast-status-badge ${pass ? 'pass-' + level.toLowerCase() : 'fail'}`;
}

export function updateContrastUI() {
    const bg = document.getElementById('bgColorInput').value;
    const fg = document.getElementById('fgColorInput').value;
    const ratio = calculateRatio(bg, fg);

    // Update Hex Texts
    document.getElementById('bgHexText').value = bg.toUpperCase();
    document.getElementById('fgHexText').value = fg.toUpperCase();

    // Update Preview
    const preview = document.getElementById('contrastPreview');
    preview.style.backgroundColor = bg;
    preview.style.color = fg;

    // Update Ratio
    document.getElementById('ratioValue').textContent = `${ratio.toFixed(2)}:1`;

    // Update Badges
    updateStatus(document.getElementById('statusNormal'), ratio >= WCAG.NORMAL_AA, ratio >= WCAG.NORMAL_AAA ? 'AAA' : 'AA');
    updateStatus(document.getElementById('statusLarge'), ratio >= WCAG.LARGE_AA, ratio >= WCAG.LARGE_AAA ? 'AAA' : 'AA');
}

export function initializeContrastChecker() {
    const elements = {
        bgInput: document.getElementById('bgColorInput'),
        fgInput: document.getElementById('fgColorInput'),
        bgText: document.getElementById('bgHexText'),
        fgText: document.getElementById('fgHexText')
    };

    if (!elements.bgInput) return;

    const syncInput = (textEl, inputEl) => {
        let val = textEl.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            inputEl.value = val;
            updateContrastUI();
        }
    };

    elements.bgInput.addEventListener('input', updateContrastUI);
    elements.fgInput.addEventListener('input', updateContrastUI);
    elements.bgText.addEventListener('input', () => syncInput(elements.bgText, elements.bgInput));
    elements.fgText.addEventListener('input', () => syncInput(elements.fgText, elements.fgInput));

    updateContrastUI();
}
