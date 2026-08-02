'use client';

import type { RegistryItem } from '@uixvisor/registry-schema';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const TYPE_LABELS: Record<string, string> = {
  'registry:primitive': 'Primitive',
  'registry:component': 'Component',
  'registry:block': 'Block',
  'registry:screen': 'Screen',
  'registry:flow': 'Flow',
};

const FILTERS = ['Tümü', 'Primitive', 'Component', 'Block', 'Screen', 'Flow'] as const;

export function CatalogExplorer({ items }: { items: RegistryItem[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Tümü');

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr');

    return items.filter((item) => {
      const typeLabel = TYPE_LABELS[item.type] ?? item.type;
      const matchesFilter = filter === 'Tümü' || typeLabel === filter;
      const haystack = [item.name, item.title, item.description, typeLabel]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr');

      return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [filter, items, query]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
        <label className="text-sm font-medium" htmlFor="catalog-search">
          Katalogda ara
        </label>
        <input
          className="mt-2 h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-950"
          id="catalog-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="button, auth, onboarding…"
          type="search"
          value={query}
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Item türü filtresi">
          {FILTERS.map((label) => (
            <button
              aria-pressed={filter === label}
              className={
                filter === label
                  ? 'whitespace-nowrap rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-950'
                  : 'whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white'
              }
              key={label}
              onClick={() => setFilter(label)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
          {visibleItems.length} item gösteriliyor
        </p>
        {query || filter !== 'Tümü' ? (
          <button
            className="text-sm font-medium underline underline-offset-4"
            onClick={() => {
              setQuery('');
              setFilter('Tümü');
            }}
            type="button"
          >
            Filtreleri temizle
          </button>
        ) : null}
      </div>

      {visibleItems.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visibleItems.map((item) => (
            <li key={item.name}>
              <Link
                className="group flex h-full flex-col rounded-xl border border-zinc-200 p-4 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-950/5 dark:border-zinc-800 dark:hover:border-zinc-600"
                href={`/catalog/${item.name}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium group-hover:underline group-hover:underline-offset-4">
                      {item.title ?? item.name}
                    </p>
                    <code className="mt-1 block text-xs text-zinc-500">{item.name}</code>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                </div>
                {item.description ? (
                  <p className="mt-4 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                ) : null}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-900">
                  <span>{item.platforms.join(' · ')}</span>
                  <code>v{item.version}</code>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
          <p className="font-medium">Eşleşen item bulunamadı.</p>
          <p className="mt-2 text-sm text-zinc-500">Arama kelimesini veya tür filtresini değiştirin.</p>
        </div>
      )}
    </div>
  );
}
