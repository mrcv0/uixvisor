# Uyumluluk ve kalite

## Stable hedef matrisi

| Katman | Desteklenen sürüm | Durum |
|---|---|---|
| Node.js | `>=22.13` | Zorunlu |
| Expo | SDK `57` | Ana hedef |
| React Native | `0.86.x` | Expo 57 ile doğrulanır |
| React | `19.2.x` | Expo 57 ile doğrulanır |
| NativeWind | `>=4 <5` | Stable baseline |
| Reanimated | `4.5.x` | Test harness sürümü |
| Worklets | `0.10.x` | Test harness sürümü |
| iOS | Expo 57 tarafından desteklenen sürümler | Kritik akış hedefi |
| Android | Expo 57 tarafından desteklenen sürümler | Kritik akış hedefi |
| Web | Item bazında best effort | İkincil hedef |

NativeWind v5, stable kanala alınmamıştır. Ayrı bir compatibility çalışması ve
tam platform doğrulaması gerektirir.

## Otomatik kalite kapıları

```bash
npm run lint
npm run typecheck
npm test
npm run smoke:cli
npm run verify:build
npm run verify:tokens
```

CI ayrıca registry şema doğrulamasını çalıştırır. Hosted registry payload'ları
SHA-256 doğrulaması, origin pinning, boyut/zaman sınırları ve güvenli offline cache
ile korunur.

## Native E2E

Maestro workflow'u GitHub Actions üzerinden manuel çalıştırılır:

- Android Release build + kurulum + `.maestro` akışları.
- iOS Release build + kurulum + `.maestro` akışları.

Ayrıntılı komutlar [verification.md](./verification.md) içindedir.

## Temiz proje kabulü

30 Temmuz 2026'da resmi `default@sdk-57` template'i üzerinde:

- Expo `57.0.9`
- React Native `0.86.2`
- NativeWind `4.2.6`
- 42 registry item

ile `init`, `list`, `add`, `diff` ve `doctor` akışı doğrulandı. Kopyalanan
kaynakların TypeScript kontrolü geçti ve UIXVISOR runtime bağımlılığı bırakılmadı.

## Henüz tamamlanmayan production parçaları

- UIXVISOR domaini satın alınmadı.
- Docs ve hosted registry production endpoint'leri canlı değil.
- İlk npm sürümü yayımlanmadı.
- Maestro iOS/Android workflow'larının son native run'ları release kapısından
  önce ayrıca yeşil olmalı.
