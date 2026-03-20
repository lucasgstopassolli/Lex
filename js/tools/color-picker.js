import { alertTrigger, getAlertConfig } from "../utils/dom.js";

export function initializeColorPicker() {
    const pickerContainer = document.getElementById('pickerContainer');
    const colorBlock = document.getElementById('colorBlock');
    const pickerMarker = document.getElementById('pickerMarker');
    const hueContainer = document.getElementById('hueContainer');
    const hueMarker = document.getElementById('hueMarker');
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    const hslInput = document.getElementById('hslInput');
    const colorPreview = document.getElementById('colorPreview');

    if (!pickerContainer) return;

    let h = 0, s = 100, v = 100;
    let isDraggingPicker = false;
    let isDraggingHue = false;

    // --- Math Helpers ---
    function hsvToRgb(h, s, v) {
        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    // --- Core Logic ---
    function updateUI() {
        // Base color for saturation square
        const baseRgb = hsvToRgb(h / 360, 1, 1);
        colorBlock.style.backgroundColor = `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`;

        // Final color
        const finalRgb = hsvToRgb(h / 360, s / 100, v / 100);
        const hex = rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
        const hsl = rgbToHsl(finalRgb.r, finalRgb.g, finalRgb.b);

        // Preview & Inputs
        colorPreview.style.backgroundColor = hex;
        hexInput.value = hex;
        rgbInput.value = `rgb(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b})`;
        hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        // Markers
        pickerMarker.style.left = s + '%';
        pickerMarker.style.top = (100 - v) + '%';
        hueMarker.style.left = (h / 360) * 100 + '%';
    }

    // --- Mouse Events ---
    function handlePicker(e) {
        const rect = pickerContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        s = Math.max(0, Math.min(100, (x / rect.width) * 100));
        v = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
        updateUI();
    }

    function handleHue(e) {
        const rect = hueContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        h = Math.max(0, Math.min(360, (x / rect.width) * 360));
        updateUI();
    }

    pickerContainer.addEventListener('mousedown', (e) => { isDraggingPicker = true; handlePicker(e); });
    hueContainer.addEventListener('mousedown', (e) => { isDraggingHue = true; handleHue(e); });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingPicker) handlePicker(e);
        if (isDraggingHue) handleHue(e);
    });

    window.addEventListener('mouseup', () => {
        isDraggingPicker = false;
        isDraggingHue = false;
    });

    // --- Copy Logic ---
    document.querySelectorAll('.copy-color').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                navigator.clipboard.writeText(input.value)
                    .then(() => {
                        alertTrigger(getAlertConfig("copyContent"));
                        // Visual feedback on button
                        const originalHtml = btn.innerHTML;
                        btn.innerHTML = '<img src="https://api.iconify.design/material-symbols:check-rounded.svg?color=%23ffffff" width="16">';
                        setTimeout(() => btn.innerHTML = originalHtml, 1500);
                    })
                    .catch(() => {
                        alertTrigger(getAlertConfig("unexpectedError"));
                    });
            }
        });
    });

    // --- Direct Input Sync ---
    function anyToHex(str) {
        const temp = document.createElement('div');
        temp.style.color = str;
        document.body.appendChild(temp);
        const rgb = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);
        const match = rgb.match(/\d+/g);
        if (!match) return null;
        const [r, g, b] = match.map(Number);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    [hexInput, rgbInput, hslInput].forEach(input => {
        input.addEventListener('change', (e) => {
            const hex = anyToHex(e.target.value);
            if (hex) {
                updateUIFromHex(hex);
            }
        });
    });

    function updateUIFromHex(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const d = max - min;
        v = max * 100;
        s = max === 0 ? 0 : (d / max) * 100;
        if (max === min) h = 0;
        else {
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h *= 60;
        }
        updateUI();
    }

    // Initialize default
    updateUI();
}
