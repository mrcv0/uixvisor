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
