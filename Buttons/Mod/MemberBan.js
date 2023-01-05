const {
    Modal,
    EmbedBuilder,
    TextInputComponent,
    showModal
  } = require("discord-modals");

const {
    PermissionsBitField,
  } = require("discord.js");
  
  module.exports = {
      id: "member-ban",
      URL: "",
      /**
       * 
       * @param {CommandInteraction} interaction
       * @param {Client} client
       */
      async execute(interaction, client){
        if (!interaction.isButton()) return;
        const { guild, channel } = interaction;
  
        const User = guild.members.cache.get(channel.name)

        const modal = new Modal()
          .setCustomId("msg-ban-modal")
          .setTitle("Reason")
          .addComponents(
            new TextInputComponent()
              .setCustomId("msg-ban-modal-text")
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