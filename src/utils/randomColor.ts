/**
 * Converts a hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  return { r, g, b };
}

/**
 * Converts RGB values to a hex string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts HSV to RGB
 */
function hsvToRgb(
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
}

/**
 * Calculates the relative luminance of a color
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates the contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates valid luminance ranges for high contrast
 */
function calculateValidLuminanceRanges(
  existingLuminances: number[],
  minContrastRatio: number
): Array<{ min: number; max: number }> {
  // For each existing color, calculate forbidden luminance ranges
  const forbiddenRanges: Array<{ min: number; max: number }> = [];

  for (const existingLum of existingLuminances) {
    // For contrast ratio ≥ minRatio, we need:
    // (L1 + 0.05) / (L2 + 0.05) ≥ minRatio OR (L2 + 0.05) / (L1 + 0.05) ≥ minRatio

    // This gives us forbidden range:
    const lowerBound = (existingLum + 0.05) / minContrastRatio - 0.05;
    const upperBound = (existingLum + 0.05) * minContrastRatio - 0.05;

    // The forbidden range is between these bounds
    forbiddenRanges.push({
      min: Math.max(0, lowerBound),
      max: Math.min(1, upperBound),
    });
  }

  // Merge overlapping forbidden ranges
  forbiddenRanges.sort((a, b) => a.min - b.min);
  const mergedForbidden: Array<{ min: number; max: number }> = [];

  for (const range of forbiddenRanges) {
    if (
      mergedForbidden.length === 0 ||
      mergedForbidden[mergedForbidden.length - 1].max < range.min
    ) {
      mergedForbidden.push(range);
    } else {
      mergedForbidden[mergedForbidden.length - 1].max = Math.max(
        mergedForbidden[mergedForbidden.length - 1].max,
        range.max
      );
    }
  }

  // Calculate valid ranges (gaps between forbidden ranges)
  const validRanges: Array<{ min: number; max: number }> = [];
  let currentMin = 0;

  for (const forbidden of mergedForbidden) {
    if (currentMin < forbidden.min) {
      validRanges.push({ min: currentMin, max: forbidden.min });
    }
    currentMin = Math.max(currentMin, forbidden.max);
  }

  // Add final range if there's space
  if (currentMin < 1) {
    validRanges.push({ min: currentMin, max: 1 });
  }

  return validRanges.filter((range) => range.max - range.min > 0.001); // Filter tiny ranges
}

/**
 * Generates RGB color with target luminance (approximate)
 */
function generateColorWithLuminance(targetLuminance: number): string {
  // Strategy: Use HSV space to control luminance more predictably
  // Generate random hue and saturation, then adjust value to hit target luminance

  const hue = Math.random() * 360;
  const saturation = 0.3 + Math.random() * 0.7; // Avoid too washed out colors

  // Binary search for the right value to achieve target luminance
  let minValue = 0;
  let maxValue = 1;
  let bestValue = 0.5;
  let bestDiff = Infinity;

  for (let i = 0; i < 20; i++) {
    // 20 iterations should be enough precision
    const testValue = (minValue + maxValue) / 2;
    const rgb = hsvToRgb(hue, saturation, testValue);
    const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
    const diff = Math.abs(luminance - targetLuminance);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestValue = testValue;
    }

    if (luminance < targetLuminance) {
      minValue = testValue;
    } else {
      maxValue = testValue;
    }
  }

  const finalRgb = hsvToRgb(hue, saturation, bestValue);
  return rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
}

/**
 * Generates a random color that has high contrast with all colors in the input array
 * Uses mathematical analysis to find valid luminance ranges, then generates colors in those ranges
 *
 * @param colors - Array of hex color strings to contrast against
 * @param minContrastRatio - Minimum contrast ratio required (default: 4.5 for WCAG AA)
 * @param maxAttempts - Maximum attempts per valid range (default: 50)
 * @returns A hex color string with high contrast, or null if no suitable color found
 */
export function generateHighContrastColor(
  colors: string[],
  minContrastRatio: number = 4.5,
  maxAttempts: number = 50
): string | null {
  // Handle edge case: empty array
  if (colors.length === 0) {
    const hue = Math.random() * 360;
    const rgb = hsvToRgb(hue, 0.7, 0.8);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  // Clean input colors and calculate their luminances
  const cleanColors = colors.map((color) =>
    color.startsWith('#') ? color : `#${color}`
  );

  const existingLuminances = cleanColors.map((color) => {
    const rgb = hexToRgb(color);
    return getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  });

  // Calculate valid luminance ranges
  const validRanges = calculateValidLuminanceRanges(
    existingLuminances,
    minContrastRatio
  );

  if (validRanges.length === 0) {
    // No valid ranges exist, try again with a slightly lower contrast ratio
    return generateHighContrastColor(colors, minContrastRatio - 0.01);
  }

  // Weight ranges by their size for better sampling
  const totalWeight = validRanges.reduce(
    (sum, range) => sum + (range.max - range.min),
    0
  );

  // Try to generate a color in valid ranges
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Pick a random range weighted by size
    let randomWeight = Math.random() * totalWeight;
    let selectedRange = validRanges[0];

    for (const range of validRanges) {
      const rangeWeight = range.max - range.min;
      if (randomWeight <= rangeWeight) {
        selectedRange = range;
        break;
      }
      randomWeight -= rangeWeight;
    }

    // Pick random luminance within selected range
    const targetLuminance =
      selectedRange.min +
      Math.random() * (selectedRange.max - selectedRange.min);

    // Generate color with that luminance
    const candidate = generateColorWithLuminance(targetLuminance);

    // Verify it actually meets contrast requirements (due to approximation in luminance generation)
    const meetsAllContrasts = cleanColors.every((color) => {
      const contrast = getContrastRatio(candidate, color);
      return contrast >= minContrastRatio;
    });

    if (meetsAllContrasts) {
      return candidate;
    }
  }

  return null;
}

/**
 * Generates n high contrast colors that are not in the existing colors array
 * @param n - The number of colors to generate
 * @param existingColors - The existing colors to contrast against
 * @param minContrastRatio - Minimum contrast ratio required (default: 4.5)
 * @returns An array of n high contrast hex color strings
 */
export function generateNHighContrastColors(
  n: number,
  existingColors: string[],
  minContrastRatio: number = 4.5
): string[] {
  const colors = [...existingColors];
  for (let i = 0; i < n; i++) {
    const color = generateHighContrastColor(colors, minContrastRatio);
    if (color) {
      colors.push(color);
    }
  }
  return colors;
}
