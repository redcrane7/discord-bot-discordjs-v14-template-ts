import * as Discord from 'discord.js';

import ticketModel from "../../database/models/tickets";

module.exports = async (client: any, interaction: any, args: any) => {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');

    const ticketData = await ticketModel.findOne({ Guild: interaction.guild.id })
    if (ticketData) {
        const channel = interaction.guild.channels.cache.get(ticketData.Channel);
        const button = new Discord.ButtonBuilder()
            .setCustomId('Bot_openticket')
            .setLabel(name)
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('🎫')

        const row = new Discord.ActionRowBuilder()
            .addComponents(button)

        await client.embed({
            title: name,
            desc: description,
            components: [row]
        }, channel)

        return await client.succNormal({
            text: `Ticket panel has been set up successfully!`,
            type: 'reply'
        }, interaction);
    }
    else {
        return await client.errNormal({
            error: `Run the ticket setup first!`,
            type: 'reply'
        }, interaction);
    }
}

 