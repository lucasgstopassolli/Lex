document.addEventListener('DOMContentLoaded', () => {
      // Elementos do DOM - Primeiro Plano (Foreground)
      const fgColorInput = document.getElementById('fgColor');
      const fgHexInput = document.getElementById('fgHex');
      const fgAlphaInput = document.getElementById('fgAlpha'); // Adicionado
      const fgLightnessSlider = document.getElementById('fgLightness'); // Adicionado

      // Elementos do DOM - Fundo (Background)
      const bgColorInput = document.getElementById('bgColor');
      const bgHexInput = document.getElementById('bgHex');
      const bgAlphaInput = document.getElementById('bgAlpha'); // Adicionado
      const bgLightnessSlider = document.getElementById('bgLightness'); // Adicionado

      // Elementos do DOM - Resultados
      const contrastRatioDisplay = document.getElementById('contrastRatioDisplay');
      const contrastRatioValueSpan = document.getElementById('contrastRatioValue');
      const wcagAASpan = document.getElementById('wcagAA');
      const wcagAALargeSpan = document.getElementById('wcagAALarge');
      const wcagAAASpan = document.getElementById('wcagAAA');
      const wcagAAALargeSpan = document.getElementById('wcagAAALarge');

      // --- Funções de Conversão de Cor ---
      function hexToRgb(hex) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

      function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
      }

      function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
          h = s = 0; // achromatic
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
      }

      function hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
          l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return {
          r: Math.round(255 * f(0)),
          g: Math.round(255 * f(8)),
          b: Math.round(255 * f(4)),
        };
      }

      // --- Funções de Contraste WCAG ---
      function getLuminance(r, g, b) {
        const a = [r, g, b].map((v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function getContrastRatio(lum1, lum2) {
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      // --- Lógica de Atualização e Cálculo ---
      function updateColorFromHex(hexInput, colorInput, lightnessSlider) {
        if (/^#[0-9A-F]{6}$/i.test(hexInput.value) || /^#[0-9A-F]{3}$/i.test(hexInput.value)) {
          colorInput.value = hexInput.value;
          const rgb = hexToRgb(hexInput.value);
          if (rgb) {
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            lightnessSlider.value = hsl.l.toFixed(0);
          }
          calculateAndDisplayContrast();
        }
      }

      function updateHexFromColor(colorInput, hexInput, lightnessSlider) {
        hexInput.value = colorInput.value.toUpperCase();
        const rgb = hexToRgb(colorInput.value);
        if (rgb) {
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          lightnessSlider.value = hsl.l.toFixed(0);
        }
        calculateAndDisplayContrast();
      }

      function updateColorFromLightness(lightnessSlider, hexInput, colorInput) {
        const currentHex = hexInput.value;
        let rgb = hexToRgb(currentHex);
        if (!rgb) rgb = { r: 0, g: 0, b: 0 }; // Default to black if hex is invalid

        let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.l = parseFloat(lightnessSlider.value);

        const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);

        hexInput.value = newHex;
        colorInput.value = newHex;
        calculateAndDisplayContrast();
      }

      function calculateAndDisplayContrast() {
        // NOTA: Para este exemplo, os campos Alfa não estão sendo usados para misturar
        // as cores antes do cálculo de contraste. Assume-se cores opacas.
        // Se fgAlphaInput.value < 1 ou bgAlphaInput.value < 1, uma lógica de
        // "flattening" (achatamento) da cor seria necessária aqui.

        const fgRgb = hexToRgb(fgHexInput.value);
        const bgRgb = hexToRgb(bgHexInput.value);

        if (!fgRgb || !bgRgb) {
          contrastRatioValueSpan.textContent = "Inválido";
          contrastRatioDisplay.className = "ratio-display nodata";
          setComplianceResult(wcagAASpan, null);
          setComplianceResult(wcagAALargeSpan, null);
          setComplianceResult(wcagAAASpan, null);
          setComplianceResult(wcagAAALargeSpan, null);
          return;
        }

        const lum1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
        const lum2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        const contrast = getContrastRatio(lum1, lum2);

        contrastRatioValueSpan.textContent = contrast.toFixed(2) + ":1";

        // Atualiza a cor da borda/texto da taxa de contraste
        if (contrast >= 4.5) { // Mínimo para AA texto normal
          contrastRatioDisplay.className = "ratio-display pass";
        } else if (contrast >= 3) { // Mínimo para AA texto grande / componentes UI
          contrastRatioDisplay.className = "ratio-display pass"; // Ainda passa para algo
        }
        else {
          contrastRatioDisplay.className = "ratio-display fail";
        }


        // WCAG AA
        setComplianceResult(wcagAASpan, contrast >= 4.5);
        setComplianceResult(wcagAALargeSpan, contrast >= 3);

        // WCAG AAA
        setComplianceResult(wcagAAASpan, contrast >= 7);
        setComplianceResult(wcagAAALargeSpan, contrast >= 4.5);
      }

      function setComplianceResult(element, passes) {
        if (passes === null) {
          element.textContent = "--";
          element.className = "";
        } else if (passes) {
          element.textContent = "Passa";
          element.className = "pass-text";
        } else {
          element.textContent = "Falha";
          element.className = "fail-text";
        }
      }

      // --- Event Listeners ---
      // Primeiro Plano
      fgHexInput.addEventListener('input', () => updateColorFromHex(fgHexInput, fgColorInput, fgLightnessSlider));
      fgColorInput.addEventListener('input', () => updateHexFromColor(fgColorInput, fgHexInput, fgLightnessSlider));
      fgLightnessSlider.addEventListener('input', () => updateColorFromLightness(fgLightnessSlider, fgHexInput, fgColorInput));
      fgAlphaInput.addEventListener('input', calculateAndDisplayContrast); // Apenas recalcula, não usa o valor de alfa ainda

      // Fundo
      bgHexInput.addEventListener('input', () => updateColorFromHex(bgHexInput, bgColorInput, bgLightnessSlider));
      bgColorInput.addEventListener('input', () => updateHexFromColor(bgColorInput, bgHexInput, bgLightnessSlider));
      bgLightnessSlider.addEventListener('input', () => updateColorFromLightness(bgLightnessSlider, bgHexInput, bgColorInput));
      bgAlphaInput.addEventListener('input', calculateAndDisplayContrast); // Apenas recalcula

      // Inicializar com valores padrão ao carregar
      // Seta os sliders para os valores iniciais dos inputs hex
      updateColorFromHex(fgHexInput, fgColorInput, fgLightnessSlider); // Para inicializar o slider fg
      updateColorFromHex(bgHexInput, bgColorInput, bgLightnessSlider); // Para inicializar o slider bg
      // A chamada acima já dispara calculateAndDisplayContrast
    });