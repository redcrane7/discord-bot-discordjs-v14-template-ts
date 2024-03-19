import ticketModel from "../../database/models/tickets";
import ticketChannelsModel from "../../database/models/ticketChannels";

module.exports = async (client: any, interaction: any, args: any) => {
  ticketChannelsModel.findOne(
    { Guild: interaction.guild.id, channelID: interaction.channel.id },
    async (err: any, ticketData: any) => {
      if (ticketData) {
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
                    type: "editreply",
                  },
                  interaction
                );
              }

              if (interaction.channel.parentId == ticketCategory.id) {
                client
                  .embed(
                    {
                      desc: `${client.emotes.animated.loading}・Loading information...`,
                      type: "editreply",
                    },
                    interaction
                  )
                  .then((msg: any) => {
                    client.transcript(interaction, interaction.channel);

                    return client.embed(
                      {
                        title: `ℹ・Information`,
                        fields: [
                          {
                            name: "Ticket name",
                            value: `\`${interaction.channel.name}\``,
                            inline: true,
                          },
                          {
                            name: "Channel id",
                            value: `\`${interaction.channel.id}\``,
                            inline: true,
                          },
                          {
                            name: "Creator",
                            value: `<@!${ticketData.creator}>`,
                            inline: true,
                          },
                          {
                            name: "Claimed by",
                            value: `<@!${ticketData.claimed}>`,
                            inline: true,
                          },
                          {
                            name: "Ticket id",
                            value: `${ticketData.TicketID}`,
                            inline: true,
                          },
                        ],
                        type: "editreply",
                      },
                      msg
                    );
                  });
              } else {
                client.errNormal(
                  {
                    error: "This is not a ticket!",
                    type: "editreply",
                  },
                  interaction
                );
              }
            } else {
              return client.errNormal(
                {
                  error: "Do the setup!",
                  type: "editreply",
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