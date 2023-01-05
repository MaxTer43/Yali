const { model, Schema } = require("mongoose");

module.exports = model(
    "work_schedule",
    new Schema({
        user_id: String,
        date: Date,
        reminder: Boolean,
    })
);