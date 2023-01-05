const {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    EmbedBuilder,
    CommandInteraction,
    Client,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/trait");

module.exports = {
    name: "head",
    description: "Random head trait",
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
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const specie = interaction.options.getString('specie');
        try {
            const doc = await DB.find({specie: specie, type: 'Head'});
            if (doc.length === 0){
                return interaction.reply("I don't have anything in the database for this.");
            }

            let list = [];
            let trait = [];
            let frequency = [];
            let url = [];

            doc.forEach((t) =>
                list.push(t._id.toString()),
            );
            doc.forEach((t) =>
                trait.push(t.trait.toString()),
            );
            doc.forEach((t) =>
                frequency.push(t.frequency.toString()),
            );
            doc.forEach((t) =>
                url.push(t.url.toString()),
            );

            const random = Math.floor(Math.random() * list.length);
            const Embed = new EmbedBuilder()
                .setColor(0x3498db)
                .addFields([
                    { name: `Trait`, value: trait[random] },
                    { name: `Specie`, value: specie },
                    { name: `Rarity`, value: frequency[random] },
                    { name: `URL`, value: url[random] },
            ])
            .setThumbnail(url[random]);

            await interaction.reply({ content: "You got a trait.", embeds: [Embed]});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "The database is probably offline."});
        }
    }
}