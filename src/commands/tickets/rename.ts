import {
  PermissionsBitField,
} from 'discord.js';

import ticketModel from "../../database/models/tickets";

module.exports = async (client: any, interaction: any, args: any) => {
  const data = await ticketModel.findOne({ Guild: interaction.guild.id });

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
          type: "editreply",
        },
        interaction
      );
    }

    if (interaction.channel.parentId == ticketCategory.id) {
      let name = interaction.options.getString("name");
      interaction.channel.edit({ name: name });

      return client.simpleEmbed(
        {
          desc: `Channel name has changed to ${name}`,
          type: "editreply",
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
