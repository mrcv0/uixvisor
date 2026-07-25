import { getRegistryItems } from '@/lib/registry';
import { CHANNEL, REGISTRY_BASE_URL, SCHEMA_BASE_URL } from '@/lib/registry-contract';

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
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">UIXVISOR Registry</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {items.length} item{items.length === 1 ? '' : 's'} available via{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            npx uixvisor add
          </code>
          .
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Channel: <code>{CHANNEL}</code> · Base URL:{' '}
          <a className="underline" href={REGISTRY_BASE_URL} rel="noreferrer noopener" target="_blank">
            {REGISTRY_BASE_URL}
          </a>{' '}
          · Schema:{' '}
          <a className="underline" href={SCHEMA_BASE_URL} rel="noreferrer noopener" target="_blank">
            {SCHEMA_BASE_URL}
          </a>
          .
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-4 py-4">
            <div className="flex flex-col gap-1">
              <span className="font-medium">
                {item.title ?? item.name}{' '}
                <code className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {item.name}
                </code>
              </span>
              {item.description ? (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </span>
              ) : null}
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
    </main>
  );
}
