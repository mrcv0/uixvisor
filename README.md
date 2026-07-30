# UIXVISOR

Expo ve NativeWind uygulamaları için açık kaynak; özelleştirilebilir primitive,
mobil bileşen, block, screen ve flow registry sistemi.

> “Import et ve kilitlen” değil, “ekle, sahip ol ve değiştir.”

## Durum

UIXVISOR şu anda **public release öncesi release-candidate hazırlığı** aşamasındadır.
Registry katalogu, CLI çekirdeği, schema doğrulaması, test harness ve docs uygulaması
çalışır durumdadır.

Henüz:

- UIXVISOR domaini satın alınmadı.
- Hosted registry ve public docs production ortamında canlı değil.
- `uixvisor` ve `@uixvisor/*` paketlerinin ilk npm sürümü yayımlanmadı.

Bu nedenle `uixvisor.dev` adresleri hedef production sözleşmesini ifade eder;
canlı servis olarak değerlendirilmemelidir. Bugün kullanım, repository kaynak kodu
ve local registry üzerinden yapılır.

## Neden UIXVISOR

- **Expo-first ve NativeWind-first:** mobil davranış, platform farkları ve native
  akışlar birinci sınıf gereksinimdir.
- **Copy-and-own:** kaynak dosyaları projene kopyalanır; zorunlu UIXVISOR runtime
  bağımlılığı bırakılmaz.
- **Flow odaklı:** yalnız primitive değil, email auth, phone auth ve onboarding
  gibi çalışan akışlar sunar.
- **Stable over newest:** Expo, NativeWind, Reanimated ve platform matrisi
  doğrulanmadan stable kabul edilmez.
- **Güvenli CLI:** checksum, origin pinning, traversal/symlink koruması, atomik
  yazma ve rollback davranışı bulunur.

## Mevcut katalog

| Alan | Adet |
|---|---:|
| Primitive | 18 |
| Mobile component | 8 |
| Block | 4 |
| Screen | 6 |
| Flow | 4 |
| Forms helper | 2 |

Toplam 42 registry item'ı schema ve dependency doğrulamasından geçer.

## Hızlı başlangıç

Node.js `>=22.13`, Expo SDK 57 ve NativeWind 4 gerekir.

```bash
git clone https://github.com/mrcv0/uixvisor.git
cd uixvisor
npm ci
npm run build --workspace uixvisor
```

Expo projenizde:

```bash
node /path/to/uixvisor/packages/cli/dist/index.js init \
  --registry /path/to/uixvisor/registry
node /path/to/uixvisor/packages/cli/dist/index.js doctor
node /path/to/uixvisor/packages/cli/dist/index.js add button
```

CLI gerekli npm bağımlılıklarını raporlar; kullanıcı onayı olmadan paket kurmaz.
İlk npm sürümü ve hosted registry yayınlandıktan sonra aynı akış
`npx uixvisor ...` komutlarına taşınacaktır.

## Dokümantasyon

- [Başlangıç](./docs/getting-started.md)
- [CLI komutları ve güvenlik](./docs/cli.md)
- [Tema ve preset'ler](./docs/theming.md)
- [Katalog ve item yapısı](./docs/components.md)
- [Uyumluluk ve kalite kapıları](./docs/compatibility.md)
- [Build, Maestro ve temiz proje doğrulaması](./docs/verification.md)
- [Hosted registry sözleşmesi](./packages/registry/HOSTED.md)
- [Ürün ve mimari PRD](./uixvisor.md)

## Geliştirme

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run smoke:cli
npm run verify:build
npm run verify:tokens
```

## Monorepo

```text
apps/
  docs/             Next.js docs ve registry kataloğu
  showcase-expo/    Görsel showcase
  test-harness/     Jest ve Maestro doğrulama uygulaması
packages/
  cli/              uixvisor komut satırı aracı
  registry/         local/hosted registry çözümleme
  registry-schema/  schema, URL sözleşmesi ve doğrulama
  tokens/           semantic design tokens
  presets/          Default ve Fintech preset'leri
  testing/          paylaşılan test yardımcıları
registry/            kullanıcı projelerine kopyalanan kaynaklar
```

## Katkı

Branch/commit kuralları, PR süreci ve Changesets politikası için
[CONTRIBUTING.md](./CONTRIBUTING.md) ve
[`uixvisor.md` §2.5](./uixvisor.md#25-git-ve-katkı-iş-akışı) belgelerine bakın.

## Lisans

Kod MIT lisanslıdır; ayrıntılar [LICENSE](./LICENSE) dosyasındadır. “UIXVISOR”
adı ve logosu kod lisansının kapsamı dışındadır.
