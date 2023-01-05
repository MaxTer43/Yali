const { model, Schema } = require("mongoose");

module.exports = model(
    "Schedules",
    new Schema({
        date: Date,
        content: String,
        channel_id: String,
        bump: Boolean
    })
);