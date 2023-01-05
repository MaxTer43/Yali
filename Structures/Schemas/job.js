const { model, Schema } = require("mongoose");

module.exports = model(
    "Job",
    new Schema({
        job: String
    })
);