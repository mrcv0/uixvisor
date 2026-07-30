# CLI

CLI'ın kaynak paket adı `uixvisor`dır. Public release öncesinde
`packages/cli/dist/index.js` üzerinden, release sonrasında `npx uixvisor`
üzerinden çalıştırılır.

## Registry kaynağı önceliği

CLI registry kaynağını şu sırayla çözer:

1. Komuttaki `--registry <path-or-https-url>` seçeneği.
2. `UIXVISOR_REGISTRY` ortam değişkeni.
3. `uixvisor.config.json` içindeki `registry` alanı.

Hosted kaynaklar HTTPS kullanmak zorundadır. Local geliştirmede mutlak veya göreli
bir filesystem yolu kullanılabilir.

## Komutlar

### `init`

Expo, NativeWind, Expo Router ve paket yöneticisini algılar; ardından
`uixvisor.config.json` oluşturur.

```bash
uixvisor init --registry ../uixvisor/registry
uixvisor init --registry ../uixvisor/registry --icons phosphor --font system
```

Mevcut config sessizce ezilmez. Bilinçli güncelleme için `--force` gerekir.
Preview deployment testlerinde schema adresi `UIXVISOR_SCHEMA_BASE_URL` ile
geçici olarak değiştirilebilir.

### `list`

Registry item'larını tür ve başlıklarıyla alfabetik listeler:

```bash
uixvisor list
uixvisor list --registry ../uixvisor/registry
```

### `add`

Seçilen item ve registry bağımlılıklarını topolojik sırada kopyalar:

```bash
uixvisor add button
uixvisor add email-auth
uixvisor add button --target ./apps/mobile
```

- Var olan dosyalar varsayılan olarak atlanır.
- `--force`, hedefleri registry sürümüyle bilinçli olarak yeniden yazar.
- Aynı işlemde bir yazma başarısız olursa daha önce yazılan dosyalar otomatik
  geri alınır.
- Gerekli npm paketleri raporlanır; CLI bunları sessizce kurmaz.

### `diff`

Yerel dosyayı registry kaynağıyla satır bazında karşılaştırır:

```bash
uixvisor diff button
```

Fark yoksa exit code `0`, fark varsa exit code `1` döner. Bu davranış CI'da
drift kontrolü için kullanılabilir.

### `doctor`

Proje ve registry uyumluluğunu kontrol eder:

```bash
uixvisor doctor
```

Expo projesi, NativeWind, paket yöneticisi, registry yükleme durumu ve Expo
compatibility aralıkları raporlanır.

## Offline kullanım

Hosted registry daha önce başarıyla indirildiyse `list`, `add`, `diff` ve
`doctor` komutlarında `--offline` kullanılabilir:

```bash
uixvisor list --offline
uixvisor add button --offline
```

Offline mod ağ isteği yapmaz ve yalnızca aynı registry origin/cache sürümü için
doğrulanmış snapshot'ı kullanır.

## Güvenlik davranışı

- Hosted URL yalnız HTTPS olabilir.
- İndirilen payload SHA-256 ile doğrulanır.
- Redirect başka origin'e kaçamaz.
- `..`, mutlak yol, symlink ve Windows junction üzerinden proje dışına yazılamaz.
- Postinstall script çalıştırılmaz.
- Dosyalar sessizce ezilmez.
