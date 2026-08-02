import Link from 'next/link';
import type { ReactNode } from 'react';

import { CopyCode } from './copy-code';
import { DocsNav } from './docs-nav';

export const GUIDE_LINKS = [
  { href: '/getting-started', label: 'Başlangıç' },
  { href: '/cli', label: 'CLI' },
  { href: '/theming', label: 'Tema' },
  { href: '/catalog', label: 'Katalog' },
  { href: '/compatibility', label: 'Uyumluluk' },
] as const;

export function DocsShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 md:grid-cols-[13rem_minmax(0,1fr)] md:py-12">
      <aside className="md:sticky md:top-8 md:self-start">
        <Link className="inline-flex items-center gap-2 font-semibold tracking-tight" href="/">
          <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
          UIXVISOR
        </Link>
        <p className="mt-2 max-w-44 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
          Expo için sahip olduğunuz UI kaynakları.
        </p>
        <DocsNav links={GUIDE_LINKS} />
        <a
          className="mt-6 hidden text-xs font-medium text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-zinc-950 dark:hover:text-white md:inline-block"
          href="https://github.com/mrcv0/uixvisor"
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub repository
        </a>
      </aside>

      <article className="min-w-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
          UIXVISOR Docs
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <div className="mt-10 space-y-12">{children}</div>
      </article>
    </main>
  );
}

export function GuideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4 leading-7 text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <div className="group relative">
      <CopyCode value={children} />
      <pre className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 pr-24 text-sm leading-6 text-zinc-100 dark:border-zinc-800">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
      {children}
    </div>
  );
}
