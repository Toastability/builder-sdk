/**
 * Style Configuration Types
 *
 * TypeScript interfaces for the style system mapped to STYLES.md template
 */

/**
 * HSL color value (format: "hue saturation lightness")
 * Example: "222.2 47.4% 11.2%"
 */
export type HSLColor = string;

/**
 * Color system configuration
 */
export interface ColorConfig {
  // Base Colors
  background: HSLColor;
  foreground: HSLColor;

  // Brand Colors
  primary: HSLColor;
  primaryForeground: HSLColor;
  secondary: HSLColor;
  secondaryForeground: HSLColor;

  // UI Element Colors
  muted: HSLColor;
  mutedForeground: HSLColor;
  accent: HSLColor;
  accentForeground: HSLColor;

  // Semantic Colors
  destructive: HSLColor;
  destructiveForeground: HSLColor;
  warning: HSLColor;
  warningForeground: HSLColor;
  success: HSLColor;
  successForeground: HSLColor;
  info: HSLColor;
  infoForeground: HSLColor;

  // Border & Input
  border: HSLColor;
  input: HSLColor;
  ring: HSLColor;

  // Card
  card: HSLColor;
  cardForeground: HSLColor;

  // Popover
  popover: HSLColor;
  popoverForeground: HSLColor;

  // Chart Colors (1-5)
  chart1: HSLColor;
  chart2: HSLColor;
  chart3: HSLColor;
  chart4: HSLColor;
  chart5: HSLColor;

  // Sidebar Colors
  sidebar: HSLColor;
  sidebarForeground: HSLColor;
  sidebarPrimary: HSLColor;
  sidebarPrimaryForeground: HSLColor;
  sidebarAccent: HSLColor;
  sidebarAccentForeground: HSLColor;
  sidebarBorder: HSLColor;
  sidebarRing: HSLColor;
}

/**
 * Typography configuration
 */
export interface TypographyConfig {
  // Font Families
  fontSans: string;
  fontMono: string;

  // Font Sizes (rem units)
  sizes: {
    xs: string;      // 0.75rem (12px)
    sm: string;      // 0.875rem (14px)
    base: string;    // 1rem (16px)
    lg: string;      // 1.125rem (18px)
    xl: string;      // 1.25rem (20px)
    '2xl': string;   // 1.5rem (24px)
    '3xl': string;   // 1.875rem (30px)
    '4xl': string;   // 2.25rem (36px)
    '5xl': string;   // 3rem (48px)
    '6xl': string;   // 3.75rem (60px)
    '7xl': string;   // 4.5rem (72px)
    '8xl': string;   // 6rem (96px)
    '9xl': string;   // 8rem (128px)
  };

  // Line Heights
  lineHeights: {
    tight: number;    // 1.25
    snug: number;     // 1.375
    normal: number;   // 1.5
    relaxed: number;  // 1.625
    loose: number;    // 2
  };

  // Font Weights
  weights: {
    thin: number;       // 100
    extralight: number; // 200
    light: number;      // 300
    normal: number;     // 400
    medium: number;     // 500
    semibold: number;   // 600
    bold: number;       // 700
    extrabold: number;  // 800
    black: number;      // 900
  };
}

/**
 * Spacing and layout configuration
 */
export interface SpacingConfig {
  // Container Max Widths
  containers: {
    sm: string;   // 640px
    md: string;   // 768px
    lg: string;   // 1024px
    xl: string;   // 1280px
    '2xl': string; // 1536px
    '4xl': string; // 1536px
  };

  // Section Spacing
  sections: {
    sm: string;  // 2rem (32px)
    md: string;  // 4rem (64px)
    lg: string;  // 6rem (96px)
    xl: string;  // 8rem (128px)
  };

  // Padding Scale
  padding: {
    xs: string;   // 0.5rem (8px)
    sm: string;   // 1rem (16px)
    md: string;   // 1.5rem (24px)
    lg: string;   // 2rem (32px)
    xl: string;   // 3rem (48px)
    '2xl': string; // 4rem (64px)
  };

  // Border Radius
  radius: {
    sm: string;   // 0.125rem (2px)
    md: string;   // 0.375rem (6px)
    lg: string;   // 0.5rem (8px)
    xl: string;   // 0.75rem (12px)
    '2xl': string; // 1rem (16px)
    full: string;  // 9999px
  };
}

/**
 * Complete style configuration
 */
export interface StyleConfig {
  colors: ColorConfig;
  typography: TypographyConfig;
  spacing: SpacingConfig;
}

/**
 * Style preset with metadata
 */
export interface StylePreset {
  id: string;
  name: string;
  description?: string;
  config: StyleConfig;
  thumbnail?: string;
  isPremium?: boolean;
}

/**
 * CSS generation options
 */
export interface CSSGenerationOptions {
  includeBase?: boolean;
  includeDark?: boolean;
  minify?: boolean;
}

/**
 * Parsed STYLES.md structure
 */
export interface ParsedStylesTemplate {
  colors: Map<string, HSLColor>;
  typography: Map<string, string | number>;
  spacing: Map<string, string>;
  raw: string;
}
