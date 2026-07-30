# UIXVISOR Docs

Next.js 16.2.11 tabanlı dokümantasyon ve registry katalog uygulaması.

## Local geliştirme

Monorepo kökünden:

```bash
npm ci
npm run dev --workspace @uixvisor/docs
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır. Registry
item'ları repository kökündeki `registry/` dizininden server-side okunur ve
`@uixvisor/registry-schema` ile doğrulanır.

## Kontroller

```bash
npm run lint --workspace @uixvisor/docs
npm run typecheck --workspace @uixvisor/docs
npm test --workspace @uixvisor/docs
npm run build --workspace @uixvisor/docs
```

## Domain ve endpoint durumu

UIXVISOR domaini henüz satın alınmadı; hosted registry ve schema production
endpoint'leri canlı değildir. Varsayılan docs görünümü bu adresleri tıklanabilir
production servisleri olarak göstermez.

Preview veya production deployment'ta aşağıdaki server environment variable'ları
kullanılabilir:

| Değişken | Amaç |
|---|---|
| `UIXVISOR_SITE_URL` | Docs/site base URL |
| `UIXVISOR_REGISTRY_BASE_URL` | Hosted registry HTTPS base URL |
| `UIXVISOR_SCHEMA_BASE_URL` | Schema HTTPS base URL |
| `UIXVISOR_REGISTRY_CHANNEL` | `stable` veya `preview` kanal etiketi |
| `UIXVISOR_PUBLIC_ENDPOINTS_AVAILABLE` | `true` olduğunda endpoint linklerini görünür yapar |
| `UIXVISOR_REGISTRY_ROOT` | Build sırasında farklı local registry dizini |

URL resolver HTTPS zorunluluğu uygular ve credentials, query veya fragment içeren
base URL'leri reddeder.

## Static schema dosyaları

Canonical JSON Schema dosyaları:

```text
public/schema/config.json
public/schema/registry-item.json
```

Domain bağlandıktan sonra bunlar `/schema/config.json` ve
`/schema/registry-item.json` yollarından sunulur.

## Deployment

Domain alınmadan yapılan deployment yalnız staging/preview kabul edilir.
Production endpoint linkleri ancak DNS, HTTPS, schema ve hosted registry smoke
testleri geçtikten sonra `UIXVISOR_PUBLIC_ENDPOINTS_AVAILABLE=true` ile açılmalıdır.
