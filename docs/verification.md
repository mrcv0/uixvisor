# E2E Verification

`apps/test-harness` ve `apps/showcase-expo` üç platformda (web, iOS, Android) `expo export` ile derlenir. Bu doğrulama:

```bash
npm run build --workspace @uixvisor/test-harness
npm run build --workspace @uixvisor/showcase-expo
```

`expo export` çıktılarını `dist/` altında inceleyebilirsiniz:

- `apps/test-harness/dist/index.html` (web) — `npm run web` ile servis edilebilir.
- `apps/test-harness/dist/_expo/static/js/ios/index-*.hbc` — iOS bundle.
- `apps/test-harness/dist/_expo/static/js/android/index-*.hbc` — Android bundle.

## Maestro akışları

Maestro akışları `apps/test-harness/.maestro/` altındadır ve testten önce Release native
uygulamasının seçilen cihaza kurulması gerekir.

```bash
cd apps/test-harness

# Android
maestro start-device --platform android
npm exec expo -- run:android --variant release --no-bundler
maestro test .maestro

# iOS (yalnız macOS)
maestro start-device --platform ios
npm exec expo -- run:ios --configuration Release --no-bundler
maestro test .maestro
```

CI için `.github/workflows/maestro.yml` dosyasındaki `workflow_dispatch` akışını kullanın.

## Temiz Expo SDK 57 CLI kabul testi

Son doğrulama: **30 Temmuz 2026**

Kabul testi, repository dışında oluşturulan temiz bir Expo projesinde çalıştırıldı:

- Expo `57.0.9`
- React Native `0.86.2`
- React `19.2.3`
- NativeWind `4.2.6`
- npm

Temiz proje resmi SDK 57 template'iyle oluşturuldu:

```bash
npx create-expo-app@latest uixvisor-acceptance-sdk57 --template default@sdk-57 --yes
cd uixvisor-acceptance-sdk57
npm install nativewind@^4.2.6
```

Yerel CLI build'i ve repository registry'si kullanılarak aşağıdaki kabul akışı
doğrulandı:

```bash
node <repo>/packages/cli/dist/index.js init --registry <repo>/registry
node <repo>/packages/cli/dist/index.js list
node <repo>/packages/cli/dist/index.js add button
node <repo>/packages/cli/dist/index.js diff button
node <repo>/packages/cli/dist/index.js doctor
```

Sonuçlar:

- `init`, Expo, NativeWind, Expo Router ve npm'i doğru algıladı.
- `list`, 42 registry item'ının tamamını listeledi.
- `add button`, `theme` ve `spinner` bağımlılıklarını önce çözerek altı dosya yazdı.
- CLI'ın raporladığı `@expo-google-fonts/inter`, `expo-font` ve `expo-haptics`
  bağımlılıkları `npx expo install` ile kurulabildi.
- İlk `diff` temiz geçti. Yerel bir değişiklikten sonra exit code `1` döndü;
  `add button --force` kaynakları geri yükledi ve sonraki `diff` temiz geçti.
- `doctor` beş kontrolün tamamında geçti; 42 item Expo 57 ile uyumlu bulundu.
- Kopyalanan UIXVISOR kaynakları ayrı TypeScript kabul kontrolünde geçti.
- Kopyalanan kaynaklarda çözülmemiş `@registry/*` veya `@uixvisor/*` importu yoktu.
- Test projesinin `package.json` dosyasına `uixvisor` ya da `@uixvisor/*`
  runtime bağımlılığı eklenmedi.

Rollback ayrı bir CLI komutu değildir. PRD'deki rollback garantisi, `add` sırasında
bir yazma başarısız olursa daha önce yazılan dosyaların otomatik geri alınmasıdır.
Bu davranış `packages/cli/src/commands/add.test.ts` içindeki hata enjeksiyonlu testle
doğrulanır.

SDK 57 varsayılan template'inin kendi `src/` dizininde iki CSS declaration hatası
bulundu (`animated-icon.module.css` ve `@/global.css`). Bunlar UIXVISOR tarafından
kopyalanan dosyalardan bağımsızdır; `components/ui` altındaki kopyalanan kaynakların
TypeScript kontrolü ayrıca başarılıdır.
