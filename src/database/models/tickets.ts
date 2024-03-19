import { Schema, model } from "mongoose";

const TicketSchema = new Schema({
    Guild: String,
    Category: String,
    Role: String,
    Channel: String,
    Logs: String,
    TicketCount: { type: Number, default: 0 },
});

const TicketModel = model("ticket", TicketSchema)

export default TicketModel