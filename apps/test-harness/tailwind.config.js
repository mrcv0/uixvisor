/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './App.tsx',
    './src/**/*.{ts,tsx}',
    './__tests__/**/*.{ts,tsx}',
    '../../registry/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        overlay: 'var(--color-overlay)',
        'tab-bar': 'var(--color-tab-bar)',
        sheet: 'var(--color-sheet)',
        skeleton: 'var(--color-skeleton)',
      },
      // Weights map to font families rather than numeric weights: React Native
      // on Android cannot synthesise weights for a custom font, so each weight
      // is registered as its own family. Falls back to the platform font when
      // Inter has not been loaded.
      fontFamily: {
        sans: ['Inter_400Regular', 'System'],
        medium: ['Inter_500Medium', 'System'],
        semibold: ['Inter_600SemiBold', 'System'],
        bold: ['Inter_700Bold', 'System'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '0px' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '0px' }],
        base: ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        lg: ['18px', { lineHeight: '26px', letterSpacing: '-0.18px' }],
        xl: ['20px', { lineHeight: '28px', letterSpacing: '-0.4px' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.48px' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.6px' }],
      },
    },
  },
  plugins: [],
};
