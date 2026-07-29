# E2E (Maestro)

`apps/test-harness/.maestro/` içindeki akışlar `dev.uixvisor.testharness` appId’ine göre
tanımlıdır.

Workflow `workflow_dispatch` ile iOS veya Android için elle tetiklenir. macOS runner üzerinde:

1. Maestro seçilen simulator/emulator’ü başlatır.
2. Expo CLI harness uygulamasını Release modunda derler, bundle’ı native binary’ye gömer ve
   cihaza kurar.
3. Maestro doğru device ID ile `apps/test-harness/.maestro` akışlarını çalıştırır.

Akışlar:

- `.maestro/bottom-sheet.yml` – modal açılışı ve kapanışı.
- `.maestro/otp-input.yml` – OTP girişi ve yeniden gönderme.
