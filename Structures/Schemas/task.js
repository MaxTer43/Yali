const { model, Schema } = require("mongoose");

module.exports = model(
    "Tasks",
    new Schema({
        task: String,
        type: String
    })
);