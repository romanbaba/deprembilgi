import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Events } from "../Interfaces";

export const Event : Events = {
    name: "interactionCreate",

    async execute(client, interaction: CommandInteraction) {
        if(interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);

            if(cmd) {
                try {
                    cmd.execute(client, interaction)
                } catch (err) {
                    interaction.reply({ content: "Tebrikler, bir hata buldun! bunu geliştiricilerimize söylesen iyi edersin; https://discord.gg/KcwCsBgAaG", ephemeral: true })                 
                }
            }

        }
    },
}