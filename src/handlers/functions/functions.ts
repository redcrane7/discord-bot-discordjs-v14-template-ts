import {
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType
} from 'discord.js';
  
import FunctionsModel from "../../database/models/functions";

module.exports = async (client: any) => {
    //----------------------------------------------------------------//
    //                         Permissions                            //
    //----------------------------------------------------------------//
    // All bitfields to name
    client.bitfieldToName = function (bitfield: any) {
        const permissions = new PermissionsBitField(bitfield);
        return permissions.toArray();
    }
    client.checkPerms = async function ({
        flags: flags,
        perms: perms
    }: any, interaction: any) {
        for (let i = 0; i < flags.length; i++) {
            if (!interaction.member.permissions.has(flags[i])) {
                client.errMissingPerms({
                    perms: client.bitfieldToName(flags[i]) || flags[i],
                    type: 'editreply'
                }, interaction);

                return false
            }
            if (!interaction.guild.members.me.permissions.has(flags[i])) {
                client.errNoPerms({
                    perms: client.bitfieldToName(flags[i]) || flags[i],
                    type: 'editreply'
                }, interaction);

                return false
            }
        }
    }
    client.checkBotPerms = async function ({
        flags: flags,
        perms: perms
    }: any, interaction: any) {
        for (let i = 0; i < flags.length; i++) {
             if (!interaction.guild.members.me.permissions.has(flags[i])) {
                client.errNoPerms({
                    perms: client.bitfieldToName(flags[i]) || flags[i],
                    type: 'editreply'
                }, interaction);

                return false
            }
        }
    }
    client.checkUserPerms = async function ({
        flags: flags,
        perms: perms
    }: any, interaction: any) {
        for (let i = 0; i < flags.length; i++) {
            if (!interaction.member.permissions.has(flags[i])) {
                client.errMissingPerms({
                    perms: client.bitfieldToName(flags[i]) || flags[i],
                    type: 'editreply'
                }, interaction);

                return false
            }
        }
    }

    client.getChannel = function (channel: any, message: any) {
        return message.mentions.channels.first() || message.guild.channels.cache.get(channel) || message.guild.channels.cache.find((c: any) => c.name == channel);
    }

    client.removeMentions = function (str: any) {
        return str.replaceAll('@', '@\u200b');
    }

    client.loadSubcommands = async function (client: any, interaction: any, args: any) {
        try {
            const data = await FunctionsModel.findOne({ Guild: interaction.guild.id });

            if (data?.Beta == true) {
                return require(`${process.cwd()}/src/commands/${interaction.commandName}/${interaction.options.getSubcommand()}-beta`)(client, interaction, args).catch((err: any) => {
                    client.emit("errorCreate", err, interaction.commandName, interaction)
                })
            }
            else {
                return require(`${process.cwd()}/src/commands/${interaction.commandName}/${interaction.options.getSubcommand()}`)(client, interaction, args).catch((err: any) => {
                    client.emit("errorCreate", err, interaction.commandName, interaction)
                })
            }
        }
        catch {
            return require(`${process.cwd()}/src/commands/${interaction.commandName}/${interaction.options.getSubcommand()}`)(client, interaction, args).catch((err: any) => {
                client.emit("errorCreate", err, interaction.commandName, interaction)
            })
        }
    }

    client.generateEmbed = async function (start: any, end: any, lb: any, title: any, interaction: any) {
        const current = lb.slice(start, end + 10);
        const result = current.join("\n");

        let embed = client.templateEmbed()
            .setTitle(`${title}`)
            .setDescription(`${result.toString()}`)

        const functiondata = await FunctionsModel.findOne({ Guild: interaction.guild.id });

        if (functiondata && functiondata.Color) {
            embed.setColor(functiondata.Color)
        }

        return embed;
    }

    client.createLeaderboard = async function (title: any, lb: any, interaction: any) {
        interaction.editReply({ embeds: [await client.generateEmbed(0, 0, lb, title, interaction)], fetchReply: true }).then(async (msg: any) => {
            if (lb.length <= 10) return;

            let button1 = new ButtonBuilder()
                .setCustomId('back_button')
                .setEmoji('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);

            let button2 = new ButtonBuilder()
                .setCustomId('forward_button')
                .setEmoji('➡️')
                .setStyle(ButtonStyle.Primary);

            let row = new ActionRowBuilder()
                .addComponents(button1, button2);

            msg.edit({ embeds: [await client.generateEmbed(0, 0, lb, title, interaction)], components: [row] })

            let currentIndex = 0;
            const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (btn: any) => {
                if (btn.user.id == interaction.user.id && btn.message.id == msg.id) {
                    btn.customId === "back_button" ? currentIndex -= 10 : currentIndex += 10;

                    let btn1 = new ButtonBuilder()
                        .setCustomId('back_button')
                        .setEmoji('⬅️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true);

                    let btn2 = new ButtonBuilder()
                        .setCustomId('forward_button')
                        .setEmoji('➡️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true);

                    if (currentIndex !== 0) btn1.setDisabled(false);
                    if (currentIndex + 10 < lb.length) btn2.setDisabled(false);

                    let row2 = new ActionRowBuilder()
                        .addComponents(btn1, btn2);

                    msg.edit({ embeds: [await client.generateEmbed(currentIndex, currentIndex, lb, title, interaction)], components: [row2] });
                    btn.deferUpdate();
                }
            })

            collector.on('end', async (btn: any) => {
                let btn1Disable = new ButtonBuilder()
                    .setCustomId('back_button')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);

                let btn2Disable = new ButtonBuilder()
                    .setCustomId('forward_button')
                    .setEmoji('➡️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);

                let rowDisable = new ActionRowBuilder()
                    .addComponents(btn1Disable, btn2Disable);

                msg.edit({ embeds: [await client.generateEmbed(currentIndex, currentIndex, lb, title, interaction)], components: [rowDisable] });
            })
        })
    }
}

 