const {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/fruit");

module.exports = {
    name: "fruitlist",
    description: "Shows list of fruits",
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
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { channel } = interaction;
        const place_name = interaction.options.getString('place');
        const doc = await DB.find({ place: place_name });
        if (doc == null || doc.length == 0)
            return interaction.reply("Nothing is here");
        
        let fruit = [];
        let place = [];
        let url = [];

        let listing = [];

        doc.forEach((t) => fruit.push(t.fruit.toString()),);
        doc.forEach((t) => place.push(t.place.toString()),);
        doc.forEach((t) => url.push(t.url.toString()),);
        var j = 0;
        var k = 0;
        for (var i = 0; i < fruit.length; i++){
            if (place[i] == place_name){
                listing[j] = k + ". ";
                listing[j+1] = "Fruit: " + fruit[i];
                listing[j+2] = "URL: " + url[i];
                j+=3;
                k+=1;
            }
        }

        let partial = [];
        k = 0;
        const Embed = new EmbedBuilder()
        .setColor("BLACK")
        for (var i = 0; i < listing.length; i++){
            partial[k] = listing[i]
            if (listing.length < 150 && i+1 == listing.length){
                var page = partial.join('\n');
                Embed.setTitle("All fruits from " + place_name);
                Embed.setDescription(page);
                await interaction.reply({ embeds: [Embed]});
                k = -1;
            }
            else if (i+1 == 150){
                var page = partial.join('\n');
                Embed.setTitle("All fruits from " + place_name);
                Embed.setDescription(page);
                await interaction.reply({ embeds: [Embed]});;
                k = -1;
                partial = null;
                partial = [];
            }
            else if (i > 150 && (i+1)%150 == 0){
                var page = partial.join('\n');
                Embed.setTitle(" ");
                Embed.setDescription(page);
                await channel.send({ embeds: [Embed] })
                k = -1;
                partial = null;
                partial = [];
            }
            else if (i + 1 == listing.length){
                var page = partial.join('\n');
                Embed.setTitle(" ");
                Embed.setDescription(page);
                await channel.send({ embeds: [Embed] })
                partial = null;
                partial = [];
            }
            k+=1;
        }
    }
}