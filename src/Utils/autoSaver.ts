import fs from "fs";
import { WebhookClient, AttachmentBuilder, EmbedBuilder } from "discord.js";
import { Bot } from "../Client";

export const autoSaver = (bot: Bot) => {
    const database = fs.readFileSync("./databases/db.json", 'utf-8');
    const client = new WebhookClient({ url: bot.config.database.webhook });

    const date: string = `${new Date().toLocaleDateString()}`;
    
    client.send({
        files: [
          new AttachmentBuilder(Buffer.from(`${database}`, "utf-8"), { name: `database-${date}.json` })
        ]
    })
}


