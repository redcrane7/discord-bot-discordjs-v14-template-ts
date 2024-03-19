import { PermissionsBitField } from "discord.js";
import ticketModel from "../../database/models/tickets";

module.exports = async (client: any, interaction: any, args: any) => {
    const data = await ticketModel.findOne({ Guild: interaction.guild.id });

    const perms = await client.checkUserPerms({
        flags: [PermissionsBitField.Flags.ManageMessages],
        perms: [PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    if (data) {
        const ticketCategory = interaction.guild.channels.cache.get(data.Category);
        if (ticketCategory == undefined) {
            return client.errNormal({
                error: "Do the ticket setup!",
                type: 'reply'
            }, interaction)
        }

        if (interaction.channel.parentId == ticketCategory.id) {
            let user = interaction.options.getUser('user');
            interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true });

            return client.simpleEmbed({
                desc: `Added ${user}`,
                type: 'reply'
            }, interaction)
        }
        else {
            client.errNormal({
                error: "This is not a ticket!",
                type: 'reply'
            }, interaction)
        }
    }
}