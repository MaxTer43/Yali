const {
    CommandInteraction
} = require("discord.js");

module.exports = {
    name: "date",
    description: "Date Yali",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction){
        await interaction.reply("This is just a command to troll.");
    }
}