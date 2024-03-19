import {
  PermissionsBitField,
} from 'discord.js';

import ticketModel from "../../database/models/tickets";
import ticketChannelsModel from "../../database/models/ticketChannels";

module.exports = async (client: any, interaction: any, args: any) => {
  const data = await ticketModel.findOne({ Guild: interaction.guild.id });
  const ticketData = await ticketChannelsModel.findOne({
    Guild: interaction.guild.id,
    channelID: interaction.channel.id,
  });

  const perms = await client.checkUserPerms(
    {
      flags: [PermissionsBitField.Flags.ManageMessages],
      perms: [PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  if (data) {
    const ticketCategory = interaction.guild.channels.cache.get(data.Category);
    if (ticketCategory == undefined) {
      return client.errNormal(
        {
          error: "Do the ticket setup!",
          type: "reply",
        },
        interaction
      );
    }

    if (interaction.channel.parentId == ticketCategory.id) {
      let user = interaction.options.getUser("user");
      if (ticketData && user.id == ticketData.creator) {
        return client.errNormal(
          {
            error: "You cannot remove the ticket maker from this ticket",
            type: "ephemeraledit",
          },
          interaction
        );
      }

      interaction.channel.permissionOverwrites.edit(user.id, {
        ViewChannel: false,
        SendMessages: false,
      });

      return client.simpleEmbed(
        {
          desc: `Removed ${user}`,
          type: "reply",
        },
        interaction
      );
    } else {
      client.errNormal(
        {
          error: "This is not a ticket!",
          type: "editreply",
        },
        interaction
      );
    }
  }
};