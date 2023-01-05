const {
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/trait");

module.exports = {
    name: "gentraits",
    description: "Generate a specie with traits",
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
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { channel, member } = interaction;
        const specie = interaction.options.getString('specie');
        const frequency = interaction.options.getString('rarity');

        var doc;
        try {
            switch(frequency){
                case "Common":
                    doc = await DB.find(
                        {specie: specie, frequency: 'Common'}
                    );
                    break;
    
                case "Uncommon":
                    doc = await DB.find({
                        $or: [
                            {specie: specie, frequency: 'Common'},
                            {specie: specie, frequency: 'Uncommon'}
                        ]
                    });
                    break;
    
                case "Rare":
                    doc = await DB.find({
                        $or: [
                            {specie: specie, frequency: 'Common'},
                            {specie: specie, frequency: 'Uncommon'},
                            {specie: specie, frequency: 'Rare'}
                        ]
                    });
                    break;
    
                case "Legendary":
                    doc = await DB.find({
                        $or: [
                            {specie: specie, frequency: 'Common'},
                            {specie: specie, frequency: 'Uncommon'},
                            {specie: specie, frequency: 'Rare'},
                            {specie: specie, frequency: 'Legendary'}
                        ]
                    });
                    break;
            }
    
            let arms = [];
            let armsFrequency = [];
            let armsUrl = [];
    
            let ears = [];
            let earsFrequency = [];
            let earsUrl = [];
    
            let eyes = [];
            let eyesFrequency = [];
            let eyesUrl = [];
    
            let head = [];
            let headFrequency = [];
            let headUrl = [];
    
            let misc = [];
            let miscFrequency = [];
            let miscUrl = [];
    
            let neck = [];
            let neckFrequency = [];
            let neckUrl = [];
    
            let tail = [];
            let tailFrequency = [];
            let tailUrl = [];
    
            let trait = [];
            let type = [];
            let rarity = [];
            let url = [];
    
            doc.forEach((t) => trait.push(t.trait),);
            doc.forEach((t) => type.push(t.type),);
            doc.forEach((t) => rarity.push(t.frequency),);
            doc.forEach((t) => url.push(t.url),);
    
            for (var i = 0; i < doc.length; i++){
                switch(type[i]){
                    case "Arms":
                        arms.push(trait[i].toString());
                        armsFrequency.push(rarity[i].toString())
                        armsUrl.push(url[i].toString());
                        break;
    
                    case "Ears":
                        ears.push(trait[i].toString());
                        earsFrequency.push(rarity[i].toString())
                        earsUrl.push(url[i].toString());
                        break;
    
                    case "Eyes":
                        eyes.push(trait[i].toString());
                        eyesFrequency.push(rarity[i].toString())
                        eyesUrl.push(url[i].toString());
                        break;
    
                    case "Head":
                        head.push(trait[i].toString());
                        headFrequency.push(rarity[i].toString())
                        headUrl.push(url[i].toString());
                        break;
    
                    case "Misc":
                        misc.push(trait[i].toString());
                        miscFrequency.push(rarity[i].toString())
                        miscUrl.push(url[i].toString());
                        break;
    
                    case "Neck":
                        neck.push(trait[i].toString());
                        neckFrequency.push(rarity[i].toString())
                        neckUrl.push(url[i].toString());
                        break;
    
                    case "Tails":
                        tail.push(trait[i].toString());
                        tailFrequency.push(rarity[i].toString())
                        tailUrl.push(url[i].toString());
                        break;
                }
            }
    
            if (arms.length === 0 || ears.length === 0 || eyes.length === 0 || head.length === 0
                || neck.length === 0 || tail.length === 0){
                    try {
                        await interaction.reply({content: "I don't have enough information from " + specie + "s to generate anything yet."})
                    } catch (err) {
                        await channel.send({content: `${member.user} I don't have enough information from ` + specie + "s to generate anything yet."})
                    }
                    return;
            }
    
     
            const randomArms = Math.floor(Math.random() * arms.length);
            const randomEars = Math.floor(Math.random() * ears.length);
            const randomEyes = Math.floor(Math.random() * eyes.length);
            const randomHead = Math.floor(Math.random() * head.length);
            const randomMisc = Math.floor(Math.random() * misc.length);
            const randomNeck = Math.floor(Math.random() * neck.length);
            const randomTail = Math.floor(Math.random() * tail.length); 
    
            const Embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle("Traits for " + member.user.tag + "'s " + specie)
                .addFields([
                    { name: `Trait 1`, value: arms[randomArms] },
                    { name: `Type`, value: "Arms" },
                    { name: `Rarity`, value: armsFrequency[randomArms] },
                    { name: `URL`, value: armsUrl[randomArms] },
                ])
                .setThumbnail(armsUrl[randomArms]);
    
            const Embed2 = new EmbedBuilder()
                .setColor(0x3498db)
                .addFields([
                    { name: `Trait 2`, value: ears[randomEars] },
                    { name: `Type`, value: "Ears" },
                    { name: `Rarity`, value: earsFrequency[randomEars] },
                    { name: `URL`, value: earsUrl[randomEars] },
                ])
                .setThumbnail(earsUrl[randomEars]);
    
            const Embed3 = new EmbedBuilder()
                .setColor(0x3498db)
                .addFields([
                    { name: `Trait 3`, value: eyes[randomEyes] },
                    { name: `Type`, value: "Eyes" },
                    { name: `Rarity`, value: eyesFrequency[randomEyes] },
                    { name: `URL`, value: eyesUrl[randomEyes] },
                ])
                .setThumbnail(eyesUrl[randomArms]);
    
            const Embed4 = new EmbedBuilder()
                .setColor(0x3498db)
                .addFields([
                    { name: `Trait 4`, value: head[randomHead] },
                    { name: `Type`, value: "Head" },
                    { name: `Rarity`, value: headFrequency[randomHead] },
                    { name: `URL`, value: headUrl[randomHead] },
                ])
                .setThumbnail(headUrl[randomHead]);
    
            const Embed5 = new EmbedBuilder()
                .setColor(0x3498db)
                .addFields([
                    { name: `Trait 5`, value: neck[randomNeck] },
                    { name: `Type`, value: "Neck" },
                    { name: `Rarity`, value: neckFrequency[randomNeck] },
                    { name: `URL`, value: neckUrl[randomNeck] },
                ])
                .setThumbnail(neckUrl[randomNeck]);
    
            const Embed6 = new EmbedBuilder()
                .setColor(0x3498db)
                .addFields([
                    { name: `Trait 6`, value: tail[randomTail] },
                    { name: `Type`, value: "Tail" },
                    { name: `Rarity`, value: tailFrequency[randomTail] },
                    { name: `URL`, value: tailUrl[randomTail] },
                ])
                .setThumbnail(tailUrl[randomTail]);
    
            const Embed7 = new EmbedBuilder()
            try{
                Embed7.setColor(0x3498db)
                Embed7.addFields([
                    { name: `Trait 7`, value: misc[randomMisc] },
                    { name: `Type`, value: "Misc" },
                    { name: `Rarity`, value: miscFrequency[randomMisc] },
                    { name: `URL`, value: miscUrl[randomMisc] },
                ])
                Embed7.setThumbnail(miscUrl[randomMisc]);
            }catch (err) {
                
            }
    
            if (armsFrequency[randomArms] != "Common" && earsFrequency[randomEars] != "Common" && eyesFrequency[randomEyes] != "Common"
            && headFrequency[randomHead] != "Common" && neckFrequency[randomNeck] != "Common" && tailFrequency [randomTail] != "Common"){
                try {
                    await interaction.reply({embeds: [Embed, Embed2, Embed3, Embed4, Embed5, Embed6, Embed7] })
                } catch (err) {
                    await channel.send({embeds: [Embed, Embed2, Embed3, Embed4, Embed5, Embed6, Embed7] })
                }
            }
            else{
                try {
                    await interaction.reply({embeds: [Embed, Embed2, Embed3, Embed4, Embed5, Embed6] })
                } catch (err) {
                    await channel.send({embeds: [Embed, Embed2, Embed3, Embed4, Embed5, Embed6] })
                }
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "The database is probably offline."});
        }
    }
}