import type { Metadata } from 'next';

import { CatalogExplorer } from '@/components/catalog-explorer';
import { DocsShell, GuideSection } from '@/components/docs-shell';
import { getRegistryItems } from '@/lib/registry';

export const metadata: Metadata = {
  title: 'Katalog · UIXVISOR',
  description: 'UIXVISOR primitive, component, block, screen ve flow kataloğu.',
};

export default async function CatalogPage() {
  const items = await getRegistryItems();

  return (
    <DocsShell
      title="Katalog"
      description={`${items.length} doğrulanmış registry item’ı; primitive’lerden çalışan auth ve onboarding flow’larına kadar copy-and-own kaynaklar.`}
    >
      <GuideSection title="Copy-and-own">
        <p>
          CLI item bağımlılıklarını çözer, <code>@registry/*</code> importlarını göreli yollara
          dönüştürür ve kaynakları doğrudan projenize yazar. Son uygulamada zorunlu UIXVISOR
          runtime paketi kalmaz.
        </p>
      </GuideSection>

      <CatalogExplorer items={items} />
    </DocsShell>
  );
}
