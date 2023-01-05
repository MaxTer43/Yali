const {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/trait");

module.exports = {
    name: "traitlist",
    description: "Shows list of traits",
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
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { channel } = interaction;
        const doc = await DB.find({}, {_id: false, trait: true, specie: true, type: true, frequency: true, url: true});
        if (doc == null || doc.length == 0)
            return interaction.reply("Nothing is here");
        
        let trait = [];
        var specie_name = interaction.options.getString('specie');
        let specie = [];
        let type = [];
        let frequency = [];
        let url = [];

        let listing = [];

        doc.forEach((t) =>
            trait.push(t.trait.toString()),
        );
        doc.forEach((t) =>
            specie.push(t.specie.toString()),
        );
        doc.forEach((t) =>
            type.push(t.type.toString()),
        );
        doc.forEach((t) =>
            frequency.push(t.frequency.toString()),
        );
        doc.forEach((t) =>
            url.push(t.url.toString()),
        );
        var j = 0;
        var k = 0;
        for (var i = 0; i < trait.length; i++){
            if (specie[i] == specie_name){
                listing[j] = k + ". ";
                listing[j+1] = "Trait: " + trait[i];
                listing[j+2] = "Type: " + type[i];
                listing[j+3] = "Rarity: " + frequency[i];
                listing[j+4] = "URL: " + url[i];
                j+=5;
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
                Embed.setTitle("All traits from " + specie_name + "s");
                Embed.setDescription(page);
                await interaction.reply({ embeds: [Embed]});
                k = -1;
            }
            else if (i+1 == 150){
                var page = partial.join('\n');
                Embed.setTitle("All traits from " + specie_name + "s");
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