import type { Metadata } from 'next';

import { CodeBlock, DocsShell, GuideSection, Notice } from '@/components/docs-shell';

export const metadata: Metadata = {
  title: 'Başlangıç · UIXVISOR',
  description: 'UIXVISOR kaynak kodunu local registry ile bir Expo SDK 57 projesinde kullanın.',
};

export default function GettingStartedPage() {
  return (
    <DocsShell
      title="Başlangıç"
      description="UIXVISOR kaynak kodunu local registry ile bir Expo SDK 57 ve NativeWind 4 projesine ekleyin."
    >
      <Notice>
        Domain, hosted registry ve npm paketleri henüz canlı değildir. Bu sayfa bugün çalışan
        kaynak-kod akışını gösterir; production adresi varsaymaz.
      </Notice>

      <GuideSection title="Gereksinimler">
        <ul className="list-disc space-y-2 pl-6">
          <li>Node.js 22.13 veya üzeri</li>
          <li>Expo SDK 57, React Native 0.86 ve React 19.2</li>
          <li>NativeWind 4 ve npm</li>
        </ul>
      </GuideSection>

      <GuideSection title="Repository’yi hazırlayın">
        <CodeBlock>{`git clone https://github.com/mrcv0/uixvisor.git
cd uixvisor
npm ci
npm run build --workspace uixvisor`}</CodeBlock>
      </GuideSection>

      <GuideSection title="Expo projenizi başlatın">
        <CodeBlock>{`cd /path/to/your-expo-app
node /path/to/uixvisor/packages/cli/dist/index.js init \\
  --registry /path/to/uixvisor/registry
node /path/to/uixvisor/packages/cli/dist/index.js doctor
node /path/to/uixvisor/packages/cli/dist/index.js add button`}</CodeBlock>
        <p>
          CLI gerekli registry item’larını önce çözer, dosyaları projeye kopyalar ve kurulması
          gereken npm bağımlılıklarını işlem sonunda bildirir.
        </p>
      </GuideSection>

      <GuideSection title="Public release sonrası">
        <CodeBlock>{`npx uixvisor init --registry <hosted-registry-url>
npx uixvisor doctor
npx uixvisor add button`}</CodeBlock>
        <p>Bu komutlar ilk npm sürümü ve hosted registry yayınlandıktan sonra varsayılan olur.</p>
      </GuideSection>
    </DocsShell>
  );
}
