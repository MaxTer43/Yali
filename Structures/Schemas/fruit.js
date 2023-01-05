const { model, Schema } = require("mongoose");

module.exports = model(
    "Fruits",
    new Schema({
        fruit: String, //Name of fruit
        place: String, //Name of place
        url: String //Link to image
    })
);