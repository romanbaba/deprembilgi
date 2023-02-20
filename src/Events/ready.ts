import { Events } from "../Interfaces";
import { bildirimGönder, Presence, autoSaver } from "../Utils";

export const Event: Events = {
  name: "ready",
  once: false,

  async execute(client) {

    console.log(`Aktif: ${client.user?.tag}`)

    setInterval(() => {autoSaver(client)}, 3_600_000)
    
    Presence(client)
    bildirimGönder(client)
  },
};