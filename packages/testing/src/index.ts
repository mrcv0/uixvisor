import { createElement, type ReactElement, type ReactNode } from 'react';
import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, right: 0, bottom: 34, left: 0 },
};

function Providers({ children }: { children: ReactNode }) {
  return createElement(SafeAreaProvider, { initialMetrics }, children);
}

export function renderWithProviders(
  ui: ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
): Promise<RenderResult> {
  return render(ui, { ...options, wrapper: Providers });
}

export {
  accessibilityIssues,
  assertAccessible,
  type AccessibilityProps,
} from './accessibility.js';
