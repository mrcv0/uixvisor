// UIXVISOR — https://uixvisor.dev/primitives/theme
//
// Inter is the default typeface but never a hard requirement: if a project skips
// this hook, `font-sans` falls through to the platform font and every component
// still renders. That keeps `uixvisor add button` working in a project that has
// not installed a font.
//
// Each weight is registered as its own family because React Native on Android
// cannot synthesise weights for a custom font - asking for fontWeight 600 on a
// single family silently renders the regular cut.
//
// Weights are imported from their subpaths on purpose. Importing from the
// package root pulls all 18 cuts into the bundle (~6.5MB of TTF) even though
// only four are used.
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';

/**
 * Returns true once Inter is available. Callers may hold their splash screen
 * until then; rendering earlier is safe but shows a frame of the system font.
 */
export function useUixvisorFonts(): boolean {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // A font that fails to load must not block the app - the fallback family in
  // tailwind.config.js covers it.
  return loaded || error !== null;
}
