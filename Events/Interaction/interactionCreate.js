const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client){
        if(interaction.type === InteractionType.ApplicationCommand){
            const command = client.commands.get(interaction.commandName);

            if(!command) return
            command.execute(interaction,client)
        }
    } 
}