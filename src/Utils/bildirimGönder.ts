import { Json } from "../Interfaces";
import { JsonDatabase } from "wio.db";
import { promisify } from "util";
import { codeBlock, EmbedBuilder } from "discord.js";
import { Deprem, DepremHarita } from "../Deprem";
import { Bot } from "../Client";

const db = new JsonDatabase<Json>();

export const bildirimGönder = (client: Bot) => {
    const depremKabulSeviyesi = 0;
    const depremUyarıSeviye = 5.0;
    const wait = promisify(setTimeout);

    const checkAndSendLastEarthquake = async (lastTime = ""): Promise<void> => {
      const { tarih, yer, tip, büyüklük, derinlik } = await getLastEarthquake();

      if (Number(büyüklük) < depremKabulSeviyesi) return await recheckEarthquake(tarih);
      

      const informationEmbed = new EmbedBuilder()
      .setColor("#2F3136")
      .setTitle(`${yer.replace(")", "").split("(")[1]} şehrinde az önce ${Number(büyüklük) <= 3.5 ? "hissedilmeyen": "hissedilen"} bir deprem oldu`)
      .addFields([
        {
            name: `İlçe:`,
            value: `${codeBlock("yaml", yer.split("(")[0])}`,
            inline: false
        },
        {
          name: "Şiddet:",
          value: `${codeBlock("yaml", büyüklük)}`,
          inline: true
        },
        {
            name: "Derinlik:",
            value: `${codeBlock("yaml", derinlik)}`,
            inline: true
        },
        {
            name: "Tarih:",
            value: `${codeBlock("yaml", tarih.split(" ")[0].toString().replace("-", ".").replace("-", ".").replace("-", "."))}`,
            inline: true
        },
          {
            name: "Saat:",
            value: `${codeBlock("yaml", tarih.split(" ")[1])}`,
            inline: true
        },
        {
          name: "Tip:",
          value: `${codeBlock("yaml", tip)}`,
          inline: true
      },
      ])
      .setFooter({ text: "Bizi kullandığınız için teşekkürler!", iconURL: `${client.user?.avatarURL()}` })
      .setTimestamp()

      for await (const informationGuildString of client.guilds.cache.map(x => x.id)) {
        const bildirim = db.fetch(`depremGuild_${informationGuildString}`)
        const depremuyarı = db.fetch(`depremUyarı_${informationGuildString}`);
        if(!bildirim) continue;
 
        const informationChannel : any = client.channels.cache.get(bildirim.channel);
        
        if (!informationChannel) {
            console.log(`Geçersiz kanal.`);
            continue;
          }

          if (lastTime === "") {
            await informationChannel.send({ embeds: [informationEmbed] }).catch(() => {})
          } else if (lastTime !== tarih) {
            if(depremuyarı && Number(büyüklük) >= depremUyarıSeviye) {
              await informationChannel.send({ content: `<@&${depremuyarı.role}> **|** Yüksek deprem seviyesi`, embeds: [informationEmbed] }).catch(() => {})
            } else {
              await informationChannel.send({ embeds: [informationEmbed] }).catch(() => {})
            }
          }
      }

      return await recheckEarthquake(tarih);
    };

    const recheckEarthquake = async (time: string): Promise<void> => {
      await wait(60 * 1000);
      return await checkAndSendLastEarthquake(time);
    };

    const getLastEarthquake = async (): Promise<DepremHarita> => {
      await Deprem.depremYenile();
      const last = Deprem.depremÇevir()[0];
      if (!last) {
        await wait(15 * 1000);
        return await getLastEarthquake();
      }
      return last;
    };

    checkAndSendLastEarthquake()
}