const {
    ApplicationCommandOptionType,
    CommandInteraction,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/trait");

module.exports = {
    name: "deletetrait",
    description: "Deletes a trait",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "specie",
            description: "Specie",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Noluo",
                    value: "Noluo",
                },
                {
                    name: "Rinjac",
                    value: "Rinjac",
                },
            ],

        },
        {
            name: "index",
            description: "Trait index from a specie",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { channel } = interaction;
        const indexNum = interaction.options.getInteger('index');
        const specie = interaction.options.getString('specie');
        var secondIndex = 0;
        if (indexNum < 0){
            return interaction.reply("Nothing is here");
        }

        const doc = await DB.find({specie: specie });
        if (doc == null)
            return interaction.reply("Nothing is here.");

        let list = [];
        let trait = [];
        doc.forEach((t) =>
            list.push(t._id.toString()),
        );
        doc.forEach((t) =>
            trait.push(t.trait.toString()),
        );
        if (list.length <= indexNum || indexNum < 0)
            return interaction.reply({content: "Nothing is here."})


        await DB.findByIdAndDelete({_id: list[indexNum].toString()});
        await interaction.reply({content: "Trait " + indexNum + " from " + specie + "s deleted."});
    }
}