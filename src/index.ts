import { IntentsBitField } from "discord.js";
import { Bot } from "./Client";

const client = new Bot({
    intents: [IntentsBitField.Flags.Guilds],
});

client.connect()