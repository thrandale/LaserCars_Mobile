/**
 * Converts an RGB color string to RGBA by adding an alpha value.
 * @param rgb - The RGB color string to convert.
 * @param alpha - The alpha value to add to the RGBA color string.
 * @returns The RGBA color string.
 */
export function rgbToRgba(rgb: string, alpha: number): string {
  return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
}
