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
      id: "member-reject",
      URL: "",
      /**
       * 
       * @param {CommandInteraction} interaction
       * @param {Client} client
       */
      async execute(interaction, client){
        if (!interaction.isButton()) return;
        const { guild, channel, member} = interaction;
        
        const User = guild.members.cache.get(channel.name)

        const modal = new Modal()
          .setCustomId("msg-kick-modal")
          .setTitle("Reason")
          .addComponents(
            new TextInputComponent()
              .setCustomId("msg-kick-modal-text")
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