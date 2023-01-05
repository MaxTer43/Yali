const {
    CommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/job");

module.exports = {
    name: "addjob",
    description: "Adds job",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "job",
            description: "Job",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const text = interaction.options.getString('job');
            console.log("Job added: " + text);
        
            await DB.create({
                job: text
            });
            return await interaction.reply({content: "Job added.", ephemeral: false})
        } catch (error) {
            console.error(error);
            return await interaction.reply({content: "The database is probably offline.", ephemeral: false})
        }
    }
}