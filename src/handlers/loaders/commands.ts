import {
    REST,
    Routes
} from 'discord.js'
import chalk from "chalk"
import fs from 'fs';
import { join } from 'path';

module.exports = (client: any) => {
    const commands: any = [];

    fs.readdirSync(join(__dirname, '../../interactions')).forEach((dirs: any) => {
        const commandFiles = fs.readdirSync(join(__dirname, `../../interactions/${dirs}`)).filter((files: any) => files.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(join(__dirname, `../../interactions/${dirs}/${file}`));
            client.commands.set(command.data.name, command);
            commands.push(command.data);
        };
    });

    const rest = new REST().setToken(process.env.TOKEN || '');
    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                // Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            )
        } catch (error) {
            console.log(error);
        }
    })();
}
