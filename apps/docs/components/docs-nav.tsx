'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DocsNav({
  links,
}: {
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dokümantasyon"
      className="mt-5 flex gap-1 overflow-x-auto pb-1 text-sm md:flex-col md:overflow-visible"
    >
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={
              active
                ? 'whitespace-nowrap rounded-lg bg-zinc-100 px-3 py-2 font-medium text-zinc-950 dark:bg-zinc-900 dark:text-white'
                : 'whitespace-nowrap rounded-lg px-3 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
            }
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
