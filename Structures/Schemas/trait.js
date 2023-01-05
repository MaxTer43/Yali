const { model, Schema } = require("mongoose");

module.exports = model(
    "Traits",
    new Schema({
        trait: String, //Name of trait
        specie: String, //Specie
        type: String, //Horn, eye, mouth, etc
        frequency: String, //Common, rare, etc
        url: String //Link to image
    })
);