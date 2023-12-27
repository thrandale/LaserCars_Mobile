/**
 * Converts an RGB color string to a hex color string.
 * @param rgb - The RGB color string to convert.
 * Must be in the format `rgb(r, g, b)`.
 * @returns The hex color string.
 */
export function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(v => parseInt(v, 10));

  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

/**
 * Converts an RGB color string to RGBA by adding an alpha value.
 * @param rgb - The RGB color string to convert.
 * @param alpha - The alpha value to add to the RGBA color string.
 * @returns The RGBA color string.
 */
export function rgbToRgba(rgb: string, alpha: number): string {
  return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
}

/**
 * Converts polar coordinates to Cartesian coordinates.
 * @param centerX The x coordinate of the center point in Cartesian space.
 * @param centerY The y coordinate of the center point in Cartesian space.
 * @param radius The radius of the polar coordinates.
 * @param angle The angle of the polar coordinates.
 * @returns An object with the x and y coordinates in Cartesian space.
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

/**
 * Converts Cartesian coordinates to polar coordinates.
 * @param centerX The x coordinate of the center point in Cartesian space.
 * @param centerY The y coordinate of the center point in Cartesian space.
 * @param x The x coordinate in Cartesian space.
 * @param y The y coordinate in Cartesian space.
 * @returns An object with the radius and angle of the polar coordinates.
 */
export function cartesianToPolar(
  centerX: number,
  centerY: number,
  x: number,
  y: number,
) {
  return {
    radius: Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2),
    angle: Math.atan2(y - centerY, x - centerX),
  };
}
