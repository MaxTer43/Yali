const { model, Schema } = require("mongoose");

module.exports = model(
    "Auction",
    new Schema({
        auction_id: Number,
        sb: Number,
        mi: Number,
        ab: Number,
        starting_date: Date,
        expiration_date: Date,
        image: String,
        description: String,
        currency: String,
        cb: Number,
        highest_bidder: String,
        message_id: String,
        posted: Boolean
    })
);