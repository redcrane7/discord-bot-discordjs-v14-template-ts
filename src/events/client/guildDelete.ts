import {
    WebhookClient, 
    EmbedBuilder
} from 'discord.js'

import ticketModel from "../../database/models/tickets";
import ticketChannelsModel from "../../database/models/ticketChannels";
import ticketMessageModel from "../../database/models/ticketMessage";

module.exports = async (client: any, guild: any) => {
    const kickLogs = new WebhookClient({
        id: client.webhooks.serverLogs2.id,
        token: client.webhooks.serverLogs2.token,
    });

    if (guild.name == undefined) return;

    const promises = [
        client.shard.broadcastEval((client: any) => client.guilds.cache.size),
        client.shard.broadcastEval((client: any) => client.guilds.cache.reduce((acc: any, guild: any) => acc + guild.memberCount, 0)),
    ];
    Promise.all(promises)
        .then(async (results) => {
            const totalGuilds = results[0].reduce((acc: any, guildCount: any) => acc + guildCount, 0);

            const embed = new EmbedBuilder()
                .setTitle("🔴・Removed from a server!")
                .addFields(
                    { name: "Total servers:", value: `${totalGuilds}`, inline: true },
                    { name: "Server name", value: `${guild.name}`, inline: true },
                    { name: "Server ID", value: `${guild.id}`, inline: true },
                    { name: "Server members", value: `${guild.memberCount}`, inline: true },
                    { name: "Server owner", value: `<@!${guild.ownerId}> (${guild.ownerId})`, inline: true },
                )
                .setThumbnail("https://cdn.discordapp.com/attachments/843487478881976381/852419424895631370/BotSadEmote.png")
                .setColor(client.config.colors.normal)
            kickLogs.send({
                username: 'Bot Logs',
                avatarURL: client.user.avatarURL(),
                embeds: [embed],
            });
        })

        await ticketChannelsModel.deleteMany({ Guild: guild.id });
        await ticketMessageModel.deleteMany({ Guild: guild.id });
        await ticketModel.deleteMany({ Guild: guild.id });
};