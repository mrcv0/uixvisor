# Katalog

UIXVISOR katalogu beş public item türü ve bir yardımcı forms alanından oluşur.
Her item; manifest, kaynak dosyaları, platform bilgisi, uyumluluk aralıkları, npm
bağımlılıkları ve registry bağımlılıklarını içerir.

## Mevcut kapsam

| Alan | Adet | Örnekler |
|---|---:|---|
| Primitives | 18 | Button, Input, Text, Card, Checkbox, Theme |
| Mobile components | 8 | OTP Input, Bottom Sheet, Toast, Swipeable Row |
| Blocks | 4 | App Header, Form Field, List Item, Button Group |
| Screens | 6 | Sign In, Sign Up, OTP Verify, Dashboard, Profile, Settings |
| Flows | 4 | Email Auth, Phone Auth, Onboarding, Authenticated Home |
| Forms helpers | 2 | Form Adapter, Auth Schemas |

Manifest türleri folder sınıflandırmasından bağımsız olabilir. Örneğin birçok
primitive `registry:component`, `icon` ve `theme` ise `registry:primitive` türünü
kullanır.

## Copy-and-own

`uixvisor add` sonucunda kaynak dosyaları doğrudan kullanıcı projesine yazılır:

```text
components/
├── ui/
├── blocks/
├── screens/
└── flows/
```

Registry içi `@registry/*` importları kopyalama sırasında göreli importlara
çevrilir. Son projede UIXVISOR runtime paketine ihtiyaç kalmaz.

## Bir item'ın yapısı

```text
registry/primitives/button/
├── button.tsx
└── registry-item.json
```

Manifest örneği:

```json
{
  "$schema": "https://uixvisor.dev/schema/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "version": "0.3.0",
  "platforms": ["ios", "android"],
  "compatibility": {
    "expo": ">=57 <58",
    "nativewind": ">=4 <5"
  },
  "dependencies": [],
  "registryDependencies": ["theme", "spinner"],
  "files": [
    {
      "source": "button.tsx",
      "target": "components/ui/button.tsx"
    }
  ]
}
```

Domain henüz canlı olmadığı için `$schema` production sözleşmesini ifade eder;
local CLI kullanımı bu URL'yi indirmeden çalışır.

## Item kabul kapısı

- Kaynak ve hedef yollar portable, göreli ve traversal içermeyen yollar olmalı.
- Item adı primary dosya adıyla eşleşmeli.
- Registry importları `registryDependencies` ile birebir uyuşmalı.
- Her kopyalanan dosya canonical kaynak notuyla başlamalı.
- Expo ve NativeWind uyumluluk aralıkları açıkça tanımlanmalı.
- Registry doğrulaması 42/42 item için geçmeli.
