# Başlangıç

UIXVISOR, Expo ve NativeWind projelerine kaynak kod kopyalayan bir registry
sistemidir. Eklenen bileşenler kullanıcı projesinin parçası olur; zorunlu bir
UIXVISOR runtime paketi bırakılmaz.

> Proje henüz public release öncesindedir. Domain ve hosted registry canlı
> değildir. Aşağıdaki kaynak-kod akışı bugün çalışır; npm komutları ilk public
> sürümden sonra varsayılan hâle gelecektir.

## Gereksinimler

- Node.js `>=22.13`
- Expo SDK `57`
- React Native `0.86`
- React `19.2`
- NativeWind `>=4 <5`
- npm

## Kaynak koddan kullanım

Önce UIXVISOR repository'sini hazırlayın:

```bash
git clone https://github.com/mrcv0/uixvisor.git
cd uixvisor
npm ci
npm run build --workspace uixvisor
```

Ardından Expo projenizde CLI'ı yerel registry ile başlatın:

```bash
cd /path/to/your-expo-app
node /path/to/uixvisor/packages/cli/dist/index.js init \
  --registry /path/to/uixvisor/registry
node /path/to/uixvisor/packages/cli/dist/index.js doctor
node /path/to/uixvisor/packages/cli/dist/index.js add button
```

Windows PowerShell örneği:

```powershell
node C:\src\uixvisor\packages\cli\dist\index.js init `
  --registry C:\src\uixvisor\registry
```

`add` işlemi gerekli registry bağımlılıklarını önce çözer ve kurulması gereken npm
paketlerini komut sonunda bildirir. Örneğin `button`, `theme` ve `spinner`
item'larını birlikte kopyalar.

## İlk npm sürümünden sonra

`uixvisor` paketi npm'e yayımlandıktan sonra aynı akış şu hâle gelecektir:

```bash
npx uixvisor init --registry <hosted-registry-url>
npx uixvisor doctor
npx uixvisor add button
```

Domain ve hosted registry yayına alınmadan bu adres için bir production değeri
belgelenmez.

## Sonraki adımlar

- [CLI komutları](./cli.md)
- [Tema ve preset'ler](./theming.md)
- [Katalog yapısı](./components.md)
- [Uyumluluk ve kalite kapıları](./compatibility.md)
