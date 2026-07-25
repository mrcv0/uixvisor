# Katkı Rehberi

UIXVISOR'a katkı sağlamadan önce ürün ve mimari kararların tam kaynağı olan [`uixvisor.md`](./uixvisor.md) dosyasını okuyun. Bu dosya, süreç kararlarının (özellikle §2.5 Git ve Katkı İş Akışı, §1.9 Marka ve Açık Kaynak Politikası) kısa bir özetidir; çelişki olursa `uixvisor.md` esastır.

## Yerel geliştirme ortamı

- Node `>=22.13` (`engines` alanı ile zorunlu).
- npm `11.9.0` (Expo SDK 57 `corepack` ile gelir; `packageManager` alanında pinlenmiştir).
- Macros ve `node` çalıştırılabilirleri `PATH`’te olmalı.

Hızlı başlangıç:

```bash
corepack enable
corepack prepare npm@11.9.0 --activate
node --version
npm --version
npm install
```

`npm test`, `npm run lint`, `npm run typecheck` ve `npm run build` kökten tüm workspace'lerde turbo üzerinden çalışır.

## Branch ve commit kuralları

- `main` korumalıdır, doğrudan push yapılmaz.
- Branch adları: `feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`, `test/*`.
- Commit mesajları [Conventional Commits](https://www.conventionalcommits.org/) formatındadır: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
- Her değişiklik bir PR üzerinden gelir; tek kişilik geliştirmede bile self-review ve CI yeşili şarttır.
- Expo SDK veya NativeWind major geçişleri ayrı `compat/*` branch'inde izole edilir.

## Sürümleme

Sürümleme ve changelog [Changesets](https://github.com/changesets/changesets) ile otomatikleştirilir; kullanıcıya görünür her değişiklik bir changeset içerir.

## Kod ve lisans

- Kaynak kod MIT lisanslıdır (bkz. [LICENSE](./LICENSE)).
- "UIXVISOR" adı ve logosu bu lisansın kapsamında değildir: kod fork edilebilir ve değiştirilebilir, ancak "UIXVISOR" adıyla yeniden paketlenip dağıtılamaz.
- Registry üzerinden kopyalanan dosyalarda tek satırlık kaynak notu (`// UIXVISOR — https://uixvisor.dev/<item>`) bulunur; kaldırılması serbesttir.

## Bileşen/registry katkısı

Yeni bir primitive, block, screen veya flow eklerken §4.5 (Bileşen kabul kriterleri) ve §5.3 (Registry item şeması) kurallarına uyun: iOS/Android testi, light/dark mode, a11y, ve registry şema doğrulaması olmadan bir PR mergelenmez.
