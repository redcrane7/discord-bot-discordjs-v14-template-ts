import { Schema, model } from "mongoose";

const TicketChannelsSchema = new Schema({
    Guild: String,
    TicketID: Number,
    channelID: String,
    creator: String,
    claimed: String,
    resolved: { type: Boolean, default: false }
});

const TicketChannelModel = model("ticketChannel", TicketChannelsSchema);

export default TicketChannelModel