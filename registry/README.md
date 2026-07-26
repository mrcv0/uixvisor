# Registry İçeriği

Bu dizin npm paketi değildir; UIXVISOR CLI'nin `add` komutuyla kullanıcı projelerine kopyaladığı gerçek kaynak dosyaları ve `registry-item.json` manifestlerini barındırır.

| Alt dizin     | İçerik                                        |
|---------------|------------------------------------------------|
| `primitives/` | Text, Button, Input gibi temel bileşenler (§4.2) |
| `mobile/`     | OTP Input, Bottom Sheet gibi mobil davranış bileşenleri (§4.3) |
| `blocks/`     | Profile Header, Balance Card gibi ekran içi kompozisyonlar (§4.4) |
| `forms/`      | RHF+Zod form adapter ve paylaşılan Zod şemaları (§2.1) |
| `screens/`    | Login, Settings gibi tam sayfa arayüzler (§4.4) |
| `flows/`      | Email/Phone auth, Onboarding, Authenticated home (§4.4) |

### Forms (yapı taşı)

Yeni form ekranı eklerken:

1. Zod şemasını `auth-schemas` (veya yeni `*-schemas` item) içinde tanımla.
2. `useAppForm({ schema, defaultValues })` ile formu kur.
3. Etiketli alanlar → `ControlledFormField` + `bindTextInput(field)` (ref `setFocus` için).
4. Kendi label’ı olan kontroller (OTP) → `ControlledField`.
5. Submit → `createFormSubmitHandler(form, onSubmit, { fieldOrder, onPendingChange })`.
6. Async/server hataları → `FormRootError` + `useFormRootError(form)` (UI’da `if (!x)` yok).

Primitive’ler (`Input`, `FormField`) `react-hook-form` / `zod` import etmez.

Her item, `uixvisor.md` §5.3'teki şemaya uyan bir `registry-item.json` ve kaynak dosyalarından oluşur. Şema doğrulaması `@uixvisor/registry-schema` paketiyle yapılır.
