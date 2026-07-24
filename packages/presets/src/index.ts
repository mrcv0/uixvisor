import {
  defaultTokens,
  semanticColorNames,
  type DesignTokens,
  type SemanticColors,
  type ThemeMode,
} from '@uixvisor/tokens';

export type PresetName = 'default' | 'fintech';

export interface ThemePreset {
  name: PresetName;
  tokens: DesignTokens;
}

function withColorOverrides(
  base: DesignTokens,
  overrides: Partial<Record<ThemeMode, Partial<SemanticColors>>>,
): DesignTokens {
  return {
    ...base,
    colors: {
      light: { ...base.colors.light, ...overrides.light },
      dark: { ...base.colors.dark, ...overrides.dark },
    },
  };
}

export const defaultPreset: ThemePreset = {
  name: 'default',
  tokens: defaultTokens,
};

export const fintechPreset: ThemePreset = {
  name: 'fintech',
  tokens: withColorOverrides(defaultTokens, {
    light: {
      primary: '#0369a1',
      ring: '#0284c7',
      success: '#047857',
      card: '#f8fafc',
    },
    dark: {
      primary: '#38bdf8',
      ring: '#38bdf8',
      success: '#34d399',
      card: '#0f172a',
    },
  }),
};

export const builtinPresets: Record<PresetName, ThemePreset> = {
  default: defaultPreset,
  fintech: fintechPreset,
};

export function getPreset(name: PresetName): ThemePreset {
  return builtinPresets[name];
}

export function validatePreset(preset: ThemePreset): string[] {
  const missing: string[] = [];
  for (const mode of ['light', 'dark'] as const) {
    for (const name of semanticColorNames) {
      if (!preset.tokens.colors[mode][name]) {
        missing.push(`${mode}.${name}`);
      }
    }
  }
  return missing;
}
