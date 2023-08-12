export function rgbToRgba(rgb: string, alpha: number): string {
  return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
}
