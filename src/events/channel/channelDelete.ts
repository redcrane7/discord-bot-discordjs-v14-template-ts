import ticketChannelsModel from "../../database/models/ticketChannels";

module.exports = async (client: any, channel: any) => {
    let types = {
        0: "Text Channel",
        2: "Voice Channel",
        4: "Category",
        5: "News Channel",
        10: "News Thread",
        11: "Public Thread",
        12: "Private Thread",
        13: "Stage Channel",
        14: "Category",
    }
    
    const logsChannel = await client.getLogs(channel.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: `🔧・Channel deleted`,
        desc: `A channel has been deleted`,
        fields: [
            {
                name: `> Name`,
                value: `- ${channel.name}`
            },
            {
                name: `> ID`,
                value: `- ${channel.id}`
            },
            {
                name: `> Category`,
                value: `- ${channel.parent}`
            },
            {
                name: `> Type`,
                // @ts-ignore
                value: `- ${types[channel.type]}`
            }
        ]
    }, logsChannel).catch(() => { })

    try {
        ticketChannelsModel.findOne({ Guild: channel.guild.id, channelID: channel.id }, async (err: any, data: any) => {
            if (data) {
                var remove = await ticketChannelsModel.deleteOne({ Guild: channel.guild.id, channelID: channel.id });
            }
        })
    }
    catch { }
};