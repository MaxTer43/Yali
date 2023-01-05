const {
    CommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/trait");

module.exports = {
    name: "addtrait",
    description: "Adds trait",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "trait",
            description: "Trait",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
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
            name: "type",
            description: "Type",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Arms",
                    value: "Arms",
                },
                {
                    name: "Ears",
                    value: "Ears",
                },
                {
                    name: "Eyes",
                    value: "Eyes",
                },
                {
                    name: "Head",
                    value: "Head",
                },
                {
                    name: "Misc",
                    value: "Misc",
                },
                {
                    name: "Neck",
                    value: "Neck",
                },
                {
                    name: "Tails",
                    value: "Tails",
                },
            ],
        },
        {
            name: "rarity",
            description: "Rarity",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Common",
                    value: "Common",
                },
                {
                    name: "Uncommon",
                    value: "Uncommon",
                },
                {
                    name: "Rare",
                    value: "Rare",
                },
                {
                    name: "Legendary",
                    value: "Legendary",
                },
            ],
        },
        {
            name: "url",
            description: "Link to the image",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const trait = interaction.options.getString('trait');
        const specie = interaction.options.getString('specie');
        const type = interaction.options.getString('type');
        const frequency = interaction.options.getString('rarity');
        const url = interaction.options.getString('url');
        console.log("A trait has been added."
        +"\nTrait: " + trait
        +"\nSpecie: " + specie
        +"\nType: " + type
        +"\nRarity: " + frequency
        +"\nURL: " + url);
        await DB.create({
            trait: trait,
            specie: specie,
            type: type,
            frequency: frequency,
            url: url,
        });
        return await interaction.reply({content: "Trait added"})
    }
}