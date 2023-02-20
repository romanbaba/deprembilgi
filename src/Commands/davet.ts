import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Commands } from "../Interfaces";

export const Command : Commands = {
    name: "davet",
    description: "Projemizden memmnunsan sunucuna ekliyebilirsin.",

    async execute(client, interaction) {
        await interaction.deferReply();

        interaction.followUp({ embeds: [
            new EmbedBuilder()
            .setColor("#2F3136")
            .setTitle("Proje'ye destek ver.")
            .setDescription("> Projemizi kullanarak anında deprem bildirimlerini alın, kendi şehriniz için arama yapabilir veya son depremleri görüntüleyebilirsin.")
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                    .setURL(`https://discord.gg/6ZAnTR484y`)
                    .setEmoji("💼")
                    .setLabel("Topluluk sunucusu")
                    .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands`)
                    .setEmoji("<:908263774417477642:1072971796959211684>")
                    .setLabel("Davet et")
                    .setStyle(ButtonStyle.Link),
                )
            ] })
    }
}