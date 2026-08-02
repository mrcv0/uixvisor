import type { Metadata } from 'next';

import { CodeBlock, DocsShell, GuideSection } from '@/components/docs-shell';

export const metadata: Metadata = {
  title: 'CLI · UIXVISOR',
  description: 'UIXVISOR CLI komutları, kaynak önceliği, offline cache ve güvenlik davranışı.',
};

export default function CliPage() {
  return (
    <DocsShell
      title="CLI"
      description="Registry kaynaklarını inceleyin, item’ları güvenli biçimde kopyalayın ve yerel özelleştirmeleri karşılaştırın."
    >
      <GuideSection title="Kaynak önceliği">
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            <code>--registry</code> komut seçeneği
          </li>
          <li>
            <code>UIXVISOR_REGISTRY</code> ortam değişkeni
          </li>
          <li>
            <code>uixvisor.config.json</code> içindeki registry alanı
          </li>
        </ol>
        <p>Hosted kaynak HTTPS olmak zorundadır; local geliştirme filesystem yolu kullanabilir.</p>
      </GuideSection>

      <GuideSection title="Temel akış">
        <CodeBlock>{`npx uixvisor@latest init
npx uixvisor@latest list
npx uixvisor@latest add email-auth
npx uixvisor@latest diff email-auth
npx uixvisor@latest doctor`}</CodeBlock>
      </GuideSection>

      <GuideSection title="Dosya güvenliği">
        <ul className="list-disc space-y-2 pl-6">
          <li>Var olan dosyalar sessizce ezilmez; yeniden yazmak için --force gerekir.</li>
          <li>Yazma yarıda kesilirse daha önce uygulanan dosyalar otomatik geri alınır.</li>
          <li>Traversal, mutlak yol, symlink ve Windows junction kaçışları reddedilir.</li>
          <li>Hosted payload checksum ve origin doğrulamasından geçer.</li>
        </ul>
      </GuideSection>

      <GuideSection title="Offline ve exit code davranışı">
        <CodeBlock>{`npx uixvisor@latest list --offline
npx uixvisor@latest add button --offline
npx uixvisor@latest diff button`}</CodeBlock>
        <p>
          Offline mod ağ isteği yapmaz ve yalnız doğrulanmış snapshot kullanır. Diff fark yoksa
          exit code 0, fark varsa 1 döndürür.
        </p>
      </GuideSection>
    </DocsShell>
  );
}
