import { ActivityType } from "discord.js";
import { Bot } from "../Client";

export const Presence = (client: Bot) => {
    setInterval(() => {
      client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} sunucu`, type: ActivityType.Competing }], status: "online" })
    }, 15_000)
}