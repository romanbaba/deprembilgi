import { Commands } from "../Interfaces";
import { Deprem } from "../Deprem";
import { sehirler } from "../city";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";

export const Command : Commands = {
    name: "şehirara",
    description: "Şehir Arama ile son 100 deprem içinden istediğin şehrin istatistiklerini görebilirsin.",
    options: [
        {
            type: 3,
            name: "şehir",
            description: "Bir şehir ismi girin.",
            required: true,
        }
    ],

    async execute(client, interaction) {
        await interaction.deferReply();
        await Deprem.depremYenile();

        const publication : any = interaction.options.get("şehir")?.value?.toString().toLocaleLowerCase("tr")
        var real = publication[0].toLocaleUpperCase("tr") + publication.substring(1);
   
        if(sehirler.find((sehir) => sehir.name === real)) {
            const şehirDepremler = Deprem.depremÇevir().filter((deprem) => deprem.yer.toLocaleLowerCase("tr").includes(real.toLocaleLowerCase("tr")))
            if (!şehirDepremler.length) {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2F3136")
                         .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                        .setDescription(`<:kirmizi:1064928050363519038> **|** **${real}** şehri için [Afad](https://www.afad.gov.tr)'ın resmî web sitesinde deprem kaydı bulunmadı.`)
                    ]
                })
    
                return;
            }

             const int = await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2F3136")
                         .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                        .setTitle(`${real} şehrinde gerçekleşen son depremler`)
                        .setDescription(şehirDepremler.slice(0, 10).map(deprem => `\`>\` ${deprem.yer} **|** Tarih: \`${deprem.tarih.replace(/-/g, ".")}\`, Büyüklüğü: \`${deprem.büyüklük}\``).join("\r\n"))
                        .setFooter({ text: `Bizi tercih ettiğiniz için teşekkürler!`, iconURL: `${client.user?.avatarURL()}` })
                        .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                            .setCustomId(`refresh`)
                            .setLabel("Sayfa'yı yenile")
                            .setEmoji("<:replay:1072228636461109318>")
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setCustomId(`delete`)
                            .setLabel("Sayfa'yı kaldır")
                            .setEmoji("<:kirmizi:1064928050363519038>")
                            .setStyle(ButtonStyle.Danger)
                        )
                    ]
             });

             const filter = (i: any) => i.message.id === int.id; 
             const collector = int.createMessageComponentCollector({ filter, time: 60_000, componentType: ComponentType.Button })
             var deleted : boolean = false;
    
             collector?.on("collect", async(i) => {
                if(i.isButton()) {
                    if(i.user.id !== interaction.user.id) {
                        await i.reply({ content: `<:kirmizi:1064928050363519038> **|** Bu butonu yalnızca komutu kullanan kişi kullanabilir.`, ephemeral: true });
                        return;
                    } else {
                        if(i.customId === "refresh") {
    
                        await Deprem.depremYenile();
            
                        const depremler = Deprem.depremÇevir().filter((deprem) => deprem.yer.toLocaleLowerCase("tr").includes(real.toLocaleLowerCase("tr")));
                        if(!depremler.length) {
                            interaction.reply({ content: `<:kirmizi:1064928050363519038> **|** Şehir artık deprem listesinde yer almıyor.`, ephemeral: true  })
                            return;
                        }

                            i.reply({ embeds: [
                                new EmbedBuilder()
                                .setColor("#2F3136")
                                 .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                                .setDescription("> <:yesil:1064928017459187793> **|** Sayfa isteğiniz üzere başarıyla güncellendi.")
                            ], ephemeral: true })
                          i.message.edit({ 
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#2F3136")
                                 .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                                .setTitle(`${real} şehrinde gerçekleşen son depremler`)
                                .setDescription(şehirDepremler.slice(0, 10).map(deprem => `\`>\` ${deprem.yer} **|** Tarih: \`${deprem.tarih.replace(/-/g, ".")}\`, Büyüklüğü: \`${deprem.büyüklük}\``).join("\r\n"))
                                .setFooter({ text: `Bizi tercih ettiğiniz için teşekkürler!`, iconURL: `${client.user?.avatarURL()}` })
                                .setTimestamp()
                            ],                        
                         });
    
                         return;
                    }
    
                    if(i.customId === "delete") {
                        deleted = true;
                        i.message.delete()
                        return;
                    }
                    } 
                }
             });
    
             collector?.on("end", async() => {
                if(deleted) return;
    
                int.edit({ 
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                            .setCustomId(`refresh`)
                            .setLabel("Sayfa'yı yenile")
                            .setDisabled(true)
                            .setEmoji("<:replay:1072228636461109318>")
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setCustomId(`delete`)
                            .setLabel("Sayfa'yı kaldır")
                            .setDisabled(true)
                            .setEmoji("<:kirmizi:1064928050363519038>")
                            .setStyle(ButtonStyle.Danger)
                        )
                    ]
                 }).catch(() => {})
             })
             
             return;
        } else {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#2F3136")
                     .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                    .setDescription(`<:kirmizi:1064928050363519038> **|** **${real}** adında bir şehir bulamadım, bir hata varsa iletişime geçebilirsin.`)
                ]
            })

            return;
        }
    }
}