import {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

import ticketModel from "../../database/models/tickets";
import ticketChannelsModel from "../../database/models/ticketChannels";
import ticketMessageModel from "../../database/models/ticketMessage";

module.exports = async (client: any, interaction: any, args: any) => {
  let reason = "Not given";
  if (interaction.options)
    reason = interaction.options.getString("reason") || "Not given";

  let type = "reply";
  if (interaction.isCommand()) type = "editreply";
  ticketChannelsModel.findOne(
    {
      Guild: interaction.guild.id,
      creator: interaction.user.id,
      resolved: false,
    },
    async (err: any, data: any) => {
      if (data) {
        if (interaction.isCommand()) {
          return client.errNormal(
            {
              error: "Ticket limit reached. 1/1",
              type: "ephemeraledit",
            },
            interaction
          );
        } else
          return client.errNormal(
            {
              error: "Ticket limit reached. 1/1",
              type: "ephemeral",
            },
            interaction
          );
      } else {
        ticketModel.findOne(
          { Guild: interaction.guild.id },
          async (err: any, TicketData: any) => {
            if (TicketData) {
              const logsChannel = interaction.guild.channels.cache.get(
                TicketData.Logs
              );
              const ticketCategory = interaction.guild.channels.cache.get(
                TicketData.Category
              );
              const ticketRole = interaction.guild.roles.cache.get(
                TicketData.Role
              );
              let role = interaction.guild.roles.cache.find(
                (r: any) => r.id === ticketRole.id
              );

              try {
                var openTicket =
                  "Thanks for creating a ticket! \nSupport will be with you shortly \n\n🔒 - Close ticket \n✋ - Claim ticket \n📝 - Save transcript \n🔔 - Send a notification";
                let ticketMessageData = await ticketMessageModel.findOne({
                  Guild: interaction.guild.id,
                });
                if (ticketMessageData) {
                  openTicket = ticketMessageData.openTicket || '';
                }

                const row = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("Bot_closeticket")
                    .setEmoji("🔒")
                    .setStyle(ButtonStyle.Primary),

                  new ButtonBuilder()
                    .setCustomId("Bot_claimTicket")
                    .setEmoji("✋")
                    .setStyle(ButtonStyle.Primary),

                  new ButtonBuilder()
                    .setCustomId("Bot_transcriptTicket")
                    .setEmoji("📝")
                    .setStyle(ButtonStyle.Primary),

                  new ButtonBuilder()
                    .setCustomId("Bot_noticeTicket")
                    .setEmoji("🔔")
                    .setStyle(ButtonStyle.Primary)
                );

                client
                  .embed(
                    {
                      title: `${client.emotes.animated.loading}・Progress`,
                      desc: `Your ticket is being created...`,
                      type: "ephemeral",
                    },
                    interaction
                  )
                  .then((msg: any) => {
                    if (TicketData.TicketCount) {
                      TicketData.TicketCount += 1;
                      TicketData.save();
                    } else {
                      TicketData.TicketCount = 1;
                      TicketData.save();
                    }

                    if (ticketCategory == undefined) {
                      return client.errNormal(
                        {
                          error: "Do the setup!",
                          type: type,
                        },
                        interaction
                      );
                    } else {
                      let category = interaction.guild.channels.cache.find(
                        (c: any) => c.id === ticketCategory.id
                      );

                      let permsToHave = [
                        PermissionsBitField.Flags.AddReactions,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.AttachFiles,
                        PermissionsBitField.Flags.ReadMessageHistory,
                      ];

                      var ticketid = String(TicketData.TicketCount).padStart(
                        4,
                        '0'
                      );

                      interaction.guild.channels
                        .create({
                          name: `ticket-${ticketid}`,
                          permissionOverwrites: [
                            {
                              deny: [
                                PermissionsBitField.Flags.ViewChannel,
                              ],
                              id: interaction.guild.id,
                            },
                            {
                              allow: permsToHave,
                              id: interaction.user.id,
                            },
                            {
                              allow: permsToHave,
                              id: role.id,
                            },
                          ],
                          parent: category.id,
                        })
                        .then(async (channel: any) => {
                          client.embed(
                            {
                              title: `⚙️・System`,
                              desc: `Ticket has been created`,
                              fields: [
                                {
                                  name: "👤┆Creator",
                                  value: `${interaction.user}`,
                                  inline: true,
                                },
                                {
                                  name: "📂┆Channel",
                                  value: `${channel}`,
                                  inline: true,
                                },
                                {
                                  name: "⏰┆Created at",
                                  value: `<t:${(Date.now() / 1000).toFixed(
                                    0
                                  )}:f>`,
                                  inline: true,
                                },
                              ],
                              type: type,
                            },
                            interaction
                          );

                          new ticketChannelsModel({
                            Guild: interaction.guild.id,
                            TicketID: ticketid,
                            channelID: channel.id,
                            creator: interaction.user.id,
                            claimed: "None",
                          }).save();

                          if (logsChannel) {
                            client.embed(
                              {
                                title: `📝・Open ticket`,
                                desc: `A new ticket has been created`,
                                fields: [
                                  {
                                    name: "👤┆Creator",
                                    value: `${interaction.user.tag} (${interaction.user.id})`,
                                    inline: false,
                                  },
                                  {
                                    name: "📂┆Channel",
                                    value: `${channel.name} is found at ${channel}`,
                                    inline: false,
                                  },
                                  {
                                    name: "⏰┆Created at",
                                    value: `<t:${(Date.now() / 1000).toFixed(
                                      0
                                    )}:F>`,
                                    inline: false,
                                  },
                                ],
                              },
                              logsChannel
                            );
                          }

                          await client.embed(
                            {
                              desc: openTicket,
                              fields: [
                                {
                                  name: "👤┆Creator",
                                  value: `${interaction.user}`,
                                  inline: true,
                                },
                                {
                                  name: "📄┆Subject",
                                  value: `${reason}`,
                                  inline: true,
                                },
                                {
                                  name: "⏰┆Created at",
                                  value: `<t:${(Date.now() / 1000).toFixed(
                                    0
                                  )}:F>`,
                                  inline: true,
                                },
                              ],
                              components: [row],
                              content: `${interaction.user}, ${role}`,
                            },
                            channel
                          );
                        });
                    }
                  });
              } catch (err) {
                client.errNormal(
                  {
                    error: "Do the setup!",
                    type: type,
                  },
                  interaction
                );
                console.log(err);
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
}