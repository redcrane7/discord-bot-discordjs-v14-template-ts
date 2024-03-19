import {
    PermissionsBitField,
  } from 'discord.js';
  
import ticketModel from "../../database/models/tickets";
import ticketChannelsModel from "../../database/models/ticketChannels";

module.exports = async (client: any, interaction: any, args: any) => {
    const perms = await client.checkUserPerms({
        flags: [PermissionsBitField.Flags.ManageMessages],
        perms: [PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    let type = 'reply';
    if (interaction.isCommand()) type = 'editreply';

    ticketChannelsModel.findOne({ Guild: interaction.guild.id, channelID: interaction.channel.id }, async (err: any, ticketData: any) => {
        if (ticketData) {
            if (interaction.user.id !== ticketData.creator) {
                ticketModel.findOne({ Guild: interaction.guild.id }, async (err: any, data: any) => {
                    if (data) {
                        const ticketCategory = interaction.guild.channels.cache.get(data.Category);

                        if (ticketCategory == undefined) {
                            return client.errNormal({
                                error: "Do the setup!",
                                type: type
                            }, interaction);
                        }

                        if (interaction.channel.parentId == ticketCategory.id) {
                            client.simpleEmbed({
                                desc: `Hey <@!${ticketData.creator}>, \n\nCan we still help you? \nIf there is no response within **24 hours**, we will close this ticket \n\n- Team ${interaction.guild.name}`,
                                content: `<@!${ticketData.creator}>`,
                                type: type
                            }, interaction)
                        }
                        else {
                            client.errNormal({
                                error: "This is not a ticket!",
                                type: type
                            }, interaction);

                        }
                    }
                    else {
                        return client.errNormal({
                            error: "Do the setup!",
                            type: type
                        }, interaction);
                    }
                })
            }
            else {
                return client.errNormal({
                    error: "You are not allowed to notice your own ticket!",
                    type: 'ephemeral'
                }, interaction)
            }
        }
    })
}

 