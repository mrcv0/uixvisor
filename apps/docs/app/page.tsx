import Link from 'next/link';

import { GUIDE_LINKS } from '@/components/docs-shell';
import { getRegistryItems } from '@/lib/registry';
import {
  CHANNEL,
  PUBLIC_ENDPOINTS_AVAILABLE,
  REGISTRY_BASE_URL,
  SCHEMA_BASE_URL,
  SITE_URL,
} from '@/lib/registry-contract';

const TYPE_LABELS: Record<string, string> = {
  'registry:primitive': 'Primitive',
  'registry:component': 'Component',
  'registry:block': 'Block',
  'registry:screen': 'Screen',
  'registry:flow': 'Flow',
};

export default async function Home() {
  const items = await getRegistryItems();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-16">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
          Public release öncesi
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">UIXVISOR</h1>
        <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-400">
          Expo ve NativeWind projeleri için copy-and-own primitive, component, block, screen ve
          flow registry sistemi.
        </p>
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          Domain, hosted registry ve npm paketleri henüz canlı değildir. Bugün repository kaynak
          kodu ve local registry kullanılır.
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Rehberler</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {GUIDE_LINKS.map((guide) => (
            <Link
              className="rounded-xl border border-zinc-200 p-4 font-medium transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              href={guide.href}
              key={guide.href}
            >
              {guide.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Local başlangıç</h2>
        <pre className="mt-5 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-sm leading-6 text-zinc-100 dark:border-zinc-800">
          <code>{`node /path/to/uixvisor/packages/cli/dist/index.js init \\
  --registry /path/to/uixvisor/registry
node /path/to/uixvisor/packages/cli/dist/index.js doctor
node /path/to/uixvisor/packages/cli/dist/index.js add button`}</code>
        </pre>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Registry kataloğu</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {items.length} doğrulanmış item local registry üzerinden kullanılabilir.
            </p>
          </div>
          <Link className="text-sm font-medium underline underline-offset-4" href="/catalog">
            Tam kataloğu aç
          </Link>
        </div>

        {PUBLIC_ENDPOINTS_AVAILABLE ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Site:{' '}
            <a className="underline" href={SITE_URL} rel="noreferrer noopener" target="_blank">
              {SITE_URL}
            </a>{' '}
            · Channel: <code>{CHANNEL}</code> · Registry:{' '}
            <a
              className="underline"
              href={REGISTRY_BASE_URL}
              rel="noreferrer noopener"
              target="_blank"
            >
              {REGISTRY_BASE_URL}
            </a>{' '}
            · Schema:{' '}
            <a
              className="underline"
              href={SCHEMA_BASE_URL}
              rel="noreferrer noopener"
              target="_blank"
            >
              {SCHEMA_BASE_URL}
            </a>
          </p>
        ) : (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Hosted endpoints: planlandı, production yayını yapılmadı.
          </p>
        )}

        <ul className="mt-6 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.slice(0, 12).map((item) => (
            <li className="flex items-center justify-between gap-4 py-4" key={item.name}>
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  {item.title ?? item.name}{' '}
                  <code className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {item.name}
                  </code>
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  v{item.version} · {item.platforms.join(', ')}
                </span>
              </div>
              <span className="whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {TYPE_LABELS[item.type] ?? item.type}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
