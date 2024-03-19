import {
    Events
} from 'discord.js'

import chalk from "chalk"
import fs from 'fs';
import { join } from 'path';

module.exports = (client: any) => {

    fs.readdirSync(join(__dirname, '../../events')).forEach((dirs: any) => {
        const events = fs.readdirSync(join(__dirname, `../../events/${dirs}`)).filter((files: any) => files.endsWith('.js'));

        for (const file of events) {
            const event = require(join(__dirname, `../../events/${dirs}/${file}`));
            const eventName = file.split(".")[0];
            const eventUpperCase = eventName.charAt(0).toUpperCase() + eventName.slice(1);
            
            // @ts-ignore
            if(Events[eventUpperCase] === undefined){
                client.on(eventName, event.bind(null, client)).setMaxListeners(0);
            } else {
                // @ts-ignore
                client.on(Events[eventUpperCase], event.bind(null, client)).setMaxListeners(0);
            }
        };
    });
}