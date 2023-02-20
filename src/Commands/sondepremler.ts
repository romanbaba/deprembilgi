import { Commands } from "../Interfaces";
import { Deprem } from "../Deprem";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";

export const Command : Commands = {
    name: "sondepremler",
    description: "Türkiye'de gerçekleşen son depremleri görebilirsin.",

    async execute(client, interaction) {
        await interaction.deferReply();
        await Deprem.depremYenile();
        
        const depremler = Deprem.depremÇevir().slice(0, 10).map(deprem => `\`>\` ${deprem.yer} **|** Tarih: \`${deprem.tarih.replace(/-/g, ".")}\`, Büyüklüğü: \`${deprem.büyüklük}\``).join("\r\n");
        
        const int = await interaction.followUp({ 
            embeds: [
                new EmbedBuilder()
                .setColor("#2F3136")
                .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                .setTitle("Türkiyede gerçekleşen son depremler")
                .setDescription(depremler.toString())
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
        
                    const depremler = Deprem.depremÇevir().slice(0, 10).map(deprem => `\`>\` ${deprem.yer} **|** Tarih: \`${deprem.tarih.replace(/-/g, ".")}\`, Büyüklüğü: \`${deprem.büyüklük}\``).join("\r\n");

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
                        .setTitle("Türkiyede gerçekleşen son depremler")
                        .setDescription(depremler.toString())
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
    }
}