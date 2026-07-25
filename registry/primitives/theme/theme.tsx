// UIXVISOR — https://uixvisor.dev/primitives/theme
//
// Runtime access to the design tokens. Most styling goes through NativeWind
// classes, but three things cannot: SVG icon colours, native colour props
// (Switch trackColor, ActivityIndicator color), and shadows. Those need literal
// values, which is what this file provides.
//
// The values here mirror `global.css`. `scripts/verify-tokens.mjs` fails the
// build if the two ever drift apart.
import { useColorScheme } from 'nativewind';
import type { ViewStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export type ThemeColorName =
  | 'background'
  | 'foreground'
  | 'surface'
  | 'surface-elevated'
  | 'card'
  | 'card-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'border'
  | 'input'
  | 'ring'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'destructive-foreground'
  | 'overlay'
  | 'tab-bar'
  | 'sheet'
  | 'skeleton';

export const themeColors: Record<ThemeMode, Record<ThemeColorName, string>> = {
  light: {
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
  },
  dark: {
    background: '#09090b',
    foreground: '#fafafa',
    surface: '#09090b',
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
  },
};

/** Current colour scheme, defaulting to light when the platform reports nothing. */
export function useThemeMode(): ThemeMode {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}

/** Resolves a semantic colour for the active mode. */
export function useThemeColor(name: ThemeColorName): string {
  return themeColors[useThemeMode()][name];
}

export type ElevationLevel = 'surface' | 'raised' | 'overlay';

/**
 * iOS reads shadowColor/Offset/Opacity/Radius; Android only honours elevation.
 * Both are emitted so one token works on either platform.
 *
 * NativeWind's `shadow-*` classes cannot express this: react-native-css-interop
 * maps box-shadow to shadowColor and shadowRadius only, leaving shadowOpacity at
 * its default of 0 (invisible on iOS) and never setting elevation (invisible on
 * Android). Shadows therefore have to come through `style`.
 */
const lightElevation: Record<ElevationLevel, ViewStyle> = {
  surface: {},
  raised: {
    // Wide and faint rather than tight and dark. A small shadowRadius reads as a
    // hard grey rim on iOS, and Android's `elevation` draws its own shadow that
    // ignores shadowOpacity entirely - so elevation stays at 1 to keep the two
    // platforms in the same visual range. Surfaces also carry a hairline border,
    // which is what actually guarantees definition when a platform renders the
    // shadow differently than expected.
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  overlay: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
};

/**
 * Returns the shadow style for a raised surface, or nothing in dark mode.
 *
 * Shadows are physically unreadable against a dark background, so dark surfaces
 * separate themselves with a lighter `card`/`sheet` colour plus a border - both
 * of which come from the token classes, not from here.
 */
export function useElevation(level: ElevationLevel): ViewStyle {
  return useThemeMode() === 'dark' ? {} : lightElevation[level];
}
