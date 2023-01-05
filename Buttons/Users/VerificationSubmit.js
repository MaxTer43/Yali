const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = {
    id: "Verification-submit",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client){
        const modal = new Modal()
          .setCustomId("verification-modal")
          .setTitle("Verification process")
          .addComponents(
            new TextInputComponent()
              .setCustomId("q1-modal")
              .setLabel("Where did you find this server?")
              .setStyle("SHORT")
              .setMinLength(1)
              .setMaxLength(100)
              .setPlaceholder("Server name, website, someone on Discord, etc")
              .setRequired(true),

            new TextInputComponent()
              .setCustomId("q2-modal")
              .setLabel("Why would you like to be in this server?")
              .setStyle("LONG")
              .setMinLength(1)
              .setMaxLength(500)
              .setPlaceholder("Write an answer.")
              .setRequired(true),

            new TextInputComponent()
              .setCustomId("q3-modal")
              .setLabel("How old are you? Age range is valid too.")
              .setStyle("SHORT")
              .setMinLength(1)
              .setMaxLength(45)
              .setPlaceholder("Examples: 15 or 20-30.")
              .setRequired(true),

            new TextInputComponent()
              .setCustomId("q4-modal")
              .setLabel("Are you into Closed Species?")
              .setStyle("LONG")
              .setMinLength(1)
              .setMaxLength(500)
              .setPlaceholder("If so, what you expect from Rinjacs?")
              .setRequired(true),

            new TextInputComponent()
              .setCustomId("q5-modal")
              .setLabel("Have you read the rules?")
              .setStyle("SHORT")
              .setMinLength(1)
              .setMaxLength(6)
              .setPlaceholder("Enter the password.")
              .setRequired(true)
          );
        showModal(modal, {
            client: client,
            interaction: interaction,
        });
    },
};