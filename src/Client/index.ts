import { Client, Collection } from "discord.js";
import { Config, Commands, Events } from "../Interfaces";

import { Routes, REST } from "discord.js";

import configFile from "../config.json";

import fs from "fs";
import path from "path";
import { connect, set } from "mongoose";

export class Bot extends Client {
    public config : Config = configFile;
    public commands : Collection<string, Commands> = new Collection()

    async connect() {
        const rest = new REST({ version: "10" }).setToken(this.config.token);

        //this.mongodb()
        this.registeredCommands()
        this.registeredEvents()
        this.postingCommands(rest)

        this.login(this.config.token)
    }

    async registeredEvents() {
        fs.readdir(path.join(__dirname, "../Events"), (err, events: string[]) => {
            if(err) throw new Error(err.message);

            events.forEach(async (event : string) => {
                try {
                    const { Event }: { Event: Events } = await import(`../Events/${event}`);

                    if(Event.once) {
                        this.once(Event.name, (...args) => {
                            Event.execute(this, ...args)
                        });
                    } else {
                        this.on(Event.name, (...args) => {
                            Event.execute(this, ...args)
                        });
                    }

                } catch (err) {
                    throw err;
                }
            });
       });

       return this;
    }

    public async registeredCommands() {
        fs.readdir(path.join(__dirname, "../Commands"), (err, commands: string[]) => {
            if(err) throw new Error(err.message);

            commands.forEach(async (command : string) => {
                try {
                    const { Command }: { Command: Commands } = await import(`../Commands/${command}`);

                    this.commands.set(Command.name, Command)
                    
                } catch (err) {
                    throw err;
                }
            });
       });
    }

    public async postingCommands(rest: any) {
        this.once("ready", async() => {
            await rest.put(Routes.applicationCommands(this.config.id), { body: this.commands.toJSON() });
        });
    }
    public async mongodb() {
        set("strictQuery", false)

       connect(this.config.database.url)
    }
}