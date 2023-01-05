const {
    CommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/fruit");

module.exports = {
    name: "addfruit",
    description: "Adds fruit",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "fruit",
            description: "Fruit",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "place",
            description: "Place",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Blue Forest",
                    value: "Blue Forest",
                },
                {
                    name: "Light Temple",
                    value: "Light Temple",
                },
                {
                    name: "Caves",
                    value: "Caves",
                },
                {
                    name: "Mountains",
                    value: "Mountains",
                },
                {
                    name: "Desert",
                    value: "Desert",
                },
                {
                    name: "Islands",
                    value: "Islands",
                },
            ],
        },
        {
            name: "url",
            description: "URL",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const fruit = interaction.options.getString('fruit');
        const place = interaction.options.getString('place');
        const url = interaction.options.getString('url');
        console.log("A fruit has been added."
        +"\nFruit: " + fruit
        +"\nPlace: " + place
        +"\nURL: " + url);
        try {
            await DB.create({
                fruit: fruit,
                place: place,
                url: url,
            });
            await interaction.reply({content: "Fruit added"});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "The database is probably offline."});
        }
    }
}