import {
  PermissionsBitField,
} from 'discord.js';

import ticketModel from "../../database/models/tickets";
import ticketChannelsModel from "../../database/models/ticketChannels";

module.exports = async (client: any, interaction: any, args: any) => {
  const perms = await client.checkUserPerms(
    {
      flags: [PermissionsBitField.Flags.ManageMessages],
      perms: [PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  let type = "reply";
  if (interaction.isCommand()) type = "editreply";

  ticketChannelsModel.findOne(
    { Guild: interaction.guild.id, channelID: interaction.channel.id },
    async (err: any, ticketData: any) => {
      if (ticketData) {
        if (ticketData.resolved == false)
          return client.errNormal(
            {
              error: "Ticket is already open!",
              type: "ephemeraledit",
            },
            interaction
          );

          ticketModel.findOne(
          { Guild: interaction.guild.id },
          async (err: any, data: any) => {
            if (data) {
              const ticketCategory = interaction.guild.channels.cache.get(
                data.Category
              );

              if (ticketCategory == undefined) {
                return client.errNormal(
                  {
                    error: "Do the setup!",
                    type: type,
                  },
                  interaction
                );
              }

              if (interaction.channel.parentId == ticketCategory.id) {
                client.users.fetch(ticketData.creator).then((usr: any) => {
                  interaction.channel.permissionOverwrites.edit(usr, {
                    ViewChannel: true,
                    SendMessages: true,
                    AttachFiles: true,
                    ReadMessageHistory: true,
                    AddReactions: true,
                  });

                  var ticketid = String(ticketData.TicketID).padStart(4, '0');
                  interaction.channel.setName(`ticket-${ticketid}`);
                });

                ticketData.resolved = false;
                ticketData.save();

                return client.simpleEmbed(
                  {
                    desc: `Ticket opened by <@!${interaction.user.id}>`,
                    type: type,
                  },
                  interaction
                );
              } else {
                client.errNormal(
                  {
                    error: "This is not a ticket!",
                    type: type,
                  },
                  interaction
                );
              }
            } else {
              return client.errNormal(
                {
                  error: "Do the setup!",
                  type: type,
                },
                interaction
              );
            }
          }
        );
      }
    }
  );
};