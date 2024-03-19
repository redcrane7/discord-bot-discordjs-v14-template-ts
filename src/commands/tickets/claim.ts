import {
    PermissionsBitField,
  } from 'discord.js';
  
import ticketModel from "../../database/models/tickets";
import ticketChannelsModel from "../../database/models/ticketChannels";

module.exports = async (client: any, interaction: any, args: any) => {
    const data = await ticketModel.findOne({ Guild: interaction.guild.id });
    const ticketData = await ticketChannelsModel.findOne({ Guild: interaction.guild.id, channelID: interaction.channel.id })

    let type = 'reply';
    if (interaction.isCommand()) type = 'editreply';
    
    if (ticketData) {
        if (interaction.user.id !== ticketData.creator) {
            const perms = await client.checkUserPerms({
                flags: [PermissionsBitField.Flags.ManageMessages],
                perms: [PermissionsBitField.Flags.ManageMessages]
            }, interaction)

            if (perms == false) return;

            if (data) {
                if (ticketData.claimed == "" || ticketData.claimed == undefined || ticketData.claimed == "None") {
                    const ticketCategory = interaction.guild.channels.cache.get(data.Category);

                    if (ticketCategory == undefined) {
                        return client.errNormal({
                            error: "Do the ticket setup!",
                            type: type
                        }, interaction)
                    }

                    if (interaction.channel.parentId == ticketCategory.id) {

                        ticketData.claimed = interaction.user.id;
                        ticketData.save();

                        return client.simpleEmbed({
                            desc: `You will now be assisted by <@!${interaction.user.id}>`,
                            type: type
                        }, interaction)

                    }
                    else {
                        client.errNormal({
                            error: "This is not a ticket!",
                            type: type
                        }, interaction)
                    }
                }
                else {
                    client.errNormal({
                        error: "Ticket has already been claimed!",
                        type: 'ephemeral'
                    }, interaction)
                }
            }
            else {
                return client.errNormal({
                    error: "Do the ticket setup!",
                    type: type
                }, interaction)
            }
        }
        else {
            return client.errNormal({
                error: "You are not allowed to claim your own ticket!",
                type: 'ephemeral'
            }, interaction)
        }
    }
}

 