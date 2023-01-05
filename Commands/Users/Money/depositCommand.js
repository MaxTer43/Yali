const {
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/bank");

const { Yis } = require("../../../Structures/config.json");

module.exports = {
    name: "deposit",
    description: "Deposit yis to the bank",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "amount",
            description: "Amount of money",
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const id = interaction.member.user.id;
            const idExists = await DB.exists({user_id: id});
            if (!idExists) return await interaction.reply({content: "You don't have a bank account", ephemeral : true})
            const doc = await DB.find({ },
                { 
                    user_id: id,
                    _id: false,
                    cash: true,
                    bank: true
                }
            )
            const amount = interaction.options.getNumber('amount');
            let cash = [];
            doc.forEach((t) =>
                cash.push(t.cash),
            );
            if (amount != null){
                if (amount %1 != 0 || amount <= 0) return await interaction.reply({content: "Invalid amount", ephemeral : true})
                if (amount > cash[0]) return await interaction.reply({content: "No enough cash", ephemeral : true})
                await DB.findOneAndUpdate(
                    {user_id: id},
                    {$inc:{cash: -amount, bank: amount}}
                )
            }
            else{
                if (cash[0] == 0) return await interaction.reply({content: "No enough cash", ephemeral : true})
                await DB.findOneAndUpdate(
                    {user_id: id},
                    {$inc:{cash: -cash[0], bank: cash[0]}}
                )
            }
            let author = {
                name: interaction.member.user.tag,
                avatar: interaction.member.user.displayAvatarURL({ dynamic : true, format: "png"})
            }
            var deposit;
            if (amount == null) deposit = cash[0];
            else deposit = amount;
            const Embed = new EmbedBuilder()
            .setColor("BLACK")
            .setThumbnail(interaction.member.user.displayAvatarURL({ dynamic : true, format: "png"}))
            .setAuthor(author)
            .setDescription(":white_check_mark: Deposited " + Yis + deposit.toString() + " to your bank!")
            interaction.reply({ embeds: [Embed]})
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}