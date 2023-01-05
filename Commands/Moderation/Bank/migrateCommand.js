const {
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/bank");
const auctionsDb = require("../../../Structures/Schemas/auction");
const { AuctionsId } = require("../../../Structures/config.json");

module.exports = {
    name: "migrate",
    description: "Migrates from a bank account to another",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "originid",
            description: "User id",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "destinyid",
            description: "User id",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const originId = interaction.options.getString('originid');
        const destinyId = interaction.options.getString('destinyid');
        if (originId == destinyId) return interaction.reply({content: "The IDs cannot be the same.", ephemeral: true})
        const { guild } = interaction;
        const oldUser = guild.members.cache.get(originId);
        const newUser = guild.members.cache.get(destinyId);
        originExists = DB.find({ user_id: originId });
        destinyExists = DB.find({ user_id: originId });
        let cash = [];
        let bank = [];
        let bid_amount = [];
        if (originExists == true){
            if (!destinyExists){
                DB.findOneAndUpdate(
                    {user_id: originId},
                    {user_id: destinyId}
                )
            }
            else{
                const doc = DB.find(
                    {user_id: destinyId},
                    {cash: true, bank: true, bid_amount: true}
                )
                doc.forEach((t) => cash.push(t.cash));
                doc.forEach((t) => bank.push(t.bank));
                doc.forEach((t) => bid_amount.push(t.bid_amount));

                DB.findOneAndUpdate(
                    {user_id: destinyId},
                    {$inc:{cash: cash[0], bank: bank[0], bid_amount: bid_amount[0]}}
                )
                DB.findOneAndDelete(
                    {user_id: originId}
                )
                let auction_id = [];
                let sb = [];
                let mi = [];
                let ab = [];
                let starting_date = [];
                let expiration_date = [];
                let image = [];
                let description = [];
                let currency = [];
                let cb = [];
                let highest_bidder = [];
                let message_id = [];

                const auctionDoc = auctionsDb.updateMany(
                    {highest_bidder: originId},
                    {highest_bidder: destinyId}
                )
                const updatedAuctionDoc = auctionsDb.find(
                    {highest_bidder: destinyId},
                    {
                        auction_id: true,
                        sb: true,
                        mi: true,
                        ab: true,
                        starting_date: true,
                        expiration_date: true,
                        image: true,
                        description: true,
                        currency: true,
                        cb: true,
                        message_id: true}
                )
                auctionDoc.forEach((t) => highest_bidder.push(t.highest_bidder.toString()));
                updatedAuctionDoc.forEach((t) => auction_id.push(t.auction_id.toString()),);
                updatedAuctionDoc.forEach((t) => sb.push(t.sb.toString()),);
                updatedAuctionDoc.forEach((t) => mi.push(t.mi.toString()),);
                updatedAuctionDoc.forEach((t) => ab.push(t.ab.toString()),);
                updatedAuctionDoc.forEach((t) => starting_date.push(t.starting_date.toString()),);
                updatedAuctionDoc.forEach((t) => expiration_date.push(t.expiration_date.toString()),);
                updatedAuctionDoc.forEach((t) => url.push(t.image.toString()),);
                updatedAuctionDoc.forEach((t) => description.push(t.description.toString()),);
                updatedAuctionDoc.forEach((t) => currency.push(t.currency.toString()),);
                updatedAuctionDoc.forEach((t) => cb.push(t.cb.toString()),);
                updatedAuctionDoc.forEach((t) => highest_bidder.push(t.highest_bidder.toString()),);

                for (var i = 0; i < highest_bidder.length; i++){
                    const Embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle("A new auction arrived!")
                    .setDescription("To bid, go to <#" + BotCmds + "> and type /bid " + auction_id[0].toString() + " [Amount]")
                    .addFields([
                        { name: `ID`, value: auction_id[i] },
                        { name: `Description`, value: description[i] },
                        { name: `SB`, value: sb[i], inline: true },
                        { name: `MI`, value: mi[i], inline: true },
                        { name: `AB`, value: ab[i], inline: true },
                        { name: `Starting date`, value: `<t:${Math.floor(starting_date[0].getTime()/1000)}>` },
                        { name: `Expiration date`, value: `<t:${Math.floor(expiration_date[0].getTime()/1000)}> (<t:${Math.floor(expiration_date[0].getTime()/1000)}:R>)` },
                        { name: `Currency`, value: currency[0] },
                        { name: `CB`, value: cb[i] },
                        { name: `Highest bidder`, value: highest_bidder[i] },
                        { name: `URL`, value: url[i] },
                    ])
                    .setImage(url[i]);
            
                    message = guild.channels.cache.get(AuctionsId).messages.fetch(message_id[i]).then((msg) => {
                        msg.edit({embeds: [Embed]});
                    });
                }
            }
            return interaction.reply({content: "Bank account migrated from " + `${oldUser}`+ " to " + `${newUser}`});
        }
        else
            return interaction.reply({content: "I cannot find the origin ID on the database.", ephemeral: true});
    }
}