import * as Discord from 'discord.js';

import ticketModel from "../../database/models/tickets";

module.exports = async (client: any, interaction: any, args: any) => {
    const options = {
        tickets: ticketModel,
    } as any;

    const choice = interaction.options.getString('setup');

    await options[choice].findOneAndDelete({ Guild: interaction.guild.id });

    await client.succNormal({ 
        text: `Setup successfully deleted!`,
        type: 'editreply'
    }, interaction);
}

 