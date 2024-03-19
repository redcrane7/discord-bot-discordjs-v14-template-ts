import ticketModel from "../../database/models/tickets";

module.exports = async (client: any, interaction: any, args: any) => {
    const category = interaction.options.getChannel('category');
    const role = interaction.options.getRole('role');
    const channel = interaction.options.getChannel('channel');
    const logs = interaction.options.getChannel('logs');
    
    ticketModel.findOne({ Guild: interaction.guildId }, async (err: any, data: any) => {
        console.log(data)
        if (data) {
            data.Category = category.id;
            data.Role = role.id;
            data.Channel = channel.id;
            data.Logs = logs.id;
            data.save();
        }
        else {
            new ticketModel({
                Guild: interaction.guildId,
                Category: category.id,
                Role: role.id,
                Channel: channel.id,
                Logs: logs.id
            }).save();
        }
    })

    client.succNormal({
        text: `Tickets has been set up successfully!`,
        type: 'reply'
    }, interaction);
}

 