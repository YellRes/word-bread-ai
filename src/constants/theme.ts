/**
 * Word Bread AI Theme Configuration
 * Design specs from Stitch "Word Bread Home Dashboard"
 * - Primary Color: #ee8c2b (Orange)
 * - Color Mode: Light
 * - Font: Lexend
 * - Border Radius: 8px
 * - Saturation: 2
 *
 * AI Generated - Based on Stitch design specifications
 */

import { Platform } from "react-native";

// Primary theme color from Stitch design
export const PRIMARY_COLOR = "#ee8c2b";
export const PRIMARY_COLOR_LIGHT = "#f5a854";
export const PRIMARY_COLOR_DARK = "#d47a1f";

// Success/Error colors
export const SUCCESS_COLOR = "#4CAF50";
export const ERROR_COLOR = "#F44336";

// Border radius from Stitch design (ROUND_EIGHT)
export const BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 12,
  full: 9999,
};

// Spacing constants
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    background: "#F8F9FA",
    cardBackground: "#FFFFFF",
    tint: PRIMARY_COLOR,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: PRIMARY_COLOR,
    border: "#E4E7EB",
    success: SUCCESS_COLOR,
    error: ERROR_COLOR,
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    background: "#151718",
    cardBackground: "#1E2022",
    tint: PRIMARY_COLOR_LIGHT,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: PRIMARY_COLOR_LIGHT,
    border: "#2D3134",
    success: SUCCESS_COLOR,
    error: ERROR_COLOR,
  },
};

// Lexend font family name (loaded via expo-font)
export const FONT_FAMILY = {
  regular: "Lexend_400Regular",
  medium: "Lexend_500Medium",
  semiBold: "Lexend_600SemiBold",
  bold: "Lexend_700Bold",
};

export const Fonts = Platform.select({
  ios: {
    sans: "Lexend_400Regular",
    serif: "ui-serif",
    rounded: "Lexend_400Regular",
    mono: "ui-monospace",
  },
  android: {
    sans: "Lexend_400Regular",
    serif: "serif",
    rounded: "Lexend_400Regular",
    mono: "monospace",
  },
  default: {
    sans: "Lexend_400Regular",
    serif: "serif",
    rounded: "Lexend_400Regular",
    mono: "monospace",
  },
  web: {
    sans: "Lexend, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "Lexend, 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// UI Kitten custom theme mapping
export const customTheme = {
  "color-primary-100": "#FEF0E0",
  "color-primary-200": "#FDE0C2",
  "color-primary-300": "#FACCA3",
  "color-primary-400": "#F7B88B",
  "color-primary-500": PRIMARY_COLOR, // #ee8c2b
  "color-primary-600": "#CC7623",
  "color-primary-700": "#AA611C",
  "color-primary-800": "#894D16",
  "color-primary-900": "#713F11",

  "color-success-500": SUCCESS_COLOR,
  "color-danger-500": ERROR_COLOR,

  "border-radius": BORDER_RADIUS.medium,

  "text-font-family": "Lexend_400Regular",
  "text-heading-1-font-family": "Lexend_700Bold",
  "text-heading-2-font-family": "Lexend_600SemiBold",
  "text-subtitle-1-font-family": "Lexend_500Medium",
};

// Custom Input styles for practice page (no border on focus)
export const practiceInputStyle = {
  borderWidth: 0,
  borderColor: "transparent",
  backgroundColor: "transparent",
  // Override focused state
  borderBottomWidth: 0,
};
