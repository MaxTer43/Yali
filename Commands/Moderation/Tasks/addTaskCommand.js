const {
    CommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/task");

module.exports = {
    name: "addtask",
    description: "Adds task",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "task",
            description: "Task",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const Text = interaction.options.getString('task');
        console.log("Task added: " + Text);
        
        try {
            await DB.create({
                task: Text,
                type: "Task"
            });
            return await interaction.reply({content: "Task added"});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "The database is probably offline."});
        }
    }
}