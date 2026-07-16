# UIXVISOR

## Product Requirements Documentation Paketi

*Expo-first • NativeWind-first • Mobile-behavior-first*

| **Doküman sürümü**   | 1.0                                  |
|----------------------|--------------------------------------|
| **Doğrulama tarihi** | 17 Temmuz 2026                       |
| **Ürün aşaması**     | MVP / Foundation                     |
| **Teknik hedef**     | Expo SDK 57                          |
| **Durum**            | Karar ve uygulama başlangıç dokümanı |

Bu paket; Master Product PRD, Teknik Mimari PRD, Design System PRD, Bileşen ve Akış PRD, CLI & Registry PRD, Kalite/Uyumluluk PRD ve MVP Yol Haritasını tek bir yönetilebilir belgede birleştirir.

## İçindekiler

- [0. Doküman Yönetimi](#0-doküman-yönetimi)
- [1. Master Product PRD](#1-master-product-prd)
- [2. Teknik Mimari PRD](#2-teknik-mimari-prd)
- [3. Design System PRD](#3-design-system-prd)
- [4. Bileşen, Block, Screen ve Flow PRD](#4-bileşen-block-screen-ve-flow-prd)
- [5. CLI ve Registry PRD](#5-cli-ve-registry-prd)
- [6. Kalite, Uyumluluk ve Release PRD](#6-kalite-uyumluluk-ve-release-prd)
- [7. MVP Yol Haritası](#7-mvp-yol-haritası)
- [8. Riskler ve Karar Kaydı](#8-riskler-ve-karar-kaydı)
- [9. Önceliklendirilmiş Ürün Backlog’u](#9-önceliklendirilmiş-ürün-backlogu)
- [10. Doğrulanmış Kaynaklar ve Notlar](#10-doğrulanmış-kaynaklar-ve-notlar)


## 0. Doküman Yönetimi

| **Alan**             | **Karar**                                                                            |
|----------------------|--------------------------------------------------------------------------------------|
| Ürün adı             | UIXVISOR                                                                             |
| Belge sahibi         | Ürün ve teknik ekip                                                                  |
| Ana hedef            | Expo geliştiricilerine sahip olunabilir, production odaklı mobil UI sistemi sağlamak |
| Ana dağıtım modeli   | Açık registry + CLI ile kaynak kodu projeye kopyalama                                |
| Birincil platformlar | iOS ve Android                                                                       |
| İkincil platform     | Web; yalnızca destek matrisi içinde ve bileşen bazında                               |
| Güncelleme ilkesi    | En yeni sürüm yerine test edilmiş en güncel stable kombinasyon                       |

> **Karar standardı:** Bu dokümanda “stable” ifadesi yalnızca resmi sürümü yayımlanmış ve UIXVISOR CI/örnek uygulamalarında doğrulanmış kombinasyonlar için kullanılır. Önizleme, alpha, beta ve deneysel API’ler varsayılan üretim yoluna alınmaz.

## 1. Master Product PRD

Ürün vizyonu, kapsam, kullanıcılar, değer önerisi ve başarı ölçütleri

### 1.1 Problem

Web geliştirmede Tailwind, Radix ve shadcn/ui etrafında oluşan ekosistem; erişilebilir primitive’leri, kaynak kod sahipliğini, tema token’larını ve hazır blokları ortak bir çalışma biçiminde birleştirir. Expo/React Native tarafında ise temel bileşenler bulunsa da klavye, safe area, gesture, bottom sheet, platform farkları ve gerçek uygulama akışları çoğunlukla ayrı ayrı çözülür. Sonuç; tekrar eden geliştirme maliyeti, davranış tutarsızlığı ve düşük tasarım kalitesidir.

### 1.2 Ürün vizyonu

> **Vizyon:** UIXVISOR, Expo ve NativeWind kullanan ekiplerin üretim kalitesinde mobil arayüzleri günler yerine saatler içinde kurmasını sağlayan, kaynak kodu kullanıcıya ait, erişilebilir ve gerçek cihaz davranışları doğrulanmış bir mobil UI ekosistemidir.

### 1.3 Konumlandırma

UIXVISOR bir npm UI framework’ü değil; registry üzerinden seçilen bileşenlerin, ekranların ve akışların kullanıcı projesine kopyalandığı bir geliştirme sistemidir. Temel vaat “import et ve kilitlen” değil, “ekle, sahip ol ve değiştir” yaklaşımıdır.

### 1.4 Hedef kullanıcılar

| **Persona**                 | **İhtiyaç**                                  | **UIXVISOR değeri**                               |
|-----------------------------|----------------------------------------------|---------------------------------------------------|
| Bağımsız Expo geliştiricisi | Hızlı MVP, iyi görünüm, az kurulum           | Hazır akışlar ve güvenli varsayılanlar            |
| Startup ekibi               | Tutarlı design system, kısa teslim süresi    | Tema token’ları, blocks ve flows                  |
| Ajans/freelancer            | Projeler arası tekrar kullanılabilir altyapı | Registry preset’leri ve source ownership          |
| Tasarımcı-geliştirici       | Figma benzeri görsel kaliteyi koda taşımak   | Dokümante varyantlar ve ekran örnekleri           |
| Vibe-coding kullanıcısı     | AI çıktısını güvenilir yapıya oturtmak       | Net dosya yapısı, doctor komutu ve örnek tarifler |

### 1.5 Temel ürün ilkeleri

- Expo-first
- NativeWind-first
- Mobile-behavior-first
- Copy-and-own
- Accessible by default
- Stable over newest
- Composable over configuration
- No vendor lock-in
- Real-device tested
- Production-ready examples

### 1.6 Kapsam

| **Dahil**                                                           | **MVP dışında**                             |
|---------------------------------------------------------------------|---------------------------------------------|
| UI primitives, mobil davranış bileşenleri, blocks, screens ve flows | Kendi navigation motorunu yazmak            |
| CLI, registry, tema sistemi, dokümantasyon ve örnek uygulamalar     | Kendi form doğrulama motorunu yazmak        |
| Expo Router entegrasyonu                                            | Her backend için tam iş mantığı             |
| iOS/Android test matrisi                                            | React Native CLI desteğini ilk günde çözmek |
| Dark/light tema ve erişilebilirlik                                  | Yüzlerce düşük kaliteli template            |

### 1.7 Kullanıcı hikayeleri

- Bir Expo geliştiricisi olarak, tek komutla doğrulanmış bir Button eklemek ve kodunu doğrudan düzenlemek istiyorum.
- Bir ekip olarak, tema renklerini semantic token’lar üzerinden değiştirip bütün bileşenleri güncellemek istiyorum.
- Bir geliştirici olarak, Phone Auth Flow eklediğimde ekranlar, formlar, şema ve adapter iskeletinin birlikte gelmesini istiyorum.
- Bir geliştirici olarak, kullandığım Expo SDK ile bileşenin uyumlu olup olmadığını kurulumdan önce görmek istiyorum.
- Bir tasarımcı-geliştirici olarak, iOS/Android, dark mode, loading, error ve büyük yazı boyutu örneklerini dokümantasyonda görmek istiyorum.

### 1.8 Başarı metrikleri

| **Metrik**                         | **MVP hedefi** | **Ölçüm**                  |
|------------------------------------|----------------|----------------------------|
| İlk bileşene kadar süre            | ≤ 10 dakika    | Yeni proje usability testi |
| Auth flow kurulumu                 | ≤ 30 dakika    | Görev tamamlanma süresi    |
| CLI başarı oranı                   | ≥ %95          | Telemetry opt-in / CI      |
| Kritik a11y ihlali                 | 0              | Otomatik ve manuel audit   |
| iOS/Android görsel fark regresyonu | 0 kritik       | Snapshot + cihaz testi     |
| Doküman görev tamamlama            | ≥ %80          | Kullanıcı testi            |

### 1.9 Marka ve Açık Kaynak Politikası

UIXVISOR’ın dağıtım modeli tamamen ücretsiz ve açık kaynaktır; gelir modeli bir paywall veya “open core” kısıtlaması üzerinden değil, marka aidiyeti üzerinden kurulur.

| **Mekanizma**      | **Kapsam**                                                                | **Amaç**                                                |
|---------------------|----------------------------------------------------------------------------|-----------------------------------------------------------|
| Kod lisansı         | MIT/Apache-2.0, tüm primitive/component/block/screen/flow kaynak kodu     | Tam açıklık, “copy-and-own” ilkesiyle tutarlılık          |
| Marka koruması      | “UIXVISOR” adı ve logosu ayrı olarak korunur                              | Kod fork edilebilir; “UIXVISOR” adıyla yeniden pazarlanamaz |
| Kaynak notu         | `add` ile kopyalanan her dosyanın başına tek satır: `// UIXVISOR — https://uixvisor.dev/<item>` | Silinebilir, zorunlu değil; kaynağın görünür kalması       |
| Registry metadata   | Her registry item’ında `$schema` alanı uixvisor.dev’e işaret eder          | Bilinçli, pasif marka izi                                 |
| Ekosistem merkezi   | CLI, dokümantasyon ve registry her zaman uixvisor.dev üzerinden güncellenir | Kod özgür kalır; keşif ve güncelleme deneyimi markalı kalır |

> **Marka ilkesi:** Kod asla kilitlenmez; yalnızca isim ve dağıtım kanalı UIXVISOR’a aittir. Fonksiyonel kısıtlama (lisans anahtarı, zorunlu telemetry, kısıtlı ücretsiz sürüm) hiçbir zaman kullanılmaz.

## 2. Teknik Mimari PRD

Monorepo, paketler, bağımlılıklar ve çalışma sınırları

### 2.1 Stable teknik taban

| **Katman**      | **Karar**                         | **Stabilite notu**                                                          |
|-----------------|-----------------------------------|-----------------------------------------------------------------------------|
| Platform        | Expo SDK 57                       | Resmi latest referans; SDK 57 template açıkça seçilecek                     |
| Routing         | Expo Router ~57.x                 | SDK 57 ile paketlenen sürüm; experimental stack kullanılmaz                 |
| React Native    | Expo SDK 57’nin sabitlediği sürüm | Manuel RN sürüm yükseltmesi yapılmaz                                        |
| Styling         | NativeWind v4 stable baseline     | v5 ayrı preview/compatibility track; stable ilan edilmeden varsayılan olmaz |
| Animation       | Expo ile uyumlu Reanimated sürümü | expo install ve tam compatibility testi                                     |
| Gestures        | Expo ile uyumlu Gesture Handler   | Root provider ve platform testi zorunlu                                     |
| Forms           | React Hook Form + Zod             | UI’dan ayrıştırılmış adapter yapısı                                         |
| Icons           | Phosphor Icons                    | Kütüphane bağımlılığı değiştirilebilir adapter ile                          |
| Package manager | npm workspaces                    | Metro/Expo ile ekstra symlink yapılandırması gerekmez; en az sürtüşme        |
| Monorepo        | Turborepo                         | Build/test/doc görevleri için                                               |
| E2E             | Maestro                           | Kritik akışlar için                                                         |
| Docs            | Next.js                           | Web preview + cihaz QR örnekleri                                            |

> **NativeWind kararı:** Resmi ana sayfa v5’i duyururken, mevcut v4 dokümantasyonunun bazı sayfaları v5’i “pre-release” olarak etiketlemektedir. Bu nedenle UIXVISOR v1.0 üretim tabanı NativeWind v4’tür. v5 desteği ayrı bir uyumluluk kanalı ve feature flag ile geliştirilir; tam CI geçmeden stable olarak sunulmaz.

> **Package manager kararı:** pnpm, Turborepo ekosisteminde yaygın tercih olsa da Metro’nun symlink çözümlemesiyle tarihsel sürtüşmesi vardır ve Expo desteği `node-linker=hoisted` gibi ek yapılandırma gerektirir. UIXVISOR “stable over newest” ilkesiyle npm workspaces’i varsayılan kabul eder; pnpm ileride ayrı, resmi olmayan bir destek notu olarak eklenebilir.

### 2.2 Monorepo yapısı

```text
uixvisor/
├─ apps/
│ ├─ docs/
│ ├─ showcase-expo/
│ └─ test-harness/
├─ packages/
│ ├─ cli/
│ ├─ registry/
│ ├─ registry-schema/
│ ├─ tokens/
│ ├─ presets/
│ ├─ testing/
│ └─ eslint-config/
├─ registry/
│ ├─ primitives/
│ ├─ mobile/
│ ├─ blocks/
│ ├─ screens/
│ └─ flows/
└─ tooling/
```

### 2.3 Mimari sınırlar

- UI katmanı backend bilmez; callback ve adapter sözleşmeleri kullanır.
- Registry item’ları doğrudan başka item’lara bağımlı olabilir; döngüsel bağımlılık yasaktır.
- Platforma özel dosyalar yalnızca gerçek davranış farkı olduğunda kullanılır.
- Native module gerektiren item’lar Expo Go ile uyumluluk durumunu açıkça belirtir.
- Experimental Expo Router API’leri production item’larında kullanılmaz.
- Her item, kullanıcı projesine kopyalandıktan sonra UIXVISOR runtime paketine ihtiyaç duymamalıdır.

### 2.4 Dosya ve API kuralları

| **Kural**      | **Standart**                                 |
|----------------|----------------------------------------------|
| Dil            | TypeScript strict                            |
| Public props   | JSDoc ile belgeli                            |
| Styling        | className + semantic token                   |
| Composition    | Slot/children tercih edilir                  |
| State          | Controlled öncelikli; gerekirse uncontrolled |
| Refs           | Uygun native ref forwarding                  |
| Exports        | Named export                                 |
| Dosya isimleri | kebab-case                                   |
| Test kimliği   | testID yalnızca ihtiyaç halinde ve stabil    |

### 2.5 Git ve Katkı İş Akışı

UIXVISOR açık kaynak bir GitHub deposu olarak yürütülür (`github.com/mrcv0/uixvisor`); geçmişi okunabilir ve otomasyona (changelog, sürümleme) uygun tutmak için aşağıdaki kurallar geçerlidir.

| **Alan**           | **Standart**                                                                          |
|--------------------|-----------------------------------------------------------------------------------------|
| Ana branch         | `main` korumalı; doğrudan push yapılmaz                                                |
| Branch adlandırma  | `feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`, `test/*`                          |
| Commit formatı     | Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)         |
| Değişiklik süreci  | Her değişiklik PR üzerinden gelir; tek kişilik geliştirmede de self-review + CI yeşili şart |
| Sürümleme          | Changesets ile semver + otomatik changelog üretimi                                      |
| Lisans dosyası     | MIT LICENSE kökte bulunur; marka istisnası CONTRIBUTING.md’de belirtilir (bkz. 1.9)     |
| Katkı dokümanı     | CONTRIBUTING.md — kurulum, branch/commit kuralları, PR şablonu, davranış kuralları      |
| CI zorunlulukları  | Bölüm 6.3’teki release kapılarıyla aynı: typecheck, lint, unit test, schema validation  |
| Compatibility branch | Expo SDK veya NativeWind major geçişleri ayrı `compat/*` branch’inde izole edilir (bkz. bölüm 8) |

> **Git ilkesi:** Tek büyük “ilk commit” yerine, her mantıksal adım (schema, tokens, tek bir primitive, CLI komutu vb.) kendi PR’ı ve kendi commit’i olarak ilerler. Böylece açık kaynak katkıda bulunanlar için geçmiş okunabilir kalır ve changelog otomasyonu güvenilir çalışır.

## 3. Design System PRD

Token modeli, tema, varyantlar ve marka sistemi

### 3.1 Tasarım hedefleri

- Kütüphane görünümünü dayatmayan nötr ve kaliteli varsayılanlar
- Dark/light mode’un token seviyesinde çözülmesi
- Marka temasının birkaç semantic değerle değişebilmesi
- Native ölçü, dokunma alanı ve platform beklentilerinin korunması
- Büyük font, RTL ve accessibility ayarlarında bozulmayan layout

### 3.2 Token katmanları

| **Katman** | **Örnek**                               | **Amaç**                        |
|------------|-----------------------------------------|---------------------------------|
| Foundation | blue-500, radius-12, space-4            | Ham değerler                    |
| Semantic   | background, foreground, primary, border | Anlam odaklı kullanım           |
| Component  | button-primary-bg, input-border-error   | Gerekli olduğunda bileşen özeli |
| Motion     | duration-fast, easing-standard          | Tutarlı animasyon               |
| Elevation  | surface, surface-elevated, overlay      | Mobil yüzey hiyerarşisi         |

### 3.3 Zorunlu semantic renkler

- background / foreground
- surface / surface-elevated
- card / card-foreground
- primary / primary-foreground
- secondary / secondary-foreground
- muted / muted-foreground
- border / input / ring
- success / warning / destructive
- overlay / tab-bar / sheet / skeleton

### 3.4 Tipografi ve ölçü

| **Alan**              | **Karar**                                   |
|-----------------------|---------------------------------------------|
| Minimum dokunma alanı | 44×44 pt eşdeğeri                           |
| Body varsayılan       | 16 px eşdeğeri                              |
| Dinamik tip           | Font scaling kapatılmaz; layout test edilir |
| Radius ölçeği         | sm, md, lg, xl, full                        |
| Spacing               | 4 tabanlı ölçek                             |
| Motion                | Reduce Motion ayarına saygı                 |
| Kontrast              | WCAG AA hedefi                              |

### 3.5 Preset yaklaşımı

Default, Minimal, Rounded, Fintech, Commerce ve Editorial preset’leri ayrı bileşen kopyaları değildir. Aynı registry item’ları farklı token paketleriyle çalışır. MVP’de Default ve Fintech preset’leri yayınlanır; diğerleri sonraki sürümlere bırakılır.

## 4. Bileşen, Block, Screen ve Flow PRD

Ürün kataloğu, kabul kriterleri ve API prensipleri

### 4.1 Katalog taksonomisi

| **Tür**          | **Tanım**                                 | **Örnek**                    |
|------------------|-------------------------------------------|------------------------------|
| Primitive        | Tek sorumluluklu temel yapı               | Button, Input, Text          |
| Mobile Component | Mobil davranışı çözen birleşik bileşen    | OTP Input, Bottom Sheet      |
| Block            | Ekran içi büyük kompozisyon               | Profile Header, Balance Card |
| Screen           | Tam sayfa arayüz                          | Login, Settings              |
| Flow             | Birden çok ekran + state/adapter iskeleti | Phone Auth, Onboarding       |

### 4.2 MVP primitive’leri

- Text
- Heading
- Button
- Icon Button
- Input
- Textarea
- Checkbox
- Radio Group
- Switch
- Card
- Avatar
- Badge
- Separator
- Spinner
- Skeleton
- Progress

### 4.3 MVP mobile component’leri

- Keyboard-Aware Form
- OTP Input
- Search Bar
- Toast
- Empty State
- Error State
- Swipeable Row
- Bottom Sheet adapter

### 4.4 MVP ekranları ve akışları

| **Kategori** | **İçerik**                                                                           |
|--------------|--------------------------------------------------------------------------------------|
| Ekranlar     | Login, Register, Phone Login, OTP Verification, Onboarding, Profile Setup            |
| Akışlar      | Email Authentication, Phone Authentication, Onboarding                               |
| Blocks       | Auth Header, Social Login Group, Form Footer, Onboarding Step, Profile Avatar Picker |

### 4.5 Bileşen kabul kriterleri

- iOS ve Android üzerinde çalışır.
- Light ve dark modda görsel regresyon testi geçer.
- Loading, disabled, error ve empty durumları belgelenir.
- VoiceOver/TalkBack için rol, etiket ve durumlar sağlanır.
- Büyük yazı boyutunda kritik metin kesilmez.
- className ile temel yüzeyler özelleştirilebilir.
- Klavye açıldığında odaklı alan görünür kalır.
- Reduce Motion açıkken gereksiz animasyon azaltılır.
- Dokümantasyonda copy-paste örneği ve bağımlılık listesi bulunur.

### 4.6 API prensibi

> **API kuralı:** Basit kullanım için prop, gelişmiş kullanım için composition, görsel değişiklik için className. Her davranışı prop’a dönüştürerek aşırı konfigüre edilen bileşenlerden kaçınılır.

## 5. CLI ve Registry PRD

Kurulum, şema, bağımlılık çözümü ve güvenli dosya değişiklikleri

### 5.1 CLI komutları

| **Komut**              | **Amaç**                                 | **MVP** |
|------------------------|------------------------------------------|---------|
| uixvisor init          | Proje algılama, config ve token kurulumu | Evet    |
| uixvisor add \<item\>  | Registry item ekleme                     | Evet    |
| uixvisor list          | Katalog listeleme                        | Evet    |
| uixvisor diff \<item\> | Yerel dosya ile registry farkı           | Evet    |
| uixvisor doctor        | Uyumluluk ve kurulum kontrolü            | Evet    |
| uixvisor remove        | Güvenli kaldırma                         | Sonraki |
| uixvisor upgrade       | Registry item yükseltme yardımı          | Sonraki |

### 5.2 Init akışı

1.  Expo projesini ve SDK sürümünü algıla.
2.  NativeWind kurulumunu ve sürümünü algıla.
3.  Expo Router ve src/app dizinini algıla.
4.  Path alias ve package manager seçimini oku.
5.  uixvisor.config.json oluştur.
6.  Tema token’larını ve utility helper’ı ekle.
7.  Gerekli provider değişiklikleri için plan/diff göster.
8.  Değişiklikleri kullanıcı onayıyla uygula.

### 5.3 Registry item şeması

```json
{
"name": "otp-input",
"type": "registry:component",
"version": "1.0.0",
"platforms": ["ios", "android"],
"compatibility": {
"expo": ">=57 <58",
"nativewind": ">=4 <5"
},
"dependencies": ["react-native-reanimated"],
"registryDependencies": ["text", "input"],
"files": [{
"source": "components/otp-input.tsx",
"target": "src/components/ui/otp-input.tsx"
}]
}
```

### 5.4 Güvenlik ve dosya bütünlüğü

- Var olan dosya sessizce ezilmez.
- Her değişiklik öncesinde diff/özet gösterilir.
- CLI işlemi yarıda kalırsa rollback yapılır.
- İndirilen registry manifest’i checksum ile doğrulanır.
- Postinstall script kullanılmaz.
- Telemetry varsayılan kapalı veya açık opt-in olarak tasarlanır.
- Registry URL’si config üzerinden değiştirilebilir.
- Kopyalanan dosyaların başına silinebilir, tek satırlık UIXVISOR kaynak notu eklenir (bkz. 1.9).

## 6. Kalite, Uyumluluk ve Release PRD

Stable sürüm politikası, test kapıları ve destek matrisi

### 6.1 Destek matrisi v1.0

| **Teknoloji**   | **UIXVISOR v1.0 desteği**            | **Not**                               |
|-----------------|--------------------------------------|---------------------------------------|
| Expo SDK        | 57                                   | Ana hedef; development build önerilir |
| Expo Router     | SDK 57 bundled ~57.x                 | ExperimentalStack yasak               |
| NativeWind      | v4 stable                            | v5 preview kanalı                     |
| React Native    | Expo tarafından kilitlenen           | Bağımsız yükseltilmez                 |
| Reanimated      | expo install ile SDK uyumlu          | Exact sürüm CI’de kaydedilir          |
| Gesture Handler | expo install ile SDK uyumlu          | Root setup doğrulanır                 |
| iOS             | Expo SDK 57’nin desteklediği minimum | Gerçek cihaz + simulator              |
| Android         | Expo SDK 57’nin desteklediği minimum | Gerçek cihaz + emulator               |
| Web             | Best effort / item bazında           | MVP ana hedef değil                   |

> **Expo Go notu:** Expo’nun SDK 57 geçiş dokümanı, geçiş döneminde create-expo-app varsayılanının farklı SDK üretebildiğini ve fiziksel cihazda Expo Go için ayrı kısıt bulunduğunu belirtir. UIXVISOR dokümantasyonu SDK 57 projesini açık template ile oluşturur ve native bağımlılık içeren örneklerde development build kullanır.

### 6.2 Test piramidi

| **Seviye** | **Araç**                     | **Kapsam**                             |
|------------|------------------------------|----------------------------------------|
| Static     | TypeScript, ESLint           | Props, exports, importlar              |
| Unit       | Vitest/Jest                  | Utility ve state davranışı             |
| Component  | React Native Testing Library | Erişilebilirlik ve etkileşim           |
| Visual     | Screenshot regression        | Tema, platform, varyant                |
| E2E        | Maestro                      | Auth ve onboarding akışları            |
| Device     | iOS/Android gerçek cihaz     | Klavye, gesture, safe area, performans |

### 6.3 Release kapıları

9.  Bütün CI görevleri yeşil.
10. Yeni item için en az bir dokümantasyon sayfası ve örnek bulunuyor.
11. iOS ve Android smoke testi tamamlandı.
12. Kritik accessibility ihlali yok.
13. Uyumluluk matrisi güncel.
14. Breaking change varsa migration notu var.
15. Registry schema doğrulaması başarılı.
16. Changelog ve semver sürümü hazır.

### 6.4 Sürüm politikası

| **Sürüm**             | **Anlam**                                                |
|-----------------------|----------------------------------------------------------|
| Patch                 | Hata düzeltmesi, görsel düzeltme, doküman                |
| Minor                 | Yeni geriye uyumlu item veya varyant                     |
| Major                 | Dosya/API kırılması, Expo/NativeWind ana taban değişimi  |
| Compatibility channel | Yeni Expo SDK veya NativeWind major için erken doğrulama |

## 7. MVP Yol Haritası

12 haftalık uygulanabilir teslim planı

| **Faz**          | **Hafta** | **Çıktı**                                     |
|------------------|-----------|-----------------------------------------------|
| Foundation       | 1-2       | Monorepo, schema, tokens, showcase app, CI    |
| Primitives       | 3-4       | 16 primitive ve temel docs                    |
| Mobile behavior  | 5-6       | Keyboard form, OTP, toast, states, swipe      |
| Flows            | 7-8       | Email auth, phone auth, onboarding            |
| CLI              | 9-10      | init/add/list/diff/doctor ve rollback         |
| Hardening        | 11        | a11y, visual regression, device matrix        |
| Launch candidate | 12        | Dokümantasyon, changelog, örnek proje, v0.1.0 |

### 7.1 MVP definition of done

- Temiz bir Expo SDK 57 projesinde init ve add komutları çalışır.
- En az 16 primitive, 8 mobil bileşen, 6 ekran ve 3 flow yayınlanır.
- Default ve Fintech tema preset’i bulunur.
- Auth flow örnekleri mock adapter ile uçtan uca çalışır.
- iOS ve Android için kritik akış E2E testi geçer.
- Dokümantasyonda kurulum, tema, bileşen ve uyumluluk bölümleri tamamdır.
- Kaynak kod kullanıcı projesine kopyalandıktan sonra zorunlu UIXVISOR runtime bağımlılığı yoktur.

### 7.2 MVP sonrası öncelikler

- Subscription/paywall flow
- Settings ve notification screens
- Commerce blocks
- Finance dashboard blocks
- Registry marketplace/publisher tooling
- NativeWind v5 stable migration
- React Native CLI compatibility araştırması

## 8. Riskler ve Karar Kaydı

Teknik, ürün ve bakım riskleri

| **Risk**                    | **Etkisi**                        | **Azaltma**                                             |
|-----------------------------|-----------------------------------|---------------------------------------------------------|
| Expo SDK hızlı değişimi     | Uyumluluk kırılması               | SDK başına branch, CI matrisi, gecikmeli stable etiketi |
| NativeWind major geçişi     | Tema ve bundler kırılması         | v4 baseline, v5 compatibility channel                   |
| Copy-paste forklaşması      | Kullanıcı dosyaları güncellenemez | diff ve upgrade yardımcıları                            |
| Çok geniş katalog           | Kalite düşüşü                     | MVP sınırı ve item kalite kapısı                        |
| Platform farkları           | Tutarsız UX                       | Platform testleri ve açık dokümantasyon                 |
| Native dependency karmaşası | Kurulum hataları                  | doctor, expo install, development build rehberi         |
| Rakip benzerliği            | Zayıf farklılaşma                 | Flows, mobile behavior ve stable matrix odağı           |

### 8.1 Kilit ürün kararları

- UIXVISOR v1.0 yalnızca Expo-first olacaktır.
- NativeWind v4 üretim baseline’ı; v5 ayrı kanal olacaktır.
- Expo SDK 57 ana hedef olacaktır.
- CLI hiçbir dosyayı sessizce ezmeyecektir.
- Kullanıcı, eklenen kaynak kodun tamamına sahip olacaktır.
- İlk farklılaştırıcı alan primitive sayısı değil, çalışan mobil flows olacaktır.
- UIXVISOR tamamen ücretsiz ve açık kaynak kalır; marka aidiyeti kod kilidiyle değil, trademark ve kaynak notlarıyla sağlanır (bkz. 1.9).

## 9. Önceliklendirilmiş Ürün Backlog’u

MVP epikleri ve kabul edilebilir ilk sürüm kapsamı

| **Epic**                  | **Öncelik** | **Başlıca işler**                                             |
|---------------------------|-------------|---------------------------------------------------------------|
| E1 Registry Foundation    | P0          | Schema, validation, item dependency graph, CDN/static publish |
| E2 CLI Core               | P0          | init, add, list, diff, doctor, rollback                       |
| E3 Theme System           | P0          | Tokens, dark mode, Default/Fintech preset                     |
| E4 Primitives             | P0          | 16 temel bileşen                                              |
| E5 Mobile Behaviors       | P0          | Keyboard, OTP, Toast, States, Swipe                           |
| E6 Auth & Onboarding      | P0          | 3 flow ve 6 ekran                                             |
| E7 Documentation          | P0          | Install, theming, components, compatibility                   |
| E8 Quality Infrastructure | P0          | CI, visual, E2E, a11y                                         |
| E9 Publisher Tools        | P1          | Özel registry oluşturma                                       |
| E10 Marketplace           | P2          | Topluluk item keşfi                                           |

## 10. Doğrulanmış Kaynaklar ve Notlar

Resmi dokümantasyon; kontrol tarihi 17 Temmuz 2026

**Expo SDK Reference - latest:** [<u>https://docs.expo.dev/versions/latest/</u>](https://docs.expo.dev/versions/latest/)
SDK 57 latest referansı.

**Expo SDK Upgrade Walkthrough:** [<u>https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/</u>](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
SDK 57 paket aralığı ve upgrade yaklaşımı.

**create-expo-app:** [<u>https://docs.expo.dev/more/create-expo/</u>](https://docs.expo.dev/more/create-expo/)
SDK 57 template ve geçiş dönemi notu.

**Expo Router SDK Reference:** [<u>https://docs.expo.dev/versions/latest/sdk/router/</u>](https://docs.expo.dev/versions/latest/sdk/router/)
SDK 57 ile paketlenen Router sürümü.

**Expo Navigation Guidance:** [<u>https://docs.expo.dev/develop/app-navigation/</u>](https://docs.expo.dev/develop/app-navigation/)
Expo projeleri için Expo Router önerisi.

**Expo New Architecture:** [<u>https://docs.expo.dev/guides/new-architecture/</u>](https://docs.expo.dev/guides/new-architecture/)
Yeni mimarinin güncel durumu.

**NativeWind v4 docs:** [<u>https://www.nativewind.dev/docs</u>](https://www.nativewind.dev/docs)
Stable üretim baseline dokümantasyonu.

**NativeWind v5 installation:** [<u>https://www.nativewind.dev/v5/getting-started/installation</u>](https://www.nativewind.dev/v5/getting-started/installation)
v5 kurulum hattı; ayrı compatibility track.

**Reanimated Compatibility:** [<u>https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/</u>](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
React Native/Reanimated uyumluluk ilkeleri.

**Expo Reanimated Reference:** [<u>https://docs.expo.dev/versions/latest/sdk/reanimated/</u>](https://docs.expo.dev/versions/latest/sdk/reanimated/)
Expo ile paket uyumu ve kurulum.

**Gesture Handler Installation:** [<u>https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/</u>](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/)
Gesture/Reanimated ilişkisi.

> **Belge kullanımı:** Bu belge ürün kararlarını başlatmak için hazırlanmıştır. Uygulama sırasında her epic ayrı teknik tasarım dokümanı, issue ve acceptance test setine dönüştürülmelidir. Uyumluluk matrisi her release candidate öncesinde resmi kaynaklarla yeniden doğrulanmalıdır.