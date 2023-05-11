
// Generates a distinct color based on given already generated colors
export function getDistinctHexColorCode(existingColors: string[]): string {
  const hexDigits = '0123456789ABCDEF';
  const maxTries = 1000;
  const generateColor = (): string => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hexDigits[Math.floor(Math.random() * 16)];
    }
    const isDistinct = existingColors.every((c) => {
      return getHexColorDistance(color, c) > 50;
    });
    if (isDistinct) {
      return color;
    }
    return generateColor();
  };
  for (let i = 0; i < maxTries; i++) {
    const color = generateColor();
    if (color) {
      return color;
    }
  }
  // just in case for future updates
  throw new Error('Could not generate distinct color');
}

function getHexColorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const rMean = (rgb1.r + rgb2.r) / 2;
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return Math.sqrt(
    (2 + rMean / 256) * rDiff ** 2 +
    4 * gDiff ** 2 +
    (2 + (255 - rMean) / 256) * bDiff ** 2
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) {
    throw new Error(`Invalid hex color code: ${hex}`);
  }
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}
