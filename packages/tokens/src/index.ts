export * from './icons.js';

export const semanticColorNames = [
  'background',
  'foreground',
  'surface',
  'surface-elevated',
  'card',
  'card-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'border',
  'input',
  'ring',
  'success',
  'warning',
  'destructive',
  'destructive-foreground',
  'overlay',
  'tab-bar',
  'sheet',
  'skeleton',
] as const;

export type SemanticColorName = (typeof semanticColorNames)[number];
export type ThemeMode = 'light' | 'dark';
export type SemanticColors = Record<SemanticColorName, string>;

export interface MotionTokens {
  duration: {
    /** Press-in feedback. Deliberately shorter than pressOut so the control feels eager. */
    pressIn: number;
    /** Press-out release. Longer than pressIn to avoid a snappy, cheap rebound. */
    pressOut: number;
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    standard: string;
    emphasized: string;
  };
  /** Scale a pressable settles at while held. */
  pressScale: number;
  /** Opacity multiplier applied to a pressed surface. */
  pressOpacity: number;
}

export interface TypographyStep {
  fontSize: number;
  lineHeight: number;
  /** Tracking in em. Negative tightens; headings read as designed rather than default. */
  letterSpacing: number;
}

export type TypographyStepName = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type FontWeightName = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TypographyTokens {
  scale: Record<TypographyStepName, TypographyStep>;
  /**
   * Weight names map to font *families*, not numeric fontWeight. React Native on
   * Android cannot reliably synthesise weights for custom fonts, so each weight
   * must be registered as its own family. Consumers that skip the font install
   * fall back to the platform default via `fallbackFamily`.
   */
  weights: Record<FontWeightName, { family: string; numeric: number }>;
  fallbackFamily: string | undefined;
}

/**
 * React Native shadow primitives. iOS reads the `shadow*` fields; Android only
 * honours `elevation`. Both are emitted so a single token works cross-platform.
 */
export interface ElevationStep {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export type ElevationName = 'surface' | 'raised' | 'overlay';

export interface DesignTokens {
  colors: Record<ThemeMode, SemanticColors>;
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl' | 'full', number>;
  typography: TypographyTokens;
  motion: MotionTokens;
  /**
   * Light mode only. Shadows are physically unreadable on dark backgrounds, so
   * dark surfaces separate themselves with `surface-elevated` plus a border
   * instead. See `useElevation` in the registry.
   */
  elevation: Record<ElevationName, ElevationStep>;
  components: {
    button: { height: number };
    input: { height: number };
    iconButton: { size: number };
  };
}

const lightColors: SemanticColors = {
  background: '#ffffff',
  foreground: '#09090b',
  surface: '#ffffff',
  'surface-elevated': '#ffffff',
  card: '#ffffff',
  'card-foreground': '#09090b',
  primary: '#18181b',
  'primary-foreground': '#fafafa',
  secondary: '#f4f4f5',
  'secondary-foreground': '#18181b',
  muted: '#f4f4f5',
  'muted-foreground': '#71717a',
  accent: '#f4f4f5',
  'accent-foreground': '#18181b',
  border: '#e4e4e7',
  input: '#e4e4e7',
  ring: '#18181b',
  success: '#16a34a',
  warning: '#d97706',
  destructive: '#dc2626',
  'destructive-foreground': '#fafafa',
  overlay: '#000000',
  'tab-bar': '#ffffff',
  sheet: '#ffffff',
  skeleton: '#e4e4e7',
};

const darkColors: SemanticColors = {
  background: '#09090b',
  foreground: '#fafafa',
  surface: '#09090b',
  // Dark mode carries depth with a lighter surface instead of a shadow.
  'surface-elevated': '#18181b',
  card: '#18181b',
  'card-foreground': '#fafafa',
  primary: '#fafafa',
  'primary-foreground': '#18181b',
  secondary: '#27272a',
  'secondary-foreground': '#fafafa',
  muted: '#27272a',
  'muted-foreground': '#a1a1aa',
  accent: '#27272a',
  'accent-foreground': '#fafafa',
  border: '#27272a',
  input: '#27272a',
  ring: '#d4d4d8',
  success: '#4ade80',
  warning: '#fbbf24',
  destructive: '#dc2626',
  'destructive-foreground': '#fafafa',
  overlay: '#000000',
  'tab-bar': '#09090b',
  sheet: '#18181b',
  skeleton: '#27272a',
};

export const defaultTokens: DesignTokens = {
  colors: { light: lightColors, dark: darkColors },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 },
  typography: {
    scale: {
      xs: { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
      sm: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
      base: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
      lg: { fontSize: 18, lineHeight: 26, letterSpacing: -0.18 },
      xl: { fontSize: 20, lineHeight: 28, letterSpacing: -0.4 },
      '2xl': { fontSize: 24, lineHeight: 32, letterSpacing: -0.48 },
      '3xl': { fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
    },
    weights: {
      regular: { family: 'Inter_400Regular', numeric: 400 },
      medium: { family: 'Inter_500Medium', numeric: 500 },
      semibold: { family: 'Inter_600SemiBold', numeric: 600 },
      bold: { family: 'Inter_700Bold', numeric: 700 },
    },
    fallbackFamily: undefined,
  },
  motion: {
    duration: { pressIn: 120, pressOut: 180, fast: 150, normal: 250, slow: 400 },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
    },
    pressScale: 0.97,
    pressOpacity: 0.9,
  },
  elevation: {
    surface: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    raised: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    overlay: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  components: {
    button: { height: 48 },
    input: { height: 48 },
    iconButton: { size: 48 },
  },
};

export function resolveThemeColor(
  tokens: DesignTokens,
  mode: ThemeMode,
  name: SemanticColorName,
): string {
  return tokens.colors[mode][name];
}
