const {
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/bank");

const { Yis } = require("../../../Structures/config.json");

module.exports = {
    name: "withdraw",
    description: "Withdraw yis",
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
        const id = interaction.member.user.id;
        try {
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
            let bank = [];
            doc.forEach((t) =>
                bank.push(t.bank),
            );
            if (amount != null){
                if (amount %1 != 0 || amount <= 0) return await interaction.reply({content: "Invalid amount", ephemeral : true})
                if (amount > bank[0]) return await interaction.reply({content: "No enough money in the bank", ephemeral : true})
                await DB.findOneAndUpdate(
                    {user_id: id},
                    {$inc:{cash: amount, bank: -amount}}
                )
            }
            else{
                if (bank[0] == 0) return await interaction.reply({content: "No enough money in the bank", ephemeral : true})
                await DB.findOneAndUpdate(
                    {user_id: id},
                    {$inc:{cash: bank[0], bank: -bank[0]}}
                )
            }
            let author = {
                name: interaction.member.user.tag,
                avatar: interaction.member.user.displayAvatarURL({ dynamic : true, format: "png"})
            }
            var withdraw;
            if (amount == null) withdraw = bank[0];
            else withdraw = amount;
            const Embed = new EmbedBuilder()
            .setColor("BLACK")
            .setThumbnail(interaction.member.user.displayAvatarURL({ dynamic : true, format: "png"}))
            .setAuthor(author)
            .setDescription(":white_check_mark: Withdrawn " + Yis + withdraw.toString() + " from your bank!")
            interaction.reply({ embeds: [Embed]})
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}