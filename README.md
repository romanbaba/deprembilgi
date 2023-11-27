
# Discord ile Afad depremlerine ulaşın ❤
Bu projenin genel amacı Afad resmî websitesi üzerinden deprem bilgilerini çekerek oluşan son depremi ayarlanan **deprem kanallarına** gönderim sağlamasıdır.


## Yükleme 
Projenin gereksinimi olan paketleri mevcut paket yöneticiniz ile projeye indirebilirsiniz, ben genel olarak `pnpm` kullanıyorum.

```bash 
  npm install
  pnpm install
  yarn
```
    
## Kurulum
İlk öncelikle `src` klasörü içerisindeki `config.json` dosyasını açarak aşağıdaki `JSON` verisine ulaşın.
```json
{
    "token": "token",
    "id": "id",
    "database": {
        "url": "mongodb_url", 
        "webhook": "webhook_url"
    }
}
```
### Verileri girmek
- **token**: Discord üzerinden aldığınız bot tokenini buraya gireceksiniz.
- **id**: Discord üzerinden aldığınız bot ID'sini buraya gireceksiniz.
- **url**: MongoDB üzerinden aldığınız veritabanı URI'sini buraya gireceksiniz (zorunlu değildir, es geçiniz!).
- **webhook**: Discord sunucunuzdan oluşturuğunuz webhook URL'sini buraya gireceksiniz (zorunlu değildir, es geçiniz!).
  
## Örnek bir komut objesi:

```ts
import { Commands } from "../Interfaces";

export const Command : Commands = {
    name: "test",
    description: "Bu örnek bir test komuturudr.",

    async execute(client, interaction) {
        await interaction.deferReply();
    }
}
```

## Örnek bir etkinlik objesi:
```ts
import { Events } from "../Interfaces";

export const Event: Events = {
  name: "ready",
  once: false,

  async execute(client) {
    console.log(`Aktif: ${client.user?.tag}`)
  },
};
```

  
## Lisans

[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html/)

  
## Yazarlar ve Teşekkür

- [@ewgsta](https://www.github.com/ewgsta) tarafından kodlanmış ve tasarlanmıştır, izni dışında hiç bir yerde paylaşılamaz.

  
