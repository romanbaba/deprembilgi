import { ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock, EmbedBuilder } from "discord.js";
import { Commands } from "../Interfaces";

export const Command : Commands = {
    name: "gsm",
    description: "Afad'ın resmî iletişim bilgilerini gösterir.",

    async execute(client, interaction) {
        await interaction.deferReply();

        interaction.followUp({ embeds: [
                new EmbedBuilder()
                .setColor("#2F3136")
                .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
                .addFields([
                    {
                        name: "Adres;",
                        value: `${codeBlock("yaml", `Üniversiteler Mah. Dumlupınar Bulvarı No: 159 06800 Çankaya/ Ankara`)}`
                    },
                    {
                        name: "E-Posta;",
                        value: `${codeBlock("yaml", `basin.halklailiskiler@afad.gov.tr`)}`
                    },
                    {
                        name: "Telefon numarası;",
                        value: `${codeBlock("yaml", `0 (312) 258 23 23`)}`,
                        inline: true
                    },
                    {
                        name: "Belgegeçer numarası;",
                        value: `${codeBlock("yaml", `0 (312) 258 2082`)}`,
                        inline: true
                    }
                ])
             ], 
             components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                    .setURL(`https://www.afad.gov.tr/afad-iletisim`)
                    .setEmoji("<:908263774417477642:1072971796959211684>")
                    .setLabel("Afad'ın iletişim bilgileri")
                    .setStyle(ButtonStyle.Link),
                )
            ]    })
    }
}