import { ClientEvents } from "discord.js";
import { Bot } from "../Client";

export interface Events { 
    name: keyof ClientEvents;
    once?: boolean;
    execute: (client: Bot, ...args: any) => Promise<any> | any;
}