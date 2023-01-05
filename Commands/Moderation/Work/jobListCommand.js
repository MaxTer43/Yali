const {
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/job");
const DB_bank = require("../../../Structures/Schemas/bank");

module.exports = {
    name: "joblist",
    description: "Shows list of jobs",
    permission: PermissionsBitField.Administrator,
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const doc = await DB.find({}, {_id: false, job: true});
            if (doc == null || doc.length == 0){
                return interaction.reply("Nothing is here.");
            }
            let list = [];
            let listing = [];
            doc.forEach((t) =>
                list.push(t.job.toString()),
            );
            for (var i = 0; i < list.length; i++){
                listing[i] = i + ". " + list[i];
            }
            var full = listing.join('\n')
            const Embed = new EmbedBuilder()
            .setColor("BLACK")
            .setTitle("All jobs")
            .setDescription(full);
            interaction.reply({ embeds: [Embed]})
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "The database is probably offline."});
        }
    }
}