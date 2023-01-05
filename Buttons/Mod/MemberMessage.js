const {
  Modal,
  TextInputComponent,
  showModal
} = require("discord-modals");
const {
  PermissionsBitField,
} = require("discord.js");

module.exports = {
    id: "member-message",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client){
      const { member} = interaction;
        const modal = new Modal()
          .setCustomId("msg-message-modal")
          .setTitle("Message")
          .addComponents(
            new TextInputComponent()
              .setCustomId("msg-message-modal-text")
              .setLabel("Write your message")
              .setStyle("LONG")
              .setMinLength(1)
              .setMaxLength(4000)
              .setRequired(true),
          );
        showModal(modal, {
            client: client,
            interaction: interaction,
        });
    },
};