'use client';

import { useEffect, useState } from 'react';

export function CopyCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      className="absolute right-2 top-2 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
      }}
      type="button"
    >
      <span aria-live="polite">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
    </button>
  );
}
