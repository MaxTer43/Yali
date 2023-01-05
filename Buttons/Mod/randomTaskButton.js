const {
    EmbedBuilder,
    CommandInteraction,
    showModal
  } = require("discord-modals");

const {
    PermissionsBitField,
} = require("discord.js");
  const DB = require("../../Structures/Schemas/task");
  
  module.exports = {
      id: "random-task",
      URL: "",
      /**
       * 
       * @param {CommandInteraction} interaction
       * @param {Client} client
       */
      async execute(interaction, client){
        if (!interaction.isButton()) return;
        const { guild, member, channel} = interaction;
  
        if (!member.permissions.has(PermissionsBitField.Administrator)) return;

        const doc = await DB.find({}, {_id: false, Task: true});
        if (doc == null){
            return interaction.reply("The list is empty.");
        }

        let list = [];
        let listing = [];
        doc.forEach((t) =>
            list.push(t.Task.toString()),
        );
        for (var i = 0; i < list.length; i++){
            listing[i] = i + ". " + list[i];
        }
        const random = Math.floor(Math.random() * list.length);
        return await guild.channels.cache.get(channel.id).send(list[random]);
      },
  };