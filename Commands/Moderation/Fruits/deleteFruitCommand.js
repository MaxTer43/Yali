const {
    ApplicationCommandOptionType,
    CommandInteraction,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/fruit");

module.exports = {
    name: "deletefruit",
    description: "Deletes a fruit",
    permission: PermissionsBitField.Administrator,
    options: [
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
            name: "index",
            description: "Fruit index from a place",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const indexNum = interaction.options.getInteger('index');
            const place = interaction.options.getString('place');
            var secondIndex = 0;
            if (indexNum < 0){
                return interaction.reply("Nothing is here");
            }

            const doc = await DB.find({Place: place });
            if (doc == null)
                return interaction.reply("Nothing is here.");

            let list = [];
            let fruit = [];
            doc.forEach((t) =>
                list.push(t._id.toString()),
            );
            doc.forEach((t) =>
                fruit.push(t.Fruit.toString()),
            );
            if (list.length <= indexNum || indexNum < 0)
                return interaction.reply({content: "Nothing is here."})


            await DB.findByIdAndDelete({_id: list[indexNum].toString()});
            await interaction.reply({content: "Fruit " + indexNum + " from " + place + " deleted."});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}