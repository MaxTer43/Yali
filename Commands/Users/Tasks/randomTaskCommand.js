const {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    CommandInteraction,
    Client,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/task");

module.exports = {
    name: "task",
    description: "Shows random task",
    //permission: "ADMINISTRATOR",
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const doc = await DB.find({}, {_id: false, task: true});
            if (doc == null){
                return interaction.reply("The list is empty.");
            }

            let list = [];
            let listing = [];
            doc.forEach((t) =>
                list.push(t.task.toString()),
            );
            for (var i = 0; i < list.length; i++){
                listing[i] = i + ". " + list[i];
            }
            const random = Math.floor(Math.random() * list.length);
            const Embed = new EmbedBuilder()
            .setColor("BLACK")
            .setTitle("Task!")
            .setDescription(list[random]);

        return await interaction.reply({ embeds: [Embed]});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "The database is probably offline."});
        }
    }
}