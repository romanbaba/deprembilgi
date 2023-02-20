import { CommandInteraction } from "discord.js";
import { Bot } from "../Client";
import { Options } from "./Options";

export interface Commands {
    name: string;
    description: string;
    options?: Options[]
    default_member_permissions?: number,
    execute: (client: Bot, interaction: CommandInteraction) => Promise<any> | any;
}