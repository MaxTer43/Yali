const {
    CommandInteraction
} = require("discord.js");

module.exports = {
    name: "ping",
    description: "Ping",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction){
        await interaction.reply("It's working.");
    }
}