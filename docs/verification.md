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

`.maestro/*.yml` dosyaları cihaz/maestro sürümü 1.30+ ile uyumludur. Cihazınız hazır olduğunda:

```bash
npx maestro test .maestro/bottom-sheet.yml
npx maestro test .maestro/otp-input.yml
```

CI için: `.github/workflows/maestro.yml` yönergelerine bakın; `workflow_dispatch` ile elle tetiklenir.
