import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType, EmbedBuilder, PermissionsBitField } from "discord.js";
import { Commands } from "../Interfaces";
import { JsonDatabase } from "wio.db";

const db = new JsonDatabase()

export const Command : Commands = {
    name: "deprembildirim",
    description: "Deprem bildirim ile her deprem olduğunda anında haberdar olabilirsin.",
    default_member_permissions: 10,
    options: [
        { 
            type: 7,
            name: "kanal",
            description: "Bir hedef kanalı girin",
            channel_types: [ChannelType.GuildText],
            required: true
        },
    ],

    async execute(client, interaction) {
        await interaction.deferReply();

        if(!interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#2F3136")
                     .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                    .setTitle(`İşlem başarısız`)
                    .setDescription(`> <:kirmizi:1064928050363519038> **|** Deprem bildirimlerin gönderilmesi için bota yetki vermeniz gerekiyor.`)
                    .setFooter({ text: `Bizi tercih ettiğiniz için teşekkürler!`, iconURL: `${client.user?.avatarURL()}` })
                    .setTimestamp()
                ],
            })

            return;
        }

        const channel = interaction.options.get("kanal")?.channel?.id
        const depremalarm = db.fetch(`depremGuild_${interaction.guildId}`)
        const text = depremalarm ? "değiştirildi" : "ayarlandı"

        db.set(`depremGuild_${interaction.guildId}`, { channel: channel }, true)
        

       const int = await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setColor("#2F3136")
                 .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                .setTitle(`İşlem başarılı`)
                .setDescription(`> <:yesil:1064928017459187793> **|** Deprem bildirim kanalı başarıyla <#${channel}> olarak ${text}.`)
                .setFooter({ text: `Bizi tercih ettiğiniz için teşekkürler!`, iconURL: `${client.user?.avatarURL()}` })
                .setTimestamp()
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                    .setCustomId(`deleteDepremBildirim`)
                    .setLabel("Veri'yi sil")
                    .setEmoji("<:kirmizi:1064928050363519038>")
                    .setStyle(ButtonStyle.Danger)
                )
            ]
        });
        
        if(interaction.channel?.isTextBased()) {

        const filter = (i: any) => i.message.id === int.id; 
        const collector = int.createMessageComponentCollector({ filter, time: 60_000, componentType: ComponentType.Button })
        var deleted : boolean = false;

        collector?.on("collect", async(i) => {
           if(i.isButton()) {
               if(i.user.id !== interaction.user.id) {
                   await i.reply({ content: `<:kirmizi:1064928050363519038> **|** Bu butonu yalnızca komutu kullanan kişi kullanabilir.`, ephemeral: true });
                   return;
               } else {
               if(i.customId === "deleteDepremBildirim") {
                 if(!db.fetch(`depremGuild_${interaction.guildId}`)) {
                    await i.reply({ content: `<:kirmizi:1064928050363519038> **|** Bilinmeyen veritabanı.`, ephemeral: true });
                 }

                   deleted = true;
                   db.delete(`depremGuild_${i.guildId}`) 

                   i.update({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2F3136")
                         .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                        .setTitle(`İşlem başarılı`)
                        .setDescription(`> <:yesil:1064928017459187793> **|** Deprem bildirim kanalı başarıyla sıfırlandı.`)
                        .setFooter({ text: `Bizi tercih ettiğiniz için teşekkürler!`, iconURL: `${client.user?.avatarURL()}` })
                        .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                            .setCustomId(`deleteDepremBildirim`)
                            .setLabel("Veri'yi sil")
                            .setDisabled(true)
                            .setEmoji("<:kirmizi:1064928050363519038>")
                            .setStyle(ButtonStyle.Danger)
                        )
                    ]
                });
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
                        .setCustomId(`deleteDepremBildirim`)
                        .setLabel("Veri'yi sil")
                        .setDisabled(true)
                        .setEmoji("<:kirmizi:1064928050363519038>")
                        .setStyle(ButtonStyle.Danger)
                    )
                ]
             }).catch(() => {})
         })
        }
    }
}