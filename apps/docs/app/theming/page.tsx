import type { Metadata } from 'next';

import { CodeBlock, DocsShell, GuideSection } from '@/components/docs-shell';

export const metadata: Metadata = {
  title: 'Tema · UIXVISOR',
  description: 'Semantic token, NativeWind, runtime renk helper’ları ve font davranışı.',
};

export default function ThemingPage() {
  return (
    <DocsShell
      title="Tema ve preset’ler"
      description="NativeWind class’larını semantic token’larla, native renk ve elevation helper’larıyla tamamlayın."
    >
      <GuideSection title="Theme item’ı">
        <CodeBlock>{`uixvisor add theme
npx expo install @expo-google-fonts/inter expo-font expo-haptics`}</CodeBlock>
        <p>
          Theme item’ı renk çözümleme, elevation, press feedback, className birleştirme ve isteğe
          bağlı Inter font hook’unu projenize kopyalar.
        </p>
      </GuideSection>

      <GuideSection title="Native renk prop’ları">
        <CodeBlock>{`const primary = useThemeColor('primary');
return <ActivityIndicator color={primary} />;`}</CodeBlock>
        <p>
          SVG, ActivityIndicator, Switch ve platform shadow’ları gerçek renk/style değeri istediği
          için <code>useThemeColor</code> ve <code>useElevation</code> kullanılır.
        </p>
      </GuideSection>

      <GuideSection title="Fontlar">
        <p>
          Inter varsayılandır ama zorunlu değildir. <code>useUixvisorFonts</code> çağrılmazsa
          bileşenler platform fontuna düşer. Font dosyalarını indirme ve root seviyesinde yükleme
          kararı host uygulamaya aittir.
        </p>
      </GuideSection>

      <GuideSection title="Preset’ler">
        <ul className="list-disc space-y-2 pl-6">
          <li>Default: nötr ve monochrome temel.</li>
          <li>Fintech: primary ve success renkleri finans ürünlerine göre ayarlanmış temel.</li>
        </ul>
        <p>Preset değişimi component API’larını veya kopyalanan item’ları çoğaltmaz.</p>
      </GuideSection>
    </DocsShell>
  );
}
