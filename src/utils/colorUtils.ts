/**
 * Utilidades de cálculo y contraste de color.
 */

/**
 * Calcula la luminosidad perceptiva y devuelve el color de texto óptimo
 * (blanco o negro/oscuro) para garantizar máxima legibilidad según el estándar W3C YIQ.
 *
 * @param hexColor Color de fondo hexadecimal en formato #RGB o #RRGGBB
 * @param darkColor Color de texto devuelto para fondos claros (por defecto '#0f172a')
 * @param lightColor Color de texto devuelto para fondos oscuros (por defecto '#ffffff')
 * @returns Color de texto contrastado
 */
export const getContrastTextColor = (
  hexColor: string | undefined | null,
  darkColor = '#0f172a',
  lightColor = '#ffffff'
): string => {
  if (!hexColor) return darkColor;

  let hex = hexColor.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    return darkColor;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return darkColor;
  }

  // Fórmula de luminosidad perceptiva YIQ (estándar NTSC / W3C para contraste)
  // Ponderación según la sensibilidad del ojo humano a cada longitud de onda:
  // Verde: 58.7%, Rojo: 29.9%, Azul: 11.4%
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Umbral 132 sobre 255: los fondos con YIQ < 132 se consideran oscuros
  return yiq < 132 ? lightColor : darkColor;
};

