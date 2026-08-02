import Link from 'next/link';

import { CodeBlock, GUIDE_LINKS } from '@/components/docs-shell';
import { getRegistryItems } from '@/lib/registry';

const TYPE_LABELS: Record<string, string> = {
  'registry:primitive': 'Primitive',
  'registry:component': 'Component',
  'registry:block': 'Block',
  'registry:screen': 'Screen',
  'registry:flow': 'Flow',
};

const GUIDE_DESCRIPTIONS: Record<string, string> = {
  '/getting-started': 'Expo projenize ilk item’ı ekleyin.',
  '/cli': 'init, add, diff ve doctor komutlarını öğrenin.',
  '/theming': 'Token, font ve preset sözleşmesini kurun.',
  '/catalog': '42 copy-and-own kaynağı keşfedin.',
  '/compatibility': 'Desteklenen sürümleri ve kalite kapılarını görün.',
};

export default async function Home() {
  const items = await getRegistryItems();

  return (
    <>
      <header className="border-b border-zinc-200 dark:border-zinc-900">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link className="inline-flex items-center gap-2 font-semibold tracking-tight" href="/">
            <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
            UIXVISOR
          </Link>
          <nav aria-label="Ana navigasyon" className="flex items-center gap-5 text-sm">
            <Link className="hidden text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white sm:block" href="/getting-started">
              Başlangıç
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white" href="/catalog">
              Katalog
            </Link>
            <a
              className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium transition hover:border-zinc-500 dark:border-zinc-700"
              href="https://github.com/mrcv0/uixvisor"
              rel="noreferrer noopener"
              target="_blank"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-14 md:py-20">
        <section className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
              Expo + NativeWind UI Registry
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Expo arayüzleri.
              <br />
              Kaynak kodu sizde.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-600 dark:text-zinc-400">
              NativeWind projeleri için primitive’den çalışan auth ve onboarding flow’larına kadar
              copy-and-own bir UI registry.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                href="/getting-started"
              >
                Başlangıç rehberi
              </Link>
              <Link
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium transition hover:border-zinc-500 dark:border-zinc-700"
                href="/catalog"
              >
                {items.length} item’ı keşfet
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-medium">İki komutla başlayın</p>
            <p className="mt-2">
              Projenizi hazırlayın, ardından ihtiyacınız olan component, screen veya flow’u
              kaynak koduyla birlikte ekleyin.
            </p>
            <div className="mt-3 space-y-1 text-xs">
              <code className="block">npx uixvisor@latest init</code>
              <code className="block">npx uixvisor@latest add button</code>
            </div>
          </div>

          <ul className="flex flex-wrap gap-2 text-xs text-zinc-500 lg:col-span-2">
            {['Expo SDK 57', 'NativeWind 4', 'iOS + Android', `${items.length} doğrulanmış item`].map(
              (fact) => (
                <li className="rounded-full border border-zinc-200 px-3 py-1.5 dark:border-zinc-800" key={fact}>
                  {fact}
                </li>
              ),
            )}
          </ul>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Neden UIXVISOR</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ValueCard
              description="Dosyalar doğrudan projenize yazılır; ürününüz zorunlu bir UIXVISOR runtime paketine bağlanmaz."
              title="Copy-and-own"
            />
            <ValueCard
              description="Yalnızca küçük parçalar değil; doğrulanmış screen ve auth/onboarding flow’ları birlikte gelir."
              title="Flow odaklı"
            />
            <ValueCard
              description="CLI bağımlılıkları çözer, importları dönüştürür ve mevcut dosyaları açık onay olmadan ezmez."
              title="Güvenli CLI"
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Rehberler</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GUIDE_LINKS.map((guide) => (
              <Link
                className="group rounded-xl border border-zinc-200 p-4 transition hover:-translate-y-0.5 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                href={guide.href}
                key={guide.href}
              >
                <p className="font-medium group-hover:underline group-hover:underline-offset-4">{guide.label}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{GUIDE_DESCRIPTIONS[guide.href]}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Hızlı başlangıç</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">İlk item’ınızı projenize ekleyin.</p>
            </div>
            <Link className="text-sm font-medium underline underline-offset-4" href="/getting-started">
              Ayrıntılı rehber
            </Link>
          </div>
          <div className="mt-5">
            <CodeBlock>{`npx uixvisor@latest init
npx uixvisor@latest doctor
npx uixvisor@latest add button`}</CodeBlock>
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Registry kataloğu</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {items.length} doğrulanmış item doğrudan projenize eklenebilir.
              </p>
            </div>
            <Link className="text-sm font-medium underline underline-offset-4" href="/catalog">
              Tam kataloğu aç
            </Link>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.slice(0, 12).map((item) => (
              <li key={item.name}>
                <Link
                  className="flex h-full items-start justify-between gap-4 rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                  href={`/catalog/${item.name}`}
                >
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
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

function ValueCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
