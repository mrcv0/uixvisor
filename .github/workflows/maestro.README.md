# E2E (Maestro)

`apps/test-harness/.maestro/` içindeki akışlar şu anda `dev.uixvisor.testharness` appId’ine göre tanımlı.

Bu workflow manuel tetiklenir. **GitHub-hosted runner’larda gerçek bir Android emülatörü çalıştırmak önerilmez**; bunun yerine:

- EAS Workflows üzerinden “E2E” job’ı ile cihaz çalıştırmak (`eas/e2e.yml`).
- Veya kendi macOS/Linux runner’ınızda `emulator -avd ...` veya `xcrun simctl` ile cihaz başlatıp `maestro test` çalıştırmak.

Akışlar:

- `.maestro/bottom-sheet.yml` – modal açılışı, kapatması.
- `.maestro/otp-input.yml` – OTP girişi.

Bu workflow `workflow_dispatch` ile manuel tetiklenir. Otomasyon için ileride EAS Workflows veya bir runbook kullanın.
