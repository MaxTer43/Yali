const {
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/fruit");

module.exports = {
    name: "genfruit",
    description: "Generate a fruit from a place",
    options: [
        {
            name: "place",
            description: "Place",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Sunken Forest",
                    value: "Sunken Forest",
                },
                {
                    name: "Crooked Forest",
                    value: "Crooked Forest",
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
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { channel, guild, member } = interaction;
        const place_name = interaction.options.getString('place');

        try {
            const doc = await DB.find({place: place_name});
            if (doc.length === 0){
                await interaction.reply({content: "I don't have any fruits from " + place_name + " in the database"});
            }
            let list = [];
            let place = [];
            let url = [];
            doc.forEach((t) => list.push(t.fruit.toString()),);
            doc.forEach((t) => place.push(t.place.toString()),);
            doc.forEach((t) => url.push(t.url.toString()),);

            const random = Math.floor(Math.random() * list.length);
        
            console.log(`Fruit generated`);
            console.log(`Fruit: ` + list[random]);
            console.log(`Place: ` + place[random]);
            console.log(`URL: ` + url[random]);

            const Embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle("Fruit for " + member.user.tag)
                .addFields([
                    { name: `Fruit`, value: list[random] },
                    { name: `Place`, value: place[random] },
                    { name: `URL`, value: url[random] },
                ])
                .setThumbnail(url[random]);

            await interaction.reply({embeds: [Embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "The database is probably offline."});
        }
        
    }
}