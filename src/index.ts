import { 
    Client, 
    GatewayIntentBits, 
    Collection, 
    PermissionFlagsBits,
    Events
} from "discord.js";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./types";
import connect from "./database/connect";
import { botConfig } from "./config/bot";
import emotes from "./config/emojis.json";

const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})

config()
connect()

client.config = botConfig;
client.emotes = emotes;
client.commands = new Collection<string, Command>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(dir => {
    readdirSync(join(__dirname, "./handlers/" + dir)).forEach((handler) => {
        require(`${handlersDir}/${dir}/${handler}`)(client)
    })
})

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN)