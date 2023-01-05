const { model, Schema } = require("mongoose");

module.exports = model(
    "Bank",
    new Schema({
        user_id: String,
        cash: Number,
        bank: Number,
        bid_amount: Number
    })
);