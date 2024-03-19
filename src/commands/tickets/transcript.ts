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
                        return client.simpleEmbed({
                            desc: `${client.emotes.animated.loading}・Transcript saving...`,
                            type: type
                        }, interaction).then(async (editMsg: any) => {
                            client.transcript(interaction, interaction.channel).then(() => {

                                return client.simpleEmbed({
                                    desc: `Transcript saved`,
                                    type: 'editreply'
                                }, interaction)

                            })
                        });
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
    })
}

 