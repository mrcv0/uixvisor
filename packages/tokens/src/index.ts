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
  'border',
  'input',
  'ring',
  'success',
  'warning',
  'destructive',
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
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    standard: string;
    emphasized: string;
  };
}

export interface DesignTokens {
  colors: Record<ThemeMode, SemanticColors>;
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl' | 'full', number>;
  motion: MotionTokens;
  elevation: Record<'surface' | 'raised' | 'overlay', number>;
  components: {
    button: {
      minimumHeight: number;
    };
    input: {
      minimumHeight: number;
    };
  };
}

const lightColors: SemanticColors = {
  background: '#ffffff',
  foreground: '#0f172a',
  surface: '#ffffff',
  'surface-elevated': '#f8fafc',
  card: '#ffffff',
  'card-foreground': '#0f172a',
  primary: '#2563eb',
  'primary-foreground': '#ffffff',
  secondary: '#f1f5f9',
  'secondary-foreground': '#0f172a',
  muted: '#f1f5f9',
  'muted-foreground': '#64748b',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#2563eb',
  success: '#16a34a',
  warning: '#d97706',
  destructive: '#dc2626',
  overlay: '#000000',
  'tab-bar': '#ffffff',
  sheet: '#f8fafc',
  skeleton: '#e2e8f0',
};

const darkColors: SemanticColors = {
  background: '#0b1220',
  foreground: '#f8fafc',
  surface: '#111827',
  'surface-elevated': '#1a2233',
  card: '#111827',
  'card-foreground': '#f8fafc',
  primary: '#3b82f6',
  'primary-foreground': '#ffffff',
  secondary: '#1f2937',
  'secondary-foreground': '#f8fafc',
  muted: '#1f2937',
  'muted-foreground': '#94a3b8',
  border: '#1f2937',
  input: '#1f2937',
  ring: '#3b82f6',
  success: '#4ade80',
  warning: '#fbbf24',
  destructive: '#f87171',
  overlay: '#000000',
  'tab-bar': '#111827',
  sheet: '#1a2233',
  skeleton: '#1f2937',
};

export const defaultTokens: DesignTokens = {
  colors: { light: lightColors, dark: darkColors },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 8, lg: 12, xl: 16, full: 9999 },
  motion: {
    duration: { fast: 150, normal: 250, slow: 400 },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
    },
  },
  elevation: { surface: 0, raised: 2, overlay: 8 },
  components: {
    button: { minimumHeight: 44 },
    input: { minimumHeight: 44 },
  },
};

export function resolveThemeColor(
  tokens: DesignTokens,
  mode: ThemeMode,
  name: SemanticColorName,
): string {
  return tokens.colors[mode][name];
}
