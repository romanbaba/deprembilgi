import { codeBlock, EmbedBuilder } from "discord.js";
import { Commands } from "../Interfaces";
import { version, dependencies, devDependencies } from "../../package.json"
import { JsonDatabase } from "wio.db";

const db = new JsonDatabase()

export const Command : Commands = {
    name: "istatistik",
    description: "Sizlere hizmet eden botun gecikme değerlerini görebilirsin.",

    async execute(client, interaction) {
        await interaction.deferReply();

        interaction.followUp({ embeds: [
            new EmbedBuilder()
            .setColor("#2F3136")
            .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
            .setDescription(`Deprem bildirim, Typescript@${devDependencies.typescript.replace("^", "")} sürümü ile geliştirilmeye devam ediyor, yardım etmek istiyorsan bize ulaşabilirsin.`)
            .addFields([
                {
                    name: "Discord.js;",
                    value: `${codeBlock("yaml", `${dependencies["discord.js"].replace("^", "")}`)}`,
                    inline: true
                },
                {
                    name: "Mongoose;",
                    value: `${codeBlock("yaml", `${dependencies["mongoose"].replace("^", "")}`)}`,
                    inline: true
                },
                {
                    name: "Deprem Bildirim;",
                    value: `${codeBlock("yaml", `${version.replace("^", "")}`)}`,
                    inline: true
                },
                {
                    name: "Sunucu sayısı;",
                    value: `${codeBlock("yaml", `${client.guilds.cache.size}`)}`,
                    inline: true
                },
                {
                    name: "Kullanıcı sayısı;",
                    value: `${codeBlock("yaml", `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`)}`,
                    inline: true
                },
                {
                    name: "Bildirim sistemi açık sunucu;",
                    value: `${codeBlock("yaml", `${db.fetchAll().length ?? "0"}`)}`,
                    inline: true
                }
            ])
        ] })
    }
}