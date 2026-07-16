# UIXVISOR

Expo ve NativeWind ile geliştirilen mobil uygulamalar için açık kaynak, tamamen özelleştirilebilir bileşen, blok, ekran ve akış registry sistemi.

> "Import et ve kilitlen" değil, "ekle, sahip ol ve değiştir."

## Durum

Bu depo şu anda **PRD / foundation aşamasında**. Ürün, mimari ve süreç kararlarının tamamı [`uixvisor.md`](./uixvisor.md) dosyasında tutulur — kod yazmadan önce her karar orada belgelenir ve orada güncellenir.

## Neden UIXVISOR

- **Expo-first, NativeWind-first, mobile-behavior-first** — sadece bileşen değil, çalışan akışlar (`npx uixvisor add phone-auth-flow`)
- **Copy-and-own** — kod projene kopyalanır, runtime bağımlılığı bırakmaz
- **Stable over newest** — desteklenen her kombinasyon (Expo SDK, NativeWind, Reanimated…) resmi olarak doğrulanmadan varsayılan yapılmaz
- **Tam açık kaynak, marka koruması ayrı** — bkz. [`uixvisor.md` §1.9](./uixvisor.md#19-marka-ve-açık-kaynak-politikası)

## Katkı

Branch/commit kuralları, PR süreci ve sürümleme politikası için [`uixvisor.md` §2.5](./uixvisor.md#25-git-ve-katkı-iş-akışı) ve [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasına bakın.

## Lisans

MIT — bkz. [LICENSE](./LICENSE). "UIXVISOR" adı ve logosu bu lisansın kapsamı dışındadır.
