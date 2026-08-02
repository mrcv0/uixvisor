import type { Metadata } from 'next';

import { CodeBlock, DocsShell, GuideSection } from '@/components/docs-shell';

export const metadata: Metadata = {
  title: 'Başlangıç · UIXVISOR',
  description: 'UIXVISOR’u bir Expo SDK 57 ve NativeWind 4 projesine ekleyin.',
};

export default function GettingStartedPage() {
  return (
    <DocsShell
      title="Başlangıç"
      description="UIXVISOR’u kurun, projenizi doğrulayın ve ilk component’inizi birkaç komutla ekleyin."
    >
      <GuideSection title="Gereksinimler">
        <ul className="list-disc space-y-2 pl-6">
          <li>Node.js 22.13 veya üzeri</li>
          <li>Expo SDK 57, React Native 0.86 ve React 19.2</li>
          <li>NativeWind 4 ve npm</li>
        </ul>
      </GuideSection>

      <GuideSection title="UIXVISOR’u başlatın">
        <CodeBlock>{`cd /path/to/your-expo-app
npx uixvisor@latest init`}</CodeBlock>
        <p>
          <code>init</code> proje yapınızı algılar, registry ayarını oluşturur ve gerekli dosyaları
          hazırlar.
        </p>
      </GuideSection>

      <GuideSection title="İlk component’i ekleyin">
        <CodeBlock>{`npx uixvisor@latest doctor
npx uixvisor@latest add button`}</CodeBlock>
        <p>
          CLI gerekli registry item’larını önce çözer, dosyaları projeye kopyalar ve kurulması
          gereken npm bağımlılıklarını işlem sonunda bildirir.
        </p>
      </GuideSection>

      <GuideSection title="Bir flow ile devam edin">
        <CodeBlock>{`npx uixvisor@latest list
npx uixvisor@latest add email-auth
npx uixvisor@latest diff email-auth`}</CodeBlock>
        <p>
          Flow item’ları ihtiyaç duydukları primitive, component, block ve screen kaynaklarını
          otomatik olarak birlikte getirir.
        </p>
      </GuideSection>
    </DocsShell>
  );
}
