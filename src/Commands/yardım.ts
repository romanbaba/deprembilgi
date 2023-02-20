import { ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock, EmbedBuilder } from "discord.js";
import { Commands } from "../Interfaces";

export const Command : Commands = {
    name: "yardım",
    description: "Sizlere hizmet eden botun yardım menüsünü görebilirsin.",

    async execute(client, interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setColor("#2F3136")
        .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
        .setTitle("🆕 Deprem Bildirim güncellendi")
        .setDescription(`Merhaba değerli kullanıcı, ülkemizde deprem oluştuğunda (ki umarım olmaz) ilk senin haberin olmasını ister misin? </deprembildirim:1072917451672658021> komutunu kullanarak anında haberdar olabilirsin.`)
        .addFields({
            name: "Komutlar",
            value: `${codeBlock("yaml", `${client.commands.map((cmd) => `/${cmd.name}`).join(", ")}`)}`
        })

        interaction.followUp({
            embeds: [
                embed
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands`)
                    .setEmoji("<:908263774417477642:1072971796959211684>")
                    .setLabel("Davet et")
                    .setStyle(ButtonStyle.Link),
                )
            ]
        })
    }
}