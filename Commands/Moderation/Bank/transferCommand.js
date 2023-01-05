const {
    CommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/bank");

const { Yis } = require("../../../Structures/config.json");

module.exports = {
    name: "sendyis",
    description: "Sends yis",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "id",
            description: "User id",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "amount",
            description: "Amount",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const id = interaction.options.getString('id');
            const amount = interaction.options.getNumber('amount');
            if (amount <= 0) return interaction.reply("Invalid amount.");
            const { guild } = interaction;
            const User = guild.members.cache.get(id);
            console.log("Checking with id " + id);
            const idExists = await DB.exists({user_id: id});
            if (!idExists){
                await DB.create({
                    user_id: id,
                    cash: 0,
                    bank: 0,
                    bid_amount: 0
                });
                console.log("Created bank account with id " + id);
            }
            await DB.findOneAndUpdate(
                {user_id: id},
                {$inc:{bank: amount}}
            )
            console.log("Sent " + amount + " to id " + id);
            return interaction.reply({content: "Sent " + " " + Yis + amount + " to " + `${User}`});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}