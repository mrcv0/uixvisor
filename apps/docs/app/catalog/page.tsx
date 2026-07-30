import type { Metadata } from 'next';

import { DocsShell, GuideSection } from '@/components/docs-shell';
import { getRegistryItems } from '@/lib/registry';

export const metadata: Metadata = {
  title: 'Katalog · UIXVISOR',
  description: 'UIXVISOR primitive, component, block, screen ve flow kataloğu.',
};

const TYPE_LABELS: Record<string, string> = {
  'registry:primitive': 'Primitive',
  'registry:component': 'Component',
  'registry:block': 'Block',
  'registry:screen': 'Screen',
  'registry:flow': 'Flow',
};

export default async function CatalogPage() {
  const items = await getRegistryItems();
  const groups = Object.entries(
    Object.groupBy(items, (item) => TYPE_LABELS[item.type] ?? item.type),
  ).sort(([left], [right]) => left.localeCompare(right));

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

      {groups.map(([group, entries]) => (
        <GuideSection key={group} title={`${group} · ${entries?.length ?? 0}`}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {entries?.map((item) => (
              <li className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800" key={item.name}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{item.title ?? item.name}</span>
                  <code className="text-xs text-zinc-500">v{item.version}</code>
                </div>
                <code className="mt-1 block text-xs text-zinc-500">{item.name}</code>
                {item.description ? (
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </GuideSection>
      ))}
    </DocsShell>
  );
}
