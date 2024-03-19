import { Schema, model } from "mongoose";

const TicketMessageSchema = new Schema({
    Guild: String,
    openTicket: String,
    dmMessage: String
});

const TicketMessageModel = model("ticketMessage", TicketMessageSchema);

export default TicketMessageModel