import { EmbedBuilder } from "discord.js";
import { Commands } from "../Interfaces";

export const Command : Commands = {
    name: "ping",
    description: "Sizlere hizmet eden botun gecikme değerlerini görebilirsin.",

    async execute(client, interaction) {
        await interaction.deferReply();

        interaction.followUp({ embeds: [
            new EmbedBuilder()
            .setColor("#2F3136")
            .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
            .setDescription("> <:bot:1068462772054143006> **|** Veri değerleri güncellendi, anlık gecikme değerim `"+client.ws.ping+"ms` olarak gözüküyor.")
        ] })
    }
}