const {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/auction");

module.exports = {
    name: "auctionslist",
    description: "Shows list of auctions",
    permission: PermissionsBitField.Administrator,
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { channel } = interaction;
        const doc = await DB.find({}, {_id: false, auction_id: true, sb: true, mi: true, ab: true, starting_date: true, expiration_date: true, image: true, description: true, currency: true, cb: true, highest_bidder: true});
        if (doc == null || doc.length == 0)
            return interaction.reply("Nothing is here");

        let auction_id = [];
        let sb = [];
        let mi = [];
        let ab = [];
        let starting_date = [];
        let expiration_date = [];
        let url = [];
        let description = [];
        let currency = [];
        let cb = [];
        let highest_bidder = [];

        doc.forEach((t) => auction_id.push(t.auction_id.toString()));
        doc.forEach((t) => sb.push(t.sb.toString()));
        doc.forEach((t) => mi.push(t.mi.toString()));
        doc.forEach((t) => ab.push(t.ab.toString()));
        doc.forEach((t) => starting_date.push(t.starting_date.toString()));
        doc.forEach((t) => expiration_date.push(t.expiration_date.toString()));
        doc.forEach((t) => url.push(t.image.toString()));
        doc.forEach((t) => description.push(t.description.toString()));
        doc.forEach((t) => currency.push(t.currency.toString()));
        doc.forEach((t) => cb.push(t.cb.toString()));
        doc.forEach((t) => highest_bidder.push(t.highest_bidder.toString()));

        for (var i = 0; i < sb.length; i++){
            const Embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(i.toString())
                .addFields([
                    { name: `ID`, value: auction_id[i] },
                    { name: `Description`, value: description[i] },
                    { name: `SB`, value: sb[i], inline: true },
                    { name: `MI`, value: mi[i], inline: true },
                    { name: `AB`, value: ab[i], inline: true },
                    { name: `Starting date`, value: starting_date[i] },
                    { name: `Expiration date`, value: expiration_date[i] },
                    { name: `Currency`, value: currency[i] },
                    { name: `CB`, value: cb[i] },
                    { name: `Highest bidder`, value: highest_bidder[i] },
                    { name: `URL`, value: url[i] },
                ])
                .setImage(url[i]);

            try {
                await interaction.reply({embeds: [Embed] })
            } catch (err) {
                await channel.send({embeds: [Embed] })
            }
        }
        return;
    }
}