const { model, Schema } = require("mongoose");

module.exports = model(
    "Tickets",
    new Schema({
        guild_id: String,
        member_id: String,
        ticket_id: String,
        channel_id: String,
        closed: Boolean,
        locked: Boolean,
        type: String,
    })
);