const {
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/bank");

const { Yis } = require("../../../Structures/config.json");

module.exports = {
    name: "balance",
    description: "Shows balance",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "id",
            description: "User id",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { client } = interaction;
        const selfId = interaction.member.user.id;
        const targetId = interaction.options.getString('id');
        var id;
        if (targetId == null) id = selfId;
        else id = targetId;
        const User = client.users.cache.get(id);
        idExists = await DB.exists({user_id: id});
        if (!idExists){
            await DB.create({
                user_id: id,
                cash: 0,
                bank: 0,
                bid_amount: 0
            });
            console.log("Created bank account with id " + id);
        }

        const doc = await DB.find({
                user_id: id,
            }, {
                cash: true,
                bank: true,
                bid_amount: true
            }
        )
        if (doc == null || doc.length == 0){
            return interaction.reply("Nothing is here.");
        }
        let list = [];
        let listing = [];
        
        let cash = [];
        let bank = [];
        let bid = [];
        doc.forEach((t) =>
            cash.push(t.cash),
        );
        doc.forEach((t) =>
            bank.push(t.bank),
        );
        doc.forEach((t) =>
            bid.push(t.bid_amount),
        );
        const total = cash[0] + bank[0];
        for (var i = 0; i < list.length; i++){
            listing[i] = i + ". " + list[i];
        }
        let author = {
            name: User.tag
        }
        const Embed = new EmbedBuilder()
        .setColor("BLACK")
        .setThumbnail(User.displayAvatarURL({ dynamic : true, format: "png"}))
        .setAuthor(author)
        .addFields([
            { name: `Cash: `, value: Yis + cash[0].toString(), inline: true },
            { name: `Bank: `, value: Yis + bank[0].toString(), inline: true },
            { name: `Total: `, value: Yis + total.toString(), inline: true },
            { name: `Bidding: `, value: Yis + bid[0].toString(), inline: true },
        ])
        interaction.reply({ embeds: [Embed]})
    }
}