import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CodeBlock, DocsShell, GuideSection } from '@/components/docs-shell';
import { getRegistryItem, getRegistryItems } from '@/lib/registry';

const TYPE_LABELS: Record<string, string> = {
  'registry:primitive': 'Primitive',
  'registry:component': 'Component',
  'registry:block': 'Block',
  'registry:screen': 'Screen',
  'registry:flow': 'Flow',
};

type ItemPageProps = {
  params: Promise<{ name: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const items = await getRegistryItems();
  return items.map((item) => ({ name: item.name }));
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { name } = await params;
  const item = await getRegistryItem(name);

  if (!item) return {};

  return {
    title: `${item.title ?? item.name} · UIXVISOR`,
    description: item.description,
  };
}

export default async function RegistryItemPage({ params }: ItemPageProps) {
  const { name } = await params;
  const item = await getRegistryItem(name);

  if (!item) notFound();

  const typeLabel = TYPE_LABELS[item.type] ?? item.type;
  const dependencyNames = item.registryDependencies;
  const compatibility = Object.entries(item.compatibility);

  return (
    <DocsShell
      title={item.title ?? item.name}
      description={item.description ?? `${item.name} registry item’ı.`}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <Link className="font-medium underline underline-offset-4" href="/catalog">
          Katalog
        </Link>
        <span aria-hidden>/</span>
        <code>{item.name}</code>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {typeLabel}
        </span>
        <span>v{item.version}</span>
      </div>

      <GuideSection title="Projeye ekleyin">
        <CodeBlock>{`npx uixvisor@latest add ${item.name}`}</CodeBlock>
        <p>
          CLI kaynakları projenize kopyalar, registry importlarını göreli yollara dönüştürür ve
          mevcut dosyaları siz <code>--force</code> vermeden ezmez.
        </p>
      </GuideSection>

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Platform" value={item.platforms.join(' · ')} />
        <InfoCard label="Tür" value={typeLabel} />
        <InfoCard label="Dosya" value={`${item.files.length} kaynak`} />
      </div>

      <GuideSection title="Bağımlılıklar">
        <div className="grid gap-4 sm:grid-cols-2">
          <DependencyList
            empty="Başka registry item’ına ihtiyaç duymaz."
            items={dependencyNames}
            title="Registry"
          />
          <DependencyList
            empty="Ek npm paketi gerektirmez."
            items={item.dependencies}
            title="npm"
          />
        </div>
      </GuideSection>

      <GuideSection title="Uyumluluk">
        <dl className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {compatibility.map(([platform, range]) => (
            <div className="flex items-center justify-between gap-4 px-4 py-3" key={platform}>
              <dt className="text-sm font-medium capitalize">{platform}</dt>
              <dd>
                <code className="text-sm text-zinc-600 dark:text-zinc-300">{range}</code>
              </dd>
            </div>
          ))}
        </dl>
      </GuideSection>

      <GuideSection title="Yazılan dosyalar">
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {item.files.map((file) => (
            <li className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center" key={file.target}>
              <code className="text-sm">{file.target}</code>
              <span className="text-xs text-zinc-500">{file.source}</span>
            </li>
          ))}
        </ul>
      </GuideSection>
    </DocsShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}

function DependencyList({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="font-medium">{title}</h3>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item}>
              <code className="text-sm">{item}</code>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-zinc-500">{empty}</p>
      )}
    </div>
  );
}
