const { Client, Collection, EmbedBuilder } = require("discord.js");
const client = new Client({intents: 131071});
const discordModals = require("discord-modals");
discordModals(client);

const { Token } = require("./config.json");
const { BumpChannel } = require("./config.json");
const { BumpRole } = require("./config.json");
const { StaffCMD } = require("./config.json");
const { QOTD } = require("./config.json");
const { QOTDBot } = require("./config.json");
const { QOTDRole } = require("./config.json");
const { DisboardBot } = require("./config.json");
const { AuctionsId } = require("./config.json");
const { BotCmds } = require("./config.json");

const { promisify } = require("util")
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();
client.buttons = new Collection();
client.filters = new Collection();
client.filtersLog = new Collection();
client.voiceGenerator = new Collection();

client.commands = new Collection();

const auctionDB = require("../Structures/Schemas/auction.js");
const scheduleDB = require("../Structures/Schemas/schedule.js");
const bankDB = require("../Structures/Schemas/bank");

["Events", "Commands", "Buttons"].forEach((handler) => {
    require(`./Handlers/${handler}`)(client, PG, Ascii)
})
client.on("ready", async () =>{
    let timer = setInterval(async function() {
        try {
            var time;
            let guild = client.guilds.cache.first()
            var bumpRole = guild.roles.cache.get(BumpRole);
            time = new Date();
            scheduleExists = await scheduleDB.exists({starting_date: {$lte: time}});
            if (scheduleExists){
                await guild.channels.cache.get(BumpChannel).send(`Time to bump, ${bumpRole}`);
                await scheduleDB.findOneAndDelete(
                    {starting_date: {$lte: time}}
                )
            }
            nonPostedAuctionExists = await auctionDB.exists({starting_date: {$lte: time}, posted: false});
            if (nonPostedAuctionExists){
                const doc = await auctionDB.find({starting_date: {$lte: time}, posted: 0}, {_id: false, auction_id: true, sb: true, mi: true, ab: true, starting_date: true, expiration_date: true, image: true, description: true, currency: true, cb: true, highest_bidder: true, posted: true});
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
                doc.forEach((t) => auction_id.push(t.auction_id.toString()),);
                doc.forEach((t) => sb.push(t.sb.toString()),);
                doc.forEach((t) => mi.push(t.mi.toString()),);
                doc.forEach((t) => ab.push(t.ab.toString()),);
                doc.forEach((t) => starting_date.push(t.starting_date.toString()),);
                doc.forEach((t) => expiration_date.push(t.expiration_date.toString()),);
                doc.forEach((t) => url.push(t.image.toString()),);
                doc.forEach((t) => description.push(t.description.toString()),);
                doc.forEach((t) => currency.push(t.currency.toString()),);
                doc.forEach((t) => cb.push(t.cb.toString()),);
                doc.forEach((t) => highest_bidder.push(t.highest_bidder.toString()),);
                const Embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle("A new auction arrived!")
                    .setDescription("To bid, go to <#" + BotCmds + "> and type /bid " + auction_id[0].toString() + " [Amount]")
                    .addFields([
                        { name: `ID`, value: auction_id[0] },
                        { name: `Description`, value: description[0] },
                        { name: `SB`, value: sb[0], inline: true },
                        { name: `MI`, value: mi[0], inline: true },
                        { name: `AB`, value: ab[0], inline: true },
                        { name: `Starting date`, value: `<t:${Math.floor(starting_date[0].getTime()/1000)}>` },
                        { name: `Expiration date`, value: `<t:${Math.floor(expiration_date[0].getTime()/1000)}> (<t:${Math.floor(expiration_date[0].getTime()/1000)}:R>)` },
                        { name: `Currency`, value: currency[0] },
                        { name: `CB`, value: cb[0] },
                        { name: `Highest bidder`, value: highest_bidder[0] },
                        { name: `URL`, value: url[0] },
                    ])
                    .setImage(url[0]);
            
                let sent = await guild.channels.cache.get(AuctionsId).send({embeds: [Embed]});
                await auctionDB.findOneAndUpdate(
                    {auction_id: auction_id[0]},
                    {$set:{posted: true, message_id: sent.id}}
                )
            }
            PostedAuctionExists = await auctionDB.exists({expiration_date: {$lte: time}, posted: true});
            if (PostedAuctionExists){
                const doc = await DB.find({expiration_date: {$lte: time}, posted: 1}, {auction_id: true, sb: true, mi: true, ab: true, starting_date: true, expiration_date: true, image: true, description: true, currency: true, cb: true, highest_bidder: true, posted: false});
                let auction_id = [];
                let sb = [];
                var mi = [];
                let ab = [];
                let starting_date = [];
                let expiration_date = [];
                let url = [];
                let description = [];
                let currency = [];
                let cb = [];
                let highest_bidder = [];

                doc.forEach((t) => auction_id.push(t.auction_id.toNumber()));
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

                if (highest_bidder[0] != "None"){
                    await dbAuction.findOneAndDelete(
                        {auction_id: auction_id[0]},
                    )
                    await bankDB.findOneAndUpdate(
                        {user_id: highest_bidder[0]},
                        {$inc:{bid_amount: -cb[0]}}
                    )
                }
                const Embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle("This auction has ended")
                    .addFields([
                        { name: `ID`, value: auction_id[0].toString() },
                        { name: `Description`, value: description[0] },
                        { name: `SB`, value: sb[0], inline: true },
                        { name: `MI`, value: mi[0], inline: true },
                        { name: `AB`, value: ab[0], inline: true },
                        { name: `Starting date`, value: `<t:${Math.floor(starting_date[0].getTime()/1000)}>` },
                        { name: `Expiration date`, value: `<t:${Math.floor(expiration_date[0].getTime()/1000)}> (<t:${Math.floor(expiration_date[0].getTime()/1000)}:R>)` },
                        { name: `Currency`, value: currency[0] },
                        { name: `CB`, value: cb[0] },
                        { name: `Winner`, value: highest_bidder[0] },
                        { name: `URL`, value: url[0] },
                    ])
                    .setImage(url[0]);
            
                message = guild.channels.cache.get(AuctionsId).messages.fetch(message_id[0]).then((msg) => {
                    msg.edit({embeds: [Embed]});
                });
                await guild.channels.cache.get(AuctionsId).send({embeds: [Embed]});
            }
        } catch (error) {
            //console.error(error);
        }
    }, 1*1000);
})
client.on("messageCreate", async message => {
    if(message.channel.id === QOTD && message.author.id === QOTDBot || message.content.includes(".....") && message.channel.id === QOTD){
        var role = message.guild.roles.cache.get(QOTDRole);
        message.channel.send(`${role}`);
    }
    if (message.channel.id === BumpChannel && message.author.id === DisboardBot){
            console.log("Adding bump reminder");
            var now = new Date();
            now.setHours(now.getHours() + 2);
            now.setMilliseconds(0);
            console.log(now);
        try {
            await scheduleDB.create({
                date: now,
                content: " ",
                channelId: BumpChannel,
                bump: 1
            });
            message.guild.channels.cache.get(BumpChannel).send(`Thanks for bumping our Server! We'll remind you to bump again in 2 hours!`);
            console.log("Added bump reminder");
        } catch (err) {
            console.log(err);
            message.guild.channels.cache.get(StaffCMD).send(`An error has ocurred while attempting to add the bump reminder`);
        }
    }
});

client.login(Token);