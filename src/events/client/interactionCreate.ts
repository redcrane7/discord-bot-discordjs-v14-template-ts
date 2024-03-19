import { join } from 'path';

module.exports = async (client: any, interaction: any) => {
    console.log(interaction.customId)
    // Tickets
    if (interaction.customId == "Bot_openticket") {
        return require(join(__dirname, `../../commands/tickets/create.js`))(client, interaction);
    }

    if (interaction.customId == "Bot_closeticket") {
        return require(join(__dirname, `../../commands/tickets/close.js`))(client, interaction);
    }

    if (interaction.customId == "Bot_transcriptTicket") {
        return require(join(__dirname, `../../commands/tickets/transcript.js`))(client, interaction);
    }

    if (interaction.customId == "Bot_claimTicket") {
        return require(join(__dirname, `../../commands/tickets/claim.js`))(client, interaction);
    }

    if (interaction.customId == "Bot_openticket") {
        return require(join(__dirname, `../../commands/tickets/open.js`))(client, interaction);
    }

    if (interaction.customId == "Bot_deleteTicket") {
        return require(join(__dirname, `../../commands/tickets/delete.js`))(client, interaction);
    }

    if (interaction.customId == "Bot_noticeTicket") {
        return require(join(__dirname, `../../commands/tickets/notice.js`))(client, interaction);
    }
    
    if (interaction.commandName == "tickets") {
        if (interaction.options.getSubcommand() == 'add') {
            return require(join(__dirname, `../../commands/tickets/add.js`))(client, interaction);
        }
        if (interaction.options.getSubcommand() == 'remove') {
            return require(join(__dirname, `../../commands/tickets/remove.js`))(client, interaction);
        }
    }
    else if (interaction.commandName == "setup") {
        if (interaction.options.getSubcommand() == "tickets") {
            return require(join(__dirname, `../../commands/setup/tickets.js`))(client, interaction);
        } else if (interaction.options.getSubcommand() == "ticketpanel") {
            return require(join(__dirname, `../../commands/setup/ticketpanel.js`))(client, interaction);
        }
    }
}

 