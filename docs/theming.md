# Tema ve preset'ler

UIXVISOR, görsel kararları semantic token'larla tanımlar. Bileşenlerin çoğu
NativeWind class'larını kullanır; SVG renkleri, native renk prop'ları, haptic
feedback ve platform shadow'ları için kopyalanan `theme` item'ı runtime helper'lar
sağlar.

## Theme item'ını eklemek

```bash
uixvisor add theme
npx expo install @expo-google-fonts/inter expo-font expo-haptics
```

`theme` şu dosyaları kopyalar:

- `components/ui/theme.tsx`
- `components/ui/cn.ts`
- `components/ui/press-feedback.tsx`
- `components/ui/use-uixvisor-fonts.ts`

## Semantic renk kullanımı

Native prop gerçek renk değeri istediğinde `useThemeColor` kullanın:

```tsx
import { ActivityIndicator } from 'react-native';

import { useThemeColor } from './components/ui/theme';

export function LoadingIndicator() {
  const primary = useThemeColor('primary');
  return <ActivityIndicator color={primary} />;
}
```

Light/dark modu NativeWind'in `useColorScheme` değeri belirler. Yükseltilmiş
yüzeylerde iOS shadow ve Android elevation değerlerini birlikte almak için
`useElevation('raised')` kullanılabilir.

## Font davranışı

Inter varsayılan seçimdir ama zorunlu değildir. `useUixvisorFonts` hook'u
çağrılmazsa bileşenler platform fontuyla render edilir. Fontları yüklemek isteyen
uygulamalar hook'u root seviyesinde çağırabilir:

```tsx
import { useUixvisorFonts } from './components/ui/use-uixvisor-fonts';

export function AppRoot() {
  const fontsReady = useUixvisorFonts();
  if (!fontsReady) return null;
  return <App />;
}
```

Font indirme ve projeye ekleme işlemi host uygulamanın kontrolündedir.

## Default ve Fintech preset

`@uixvisor/tokens`, semantic renk, spacing, radius, typography, motion ve elevation
tiplerini içerir. `@uixvisor/presets` iki başlangıç seçeneği sağlar:

- `default`: nötr, monochrome temel.
- `fintech`: aynı component API'larını koruyup primary ve success renklerini
  finans ürünlerine göre değiştirir.

Preset değiştirmek ayrı component kopyaları üretmez. Registry kaynakları aynı
kalır; yalnız token değerleri değişir.

## Token bütünlüğü

Repository'de token kaynaklarıyla registry tema değerlerinin ayrışması şu komutla
kontrol edilir:

```bash
npm run verify:tokens
```
