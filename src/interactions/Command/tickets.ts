import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tickets')
        .setDescription('Manage tickets in your server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to a ticket')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription('Claim a ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Close a ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('information')
                .setDescription('Information about a ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a ticket')
                .addStringOption(option => option.setName('reason').setDescription('Reason to open a ticket'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('notice')
                .setDescription('Send a notice to a ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('open')
                .setDescription('Reopen a ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user from a ticket')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('transcript')
                .setDescription('Transcript a ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription('Rename a ticket')
                .addStringOption(option => option.setName('name').setDescription('New ticket name').setRequired(true))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client: any, interaction: any, args: any) => {
        await interaction.deferReply({ fetchReply: true });
        client.loadSubcommands(client, interaction, args);
    },
};