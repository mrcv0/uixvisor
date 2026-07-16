# Registry İçeriği

Bu dizin npm paketi değildir; UIXVISOR CLI'nin `add` komutuyla kullanıcı projelerine kopyaladığı gerçek kaynak dosyaları ve `registry-item.json` manifestlerini barındırır.

| Alt dizin     | İçerik                                        |
|---------------|------------------------------------------------|
| `primitives/` | Text, Button, Input gibi temel bileşenler (§4.2) |
| `mobile/`     | OTP Input, Bottom Sheet gibi mobil davranış bileşenleri (§4.3) |
| `blocks/`     | Profile Header, Balance Card gibi ekran içi kompozisyonlar (§4.4) |
| `screens/`    | Login, Settings gibi tam sayfa arayüzler (§4.4) |
| `flows/`      | Phone Auth, Onboarding gibi çok ekranlı akışlar (§4.4) |

Her item, `uixvisor.md` §5.3'teki şemaya uyan bir `registry-item.json` ve kaynak dosyalarından oluşur. Şema doğrulaması `@uixvisor/registry-schema` paketiyle yapılır.
