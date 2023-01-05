const {
    ApplicationCommandOptionType,
    CommandInteraction,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/auction");

module.exports = {
    name: "deleteauction",
    description: "Deletes an auction",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "index",
            description: "Auction index",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const indexNum = interaction.options.getInteger('index');
        if (indexNum < 0){
            return interaction.reply("Nothing is here.");
        }

        const doc = await DB.find({}, {_id: true, auction_id: false, sb: false, mi: false, ab: false, starting_date: false, expiration_date: false, image: false, description: false, currency: false, cb: false, highest_bidder: false});
        if (doc == null || indexNum >= doc.length){
            return interaction.reply("Nothing is here.");
        }
        let list = [];
        doc.forEach((t) =>
            list.push(t._id.toString()),
        );
        await DB.findByIdAndDelete({_id: list[indexNum].toString()});
        await interaction.reply({content: "Auction " + indexNum + " deleted"});
    }
}