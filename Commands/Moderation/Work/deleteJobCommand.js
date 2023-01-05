const {
    ApplicationCommandOptionType,
    CommandInteraction,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/job");

module.exports = {
    name: "deletejob",
    description: "Deletes a job",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "index",
            description: "Job index",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const indexNum = interaction.options.getInteger('index');
            if (indexNum < 0){
                return interaction.reply("Nothing is here.");
            }

            const doc = await DB.find({}, {_id: true, job: false});
            if (doc == null || indexNum >= doc.length){
                return interaction.reply("Nothing is here.");
            }
            let list = [];
            doc.forEach((t) =>
                list.push(t._id.toString()),
            );
            await DB.findByIdAndDelete({_id: list[indexNum].toString()});
            return await interaction.reply({content: "Job " + indexNum + " deleted"});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}