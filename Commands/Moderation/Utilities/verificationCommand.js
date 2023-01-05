const {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    CommandInteraction,
    PermissionsBitField,
} = require("discord.js");
const{ NewUser } = require("../../../Structures/config.json");

module.exports = {
    name: "verificationbutton",
    description: "Adds button to verify",
    permission: PermissionsBitField.Administrator,
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        const { guild, channel, member } = interaction
        const Embed = new EmbedBuilder()
        .setDescription('Remember to have your DMs enabled before clicking the "Verify" button to get started. Otherwise your application will not be sent.')
        .setColor(0x57f288);
        const row = new ActionRowBuilder();
        row.addComponents(
            new ButtonBuilder()
            .setCustomId("Verification-submit")
            .setLabel("Verify")
            .setStyle("Success")
        )
        return await guild.channels.cache.get(NewUser).send({ embeds: [Embed], components: [row]});
    }
}