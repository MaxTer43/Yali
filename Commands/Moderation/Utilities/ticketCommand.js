const {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    CommandInteraction,
    PermissionsBitField,
} = require("discord.js");
const{ OpenTicket } = require("../../../Structures/config.json");

module.exports = {
    name: "ticketbutton",
    description: "Setup your ticket message.",
    permission: PermissionsBitField.Administrator,
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction){
        const { guild } = interaction;
        let author = {
            name: "Ticket system",
            icon: guild.iconURL({ dynamic: true})
        }
        const Embed = new EmbedBuilder()
        .setAuthor(author)
        .setDescription(
            "Open a ticket to talk to the staff."
        )
        .setColor(0x57f288);

        const Buttons = new ActionRowBuilder();
        Buttons.addComponents(
            new ButtonBuilder()
            .setCustomId("support-ticket")
            .setLabel("Ticket")
            .setStyle("Primary")
        )
        return await guild.channels.cache.get(OpenTicket).send({ embeds: [Embed], components: [Buttons]});
    }
}