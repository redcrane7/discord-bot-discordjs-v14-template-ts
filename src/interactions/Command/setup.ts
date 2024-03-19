import { 
    SlashCommandBuilder,
    ChannelType,
    PermissionsBitField
} from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Manage the Bot setups')
        .addSubcommand(subcommand =>
            subcommand
                .setName('tickets')
                .setDescription('Setup the tickets')
                .addChannelOption(option => option.setName('category').setDescription('Select a category where the tickets should come in').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
                .addRoleOption(option => option.setName('role').setDescription('Select the support role').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('The channel for the ticket panel').setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addChannelOption(option => option.setName('logs').setDescription('The channel for the ticket logs').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticketpanel')
                .setDescription('Setup the ticket panel')
                .addStringOption(option => option.setName('name').setDescription('The name of the ticket panel').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('The description of the ticket panel').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletesetup')
                .setDescription('Delete a Bot setup')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Tickets', value: 'tickets' },
                        )
                )
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client: any, interaction: any, args: any) => {
        await interaction.deferReply({ fetchReply: true });
        const perms = await client.checkUserPerms({
            flags: [PermissionsBitField.Flags.Administrator],
            perms: [PermissionsBitField.Flags.Administrator]
        }, interaction)

        if (perms == false) return;

        client.loadSubcommands(client, interaction, args);
    },
};

 