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

  ticketModel.findOne({ Guild: interaction.guild.id }, async (err: any, data: any) => {
    if (data) {
      const ticketCategory = interaction.guild.channels.cache.get(
        data.Category
      );

      if (ticketCategory == undefined) {
        return client.errNormal(
          {
            error: "Do the ticket setup!",
            type: type,
          },
          interaction
        );
      }

      if (interaction.channel.parentId == ticketCategory.id) {
        client
          .simpleEmbed(
            {
              desc: `Delete this ticket in **5s**`,
              type: type,
            },
            interaction
          )
          .then((msg: any) =>
            setTimeout(() => {
              interaction.channel.delete();
              ticketChannelsModel.findOne(
                {
                  Guild: interaction.guild.id,
                  channelID: interaction.channel.id,
                },
                async (err: any, data: any) => {
                  if (data) {
                    var remove = await ticketChannelsModel.deleteOne({
                      Guild: interaction.guild.id,
                      channelID: interaction.channel.id,
                    });
                  }
                }
              );
            }, 5000)
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
          error: "Do the ticket setup!",
          type: type,
        },
        interaction
      );
    }
  });
};