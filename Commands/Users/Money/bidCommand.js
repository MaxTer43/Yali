const {
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const dbAuction = require("../../../Structures/Schemas/auction");
const dbBank = require("../../../Structures/Schemas/bank");
const { AuctionsId } = require("../../../Structures/config.json");
const { BotCmds } = require("../../../Structures/config.json");
const { Yis } = require("../../../Structures/config.json");

module.exports = {
    name: "bid",
    description: "Bid on an auction",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "id",
            description: "Auction id",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "amount",
            description: "Amount of money",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { guild } = interaction;
        
        try {
            const id = interaction.options.getNumber('id');
            const amount = interaction.options.getNumber('amount');
            const selfId = interaction.member.user.id;
            const selfUser = guild.members.cache.get(selfId);
        
            var auctionChannel = guild.channels.cache.get(AuctionsId);
            var message;
            if (amount <= 0 || amount % 1 != 0)
                return interaction.reply({content: "Invalid amount"});

            var date = Date.now();
            idExists = await dbAuction.exists({auction_id: id, starting_date: {$lte: date}});
            if (!idExists){
                return interaction.reply({content: "The id does not exist or the auction has not been posted yet.", ephemeral: true});
            }
            idExists = await dbBank.exists({user_id: selfId});
            if (!idExists){
                await dbBank.create({
                    user_id: selfId,
                    cash: 0,
                    bank: 0,
                    bid_amount: 0
                });
                console.log("Created bank account with id " + selfId);
            }
            const docAuction = await dbAuction.find({
                auction_id: id,
            }, {
                sb: true,
                mi: true,
                ab: true,
                starting_date: true,
                expiration_date: true,
                image: true,
                description: true,
                currency: true,
                cb: true,
                highest_bidder: true,
                message_id: true
            })

            let sb = [];
            let mi = [];
            let ab = [];
            let starting_date = [];
            let expiration_date = [];
            let url = [];
            let description = [];
            let currency = [];
            let cb = [];
            let highest_bidder = []
            let message_id = [];

            docAuction.forEach((t) =>
                sb.push(t.sb),
            );
            docAuction.forEach((t) =>
                mi.push(t.mi)
            );
            docAuction.forEach((t) =>
                ab.push(t.ab)
            );
            docAuction.forEach((t) =>
                starting_date.push(t.starting_date)
            );
            docAuction.forEach((t) =>
                expiration_date.push(t.expiration_date)
            );
            docAuction.forEach((t) =>
                url.push(t.image.toString())
            );
            docAuction.forEach((t) =>
                description.push(t.description.toString())
            );
            docAuction.forEach((t) =>
                currency.push(t.currency.toString())
            );
            docAuction.forEach((t) =>
                cb.push(t.cb)
            );
            docAuction.forEach((t) =>
                highest_bidder.push(t.highest_bidder.toString())
            );
            docAuction.forEach((t) =>
                message_id.push(t.message_id.toString())
            );

            let bank = [];
            let bid_amount = [];

            const docBank = await dbBank.find({
                user_id: selfId,
            }, {
                bank: true,
                bid_amount: true
            })
            docBank.forEach((t) =>
                bank.push(t.bank),
            );
            docBank.forEach((t) =>
                bid_amount.push(t.bid_amount),
            );
            if (currency[0] == Yis){
                if (bank[0] < amount)
                    return interaction.reply({content: "No enough money in the bank", ephemeral: true});
            }

            if (amount >= ab[0]){
                const Embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle("This auction has ended")
                    .addFields([
                        { name: `ID`, value: id.toString() },
                        { name: `Description`, value: description[0] },
                        { name: `SB`, value: sb[0].toString(), inline: true },
                        { name: `MI`, value: mi[0].toString(), inline: true },
                        { name: `AB`, value: ab[0].toString(), inline: true },
                        { name: `Starting date`, value: `<t:${Math.floor(starting_date[0].getTime()/1000)}>` },
                        { name: `Expiration date`, value: `<t:${Math.floor(expiration_date[0].getTime()/1000)}> (<t:${Math.floor(expiration_date[0].getTime()/1000)}:R>)` },
                        { name: `Currency`, value: currency[0] },
                        { name: `CB`, value: ab[0].toString() },
                        { name: `Winner`, value: selfUser.toString() },
                        { name: `URL`, value: url[0] },
                    ])
                    .setImage(url[0]);
                message = guild.channels.cache.get(AuctionsId).messages.fetch(message_id[0]).then((msg) => {
                    msg.edit({embeds: [Embed]});
                });
                await dbBank.findOneAndUpdate(
                    {user_id: selfId},
                    {$inc:{bank: -ab[0]}}
                )
                await dbAuction.findOneAndRemove(
                    {auction_id: id}
                )
                if (highest_bidder[0] != "None"){
                    await dbBank.findOneAndUpdate(
                        {user_id: highest_bidder[0]},
                        {$inc:{bank: cb[0], bid_amount: -cb[0]}}
                    )
                }
                return interaction.reply({content: "You won the auction!", ephemeral: false});
            }
            if (amount < sb[0] && cb[0] == 0){
                return interaction.reply({content: "You cannot bid less than " + currency[0] + sb[0].toString() + " for this auction.", ephemeral: true});
            }
            if (amount - cb[0] < mi[0]){
                return interaction.reply({content: "The minimum increment (MI) for this auction can't be less than " + currency[0] + mi[0].toString(), ephemeral: true});
            }
            await dbBank.findOneAndUpdate(
                {user_id: selfId},
                {$inc:{bank: -amount, bid_amount: amount}}
            )
            if (highest_bidder[0] != "None"){
                await dbBank.findOneAndUpdate(
                    {user_id: highest_bidder[0]},
                    {$inc:{bank: cb[0], bid_amount: -cb[0]}}
                )
            }
            await dbAuction.findOneAndUpdate(
                {auction_id: id},
                {$set:{cb: amount, highest_bidder: selfId}}
            )

            const opponentUser = guild.members.cache.get(highest_bidder[0]);
            if (opponentUser == null)
                await interaction.reply({content: `${selfUser}` + " has the first bid for auction " + id.toString() + "!"});
            else
                await interaction.reply({content: `${selfUser}` + " placed an offer higher than " + `${opponentUser}` + "'s" + " for auction " + id.toString() + "!"});
        
            const Embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle("A new auction arrived!")
                .setDescription("To bid, go to <#" + BotCmds + "> and type /bid " + id.toString() + " [Amount]")
                .addFields([
                    { name: `ID`, value: id.toString() },
                    { name: `Description`, value: description[0] },
                    { name: `SB`, value: sb[0].toString(), inline: true },
                    { name: `MI`, value: mi[0].toString(), inline: true },
                    { name: `AB`, value: ab[0].toString(), inline: true },
                    { name: `Starting date`, value: `<t:${Math.floor(starting_date[0].getTime()/1000)}>` },
                    { name: `Expiration date`, value: `<t:${Math.floor(expiration_date[0].getTime()/1000)}> (<t:${Math.floor(expiration_date[0].getTime()/1000)}:R>)` },
                    { name: `Currency`, value: currency[0] },
                    { name: `CB`, value: amount.toString() },
                    { name: `Highest bidder`, value: selfUser.toString() },
                    { name: `URL`, value: url[0] },
                ])
                .setImage(url[0]);
            message = guild.channels.cache.get(AuctionsId).messages.fetch(message_id[0]).then((msg) => {
                msg.edit({embeds: [Embed]});
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}