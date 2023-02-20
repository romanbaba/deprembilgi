import { GuildChannelTypes } from "discord.js";

interface Choices {
    name: string,
    value: string
}

export interface Options {
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    name: string;
    description: string;
    channel_types?: GuildChannelTypes[]
    choices?: Choices[]
    focused?: boolean;
    required?: boolean;
    options?: Options[]
}